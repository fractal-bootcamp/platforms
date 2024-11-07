import { Vector3 } from 'three';

export interface PlatformProps {
  position: [number, number, number];
  color: string;
  hovered?: boolean;
  onHover?: (hover: boolean) => void;
  width?: number;
  depth?: number;
  height?: number;
}

export interface PipeProps {
  points: Vector3[];
  color?: string;
  radius?: number;
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