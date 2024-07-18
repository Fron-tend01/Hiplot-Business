import APIs from '../../../../services/services/APIs'
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react'
import './styles/Units.css'
import '../processes/styles/TypesUsers.css'

const Combinations = () => {
  const [modal, setModal] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [status, setStatus] = useState(false)
  const [characteristics, setCharacteristics] = useState<any>(null)

  const [modalUpdate, setModalUpdate] = useState<any>()

  const closeModalUpdate = () => {
    setModalUpdate(false)
  }

  const get = async () => {
    let result = await APIs.GetAny("get_caracteristica/get")
    setCharacteristics(result)
 }

  useEffect(() => {
 
    get()
  }, [])
  const handleCheckboxChange = (event: any) => {
    setStatus(event.target.checked); // Actualizar el estado con el nuevo valor del checkbox
  };

  const Modal = () => {
    setModal(true)
  }

  const closeModal = () => {
    setModal(false)
  }

  const handleCreateCaracteristics = async (e: React.FormEvent) => {
    e.preventDefault();

    let data = {
        nombre: name,
        status: true,
    }
    
    await APIs.CreateAny(data, "create_caracteristica/create")
        .then(async (response: any) => {
            Swal.fire(response.mensaje, '', 'success');
            await get()
            setModal(false)
        })
        .catch((error: any) => {
            if (error.response) {
                if (error.response.status === 409) {
                    Swal.fire(error.mensaje, '', 'warning');
                } else {
                  Swal.fire('Error al crear la caracteristica', '', 'error');
                }
              } else {
                Swal.fire('Error de conexión.', '', 'error');
            }
        })
  };

  const [id, setId] = useState<number>()

  const ModalUpdate = (car: any) => {
    setModalUpdate(true)
    setId(car.id)
    setName(car.nombre) 
    setStatus(car.status)
  }
  

  const handleUpdateCharacteristics = async (e: React.FormEvent) => {
    e.preventDefault();
    let data = {
        id: id,
        nombre: name,
        status: status,
    }
    await APIs.CreateAnyPut(data, "update_caracteristica/update")
        .then(async (response: any) => {
            Swal.fire(response.mensaje, '', 'success');
            await get()
            setModalUpdate(false)
        })
        .catch((error: any) => {
            if (error.response) {
                if (error.response.status === 409) {
                    Swal.fire(error.mensaje, '', 'warning');
                } else {
                  Swal.fire('Error al actualizar la caracteristica', '', 'error');
                }
              } else {
                Swal.fire('Error de conexión.', '', 'error');
            }
        })
  }



  return (
    <div className='units'>
        <div className='units__container'>
            <div className='btns__create_units'>
                <button className='btn__general-purple' onClick={Modal}>Crear Caracteristicas</button>
            </div>
            <div className={`overlay__units ${modal ? 'active' : ''}`}>
                <div className={`popup__units ${modal ? 'active' : ''}`}>
                    <a href="#" className="btn-cerrar-popup__units" onClick={closeModal}>
                    <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                    </a>
                    <p className='title__modals'>Crear nueva caracteristica</p>
                    <form className='conatiner__create_units' onSubmit={handleCreateCaracteristics}>
                        <div className='row__one'>
                            <div className='inputs__company'>
                                <label className='label__general'>Nombre</label>
                                <div className='warning__general'><small >Este campo es obligatorio</small></div>
                                <input className={`inputs__general`} value={name} onChange={(e) => setName(e.target.value)} type='text' placeholder='Ingresa la nombre' />
                            </div>
                        </div>
                        <div className='create__units_btn_modal'>
                            <div>
                                <input className='btn__general-purple' type='submit' value="Crear caracteristica" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className='table__units' >
                <div>
                {characteristics ? (
                    <div>
                        <p className='text'>Tus caracteristicas {characteristics.length}</p>
                    </div>
                    ) : (
                    <p>No hay caracteristicas</p>
                )}
                </div>
                <div className='table__head'>
                    <div className='thead'>
                        <div className='th'>
                            <p className=''>Nombre</p>
                        </div>
                        <div className='th'>
                            <p>Status</p>
                        </div>
                    </div>
                </div>
                {characteristics ? (
                <div className='table__body'>
                    {characteristics.map((car: any) => {
                    return (
                        <div className='tbody__container' key={car.id}>
                            <div className='tbody'>
                                <div className='td'>
                                    <p>{car.nombre}</p>
                                </div>
                                <div className='td'>
                                  {car.status == true ? "ACTIVO" : "INACTIVO"}
                                </div>
                                <div className='td'>
                                    <button className='branchoffice__edit_btn' onClick={() => ModalUpdate(car)}>Editar</button>
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
                    <p className='title__modals'>Actualizar caracteristicas</p>
                    <form className='conatiner__update_units' onSubmit={handleUpdateCharacteristics}>
                        <div className='row__one'>
                            <div className='inputs__company'>
                                <label className='label__general'>Nombre</label>
                                <div className='warning__general'><small >Este campo es obligatorio</small></div>
                                <input className={`inputs__general`} value={name} onChange={(e) => setName(e.target.value)} type='text' placeholder='Ingresa la nombre' />
                            </div>
                            <div className='inputs__company'>
                                <label className='label__general'>Status</label>
                                <label className="switch">
                                  <input
                                    type="checkbox" checked={status} onChange={handleCheckboxChange}/>
                                  <span className="slider"></span>
                                </label>
                                  
                            </div>
                        </div>
                        <div className='create__units_btn_modal'>
                            <div>
                                <input className='btn__general-purple' type='submit' value="Actualizar caracteristica" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Combinations