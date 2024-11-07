import { Vector3 } from 'three';
import { ThreeElements } from '@react-three/fiber';

// Debug element types
export type DebugPointType = 'anchor' | 'control' | 'elbow' | 'intersection';
export type DebugLineType = 'path' | 'construction' | 'clearance';
export type DebugSegmentType = 'shaft' | 'elbow' | 'wrap' | 'underside';

// Debug element interfaces
export interface DebugPoint {
  position: Vector3;
  label: string;
  type: DebugPointType;
  color?: string;
}

export interface DebugLine {
  start: Vector3;
  end: Vector3;
  type: DebugLineType;
  color?: string;
}

export interface DebugSegment {
  points: Vector3[];
  type: DebugSegmentType;
}

// Debug info container
export interface PathDebugInfo {
  points: DebugPoint[];
  lines: DebugLine[];
  segments: DebugSegment[];
  routingType: string;
}

// Component props
export interface PipeDebugProps {
  points: Vector3[];
  debugInfo?: PathDebugInfo;
  showLabels?: boolean;
  showConstructionLines?: boolean;
}

// Debug color mapping
export const DEBUG_COLORS = {
  anchor: '#00ff00',
  control: '#ffff00',
  elbow: '#00ffff',
  intersection: '#ff0000',
  path: '#ff6b00',
  construction: '#888888',
  clearance: '#ff00ff',
  shaft: '#00ff00',
  wrap: '#ff00ff',
  underside: '#ffaa00'
} as const;

// Three.js JSX element declarations
export interface ThreeJSX {
  group: ThreeElements['group'];
  mesh: ThreeElements['mesh'];
  sphereGeometry: ThreeElements['sphereGeometry'];
  meshBasicMaterial: ThreeElements['meshBasicMaterial'];
}

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeJSX {}
  }
} 