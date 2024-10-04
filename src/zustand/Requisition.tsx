import { create } from "zustand";
import APIs from "../services/services/APIs";
import Swal from 'sweetalert2';

interface StoreState {
    pdfData: any[];

    updateToRequisition: any
    setUpdateToRequisition: (x: any) => void;

    modalStateCreate: any
    setModalStateCreate: (requisition: any) => void;

    modalStateUpdate: any
    setModalStateUpdate: (modal: any) => void;

    selectedBranchOffice: any
    setSelectedBranchOffice: (branch: any) => void;

    concepts: any
    setConcepts: (concept: any) => void;

    dataGet: any
    setDataGet: (x: any) => void;

    requisitions: any
    setRequisitions: (concept: any) => void;
}

export const storeRequisitions = create<StoreState>((set) => ({

    pdfData: [],

    //Modal
    modalStateCreate: '',
    setModalStateCreate: (requisition) => set({ modalStateCreate: requisition }),

    //Modal
    modalStateUpdate: '',
    setModalStateUpdate: (modal) => set({ modalStateUpdate: modal }),

    //Modal
    updateToRequisition: null,
    setUpdateToRequisition: (x) => set({ updateToRequisition: x }),
  
    //Sucursals
    selectedBranchOffice: null,
    setSelectedBranchOffice: (branch) => set({ selectedBranchOffice: branch }),

     //Sucursals
     concepts: [],
     setConcepts: (concept) => set({ concepts: concept }),



    dataGet: {
      id_sucursal: null,
      id_usuario: null,
      id_area: null,
      tipo: 0,
      desde: null,
      hasta: null,
      status: 0
    },
    setDataGet: (x) => set({ dataGet: x }),

    requisitions: [],
    setRequisitions: (x) => set({ requisitions: x }),



    
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

