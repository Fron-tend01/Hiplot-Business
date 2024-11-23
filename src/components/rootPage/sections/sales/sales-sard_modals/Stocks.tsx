import React from 'react'
import { storeModals } from '../../../../../zustand/Modals'
import { useStore } from 'zustand'
import './styles/Prices.css'
import { storeSaleCard } from '../../../../../zustand/SaleCard';
import './styles/Stocks.css'

const Stocks = () => {
  const { article }: any = useStore(storeSaleCard)
    const setModalSub = storeModals(state => state.setModalSub)
    const {modalSub}: any = useStore(storeModals)

    const unidad = article?.unidades.find((unidad: any) => unidad.unidad_almacen === true);
    
  return (
    <div className={`overlay__sale-card_modal ${modalSub === 'indications_modal' ? 'active' : ''}`}>
      <div className={`popup__sale-card_modal ${modalSub === 'indications_modal' ? 'active' : ''}`}>
        <a href="#" className="btn-cerrar-popup__sale-card_modal" onClick={() => setModalSub('')}>
          <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </a>
        <p className='title__modals'>Stocks</p>
        <div className='conatiner__create_sale-card' >
        <div className='table__stocks-sale-card' >
            <div>
              {article?.stock ? (
                <div className='table__numbers'>
                  <p className='text'>Total de sucursales</p>
                  <div className='quantities_tables'>{article?.stock?.length}</div>
                </div>
              ) : (
                <p>No hay sucursales</p>
              )}
            </div>
            <div className='table__head'>
              <div className='thead'>
                <div className='th'>
                  <p className=''>Almacen</p>
                </div>
                <div className='th'>
                  <p className=''>Stock</p>
                </div>
              </div>
            </div>
            <div className='table__body'>
              {article?.stock?.map((item: any, index: number) => (
                <div className='tbody__container' key={index}>
                  <div className='tbody'>
                    <div className='td'>
                      {item.nombre}
                    </div>
                    <div className='td'>
                      {item.stock}-{unidad.nombre}
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

export default Stocks