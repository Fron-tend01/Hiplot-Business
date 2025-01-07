import React, { useEffect, useState } from 'react'
import Empresas_Sucursales from '../../Dynamic_Components/Empresas_Sucursales'
import { storeModals } from '../../../../zustand/Modals'
import ModalCreate from './quotations/ModalCreate'
import './styles/Quotation.css'
import Flatpickr from "react-flatpickr";
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import APIs from '../../../../services/services/APIs';
import useUserStore from '../../../../zustand/General';
import { storeQuotation } from '../../../../zustand/Quotation';
import { usersRequests } from '../../../../fuctions/Users';
import { seriesRequests } from '../../../../fuctions/Series';
import Select from '../../Dynamic_Components/Select'
import { useSelectStore } from '../../../../zustand/Select'
import { storePersonalized } from '../../../../zustand/Personalized'
import { useStore } from 'zustand'
import { ClientsRequests } from '../../../../fuctions/Clients'


const Quotation: React.FC = () => {
  const userState = useUserStore(state => state.user);
  const user_id = userState.id

  const setModal = storeModals(state => state.setModal)
  const setCustomData = storePersonalized(state => state.setCustomData)
 
  const setQuatation = storeQuotation(state => state.setQuatation)
  const setPersonalized = storePersonalized(state => state.setPersonalized)

  const setDataGet = storeQuotation(state => state.setDataGet);
  const setQuotesData = storeQuotation(state => state.setQuotesData);
  const { quotesData }: any = useStore(storeQuotation)

  const { getUsers }: any = usersRequests()

  const [users, setUsers] = useState<any>()

  const { getClients }: any = ClientsRequests()


  const { getSeriesXUser }: any = seriesRequests()
  const [series, setSeries] = useState<any>([])

  const [company, setCompany] = useState<any>([])
  const [branchOffices, setBranchOffices] = useState<any>([])

  const selectedIds: any = useSelectStore((state) => state.selectedIds);

  const setIdentifier = storeQuotation(state => state.setIdentifier);

  const [dates, setDates] = useState<any>()

  const [fol, setFol] = useState<any>(null)

  const modal = () => {
    setModal('create-modal__qoutation')
  }



  const hoy = new Date();
  const haceUnaSemana = new Date();
  haceUnaSemana.setDate(hoy.getDate() - 7);

  const [client, setClient] = useState<any>('')

  const fetch = async () => {
    setDates([haceUnaSemana.toISOString().split('T')[0], hoy.toISOString().split('T')[0]])
    const dataUser = {
      folio: 0,
      id_sucursal: branchOffices?.id,
      id_serie: 0,
      desde: haceUnaSemana.toISOString().split('T')[0],
      hasta: hoy.toISOString().split('T')[0],
      id_usuario: user_id,
    }

    const data = {
      nombre: '',
      id_usuario: user_id,
      id_usuario_consulta: user_id,
      light: true,
      id_sucursal: 0
    }
    setDataGet(dataUser)

    const resultUsers = await getUsers(data)
    setUsers({
      selectName: 'Vendedores',
      options: 'nombre',
      dataSelect: resultUsers
    })

    let dataSerie = {
      id: user_id,
      tipo_ducumento: 7,
    }

    const resultSeries = await getSeriesXUser(dataSerie)
    resultSeries.unshift({ nombre: 'Ninguna', id: 0 });
    setSeries({
      selectName: 'Series',
      options: 'nombre',
      dataSelect: resultSeries
    })
    try {
      let response = await APIs.getQuotation(dataUser);
      if (response) {
        setQuotesData(response);
        console.log('response', response)
      } else {
        console.log("No se obtuvieron datos");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  }


  useEffect(() => {
    fetch();
  }, []);



  const handleDateChange = (fechasSeleccionadas: any) => {
    if (fechasSeleccionadas.length === 2) {
      setDates(fechasSeleccionadas.map((fecha: any) => fecha.toISOString().split('T')[0]));
    } else {
      setDates([fechasSeleccionadas[0]?.toISOString().split('T')[0] || "", ""]);
    }
  };

  const searchQuotation = async () => {
    const data = {
      folio: parseInt(fol),
      id_sucursal: branchOffices?.id,
      id_serie: selectedIds?.series?.id,
      desde: dates[0],
      hasta: dates[1],
      id_usuario: user_id,
      id_vendedor: selectedIds?.users?.id,
    }

  



    try {
      let response = await APIs.getQuotation(data);
      if (response) {
        setQuotesData(response);
        console.log('response', response)
      } else {
        console.log("No se obtuvieron datos");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  }

  console.log('selectedIds.series', selectedIds.series)

  const updateQuotation = (quatation: any) => {
    setModal('update-modal__qoutation')

    let id_identifier = 1;
    let totalNumberIdentifiers = 0;
    

    quatation.conceptos.forEach((x: any) => {
      x.id_identifier = id_identifier; 
      totalNumberIdentifiers += 1;
      id_identifier++;
    });
    
    setQuatation(quatation)
    setPersonalized(quatation)
    setCustomData(quatation.conceptos)
    setIdentifier(totalNumberIdentifiers)
  }

  return (
    <div className='quotation'>
      <div className='container__quotation'>
        <div className='row'>
          <div className='col-8 md-col-12'>
            <Empresas_Sucursales modeUpdate={false} empresaDyn={company} setEmpresaDyn={setCompany} sucursalDyn={branchOffices} setSucursalDyn={setBranchOffices} />
          </div>
          <div className='dates__requisition col-4'>
            <label className='label__general'>Fechas</label>
            <div className='container_dates__requisition'>
              <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={dates} onChange={handleDateChange} placeholder='seleciona las fechas' />
            </div>
          </div>
        </div>
        <div className='row__two my-4'>
          <div>
            <label className='label__general'>Clientes</label>
            <input className='inputs__general' type="text" value={client} onChange={(e) => setClient(e.target.value)} placeholder='Ingresa el Cliente' />
          </div>
          <div>
            <Select dataSelects={users} nameSelect={'Usuarios'} instanceId='users' />
          </div>
          
          <div>
            <Select dataSelects={series} nameSelect={'Series'} instanceId='series' />
          </div>
          <div>
            <label className='label__general'>Folio</label>
            <input className='inputs__general' type="text" value={fol} onChange={(e) => setFol(e.target.value)} placeholder='Ingresa el folio' />
          </div>
        </div>
        <div className='row__three'>
          <div className='button__search'>
            <button className='sm-mx-auto btn__general-purple' onClick={searchQuotation}>Buscar</button>
          </div>
          <div className='button__create-quotation'>
            <button className='sm-mx-auto btn__general-purple' onClick={modal}>Crear cotizacion</button>
          </div>
        </div>
        <div className='table__quotations' >
          <div>
            <div>
              {quotesData ? (
                <div className='table__numbers'>
                  <p className='text'>Total de cotizaciones</p>
                  <div className='quantities_tables'>{quotesData?.length}</div>
                </div>
              ) : (
                <p className='text'>No hay conceptos</p>
              )}
            </div>
            <div className='table__head'>
              <div className='thead'>
                <div className='th'>
                  <p className=''>Folio</p>
                </div>
                <div className='th'>
                  <p className=''>Total</p>
                </div>
                <div className='th'>
                  <p className=''>Razon social</p>
                </div>
                <div className='th'>
                  <p className=''>Creado por</p>
                </div>
                <div className='th'>
                  <p className=''>Fecha de creación</p>
                </div>
                <div className='th'>
                  <p className=''>Sucursal</p>
                </div>
              </div>
            </div>
            {quotesData ? (
              <div className='table__body'>
                {quotesData?.map((quatation: any, index: any) => (
                  <div className='tbody__container' key={index} onClick={() => updateQuotation(quatation)}>
                    <div className='tbody'>
                      <div className='td'>
                        {quatation.folio}-{quatation.anio}
                      </div>
                      <div className='td'>
                        {/* {quatation.descripcion} */}
                      </div>
                      <div className='td'>
                        {quatation.Razon_social}
                      </div>
                      <div className='td'>
                        {quatation.usuario_crea}
                      </div>
                      <div className='td'>
                        {quatation.fecha_creacion}
                      </div>
                      <div className='td'>
                        {quatation.sucursal}
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text'>Cargando datos...</p>
            )}
          </div>
        </div>
        <ModalCreate />
      </div>
    </div>
  )
}

export default Quotation
