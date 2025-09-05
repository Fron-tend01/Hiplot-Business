import React, { useEffect, useState } from 'react'
import { storeAssignments } from '../../../../../zustand/Assignments'
import { useStore } from 'zustand'
import APIs from '../../../../../services/services/APIs'
import './Assignment.css'
import Swal from 'sweetalert2'
import ModalAssignment from './modal-assignment/ModalAssignment'
import useUserStore from '../../../../../zustand/General'

const Assignment = () => {
  const { 
    setModal, 
    setDataUpd, 
    setModoUpdate
  } = useStore(storeAssignments)

  const [assignments, setAssignments] = useState<any[]>([])

  const fetchAssignments = async () => {
    let data = {
      id: 0,
      id_usuario_crea: 0,
      id_folio: 0,
      id_usuario_asignado: 0,
      id_sucursal: 0,
      fecha_creacion: "",
      desde: "",
      hasta: "",
      comentarios: "",
      firma: ""
    }
    try {
      const response: any = await APIs.CreateAny(JSON.stringify(data), 'get_activos_asignaciones')
      setAssignments(response.data || [])
    } catch (error) {
      console.error('Error fetching assignments:', error)
      setAssignments([])
    }
  }

  useEffect(() => {
    fetchAssignments()
  }, [])

  const handleCreate = () => {
    setModoUpdate(false)
    setDataUpd(null)
    setModal('assignments_modal')
  }

  const handleEdit = (assignment: any) => {
    setModoUpdate(true)
    setDataUpd(assignment)
    setModal('assignments_modal')
  }

  const handleDelete = async (assignment: any) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la asignación "${assignment.id}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      try {
        await APIs.deleteAny("activos_asignaciones_delete/" + assignment.id)
        Swal.fire('Eliminado', 'La asignación ha sido eliminada.', 'success')
        fetchAssignments()
      } catch (error) {
        console.error('Error deleting assignment:', error)
        Swal.fire('Error', 'Error al eliminar la asignación', 'error')
      }
    }
  }

  return (
    <div className='assignments'>
      <div className='assignments__container'>
        <div className='assignments__header'>
          <h2>Gestión de Asignaciones</h2>
          <button className='btn__general-purple' onClick={handleCreate}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Nueva Asignación
          </button>
        </div>

        <div className='assignments__table'>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Folio</th>
                <th>Usuario Asignado</th>
                <th>Sucursal</th>
                <th>Fecha Creación</th>
                <th>Desde</th>
                <th>Hasta</th>
                <th>Comentarios</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment: any) => {
                // Los datos están en conceptos[0]
                const concepto = assignment.conceptos?.[0] || assignment
                return (
                  <tr key={assignment.id}>
                    <td>{assignment.id}</td>
                    <td>{assignment.id_folio || 'N/A'}</td>
                    <td>{assignment.id_usuario_asignado || 'N/A'}</td>
                    <td>{assignment.id_sucursal || 'N/A'}</td>
                    <td>{assignment.fecha_creacion || 'N/A'}</td>
                    <td>{assignment.desde || 'N/A'}</td>
                    <td>{assignment.hasta || 'N/A'}</td>
                    <td>{assignment.comentarios || 'N/A'}</td>
                    <td>
                      <div className='actions__container'>
                        <button 
                          className='btn__edit' 
                          onClick={() => handleEdit(assignment)}
                          title="Editar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button 
                          className='btn__delete' 
                          onClick={() => handleDelete(assignment)}
                          title="Eliminar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3,6 5,6 21,6"/>
                            <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <ModalAssignment onRefresh={fetchAssignments} />
      </div>
    </div>
  )
}

export default Assignment