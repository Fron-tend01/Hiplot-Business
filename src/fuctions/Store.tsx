import APIs from '../services/services/APIs';
import Swal from 'sweetalert2'


export const StoreRequests = () => ({
    getStore: async (id: number) => {
        try {
          const response = await  APIs.getStore(id);
          return response
        } catch {
    
        }
    },

    getStoreXSuc: async (id: number) => {
      try {
        const response = await  APIs.getStoreXSuc(id);
        return response
      } catch {
  
      }
  },

    createStore: async (data: any, data_ext: any) => {
      try  {
        const response = await APIs.createStore(data, data_ext);
        // Aquí puedes manejar la respuesta si es necesario
        console.log('Almacén creado:', response);
        Swal.fire('Almacén creado exitosamente', '', 'success');
      } catch (error) {
        // Aquí manejas los errores
        console.error('Error al crear el almacén:', error);
        Swal.fire('Error', 'Hubo un error al crear el almacén', 'error');
      }
    },

    updateStore: async (data: any, data_ext: any) => {
      try  {
        const response = await APIs.updateStore(data, data_ext);
        return response
        // Aquí puedes manejar la respuesta si es necesario
        Swal.fire('Almacén actualizado exitosamente', '', 'success');
      } catch (error) {
        // Aquí manejas los errores
        console.error('Error al actualizar el almacén:', error);
        Swal.fire('Error', 'Hubo un error al crear el almacén', 'error');
      }
    },

});