import { useState, useEffect } from "react"
import useUserStore from "../../../../../zustand/General";
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
    const { getStore }: any = storeStore()
    const { getPDFTickets }: any = storeTickets();
    const userState = useUserStore(state => state.user);
    const user_id = userState.id

    const [conceptos, setConceptos] = useState<any>([])
    useEffect(() => {
        getStore(user_id)
        setConceptos(updateTickets.conceptos)
    }, [updateTickets])



    const [subtotal] = useState<number>(0); // Assuming you have declared `setSubtotal` elsewhere

    const [discount] = useState<number>(0); // Assuming you have declared `setDiscount` elsewhere

    const [total] = useState<number>(0);

    const [IVA] = useState<any>(null)

    const pdf = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            // Supongamos que tienes el ID de la requisición
            await getPDFTickets(updateTickets.id);
            window.open(`http://hiplot.dyndns.org:84/api_dev/pdf_entrada/${updateTickets.id}`, '_blank');
        } catch (error) {
            console.error('Error al generar el PDF:', error);
        }
    };


    const [purchaseOrderToUpdate, setPurchaseOrderToUpdate] = useState<any>(null);

    const setModal = storePurchaseOrders(state => state.setModal)
    const verOc = async (id_oc: number) => {
        const data = {
            id: id_oc,
            folio: 0,
            id_serie: 0,
            id_sucursal: 0,
            id_usuario: user_id,
            desde: new Date().toISOString().split('T')[0],
            hasta: new Date().toISOString().split('T')[0],
            status: 0
        }

        const result: any = await APIs.getPurchaseOrders(data);
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
            <div className="table__modal_update_tickets">
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
                                <p className=''>Prov</p>
                            </div>
                            <div className='th'>
                                <p className=''>Almacen</p>
                            </div>
                            <div className='th'>
                                <p className=''>OC</p>
                            </div>
                            <div className='th'>
                                <p className=''>Coment</p>
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
                                        <div className="td">
                                            <p className="amount-identifier">{concept.cantidad}</p>
                                        </div>
                                        <div className="td">
                                            <p>{concept.unidad}</p>
                                        </div>
                                        <div className="td">
                                            <p>{concept.proveedor}</p>
                                        </div>
                                        <div className="td">
                                            <p>{concept.almacen}</p>
                                        </div>
                                        <div className="td">
                                            <button className='btn__general-gray' onClick={() => verOc(concept.data_oc.id_oc)}>{concept.data_oc.folio}</button>
                                        </div>
                                        <div className="td">
                                            <p>{concept.comentarios}</p>
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
            <div className='row__three'>
                <div className='btns'>
                    <div className='subtotal'>
                        <div>
                            <p className='name'>Subtotal</p>
                            <p className='value'>$ {subtotal}</p>
                        </div>
                    </div>
                    <div className='discount'>
                        <div>
                            <p className='name'>Descuento</p>
                            <p className='value'>$ {discount}</p>
                        </div>
                    </div>
                    <div className='urgency'>
                        <div>
                            <p className='name'>Urgencia</p>
                            <p className='value'>$ {IVA}</p>
                        </div>
                    </div>
                    <div className='total'>
                        <div>
                            <p className='name'>Total</p>
                            <p className='value'>$ {total}</p>
                        </div>
                    </div>
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
