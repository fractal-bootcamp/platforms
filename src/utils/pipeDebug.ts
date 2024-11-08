import React from 'react';
import { Vector3 } from 'three';
import { Line, Html } from '@react-three/drei';
import {
  DebugPoint,
  DebugLine,
  DebugSegment,
  PipeDebugProps,
  DEBUG_COLORS,
  DEFAULT_STYLES,
  PathDebugInfo
} from '../types/pipeDebug.types';

// Debug visualization components
const DebugPointViz: React.FC<DebugPoint> = ({ 
  position, 
  label, 
  type, 
  color,
  opacity = type === 'control' ? 0.5 : 0.7 
}) => (
  <group position={[position.x, position.y, position.z]}>
    <mesh>
      <sphereGeometry args={[0.05]} />
      <meshBasicMaterial 
        color={color || DEBUG_COLORS[type]} 
        transparent 
        opacity={opacity}
      />
    </mesh>
    <Html>
      <div style={DEFAULT_STYLES.label}>
        {label}
      </div>
    </Html>
  </group>
);

const DebugLineViz: React.FC<DebugLine> = ({ 
  start, 
  end, 
  type, 
  color,
  opacity = type === 'construction' ? 0.3 : 1
}) => (
  <Line
    points={[start, end]}
    color={color || DEBUG_COLORS[type]}
    lineWidth={1}
    dashed={type === 'construction'}
    dashSize={type === 'construction' ? 0.1 : 0}
    dashScale={1}
    opacity={opacity}
    transparent
  />
);

const DebugSegmentViz: React.FC<DebugSegment> = ({ 
  points, 
  type,
  color 
}) => (
  <Line
    points={points}
    color={color || DEBUG_COLORS[type]}
    lineWidth={2}
    dashed={false}
  />
);

// Info panel component
const InfoPanel: React.FC<{
  points: Vector3[];
  debugInfo?: PathDebugInfo;
}> = ({ points, debugInfo }) => (
  <Html position={[0, 2, 0]}>
    <div style={DEFAULT_STYLES.infoPanel}>
      <div>Points: {points.length}</div>
      {debugInfo && (
        <>
          <div>Type: {debugInfo.routingType}</div>
          {debugInfo.metadata && Object.entries(debugInfo.metadata).map(([key, value]) => (
            <div key={key}>{key}: {value}</div>
          ))}
        </>
      )}
    </div>
  </Html>
);

// Main debug visualization component
export const PipeDebugVisualization: React.FC<PipeDebugProps> = ({
  points,
  debugInfo,
  showLabels = false,
  showConstructionLines = false,
  showMetadata = true
}) => {
  if (!points || points.length < 2) return null;

  return (
    <group>
      {debugInfo ? (
        <>
          {/* Construction Lines */}
          {showConstructionLines && debugInfo.lines
            .filter(line => line.type === 'construction')
            .map((line, i) => (
              <DebugLineViz key={`construction-${i}`} {...line} />
            ))}

          {/* Path Segments */}
          {debugInfo.segments.map((segment, i) => (
            <DebugSegmentViz key={`segment-${i}`} {...segment} />
          ))}

          {/* Debug Points */}
          {showLabels && debugInfo.points.map((point, i) => (
            <DebugPointViz key={`point-${i}`} {...point} />
          ))}
        </>
      ) : (
        <>
          {/* Fallback visualization */}
          <Line
            points={points}
            color={DEBUG_COLORS.path}
            lineWidth={2}
          />
          {showLabels && points.map((point, i) => (
            <DebugPointViz
              key={`point-${i}`}
              position={point}
              label={`P${i}`}
              type="anchor"
            />
          ))}
        </>
      )}

      {/* Info Panel */}
      {showMetadata && (
        <InfoPanel points={points} debugInfo={debugInfo} />
      )}
    </group>
  );
};

// Utility functions
export const calculateDebugInfo = (
  points: Vector3[],
  routingType: string = 'direct',
  metadata?: Record<string, any>
): PathDebugInfo => {
  const debugPoints = points.map((point, i) => ({
    position: point,
    label: `P${i}`,
    type: 'anchor' as const,
  }));

  const debugLines = points.slice(1).map((point, i) => ({
    start: points[i],
    end: point,
    type: 'construction' as const,
  }));

  const debugSegments = [{
    points,
    type: 'path' as const
  }];

  return {
    points: debugPoints,
    lines: debugLines,
    segments: debugSegments,
    routingType,
    metadata
  };
}; 