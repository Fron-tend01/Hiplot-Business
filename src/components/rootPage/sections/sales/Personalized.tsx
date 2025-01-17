import React, { useEffect, useState } from 'react'
import { storePersonalized } from '../../../../zustand/Personalized'
import { useStore } from 'zustand'
import './styles/Personalized.css'
import Select from '../../Dynamic_Components/Select'
import { storeSaleCard } from '../../../../zustand/SaleCard'
import DynamicVariables from '../../../../utils/DynamicVariables'
import APIs from '../../../../services/services/APIs'
import { v4 as uuidv4 } from 'uuid';
import { useSelectStore } from '../../../../zustand/Select'
import { storeModals } from '../../../../zustand/Modals'
import { storeDv } from '../../../../zustand/Dynamic_variables'
import Swal from 'sweetalert2'
import SeeCamposPlantillas from './SeeCamposPlantillas'

const Personalized: React.FC<any> = ({branch, idIdentifier}: any,) => {
  const setPersonalizedModal = storePersonalized(state => state.setPersonalizedModal)

  const setDataUpdate = storePersonalized(state => state.setDataUpdate)


  const setConceptView = storePersonalized(state => state.setConceptView)
  const setNormalConcepts = storePersonalized(state => state.setNormalConcepts)

  const setDeleteNormalConcepts = storePersonalized(state => state.setDeleteNormalConcepts)
  const setCustomConcepts = storePersonalized(state => state.setCustomConcepts)

  const setCustomConceptView = storePersonalized(state => state.setCustomConceptView)

  const setPersonalized = storePersonalized(state => state.setPersonalized)
  const setCustomData = storePersonalized(state => state.setCustomData)
  const { normalConcepts, deleteNormalConcepts, customConceptView, customConcepts, conceptView, deleteCustomConcepts, personalizedModal, customData, personalized, dataUpdate, temporaryNormalConcepts }: any = useStore(storePersonalized)
  const { dataPersonalized, }: any = useStore(storeSaleCard)
  const { modal }: any = useStore(storeModals)
  const { identifier }: any = useStore(storePersonalized)

  const setDataPersonalized = storeSaleCard(state => state.setDataPersonalized);

  const setModalSub = storeModals((state) => state.setModalSub);

  const selectedIds: any = useSelectStore((state) => state.selectedIds);

  const [units, setUnits] = useState<any>();

  const fetch = async () => {
    const result = await APIs.getUnits()
    setUnits({
      selectName: 'Unidades',
      options: 'nombre',
      dataSelect: result
    });
  }

  useEffect(() => {
    fetch()

  }, [])
  const [customLocal, setCustomLocal] = useState<any>([])

  // console.log('normalConcepts', normalConcepts)
  // console.log('deleteNormalConcepts', deleteNormalConcepts)

  // console.log('customConcepts', customConcepts)
  // console.log('deleteCustomConcepts', deleteCustomConcepts)


  // console.log('conceptView', conceptView)
  // console.log('customConceptView', customConceptView)


  // console.log('dataUpdate', dataUpdate)

  const [articlesPersonalized, setArticlesPersonalized] = useState<any>([])

  const [filterPersonalized, setFilterPersonalized] = useState<any>([])

  // useEffect(() => {

  // }, [customConceptView])

  const [item, setItem] = useState<any>()



  const addPersonalized = (item: any, index: number) => {
    setItem(item)
    console.log('custom local', customLocal)

    if (modal === 'create-modal__qoutation') {


    } else {

      if (personalizedModal == 'personalized_modal-quotation') {
        customConceptView[index].check = !customConceptView[index].check
   
        const existItem = normalConcepts.find((x: any) => x.id_identifier == item.id_identifier)
        if (existItem) {
          ///// Eliminar el concepto de la variable de normal conceptos que se envia al backend /////////////
          const deleteItem = normalConcepts.filter((xx: any) => xx.id_identifier !== item.id_identifier)
          setNormalConcepts(deleteItem)
          setDeleteNormalConcepts([...deleteNormalConcepts, existItem])

          ////////////////// Se agrega el concepto a la variable de conceptos de personalizados //////////////
          const existLocal = customLocal.some((x: any) => x.id_identifier == existItem.id_identifier)
          if(existLocal) {
            console.log('Ya existe')
            
          } else {
            setCustomLocal([...customLocal, item])
          }
    
    
          return

        } else {
          //// Item que se va agregar //////////////////
          let itemAdd = customLocal.find((x: any) => x.id_identifier == item.id_identifier)
          const deleteItem = deleteNormalConcepts.filter((xx: any) => xx.id_identifier !== item.id_identifier)
          setDeleteNormalConcepts(deleteItem)
          setNormalConcepts([itemAdd, ...normalConcepts]);
        }

        
      } else {
        // 'personalized_modal-quotation-update'
      
        if (item.check == true) {
    
          const updatedDataUpdate = customConceptView.map((x: any) => {
            if (x.id_identifier === item.id_identifier) {
              return { ...x, check: false };
            } else {
           
            }
            // Si no coincide, retorna el objeto original
            return x;
          });

          setCustomConceptView(updatedDataUpdate);

          const existItem = normalConcepts.find((x: any) => x.id_identifier == item.id_identifier)
          if(existItem) {
            const deleteItem = normalConcepts.filter((xx: any) => xx.id_identifier !== item.id_identifier)
            setNormalConcepts(deleteItem)
            setDeleteNormalConcepts([...deleteNormalConcepts, existItem])

            const existLocal = customLocal.some((x: any) => x.id_identifier == existItem.id_identifier)
            if(existLocal) {
              console.log('Ya existe')
              const deleteItem = customLocal.filter((xx: any) => xx.id_identifier !== item.id_identifier)
              setCustomLocal([...deleteItem, item])
            } else {
              setCustomLocal([...customLocal, item])
            }
          }

     
          setNormalConcepts([item, ...normalConcepts]);

         
        } else {
          const updatedDataUpdate = customConceptView.map((x: any) => {
            if (x.id_identifier === item.id_identifier) {
              return { ...x, check: true };
            }
            // Si no coincide, retorna el objeto original
            return x;
          });
          setCustomConceptView(updatedDataUpdate);

          const addFind = normalConcepts.find((xx: any) => xx.id_identifier == item.id_identifier)
          setCustomLocal([...customLocal, addFind])

          const deleteItem = normalConcepts.filter((xx: any) => xx.id_identifier !== addFind.id_identifier)
          setNormalConcepts(deleteItem)
          setConceptView(deleteItem)

          
        }


      }
    }


   
  };

  console.log('identifier', identifier)

  const [selectsSatKey, setSelectsSatKey] = useState<any>()
  const [selectedSatKey, setSelectedSatKey] = useState<any>()

  const [modalStatus, setModalStatus] = useState<boolean>(false)

  useEffect(() => {
    if (personalizedModal !== '') {
      setModalStatus(true)
    } else {
      setModalStatus(false)
    }
  })



  const createPersonalized = async () => {
    let total = 0;
    articlesPersonalized.forEach((element: any) => {
      total += element.total_price;
    });



    if (personalizedModal == 'personalized_modal-quotation') {


      const data = {
        // descripcion: inpust.descripcion,
        personalized: true,
        // codigo: inpust.codigo,
        // cantidad: inpust.cantidad,
        // unidad: selectedIds?.units.id,
        // name_unidad: selectedIds?.units?.nombre,
        // clave_sat: parseInt(selectedSatKey.Clave),
        // codigo_unidad_sat: 0,
        // precio_total: inpust.precio_total,
        // comentarios_produccion: inpust.comentarios_produccion,
        // comentarios_factura: inpust.comentarios_factura,
        conceptos: customLocal,
        id_identifier: identifier + 1
      }


      console.log('customLocal', customLocal)

      setCustomConcepts([...customConcepts, data])

      setConceptView([...normalConcepts, data])
      setCustomConceptView(normalConcepts)


      

      setPersonalizedModal('')
      setFilterPersonalized([])
      setArticlesPersonalized([])

      return
     
    } else if(personalizedModal == 'personalized_modal-quotation-update') {

      
      // const updatedCustomConcepts = customConceptView.map((x: any) => {
      //   if (x.id_identifier === item.id_identifier) {
      //     return { ...x, conceptos: customLocal };
      //   }

      //   return x;
      // });
      console.log('xxxxxxxxxxxxxxxxxxxx', item)
      const updatedConceptView = conceptView.map((x: any) => {
       
        if (x.id_identifier === item.id_identifier) {
          return { ...x, conceptos: customLocal };
        }

        return x;
      });

      console.log('updatedConceptView', updatedConceptView)

      // setCustomConcepts(updatedCustomConcepts)
      setConceptView(updatedConceptView)

      setPersonalizedModal('')
     

    } else {
     
    }


    if (personalizedModal == 'personalized_modal-sale' || personalizedModal == 'personalized_modal-sale') {
      const data = {
        descripcion: inpust.descripcion,
        personalized: true,
        codigo: inpust.codigo,
        cantidad: inpust.cantidad,
        unidad: selectedIds?.units?.id,
        name_unidad: selectedIds?.units?.nombre,
        clave_sat: parseInt(selectedSatKey.Clave),
        codigo_unidad_sat: 0,
        precio_total: inpust.precio_total,
        comentarios_produccion: inpust.comentarios_produccion,
        comentarios_factura: inpust.comentarios_factura,
        conceptos: customConcepts
      }

      console.log('selectedIds.units', selectedIds.units)

      setCustomData(normalConcepts)
      setNormalConcepts([...normalConcepts, data])
      setPersonalized([...customConceptView, data])

    }



    if (personalizedModal == 'personalized_modal-billing') {

    }


 
    // const identifiersToFilter = filterPersonalized.map((x: any) => x.id_identifier);

    // // Luego, filtra dataPersonalized para obtener solo los elementos cuyos id_identifier no están en identifiersToFilter
    // const filteredData = dataPersonalized.filter(
    //   (item: any) => !identifiersToFilter.includes(item.id_identifier)
    // );


    // await setDataPersonalized(filteredData);



  }


  const [inpust, setInputs] = useState<any>({
    descripcion: '',
    codigo: '',
    cantidad: '',
    precio_total: '',
    codigo_unidad_sat: '',
    comentarios_produccion: '',
    comentarios_factura: ''

  })






  const openselectsSatKey = () => {
    setSelectsSatKey(!selectsSatKey)

  }


  const handleKetSatChange = (key: any) => {
    setSelectsSatKey(false)
    setSelectedSatKey(key)
  }

  const [satKeyTerm, setSatKeyTerm] = useState<any>()
  const [satKey, setSatKey] = useState<any>()

  useEffect(() => {
    const fetchData = async () => {
      if (satKeyTerm.length >= 3) {
        const result = await APIs.getKeySat({ nombre: satKeyTerm });
        setSatKey(result);
      }
    };

    fetchData();
  }, [satKeyTerm]);


  const closeModal = () => {
    normalConcepts.forEach((element: any) => {
      element.check = false
    });

    if (personalizedModal == 'personalized_modal-quotation') {
      setNormalConcepts(temporaryNormalConcepts)
      setDataUpdate([])
    } else if(personalizedModal == 'personalized_modal-quotation-update') {
      // personalized_modal-quotation-update
      setNormalConcepts(temporaryNormalConcepts)

    }
    setPersonalizedModal('')

  }




    const setIndexVM = storeDv(state => state.setIndex)

    const seeVerMas = (index: number) => {
      setIndexVM(index)
      setModalSub('see_cp-personalized')
    }

    const handleUrgencyChange = async (index: number) => {
      let data = {
        id_articulo: dataUpdate[index].id_articulo,
        id_sucursal: branch.id,
        total: dataUpdate[index].precio_total
      }
      const newConcept = [...dataUpdate];
      newConcept[index].urgency = !newConcept[index]?.urgency;
  
      if (newConcept[index].urgency) {
        await APIs.CreateAny(data, "calcular_urgencia")
          .then(async (response: any) => {
            if (!response.error) {
              newConcept[index].monto_urgencia = parseFloat(response.monto_urgencia);
              newConcept[index].precio_total = parseFloat(response.total_con_urgencia);
            } else {
              Swal.fire('Notificación', response.mensaje, 'warning');
              return
            }
          })
      } else {
        newConcept[index].precio_total = parseFloat(newConcept[index].precio_total) - parseFloat(newConcept[index].monto_urgencia);
        newConcept[index].monto_urgencia = 0;
      }
      setNormalConcepts(newConcept);
  
    };
 


  return (
    <div className={`overlay__personalized_modal ${modalStatus ? 'active' : ''}`}>
      <div className={`popup__personalized_modal ${modalStatus ? 'active' : ''}`}>
        <a href="#" className="btn-cerrar-popup__personalized_modal" onClick={closeModal}>
          <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </a>
        <p className='title__modals'>Crear personalizados</p>
        <div className='personalized_modal'>
          <div className='row__one'>
            <div className='row'>
              <div className='col-3 md-col-6 sm-col-12'>
                <label className='label__general'>Nombre del concepto</label>
                <input className={`inputs__general`} type="text" value={inpust.descripcion} onChange={(e) => DynamicVariables.updateAnyVar(setInputs, 'descripcion', e.target.value)} placeholder='Nombre de concepto' />
              </div>
              <div className='col-2 md-col-6 sm-col-12'>
                <label className='label__general'>Código</label>
                <input className={`inputs__general`} type="text" value={inpust.codigo} onChange={(e) => DynamicVariables.updateAnyVar(setInputs, 'codigo', e.target.value)} placeholder='Ingresa el código' />
              </div>
              <div className='col-3'>
                <Select dataSelects={units} nameSelect={'Unidades'} instanceId='units' />
              </div>
              <div className='col-2 md-col-6 sm-col-12'>
                <label className='label__general'>Cantidad</label>
                <input className={`inputs__general`} value={inpust.cantidad} onChange={(e) => DynamicVariables.updateAnyVar(setInputs, 'cantidad', e.target.value)} placeholder='Cantidad' />
              </div>
              <div className='col-2 md-col-6 sm-col-12'>
                <label className='label__general'>Precio real</label>
                <input className={`inputs__general`} value={inpust.precio_total} onChange={(e) => DynamicVariables.updateAnyVar(setInputs, 'precio_total', e.target.value)} placeholder='Precio real' />
              </div>
            </div>
            <div className='row gap-4 my-4 w-full'>
              <div className='col-3 md-col-6 sm-col-12'>
                <label className='label__general'>Observaciones Producción</label>
                <div className='warning__general'><small >Este campo es obligatorio</small></div>
                <textarea className={`textarea__general`} value={inpust.comentarios_produccion} onChange={(e) => DynamicVariables.updateAnyVar(setInputs, 'comentarios_produccion', e.target.value)} placeholder='Observaciones Producción'></textarea>
              </div>
              <div className=' col-3 md-col-6 sm-col-12'>
                <label className='label__general'>Observaciones Facturación</label>
                <div className='warning__general'><small >Este campo es obligatorio</small></div>
                <textarea className={`inputs__general`} value={inpust.comentarios_factura} onChange={(e) => DynamicVariables.updateAnyVar(setInputs, 'comentarios_factura', e.target.value)} placeholder='Observaciones Facturación'></textarea>
              </div>
              <div className='select__container col-6'>
                <label className='label__general'>Claves SAT</label>
                <div className={`select-btn__general`}>
                  <div className={`select-btn ${selectsSatKey ? 'active' : ''}`} onClick={openselectsSatKey}>
                    <div className='select__container_title'>
                      <p>{selectedSatKey ? satKey.find((s: { ID: number }) => s.ID === selectedSatKey.ID)?.Clave : 'Selecciona'}</p>
                    </div>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                  </div>
                  <div className={`content ${selectsSatKey ? 'active' : ''}`}>
                    <input
                      className='inputs__general'
                      type="text"
                      placeholder='Buscar...'
                      value={satKeyTerm}
                      onChange={(e) => setSatKeyTerm(e.target.value)}
                    />
                    <ul className={`options ${selectsSatKey ? 'active' : ''}`} style={{ opacity: selectsSatKey ? '1' : '0' }}>
                      {satKey?.map((key: any) => (
                        <li key={uuidv4()} onClick={() => handleKetSatChange(key)}>
                          {key.Descripcion}-{key.Clave}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {personalizedModal == "personalized_modal-quotation" ?
            <div className='table__personalized'>
              {customData ? (
                <div className='table__numbers'>
                  <p className='text'>Total de artículos</p>
                  <div className='quantities_tables'>{customData.length}</div>
                </div>
              ) : (
                <p className="text">No hay empresas que mostras</p>
              )}
              <div className='table__head'>
                <div className={`thead ${personalizedModal == 'personalized_modal-update' ? 'active' : ''}`}>
                  {personalizedModal == 'personalized_modal-update' ?
                    ''
                    :
                    <div className='th'>
                    </div>
                  }
                  <div className='th'>
                    <p>Artículo</p>
                  </div>
                  <div className='th'>
                    <p>Cantidad</p>
                  </div>
                  <div className='th'>
                    <p>Unidad</p>
                  </div>
                </div>
              </div>
              {customConceptView ? (
                <div className='table__body'>
                  {customConceptView.map((quotation: any, index: number) => {
                    return (
                      <div className='tbody__container'>
                        <div className={`tbody ${personalizedModal == 'personalized_modal-update' ? 'active' : ''}`} key={quotation.id}>
                          {personalizedModal == 'personalized_modal-update' ?
                            ''
                            :
                            <div className='td'>
                              <div className="td">
                                <label className="custom-checkbox">
                                  <input
                                    type="checkbox"
                                    checked={customConceptView[index]?.check || false}
                                    onChange={() => addPersonalized(quotation, index)}
                                  />
                                  <span className="checkmark"></span>
                                </label>
                              </div>
                            </div>
                          }

                          <div className='td'>
                            <div className='article'>
                              <p>{quotation.codigo}-{quotation.descripcion}</p>
                            </div>
                          </div>
                          <div className='td'>
                            <div>
                              <p>{quotation.cantidad}</p>
                            </div>
                          </div>
                          <div className='td'>
                            <div>
                              <p>{quotation.name_unidad}</p>
                            </div>
                          </div>
                          <div className='td'>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text">Cargando datos...</p>
              )}
            </div>
            :
            <div className='table__personalized-update'>
              {customConceptView ? (
                <div className='table__numbers'>
                  <p className='text'>Total de artículos</p>
                  <div className='quantities_tables'>{customConceptView.length}</div>
                </div>
              ) : (
                <p className="text">No hay empresas que mostras</p>
              )}
              <div className='table__head'>
                <div className={`thead ${personalizedModal == 'personalized_modal-update' ? 'active' : ''}`}>
                  {personalizedModal == 'personalized_modal-update' ?
                    ''
                    :
                    <div className='th'>
                    </div>
                  }
                  <div className='th'>
                    <p>Artículo</p>
                  </div>
                  <div className='th'>
                    <p>Cantidad</p>
                  </div>
                  <div className='th'>
                    <p>Unidad</p>
                  </div>
                </div>
              </div>
              {customConceptView ? (
                <div className='table__body'>
                  {customConceptView.map((concept: any, index: number) => {
                    return (
                      <div className='tbody__container'>
                        <div className={`tbody ${personalizedModal == 'personalized_modal-update' ? 'active' : ''}`} key={concept.id}>
                          {personalizedModal == 'personalized_modal-update' ?
                            ''
                            :
                            <div className='td'>
                              <div className="td">
                                <label className="custom-checkbox">
                                  <input
                                    type="checkbox"
                                    checked={customConceptView[index]?.check || false}
                                    onChange={() => addPersonalized(concept, index)}
                                  />
                                  <span className="checkmark"></span>
                                </label>
                              </div>
                            </div>
                          }

                          <div className='td ' style={{ cursor: 'pointer' }} title='Haz clic aquí para modificar tu concepto' onClick={() => abrirFichaModifyConcept(article)}>
                            <p className='article'>{concept.codigo}-{concept.descripcion}</p>
                          </div>
                          <div className='td'>
                            <p className='amount'>{concept.cantidad}</p>
                          </div>
                          <div className='td'>
                            <p>{concept.name_unidad || concept.unidad}</p>
                          </div>
                          <div className='td'>
                            <p className=''>$ {concept.precio_total / concept.cantidad}</p>
                          </div>
                          <div className='td '>
                            {concept.urgency ?
                              <div className='container__total'>
                                <p className='total'>$ {concept.precio_total}</p>
                                <p className='remove__urgency' title='urgencia'>(${concept.monto_urgencia})</p>
                              </div>
                              :
                              <p className='total'>$ {concept.precio_total}</p>
                            }
                          </div>

                          <div className='td urgency'>
                            {concept?.urgency ?
                              <div>
                                <button className='modal-create-quotations__tooltip-text no-urgency' type='button' title='Quitar urgencia' onClick={() => handleUrgencyChange(index)}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-timer-off"><path d="M10 2h4" /><path d="M4.6 11a8 8 0 0 0 1.7 8.7 8 8 0 0 0 8.7 1.7" /><path d="M7.4 7.4a8 8 0 0 1 10.3 1 8 8 0 0 1 .9 10.2" /><path d="m2 2 20 20" /><path d="M12 12v-2" /></svg>
                                </button>
                              </div>
                              :
                              <div>
                                <button className='modal-create-quotations__tooltip-text yes-urgency' title='Agregar urgencia' onClick={() => handleUrgencyChange(index)} type='button'>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-timer"><line x1="10" x2="14" y1="2" y2="2" /><line x1="12" x2="15" y1="14" y2="11" /><circle cx="12" cy="14" r="8" /></svg>
                                </button>
                              </div>
                            }
                          </div>
                          <div className='td'>
                            <button className='btn__general-purple' onClick={() => seeVerMas(index)}>Ver Más</button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text">Cargando datos...</p>
              )}
            </div>
          }
          <div className='mt-5 d-flex justify-content-center'>
            {personalizedModal == 'personalized_modal-quotation' ? 
              <div>
              <button className='btn__general-purple' onClick={createPersonalized}>Crear personalizado</button>
            </div>
          :
          <div>
          <button className='btn__general-purple' onClick={createPersonalized}>Actulizar personalizado</button>
        </div>
          }
          
          </div>
        </div>
      </div>
      <SeeCamposPlantillas />
    </div>
  )
}

export default Personalized
