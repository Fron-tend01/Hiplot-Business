import APIs from '../services/services/APIs';

export const BranchOfficesRequests = () => ({

    getBranchOffices: async (empresa_id: number, id_usuario: any) => {
        try {
          const response = await APIs.getBranchOfficesXCompanies(empresa_id, id_usuario);
          return response
        } catch (error) {
          console.error('Error fetching companies:', error);
        }
    }


});