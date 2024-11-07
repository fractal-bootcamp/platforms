import { useControls, folder } from 'leva';

export const useSceneControls = () => {
  return useControls({
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
      isAxonometric: { value: false, label: 'Axonometric View' },
      cameraDistance: { value: 10, min: 5, max: 20, step: 0.5 },
      panX: { value: 0, min: -10, max: 10, step: 0.5, label: 'Pan Horizontal' },
      panY: { value: 0, min: -10, max: 10, step: 0.5, label: 'Pan Vertical' },
      panZ: { value: 0, min: -10, max: 10, step: 0.5, label: 'Pan Depth' }
    }),
    colors: folder({
      linkColors: { value: false, label: 'Use Same Color' },
      platform1Color: { value: '#a8d5ff' },
      platform2Color: { value: '#98ffb3' },
      platform3Color: { value: '#ffb3b3' },
    }),
  });
}; 