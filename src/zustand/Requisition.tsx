import { create } from "zustand";
import APIs from "../services/services/APIs";
import Swal from 'sweetalert2';


interface Requisitions {
    folio: number
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
    requisitions: Requisitions[];
    pdfData: any[];

    updateToRequisition: any
    setUpdateToRequisition: (requisition: any) => void;

    modalStateCreate: any
    setModalStateCreate: (requisition: any) => void;

    modalStateUpdate: any
    setModalStateUpdate: (modal: any) => void;

    selectedBranchOffice: any
    setSelectedBranchOffice: (branch: any) => void;

    concepts: any
    setConcepts: (concept: any) => void;
}

export const storeRequisitions = create<StoreState>((set) => ({
    requisitions: [],
    pdfData: [],

    //Modal
    modalStateCreate: '',
    setModalStateCreate: (requisition) => set({ modalStateCreate: requisition }),

    //Modal
    modalStateUpdate: '',
    setModalStateUpdate: (modal) => set({ modalStateUpdate: modal }),

    //Modal
    updateToRequisition: [],
    setUpdateToRequisition: (requisition) => set({ updateToRequisition: requisition }),
  
    //Sucursals
    selectedBranchOffice: null,
    setSelectedBranchOffice: (branch) => set({ selectedBranchOffice: branch }),

     //Sucursals
     concepts: [],
     setConcepts: (concept) => set({ concepts: concept }),

    
  // Requisision
  createRequisition: async (data:  any) => {
    try {
      await APIs.createRequisition(data)
      Swal.fire('Requisision creada exitosamente', '', 'success');
    } catch (error) {
      Swal.fire('Error', 'Hubo un error al crear la requisision', 'error');
      console.error('Error al crear la requisision', error);
    }
  },

  getRequisition: async (data: any) => {
    try {
      const response = await APIs.getRequisition(data)
      set({requisitions: response as Requisitions[]})
    } catch (error) {
      console.log('error al obtener las requisiciónes', error)
    }     
  },

  // updateRequisition: async (id: number, status: boolean) => {
  //   try {
  //     await APIs.updateRequisition(id, status)
  //   } catch {

  //   }
  // },

  
  pdtRequisition: async (id: number) => {
    try {
      // Realizar la petición para obtener los datos
      const response = await APIs.pdtRequisition(id);
  
      // Almacenar los datos en el estado
      set({ pdfData: response as any[] });
      } catch (error) {
      console.error('Error al obtener los datos de la requisición:', error);
    }
  },
  

}));

