import create from 'zustand';

interface SelectStore {
  personalizedModal: any;
  setPersonalizedModal: (x: any) => void;

  identifier: any;
  setIdentifier: (x: any) => void;

}

export const storePersonalized = create<SelectStore>((set) => ({
  personalizedModal: '',
  setPersonalizedModal: (x) => set({ personalizedModal: x }),

  
  identifier: '',
  setIdentifier: (x) => set({identifier: x}),
}));
  
