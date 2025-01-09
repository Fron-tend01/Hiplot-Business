import React, { useEffect, useState } from 'react'
import { useStore } from 'zustand'
import { storeModals } from '../../../../zustand/Modals'
import { storeDv } from '../../../../zustand/Dynamic_variables'
import { storePersonalized } from '../../../../zustand/Personalized'

const SeeCamposPlantillas: React.FC = () => {
    const setModalSub = storeModals(state => state.setModalSub)
    const { modalSub }: any = useStore(storeModals)
    const setNormalConcepts = storePersonalized((state) => state.setNormalConcepts);
    const { normalConcepts }: any = useStore(storePersonalized)
    const [concepto_tmp, setConcepto_tmp] = useState<any>({})
    //   cont setDataDynamic = storeDv(state  => state.setDataDynamic)
    const { index }: any = useStore(storeDv)
    console.log('normalConceptsCP', normalConcepts);
    
    return (
        <div className={`overlay__personalized_modal ${modalSub === 'see_cp' ? 'active' : ''}`}>
            <div className={`popup__personalized_modal ${modalSub === 'see_cp' ? 'active' : ''}`}>
                <a href="#" className="btn-cerrar-popup__personalized_modal" onClick={() => setModalSub('')}>
                    <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512">
                        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                    </svg>
                </a>
                <p className='title__modals'>Más Campos del Articulo ({normalConcepts[index]?.codigo} -{normalConcepts[index]?.descripcion} )</p>
                <div className='row'>
                    <div className='col-6 md-col-6 sm-col-12'>
                        <label className='label__general'>Coment. factura</label>
                        <input className={`inputs__general`} type="text" value={normalConcepts[index]?.obs_factura} onChange={(e) => null} placeholder='Factura' />
                    </div>
                    <div className='col-6 md-col-6 sm-col-12'>
                        <label className='label__general'>Coment. producción</label>
                        <input className={`inputs__general`} type="text" value={normalConcepts[index]?.obs_produccion} onChange={(e) => null} placeholder='Producción' />
                    </div>
                </div>
                <div className='row'>
                    {normalConcepts[index]?.campos_plantilla?.map((x: any, index: any) => (
                        <div className='col-4 md-col-6 sm-col-12'>
                            {x.tipo != 'txtvisual' ?
                                <div>
                                    <label className='label__general'>{x.nombre_campo_plantilla}</label>
                                    <input
                                        className={`inputs__general`}
                                        type="text"
                                        value={x.valor}
                                        placeholder={x.nombre}
                                    />
                                </div>
                                : ''}
                        </div>
                    ))}
                </div>
                <div className='row'>
                    {normalConcepts[index]?.campos_plantilla?.map((x: any) => (
                        <div className='col-4 md-col-6 sm-col-12'>
                            {x.tipo == 'txtvisual' ?
                                <div className='price_x_unit'>
                                    <p>{x.nombre_campo_plantilla}</p>
                                    <p className='result__price_x_unit'>{x.valor || '0'}</p>
                                </div>
                                : ''}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SeeCamposPlantillas
