import { useControls, folder, button } from 'leva';
import { usePipeStore } from '../store/pipeStore';

export const useSceneControls = () => {
  const clearPoints = usePipeStore(state => state.clearPoints);

  const mainControls = useControls({
    dimensions: folder({
      width: { value: 3, min: 1, max: 6, step: 0.1 },
      depth: { value: 2, min: 1, max: 4, step: 0.1 },
      height: { value: 0.2, min: 0.1, max: 1, step: 0.1 },
    }),
    positioning: folder({
      horizontalOffset: { value: 4, min: 0, max: 10, step: 0.5, label: 'Horizontal Spacing' },
      verticalStagger: { value: 1, min: 0, max: 4, step: 0.25, label: 'Vertical Drop' },
      useResponsive: { value: true, label: 'Responsive Layout' }
    }),
    view: folder({
      panX: { value: 0, min: -10, max: 10, step: 0.5, label: 'Pan Horizontal' },
      panY: { value: 0, min: -10, max: 10, step: 0.5, label: 'Pan Vertical' },
      panZ: { value: 0, min: -10, max: 10, step: 0.5, label: 'Pan Depth' },
      isAxonometric: { value: false, label: 'Axonometric View' },
      cameraDistance: { value: 10, min: 5, max: 20, step: 0.5 }
    }),
    colors: folder({
      linkColors: { value: false, label: 'Use Same Color' },
      platform1Color: { value: '#a8d5ff' },
      platform2Color: { value: '#98ffb3' },
      platform3Color: { value: '#ffb3b3' },
    }),
    pipe: folder({
      pipeWidth: { value: 0.05, min: 0.02, max: 0.2, step: 0.01, label: 'Pipe Width' },
      pipeColor: { value: '#ff6b00', label: 'Pipe Color' },
      pipeHeight: { value: 0.1, min: 0.05, max: 0.3, step: 0.01, label: 'Pipe Height' },
    }),
    debug: folder({
      showEdgePoints: { value: false, label: 'Show Edge Points' },
      showPipeDebug: { value: false, label: 'Show Pipe Debug' },
      showPipeLabels: { value: true, label: 'Show Debug Labels' },
      showConstructionLines: { value: true, label: 'Show Construction' },
      showPipeMetrics: { value: true, label: 'Show Metrics' },
    })
  });

  const selectionControls = useControls('Selection Tools', {
    showSelectionCages: { value: true, label: 'Show All Selection Cages' },
    'Platform 1': folder({
      showGrid1: { value: true, label: 'Show Grid' },
      subdivisionX1: { value: 10, min: 2, max: 20, step: 1, label: 'X Subdivisions' },
      subdivisionY1: { value: 10, min: 2, max: 20, step: 1, label: 'Y Subdivisions' },
      offset1: { value: 0.5, min: 0, max: 2, step: 0.1, label: 'Grid Offset' }
    }, { collapsed: false }),
    'Platform 2': folder({
      showGrid2: { value: true, label: 'Show Grid' },
      subdivisionX2: { value: 10, min: 2, max: 20, step: 1, label: 'X Subdivisions' },
      subdivisionY2: { value: 10, min: 2, max: 20, step: 1, label: 'Y Subdivisions' },
      offset2: { value: 0.5, min: 0, max: 2, step: 0.1, label: 'Grid Offset' }
    }, { collapsed: false }),
    'Platform 3': folder({
      showGrid3: { value: true, label: 'Show Grid' },
      subdivisionX3: { value: 10, min: 2, max: 20, step: 1, label: 'X Subdivisions' },
      subdivisionY3: { value: 10, min: 2, max: 20, step: 1, label: 'Y Subdivisions' },
      offset3: { value: 0.5, min: 0, max: 2, step: 0.1, label: 'Grid Offset' }
    }, { collapsed: false }),
    clearAllPoints: button(() => {
      clearPoints();
    }, { label: 'Clear All Points' })
  }, {
    collapsed: false
  });

  return {
    ...mainControls,
    selectionTools: {
      showSelectionCages: selectionControls.showSelectionCages,
      'Platform 1 Grid': {
        visible: selectionControls.showGrid1,
        subdivisionX: selectionControls.subdivisionX1,
        subdivisionY: selectionControls.subdivisionY1,
        offset: selectionControls.offset1
      },
      'Platform 2 Grid': {
        visible: selectionControls.showGrid2,
        subdivisionX: selectionControls.subdivisionX2,
        subdivisionY: selectionControls.subdivisionY2,
        offset: selectionControls.offset2
      },
      'Platform 3 Grid': {
        visible: selectionControls.showGrid3,
        subdivisionX: selectionControls.subdivisionX3,
        subdivisionY: selectionControls.subdivisionY3,
        offset: selectionControls.offset3
      }
    }
  };
};

// Update the type definition to match the new structure
export interface SceneControls {
  dimensions: {
    width: number;
    depth: number;
    height: number;
  };
  positioning: {
    horizontalOffset: number;
    verticalStagger: number;
    useResponsive: boolean;
  };
  view: {
    panX: number;
    panY: number;
    panZ: number;
    isAxonometric: boolean;
    cameraDistance: number;
  };
  colors: {
    linkColors: boolean;
    platform1Color: string;
    platform2Color: string;
    platform3Color: string;
  };
  pipe: {
    pipeWidth: number;
    pipeColor: string;
    pipeHeight: number;
  };
  debug: {
    showEdgePoints: boolean;
    showPipeDebug: boolean;
    showPipeLabels: boolean;
    showConstructionLines: boolean;
    showPipeMetrics: boolean;
  };
  selectionTools: {
    showSelectionCages: boolean;
    'Platform 1 Grid': {
      visible: boolean;
      subdivisionX: number;
      subdivisionY: number;
      offset: number;
    };
    'Platform 2 Grid': {
      visible: boolean;
      subdivisionX: number;
      subdivisionY: number;
      offset: number;
    };
    'Platform 3 Grid': {
      visible: boolean;
      subdivisionX: number;
      subdivisionY: number;
      offset: number;
    };
  };
} 