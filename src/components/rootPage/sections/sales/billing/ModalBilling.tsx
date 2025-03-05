import React, { useState, useEffect } from 'react'
import { storeArticles } from '../../../../../zustand/Articles'
import { useStore } from 'zustand'
import Empresas_Sucursales from '../../../Dynamic_Components/Empresas_Sucursales'
import Select from '../../../Dynamic_Components/Select'
import useUserStore from '../../../../../zustand/General'
import { usersRequests } from '../../../../../fuctions/Users'
import { saleOrdersRequests } from '../../../../../fuctions/SaleOrders'
import { seriesRequests } from '../../../../../fuctions/Series'
import { useSelectStore } from '../../../../../zustand/Select'
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import { storeModals } from '../../../../../zustand/Modals'
import Flatpickr from "react-flatpickr";
import Division from './Division'
import './ModalBilling.css'
import { storeBilling } from '../../../../../zustand/Billing'
import { Toaster } from 'sonner'
import Personalized from '../Personalized'
import { storePersonalized } from '../../../../../zustand/Personalized'
import divisas from './json/divisas.json'
import metodoPago from './json/paymentMethods.json'
import APIs from '../../../../../services/services/APIs'
import Swal from 'sweetalert2'
import DynamicVariables from '../../../../../utils/DynamicVariables'


