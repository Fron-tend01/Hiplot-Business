
import { create } from 'zustand';
import APIs from '../services/services/APIs';
import Swal from 'sweetalert2';


interface AreasXBranchOfficesXUsers {
    nombre: string,
    produccion: boolean,
    sucursal_id: number,
    sucursal: string,
    empresa: string,
    empresa_id: number
  }

interface StoreState {
areasXBranchOfficesXUsers: AreasXBranchOfficesXUsers[];
}

export const storeAreas = create<StoreState>((set) => ({
    areasXBranchOfficesXUsers: [],

   // Areas

   createAreas: async (sucursal_id: number, nombre: string, produccion: boolean, id_usuario: number, paf: boolean) => {
    try {
      const response = await APIs.createAreas(sucursal_id, nombre, produccion, id_usuario, paf);
      Swal.fire('Area creada exitosamente', '', 'success');
      console.log('Area creada', response)

    } catch (error) {
      Swal.fire('Error', 'Hubo un error al crear la area', 'error');
      console.error('Error creating Areas', error);
    }
  },

  getAreasXBranchOfficesXUsers: async (sucursal_id: number, user_id: number) => {
    try {
      const response = await APIs.getAreasXBranchOfficesXUsers(sucursal_id, user_id);
      set({areasXBranchOfficesXUsers: response as AreasXBranchOfficesXUsers[]})
    } catch (erro) {

    }
  },
  
  updateAreas: async (id: number, sucursal_id: number, nombre: string, produccion: boolean, id_usuario: number,paf: boolean,) => {
    try {
      await APIs.apdateAreas(id, sucursal_id, nombre, produccion, id_usuario, paf)
      Swal.fire('Area actualizada exitosamente', '', 'success');
    } catch (error) {
      Swal.fire('Error', 'Hubo un error al actualizar la area', 'error');
      console.error('Error actualizar areas', error);
    }
  },


}));



