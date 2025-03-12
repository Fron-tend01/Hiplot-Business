import create from 'zustand';

interface SelectStore {



  ///////////////// custom variables //////////////////////////////
  normalConcepts: any[];
  setNormalConcepts: (x: any) => void;

  normalConceptsView: any[];
  setNormalConceptsView: (x: any) => void;

  deleteNormalConcepts: any[];
  setDeleteNormalConcepts: (x: any) => void;

  customConcepts: any[];
  setCustomConcepts: (x: any) => void;

  deleteCustomConcepts: any[];
  setDeleteCustomConcepts: (x: any) => void;

  conceptView: any;
  setConceptView: (x: any) => void;

  
  customConceptView: [];
  setCustomConceptView: (x: any) => void;


  customLocal: any;
  setCustomLocal: (x: any) => void;


  ov_repo: any;
  setov_repo: (x: any) => void;

  personalizedModal: any;
  setPersonalizedModal: (x: any) => void;

  identifier: number;
  setIdentifier: (newIdentifier: number) => void;
  incrementIdentifier: () => void;


  dataUpdate: any;
  setDataUpdate: (x: any) => void;

  idItem: any;
  setIdItem: (x: any) => void;

  
  customData: any[];
  setCustomData: (x: any) => void;

  personalized: any[];
  setPersonalized: (x: any) => void;

  dataUpdatepersonalized: any[];
  setDataUpdatepersonalized: (x: any) => void;




  // Variables temporales al cerrar los modales
  temporaryNormalConcepts: any[];
  setTemporaryNormalConcepts: (x: any) => void;

  temporaryCustomConcepts: any[];
  setTemporaryCustomConcepts: (x: any) => void;
  
}

export const storePersonalized = create<SelectStore>((set) => ({

  idItem: {},
  setIdItem: (x) => set({ idItem: x }),

  normalConcepts: [],
  setNormalConcepts: (x) => set({ normalConcepts: x }),

  normalConceptsView: [],
  setNormalConceptsView: (x) => set({ normalConceptsView: x }),

  deleteNormalConcepts: [],
  setDeleteNormalConcepts: (x) => set({ deleteNormalConcepts: x }),

  customConcepts: [],
  setCustomConcepts: (x) => set({ customConcepts: x }),

  deleteCustomConcepts: [],
  setDeleteCustomConcepts: (x) => set({ deleteCustomConcepts: x }),

  conceptView: [],
  setConceptView: (x) => set({ conceptView: x }),

  customConceptView: [],
  setCustomConceptView: (x) => set({ customConceptView: x }),


  customLocal: [],
  setCustomLocal: (x) => set({ customLocal: x }),


  ov_repo: null as any | null,
  setov_repo: (x: any) => set({ ov_repo: x }),

  personalizedModal: '',
  setPersonalizedModal: (x) => set({ personalizedModal: x }),


  dataUpdate: [],
  setDataUpdate: (x) => set({ dataUpdate: x }),




  customData: [],
  setCustomData: (x) => set({ customData: x }),

  personalized: [],
  setPersonalized: (x) => set({ personalized: x }),

  dataUpdatepersonalized: [],
  setDataUpdatepersonalized: (x) => set({ personalized: x }),

  temporaryNormalConcepts: [],
  setTemporaryNormalConcepts: (x) => set({ temporaryNormalConcepts: x }),

  temporaryCustomConcepts: [],
  setTemporaryCustomConcepts: (x) => set({ temporaryCustomConcepts: x }),

  
  identifier: 0,
  setIdentifier: (newIdentifier) => set({ identifier: newIdentifier }),
  incrementIdentifier: () => set((state) => ({ identifier: state.identifier + 1 }))


}));
  
