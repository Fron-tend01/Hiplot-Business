import { useState, useEffect } from "react"
import { storeCompanies } from "../../../../zustand/Companies";
import { storeBranchOffcies } from "../../../../zustand/BranchOffices";
import { storeSeries } from "../../../../zustand/Series";
import useUserStore from "../../../../zustand/General";
import { storeSuppliers } from "../../../../zustand/Suppliers";
import { storeTickets } from "../../../../zustand/Tickets";
import ModalCreate from "./tickets/ModalCreate";
import ModalUpdate from "./tickets/ModalUpdate";
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/l10n/es.js'
import './styles/Tickets.css'
import * as FileSaver from 'file-saver';

const Tickets = () => {


    const {getCompaniesXUsers, companiesXUsers}: any = storeCompanies();
    const {getBranchOfficeXCompanies, branchOfficeXCompanies }: any = storeBranchOffcies();
    const {series, getSeriesXUser}: any = storeSeries();
    const {suppliers, getSuppliers }: any = storeSuppliers();
    const {getTickets, tickets, getExcelTickets}: any = storeTickets(); 
    const userState = useUserStore(state => state.user);
    let user_id = userState.id

    const [selectedCompany, setSelectedCompany] = useState<number | null>(null)
    const [selectedBranchOffice, setSelectedBranchOffice] = useState<number | null>(null);
    const [selectedSerie, setSelectedSerie] = useState<number | null>(null)
    const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null)

    const [selectCompanies, setSelectCompanies] = useState<boolean>(false)
    const [selectBranchOffices, setSelectBranchOffices] = useState<boolean>(false)
    const [selectSeries, setSelectSeries] = useState<boolean>(false)
    const [selectSuppliers, setSelectSuppliers] = useState<boolean>(false)
    const [warningName] = useState<boolean>(false)

    const [modalState, setModalState] = useState<boolean>(false)
    const [modalStateUpdate, setModalStateUpdate] = useState<boolean>(false)
    const [invoice, setInvoice] = useState<string>('')

    useEffect(() => {
        getCompaniesXUsers(user_id)
        getBranchOfficeXCompanies(0, user_id)
        getSeriesXUser(user_id)
        getSuppliers('', true, user_id)
        getTickets(user_id, 3, '2024-04-01', '2024-04-10', 0, 0, 0)
    }, [])

    const openSelectCompanies = () => {
        setSelectCompanies(!selectCompanies)
    
      }

      const openSelectBranchOffices = () => {
        setSelectBranchOffices(!selectBranchOffices)
    
      }

      const handleCompaniesChange = async (company: any) => {
        setSelectedCompany(company.id)
        setSelectCompanies(false)
        selectCompaniesAutomatic(company.id)
        
      }

      const [branchOfficesFiltering, setBranchOfficesFiltering] = useState<any>([])
      const selectCompaniesAutomatic = (company_id: number) => {
        let filter = branchOfficeXCompanies.filter((x: any) => x.empresa_id === company_id)
        setBranchOfficesFiltering(filter)
        setSelectedBranchOffice(filter.length > 0 ? filter[0].id : null);

      }

      const handleBranchOfficesChange = (branchOffice: any) => {
        setSelectedBranchOffice(branchOffice.id)
        setSelectBranchOffices(false)
      }

      
  ////////////////////////////////////////////////
 ///////////////////// Fechas////////////////////
////////////////////////////////////////////////

const defaultStartDate = new Date();
defaultStartDate.setHours(0, 0, 0, 0);
const defaultEndDate = new Date(defaultStartDate.getTime() - 7 * 24 * 60 * 60 * 1000);
defaultEndDate.setHours(0, 0, 0, 0);


