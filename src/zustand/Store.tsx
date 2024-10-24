
import { create } from 'zustand';
import APIs from '../services/services/APIs';
import Swal from 'sweetalert2';


interface Store {
    id: number,
    nombre: string,
    sucursales: []
  }
  
interface StoreState {
    store: Store[];
    setStore: (modal: any) => void;
    //Sucursals
    modalState: any;
    setModalState: (modal: any) => void;

    
    storeToUpdate: any;
    setStoreToUpdate: (store: any) => void;

    modalStateUpdate: any;
    setModalStateUpdate: (modal: any) => void;
}



export const storeStore = create<StoreState>((set) => ({
    store: [],
    setStore: (modal) => set({ store: modal }),

    modalState: '',
    setModalState: (modal) => set({ modalState: modal }),

    storeToUpdate: false,
    setStoreToUpdate: (store) => set({ storeToUpdate: store }),

    modalStateUpdate: false,
    setModalStateUpdate: (modal) => set({ modalStateUpdate: modal }),
    // Almacen
 
    createStore: async (data: { nombre: string }, data_ext: { sucursales_nuevas: any[]; sucursales_eliminar: any[] }) => {
        try  {
          const response = await APIs.createStore(data, data_ext);
          // Aquí puedes manejar la respuesta si es necesario
          console.log('Almacén creado:', response);
          Swal.fire('Almacén creado exitosamente', '', 'success');
        } catch (error) {
          // Aquí manejas los errores
          console.error('Error al crear el almacén:', error);
          Swal.fire('Error', 'Hubo un error al crear el almacén', 'error');
        }
      },
    
      getStore: async (id: number) => {
        try {
          const response = await  APIs.getStore(id);
          return response
    
        } catch {
    
        }
      },
      updateStore: async (data: any, data_ext: any) => {
        try  {
          const response = await APIs.updateStore(data, data_ext);
          return response
          // Aquí puedes manejar la respuesta si es necesario
          Swal.fire('Almacén actualizado exitosamente', '', 'success');
        } catch (error) {
          // Aquí manejas los errores
          console.error('Error al actualizar el almacén:', error);
          Swal.fire('Error', 'Hubo un error al crear el almacén', 'error');
        }
      },
    
      

}));



