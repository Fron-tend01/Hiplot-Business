
import { create } from 'zustand';
import APIs from '../services/services/APIs';
import Swal from 'sweetalert2';



  
interface StoreState {
    // store: Store[];
    modalTickets: any;
    setModalTickets: (modal: any) => void;

    dates: any;
    setDates: (modal: any) => void;

    purchaseOrders: any;
    setPurchaseOrders: (modal: any) => void;

    conceptos: any;
    setConceptos: (modal: any) => void;

    
    store: any;
    setStore: (modal: any) => void;
    
    tickets: any,

    

}

export const storeTickets = create<StoreState>((set) => ({

    modalTickets: [],
    setModalTickets: (modal) => set({ modalTickets: modal }),

    
    dates: { startDate: '', endDate: '', },
    setDates: (prev) =>
        set((state) => ({
            dates: {
                ...state.dates,
                ...prev,
            },
        })),

    purchaseOrders: [],
    setPurchaseOrders: (x) => set({ purchaseOrders: x }),

    conceptos: [],
    setConceptos: (x) => set({ conceptos: x }),

    store: [],
    setStore: (x) => set({ store: x }),

    tickets: [],

    // Almacen
 
    createTickets: async (id_sucursal: number, id_usuario_crea: number, comentarios: string, conceptos: any[],) => {
        try  {
          const response: any = await APIs.createTickets(id_sucursal, id_usuario_crea, comentarios, conceptos);
          if (response.error === true) {
            // Lanzar una excepción con el mensaje de error recibido
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: response.mensaje
            });
          } else {
            // Aquí puedes manejar la respuesta si es necesario
            console.log('Entrada creada:', response);
            Swal.fire('Entrada creada exitosamente', '', 'success');
          }
      
        } catch (error) {
          // Aquí manejas los errores
          console.error('Error al crear la entrada:', error);
          Swal.fire('Error', 'Hubo un error al crear la entrada', 'error');
        }
      },
    
      getTickets: async (data: any) => {
        try {
          const response: any = await  APIs.getTickets(data);
          set({tickets: response})
          return response
    
        } catch {
    
        }
      },

      getPDFTickets: async (id: number) => {
        try {
          await  APIs.getPDFTickets(id);
  
        } catch {
    
        }
      },

      getExcelTickets: async (id: number,id_usuario: number, id_sucursal: number, desde: Date, hasta: Date, id_serie: number, status: number, folio: number) => {
        try {
          const result = await  APIs.getExcelTickets(id, id_sucursal, id_usuario, desde, hasta, id_serie, status, folio);
          return result
    
        } catch {
    
        }
      },

}));
