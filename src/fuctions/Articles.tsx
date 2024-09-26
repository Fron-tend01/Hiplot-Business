import APIs from '../services/services/APIs';
import Swal from 'sweetalert2';

export const articleRequests = () => ({

  createArticles: async (data: any) => {
    try {
      await APIs.createArticles(data)
      Swal.fire('Articulo creado exitosamente', '', 'success');
      console.log('articulo creado')
    } catch (error) {
      Swal.fire('Hubo un error al crear el articulo', '', 'error');
      
      console.error('Ocurrió un error al crear el artículo', error);
    }
  },

  getArticles: async (data: any) => {
    try {
      const response = await APIs.getArticles(data);
      return response;
    } catch (error) {
      console.error('Ocurrió un error', error);
    }
  },

  getArticlesDifferential: async (data: any) => {
    try {
      const response = await APIs.getArticlesDifferential(data);
      return response;
    } catch (error) {
      console.error('Ocurrió un error', error);
    }
  },

  updateArticles: async (data: any) => {
    try {
      await APIs.updateArticles(data)
      Swal.fire('Articulo actualizado exitosamente', '', 'success');
      console.log('articulo creado')
    } catch (error) {
      console.error('Ocurrió un error al actualizar el artículo', error);
      Swal.fire('Hubo un error al actualizar el articulo', '', 'error');
    }
  },


});