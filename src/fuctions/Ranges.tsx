import APIs from '../services/services/APIs';

export const RangesRequests = () => ({

    getRanges: async () => {
        try {
          const response = await APIs.getRanges();
          return response
        } catch (error) {
          console.error('Error fetching Ranges', error);
        }
    },


});