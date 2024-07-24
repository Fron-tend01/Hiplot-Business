import APIs from '../services/services/APIs';
import Swal from 'sweetalert2'


export const TypeOfPaymentsRequests = () => ({

    // createTypeOfPayments: async (id: number) => {
    //     try {
    //       const response = await APIs.createTypeOfPayments(id);
    //       return response
    //     } catch (error) {
    //       console.error('Error fetching Series', error);
    //     }
    // },

    createTypeOfPayments: async (data: any) => {
      try  {
        const response = await APIs.createTypeOfPayments(data);
        // Aquí puedes manejar la respuesta si es necesario
        console.log('Typo de cobro creado:', response);
        Swal.fire('Typo de cobro creado exitosamente', '', 'success');
      } catch (error) {
        // Aquí manejas los errores
        console.error('Error al crear el Typo de cobro', error);
        Swal.fire('Error', 'Hubo un error al crear el Typo de cobro', 'error');
      }
    },

    updateTypeOfPayment: async (data: any) => {
      try  {
        const response = await APIs.updateTypeOfPayment(data);
        // Aquí puedes manejar la respuesta si es necesario
        console.log('Typo de cobro actualizado:', response);
        Swal.fire('Typo de cobro actualizado correctamente', '', 'success');
      } catch (error) {
        // Aquí manejas los errores
        console.error('Error al actualizar el Typo de cobro', error);
        Swal.fire('Error', 'Hubo un error al actualizar el Typo de cobro', 'error');
      }
    },


    

    getTypeOfPayments: async () => {
      try {
        const response = await APIs.getTypeOfPayments()
        return response
      } catch {
  
      }
  },



});