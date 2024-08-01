
import { create } from 'zustand';
import APIs from '../services/services/APIs';



interface StoreState {
    IdArticle: any;
    setIdArticle: (x: any) => void;
}

export const storeSaleCard = create<StoreState>((set) => ({
    IdArticle: [],
    setIdArticle: (x) => set({IdArticle: x}),


}));

