import React from 'react'
import { storeModals } from '../../../../../zustand/Modals'
import { useStore } from 'zustand'
import './styles/Prices.css'
import { storeSaleCard } from '../../../../../zustand/SaleCard';

const ToArrive: React.FC = () => {
  const { article }: any = useStore(storeSaleCard)

    const setModalSub = storeModals(state => state.setModalSub)
    const {modalSub}: any = useStore(storeModals)
    
  return (
    <div className={`overlay__sale-card_modal ${modalSub === 'to-arrive_modal' ? 'active' : ''}`}>
      <div className={`popup__sale-card_modal ${modalSub === 'to-arrive_modal' ? 'active' : ''}`}>
        <a href="#" className="btn-cerrar-popup__sale-card_modal" onClick={() => setModalSub('')}>
          <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </a>
        <p className='title__modals'>Indicaciones</p>
        <br />
        <hr />
        <br />
        <div className='conatiner__create_sale-card' >
            <p>{article?.indicaciones}</p>
        </div>
      </div>
    </div>
  )
}

export default ToArrive
