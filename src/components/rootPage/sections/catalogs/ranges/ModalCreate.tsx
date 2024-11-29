import React, { useEffect, useState } from 'react'
import { storeModals } from '../../../../../zustand/Modals'
import { useStore } from 'zustand'
import { UnitsRequests } from '../../../../../fuctions/Units'
import APIs from '../../../../../services/services/APIs'
import './ModalCreate.css'
import Swal from 'sweetalert2';
import DynamicVariables from '../../../../../utils/DynamicVariables'


const ModalCreate = (props: any) => {
    const { data_upd } = props
    const { modoUpdate } = props
    const { setModoUpdate } = props
    const { fetch2 } = props

    const { modal }: any = useStore(storeModals)
    const setModal = storeModals(state => state.setModal)

    const [selectedUnit, setSelectedUnit] = useState<any>(null)


    const { getUnits }: any = UnitsRequests()
    const [units, setUnits] = useState<any>([])
    const closeModal = () => {
        setModal('')
    }

    const fetch = async () => {
        const resultUnits = await getUnits()
        setUnits(resultUnits)
        setSelectedUnit(resultUnits[0].id)

    }

    const [inputs, setInputs] = useState({
        title: '',
        mins: 0,
        maxs: 0
    });

    useEffect(() => {
        fetch()
    }, [])
    useEffect(() => {
        activateModoUpdate()
    }, [modoUpdate])
    const activateModoUpdate = () => {
        if (modoUpdate) {
            DynamicVariables.updateAnyVar(setInputs, "title", data_upd.titulo)
            DynamicVariables.updateAnyVar(setInputs, "maxs", data_upd.maximo)
            DynamicVariables.updateAnyVar(setInputs, "mins", data_upd.minimo)
            setSelectedUnit(data_upd.id_unidad)
        }else {
            DynamicVariables.updateAnyVar(setInputs, "title", '')
            DynamicVariables.updateAnyVar(setInputs, "maxs", 0)
            DynamicVariables.updateAnyVar(setInputs, "mins", 0)
            setSelectedUnit(units[0]?.id)
        }
    }

    const handleCreateRanges = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const data = {
            id_unidad: selectedUnit,
            titulo: inputs.title,
            maximo: inputs.maxs,
            minimo: inputs.mins,
            de: 0,
            dee: 0
        };

        if (!modoUpdate) {
            await APIs.CreateAny(data, "rangos_create")
            .then(async (response: any) => {
              Swal.fire('Notificación', response.mensaje, 'success');
              setModal(false)
              setModoUpdate(false)
              fetch2()
            })
            .catch((error: any) => {
              if (error.response) {
                if (error.response.status === 409) {
                  Swal.fire(error.mensaje, '', 'warning');
                } else {
                  Swal.fire('Error al crear el rango', '', 'error');
                }
              } else {
                Swal.fire('Error de conexión.', '', 'error');
              }
            })
          }else {
            await APIs.CreateAnyPut(data, "rangos_update/" + data_upd.id)
            .then(async (response: any) => {
              Swal.fire('Notificación', response.mensaje, 'success');
              setModal(false)
              setModoUpdate(false)
              fetch2()
            })
            .catch((error: any) => {
              if (error.response) {
                if (error.response.status === 409) {
                  Swal.fire(error.mensaje, '', 'warning');
                } else {
                  Swal.fire('Error al crear el rango', '', 'error');
                }
              } else {
                Swal.fire('Error de conexión.', '', 'error');
              }
            })
          }
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
                    <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                </a>
                {!modoUpdate ?
                    <p className='title__modals'>Crear rango</p> :
                    <p className='title__modals'>Actualizar rango</p>
                }
                <br />
                <hr />
                <br />
                <div className='conatiner__create_modal_ranger' >
                    <div className='row'>
                        <div className='col-3 md-col-4 sm-col-12'>
                            <label className='label__general'>Nombre</label>
                            <div className='warning__general'><small >Este campo es obligatorio</small></div>
                            <input name="title" className={`inputs__general`} type="text" value={inputs.title} 
                            onChange={(e)=>DynamicVariables.updateAnyVar(setInputs, "title", e.target.value)} placeholder='Ingresa el nombre' />
                        </div>
                        <div className='col-3 md-col-4 sm-col-12'>
                            <label className='label__general'>Máximo</label>
                            <div className='warning__general'><small >Este campo es obligatorio</small></div>
                            <input name="maxs" className={`inputs__general`} type="number" value={inputs.maxs} 
                            onChange={(e)=>DynamicVariables.updateAnyVar(setInputs, "maxs", e.target.value)} placeholder='Ingresa el máximo' />
                        </div>
                        <div className='col-3 md-col-4 sm-col-12'>
                            <label className='label__general'>Mínimo</label>
                            <div className='warning__general'><small >Este campo es obligatorio</small></div>
                            <input name="mins" className={`inputs__general`} type="number" value={inputs.mins} 
                            onChange={(e)=>DynamicVariables.updateAnyVar(setInputs, "mins", e.target.value)} placeholder='Ingresa el mínimo' />
                        </div>
                        <div className='col-3 md-col-4 sm-col-12'>
                        <div className='select__container'>
                            <label className='label__general'>Unidad</label>
                            <div className={`select-btn__general`}>
                                <div className={`select-btn ${selectUnits ? 'active' : ''}`} onClick={openSelectUnits}>
                                    <p>{units ? units.find((s: { id: number }) => s.id == selectedUnit)?.nombre : 'Selecciona'}</p>
                                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                                </div>
                                <div className={`content ${selectUnits ? 'active' : ''}`}>
                                    <ul className={`options ${selectUnits ? 'active' : ''}`} style={{ opacity: selectUnits ? '1' : '0' }}>
                                        {units.map((unit: any) => (
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
                       
                    </div>
                    <br />
                    <div className='create__units_btn_modal'>
                        <div>
                                <button className='btn__general-purple' onClick={(e) => handleCreateRanges(e)}>Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalCreate
