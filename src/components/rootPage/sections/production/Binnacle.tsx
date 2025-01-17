import React from 'react'
import './styles/Binancle.css'
import { storeModals } from '../../../../zustand/Modals'
import { storeProduction } from '../../../../zustand/Production'
import { useStore } from 'zustand'

const Binnacle: React.FC = () => {

    const { modalSubSub }: any = storeModals()
    const setModalSubSub = storeModals((state) => state.setModalSubSub);
    const { productionToUpdate }: any = useStore(storeProduction)

    console.log(productionToUpdate)


    return (
        <div className={`overlay__production__modal-binnacle ${modalSubSub == 'logbook__production-modal' ? 'active' : ''}`}>
            <div className={`popup__production__modal-binnacle ${modalSubSub == 'logbook__production-modal' ? 'active' : ''}`}>
                <div className='header__modal'>
                    <a href="#" className="btn-cerrar-popup__production__modal-binnacle" onClick={() => setModalSubSub('')} >
                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                    </a>
                    <p className='title__modals'>Bitacora</p>
                </div>
                <div className='production__modal-binnacle' >
                    <div className='table__production__modal-binnacle-binnacle'>
                        {productionToUpdate?.bitacora ? (
                            <div className='table__numbers'>
                                <p className='text'>Total de movimientos</p>
                                <div className='quantities_tables'>{productionToUpdate.bitacora.length}</div>
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
                                    <p>Usuario</p>
                                </div>
                                <div className='th'>
                                    <p>Fecha</p>
                                </div>
                            </div>
                        </div>
                        {productionToUpdate?.bitacora ? (
                            <div className='table__body'>
                                {productionToUpdate.bitacora?.map((btc: any) => {
                                    return (
                                        <div className='tbody__container' key={btc.id}>
                                            <div className='tbody'>
                                                <div className='td'>
                                                    <p>{btc.mensaje}</p>
                                                </div>
                                                <div className='td'>
                                                    <p>{btc.usuarios}</p>
                                                </div>
                                                <div className='td'>
                                                    <p>{btc.fecha_creacion}</p>
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
