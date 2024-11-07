import { Vector3 } from 'three';
import { PlatformEdges } from '../types/platform.types';
import { DebugPoint, DebugLine, PathDebugInfo } from './pipeDebug';

// Constants for geometric calculations
const HALF_PI = Math.PI / 2;
const SEGMENTS_PER_QUARTER = 8; // For smooth quarter-circle arcs

interface ElbowConfig {
  startPoint: Vector3;
  endPoint: Vector3;
  radius: number;
  orientation: 'horizontal' | 'vertical';
  direction: 1 | -1; // 1 for clockwise, -1 for counter-clockwise
}

interface PlatformConnection {
  start: Vector3;
  end: Vector3;
  startPlatform: PlatformEdges;
  endPlatform: PlatformEdges;
}

// Add new interfaces for path analysis
interface PathConstraints {
  minVerticalSpace: number;
  minHorizontalSpace: number;
  maxTurnAngle: number;
  preferredClearance: number;
}

interface PathAnalysis {
  routingType: 'direct' | 'edge-wrap' | 'underside' | 'compound';
  constraints: PathConstraints;
  clearanceViolations: boolean;
  turnAngles: number[];
  segmentLengths: number[];
  totalLength: number;
  debugInfo: PathDebugInfo;
}

// Helper to create a quarter-circle arc
const createElbowArc = (config: ElbowConfig): Vector3[] => {
  const { startPoint, radius, orientation, direction } = config;
  const points: Vector3[] = [];
  
  // Calculate center point of the arc based on orientation
  const center = new Vector3();
  if (orientation === 'horizontal') {
    center.set(
      startPoint.x + (direction * radius),
      startPoint.y,
      startPoint.z
    );
  } else {
    center.set(
      startPoint.x,
      startPoint.y + (direction * radius),
      startPoint.z
    );
  }

  // Generate arc points
  for (let i = 0; i <= SEGMENTS_PER_QUARTER; i++) {
    const t = (i / SEGMENTS_PER_QUARTER) * HALF_PI;
    const point = new Vector3();
    
    if (orientation === 'horizontal') {
      point.set(
        center.x - (direction * Math.cos(t) * radius),
        center.y + (direction * Math.sin(t) * radius),
        center.z
      );
    } else {
      point.set(
        center.x + (direction * Math.sin(t) * radius),
        center.y - (direction * Math.cos(t) * radius),
        center.z
      );
    }
    
    points.push(point);
  }
  
  return points;
};

// Helper to create a straight shaft between two points
const createShaft = (start: Vector3, end: Vector3, segments: number = 2): Vector3[] => {
  const points: Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    points.push(new Vector3().lerpVectors(start, end, t));
  }
  return points;
};

// Helper to create a complete elbow connection (shaft + arc + shaft)
const createElbowConnection = (
  start: Vector3,
  end: Vector3,
  radius: number,
  orientation: 'horizontal' | 'vertical',
  direction: 1 | -1
): Vector3[] => {
  const points: Vector3[] = [];
  
  // Calculate arc start and end points
  const arcStart = orientation === 'horizontal'
    ? new Vector3(end.x - (direction * radius), start.y, start.z)
    : new Vector3(start.x, end.y - (direction * radius), start.z);
    
  const arcEnd = orientation === 'horizontal'
    ? new Vector3(end.x, start.y + (direction * radius), start.z)
    : new Vector3(start.x + (direction * radius), end.y, start.z);
  
  // Create initial shaft if needed
  if (!start.equals(arcStart)) {
    points.push(...createShaft(start, arcStart));
  }
  
  // Create arc
  points.push(...createElbowArc({
    startPoint: arcStart,
    endPoint: arcEnd,
    radius,
    orientation,
    direction
  }));
  
  // Create final shaft if needed
  if (!end.equals(arcEnd)) {
    points.push(...createShaft(arcEnd, end));
  }
  
  return points;
};

