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
import { useSelectStore } from "../../../../zustand/Select";

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



    const [series, setSeries] = useState<any>(null)
    const [store, setStore] = useState<any>(null)

    const [companies, setCompanies] = useState<any>()
    const [branchOffices, setBranchOffices] = useState<any>()

  const selectData: any = useSelectStore(state => state.selectedIds)


    const fecht = async () => {





        const resultSeries = await getSeriesXUser({ tipo_ducumento: 4, id: user_id })
        resultSeries.unshift({'id':0, 'nombre':'Todos'})
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
       searchData()
    }

    useEffect(() => {
        fecht()
    }, [])

    const searchData = async () => {
        const data = {
            id_almacen: null,
            id_usuario: user_id,
            id_sucursal: branchOffices?.id,
            desde: dates[0],
            hasta: dates[1],
            id_serie: selectData?.serie?.id ,
            folio: invoice,
            light: true,
            page:page
        }
        setModalLoading(true)

        const result = await getWarehouseExit(data)
        setModalLoading(false)

        setWarehouseExit(result)
    }
    useEffect(() => {
        if (branchOffices) {
            setSelectedBranchOffice(branchOffices.id)
        }


    }, [branchOffices])

    ////////////////////////
    /// Fechas
    ////////////////////////

    // Estado para almacenar las fechas seleccionadas



    const setDates = storeWarehouseExit(state => state.setDates)
    const { dates }: any = useStore(storeWarehouseExit)

    const handleDateChange = (fechasSeleccionadas: any) => {
        if (fechasSeleccionadas.length === 2) {
            setDates(fechasSeleccionadas.map((fecha: any) => fecha.toISOString().split('T')[0]));
        } else {
            setDates([fechasSeleccionadas[0]?.toISOString().split('T')[0] || "", ""]);
        }
    };


    const modalCreate = () => {
        setModal('modal-create__departures')
        console.log(modal)
    }




    const searchWarehouseExit = () => {
        fecht()
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
        <div className="departures small-container">

            <Toaster expand={true} position="top-right" richColors />
            <div className="departures__container">
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
                <div className="row__one">
                    <div className="row">
                        <div className="col-8">
                            <Empresas_Sucursales empresaDyn={companies} sucursalDyn={branchOffices} setEmpresaDyn={setCompanies} setSucursalDyn={setBranchOffices} modeUpdate={false} all={true}/>
                        </div>
                        <div className='col-4'>
                            <label className='label__general'>Fechas</label>
                            <div className='container_dates__requisition'>
                                <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={dates} onChange={handleDateChange} placeholder='seleciona las fechas' />
                            </div>
                        </div>
                        <div className='col-4'>
                            <Select dataSelects={series} instanceId="serie" nameSelect={'Series'} />
                        </div>
                        <div className="col-4">
                            <label className='label__general'>Folio</label>
                            <div className='warning__general'><small >Este campo es obligatorio</small></div>
                            <input className={`inputs__general ${warningName ? 'warning' : ''}`} type="text" value={invoice} onChange={(e) => setInvoice(e.target.value)} placeholder='Ingresa el folio' />
                        </div>
                        <div className='col-4'>
                            <Select dataSelects={store} instanceId="store" nameSelect={'Almacén'} />
                        </div>
                    </div>
                </div>
                <div className="row__two">
                    <div>
                        <button className="btn__general-purple" onClick={searchData}>Buscar</button>
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
                                            <div className='td salida'>
                                                <div>
                                                    <p>{exit.serie}</p>-
                                                    <p>{exit.folio}</p>-
                                                    <p>{exit.anio}</p>
                                                </div>
                                            </div>
                                            <div className='td'>
                                                <p>{exit.empresa}</p>
                                            </div>
                                            <div className='td'>
                                                <p>{exit.sucursal}</p>
                                            </div>
                                            <div className='td date'>
                                                <div>
                                                    <p className="">{exit.fecha_creacion}</p>
                                                </div>
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
        </div>
    )
}

export default Departures
