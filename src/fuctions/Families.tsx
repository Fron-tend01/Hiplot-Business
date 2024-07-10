import APIs from '../services/services/APIs';

export const FamiliesRequests = () => ({

    getFamilies: async (id: number) => {
        try {
           const response = await APIs.getFamilies(id);
           return response;
        } catch {
            
        }
      },

});