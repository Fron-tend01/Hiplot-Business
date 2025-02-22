import { useState, useEffect } from "react"
import { storeCompanies } from "../../../../zustand/Companies";
import { storeBranchOffcies } from "../../../../zustand/BranchOffices";
import { storeSeries } from "../../../../zustand/Series";
import useUserStore from "../../../../zustand/General";
import { storeTickets } from "../../../../zustand/Tickets";
import ModalCreate from "./tickets/ModalCreate";
import ModalUpdate from "./tickets/ModalUpdate";
import Flatpickr from "react-flatpickr";
import 'flatpickr/dist/flatpickr.min.css';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import './styles/Tickets.css'
import * as FileSaver from 'file-saver';
import Empresas_Sucursales from "../../Dynamic_Components/Empresas_Sucursales";
import Select from "../../Dynamic_Components/Select";
import { useSelectStore } from "../../../../zustand/Select";

const Tickets = () => {


    const { getCompaniesXUsers }: any = storeCompanies();
    const { getBranchOfficeXCompanies }: any = storeBranchOffcies();
    const { getSeriesXUser }: any = storeSeries();
    const { getTickets, getExcelTickets, dates, tickets }: any = storeTickets();
    const userState = useUserStore(state => state.user);
    const user_id = userState.id
    const [warningName] = useState<boolean>(false)

    const [companies, setCompanies] = useState<any>([])
    const [branchOffices, setBranchOffices] = useState<any>([])

    const [modalStateUpdate, setModalStateUpdate] = useState<boolean>(false)
    const [invoice, setInvoice] = useState<number>(0)

    const selectedIds: any = useSelectStore((state) => state.selectedIds);

    const setDates = storeTickets(state => state.setDates)

    const setModalTickets = storeTickets(state => state.setModalTickets)
    const hoy = new Date();
    const haceUnaSemana = new Date();
    haceUnaSemana.setDate(hoy.getDate() - 7);

    const [series, setSeries] = useState<any>([]);
    const [page, setPage] = useState<number>(1);



    const fecth = async () => {
        setDates([haceUnaSemana.toISOString().split('T')[0], hoy.toISOString().split('T')[0]]);

        const data = {
            id_usuario: user_id,
            id_empresa: companies.id,
            id_sucursal: branchOffices.id,
            desde: haceUnaSemana.toISOString().split('T')[0],
            hasta: hoy.toISOString().split('T')[0],
            id_serie: selectedIds?.series?.id,
            status: 0,
            folio: invoice || 0,
            page: page
        }
        await getTickets(data)

        const resultSeries = await getSeriesXUser({ id: user_id, tipo_ducumento: 2 })
        resultSeries.unshift({ id: 0, nombre: 'Todos' })

        setSeries({
            selectName: 'Series',
            options: 'nombre',
            dataSelect: resultSeries
        })



    }

    useEffect(() => {
        fecth()
        getCompaniesXUsers(user_id)
        getBranchOfficeXCompanies(0, user_id)



    }, [])


    const handleDateChange = (fechasSeleccionadas: any) => {
        if (fechasSeleccionadas.length === 2) {
            setDates(fechasSeleccionadas.map((fecha: any) => fecha.toISOString().split('T')[0]));
        } else {
            setDates([fechasSeleccionadas[0]?.toISOString().split('T')[0] || "", ""]);
        }
    };



    const [updateTickets, setUpdateTickets] = useState<any>([])

    const modalUpdate = (ticket: any) => {
        setModalStateUpdate(true)
        setUpdateTickets(ticket)
        console.log(ticket)
    }


    const modalCloseUpdate = () => {
        setModalStateUpdate(false)
    }


    const excel = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const id = 0;
        const id_usuario = user_id; // Assuming user_id is defined elsewhere
        const id_sucursal = branchOffices.id; // Assuming selectedBranchOffice is defined elsewhere
        const desde = dates[0];
        const hasta = dates[1];

        try {
            const response = await getExcelTickets(id, id_usuario, id_sucursal, desde, hasta);
            console.log('Excel', response);

            // Create a blob with the response data
            const blob = new Blob([response], { type: 'text/csv;charset=utf-8' });

            // Use FileSaver.js to download the blob as a CSV file
            FileSaver.saveAs(blob, 'nombre_archivo.csv');
        } catch (error) {
            console.error('Error al generar el CSV:', error);
        }
    };


    const searchTicket = () => {
        const data = {
            id_usuario: user_id,
            id_empresa: companies.id,
            id_sucursal: branchOffices.id,
            desde: dates[0],
            hasta: dates[1],
            id_serie: selectedIds?.series?.id,
            status: 0,
            folio: invoice || 0,
            page: page
        }
        getTickets(data)
    }
    useEffect(() => {
        searchTicket()
    }, [page])
    return (
        <div className="tickets">
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
                    <small className='title'>Entradas</small>
                </div>
            </div>
            <div className="tickets__container">
                <div className="row row__one">
                    <div className="col-8 md-col-12">
                        <Empresas_Sucursales empresaDyn={companies} sucursalDyn={branchOffices} setEmpresaDyn={setCompanies} setSucursalDyn={setBranchOffices} modeUpdate={false} all={true} />
                    </div>
                    <div className='col-4 md-col-12'>
                        <label className='label__general'>Fechas</label>
                        <div className='container_dates__requisition'>
                            <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={dates} onChange={handleDateChange} placeholder='seleciona las fechas' />
                        </div>
                    </div>
                    <div className="col-4 md-col-6 sm-col-12">
                        <Select dataSelects={series} instanceId="series" nameSelect={'series'} />
                    </div>
                    <div className="col-4 md-col-6 sm-col-12">
                        <label className='label__general'>Folio</label>
                        <div className='warning__general'><small >Este campo es obligatorio</small></div>
                        <input className={`inputs__general ${warningName ? 'warning' : ''}`} type="text" value={invoice} onChange={(e) => setInvoice(parseInt(e.target.value))} placeholder='Ingresa el folio' />
                    </div>
                    <div className="col-4 md-col-12 d-flex justify-content-center align-items-end">
                        <div className="icon__search" onClick={() => { setPage(1), searchTicket() }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-search"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /></svg>
                        </div>
                        <button className="mx-3 btn__general-orange" onClick={excel}>Excel</button>
                        <button className="btn__general-purple" onClick={() => setModalTickets('modal-create_ticket')}>Nueva entrada</button>
                        {/* <Select dataSelects={suppliers} instanceId="proveedores"  nameSelect={'Proveedores'}/> */}
                    </div>
                </div>
                <ModalCreate />
                <div className={`overlay__update_tickets ${modalStateUpdate ? 'active' : ''}`}>
                    <div className={`popup__update_tickets ${modalStateUpdate ? 'active' : ''}`}>
                        <a href="#" className="btn-cerrar-popup__update_tickets" onClick={modalCloseUpdate}>
                            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                        </a>
                        <p className='title__modals'>Información de Entrada</p>
                        <ModalUpdate updateTickets={updateTickets} />
                    </div>
                </div>
                <div className='mt-4 table__tickets'>
                    <div>
                        {tickets ? (
                            <div className='table__numbers'>
                                <p className='text'>Total de entradas</p>
                                <div className='quantities_tables'>{tickets.length}</div>
                            </div>
                        ) : (
                            <p></p>
                        )}
                    </div>
                    <div className="table">
                        <div className='table__head'>
                            <div className='thead'>
                                <div className='th'>
                                    <p>Folio</p>
                                </div>
                                <div className='th'>
                                    <p>Fecha</p>
                                </div>
                                <div className='th'>
                                    <p>Por</p>
                                </div>
                                <div className='th'>
                                    <p>Empresas</p>
                                </div>
                                <div className='th'>
                                    <p>Sucursal</p>
                                </div>
                            </div>
                        </div>
                        {tickets.length > 0 ? (
                            <div className='table__body'>
                                {tickets.map((ticket: any, index: number) => {
                                    return (
                                        <div className='tbody__container' key={index} onClick={() => modalUpdate(ticket)}>
                                            <div className='tbody'>
                                                <div className='td'>
                                                    <p className="folio-identifier">{ticket.serie}-{ticket.folio}-{ticket.anio}</p>
                                                </div>
                                                <div className='td'>
                                                    <p className="date-identifier">{ticket.fecha_creacion.replace("T", " ")}</p>
                                                </div>
                                                <div className='td'>
                                                    <p className="user-identifier">{ticket.usuario_crea}</p>
                                                </div>
                                                <div className='td'>
                                                    <p>{ticket.empresa}</p>
                                                </div>
                                                <div className='td'>
                                                    <p>{ticket.sucursal}</p>
                                                </div>
                                                <div className='td'>
                                                    <p>{ticket.area}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="empty">
                                <p className='text'>Sin conceptos</p>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3d3e42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-bucket"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 7m-8 0a8 4 0 1 0 16 0a8 4 0 1 0 -16 0" /><path d="M4 7c0 .664 .088 1.324 .263 1.965l2.737 10.035c.5 1.5 2.239 2 5 2s4.5 -.5 5 -2c.333 -1 1.246 -4.345 2.737 -10.035a7.45 7.45 0 0 0 .263 -1.965" /></svg>
                            </div>
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
        </div>
    )
}

export default Tickets
