import React, { useEffect, useState } from 'react'
import useUserStore from '../../../../../../zustand/General'
import { companiesRequests } from '../../../../../../fuctions/Companies'
import { BranchOfficesRequests } from '../../../../../../fuctions/BranchOffices'
import { seriesRequests } from '../../../../../../fuctions/Series'
import { ordersRequests } from '../../../../../../fuctions/Orders'
import { storeWarehouseExit } from '../../../../../../zustand/WarehouseExit'
import { articleRequests } from '../../../../../../fuctions/Articles'
import { useStore } from 'zustand'
import './styles/ByOrder.css'
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/l10n/es.js'
import { UnitConverter } from '../../../../../../utils/UnitConverter'

const ByOrder: React.FC = () => {
  const userState = useUserStore(state => state.user);
  let user_id = userState.id

  const {concepts, setConcepts } = useStore(storeWarehouseExit);

  const [invoice, setInvoice] = useState<string>('')
  const { pz }: any = UnitConverter()

  const { getCompaniesXUsers }: any = companiesRequests()
  const [companies, setCompanies] = useState<any>()

  const {getBranchOffices}: any = BranchOfficesRequests()
  const [setBranchOffices] = useState<any>()

  const {getSeriesXUser}: any = seriesRequests();
  const [series, setSeries] = useState<any>()

  const {getOrdedrs}: any = ordersRequests()
  const [orders, setOrders] = useState<any>()

  const {getArticles}: any = articleRequests()

  const fecht = async () => {
    let companies = await getCompaniesXUsers(user_id)
    setCompanies(companies)
    let result = await getSeriesXUser(user_id)
    setSeries(result)
  }

  useEffect(() => {
    fecht()
  }, [])

  const [selectCompanies, setSelectCompanies] = useState<boolean>(false)
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null)
  
  const openSelectCompanies = () => {
    setSelectCompanies(!selectCompanies)
  }

  const [filteredBranchOffices, setFilteredBranchOffices] = useState<any[]>([])
  const handleCompaniesChange = async (company: any) => {
    setSelectedCompany(company.id)
    setSelectCompanies(false)
    let branchOffices = await getBranchOffices(company.id, user_id)
    setBranchOffices(branchOffices)
    const filter = branchOffices.filter((x: any) => x.empresa_id === company.id)
    setFilteredBranchOffices(filter)
    setSelectedBranchOffice(filter.length > 0 ? filter[0].id : null);


  }
  

  const [selectBranchOffices, setSelectBranchOffices] = useState<boolean>(false)
  const [selectedBranchOffice, setSelectedBranchOffice] = useState<number | null>(null)
  

  const openSelectBranchOffices = () => {
    setSelectBranchOffices(!selectBranchOffices)
  }

  const handleBranchOfficesChange = (sucursal: any) => {
    setSelectBranchOffices(false)
    setSelectedBranchOffice(sucursal)
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



  const filterSeveral = async () => {
    let data = {
      id_usuario: user_id,
      id_sucursal: selectedBranchOffice,
      desde: selectedStartDate,
      hasta: selectedEndDate,
      status: 0,
    }
    let result = await getOrdedrs(data)
    setOrders(result)
  }


  const [selectedSerie, setSelectedSerie] = useState<number | null>(null)
  const [selectSeries, setSelectSeries] = useState<boolean>(false)

  const openSelectSeries = () => {
    setSelectSeries(!selectSeries)
  }

  const handleSeriesChange = (serie: any) => {
    setSelectedSerie(serie.id)
    setSelectSeries(false)
  }

  ///////////////////////////////// Result ////////////////////////////////////


  const [modalUpdatePermissions, setModalUpdatePermissions] = useState<any>(false);

const seeConcepts = (order: number) => {
    setModalUpdatePermissions((prevState: any) => ({
      ...prevState,
      [order]: !prevState[order]
    }));
  };

   const closeModalUpdatePermissions = () => {
    setModalUpdatePermissions(false)
  };


  const addOrders = async (concept: any) => {
    let data = {
      id: concept.id_articulo,
      activos: true,
      nombre: '',
      codigo: '',
      familia: 0,
      proveedor: 0,
      materia_prima: 0,
      get_sucursales: false,
      get_proveedores: false,
      get_max_mins: false,
      get_plantilla_data: false,
      get_stock: true,
      get_web: false,
      get_unidades: true,
      id_usuario: user_id
    };

    let result = await getArticles(data)
    if(result) {

      // let filterStore = result[0].stock.filter((x: any) => x.id == selectedBranchOffice)

      const units = result[0].unidades

      pz('cj', 56, units)



      await setConcepts([...concepts, {

        id_articulo: result[0].id,
        nameArticle: result[0].nombre,
        ped: `${concept.folio}|${concept.anio}`,
        cantidad: null,
        comentarios: '',
        unidad: null,
        unidades: result[0].unidades,
        stocks: result[0].stock,
        pedido_almacen_concepto_id: concept.id
      
        }
      ]);


     
    }

   
  }


  return (
    <div className='by-order__warehouse-exit'>
      <div className='row__one'>
        <div className='select__container'>
          <label className='label__general'>Empresas</label>
          <div className='select-btn__general'>
            <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                <div className='select__container_title'>
                    <p>{selectedCompany ? companies.find((s: {id: number}) => s.id === selectedCompany)?.razon_social : 'Selecciona'}</p>
                </div>
                <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
            </div>
            <div className={`content ${selectCompanies ? 'active' : ''}`} >
                <ul className={`options ${selectCompanies ? 'active' : ''}`} style={{ opacity: selectCompanies ? '1' : '0' }}>
                {companies && companies.map((x: any) => (
                    <li key={x.id} onClick={() => handleCompaniesChange(x)}>
                        {x.razon_social}
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
                      <p>{selectedBranchOffice ? filteredBranchOffices.find((s: {id: number}) => s.id === selectedBranchOffice)?.nombre : 'Selecciona'}</p>
                  </div>
                  <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
              </div>
              <div className={`content ${selectBranchOffices ? 'active' : ''}`} >
                  <ul className={`options ${selectBranchOffices ? 'active' : ''}`} style={{ opacity: selectBranchOffices ? '1' : '0' }}>
                  {filteredBranchOffices.map((sucursal: any) => (
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
        <div>
          <button className='btn__general-purple' type='button' onClick={filterSeveral}>Filtran</button>
        </div>
      </div>
      <div className='row__two'>
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
                  {series && series.map((serie: any) => (
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
            <input className={`inputs__general`} type="text" value={invoice} onChange={(e) =>setInvoice(e.target.value)} placeholder='Ingresa el folio' />
        </div>
        <button className='btn__general-purple'>Filtran</button>
      </div>
      <div className='row__three'>
        <div className='table__modal_filter_orders'>
          <div>
            <div>
                <div className='table__numbers'>
                  <p className='text'>Total de pedidos</p>
                  <div className='quantities_tables'>{concepts.length}
                  </div>
                </div>
            </div>
            <div className='table__head'>
              <div className='thead'>
                <div className='th'>
                  <p className=''>Serie</p>
                </div>
                <div className='th'>
                  <p className=''>Folio</p>
                </div>
                <div className='th'>
                  <p className=''>Fecha</p>
                </div>
                <div className='th'>
                </div>
                <div className='th'>
                 
                </div>
              </div>
            </div>
            {orders && orders.length > 0 ? (
              <div className='table__body'>
                {orders && orders.map((order: any, index: any) => (
                  <div className='tbody__container' key={index}>
                    <div className='tbody'>
                      <div className='td'>
                        {order.id_folio}
                      </div>
                      <div className='td'>
                        ({order.comentarios})
                      </div>
                      <div className='td'>
                        {order.fecha_creacion}
                      </div>
                      <div className='td end'>
                        <div>
                          <button onClick={() => seeConcepts(order.id)} type='button' className='btn__general-purple'>Ver conceptos</button>
                        </div>
                      </div>
                    </div>
                    <div className={`overlay__modal-filter_concepts_departures ${modalUpdatePermissions[order.id] ? 'active' : ''}`}>
                        <div className={`popup__modal-filter_concepts_departures ${modalUpdatePermissions[order.id] ? 'active' : ''}`}>
                        <a href="#" className="btn-cerrar-popup__modal-filter_concepts_departures" onClick={closeModalUpdatePermissions}>
                            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                        </a>
                        <div className='container__modal-filter_concepts_departures'>
                          <div className='table__modal_filter-stocks_tickets'>
                            <div>
                              <div>
                                {order.conceptos ? (
                                  <div className='table__numbers'>
                                    <p className='text'>Total de stocks</p>
                                    <div className='quantities_tables'>{order.conceptos && order.conceptos.length}</div>
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
                              {order.conceptos && order.conceptos.length > 0 ? (
                                <div className='table__body'>
                                  {order.conceptos && order.conceptos.map((concept: any, index: any) => (
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
                                          <button className='btn__general-purple' type='button' onClick={() => addOrders(concept)}>Agregar</button>
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
              ))}
            </div>
            ) : (
              <p className='text'>No hay pedidos filtrados</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ByOrder
