
import { create } from 'zustand';
import APIs from '../services/services/APIs';



interface StoreState {
    clientsModal: any;
    setClientsModal: (x: any) => void;

    client: any;
    setClient: (x: any) => void;

    quatation: any;
    setQuatation: (x: any) => void;
}

export const storeQuotation = create<StoreState>((set) => ({
    clientsModal: '',
    setClientsModal: (x) => set({clientsModal: x}),

    quatation: [],
    setQuatation: (x) => set({quatation: x}),

    client: null,
    setClient: (x) => set({client: x}),


}));

