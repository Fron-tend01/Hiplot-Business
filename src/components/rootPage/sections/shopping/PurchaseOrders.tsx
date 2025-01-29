import React, { useState, useEffect } from 'react'
import useUserStore from '../../../../zustand/General';
import { storePurchaseOrders } from '../../../../zustand/PurchaseOrders';
import Flatpickr from "react-flatpickr";
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/l10n/es.js'; // Importar el idioma español
import './styles/PurchaseOrders.css'
import ModalPurchaseOrders from './purchaseOrders/ModalPurchaseOrders';
import APIs from '../../../../services/services/APIs';
import Empresas_Sucursales from '../../Dynamic_Components/Empresas_Sucursales';

// import { storePagination } from '../../../../zustand/Pagination';

const PurchaseOrders: React.FC = () => {

  const setModal = storePurchaseOrders(state => state.setModal)
  const setSelectedBranchOffice = storePurchaseOrders(state => state.setSelectedBranchOffice)
  const setDates = storePurchaseOrders(state => state.setDates)
  const setType = storePurchaseOrders(state => state.setType)
  const setPurchaseOrders = storePurchaseOrders(state => state.setPurchaseOrders)
  
  // const setTotalPages = storePagination((state: any) => state.setTotalPages);
  // const setPage = storePagination((state: any) => state.setPage);

  const [series, setSeries] = useState<any>(null)

  const { getPurchaseOrders, purchaseOrders, selectedBranchOffice, type, dates }: any = storePurchaseOrders();
  const userState = useUserStore(state => state.user);
  const user_id = userState.id


  const [selectedCompany, setSelectedCompany] = useState<number | null>(null)



  const [invoice, setInvoice] = useState<any>(null)
  const [warningInvoice] = useState<boolean>(false)

  const hoy = new Date();
  const haceUnaSemana = new Date();
  haceUnaSemana.setDate(hoy.getDate() - 7);

  const fecth = async () => {

    const dataS = {
      id: user_id,
      tipo_ducumento: 1
    }

    const resultSeries = await APIs.getSeriesXUser(dataS)
    setSeries(resultSeries)

    setDates([haceUnaSemana.toISOString().split('T')[0], hoy.toISOString().split('T')[0]])


    const data = {
      id: 0,
      folio: 0,
      id_serie: 0,
      id_sucursal: selectedBranchOffice == null ? 0 : selectedBranchOffice?.id,
      id_usuario: user_id,
      tipo: type,
      desde: haceUnaSemana.toISOString().split('T')[0],
      hasta: hoy.toISOString().split('T')[0],
      status: 0
    }

    console.log(hoy)




    const result = await APIs.getPurchaseOrders(data);
    setPurchaseOrders(result)

  }


  useEffect(() => {
    fecth()
  }, [])



  ////////////////////////
  /// Fechas
  ////////////////////////

  const handleDateChange = (fechasSeleccionadas: any) => {
    if (fechasSeleccionadas.length === 2) {
      setDates(fechasSeleccionadas.map((fecha: any) => fecha.toISOString().split('T')[0]));
    } else {
      setDates([fechasSeleccionadas[0]?.toISOString().split('T')[0] || "", ""]);
    }
  };



  const handleClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setType(value)
  };



  const [selectSeries, setSelectSeries] = useState<boolean>(false)
  const [selectedSerie, setSelectedSeries] = useState<number | null>(null)

  const openSelectSeries = () => {
    setSelectSeries(!selectSeries)
  }

  const handleSeriesChange = (serie: any) => {
    setSelectSeries(false)
    setSelectedSeries(serie.id)
  }





  const openModal = () => {
    setPurchaseOrderToUpdate(null)

    setModal('modal-purchase-orders-create')

  }


  const searchOrders = () => {
    console.log(dates)
    const data = {
      folio: invoice,
      id_serie: selectedSerie,
      id_sucursal: selectedBranchOffice.id,
      id_usuario: user_id,
      id_area: 0,
      // tipo: tipo,
      desde: dates[0],
      hasta: dates[1],
      status: type,
    };

    // getPurchaseOrders(0, 0, 0, user_id, 0, 0, '2024-03-14', '2024-03-16', 0)
    getPurchaseOrders(data)

  }





  const [purchaseOrderToUpdate, setPurchaseOrderToUpdate] = useState<any>(null);



  const modalUpdate = (purchaseOrder: any) => {
    setModal('modal-purchase-orders-update')
    setPurchaseOrderToUpdate(purchaseOrder)




  }





  return (
    <div className='purchase-order'>
      <div className='container__purchase-order'>
        <div className='row__one'>
          <div className='row__one'>
            <div>
              <Empresas_Sucursales modeUpdate={false} empresaDyn={selectedCompany} sucursalDyn={selectedBranchOffice}
                setEmpresaDyn={setSelectedCompany} setSucursalDyn={setSelectedBranchOffice} all={true} />
            </div>
            <div>
              <div className='dates__requisition'>
                <label className='label__general'>Fechas</label>
                <div className='container_dates__requisition'>
                  <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={dates} onChange={handleDateChange} placeholder='seleciona las fechas' />
                </div>
              </div>
            </div>
          </div>
          <div className='row__two'>
            <div>
              <div className='container__checkbox_requisition'>
                <div className='checkbox__requisition'>
                  <label className="checkbox__container_general">
                    <input className='checkbox' type="radio" name="requisitionStatus" checked={type == 0 ? true : false} value={0} onChange={handleClick} />
                    <span className="checkmark__general"></span>
                  </label>
                  <p className='title__checkbox text'>Activo</p>
                </div>
                <div className='checkbox__requisition'>
                  <label className="checkbox__container_general">
                    <input className='checkbox' type="radio" name="requisitionStatus" checked={type == 1 ? true : false} value={1} onChange={handleClick} />
                    <span className="checkmark__general"></span>
                  </label>
                  <p className='title__checkbox text'>Cancelados</p>
                </div>
                <div className='checkbox__requisition'>
                  <label className="checkbox__container_general">
                    <input className='checkbox' type="radio" name="requisitionStatus" checked={type == 2 ? true : false} value={2} onChange={handleClick} />
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
                  <p>{selectedSerie ? series?.find((s: { id: number }) => s.id === selectedSerie)?.nombre : 'Selecciona'}</p>
                  <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
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
        </div>
        <ModalPurchaseOrders purchaseOrderToUpdate={purchaseOrderToUpdate} />

        <div className='table__purchase-order'>
          {purchaseOrders ? (
            <div className='table__numbers'>
              <p className='text'>Total de Ordenes</p>
              <div className='quantities_tables'>{purchaseOrders.length}</div>
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
            </div>
          </div>
          {purchaseOrders ? (
            <div className='table__body'>
              {purchaseOrders.map((requisition: any) => {
                return (
                  <div className='tbody__container' key={requisition.id} onClick={() => modalUpdate(requisition)}>
                    <div className='tbody'>
                      <div className='td'>
                        <p className='folio-identifier'>{requisition.serie}-{requisition.folio}-{requisition.anio}</p>
                      </div>
                      <div className='td'>
                        <p>{requisition.status == 0 ? <div className='active-identifier'><p>Activa</p></div> : ''}</p>
                        <p>{requisition.status == 1 ? <div className='cancel-identifier'><p>Cancelada</p></div> : ''}</p>
                        <p>{requisition.status == 2 ? <div className='active-status'><p>Terminada</p></div> : ''}</p>
                      </div>
                      <div className='td'>
                        <p className='date-identifier'>{requisition.fecha_creacion}</p>
                      </div>
                      <div className='td'>
                        <p className='user-identifier'>{requisition.usuario_crea}</p>
                      </div>
                      <div className='td'>
                        <p>{requisition.empresa}</p>
                      </div>
                      <div className='td'>
                        <p>{requisition.sucursal}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p>Cargando datos...</p>
          )}
        </div>
        {/* <Pagination /> */}
      </div>
    </div>
  )
}

export default PurchaseOrders
