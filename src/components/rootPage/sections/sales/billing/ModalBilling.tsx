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

    const { subModal }: any = useStore(storeArticles)

    const setIdentifier = storePersonalized(state => state.setIdentifier)

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
        setTotals(totalsc)
        if (modoUpdate) {
            console.log(DataUpdate.conceptos);

            setTitle(DataUpdate.titulo)
            setSelectedIds('vendedores', DataUpdate.id_vendedor)
            setClient(DataUpdate.razon_social)
            searchClient()
            DataUpdate.conceptos.forEach((el: any) => {
                DynamicVariables.updateAnyVar(setTotals, "subtotal", totals.subtotal + parseFloat(el.total))
                DynamicVariables.updateAnyVar(setTotals, "total", totals.subtotal + parseFloat(el.total))
            });
            setConcepts([...concepts, ...DataUpdate.conceptos]);
        }
    }, [modoUpdate])
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
        if (concepts == undefined || concepts?.length < 1) {
            Swal.fire('Notificacion', 'Ingresa al menos un concepto para crear la factura', 'info')
            return
        }
        if (selectedIds?.customers == undefined) {
            Swal.fire('Notificacion', 'Selecciona un cliente para continuar', 'info')
            return
        }
        for (const element of concepts) {
            console.log(element);
            element.orden = null
            element.produccion_interna = false
            element.enviar_a_produccion = false
            element.campos_plantilla = []
            const filter = obs.filter((x: any) => x === element.id_ov);
            if (filter.length === 0) {
                obs.push(element.id_ov);
            }
        }
        console.log(selectedIds?.vendedores);
        let con = concepts
        if (modoUpdate) {
            const filter = concepts.filter((x: any) => x.id_concepto_comercial == undefined)
            con = filter
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
            conceptos: con,
            ovs_enlazadas: [],
            conceptos_elim: []
        };
        console.log(data);
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
                    const dataWithoutCircles = removeCircularReferences(data);

                    APIs.CreateAny(dataWithoutCircles, "create_factura")
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
                    const dataWithoutCircles = removeCircularReferences(data);

                    APIs.CreateAny(dataWithoutCircles, "update_factura")
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
    const removeCircularReferences = (obj: any) => {
        const seen = new WeakSet();

        function recurse(value: any) {
            if (value && typeof value === 'object') {
                if (seen.has(value)) {
                    return; // Evitar circularidad
                }
                seen.add(value);
                for (const key in value) {
                    if (value.hasOwnProperty(key)) {
                        recurse(value[key]);
                    }
                }
            }
        }

        recurse(obj);
        return obj;
    }
    const [title, setTitle] = useState<any>()




    const handleCheckboxChange = (value: number) => {
        // console.log(value);

        setType(value);
    };




    const handleAddConceptsChange = (order: any) => {
        order.conceptos.forEach((el: any) => {
            el.orden = order
            //de ser necesario falta sumar la urgencia y restar el descuento
            if (type==2) {
                DynamicVariables.updateAnyVar(setTotals, "subtotal", totals.subtotal + parseFloat(el.total))
                DynamicVariables.updateAnyVar(setTotals, "total", totals.subtotal + parseFloat(el.total))

            }else {
                DynamicVariables.updateAnyVar(setTotals, "subtotal", totals.subtotal + parseFloat(el.total_restante))
                DynamicVariables.updateAnyVar(setTotals, "total", totals.subtotal + parseFloat(el.total_restante))
            }
        });
        console.log(order.conceptos);

        setConcepts([...concepts, ...order.conceptos])
        setDataBillign([...dataBillign, ...order.conceptos])
        setIdentifier('billing')
    }

    const handleAddDivisionChange = (concept: any) => {
        Swal.fire('Notificacion', 'Está función se encuentra en desarrollo', 'info') //QUITAR ESTE SWAL CUANDO LA FUNCIÓN YA QUEDE COMPLETAMENTE FUNCIONAL
        return
        setModalSub('billing__modal-division')
        setDivision(concept)
    }

    const [customers, setCustomers] = useState<any>({
        selectName: 'Clientes',
        options: 'razon_social',
        dataSelect: []
    })

    const searchClient = async () => {

        const data = {
            id_sucursal: modoUpdate ? DataUpdate.id_sucursal : branchOffices.id,
            id_usuario: user_id,
            nombre: client
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

    const deleteConceptos = (c: any) => {
        if (!modoUpdate) {
            if (type==2) {
                DynamicVariables.updateAnyVar(setTotals, "total", totals.subtotal - parseFloat(c.total))
                DynamicVariables.updateAnyVar(setTotals, "subtotal", totals.subtotal - parseFloat(c.total))

            }else {
                DynamicVariables.updateAnyVar(setTotals, "total", totals.subtotal - parseFloat(c.total_restante))
                DynamicVariables.updateAnyVar(setTotals, "subtotal", totals.subtotal - parseFloat(c.total_restante))
            }
            const filter = concepts.filter((x: number) => x !== c);
            setConcepts(filter);
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
                                    const filter = concepts.filter((x: number) => x !== c);
                                    setConcepts(filter);
                                } else {
                                    Swal.fire('Notificación', response.mensaje, 'warning');
                                }
                            })
                    }
                });
            } else {
                if (type==2) {
                    DynamicVariables.updateAnyVar(setTotals, "total", totals.subtotal - parseFloat(c.total))
                    DynamicVariables.updateAnyVar(setTotals, "subtotal", totals.subtotal - parseFloat(c.total))
    
                }else {
                    DynamicVariables.updateAnyVar(setTotals, "total", totals.subtotal - parseFloat(c.total_restante))
                    DynamicVariables.updateAnyVar(setTotals, "subtotal", totals.subtotal - parseFloat(c.total_restante))
                }
                const filter = concepts.filter((x: number) => x !== c);
                setConcepts(filter);
            }

        }

    }
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

                        <div className='row my-4 add-client__container'>
                            <div className='col-12 title'>
                                <p>Cliente</p>
                            </div>
                            <div className='col-4'>
                                <label className='label__general'>Buscar Cliente</label>
                                <input className='inputs__general' type="text" value={client} onChange={(e) => setClient(e.target.value)} placeholder='Folio/RFC/Razon social' />
                            </div>
                            <div className='col-2 d-flex align-items-end justify-content-center'>
                                <button type='button' className='btn__general-purple' onClick={searchClient}>Buscar</button>
                            </div>
                            <div className='col-4'>
                                <Select dataSelects={customers} instanceId='customers' nameSelect={'Clientes Encontrados'} />
                            </div>
                            <div className='col-2 d-flex align-items-end justify-content-end'>
                                <button type='button' className='btn__general-purple'>ver informacion</button>
                            </div>
                        </div>
                        <div className='row information_of_pay'>
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

                        <div className='searchs__orders'>
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
                            <div className='row my-4'>
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
                            <div className='d-flex justify-content-around my-4'>
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
                                            <div className="th">
                                            </div>
                                        </div>
                                    </div>
                                    {saleOrders ? (
                                        <div className='table__body'>
                                            {saleOrders.map((order: any) => {
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
                                                            {/* <div className='td'>                HABILITAR SI ES NECESARIO PARA LA ORDEN DE VENTA 
                                                        <button type='button' className='btn__general-purple' onClick={() => handleModalSeeChange(order)}>conceptos</button>
                                                    </div> */}
                                                            <div className="th">
                                                                <button type='button' className='btn__general-purple' onClick={() => handleAddConceptsChange(order)}>Agregar</button>
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
                        <div className='table__billing_concepts'>
                            {concepts ? (
                                <div className='d-flex w-full justify-content-between my-3'>
                                    <div className='table__numbers'>
                                        <div className='col-12'>
                                            <p>Conceptos en tu Factura</p>
                                        </div>
                                        <div className='quantities_tables'>{concepts.length}</div>
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
                            {concepts ? (
                                <div className='table__body'>
                                    {concepts.map((concept: any) => {
                                        return (
                                            <div className={`tbody__container ${concept.personalized == 'personalizado' ? 'personalizado' : ''}`} key={concept.id}>
                                                <div className='tbody'>
                                                    <div className='td'>
                                                        <p>{concept.codigo}-{concept.descripcion}</p>

                                                    </div>
                                                    <div className='td'>
                                                        <p>{concept.cantidad} {concept.unidad}</p>
                                                    </div>
                                                    <div className='td'>
                                                        <p>${concept.precio_unitario}</p>
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
                                                    <button className='btn__delete_users' type="button" onClick={() => {
                                                        deleteConceptos(concept)
                                                    }}>Eliminar</button>
                                                    {/* <div className='td'>            HABILITAR Y CONDICIONAR SOLO EN PERSONALIZADO
                                                    <button type='button' className='btn__general-purple' onClick={() => handleAddConceptsChange(concept)}>Desperzonalizado</button>
                                                </div> */}
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
                    <div className='text d-flex justify-content-between'>
                        <div>
                            <p>Subtotal</p>
                            <p>$ {totals.subtotal}</p>
                        </div>
                        <div>
                            <p>Urgencia</p>
                            <p>$ {totals.urgencia}</p>
                        </div>
                        <div>
                            <p>Descuento</p>
                            <p>$ {totals.descuento}</p>
                        </div>
                        <div>
                            <p>Total</p>
                            <p>$ {totals.total}</p>
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
                <Personalized />

            </div>
        </div>
    )
}

export default ModalBilling
