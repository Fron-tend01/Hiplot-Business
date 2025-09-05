import { create } from 'zustand';

interface Ticket {
  id: number;
  asunto: string;
  descripcion: string;
  estado: string;
  prioridad: string;
  creadoPor: string;
  fechaCreacion: string;
  asignadoA: string;
  empresa: string;
  sucursal: string;
  categoria: string;
  subcategoria: string;
  nombre: string;
  fechaVencimiento: string;
  tipoTicket: string;
  departamento: string;
}

interface StoreState {
  modal: string;
  modoUpdate: boolean;
  dataUpd: Ticket | null;
  
  // Form fields
  asunto: string;
  descripcion: string;
  estado: string;
  prioridad: string;
  creadoPor: string;
  asignadoA: string;
  empresa: string;
  sucursal: string;
  categoria: string;
  subcategoria: string;
  nombre: string;
  fechaVencimiento: string;
  tipoTicket: string;
  departamento: string;

  // Actions
  setModal: (modal: string) => void;
  setModoUpdate: (modoUpdate: boolean) => void;
  setDataUpd: (dataUpd: Ticket | null) => void;
  
  // Form setters
  setAsunto: (asunto: string) => void;
  setDescripcion: (descripcion: string) => void;
  setEstado: (estado: string) => void;
  setPrioridad: (prioridad: string) => void;
  setCreadoPor: (creadoPor: string) => void;
  setAsignadoA: (asignadoA: string) => void;
  setEmpresa: (empresa: string) => void;
  setSucursal: (sucursal: string) => void;
  setCategoria: (categoria: string) => void;
  setSubcategoria: (subcategoria: string) => void;
  setNombre: (nombre: string) => void;
  setFechaVencimiento: (fechaVencimiento: string) => void;
  setTipoTicket: (tipoTicket: string) => void;
  setDepartamento: (departamento: string) => void;

  resetForm: () => void;
}

export const storeTickets = create<StoreState>((set) => ({
  modal: '',
  modoUpdate: false,
  dataUpd: null,

  // Initial form state
  asunto: '',
  descripcion: '',
  estado: '',
  prioridad: '',
  creadoPor: '',
  asignadoA: '',
  empresa: '',
  sucursal: '',
  categoria: '',
  subcategoria: '',
  nombre: '',
  fechaVencimiento: '',
  tipoTicket: '',
  departamento: '',

  // Actions
  setModal: (modal) => set({ modal }),
  setModoUpdate: (modoUpdate) => set({ modoUpdate }),
  setDataUpd: (dataUpd) => set({ dataUpd }),

  // Form setters
  setAsunto: (asunto) => set({ asunto }),
  setDescripcion: (descripcion) => set({ descripcion }),
  setEstado: (estado) => set({ estado }),
  setPrioridad: (prioridad) => set({ prioridad }),
  setCreadoPor: (creadoPor) => set({ creadoPor }),
  setAsignadoA: (asignadoA) => set({ asignadoA }),
  setEmpresa: (empresa) => set({ empresa }),
  setSucursal: (sucursal) => set({ sucursal }),
  setCategoria: (categoria) => set({ categoria }),
  setSubcategoria: (subcategoria) => set({ subcategoria }),
  setNombre: (nombre) => set({ nombre }),
  setFechaVencimiento: (fechaVencimiento) => set({ fechaVencimiento }),
  setTipoTicket: (tipoTicket) => set({ tipoTicket }),
  setDepartamento: (departamento) => set({ departamento }),

  resetForm: () => set({
    modal: '',
    modoUpdate: false,
    dataUpd: null,
    asunto: '',
    descripcion: '',
    estado: '',
    prioridad: '',
    creadoPor: '',
    asignadoA: '',
    empresa: '',
    sucursal: '',
    categoria: '',
    subcategoria: '',
    nombre: '',
    fechaVencimiento: '',
    tipoTicket: '',
    departamento: '',
  }),
}));
