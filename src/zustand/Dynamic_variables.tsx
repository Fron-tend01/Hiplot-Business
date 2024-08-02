
import { create } from 'zustand';
import APIs from '../services/services/APIs';



interface StoreState {
    empresa: any;
    setEmpresa: (x: any) => void;

    sucursal: any;
    setSucursal: (x: any) => void;
}

export const storeDv = create<StoreState>((set) => ({
    empresa: '',
    setEmpresa: (x) => set({empresa: x}),

    sucursal: '',
    setSucursal: (x) => set({sucursal: x}),
}));