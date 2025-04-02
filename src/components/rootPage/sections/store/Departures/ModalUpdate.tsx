import React from 'react'
import { storeWarehouseExit } from '../../../../../zustand/WarehouseExit'
import { useStore } from 'zustand';
import './ModalUpdate.css'

interface Articles {
    conceptsUpdate: any
}


const ModalUpdate: React.FC<Articles> = ({ conceptsUpdate }) => {

    const setModal = storeWarehouseExit(state => state.setModal);
    const { modal } = useStore(storeWarehouseExit)

    const getPdf = async () => {
        window.open('http://hiplot.dyndns.org:84/api_dev/pdf_salida/' + conceptsUpdate.id, '_blank');

    }

    const descargarCSV = () => {
        let data = conceptsUpdate;
        if (!data) return;

        // Encabezado principal
        const encabezadoPrincipal = ["SERIE", "FOLIO", "AÑO", "FECHA CREACIÓN", "USUARIO CREA", "SUCURSAL", "EMPRESA"];
        const valoresPrincipales = [
            data.serie,
            data.folio,
            data.anio,
            data.fecha_creacion,
            data.usuario_crea,
            data.sucursal,
            data.empresa
        ].join(",");

        // Encabezado para los conceptos
        const encabezadoConceptos = ["ARTÍCULO", "PEDIDO", "CANT.", "UNIDAD", "ENTRADAS AFECT.", "COMENTARIOS"];

        // Filas de conceptos
        const filasConceptos = data.conceptos.map((order) => {
            const entradasAfectadas = order.entradas_afectadas?.map(ent => `${ent.serie}-${ent.folio}-${ent.anio}`).join(" || ") || "";
            return [
                `${order.codigo}-${order.descripcion}`,
                order.ped ? order.ped : "No aplica",
                order.cantidad,
                order.unidad,
                entradasAfectadas,
                order.comentarios
            ].join(",");
        });

        // Unir todo en un solo CSV
        const csvContenido = [
            encabezadoPrincipal.join(","),
            valoresPrincipales,
            "", // Línea vacía para separación
            encabezadoConceptos.join(","),
            ...filasConceptos
        ].join("\n");

        // Crear y descargar el archivo
        const blob = new Blob([csvContenido], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `pedido_${data.id}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (
        <div className={`overlay__departures-modal-update ${modal == 'modal-update__concepts' ? 'active' : ''}`}>
            <div className={`popup__departures-modal-update ${modal == 'modal-update__concepts' ? 'active' : ''}`} style={{ overflow: 'scroll' }}>
                <a href="#" className="btn-cerrar-popup__departures-modal-update" onClick={() => setModal('')}>
                    <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                </a>
                <div className='container__departures-modal-update' >
                    <div className='modal-concepts_departures' >
                        <div className=''>
                            <div className="card ">
                                <div className="card-body bg-standar">
                                    <h3 className="text">{conceptsUpdate.serie}-{conceptsUpdate.folio}-{conceptsUpdate.anio}</h3>
                                    <hr />
                                    <div className='row'>
                                        <div className='col-6 md-col-12'>
                                            <span className='text'>Creado por: <b>{conceptsUpdate.usuario_crea}</b></span><br />
                                            <span className='text'>Fecha de Creación: <b>{conceptsUpdate.fecha_creacion}</b></span><br />
                                        </div>
                                        <div className='col-6 md-col-12'>
                                            <span className='text'>Empresa: <b>{conceptsUpdate.empresa}</b></span><br />
                                            <span className='text'>Sucursal: <b>{conceptsUpdate.sucursal}</b></span><br />
                                            <span className='text'>Almacen: <b>{conceptsUpdate.almacen}</b></span>
                                        </div>
                                        <button type="button" className='btn__general-orange' onClick={() => descargarCSV()}>Excel</button>

                                    </div>
                                    <div className='row'>
                                        <div className='col-12'>
                                            <span className='text'>Comentarios: {conceptsUpdate.comentarios}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div>
                                <div>
                                    {conceptsUpdate.conceptos ? (
                                        <div className='table__numbers'>
                                            <p className='text'>Total de conceptos</p>
                                            <div className='quantities_tables'>{conceptsUpdate.conceptos?.length}</div>
                                        </div>
                                    ) : (
                                        <p className='text'>No hay stock</p>
                                    )}
                                </div>
                                <div className="" style={{ textAlign: "left" }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                        <thead className="table__head">
                                            <tr className="thead">
                                                <th>Articulo</th>
                                                <th>Pedido</th>
                                                <th>Cant.</th>
                                                <th>Unidad</th>
                                                <th>Entradas Afect.</th>
                                                <th>Comentarios</th>
                                            </tr>
                                        </thead>
                                        <tbody className="table__body" >
                                            {conceptsUpdate.conceptos && conceptsUpdate.conceptos.length > 0 ? (
                                                conceptsUpdate.conceptos?.map((concept: any, index: number) => (
                                                    <tr className="tbody__container" key={index}>
                                                        <td>{concept.codigo}-{concept.descripcion}</td>
                                                        <td> {concept.ped ?
                                                            concept.ped
                                                            :
                                                            <p>No aplica</p>
                                                        }</td>
                                                        <td style={{ border: '1px solid black', textAlign: 'center' }}>{concept.cantidad}</td>
                                                        <td>{concept.unidad}</td>
                                                        <td>
                                                            {concept.entradas_afectadas?.map((ent: any, i: number) => (
                                                                <span key={i}>
                                                                    {ent.serie}-{ent.folio}-{ent.anio} ||
                                                                </span>
                                                            ))}
                                                        </td>
                                                        <td>{concept.comentarios}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={10} style={{ textAlign: "center" }}>
                                                        No hay requisiciones disponibles
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div> */}
                            <div className='table__departures-modal-update'>
                                {conceptsUpdate.conceptos ? (
                                    <div className='table__numbers'>
                                        <p className='text'>Total de pedidos</p>
                                        <div className='quantities_tables'>{conceptsUpdate.conceptos.length}</div>
                                    </div>
                                ) : (
                                    <p className="text">No hay empresas que mostras</p>
                                )}
                                <div className="table">
                                    <div className='table__head'>
                                        <div className='thead'>
                                            <div className='th'>
                                                <p>Artículo</p>
                                            </div>
                                            <div className='th'>
                                                <p>Pedido</p>
                                            </div>
                                            <div className='th'>
                                                <p>Cant.</p>
                                            </div>
                                            <div className='th'>
                                                <p>Unidad</p>
                                            </div>
                                            <div className='th'>
                                                <p>Entradas Afect.</p>
                                            </div>
                                            <div className="th">
                                                <p>Comentarios</p>
                                            </div>
                                        </div>
                                    </div>
                                    {conceptsUpdate.conceptos ? (
                                        <div className='table__body'>
                                            {conceptsUpdate.conceptos.map((order: any) => {
                                                return (
                                                    <div className='tbody__container' key={order.id}>
                                                        <div className='tbody'>
                                                            <div className='td'>
                                                                <p className="folio-identifier">{order.codigo}-{order.descripcion}</p>
                                                            </div>
                                                            <div className='td'>
                                                                {order.ped ?
                                                                    order.ped
                                                                    :
                                                                    <p>No aplica</p>
                                                                }
                                                                <br />
                                                                {order?.orden_produccion ?
                                                                    order?.orden_produccion?.folio
                                                                    :
                                                                    ''
                                                                }
                                                            </div>
                                                            <div className='td'>
                                                                <p className='amount-identifier'>{order.cantidad}</p>
                                                            </div>
                                                            <div className='td'>
                                                                <p className='unit-identifier'>{order.unidad}</p>
                                                            </div>
                                                            <div className='td'>
                                                                {order.entradas_afectadas?.map((ent: any, i: number) => (
                                                                    <span key={i}>
                                                                        {ent.serie}-{ent.folio}-{ent.anio} ||
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            <div className='td'>
                                                                <p>{order.comentarios}</p>
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
                        </div>
                    </div>
                </div>
                <div className='mt-3 d-flex justify-content-between'>
                    <div>
                        <button className='btn__general-orange' type='button' onClick={getPdf}>PDF</button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ModalUpdate
