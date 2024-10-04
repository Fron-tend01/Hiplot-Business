import { create } from "zustand";
import APIs from "../services/services/APIs";
import Swal from 'sweetalert2';


interface PurchaseOrders {
    id: number,
    folio: number,
    id_serie: number,
    id_sucursal: number,
    id_usuario: number,
    id_area: number,
    tipo: number,
    desde: Date,
    hasta: Date,
    status: number
  }
  

interface StoreState {
  purchaseOrders: any
  setPurchaseOrders: (x: any) => void;

  modal: any
  setModal: (x: any) => void;

  selectedBranchOffice: any
  setSelectedBranchOffice: (x: any) => void;

  dates: any;
  setDates: (x: any) => void;

  type: any
  setType: (x: any) => void;

}

export const storePurchaseOrders = create<StoreState>((set) => ({

  purchaseOrders: [],
  setPurchaseOrders: (x) => set({ purchaseOrders: x }),

  modal: '',
  setModal: (x) => set({ modal: x }),

  selectedBranchOffice: null,
  setSelectedBranchOffice: (x) => set({ selectedBranchOffice: x }),

  dates: [],
  setDates: (x) => set({ dates: x }),

  type: 0,
  setType: (x) => set({ type: x }),
   
  // Orden de compra
  createPurchaseOrders: async (id_usuario_crea: number, id_usuario_autoriza: number, id_sucursal: number, fecha_creacion: Date ,  fecha_llegada: Date,  status: number, tipo: number,  cotizacion: string, factura: string, comentarios: string, id_proveedor_flete: number, costo_flete: number, comentarios_flete: string, sumar_flete: boolean, documento_anterior: string, documento_siguiente: string,  conceptos: any[]) => {
    try {
      const response: any = await APIs.createPurchaseOrders(id_usuario_crea, id_usuario_autoriza, id_sucursal, fecha_creacion , fecha_llegada, status, tipo, cotizacion, factura, comentarios, id_proveedor_flete, costo_flete, comentarios_flete, sumar_flete, documento_anterior, documento_siguiente, conceptos)
      if (response.error === true) {
        // Lanzar una excepción con el mensaje de error recibido
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.mensaje
        });
      } else {
        Swal.fire('Orden de compra creada exitosamente', '', 'success');
      }
    } catch {
  
    }
  },

  getPurchaseOrders: async (data: any) => {
    try {
      const response =  await APIs.getPurchaseOrders(data)
      console.log(response)
      set({purchaseOrders: response as PurchaseOrders[]})
    } catch (error) {
      console.log(error)
    }
  },

  updatePurchaseOrders: async (data: any) => {
    try {
      await APIs.updatePurchaseOrders(data)
      Swal.fire('Orden de compra actualizada exitosamente', '', 'success')
    } catch {
  
    }
  },

}));

