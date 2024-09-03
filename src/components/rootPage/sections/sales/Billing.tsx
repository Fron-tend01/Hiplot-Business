import React from 'react'
import './styles/Billing.css'
import { storeArticles } from '../../../../zustand/Articles'
import ModalBilling from './billing/ModalBilling'

const Billing: React.FC = () => {

    const setSubModal = storeArticles(state => state.setSubModal)

    return (
        <div className='billing'>
            <div className='billing__container'>
                <div>
                    <button className='btn__general-purple' onClick={() => setSubModal('billing__modal')}>Craer nueva factura</button>
                </div>
            </div>
            <ModalBilling />
        </div>
    )
}

export default Billing