const ModalBilling: React.FC = () => {
    // const [factura, setFactura] = useState<any>({
    //     id: 0,
    //     id_folio: 0,
    //     id_sucursal: 0,
    //     id_cliente: 0,
    //     subtotal: 0,
    //     urgencia: 0,
    //     descuento: 0,
    //     total: 0,
    //     divisa: 0,
    //     cfdi: 0,
    //     condiciones_pago: 0,
    //     forma_pago: 0,
    //     metodo_pago: 0,
    //     id_usuario_crea: 0,
    //     fecha_creacion: '',
    //     status: 0,
    //     titulo: '',
    //     conceptos: [],
    //     ovs_enlazadas: [],
    //     conceptos_elim: []
    // })
    const setSubModal = storeArticles(state => state.setSubModal)
    const setNormalConcepts = storePersonalized((state) => state.setNormalConcepts);

    const setCustomConceptView = storePersonalized((state) => state.setCustomConceptView);
    const setCustomConcepts = storePersonalized((state) => state.setCustomConcepts);
    const setDeleteCustomConcepts = storePersonalized((state) => state.setDeleteCustomConcepts);
    const setNormalConceptsView = storePersonalized((state) => state.setNormalConceptsView);


    const setCustomLocal = storePersonalized(state => state.setCustomLocal)

    const setConceptView = storePersonalized((state) => state.setConceptView);

    const setPersonalizedModal = storePersonalized((state) => state.setPersonalizedModal);
    const { normalConcepts, deleteNormalConcepts, customConcepts, customConceptView, deleteCustomConcepts, conceptView, identifier }: any = useStore(storePersonalized)

    const { subModal }: any = useStore(storeArticles)
    const { conceptsBack }: any = storeBilling()
    const setIdentifier = storePersonalized(state => state.setIdentifier)

    const setConceptsBack = storeBilling(state => state.setConceptsBack)
    const setConcepts = storeBilling(state => state.setConcepts)

    const { concepts }: any = useStore(storeBilling)

    const setModalSub = storeModals(state => state.setModalSub)

    const setDivision = storeBilling(state => state.setDivision)

    const setDataBillign = storeBilling(state => state.setDataBillign)
    const setModoUpdate = storeBilling(state => state.setModoUpdate)

    const userState = useUserStore(state => state.user);
    const user_id = userState.id

    // Usuarios
    const { getUsers }: any = usersRequests()
    const [users, setUsers] = useState<any>()
    const [usersFilter, setUsersFilter] = useState<any>()

    const { getSaleOrders }: any = saleOrdersRequests()
    const [saleOrders, setSaleOrders] = useState<any>([])

    const { getSeriesXUser }: any = seriesRequests()
    const [series, setSeries] = useState<any>([])



    const { dataBillign, DataUpdate, modoUpdate }: any = useStore(storeBilling)


    // Empresas sucursales
    const [companies, setCompanies] = useState<any>([])

    const [companiesFilter, setCompaniesFilter] = useState<any>([])

    const [branchOffices, setBranchOffices] = useState<any>([])

    const [branchOfficesFilter, setBranchOfficesFilter] = useState<any>([])

    const [fol, setFol] = useState<any>(0)

    const selectedIds: any = useSelectStore((state) => state.selectedIds);

    const setSelectedIds = useSelectStore((state) => state.setSelectedId);

    const [client, setClient] = useState<any>('')

    const [totals, setTotals] = useState({
        subtotal: 0,
        urgencia: 0,
        descuento: 0,
        total: 0,
    })
    const [totalsc] = useState({
        subtotal: 0,
        urgencia: 0,
        descuento: 0,
        total: 0,
    })

    const getRefs = async () => {
        let uc: any = await APIs.GetAny("getUsoCfdi")
        let fp: any = await APIs.GetAny("getFormaPago")
        let cp: any = await APIs.GetAny("getCondPago")
        uc = uc.map((item: any) => ({ ...item, id: item.ID }));
        fp = fp.map((item: any) => ({ ...item, id: item.ID }));
        cp = cp.map((item: any) => ({ ...item, id: item.ID }));

        setCfdi({
            selectName: 'CFDi Receptor',
            options: 'Value',
            dataSelect: uc
        })
        setPaymentConditions({
            selectName: 'Condiciónes Pagos',
            options: 'Value',
            dataSelect: fp
        })
        setMethodPayment({
            selectName: 'Formas de Pago',
            options: 'Value',
            dataSelect: cp
        })
        setSelectedIds('paymentConditions', cp[0])
        setSelectedIds('methodPayment', fp[0])
        setSelectedIds('paymentMethod', metodoPago.currencies[0])
        setSelectedIds('cfdi', uc[0])
        setSelectedIds('foreignExchange', { id: 0 })
        // let res: any = await APIs.GetAny("getRegimenFiscal")

    }

    //////////////////////////
    //////// Fechas//////////
    ////////////////////////



    const hoy = new Date();
    const haceUnaSemana = new Date();
    haceUnaSemana.setDate(hoy.getDate() - 7);

    // Inicializa el estado con las fechas formateadas
    const [date, setDate] = useState([
        haceUnaSemana.toISOString().split('T')[0],
        hoy.toISOString().split('T')[0]
    ]);

    const handleDateChange = (fechasSeleccionadas: any) => {
        if (fechasSeleccionadas.length === 2) {
            setDate(fechasSeleccionadas.map((fecha: any) => fecha.toISOString().split('T')[0]));
        } else {
            setDate([fechasSeleccionadas[0]?.toISOString().split('T')[0] || "", ""]);
        }
    };

    const [foreignExchange, setForeignExchange] = useState<any>()
    const [paymentMethod, setPaymentMethod] = useState<any>()
    const [paymentConditions, setPaymentConditions] = useState<any>()
    const [methodPayment, setMethodPayment] = useState<any>()
    const [cfdi, setCfdi] = useState<any>()

    const fetch = async () => {

        // let dataSaleOrders = {
        //     folio: fol,
        //     id_sucursal: branchOffices.id,
        //     id_serie: selectedIds?.series.id,
        //     id_cliente: client,
        //     desde: date[0],
        //     hasta: date[1],
        //     id_usuario: user_id,
        //     id_vendedor: selectedIds?.users.id,
        //     status: 0
        // }

        // let result = await getSaleOrders(dataSaleOrders)
        // setSaleOrders(result)

        const data = {
            nombre: '',
            id_usuario: user_id,
            id_usuario_consulta: user_id,
            light: true,
            id_sucursal: 0
        }

        setForeignExchange({
            selectName: 'Divisas',
            options: 'name',
            dataSelect: divisas.currencies
        })


        const resultUsers = await getUsers(data)
        setUsers({
            selectName: 'Vendedor',
            options: 'nombre',
            dataSelect: resultUsers
        })
        setSelectedIds('vendedores', resultUsers[0].id)
        setUsersFilter({
            selectName: 'Vendedores',
            options: 'nombre',
            dataSelect: resultUsers
        })
        setPaymentMethod({
            selectName: 'Métodos Pagos',
            options: 'name',
            dataSelect: metodoPago.currencies
        })
        if (type == 1) {
            getSeriesXUser({ tipo_ducumento: 7, id: user_id }).then(async (resultSeries: any) => {
                resultSeries.unshift({ nombre: 'Todos', id: 0 });
                setSeries({
                    selectName: 'Series',
                    options: 'nombre',
                    dataSelect: resultSeries
                })
            })
        } else {
            getSeriesXUser({ tipo_ducumento: 10, id: user_id }).then(async (resultSeries: any) => {
                resultSeries.unshift({ nombre: 'Todos', id: 0 });
                setSeries({
                    selectName: 'Series',
                    options: 'nombre',
                    dataSelect: resultSeries
                })
            })
        }

        await getRefs()


    }
    const [type, setType] = useState<any>(1)

    useEffect(() => {
        fetch()
    }, [])
    useEffect(() => {
        if (type == 1) {
            getSeriesXUser({ tipo_ducumento: 7, id: user_id }).then(async (resultSeries: any) => {
                resultSeries.unshift({ nombre: 'Todos', id: 0 });
                setSeries({
                    selectName: 'Series',
                    options: 'nombre',
                    dataSelect: resultSeries
                })
            })
        } else {
            getSeriesXUser({ tipo_ducumento: 10, id: user_id }).then(async (resultSeries: any) => {
                resultSeries.unshift({ nombre: 'Todos', id: 0 });
                setSeries({
                    selectName: 'Series',
                    options: 'nombre',
                    dataSelect: resultSeries
                })
            })
        }
    }, [type])
    useEffect(() => {
        setConcepts([])
        setConceptView([])
        setTotals(totalsc)

        if (modoUpdate) {
            console.log(DataUpdate.conceptos);

            setTitle(DataUpdate.titulo)
            setType(DataUpdate.tipo)
            setSelectedIds('vendedores', DataUpdate.id_vendedor)
            setClient(DataUpdate.razon_social)
            searchClient()
            DataUpdate.conceptos.forEach((el: any) => {
                DynamicVariables.updateAnyVar(setTotals, "subtotal", totals.subtotal + parseFloat(el.total))
                DynamicVariables.updateAnyVar(setTotals, "total", totals.subtotal + parseFloat(el.total))
            });
            setConcepts([...concepts, ...DataUpdate.conceptos]);
        }
    }, [modoUpdate, subModal])
    const search = async () => {
        if (type == 2) {
            const data = {
                id: 0,
                id_usuario: user_id,
                id_sucursal: branchOfficesFilter.id,
                desde: date[0],
                hasta: date[1],
                id_serie: selectedIds?.series?.id,
                status: 0,
                folio: fol
            }

            const result = await APIs.CreateAny(data, "pedido_franquicia/get")
            setSaleOrders(result)
        } else {
            const dataSaleOrders = {
                folio: fol,
                id_sucursal: branchOfficesFilter.id,
                id_serie: selectedIds?.series?.id,
                id_cliente: client,
                desde: date[0],
                hasta: date[1],
                id_usuario: user_id,
                id_vendedor: selectedIds?.users?.id,
                status: 0,
                factura: true
            }

            const result = await getSaleOrders(dataSaleOrders)
            setSaleOrders(result)
        }

        // console.log(result)
    }


    const handleCreateInvoice = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        const obs: any = [];
        if (title == undefined || title?.length < 1) {
            Swal.fire('Notificacion', 'Ingresa un titulo para continuar', 'info')
            return
        }
        if (selectedIds?.customers == undefined) {
            Swal.fire('Notificacion', 'Selecciona un cliente para continuar', 'info')
            return
        }
        if (selectedIds?.foreignExchange == undefined) {
            Swal.fire('Notificacion', 'Selecciona un tipo de cambio', 'info')
            return
        }
        if (selectedIds?.paymentMethod == undefined) {
            Swal.fire('Notificacion', 'Selecciona un metodo de pago', 'info')
            return
        }
        if (selectedIds?.paymentConditions == undefined) {
            Swal.fire('Notificacion', 'Selecciona una condición de pago', 'info')
            return
        }
        if (selectedIds?.methodPayment == undefined) {
            Swal.fire('Notificacion', 'Selecciona una forma de pago', 'info')
            return
        }
        if (selectedIds?.cfdi == undefined) {
            Swal.fire('Notificacion', 'Selecciona un uso de CFDI', 'info')
            return
        }
        for (const element of normalConcepts) {
            element.precio_unitario = element.order == null ? element.precio_unitario : element.total_restante / element.cantidad;
            element.orden = null
            element.produccion_interna = false
            element.enviar_a_produccion = false
            element.campos_plantilla = []
            const filter = obs.filter((x: any) => x === element.id_ov);
            if (filter.length === 0) {
                obs.push(element.id_ov);
            }
        }
        // let filter = normalConcepts
        if (modoUpdate) {
            // filter = normalConcepts.filter((x: any) => x.id_concepto_comercial == undefined)
        }
        const data = {
            id: modoUpdate ? DataUpdate.id : 0,
            id_sucursal: modoUpdate ? DataUpdate.id_sucursal : branchOffices.id,
            id_cliente: selectedIds?.customers.id,
            subtotal: totals.subtotal,
            urgencia: totals.urgencia,
            descuento: totals.descuento,
            tipo: type,
            total: totals.total,
            divisa: selectedIds?.foreignExchange.id,
            cfdi: selectedIds?.cfdi?.ID || selectedIds?.cfdi?.id,
            condiciones_pago: selectedIds?.paymentConditions.ID || selectedIds?.paymentConditions.id,
            forma_pago: selectedIds?.methodPayment.ID || selectedIds?.methodPayment.id,
            metodo_pago: selectedIds?.paymentMethod.ID || selectedIds?.paymentMethod.id,
            id_usuario_crea: user_id,
            id_vendedor: selectedIds?.vendedores?.id ?? selectedIds?.vendedores,
            titulo: title,
            conceptos: normalConcepts,
            conceptos_pers: customConcepts,
            conceptos_elim: deleteNormalConcepts,
            conceptos_pers_elim: deleteCustomConcepts
        };
        console.log(normalConcepts);
        // return
        if (!modoUpdate) {
            Swal.fire({
                icon: 'warning',
                title: "Desea crear la factura con los datos seleccionados?",
                text: "Esto enviará datos al sistema comercial",
                showCancelButton: true,
                confirmButtonText: "Continuar",
            }).then(async (result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    // const dataWithoutCircles = removeCircularReferences(data);
                    APIs.CreateAny(data, "create_factura")
                        .then(async (response: any) => {
                            if (!response.error) {
                                Swal.fire('Notificación', response.mensaje, 'success');
                                setSubModal('')
                            } else {
                                Swal.fire('Notificación', response.mensaje, 'warning');
                            }
                        })
                }
            });

        } else {
            Swal.fire({
                icon: 'warning',
                title: "Desea actualizar la factura con los datos seleccionados?",
                text: "Esto modificará datos en el comercial",
                showCancelButton: true,
                confirmButtonText: "Continuar",
            }).then(async (result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    // const dataWithoutCircles = removeCircularReferences(data);

                    APIs.CreateAny(data, "update_factura")
                        .then(async (response: any) => {
                            if (!response.error) {
                                Swal.fire('Notificación', response.mensaje, 'success');
                                setSubModal('')
                            } else {
                                Swal.fire('Notificación', response.mensaje, 'warning');
                            }
                        })
                }
            });
        }
    }

    const [title, setTitle] = useState<any>()




    const handleCheckboxChange = (value: number) => {
        setType(value);
    };

    const handleAddConceptsChange = (order: any, i:number) => {
        console.log('order', order);

        let newIdentifier = identifier + 1;
        let copy_totals = { ...totals };

        let newConcepts = order.conceptos.map((el: any) => {
            el.orden = {
                serie: order.serie,
                folio: order.folio,
                anio: order.anio,
            };
            el.pers_div = false;
            el.id_identifier = newIdentifier;
            newIdentifier++;

            if (type === 2) {
                copy_totals.subtotal += parseFloat(el.total);
                copy_totals.total += parseFloat(el.total);
            } else {
                copy_totals.subtotal += parseFloat(el.total_restante) - parseFloat(el.monto_urgencia);
                copy_totals.total += parseFloat(el.total_restante);
                copy_totals.urgencia += parseFloat(el.monto_urgencia);
            }
            return el;
        });

        let newConceptsPers = []

        if (order?.conceptos_pers?.length > 0) {
            newConceptsPers = order.conceptos_pers.map((el: any) => {
                el.pers_div = false;
                el.orden = {
                    serie: order.serie,
                    folio: order.folio,
                    anio: order.anio,
                };
                el.id_identifier = newIdentifier;
                newIdentifier++;

                if (type === 2) {
                    copy_totals.subtotal += parseFloat(el.total);
                    copy_totals.total += parseFloat(el.total);
                } else {
                    copy_totals.subtotal += parseFloat(el.precio_total);
                    copy_totals.total += parseFloat(el.precio_total);

                }
                return el;
            });
        }



        let totalConcepts = [...newConcepts, ...newConceptsPers];
        setCustomLocal(newConcepts)
        setTotals(copy_totals);
        setNormalConcepts([...normalConcepts, ...newConcepts]);
        setConceptView([...conceptView, ...totalConcepts]);
        setCustomConceptView([...customConceptView, ...newConcepts]);
        setCustomConcepts([...customConcepts, ...newConceptsPers]);
        setDataBillign([...dataBillign, ...totalConcepts]);
        setIdentifier(newIdentifier);
        //------------------------------------------------------------------RELLENAR INFORMACIÓN AUTOMATICA DE CLIENTE Y TITULO
        setTitle(order.titulo == undefined ? 'Cobro PAF' : order.titulo)
        if (order.rfc != undefined) {
            setClient((prevClient:any) => {
                const newClient = order.rfc;
                searchClient(newClient); // Llama a la función con el nuevo valor
                return newClient; // Actualiza el estado
            });
        }
        //------------------------------------------------------------------ELIMINAR LA ORDEN QUE YA SE AGREGÓ 
        setSaleOrders((prev:any) => prev.filter((_:any, index:number) => index !== i));

    };


    const handleAddDivisionChange = (concept: any) => {
        // Swal.fire('Notificacion', 'Está función se encuentra en desarrollo', 'info') //QUITAR ESTE SWAL CUANDO LA FUNCIÓN YA QUEDE COMPLETAMENTE FUNCIONAL
        // return
        setModalSub('billing__modal-division')
        setDivision(concept)
    }

    const [customers, setCustomers] = useState<any>({
        selectName: 'Clientes',
        options: 'razon_social',
        dataSelect: []
    })

    const searchClient = async (customClient?:string) => {
        const data = {
            id_sucursal: modoUpdate ? DataUpdate.id_sucursal : branchOffices.id,
            id_usuario: user_id,
            nombre: customClient ?? client
        }

        try {
            const result: any = await APIs.getClients(data)
            setCustomers({
                selectName: 'Clientes',
                options: 'razon_social',
                dataSelect: result
            })
            if (result.length > 0) {
                if (modoUpdate) {
                    const filter = result.filter((x: any) => x.id == DataUpdate.id_cliente)
                    if (filter.length > 0) {
                        const selected = filter[0]
                        setSelectedIds('customers', selected)
                    }

                } else {
                    setSelectedIds('customers', result[0])

                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        // console.log(selectedIds);
        if (selectedIds?.customers) {
            const id_sucursal = modoUpdate ? DataUpdate.id_sucursal : branchOffices.id
            const sucursal = selectedIds.customers.clientes_sucursal.filter((x: any) => x.id_sucursal == id_sucursal)[0]

            if (sucursal) {
                console.log('sucursal', sucursal)
                setSelectedIds('paymentConditions', { id: sucursal.condiciones_pago })
                setSelectedIds('methodPayment', { id: sucursal.forma_pago })
                setSelectedIds('paymentMethod', { id: sucursal.metodo_pago })
                setSelectedIds('cfdi', { id: selectedIds?.customers.uso_cfdi })
                setSelectedIds('foreignExchange', { id: selectedIds?.customers.divisa })
            }
        }

    }, [selectedIds?.customers])

    console.log('conceptView', conceptView)

    const deleteConceptos = (c: any) => {
        console.log('c', c)
        if (!modoUpdate) {
            if (type == 2) {
                DynamicVariables.updateAnyVar(setTotals, "total", totals.total - parseFloat(c.total))
                DynamicVariables.updateAnyVar(setTotals, "subtotal", totals.subtotal - parseFloat(c.total))
            } else {
                DynamicVariables.updateAnyVar(setTotals, "total", totals.total - parseFloat(c.total_restante))
                DynamicVariables.updateAnyVar(setTotals, "subtotal", totals.subtotal - parseFloat(c.total_restante))
            }

            const filter = conceptView.filter((x: any) => x.id_identifier !== c.id_identifier);
            setConceptView(filter);

            const filterNormal = normalConcepts.filter((x: any) => x.id_identifier !== c.id_identifier);
            setNormalConcepts(filterNormal);

        } else {
            if (c.id_concepto_comercial != undefined) {
                Swal.fire({
                    icon: 'warning',
                    title: "Desea eliminar el concepto seleccionado?",
                    text: "Esto eliminará el concepto de la factura Comercial",
                    showCancelButton: true,
                    confirmButtonText: "Continuar",
                }).then(async (result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        APIs.deleteAny("delete_concepto_factura/" + c.id)
                            .then(async (response: any) => {
                                if (!response.error) {
                                    Swal.fire('Notificación', response.mensaje, 'success');
                                    DynamicVariables.updateAnyVar(setTotals, "total", totals.subtotal - parseFloat(c.total))
                                    DynamicVariables.updateAnyVar(setTotals, "subtotal", totals.subtotal - parseFloat(c.total))
                                    const filter = concepts.filter((x: any) => x !== c);
                                    setConceptsBack(filter);
                                } else {
                                    Swal.fire('Notificación', response.mensaje, 'warning');
                                }
                            })
                    }
                });
            } else {
                if (type == 2) {
                    DynamicVariables.updateAnyVar(setTotals, "total", totals.total - parseFloat(c.total))
                    DynamicVariables.updateAnyVar(setTotals, "subtotal", totals.subtotal - parseFloat(c.total))

                } else {
                    DynamicVariables.updateAnyVar(setTotals, "total", totals.total - parseFloat(c.total_restante))
                    DynamicVariables.updateAnyVar(setTotals, "subtotal", totals.subtotal - parseFloat(c.total_restante))
                }
                const filter = concepts.filter((x: any) => x !== c);
                setConcepts(filter);
            }
        }
    }

    console.log('conceptView', conceptView)

    const undoConceptos = (concept: any) => {
        if (subModal == 'billing__modal-create') {
            const deleteItemCustomC = customConcepts.filter((x: any) => x.id_identifier !== concept.id_identifier);
            const updatedConcepts = concept.conceptos.map((element: any) => ({
                ...element,
                id_pers: 0,
                check: false,
            }));

            setCustomConcepts(deleteItemCustomC)
            // const deleteItem = conceptView.filter((x: any) => x.id_identifier !== concept.id_identifier);
            let data = [...normalConcepts, ...deleteItemCustomC]
            setConceptView([...data, ...updatedConcepts]);
            setNormalConcepts([...normalConcepts, ...updatedConcepts])
            setNormalConceptsView([...normalConcepts, ...updatedConcepts])
        } else {
            const deleteItemCustomC = customConcepts.filter((x: any) => x.id_identifier !== concept.id_identifier);


            const updatedConcepts = concept.conceptos.map((element: any) => ({
                ...element,
                id_pers: 0,
                check: false,
            }));

            // Filtrar y actualizar conceptView
            // const deleteItem = conceptView.filter((x: any) => x.id_identifier !== concept.id_identifier);


            let data = [...normalConcepts, ...deleteItemCustomC]
            setConceptView([...data, ...updatedConcepts]);
            setNormalConceptsView([...normalConcepts, ...updatedConcepts])
            setNormalConcepts([...normalConcepts, ...updatedConcepts]);
            setDeleteCustomConcepts([...deleteCustomConcepts, concept.id])
        }













        // const updatedConcepts = concept.conceptos.map((element: any) => {
        //     element.id_pers = 0;
        //     return element;
        // });

        // // Actualizar el estado de normalConcepts
        // setNormalConcepts([...normalConcepts, ...updatedConcepts]);
        // console.log('updatedConcepts', updatedConcepts)

        // // Filtrar y actualizar conceptView para eliminar los conceptos con el id_identifier especificado
        // concept.conceptos.forEach((element: any) => {
        //     element.check = false
        // });

        // const deleteItem = conceptView.filter((x: any) => x.id_identifier !== concept.id_identifier);
        // setConceptView([...deleteItem, ...concept.conceptos]);
        // console.log('concept.conceptos', concept.conceptos)
        // console.log('deleteItem', deleteItem)
        // setCustomConceptView([...deleteItem, ...concept.conceptos])
    }

    const personalizedCreate = () => {
        setPersonalizedModal('personalized_modal-billing')
        setCustomConceptView(normalConcepts);
    }

    const [idItem, setIdItem] = useState<number>()


    const personalizedUpdate = (concept: any) => {
        setPersonalizedModal('personalized_modal-billing-update');
        setIdItem(concept);


    };

    return (
        <div className={`overlay__billing-modal ${subModal == 'billing__modal-create' || subModal == 'billing__modal-update' ? 'active' : ''}`}>
            <Toaster expand={true} position="top-right" richColors />
            <div className={`popup__billing-modal ${subModal == 'billing__modal-create' || subModal == 'billing__modal-update' ? 'active' : ''}`}>
                <div className='header__modal'>
                    <a href="#" className="btn-cerrar-popup__billing-modal" onClick={() => { setModoUpdate(false); setSubModal('') }} >
                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                    </a>
                    {modoUpdate ?
                        <p className='title__modals'>Actualizar Factura</p>
                        :
                        <p className='title__modals'>Crear Factura</p>
                    }
                </div>
                <div className='billing-modal' >
                    <div className='row'>
                        <div className='row__form_articles-radios col-12'>
                            <div className='container__form_articles-radios'>
                                {/* <div className='checkbox__modal_articles' title={'Facturar DIRECTAMENTE'}>
                                    <label className="checkbox__container_general">
                                        <input value={0} className='checkbox' type="checkbox" checked={type === 0} onChange={() => handleCheckboxChange(0)} disabled={modoUpdate} />
                                        <span className="checkmark__general"></span>
                                    </label>
                                    <p className='text'>Directa</p>
                                </div> */}
                                <div className='checkbox__modal_articles' title={'Facturar por ORDEN DE VENTA'}>
                                    <label className="checkbox__container_general">
                                        <input value={1} className='checkbox' type="checkbox" checked={type === 1} onChange={() => handleCheckboxChange(1)} disabled={modoUpdate} />
                                        <span className="checkmark__general"></span>
                                    </label>
                                    <p className='text'>Por Ov</p>
                                </div>
                                <div className='checkbox__modal_articles' title={'Facturar por PEDIDO DE ALMACEN DE FRANQUICIA'}>
                                    <label className="checkbox__container_general">
                                        <input value={2} className='checkbox' type="checkbox" checked={type === 2} onChange={() => handleCheckboxChange(2)} disabled={modoUpdate} />
                                        <span className="checkmark__general"></span>
                                    </label>
                                    <p className='text'>Por PAF</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='billing-modal-container'>
                        {modoUpdate ?
                            <div className="card ">
                                <div className="card-body bg-standar">
                                    <h3 className="text">{DataUpdate.serie}-{DataUpdate.folio}-{DataUpdate.anio}</h3>
                                    <div className='row'>
                                        <div className='col-6 md-col-12'>
                                            <span className='text'>Creado por: <b>{DataUpdate.usuario_crea}</b></span><br />
                                            <span className='text'>Fecha de Creación: <b>{DataUpdate.fecha_creacion}</b></span><br />
                                            <span className='text'>Titulo: <b>{DataUpdate.titulo}</b> </span>
                                            {DataUpdate.status === 0 ? (
                                                <span className="active-status">Activo</span>
                                            ) : DataUpdate.status === 1 ? (
                                                <span className="canceled-status">Cancelada</span>
                                            ) : (
                                                DataUpdate.status === 2 ? (
                                                    <span className="end-status">Timbrado</span>
                                                ) : (
                                                    ""
                                                )
                                            )}
                                        </div>
                                        <div className='col-6 md-col-12'>
                                            <span className='text'>Empresa: <b>{DataUpdate.empresa}</b></span><br />
                                            <span className='text'>Sucursal: <b>{DataUpdate.sucursal}</b></span><br />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            : ''}
                        <div className='row__one'>

                            <div className='row'>
                                <div className={`${modoUpdate ? 'col-8' : 'col-3'}`}>
                                    <label className='label__general'>Titulo</label>
                                    <input className='inputs__general' type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Ingresa el titulo' />
                                </div>
                                {modoUpdate ?
                                    <div className='col-4'>
                                        <Select dataSelects={users} instanceId='vendedores' nameSelect={'Vendedor'} />
                                    </div>
                                    : ''}
                                {!modoUpdate ?
                                    <div className='row col-9'>
                                        <div className='col-8'>
                                            <Empresas_Sucursales update={false} empresaDyn={companies} setEmpresaDyn={setCompanies} sucursalDyn={branchOffices} setSucursalDyn={setBranchOffices} />
                                        </div>
                                        <div className='col-4'>
                                            <Select dataSelects={users} instanceId='vendedores' nameSelect={'Vendedor'} />
                                        </div>
                                    </div>
                                    : ''}
                            </div>
                            <div className='my-4 row add-client__container'>
                                <div className='col-12 title'>
                                    <p>Cliente</p>
                                </div>
                                <div className='col-4'>
                                    <label className='label__general'>Buscar Cliente</label>
                                    <input className='inputs__general' type="text" value={client} onChange={(e) => setClient(e.target.value)} placeholder='Folio/RFC/Razon social' />
                                </div>
                                <div className='col-2 d-flex align-items-end justify-content-center'>
                                    <button type='button' className='btn__general-purple' onClick={()=>searchClient()}>Buscar</button>
                                </div>
                                <div className='col-4'>
                                    <Select dataSelects={customers} instanceId='customers' nameSelect={'Clientes Encontrados'} />
                                </div>
                                <div className='col-2 d-flex align-items-end justify-content-end'>
                                    <button type='button' className='btn__general-purple'>ver informacion</button>
                                </div>
                            </div>
                        </div>
                        <div className='row row__two information_of_pay'>
                            <div className='col-12 title'>
                                <p>Información De Pago</p>
                            </div>
                            <div className='col-4'>
                                <Select dataSelects={foreignExchange} instanceId='foreignExchange' nameSelect={'Tipo de Cambio'} />
                            </div>
                            <div className='col-4'>
                                <Select dataSelects={paymentMethod} instanceId='paymentMethod' nameSelect={'Metodo de Pago'} />
                            </div>
                            <div className='col-4'>
                                <Select dataSelects={paymentConditions} instanceId='paymentConditions' nameSelect={'Condiciones de pago'} />
                            </div>
                            <div className='col-4'>
                                <Select dataSelects={methodPayment} instanceId='methodPayment' nameSelect={'Forma de pago'} />
                            </div>
                            <div className='col-4'>
                                <Select dataSelects={cfdi} instanceId='cfdi' nameSelect={'Uso de CFDI'} />
                            </div>
                        </div>
                        <div className='row__three searchs__orders'>
                            <div className='row'>
                                <div className='col-12 title'>
                                    <p>Buscar OV/PAF</p>
                                </div>
                                <div className='col-8'>
                                    <Empresas_Sucursales update={false} empresaDyn={companiesFilter} setEmpresaDyn={setCompaniesFilter} sucursalDyn={branchOfficesFilter} setSucursalDyn={setBranchOfficesFilter} />
                                </div>
                                <div className='col-4'>
                                    <label className='label__general'>Fechas</label>
                                    <div className='container_dates__requisition'>
                                        <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={date} onChange={handleDateChange} placeholder='seleciona las fechas' />
                                    </div>
                                </div>
                            </div>
                            <div className='my-4 row'>
                                {type == 2 ? '' :
                                    <>
                                        <div className='col-3'>
                                            <label className='label__general'>Clientes</label>
                                            <input className='inputs__general' type="text" value={client} onChange={(e) => setClient(e.target.value)} placeholder='Ingresa el Folio/RFC/Razon social' />
                                        </div>
                                        <div className='col-3'>
                                            <Select dataSelects={usersFilter} instanceId='usersFilter' nameSelect={'Vendedor'} />
                                        </div>
                                    </>
                                }
                                <div className='col-3'>
                                    <Select dataSelects={series} instanceId='series' nameSelect={'Serie'} />
                                </div>
                                <div className='col-3'>
                                    <label className='label__general'>Folio</label>
                                    <input className='inputs__general' type="text" value={fol} onChange={(e) => setFol(e.target.value)} placeholder='Ingresa el folio' />
                                </div>
                            </div>
                            <div className='my-4 d-flex justify-content-around'>
                                <div className=''>
                                    <button type='button' className='btn__general-purple' onClick={search}>Buscar</button>
                                </div>
                            </div>
                            <div>
                                <div className='table__billing_sale-orders'>
                                    {saleOrders ? (
                                        <div className='table__numbers'>
                                            <p className='text'>Total de OV's o PAF's</p>
                                            <div className='quantities_tables'>{saleOrders.length}</div>
                                        </div>
                                    ) : (
                                        <p className="text">No hay data que mostrar</p>
                                    )}
                                    <div className='table__head'>
                                        <div className='thead'>
                                            <div className='th'>
                                                <p>Folio</p>
                                            </div>
                                            <div className='th'>
                                                <p>Sucursal</p>
                                            </div>
                                            <div className='th'>
                                                <p>Fecha</p>
                                            </div>
                                            <div className='th'>
                                                <p>Creado Por</p>
                                            </div>
                                            <div className='th'>
                                                <p>Total($)</p>
                                            </div>
                                            <div className="th">
                                            </div>
                                        </div>
                                    </div>
                                    {saleOrders ? (
                                        <div className='table__body'>
                                            {saleOrders.map((order: any, i:number) => {
                                                return (
                                                    <div className='tbody__container' key={order.id}>
                                                        <div className='tbody'>
                                                            <div className='td'>
                                                                <p>{order.serie}-{order.folio}-{order.anio}</p>
                                                            </div>
                                                            <div className='td'>
                                                                <p>{order.sucursal}</p>
                                                            </div>
                                                            <div className='td'>
                                                                <p>{order.fecha || order.fecha_creacion}</p>
                                                            </div>
                                                            <div className='td'>
                                                                <p>{order.usuario_crea}</p>
                                                            </div>
                                                            <div className='td'>
                                                                <p>$ {order.total_orden - order.total_facturado}</p>
                                                            </div>
                                                            {/* <div className='td'>                HABILITAR SI ES NECESARIO PARA LA ORDEN DE VENTA 
                                                        <button type='button' className='btn__general-purple' onClick={() => handleModalSeeChange(order)}>conceptos</button>
                                                    </div> */}
                                                            <div className="th">
                                                                <button type='button' className='btn__general-purple' onClick={() => handleAddConceptsChange(order,i)}>Agregar</button>
                                                            </div>
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
                        </div>
                        <div className='d-flex justify-content-end'>
                            <button className='btn__general-primary' onClick={personalizedCreate}>Personalizados</button>
                        </div>
                        <div className='table__billing_concepts'>
                            {conceptView ? (
                                <div className='w-full my-3 d-flex justify-content-between'>
                                    <div className='table__numbers'>
                                        <div className='col-12'>
                                            <p>Conceptos en tu Factura</p>
                                        </div>
                                        <div className='quantities_tables'>{conceptView.length}</div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text">No hay conceptos que mostrar</p>
                            )}
                            <div className='table__head'>
                                <div className='thead'>
                                    <div className='th'>
                                        <p>Articulo</p>
                                    </div>
                                    <div className='th'>
                                        <p>Cantidad</p>
                                    </div>
                                    <div className='th'>
                                        <p>P/U</p>
                                    </div>
                                    <div className='th'>
                                        <p>Importe</p>
                                    </div>
                                    <div className='th'>
                                        <p>Total</p>
                                    </div>
                                    <div className="th">
                                        OV/PAF
                                    </div>
                                    <div className="th">
                                    </div>
                                    <div className="th">
                                    </div>
                                </div>
                            </div>
                            {conceptView ? (
                                <div className='table__body'>
                                    {conceptView?.map((concept: any) => {
                                        return (
                                            <div className={`tbody__container `} key={concept.id}>
                                                {concept?.personalized ?
                                                    <div className={`concept__personalized ${concept?.conceptos[0]?.pers_div ? 'div' : ''}`}>
                                                        <p>Concepto {concept.conceptos[0].pers_div ? 'personalized_div' : 'personalized'}</p>
                                                    </div>
                                                    :
                                                    ''
                                                }
                                                {concept?.personalized ?
                                                    <div className={`tbody ${concept?.conceptos[0]?.pers_div ? 'personalized_div' : 'personalized'}`}>
                                                        <div className='td'>
                                                            <p>{concept.codigo}-{concept.descripcion}</p>

                                                        </div>
                                                        <div className='td'>
                                                            <p>{concept.cantidad} {concept.name_unidad}</p>
                                                        </div>
                                                        <div className='td'>
                                                            <p>${(concept.precio_total) / concept.cantidad}</p>
                                                        </div>
                                                        <div className='td'>
                                                            <p>${concept.total || concept.total_restante || concept.precio_total}</p>
                                                        </div>
                                                        <div className='td'>
                                                            <p>${concept.total || concept.total_restante || concept.precio_total}</p>
                                                        </div>
                                                        <div className='td'>
                                                            <p>{concept?.orden?.serie}-{concept?.orden?.folio}-{concept?.orden?.anio}</p>
                                                        </div>
                                                        <div className='td'>
                                                            {concept.concept ?
                                                                <button type='button' className='btn__general-purple' onClick={() => personalizedUpdate(concept)}>Conceptos</button>
                                                                :
                                                                <button type='button' className='btn__general-purple' onClick={() => personalizedUpdate(concept)}>Conceptos</button>

                                                            }
                                                        </div>
                                                        {concept.concept ?
                                                            ''
                                                            :
                                                            <div className='td'>
                                                                <button type='button' className='btn__general-purple' onClick={() => handleAddDivisionChange(concept)}>Division</button>
                                                            </div>
                                                        }
                                                        <div>
                                                            {concept.conceptos[0].pers_div ?

                                                                <div className='delete-icon' onClick={() => { deleteConceptos(concept) }} title='Eliminar concepto'>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                                </div>


                                                                :

                                                                <div className='undo-icon' onClick={() => { undoConceptos(concept) }}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-undo-2"><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" /></svg>
                                                                </div>


                                                            }
                                                        </div>

                                                    </div>
                                                    :
                                                    <div className='tbody'>
                                                        <div className='td'>
                                                            <p>{concept.codigo}-{concept.descripcion}</p>

                                                        </div>
                                                        <div className='td'>
                                                            <p>{concept.cantidad} {concept.unidad}</p>
                                                        </div>
                                                        <div className='td'>
                                                            <p>${(concept.total_restante || concept.total) / concept.cantidad}</p>
                                                        </div>
                                                        <div className='td'>
                                                            <p>${concept.total || concept.total_restante}</p>
                                                        </div>
                                                        <div className='td'>
                                                            <p>${concept.total || concept.total_restante}</p>
                                                        </div>
                                                        <div className='td'>
                                                            <p>{concept?.orden?.serie}-{concept?.orden?.folio}-{concept?.orden?.anio}</p>
                                                        </div>
                                                        <div className='td'>
                                                            <button type='button' className='btn__general-purple' onClick={() => handleAddDivisionChange(concept)}>Division</button>
                                                        </div>
                                                        <div className='td'>
                                                            <div className='delete-icon' onClick={() => { deleteConceptos(concept) }} title='Eliminar concepto'>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                            </div>
                                                        </div>
                                                        {/* <div className='td'>            HABILITAR Y CONDICIONAR SOLO EN PERSONALIZADO
                                                    <button type='button' className='btn__general-purple' onClick={() => handleAddConceptsChange(concept)}>Desperzonalizado</button>
                                                </div> */}
                                                    </div>
                                                }

                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <p className="text">Cargando datos...</p>
                            )}
                            {subModal == 'billing__modal-update' && conceptsBack ? (

                                <div className='table__body'>
                                    <p style={{ color: 'red' }}>Estos conceptos se encuentran en tu factura</p>
                                    {conceptsBack?.map((concept: any) => {
                                        return (
                                            <div className={`tbody__container `} key={concept.id}>
                                                {concept?.personalized ?
                                                    <div className={`concept__personalized ${concept?.conceptos[0]?.pers_div ? 'div' : ''}`}>
                                                        <p>Concepto {concept.conceptos[0].pers_div ? 'personalized_div' : 'personalized'}</p>
                                                    </div>
                                                    :
                                                    ''
                                                }
                                                {concept?.personalized ?
                                                    <div className={`tbody ${concept?.conceptos[0]?.pers_div ? 'personalized_div' : 'personalized'}`}>
                                                        <div className='td'>
                                                            <p>{concept.codigo}-{concept.descripcion}</p>

                                                        </div>
                                                        <div className='td'>
                                                            <p>{concept.cantidad} {concept.name_unidad}</p>
                                                        </div>
                                                        <div className='td'>
                                                            <p>${(concept.precio_total) / concept.cantidad}</p>
                                                        </div>
                                                        <div className='td'>
                                                            <p>${concept.total || concept.total_restante || concept.precio_total}</p>
                                                        </div>
                                                        <div className='td'>
                                                            <p>${concept.total || concept.total_restante || concept.precio_total}</p>
                                                        </div>
                                                        <div className='td'>
                                                            <p>{concept?.orden?.serie}-{concept?.orden?.folio}-{concept?.orden?.anio}</p>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className='tbody'>
                                                        <div className='td'>
                                                            <p>{concept.codigo}-{concept.descripcion}</p>

                                                        </div>
                                                        <div className='td'>
                                                            <p>{concept.cantidad} {concept.unidad}</p>
                                                        </div>
                                                        <div className='td'>
                                                            <p>${(concept.total_restante || concept.total) / concept.cantidad}</p>
                                                        </div>
                                                        <div className='td'>
                                                            <p>${concept.total || concept.total_restante}</p>
                                                        </div>
                                                        <div className='td'>
                                                            <p>${concept.total || concept.total_restante}</p>
                                                        </div>
                                                        <div className='td'>
                                                            <p>{concept?.orden?.serie}-{concept?.orden?.folio}-{concept?.orden?.anio}</p>
                                                        </div>
                                                        <div className='td'>
                                                            <div className='delete-icon' onClick={() => { deleteConceptos(concept) }} title='Eliminar concepto'>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                            </div>

                                                        </div>
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

                    <div className='row__four text d-flex justify-content-between'>
                        <div className='btns'>
                            <div className='subtotal'>
                                <div>
                                    <p className='name'>Subtotal</p>
                                    <p className='value'>$ {totals.subtotal}</p>
                                </div>
                            </div>
                            <div className='discount'>
                                <div>
                                    <p className='name'>Descuento</p>
                                    <p className='value'>$ {totals.urgencia}</p>
                                </div>
                            </div>
                            <div className='urgency'>
                                <div>
                                    <p className='name'>Urgencia</p>
                                    <p className='value'>$ {totals.descuento}</p>
                                </div>
                            </div>
                            <div className='total'>
                                <div>
                                    <p className='name'>Total</p>
                                    <p className='value'>$ {totals.total}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='d-flex justify-content-center'>
                        {modoUpdate ?
                            <button className='btn__general-purple' onClick={(e) => handleCreateInvoice(e)}>Actualizar factura</button>
                            :
                            <button className='btn__general-purple' onClick={(e) => handleCreateInvoice(e)}>Crear factura</button>
                        }
                    </div>
                </div>
                <Division />
                <Personalized idItem={idItem} />

            </div>
        </div >
    )
}

export default ModalBilling
