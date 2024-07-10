import { create } from 'zustand';

interface StoreState {

  warning: any;
  setWarning: (warning: any) => void;

  selectedStore: any;
  setSelectedStore: (selectedStore: any) => void;

  concepts: any[];
  setConcepts: (concepts: any[]) => void;
}

export const storeWarehouseExit = create<StoreState>((set) => ({
  warning: [],
  setWarning: (warning) => set({ warning }),

  selectedStore: null,
  setSelectedStore: (selectedStore) => set({ selectedStore }),


  concepts: [],
  setConcepts: (concepts) => set({ concepts }),
}));
