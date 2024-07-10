import React, { useEffect, useState } from 'react'
import useUserStore from '../../../../../zustand/General'
import { companiesRequests } from '../../../../../fuctions/Companies'
import { BranchOfficesRequests } from '../../../../../fuctions/BranchOffices'
import { StoreRequests } from '../../../../../fuctions/Store'
import ByOrder from './Types/ByOrder'
import Direct from './Types/Direct'
import './ModalCreate.css'
import { storeWarehouseExit } from '../../../../../zustand/WarehouseExit'
import { useStore } from 'zustand';
import { WarehouseExitRequests } from '../../../../../fuctions/WarehouseExit'


const ModalCreate: React.FC = () => {
  const userState = useUserStore(state => state.user);
  let user_id = userState.id

  
  const {createWarehouseExit}: any = WarehouseExitRequests()

  const { concepts, setConcepts }: any = useStore(storeWarehouseExit)

  const [comments, setComments] = useState<string>('')


  const { getCompaniesXUsers }: any = companiesRequests()
  const [companies, setCompanies] = useState<any>()

  const {getBranchOffices}: any = BranchOfficesRequests()
  const [setBranchOffices] = useState<any>()

  const {getStore}: any =StoreRequests()
  const [store, setStore] = useState<any>()

  const fecht = async () => {
    let companies = await getCompaniesXUsers(user_id)
    let store = await getStore(user_id)
    setStore(store)
    setCompanies(companies)
  }

  useEffect(() => {
    fecht()
  }, [])

////////////////////////////////////////////////Select de empresas /////////////////////////////////////////////////////////
  const [selectCompanies, setSelectCompanies] = useState<boolean>(false)
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null)
  
  const openSelectCompanies = () => {
    setSelectCompanies(!selectCompanies)
  }

  const handleCompaniesChange = async (company: any) => {
    setSelectedCompany(company.id)
    setSelectCompanies(false)
    let branchOffices = await getBranchOffices(company.id, user_id)
    setBranchOffices(branchOffices)
    const filter = branchOffices.filter((x: any) => x.empresa_id === company.id)
    setFilteredBranchOffices(filter)
    setSelectedBranchOffice(filter.length > 0 ? filter[0].id : null);

  }



  ////////////////////////////////////////////////Select de empresas /////////////////////////////////////////////////////////
  const [filteredBranchOffices, setFilteredBranchOffices] = useState<any[]>([])

  const [selectBranchOffices, setSelectBranchOffices] = useState<boolean>(false)
  const [selectedBranchOffice, setSelectedBranchOffice] = useState<number | null>(null)
  

  const openSelectBranchOffices = () => {
    setSelectBranchOffices(!selectBranchOffices)
  }

  const handleBranchOfficesChange = (sucursal: any) => {
    console.log(sucursal)
  }

  const [selectedOption, setSelectedOption] = useState<any>('direct')

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  }



////////////////////////////////////////////////Select de empresas /////////////////////////////////////////////////////////
  const [selectStore, setSelectStore] = useState<any>()
  const { selectedStore, setSelectedStore }: any = useStore(storeWarehouseExit)

  const openselectStore = () => {
    setSelectStore(!selectStore)
  }

  const handleStoreChange = (store: any) => {
    setSelectedStore(store.id)
    setSelectStore(false)
  }


//   const [stocks, setStocks] = useState<any>([])
  const [units, setUnits] =  useState<any>([])
  
  const deleteItem = (item: any) => {
    console.log(item)
  }

  const handleComentariosChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    const newArticleStates = [...concepts];
    newArticleStates[index].comentarios = value;
    setConcepts(newArticleStates);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.trim();
    const newArticleStates = [...concepts];
    newArticleStates[index].cantidad = value === '' ? null : parseFloat(value);
    setConcepts(newArticleStates);
  };

//   const handleStore = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
//     const value = parseInt(event.target.value, 10);
//     concepts[index].pedido_almacen_concepto_id = value;
//     const newStock: any = [...concepts];
//     newStock[index] = value
//     setStocks(newStock);

