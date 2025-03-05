import React, { useEffect, useState } from 'react'
import './styles/Transfers.css'
import { companiesRequests } from '../../../../fuctions/Companies';
import useUserStore from '../../../../zustand/General';
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
import Select from '../../Dynamic_Components/Select';
import { useSelectStore } from '../../../../zustand/Select';
import APIs from '../../../../services/services/APIs';


const Transfers: React.FC = () => {
  const userState = useUserStore(state => state.user);
  const user_id = userState.id

  const setModalStateCreate = storeTransfers((state: any) => state.setModalStateCreate);
  const setModalStateSee = storeTransfers((state: any) => state.setModalStateSee);
  const setDataTransfer = storeTransfers((state: any) => state.setDataTransfer);
  const setTransfers = storeTransfers((state: any) => state.setTransfers);


  const selectedIds: any = useSelectStore((state) => state.selectedIds);
  const setSelectedId = useSelectStore((state) => state.setSelectedId);

  const setDates = storeTransfers(state => state.setDates)

  const { getCompaniesXUsers }: any = companiesRequests();
  const { getStore }: any = StoreRequests();
  const { getSeriesXUser }: any = seriesRequests();
  const { getTransfers, }: any = TransfersRequests();

  const { transfer, dates }: any = storeTransfers();

  const [companiesDesde, setCompaniesDesde] = useState<any>()
  const [companiesHasta, setCompaniesHasta] = useState<any>()

  const [storeDesde, setStoreDesde] = useState<any>()
  const [storeHasta, setStoreHasta] = useState<any>()
  const [series, setSeries] = useState<any>()


  const hoy = new Date();
  const haceUnaSemana = new Date();
  haceUnaSemana.setDate(hoy.getDate() - 7);




  const fetch = async () => {
    setDates([haceUnaSemana.toISOString().split('T')[0], hoy.toISOString().split('T')[0]])

    const resultCompanies = await getCompaniesXUsers(user_id)
    resultCompanies.unshift({ id: 0, razon_social: 'Todas' })
    setCompaniesDesde({
      selectName: 'Empresas desde',
      options: 'razon_social',
      dataSelect: [...resultCompanies]
    })



    setCompaniesHasta({
      selectName: 'Empresas hasta',
      options: 'razon_social',
      dataSelect: [...resultCompanies]
    })




    const resultStore = await getStore(user_id)


    resultStore.unshift({ id: 0, nombre: 'Todos' })
    setStoreDesde({
      selectName: 'Almacen desde',
      options: 'nombre',
      dataSelect: [...resultStore]
    })
    setStoreHasta({
      selectName: 'Almacen hasta',
      options: 'nombre',
      dataSelect: [...resultStore]
    })


    const resultSeries = await getSeriesXUser({ tipo_ducumento: 4, id: user_id })
    setSeries({
      selectName: 'Series',
      options: 'nombre',
      dataSelect: [...resultSeries]
    })

    const data = {
      id_usuario: user_id,
      id_almacen: 0,
      id_sucursal: 0,
      status: 0,
      desde: haceUnaSemana.toISOString().split('T')[0],
      hasta: hoy.toISOString().split('T')[0],

    }



    const response = await APIs.getTransfers(data)
    setTransfers(response)

  }

  useEffect(() => {

    fetch()
    setSelectedId('company_desde', 0)
    setSelectedId('store_desde', 0)
    setSelectedId('company_hasta', 0)
    setSelectedId('store_hasta', 0)
  }, []);


  const modalCreate = () => {
    setModalStateCreate('create')
  }


  ////////////////////////
  /// Fechas
  ////////////////////////



  // Inicializa el estado con las fechas formateadas

  console.log(transfer)

  const handleDateChange = (fechasSeleccionadas: any) => {
    if (fechasSeleccionadas.length === 2) {
      setDates(fechasSeleccionadas.map((fecha: any) => fecha.toISOString().split('T')[0]));
    } else {
      setDates([fechasSeleccionadas[0]?.toISOString().split('T')[0] || "", ""]);
    }
  };



  const [invoice, setInvoice] = useState<any>(0)

  const searchTransfers = async () => {
    const data = {
      id_usuario: user_id,
      id_empresa_origen: selectedIds.company_desde,
      id_empresa_destino: selectedIds.company_hasta,
      id_almacen_origen: selectedIds.store_desde,
      id_almacen_destino: selectedIds.store_hasta,
      desde: dates[0],
      hasta: dates[1],
      id_serie: selectedIds.serie,
      status: type,
      folio: invoice,
      page: 0
    }

    const result = await getTransfers(data)
    console.log(result)
    setTransfers(result)
  }

  console.log(dates)


  const seeConcepts = (concept: any) => {
    setDataTransfer(concept)
    setModalStateSee('see')
  };

  const [type, setType] = useState<number>(0)

  const handleClick = (value: any) => {
    setType(value)
  };


  return (
    <div className='transfer'>
      <div className='transfer__container'>
        <div className='row__one'>
          <div className='row'>
            <div className='col-3'>
              <Select dataSelects={companiesDesde} instanceId='company_desde' nameSelect={'Empresas desde'} />
            </div>
            <div className='col-3'>
              <Select dataSelects={storeDesde} instanceId='store_desde' nameSelect={'Almacen desde'} />
            </div>
            <div className='col-3'>
              <Select dataSelects={companiesHasta} instanceId='company_hasta' nameSelect={'Empresas hasta'} />
            </div>
            <div className='col-3'>
              <Select dataSelects={storeHasta} instanceId='store_hasta' nameSelect={'Almacen hasta'} />
            </div>
          </div>
          <div className='row '>
            <div className='col-8 row'>
              <div className='dates__requisition col-4'>
                <label className='label__general'>Fechas</label>
                <div className='container_dates__requisition'>
                  <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={dates} onChange={handleDateChange} placeholder='seleciona las fechas' />
                </div>
              </div>
              <div className='col-4'>
                <Select dataSelects={series} instanceId='serie' nameSelect={'Series'} />
              </div>
              <div className='col-4'>
                <label className='label__general'>Folio</label>
                <div className='warning__general'><small >Este campo es obligatorio</small></div>
                <input className={`inputs__general`} type="text" value={invoice} onChange={(e) => setInvoice(e.target.value)} placeholder='Ingresa el folio' />
              </div>
            </div>
            <div className='container__checkbox_orders col-4'>
              <div className='checkbox__orders'>
                <label className="checkbox__container_general">
                  <input className='checkbox' type="radio" name="requisitionStatus" checked={type == 1} value={type} onChange={() => handleClick(1)} />
                  <span className="checkmark__general"></span>
                </label>
                <p className='title__checkbox text'>Pend</p>
              </div>
              <div className='checkbox__orders'>
                <label className="checkbox__container_general">
                  <input className='checkbox' type="radio" name="requisitionStatus" checked={type == 0} value={type} onChange={() => handleClick(0)} />
                  <span className="checkmark__general"></span>
                </label>
                <p className='title__checkbox text'>Termi</p>
              </div>
              <div className='checkbox__orders'>
                <label className="checkbox__container_general">
                  <input className='checkbox' type="radio" name="requisitionStatus" checked={type == 2} value={type} onChange={() => handleClick(2)} />
                  <span className="checkmark__general"></span>
                </label>
                <p className='title__checkbox text'>Cancel</p>
              </div>
            </div>
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
              <p className='text'>Total de traspasos</p>
              <div className='quantities_tables'>{transfer.length}</div>
            </div>
          ) : (
            <p className="text">No hay empresas que mostras</p>
          )}
          <div className='table__head'>
            <div className='thead'>
              <div className='th'>
                <p>Traspaso</p>
              </div>
              <div className='th'>
                <p>Status</p>
              </div>
              <div className='th'>
                <p>Empresas</p>
              </div>
              <div className='th'>
                <p>Sucursal</p>
              </div>
              <div className='th'>
                <p>Fecha</p>
              </div>
              <div className="th">

              </div>
            </div>
          </div>
          {transfer && transfer ? (
            <div className='table__body'>
              {transfer.map((transfer: any) => {
                return (
                  <div className='tbody__container' key={uuidv4()}>
                    <div className='tbody'>
                      <div className='td transfers'>
                        <div>
                          <p className='folio-identifier'>{`${transfer.serie}-${transfer.folio}-${transfer.anio}`}</p>
                        </div>
                      </div>
                      <div className='td'>
                        <div className='finished-identifier'><p>Terminado</p></div>
                        {/* <p>{transfer.status == 1 ? <div className='canceled-status'><p>Cancelada</p></div> : ''}</p> */}
                      </div>
                      <div className='td'>
                        <p>{transfer.empresa}</p>
                      </div>
                      <div className='td'>
                        <p>{transfer.sucursal}</p>
                      </div>
                      <div className='td'>
                        <p>{transfer.fecha_creacion}</p>
                      </div>
                      <div className='td'>
                        <button className='branchoffice__edit_btn' onClick={() => seeConcepts(transfer)}>ver conceptos</button>
                      </div>
                    </div>

                  </div>
                )
              })}
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
