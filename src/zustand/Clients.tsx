
import { create } from 'zustand';
import APIs from '../services/services/APIs';



interface StoreState {
    addBranchClients: any;
    setAddBranchClients: (x: any) => void;
}

export const storeClients = create<StoreState>((set) => ({
    addBranchClients: [],
    setAddBranchClients: (x) => set({addBranchClients: x}),


}));

