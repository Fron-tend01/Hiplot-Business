import React, { useEffect, useState } from 'react'
import { storeSaleOrder } from '../../../../../zustand/SalesOrder'
import { useStore } from 'zustand'
import './ModalSaleOrder.css'
import Empresas_Sucursales from '../../../Dynamic_Components/Empresas_Sucursales'
import Select from '../../../Dynamic_Components/Select'
import Flatpickr from "react-flatpickr";
import ArticleViewModal from '../ArticleViewModal'
import { storeArticleView } from '../../../../../zustand/ArticleView'
import APIs from '../../../../../services/services/APIs'
import useUserStore from '../../../../../zustand/General'
import { ClientsRequests } from '../../../../../fuctions/Clients'
import { useSelectStore } from '../../../../../zustand/Select'
import Personalized from '../Personalized'
import { storePersonalized } from '../../../../../zustand/Personalized'
import Swal from 'sweetalert2';
import { storeDv } from '../../../../../zustand/Dynamic_variables'
import { storeModals } from '../../../../../zustand/Modals'
import SeeCamposPlantillas from '../SeeCamposPlantillas'
import Binnacle from './components/Binnacle'

const ModalSalesOrder: React.FC = () => {
    const userState = useUserStore(state => state.user);
    const user_id = userState.id

    const setPersonalizedModal = storePersonalized(state => state.setPersonalizedModal)

    const setModalArticleView = storeArticleView(state => state.setModalArticleView)
    const selectedIds: any = useSelectStore((state) => state.selectedIds);
    const { normalConcepts, customConcepts, personalized }: any = useStore(storePersonalized)

    const setNormalConcepts = storePersonalized((state) => state.setNormalConcepts);

    const setCustomData = storePersonalized((state) => state.setCustomData);

    const setDataUpdate = storePersonalized((state) => state.setDataUpdate);


    const setDataSaleOrder = storeSaleOrder((state) => state.setDataSaleOrder);
    const setSubModal = storeSaleOrder((state) => state.setSubModal);

    const [companies, setCompanies] = useState<any>([])

    const [branchOffices, setBranchOffices] = useState<any>([])

    const { getClients }: any = ClientsRequests()

    const { saleOrdersToUpdate }: any = useStore(storeSaleOrder);

    const setModalSalesOrder = storeSaleOrder(state => state.setModalSalesOrder)
    const { modalSalesOrder }: any = useStore(storeSaleOrder)




    const [clients, setClients] = useState<any>()
    const [idCotizacion, setIdCotizacion] = useState<number>(0)

    const [searCustomer, setSearchCustomer] = useState<any>('')

    const [title, setTitle] = useState<string>('')

    const hoy = new Date();
    const haceUnaSemana = new Date();
    haceUnaSemana.setDate(hoy.getDate() - 7);




    ////////////////////////
    /// Fechas
    ////////////////////////

    // Inicializa el estado con la fecha y hora formateadas
    const [dates, setDates] = useState(["", ""]); // Asegúrate de que el array tenga siempre dos elementos.

    const handleDateChange = (fechasSeleccionadas: Date[], index: number) => {
        const updatedDates = [...dates]; // Clonar el estado actual

        // Actualizar solo el índice correspondiente
        updatedDates[index] =
            fechasSeleccionadas[0]
                ?.toISOString()
                .split("T")
                .join(" ")
                .slice(0, 16) || "";

        setDates(updatedDates.slice(0, 2)); // Garantizar que el estado tenga solo dos elementos
    };

    useEffect(() => {
        if (modalSalesOrder == 'sale-order__modal-update') {
            setDataSaleOrder(saleOrdersToUpdate?.conceptos)
            setNormalConcepts(saleOrdersToUpdate?.conceptos)
        }
    }, [saleOrdersToUpdate])


    const handleCreateSaleOrder = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const filter = normalConcepts.filter((x: any) => x.personalized == false || x.personalized == undefined)

        const [datePartOne, timePartOne] = dates[0].split(" ");
        const [datePartTwo, timePartTwo] = dates[1].split(" ");
        filter.forEach((element: any) => {
            element.unidad = element.id_unidad
            element.total = element.precio_total
            element.urgencia = element.monto_urgencia
            element.campos_plantilla.forEach((cp: any) => {
                cp.valor = cp.valor.toString()
            });
        });

        if (personalized.length > 0) {
            personalized?.forEach((element: any) => {
                element.conceptos.forEach((x: any) => {
                    element.unidad = element.id_unidad
                    element.total = element.precio_total
                    element.urgencia = element.monto_urgencia
                    element.campos_plantilla.forEach((cp: any) => {
                        cp.valor = cp.valor.toString()
                    });
                });
            });
        }
        const data = {
            id_sucursal: branchOffices.id,
            id_cliente: selectedIds.clients.id,
            id_usuario_crea: user_id,
            titulo: title,
            id_cotizacion_relacionada: idCotizacion,
            hora_entrega_produccion: timePartOne,
            fecha_entrega_produccion: datePartOne,
            hora_entrega_cliente: timePartTwo,
            fecha_entrega_cliente: datePartTwo,
            conceptos: filter,
            conceptos_pers: personalized,
            conceptos_elim: []
        }
        try {
            const result: any = await APIs.createSaleOrder(data);
            if (result.error == true) {
                return Swal.fire('Advertencia', result.mensaje, 'warning');
            } else {
                Swal.fire('Orden de compra creada exitosamente', result.mensaje, 'success');
            }

        } catch (error) {
            console.error("Error al crear la orden de compra:", error);
            Swal.fire('Hubo un error al crear la orden de compra', '', 'error');
        }
    }



    const searchClients = async () => {
        const data = {
            id_sucursal: branchOffices.id,
            id_usuario: user_id,
            nombre: searCustomer
        }
        const result = await getClients(data)
        setClients({
            selectName: 'Cliente',
            options: 'razon_social',
            dataSelect: result
        })
    }


    const modalSeeConcepts = (article: any) => {
        setPersonalizedModal('personalized_modal-quotation-update')
        setDataUpdate(article)
    }

    const undoConcepts = (article: any, i: number) => {
        const filter = customConcepts.filter((_: any, index: number) => index !== i)
        const data = [...filter, ...article.conceptos]
        setNormalConcepts(data)
        setCustomData([...customConcepts, ...article.conceptos]);
    }


    const deleteArticle = (_: any, i: number) => {
        const filter = normalConcepts.filter((_: any, index: number) => index !== i)
        setNormalConcepts(filter)
        setCustomData(filter);
    }

    const SaleOrderStatus = () => {
        APIs.getSaleOrderStatus(saleOrdersToUpdate.id)
    }

    const [modalProduction, setModalProduction] = useState<string>('')
    const [dataProduction, setDataProduction] = useState<any>()

    const SaleOrderProduction = async () => {
        setModalProduction('sale-order-production__modal')
        console.log(modalProduction)

        let data = {
            articulos: saleOrdersToUpdate.conceptos,
            id_sucursal: saleOrdersToUpdate.id_sucursal
        }

        try {
            let response = await APIs.calculateSalesDeliveryDime(data)
            setDataProduction(response)
        } catch (error) {

        }
    }



    const sendProduction = async () => {
        let data = {
            id_ov: saleOrdersToUpdate.id,
            id_usuario: user_id,
            fecha_entrega: dataProduction.fecha_produccion,
            hora_entrega: dataProduction.hora_produccion
        }

        try {
            let response = await APIs.createSaleOrderProduction(data)
        } catch (error) {

        }
    }


    const handleAreasChange = (item: any, index: number) => {
        console.log(item, index)
    }

    const updateSaleOrderConcept = async (article: any) => {
        let data = {
            id: article.id,
            id_articulo: article.id_articulo,
            produccion_interna: article.produccion_interna,
            id_area_produccion: article.id_area_produccion,
            enviar_a_produccion: article.enviar_a_produccion,
            cantidad: article.cantidad,
            monto_urgencia: article.monto_urgencia,
            monto_descuento: article.monto_descuento,
            precio_unitario: article.precio_unitario,
            id_unidad: article.id_unidad,
            obs_produccion: article.obs_produccion,
            obs_factura: article.obs_factura,
            id_pers: article.id_pers,
        }

        try {
            let response: any = await APIs.updateOvConcepto(data)
            if (response.error) {
                Swal.fire('Advertencia', response.mensaje, 'warning');
            } else {
                Swal.fire('Exito', response.mensaje, 'success');
            }
        } catch (error: any) {
            Swal.fire('Error al actualizar el concepto', error, 'success');
        }
    }

    const binnacleModal = () => {
        setSubModal('logbook__sales-order-modal')
    }

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value.trim();
        const newConcept = [...normalConcepts];
        newConcept[index].precio_unitario = value === '' ? null : parseInt(value, 10);
        setNormalConcepts(newConcept);
    }

    const handleDescountChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value.trim();
        const newConcept = [...normalConcepts];
        newConcept[index].monto_descuento = value === '' ? null : parseInt(value, 10);
        setNormalConcepts(newConcept);
    };

    const handleObsBillChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
        const value = e.target.value.trim();
        const newConcept = [...normalConcepts];
        newConcept[index].obs_factura = value;
        setNormalConcepts(newConcept);
    };

    const handleObsProductionChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
        const value = e.target.value.trim();
        const newConcept = [...normalConcepts];
        newConcept[index].obs_produccion = value;
        setNormalConcepts(newConcept);
    };

    const handleStatusChange = (status: boolean, index: number) => {
        const newStatus = status ? 0 : 1;
        const updatedConcepts = [...normalConcepts];
        updatedConcepts[index].enviar_a_produccion = newStatus;
        updatedConcepts[index].status_produccion = newStatus;
        setNormalConcepts(updatedConcepts);
    };




    const [amount, setAmount] = useState<any>(0)
    const [discount, setdDiscount] = useState<any>(0)
    const [urgency, setdUrgency] = useState<any>(0)
    const [totalGeneral, setdTotalGeneral] = useState<any>(0)

    // useEffect(() => {
    //     let amountTotal = 0;
    //     let descountTotal = 0;
    //     let urgencyTotal = 0;

    //     normalConcepts.forEach((element: any) => {
    //         amountTotal += element.cantidad * element.precio_unitario;
    //         descountTotal += element.monto_descuento;
    //         if (element?.urgency) {
    //             urgencyTotal += element.monto_urgencia;
    //         }
    //     });

    //     setAmount(amountTotal);
    //     setdDiscount(descountTotal)
    //     setdUrgency(urgencyTotal)
    //     setdTotalGeneral(amountTotal - descountTotal + urgencyTotal)
    // }, [normalConcepts]);
    useEffect(() => {
        calcular_totales()
    }, [normalConcepts])
    const calcular_totales = () => {
        const precios = normalConcepts.reduce(
            (acc: any, item: any) => ({
                precio_unitario: acc.precio_unitario + (item.precio_unitario / item.cantidad || 0),
                descuento: acc.descuento + (item.descuento || 0),
                monto_urgencia: acc.monto_urgencia + (item.monto_urgencia || 0),
                total: acc.total + (item.precio_total || 0),
            }),
            { precio_unitario: 0, descuento: 0, monto_urgencia: 0, total: 0 }
        );
        setAmount(precios.total + precios.descuento - precios.monto_urgencia);
        setdDiscount(precios.descuento)
        setdUrgency(precios.monto_urgencia)
        setdTotalGeneral(precios.total)
    }
    const getTicket = async () => {
        try {
            await APIs.getPdfPurchaseOrders(saleOrdersToUpdate.id);
            // Abrimos el PDF en una nueva pestaña
            window.open(`http://hiplot.dyndns.org:84/api_dev/pdf_ov/${saleOrdersToUpdate.id}`, '_blank');
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        if (modalSalesOrder === 'sale-order__modal_bycot' || modalSalesOrder == 'sale-order__modal') {
            setIdCotizacion(saleOrdersToUpdate.id)
            setDataSaleOrder(saleOrdersToUpdate?.conceptos)
            setCompanies({ id: saleOrdersToUpdate.id_empresa })
            setBranchOffices({ id: saleOrdersToUpdate.id_sucursal })
            setTitle(saleOrdersToUpdate.titulo)
            const data = {
                id_sucursal: saleOrdersToUpdate.id_sucursal,
                id_usuario: user_id,
                nombre: saleOrdersToUpdate.rfc
            }
            getClients(data).then((response: any) => {
                setClients({
                    selectName: 'Cliente',
                    options: 'razon_social',
                    dataSelect: response
                })

            })
            calcular_tiempos_entrega()
        } else {
            setDates([saleOrdersToUpdate.fecha_entrega_produccion + ' ' + saleOrdersToUpdate.hora_entrega_produccion,
            saleOrdersToUpdate.fecha_entrega_cliente + ' ' + saleOrdersToUpdate.hora_entrega_cliente])
            setTitle(saleOrdersToUpdate.titulo)
            setDataSaleOrder(saleOrdersToUpdate?.conceptos)
            setCompanies({ id: saleOrdersToUpdate.id_empresa })
            setBranchOffices({ id: saleOrdersToUpdate.id_sucursal })
            const data = {
                id_sucursal: saleOrdersToUpdate.id_sucursal,
                id_usuario: user_id,
                nombre: saleOrdersToUpdate.rfc
            }
            getClients(data).then((response: any) => {
                setClients({
                    selectName: 'Cliente',
                    options: 'razon_social',
                    dataSelect: response
                })

            })
        }
    }, [modalSalesOrder]);


    const calcular_tiempos_entrega = async () => {
        let normales = normalConcepts.filter((x: any) => x.personalized == undefined || x.personalized == false)
        let pers = normalConcepts.filter((x: any) => x.personalized == true)
        let conceptos_a_enviar: any[] = []
        if (normales.length > 0) {
            console.log('entrando a if normales');

            normales.forEach((n: any) => {
                conceptos_a_enviar.push(n)
                console.log('Push en foreach a n', n);

            });

        }
        if (pers.length > 0) {
            pers.forEach((p: any) => {
                if (p.conceptos.length > 0) {
                    p.conceptos.forEach((c: any) => {
                        conceptos_a_enviar.push(c)
                    });
                }
            });
        }


        let data = {
            id_sucursal: saleOrdersToUpdate.id_sucursal,
            articulos: conceptos_a_enviar

        }
        await APIs.CreateAny(data, "calcular_tiempo_entrega")
            .then(async (response: any) => {
                setDataProduction(response)
                setDates([response.fecha_produccion + ' ' + response.hora_produccion, response.fecha_cliente + ' ' + response.hora_cliente])
            })
    }
    const setModalSub = storeModals((state) => state.setModalSub);

    const setIndexVM = storeDv(state => state.setIndex)
    const seeVerMas = (index: number) => {
        setIndexVM(index)
        setModalSub('see_cp')
    }

    const handleUrgencyChange = async (index: number) => {
        let data = {
            "id_articulo": normalConcepts[index].id_articulo,
            "id_sucursal": branchOffices.id,
            "total": normalConcepts[index].precio_total
        }
        const newConcept = [...normalConcepts];
        newConcept[index].urgency = !newConcept[index]?.urgency;

        if (newConcept[index].urgency) {
            await APIs.CreateAny(data, "calcular_urgencia")
                .then(async (response: any) => {
                    if (!response.error) {
                        newConcept[index].monto_urgencia = parseFloat(response.monto_urgencia);
                        newConcept[index].precio_total = parseFloat(response.total_con_urgencia);
                    } else {
                        Swal.fire('Notificación', response.mensaje, 'warning');
                        return
                    }
                })
        } else {
            newConcept[index].precio_total = parseFloat(newConcept[index].precio_total) - parseFloat(newConcept[index].monto_urgencia);
            newConcept[index].monto_urgencia = 0;
        }
        setNormalConcepts(newConcept);

    };
    return (
        <div className={`overlay__sale-order__modal_articles ${modalSalesOrder == 'sale-order__modal' || modalSalesOrder == 'sale-order__modal-update' || modalSalesOrder == 'sale-order__modal_bycot' ? 'active' : ''}`}>
            <div className={`popup__sale-order__modal_articles ${modalSalesOrder == 'sale-order__modal' || modalSalesOrder == 'sale-order__modal-update' || modalSalesOrder == 'sale-order__modal_bycot' ? 'active' : ''}`}>
                <div className='header__modal'>
                    <a href="#" className="btn-cerrar-popup__sale-order__modal_articles" onClick={() => setModalSalesOrder('')} >
                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                    </a>
                    <p className='title__modals'>Orden de venta</p>
                </div>

                {modalSalesOrder == 'sale-order__modal-update' ?
                    <div className="card">
                        <div className={`overlay__sale-order_production__modal_articles ${modalProduction == 'sale-order-production__modal' ? 'active' : ''}`}>
                            <div className={`popup__sale-order_production__modal_articles ${modalProduction == 'sale-order-production__modal' ? 'active' : ''}`}>
                                <div className='header__modal'>
                                    <a href="#" className="btn-cerrar-popup__sale-order_production__modal_articles" onClick={() => setModalProduction('')} >
                                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                                    </a>
                                    <p className='title__modals'>Enviar a produccion</p>
                                </div>
                                <div className='sale-order_production__modal_articles'>
                                    <div>
                                        <div className='d-flex'>
                                            <p>Fecha de entrega cliente</p>
                                            <p className='mx-4'>{dataProduction?.fecha_cliente}</p>
                                            <p>Hora de cliente</p>
                                            <p className='mx-4'>{dataProduction?.hora_cliente}</p>
                                        </div>
                                        <div className='d-flex'>
                                            <p>Fecha de entraga produccion</p>
                                            <p className='mx-4'>{dataProduction?.fecha_produccion}</p>
                                            <p>Hora de produccion</p>
                                            <p className='mx-4'>{dataProduction?.fecha_produccion}</p>
                                        </div>
                                    </div>
                                    <div className='d-flex justify-content-center mt-3'>
                                        <button className='btn__general-purple' onClick={sendProduction}>Mandar a producción</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body bg-standar">
                            <div className='d-flex align-items-center justify-content-between'>
                                <h3 className="text">{saleOrdersToUpdate.serie}-{saleOrdersToUpdate.folio}-{saleOrdersToUpdate.anio}</h3>
                                {modalSalesOrder == 'sale-order__modal_bycot' || saleOrdersToUpdate?.id_cotizacion_relacionada > 0 && saleOrdersToUpdate?.id_cotizacion_relacionada != undefined ?
                                    <div className='d-flex align-items-center related_quote_order'>
                                        <p>Cotización relacionada</p>
                                        {saleOrdersToUpdate?.id_cotizacion_relacionada > 0 ?
                                            <h3 className="text">{saleOrdersToUpdate.serie_cotizacion}-{saleOrdersToUpdate.folio_cotizacion}-{saleOrdersToUpdate.anio_cotizacion}</h3>
                                            :
                                            <h3 className="text" >{saleOrdersToUpdate.serie}-{saleOrdersToUpdate.folio}-{saleOrdersToUpdate.anio}</h3>
                                        }
                                    </div>
                                    : ''}
                            </div>
                            <hr />
                            <div className='row'>
                                <div className='col-6 md-col-12'>
                                    <span className='text'>Creado por: <b>{saleOrdersToUpdate.usuario_crea}</b></span><br />
                                    <span className='text'>Fecha de Creación: <b>{saleOrdersToUpdate.fecha_creacion}</b></span><br />
                                    {saleOrdersToUpdate.status === 0 ? (
                                        <span className="active-status">Activo</span>
                                    ) : saleOrdersToUpdate.status === 1 ? (
                                        <span className="canceled-status">Cancelada</span>
                                    ) : (
                                        saleOrdersToUpdate.status === 2 ? (
                                            <span className="end-status">Terminado</span>
                                        ) : (
                                            ""
                                        )
                                    )}
                                </div>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div className='d-flex'>
                                    <div className='mr-4'>
                                        <button className='btn__general-orange' onClick={getTicket}>Imprimir ticket</button>
                                    </div>
                                    <div className='mr-4'>
                                        <button className='btn__general-purple' onClick={SaleOrderProduction}>Mandar a producción</button>
                                    </div>
                                    <div>
                                        <button className='btn__general-orange' onClick={binnacleModal}>Bitácora</button>
                                    </div>
                                </div>
                                <div>
                                    <button className='btn__general-danger' onClick={SaleOrderStatus}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    ''
                }
                <div className='sale-order__modal_articles' >
                    <div className='row__one'>
                        <div className='row__one'>
                            <div className='row'>
                                <div className='col-12'>
                                    <Empresas_Sucursales update={false} empresaDyn={companies} setEmpresaDyn={setCompanies} sucursalDyn={branchOffices} setSucursalDyn={setBranchOffices} />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-3'>
                                    <label className='label__general'>Buscar</label>
                                    <input className='inputs__general' type="text" value={searCustomer} onChange={(e) => setSearchCustomer(e.target.value)} placeholder='Ingresa el contacto' />
                                </div>
                                <div className='col-4'>
                                    <Select dataSelects={clients} instanceId='clients' nameSelect={'Clientes'} />
                                </div>
                                <div className='col-2 d-flex align-items-end'>
                                    <div>
                                        <button type='button' className='btn__general-purple' onClick={searchClients}>Buscar</button>
                                    </div>
                                </div>
                                <div className='col-3'>
                                    <label className='label__general'>Titulo</label>
                                    <input className='inputs__general' type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Ingresa el titulo' />
                                </div>
                            </div>
                            <div className='row my-4'>
                                <div className="col-6 sale-order__input_container d-flex align-items-center">
                                    <p className="label__general">Fecha de entrega a producción</p>
                                    <div className="container_dates__requisition">
                                        <Flatpickr
                                            className="date"
                                            value={dates[0]} // Fecha inicial
                                            options={{ enableTime: true, dateFormat: "Y-m-d H:i" }}
                                            onChange={(fecha) => handleDateChange(fecha, 0)} // Índice 0
                                            placeholder="Selecciona la fecha de inicio"
                                        />
                                    </div>
                                </div>                            <div className="col-6 sale-order__input_container d-flex align-items-center">
                                    <p className="label__general">Fecha de entrega cliente</p>
                                    <div className="container_dates__requisition">
                                        <Flatpickr
                                            className="date"
                                            value={dates[1]} // Fecha final
                                            options={{ enableTime: true, dateFormat: "Y-m-d H:i" }}
                                            onChange={(fecha) => handleDateChange(fecha, 1)} // Índice 1
                                            placeholder="Selecciona la fecha de fin"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12 d-flex align-items-center justify-content-between'>
                                <p className='title__concepts'>Conceptos</p>
                                <div className='d-flex align-items-center'>
                                    <div className='mx-4'>
                                        <button type='button' className='btn__general-purple' onClick={() => setPersonalizedModal('personalized_modal-sale')}>Personalizados</button>
                                    </div>
                                    <div className='btn__search__articles'>
                                        <svg xmlns="http://www.w3.org/2000/svg" onClick={() => setModalArticleView('article-view__modal')} width="30" height="30" viewBox="0 0 24 24" fill="none" stroke-width="1.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package-search"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" /><path d="m7.5 4.27 9 5.15" /><polyline points="3.29 7 12 12 20.71 7" /><line x1="12" x2="12" y1="22" y2="12" /><circle cx="18.5" cy="15.5" r="2.5" /><path d="M20.27 17.27 22 19" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='table__sales_modal'>
                            {normalConcepts ? (
                                <div className='table__numbers'>
                                    <p className='text'>Total de articulos</p>
                                    <div className='quantities_tables'>{normalConcepts.length}</div>
                                </div>
                            ) : (
                                <p className="text">No hay empresas que mostras</p>
                            )}
                            <div className='table__head'>
                                <div className='thead'>
                                    <div className='th'>
                                        <p>Artículo</p>
                                    </div>
                                    <div className='th'>
                                        <p>Cantidad</p>
                                    </div>
                                    <div className='th'>
                                        <p>Unidad</p>
                                    </div>
                                    <div className='th'>
                                        <p>P/U</p>
                                    </div>
                                    <div>
                                        <p>Total</p>
                                    </div>
                                </div>
                            </div>
                            {normalConcepts ? (
                                <div className='table__body'>
                                    {normalConcepts?.map((article: any, index: number) => {
                                        return (
                                            <div className='tbody__container' key={article.id}>
                                                {article?.personalized ?
                                                    <div className='concept__personalized'>
                                                        <p>Concepto Personalizado</p>
                                                    </div>
                                                    :
                                                    ''
                                                }
                                                {article.personalized ?
                                                    <div className='tbody personalized'>
                                                        <div className='td'>
                                                            <p>{article.codigo}-{article.descripcion}</p>
                                                        </div>
                                                        <div className='td'>
                                                            <p>$ {article.cantidad}</p>
                                                        </div>
                                                        <div className='td'>
                                                            <p>{article.name_unidad || article.unidad}</p>
                                                        </div>
                                                        <div className='td'>
                                                            <input className='inputs__general' type="text" placeholder='Precio' />
                                                        </div>
                                                        <div className='td'>
                                                            <input className='inputs__general' type="text" placeholder='Descuento' />
                                                        </div>
                                                        <div className='td'>
                                                            <p>$ {article.total_concepto}</p>
                                                        </div>
                                                        <div className='td'>
                                                            <button type="button" className='btn__general-purple' onClick={() => modalSeeConcepts(article)}>Conceptos</button>
                                                        </div>
                                                        <div className='td'>
                                                            <button className='btn__general-orange' onClick={() => undoConcepts(article, index)}>Deshacer</button>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className='tbody'>
                                                        <div className='td'>
                                                            <p>{article.codigo}-{article.descripcion}</p>
                                                        </div>
                                                        <div className='td'>
                                                            <p>{article.cantidad}</p>
                                                        </div>
                                                        <div className='td'>
                                                            <p>{article.name_unidad || article.unidad}</p>
                                                        </div>
                                                        <div className='td'>
                                                            ${article.precio_unitario / article.cantidad}
                                                        </div>
                                                        <div className='td'>
                                                            {article.urgency ?
                                                                <p>$ {article.precio_total} <span style={{ color: 'red' }}>(${article.monto_urgencia})</span></p>
                                                                :
                                                                <p>$ {article.precio_total}</p>
                                                            }
                                                        </div>
                                                        <div className='td'>
                                                            {article?.urgency ?
                                                                <button type="button" className='remove_urgency' onClick={() => handleUrgencyChange(index)}>Remover Urgencia</button>
                                                                :
                                                                <button type="button" className='add_urgency' onClick={() => handleUrgencyChange(index)}>Agregar Urgencia</button>
                                                            }
                                                        </div>
                                                        <div className='td'>
                                                            {article?.personalized ?
                                                                <button className='btn__general-purple' onClick={() => setPersonalizedModal('personalized_modal-quotation-update')}>Conceptos</button>
                                                                :
                                                                ''
                                                            }
                                                        </div>
                                                        <div className='td'>
                                                            <button className='btn__general-danger' onClick={() => deleteArticle(article, index)}>Eliminar</button>
                                                        </div>
                                                        <div className='td'>
                                                            <button className='btn__general-purple' onClick={() => seeVerMas(index)}>Ver Más</button>
                                                        </div>
                                                        <div className='td'>
                                                            <div>
                                                                <label>Area</label>
                                                            </div>
                                                            <select className='traditional__selector' onChange={(event) => handleAreasChange(event, index)}  >
                                                                {article?.areas_produccion?.map((item: any) => (
                                                                    <option key={item.id} value={item.id_area}>
                                                                        {item.nombre_area}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className='td'>
                                                            <textarea className={`textarea__general`} placeholder='Observaciones Factura' value={article.obs_factura} onChange={(e) => handleObsBillChange(e, index)} />
                                                        </div>
                                                        <div className='td'>
                                                            <textarea className={`textarea__general `} placeholder='Observaciones Producción' value={article.obs_produccion} onChange={(e) => handleObsProductionChange(e, index)} />
                                                        </div>
                                                        <div>
                                                            <div className="d-block">
                                                                <div>
                                                                    <label>Enviar producción</label>
                                                                </div>
                                                                <label className="switch">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={article.status_produccion === 1}
                                                                        onChange={() =>
                                                                            handleStatusChange(article.status_produccion === 1, index)
                                                                        }
                                                                    />
                                                                    <span className="slider"></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        {modalSalesOrder == 'sale-order__modal-update' ?
                                                            <div className='td'>
                                                                <button type='button' className='btn__general-purple' onClick={() => updateSaleOrderConcept(article)}>Actualizar</button>
                                                            </div>
                                                            :
                                                            ""
                                                        }

                                                    </div>
                                                }
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <p className="text">Cargando datos...</p>
                            )}
                        </div>
                    </div>
                    <div className='row__two mt-4'>
                        <div className='normal'>
                            <div className='item sub-total'>
                                <p className='name'>Sub total General</p>
                                <p className='value'>$ {amount}</p>
                            </div>
                            <div className='item discount'>
                                <p className='name'>Descuento Aplicado</p>
                                <p className='value'>$ {discount}</p>
                            </div>
                            <div className='item urgency'>
                                <p className='name'>Cargo por urgencia</p>
                                <p className='value'>$ {urgency}</p>
                            </div>
                            <div className='item general-total'>
                                <p className='name'>Total General</p>
                                <p className='value'>$ {totalGeneral}</p>
                            </div>
                        </div>
                    </div>
                    {modalSalesOrder !== '' ?
                        <div className='d-flex justify-content-center'>
                            <div>
                                <button className='btn__general-purple' onClick={(e) => handleCreateSaleOrder(e)}>Crear orden de venta</button>
                            </div>
                        </div>
                        :
                        ''
                    }
                </div>
                <ArticleViewModal />
                <Personalized />
                <SeeCamposPlantillas />
                <Binnacle />

            </div>
        </div>

    )
}

export default ModalSalesOrder
