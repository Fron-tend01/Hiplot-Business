import React, { useEffect, useState } from 'react'
import useUserStore from '../../../../../zustand/General';
import { companiesRequests } from '../../../../../fuctions/Companies';
import { BranchOfficesRequests } from '../../../../../fuctions/BranchOffices';
import { StoreRequests } from '../../../../../fuctions/Store';
import { useStore } from 'zustand';
import './ModalCreate.css'
import { storeTransfers } from '../../../../../zustand/Transfers';
import { v4 as uuidv4 } from 'uuid';
import { articleRequests } from '../../../../../fuctions/Articles';
import APIs from '../../../../../services/services/APIs';
import Swal from 'sweetalert2';

const ModalCreate: React.FC = () => {
  const userState = useUserStore(state => state.user);
  let user_id = userState.id

  const setModalStateCreate = storeTransfers((state: any) => state.setModalStateCreate);
  const { modalStateCreate }: any = useStore(storeTransfers);

  const { getCompaniesXUsers }: any = companiesRequests();
  const { getBranchOffices }: any = BranchOfficesRequests();
  const { getStore }: any = StoreRequests();

  const [selectCompanies, setSelectCompanies] = useState<boolean>(false);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);

  const [selectBranchOffices, setSelectBranchOffices] = useState<boolean>(false);
  const [selectedBranchOffice, setSelectedBranchOffice] = useState<any>(null);


  const [selectStore, setSelectStore] = useState<boolean>(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);

  const [selectCompaniesTwo, setSelectCompaniesTwo] = useState<boolean>(false);
  const [selectedCompanyTwo, setSelectedCompanyTwo] = useState<number | null>(null);

  const [selectBranchOfficesTwo, setSelectBranchOfficesTwo] = useState<boolean>(false);
  const [selectedBranchOfficeTwo, setSelectedBranchOfficeTwo] = useState<any>(null);


  const [selectStoreTwo, setSelectStoreTwo] = useState<boolean>(false);
  const [selectedStoreTwo, setSelectedStoreTwo] = useState<any>(null);

  const [comments, setComments] = useState<any>()

  const [companies, setCompanies] = useState<any>()
  const [store, setStore] = useState<any>()

  const fetch = async () => {
    let resultCompanies = await getCompaniesXUsers(user_id)
    setCompanies(resultCompanies)

    let resultStore = await getStore(user_id)
    setStore(resultStore)
  }

  useEffect(() => {
    fetch()
  }, [selectedCompany]);

  const [branchOffices, setBranchOffices] = useState<any>()
  const [branchOfficesTwo, setBranchOfficesTwo] = useState<any>()

  const openSelectCompanies = () => {
    setSelectCompanies(!selectCompanies);
  };

  const handleCompaniesChange = async (company: any) => {
    setSelectedCompany(company);
    setSelectCompanies(false);
    let resultBranch = await getBranchOffices(company, user_id)
    await setBranchOffices(resultBranch)
    await setSelectedBranchOffice(resultBranch[0])
    console.log(selectedBranchOffice)
    console.log(branchOffices)
  };


  const openSelectBranchOffices = () => {
    setSelectBranchOffices(!selectBranchOffices);
  };
  const handleBranchOfficesChange = (sucursal: any) => {
    setSelectedBranchOffice(sucursal);
    // Cerrar el select de sucursales
    setSelectBranchOffices(false);
  };

  const openSelectStore = () => {
    setSelectStore(!selectStore);
  };

  const handleStoreChange = (sucursal: any) => {
    setSelectedStore(sucursal);
    // Cerrar el select de sucursales
    setSelectStore(false);
  };


  //  Desitno 
  const openSelectCompaniesTwo = () => {
    setSelectCompaniesTwo(!selectCompaniesTwo);
  };

  const handleCompaniesTwoChange = async (company: any) => {
    setSelectedCompanyTwo(company);
    setSelectCompaniesTwo(false);
    let resultBranch = await getBranchOffices(company, user_id)
    await setBranchOfficesTwo(resultBranch)
    await setSelectedBranchOfficeTwo(resultBranch[0])
    console.log(selectedBranchOffice)
    console.log(branchOffices)
  };


  const openSelectBranchOfficesTwo = () => {
    setSelectBranchOfficesTwo(!selectBranchOfficesTwo);
  };
  const handleBranchOfficesTwoChange = (sucursal: any) => {
    setSelectedBranchOfficeTwo(sucursal);
    // Cerrar el select de sucursales
    setSelectBranchOfficesTwo(false);
  };

  const openSelectStoreTwo = () => {
    setSelectStoreTwo(!selectStoreTwo);
  };

  const handleStoreTwoChange = (store: any) => {
    setSelectedStoreTwo(store);
    // Cerrar el select de sucursales
    setSelectStoreTwo(false);
  };


  const modalClose = () => {
    setModalStateCreate('')
  }

  const [concepts, setConcepts] = useState<any>([])


  const { getArticles }: any = articleRequests()
  const [articles, setArticles] = useState<any>()

  const [selectSearch, setSelectSearch] = useState<boolean>(false)
  const [selectedSearch, setSelectedSearch] = useState<number | null>(null)
  const [nameBy, setNameBy] = useState<string | number>('')

  let searchX = [
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


  const searchFor = async () => {
    let data = {
      id: 0,
      activos: true,
      nombre: selectedSearch == 1 ? nameBy : '',
      codigo: selectedSearch == 0 ? nameBy : '',
      familia: 0,
      proveedor: 0,
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
      let result = await getArticles(data)
      setArticles(result)
    } else if (selectedSearch === 1) {
      let result = await getArticles(data)
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

 

  const addRequisition = () => {
    let data = {
      id_traspaso_almacen: 0,
      nombre: selectedResult.nombre,
      id_articulo: selectedResult.id,
      codigo: selectedResult.codigo,
      descripcion: selectedResult.descripcion,
      unidades: selectedResult.unidades,
      unidad: '',
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
  };




const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
  const value = e.target.value.trim();
  const newArticleStates = [...concepts];
  newArticleStates[index].cantidad = value === '' ? null : parseFloat(value);
  setConcepts(newArticleStates);
};

const handleComentariosChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
  const value = e.target.value;
  const newArticleStates = [...concepts];
  newArticleStates[index].comentarios = value;
  setConcepts(newArticleStates);
};




const modalCreateTrnasfers = async () => {
  let data = {
    id_usuario_crea: user_id,
    id_sucursal: selectedBranchOffice.id,
    id_almacen_origen: selectedStore.id,
    id_sucursal_origen: selectedBranchOffice.id,
    id_sucursal_destino: selectedBranchOfficeTwo.id,
    id_almacen_destino: selectedStoreTwo.id,
    comentarios: comments,
    conceptos: concepts
  };

  try {
    let result: any = await APIs.createTransfers(data)
    if(result.error == true) {
      Swal.fire('Advertencia', result.mensaje, 'warning');
    } else {
      Swal.fire(result.mensaje, '', 'success');
    }
    
  } catch (error) {
    Swal.fire('Error al actualizar el porveedor', '', 'error');
  }
 
}

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


  return (
    <div className={`overlay__transfers ${modalStateCreate == 'create' ? 'active' : ''}`}>
      <div className={`popup__transfers ${modalStateCreate == 'create' ? 'active' : ''}`}>
        <a href="#" className="btn-cerrar-popup__transfers" onClick={modalClose}>
          <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
        </a>
        <p className='title__modals'>Crear nuevo traspaso</p>
        <form className='container__create_transfers' onSubmit={modalCreateTrnasfers}>
          <div className='row__one'>
            <div className='select__container'>
              <label className='label__general'>Empresas</label>
              <div className='select-btn__general'>
                <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                  <div className='select__container_title'>
                    <p>{selectedCompany ? companies.find((s: { id: number }) => s.id === selectedCompany)?.razon_social : 'Selecciona'}</p>
                  </div>
                  <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                </div>
                <div className={`content ${selectCompanies ? 'active' : ''}`} >
                  <ul className={`options ${selectCompanies ? 'active' : ''}`} style={{ opacity: selectCompanies ? '1' : '0' }}>
                    {companies && companies.map((company: any) => (
                      <li key={company.id} onClick={() => handleCompaniesChange(company.id)}>
                        {company.razon_social}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className='select__container'>
              <label className='label__general'>Sucursales origin</label>
              <div className='select-btn__general'>
                <div className={`select-btn ${selectBranchOffices ? 'active' : ''}`} onClick={openSelectBranchOffices} >
                  <div className='select__container_title'>
                    <p>{selectedBranchOffice ? branchOffices.find((s: { id: number }) => s.id === selectedBranchOffice.id)?.nombre : 'Selecciona'}</p>
                  </div>
                  <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                </div>
                <div className={`content ${selectBranchOffices ? 'active' : ''}`} >
                  <ul className={`options ${selectBranchOffices ? 'active' : ''}`} style={{ opacity: selectBranchOffices ? '1' : '0' }}>
                    {branchOffices && branchOffices.map((sucursal: any) => (
                      <li key={sucursal.id} onClick={() => handleBranchOfficesChange(sucursal)}>
                        {sucursal.nombre}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className='select__container'>
              <label className='label__general'>Almacen origin</label>
              <div className='select-btn__general'>
                <div className={`select-btn ${selectStore ? 'active' : ''}`} onClick={openSelectStore} >
                  <div className='select__container_title'>
                    <p>{selectedStore ? store.find((s: { id: number }) => s.id === selectedStore.id)?.nombre : 'Selecciona'}</p>
                  </div>
                  <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                </div>
                <div className={`content ${selectStore ? 'active' : ''}`} >
                  <ul className={`options ${selectStore ? 'active' : ''}`} style={{ opacity: selectStore ? '1' : '0' }}>
                    {store && store.map((store: any) => (
                      <li key={store.id} onClick={() => handleStoreChange(store)}>
                        {store.nombre}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className='select__container'>
              <label className='label__general'>Empresas</label>
              <div className='select-btn__general'>
                <div className={`select-btn ${selectCompaniesTwo ? 'active' : ''}`} onClick={openSelectCompaniesTwo}>
                  <div className='select__container_title'>
                    <p>{selectedCompanyTwo ? companies.find((s: { id: number }) => s.id === selectedCompanyTwo)?.razon_social : 'Selecciona'}</p>
                  </div>
                  <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                </div>
                <div className={`content ${selectCompaniesTwo ? 'active' : ''}`} >
                  <ul className={`options ${selectCompaniesTwo ? 'active' : ''}`} style={{ opacity: selectCompaniesTwo ? '1' : '0' }}>
                    {companies && companies.map((company: any) => (
                      <li key={company.id} onClick={() => handleCompaniesTwoChange(company.id)}>
                        {company.razon_social}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className='select__container'>
              <label className='label__general'>Sucursales destino</label>
              <div className='select-btn__general'>
                <div className={`select-btn ${selectBranchOfficesTwo ? 'active' : ''}`} onClick={openSelectBranchOfficesTwo} >
                  <div className='select__container_title'>
                    <p>{selectedBranchOfficeTwo ? branchOfficesTwo.find((s: { id: number }) => s.id === selectedBranchOfficeTwo.id)?.nombre : 'Selecciona'}</p>
                  </div>
                  <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                </div>
                <div className={`content ${selectBranchOfficesTwo ? 'active' : ''}`} >
                  <ul className={`options ${selectBranchOfficesTwo ? 'active' : ''}`} style={{ opacity: selectBranchOfficesTwo ? '1' : '0' }}>
                    {branchOfficesTwo && branchOfficesTwo.map((sucursal: any) => (
                      <li key={sucursal.id} onClick={() => handleBranchOfficesTwoChange(sucursal)}>
                        {sucursal.nombre}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className='select__container'>
              <label className='label__general'>Almacen destino</label>
              <div className='select-btn__general'>
                <div className={`select-btn ${selectStoreTwo ? 'active' : ''}`} onClick={openSelectStoreTwo} >
                  <div className='select__container_title'>
                    <p>{selectedStoreTwo ? store.find((s: { id: number }) => s.id === selectedStoreTwo.id)?.nombre : 'Selecciona'}</p>
                  </div>
                  <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                </div>
                <div className={`content ${selectStoreTwo ? 'active' : ''}`} >
                  <ul className={`options ${selectStoreTwo ? 'active' : ''}`} style={{ opacity: selectStoreTwo ? '1' : '0' }}>
                    {store && store.map((store: any) => (
                      <li key={store.id} onClick={() => handleStoreTwoChange(store)}>
                        {store.nombre}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className='row__four'>
            <div className='input__modal_store'>
              <div className='inputs__company'>
                <label className='label__general'>Comentarios</label>
                <input className='inputs__general' value={comments} onChange={(e) => setComments(e.target.value)} type='text' placeholder='Comentarios' />
              </div>
            </div>
          </div>
          <div className='row__two'>
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
            <div>
              <button className='btn__general-purple' type='button' onClick={searchFor}>Buscar</button>
            </div>
          </div>
          <div className='row__three'>
            <div className='select__container'>
              <label className='label__general'>Resultado</label>
              <div className='select-btn__general'>
                <div className={`select-btn ${selectResults ? 'active' : ''}`} onClick={openSelectResults} >
                  <p>{selectedResult ? articles.find((s: { id: number }) => s.id === selectedResult.id)?.nombre : 'Selecciona'}</p>
                  <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                </div>
                <div className={`content ${selectResults ? 'active' : ''}`} >
                  <ul className={`options ${selectResults ? 'active' : ''}`} style={{ opacity: selectResults ? '1' : '0' }}>
                    {articles && articles.map((result: any) => (
                      <li key={result.id} onClick={() => handleResultsChange(result)}>
                        {result.nombre}
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
                    <p className='table__store_title'>Nombre</p>
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
                  {concepts.map((concept: any,  index: any) => (
                    <div className='tbody' key={index}>
                      <p>{concept.nombre}</p>
                      <div>
                        <input className='inputs__general' value={concept.cantidad} onChange={(e) => handleAmountChange(e, index)} type="number"  placeholder='Cantidad' />
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
                        <input className='inputs__general' value={concept.comentarios == '' ? '' : concept.comentarios} onChange={(e) => handleComentariosChange(e, index)} type="text"  placeholder='Comentarios' />
                      </div>
                      <button className='btn__general-purple' type='button' onClick={() => seeStock(concept, index)}>conceptos</button>
                      <button className='btn__general-danger'>Eliminar</button>
                      <div className={`overlay__modal_transfers-concepts_see-stock ${modalSeeStocks[index] ? 'active' : ''}`}>
                          <div className={`popup__modal_transfers-concepts_see-stock ${modalSeeStocks[index] ? 'active' : ''}`}>
                              <a href="#" className="btn-cerrar-popup__modal_transfers-concepts_see-stock" onClick={() => closeModalSeeStocks(index)}>
                                  <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
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
                                              <svg xmlns="http://www.w3.org/2000/svg" width='20' fill='#D9D9D9' viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                              <p>Este articulo no sele asingno almacen</p>
                                          </div>
                                          :
                                          ''}
                                          <div className='table__head'>
                                              
                                              <div className='thead'>
                                              <div className='th'>
                                                  <p className=''>Nombre</p>
                                              </div>
                                              <div className='th'>
                                                  <p className=''>Cantidad de stocks</p>
                                              </div>
                                              
                                              </div>
                                          </div>
                                          {concept.stocks && concept.stocks.length > 0 ? (
                                              <div className='table__body'>
                                              {concept.stocks && concept.stocks.map((x: any, index: any) => (
                                                  <div className='tbody__container' key={index}>
                                                  <div className='tbody'>
                                                      <div className='td'>
                                                          {x.nombre}
                                                      </div>
                                                      <div className='td'>
                                                          {x.stock}
                                                      </div>
                                                      <div className='td'>
                                                          {x.cantidad}
                                                      </div>
                                                      <div className='td'>
                                                          {x.descripcion}
                                                      </div>
                                                      
                                                  </div>
                                                  
                                              </div>
                                              ))}
                                          </div>
                                          ) : (
                                              <p className='text'>No hay conceptos</p>
                                          )}
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
              <button className='btn__general-purple' type='submit' >Reaizar traspaso</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalCreate
