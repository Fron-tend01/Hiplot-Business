import React, { useEffect, useRef, useState } from 'react'
import { seriesRequests } from '../../../../fuctions/Series'
import Empresas_Sucursales from '../../Dynamic_Components/Empresas_Sucursales'
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import Flatpickr from "react-flatpickr";
import Select from '../../Dynamic_Components/Select'
import useUserStore from '../../../../zustand/General'
import { usersRequests } from '../../../../fuctions/Users'
import { useSelectStore } from '../../../../zustand/Select'
import './styles/Production.css'
import APIs from '../../../../services/services/APIs'
import { storeModals } from '../../../../zustand/Modals'
import ModalProduction from './ModalProduction'
import { storeProduction } from '../../../../zustand/Production'
import { storeDv } from '../../../../zustand/Dynamic_variables';
import { storeArticles } from '../../../../zustand/Articles';


const Production: React.FC = () => {
    const userState = useUserStore(state => state.user);
    const user_id = userState.id

    const { getUsers }: any = usersRequests()
    const [setUsers] = useState<any>()

    const [production, setProduction] = useState<any>([])

    const { getSeriesXUser }: any = seriesRequests()
    const [series, setSeries] = useState<any>([])


    const setModalSub = storeModals(state => state.setModalSub)

    const setProductionToUpdate = storeProduction(state => state.setProductionToUpdate)



    const [companies, setCompanies] = useState<any>([])
    const [Areas, setAreas] = useState<any>([])

    const [branchOffices, setBranchOffices] = useState<any>([])
    const [fol, setFol] = useState<any>(0)

    const selectedIds: any = useSelectStore((state) => state.selectedIds);
    const setSelectedIds = useSelectStore(state => state.setSelectedId)

    //////////////////////////
    //////// Fechas//////////
    ////////////////////////
    const [type, setType] = useState<any>(0)

    const hoy = new Date();
    const haceUnaSemana = new Date();
    haceUnaSemana.setDate(hoy.getDate() - 7);

    // Inicializa el estado con las fechas formateadas
    const [dates, setDates] = useState([
        haceUnaSemana.toISOString().split('T')[0],
        hoy.toISOString().split('T')[0]
    ]);


    const fetch = async () => {


        // debugger

        const resultSeries = await getSeriesXUser({ tipo_ducumento: 8, id: user_id })
        resultSeries.unshift({ nombre: 'Todos', id: 0 });
        setSeries({
            selectName: 'Series',
            options: 'nombre',
            dataSelect: resultSeries
        })
    }
    const intervalRef = useRef<number | null>(null);
    const selectedIdsRef = useRef(selectedIds);
    const fechas = useRef(dates);
    const sucursal = useRef(branchOffices);
    const foliosel = useRef(fol);
    const typeRef = useRef(type);

    // Mantén actualizados los refs con los últimos valores
    useEffect(() => {
        selectedIdsRef.current = selectedIds;
    }, [selectedIds]);

    useEffect(() => {
        typeRef.current = type;
    }, [type]);
    useEffect(() => {
        fechas.current = dates;
    }, [dates]);
    useEffect(() => {
        sucursal.current = branchOffices;
    }, [branchOffices]);
    useEffect(() => {
        foliosel.current = fol;
    }, [fol]);
    const fetchData = async () => {
        const dataProductionOrders = {
            folio: parseInt(foliosel.current) || 0,
            id_sucursal: sucursal.current.id,
            id_serie: selectedIdsRef.current?.series?.id,
            id_area: selectedIdsRef.current?.areas?.id,
            desde: fechas.current[0],
            hasta: fechas.current[1],
            id_usuario: user_id,
            status: typeRef.current,
            light: true
        };

        try {
            const result = await APIs.getProoductionOrders(dataProductionOrders);
            setProduction(result);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetch()
        fetchPermisos()
        // //---------------------------SIRVE PARA ESTAR CONSULTANDO CADA CIERTO TIEMPO, EL CLEARINVERVAL ROMPE EL INTERVALO CUANDO RETURN SE EJECUTA Y EL COMPONENTE SE DESMONTA
        // fetchData();
        // intervalRef.current = setInterval(fetchData, 30000);
        // return () => {
        //     if (intervalRef.current !== null) {
        //         clearInterval(intervalRef.current);
        //     }
        // };
    }, [])
    useEffect(() => {
        fetch()

    }, [])
    useEffect(() => {
        if (selectedIds?.areas) {

            fetchData(); // Llamada inicial
            intervalRef.current = setInterval(fetchData, 30000);
            return () => {
                if (intervalRef.current !== null) {
                    clearInterval(intervalRef.current);
                }
            };
        }
    }, [selectedIds]);
    const search = async () => {
        const dataProductionOrders = {
            folio: parseInt(fol) || 0,
            id_sucursal: branchOffices.id,
            id_serie: selectedIds?.series?.id,
            id_area: selectedIds?.areas?.id,
            // id_cliente: client,
            desde: dates[0],
            hasta: dates[1],
            id_usuario: user_id,
            status: type,
            light: true

        }

        try {
            const result = await APIs.getProoductionOrders(dataProductionOrders)
            setProduction(result)
        } catch (error) {
            console.log(error)
        }
    }
    const setModalLoading = storeArticles((state: any) => state.setModalLoading);

    const handleModalChange = (order: any) => {
        const dataProductionOrders = {
            id: order.id,
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
        // setModalSub('production__modal')
        // setProductionToUpdate(order)
    }

    const updateAux = async (check: boolean, id_op: number, no_aux: number) => {
        let data = {
            id: id_op,
            no_aux: no_aux,
            val: check
        }
        APIs.CreateAny(data, "update_aux_produccion").then(() => {
            search()
        })
    }
    useEffect(() => {
        APIs.GetAny(`get_area_x_sucursal/${branchOffices.id}/${user_id}`).then((resp: any) => {
            setAreas({
                selectName: 'Areas',
                options: 'nombre',
                dataSelect: resp
            })
            setSelectedIds('areas', resp[0])
        })
    }, [branchOffices])

    const handleClick = (value: any) => {
        setType(value)
    };

    //-----------------------------------------APLICANDO PERMISOS-----------------------------------------------------------
    const setPermisosxVista = storeDv((state) => state.setPermisosxVista);
    const permisosxVista = storeDv((state) => state.permisosxvista);
    const fetchPermisos = async () => {
        await APIs.GetAny('get_permisos_x_vista/' + user_id + '/PRODUCCION').then((resp: any) => {
            setPermisosxVista(resp)
        })
    }
    const getPdf = (id: number) => {
        window.open(`http://hiplot.dyndns.org:84/api_dev/pdf_op/${id}`, '_blank');

    }
    return (
        <div className='production'>
            <div className='production__container'>
                <div className='row__one'  style={{zoom:'75%'}}>
                    <div className='row'>
                        <div className='col-8'>
                            <Empresas_Sucursales update={false} empresaDyn={companies} setEmpresaDyn={setCompanies} sucursalDyn={branchOffices} setSucursalDyn={setBranchOffices} />
                        </div>
                        <div className='col-4 row'>
                            <div className='col-6'>
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

                            <div className='col-6'>
                                <label className="label__general">Hasta</label>
                                <div className="flex gap-4 container_dates__requisition">
                                    <Flatpickr
                                        className="date"
                                        id="fecha-hasta"
                                        onChange={(date) => {
                                            const endDate = date[0]?.toISOString().split("T")[0] || "";
                                            setDates([dates[0], endDate]);
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
                    </div>
                    <div className='my-4 row__two'>
                        <div className='container__checkbox_orders'>
                            <div className='checkbox__orders'>
                                <label className="checkbox__container_general">
                                    <input className='checkbox' type="radio" name="requisitionStatus" checked={type == 0} value={type} onChange={() => handleClick(0)} />
                                    <span className="checkmark__general"></span>
                                </label>
                                <p className='title__checkbox text'>Activos</p>
                            </div>
                            <div className='checkbox__orders'>
                                <label className="checkbox__container_general">
                                    <input className='checkbox' type="radio" name="requisitionStatus" checked={type == 1} value={type} onChange={() => handleClick(1)} />
                                    <span className="checkmark__general"></span>
                                </label>
                                <p className='title__checkbox text'>Cancelados</p>
                            </div>
                            <div className='checkbox__orders'>
                                <label className="checkbox__container_general">
                                    <input className='checkbox' type="radio" name="requisitionStatus" checked={type == 2} value={type} onChange={() => handleClick(2)} />
                                    <span className="checkmark__general"></span>
                                </label>
                                <p className='title__checkbox text'>Terminados</p>
                            </div>
                            <div className='checkbox__orders'>
                                <label className="checkbox__container_general">
                                    <input className='checkbox' type="radio" name="requisitionStatus" checked={type == 3} value={type} onChange={() => handleClick(3)} />
                                    <span className="checkmark__general"></span>
                                </label>
                                <p className='title__checkbox text'>Enviados</p>
                            </div>
                        </div>
                        <div>
                            <Select dataSelects={Areas} instanceId='areas' nameSelect='Area' />
                        </div>
                        <div>
                            <Select dataSelects={series} instanceId='series' nameSelect='Serie' />
                        </div>
                        <div>
                            <label className='label__general'>Folio</label>
                            <input className='inputs__general' type="text" value={fol} onChange={(e) => setFol(e.target.value)} placeholder='Ingresa el folio' />
                        </div>
                    </div>
                    <div className='d-flex justify-content-center'>
                        <div>
                            <button className='btn__general-purple' type='button' onClick={search}>Buscar</button>
                        </div>
                    </div>
                </div>
                <div className='table__orders_production' style={{zoom:'75%'}}>
                    {production ? (
                        <div className='table__numbers'>
                            <p className='text'>Total de ordenes de produccion</p>
                            <div className='quantities_tables'>{production.length}</div>
                        </div>
                    ) : (
                        <p className="text">No hay ordenes de compra que mostras</p>
                    )}
                    <div className='table__head'>
                        <div className='thead'>
                            <div className='th'>
                                <p>Folio</p>
                            </div>
                            <div className='th'>
                                <p>Suc.Origen</p>
                            </div>
                            <div className='th'>
                                <p>Agente</p>
                            </div>
                            <div className='th'>
                                <p> Status</p>
                            </div>
                            <div className="th">
                                <p>Fecha envio Prod</p>
                            </div>
                            <div className="th">
                                <p>Fecha de entrega</p>
                            </div>
                            <div className="th">
                                <p>Pedidos</p>
                            </div>
                            <div className="th">
                                <p>Aux</p>
                            </div>
                        </div>
                    </div>
                    {production ? (
                        <div className='table__body'>
                            {production.map((order: any) => {
                                return (
                                    <div className='tbody__container' key={order.id} title='Haz Clic para ver más detalles de la Orden de Producción'>
                                        <div className='tbody' style={{ backgroundColor: `#${order.color_estado}` }}>
                                            <div className='td' onClick={() => handleModalChange(order)}>
                                                {order?.urgencia && (
                                                    <b className='parpadeo' style={{
                                                        color: 'red',
                                                        background: 'white',
                                                        padding: '3px',
                                                        borderRadius: '5px'
                                                    }}>URGENCIA</b>
                                                )}
                                                <p className='folio-identifier'>{order.serie}-{order.folio}-{order.anio}
                                                    <br />

                                                </p>
                                            </div>
                                            <div className='td' onClick={() => handleModalChange(order)}>
                                                <p>{order.sucursal}</p>
                                            </div>
                                            <div className='td' onClick={() => handleModalChange(order)}>
                                                <p className='user-identifier'>{order.usuario_crea}</p>
                                            </div>
                                            <div className='td' onClick={() => handleModalChange(order)}>
                                                <p>{order.status == 0 ? <b className='active-identifier'>ACTIVO</b> :
                                                    order.status == 1 ? <b >CANCELADO</b> : <b>TERMINADO</b>}</p>
                                            </div>
                                            <div className='td' onClick={() => handleModalChange(order)}>
                                                <p>{order.fecha_creacion}</p>
                                            </div>
                                            <div className='td' onClick={() => handleModalChange(order)}>
                                                <p>{order.fecha_entrega} {order.hora_entrega}</p>
                                            </div>
                                            <div className='td' onClick={() => handleModalChange(order)}>
                                                {order?.pedidos_almacen?.map((pedido, index) => (
                                                    <div key={index}>
                                                        {pedido.folio_pedido_almacen}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className='td checkbox-group'>
                                                <button onClick={() => getPdf(order?.id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                                        className="lucide lucide-file-text-icon lucide-file-text">
                                                        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" />
                                                        <path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>
                                                </button>
                                                <input type="checkbox" className='m-1 checkbox-input' checked={order.aux1}
                                                    onChange={(e) => { updateAux(e.target.checked, order.id, 1); }} />
                                                <input type="checkbox" className='m-1 checkbox-input' checked={order.aux2}
                                                    onChange={(e) => { updateAux(e.target.checked, order.id, 2); }} />
                                                <input type="checkbox" className='m-1 checkbox-input' checked={order.aux3}
                                                    onChange={(e) => { updateAux(e.target.checked, order.id, 3); }} />
                                                <input type="checkbox" className='m-1 checkbox-input' checked={order.aux4}
                                                    onChange={(e) => { updateAux(e.target.checked, order.id, 4); }} />
                                                <input type="checkbox" className='m-1 checkbox-input' checked={order.aux5}
                                                    onChange={(e) => { updateAux(e.target.checked, order.id, 5); }} />
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
                <ModalProduction />
            </div>
        </div >
    )
}

export default Production
