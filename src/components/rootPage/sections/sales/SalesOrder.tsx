import React, { useEffect, useRef, useState } from 'react'
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
import { storeArticles } from '../../../../zustand/Articles'
import LoadingInfo from '../../../loading/LoadingInfo'
import { storeDv } from '../../../../zustand/Dynamic_variables'
import APIs from '../../../../services/services/APIs'

const SalesOrder: React.FC = () => {
    const userState = useUserStore(state => state.user);
    const user_id = userState.id


    const setSaleOrdersConcepts = storeSaleOrder(state => state.setSaleOrdersConcepts)
    const { saleOrdersConcepts }: any = useStore(storeSaleOrder);


    const { getUsers }: any = usersRequests()
    const [users, setUsers] = useState<any>()

    const { getSaleOrders }: any = saleOrdersRequests()
    const { saleOrders }: any = storeSaleOrder()

    const { getSeriesXUser }: any = seriesRequests()
    const [series, setSeries] = useState<any>([])
    const setModalSalesOrder = storeSaleOrder(state => state.setModalSalesOrder)
    const setDataGet = storeSaleOrder(state => state.setDataGet)
    const setSaleOrders = storeSaleOrder(state => state.setSaleOrders)
    const setSaleOrdersToUpdate = storeSaleOrder(state => state.setSaleOrdersToUpdate)

    const setPermisosxVista = storeDv((state) => state.setPermisosxVista);



    const modalOpen = async () => {
        setModalSalesOrder('sale-order__modal')
        await APIs.GetAny('get_carrito/' + user_id).then((r: any) => {
            let orden = r[0]
            setSaleOrdersConcepts({ normal_concepts: orden.conceptos, personalized_concepts: orden.conceptos_pers, sale_order: orden });
        })



    }




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

 

    const fetch = async () => {

        APIs.GetAny('get_permisos_x_vista/' + user_id + '/ORDEN_VENTA').then((resp: any) => {
            setPermisosxVista(resp)
        })

        const data = {
            nombre: '',
            id_usuario: user_id,
            id_usuario_consulta: user_id,
            light: true,
            id_sucursal: 0
        }

        let resultUsers = await getUsers(data)
        resultUsers.unshift({ 'id': 0, 'nombre': 'Todos' })
        setUsers({
            selectName: 'Vendedores',
            options: 'nombre',
            dataSelect: resultUsers
        })

        let resultSeries = await getSeriesXUser({ tipo_ducumento: 7, id: user_id })
        resultSeries.unshift({ 'nombre': 'Todos' })
        setSeries({
            selectName: 'Series',
            options: 'nombre',
            dataSelect: resultSeries
        })

    }
    const { modalSalesOrder }: any = useStore(storeSaleOrder)
    const [page, setPage] = useState<number>(1)

    const effectRan = useRef(false);
    useEffect(() => {
        fetch();
    }, []);
    useEffect(() => {
        search();
    }, [page]);

    const search = async () => {
        setModalLoading(true)
        const dataSaleOrders = {
            folio: fol,
            id_sucursal: branchOffices.id,
            id_serie: selectedIds?.serie?.id,
            id_cliente: client,
            desde: dates[0],
            hasta: dates[1],
            id_usuario: user_id,
            id_vendedor: selectedIds?.users?.id,
            status: type,
            page: page,
            // light:true
        }
        const result = await getSaleOrders(dataSaleOrders)
        setModalLoading(false)
        setSaleOrders(result)

        setDataGet(dataSaleOrders)
    }

    const modalUpdate = (order: any) => {
        console.log(order)
        setModalSalesOrder('sale-order__modal-update')
        setSaleOrdersConcepts({ sale_order: order, normal_concepts: order.conceptos, personalized_concepts: order.conceptos_pers });
        setSaleOrdersToUpdate(order)

    }

    const [type, setType] = useState<any>(0)
    const handleClick = (value: any) => {
        setType(value)
    };

    const modalLoading = storeArticles((state: any) => state.modalLoading);
    const setModalLoading = storeArticles((state: any) => state.setModalLoading);

    // useEffect(() => {
    //     if (modalSalesOrder == '') {
    //         setSaleOrdersConcepts({normal_concepts: [], personalized_concepts: [] });

    //     }
    // }, [modalSalesOrder]);
    return (
        <div className='sales__order'>
            <div className='sales__order_container'>
                <div className='row__one'>
                    <div className='row'>
                        <div className='md-col-12 col-8'>
                            <Empresas_Sucursales modeUpdate={false} empresaDyn={companies} setEmpresaDyn={setCompanies} sucursalDyn={branchOffices} setSucursalDyn={setBranchOffices} all={true} />
                        </div>
                        <div className='md-col-12 col-4 row'>
                            <div className='col-6'>
                                <label className="label__general">Desde</label>
                                <div className="flex gap-4 container_dates__requisition">
                                    <Flatpickr
                                        className="date"
                                        id="fecha-desde"
                                        onChange={(date) => {
                                            const startDate = date[0]?.toISOString().split("T")[0] || "";
                                            setDates([startDate, dates[1]]); // Actualiza directamente el arreglo usando Zustand
                                        }}
                                        options={{
                                            dateFormat: "Y-m-d", // Formato de la fecha
                                            defaultDate: new Date(new Date().setDate(new Date().getDate() - 7)), // Fecha predeterminada: una semana atrás
                                            locale: Spanish, // Configuración del idioma en español
                                        }}
                                        placeholder="Selecciona una fecha"
                                    />
                                </div>
                            </div>

                            <div className='col-6'>
                                <label className="label__general">Hasta</label>
                                <div className="flex gap-4 container_dates__requisition">
                                    <Flatpickr
                                        className="date"
                                        id="fecha-hasta"
                                        onChange={(date) => {
                                            const endDate = date[0]?.toISOString().split("T")[0] || "";
                                            setDates([dates[0], endDate]);
                                        }}
                                        options={{
                                            dateFormat: "Y-m-d", // Formato de la fecha
                                            defaultDate: new Date(), // Fecha predeterminada: hoy
                                            locale: Spanish, // Configuración del idioma en español
                                        }}
                                        placeholder="Selecciona una fecha"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='my-4 row'>
                        <div className='md-col-6 col-3'>
                            <label className='label__general'>Clientes</label>
                            <input className='inputs__general' type="text" value={client} onChange={(e) => setClient(e.target.value)} placeholder='Ingresa el Folio/RFC/Razon social' />
                        </div>
                        <div className='md-col-6 col-3'>
                            <Select dataSelects={users} nameSelect={'Usuarios'} instanceId='users' />
                        </div>
                        <div className='md-col-6 col-3'>
                            <Select dataSelects={series} nameSelect={'Series'} instanceId='serie' />
                        </div>
                        <div className='md-col-6 col-3'>
                            <label className='label__general'>Folio</label>
                            <input className='inputs__general' type="text" value={fol} onChange={(e) => setFol(e.target.value)} placeholder='Ingresa el folio' onKeyUp={(e) => e.key === 'Enter' && search()} />
                        </div>
                    </div>
                    <div className='my-4 row__three d-flex justify-content-around'>
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
                            <button type='button' className='btn__general-purple' onClick={modalOpen}>Crear orden de venta</button>
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
                                    <div className='tbody__container-desk' key={order.id} onClick={() => modalUpdate(order)}>
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
                                                {order.status == 0 ? <p className='active-identifier'>Activa</p> : ''}
                                                {order.status == 1 ? <p className='cancel-identifier'>Cancelada</p> : ''}
                                                {order.status == 2 ? <p className='cancel-identifier'>Terminada</p> : ''}
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
                            {saleOrders.map((order: any) => {
                                return (
                                    <div className='tbody__container-response' key={order.id} onClick={() => modalUpdate(order)}>
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
                                                {order.status == 0 ? <p className='active-identifier'>Activa</p> : ''}
                                                {order.status == 1 ? <p className='cancel-identifier'>Cancelada</p> : ''}
                                                {order.status == 2 ? <p className='cancel-identifier'>Terminada</p> : ''}
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


                <div className='row'>
                    <div className='col-1'>
                        <button className='btn__general-primary' onClick={() => setPage(page - 1)} disabled={page == 1}>ANTERIOR</button>
                    </div>
                    <div className='col-10'>

                    </div>
                    <div className='col-1'>
                        <button className='btn__general-primary' onClick={() => setPage(page + 1)}>SIGUIENTE</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default SalesOrder
