import React, { useState, useEffect } from "react"
import { storeCompanies } from "../../../../zustand/Companies";
import { storeBranchOffcies } from "../../../../zustand/BranchOffices";
import { storeSeries } from "../../../../zustand/Series";
import useUserStore from "../../../../zustand/General";
import { storeSuppliers } from "../../../../zustand/Suppliers";
import { storeOrdes } from "../../../../zustand/Ordes";
import ModalCreate from "./Ordes/ModalCreate";
import Flatpickr from "react-flatpickr";
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/l10n/es.js'
import './styles/Orders.css'
import ModalUpdate from "./Ordes/ModalUpdate";
import Empresas_Sucursales from "../../Dynamic_Components/Empresas_Sucursales";
import { storeModals } from "../../../../zustand/Modals";
import APIs from "../../../../services/services/APIs";
import Select from "../../Dynamic_Components/Select";
import { useSelectStore } from "../../../../zustand/Select";
import { storeArticles } from "../../../../zustand/Articles";
import { storeDv } from "../../../../zustand/Dynamic_variables";

const Departures: React.FC = () => {

    const { getCompaniesXUsers }: any = storeCompanies();
    const { getBranchOfficeXCompanies }: any = storeBranchOffcies();
    const { getSeriesXUser }: any = storeSeries();
    const { getSuppliers }: any = storeSuppliers();
    const { getOrdedrs, orders, dates }: any = storeOrdes();
    const userState = useUserStore(state => state.user);
    const user_id = userState.id

    const setDates = storeOrdes(state => state.setDates)
    const setLPAs = storeOrdes(state => state.setLPAs)
    const setOrderConceptsUpdate = storeOrdes(state => state.setOrderConceptsUpdate)

    const setModal = storeModals(state => state.setModal)

    const [companies, setCompanies] = useState<any>()
    const [branchOffices, setBranchOffices] = useState<any>()

    const selectedIds: any = useSelectStore((state) => state.selectedIds);


    const [warningName] = useState<boolean>(false)

    const [invoice, setInvoice] = useState<string>('')

    const hoy = new Date();
    const haceUnaSemana = new Date();
    haceUnaSemana.setDate(hoy.getDate() - 7);

    const [status, setTipo] = useState<any>([0])

    const id_usuario = user_id;
    const desde = haceUnaSemana.toISOString().split('T')[0];
    const hasta = hoy.toISOString().split('T')[0];


    const setModalLoading = storeArticles((state: any) => state.setModalLoading);



    const [series, setSeries] = useState<any>([])


    const fecth = async () => {
        APIs.CreateAny({ id_usuario: user_id, for_pedido: 1, light: true }, "getLPA")
            .then(async (response: any) => {
                setLPAs({
                    selectName: 'Lista Productos Aprobados',
                    dataSelect: response,
                    options: 'nombre'
                })
            })
        setDates([haceUnaSemana.toISOString().split('T')[0], hoy.toISOString().split('T')[0]])
        await getCompaniesXUsers(user_id)
        await getBranchOfficeXCompanies(0, user_id)
        const resultSeries = await getSeriesXUser({ id: user_id, tipo_ducumento: 3, })
        resultSeries.unshift({ nombre: 'Ninguna', id: 0 });
        setSeries({
            selectName: 'Series',
            options: 'nombre',
            dataSelect: resultSeries
        })
        getSuppliers('', true, user_id)
        await searchOrders()

    }


    useEffect(() => {
        fecth()
        fetchPermisos()
    }, [])


    const handleDateChange = (fechasSeleccionadas: any) => {
        if (fechasSeleccionadas.length === 2) {
            setDates(fechasSeleccionadas.map((fecha: any) => fecha.toISOString().split('T')[0]));
        } else {
            setDates([fechasSeleccionadas[0]?.toISOString().split('T')[0] || "", ""]);
        }
    };



    const handleClick = (value: number) => {
        setTipo((prev: any) =>
            prev.includes(value) ? prev.filter((x: any) => x !== value) : [...prev, value]
        );
    };

    const [orderUpdate, setOderUpdate] = useState<any>([])
    const modalUpdate = async (order: any) => {

        setModal('modal-orders-update')
        const data = {
            id: order.id
        }
        setModalLoading(true)
        let orders: any = await APIs.getOrdedrs(data);
        setModalLoading(false)

        setOderUpdate(orders[0])
        setOrderConceptsUpdate(orders[0].conceptos)
    }

    const searchOrders = async () => {
        const data = {
            id_usuario: user_id,
            id_sucursal: branchOffices?.id,
            desde: dates[0],
            hasta: dates[1],
            status: status,
            id_serie: selectedIds?.series?.id,
            folio: invoice ? invoice : 0,
            page: page,
            light: true
        }
        await getOrdedrs(data)
    }

    const modalCreate = () => {
        setModal('modal-create-pedido')
    }

    console.log(selectedIds)


    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        searchOrders()
    }, [page])
    const { modal }: any = storeModals();

    useEffect(() => {
        if (modal == '') {
            searchOrders()

        }
    }, [modal])

    //-----------------------------------------APLICANDO PERMISOS-----------------------------------------------------------
    const setPermisosxVista = storeDv((state) => state.setPermisosxVista);
    const permisosxVista = storeDv((state) => state.permisosxvista);

    const fetchPermisos = async () => {
        await APIs.GetAny('get_permisos_x_vista/' + user_id + '/PEDIDO').then((resp: any) => {
            // console.log('--------------------------------', resp);
            
            setPermisosxVista(resp)
        })
    }
    return (
        <div className="orders">
            <div className='breadcrumbs'>
                <div className='breadcrumbs__container'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-receipt"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 17.5v-11" /></svg>
                    <small className='title'>Almacén</small>
                </div>
                <div className='chevron__breadcrumbs'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6" /></svg>
                </div>
                <div className='breadcrumbs__container'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></svg>
                    <small className='title'>Pedidos</small>
                </div>
            </div>
            <div className="orders__container">
                <div className="row__one">
                    <div className="row">
                        <div className="col-8">
                            <Empresas_Sucursales all={true} empresaDyn={companies} sucursalDyn={branchOffices} setEmpresaDyn={setCompanies} setSucursalDyn={setBranchOffices} modeUpdate={false} />
                        </div>
                        <div className='col-4'>
                            <label className='label__general'>Fechas</label>
                            <div className='container_dates__requisition'>
                                <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={dates} onChange={handleDateChange} placeholder='seleciona las fechas' />
                            </div>
                        </div>
                    </div>
                    <div className="row__two">
                        <Select dataSelects={series} instanceId="series" nameSelect={'Series'} />
                        <div>
                            <label className='label__general'>Folio</label>
                            <div className='warning__general'><small >Este campo es obligatorio</small></div>
                            <input className={`inputs__general ${warningName ? 'warning' : ''}`} type="number" value={invoice} onChange={(e) => setInvoice(e.target.value)} placeholder='Ingresa el folio' />
                        </div>
                        <div className='container__checkbox_orders'>
                            <div className='checkbox__orders'>
                                <label className="checkbox__container_general">
                                    <input className='checkbox' type="checkbox" name="requisitionStatus" checked={status.includes(0)} onChange={() => handleClick(0)} />
                                    <span className="checkmark__general"></span>
                                </label>
                                <p className='title__checkbox text'>Activo</p>
                            </div>
                            <div className='checkbox__orders'>
                                <label className="checkbox__container_general">
                                    <input className='checkbox' type="checkbox" name="requisitionStatus" checked={status.includes(1)} onChange={() => handleClick(1)} />
                                    <span className="checkmark__general"></span>
                                </label>
                                <p className='title__checkbox text'>Cancelados</p>
                            </div>
                            <div className='checkbox__orders'>
                                <label className="checkbox__container_general">
                                    <input className='checkbox' type="checkbox" name="requisitionStatus" checked={status.includes(2)} onChange={() => handleClick(2)} />
                                    <span className="checkmark__general"></span>
                                </label>
                                <p className='title__checkbox text'>Terminados</p>
                            </div>
                        </div>
                    </div>
                    <div className="row__three">
                        <div>
                            <button className="btn__general-purple" onClick={searchOrders}>Buscar</button>
                        </div>
                        <div className="btns__departures">
                            <div>
                                <button className="btn__general-purple">Excel</button>
                            </div>
                            <div>
                                <button className="btn__general-purple" onClick={() => modalCreate()}>Nuevo pedido</button>
                            </div>
                        </div>
                    </div>
                </div>
                <ModalCreate />
                <ModalUpdate oderUpdate={orderUpdate} />

                <div className='table__orders'>
                    {orders ? (
                        <div className='table__numbers'>
                            <p className='text'>Total de pedidos</p>
                            <div className='quantities_tables'>{orders.length}</div>
                        </div>
                    ) : (
                        <p className="text">No hay empresas que mostras</p>
                    )}
                    <div className="table">
                        <div className='table__head'>
                            <div className='thead'>
                                <div className='th'>
                                    <p>Pedido</p>
                                </div>
                                <div className='th'>
                                    <p>Status</p>
                                </div>
                                <div className='th'>
                                    <p>Empresa</p>
                                </div>
                                <div className='th'>
                                    <p>Sucursal</p>
                                </div>
                                <div className='th'>
                                    <p>Fecha y hora</p>
                                </div>
                                <div className="th">

                                </div>
                            </div>
                        </div>
                        {orders && orders ? (
                            <div className='table__body'>
                                {orders.map((order: any) => {
                                    return (
                                        <div className='tbody__container' key={order.id}>
                                            <div className='tbody'>
                                                <div className='td'>
                                                    <p className="folio-identifier">{`${order.serie}-${order.folio}-${order.anio}`}</p>
                                                </div>
                                                <div className='td'>
                                                    <p>{order.status == 0 ? <div className='active-status'><p>Activa</p></div> : ''}</p>
                                                    <p>{order.status == 1 ? <div className='canceled-status'><p>Cancelada</p></div> : ''}</p>
                                                    <p>{order.status == 2 ? <div className='active-status'><p>Terminada</p></div> : ''}</p>
                                                </div>
                                                <div className='td'>
                                                    <p>{order.empresa}</p>
                                                </div>
                                                <div className='td'>
                                                    <p>{order.sucursal}</p>
                                                </div>
                                                <div className='td'>
                                                    <p>{order.fecha_creacion}</p>
                                                </div>

                                                <div className='td'>
                                                    <button className='branchoffice__edit_btn' onClick={() => modalUpdate(order)}>Editar</button>
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
            <div className='mt-4 d-flex justify-content-between'>
                <div>
                    <button className='btn__general-purple' onClick={() => { setPage(page - 1) }}
                        disabled={page == 1}>Anterior</button>
                </div>
                <div>
                    <button className='btn__general-purple' onClick={() => { setPage(page + 1) }}>Siguente</button>
                </div>
            </div>
        </div>
    )
}

export default Departures
