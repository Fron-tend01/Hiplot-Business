import APIs from '../services/services/APIs';

export const usersRequests = () => ({

 

    getUsers: async (data: any) => {
        try {
        // Ajusta la llamada a la función getUsers para manejar el nombre opcionalmente
        const response = await APIs.getUsers(data);   
        return response     
        } catch (error) {
        console.log('Error de Usuarios', error);
        }
    },
});

