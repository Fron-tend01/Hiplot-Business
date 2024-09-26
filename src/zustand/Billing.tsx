
import { create } from 'zustand';

interface StoreState {

    clientToUpdate: any;
    setClientToUpdate: (x: any) => void;

    division: any;
    setDivision: (x: any) => void;

    dataBillign: any;
    setDataBillign: (x: any) => void;

    concepts: any;
    setConcepts: (x: any) => void;
}

export const storeBilling = create<StoreState>((set) => ({

    clientToUpdate: [],
    setClientToUpdate: (x) => set({clientToUpdate: x}),

    division: [],
    setDivision: (x) => set({division: x}),

    dataBillign: [],
    setDataBillign: (x) => set({dataBillign: x}),

    concepts: [],
    setConcepts: (x) => set({concepts: x}),

}));

