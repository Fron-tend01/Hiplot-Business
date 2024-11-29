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

  const { identifier }: any = useStore(storeQuotation);

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


  const [name, setName] = useState<any>()
  const [comments, setComments] = useState<any>()

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



  const client = async () => {


    const data = {
      id_sucursal: quatation.id_sucursal,
      id_usuario: user_id,
      nombre: quatation.rfc
    }

    try {
      const resultClients = await getClients(data)
      setClients({
        selectName: 'Cliente',
        options: 'razon_social',
        dataSelect: resultClients
      })

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

    }
  }, [quatation])


  const selectedIds: any = useSelectStore((state) => state.selectedIds);
  const setSelectedId = useSelectStore((state) => state.setSelectedId);

  const [clients, setClients] = useState<any>()


  const searchUsers = async () => {
    const data = {
      id_sucursal: branch.id,
      id_usuario: user_id,
      nombre: name
    }

    try {
      const resultClients = await getClients(data)
      setClients({
        selectName: 'Cliente',
        options: 'razon_social',
        dataSelect: resultClients
      })


    } catch (error) {

    }

  }



  useEffect(() => {

  }, [selectedIds])

  const seeClient = (client: any) => {
    setClient(client)

    setClientsModal('clients_modal')
  }



  const createQuotation = async () => {

    const filter = normalConcepts.filter((x: any) => x.personalized == false)


    const data = {
      id_sucursal: modal === 'create-modal__qoutation' ? branch.id : quatation.id_sucursal,
      id_cliente: selectedIds.clients.id,
      id_usuario_crea: user_id,
      comentarios: comments,
      conceptos: filter,
      conceptos_pers: personalized,
      conceptos_elim: []
    };

    console.log('DATA QUE SE ENVIA AL BEKEND', data)

    

    try {
      if(modal === 'create-modal__qoutation') {
        const result: any = await APIs.createQuotation(data)
        if(result.error == true) {
          return Swal.fire('Advertencia', result.mensaje, 'warning');
        } else {
          Swal.fire('Cotizacion creada exitosamente', '', 'success');
        }
 
      } else {
        const result: any = await APIs.updateRequisition(data)
        if(result.error == true) {
          return Swal.fire('Advertencia', result.mensaje, 'warning');
        } else {
          Swal.fire('Cotizacion actualizada exitosamente', '', 'success');
        }
       
      }
    } catch (error) {
      Swal.fire('Error', 'Hubo un error al crear la cotizacion', 'error');
    }

  }

  console.log('quatation', quatation)
  const [permisoDescount] = useState<boolean>(true)

  const modalSeeConcepts = (article: any) => {
    setPersonalizedModal('personalized_modal-quotation-update')
    setDataUpdate(article)
  }

  const undoConcepts = (article: any, i: number) => {
    // let filter = customConcepts.filter((_: any, index: number) => index !== i)
    const filterNor = normalConcepts.filter((_: any, index: number) => index !== i)
    if(article.front) {
      article.conceptos.forEach((element: any) => {
        element.id_identifier += identifier + 1
      });
    }
    const data = [...filterNor, ...article.conceptos]
    setNormalConcepts(data)
    setCustomData([...customData, ...article.conceptos]);
  }


  const deleteArticle = (_: any, i: number) => {
    const filter = normalConcepts.filter((_: any, index: number) => index !== i)
    setNormalConcepts(filter)
    setCustomData(filter);
  }


  useEffect(() => {

  }, [dataUpdate])



  const closeModal = () => {
    setModal('')
    if (modal === 'update-modal__qoutation') {
      setComments('')
      setDataQuotation([])
    }

  }

 


  return (
    <div className={`overlay__quotations__modal ${modal === 'create-modal__qoutation' || modal === 'update-modal__qoutation' ? 'active' : ''}`}>
      <div className={`popup__quotations__modal ${modal === 'create-modal__qoutation' || modal === 'update-modal__qoutation' ? 'active' : ''}`}>
        <a href="#" className="btn-cerrar-popup__quotations__modal" onClick={closeModal}>
          <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </a>
        <p className='title__modals'>Crea nueva cotización</p>
        <div className='quotations__modal'>
          {modal == 'create-modal__qoutation' ?
            <div className='row'>
              <div className='row col-12 md-col-12'>
                <div className='col-8 md-col-12'>
                  <Empresas_Sucursales modeUpdate={false} empresaDyn={company} setEmpresaDyn={setCompany} sucursalDyn={branch} setSucursalDyn={setBranch} branch={setBranch} />
                </div>
                <div className='col-4  md-col-6 sm-col-12'>
                  <Select dataSelects={dataSelects} instanceId="select1" nameSelect={'Vendedor'} />
                </div>
              </div>
            </div>
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
            <div className='d-flex align-items-end justify-content-center'>
              <button type='button' className='btn__general-purple' onClick={searchUsers}>Buscar</button>
            </div>
            <div className=''>
              <Select dataSelects={clients} instanceId='clients' nameSelect={'Resultado'} />
            </div>
            <div className='d-flex align-items-end'>
              <button className='btn__general-purple' onClick={seeClient}>ver cliente</button>
            </div>
            <div className='d-flex align-items-end'>
              <button className='btn__general-purple' onClick={() => setPersonalizedModal('personalized_modal-quotation')}>Crear personalizados</button>
            </div>
            <div className='d-flex align-items-end'>
              <button className='btn__general-purple' onClick={() => setModalArticleView('article-view__modal')}>Catalogo</button>
            </div>
          </div>
          <div className='table__quotations_clients_modal'>
            {normalConcepts ? (
              <div className='table__numbers'>
                <p className='text'>Total de articulos</p>
                <div className='quantities_tables'>{normalConcepts.length}</div>
              </div>
            ) : (
              <p className="text">No hay empresas que mostras</p>
            )}
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
                          <div className='td'>
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
