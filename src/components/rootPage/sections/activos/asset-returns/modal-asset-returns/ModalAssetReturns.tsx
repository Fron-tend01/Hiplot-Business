import React, { useState, useEffect } from 'react'
import { storeActivos } from '../../../../../../zustand/Activos'
import { useStore } from 'zustand'
import './ModalAssetReturns.css'

interface ModalAssetReturnsProps {
  onRefresh: () => void;
}

const ModalAssetReturns: React.FC<ModalAssetReturnsProps> = ({ onRefresh }) => {
  const { 
    modal, 
    modoUpdate, 
    dataUpd, 
    categories,
    templates,
    setModal, 
    resetForm 
  } = useStore(storeActivos)

  const [formData, setFormData] = useState({
    activo_id: '',
    fecha_devolucion: '',
    motivo: '',
    estado: 'pendiente',
    responsable: '',
    observaciones: '',
    activo_nombre: ''
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [activos, setActivos] = useState<any[]>([])

  useEffect(() => {
    if (modoUpdate && dataUpd) {
      // Si estamos editando, cargar los datos existentes
      setFormData({
        activo_id: dataUpd.activo_id?.toString() || '',
        fecha_devolucion: dataUpd.fecha_devolucion || '',
        motivo: dataUpd.motivo || '',
        estado: dataUpd.estado || 'pendiente',
        responsable: dataUpd.responsable || '',
        observaciones: dataUpd.observaciones || '',
        activo_nombre: dataUpd.activo_nombre || ''
      })
    } else {
      // Si estamos creando nuevo, limpiar el formulario
      setFormData({
        activo_id: '',
        fecha_devolucion: new Date().toISOString().split('T')[0], // Fecha actual
        motivo: '',
        estado: 'pendiente',
        responsable: '',
        observaciones: '',
        activo_nombre: ''
      })
    }
    setErrors({})
  }, [modoUpdate, dataUpd])

  // Cargar activos disponibles
  useEffect(() => {
    const fetchActivos = async () => {
      try {
        // Aquí deberías llamar a la API para obtener los activos disponibles
        // Por ahora usamos datos de ejemplo
        setActivos([
          { id: 1, nombre: 'Laptop Dell Inspiron 15' },
          { id: 2, nombre: 'Monitor Samsung 24"' },
          { id: 3, nombre: 'Impresora HP LaserJet' }
        ])
      } catch (error) {
        console.error('Error fetching activos:', error)
        setActivos([])
      }
    }

    fetchActivos()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleActivoChange = (activoId: string) => {
    const selectedActivo = activos.find(activo => activo.id.toString() === activoId)
    setFormData(prev => ({
      ...prev,
      activo_id: activoId,
      activo_nombre: selectedActivo?.nombre || ''
    }))
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.activo_id) {
      newErrors.activo_id = 'Debe seleccionar un activo'
    }

    if (!formData.fecha_devolucion) {
      newErrors.fecha_devolucion = 'La fecha de devolución es requerida'
    }

    if (!formData.motivo.trim()) {
      newErrors.motivo = 'El motivo es requerido'
    }

    if (!formData.responsable.trim()) {
      newErrors.responsable = 'El responsable es requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      console.log('Form submitted:', formData)
      // Aquí enviarías los datos a tu API
      alert(modoUpdate ? 'Devolución actualizada exitosamente' : 'Devolución creada exitosamente')
      handleClose()
      onRefresh()
    } else {
      console.log('Form has errors:', errors)
    }
  }

  const handleClose = () => {
    resetForm()
  }

  const isModalOpen = modal === 'devoluciones_modal'

  return (
    <div className={`overlay__devoluciones_modal ${isModalOpen ? 'active' : ''}`}>
      <div className="popup__devoluciones_modal">
        <button 
          className="btn-cerrar-popup__devoluciones_modal"
          onClick={handleClose}
        >
          <svg className="svg__close" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <h2 className="title__modals">
          {modoUpdate ? 'Editar Devolución' : 'Nueva Devolución'}
        </h2>

        <form className="devoluciones__form" onSubmit={handleSubmit}>
          {/* DATOS DE LA DEVOLUCIÓN */}
          <div className="devoluciones__section">
            <h3 className="section__title">DATOS DE LA DEVOLUCIÓN</h3>
            
            <div className="form__row form__row_three">
              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">ACTIVO</label>
                  <div className="select__with_button">
                    <select 
                      name="activo_id"
                      value={formData.activo_id}
                      onChange={(e) => handleActivoChange(e.target.value)}
                      className={`inputs__general select_original_general ${errors.activo_id ? 'warning' : ''}`}
                    >
                      <option value="">Seleccionar activo</option>
                      {activos.map((activo) => (
                        <option key={activo.id} value={activo.id.toString()}>
                          {activo.nombre}
                        </option>
                      ))}
                    </select>
                    <button type="button" className="btn__add_category">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14"/>
                      </svg>
                    </button>
                  </div>
                  {errors.activo_id && <div className="warning__general"><small>{errors.activo_id}</small></div>}
                </div>
              </div>
              
              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">FECHA DEVOLUCIÓN</label>
                  <input
                    type="date"
                    name="fecha_devolucion"
                    value={formData.fecha_devolucion}
                    onChange={handleInputChange}
                    className={`inputs__general ${errors.fecha_devolucion ? 'warning' : ''}`}
                  />
                  {errors.fecha_devolucion && <div className="warning__general"><small>{errors.fecha_devolucion}</small></div>}
                </div>
              </div>

              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">ESTADO</label>
                  <select 
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    className="inputs__general select_original_general"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="procesada">Procesada</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form__row form__row_three">
              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">MOTIVO</label>
                  <input
                    type="text"
                    name="motivo"
                    value={formData.motivo}
                    onChange={handleInputChange}
                    className={`inputs__general ${errors.motivo ? 'warning' : ''}`}
                    placeholder="MOTIVO DE LA DEVOLUCIÓN"
                  />
                  {errors.motivo && <div className="warning__general"><small>{errors.motivo}</small></div>}
                </div>
              </div>
              
              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">RESPONSABLE</label>
                  <input
                    type="text"
                    name="responsable"
                    value={formData.responsable}
                    onChange={handleInputChange}
                    className={`inputs__general ${errors.responsable ? 'warning' : ''}`}
                    placeholder="NOMBRE DEL RESPONSABLE"
                  />
                  {errors.responsable && <div className="warning__general"><small>{errors.responsable}</small></div>}
                </div>
              </div>

              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">ACTIVO SELECCIONADO</label>
                  <input
                    type="text"
                    value={formData.activo_nombre}
                    className="inputs__general"
                    disabled
                    placeholder="Seleccione un activo"
                  />
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__col form__col_full">
                <div className="container__textarea_general">
                  <label className="label__general">OBSERVACIONES</label>
                  <textarea
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleInputChange}
                    className="textarea__general"
                    placeholder="OBSERVACIONES ADICIONALES"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form__actions">
            <button type="button" className="btn__general-gray" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn__general-purple">
              {modoUpdate ? 'Actualizar Devolución' : 'Crear Devolución'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalAssetReturns
