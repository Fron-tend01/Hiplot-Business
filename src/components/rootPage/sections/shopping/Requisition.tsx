import React, { useState, useEffect } from 'react';
import { companiesRequests } from '../../../../fuctions/Companies';
import { BranchOfficesRequests } from '../../../../fuctions/BranchOffices';
import { areasRequests } from '../../../../fuctions/Areas';
import { storeSeries } from '../../../../zustand/Series';
import useUserStore from '../../../../zustand/General';
import Flatpickr from "react-flatpickr";
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/l10n/es.js'; // Importar el idioma español
import './styles/Requisition.css'
import ModalRequisition from './requisition/ModalRequisition';
// import ModalUpdate from './requisition/ModalUpdate';
import { storeRequisitions } from '../../../../zustand/Requisition'
import { RequisitionRequests } from '../../../../fuctions/Requisition';
import { useStore } from 'zustand';
import Select from '../../Dynamic_Components/Select';
import { useSelectStore } from '../../../../zustand/Select';
import types from './requisition/json/types.json'
import Pagination from '../../Dynamic_Components/Pagination';
import { storePagination } from '../../../../zustand/Pagination';
import APIs from '../../../../services/services/APIs';
import { storeOrdes } from '../../../../zustand/Ordes';
import { storeArticles } from '../../../../zustand/Articles';
import { storeDv } from '../../../../zustand/Dynamic_variables';

