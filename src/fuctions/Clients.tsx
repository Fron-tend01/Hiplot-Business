import APIs from '../services/services/APIs';

export const ClientsRequests = () => ({

    getClients: async (data: any) => {
        try {
          const response = await APIs.getClients(data);
          return response
        } catch (error) {
          console.error('Error fetching Clients:', error);
        }
    }


});


