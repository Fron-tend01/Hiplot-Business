import React, { useState, useEffect } from 'react'
import { storeCompanies } from '../../../../zustand/Companies';
import { storeBranchOffcies } from '../../../../zustand/BranchOffices';
import { storeSeries } from '../../../../zustand/Series';
import { storeSuppliers } from '../../../../zustand/Suppliers';
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

const PurchaseOrders: React.FC = () => {

  const setModal = storePurchaseOrders(state => state.setModal)
  const setSelectedBranchOffice = storePurchaseOrders(state => state.setSelectedBranchOffice)
  const setDates = storePurchaseOrders(state => state.setDates)
  const setType = storePurchaseOrders(state => state.setType)
  const setPurchaseOrders = storePurchaseOrders(state => state.setPurchaseOrders)


  const [companies, setCompanies] = useState<any>([])
  const { getBranchOffices }: any = storeBranchOffcies();
  const [branchOffices, setBranchOffices] = useState<any>([])
  const [series, setSeries] = useState<any>(null)

  const { getPurchaseOrders, purchaseOrders, selectedBranchOffice, type, dates }: any = storePurchaseOrders();
  const userState = useUserStore(state => state.user);
  let user_id = userState.id

  const [selectCompanies, setSelectCompanies] = useState<boolean>(false)
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null)


  const [selectBranchOffices, setSelectBranchOffices] = useState<boolean>(false)
  // const [selectedBranchOffice, setSelectedBranchOffice] = useState<number | null>(null)


  const [invoice, setInvoice] = useState<any>(null)
  const [warningInvoice] = useState<boolean>(false)

  const hoy = new Date();
  const haceUnaSemana = new Date();
  haceUnaSemana.setDate(hoy.getDate() - 7);

  const fecth = async () => {

    let dataS = {
      id: user_id,
      tipo_ducumento: 1
    }
  
    let resultSeries = await APIs.getSeriesXUser(dataS)
    setSeries(resultSeries)
    
    setDates([
      hoy.toISOString().split('T')[0], haceUnaSemana.toISOString().split('T')[0]
    ])
   

    let data = {
      id: 0,
      folio: 0,
      id_serie: 0,
      id_sucursal: selectedBranchOffice == null ? 0: selectedBranchOffice?.id,
      id_usuario: user_id,
      tipo: type,
      desde: haceUnaSemana.toISOString().split('T')[0],
      hasta: hoy.toISOString().split('T')[0],
      status: 0
    }

    console.log(hoy)

 


    let result = await APIs.getPurchaseOrders(data);
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
    const data = {
      folio: invoice,
      id_serie: selectedSerie,
      id_sucursal: selectedBranchOffice.id,
      id_usuario: user_id,
      id_area: 0,
      // tipo: tipo,
      desde: dates[1],
      hasta: dates[0],
      status: type,
    };

    // getPurchaseOrders(0, 0, 0, user_id, 0, 0, '2024-03-14', '2024-03-16', 0)
    getPurchaseOrders(data)

  }




  const [modalStateUpdte, setModalStateUpdte] = useState<boolean>(false)
  const [purchaseOrderToUpdate, setPurchaseOrderToUpdate] = useState<any>(null);


  const [conceptss, setConceptss] = useState<any>([])
  const [suppliersUpdate, setSuppliersUpdate] = useState<any>([])

  const modalUpdate = (purchaseOrder: any) => {
    setModal('modal-purchase-orders-update')
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
        <div className='row'>
          <div className='col-8 md-col-12'>
          <Empresas_Sucursales modeUpdate={false} empresaDyn={selectedCompany} sucursalDyn={selectedBranchOffice}
                        setEmpresaDyn={setSelectedCompany} setSucursalDyn={setSelectedBranchOffice} all={true} />
          </div>
          <div className='col-4 md-col-12'>
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
        <ModalPurchaseOrders purchaseOrderToUpdate={purchaseOrderToUpdate} />
        {/* <div className={`overlay__purchase-orders ${modalStateUpdte ? 'active' : ''}`}>
          <div className={`popup__purchase-orders ${modalStateUpdte ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__purchase-orders" onClick={closeModalUpdatetwo}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
            </a>
            <p className='title__modals'>Crear nueva orden de compra</p>
            <ModalUpdate purchaseOrder={purchaseOrderToUpdate} conceptss={conceptss} suppliersUpdate={suppliersUpdate} />
          </div>
        </div> */}
        <div className="table__requisicion" title='Haz click en un registro para ver su información'>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead className="table__head">
              <tr className="thead">
                <th>Folio</th>
                <th>Status</th>
                <th>Fecha</th>
                <th>Por</th>
                <th>Empresas</th>
                <th>Sucursal</th>
              </tr>
            </thead>
            <tbody className="table__body">
              {purchaseOrders && purchaseOrders.length > 0 ? (
                purchaseOrders.map((requisition:any, index:number) => (
                  <tr className="tbody__container" key={index}  onClick={() => modalUpdate(requisition)}>
                    <td>{requisition.serie}-{requisition.folio}-{requisition.anio}</td>
                    <td>
                    <p>{requisition.status == 0 ? <div className='active-status'><p>Activa</p></div> : ''}</p>
                        <p>{requisition.status == 1 ? <div className='canceled-status'><p>Cancelada</p></div> : ''}</p>
                        <p>{requisition.status == 12 ? <div className='active-status'><p>Terminada</p></div> : ''}</p>
                    </td>
                    <td>{requisition.fecha_creacion}</td>
                    <td>{requisition.usuario_crea}</td>
                    <td>{requisition.empresa}</td>
                    <td>{requisition.sucursal}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} style={{ textAlign: "center" }}>
                    No hay requisiciones disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* <div className='table__purchase-order'>
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
                  <div className='tbody__container' key={requisition.id}>
                    <div className='tbody'>
                      <div className='td'>
                        <p>{requisition.serie}-{requisition.folio}-{requisition.anio}</p>
                      </div>
                      <div className='td'>
                        <p>{requisition.status == 0 ? <div className='active-status'><p>Activa</p></div> : ''}</p>
                        <p>{requisition.status == 1 ? <div className='canceled-status'><p>Cancelada</p></div> : ''}</p>
                        <p>{requisition.status == 12 ? <div className='active-status'><p>Terminada</p></div> : ''}</p>
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
              })}
            </div>
          ) : (
            <p>Cargando datos...</p>
          )}
        </div> */}
      </div>
    </div>
  )
}

export default PurchaseOrders
