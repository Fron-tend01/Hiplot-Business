import { useState, useEffect } from "react"
import useUserStore from "../../../../../zustand/General";
import { storeTickets } from "../../../../../zustand/Tickets";
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/l10n/es.js'
import './styles/ModalCreate.css'
import APIs from "../../../../../services/services/APIs";
import Empresas_Sucursales from "../../../Dynamic_Components/Empresas_Sucursales";
import ByOC from "./types/ByOC";
import Direct from "./types/Direct";
import Swal from 'sweetalert2';
import { storeArticles } from "../../../../../zustand/Articles";



const ModalCreate = () => {
    const setModalTickets = storeTickets(state => state.setModalTickets)
    const setConceptos = storeTickets(state => state.setConceptos)

    const { dates, getTickets }: any = storeTickets();

    const [companies, setCompanies] = useState<any>()
    const [branchOffices, setBranchOffices] = useState<any>()
    const { createTickets, modalTickets, conceptos }: any = storeTickets();
    const userState = useUserStore(state => state.user);
    const user_id = userState.id


    const [comments, setComments] = useState<any>('')

    const [store, setStore] = useState<any>()

    const fecth = async () => {
        const result = await APIs.getStore(user_id)
        setStore(result)
    }

    useEffect(() => {
        fecth()
    }, [])

    const [selectedOption, setSelectedOption] = useState<number | null>(0);

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value === "normal") {
            setSelectedOption(0);
        }
        else if (value === "diferencial") {
            setSelectedOption(1);
        }
        else {
        }
    };


    const [selectedUnit, setSelectedUnit] = useState<any[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<any>([])
    const [selectedStore, setSelectedStore] = useState<any>([])

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value.trim();
        const parsedValue = value === '' ? null : parseFloat(value);
        const newArticleStates = [...conceptos];
        newArticleStates[index] = {
            ...newArticleStates[index],
            cantidad: parsedValue,
        };
        setConceptos(newArticleStates);
    };

    const handleComentariosChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        const newArticleStates = [...conceptos];
        newArticleStates[index] = {
            ...newArticleStates[index],
            comentarios: value,
        };
        setConceptos(newArticleStates);

    }

    const handleSelectUnits = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const valorSeleccionado = parseInt(event.target.value, 10); // Base 10 para números decimales
  

        const nuevaInstanciac = [...conceptos];  // Copiar el arreglo de conceptos
        nuevaInstanciac[index].unidad = valorSeleccionado;  // Actualizar el valor deseado
        setConceptos(nuevaInstanciac);
        // Crear una copia del arreglo de selecciones temporales
        const nuevasSelecciones = [...selectedUnit];
        // Actualizar el valor seleccionado en la posición del índice correspondiente
        nuevasSelecciones[index] = valorSeleccionado;
        // Actualizar el estado con las nuevas selecciones
        setSelectedUnit(nuevasSelecciones);
    };



    const handleProveedorChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const temp_proveedor = parseInt(event.target.value); // Convertir a número entero
     

        const nuevaInstanciac = [...conceptos];  // Copiar el arreglo de conceptos
        nuevaInstanciac[index].id_proveedor = temp_proveedor;  // Actualizar el valor deseado
        setConceptos(nuevaInstanciac);

        const nuevaInstancia = [...selectedSupplier];
        nuevaInstancia[index] = temp_proveedor;
        setSelectedSupplier(nuevaInstancia);
    };

    const handleStoreChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const temp_store = parseInt(event.target.value, 10);
        const nuevaInstanciac = [...conceptos];  // Copiar el arreglo de conceptos
        nuevaInstanciac[index].id_almacen = temp_store;  // Actualizar el valor deseado
        setConceptos(nuevaInstanciac);

        const nuevaInstancia = [...selectedStore];
        nuevaInstancia[index] = temp_store;
        setSelectedStore(nuevaInstancia);
    };

    const setModalLoading = storeArticles((state: any) => state.setModalLoading);


    const handleCreateTickets = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        const id_sucursal = branchOffices.id;
        const id_usuario_crea = user_id;
        const comentarios = comments;
        console.log('conceptos casi entrando', conceptos);

        try {
            if (comments === '') {
                setWarningComments(true)
            } else {
                setWarningComments(false)
                if (conceptos.length > 0) {
                    console.log(conceptos);
                    setModalLoading(true)

                    await createTickets(id_sucursal, id_usuario_crea, comentarios, conceptos)
                    setModalLoading(false)

                    const data = {
                        id_usuario: user_id,
                        id_empresa: companies.id,
                        id_sucursal: branchOffices.id,
                        desde: dates[0],
                        hasta: dates[1],
                        id_serie: 0,
                        status: 0,
                        folio: 0
                    }
                    Swal.fire('Notificacion', 'Entrada creada correctamente', 'success')
                    await getTickets(data)
                    setModalTickets('')
                } else {
                    setModalLoading(false)

                    Swal.fire({
                        title: 'Aviso',
                        text: 'Debes agregar al menos un concepto para crear la entrada.',
                        icon: 'warning',
                        confirmButtonText: 'Entendido'
                    });

                }
            }



        } catch (error) {
            console.log(error)
        }

    }

    // useEffect(() => {

    // }, [conceptos])

    const deleteTicket = (_: any, indexTicket: any) => {
        const filter = conceptos.filter((_: any, index: any) => index !== indexTicket)
        setConceptos(filter)
        const filter1 = selectedUnit.filter((_: any, index: any) => index !== indexTicket)
        setSelectedUnit(filter1)
        const filter2 = selectedStore.filter((_: any, index: any) => index !== indexTicket)
        setSelectedStore(filter2)
        const filter3 = selectedSupplier.filter((_: any, index: any) => index !== indexTicket)
        setSelectedSupplier(filter3)
    }

    const [subTotal, setSubTotal] = useState<any>(0)
    const [discount, setDiscount] = useState<number>(0)
    const [IVA, setIVA] = useState<any>(0)
    const [total, setTotal] = useState<number>(0);


    useEffect(() => {
        let totalSub = 0;
        let totalDiscount = 0;
        let iva = 0;
        let costo_flete = 0;

        const ids: any = [];

        if (conceptos.length !== 0) {
            conceptos.forEach((concept: any) => {
                const exists = ids.some((x: any) => x === concept.id_orden_compra);
                if (exists) {
                    console.log('Ya existe');
                } else {
                    ids.push(concept.id_orden_compra);
                    costo_flete += concept.costo_flete;

                }
                if (concept.id_almacen == undefined || concept.id_almacen == null || concept.id_almacen == 0){
                    concept.id_almacen = store[0].id

                }

            });
        }


        conceptos.forEach((x: any) => {
            totalSub += x.cantidad * x.precio_unitario;
            totalDiscount += x.descuento;
            if (x.iva_on) {
                const temp_iva = (x.cantidad * x.precio_unitario) - x.descuento
                iva += temp_iva * .16
            }

        });
        setSubTotal(totalSub);
        setDiscount(totalDiscount);
        setIVA(iva);
        setTotal((totalSub - totalDiscount) + iva + costo_flete);
    }, [conceptos]);

    const [warningComments, setWarningComments] = useState<boolean>(false)

    const styleWarningComments = {
        opacity: warningComments === true ? '1' : '',
        height: warningComments === true ? '23px' : ''
    }

    return (
        <div className={`overlay__tickets ${modalTickets == 'modal-create_ticket' ? 'active' : ''}`}>
            <div className={`popup__tickets ${modalTickets == 'modal-create_ticket' ? 'active' : ''}`}>
                <div>
                    <a href="#" className="btn-cerrar-popup__tickets" onClick={() => setModalTickets('')}>
                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                    </a>
                    <p className='title__modals'>Generar Entrada</p>
                </div>
                <div className='conatiner__create_tickets'>
                    <div className="row__one">
                        <div className='container__checkbox_tickets'>
                            <div className='checkbox__tickets'>
                                <label className="checkbox__container_general">
                                    <input className='checkbox' type="radio" value="normal" checked={selectedOption === 0} onChange={handleOptionChange} />
                                    <span className="checkmark__general"></span>
                                </label>
                                <p className='text'>Directa</p>
                            </div>
                            <div className='checkbox__tickets'>
                                <label className="checkbox__container_general">
                                    <input className='checkbox' type="radio" value="diferencial" checked={selectedOption === 1} onChange={handleOptionChange} />
                                    <span className="checkmark__general"></span>
                                </label>
                                <p className='text'>Por OC</p>
                            </div>
                        </div>
                    </div>
                    <div className="conatiner__create_tickets-main">
                        <div className="row row__one">
                            <div className="col-8">
                                <Empresas_Sucursales empresaDyn={companies} sucursalDyn={branchOffices} setEmpresaDyn={setCompanies} setSucursalDyn={setBranchOffices} modeUpdate={false} />
                            </div>
                            <div className="col-4 comments">
                                <label className='label__general'>Comentarios</label>
                                <div className='warning__general' style={styleWarningComments}><small >Este campo es obligatorio</small></div>
                                <input className={`inputs__general ${warningComments ? 'warning' : ''}`} type='text' value={comments} onChange={(e) => setComments(e.target.value)} placeholder='Comentarios' />
                            </div>
                        </div>
                        {selectedOption === 0 ?
                            <Direct />
                            :
                            <ByOC />
                        }
                        <div className=''>
                            <div className='table__modal_create_tickets' >
                                <div>
                                    <div className='table__numbers'>
                                        <p className='text'>Total de conceptos</p>
                                        <div className='quantities_tables'>{conceptos?.length}</div>
                                    </div>
                                </div>
                                <div className="table">
                                    <div className='table__head'>
                                        <div className='thead'>
                                            <div className='th'>
                                                <p className=''>Articulo</p>
                                            </div>
                                            <div className='th'>
                                                <p className=''>Cant</p>
                                            </div>
                                            <div className='th'>
                                                <p className=''>Unidad</p>
                                            </div>
                                            <div className='th'>
                                                <p className=''>OC</p>
                                            </div>
                                            <div className='th'>
                                                <p className=''>Prov</p>
                                            </div>

                                            <div className='th'>
                                                <p className=''>Almacen</p>
                                            </div>
                                            <div className='th'>
                                                <p className=''>Coment</p>
                                            </div>
                                            <div className='th'>

                                            </div>
                                        </div>
                                    </div>
                                    {conceptos?.length > 0 ? (
                                        <div className='table__body'>
                                            {conceptos.map((concept: any, index: any) => (
                                                <div className='tbody__container' key={index}>
                                                    <div className='tbody'>
                                                        <div className='td'>
                                                            <p className="folio-identifier">{concept.codigo}-{concept.descripcion}</p>
                                                        </div>
                                                        <div className='td'>
                                                            <div>
                                                                <input className='inputs__general' value={concept.cantidad === null ? '' : concept.cantidad}
                                                                    onChange={(e) => handleAmountChange(e, index)} type="number" placeholder='Cantidad' />
                                                            </div>
                                                        </div>
                                                        <div className='td'>
                                                            <div>
                                                                <select className='traditional__selector' onChange={(event) => handleSelectUnits(event, index)} value={selectedUnit[index] || ''}>
                                                                    {concept.unidades?.map((unit: any) => (
                                                                        <option key={unit.id} value={unit.id_unidad}>
                                                                            {unit.nombre}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className='td'>
                                                            {concept.oc ?
                                                                <p>{concept?.oc}</p>
                                                                :
                                                                <p>N/A</p>
                                                            }

                                                        </div>
                                                        <div className='td'>
                                                            <select className='traditional__selector' onChange={(event) => handleProveedorChange(event, index)} value={selectedSupplier[index]} >
                                                                {concept.proveedores?.map((item: any) => (
                                                                    <option key={item.id} value={item.id_proveedor}>
                                                                        {item.proveedor}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className='td'>
                                                            <select className='traditional__selector' onChange={(event) => handleStoreChange(event, index)} value={concept.id_almacen} >
                                                                {store?.map((item: any) => (
                                                                    <option key={item.id} value={item.id}>
                                                                        {item.nombre}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className='td'>
                                                            <div>
                                                                <input className='inputs__general' value={concept.comentarios === '' ? '' : concept.comentarios} onChange={(e) => handleComentariosChange(e, index)} type="text" placeholder='Comentarios' />
                                                            </div>
                                                        </div>
                                                        <div className='td delete'>
                                                            <div className='delete-icon' onClick={() => deleteTicket(concept, index)} title='Eliminar concepto'>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="empty">
                                            <p className='text'>Sin conceptos</p>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3d3e42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-bucket"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 7m-8 0a8 4 0 1 0 16 0a8 4 0 1 0 -16 0" /><path d="M4 7c0 .664 .088 1.324 .263 1.965l2.737 10.035c.5 1.5 2.239 2 5 2s4.5 -.5 5 -2c.333 -1 1.246 -4.345 2.737 -10.035a7.45 7.45 0 0 0 .263 -1.965" /></svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {selectedOption == 1 ?
                        <div className='row__three'>
                            <div className="subtotal">
                                <p className='title'>Subtotal</p>
                                <p className='result'>$ {subTotal.toFixed(2)}</p>
                            </div>
                            <div className="discount">
                                <p className='title'>Descuento</p>
                                <p className='result'>$ {discount.toFixed(2)}</p>
                            </div>
                            <div className="iva">
                                <p className='title'>IVA</p>
                                {/* Si applyExtraDiscount es true, mostrar 16%, de lo contrario, mostrar el valor calculado */}
                                <p className='result'>$ {IVA.toFixed(2)}</p>
                            </div>
                            <div className="total">
                                <p className='title'>Total</p>
                                {/* Ajustar el cálculo del total basado en si applyExtraDiscount está marcado */}
                                <p className='result'>$ {total.toFixed(2)}</p>
                            </div>
                        </div>
                        :
                        ''
                    }
                    <div className="mt-4 d-flex justify-content-center">
                        <button className='btn__general-purple' onClick={(e) => handleCreateTickets(e)}>Crear nueva entrada</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalCreate
