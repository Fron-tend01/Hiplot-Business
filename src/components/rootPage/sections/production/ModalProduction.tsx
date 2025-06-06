import React, { useEffect, useState } from 'react'
import { storeModals } from '../../../../zustand/Modals'
import { useStore } from 'zustand'
import './styles/ModalProduction.css'
import { storeProduction } from '../../../../zustand/Production'
import APIs from '../../../../services/services/APIs'
import Select from '../../Dynamic_Components/Select'
import useUserStore from '../../../../zustand/General'
import { useSelectStore } from '../../../../zustand/Select'
import Swal from 'sweetalert2'
import Binnacle from './Binnacle'
import { storeDv } from '../../../../zustand/Dynamic_variables'

const ModalProduction: React.FC = () => {
    const userState = useUserStore(state => state.user);
    const user_id = userState.id

    const setModalSub = storeModals(state => state.setModalSub)

    const selectedIds: any = useSelectStore((state) => state.selectedIds);

    const { productionToUpdate }: any = useStore(storeProduction)


    const { modalSub }: any = useStore(storeModals)

    const handleCreateSaleOrder = () => {

    }

    const setModalSubSub = storeModals((state) => state.setModalSubSub);


    const [areasGral, setAreasGral] = useState<any>()


    useEffect(() => {
        if (productionToUpdate) {
            let total = 0
            let st = 0
            let urg = 0
            productionToUpdate?.conceptos?.forEach(element => {
                total += parseFloat(element.total) + parseFloat(element.monto_urgencia) - parseFloat(element.monto_descuento)
                st += parseFloat(element.total)
                urg += parseFloat(element.monto_urgencia)
            });
            productionToUpdate.total = total
            productionToUpdate.st = st
            productionToUpdate.urg = urg
            const uniqueAreas = new Set<string>(); // Usamos Set para almacenar las áreas como cadenas JSON

            productionToUpdate?.conceptos?.forEach((element: any) => {


                element?.areas_produccion.forEach((area: any) => {
                    const areaStr = JSON.stringify({
                        nombre_area: area.nombre_area,
                        id_area: area.id_area,
                        id: area.id_area,
                    });
                    uniqueAreas.add(areaStr); // Agregamos la cadena JSON al Set
                });
            });

            // Convertimos las cadenas JSON de vuelta a objetos antes de actualizar el estado
            setAreasGral({
                selectName: 'Areas',
                options: 'nombre_area',
                dataSelect: Array.from(uniqueAreas).map((areaStr) => JSON.parse(areaStr)),
            });
        }
    }, [productionToUpdate]);



    const getPDF = async () => {
        try {
            // await APIs.getProoductionPDF(productionToUpdate.id)
            window.open(`http://hiplot.dyndns.org:84/api_dev/pdf_op/${productionToUpdate.id}`, '_blank');
        } catch (error) {

        }
    }

    const finishConcept = async () => {
        const dataProductionOrders = {
            folio: 0,
            id: productionToUpdate.id,
            id_sucursal: productionToUpdate.id_sucursal,
            id_serie: 0,
            id_area: 0,
            desde: formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
            hasta: formatDate(new Date()),
            id_usuario: user_id,
            status: 0,
        }
        let data = {
            id: productionToUpdate.id,
            id_usuario: user_id,
        }
        Swal.fire({
            title: "Seguro que deseas terminar la orden?",
            text: "Esta acción no se puede deshacer",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            denyButtonText: `Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await APIs.CreateAny(data, "terminar_op")
                        .then(async (_: any) => {
                            Swal.fire('Notificación', 'Orden terminada correctamente', 'success');
                            let copy = { ...productionToUpdate }
                            copy.status = 2
                            setProductionToUpdate(copy)
                        })
                    const result = await APIs.getProoductionOrders(dataProductionOrders)
                    setProductionToUpdate(result[0])
                } catch (error) {
                    Swal.fire('Notificacion', 'Ocurrió un error al cambiar de area, consulta con soporte', 'info')

                }
            }
        });
    }
    const cancelarOp = async () => {
        const dataProductionOrders = {
            folio: 0,
            id: productionToUpdate.id,
            id_sucursal: productionToUpdate.id_sucursal,
            id_serie: 0,
            id_area: 0,
            desde: formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
            hasta: formatDate(new Date()),
            id_usuario: user_id,
            status: 0,
        }
        let data = {
            id: productionToUpdate.id,
            id_usuario: user_id,
        }
        Swal.fire({
            title: "Seguro que deseas cancelar esta orden?",
            text: "Esta acción no se puede deshacer",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            denyButtonText: `Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await APIs.CreateAny(data, "cancelar_op")
                        .then(async (_: any) => {
                            Swal.fire('Notificación', 'Orden cancelada correctamente', 'success');
                            let copy = { ...productionToUpdate }
                            copy.status = 1
                            setProductionToUpdate(copy)
                        })
                    const result = await APIs.getProoductionOrders(dataProductionOrders)
                    setProductionToUpdate(result[0])
                } catch (error) {
                    Swal.fire('Notificacion', 'Ocurrió un error al cancelar la orden, consulta con soporte', 'info')

                }
            }
        });

    }



    const formatDate = (date: any) => date.toISOString().split("T")[0];
    const enviarASucursal = async () => {
        const dataProductionOrders = {
            folio: 0,
            id: productionToUpdate.id,
            id_sucursal: productionToUpdate.id_sucursal,
            id_serie: 0,
            id_area: 0,
            desde: formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
            hasta: formatDate(new Date()),
            id_usuario: user_id,
            status: 0,
        }
        let data = {
            id: productionToUpdate.id,
            id_usuario: user_id,
        }
        Swal.fire({
            title: "Seguro que deseas enviar a sucursal la orden?",
            text: "Esta acción no se puede deshacer",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            denyButtonText: `Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await APIs.CreateAny(data, "enviar_sucursal_op")
                        .then(async (_: any) => {
                            Swal.fire('Notificación', 'Orden enviada a sucursal correctamente', 'success');
                            let copy = { ...productionToUpdate }
                            copy.status = 3
                            setProductionToUpdate(copy)
                        })
                    const result = await APIs.getProoductionOrders(dataProductionOrders)
                    setProductionToUpdate(result[0])
                } catch (error) {
                    Swal.fire('Notificacion', 'Ocurrió un error al cambiar de area, consulta con soporte', 'info')

                }
            }
        });





    }
    const sendAreas = async () => {
        let data = {
            id: productionToUpdate.id,
            id_usuario: user_id,
            id_area_nueva: selectedIds?.areasGral?.id_area
        }
        Swal.fire({
            title: "Seguro que deseas cambiar de area la orden?",
            text: "Para regresar la orden de nuevo a tu area deberás solicitarlo con el encargado del area a la que se está enviando",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            denyButtonText: `Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    APIs.sendAreaProduction(data).then(() => {
                        Swal.fire('Notificacion', 'Orden movida de area correctamente', 'success')
                        search_one_op(productionToUpdate.id)

                    })
                } catch (error) {
                    Swal.fire('Notificacion', 'Ocurrió un error al cambiar de area, consulta con soporte', 'info')

                }
            }
        });

    }

    const sendConceptoAreas = async (art: any) => {
        let data = {
            id: art.id,
            id_usuario: user_id,
            id_area_nueva: art.id_area_produccion
        }
        Swal.fire({
            title: "Seguro que deseas cambiar de Area el concepto " + art.descripcion + '?',
            text: "Si no tienes acceso al area que vas a enviar, tendrás que solicitar el cambio al encargado del area enviada",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            denyButtonText: `Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await APIs.sendAreaConceptoProduction(data)
                    Swal.fire('Notificacion', 'Cambio de Area realizado correctamente', 'success')
                    search_one_op(productionToUpdate.id)

                } catch (error) {
                    Swal.fire('Notificacion', 'Ocurrió un error al cambiar el area: ' + error, 'info')

                }
            }
        });

    }
    const setProductionToUpdate = storeProduction(state => state.setProductionToUpdate)

    const onChangeAreaConcepto = async (index_concepto: number, valor: any) => {
        let copy = { ...productionToUpdate }
        copy.conceptos[index_concepto].id_area_produccion = parseInt(valor)
        setProductionToUpdate(copy)
    }
    const terminarConcepto = async (art: any, index: number) => {
        let data = {
            id: art.id,
            id_usuario: user_id,
        }
        Swal.fire({
            title: "Seguro que deseas terminar el concepto " + art.descripcion + '?',
            text: "Esta acción no se puede deshacer.",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            denyButtonText: `Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                await APIs.CreateAny(data, "terminar_concepto_op")
                    .then(async (_: any) => {
                        Swal.fire('Notificación', 'Concepto terminado Correctamente', 'success');
                        search_one_op(productionToUpdate.id)

                    })
            }
        });
    }
    const enviarASucursalConcepto = async (art: any, index: number) => {
        let data = {
            id: art.id,
            id_usuario: user_id,
        }
        Swal.fire({
            title: "Seguro que deseas enviar a sucursal el concepto " + art.descripcion + '?',
            text: "Esta acción no se puede deshacer.",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            denyButtonText: `Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                await APIs.CreateAny(data, "enviar_sucursal_concepto_op")
                    .then(async (_: any) => {
                        Swal.fire('Notificación', 'Concepto enviado a sucursal Correctamente', 'success');
                        // let copy = { ...productionToUpdate }
                        // copy.conceptos[index].status_produccion = 3
                        // setProductionToUpdate(copy)
                        search_one_op(productionToUpdate.id)
                    })
            }
        });
    }
    const cancelarConcepto = async (art: any, index: number) => {
        let data = {
            id: art.id,
            id_usuario: user_id,
        }
        Swal.fire({
            title: "Seguro que deseas CANCELAR el concepto " + art.descripcion + '?',
            text: "Esta acción no se puede deshacer.",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            denyButtonText: `Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                await APIs.CreateAny(data, "cancelar_concepto_op")
                    .then(async (_: any) => {
                        Swal.fire('Notificación', 'Concepto enviado a cancelado Correctamente', 'success');
                        search_one_op(productionToUpdate.id)

                    })
            }
        });
    }
    const hoy = new Date();
    const haceUnaSemana = new Date();
    haceUnaSemana.setDate(hoy.getDate() - 7);
    const [dates, setDates] = useState([
        haceUnaSemana.toISOString().split('T')[0],
        hoy.toISOString().split('T')[0]
    ]);
    const search_one_op = async (id: number) => {
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
        try {
            APIs.getProoductionOrders(dataProductionOrders).then((resp: any) => {

                setProductionToUpdate(resp[0])
            })

        } catch (error) {
            console.log(error)
        }
    }
    const checkPermission = (elemento: string) => {
        const permisosxVista = storeDv.getState().permisosxvista; // Obtiene el estado actual


        return permisosxVista.some((x: any) => x.titulo === elemento);
    };



    const [expandedIds, setExpandedIds] = useState<number[]>([]);

    const toggle = (id: number) => {
        setExpandedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };
    return (
        <div className={`overlay__production-modal__article-modal ${modalSub == 'production__modal' ? 'active' : ''}`}>
            <div className={`popup__production-modal__article-modal ${modalSub == 'production__modal' ? 'active' : ''}`}>
                <div className='header__modal'>
                    <a href="#" className="btn-cerrar-popup__production-modal__article-modal" onClick={() => setModalSub('')} >
                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                    </a>
                    <p className='title__modals'>Modal de produccion</p>
                </div>
                <div className='production-modal__article-modal' style={{overflow:'auto'}}>
                        <div className="card " style={{zoom:'80%'}} >
                            <div className="card-body bg-standar">
                                <div className='d-flex justify-content-between'>
                                    <h3 className="text">{productionToUpdate.serie}-{productionToUpdate.folio}-{productionToUpdate.anio}</h3>
                                    <div>
                                        <button type='button' className='btn__general-warning-200' onClick={() => setModalSubSub('logbook__production-modal')}>Bitacora</button>
                                    </div>
                                </div>
                                <hr />
                                <div className='row'>
                                    <div className='col-4 md-col-4'>
                                        <span className='text'>Creado por2: <b>{productionToUpdate.usuario_crea}</b></span><br />
                                        <span className='text'>Fecha envio producción: <b>{productionToUpdate.fecha_creacion}</b></span><br />
                                        <span className='text'>Fecha Entrega: <b>{productionToUpdate.fecha_entrega} {productionToUpdate.hora_entrega}</b></span><br />
                                        {productionToUpdate.motivo_modify_te != 0 ?
                                            <b className='text' style={{ color: 'red' }} title='Esta leyenda aparece cuando las fechas son ingresadas de forma manual'>
                                                Esta orden tiene Fechas de Entrega Modificadas</b>
                                            : ''}
                                        <p>{productionToUpdate.status == 0 ? <b style={{ color: 'green' }}>ACTIVO</b> :
                                            productionToUpdate.status == 1 ? <b style={{ color: 'red' }}>CANCELADO</b> :
                                                productionToUpdate.status == 2 ? <b style={{ color: 'blue' }}>TERMINADO</b> : <b style={{ color: 'orange' }}>TERMINADO/ENVIADO A SUC.</b>}</p>
                                        <span className='text'><b>Subtotal: ${productionToUpdate?.st?.toFixed(2)}</b></span><br />
                                        {productionToUpdate.urg > 0 && (<><span className='text' style={{ color: 'red' }}><b>Urgencia: {productionToUpdate?.urg?.toFixed(2)}</b></span><br /></>)}
                                        <span className='text'><b>Total: ${productionToUpdate?.total?.toFixed(2)}</b></span><br />

                                    </div>
                                    <div className='col-4 md-col-4'>
                                        <span className='text'>Empresa: <b>{productionToUpdate.empresa}</b></span><br />
                                        <span className='text'>Sucursal de origen: <b>{productionToUpdate.sucursal}</b></span><br />
                                        <span className='text'>Orden de Venta: <b>{productionToUpdate.folio_ov}</b></span><br />

                                    </div>
                                    <div className='col-4 md-col-4'>
                                        Ordenes relacionadas:
                                        {productionToUpdate.relacionados?.map((dat: any, index: number) => {
                                            const collapseId = `search_manual_xOp_${index}`;

                                            return (
                                                <div className="collapse-container" key={collapseId}>
                                                    <input type="checkbox" id={collapseId} className="collapse-toggle" />
                                                    <label htmlFor={collapseId} className="collapse-label">
                                                        {dat.serie}-{dat.folio}-{dat.anio}
                                                    </label>
                                                    <div className="collapse-content">
                                                        {dat.conceptos?.map((c: any, i: number) => (
                                                            <div key={i}>
                                                                <strong>{c.codigo}</strong> - {c.descripcion} ({c.area_actual})
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-12'>
                                        <span className='text'>Comentarios: {productionToUpdate.comentarios}</span>
                                    </div>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <div className='d-flex align-items-end'>
                                        <div className='mr-4'>
                                            <button className='btn__general-orange' type='button' onClick={getPDF}>Imprimir ticket</button>
                                        </div>
                                        <div className='mr-4 d-flex'>
                                            <div className='mr-3'>
                                                <Select dataSelects={areasGral} instanceId='areasGral' nameSelect='Enviar todo a Otra Area:' />
                                            </div>
                                            <div className='d-flex align-items-end'>
                                                <button className='btn__general-purple' onClick={() => sendAreas()}>Enviar</button>
                                            </div>

                                        </div>

                                    </div>

                                    <div className='d-flex align-items-end'>
                                        {checkPermission('enviar_a_sucursal') && (
                                            productionToUpdate.status == 0 ?
                                                <div className='mr-3'>
                                                    <button className='btn__general-primary' onClick={() => enviarASucursal()}>Enviar a sucursal</button>
                                                </div>
                                                :
                                                ''

                                        )}
                                        {checkPermission('terminar') && (
                                            productionToUpdate.status == 0 ?
                                                <div className='mr-3'>
                                                    <button className='mr-3 btn__general-success' onClick={() => finishConcept()}>Terminar orden</button>
                                                </div>
                                                :
                                                ''


                                        )}
                                        {checkPermission('cancelar') && (
                                            productionToUpdate.status == 0 ?
                                                <div className='mr-3'>
                                                    <button className='btn__general-danger' onClick={() => cancelarOp()}>Cancelar</button>
                                                </div>
                                                :
                                                ''

                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    <div className='table__production_modal'  style={{overflow:'auto', zoom:'80%'}}>
                        {productionToUpdate.conceptos ? (
                            <div className='table__numbers'>
                                <p className='text'>Total de articulos</p>
                                <div className='quantities_tables'>{productionToUpdate.conceptos.length}</div>
                            </div>
                        ) : (
                            <p className="text">No hay empresas que mostras</p>
                        )}
                        <div className='table__head'>
                            <div className='thead'>

                                <div className='th'>
                                    <p>Articulo</p>
                                </div>
                                <div className='th'>
                                    <p>Cantidad</p>
                                </div>
                                <div className='th'>
                                    <p>P/U</p>
                                </div>
                                <div className='th'>
                                    <p>Importe</p>
                                </div>
                                <div className='th'>
                                    <p>Desc.</p>
                                </div>
                                <div className='th'>
                                    <p>Urg.</p>
                                </div>
                                <div className='th'>
                                    <p>Total</p>
                                </div>
                                <div className='th'>
                                    <p>Status</p>
                                </div>
                                <div className='th'>
                                    <p>Comentarios</p>
                                </div>
                                <div className='th'>
                                    <p>Area Actual</p>
                                </div>
                            </div>
                        </div>
                        {productionToUpdate.conceptos ? (
                            <div className='table__body'>
                                {productionToUpdate.conceptos?.map((article: any, index: number) => {
                                    return (
                                        <div className='tbody__container' key={index}>
                                            <div className='tbody'>
                                                <div className='td'>
                                                    <p className='folio-identifier'>{article.codigo}-{article.descripcion}</p>
                                                </div>
                                                <div className='td max'>
                                                    <div className='row__one'>
                                                        <div className='td-one'>
                                                            {/* <p className='amount-identifier'>{article.cantidad} {article.name_unidad || article.unidad}</p> */}
                                                            <p className='amount-identifier'>{article.cantidad}</p>
                                                        </div>
                                                        <div className='td-one'>
                                                            <p>$ {(article.total / article.cantidad).toFixed(2)}</p>
                                                        </div>
                                                        <div className='td-one'>
                                                            <p >$ {article.total.toFixed(2)}</p>

                                                        </div>
                                                        <div className='td'>
                                                            <p className={article.monto_descuento > 0 ? 'article-identifier' : ''}>${article.monto_descuento.toFixed(2)}</p>

                                                        </div>

                                                    </div>
                                                    <div className='row__two'>
                                                        {article.campos_plantilla.map((x: any) => (
                                                            <div className='td-two'>
                                                                {x.considerado_total ?
                                                                    <p><b>{x.nombre_campo_plantilla} : {x.valor}</b></p>
                                                                    :
                                                                    <p>{x.nombre_campo_plantilla} : {x.valor}</p>
                                                                }
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className='td-one'>
                                                    <p className={article.monto_urgencia > 0 ? 'urgency-identifier' : ''}>${article.monto_urgencia.toFixed(2)}</p>

                                                </div>
                                                <div className='td-one'>
                                                    <p className='total-identifier'>$ {article.total + article.monto_urgencia - article.monto_descuento}</p>

                                                </div>
                                                <div className='td-one'>
                                                    <p>{article.status_produccion == 0 ? <b className='active-identifier'>ACTIVO</b> :
                                                        article.status_produccion == 1 ? <b className='cancel-identifier'>CANCELADO</b> :
                                                            article.status_produccion == 2 ? <b className='finished-identifier'>TERMINADO</b> : <b style={{ color: 'orange' }}>TERMINADO/ENVIADO A SUC.</b>}</p>
                                                </div>
                                                <div className='td-one'>
                                                    <div>
                                                        <textarea className='inputs__general' placeholder='Comentarios' value={article.obs_produccion} />
                                                    </div>
                                                </div>
                                                <div className='td-one'>
                                                    <select className="mr-3 traditional__selector" value={article.id_area_produccion} onChange={(e) => onChangeAreaConcepto(index, e.target.value)}>
                                                        <option value="" disabled>-- Selecciona una opción --</option>
                                                        {article.areas_produccion.map((option: any, idx: number) => (
                                                            <option key={idx} value={option.id_area
                                                            }>
                                                                {option.nombre_area} - {option.nombre_sucursal}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <div className='d-flex'>
                                                        <div className='d-flex align-items-end'>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='td-one'>
                                                    <button type='button' className='btn__general-purple' onClick={() => sendConceptoAreas(article)}>Enviar a otra area</button>

                                                </div>
                                                <div className='td-one'>
                                                    {checkPermission('terminar') && (
                                                        <div>
                                                            <button className='btn__general-success' type='button' onClick={() => terminarConcepto(article, index)}>Terminar conceptos</button>
                                                        </div>

                                                    )}

                                                </div>
                                                <div className='td-one'>
                                                    {checkPermission('enviar_a_sucursal') && (
                                                        <div>
                                                            <button className='btn__general-purple' type='button' onClick={() => enviarASucursalConcepto(article, index)}>Enviar concepto a sucursal</button>
                                                        </div>

                                                    )}

                                                </div>
                                                <div className='td-one'>
                                                    {checkPermission('cancelar') && (
                                                        <div>
                                                            <button className='btn__general-danger' type='button' onClick={() => cancelarConcepto(article, index)}>Cancelar Concepto</button>
                                                        </div>

                                                    )}

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
                <Binnacle />
            </div>
        </div>
    )
}

export default ModalProduction


