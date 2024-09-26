import APIs from '../services/services/APIs';

export const RangesRequests = () => ({

    getRanges: async (data: any) => {
        try {
          const response = await APIs.getRanges(data);
          return response
        } catch (error) {
          console.error('Error fetching Ranges', error);
        }
    },


});