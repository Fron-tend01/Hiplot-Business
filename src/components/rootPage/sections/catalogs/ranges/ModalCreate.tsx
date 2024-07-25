import React, { useEffect, useState } from 'react'
import { storeModals } from '../../../../../zustand/Modals'
import { useStore } from 'zustand'
import { UnitsRequests } from '../../../../../fuctions/Units'
import APIs from '../../../../../services/services/APIs'
import './ModalCreate.css'
import Swal from 'sweetalert2';


const ModalCreate = () => {
    const {modal}: any = useStore(storeModals)
    const setModal = storeModals(state => state.setModal)

    const [selectedUnit, setSelectedUnit] = useState<any>(null)
  

    const {getUnits}: any = UnitsRequests()
    const [units, setUnits] =  useState<any>([])
    const closeModal  = () => {
        setModal('')
    }

    const fetch = async () => {
        let resultUnits = await getUnits()
        setUnits(resultUnits)
        setSelectedUnit(resultUnits[0].id)
    }

    const [inputs, setInputs] = useState({
        title: '',
        mins: '',
        maxs: ''
      });

    useEffect(() => {
        fetch()
    }, [])


    const handleCreateRanges = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      let data = {
        id_unidad: selectedUnit,
        titulo: inputs.title,
        maximo: parseFloat(inputs.maxs),
        minimo: parseFloat(inputs.mins),
        de: 0,
        dee: 0
      };
    
      try {
        await APIs.createRanges(data);
        Swal.fire('Rango creado exitosamente', '', 'success');
      } catch (error) {
        console.error('Error al crear el rango:', error);
        Swal.fire('Error', 'Hubo un error al crear el rango', 'error');
      }
    };
    


    const handleInputs = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputs(prev => ({
        ...prev,
        [name]: name === 'maxs' || name === 'mins' ? parseFloat(value) : value
    }));
    };

  const [selectUnits, setselectUnits] = useState<any>()


  const openSelectUnits = () => {
    setselectUnits(!selectUnits)
  }

  const handleUnitsChange = (unit: any) => {
    setSelectedUnit(unit.id)
    setselectUnits(false)
    
  }

  return (
    <div className={`overlay__create_modal_ranges ${modal == 'ranges_modals' ? 'active' : ''}`}>
        <div className={`popup__create_modal_type-payment ${modal == 'ranges_modals' ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__create_modal_type-payment" onClick={closeModal}>
            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </a>
            <p className='title__modals'>Crear nuevo rango</p>
            <form className='conatiner__create_modal_ranger' onSubmit={handleCreateRanges}>
                <div className='row__one'>
                    <div>
                        <label className='label__general'>Nombre</label>
                        <div className='warning__general'><small >Este campo es obligatorio</small></div>
                        <input name="title" className={`inputs__general`} type="text" value={inputs.title} onChange={handleInputs} placeholder='Ingresa el nombre' />
                    </div>
                    <div>
                        <label className='label__general'>Máximo</label>
                        <div className='warning__general'><small >Este campo es obligatorio</small></div>
                        <input name="maxs" className={`inputs__general`} type="text" value={inputs.maxs} onChange={handleInputs} placeholder='Ingresa el máximo' />
                    </div>
                    <div>
                        <label className='label__general'>Mínimo</label>
                        <div className='warning__general'><small >Este campo es obligatorio</small></div>
                        <input name="mins" className={`inputs__general`} type="text" value={inputs.mins} onChange={handleInputs} placeholder='Ingresa el mínimo' />
                    </div>
                    <div className='select__container'>
                        <label className='label__general'>Unidad</label>
                        <div className={`select-btn__general`}>
                            <div className={`select-btn ${selectUnits ? 'active' : ''}`} onClick={openSelectUnits}>
                            <p>{units ? units.find((s: {id: number}) => s.id == selectedUnit)?.nombre : 'Selecciona'}</p>
                            <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                            </div>
                            <div className={`content ${selectUnits ? 'active' : ''}`}>
                            <ul className={`options ${selectUnits ? 'active' : ''}`} style={{ opacity: selectUnits ? '1' : '0' }}>
                                { units.map((unit: any) => (
                                    <li key={unit.id} onClick={() => handleUnitsChange(unit)}>
                                        {unit.nombre}
                                    </li>
                                    ))
                                }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row__two'>
                   
                </div>
                <div className='create__units_btn_modal'>
                    <div>
                        <input className='btn__general-purple' type='submit' value="Crear rango" />
                    </div>
                </div>
            </form>
        </div>
    </div>
  )
}

export default ModalCreate
