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

const ByOP: React.FC = () => {
    const userState = useUserStore(state => state.user);
    const user_id = userState.id

    const {getSeriesXUser}: any = seriesRequests()

    const setConcepts = storeOrdes(state => state.setConcepts)
    const { concepts } = storeOrdes()

    const [company, setCompany] = useState<any>([])
    const [branch, setBranch] = useState<any>([])

    const selectedIds: any = useSelectStore((state) => state.selectedIds);

    const [dataInputs, setDataInputs] = useState({
        invoice: ''
    })

    const [series, setSeries] = useState<any>()

    const fetch = async () => {

        let data = {
            id: user_id,
            tipo_ducumento: 0
        }

        const resultSeries = await getSeriesXUser(data)
        setSeries({
              selectName: 'Series',
              options: 'nombre',
              dataSelect: resultSeries
            })
    }

    useEffect(() => {
        fetch()
    }, [])

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
        setConcepts([...concepts, ...item.conceptos])
    }
    



    return (
        <div className='conatiner__by-request'>
            <div className='row'>
                <div className='col-6'>
                    <Empresas_Sucursales modeUpdate={false} empresaDyn={company} setEmpresaDyn={setCompany} sucursalDyn={branch} setSucursalDyn={setBranch} branch={setBranch} />
                </div>
                <div className='col-3'>
                    <label className='label__general'>Fechas</label>
                    <div className='container_dates__requisition'>
                        <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={date} onChange={handleDateChange} placeholder='seleciona las fechas' />
                    </div>
                </div>
                <div className='col-3'>
                    <Select dataSelects={series} instanceId='series' nameSelect='Series' />
                </div>
            </div>
            <div className='row__three mt-3'>
                <div>
                    <div>
                        <button className='btn__general-purple' type='button' onClick={filterByRequest}>Filtrar</button>
                    </div>
                </div>
            </div>
            <div className='row__four'>

            </div>
            <div>
                {/* <div className={`overlay__modal_concepts ${modalStateConcepts ? 'active' : ''}`}>
                    <div className={`popup__modal_concepts ${modalStateConcepts ? 'active' : ''}`}>
                        <a href="#" className="btn-cerrar-popup__modal_concepts" onClick={closeModalConcepts}>
                            <svg className='close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                        </a>
                        <p className='title__modals'>Detalles de conceptos</p>
                        <div className='conatiner__concepts'>
                            {concepts.map((concepto: any, index: any) => (
                                <div className='row__one' key={index}>
                                    <div>
                                        <p className='text'>cantidad</p>
                                        <p className='text'>{concepto.cantidad}</p>
                                    </div>
                                    <div>
                                        <p className='text'>codigo</p>
                                        <p className='text'>{concepto.codigo}</p>
                                    </div>
                                    <div>
                                        <p className='text'>comentarios</p>
                                        <p className='text'>{concepto.comentarios}</p>
                                    </div>
                                    <div>
                                        <p className='text'>descripcion</p>
                                        <p className='text'>{concepto.descripcion}</p>
                                    </div>
                                    <div>
                                        <p className='text'>iva</p>
                                        <p className='text'>{concepto.iva_on}</p>
                                    </div>
                                    <div>
                                        <p className='text'>precio_unitario</p>
                                        <p className='text'>{concepto.precio_unitario}</p>
                                    </div>
                                    <div>
                                        <p className='text'>proveedor</p>
                                        <p className='text'>{concepto.proveedor}</p>
                                    </div>
                                    <div>
                                        <p className='text'>unidad</p>
                                        <p className='text'>{concepto.unidad}</p>
                                    </div>
                                </div>
                            ))}
                            <div className='row__two'>

                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
            <div className='row__two'>
                <div className=''>
                    {orders.length > 0 ? (
                        <div className='table__modal_filter_tickets' >
                            <div className='table__numbers'>
                                <p className='text'>Tus ordenes de compras</p>
                                <div className='quantities_tables'>{orders.length}</div>
                            </div>
                            <div className='table__body'>
                                {orders.map((x: any, index: any) => (
                                    <div className='tbody__container' key={index}>
                                        <div className='tbody'>
                                            <div className='td'>
                                                {x.empresa}
                                            </div>
                                            <div className='td'>
                                                ({x.sucursal})
                                            </div>
                                            <div className='td'>
                                                {x.fecha_creacion}
                                            </div>
                                            <div className='td'>
                                                <div>
                                                    <button onClick={() => openModalConcepts(x)} type='button' className='btn__general-purple'>Ver conceptos</button>
                                                </div>
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
