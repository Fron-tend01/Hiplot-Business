import React, { useEffect, useState } from 'react'
import './style/Components.css'
import { storeArticles } from '../../../../../../zustand/Articles'
import { useStore } from 'zustand'
import Filtrado_Articulos_Basic from '../../../../Dynamic_Components/Filtrado_Articulos_Basic'
import { storeDv } from '../../../../../../zustand/Dynamic_variables'

const Components: React.FC = () => {
  const setSubModal = storeArticles(state => state.setSubModal)
  const setComponents = storeArticles(state => state.setComponents)
  const setDeleteComponents = storeArticles(state => state.setDeleteComponents)
  const setArticulos = storeDv(state => state.setArticulos)
  const { subModal, components, deleteComponents }: any = useStore(storeArticles)

  const [camps] = useState<any>([
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
    {
      nombre: 'exit   '
    }
  ])



  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.trim();
    const newTem = [...components];
    newTem[index].cantidad = value === '' ? null : parseFloat(value);
    setComponents(newTem);
  };

  const indeterminateAmount = (index: number) => {
    const updatedComponents = [...components];
    updatedComponents[index].tipo = !updatedComponents[index].tipo;
    setComponents(updatedComponents);
  };

  const deleteComponent = (item: any) => {
    let filter = components.filter((x: any) => x.id !== item.id)
    setComponents(filter)
    setDeleteComponents(filter)
  }



  return (
    <div className={`overlay__modal_components_creating_articles ${subModal == 'modal-components' ? 'active' : ''}`}>
      <div className={`popup__modal_components_creating_articles ${subModal == 'modal-components' ? 'active' : ''}`}>
        <a href="#" className="btn-cerrar-popup__modal_components_creating_articles" onClick={() => setSubModal('')}>
          <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
        </a>
        <p className='title__modals'>Componentes</p>
        <div className='row'>
          {<div className='col-12'>
            <Filtrado_Articulos_Basic set_article_local={setComponents} campos_ext={camps} />
          </div>}
        </div>
        <div className='article__modal_components_modal' >
          <div>
            <div>
              {components ? (
                <div>
                  <p className='text'>Total de unidades {components.length}</p>
                </div>
              ) : (
                <p className='text'>No hay empresas</p>
              )}
            </div>
            <div className='table__head'>
              <div className='thead'>
                <div className='th'>
                  <p className=''>Código</p>
                </div>
                <div className='th'>
                  <p className=''>Descripción</p>
                </div>
                <div className='th'>
                  <p className=''>Cantidad determinada</p>
                </div>
                <div className='th'>
                  Cantidad
                </div>
                <div className='th'>
                </div>

              </div>
            </div>
            {components?.length > 0 ? (
              <div className='table__body'>
                {components?.map((item: any, index: any) => (
                  <div className='tbody__container' key={index}>
                    <div className='tbody'>
                      <div className='td'>
                        {item?.codigo}
                      </div>
                      <div className='td'>
                        {item?.descripcion}
                      </div>
                      <div className='td'>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={item?.tipo}
                            onChange={() => indeterminateAmount(index)} />
                          <span className="slider"></span>
                        </label>
                      </div>
                      <div className='td'>
                        <input className='inputs__general' value={item.cantidad} onChange={(e) => handleFormChange(e, index)} type="text" placeholder='Indeterminada' />
                      </div>
                      <div className='td'>
                        <button className='btn__general-danger' type='button' onClick={() => deleteComponent(item)}>Eliminar</button>
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
