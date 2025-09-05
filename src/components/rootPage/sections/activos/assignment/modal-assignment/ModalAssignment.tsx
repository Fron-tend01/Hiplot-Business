import React, { useEffect, useState } from 'react'
import { storeAssignments } from '../../../../../../zustand/Assignments'
import { useStore } from 'zustand'
import APIs from '../../../../../../services/services/APIs'
import useUserStore from '../../../../../../zustand/General'
import './ModalAssignment.css'

interface ModalAssignmentProps {
  onRefresh: () => void
}

const ModalAssignment: React.FC<ModalAssignmentProps> = ({ onRefresh }) => {
  const { modal, modoUpdate, dataUpd, setModal, setModoUpdate, setDataUpd } = useStore(storeAssignments)
  const { user } = useUserStore(state => ({ user: state.user }))
  const userState = useUserStore(state => state.user);
  
  const [formData, setFormData] = useState({
    id_usuario_asignado: '',
    id_sucursal: '',
    desde: '',
    hasta: '',
    comentarios: '',
    firma: ''
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [empresas, setEmpresas] = useState<any[]>([])
  const [sucursales, setSucursales] = useState<any[]>([])
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [activosEncontrados, setActivosEncontrados] = useState<any[]>([])
  const [activosSeleccionados, setActivosSeleccionados] = useState<any[]>([])

  // Fetch empresas
  const fetchEmpresas = async () => {
    try {
      const response: any = await APIs.getCompaniesXUsers(user?.id || 0)
      setEmpresas(response.data || [])
    } catch (error) {
      console.error('Error fetching empresas:', error)
      setEmpresas([])
    }
  }

  // Fetch sucursales based on empresa
  const fetchSucursales = async (empresaId: string) => {
    if (!empresaId) {
      setSucursales([])
      return
    }
    try {
      const response: any = await APIs.getBranchOfficesXCompanies(parseInt(empresaId))
      setSucursales(response.data || [])
    } catch (error) {
      console.error('Error fetching sucursales:', error)
      setSucursales([])
    }
  }

  // Fetch usuarios
  const fetchUsuarios = async () => {
    try {
      const response: any = await APIs.CreateAny(JSON.stringify({ id: 0 }), 'get_usuarios')
      setUsuarios(response.data || [])
    } catch (error) {
      console.error('Error fetching usuarios:', error)
      setUsuarios([])
    }
  }

  // Buscar activos
  const handleBuscarActivos = async () => {
    try {
      const dataToSend = {
        id: 0,
        empresa: formData.id_sucursal ? empresas.find(e => e.id === parseInt(formData.id_sucursal))?.id : 0,
        sucursal: formData.id_sucursal || 0,
        categoria: 0,
        subcategoria: 0,
        nombre: "",
        descripcion: "",
        marca: ""
      }
      
      const response: any = await APIs.CreateAny(JSON.stringify(dataToSend), 'get_activos')
      setActivosEncontrados(response.data || [])
    } catch (error) {
      console.error('Error buscando activos:', error)
      setActivosEncontrados([])
    }
  }

  // Agregar activo seleccionado
  const agregarActivo = (activo: any) => {
    if (!activosSeleccionados.find(a => a.id === activo.id)) {
      setActivosSeleccionados([...activosSeleccionados, activo])
    }
  }

  // Eliminar activo seleccionado
  const eliminarActivo = (activoId: number) => {
    setActivosSeleccionados(activosSeleccionados.filter(a => a.id !== activoId))
  }

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }

    // Fetch sucursales when empresa changes
    if (name === 'id_sucursal') {
      fetchSucursales(value)
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.id_usuario_asignado) {
      newErrors.id_usuario_asignado = 'El usuario asignado es requerido'
    }
    if (!formData.id_sucursal) {
      newErrors.id_sucursal = 'La sucursal es requerida'
    }
    if (!formData.desde) {
      newErrors.desde = 'La fecha desde es requerida'
    }
    if (!formData.hasta) {
      newErrors.hasta = 'La fecha hasta es requerida'
    }
    if (activosSeleccionados.length === 0) {
      newErrors.activos = 'Debe seleccionar al menos un activo'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      try {
        // Preparar los datos según el schema AsignacionSchema
        const dataToSend = {
          id_usuario_crea: user?.id || 0,
          id_folio: 0, // Se genera automáticamente
          id_usuario_asignado: parseInt(formData.id_usuario_asignado),
          id_sucursal: parseInt(formData.id_sucursal),
          fecha_creacion: new Date().toISOString().split('T')[0],
          desde: formData.desde,
          hasta: formData.hasta,
          comentarios: formData.comentarios,
          firma: formData.firma,
          conceptos: activosSeleccionados.map(activo => ({
            id: 0,
            id_activos_asignaciones: 0,
            id_activo: activo.id,
            id_area: 0, // Se puede agregar un campo para área
            comentarios: activo.descripcion || "",
            ubicacion: activo.ubicacion || "",
            imagenes: [],
            imagenes_removed: []
          }))
        }
        
        console.log('Datos a enviar:', dataToSend)
        
        if (modoUpdate) {
          await APIs.CreateAnyPut(JSON.stringify(dataToSend), 'update_activos_asignaciones')
        } else {
          await APIs.CreateAny(JSON.stringify(dataToSend), 'create_activos_asignaciones')
        }
        
        alert(modoUpdate ? 'Asignación actualizada exitosamente' : 'Asignación creada exitosamente')
        onRefresh()
        handleClose()
      } catch (error) {
        console.error('Error al guardar asignación:', error)
        alert('Error al guardar la asignación. Por favor, inténtalo de nuevo.')
      }
    } else {
      console.log('Form has errors:', errors)
    }
  }

  // Handle close modal
  const handleClose = () => {
    setModal('')
    setModoUpdate(false)
    setDataUpd(null)
    setFormData({
      id_usuario_asignado: '',
      id_sucursal: '',
      desde: '',
      hasta: '',
      comentarios: '',
      firma: ''
    })
    setErrors({})
    setActivosEncontrados([])
    setActivosSeleccionados([])
  }

  // Load initial data
  useEffect(() => {
    if (modal === 'assignments_modal') {
      fetchEmpresas()
      fetchUsuarios()
    }
  }, [modal])

  // Load data for update
  useEffect(() => {
    if (modoUpdate && dataUpd) {
      // Si estamos editando, cargar los datos existentes
      setFormData({
        id_usuario_asignado: dataUpd.id_usuario_asignado?.toString() || '',
        id_sucursal: dataUpd.id_sucursal?.toString() || '',
        desde: dataUpd.desde || '',
        hasta: dataUpd.hasta || '',
        comentarios: dataUpd.comentarios || '',
        firma: dataUpd.firma || ''
      })
      
      // Cargar los activos seleccionados desde conceptos
      if (dataUpd.conceptos && dataUpd.conceptos.length > 0) {
        const activosFromConceptos = dataUpd.conceptos.map((concepto: any) => ({
          id: concepto.id_activo,
          nombre: concepto.comentarios,
          descripcion: concepto.comentarios,
          ubicacion: concepto.ubicacion
        }))
        setActivosSeleccionados(activosFromConceptos)
      }
    } else {
      // Si estamos creando nuevo, limpiar el formulario
      setFormData({
        id_usuario_asignado: '',
        id_sucursal: '',
        desde: new Date().toISOString().split('T')[0],
        hasta: '',
        comentarios: '',
        firma: ''
      })
    }
    setErrors({})
  }, [modoUpdate, dataUpd])

  return (
    <div className={`overlay__assignments_modal ${modal === 'assignments_modal' ? 'active' : ''}`}>
      <div className="popup__assignments_modal">
        <button 
          className="btn-cerrar-popup__assignments_modal"
          onClick={handleClose}
        >
          <svg className="svg__close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <h2 className="title__modals">
          {modoUpdate ? 'Editar Asignación' : 'Nueva Asignación'}
        </h2>

        <form className="assignments__form" onSubmit={handleSubmit}>
          {/* DATOS DE LA ASIGNACIÓN */}
          <div className="assignments__section">
            <h3 className="section__title">Datos de la Asignación</h3>
            
            <div className="form__row form__row_three">
              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">Usuario Asignado *</label>
                  <select
                    name="id_usuario_asignado"
                    value={formData.id_usuario_asignado}
                    onChange={handleInputChange}
                    className={`inputs__general ${errors.id_usuario_asignado ? 'warning' : ''}`}
                  >
                    <option value="">Seleccionar usuario</option>
                    {usuarios.map(usuario => (
                      <option key={usuario.id} value={usuario.id}>
                        {usuario.nombre} {usuario.apellido}
                      </option>
                    ))}
                  </select>
                  {errors.id_usuario_asignado && (
                    <span className="warning__general">{errors.id_usuario_asignado}</span>
                  )}
                </div>
              </div>

              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">Sucursal *</label>
                  <select
                    name="id_sucursal"
                    value={formData.id_sucursal}
                    onChange={handleInputChange}
                    className={`inputs__general ${errors.id_sucursal ? 'warning' : ''}`}
                  >
                    <option value="">Seleccionar sucursal</option>
                    {sucursales.map(sucursal => (
                      <option key={sucursal.id} value={sucursal.id}>
                        {sucursal.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.id_sucursal && (
                    <span className="warning__general">{errors.id_sucursal}</span>
                  )}
                </div>
              </div>

              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">Fecha Desde *</label>
                  <input
                    type="date"
                    name="desde"
                    value={formData.desde}
                    onChange={handleInputChange}
                    className={`inputs__general ${errors.desde ? 'warning' : ''}`}
                  />
                  {errors.desde && (
                    <span className="warning__general">{errors.desde}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="form__row form__row_three">
              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">Fecha Hasta *</label>
                  <input
                    type="date"
                    name="hasta"
                    value={formData.hasta}
                    onChange={handleInputChange}
                    className={`inputs__general ${errors.hasta ? 'warning' : ''}`}
                  />
                  {errors.hasta && (
                    <span className="warning__general">{errors.hasta}</span>
                  )}
                </div>
              </div>

              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">Firma</label>
                  <input
                    type="text"
                    name="firma"
                    value={formData.firma}
                    onChange={handleInputChange}
                    placeholder="Firma (base64 o ruta)"
                    className="inputs__general"
                  />
                </div>
              </div>

              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">Comentarios</label>
                  <textarea
                    name="comentarios"
                    value={formData.comentarios}
                    onChange={handleInputChange}
                    placeholder="Comentarios adicionales"
                    className="textarea__general"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* FILTROS DE BÚSQUEDA DE ACTIVOS */}
          <div className="assignments__section">
            <h3 className="section__title">Filtros de Búsqueda de Activos</h3>
            
            <div className="form__row form__row_three">
              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">Empresa</label>
                  <select
                    name="empresa"
                    onChange={handleInputChange}
                    className="inputs__general"
                  >
                    <option value="">Seleccionar empresa</option>
                    {empresas.map(empresa => (
                      <option key={empresa.id} value={empresa.id}>
                        {empresa.nombre_comercial}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">Sucursal</label>
                  <select
                    name="sucursal"
                    onChange={handleInputChange}
                    className="inputs__general"
                  >
                    <option value="">Seleccionar sucursal</option>
                    {sucursales.map(sucursal => (
                      <option key={sucursal.id} value={sucursal.id}>
                        {sucursal.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form__col">
                <div className="container__inputs_general">
                  <label className="label__general">Buscar Activos</label>
                  <button
                    type="button"
                    onClick={handleBuscarActivos}
                    className="btn__general-purple"
                    style={{ width: '100%', height: '40px' }}
                  >
                    BUSCAR ACTIVOS
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIVOS ENCONTRADOS */}
          {activosEncontrados.length > 0 && (
            <div className="assignments__section">
              <h3 className="section__title">Activos Encontrados</h3>
              <div className="activos-resultados">
                {activosEncontrados.map((activo) => (
                  <div key={activo.id} className="activo-item">
                    <div className="activo-info">
                      <strong>{activo.nombre}</strong>
                      <p>{activo.descripcion}</p>
                    </div>
                    <button
                      type="button"
                      className="btn-agregar-activo"
                      onClick={() => agregarActivo(activo)}
                    >
                      Agregar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTIVOS SELECCIONADOS */}
          {activosSeleccionados.length > 0 && (
            <div className="assignments__section">
              <h3 className="section__title">Activos Seleccionados</h3>
              <div className="activos-seleccionados">
                {activosSeleccionados.map((activo, index) => (
                  <div key={activo.id} className="activo-seleccionado">
                    <div className="activo-numero">{index + 1}</div>
                    <div className="activo-details">
                      <strong>{activo.nombre}</strong>
                      <p>{activo.descripcion}</p>
                    </div>
                    <button
                      type="button"
                      className="btn-eliminar-activo"
                      onClick={() => eliminarActivo(activo.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              {errors.activos && (
                <span className="warning__general">{errors.activos}</span>
              )}
            </div>
          )}

          {/* ACCIONES */}
          <div className="form__actions">
            <button
              type="button"
              className="btn__general-gray"
              onClick={handleClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn__general-purple"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17,21 17,13 7,13 7,21"/>
                <polyline points="7,3 7,8 15,8"/>
              </svg>
              {modoUpdate ? 'Actualizar' : 'Crear'} Asignación
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalAssignment