import create from 'zustand';

interface SelectStore {
  personalizedModal: any;
  setPersonalizedModal: (x: any) => void;

  identifier: any;
  setIdentifier: (x: any) => void;



  dataUpdate: any;
  setDataUpdate: (x: any) => void;


  normalConcepts: any[];
  setNormalConcepts: (x: any) => void;

  customConcepts: any[];
  setCustomConcepts: (x: any) => void;


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
  personalizedModal: '',
  setPersonalizedModal: (x) => set({ personalizedModal: x }),



  dataUpdate: [],
  setDataUpdate: (x) => set({ dataUpdate: x }),


  normalConcepts: [],
  setNormalConcepts: (x) => set({ normalConcepts: x }),

  customConcepts: [],
  setCustomConcepts: (x) => set({ customConcepts: x }),

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
  setIdentifier: (x) => set({identifier: x}),
}));
  
