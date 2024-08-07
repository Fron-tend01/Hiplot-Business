
import React, { useEffect, useState } from 'react'
import { storeArticles } from '../../../../../../zustand/Articles'
import { useStore } from 'zustand'
import './style/DeliveryTimes.css'
import Empresas_Sucursales from '../../../../Dynamic_Components/Empresas_Sucursales'
import Select from '../../../../Dynamic_Components/Select'
import APIs from '../../../../../../services/services/APIs'
import useUserStore from '../../../../../../zustand/General'
import { useSelectStore } from '../../../../../../zustand/Select'


const DeliveryTimes: React.FC = () => {
  const userState = useUserStore(state => state.user);
  let user_id = userState.id
  const setSubModal = storeArticles(state => state.setSubModal)
   const setDeliveryTimes = storeArticles(state => state.setDeliveryTimes)
  const {subModal, deliveryTimes}: any = useStore(storeArticles)

  const selectedIds:any = useSelectStore((state) => state.selectedIds);

  const [update, setUpdate] = useState<boolean>(false)

  const [company, setCompany] = useState<any>([])
  const [branch, setBranch] = useState<any>([])

  const [name, setName] = useState<any>('')
  const [dataSelects, setDataSelects] = useState<any>([])


  const [deliveryTimesView, setDeliveryTimesView] = useState<any>([])

  useEffect(() => {
    if(selectedIds !== null) {
      setDeliveryTimesView([...deliveryTimesView, selectedIds.deliveryTimes])
      setDeliveryTimes([...deliveryTimes, selectedIds.deliveryTimes.id])
    }

  }, [selectedIds])

  console.log(deliveryTimes)

  console.log(deliveryTimes)

  const addDeliveryTimes = async () => {
    let data = {
      nombre: name,
      id_sucursal: company.id,
      id_usuario: user_id
    }
    let result = await APIs.getDeliveryTimes(data)
    setDataSelects( 
      {
      selectName: 'Tiempos de entrega',
      options: 'nombre',
      dataSelect: result}
    )
  }



  const deleteDeliveryTime = (item: any) => {
    setDeliveryTimesView((prev: any) =>
      prev.filter((x: any) => x.id !== item.id)
    );
  };
  return (
    <div className={`overlay__modal_delivery-times_creating_articles ${subModal == 'modal-delivery-times' ? 'active' : ''}`}>
        <div className={`popup__modal_delivery-times_creating_articles ${subModal == 'modal-delivery-times' ? 'active' : ''}`}>
          <a className="btn-cerrar-popup__modal_delivery-times_creating_articles" onClick={() => setSubModal('')}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
          </a>
          <p className='title__modals'>Tiempos de entrega</p>
          <div className='row'>
            <div className='col-8'>
              <Empresas_Sucursales modeUpdate={update} empresaDyn={company} setEmpresaDyn={setCompany} sucursalDyn={branch} setSucursalDyn={setBranch} branch={setBranch} />
            </div>
            <div className='col-3 md-col-6 sm-col-12'>
              <label className='label__general'>Nombre</label>
              <div className='warning__general'><small >Este campo es obligatorio</small></div>
              <input className={`inputs__general`} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Ingresa el nombre' />
            </div>
            <div className='col-1 md-col-6 sm-col-12 d-flex align-items-end' >
              <button className='btn__general-purple' type='button' onClick={addDeliveryTimes}>Buscar</button>
            </div>
          </div>
          <div className='row'>
            <div className='col-12'>
              <Select dataSelects={dataSelects} instanceId="deliveryTimes" />
            </div>
          </div>
          <div>
            <div className='article__modal_delivery-times_table' >
              {deliveryTimesView ? (
              <div className='table__numbers'>
                  <p className='text'>Total de Ordenes</p>
                  <div className='quantities_tables'>{deliveryTimesView.length}</div>
              </div>
              ) : (
                <p className='text'>No hay empresas</p>
              )}
      
              <div className='table__head'>
                <div className='thead'>
                  <div className='th'>
                      <p className=''>Rango</p>
                  </div>
                  <div className='th'>
                      <p className=''>Sucursal</p>
                  </div>
                  <div className='th'>
                      <p className=''>Entrega</p>
                  </div>
                </div>
              </div>
              {deliveryTimesView && deliveryTimesView.length > 0 ? (
                  <div className='table__body'>
                      {deliveryTimesView.map((item: any, index: any) => (
                          <div className='tbody__container' key={index}>
                              <div className='tbody'>
                                  <div className='td'>
                                      {item.rango}
                                  </div>
                                  <div className='td'>
                                    {item.sucursal}
                                  </div>
                                  
                                  <div className='td'>
                                      {`${item.tiempos_entrega_data[0].dia_recepcion} - ${item.tiempos_entrega_data[0].hora_inicial_recepcion} - ${item.tiempos_entrega_data[0].hora_final_recepcion} - ${item.tiempos_entrega_data[0].hora_inicial_recepcion}`}
                                  </div>
                                  <div className='td'>
                                      <button className='btn__general-danger' type='button' onClick={() => deleteDeliveryTime(item)}>Eliminar</button>
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
        </div>
    </div>
  )
}

export default DeliveryTimes
