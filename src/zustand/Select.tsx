import create from 'zustand';

interface SelectStore {
  selectedIds: any; // Mapa de IDs seleccionados por instancia
  setSelectedId: (instanceId: string, id: number) => void;
}

export const useSelectStore = create<SelectStore>((set) => ({
  selectedIds: null,
  setSelectedId: (instanceId, id) =>
    set((state) => ({
      selectedIds: { ...state.selectedIds, [instanceId]: id },
    })),
}));
