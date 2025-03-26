
import { create } from 'zustand';


interface StoreState {

    quotes: any;
    setQuotes: (x: any) => void;



    quotesPers: any;
    setQuotesPers: (x: any) => void;

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

    camposPlantillas: any;
    setCamposPlantillas: (x: any) => void;
    camposPlantillasModal: any;
    setCamposPlantillasModal: (x: any) => void;
}

export const storeQuotation = create<StoreState>((set) => ({


    quotes: { quotes: {}, normal_concepts: [], personalized_concepts: [], normal_concepts_eliminate: [], personalized_concepts_eliminate: [] },
    setQuotes: (prev) =>
        set((state) => ({
            quotes: {
                ...state.quotes,
                ...prev,
            },
        })),

    quotesPers: [],
    setQuotesPers: (x) => set({ quotesPers: x }),

    clientsModal: '',
    setClientsModal: (x) => set({ clientsModal: x }),

    quatation: [],
    setQuatation: (x) => set({ quatation: x }),

    identifier: 0,
    setIdentifier: (x) => set({ identifier: x }),

    client: null,
    setClient: (x) => set({ client: x }),

    quotesData: [],
    setQuotesData: (x) => set({ quotesData: x }),

    dataGet: {},
    setDataGet: (x) => set({ dataGet: x }),

    camposPlantillas: '',
    setCamposPlantillas: (x) => set({ camposPlantillas: x }),
    camposPlantillasModal: '',
    setCamposPlantillasModal: (x) => set({ camposPlantillasModal: x }),
}));

