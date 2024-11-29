import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import useUserStore from '../../../../../zustand/General'
import { companiesRequests } from '../../../../../fuctions/Companies'
import { StoreRequests } from '../../../../../fuctions/Store'
import ByOrder from './Types/ByOrder'
import Direct from './Types/Direct'
import './ModalCreate.css'
import { storeWarehouseExit } from '../../../../../zustand/WarehouseExit'
import { useStore } from 'zustand';
import Empresas_Sucursales from '../../../Dynamic_Components/Empresas_Sucursales'
import Select from '../../../Dynamic_Components/Select'
import { useSelectStore } from '../../../../../zustand/Select'
import APIs from '../../../../../services/services/APIs'


const ModalCreate: React.FC = () => {
    const userState = useUserStore(state => state.user);
    const user_id = userState.id

    const setModal = storeWarehouseExit(state => state.setModal)
    const setConcepts = storeWarehouseExit(state => state.setConcepts)

    const selectedIds: any = useSelectStore((state) => state.selectedIds);
    const { concepts, dates, modal, selectedBranchOffice }: any = useStore(storeWarehouseExit)
    const setWarehouseExit = storeWarehouseExit(state => state.setWarehouseExit)

    const [comments, setComments] = useState<string>('')


    const [companies, setCompanies] = useState<any>()
    const [branchOffices, setBranchOffices] = useState<any>()

    const { getCompaniesXUsers }: any = companiesRequests()

    const { getStore }: any = StoreRequests()
    const [store, setStore] = useState<any>()

    const fecht = async () => {
        const companies = await getCompaniesXUsers(user_id)
        const store = await getStore(user_id)
        setStore({
            selectName: 'Almacen',
            options: 'nombre',
            dataSelect: store
        })
        setCompanies(companies)
    }

    useEffect(() => {
        fecht()
    }, [])




    const [selectedOption, setSelectedOption] = useState<any>('direct')

    const handleOptionChange = (event: any) => {
        setSelectedOption(event.target.value);
    }






    const deleteConcepts = (_: any, indexConcept: number) => {
        const filter = concepts.filter((_: number, index: number) => index !== indexConcept)
        setConcepts(filter)

    }

    const handleComentariosChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        const newArticleStates = [...concepts];
        newArticleStates[index].comentarios = value;
        setConcepts(newArticleStates);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = Number.isNaN(parseFloat(e.target.value)) ? 0: parseFloat(e.target.value);
        
        const newArticleStates = [...concepts];
        newArticleStates[index].cantidad = value;

        const stocks = concepts[index].stock;
        const almacen_predeterminado = selectedIds?.store;

        const filter = stocks.filter((x: any) => x.id === almacen_predeterminado.id);

        if (filter) {
            const equivalencias = filter[0].equivalencias.filter((x:any)=> x.id_unidad==newArticleStates[index].unidad)
            console.log('value',value);
            console.log('canti',equivalencias[0].cantidad);
            
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

   


    const handleUnits = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const value = parseInt(event.target.value, 10);
        concepts[index].unidad = value;
   
        const newArticleStates = [...concepts];
        newArticleStates[index].cantidad = 0;
        setConcepts(newArticleStates);
    };

    const handleCreateWarehouseExit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        const data = {
            id_usuario_crea: user_id,
            id_sucursal: branchOffices.id,
            id_almacen: selectedIds.store.id,
            comentarios: comments,
            conceptos: concepts
        };
        console.log(data)

        const dataGet = {
            id_almacen: null,
            id_usuario: user_id,
            id_sucursal: selectedBranchOffice?.id,
            desde: dates[0],
            hasta: dates[1],
            id_serie: 0,
            folio: null,
        }
        if (concepts.length == 0 || concepts == null) {
            Swal.fire('Notificacion', 'Ingresa al menos un articulo para generar su salida', 'warning')
            return
        }
        try {
            const result: any = await APIs.createWarehouseExit(data)
            Swal.fire(result.mensaje, '', 'success');
            const resultGet: any = await APIs.getWarehouseExit(dataGet)

            setWarehouseExit(resultGet)
            setModal('')
        } catch (error) {
            Swal.fire('Error', 'Hubo un rrror al crear la salida', 'error');
        }

    }

    const [modalSeeStocks, setModalSeeStocks] = useState<boolean[]>([]);



    const [activeH, setActiveH] = useState<boolean>(false)
    const seeStock = (x: any, index: any) => {
        console.log(x)
        setActiveH(true)
        setModalSeeStocks((prev) => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
        });
    
    };

    const closeModalSeeStocks = (index: any) => {
        setModalSeeStocks((prev: any) => {
            const newState = [...prev];
            newState[index] = false;
            return newState;
        });
    };

    useEffect(() => {
        if (selectedIds != null) {
            if (selectedIds.almacen_origin) {
    
                concepts.forEach((el:any, index:number) => {
                    console.log(el)
                  const newArticleStates = [...concepts];
                  newArticleStates[index].cantidad = 0;
                  setConcepts(newArticleStates);
                });
            }
        }
    }, [selectedIds])




    useEffect(() => {
        console.log(concepts);

    }, [concepts])
    return (
        <div className={`overlay__departures ${modal == 'modal-create__departures' ? 'active' : ''}`}>
            <div className={`popup__departures ${modal == 'modal-create__departures' ? 'active' : ''}`}>
                <div className='header__modal'>
                    <a href="#" className="btn-cerrar-popup__departures" onClick={() => setModal('')} >
                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                    </a>
                    <p className='title__modals'>Crear nueva salida</p>
                </div>
                <div className='conatiner__create_warehouse-exit' >
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
                    <div className='conatiner__create_warehouse-exit-main'>
                        <div className="row">
                            <div className='col-8'>
                                <Empresas_Sucursales empresaDyn={companies} sucursalDyn={branchOffices} setEmpresaDyn={setCompanies} setSucursalDyn={setBranchOffices} modeUpdate={false} />
                            </div>
                            <div className='col-4'>
                                <Select dataSelects={store} instanceId='store' nameSelect={'Almacen'} />
                            </div>
                            <div className="col-12">
                                <label className='label__general'>Comentarios</label>
                                <textarea className='textarea__general' value={comments} onChange={(e) => setComments(e.target.value)} placeholder='Comentarios'></textarea>
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
                            <div className={`table__direct_warehouse-exit ${activeH ? "active" : ""}`} >
                                <div>
                                    <div>
                                        {concepts ? (
                                            <div className='table__numbers'>
                                                <p className='text'>Total de conceptos</p>
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
                                                            {item.ped ?
                                                                item.ped
                                                                :
                                                                <p>No aplica</p>
                                                            }
                                                        </div>
                                                        <div className='td'>
                                                            <input className='inputs__general' type="number" value={item.cantidad} placeholder='Cantidad' onChange={(e) => handleAmountChange(e, index)} />
                                                        </div>
                                                        <div className='td'>
                                                            <select className='traditional__selector' onChange={(event) => handleUnits(event, index)} value={item.unidad}>
                                                                {item.unidades && item.unidades.map((item: any) => (
                                                                    <option key={item.id} value={item.id_unidad}>
                                                                        {item.nombre}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className='td'>
                                                            <input className='inputs__general' value={item.comentarios === '' ? '' : item.comentarios} onChange={(e) => handleComentariosChange(e, index)} type="text" placeholder='Comentarios' />
                                                        </div>
                                                        <div className='td'>
                                                            <button className='btn__general-purple' type='button' onClick={() => seeStock(item, index)}>Ver stock</button>
                                                        </div>
                                                        <div className={`overlay__modal-concepts_see-stock ${modalSeeStocks[index] ? 'active' : ''}`}>
                                                            <div className={`popup__modal-concepts_see-stock ${modalSeeStocks[index] ? 'active' : ''}`}>
                                                                <a href="#" className="btn-cerrar-popup__modal-concepts_see-stock" onClick={() => closeModalSeeStocks(index)}>
                                                                    <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                                                                </a>
                                                                <div className='container__modal-concepts_see-stock'>
                                                                    <div className='modal-concepts_departures'>
                                                                        <div className='table__modal-concepts_see-stock'>
                                                                            <div>
                                                                                {item.stock ? (
                                                                                    <div className='table__numbers'>
                                                                                        <p className='text'>Total de stocks</p>
                                                                                        <div className='quantities_tables'>{item.stock && item.stock.length}</div>
                                                                                    </div>
                                                                                ) : (
                                                                                    <p className='text'>No hay stock</p>
                                                                                )}
                                                                            </div>
                                                                            {item.storeWarning ?
                                                                                <div className='store-warning'>
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width='20' fill='#D9D9D9' viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" /></svg>
                                                                                    <p>Este articulo no tiene almacen configurado</p>
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
                                                                            <table className='table '>
                                                                                <thead className='thead'>
                                                                                    <tr>
                                                                                        <th>Nombre</th>
                                                                                        {/* Agrega una columna para cada equivalencia, si existe */}
                                                                                        {item.stock?.[0]?.equivalencias?.map((equivalencia:any, eqIndex:number) => (
                                                                                            <th key={eqIndex}>{equivalencia.nombre_unidad}</th>
                                                                                        ))}
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {item.stock?.length > 0 ? (
                                                                                        item.stock.map((x:any, index:number) => (
                                                                                            <tr key={index}>
                                                                                                <td>{x.nombre}</td>
                                                                                                {/* Mostrar valores de equivalencias en columnas adicionales */}
                                                                                                {x.equivalencias && x.equivalencias.length > 0 ? (
                                                                                                    x.equivalencias.map((equivalencia:any, eqIndex:number) => (
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
                                                        <div className='td'>
                                                            <button className='btn__general-danger' type='button' onClick={() => deleteConcepts(item, index)}>Eliminar</button>
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
                    <div className='d-flex justify-content-center'>
                        <button className='btn__general-purple' onClick={(e) => handleCreateWarehouseExit(e)}>Crear salida</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalCreate
