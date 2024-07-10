
import { create } from 'zustand';
import APIs from '../services/services/APIs';
import Swal from 'sweetalert2';
  
interface StoreState {
    orders: any[];
}

export const storeOrdes = create<StoreState>((set) => ({
    orders: [],


    // Almacen
 
    createOrders: async (data: any) => {
        try  {
          const response: any = await APIs.createOrders(data);
          if (response.error === true) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: response.mensaje
            });
          } else {
            console.log('Orden creada:', response);
            Swal.fire('Orden creada exitosamente', '', 'success');
          }
        } catch (error) {
          console.error('Error al crear la orden:', error);
          Swal.fire('Error', 'Hubo un error al crear la orden', 'error');
        }
      },
    
      getOrdedrs: async (data: any) => {
        try {
          const response = await  APIs.getOrdedrs(data);
          set({orders: response as any[]})
    
        } catch {
    
        }
      },

      updateModeOrders: async (data: any) => {
        try  {
          const response: any = await APIs.updateModeOrders(data);
          return response
        } catch (error) {
          console.error('Error al actualizar el modo', error);
        }
      },

      updateModeConceptsOrders: async (data: any) => {
        try  {
          const response: any = await APIs.updateModeConceptsOrders(data);
          return response
          
        } catch (error) {
          console.error('Error al actualizar el modo', error);
        }
      },

      getPdfOrders: async (id: number) => {
        try  {
          const response: any = await APIs.getPdfOrders(id);
          return response
        } catch (error) {
          console.error('Error al actualizar el modo', error);
        }
      },
    


}));



