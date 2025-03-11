import React, { useEffect, useState } from 'react'
import useUserStore from '../../../../../zustand/General';
import { StoreRequests } from '../../../../../fuctions/Store';
import { useStore } from 'zustand';
import './ModalCreate.css'
import { storeTransfers } from '../../../../../zustand/Transfers';
import Select from '../../../Dynamic_Components/Select';
import { articleRequests } from '../../../../../fuctions/Articles';
import APIs from '../../../../../services/services/APIs';
import Swal from 'sweetalert2';
import Empresas_Sucursales from '../../../Dynamic_Components/Empresas_Sucursales';
import { useSelectStore } from '../../../../../zustand/Select';
import { storeArticles } from '../../../../../zustand/Articles';

const ModalCreate: React.FC = () => {
  const userState = useUserStore(state => state.user);
  const user_id = userState.id

  const setModalStateCreate = storeTransfers((state: any) => state.setModalStateCreate);
  const { modalStateCreate, dates }: any = useStore(storeTransfers);

  const setTransfers = storeTransfers((state: any) => state.setTransfers);

  const { getStore }: any = StoreRequests();


  const [selectStore, setSelectStore] = useState<any>(false);
  const [selectStoreTwo, setSelectStoreTwo] = useState<any>(false);

  const [comments, setComments] = useState<any>()

  const selectedIds: any = useSelectStore((state) => state.selectedIds);
  const setSelectedId = useSelectStore((state) => state.setSelectedId);

  // const [store, setStore] = useState<any>()

  const fetch = async () => {
    const resultStore = await getStore(user_id)
    // setStore(resultStore)
    setSelectStore({
      selectName: 'Almacen origin',
      options: 'nombre',
      dataSelect: resultStore
    })

    setSelectStoreTwo({
      selectName: 'Almacen Destino',
      options: 'nombre',
      dataSelect: resultStore
    })

    setSelectedId('almacen_origin', { id: resultStore[0]?.id })
    setSelectedId('almacen_destino', { id: resultStore[0]?.id })
  }

  useEffect(() => {
    fetch()
    if (selectedIds) {
      setSelectedId('company_desde', 0)
      setSelectedId('store_desde', 0)
      setSelectedId('company_hasta', 0)
      setSelectedId('store_hasta', 0)
    }
  }, []);

  console.log(selectedIds)


  const modalClose = () => {
    setModalStateCreate('')
  }

  const [concepts, setConcepts] = useState<any>([])


  const { getArticles }: any = articleRequests()
  const [articles, setArticles] = useState<any>()

  const [selectSearch, setSelectSearch] = useState<boolean>(false)
  const [selectedSearch, setSelectedSearch] = useState<number | null>(0)
  const [nameBy, setNameBy] = useState<string | number>('')

  const searchX = [
    {
      id: 0,
      name: 'Descripcion'
    },
    {
      id: 1,
      name: 'Codigo'
    },
  ]

  const openSelectSearch = () => {
    setSelectSearch(!selectSearch)
  }

  const handleSearchChange = (search: any) => {
    setSelectedSearch(search.id)
    setSelectSearch(false)
  }


  const searchFor = async () => {
    const data = {
      id: 0,
      activos: true,
      nombre: selectedSearch == 0 ? nameBy : '',
      codigo: selectedSearch == 1 ? nameBy : '',
      familia: 0,
      proveedor: 0,
      page: 1,
      materia_prima: 0,
      get_sucursales: false,
      get_proveedores: true,
      get_max_mins: true,
      get_plantilla_data: false,
      get_stock: true,
      get_web: false,
      get_unidades: true,
      id_usuario: user_id
    }
    if (selectedSearch === 0) {
      setModalLoading(true)
      const result = await getArticles(data)
      setModalLoading(false)
      setArticles(result)
      setSelectedResult(result[0])
    } else if (selectedSearch === 1) {
      const result = await getArticles(data)
      setModalLoading(true)
      setArticles(result)
      setModalLoading(false)
      setSelectedResult(result[0])
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



  const addRequisition = () => {
    const data = {
      id_traspaso_almacen: 0,
      nombre: selectedResult.nombre,
      id_articulo: selectedResult.id,
      codigo: selectedResult.codigo,
      descripcion: selectedResult.descripcion,
      unidades: selectedResult.unidades,
      unidad: selectedResult.unidades[0].id_unidad,
      cantidad: '',
      comentarios: '',
      stocks: selectedResult.stock
    }

    setConcepts([...concepts, data]);
  }

  const [selectedUnit, setSelectedUnit] = useState<string[]>([]);

  const handleUnits = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const valueUnit = event.target.value;
    console.log(valueUnit)
    concepts[index].unidad = parseInt(valueUnit, 10);
    // Crear una copia del arreglo de selecciones temporales
    const newSelected = [...selectedUnit];
    // Actualizar el valor seleccionado en la posición del índice correspondiente
    newSelected[index] = valueUnit;
    // Actualizar el estado con las nuevas selecciones
    setSelectedUnit(newSelected);
    const newArticleStates = [...concepts];
    newArticleStates[index].cantidad = 0;
    setConcepts(newArticleStates);
  };



  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = Number.isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value);
    if (selectedIds.almacen_origin == null) {
      Swal.fire('Notificacion', 'Selecciona un almacen de Origen', 'warning')
      const newArticleStates = [...concepts];
      newArticleStates[index].cantidad = 0;
      setConcepts(newArticleStates);
      return
    }
    const newArticleStates = [...concepts];
    newArticleStates[index].cantidad = value;

    const stocks = concepts[index].stocks;
    const almacen_predeterminado = selectedIds?.almacen_origin;

    const filter = stocks.filter((x: any) => x.id === almacen_predeterminado.id);

    if (filter) {
      const equivalencias = filter[0].equivalencias.filter((x: any) => x.id_unidad == newArticleStates[index].unidad)
      console.log('value', value);
      console.log('canti', equivalencias[0].cantidad);

      if (value > equivalencias[0].cantidad) {
        const newArticleStates = [...concepts];
        newArticleStates[index].cantidad = 0;
        setConcepts(newArticleStates);
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: 'La cantidad ingresada supera el stock disponible'
        });
      } else {
        const newArticleStates = [...concepts];
        newArticleStates[index].cantidad = value;
        setConcepts(newArticleStates);
      }
      return
    } else {
      console.log('El almacen no existe')
    }

  };

  const handleComentariosChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    const newArticleStates = [...concepts];
    newArticleStates[index].comentarios = value;
    setConcepts(newArticleStates);
  };
  const setModalLoading = storeArticles((state: any) => state.setModalLoading);

  const modalCreateTrnasfers = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setModalLoading(true)
    // Datos para crear el traspaso
    const transferData = {
      id_usuario_crea: user_id,
      id_sucursal: branchOffices.id,
      id_almacen_origen: selectedIds.almacen_origin.id,
      id_sucursal_origen: branchOffices.id,
      id_sucursal_destino: branchOfficesTwo.id,
      id_almacen_destino: selectedIds.almacen_destino.id,
      comentarios: comments,
      conceptos: concepts,
    };

    try {
      const result: any = await APIs.createTransfers(transferData);

      if (result.error) {
        setModalLoading(false)

        // Si hay un error en la creación, mostramos el mensaje
        Swal.fire('Advertencia', result.mensaje, 'warning');
      } else {
        // Datos para obtener los traspasos
        const data = {
          id_usuario: user_id,
          id_almacen: 0,  // Se puede ajustar dependiendo de la lógica de tu aplicación
          id_sucursal: 0, // Lo mismo aquí
          status: 0,
          desde: dates[0],
          hasta: dates[1],
        };

        // Obtener los traspasos después de crear uno
        const response: any = await APIs.getTransfers(data);
        setTransfers(response)
        console.log('result.mensaje', response.mensaje)
        setModalLoading(false)

        Swal.fire('Traspaso exitoso', result.mensaje, 'success');
        setModalStateCreate('')
        return
      }
    } catch (error: any) {
      // Manejo del error de la API
      setModalLoading(false)

      Swal.fire('Error al hacer el traspaso', error.message || '', 'error');
    }
  };


  const [modalSeeStocks, setModalSeeStocks] = useState<boolean[]>([]);

  const [setModalIndex] = useState<any>(false);

  const seeStock = (x: any, index: any) => {
    setModalSeeStocks((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
    setModalIndex(index);
    console.log(x)
  };

  const closeModalSeeStocks = (index: any) => {
    setModalSeeStocks((prev: any) => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });
  };


  const [companies, setCompanies] = useState<any>()
  const [branchOffices, setBranchOffices] = useState<any>()
  const [companiesTwo, setCompaniesTwo] = useState<any>()
  const [branchOfficesTwo, setBranchOfficesTwo] = useState<any>()

  const deleteConcepts = (indextwo: any) => {
    const filter = concepts.filter((_: number, index: number) => index !== indextwo)
    setConcepts(filter)
  }
  useEffect(() => {
    if (selectedIds != null) {
      if (selectedIds.almacen_origin) {

        concepts.forEach((_: any, index: number) => {
          const newArticleStates = [...concepts];
          newArticleStates[index].cantidad = 0;
          setConcepts(newArticleStates);
        });
      }
    }
  }, [selectedIds])
  return (
    <div className={`overlay__transfers ${modalStateCreate == 'create' ? 'active' : ''}`}>
      <div className={`popup__transfers ${modalStateCreate == 'create' ? 'active' : ''}`}>
        <a href="#" className="btn-cerrar-popup__transfers" onClick={modalClose}>
          <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
        </a>
        <p className='title__modals'>Crear nuevo traspaso</p>
        <div className='container__create_transfers'>
          <div className='row card-body bg-standar'>
            <div className='col-8'>
              <Empresas_Sucursales empresaDyn={companies} sucursalDyn={branchOffices} setEmpresaDyn={setCompanies} setSucursalDyn={setBranchOffices} modeUpdate={false} />
            </div>
            <div className='col-4'>
              <Select dataSelects={selectStore} instanceId='almacen_origin' nameSelect={'Almacen origin'} />
            </div>
          </div>
          <div className='row my-4 card-body bg-standar'>
            <div className='col-8'>
              <Empresas_Sucursales empresaDyn={companiesTwo} sucursalDyn={branchOfficesTwo} setEmpresaDyn={setCompaniesTwo} setSucursalDyn={setBranchOfficesTwo} modeUpdate={false} />
            </div>
            <div className='col-4'>
              <Select dataSelects={selectStoreTwo} instanceId='almacen_destino' nameSelect={'Almacen destino'} />
            </div>
          </div>
          <div className='row__four card-body bg-standar'>
            <div className='input__modal_store'>
              <div className='inputs__company'>
                <label className='label__general'>Comentarios</label>
                <input className='inputs__general' value={comments} onChange={(e) => setComments(e.target.value)} type='text' placeholder='Comentarios' />
              </div>
            </div>
          </div>
          <div className='row__two card-body bg-standar'>
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
              <input className='inputs__general' type='text' value={nameBy} onChange={(e) => setNameBy(e.target.value)} placeholder='Ingresa el nombre' onKeyUp={(e) => e.key === 'Enter' && searchFor()} />
            </div>
            <div>
              <button className='btn__general-purple' type='button' onClick={searchFor}>Buscar</button>
            </div>
          </div>
          <div className='row__three card-body bg-standar'>
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
                        {result.descripcion}
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

          <div className='conatiner__table_transers'>
            <div className='table__modal_transfers'>
              <div className='table__numbers'>
                <p className='text'>Total de sucursales</p>
                <div className='quantities_tables'>{concepts && concepts.length}</div>
              </div>
              <div className='table__head'>
                <div className='thead'>
                  <div className='th'>
                    <p className='table__store_title'>Articulo</p>
                  </div>
                  <div className='th'>
                    <p className='table__store_title'>Cantidad</p>
                  </div>
                  <div className='th'>
                    <p className='table__store_title'>Unidad</p>
                  </div>
                  <div className='th'>
                    <p className='table__store_title'>Comentarios</p>
                  </div>
                </div>
              </div>
              {concepts && concepts.length > 0 ? (
                <div className='container__branchOffice_table-modal'>
                  {concepts.map((concept: any, index: any) => (
                    <div className='tbody' key={index}>
                      <p>{concept.codigo}-{concept.descripcion}</p>
                      <div>
                        <input className='inputs__general' value={concept.cantidad} onChange={(e) => handleAmountChange(e, index)} type="number" placeholder='Cantidad' onWheel={(e) => e.currentTarget.blur()}/>
                      </div>
                      <div>
                        <select className='traditional__selector' onChange={(event) => handleUnits(event, index)} value={selectedUnit[index] || ''}>
                          {concept.unidades && concept.unidades.map((item: any) => (
                            <option key={item.id} value={item.id_unidad}>
                              {item.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <input className='inputs__general' value={concept.comentarios == '' ? '' : concept.comentarios} onChange={(e) => handleComentariosChange(e, index)} type="text" placeholder='Comentarios' />
                      </div>
                      <button className='btn__general-purple' type='button' onClick={() => seeStock(concept, index)}>Stocks</button>
                      <button className='btn__general-danger' type='button' onClick={() => deleteConcepts(index)}>Eliminar</button>
                      <div className={`overlay__modal_transfers-concepts_see-stock ${modalSeeStocks[index] ? 'active' : ''}`}>
                        <div className={`popup__modal_transfers-concepts_see-stock ${modalSeeStocks[index] ? 'active' : ''}`}>
                          <a href="#" className="btn-cerrar-popup__modal_transfers-concepts_see-stock" onClick={() => closeModalSeeStocks(index)}>
                            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                          </a>
                          <div className='container__modal_transfers-concepts_see-stock'>

                            <div className='table__modal_transfers-concepts_see-stock'>
                              <div>
                                {concept.stocks ? (
                                  <div className='table__numbers'>
                                    <p className='text'>Total de stocks</p>
                                    <div className='quantities_tables'>{concept.stocks && concept.stocks.length}</div>
                                  </div>
                                ) : (
                                  <p className='text'>No hay stock</p>
                                )}
                              </div>
                              {concept.storeWarning ?
                                <div className='store-warning'>
                                  <svg xmlns="http://www.w3.org/2000/svg" width='20' fill='#D9D9D9' viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" /></svg>
                                  <p>Este articulo no sele asingno almacen</p>
                                </div>
                                :
                                ''}
                              <table className='table '>
                                <thead className='thead'>
                                  <tr>
                                    <th>Nombre </th>
                                    {/* Agrega una columna para cada equivalencia, si existe */}
                                    {console.log(concept)}
                                    {concept.stocks?.[0]?.equivalencias?.map((equivalencia: any, eqIndex: number) => (
                                      <th key={eqIndex}>{equivalencia.nombre_unidad}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {concept.stocks?.length > 0 ? (
                                    concept.stocks.map((x: any, index: number) => (
                                      <tr key={index} className='table__body'>
                                        <td>{x.nombre}</td>
                                        {/* Mostrar valores de equivalencias en columnas adicionales */}
                                        {x.equivalencias && x.equivalencias.length > 0 ? (
                                          x.equivalencias.map((equivalencia: any, eqIndex: number) => (
                                            <td key={eqIndex}>{equivalencia.cantidad}</td>
                                          ))
                                        ) : (
                                          <td colSpan={x.equivalencias?.length || 1}>No hay equivalencias</td>
                                        )}
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td >No hay conceptos</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text'>Sin sucursales agregadas</p>
              )}
            </div>
            <div className='container__btn_create-store'>
              <button className='btn__general-purple' onClick={(e)=>modalCreateTrnasfers(e)}>Realizar traspaso</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalCreate
