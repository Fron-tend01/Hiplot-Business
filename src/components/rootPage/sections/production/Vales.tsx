import React, { useState, useEffect } from 'react';
import { storeCompanies } from '../../../../zustand/Companies';
import { storeBranchOffcies } from '../../../../zustand/BranchOffices';
import { storeAreas } from '../../../../zustand/Areas';
import useUserStore from '../../../../zustand/General';
import './styles/Vales.css'
import Empresas_Sucursales from '../../Dynamic_Components/Empresas_Sucursales';
import { useSelectStore } from '../../../../zustand/Select';
import { seriesRequests } from '../../../../fuctions/Series';
import Select from '../../Dynamic_Components/Select';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import Flatpickr from "react-flatpickr";
import { usersRequests } from '../../../../fuctions/Users';
import APIs from '../../../../services/services/APIs';
import Swal from 'sweetalert2';
interface BranchOffices {
  id: number;
  nombre: string;
  direccion: string;
  contacto: string;
  empresa_id: number;
  empresa: string;
  sucursal: string
  produccion: boolean
}

const Vales: React.FC = () => {
  // Modales
  const [modalState, setModalState] = useState<boolean>(false)
  const [modalStateUpdate, setModalStateUpdate] = useState<boolean>(false)

  // Estados de advertencia para validar campos
  // Warning states to validate fields
  const [warningName, setWarningName] = useState<boolean>(false)


  const { areasXBranchOfficesXUsers }: any = storeAreas();
  const userState = useUserStore(state => state.user);
  const user_id = userState.id

  const [companies, setCompanies] = useState<any>([])
  const [branchOffices, setBranchOffices] = useState<any>([])


  const [companiesC, setCompaniesC] = useState<any>([])
  const [branchOfficesC, setBranchOfficesC] = useState<any>([])

  const { getSeriesXUser }: any = seriesRequests()
  const [series, setSeries] = useState<any>([])
  const [seriesC, setSeriesC] = useState<any>([])
  const [fol, setFol] = useState<any>(0)
  const [folC, setFolC] = useState<any>(0)

  const selectedIds: any = useSelectStore((state) => state.selectedIds);
  const setSelectedIds = useSelectStore(state => state.setSelectedId)

  const [AreasC, setAreasC] = useState<any>([])
  const [modoUpdate, setModoUpdate] = useState<boolean>(false)

  const [total, setTotal] = useState<number>(0)
  const [noQuincenas, setNoQuincenas] = useState<number>(0)
  const [observaciones, setObservaciones] = useState<string>('')
  const [opSeleccionadas, setOpSeleccionadas] = useState<any>([])


  const hoy = new Date();
  const haceUnaSemana = new Date();
  haceUnaSemana.setDate(hoy.getDate() - 7);

  // Inicializa el estado con las fechas formateadas
  const [dates, setDates] = useState([
    haceUnaSemana.toISOString().split('T')[0],
    hoy.toISOString().split('T')[0]
  ]);

  const handleDateChange = (fechasSeleccionadas: any) => {
    if (fechasSeleccionadas.length === 2) {
      setDates(fechasSeleccionadas.map((fecha: any) => fecha.toISOString().split('T')[0]));
    } else {
      setDates([fechasSeleccionadas[0]?.toISOString().split('T')[0] || "", ""]);
    }
  };
  const [datesC, setDatesC] = useState([
    haceUnaSemana.toISOString().split('T')[0],
    hoy.toISOString().split('T')[0]
  ]);

  const handleDateChangeC = (fechasSeleccionadas: any) => {
    if (fechasSeleccionadas.length === 2) {
      setDatesC(fechasSeleccionadas.map((fecha: any) => fecha.toISOString().split('T')[0]));
    } else {
      setDatesC([fechasSeleccionadas[0]?.toISOString().split('T')[0] || "", ""]);
    }
  };
  const { getUsers }: any = usersRequests()
  const [users, setUsers] = useState<any>()
  const [dataUpdate, setDataUpdate] = useState<any>({})

  //Modales
  const modalCreate = (mu: boolean, data: any) => {
    setModalState(true)
    setModoUpdate(false)
    clearVariables()
    if (mu) {
      setModoUpdate(true)
      setDataUpdate(data)
      setTotal(data.total)
      setObservaciones(data.observaciones)
    }
  }

  const modalCloseCreate = () => {
    setModalState(false)
  }

  const fetch = async () => {

    const data = {
      nombre: '',
      id_usuario: user_id,
      id_usuario_consulta: user_id,
      light: true,
      id_sucursal: 0
    }

    const resultUsers = await getUsers(data)
    setUsers({
      selectName: 'Vendedores',
      options: 'nombre',
      dataSelect: resultUsers
    })

    const resultSeries = await getSeriesXUser({ tipo_ducumento: 11, id: user_id })
    resultSeries.unshift({ nombre: 'Todos', id: 0 });

    setSeries({
      selectName: 'Series',
      options: 'nombre',
      dataSelect: resultSeries
    })
    setSeriesC({
      selectName: 'Series',
      options: 'nombre',
      dataSelect: resultSeries
    })
    searchVale()
  }

  useEffect(() => {
    fetch()
  }, [])

  const [type, setType] = useState<any>(0)
  const handleClick = (value: any) => {
    setType(value)
  };
  const [typeC, setTypeC] = useState<any>(0)
  const handleClickC = (value: any) => {
    setTypeC(value)
  };
  const [productionC, setProductionC] = useState<any>([])

  useEffect(() => {
    APIs.GetAny(`get_area_x_sucursal/${branchOfficesC.id}/${user_id}`).then((resp: any) => {
      resp.unshift({ nombre: 'Todos', id: 0 });
      setAreasC({
        selectName: 'Areas',
        options: 'nombre',
        dataSelect: resp
      })
      setSelectedIds('areasC', resp[0])
    })
  }, [branchOfficesC])
  const searchOP = async () => {
    const dataProductionOrders = {
      folio: parseInt(folC) || 0,
      id_sucursal: branchOfficesC.id,
      id_serie: selectedIds?.seriesC?.id,
      id_area: selectedIds?.areasC?.id,
      // id_cliente: client,
      desde: datesC[0],
      hasta: datesC[1],
      id_usuario: user_id,
      status: typeC,
    }

    try {
      const result = await APIs.getProoductionOrders(dataProductionOrders)
      setProductionC(result)
    } catch (error) {
      console.log(error)
    }
  }
  const addOpSeleccionada = (orden: any) => {
    if (!opSeleccionadas.find((op: any) => op.id === orden.id)) {
      setOpSeleccionadas([...opSeleccionadas, orden]);
    }
  }
  const eliminarOp = (index: number) => {
    setOpSeleccionadas(opSeleccionadas.filter((_: any, i: number) => i !== index));

  }
  const crearVale = () => {
    if (selectedIds?.usersC?.id == undefined) {
      Swal.fire('Notificacion', 'Selecciona un usuario para continuar', 'warning')
      return
    }
    if (total < 1 || total == undefined || Number.isNaN(total)) {
      Swal.fire('Notificacion', 'El monto a ingresar no puede ser 0', 'warning')
      return
    }
    if (noQuincenas < 1 || noQuincenas == undefined || Number.isNaN(noQuincenas)) {
      Swal.fire('Notificacion', 'El numero de Quincenas a ingresar no puede ser 0', 'warning')
      return
    }
    Swal.fire({
      title: "Desea crear el vale?",
      text: "Verificar la informacion del Vale por favor",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`
    }).then(async (result) => {
      if (result.isConfirmed) {
        const ids = opSeleccionadas.map((op: any) => op.id);

        let data = {
          id_sucursal: branchOfficesC?.id,
          id_usuario_crea: user_id,
          id_usuario: selectedIds?.usersC?.id,
          total: total,
          observaciones: observaciones,
          ordenes_produccion: ids,
          no_quincenas: noQuincenas
        }
        await APIs.CreateAny(data, "create_vale")
          .then(async (response: any) => {
            if (response.error) {
              Swal.fire('Notificación', response.mensaje, 'info');
            } else {
              Swal.fire('Notificación', response.mensaje, 'success');
              setModalState(false)
              clearVariables()
              searchVale()
            }
          })
      }
    });
  }
  const clearVariables = () => {
    setTotal(0)
    setNoQuincenas(0)
    setObservaciones('')
    setOpSeleccionadas([])
  }
  const [dataVales, setDataVales] = useState<any[]>([])
  const searchVale = () => {
    let data = {
      id_serie: selectedIds?.serie?.id,
      id_sucursal: branchOffices?.id,
      id_usuario: user_id,
      id_usuario_vendedor: selectedIds?.users?.id,
      status: type,
      desde: dates[0],
      hasta: dates[1]
    }
    APIs.CreateAny(data, 'get_vales').then((resp: any) => {
      setDataVales(resp)
    })
  }
  const handleDateChangeCobro = (e: any, index: number) => {
    const newDate = e.target.value; // Obtén el nuevo valor del input
    setDataUpdate((prevData: any) => ({
      ...prevData,
      cobros: prevData.cobros.map((cobro: any, i: number) =>
        i === index ? { ...cobro, fecha_cobro: newDate } : cobro
      ),
    }));
  };
  const handleMontoChangeCobro = (e: any, index: number) => {
    const newVal = e.target.value; // Obtén el nuevo valor del input
    setDataUpdate((prevData: any) => ({
      ...prevData,
      cobros: prevData.cobros.map((cobro: any, i: number) =>
        i === index ? { ...cobro, monto: newVal } : cobro
      ),
    }));
  };
  const handleCheckChangeCobro = (e: any, index: number) => {
    const isChecked = e.target.checked; // Obtén el valor booleano del checkbox
    setDataUpdate((prevData: any) => ({
      ...prevData,
      cobros: prevData.cobros.map((cobro: any, i: number) =>
        i === index ? { ...cobro, cobrado: isChecked } : cobro
      ),
    }));
  };
  const actualizarVale = () => {

    if (total < 1 || total == undefined || Number.isNaN(total)) {
      Swal.fire('Notificacion', 'El monto a ingresar no puede ser 0', 'warning')
      return
    }
    Swal.fire({
      title: "Desea actualizar el vale?",
      text: "Verificar la informacion del Vale por favor",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`
    }).then(async (result) => {
      if (result.isConfirmed) {

        let data = {
          total: total,
          observaciones: observaciones,
          cobros: dataUpdate.cobros
        }
        await APIs.CreateAnyPut(data, "update_vale/" + dataUpdate.id)
          .then(async (response: any) => {
            if (response.error) {
              Swal.fire('Notificación', response.mensaje, 'info');
            } else {
              Swal.fire('Notificación', response.mensaje, 'success');
              setModalState(false)
              clearVariables()
              searchVale()
            }
          })
      }
    });
  }
  const get_pdf = () => {
    window.open(`http://hiplot.dyndns.org:84/api_dev/pdf_vale/${dataUpdate.id}`, '_blank');

  }
  const cancelarVale = () => {
    Swal.fire({
      title: "Desea Cancelar este vale?",
      text: "Esta acción no se puede deshacer.",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`
    }).then(async (result) => {
      if (result.isConfirmed) {
        await APIs.GetAny("cancelar_vale/" + dataUpdate.id)
          .then(async (response: any) => {
            if (response.error) {
              Swal.fire('Notificación', response.mensaje, 'info');
            } else {
              Swal.fire('Notificación', response.mensaje, 'success');
              setModalState(false)
              searchVale()
            }
          })
      }
    });
  }
  const FinalizarVale = () => {
    Swal.fire({
      title: "Desea Finalizar este vale?",
      text: "Esta acción de por echo los cobros",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`
    }).then(async (result) => {
      if (result.isConfirmed) {
        await APIs.GetAny("finalizar_vale/" + dataUpdate.id)
          .then(async (response: any) => {
            if (response.error) {
              Swal.fire('Notificación', response.mensaje, 'info');
            } else {
              Swal.fire('Notificación', response.mensaje, 'success');
              setModalState(false)
              searchVale()
            }
          })
      }
    });
  }
  return (
    <div className='vales'>
      <div className='breadcrumbs'>
        <div className='breadcrumbs__container'>
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-receipt"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 17.5v-11" /></svg>
          <small className='title'>Producción</small>
        </div>
        <div className='chevron__breadcrumbs'>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6" /></svg>
        </div>
        <div className='breadcrumbs__container'>
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></svg>
          <small className='title'>Vales</small>
        </div>
      </div>
      <div className='vales__container'>
        <div className='row'>
          <div className='col-8'>
            <Empresas_Sucursales update={false} empresaDyn={companies} setEmpresaDyn={setCompanies} sucursalDyn={branchOffices} setSucursalDyn={setBranchOffices} />
          </div>
          <div className='col-4'>
            <label className='label__general'>Fechas</label>
            <div className='container_dates__requisition'>
              <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={dates} onChange={handleDateChange} placeholder='seleciona las fechas' />
            </div>
          </div>
        </div>
        <div className='row '>
          <div className='col-2'>
            <Select dataSelects={users} nameSelect={'Usuarios'} instanceId='users' />
          </div>
          <div className='col-2'>
            <Select dataSelects={series} nameSelect={'Series'} instanceId='serie' />
          </div>
          <div className='col-2'>
            <label className='label__general'>Folio</label>
            <input className='inputs__general' type="text" value={fol} onChange={(e) => setFol(e.target.value)} placeholder='Ingresa el folio' />
          </div>
          <div className='col-6'>
            <div className='d-flex justify-content-around my-4'>

              <div className=''>
                <button type='button' className='btn__general-purple' onClick={searchVale}>Buscar</button>
              </div>
              <div>
                <button className='btn__general-purple' onClick={() => modalCreate(false, null)}>Crear Vale</button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className='d-flex justify-content-around my-4'>
            <div className='container__checkbox_orders'>
              <div className='checkbox__orders'>
                <label className="checkbox__container_general">
                  <input className='checkbox' type="radio" name="requisitionStatus" checked={type == 0} value={type} onChange={() => handleClick(0)} />
                  <span className="checkmark__general"></span>
                </label>
                <p className='title__checkbox text'>Activo</p>
              </div>
              <div className='checkbox__orders'>
                <label className="checkbox__container_general">
                  <input className='checkbox' type="radio" name="requisitionStatus" checked={type == 1} value={type} onChange={() => handleClick(1)} />
                  <span className="checkmark__general"></span>
                </label>
                <p className='title__checkbox text'>Cancelados</p>
              </div>
              <div className='checkbox__orders'>
                <label className="checkbox__container_general">
                  <input className='checkbox' type="radio" name="requisitionStatus" checked={type == 2} value={type} onChange={() => handleClick(2)} />
                  <span className="checkmark__general"></span>
                </label>
                <p className='title__checkbox text'>Terminado/Pagado</p>
              </div>
            </div>
          </div>
        </div>



        {/* -----------------------------------------------------MODAL UPDATE CREATE */}
        <div className={`overlay__vales ${modalState ? 'active' : ''}`}>
          <div className={`popup__vales ${modalState ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__vales" onClick={modalCloseCreate}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
            </a>
            {modoUpdate ?
              <p className='title__modals'>Actualizar Vale</p>
              :
              <p className='title__modals'>Crear Vale</p>
            }
            <br />
            <hr />
            <br />
            {!modoUpdate ?
              <>
                {/* --------------------------------------------------------CREATE-------------------------------------------------------------------- */}
                <div className='title-container'>
                  <div className='title'>
                    <p>INFORMACIÓN DEL GENERAL Y FILTRO DE OPS</p>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-3'>
                    <Select dataSelects={users} instanceId='usersC' nameSelect='Usuario para Vale' />
                  </div>
                  <div className='col-2'>
                    <div>
                      <label className='label__general'>Total</label>
                      <input className={`inputs__general`} type="number" value={total} onChange={(e) => setTotal(parseFloat(e.target.value))} placeholder='Ingresa el total del vale' />
                    </div>
                  </div>
                  <div className='col-2'>
                    <div>
                      <label className='label__general'>No. de Quincenas</label>
                      <input className={`inputs__general`} type="number" value={noQuincenas} onChange={(e) => setNoQuincenas(parseInt(e.target.value))} placeholder='Ingresa un numero de quincenas' />
                    </div>
                  </div>
                  <div className='col-5'>
                    <div>
                      <label className='label__general'>Observaciones</label>
                      <textarea className={`inputs__general`} rows={3} value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)} placeholder='Ingresa tus observaciones de Vale' > </textarea>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-6'>
                    <Empresas_Sucursales update={false} empresaDyn={companiesC} setEmpresaDyn={setCompaniesC}
                      sucursalDyn={branchOfficesC} setSucursalDyn={setBranchOfficesC} />
                  </div>
                  <div className='col-3'>
                    <Select dataSelects={AreasC} instanceId='areasC' nameSelect='Area' />

                  </div>
                  <div className='col-3'>
                    <label className='label__general'>Fechas</label>
                    <div className='container_dates__requisition'>
                      <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={datesC} onChange={handleDateChangeC} placeholder='seleciona las fechas' />
                    </div>
                  </div>
                </div>
                <div className='row'>

                  <div className='col-2'>
                    <Select dataSelects={seriesC} nameSelect={'Serie'} instanceId='serieC' />
                  </div>
                  <div className='col-2'>
                    <label className='label__general'>Folio</label>
                    <input className='inputs__general' type="text" value={folC} onChange={(e) => setFolC(e.target.value)} placeholder='Ingresa el folio' />
                  </div>
                  <div className='col-6'>
                    <div className='container__checkbox_orders'>
                      <div className='checkbox__orders'>
                        <label className="checkbox__container_general">
                          <input className='checkbox' type="radio" name="requisitionStatus" checked={typeC == 0} value={typeC} onChange={() => handleClickC(0)} />
                          <span className="checkmark__general"></span>
                        </label>
                        <p className='title__checkbox text'>Activo</p>
                      </div>
                      <div className='checkbox__orders'>
                        <label className="checkbox__container_general">
                          <input className='checkbox' type="radio" name="requisitionStatus" checked={typeC == 1} value={typeC} onChange={() => handleClickC(1)} />
                          <span className="checkmark__general"></span>
                        </label>
                        <p className='title__checkbox text'>Terminado</p>
                      </div>
                      <div className='checkbox__orders'>
                        <label className="checkbox__container_general">
                          <input className='checkbox' type="radio" name="requisitionStatus" checked={typeC == 2} value={typeC} onChange={() => handleClickC(2)} />
                          <span className="checkmark__general"></span>
                        </label>
                        <p className='title__checkbox text'>Enviado a Suc.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='d-flex justify-content-center'>
                  <div>
                    <button className='btn__general-purple' type='button' onClick={searchOP}>Buscar</button>
                  </div>
                </div>
                <br />
                <hr />
                <br />
                <div className='title-container'>
                  <div className='title'>
                    <p>ORDENES DE PRODUCCIÓN ENCONTRADAS</p>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-12'>
                    <div className='scrollable-content'>
                      <div className='table__orders_production'>
                        <div className='table__head'>
                          <div className='thead'>
                            <div className='th'>
                              <p>Status</p>
                            </div>
                            <div className='th'>
                              <p>Folio</p>
                            </div>
                            <div className='th'>
                              <p>Suc.Origen</p>
                            </div>
                            <div className='th'>
                              <p>Agente</p>
                            </div>
                            <div className="th">
                              <p>Fecha envio Prod</p>
                            </div>
                            <div className="th">
                              <p>Fecha de entrega</p>
                            </div>
                          </div>
                        </div>
                        {productionC ? (
                          <div className='table__body'>
                            {productionC.map((order: any) => {
                              return (
                                <div className='tbody__container' key={order.id} >
                                  <div className={`tbody`}>
                                    <div className='td' >
                                      <p>{order.status == 0 ? <b style={{ color: 'green' }}>ACTIVO</b> :
                                        order.status == 1 ? <b style={{ color: 'red' }}>CANCELADO</b> : <b style={{ color: 'blue' }}>TERMINADO</b>}</p>
                                    </div>
                                    <div className='td' >
                                      <p>{order.serie}-{order.folio}-{order.anio}</p>
                                    </div>
                                    <div className='td' >
                                      <p>{order.sucursal}</p>
                                    </div>
                                    <div className='td' >
                                      <p>{order.usuario_crea}</p>
                                    </div>
                                    <div className='td' >
                                      <p>{order.fecha_creacion}</p>
                                    </div>
                                    <div className='td' >
                                      <p>{order.fecha_entrega} {order.hora_entrega}</p>
                                    </div>
                                    <div className='td' >
                                      <button className='btn__general-success' onClick={() => addOpSeleccionada(order)}>Add+</button>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <p className="text">Cargando datos...</p>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
                <div className='title-container'>
                  <div className='title'>
                    <p>ORDENES DE PRODUCCIÓN AGREGADAS AL VALE</p>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-12'>
                    <div className='scrollable-content'>
                      <div className='table__orders_production'>
                        <div className='table__head'>
                          <div className='thead'>
                            <div className='th'>
                              <p>Status</p>
                            </div>
                            <div className='th'>
                              <p>Folio</p>
                            </div>
                            <div className='th'>
                              <p>Suc.Origen</p>
                            </div>
                            <div className='th'>
                              <p>Agente</p>
                            </div>
                            <div className="th">
                              <p>Fecha envio Prod</p>
                            </div>
                            <div className="th">
                              <p>Fecha de entrega</p>
                            </div>
                          </div>
                        </div>
                        {opSeleccionadas ? (
                          <div className='table__body'>
                            {opSeleccionadas.map((order: any, index: number) => {
                              return (
                                <div className='tbody__container' key={index} >
                                  <div className={'tbody'}>
                                    <div className='td' >
                                      <p>{order.status == 0 ? <b style={{ color: 'green' }}>ACTIVO</b> :
                                        order.status == 1 ? <b style={{ color: 'red' }}>CANCELADO</b> : <b style={{ color: 'blue' }}>TERMINADO</b>}</p>
                                    </div>
                                    <div className='td' >
                                      <p>{order.serie}-{order.folio}-{order.anio}</p>
                                    </div>
                                    <div className='td' >
                                      <p>{order.sucursal}</p>
                                    </div>
                                    <div className='td' >
                                      <p>{order.usuario_crea}</p>
                                    </div>
                                    <div className='td' >
                                      <p>{order.fecha_creacion}</p>
                                    </div>
                                    <div className='td' >
                                      <p>{order.fecha_entrega} {order.hora_entrega}</p>
                                    </div>
                                    <div className='td' >
                                      <button className='btn__general-danger' onClick={() => eliminarOp(index)}>Eliminar</button>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <p className="text">Cargando datos...</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* --------------------------------------------------------FIN CREATE INICIO UPDATE-------------------------------------------------------------------- */}
              </> :
              <>
                <div className="card ">
                  <div className="card-body bg-standar">
                    <h3 className="text">{dataUpdate.serie}-{dataUpdate.folio}-{dataUpdate.anio}</h3>
                    <hr />
                    <div className='row'>
                      <div className='col-6 md-col-12'>
                        <span className='text'>Creado por: <b>{dataUpdate.usuario_crea}</b></span><br />
                        <span className='text'>Para: <b>{dataUpdate.usuario}</b></span><br />
                        <span className='text'>Fecha creación: <b>{dataUpdate.fecha_creacion}</b></span><br />
                        <p>{dataUpdate.status == 0 ? <b style={{ color: 'green' }}>ACTIVO</b> :
                          dataUpdate.status == 1 ? <b style={{ color: 'red' }}>CANCELADO</b> :
                            dataUpdate.status == 2 ? <b style={{ color: 'blue' }}>TERMINADO</b> : <b style={{ color: 'orange' }}>TERMINADO/ENVIADO A SUC.</b>}</p>
                      </div>
                      <div className='col-6 md-col-12'>
                        <span className='text'>Empresa: <b>{dataUpdate.empresa}</b></span><br />
                        <span className='text'>Sucursal: <b>{dataUpdate.sucursal}</b></span><br />
                        <span className='text'>Ordenes de producción:
                          {dataUpdate?.ordenes_produccion.map((dat: any) => {
                            return (
                              <b>{dat.serie}-{dat.folio}-{dat.anio} ||</b>
                            )
                          })}
                        </span><br />
                      </div>
                    </div>

                    <div className='d-flex justify-content-between'>
                      <div className='d-flex align-items-end'>
                        <div className='mr-4'>
                          <button className='btn__general-orange' type='button' onClick={get_pdf}>Imprimir ticket</button>
                        </div>
                      </div>
                      <div className='d-flex align-items-start'>
                        <div className='mr-4'>
                          <button className='btn__general-purple' type='button' onClick={FinalizarVale}>Finalizar Vale</button>
                          <button className='btn__general-danger' type='button' onClick={cancelarVale}>Cancelar Vale</button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
                <div className='row'>
                  <div className='col-6'>
                    <div>
                      <label className='label__general'>Total</label>
                      <input className={`inputs__general`} type="number" value={total} onChange={(e) => setTotal(parseFloat(e.target.value))} placeholder='Ingresa el total del vale' />
                    </div>
                  </div>
                  <div className='col-6'>
                    <div>
                      <label className='label__general'>Observaciones</label>
                      <textarea className={`inputs__general`} rows={3} value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)} placeholder='Ingresa tus observaciones de Vale' > </textarea>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  {dataUpdate?.cobros.map((dat: any, i: number) => {
                    return (
                      <div className='col-3'>
                        <div className="card-cobros">
                          <div className="card-cobros-header">Cobro #{i + 1}</div>
                          <div className="card-cobros-body">
                            <div><strong>Fecha:</strong> <input type="date" value={dat.fecha_cobro} onChange={(e) => handleDateChangeCobro(e, i)} /></div>
                            <div><strong>Monto:</strong> <input type="number" value={dat.monto} onChange={(e) => handleMontoChangeCobro(e, i)} /></div>
                          </div>
                          <div className="card-cobros-footer">
                            <label className="checkbox-cobrado">
                              <input type="checkbox" checked={dat.cobrado} onChange={(e) => handleCheckChangeCobro(e, i)} /> Marcar como cobrado
                            </label>
                            <button className="btn-delete" >Eliminar</button>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                </div>
              </>
            }


            <div className="d-flex justify-content-center mt-4">
              <button className='btn__general-purple' onClick={modoUpdate ? actualizarVale : crearVale}>Guardar</button>
            </div>
          </div>
        </div>
        <div className='table__vales'>
          <div>
            {dataVales ? (
              <div>
                <p className='text'>Tus Vales {dataVales.length}</p>
              </div>
            ) : (
              <p></p>
            )}
          </div>
          <div className='table__head'>
            <div className='thead'>
              <div className='th'>
                <p >Status</p>
              </div>
              <div className='th'>
                <p>Folio</p>
              </div>
              <div className='th'>
                <p>Total</p>
              </div>
              <div className='th'>
                <p>Sucursal</p>
              </div>
              <div className='th'>
                <p>Para</p>
              </div>
              <div className='th'>
                <p>Creado por</p>
              </div>
              <div className='th'>
                <p>Creacion</p>
              </div>
            </div>
          </div>
          {dataVales ? (
            <div className='table__body'>
              {dataVales.map((dat: any, i: number) => {
                return (
                  <div className='tbody__container' key={i} onClick={() => modalCreate(true, dat)}>
                    <div className='tbody'>
                      <div className='td'>
                        <p>{dat.status == 0 ? <b style={{ color: 'green' }}>ACTIVO</b> :
                          dat.status == 1 ? <b style={{ color: 'red' }}>CANCELADO</b> : <b style={{ color: 'blue' }}>TERMINADO</b>}</p>
                      </div>
                      <div className='td'>
                        <p>{dat.serie}-{dat.folio}-{dat.anio}</p>
                      </div>
                      <div className='td'>
                        <p>{dat.total}</p>
                      </div>
                      <div className='td'>
                        <p>{dat.sucursal}</p>
                      </div>
                      <div className='td'>
                        <p>{dat.usuario}</p>
                      </div>
                      <div className='td'>
                        <p>{dat.usuario_crea}</p>
                      </div>
                      <div className='td'>
                        <p>{dat.fecha_creacion}</p>
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
      </div>
    </div>
  );
};

export default Vales;
