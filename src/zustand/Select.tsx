import create from 'zustand';

interface SelectStore {

    selects: any; // Mapa de IDs seleccionados por instancia
    setSelects: (instanceId: any, id: any) => void;

  selectedIds: any[]; // Mapa de IDs seleccionados por instancia
  setSelectedId: (instanceId: any, id: any) => void;
}

export const useSelectStore = create<SelectStore>((set) => ({
  selectedIds: [],
  setSelectedId: (instanceId, id) =>
    set((state) => ({
      selectedIds: { ...state.selectedIds, [instanceId]: id },
    })),

      //Modal
      selects: false,
      setSelects: (modal) => set({ selects: modal }),
}));
