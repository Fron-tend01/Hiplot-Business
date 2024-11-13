import { useState, useEffect } from "react"
import { storeOrdes } from "../../../../../zustand/Ordes";
import  './styles/ModalCreate.css'
import './styles/ModalUpdate.css'


const ModalUpdate = ({oderUpdate, orderConceptsUpdate}: any, ) => {
    const {updateModeOrders, updateModeConceptsOrders, getPdfOrders}: any = storeOrdes()


    
    const [modeOrder, setModeOrder] = useState<any>(null)
  
    useEffect(() => {
    
      setModeOrder(oderUpdate.status)
    }, [oderUpdate, orderConceptsUpdate])
   
    const changeOrderMode = async () => {
      let id = oderUpdate.id;
      // let id_usuario = user_id;
      // let id_sucursal = oderUpdate.id_sucursal;
      // let id_area = oderUpdate.id_area;
      // let desde = oderUpdate;
      // let hasta = oderUpdate;
      // let id_serie = oderUpdate;
      let status = modeOrder === 0 ? 1 : 0;
      // let folio = oderUpdate.folio;
      // setModeOrder(status)
      await updateModeOrders({id, status})
    }



    const changeConceptsOrderMode = async (order: any) => {
      let id = order.id;
      // let id_usuario = user_id;
      // let id_sucursal = oderUpdate.id_sucursal;
      // let id_area = oderUpdate.id_area;
      // let desde = oderUpdate;
      // let hasta = oderUpdate;
      // let id_serie = oderUpdate;
      let status = order.status === 0 ? 1 : 0;
      // let folio = oderUpdate.folio;
      await updateModeConceptsOrders({id, status})
    }

    const getPdf = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      let id = oderUpdate.id;
    
      try {
        // Supongamos que tienes el ID de la requisición
        await getPdfOrders(id);
        window.open(`https://hiplotbusiness.com/api_dev/pdf_entrada/${oderUpdate.id}`, '_blank');
      } catch (error) {
        console.error('Error al generar el PDF:', error);
      }
    }

  return (
    <form className='conatiner__update_orders'>
        <div className='row__one'>    
            <div className='container__checkbox_tickets'>
                <div className='checkbox__tickets'>
                    <label className="checkbox__container_general">
                    <input className='checkbox' type="radio" value="Directa" checked={oderUpdate.status === 0}/>
                        <span className="checkmark__general"></span>
                    </label>
                    <p className='text'>Directa</p>
                </div>
                <div className='checkbox__tickets'>
                    <label className="checkbox__container_general">
                    <input className='checkbox' type="radio" value="PorOC" checked={oderUpdate.status === 1}/>
                        <span className="checkmark__general"></span>
                    </label>
                    <p className='text'>Por OC</p>
                </div>
            </div>
        </div>
        <div className="card ">
                <div className="card-body bg-standar">
                  <h3 className="text">{oderUpdate.serie}-{oderUpdate.folio}-{oderUpdate.anio}</h3>
                  <hr />
                  <div className='row'>
                    <div className='col-6 md-col-12'>
                      <span className='text'>Creado por: <b>{oderUpdate.usuario_crea}</b></span><br />
                      <span className='text'>Fecha de Creación: <b>{oderUpdate.fecha_creacion}</b></span><br />
                      <span className='text'>Titulo: <b>{oderUpdate.titulo}</b> </span>
                        {oderUpdate.status === 0 ? (
                          <span className="active-status">Activo</span>
                        ) : oderUpdate.status === 1 ? (
                          <span className="canceled-status">Cancelada</span>
                        ) : (
                          oderUpdate.status === 2 ? (
                            <span className="end-status">Terminado</span>
                          ) : (
                            ""
                          )
                        )}

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
        <div className='table__modal_update_orders' >
            <div>
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
                            <p className=''>OP</p>
                        </div>
                        <div className='th'>
                            <p className=''>Unidad</p>
                        </div>
                        <div className='th'>
                            <p className=''>Cantidad</p>
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
                                    <p>N/A</p>
                                </div>
                            </div>
                            <div className='td'>
                                <div>
                                  <p>{order.unidad}</p>
                                </div>
                            </div>
                            <div className='td'>
                              <div>
                                    <p>{order.cantidad}</p>
                                  </div>
                              </div>
                            <div className='td'>
                                <div>
                                  <p>{order.comentarios}</p>
                                </div>
                            </div>
                            <div className='td'>
                                <div>
                                  {order.status === 0 ?
                                    <button className="btn__general_light-danger" type="button" onClick={() => changeConceptsOrderMode(order)}>Cancelar</button>
                                    :
                                    <button className="btn__general-success" type="button" onClick={() => changeConceptsOrderMode(order)}>Activar</button>
                                  }
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
        </div>
        <div className="row__six">
          <div>
            <button className="btn__general-purple" type="button" onClick={getPdf}>PDF</button>
          </div>
          <div>
            {modeOrder === 0 ?
            <button className="btn__general-danger" type="button" onClick={changeOrderMode}>Calncelar</button>
            :
            <button className="btn__general-success" type="button" onClick={changeOrderMode}>Activar</button>
            }
          </div>
        </div>
    </form>
  )
}

export default ModalUpdate
