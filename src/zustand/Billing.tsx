
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

    conceptsBack: any;
    setConceptsBack: (x: any) => void;

    billing: any;
    setBilling: (x: any) => void;
}

export const storeBilling = create<StoreState>((set) => ({

    billing: { billing: {}, normal_concepts: [], personalized_concepts: [], normal_concepts_eliminate: [], personalized_concepts_eliminate: [] },
    setBilling: (x) =>
        set((state) => ({
            billing: {
                ...state.billing,
                ...x,
            },
        })),


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

    conceptsBack: [],
    setConceptsBack: (x) => set({ conceptsBack: x }),

}));

