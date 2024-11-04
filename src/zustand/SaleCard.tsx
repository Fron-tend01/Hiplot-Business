
import { create } from 'zustand';


interface StoreState {
    modalSalesCard: any;
    setModalSalesCard: (x: any) => void;

    dataQuotation: any;
    setDataQuotation: (x: any) => void;



 
    
    IdArticle: any;
    setIdArticle: (x: any) => void;

    article: any;
    setArticle: (x: any) => void;
}

export const storeSaleCard = create<StoreState>((set) => ({
    IdArticle: {},
    setIdArticle: (x) => set({IdArticle: x}),

    dataQuotation: null,       
    setDataQuotation: (x) => set({dataQuotation: x}),

    article: null,       
    setArticle: (x) => set({article: x}),


    modalSalesCard: '',
    setModalSalesCard: (x) => set({modalSalesCard: x}),





}));
