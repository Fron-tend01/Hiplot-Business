import create from 'zustand';

interface SelectStore {
  selectedIds: any[]; // Mapa de IDs seleccionados por instancia
  setSelectedId: (instanceId: any, id: any) => void;
}

export const useSelectStore = create<SelectStore>((set) => ({
  selectedIds: [],
  setSelectedId: (instanceId, id) =>
    set((state) => ({
      selectedIds: { ...state.selectedIds, [instanceId]: id },
    })),
}));
