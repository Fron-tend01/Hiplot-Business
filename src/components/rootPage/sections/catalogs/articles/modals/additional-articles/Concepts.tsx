import React, { useEffect, useState } from 'react'
import { storeModals } from '../../../../../../../zustand/Modals'
import { useStore } from 'zustand'
import Select from '../../../../../Dynamic_Components/Select'
import TemplatesRequests from '../../../../../../../fuctions/Templates'
import { UnitsRequests } from '../../../../../../../fuctions/Units'
import useUserStore from '../../../../../../../zustand/General'
import { storeDv } from '../../../../../../../zustand/Dynamic_variables'
import { storeArticles } from '../../../../../../../zustand/Articles'
import './Concepts.css'

const Concepts = () => {
    const userState = useUserStore(state => state.user);
    let user_id = userState.id;

    const setArticulos = storeDv(state => state.setArticulos)

    const setModalSub = storeModals(state => state.setModalSub)

    const setAdditionalArticles = storeArticles(state => state.setAdditionalArticles)

    const { index }: any = useStore(storeDv)
    const { additionalArticles }: any = useStore(storeArticles)


    const { modalSub }: any = useStore(storeModals)


    const [selectsEquivalence, setSelectsEquivalence] = useState<any>()
    const [selectedEquivalence, setSelectedEquivalence] = useState<any>()

    const openSelectEquivalence = () => {
        setSelectsEquivalence(!selectsEquivalence)
    }

    const handleSelectEquivalenceChange = (item: any) => {
        additionalArticles[index].equivalencia_por = item.id;
        setSelectedEquivalence(item.id)
        setSelectsEquivalence(false)
    }

    const [selectsUnits, setSelectsUnits] = useState<any>()
    const [selectedUnit, setSelectedUnit] = useState<any>()

    const openSelectUnits = () => {
        setSelectsUnits(!selectsUnits)
    }

    const handleUnitsChange = (item: any) => {
        additionalArticles[index].unidad = item.id_unidad;
        setSelectedUnit(item.id)
        setSelectsUnits(false)
    }

    const handleEquivalenceQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAdditionalArticles((prevArticulos: any) => {
            const updatedArticulos = [...prevArticulos];
            updatedArticulos[index].cantidad_equivalente = value;
            return updatedArticulos;
        });
    }

    const handleEquivalenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAdditionalArticles((prevArticulos: any) => {
            const updatedArticulos = [...prevArticulos];
            updatedArticulos[index].equivalencia = value;
            return updatedArticulos;
        });
    }

    const handleCheckChange = () => {
        setAdditionalArticles((prevArticulos: any) => {
            const updatedArticulos = [...prevArticulos];
            updatedArticulos[index].forzar_redondeo = !updatedArticulos[index].forzar_redondeo;
            return updatedArticulos;
        });
    }

    return (
        <div className={`overlay__modal-concepts_additional-articles_modal_articles ${modalSub == 'modal-additiona-articles-concepts' ? 'active' : ''}`}>
            <div className={`popup__modal-concepts_additional-articles_modal_articles ${modalSub == 'modal-additiona-articles-concepts' ? 'active' : ''}`}>
                <div className='header__modal'>
                    <a href="#" className="btn-cerrar-popup__modal-concepts_additional-articles_modal_articles" onClick={() => setModalSub('')} >
                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                    </a>
                    <p className='title__modals'>Campos adicionales de articulos adicionales</p>
                </div>
                <form className='modal-concepts_additional-articles_modal_articles'>
                    <div className='row gap-y-4'>
                        <div className='col-6'>
                            <div className='select__container'>
                                <label className='label__general'>Equivalencia por</label>
                                <div className='select-btn__general'>
                                    <div className={`select-btn ${selectsEquivalence ? 'active' : ''}`} onClick={openSelectEquivalence}>
                                        <div className='select__container_title'>
                                            <p>
                                                {selectedEquivalence
                                                    ? additionalArticles[index]?.data_equivalencia_por?.find((s: { id: number }) => s.id === selectedEquivalence)?.nombre
                                                    : additionalArticles[index]?.data_equivalencia_por?.find((x: any) => x.id === additionalArticles[index]?.equivalencia_por)?.nombre}
                                            </p>
                                        </div>
                                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                                    </div>
                                    <div className={`content ${selectsEquivalence ? 'active' : ''}`}>
                                        <ul className={`options ${selectsEquivalence ? 'active' : ''}`} style={{ opacity: selectsEquivalence ? '1' : '0' }}>
                                            {additionalArticles[index]?.data_equivalencia_por?.map((item: any) => (
                                                <li key={item.id} onClick={() => handleSelectEquivalenceChange(item)}>
                                                    {item.nombre}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-6'>
                            <div className='select__container'>
                                <label className='label__general'>Unidades</label>
                                <div className='select-btn__general'>
                                    <div className={`select-btn ${selectsUnits ? 'active' : ''}`} onClick={openSelectUnits}>
                                        <div className='select__container_title'>
                                            <p>
                                                {selectedUnit
                                                    ? additionalArticles[index]?.unidades?.find((s: { id: number }) => s.id === selectedUnit)?.nombre
                                                    : additionalArticles[index]?.unidades?.find((x: any) => x.id_unidad === additionalArticles[index]?.unidad)?.nombre}
                                            </p>
                                        </div>
                                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                                    </div>
                                    <div className={`content ${selectsUnits ? 'active' : ''}`}>
                                        <ul className={`options ${selectsUnits ? 'active' : ''}`} style={{ opacity: selectsUnits ? '1' : '0' }}>
                                            {additionalArticles[index]?.unidades.map((item: any) => (
                                                <li key={item.id} onClick={() => handleUnitsChange(item)}>
                                                    {item.nombre || item.nombre_unidad}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-5 md-col-6 sm-col-12'>
                            <label className='label__general'>Cantidad Equivalente</label>
                            <div className='warning__general'><small >Este campo es obligatorio</small></div>
                            <input className={`inputs__general`} type="text" value={additionalArticles[index]?.cantidad_equivalente || ''} onChange={(e) => handleEquivalenceQuantityChange(e)} placeholder='Ingresa el ' />
                        </div>
                        <div className='col-5 md-col-6 sm-col-12'>
                            <label className='label__general'>Equivalencia</label>
                            <div className='warning__general'><small >Este campo es obligatorio</small></div>
                            <input className={`inputs__general`} type="text" value={additionalArticles[index]?.equivalencia || ''} onChange={(e) => handleEquivalenceChange(e)} placeholder='Ingresa el ' />
                        </div>
                        <div className='col-2'>
                            <p className='text'>Redondeo</p>
                            <label className="switch">
                                <input type="checkbox" checked={additionalArticles[index]?.forzar_redondeo} onChange={handleCheckChange} />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default Concepts
