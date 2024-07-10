import APIs from '../services/services/APIs';
import Swal from 'sweetalert2';

export const TemplatesRequests = () => ({
  getTemplates: async (id: number) => {
    try {
      const response = await APIs.getTemplates(id);
      return response;
    } catch (error) {
      console.error('Ocurrió un error', error);
    }
  },

  updateTemplates: async (id: number, data: {nombre: string, id_empresa: number}, data_nuevo: [{nombre: string, tipo: string, id_plantilla: number}], data_eliminar: any[]) => {
    try {
      await APIs.updateTemplates(id, data, data_nuevo, data_eliminar);
      Swal.fire('Plantilla actualizada exitosamente', '', 'success');
    } catch (error) {
      console.error('Ocurrió un error al actualizar la plantilla', error);
    } 
  },
});

export default TemplatesRequests