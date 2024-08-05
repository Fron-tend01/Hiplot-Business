
import { create } from 'zustand';
import APIs from '../services/services/APIs';



interface StoreState {
    modalSalesCard: any;
    setModalSalesCard: (x: any) => void;

    dataQuotation: any;
    setDataQuotation: (x: any) => void;
    
    IdArticle: any;
    setIdArticle: (x: any) => void;
}

export const storeSaleCard = create<StoreState>((set) => ({
    IdArticle: [],
    setIdArticle: (x) => set({IdArticle: x}),

    dataQuotation: null,       
    setDataQuotation: (x) => set({dataQuotation: x}),

    modalSalesCard: '',
    setModalSalesCard: (x) => set({modalSalesCard: x}),


}));

