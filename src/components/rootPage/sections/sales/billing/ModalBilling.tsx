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
import Flatpickr from "react-flatpickr";

const ModalBilling: React.FC = () => {

    const setSubModal = storeArticles(state => state.setSubModal)

    const {subModal}: any = useStore(storeArticles)

    const userState = useUserStore(state => state.user);
    let user_id = userState.id

    const { getUsers }: any = usersRequests()
    const [users, setUsers] = useState<any>()

    const { getSaleOrders }: any = saleOrdersRequests()
    const [saleOrders, setSaleOrders] = useState<any>([])

    const {getSeriesXUser}: any = seriesRequests()
    const [series, setSeries] = useState<any>([])

    const setModalSalesOrder = storeSaleOrder(state => state.setModalSalesOrder)
    
    const setSaleOrdersToUpdate = storeSaleOrder(state => state.setSaleOrdersToUpdate)

    const  {saleOrdersToUpdate}: any = useStore(storeSaleOrder)
    
    const [companies, setCompanies] = useState<any>([])

    const [branchOffices, setBranchOffices] = useState<any>([])
    const [fol, setFol] = useState<any>(0)

    const selectedIds = useSelectStore((state) => state.selectedIds);

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

        let resultUsers = await getUsers(data)
        setUsers({
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
    }

    const modalUpdate = (order: any) => {
        setModalSalesOrder('sale-order__modal')
        setSaleOrdersToUpdate(order)
    }


    const handleCreateSaleOrder = () => {

    }

    const data = {
        id_sucursal: 0,
        id_cliente: 0,
        subtotal: 0,
        urgencia: 0,
        descuento: 0,
        total: 0,
        divisa: 0,
        cfdi: 0,
        condiciones_pago: 0,
        forma_pago: 0,
        metodo_pago: 0,
        id_usuario_crea: 0,
        id_usuario_vendedor: 0,
        status: 0,
        titulo: "",
        conceptos: [
          {
            id: 0,
            id_ov: 0,
            id_articulo: 0,
            produccion_interna: true,
            id_area_produccion: 0,
            enviar_a_produccion: 0,
            status: 0,
            cantidad: 0,
            monto_urgencia: 0,
            monto_descuento: 0,
            precio_unitario: 0,
            id_unidad: 0,
            obs_produccion: "",
            obs_factura: "",
            id_pers: 0,
            campos_plantilla: [
              {
                id: 0,
                id_ov_conceptos: 0,
                nombre_campo_plantilla: "string",
                tipo_campo_plantilla: 0,
                valor: "string"
              }
            ]
          }
        ],
        ovs_enlazadas: [],
        conceptos_elim: [0]
      };
      
    
    const [type, setType] = useState<any>()

    const handleCheckboxChange = (value: number) => {
        setType(value); // Actualiza el tipo seleccionado
    };


    return (
        <div className={`overlay__production-modal__article-modal ${subModal == 'billing__modal' ? 'active' : ''}`}>
            <div className={`popup__production-modal__article-modal ${subModal == 'billing__modal' ? 'active' : ''}`}>
                <div className='header__modal'>
                    <a href="#" className="btn-cerrar-popup__production-modal__article-modal" onClick={() => setSubModal('')} >
                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                    </a>
                    <p className='title__modals'>Modal de produccion</p>
                </div>
                <form onSubmit={handleCreateSaleOrder}>
                    <div className='row'>
                        <div className='col-8'>
                            <Empresas_Sucursales />
                        </div>
                        <div className='col-4'>
                            <Select />
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
                                <Select dataSelects={users} instanceId='users' />
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
                            <div>
                                <button type='button' className='btn__general-purple' onClick={() => setModalSalesOrder('sale-order__modal')}>Crear orden de venta</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ModalBilling
