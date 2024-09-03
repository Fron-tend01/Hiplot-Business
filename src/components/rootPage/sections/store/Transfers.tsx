import React, { useEffect, useState } from 'react'
import './styles/Transfers.css'
import { companiesRequests } from '../../../../fuctions/Companies';
import useUserStore from '../../../../zustand/General';
import { BranchOfficesRequests } from '../../../../fuctions/BranchOffices';
import { StoreRequests } from '../../../../fuctions/Store';
import ModalCreate from './transfers/ModalCreate';
import { seriesRequests } from '../../../../fuctions/Series';
import { storeTransfers } from '../../../../zustand/Transfers';
import { TransfersRequests } from '../../../../fuctions/Transfers';
import { Spanish } from 'flatpickr/dist/l10n/es.js'; // Importa la localización en español
import Flatpickr from "react-flatpickr";
import './styles/Departures.css'
import { v4 as uuidv4 } from 'uuid'; // Importa la función v4 de uuid
import ModalSee from './transfers/ModalSee';


const Transfers: React.FC = () => {
  const userState = useUserStore(state => state.user);
  let user_id = userState.id

  const setModalStateCreate = storeTransfers((state: any) => state.setModalStateCreate);
  const setModalStateSee = storeTransfers((state: any) => state.setModalStateSee);
  const setDataTransfer = storeTransfers((state: any) => state.setDataTransfer);


  const {getCompaniesXUsers}: any = companiesRequests();
  const {getBranchOffices}: any = BranchOfficesRequests();
  const {getStore}: any = StoreRequests();
  const {getSeriesXUser}: any = seriesRequests();
  const {getTransfers}: any = TransfersRequests();
  

  const [selectCompanies, setSelectCompanies] = useState<boolean>(false);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);

  const [selectBranchOffices, setSelectBranchOffices] = useState<boolean>(false);
  const [selectedBranchOffice, setSelectedBranchOffice] = useState<any>(null);

  
  const [selectStore, setSelectStore] = useState<boolean>(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);

  const [companies, setCompanies] = useState<any>()
  const [store, setStore] =  useState<any>()
  const [series, setSeries] = useState<any>()

  const [transfer, setTransfers] =  useState<any>([])

  const fetch = async () => {
    let resultCompanies = await getCompaniesXUsers(user_id)
    setCompanies(resultCompanies)
    setSelectedCompany(resultCompanies[0].id)

    let resultBranch = await getBranchOffices(resultCompanies[0].id, user_id)
    await setBranchOffices(resultBranch)
    await setSelectedBranchOffice(resultBranch[0])

    let resultStore = await getStore(user_id)
    setStore(resultStore)
    setSelectedStore(resultStore[0])

    let resultSerie = await getSeriesXUser(user_id)
    setSeries(resultSerie)

    let data = {
      id_usuario: user_id,
      id_almacen: selectedStore.id,
      id_sucursal: resultBranch[0].id,
      status: 0,
      desde: date[0],
      hasta: date[1],
    
    }

    let result = await getTransfers(data)
    console.log(result)
    setTransfers(result)
  }

  useEffect(() => {
    fetch()
  }, []);

  
  const openSelectCompanies = () => {
    setSelectCompanies(!selectCompanies);
  };

  const [branchOffices, setBranchOffices] = useState<any>()

  const handleCompaniesChange = async (company: any) => {
      setSelectedCompany(company);
      setSelectCompanies(false);
      let resultBranch = await getBranchOffices(company, user_id)
      await setBranchOffices(resultBranch)
      await setSelectedBranchOffice(resultBranch[0])
      console.log(selectedBranchOffice)
      console.log(branchOffices)
  };


  const openSelectBranchOffices = () => {
    setSelectBranchOffices(!selectBranchOffices);
  };
  const handleBranchOfficesChange = (sucursal: any) => {
    setSelectedBranchOffice(sucursal);
    // Cerrar el select de sucursales
    setSelectBranchOffices(false);
  };

  const openSelectStore = () => {
    setSelectStore(!selectStore);
  };
  
  const handleStoreChange = (sucursal: any) => {
    setSelectedStore(sucursal);
    // Cerrar el select de sucursales
    setSelectStore(false);
  };

  let modalCreate = () => {
    setModalStateCreate('create')
  }
  

////////////////////////
/// Fechas
////////////////////////


const hoy = new Date();
const haceUnaSemana = new Date();
haceUnaSemana.setDate(hoy.getDate() - 7);

// Inicializa el estado con las fechas formateadas
const [date, setDate] = useState([
  haceUnaSemana.toISOString().split('T')[0],
  hoy.toISOString().split('T')[0]
]);

