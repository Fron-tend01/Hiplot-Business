import React, { useEffect, useState } from 'react'
import { storeModals } from '../../../../../../../zustand/Modals'
import { useStore } from 'zustand'
import Select from '../../../../../Dynamic_Components/Select'
import TemplatesRequests from '../../../../../../../fuctions/Templates'
import { UnitsRequests } from '../../../../../../../fuctions/Units'
import useUserStore from '../../../../../../../zustand/General'
import { storeDv } from '../../../../../../../zustand/Dynamic_variables'
import './Concepts.css'

const Concepts = () => {
    const userState = useUserStore(state => state.user);
    let user_id = userState.id;

    const setArticulos =  storeDv(state => state.setArticulos)

    const setModalSub = storeModals(state => state.setModalSub)

    const [equivalenceBy, setEquivalenceBy] = useState<any>()

    const [units, setUnits] = useState<any>()

    const { articulos, index }: any = storeDv()
    const { getTemplates }: any = TemplatesRequests()

    const { getUnits }: any = UnitsRequests()

    const fetch = async () => {
        let resutTemplates = await getTemplates(user_id)

        let resutUnits = await getUnits(user_id)

        setEquivalenceBy({
            selectName: 'Equivalencia Por',
            options: 'nombre',
            dataSelect: resutTemplates
        })

        setUnits({
            selectName: 'Unidad',
            options: 'nombre',
            dataSelect: resutUnits
        })

    }

    useEffect(() => {
        fetch()
    }, [])


    const [equivalentAmount, setEquivalentAmount] = useState<string>('')

    const { modalSub }: any = useStore(storeModals)


    const [selectsEquivalence, setSelectsEquivalence] = useState<any>()
    const [selectedEquivalence, setSelectedEquivalence] = useState<any>()

    const openSelectEquivalence = () => {
        setSelectsEquivalence(!selectsEquivalence)
    }

    const handleSelectEquivalenceChange = (item: any) => {
        articulos[index].equivalencia_por = item.nombre;
        setSelectedEquivalence(item.id)
        setSelectsEquivalence(false)
    }

    const [selectsUnits, setSelectsUnits] = useState<any>()
    const [selectedUnit, setSelectedUnit] = useState<any>()

    const openSelectUnits = () => {
        setSelectsUnits(!selectsUnits)
    }

    const handleUnitsChange = (item: any) => {
        articulos[index].unidad = item.nombre;
        setSelectedUnit(item.id)
        setSelectsUnits(false)
    }

    const handleEquivalenceQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setArticulos(prevArticulos => {
            const updatedArticulos = [...prevArticulos];
            updatedArticulos[index].cantidad_equivalente = value;
            return updatedArticulos;
        });
    }

    const handleEquivalenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setArticulos(prevArticulos => {
            const updatedArticulos = [...prevArticulos];
            updatedArticulos[index].equivalencia = value;
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
                    <div className='row'>
                        <div className='col-3'>
                            <div className='select__container'>
                                <label className='label__general'>Equivalencia por</label>
                                <div className='select-btn__general'>
                                    <div className={`select-btn ${selectsEquivalence ? 'active' : ''}`} onClick={openSelectEquivalence}>
                                        <div className='select__container_title'>
                                            <p>{selectedEquivalence ? articulos[index]?.data_equivalencia_por.find((s: { id: number }) => s.id === selectedEquivalence)?.nombre : 'Selecciona'}</p>
                                        </div>
                                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                                    </div>
                                    <div className={`content ${selectsEquivalence ? 'active' : ''}`}>
                                        <ul className={`options ${selectsEquivalence ? 'active' : ''}`} style={{ opacity: selectsEquivalence ? '1' : '0' }}>
                                            {articulos[index]?.data_equivalencia_por.map((item: any) => (
                                                <li key={item.id} onClick={() => handleSelectEquivalenceChange(item)}>
                                                    {item.nombre}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-3'>
                            <div className='select__container'>
                                <label className='label__general'>Unidades</label>
                                <div className='select-btn__general'>
                                    <div className={`select-btn ${selectsUnits ? 'active' : ''}`} onClick={openSelectUnits}>
                                        <div className='select__container_title'>
                                            <p>{selectedUnit ? articulos[index]?.unidades.find((s: { id: number }) => s.id === selectedUnit)?.nombre : 'Selecciona'}</p>
                                        </div>
                                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                                    </div>
                                    <div className={`content ${selectsUnits ? 'active' : ''}`}>
                                        <ul className={`options ${selectsUnits ? 'active' : ''}`} style={{ opacity: selectsUnits ? '1' : '0' }}>
                                            {articulos[index]?.unidades.map((item: any) => (
                                                <li key={item.id} onClick={() => handleUnitsChange(item)}>
                                                    {item.nombre}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-3 md-col-6 sm-col-12'>
                            <label className='label__general'>Cantidad Equivalente</label>
                            <div className='warning__general'><small >Este campo es obligatorio</small></div>
                            <input className={`inputs__general`} type="text" value={articulos[index]?.cantidad_equivalente || ''} onChange={(e) => handleEquivalenceQuantityChange(e)} placeholder='Ingresa el ' />
                        </div>
                        <div className='col-3 md-col-6 sm-col-12'>
                            <label className='label__general'>Equivalencia</label>
                            <div className='warning__general'><small >Este campo es obligatorio</small></div>
                            <input className={`inputs__general`} type="text" value={articulos[index]?.equivalencia || ''} onChange={(e) => handleEquivalenceChange(e)} placeholder='Ingresa el ' />
                        </div>
                        <div>

                        </div>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default Concepts
