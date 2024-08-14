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
        nombre: 'equivalencia_por',
        type: 0,
        dataSelect: resutTemplates
      },
      {
        nombre: 'unidad',
        type: 0,
        dataSelect: resutTemplates
      },
      {
        nombre: 'id_sucursal',
        type: 0,
        dataSelect: resutTemplates
      },
      {
        nombre: 'aparece_por',
        type: 0,
        dataSelect: resutTemplates
      },
      {
        nombre: 'condicion',
        type: 0,
        dataSelect: resutTemplates
      },
      {
        nombre: 'valor',
        type: 0,
        dataSelect: resutTemplates
      },
      {
        nombre: 'equivalencia_por',
        type: 0,
        dataSelect: resutTemplates
      },
      {
        nombre: 'cantidad_equivalente',
        type: 0,
        dataSelect: resutTemplates
      },
      {
        nombre: 'equivalencia',
        type: 0,
        dataSelect: resutTemplates
      },
      {
        nombre: 'forzar_redondeo',
        type: false,
        dataSelect: resutTemplates
      }   
    ])


    setConditions([
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
    ])
  }        

  useEffect(() => {
    setBySearch({
      selectName: 'Buscar por',
      options: 'name',
      dataSelect: [
        {
          id: 1,
          name: 'Nombre'
        },
        {
          id: 2,
          name: 'Codigo'
        }
      ]
    })
  }, [])

  console.log(articulos)

  const [articles, setArticles] = useState<any>([])

  const [appearsBy, setAppearsBy] = useState<any>()

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAppearsBy(event.target.value);
  };

  const handleconditionsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectdConditions(event.target.value);
  };


  

  const  searchArticles = async () => {
    let data = {
      id: 0,
      activos: true,
      nombre: selectedIds.bysearch.id == 1 ? search : '',
      codigo: selectedIds.bysearch.id == 2 ? search : '',
      familia: 0,
      proveedor: 0,
      materia_prima: 0,
      get_sucursales: false,
      get_proveedores: false,
      get_max_mins: false,
      get_plantilla_data: false,
      get_stock: false,
      get_web: false,
      get_unidades: false,
      id_usuario: user_id
  }
  
    let result = await getArticles(data)
    setArticles([result])

    fetch()
  }

  const modalConcepts = () => {
    setModalSub('modal-additiona-articles-concepts')
  }

  const addAdditionalArticles = (item: any) => {

    let data = {
      unidad: 0 as number,
      id_sucursal: branchOffices.id,
      aparece_por: 0 as number,
      condicion: 0 as number,
      valor: 0 as number,
      equivalencia_por: 0 as number,
      cantidad_equivalente: 0 as number,
      equivalencia: 0 as number,
      forzar_redondeo: false as boolean
    };
    

    setAdditionalArticles([... additionalArticles, item])
  }


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
              <Filtrado_Articulos_Basic campos_ext={extrFields} />
            </div>
          </div>
          <div className='table__modal_articles_modal_articles' >
            <div>
              {articulos ? (
                <div className='table__numbers'>
                    <p className='text'>Total de artículos</p>
                    <div className='quantities_tables'>{articulos.length}</div>
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
            {articulos?.length > 0 ? (
              <div className='table__body'>
                {articulos.map((item: any, index: any) => (
                  <div className='tbody__container' key={index}>
                    <div className='tbody'>
                        <div className='td'>
                            {item.codigo}
                        </div>
                        <div className='td'>
                          {item.descripcion}
                        </div>
                        <div className='td'>
                          <select className='traditional__selector'  onChange={handleSelectChange}>
                              <option value="">Seleccionar</option>
                              {templates?.map((item: any) => (
                                <option key={item.id} value={item.nombre}>
                                  {item.nombre}
                                </option>
                              ))}
                            </select>
                        </div>
                        <div className='td'>
                          <select className='traditional__selector'  onChange={handleconditionsChange}>
                            <option value="">Seleccionar</option>
                            {conditions?.map((item: any) => (
                              <option key={item.id} value={item.name}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className='td'>
                          <input className={`inputs__general`} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Ingresa el nombre' />
                        </div>
                        <div className='td'>
                            <button className='btn__general-purple' type='button' onClick={() => modalConcepts(item)}>Campos</button>
                        </div>
                        <div className='td'>
                            <button className='btn__general-purple' type='button' onClick={() => addAdditionalArticles(item)}>Agregar</button>
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
