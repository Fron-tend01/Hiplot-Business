import React, { useEffect, useState } from 'react'
import { storeSaleOrder } from '../../../../../zustand/SalesOrder'
import { useStore } from 'zustand'
import './ModalSaleOrder.css'
import Empresas_Sucursales from '../../../Dynamic_Components/Empresas_Sucursales'
import Select from '../../../Dynamic_Components/Select'
import Flatpickr from "react-flatpickr";
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import { toast } from 'sonner'

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
import { saleOrdersRequests } from '../../../../../fuctions/SaleOrders'
import { storeArticles } from '../../../../../zustand/Articles'
import { storeProduction } from '../../../../../zustand/Production'
import ModalProduction from '../../production/ModalProduction'

const ModalSalesOrder: React.FC = () => {
    const userState = useUserStore(state => state.user);
    const user_id = userState.id

    const permisosxVista = storeDv((state) => state.permisosxvista);

    const checkPermission = (element: string) => {
        const permisosxView = storeDv.getState().permisosxvista
        return permisosxView.some((x: any) => x.titulo == element)
    }

    const setSaleOrdersConcepts = storeSaleOrder((state) => state.setSaleOrdersConcepts);
    const { saleOrdersConcepts }: any = useStore(storeSaleOrder);


    const setNormalConcepts = storePersonalized((state) => state.setNormalConcepts);

    const setConceptView = storePersonalized((state) => state.setConceptView);
    const setCustomConceptView = storePersonalized((state) => state.setCustomConceptView);

    const setCustomLocal = storePersonalized((state) => state.setCustomLocal);


    const setSaleOrdersToUpdate = storeSaleOrder(state => state.setSaleOrdersToUpdate)

    const setPersonalizedModal = storePersonalized((state) => state.setPersonalizedModal);
    const setDeleteNormalConcepts = storePersonalized(state => state.setDeleteNormalConcepts)

    const setCustomConcepts = storePersonalized(state => state.setCustomConcepts)
    const setNormalConceptsView = storePersonalized(state => state.setNormalConceptsView)
    const setDeleteCustomConcepts = storePersonalized(state => state.setDeleteCustomConcepts)

    const setModalSalesOrder = storeSaleOrder(state => state.setModalSalesOrder)

    const setModalArticleView = storeArticleView(state => state.setModalArticleView)
    const selectedIds: any = useSelectStore((state) => state.selectedIds);
    const { normalConcepts, customConcepts, conceptView, personalized, deleteCustomConcepts, normalConceptsView }: any = useStore(storePersonalized)
    const { dataGet, changeLength }: any = useStore(storeSaleOrder)
    const setSelectedIds = useSelectStore((state) => state.setSelectedId);


    const setSaleOrders = storeSaleOrder((state) => state.setSaleOrders);

    const setPersonalized = storePersonalized((state) => state.setPersonalized);

    const setCustomData = storePersonalized((state) => state.setCustomData);

    const setDataSaleOrder = storeSaleOrder((state) => state.setDataSaleOrder);

    const setSubModal = storeSaleOrder((state) => state.setSubModal);

    const [companies, setCompanies] = useState<any>([])

    const [branchOffices, setBranchOffices] = useState<any>([])

    const { getClients }: any = ClientsRequests()

    const { saleOrdersToUpdate }: any = useStore(storeSaleOrder);


    const { modalSalesOrder }: any = useStore(storeSaleOrder)


    const { getSaleOrders }: any = saleOrdersRequests()

    const setChangeLength = storeSaleOrder(state => state.setChangeLength)


    const [clients, setClients] = useState<any>()
    const [idCotizacion, setIdCotizacion] = useState<number>(0)

    const [searCustomer, setSearchCustomer] = useState<any>('')

    const [title, setTitle] = useState<string>('')

    const hoy = new Date();
    const haceUnaSemana = new Date();
    haceUnaSemana.setDate(hoy.getDate() - 7);


    const openModalArticle = () => {
        if (branchOffices.id) {
            setModalArticleView('article-view__modal')
        } else {
            toast.warning('Por favor selecione una sucursal para continuar')
        }

    }

    ////////////////////////
    /// Fechas
    ////////////////////////


    const [dates, setDates] = useState(["", ""]); // Estado para las fechas
    const [modify_te, setModifyTe] = useState(0); // Estado para mostrar el aviso

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedDates = [...dates];
        updatedDates[index] = event.target.value; // Captura el valor del input
        setDates(updatedDates);
        setModifyTe(1); // Indica que las fechas han sido modificadas
    };

    // Extraer fecha y hora de los valores seleccionados

    // useEffect(() => {
    //     setDates([
    //         haceUnaSemana.toISOString().split('T')[0],
    //         hoy.toISOString().split('T')[0]
    //     ]);
    // }, [])

    useEffect(() => {

    }, [dates])


    const [modeUpdate, setModeUpdate] = useState<boolean>(false)

    useEffect(() => {
        if (modalSalesOrder == 'sale-order__modal') {
            setModeUpdate(false)

        } else {
            setModeUpdate(true)
        }
    }, [modalSalesOrder])

    useEffect(() => {
        if (modalSalesOrder == 'sale-order__modal-update') {
            setClients({
                selectName: 'Cliente',
                options: 'razon_social',
                dataSelect: [{ id: saleOrdersToUpdate.id_cliente, razon_social: saleOrdersToUpdate.razon_social }]
            })
            console.log('saleOrdersToUpdate', saleOrdersToUpdate)
            setDataSaleOrder(saleOrdersToUpdate?.conceptos)
            setNormalConcepts(saleOrdersToUpdate?.conceptos)
            setDates([`${saleOrdersToUpdate.fecha_entrega_cliente}T${saleOrdersToUpdate.hora_entrega_cliente}`, `${saleOrdersToUpdate.fecha_entrega_produccion}T${saleOrdersToUpdate.hora_entrega_produccion}`]);
            setDataProduction({
                "fecha_produccion": saleOrdersToUpdate.fecha_entrega_produccion,
                "hora_produccion": saleOrdersToUpdate.hora_entrega_produccion,
                "fecha_cliente": saleOrdersToUpdate.fecha_entrega_cliente,
                "hora_cliente": saleOrdersToUpdate.hora_entrega_cliente,
                "sin_tiempos": false
            })
        }

    }, [saleOrdersToUpdate])


    console.log('saleOrdersConcepts', saleOrdersConcepts)

    const handleCreateSaleOrder = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const [datePartOne, timePartOne] = dates[0] ? dates[0].split("T") : ["", ""];
        const [datePartTwo, timePartTwo] = dates[1] ? dates[1].split("T") : ["", ""];
        saleOrdersConcepts.normal_concepts.forEach((element: any) => {
            element.unidad = element.id_unidad
            element.total = element.precio_total
            element.monto_descuento = element.descuento == null ? 0 : element.descuento
            element.urgencia = element.monto_urgencia
            element.campos_plantilla.forEach((cp: any) => {
                cp.valor = cp.valor.toString()
            });
        });

        if (saleOrdersConcepts?.personalized_concepts?.length > 0) {
            saleOrdersConcepts?.personalized_concepts?.forEach((element: any) => {
                element.id = 0
                element.conceptos.forEach((x: any) => {
                    x.unidad = x.id_unidad
                    x.total = x.precio_total
                    x.urgencia = x.monto_urgencia
                    x.monto_descuento = x.descuento == null ? 0 : x.descuento
                    x.campos_plantilla.forEach((cp: any) => {
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
            motivo_modify_te: modify_te,
            id_cotizacion_relacionada: idCotizacion,
            hora_entrega_produccion: timePartOne,
            fecha_entrega_produccion: datePartOne,
            hora_entrega_cliente: timePartTwo,
            fecha_entrega_cliente: datePartTwo,
            conceptos: saleOrdersConcepts.normal_concepts,
            conceptos_pers: saleOrdersConcepts.personalized_concepts,
            conceptos_elim: []
        }
        try {
            const result: any = await APIs.createSaleOrder(data);
            if (result.error == true) {
                return Swal.fire('Advertencia', result.mensaje, 'warning');
            } else {
                Swal.fire('Notificacion', result.mensaje, 'success');
                search()
                setCustomLocal([])
                setNormalConceptsView([])
                setNormalConcepts([])
                setDeleteNormalConcepts([])
                setDeleteCustomConcepts([])
                setCustomConcepts([])
                setConceptView([])
                setCustomConceptView([])
                setSaleOrdersConcepts({ normal_concepts: [], personalized_concepts: [] });

                const dataSaleOrders = {
                    id: result.id,
                    folio: 0,
                    id_sucursal: branchOffices.id,
                    id_serie: 0,
                    id_cliente: dataGet,
                    desde: dataGet.desde,
                    hasta: dataGet.hasta,
                    id_usuario: dataGet.id_usuario,
                    id_vendedor: 0,
                    status: 0,
                    page: 1
                }
                localStorage.removeItem("sale-order");
                const resultData = await getSaleOrders(dataSaleOrders)

                setSaleOrders(resultData)
                let order = resultData[0]
                setModalSalesOrder('sale-order__modal-update')
                setSaleOrdersConcepts({ sale_order: order, normal_concepts: order.conceptos, personalized_concepts: order.conceptos_pers });
                setSaleOrdersToUpdate(order)



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




    const SaleOrderStatus = () => {
        let data = {
            id: saleOrdersToUpdate.id,
            id_usuario: user_id
        }
        Swal.fire({
            title: "Seguro que deseas cancelar la Orden de Venta?",
            text: "Se desapartará el material apartado, está acción no se puede deshacer",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            denyButtonText: `Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                await APIs.CreateAnyPut({}, `cancelar_orden_venta/${data.id}/${data.id_usuario}`)
                    .then(async (response: any) => {
                        if (response.error) {

                        } else {
                            search()
                            Swal.fire('Notificación', response.mensaje, 'success');
                            setModalSalesOrder('')

                        }
                    })
            }
        });

    }



    const [conceptsProductios, setConceptsProductions] = useState<any>()

    const [modalProduction, setModalProduction] = useState<string>('')
    const [dataProduction, setDataProduction] = useState<any>()

    const SaleOrderProduction = async () => {
        let concetps: any = []

        customConcepts.forEach((element: any) => {
            concetps = [...concetps, ...element.conceptos]

        });

        setConceptsProductions([...normalConcepts, ...concetps])


        setModalProduction('sale-order-production__modal')
        if (!modify_te) {
            let data = {
                articulos: saleOrdersToUpdate.conceptos,
                id_sucursal: saleOrdersToUpdate.id_sucursal
            }
            let response: any = await APIs.calculateSalesDeliveryDime(data)
            if (response.hora_cliente && response.hora_produccion) {
                setDataProduction(response)
                setDates([`${response.fecha_produccion}T${response.hora_produccion}`, `${response.fecha_cliente}T${response.hora_cliente}`])
                setModifyTe(0)
            } else {
                setDates([`${response.fecha_produccion}T${hora}`, `${response.fecha_cliente}T${hora}`])
            }

        }
    }


    const setModalLoading = storeArticles((state: any) => state.setModalLoading);

    const sendProduction = async () => {
        let data = {
            id_ov: saleOrdersToUpdate.id,
            id_usuario: user_id,
            fecha_entrega: dataProduction.fecha_produccion,
            hora_entrega: dataProduction.hora_produccion,
        }
        setModalLoading(true)
        try {
            APIs.createSaleOrderProduction(data).then(async (resp: any) => {
                if (resp.error) {
                    Swal.fire('Notificación', resp.mensaje, 'warning')
                } else {
                    Swal.fire('Notificación', resp.mensaje, 'success')
                    setModalProduction('')
                    let d = {
                        id: saleOrdersToUpdate.id
                    }
                    await APIs.CreateAny(d, "get_orden_venta")
                        .then(async (response: any) => {
                            let order = response[0]
                            setSaleOrdersToUpdate(order)
                            setModalLoading(false)
                        })
                }
            }).finally(() => {
                setModalLoading(false)
            })
        } catch (error) {
            setModalLoading(false)

        }
    }


    const handleAreasChange = (event: any, i: number) => {
        const value = parseInt(event.target.value, 10);

        const data = saleOrdersConcepts?.normal_concepts.map((x: any, index: any) => {
            if (index === i) {
                return { ...x, id_area_produccion: value };
            }
            return x;
        });
        setSaleOrdersConcepts({ normal_concepts: data, personalized_concepts: saleOrdersConcepts.personalized_concepts });
    };


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
            total: article.precio_total,
            id_unidad: article.id_unidad,
            obs_produccion: article.obs_produccion,
            obs_factura: article.obs_factura,
            id_pers: article.id_pers,
            id_usuario_actualiza: user_id
        }

        try {
            setModalLoading(true)
            let response: any = await APIs.updateOvConcepto(data).finally(() => { setModalLoading(false) })
            if (response.error) {
                Swal.fire('Advertencia', response.mensaje, 'warning');
            } else {
                Swal.fire('Exito', response.mensaje, 'success');
                let d = {
                    id: saleOrdersToUpdate.id
                }
                await APIs.CreateAny(d, "get_orden_venta")
                    .then(async (response: any) => {
                        let order = response[0]
                        // setSaleOrdersToUpdate(order)
                        setSaleOrdersConcepts({ normal_concepts: order.conceptos, personalized_concepts: order.conceptos_pers });

                        setModalLoading(false)

                    })
            }

            search()
        } catch (error: any) {
            Swal.fire('Error al actualizar el concepto', error, 'success');
        }
    }

    const binnacleModal = () => {

        setSubModal('logbook__sales-order-modal')
    }

    const handleStatusChange = (status: number, index: number) => {
        let data = saleOrdersConcepts?.normal_concepts.map((item: any, i: number) =>
            i === index ? { ...item, enviar_a_produccion: !status } : item
        )
        setSaleOrdersConcepts({ normal_concepts: data, personalized_concepts: saleOrdersConcepts.personalized_concepts });

    };

    const [amount, setAmount] = useState<any>(0)
    const [discount, setdDiscount] = useState<any>(0)
    const [urgency, setdUrgency] = useState<any>(0)
    const [totalGeneral, setdTotalGeneral] = useState<any>(0)


    const [subtotalf, setSubtotalf] = useState<number>(0)
    const [urgenciaf] = useState<number>(0)
    const [totalf, setTotalf] = useState<number>(0)
    const [prevNormalConceptsLength, setPrevNormalConceptsLength] = useState(0);




    useEffect(() => {

        calcular_totales()
        if (modalSalesOrder !== 'sale-order__modal-update') {
            calcular_tiempos_entrega();
        }
    }, [modalSalesOrder, changeLength])




    const calcular_totales = () => {
        // Definir valores iniciales en 0
        const initialValues = {
            precio_unitario: 0,
            descuento: 0,
            monto_urgencia: 0,
            total: 0,
            total_franquicia: 0
        };

        // Validar que saleOrdersConcepts existe y que normal_concepts no sea null/undefined
        const precios = (saleOrdersConcepts?.normal_concepts || []).reduce(
            (acc, item) => ({
                precio_unitario: acc.precio_unitario + (parseFloat(item.precio_unitario) || 0),
                descuento: acc.descuento + (parseFloat(item.descuento) || 0),
                monto_urgencia: acc.monto_urgencia + (parseFloat(item.monto_urgencia) || 0),
                total: acc.total + (parseFloat(item.precio_total) || 0),
                total_franquicia: acc.total_franquicia + (parseFloat(item.total_franquicia) || 0),
            }),
            initialValues
        );

        // Validar que saleOrdersConcepts existe y que personalized_concepts no sea null/undefined
        const preciospers = (saleOrdersConcepts?.personalized_concepts || []).reduce(
            (acc, item) => ({
                precio_unitario: acc.precio_unitario + (parseFloat(item.precio_unitario) || 0),
                descuento: acc.descuento + (parseFloat(item.descuento) || 0),
                monto_urgencia: acc.monto_urgencia + (parseFloat(item.monto_urgencia) || 0),
                total: acc.total + (parseFloat(item.precio_total) || 0),
                total_franquicia: acc.total_franquicia + (parseFloat(item.total_franquicia) || 0),
            }),
            initialValues
        );

        // Asegurar que las variables siempre existen y tienen un valor numérico
        setAmount(
            (preciospers.total || 0) + (preciospers.descuento || 0) - (preciospers.monto_urgencia || 0) +
            (precios.total || 0) + (precios.descuento || 0) - (precios.monto_urgencia || 0)
        );
        setdDiscount((preciospers.descuento || 0) + (precios.descuento || 0));
        setdUrgency((preciospers.monto_urgencia || 0) + (precios.monto_urgencia || 0));
        setdTotalGeneral((preciospers.total || 0) + (precios.total || 0));
        setSubtotalf((preciospers.total_franquicia || 0) + (precios.total_franquicia || 0));
        setTotalf((preciospers.total_franquicia || 0) + (precios.total_franquicia || 0));
    };


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
            if (modalSalesOrder == 'sale-order__modal_bycot') {
                setSaleOrdersConcepts({ normal_concepts: saleOrdersToUpdate.conceptos, personalized_concepts: saleOrdersToUpdate.conceptos_pers });
            }
            setTitle(saleOrdersToUpdate.titulo)
            console.log('saleOrdersToUpdate', saleOrdersToUpdate)
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
            // calcular_tiempos_entrega()
        } else {
            setDates([saleOrdersToUpdate.fecha_entrega_produccion + 'T' + saleOrdersToUpdate.hora_entrega_produccion,
            saleOrdersToUpdate.fecha_entrega_cliente + 'T' + saleOrdersToUpdate.hora_entrega_cliente])
            setTitle(saleOrdersToUpdate.titulo)
            setDataSaleOrder(saleOrdersToUpdate?.conceptos)
            setModifyTe(saleOrdersToUpdate.motivo_modify_te)
            setCompanies({ id: saleOrdersToUpdate.id_empresa })
            setBranchOffices({ id: saleOrdersToUpdate.id_sucursal })
            setSelectedIds('clients', saleOrdersToUpdate.id_cliente)

            const data = {
                id_sucursal: saleOrdersToUpdate.id_sucursal,
                id_usuario: user_id,
                nombre: saleOrdersToUpdate.razon_social
            }
        }
    }, [modalSalesOrder]);

    const hora = hoy.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });


    const calcular_tiempos_entrega = async () => {
        let conceptos_a_enviar: any[] = []

        if (saleOrdersConcepts?.normal_concepts?.length > 0) {
            saleOrdersConcepts.normal_concepts.forEach((n: any) => {
                conceptos_a_enviar.push(n)
            });
        }
        if (saleOrdersConcepts?.personalized_concepts?.length > 0) {
            saleOrdersConcepts.personalized_concepts.forEach((p: any) => {
                if (p.conceptos.length > 0) {
                    p.conceptos.forEach((c: any) => {
                        conceptos_a_enviar.push(c)
                    });
                }
            });
        }


        let data = {
            id_sucursal: saleOrdersToUpdate.id_sucursal || branchOffices.id,
            articulos: conceptos_a_enviar
        }

        await APIs.CreateAny(data, "calcular_tiempo_entrega")
            .then(async (response: any) => {
                console.log('response', response)
                setModifyTe(0)
                if (response.hora_cliente && response.hora_produccion) {
                    setDataProduction(response)
                    setDates([`${response.fecha_produccion}T${response.hora_produccion}`, `${response.fecha_cliente}T${response.hora_cliente}`])
                } else {
                    setDates([`${response.fecha_produccion}T${hora}`, `${response.fecha_cliente}T${hora}`])
                }
            }).catch(() => {

            })
    }
    const setModalSub = storeModals((state) => state.setModalSub);

    const setIndexVM = storeDv(state => state.setIndex)
    const seeVerMas = (index: number) => { //AL ABRIR SEE-CP NO SE VISUALIZA LA INFORMACIÓN DE LAS PLANTILLAS PORQUE SIGUE USANDO NORMALCONCEPTS CORREGIR AQUÍ Y EN LA COTIZACIÓN
        setIndexVM(index)
        setModalSub('see_cp')
    }

    // console.log('normalConcepts', normalConcepts)

    // console.log('customConcepts', customConcepts)


    const handleUrgencyChange = async (index: number) => {
        let data = {
            "id_articulo": saleOrdersConcepts?.normal_concepts[index].id_articulo,
            "id_sucursal": branchOffices.id,
            "total": saleOrdersConcepts?.normal_concepts[index].precio_total
        }
        const newConcept = [...saleOrdersConcepts?.normal_concepts];
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
        setSaleOrdersConcepts({ normal_concepts: newConcept, personalized_concepts: saleOrdersConcepts.personalized_concepts });

    };


    const handleUrgencyChangePers = async (index: number, idx: number) => {
        let data = {
            "id_articulo": personalized[index].conceptos[idx].id_articulo,
            "id_sucursal": branchOffices.id,
            "total": personalized[index].conceptos[idx].precio_total
        }
        const newConcept = [...personalized];
        newConcept[index].conceptos[idx].urgency = !newConcept[index]?.conceptos[idx].urgency;

        if (newConcept[index].conceptos[idx].urgency) {
            await APIs.CreateAny(data, "calcular_urgencia")
                .then(async (response: any) => {
                    if (!response.error) {
                        newConcept[index].conceptos[idx].monto_urgencia = parseFloat(response.monto_urgencia);
                        newConcept[index].conceptos[idx].precio_total = parseFloat(response.total_con_urgencia);
                    } else {
                        Swal.fire('Notificación', response.mensaje, 'warning');
                        return
                    }
                })
        } else {
            newConcept[index].conceptos[idx].precio_total = parseFloat(newConcept[index].conceptos[idx].precio_total) - parseFloat(newConcept[index].conceptos[idx].monto_urgencia);
            newConcept[index].conceptos[idx].monto_urgencia = 0;
        }

        setSaleOrdersConcepts({ normal_concepts: saleOrdersConcepts.normal_concepts, personalized_concepts: newConcept });

    };
    const updateOrdenVenta = async () => {

        const [datePartOne, timePartOne] = dates[0] ? dates[0].split("T") : ["", ""];
        const [datePartTwo, timePartTwo] = dates[1] ? dates[1].split("T") : ["", ""];

        let data = {
            id: saleOrdersToUpdate.id,
            id_usuario_actualiza: user_id,
            id_sucursal: branchOffices.id,
            id_usuario_crea: saleOrdersToUpdate.id_usuario_crea,
            id_cliente: selectedIds.clients.id || saleOrdersToUpdate.id_cliente,
            titulo: title,
            hora_entrega_produccion: timePartOne,
            fecha_entrega_produccion: datePartOne,
            hora_entrega_cliente: timePartTwo,
            fecha_entrega_cliente: datePartTwo,
            // conceptos: normalConcepts

        }
        setModalLoading(true)
        await APIs.CreateAny(data, "update_ov_gral")
            .then(async (response: any) => {
                if (!response.error) {
                    Swal.fire('Notificación', response.mensaje, 'success');
                    let d = {
                        id: saleOrdersToUpdate.id
                    }
                    await APIs.CreateAny(d, "get_orden_venta")
                        .then(async (response: any) => {
                            let order = response[0]
                            setSaleOrdersToUpdate(order)
                            // setCustomConcepts(order.conceptos_pers);
                            // setNormalConcepts(order.conceptos);
                            setModalLoading(false)

                        })
                } else {
                    Swal.fire('Notificación', response.mensaje, 'info');
                    setModalLoading(false)


                }
            }).finally(() => {
                setModalLoading(false)

            })
        search()
        // setSaleOrdersConcepts({ sale_order: {}, normal_concepts: [], personalized_concepts: [], normal_concepts_eliminate: [], concepto: {}, indexConcepto: 0 })

    }
    const [urgenciaG, setUrgenciaG] = useState<boolean>(false)

    const urgenciaGlobal = async (urg: boolean) => {
        setUrgenciaG(urg)
        const normal = normalConcepts.map((x: any, index: number) => ({ ...x, originalIndex: index }))
            .filter((x: any) => x.personalized == false || x.personalized == undefined);
        normal.forEach((n: any) => {
            handleUrgencyChange(n.originalIndex)
        });
        personalized.forEach((pers: any, index: number) => {
            pers.conceptos.forEach((_: any, idx: number) => {
                handleUrgencyChangePers(index, idx)
            });
        });
    }


    const [indexItem, setIndexItem] = useState<any>()
    const [idItem, setIdItem] = useState<any>()


    const updateConceptSaleOrder = (concept: any, index: number) => {
        setIdItem(concept)
        setIndexItem(index)
        setPersonalizedModal('personalized_modal-sale-update')

        if (modalSalesOrder == 'sale-order__modal') {
            setCustomConceptView([...concept.conceptos, ...saleOrdersConcepts.normal_concepts])
        } else {
            setCustomConceptView(concept.conceptos)
            console.log('concept.conceptos', concept.conceptos)
        }
        setChangeLength(!changeLength)
    }

    const modalPersonalized = () => {
        setPersonalizedModal('personalized_modal-sale')
        setCustomConceptView(saleOrdersConcepts.normal_concepts)
    }

    const undoConcepts = (concept: any, i: number) => {
        const deleteItemCustomC = saleOrdersConcepts?.personalized_concepts?.filter((_: any, index: number) => index !== i);
        const updatedConcepts = concept.conceptos.map((element: any) => ({
            ...element,
            id_pers: 0,
            check: false,
        }));
        setSaleOrdersConcepts({ normal_concepts: [...(saleOrdersConcepts?.normal_concepts ?? []), ...updatedConcepts], personalized_concepts: deleteItemCustomC, ...(concept.id && { normal_concepts_eliminate: [...(saleOrdersConcepts?.normal_concepts_eliminate ?? []), concept.id] }) });
        localStorage.setItem('sale-order', JSON.stringify([...(saleOrdersConcepts?.normal_concepts ?? []), ...updatedConcepts]));
        localStorage.setItem('sale-order-pers', JSON.stringify(deleteItemCustomC));
    };


    const deleteArticle = async (item: any, i: number, type) => {
        if (type == 'modal-sale') {
            if (modalSalesOrder == 'sale-order__modal') {
                const filter = saleOrdersConcepts?.normal_concepts.filter((_: any, index: number) => index !== i)
                setSaleOrdersConcepts({ normal_concepts: filter, ...(item.id && { normal_concepts_eliminate: [...(saleOrdersConcepts?.normal_concepts_eliminate ?? []), item.id] }) });
                localStorage.setItem('sale-order', JSON.stringify(filter));
                toast.success('Concepto eliminado')

            } else {

            }
        } else {
            const filter = saleOrdersConcepts.normal_concepts.filter((_: any, index: number) => index !== i)
            setSaleOrdersConcepts({ normal_concepts: filter });
            localStorage.setItem('sale-order', JSON.stringify(filter));
            setChangeLength(!changeLength)
        }



    }


    const search = async () => {
        const dataSaleOrders = {
            folio: 0,
            id_sucursal: branchOffices.id,
            id_serie: 0,
            id_cliente: dataGet,
            desde: dataGet.desde,
            hasta: dataGet.hasta,
            id_usuario: dataGet.id_usuario,
            id_vendedor: 0,
            status: 0,
            page: 1
        }
        const resultData = await getSaleOrders(dataSaleOrders)

        setSaleOrders(resultData)
        // setModalSalesOrder('')
    }



    const closeModal = () => {
        setModalSalesOrder('')
        const sale_order = JSON.parse(localStorage.getItem("sale-order") || "[]");
        const sale_order_pers = JSON.parse(localStorage.getItem("sale-order-pers") || "[]");
        if (sale_order.length > 0 || sale_order_pers.length > 0) {
            setSaleOrdersConcepts({ normal_concepts: sale_order, personalized_concepts: sale_order_pers });
        }
        // setSaleOrdersConcepts({ sale_order: {}, normal_concepts: [], personalized_concepts: [], normal_concepts_eliminate: [], concepto: {}, indexConcepto: 0 })
        // setCustomConceptView([])
    }


    const canceleStatus = async (item: any) => {
        console.log(item)
        let data = {
            id: item.id,
            id_usuario: user_id
        }
        const dataSaleOrders = {
            id: saleOrdersToUpdate.id,
            folio: 0,
            id_sucursal: 0,
            id_serie: 0,
            id_cliente: 0,
            desde: haceUnaSemana.toISOString().split('T')[0],
            hasta: hoy.toISOString().split('T')[0],
            id_usuario: user_id,
            id_vendedor: selectedIds?.users?.id,
            status: 0,
            page: 1,
        }

        try {
            let response: any = await APIs.cancelConceptsOrder(data)
            const result = await getSaleOrders(dataSaleOrders)
            // setNormalConcepts(result[0].conceptos);
            setSaleOrdersConcepts({ normal_concepts: result[0].conceptos, personalized_concepts: result[0].conceptos_pers });

            Swal.fire('Exito', response.mensaje, 'success');
        } catch (error) {
            console.log(error)
        }
    }

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = parseFloat(e.target.value); // Convertir el valor de entrada a número
        let data = saleOrdersConcepts?.normal_concepts.map((item: any, i: number) =>
            i === index ? { ...item, precio_unitario: value / item.cantidad, precio_total: value } : item
        )
        setSaleOrdersConcepts({ normal_concepts: data, personalized_concepts: saleOrdersConcepts.personalized_concepts });
    };
    const setProductionToUpdate = storeProduction(state => state.setProductionToUpdate)

    const verProduccion = async (id: number) => {
        const dataProductionOrders = {
            id: id,
            folio: 0,
            id_sucursal: 0,
            id_serie: 0,
            id_area: 0,
            // id_cliente: client,
            desde: dates[0].toString().split('T')[0], // Solo la fecha
            hasta: dates[1].toString().split('T')[0],
            id_usuario: user_id,
            status: 0,
        }
        setModalLoading(true)
        try {
            APIs.getProoductionOrders(dataProductionOrders).then((resp: any) => {
                setModalLoading(false)
                setProductionToUpdate(resp[0])
                setModalSub('production__modal')
            }).finally(() => {
                setModalLoading(false)
            })

        } catch (error) {
            console.log(error)
        }
    }
    const permisosxVistaheader = storeDv((state) => state.permisosxvistaheader);
    const checkPermissionHeader = (elemento: string) => {
        return permisosxVistaheader.some((x: any) => x.titulo == elemento)
    }
    return (
        <div className={`overlay__sale-order__modal_articles ${modalSalesOrder == 'sale-order__modal' || modalSalesOrder == 'sale-order__modal-update' || modalSalesOrder == 'sale-order__modal_bycot' ? 'active' : ''}`}>
            <div className={`popup__sale-order__modal_articles ${modalSalesOrder == 'sale-order__modal' || modalSalesOrder == 'sale-order__modal-update' || modalSalesOrder == 'sale-order__modal_bycot' ? 'active' : ''}`}>
                <div className='header__modal'>
                    <a href="#" className="btn-cerrar-popup__sale-order__modal_articles" onClick={closeModal} >
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
                                    <div className="alertSaleOrder" role="alert">
                                        Verificar tiempos de entrega o consultar con producción antes de enviar
                                    </div>
                                    <div className='listSaleOrder__container'>
                                        <section className="listSaleOrder">

                                            <div className="itemDividerSaleOrder">Fecha Entrega Producción</div>
                                            <div className="itemSaleOrder">
                                                <span className="dateSaleOrder">{dataProduction?.fecha_produccion}</span>
                                                <span className="timeSaleOrder">{dataProduction?.hora_produccion}</span>
                                            </div>
                                        </section>

                                        <section className="listSaleOrder">
                                            <div className="itemDividerSaleOrder">Fecha Entrega Cliente</div>
                                            <div className="itemSaleOrder">
                                                <span className="dateSaleOrder">{dataProduction?.fecha_cliente}</span>
                                                <span className="timeSaleOrder">{dataProduction?.hora_cliente}</span>
                                            </div>
                                        </section>
                                    </div>
                                    <div className='table'>
                                        <div className='table__sales_modal-send-productions'>
                                            {conceptsProductios ? (
                                                <div className='table__numbers'>
                                                    <p className='text'>Total de ordenes</p>
                                                    <div className='quantities_tables'>{conceptsProductios.length}</div>
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
                                                        <p>Area</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {conceptsProductios ? (
                                                <div className='table__body'>
                                                    {conceptsProductios?.map((article: any) => {
                                                        return (
                                                            <div className='tbody__container' key={article.id}>
                                                                <div className='tbody'>
                                                                    <div className='td'>
                                                                        <p className='folio-identifier'>{article.codigo}-{article.descripcion}</p>
                                                                    </div>
                                                                    <div className='td'>
                                                                        <p className='amount-identifier'>{article.cantidad}</p>
                                                                    </div>
                                                                    <div className='td'>
                                                                        <p>{article.name_unidad || article.unidad}</p>
                                                                    </div>
                                                                    <div className='td'>
                                                                        <div className='send-areas'>

                                                                            <select className="traditional__selector" disabled value={article.id_area_produccion}>
                                                                                {article?.areas_produccion?.map((item: any) => (
                                                                                    <option key={item.id} value={item.id_area}>
                                                                                        {item.nombre_area}-{item.nombre_sucursal}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    {article.status == 1 ?
                                                                        <div className="td">
                                                                            <p className='cancel-identifier'>Cancelado</p>
                                                                        </div>
                                                                        :
                                                                        ""
                                                                    }

                                                                    {article.status == 2 ?
                                                                        <div className="td">
                                                                            <p>Cancelar</p>
                                                                        </div>
                                                                        :
                                                                        ""
                                                                    }

                                                                </div>

                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            ) : (
                                                <p className="text">Cargando datos...</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className='mt-3 d-flex justify-content-center'>
                                        <button className='btn__general-purple' onClick={sendProduction} >Mandar a producción </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body bg-standar">
                            <div className='d-flex align-items-center justify-content-between'>
                                <h3 className="text" title={saleOrdersToUpdate?.id}>{saleOrdersToUpdate.serie}-{saleOrdersToUpdate.folio}-{saleOrdersToUpdate.anio}</h3>
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
                                <div className='col-5 md-col-12'>
                                    <span className='text'>Creado por: <b>{saleOrdersToUpdate.usuario_crea}</b></span><br />
                                    <span className='text'>Fecha de Creación: <b>{saleOrdersToUpdate.fecha_creacion}</b></span><br />
                                    <div className='d-flex'>
                                        {saleOrdersToUpdate.status === 0 ? (
                                            <b className="active-identifier" >Activo</b>
                                        ) : saleOrdersToUpdate.status === 1 ? (
                                            <b className="cancel-identifier">Cancelada</b>
                                        ) : (
                                            saleOrdersToUpdate.status === 2 ? (
                                                <b className="peding-identifier">Pendiente</b>
                                            ) : (
                                                ""
                                            )
                                        )}
                                    </div>
                                </div>
                                <div className='col-4 md-col-12'>
                                    <b>FACTURAS RELACIONADAS:</b>
                                    {saleOrdersToUpdate ? (
                                        <div className='table__body'>
                                            {saleOrdersToUpdate.facturas.map((facts: any) => {
                                                return (
                                                    <div className='tbody__container'>
                                                        <div className='tbody'>
                                                            <div className='td'>
                                                                <p className='folio'>{facts.folio_completo}  || ${facts.total_facturado}</p>
                                                            </div>

                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ) : ''}
                                </div>
                                <div className='col-3 md-col-12'>
                                    <b>ORDENES DE PRODUCCIÓN:</b>
                                    {saleOrdersToUpdate ? (
                                        <div className='table__body'>
                                            {saleOrdersToUpdate.ordenes_produccion.map((facts: any) => {
                                                return (
                                                    <div className='tbody__container' style={{
                                                        borderRadius: '10px', background: 'repeating-linear-gradient(344deg, #2087b1, #e5e5e500 100px)',
                                                        cursor: 'pointer'
                                                    }} onClick={() => verProduccion(facts.id)}>
                                                        <div className='tbody'>
                                                            <div className='td'>
                                                                <p className='folio'>{facts.folio_completo}</p>
                                                            </div>

                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ) : ''}
                                </div>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div className='d-flex'>
                                    {saleOrdersToUpdate.status === 0 ?
                                        <>
                                            <div className='mr-4'>
                                                <button className='btn__general-orange' onClick={getTicket}>Imprimir ticket</button>
                                            </div>
                                            <div className='mr-4'>
                                                <button className='btn__general-purple' onClick={SaleOrderProduction}>Mandar a producción</button>
                                            </div>
                                        </>
                                        : ''}
                                    <div>
                                        <button className='btn__general-orange' onClick={binnacleModal}>Bitácora</button>
                                    </div>
                                </div>
                                {saleOrdersToUpdate.status === 0 ?
                                    <div>
                                        <button className='btn__general-danger' onClick={SaleOrderStatus}>Cancelar</button>
                                    </div>
                                    : ''}
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
                                    {modalSalesOrder !== 'sale-order__modal-update' ?
                                        <Empresas_Sucursales modeUpdate={modeUpdate} empresaDyn={companies} setEmpresaDyn={setCompanies} sucursalDyn={branchOffices} setSucursalDyn={setBranchOffices} />
                                        :
                                        <Empresas_Sucursales modeUpdate={modeUpdate} empresaDyn={companies} setEmpresaDyn={setCompanies} sucursalDyn={branchOffices} setSucursalDyn={setBranchOffices} />
                                    }
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-3'>
                                    <label className='label__general'>Buscar</label>
                                    <input className='inputs__general' type="text" value={searCustomer} onChange={(e) => setSearchCustomer(e.target.value)} placeholder='Ingresa el contacto' />
                                </div>
                                <div className='col-1 d-flex align-items-end'>
                                    <div>
                                        <button type='button' className='btn__general-purple' onClick={searchClients}>Buscar</button>
                                    </div>
                                </div>
                                <div className='col-4'>
                                    <Select dataSelects={clients} instanceId='clients' nameSelect={'Cliente Seleccionado'} />
                                </div>
                                <div className='col-4'>
                                    <label className='label__general'>Titulo</label>
                                    <input className='inputs__general' type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Ingresa el titulo' />
                                </div>
                            </div>

                            <div className="my-4 row">
                                {modify_te !== 0 && (
                                    <div className="col-12">
                                        <b style={{ color: "red" }} title="Esta leyenda aparece cuando las fechas son ingresadas de forma manual">
                                            Esta orden tiene Fechas de Entrega Modificadas
                                        </b>
                                    </div>
                                )}

                                <div className="col-6 sale-order__input_container d-flex align-items-center">
                                    <p className="label__general">Fecha de entrega a producción</p>
                                    <div className="container_dates__requisition">
                                        <input
                                            type="datetime-local"
                                            value={dates[0]}
                                            className="date"
                                            onChange={(event) => handleDateChange(event, 0)}
                                            placeholder="Selecciona la fecha de inicio"
                                        />
                                    </div>
                                </div>

                                {/* Fecha de entrega cliente */}
                                <div className="col-6 sale-order__input_container d-flex align-items-center">
                                    <p className="label__general">Fecha de entrega cliente</p>
                                    <div className="container_dates__requisition">
                                        <input
                                            type="datetime-local"
                                            value={dates[1]}
                                            className="date"
                                            onChange={(event) => handleDateChange(event, 1)}
                                            placeholder="Selecciona la fecha de fin"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {modalSalesOrder == 'sale-order__modal' ?
                            <div className='my-4 row'>
                                <div className='col-12 d-flex align-items-center justify-content-between'>
                                    <p className='title__concepts'>Conceptos</p>
                                    <div className='d-flex align-items-center'>
                                        <div className='mx-4'>
                                            {urgenciaG ?
                                                <button type='button' className='mr-4 btn__general-success' onClick={() => urgenciaGlobal(false)}>Remover Urgencias</button>
                                                :
                                                <button type='button' className='mr-4 btn__general-orange' onClick={() => urgenciaGlobal(true)}>Agregar Urgencia a Orden</button>
                                            }
                                            <button type='button' className='btn__general-purple' onClick={modalPersonalized}>Personalizados</button>
                                        </div>
                                        <div className='btn__search__articles'>
                                            <svg xmlns="http://www.w3.org/2000/svg" onClick={() => openModalArticle()} width="30" height="30" viewBox="0 0 24 24" fill="none" stroke-width="1.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package-search"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" /><path d="m7.5 4.27 9 5.15" /><polyline points="3.29 7 12 12 20.71 7" /><line x1="12" x2="12" y1="22" y2="12" /><circle cx="18.5" cy="15.5" r="2.5" /><path d="M20.27 17.27 22 19" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            ''
                        }
                        <div className='table__sales_modal'>
                            <div className='table__numbers'>
                                <p className='text'>Total de ordenes</p>
                                <div className='quantities_tables'>{conceptView.length}</div>
                            </div>
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
                            {saleOrdersConcepts?.normal_concepts ? (
                                <div className='table__body'>
                                    {saleOrdersConcepts?.normal_concepts?.map((article: any, index: number) => {
                                        return (
                                            <div className='tbody__container' key={article.id}>


                                                <div className='tbody'>
                                                    <div className='td'>
                                                        <p className='folio-identifier'>{article.codigo}-{article.descripcion}</p>
                                                    </div>
                                                    <div className='td'>
                                                        <p className='amount-identifier'>{article.cantidad}</p>
                                                    </div>
                                                    <div className='td'>
                                                        <p>{article.name_unidad || article.unidad}</p>
                                                    </div>
                                                    <div className='td'>
                                                        <p className=''>$ {article.precio_unitario} <br />
                                                            {article.total_franquicia != null && !Number.isNaN(article.total_franquicia) &&permisosxVistaheader.length > 0 && checkPermissionHeader('totales_franquicia')?
                                                                <small >PUF: ${Number(article.total_franquicia / article.cantidad).toFixed(2)}</small> : ''}
                                                        </p>
                                                    </div>
                                                    <div className='td'>
                                                        {article.urgency ?
                                                            <div className='d-flex'>
                                                                <div>
                                                                    {checkPermission('cambiar_totales') ? <input type="text" className='inputs__general' placeholder='Precio total' value={article.precio_total} onChange={(e) => handlePriceChange(e, index)} /> : <p className='total-identifier'>$ {parseFloat(article.precio_total).toFixed(2)}</p>}
                                                                    <p className='total-identifier'>
                                                                        {article.total_franquicia != null && !Number.isNaN(article.total_franquicia) && permisosxVistaheader.length > 0 && checkPermissionHeader('totales_franquicia') ?
                                                                            <small>PF: ${parseFloat(article.total_franquicia).toFixed(2)}</small>
                                                                            :
                                                                            ''
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            :
                                                            <div>
                                                                {checkPermission('cambiar_totales') ? <input type="text" className='inputs__general' placeholder='Precio total' value={article.precio_total} onChange={(e) => handlePriceChange(e, index)} /> : <p className='total-identifier'>$ {parseFloat(article.precio_total).toFixed(2)}</p>}
                                                                <p className='mt-2 total-identifier'>{article.total_franquicia != null && !Number.isNaN(article.total_franquicia) && permisosxVistaheader.length > 0 && checkPermissionHeader('totales_franquicia') ?
                                                                    <small>PF: ${parseFloat(article.total_franquicia).toFixed(2)}</small> : ''}</p>
                                                            </div>
                                                        }
                                                        {article.descuento > 0 ?
                                                            <p style={{ color: 'green' }}>(-${parseFloat(article.descuento).toFixed(2)})</p>
                                                            : ''}
                                                    </div>
                                                    {article.status == 0 ?
                                                        <div className='td'>
                                                            {article.id ?
                                                                <div >
                                                                    {saleOrdersToUpdate.status != 1 ?
                                                                        <div>
                                                                            {checkPermission('cambiar_totales') ?
                                                                                <div className='cancel-icon' onClick={() => canceleStatus(article)} title='Cancelar concepto'>
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ban"><circle cx="12" cy="12" r="10" /><path d="m4.9 4.9 14.2 14.2" /></svg>
                                                                                </div>
                                                                                :
                                                                                ''
                                                                            }
                                                                        </div>
                                                                        :
                                                                        ''}
                                                                </div>
                                                                :
                                                                <div className='td'>

                                                                </div>
                                                            }
                                                        </div>
                                                        :
                                                        <div className='td'>

                                                        </div>
                                                    }

                                                    <div className='td urgency'>
                                                        {article?.urgency ?
                                                            <div>
                                                                <div className='urgency-false-icon' title='Quitar urgencia' onClick={() => handleUrgencyChange(index)}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-timer-off"><path d="M10 2h4" /><path d="M4.6 11a8 8 0 0 0 1.7 8.7 8 8 0 0 0 8.7 1.7" /><path d="M7.4 7.4a8 8 0 0 1 10.3 1 8 8 0 0 1 .9 10.2" /><path d="m2 2 20 20" /><path d="M12 12v-2" /></svg>
                                                                </div>
                                                            </div>
                                                            :
                                                            <div>
                                                                <div className='urgency-true-icon' title='Agregar urgencia' onClick={() => handleUrgencyChange(index)}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-timer"><line x1="10" x2="14" y1="2" y2="2" /><line x1="12" x2="15" y1="14" y2="11" /><circle cx="12" cy="14" r="8" /></svg>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                    <div className='td'>
                                                        <div className='see-icon' onClick={() => seeVerMas(index)} title='Ver mas campos'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                                                        </div>
                                                    </div>
                                                    {modalSalesOrder == 'sale-order__modal' ?
                                                        <div className='td'>
                                                            <div className='delete-icon' onClick={() => deleteArticle(article, index, 'modal-sale')} title='Eliminar concepto'>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                            </div>
                                                        </div>
                                                        :
                                                        <div>

                                                        </div>
                                                    }

                                                    <div className='td'>
                                                        <div className='send-areas'>
                                                            <div>
                                                                <label>Area</label>
                                                            </div>
                                                            <select className="traditional__selector" value={article.id_area_produccion} onChange={(event) => handleAreasChange(event, index)}>
                                                                {article?.areas_produccion?.map((item: any) => (
                                                                    <option key={item.id} value={item.id_area}>
                                                                        {item.nombre_area}-{item.nombre_sucursal}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className='td'>
                                                        <div>
                                                            <div className=''>
                                                                <label>Enviar producción</label>
                                                            </div>
                                                            <label className="switch">
                                                                <input
                                                                    type="checkbox"

                                                                    checked={article.enviar_a_produccion}
                                                                    onChange={() => handleStatusChange(article.enviar_a_produccion, index)} disabled={article.status == !0} />
                                                                <span className="slider"></span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    {article.status == 0 ?
                                                        <div>
                                                            {modalSalesOrder == 'sale-order__modal-update' && saleOrdersToUpdate.status != 1 ?
                                                                <div className='td'>
                                                                    <button type='button' className='btn__general-purple' onClick={() => updateSaleOrderConcept(article)}>Actualizar</button>
                                                                </div>
                                                                :
                                                                ""
                                                            }
                                                        </div>
                                                        :
                                                        ''
                                                    }
                                                    {article.status == 1 ?
                                                        <div className="td">
                                                            <p className='cancel-identifier'>Cancelado</p>
                                                        </div>
                                                        :
                                                        ""
                                                    }

                                                    {article.status == 2 ?
                                                        <div className="td">
                                                            <p>Cancelar</p>
                                                        </div>
                                                        :
                                                        ""
                                                    }

                                                </div>

                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                ''
                            )}
                            {saleOrdersConcepts?.personalized_concepts ? (
                                <div className='table__body'>
                                    {saleOrdersConcepts?.personalized_concepts?.map((article: any, index: number) => {
                                        return (
                                            <div className='tbody__container' key={article.id}>
                                                {article?.personalized ?
                                                    <div className='concept__personalized'>
                                                        <p>Concepto Personalizado</p>
                                                    </div>
                                                    :
                                                    ''
                                                }
                                                <div className='tbody personalized'>
                                                    <div className='td'>
                                                        <p className='folio-identifier'>{article.codigo}-{article.descripcion}</p>
                                                    </div>
                                                    <div className='td'>
                                                        <p className='amount-identifier'>{article.cantidad}</p>
                                                    </div>
                                                    <div className='td'>
                                                        <p>{article.name_unidad || article.unidad}</p>
                                                    </div>
                                                    <div className='td'>
                                                        <p className=''>$ {Number(article.precio_total / article.cantidad).toFixed(2)} <br />
                                                            {permisosxVistaheader.length > 0 && checkPermissionHeader('totales_franquicia') ?
                                                                <small style={{ color: 'red' }}>PUF:${Number(article.total_franquicia / article.cantidad).toFixed(2)}</small>
                                                                : ''}
                                                        </p>
                                                    </div>
                                                    <div className='td'>
                                                        <div className=''>
                                                            <p className='total-identifier'>$ {parseFloat(article.precio_total).toFixed(2)}</p>
                                                            <p className='total-identifier'>{article.total_franquicia != null && !Number.isNaN(article.total_franquicia) &&permisosxVistaheader.length > 0 && checkPermissionHeader('totales_franquicia')?
                                                                <small style={{ color: 'red' }}>PF:${parseFloat(article.total_franquicia).toFixed(2)}</small> : ''}</p>
                                                        </div>
                                                    </div>
                                                    <div className='td urgency'>
                                                        {article?.urgency ?
                                                            <div>
                                                                <div className='urgency-false-icon' title='Quitar urgencia' onClick={() => handleUrgencyChange(index)}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-timer-off"><path d="M10 2h4" /><path d="M4.6 11a8 8 0 0 0 1.7 8.7 8 8 0 0 0 8.7 1.7" /><path d="M7.4 7.4a8 8 0 0 1 10.3 1 8 8 0 0 1 .9 10.2" /><path d="m2 2 20 20" /><path d="M12 12v-2" /></svg>
                                                                </div>
                                                            </div>
                                                            :
                                                            <div>
                                                                <div className='urgency-true-icon' title='Agregar urgencia' onClick={() => handleUrgencyChange(index)}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-timer"><line x1="10" x2="14" y1="2" y2="2" /><line x1="12" x2="15" y1="14" y2="11" /><circle cx="12" cy="14" r="8" /></svg>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                    <div className='td'>
                                                        {article?.personalized ?
                                                            <div onClick={() => updateConceptSaleOrder(article, index)} className='conept-icon'>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" strokeLinejoin="round" className="lucide lucide-boxes"><path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z" /><path d="m7 16.5-4.74-2.85" /><path d="m7 16.5 5-3" /><path d="M7 16.5v5.17" /><path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z" /><path d="m17 16.5-5-3" /><path d="m17 16.5 4.74-2.85" /><path d="M17 16.5v5.17" /><path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z" /><path d="M12 8 7.26 5.15" /><path d="m12 8 4.74-2.85" /><path d="M12 13.5V8" /></svg>
                                                            </div>
                                                            :
                                                            ""
                                                        }
                                                    </div>
                                                    <div className='td'>
                                                        <div className='see-icon' onClick={() => seeVerMas(index)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                                                        </div>
                                                    </div>

                                                    {article.id ?
                                                        ""
                                                        :
                                                        <div className='td'>
                                                            <div className='undo-icon' onClick={() => undoConcepts(article, index)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-undo-2"><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" /></svg>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>

                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                    <div className='mt-4 row__two'>
                        <div className='btns'>
                            <div className='subtotal'>
                                <div>
                                    <p className='name'>Subtotal</p>
                                    <p className='value'>$ {amount}</p>
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
                                    <p className='value'>$ {urgency}</p>
                                </div>
                            </div>
                            <div className='total'>
                                <div>
                                    <p className='name'>Total</p>
                                    <p className='value'>$ {totalGeneral}</p>
                                </div>
                            </div>
                        </div>
                        {permisosxVistaheader.length > 0 && checkPermissionHeader('totales_franquicia') ? 
                        <div className='mt-1 btns'>
                            <div className='subtotal'>
                                <div>
                                    <p className='name'>Subtotal Franquicia</p>
                                    <p className='value'>$ {subtotalf}</p>
                                </div>
                            </div>

                            <div className='urgency'>
                                <div>
                                    <p className='name'>Urgencia Franquicia</p>
                                    <p className='value'>$ {urgenciaf}</p>
                                </div>
                            </div>
                            <div className='total'>
                                <div>
                                    <p className='name'>Total Franquicia</p>
                                    <p className='value'>$ {totalf}</p>
                                </div>
                            </div>
                        </div>
                        : ''}
                    </div>

                    {modalSalesOrder !== '' ?
                        <div className='mt-3 d-flex justify-content-center'>
                            <div>

                                {modalSalesOrder !== 'sale-order__modal-update' ?
                                    <button className='btn__general-purple' onClick={(e) => handleCreateSaleOrder(e)}>
                                        Crear Orden de Venta
                                    </button>
                                    : saleOrdersToUpdate.status == 0 ?
                                        <button className='btn__general-purple' onClick={updateOrdenVenta}>
                                            Actualizar Orden de Venta
                                        </button>
                                        : ''}
                            </div>
                        </div>
                        :
                        ''
                    }
                </div>
                <ArticleViewModal />
                <Personalized idItem={idItem} indexItem={indexItem} />
                <SeeCamposPlantillas />
                <Binnacle />
                <ModalProduction />

            </div>
        </div>

    )
}

export default ModalSalesOrder
