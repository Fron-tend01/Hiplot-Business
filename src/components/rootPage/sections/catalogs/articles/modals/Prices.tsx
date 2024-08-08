import React, { useEffect, useState } from 'react'
import { storeArticles } from '../../../../../../zustand/Articles'
import { UserGroupsRequests } from '../../../../../../fuctions/UserGroups'
import { RangesRequests } from '../../../../../../fuctions/Ranges'
import { TypeOfPaymentsRequests } from '../../../../../../fuctions/TypeOfPayments'
import useUserStore from '../../../../../../zustand/General'
import { storeModals } from '../../../../../../zustand/Modals'
import History from './Prices/History'
import { useStore } from 'zustand';
import './style/Prices.css'

const Prices: React.FC = () => {
  const userState = useUserStore(state => state.user);
  let user_id = userState.id;

  const setPrices = storeArticles(state => state.setPrices)
  const setModalSub = storeModals(state => state.setModalSub)
  const setHistoryPrices = storeArticles  (state => state.setHistoryPrices)

  const { articleByOne }: any = useStore(storeArticles);

  const { prices } = useStore(storeArticles);

  const {modalSub}: any = useStore(storeModals)

  console.log(articleByOne)

useEffect(() => {

}, [articleByOne])

  const [selects, setSelect] = useState<any[]>([]);
  const { getRanges }: any = RangesRequests();
  const [ranges, setRanges] = useState<any>([])
  const { getTypeOfPayments }: any = TypeOfPaymentsRequests();
  const [typeOfPayment, setTypeOfPayment] = useState<any>([])
  const { getUserGroups }: any = UserGroupsRequests();
  const [userGroup, setUserGroup] = useState<any>([])

  const fetch = async () => {
    try {
      let resultRanges = await getRanges();
      setRanges(resultRanges)
      let resultType = await getTypeOfPayments();
      setTypeOfPayment(resultType)
      let resultUserGroups = await getUserGroups(user_id);
      setUserGroup(resultUserGroups)
      if(articleByOne) {
        setPrices(articleByOne.precios)
      }
        setSelect([
          {
            name: 'Rangos',
            selected: null,
            select: false,
            nameSelected: '',
            data: resultRanges,
          },
          {
            name: 'Tipo de cobro',
            selected: null,
            select: false,
            nameSelected: '',
            data: resultType,
          },
          {
            name: 'Grupo de usuario',
            selected: null,
            select: false,
            nameSelected: '',
            data: resultUserGroups,
          }
        ]);
     
    
    } catch (error) {
      console.error('Error fetching ranges:', error);
    }
  };



  useEffect(() => {
    fetch();
  }, []);

  const setSubModal = storeArticles(state => state.setSubModal);

  const openSelects = (index: any) => {
    setSelect((prev: any) => {
      return prev.map((select: any, i: any) => {
          if (i === index) {
              return { ...select, select: !select.select };
          }
          return select;
      });
  });
  };

  const handleSelectsChange = (select: any,  index: number) => {
    selects[index].selected = select.id;
    selects[index].nameSelected = select.titulo || select.nombre ;
    const newSelected = [...selects];
    newSelected[index] = select.id;
  
    setSelect(newSelected)
    const newOperations = [...selects];
    newOperations[index].select = false;
    setSelect(newOperations);
  };

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
    id_grupo_us: selects[2].selected,
    name_grupo_us: selects[2].nameSelected,
    id_rangos: selects[0].selected,
    name_ranges: selects[0].nameSelected,
    precios: inputs.price,
    precios_fyv: inputs.roundPrice,
    observaciones: inputs.observations,
    id_tc: selects[1].selected,
    name_tc: selects[1].nameSelected,

    
  }
  
  if (Array.isArray(prices)) {
    setPrices([...prices, data])
  } else {
    setPrices([data])
  }


}

const seeHistory = (item: any) => {
  setModalSub('modal_sub_prices')
  setHistoryPrices(item.historico)
}


  return (
    <div>
        <a href="#" className="btn-cerrar-popup__modal_prices_creating_articles" onClick={closeModal} >
          <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
          </a>
        <p className='title__modals'>Precios</p>
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
            {selects.map((select, index) => (
            <div key={index} className="select__container">
              <label className="label__general">{select.name}</label>
              <div className={`select-btn__general`}>
                <div className={`select-btn ${select.select ? 'active' : ''}`} onClick={() => openSelects(index)}>
                  <div className="select__container_title">
                    <p>
                      {select.selected
                        ? select.data.find((s: { id: number }) => s.id === select.selected)?.titulo || select.data.find((s: { id: number }) => s.id === select.selected)?.nombre
                        : 'Selecciona'}
                    </p>
                  </div>
                  <svg className="chevron__down" xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                  </svg>
                </div>
                <div className={`content ${select.select ? 'active' : ''}`}>
                  <ul className={`options ${select.select ? 'active' : ''}`} style={{ opacity: select.select ? '1' : '0' }}>
                    {select.data &&
                      select.data.map((select: any) => (
                        <li key={select.id} onClick={() => handleSelectsChange(select, index)}>
                          {select.titulo || select.nombre}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
            ))}
            <div>
              <label className='label__general'>Observaciones</label>
              <div className='warning__general'><small >Este campo es obligatorio</small></div>
              <input name="observations" className={`inputs__general`} type="text" value={inputs.observations} onChange={handleInputs} placeholder='Ingresa el nombre' />
            </div>
          </div>
       
          <div>
            <button type='button' className='btn__general-purple' onClick={addPrices}>Agregar</button>
          </div>
          <div>
            <div className='article__modal_prices_modal_container' >
              <div>
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
                              <p className=''>Rangos</p>
                          </div>
                          <div className='th'>
                              <p className=''>Tipo de cobro</p>
                          </div>
                          <div className='th'>
                              <p className=''>Grupo de usuario</p>
                          </div>
                          <div className='th'>
                              <p className=''>Observaciones</p>
                          </div>
                        </div>
                      </div>
                      {prices && prices.length > 0 ? (
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
                                              {ranges.find((range: any) => range.id == item.id_rangos)?.titulo}
                                          </div>
                                          <div className='td'>
                                            {typeOfPayment.find((type: any) => type.id == item.id_tc)?.nombre}
                                    
                                          </div>
                                          <div className='td'>
                                            {userGroup.find((userGroup: any) => userGroup.id == item.id_grupo_us)?.nombre}
                                    
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
                </div>
                <div className={`overlay__modal_prices_creating_articles ${modalSub == 'modal_sub_prices' ? 'active' : ''}`}>
                    <div className={`popup__modal_prices_creating_articles ${modalSub == 'modal_sub_prices' ? 'active' : ''}`}>
                        <History />
                    </div>
                </div>
          </div>
        </form>
    </div>
  )
}

export default Prices