const handleDateChange = (fechasSeleccionadas: any) => {
  if (fechasSeleccionadas.length === 2) {
    setDate(fechasSeleccionadas.map((fecha: any) => fecha.toISOString().split('T')[0]));
  } else {
    setDate([fechasSeleccionadas[0]?.toISOString().split('T')[0] || "", ""]);
  }
};


const [selectedSerie, setSelectedSerie] = useState<number | null>(null)
const [selectSeries, setSelectSeries] = useState<boolean>(false)


const openSelectSeries = () => {
  setSelectSeries(!selectSeries)
}

const handleSeriesChange = (serie: any) => {
  setSelectedSerie(serie.id)
  setSelectSeries(false)
}

const [invoice, setInvoice] = useState<any>('')

const searchTransfers = async () => {
  let data = {
    id_usuario: user_id,
    id_almacen: selectedStore.id,
    id_sucursal: selectedBranchOffice.id,
    status: 0,
    desde: date[0],
    hasta: date[1],
  }

  let result = await getTransfers(data)
  console.log(result)
  setTransfers(result)
}


const seeConcepts = (concept: any) => {
  setDataTransfer(concept)
  setModalStateSee('see')
};



  return (
    <div className='transfer'>
      <div className='transfer__container'>
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
                      {companies && companies.map((company: any) => (
                      <li key={company.id} onClick={() => handleCompaniesChange(company.id)}>
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
                  <p>{selectedBranchOffice ? branchOffices.find((s: {id: number}) => s.id === selectedBranchOffice.id)?.nombre : 'Selecciona'}</p>
              </div>
              <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
              </div>
              <div className={`content ${selectBranchOffices ? 'active' : ''}`} >
              <ul className={`options ${selectBranchOffices ? 'active' : ''}`} style={{ opacity: selectBranchOffices ? '1' : '0' }}>
                  {branchOffices && branchOffices.map((sucursal: any) => (
                  <li key={sucursal.id} onClick={() => handleBranchOfficesChange(sucursal)}>
                      {sucursal.nombre}
                  </li>
                  ))}
              </ul>
              </div>
            </div>
          </div>
          <div className='select__container'>
            <label className='label__general'>Almacen</label>
            <div className='select-btn__general'>
              <div className={`select-btn ${selectStore ? 'active' : ''}`} onClick={openSelectStore} >
              <div className='select__container_title'>
                  <p>{selectedStore ? store.find((s: {id: number}) => s.id === selectedStore.id)?.nombre : 'Selecciona'}</p>
              </div>
              <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
              </div>
              <div className={`content ${selectStore ? 'active' : ''}`} >
                <ul className={`options ${selectStore ? 'active' : ''}`} style={{ opacity: selectStore ? '1' : '0' }}>
                    {store && store.map((sucursal: any) => (
                      <li key={sucursal.id} onClick={() => handleStoreChange(sucursal)}>
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
              <Flatpickr className='date' options={{locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={date} onChange={handleDateChange} placeholder='seleciona las fechas' />
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
                        {series?.map((serie: any) => (
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
                <input className={`inputs__general`} type="text" value={invoice} onChange={(e) => setInvoice(e.target.value)} placeholder='Ingresa el folio' />
            </div> 
        </div>
        <ModalCreate />
        <ModalSee />
        <div className='row__two'>
          <div>
            <button className='btn__general-purple' onClick={searchTransfers}>Buscar</button>
          </div>
          <div>
            <button className='btn__general-purple' onClick={modalCreate}>Realizer traspaso</button>
          </div>
        </div>
        <div className='table__transfers'>
        {transfer ? (
        <div className='table__numbers'>
            <p className='text'>Total de Ordenes</p>
            <div className='quantities_tables'>{transfer.length}</div>
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
        {transfer && transfer ? (
        <div className='table__body'>
            {transfer.map((transfer: any, index:  any) => {
            return (
                <div className='tbody__container' key={uuidv4()}>
                    <div className='tbody'>
                        <div className='td'>
                            <p>{transfer.folio}</p>
                        </div>
                        <div className='td'>
                            <p>{transfer.usuario_crea}</p>
                        </div>
                        <div className='td'>
                            <p>{transfer.fecha_creacion}</p>
                        </div>
                        <div className='td'>
                            <p>{transfer.empresa}</p>
                        </div>
                        <div className='td'>
                            <p>{transfer.sucursal}</p>
                        </div>
                        <div className='td'>
                            <button className='branchoffice__edit_btn' onClick={() => seeConcepts(transfer, index)}>ver conceptos</button>
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

export default Transfers
