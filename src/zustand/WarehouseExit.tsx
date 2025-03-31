import { create } from 'zustand';

interface StoreState {

  warning: any;
  setWarning: (warning: any) => void;

  dates: any;
  setDates: (x: any) => void;


  modal: any;
  setModal: (x: any) => void;

  selectedBranchOffice: any;
  setSelectedBranchOffice: (x: any) => void;

  selectedStore: any;
  setSelectedStore: (selectedStore: any) => void;

  concepts: any[];
  setConcepts: (concepts: any[]) => void;

  warehouseExit: any[];
  setWarehouseExit: (warehouseExit: any[]) => void;
}


const hoy = new Date();
const haceUnaSemana = new Date();
haceUnaSemana.setDate(hoy.getDate() - 30);
export const storeWarehouseExit = create<StoreState>((set) => ({

  
  warning: [],
  setWarning: (warning) => set({ warning }),

    
  warehouseExit: [],
  setWarehouseExit: (x) => set({ warehouseExit: x }),

  dates: [haceUnaSemana.toISOString().split('T')[0], hoy.toISOString().split('T')[0]],
  setDates: (x) => set({ dates: x }),

  modal: '',
  setModal: (x) => set({ modal: x }),

  selectedBranchOffice: '',
  setSelectedBranchOffice: (x) => set({ selectedBranchOffice: x }),

  selectedStore: null,
  setSelectedStore: (selectedStore) => set({ selectedStore }),


  concepts: [],
  setConcepts: (concepts) => set({ concepts }),
}));
