import React from 'react'

const prices: React.FC = () => {
  return (
    <div className={`overlay__modal_prices_creating_articles`}>
        <div className={`popup__modal_prices_creating_articles`}>
            <a href="#" className="btn-cerrar-popup__modal_prices_creating_articles" >
                <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </a>
            <p className='title__modal_companies'>Sucursal</p>
            <form className='article__modal_save_modal_container'>
                
            </form>
        </div>
    </div>
  )
}

export default prices
