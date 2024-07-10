import { useState, useEffect } from "react"
import { storeCompanies } from "../../../../zustand/Companies";
import { storeBranchOffcies } from "../../../../zustand/BranchOffices";
import { storeSeries } from "../../../../zustand/Series";
import useUserStore from "../../../../zustand/General";
import { storeSuppliers } from "../../../../zustand/Suppliers";
import { WarehouseExitRequests } from "../../../../fuctions/WarehouseExit";
import ModalCreate from "./Departures/ModalCreate";
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/l10n/es.js'
import './styles/Departures.css'
import { Toaster } from 'sonner'
const Departures = () => {
    const userState = useUserStore(state => state.user);
    let user_id = userState.id

    const {getWarehouseExit}: any = WarehouseExitRequests()
    const {getCompaniesXUsers, companiesXUsers}: any = storeCompanies();
    const {getBranchOfficeXCompanies, branchOfficeXCompanies }: any = storeBranchOffcies();
    const {series, getSeriesXUser}: any = storeSeries();
    const {suppliers, getSuppliers }: any = storeSuppliers();
   

    const [selectedCompany, setSelectedCompany] = useState<number | null>(null)
    const [selectedBranchOffice, setSelectedBranchOffice] = useState<number | null>(null);
    const [selectedSerie, setSelectedSerie] = useState<number | null>(null)
    const [selectedStore, setSelectedStore] = useState<number | null>(null)

    const [selectCompanies, setSelectCompanies] = useState<boolean>(false)
    const [selectBranchOffices, setSelectBranchOffices] = useState<boolean>(false)
    const [selectSeries, setSelectSeries] = useState<boolean>(false)
    const [selectStore, setSelectStore] = useState<boolean>(false)
    const [warningName] = useState<boolean>(false)
    const [invoice, setInvoice] = useState<any>(null)

    const [warehouseExit, setWarehouseExit] = useState<any>([])
    const fecht = async () => {
        const data = {
            id_almacen: selectedStore,
            id_usuario: user_id,
            id_sucursal: selectedBranchOffice || null,
            desde: selectedStartDate,
            hasta: selectedEndDate,
            id_serie: selectedSerie || 0,
            folio: invoice,
        }

        let result = await getWarehouseExit(data)
        setWarehouseExit(result)
    }

    useEffect(() => {
        getCompaniesXUsers(user_id)
        getBranchOfficeXCompanies(0, user_id)
        getSeriesXUser(user_id)
        getSuppliers('', true, user_id)
      
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

    

////////////////////////
/// Fechas
////////////////////////

// Estado para almacenar las fechas seleccionadas
const [selectedStartDate, setSelectedStartDate] = useState<any>(null);
const [selectedEndDate, setSelectedEndDate] = useState<any>(null);

// Función para obtener solo la fecha en formato YYYY-MM-DD
const getFormattedDate = (date: Date) => {
  return date.toISOString().substring(0, 10);
};

// Método para inicializar Flatpickr
const initFlatpickr = () => {
  const storedStartDate = localStorage.getItem('selectedStartDate');
  const storedEndDate = localStorage.getItem('selectedEndDate');

  const defaultStartDate = storedStartDate ? new Date(storedStartDate) : new Date();
  defaultStartDate.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00.000

  const defaultEndDate = storedEndDate ? new Date(storedEndDate) : new Date();
  defaultEndDate.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00.000

  const currentDate = new Date(); // Obtener la fecha actual
  currentDate.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00.000

  const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000); // Fecha de hace una semana

  setSelectedStartDate(getFormattedDate(oneWeekAgo));
  setSelectedEndDate(getFormattedDate(currentDate)); // endDate siempre debe ser el día actual

  const startDateString = getFormattedDate(oneWeekAgo);
  const endDateString = getFormattedDate(currentDate);

  flatpickr('#dateRangePicker', {
    mode: 'range',
    dateFormat: 'Y-m-d',
    locale: 'es', // Establecer el idioma en español
    defaultDate: [startDateString, endDateString], // Establecer las fechas predeterminadas aquí
    onChange: (selectedDates) => {
      if (selectedDates.length === 2) {
        const formattedStartDate = getFormattedDate(selectedDates[0]);
        const formattedEndDate = getFormattedDate(selectedDates[1]);
        
        setSelectedStartDate(formattedStartDate);
        setSelectedEndDate(formattedEndDate);

        // Almacena las fechas seleccionadas en localStorage
        localStorage.setItem('selectedStartDate', formattedStartDate);
        localStorage.setItem('selectedEndDate', formattedEndDate);

        // getRequisition(0, 0, 0, user_id, 0, 0, formattedStartDate, formattedEndDate, 0);
      }
    }
  });
};

// Llamada a initFlatpickr después de que se renderiza el componente
useEffect(() => {
  initFlatpickr();
}, []);


useEffect(() => {
//   getRequisition(0, 0, 0, user_id, 0, 0, startDateString, endDateString, 0);
}, [selectedStartDate, selectedEndDate]);


const openSelectSeries = () => {
    setSelectSeries(!selectSeries)
}

const handleSeriesChange = (serie: any) => {
    setSelectedSerie(serie.id)
    setSelectSeries(false)
}

const openSelectStore = () => {
    setSelectStore(!selectStore)
}

const handleStoreChange = (supplier: any) => {
    setSelectedStore(supplier.id)
    setSelectStore(false)
}

const [modalState, setModalState] = useState<boolean>(false)

const modalCreate = () => {
    setModalState(true)
}

const modalCloseCreate = () => {
    setModalState(false)
}





useEffect(() => {
    fecht()
}, [])



const searchWarehouseExit = () => {
    fecht()
}


const [modalUpdatePermissions, setModalUpdatePermissions] = useState<any>(false);

const seeConcepts = (item: number) => {
    setModalUpdatePermissions((prevState: any) => ({
      ...prevState,
      [item]: !prevState[item]
    }));
  };

   const closeModalUpdatePermissions = () => {
    setModalUpdatePermissions(false)
  };


  return (
    <div className="departures">
        <Toaster expand={true} position="top-right" richColors  />
        <div className="departures__container">
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
                        <input className='date' id="dateRangePicker" type="text" placeholder="Seleccionar rango de fechas" />
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
                    <label className='label__general'>Almacen</label>
                    <div className='select-btn__general'>
                        <div className={`select-btn ${selectStore ? 'active' : ''}`} onClick={openSelectStore} >
                            <div className='select__container_title'>
                                <p>{selectedStore ? suppliers.find((s: {id: number}) => s.id === selectedStore)?.nombre_comercial : 'Selecciona'}</p>
                            </div>
                            <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                        </div>
                        <div className={`content ${selectStore ? 'active' : ''}`} >
                            <ul className={`options ${selectStore ? 'active' : ''}`} style={{ opacity: selectStore ? '1' : '0' }}>
                            {suppliers.map((supplier: any) => (
                                <li key={supplier.id} onClick={() => handleStoreChange(supplier)}>
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
            <div className={`overlay__departures ${modalState ? 'active' : ''}`}>
                <div className={`popup__departures ${modalState ? 'active' : ''}`}>
                    <a href="#" className="btn-cerrar-popup__departures" onClick={modalCloseCreate}>
                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                    </a>
                    <p className='title__modals'>Crear nueva salida</p>
                    <ModalCreate />
                </div>
            </div>
            <div className='table__departures'>
                {warehouseExit ? (
                <div className='table__numbers'>
                    <p className='text'>Total de Ordenes</p>
                    <div className='quantities_tables'>{warehouseExit.length}</div>
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
                            <p>Serie</p>
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
                            <p>Sucursal</p>
                        </div>
                        <div className="th">

                        </div>
                    </div>
                </div>
                {warehouseExit ? (
                <div className='table__body'>
                    {warehouseExit && warehouseExit.map((exit: any) => {
                    return (
                        <div className='tbody__container' key={exit.id}>
                            <div className='tbody'>
                                <div className='td'>
                                    <p>{exit.folio}</p>
                                </div>
                                <div className='td'>
                                    <p>{exit.serie}</p>
                                </div>
                                <div className='td'>
                                    <p>{exit.usuario_crea}</p>
                                </div>
                                <div className='td'>
                                    <p>{exit.fecha_creacion}</p>
                                </div>
                                <div className='td'>
                                    <p>{exit.empresa}</p>
                                </div>
                                <div className='td'>
                                    <p>{exit.sucursal}</p>
                                </div>
                                <div className='td end'>
                                    <button className='branchoffice__edit_btn' onClick={() => seeConcepts(exit.id)}>Ver conceptos</button>
                                </div>
                            </div>
                            <div className={`overlay__modal-concepts_departures ${modalUpdatePermissions[exit.id] ? 'active' : ''}`}>
                                <div className={`popup__modal-concepts_departures ${modalUpdatePermissions[exit.id] ? 'active' : ''}`}>
                                <a href="#" className="btn-cerrar-popup__modal-concepts_departures" onClick={closeModalUpdatePermissions}>
                                    <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                                </a>
                                <div className='container__modal-concepts_departures'>
                                    <div className='modal-concepts_departures'>
                                        <div className='table__modal-concepts_departures'>
                                            <div>
                                                <div>
                                                    {exit.conceptos ? (
                                                    <div className='table__numbers'>
                                                        <p className='text'>Total de stocks</p>
                                                        <div className='quantities_tables'>{exit.conceptos && exit.conceptos.length}</div>
                                                    </div>
                                                    ) : (
                                                    <p className='text'>No hay stock</p>
                                                    )}
                                                </div>
                                                <div className='table__head'>
                                                    <div className='thead'>
                                                    <div className='th'>
                                                        <p className=''>Codigo</p>
                                                    </div>
                                                    <div className='th'>
                                                        <p className=''>Unidad</p>
                                                    </div>
                                                    <div className='th'>
                                                        <p className=''>Cantidad</p>
                                                    </div>
                                                    <div className='th'>
                                                        <p className=''>Comentarios</p>
                                                    </div>
                                                    <div className='th'>
                                            
                                                    </div>
                                                    </div>
                                                </div>
                                                {exit.conceptos && exit.conceptos.length > 0 ? (
                                                    <div className='table__body'>
                                                    {exit.conceptos && exit.conceptos.map((concept: any, index: any) => (
                                                        <div className='tbody__container' key={index}>
                                                        <div className='tbody'>
                                                            <div className='td'>
                                                            {concept.codigo}
                                                            </div>
                                                            <div className='td'>
                                                            {concept.unidad}
                                                            </div>
                                                            <div className='td'>
                                                            {concept.cantidad}
                                                            </div>
                                                            <div className='td'>
                                                            {concept.descripcion}
                                                            </div>
                                                            <div className='td'>
                                                            </div>
                                                        </div>
                                                        
                                                    </div>
                                                    ))}
                                                </div>
                                                ) : (
                                                    <p className='text'>No hay conceptos</p>
                                                )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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

export default Departures
