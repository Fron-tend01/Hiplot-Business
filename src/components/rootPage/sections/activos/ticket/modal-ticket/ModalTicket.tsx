import React, { useState, useEffect } from 'react'
import { storeTickets } from '../../../../../../zustand/Tickets'
import { useStore } from 'zustand'
import APIs from '../../../../../../services/services/APIs'
import './ModalTicket.css'
import useUserStore from '../../../../../../zustand/General'

interface ModalTicketProps {
  onRefresh: () => void;
}

const ModalTicket: React.FC<ModalTicketProps> = ({ onRefresh }) => {
  const { 
    modal,
    modoUpdate, 
    dataUpd,
    setModal,
    resetForm
  } = useStore(storeTickets)

  const [formData, setFormData] = useState({
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
    fechaCreacion: '',
    fechaVencimiento: '',
    departamento: ''
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [activosEncontrados, setActivosEncontrados] = useState<any[]>([])
  const [activosSeleccionados, setActivosSeleccionados] = useState<any[]>([])
  const [empresas, setEmpresas] = useState<any[]>([])
  const [sucursales, setSucursales] = useState<any[]>([])
  const [categorias, setCategorias] = useState<any[]>([])
  const [subcategorias, setSubcategorias] = useState<any[]>([])

  useEffect(() => {
    if (modoUpdate && dataUpd) {
      // Si estamos editando, cargar los datos existentes según el schema EntradaConceptoSchema
      // Los datos están en conceptos[0]
      const concepto = (dataUpd as any).conceptos?.[0] || dataUpd
      
      setFormData({
        asunto: concepto.folio_factura || '',
        descripcion: concepto.comentarios || '',
        estado: concepto.folio_interno || '',
        prioridad: concepto.cp?.[0]?.tipo_cp || '',
        creadoPor: '',
        asignadoA: '',
        empresa: concepto.id_proveedor?.toString() || '',
        sucursal: (dataUpd as any).id_sucursal?.toString() || '',
        categoria: '',
        subcategoria: '',
        nombre: concepto.cp?.[0]?.nombre_cp || '',
        fechaCreacion: concepto.fecha_compra || '',
        fechaVencimiento: concepto.fecha_garantia || '',
        departamento: ''
      })
      
      // Cargar los activos seleccionados desde cp
      if (concepto.cp && concepto.cp.length > 0) {
        const activosFromCp = concepto.cp.map((cp: any) => ({
          id: cp.id,
          nombre: cp.nombre_cp,
          descripcion: cp.valor
        }))
        setActivosSeleccionados(activosFromCp)
      }
    } else {
      // Si estamos creando nuevo, limpiar el formulario
      setFormData({
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
        fechaCreacion: new Date().toISOString().split('T')[0],
        fechaVencimiento: '',
        departamento: ''
      })
    }
    setErrors({})
  }, [modoUpdate, dataUpd])

  // Cargar empresas y categorías cuando se abre el modal
  useEffect(() => {
    console.log('Modal state:', modal)
    if (modal === 'tickets_modal') {
      console.log('Opening tickets modal, fetching empresas and categorias...')
      fetchEmpresas()
      fetchCategorias()
    }
  }, [modal])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }))

    // Si se selecciona una empresa, cargar sus sucursales
    if (name === 'empresa' && value) {
      const empresaId = parseInt(value)
      fetchSucursales(empresaId)
      // Limpiar sucursal seleccionada
      setFormData(prev => ({
        ...prev,
        sucursal: ''
      }))
    }

    // Si se selecciona una categoría, cargar sus subcategorías
    if (name === 'categoria' && value) {
      const categoriaId = parseInt(value)
      const categoriaSeleccionada = categorias.find(cat => cat.id === categoriaId)
      if (categoriaSeleccionada && categoriaSeleccionada.subcategorias) {
        setSubcategorias(categoriaSeleccionada.subcategorias)
      } else {
        setSubcategorias([])
      }
      // Limpiar subcategoría seleccionada
      setFormData(prev => ({
        ...prev,
        subcategoria: ''
      }))
    }
 
  }

  const handleBuscarActivos = async () => {
    try {
      // Usar el schema de la API según la imagen
      const searchData = {
        id: 0,
        nombre: formData.nombre || "",
        descripcion: '',
        id_plantilla: 0,
        id_subcategoria: parseInt(formData.subcategoria) || 0,
        devaluacion: 0,
        marca: '',
        status: true
      }
      
      console.log('Buscando activos con datos:', searchData)
      
      // Llamar a la API real para buscar activos
      const response: any = await APIs.CreateAny(JSON.stringify(searchData), 'get_activos')
      console.log('Respuesta de activos:', response)
      
      setActivosEncontrados(response.data || [])
    } catch (error) {
      console.error('Error buscando activos:', error)
      setActivosEncontrados([])
    }
  }

  const agregarActivo = (activo: any) => {
    const yaExiste = activosSeleccionados.find(a => a.id === activo.id)
    if (!yaExiste) {
      setActivosSeleccionados([...activosSeleccionados, activo])
    }
  }

  const eliminarActivo = (activoId: number) => {
    setActivosSeleccionados(activosSeleccionados.filter(a => a.id !== activoId))
  }
  const userState = useUserStore(state => state.user);

  const fetchEmpresas = async () => {
    try {
      // Obtener el ID del usuario desde localStorage o desde el store
      const userId = userState.id
      const response: any = await APIs.getCompaniesXUsers(userId)
      console.log('Empresas response:', response)
      setEmpresas(response)
    } catch (error) {
      console.error('Error fetching empresas:', error)
      setEmpresas([])
    }
  }

  const fetchSucursales = async (empresaId: number) => {
    try {
      const response: any = await APIs.getBranchOfficesXCompanies(empresaId, userState.id)
      setSucursales(response)
    } catch (error) {
      console.error('Error fetching sucursales:', error)
      setSucursales([])
    }
  }

  const fetchCategorias = async () => {
    try {
      const data = {
        id: 0,
        nombre: "",
        descripcion: "string",
        status: true
      }
      const response: any = await APIs.CreateAny(JSON.stringify(data), 'get_activos_categorias')
      setCategorias(response.data || [])
    } catch (error) {
      console.error('Error fetching categorias:', error)
      setCategorias([])
    }
  }

 

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.asunto.trim()) {
      newErrors.asunto = 'El asunto es requerido'
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida'
    }

    if (!formData.estado.trim()) {
      newErrors.estado = 'El estado es requerido'
    }

    if (!formData.prioridad.trim()) {
      newErrors.prioridad = 'La prioridad es requerida'
    }



    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      try {
        // Preparar los datos según el schema EntradaConceptoSchema
        const dataToSend = {
          id: modoUpdate ? dataUpd?.id : 0,
          id_entrada: 0,
          id_proveedor: 0, // No requerido, solo filtro
          id_activo: 0,
          fecha_compra: formData.fechaCreacion || null,
          fecha_garantia: formData.fechaVencimiento || null,
          costo: 0,
          folio_factura: formData.asunto || null,
          comentarios: formData.descripcion || null,
          folio_interno: formData.estado || null,
          fecha_compra_ge: formData.fechaCreacion || null,
          fecha_factura: formData.fechaCreacion || null,
          costo_final: 0,
          cp: activosSeleccionados.map((activo, index) => ({
            id: 0,
            nombre_cp: activo.nombre || "",
            tipo_cp: formData.prioridad || "",
            id_activos_entradas_conceptos: 0,
            valor: activo.descripcion || ""
          })),
          imagenes: [],
          imagenes_removed: []
        }
        
        console.log('Datos a enviar:', dataToSend)
        
        if (modoUpdate) {
          await APIs.CreateAnyPut(JSON.stringify(dataToSend), 'update_activos_entradas')
        } else {
          await APIs.CreateAny(JSON.stringify(dataToSend), 'create_activos_entradas')
        }
        
        alert(modoUpdate ? 'Entrada actualizada exitosamente' : 'Entrada creada exitosamente')
        onRefresh()
        handleClose()
      } catch (error) {
        console.error('Error al guardar entrada:', error)
        alert('Error al guardar la entrada. Por favor, inténtalo de nuevo.')
      }
    } else {
      console.log('Form has errors:', errors)
    }
  }

  const handleClose = () => {
    resetForm()
    setActivosEncontrados([])
    setActivosSeleccionados([])
  }

  const isModalOpen = modal === 'tickets_modal'

  return (
    <div className={`overlay__tickets_modal ${isModalOpen ? 'active' : ''}`}>
      <div className="popup__tickets_modal">
        <button 
          className="btn-cerrar-popup__tickets_modal"
          onClick={handleClose}
        >
          <svg className="svg__close" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <h2 className="title__modals">
          {modoUpdate ? 'Editar Entrada' : 'Nueva Entrada'}
        </h2>

        <form className="tickets__form" onSubmit={handleSubmit}>
          {/* FILTROS DE BÚSQUEDA DE ACTIVOS */}
          <div className="activos__section">
            <h3 className="section__title">FILTROS DE BÚSQUEDA DE ACTIVOS</h3>
            
            <div className="form__row form__row_three">
              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">EMPRESA</label>
                  <select
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleInputChange}
                    className={`inputs__general ${errors.empresa ? 'warning' : ''}`}
                  >
                    <option value="">Seleccionar empresa</option>
                    {empresas.map((empresa: any) => {
                      console.log('Rendering empresa:', empresa)
  return (
                        <option key={empresa.id} value={empresa.id}>
                          {empresa.nombre_comercial}
                        </option>
                      )
                    })}
                  </select>
                  {errors.empresa && <div className="warning__general"><small>{errors.empresa}</small></div>}
                </div>
              </div>
              
              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">SUCURSAL</label>
                  <select 
                    name="sucursal"
                    value={formData.sucursal}
                    onChange={handleInputChange}
                    className={`inputs__general ${errors.sucursal ? 'warning' : ''}`}
                    disabled={!formData.empresa}
                  >
                    <option value="">Seleccionar sucursal</option>
                    {sucursales.map((sucursal: any) => (
                      <option key={sucursal.id} value={sucursal.id}>
                        {sucursal.nombre || sucursal.name}
                      </option>
                    ))}
                  </select>
                  {errors.sucursal && <div className="warning__general"><small>{errors.sucursal}</small></div>}
                </div>
              </div>
              
              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">CATEGORÍA</label>
                  <select 
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    className={`inputs__general ${errors.categoria ? 'warning' : ''}`}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((categoria: any) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.categoria && <div className="warning__general"><small>{errors.categoria}</small></div>}
                </div>
              </div>
            </div>

            <div className="form__row form__row_three">
              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">SUBCATEGORÍA</label>
                  <select 
                    name="subcategoria"
                    value={formData.subcategoria}
                    onChange={handleInputChange}
                    className={`inputs__general ${errors.subcategoria ? 'warning' : ''}`}
                    disabled={!formData.categoria}
                  >
                    <option value="">Seleccionar subcategoría</option>
                    {subcategorias.map((subcategoria: any) => (
                      <option key={subcategoria.id} value={subcategoria.id}>
                        {subcategoria.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.subcategoria && <div className="warning__general"><small>{errors.subcategoria}</small></div>}
                </div>
              </div>
              
              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">NOMBRE</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className={`inputs__general ${errors.nombre ? 'warning' : ''}`}
                    placeholder="Ingresa nombre"
                  />
                  {errors.nombre && <div className="warning__general"><small>{errors.nombre}</small></div>}
                </div>
              </div>
              
              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">BUSCAR</label>
                  <button 
                    type="button" 
                    className="btn__general-purple"
                    onClick={handleBuscarActivos}
                    style={{ width: '100%', height: '40px' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.35-4.35"/>
                    </svg>
                    BUSCAR ACTIVOS
                  </button>
                </div>
              </div>
            </div>

            {/* Resultados de búsqueda de activos */}
            {activosEncontrados.length > 0 && (
              <div className="form__row">
                <div className="form__col form__col_full">
                  <div className="container__inputs_general">
                    <label className="label__general">ACTIVOS ENCONTRADOS</label>
                    <div className="activos-resultados">
                      {activosEncontrados.map((activo: any) => (
                        <div key={activo.id} className="activo-item">
                          <div className="activo-info">
                            <strong>{activo.nombre}</strong>
                            <span className="activo-descripcion">{activo.descripcion}</span>
                          </div>
                          <button 
                            type="button"
                            className="btn__general-purple btn-agregar-activo"
                            onClick={() => agregarActivo(activo)}
                          >
                            Agregar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONCEPTOS/ARREGLOS */}
          <div className="activos__section">
            <h3 className="section__title">CONCEPTOS/ARREGLOS</h3>
            
            <div className="form__row form__row_three">
              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">ASUNTO</label>
                  <input
                    type="text"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleInputChange}
                    className={`inputs__general ${errors.asunto ? 'warning' : ''}`}
                    placeholder="Asunto del ticket"
                  />
                  {errors.asunto && <div className="warning__general"><small>{errors.asunto}</small></div>}
                </div>
              </div>
              
              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">ESTADO</label>
                  <select 
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    className={`inputs__general ${errors.estado ? 'warning' : ''}`}
                  >
                    <option value="">Seleccionar estado</option>
                    <option value="Abierto">Abierto</option>
                    <option value="En Progreso">En Progreso</option>
                    <option value="Cerrado">Cerrado</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                  {errors.estado && <div className="warning__general"><small>{errors.estado}</small></div>}
                </div>
              </div>
              
              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">PRIORIDAD</label>
                  <select 
                    name="prioridad"
                    value={formData.prioridad}
                    onChange={handleInputChange}
                    className={`inputs__general ${errors.prioridad ? 'warning' : ''}`}
                  >
                    <option value="">Seleccionar prioridad</option>
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                  {errors.prioridad && <div className="warning__general"><small>{errors.prioridad}</small></div>}
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
                    className={`textarea__general ${errors.descripcion ? 'warning' : ''}`}
                    placeholder="Descripción detallada del ticket"
                    rows={4}
                  />
                  {errors.descripcion && <div className="warning__general"><small>{errors.descripcion}</small></div>}
                </div>
              </div>
            </div>

            <div className="form__row form__row_three">
              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">FECHA DE CREACIÓN</label>
                  <input
                    type="date"
                    name="fechaCreacion"
                    value={formData.fechaCreacion}
                    onChange={handleInputChange}
                    className={`inputs__general ${errors.fechaCreacion ? 'warning' : ''}`}
                  />
                  {errors.fechaCreacion && <div className="warning__general"><small>{errors.fechaCreacion}</small></div>}
                </div>
              </div>
              
              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">FECHA DE VENCIMIENTO</label>
                  <input
                    type="date"
                    name="fechaVencimiento"
                    value={formData.fechaVencimiento}
                    onChange={handleInputChange}
                    className={`inputs__general ${errors.fechaVencimiento ? 'warning' : ''}`}
                  />
                  {errors.fechaVencimiento && <div className="warning__general"><small>{errors.fechaVencimiento}</small></div>}
                </div>
              </div>
              
              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">DEPARTAMENTO</label>
                  <select 
                    name="departamento"
                    value={formData.departamento}
                    onChange={handleInputChange}
                    className={`inputs__general ${errors.departamento ? 'warning' : ''}`}
                  >
                    <option value="">Seleccionar departamento</option>
                    <option value="IT">IT</option>
                    <option value="Recursos Humanos">Recursos Humanos</option>
                    <option value="Contabilidad">Contabilidad</option>
                    <option value="Ventas">Ventas</option>
                  </select>
                  {errors.departamento && <div className="warning__general"><small>{errors.departamento}</small></div>}
                </div>
              </div>
            </div>

            <div className="form__row form__row_three">
              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">CREADO POR</label>
                  <input
                    type="text"
                    name="creadoPor"
                    value={formData.creadoPor}
                    onChange={handleInputChange}
                    className={`inputs__general ${errors.creadoPor ? 'warning' : ''}`}
                    placeholder="Nombre del creador"
                  />
                  {errors.creadoPor && <div className="warning__general"><small>{errors.creadoPor}</small></div>}
                </div>
              </div>
              
              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">ASIGNADO A</label>
                  <input
                    type="text"
                    name="asignadoA"
                    value={formData.asignadoA}
                    onChange={handleInputChange}
                    className={`inputs__general ${errors.asignadoA ? 'warning' : ''}`}
                    placeholder="Nombre del asignado"
                  />
                  {errors.asignadoA && <div className="warning__general"><small>{errors.asignadoA}</small></div>}
                </div>
              </div>
            </div>

            {/* Activos seleccionados */}
            {activosSeleccionados.length > 0 && (
              <div className="form__row">
                <div className="form__col form__col_full">
                  <div className="container__inputs_general">
                    <label className="label__general">ACTIVOS SELECCIONADOS</label>
                    <div className="activos-seleccionados">
                      {activosSeleccionados.map((activo: any, index: number) => (
                        <div key={activo.id} className="activo-seleccionado">
                          <div className="activo-info">
                            <span className="activo-numero">{index + 1}</span>
                            <div className="activo-details">
                              <strong>{activo.nombre}</strong>
                              <span className="activo-descripcion">{activo.descripcion}</span>
                            </div>
                          </div>
                          <button 
                            type="button"
                            className="btn-eliminar-activo"
                            onClick={() => eliminarActivo(activo.id)}
                            title="Eliminar activo"
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
              {modoUpdate ? 'Actualizar Ticket' : 'Crear Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalTicket