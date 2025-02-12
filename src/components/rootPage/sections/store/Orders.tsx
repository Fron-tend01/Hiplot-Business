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

    const setModal = storeModals(state => state.setModal)

    const [companies, setCompanies] = useState<any>()
    const [branchOffices, setBranchOffices] = useState<any>()


    const [warningName] = useState<boolean>(false)

    const [invoice, setInvoice] = useState<string>('')

    const hoy = new Date();
    const haceUnaSemana = new Date();
    haceUnaSemana.setDate(hoy.getDate() - 7);

    const [type, setTipo] = useState<any>(0)

    const id_usuario = user_id;
    const desde = haceUnaSemana.toISOString().split('T')[0];
    const hasta = hoy.toISOString().split('T')[0];

    const status = type;



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
        await getOrdedrs({ id_usuario, id_sucursal: branchOffices.id, desde, hasta, status, })

    }


    useEffect(() => {
        fecth()
    }, [])


    const handleDateChange = (fechasSeleccionadas: any) => {
        if (fechasSeleccionadas.length === 2) {
            setDates(fechasSeleccionadas.map((fecha: any) => fecha.toISOString().split('T')[0]));
        } else {
            setDates([fechasSeleccionadas[0]?.toISOString().split('T')[0] || "", ""]);
        }
    };



    const handleClick = (value: any) => {
        setTipo(value)
    };

    const [oderUpdate, setOderUpdate] = useState<any>([])
    const [orderConceptsUpdate, setorderConceptsUpdate] = useState<any>([])

    const modalUpdate = (order: any) => {

        setModal('modal-orders-update')

        setOderUpdate(order)
        setorderConceptsUpdate(order.conceptos)
    }

    const searchOrders = async () => {
        const data = {
            id_usuario: user_id,
            id_sucursal: branchOffices.id,
            desde: dates[0],
            hasta: dates[1],
            status: type
        }
        await getOrdedrs(data)
    }

    const modalCreate = () => {
        setModal('modal-create-pedido')
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
                            <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={dates} onChange={handleDateChange} placeholder='seleciona las fechas' />
                        </div>
                    </div>
                </div>
                <div className="row__two">
                    <Select dataSelects={series} instanceId="serieSelected" nameSelect={'Series'} />
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
                            <button className="btn__general-purple" onClick={() => modalCreate()}>Nuevo pedido</button>
                        </div>
                    </div>
                </div>
                <ModalCreate />
                <ModalUpdate oderUpdate={oderUpdate} orderConceptsUpdate={orderConceptsUpdate} />

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
