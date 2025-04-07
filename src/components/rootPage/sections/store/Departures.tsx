import { useState, useEffect } from "react"
import { storeSeries } from "../../../../zustand/Series";
import useUserStore from "../../../../zustand/General";
import { WarehouseExitRequests } from "../../../../fuctions/WarehouseExit";
import ModalCreate from "./Departures/ModalCreate";
import Flatpickr from "react-flatpickr";
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/l10n/es.js'
import './styles/Departures.css'
import { Toaster } from 'sonner'
import Empresas_Sucursales from "../../Dynamic_Components/Empresas_Sucursales";
import Select from "../../Dynamic_Components/Select";
import { StoreRequests } from '../../../../fuctions/Store'
import { storeWarehouseExit } from "../../../../zustand/WarehouseExit";
import { useStore } from "zustand";
import ModalUpdate from "./Departures/ModalUpdate";
import { storeArticles } from "../../../../zustand/Articles";

const Departures = () => {
    const userState = useUserStore(state => state.user);
    const user_id = userState.id


    const setModal = storeWarehouseExit(state => state.setModal)
    const setSelectedBranchOffice = storeWarehouseExit(state => state.setSelectedBranchOffice)
    const setWarehouseExit = storeWarehouseExit(state => state.setWarehouseExit)
    const { modal, warehouseExit }: any = useStore(storeWarehouseExit)


    const { getWarehouseExit }: any = WarehouseExitRequests()


    const { getSeriesXUser }: any = storeSeries();
    const { getStore }: any = StoreRequests()

    const [warningName] = useState<boolean>(false)
    const [invoice, setInvoice] = useState<any>(null)

    const setDates = storeWarehouseExit(state => state.setDates)
    const { dates }: any = useStore(storeWarehouseExit)


    const [series, setSeries] = useState<any>(null)
    const [store, setStore] = useState<any>(null)

    const [companies, setCompanies] = useState<any>()
    const [branchOffices, setBranchOffices] = useState<any>()

    useEffect(() => {
        // Calcula las fechas iniciales
        const today = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 30);

        // Formatea las fechas como cadenas en formato "YYYY-MM-DD"
        const formattedOneWeekAgo = oneWeekAgo.toISOString().split("T")[0];
        const formattedToday = today.toISOString().split("T")[0];

        // Configura las fechas iniciales con setDates
        setDates([formattedOneWeekAgo, formattedToday]);
    }, [setDates]);

    const fecht = async () => {

        const resultSeries = await getSeriesXUser({ tipo_ducumento: 4, id: user_id })
        resultSeries.unshift({ 'id': 0, 'nombre': 'Todos' })
        setSeries({
            selectName: 'Series',
            options: 'nombre',
            dataSelect: resultSeries
        })
        const store = await getStore(user_id)
        setStore({
            selectName: 'Almacen',
            options: 'nombre',
            dataSelect: store
        })
        const data = {
            id_almacen: null,
            id_usuario: user_id,
            id_sucursal: branchOffices?.id,
            desde: dates[0],
            hasta: dates[1],
            id_serie: 0,
            folio: invoice,
            light: true,
            page: page
        }
        setModalLoading(true)

        const result = await getWarehouseExit(data)
        setModalLoading(false)

        setWarehouseExit(result)
    }

    useEffect(() => {
        fecht()
    }, [])

    useEffect(() => {
        if (branchOffices) {
            setSelectedBranchOffice(branchOffices.id)
        }
    }, [branchOffices])




    const modalCreate = () => {
        setModal('modal-create__departures')
    }




    const searchWarehouseExit = async () => {
        const data = {
            id_almacen: null,
            id_usuario: user_id,
            id_sucursal: branchOffices?.id,
            desde: dates[0],
            hasta: dates[1],
            id_serie: 0,
            folio: invoice,
            light: true,
            page: page
        }
        setModalLoading(true)

        const result = await getWarehouseExit(data)
        setModalLoading(false)

        setWarehouseExit(result)
    }


    const [conceptsUpdate, setConceptsUpdate] = useState<any>([])
    const setModalLoading = storeArticles((state: any) => state.setModalLoading);

    const modalUpdate = async (sal: any) => {

        const data = {
            id: sal.id
        }
        setModalLoading(true)
        const result = await getWarehouseExit(data)
        setModalLoading(false)

        setConceptsUpdate(result[0])
        setModal('modal-update__concepts')
    };


    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        searchWarehouseExit()
    }, [page])


    return (
        <div className="departures">
            <Toaster expand={true} position="top-right" richColors />
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
                    <small className='title'>Salidas</small>
                </div>
            </div>
            <div className="departures__container">
                <div className="row__one">
                    <div className="row__one">
                        <div>
                            <Empresas_Sucursales empresaDyn={companies} sucursalDyn={branchOffices} setEmpresaDyn={setCompanies} setSucursalDyn={setBranchOffices} modeUpdate={false} all={true} />
                        </div>
                        <div>
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
                                    }}
                                    placeholder="Selecciona una fecha"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="label__general">Hasta</label>
                            <div className="flex gap-4 container_dates__requisition">
                                <Flatpickr
                                    className="date"
                                    id="fecha-hasta"
                                    onChange={(date) => {
                                        const endDate = date[0]?.toISOString().split("T")[0] || "";
                                        setDates([dates[0], endDate]); // Actualiza directamente el arreglo usando Zustand
                                    }}
                                    options={{
                                        dateFormat: "Y-m-d", // Formato de la fecha
                                        defaultDate: new Date(), // Fecha predeterminada: hoy
                                    }}
                                    placeholder="Selecciona una fecha"
                                />
                            </div>
                        </div>

                        <div>
                            <Select dataSelects={store} instanceId="store" nameSelect={'Almacén'} />
                        </div>
                    </div>
                    <div className="row__two">
                        <div >
                            <Select dataSelects={series} instanceId="serie" nameSelect={'Series'} />
                        </div>
                        <div>
                            <label className='label__general'>Folio</label>
                            <div className='warning__general'><small >Este campo es obligatorio</small></div>
                            <input className={`inputs__general ${warningName ? 'warning' : ''}`} type="text" value={invoice} onChange={(e) => setInvoice(e.target.value)} placeholder='Ingresa el folio' />
                        </div>
                        <div>
                            <button className="btn__general-purple" onClick={searchWarehouseExit}>Buscar</button>
                        </div>
                        <div className="btns__departures">
                            <div>
                                <button className="btn__general-purple">Excel</button>
                            </div>
                            <div>
                                <button className="btn__general-purple" onClick={modalCreate}>Nueva salida</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row__two">

                </div>
                <ModalCreate />
                <ModalUpdate conceptsUpdate={conceptsUpdate} />
                <div className='table__departures'>
                    {warehouseExit ? (
                        <div className='table__numbers'>
                            <p className='text'>Total de salidas</p>
                            <div className='quantities_tables'>{warehouseExit.length}</div>
                        </div>
                    ) : (
                        <p className="text">No hay empresas que mostras</p>
                    )}
                    <div className='table__head'>
                        <div className='thead'>
                            <div className='th'>
                                <p>Salida</p>
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
                    {warehouseExit ? (
                        <div className='table__body'>
                            {warehouseExit?.map((exit: any) => {
                                return (
                                    <div className='tbody__container' key={exit.id}>
                                        <div className='tbody'>
                                            <div className='td'>
                                                <p className="folio-identifier">{exit.serie}-{exit.folio}-{exit.anio}</p>
                                            </div>
                                            <div className='td'>
                                                <p>{exit.empresa}</p>
                                            </div>
                                            <div className='td'>
                                                <p>{exit.sucursal}</p>
                                            </div>
                                            <div className='td'>
                                                <p className="date-identifier">{exit.fecha_creacion}</p>
                                            </div>
                                            <div className='td end'>
                                                <button className='branchoffice__edit_btn' onClick={() => modalUpdate(exit)}>Ver conceptos</button>
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
