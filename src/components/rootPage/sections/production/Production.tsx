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

    const fetch = async () => {

        const dataProductionOrders = {
            folio: parseInt(fol) || 0,
            id_sucursal: branchOffices.id,
            id_serie: selectedIds?.series?.id,
            id_area: selectedIds?.areas?.id,
            // id_cliente: client,
            desde: date[0],
            hasta: date[1],
            id_usuario: user_id,
            status: 0,
        }

        try {
            const result = await APIs.getProoductionOrders(dataProductionOrders)
            setProduction(result)
        } catch (error) {
            console.log(error)
        }

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

    const fetchData = async () => {
        search()
    };
    useEffect(() => {
        fetch()
        //---------------------------SIRVE PARA ESTAR CONSULTANDO CADA CIERTO TIEMPO, EL CLEARINVERVAL ROMPE EL INTERVALO CUANDO RETURN SE EJECUTA Y EL COMPONENTE SE DESMONTA
        fetchData();
        intervalRef.current = setInterval(fetchData, 30000);
        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        };
    }, [])

    const search = async () => {
        const dataProductionOrders = {
            folio: parseInt(fol) || 0,
            id_sucursal: branchOffices.id,
            id_serie: selectedIds?.series?.id,
            id_area: selectedIds?.areas?.id,
            // id_cliente: client,
            desde: date[0],
            hasta: date[1],
            id_usuario: user_id,
            status: 0,
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

    const [type, setType] = useState<any>(0)
    const handleClick = (value: any) => {
        setType(value)
    };


    return (
        <div className='production'>
            <div className='production__container'>
                <div className='row__one'>
                    <div className='row'>
                        <div className='col-8'>
                            <Empresas_Sucursales update={false} empresaDyn={companies} setEmpresaDyn={setCompanies} sucursalDyn={branchOffices} setSucursalDyn={setBranchOffices} />
                        </div>
                        <div className='col-4'>
                            <label className='label__general'>Fechas</label>
                            <div className='container_dates__requisition'>
                                <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={date} onChange={handleDateChange} placeholder='seleciona las fechas' />
                            </div>
                        </div>
                    </div>
                    <div className='row__two my-4'>
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
                                <p className='title__checkbox text'>Sucursal(Terminados)</p>
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
                                        <div className={`tbody ${order.color_estado === 'rojo'
                                            ? 'delayed'
                                            : order.color_estado === 'amarillo'
                                                ? 'to-deliver'
                                                : order.color_estado === 'azul_cielo'
                                                    ? 'blue'
                                                    : 'no-color'
                                            }`}>
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
