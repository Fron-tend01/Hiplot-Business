import React, { useEffect, useState } from 'react'
import { storeModals } from '../../../../zustand/Modals'
import { useStore } from 'zustand'
import './styles/ModalProduction.css'
import { storeProduction } from '../../../../zustand/Production'
import APIs from '../../../../services/services/APIs'
import Select from '../../Dynamic_Components/Select'
import useUserStore from '../../../../zustand/General'
import { useSelectStore } from '../../../../zustand/Select'

const ModalProduction: React.FC = () => {
    const userState = useUserStore(state => state.user);
    const user_id = userState.id

    const setModalSub = storeModals(state => state.setModalSub)

    const selectedIds: any = useSelectStore((state) => state.selectedIds);

    const { productionToUpdate }: any = useStore(storeProduction)


    const { modalSub }: any = useStore(storeModals)

    const handleCreateSaleOrder = () => {
        
    }

    const [areas, setAreas] = useState<any>()

    useEffect(() => {
        if (productionToUpdate) {
            productionToUpdate?.conceptos?.forEach((element: any) => {
                setAreas({
                    selectName: 'Areas',
                    options: 'nombre_area',
                    dataSelect: element.areas_produccion
                })
            });
        }
    }, [])


    const getPDF = async () => {
        try {
            await APIs.getProoductionPDF(productionToUpdate.id)
            window.open(`http://hiplot.dyndns.org:84/api_dev/pdf_ov/${productionToUpdate.id}`, '_blank');
        } catch (error) {

        }
    }

    const finishConcept = async () => {

    }

    const sendAreas = async () => {
        let data = {
            id: productionToUpdate.id,
            id_usuario: user_id,
            id_area_nueva: selectedIds?.id_serie?.id
        }

        try {
            await APIs.sendAreaProduction(data)
        } catch (error) {

        }
    }

    const sendConceptoAreas = async () => {
        let data = {
            id: productionToUpdate.id,
            id_usuario: user_id,
            id_area_nueva: selectedIds?.id_serie?.id
        }

        try {
            await APIs.sendAreaConceptoProduction(data)
        } catch (error) {

        }
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
                <form  onSubmit={handleCreateSaleOrder}>
                    <div>
                        <div className="card ">
                            <div className="card-body bg-standar">
                                <h3 className="text">{productionToUpdate.serie}-{productionToUpdate.folio}-{productionToUpdate.anio}</h3>
                                <hr />
                                <div className='row'>
                                    <div className='col-6 md-col-12'>
                                        <span className='text'>Titulo: <b>{productionToUpdate.usuario_crea}</b></span><br />
                                        <span className='text'>Creado por: <b>{productionToUpdate.usuario_crea}</b></span><br />
                                        <span className='text'>Cliente: <b>{productionToUpdate.titulo}</b> </span><br />
                                        <span className='text'>Fecha envio producción: <b>{productionToUpdate.fecha_creacion}</b></span><br />
                                        <span className='text'>Fecha Entrega: <b>{productionToUpdate.fecha_creacion}</b></span><br />
                                        {productionToUpdate.status === 0 ? (
                                            <span className="active-status">Activo</span>
                                        ) : productionToUpdate.status === 1 ? (
                                            <span className="canceled-status">Cancelada</span>
                                        ) : (
                                            productionToUpdate.status === 2 ? (
                                                <span className="end-status">Terminado</span>
                                            ) : (
                                                ""
                                            )
                                        )}
                                    </div>
                                    <div className='col-6 md-col-12'>
                                        <span className='text'>Empresa: <b>{productionToUpdate.empresa}</b></span><br />
                                        <span className='text'>Sucursal de origen: <b>{productionToUpdate.sucursal}</b></span><br />
                                        <span className='text'>Sucursal actual: <b>{productionToUpdate.sucursal}</b></span><br />
                                        <span className='text'>Area: <b>{productionToUpdate.area}</b></span><br />
                                        <span className='text'>Archivo: <b>{productionToUpdate.usuario_crea}</b></span><br />
                                        
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-12'>
                                        <span className='text'>Comentarios: {productionToUpdate.comentarios}</span>
                                    </div>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <div className='d-flex align-items-end'>
                                        <div className='mr-4'>
                                            <button className='btn__general-orange' type='button' onClick={getPDF}>Imprimir ticket</button>
                                        </div>
                                        <div className='d-flex'>
                                            <div className='mr-3'>
                                                <Select dataSelects={areas} instanceId='id_serie' nameSelect='Areas' />
                                            </div>   
                                            <div className='d-flex align-items-end'>
                                                <button className='btn__general-purple' onClick={sendAreas}>Enviar</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='d-flex align-items-end'>
                                        <button className='btn__general-danger' onClick={finishConcept}>Terminar orden</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='table__production_modal'>
                        {productionToUpdate.conceptos ? (
                            <div className='table__numbers'>
                                <p className='text'>Total de articulos</p>
                                <div className='quantities_tables'>{productionToUpdate.conceptos.length}</div>
                            </div>
                        ) : (
                            <p className="text">No hay empresas que mostras</p>
                        )}
                        <div className='table__head'>
                            <div className='thead'>
                                <div className='th'>
                                    <p>Estatus</p>
                                </div>
                                <div className='th'>
                                    <p>Cantidad</p>
                                </div>
                                <div className='th'>
                                    <p>Unidad</p>
                                </div>
                                <div className='th'>
                                    <p>Precio</p>
                                </div>
                                <div className='th'>
                                    <p>Importe</p>
                                </div>
                                <div>
                                    <p>Total</p>
                                </div>
                                <div>
                                    <p>Comentarios</p>
                                </div>
                            </div>
                        </div>
                        {productionToUpdate.conceptos ? (
                            <div className='table__body'>
                                {productionToUpdate.conceptos?.map((article: any, index: number) => {
                                    return (
                                        <div className='tbody__container' key={article.id}>
                                            <div className='tbody'>
                                                <div className='td'>
                                                    <p>{article.codigo}-{article.descripcion}</p>
                                                </div>
                                                <div className='td'>
                                                    <p>$ {article.cantidad}</p>
                                                </div>
                                                <div className='td'>
                                                    <p>{article.name_unidad || article.unidad}</p>
                                                </div>
                                                <div className='td'>
                                                    <p>$ {article.precio_unitario}</p>
                                                </div>
                                                <div className='td'>
                                                    <p>$ {article.monto_descuento}</p>
                                                </div>
                                                <div className='td'>
                                                    <p>$ {article.total_concepto}</p>
                                                </div>
                                                <div className='td'>
                                                    <div>
                                                        <textarea className='inputs__general' placeholder='Descuento' value={article.monto_descuento} onChange={(e) => handleDescountChange(e, index)} />
                                                    </div>
                                                </div>
                                                <div className='td'>
                                                    <div className='d-flex'>
                                                        <div className='mr-3'>
                                                            <Select dataSelects={areas} instanceId='id_serie' nameSelect='Areas' />
                                                        </div>
                                                        <div className='d-flex align-items-end'>
                                                            <button className='btn__general-purple' onClick={sendConceptoAreas}>Enviar</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='td'>
                                                    <div>
                                                        <button className='btn__general-purple' onClick={() => setPersonalizedModal('personalized_modal-quotation-update')}>Terminar conceptos</button>
                                                    </div>
                                                </div>
                                                <div className='td'>
                                                    <div>
                                                        <button className='btn__general-purple' onClick={() => setPersonalizedModal('personalized_modal-quotation-update')}>Enviar concepto a sucursal</button>
                                                    </div>
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
                </form>
            </div>
        </div>
    )
}

export default ModalProduction


