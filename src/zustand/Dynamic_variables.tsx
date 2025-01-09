
import { create } from 'zustand';



interface StoreState {
    empresa: any;
    setEmpresa: (x: any) => void;

    sucursal: any;
    setSucursal: (x: any) => void;

    articulos: any[];
    setArticulos: (updateFunc: any[] | ((prevArray: any[]) => any[])) => void;

    index: any;
    setIndex: (x: any) => void;

    dataDynamic: any;
    setDataDynamic: (updateFunc: any[] | ((prevArray: any[]) => any[])) => void;
}

export const storeDv = create<StoreState>((set) => ({
    empresa: '',
    setEmpresa: (x) => set({empresa: x}),

    sucursal: '',
    setSucursal: (x) => set({sucursal: x}),

    articulos: [],
    setArticulos: (updateFunc) => set((state) => ({
        articulos: typeof updateFunc === 'function' ? updateFunc(state.articulos) : updateFunc,
      })),

    index: null,
    setIndex: (x) => set({index: x}),

    dataDynamic: '',
    setDataDynamic: (updateFunc) => set((state) => ({
        articulos: typeof updateFunc === 'function' ? updateFunc(state.dataDynamic) : updateFunc,
      }))
    }));

    