import { Vector3 } from 'three';

export interface PipeSegment {
  start: Vector3;
  end: Vector3;
  control1?: Vector3;
  control2?: Vector3;
}

export interface PipeConfig {
  width: number;
  color: string;
  height: number;
} 