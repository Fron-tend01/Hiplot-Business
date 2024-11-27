
import { create } from 'zustand';

interface StoreState {

    DataUpdate: any;
    setDataUpdate: (x: any) => void;

    modoUpdate: boolean;
    setModoUpdate: (x: boolean) => void;

    division: any;
    setDivision: (x: any) => void;

    dataBillign: any;
    setDataBillign: (x: any) => void;

    dates: any;
    setDates: (x: any) => void;

    concepts: any;
    setConcepts: (x: any) => void;
}

export const storeBilling = create<StoreState>((set) => ({

    DataUpdate: [],
    setDataUpdate: (x) => set({ DataUpdate: x }),

    modoUpdate: false,
    setModoUpdate: (x) => set({ modoUpdate: x }),

    division: [],
    setDivision: (x) => set({ division: x }),

    dates: [],
    setDates: (x) => set({ dates: x }),
    
    dataBillign: [],
    setDataBillign: (x) => set({ dataBillign: x }),

    concepts: [],
    setConcepts: (x) => set({ concepts: x }),

}));

