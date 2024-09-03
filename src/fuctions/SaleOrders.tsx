import APIs from '../services/services/APIs';

export const saleOrdersRequests = () => ({

    getSaleOrders: async (data: any) => {
        try {
            const response = await  APIs.getSaleOrders(data);
            return response
        } catch (error)  {
            console.log(error)
        }
      },

});

