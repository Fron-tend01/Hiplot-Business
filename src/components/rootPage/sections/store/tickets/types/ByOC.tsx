import React, { useEffect, useState } from 'react'
import Empresas_Sucursales from '../../../../Dynamic_Components/Empresas_Sucursales'
import Flatpickr from "react-flatpickr";
import 'flatpickr/dist/flatpickr.min.css';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import { storeTickets } from '../../../../../../zustand/Tickets';
import { useStore } from 'zustand';
import { storeSeries } from '../../../../../../zustand/Series';
import useUserStore from '../../../../../../zustand/General';
import APIs from '../../../../../../services/services/APIs';
import './styles/ByOC.css'
import { storePurchaseOrders } from '../../../../../../zustand/PurchaseOrders';
import ModalPurchaseOrders from '../../../shopping/purchaseOrders/ModalPurchaseOrders';


const ByOC: React.FC = () => {
    const userState = useUserStore(state => state.user);
    const user_id = userState.id

    const [dates, setDates] = useState<any>([])

    /////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////ByOCa///////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////


    const setConceptos = storeTickets(state => state.setConceptos)
    const { conceptos }: any = useStore(storeTickets)

    const setPurchaseOrders = storeTickets(state => state.setPurchaseOrders)
    const { purchaseOrders }: any = useStore(storeTickets)


    const [companies, setCompanies] = useState<any>()
    const [branchOffices, setBranchOffices] = useState<any>()
    const { getSeriesXUser }: any = storeSeries();

    const [series, setSeries] = useState<any>([])
    const [page, setPage] = useState<number>(1);
    console.log(series)

    const hoy = new Date();
    const haceUnaSemana = new Date();
    haceUnaSemana.setDate(hoy.getDate() - 30);
    const fecth = async () => {
        const resultSeries = await getSeriesXUser({ id: user_id, tipo_ducumento: 2 })
        setSeries({
            selectName: 'Series',
            options: 'nombre',
            dataSelect: resultSeries
        })
        setDates([haceUnaSemana.toISOString().split('T')[0], hoy.toISOString().split('T')[0]])

    }

    useEffect(() => {
        fecth()
    }, [])




    //////////////////////////////////////////// Fechas //////////////////////////////////////////////////



    const filterByRequest = async () => {
        const data = {
            folio: 0,
            id_serie: 0,
            id_sucursal: branchOffices.id,
            id_usuario: user_id,
            id_area: 0,
            tipo: 0,
            desde: dates[0],
            hasta: dates[1],
            status: 0,
            page: page,
            entrada_on: true
        }
        try {
            const result = await APIs.getPurchaseOrders(data);
            setPurchaseOrders(result)
        } catch (error) {
            console.error("Error fetching requisitions:", error);
        }
    }

    const addArticlesByRequest = async (x: any) => {
        console.log('x', x)
        console.log(x)
        for (const xx of x.conceptos) {
            xx.id_orden_compra_concepto = xx.id;
            xx.oc = `${x.serie}-${x.folio}-${x.anio}`
            xx.sumar_flete = x.sumar_flete
            xx.costo_flete = x.costo_flete


        }
        setConceptos([...conceptos, ...x.conceptos]);
    }









    useEffect(() => {
        filterByRequest()
    }, [page])

    const [purchaseOrderToUpdate, setPurchaseOrderToUpdate] = useState<any>(null);

    const setModal = storePurchaseOrders(state => state.setModal)
    const verOc = async (data: any) => {
        setPurchaseOrderToUpdate(data)
        setModal('modal-purchase-orders-update')
        // data.conceptos.forEach((element: any) => {
        //     setConcepts(prevConcepts => ([{
        //         ...prevConcepts,
        //         cantidad: element.cantidad,
        //         codigo: element.codigo,
        //         comentarios: element.comentarios,
        //         descripcion: element.descripcion,
        //         iva_on: element.iva_on,
        //         precio_unitario: element.precio_unitario,
        //         proveedor: element.proveedor,
        //         unidad: element.unidad,

        //     }]));
        // });
    }
    return (
        <div className='mt-4 conatiner__by-request'>
            <ModalPurchaseOrders purchaseOrderToUpdate={purchaseOrderToUpdate} />
            <div className='add-client__container'>
                <div className='col-12 title '>
                    <p>Agregar Articulos por Orden de Compra</p>
                </div>
            </div>
            <div className='row'>
                <div className='col-8'>
                    <Empresas_Sucursales empresaDyn={companies} sucursalDyn={branchOffices} setEmpresaDyn={setCompanies} setSucursalDyn={setBranchOffices} modeUpdate={false} />
                </div>
                <div className='col-3 row'>

                    <div className="col-6">
                        <label className="label__general">Desde</label>
                        <div className="flex gap-4 container_dates__requisition">
                            <Flatpickr
                                className="date"
                                id="fecha-desde"
                                onChange={(date) => {
                                    const startDate = date[0]?.toISOString().split("T")[0] || "";
                                    setDates([startDate, dates[1]]); // Actualiza directamente el arreglo usando Zustand
                                }}
                                options={{
                                    dateFormat: "Y-m-d", // Formato de la fecha
                                    defaultDate: new Date(new Date().setDate(new Date().getDate() - 30)), // Fecha predeterminada: una semana atrás
                                }}
                                placeholder="Selecciona una fecha"
                            />
                        </div>
                    </div>

                    <div className="col-6">
                        <label className="label__general">Hasta</label>
                        <div className="flex gap-4 container_dates__requisition">
                            <Flatpickr
                                className="date"
                                id="fecha-hasta"
                                onChange={(date) => {
                                    const endDate = date[0]?.toISOString().split("T")[0] || "";
                                    setDates([dates[0], endDate]); // Actualiza directamente el arreglo usando Zustand
                                }}
                                options={{
                                    dateFormat: "Y-m-d", // Formato de la fecha
                                    defaultDate: new Date(), // Fecha predeterminada: hoy
                                }}
                                placeholder="Selecciona una fecha"
                            />
                        </div>
                    </div>
                </div>
                <div className='col-1 d-flex align-items-end justify-content-end container__search '>
                    <button className='btn__general-purple btn__container' type='button' onClick={filterByRequest}>
                        Buscar
                        <svg className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /></svg>
                    </button>
                </div>
            </div>
            <div className='row__two'>
                <div className=''>
                    {purchaseOrders?.length > 0 ? (
                        <div className='table__modal_filter_tickets-piv' >
                            <div className='table__numbers'>
                                <p className='text'>Tus ordenes de compras</p>
                                <div className='quantities_tables'>{purchaseOrders.length}</div>
                            </div>
                            <div className='table__body'>
                                {purchaseOrders?.map((x: any, index: any) => (
                                    <div className='tbody__container' key={index}>
                                        {/* Fila principal */}
                                        <div className='tbody'>
                                            <div className='td'>
                                                {x.serie}-{x.folio}-{x.anio}
                                            </div>
                                            <div className='td'>
                                                {x.empresa} ({x.sucursal})
                                            </div>
                                            <div className='td'>
                                                {x.fecha_creacion}
                                            </div>
                                            <div className='td'>
                                                <div>
                                                    <button onClick={() => verOc(x)} type='button' className='btn__general-purple'>
                                                        Ver detalle
                                                    </button>
                                                </div>
                                            </div>
                                            <div className='td'>
                                                <div>
                                                    <button className='btn__general-purple' type='button' onClick={() => addArticlesByRequest(x)}>
                                                        Agregar
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                        {/* Sub-recorrido para conceptos */}
                                        <table className='concepts-table'>
                                            <thead>
                                                <tr>
                                                    <th>Articulo</th>
                                                    <th>Cantidad</th>
                                                    <th>Comentarios</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {x.conceptos?.map((concepto: any, subIndex: any) => (
                                                    <tr key={subIndex}>
                                                        <td >{concepto.codigo}-{concepto.descripcion}</td>
                                                        <td >{concepto.cantidad}</td>
                                                        <td >{concepto.comentarios}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </div>

                        </div>
                    ) : (
                        <>
                            <br />
                            <p className='text'>No hay ordes de compras que mostrar</p>
                        </>
                    )}
                </div>
            </div>
            <div className='mt-4 d-flex justify-content-between'>
                <div>
                    <button className='btn__general-purple' onClick={() => { setPage(page - 1) }}
                        disabled={page == 1}>Anterior</button>
                </div>
                <div>
                    <button className='btn__general-purple' onClick={() => { setPage(page + 1) }}>Siguente</button>
                </div>
            </div>
        </div>
    )
}

export default ByOC
