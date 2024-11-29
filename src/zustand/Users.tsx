
import { create } from 'zustand';
import APIs from '../services/services/APIs';
import Swal from 'sweetalert2';



interface Users {
    id: number,
    sucursal_id: number,
    nombre: string,
    email: string,
    password: string,
    tipo_us: number,
    notificar_recordatorio: number,
    notificar_anticipo: number
}
  
  interface UserUpdate {
    id: number,
    sucursal_id: number,
    nombre: string,
    email: string,
    password: string,
    tipo_us: number,
    sucursales_nuevas: [],
    sucursales_eliminar: [],
    // areas_nuevas: [],
    areas_eliminar: [],
    subordinados_nuevos: [],
    subordinados_eliminar: [],
    grupos_nuevos: [];
    grupos_eliminar: [];
}

interface StoreState {
    users: Users[];
    userUpdate: UserUpdate[];
}

export const storeUsers = create<StoreState>(() => ({
    userUpdate: [],
    users: [],

   // Usuarios
 
    createUsers: async (data_user: {sucursal_id: number, nombre: string, email: string, password: string, tipo_us: number, id_usuario_crea: number}, data_ext: {sucursales_nuevas: any[], sucursales_eliminar: any[], areas_nuevas: any[], areas_eliminar: any[], subordinados_nuevos: any[], subordinados_eliminar: any[], grupos_nuevos: any[], grupos_eliminar: any[] }) => {
        try {
        await APIs.createUsers(data_user, data_ext)
        Swal.fire('Usuario creado exitosamente', '', 'success');
        } catch (error) {
        Swal.fire('Error', 'Hubo un error al crear el usuario', 'error');
        }
    },


    // getUsers: async (nombre: string, id_usuario: number, id_usuario_consulta: number, light: boolean, id_sucursal: number) => {
    //     try {
    //     // Ajusta la llamada a la función getUsers para manejar el nombre opcionalmente
    //     const response = await APIs.getUsers(nombre, id_usuario, id_usuario_consulta, light, id_sucursal);
    //     set({ users: response as Users[] });
        
    //     } catch (error) {
    //     console.log('Error de Usuarios', error);
    //     }
    // },
  
    putUsers: async (user_id : number, sucursal_id: number, nombre: string, email: string, password: string, tipo_us: number, 
        sucursales_nuevas: any[], sucursales_eliminar: any[], areas_nuevas: any[], areas_eliminar: any[], subordinados_nuevos: any[], subordinados_eliminar: any[]
        , grupos_nuevos: any[], grupos_eliminar: any[],usuarios_comercial: any[], usuarios_comercial_eliminar: any[]) => {
        try {
        await APIs.putUsers(user_id , sucursal_id, nombre, email, password, tipo_us, sucursales_nuevas, 
            sucursales_eliminar, areas_nuevas, areas_eliminar, subordinados_nuevos, subordinados_eliminar, grupos_nuevos, grupos_eliminar,usuarios_comercial,usuarios_comercial_eliminar)
        Swal.fire('Usuario actualizada exitosamente', '', 'success');
        } catch (error) {
        console.log('Error al actualizar el usuario',error)
        }
    },


}));



