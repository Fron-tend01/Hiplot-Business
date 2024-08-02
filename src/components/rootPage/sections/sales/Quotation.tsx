import React from 'react'
import Empresas_Sucursales from '../../Dynamic_Components/Empresas_Sucursales'
import './styles/Quotation.css'

const Quotation = () => {
  return (
    <div className='quotation'>
      <div className='container__quotation'>
        <div className='row'>
          <div className='col-9 md-col-12'>
            <Empresas_Sucursales />
          </div>
          <div className='col-3 md-col-12 sm-col-12 d-flex justify-content-center align-items-end'>
            <button className='sm-mx-auto btn__general-purple'>Crear cotizacion</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Quotation
