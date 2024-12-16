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
            <div className="tickets__container">
                <div className="row">
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
                        <button className="btn__general-purple" onClick={()=>setPage(1)}>Buscar</button>
                        <button className="btn__general-orange mx-3" onClick={excel}>Excel</button>
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
        
                    <div className='table__tickets mt-4'>
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
                        {tickets ? (
                            <div className='table__body'>
                                {tickets.map((ticket: any, index: number) => {
                                    return (
                                        <div className='tbody__container' key={index} onClick={() => modalUpdate(ticket)}>
                                            <div className='tbody'>
                                                <div className='td code'>
                                                    <p>{ticket.serie}-{ticket.folio}-{ticket.anio}</p>
                                                </div>
                                                <div className='td date'>
                                                    <p>{ticket.fecha_creacion.split('T')[0]}</p>
                                                </div>
                                                <div className='td'>
                                                    <p>{ticket.usuario_crea}</p>
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
                            <p className="mt-3">No hay entradas que mostrar</p>
                        )}
                    </div>
           
                <div className='d-flex justify-content-between mt-4'>
                    <div>
                        <button className='btn__general-purple' onClick={()=>{setPage(page-1)}}
                            disabled={page==1}>Anterior</button>
                    </div>
                    <div>
                        <button className='btn__general-purple' onClick={()=>{setPage(page+1)}}>Siguente</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tickets
