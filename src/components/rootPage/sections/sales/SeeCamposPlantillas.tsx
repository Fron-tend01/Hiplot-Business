import React, { useEffect, useState } from 'react'
import { useStore } from 'zustand'
import { storeModals } from '../../../../zustand/Modals'
import { storeDv } from '../../../../zustand/Dynamic_variables'
import { storePersonalized } from '../../../../zustand/Personalized'
import "./styles/SeeCamposPlantillas.css"
import { storeQuotation } from '../../../../zustand/Quotation'
import { storeSaleOrder } from '../../../../zustand/SalesOrder'

const SeeCamposPlantillas: React.FC<any> = ({typeConcept}) => {
    const setModalSub = storeModals(state => state.setModalSub)
    const { modalSub, modal }: any = useStore(storeModals)
    const setQuotes = storeQuotation((state) => state.setQuotes);
    const setSaleOrdersConcepts = storeSaleOrder((state) => state.setSaleOrdersConcepts);
    const { quotes }: any = useStore(storeQuotation)
    const { saleOrdersConcepts, modalSalesOrder }: any = useStore(storeSaleOrder)
    const [data, setData] = useState<any>([])

    useEffect(() => {
        if(modal === 'create-modal__qoutation' || modal === 'update-modal__qoutation') {
            
            if(typeConcept == 'normal'){
                setData(quotes.normal_concepts)
            } else {
                setData(quotes.personalized_concepts)
            }
            return
        }
        if(modalSalesOrder == 'sale-order__modal' || modalSalesOrder == 'sale-order__modal-update' || modalSalesOrder == 'sale-order__modal_bycot') {
            if(typeConcept == 'normal'){
                setData(saleOrdersConcepts.normal_concepts)
            } else {
                setData(saleOrdersConcepts.personalized_concepts)
            }
        
            return
        }
    }, [modalSub])

    console.log(data)

    //   cont setDataDynamic = storeDv(state  => state.setDataDynamic)
    const { index }: any = useStore(storeDv)
    const ChangeInputs = (key: any, valor: any) => {
        if (!data?.normal_concepts || !Array.isArray(data.normal_concepts)) {
            console.error("Estructura de data incorrecta", data);
            return;
        }
    
        const updatedConcepts = data.normal_concepts.map((concept, i) =>
            i === index ? { ...concept, [key]: valor } : concept
        );
    
        if (modal === 'create-modal__qoutation' || modal === 'update-modal__qoutation') {
            setQuotes({ ...data, normal_concepts: updatedConcepts });
            return;
        }
    
        if (modalSalesOrder === 'sale-order__modal' || modalSalesOrder === 'sale-order__modal-update' || modalSalesOrder === 'sale-order__modal_bycot') {
            setSaleOrdersConcepts({ ...data, normal_concepts: updatedConcepts });
            return;
        }
    };
    
    const changeCP = (valor: any, idx: number) => {
        console.log('idx', idx)
        if (!data?.normal_concepts || !Array.isArray(data.normal_concepts)) {
            console.error("Estructura de data incorrecta", data);
            return;
        }
    
        if (index < 0 || index >= data.normal_concepts.length) {
            console.error("Index fuera de rango:", index);
            return;
        }
    
        if (!data.normal_concepts[index]?.campos_plantilla || !Array.isArray(data.normal_concepts[index].campos_plantilla)) {
            console.error("Estructura incorrecta en campos_plantilla:", data.normal_concepts[index]);
            return;
        }
    
        // Copia profunda del array de `normal_concepts`
        const updatedConcepts = data.normal_concepts.map((concept, i) =>
            i === index
                ? {
                      ...concept,
                      campos_plantilla: concept.campos_plantilla.map((campo, j) =>
                          j === idx ? { ...campo, valor: valor } : campo
                      ),
                  }
                : concept
        );
        setData({ ...data, normal_concepts: updatedConcepts });
        console.log("updatedConcepts[index].campos_plantilla[idx]", updatedConcepts[index].campos_plantilla[idx]);
        if (modal === 'create-modal__qoutation' || modal === 'update-modal__qoutation') {
            setQuotes({normal_concepts: updatedConcepts });
            return;
        }
    
        if (modalSalesOrder === 'sale-order__modal' || modalSalesOrder === 'sale-order__modal-update' || modalSalesOrder === 'sale-order__modal_bycot') {
            setSaleOrdersConcepts({normal_concepts: updatedConcepts });
            return;
        }
        
    };
    


  

    return (
        <div className={`overlay__templates_fields_modal ${modalSub === 'see_cp' || modalSub === 'see_cp-personalized'  ? 'active' : ''}`}>
            <div className={`popup__templates_fields_modal ${modalSub === 'see_cp' ||  modalSub === 'see_cp-personalized' ? 'active' : ''}`}>
                <a href="#" className="btn-cerrar-popup__templates_fields_modal" onClick={() => setModalSub('')}>
                    <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512">
                        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                    </svg>
                </a>
                <p className='title__modals'>Más Campos del Articulo ({data[index]?.codigo} -{data[index]?.descripcion} )</p>
                <div className='sales__order_modal_template-fields'>
                    <div className='row__one'>
                        <div className='row__one'>
                            <div>
                                <label className='label__general'>Coment. factura</label>
                                <input className={`inputs__general`} type="text" value={data[index]?.obs_factura} onChange={(e) => ChangeInputs('obs_factura', e.target.value)} placeholder='Factura' />
                            </div>
                            <div>
                                <label className='label__general'>Coment. producción</label>
                                <input className={`inputs__general`} type="text" value={data[index]?.obs_produccion} onChange={(e) => ChangeInputs('obs_produccion', e.target.value)} placeholder='Producción' />
                            </div>
                        </div>
                        <div className='row__two'>
                            <div className='row__one'>
                                <p>Campos plantilla</p>
                            </div>
                            <div className='row__two'>
                                {data[index]?.campos_plantilla?.map((x: any, idx: any) => (
                                    <div className=''>
                                        {x.tipo_campo_plantilla != 'txtvisual' ?
                                            <div>
                                                <label className='label__general'>{x.nombre_campo_plantilla}</label>
                                                {x.tipo_campo_plantilla == 'texto' ?
                                                    <input
                                                        className={`inputs__general`}
                                                        type="text"
                                                        onChange={(e) => changeCP(e.target.value, idx)}
                                                        value={x.valor}
                                                        placeholder={x.nombre_campo_plantilla}
                                                    />
                                                    :
                                                    <input
                                                        className={`inputs__general`}
                                                        type="number"
                                                        value={x.valor}
                                           
                                                        placeholder={x.nombre_campo_plantilla}
                                                    />

                                                }
                                            </div>
                                            : ''}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='row__three'>
                            {data[index]?.campos_plantilla?.map((x: any) => (
                                <div className=''>
                                    {x.tipo_campo_plantilla == 'txtvisual' ?
                                        <div className='price_x_unit'>
                                            <div>
                                                <p>{x.nombre_campo_plantilla}</p>
                                                <p className='result__price_x_unit'>: ${x.valor || '0'}</p>
                                            </div>
                                        </div>
                                        : ''}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SeeCamposPlantillas
