import APIs from '../services/services/APIs';


export const articleRequests = () => ({

  getArticles: async (data: any) => {
    try {
      const response = await APIs.getArticles(data);
      return response;
    } catch (error) {
      console.error('Ocurrió un error', error);
    }
  },

  getArticlesDifferential: async (data: any) => {
    try {
      const response = await APIs.getArticlesDifferential(data);
      return response;
    } catch (error) {
      console.error('Ocurrió un error', error);
    }
  }


});