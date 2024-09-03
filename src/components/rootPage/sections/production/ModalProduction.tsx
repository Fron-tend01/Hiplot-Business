import React from 'react'
import { storeModals } from '../../../../zustand/Modals'
import { useStore } from 'zustand'
import './styles/ModalProduction.css'
import { storeProduction } from '../../../../zustand/Production'
import Select from '../../Dynamic_Components/Select'

const ModalProduction: React.FC = () => {

    const setModalSub = storeModals(state => state.setModalSub)

    
    const  {productionToUpdate}: any = useStore(storeProduction)

    console.log(productionToUpdate)

    const {modalSub}: any = useStore(storeModals)

    const handleCreateSaleOrder = () => {

    }

    return (
        <div className={`overlay__production-modal__article-modal ${modalSub == 'production__modal' ? 'active' : ''}`}>
            <div className={`popup__production-modal__article-modal ${modalSub == 'production__modal' ? 'active' : ''}`}>
                <div className='header__modal'>
                    <a href="#" className="btn-cerrar-popup__production-modal__article-modal" onClick={() => setModalSub('')} >
                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                    </a>
                    <p className='title__modals'>Modal de produccion</p>
                </div>
                <form onSubmit={handleCreateSaleOrder}>
                    <div className='row'>
                        <div className='col-4'>
                            <label className='label__general'>Empresa</label>
                            <div className='container__text_result'>
                                <p className='text__result' >{productionToUpdate.empresa}</p>
                            </div>
                        </div>
                        <div className='col-4'>
                            <label className='label__general'>Sucursal</label>
                            <div className='container__text_result'>
                                <p className='text__result' >{productionToUpdate.sucursal}</p>
                            </div>
                        </div>
                        <div className='col-2'>
                            <label className='label__general'>Us. que creo</label>
                            <div className='container__text_result'>
                                <p className='text__result' >{productionToUpdate.usuario_crea}</p>
                            </div>
                        </div>
                        <div className='col-2'>
                            <label className='label__general'>Folio</label>
                            <div className='container__text_result'>
                                <p className='text__result' >{productionToUpdate.folio}</p>
                            </div>
                        </div>
                    </div>
                    <div className='row my-4'>
                        <div className='col-4'>
                            <label className='label__general'>Fecha de creacion</label>
                            <div className='container__text_result'>
                                <p className='text__result' >{productionToUpdate.fecha_creacion}</p>
                            </div>
                        </div>
                        <div className='col-4'>
                            <label className='label__general'>Serie</label>
                            <div className='container__text_result'>
                                <p className='text__result' >{productionToUpdate.serie}</p>
                            </div>
                        </div>
                        <div className='col-2'>
                            <label className='label__general'>Us. que creo</label>
                            <div className='container__text_result'>
                                <p className='text__result' >{productionToUpdate.usuario_crea}</p>
                            </div>
                        </div>
                        <div className='col-2'>
                            <label className='label__general'>Folio</label>
                            <div className='container__text_result'>
                                <p className='text__result' >{productionToUpdate.folio}</p>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-4'>
                            <button>Cancelar</button>
                        </div>
                        <div className='col-4'>
                            <button>Ticket</button>
                        </div>
                        <div className='col-4'>
                            <button>Terminar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ModalProduction
