
import { create } from 'zustand';
import APIs from '../services/services/APIs';
import Swal from 'sweetalert2';


interface Suppliers {
    id: 1,
    razon_social: string,
    nombre_comercial: string,
    ubicacion: string,
    nombre_contacto: string,
    telefono: string,
    correo: string,
    is_flete: boolean,
    empresas: any[]
}
  
interface StoreState {
    suppliers: Suppliers[];
}

export const storeSuppliers = create<StoreState>((set) => ({
    suppliers: [],

  // Proveedores
  createSuppliers: async (data: any) => {
    try { 
      await APIs.createSuppliers(data)
      Swal.fire('Proveedor creado exitosamente', '', 'success');
    } catch (error) {
      console.error('Ocurrió un error al crear el proveedor', error);
    }
  },
  
  getSuppliers: async (data: any) => {
    try {
      const response = await APIs.getSuppliers(data)
      set({ suppliers: response as Suppliers[] });
      return response
    } catch {

    }
  },



}));



