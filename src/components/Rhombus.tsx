import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { RhombusProps } from '../types/platform.types';

const Rhombus: React.FC<RhombusProps> = ({ 
  position, 
  rotation = [0, 0, 0], 
  color = '#4a90e2' 
}) => {
  const { camera } = useThree();
  
  useEffect(() => {
    // Always face the camera
    const lookAt = () => {
      const direction = new Vector3();
      camera.getWorldDirection(direction);
      // Update rotation to face camera while maintaining upright orientation
    };
    
    lookAt();
  }, [camera.position]);

  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[1, 1, 0.2]} /> {/* Placeholder until SVG implementation */}
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default Rhombus; 