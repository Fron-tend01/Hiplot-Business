import { create } from "zustand";
import APIs from "../services/services/APIs";
import Swal from 'sweetalert2';


interface CompaniesXUsers {
  id: number;
  nombre_comercial: string;
  razon_social: string;
}

interface StoreState {
  companiesXUsers: CompaniesXUsers[];
}

export const storeCompanies = create<StoreState>((set) => ({
  companiesXUsers: [],
  
  // Empresas

  createCompanies: async (razon_social: string, nombre_comercial: string, id_usuario: number) => {
    try {
      const response = await APIs.createCompanies(razon_social, nombre_comercial, id_usuario);
      Swal.fire('Empresa creada exitosamente', '', 'success');
      console.log('Empresa creada:', response);
    } catch (error) {
      console.error('Error creating company:', error);
      Swal.fire('Error', 'Hubo un error al crear la empresa', 'error');
    }
  },

  getCompaniesXUsers: async (id: number) => {
    try {
      const response = await APIs.getCompaniesXUsers(id);

      set({ companiesXUsers: response as CompaniesXUsers[] }); // Asegúrate de convertir el tipo
      return response
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  },

  updateCompanies: async (id: number, razon_social: string, nombre_comercial: string, id_usuario: number) => {
    try {
      await APIs.putUpdateCompanies(id, razon_social, nombre_comercial, id_usuario);
      Swal.fire('Empresa actualizada exitosamente', '', 'success');
      console.log('Empresa actualizada correctamente');
    } catch (error) {
      Swal.fire('Error', 'Hubo un error al actualizar la empresa', 'error');
      console.error('Error al actualizar la empresa:', error);
      // Manejo de errores
    }
  },


  // Sucursales
}));

