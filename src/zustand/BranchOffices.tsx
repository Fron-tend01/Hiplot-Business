import { create } from 'zustand';
import APIs from '../services/services/APIs';
import Swal from 'sweetalert2';


interface BranchOfficeXCompanies {
    id: number,
    nombre: string,
    direccion: string,
    contacto: string,
    empresa_id: number
  }
  
  

interface StoreState {
    branchOfficeXCompanies: BranchOfficeXCompanies[];



}


export const storeBranchOffcies = create<StoreState>((set) => ({
    branchOfficeXCompanies: [],

  // Sucursales

  getBranchOfficeXCompanies: async (empresa_id : number, id_usuario : number,) => {
    try {
      const response = await APIs.getBranchOfficesXCompanies(empresa_id, id_usuario);
      set({ branchOfficeXCompanies: response as BranchOfficeXCompanies[] });
    } catch (error) {
      console.error('Error fetching branch office:', error);
    }
  },

  updateBranchOffices: async (id: number, nombre: string, direccion: string, contacto: string, empresa_id: number, id_usuario: number) => {
    try {
      await APIs.updateBranchOffices(id, nombre, direccion, contacto, empresa_id, id_usuario)
      Swal.fire('La sucursal fue actualizada exitosamente', '', 'success');
    } catch (error) {
      Swal.fire('Error', 'Hubo un error al actualizar la sucursal', 'error');
      console.error('Error al actualizar la sucursal', error);
    }
  },
  
  createBranchOffices: async (nombre: string, direccion: string, contacto: string, empresa_id: number) => {
    try {
      const response = await APIs.createBrachOffices(nombre, direccion, contacto, empresa_id);
      Swal.fire('Sucursal creada exitosamente', '', 'success');
      console.log('Sucursal creada', response)
     
    } catch (error) {
      Swal.fire('Error', 'Hubo un error al crear la sucursal', 'error');
      console.error('Error creating sucursal:', error);
    }
  },


}));
