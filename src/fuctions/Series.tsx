import APIs from '../services/services/APIs';

export const seriesRequests = () => ({

    getSeriesXUser: async (id: number) => {
        try {
          const response = await APIs.getSeriesXUser(id);
          return response
        } catch (error) {
          console.error('Error fetching Series', error);
        }
    },


});