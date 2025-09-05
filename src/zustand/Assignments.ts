import { create } from 'zustand'

interface Assignment {
  id: number
  id_usuario_crea: number
  id_folio: number
  id_usuario_asignado: number
  id_sucursal: number
  fecha_creacion: string
  desde: string
  hasta: string
  comentarios: string
  firma: string
  conceptos: AssignmentConcept[]
}

interface AssignmentConcept {
  id: number
  id_activos_asignaciones: number
  id_activo: number
  id_area: number
  comentarios: string
  ubicacion: string
  imagenes: AssignmentImage[]
  imagenes_removed: number[]
}

interface AssignmentImage {
  id: number
  id_activos_asignaciones_conceptos: number
  ruta: string
}

interface StoreState {
  modal: string
  modoUpdate: boolean
  dataUpd: Assignment | null
  assignments: Assignment[]
  setModal: (modal: string) => void
  setModoUpdate: (modo: boolean) => void
  setDataUpd: (data: Assignment | null) => void
  setAssignments: (assignments: Assignment[]) => void
  resetForm: () => void
}

export const storeAssignments = create<StoreState>((set) => ({
  modal: '',
  modoUpdate: false,
  dataUpd: null,
  assignments: [],
  setModal: (modal) => set({ modal }),
  setModoUpdate: (modo) => set({ modoUpdate: modo }),
  setDataUpd: (data) => set({ dataUpd: data }),
  setAssignments: (assignments) => set({ assignments }),
  resetForm: () => set({ modal: '', modoUpdate: false, dataUpd: null })
}))

export default storeAssignments
