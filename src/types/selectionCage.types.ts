import { Vector3, Box3 } from 'three';

export interface SelectionCageProps {
  platformId: number;
  width: number;
  depth: number;
  position: Vector3;
  subdivisions: { x: number; y: number };
  offset: number;
  visible: boolean;
}

export interface Shell {
  bounds: Box3;
  vertices: Vector3[];
  edges: [Vector3, Vector3][];
}

export interface SubdividedShell {
  vertices: Vector3[];
  gridLines: [Vector3, Vector3][];
  intersectionPoints: Vector3[];
}

export interface GridGeometry {
  shell: Shell;
  subdivided: SubdividedShell;
}

export interface ClosestPointResult {
  point: Vector3;
  distance: number;
} 