useEffect(() => {
  const initFlatpickr = (id: any, storageKey: any) => {
    const storedDates = localStorage.getItem(storageKey);
    let startDate = defaultStartDate;
    let endDate = defaultEndDate;

    if (storedDates) {
      const parsedDates = JSON.parse(storedDates);
      startDate = parsedDates[0] ? new Date(parsedDates[0]) : defaultStartDate;
      endDate = parsedDates[1] ? new Date(parsedDates[1]) : defaultEndDate;
    }

    flatpickr(`#${id}`, {
      mode: 'range',
      dateFormat: 'Y-m-d',
      locale: 'es',
      defaultDate: [startDate, endDate],
      onChange: (selectedDates) => {
        if (id === 'dateRangePicker1') {
            
   
          localStorage.setItem(storageKey, JSON.stringify(selectedDates.map(date => date.toISOString().slice(0, 10))));
        }
      }
    });
  };

  initFlatpickr('dateRangePicker1', 'selectedDateRange1');
}, []);


const openSelectSeries = () => {
    setSelectSeries(!selectSeries)
}

const handleSeriesChange = (serie: any) => {
    setSelectedSerie(serie.id)
    setSelectSeries(false)
}

const openSelectSuppliers = () => {
    setSelectSuppliers(!selectSuppliers)
}

const handleSuppliersChange = (supplier: any) => {
    setSelectedSupplier(supplier.id)
    setSelectSuppliers(false)
}

const modalCreate = () => {
    setModalState(true)
}

const [updateTickets, setUpdateTickets]= useState<any>([])

const modalUpdate = (ticket: any) => {
    setModalStateUpdate(true)
    setUpdateTickets(ticket)
}

const modalCloseCreate = () => {
    setModalState(false)
}

const modalCloseUpdate = () => {
    setModalStateUpdate(false)
}


