import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3, Mesh, Matrix4 } from 'three';
import { RhombusProps } from '../types/platform.types';

const Rhombus: React.FC<RhombusProps> = ({ 
  position, 
  rotation = [0, 0, 0], 
  color = '#4a90e2' 
}) => {
  const { camera } = useThree();
  const meshRef = useRef<Mesh>(null);
  const positionVector = new Vector3(...position);
  
  // Matrix for billboard effect
  const billboardMatrix = new Matrix4();
  
  // Update rotation every frame to face camera
  useFrame(() => {
    if (!meshRef.current) return;

    // Get the direction to the camera
    const meshPosition = meshRef.current.getWorldPosition(new Vector3());
    const cameraPosition = camera.position.clone();
    const direction = cameraPosition.sub(meshPosition).normalize();

    // Calculate the rotation matrix to face the camera while staying upright
    billboardMatrix.lookAt(
      direction,
      new Vector3(0, 0, 0),
      new Vector3(0, 1, 0)
    );

    // Extract rotation from matrix
    meshRef.current.quaternion.setFromRotationMatrix(billboardMatrix);
    
    // Keep the mesh upright by zeroing the roll rotation
    meshRef.current.rotation.z = 0;
  });

  return (
    <group position={positionVector}>
      <mesh ref={meshRef}>
        {/* Placeholder rhombus geometry */}
        <boxGeometry args={[1, 1, 0.1]} />
        <meshStandardMaterial 
          color={color}
          metalness={0.1}
          roughness={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
};

export default Rhombus; 