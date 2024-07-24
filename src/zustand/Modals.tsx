
import { create } from 'zustand';
import APIs from '../services/services/APIs';



interface StoreState {
    modal: any;
    setModal: (x: any) => void;
}

export const storeModals = create<StoreState>((set) => ({
    modal: '',
    setModal: (x) => set({modal: x}),


}));

