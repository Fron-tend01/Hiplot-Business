
import { create } from 'zustand';


interface StoreState {
    toggle: boolean;
    setToggle: (x: any) => void;

    modalSub: any;
    setModalSub: (x: any) => void;

    modalSubSub: any;
    setModalSubSub: (x: any) => void;
}

export const storeHeader = create<StoreState>((set) => ({
    toggle: false,
    setToggle: (x) => set({toggle: x}),

    modalSub: '',
    setModalSub: (x) => set({modalSub: x}),

    modalSubSub: '',
    setModalSubSub: (x) => set({modalSubSub: x}),


}));

