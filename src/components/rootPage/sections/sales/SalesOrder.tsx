import React, { useEffect, useState } from 'react'
import './styles/SalesOrder.css'
import { storeSaleOrder } from '../../../../zustand/SalesOrder'
import Modal from './sales_order/ModalSalesOrder'
import { saleOrdersRequests } from '../../../../fuctions/SaleOrders'
import { seriesRequests } from '../../../../fuctions/Series'
import Empresas_Sucursales from '../../Dynamic_Components/Empresas_Sucursales'
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import Flatpickr from "react-flatpickr";
import Select from '../../Dynamic_Components/Select'
import useUserStore from '../../../../zustand/General'
import { usersRequests } from '../../../../fuctions/Users'
import { useSelectStore } from '../../../../zustand/Select'

const SalesOrder: React.FC = () => {
    const userState = useUserStore(state => state.user);
    const user_id = userState.id

    const { getUsers }: any = usersRequests()
    const [users, setUsers] = useState<any>()

    const { getSaleOrders }: any = saleOrdersRequests()
    const [saleOrders, setSaleOrders] = useState<any>([])

 

    const {getSeriesXUser}: any = seriesRequests()
    const [series, setSeries] = useState<any>([])

    const setModalSalesOrder = storeSaleOrder(state => state.setModalSalesOrder)
    
    const setSaleOrdersToUpdate = storeSaleOrder(state => state.setSaleOrdersToUpdate)


    
    const [companies, setCompanies] = useState<any>([])

    const [branchOffices, setBranchOffices] = useState<any>([])
    const [fol, setFol] = useState<any>(0)

    const selectedIds: any = useSelectStore((state) => state.selectedIds);

    const [client, setClient] = useState<any>('')

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


console.log('sdsd',selectedIds)

    const fetch = async () => {
        
        const dataSaleOrders = {
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

        const result = await getSaleOrders(dataSaleOrders)
        setSaleOrders(result)

        const data = {
            nombre: '',
            id_usuario: user_id,
            id_usuario_consulta: user_id,
            light: true,
            id_sucursal: 0
        }

        const resultUsers = await getUsers(data)
        setUsers({
            selectName: 'Vendedores',
            options: 'nombre',
            dataSelect: resultUsers
        })

        const resultSeries = await getSeriesXUser(user_id)

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
        const dataSaleOrders = {
            folio: fol,
          
        }

        const result = await getSaleOrders(dataSaleOrders)
        console.log('ssd')
        setSaleOrders(result)
    }

    const modalUpdate = (order: any) => {
        setModalSalesOrder('sale-order__modal')
        setSaleOrdersToUpdate(order)
    }

    

    return (
        <div className='sales__order'>
            <div className='sales__order_container'>
                <div className='row'>
                    <div className='col-8'>
                        <Empresas_Sucursales update={false} empresaDyn={companies} setEmpresaDyn={setCompanies} sucursalDyn={branchOffices} setSucursalDyn={setBranchOffices} />
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
                        <Select dataSelects={users} nameSelect={'Usuarios'} instanceId='users' />
                    </div>
                    <div className='col-3'>
                        <Select dataSelects={series} nameSelect={'Series'} instanceId='serie' />
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
                    <div>
                        <button type='button' className='btn__general-purple' onClick={() => setModalSalesOrder('sale-order__modal')}>Crear orden de venta</button>
                    </div>
                </div>
                <Modal />
                <div className='table__orders'>
                    {saleOrders ? (
                        <div className='table__numbers'>
                            <p className='text'>Total de ordenes de compra</p>
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
                        </div>
                    </div>
                    {saleOrders ? ( 
                        <div className='table__body'>
                            {saleOrders.map((order: any) => {
                                return (
                                    <div className='tbody__container' key={order.id}>
                                        <div className='tbody'>
                                            <div className='td'>
                                                <p>{order.titulo}</p>
                                            </div>
                                            <div className='td'>
                                                <p>{order.razon_social}</p>
                                            </div>
                                            <div className='td'>
                                                <p>{order.fecha_creacion}</p>
                                            </div>
                                            <div className='td'>
                                                <p>{order.status}</p>
                                            </div>
                                            <div className='td'>
                                                <button className='branchoffice__edit_btn' onClick={() => modalUpdate(order)}>Editar</button>
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
    )
}

export default SalesOrder
