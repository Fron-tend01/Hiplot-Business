import { useState, useEffect } from "react"
import { storeCompanies } from "../../../../zustand/Companies";
import { storeBranchOffcies } from "../../../../zustand/BranchOffices";
import { storeSeries } from "../../../../zustand/Series";
import useUserStore from "../../../../zustand/General";
import { storeSuppliers } from "../../../../zustand/Suppliers";
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
    const {getSeriesXUser }: any = storeSeries();
    const {getSuppliers }: any = storeSuppliers();
    const { getTickets, tickets, getExcelTickets, dates}: any = storeTickets();
    const userState = useUserStore(state => state.user);
    let user_id = userState.id
    const [warningName] = useState<boolean>(false)

    const [companies, setCompanies] = useState<any>([])
    const [branchOffices, setBranchOffices] = useState<any>([])

    const [modalStateUpdate, setModalStateUpdate] = useState<boolean>(false)
    const [invoice, setInvoice] = useState<string>('')

    const selectedIds: any = useSelectStore((state) => state.selectedIds);

    const setDates = storeTickets(state => state.setDates)


    const setModalTickets = storeTickets(state => state.setModalTickets)

    const [series, setSeries] = useState<any>([])
    const [suppliers, setSuppliers] = useState<any>([])

    const fecth = async () => {
        let resultSeries = await getSeriesXUser({id: user_id, tipo_ducumento: 2})
        let resultSuppliers = await getSuppliers('', false, user_id)
        setSeries({
            selectName: 'Series',
            options: 'nombre',
            dataSelect: resultSeries
        })

        setSuppliers({
            selectName: 'Proveedores',
            options: 'nombre',
            setSuppliers: resultSuppliers
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

        let id = 0;
        let id_usuario = user_id; // Assuming user_id is defined elsewhere
        let id_sucursal = branchOffices.id; // Assuming selectedBranchOffice is defined elsewhere
        let desde = dates[0];
        let hasta = dates[1];

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

        let data  = {
            id_usuario: user_id,
            id_sucursal: branchOffices.id,
            desde: dates[0],
            hasta: dates[1],
            id_serie: selectedIds?.series,
            status: 0,
            folio: 0
        }  
        getTickets(data)
    }
  

    return (
        <div className="tickets">
            <div className="tickets__container">
                <div className="row">
                    <div className="col-8">
                        <Empresas_Sucursales empresaDyn={companies} sucursalDyn={branchOffices} setEmpresaDyn={setCompanies} setSucursalDyn={setBranchOffices}  modeUpdate={false}/>
                    </div>
                    <div className='col-4'>
                        <label className='label__general'>Fechas</label>
                        <div className='container_dates__requisition'>
                            <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={dates} onChange={handleDateChange} placeholder='seleciona las fechas' />
                        </div>
                    </div>
                    <div className="col-4">
                        <Select dataSelects={series} instanceId="series" nameSelect={'series'} />
                    </div>
                    <div className="col-4">
                        <label className='label__general'>Folio</label>
                        <div className='warning__general'><small >Este campo es obligatorio</small></div>
                        <input className={`inputs__general ${warningName ? 'warning' : ''}`} type="text" value={invoice} onChange={(e) => setInvoice(e.target.value)} placeholder='Ingresa el folio' />
                    </div>
                    <div className="col-4">
                        <Select dataSelects={suppliers} instanceId="proveedores"  nameSelect={'Proveedores'}/>
                    </div>
                </div>
                <div className="row__two">
                    <div>
                        <button className="btn__general-purple" onClick={searchTicket}>Buscar</button>
                    </div>
                    <div className="btns__tickets">
                        <div>
                            <button className="btn__general-purple" onClick={excel}>Excel</button>
                        </div>
                        <div>
                            <button className="btn__general-purple" onClick={() => setModalTickets('modal-create_ticket')}>Nueva entrada</button>
                        </div>
                    </div>
                </div>
                <ModalCreate />
                <div className={`overlay__update_tickets ${modalStateUpdate ? 'active' : ''}`}>
                    <div className={`popup__update_tickets ${modalStateUpdate ? 'active' : ''}`}>
                        <a href="#" className="btn-cerrar-popup__update_tickets" onClick={modalCloseUpdate}>
                            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                        </a>
                        <p className='title__modals'>Crear nueva área</p>
                        <ModalUpdate updateTickets={updateTickets} />
                    </div>
                </div>
                <div className='table__tickets'>
                    <div className='table__numbers'>
                        <p className='text'>Total de Entradas</p>
                        <div className='quantities_tables'>{tickets?.length || 0}</div>
                    </div>
                    <div className='table__head'>
                        <div className='thead'>
                            <div className='th'>
                                <p>Folio</p>
                            </div>
                            <div className='th'>
                                <p>Por</p>
                            </div>
                            <div className='th'>
                                <p>Fecha</p>
                            </div>
                            <div className='th'>
                                <p>Empresa</p>
                            </div>
                            <div className='th'>
                                <p>Proveedor</p>
                            </div>
                            <div className='th'>
                                <p>Total</p>
                            </div>
                            <div className='th'>
                                <p>Comentarios</p>
                            </div>
                        </div>
                    </div>
                    {tickets ? (
                        <div className='table__body'>
                            {tickets.map((ticket: any) => {
                                return (
                                    <div className='tbody__container' key={ticket.id}>
                                        <div className='tbody'>
                                            <div className='td'>
                                                <p>{ticket.folio}</p>
                                            </div>
                                            <div className='td'>
                                                <p>{ticket.status}</p>
                                            </div>
                                            <div className='td'>
                                                <div>
                                                    {ticket.status === 0 ? (
                                                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'green' }}></div>
                                                    ) : ticket.status === 1 ? (
                                                        <span role="img" aria-label="Tacha">❌</span>
                                                    ) : ticket.status === 2 ? (
                                                        <span role="img" aria-label="Palomita">&#x2705;</span>
                                                    ) : (
                                                        <span>No válido</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className='td'>
                                                <p>{ticket.fecha_creacion}</p>
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
                                            <div className='td'>
                                                <p>{ticket.comentarios}</p>
                                            </div>
                                            <div className='td'>
                                                <button className='branchoffice__edit_btn' onClick={() => modalUpdate(ticket)}>Editar</button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <p className="text mt-3">No hay entradas que mostrar</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Tickets
