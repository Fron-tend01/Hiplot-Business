import React, { useEffect, useState } from 'react'
import Empresas_Sucursales from '../../../../Dynamic_Components/Empresas_Sucursales'
import Select from '../../../../Dynamic_Components/Select'
import useUserStore from '../../../../../../zustand/General'
import { useSelectStore } from '../../../../../../zustand/Select'
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import Flatpickr from "react-flatpickr";
import { seriesRequests } from '../../../../../../fuctions/Series'
import APIs from '../../../../../../services/services/APIs'
import { storeOrdes } from '../../../../../../zustand/Ordes'
import './styles/ByOP.css'
import Swal from 'sweetalert2';
import { storeArticles } from '../../../../../../zustand/Articles'
import { storeProduction } from '../../../../../../zustand/Production'
import { storeModals } from '../../../../../../zustand/Modals'
import ModalProduction from '../../../production/ModalProduction'


const ByOP: React.FC = () => {
    const userState = useUserStore(state => state.user);
    const user_id = userState.id

    const { getSeriesXUser }: any = seriesRequests()

    const setConcepts = storeOrdes(state => state.setConcepts)
    const { concepts, OPByareas } = storeOrdes()

    const [company, setCompany] = useState<any>([])
    const [branch, setBranch] = useState<any>([])

    const selectedIds: any = useSelectStore((state) => state.selectedIds);

    // const [dataInputs, setDataInputs] = useState({
    //     invoice: ''
    // })

    const [series, setSeries] = useState<any>()


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
    const setModalLoading = storeArticles((state: any) => state.setModalLoading);

    const [orders, setOrders] = useState<any>([])
    const filterByRequest = async () => {
        let data = {
            folio: 0,
            id_sucursal: branch.id,
            id_area: selectedIds?.id_area?.id,
            id_serie: selectedIds?.series?.id,
            desde: date[0],
            hasta: date[1],
            id_usuario: user_id,
            status: 0,
            pedido: true
        }
        setModalLoading(true)
        try {
            const result: any = await APIs.getProoductionOrders(data)
            setModalLoading(false)
            setOrders(result)
        } catch (error) {
            setModalLoading(false)

            console.log(error)
        }
    }
    const filterByFetch = async (dat, dat2) => {
        let data = {
            folio: 0,
            id_sucursal: branch.id,
            id_area: selectedIds?.id_area?.id,
            id_serie: selectedIds?.series?.id,
            desde: dat,
            hasta: dat2,
            id_usuario: user_id,
            status: 0,
            pedido: true
        }
        setModalLoading(true)
        try {
            const result: any = await APIs.getProoductionOrders(data)
            setModalLoading(false)
            setOrders(result)
        } catch (error) {
            setModalLoading(false)

            console.log(error)
        }
    }


    const addArticlesByRequest = async (item: any) => {
        let filter = orders.filter((x: any) => x.id !== item.id)
        setOrders(filter)

        const filterC = await concepts.filter((x: any) => x.id == item.id)
        if (filterC.length > 0) {
            Swal.fire('Advertencia', 'El concepto ya existe', 'warning');
        } else {
            setConcepts([
                ...concepts,
                ...item.conceptos.map((concepto: any) => ({
                    ...concepto,
                    orden_produccion: {
                        folio: item.serie + '-' + item.folio + '-' + item.anio,
                        id: item.id
                    },
                    id_orden_produccion: concepto.id,
                    unidad: concepto.id_unidad,
                    id_unidad: concepto.id_unidad,
                    urgencia: item.urgencia,
                    id: item.id
                }))
            ])
        }
    }
    console.log(concepts)
    useEffect(() => {
        setDates([
            haceUnaSemana.toISOString().split('T')[0],
            hoy.toISOString().split('T')[0]
        ]);
        filterByFetch(haceUnaSemana.toISOString().split('T')[0], hoy.toISOString().split('T')[0])
    }, [])

    const setProductionToUpdate = storeProduction(state => state.setProductionToUpdate)
    const setModalSub = storeModals((state) => state.setModalSub);
    const [dates, setDates] = useState(["", ""]); // Estado para las fechas
    // useEffect(() => {
    //    if (selectedIds.id_area) {
    //     debugger
    //     // filterByRequest()
    //    }
    // }, [selectedIds])
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

    return (
        <div className='conatiner__by-request'>
            <label className='label__general'>Buscar Ordenes de Producción</label>
            <div className='row__one'>
                <div>
                    <div className='container_dates__requisition'>
                        <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={date} onChange={handleDateChange} placeholder='seleciona las fechas' />
                    </div>
                </div>
                <div>
                    <div>
                        <button className='btn__general-purple' type='button' onClick={filterByRequest}>Filtrar</button>
                    </div>
                </div>
            </div>
            <div>
            </div>
            <div className='row__two' >
                <div className='' >
                    {orders.length > 0 ? (
                        <div className='table__modal_filter_tickets' >
                            <div className='table__numbers'>
                                <p className='text parpadeo' style={{ color: 'green' }}> <b>ORDENES DE PRODUCCIÓN ENCONTRADAS</b></p>
                                <div className='quantities_tables'>{orders.length}</div>
                            </div>
                            <div className='table__body'  >
                                {orders.map((x: any, index: any) => (
                                    <div className={`tbody__container ${index % 2 === 0 ? 'striped' : ''}`} key={index} >
                                        <div className='tbody'>
                                            <div className='td' onClick={() => verProduccion(x.id)} style={{ cursor: 'pointer' }} title='Haz clic para ver los detalles de la Orden de Producción'>
                                                <p className='folio-identifier'>{x.serie}-{x.folio}-{x.anio}</p>
                                            </div>
                                            <div className='td'>
                                                <p>{x.empresa}</p>
                                            </div>
                                            <div className='td'>
                                                <p>({x.sucursal})</p>
                                            </div>
                                            <div className='td'>
                                                <p>{x.fecha_creacion}</p>
                                            </div>
                                            <div className='td'>
                                                <div>
                                                    <button className='btn__general-purple' type='button' onClick={() => addArticlesByRequest(x)}>Agregar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className='text'>No hay ordes de compras que mostrar</p>
                    )}
                </div>
            </div>
            <ModalProduction />

        </div>
    )
}

export default ByOP
