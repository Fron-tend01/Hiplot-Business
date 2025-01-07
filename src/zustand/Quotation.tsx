
import { create } from 'zustand';


interface StoreState {
    clientsModal: any;
    setClientsModal: (x: any) => void;

    client: any;
    setClient: (x: any) => void;

    quatation: any;
    setQuatation: (x: any) => void;

    identifier: any;
    setIdentifier: (x: any) => void;

    quotesData: any;
    setQuotesData: (x: any) => void;

    dataGet: any;
    setDataGet: (x: any) => void;

   
}

export const storeQuotation = create<StoreState>((set) => ({
    clientsModal: '',
    setClientsModal: (x) => set({clientsModal: x}),

    quatation: [],
    setQuatation: (x) => set({quatation: x}),

    identifier: 0,
    setIdentifier: (x) => set({identifier: x}),

    client: null,
    setClient: (x) => set({client: x}),

    quotesData: [],
    setQuotesData: (x) => set({quotesData: x}),

    dataGet: {},
    setDataGet: (x) => set({dataGet: x}),


}));

