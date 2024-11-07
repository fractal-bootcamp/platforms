import React from 'react';
import { Vector3 } from 'three';
import { Line, Html } from '@react-three/drei';
import {
  DebugPoint,
  DebugLine,
  DebugSegment,
  PipeDebugProps,
  DEBUG_COLORS,
} from '../types/pipeDebug.types';

// Debug point visualization
const DebugPointViz: React.FC<DebugPoint> = ({ position, label, type, color }) => (
  <group position={[position.x, position.y, position.z]}>
    <mesh>
      <sphereGeometry args={[0.05]} />
      <meshBasicMaterial 
        color={color || DEBUG_COLORS[type]} 
        transparent 
        opacity={type === 'control' ? 0.5 : 0.7} 
      />
    </mesh>
    <Html>
      <div style={{
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '2px 4px',
        borderRadius: '3px',
        fontSize: '10px',
        transform: 'translate(10px, -50%)',
        whiteSpace: 'nowrap'
      }}>
        {label}
      </div>
    </Html>
  </group>
);

// Debug line visualization
const DebugLineViz: React.FC<DebugLine> = ({ start, end, type, color }) => (
  <Line
    points={[start, end]}
    color={color || DEBUG_COLORS[type]}
    lineWidth={1}
    dashed={type === 'construction'}
    dashSize={type === 'construction' ? 0.1 : 0}
    dashScale={1}
    opacity={type === 'construction' ? 0.3 : 1}
    transparent
  />
);

// Debug segment visualization
const DebugSegmentViz: React.FC<DebugSegment> = ({ points, type }) => (
  <Line
    points={points}
    color={DEBUG_COLORS[type]}
    lineWidth={2}
    dashed={false}
  />
);

// Main debug visualization component
export const PipeDebugVisualization: React.FC<PipeDebugProps> = ({
  points,
  debugInfo,
  showLabels = false,
  showConstructionLines = false,
}) => {
  if (!points || points.length < 2) return null;

  return (
    <group>
      {/* Render debug info if available */}
      {debugInfo && (
        <>
          {/* Construction Lines */}
          {showConstructionLines && debugInfo.lines.map((line, i) => (
            line.type === 'construction' && (
              <DebugLineViz key={`construction-${i}`} {...line} />
            )
          ))}

          {/* Debug Segments */}
          {debugInfo.segments.map((segment, i) => (
            <DebugSegmentViz key={`segment-${i}`} {...segment} />
          ))}

          {/* Debug Points */}
          {showLabels && debugInfo.points.map((point, i) => (
            <DebugPointViz key={`point-${i}`} {...point} />
          ))}
        </>
      )}

      {/* Fallback visualization if no debug info */}
      {!debugInfo && (
        <>
          {/* Main Path */}
          <Line
            points={points}
            color={DEBUG_COLORS.path}
            lineWidth={2}
          />

          {/* Basic Point Labels */}
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

      {/* Path Info */}
      <Html position={[0, 2, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          <div>Points: {points.length}</div>
          {debugInfo && <div>Type: {debugInfo.routingType}</div>}
        </div>
      </Html>
    </group>
  );
}; 