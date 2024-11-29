
import { create } from 'zustand';

interface StoreState {
    productionToUpdate: any;
    setProductionToUpdate: (x: any) => void;

}

export const storeProduction = create<StoreState>((set) => ({
    productionToUpdate: [],
    setProductionToUpdate: (x) => set({productionToUpdate: x}),



}));

