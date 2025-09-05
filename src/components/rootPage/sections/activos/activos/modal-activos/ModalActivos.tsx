import React, { useState, useEffect } from 'react'
import { storeActivos } from '../../../../../../zustand/Activos'
import { useStore } from 'zustand'
import APIs from '../../../../../../services/services/APIs'
import './ModalActivos.css'

interface ModalActivosProps {
  onRefresh: () => void;
}

const ModalActivos: React.FC<ModalActivosProps> = ({ onRefresh }) => {
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
    nombre: '',
    marca: '',
    categoria: '',
    subcategoria: '',
    plantilla: '',
    devaluacion: '',
    descripcion: '',
    proveedor: '',
    nombreProveedor: ''
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [availableSubcategories, setAvailableSubcategories] = useState<any[]>([])
  const [proveedores, setProveedores] = useState<any[]>([])
  const [proveedoresSeleccionados, setProveedoresSeleccionados] = useState<any[]>([])
  const [buscadorProveedores, setBuscadorProveedores] = useState<string>('')
  const [mostrarBuscador, setMostrarBuscador] = useState<boolean>(false)

  useEffect(() => {
    if (modoUpdate && dataUpd) {
      // Si estamos editando, cargar los datos existentes
      setFormData({
        nombre: dataUpd.nombre || '',
        marca: '',
        categoria: '',
        subcategoria: '',
        plantilla: '',
        devaluacion: '',
        descripcion: '',
        proveedor: '',
        nombreProveedor: ''
      })
    } else {
      // Si estamos creando nuevo, limpiar el formulario
      setFormData({
        nombre: '',
        marca: '',
        categoria: '',
        subcategoria: '',
        plantilla: '',
        devaluacion: '',
        descripcion: '',
        proveedor: '',
        nombreProveedor: ''
      })
    }
    setErrors({})
    setAvailableSubcategories([])
  }, [modoUpdate, dataUpd])

  // Cargar subcategorías cuando se selecciona una categoría en modo edición
  useEffect(() => {
    if (formData.categoria && categories.length > 0) {
      const selectedCategory = categories.find(cat => cat.id.toString() === formData.categoria)
      if (selectedCategory && selectedCategory.subcategorias) {
        setAvailableSubcategories(selectedCategory.subcategorias)
      }
    }
  }, [formData.categoria, categories])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCategoriaChange = (categoriaId: string) => {
    setFormData(prev => ({
      ...prev,
      categoria: categoriaId,
      subcategoria: '' // Reset subcategoría cuando cambia la categoría
    }))

    // Obtener subcategorías de la categoría seleccionada
    const selectedCategory = categories.find(cat => cat.id.toString() === categoriaId)
    if (selectedCategory && selectedCategory.subcategorias) {
      setAvailableSubcategories(selectedCategory.subcategorias)
    } else {
      setAvailableSubcategories([])
    }
  }

  // Funciones para manejo de proveedores
  const buscarProveedores = async () => {
    try {
      if (!buscadorProveedores.trim()) {
        setProveedores([])
        return
      }

      // Usar datos de ejemplo por ahora hasta conectar con la API real
      const proveedoresEjemplo = [
        { id: 1, razon_social: 'PAPELES,VINILOS Y LONAS SA DE CV', nombre_comercial: 'PapelVinilos' },
        { id: 2, razon_social: 'SUMINISTROS INDUSTRIALES MEXICO', nombre_comercial: 'SuministrosMex' },
        { id: 3, razon_social: 'MATERIALES GRAFICOS DEL NORTE', nombre_comercial: 'MaterialesGraf' },
        { id: 4, razon_social: 'EQUIPOS Y SERVICIOS TECNICOS', nombre_comercial: 'EquiposTec' }
      ]
      
      const proveedoresFiltrados = proveedoresEjemplo.filter(proveedor =>
        proveedor.razon_social.toLowerCase().includes(buscadorProveedores.toLowerCase())
      )
      setProveedores(proveedoresFiltrados)
    } catch (error) {
      console.error('Error buscando proveedores:', error)
      setProveedores([])
    }
  }

  const seleccionarProveedor = (proveedor: any) => {
    // Verificar si el proveedor ya está seleccionado
    const yaExiste = proveedoresSeleccionados.find(p => p.id === proveedor.id)
    if (!yaExiste) {
      const nuevoProveedor = {
        id: proveedor.id,
        razon_social: proveedor.razon_social,
        nombre_comercial: proveedor.nombre_comercial,
        prioridad: proveedoresSeleccionados.length + 1
      }
      setProveedoresSeleccionados([...proveedoresSeleccionados, nuevoProveedor])
    }
    setBuscadorProveedores('')
    setMostrarBuscador(false)
    setProveedores([])
  }

  const eliminarProveedor = (proveedorId: number) => {
    const proveedoresActualizados = proveedoresSeleccionados
      .filter(p => p.id !== proveedorId)
      .map((p, index) => ({ ...p, prioridad: index + 1 }))
    setProveedoresSeleccionados(proveedoresActualizados)
  }

  const toggleBuscador = () => {
    setMostrarBuscador(!mostrarBuscador)
    if (!mostrarBuscador) {
      setBuscadorProveedores('')
      setProveedores([])
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del activo es requerido'
    }

    if (!formData.marca.trim()) {
      newErrors.marca = 'La marca es requerida'
    }

    if (!formData.categoria) {
      newErrors.categoria = 'La categoría es requerida'
    }

    if (!formData.subcategoria) {
      newErrors.subcategoria = 'La subcategoría es requerida'
    }

    if (!formData.plantilla) {
      newErrors.plantilla = 'La plantilla es requerida'
    }

    if (formData.devaluacion && (isNaN(Number(formData.devaluacion)) || Number(formData.devaluacion) < 0 || Number(formData.devaluacion) > 100)) {
      newErrors.devaluacion = 'La devaluación debe ser un porcentaje válido (0-100)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      try {
        // Preparar los datos según el schema de la API
        const dataToSend = {
          id: modoUpdate ? dataUpd?.id : 0,
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          id_plantilla: parseInt(formData.plantilla) || 0,
          id_subcategoria: parseInt(formData.subcategoria) || 0,
          devaluacion: parseInt(formData.devaluacion) || 0,
          marca: formData.marca,
          status: true,
          proveedores: proveedoresSeleccionados.map(proveedor => ({
            id: 0,
            id_activo: modoUpdate ? dataUpd?.id : 0,
            id_proveedor: proveedor.id
          }))
        }
        
        console.log('Datos a enviar:', dataToSend)
        
        if (modoUpdate) {
          await APIs.CreateAnyPut(JSON.stringify(dataToSend), 'activos_update')
        } else {
          await APIs.CreateAny(JSON.stringify(dataToSend), 'create_activos')
        }
        
        alert(modoUpdate ? 'Activo actualizado exitosamente' : 'Activo creado exitosamente')
        onRefresh()
        handleClose()
      } catch (error) {
        console.error('Error al guardar activo:', error)
        alert('Error al guardar el activo. Por favor, inténtalo de nuevo.')
      }
    } else {
      console.log('Form has errors:', errors)
    }
  }

  const handleClose = () => {
    resetForm()
  }

  const isModalOpen = modal === 'activos_modal'

  return (
    <div className={`overlay__activos_modal ${isModalOpen ? 'active' : ''}`}>
      <div className="popup__activos_modal">
        <button 
          className="btn-cerrar-popup__activos_modal"
          onClick={handleClose}
        >
          <svg className="svg__close" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <h2 className="title__modals">
          {modoUpdate ? 'Editar Activo' : 'Nuevo Activo'}
        </h2>

        <form className="activos__form" onSubmit={handleSubmit}>
          {/* DATOS DEL ACTIVO */}
          <div className="activos__section">
            <h3 className="section__title">DATOS DEL ACTIVO</h3>
            
            <div className="form__row form__row_three">
              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">NOMBRE</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className={`inputs__general ${errors.nombre ? 'warning' : ''}`}
                    placeholder="NOMBRE DEL ACT..."
                  />
                  {errors.nombre && <div className="warning__general"><small>{errors.nombre}</small></div>}
                </div>
              </div>
              
              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">MARCA</label>
                  <input
                    type="text"
                    name="marca"
                    value={formData.marca}
                    onChange={handleInputChange}
                    className={`inputs__general ${errors.marca ? 'warning' : ''}`}
                    placeholder="MARCA DEL ACT..."
                  />
                  {errors.marca && <div className="warning__general"><small>{errors.marca}</small></div>}
                </div>
              </div>

              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">DEVALUACIÓN</label>
                  <input
                    type="number"
                    name="devaluacion"
                    value={formData.devaluacion}
                    onChange={handleInputChange}
                    className={`inputs__general ${errors.devaluacion ? 'warning' : ''}`}
                    placeholder="INGRESA PORCENTAJE"
                  />
                  {errors.devaluacion && <div className="warning__general"><small>{errors.devaluacion}</small></div>}
                </div>
              </div>
            </div>

            <div className="form__row form__row_three">
              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">CATEGORÍA</label>
                  <select 
                    name="categoria"
                    value={formData.categoria}
                    onChange={(e) => handleCategoriaChange(e.target.value)}
                    className={`inputs__general ${errors.categoria ? 'warning' : ''}`}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id.toString()}>
                        {category.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.categoria && <div className="warning__general"><small>{errors.categoria}</small></div>}
                </div>
              </div>
              
              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">SUBCATEGORÍA</label>
                  <select 
                    name="subcategoria"
                    value={formData.subcategoria}
                    onChange={(e) => setFormData(prev => ({ ...prev, subcategoria: e.target.value }))}
                    className={`inputs__general ${errors.subcategoria ? 'warning' : ''}`}
                    disabled={!formData.categoria}
                  >
                    <option value="">Seleccionar subcategoría</option>
                    {availableSubcategories.map((subcategory) => (
                      <option key={subcategory.id} value={subcategory.id.toString()}>
                        {subcategory.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.subcategoria && <div className="warning__general"><small>{errors.subcategoria}</small></div>}
                </div>
              </div>

              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">PLANTILLA</label>
                  <select 
                    name="plantilla"
                    value={formData.plantilla}
                    onChange={(e) => setFormData(prev => ({ ...prev, plantilla: e.target.value }))}
                    className={`inputs__general ${errors.plantilla ? 'warning' : ''}`}
                  >
                    <option value="">Seleccionar plantilla</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id.toString()}>
                        {template.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.plantilla && <div className="warning__general"><small>{errors.plantilla}</small></div>}
                </div>
              </div>
            </div>

            <div className="form__row">
              <div className="form__col form__col_full">
                <div className="container__textarea_general">
                  <label className="label__general">DESCRIPCIÓN</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    className="textarea__general"
                    placeholder="INGRESA DATO"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PROVEEDORES */}
          <div className="activos__section">
            <h3 className="section__title">PROVEEDORES</h3>
            
            <div className="form__row">
              <div className="form__col form__col_full">
                <div className="container__inputs_general">
                  <label className="label__general">BUSCAR PROVEEDOR</label>
                  <div className="input__with_search">
                    <input
                      type="text"
                      value={buscadorProveedores}
                      onChange={(e) => setBuscadorProveedores(e.target.value)}
                      onKeyUp={(e) => e.key === 'Enter' && buscarProveedores()}
                      className="inputs__general"
                      placeholder="Buscar proveedor por nombre..."
                    />
                    <button 
                      type="button" 
                      className="icon__search"
                      onClick={buscarProveedores}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                      </svg>
                    </button>
                  </div>
                  
                  {/* Resultados de búsqueda */}
                  {proveedores.length > 0 && (
                    <div className="search-results">
                      <ul className="proveedores-list">
                        {proveedores.map((proveedor) => (
                          <li 
                            key={proveedor.id}
                            className="proveedor-item"
                            onClick={() => seleccionarProveedor(proveedor)}
                          >
                            <div className="proveedor-info">
                              <strong>{proveedor.razon_social}</strong>
                              <span className="nombre-comercial">{proveedor.nombre_comercial}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Lista de proveedores seleccionados */}
            {proveedoresSeleccionados.length > 0 && (
              <div className="form__row">
                <div className="form__col form__col_full">
                  <div className="container__inputs_general">
                    <label className="label__general">PROVEEDORES SELECCIONADOS</label>
                    <div className="proveedores-seleccionados">
                      {proveedoresSeleccionados.map((proveedor, index) => (
                        <div key={proveedor.id} className="proveedor-seleccionado">
                          <div className="proveedor-info">
                            <span className="prioridad">{index + 1}</span>
                            <div className="proveedor-details">
                              <strong>{proveedor.razon_social}</strong>
                              <span className="nombre-comercial">{proveedor.nombre_comercial}</span>
                            </div>
                          </div>
                          <button 
                            type="button"
                            className="btn-eliminar-proveedor"
                            onClick={() => eliminarProveedor(proveedor.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="form__actions">
            <button type="button" className="btn__general-gray" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn__general-purple">
              {modoUpdate ? 'Actualizar Activo' : 'Crear Activo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalActivos