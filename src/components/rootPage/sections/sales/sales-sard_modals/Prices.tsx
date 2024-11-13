import React from 'react'
import { storeModals } from '../../../../../zustand/Modals'
import { useStore } from 'zustand'
import { storeSaleCard } from '../../../../../zustand/SaleCard'
import './styles/Prices.css'

const Prices = () => {

  const setModalSub = storeModals(state => state.setModalSub)
  const { modalSub }: any = useStore(storeModals)
  const { article }: any = useStore(storeSaleCard)

  return (
    <div className={`overlay__sale-card_modal ${modalSub === 'prices_modal' ? 'active' : ''}`}>
      <div className={`popup__sale-card_modal ${modalSub === 'prices_modal' ? 'active' : ''}`}>
        <a href="#" className="btn-cerrar-popup__sale-card_modal" onClick={() => setModalSub('')}>
          <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </a>
        <p className='title__modals'>Precios</p>
        <div className='conatiner__create_sale-card' >
          <div className='table__branch-offices-sale-card' >
            <div>
              {article?.precios ? (
                <div className='table__numbers'>
                  <p className='text'>Total de sucursales</p>
                  <div className='quantities_tables'>{article?.precios?.length}</div>
                </div>
              ) : (
                <p>No hay sucursales</p>
              )}
            </div>
            <div className='table__head'>
              <div className='thead'>
                <div className='th'>
                  <p className=''>Rangos</p>
                </div>
                <div className='th'>
                  <p className=''>Precios</p>
                </div>
                <div className='th'>
                  <p className=''>Precio Frente y Vuelta</p>
                </div>
                <div className='th'>
                  <p className=''>Ultima Actualización</p>
                </div>
              </div>
            </div>
            <div className='table__body'>
              {article?.precios?.map((item: any, index: number) => (
                <div className='tbody__container' key={index}>
                  <div className='tbody'>
                    <div className='td'>
                      {item.precios_ext[0].rango}
                    </div>
                    <div className='td'>
                      {item.precios}
                    </div>
                    <div className='td'>
                      {item.precios_fyv}
                    </div>
                    <div className='td'>
                    {item.fecha}
                    </div>
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

export default Prices
