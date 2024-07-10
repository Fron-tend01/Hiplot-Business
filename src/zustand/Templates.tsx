import { create } from 'zustand';
import APIs from '../services/services/APIs';
import Swal from 'sweetalert2';


interface Templates {
    id: number,
    nombre: string,
    id_empresa: number,
    campos: any[]
}

interface StoreState {
    templates: Templates[];
}

export const storeTemplates = create<StoreState>((set) => ({
    templates: [],

  // Plantillas

  createTemplates: async (data: {nombre: string, id_empresa: number}, data_ext: {nombre: string, tipo: string, id_plantilla: number}) => {
    try {
      await APIs.crateTemplates(data, data_ext)
      Swal.fire('Plantilla creada exitosamente', '', 'success');
    } catch (error) {
      console.error('Ocurrió un error al crear la plantilla', error);
    }
  },

  getTemplates: async (id: number) => {
    try {
      const response = await APIs.getTemplates(id)
      set({templates: response as Templates[]})
    } catch (error) {
      console.error('Ocurrió un error al traer la plantilla', error);
    }
  },

  updateTemplates: async (id: number, data: {nombre: string, id_empresa: number}, data_nuevo: [{nombre: string, tipo: string, id_plantilla: number}], data_eliminar: any[]) => {
    try {
      await APIs.updateTemplates(id, data, data_nuevo, data_eliminar)
      Swal.fire('Plantilla actualizada exitosamente', '', 'success');
    } catch (error) {
      console.error('Ocurrió un error al actualizar la plantilla', error);
    } 
  },



}));
