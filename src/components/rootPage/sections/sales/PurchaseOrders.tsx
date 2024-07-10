import React, { useState, useEffect } from 'react'
import { storeCompanies } from '../../../../zustand/Companies';
import { storeBranchOffcies } from '../../../../zustand/BranchOffices';
import { storeSeries } from '../../../../zustand/Series';
import { storeSuppliers } from '../../../../zustand/Suppliers';
import useUserStore from '../../../../zustand/General';
import { storePurchaseOrders } from '../../../../zustand/PurchaseOrders';



import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/l10n/es.js'; // Importar el idioma español
import './styles/PurchaseOrders.css'
import ModalCreate from './purchaseOrders/ModalCreate'; 
import ModalUpdate from './purchaseOrders/ModalUpdate';

const PurchaseOrders: React.FC = () => {


    const {getCompaniesXUsers, companiesXUsers}: any = storeCompanies();
    const {getBranchOfficeXCompanies, branchOfficeXCompanies }: any = storeBranchOffcies();
    const {series }: any = storeSeries();

    const {getSuppliers}: any = storeSuppliers();
    const { purchaseOrders, getPurchaseOrders}: any = storePurchaseOrders();
    const userState = useUserStore(state => state.user);
    let user_id = userState.id 

  const [selectCompanies, setSelectCompanies] = useState<boolean>(false)
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null)

 

  const [selectBranchOffices, setSelectBranchOffices] = useState<boolean>(false)
  const [selectedBranchOffice, setSelectedBranchOffice] = useState<number | null>(null)



  const [selectSeries]= useState<boolean>(false)
  const [selectedSerie]= useState<number | null>(null)

  const [invoice, setInvoice] = useState<string>('')
  const [warningInvoice] = useState<boolean>(false)

  const [modalState, setModalState] = useState<boolean>(false)

  useEffect(() => {
    getCompaniesXUsers(user_id)
    getBranchOfficeXCompanies(0, user_id)
    getSuppliers('', true, user_id)

  

  }, [])
 
  const [filteredBranchOffices, setFilteredBranchOffices] = useState<any[]>([])

  const openSelectCompanies = () => {
    setSelectCompanies(!selectCompanies)
  }

  const handleCompaniesChange = (company: any) => {
    setSelectedCompany(company.id)
    setSelectCompanies(false)
    automaticBranchOffcieSelector(company.id)
  
  }

  const automaticBranchOffcieSelector = (company_id: any) => {
    const filter = branchOfficeXCompanies.filter((x: any) => x.empresa_id === company_id)
    setFilteredBranchOffices(filter)
    setSelectedBranchOffice(filter.length > 0 ? filter[0].id : null);

  }

  const openSelectBranchOffices = () => {
    setSelectBranchOffices(!selectBranchOffices)
  }

  const handleBranchOfficesChange = (branchOffice: any) => {
    setSelectedBranchOffice(branchOffice.id)
    setSelectBranchOffices(false)
  }

 
  

////////////////////////
/// Fechas
////////////////////////

// Estado para almacenar las fechas seleccionadas
const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

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


      // getRequisition(0, 0, 0, user_id, 0, 0, startDateString, endDateString, 0);
    }
  });
};

// Llamada a initFlatpickr después de que se renderiza el componente
useEffect(() => {
  initFlatpickr();
}, []);

useEffect(() => {
  const startDateString = selectedStartDate?.toISOString().split('T')[0];
  const endDateString = selectedEndDate?.toISOString().split('T')[0];
  getPurchaseOrders(0, 0, 0, user_id, 0, 0, startDateString, endDateString, 0);
}, [selectedStartDate, selectedEndDate]);




 const [tipo, setTipo]= useState<any>(null)

 const handleClick = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value;
  setTipo(value)
};





const openSelectSeries = () => {

}

const handleSeriesChange = (serie: any) => {
  console.log(serie)
}





const openModal = () => {
  setModalState(true)
 
}

const closeModalUpdate = () => {
  setModalState(false)
}

const searchOrders = () => {
  // getPurchaseOrders(0, 0, 0, user_id, 0, 0, '2024-03-14', '2024-03-16', 0)
  getPurchaseOrders(0, 0, 0, selectedBranchOffice, user_id, 0, 0, '2024-03-14', '2024-03-16', tipo)
 
}




const [modalStateUpdte, setModalStateUpdte] = useState<boolean>(false)
const [purchaseOrderToUpdate, setPurchaseOrderToUpdate] = useState<any[]>([]);


const [conceptss, setConceptss] = useState<any>([])
const [suppliersUpdate, setSuppliersUpdate] = useState<any>([])

const modalUpdate = (purchaseOrder: any) => {
  setModalStateUpdte(true)
  setPurchaseOrderToUpdate(purchaseOrder)

  setConceptss(purchaseOrder.conceptos)

  purchaseOrder.conceptos.forEach((item: any) => {
    setSuppliersUpdate(item.proveedores)
    
  });

  
}


