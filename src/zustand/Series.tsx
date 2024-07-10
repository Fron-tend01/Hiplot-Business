
import { create } from 'zustand';
import APIs from '../services/services/APIs';
import Swal from 'sweetalert2';


interface Series {
    id: number;
    nombre: string;
}
  
interface StoreState {
series: Series[];
}

export const storeSeries = create<StoreState>((set) => ({
    series: [],


  // Series

  getSeriesXUser: async (id: number) => {
    try {
      const response = await APIs.getSeriesXUser(id);
      set({ series: response as Series[] }); // Asegúrate de convertir el tipo
    } catch (error) {
      console.error('Error fetching Series', error);
    }
  },

  createSeries: async (sucursal_id: number, nombre: string, tipo: number) => {
    try {
      const response = await APIs.createSeries(sucursal_id, nombre, tipo);
      Swal.fire('Serie creada exitosamente', '', 'success');
      console.log('Serie creada', response)
    } catch (error) {
      Swal.fire('Error', 'Hubo un error al crear la serie', 'error');
      console.error('Error en crear la serie', error);
    }
  },

  updateSeries: async (id: string, sucursal_id: number, nombre: string, tipo: number) => {
    try {
      await APIs.updateSeries(id, sucursal_id, nombre, tipo)
      Swal.fire('Serie actualizada exitosamente', '', 'success');
    } catch (error) {
      Swal.fire('Error', 'Hubo un error al actualizar la serie', 'error');
      console.error('Error en actualizar la serie', error);
    }

  },



}));



