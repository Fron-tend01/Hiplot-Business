import React, { useEffect, useState } from 'react'
import './styles/SalesOrder.css'
import { storeSaleOrder } from '../../../../zustand/SalesOrder'
import Modal from './sales_order/ModalSalesOrder'
import { saleOrdersRequests } from '../../../../fuctions/SaleOrders'
import { seriesRequests } from '../../../../fuctions/Series'
import Empresas_Sucursales from '../../Dynamic_Components/Empresas_Sucursales'
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import Flatpickr from "react-flatpickr";
import Select from '../../Dynamic_Components/Select'
import useUserStore from '../../../../zustand/General'
import { usersRequests } from '../../../../fuctions/Users'
import { useSelectStore } from '../../../../zustand/Select'
import { useStore } from 'zustand'
import { storePersonalized } from '../../../../zustand/Personalized'

const SalesOrder: React.FC = () => {
    const userState = useUserStore(state => state.user);
    const user_id = userState.id

    const setConceptView = storePersonalized(state => state.setConceptView)
    const setNormalConcepts = storePersonalized(state => state.setNormalConcepts)
    const setCustomConcepts = storePersonalized(state => state.setCustomConcepts)
    const setCustomConceptView = storePersonalized(state => state.setCustomConceptView)
    


    const { getUsers }: any = usersRequests()
    const [users, setUsers] = useState<any>()

    const { getSaleOrders }: any = saleOrdersRequests()
    const { saleOrders  }: any = storeSaleOrder()

    const { getSeriesXUser }: any = seriesRequests()
    const [series, setSeries] = useState<any>([])
    const setModalSalesOrder = storeSaleOrder(state => state.setModalSalesOrder)
    const setDataGet = storeSaleOrder(state => state.setDataGet)
    const setSaleOrders = storeSaleOrder(state => state.setSaleOrders)
    const setSaleOrdersToUpdate = storeSaleOrder(state => state.setSaleOrdersToUpdate)

    



    const [companies, setCompanies] = useState<any>([])

    const [branchOffices, setBranchOffices] = useState<any>([])
    const [fol, setFol] = useState<any>(0)

    const selectedIds: any = useSelectStore((state) => state.selectedIds);

    const [client, setClient] = useState<any>('')

    //////////////////////////
    //////// Fechas//////////
    ////////////////////////

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

    const fetch = async () => {

        const dataSaleOrders = {
            folio: fol,
            id_sucursal: branchOffices?.id,
            id_serie: selectedIds?.series?.id,
            id_cliente: client,
            desde:  haceUnaSemana.toISOString().split('T')[0],
            hasta:  hoy.toISOString().split('T')[0],
            id_usuario: user_id,
            id_vendedor: selectedIds?.users?.id,
            status: 0
        }

        setDataGet(dataSaleOrders)

        const result = await getSaleOrders(dataSaleOrders)
        setSaleOrders(result)

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

        const resultSeries = await getSeriesXUser({ tipo_ducumento: 7, id: user_id })

        setSeries({
            selectName: 'Series',
            options: 'nombre',
            dataSelect: resultSeries
        })
    }
    const { modalSalesOrder }: any = useStore(storeSaleOrder)

    useEffect(() => {
        fetch()
    }, [])
    useEffect(() => {
        // if (modalSalesOrder == '') {
        //     search()
        // }
    }, [modalSalesOrder])
    const search = async () => {
        const dataSaleOrders = {
            folio: fol,
            id_sucursal: branchOffices.id,
            id_serie: selectedIds?.series?.id,
            id_cliente: client,
            desde: dates[0],
            hasta: dates[1],
            id_usuario: user_id,
            id_vendedor: selectedIds?.users?.id,
            status: type
        }
        const result = await getSaleOrders(dataSaleOrders)
        console.log('ssd')
        setSaleOrders(result)
    }

    const modalUpdate = (order: any) => {
        setModalSalesOrder('sale-order__modal-update')
        setSaleOrdersToUpdate(order)
        // Obtiene el valor actual de identifier desde el store
        const currentIdentifier = storePersonalized.getState().identifier;
        let newIdentifier = currentIdentifier;

        // Actualiza los identificadores en conceptos
        order.conceptos.forEach((x: any) => {
            x.id_identifier = ++newIdentifier;
        });

        order.conceptos_pers.forEach((x: any) => {
            x.id_identifier = ++newIdentifier;
        });

        // Actualiza el identificador global en el store
        storePersonalized.setState({ identifier: newIdentifier });

        // Actualiza los estados locales con los datos procesados
        setConceptView([...order.conceptos, ...order.conceptos_pers]);
        setCustomConcepts(order.conceptos_pers);
        setNormalConcepts(order.conceptos);
        setCustomConceptView(order.conceptos);
    }

    const [type, setType] = useState<any>(0)
    const handleClick = (value: any) => {
        setType(value)
    };


    return (
        <div className='sales__order'>
            <div className='sales__order_container'>
                <div className='row__one'>
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
                    <div className='row my-4'>
                        <div className='col-3'>
                            <label className='label__general'>Clientes</label>
                            <input className='inputs__general' type="text" value={client} onChange={(e) => setClient(e.target.value)} placeholder='Ingresa el Folio/RFC/Razon social' />
                        </div>
                        <div className='col-3'>
                            <Select dataSelects={users} nameSelect={'Usuarios'} instanceId='users' />
                        </div>
                        <div className='col-3'>
                            <Select dataSelects={series} nameSelect={'Series'} instanceId='serie' />
                        </div>
                        <div className='col-3'>
                            <label className='label__general'>Folio</label>
                            <input className='inputs__general' type="text" value={fol} onChange={(e) => setFol(e.target.value)} placeholder='Ingresa el folio' />
                        </div>
                    </div>
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
                                <p className='title__checkbox text'>Pendiente</p>
                            </div>
                        </div>
                        <div className=''>
                            <button type='button' className='btn__general-purple' onClick={search}>Buscar</button>
                        </div>
                        <div>
                            <button type='button' className='btn__general-purple' onClick={() => setModalSalesOrder('sale-order__modal')}>Crear orden de venta</button>
                        </div>
                    </div>
                </div>
                <Modal />
                <div className='table__sale-orders'>
                    {saleOrders ? (
                        <div className='table__numbers'>
                            <p className='text'>Total de ordenes de compra</p>
                            <div className='quantities_tables'>{saleOrders.length}</div>
                        </div>
                    ) : (
                        <p className="text">No hay ordenes de compra que mostras</p>
                    )}
                    <div className='table__head'>
                        <div className='thead'>
                            <div className='th'>
                                <p>Folio</p>
                            </div>
                            <div className='th'>
                                <p>Título</p>
                            </div>
                            <div className='th'>
                                <p>Total</p>
                            </div>
                            <div className='th'>
                                <p>Total Franquicia</p>
                            </div>
                            <div className='th'>
                                <p>Total Facturados</p>
                            </div>
                            <div className='th'>
                                <p>Creada por</p>
                            </div>
                            <div className='th'>
                                <p>Fecha</p>
                            </div>
                            <div className='th'>
                                <p>Sucursal</p>
                            </div>
                            <div className='th'>
                                <p>Sucursal</p>
                            </div>
                            <div className='th'>
                                <p>Razon social</p>
                            </div>
                        </div>
                    </div>
                    {saleOrders ? (
                        <div className='table__body'>
                            {saleOrders.map((order: any) => {
                                return (
                                    <div className='tbody__container' key={order.id} onClick={() => modalUpdate(order)}>
                                        <div className='tbody'>
                                            <div className='td'>
                                                <p className='folio'>{order.serie}-{order.folio}-{order.anio}</p>
                                            </div>
                                            <div className='td'>
                                                <p>{order.titulo}</p>
                                            </div>
                                            <div className='td'>
                                                <p>$ {order.total_orden}</p>
                                            </div>
                                            <div className='td'>
                                                <p>$ N/A</p>
                                            </div>
                                            <div className='td'>
                                                <p>$ {order.total_facturado}</p>
                                            </div>
                                            <div className='td'>
                                                <p>{order.usuario_crea}</p>
                                            </div>
                                            <div className='td'>
                                                <p>{order.fecha_creacion}</p>
                                            </div>
                                            <div className='td'>
                                                <p>{order.status == 0 ? <div className='active-status'><p>Activa</p></div> : ''}</p>
                                                <p>{order.status == 1 ? <div className='canceled-status'><p>Cancelada</p></div> : ''}</p>
                                                <p>{order.status == 2 ? <div className='active-status'><p>Terminada</p></div> : ''}</p>
                                            </div>
                                            <div className='td'>
                                                <p>{order.razon_social}</p>
                                            </div>
                                            <div className='td'>
                                                <p>{order.razon_social}</p>
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
    )
}

export default SalesOrder
