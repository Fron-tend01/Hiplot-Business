import APIs from '../services/services/APIs';
import Swal from 'sweetalert2';

export const WarehouseExitRequests = () => ({

  createWarehouseExit: async (data: any) => {
    try  {
      const response: any = await APIs.createWarehouseExit(data);
      if (response.error === true) {
        // Lanzar una excepción con el mensaje de error recibido
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.mensaje
        });
      } else {
        // Aquí puedes manejar la respuesta si es necesario
        console.log('Salida de almacen creada:', response);
        Swal.fire('Salida de almacen creada exitosamente', '', 'success');
      }
  
    } catch (error) {
      // Aquí manejas los errores
      console.error('Error al crear la entrada:', error);
      Swal.fire('Error', 'Hubo un error al crear la salida de almacen', 'error');
    }
  },

  getWarehouseExit: async (data: any) => {
    try {
      const response = await APIs.getWarehouseExit(data);
      return response;
    } catch (error) {
      console.error('Ocurrió un error', error);
    }
  },



});