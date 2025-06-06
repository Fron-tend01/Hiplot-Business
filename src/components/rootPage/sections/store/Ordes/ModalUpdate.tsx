import { useState, useEffect } from "react"
import { storeOrdes } from "../../../../../zustand/Ordes";
import './styles/ModalCreate.css'
import './styles/ModalUpdate.css'
import { storeModals } from "../../../../../zustand/Modals";
import useUserStore from "../../../../../zustand/General";
import APIs from "../../../../../services/services/APIs";
import Swal from "sweetalert2";
import { storeArticles } from "../../../../../zustand/Articles";
import { storeDv } from "../../../../../zustand/Dynamic_variables";
import DynamicVariables from "../../../../../utils/DynamicVariables";


const ModalUpdate = ({ oderUpdate }: any,) => {
  const userState = useUserStore(state => state.user);
  const user_id = userState.id

  const setOrderConceptsUpdate = storeOrdes(state => state.setOrderConceptsUpdate)
  const { updateModeOrders, updateModeConceptsOrders, getPdfOrders, orderConceptsUpdate }: any = storeOrdes()

  const { getOrdedrs, dates }: any = storeOrdes();
  const { modal }: any = storeModals();
  const setModal = storeModals(state => state.setModal)

  const [modeOrder, setModeOrder] = useState<any>(null)
  const setModalLoading = storeArticles((state: any) => state.setModalLoading);

  console.log(oderUpdate)

  useEffect(() => {

    setModeOrder(oderUpdate.status)
  }, [oderUpdate, orderConceptsUpdate])

  const changeOrderMode = async () => {
    const id = oderUpdate.id;
    const data = {
      id_usuario: user_id,
      id_sucursal: 0,
      desde: dates[0],
      hasta: dates[1],
      status: [0],
      light: true

    }
    const status = modeOrder === 0 ? 1 : 0;

    try {
      setModalLoading(true)
      await updateModeOrders({ id, status })
      setModalLoading(false)
      await getOrdedrs(data)
      setModal('')
    } catch (error) {
      setModalLoading(false)

    }

  }



  const changeConceptsOrderMode = async (order: any, i: number) => {
    const id = order.id;
    const data = {
      id_usuario: user_id,
      id_sucursal: 0,
      desde: dates[0],
      hasta: dates[1],
      status: 0,
      light: true

    }
    const status = order.status === 0 ? 1 : 0;

    try {
      setModalLoading(true)
      await updateModeConceptsOrders({ id, status })
      const updated = [...orderConceptsUpdate];
      updated[i] = {
        ...updated[i],
        status: status
      };

      setOrderConceptsUpdate(updated);
      setModalLoading(false)
      // await getOrdedrs(data)
    } catch (error) {
      setModalLoading(false)

    }
  }


  const [selectedUnit, setSelectedUnit] = useState<any[]>([]);
  const handleSelectUnits = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const valorSeleccionado = parseInt(event.target.value, 10); // Base 10 para números decimales
    const newArticleStates = oderUpdate.conceptos.map((concept: any, i: number) =>
      i === index ? { ...concept, unidad: valorSeleccionado } : concept
    );

    setOrderConceptsUpdate(newArticleStates);    // Crear una copia del arreglo de selecciones temporales
    const nuevasSelecciones = [...selectedUnit];
    // Actualizar el valor seleccionado en la posición del índice correspondiente
    nuevasSelecciones[index] = valorSeleccionado;
    // Actualizar el estado con las nuevas selecciones
    setSelectedUnit(nuevasSelecciones);
  };

  console.log(oderUpdate)

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = parseInt(e.target.value);
    const newArticleStates = orderConceptsUpdate.map((concept: any, i: number) =>
      i === index ? { ...concept, cantidad: value } : concept
    )
    setOrderConceptsUpdate(newArticleStates);
  };

  const update = async () => {
    try {
      let response: any = await APIs.updateOrders(orderConceptsUpdate);
      if (response.error) {
        Swal.fire({
          icon: "warning",
          title: "¡Advertencia!",
          text: response.mensaje,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Aceptar",
        });

      } else {
        Swal.fire({
          icon: "success",
          title: "¡Actualización exitosa!",
          text: response.mensaje,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Aceptar",
        });
        setModal('');
      }

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error en la actualización",
        text: "Hubo un problema al actualizar los pedidos. Inténtalo de nuevo.",
        confirmButtonColor: "#d33",
        confirmButtonText: "Cerrar",
      });
    }
  };


  const getPdf = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const id = oderUpdate.id;

    try {
      // Supongamos que tienes el ID de la requisición
      await getPdfOrders(id);
      window.open(`http://hiplot.dyndns.org:84/api_dev/pdf_pedido/${oderUpdate.id}`, '_blank');
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    }
  }

  const checkPermission = (elemento: string) => {
    const permisosxVista = storeDv.getState().permisosxvista; // Obtiene el estado actual
    console.log(permisosxVista);
    console.log(elemento);

    return permisosxVista.some((x: any) => x.titulo === elemento);
  };

  const descargarCSV = () => {
    let data = oderUpdate
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
    const encabezadoConceptos = ["CODIGO", "DESCRIPCION", "CANTIDAD", "UNIDAD", "ORDEN PRODUCCIÓN", "COMENTARIOS"];

    // Filas de conceptos
    const filasConceptos = data.conceptos.map((concepto: any) =>
      [
        concepto.codigo,
        concepto.descripcion,
        concepto.cantidad,
        concepto.unidad,
        concepto.orden_produccion.folio,
        concepto.comentarios
      ].join(",")
    );

    // Unir todo en un solo CSV
    const csvContenido = [
      encabezadoPrincipal.join(","),
      valoresPrincipales,
      "",
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


  const handleSeleccion = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const valueUnit = parseInt(event.target.value, 10);

    const updatedConcepts = orderConceptsUpdate.map((concept, i) => {
      if (i === index) {
        return {
          ...concept,
          unidad: valueUnit,
          id_unidad: valueUnit,
          cantidad: 0
        };
      }
      return concept;
    });

    setOrderConceptsUpdate(updatedConcepts);
  };


  return (
    <div className={`overlay__orders ${modal == 'modal-orders-update' ? 'active' : ''}`}>
      <div className={`popup__orders ${modal == 'modal-orders-update' ? 'active' : ''}`}>
        <a href="#" className="btn-cerrar-popup__orders" onClick={() => setModal('')}>
          <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
        </a>
        <p className='title__modals'>Actualizar pedido</p>
        <div className='modal_update_orders'>
          <div className="conatiner__update_orders">
            <div className="card ">
              <div className="card-body bg-standar">
                <h3 className="text">{oderUpdate.serie}-{oderUpdate.folio}-{oderUpdate.anio}</h3>
                <hr />
                <div className='row'>
                  <div className='col-6 md-col-12'>
                    <span className='text'>Creado por: <b>{oderUpdate.usuario_crea}</b></span><br />
                    <span className='text'>Fecha de Creación: <b>{oderUpdate.fecha_creacion}</b></span><br />
                    {oderUpdate.status == 0 ?
                      <b style={{ color: 'green' }}>ACTIVO</b>
                      : oderUpdate.status == 1 ?
                        <b style={{ color: 'red' }}>CANCELADO</b> :
                        <b style={{ color: 'blue' }}>TERMINADO</b>}


                  </div>
                  <div className='col-6 md-col-12'>
                    <span className='text'>Empresa: <b>{oderUpdate.empresa}</b></span><br />
                    <span className='text'>Sucursal: <b>{oderUpdate.sucursal}</b></span><br />
                    <span className='text'>Area: <b>{oderUpdate.area}</b></span>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-12'>
                    <span className='text'>Comentarios: {oderUpdate.comentarios}</span>

                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className='table__modal_update_orders' >
            <div>
              {orderConceptsUpdate ? (
                <div className='table__numbers'>
                  <p className='text'>Total de articulos</p>
                  <div className='quantities_tables'>{orderConceptsUpdate.length}</div>
                </div>
              ) : (
                <p className='text'>No hay empresas</p>
              )}
            </div>

            <div className='table__head'>
              <div className='thead'>
                <div className='th'>
                  <p className=''>Articulo</p>
                </div>
                <div className='th'>
                  <p className=''>Status</p>
                </div>
                <div className='th'>
                  <p className=''>OP</p>
                </div>
                <div className='th'>
                  <p className=''>Surtido</p>
                </div>
                <div className='th'>
                  <p className=''>Cantidad</p>
                </div>
                <div className='th'>
                  <p className=''>Unidad</p>
                </div>
                <div className='th'>
                  <p className=''>Salidas</p>
                </div>
                <div className='th'>
                  <p className=''>Comentarios</p>
                </div>
              </div>
            </div>
            {orderConceptsUpdate.length > 0 ? (
              <div className='table__body'>
                {orderConceptsUpdate.map((order: any, index: any) => (
                  <div className='tbody__container' key={index}>
                    <div className='tbody'>
                      <div className='td'>
                        <p>{order.descripcion}</p>
                      </div>
                      <div className="td">
                        <div>
                          {order.status == 0 ?
                            <b style={{ color: 'green' }}>ACTIVO</b>
                            : order.status == 1 ?
                              <b style={{ color: 'red' }}>CANCELADO</b> :
                              <b style={{ color: 'blue' }}>TERMINADO</b>}

                        </div>
                      </div>
                      <div className="td">
                        <div>
                          <p>{order?.orden_produccion ? order?.orden_produccion.folio : "N/A"}</p>
                        </div>
                      </div>
                      <div className='td'>
                        {order.surtido}
                      </div>
                      <div className='td'>
                        <div>
                          <div>
                            <input className='inputs__general' value={order.cantidad === null ? '' : order.cantidad}
                              onChange={(e) => handleAmountChange(e, index)} type="number" placeholder='Cantidad' onWheel={(e) => e.currentTarget.blur()} />
                          </div>
                        </div>
                      </div>
                      <div className='td'>
                        <div className='td'>
                          <div>
                            <select className='traditional__selector' onChange={(event) => handleSeleccion(event, index)} value={order.id_unidad}>
                              {order.unidades?.map((unit: any) => (
                                <option key={unit.id} value={unit.id_unidad}>
                                  {unit.nombre}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className='td'>
                        <div>
                          {order.salidas?.map((sa: any) => (
                            <p>{sa.folio}</p>
                          ))}
                        </div>
                      </div>
                      <div className='td'>
                        <div>
                          <p>{order.comentarios}</p>
                        </div>
                      </div>
                      <div className='td'>
                        <div className="d-flex">
                          {checkPermission('cancelar') && (

                            order.status === 0 ?
                              <div className='cancel-icon' onClick={() => changeConceptsOrderMode(order, index)} title='Cancelar concepto'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ban"><circle cx="12" cy="12" r="10" /><path d="m4.9 4.9 14.2 14.2" /></svg>
                              </div>
                              :
                              <div className='active-icon' onClick={changeOrderMode} title='Activar concepto'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-power"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 6a7.75 7.75 0 1 0 10 0" /><path d="M12 4l0 8" /></svg>
                              </div>

                          )}

                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text'>No hay aritculos que mostrar</p>
            )}

          </div>
          <div className="row__six">
            {checkPermission('update_btn_excel') && (

              <button type="button" className='btn__general-orange' onClick={() => descargarCSV()}>Excel</button>
            )}
            <div>
              <button className="btn__general-purple" type="button" onClick={getPdf}>PDF</button>
            </div>
            <div>
              {checkPermission('modificar') && (

                <button type="button" className='btn__general-purple' onClick={update}>Actualizar orden</button>
              )}

            </div>
            <div>
              {checkPermission('cancelar') && (

                modeOrder === 0 ?
                  <button className="btn__general-danger" type="button" onClick={changeOrderMode}>Cancelar</button>
                  :
                  <button className="btn__general-success" type="button" onClick={changeOrderMode}>Activar</button>

              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ModalUpdate