const Requisition: React.FC = () => {

  const setTotalPages = storePagination((state: any) => state.setTotalPages);
  const setPage = storePagination((state: any) => state.setPage);


  const setModalStateCreate = storeRequisitions((state: any) => state.setModalStateCreate);

  const setConcepts = storeRequisitions((state: any) => state.setConcepts);

  const setDates = storeRequisitions((state: any) => state.setDates);

  const setDataGet = storeRequisitions((state: any) => state.setDataGet);
  const setRequisitions = storeRequisitions((state: any) => state.setRequisitions);

  const setUpdateToRequisition = storeRequisitions((state: any) => state.setUpdateToRequisition);

  // Selects
  const [selectTypes, setSelectTypes] = useState<boolean>(false);
  const [selectSeries, setSelectSeries] = useState<boolean>(false)


  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [selectedSerie, setSelectedSerie] = useState<number | null>(null)

  const { getCompaniesXUsers }: any = companiesRequests();
  const [companiesXUsers, setCompaniesXUsers] = useState<any>()

  const { getBranchOffices }: any = BranchOfficesRequests();
  const [branchOfficeXCompanies, setBranchOfficeXCompanies] = useState<any>()

  const { getAreas }: any = areasRequests();
  const [areasXBranchOfficesXUsers, setAreasXBranchOfficesXUsers] = useState<any>()


  const { getRequisition }: any = RequisitionRequests();

  const { requisitions, dates }: any = useStore(storeRequisitions);

  const [series, setSeries] = useState<any>([])
  //----------------------------------------------------ESTRUCTURA ACTUAL BORRAR TODO LO QUE NO SE USE APARTIR DE ESTE PUNTO

  const selectedIds: any = useSelectStore((state) => state.selectedIds);
  const setSelectedId = useSelectStore((state) => state.setSelectedId);


  // Estados de advertencia para validar campos
  // Warning states to validate fields
  const [warningName] = useState<boolean>(false)


  const { getSeriesXUser }: any = storeSeries();
  const userState = useUserStore(state => state.user);
  const user_id = userState.id

  const hoy = new Date();
  const haceUnaSemana = new Date();
  haceUnaSemana.setDate(hoy.getDate() - 30);
  const setLPAs = storeOrdes(state => state.setLPAs)



  const fetch = async () => {
    APIs.CreateAny({ id_usuario: user_id, for_pedido: 2, light: true }, "getLPA")
      .then(async (response: any) => {
        setLPAs({
          selectName: 'Lista Productos Aprobados',
          dataSelect: response,
          options: 'nombre'
        })
      })
    setDates([haceUnaSemana.toISOString().split('T')[0], hoy.toISOString().split('T')[0]])
    getCompaniesXUsers(user_id).then((data: any) => {
      data.unshift({ id: 0, razon_social: 'Todos' })
      setCompaniesXUsers({
        selectName: 'Empresa',
        options: 'razon_social',
        dataSelect: data
      })
    });
    setSelectedId('empresa', 0)


    // const data = {
    //   id_sucursal: 0,
    //   id_usuario: user_id,
    //   id_area: 0,
    //   tipo: 0,
    //   desde: haceUnaSemana.toISOString().split('T')[0],
    //   hasta: hoy.toISOString().split('T')[0],
    //   status: 0,
    //   page: 1
    // };
    // setDataGet(data)
    // const resultRequisition = await getRequisition(data)
    // setRequisitions(resultRequisition.data)
    // setTotalPages(resultRequisition.total_pages)
    await searchByFolio()
    const resultSeries = await getSeriesXUser({ id: user_id, tipo_ducumento: 0 })
    resultSeries.unshift({ nombre: 'Todos', id: 0 });
    setSeries(resultSeries)
    setSelectedSerie(resultSeries[0].id)

  }

  useEffect(() => {
    fetch()
    fetchPermisos()
  }, [])

  //Modales
  const modalCreate = () => {
    setModalStateCreate('create')

  }


  console.log(dates)

  const [invoice, setInvoice] = useState<string>('')


  ////////////////////////
  /// Select de Empresas
  ////////////////////////

  useEffect(() => {
    if (selectedIds != null) {
      getBranchOffices(typeof selectedIds.empresa === 'object' ? selectedIds.empresa.id : selectedIds.empresa, user_id).then((data: any) => {
        data.unshift({ id: 0, nombre: 'Todos' })
        setBranchOfficeXCompanies({
          selectName: 'Sucursal',
          options: 'nombre',
          dataSelect: [...data]
        })
        setSelectedId('sucursal', 0)
      });

    }
  }, [selectedIds?.empresa]);

  useEffect(() => {
    if (selectedIds != null) {
      getAreas(typeof selectedIds.sucursal === 'object' ? selectedIds.sucursal.id : selectedIds.sucursal, user_id).then((data: any) => {
        data.unshift({ id: 0, nombre: 'Todos' })
        setAreasXBranchOfficesXUsers({
          selectName: 'Area',
          options: 'nombre',
          dataSelect: [...data]
        })
        setSelectedId('area', 0)
      });

    }
  }, [selectedIds?.sucursal]);


  ////////////////////////
  /// Select de tipos
  ////////////////////////

  const handleTypesChange = (type: any) => {
    setSelectedType(type.id)
    setSelectTypes(false)
    // const handleAreasChange = (area: any) => {
    //   setSelectedArea(area.id)
    //   setSelectAreas(false)
    //   if (selectedStartDate && selectedEndDate) {
    //     const startDateString = selectedStartDate.toISOString().split('T')[0];
    //     const endDateString = selectedEndDate.toISOString().split('T')[0];
    //     getRequisition(0, 0, 0, user_id, 0, type.id, startDateString, endDateString, 0)
    //   }
    // }


  }


  const openSelectTypes = () => {
    setSelectTypes(!selectTypes)

  }


  ////////////////////////
  /// Checks
  ////////////////////////


  const [status, setStatus] = useState<number>(0)


  const handleClick = (value: any) => {
    if (value) {
      setStatus(value)
      switch (value) {
        case '0':

          getRequisition(0, 0, 0, user_id, 0, 0, dates[0], dates[1], 0);

          break;
        case '1':

          getRequisition(0, 0, 0, user_id, 0, 0, dates[0], dates[1], 1);

          break;
        case '2':

          getRequisition(0, 0, 0, user_id, 0, 0, dates[0], dates[1], 2);

          break;
        default:
          console.log("Valor desconocido");
          break;
      }


    }
  };


  ////////////////////////
  /// Select de series
  ////////////////////////

  const handleSeriesChange = (serie: any) => {
    setSelectedSerie(serie.id)
    setSelectSeries(false)

  }


  const openSelectSeries = () => {
    setSelectSeries(!selectSeries)

  }
  const setModalLoading = storeArticles((state: any) => state.setModalLoading);

  const searchByFolio = async () => {
    const data = {

      id_sucursal: selectedIds.sucursal.id || selectedIds.sucursal,
      id_usuario: user_id,
      id_area: selectedIds.area.id || selectedIds.area,
      tipo: 0,
      desde: dates[0],
      hasta: dates[1],
      status: status,
      page: page2

    };
    setPage(1)
    setModalLoading(true)
    const resultRequisition = await getRequisition(data)
    setModalLoading(false)

    setRequisitions(resultRequisition.data)
    setTotalPages(resultRequisition.total_pages)

  }


  const modalUpdate = (requisition: any) => {
    setModalStateCreate('update')
    setUpdateToRequisition(requisition)
    setConcepts(requisition.conceptos)
  }



  const styleWarningName = {
    opacity: warningName === true ? '1' : '',
    height: warningName === true ? '23px' : ''
  }
  const { modalStateCreate }: any = useStore(storeRequisitions);



  useEffect(() => {
    if (modalStateCreate == '') {
      searchByFolio()
    }
  }, [modalStateCreate]);
  //-----------------------------------------APLICANDO PERMISOS-----------------------------------------------------------
  const setPermisosxVista = storeDv((state) => state.setPermisosxVista);
  const permisosxVista = storeDv((state) => state.permisosxvista);

  const fetchPermisos = async () => {
    await APIs.GetAny('get_permisos_x_vista/' + user_id + '/REQUISICIONES').then((resp: any) => {
      // console.log('--------------------------------', resp);

      setPermisosxVista(resp)
    })
  }
   const [page2, setPage2] = useState<number>(1)
   useEffect(() => {
          searchByFolio();
      }, [page2]);
  return (
    <div className='requisition'>
      <div className='breadcrumbs'>
        <div className='breadcrumbs__container'>
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-receipt"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 17.5v-11" /></svg>
          <small className='title'>Compras</small>
        </div>
        <div className='chevron__breadcrumbs'>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6" /></svg>
        </div>
        <div className='breadcrumbs__container'>
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></svg>
          <small className='title'>Requisición</small>
        </div>
      </div>
      <div className='container__requisition'>

        <div className='row__one' style={{zoom:'80%'}}>
          <div className='row'>
            <div className='col-3 md-col-6 sm-col-12'>
              <Select dataSelects={companiesXUsers} instanceId='empresa' nameSelect={'Empresa'} />
            </div>
            <div className='col-3 md-col-6 sm-col-12'>
              <Select dataSelects={branchOfficeXCompanies} instanceId='sucursal' nameSelect={'Sucursal'} />
            </div>
            <div className='col-3 md-col-6 sm-col-12'>
              <Select dataSelects={areasXBranchOfficesXUsers} instanceId='area' nameSelect={'Area'} />
            </div>
            <div className='col-3 md-col-6 sm-col-12'>
              <div className='select__container'>
                <label className='label__general'>Tipo</label>
                <div className='select-btn__general'>
                  <div className={`select-btn ${selectTypes ? 'active' : ''}`} onClick={openSelectTypes} >
                    <p>{selectedType ? types.find((s: { id: number }) => s.id === selectedType)?.name : types[0].name}</p>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                  </div>
                  <div className={`content ${selectTypes ? 'active' : ''}`} >
                    <ul className={`options ${selectTypes ? 'active' : ''}`} style={{ opacity: selectTypes ? '1' : '0' }}>
                      {types.map((type: any) => (
                        <li key={type.id} onClick={() => handleTypesChange(type)}>
                          {type.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-6 md-col-12 row'>
              <div className='col-6'>
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
                      defaultDate: new Date(new Date().setDate(new Date().getDate() - 30)), // Fecha predeterminada: una semana atrás
                    }}
                    placeholder="Selecciona una fecha"
                  />
                </div>
              </div>

              <div className='col-6'>
                <label className="label__general">Hasta</label>
                <div className="flex gap-4 container_dates__requisition">
                  <Flatpickr
                    className="date"
                    id="fecha-hasta"
                    onChange={(date) => {
                      const endDate = date[0]?.toISOString().split("T")[0] || "";
                      setDates([dates[0], endDate]);
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
            <div className='col-6 md-col-12'>
              <div className='container__checkbox_requisition'>
                <div className='checkbox__requisition'>
                  <label className="checkbox__container_general">
                    <input className='checkbox' type="checkbox" checked={status == 0 ? true : false} onClick={() => handleClick('0')} />
                    <span className="checkmark__general"></span>
                  </label>
                  <p className='text'>Activo</p>
                </div>
                <div className='checkbox__requisition'>
                  <label className="checkbox__container_general">
                    <input className='checkbox' type="checkbox" checked={status == 1 ? true : false} onClick={() => handleClick('1')} />
                    <span className="checkmark__general"></span>
                  </label>
                  <p className='text'>Cancelados</p>
                </div>
                <div className='checkbox__requisition'>
                  <label className="checkbox__container_general">
                    <input className='checkbox' type="checkbox" checked={status == 2 ? true : false} onClick={() => handleClick('2')} />
                    <span className="checkmark__general"></span>
                  </label>
                  <p className='text'>Terminados</p>
                </div>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-4 md-col-6 sm-col-12'>
              <div className='select__container'>
                <label className='label__general'>Serie</label>
                <div className='select-btn__general'>
                  <div className={`select-btn ${selectSeries ? 'active' : ''}`} onClick={openSelectSeries} >
                    <p>{selectedSerie !== null ? series.find((s: { id: number }) => s.id === selectedSerie)?.nombre : 'Selecciona'}</p>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
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
            </div>
            <div className='col-4 md-col-6 sm-col-12'>
              <label className='label__general'>Folio</label>
              <div className='warning__general' style={styleWarningName}><small >Este campo es obligatorio</small></div>
              <input className={`inputs__general ${warningName ? 'warning' : ''}`} type="text" value={invoice} onChange={(e) => setInvoice(e.target.value)} placeholder='Ingresa el nombre' />
            </div>
            <div className='col-2 md-col-6 sm-col-12'>

              <div className='create__requisition_btn-container'>
                <div>
                  <button className='btn__general-purple' onClick={searchByFolio}>Buscar</button>
                </div>
              </div>
            </div>
            <div className='col-2 md-col-6 sm-col-12'>
              <div className='create__requisition_btn-container'>
                <div>
                  <button className='btn__general-purple' onClick={modalCreate}>Crear nueva Requisición</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ModalRequisition />
        <div className='table__requisiciones' style={{zoom:'80%'}}>
          <div>
            {requisitions ? (
              <div className='table__numbers'>
                <p className='text'>Total de requisiciónes</p>
                <div className='quantities_tables'>{requisitions.length}</div>
              </div>
            ) : (
              <p></p>
            )}
          </div>
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
            </div>
          </div>
          {requisitions ? (
            <div className='table__body'>
              {requisitions.map((requisition: any, index: number) => {
                return (
                  <div className='tbody__container' key={index} onClick={() => modalUpdate(requisition)}>
                    <div className='tbody'>
                      <div className='td'>
                        <p className='folio-identifier'>{requisition.serie}-{requisition.folio}-{requisition.anio}</p>
                      </div>
                      <div className='td'>
                        <p>{(requisition.tipo === 0) && 'Manual'}</p>
                        <p>{(requisition.tipo === 1) && 'Dif'}</p>
                        <p>{(requisition.tipo === 2) && 'Automatica'}</p>
                        <p>{(requisition.tipo === 3) && 'Automatica BP'}</p>
                      </div>
                      <div className='td'>
                        <p>{requisition.status == 0 ? <div><p className='active-identifier'>Activo</p></div> : ''}</p>
                        <p>{requisition.status == 1 ? <div><p className='cancel-identifier'>Cancelada</p></div> : ''}</p>
                        <p>{requisition.status == 2 ? <div><p className='active-identifier'>Terminada</p></div> : ''}</p>
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
                      <div className='td'>
                        <p>{requisition.area}</p>
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



      </div>
      <div className='row paginado-container'>
          <div className='col-1'>
            <button className="paginado-btn paginado-btn-prev" onClick={() => setPage2(page2 - 1)} disabled={page2 === 1}>
              ← Anterior
            </button>
          </div>
          <div className='col-10 paginado-info'>
            Página {page2}
          </div>
          <div className='col-1'>
            <button className="paginado-btn paginado-btn-next" onClick={() => setPage2(page2 + 1)}>
              Siguiente →
            </button>
          </div>
        </div>
      {/* <Pagination /> */}
    </div>
  );
};

export default Requisition;
