import { useState, useEffect } from "react"
import useUserStore from "../../../../../zustand/General";
import Select from "../../../Dynamic_Components/Select";
import { storeOrdes } from "../../../../../zustand/Ordes";
import { areasRequests } from "../../../../../fuctions/Areas";
import Direct from "./types/Direct";
import { v4 as uuidv4 } from 'uuid';
import 'flatpickr/dist/flatpickr.min.css';
import './styles/ModalCreate.css'
import Swal from 'sweetalert2';
import Empresas_Sucursales from "../../../Dynamic_Components/Empresas_Sucursales";
import { useSelectStore } from "../../../../../zustand/Select";
import { useStore } from "zustand";
import { storeModals } from "../../../../../zustand/Modals";
import ByOP from "./types/ByOP";
import APIs from "../../../../../services/services/APIs";
import LoadingInfo from "../../../../loading/LoadingInfo";
import { storeArticles } from "../../../../../zustand/Articles";
import { storeDv } from "../../../../../zustand/Dynamic_variables";
import { storeProduction } from "../../../../../zustand/Production";


const ModalCreate = () => {
    const userState = useUserStore(state => state.user);
    const user_id = userState.id

    const { getOrdedrs, dates, LPAs, OPByareas }: any = storeOrdes();
    const selectedIds: any = useSelectStore((state) => state.selectedIds);
    const setSelects: any = useSelectStore((state) => state.setSelectedId);
    const setConcepts = storeOrdes(state => state.setConcepts)
    const { concepts } = useStore(storeOrdes)

    const { getAreas }: any = areasRequests();
    const { createOrders }: any = storeOrdes();

    const setOPByareas = storeOrdes(state => state.setOPByareas)


    const setModal = storeModals(state => state.setModal)
    const { modal }: any = storeModals();


    const [selectedOption, setSelectedOption] = useState<number>(0);
    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const value = event.target.value;

        console.log(value)

        if (value == "Directa") {
            setSelectedOption(0);
        }
        else if (value == "PorOC") {
            setSelectedOption(1);
        }
        else {
        }

        // if (selectedOption === 1) {
        //     setSelectedOption(0);
        // }
    };

    const [areas, setAreas] = useState<any>()

    console.log('OPByareas', OPByareas)


    const fecth = async () => {
        const today = new Date();
        const oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split("T")[0];
        const formattedToday = new Date().toISOString().split("T")[0];

        let data = {
            folio: 0,
            id_sucursal: branchOffices.id,
            id_area: selectedIds?.id_area?.id,
            id_serie: selectedIds?.series?.id,
            desde: oneMonthAgo,
            hasta: formattedToday,
            id_usuario: user_id,
            status: 0,
            pedido: false
        }

        try {
            const result: any = await APIs.getProoductionOrders(data)

            setOPByareas(result)
        } catch (error) {
            console.log(error)
        }


    }


    const fecth2 = async () => {
        try {
            const resultAreas = await getAreas(0, user_id)
            setAreas({
                selectName: 'Areas',
                options: 'nombre',
                dataSelect: resultAreas
            })

            setSelects('id_area', resultAreas[0])
        } catch (error) {
            console.log(error)
        }




    }

    useEffect(() => {
        fecth()

    }, [])

    useEffect(() => {
        fecth2()
    }, [modal])
    const [OPcomments, setOPcomments] = useState<string>('')

    const [seleccionesTemporales, setSeleccionesTemporales] = useState<string[]>([]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value.trim();  // Obtener el valor ingresado sin espacios
        console.log('STOCK DEL INDEX', concepts[index].stock);
        let total_stocks = 0
        concepts[index].stock.forEach((el: any) => {
            total_stocks += el.stock
        });

        if (parseFloat(value) > total_stocks) {
            Swal.fire('Notificacion', 'El valor ingresado supera el stock', 'warning')
            const newArticleStates = [...concepts];
            newArticleStates[index].cantidad = 0;
            setConcepts(newArticleStates);
            return
        }
        const newArticleStates = [...concepts];
        newArticleStates[index].cantidad = value;
        setConcepts(newArticleStates);
        // Obtener los valores relevantes de `concepts`
        // const stocks = concepts[index].stock;
        // let almacenPredeterminado = concepts[index].almacenes_predeterminados.filter((x: any) => x.id_sucursal == branchOffices?.id)[0];
        // if (LPAs?.dataSelect.length > 0) {
        //     almacenPredeterminado = {id: LPAs?.dataSelect[0]?.id_almacen}
        //     if (almacenPredeterminado == undefined) {
        //         Swal.fire('Notificacion', 'La sucursal seleccionada no tiene un almacen configurado para el articulo '
        //             + concepts[index].codigo + ' - ' + concepts[index].descripcion, 'warning')
        //         return
        //     }
        // }

        // // Filtrar el stock para obtener el almacen correspondiente
        // const filter = stocks.filter((x: any) => x.id === almacenPredeterminado.id);

        // // Verificar si el almacen existe y tiene stock disponible

        // if (filter.length > 0) {
        //     const equivalencias = filter[0].equivalencias.filter((x: any) => x.id_unidad == concepts[index].unidad || x.id_unidad == concepts[index].unidades[0].id_unidad)

        //     if (value > equivalencias[0].cantidad) {
        //         const newArticleStates = [...concepts]; 
        //         newArticleStates[index].cantidad = 0;
        //         setConcepts(newArticleStates);
        //         Swal.fire({
        //             icon: "warning",
        //             title: "Oops...",
        //             text: 'La cantidad ingresada supera el stock disponible'
        //         });
        //     } else {
        //         const newArticleStates = [...concepts];
        //         newArticleStates[index].cantidad = value;
        //         setConcepts(newArticleStates);
        //     }
        //     return
        // } else {
        //     Swal.fire('Notificacion', 'Este articulo no tiene almacen predeterminado para la sucursal que tienes seleccionado, solicitar su configuración', 'info');
        // }
    };


    const handleComentariosChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        const newArticleStates = [...concepts];
        newArticleStates[index].comentarios = value;
        setConcepts(newArticleStates);

    }

    const handleSeleccion = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const valueUnit = event.target.value;
        concepts[index].unidad = parseInt(valueUnit, 10);
        concepts[index].id_unidad = parseInt(valueUnit, 10);
        const newArticleStates = [...concepts];
        newArticleStates[index].cantidad = 0;
        setConcepts(newArticleStates);

    };




    const handleCreateOrders = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const id_area = selectedIds.id_area.id
        const id_sucursal = branchOffices.id;
        const id_usuario_crea = user_id;
        const comentarios = OPcomments;

        if (concepts?.length == 0) {
            Swal.fire('Notificacion', 'Agrega un concepto al pedido', 'warning')
            return
        }
        concepts.forEach((el: any) => {
            if (el.unidad != null && el.unidad != undefined) {
                el.id_unidad = el.unidad
            }
        });

        let filter0 = concepts.filter((x: any) => x.cantidad == '0' || x.cantidad == 0 || x.cantidad == '' || x.cantidad == undefined)

        if (filter0.length > 0) {
            Swal.fire('Notificacion', 'No puedes enviar conceptos sin cantidad', 'warning')
            return
        }

        try {
            setModalLoading(true)

            await createOrders({ id_area, id_sucursal, id_usuario_crea, status: 0, comentarios, conceptos: concepts })
            setModalLoading(false)
            setOPcomments('')
            setConcepts([])
            setModal('')
        } catch (error) {
            console.log(error)
            Swal.fire('Notificacion', 'Ocurrió un error al crear el pedido:' + error, 'error')
            setModalLoading(false)

        }

    }

    const [modalStateStore, setModalStateStore] = useState<any>(false)

    const seeStock = (modal: any) => {
        setModalStateStore((prevState: any) => ({
            ...prevState,
            [modal]: !prevState[modal]
        }))
    }

    console.log(concepts)

    const closeModalStore = () => {
        setModalStateStore(false)
    }

    const [companies, setCompanies] = useState<any>()
    const [branchOffices, setBranchOffices] = useState<any>()

    const deleteConcepts = (_: any, indexConcept: number) => {
        const filter = concepts.filter((_: any, index: number) => index !== indexConcept)
        setConcepts(filter)
    }
    const selectData: any = useSelectStore(state => state.selectedIds)
    const modalLoading = storeArticles((state: any) => state.modalLoading);
    const setModalLoading = storeArticles((state: any) => state.setModalLoading);

    useEffect(() => {
        if (modal == 'modal-create-pedido') {
            if (selectData?.LPASelected) {
                setModalLoading(true)
                APIs.CreateAny({ id: selectData?.LPASelected.id, id_usuario: user_id, for_pedido: 1 }, "getLPAArticulos")
                    .then(async (response: any) => {
                        setModalLoading(false)
                        response.forEach((element: any) => {
                            if (element.unidades.length > 0) {
                                element.id_unidad = element.unidades[0].id_unidad
                            }
                        });
                        setConcepts(response)
                    }).catch((error: any) => {
                        if (error.response) {
                            if (error.response.status === 409) {
                                setModalLoading(false)
                                Swal.fire(error.mensaje, '', 'warning');

                            } else {
                                setModalLoading(false)
                                Swal.fire('Error al actualizar', '', 'error');
                            }
                        } else {
                            setModalLoading(false)
                            Swal.fire('Error de conexión.', '', 'error');
                        }
                    })
            }
        }
    }, [selectData])


    console.log('LPAS', LPAs);
    const checkPermission = (elemento: string) => {
        const permisosxVista = storeDv.getState().permisosxvista; // Obtiene el estado actual
        console.log(permisosxVista);
        console.log(elemento);

        return permisosxVista.some((x: any) => x.titulo === elemento);
    };

    const handleSelectChange = (e, i) => {
        const selectedValue = parseInt(e.target.value);
        console.log('selectedValue', selectedValue)
        const updatedConcepts = concepts.map((concept, index) => {
            if (index === i) {
                return { ...concept, id_orden_produccion: selectedValue };
            }
            return concept;
        });

        setConcepts(updatedConcepts)
    };



    return (
        <div className={`overlay__orders ${modal == 'modal-create-pedido' ? 'active' : ''}`}>
            <div className={`popup__orders ${modal == 'modal-create-pedido' ? 'active' : ''}`}>
                <div>
                    <a href="#" className="btn-cerrar-popup__orders" onClick={() => setModal('')}>
                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                    </a>
                    {/* <p className='title__modals'>Crear nuevo pedido</p> */}
                </div>
                <div className='conatiner__create_orders' >
                    <div className='row__one'>
                        <div className='container__checkbox_tickets'>
                            <div className='checkbox__tickets'>
                                <label className="checkbox__container_general">
                                    <input className='checkbox' type="radio" value="Directa" checked={selectedOption == 0} onChange={handleOptionChange} />
                                    <span className="checkmark__general"></span>
                                </label>
                                <p className='text'>Directa</p>
                            </div>
                            {LPAs?.dataSelect?.length == 0 ?
                                checkPermission('OPCION-POR-OP') && (
                                    <div className='checkbox__tickets' >
                                        <label className="checkbox__container_general">
                                            <input className='checkbox' type="radio" value="PorOC" checked={selectedOption == 1} onChange={handleOptionChange} />
                                            <span className="checkmark__general"></span>
                                        </label>
                                        <p className='text'>Por OP</p>
                                    </div>
                                )

                                : ''}
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-title">Crear Pedido de Almacen</div>
                        <div className='row ' style={{ zoom: '85%' }}>
                            <div className="col-6">
                                <Empresas_Sucursales empresaDyn={companies} sucursalDyn={branchOffices} setEmpresaDyn={setCompanies} setSucursalDyn={setBranchOffices} modeUpdate={false} />
                            </div>
                            <div className="col-3">
                                <Select dataSelects={areas} instanceId="id_area" nameSelect={'Areas'} />
                            </div>
                            <div className="col-3">
                                <label className='label__general'>Comentarios del Pedido</label>
                                <textarea className={`textarea__general`} value={OPcomments} onChange={(e) => setOPcomments(e.target.value)} placeholder='Comentarios' />
                            </div>
                        </div>

                    </div>
                    {LPAs?.dataSelect?.length == 0 ?
                        selectedOption == 0 ?
                            <Direct selectedOption={selectedOption} />
                            :
                            <div className="">
                                <div className="collapse-container">
                                    <input type="checkbox" id={'search_manual_xOp'} className="collapse-toggle" />
                                    <label htmlFor={'search_manual_xOp'} className="collapse-label">Abrir/Cerrar buscador Manual</label>
                                    <div className="collapse-content">

                                        <Direct selectedOption={selectedOption} />
                                    </div>
                                </div>
                                <ByOP />
                            </div>


                        :
                        <Select dataSelects={LPAs} instanceId='LPASelected' nameSelect={'Lista Productos Aprobados'}></Select>
                    }
                    <div className='table__modal_create_orders' >
                        <div>
                            {concepts ? (
                                <div className='table__numbers'>
                                    <p className='text'>Total de articulos</p>
                                    <div className='quantities_tables'>{concepts.length}</div>
                                </div>
                            ) : (
                                <p className='text'>No hay empresas</p>
                            )}
                        </div>
                        <div className="table">

                            <div className='table__head'>
                                <div className='thead'>
                                    <div className='th'>
                                        <p className=''>Articulo</p>
                                    </div>
                                    <div className='th'>
                                        <p className=''>OP</p>
                                    </div>
                                    <div className='th'>
                                        <p className=''>Cantidad</p>
                                    </div>
                                    <div className='th'>
                                        <p className=''>Unidad</p>
                                    </div>
                                    <div className='th'>
                                        <p className=''>Comentarios</p>
                                    </div>
                                    <div className='th'>
                                        <p className=''>Stock</p>
                                    </div>
                                    <div className='th'>

                                    </div>
                                </div>
                            </div>
                            {concepts.length > 0 ? (
                                <div className='table__body'>
                                    {concepts?.map((concept: any, index: any) => (
                                        <div className='tbody__container' key={index}>
                                            <div className='tbody'>
                                                <div className='td'>
                                                    <p className="article-identifier ">{concept?.codigo}-{concept?.descripcion}</p>
                                                </div>
                                                <div className="td">
                                                    {selectedOption == 0 ?
                                                        <div>
                                                            <p>{concept?.orden_produccion ? concept?.orden_produccion.folio : "N/A"}</p>
                                                        </div>
                                                        :
                                                        concept.orden_produccion ?
                                                            <p>{concept.urgencia && <p className="urgency-identifier">URGENCIA</p>}
                                                                {concept.orden_produccion.folio}</p>
                                                            :
                                                            <select
                                                                className="traditional__selector"
                                                                value={concept.id_orden_produccion || "Ninguna"}
                                                                onChange={(event) => handleSelectChange(event, index)} >
                                                                <option value="Ninguna">Ninguna</option>
                                                                {OPByareas?.map((area, index) => (
                                                                    <option key={index} value={area.conceptos[0].id}>
                                                                        {`${area.serie}-${area.id_folio}-${area.anio}`}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                    }

                                                </div>
                                                <div className='td'>
                                                    <div>
                                                        <input className='inputs__general' value={concept?.cantidad === null ? '' : concept?.cantidad} disabled={concept?.orden_produccion}
                                                            onChange={(e) => handleAmountChange(e, index)} type="number" placeholder='Cantidad' onWheel={(e) => e.currentTarget.blur()} />
                                                    </div>
                                                </div>

                                                <div className='td'>
                                                    <div>
                                                        {/* --------------------SE COMENTO ESTE PORQUE NO FUNCIONA AL CREAR, NO PERMITE MOVER EL CONCEPTO */}
                                                        <select className='traditional__selector' disabled={concept?.orden_produccion} onChange={(event) => handleSeleccion(event, index)} value={concept.id_unidad}>
                                                            {concept?.unidades.map((item: any) => (
                                                                <option key={item.id} value={item.id_unidad}>
                                                                    {item.nombre}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {/* -------------------------------PARA QUE FUNCIONE BIEN SE DEBE SEGUIR USANDO LAS SELECCIONES TEMPORALES DEL INDEX
                                                        ALTERNAR ENTRE EL UPDATE CON UNA CONDICION PARA MOSTRAR EL DE ARRIBA Y VERIFICAR QUE EN EL UPDATE FUNCIONE */}
                                                        {/* <select className='traditional__selector' disabled={concept?.orden_produccion} 
                                                        onChange={(event) => handleSeleccion(event, index)} value={seleccionesTemporales[index] || ''}>
                                                            {concept?.unidades.map((item: any) => (
                                                                <option key={item.id} value={item.id_unidad}>
                                                                    {item.nombre}
                                                                </option>
                                                            ))}
                                                        </select> */}
                                                    </div>
                                                </div>
                                                <div className='td'>
                                                    <div>
                                                        <input className='inputs__general' value={concept?.comentarios === '' ? '' : concept?.comentarios} onChange={(e) => handleComentariosChange(e, index)} type="text" placeholder='Comentarios' />
                                                    </div>
                                                </div>
                                                <div>
                                                    <button type="button" className="btn__general-purple" onClick={() => seeStock(concept.id)}>Ver</button>
                                                </div>
                                                <div className={`overlay__modal_stock_orders ${modalStateStore[concept?.id] ? 'active' : ''}`}>
                                                    <div className={`popup__modal_stock_orders ${modalStateStore[concept?.id] ? 'active' : ''}`}>
                                                        <a href="#" className="btn-cerrar-popup__modal_stock_orders" onClick={closeModalStore}>
                                                            <svg className='close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                                                        </a>
                                                        <div>
                                                            <div className='table__modal_create_orders-stocks' >
                                                                {concept?.stock?.length > 0 ? (
                                                                    <div>
                                                                        <div className='table__head'>
                                                                            <div className='thead' style={{ gridTemplateColumns: `repeat(${concept?.stock[0]?.equivalencias.length + 1}, 1fr)` }}>
                                                                                <div className='th'>
                                                                                    <p className=''>Nombre</p>
                                                                                </div>
                                                                                {concept?.stock[0]?.equivalencias.map((item: any) => (
                                                                                    <div className="th" key={uuidv4()}>
                                                                                        <p>{item.nombre_unidad}</p>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <div className='table__body'>
                                                                                <div className='tbody__container' >
                                                                                    {concept?.stock?.map((x: any) => (
                                                                                        <div key={uuidv4()}>
                                                                                            <div className='tbody' style={{ gridTemplateColumns: `repeat(${x?.equivalencias.length + 1}, 1fr)` }}>
                                                                                                <div className="td">
                                                                                                    <p>{x.nombre}</p>
                                                                                                </div>
                                                                                                {x?.equivalencias.map((item: any) => (
                                                                                                    <div className="td" >
                                                                                                        <p>{item.cantidad}</p>
                                                                                                    </div>
                                                                                                ))}
                                                                                            </div>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                ) : (
                                                                    <p className='text'>No hay aritculos que mostrar</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='td'>
                                                    <button className='btn__delete_users' type='button' onClick={() => deleteConcepts(concept, index)}>Eliminar</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className='text'>No hay aritculos que mostrar</p>
                            )}
                        </div>
                    </div>

                </div>
                <div className="mt-4 d-flex justify-content-center">
                    <button className='btn__general-purple' onClick={handleCreateOrders}>Crear Pedido</button>
                </div>
            </div>
            {
                modalLoading == true ? (
                    <LoadingInfo />
                ) :
                    ''
            }
        </div >
    )
}

export default ModalCreate
