
import { create } from 'zustand';


interface StoreState {
    clientToUpdate: any[];
    setClientToUpdate: (x: any) => void;

    addBranchClients: any[];
    setAddBranchClients: (updateFunc: any[] | ((prevArray: any[]) => any[])) => void;

    branchClientsRemove: any[];
    setBranchClientsRemove: (updateFunc: any[] | ((prevArray: any[]) => any[])) => void;
}

export const storeClients = create<StoreState>((set) => ({
    clientToUpdate: [],
    setClientToUpdate: (x) => set({ clientToUpdate: x }),

    addBranchClients: [],
    setAddBranchClients: (x) =>
        set((state) => ({
            addBranchClients: typeof x === "function" ? x(state.addBranchClients) : x,
        })),
    branchClientsRemove: [],
    setBranchClientsRemove: (x) =>
        set((state) => ({
            branchClientsRemove: typeof x === "function" ? x(state.branchClientsRemove) : x,
        })),
}));

