import APIs from '../services/services/APIs';
import Swal from 'sweetalert2';

export const RequisitionRequests = () => ({

    getRequisition: async (data: any) => {
        try {
          const response = await APIs.getRequisition(data)
          return response
        } catch (error) {
          console.log('error al obtener las requisiciónes', error)
        }     
    },
      // Requisision
  createRequisition: async (data: any) => {
    try {
      let response = await APIs.createRequisition(data)
      return response
    } catch (error) {
      Swal.fire('Error', 'Hubo un error al crear la requisision', 'error');
      console.error('Error al crear la requisision', error);
    }
  },

  updateRequisition: async (data: any) => {
    try {
      await APIs.updateRequisition(data)
    } catch {

    }
  },


});