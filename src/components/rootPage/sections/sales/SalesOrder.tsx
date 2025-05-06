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
        setModalLoading(true)
        await APIs.GetAny('get_carrito/' + user_id).then((r: any) => {
            let orden = r[0]
            if (r.length > 0) {
                setSaleOrdersToUpdate(orden)
                setSaleOrdersConcepts({ normal_concepts: orden.conceptos || [], personalized_concepts: orden.conceptos_pers || [], sale_order: orden });

            }
            setModalLoading(false)

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
            light: true
        }
        const result = await getSaleOrders(dataSaleOrders)
        setModalLoading(false)
        setSaleOrders(result)

        setDataGet(dataSaleOrders)
    }

    const modalUpdate = async (order: any) => {
        setModalLoading(true)
        const dataSaleOrders = {
            id: order.id
        }
        const result = await getSaleOrders(dataSaleOrders)
        setModalLoading(false)
        let order_search = result[0]
        setModalSalesOrder('sale-order__modal-update')
        setSaleOrdersConcepts({ sale_order: order_search, normal_concepts: order_search.conceptos, personalized_concepts: order_search.conceptos_pers });
        setSaleOrdersToUpdate(order_search)

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
                        <div className='md-col-12 col-6'>
                            
                            <Empresas_Sucursales  modeUpdate={false} empresaDyn={companies} setEmpresaDyn={setCompanies} sucursalDyn={branchOffices} setSucursalDyn={setBranchOffices} all={true} />
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
                        <div className='col-1'>
                            <label htmlFor="">Facturados</label>

                            <select name="" id="" className='inputs__general'>
                                <option value="0">Todos</option>
                                <option value="1">Facturados</option>
                                <option value="2">Sin Facturar</option>
                            </select>
                        </div>
                        <div className='col-1'>
                            <label htmlFor="">Prod.</label>
                            <select className='inputs__general'>
                                <option value="0">Todos</option>
                                <option value="1">Sin Enviar</option>
                                <option value="2">Enviados</option>
                            </select>
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
                <div className='ovtab__container'>
                    <div className='ovtab__thead'>
                        <div className='ovtab__th'>Folio</div>
                        <div className='ovtab__th'>Título</div>
                        <div className='ovtab__th'>Creada por</div>
                        <div className='ovtab__th'>Fecha</div>
                        <div className='ovtab__th'>Sucursal</div>
                        <div className='ovtab__th'>Total</div>
                        <div className='ovtab__th'>Total Franquicia</div>
                        <div className='ovtab__th'>Total Facturados</div>
                        <div className='ovtab__th'>Status</div>
                        <div className='ovtab__th'>Razón social</div>
                        <div className='ovtab__th'>Entreg. Cliente</div>
                        <div className='ovtab__th'>Recib. Suc.</div>
                        <div className='ovtab__th'>Ordenes de produc.</div>
                    </div>

                    {saleOrders.map(order => (
                        <div className='ovtab__tbody' key={order.id} onClick={() => modalUpdate(order)}>
                            <div className='ovtab__td'>{order.serie}-{order.folio}-{order.anio}</div>
                            <div className='ovtab__td'>{order.titulo}</div>
                            <div className='ovtab__td'>{order.usuario_crea}</div>
                            <div className='ovtab__td'>{order.fecha_creacion}</div>
                            <div className='ovtab__td'>{order.sucursal}</div>
                            <div className='ovtab__td'>$ {order.total_orden}</div>
                            <div className='ovtab__td'>$ N/A</div>
                            <div className='ovtab__td'>$ {order.total_facturado}</div>
                            <div className='ovtab__td'>
                                {order.status === 0 && <span className='active-identifier'>Activa</span>}
                                {order.status === 1 && <span className='cancel-identifier'>Cancelada</span>}
                                {order.status === 2 && <span className='finished-identifier'>Pendiente</span>}
                            </div>
                            <div className='ovtab__td'>{order.razon_social}</div>
                            <div className='ovtab__td'>{order.total_entregados_cliente} de {order?.conceptos?.length}</div>
                            <div className='ovtab__td'>{order.total_recibidos_sucursal} de {order?.conceptos?.length}</div>
                            <div className='ovtab__td'>
                                {order.ordenes_produccion.map(x => (
                                    <div key={x.folio_completo}>
                                        <small>{x.area_produccion}</small><br />
                                        <small>{x.folio_completo}</small>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
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
