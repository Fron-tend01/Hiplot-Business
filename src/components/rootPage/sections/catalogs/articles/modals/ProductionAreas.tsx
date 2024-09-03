import React, { useEffect, useState } from 'react'
import { storeArticles } from '../../../../../../zustand/Articles'
import { useStore } from 'zustand'
import './style/ProductionAreas.css'
import Empresas_Sucursales from '../../../../Dynamic_Components/Empresas_Sucursales'
import Select from '../../../../Dynamic_Components/Select'
import { areasRequests } from '../../../../../../fuctions/Areas'
import useUserStore from '../../../../../../zustand/General'
import { companiesRequests } from '../../../../../../fuctions/Companies'
import { BranchOfficesRequests } from '../../../../../../fuctions/BranchOffices'
import { useSelectStore } from '../../../../../../zustand/Select'


const ProductionAreas: React.FC = () => {
  const userState = useUserStore(state => state.user);
    let user_id = userState.id


  const setSubModal = storeArticles(state => state.setSubModal)
  
  const setAreas = storeArticles(state => state.setAreas)

  const [dataAreas, setDataAreas] = useState<any>()

  const [companies, setCompanies] = useState<any>([])

  const selectedIds = useSelectStore((state) => state.selectedIds);

  const {getAreas}: any = areasRequests()
  const {getCompaniesXUsers}: any = companiesRequests()
  const [companiesDestination, setCompaniesDestination] = useState<any>([])
  const {getBranchOffices}: any = BranchOfficesRequests()

  const [branchDestination, setBranchDestination] = useState<any>([])



  const fetch = async () => {


    let resultAreas = await getAreas(0, user_id)

    setDataAreas({
      selectName: 'Areas',
      options: 'nombre',
      dataSelect: resultAreas
    })
  }

  useEffect(() => {
    fetch()
  }, [])

  

  const [branchOffices, setBranchOffices] = useState<any>([])

  const { subModal, areas }: any = useStore(storeArticles)

  const [productionAreas, setProductionsAreas] = useState<any>([])


  const addAreas = () => {

    let data = {
      id_area: selectedIds.areas.id,
      name_area: selectedIds.areas.nombre,
      id_sucursal: branchDestination.id,
      name_sucursal: branchDestination.nombre,
      produccion: production,
      predeterminada: predetermined
    }
  
      setAreas([...areas, data])
  
   
  }

  const [production, setProduction] = useState<any>(false)
  const [predetermined, setPredetermined] = useState<any>(false)

  return (
    <div className={`overlay__modal_production-areas_creating_articles ${subModal == 'article-modal_areas-production' ? 'active' : ''}`}>
      <div className={`popup__modal_production-areas_creating_articles ${subModal == 'article-modal_areas-production' ? 'active' : ''}`}>
        <div className='header__modal'>
          <a href="#" className="btn-cerrar-popup__modal_production-areas_creating_articles" >
            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
          </a>
          <p className='title__modals'>Precios</p>
        </div>
        <form className='article__modal_save_modal_production-areas_container'>
          <div className='row'>
            <div className='col-9'>
              <Empresas_Sucursales update={false} empresaDyn={companiesDestination} setEmpresaDyn={setCompaniesDestination} sucursalDyn={branchDestination} setSucursalDyn={setBranchDestination} />
            </div>
            <div className='col-3 d-flex justify-content-around'>
              <div>
                <label className='text'>Produccion</label><br></br>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={production} onChange={(e) => setProduction(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div>
                <label className='text'>Predeterminada</label><br></br>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={predetermined} onChange={(e) => setPredetermined(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-8'>
              <Empresas_Sucursales update={false} empresaDyn={companies} setEmpresaDyn={setCompanies} sucursalDyn={branchOffices} setSucursalDyn={setBranchOffices} />
            </div>
            <div className='col-4'>
              <Select dataSelects={dataAreas} instanceId='areas' />
            </div>
          </div>
          <div className='d-flex justify-content-center mt-4'>
            <div>
              <button type='button' className='btn__general-purple' onClick={addAreas}>Agregar</button>
            </div>
          </div>
          <div className='table__modal_prices_extra_modal_container' >
            <div>
              <div>
              {areas ? (
                <div className='table__numbers'>
                  <p className='text'>Total de precios</p>
                  <div className='quantities_tables'>{areas.length}</div>
                </div>
              ) : (
                  <p className='text'>No hay precios extra</p>
              )}
              </div>
              <div className='table__head'>
                <div className='thead'>
                    <div className='th'>
                        <p className=''>Sucursal</p>
                    </div>
                    <div className='th'>
                        <p className=''>Area</p>
                    </div>
                    <div className='th'>
                        <p className=''>Orden</p>
                    </div>
                    <div className='th'>
                        <p className=''>Agrupacion</p>
                    </div>
                    <div className='th'>
                    </div>
                </div>
              </div>
              {areas?.length > 0 ? (
              <div className='table__body'>
                {areas?.map((item: any, index: any) => (
                    <div className='tbody__container' key={index}>
                        <div className='tbody'>
                            <div className='td'>
                              {item?.name_sucursal}
                            </div>
                            <div className='td'>
                              {item?.name_area}
                            </div>
                            <div className='td'>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={item.produccion} 
                                />
                                <span className="slider"></span>
                              </label>
                            </div>
                            <div className='td'>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={item.predeterminada}
                                />
                                <span className="slider"></span>
                              </label>
                            </div>
                            <div className='td'>
                                <button className='btn__delete_users' type='button' onClick={() => deleteMaxMin(item)}>Eliminar</button>
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
        </form>
      </div>
    </div>
  )
}

export default ProductionAreas
