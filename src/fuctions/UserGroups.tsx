import APIs from '../services/services/APIs';

export const UserGroupsRequests = () => ({

    getUserGroups: async (id: any) => {
        try {
          const response = await APIs.getUserGroups(id);
          return response
        } catch (error) {
          console.error('Error fetching Series', error);
        }
    },


});