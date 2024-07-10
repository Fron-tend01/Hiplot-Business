
import { create } from 'zustand';
import APIs from '../services/services/APIs';

interface Views {

}

interface StoreState {
    views: Views[]
}

export const storeViews = create<StoreState>((set) => ({
    views: [],

    getViews: async (id_usuario : number, vista: string) => {
        try {
            const response = await APIs.getViews(id_usuario, vista);
      
            set({ views: response as Views[] }); 
          } catch (error) {
            console.error('Error fetching companies:', error);
          }
    }

}));

