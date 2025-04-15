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

const ByOP: React.FC = () => {
    const userState = useUserStore(state => state.user);
    const user_id = userState.id

    const {getSeriesXUser}: any = seriesRequests()

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

        try {
            const result: any = await APIs.getProoductionOrders(data)
            console.log(result, result)
            setOrders(result)
        } catch (error) {
            console.log(error)
        }
    }


    const addArticlesByRequest = (item: any) => {
        let filter = orders.filter((x: any) => x.id !== item.id)
        setOrders(filter)
        setConcepts([
            ...concepts,
            ...item.conceptos.map((concepto:any) => ({
              ...concepto,
              orden_produccion: {
                  folio: item.serie + '-' + item.folio + '-' + item.anio, 
                  id: item.id 
              },
              id_orden_produccion: concepto.id,
              unidad: concepto.id_unidad,
              id_unidad: concepto.id_unidad,
              urgencia: item.urgencia,
            }))
          ])
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
                                <p className='text'>ORDENES DE PRODUCCIÓN ENCONTRADAS</p>
                                <div className='quantities_tables'>{orders.length}</div>
                            </div>
                            <div className='table__body'  >
                                {orders.map((x: any, index: any) => (
                                    <div className='tbody__container' key={index} >
                                        <div className='tbody'>
                                            <div className='td'>
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
        </div>
    )
}

export default ByOP
