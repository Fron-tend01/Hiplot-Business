import React, { useEffect, useState } from 'react'
import { storeActivos } from '../../../../../zustand/Activos'
import { useStore } from 'zustand'
import APIs from '../../../../../services/services/APIs'
import './AssetReturns.css'
import Swal from 'sweetalert2'
import ModalAssetReturns from './modal-asset-returns/ModalAssetReturns'

const AssetReturns = () => {
  const { 
    setModal, 
    setDataUpd, 
    setModoUpdate,
    categories,
    templates,
    setCategories,
    setTemplates
  } = useStore(storeActivos)

  const [devoluciones, setDevoluciones] = useState<any[]>([])

  const fetchDevoluciones = async () => {
    let data = {
      id: 1,
      nombre: ''
    }
    try {
      const response: any = await APIs.CreateAny(data, 'get_devoluciones_activos')
      setDevoluciones(response.data || [])
    } catch (error) {
      console.error('Error fetching devoluciones:', error)
      setDevoluciones([])
    }
  }

  const fetchCategories = async () => {
    let data = {
      id: 1,
      nombre: ''
    }
    try {
      const response: any = await APIs.CreateAny(data, 'get_activos_categorias')
      setCategories(response.data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    }
  }

  const fetchTemplates = async () => {
    let data = {
      id: 1,
      nombre: ''
    }
    try {
      const response: any = await APIs.CreateAny(data, 'get_activos_plantillas')
      setTemplates(response.data || [])
    } catch (error) {
      console.error('Error fetching templates:', error)
      setTemplates([])
    }
  }

  useEffect(() => {
    fetchDevoluciones()
    fetchCategories()
    fetchTemplates()
  }, [])

  const handleCreate = () => {
    setModal('devoluciones_modal')
    setModoUpdate(false)
    setDataUpd(null)
  }

  const handleEdit = (devolucion: any) => {
    setDataUpd(devolucion)
    setModoUpdate(true)
    setModal('devoluciones_modal')
  }

  const handleDelete = async (devolucion: any) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la devolución "${devolucion.nombre || devolucion.id}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await APIs.deleteAny("devoluciones_delete/" + devolucion.id)
        Swal.fire('Eliminado', 'La devolución ha sido eliminada', 'success');
        fetchDevoluciones()
      } catch (error) {
        Swal.fire('Error', 'Error al eliminar la devolución', 'error');
      }
    }
  }

  return (
    <div className='devoluciones'>
      <div className='devoluciones__container'>
        <div className='devoluciones__header'>
          <h2>Gestión de Devoluciones</h2>
          <button 
            className='btn__general-purple' 
            onClick={handleCreate}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Nueva Devolución
          </button>
        </div>

        <div className='devoluciones__table'>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Activo</th>
                <th>Fecha Devolución</th>
                <th>Motivo</th>
                <th>Estado</th>
                <th>Responsable</th>
                <th>Observaciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {devoluciones.map((devolucion: any) => (
                <tr key={devolucion.id}>
                  <td>{devolucion.id}</td>
                  <td>{devolucion.activo_nombre || 'N/A'}</td>
                  <td>{devolucion.fecha_devolucion || 'N/A'}</td>
                  <td>{devolucion.motivo || 'N/A'}</td>
                  <td>
                    <span className={`status-badge ${devolucion.estado?.toLowerCase() || 'pendiente'}`}>
                      {devolucion.estado || 'Pendiente'}
                    </span>
                  </td>
                  <td>{devolucion.responsable || 'N/A'}</td>
                  <td>{devolucion.observaciones || 'Sin observaciones'}</td>
                  <td>
                    <div className='actions__container'>
                      <button 
                        className='btn__edit' 
                        onClick={() => handleEdit(devolucion)}
                        title="Editar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button 
                        className='btn__delete' 
                        onClick={() => handleDelete(devolucion)}
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
              ))}
            </tbody>
          </table>
        </div>

        <ModalAssetReturns onRefresh={() => {
          fetchDevoluciones()
          fetchCategories()
          fetchTemplates()
        }} />
      </div>
    </div>
  )
}

export default AssetReturns  