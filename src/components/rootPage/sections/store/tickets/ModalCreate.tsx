import { useState, useEffect } from "react"
import useUserStore from "../../../../../zustand/General";
import { storeArticles } from '../../../../../zustand/Articles';
import { storeTickets } from "../../../../../zustand/Tickets";
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/l10n/es.js'
import './styles/ModalCreate.css'
import APIs from "../../../../../services/services/APIs";
import Empresas_Sucursales from "../../../Dynamic_Components/Empresas_Sucursales";
import ByOC from "./types/ByOC";
import Direct from "./types/Direct";


const ModalCreate = () => {
    const setModalTickets = storeTickets(state => state.setModalTickets)
    const setConceptos = storeTickets(state => state.setConceptos)

    const { articles }: any = storeArticles();
    const [companies, setCompanies] = useState<any>()
    const [branchOffices, setBranchOffices] = useState<any>()
    const { createTickets, modalTickets, conceptos }: any = storeTickets();
    const userState = useUserStore(state => state.user);
    let user_id = userState.id

    const [selectedBranchOffice, setSelectedBranchOffice] = useState<number | null>(null);

    const [comments, setComments] = useState<any>('')

    const [store, setStore] = useState<any>()

    const fecth = async () => {
        let result = await APIs.getStore(user_id)
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
        const newArticleStates = [...conceptos];
        newArticleStates[index].cantidad = value === '' ? null : parseFloat(value);
        setConceptos(newArticleStates);
    };

    const handleComentariosChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        const newArticleStates = [...conceptos];
        newArticleStates[index].comentarios = value;
        setConceptos(newArticleStates);

    }

    const handleSelectUnits = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const valorSeleccionado = parseInt(event.target.value, 10); // Base 10 para números decimales
        conceptos[index].unidad = valorSeleccionado;
        // Crear una copia del arreglo de selecciones temporales
        const nuevasSelecciones = [...selectedUnit];
        // Actualizar el valor seleccionado en la posición del índice correspondiente
        nuevasSelecciones[index] = valorSeleccionado;
        // Actualizar el estado con las nuevas selecciones
        setSelectedUnit(nuevasSelecciones);
    };



    const handleProveedorChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const temp_proveedor = parseInt(event.target.value); // Convertir a número entero
        console.log(temp_proveedor)
        conceptos[index].id_proveedor = temp_proveedor;
        const nuevaInstancia = [...selectedSupplier];
        nuevaInstancia[index] = temp_proveedor;
        setSelectedSupplier(nuevaInstancia);
    };

    const handleStoreChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const temp_store = parseInt(event.target.value, 10);
        conceptos[index].id_almacen = temp_store;
        const nuevaInstancia = [...selectedStore];
        nuevaInstancia[index] = temp_store;
        setSelectedStore(nuevaInstancia);
    };



    const handleCreateAreas = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let id_sucursal = branchOffices.id;
        let id_usuario_crea = user_id;
        let comentarios = comments;

        try {
            await createTickets(id_sucursal, id_usuario_crea, comentarios, conceptos)
            console.log({ id_sucursal, id_usuario_crea, comentarios, conceptos })

        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {

    }, [conceptos])

    const deleteTicket = (ticket: any, indexTicket: any) => {
        let filter = conceptos.filter((x: any, index: any) => index !== indexTicket)
        setConceptos(filter)
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

        const filter_flete = conceptos.filter((x: any, index: number, self: any[]) => {
            const isFirstOccurrence = index === self.findIndex((y: any) => y.id_orden_compra === x.id_orden_compra);
            if (isFirstOccurrence) {
                costo_flete += x.costo_flete;
            }
            return isFirstOccurrence;
        });


        conceptos.forEach((x: any) => {
            totalSub += x.cantidad * x.precio_unitario;
            totalDiscount += x.descuento;

            if (x.iva_on) {
                let iva = (x.cantidad * x.precio_unitario) - x.descuento
                iva += iva * .16
            }

        });

        setSubTotal(totalSub);
        setDiscount(totalDiscount);
        setIVA(iva);
        setTotal((totalSub - totalDiscount) + iva + costo_flete);
    }, [conceptos]);



    return (
        <div className={`overlay__tickets ${modalTickets == 'modal-create_ticket' ? 'active' : ''}`}>
            <div className={`popup__tickets ${modalTickets == 'modal-create_ticket' ? 'active' : ''}`}>
                <div>
                <a href="#" className="btn-cerrar-popup__tickets" onClick={() => setModalTickets('')}>
                    <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                </a>
                <p className='title__modals'>Crear nueva área</p>
                </div>
                <form className='conatiner__create_tickets' onSubmit={handleCreateAreas}>
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
                        <div className="row">
                            <div className="col-8">
                                <Empresas_Sucursales empresaDyn={companies} sucursalDyn={branchOffices} setEmpresaDyn={setCompanies} setSucursalDyn={setBranchOffices}  modeUpdate={false}/>
                            </div>
                            <div className="col-4 comments">
                                <label className='label__general'>Comentarios</label>
                                <input className='inputs__general' type='text' value={comments} onChange={(e) => setComments(e.target.value)} placeholder='Comentarios' />
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
                                    <div>
                                        <div className='table__numbers'>
                                            <p className='text'>Total de articulos</p>
                                            <div className='quantities_tables'>{conceptos?.length}</div>
                                        </div>
                                    </div>
                                    <div className='table__head'>
                                        <div className='thead'>
                                            <div className='th'>
                                                <p className=''>Articulo</p>
                                            </div>
                                            <div className='th'>
                                                <p className=''>Cant</p>
                                            </div>
                                            <div className='th'>
                                                <p className=''>Flete de orden</p>
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
                                                            {concept.codigo}
                                                        </div>
                                                        <div className='td'>
                                                            <div>
                                                                <input className='inputs__general' value={concept.cantidad === null ? '' : concept.cantidad} onChange={(e) => handleAmountChange(e, index)} type="number" placeholder='Cantidad' />
                                                            </div>
                                                        </div>
                                                        <div className="td">
                                                            {concept.sumar_flete == 0 ?
                                                                <p>{concept.costo_flete}</p>
                                                                :
                                                                <p>No aplica</p>
                                                            }
                                                            <p></p>
                                                        </div>
                                                        <div className='td'>
                                                            <div>
                                                                <select className='traditional__selector' onChange={(event) => handleSelectUnits(event, index)} value={selectedUnit[index] || ''}>
                                                                    {concept.unidades?.map((unit: any) => (
                                                                        <option key={unit.id} value={unit.id}>
                                                                            {unit.nombre}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className='td'>
                                                            <p>N/A</p>
                                                        </div>
                                                        <div className='td'>
                                                            <select className='traditional__selector' onChange={(event) => handleProveedorChange(event, index)} value={selectedSupplier[index]} >
                                                                {concept.proveedores?.map((item: any) => (
                                                                    <option key={item.id} value={item.id}>
                                                                        {item.proveedor}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className='td'>
                                                            <select className='traditional__selector' onChange={(event) => handleStoreChange(event, index)} value={selectedStore[index] || ''} >
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
                                                        <div className='td'>
                                                            <button className='btn__delete_users' type='button' onClick={() => deleteTicket(concept, index)}>Eliminar</button>
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
                                <p className='result'>$ {IVA}</p>
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
                    <div className="mt-4">
                        <button className='btn__general-purple' type='submit'>Crear nueva entrada</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ModalCreate
