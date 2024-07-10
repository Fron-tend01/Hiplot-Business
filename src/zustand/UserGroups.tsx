import { create } from 'zustand';
import APIs from '../services/services/APIs';
import Swal from 'sweetalert2';

interface UserGroups {
    nombre: string,
    id_empresa: number,
    empresa: string
  }
  
  
  

interface StoreState {
    userGroups: UserGroups[];
}


export const storeUserGroups = create<StoreState>((set) => ({
    userGroups: [],

  
  // Grupos de usuarios

  createUserGroups: async (nombre: string, id_empresa: number, id_usuario: number) => {
    try {
      const response = await APIs.createUserGroups(nombre, id_empresa, id_usuario)
      Swal.fire('Grupo de usuario creado exitosamente', '', 'success'); 
      console.log('Grupo de usuario creado', response)
    } catch (error) {
      Swal.fire('Error', 'Hubo un error al crear el grupo de usuario', 'error');
      console.error('Error en crear el grupo de usuario', error);
    }
  },

  getUserGroups: async (id: number) => {
    try {
      const response = await  APIs.getUserGroups(id);
      set({userGroups: response as UserGroups[]})
    } catch {

    }
  },

  updateUserGroups: async (id: number, nombre: string, id_empresa: number, id_usuario: string,) => {
    
    try { 
      await APIs.updateUserGroups(id, nombre, id_empresa, id_usuario)
      Swal.fire('Grupo de usuario actualizada exitosamente', '', 'success');
    } catch (error) {
      Swal.fire('Error', 'Hubo un error al actualizar el grupo de usuario', 'error');
      console.error('Error en actualizar el grupo de usuario', error);
    }
  },


}));
