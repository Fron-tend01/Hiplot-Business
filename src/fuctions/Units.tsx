import APIs from '../services/services/APIs';

export const UnitsRequests = () => ({

    getUnits: async () => {
        try {
          const response = await await APIs.getUnits();
          return response
        } catch (error) {
          console.error('Error fetching Series', error);
        }
    },


});