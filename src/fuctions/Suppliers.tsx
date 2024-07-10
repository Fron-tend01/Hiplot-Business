import APIs from '../services/services/APIs';
import Swal from 'sweetalert2';

export const suppliersRequests = () => ({
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
          return response
        } catch {
    
        }
    },
    updateSuppliers: async (data: any) => {
      try {
        const response = await APIs.updateSuppliers(data)
        Swal.fire('Proveedor actualizado exitosamente', '', 'success');
        return response
      } catch {
        Swal.fire('Error al actualizar el porveedor', '', 'error');
  
      }
  },
});