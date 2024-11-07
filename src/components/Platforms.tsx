import React, { useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Html, Tube } from '@react-three/drei';
import { Vector3, CatmullRomCurve3 } from 'three';
import { PlatformProps, PipeProps, FloatingComponentProps, PlatformEdges } from '../types/platform.types';
import Rhombus from './Rhombus';
import { useSceneControls } from './Controls';
import { Pipe } from './Pipe';

const calculatePlatformEdges = (
  position: [number, number, number],
  width: number,
  depth: number,
  height: number
): PlatformEdges => {
  const [x, y, z] = position;
  const halfWidth = width / 2;
  const halfDepth = depth / 2;
  
  return {
    center: new Vector3(x, y + height, z),
    top: new Vector3(x, y + height, z - halfDepth),
    bottom: new Vector3(x, y + height, z + halfDepth),
    left: new Vector3(x - halfWidth, y + height, z),
    right: new Vector3(x + halfWidth, y + height, z),
    topLeft: new Vector3(x - halfWidth, y + height, z - halfDepth),
    topRight: new Vector3(x + halfWidth, y + height, z - halfDepth),
    bottomLeft: new Vector3(x - halfWidth, y + height, z + halfDepth),
    bottomRight: new Vector3(x + halfWidth, y + height, z + halfDepth),
  };
};

const EdgePoint: React.FC<{ position: Vector3; label: string }> = ({ position, label }) => {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color="red" />
      </mesh>
      <Html>
        <div style={{ 
          color: 'white', 
          backgroundColor: 'rgba(0,0,0,0.7)', 
          padding: '2px 5px',
          borderRadius: '3px',
          fontSize: '10px'
        }}>
          {label}
        </div>
      </Html>
    </group>
  );
};

const Platform: React.FC<PlatformProps> = ({
  position,
  color,
  hovered,
  onHover,
  width = 3,
  depth = 2,
  height = 0.2,
  showEdgePoints = false
}) => {
  const edges = calculatePlatformEdges(position, width, depth, height);

  return (
    <group>
      <RoundedBox
        args={[width, height, depth]}
        radius={0.1}
        smoothness={1}
        position={position}
        onPointerOver={() => onHover?.(true)}
        onPointerOut={() => onHover?.(false)}
      >
        <meshStandardMaterial 
          color={color} 
          metalness={0.2}
          roughness={0.7}
        />
      </RoundedBox>
      
      {showEdgePoints && (
        <>
          {Object.entries(edges).map(([key, pos]) => (
            <EdgePoint key={key} position={pos} label={key} />
          ))}
        </>
      )}
    </group>
  );
};

const FloatingComponent: React.FC<FloatingComponentProps> = ({ 
  position, 
  rotation = [0, 0, 0], 
  scale = [1, 1, 1],
  content 
}) => {
  return (
    <group position={new Vector3(...position)} rotation={rotation} scale={scale}>
      <Html transform>
        <div className="floating-window">
          {content}
        </div>
      </Html>
    </group>
  );
};

// Update Scene component with responsive positioning
const Scene: React.FC = () => {
  const [hoveredPlatform, setHoveredPlatform] = useState<number | null>(null);
  const { viewport, camera } = useThree();
  
  const {
    linkColors,
    platform1Color,
    platform2Color,
    platform3Color,
    width,
    depth,
    height,
    horizontalOffset,
    verticalStagger,
    useResponsive,
    isAxonometric,
    cameraDistance,
    panX,
    panY,
    panZ,
    showEdgePoints
  } = useSceneControls();

  // Update camera position and target based on controls
  useEffect(() => {
    const updateCamera = () => {
      if (isAxonometric) {
        const d = cameraDistance;
        // Set camera position with pan offsets
        camera.position.set(
          d + panX,
          d + panY,
          d + panZ
        );
      } else {
        // Set default perspective position with pan offsets
        camera.position.set(
          cameraDistance + panX,
          cameraDistance / 2 + panY,
          cameraDistance + panZ
        );
      }

      // Update camera target (lookAt point) based on pan
      camera.lookAt(panX, panY, panZ);
      
      if ('fov' in camera) {
        camera.fov = isAxonometric ? 45 : 60;
        camera.zoom = isAxonometric ? 1.5 : 1;
        camera.updateProjectionMatrix();
      }
    };

    updateCamera();
  }, [isAxonometric, camera, cameraDistance, panX, panY, panZ]);

  const getPlatformColor = (index: number) => {
    if (linkColors) {
      return platform1Color;
    }
    const colors = [platform1Color, platform2Color, platform3Color];
    return hoveredPlatform === index ? '#e0e0e0' : colors[index];
  };
  
  const getPlatformPositions = (viewportWidth: number): [number, number, number][] => {
    if (useResponsive && viewportWidth < 768) {
      return [
        [0, 0, 0],
        [0, -2, 0],
        [0, -4, 0]
      ];
    }
    return [
      [0, 0, 0],
      [horizontalOffset, -verticalStagger, 0],
      [horizontalOffset * 2, -verticalStagger * 2, 0]
    ];
  };

  const platformPositions = getPlatformPositions(viewport.width);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />

      {/* Create a group to offset all content based on pan values */}
      <group position={[0, 0, 0]}>
        {platformPositions.map((position, index) => (
          <React.Fragment key={index}>
            <Platform
              position={position}
              color={getPlatformColor(index)}
              hovered={hoveredPlatform === index}
              onHover={(hover) => setHoveredPlatform(hover ? index : null)}
              width={width}
              depth={depth}
              height={height}
              showEdgePoints={showEdgePoints}
            />
            {index > 0 && (
              <Pipe
                platformId={index as 1 | 2 | 3}
                width={width}
                depth={depth}
                platformEdges={calculatePlatformEdges(position, width, depth, height)}
                startPoint={calculatePlatformEdges(
                  platformPositions[index-1], 
                  width, 
                  depth, 
                  height
                ).bottomRight}
                endPoint={calculatePlatformEdges(
                  position,
                  width,
                  depth,
                  height
                ).topLeft}
              />
            )}
          </React.Fragment>
        ))}
        
        <Rhombus position={[platformPositions[0][0], platformPositions[0][1] + 1, platformPositions[0][2]]} />
      </group>

      {!isAxonometric && (
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 3}
        />
      )}
    </>
  );
};

// Keep only one Platforms component definition
const Platforms: React.FC = () => {
  return (
    <div className="platform-container">
      <Canvas 
        shadows 
        camera={{ 
          position: [10, 5, 10], 
          fov: 60,
          near: 0.1,
          far: 1000
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

// Add Shadow component
const Shadow: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[3, 2]} />
      <shadowMaterial transparent opacity={0.2} />
    </mesh>
  );
};

export default Platforms; 