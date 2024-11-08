import { Vector3 } from 'three';
import { PlatformGeometry } from './PlatformGeometry';
import { CurveSegment } from './CurveSegment';
import { PlatformEdges } from '../../types/platform.types';

export interface PipePathConfig {
  elbowRadius: number;
  switchbackSpacing: number;
  verticalOffset: number;
  horizontalOffset: number;
}

export class PipePathBuilder {
  private platforms: PlatformGeometry[];
  private config: PipePathConfig;
  private segments: CurveSegment[] = [];

  constructor(config: PipePathConfig) {
    this.platforms = [];
    this.config = config;
  }

  public addPlatform(
    edges: PlatformEdges,
    width: number,
    depth: number,
    height: number
  ): void {
    this.platforms.push(new PlatformGeometry(edges, width, depth, height));
  }

  private createSwitchbackPattern(
    platform: PlatformGeometry,
    startPoint: Vector3,
    turns: number
  ): Vector3[] {
    const points: Vector3[] = [startPoint];
    const spacing = this.config.switchbackSpacing;
    
    for (let i = 0; i < turns; i++) {
      const isEvenTurn = i % 2 === 0;
      const direction = isEvenTurn ? 1 : -1;
      
      // Create horizontal segment
      const horizontalEnd = points[points.length - 1].clone().add(
        new Vector3(direction * spacing, 0, 0)
      );
      points.push(horizontalEnd);
      
      // Create vertical segment if not last turn
      if (i < turns - 1) {
        const verticalEnd = horizontalEnd.clone().add(
          new Vector3(0, this.config.verticalOffset, 0)
        );
        points.push(verticalEnd);
      }
    }
    
    return points;
  }

  public generatePath(): Vector3[] {
    if (this.platforms.length < 2) {
      throw new Error('At least two platforms are required to generate a path');
    }

    const allPoints: Vector3[] = [];
    
    // Generate path segments between platforms
    for (let i = 0; i < this.platforms.length - 1; i++) {
      const currentPlatform = this.platforms[i];
      const nextPlatform = this.platforms[i + 1];
      
      // Calculate connection points
      const startPoint = currentPlatform.getRhombusBase();
      const endPoint = nextPlatform.getEdgeMidpoint('left');
      
      // Create elbow curve
      const elbow = CurveSegment.createElbow(
        startPoint,
        endPoint,
        this.config.elbowRadius,
        'vertical'
      );
      
      this.segments.push(elbow);
      allPoints.push(...elbow.getPoints());
      
      // Add switchback pattern if needed
      if (i === 1 || i === 2) { // Second and third platforms
        const switchbackPoints = this.createSwitchbackPattern(
          nextPlatform,
          endPoint,
          i === 1 ? 1 : 2
        );
        allPoints.push(...switchbackPoints);
      }
    }
    
    return allPoints;
  }

  public getDebugPoints(): Vector3[] {
    return this.segments.flatMap(segment => segment.getPoints());
  }
} 