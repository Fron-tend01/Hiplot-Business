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
import Select from "../../Dynamic_Components/Select";

const Departures: React.FC = () => {

    const { getCompaniesXUsers, companiesXUsers }: any = storeCompanies();
    const { getBranchOfficeXCompanies, branchOfficeXCompanies }: any = storeBranchOffcies();
    const { series, getSeriesXUser }: any = storeSeries();
    const { getSuppliers }: any = storeSuppliers();
    const { getOrdedrs, orders }: any = storeOrdes();
    const userState = useUserStore(state => state.user);
    let user_id = userState.id


    const [selectedBranchOffice, setSelectedBranchOffice] = useState<number | null>(null);



    const [warningName] = useState<boolean>(false)

    const [invoice, setInvoice] = useState<string>('')

    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

    const [type, setTipo] = useState<any>(0)

    // let id = 0;
    let id_usuario = user_id;
    let id_sucursal = selectedBranchOffice;
    // let id_area = 0;
    let desde = selectedStartDate?.toISOString().split('T')[0];
    let hasta = selectedEndDate?.toISOString().split('T')[0];
    // let id_serie = selectedSerie;
    let status = type;
    // let folio = invoice;


    const [companies, setCompanies] = useState<any>()
    const [branchOffices, setBranchOffices] = useState<any>()


    useEffect(() => {
        getCompaniesXUsers(user_id)
        getBranchOfficeXCompanies(0, user_id)
        getSeriesXUser(user_id)
        getSuppliers('', true, user_id)
        getOrdedrs({ id_usuario, id_sucursal, desde, hasta, status, })
    }, [id_usuario, id_sucursal, desde, hasta, status])



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





    const [modalState, setModalState] = useState<boolean>(false)

    const modalCreate = () => {
        setModalState(true)
    }

    const modalCloseCreate = () => {
        setModalState(false)
    }

    const handleClick = (value: any) => {
        setTipo(value)
    };

    const [modalStateUpdate, setModalStateUpdate] = useState<boolean>(false)

    const [oderUpdate, setOderUpdate] = useState<any>([])
    const [orderConceptsUpdate, setorderConceptsUpdate] = useState<any>([])

    const modalUpdate = (order: any) => {
        setModalStateUpdate(true)
        setOderUpdate(order)
        setorderConceptsUpdate(order.conceptos)
    }

    const modalCloseUpdate = () => {
        setModalStateUpdate(false)
    }

    const searchOrders = async () => {
        let data = {
            id_usuario: user_id,
            id_sucursal: branchOffices.id,
            desde: dates[0],
            hasta: dates[1],
            status: type
        }
        await getOrdedrs(data)
    }


    return (
        <div className="orders">
            <div className="orders__container">
                <div className="row">
                    <div className="col-8">
                        <Empresas_Sucursales all={true} empresaDyn={companies} sucursalDyn={branchOffices} setEmpresaDyn={setCompanies} setSucursalDyn={setBranchOffices} modeUpdate={false} />
                    </div>
                    <div className='col-4'>
                        <label className='label__general'>Fechas</label>
                        <div className='container_dates__requisition'>
                            <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={dates} onChange={handleDateChange} placeholder='seleciona las fechas'  />
                        </div>
                    </div>
                </div>
                <div className="row__two">
                    <Select instanceId="series" nameSelect={'Series'} />
                    <div>
                        <label className='label__general'>Folio</label>
                        <div className='warning__general'><small >Este campo es obligatorio</small></div>
                        <input className={`inputs__general ${warningName ? 'warning' : ''}`} type="text" value={invoice} onChange={(e) => setInvoice(e.target.value)} placeholder='Ingresa el folio' />
                    </div>
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
                                <input className='checkbox' type="radio" name="requisitionStatus" checked={type == 2} value={type} onChange={() => handleClick(2)} />
                                <span className="checkmark__general"></span>
                            </label>
                            <p className='title__checkbox text'>Cancelados</p>
                        </div>
                        <div className='checkbox__orders'>
                            <label className="checkbox__container_general">
                                <input className='checkbox' type="radio" name="requisitionStatus" checked={type == 1} value={type} onChange={() => handleClick(1)} />
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
                            <button className="btn__general-purple" onClick={modalCreate}>Nueva entrada</button>
                        </div>
                    </div>
                </div>
                <div className={`overlay__orders ${modalState ? 'active' : ''}`}>
                    <div className={`popup__orders ${modalState ? 'active' : ''}`}>
                        <a href="#" className="btn-cerrar-popup__orders" onClick={modalCloseCreate}>
                            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                        </a>
                        <p className='title__modals'>Crear nuevo pedido</p>
                        <ModalCreate />
                    </div>
                </div>
                <div className={`overlay__orders ${modalStateUpdate ? 'active' : ''}`}>
                    <div className={`popup__orders ${modalStateUpdate ? 'active' : ''}`}>
                        <a href="#" className="btn-cerrar-popup__orders" onClick={modalCloseUpdate}>
                            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                        </a>
                        <p className='title__modals'>Actualizar pedido</p>
                        <ModalUpdate oderUpdate={oderUpdate} orderConceptsUpdate={orderConceptsUpdate} />
                    </div>
                </div>
                <div className='table__orders'>
                    {orders ? (
                        <div className='table__numbers'>
                            <p className='text'>Total de pedidos</p>
                            <div className='quantities_tables'>{orders.length}</div>
                        </div>
                    ) : (
                        <p className="text">No hay empresas que mostras</p>
                    )}
                    <div className='table__head'>
                        <div className='thead'> 
                            <div className='th'>
                                <p>Pedido</p>
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
                                            <div className='td order'>
                                                <div>
                                                    <p>{`${order.serie}-${order.folio}-${order.anio}`}</p>
                                                </div>
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
    )
}

export default Departures
