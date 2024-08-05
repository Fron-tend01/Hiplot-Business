import create from 'zustand';

interface SelectStore {
  personalizedModal: any;
  setPersonalizedModal: (x: any) => void;
}

export const storePersonalized = create<SelectStore>((set) => ({
  personalizedModal: '',
  setPersonalizedModal: (x) => set({ personalizedModal: x }),
}));
  
