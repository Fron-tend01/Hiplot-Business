import React from 'react'
import { storeQuotation } from '../../../../zustand/Quotation'
import { useStore } from 'zustand'

const SeeClient: React.FC = () => {
  const setClientsModal = storeQuotation(state  => state.setClientsModal)
  const {clientsModal, client}:any = useStore(storeQuotation)

  return (
    <div className={`overlay__personalized_modal ${clientsModal == 'clients_modal' ? 'active' : ''}`}>
      <div className={`popup__personalized_modal ${clientsModal == 'clients_modal' ? 'active' : ''}`}>
        <a href="#" className="btn-cerrar-popup__personalized_modal" onClick={() => setClientsModal('')}>
          <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </a>
        <p className='title__modals'>Campos del cliente</p>
        <div className='row'>
            <div className='col-4 select__container'>
                <label className='label__general'>Nombre de contacto</label>
                <div className='container__text_result'>
                    <p className='text__result' >{client?.nombre_contacto}</p>
                </div>
            </div>
            <div className='col-4 select__container'>
                <label className='label__general'>Nombre comercial</label>
                <div className='container__text_result'>
                    <p className='text__result' >{client?.nombre_comercial}</p>
                </div>
            </div>
            <div className='col-4 select__container'>
                <label className='label__general'>Persona jurídica</label>
                <div className='container__text_result'>
                    <p className='text__result' >{client?.persona_juridica}</p>
                </div>
            </div>
            <div className='col-4 select__container'>
                <label className='label__general'>Regimen fiscal</label>
                <div className='container__text_result'>
                    <p className='text__result' >{client?.regimen_fiscal}</p>
                </div>
            </div>
            <div className='col-4 select__container'>
                <label className='label__general'>Categoría</label>
                <div className='container__text_result'>
                    <p className='text__result' >{client?.categoria}</p>
                </div>
            </div>
            <div className='col-4 select__container'>
                <label className='label__general'>Correo</label>
                <div className='container__text_result'>
                    <p className='text__result' >{client?.correo}</p>
                </div>
            </div>
            <div className='col-4 select__container'>
                <label className='label__general'>CFDI</label>
                <div className='container__text_result'>
                    <p className='text__result' >{client?.uso_cfdi}</p>
                </div>
            </div>
            <div className='col-4 select__container'>
                <label className='label__general'>Status</label>
                <div className='container__text_result'>
                    <p className='text__result' >{client?.status}</p>
                </div>
            </div>
            <div className='col-4 select__container'>
                <label className='label__general'>Estado</label>
                <div className='container__text_result'>
                    <p className='text__result' >{client?.estado}</p>
                </div>
            </div>
            <div className='col-4 select__container'>
                <label className='label__general'>Municipio</label>
                <div className='container__text_result'>
                    <p className='text__result' >{client?.municipio}</p>
                </div>
            </div>
            <div className='col-4 select__container'>
                <label className='label__general'>Colonia</label>
                <div className='container__text_result'>
                    <p className='text__result' >{client?.colonia}</p>
                </div>
            </div>
            <div className='col-4 select__container'>
                <label className='label__general'>Calle</label>
                <div className='container__text_result'>
                    <p className='text__result' >{client?.calle}</p>
                </div>
            </div>
            <div className='col-4 select__container'>
                <label className='label__general'>No exterior</label>
                <div className='container__text_result'>
                    <p className='text__result' >{client?.no_exterior}</p>
                </div>
            </div>
            <div className='col-4 select__container'>
                <label className='label__general'>No interior</label>
                <div className='container__text_result'>
                    <p className='text__result' >{client?.no_interior}</p>
                </div>
            </div>
            <div className='col-4 select__container'>
                <label className='label__general'>Divisa</label>
                <div className='container__text_result'>
                    <p className='text__result' >{client?.divisa}</p>
                </div>
            </div>



        </div>
      </div>
    </div>
  )
}

export default SeeClient
