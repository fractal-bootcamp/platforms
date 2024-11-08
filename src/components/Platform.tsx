import { FC, useState, useCallback } from 'react';
import { Vector3 } from 'three';
import { SelectionCageV2 } from './SelectionCageV2';
import { useSceneControls } from './Controls';
import { RoundedBox } from '@react-three/drei';

interface PlatformProps {
  id: 1 | 2 | 3;
  position: [number, number, number];
  color: string;
  hovered?: boolean;
  onHover?: (hover: boolean) => void;
  width?: number;
  depth?: number;
  height?: number;
  showEdgePoints?: boolean;
  children?: React.ReactNode;
}

export const Platform: FC<PlatformProps> = ({
  id,
  position,
  color,
  hovered,
  onHover,
  width = 3,
  depth = 2,
  height = 0.2,
  showEdgePoints = false,
  children
}) => {
  const controls = useSceneControls();
  const { showSelectionCages } = controls.selectionTools;
  const [isHovered, setIsHovered] = useState(false);

  // Get the correct grid settings based on platform ID
  const platformKey = `Platform ${id} Grid` as 'Platform 1 Grid' | 'Platform 2 Grid' | 'Platform 3 Grid';
  const gridSettings = controls.selectionTools[platformKey];

  // Transform subdivisionX and subdivisionY into subdivisions object
  const subdivisions = {
    x: gridSettings.subdivisionX,
    y: gridSettings.subdivisionY
  };

  // Calculate final visibility
  const isCageVisible = showSelectionCages && gridSettings.visible;

  // Handle hover events only when selection cages are hidden
  const handlePointerEnter = useCallback(() => {
    if (!isCageVisible) {
      setIsHovered(true);
      onHover?.(true);
    }
  }, [isCageVisible, onHover]);

  const handlePointerLeave = useCallback(() => {
    if (!isCageVisible) {
      setIsHovered(false);
      onHover?.(false);
    }
  }, [isCageVisible, onHover]);

  // Convert position array to Vector3
  const positionVector = new Vector3(...position);

  return (
    <group>
      <RoundedBox
        args={[width, height, depth]}
        radius={0.1}
        smoothness={1}
        position={position}
        onPointerOver={handlePointerEnter}
        onPointerOut={handlePointerLeave}
      >
        <meshStandardMaterial 
          color={color}
          emissive={hovered || isHovered ? "#666666" : "#000000"}
          emissiveIntensity={0.2}
          transparent
          opacity={isCageVisible ? 0.8 : 1}
          metalness={0.2}
          roughness={0.7}
        />
      </RoundedBox>
      
      {/* Selection Cage */}
      {isCageVisible && (
        <SelectionCageV2
          platformId={id}
          width={width}
          depth={depth}
          position={positionVector}
          subdivisions={subdivisions}
          offset={gridSettings.offset}
          visible={true}
        />
      )}
      
      {children}
    </group>
  );
};