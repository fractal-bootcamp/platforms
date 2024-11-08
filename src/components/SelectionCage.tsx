import React, { useMemo, useCallback } from 'react';
import { Vector3 } from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { usePipeStore } from '../store/pipeStore';

interface SelectionCageProps {
  platformId: number;
  width: number;
  depth: number;
  position: Vector3;
  subdivisions: { x: number; y: number };
  offset: number;
  visible: boolean;
}

export const SelectionCage: React.FC<SelectionCageProps> = ({
  platformId,
  width,
  depth,
  position,
  subdivisions,
  offset,
  visible
}) => {
  const addPoint = usePipeStore(state => state.addPoint);
  const selectedPoints = usePipeStore(state => state.selectedPoints);

  // Generate grid points
  const gridPoints = useMemo(() => {
    const points: Vector3[] = [];
    const startX = -width/2;
    const startY = 0;
    const startZ = -depth/2;
    
    const stepX = width / subdivisions.x;
    const stepZ = depth / subdivisions.y;

    for (let i = 0; i <= subdivisions.x; i++) {
      for (let j = 0; j <= subdivisions.y; j++) {
        points.push(new Vector3(
          startX + i * stepX,
          startY + offset,
          startZ + j * stepZ
        ));
      }
    }
    return points;
  }, [width, depth, subdivisions, offset]);

  // Generate grid lines
  const { horizontalLines, verticalLines } = useMemo(() => {
    const horizontal: Vector3[][] = [];
    const vertical: Vector3[][] = [];
    
    const startX = -width/2;
    const startY = offset;
    const startZ = -depth/2;
    
    // Horizontal lines (along Z)
    for (let i = 0; i <= subdivisions.y; i++) {
      const z = startZ + i * (depth / subdivisions.y);
      horizontal.push([
        new Vector3(startX, startY, z),
        new Vector3(startX + width, startY, z)
      ]);
    }
    
    // Vertical lines (along X)
    for (let i = 0; i <= subdivisions.x; i++) {
      const x = startX + i * (width / subdivisions.x);
      vertical.push([
        new Vector3(x, startY, startZ),
        new Vector3(x, startY, startZ + depth)
      ]);
    }

    return { horizontalLines: horizontal, verticalLines: vertical };
  }, [width, depth, subdivisions, offset]);

  // Handle point selection
  const handleClick = useCallback((event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    
    const point = event.point.clone();
    point.sub(position); // Convert to local space
    
    // Find closest grid point
    const closestPoint = gridPoints.reduce((closest, gridPoint) => {
      const distance = point.distanceTo(gridPoint);
      if (distance < closest.distance) {
        return { point: gridPoint, distance };
      }
      return closest;
    }, { point: gridPoints[0], distance: Infinity });

    if (closestPoint.distance < 0.5) {
      const worldPoint = closestPoint.point.clone().add(position);
      addPoint({
        id: `point-${platformId}-${Date.now()}`,
        position: worldPoint,
        platformId
      });
    }
  }, [gridPoints, platformId, addPoint, position]);

  if (!visible) return null;

  return (
    <group>
      {/* Grid lines */}
      {horizontalLines.map((points, i) => (
        <Line
          key={`h-${i}`}
          points={points}
          color="#666666"
          lineWidth={1}
          dashed={false}
          transparent
          opacity={0.5}
        />
      ))}
      
      {verticalLines.map((points, i) => (
        <Line
          key={`v-${i}`}
          points={points}
          color="#666666"
          lineWidth={1}
          dashed={false}
          transparent
          opacity={0.5}
        />
      ))}
      
      {/* Selected points */}
      {selectedPoints
        .filter(p => p.platformId === platformId)
        .map(point => {
          const localPos = point.position.clone().sub(position);
          return (
            <mesh key={point.id} position={localPos}>
              <sphereGeometry args={[0.1]} />
              <meshBasicMaterial color="#0066ff" />
            </mesh>
          );
        })}
        
      {/* Click detection plane */}
      <mesh 
        position={[0, offset, 0]} 
        rotation={[-Math.PI/2, 0, 0]} 
        onClick={handleClick}
      >
        <planeGeometry args={[width, depth]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
};