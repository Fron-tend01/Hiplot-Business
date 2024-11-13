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


const ModalCreate = () => {
  const userState = useUserStore(state => state.user);
  let user_id = userState.id
  const setModalArticleView = storeArticleView((state) => state.setModalArticleView);
  const setPersonalizedModal = storePersonalized((state) => state.setPersonalizedModal);
  const setDataQuotation = storeSaleCard(state => state.setDataQuotation)
  const setDataUpdate = storePersonalized((state) => state.setDataUpdate);
  const setModal = storeModals((state) => state.setModal);
  const { modal }: any = useStore(storeModals)
  const setClientsModal = storeQuotation((state) => state.setClientsModal);
  const setClient = storeQuotation((state) => state.setClient);
  const { dataUpdate }: any = useStore(storePersonalized)
  const { dataQuotation, dataPersonalized }: any = useStore(storeSaleCard)
  const { getClients }: any = ClientsRequests()

  const setDataPersonalized = storeSaleCard(state => state.setDataPersonalized);
  

  const [name, setName] = useState<any>()
  const [comments, setComments] = useState<any>()

  const [dataSelects, setDataSelects] = useState<any>([])
  let dataUsers = {
    nombre: '',
    id_usuario: user_id,
    id_usuario_consulta: user_id,
    light: true,
    id_sucursal: 0
  }
  const fetch = async () => {
    let resultUsers = await APIs.getUsers(dataUsers)
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

  const selectedIds = useSelectStore((state) => state.selectedIds);

  const [clients, setClients] = useState<any>()

  const [invoice, setInvoice] = useState<any>()


  const searchUsers = async () => {
    let data = {
      id_sucursal: selectedIds.select1,
      id_usuario: user_id,
      nombre: name
    }

    let resultClients = await getClients(data)
    setClients(resultClients)
  }

  useEffect(() => {

  }, [selectedIds])

  const seeClient = (client: any) => {
    setClient(client)
    setClientsModal('clients_modal')
  }

 

  const createQuotation = async () => {
    const data = {
      id_sucursal: 3,
      id_cliente: selectedIds.select1,
      id_usuario_crea: user_id,
      comentarios: comments,
      conceptos: dataQuotation,
      conceptos_elim: []
    };


    try {
      let result = await APIs.createQuotation(data)
      Swal.fire('Cotizacion creada exitosamente', '', 'success');
    } catch (error) {
      Swal.fire('Error', 'Hubo un error al crear la cotizacion', 'error');
    }

  }


  const [permisoDescount] = useState<boolean>(true)

  const modalSeeConcepts = (article: any) => {
    setPersonalizedModal('personalized_modal-update')
    setDataUpdate(article)

  }

  const undoConcepts = (article: any, i: number) => {
      let filter = dataQuotation.filter((_: any, index: number) => index !== i)
      let data = [...filter, ...article.conceptos]
      setDataQuotation(data)
      setDataPersonalized([...dataPersonalized, ...article.conceptos])
  }

  const deleteArticle = (_: any, i: number) => {
    let filter = dataQuotation.filter((_: any, index: number) => index !== i)
    setDataQuotation(filter)
    setDataPersonalized(filter);
  }


  useEffect(() => {

  },[dataUpdate])

  return (
    <div className={`overlay__quotations__modal ${modal === 'create-modal__qoutation' ? 'active' : ''}`}>
      <div className={`popup__quotations__modal ${modal === 'create-modal__qoutation' ? 'active' : ''}`}>
        <a href="#" className="btn-cerrar-popup__quotations__modal" onClick={() => setModal('')}>
          <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </a>
        <p className='title__modals'>Crea nueva cotización</p>
        <div className='quotations__modal'>
          <div className='row'>
            <div className='row col-12 md-col-12'>
              <div className='col-8 md-col-12'>
                <Empresas_Sucursales modeUpdate={false} />
              </div>
              <div className='col-4  md-col-6 sm-col-12'>
                <Select dataSelects={dataSelects} instanceId="select1" nameSelect={'Vendedor'} />
              </div>
            </div>
          </div>
          <div className='row my-4 w-full'>
            <div className='col-12'>
              <label className='label__general'>Comentarios</label>
              <div className='warning__general'><small >Este campo es obligatorio</small></div>
              <textarea className={`textarea__general`} value={comments} onChange={(e) => setComments(e.target.value)} placeholder='Comentarios'></textarea>
            </div>
          </div>
          <div className='row__three my-4 w-full'>
            <div className=''>
              <label className='label__general'>Nombre</label>
              <div className='warning__general'><small >Este campo es obligatorio</small></div>
              <input className={`inputs__general`} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Ingresa el nombre' />
            </div>
            <div className=''>
              <label className='label__general'>RFC</label>
              <div className='warning__general'><small >Este campo es obligatorio</small></div>
              <input className={`inputs__general`} type="text" value={invoice} onChange={(e) => setInvoice(e.target.value)} placeholder='Ingresa el RFC' />
            </div>
            <div className='d-flex align-items-end justify-content-center'>
              <button type='button' className='btn__general-purple' onClick={searchUsers}>Buscar</button>
            </div>
            <div className=''>
              <Select nameSelect={'Resultado'} />
            </div>
            <div className='d-flex align-items-end'>
              <button className='btn__general-purple' onClick={seeClient}>ver cliente</button>
            </div>
            <div className='d-flex align-items-end'>
              <button className='btn__general-purple' onClick={() => setPersonalizedModal('personalized_modal')}>Crear personalizados</button>
            </div>
            <div className='d-flex align-items-end'>
              <button className='btn__general-purple' onClick={() => setModalArticleView('article-view__modal')}>Catalogo</button>
            </div>
          </div>
          <div className='table__quotations_clients_modal'>
            {dataQuotation ? (
              <div className='table__numbers'>
                <p className='text'>Total de articulos</p>
                <div className='quantities_tables'>{dataQuotation.length}</div>
              </div>
            ) : (
              <p className="text">No hay empresas que mostras</p>
            )}
            <div className='table__head'>
              <div className='thead'>
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
            {dataQuotation ? (
              <div className='table__body'>
                {dataQuotation?.map((article: any, index: number) => {
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
                        <div className='tbody personalized'>
                          <div className='td'>
                            <p>{article.codigo}-{article.nombre}</p>
                          </div>
                          <div className='td'>
                            <p>{article.cantidad}</p>
                          </div>
                          <div className='td'>
                            <p>{article.unidad}</p>
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
                            <p>$ {article.total_price}</p>
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
                            <p>{article.unidad}</p>
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
                            <p>$ {article.total_price}</p>
                          </div>
                          <div className='td'>
                            <button className='add_urgency'>Agregar Urgencia</button>
                          </div>
                          <div className='td'>
                            <button className='btn__general-purple' onClick={() => setPersonalizedModal('personalized_modal-update')}>Conceptos</button>
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

          <div className='row'>
            <div className='col-12 d-flex justify-content-center'>
              <button className='btn__general-purple' onClick={createQuotation}>Crear contizacion</button>
            </div>
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
