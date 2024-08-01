import React, { useEffect, useState, useRef } from 'react';
import { storeFamilies } from '../../../../zustand/Families';
import { storeArticles } from '../../../../zustand/Articles';
import useUserStore from '../../../../zustand/General';
import '../processes/styles/BranchOffices.css'
import './styles/Articles.css';
import ModalCreate from './articles/modalCreate'
import ModalUpdate from './articles/modalUpdate';
import { articleRequests } from '../../../../fuctions/Articles';
import ModalLoading from '../../../loading/ModalLoading';
import { Toaster } from 'sonner'

import { useStore } from 'zustand';

const Articles: React.FC = () => {
  const effectRan = useRef(false)

  // Modales del modal de creaer articulo
  const [code, setCode] = useState<string>('')
  const [selectedFamilie, setSelectedFamilie] = useState<number | null>(null)
  const [modalStateUpdate, setModalStateUpdate] = useState<boolean>(false)

  const [modal, setModal] = useState<boolean>(false)
  
  //Selects
  const [selectFamilies, setSelectFamilies] = useState<boolean>(false)
  const {families, getFamilies}: any = storeFamilies()


  const { getArticles }: any = articleRequests()

  const setArticleByOne = storeArticles((state: any) => state.setArticleByOne);

   const modalLoading = storeArticles((state: any) => state.modalLoading);
    const setModalLoading = storeArticles((state: any) => state.setModalLoading);
  
  
  //zustand 

  const {setArticleToUpdate, warinings, getArticlesInGlobal, articlesInGlobal}: any = useStore(storeArticles);
  const userState = useUserStore(state => state.user);
  let user_id = userState.id
  


  const fuctionGetArticles = async () => {
    let data = {
      id: 0,
      activos: true,
      nombre: '',
      codigo: '',
      familia: 0,
      proveedor: 0,
      materia_prima: 0,
      get_sucursales: false,
      get_proveedores: false,
      get_max_mins: false,
      get_plantilla_data: false,
      get_stock: false,
      get_web: false,
      get_unidades: false
    };

    try {
      await getArticlesInGlobal(data);
    } catch (error) {
      console.log('Error')
    } finally {
   
    }
  }


   
  useEffect(() => { 
 
    !effectRan.current && fuctionGetArticles()
    return () => {
      effectRan.current = true
    }
  }, []);

  

  const openSelectFamilies = () => {
    setSelectFamilies(!selectFamilies)
  }


  const handleFamiliesChange = (familia: any) => {
    setSelectedFamilie(familia.id)
    setSelectFamilies(false)
  }


  const Modal = () => {
    setModal(!modal);
    getFamilies(user_id)

  };

 
 
  // useEffect(() => {
  //   if(warinings == 'maxsmins') {
  //     toast.warning('La sucursal ya tiene un almacen agrada')
  //   }
  // }, [warinings])
 
console.log(warinings)

  const modalUpdate = async (article: any) => {
    let data = {
      id: article.id,
      activos: true,
      nombre: '',
      codigo: '',
      familia: 0,
      proveedor: 0,
      materia_prima: 0,
      get_sucursales: true,
      get_proveedores: true,
      get_max_mins: true,
      get_plantilla_data: true,
      get_precios: true,
      get_variaciones: true,
      get_combinaciones: true,
      get_stock: true,
      get_web: false,
      get_unidades: true
    }

    setModalStateUpdate(true)
    setArticleToUpdate(article);
    try {
      let result = await getArticles(data)
      await setArticleByOne(result[0])
    } catch (error) {
    } finally {
      setModalLoading(false)
    }
    

  }


  const [warningSelectCompany] = useState<boolean>(false)

  const closeModal = () => {
    setModalStateUpdate(false)
    setArticleByOne([])
    setModalLoading(true)
  }
  

  return (
    <div className='articles'>
       <Toaster expand={true} position="top-right" richColors  />
      <div className='container__articles'>
        <div className='row__one'>
          <div>
              <label className='label__general'>Código</label>
              <input className='inputs__general' type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder='Ingresa el código' />
            </div>
          <div>
            <label className='label__general'>Descripción</label>
            <input className='inputs__general' type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder='Ingresa el código' />
          </div>
          <div className='select__container'>
            <label className='label__general'>Familias</label>
            {/* <div className='warning__general' style={styleWarningSelectCompanies}><small >Este campo es obligatorio</small></div> */}
            <div className={`select-btn__general ${warningSelectCompany ? 'warning' : ''}`}>
              <div className={`select-btn ${selectFamilies ? 'active' : ''}`} onClick={openSelectFamilies}>
                <p>{selectedFamilie ? families.find((s: {id: number}) => s.id === selectedFamilie)?.nombre : 'Selecciona'}</p>
                <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
              </div>
              <div className={`content ${selectFamilies ? 'active' : ''}`}>
              <ul className={`options ${selectFamilies ? 'active' : ''}`} style={{ opacity: selectFamilies ? '1' : '0' }}>
                {families && families.map((familia: any) => (
                  <li key={familia.id} onClick={() => handleFamiliesChange(familia)}>
                    {familia.nombre}
                  </li>
                ))}
              </ul>
              </div>
            </div>
          </div>
        </div>
        <div className='row__two'>
          <div className='container__checkbox_articles'>
            <div className='checkbox__articles'>
              <label className="checkbox__container_general">
                <input className='checkbox' type="checkbox"/>
                <span className="checkmark__general"></span>
              </label>
              <p className='text'>Servicio</p>
            </div>
            <div className='checkbox__articles'>
              <label className="checkbox__container_general">
                <input className='checkbox' type="checkbox" />
                <span className="checkmark__general"></span>
              </label>
              <p className='text'>Servicio</p>
            </div>
            <div className='checkbox__articles'>
              <label className="checkbox__container_general">
                <input className='checkbox' type="checkbox"/>
                <span className="checkmark__general"></span>
              </label>
              <p className='text'>Servicio</p>
            </div>
          </div>
        </div>
        <div className='row__three'>
          <div className='create__articles_btn-container'>
            <button className='btn__general-purple' onClick={Modal}>Crear Nuevo Artículo</button>
          </div>
        </div>
        <div className={`overlay__articles ${modal ? 'active' : ''}`}>
          <div className={`popup__articles ${modal ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup_articles" onClick={Modal}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </a>
            <p className='title__modals'>Crear nuevo articulo</p>
              <ModalCreate />
          </div>
        </div>
        <div className='table__articles' >
          <div>
            {articlesInGlobal ? (
              <div>
                <p className='text'>Tus articulos {articlesInGlobal.length}</p>
              </div>
            ) : (
              <p className='text'>No hay empresas</p>
            )}
          </div>
          <div className='table__head'>
            <div className='thead'>
              <div className='th'>
                <p className=''>Código</p>
              </div>
              <div className='th'>
                <p>Descripción</p>
              </div>
              <div className='th'>
              
              </div>
            </div>
          </div>
          {articlesInGlobal ? (
            <div className='table__body'>
              {articlesInGlobal.map((article: any) => {
                // Buscar la empresa correspondiente en companiesData
                return (
                  <div className='tbody__container' key={article.id}>
                    <div className='tbody'>
                      <div className='td'>
                        <p>{article.codigo}</p>
                      </div>
                      <div className='td'>
                        <p>{article.descripcion}</p>
                      </div>
                      <div className='td'>
                        <button className='branchoffice__edit_btn' onClick={() => modalUpdate(article)}>Editar</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className='text'>Cargando datos...</p>
          )}
        </div>
        <div className={`overlay__articles ${modalStateUpdate ? 'active' : ''}`}>
          <div className={`popup__articles ${modalStateUpdate ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup_articles" onClick={closeModal}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </a>
            {modalLoading == true ? (
                <div className='loading_modal'>
                  <p  className='text_article_loading text'>Cargando artículo</p>
                  <ModalLoading />
                </div>
              ) : (
               
                <ModalUpdate />
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Articles;
