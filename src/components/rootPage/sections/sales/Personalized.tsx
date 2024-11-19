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
import { useSelectStore } from '../../../../zustand/Select'

const Personalized = () => {
  const setPersonalizedModal = storePersonalized(state => state.setPersonalizedModal)
  const setDataQuotation = storeSaleCard(state => state.setDataQuotation)
  const setNormalConcepts = storePersonalized(state => state.setNormalConcepts)
  const setCustomConcepts = storePersonalized(state => state.setCustomConcepts)

  const setPersonalized = storePersonalized(state => state.setPersonalized)
  const setCustomData = storePersonalized(state => state.setCustomData)
  const { personalizedModal, dataUpdate, customData, normalConcepts, customConcepts, personalized }: any = useStore(storePersonalized)
  const { dataQuotation, dataPersonalized, conceptsPersonalized, }: any = useStore(storeSaleCard)
  const { dataBillign, }: any = useStore(storeBilling)


  const setDataPersonalized = storeSaleCard(state => state.setDataPersonalized);

  const { concepts }: any = useStore(storeBilling)


  const selectedIds = useSelectStore((state) => state.selectedIds);

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

  const [concetps, setConcepts] = useState<any>([])


  const addPersonalized = (item: any, index: number) => {

    const newData = [...customData];
    newData[index] = { ...newData[index], check: !newData[index].check };
    setCustomData(newData)

    let exist = normalConcepts.some((x: any) => x.id_identifier == item.id_identifier)

    console.log(exist)

    if (exist) {
      ////////////////////////////////////// Se agrega ///////////////////////
      let findItem = customData.find((xx: any) => xx.id_identifier == item.id_identifier)
      setCustomConcepts([...customConcepts, findItem]);

      let deleteFilter = normalConcepts.filter((xx: any) => xx.id_identifier !== item.id_identifier)
      setNormalConcepts(deleteFilter)
      

      
      return
    } else {
      let find = customConcepts.find((xx: any) => xx.id_identifier == item.id_identifier)
      setNormalConcepts([...normalConcepts, find])

      let deleteFilter = customConcepts.filter((xx: any) => xx.id_identifier !== item.id_identifier)
      setCustomConcepts(deleteFilter)

    }
  };


  const [selectsSatKey, setSelectsSatKey] = useState<any>()
  const [selectedSatKey, setSelectedSatKey] = useState<any>()

  const [modal, setModal] = useState<Boolean>(false)

  useEffect(() => {
    if (personalizedModal !== '') {
      setModal(true)
    } else {
      setModal(false)
    }
  })

  const createPersonalized = async () => {

    let total = 0;
    articlesPersonalized.forEach((element: any) => {
      total += element.total_price;
    });


    console.log( 'selectedSatKey.Clave',selectedSatKey.Clave)


    if (personalizedModal == 'personalized_modal-quotation') {
      let data = {
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

      setCustomData(normalConcepts)
      setNormalConcepts([...normalConcepts, data])
      setPersonalized([...personalized, data])


    }

    if (personalizedModal == 'personalized_modal-sale') {
      console.log('selectedSatKey', selectedSatKey)
      let data = {
        descripcion: inpust.descripcion,
        personalized: true,
        codigo: inpust.codigo,
        cantidad: inpust.cantidad,
        unidad: selectedIds.id_unidad,
        name_unidad: selectedIds.units.nombre,
        clave_sat: selectedSatKey.Clave,
        codigo_unidad_sat: 0,
        precio_total: inpust.precio_total,
        comentarios_produccion: inpust.comentarios_produccion,
        comentarios_factura: inpust.comentarios_factura,
        conceptos: articlesPersonalized
      }

      setConceptsPersonalized([...conceptsPersonalized, data])
      // setDataSales([...dataSales, data])
    }



    if (personalizedModal == 'personalized_modal-billing') {

    }


    setPersonalizedModal('')

    const identifiersToFilter = filterPersonalized.map((x: any) => x.id_identifier);

    // Luego, filtra dataPersonalized para obtener solo los elementos cuyos id_identifier no están en identifiersToFilter
    const filteredData = dataPersonalized.filter(
      (item: any) => !identifiersToFilter.includes(item.id_identifier)
    );


    await setDataPersonalized(filteredData);
    setFilterPersonalized([])
    setArticlesPersonalized([])


  }


  console.log('customConcepts', customConcepts)
  console.log('custom data', customData)

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

  // console.log('selectedIds.units', selectedIds.units)

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
        const result = await APIs.getKeySat({ nombre: satKeyTerm });
        setSatKey(result);
      }
    };

    fetchData();
  }, [satKeyTerm]);



  return (
    <div className={`overlay__personalized_modal ${modal ? 'active' : ''}`}>
      <div className={`popup__personalized_modal ${modal ? 'active' : ''}`}>
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

          <div className='table__personalized'>
            {customData ? (
              <div className='table__numbers'>
                <p className='text'>Total de Ordenes</p>
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
            {customData ? (
              <div className='table__body'>
                {customData.map((quotation: any, index: number) => {
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
                                  checked={customData[index]?.check || false}
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
