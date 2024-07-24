import APIs from '../../../../services/services/APIs'
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react'
import './styles/Units.css'
import '../processes/styles/TypesUsers.css'
import './styles/TypeOfPayment.css'
import { storeModals } from '../../../../zustand/Modals';
import CreateModal from './TypesOfPayment/CreateModal';
import UpdateModal from './TypesOfPayment/UpdateModal';
import { TypeOfPaymentsRequests } from '../../../../fuctions/TypeOfPayments';
import { storeTypeOfPayments } from '../../../../zustand/TypeOfPayments';
import { useStore } from 'zustand';

const TypeOfPayment = () => {
    const {typeOfPaymentToUpdate}: any = useStore(storeTypeOfPayments)
  const setTypeOfPaymentToUpdate = storeTypeOfPayments(state => state.setTypeOfPaymentToUpdate);

  const {getTypeOfPayments}: any = TypeOfPaymentsRequests()
  const [typeOfPayments, setTypeOfPayments] =  useState<any>([])

  const setModal = storeModals(state => state.setModal)
 
  const [characteristics, setCharacteristics] = useState<any>(null)




  const get = async () => {
    let resultTypeOfPayments = await getTypeOfPayments()
    setTypeOfPayments(resultTypeOfPayments)
    let result = await APIs.GetAny("get_caracteristica/get")
    setCharacteristics(result)
 }

  useEffect(() => {
 
    get()
  }, [])

  const Modal = () => {
    setModal('create_type-payment')

  }

const ModalUpdate = (item: any) => {
    setModal('update_type-payment')
    setTypeOfPaymentToUpdate(item)
}



  return (
    <div className='units'>
        <div className='units__container'>
            <div className='btns__create_units'>
                <button className='btn__general-purple' onClick={Modal}>Crear tipo de cobro</button>
            </div>
            <CreateModal />
            <UpdateModal  />
            <div className='table__units' >
                <div>
                {typeOfPayments ? (
                    <div>
                        <p className='text'>Tus caracteristicas {typeOfPayments.length}</p>
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
                {typeOfPayments ? (
                <div className='table__body'>
                    {typeOfPayments?.map((car: any) => {
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
           
        </div>
    </div>
  )
}

export default TypeOfPayment