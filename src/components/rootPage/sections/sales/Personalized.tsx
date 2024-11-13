import React, { useEffect, useState } from 'react'
import { storePersonalized } from '../../../../zustand/Personalized'
import { useStore } from 'zustand'
import './styles/Personalized.css'
import Select from '../../Dynamic_Components/Select'
import { storeSaleCard } from '../../../../zustand/SaleCard'
import { storeBilling } from '../../../../zustand/Billing'
import DynamicVariables from '../../../../utils/DynamicVariables'
import APIs from '../../../../services/services/APIs'
import { v4 as uuidv4 } from 'uuid';

const Personalized = () => {
  const setPersonalizedModal = storePersonalized(state => state.setPersonalizedModal)
  const setDataQuotation = storeSaleCard(state => state.setDataQuotation)
  const { personalizedModal, dataUpdate }: any = useStore(storePersonalized)
  const { dataQuotation, dataPersonalized }: any = useStore(storeSaleCard)
  const { dataBillign, }: any = useStore(storeBilling)

  const setConcepts = storeBilling(state => state.setConcepts)
  const setDataPersonalized = storeSaleCard(state => state.setDataPersonalized);


  const { concepts }: any = useStore(storeBilling)

 

  const [units, setUnits] = useState<any>()

  const fetch = async () => {
    let result = await APIs.getUnits()
    setUnits({
      selectName: 'Unidades',
      options: 'nombre',
      dataSelect: result
    })
    
  }

  useEffect(() => {
    fetch()
  
  }, [])

  useEffect(() => {

    if (personalizedModal === 'personalized_modal-update') {
      setDataPersonalized(dataUpdate.conceptos)
    }

  }, [])



  const [articlesPersonalized, setArticlesPersonalized] = useState<any>([])

  const [filterPersonalized, setFilterPersonalized] = useState<any>([])

  console.log('filterPersonalized', filterPersonalized)

  const addPersonalized = (item: any, index: number) => {

    const newData = [...dataPersonalized];
    newData[index] = { ...newData[index], check: !newData[index].check };

    

    let exist = dataQuotation.some((x: any) => x.id_identifier == item.id_identifier)

    console.log(exist)

    if (exist) {
      let deleteFilter = dataQuotation.filter((xx: any) => xx.id_identifier !== item.id_identifier)
      let filterT = dataPersonalized.find((xx: any) => xx.id_identifier == item.id_identifier)
      setFilterPersonalized([...filterPersonalized, filterT])
   
      setDataQuotation(deleteFilter);
      setArticlesPersonalized([...articlesPersonalized, item])
      setDataPersonalized(newData);
      return
    } else {
      let filter = dataPersonalized.filter((xx: any) => xx.id_identifier == item.id_identifier)
      // let filterT = filterPersonalized.filter((x: any) => x.id_identifier == item.id_identifier)
      // setFilterPersonalized([...filterPersonalized, filterT])
      setDataQuotation([...dataQuotation, ...filter]);
      setDataPersonalized(newData);
      return
    }
  };

  console.log('dataQuotation', dataQuotation)
  // if (identifier === 'billing') {
  //   setConcepts(updatedQuotation);
  // } else {

  // }


  const createPersonalized = async () => {

    let total = 0;
    articlesPersonalized.forEach((element: any) => {
      total += element.total_price;
    });


    let data = {
      nombre: inpust.descripcion,
      personalized: true,
      codigo: inpust.codigo,
      unidad: inpust.unidad,
      precio_total: inpust.precio_total,
      comentarios_p: inpust.comentarios_p,
      comentarios_f: inpust.comentarios_f,
      conceptos: articlesPersonalized
    }
    setDataQuotation([...dataQuotation, data])
    
    setPersonalizedModal('')

    const identifiersToFilter = filterPersonalized.map((x: any) => x.id_identifier);
    
    // Luego, filtra dataPersonalized para obtener solo los elementos cuyos id_identifier no están en identifiersToFilter
    const filteredData = dataPersonalized.filter(
      (item: any) => !identifiersToFilter.includes(item.id_identifier)
    );
    
    // Finalmente, actualiza el estado con los elementos filtrados
    await setDataPersonalized(filteredData);
    setFilterPersonalized([])
    setArticlesPersonalized([])

  }

  console.log('dataPersonalized', dataPersonalized)

  const [inpust, setInputs] = useState<any>({
    descripcion: '',
    codigo: '',
    unidad: '',
    precio_total: '',
    clave_sat: '',
    codigo_unidad_sat: '',
    comentarios_p: '',
    comentarios_f: ''

  })


  const [selectsSatKey, setSelectsSatKey] = useState<any>()
  const [selectedSatKey, setSelectedSatKey] = useState<any>()



  const openselectsSatKey = () => {
    setSelectsSatKey(!selectsSatKey)

  }

  const handleKetSatChange = (key: any) => {
    setSelectsSatKey(false)
    setSelectedSatKey(key)
    console.log(key)
  }

  const [satKeyTerm, setSatKeyTerm] = useState<any>()
  const [satKey, setSatKey] = useState<any>()

  useEffect(() => {
    const fetchData = async () => {
      if (satKeyTerm.length >= 3) { 
        const result = await APIs.getKeySat({nombre: satKeyTerm});
        setSatKey(result);
      }
    };

    fetchData();
  }, [satKeyTerm]); 

  return (
    <div className={`overlay__personalized_modal ${(personalizedModal === 'personalized_modal' || personalizedModal === 'personalized_modal-update') ? 'active' : ''}`}>
      <div className={`popup__personalized_modal ${(personalizedModal === 'personalized_modal' || personalizedModal === 'personalized_modal-update') ? 'active' : ''}`}>
        <a href="#" className="btn-cerrar-popup__personalized_modal" onClick={() => setPersonalizedModal('')}>
          <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </a>
        <p className='title__modals'>Crear personalizados</p>
        <div className='personalized_modal'>
          <div className='row'>
            <div className='col-3 md-col-6 sm-col-12'>
              <label className='label__general'>Nombre del concepto</label>
              <input className={`inputs__general`} type="text" value={inpust.descripcion} onChange={(e) => DynamicVariables.updateAnyVar(setInputs, 'nombre', e.target.value)} placeholder='Nombre de concepto' />
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
              <input className={`inputs__general`} value={inpust.cantidad} onChange={(e) => DynamicVariables.updateAnyVar(setInputs, 'comentarios_p', e.target.value)} placeholder='Cantidad' />
            </div>
            <div className='col-2 md-col-6 sm-col-12'>
              <label className='label__general'>Precio real</label>
              <input className={`inputs__general`} value={inpust.precio_total} onChange={(e) => DynamicVariables.updateAnyVar(setInputs, 'comentarios_p', e.target.value)} placeholder='Precio real' />
            </div>
          </div>
          <div className='row gap-4 my-4 w-full'>
            <div className='col-3 md-col-6 sm-col-12'>
              <label className='label__general'>Observaciones Producción</label>
              <div className='warning__general'><small >Este campo es obligatorio</small></div>
              <textarea className={`textarea__general`} value={inpust.comentarios_p} onChange={(e) => DynamicVariables.updateAnyVar(setInputs, 'comentarios_p', e.target.value)} placeholder='Observaciones Producción'></textarea>
            </div>
            <div className=' col-3 md-col-6 sm-col-12'>
              <label className='label__general'>Observaciones Facturación</label>
              <div className='warning__general'><small >Este campo es obligatorio</small></div>
              <textarea className={`inputs__general`} value={inpust.comentarios_f} onChange={(e) => DynamicVariables.updateAnyVar(setInputs, 'comentarios_f', e.target.value)} placeholder='Observaciones Facturación'></textarea>
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

          <div className='table__personalized'>
            {dataPersonalized ? (
              <div className='table__numbers'>
                <p className='text'>Total de Ordenes</p>
                <div className='quantities_tables'>{dataPersonalized.length}</div>
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
            {dataPersonalized ? (
              <div className='table__body'>
                {dataPersonalized.map((quotation: any, index: number) => {
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
                                  checked={dataPersonalized[index]?.check || false}
                                  onChange={() => addPersonalized(quotation, index)}
                                />
                                <span className="checkmark"></span>
                              </label>
                            </div>
                          </div>
                        }

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

          <div className='mt-5 d-flex justify-content-center'>
            <div>
              <button className='btn__general-purple' onClick={createPersonalized}>Crear personalizado</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Personalized
