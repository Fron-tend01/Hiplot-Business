
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
    areas_nuevas: [],
    areas_eliminar: [],
    subordinados_nuevos: [],
    subordinados_eliminar: [],
    grupos_nuevos: [];
    grupos_eliminar: [];
}



interface StoreState {
    users: Users[];
    userUpdate: UserUpdate[];
    datosDeLaWeb: any;
    container: any[];
    sections: any[];
    headerAndFooter: any[];
    webPages: any[];
}

export const storeWebPages = create<StoreState>((set) => ({
    userUpdate: [],
    users: [],
    datosDeLaWeb: {},
    container: [],
    sections: [],
    headerAndFooter: [],
    webPages: [],
    setDatosDeLaWeb: (datos: any) => set({ datosDeLaWeb: datos }),




   // Usuarios
 
    createUsers: async (data_user: {sucursal_id: number, nombre: string, email: string, password: string, tipo_us: number, id_usuario_crea: number}, data_ext: {sucursales_nuevas: any[], sucursales_eliminar: any[], areas_nuevas: any[], areas_eliminar: any[], subordinados_nuevos: any[], subordinados_eliminar: any[], grupos_nuevos: any[], grupos_eliminar: any[] }) => {
        try {
        await APIs.createUsers(data_user, data_ext)
        Swal.fire('Usuario creado exitosamente', '', 'success');
        } catch (error) {
        Swal.fire('Error', 'Hubo un error al crear el usuario', 'error');
        }
    },

    getWebPages: async (id: number) => {
        try {
        const response = await APIs.getWebPage(id)
        set({webPages: response as any[]})
        } catch (error) {
        console.log('Error al traer las paginas',error)
        }
    },

    HeaderAndFooter: async (id_sucursal: number) => {
        try {
        const response = await APIs.HeaderAndFooter(id_sucursal)
        set({headerAndFooter: response as any[]})
        return response;
        } catch (error) {
        console.log('Error al traer la pagin',error)
        }
    },

      
    createContenedor: async (data : any) => {
        try {
        const response = await APIs.createContenedor(data)
        Swal.fire('Contenedor creado exitosamente', '', 'success');
        return response;
        
        } catch (error) {
        console.log('Error al traer la pagin',error)
        }
    },

    updateContenedor: async (data : any) => {
        try {
        const response = await APIs.updateContenedor(data)
        Swal.fire('Contenedor actualizado exitosamente', '', 'success');
        return response;
        } catch (error) {
        console.log('Error al traer la pagin',error)
        }
    },

    updateContenedorOrder: async (data : any) => {
        try {
        const response = await APIs.updateContenedorOrder(data)
        // Swal.fire('Contenedor actualizado exitosamente', '', 'success');
        return response;
        } catch (error) {
        console.log('Error al traer la pagin',error)
        }
    },

    deleteContenedor: async (id: string) => {
        try {
        const response = await APIs.deleteContenedor(id)
        Swal.fire('Contenedor eliminado exitosamente', '', 'success');
        return response;
        } catch (error) {
        console.log('Error al traer la pagin',error)
        }
    },

    
    getContenedor: async (id_seccion : number) => {
        try {
        const response = await APIs.getContenedor(id_seccion )
        set({container: response as any[]})
        return response;
        } catch (error) {
        console.log('Error al traer la pagin',error)
        }
    },

    getSectionsWeb: async (id_sucursal: number) => {
        try {
        const response = await APIs.getSectionsWeb(id_sucursal)
        set({sections: response as any[]})
        return response;
        } catch (error) {
        console.log('Error al traer la pagin',error)
        }
    },

    deleteSectionsWeb: async (id: number) => {
        try {
        const response = await APIs.deleteSectionsWeb(id)
        Swal.fire('Seccion eliminada exitosamente', '', 'success');
        return response;
        } catch (error) {
        console.log('Error al traer la pagin',error)
        }
    },

    createSectionsWeb: async (data: any) => {
        try {
            const response = await APIs.createSectionsWeb(data)
            Swal.fire('Seccion creada exitosamente', '', 'success');
        return response;
        } catch (error) {
            console.log('Error al traer la pagin',error)
        }
    },

    updateWeb: async (data: any) => {
        try {
            await APIs.updateWeb(data)
            Swal.fire('Actualizacion correctamente', '', 'success');
        } catch (error) {
            Swal.fire('Error', 'Hubo un error al actualizar', 'error');
        }
    },

    updateSectionWeb: async (data: any) => {
        try {
            await APIs.updateSectionWeb(data)
            Swal.fire('Actualizacion correctamente', '', 'success');
        } catch (error) {
            Swal.fire('Error', 'Hubo un error al actualizar', 'error');
        }
    },

    createCategoryWeb: async (data: any) => {
        try {
            await APIs.createCategoryWeb(data)
            Swal.fire('Actualizacion correctamente', '', 'success');
        } catch (error) {
            Swal.fire('Error', 'Hubo un error al actualizar', 'error');
        }
    },

    updateCategoryWeb: async (data: any) => {
        try {
            await APIs.updateCategoryWeb(data)
            Swal.fire('Actualizacion correctamente', '', 'success');
        } catch (error) {
            Swal.fire('Error', 'Hubo un error al actualizar', 'error');
        }
    },

    deleteCategoryWeb: async (data: any) => {
        try {
            await APIs.deleteCategoryWeb(data)
            Swal.fire('Categoría eliminada correctamente', '', 'success');
        } catch (error) {
            Swal.fire('Error', 'Hubo un error al eliminar la categoría', 'error');
        }
    },

    createProductsWeb: async (data: any) => {
        try {
            await APIs.createProductsWeb(data)
            Swal.fire('Actualizacion correctamente', '', 'success');
        } catch (error) {
            Swal.fire('Error', 'Hubo un error al actualizar', 'error');
        }
    },


    updateProductsWeb: async (data: any) => {
        try {
            await APIs.updateProductsWeb(data)
            Swal.fire('Actualizacion correctamente', '', 'success');
        } catch (error) {
            Swal.fire('Error', 'Hubo un error al actualizar', 'error');
        }
    },

    deleteProductsWeb: async (data: any) => {
        try {
            await APIs.deleteProductsWeb(data)
            Swal.fire('Actualizacion correctamente', '', 'success');
        } catch (error) {
            Swal.fire('Error', 'Hubo un error al actualizar', 'error');
        }
    },


    updateFooterWeb: async (data: any) => {
        try {
            await APIs.updateFooterWeb(data)
            Swal.fire('Actualizacion correctamente', '', 'success');
        } catch (error) {
            Swal.fire('Error', 'Hubo un error al actualizar', 'error');
        }
    }








}));



