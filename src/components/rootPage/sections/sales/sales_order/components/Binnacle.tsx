import React, { useState } from 'react'
import './Binancle.css'
import { storeSaleOrder } from '../../../../../../zustand/SalesOrder'
import { useStore } from 'zustand'

const Binnacle: React.FC = () => {

    const { subModal }: any = storeSaleOrder()
    const setSubModal = storeSaleOrder((state) => state.setSubModal);

    const { saleOrdersToUpdate }: any = useStore(storeSaleOrder);

    const [data] = useState([])


    return (
        <div className={`overlay__sale-order__modal_articles-binnacle ${subModal == 'logbook__sales-order-modal' ? 'active' : ''}`}>
            <div className={`popup__sale-order__modal_articles-binnacle ${subModal == 'logbook__sales-order-modal' ? 'active' : ''}`}>
                <div className='header__modal'>
                    <a href="#" className="btn-cerrar-popup__sale-order__modal_articles-binnacle" onClick={() => setSubModal('')} >
                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                    </a>
                    <p className='title__modals'>Bitacora</p>
                </div>
                <div className='sale-order__modal_articles-binnacle' >
                    <div className='table__sales_modal-binnacle'>
                        {data ? (
                            <div className='table__numbers'>
                                <p className='text'>Total de movimientos</p>
                                <div className='quantities_tables'>{data.length}</div>
                            </div>
                        ) : (
                            <p className="text">No hay movimientos</p>
                        )}
                        <div className='table__head'>
                            <div className='thead'>
                                <div className='th'>
                                    <p>Movimiento</p>
                                </div>
                                <div className='th'>
                                    <p>Fecha</p>
                                </div>
                            </div>
                        </div>
                        {data ? (
                            <div className='table__body'>
                                {data?.map((article: any, index: number) => {
                                    return (
                                        <div className='tbody__container' key={article.id}>
                                            <div className='tbody personalized'>
                                                <div className='td'>
                                                    <p>{article.codigo}-{article.descripcion}</p>
                                                </div>
                                                <div className='td'>
                                                    <p>$ {article.cantidad}</p>
                                                </div>
                                            </div>

                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="text">Cargando datos...</p>
                        )}
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Binnacle
