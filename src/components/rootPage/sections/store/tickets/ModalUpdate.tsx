import { useState, useEffect } from "react"
import useUserStore from "../../../../../zustand/General";
import { storeArticles } from '../../../../../zustand/Articles';
import { storeStore } from "../../../../../zustand/Store";
import { storeTickets } from "../../../../../zustand/Tickets";
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/l10n/es.js'
import './styles/ModalCreate.css'
import './styles/ModalUpdate.css'
import { storePurchaseOrders } from "../../../../../zustand/PurchaseOrders";
import APIs from "../../../../../services/services/APIs";
import ModalPurchaseOrders from "../../shopping/purchaseOrders/ModalPurchaseOrders";


const ModalUpdate = ({ updateTickets }: any) => {

    const units = [
        {
            id: 0,
            name: 'PZA'
        },
        {
            id: 1,
            name: 'KG'
        }
    ]

    const { articles }: any = storeArticles();
    const { store, getStore }: any = storeStore()
    const { getPDFTickets }: any = storeTickets();
    const userState = useUserStore(state => state.user);
    let user_id = userState.id

    const [conceptos, setConceptos] = useState<any>([])
    useEffect(() => {
        getStore(user_id)
        setConceptos(updateTickets.conceptos)
    }, [updateTickets])


    const [seleccionesTemporales, setSeleccionesTemporales] = useState<string[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<any>([])
    const [suppliersModal] = useState<any[]>([])
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

    const handleSeleccion = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const valorSeleccionado = event.target.value;
        conceptos[index].unidad = valorSeleccionado;
        // Crear una copia del arreglo de selecciones temporales
        const nuevasSelecciones = [...seleccionesTemporales];
        // Actualizar el valor seleccionado en la posición del índice correspondiente
        nuevasSelecciones[index] = valorSeleccionado;
        // Actualizar el estado con las nuevas selecciones
        setSeleccionesTemporales(nuevasSelecciones);
    };



    const handleProveedorChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const temp_proveedor = parseInt(event.target.value, 10); // Convertir a número entero
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




    const [subtotal] = useState<number>(0); // Assuming you have declared `setSubtotal` elsewhere

    const [discount] = useState<number>(0); // Assuming you have declared `setDiscount` elsewhere

    const [total] = useState<number>(0);

    const [IVA] = useState<any>(null)

    const pdf = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            // Supongamos que tienes el ID de la requisición
            await getPDFTickets(updateTickets.id);
            window.open(`https://hiplotbusiness.com/api_dev/pdf_entrada/${updateTickets.id}`, '_blank');
        } catch (error) {
            console.error('Error al generar el PDF:', error);
        }
    };


    const [purchaseOrderToUpdate, setPurchaseOrderToUpdate] = useState<any>(null);

    const setModal = storePurchaseOrders(state => state.setModal)
    const verOc = async (id_oc: number) => {
        let data = {
            id: id_oc,
            folio: 0,
            id_serie: 0,
            id_sucursal: 0,
            id_usuario: user_id,
            desde: new Date().toISOString().split('T')[0],
            hasta: new Date().toISOString().split('T')[0],
            status: 0
        }

        let result: any = await APIs.getPurchaseOrders(data);
        setModal('modal-purchase-orders-update')
        setPurchaseOrderToUpdate(result[0])
    }
    return (
        <div className='conatiner__update_tickets'>
            <div className="row">
                <div className="col-12">
                    <div className="card ">
                        <div className="card-body bg-standar">
                            <h3 className="text">{updateTickets.serie}-{updateTickets.folio}-{updateTickets.anio}</h3>
                            <hr />
                            <div className='row'>
                                <div className='col-6 md-col-12'>
                                    <span className='text'>Creado por: <b>{updateTickets.usuario_crea}</b></span><br />
                                    <span className='text'>Fecha de Creación: <b>{updateTickets.fecha_creacion}</b></span><br />

                                </div>
                                <div className='col-6 md-col-12'>
                                    <span className='text'>Empresa: <b>{updateTickets.empresa}</b></span><br />
                                    <span className='text'>Sucursal: <b>{updateTickets.sucursal}</b></span><br />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-12'>
                                    <span className='text'>Comentarios: {updateTickets.comentarios}</span>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className=''>
                <div className='' >
                    <div>
                        <div>
                            {updateTickets.conceptos ? (
                                <div className='table__numbers'>
                                    <p className='text'>Total de articulos</p>
                                    <div className='quantities_tables'>{updateTickets.conceptos.length}</div>
                                </div>
                            ) : (
                                <p className='text'>No hay empresas</p>
                            )}
                        </div>
                        <div className="table__requisicion">
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead className="table__head">
                                    <tr className="thead">
                                        <th>Articulo</th>
                                        <th>Cantidad</th>
                                        <th>Unidad</th>
                                        <th>Prov.</th>
                                        <th>Almacen.</th>
                                        <th>OC</th>
                                        <th>Comentarios</th>
                                    </tr>
                                </thead>
                                <tbody className="table__body">
                                    {conceptos && conceptos.length > 0 ? (
                                        conceptos.map((con: any, index: number) => (
                                            <tr className="tbody__container" key={index} >
                                                <td>({con.codigo}) {con.descripcion}</td>
                                                <td>{con.cantidad}</td>
                                                <td>{con.unidad}</td>
                                                <td>{con.proveedor}</td>
                                                <td>{con.almacen}</td>
                                                <td >
                                                    <button className='btn__general-gray' onClick={() => verOc(con.data_oc.id_oc)}>{con.data_oc.folio}</button>
                                                </td>
                                                <td>{con.comentarios}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={10} style={{ textAlign: "center" }}>
                                                No hay requisiciones disponibles
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row__three'>
                <div>
                    <p className='title'>Subtotal</p>
                    <p className='result'>$ {subtotal.toFixed(2)}</p>
                </div>
                <div>
                    <p className='title'>Descuento</p>
                    <p className='result'>$ {discount.toFixed(2)}</p>
                </div>
                <div>
                    <p className='title'>IVA</p>
                    {/* Si applyExtraDiscount es true, mostrar 16%, de lo contrario, mostrar el valor calculado */}
                    <p className='result'>{IVA}</p>
                </div>
                <div>
                    <p className='title'>Total</p>
                    {/* Ajustar el cálculo del total basado en si applyExtraDiscount está marcado */}
                    <p className='result'>$ {total.toFixed(2)}</p>
                </div>
            </div>
            <div className="row__four">
                <div>
                    <button className="btn__general-purple" onClick={pdf}>PDF</button>
                </div>
            </div>
            <ModalPurchaseOrders purchaseOrderToUpdate={purchaseOrderToUpdate} />
        </div>

    )
}

export default ModalUpdate
