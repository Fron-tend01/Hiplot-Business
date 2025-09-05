
import { create } from 'zustand';

interface Subcategoria {
    id: number;
    nombre: string;
}

interface Category {
    id: number;
    nombre: string;
    subcategorias?: Subcategoria[];
}

interface Campo {
    id: number;
    id_plantilla: number;
    tipo: number;
    nombre: string;
}

interface Template {
    id: number;
    nombre: string;
    campos: Campo[];
}

interface StoreState {
    categories: Category[];
    templates: Template[];
    modal: string;
    modoUpdate: boolean;
    dataUpd: Category | Template | null;
    inputs: {
        nombre: string;
        subcategorias: Subcategoria[];
        subcategorias_removed: number[];
        campos: Campo[];
        campos_removed: number[];
    };
    setCategories: (categories: Category[]) => void;
    setTemplates: (templates: Template[]) => void;
    setModal: (modal: string) => void;
    setModoUpdate: (modoUpdate: boolean) => void;
    setDataUpd: (dataUpd: Category | Template | null) => void;
    setInputs: (inputs: { nombre: string; subcategorias: Subcategoria[]; subcategorias_removed: number[]; campos: Campo[]; campos_removed: number[] }) => void;
    updateInput: (key: keyof { nombre: string; subcategorias: Subcategoria[]; subcategorias_removed: number[]; campos: Campo[]; campos_removed: number[] }, value: any) => void;
    addSubcategoria: () => void;
    removeSubcategoria: (index: number) => void;
    updateSubcategoria: (index: number, nombre: string) => void;
    removeSubcategoriaWithId: (subcategoriaId: number) => void;
    addCampo: () => void;
    removeCampo: (index: number) => void;
    updateCampo: (index: number, campo: Partial<Campo>) => void;
    removeCampoWithId: (campoId: number) => void;
    resetForm: () => void;
}

export const storeActivos = create<StoreState>((set) => ({
    categories: [],
    templates: [],
    modal: '',
    modoUpdate: false,
    dataUpd: null,
    inputs: {
        nombre: '',
        subcategorias: [],
        subcategorias_removed: [],
        campos: [],
        campos_removed: []
    },
    setCategories: (categories) => set({ categories }),
    setTemplates: (templates) => set({ templates }),
    setModal: (modal) => set({ modal }),
    setModoUpdate: (modoUpdate) => set({ modoUpdate }),
    setDataUpd: (dataUpd) => set({ dataUpd }),
    setInputs: (inputs) => set({ inputs }),
    updateInput: (key, value) => set((state) => ({
        inputs: { ...state.inputs, [key]: value }
    })),
    addSubcategoria: () => set((state) => ({
        inputs: { 
            ...state.inputs, 
            subcategorias: [...state.inputs.subcategorias, { id: 0, nombre: '' }]
        }
    })),
    removeSubcategoria: (index) => set((state) => ({
        inputs: { 
            ...state.inputs, 
            subcategorias: state.inputs.subcategorias.filter((_, i) => i !== index)
        }
    })),
    updateSubcategoria: (index, nombre) => set((state) => ({
        inputs: { 
            ...state.inputs, 
            subcategorias: state.inputs.subcategorias.map((sub, i) => 
                i === index ? { ...sub, nombre } : sub
            )
        }
    })),
    removeSubcategoriaWithId: (subcategoriaId) => set((state) => {
        const subcategoria = state.inputs.subcategorias.find(s => s.id === subcategoriaId);
        if (subcategoria && subcategoria.id > 0) {
            // Si la subcategoría tiene ID (existe en BD), la agregamos a subcategorias_removed
            return {
                inputs: { 
                    ...state.inputs, 
                    subcategorias: state.inputs.subcategorias.filter(s => s.id !== subcategoriaId),
                    subcategorias_removed: [...state.inputs.subcategorias_removed, subcategoriaId]
                }
            };
        } else {
            // Si no tiene ID (es nueva), solo la removemos del array
            return {
                inputs: { 
                    ...state.inputs, 
                    subcategorias: state.inputs.subcategorias.filter(s => s.id !== subcategoriaId)
                }
            };
        }
    }),
    addCampo: () => set((state) => ({
        inputs: { 
            ...state.inputs, 
            campos: [...state.inputs.campos, { id: 0, id_plantilla: 0, tipo: 0, nombre: '' }]
        }
    })),
    removeCampo: (index) => set((state) => ({
        inputs: { 
            ...state.inputs, 
            campos: state.inputs.campos.filter((_, i) => i !== index)
        }
    })),
    removeCampoWithId: (campoId) => set((state) => {
        const campo = state.inputs.campos.find(c => c.id === campoId);
        if (campo && campo.id > 0) {
            // Si el campo tiene ID (existe en BD), lo agregamos a campos_removed
            return {
                inputs: { 
                    ...state.inputs, 
                    campos: state.inputs.campos.filter(c => c.id !== campoId),
                    campos_removed: [...state.inputs.campos_removed, campoId]
                }
            };
        } else {
            // Si no tiene ID (es nuevo), solo lo removemos del array
            return {
                inputs: { 
                    ...state.inputs, 
                    campos: state.inputs.campos.filter(c => c.id !== campoId)
                }
            };
        }
    }),
    updateCampo: (index, campo) => set((state) => ({
        inputs: { 
            ...state.inputs, 
            campos: state.inputs.campos.map((c, i) => 
                i === index ? { ...c, ...campo } : c
            )
        }
    })),
    resetForm: () => set({ 
        modal: '',
        modoUpdate: false,
        dataUpd: null,
        inputs: { nombre: '', subcategorias: [], subcategorias_removed: [], campos: [], campos_removed: [] }
    })
}));

