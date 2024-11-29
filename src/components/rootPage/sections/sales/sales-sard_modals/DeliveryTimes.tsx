import React, { useEffect, useState } from 'react'
import { storeModals } from '../../../../../zustand/Modals'
import { useStore } from 'zustand';
import { storeSaleCard } from '../../../../../zustand/SaleCard';
import './styles/DeliveryTimes.css'

const DeliveryTimes: React.FC = () => {
  const { article }: any = useStore(storeSaleCard);
  const setModalSub = storeModals(state => state.setModalSub)
  const { modalSub }: any = useStore(storeModals)

  const [client, setClient] = useState<any>()
  const [customer, setCustomer] = useState<any>()


  let filterClient = article?.tiempos_entrega.filter((x: any) => x.tipo == 1);
  let filterCustomer = article?.tiempos_entrega.filter((x: any) => x.tipo == 2);

  useEffect(() => {
    setClient(filterClient)
    setCustomer(filterCustomer)
  }, [])



  return (
    <div className={`overlay__delivery-times_modal-sale-card ${modalSub === 'delivery-time_modal' ? 'active' : ''}`}>
      <div className={`popup__delivery-times_modal-sale-card ${modalSub === 'delivery-time_modal' ? 'active' : ''}`}>
        <a href="#" className="btn-cerrar-popup__delivery-times_modal-sale-card" onClick={() => setModalSub('')}>
          <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </a>
        <p className='title__modals'>Tiempos de entrega</p>
        <div className='conatiner___delivery-times-sale-card' >
          <div className='table__delivery-times-sale-card-client' >
            <div>
              {article?.tiempos_entrega ? (
                <div className='table__numbers'>
                  <p className='text'>Cliente </p>
                </div>
              ) : (
                <p>No hay sucursales</p>
              )}
            </div>
            <div className='table__head'>
              <div className='thead'>
                <div className='th'>
                  <p className=''>Rango</p>
                </div>
                <div className='th'>
                  <p className=''>Día receptcio</p>
                </div>
                <div className='th'>
                  <p className=''>Día entrega</p>
                </div>
              </div>
            </div>
            <div className='table__body'>
              {client?.map((item: any, index: number) => (
                <div className='tbody__container' key={index}>
                  <div className='tbody'>
                    <div className='td'>
                      {`${item.titulo}-${item.sucursal}`}
                    </div>
                    <div className='td'>
                      {item.dia_recepcion} de {item.hora_inicial_recepcion} a {item.hora_final_recepcion}
                    </div>
                    <div className='td'>
                      {item.entrega}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
          <div className='table__delivery-times-sale-card-produc' >
            <div>
              {article?.tiempos_entrega ? (
                <div className='table__numbers'>
                  <p className='text'>Produccion</p>
                </div>
              ) : (
                <p>No hay sucursales</p>
              )}
            </div>
            <div className='table__head'>
              <div className='thead'>
                <div className='th'>
                  <p className=''>Rango</p>
                </div>
                <div className='th'>
                  <p className=''>Día receptcio</p>
                </div>
                <div className='th'>
                  <p className=''>Día entrega</p>
                </div>
              </div>
            </div>
            <div className='table__body'>
              {customer?.map((item: any, index: number) => (
                <div className='tbody__container' key={index}>
                  <div className='tbody'>
                    <div className='td'>
                      {`${item.titulo}-${item.sucursal}`}
                    </div>
                    <div className='td'>
                      {item.dia_recepcion} de {item.hora_inicial_recepcion} a {item.hora_final_recepcion}
                    </div>
                    {item.entrega}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default DeliveryTimes
