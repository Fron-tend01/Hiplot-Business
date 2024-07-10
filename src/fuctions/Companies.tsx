import APIs from '../services/services/APIs';

export const companiesRequests = () => ({

    getCompaniesXUsers: async (id: number) => {
        try {
          const response = await APIs.getCompaniesXUsers(id);
          return response
        } catch (error) {
          console.error('Error fetching companies:', error);
        }
    }


});