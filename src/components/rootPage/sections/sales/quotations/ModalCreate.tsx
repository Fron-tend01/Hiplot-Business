import React, { useEffect, useState } from 'react';
import { storeModals } from '../../../../../zustand/Modals';
import Swal from 'sweetalert2'
import { useStore } from 'zustand';
import './ModalCreate.css';
import Empresas_Sucursales from '../../../Dynamic_Components/Empresas_Sucursales';
import Select from '../../../Dynamic_Components/Select';
import SalesCard from '../SalesCard';
import { storeArticleView } from '../../../../../zustand/ArticleView';
import ArticleViewModal from '../ArticleViewModal';
import { storeSaleCard } from '../../../../../zustand/SaleCard';
import { storePersonalized } from '../../../../../zustand/Personalized';
import Personalized from '../Personalized';
import { useSelectStore } from '../../../../../zustand/Select';
import { ClientsRequests } from '../../../../../fuctions/Clients';
import APIs from '../../../../../services/services/APIs';
import useUserStore from '../../../../../zustand/General';
import { storeQuotation } from '../../../../../zustand/Quotation';
import SeeClient from '../SeeClient';



const ModalCreate: React.FC = () => {
  const userState = useUserStore(state => state.user);
  const user_id = userState.id
  const setModalArticleView = storeArticleView((state) => state.setModalArticleView);
  const setPersonalizedModal = storePersonalized((state) => state.setPersonalizedModal);

  const setNormalConcepts = storePersonalized((state) => state.setNormalConcepts);
  const setCustomData = storePersonalized((state) => state.setCustomData);

  const setQuotesData = storeQuotation(state => state.setQuotesData);

  const { identifier, dataGet }: any = useStore(storeQuotation);
  const setPersonalized = storePersonalized(state => state.setPersonalized)

  const setDataQuotation = storeSaleCard(state => state.setDataQuotation)
  const setDataUpdate = storePersonalized((state) => state.setDataUpdate);
  const setModal = storeModals((state) => state.setModal);
  const { modal }: any = useStore(storeModals)
  const setClientsModal = storeQuotation((state) => state.setClientsModal);
  const setClient = storeQuotation((state) => state.setClient);

  const { dataUpdate, normalConcepts, customConcepts, customData, personalized }: any = useStore(storePersonalized)
  const { quatation }: any = useStore(storeQuotation)
  const { getClients }: any = ClientsRequests()


  const [company, setCompany] = useState<any>([])
  const [branch, setBranch] = useState<any>([])

  const [deleteConcepts, setDeleteConcepts] = useState<any>([])

  const [name, setName] = useState<any>()
  const [comments, setComments] = useState<any>()
  const [title, setTitle] = useState<any>('')

  const [dataSelects, setDataSelects] = useState<any>([])
  const dataUsers = {
    nombre: '',
    id_usuario: user_id,
    id_usuario_consulta: user_id,
    light: true,
    id_sucursal: 0
  }
  const fetch = async () => {
    const resultUsers = await APIs.getUsers(dataUsers)
    setDataSelects(
      {
        selectName: 'Vendedor',
        options: 'nombre',
        dataSelect: resultUsers
      })
  }


  useEffect(() => {
    fetch()
  }, [])

  console.log(personalized)

  const client = async () => {


    const data = {
      id_sucursal: quatation.id_sucursal,
      id_usuario: user_id,
      nombre: quatation.rfc
    }

    try {
      const resultClients = await getClients(data)
      setClients(resultClients)

      setSelectedId('clients', { id: quatation.id_cliente });
    } catch (error) {

    }



  }

  useEffect(() => {
    if (modal === 'update-modal__qoutation') {
      client()

      setCompany({ id: quatation.id_empresa })
      setBranch({ id: quatation.id_sucursal })
      setComments(quatation.comentarios)

      // setNormalConcepts([...normalConcepts, ...quatation.conceptos])
      setNormalConcepts([...quatation.conceptos, ...quatation.conceptos_pers])
      setCustomData([...customConcepts, ...quatation.conceptos]);

      setPersonalized(quatation.conceptos_pers)


    }
  }, [quatation])


  const selectedIds: any = useSelectStore((state) => state.selectedIds);
  const setSelectedId = useSelectStore((state) => state.setSelectedId);

  const [clients, setClients] = useState<any>([])


  const searchUsers = async () => {
    const data = {
      id_sucursal: branch.id,
      id_usuario: user_id,
      nombre: name
    }

    try {
      const resultClients = await getClients(data)
      setClients(resultClients)


    } catch (error) {

    }

  }



  useEffect(() => {

  }, [selectedIds])

  const seeClient = () => {
    setClientsModal('clients_modal')

  }

  const [selectResults, setSelectResults] = useState<boolean>(false);
  const [selectedResult, setSelectedResult] = useState<any>(null);

  const openSelectResults = () => {
    setSelectResults(!selectResults)
  }

  const handleResultsChange = (result: any) => {
    setClient(result)
    setSelectedResult(result);
    setSelectResults(!selectResults)
  };

  console.log('quatation', quatation)


  const createQuotation = async () => {

    const filter = normalConcepts.filter((x: any) => x.personalized !== true)

    filter.forEach((element: any) => {
      element.unidad = element.id_unidad
    });

    if (personalized.length > 0) {
      personalized?.forEach((element: any) => {
        element.conceptos.forEach((x: any) => {
          x.unidad = x.id_unidad
        });
      });
    }





    const data = {
      id: modal === 'create-modal__qoutation' ? 0 : quatation.id,
      id_sucursal: modal === 'create-modal__qoutation' ? branch.id : quatation.id_sucursal,
      id_cliente: modal === 'create-modal__qoutation' ? selectedResult?.id : quatation.id_cliente,
      id_usuario_crea: user_id,
      titulo: title,
      comentarios: comments,
      conceptos: filter,
      conceptos_pers: personalized,
      conceptos_elim: deleteConcepts
    };

    console.log('DATA QUE SE ENVIA AL BEKEND', data)



    try {
      if (modal === 'create-modal__qoutation') {
        const response: any = await APIs.createQuotation(data)
        if (response.error == true) {
          return Swal.fire('Advertencia', response.mensaje, 'warning');
        } else {
          Swal.fire('Cotizacion creada exitosamente', '', 'success');
          let response = await APIs.getQuotation(dataGet);
          setQuotesData(response)
          setCustomData([])
          setModal('')
        }

      } else {
        let response: any = await APIs.updateQuotation(data)
        if (response.error == true) {
          return Swal.fire('Advertencia', response.mensaje, 'warning');
        } else {
          Swal.fire('Cotizacion actualizada exitosamente', '', 'success');
          Swal.fire('Cotizacion creada exitosamente', '', 'success');
          const response = await APIs.getQuotation(dataGet);
          setQuotesData(response)
          setCustomData([])
          setModal('')
        }

      }
    } catch (error) {
      Swal.fire('Error', 'Hubo un error al crear la cotizacion', 'error');
    }

  }


  const [permisoDescount] = useState<boolean>(true)

  const modalSeeConcepts = (article: any) => {
    setPersonalizedModal('personalized_modal-quotation-update')
    setDataUpdate(article)
  }

  const undoConcepts = (article: any, i: number) => {
    // let filter = customConcepts.filter((_: any, index: number) => index !== i)

    let filterPers = normalConcepts.filter((x: any) => x.personalized !== true)

    console.log('filterPers', filterPers)

    article.conceptos.forEach((element: any) => {
      element.id_pers = 0
    });

    const filterNor = normalConcepts.filter((_: any, index: number) => index !== i)
    if (article.front) {
      article.conceptos.forEach((element: any) => {
        element.id_identifier += identifier + 1
      });
    }

    const data = [...filterNor, ...article.conceptos]
    setNormalConcepts(data)
    setCustomData([...filterPers, ...article.conceptos]);
    setPersonalized([])

    console.log('customData', customData)
    console.log('filterNor', filterNor)

    console.log('normalConcepts', normalConcepts)

    console.log('article.conceptos', article.conceptos)
  }


  const deleteArticle = (item: any, i: number) => {
    const filter = normalConcepts.filter((_: any, index: number) => index !== i)
    setNormalConcepts(filter)
    setCustomData(filter);
    setDeleteConcepts([...deleteConcepts, item.id])
  }


  useEffect(() => {

  }, [dataUpdate])



  const closeModal = () => {
    setModal('')
    if (modal === 'update-modal__qoutation') {
      setComments('')
      setCustomData([])
      setDataQuotation([])
    }

  }


  const modalPersonalized = () => {

    if (modal === 'create-modal__qoutation') {
      setPersonalizedModal('personalized_modal-quotation')
    } else {
      setPersonalizedModal('personalized_modal-quotation-update')
    }
  }

  console.log('normalConcepts', normalConcepts)

  return (
    <div className={`overlay__quotations__modal ${modal === 'create-modal__qoutation' || modal === 'update-modal__qoutation' ? 'active' : ''}`}>
      <div className={`popup__quotations__modal ${modal === 'create-modal__qoutation' || modal === 'update-modal__qoutation' ? 'active' : ''}`}>
        <div className='header__modal'>
          <a href="#" className="btn-cerrar-popup__quotations__modal" onClick={closeModal}>
            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512">
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </a>
          {modal === 'create-modal__qoutation' ?
            <p className='title__modals'>Crear cotización</p>
            :
            <p className='title__modals'>Actualizar cotización</p>
          }
        </div>

        <div className='quotations__modal'>
          {modal == 'create-modal__qoutation' ?
            ''
            :
            <div className="card ">
              <div className="card-body bg-standar">
                <h3 className="text">{quatation.serie}-{quatation.folio}-{quatation.anio}</h3>
                <hr />
                <div className='row'>
                  <div className='col-6 md-col-12'>
                    <span className='text'>Creado por: <b>{quatation.usuario_crea}</b></span><br />
                    <span className='text'>Fecha de Creación: <b>{quatation.fecha_creacion}</b></span><br />
                    <span className='text'>Titulo: <b>{quatation.titulo}</b> </span>
                    {quatation.status === 0 ? (
                      <span className="active-status">Activo</span>
                    ) : quatation.status === 1 ? (
                      <span className="canceled-status">Cancelada</span>
                    ) : (
                      quatation.status === 2 ? (
                        <span className="end-status">Terminado</span>
                      ) : (
                        ""
                      )
                    )}

                  </div>
                  <div className='col-6 md-col-12'>
                    <span className='text'>Empresa: <b>{quatation.empresa}</b></span><br />
                    <span className='text'>Sucursal: <b>{quatation.sucursal}</b></span><br />
                    <span className='text'>Area: <b>{quatation.area}</b></span>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-12'>
                    <span className='text'>Comentarios: {quatation.comentarios}</span>

                  </div>
                </div>
              </div>
            </div>
          }
          {modal == 'create-modal__qoutation' ?
            <div className='row__two'>
              <div className='col-12'>
                <p className='title'>Datos de la requisición</p>
              </div>
              <div className='col-12'>
                <div className='row col-12 md-col-12'>
                  <div className='col-8 md-col-12'>
                    <Empresas_Sucursales modeUpdate={false} empresaDyn={company} setEmpresaDyn={setCompany} sucursalDyn={branch} setSucursalDyn={setBranch} branch={setBranch} />
                  </div>
                  <div className='col-4  md-col-6 sm-col-12'>
                    <Select dataSelects={dataSelects} instanceId="select1" nameSelect={'Vendedor'} />
                  </div>
                </div>
              </div>
              <div className='row col-12 my-2 w-full'>
                <div className='col-4'>
                  <label className='label__general'>Título</label>
                  <div className='warning__general'><small >Este campo es obligatorio</small></div>
                  <input className={`inputs__general`} type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Ingresa el título' />
                </div>
                <div className='col-8'>
                  <label className='label__general'>Comentarios</label>
                  <div className='warning__general'><small >Este campo es obligatorio</small></div>
                  <textarea className={`textarea__general`} value={comments} onChange={(e) => setComments(e.target.value)} placeholder='Comentarios'></textarea>
                </div>
              
              </div>
            </div>
            :
            ''
          }
          <div className='row__three my-2 w-full'>
            <div>
              <label className='label__general'>Nombre</label>
              <div className='warning__general'><small >Este campo es obligatorio</small></div>
              <input className={`inputs__general`} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Ingresa el nombre' />
            </div>
            <div className='d-flex align-items-end justify-content-center'>
              <div className='search-icon' onClick={searchUsers}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              </div>

            </div>
            <div>
              <div className='select__container'>
                <label className='label__general'>Resultado</label>
                <div className={`select-btn__general`}>
                  <div className={`select-btn ${selectResults ? 'active' : ''}`} onClick={openSelectResults}>
                    <div className='select__container_title'>
                      <p>{selectedResult ? clients?.find((s: { id: number }) => s.id === selectedResult.id)?.razon_social : 'Selecciona'}</p>
                    </div>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                  </div>
                  <div className={`content ${selectResults ? 'active' : ''}`}>
                    <ul className={`options ${selectResults ? 'active' : ''}`} style={{ opacity: selectResults ? '1' : '0' }}>
                      {clients?.map((result: any) => (
                        <li key={result.id} onClick={() => handleResultsChange(result)}>
                          {result.razon_social}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className='d-flex align-items-end'>
              <button className='btn__general-purple' onClick={seeClient}>ver cliente</button>
            </div>
            <div className='d-flex align-items-end'>
              <button className='btn__general-purple' onClick={modalPersonalized}>Crear personalizados</button>
            </div>
            <div className='d-flex align-items-end' title='Busqueda de articulos'>
              <div className='btn__general-purple-icon'>
                <svg onClick={() => setModalArticleView('article-view__modal')} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="d-flex lucide lucide-package-search"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" /><path d="m7.5 4.27 9 5.15" /><polyline points="3.29 7 12 12 20.71 7" /><line x1="12" x2="12" y1="22" y2="12" /><circle cx="18.5" cy="15.5" r="2.5" /><path d="M20.27 17.27 22 19" /></svg>
              </div>
            </div>
          </div>
          <div className='table__quotations_clients_modal'>
            {/* {normalConcepts ? (
              <div className='table__numbers'>
                <p className='text'>Total de articulos</p>
                <div className='quantities_tables'>{normalConcepts.length}</div>
              </div>
            ) : (
              <p className="text">No hay empresas que mostras</p>
            )} */}
            <div className='table__quotations_modal'>

              <div className='table__head'>
                <div className={`thead `}>
                  <div className='th'>
                    <p>Artículo</p>
                  </div>
                  <div className='th'>
                    <p>Cantidad</p>
                  </div>
                  <div className='th'>
                    <p>Unidad</p>
                  </div>
                  <div className='th'>
                    <p>Desc. monto</p>
                  </div>
                  <div>
                    <p>Total</p>
                  </div>
                </div>
              </div>
              {normalConcepts ? (
                <div className='table__body'>
                  {normalConcepts?.map((article: any, index: number) => {
                    return (
                      <div className='tbody__container' key={article.id}>
                        {article.personalized ?
                          <div className='concept__personalized'>
                            <p>Concepto Perzonalizado</p>
                          </div>
                          :
                          ''
                        }
                        {article.personalized ?
                          <div className={`tbody personalized`}>
                            <div className='td '>
                              <p>{article.codigo}-{article.descripcion}</p>
                            </div>
                            <div className='td'>
                              <p>$ {article.cantidad}</p>
                            </div>
                            <div className='td'>
                              <p>{article.name_unidad}</p>
                            </div>
                            <div className='td'>
                              {permisoDescount ?
                                <div>
                                  <input className='inputs__general' type="text" placeholder='Descuento' />
                                </div>
                                :
                                <p>No permitido</p>
                              }
                            </div>
                            <div className='td'>
                              <p>$ {article.precio_total}</p>
                            </div>
                            <div className='td'>
                              <button className='btn__general-purple' onClick={() => modalSeeConcepts(article)}>Conceptos</button>
                            </div>

                            <div className='td'>
                              <button className='btn__general-orange' onClick={() => undoConcepts(article, index)}>Deshacer</button>
                            </div>
                          </div>
                          :
                          <div className='tbody'>
                            <div className='td'>
                              <p>{article.codigo}-{article.descripcion}</p>
                            </div>
                            <div className='td'>
                              <p>$ {article.cantidad}</p>
                            </div>
                            <div className='td'>
                              <p>{article.name_unidad || article.unidad}</p>
                            </div>
                            <div className='td'>
                              {permisoDescount ?
                                <div>
                                  <input className='inputs__general' type="text" placeholder='Descuento' />
                                </div>
                                :
                                <p>No permitido</p>
                              }
                            </div>
                            <div className='td'>
                              <p>$ {article.precio_total}</p>
                            </div>
                            <div className='td'>
                              <button className='add_urgency'>Agregar Urgencia</button>
                            </div>

                            <div className='td'>
                              <button className='btn__general-danger' onClick={() => deleteArticle(article, index)}>Eliminar</button>
                            </div>
                          </div>
                        }
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text">Cargando datos...</p>
              )}
            </div>
          </div>
          <div className='row mt-4'>
            {modal === 'create-modal__qoutation' ?
              <div className='col-12 d-flex justify-content-center'>
                <button className='btn__general-purple' onClick={createQuotation}>Crear contizacion</button>
              </div>
              :
              <div className='col-12 d-flex justify-content-center'>
                <button className='btn__general-purple' onClick={createQuotation}>Actualizar contizacion</button>
              </div>
            }
          </div>
        </div>
      </div>
      <Personalized />
      <ArticleViewModal />
      <SalesCard />
      <SeeClient />
    </div>
  );
};

export default ModalCreate;
