import React, { useEffect, useState } from 'react'
import useUserStore from '../../../../../../zustand/General'
import { storeArticles } from '../../../../../../zustand/Articles'
import { useStore } from 'zustand'
import { storeModals } from '../../../../../../zustand/Modals'
import Select from '../../../../Dynamic_Components/Select'
import './style/AdditionalArticles.css'
import { useSelectStore } from '../../../../../../zustand/Select'
import { articleRequests } from '../../../../../../fuctions/Articles'
import TemplatesRequests from '../../../../../../fuctions/Templates'
import Concepts from './additional-articles/Concepts'
import { companiesRequests } from '../../../../../../fuctions/Companies'
import { BranchOfficesRequests } from '../../../../../../fuctions/BranchOffices'
import Empresas_Sucursales from '../../../../Dynamic_Components/Empresas_Sucursales'
import Filtrado_Articulos_Basic from '../../../../Dynamic_Components/Filtrado_Articulos_Basic'
import { storeDv } from '../../../../../../zustand/Dynamic_variables'



const AdditionalArticles: React.FC = () => {
  const userState = useUserStore(state => state.user);
  let user_id = userState.id;

  const setSubModal = storeArticles(state => state.setSubModal)

  const setModalSub = storeModals(state => state.setModalSub)

  const setAdditionalArticles = storeArticles(state => state.setAdditionalArticles)
  const { subModal, additionalArticles }: any = useStore(storeArticles)

  const {getTemplates} : any = TemplatesRequests()
  const {getCompaniesXUsers} : any = companiesRequests()
  const {getBranchOffices} : any = BranchOfficesRequests()

  const { getArticles }: any = articleRequests()

  const setArticulos = storeDv(state => state.setArticulos)
  const setIndex = storeDv(state => state.setIndex)
  const {articulos}: any = storeDv()

  const selectedIds = useSelectStore((state) => state.selectedIds);

  const [bySearch, setBySearch] = useState<any>()

  const [search, setSearch] = useState<any>()

  const [companies, setCompanies] = useState<any>()
  const [branchOffices, setBranchOffices] = useState<any>()

  const [conditions, setConditions] = useState<any>()

  const [selectdConditions, setSelectdConditions] = useState<any>()

  const [templates, setTemplates] = useState<any>([])

  const [extrFields, setExtrFields] = useState<any>()

  const fetch = async () => {
    let resutTemplates = await getTemplates(user_id)
    setTemplates(resutTemplates)

    setExtrFields([
      {
        nombre: 'unidad',
        tipo: 0,
        dataSelect: resutTemplates
      },
      {
        nombre: 'id_sucursal',
        tipo: 0
      },
      {
        nombre: 'aparece_por',
        tipo: 0
      },
      {
        nombre: 'data_aparece_por',
        tipo: resutTemplates
      },
      {
        nombre: 'condicion',
        tipo: 0
      },
      {
        nombre: 'data_condicion',
        tipo: [
          {
            id: 1,
            name: 'Menor A'
          },
          {
            id: 2,
            name: 'Menor O igual A'
          },
          {
            id: 3,
            name: 'Mayor A'
          },
          {
            id: 4,
            name: 'Menor O igual A'
          },
          {
            id: 5,
            name: 'Igual A'
          }
        ]
      },
      {
        nombre: 'valor',
        tipo: 0
      },
      {
        nombre: 'data_equivalencia_por',
        tipo: resutTemplates
      },
      {
        nombre: 'equivalencia_por',
        tipo: resutTemplates
      },
      {
        nombre: 'cantidad_equivalente',
        tipo: resutTemplates
      },
      {
        nombre: 'equivalencia',
        tipo: 0,
        dataSelect: resutTemplates
      },
      {
        nombre: 'forzar_redondeo',
        tipo: false,
        dataSelect: resutTemplates
      }   
    ])
  }        

  useEffect(() => {
    fetch()
  }, [])

  useEffect(() => {
    
  }, [])

  console.log(articulos)

  const [articles, setArticles] = useState<any>([])

  const [appearsBy, setAppearsBy] = useState<any>()

  const handleAppearsByChange = (e: React.ChangeEvent<HTMLSelectElement>, index: any) => {
    const value = e.target.value;
    articulos[index].aparece_por = value;
  };

  const handleConditionsChange = (e: React.ChangeEvent<HTMLSelectElement>, index: any) => {
    const value = e.target.value;
    articulos[index].condicion = value;
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>, index: any) => {
    const value = e.target.value;
    setArticulos(prevArticulos => {
      const updatedArticulos = [...prevArticulos]; // Crea una copia del array
      updatedArticulos[index].valor = value; // Actualiza el valor del artículo correspondiente
      return updatedArticulos; // Devuelve el nuevo estados
    });
  };

  

  const modalConcepts = (item: any, index: any) => {
    setIndex(index)
    setModalSub('modal-additiona-articles-concepts')
  }

  const addAdditionalArticles = (item: any) => {

    setAdditionalArticles([... additionalArticles, item])
  }

  console.log(additionalArticles)


  return (
    <div className={`overlay__modal_additional-articles_modal_articles ${subModal == 'modal-additiona-articles' ? 'active' : ''}`}>
      <div className={`popup__modal_additional-articles_modal_articles ${subModal == 'modal-additiona-articles' ? 'active' : ''}`}>
        <div className='header__modal'>
          <a href="#" className="btn-cerrar-popup__modal_additional-articles_modal_articles" onClick={() => setSubModal('')} >
            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </a>
          <p className='title__modals'>Articulos adicionales</p>
        </div>
        <form className='modal_additional-articles_modal_articles'>
          <div className='row'>
            <div className='col-12'>
              <Empresas_Sucursales modeUpdate={false} empresaDyn={companies} sucursalDyn={branchOffices} setEmpresaDyn={setCompanies} setSucursalDyn={setBranchOffices} />
            </div>
          </div>
          <div className='row'>
            <div className='col-12'>
              <Filtrado_Articulos_Basic set_article_local={setAdditionalArticles} get_unidades={true} campos_ext={extrFields} />
            </div>
          </div>
          <div className='table__modal_articles_modal_articles' >
            <div>
              {additionalArticles ? (
                <div className='table__numbers'>
                    <p className='text'>Total de artículos</p>
                    <div className='quantities_tables'>{additionalArticles.length}</div>
                </div>
                ) : (
                    <p className='text'>No hay empresas</p>
                )}
            </div>
            <div className='table__head'>
              <div className='thead'>
                <div className='th'>
                    <p className=''>Codigo</p>
                </div>
                <div className='th'>
                    <p className=''>Descripcion</p>
                </div>
                <div className='th'>
                    <p className=''>Aparece por</p>
                </div>
                <div className='th'>
                    <p className=''>Condicion</p>
                </div>
                <div className='th'>
                   
                </div>
                <div className='th'>
                   
                </div>
              </div>
            </div>
            {additionalArticles?.length > 0 ? (
              <div className='table__body'>
                {additionalArticles.map((item: any, index: any) => (
                  <div className='tbody__container' key={index}>
                    <div className='tbody'>
                        <div className='td'>
                            {item.codigo}
                        </div>
                        <div className='td'>
                          {item.descripcion}
                        </div>
                        <div className='td'>
                          <select className='traditional__selector' onChange={(e) => handleAppearsByChange(e, index)}>
                              {item.data_aparece_por?.map((item: any) => (
                                <option key={item.id} value={item.nombre}>
                                  {item.nombre}
                                </option>
                              ))}
                            </select>
                        </div>
                        <div className='td'>
                          <select className='traditional__selector'  onChange={(e) => handleConditionsChange(e, index)}>
                            {item.data_condicion?.map((item: any) => (
                              <option key={item.id} value={item.name}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className='td'>
                          {/* <input className={`inputs__general`} type="text" value={articulos[index].valor || ''} onChange={(e) => handleValueChange(e, index)} placeholder='Ingresa el valor' /> */}
                        </div>
                        <div className='td'>
                            <button className='btn__general-purple' type='button' onClick={() => modalConcepts(item, index)}>Campos</button>
                        </div>
                        <div className='td'>
                            <button className='btn__general-danger' type='button' onClick={() => addAdditionalArticles(item)}>Eliminar</button>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text'>No hay máximos y mínimos que mostrar</p>
            )}
            <Concepts />
          </div>
          
        </form>
    </div>
  </div>
  )
}

export default AdditionalArticles
