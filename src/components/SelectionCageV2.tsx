import React, { useMemo, useCallback } from 'react';
import { Vector3, Box3 } from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { usePipeStore } from '../store/pipeStore';
import { 
  SelectionCageProps, 
  Shell, 
  SubdividedShell,
  GridGeometry,
  ClosestPointResult 
} from '../types/selectionCage.types';

// Pure function to generate offset shell
const generateOffsetShell = (
  width: number, 
  depth: number, 
  offset: number,
  baseHeight: number = 0
): Shell => {
  const halfWidth = width / 2 + offset;
  const halfDepth = depth / 2 + offset;
  
  const vertices = [
    new Vector3(-halfWidth, baseHeight, -halfDepth),
    new Vector3(halfWidth, baseHeight, -halfDepth),
    new Vector3(halfWidth, baseHeight, halfDepth),
    new Vector3(-halfWidth, baseHeight, halfDepth),
  ];

  const edges: [Vector3, Vector3][] = [
    [vertices[0], vertices[1]],
    [vertices[1], vertices[2]],
    [vertices[2], vertices[3]],
    [vertices[3], vertices[0]],
  ];

  return {
    bounds: new Box3().setFromPoints(vertices),
    vertices,
    edges
  };
};

// Pure function to subdivide shell
const subdivideShell = (
  shell: Shell,
  subdivisions: { x: number; y: number }
): SubdividedShell => {
  const { bounds } = shell;
  const xStep = (bounds.max.x - bounds.min.x) / subdivisions.x;
  const zStep = (bounds.max.z - bounds.min.z) / subdivisions.y;
  const baseY = shell.vertices[0].y;

  const gridLines: [Vector3, Vector3][] = [];
  const intersectionPoints: Vector3[] = [];

  // Generate horizontal grid lines
  for (let i = 0; i <= subdivisions.y; i++) {
    const z = bounds.min.z + (zStep * i);
    gridLines.push([
      new Vector3(bounds.min.x, baseY, z),
      new Vector3(bounds.max.x, baseY, z)
    ]);
  }

  // Generate vertical grid lines
  for (let i = 0; i <= subdivisions.x; i++) {
    const x = bounds.min.x + (xStep * i);
    gridLines.push([
      new Vector3(x, baseY, bounds.min.z),
      new Vector3(x, baseY, bounds.max.z)
    ]);
  }

  // Calculate intersection points
  for (let i = 0; i <= subdivisions.x; i++) {
    for (let j = 0; j <= subdivisions.y; j++) {
      intersectionPoints.push(new Vector3(
        bounds.min.x + (xStep * i),
        baseY,
        bounds.min.z + (zStep * j)
      ));
    }
  }

  return {
    vertices: intersectionPoints,
    gridLines,
    intersectionPoints
  };
};

// Pure function to find closest point
const findClosestPoint = (
  point: Vector3,
  intersectionPoints: Vector3[]
): ClosestPointResult => {
  return intersectionPoints.reduce(
    (closest, intersectionPoint) => {
      const distance = point.distanceTo(intersectionPoint);
      return distance < closest.distance
        ? { point: intersectionPoint, distance }
        : closest;
    },
    { point: intersectionPoints[0], distance: Infinity }
  );
};

// Pure function to generate grid geometry
const generateGridGeometry = (
  width: number,
  depth: number,
  offset: number,
  subdivisions: { x: number; y: number }
): GridGeometry => {
  const shell = generateOffsetShell(width, depth, offset);
  const subdivided = subdivideShell(shell, subdivisions);
  return { shell, subdivided };
};

// Visual components
const ShellEdges: React.FC<{ edges: [Vector3, Vector3][] }> = ({ edges }) => (
  <>
    {edges.map((edge, i) => (
      <Line
        key={`shell-${i}`}
        points={edge}
        color="#444444"
        lineWidth={2}
        transparent
        opacity={0.7}
      />
    ))}
  </>
);

const GridLines: React.FC<{ lines: [Vector3, Vector3][] }> = ({ lines }) => (
  <>
    {lines.map((line, i) => (
      <Line
        key={`grid-${i}`}
        points={line}
        color="#666666"
        lineWidth={1}
        transparent
        opacity={0.3}
      />
    ))}
  </>
);

const SelectedPoints: React.FC<{
  points: { id: string; position: Vector3 }[];
  basePosition: Vector3;
}> = ({ points, basePosition }) => (
  <>
    {points.map(point => {
      const localPos = point.position.clone().sub(basePosition);
      return (
        <mesh key={point.id} position={localPos}>
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial color="#0066ff" />
        </mesh>
      );
    })}
  </>
);

export const SelectionCageV2: React.FC<SelectionCageProps> = ({
  platformId,
  width,
  depth,
  position,
  subdivisions,
  offset,
  visible
}) => {
  const addPoint = usePipeStore(state => state.addPoint);
  const selectedPoints = usePipeStore(state => state.selectedPoints);

  // Add debug logging
  console.log('SelectionCageV2 props:', {
    platformId,
    width,
    depth,
    position,
    subdivisions,
    offset,
    visible
  });

  // Generate grid geometry using pure functions
  const geometry = useMemo(
    () => generateGridGeometry(width, depth, offset, subdivisions),
    [width, depth, offset, subdivisions]
  );

  // Handle point selection
  const handleClick = useCallback((event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    
    const localPoint = event.point.clone().sub(position);
    const closestPoint = findClosestPoint(localPoint, geometry.subdivided.intersectionPoints);

    if (closestPoint.distance < 0.5) {
      const worldPoint = closestPoint.point.clone().add(position);
      addPoint({
        id: `point-${platformId}-${Date.now()}`,
        position: worldPoint,
        platformId
      });
    }
  }, [geometry.subdivided.intersectionPoints, platformId, addPoint, position]);

  if (!visible) {
    console.log('SelectionCage not visible for platform:', platformId);
    return null;
  }

  return (
    <group>
      <ShellEdges edges={geometry.shell.edges} />
      <GridLines lines={geometry.subdivided.gridLines} />
      <SelectedPoints 
        points={selectedPoints.filter(p => p.platformId === platformId)}
        basePosition={position}
      />
      
      <mesh 
        position={[0, offset, 0]} 
        rotation={[-Math.PI/2, 0, 0]} 
        onClick={handleClick}
      >
        <planeGeometry args={[width + offset * 2, depth + offset * 2]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
}; 