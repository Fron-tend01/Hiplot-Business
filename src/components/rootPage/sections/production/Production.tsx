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
        }

        try {
            const result = await APIs.getProoductionOrders(dataProductionOrders)
            setProduction(result)
        } catch (error) {
            console.log(error)
        }
    }

    const handleModalChange = (order: any) => {
        setModalSub('production__modal')
        setProductionToUpdate(order)
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
    return (
        <div className='production'>
            <div className='production__container'>
                <div className='row__one'>
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
                <div className='table__orders_production'>
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
                                                <p className='folio-identifier'>{order.serie}-{order.folio}-{order.anio}</p>
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
                                            <div className='td checkbox-group'>
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
        </div>
    )
}

export default Production
