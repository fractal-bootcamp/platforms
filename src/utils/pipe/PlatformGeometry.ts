import { Vector3, Box3 } from 'three';
import { PlatformEdges } from '../../types/platform.types';

export class PlatformGeometry {
  private edges: PlatformEdges;
  private bounds: Box3;
  private center: Vector3;
  private dimensions: { width: number; depth: number; height: number };

  constructor(
    edges: PlatformEdges,
    width: number,
    depth: number,
    height: number
  ) {
    this.edges = edges;
    this.dimensions = { width, depth, height };
    this.center = edges.center;
    this.bounds = this.calculateBounds();
  }

  private calculateBounds(): Box3 {
    return new Box3().setFromPoints([
      this.edges.topLeft,
      this.edges.topRight,
      this.edges.bottomLeft,
      this.edges.bottomRight
    ]);
  }

  public getRhombusBase(): Vector3 {
    return new Vector3(
      this.center.x,
      this.center.y - this.dimensions.height,
      this.center.z
    );
  }

  public getEdgeMidpoint(edge: 'top' | 'bottom' | 'left' | 'right'): Vector3 {
    switch (edge) {
      case 'top':
        return this.edges.top;
      case 'bottom':
        return this.edges.bottom;
      case 'left':
        return this.edges.left;
      case 'right':
        return this.edges.right;
    }
  }

  public getConstructionBox(
    referencePoint: Vector3,
    padding: number = 0.1
  ): Box3 {
    return new Box3(
      new Vector3(
        referencePoint.x - padding,
        referencePoint.y - padding,
        referencePoint.z - padding
      ),
      new Vector3(
        referencePoint.x + padding,
        referencePoint.y + padding,
        referencePoint.z + padding
      )
    );
  }

  public getBounds(): Box3 {
    return this.bounds.clone();
  }

  public getCenter(): Vector3 {
    return this.center.clone();
  }
} 