import React, { useEffect, useState } from 'react'
import { storeTickets } from '../../../../../zustand/Tickets'
import { useStore } from 'zustand'
import APIs from '../../../../../services/services/APIs'
import './Ticket.css'
import Swal from 'sweetalert2'
import ModalTicket from './modal-ticket/ModalTicket'
import useUserStore from '../../../../../zustand/General'

const Ticket = () => {
  const {
    setModal,
    setDataUpd,
    setModoUpdate
  } = useStore(storeTickets)
  const userState = useUserStore(state => state.user);

  const [tickets, setTickets] = useState<any[]>([])
  const [empresas, setEmpresas] = useState<any[]>([])
  const [filtros, setFiltros] = useState({
    empresa: '',
    desde: '',
    hasta: ''
  })

  const fetchEmpresas = async () => {
    console.log('Ejecutando fetchEmpresas...')
    try {
      const response: any = await APIs.getCompaniesXUsers(userState.id) // Usuario actual
      console.log('Respuesta de fetchEmpresas:', response)
      setEmpresas(response)
    } catch (error) {
      console.error('Error fetching empresas:', error)
      setEmpresas([])
    }
  }

  const fetchTickets = async () => {
    // Calcular fechas por defecto: una semana atrás hasta hoy
    const hoy = new Date()
    const unaSemanaAtras = new Date()
    unaSemanaAtras.setDate(hoy.getDate() - 7)
    
    const fechaDesde = filtros.desde || unaSemanaAtras.toISOString().split('T')[0]
    const fechaHasta = filtros.hasta || hoy.toISOString().split('T')[0]
    
    let data = {
      id: 0,
      empresa: filtros.empresa || 0,
      desde: fechaDesde,
      hasta: fechaHasta,
      asunto: "",
      descripcion: "",
      estado: "",
      prioridad: "",
      creadoPor: "",
      asignadoA: ""
    }
    
    console.log('Enviando datos a get_activos_entradas:', data)
    
    try {
      const response: any = await APIs.CreateAny(JSON.stringify(data), 'get_activos_entradas')
      console.log('Respuesta de get_activos_entradas:', response)
      setTickets(response.data || [])
    } catch (error) {
      console.error('Error fetching tickets:', error)
      setTickets([])
    }
  }

  const handleFiltroChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target
    setFiltros(prev => ({ ...prev, [name]: value }))
  }

  const handleBuscar = () => {
    fetchTickets()
  }

  useEffect(() => {
    console.log('Componente montado, cargando empresas...')
    fetchEmpresas()
  }, [])

  // Efecto para ejecutar fetchTickets cuando se cargan las empresas
  useEffect(() => {
    console.log('Empresas cargadas:', empresas)
    if (empresas.length > 0) {
      // Calcular fechas por defecto
      const hoy = new Date()
      const unaSemanaAtras = new Date()
      unaSemanaAtras.setDate(hoy.getDate() - 7)
      
      const nuevosFiltros = {
        empresa: empresas[0].id.toString(),
        desde: unaSemanaAtras.toISOString().split('T')[0],
        hasta: hoy.toISOString().split('T')[0]
      }
      
      console.log('Estableciendo filtros por defecto:', nuevosFiltros)
      setFiltros(nuevosFiltros)
      
      // Ejecutar fetchTickets inmediatamente
      console.log('Ejecutando fetchTickets inmediatamente...')
      fetchTickets()
    }
  }, [empresas])

  // Efecto para ejecutar búsqueda cuando cambian los filtros manualmente
  useEffect(() => {
    if (filtros.empresa && filtros.desde && filtros.hasta && empresas.length > 0) {
      console.log('Filtros cambiados manualmente, ejecutando fetchTickets:', filtros)
      fetchTickets()
    }
  }, [filtros.empresa, filtros.desde, filtros.hasta])

  const handleCreate = () => {
    setModoUpdate(false)
    setDataUpd(null)
    setModal('tickets_modal')
  }

  const handleEdit = (ticket: any) => {
    setModoUpdate(true)
    setDataUpd(ticket)
    setModal('tickets_modal')
  }



  return (
    <div className='tickets'>
      <div className='tickets__container'>


        {/* Filtros */}
        <div className='tickets__filters'>
          <div className='filter__item'>
            <label>EMPRESA</label>
            <select
              name="empresa"
              value={filtros.empresa}
              onChange={handleFiltroChange}
              className='filter__select'
            >
              <option value="">Seleccionar empresa</option>
              {empresas.map(empresa => (
                <option key={empresa.id} value={empresa.id}>
                  {empresa.nombre_comercial}
                </option>
              ))}
            </select>
          </div>

          <div className='filter__item'>
            <label>DESDE</label>
            <input
              type="date"
              name="desde"
              value={filtros.desde}
              onChange={handleFiltroChange}
              className='filter__input'
            />
          </div>

          <div className='filter__item'>
            <label>HASTA</label>
            <input
              type="date"
              name="hasta"
              value={filtros.hasta}
              onChange={handleFiltroChange}
              className='filter__input'
            />
          </div>

          <div className='filter__actions'>
            <button className='btn__general-purple' onClick={handleBuscar}>
              Buscar
            </button>
            <button className='btn__general-blue' onClick={handleCreate}>
              Nueva entrada
            </button>
          </div>
        </div>

        <div className='tickets__table'>
          <div>
            {tickets ? (
              <div className='table__numbers'>
                <p className='text'>Total de entradas</p>
                <div className='quantities_tables'>{tickets.length}</div>
              </div>
            ) : (
              <p></p>
            )}
          </div>
          <div className='table__head'>
            <div className='thead'>
              <div className='th'>
                <p>FOLIO</p>
              </div>
              <div className='th'>
                <p>CREADO POR</p>
              </div>
              <div className='th'>
                <p>FECHA CREACIÓN</p>
              </div>
              <div className='th'>
                <p>VER</p>
              </div>
            </div>
          </div>
          {tickets ? (
            <div className='table__body'>
              {tickets.map((ticket: any) => {
                // Generar folio en formato EACT-XXX-YYYY
                const folio = `EACT-${ticket.id_folio || ticket.id}-${new Date(ticket.fecha_creacion).getFullYear()}`

                return (
                  <div className='tbody__container' key={ticket.id}>
                    <div className='tbody'>
                      <div className='td'>
                        <p>{folio}</p>
                      </div>
                      <div className='td'>
                        <p>{ticket.creado_por || ticket.id_usuario || 'N/A'}</p>
                      </div>
                      <div className='td'>
                        <p>{ticket.fecha_creacion ? new Date(ticket.fecha_creacion).toLocaleDateString('es-ES') : 'N/A'}</p>
                      </div>
                      <div className='td'>
                        <div className='actions__container'>
                          <button
                            className='btn__view'
                            onClick={() => handleEdit(ticket)}
                            title="Ver"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            VER
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p>Cargando datos...</p>
          )}
        </div>
        <ModalTicket onRefresh={fetchTickets} />
      </div>
    </div>
  )
}

export default Ticket