
import { create } from 'zustand';
import APIs from '../services/services/APIs';



interface StoreState {

    clientToUpdate: any;
    setClientToUpdate: (x: any) => void;

    addBranchClients: any;
    setAddBranchClients: (x: any) => void;
}

export const storeClients = create<StoreState>((set) => ({

    clientToUpdate: [],
    setClientToUpdate: (x) => set({clientToUpdate: x}),

    addBranchClients: [],
    setAddBranchClients: (x) => set({addBranchClients: x}),


}));

