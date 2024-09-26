import React, { useState, useEffect } from 'react'
import { storeArticles } from '../../../../../zustand/Articles'
import { useStore } from 'zustand'
import Empresas_Sucursales from '../../../Dynamic_Components/Empresas_Sucursales'
import Select from '../../../Dynamic_Components/Select'
import useUserStore from '../../../../../zustand/General'
import { usersRequests } from '../../../../../fuctions/Users'
import { saleOrdersRequests } from '../../../../../fuctions/SaleOrders'
import { seriesRequests } from '../../../../../fuctions/Series'
import { storeSaleOrder } from '../../../../../zustand/SalesOrder'
import { useSelectStore } from '../../../../../zustand/Select'
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import { storeModals } from '../../../../../zustand/Modals'
import Flatpickr from "react-flatpickr";
import Division from './Division'
import './ModalBilling.css'
import { storeBilling } from '../../../../../zustand/Billing'
import { Toaster, toast } from 'sonner'
import Personalized from '../Personalized'  
import { storePersonalized } from '../../../../../zustand/Personalized'
import divisas from './json/divisas.json'
import condicinesPago from './json/termsOfPayment.json'
import cfdiJson from './json/CFDI.json'
import metodoPago from './json/paymentMethods.json'
import formaPago from './json/methodOfPayment.json'
import APIs from '../../../../../services/services/APIs'
import Swal from 'sweetalert2'


