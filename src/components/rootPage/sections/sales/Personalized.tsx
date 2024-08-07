import React, { useState } from 'react'
import { storePersonalized } from '../../../../zustand/Personalized'
import { useStore } from 'zustand'
import './styles/Personalized.css'
import Select from '../../Dynamic_Components/Select'
import { storeSaleCard } from '../../../../zustand/SaleCard'

const Personalized = () => {
    const setPersonalizedModal = storePersonalized(state => state.setPersonalizedModal)
    const setDataQuotation = storeSaleCard(state => state.setDataQuotation)
    const {personalizedModal}: any = useStore(storePersonalized)
    const {dataQuotation}: any =  useStore(storeSaleCard)
    
  const [invoice, setInvoice] = useState<any>()
  
  const dataSelects: any = {
    selectName: 'Unidad',
    empresas: [
      { id: 1, razon_social: 'Empresa 1' },
      { id: 2, razon_social: 'Empresa 2' },
    ],
  };


  const [temporary, setTemporary] = useState<any>([])

  const [check, setCheck] = useState<boolean>(false)

  const addPersonalized = (item: any) => {
    // Clonar el array para evitar mutaciones directas
    setCheck(!check)
    const updatedQuotation = dataQuotation.map((x: any) => {
      if (x.id === item.id) {
        // Alternar el valor de 'personalized' entre 'personalizado' y ''
        const personalized = x.personalized === 'personalizado' ? '' : 'personalizado';
        return {
          ...x,
          personalized
        };
      }
      return x;
    });
  
    // Actualizar el estado con el nuevo array modificado
    setDataQuotation(updatedQuotation);
  };
  

  return (
    <div className={`overlay__personalized_modal ${personalizedModal == 'personalized_modal' ? 'active' : ''}`}>
      <div className={`popup__personalized_modal ${personalizedModal == 'personalized_modal' ? 'active' : ''}`}>
        <a href="#" className="btn-cerrar-popup__personalized_modal" onClick={() => setPersonalizedModal('')}>
          <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </a>
        <p className='title__modals'>Crear personalizados</p>
        <div className='row'>
          <div className='col-4 md-col-6 sm-col-12'>
            <label className='label__general'>Nombre del concepto</label>
            <div className='warning__general'><small >Este campo es obligatorio</small></div>
            <input className={`inputs__general`} type="text" value={invoice} onChange={(e) => setInvoice(e.target.value)} placeholder='Nombre de concepto' />
          </div>
          <div className='col-4 md-col-6 sm-col-12'>
            <label className='label__general'>Código</label>
            <div className='warning__general'><small >Este campo es obligatorio</small></div>
            <input className={`inputs__general`} type="text" value={invoice} onChange={(e) => setInvoice(e.target.value)} placeholder='Ingresa el código' />
          </div>
          <div className='col-4'>
            <Select dataSelects={dataSelects} instanceId="unidad" />
          </div>
        </div>
        <div className='row gap-4 my-4'>
          <div className='row col-6 md-col-6 sm-col-12'>
            <div className='col-10'>
              <label className='label__general'>Observaciones Producción</label>
              <div className='warning__general'><small >Este campo es obligatorio</small></div>
              <textarea className={`textarea__general`} value={invoice} onChange={(e) => setInvoice(e.target.value)} placeholder='Observaciones Producción'></textarea>
            </div>
            <div className='col-2 d-flex align-items-end justify-content-end'>
              <button className='btn__general-purple'>Buscar</button>
            </div>
          </div>
          <div className='row col-6 md-col-6 sm-col-12'>
            <div className='col-10'>
              <label className='label__general'>Observaciones Facturación</label>
              <div className='warning__general'><small >Este campo es obligatorio</small></div>
              <textarea className={`inputs__general`} value={invoice} onChange={(e) => setInvoice(e.target.value)} placeholder='Observaciones Facturación'></textarea>
            </div>
            <div className='col-2 d-flex align-items-end justify-content-end'>
              <button className='btn__general-purple'>Buscar</button>
            </div>
          </div>
        </div>
        <div>
        <div className='table__personalized'>
                {dataQuotation ? (
                <div className='table__numbers'>
                    <p className='text'>Total de Ordenes</p>
                    <div className='quantities_tables'>{dataQuotation.length}</div>
                </div>
                ) : (
                <p className="text">No hay empresas que mostras</p>
                )}
                <div className='table__head'>
                    <div className='thead'>
                        <div className='th'>
       
                        </div>
                        <div className='th'>
                            <p>Nombre del articulo</p>
                        </div>
                        <div className='th'>
                            <p>Codigo</p>
                        </div>
                        <div className='th'>
                            <p>Empresa</p>
                        </div>
                     
                    </div>
                </div>
                {dataQuotation ? (
                <div className='table__body'>
                    {dataQuotation.map((quotation: any) => {
                    return (
                        <div className='tbody__container' key={dataQuotation.id} onClick={() => addPersonalized(quotation)}>
                            <div className='tbody'>
                            <div className='td'>
                              <label className="custom-checkbox">
                              <input 
                                  type="checkbox" 
                                  checked={check} 
                                  onChange={addPersonalized} 
                                />
                                <span className="checkmark"></span>
                              </label>
                            </div>
                            <div className='td'>
                                <p>{quotation.descripcion}</p>
                            </div>
                            <div className='td'>
                                <div>
                                  <p>{quotation.codigo}</p>
                                </div>
                            </div>
                            <div className='td'>
                                <p>{quotation.codigo}</p>
                            </div>
                       
                    
                            <div className='td'>
                                <button className='branchoffice__edit_btn' onClick={() => modalUpdate(ticket)}>Editar</button>
                            </div>
                            </div>
                        </div>
                    )
                    } )}
                </div>
                ) : ( 
                    <p className="text">Cargando datos...</p> 
                )}
            </div>
        </div>
      </div>
    </div>
  )
}

export default Personalized
