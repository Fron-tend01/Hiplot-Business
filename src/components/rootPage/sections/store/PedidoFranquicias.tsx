import APIs from '../../../../services/services/APIs'
import Swal from 'sweetalert2';
import React, { useEffect, useRef, useState } from 'react'
import DynamicVariables from '../../../../utils/DynamicVariables';
import '../../../../utils/DynamicVariables';
import "./styles/PedidoFranquicias.css"
import Empresas_Sucursales from '../../Dynamic_Components/Empresas_Sucursales';
import Filtrado_Articulos_Basic from '../../Dynamic_Components/Filtrado_Articulos_Basic';
import Select from '../../Dynamic_Components/Select';
import { companiesRequests } from '../../../../fuctions/Companies';
import { useSelectStore } from '../../../../zustand/Select';
import useUserStore from '../../../../zustand/General';
import Flatpickr from "react-flatpickr";
import { Spanish } from 'flatpickr/dist/l10n/es.js'; // Importa la localización en español
import { storeSeries } from '../../../../zustand/Series';

interface pedido {
  id: number,
  id_sucursal: number,
  id_empresa_proveedor: number,
  id_usuario_crea: number,
  status: number,
  conceptos: any[]
}
interface searcher {
  id: number,
  id_usuario: number,
  id_sucursal: number,
  desde: string,
  hasta: string,
  id_serie: number,
  status: number,
  folio: number
}
const PedidoFranquicias = () => {
  const [_, setPf] = useState<pedido>({
    id: 0,
    id_sucursal: 0,
    id_empresa_proveedor: 0,
    id_usuario_crea: 0,
    status: 0,
    conceptos: []
  })
  const [pfClear] = useState<pedido>({
    id: 0,
    id_sucursal: 0,
    id_empresa_proveedor: 0,
    id_usuario_crea: 0,
    status: 0,
    conceptos: []
  })
  const [pfMu, setPfMu] = useState<any>({})
  const userState = useUserStore(state => state.user);
  const user_id = userState.id

  const hoy = new Date();
  const haceUnaSemana = new Date();
  haceUnaSemana.setDate(hoy.getDate() - 7);

  // Inicializa el estado con las fechas formateadas
  const [date, setDate] = useState([
    haceUnaSemana.toISOString().split('T')[0],
    hoy.toISOString().split('T')[0]
  ]);
  const [searcher, setSearcher] = useState<searcher>({
    id: 0,
    id_usuario: user_id,
    id_sucursal: 0,
    desde: date[0],
    hasta: date[1],
    id_serie: 0,
    status: 0,
    folio: 0
  })
  const [proveedorSearcher, setProveedorSearcher] = useState<any>({})
  const [franquiciaSearcher, setFranquiciaSearcher] = useState<any>({})
  const [sucursalFSearcher, setSucursalFSearcher] = useState<any>({})
  const [proveedor, setProveedor] = useState<any>({})
  const [franquicia, setFranquicia] = useState<any>({})
  const [sucursalF, setSucursalF] = useState<any>({})
  const [campos_ext] = useState<any>([{ nombre: 'cantidad', tipo: 0 }, { nombre: 'id_articulo', tipo: 1, asignacion: 'id' }, { nombre: 'unidad', tipo: 0 },
  { nombre: 'comentarios', tipo: '' }, { nombre: 'unidad_bool', tipo: false }, { nombre: 'unidad_sel', tipo: 0 }, { nombre: 'precio_unitario', tipo: 0 }, { nombre: 'total', tipo: 0 }])

  const selectData: any = useSelectStore(state => state.selectedIds)


  const [modal, setModal] = useState<string>('')
  const [modoUpdate, setModoUpdate] = useState<boolean>(false)

  const [series, setSeries] = useState<any>({})

  const { getSeriesXUser }: any = storeSeries();

  const [data, setData] = useState<any>(null)
  const [articulos, setArticulos] = useState<any[]>([])
  const { getCompaniesXUsers }: any = companiesRequests()

  const handleDateChange = (fechasSeleccionadas: any) => {
    if (fechasSeleccionadas.length === 2) {
      setDate(fechasSeleccionadas.map((fecha: any) => fecha.toISOString().split('T')[0]));
    } else {
      setDate([fechasSeleccionadas[0]?.toISOString().split('T')[0] || "", ""]);
    }
  };

  const Modal = (modoUpdate: boolean, data: any) => {
    setModal('modal__franchise-request_update')
    setPf(pfClear)
    setArticulos([])
    if (modoUpdate) {
      setPfMu(data)
      console.log(pfMu);
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
    searcher.id_sucursal = sucursalFSearcher.id
    searcher.id_serie = selectData?.serieSearcher?.id
    const result = await APIs.CreateAny(searcher, "pedido_franquicia/get")
    setData(result)
  }
  const getEmpresas = async () => {
    const resultCompanies = await getCompaniesXUsers(user_id)
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
    const resultSerie = await getSeriesXUser({ tipo_ducumento: 10, id: user_id })
    setSeries({
      selectName: 'serieSearcher',
      dataSelect: resultSerie,
      options: 'nombre'
    })


    DynamicVariables.updateAnyVar(setSearcher, "status", 0)

  }
  useEffect(() => {
    fetch()
  }, [])
  const traer_alm_pred_prov = async (index: any) => {
    const data = {
      id_empresa: selectData?.proveedor?.id,
      id_empresa_franquicia: franquicia?.id,
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
          DynamicVariables.updateAnyVarByIndex(setArticulos, index, 'precios', response.precios)
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
      Swal.fire('Notificación', 'Es necesario agregar articulos para el pedido de franquicia', 'error');
      return
    }
    setPf(pfClear)

    const createObjLf = { ...pfClear };

    createObjLf.id_empresa_proveedor = selectData.proveedor.id;
    createObjLf.id_sucursal = sucursalF.id;
    createObjLf.id_usuario_crea = user_id
    //------------------------------------------------------------------FULL VALIDACIONES X ARTICULO--------------------------------------------------------------------------------
    const validacion: any[] = []
    await articulos.forEach(async (el: any) => {
      const obt_alm = el.stock.filter((s: any) => s.id == el.alm_pred.id_almacen_pred)
      if (obt_alm.length == 0) {
        const error = 'El articulo ' + el.codigo + '-' + el.descripcion + ' no cuenta con almacen predeterminado en la sucursal predeterminada de ventas para franquicia del proveedor seleccionado'
        validacion.push(error)
      } else {
        const alm = obt_alm[0]
        console.log(el.unidad_sel);

        const eq = await alm.equivalencias.filter((x: any) => x.id_unidad == parseInt(el.unidad_sel))

        if (eq.length == 0) {
          const error = 'El articulo ' + el.codigo + '-' + el.descripcion + ' la unidad seleccionada no concuerda con las unidades en la configuración'
          validacion.push(error)
        } else {
          const equi = eq[0]
          if (equi.cantidad >= el.cantidad) {
            //se inserta el articulo
          } else {
            const error = 'El articulo ' + el.codigo + '-' + el.descripcion + ' la cantidad que se está pidiendo es mayor a la cantidad en su stock: ' + equi.cantidad + ' ' + equi.nombre_unidad
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
      const c = {
        "id_articulo": el.id,
        "cantidad": parseFloat(el.cantidad),
        "precio_unitario": parseFloat(el.precio_unitario),
        "total": parseFloat(el.total),
        "unidad": el.unidad_sel,
        "comentarios": el.comentarios,
        "id_alm_pred": el.alm_pred.id_almacen_pred
      }
      createObjLf.conceptos.push(c);

    });

    if (modoUpdate) {

    } else {
      await APIs.CreateAny(createObjLf, "pedido_franquicia/create")
        .then(async (response: any) => {
          if (!response.error) {
            setModal('')
            Swal.fire('Notificación', response.mensaje, 'success');
            await getData()
            setPf(pfClear)

          } else {
            Swal.fire('Notificación', response.mensaje, 'warning');
            return
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
  const mostrar_Precios = (art: any) => {
    // Define los encabezados de la tabla
    const tableHeaders = `
      <tr>
        <th>Rango</th>
        <th>Precio</th>
      </tr>
    `;

    // Mapea los datos para crear las filas de la tabla
    const tableRows = art.precios
      .map((precioObj: any) => {
        // Para cada objeto en precios, accede a precios_ext
        return precioObj.precios_ext.map((rangoObj: any, index: number) => `
          <tr key=${index}>
            <td>${rangoObj.rango}</td>
            <td>$ ${precioObj.precios}</td>
          </tr>
        `).join('');
      })
      .join('');

    // Construye el HTML completo de la tabla
    const tableHtml = `
      <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>${tableHeaders}</thead>
        <tbody>${tableRows}</tbody>
      </table>
    `;

    // Muestra la alerta con la tabla generada
    Swal.fire({
      title: "Precios del Artículo",
      html: tableHtml,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: `
        <i class="fa fa-thumbs-up"></i> ¡Entendido!
      `,
      confirmButtonAriaLabel: "Ok!",
    });
  };

  const handleClick = (val: any) => {
    DynamicVariables.updateAnyVar(setSearcher, "status", val)
  };

  const handleCantidad = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = Number.isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value);

    const newArticleStates = [...articulos];
    newArticleStates[index].cantidad = value;

    const stocks = articulos[index].stock;
    const almacen_predeterminado = newArticleStates[index].alm_pred;

    const filter = stocks.filter((x: any) => x.id === almacen_predeterminado.id_almacen_pred);
    if (filter) {
      const equivalencias = filter[0].equivalencias.filter((x: any) => x.id_unidad == newArticleStates[index].unidad_sel)
      console.log(equivalencias);
      console.log(filter[0].equivalencias);

      if (value > equivalencias[0].cantidad) {
        const newArticleStates = [...articulos];
        newArticleStates[index].cantidad = 0;
        setArticulos(newArticleStates);
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: 'La cantidad ingresada supera el stock disponible'
        });
      } else {
        const newArticleStates = [...articulos];
        newArticleStates[index].cantidad = value;
        setArticulos(newArticleStates);

        //-----------------------------------------------INVOCAR PARA OBTENER EL PRECIO Y CALCULAR EL IMPORTE Y EL PRECIO UNITARIO
        const precio = obtenerPrecioPorCantidadYUnidad(articulos[index], newArticleStates[index].cantidad, newArticleStates[index].unidad_sel)
        if (precio != null) {
          const newArticleStates = [...articulos];
          newArticleStates[index].precio_unitario = precio;
          newArticleStates[index].total = precio * value;
          setArticulos(newArticleStates);
        } else {
          Swal.fire({
            icon: "warning",
            title: "Oops...",
            text: 'No se encontro precio configurado para la cantidad y unidad ingresada'
          });

          const newArticleStates = [...articulos];
          newArticleStates[index].cantidad = 0;
          newArticleStates[index].precio_unitario = 0;
          newArticleStates[index].total = 0;
          setArticulos(newArticleStates);
        }


      }
      return
    } else {
      console.log('El almacen no existe')
    }


  };
  useEffect(() => {
    if (selectData != null) {
      if (selectData.almacen_origin) {

        articulos.forEach((_: any, index: number) => {
          const newArticleStates = [...articulos];
          newArticleStates[index].cantidad = 0;
          setArticulos(newArticleStates);
        });
      }
    }
  }, [selectData])

  const handleUnits = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const value = parseInt(event.target.value, 10);
    const newArticleStates = [...articulos];
    newArticleStates[index].cantidad = 0;
    newArticleStates[index].unidad_sel = value;
    setArticulos(newArticleStates);
  };

  const cancelarPf = async (e: React.FormEvent) => {
    e.preventDefault();
    Swal.fire({
      title: "Seguro que deseas cancelar el Pedido de Franquicia?",
      text: "Se desapartará el material apartado, está acción no se puede deshacer",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`
    }).then(async (result) => {
      if (result.isConfirmed) {
        await APIs.GetAny("cancelar_pedido_franquicia/" + pfMu.id)
          .then(async (response: any) => {
            Swal.fire('Notificación', response.mensaje, 'success');
            await getData()
            setPf(pfClear)
            setModal('')
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
      }
    });

  }

  const getPDF = async () => {
    window.open('https://hiplotbusiness.com/api_dev/pdf_pedido_franquicia/' + pfMu.id, '_blank');
  }
  const obtenerPrecioPorCantidadYUnidad = (articulo: any, cantidad: number, id_unidad: number) => {
    for (const precio of articulo.precios) {
      const coincidencia = precio.precios_ext.find((ext: any) =>
        ext.id_unidad === id_unidad && cantidad >= ext.minimo && cantidad <= ext.maximo
      );
      if (coincidencia) {
        console.log(precio);
        return precio.precios;
      }
    }
    return null;
  };

  return (
    <div className='franchise__orders'>
      <div className='franchise__orders_container'>
        <div className='row__one'>
          <div className='row__one'>
            <div className='row'>
              <div className='col-6'>
                <Empresas_Sucursales modeUpdate={false} empresaDyn={franquiciaSearcher} sucursalDyn={sucursalFSearcher}
                  setEmpresaDyn={setFranquiciaSearcher} setSucursalDyn={setSucursalFSearcher}></Empresas_Sucursales>
              </div>
              <div className='col-3'>
                <Select dataSelects={proveedorSearcher} instanceId='proveedorSearcher' nameSelect={'Proveedor'}></Select>
              </div>
              <div className='col-3'>
                <label className='label__general'>Fechas</label>
                <div className='container_dates__requisition'>
                  <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={date} onChange={handleDateChange} placeholder='seleciona las fechas' />
                </div>
              </div>
            </div>
            <div className='row__two'>
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
              <div className='container__row_test'>
                <div className=''>
                  <Select dataSelects={series} instanceId='serieSearcher' nameSelect={'Series'}></Select>
                </div>
                <div className=''>
                  <div>
                    <label className='label__general'>Folio</label>
                    <div className='warning__general'><small >Este campo es obligatorio</small></div>
                    <input className={`inputs__general`} type="text" value={searcher.folio} onChange={(e) => DynamicVariables.updateAnyVar(setSearcher, "folio", parseInt(e.target.value))} placeholder='Ingresa el folio' />
                  </div>
                </div>
                <div className='d-flex justify-content-center align-items-end'>
                  <button className='btn__general-purple' onClick={() => Modal(false, 0)}>Buscar</button>
                </div>
              </div>
            </div>
          </div>
          <div className='d-flex justify-content-center align-items-end'>
            <button className='btn__general-purple' onClick={() => getData()}>Buscar</button>
          </div>
        </div>
        <div className='row my-4'>
          <div className='col-12'>
            <div className='btns__create'>
              <button className='btn__general-purple' onClick={() => setModal('modal__franchise-request_create')}>Realizar Pedido de Franquicia</button>
            </div>
          </div>
        </div>
        <div className='table__franchise__orders'>
          <div>
            {data ? (
              <div className='table__numbers'>
                <p className='text'>Total de entradas</p>
                <div className='quantities_tables'>{data?.length}</div>
              </div>
            ) : (
              <p></p>
            )}
          </div>
          <div className='table'>
            <div className='table__head'>
              <div className='thead'>
                <div className='th'>
                  <p>Folio</p>
                </div>
                <div className='th'>
                  <p>Status</p>
                </div>
                <div className='th'>
                  <p>Fecha</p>
                </div>
                <div className='th'>
                  <p>Por</p>
                </div>
                <div className='th'>
                  <p>Empresas</p>
                </div>
                <div className='th'>
                  <p>Sucursal</p>
                </div>
                <div className='th'>
                  <p>Proveedor</p>
                </div>
              </div>
            </div>
            {data ? (
              <div className='table__body'>
                {data?.map((order: any, index: number) => {
                  return (
                    <div className='tbody__container' key={index} onClick={() => Modal(true, order)}>
                      <div className='tbody'>
                        <div className='td code'>
                          <p>{order.serie}-{order.folio}-{order.anio}</p>
                        </div>
                        <div className='td date'>
                          <p>{order.status == 0 ? (
                            <span className="active-status">Activo</span>
                          ) : order.status == 2 ? (
                            <span className="active-status">Terminada</span>
                          ) :
                            <span className="canceled-status">Cancelada</span>
                          }</p>
                        </div>
                        <div className='td date'>
                          <p>{order.fecha.split('T')[0]}</p>
                        </div>
                        <div className='td'>
                          <p>{order.usuario_crea}</p>
                        </div>
                        <div className='td'>
                          <p>{order.empresa}</p>
                        </div>
                        <div className='td'>
                          <p>{order.sucursal}</p>
                        </div>
                        <div className='td'>
                          <p>{order.proveedor}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              // <p className="mt-3">No hay entradas que mostrar</p>
              ''
            )}
          </div>
          {/* <button className='btn__general-purple d-flex align-items-center' onClick={(e) => create(e)}>Guardar</button> */}
        </div>


        {/* -------------------------------------------------------------MODALES----------------------------------------------------------------------------- */}
        <div className={`overlay__modal__franchise-orders ${modal == 'modal__franchise-request_create' || modal == 'modal__franchise-request_update' ? 'active' : ''}`}>
          <div className={`popup__modal__franchise-orders ${modal == 'modal__franchise-request_create' || modal == 'modal__franchise-request_update' ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__modal__franchise-orders" onClick={() => setModal('')}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
            </a>
            {modoUpdate ?
              <div>
                <p className='title__modals'><b>Actualizar Pedido de Franquicia</b></p>
                <div className="card ">
                  <div className="card-body bg-standar">
                    <h3 className="text">{pfMu.serie}-{pfMu.folio}-{pfMu.anio}</h3>
                    <hr />
                    <div className='row'>
                      <div className='col-6 md-col-12'>
                        <span className='text'>Creado por: <b>{pfMu.usuario_crea}</b></span><br />
                        <span className='text'>Fecha de Creación: <b>{pfMu.fecha}</b></span><br />

                      </div>
                      <div className='col-6 md-col-12'>
                        <span className='text'>Empresa: <b>{pfMu.empresa}</b></span><br />
                        <span className='text'>Sucursal: <b>{pfMu.sucursal}</b></span><br />
                        <span className='text'>Proveedor: <b>{pfMu.proveedor}</b></span>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-12'>
                        <span className='text'>Comentarios: {pfMu.comentarios}</span>

                      </div>
                    </div>
                  </div>
                </div>
                <div className="table__requisicion">
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead className="table__head">
                      <tr className="thead">
                        <th>Articulo</th>
                        <th>Unidad</th>
                        <th>Cantidad</th>
                        <th>P/U</th>
                        <th>Total</th>
                        <th>Comentarios</th>
                      </tr>
                    </thead>
                    <tbody className="table__body">
                      {pfMu.conceptos && pfMu.conceptos.length > 0 ? (
                        pfMu.conceptos?.map((concept: any, index: number) => (
                          <tr className="tbody__container" key={index}>
                            <td>{concept.codigo}-{concept.descripcion}</td>
                            <td>{concept.unidad}</td>
                            <td>{concept.cantidad}</td>
                            <td>${concept.precio_unitario}</td>
                            <td>${concept.total}</td>
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
              </div>
              :
              <div className='franchise__orders'>
                <p className='title__modals'><b>Crear Pedido de Franquicia</b></p>
                <div className='row row__one'>
                  <div className='col-8 md-col-8 sm-col-12'>
                    <Empresas_Sucursales modeUpdate={modoUpdate} empresaDyn={franquicia} sucursalDyn={sucursalF}
                      setEmpresaDyn={setFranquicia} setSucursalDyn={setSucursalF}></Empresas_Sucursales>
                  </div>
                  <div className='col-4 md-col-4 sm-col-12'>
                    <Select dataSelects={proveedor} instanceId='proveedor' nameSelect={'Proveedor'}></Select>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-12'>
                    <br />
                    <hr />
                    <label className='label__general'>AGREGAR ARTICULOS</label>
                    <hr />
                    <br />

                    <Filtrado_Articulos_Basic set_article_local={setArticulos} campos_ext={campos_ext} id_empresa_proveedor={selectData?.proveedor?.id} id_sucursal_franquicia={sucursalF.id}
                      get_unidades={true} get_stock={true} />
                    <div className='table__franchise_orders_modal'>
                      <div className='table__head'>
                        <div className={`thead `}>
                          <div className='th'>
                            <p>Artículo</p>
                          </div>
                          <div className='th'>
                            <p>Cantidad</p>
                          </div>
                          <div className='th'>
                            <p>Unidad</p>
                          </div>
                          <div className='th'>
                            <p>P/U</p>
                          </div>
                          <div>
                            <p>Total</p>
                          </div>
                          <div className='th'>
                            <p>Comentarios</p>
                          </div>
                          <div>
                            <p>Opts</p>
                          </div>
                        </div>
                      </div>
                      {articulos ? (
                        <div className='table__body'>
                          {articulos?.map((article: any, index: number) => {
                            return (
                              <div className='tbody__container' key={index}>
                                <div className='tbody'>
                                  <div className='td ' style={{ cursor: 'pointer' }} title='Haz clic aquí para modificar tu concepto'>
                                    <p className='article'>{article.codigo}-{article.descripcion}</p>
                                  </div>
                                  <div className='td'>
                                    <input className={`inputs__general`} type="number" value={article.cantidad}
                                      onChange={(e) => { handleCantidad(e, index) }}
                                    />
                                  </div>
                                  <div className='td'>
                                    <select className={`inputs__general`}
                                      onChange={(e) => { handleUnits(e, index) }}>
                                      {article?.unidades.map((option: any, i: number) => (
                                        <option key={i} value={option.id_unidad}>
                                          {option.nombre}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <div className='td'>
                                    <p>${article.precio_unitario}</p>
                                  </div>
                                  <div className='td'>
                                    <p>${article.total}</p>
                                  </div>
                                  <div className='td'>
                                    <textarea className={`inputs__general`} value={article.comentarios}
                                      onChange={(e) => { DynamicVariables.updateAnyVarByIndex(setArticulos, index, "comentarios", e.target.value); }}
                                    />
                                  </div>
                                  <div className='td'>
                                    <button className='btn__general-purple' onClick={() => mostrar_stock(article)}>Stock</button>
                                  </div>
                                  <div className='td'>
                                    <button className='btn__general-purple' onClick={() => mostrar_Precios(article)}>Precios</button>
                                  </div>
                                  <div className='td'>
                                    <button className='btn__general-danger' onClick={() => { DynamicVariables.removeObjectInArray(setArticulos, index); { modoUpdate && article.id != 0 ? DynamicVariables.updateAnyVarSetArrNoRepeat(setPf, "conceptos", article.id) : null } }}>Eliminar</button>
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
                    <div className=' '>

                    </div>
                  </div>
                </div>
                <div className='d-flex justify-content-between mt-3'>
                  {modal == 'modal__franchise-request_update' ?
                    <div>
                      <button className='btn__general-orange' type='button' onClick={getPDF}>PDF</button>
                    </div>
                    :
                    ''
                  }

                  {/* <button className='btn__general-purple d-flex align-items-center' onClick={handleCreateRequisition} disabled={updateToRequisition && updateToRequisition.status == 2}>
                {updateToRequisition ? `${stateLoading ? 'Actualizando requisición' : 'Actualizar requisición'}` : `${stateLoading ? 'Creando requisición' : 'Crear requisición'}`}
                {stateLoading ? <span className="loader-two"></span> : ''}
              </button> */}
                  <>
                    <button className='btn__general-purple d-flex align-items-center' onClick={(e) => create(e)}>Guardar</button>
                    {modal == 'modal__franchise-request_update' ?
                      <div>
                        <button className='btn__general-danger' type='button' onClick={cancelarPf}>Cancelar</button>
                      </div>
                      :
                      ''}
                  </>
                </div>
              </div>
            }




          </div>
        </div>
        {/* -------------------------------------------------------------FIN MODALES----------------------------------------------------------------------------- */}

      </div>
    </div>
  )
}

export default PedidoFranquicias
