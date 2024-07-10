import APIs from '../services/services/APIs';

export const ordersRequests = () => ({

    getOrdedrs: async (data: any) => {
        try {
            const response = await  APIs.getOrdedrs(data);
            return response
        } catch {
    
        }
      },

});

