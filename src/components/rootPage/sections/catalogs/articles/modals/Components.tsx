import React, { useEffect, useState } from 'react'
import './style/Components.css'
import { storeArticles } from '../../../../../../zustand/Articles'
import { useStore } from 'zustand'
import Filtrado_Articulos_Basic from '../../../../Dynamic_Components/Filtrado_Articulos_Basic'
import { storeDv } from '../../../../../../zustand/Dynamic_variables'

const Components: React.FC = () => {
  const setSubModal = storeArticles(state => state.setSubModal)
  const setArticulos = storeDv(state => state.setArticulos)
   const setDeliveryTimes = storeArticles(state => state.setDeliveryTimes)
  const {subModal}: any = useStore(storeArticles)
  const {articulos}: any = useStore(storeDv)

  const [articles, setArticles] =  useState<any>([])

  const [camps, setCamps] =  useState<any>([
    {
      nombre: 'id_articulo',
      tipo: 1,
      asignacion: 'id'
    },
    {
      nombre: 'cantidad',
      tipo: null
    },
    {
      nombre: 'comentarios',
      tipo: ''
    },

    {
      nombre: 'tipo',
      tipo: false
    },
])

  useEffect(() => {

   
  }, [])

  console.log(articulos)

  useEffect(() => {

  }, [articles]);


  

  return (
    <div className={`overlay__modal_components_creating_articles ${subModal == 'modal-components' ? 'active' : ''}`}>
      <div className={`popup__modal_components_creating_articles ${subModal == 'modal-components' ? 'active' : ''}`}>
        <a href="#" className="btn-cerrar-popup__modal_components_creating_articles" onClick={() => setSubModal('')}>
            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
        </a>
        <p className='title__modals'>Componentes</p>
        <div className='row'>
          {<div className='col-12'>
            <Filtrado_Articulos_Basic campos_ext={camps}/>
          </div>}
        </div>
        <div className='table__units' >
          <div>
              <div>
              {articulos ? (
                  <div>
                      <p className='text'>Total de unidades {articulos.length}</p>
                  </div>
              ) : (
                  <p className='text'>No hay empresas</p>
              )}
              </div>
              <div className='table__head'>
                <div className='thead'>
                    <div className='th'>
                        <p className=''>Unidad</p>
                    </div>
                    <div className='th'>
                        <p className=''>Valor</p>
                    </div>
                    <div className='th'>
                        <p className=''>Check</p>
                    </div>
                    <div className='th'>
                    </div>
                </div>
              </div>
              {articulos && articulos.length > 0 ? (
              <div className='table__body'>
                {articulos.map((item: any, index: any) => (
                    <div className='tbody__container' key={index}>
                        <div className='tbody'>
                            <div className='td'>
                              {item?.codigo}
                            </div>
                            <div className='td'>
                              {item?.descripcion}
                            </div>
                            <div className='td'>
                              {item?.tipo}
                            </div>
                            <div className='td'>
                              <input type="text" />
                            </div>
                            <div className='td'>
                                <button className='btn__delete_users' type='button' onClick={() => deleteMaxMin(item)}>Eliminar</button>
                            </div>
                        </div>
                    </div>
                ))}
              </div>
              ) : (
                  <p className='text'>Cargando datos...</p>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Components
