
import { create } from 'zustand';
import APIs from '../services/services/APIs';
import Swal from 'sweetalert2';



interface Articles { 
    id: number,
    activos: boolean,
    nombre: string,
    codigo: string,
    familia: number,
    proveedor: number,
    materia_prima: number,
    get_sucursales: boolean,
    get_proveedores: boolean,
    get_max_mins: boolean,
    get_plantilla_data: boolean
}

  
interface StoreState {
    articlesInGlobal: any
    articles: Articles[];
    articlesFamilies: any[];
    articlesByOne: any[];
    
    
    subModal: any;
    setSubModal: (modal: any) => void;

    modalLoading: any;
    setModalLoading: (modal: any) => void;

    warinings: any;
    setWarinings: (warining: any) => void;

     //Articles
     articleByOne: any;
     setArticleByOne: (article: any) => void;

    //Sucursals
    modalStateBrnachOffices: string;
    setModalStateBrnachOffices: (BrnachOffice: any) => void;

    branchOffices: any;
    setBranchOffices: (BrnachOffice: any) => void;
    deleteBranchOffices: any;
    setDeleteBranchOffices: (branche: any) => void;


    //Unidades
    units: any
    setUnits: (unit: any) => void;
    deleteUnits: any,
    setDeleteUnits: (unit: any) => void,

    modalStateUnits: string;
    setModalStateUnits: (modal: any) => void;


    // Maximos y minimos 
    maxsMins: any;
    setMaxsMins: (maxmin: any) => void;
    deleteMaxsMins: any
    setDeleteMaxsMins: (article: any) => void;

    modalStateMaxsMins: any
    setModalStateMaxsMins: (article: any) => void;

    // Precios
    prices: any;
    setPrices: (maxmin: any) => void;
    deletePrices: any
    setDeletePrices: (article: any) => void;

    historyPrices: any
    setHistoryPrices: (article: any) => void;



    
    // Proveedores 
    suppliers: any[]
    setSuppliers: (supplier: any) => void;
    deleteSuppliers: any
    setDeleteSuppliers: (supplier: any) => void;


   // Variaciones 
   variations: any[]
   setVariations: (variation: any) => void;
   deleteVariations: any
   setDeleteVariations: (variation: any) => void;


  // Combinaciones 
  combinations: any[]
  setCombinations: (combination: any) => void;
  deleteCombinations: any
  setDeleteCombinations: (combination: any) => void;


    modalStateSuppliers: any
    setModalStateSuppliers: (supplier: any) => void;


    articleToUpdate: any;
    setArticleToUpdate: (article: any) => void;
}

export const storeArticles = create<StoreState>((set) => ({

    articlesInGlobal: [],

    subModal: false,
    setSubModal: (modal) => set({ subModal: modal }),

    modalLoading: false,
    setModalLoading: (modal) => set({ modalLoading: modal }),

    warinings: '',
    setWarinings: (warining) => set({ warinings: warining }),

    articles: [],
    articlesFamilies: [],

    articlesByOne: [],

    //Articles
    articleByOne: [],
    setArticleByOne: (article) => set({ articleByOne: article }),

    //Sucursals
    modalStateBrnachOffices: '',
    setModalStateBrnachOffices: (BrnachOffice) => set({ modalStateBrnachOffices: BrnachOffice }),
    deleteBranchOffices: [],
    setDeleteBranchOffices: (branche) => set({ deleteBranchOffices: branche }),
    
    branchOffices: [],
    setBranchOffices: (BrnachOffice) => set({ branchOffices: BrnachOffice }),


    // Unidades
    units: [],
    setUnits: (unit) => set({ units: unit }),
    deleteUnits: [],
    setDeleteUnits: (unit) => set({ deleteUnits: unit }),
    modalStateUnits: '',
    setModalStateUnits: (modal) => set({ modalStateUnits: modal }),

    
    

    // Maximos y minimos 
    maxsMins: [],
    setMaxsMins: (maxmin) => set({ maxsMins: maxmin }),
    deleteMaxsMins: [],
    setDeleteMaxsMins: (article) => set({ deleteMaxsMins: article }),

    modalStateMaxsMins: [],
    setModalStateMaxsMins: (article) => set({ modalStateMaxsMins: article }),


    // Proveedores 
    suppliers: [],
    setSuppliers: (supplier) => set({ suppliers: supplier }),
    deleteSuppliers: [],
    setDeleteSuppliers: (supplier) => set({ deleteSuppliers: supplier }),

    modalStateSuppliers: [],
    setModalStateSuppliers: (supplier) => set({ modalStateSuppliers: supplier }),


    //Variaciones 
    variations: [],
    setVariations: (variation) => set({ variations: variation }),
    deleteVariations: [],
    setDeleteVariations: (variation) => set({ deleteVariations: variation }),


    //combination 
    combinations: [],
    setCombinations: (combination) => set({ combinations: combination }),
    deleteCombinations: [],
    setDeleteCombinations: (combination) => set({ deleteCombinations: combination }),

    
    //  Precios
    prices: [],
    setPrices: (price) => set({ prices: price }),
    deletePrices: [],
    setDeletePrices: (unit) => set({ deleteUnits: unit }),

    historyPrices: [],
    setHistoryPrices: (price) => set({ historyPrices: price }),


    articleToUpdate: null,
    setArticleToUpdate: (article) => set({ articleToUpdate: article }),

   // Crear articulos

   createArticles: async (data: any) => {
    try {
      await APIs.createArticles(data)
      Swal.fire('Articulo creado exitosamente', '', 'success');
      console.log('articulo creado')
    } catch (error) {
      Swal.fire('Hubo un error al crear el articulo', '', 'error');
      
      console.error('Ocurrió un error al crear el artículo', error);
    }
  },

  getArticles: async (data: any) => {
    try {
      const response = await APIs.getArticles(data)
      set({articles: response as Articles[]})
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  getArticlesInGlobal: async (data: any) => {
    try {
      const response = await APIs.getArticles(data)
      set({articlesInGlobal: response as any[]})
    } catch (error) {
      console.error(error);
      return null;
    }
  },


 

  getArticlesFamilies: async (data: any) => {
    try {
      const response = await APIs.getArticles(data)
      return response
    } catch {

    }
  },

  updateArticles: async (data: any) => {
    try {
      await APIs.updateArticles(data)
      Swal.fire('Articulo actualizado exitosamente', '', 'success');
      console.log('articulo creado')
    } catch (error) {
      console.error('Ocurrió un error al actualizar el artículo', error);
    }
  },




}));



