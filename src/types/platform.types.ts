import { Vector3 } from 'three';

export interface PlatformEdges {
  top: Vector3;
  bottom: Vector3;
  left: Vector3;
  right: Vector3;
  center: Vector3;
  topLeft: Vector3;
  topRight: Vector3;
  bottomLeft: Vector3;
  bottomRight: Vector3;
}

export interface PlatformProps {
  position: [number, number, number];
  color: string;
  hovered?: boolean;
  onHover?: (hover: boolean) => void;
  width?: number;
  depth?: number;
  height?: number;
  showEdgePoints?: boolean; // For debugging
}

export interface PipeProps {
  platformId: 1 | 2 | 3;
  width: number;
  depth: number;
  startPoint?: Vector3;
  endPoint?: Vector3;
  platformEdges: PlatformEdges;
}

export interface FloatingComponentProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  content?: string;
}

export interface RhombusProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
} 