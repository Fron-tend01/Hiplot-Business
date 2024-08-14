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

interface pedido {
  id: 0,
  id_sucursal: 0,
  id_empresa_proveedor: 0,
  id_usuario_crea: 0,
  status: true,
  conceptos: any[
  // {
  //   "id": 0,
  //   "id_pedido_franquicia": 0,
  //   "id_articulo": 0,
  //   "cantidad": 0,
  //   "unidad": 0,
  //   "comentarios": "string"
  // }
  ]
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
  const [proveedor, setProveedor] = useState<any>({})
  const [franquicia, setFranquicia] = useState<any>({})
  const [sucursalF, setSucursalF] = useState<any>({})
  const [campos_ext] = useState<any>([{ nombre: 'cantidad', tipo: 0 }, { nombre: 'id_articulo', tipo: 1, asignacion: 'id' }, { nombre: 'unidad', tipo: 0 }, 
    { nombre: 'comentarios', tipo: '' }, { nombre: 'unidad_bool', tipo: false },{ nombre: 'unidad_sel', tipo: 0 }])

  const selectData = useSelectStore(state => state.selectedIds)

  const selectDataID = useSelectStore(state => state.setSelectedId)

  const [modal, setModal] = useState<boolean>(false)
  const [modoUpdate, setModoUpdate] = useState<boolean>(false)


  
  const [data, setData] = useState<any>(null)
  const setArticulos = storeDv(state => state.setArticulos)
  const { articulos }: any = useStore(storeDv)
  const { getCompaniesXUsers }: any = companiesRequests()
  const userState = useUserStore(state => state.user);
  let user_id = userState.id

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
    let result = await APIs.GetAny("listas_venta_franquicia/get")
    setData(result)
  }
  const getEmpresas = async () => {
    let resultCompanies = await getCompaniesXUsers(user_id)
    setProveedor({
      selectName: 'Proveedor',
      dataSelect: resultCompanies,
      options: 'razon_social'
    })
  }

  const fetch = async () => {
    await getEmpresas()
    await getData()
  }
  useEffect(() => {
    fetch()
  }, [])
  const traer_alm_pred_prov = async (index:any) => {
    let data = {
      id_empresa: selectData?.proveedor?.id,
      id_articulo:articulos[index]?.id
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
          }else {
            DynamicVariables.updateAnyVarByIndex(setArticulos,index,'alm_pred',response.data)
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
    console.log(flag, length);
    
    if (length > 0 && (flag === null || length - 1 !== flag)) {
      traer_alm_pred_prov(length - 1);
    }else {
      setFlag(null)
    }
    prevArticulosLength.current = length;
  }, [articulos]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (articulos.length == 0) {
      Swal.fire('Notificación', 'Es necesario agregar articulos para la lista de franquicia', 'error');
      return
    }


    let createObjLf = { ...pf };

    createObjLf.id_empresa_proveedor = selectData.proveedor.id;
    createObjLf.id_sucursal = sucursalF.id;
    await articulos.forEach((el: any) => {
      if (!createObjLf.conceptos.includes(el)) {
        createObjLf.conceptos.push(el);
      }
    });

    // if (modoUpdate) {
    //   console.log(createObjLf);

    //   await APIs.CreateAnyPut(createObjLf, "listas_venta_franquicia/update")
    //     .then(async (response: any) => {
    //       Swal.fire('Notificación', response.mensaje, 'success');
    //       await getData()
    //       setPf(pfClear)
    //       setModal(false)
    //     })
    //     .catch((error: any) => {
    //       if (error.response) {
    //         if (error.response.status === 409) {
    //           Swal.fire(error.mensaje, '', 'warning');
    //         } else {
    //           Swal.fire('Error al actualizar la urgencia', '', 'error');
    //         }
    //       } else {
    //         Swal.fire('Error de conexión.', '', 'error');
    //       }
    //     })
    // } else {
    //   await APIs.CreateAny(createObjLf, "listas_venta_franquicia/create")
    //     .then(async (response: any) => {
    //       Swal.fire('Notificación', response.mensaje, 'success');
    //       await getData()
    //       setPf(pfClear)
    //       setModal(false)
    //     })
    //     .catch((error: any) => {
    //       if (error.response) {
    //         if (error.response.status === 409) {
    //           Swal.fire(error.mensaje, '', 'warning');
    //         } else {
    //           Swal.fire('Error al crear la urgencia', '', 'error');
    //         }
    //       } else {
    //         Swal.fire('Error de conexión.', '', 'error');
    //       }
    //     })
    // }

  }
  return (
    <div className='te'>
      <div className='te__container'>

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
                    get_unidades={true} get_stock={true}/>
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
                                <select className={`inputs__general`} onChange={(e)=>DynamicVariables.updateAnyVarByIndex(setArticulos, index, "unidad", e.target.value)}>
                                  {dat?.unidades.map((option:any, index:number) => (
                                    <option key={index} value={option.id_unidad}>
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
