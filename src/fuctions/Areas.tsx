import APIs from '../services/services/APIs';

export const areasRequests = () => ({
  getAreas: async (sucursal_id: number, user_id: number) => {
    try {
      const response = await APIs.getAreasXBranchOfficesXUsers(sucursal_id, user_id);
      return response
    } catch (erro) {

    }
  },
  
});