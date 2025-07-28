import React, { useEffect, useState } from 'react'
import './styles/CobrosFranquicia.css'
import APIs from '../../../../services/services/APIs'
import DynamicVariables from '../../../../utils/DynamicVariables'
import useUserStore from '../../../../zustand/General'
import Empresas_Sucursales from '../../Dynamic_Components/Empresas_Sucursales'
import Flatpickr from "react-flatpickr";
import { Spanish } from 'flatpickr/dist/l10n/es.js'; // Importa la localización en español
import { storeSeries } from '../../../../zustand/Series'
import Select from '../../Dynamic_Components/Select'
import Swal from 'sweetalert2'
import { useSelectStore } from '../../../../zustand/Select'
import ModalProduction from '../production/ModalProduction'
import { storeProduction } from '../../../../zustand/Production'
import { storeArticles } from '../../../../zustand/Articles'
import { storeModals } from '../../../../zustand/Modals'
const CobrosFranquicia: React.FC = () => {
    const [data, setData] = useState<any[]>([])
    const userState = useUserStore(state => state.user);
    const user_id = userState.id
    const [series, setSeries] = useState<any>({})
    const { getSeriesXUser }: any = storeSeries();
    const selectData: any = useSelectStore(state => state.selectedIds)
    const setSelectData = useSelectStore(state => state.setSelectedId)
    const hoy = new Date();
    const haceUnaSemana = new Date();
    haceUnaSemana.setDate(hoy.getDate() - 7);
    const [date, setDate] = useState([
        haceUnaSemana.toISOString().split('T')[0],
        hoy.toISOString().split('T')[0]
    ]);
    const [newConcepts, setNewConcepts] = useState<boolean>(false)
    const handleDateChange = (fechasSeleccionadas: any) => {
        if (fechasSeleccionadas.length === 2) {
            setDate(fechasSeleccionadas.map((fecha: any) => fecha.toISOString().split('T')[0]));
        } else {
            setDate([fechasSeleccionadas[0]?.toISOString().split('T')[0] || "", ""]);
        }
    };
    const [total, setTotal] = useState<number>(0)
    const [searcher, setSearcher] = useState<any>({
        id_usuario: user_id,
        id_empresa: 0,
        id_franquicia: 0,
        id_serie: 0,
        folio: 0,
        desde: date[0],
        hasta: date[1],
        status: 0
    })
    useEffect(() => {
        fetch()
    }, [])
    const getData = async () => {
        searcher.id_empresa = empresaSelectedSearcher.id
        searcher.id_franquicia = franquiciaSelectedSearcher.id
        searcher.id_serie = selectData?.serieSearcher?.id
        searcher.desde = date[0]
        searcher.hasta = date[1]
        await APIs.CreateAny(searcher, "get_cobro_documento")
            .then(async (response: any) => {
                setData(response)
            })
    }
    const fetch = async () => {
        // await getData()
        const resultSerie = await getSeriesXUser({ tipo_ducumento: 12, id: user_id })
        resultSerie.unshift({ 'id': 0, 'nombre': 'Todos' })
        setSeries({
            selectName: 'serieSearcher',
            dataSelect: resultSerie,
            options: 'nombre'
        })
        setSelectData('serieSearcher', resultSerie[0])
    }
    const handleClick = (val: any) => {
        DynamicVariables.updateAnyVar(setSearcher, "status", val)
    };
    const [empresaSelectedSearcher, setEmpresaSelectedSearcher] = useState<any>({})
    const [franquiciaSelectedSearcher, setFranquiciaSelectedSearcher] = useState<any>({})
    const [empresaSelected, setEmpresaSelected] = useState<any>({})
    const [franquiciaSelected, setFranquiciaSelected] = useState<any>({})
    const [modal, setModal] = useState<boolean>(false)
    const [modoUpdate, setModoUpdate] = useState<boolean>(false)
    const [registroSelected, setRegistroSelected] = useState<any>()
    const AbrirModal = (mu: boolean, data: any) => {
        setModoUpdate(mu)
        setModal(true)
        setNewConcepts(false)
        setDataOps([])
        if (!mu) {
            setRegistroSelected({})
        } else {
            const totalSum = data.conceptos.reduce((acc: number, concept: any) => acc + concept.total, 0);
            setTotal(totalSum)
            setRegistroSelected(data)
            setEmpresaSelected({ id: data.id_empresa })
            setFranquiciaSelected({ id: data.id_franquicia })
        }
    }
    const [dataOps, setDataOps] = useState<any>([])
    const buscarOps = () => {
        APIs.GetAny("getOpsForCF/" + franquiciaSelected.id).then((resp: any) => {
            setDataOps(resp)
        })
    }
    const changeCantidadConcepts = (i: any, iaux: any, value: number) => {
        setDataOps((prevDataOps: any) => {
            return prevDataOps.map((item: any, index: number) =>
                index === i
                    ? {
                        ...item,
                        conceptos: item.conceptos.map((concept: any, cIndex: number) =>
                            cIndex === iaux
                                ? { ...concept, cantidad: value }
                                : concept
                        )
                    }
                    : item
            );
        });
    };
    const changeTotalConcepts = (i: any, iaux: any, value: number) => {
        setDataOps((prevDataOps: any) => {
            return prevDataOps.map((item: any, index: number) =>
                index === i
                    ? {
                        ...item,
                        conceptos: item.conceptos.map((concept: any, cIndex: number) =>
                            cIndex === iaux
                                ? { ...concept, total_franquicia: value }
                                : concept
                        )
                    }
                    : item
            );
        });
    };
    const changeSelectedConcepts = (i: any, iaux: any, value: boolean) => {
        setDataOps((prevDataOps: any) => {
            return prevDataOps.map((item: any, index: number) =>
                index === i
                    ? {
                        ...item,
                        conceptos: item.conceptos.map((concept: any, cIndex: number) =>
                            cIndex === iaux
                                ? { ...concept, seleccionado: value }
                                : concept
                        )
                    }
                    : item
            );
        });
    };
    const removeConcept = (i: number, iaux: number) => {
        Swal.fire({
            title: "Seguro que deseas marcar como cobrado el articulo " + dataOps[i].conceptos[iaux].codigo + ' de la orden ' + dataOps[i].concat_1 + '?',
            text: "Esta acción no se puede deshacer.",
            showCancelButton: true,
            icon: "info",
            confirmButtonText: "Aceptar",
            denyButtonText: `Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                await APIs.CreateAnyPut(data, "produccion_cobrada/" + dataOps[i].conceptos[iaux].id)
                    .then(async (resp: any) => {
                        if (resp.error) {
                            Swal.fire('Notificación', resp.mensaje, 'warning');
                        } else {
                            Swal.fire('Notificación', resp.mensaje, 'success');
                            setDataOps((prevDataOps: any) => {
                                return prevDataOps.map((item: any, index: number) =>
                                    index === i
                                        ? {
                                            ...item,
                                            conceptos: item.conceptos.filter((_: any, cIndex: number) => cIndex !== iaux) // Filtra el elemento a eliminar
                                        }
                                        : item
                                );
                            });
                        }
                    })
            }
        });

    };
    const create = () => {
        const filtered = dataOps
            .flatMap((item: any) =>
                item.conceptos
                    .filter((conceptx: any) => conceptx.seleccionado === true) // Filtra los seleccionados
                    .map((concept: any) => {
                        // Asignamos directamente las propiedades para evitar la sobreescritura
                        const newConcept = {
                            id_ov_concepto: concept.id,
                            id_articulo: concept.id_articulo,
                            cantidad: concept.cantidad,
                            id_unidad: concept.id_unidad,
                            total: concept.total_franquicia,
                            id_orden_produccion: concept.id_orden_produccion,
                        };

                        return newConcept; // Retornamos el nuevo objeto sin el campo id
                    })
            );
        // if (filtered.length == 0) {
        //     Swal.fire('Notificacion', 'Es necesario marcar minimo un concepto para crear el cobro', 'info')
        //     return
        // }
        console.log(filtered)
        Swal.fire({
            title: "Seguro que crear este cobro de franquicia?",
            text: "Esta acción inserta información en el sistema Comercial si tiene su configuración correcta",
            showCancelButton: true,
            icon: "info",
            confirmButtonText: "Aceptar",
            denyButtonText: `Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                let dat = {
                    status: 0,
                    id_empresa: empresaSelected?.id,
                    id_franquicia: franquiciaSelected?.id,
                    id_usuario_crea: user_id,
                    conceptos: filtered || []
                }
                await APIs.CreateAny(dat, "create_cobro_documento")
                    .then(async (resp: any) => {
                        if (resp.error) {
                            Swal.fire('Notificación', resp.mensaje, 'warning');
                        } else {
                            Swal.fire('Notificación', resp.mensaje, 'success');
                            setModal(false)
                            getData()
                        }
                    })
            }
        });
    }
    const eliminarConcept = (id: number, index: number) => {
        Swal.fire({
            title: "Seguro que desea eliminar el concepto seleccionado?",
            text: "Esto liberará la orden de producción y se desmarcara de cobrado",
            showCancelButton: true,
            icon: "info",
            confirmButtonText: "Aceptar",
            denyButtonText: `Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {

                await APIs.CreateAnyPut(null, "eliminar_concepto_cobro/" + id)
                    .then(async (resp: any) => {
                        if (resp.error) {
                            Swal.fire('Notificación', resp.mensaje, 'warning');
                        } else {
                            Swal.fire('Notificación', resp.mensaje, 'success');
                            setRegistroSelected((prevState: any) => ({
                                ...prevState,
                                conceptos: prevState.conceptos.filter((_: any, idx: number) => idx !== index)
                            }));
                            getData()
                        }
                    })
            }
        });
    }
    const update = () => {
        const filtered = dataOps
            .flatMap((item: any) =>
                item.conceptos
                    .filter((conceptx: any) => conceptx.seleccionado === true) // Filtra los seleccionados
                    .map((concept: any) => {
                        // Asignamos directamente las propiedades para evitar la sobreescritura
                        const newConcept = {
                            id_ov_concepto: concept.id,
                            id_articulo: concept.id_articulo,
                            cantidad: concept.cantidad,
                            id_unidad: concept.id_unidad,
                            total: concept.total_franquicia,
                            id_orden_produccion: concept.id_orden_produccion,
                        };

                        return newConcept; // Retornamos el nuevo objeto sin el campo id
                    })
            );
        if (filtered.length == 0) {
            Swal.fire('Notificacion', 'Es necesario marcar minimo un concepto para actualizar el cobro', 'info')
            return
        }
        Swal.fire({
            title: "Seguro que desea actualizar este cobro de franquicia?",
            text: "TIP:Puedes añadir y eliminar conceptos, esta acción liberará las ordenes de producción cobradas",
            showCancelButton: true,
            icon: "info",
            confirmButtonText: "Aceptar",
            denyButtonText: `Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                let dat = {
                    id: registroSelected.id,
                    conceptos: filtered
                }
                await APIs.CreateAny(dat, "update_cobro_documento")
                    .then(async (resp: any) => {
                        if (resp.error) {
                            Swal.fire('Notificación', resp.mensaje, 'warning');
                        } else {
                            Swal.fire('Notificación', resp.mensaje, 'success');
                            setModal(false)
                            getData()
                        }
                    })
            }
        });
    }

    const setProductionToUpdate = storeProduction(state => state.setProductionToUpdate)
    const setModalLoading = storeArticles((state: any) => state.setModalLoading);
    const setModalSub = storeModals((state) => state.setModalSub);

    const verProduccion = async (id: number) => {
        const dataProductionOrders = {
            id: id,
            folio: 0,
            id_sucursal: 0,
            id_serie: 0,
            id_area: 0,
            desde: date[0],
            hasta: date[1],
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
        <div className='cfadmin'>
            <div className='cfadmin__container'>
                <div className='row'>
                    <div className='col-3'>
                        <Empresas_Sucursales modeUpdate={false} empresaDyn={empresaSelectedSearcher}
                            setEmpresaDyn={setEmpresaSelectedSearcher} just_empresa={true}></Empresas_Sucursales>
                    </div>
                    <div className='col-3'>
                        <Empresas_Sucursales modeUpdate={false} empresaDyn={franquiciaSelectedSearcher} nombre_label_empresa='Franquicia'
                            setEmpresaDyn={setFranquiciaSelectedSearcher} just_empresa={true}></Empresas_Sucursales>
                    </div>
                    <div className='col-2'>
                        <label className='label__general'>Fecha</label>
                        <div className='container_dates__requisition'>
                            <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={date} onChange={handleDateChange} placeholder='seleciona las fechas' />
                        </div>
                    </div>
                    <div className='col-2'>
                        <Select dataSelects={series} instanceId='serieSearcher' nameSelect={'Serie'}></Select>
                    </div>
                    <div className='col-2'>
                        <div>
                            <label className='label__general'>Folio</label>
                            <input className={`inputs__general`} type="text" value={searcher.folio} onChange={(e) => DynamicVariables.updateAnyVar(setSearcher, "folio", parseInt(e.target.value))} placeholder='Ingresa el folio' />
                        </div>
                    </div>
                </div>
                <div className='row text-center mb-3 mt-3'>
                    <div className='col-11 mx-auto'>
                        <div className=' container__checkbox_orders'>
                            <div className=' checkbox__orders'>
                                <label className="checkbox__container_general">
                                    <input className='checkbox' type="radio" name="requisitionStatus" checked={searcher.status == 0 ? true : false} onChange={() => handleClick(0)} />
                                    <span className="checkmark__general"></span>
                                </label>
                                <p className='title__checkbox text'>Activo</p>
                            </div>
                            <div className=' checkbox__orders'>
                                <label className="checkbox__container_general">
                                    <input className='checkbox' type="radio" name="requisitionStatus" value={searcher.status} onChange={() => handleClick(1)} />
                                    <span className="checkmark__general"></span>
                                </label>
                                <p className='title__checkbox text'>Cancelados</p>
                            </div>
                            <div className=' checkbox__orders'>
                                <label className="checkbox__container_general">
                                    <input className='checkbox' type="radio" name="requisitionStatus" value={searcher.status} onChange={() => handleClick(2)} />
                                    <span className="checkmark__general"></span>
                                </label>
                                <p className='title__checkbox text'>Terminados</p>
                            </div>
                        </div>
                        <button className='btn__general-purple' onClick={getData}>Buscar</button>
                    </div>
                    <div className='col-1 mx_auto'>
                        <div className='tooltip-container'>

                            <button className='btn__general-orange' onClick={() => AbrirModal(false, null)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-hand-coins"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" /><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" /><path d="m2 16 6 6" /><circle cx="16" cy="9" r="2.9" /><circle cx="6" cy="5" r="3" /></svg>
                            </button>
                            <span className="tooltip-text" >Crear Cobro a Franquicia</span>

                        </div>
                    </div>
                </div>
                <div className="cfadminData__container">
                    <table className="cfadminData__table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Folio</th>
                                <th>Empresa</th>
                                <th>Franquicia</th>
                                <th>Por</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.length > 0 ? (
                                data.map((x, index) => {
                                    return (
                                        <tr key={index} onClick={() => AbrirModal(true, x)}>
                                            <td>Terminado</td>
                                            <td>{x.folio_completo}</td>
                                            <td>{x.empresa}</td>
                                            <td>{x.franquicia}</td>
                                            <td>{x.usuario_crea}</td>
                                            <td>{x.fecha_creacion}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={13} className="cfadminData__no-data">
                                        No hay datos disponibles
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>



                {/* -------------------------------------------------------------MODALES----------------------------------------------------------------------------- */}
                <div className={`overlay__modal__cfadm ${modal ? 'active' : ''}`}>
                    <div className={`popup__modal__cfadm ${modal ? 'active' : ''}`}>
                        <a href="#" className="btn-cerrar-popup__modal__cfadm" onClick={() => setModal(false)}>
                            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                        </a>
                        {modoUpdate ?
                            <div>
                                <p className='title__modals'><b>Actualizar Cobro de Franquicia</b></p>
                                <div className="card ">
                                    <div className="card-body bg-standar">
                                        <h3 className="text">{registroSelected.folio_completo}</h3>
                                        <hr />
                                        <div className='row'>
                                            <div className='col-6 md-col-12'>
                                                <span className='text'>Creado por: <b>{registroSelected.usuario_crea}</b></span><br />
                                                <span className='text'>Fecha de Creación: <b>{registroSelected.fecha_creacion}</b></span><br />
                                                <h3 className='text' style={{ color: 'red' }}>TOTAL: <b>${total}</b></h3><br />
                                                <button className='btn__general-purple' type='button' onClick={() => { setNewConcepts(true), buscarOps() }}>Agregar Conceptos</button>

                                            </div>
                                            <div className='col-6 md-col-12'>
                                                <span className='text'>Empresa: <b>{registroSelected.empresa}</b></span><br />
                                                <span className='text'>Franquicia: <b>{registroSelected.franquicia}</b></span><br />
                                                <button className='btn__general-danger' type='button' >Cancelar</button>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="table__paf-requisicion">
                                    <table>
                                        <thead className="table__paf-head">
                                            <tr>
                                                <th>Articulo</th>
                                                <th>OP</th>
                                                <th>Cant.</th>
                                                <th>P/U</th>
                                                <th>Total</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody className="table__paf-body">
                                            {registroSelected.conceptos && registroSelected.conceptos.length > 0 ? (
                                                registroSelected.conceptos.map((concept: any, index: number) => (
                                                    <tr className="tbody__paf-container" key={index}>
                                                        <td>{concept.codigo}-{concept.descripcion}</td>
                                                        <td>{concept.folio_produccion}</td>
                                                        <td>{concept.cantidad} {concept.unidad_nombre}</td>
                                                        <td>${concept.total / concept.cantidad}</td>
                                                        <td>${concept.total}</td>
                                                        <td>
                                                            <div className='delete-icon' onClick={() => {
                                                                eliminarConcept(concept.id, index)
                                                            }} title='Eliminar'>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="table__paf-no-data">
                                                        No hay requisiciones disponibles
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {newConcepts ?
                                    <>
                                        <div className='row'>
                                            <div className='col-12'>
                                                <br />
                                                <hr />
                                                <label className='label__general'>OP's Cargadas Para Agregar Nuevos Conceptos</label>
                                                <hr />
                                                <br />
                                                {dataOps?.length > 0 ? (
                                                    dataOps.map((g: any, i: number) => {
                                                        return (
                                                            <div className="card ">
                                                                <div className="card-body bg-standar">
                                                                    <h3 className="text">{g.concat_1} // {g.empresa} - {g.sucursal} // {g.fecha_entrega} {g.hora_entrega} </h3>
                                                                    <hr />
                                                                    <div className='row'>
                                                                        <div className='col-12 md-col-12'>

                                                                            <div className="cfadminData__container">
                                                                                <table className="cfadminData__table">
                                                                                    <thead>
                                                                                        <tr>
                                                                                            <th>Sel.</th>
                                                                                            <th>Artículo</th>
                                                                                            <th>Cant.</th>
                                                                                            <th>Unidad</th>
                                                                                            <th>Total</th>
                                                                                            <th>Eliminar</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {g?.conceptos?.length > 0 ? (
                                                                                            g?.conceptos?.map((x: any, j: number) => {
                                                                                                return (
                                                                                                    <tr key={j}>
                                                                                                        <td style={{ width: '50px' }}>

                                                                                                            <label className="switch">
                                                                                                                <input className={`inputs__general`} type="checkbox" checked={x.seleccionado}
                                                                                                                    onChange={(e) => { changeSelectedConcepts(i, j, e.target.checked) }}
                                                                                                                />
                                                                                                                <span className="slider"></span>
                                                                                                            </label>
                                                                                                        </td>
                                                                                                        <td>{x.codigo} - {x.descripcion}</td>
                                                                                                        <td>
                                                                                                            <input className='inputs__general' type="number" value={x.cantidad}
                                                                                                                onChange={(e) => changeCantidadConcepts(i, j, parseFloat(e.target.value) || 0)} />

                                                                                                        </td>
                                                                                                        <td>{x.unidad_nombre}</td>
                                                                                                        <td>$
                                                                                                            {x.total_franquicia.toFixed(6)}
                                                                                                            <input className='inputs__general' type="number" value={x.total_franquicia}
                                                                                                                onChange={(e) => changeTotalConcepts(i, j, parseFloat(e.target.value) || 0)} />
                                                                                                        </td>

                                                                                                        <td>
                                                                                                            <div className='delete-icon' onClick={() => {
                                                                                                                removeConcept(i, j);
                                                                                                            }} title='Eliminar'>
                                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                                                                            </div>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                );
                                                                                            })
                                                                                        ) : ''}
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>

                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : ''}


                                            </div>
                                        </div>
                                        <div className='row mt-5'>
                                            <div className='col-12 text-center'>

                                                <button className='btn__general-purple' onClick={() => update()}>Guardar</button>

                                            </div>

                                        </div>
                                    </>
                                    :
                                    ''
                                }

                            </div>
                            :
                            <div className='franchise__orders'>
                                <p className='title__modals'><b>Crear Pedido de Franquicia</b></p>
                                <div className='row '>
                                    <div className='col-4'>
                                        <Empresas_Sucursales modeUpdate={false} empresaDyn={empresaSelected}
                                            setEmpresaDyn={setEmpresaSelected} just_empresa={true}></Empresas_Sucursales>
                                    </div>
                                    <div className='col-4'>
                                        <Empresas_Sucursales modeUpdate={false} empresaDyn={franquiciaSelected} nombre_label_empresa='Franquicia'
                                            setEmpresaDyn={setFranquiciaSelected} just_empresa={true}></Empresas_Sucursales>
                                    </div>
                                    <div className='col-2 text-center'>
                                        <button className="btn__general-purple" onClick={() => buscarOps()}>Buscar OP's</button>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-12'>
                                        <br />
                                        <hr />
                                        <label className='label__general'>OP's Cargadas</label>
                                        <hr />
                                        <br />
                                        {dataOps?.length > 0 ? (
                                            dataOps.map((g: any, i: number) => {
                                                return (
                                                    <div className="card ">
                                                        <div className="card-body bg-standar">
                                                            <h3 className="text" style={{ cursor: 'pointer' }} onClick={(e) => verProduccion(g.id)}>{g.concat_1} // {g.empresa} - {g.sucursal} // {g.fecha_entrega} {g.hora_entrega} </h3>
                                                            <hr />
                                                            <div className='row'>
                                                                <div className='col-12 md-col-12'>

                                                                    <div className="cfadminData__container">
                                                                        <table className="cfadminData__table">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>Sel.</th>
                                                                                    <th>Artículo</th>
                                                                                    <th>Cant.</th>
                                                                                    <th>Unidad</th>
                                                                                    <th>Total</th>
                                                                                    <th>Eliminar</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {g?.conceptos?.length > 0 ? (
                                                                                    g?.conceptos?.map((x: any, j: number) => {
                                                                                        return (
                                                                                            <tr key={j}>
                                                                                                <td style={{ width: '50px' }}>

                                                                                                    <label className="switch">
                                                                                                        <input className={`inputs__general`} type="checkbox" checked={x.seleccionado}
                                                                                                            onChange={(e) => { changeSelectedConcepts(i, j, e.target.checked) }}
                                                                                                        />
                                                                                                        <span className="slider"></span>
                                                                                                    </label>
                                                                                                </td>
                                                                                                <td>{x.codigo} - {x.descripcion}</td>
                                                                                                <td>
                                                                                                    <input className='inputs__general' type="number" value={x.cantidad}
                                                                                                        onChange={(e) => changeCantidadConcepts(i, j, parseFloat(e.target.value) || 0)} />

                                                                                                </td>
                                                                                                <td>{x.unidad_nombre}</td>
                                                                                                <td>$
                                                                                                    {x.total_franquicia.toFixed(6)}
                                                                                                    <input className='inputs__general' type="number" value={x.total_franquicia}
                                                                                                        onChange={(e) => changeTotalConcepts(i, j, parseFloat(e.target.value) || 0)} />
                                                                                                </td>

                                                                                                <td>
                                                                                                    <div className='delete-icon' onClick={() => {
                                                                                                        removeConcept(i, j);
                                                                                                    }} title='Eliminar'>
                                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                                                                    </div>
                                                                                                </td>
                                                                                            </tr>
                                                                                        );
                                                                                    })
                                                                                ) : ''}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>

                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : ''}


                                    </div>
                                </div>
                                <div className='row mt-5'>
                                    <div className='col-12 text-center'>

                                        <button className='btn__general-purple' onClick={() => create()}>Guardar</button>

                                    </div>

                                </div>
                            </div>
                        }


                    </div>
                </div>
                {/* -------------------------------------------------------------FIN MODALES----------------------------------------------------------------------------- */}

            </div>
            <ModalProduction />
        </div>
    )
}

export default CobrosFranquicia
