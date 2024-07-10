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
    purchaseOrders: PurchaseOrders[];
}

export const storePurchaseOrders = create<StoreState>((set) => ({
  purchaseOrders: [],
   
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

  getPurchaseOrders: async (folio: number, id_serie: number, id_sucursal: number, id_usuario: number, id_area: number, tipo: number, desde: Date, hasta: Date, status: number) => {
    try {
      const response =  await APIs.getPurchaseOrders(folio, id_serie, id_sucursal, id_usuario, id_area, tipo, desde, hasta, status)
      console.log(response)
      set({purchaseOrders: response as PurchaseOrders[]})
    } catch (error) {
      console.log(error)
    }
  },

  updatePurchaseOrders: async (id: number, id_usuario_crea: number, id_usuario_autoriza: number, id_sucursal: number, fecha_creacion: Date, fecha_llegada: Date,  status: number, tipo: number,  cotizacion: string, factura: string, comentarios: string, id_proveedor_flete: number, costo_flete: number, comentarios_flete: string, sumar_flete: boolean,  conceptos: any[], conceptos_elim: any[]) => {
    try {
      await APIs.updatePurchaseOrders(id, id_usuario_crea, id_usuario_autoriza, id_sucursal, fecha_creacion, fecha_llegada, status, tipo, cotizacion, factura, comentarios, id_proveedor_flete, costo_flete, comentarios_flete, sumar_flete, conceptos, conceptos_elim)
      Swal.fire('Orden de compra actualizada exitosamente', '', 'success')
    } catch {
  
    }
  },

}));

