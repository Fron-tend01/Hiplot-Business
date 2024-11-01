import React, { useState } from 'react'
import { storeWarehouseExit } from '../../../../../zustand/WarehouseExit'
import { useStore } from 'zustand';
import './ModalUpdate.css'

const ModalUpdate = ({ conceptsUpdate }: any) => {

    const setModal = storeWarehouseExit(state => state.setModal);
    const { modal } = useStore(storeWarehouseExit)



    return (
        <div className={`overlay__modal-concepts_departures ${modal == 'modal-update__concepts' ? 'active' : ''}`}>
            <div className={`popup__modal-concepts_departures ${modal == 'modal-update__concepts' ? 'active' : ''}`}>
                <a href="#" className="btn-cerrar-popup__modal-concepts_departures" onClick={() => setModal('')}>
                    <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                </a>
                <div className='container__modal-concepts_departures'>
                    <div className='modal-concepts_departures'>
                        <div className='table__modal-concepts_departures'>
                            <div className='d-flex'>
                                <div className='salida__container'>
                                    <p>{conceptsUpdate.serie}-{conceptsUpdate.folio}-{conceptsUpdate.anio}</p>
                                </div>
                                <div className='user'>
                                    <p>{conceptsUpdate.usuario_crea}</p>
                                </div>
                            </div>
                            <div className='row w-full my-4'>
                                <div className='select__container col-4'>
                                    <label className='label__general'>Empresas</label>
                                    <div className='container__text_result'>
                                        <p className='text__result' >{conceptsUpdate.empresa}</p>
                                    </div>
                                </div>
                                <div className='select__container col-4'>
                                    <label className='label__general'>sucursal</label>
                                    <div className='container__text_result'>
                                        <p className='text__result' >{conceptsUpdate.sucursal}</p>
                                    </div>
                                </div>
                                <div className='select__container col-4'>
                                    <label className='label__general'>Fecha creación</label>
                                    <div className='container__text_result'>
                                        <p className='text__result' >{conceptsUpdate.fecha_creacion}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='select__container col-12'>
                                    <label className='label__general'>Comentarios</label>
                                    <div className='container__text_result'>
                                        <p className='text__result' >{conceptsUpdate.comentarios}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div>
                                    {conceptsUpdate.conceptos ? (
                                        <div className='table__numbers'>
                                            <p className='text'>Total de conceptos</p>
                                            <div className='quantities_tables'>{conceptsUpdate.conceptos?.length}</div>
                                        </div>
                                    ) : (
                                        <p className='text'>No hay stock</p>
                                    )}
                                </div>
                                <div className='table__head'>
                                    <div className='thead'>
                                        <div className='th'>
                                            <p className=''>Descripción</p>
                                        </div>
                                        <div className='th'>
                                            <p className=''>Unidad</p>
                                        </div>
                                        <div className='th'>
                                            <p className=''>Cantidad</p>
                                        </div>
                                        <div className='th'>
                                            <p className=''>Comentarios</p>
                                        </div>
                                        <div className='th'>

                                        </div>
                                    </div>
                                </div>
                                {conceptsUpdate.conceptos?.length > 0 ? (
                                    <div className='table__body'>
                                        {conceptsUpdate.conceptos?.map((concept: any, index: any) => (
                                            <div className='tbody__container' key={index}>
                                                <div className='tbody'>
                                                    <div className='td'>
                                                        {`${concept.codigo}-${concept.descripcion}`}
                                                    </div>
                                                    <div className='td'>
                                                        {concept.unidad}
                                                    </div>
                                                    <div className='td'>
                                                        {concept.cantidad}
                                                    </div>
                                                    <div className='td'>
                                                        {concept.descripcion}
                                                    </div>
                                                    <div className='td'>
                                                    </div>
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className='text'>No hay conceptos</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalUpdate
