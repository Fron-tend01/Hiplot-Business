import React, { useEffect, useState } from 'react'
import useUserStore from '../../../../../../zustand/General'
import { companiesRequests } from '../../../../../../fuctions/Companies'
import Flatpickr from "react-flatpickr";
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import { ordersRequests } from '../../../../../../fuctions/Orders'
import { storeWarehouseExit } from '../../../../../../zustand/WarehouseExit'
import { useStore } from 'zustand'
import './styles/ByOrder.css'
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/l10n/es.js'
import Empresas_Sucursales from '../../../../Dynamic_Components/Empresas_Sucursales'


const ByOrder: React.FC = () => {
  const userState = useUserStore(state => state.user);
  const user_id = userState.id

  const { concepts, setConcepts } = useStore(storeWarehouseExit);

  

  const { getCompaniesXUsers }: any = companiesRequests()



  const { getOrdedrs }: any = ordersRequests()
  const [orders, setOrders] = useState<any>()


  const [companies, setCompanies] = useState<any>()
  const [branchOffices, setBranchOffices] = useState<any>()

  const fecht = async () => {
    const companies = await getCompaniesXUsers(user_id)
    setCompanies(companies)
  }

  useEffect(() => {
    fecht()
  }, [])


  ////////////////////////
  /// Fechas
  ////////////////////////

  const [dates, setDates] = useState<any>()

  const handleDateChange = (fechasSeleccionadas: any) => {
    if (fechasSeleccionadas.length === 2) {
      setDates(fechasSeleccionadas.map((fecha: any) => fecha.toISOString().split('T')[0]));
    } else {
      setDates([fechasSeleccionadas[0]?.toISOString().split('T')[0] || "", ""]);
    }
  };




  const filterSeveral = async () => {
    const data = {
      id_usuario: user_id,
      id_sucursal: branchOffices.id,
      desde: dates[0],
      hasta: dates[1],
      status: [0],
      for_salida:true
    }
    const result = await getOrdedrs(data)
    setOrders(result)
  }

  ///////////////////////////////// Result ////////////////////////////////////


  const [modalUpdatePermissions, setModalUpdatePermissions] = useState<any>(false);

  const seeConcepts = (order: number) => {
    setModalUpdatePermissions((prevState: any) => ({
      ...prevState,
      [order]: !prevState[order]
    }));
  };

  const closeModalUpdatePermissions = () => {
    setModalUpdatePermissions(false)
  };


  const addOrders = async (order: any) => {

    order.conceptos.forEach((element: any) => {
      element.unidad = element.id_unidad
      element.ped = order.serie + '-'+order.folio + '-'+ order.anio
      element.pedido_almacen_concepto_id = element.id
    });

    setConcepts([...concepts, ...order.conceptos]);

    // const result = await getArticles(data)
    // if (result) {

    //   let warning;

    //   if (selectedIds != null) {
    //     if (result) {
    //       const filter = result[0].stock?.filter((x: any) => x.id == selectedIds.store.id);
    //       if (filter.length <= 0) {
    //         toast.warning('El articulo que agregaste no tiene alamcen')
    //         warning = true
    //         console.log('No esta')
    //       } else {
    //         warning = false
    //         console.log('Si esta')
    //       }


    //       await setConcepts([...concepts, {
    //         id_articulo: result[0].id,
    //         nameArticle: `${result[0].codigo}-${result[0].descripcion}`,
    //         ped: `${order.serie}-${order.folio}-${order.anio}`,
    //         cantidad: concept.cantidad,
    //         comentarios: concept.comentarios,
    //         unidad: concept.id_unidad,
    //         unidades: result[0].unidades,
    //         stock: result[0].stock,
    //         almacen_predeterminado: result[0].almacen_predeterminado,
    //         pedido_almacen_concepto_id: concept.id,
    //         storeWarning: warning
    //       }]);
    //     }
    //   } else {
    //     toast.warning('Seleciona un almacen para agregar')
    //   }
    // }
  }




  return (
    <div className='by-order__warehouse-exit'>

      <div className='row'>
        <div className="col-8">
          <Empresas_Sucursales empresaDyn={companies} sucursalDyn={branchOffices} setEmpresaDyn={setCompanies} setSucursalDyn={setBranchOffices} modeUpdate={false} />
        </div>
        <div className='col-3'>
          <label className='label__general'>Fechas</label>
          <div className='container_dates__requisition'>
            <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={dates} onChange={handleDateChange} placeholder='seleciona las fechas' />
          </div>
        </div>
        <div className='col-1 d-flex align-items-end'>
          <button className='btn__general-purple' type='button' onClick={filterSeveral}>Filtran</button>
        </div>
      </div>
      <div className='row__three'>
        <div className='table__modal_filter_orders'>
          <div>
            <div>
              <div className='table__numbers'>
                <p className='text'>Total de pedidos</p>
                <div className='quantities_tables'>{concepts.length}
                </div>
              </div>
            </div>
            {orders && orders.length > 0 ? (
              <div className='table__body'>
                {orders && orders.map((order: any, index: any) => (
                  <div className='tbody__container' key={index}>
                    <div className="table-body">
                      <div className="table-row">
                        <div className="table-cell">
                          {order.serie}-{order.folio}-{order.anio}
                        </div>
                        <div className="table-cell">
                          {order.empresa} {' > '} {order.sucursal} {' > '} {order.area}
                        </div>
                        <div className="table-cell">
                          {order.fecha_creacion}
                        </div>
                        <div className="table-cell">
                          <button className='btn__general-purple' onClick={() => addOrders(order)}>Agregar</button>
                        </div>
                        <div className="table-cell table-cell-end">
                          <button onClick={() => seeConcepts(order.id)} type="button" className="btn__general-purple">
                            Ver conceptos
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className={`overlay__modal-filter_concepts_departures ${modalUpdatePermissions[order.id] ? 'active' : ''}`}>
                      <div className={`popup__modal-filter_concepts_departures ${modalUpdatePermissions[order.id] ? 'active' : ''}`}>
                        <a href="#" className="btn-cerrar-popup__modal-filter_concepts_departures" onClick={closeModalUpdatePermissions}>
                          <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                        </a>
                        <div className='container__modal-filter_concepts_departures'>
                          <div className='table__modal_filter-stocks_tickets'>
                            <div>
                              <div>
                                {order.conceptos ? (
                                  <div className='table__numbers'>
                                    <p className='text'>Conceptos en el pedido</p>
                                    <div className='quantities_tables'>{order.conceptos && order.conceptos.length}</div>
                                  </div>
                                ) : (
                                  <p className='text'>No hay conceptos</p>
                                )}
                              </div>
                              <div className='table__head'>
                                <div className='thead'>
                                  <div className='th'>
                                    <p className=''>Codigo</p>
                                  </div>
                                  <div className='th'>
                                    <p className=''>Unidad</p>
                                  </div>
                                  <div className='th'>
                                    <p className=''>Cantidad</p>
                                  </div>
                                  <div className='th'>
                                    <p className=''>Comentarios</p>
                                  </div>
                                  <div className='th'>

                                  </div>
                                </div>
                              </div>
                              {order.conceptos && order.conceptos.length > 0 ? (
                                <div className='table__body'>
                                  {order.conceptos && order.conceptos.map((concept: any, index: any) => (
                                    <div className='tbody__container' key={index}>
                                      <div className='tbody'>
                                        <div className='td'>
                                          {concept.codigo}-{concept.descripcion}
                                        </div>
                                        <div className='td'>
                                          {concept.unidad}
                                        </div>
                                        <div className='td'>
                                          {concept.cantidad}
                                        </div>
                                        <div className='td'>
                                          {concept.comentarios}
                                        </div>
                                        <div className='td'>
                                          {/* <button className='btn__general-purple' type='button' onClick={() => addOrders(concept, order)}>Agregar</button> */}
                                        </div>
                                      </div>

                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className='text'>No hay conceptos</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text'>No hay pedidos filtrados</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ByOrder
