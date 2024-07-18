import APIs from '../services/services/APIs';

export const TransfersRequests = () => ({

    getTransfers: async (data: any) => {
        try {
          const response = await APIs.getTransfers(data);
          return response
        } catch (error) {
          console.error('Error fetching Series', error);
        }
    },


});