import { Vector3, CubicBezierCurve3 } from 'three';

export interface CurveConfig {
  startPoint: Vector3;
  endPoint: Vector3;
  controlPoint1: Vector3;
  controlPoint2: Vector3;
  segments?: number;
}

export class CurveSegment {
  private curve: CubicBezierCurve3;
  private segments: number;

  constructor(config: CurveConfig) {
    this.curve = new CubicBezierCurve3(
      config.startPoint,
      config.controlPoint1,
      config.controlPoint2,
      config.endPoint
    );
    this.segments = config.segments || 12;
  }

  public getPoints(): Vector3[] {
    return this.curve.getPoints(this.segments);
  }

  public getTangentAt(t: number): Vector3 {
    return this.curve.getTangent(t);
  }

  public getPointAt(t: number): Vector3 {
    return this.curve.getPoint(t);
  }

  static createElbow(
    start: Vector3,
    end: Vector3,
    radius: number,
    orientation: 'horizontal' | 'vertical'
  ): CurveSegment {
    const direction = end.clone().sub(start).normalize();
    const distance = start.distanceTo(end);
    
    let control1: Vector3, control2: Vector3;
    
    if (orientation === 'horizontal') {
      control1 = start.clone().add(new Vector3(radius, 0, 0));
      control2 = end.clone().sub(new Vector3(0, radius, 0));
    } else {
      control1 = start.clone().add(new Vector3(0, radius, 0));
      control2 = end.clone().sub(new Vector3(radius, 0, 0));
    }

    return new CurveSegment({
      startPoint: start,
      endPoint: end,
      controlPoint1: control1,
      controlPoint2: control2
    });
  }
} 