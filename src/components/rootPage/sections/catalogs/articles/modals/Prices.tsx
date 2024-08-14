import React, { useEffect, useState } from 'react'
import { storeArticles } from '../../../../../../zustand/Articles'
import { UserGroupsRequests } from '../../../../../../fuctions/UserGroups'
import { RangesRequests } from '../../../../../../fuctions/Ranges'
import TemplatesRequests from '../../../../../../fuctions/Templates'
import useUserStore from '../../../../../../zustand/General'
import { storeModals } from '../../../../../../zustand/Modals'
import History from './Prices/History'
import { useStore } from 'zustand';
import Select from '../../../../Dynamic_Components/Select'
import { useSelectStore } from '../../../../../../zustand/Select'

import './style/Prices.css'

const Prices: React.FC = () => {
  const userState = useUserStore(state => state.user);
  let user_id = userState.id;

  const selectedIds = useSelectStore((state) => state.selectedIds);

  const setPrices = storeArticles(state => state.setPrices)
  const setModalSub = storeModals(state => state.setModalSub)
  const setHistoryPrices = storeArticles  (state => state.setHistoryPrices)
  const { articleByOne }: any = useStore(storeArticles);
  
  const { prices,subModal } = useStore(storeArticles);

  const {modalSub}: any = useStore(storeModals)

  console.log(articleByOne)

  const [group, setGroup] = useState<any>(false)

useEffect(() => {

}, [articleByOne])

console.log(selectedIds)

  const { getRanges }: any = RangesRequests();
  const [ranges, setRanges] = useState<any>([])
  const { getTemplates }: any = TemplatesRequests();
  const [templates, setTemplates] = useState<any>([])
  const { getUserGroups }: any = UserGroupsRequests();
  const [userGroup, setUserGroup] = useState<any>([])

  const fetch = async () => {
    try {
      let resultRanges = await getRanges();
      setRanges(resultRanges)
      let resultTemplates = await getTemplates(user_id);
      setTemplates(resultTemplates)
      let resultUserGroups = await getUserGroups(user_id);
      setUserGroup(resultUserGroups)
      if(articleByOne) {
        setPrices(articleByOne.precios)
      }
      setDataSelects( 
        {
          selectName: 'Grupos de usuarios',
          options: 'nombre',
          dataSelect: resultUserGroups
        }
      )
      setSelectRanges(
         {
          selectName: 'Rangos',
          options: 'titulo',
          dataSelect: resultRanges
        }
      )
      setSelectTemplates(
        {
          selectName: 'Plantillas',
          options: 'nombre',
          dataSelect: resultTemplates
        }
      )
     
    
    } catch (error) {
      console.error('Error fetching ranges:', error);
    }
  };

  const [dataSelects, setDataSelects] = useState<any>([])
  const [selectRanges, setSelectRanges] = useState<any>([])
  const [selectTemplates, setSelectTemplates] = useState<any>([])

  const [order, setOrder] = useState<any>()

  useEffect(() => {
    fetch();

  }, []);

  const setSubModal = storeArticles(state => state.setSubModal);



  const closeModal = () => {
    setSubModal('');
  };

  const [inputs, setInputs] = useState<any>({
    price: null,
    roundPrice: null,
    observations: '',
  });

const handleInputs = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = event.target;
  setInputs((prevInputs: any) => ({
    ...prevInputs,
    [name]: name === 'price' || name === 'roundPrice' ? Number(value) : value,
  }));
};

const addPrices = () => {
  let data = {
    id_grupo_us: selectedIds.grouspusers.id,
    name_grupo_us: selectedIds.grouspusers.nombre,
    precios: inputs.price,
    precios_fyv: inputs.roundPrice,
    observaciones: inputs.observations,
    precios_ext: additionalsPrices,
    precios_ext_elim: []
    
  }
  
  if (Array.isArray(prices)) {
    setPrices([...prices, data])
  } else {
    setPrices([data])
  }
}

const seeHistory = (item: any) => {
  setModalSub('modal_sub_prices')
  setHistoryPrices(item)
}

const deleteMaxMin = () => {
  
}



const [additionalsPrices, setAdditionalsPrices] =  useState<any>([])



const additionalPrices  = () => {
  let data = {
    id_rangos: selectedIds.ranges.id,
    name_ranges: selectedIds.ranges.titulo,
    id_articulos_precios: null,
    variable_pc: selectedIds.templates.id,
    name_variable_pc: selectedIds.templates.nombre,
    orden: order,
    agrupar: group,
    name_group: selectedIds.templates.id,
  };
  setAdditionalsPrices([...additionalsPrices, data])
}



  return (
    <div className={`overlay__modal_prices_creating_articles ${subModal == 'modal-prices' ? 'active' : ''}`}>
      <div className={`popup__modal_prices_creating_articles ${subModal == 'modal-prices' ? 'active' : ''}`}>
        <div className='header__modal'>
          <a href="#" className="btn-cerrar-popup__modal_prices_creating_articles" onClick={closeModal} >
            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </a>
          <p className='title__modals'>Precios</p>
        </div>
        <form className='article__modal_create_modal_price_container'>
          <div className='row__one'>
            <div>
              <label className='label__general'>Precio</label>
              <div className='warning__general'><small >Este campo es obligatorio</small></div>
              <input name="price" className={`inputs__general`} type="number" value={inputs.price} onChange={handleInputs} placeholder='Ingresa el precio' />
            </div>
            <div>
              <label className='label__general'>Precio de ida y  vuelta</label>
              <div className='warning__general'><small >Este campo es obligatorio</small></div>
              <input name="roundPrice" className={`inputs__general`} type="number" value={inputs.roundPrice} onChange={handleInputs} placeholder='precio ida y vuelta' />
            </div>
            <div>
              <Select dataSelects={dataSelects} instanceId="grouspusers"/>
            </div>
            <div>
              <label className='label__general'>Observaciones</label>
              <div className='warning__general'><small >Este campo es obligatorio</small></div>
              <input name="observations" className={`inputs__general`} type="text" value={inputs.observations} onChange={handleInputs} placeholder='Ingresa el nombre' />
            </div>
          
          </div>
          <div className='row'>
            <div className='col-12 title__add_prices'>
              <p>Agregar precios</p>
            </div>
            <div className='row col-12'>
              <div className='col-6'>
                <Select dataSelects={selectRanges} instanceId="ranges" />
              </div>
              <div className='col-6'>
                <Select dataSelects={selectTemplates} instanceId="templates" />
              </div>
              <div className='row col-12'>
                <div className='col-8'>
                  <label className='label__general'>Orden</label>
                  <input name="price" className={`inputs__general`} value={order} onChange={(e) => setOrder(e.target.value)} placeholder='Ingresa el orden' />  
                </div>
                <div className='col-2 h-full'>
                  <label className='label__general'>Agrupacion</label>
                  <div>
                    <label className="switch">
                      <input type="checkbox" checked={group} onChange={(e) => setGroup(e.target.checked)} />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
                <div className='col-2 d-flex justify-content-center align-items-end'>
                  <button type='button' className='btn__general-purple' onClick={additionalPrices}>Agregar</button>
                </div>
              </div>
            </div>
          </div>
          <div className='table__modal_prices_extra_modal_container' >
            <div>
              <div>
              {additionalsPrices ? (
                <div className='table__numbers'>
                  <p className='text'>Total de precios</p>
                  <div className='quantities_tables'>{additionalsPrices.length}</div>
                </div>
              ) : (
                  <p className='text'>No hay precios extra</p>
              )}
              </div>
              <div className='table__head'>
                <div className='thead'>
                    <div className='th'>
                        <p className=''>Rangos</p>
                    </div>
                    <div className='th'>
                        <p className=''>Cantidad</p>
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
              {additionalsPrices && additionalsPrices.length > 0 ? (
              <div className='table__body'>
                {additionalsPrices.map((item: any, index: any) => (
                    <div className='tbody__container' key={index}>
                        <div className='tbody'>
                            <div className='td'>
                              {item?.name_ranges}
                            </div>
                            <div className='td'>
                              {item?.orden}
                            </div>
                            <div className='td'>
                              {item?.name_group}
                            </div>
                            <div className='td'>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={item.agrupar}
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
          <div>
            <button type='button' className='btn__general-purple' onClick={addPrices}>Agregar</button>
          </div>
          <div className='article__modal_prices_modal_container' >
            <div>
              {prices ? (
                <div className='table__numbers'>
                    <p className='text'>Total de Ordenes</p>
                    <div className='quantities_tables'>{prices.length}</div>
                </div>
                ) : (
                    <p className='text'>No hay empresas</p>
                )}
            </div>
            <div className='table__head'>
              <div className='thead'>
                <div className='th'>
                    <p className=''>Precio</p>
                </div>
                <div className='th'>
                    <p className=''>Precio ida y vuelta</p>
                </div>
                <div className='th'>
                    <p className=''>Grupo de usuario</p>
                </div>
                <div className='th'>
                    <p className=''>Observaciones</p>
                </div>
                <div className='th'>
                   
                </div>
                <div className='th'>
                   
                   </div>
              </div>
            </div>
            {prices?.length > 0 ? (
              <div className='table__body'>
                {prices.map((item: any, index: any) => (
                  <div className='tbody__container' key={index}>
                    <div className='tbody'>
                        <div className='td'>
                            {item.precios}
                        </div>
                        <div className='td'>
                          {item.precios_fyv}
                        </div>
                        <div className='td'>
                          {item.name_grupo_us}
                        </div>
                        <div className='td'>
                          {item.observaciones}
                        </div>
                        <div className='td'>
                            <button className='btn__general-purple' type='button' onClick={() => seeHistory(item)}>Historial</button>
                        </div>
                        <div className='td'>
                            <button className='btn__general-danger' type='button' onClick={() => deleteMaxMin(item)}>Eliminar</button>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text'>No hay máximos y mínimos que mostrar</p>
            )}
          </div>
          <div className={`overlay__modal_prices_creating_articles ${modalSub == 'modal_sub_prices' ? 'active' : ''}`}>
              <div className={`popup__modal_prices_creating_articles ${modalSub == 'modal_sub_prices' ? 'active' : ''}`}>
                  <History />
              </div>
          </div>
        </form>
    </div>
  </div>
  )
}

export default Prices
