import React, { useEffect, useRef, useState } from 'react'
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
import { storeQuotation } from '../../../../../zustand/Quotation'
import { Link } from 'react-router-dom'
import { PrivateRoutes } from '../../../../../models/routes'

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
    const { normalConcepts, customConcepts, conceptView, personalized, deleteCustomConcepts, normalConceptsView, ov_repo }: any = useStore(storePersonalized)
    const setov_repo = storePersonalized((state) => state.setov_repo);

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

    useEffect(() => {
        if (selectedIds.clients) {
            let result = selectedIds.clients
            if (typeof result === 'number') {
                setClienteOff(false)

            } else {
                let off = !result.status ? true : false
                setClienteOff(off)

            }

        }
    }, [selectedIds])
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
            setCompanies({ id: saleOrdersToUpdate.id_empresa })
            setVendedorSelected(saleOrdersToUpdate.id_usuario_crea)
            setBranchOffices({ id: saleOrdersToUpdate.id_sucursal })
            setClients({
                selectName: 'Cliente',
                options: 'razon_social',
                dataSelect: [{ id: saleOrdersToUpdate.id_cliente, razon_social: saleOrdersToUpdate.razon_social, status: true }]
            })

            setClienteOff(false)
            setDataSaleOrder(saleOrdersToUpdate?.conceptos)
            setNormalConcepts(saleOrdersToUpdate?.conceptos)
            debugger
            setDates([`${saleOrdersToUpdate.fecha_entrega_produccion}T${saleOrdersToUpdate.hora_entrega_produccion}`, `${saleOrdersToUpdate.fecha_entrega_cliente}T${saleOrdersToUpdate.hora_entrega_cliente}`]);
            setDataProduction({
                "fecha_produccion": saleOrdersToUpdate.fecha_entrega_produccion,
                "hora_produccion": saleOrdersToUpdate.hora_entrega_produccion,
                "fecha_cliente": saleOrdersToUpdate.fecha_entrega_cliente,
                "hora_cliente": saleOrdersToUpdate.hora_entrega_cliente,
                "sin_tiempos": false
            })

        }

    }, [saleOrdersToUpdate])




    const handleCreateSaleOrder = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        let [datePartOne, timePartOne] = dates[0] ? dates[0].split("T") : ["", ""];
        let [datePartTwo, timePartTwo] = dates[1] ? dates[1].split("T") : ["", ""];

        let enviar_prod = false
        saleOrdersConcepts.normal_concepts.forEach((e: any) => {
            enviar_prod = e.enviar_a_produccion ? true : false
        });

        if (saleOrdersConcepts?.personalized_concepts?.length > 0) {
            saleOrdersConcepts?.personalized_concepts?.forEach((e: any) => {
                e.conceptos.forEach((x: any) => {
                    enviar_prod = x.enviar_a_produccion ? true : false
                });

            });
        }
        if (enviar_prod) {
            if (datePartOne == '' || timePartOne == '') {
                Swal.fire('Notificacion', 'Ingresa tiempos de entrega de produccion', 'warning')
                return
            }
            if (datePartTwo == '' || timePartTwo == '') {
                Swal.fire('Notificacion', 'Ingresa tiempos de entrega de cliente', 'warning')
                return
            }
        } else {
            const now = new Date();
            const date = now.toISOString().split("T")[0];
            const time = now.toTimeString().split(" ")[0];
            datePartOne = date;
            timePartOne = time;
            datePartTwo = date;
            timePartTwo = time;
        }
        if (dataProduction?.sin_tiempos && enviar_prod) {
            if (datePartOne == '' || timePartOne == '') {
                Swal.fire('Notificacion', 'Ingresa tiempos de entrega de produccion', 'warning')
                return
            }
            if (datePartTwo == '' || timePartTwo == '') {
                Swal.fire('Notificacion', 'Ingresa tiempos de entrega de cliente', 'warning')
                return
            }
            const result = await Swal.fire({
                title: "Estás por crear una orden de venta con tiempos excedidos.",
                text: "Es necesario consultar con producción esta acción. De no ser consultados, los tiempos de la orden pueden ser extendidos a lo que producción considere.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: "Aceptar",
                cancelButtonText: "Cancelar",
            });
            let [datePartOne2, timePartOne2] = dates[0] ? dates[0].split("T") : ["", ""];
            let [datePartTwo2, timePartTwo2] = dates[1] ? dates[1].split("T") : ["", ""];
            console.log(datePartOne2);
            console.log(datePartTwo2);

            if (!result.isConfirmed) {
                return; // Usuario canceló, salimos de la función
            }
        }


        saleOrdersConcepts.normal_concepts.forEach((element: any) => {
            if (element.id_area_produccion == 0) {
                element.id_area_produccion = element.areas_produccion[0].id_area || 39
            }
            element.unidad = element.id_unidad
            element.total = element.precio_total
            element.monto_descuento = element.descuento == null ? 0 : element.descuento
            element.monto_urgencia = element.monto_urgencia
            element.campos_plantilla.forEach((cp: any) => {
                cp.valor = cp.valor.toString()
            });
        });

        if (saleOrdersConcepts?.personalized_concepts?.length > 0) {
            saleOrdersConcepts?.personalized_concepts?.forEach((element: any) => {
                element.id = 0
                element.conceptos.forEach((x: any) => {
                    if (x.id_area_produccion == 0) {
                        x.id_area_produccion = x.areas_produccion[0].id_area || 39
                    }
                    x.unidad = x.id_unidad
                    x.total = x.precio_total
                    x.monto_urgencia = x.monto_urgencia
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
            id_ov_repo: ov_repo == null ? 0 : ov_repo?.id,
            id_cotizacion_relacionada: idCotizacion,
            hora_entrega_produccion: timePartOne,
            fecha_entrega_produccion: datePartOne,
            hora_entrega_cliente: timePartTwo,
            fecha_entrega_cliente: datePartTwo,
            conceptos: saleOrdersConcepts.normal_concepts,
            conceptos_pers: saleOrdersConcepts.personalized_concepts,
            conceptos_elim: []
        }

        // debugger
        // return
        if (title === '') {
            return Swal.fire('Advertencia', 'El campo Titulo es obligatorio', 'warning');
        }
        if (data.id_cliente == null) {
            return Swal.fire('Advertencia', 'Selecciona un cliente', 'warning');
        }
        if (clienteOff) {
            return Swal.fire('Advertencia', 'No se puede vender a este cliente porque se encuentra deshabilitado', 'warning');
        }
        try {
            setModalLoading(true)
            const result: any = await APIs.CreateAny(data, 'create_ov_remastered'); //CAMBIAR POR CREATE_OV_REMASTERED
            if (result.error == true) {
                setModalLoading(false)

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
                // setSaleOrdersConcepts({ normal_concepts: [], personalized_concepts: [] });
                setUrgenciaG(false)
                setov_repo(null)
                setAmount(0)
                setIdCotizacion(0)
                setModifyTe(0)
                setTitle('')

                const dataSaleOrders = {
                    id: result.id,
                    folio: 0,
                    id_sucursal: branchOffices.id,
                    id_serie: 0,
                    id_cliente: dataGet,
                    desde: dataGet.desde == null ? new Date().toISOString().split('T')[0] : dataGet.desde,
                    hasta: dataGet.hasta == null ? new Date().toISOString().split('T')[0] : dataGet.hasta,
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
                setModalLoading(false)

            }
        } catch (error) {
            setModalLoading(false)
            console.error("Error al crear la orden de compra:", error);
            Swal.fire('Hubo un error al crear la orden de venta', '', 'error');
        }
    }

    const setSelectData = useSelectStore(state => state.setSelectedId)
    const [clienteOff, setClienteOff] = useState<boolean>(false)


    const searchClients = async () => {
        const data = {
            id_sucursal: branchOffices.id,
            id_usuario: user_id,
            nombre: searCustomer,
            activos: true

        }
        const result = await getClients(data)
        setClients({
            selectName: 'Cliente',
            options: 'razon_social',
            dataSelect: result
        })
        setSelectData('clients', result[0])

        let off = !result[0].status ? true : false
        setClienteOff(off)
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
        let data_c = [];

        // Recorre cada elemento de `personalized_concepts`
        saleOrdersConcepts.personalized_concepts.forEach(element => {
            let concepts = element.conceptos.filter((x: any) => x.enviar_a_produccion === true);
            // Agrega los conceptos filtrados a `data` sin sobrescribirla
            data_c.push(...concepts);
        });

        let normal_concepts = saleOrdersConcepts.normal_concepts.filter(element => element.enviar_a_produccion === true);
        // Agrega los conceptos filtrados a `data` sin sobrescribirla
        data_c.push(...normal_concepts);
        setConceptsProductions([...data_c]);


        setModalProduction('sale-order-production__modal')
        if (!modify_te) {
            let data = {
                articulos: data_c,
                id_sucursal: saleOrdersToUpdate.id_sucursal
            }
            setModalLoading(true)
            let response: any = await APIs.calculateSalesDeliveryDime(data).finally(() => {
                setModalLoading(false)
            })
            setModalLoading(false)
            if (response.hora_cliente && response.hora_produccion) {
                setDataProduction(response)
                setDates([`${response.fecha_produccion}T${response.hora_produccion}`, `${response.fecha_cliente}T${response.hora_cliente}`])
                setModifyTe(0)
            } else {
                setDates([`${response.fecha_produccion}T${hora}`, `${response.fecha_cliente}T${hora}`])
            }

        }
    }
    const SaleOrderActivate = async () => {


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
        Swal.fire({
            title: "Esta acción activará la orden de venta?",
            text: "Esta acción no reaparta ni aparta automaticamente, solo cambia el status de la OV para su seguimiento, desea continuar?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            denyButtonText: `Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setModalLoading(true)
                    let response: any = await APIs.CreateAnyPut({}, 'activar_orden_venta/' + saleOrdersToUpdate.id + '/' + user_id)
                    const result = await getSaleOrders(dataSaleOrders)
                    setModalLoading(false)
                    // setNormalConcepts(result[0].conceptos);
                    setSaleOrdersConcepts({ sale_order: result[0], normal_concepts: result[0].conceptos, personalized_concepts: result[0].conceptos_pers });

                    setSaleOrdersToUpdate(result[0])

                    Swal.fire('Exito', response.mensaje, 'success');
                } catch (error) {
                    setModalLoading(false)
                    Swal.fire('Error', error, 'error')
                    console.log(error)
                }
            }
        });

    }

    const setModalLoading = storeArticles((state: any) => state.setModalLoading);

    const sendProduction = async () => {
        let data_c = [];

        // Recorre cada elemento de `personalized_concepts`
        let no_conceptos_a_prod = 0
        saleOrdersConcepts.personalized_concepts.forEach(element => {
            let concepts = element.conceptos.filter((x: any) => x.enviar_a_produccion === true);
            // Agrega los conceptos filtrados a `data` sin sobrescribirla
            // concepts.forEach(element => {
            //     if (element.areas_produccion.length == 0) {
            //         no_conceptos_a_prod++;
            //     } else {
            //         let ae = element.areas_produccion.filter((x: any) => x.id_area_produccion == element.id_area_produccion)

            //     }

            // });
            data_c.push(...concepts);
        });

        let normal_concepts = saleOrdersConcepts.normal_concepts.filter(element => element.enviar_a_produccion === true);
        // Agrega los conceptos filtrados a `data` sin sobrescribirla
        data_c.push(...normal_concepts);
        let data = {
            id_ov: saleOrdersToUpdate.id,
            id_usuario: user_id,
            conceptos: data_c,
            fecha_entrega: dataProduction.fecha_produccion,
            hora_entrega: dataProduction.hora_produccion,
            hora_entrega_cliente: dataProduction.hora_cliente,
            fecha_entrega_cliente: dataProduction.fecha_cliente,
        }
        // debugger
        // return
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


    const handleAreasChange = async (event: any, i: number) => {
        const value = parseInt(event.target.value, 10);

        const data = saleOrdersConcepts?.normal_concepts.map((x: any, index: any) => {
            if (index === i) {
                return { ...x, id_area_produccion: value };
            }
            return x;
        });
        setSaleOrdersConcepts({ normal_concepts: data, personalized_concepts: saleOrdersConcepts.personalized_concepts });


        console.log('saleOrdersConcepts', saleOrdersConcepts)

        if (modalSalesOrder == 'sale-order__modal') {
            data[i].id_usuario_actualiza = user_id
            await APIs.CreateAny(data[i], "update_carrito_concepto")
                .then(async (response: any) => {
                    if (!response.error) {
                        await APIs.GetAny('get_carrito/' + user_id)
                            .then(async (response: any) => {
                                let order = response[0]
                                setSaleOrdersToUpdate(order)
                                setSaleOrdersConcepts({ normal_concepts: order.conceptos, personalized_concepts: order.conceptos_pers });
                            })
                    } else {
                        // Swal.fire('Notificación', response.mensaje, 'warning');
                        return
                    }
                })

        }



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
            check_recibido_sucursal: article.check_recibido_sucursal,
            check_entregado_cliente: article.check_entregado_cliente,
            total: article.total,
            id_unidad: article.id_unidad,
            obs_produccion: article.obs_produccion,
            obs_factura: article.obs_factura,
            id_pers: article.id_pers,
            id_usuario_actualiza: user_id
        }
        // return
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
                        setSaleOrdersConcepts({ sale_order: order, normal_concepts: order.conceptos, personalized_concepts: order.conceptos_pers });
                        setSaleOrdersToUpdate(order)

                        setModalLoading(false)

                    })
            }

            // search()
        } catch (error: any) {
            Swal.fire('Error al actualizar el concepto', error, 'success');
        }
    }

    const binnacleModal = () => {

        setSubModal('logbook__sales-order-modal')
    }

    const handleStatusChange = async (status: number, index: number) => {
        let data = saleOrdersConcepts?.normal_concepts.map((item: any, i: number) =>
            i === index ? { ...item, enviar_a_produccion: !status } : item
        )
        setSaleOrdersConcepts({ normal_concepts: data, personalized_concepts: saleOrdersConcepts.personalized_concepts });


        if (modalSalesOrder == 'sale-order__modal') {
            data[index].id_usuario_actualiza = user_id
            await APIs.CreateAny(data[index], "update_carrito_concepto")
                .then(async (response: any) => {
                    if (!response.error) {
                        await APIs.GetAny('get_carrito/' + user_id)
                            .then(async (response: any) => {
                                let order = response[0]
                                setSaleOrdersToUpdate(order)
                                setSaleOrdersConcepts({ normal_concepts: order?.conceptos, personalized_concepts: order?.conceptos_pers });
                                Swal.fire('Exito', 'Concepto actualizado', 'success');
                            })
                    } else {
                        Swal.fire('Notificación', response.mensaje, 'warning');
                        return
                    }
                })
        }


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

        if (modalSalesOrder === 'sale-order__modal' && modalSalesOrder == 'sale-order__modal_bycot') {
            calcular_tiempos_entrega();
            console.log('CALCULANDO TIEMPOS DE ENTREGA LINEA 733');

        }
    }, [modalSalesOrder, changeLength])

    useEffect(() => {
        if (modalSalesOrder === 'sale-order__modal' && modalSalesOrder == 'sale-order__modal_bycot') {
            calcular_tiempos_entrega();
            console.log('CALCULANDO TIEMPOS DE ENTREGA LINEA 741');


        }
    }, [branchOffices])
    // useEffect(() => {

    //     calcular_totales()

    //     if (modalSalesOrder !== 'sale-order__modal-update') {
    //         calcular_tiempos_entrega();

    //     }
    // }, [saleOrdersConcepts])


    // useEffect(() => {

    //     calcular_totales()

    //     if (modalSalesOrder !== 'sale-order__modal-update') {
    //         calcular_tiempos_entrega();

    //     }
    // }, [modalSalesOrder, branchOffices])

    const normalLen = saleOrdersConcepts?.normal_concepts?.length ?? 0;
    const personalizedLen = saleOrdersConcepts?.personalized_concepts?.length ?? 0;
    useEffect(() => {

        calcular_totales()

        // if (modalSalesOrder === 'sale-order__modal') {
        //     calcular_tiempos_entrega();
        // }
        if (saleOrdersConcepts?.normal_concepts?.length == 0 && saleOrdersConcepts?.personalized_concepts?.length == 0) {
            setModifyTe(0) //CM01INHDLGRECL11S
        }

    }, [saleOrdersConcepts])
    useEffect(() => {
        if (modalSalesOrder === "sale-order__modal") {
            calcular_tiempos_entrega();
            console.log('CALCULANDO TIEMPOS DE ENTREGA LINEA 784');
            console.log('MODOUPDATE', modeUpdate);
            console.log('modalSalesOrder', modalSalesOrder);

        }
    }, [modalSalesOrder, normalLen, personalizedLen]);



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
        const precios = (saleOrdersConcepts?.normal_concepts || [])
            .filter(item => item.status !== 1) // Excluir elementos con status 1
            .reduce(
                (acc, item) => ({
                    precio_unitario: acc.precio_unitario + (parseFloat(item.precio_unitario) || 0),
                    descuento: acc.descuento + (parseFloat(item.descuento) || 0),
                    monto_urgencia: acc.monto_urgencia + (parseFloat(item.monto_urgencia) || 0),
                    total: acc.total + (parseFloat(item.total) || 0),
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
            (preciospers.total || 0) + (precios.total || 0)
        );
        setdDiscount((preciospers.descuento || 0) + (precios.descuento || 0));
        setdUrgency((preciospers.monto_urgencia || 0) + (precios.monto_urgencia || 0));
        setdTotalGeneral((preciospers.total || 0) + (preciospers.descuento || 0) + (preciospers.monto_urgencia || 0) +
            (precios.total || 0) + (precios.descuento || 0) + (precios.monto_urgencia || 0));
        setSubtotalf((preciospers.total_franquicia || 0) + (precios.total_franquicia || 0));
        setTotalf((preciospers.total_franquicia || 0) + (precios.total_franquicia || 0));
    };


    const getTicket = async () => {
        try {
            // await APIs.getPdfPurchaseOrders(saleOrdersToUpdate.id);
            // Abrimos el PDF en una nueva pestaña
            window.open(`http://hiplot.dyndns.org:84/api_dev/pdf_ov/${saleOrdersToUpdate.id}`, '_blank');
        } catch (error) {
            console.log(error);
        }
    }



    useEffect(() => {
        if (modalSalesOrder === 'sale-order__modal_bycot' || modalSalesOrder == 'sale-order__modal') {
            setIdCotizacion(saleOrdersToUpdate.id_cotizacion_relacionada)
            setDataSaleOrder(saleOrdersToUpdate?.conceptos)
            setCompanies({ id: saleOrdersToUpdate.id_empresa })
            setBranchOffices({ id: saleOrdersToUpdate.id_sucursal })
            if (modalSalesOrder == 'sale-order__modal_bycot') {

                setSaleOrdersConcepts({ normal_concepts: saleOrdersToUpdate.conceptos, personalized_concepts: saleOrdersToUpdate.conceptos_pers });
            }
            setTitle(saleOrdersToUpdate.titulo)

            const data = {
                id_sucursal: saleOrdersToUpdate.id_sucursal,
                id_usuario: user_id,
                nombre: saleOrdersToUpdate.rfc,
                activos: true

            }
            getClients(data).then((response: any) => {
                setClients({
                    selectName: 'Cliente',
                    options: 'razon_social',
                    dataSelect: response
                })

                let off = !response[0].status ? true : false
                console.log('entrando aquiiiiiiiiii', off);
                setClienteOff(off)
            })
            calcular_tiempos_entrega()
            console.log('CALCULANDO TIEMPOS DE ENTREGA LINEA 883');

            // setClienteOff(false)

        } else {
            buscarUsuarios()
            setDates([saleOrdersToUpdate.fecha_entrega_produccion + 'T' + saleOrdersToUpdate.hora_entrega_produccion,
            saleOrdersToUpdate.fecha_entrega_cliente + 'T' + saleOrdersToUpdate.hora_entrega_cliente])
            setTitle(saleOrdersToUpdate.titulo)
            setDataSaleOrder(saleOrdersToUpdate?.conceptos)
            setModifyTe(saleOrdersToUpdate.motivo_modify_te)

            setSelectedIds('clients', saleOrdersToUpdate.id_cliente)
            setClienteOff(false)
        }
    }, [modalSalesOrder]);

    const hora = hoy.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    const [loadingTimes, setLoadingTimes] = useState<boolean>(false)
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
            id_sucursal: userState.sucursal_id,
            articulos: conceptos_a_enviar
        }
        // debugger
        setLoadingTimes(true)
        await APIs.CreateAny(data, "calcular_tiempo_entrega")
            .then(async (response: any) => {
                setModifyTe(0)
                setLoadingTimes(false)

                if (response.hora_cliente && response.hora_produccion) {
                    setDataProduction(response)
                    setDates([`${response.fecha_produccion}T${response.hora_produccion}`, `${response.fecha_cliente}T${response.hora_cliente}`])
                } else {
                    setDataProduction(response)
                    setDates([`${response.fecha_produccion}T${hora}`, `${response.fecha_cliente}T${hora}`])
                }
            }).catch(() => {
                setLoadingTimes(false)
            })
    }
    const setModalSub = storeModals((state) => state.setModalSub);

    const setIndexVM = storeDv(state => state.setIndex)
    const setDataCampos = storeDv(state => state.setDataCampos)

    const [typeConcept, setTypeConcept] = useState<string>('')
    const seeVerMas = (index: number, type: string) => { //AL ABRIR SEE-CP NO SE VISUALIZA LA INFORMACIÓN DE LAS PLANTILLAS PORQUE SIGUE USANDO NORMALCONCEPTS CORREGIR AQUÍ Y EN LA COTIZACIÓN
        setIndexVM(index)
        setDataCampos({ tipo: type })
        setModalSub('see_cp')
    }

    const [stateLoading, setStateLoading] = useState<any>(false)

    const handleUrgencyChange = async (index: number) => {
        setStateLoading(true)
        let data = {
            "id_articulo": saleOrdersConcepts?.normal_concepts[index].id_articulo,
            "id_sucursal": modeUpdate ? saleOrdersToUpdate.id_sucursal : branchOffices.id,
            "total": saleOrdersConcepts?.normal_concepts[index].precio_total
        }
        const newConcept: any = [...saleOrdersConcepts?.normal_concepts];
        if (newConcept[index].urgency) {
            newConcept[index].precio_total = parseFloat(newConcept[index].precio_total);
            newConcept[index].monto_urgencia = 0;
            newConcept[index].total_franquicia = parseFloat(newConcept[index].total_franquicia);
            newConcept[index].monto_urgencia_franquicia = 0;
            newConcept[index].id_usuario_actualiza = user_id
            newConcept[index].urgency = !newConcept[index]?.urgency;
            await APIs.CreateAny(newConcept[index], "update_carrito_concepto")
                .then(async (response: any) => {
                    if (!response.error) {
                        newConcept[index].monto_urgencia = parseFloat(response.monto_urgencia);

                        await APIs.GetAny('get_carrito/' + user_id)
                            .then(async (response: any) => {
                                let order = response[0]
                                setSaleOrdersToUpdate(order)
                                setSaleOrdersConcepts({ normal_concepts: order.conceptos, personalized_concepts: order.conceptos_pers });
                            })
                    } else {
                        Swal.fire('Notificación', response.mensaje, 'warning');
                        return
                    }
                })


        } else {
            await APIs.CreateAny(data, "calcular_urgencia")
                .then(async (response: any) => {
                    if (!response.error) {
                        if (newConcept[index].total_franquicia > 0) {
                            let data2 = {
                                "id_articulo": saleOrdersConcepts?.normal_concepts[index].id_articulo,
                                "id_sucursal": modeUpdate ? saleOrdersToUpdate.id_sucursal : branchOffices.id,
                                "total": saleOrdersConcepts?.normal_concepts[index].total_franquicia
                            }
                            // ESTE CALCULA LA URGENCIA DEL MONTO DE FRANQUICIA
                            await APIs.CreateAny(data2, "calcular_urgencia")
                                .then(async (response2: any) => {
                                    if (!response2.error) {
                                        newConcept[index].monto_urgencia_franquicia = parseFloat(response2.monto_urgencia);
                                        newConcept[index].total_franquicia = newConcept[index].total_franquicia;
                                    }
                                })
                        }
                        newConcept[index].monto_urgencia = parseFloat(response.monto_urgencia);
                        newConcept[index].precio_total = newConcept[index].precio_total + response.monto_urgencia;
                        console.log(' newConcept[index].precio_total = newConcept[index].precio_total + response.monto_urgencia;', newConcept[index])
                        newConcept[index].id_usuario_actualiza = user_id
                        await APIs.CreateAny(newConcept[index], "update_carrito_concepto")
                            .then(async (response: any) => {
                                if (!response.error) {
                                    newConcept[index].monto_urgencia = parseFloat(response.monto_urgencia);
                                    await APIs.GetAny('get_carrito/' + user_id)
                                        .then(async (response: any) => {
                                            let order = response[0]
                                            setSaleOrdersToUpdate(order)
                                            setSaleOrdersConcepts({ normal_concepts: order.conceptos, personalized_concepts: order.conceptos_pers });
                                        })
                                } else {
                                    Swal.fire('Notificación', response.mensaje, 'warning');
                                    return
                                }
                            })


                    } else {
                        Swal.fire('Notificación', response.mensaje, 'warning');
                        return
                    }
                })
            newConcept[index].urgency = !newConcept[index]?.urgency;
        }


        // newConcept[index].urgency = !newConcept[index]?.urgency;

        setStateLoading(false)


    };



    const updateOrdenVenta = async () => {

        const [datePartOne, timePartOne] = dates[0] ? dates[0].split("T") : ["", ""];
        const [datePartTwo, timePartTwo] = dates[1] ? dates[1].split("T") : ["", ""];

        let data = {
            id: saleOrdersToUpdate.id,
            id_usuario_actualiza: user_id,
            id_sucursal: branchOffices.id,
            id_usuario_crea: vendedorSelected,
            id_cliente: selectedIds.clients.id || saleOrdersToUpdate.id_cliente,
            titulo: title,
            hora_entrega_produccion: timePartOne,
            fecha_entrega_produccion: datePartOne,
            hora_entrega_cliente: timePartTwo,
            fecha_entrega_cliente: datePartTwo,
            // conceptos: normalConcepts

        }
        if (clienteOff) {
            return Swal.fire('Advertencia', 'No se puede vender a este cliente porque se encuentra deshabilitado', 'warning');
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
                            // setCustomConcepts(order.conceptos_pers);
                            // setNormalConcepts(order.conceptos);
                            setModalLoading(false)
                            setCustomLocal([])
                            setNormalConceptsView([])
                            setNormalConcepts([])
                            setDeleteNormalConcepts([])
                            setDeleteCustomConcepts([])
                            setCustomConcepts([])
                            setConceptView([])
                            setCustomConceptView([])
                            // setSaleOrdersConcepts({ normal_concepts: [], personalized_concepts: [] });

                            setModalSalesOrder('sale-order__modal-update')
                            setSaleOrdersConcepts({ sale_order: order, normal_concepts: order.conceptos, personalized_concepts: order.conceptos_pers });
                            setSaleOrdersToUpdate(order)
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
        setModalLoading(true)
        console.log(saleOrdersConcepts);
        let id_orden = saleOrdersToUpdate.id ?? saleOrdersConcepts.sale_order.id
        await APIs.GetAny('calcular_urgencia_global_ov/' + id_orden + '/' + urg).then(async (resp: any) => {

            await APIs.GetAny('get_carrito/' + user_id).then((r: any) => {
                let orden = r[0]
                // setSaleOrdersToUpdate(orden)
                setSaleOrdersConcepts({ normal_concepts: orden.conceptos, personalized_concepts: orden.conceptos_pers, sale_order: orden });
                setModalLoading(false)

            })
        }).catch((e: any) => {
            setModalLoading(false)

        })

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

    const undoConcepts = async (concept: any, i: number) => {
        //----------------------------------ESTE YA TIENE LA VARIABLE IS ADICIONAL, VERIFICAR SI IS ADICIONAL SE ELIMINAN
        //----------------------------------HASTA LOS CONCEPTITOS, SI NO ES ADICIONAL SE ELIMINA CON ESTE QUE YA TRAE POR DEFAULT


        await APIs.deleteAny(`eliminar_conceptos_pers_carrito/${concept.id}`)
            .then(async (response: any) => {
                if (!response.error) {
                    await APIs.GetAny('get_carrito/' + user_id)
                        .then(async (response: any) => {
                            let order = response[0]
                            setSaleOrdersToUpdate(order)
                            setSaleOrdersConcepts({ normal_concepts: order.conceptos, personalized_concepts: order.conceptos_pers });
                        })
                } else {
                    Swal.fire('Notificación', response.mensaje, 'warning');
                    return
                }
            })
        // if (concept.is_adicional) {
        //     await APIs.deleteAny(`eliminar_conceptos_pers_adi_carrito/${concept.id}`)
        //         .then(async (response: any) => {
        //             if (!response.error) {
        //                 await APIs.GetAny('get_carrito/' + user_id)
        //                     .then(async (response: any) => {
        //                         let order = response[0]
        //                         setSaleOrdersToUpdate(order)
        //                         setSaleOrdersConcepts({ normal_concepts: order.conceptos, personalized_concepts: order.conceptos_pers });
        //                     })
        //             } else {
        //                 Swal.fire('Notificación', response.mensaje, 'warning');
        //                 return
        //             }
        //         })
        // } else {

        //     await APIs.deleteAny(`eliminar_conceptos_pers_carrito/${concept.id}`)
        //         .then(async (response: any) => {
        //             if (!response.error) {
        //                 await APIs.GetAny('get_carrito/' + user_id)
        //                     .then(async (response: any) => {
        //                         let order = response[0]
        //                         setSaleOrdersToUpdate(order)
        //                         setSaleOrdersConcepts({ normal_concepts: order.conceptos, personalized_concepts: order.conceptos_pers });
        //                     })
        //             } else {
        //                 Swal.fire('Notificación', response.mensaje, 'warning');
        //                 return
        //             }
        //         })
        // }


    };


    const deleteArticle = async (item: any, i: number, type) => {
        if (type == 'modal-sale') {
            if (modalSalesOrder == 'sale-order__modal') {
                Swal.fire({
                    title: "Deseas eliminar el concepto " + item.descripcion,
                    text: "Si se encuentra apartado tu material, esta acción lo desapartará",
                    showCancelButton: true,
                    confirmButtonText: "Aceptar",
                    denyButtonText: `Cancelar`,
                    icon: 'question'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        setModalLoading(true)
                        APIs.deleteAny('eliminar_conceptos_carrito/' + item.id).then(async (resp: any) => {
                            if (resp.error) {
                                setModalLoading(false)

                                Swal.fire('Notificacion', resp.mensaje, 'warning')
                            } else {
                                setModalLoading(false)
                                Swal.fire('Notificacion', resp.mensaje, 'success')
                                await APIs.GetAny('get_carrito/' + user_id).then((r: any) => {
                                    let orden = r[0]
                                    setSaleOrdersConcepts({ sale_order: orden, normal_concepts: orden?.conceptos || [], personalized_concepts: orden?.conceptos_pers || [] });
                                })
                            }
                        }).finally(() => {
                            setModalLoading(false)
                        })

                    }
                });
            } else {

            }
        } else {
            const filter = saleOrdersConcepts.normal_concepts.filter((_: any, index: number) => index !== i)
            setSaleOrdersConcepts({ normal_concepts: filter, personalized_concepts: saleOrdersConcepts.personalized_concepts, });
            toast.success('Concepto eliminado')
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
            page: 1,
            light: true
        }
        const resultData = await getSaleOrders(dataSaleOrders)

        setSaleOrders(resultData)
        // setModalSalesOrder('')
    }


    const closeModal = async () => {
        setModalSalesOrder('')
        setSaleOrdersToUpdate({})
        setTitle('')
        setSelectedIds('clients', { id: 0, razon_social: '' })
        setSearchCustomer('')
        // setov_repo(null)
        await APIs.GetAny('get_carrito/' + user_id).then((r: any) => {
            let orden = r[0]
            if (r.length == 0) {
                setSaleOrdersConcepts({ normal_concepts: [], personalized_concepts: [] });

            } else {
                setSaleOrdersConcepts({ sale_order: orden, normal_concepts: orden.conceptos, personalized_concepts: orden.conceptos_pers });
            }
        })
        if (modalSalesOrder == 'sale-order__modal-update') {
            setSelectedIds('clients', null)
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
            i === index ? { ...item, precio_unitario: value / item.cantidad, total: value } : item
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


    const handleBranchChange = (status: number, index: number) => {
        let data = saleOrdersConcepts?.normal_concepts.map((item: any, i: number) =>
            i === index ? { ...item, check_recibido_sucursal: !status } : item
        )
        setSaleOrdersConcepts({ normal_concepts: data, personalized_concepts: saleOrdersConcepts.personalized_concepts });
    }

    const handleCustomerChange = (status: number, index: number) => {
        let data = saleOrdersConcepts?.normal_concepts.map((item: any, i: number) =>
            i === index ? { ...item, check_entregado_cliente: !status } : item
        )
        setSaleOrdersConcepts({ normal_concepts: data, personalized_concepts: saleOrdersConcepts.personalized_concepts });
    }

    const [isDisabledBranch, setIsDisabledBranch] = useState<boolean>(false);
    const [isDisabledClients, setIsDisabledClients] = useState<boolean>(false);

    const handleBrnachChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setIsDisabledBranch(isChecked)
        if (isChecked) {
            saleOrdersConcepts?.normal_concepts.forEach(element => {
                element.check_recibido_sucursal = true
            });
            setSaleOrdersConcepts({ normal_concepts: saleOrdersConcepts?.normal_concepts, personalized_concepts: saleOrdersConcepts.personalized_concepts });
        } else {

        }
    }

    const handleClientsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setIsDisabledClients(isChecked)
        if (isChecked) {
            saleOrdersConcepts?.normal_concepts.forEach(element => {
                element.check_entregado_cliente = true
            });
            setSaleOrdersConcepts({ normal_concepts: saleOrdersConcepts?.normal_concepts, personalized_concepts: saleOrdersConcepts.personalized_concepts });
        } else {

        }
    }

    const [statusUrgency, setStatusUrgency] = useState<any>(false)
    useEffect(() => {
        const hasUrgency = saleOrdersConcepts?.normal_concepts?.some(element => element.urgency === true);
        setStatusUrgency(hasUrgency);
    }, [saleOrdersConcepts.normal_concepts]);


    useEffect(() => {
        if (statusUrgency) {

        } else {
            // debugger
            calcular_tiempos_entrega();
            console.log('CALCULANDO TIEMPOS DE ENTREGA LINEA 1439');

        }

    }, [statusUrgency])


    const cargar_repo = () => {
        Swal.fire({
            title: "Desea levantar una REPOSICIÓN de esta orden?",
            text: "Esta acción ligará la orden actual a la nueva orden como una reposición",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            denyButtonText: `Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                setov_repo(saleOrdersToUpdate)
                closeModal()
                Swal.fire('Notificacion', 'Puedes empezar a crear tu reposición como una nueva orden', 'success')
                setTimeout(() => {
                    modalOpen()
                }, 1000);
            }
        });

    }
    const modalOpen = async () => {
        setModalSalesOrder('sale-order__modal')
        setModalLoading(true)
        await APIs.GetAny('get_carrito/' + user_id).then((r: any) => {
            let orden = r[0]
            if (r.length > 0) {
                setSaleOrdersToUpdate(orden)
                setSaleOrdersConcepts({ normal_concepts: orden.conceptos || [], personalized_concepts: orden.conceptos_pers || [], sale_order: orden });

            }
            setModalLoading(false)

        })



    }
    const [vendedores, setVendedores] = useState<any[]>([])
    const [vendedorSelected, setVendedorSelected] = useState<number>(0)
    const buscarUsuarios = async () => {
        let dataUsers = {
            nombre: '',
            id_usuario: user_id,
            id_usuario_consulta: user_id,
            light: true,
            id_sucursal: saleOrdersToUpdate.id_sucursal
        }
        let resultUsers: any = await APIs.getUsers(dataUsers)
        setVendedores(resultUsers)
    }
    const vaciarCarrito = async () => {
        Swal.fire({
            title: "¿Deseas vaciar el carrito?",
            text: "Esta acción eliminará todos los conceptos del carrito, no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            denyButtonText: `Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                setModalLoading(true)
                await APIs.deleteAny(`vaciar_carrito/${user_id}`)
                    .then(async (response: any) => {
                        if (!response.error) {
                            Swal.fire('Notificación', response.mensaje, 'success');
                            await APIs.GetAny('get_carrito/' + user_id).then((r: any) => {
                                let orden = r[0]
                                setSaleOrdersConcepts({ sale_order: orden, normal_concepts: orden?.conceptos || [], personalized_concepts: orden?.conceptos_pers || [] });
                            })
                            setModalLoading(false)
                        } else {
                            Swal.fire('Notificación', response.mensaje, 'warning');
                            setModalLoading(false)
                        }
                    })
            }
        });
    }
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const ChangeInputs = (key: any, valor: any, index: number) => {
        const updatedConcepts = saleOrdersConcepts.normal_concepts.map((concept, i) =>
            i === index ? { ...concept, [key]: valor } : concept
        );
        setSaleOrdersConcepts({ ...saleOrdersConcepts, normal_concepts: updatedConcepts });
        if (!modeUpdate) {

            // Limpiar timeout anterior si existe
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            updatedConcepts[index].id_usuario_actualiza = user_id

            // Crear nuevo timeout para enviar los datos tras 500 ms sin escribir
            typingTimeoutRef.current = setTimeout(async () => {
                try {
                    let response: any = await APIs.CreateAny(updatedConcepts[index], "update_carrito_concepto");
                    if (response?.error) {
                        Swal.fire('Notificación', response.mensaje, 'warning');
                    }
                } catch (error) {
                    console.error('Error al actualizar concepto:', error);
                }
            }, 1000);
        }
    };

    const ChangeInputsPers = (key: any, valor: any, index: number) => {

        const updatedConcepts = saleOrdersConcepts.personalized_concepts.map((concept, i) =>
            i === index ? { ...concept, [key]: valor } : concept
        );
        setSaleOrdersConcepts({ ...saleOrdersConcepts, personalized_concepts: updatedConcepts });


    }
    const ChangeInputsDentrodePers = (key: any, valor: any, index: number, indexConcept: number) => {
        const updatedConcepts = saleOrdersConcepts.personalized_concepts.map((concept, i) => {
            if (i !== index) return concept;

            const updatedInnerConcepts = concept.conceptos.map((c, j) =>
                j === indexConcept ? { ...c, [key]: valor } : c
            );

            return {
                ...concept,
                conceptos: updatedInnerConcepts
            };
        });

        const updatedQuotes = { ...saleOrdersConcepts, personalized_concepts: updatedConcepts };
        setSaleOrdersConcepts(updatedQuotes);


        // Limpiar timeout anterior si existe
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        updatedConcepts[index].conceptos[indexConcept].id_usuario_actualiza = user_id

        // Crear nuevo timeout para enviar los datos tras 500 ms sin escribir
        typingTimeoutRef.current = setTimeout(async () => {
            try {
                let response: any = await APIs.CreateAny(updatedConcepts[index].conceptos[indexConcept], "update_carrito_concepto");
                if (response?.error) {
                    Swal.fire('Notificación', response.mensaje, 'warning');
                }
            } catch (error) {
                console.error('Error al actualizar concepto:', error);
            }
        }, 1000);
    };

    const handleUrgencyChangeDentroPers = async (index: number, indexConcept: number) => {
        let data = {
            "id_articulo": saleOrdersConcepts.personalized_concepts[index].conceptos[indexConcept].id_articulo,
            "id_sucursal": modeUpdate ? saleOrdersToUpdate.id_sucursal : branchOffices.id,
            "total": saleOrdersConcepts?.personalized_concepts[index].conceptos[indexConcept].precio_total
        }
        setStateLoading(true)

        const newConcept = saleOrdersConcepts.personalized_concepts[index].conceptos

        if (newConcept[indexConcept].urgency) {
            let a_restar_en_pers = newConcept[indexConcept].monto_urgencia
            newConcept[indexConcept].precio_total = parseFloat(newConcept[indexConcept].precio_total);
            newConcept[indexConcept].monto_urgencia = 0;
            newConcept[indexConcept].total_franquicia = parseFloat(newConcept[indexConcept].total_franquicia);
            newConcept[indexConcept].monto_urgencia_franquicia = 0;
            newConcept[indexConcept].id_usuario_actualiza = user_id
            newConcept[indexConcept].urgency = !newConcept[indexConcept]?.urgency;
            await APIs.CreateAny(newConcept[indexConcept], "update_carrito_concepto")
                .then(async (response: any) => {
                    if (!response.error) {
                        newConcept[indexConcept].monto_urgencia = parseFloat(response.monto_urgencia);
                        const updatedConceptView = saleOrdersConcepts?.personalized_concepts.map((x: any, i: number) => {
                            if (i == index) {

                                return {
                                    ...x,
                                    precio_total: parseFloat(x.precio_total) - parseFloat(a_restar_en_pers),
                                };
                            }
                            return x;
                        });
                        APIs.CreateAny(updatedConceptView[0], 'update_carrito_concepto_pers').then(async (resp: any) => {
                            if (!resp.error) {
                                setModalLoading(false)
                                Swal.fire('Notificación', resp.mensaje, 'success')

                                await APIs.GetAny('get_carrito/' + user_id).then((r: any) => {
                                    let order = r[0]
                                    setStateLoading(false)

                                    setSaleOrdersToUpdate(order)
                                    setSaleOrdersConcepts({ normal_concepts: order.conceptos, personalized_concepts: order.conceptos_pers });
                                })
                            } else {
                                setModalLoading(false)
                                Swal.fire('Notificación', resp.mensaje, 'warning')
                            }
                        }).catch(e => {
                            setModalLoading(false)
                            Swal.fire('Notificación', 'ERROR: ' + e, 'warning')

                        })

                    } else {
                        setStateLoading(false)

                        Swal.fire('Notificación', response.mensaje, 'warning');
                        return
                    }
                })


        } else {
            await APIs.CreateAny(data, "calcular_urgencia")
                .then(async (response: any) => {
                    if (!response.error) {
                        if (newConcept[indexConcept].total_franquicia > 0) {
                            let data2 = {
                                "id_articulo": saleOrdersConcepts?.normal_concepts[indexConcept].id_articulo,
                                "id_sucursal": modeUpdate ? saleOrdersToUpdate.id_sucursal : branchOffices.id,
                                "total": saleOrdersConcepts?.normal_concepts[indexConcept].total_franquicia
                            }
                            // ESTE CALCULA LA URGENCIA DEL MONTO DE FRANQUICIA
                            await APIs.CreateAny(data2, "calcular_urgencia")
                                .then(async (response2: any) => {
                                    if (!response2.error) {

                                        newConcept[indexConcept].monto_urgencia_franquicia = parseFloat(response2.monto_urgencia);
                                        newConcept[indexConcept].total_franquicia = newConcept[indexConcept].total_franquicia;
                                    }
                                })
                        }
                        newConcept[indexConcept].monto_urgencia = parseFloat(response.monto_urgencia);
                        newConcept[indexConcept].precio_total = newConcept[indexConcept].precio_total + response.monto_urgencia;
                        console.log(' newConcept[indexConcept].precio_total = newConcept[indexConcept].precio_total + response.monto_urgencia;', newConcept[indexConcept])
                        newConcept[indexConcept].id_usuario_actualiza = user_id
                        await APIs.CreateAny(newConcept[indexConcept], "update_carrito_concepto")
                            .then(async (response2: any) => {
                                if (!response2.error) {
                                    const updatedConceptView = saleOrdersConcepts?.personalized_concepts.map((x: any, i: number) => {
                                        if (i == index) {

                                            return {
                                                ...x,
                                                precio_total: parseFloat(x.precio_total) + parseFloat(response.monto_urgencia),
                                            };
                                        }
                                        return x;
                                    });
                                    APIs.CreateAny(updatedConceptView[0], 'update_carrito_concepto_pers').then(async (resp: any) => {
                                        if (!resp.error) {
                                            setModalLoading(false)
                                            Swal.fire('Notificación', resp.mensaje, 'success')

                                            await APIs.GetAny('get_carrito/' + user_id).then((r: any) => {
                                                let order = r[0]
                                                setStateLoading(false)

                                                setSaleOrdersToUpdate(order)
                                                setSaleOrdersConcepts({ normal_concepts: order.conceptos, personalized_concepts: order.conceptos_pers });
                                            })
                                        } else {
                                            setModalLoading(false)
                                            Swal.fire('Notificación', resp.mensaje, 'warning')
                                        }
                                    }).catch(e => {
                                        setModalLoading(false)
                                        Swal.fire('Notificación', 'ERROR: ' + e, 'warning')

                                    })

                                    newConcept[indexConcept].monto_urgencia = parseFloat(response.monto_urgencia);

                                } else {
                                    setStateLoading(false)

                                    Swal.fire('Notificación', response.mensaje, 'warning');
                                    return
                                }
                            })


                    } else {
                        setStateLoading(false)

                        Swal.fire('Notificación', response.mensaje, 'warning');
                        return
                    }
                })
            newConcept[indexConcept].urgency = !newConcept[indexConcept]?.urgency;
        }

    };

    const handleAreasChangeDentroPers = async (event: React.ChangeEvent<HTMLSelectElement>, i: number, indexConcept: number) => {
        const value = parseInt(event.target.value, 10);
        const data = saleOrdersConcepts.personalized_concepts[i].conceptos.map((x: any, index: any) => {
            if (index === indexConcept) {
                return { ...x, id_area_produccion: value };
            }
            return x;
        });
        const updatedConcepts = saleOrdersConcepts.personalized_concepts.map((concept, index) => {
            if (index === i) {
                return { ...concept, conceptos: data };
            }
            return concept;
        });
        setSaleOrdersConcepts({ normal_concepts: saleOrdersConcepts.normal_concepts, personalized_concepts: updatedConcepts });



        if (modalSalesOrder == 'sale-order__modal') {
            data[indexConcept].id_usuario_actualiza = user_id
            await APIs.CreateAny(data[indexConcept], "update_carrito_concepto")
                .then(async (response2: any) => {
                    if (!response2.error) {
                        // await APIs.GetAny('get_carrito/' + user_id)
                        //     .then(async (response: any) => {
                        //         let order = response[0]
                        //         setSaleOrdersToUpdate(order)
                        //         setSaleOrdersConcepts({ normal_concepts: order.conceptos, personalized_concepts: order.conceptos_pers });
                        //     })
                    } else {
                        // Swal.fire('Notificación', response.mensaje, 'warning');
                        return
                    }
                })

        }
    };

    const handleStatusChangeDentroPers = async (status: number, i: number, indexConcept: number) => {
        const data = saleOrdersConcepts.personalized_concepts[i].conceptos.map((x: any, index: any) => {
            if (index === indexConcept) {
                return { ...x, enviar_a_produccion: !status }
            }
            return x;
        });
        const updatedConcepts = saleOrdersConcepts.personalized_concepts.map((concept, index) => {
            if (index === i) {
                return { ...concept, conceptos: data };
            }
            return concept;
        });
        setSaleOrdersConcepts({ normal_concepts: saleOrdersConcepts.normal_concepts, personalized_concepts: updatedConcepts });
        if (modalSalesOrder == 'sale-order__modal') {
            data[indexConcept].id_usuario_actualiza = user_id
            await APIs.CreateAny(data[indexConcept], "update_carrito_concepto")
                .then(async (response: any) => {
                    if (!response.error) {
                        // await APIs.GetAny('get_carrito/' + user_id)
                        //     .then(async (response: any) => {
                        //         let order = response[0]
                        //         setSaleOrdersToUpdate(order)
                        //         setSaleOrdersConcepts({ normal_concepts: order?.conceptos, personalized_concepts: order?.conceptos_pers });
                        //         Swal.fire('Exito', 'Concepto actualizado', 'success');
                        //     })
                    } else {
                        Swal.fire('Notificación', response.mensaje, 'warning');
                        return
                    }
                })
        }


    };
    const handleBranchChangeDentroPers = (status: number, index: number, indexConcept: number) => {

        const data = saleOrdersConcepts.personalized_concepts[index].conceptos.map((x: any, i: any) => {
            if (i === indexConcept) {
                return { ...x, check_recibido_sucursal: !status }
            }
            return x;
        });
        const updatedConcepts = saleOrdersConcepts.personalized_concepts.map((concept, i) => {
            if (index === i) {
                return { ...concept, conceptos: data };
            }
            return concept;
        });
        setSaleOrdersConcepts({ normal_concepts: saleOrdersConcepts.normal_concepts, personalized_concepts: updatedConcepts });
    }

    const handleCustomerChangeDentroPers = (status: number, index: number, indexConcept: number) => {

        const data = saleOrdersConcepts.personalized_concepts[index].conceptos.map((x: any, i: any) => {
            if (i === indexConcept) {
                return { ...x, check_entregado_cliente: !status }
            }
            return x;
        });
        const updatedConcepts = saleOrdersConcepts.personalized_concepts.map((concept, i) => {
            if (index === i) {
                return { ...concept, conceptos: data };
            }
            return concept;
        });
        setSaleOrdersConcepts({ normal_concepts: saleOrdersConcepts.normal_concepts, personalized_concepts: updatedConcepts });
    }
    const handleOpenQuotation = async () => {
        window.open(`${PrivateRoutes.QUOTATION}?id=${saleOrdersToUpdate?.id_cotizacion_relacionada}`, '_blank', 'noopener,noreferrer');
    };
    return (
        <div className={`overlay__sale-order__modal_articles ${modalSalesOrder == 'sale-order__modal' || modalSalesOrder == 'sale-order__modal-update' || modalSalesOrder == 'sale-order__modal_bycot' ? 'active' : ''}`}>
            <div className={`popup__sale-order__modal_articles ${modalSalesOrder == 'sale-order__modal' || modalSalesOrder == 'sale-order__modal-update' || modalSalesOrder == 'sale-order__modal_bycot' ? 'active' : ''}`}>
                <div className='header__modal'>
                    <a href="#" className="btn-cerrar-popup__sale-order__modal_articles" onClick={closeModal} >
                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                    </a>
                    <p className='title__modals'>Orden de venta</p>
                </div>
                <div className='sale-order__modal_articles' >
                    <div className='row__one_main'>
                        {modalSalesOrder == 'sale-order__modal-update' ?
                            <div className="card" style={{ zoom: '80%' }}>
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

                                            <div className='listSaleOrder__container parpadeo'>
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
                                            <div className='d-flex align-items-center related_quote_order' title='Ir a cotización relacionada'>
                                                <p>Cotización relacionada</p>
                                                {saleOrdersToUpdate?.id_cotizacion_relacionada > 0 ?
                                                    <>
                                                        <a
                                                            style={{ cursor: 'pointer' }}
                                                            className="sale-btn"
                                                            onClick={handleOpenQuotation}
                                                        >
                                                            <h3 className="text" >{saleOrdersToUpdate.serie_cotizacion}-{saleOrdersToUpdate.folio_cotizacion}-{saleOrdersToUpdate.anio_cotizacion}</h3>
                                                        </a>
                                                    </>
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
                                                    {saleOrdersToUpdate?.facturas?.map((facts: any) => {
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
                                                    {saleOrdersToUpdate?.ordenes_produccion?.map((facts: any) => {
                                                        return (
                                                            <div
                                                                className="tbody__container"
                                                                style={{
                                                                    borderRadius: '12px',
                                                                    background: 'linear-gradient(135deg, #e0f7fa, #ffffff)',
                                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                                    padding: '5px 5px',
                                                                    marginBottom: '12px',
                                                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                                                    cursor: 'pointer',
                                                                }}
                                                                onClick={() => verProduccion(facts.id)}
                                                                onMouseEnter={e => {
                                                                    e.currentTarget.style.transform = 'scale(1.01)';
                                                                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
                                                                }}
                                                                onMouseLeave={e => {
                                                                    e.currentTarget.style.transform = 'scale(1)';
                                                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                                                                }}
                                                            >
                                                                <div className="tbody">
                                                                    <div className="td">
                                                                        <p
                                                                            className="folio"
                                                                            style={{
                                                                                fontWeight: '600',
                                                                                color: '#01579b',
                                                                                margin: 0,
                                                                            }}
                                                                        >
                                                                            {facts.folio_completo} - {facts.area_produccion}
                                                                        </p>
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
                                            {saleOrdersToUpdate.status === 0 || saleOrdersToUpdate.status === 2 ?
                                                <div className='mr-4'>
                                                    <button className='btn__general-orange' onClick={getTicket}>Imprimir ticket</button>
                                                </div>
                                                : ''}
                                            {saleOrdersToUpdate.ordenes_produccion.length > 0 ?
                                                ''
                                                :
                                                saleOrdersToUpdate.status === 0 ?
                                                    <div className='mr-4'>
                                                        <button className='btn__general-purple' onClick={SaleOrderProduction}>Mandar a producción</button>
                                                    </div>
                                                    : ''
                                            }
                                            {saleOrdersToUpdate.ordenes_produccion.length > 0 && permisosxVista.some((x: any) => x.titulo === 'reenviar_a_produccion') ?

                                                <div className='mr-4'>
                                                    <button className='btn__general-purple' onClick={SaleOrderProduction}>Mandar a producción</button>
                                                </div>
                                                : ''}
                                            {permisosxVista.some((x: any) => x.titulo === 'activar') ?
                                                (saleOrdersToUpdate.status === 2 ?
                                                    <div className='mr-4'>
                                                        <button className='btn__general-purple' onClick={SaleOrderActivate}>Activar Orden</button>
                                                    </div>
                                                    : ''
                                                )
                                                : ''}
                                            <div>
                                                <button className='btn__general-orange' onClick={binnacleModal}>Bitácora</button>
                                            </div>
                                            <div>
                                                <button className='btn__general-orange' onClick={cargar_repo}>Cargar Reposición</button>
                                            </div>
                                        </div>
                                        {permisosxVista.some((x: any) => x.titulo === 'cancelar') ?
                                            saleOrdersToUpdate.status === 0 || saleOrdersToUpdate.status === 2 ?
                                                <div>
                                                    <button className='btn__general-danger' onClick={SaleOrderStatus}>Cancelar</button>
                                                </div>
                                                :
                                                ''
                                            :
                                            ''
                                        }
                                    </div>
                                </div>
                            </div>
                            :
                            ''
                        }
                        <div className='row__one card'>
                            <div className='row__one card'>
                                {ov_repo != undefined && ov_repo != null && ov_repo != 0 ?
                                    <span style={{
                                        color: 'red', display: 'flex', justifyContent: 'space-between',
                                    }}>Estás por realizar una reposición de la orden {ov_repo?.serie}-{ov_repo?.folio}-{ov_repo?.anio}
                                        <button type='button' className='btn__general-danger' style={{ marginLeft: 'auto' }}
                                            onClick={() => setov_repo(null)}>Cancelar Reposición</button>
                                    </span>

                                    : ''}
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
                                        <input className='inputs__general' type="text" value={searCustomer} onChange={(e) => setSearchCustomer(e.target.value)} placeholder='Ingresa el contacto' onKeyUp={(event) => event.key === 'Enter' && searchClients()} />
                                    </div>
                                    <div className='col-1 d-flex align-items-end'>
                                        <div>
                                            <button type='button' className='btn__general-purple' onClick={searchClients}>Buscar</button>

                                        </div>
                                    </div>
                                    <div className='col-4'>
                                        <Select dataSelects={clients} instanceId='clients' nameSelect={'Cliente Seleccionado'} />
                                        {clienteOff && clients?.dataSelect?.length > 0 ?
                                            <div className='w-full my-2 row__three parpadeo' style={{ color: 'red' }}>
                                                <b>Este cliente se encuentra desactivado por este motivo: {selectedIds?.clients?.comentario_desactivado ?? ''}</b>
                                            </div>

                                            : ''}
                                    </div>
                                    <div className='col-4'>
                                        <label className='label__general'>Titulo</label>
                                        <input className='inputs__general' type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Ingresa el titulo' />
                                    </div>
                                </div>

                                <div className="my-4 row">
                                    {!loadingTimes ? (
                                        <>
                                            {modify_te !== 0 && (
                                                <div className="col-12">
                                                    <b style={{ color: "red" }} title="Esta leyenda aparece cuando las fechas son ingresadas de forma manual">
                                                        Esta orden tiene Fechas de Entrega Modificadas
                                                    </b>
                                                </div>
                                            )}
                                            {dataProduction?.sin_tiempos && (
                                                <div className="col-12 parpadeo">
                                                    <b style={{ color: "red" }} title="Esta leyenda aparece cuando las fechas son ingresadas de forma manual">
                                                        CONSULTAR TIEMPOS CON PRODUCCIÓN
                                                    </b>
                                                </div>
                                            )}
                                            <div className="col-4 sale-order__input_container d-flex align-items-center">
                                                <p className="label__general">Fecha de entrega a producción</p>
                                                <div className="container_dates__requisition">
                                                    <input
                                                        disabled={
                                                            permisosxVista?.some((x: any) => x?.titulo !== 'modificar_tiempos')
                                                                ? false
                                                                : dataProduction?.sin_tiempos === true
                                                                    ? false
                                                                    : statusUrgency === true
                                                                        ? false
                                                                        : true
                                                        }
                                                        // disabled={permisosxVista.some((x: any) => x.titulo === 'modificar_tiempos') ? dataProduction.sin_tiempos ? true : statusUrgency ? false : true : dataProduction.sin_tiempos ? true : statusUrgency ? false : true}

                                                        type="datetime-local"
                                                        value={dates[0]}
                                                        className="date"
                                                        onChange={(event) => handleDateChange(event, 0)}
                                                        placeholder="Selecciona la fecha de inicio"
                                                    />

                                                </div>
                                            </div>

                                            {/* Fecha de entrega cliente */}
                                            <div className="col-4 sale-order__input_container d-flex align-items-center">
                                                <p className="label__general">Fecha de entrega cliente</p>
                                                <div className="container_dates__requisition">
                                                    <input
                                                        disabled={permisosxVista.some((x: any) => x.titulo !== 'modificar_tiempos') ? false : dataProduction?.sin_tiempos ? false : statusUrgency ? false : true}
                                                        type="datetime-local"
                                                        value={dates[1]}
                                                        className="date"
                                                        onChange={(event) => handleDateChange(event, 1)}
                                                        placeholder="Selecciona la fecha de fin"
                                                    />
                                                </div>
                                            </div>

                                        </>
                                    ) :
                                        <div className="col-4 flex items-center justify-center parpadeo">
                                            <div className="text-center p-2">
                                                <div className="clock">
                                                    <div className="clock-face">
                                                        <div className="dots"></div>
                                                        <div className="hour-hand"></div>
                                                        <div className="minute-hand"></div>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-800 loading-text">Cargando tiempos de entrega</div>
                                            </div>
                                        </div>
                                    }
                                    {modalSalesOrder === 'sale-order__modal-update' ?
                                        <>
                                            <div className="col-4 sale-order__input_container d-flex align-items-center">
                                                <p className="label__general">Vendedor</p>

                                                <select
                                                    className="select_original_general"
                                                    value={vendedorSelected}
                                                    onChange={(e) => {
                                                        setVendedorSelected(parseInt(e.target.value || '0'));
                                                    }}
                                                >
                                                    {Array.isArray(vendedores) && vendedores.length > 0
                                                        && vendedores.map((sol: any) => (
                                                            <option key={sol.id} value={sol.id}>{sol.nombre}</option>
                                                        ))}
                                                </select>
                                            </div>
                                        </>
                                        :
                                        ''
                                    }

                                    {/* {permisosxVista.some((x: any) => x.titulo === 'entregado_cliente_enviado_sucursal') ?
                                    <div className='col-4 row'>
                                    <div className='col-6'>
                                        <div>
                                            <div className=''>
                                                <label>Recibido Sucursal</label>
                                            </div>
                                            <label className="switch">
                                                <input type="checkbox" disabled={isDisabledBranch ? true : false} onChange={handleBrnachChange} />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className='col-6'>
                                        <div>
                                            <div className=''>
                                                <label>Recibido Cliente</label>
                                            </div>
                                            <label className="switch">
                                                <input type="checkbox" disabled={isDisabledClients ? true : false} onChange={handleClientsChange} />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                :
                                ''
                                } */}
                                </div>
                            </div>
                            {modalSalesOrder == 'sale-order__modal' ?
                                <div className='my-4 row'>
                                    <div className='col-12 d-flex align-items-center justify-content-between'>
                                        <p className='title__concepts'>Conceptos</p>
                                        <div className='d-flex align-items-center'>
                                            <div className='mx-4'>
                                                <button type='button' className='btn__general-danger' onClick={vaciarCarrito}>Vaciar Carrito</button>

                                            </div>
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
                                    <p className='text'>Total de Conceptos</p>
                                    <div className='quantities_tables'>{conceptView.length}</div>
                                </div>
                                <div className='table__head'>
                                    <div className='thead'>
                                        <div className='th'>
                                            <p>Artículo</p>
                                        </div>
                                        <div className='th'>
                                            <p>Cant.</p>
                                        </div>
                                        <div className='th'>
                                            <p>Unidad</p>
                                        </div>
                                        <div className='th'>
                                            <p>P/U</p>
                                        </div>
                                        <div>
                                            <p>Importe</p>
                                        </div>
                                        <div>
                                            <p>Desc.</p>
                                        </div>
                                        <div>
                                            <p>Urg.</p>
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
                                                <div className='tbody__container card' key={index} style={{ zoom: '80%', border: '1px solid' }}>
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
                                                                {article.total_franquicia != null && !Number.isNaN(article.total_franquicia) && permisosxVistaheader.length > 0 && checkPermissionHeader('totales_franquicia') ?
                                                                    <small className='total-identifier'>PUF: ${Number(article.total_franquicia / article.cantidad).toFixed(2)}</small> : ''}
                                                            </p>
                                                        </div>
                                                        <div className='td'>
                                                            {stateLoading ?
                                                                <span className="loader_simple"></span>
                                                                :
                                                                article.urgency ?
                                                                    <div className='d-block'>
                                                                        {checkPermission('cambiar_totales') ?
                                                                            <div className='d-flex'>
                                                                                <input type="number" className='mr-2 inputs__general' placeholder='Precio total' value={article.total} onChange={(e) => handlePriceChange(e, index)} />

                                                                            </div>
                                                                            :
                                                                            <p className='total-identifier'>$ {parseFloat(article.total).toFixed(2)}</p>
                                                                        }
                                                                        {article.total_franquicia != null && !Number.isNaN(article.total_franquicia) && permisosxVistaheader.length > 0 && checkPermissionHeader('totales_franquicia') ?
                                                                            <p className='mt-2 total-identifier'>
                                                                                <small>PF: ${parseFloat(article.total_franquicia).toFixed(2)}</small>
                                                                            </p>
                                                                            :
                                                                            ''
                                                                        }


                                                                    </div>
                                                                    :
                                                                    <div>
                                                                        {checkPermission('cambiar_totales') ?
                                                                            <div>
                                                                                <input type="number" className='inputs__general' placeholder='Precio total' value={article.total} onChange={(e) => handlePriceChange(e, index)} />
                                                                            </div>
                                                                            :
                                                                            <p className='total-identifier'>$ {parseFloat(article.total).toFixed(2)}</p>}
                                                                        <p className='mt-2 total-identifier'>{article.total_franquicia != null && !Number.isNaN(article.total_franquicia) && permisosxVistaheader.length > 0 && checkPermissionHeader('totales_franquicia') ?
                                                                            <small>PF: ${parseFloat(article.total_franquicia).toFixed(2)}</small> : ''}</p>
                                                                    </div>


                                                            }
                                                            {article.descuento > 0 ?
                                                                <p style={{ color: 'green' }}>(-${parseFloat(article.descuento).toFixed(2)})</p>
                                                                : ''}
                                                        </div>
                                                        <div className='td'>
                                                            <p>{article.descuento}</p>
                                                        </div>
                                                        <div className='td'>
                                                            <p>$ {article.monto_urgencia}</p>
                                                            <p className='total-identifier'>$ {article.monto_urgencia_franquicia}</p>
                                                        </div>
                                                        <div className='td'>
                                                            <p>{article.total + article.monto_urgencia}</p>
                                                        </div>
                                                        <div className='td urgency'>
                                                            {modalSalesOrder == 'sale-order__modal' ?
                                                                article?.urgency ?
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
                                                                :
                                                                ''
                                                            }
                                                        </div>
                                                        <div className='td'>
                                                            <div className='see-icon' onClick={() => seeVerMas(index, 'normal')} title='Ver mas campos'>
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

                                                        {modalSalesOrder == 'sale-order__modal' ?
                                                            ''
                                                            :
                                                            article.status == 0 ?
                                                                <div className='cancel-icon' onClick={() => canceleStatus(article)} title='Cancelar concepto'>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ban"><circle cx="12" cy="12" r="10" /><path d="m4.9 4.9 14.2 14.2" /></svg>
                                                                </div>
                                                                :
                                                                ""
                                                        }
                                                        {(permisosxVista.some((x: any) => x.titulo === 'entregado_cliente_enviado_sucursal') &&
                                                            modalSalesOrder === 'sale-order__modal-update') && (
                                                                <div className='td branch'>
                                                                    <div>
                                                                        <div className=''>
                                                                            <label>Recibido Sucursal</label>
                                                                        </div>
                                                                        <label className="switch">
                                                                            <input
                                                                                type="checkbox"
                                                                                disabled={article.check_recibido_sucursal}
                                                                                checked={article.check_recibido_sucursal}
                                                                                onChange={() => handleBranchChange(article.check_recibido_sucursal, index)}
                                                                            />
                                                                            <span className="slider"></span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            )}

                                                        {permisosxVista.some((x: any) => x.titulo === 'entregado_cliente_enviado_sucursal') && (
                                                            modalSalesOrder === 'sale-order__modal-update' && (
                                                                <div className='td customer'>
                                                                    <div>
                                                                        <div>
                                                                            <label>Entregado Cliente</label>
                                                                        </div>
                                                                        <label className="switch">
                                                                            <input
                                                                                type="checkbox"
                                                                                disabled={article.check_entregado_cliente}
                                                                                checked={article.check_entregado_cliente}
                                                                                onChange={() => handleCustomerChange(article.check_entregado_cliente, index)} />
                                                                            <span className="slider"></span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}

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
                                                        {article.status_produccion == 3 ?
                                                            <div className="td" title='El concepto ya fue enviado a sucursal por producción'>
                                                                <b className='parpadeo' style={{ color: '#2674bb', fontSize: '14px' }}>Enviado A Sucursal</b>
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
                                                        {/* <br /> */}
                                                        <div className='col-12' style={{ border: '1px solid #ccc ', padding: '5px', margin: '5px' }}>
                                                            <div className='row'>
                                                                {article.campos_plantilla.map((x: any) => (
                                                                    <div className='col-2'>
                                                                        {x.considerado_total ?
                                                                            <p><b>{x.nombre_campo_plantilla} : {x.valor}</b></p>
                                                                            :
                                                                            <p>{x.nombre_campo_plantilla} : {x.valor}</p>
                                                                        }
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className='col-12'>
                                                            <div className='row'>

                                                                <div className='col-6'>
                                                                    <label className=''>Comentarios de Factura</label>
                                                                    <textarea rows={2} className={`inputs__general`} value={article?.obs_factura} onChange={(e) => ChangeInputs('obs_factura', e.target.value, index)} placeholder='Factura' />
                                                                </div>
                                                                <div className='col-6'>
                                                                    <label className=''>Comentarios de Produccion</label>
                                                                    <textarea rows={2} className={`inputs__general`} value={article?.obs_produccion} onChange={(e) => ChangeInputs('obs_produccion', e.target.value, index)} placeholder='Producción' />
                                                                </div>
                                                            </div>
                                                        </div>
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
                                                <div className='tbody__container' key={index} style={{ zoom: '80%' }}>
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
                                                            <p>$0.00</p>
                                                        </div>
                                                        <div className='td'>
                                                            <p>$0.00</p>
                                                        </div>
                                                        <div className='td'>
                                                            <div className=''>
                                                                <p className='total-identifier'>$ {parseFloat(article.precio_total).toFixed(2)}</p>
                                                                <p className='total-identifier'>{article.total_franquicia != null && !Number.isNaN(article.total_franquicia) && permisosxVistaheader.length > 0 && checkPermissionHeader('totales_franquicia') ?
                                                                    <small style={{ color: 'red' }}>PF:${parseFloat(article.total_franquicia).toFixed(2)}</small> : ''}</p>
                                                            </div>
                                                        </div>

                                                        <div className='td urgency'>

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
                                                            <div className='see-icon' onClick={() => seeVerMas(index, 'personalized')}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                                                            </div>
                                                        </div>

                                                        {modalSalesOrder == 'sale-order__modal' ?
                                                            <div className='td'>
                                                                <div className='undo-icon' onClick={() => undoConcepts(article, index)}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-undo-2"><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" /></svg>
                                                                </div>
                                                            </div>
                                                            :
                                                            ''
                                                        }
                                                        <div className='col-12' title='Para modificar el concepto personalizado, haz clic en el botón azul de la derecha con el icono de cajitas'>
                                                            <div className='row'>

                                                                <div className='col-6'>
                                                                    <label className=''>Comentarios de Factura</label>
                                                                    <textarea rows={2} disabled={true} className={`inputs__general`} value={article?.comentarios_factura} onChange={(e) => ChangeInputsPers('comentarios_factura', e.target.value, index)} placeholder='Factura' />
                                                                </div>
                                                                <div className='col-6'>
                                                                    <label className=''>Comentarios de Produccion</label>
                                                                    <textarea rows={2} disabled={true} className={`inputs__general`} value={article?.comentarios_produccion} onChange={(e) => ChangeInputsPers('comentarios_produccion', e.target.value, index)} placeholder='Producción' />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col-12 card' style={{ marginLeft: '20px', backgroundColor: '#e2e2e2' }}>
                                                            <b>CONCEPTOS DENTRO DEL PERSONALIZADO</b>
                                                            {article?.conceptos?.map((x: any, indexConcept: number) => {
                                                                return (
                                                                    <>
                                                                        <div className='tbody__container card' key={indexConcept} style={{ backgroundColor: '#e2e2e2' }}>
                                                                            <div className='tbody'>
                                                                                <div className='td'>
                                                                                    <p className='folio-identifier'>{x.codigo}-{x.descripcion}</p>
                                                                                </div>
                                                                                <div className='td'>
                                                                                    <p className='amount-identifier'>{x.cantidad}</p>
                                                                                </div>
                                                                                <div className='td'>
                                                                                    <p>{x.name_unidad || x.unidad}</p>
                                                                                </div>
                                                                                <div className='td'>
                                                                                    <p className=''>$ {x.precio_unitario} <br />
                                                                                        {x.total_franquicia != null && !Number.isNaN(x.total_franquicia) && permisosxVistaheader.length > 0 && checkPermissionHeader('totales_franquicia') ?
                                                                                            <small className='total-identifier'>PUF: ${Number(x.total_franquicia / x.cantidad).toFixed(2)}</small> : ''}
                                                                                    </p>
                                                                                </div>
                                                                                <div className='td'>
                                                                                    {stateLoading ?
                                                                                        <span className="loader_simple"></span>
                                                                                        :
                                                                                        x.urgency ?
                                                                                            <div className='d-block'>
                                                                                                {checkPermission('cambiar_totales') ?
                                                                                                    <div className='d-flex'>
                                                                                                        <input type="number" disabled={true} className='mr-2 inputs__general' placeholder='Precio total' value={x.total} onChange={(e) => handlePriceChange(e, index)} />

                                                                                                    </div>
                                                                                                    :
                                                                                                    <p className='total-identifier'>$ {parseFloat(x.total).toFixed(2)}</p>
                                                                                                }
                                                                                                {x.total_franquicia != null && !Number.isNaN(x.total_franquicia) && permisosxVistaheader.length > 0 && checkPermissionHeader('totales_franquicia') ?
                                                                                                    <p className='mt-2 total-identifier'>
                                                                                                        <small>PF: ${parseFloat(x.total_franquicia).toFixed(2)}</small>
                                                                                                    </p>
                                                                                                    :
                                                                                                    ''
                                                                                                }


                                                                                            </div>
                                                                                            :
                                                                                            <div>
                                                                                                {checkPermission('cambiar_totales') ?
                                                                                                    <div>
                                                                                                        <input type="number" className='inputs__general' disabled={true} placeholder='Precio total' value={x.total} onChange={(e) => handlePriceChange(e, index)} />
                                                                                                    </div>
                                                                                                    :
                                                                                                    <p className='total-identifier'>$ {parseFloat(x.total).toFixed(2)}</p>}
                                                                                                <p className='mt-2 total-identifier'>{x.total_franquicia != null && !Number.isNaN(x.total_franquicia) && permisosxVistaheader.length > 0 && checkPermissionHeader('totales_franquicia') ?
                                                                                                    <small>PF: ${parseFloat(x.total_franquicia).toFixed(2)}</small> : ''}</p>
                                                                                            </div>


                                                                                    }
                                                                                    {x.descuento > 0 ?
                                                                                        <p style={{ color: 'green' }}>(-${parseFloat(x.descuento).toFixed(2)})</p>
                                                                                        : ''}
                                                                                </div>
                                                                                <div className='td'>
                                                                                    <p>{x.descuento}</p>
                                                                                </div>
                                                                                <div className='td'>
                                                                                    <p>$ {x.monto_urgencia}</p>
                                                                                    <p className='total-identifier'>$ {x.monto_urgencia_franquicia}</p>
                                                                                </div>
                                                                                <div className='td'>
                                                                                    <p>{x.total + x.monto_urgencia}</p>
                                                                                </div>
                                                                                <div className='td urgency'>
                                                                                    {modalSalesOrder == 'sale-order__modal' ?
                                                                                        x?.urgency ?
                                                                                            <div>
                                                                                                <div className='urgency-false-icon' title='Quitar urgencia' onClick={() => handleUrgencyChangeDentroPers(index, indexConcept)}>
                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-timer-off"><path d="M10 2h4" /><path d="M4.6 11a8 8 0 0 0 1.7 8.7 8 8 0 0 0 8.7 1.7" /><path d="M7.4 7.4a8 8 0 0 1 10.3 1 8 8 0 0 1 .9 10.2" /><path d="m2 2 20 20" /><path d="M12 12v-2" /></svg>
                                                                                                </div>
                                                                                            </div>
                                                                                            :
                                                                                            <div>
                                                                                                <div className='urgency-true-icon' title='Agregar urgencia' onClick={() => handleUrgencyChangeDentroPers(index, indexConcept)}>
                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-timer"><line x1="10" x2="14" y1="2" y2="2" /><line x1="12" x2="15" y1="14" y2="11" /><circle cx="12" cy="14" r="8" /></svg>
                                                                                                </div>
                                                                                            </div>
                                                                                        :
                                                                                        ''
                                                                                    }
                                                                                </div>
                                                                                <div className='td'>
                                                                                    <div className='see-icon' onClick={() => seeVerMas(index, 'normal')} title='Ver mas campos'>
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
                                                                                        <select className="traditional__selector" value={x.id_area_produccion} onChange={(event) => handleAreasChangeDentroPers(event, index, indexConcept)}>
                                                                                            {x?.areas_produccion?.map((item: any) => (
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
                                                                                                checked={x.enviar_a_produccion}
                                                                                                onChange={() => handleStatusChangeDentroPers(x.enviar_a_produccion, index, indexConcept)} disabled={x.status == !0} />
                                                                                            <span className="slider"></span>
                                                                                        </label>
                                                                                    </div>
                                                                                </div>

                                                                                {modalSalesOrder == 'sale-order__modal' ?
                                                                                    ''
                                                                                    :
                                                                                    x.status == 0 ?
                                                                                        <div className='cancel-icon' onClick={() => canceleStatus(x)} title='Cancelar concepto'>
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ban"><circle cx="12" cy="12" r="10" /><path d="m4.9 4.9 14.2 14.2" /></svg>
                                                                                        </div>
                                                                                        :
                                                                                        ""
                                                                                }
                                                                                {(permisosxVista.some((x: any) => x.titulo === 'entregado_cliente_enviado_sucursal') &&
                                                                                    modalSalesOrder === 'sale-order__modal-update') && (
                                                                                        <div className='td branch'>
                                                                                            <div>
                                                                                                <div className=''>
                                                                                                    <label>Recibido Sucursal</label>
                                                                                                </div>
                                                                                                <label className="switch">
                                                                                                    <input
                                                                                                        type="checkbox"
                                                                                                        disabled={x.check_recibido_sucursal}
                                                                                                        checked={x.check_recibido_sucursal}
                                                                                                        onChange={() => handleBranchChangeDentroPers(x.check_recibido_sucursal, index, indexConcept)}
                                                                                                    />
                                                                                                    <span className="slider"></span>
                                                                                                </label>
                                                                                            </div>
                                                                                        </div>
                                                                                    )}

                                                                                {permisosxVista.some((x: any) => x.titulo === 'entregado_cliente_enviado_sucursal') && (
                                                                                    modalSalesOrder === 'sale-order__modal-update' && (
                                                                                        <div className='td customer'>
                                                                                            <div>
                                                                                                <div>
                                                                                                    <label>Entregado Cliente</label>
                                                                                                </div>
                                                                                                <label className="switch">
                                                                                                    <input
                                                                                                        type="checkbox"
                                                                                                        disabled={x.check_entregado_cliente}
                                                                                                        checked={x.check_entregado_cliente}
                                                                                                        onChange={() => handleCustomerChangeDentroPers(x.check_entregado_cliente, index, indexConcept)} />
                                                                                                    <span className="slider"></span>
                                                                                                </label>
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                )}

                                                                                {x.status == 0 ?
                                                                                    <div>
                                                                                        {modalSalesOrder == 'sale-order__modal-update' && saleOrdersToUpdate.status != 1 ?
                                                                                            <div className='td'>
                                                                                                <button type='button' className='btn__general-purple' onClick={() => updateSaleOrderConcept(x)}>Actualizar</button>
                                                                                            </div>
                                                                                            :
                                                                                            ""
                                                                                        }
                                                                                    </div>
                                                                                    :
                                                                                    ''
                                                                                }
                                                                                {x.status == 1 ?
                                                                                    <div className="td">
                                                                                        <p className='cancel-identifier'>Cancelado</p>
                                                                                    </div>
                                                                                    :
                                                                                    ""
                                                                                }
                                                                                {x.status_produccion == 3 ?
                                                                                    <div className="td" title='El concepto ya fue enviado a sucursal por producción'>
                                                                                        <b className='parpadeo' style={{ color: '#2674bb', fontSize: '14px' }}>Enviado A Sucursal</b>
                                                                                    </div>
                                                                                    :
                                                                                    ""
                                                                                }
                                                                                {x.status == 2 ?
                                                                                    <div className="td">
                                                                                        <p>Cancelar</p>
                                                                                    </div>
                                                                                    :
                                                                                    ""
                                                                                }
                                                                                {/* <br /> */}
                                                                                <div className='col-12' style={{ border: '1px solid #ccc ', padding: '5px', margin: '5px' }}>
                                                                                    <div className='row'>
                                                                                        {x.campos_plantilla.map((x: any) => (
                                                                                            <div className='col-2'>
                                                                                                {x.considerado_total ?
                                                                                                    <p><b>{x.nombre_campo_plantilla} : {x.valor}</b></p>
                                                                                                    :
                                                                                                    <p>{x.nombre_campo_plantilla} : {x.valor}</p>
                                                                                                }
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                                <div className='col-12'>
                                                                                    <div className='row'>

                                                                                        <div className='col-6'>
                                                                                            <label className=''>Comentarios de Factura</label>
                                                                                            <textarea rows={2} className={`inputs__general`} value={x?.obs_factura} onChange={(e) => ChangeInputsDentrodePers('obs_factura', e.target.value, index, indexConcept)} placeholder='Factura' />
                                                                                        </div>
                                                                                        <div className='col-6'>
                                                                                            <label className=''>Comentarios de Produccion</label>
                                                                                            <textarea rows={2} className={`inputs__general`} value={x?.obs_produccion} onChange={(e) => ChangeInputsDentrodePers('obs_produccion', e.target.value, index, indexConcept)} placeholder='Producción' />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                        </div>

                                                                    </>
                                                                )
                                                            })}
                                                        </div>
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

                    </div>

                    <div className=' row__two mt-4 '>
                        <div className='btns'>
                            <div className='subtotal'>
                                {stateLoading ?
                                    <span className="loader_simple"></span>
                                    :
                                    <div>
                                        <p className='name'>Subtotal</p>
                                        <p className='value'>$ {amount}</p>
                                    </div>
                                }
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
                <ArticleViewModal />
                <Personalized idItem={idItem} indexItem={indexItem} />
                {/* <SeeCamposPlantillas typeConcept={typeConcept} /> */}
                <Binnacle />
                <ModalProduction />

            </div>
        </div>

    )
}

export default ModalSalesOrder
