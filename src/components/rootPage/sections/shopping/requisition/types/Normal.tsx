import React, { useState } from 'react'
import { articleRequests } from '../../../../../../fuctions/Articles'
import './styles/Normal.css'
import { storeRequisitions } from '../../../../../../zustand/Requisition'
import { useStore } from 'zustand';
import { storeArticles } from '../../../../../../zustand/Articles';
import LoadingInfo from '../../../../../loading/LoadingInfo';

const Normal: React.FC = () => {

  const setConcepts = storeRequisitions((state: any) => state.setConcepts);

  const { selectedBranchOffice, concepts }: any = useStore(storeRequisitions);


  const { getArticles }: any = articleRequests()
  const [articles, setArticles] = useState<any>()

  const [selectSearch, setSelectSearch] = useState<boolean>(false)
  const [selectedSearch, setSelectedSearch] = useState<number>(0)
  const [nameBy, setNameBy] = useState<string | number>('')

  const searchX = [
    {
      id: 0,
      name: 'Código'
    },
    {
      id: 1,
      name: 'Descripcion'
    },
  ]

  const openSelectSearch = () => {
    setSelectSearch(!selectSearch)
  }

  const handleSearchChange = (search: any) => {
    setSelectedSearch(search.id)
    setSelectSearch(false)
  }

  const modalLoading = storeArticles((state: any) => state.modalLoading);
  const setModalLoading = storeArticles((state: any) => state.setModalLoading);


  const searchFor = async () => {
    const data = {
      id: 0,
      activos: true,
      nombre: selectedSearch == 1 ? nameBy : '',
      codigo: selectedSearch == 0 ? nameBy : '',
      familia: 0,
      proveedor: 0,
      materia_prima: 0,
      get_sucursales: false,
      get_proveedores: false,
      get_max_mins: true,
      get_plantilla_data: false,
      get_stock: false,
      get_web: false,
      get_unidades: true
    }
    setModalLoading(true)
    await getArticles(data).then((resp: any) => {
      setModalLoading(false)
      setArticles(resp)
      console.log('respppppp',resp);
      
      setSelectedResult(resp[0])
    }).catch(() => {
      setModalLoading(false)
    })
  }
  

  const [selectResults, setSelectResults] = useState<boolean>(false)
  const [selectedResult, setSelectedResult] = useState<any>('')



  const handleResultsChange = (result: any) => {
    setSelectedResult(result)
    setSelectResults(false)
  }

  const openSelectResults = () => {
    setSelectResults(!selectResults)
  }


  const addRequisition = () => {

    console.log(selectedResult)

    let max;
    if (selectedResult.max_mins.find((x: any) => x.id_sucursal == selectedBranchOffice)) {
      const mm_tmp = selectedResult.max_mins.filter((x: any) => x.id_sucursal == x.id_sucursal)
      selectedResult.max_min = mm_tmp[0].maximo + ' - ' + mm_tmp[0].minimo
      max = mm_tmp[0].maximo + ' - ' + mm_tmp[0].minimo
    } else {
      max = selectedResult.max_min = 'N/A'

    }
    const id_articulo = selectedResult.id
    const codigo = selectedResult.codigo
    const descripcion = selectedResult.descripcion
    const unidades = selectedResult.unidades
    const unidad = selectedResult.unidades[0].id_unidad
    const max_min = max
    setConcepts([...concepts, { codigo, descripcion, max_min, id_articulo, cantidad: null, unidad, unidades, comentarios: '', max_mins: selectedResult.max_mins }]);
  }


  // const deleteResult = (itemId: number) => {
  //   const updatedNewRequisition = newRequisition.filter((item: any) => item !== itemId);
  //   setNewRequisition(updatedNewRequisition);
  // };




  return (
    <div className='normal'>
      <div className='row__one'>
        <div className='select__container'>
          <label className='label__general'>Buscar por</label>
          <div className='select-btn__general'>
            <div className={`select-btn ${selectSearch ? 'active' : ''}`} onClick={openSelectSearch} >
              <p>{selectedSearch !== null ? searchX?.find((s: { id: number }) => s.id === selectedSearch)?.name : 'selecciona'}</p>
              <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
            </div>
            <div className={`content ${selectSearch ? 'active' : ''}`} >
              <ul className={`options ${selectSearch ? 'active' : ''}`} style={{ opacity: selectSearch ? '1' : '0' }}>
                {searchX?.map((search: any) => (
                  <li key={search.id} onClick={() => handleSearchChange(search)}>
                    {search.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div>
          <label className='label__general'>Escribe tu busqueda</label>
          <input className='inputs__general' type='text' value={nameBy} onChange={(e) => setNameBy(e.target.value)} placeholder='Ingresa el nombre' onKeyUp={(e) => e.key === 'Enter' && searchFor()} />
        </div>
        <div>
          <button className='btn__general-purple' type='button' onClick={searchFor}>Buscar</button>
        </div>
      </div>
      <div className='row__two'>
        <div className='select__container'>
          <label className='label__general'>Resultado</label>
          <div className='select-btn__general'>
            <div className={`select-btn ${selectResults ? 'active' : ''}`} onClick={openSelectResults} >
              <p>{selectedResult ? articles.find((s: { id: number }) => s.id === selectedResult.id)?.descripcion : 'Selecciona'}</p>
              <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
            </div>
            <div className={`content ${selectResults ? 'active' : ''}`} >
              <ul className={`options ${selectResults ? 'active' : ''}`} style={{ opacity: selectResults ? '1' : '0' }}>
                {articles && articles.map((result: any) => (
                  <li key={result.id} onClick={() => handleResultsChange(result)}>
                    ({result.codigo}) {result.descripcion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className='container__btn_modal_create-requisition'>
          <button className='btn__general-purple' type='button' onClick={addRequisition}>Agregar</button>
        </div>

      </div>
      {modalLoading == true ? (
                <LoadingInfo />
            ) :
                ''}
    </div>
  )
}

export default Normal
