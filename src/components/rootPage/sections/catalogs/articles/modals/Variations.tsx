import React, { useEffect, useState } from 'react'
import { storeArticles } from '../../../../../../zustand/Articles'
import { useStore } from 'zustand'
import { articleRequests } from '../../../../../../fuctions/Articles'
import './style/Variations.css'

const Variations: React.FC = () => {

  const setSubModal = storeArticles(state => state.setSubModal)

  const { subModal }: any = useStore(storeArticles)

  const setVariations = storeArticles((state) => state.setVariations);
  const setDeleteVariations = storeArticles((state) => state.setDeleteVariations);

  const { variations, articleToUpdate, deleteVariations }: any = useStore(storeArticles);

  const { getArticles }: any = articleRequests()
  const [articles, setArticles] = useState<any>()

  const [selectSearch, setSelectSearch] = useState<boolean>(false)
  const [selectedSearch, setSelectedSearch] = useState<number | null>(null)
  const [nameBy, setNameBy] = useState<string | number>('')

  const searchX = [
    {
      id: 0,
      name: 'Código'
    },
    {
      id: 1,
      name: 'Nombre'
    },



  ]

  const openSelectSearch = () => {
    setSelectSearch(!selectSearch)
  }

  const handleSearchChange = (search: any) => {
    setSelectedSearch(search.id)
    setSelectSearch(false)
  }

  useEffect(() => {
    if (articleToUpdate) {
      setViewVariations(articleToUpdate.variaciones)
    }
  }, [articleToUpdate])

  const searchFor = async () => {
    const data = {
      id: 0,
      activos: true,
      nombre: selectedSearch == 1 ? nameBy : '',
      codigo: selectedSearch == 0 ? nameBy : '',
      familia: 0,
      proveedor: 0,
      materia_prima: 99,
      get_sucursales: false,
      get_proveedores: true,
      get_max_mins: true,
      get_plantilla_data: false,
      get_stock: false,
      get_web: false,
      get_unidades: true
    }
    if (selectedSearch === 0) {
      const result = await getArticles(data)
      setArticles(result)
    } else if (selectedSearch === 1) {
      const result = await getArticles(data)
      setArticles(result)
    }
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


  const [viewVariations, setViewVariations] = useState<any>([])



  const addRequisition = () => {

    const articleData = {
      id_articulo: selectedResult.id,
      codigo: selectedResult.codigo,
      descripcion: selectedResult.descripcion,
      nombre: selectedResult.nombre
    };



    setViewVariations([...viewVariations, articleData])
    setVariations([...variations, selectedResult.id]);
  }


  const handleCreateTypeOfPayments = () => {

  }

  const deleteVariationss = (item: any) => {
    const filtered = viewVariations.filter((x: any) => x.id !== item.id);

    setViewVariations(filtered);

    // Solo dejar los ids restantes en variations
    const updatedIds = filtered.map((x: any) => x.id_articulo || x.id);
    setVariations(updatedIds);

    // Si viene del backend (tiene un id real), agregar su id a deleteVariations
    if (item.id) {
      debugger
      const uniqueDeleteIds = new Set([...deleteVariations, item.id]);
      setDeleteVariations(Array.from(uniqueDeleteIds));
    }
  };

  return (
    <div className={`overlay__create_modal_variations ${subModal == 'create_modal_variations' ? 'active' : ''}`}>
      <div className={`popup__create_modal_variations ${subModal == 'create_modal_variations' ? 'active' : ''}`}>
        <div className='header__modal'>
          <a href="#" className="btn-cerrar-popup__create_modal_variations" onClick={() => setSubModal('')} >
            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
          </a>
          <p className='title__modals'>Variación</p>
        </div>
        <div className='conatiner__create_modal_variations' onSubmit={handleCreateTypeOfPayments}>
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
              <label className='label__general'>Buscador por nombre</label>
              <input className='inputs__general' type='text' value={nameBy} onChange={(e) => setNameBy(e.target.value)} placeholder='Ingresa el nombre' />
            </div>
            <div className='d-flex align-items-end'>
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
                    {articles?.map((result: any) => (
                      <li key={result.id} onClick={() => handleResultsChange(result)}>
                        {result.descripcion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className='d-flex align-items-end'>
              <button className='btn__general-purple' type='button' onClick={addRequisition}>Agregar</button>
            </div>
          </div>
          <div className='table__variations_modal' >
            <div>
              <div>
                {viewVariations ? (
                  <div className='table__numbers'>
                    <p className='text'>Total de variaciones</p>
                    <div className='quantities_tables'>{viewVariations.length}</div>
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
                  </div>
                </div>
              </div>
              {viewVariations?.length > 0 ? (
                <div className='table__body'>
                  {viewVariations?.map((item: any, index: any) => (
                    <div className='tbody__container' key={index}>
                      <div className='tbody'>
                        <div className='td'>
                          {item.codigo}
                        </div>
                        <div className='td'>
                          {item.descripcion}
                        </div>
                        <div className='td'>
                          <button className='btn__delete_users' type='button' onClick={() => deleteVariationss(item)}>Eliminar</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text'>No hay máximos y mínimos que mostrar</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Variations
