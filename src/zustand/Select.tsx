import create from 'zustand';

interface SelectStore {
  selectedIds: { [key: string]: number | null }; // Mapa de IDs seleccionados por instancia
  setSelectedId: (instanceId: string, id: number) => void;
}

export const useSelectStore = create<SelectStore>((set) => ({
  selectedIds: {},
  setSelectedId: (instanceId, id) =>
    set((state) => ({
      selectedIds: { ...state.selectedIds, [instanceId]: id },
    })),
}));