// Helper to determine if platforms require edge or underside routing
const analyzePathRequirements = (
  startPlatform: PlatformEdges,
  endPlatform: PlatformEdges
): 'direct' | 'edge-wrap' | 'underside' => {
  const verticalDiff = endPlatform.center.y - startPlatform.center.y;
  const horizontalDiff = endPlatform.center.x - startPlatform.center.x;
  const depthDiff = Math.abs(endPlatform.center.z - startPlatform.center.z);
  
  // Calculate if platforms are too close for direct connection
  const minVerticalSpace = 1.0; // Minimum space needed for direct connection
  const minHorizontalSpace = 0.5;
  
  if (Math.abs(verticalDiff) < minVerticalSpace && 
      Math.abs(horizontalDiff) > minHorizontalSpace) {
    return 'underside';
  } else if (depthDiff > minHorizontalSpace * 2) {
    return 'edge-wrap';
  }
  
  return 'direct';
};

// Helper to create edge-wrapping path points
const createEdgeWrapPath = (
  connection: PlatformConnection,
  radius: number
): Vector3[] => {
  const { start, end, startPlatform, endPlatform } = connection;
  const points: Vector3[] = [];
  
  // Determine wrap direction based on platform positions
  const wrapRight = endPlatform.center.x > startPlatform.center.x;
  const edgeOffset = radius * 1.5; // Distance to maintain from platform edge
  
  // Create wrap points
  const wrapPoints = [
    start,
    new Vector3(
      wrapRight ? startPlatform.right.x + edgeOffset : startPlatform.left.x - edgeOffset,
      start.y,
      start.z
    ),
    new Vector3(
      wrapRight ? startPlatform.right.x + edgeOffset : startPlatform.left.x - edgeOffset,
      end.y + radius,
      end.z
    ),
    end
  ];
  
  // Connect points with elbow connections
  for (let i = 0; i < wrapPoints.length - 1; i++) {
    points.push(...createElbowConnection(
      wrapPoints[i],
      wrapPoints[i + 1],
      radius,
      i === 1 ? 'vertical' : 'horizontal',
      wrapRight ? 1 : -1
    ));
  }
  
  return points;
};

// Helper to create underside routing path points
const createUndersidePath = (
  connection: PlatformConnection,
  radius: number,
  dropDepth: number = 1.0
): Vector3[] => {
  const { start, end, startPlatform, endPlatform } = connection;
  const points: Vector3[] = [];
  
  // Calculate intermediate points for underside routing
  const midY = Math.min(start.y, end.y) - dropDepth;
  const midX = (start.x + end.x) / 2;
  
  // Create path with vertical drops and horizontal connection
  const pathPoints = [
    start,
    new Vector3(start.x, midY, start.z),
    new Vector3(midX, midY, start.z),
    new Vector3(end.x, midY, end.z),
    end
  ];
  
  // Connect points with elbow connections
  for (let i = 0; i < pathPoints.length - 1; i++) {
    const orientation = i % 2 === 0 ? 'vertical' : 'horizontal';
    const direction = i === 0 ? -1 : 1;
    
    points.push(...createElbowConnection(
      pathPoints[i],
      pathPoints[i + 1],
      radius,
      orientation,
      direction
    ));
  }
  
  return points;
};

// Helper to calculate optimal connection path
const calculateOptimalPath = (
  connection: PlatformConnection,
  radius: number
): Vector3[] => {
  const routingType = analyzePathRequirements(
    connection.startPlatform,
    connection.endPlatform
  );
  
  switch (routingType) {
    case 'edge-wrap':
      return createEdgeWrapPath(connection, radius);
    case 'underside':
      return createUndersidePath(connection, radius);
    default:
      return createElbowConnection(
        connection.start,
        connection.end,
        radius,
        'horizontal',
        connection.end.x > connection.start.x ? 1 : -1
      );
  }
};

// Add new helper for analyzing path geometry
const analyzePath = (
  connection: PlatformConnection,
  constraints: PathConstraints
): PathAnalysis => {
  const { start, end, startPlatform, endPlatform } = connection;
  const debugPoints: DebugPoint[] = [];
  const debugLines: DebugLine[] = [];
  
  // Calculate key metrics
  const verticalDiff = end.y - start.y;
  const horizontalDiff = end.x - start.x;
  const depthDiff = end.z - start.z;
  const directDistance = start.distanceTo(end);
  
  // Analyze turn angles
  const turnAngles: number[] = [];
  const direction = new Vector3().subVectors(end, start).normalize();
  const upVector = new Vector3(0, 1, 0);
  turnAngles.push(Math.acos(direction.dot(upVector)));
  
  // Check clearance with platforms
  const clearanceViolations = checkClearanceViolations(
    start,
    end,
    startPlatform,
    endPlatform,
    constraints.preferredClearance
  );
  
  // Determine optimal routing type
  let routingType: PathAnalysis['routingType'] = 'direct';
  if (Math.abs(verticalDiff) < constraints.minVerticalSpace) {
    routingType = 'underside';
  } else if (Math.abs(horizontalDiff) > constraints.maxTurnAngle) {
    routingType = 'edge-wrap';
  } else if (clearanceViolations) {
    routingType = 'compound';
  }
  
  // Add debug visualization
  debugPoints.push(
    { position: start, label: 'Start', color: 'green' },
    { position: end, label: 'End', color: 'red' }
  );
  
  debugLines.push({
    start,
    end,
    color: clearanceViolations ? 'red' : 'green'
  });
  
  return {
    routingType,
    constraints,
    clearanceViolations,
    turnAngles,
    segmentLengths: [directDistance],
    totalLength: directDistance,
    debugInfo: {
      points: debugPoints,
      lines: debugLines,
      routingType,
      pathSegments: []
    }
  };
};

// Add helper for checking clearance violations
const checkClearanceViolations = (
  start: Vector3,
  end: Vector3,
  startPlatform: PlatformEdges,
  endPlatform: PlatformEdges,
  clearance: number
): boolean => {
  // Check distance to platform edges
  const checkPoint = (point: Vector3, platform: PlatformEdges): boolean => {
    const edges = [
      platform.topLeft, platform.topRight,
      platform.bottomLeft, platform.bottomRight
    ];
    
    return edges.some(edge => point.distanceTo(edge) < clearance);
  };
  
  // Check multiple points along the path
  const steps = 10;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const point = new Vector3().lerpVectors(start, end, t);
    if (checkPoint(point, startPlatform) || checkPoint(point, endPlatform)) {
      return true;
    }
  }
  
  return false;
};

// Update generatePipePath to use new analysis
export const generatePipePath = (
  platformId: 1 | 2 | 3,
  platformEdges: PlatformEdges,
  startPoint: Vector3,
  width: number,
  depth: number,
  height: number,
  previousPlatformEdges?: PlatformEdges,
  debug: boolean = false
): { points: Vector3[], debugInfo?: PathDebugInfo } => {
  const elbowRadius = 0.3;
  const constraints: PathConstraints = {
    minVerticalSpace: 1.0,
    minHorizontalSpace: 0.5,
    maxTurnAngle: Math.PI / 3,
    preferredClearance: 0.2
  };
  
  let pathPoints: Vector3[] = [];
  let pathAnalysis: PathAnalysis | undefined;
  
  if (platformId === 1) {
    pathPoints = createElbowConnection(
      startPoint,
      platformEdges.center,
      elbowRadius,
      'vertical',
      -1
    );
  } else if (previousPlatformEdges) {
    const connection: PlatformConnection = {
      start: startPoint,
      end: platformEdges.topLeft,
      startPlatform: previousPlatformEdges,
      endPlatform: platformEdges
    };
    
    pathAnalysis = analyzePath(connection, constraints);
    pathPoints = calculateOptimalPath(connection, elbowRadius);
  }
  
  // Ensure we always return an array of points
  return {
    points: pathPoints || [],
    debugInfo: pathAnalysis?.debugInfo
  };
}; 