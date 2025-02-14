import React, { useEffect, useState, useRef } from 'react';
import { storeFamilies } from '../../../../zustand/Families';
import { storeArticles } from '../../../../zustand/Articles';
import useUserStore from '../../../../zustand/General';
import '../processes/styles/BranchOffices.css'
import './styles/Articles.css';
import ModalArticle from './articles/modalArticle'
import { articleRequests } from '../../../../fuctions/Articles';
import { Toaster } from 'sonner'

import { useStore } from 'zustand';
import LoadingInfo from '../../../loading/LoadingInfo';

const Articles: React.FC = () => {
  const effectRan = useRef(false)

  const setModalArticle = storeArticles(state => state.setModalArticle)
  const setImagesArticles = storeArticles(state => state.setImagesArticles)

  // Modales del modal de creaer articulo
  const [code, setCode] = useState<string>('')
  const [selectedFamilie, setSelectedFamilie] = useState<number | null>(null)

  //Selects
  const [selectFamilies, setSelectFamilies] = useState<boolean>(false)
  const { families, getFamilies }: any = storeFamilies()

  const { getArticles }: any = articleRequests()

  const setArticleByOne = storeArticles((state: any) => state.setArticleByOne);

  // const modalLoading = storeArticles((state: any) => state.modalLoading);
  const setModalLoading = storeArticles((state: any) => state.setModalLoading);


  //zustand 
  const { setArticleToUpdate, getArticlesInGlobal, articlesInGlobal }: any = useStore(storeArticles);
  const userState = useUserStore(state => state.user);
  const user_id = userState.id

  const [descripcion, setDescripcion] = useState<string>('')

  const fuctionGetArticles = async () => {
    const data = {
      id: 0,
      activos: true,
      page: 1,
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
    setModalLoading(true)

    try {
      setModalLoading(false)

      await getArticlesInGlobal(data);
    } catch (error) {
      setModalLoading(false)

      console.log('Error')
    } finally {
      setModalLoading(false)

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




  const Modal = async (article: any) => {
    setModalLoading(true)
    const data = {
      id: article.id,
      activos: true,
      nombre: '',
      codigo: '',
      familia: 0,
      proveedor: 0,
      page: 1,
      materia_prima:typeServive ,
      get_sucursales: true,
      get_proveedores: true,
      get_max_mins: true,
      get_plantilla_data: true,
      get_precios: true,
      get_variaciones: true,
      get_combinaciones: true,
      get_tiempos_entrega: true,
      get_areas_produccion: true,
      get_componentes: true,
      get_cargos_minimos: true,
      get_cobros_franquicia: true,
      get_adicional: true,
      get_stock: true,
      get_web: false,
      get_unidades: true
    }

    const data2 = {
      id: article.id,
      activos: true,
      nombre: '',
      codigo: '',
      familia: 0,
      proveedor: 0,
      materia_prima: 0,
      get_imagenes: true
    }

    setModalArticle('articles-modal-update')
    getFamilies(user_id)

    try {

      const result = await getArticles(data)
      const resultImagenes = await getArticles(data2)
      await setArticleByOne(result[0])
      setArticleToUpdate(result[0]);
      setImagesArticles(resultImagenes[0].imagenes)
      setModalLoading(false)
    } catch (error) {
    } finally {
       setModalLoading(false) 
    }

  };

  const [typeServive, setTypeService] = useState<any>(1)
  const [typeActive, setTypeActive] = useState<any>(1)

  const [warningSelectCompany] = useState<boolean>(false)


  const handleTypeArticleChange = async (value: number) => {
    const data = {
      id: 0,
      activos: typeActive,
      nombre: '',
      codigo: '',
      familia: 0,
      proveedor: 0,
      materia_prima: value,
      get_sucursales: false,
      get_proveedores: false,
      get_max_mins: false,
      get_plantilla_data: false,
      get_stock: false,
      get_web: false,
      get_unidades: false,
      page: 1
    };
    setTypeService(value)
    setModalLoading(true)

    try {
      await getArticlesInGlobal(data);
      setModalLoading(false)

    } catch (error) {
      console.log('Error')
      setModalLoading(false)

    }

  }


  const handleActivesArticleChange = async (value: number) => {
    const data = {
      id: 0,
      activos: value,
      nombre: '',
      codigo: '',
      familia: 0,
      proveedor: 0,
      materia_prima: typeServive,
      get_sucursales: false,
      get_proveedores: false,
      get_max_mins: false,
      get_plantilla_data: false,
      get_stock: false,
      get_web: false,
      get_unidades: false,
      page: 1

    };
    setTypeActive(value)
    setModalLoading(true)

    try {
      await getArticlesInGlobal(data);
      setModalLoading(false)

    } catch (error) {
      console.log('Error')
      setModalLoading(false)

    }

  }

  const searchArticle = async () => {
    const data = {
      id: 0,
      activos: typeActive,
      nombre: descripcion == '' ? '' : descripcion,
      codigo: code == '' ? '' : code,
      familia: 0,
      proveedor: 0,
      page: page,
      materia_prima: typeServive,
      get_sucursales: false,
      get_proveedores: false,
      get_max_mins: false,
      get_plantilla_data: false,
      get_stock: false,
      get_web: false,
      get_unidades: false
    };
    setModalLoading(true)

    try {
      await getArticlesInGlobal(data);
      setModalLoading(false)

    } catch (error) {
      console.log('Error')
      setModalLoading(false)

    }
  }
  const [page, setPage] = useState<number>(1)

  useEffect(() => {
    searchArticle();
  }, [page]);
 const modalLoading = storeArticles((state: any) => state.modalLoading);

  return (
    <div className='articles'>
      <Toaster expand={true} position="top-right" richColors />
      <div className='container__articles'>
        <div className='row__one'>
          <div>
            <label className='label__general'>Código</label>
            <input className='inputs__general' type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder='Ingresa el código' />
          </div>
          <div>
            <label className='label__general'>Descripción</label>
            <input className='inputs__general' type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder='Ingresa la descripción' />
          </div>
          <div className='select__container'>
            <label className='label__general'>Familias</label>
            {/* <div className='warning__general' style={styleWarningSelectCompanies}><small >Este campo es obligatorio</small></div> */}
            <div className={`select-btn__general ${warningSelectCompany ? 'warning' : ''}`}>
              <div className={`select-btn ${selectFamilies ? 'active' : ''}`} onClick={openSelectFamilies}>
                <p>{selectedFamilie ? families.find((s: { id: number }) => s.id === selectedFamilie)?.nombre : 'Selecciona'}</p>
                <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
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
          <div className='container__checkbox_articles'>
            <div className='checkbox__articles'>
              <label className="checkbox__container_general">
                <input className='checkbox' type="checkbox" checked={typeServive == 1 ? true : false} onChange={() => handleTypeArticleChange(1)} />
                <span className="checkmark__general"></span>
              </label>
              <p className='text'>Servicio</p>
            </div>
            <div className='checkbox__articles'>
              <label className="checkbox__container_general">
                <input className='checkbox' type="checkbox" checked={typeServive == 0 ? true : false} onChange={() => handleTypeArticleChange(0)} />
                <span className="checkmark__general"></span>
              </label>
              <p className='text'>Materia</p>
            </div>
          </div>
          <div className='container__checkbox_articles'>
            <div className='checkbox__articles'>
              <label className="checkbox__container_general">
                <input className='checkbox' type="checkbox" checked={typeActive == 1 ? true : false} onChange={() => handleActivesArticleChange(1)} />
                <span className="checkmark__general"></span>
              </label>
              <p className='text'>Activos</p>
            </div>
            <div className='checkbox__articles'>
              <label className="checkbox__container_general">
                <input className='checkbox' type="checkbox" checked={typeActive == 0 ? true : false} onChange={() => handleActivesArticleChange(0)} />
                <span className="checkmark__general"></span>
              </label>
              <p className='text'>Desactivados</p>
            </div>
          </div>

        </div>
        <div className='row__three mt-4'>
          <div>
            <button className='btn__general-purple' onClick={searchArticle}>Buscar</button>
          </div>
          <div className='create__articles_btn-container'>
            <button className='btn__general-purple' onClick={() => setModalArticle('articles-modal-create')}>Crear Nuevo Artículo</button>
          </div>
        </div>
        <ModalArticle />
        <div>
          {articlesInGlobal ? (
            <div className='table__numbers'>
              <p className='text'>Total de artículos</p>
              <div className='quantities_tables'>{articlesInGlobal.length}</div>
            </div>
          ) : (
            <p className='text'>No hay empresas</p>
          )}
        </div>
        <div className='table__articles' >
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
                        <button className='branchoffice__edit_btn' onClick={() => Modal(article)}>Editar</button>
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
        <div className='d-flex justify-content-between mt-4'>
          <div>
            <button className='btn__general-purple' onClick={()=>setPage(page-1)} disabled={page==1}>Anterior</button>
          </div>
          <div>
            <button className='btn__general-purple' onClick={()=>setPage(page+1)} >Siguente</button>
          </div>
        </div>
      </div>
      {modalLoading == true ? (
                <LoadingInfo />
            ) :
                ''}
    </div>
  );
};

export default Articles;
