import React from 'react'
import Empresas_Sucursales from '../../Dynamic_Components/Empresas_Sucursales'
import { storeModals } from '../../../../zustand/Modals'
import ModalCreate from './quotations/ModalCreate'
import './styles/Quotation.css'



const Quotation = () => {

  const setModal = storeModals(state => state.setModal)

  const modal = () => {
    setModal('create-modal__qoutation')
  }
  return (
    <div className='quotation'>
      <div className='container__quotation'>
        <div className='row'>
          <div className='col-9 md-col-12'>
            <Empresas_Sucursales modeUpdate={false} />
          </div>
          <ModalCreate />
          <div className='col-3 md-col-12 sm-col-12 d-flex justify-content-center align-items-end'>
            <button className='sm-mx-auto btn__general-purple' onClick={modal}>Crear cotizacion</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Quotation