const closeModalUpdatetwo = () => {
  setModalStateUpdte(false)
}



  return (
    <div className='purchase-order'>
      <div className='container__purchase-order'>
        <div className='row__one'>
          <div className='select__container'>
            <label className='label__general'>Empresas</label>
            <div className='select-btn__general'>
              <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                <p>{selectedCompany ? companiesXUsers.find((s: {id: number}) => s.id === selectedCompany)?.razon_social : 'Selecciona'}</p>
                <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
              </div>
              <div className={`content ${selectCompanies ? 'active' : ''}`}>
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
                <p>{selectedBranchOffice ? filteredBranchOffices.find((s: {id: number}) => s.id === selectedBranchOffice)?.nombre : 'Selecciona'}</p>
                  <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                </div>
                <div className={`content ${selectBranchOffices ? 'active' : ''}`} >
                  <ul className={`options ${selectBranchOffices ? 'active' : ''}`} style={{ opacity: selectBranchOffices ? '1' : '0' }}>
                    {filteredBranchOffices.map((branchOffice: any) => (
                      <li key={branchOffice.id} onClick={() => handleBranchOfficesChange(branchOffice)}>
                        {branchOffice.nombre}
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
        <div className='row__two'>
          <div>
            <div className='container__checkbox_requisition'>
              <div className='checkbox__requisition'>
                <label className="checkbox__container_general">
                  <input className='checkbox' type="radio" name="requisitionStatus" value={0} onChange={handleClick} />
                  <span className="checkmark__general"></span>
                </label>
                <p className='title__checkbox text'>Activo</p>
              </div>
              <div className='checkbox__requisition'>
                <label className="checkbox__container_general">
                  <input className='checkbox' type="radio" name="requisitionStatus" value={1} onChange={handleClick} />
                  <span className="checkmark__general"></span>
                </label>
                <p className='title__checkbox text'>Cancelados</p>
              </div>
              <div className='checkbox__requisition'>
                <label className="checkbox__container_general">
                  <input className='checkbox' type="radio" name="requisitionStatus" value={2} onChange={handleClick} />
                  <span className="checkmark__general"></span>
                </label>
                <p className='title__checkbox text'>Terminados</p>
              </div>
            </div>
          </div>
          <div className='select__container'>
            <label className='label__general'>Serie</label>
            <div className='select-btn__general'>
              <div className={`select-btn ${selectSeries ? 'active' : ''}`} onClick={openSelectSeries} >
                <p>{selectedSerie ? series.find((s: {id: number}) => s.id === selectedSerie)?.nombre : 'Selecciona'}</p>
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
              {/* <div className='warning__general' style={styleWarningName}><small >Este campo es obligatorio</small></div> */}
            <input className={`inputs__general ${warningInvoice}  ? 'warning' : ''}`} type="text" value={invoice} onChange={(e) => setInvoice(e.target.value)} placeholder='Ingresa el folio' />
          </div>
        </div>
        <div className='row__three'>
          <div className='container__search'>
            <div>
              <button className='btn__general-purple' type='button' onClick={searchOrders}>Buscar</button>
            </div>
          </div>
          <div>
            <button className='btn__general-purple'>Excel</button>
          </div>
          <div>
            <button className='btn__general-purple' onClick={openModal}>Nueva OC</button>
          </div>
        </div>
        <div className={`overlay__purchase-orders ${modalState ? 'active' : ''}`}>
          <div className={`popup__purchase-orders ${modalState ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__purchase-orders" onClick={closeModalUpdate}>
              <svg  className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </a>
            <p className='title__modals'>Crear nueva orden de compra</p>
            <ModalCreate />
          </div>
        </div>
        <div className={`overlay__purchase-orders ${modalStateUpdte ? 'active' : ''}`}>
          <div className={`popup__purchase-orders ${modalStateUpdte ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__purchase-orders" onClick={closeModalUpdatetwo}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </a>
            <p className='title__modals'>Crear nueva orden de compra</p>
            <ModalUpdate purchaseOrder={purchaseOrderToUpdate} conceptss={conceptss} suppliersUpdate={suppliersUpdate} />
          </div>
        </div>
        <div className='table__purchase-order'>
            {companiesXUsers ? (
              <div className='table__numbers'>
                <p className='text'>Total de Ordenes</p>
                <div className='quantities_tables'>{conceptss.length}</div>
              </div>
              ) : (
                <p></p>
              )}
          <div className='table__head'>
            <div className='thead'>
              <div className='th'>
                <p>Folio</p>
              </div>
              <div className='th'>
                <p>Tipo</p>
              </div>
              <div className='th'>
                <p>Status</p>
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
              <div className='th'>
                <p>Areas</p>
              </div>
              <div className='th'>
                <p>Comentarios</p>
              </div>
            </div>
          </div>
          {purchaseOrders ? (
          <div className='table__body'>
            {purchaseOrders.map((requisition: any) => {
              return (
                <div className='tbody__container' key={requisition.id}>
                    <div className='tbody'>
                      <div className='td'>
                        <p>{requisition.folio}</p>
                      </div>
                      <div className='td'>
                        <p>{requisition.status}</p>
                      </div>
                      <div className='td'>
                        <div>
                          {requisition.status === 0 ? (
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'green' }}></div>
                          ) : requisition.status === 1 ? (
                            <span role="img" aria-label="Tacha">❌</span>
                          ) : requisition.status === 2 ? (  
                            <span role="img" aria-label="Palomita">&#x2705;</span>
                          ) : (
                            <span>No válido</span>
                          )}
                        </div>
                      </div>
                      <div className='td'>
                        <p>{requisition.fecha_creacion}</p>
                      </div>
                      <div className='td'>
                        <p>{requisition.usuario_crea}</p>
                      </div>
                      <div className='td'>
                        <p>{requisition.empresa}</p>
                      </div>
                      <div className='td'>
                        <p>{requisition.sucursal}</p>
                      </div>
                      <div className='td'>
                        <p>{requisition.area}</p>
                      </div>
                      <div className='td'>
                        <p>{requisition.comentarios}</p>
                      </div>
                      <div className='td'>
                        <button className='branchoffice__edit_btn' onClick={() => modalUpdate(requisition)}>Editar</button>
                      </div>
                    </div>
                </div>
              )
            } )}
          </div>
          ) : ( 
            <p>Cargando datos...</p> 
          )}
        </div>
      </div>
    </div>
  )
}

export default PurchaseOrders
