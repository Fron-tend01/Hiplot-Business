import APIs from '../../../../services/services/APIs'
import Swal from 'sweetalert2';
import React, { useEffect, useRef, useState } from 'react'
import DynamicVariables from '../../../../utils/DynamicVariables';
import '../../../../utils/DynamicVariables';
import "./styles/PedidoFranquicias.css"
import Empresas_Sucursales from '../../Dynamic_Components/Empresas_Sucursales';
import { useStore } from 'zustand';
import { storeDv } from '../../../../zustand/Dynamic_variables';
import Filtrado_Articulos_Basic from '../../Dynamic_Components/Filtrado_Articulos_Basic';
import Select from '../../Dynamic_Components/Select';
import { companiesRequests } from '../../../../fuctions/Companies';
import { useSelectStore } from '../../../../zustand/Select';
import useUserStore from '../../../../zustand/General';
import Flatpickr from "react-flatpickr";
import { Spanish } from 'flatpickr/dist/l10n/es.js'; // Importa la localización en español
import { seriesRequests } from '../../../../fuctions/Series';

interface pedido {
  id: number,
  id_sucursal: number,
  id_empresa_proveedor: number,
  id_usuario_crea: number,
  status: true,
  conceptos: any[]
}
interface searcher {
  id: number,
  id_usuario: number,
  id_sucursal: number,
  desde: Date,
  hasta: Date,
  id_serie: number,
  status: number ,
  folio: number
}
const PedidoFranquicias = () => {
  const [pf, setPf] = useState<pedido>({
    id: 0,
    id_sucursal: 0,
    id_empresa_proveedor: 0,
    id_usuario_crea: 0,
    status: true,
    conceptos: []
  })
  const [pfClear] = useState<pedido>({
    id: 0,
    id_sucursal: 0,
    id_empresa_proveedor: 0,
    id_usuario_crea: 0,
    status: true,
    conceptos: []
  })
  const userState = useUserStore(state => state.user);
  let user_id = userState.id
  const [searcher, setSearcher] = useState<searcher>({
    id: 0,
    id_usuario: user_id,
    id_sucursal: 0,
    desde: new Date(),
    hasta: new Date(),
    id_serie: 0,
    status: 0,
    folio: 0
  })
  const [modoXfolio, setModoXfolio] = useState<boolean>(false)
  const [proveedorSearcher, setProveedorSearcher] = useState<any>({})
  const [franquiciaSearcher, setFranquiciaSearcher] = useState<any>({})
  const [sucursalFSearcher, setSucursalFSearcher] = useState<any>({})
  const [proveedor, setProveedor] = useState<any>({})
  const [franquicia, setFranquicia] = useState<any>({})
  const [sucursalF, setSucursalF] = useState<any>({})
  const [campos_ext] = useState<any>([{ nombre: 'cantidad', tipo: 0 }, { nombre: 'id_articulo', tipo: 1, asignacion: 'id' }, { nombre: 'unidad', tipo: 0 },
  { nombre: 'comentarios', tipo: '' }, { nombre: 'unidad_bool', tipo: false }, { nombre: 'unidad_sel', tipo: 0 }])

  const selectData = useSelectStore(state => state.selectedIds)


  const [modal, setModal] = useState<boolean>(false)
  const [modoUpdate, setModoUpdate] = useState<boolean>(false)

  const [series, setSeries] = useState<any>({})

  const { getSeriesXUser }: any = seriesRequests();

  const [data, setData] = useState<any>(null)
  const setArticulos = storeDv(state => state.setArticulos)
  const { articulos }: any = useStore(storeDv)
  const { getCompaniesXUsers }: any = companiesRequests()

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

  const Modal = (modoUpdate: boolean, data: any) => {
    setModal(true)
    setPf(pfClear)
    setArticulos([])
    if (modoUpdate) {
      // DynamicVariables.updateAnyVar(setLf, "id", data.id)
      // DynamicVariables.updateAnyVar(setLf, "nombre", data.nombre)
      // DynamicVariables.updateAnyVar(setLf, "id_empresa", data.id_empresa)
      // DynamicVariables.updateAnyVar(setLf, "id_empresa_franquicia", data.id_empresa_franquicia)
      // selectDataID("proveedor", {id:data.id_empresa})
      // console.log(data);

      // setFranquicia({id: data.id_empresa_franquicia})
      // setSucursalF({id: data.id_sucursal_franquicia})
      // // // //LLENAR LA VARIABLES ARRAY
      // data.articulos.forEach((element: any) => {
      //   DynamicVariables.addObjectInArrayRepeat(element, setArticulos)
      // });
      setModoUpdate(true)
    } else {
      setModoUpdate(false)
    }
  }
  const getData = async () => {
    console.log(searcher);
    searcher.id_sucursal= sucursalFSearcher.id
    searcher.id_serie= selectData.serieSearcher.id
    let result = await APIs.CreateAny(searcher, "pedido_franquicia/get")
    setData(result)
  }
  const getEmpresas = async () => {
    let resultCompanies = await getCompaniesXUsers(user_id)
    setProveedor({
      selectName: 'Proveedor',
      dataSelect: resultCompanies,
      options: 'razon_social'
    })
    setProveedorSearcher({
      selectName: 'Proveedor',
      dataSelect: resultCompanies,
      options: 'razon_social'
    })
  }

  const fetch = async () => {
    await getEmpresas()
    // await getData()
    let resultSerie = await getSeriesXUser(user_id)
    setSeries({
      selectName: 'Serie',
      dataSelect: resultSerie,
      options: 'nombre'
    })


    DynamicVariables.updateAnyVar(setSearcher, "status", 0)

  }
  useEffect(() => {
    fetch()
  }, [])
  const traer_alm_pred_prov = async (index: any) => {
    let data = {
      id_empresa: selectData?.proveedor?.id,
      id_articulo: articulos[index]?.id
    }
    await APIs.CreateAny(data, "obtener_alm_vtaf")
      .then(async (response: any) => {
        if (response.error) {
          Swal.fire('Notificacion', response.mensaje, 'warning');
          setArticulos((prevArticulos) => {
            const updatedArticulos = prevArticulos.slice(0, -1);
            return updatedArticulos;
          });
          setFlag(null);
        } else {
          DynamicVariables.updateAnyVarByIndex(setArticulos, index, 'alm_pred', response.data)
          if (articulos[index].unidad_sel == 0) {
            DynamicVariables.updateAnyVarByIndex(setArticulos, index, 'unidad_sel', articulos[index].unidades[0].id_unidad)
          }
          setFlag(index);
        }

      })
      .catch((error: any) => {
        if (error.response) {
          if (error.response.status === 409) {
            Swal.fire(error.mensaje, '', 'warning');
            setArticulos(prevArticulos => prevArticulos.slice(0, -1));
          } else {
            Swal.fire('Error al obtener el almacen predeterminado del proveedor de franquicia', '', 'error');
            setArticulos(prevArticulos => prevArticulos.slice(0, -1));
          }
        } else {
          setArticulos(prevArticulos => prevArticulos.slice(0, -1));
          Swal.fire('Error de conexión.', '', 'error');
        }
      })
  }
  const [flag, setFlag] = useState<number | null>(null);
  const prevArticulosLength = useRef(articulos.length);

  useEffect(() => {
    const length = articulos.length;

    if (length > 0 && (flag === null || length - 1 !== flag)) {
      traer_alm_pred_prov(length - 1);
    } else {
      setFlag(null)
    }
    prevArticulosLength.current = length;

  }, [articulos, searcher]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (articulos.length == 0) {
      Swal.fire('Notificación', 'Es necesario agregar articulos para la lista de franquicia', 'error');
      return
    }
    setPf(pfClear)

    let createObjLf = { ...pfClear };

    createObjLf.id_empresa_proveedor = selectData.proveedor.id;
    createObjLf.id_sucursal = sucursalF.id;
    createObjLf.id_usuario_crea = user_id
    //------------------------------------------------------------------FULL VALIDACIONES X ARTICULO--------------------------------------------------------------------------------
    let validacion: any[] = []
    await articulos.forEach(async (el: any) => {
      let obt_alm = el.stock.filter((s: any) => s.id == el.alm_pred.id_almacen_pred)
      if (obt_alm.length == 0) {
        let error = 'El articulo ' + el.codigo + '-' + el.descripcion + ' no cuenta con almacen predeterminado en la sucursal predeterminada de ventas para franquicia del proveedor seleccionado'
        validacion.push(error)
      } else {
        let alm = obt_alm[0]
        console.log(el.unidad_sel);

        let eq = await alm.equivalencias.filter((x: any) => x.id_unidad == parseInt(el.unidad_sel))

        if (eq.length == 0) {
          let error = 'El articulo ' + el.codigo + '-' + el.descripcion + ' la unidad seleccionada no concuerda con las unidades en la configuración'
          validacion.push(error)
        } else {
          let equi = eq[0]
          if (equi.cantidad >= el.cantidad) {
            //se inserta el articulo
          } else {
            let error = 'El articulo ' + el.codigo + '-' + el.descripcion + ' la cantidad que se está pidiendo es mayor a la cantidad en su stock: ' + equi.cantidad + ' ' + equi.nombre_unidad
            validacion.push(error)
          }
        }
      }
    });
    if (validacion.length > 0) {
      let str = ''
      validacion.forEach(element => {
        str = str + ' \n\n ' + element
      });
      Swal.fire('Notificacion', str, 'warning');
      return
    }
    createObjLf.conceptos = []
    await articulos.forEach((el: any) => {
      let c = {
        "id_articulo": el.id,
        "cantidad": parseFloat(el.cantidad),
        "unidad": el.unidad_sel,
        "comentarios": el.comentarios
      }
      createObjLf.conceptos.push(c);

    });

    if (modoUpdate) {
      console.log(createObjLf);

      await APIs.CreateAnyPut(createObjLf, "listas_venta_franquicia/update")
        .then(async (response: any) => {
          Swal.fire('Notificación', response.mensaje, 'success');
          await getData()
          setPf(pfClear)
          setModal(false)
        })
        .catch((error: any) => {
          if (error.response) {
            if (error.response.status === 409) {
              Swal.fire(error.mensaje, '', 'warning');
            } else {
              Swal.fire('Error al actualizar la urgencia', '', 'error');
            }
          } else {
            Swal.fire('Error de conexión.', '', 'error');
          }
        })
    } else {
      await APIs.CreateAny(createObjLf, "pedido_franquicia/create")
        .then(async (response: any) => {
          if (!response.error) {
            Swal.fire('Notificación', response.mensaje, 'success');
            await getData()
            setPf(pfClear)
            setModal(false)

          } else {
            Swal.fire('Notificación', response.mensaje, 'warning');
            return
          }
        })
        .catch((error: any) => {
          if (error.response) {
            if (error.response.status === 409) {
              Swal.fire(error.mensaje, '', 'warning');
            } else {
              Swal.fire('Error al crear la urgencia', '', 'error');
            }
          } else {
            Swal.fire('Error de conexión.', '', 'error');
          }
        })
    }

  }

  const mostrar_stock = (art: any) => {
    const tableHeaders = `
    <tr>
      <th>Almacen</th>
      <th>Stock (+equivalencias)</th>
    </tr>
  `;
    const tableRows = art.stock.map((dat: any, index: number) => {
      if (dat.id == art.alm_pred.id_almacen_pred) {

        const equivalencias = dat.equivalencias.map((eq: any) => `
      <div>
      ${eq.nombre_unidad}: ${eq.cantidad}
      </div>
      `).join('');

        return `
      <tr key=${index}>
      <td>${dat.nombre}</td>
      <td>${equivalencias}</td>
      </tr>
      `;
      }
    }).join('');

    const tableHtml = `
  <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
    <thead>${tableHeaders}</thead>
    <tbody>${tableRows}</tbody>
  </table>
`;
    Swal.fire({
      title: "Stock del Articulo",
      html: tableHtml,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: `
        <i class="fa fa-thumbs-up"></i> Great!
      `,
      confirmButtonAriaLabel: "Thumbs up, great!",
    });
  }

  const handleClick = (val:any) => {
    DynamicVariables.updateAnyVar(setSearcher, "status", val)
  };

  console.log("searcher", searcher)
  return (
    <div className='te'>
      <div className='te__container'>

        <div className='row'>
          {modoXfolio ?
            (<div className='col-11 slideLeft'>
              <div className='row'>
                <div className='col-4 md-col-4 sm-col-12'>
                  <Select dataSelects={series} instanceId='serieSearcher' ></Select>

                </div>
                <div className='col-6 md-col-6 sm-col-12'>
                  <div>
                    <label className='label__general'>Folio</label>
                    <div className='warning__general'><small >Este campo es obligatorio</small></div>
                    <input className={`inputs__general`} type="text" value={searcher.folio} onChange={(e) => DynamicVariables.updateAnyVar(setSearcher, "folio", parseInt(e.target.value))} placeholder='Ingresa el folio' />
                  </div>
                </div>
                <div className='col-2 md-col-2 sm-col-12'>
                  <label className='label__general'>Buscar</label>
                  <button className='btn__general-success' onClick={() => Modal(false, 0)}>Buscar</button>
                </div>
              </div>

            </div>)
            :
            (<div className='col-11 slideRight'>
              <div className='row'>
                <div className='col-8 md-col-8 sm-col-12'>
                  <Empresas_Sucursales modeUpdate={false} empresaDyn={franquiciaSearcher} sucursalDyn={sucursalFSearcher}
                    setEmpresaDyn={setFranquiciaSearcher} setSucursalDyn={setSucursalFSearcher}></Empresas_Sucursales>
                </div>
                <div className='col-4 md-col-4 sm-col-12'>
                  <Select dataSelects={proveedorSearcher} instanceId='proveedorSearcher' ></Select>
                </div>
              </div>
              <div className='row'>
                <div className='col-4 md-col-4 sm-col-12'>
                  <label className='label__general'>Fechas</label>
                  <div className='container_dates__requisition'>
                    <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={date} onChange={handleDateChange} placeholder='seleciona las fechas' />
                  </div>
                </div>
                <div className='col-6 md-col-4 sm-col-12 container__checkbox_orders'>
                  <div className='col-4 md-col-4 sm-col-12 checkbox__orders'>
                    <label className="checkbox__container_general">
                      <input className='checkbox' type="radio" name="requisitionStatus" checked={searcher.status == 0 ? true : false} onChange={()=>handleClick(0)} />
                      <span className="checkmark__general"></span>
                    </label>
                    <p className='title__checkbox text'>Activo</p>
                  </div>
                  <div className='col-4 md-col-4 sm-col-12 checkbox__orders'>
                    <label className="checkbox__container_general">
                      <input className='checkbox' type="radio" name="requisitionStatus" value={searcher.status} onChange={()=>handleClick(1)} />
                      <span className="checkmark__general"></span>
                    </label>
                    <p className='title__checkbox text'>Cancelados</p>
                  </div>
                  <div className='col-4 md-col-4 sm-col-12 checkbox__orders'>
                    <label className="checkbox__container_general">
                      <input className='checkbox' type="radio" name="requisitionStatus" value={searcher.status} onChange={()=>handleClick(2)} />
                      <span className="checkmark__general"></span>
                    </label>
                    <p className='title__checkbox text'>Terminados</p>
                  </div>
                </div>
                <div className='col-2 md-col-2 sm-col-12 justify-content-center '>
                  <label className='label__general'>Buscar</label>
                  <button className='btn__general-success' onClick={() => Modal(false, 0)}>Buscar</button>
                </div>
              </div>
            </div>
            )}
          <div className='col-1' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            {modoXfolio ?
              <div title='FILTRADO GENERAL'>

                <svg onClick={() => {setModoXfolio(!modoXfolio); DynamicVariables.updateAnyVar(setSearcher,"id_serie",0)}} style={{ cursor: 'pointer' }} width={30} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" /></svg>
              </div>
              :
              <div title='FILTRADO POR SERIE'>
                <svg onClick={() => {setModoXfolio(!modoXfolio);DynamicVariables.updateAnyVar(setSearcher,"id_serie",0)}} style={{ cursor: 'pointer' }} width={30} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" /></svg>

              </div>
            }
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <div className='btns__create'>
              <button className='btn__general-purple' onClick={() => Modal(false, 0)}>Realizar Pedido de Franquicia</button>
            </div>
          </div>
        </div>


        {/* -------------------------------------------------------------MODALES----------------------------------------------------------------------------- */}
        <div className={`overlay__create_modal ${modal ? 'active' : ''}`}>
          <div className={`popup__create_modal ${modal ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__create_modal" onClick={() => setModal(false)}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
            </a>
            {modoUpdate ?
              <p className='title__modals'><b>Actualizar Pedido de Franquicia</b></p>
              :
              <p className='title__modals'><b>Crear Pedido de Franquicia</b></p>
            }
            <hr />
            <div className='row'>
              <div className='col-8 md-col-8 sm-col-12'>
                <Empresas_Sucursales modeUpdate={modoUpdate} empresaDyn={franquicia} sucursalDyn={sucursalF}
                  setEmpresaDyn={setFranquicia} setSucursalDyn={setSucursalF}></Empresas_Sucursales>
              </div>
              <div className='col-4 md-col-4 sm-col-12'>
                <Select dataSelects={proveedor} instanceId='proveedor' ></Select>
              </div>
            </div>
            {selectData?.proveedor != undefined ?
              <div className='row'>
                <div className='col-12'>
                  <br />
                  <hr />
                  <label className='label__general'>AGREGAR ARTICULOS</label>
                  <hr />
                  <br />

                  <Filtrado_Articulos_Basic campos_ext={campos_ext} id_empresa_proveedor={selectData?.proveedor?.id} id_sucursal_franquicia={sucursalF.id}
                    get_unidades={true} get_stock={true} />
                  <br />
                  <div className='table__modal '>
                    <div>
                      {articulos.length >= 1 ? (
                        <div>
                          <p className='text'>Articulos en la Lista ({articulos.length})</p>
                        </div>
                      ) : (
                        <p className='text'>No hay Articulos</p>
                      )}
                    </div>
                    <div className='table__head'>
                      <div className='thead'>
                        <div className='th'>
                          <p className=''>Articulo</p>
                        </div>
                        <div className='th'>
                          <p className=''>Cantidad</p>
                        </div>
                        <div className='th'>
                          <p className=''>Unidad</p>
                        </div>
                        <div className='th'>
                          <p className=''>Comentarios</p>
                        </div>
                        <div className='th'>
                          <p className=''>OPT</p>
                        </div>
                      </div>
                    </div>
                    {Array.isArray(articulos) && articulos.length > 0 ? (
                      <div className='table__body'>
                        {articulos.map((dat: any, index: number) => (

                          <div className='tbody__container' key={index}>
                            <div className='tbody'>
                              <div className='td'>
                                {dat.codigo} - {dat.descripcion}
                              </div>

                              <div className='td'>
                                <input className={`inputs__general`} type="number" value={dat.cantidad}
                                  onChange={(e) => { DynamicVariables.updateAnyVarByIndex(setArticulos, index, "cantidad", e.target.value); }}
                                />
                              </div>
                              <div className='td'>
                                <select className={`inputs__general`}
                                  onChange={(e) => { DynamicVariables.updateAnyVarByIndex(setArticulos, index, "unidad_sel", e.target.value) }}>
                                  {dat?.unidades.map((option: any, i: number) => (
                                    <option key={i} value={option.id_unidad}>
                                      {option.nombre}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className='td'>
                                <textarea className={`inputs__general`} value={dat.comentarios}
                                  onChange={(e) => { DynamicVariables.updateAnyVarByIndex(setArticulos, index, "comentarios", e.target.value); }}
                                />
                              </div>
                              <div className='td'>
                                <button className='btn__general-orange mr-5' type="button" onClick={() => mostrar_stock(dat)}>Stock</button>
                                <button className='btn__delete_users' type="button" onClick={() => {
                                  DynamicVariables.removeObjectInArray(setArticulos, index);
                                  { modoUpdate && dat.id != 0 ? DynamicVariables.updateAnyVarSetArrNoRepeat(setPf, "conceptos", dat.id) : null }
                                }}>Eliminar</button>
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className='text'>No hay articulos que cargar</p>
                    )}
                  </div>
                </div>
              </div>
              : ''}
            <br /><br /><br />
            <div className='btns__create'>
              <button className='btn__general-purple' onClick={(e) => create(e)}>Guardar</button>
            </div>
          </div>
        </div>
        {/* -------------------------------------------------------------FIN MODALES----------------------------------------------------------------------------- */}

      </div>
    </div>
  )
}

export default PedidoFranquicias
