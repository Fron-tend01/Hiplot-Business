import React from 'react'
import { storeModals } from '../../../../../../../zustand/Modals'
import { storeArticles } from '../../../../../../../zustand/Articles'
import './History.css'

const History = () => {

    const setModalSub = storeModals(state => state.setModalSub)

    const {historyPrices}: any = storeArticles()

  return (
    <div>
        <a href="#" className="btn-cerrar-popup__modal_prices_creating_articles" onClick={() => setModalSub('')} >
          <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
          </a>
        <p className='title__modals'>Precios</p>
        <form className='article__modal_create_modal_price_container'>
          
          {historyPrices.historico ? 
          <div className='article__modal_prices-history_modal_container' >
            <div>
              <div className='table__numbers'>
                  <p className='text'>Total de historial</p>
                  <div className='quantities_tables'>{historyPrices.historico.length}</div>
              </div>
            </div>
            <div className='table__head'>
              <div className='thead'>
                <div className='th'>
                    <p className=''>Fecha</p>
                </div>
                <div className='th'>
                    <p className=''>Razon</p>
                </div>
              </div>
            </div>
            {historyPrices.historico?.length > 0 ? (
              <div className='table__body'>
                {historyPrices.historico?.map((item: any, index: any) => (
                  <div className='tbody__container' key={index}>
                      <div className='tbody'>
                          <div className='td'>
                            {item.fecha}
                          </div>
                          <div className='td'>
                            {item.razon}
                          </div>
                      </div>
                  </div>
                ))}
              </div>
              ) : (
                  <p className='text'>No hay máximos y mínimos que mostrar</p>
              )}
          </div> 
          :
          ''
          }
        </form>
    </div>
  )
}

export default History