const ModalBilling: React.FC = () => {

    const setSubModal = storeArticles(state => state.setSubModal)

    const {subModal}: any = useStore(storeArticles)

    const setPersonalizedModal = storePersonalized((state) => state.setPersonalizedModal);

    const setIdentifier = storePersonalized(state => state.setIdentifier)

    const setConcepts = storeBilling(state => state.setConcepts)

    const {concepts}: any = useStore(storeBilling)

    const setModalSub = storeModals(state => state.setModalSub)

    const setDivision = storeBilling(state => state.setDivision)

    const setDataBillign = storeBilling(state => state.setDataBillign)

    const userState = useUserStore(state => state.user);
    let user_id = userState.id

    // Usuarios
    const { getUsers }: any = usersRequests()
    const [users, setUsers] = useState<any>()
    const [usersFilter, setUsersFilter] = useState<any>()

    const { getSaleOrders }: any = saleOrdersRequests()
    const [saleOrders, setSaleOrders] = useState<any>([])

    const {getSeriesXUser}: any = seriesRequests()
    const [series, setSeries] = useState<any>([])

    const setModalSalesOrder = storeSaleOrder(state => state.setModalSalesOrder)
    
    const setSaleOrdersToUpdate = storeSaleOrder(state => state.setSaleOrdersToUpdate)

    const  {dataBillign, division}: any = useStore(storeBilling)


    // Empresas sucursales
    const [companies, setCompanies] = useState<any>([])
    const [companiesClients, setCompaniesClients] = useState<any>([])
    const [companiesFilter, setCompaniesFilter] = useState<any>([])

    const [branchOffices, setBranchOffices] = useState<any>([])
    const [branchOfficesClients, setBranchOfficesClients] = useState<any>([])
    const [branchOfficesFilter, setBranchOfficesFilter] = useState<any>([])
    
    const [fol, setFol] = useState<any>(0)

    const selectedIds = useSelectStore((state) => state.selectedIds);

    const [client, setClient] = useState<any>('')

    const [totals, setTotals] = useState({
        subtotal: 0,
        urgencia: 0,
        descuento: 0,
        total: 0,
    })


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
        
        let dataSaleOrders = {
            folio: fol,
            id_sucursal: branchOffices.id,
            id_serie: selectedIds?.series.id,
            id_cliente: client,
            desde: date[0],
            hasta: date[1],
            id_usuario: user_id,
            id_vendedor: selectedIds?.users.id,
            status: 0
        }

        let result = await getSaleOrders(dataSaleOrders)
        setSaleOrders(result)

        let data = {
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

        setPaymentMethod({
            selectName: 'Métodos Pagos',
            options: 'name',
            dataSelect: metodoPago.currencies
        })
        setPaymentConditions({
            selectName: 'Condiciónes Pagos',
            options: 'name',
            dataSelect: condicinesPago.currencies
        })
        setMethodPayment({
            selectName: 'Formas de Pago',
            options: 'name',
            dataSelect: formaPago.currencies
        })
        setCfdi({
            selectName: 'CFDi Receptor',
            options: 'name',
            dataSelect: cfdiJson.currencies
        })

        let resultUsers = await getUsers(data)
        setUsers({
            selectName: 'Vendedor',
            options: 'nombre',
            dataSelect: resultUsers
        })
        setUsersFilter({
            selectName: 'Vendedores',
            options: 'nombre',
            dataSelect: resultUsers
        })

        let resultSeries = await getSeriesXUser(user_id)

        setSeries({
            selectName: 'Series',
            options: 'nombre',
            dataSelect: resultSeries
        })
    }

    useEffect(() => {
        fetch()
    }, [])

    const search = async () => {
        let dataSaleOrders = {
            folio: fol,
            id_sucursal: branchOfficesFilter.id,
            id_serie: selectedIds?.series?.id,
            id_cliente: client,
            desde: date[0],
            hasta: date[1],
            id_usuario: user_id,
            id_vendedor: selectedIds?.users.id,
            status: 0
        }

        let result = await getSaleOrders(dataSaleOrders)
        setSaleOrders(result)

        console.log(result)
    }

        

    const handleCreateInvoice = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        let obs: any = [];

        for (const element of concepts) {
            let filter = obs.filter((x: any) => x === element.id_ov);
            if (filter.length === 0) {
                obs.push(element.id_ov);
            }
        }

        

        const data = {
            id_sucursal: branchOffices.id,
            id_cliente: selectedIds?.customers?.id,
            subtotal: totals.subtotal,
            urgencia: totals.urgencia,
            descuento: totals.descuento,
            total: totals.total,
            divisa: selectedIds?.foreignExchange?.id,
            cfdi: selectedIds?.cfdi?.id,
            condiciones_pago: selectedIds?.paymentConditions?.id,
            forma_pago: selectedIds?.methodPayment?.id,
            metodo_pago: selectedIds?.paymentMethod?.id,
            id_usuario_crea: user_id,
            id_usuario_vendedor: selectedIds?.users?.id,
            titulo: title,
            conceptos: concepts,
            ovs_enlazadas: obs,
            conceptos_elim: [0]
        };
        
        
        
        try {
            let result = await APIs.createInvoice(data)
            Swal.fire('Factura creada exitosamente', '', 'success');
        } catch (error) {
            Swal.fire('Almacén creado exitosamente', '', 'error');
        }

    }

    const [title, setTitle] = useState<any>()


    
    const [type, setType] = useState<any>()

    const handleCheckboxChange = (value: number) => {
        setType(value);
    };


    const handleModalSeeChange = (order: any) => {

    }

    
    const handleAddConceptsChange = (order: any) => {
        setConcepts([...concepts, ...order.conceptos])
        setDataBillign([...dataBillign, ...order.conceptos])
        setIdentifier('billing')
    }

    const handleAddDivisionChange = (concept: any) => {
        setModalSub('billing__modal-division')
        setDivision(concept)
    }

    const [customers, setCustomers] = useState<any>({
        selectName: 'Clientes',
        options: 'razon_social',
        dataSelect: []
    })

    const searchClient = async () => {

        let data = {
            id_sucursal: branchOfficesClients.id,
            id_usuario: user_id,
            nombre: client
        }
        try {
            let result = await APIs.getClients(data)

            setCustomers({
                selectName: 'Clientes',
                options: 'razon_social',
                dataSelect: result
            })
        } catch (error) {
            console.log(error)
        }

       
    }
    
    
    return (
        <div className={`overlay__billing-modal ${subModal == 'billing__modal' ? 'active' : ''}`}>
            <Toaster expand={true} position="top-right" richColors  />
            <div className={`popup__billing-modal ${subModal == 'billing__modal' ? 'active' : ''}`}>
                <div className='header__modal'>
                    <a href="#" className="btn-cerrar-popup__billing-modal" onClick={() => setSubModal('')} >
                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                    </a>
                    <p className='title__modals'>Modal de facturacion</p>
                </div>
                <form className='billing-modal' onSubmit={handleCreateInvoice}>
                    <div className='row'>
                        <div className='col-12'>
                            <label className='label__general'>Titulo</label>
                            <input className='inputs__general' type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Ingresa el titulo' />
                        </div>
                    </div>
                    <div className='row my-4'>
                        <div className='col-8'>
                            <Empresas_Sucursales update={false} empresaDyn={companies} setEmpresaDyn={setCompanies} sucursalDyn={branchOffices} setSucursalDyn={setBranchOffices} />
                        </div>
                        <div className='col-4'>
                            <Select dataSelects={users} instanceId='users' />
                        </div>
                    </div>
                    <div className='row my-4'>
                        <div className='col-12 information_of_pay'>
                            <p>Cliente</p>
                        </div>
                        <div className='col-8'>
                            <Empresas_Sucursales update={false} empresaDyn={companiesClients} setEmpresaDyn={setCompaniesClients} sucursalDyn={branchOfficesClients} setSucursalDyn={setBranchOfficesClients} />
                        </div>
                        <div className='col-4'>
                            <label className='label__general'>Buscr por</label>
                            <input className='inputs__general' type="text" value={client} onChange={(e) => setClient(e.target.value)} placeholder='Folio/RFC/Razon social' />
                        </div>
                        <div className='col-2 d-flex align-items-end justify-content-center'>
                            <button type='button' className='btn__general-purple' onClick={searchClient}>Buscar</button>
                        </div>
                        <div className='col-4'>
                            <Select dataSelects={customers} instanceId='customers' />
                        </div>
                        <div className='col-2 d-flex align-items-end justify-content-end'>
                            <button type='button' className='btn__general-purple'>ver informacion</button>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-12 information_of_pay'>
                            <p>Información De Pago</p>
                        </div>
                        <div className='col-4'>
                            <Select dataSelects={foreignExchange} instanceId='foreignExchange'/>
                        </div>
                        <div className='col-4'>
                            <Select dataSelects={paymentMethod} instanceId='paymentMethod'/>
                        </div>
                        <div className='col-4'>
                            <Select dataSelects={paymentConditions} instanceId='paymentConditions'/>
                        </div>
                        <div className='col-4'>
                            <Select dataSelects={methodPayment} instanceId='methodPayment'/>
                        </div>
                        <div className='col-4'>
                            <Select dataSelects={cfdi} instanceId='cfdi' />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='row__form_articles-radios col-12'>
                            <div className='container__form_articles-radios'>
                                <div className='checkbox__modal_articles'>
                                    <label className="checkbox__container_general">
                                        <input value={0} className='checkbox' type="checkbox" checked={type === 0} onChange={() => handleCheckboxChange(0)}/>
                                        <span className="checkmark__general"></span>
                                    </label>
                                    <p className='text'>Materia prima</p>
                                </div>
                                <div className='checkbox__modal_articles'>
                                    <label className="checkbox__container_general">
                                        <input value={1} className='checkbox' type="checkbox" checked={type === 1} onChange={() => handleCheckboxChange(1)}/>
                                        <span className="checkmark__general"></span>
                                    </label>
                                    <p className='text'>Servicio</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='row'>
                            <div className='col-8'>
                                <Empresas_Sucursales update={false} empresaDyn={companiesFilter} setEmpresaDyn={setCompaniesFilter} sucursalDyn={branchOfficesFilter} setSucursalDyn={setBranchOfficesFilter} />
                            </div>
                            <div className='col-4'>
                                <label className='label__general'>Fechas</label>
                                <div className='container_dates__requisition'>
                                    <Flatpickr className='date' options={{locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={date} onChange={handleDateChange} placeholder='seleciona las fechas' />
                                </div>
                            </div>                 
                        </div>
                        <div className='row my-4'>
                            <div className='col-3'>
                                <label className='label__general'>Clientes</label>
                                <input className='inputs__general' type="text" value={client} onChange={(e) => setClient(e.target.value)} placeholder='Ingresa el Folio/RFC/Razon social' />
                            </div>
                            <div className='col-3'>
                                <Select dataSelects={usersFilter} instanceId='usersFilter' />
                            </div>     
                            <div className='col-3'>
                                <Select dataSelects={series} instanceId='series' />
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
                    </div>
                    <div>
                        <div className='table__billing_sale-orders'>
                            {saleOrders ? (
                            <div className='table__numbers'>
                                <p className='text'>Total de ordenes de produccion</p>
                                <div className='quantities_tables'>{saleOrders.length}</div>
                            </div>
                            ) : (
                                <p className="text">No hay ordenes de compra que mostras</p>
                            )}
                            <div className='table__head'>
                                <div className='thead'>
                                    <div className='th'>
                                        <p>Nombre</p>
                                    </div>
                                    <div className='th'>
                                        <p>Sucursal</p>
                                    </div>
                                    <div className='th'>
                                        <p>Fecha</p>
                                    </div>
                                    <div className='th'>
                                        <p>Estado</p>
                                    </div>
                                    <div className="th">
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
                                                        <p>{order.descripcion}</p>
                                                    </div>
                                                    <div className='td'>
                                                        <p>{order.codigo}</p>
                                                    </div>
                                                    <div className='td'>
                                                        <p>{order.fecha_creacion}</p>
                                                    </div>
                                                    <div className='td'>
                                                        <p>{order.status}</p>
                                                    </div>
                                                    <div className='td'>
                                                        <button type='button' className='btn__general-purple' onClick={() => handleModalSeeChange(order)}>conceptos</button>
                                                    </div>
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
                    <div className='table__billing_concepts'>
                        {concepts ? (
                        <div className='d-flex w-full justify-content-between my-3'>
                            <div className='table__numbers'>
                                <p className='text'>Total de conceptos</p>
                                <div className='quantities_tables'>{concepts.length}</div>
                            </div>
                            <div className='td'>
                                <button type='button' className='btn__general-purple' onClick={() => setPersonalizedModal('personalized_modal')}>Perzonalizado</button>
                            </div>
                        </div>
                        ) : (
                            <p className="text">No hay ordenes de compra que mostras</p>
                        )}
                        <div className='table__head'>
                            <div className='thead'>
                                <div className='th'>
                                    <p>Nombre</p>
                                </div>
                                <div className='th'>
                                    <p>Codigo</p>
                                </div>
                                <div className='th'>
                                    <p>Cantidad</p>
                                </div>
                                <div className='th'>
                                    
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
                                        <div className={`tbody__container ${concept.personalized == 'personalizado' ? 'personalizado' : '' }`} key={concept.id}>
                                            <div className='tbody'>
                                                <div className='td'>
                                                    <p>{concept.descripcion}</p>
                                            
                                                </div>
                                                <div className='td'>
                                                    <p>{concept.codigo}</p>
                                                </div>
                                                <div className='td'>
                                                    <p>{concept.cantidad}</p>
                                                </div>
                                                <div className='td'>
                                                    <button type='button' className='btn__general-purple' onClick={() => handleAddDivisionChange(concept)}>Division</button>
                                                </div>
                                                
                                                <div className='td'>
                                                    <button type='button' className='btn__general-purple' onClick={() => handleAddConceptsChange(concept)}>Desperzonalizado</button>
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
                    <div className='text d-flex justify-content-between'>
                        <div>
                            <p>Subtotal</p>
                            <p>$ 560</p>
                        </div>
                        <div>
                            <p>Urgencia</p>
                            <p>$ 560</p>
                        </div>
                        <div>
                            <p>Descuento</p>
                            <p>$ 560</p>
                        </div>
                        <div>
                            <p>Total</p>
                            <p>$ 560</p>
                        </div>
                    </div>
                    <div className='d-flex justify-content-center'>
                        <button className='btn__general-purple'>Crear factura</button>
                    </div>
                </form>
                <Division />
                <Personalized />
                
            </div>
        </div>
    )
}

export default ModalBilling
