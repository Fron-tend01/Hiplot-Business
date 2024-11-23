
import { create } from 'zustand';


interface StoreState {
    modal: any;
    setModal: (x: any) => void;

}

export const storeSales = create<StoreState>((set) => ({
    modal: '',
    setModal: (x) => set({modal: x}),


}));

