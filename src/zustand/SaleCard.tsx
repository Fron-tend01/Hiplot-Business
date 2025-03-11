
import { create } from 'zustand';


interface StoreState {
    modalSalesCard: any;
    setModalSalesCard: (x: any) => void;

    dataQuotation: any;
    setDataQuotation: (x: any) => void;

    dataPersonalized: any;
    setDataPersonalized: (x: any) => void;

 
    
    IdArticle: any;
    setIdArticle: (x: any) => void;

    combinacionesSeleccionadas: any;
    setCombinacionesSeleccionadas: (x: any) => void;

    article: any;
    setArticle: (x: any) => void;

    statusArticle: any;
    setStatusArticle: (x: any) => void;
}

export const storeSaleCard = create<StoreState>((set) => ({
    IdArticle: {},
    setIdArticle: (x) => set({IdArticle: x}),

    combinacionesSeleccionadas: [],
    setCombinacionesSeleccionadas: (x) => set({combinacionesSeleccionadas: x}),

    dataQuotation: [],       
    setDataQuotation: (x) => set({dataQuotation: x}),

    dataPersonalized: [],       
    setDataPersonalized: (x) => set({dataPersonalized: x}),

    article: null,       
    setArticle: (x) => set({article: x}),


    statusArticle: false,       
    setStatusArticle: (x) => set({statusArticle: x}),

    modalSalesCard: '',
    setModalSalesCard: (x) => set({modalSalesCard: x}),





}));