const excel = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    let id = 0;
    let id_usuario = user_id; // Assuming user_id is defined elsewhere
    let id_sucursal = selectedBranchOffice; // Assuming selectedBranchOffice is defined elsewhere
    let desde = '2024-04-01';
    let hasta = '2024-04-10';

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



  return (
    <div className="tickets">
        <div className="tickets__container">
            <div className="row__one">
                <div className='select__container'>
                    <label className='label__general'>Empresas</label>
                    <div className='select-btn__general'>
                        <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                            <div className='select__container_title'>
                                <p>{selectedCompany ? companiesXUsers.find((s: {id: number}) => s.id === selectedCompany)?.razon_social : 'Selecciona'}</p>
                            </div>
                            <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                        </div>
                        <div className={`content ${selectCompanies ? 'active' : ''}`} >
                            <ul className={`options ${selectCompanies ? 'active' : ''}`} style={{ opacity: selectCompanies ? '1' : '0' }}>
                            {companiesXUsers && companiesXUsers.map((company: any) => (
                                <li key={company.id} onClick={() => handleCompaniesChange(company)}>
                                {company.razon_social}
                                </li>
                            ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='select__container'>
                    <label className='label__general'>Sucursales</label>
                    <div className='select-btn__general'>
                        <div className={`select-btn ${selectBranchOffices ? 'active' : ''}`} onClick={openSelectBranchOffices} >
                            <div className='select__container_title'>
                                <p>{selectedBranchOffice ? branchOfficeXCompanies.find((s: {id: number}) => s.id === selectedBranchOffice)?.nombre : 'Selecciona'}</p>
                            </div>
                            <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                        </div>
                        <div className={`content ${selectBranchOffices ? 'active' : ''}`} >
                            <ul className={`options ${selectBranchOffices ? 'active' : ''}`} style={{ opacity: selectBranchOffices ? '1' : '0' }}>
                            {branchOfficesFiltering.map((sucursal: any) => (
                                <li key={sucursal.id} onClick={() => handleBranchOfficesChange(sucursal)}>
                                {sucursal.nombre}
                                </li>
                            ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='dates__requisition'>
                    <label className='label__general'>Fechas</label>
                    <div className='container_dates__requisition'>
                        <input className='date' id="dateRangePicker1" type="text" placeholder="Seleccionar rango de fechas" />
                    </div>
                </div>
                <div className='select__container'>
                    <label className='label__general'>Series</label>
                    <div className='select-btn__general'>
                        <div className={`select-btn ${selectSeries ? 'active' : ''}`} onClick={openSelectSeries} >
                            <div className='select__container_title'>
                                <p>{selectedSerie ? series.find((s: {id: number}) => s.id === selectedSerie)?.nombre : 'Selecciona'}</p>
                            </div>
                            <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                        </div>
                        <div className={`content ${selectSeries ? 'active' : ''}`} >
                            <ul className={`options ${selectSeries ? 'active' : ''}`} style={{ opacity: selectSeries ? '1' : '0' }}>
                            {series.map((serie: any) => (
                                <li key={serie.id} onClick={() => handleSeriesChange(serie)}>
                                {serie.nombre}
                                </li>
                            ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div>
                    <label className='label__general'>Folio</label>
                    <div className='warning__general'><small >Este campo es obligatorio</small></div>
                    <input className={`inputs__general ${warningName ? 'warning' : ''}`} type="text" value={invoice} onChange={(e) => setInvoice(e.target.value)} placeholder='Ingresa el folio' />
                </div>
                <div className='select__container'>
                    <label className='label__general'>Proveedores</label>
                    <div className='select-btn__general'>
                        <div className={`select-btn ${selectSuppliers ? 'active' : ''}`} onClick={openSelectSuppliers} >
                            <div className='select__container_title'>
                                <p>{selectedSupplier ? suppliers.find((s: {id: number}) => s.id === selectedSupplier)?.nombre_comercial : 'Selecciona'}</p>
                            </div>
                            <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                        </div>
                        <div className={`content ${selectSuppliers ? 'active' : ''}`} >
                            <ul className={`options ${selectSuppliers ? 'active' : ''}`} style={{ opacity: selectSuppliers ? '1' : '0' }}>
                            {suppliers.map((supplier: any) => (
                                <li key={supplier.id} onClick={() => handleSuppliersChange(supplier)}>
                                {supplier.nombre_comercial}
                                </li>
                            ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row__two">            
                <div>
                    <button className="btn__general-purple">Buscar</button>
                </div>
                <div className="btns__tickets">
                    <div>
                        <button className="btn__general-purple" onClick={excel}>Excel</button>
                    </div>
                    <div>
                        <button className="btn__general-purple" onClick={modalCreate}>Nueva entrada</button>
                    </div>  
                </div>      
            </div>
            <div className={`overlay__tickets ${modalState ? 'active' : ''}`}>
                <div className={`popup__tickets ${modalState ? 'active' : ''}`}>
                    <a href="#" className="btn-cerrar-popup__tickets" onClick={modalCloseCreate}>
                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                    </a>
                    <p className='title__modals'>Crear nueva área</p>
                    <ModalCreate />
                </div>
            </div>
            <div className={`overlay__update_tickets ${modalStateUpdate ? 'active' : ''}`}>
                <div className={`popup__update_tickets ${modalStateUpdate ? 'active' : ''}`}>
                    <a href="#" className="btn-cerrar-popup__update_tickets" onClick={modalCloseUpdate}>
                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                    </a>
                    <p className='title__modals'>Crear nueva área</p>
                    <ModalUpdate updateTickets={updateTickets} />
                </div>
            </div>
            <div className='table__tickets'>
                {tickets ? (
                <div className='table__numbers'>
                    <p className='text'>Total de Ordenes</p>
                    <div className='quantities_tables'>{tickets.length}</div>
                </div>
                ) : (
                <p className="text">No hay empresas que mostras</p>
                )}
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
                    } )}
                </div>
                ) : ( 
                    <p className="text">Cargando datos...</p> 
                )}
            </div>
        </div>
    </div>
  )
}

export default Tickets
