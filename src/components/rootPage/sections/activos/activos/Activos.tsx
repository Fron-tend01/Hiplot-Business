import React, { useEffect, useState } from 'react'
import { storeActivos } from '../../../../../zustand/Activos'
import { useStore } from 'zustand'
import APIs from '../../../../../services/services/APIs'
import './Activos.css'
import Swal from 'sweetalert2'
import ModalActivos from './modal-activos/ModalActivos'

const Activos = () => {
  const { 
    setModal, 
    setDataUpd, 
    setModoUpdate,
    categories,
    templates,
    setCategories,
    setTemplates
  } = useStore(storeActivos)

  const [activos, setActivos] = useState<any[]>([])

  const fetchActivos = async () => {
    let data = {
      id: 0,
      nombre: "",
      descripcion: "string",
      id_plantilla: 0,
      id_subcategoria: 0,
      devaluacion: 0,
      marca: "string",
      status: true
    }
    try {
      const response: any = await APIs.CreateAny(JSON.stringify(data), 'get_activos')
      setActivos(response.data || [])
    } catch (error) {
      console.error('Error fetching activos:', error)
      setActivos([])
    }
  }

  const fetchCategories = async () => {
    let data = {
      id: 1,
      nombre: ''
    }
    try {
      const response: any = await APIs.CreateAny(JSON.stringify(data), 'get_activos_categorias')
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
      const response: any = await APIs.CreateAny(JSON.stringify(data), 'get_activos_plantillas')
      setTemplates(response.data || [])
    } catch (error) {
      console.error('Error fetching templates:', error)
      setTemplates([])
    }
  }

  useEffect(() => {
    fetchActivos()
    fetchCategories()
    fetchTemplates()
  }, [])

  const handleCreate = () => {
    setModal('activos_modal')
    setModoUpdate(false)
    setDataUpd(null)
  }

  const handleEdit = (activo: any) => {
    setDataUpd(activo)
    setModoUpdate(true)
    setModal('activos_modal')
  }

  const handleDelete = async (activo: any) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el activo "${activo.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await APIs.deleteAny("activos_delete/" + activo.id)
        Swal.fire('Eliminado', 'El activo ha sido eliminado', 'success');
        fetchActivos()
      } catch (error) {
        Swal.fire('Error', 'Error al eliminar el activo', 'error');
      }
    }
  }

  return (
    <div className='activos'>
      <div className='activos__container'>
        <div className='activos__header'>
          <h2>Gestión de Activos</h2>
          <button 
            className='btn__general-purple' 
            onClick={handleCreate}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Nuevo Activo
          </button>
        </div>

        <div className='activos__table'>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Marca</th>
                <th>Categoría</th>
                <th>Subcategoría</th>
                <th>Plantilla</th>
                <th>Devaluación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {activos && Array.isArray(activos) && activos.length > 0 ? (
                activos.map((activo: any) => (
                  <tr key={activo.id}>
                    <td>{activo.id}</td>
                    <td>{activo.nombre}</td>
                    <td>{activo.marca}</td>
                    <td>{typeof activo.categoria === 'object' ? activo.categoria?.nombre || 'Sin categoría' : activo.categoria || 'Sin categoría'}</td>
                    <td>{typeof activo.subcategoria === 'object' ? activo.subcategoria?.nombre || 'Sin subcategoría' : activo.subcategoria || 'Sin subcategoría'}</td>
                    <td>{typeof activo.plantilla === 'object' ? activo.plantilla?.nombre || 'Sin plantilla' : activo.plantilla || 'Sin plantilla'}</td>
                    <td>{activo.devaluacion}%</td>
                    <td>
                      <div className='actions__container'>
                        <button 
                          className='btn__edit' 
                          onClick={() => handleEdit(activo)}
                          title="Editar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button 
                          className='btn__delete' 
                          onClick={() => handleDelete(activo)}
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
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>
                    {activos === null ? 'Cargando activos...' : 'No hay activos disponibles'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <ModalActivos onRefresh={() => {
          fetchActivos()
          fetchCategories()
          fetchTemplates()
        }} />
      </div>
    </div>
  )
}

export default Activos