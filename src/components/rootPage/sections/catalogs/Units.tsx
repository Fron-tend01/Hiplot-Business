import React, { useEffect, useState } from 'react'
import './styles/Units.css'
import APIs from '../../../../services/services/APIs';
import UnitsFunctions from '../../../../zustand/Units';
import Swal from 'sweetalert2';

const Units = () => {
  const [modal, setModal] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [satCode, setSatCode] = useState<string>('')
  const [units, setUnits] = useState<any>(null)

  const [modalUpdate, setModalUpdate] = useState<any>()

  const closeModalUpdate = () => {
    setModalUpdate(false)
  }

  const get = async () => {
    let result = await APIs.getUnits()
    setUnits(result)
 }

  useEffect(() => {
 
    get()
  }, [])
  

  const Modal = () => {
    setModal(true)
  }

  const closeModal = () => {
    setModal(false)
  }

  const handleCreateUnits = async (e: React.FormEvent) => {
    e.preventDefault();

    let data = {
        nombre: name,
        descripcion: description,
        clave_sat: satCode,
    }
    
    await APIs.createUnits(data)
        .then((response: any) => {
            Swal.fire(response.mensaje, '', 'success');
        })
        .catch((error: any) => {
            if (error.response) {
                if (error.response.status === 409) {
                    Swal.fire(error.mensaje, '', 'warning');
                } else {
                  Swal.fire('Error al crear el usuario', '', 'error');
                }
              } else {
                Swal.fire('Error de conexión.', '', 'error');
            }
        })
  };

  const [id, setId] = useState<number>()

  const ModalUpdate = (unit: any) => {
    setModalUpdate(true)
    setId(unit.id)
    setName(unit.nombre) 
    setDescription(unit.descripcion)
    setSatCode(unit.clave_sat)
  }
  

  const handleUpdateUnits = async (e: React.FormEvent) => {
    e.preventDefault();
    let data = {
        id: id,
        nombre: name,
        descripcion: description,
        clave_sat: satCode,
    }
    await UnitsFunctions.updateUnits(data)
    await  get()
  }



  return (
    <div className='units'>
        <div className='units__container'>
            <div className='btns__create_units'>
                <button className='btn__general-purple' onClick={Modal}>Crear unidades</button>
            </div>
            <div className={`overlay__units ${modal ? 'active' : ''}`}>
                <div className={`popup__units ${modal ? 'active' : ''}`}>
                    <a href="#" className="btn-cerrar-popup__units" onClick={closeModal}>
                    <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                    </a>
                    <p className='title__modals'>Crear nueva unidad</p>
                    <form className='conatiner__create_units' onSubmit={handleCreateUnits}>
                        <div className='row__one'>
                            <div className='inputs__company'>
                                <label className='label__general'>Nombre</label>
                                <div className='warning__general'><small >Este campo es obligatorio</small></div>
                                <input className={`inputs__general`} value={name} onChange={(e) => setName(e.target.value)} type='text' placeholder='Ingresa la nombre' />
                            </div>
                            <div className='inputs__company'>
                                <label className='label__general'>Descripcción</label>
                                <div className='warning__general'><small >Este campo es obligatorio</small></div>
                                <input className={`inputs__general`} value={description} onChange={(e) => setDescription(e.target.value)} type='text' placeholder='Ingresa el Descripcción' />
                            </div>
                            <div className='inputs__company'>
                                <label className='label__general'>Código SAT</label>
                                <div className='warning__general'><small >Este campo es obligatorio</small></div>
                                <input className={`inputs__general`} value={satCode} onChange={(e) => setSatCode(e.target.value)} type='text' placeholder='Ingresa el Código' />
                            </div>
                        </div>
                        <div className='create__units_btn_modal'>
                            <div>
                                <input className='btn__general-purple' type='submit' value="Crear unidad" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className='table__units' >
                <div>
                {units ? (
                    <div>
                        <p className='text'>Tus empresas {units.length}</p>
                    </div>
                    ) : (
                    <p>No hay empresas</p>
                )}
                </div>
                <div className='table__head'>
                    <div className='thead'>
                        <div className='th'>
                            <p className=''>Nombre</p>
                        </div>
                        <div className='th'>
                            <p>Descripcción</p>
                        </div>
                        <div className='th'>
                            <p>Código SAT</p>
                        </div>
                    </div>
                </div>
                {units ? (
                <div className='table__body'>
                    {units.map((unit: any) => {
                    return (
                        <div className='tbody__container' key={unit.id}>
                            <div className='tbody'>
                                <div className='td'>
                                    <p>{unit.nombre}</p>
                                </div>
                                <div className='td'>
                                    <p>{unit.descripcion}</p>
                                </div>
                                <div className='td'>
                                    <p>{unit.clave_sat}</p>
                                </div>
                                <div className='td'>
                                    <button className='branchoffice__edit_btn' onClick={() => ModalUpdate(unit)}>Editar</button>
                                </div>
                            </div>
                        </div>
                    );
                    })}
                </div>
                ) : (
                <p>Cargando datos...</p>
                )}
            </div>
            <div className={`overlay__update_units ${modalUpdate ? 'active' : ''}`}>
                <div className={`popup__update_units ${modalUpdate ? 'active' : ''}`}>
                    <a href="#" className="btn-cerrar-popup__update_units" onClick={closeModalUpdate}>
                        <svg  className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                    </a>
                    <p className='title__modals'>Actualizar unidades</p>
                    <form className='conatiner__update_units' onSubmit={handleUpdateUnits}>
                        <div className='row__one'>
                            <div className='inputs__company'>
                                <label className='label__general'>Nombre</label>
                                <div className='warning__general'><small >Este campo es obligatorio</small></div>
                                <input className={`inputs__general`} value={name} onChange={(e) => setName(e.target.value)} type='text' placeholder='Ingresa la nombre' />
                            </div>
                            <div className='inputs__company'>
                                <label className='label__general'>Descripcción</label>
                                <div className='warning__general'><small >Este campo es obligatorio</small></div>
                                <input className={`inputs__general`} value={description} onChange={(e) => setDescription(e.target.value)} type='text' placeholder='Ingresa el Descripcción' />
                            </div>
                            <div className='inputs__company'>
                                <label className='label__general'>Código SAT</label>
                                <div className='warning__general'><small >Este campo es obligatorio</small></div>
                                <input className={`inputs__general`} value={satCode} onChange={(e) => setSatCode(e.target.value)} type='text' placeholder='Ingresa el Código' />
                            </div>
                        </div>
                        <div className='create__units_btn_modal'>
                            <div>
                                <input className='btn__general-purple' type='submit' value="Actualizar unidad" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Units
