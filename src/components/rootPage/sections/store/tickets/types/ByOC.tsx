import React, { useEffect, useState } from 'react'
import Empresas_Sucursales from '../../../../Dynamic_Components/Empresas_Sucursales'
import Flatpickr from "react-flatpickr";
import 'flatpickr/dist/flatpickr.min.css';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import types from './json/types.json'
import Select from '../../../../Dynamic_Components/Select';
import typeSearch from './json/typeSearchs.json'
import Series from '../../../processes/Series';
import { storeTickets } from '../../../../../../zustand/Tickets';
import { useStore } from 'zustand';
import { storeSeries } from '../../../../../../zustand/Series';
import useUserStore from '../../../../../../zustand/General';
import APIs from '../../../../../../services/services/APIs';
import './styles/ByOC.css'


const ByOC: React.FC = () => {
    const userState = useUserStore(state => state.user);
    let user_id = userState.id

     /////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////ByOCa///////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////

        
    const setConceptos = storeTickets(state => state.setConceptos)
    const {conceptos}: any = useStore(storeTickets)
 

    const [purchaseOrders, setPurchaseOrders] = useState<any>([])

    const [companies, setCompanies] = useState<any>()
    const [branchOffices, setBranchOffices] = useState<any>()
    const {getSeriesXUser }: any = storeSeries();

    const [series, setSeries] = useState<any>([])

    const fecth = async () => {
        let resultSeries = await getSeriesXUser({id: user_id, tipo_ducumento: 2})
        setSeries({
            selectName: 'Series',
            options: 'nombre',
            dataSelect: resultSeries
        })
    }

    useEffect(() => {
        fecth()
    }, [])




    //////////////////////////////////////////// Fechas //////////////////////////////////////////////////

    const [dates, setDates] = useState<any>([])

    const handleDateChange = (fechasSeleccionadas: any) => {
        if (fechasSeleccionadas.length === 2) {
            setDates(fechasSeleccionadas.map((fecha: any) => fecha.toISOString().split('T')[0]));
        } else {
            setDates([fechasSeleccionadas[0]?.toISOString().split('T')[0] || "", ""]);
        }
    };

    

    const filterByRequest = async () => {
        let data = {
            folio: 0,
            id_serie: 0,
            id_sucursal: branchOffices.id,
            id_usuario: user_id,
            id_area: 0,
            tipo: 0,
            desde: dates[0],
            hasta: dates[1],
            status: 0
        }
        try {
            let result = await APIs.getPurchaseOrders(data);
            setPurchaseOrders(result)
        } catch (error) {  
            console.error("Error fetching requisitions:", error);
        }
    }



    const [suppliersModal, setSuppliersModal] = useState<any>()

    // setSuppliersModal()
    const addArticlesByRequest = async (x: any) => {
        for (const xx of x.conceptos) {
            xx.id_orden_compra_concepto = xx.id;
            if(x.sumar_flete == 0) {
                xx.sumar_flete = x.sumar_flete
                xx.costo_flete = x.costo_flete
            }
        }
        setConceptos([...conceptos, ...x.conceptos]);
    }
    



    const [modalStateConcepts, setModalStateConcepts] = useState<boolean>(false)

    const [concepts, setConcepts] = useState<any[]>([])

    const openModalConcepts = (item: any) => {
        setModalStateConcepts(true);
        console.log(item)
        item.conceptos.forEach((element: any) => {
            setConcepts(prevConcepts => ([{
                ...prevConcepts,
                cantidad: element.cantidad,
                codigo: element.codigo,
                comentarios: element.comentarios,
                descripcion: element.descripcion,
                iva_on: element.iva_on,
                precio_unitario: element.precio_unitario,
                proveedor: element.proveedor,
                unidad: element.unidad,
              
            }]));
        });


    }


    const [invoice, setInvoice] = useState<string>('')
    const [warningInvoice] = useState<boolean>(false)
    const searchByRequest = () => {
    }

    const closeModalConcepts = () => {
        setModalStateConcepts(false)
    }


    return (
        <div className='conatiner__by-request'>
            <div className='row'>
                <div className='col-8'>
                    <Empresas_Sucursales empresaDyn={companies} sucursalDyn={branchOffices} setEmpresaDyn={setCompanies} setSucursalDyn={setBranchOffices}  modeUpdate={false}/>
                </div>
                <div className='col-3'>
                    <label className='label__general'>Fechas</label>
                    <div className='container_dates__requisition'>
                        <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={dates} onChange={handleDateChange} placeholder='seleciona las fechas' />
                    </div>
                </div>
                <div className='col-1 d-flex align-items-end justify-content-end'>
                    <button className='btn__general-purple' type='button' onClick={filterByRequest}>Filtrar</button>
                </div>
            </div>
            <div className='row'>
                <div className='col-5'>
                    <Select dataSelects={series} nameSelect={'Series'} instanceId='id_serie' />
                </div>
                <div className='col-5'>
                    <label className='label__general'>Folio</label>
                    <input className={`inputs__general ${warningInvoice}  ? 'warning' : ''}`} type="text" value={invoice} onChange={(e) => setInvoice(e.target.value)} placeholder='Ingresa el folio' />
                </div>
                <div className='container__search d-flex align-items-end col-2 justify-content-end'>
                    <button className='btn__general-purple btn__container' type='button' onClick={searchByRequest}>
                        Buscar
                        <svg className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /></svg>
                    </button>
                </div>
            </div>
            <div>
                <div className={`overlay__modal_concepts-ticket ${modalStateConcepts ? 'active' : ''}`}>
                    <div className={`popup__modal_concepts-ticket ${modalStateConcepts ? 'active' : ''}`}>
                        <a href="#" className="btn-cerrar-popup__modal_concepts-ticket" onClick={closeModalConcepts}>
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
                </div>
            </div>
            <div className='row__two'>
                <div className=''>
                    {purchaseOrders?.length > 0 ? (
                        <div className='table__modal_filter_tickets' >
                            <div className='table__numbers'>
                                <p className='text'>Tus ordenes de compras</p>
                                <div className='quantities_tables'>{purchaseOrders.length}</div>
                            </div>
                            <div className='table__body'>
                                {purchaseOrders?.map((x: any, index: any) => (
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

export default ByOC
