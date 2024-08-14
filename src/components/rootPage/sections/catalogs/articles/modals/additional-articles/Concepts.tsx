import React, { useEffect, useState } from 'react'
import { storeModals } from '../../../../../../../zustand/Modals'
import { useStore } from 'zustand'
import Select from '../../../../../Dynamic_Components/Select'
import TemplatesRequests from '../../../../../../../fuctions/Templates'
import { UnitsRequests } from '../../../../../../../fuctions/Units'
import useUserStore from '../../../../../../../zustand/General'
import './Concepts.css'

const Concepts = () => {
    const userState = useUserStore(state => state.user);
    let user_id = userState.id;

    const setModalSub = storeModals(state => state.setModalSub)

    const [equivalenceBy, setEquivalenceBy] = useState<any>()
    const [units, setUnits] = useState<any>()

    
  const {getTemplates} : any = TemplatesRequests()

  const {getUnits} : any = UnitsRequests()
  
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


    const [equivalentAmount, setEquivalentAmount] =  useState<string>('')

    const {modalSub}:any =  useStore(storeModals)


    return (
    <div className={`overlay__modal-concepts_additional-articles_modal_articles ${modalSub == 'modal-additiona-articles-concepts' ? 'active' : ''}`}>
        <div className={`popup__modal-concepts_additional-articles_modal_articles ${modalSub == 'modal-additiona-articles-concepts' ? 'active' : ''}`}>
            <div className='header__modal'>
            <a href="#" className="btn-cerrar-popup__modal-concepts_additional-articles_modal_articles" onClick={() => setModalSub('')} >
                <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                </a>
            <p className='title__modals'>Campos adicionales de articulos adicionales</p>
            </div>
            <form className='modal-concepts_additional-articles_modal_articles'>
                <div className='row'>
                    <div className='col-3'>
                        <Select dataSelects={equivalenceBy} instanceId='equivalenceBy' />
                    </div>
                    <div className='col-3'>
                        <Select dataSelects={units} instanceId='units' />
                    </div>
                    <div className='col-3 md-col-6 sm-col-12'>
                        <label className='label__general'>Cantidad Equivalente</label>
                        <div className='warning__general'><small >Este campo es obligatorio</small></div>
                        <input className={`inputs__general`} type="text" value={equivalentAmount} onChange={(e) => setEquivalentAmount(e.target.value)} placeholder='Ingresa el ' />
                    </div>
                    <div className='col-3 md-col-6 sm-col-12'>
                        <label className='label__general'>Equivalencia</label>
                        <div className='warning__general'><small >Este campo es obligatorio</small></div>
                        <input className={`inputs__general`} type="text" value={equivalentAmount} onChange={(e) => setEquivalentAmount(e.target.value)} placeholder='Ingresa el ' />
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
