import React, { useState } from 'react'
import { storeModals } from '../../../../../../zustand/Modals';
import { v4 as uuidv4 } from 'uuid';

const SeeStock: React.FC<any> = ({concept}: any) => {

      const [modalStateStore, setModalStateStore] = useState<any>(false)
      const setModalSubSub = storeModals(state => state.setModalSubSub)

       const { modalSubSub }: any = storeModals();
    
        const closeModalStore = () => {
            setModalSubSub('')
        }
   


    return (
        <div className={`overlay__modal_stock_orders ${modalSubSub == 'modal__stock' ? 'active' : ''}`}>
            <div className={`popup__modal_stock_orders ${modalSubSub == 'modal__stock' ? 'active' : ''}`}>
                <a href="#" className="btn-cerrar-popup__modal_stock_orders" onClick={closeModalStore}>
                    <svg className='close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                </a>
                <div>
                    <div className='table__modal_create_orders-stocks' >
                        {concept?.stock?.length > 0 ? (
                            <div>
                                <div className='table__head'>
                                    <div className='thead' style={{ gridTemplateColumns: `repeat(${concept?.stock[0]?.equivalencias.length + 1}, 1fr)` }}>
                                        <div className='th'>
                                            <p className=''>Nombre</p>
                                        </div>
                                        {concept?.stock[0]?.equivalencias.map((item: any) => (
                                            <div className="th" key={uuidv4()}>
                                                <p>{item.nombre_unidad}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className='table__body'>
                                        <div className='tbody__container' >
                                            {concept?.stock?.map((x: any) => (
                                                <div key={uuidv4()}>
                                                    <div className='tbody' style={{ gridTemplateColumns: `repeat(${x?.equivalencias.length + 1}, 1fr)` }}>
                                                        <div className="td">
                                                            <p>{x.nombre}</p>
                                                        </div>
                                                        {x?.equivalencias.map((item: any) => (
                                                            <div className="td" >
                                                                <p>{item.cantidad}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <p className='text'>No hay aritculos que mostrar</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SeeStock
