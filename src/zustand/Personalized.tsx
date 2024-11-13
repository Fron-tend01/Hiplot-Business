import create from 'zustand';

interface SelectStore {
  personalizedModal: any;
  setPersonalizedModal: (x: any) => void;

  identifier: any;
  setIdentifier: (x: any) => void;

  dataUpdate: any;
  setDataUpdate: (x: any) => void;

}

export const storePersonalized = create<SelectStore>((set) => ({
  personalizedModal: '',
  setPersonalizedModal: (x) => set({ personalizedModal: x }),

  dataUpdate: {},
  setDataUpdate: (x) => set({ dataUpdate: x }),

  identifier: '',
  setIdentifier: (x) => set({identifier: x}),
}));
  
