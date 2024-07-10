import React, { useState, useEffect } from "react"
import { storeCompanies } from "../../../../zustand/Companies";
import { storeBranchOffcies } from "../../../../zustand/BranchOffices";
import { storeSeries } from "../../../../zustand/Series";
import useUserStore from "../../../../zustand/General";
import { storeSuppliers } from "../../../../zustand/Suppliers";
import { storeOrdes } from "../../../../zustand/Ordes";
import ModalCreate from "./Ordes/ModalCreate";
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/l10n/es.js'
import './styles/Orders.css'
import ModalUpdate from "./Ordes/ModalUpdate";

const Departures: React.FC = () => {

    const {getCompaniesXUsers, companiesXUsers}: any = storeCompanies();
    const {getBranchOfficeXCompanies, branchOfficeXCompanies }: any = storeBranchOffcies();
    const {series, getSeriesXUser}: any = storeSeries();
    const {getSuppliers }: any = storeSuppliers();
    const {getOrdedrs, orders}: any = storeOrdes();
    const userState = useUserStore(state => state.user);
    let user_id = userState.id

    const [selectedCompany, setSelectedCompany] = useState<number | null>(null)
    const [selectedBranchOffice, setSelectedBranchOffice] = useState<number | null>(null);
    const [selectedSerie, setSelectedSerie] = useState<number | null>(null)

    const [selectCompanies, setSelectCompanies] = useState<boolean>(false)
    const [selectBranchOffices, setSelectBranchOffices] = useState<boolean>(false)
    const [selectSeries, setSelectSeries] = useState<boolean>(false)
    const [warningName] = useState<boolean>(false)

    const [invoice, setInvoice] = useState<string>('')

    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

    const [tipo, setTipo]= useState<number | null>(null)

    // let id = 0;
    let id_usuario = user_id;
    let id_sucursal = selectedBranchOffice;
    // let id_area = 0;
    let desde = selectedStartDate?.toISOString().split('T')[0];
    let hasta = selectedEndDate?.toISOString().split('T')[0];
    // let id_serie = selectedSerie;
    let status = tipo;
    // let folio = invoice;


    useEffect(() => {
        getCompaniesXUsers(user_id)
        getBranchOfficeXCompanies(0, user_id)
        getSeriesXUser(user_id)
        getSuppliers('', true, user_id)
        getOrdedrs({id_usuario, id_sucursal, desde, hasta, status,})
    }, [id_usuario, id_sucursal, desde, hasta, status])

   


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

  setSelectedStartDate(oneWeekAgo);
  setSelectedEndDate(currentDate); // endDate siempre debe ser el día actual

  const startDateString = oneWeekAgo.toISOString().split('T')[0];
  const endDateString = currentDate.toISOString().split('T')[0];

  flatpickr('#dateRangePicker', {
    mode: 'range',
    dateFormat: 'Y-m-d',
    locale: 'es', // Establecer el idioma en español
    defaultDate: [startDateString, endDateString], // Establecer las fechas predeterminadas aquí
    onChange: (selectedDates) => {
      // Cuando se seleccionan fechas, actualiza los estados
      setSelectedStartDate(selectedDates[0]);
      setSelectedEndDate(selectedDates[1]);

      // Almacena las fechas seleccionadas en localStorage
      localStorage.setItem('selectedStartDate', selectedDates[0].toISOString());
      localStorage.setItem('selectedEndDate', selectedDates[1].toISOString());


    //   getRequisition(0, 0, 0, user_id, 0, 0, startDateString, endDateString, 0);
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


const [modalState, setModalState] = useState<boolean>(false)

const modalCreate = () => {
    setModalState(true)
    
    
}

const modalCloseCreate = () => {
    setModalState(false)
}



 const handleClick = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value: any = event.target.value;
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


  return (
    <div className="orders">
        <div className="orders__container">
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
            </div>
            <div className="row__two">
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
                      <input className={`inputs__general ${warningName ? 'warning' : ''}`} type="text" value={invoice} onChange={(e) =>setInvoice(e.target.value)} placeholder='Ingresa el folio' />
                  </div>
                  <div className='container__checkbox_orders'>
                    <div className='checkbox__orders'>
                      <label className="checkbox__container_general">
                        <input className='checkbox' type="radio" name="requisitionStatus" value={0} onChange={handleClick} />
                        <span className="checkmark__general"></span>
                      </label>
                      <p className='title__checkbox text'>Activo</p>
                    </div>
                    <div className='checkbox__orders'>
                      <label className="checkbox__container_general">
                        <input className='checkbox' type="radio" name="requisitionStatus" value={1} onChange={handleClick} />
                        <span className="checkmark__general"></span>
                      </label>
                      <p className='title__checkbox text'>Cancelados</p>
                    </div>
                    <div className='checkbox__orders'>
                      <label className="checkbox__container_general">
                        <input className='checkbox' type="radio" name="requisitionStatus" value={2} onChange={handleClick} />
                        <span className="checkmark__general"></span>
                      </label>
                      <p className='title__checkbox text'>Terminados</p>
                    </div>
                  </div>
                </div>
            <div className="row__three">            
              <div>
                  <button className="btn__general-purple">Buscar</button>
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
                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                    </a>
                    <p className='title__modals'>Crear nuevo pedido</p>
                    <ModalCreate />
                </div>
            </div>
            <div className={`overlay__orders ${modalStateUpdate ? 'active' : ''}`}>
                <div className={`popup__orders ${modalStateUpdate ? 'active' : ''}`}>
                    <a href="#" className="btn-cerrar-popup__orders" onClick={modalCloseUpdate}>
                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                    </a>
                    <p className='title__modals'>Actualizar pedido</p>
                    <ModalUpdate oderUpdate={oderUpdate} orderConceptsUpdate={orderConceptsUpdate} />
                </div>
            </div>
            <div className='table__orders'>
                {orders ? (
                <div className='table__numbers'>
                    <p className='text'>Total de Ordenes</p>
                    <div className='quantities_tables'>{orders.length}</div>
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
                            <p>Comentarios</p>
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
                                    <p>{order.folio}</p>
                                </div>
                                <div className='td'>
                                    <p>{order.usuario_crea}</p>
                                </div>
                                <div className='td'>
                                    <p>{order.fecha_creacion}</p>
                                </div>
                                <div className='td'>
                                    <p>{order.empresa}</p>
                                </div>
                                <div className='td'>
                                    <p>{order.sucursal}</p>
                                </div>
                                <div className='td'>
                                    <button className='branchoffice__edit_btn' onClick={() => modalUpdate(order)}>Editar</button>
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
