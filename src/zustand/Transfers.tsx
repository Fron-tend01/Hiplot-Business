
import { create } from 'zustand';
import APIs from '../services/services/APIs';
import Swal from 'sweetalert2';


interface Store {
    id: number,
    nombre: string,
    sucursales: []
  }
  
interface StoreTransfers {
    store: Store[];
    //Sucursals
    modalStateCreate: any;
    setModalStateCreate: (modal: any) => void;

    //Sucursals
    modalStateSee: any;
    setModalStateSee: (modal: any) => void;

    transfer: any;
    setTransfers: (x: any) => void;

    dataTransfer: any;
    setDataTransfer: (data: any) => void;

    dates: any;
    setDates: (data: any) => void;
    
    storeToUpdate: any;
    setStoreToUpdate: (store: any) => void;


}



export const storeTransfers = create<StoreTransfers>((set) => ({
    store: [],
    

    modalStateCreate: '',
    setModalStateCreate: (modal) => set({ modalStateCreate: modal }),


    modalStateSee: '',
    setModalStateSee: (modal) => set({ modalStateSee: modal }),

    
    transfer: [],
    setTransfers: (x) => set({ transfer: x }),

    dates: [],
    setDates: (x) => set({ dates: x }),


    dataTransfer: '',
    setDataTransfer: (data) => set({ dataTransfer: data }),

    storeToUpdate: false,
    setStoreToUpdate: (store) => set({ storeToUpdate: store }),


}));



