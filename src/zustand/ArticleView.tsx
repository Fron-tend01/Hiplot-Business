
import { create } from 'zustand';

interface StoreState {
    modalArticleView: any;
    setModalArticleView: (x: any) => void;
    

}

export const storeArticleView = create<StoreState>((set) => ({

    modalArticleView: '',
    setModalArticleView: (x) => set({modalArticleView: x}),


}));

