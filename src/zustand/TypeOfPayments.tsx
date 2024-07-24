
import { create } from 'zustand';
import APIs from '../services/services/APIs';



interface StoreState {
    typeOfPaymentToUpdate: any;
    setTypeOfPaymentToUpdate: (x: any) => void;
}

export const storeTypeOfPayments = create<StoreState>((set) => ({
    typeOfPaymentToUpdate: '',
    setTypeOfPaymentToUpdate: (x) => set({typeOfPaymentToUpdate: x}),


}));

