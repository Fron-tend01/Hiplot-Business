
import { create } from 'zustand';
import APIs from '../services/services/APIs';
import Swal from 'sweetalert2';


interface Families{
    id: number,
    nombre: string,
    id_empresa: number,
    empresa: string,
    campos: any[]
  }
  

interface StoreState {
    families: Families[];
    sections: any[];
}

export const storeFamilies = create<StoreState>((set) => ({
    families: [],
    sections: [],

  // Familias 

  createFamilies: async (data: {nombre: string}, data_ext: {arr1_nuevas: any[], arr1_eliminar: any[]}) => {
    try {
      await APIs.createFamilies(data, data_ext)
      Swal.fire('Familia creada exitosamente', '', 'success');
    } catch (error) {
      console.error('Ocurrió un error al crear la familia', error);
    }
  },

  getFamilies: async (id: number) => {
    try {
       const response = await APIs.getFamilies(id);
       set({families: response as Families[]})
       return response;
    } catch {

    }
  },

  getSections: async (id: number) => {
    try {
       const response = await APIs.getSections(id);
       set({sections: response as any[]})
    } catch {

    }
  },


  



}));



