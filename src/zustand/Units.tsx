import APIs from "../services/services/APIs";
import Swal from 'sweetalert2';



const UnitsFunctions = {
    
  createCompanies: async () => {
 
  },

  getUnits: async () => {
    await APIs.getUnits()
        .then((response: any) => {
            return response
        })
        .catch((error: any) => {
            console.log(error)
        })
  },

  updateUnits: async (data: any) => {
    await APIs.updateUnits(data)
    .then((response: any) => {
        Swal.fire('Unidad creada exitosamente', '', 'success');
        return response
    })
    .catch((error: any) => {
      console.log(error)
        Swal.fire('Error al crear la unidad', '', 'error');
    })
  },



};

export default UnitsFunctions;