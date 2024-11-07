import { Vector3 } from 'three';
import { Line } from '@react-three/drei';
import { useSceneControls } from './Controls';
import { PipeProps } from '../types/platform.types';
import { generatePipePath } from '../utils/pipeGeometry';
import { PipeDebugVisualization } from './PipeDebugView';
import { calculateDebugInfo } from '../utils/pipeDebug';

export const Pipe: React.FC<PipeProps> = ({ 
  platformId, 
  platformEdges,
  startPoint,
  endPoint,
  width,
  depth 
}) => {
  const { 
    pipeColor, 
    pipeWidth, 
    pipeHeight,
    showPipeDebug,
    showPipeLabels,
    showConstructionLines,
  } = useSceneControls();

  const result = generatePipePath(
    platformId,
    platformEdges,
    startPoint || new Vector3(),
    width,
    depth,
    pipeHeight
  );
  
  if (!result.points || result.points.length === 0) return null;

  return (
    <>
      <Line
        points={result.points}
        color={pipeColor}
        lineWidth={pipeWidth * 100}
        dashed={false}
      />
      {showPipeDebug && (
        <PipeDebugVisualization
          points={result.points}
          showLabels={showPipeLabels}
          showConstructionLines={showConstructionLines}
        />
      )}
    </>
  );
}; 