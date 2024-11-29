import React, { useEffect, useState } from 'react'
import { storeArticles } from '../../../../../../zustand/Articles'
import APIs from '../../../../../../services/services/APIs'
import { useStore } from 'zustand'
import './style/Combinations.css'


const Combinations: React.FC = () => {
    const setSubModal = storeArticles(state => state.setSubModal)
    const setCombinations = storeArticles(state => state.setCombinations)
    const setDeleteCombinations = storeArticles(state => state.setDeleteCombinations)
    const {subModal, combinations, deleteCombinations, articleByOne}: any  = useStore(storeArticles)

    const [modalCharacteristics, setModalCharacteristics] = useState<any>('')

    const [combinationsData, setCombinationsData] = useState<any>([])

    const fetch = async () => {
        let resultCombinations = await APIs.getCombinations()
        setCombinationsData(resultCombinations)

        if (articleByOne) {
            const ids = [];

            for (const combination of articleByOne.combinaciones) {
                ids.push(combination.id);
            }

            setCombinations(ids);
        }


    }

    useEffect(() => {
        fetch()
    }, [articleByOne])


    const [combinationModal, setCombinationModal] =useState<any>()

    let modal  = (x: any) => {
        setModalCharacteristics('create_modal_characteristics')
        setCombinationModal(x)
    }
    const addCombinations = (x: any) => {
        const isInCombinations = combinations.includes(x.id)
        console.log('combinations before', combinations) // Agrega un log aquí para verificar el estado actual de combinations

        if (isInCombinations) {
            // Elimina el ID del arreglo de combinations
            console.log('id', x.id)
            const updatedCombinations = combinations.filter((id: any) => id !== x.id)
            setCombinations(updatedCombinations)
            setDeleteCombinations([...deleteCombinations, x.id])
            console.log('Si existe el ID y ha sido eliminado', updatedCombinations)
        } else {
            // Agrega el ID al arreglo de combinations
            const newCombinations = [...combinations, x.id]
            setCombinations(newCombinations)
            console.log('No existe el ID y ha sido agregado', newCombinations)
        }
    }






  return (
    <div className={`overlay__create_modal_combinations_articles ${subModal == 'create_modal_combinations' ? 'active' : ''}`}>
        <div className={`popup__create_modal_combinations_articles ${subModal == 'create_modal_combinations' ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__create_modal_combinations_articles" onClick={() => setSubModal('')}>
                <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </a>
            <p className='title__modals'>Combinaciones</p>
            <div className='conatiner__create_modal_combinations_articles' >
                <div className='row__one'>
                    {combinationsData?.map((x: any) => (
                        <div>
                            <button className='btn__general-purple' type='button' onClick={() => modal(x)}>{x.nombre}</button>
                        </div>
                    ))}
                </div>
            </div>
            <div className={`overlay__create_modal_characteristics ${modalCharacteristics == 'create_modal_characteristics' ? 'active' : ''}`}>
                <div className={`popup__create_modal_characteristics ${modalCharacteristics == 'create_modal_characteristics' ? 'active' : ''}`}>
                    <a href="#" className="btn-cerrar-popup__create_modal_characteristics" onClick={() => setModalCharacteristics('')}>
                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                    </a>
                    <p className='title__modals'>Crear nueva variacion</p>
                    <div className='conatiner__create_modal_characteristics' >
                        <div className='row__one'>
                            {combinationModal?.combinaciones_opciones.map((x: any) => (
                                <div key={x.id}>
                                    <button 
                                        className={`${combinations.includes(x.id) ? 'btn__general-success' : 'btn__general-gray'}`} 
                                        type='button' 
                                        onClick={() => addCombinations(x)}>
                                        {x.nombre}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                
                </div>
            </div>
           
        </div>
    </div>
  )
}

export default Combinations
