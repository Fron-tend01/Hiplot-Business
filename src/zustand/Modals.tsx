
import { create } from 'zustand';


interface StoreState {
    modal: any;
    setModal: (x: any) => void;

    modalSub: any;
    setModalSub: (x: any) => void;

    modalSubSub: any;
    setModalSubSub: (x: any) => void;
}

export const storeModals = create<StoreState>((set) => ({
    modal: '',
    setModal: (x) => set({modal: x}),

    modalSub: '',
    setModalSub: (x) => set({modalSub: x}),

    modalSubSub: '',
    setModalSubSub: (x) => set({modalSubSub: x}),


}));

