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


    const setNormalConcepts = storePersonalized((state) => state.setNormalConcepts);

    const setConceptView = storePersonalized((state) => state.setConceptView);
    const setCustomConceptView = storePersonalized((state) => state.setCustomConceptView);

    const setCustomLocal = storePersonalized((state) => state.setCustomLocal);

    const setPersonalizedModal = storePersonalized((state) => state.setPersonalizedModal);
    const setDeleteNormalConcepts = storePersonalized(state => state.setDeleteNormalConcepts)


    const setModalArticleView = storeArticleView(state => state.setModalArticleView)
    const selectedIds: any = useSelectStore((state) => state.selectedIds);
    const { normalConcepts, deleteNormalConcepts, customConcepts, conceptView, identifier, personalized }: any = useStore(storePersonalized)

    const setSelectedIds = useSelectStore((state) => state.setSelectedId);

    const setPersonalized = storePersonalized((state) => state.setPersonalized);

    const setCustomData = storePersonalized((state) => state.setCustomData);



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



        const [datePartOne, timePartOne] = dates[0].split(" ");
        const [datePartTwo, timePartTwo] = dates[1].split(" ");
        normalConcepts.forEach((element: any) => {
            element.unidad = element.id_unidad
            element.total = element.precio_total
            element.monto_descuento = element.descuento== null ? 0: element.descuento
            element.urgencia = element.monto_urgencia
            element.campos_plantilla.forEach((cp: any) => {
                cp.valor = cp.valor.toString()
            });
        });

        if (customConcepts.length > 0) {
            customConcepts?.forEach((element: any) => {
                element.id = 0
                element.conceptos.forEach((x: any) => {
                    x.unidad = x.id_unidad
                    x.total = x.precio_total
                    x.urgencia = x.monto_urgencia
                    x.monto_descuento = x.descuento== null ? 0: x.descuento
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
            id_cotizacion_relacionada: idCotizacion,
            hora_entrega_produccion: timePartOne,
            fecha_entrega_produccion: datePartOne,
            hora_entrega_cliente: timePartTwo,
            fecha_entrega_cliente: datePartTwo,
            conceptos: normalConcepts,
            conceptos_pers: customConcepts,
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



    const deleteArticle = (item: any) => {
        const filter = normalConcepts.filter((x: any) => x.id_identifier !== item.id_identifier)
        const filterConceptView = conceptView.filter((x: any) => x.id_identifier !== item.id_identifier) 
        setNormalConcepts(filter);
        setConceptView(filterConceptView)
        setCustomData(filter);
        if(item.id) {
            
        } else {
            setDeleteNormalConcepts([...normalConcepts, item.id])
        }
       
    }

    const SaleOrderStatus = () => {
        Swal.fire({
            title: "Seguro que deseas cancelar la Orden de Venta?",
            text: "Se desapartará el material apartado, está acción no se puede deshacer",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            denyButtonText: `Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                await APIs.CreateAnyPut({}, "cancelar_orden_venta/" + saleOrdersToUpdate.id)
                    .then(async (response: any) => {
                        if (response.error) {

                        } else {
                            Swal.fire('Notificación', response.mensaje, 'success');
                            setModalSalesOrder('')

                        }
                    })
            }
        });

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
            await APIs.createSaleOrderProduction(data)
        } catch (error) {

        }
    }


    const handleAreasChange = (event: any, i: number) => {
        const value = parseInt(event.target.value, 10);
        const updatedDataUpdate = conceptView.map((x: any, index :any) => {
            if (index === i) {
              return { ...x, id_area_produccion: value };
            }
            return x;
        });

        const updatedNormalConcepts = normalConcepts.map((x: any, index :any) => {
            if (index === i) {
              return { ...x, id_area_produccion: value };
            }
            return x;
        });
        setConceptView(updatedDataUpdate)
        setNormalConcepts(updatedNormalConcepts)
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

    // const handleObsBillChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
    //     const value = e.target.value.trim();
    //     const newConcept = [...normalConcepts];
    //     newConcept[index].obs_factura = value;
    //     setNormalConcepts(newConcept);
    // };

    // const handleObsProductionChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
    //     const value = e.target.value.trim();
    //     const newConcept = [...normalConcepts];
    //     newConcept[index].obs_produccion = value;
    //     setNormalConcepts(newConcept);
    // };

    const handleStatusChange = (status: number, index: number) => {
        const newStatus = !status;
        console.log(index);
        const updatedConcepts = [...normalConcepts];
        const updatedConceptsView = [...conceptView];
        updatedConcepts[index].enviar_a_produccion = newStatus;
        updatedConceptsView[index].enviar_a_produccion = newStatus;
        setNormalConcepts(updatedConceptsView);
        setNormalConcepts(updatedConcepts);
      };

    console.log(conceptView)


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
    const [subtotalf, setSubtotalf] = useState<number>(0)
    const [urgenciaf] = useState<number>(0)
    const [totalf, setTotalf] = useState<number>(0)
    useEffect(() => {
        calcular_totales()
        calcular_tiempos_entrega()
    }, [normalConcepts, customConcepts])
    const calcular_totales = () => {

        const precios = normalConcepts.reduce(
            (acc: any, item: any) => ({
                precio_unitario: acc.precio_unitario + (parseFloat(item.precio_unitario) || 0),
                descuento: acc.descuento + (parseFloat(item.descuento) || 0),
                monto_urgencia: acc.monto_urgencia + (parseFloat(item.monto_urgencia) || 0),
                total: acc.total + (parseFloat(item.precio_total) || 0),
                total_franquicia: acc.total_franquicia + (parseFloat(item.total_franquicia) || 0),
            }),
            { precio_unitario: 0, descuento: 0, monto_urgencia: 0, total: 0, total_franquicia: 0 }
        );
        const preciospers = customConcepts.reduce(
            (acc: any, item: any) => ({
                precio_unitario: acc.precio_unitario + (parseFloat(item.precio_unitario) || 0),
                descuento: acc.descuento + (parseFloat(item.descuento) || 0),
                monto_urgencia: acc.monto_urgencia + (parseFloat(item.monto_urgencia) || 0),
                total: acc.total + (parseFloat(item.precio_total) || 0),
                total_franquicia: acc.total_franquicia + (parseFloat(item.total_franquicia) || 0),
            }),
            { precio_unitario: 0, descuento: 0, monto_urgencia: 0, total: 0, total_franquicia: 0 }
        );
        setAmount(preciospers.total + preciospers.descuento - preciospers.monto_urgencia + precios.total + precios.descuento - precios.monto_urgencia);
        setdDiscount(preciospers.descuento + precios.descuento);
        setdUrgency(preciospers.monto_urgencia + precios.monto_urgencia);
        setdTotalGeneral(preciospers.total + precios.total);

        setSubtotalf(preciospers.total_franquicia + precios.total_franquicia);
        setTotalf(preciospers.total_franquicia + precios.total_franquicia);

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
            setSelectedIds('clients', saleOrdersToUpdate.id_cliente)
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
            id_sucursal: saleOrdersToUpdate.id_sucursal || branchOffices.id,
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
        setPersonalized(newConcept);
        (newConcept);

    };
    const updateOrdenVenta = async () => {
        const [datePartOne, timePartOne] = dates[0].split(" ");
        const [datePartTwo, timePartTwo] = dates[1].split(" ");
        let data = {
            id: saleOrdersToUpdate.id,
            id_sucursal: branchOffices.id,
            id_usuario_crea: saleOrdersToUpdate.id_usuario_crea,
            id_cliente: selectedIds.clients.id || saleOrdersToUpdate.id_cliente,
            titulo: title,
            hora_entrega_produccion: timePartOne,
            fecha_entrega_produccion: datePartOne,
            hora_entrega_cliente: timePartTwo,
            fecha_entrega_cliente: datePartTwo,

        }
        await APIs.CreateAny(data, "update_ov_gral")
            .then(async (response: any) => {
                if (response.error) {
                    Swal.fire('Notificación', response.mensaje, 'info');
                } else {
                    Swal.fire('Notificación', response.mensaje, 'success');
                }
            })
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

    const [idItem, setIdItem] = useState<any>()
    const [indexItem, setIndexItem] = useState<any>()

    const updateConceptSaleOrder = (concept: any, index: number) => {
        setPersonalizedModal('personalized_modal-sale-update')
        console.log('concept', concept)
        setIdItem(concept);
        setIndexItem(index)
        console.log(concept)
        // Obtener el valor actual del identificador
        // const currentIdentifier = storePersonalized.getState().identifier;
        // let newIdentifier = currentIdentifier;

        // // Asignar identificadores únicos a cada concepto
        // concept.conceptos.forEach((element: any) => {
        //     element.check = true;
        //     element.id_identifier = ++newIdentifier; // Incrementar y asignar
        // });

        // // Actualizar el identificador global al último valor utilizado
        // storePersonalized.setState({ identifier: newIdentifier });

        // Actualizar vistas con los conceptos personalizados
        setCustomConceptView([...concept.conceptos]);
        setCustomLocal(concept.conceptos);

    }

    const undoConcepts = (concept: any) => {
        // Primero, modificamos los conceptos
        const updatedConcepts = concept.conceptos.map((element: any) => {
            element.id_pers = 0;
            element.id_identifier += identifier + 1;
            return element;
        });

        // Actualizar el estado de normalConcepts
        setNormalConcepts([...normalConcepts, ...updatedConcepts]);
        console.log('updatedConcepts', updatedConcepts)

        // Filtrar y actualizar conceptView para eliminar los conceptos con el id_identifier especificado
        const deleteItem = conceptView.filter((x: any) => x.id_identifier !== concept.id_identifier);
        setConceptView([...deleteItem, ...concept.conceptos]);
        concept.conceptos.forEach((element: any) => {
            element.check = false
        });
        setCustomConceptView([...deleteItem, ...concept.conceptos])


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
                                            <p>Fecha de entrega produccion</p>
                                            <p className='mx-4'>{dataProduction?.fecha_produccion}</p>
                                            <p>Hora de produccion</p>
                                            <p className='mx-4'>{dataProduction?.fecha_produccion}</p>
                                        </div>
                                    </div>
                                    <div className='d-flex justify-content-center mt-3'>
                                        <button className='btn__general-purple' onClick={sendProduction} >Mandar a producción </button>
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
                                <div className='col-5 md-col-12'>
                                    <span className='text'>Creado por: <b>{saleOrdersToUpdate.usuario_crea}</b></span><br />
                                    <span className='text'>Fecha de Creación: <b>{saleOrdersToUpdate.fecha_creacion}</b></span><br />
                                    {saleOrdersToUpdate.status === 0 ? (
                                        <b className="active-status" style={{ color: 'green' }}>Activo</b>
                                    ) : saleOrdersToUpdate.status === 1 ? (
                                        <b className="canceled-status" style={{ color: 'red' }}>Cancelada</b>
                                    ) : (
                                        saleOrdersToUpdate.status === 2 ? (
                                            <b className="end-status" style={{ color: 'yellow' }}>Pendiente</b>
                                        ) : (
                                            ""
                                        )
                                    )}
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
                                                    <div className='tbody__container'>
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
                                        <Empresas_Sucursales modeUpdate={false} empresaDyn={companies} setEmpresaDyn={setCompanies} sucursalDyn={branchOffices} setSucursalDyn={setBranchOffices} />
                                        :
                                        <Empresas_Sucursales modeUpdate={true} empresaDyn={companies} setEmpresaDyn={setCompanies} sucursalDyn={branchOffices} setSucursalDyn={setBranchOffices} />
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
                        <div className='row my-4'>
                            <div className='col-12 d-flex align-items-center justify-content-between'>
                                <p className='title__concepts'>Conceptos</p>
                                <div className='d-flex align-items-center'>
                                    <div className='mx-4'>
                                        {urgenciaG ?
                                            <button type='button' className='btn__general-success mr-4' onClick={() => urgenciaGlobal(false)}>Remover Urgencias</button>
                                            :
                                            <button type='button' className='btn__general-orange mr-4' onClick={() => urgenciaGlobal(true)}>Agregar Urgencia a Orden</button>
                                        }
                                        <button type='button' className='btn__general-purple' onClick={() => setPersonalizedModal('personalized_modal-sale')}>Personalizados</button>
                                    </div>
                                    <div className='btn__search__articles'>
                                        <svg xmlns="http://www.w3.org/2000/svg" onClick={() => setModalArticleView('article-view__modal')} width="30" height="30" viewBox="0 0 24 24" fill="none" stroke-width="1.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package-search"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" /><path d="m7.5 4.27 9 5.15" /><polyline points="3.29 7 12 12 20.71 7" /><line x1="12" x2="12" y1="22" y2="12" /><circle cx="18.5" cy="15.5" r="2.5" /><path d="M20.27 17.27 22 19" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='table__sales_modal'>
                            {conceptView ? (
                                <div className='table__numbers'>
                                    <p className='text'>Total de ordenes</p>
                                    <div className='quantities_tables'>{conceptView.length}</div>
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
                            {conceptView ? (
                                <div className='table__body'>
                                    {conceptView?.map((article: any, index: number) => {
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
                                                                <small style={{ color: 'red' }}>PUF:${Number(article.total_franquicia / article.cantidad).toFixed(2)}</small></p>
                                                        </div>
                                                        <div className='td'>
                                                            <div className=''>
                                                                <p className='total-identifier'>$ {parseFloat(article.precio_total).toFixed(2)}</p>
                                                                <p className='total-identifier'>{article.total_franquicia != null && !Number.isNaN(article.total_franquicia) ?
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
                                                                ''
                                                            }
                                                        </div>
                                                        <div className='td'>
                                                            <div className='see-icon' onClick={() => seeVerMas(index)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                                                            </div>
                                                        </div>


                                                        {/* {modalSalesOrder == 'sale-order__modal-update' ?
                                                            <div className='td'>
                                                                <button type='button' className='btn__general-purple' onClick={() => updateSaleOrderConcept(article)}>Actualizar</button>
                                                            </div>
                                                            :
                                                            ""
                                                        } */}
                                                        <div className='td'>
                                                            <div className='undo-icon' onClick={() => undoConcepts(article)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-undo-2"><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" /></svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    :
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
                                                            <p className=''>$ {article.precio_unitario.toFixed(2)} <br />
                                                                {article.total_franquicia != null && !Number.isNaN(article.total_franquicia) ?
                                                                    <small >PUF: ${Number(article.total_franquicia / article.cantidad).toFixed(2)}</small> : ''}
                                                            </p>
                                                        </div>
                                                        <div className='td'>

                                                            {article.urgency ?
                                                                <div className='d-flex'>
                                                                    <div>
                                                                        <p className='total-identifier'>$ {parseFloat(article.precio_total).toFixed(2)}</p>
                                                                        <p className='total-identifier'>{article.total_franquicia != null && !Number.isNaN(article.total_franquicia) ?
                                                                            <small>PF: ${parseFloat(article.total_franquicia).toFixed(2)}</small> : ''}</p>
                                                                    </div>
                                                                </div>
                                                                :
                                                                <div>
                                                                    <p className='total-identifier'>$ {parseFloat(article.precio_total).toFixed(2)}</p>
                                                                    <p className='total-identifier mt-2'>{article.total_franquicia != null && !Number.isNaN(article.total_franquicia) ?
                                                                        <small>PF: ${parseFloat(article.total_franquicia).toFixed(2)}</small> : ''}</p>
                                                                </div>

                                                            }
                                                            {article.descuento > 0 ?
                                                                <p style={{ color: 'green' }}>(-${parseFloat(article.descuento).toFixed(2)})</p>
                                                                : ''}
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
                                                            {saleOrdersToUpdate.status != 1 ?
                                                                <div className='cancel-icon' onClick={() => deleteArticle(article)} title='Cancelar concepto'>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ban"><circle cx="12" cy="12" r="10" /><path d="m4.9 4.9 14.2 14.2" /></svg>
                                                                </div>

                                                                :
                                                                ''}
                                                        </div>
                                                        <div className='td'>
                                                            <div className='see-icon' onClick={() => seeVerMas(index)} title='Ver mas campos'>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                                                            </div>
                                                        </div>
                                                        <div className='td'>
                                                            <div className='delete-icon' onClick={() => deleteArticle(article)} title='Eliminar concepto'>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                            </div>
                                                        </div>
                                                        <div className='td'>
                                                            <div className='send-areas'>
                                                                <div>
                                                                    <label>Area</label>
                                                                </div>
                                                                <select className="traditional__selector" value={article.id_area_produccion} onChange={(event) => handleAreasChange(event, index)}>
                                                                    {article?.areas_produccion?.map((item: any) => (
                                                                        <option key={item.id} value={item.id_area}>
                                                                            {item.nombre_area}
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
                                                                        onChange={() => handleStatusChange(article.enviar_a_produccion, index)} />
                                                                    <span className="slider"></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        {modalSalesOrder == 'sale-order__modal-update' && saleOrdersToUpdate.status != 1 ?
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
                        <div className='btns mt-1'>
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
                    </div>

                    {modalSalesOrder !== '' ?
                        <div className='d-flex justify-content-center mt-3'>
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

            </div>
        </div>

    )
}

export default ModalSalesOrder
