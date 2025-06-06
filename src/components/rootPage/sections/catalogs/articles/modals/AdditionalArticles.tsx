import React, { useEffect, useState } from 'react'
import { storeArticles } from '../../../../../../zustand/Articles'
import { useStore } from 'zustand'
import { storeModals } from '../../../../../../zustand/Modals'
import './style/AdditionalArticles.css'
import TemplatesRequests from '../../../../../../fuctions/Templates'
import Concepts from './additional-articles/Concepts'
import Empresas_Sucursales from '../../../../Dynamic_Components/Empresas_Sucursales'
import Filtrado_Articulos_Basic from '../../../../Dynamic_Components/Filtrado_Articulos_Basic'
import { storeDv } from '../../../../../../zustand/Dynamic_variables'
import dataConditional from './json/dataCondicion.json'


const AdditionalArticles: React.FC = () => {


  const setSubModal = storeArticles(state => state.setSubModal)

  const setDeleteAdditionalArticles = storeArticles(state => state.setDeleteAdditionalArticles)

  const setModalSub = storeModals(state => state.setModalSub)

  const setAdditionalArticles = storeArticles(state => state.setAdditionalArticles)
  const { subModal, additionalArticles, deleteAdditionalArticles }: any = useStore(storeArticles)

  const { getTemplatesxFields }: any = TemplatesRequests()

  const setIndex = storeDv(state => state.setIndex)




  const [companies, setCompanies] = useState<any>()
  const [branchOffices, setBranchOffices] = useState<any>()





  const [extrFields, setExtrFields] = useState<any>()
  const [plantillasCampo, setPlantillasCampo] = useState<any[]>([])
  const fetch = async () => {
    const resutTemplates = await getTemplatesxFields()
    setPlantillasCampo(resutTemplates)
    setExtrFields([
      {
        nombre: 'unidad',
        tipo: 0,
        dataSelect: resutTemplates
      },
      {
        nombre: 'id_sucursal',
        tipo: branchOffices?.id
      },
      {
        nombre: 'nombre_sucursal',
        tipo: branchOffices?.nombre
      },
      {
        nombre: 'aparece_por',
        tipo: 0
      },
      {
        nombre: 'id_articulo_adicional',
        tipo: 1,
        asignacion: 'id'
      },
      {
        nombre: 'id',
        tipo: 0,
        asignacion: 'id'
      },

      {
        nombre: 'data_aparece_por',
        tipo: resutTemplates
      },
      {
        nombre: 'condicion',
        tipo: 0
      },
      {
        nombre: 'data_condicion',
        tipo: dataConditional
      },
      {
        nombre: 'valor',
        tipo: 0
      },
      {
        nombre: 'data_equivalencia_por',
        tipo: resutTemplates
      },
      {
        nombre: 'equivalencia_por',
        tipo: 0
      },
      {
        nombre: 'cantidad_equivalente',
        tipo: 0
      },
      {
        nombre: 'equivalencia',
        tipo: 0,
      },
      {
        nombre: 'forzar_redondeo',
        tipo: false,
      }
    ])
  }
  useEffect(() => {
    if (subModal == 'modal-additiona-articles') {
      fetch()
    }
  }, [subModal])
  // useEffect(() => {
  //   fetch()
  // }, [branchOffices])


  const handleAppearsByChange = (e: React.ChangeEvent<HTMLSelectElement>, index: any) => {
    const value = e.target.value;
    setAdditionalArticles((prevArticulos: any) => {
      const updatedArticulos = [...prevArticulos];
      updatedArticulos[index].aparece_por = value;
      return updatedArticulos;
    });

  };

  const handleConditionsChange = (e: React.ChangeEvent<HTMLSelectElement>, index: any) => {
    const value = e.target.value;
    setAdditionalArticles((prevArticulos: any) => {
      const updatedArticulos = [...prevArticulos];
      updatedArticulos[index].condicion = value;
      return updatedArticulos;
    });
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>, index: any) => {
    const value = e.target.value;
    setAdditionalArticles((prevArticulos: any) => {
      const updatedArticulos = [...prevArticulos];
      updatedArticulos[index].valor = value;
      return updatedArticulos;
    });
  };



  const modalConcepts = (item: any, index: any) => {
    setIndex(index)
    setModalSub('modal-additiona-articles-concepts')
    console.log(item)
  }

  const deleteAdditionalArticle = (item: any) => {
    const filter = additionalArticles.filter((x: { id: any }) => x.id !== item.id)
    setAdditionalArticles(filter)
    setDeleteAdditionalArticles([...deleteAdditionalArticles, item.id])
  }


  const fecthTwo = async () => {
    // Obtener los templates
    const resutTemplates = await getTemplatesxFields();

    // Asegúrate de que additionalArticles tenga elementos
    if (additionalArticles && additionalArticles.length > 0) {
      setAdditionalArticles((prevArticulos: any[]) => {
        const updatedArticulos = prevArticulos.map((articulo: any) => {

          return {
            ...articulo,
            data_aparece_por: resutTemplates || [],
            data_condicion: dataConditional || [],
            data_equivalencia_por: resutTemplates || []
          };
        });

        // Retornar el array de artículos modificado
        return updatedArticulos;
      });
    } else {
      console.error("No hay artículos adicionales para actualizar.");
    }
  };




  useEffect(() => {
    fecthTwo()
  }, [])


console.log('additionalArticles', additionalArticles);

  return (
    <div className={`overlay__modal_additional-articles_modal_articles ${subModal == 'modal-additiona-articles' ? 'active' : ''}`}>
      <div className={`popup__modal_additional-articles_modal_articles ${subModal == 'modal-additiona-articles' ? 'active' : ''}`}>
        <div className='header__modal'>
          <a href="#" className="btn-cerrar-popup__modal_additional-articles_modal_articles" onClick={() => setSubModal('')} >
            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
          </a>
          <p className='title__modals'>Artículos adicionales</p>
        </div>
        <form className='modal_additional-articles_modal_articles'>
          <div className='row'>
            <div className='col-12'>
              <Empresas_Sucursales modeUpdate={false} empresaDyn={companies} sucursalDyn={branchOffices} setEmpresaDyn={setCompanies} setSucursalDyn={setBranchOffices} />
            </div>
          </div>
          <div className='row'>
            <div className='col-12'>
              <Filtrado_Articulos_Basic set_article_local={setAdditionalArticles} get_unidades={true} campos_ext={extrFields} materia_prima={1} />
            </div>
          </div>
          <div className='table__modal_articles_modal_articles' >
            <div>
              {additionalArticles ? (
                <div className='table__numbers'>
                  <p className='text'>Total de artículos</p>
                  <div className='quantities_tables'>{additionalArticles.length}</div>
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
                  <p className=''>Sucursal</p>
                </div>
                <div className='th'>
                  <p className=''>Aparece por</p>
                </div>
                <div className='th'>
                  <p className=''>Condición</p>
                </div>
                <div className='th'>
                  Valor
                </div>
                <div className='th'>

                </div>
                <div className='th'>

                </div>
              </div>
            </div>
            {additionalArticles?.length > 0 ? (
              <div className='table__body'>
                {additionalArticles.map((item: any, index: any) => (
                  <div className='tbody__container' key={index}>
                    <div className='tbody'>
                      <div className='td'>
                        {item.codigo}
                      </div>
                      <div className='td'>
                        {item.descripcion}
                      </div>
                      <div>
                        {item.nombre_sucursal}
                      </div>
                      <div className='td'>
                        <select className='traditional__selector' value={item.aparece_por} onChange={(e) => handleAppearsByChange(e, index)}>
                          {plantillasCampo.length > 0 && plantillasCampo?.map((itemx: any) => (
                            <option key={itemx.id} value={itemx.id}>
                              {itemx.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className='td'>
                        <select className='traditional__selector' value={item.condicion} onChange={(e) => handleConditionsChange(e, index)}>
                          {dataConditional?.map((item: any) => (
                            <option key={item.id} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className='td'>
                        <input className={`inputs__general`} type="number" value={item.valor} onChange={(e) => handleValueChange(e, index)} placeholder='Ingresa el valor' />
                      </div>
                      <div className='td'>
                        <button className='btn__general-purple' type='button' onClick={() => modalConcepts(item, index)}>Campos</button>
                      </div>
                      <div className='td'>
                        <button className='btn__general-danger' type='button' onClick={() => deleteAdditionalArticle(item)}>Eliminar</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text'>No hay máximos y mínimos que mostrar</p>
            )}
            <Concepts camposPlantillas={plantillasCampo}/>
          </div>

        </form>
      </div>
    </div>
  )
}

export default AdditionalArticles
