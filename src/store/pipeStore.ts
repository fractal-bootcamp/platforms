import create from 'zustand';
import { Vector3 } from 'three';

export interface SelectedPoint {
  id: string;
  position: Vector3;
  platformId: number;
}

interface PipeStore {
  selectedPoints: SelectedPoint[];
  addPoint: (point: SelectedPoint) => void;
  removePoint: (id: string) => void;
  updatePoint: (id: string, newPosition: Vector3) => void;
  clearPoints: () => void;
}

export const usePipeStore = create<PipeStore>((set) => ({
  selectedPoints: [],
  addPoint: (point) => 
    set((state) => ({
      selectedPoints: [...state.selectedPoints, point]
    })),
  removePoint: (id) =>
    set((state) => ({
      selectedPoints: state.selectedPoints.filter(p => p.id !== id)
    })),
  updatePoint: (id, newPosition) =>
    set((state) => ({
      selectedPoints: state.selectedPoints.map(p => 
        p.id === id ? { ...p, position: newPosition } : p
      )
    })),
  clearPoints: () => set({ selectedPoints: [] })
})); 