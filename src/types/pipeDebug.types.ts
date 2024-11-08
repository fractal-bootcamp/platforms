import { Vector3 } from 'three';
import { ThreeElements } from '@react-three/fiber';

// Core debug element types
export type DebugElementType = {
  anchor: '#00ff00';
  control: '#ffff00';
  elbow: '#00ffff';
  intersection: '#ff0000';
  path: '#ff6b00';
  construction: '#888888';
  clearance: '#ff00ff';
  shaft: '#00ff00';
  wrap: '#ff00ff';
  underside: '#ffaa00';
};

export type DebugPointType = keyof Pick<DebugElementType, 'anchor' | 'control' | 'elbow' | 'intersection'>;
export type DebugLineType = keyof Pick<DebugElementType, 'path' | 'construction' | 'clearance'>;
export type DebugSegmentType = keyof Pick<DebugElementType, 'shaft' | 'elbow' | 'wrap' | 'underside'>;

// Debug element interfaces
export interface DebugElement {
  color?: string;
  opacity?: number;
}

export interface DebugPoint extends DebugElement {
  position: Vector3;
  label: string;
  type: DebugPointType;
}

export interface DebugLine extends DebugElement {
  start: Vector3;
  end: Vector3;
  type: DebugLineType;
}

export interface DebugSegment extends DebugElement {
  points: Vector3[];
  type: DebugSegmentType;
}

// Debug visualization container
export interface PathDebugInfo {
  points: DebugPoint[];
  lines: DebugLine[];
  segments: DebugSegment[];
  routingType: string;
  metadata?: Record<string, any>;
}

// Component props
export interface PipeDebugProps {
  points: Vector3[];
  debugInfo?: PathDebugInfo;
  showLabels?: boolean;
  showConstructionLines?: boolean;
  showMetadata?: boolean;
}

// Style configurations
export interface DebugStyles {
  label: React.CSSProperties;
  infoPanel: React.CSSProperties;
}

// Debug color mapping
export const DEBUG_COLORS: DebugElementType = {
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

// Default styles
export const DEFAULT_STYLES: DebugStyles = {
  label: {
    background: 'rgba(0,0,0,0.7)',
    color: 'white',
    padding: '2px 4px',
    borderRadius: '3px',
    fontSize: '10px',
    transform: 'translate(10px, -50%)',
    whiteSpace: 'nowrap',
    pointerEvents: 'none'
  },
  infoPanel: {
    background: 'rgba(0,0,0,0.7)',
    color: 'white',
    padding: '8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'monospace',
    pointerEvents: 'none'
  }
}; 