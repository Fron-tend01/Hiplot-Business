import { create } from 'zustand';

interface StylesState {
  stylesDescription: {
    text: string,
    textCenter: boolean | null;
    textFontWeight: string | null;
    textFontSize: number;
    textColor: string | null;
  };
  setStylesDescription: (styles: Partial<StylesState['stylesDescription']>) => void;
}

interface EditorState {
    editor: {
        imagen: string, 
        titulo: string,
        imagen2: string, 
        titulo2: string,
        imagen3: string, 
        titulo3: string,
        imagen4: string, 
        titulo4: string,
        imagen5: string, 
        titulo5: string
    };
    setEditor: (editores: Partial<EditorState['editor']>) => void;
}

export const useStore = create<StylesState & EditorState>((set) => ({
    stylesDescription: {
      text: '',
      textCenter: null,
      textFontWeight: null,
      textFontSize: 15,
      textColor: null,
    },
    setStylesDescription: (styles) =>
      set((state) => ({
        ...state, // Mantener el resto del estado sin cambios
        stylesDescription: { ...state.stylesDescription, ...styles },
      })),
  
    editor: {
      imagen: '', 
      titulo: '',
      imagen2: '', 
      titulo2: '',
      imagen3: '', 
      titulo3: '',
      imagen4: '', 
      titulo4: '',
      imagen5: '', 
      titulo5: ''
    },
    setEditor: (editors) =>
      set((state) => ({
        ...state, // Mantener el resto del estado sin cambios
        editor: { ...state.editor, ...editors },
      })),
  }));