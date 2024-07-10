import { create } from 'zustand';
import APIs from '../services/services/APIs';
import Swal from 'sweetalert2';

interface TypesUsers {
    id: number,
    nombre: string,
    empresa: string,
    id_empresa: number,
    permisos: []
  }
  
  interface UsersTypesStructure {
    id: number,
    titulo: string,
    componentes: []
  }
  
  interface TypesUsersXCompanies {
    id: number,
    nombre: string,
    permisos: []
  }
  
  

interface StoreState {
  typesUsers: TypesUsers[];
  usersTypesStructure: UsersTypesStructure[];
  typesUsersXCompanies: TypesUsersXCompanies[];
}


export const storeTypesUsers = create<StoreState>((set) => ({
  typesUsers: [],
  usersTypesStructure: [],
  typesUsersXCompanies: [],

  // Tipo de usuario 

  createTypesUsers: async (data: {nombre: string, id_empresa: number, id_usuario: number}, permisos: any[]) => {
    try{
      await APIs.createTypesUsers(data, permisos)
      Swal.fire('Tipo de usuario creado exitosamente', '', 'success');
    } catch {
      Swal.fire('Error', 'Hubo un error al crear el tipo de usuario', 'error');
    }
  },

  
  getTypesUsers: async (id: number) => {
    try {
      const response = await APIs.getTypesUsers(id);
      set({ typesUsers: response as TypesUsers[] });
      
    } catch (error) {
      // Manejar el error si la promesa es rechazada
      console.error('Ocurrió un error al obtener los tipos de usuarios:', error);
    }
  },
  

  getUsersTypesStructure: async (customPath?: string) => {
    try {
      const response = await APIs.getUsersTypesStructure(customPath)
      set({usersTypesStructure: response as UsersTypesStructure[]})
 
    } catch (error) {
      console.log('Error',error)
    }
  },

  updateTypesUsers: async (id: number, data: {nombre: string, id_empresa: number, id_usuario: number}, data_permisos: { arr1_nuevas: any[], arr1_eliminar: any[]},) => {
    try {
      await APIs.updateTypesUsers(id, data, data_permisos)
      Swal.fire('Tipo de usuario actualizado exitosamente', '', 'success');
    } catch {

    }
  },


  getTypesUsersXCompanies: async (id: number) => {
    try {
      const response = await  APIs.getTypesUsersXCompanies(id);
      set({ typesUsersXCompanies: response as TypesUsersXCompanies[] });
      console.log('Data del store', response); // Aquí puedes acceder directamente a 'response'
    } catch (error) {
      // Manejo de errores
    }
  },



}));
