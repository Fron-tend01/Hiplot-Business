
import { create } from 'zustand';

interface StoreState {

    clientToUpdate: any;
    setClientToUpdate: (x: any) => void;

}

export const storeBilling = create<StoreState>((set) => ({

    clientToUpdate: [],
    setClientToUpdate: (x) => set({clientToUpdate: x}),

}));

