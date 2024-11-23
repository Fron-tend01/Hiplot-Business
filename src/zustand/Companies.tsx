import { create } from "zustand";
import APIs from "../services/services/APIs";
import Swal from "sweetalert2";

interface CompaniesXUsers {
  id: number;
  nombre_comercial: string;
  razon_social: string;
}

interface ModelState {
  id: number;
  razon_social: string;
  nombre_comercial: string;
  bd_compaqi: string;
  modulo_cobrofranquicia_compaqi: number;
  id_usuario: number;
  id_usuario_req: number;
  id_sucursal_req: number;
  id_area_req: number;
  empresas_franquicias: any[];
  empresas_franquicias_remove: any[];
}

interface FormEfState {
  id: number;
  id_empresa: number;
  id_franquicia: number;
  businessEntityID: number;
  razon_social: string;
}

interface StoreState {
  companiesXUsers: CompaniesXUsers[];
  model: ModelState;
  modelClear: ModelState;
  formEf: FormEfState;
  formEfClear: FormEfState;
  setModel: (model: any) => void;
  setFormEf: (formEf: any) => void;
 
}

export const storeCompanies = create<StoreState>((set) => ({
  companiesXUsers: [],

  model: {
    id: 0,
    razon_social: "",
    nombre_comercial: "",
    bd_compaqi: "",
    modulo_cobrofranquicia_compaqi: 0,
    id_usuario: 0,
    id_usuario_req: 0,
    id_sucursal_req: 0,
    id_area_req: 0,
    empresas_franquicias: [],
    empresas_franquicias_remove: [],
  },
  setModel: (updateFunc) => set((state) => ({
    model: typeof updateFunc === 'function' ? updateFunc(state.model) : updateFunc,
  })),

  modelClear: {
    id: 0,
    razon_social: "",
    nombre_comercial: "",
    bd_compaqi: "",
    modulo_cobrofranquicia_compaqi: 0,
    id_usuario: 0,
    id_usuario_req: 0,
    id_sucursal_req: 0,
    id_area_req: 0,
    empresas_franquicias: [],
    empresas_franquicias_remove: [],
  },

  formEf: {
    id: 0,
    id_empresa: 0,
    id_franquicia: 0,
    businessEntityID: 0,
    razon_social: "",
  },

  setFormEf: (updateFunc) => set((state) => ({
    formEf: typeof updateFunc === 'function' ? updateFunc(state.formEf) : updateFunc,
  })),

  formEfClear: {
    id: 0,
    id_empresa: 0,
    id_franquicia: 0,
    businessEntityID: 0,
    razon_social: "",
  },

  createCompanies: async (razon_social: string, nombre_comercial: string, id_usuario: number) => {
    try {
      const response = await APIs.createCompanies(razon_social, nombre_comercial, id_usuario);
      Swal.fire('Empresa creada exitosamente', '', 'success');
      console.log('Empresa creada:', response);
    } catch (error) {
      console.error('Error creating company:', error);
      Swal.fire('Error', 'Hubo un error al crear la empresa', 'error');
    }
  },

  getCompaniesXUsers: async (id: number) => {
    try {
      const response = await APIs.getCompaniesXUsers(id);

      set({ companiesXUsers: response as CompaniesXUsers[] }); // Asegúrate de convertir el tipo
      return response
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  },

  updateCompanies: async (id: number, razon_social: string, nombre_comercial: string, id_usuario: number) => {
    try {
      await APIs.putUpdateCompanies(id, razon_social, nombre_comercial, id_usuario);
      Swal.fire('Empresa actualizada exitosamente', '', 'success');
      console.log('Empresa actualizada correctamente');
    } catch (error) {
      Swal.fire('Error', 'Hubo un error al actualizar la empresa', 'error');
      console.error('Error al actualizar la empresa:', error);
      // Manejo de errores
    }
  },


  // Sucursales
}));