//   };

  const handleUnits = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const value = parseInt(event.target.value, 10);
    concepts[index].unidad = value;
    const newUnit: any = [...concepts];
    newUnit[index] = value
    // Actualizar el estado con las nuevas selecciones
    setUnits(newUnit);
  };

  const handleCreateWarehouseExit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    let data = {
        id_usuario_crea: user_id,
        id_sucursal: selectedBranchOffice,
        id_almacen: selectedStore,
        comentarios: comments,
        conceptos: concepts
    };

    await createWarehouseExit(data) 
      
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
    <form className='conatiner__create_warehouse-exit' onSubmit={handleCreateWarehouseExit}>
   
      <div className="row__one">
            <div className='container__checkbox_tickets'>
                <div className='checkbox__tickets'>
                    <label className="checkbox__container_general">
                    <input className='checkbox' type="radio" value="direct" checked={selectedOption === 'direct'} onChange={handleOptionChange} />
                        <span className="checkmark__general"></span>
                    </label>
                    <p className='text'>Directa</p>
                </div>
                <div className='checkbox__tickets'>
                    <label className="checkbox__container_general">
                    <input className='checkbox' type="radio" value="byorder" checked={selectedOption === 'byorder'} onChange={handleOptionChange} />
                        <span className="checkmark__general"></span>
                    </label>
                    <p className='text'>Por pedido</p>
                </div>
            </div>
        </div>
        <div className="row__two">
            <div className='select__container'>
                <label className='label__general'>Empresas</label>
                <div className='select-btn__general'>
                    <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                        <div className='select__container_title'>
                            <p>{selectedCompany ? companies.find((s: {id: number}) => s.id === selectedCompany)?.razon_social : 'Selecciona'}</p>
                        </div>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                    </div>
                    <div className={`content ${selectCompanies ? 'active' : ''}`} >
                        <ul className={`options ${selectCompanies ? 'active' : ''}`} style={{ opacity: selectCompanies ? '1' : '0' }}>
                        {companies && companies.map((company: any) => (
                            <li key={company.id} onClick={() => handleCompaniesChange(company)}>
                                {company.razon_social}
                            </li>
                        ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className='select__container'>
                <label className='label__general'>Sucursales</label>
                <div className='select-btn__general'>
                    <div className={`select-btn ${selectBranchOffices ? 'active' : ''}`} onClick={openSelectBranchOffices} >
                        <div className='select__container_title'>
                            <p>{selectedBranchOffice ? filteredBranchOffices.find((s: {id: number}) => s.id === selectedBranchOffice)?.nombre : 'Selecciona'}</p>
                        </div>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                    </div>
                    <div className={`content ${selectBranchOffices ? 'active' : ''}`} >
                        <ul className={`options ${selectBranchOffices ? 'active' : ''}`} style={{ opacity: selectBranchOffices ? '1' : '0' }}>
                        {filteredBranchOffices.map((sucursal: any) => (
                            <li key={sucursal.id} onClick={() => handleBranchOfficesChange(sucursal)}>
                            {sucursal.nombre}
                            </li>
                        ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className='select__container'>
                <label className='label__general'>Almacen</label>
                <div className='select-btn__general'>
                    <div className={`select-btn ${selectStore ? 'active' : ''}`} onClick={openselectStore} >
                        <div className='select__container_title'>
                            <p>{selectedStore ? store.find((s: {id: number}) => s.id === selectedStore)?.nombre : 'Selecciona'}</p>
                        </div>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
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
            <div className="comments">
                <label className='label__general'>Comentarios</label>
                <input className='inputs__general' type='text' value={comments} onChange={(e) => setComments(e.target.value)} placeholder='Comentarios' />
            </div>
            </div>
                <div className='row__three'>
                    {selectedOption == 'direct' ?
                    <Direct />
                    :
                    '' 
                    }
                    {selectedOption == 'byorder' ?
                    <ByOrder />
                    :
                    '' 
                    }
                </div>
            <div>
          
        </div>
        <div className='row__three'>
            <div className='table__direct_warehouse-exit' >
                <div>
                    <div>
                        {concepts ? (
                            <div className='table__numbers'>
                                <p className='text'>Total de arículos</p>
                                <div className='quantities_tables'>{concepts.length}
                                </div>
                            </div>
                          
                        ) : (
                            ''
                        )}
                    </div>
                    <div className='table__head'>
                        <div className='thead'>
                            <div className='th'>
                                <p className=''>Artículo</p>
                            </div>
                            <div className='th'>
                                <p className=''>Ped</p>
                            </div>
                            <div className='th'>
                                <p className=''>Cantidad</p>
                            </div>
                            <div className='th'>
                                <p className=''>Unidad</p>
                            </div>
                            <div className='th'>
                                <p>Comentarios</p>
                            </div>
                            <div className='th'>
                                <p></p>
                            </div>
                        </div>
                    </div>
                    {concepts && concepts.length > 0 ? (
                        <div className='table__body'>
                            {concepts.map((item: any, index: any) => (
                                <div className='tbody__container' key={index}>
                                    <div className='tbody'>
                                        <div className='td'>
                                            {item.nameArticle}
                                        </div>
                                        <div className='td'>
                                            {item.ped}
                                        </div>
                                        <div className='td'>
                                            <input className='inputs__general'  type="number" value={item.cantidad === '' ? '' : item.cantidad}  placeholder='Cantidad'  onChange={(e) => handleAmountChange(e, index)}/>
                                        </div>
                                        {/* <div className='td'>
                                            <select className='traditional__selector' onChange={(event) => handleStore(event, index)} value={stocks[index] || ''} >
                                                <option value="">Seleccionar</option>
                                                {item.stock && item.stock.map((item: any) => (
                                                    <option key={item.id} value={item.id}>
                                                    {item.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div> */}
                                        <div className='td'>
                                            <select className='traditional__selector' onChange={(event) => handleUnits(event, index)} value={units[index] || ''} >
                                                <option value="">Seleccionar</option>
                                                {item.unidades && item.unidades.map((item: any) => (
                                                    <option key={item.id} value={item.id}>
                                                    {item.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className='td'>
                                            <input className='inputs__general' value={item.comentarios === '' ? '' : item.comentarios} onChange={(e) => handleComentariosChange(e, index)} type="text"  placeholder='Comentarios' />
                                        </div>
                                        <div className='td'>
                                            <button className='btn__general-purple' type='button' onClick={() => seeStock(item, index)}>Ver stock</button>
                                        </div>
                                        <div className={`overlay__modal-concepts_see-stock ${modalSeeStocks[index] ? 'active' : ''}`}>
                                            <div className={`popup__modal-concepts_see-stock ${modalSeeStocks[index] ? 'active' : ''}`}>
                                                <a href="#" className="btn-cerrar-popup__modal-concepts_see-stock" onClick={() => closeModalSeeStocks(index)}>
                                                    <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                                                </a>
                                                <div className='container__modal-concepts_see-stock'>
                                                    <div className='modal-concepts_departures'>
                                                        <div className='table__modal-concepts_see-stock'>
                                                            <div>
                                                                {item.stocks ? (
                                                                <div className='table__numbers'>
                                                                    <p className='text'>Total de stocks</p>
                                                                    <div className='quantities_tables'>{item.stocks && item.stocks.length}</div>
                                                                </div>
                                                                ) : (
                                                                <p className='text'>No hay stock</p>
                                                                )}
                                                            </div>
                                                            {item.storeWarning ?
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
                                                            {item.stocks && item.stocks.length > 0 ? (
                                                                <div className='table__body'>
                                                                {item.stocks && item.stocks.map((x: any, index: any) => (
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
                                        <div className='td'>
                                            <button className='btn__general-danger' type='button' onClick={() => deleteItem(item)}>Eliminar</button>
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
        <div>
            <button className='btn__general-purple' type='submit'>Crear salida</button>
        </div>
    </form>
  )
}

export default ModalCreate
