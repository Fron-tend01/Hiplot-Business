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

import { storeDv } from '../../../../zustand/Dynamic_variables'
import { storeArticles } from '../../../../zustand/Articles'
import SeeCamposPlantillas from './SeeCamposPlantillas'
import { useSearchParams } from 'react-router-dom'


const Quotation: React.FC = () => {
  const userState = useUserStore(state => state.user);
  const user_id = userState.id

  ////////////////// Personalized Variations////////////////////////////////// 


  const setModal = storeModals(state => state.setModal)

  const setQuatation = storeQuotation(state => state.setQuatation)
  const setPersonalized = storePersonalized(state => state.setPersonalized)

  const setQuotes = storeQuotation(state => state.setQuotes)


  const setDataGet = storeQuotation(state => state.setDataGet);
  const setQuotesData = storeQuotation(state => state.setQuotesData);
  const { quotesData }: any = useStore(storeQuotation)

  const { getUsers }: any = usersRequests()

  const [users, setUsers] = useState<any>()

  const { getSeriesXUser }: any = seriesRequests()
  const [series, setSeries] = useState<any>([])

  const [company, setCompany] = useState<any>([])
  const [branchOffices, setBranchOffices] = useState<any>([])

  const selectedIds: any = useSelectStore((state) => state.selectedIds);

  const [dates, setDates] = useState<any>()
  const setModalLoading = storeArticles((state: any) => state.setModalLoading);

  const [fol, setFol] = useState<any>(0)

  const modal = () => {
    setModal('create-modal__qoutation')
    const cotizacion = JSON.parse(localStorage.getItem('cotizacion') || "[]");
    const cotizacion_pers = JSON.parse(localStorage.getItem('cotizacion-pers') || "[]");
    if (cotizacion) {
      setQuotes({ normal_concepts: cotizacion, personalized_concepts: cotizacion_pers, conceptos_elim: [], conceptos_pers_elim: [] });
      // setQuatation(null);
    }
  }

 const [params] = useSearchParams();
  const id = params.get("id");

  useEffect(() => {
    if (id) {
      APIs.getQuotation({ id }).then(result => {
        const order_search = result[0];
        setModal("update-modal__qoutation");
        setQuotes({
          quotes: order_search,
          normal_concepts: order_search.conceptos,
          personalized_concepts: order_search.conceptos_pers
        });
        setQuatation(order_search);
      });
    }
  }, [id]);

  const hoy = new Date();
  const haceUnaSemana = new Date();
  haceUnaSemana.setDate(hoy.getDate() - 7);

  const [client, setClient] = useState<any>('')

  useEffect(() => {
    // Calcula las fechas iniciales
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    // Formatea las fechas como cadenas en formato "YYYY-MM-DD"
    const formattedOneWeekAgo = oneWeekAgo.toISOString().split("T")[0];
    const formattedToday = today.toISOString().split("T")[0];

    // Configura las fechas iniciales con setDates
    setDates([formattedOneWeekAgo, formattedToday]);
  }, [setDates]);


  const fetch = async () => {

    const dataUser = {
      folio: 0,
      id_sucursal: branchOffices?.id,
      id_serie: 0,
      desde: haceUnaSemana.toISOString().split('T')[0],
      hasta: hoy.toISOString().split('T')[0],
      id_usuario: user_id,
      page: page,
      light: true
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
      tipo_ducumento: 6,
    }

    const resultSeries = await getSeriesXUser(dataSerie)
    resultSeries.unshift({ nombre: 'Ninguna', id: 0 });
    setSeries({
      selectName: 'Series',
      options: 'nombre',
      dataSelect: resultSeries
    })

  }


  useEffect(() => {
    fetch();
    fetchPermisos()
  }, []);

  useEffect(() => {
    searchQuotation()
  }, [branchOffices]);

  const handleDateChange = (fechasSeleccionadas: any) => {
    if (fechasSeleccionadas.length === 2) {
      setDates(fechasSeleccionadas.map((fecha: any) => fecha.toISOString().split('T')[0]));
    } else {
      setDates([fechasSeleccionadas[0]?.toISOString().split('T')[0] || "", ""]);
    }
  };
  const [page, setPage] = useState<number>(1)

  const searchQuotation = async () => {
    const data = {
      folio: parseInt(fol),
      id_sucursal: branchOffices?.id,
      id_serie: selectedIds?.series?.id,
      desde: dates[0],
      hasta: dates[1],
      id_usuario: user_id,
      id_vendedor: selectedIds?.users?.id,
      page: page,
      light: true
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

  const updateQuotation = async (x: any) => {
    const dataSaleOrders = {
      id: x.id
    }
    setModalLoading(true)
    const result = await APIs.getQuotation(dataSaleOrders)
    let order_search = result[0]
    setModal('update-modal__qoutation');
    setQuotes({ quotes: order_search, normal_concepts: order_search.conceptos, personalized_concepts: order_search.conceptos_pers });
    setQuatation(x);
    setModalLoading(false)
  };


  //-----------------------------------------APLICANDO PERMISOS-----------------------------------------------------------
  const setPermisosxVista = storeDv((state) => state.setPermisosxVista);
  const permisosxVista = storeDv((state) => state.permisosxvista);

  const fetchPermisos = async () => {
    await APIs.GetAny('get_permisos_x_vista/' + user_id + '/COTIZACION').then((resp: any) => {
      // console.log('--------------------------------', resp);

      setPermisosxVista(resp)
    })
  }
  useEffect(() => {
    searchQuotation();
  }, [page]);
  return (
    <div className='quotation'>

      <div className='breadcrumbs'>
        <div className='breadcrumbs__container'>
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-receipt"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 17.5v-11" /></svg>
          <small className='title'>Ventas</small>
        </div>
        <div className='chevron__breadcrumbs'>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6" /></svg>
        </div>
        <div className='breadcrumbs__container'>
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></svg>
          <small className='title'>Cotizaciones</small>
        </div>
      </div>
      <div className='container__quotation'>
        <div className='filter__container' style={{ zoom: '80%' }}>
          <div className='row'>
            <div className='col-8 md-col-12'>
              <Empresas_Sucursales modeUpdate={false} empresaDyn={company} setEmpresaDyn={setCompany} sucursalDyn={branchOffices} setSucursalDyn={setBranchOffices} />
            </div>
            <div className='dates__requisition col-4 row'>
              <div className="col-6">
                <label className="label__general">Desde</label>
                <div className="flex gap-4 container_dates__requisition">
                  <Flatpickr
                    className="date"
                    id="fecha-desde"
                    onChange={(date) => {
                      const startDate = date[0]?.toISOString().split("T")[0] || "";
                      setDates([startDate, dates[1]]); // Actualiza directamente el arreglo usando Zustand
                    }}
                    options={{
                      dateFormat: "Y-m-d", // Formato de la fecha
                      defaultDate: new Date(new Date().setDate(new Date().getDate() - 7)), // Fecha predeterminada: una semana atrás
                    }}
                    placeholder="Selecciona una fecha"
                  />
                </div>
              </div>

              <div className="col-6">
                <label className="label__general">Hasta</label>
                <div className="flex gap-4 container_dates__requisition">
                  <Flatpickr
                    className="date"
                    id="fecha-hasta"
                    onChange={(date) => {
                      const endDate = date[0]?.toISOString().split("T")[0] || "";
                      setDates([dates[0], endDate]); // Actualiza directamente el arreglo usando Zustand
                    }}
                    options={{
                      dateFormat: "Y-m-d", // Formato de la fecha
                      defaultDate: new Date(), // Fecha predeterminada: hoy
                    }}
                    placeholder="Selecciona una fecha"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='my-4 row__two'>
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
              <button className='sm-mx-auto btn__general-primary' onClick={searchQuotation}>Buscar</button>
            </div>
            <div className='button__create-quotation'>
              <button className='sm-mx-auto btn__general-bg-100' onClick={modal}>Crear cotizacion</button>
            </div>
          </div>
        </div>
        <div className='table__quotations-head' style={{ zoom: '80%' }}>
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
          <div className='content__table'>
            <div className='table__head'>
              <div className='thead'>
                <div className='th'>
                  <p className=''>Folio</p>
                </div>
                <div className='th'>
                  <p className=''>Titulo</p>
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
                  <p className=''>Cotz.</p>
                </div>
                <div className='th'>
                  <p className=''>Fecha de creación</p>
                </div>
                <div className='th'>
                  <p className=''>Sucursal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='table__quotations-body-desk'>
          {quotesData ? (
            <div className='table__body'>
              {quotesData?.map((quatation: any, index: any) => (
                <div className='tbody__container' key={index} onClick={() => updateQuotation(quatation)}>
                  <div className='tbody'>
                    <div className='td'>
                      <p className='folio'>{quatation.serie}-{quatation.folio}-{quatation.anio}</p>
                    </div>
                    <div className='td'>
                      {quatation.titulo}
                    </div>
                    <div className='td '>
                      <p className='total'>$ {quatation.total.toFixed(2)}</p>
                    </div>
                    <div className='td'>
                      {quatation.Razon_social}
                    </div>
                    <div className='td '>
                      <div className='by-user'>
                        {quatation.usuario_crea}
                      </div>
                    </div>
                    <div className='td'>
                      {quatation.id_solicitud_cotizacion > 0 ? 'Con Cotizador' 

                        : 'Sin Cotizador'}
                        <br />
                      {quatation.id_solicitud_cotizacion > 0 ? 'No. Solicitud: ' + quatation.id_solicitud_cotizacion

                        : ''}
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
        <div className='table__quotations-body-response'>
          {quotesData ? (
            <div className='table__body'>
              {quotesData?.map((quatation: any, index: any) => (
                <div className='tbody__container' key={index} onClick={() => updateQuotation(quatation)}>
                  <div className='tbody'>
                    <div className='td'>
                      <p className='folio-mobile'>{quatation.serie}-{quatation.folio}-{quatation.anio}</p>
                    </div>
                    <div className='td'>
                      {quatation.titulo}
                    </div>

                    <div className='td'>
                      {quatation.Razon_social}
                    </div>
                    <div className='td '>
                      <div className='by-user'>
                        {quatation.usuario_crea}
                      </div>
                    </div>
                    <div className='td'>
                      {quatation.fecha_creacion}
                    </div>
                    <div className='td'>
                      {quatation.sucursal}
                    </div>
                    <div className='td total-mobile'>
                      <div className='total__mobile_container'>
                        <p>Total </p>
                        <p className='total_mobile'>${quatation.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text'>Cargando datos...</p>
          )}
        </div>
        <div className='row paginado-container'>
          <div className='col-1'>
            <button className="paginado-btn paginado-btn-prev" onClick={() => setPage(page - 1)} disabled={page === 1}>
              ← Anterior
            </button>
          </div>
          <div className='col-10 paginado-info'>
            Página {page}
          </div>
          <div className='col-1'>
            <button className="paginado-btn paginado-btn-next" onClick={() => setPage(page + 1)}>
              Siguiente →
            </button>
          </div>
        </div>
        <ModalCreate />
        <SeeCamposPlantillas />

      </div>
    </div>
  )
}

export default Quotation
