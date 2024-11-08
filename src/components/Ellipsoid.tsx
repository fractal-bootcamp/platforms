import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { useControls, folder } from 'leva';

interface EllipsoidProps {
  position?: [number, number, number];
  color?: string;
}

export const Ellipsoid: React.FC<EllipsoidProps> = ({
  position = [0, 0, 0],
  color = '#ff6b00'
}) => {
  const meshRef = useRef<Mesh>(null);

  // Leva controls for ellipsoid dimensions
  const { dimensions, rotation } = useControls('Ellipsoid', {
    dimensions: folder({
      waistRadius: { value: 0.5, min: 0.1, max: 2, step: 0.1, label: 'Waist Radius' },
      circleRadius: { value: 1, min: 0.1, max: 2, step: 0.1, label: 'Circle Radius' },
      segments: { value: 32, min: 8, max: 64, step: 1, label: 'Segments' }
    }),
    rotation: folder({
      autoRotate: { value: false, label: 'Auto Rotate' },
      rotationSpeed: { value: 1, min: 0.1, max: 5, step: 0.1, label: 'Rotation Speed' }
    })
  });

  // Optional auto-rotation
  useFrame((state, delta) => {
    if (meshRef.current && rotation.autoRotate) {
      meshRef.current.rotation.y += delta * rotation.rotationSpeed;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry 
        args={[
          dimensions.circleRadius, 
          dimensions.segments, 
          dimensions.segments
        ]} 
      />
      <meshStandardMaterial 
        color={color}
        metalness={0.2}
        roughness={0.8}
        // Scale the geometry to create the ellipsoid shape
        onBeforeCompile={(shader) => {
          shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            `
            vec3 transformed = vec3(position);
            transformed.xz *= ${dimensions.waistRadius.toFixed(1)};
            `
          );
        }}
      />
    </mesh>
  );
}; 