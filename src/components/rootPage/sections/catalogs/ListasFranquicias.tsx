import APIs from '../../../../services/services/APIs'
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react'
import DynamicVariables from '../../../../utils/DynamicVariables';
import '../../../../utils/DynamicVariables';
import "./styles/ListasFranquicias.css"
import Empresas_Sucursales from '../../Dynamic_Components/Empresas_Sucursales';
import Filtrado_Articulos_Basic from '../../Dynamic_Components/Filtrado_Articulos_Basic';
import Select from '../../Dynamic_Components/Select';
import { companiesRequests } from '../../../../fuctions/Companies';
import { useSelectStore } from '../../../../zustand/Select';
import useUserStore from '../../../../zustand/General';

interface listaf {
  id: number,
  id_empresa: number,
  id_sucursal_franquicia: number,
  id_empresa_franquicia: number,
  nombre: string,
  articulos: any[],
  articulos_elim: any[],
}
const ListasFranquicias = () => {

  const [lf, setLf] = useState<listaf>({
    id: 0,
    id_empresa: 0,
    id_sucursal_franquicia: 0,
    id_empresa_franquicia: 0,
    nombre: '',
    articulos: [],
    articulos_elim: [],
  })
  const [lfClear] = useState<listaf>({
    id: 0,
    id_empresa: 0,
    id_sucursal_franquicia: 0,
    id_empresa_franquicia: 0,
    nombre: '',
    articulos: [],
    articulos_elim: [],
  })
  const [proveedor, setProveedor] = useState<any>()
  const [franquicia, setFranquicia] = useState<any>({})
  const [sucursalF, setSucursalF] = useState<any>({})
  const [campos_ext] = useState<any>([{ nombre: 'compra_adelantada', tipo: false }, { nombre: 'id_articulo', tipo: 1, asignacion: 'id' }])

  const selectData: any = useSelectStore(state => state.selectedIds)

  const selectDataID = useSelectStore(state => state.setSelectedId)

  const [modal, setModal] = useState<boolean>(false)
  const [modoUpdate, setModoUpdate] = useState<boolean>(false)

  const [data, setData] = useState<any>(null)
  const [articulos, setArticulos] = useState<any[]>([])
  const { getCompaniesXUsers }: any = companiesRequests()
  const userState = useUserStore(state => state.user);
  const user_id = userState.id

  const Modal = (modoUpdate: boolean, data: any) => {
    setModal(true)
    setLf(lfClear)
    setArticulos([])
    if (modoUpdate) {
      DynamicVariables.updateAnyVar(setLf, "id", data.id)
      DynamicVariables.updateAnyVar(setLf, "nombre", data.nombre)
      DynamicVariables.updateAnyVar(setLf, "id_empresa", data.id_empresa)
      DynamicVariables.updateAnyVar(setLf, "id_empresa_franquicia", data.id_empresa_franquicia)
      selectDataID("proveedor", {id:data.id_empresa})
      console.log(data);
      
      setFranquicia({id: data.id_empresa_franquicia})
      setSucursalF({id: data.id_sucursal_franquicia})
      // // //LLENAR LA VARIABLES ARRAY
      data.articulos.forEach((element: any) => {
        DynamicVariables.addObjectInArrayRepeat(element, setArticulos)
      });
      setModoUpdate(true)
    } else {
      setModoUpdate(false)
    }
  }
  const getData = async () => {
    const result = await APIs.GetAny("listas_venta_franquicia/get")
    setData(result)
  }
  const getEmpresas = async () => {
    const resultCompanies = await getCompaniesXUsers(user_id)
    console.log(resultCompanies)
    setProveedor({
      selectName: 'Proveedor',
      options: 'razon_social',
      dataSelect: resultCompanies
    })
  }


  const fetch = async () => {
    await getEmpresas()
    await getData()
  }
  useEffect(() => {
    fetch()
  }, [])


  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (articulos.length == 0) {
      Swal.fire('Notificación', 'Es necesario agregar articulos para la lista de franquicia', 'error');
      return
    }


    const createObjLf = { ...lf };

    createObjLf.id_empresa = selectData.proveedor.id;
    createObjLf.id_empresa_franquicia = franquicia.id;
    createObjLf.id_sucursal_franquicia = sucursalF.id;
    await articulos.forEach((el: any) => {
      if (!createObjLf.articulos.includes(el)) {
        createObjLf.articulos.push(el);
      }
    });

    if (modoUpdate) {
      console.log(createObjLf);
      
      await APIs.CreateAnyPut(createObjLf, "listas_venta_franquicia/update")
        .then(async (response: any) => {
          Swal.fire('Notificación', response.mensaje, 'success');
          await getData()
          setLf(lfClear)
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
      await APIs.CreateAny(createObjLf, "listas_venta_franquicia/create")
        .then(async (response: any) => {
          Swal.fire('Notificación', response.mensaje, 'success');
          await getData()
          setLf(lfClear)
          setModal(false)
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
  return (
    <div className='te'>
      <div className='te__container'>

        <div className='row'>
          <div className='col-12'>
            <div className='btns__create'>
              <button className='btn__general-purple' onClick={() => Modal(false, 0)}>Crear Lista de Franquicia</button>
            </div>
          </div>
        </div>


        <div className='table__units' >
          <div>
            {data ? (
              <div>
                <p className='text'>Tus Listas de Franquicia {data.length}</p>
              </div>
            ) : (
              <p>No hay Listas de Franquicia</p>
            )}
          </div>
          <div className='table__head'>
            <div className='thead'>
              <div className='th'>
                <p className=''>Nombre</p>
              </div>
              <div className='th'>
                <p className=''>Proveedor</p>
              </div>
              <div className='th'>
                <p>Franquicia</p>
              </div>
              <div className='th'>
                <p>OPT</p>
              </div>
            </div>
          </div>
          {data ? (
            <div className='table__body'>
              {data.map((car: any) => {
                return (
                  <div className='tbody__container' key={car.id}>
                    <div className='tbody'>
                      <div className='td'>
                        <p>{car.nombre}</p>
                      </div>
                      <div className='td'>
                        <p>{car.empresa_proveedor}</p>
                      </div>
                      <div className='td'>
                        {car.empresa_franquicia}
                      </div>
                      <div className='td'>
                        <button className='branchoffice__edit_btn' onClick={() => Modal(true, car)}>Editar</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>Cargando datos...</p>
          )}
        </div>



        {/* -------------------------------------------------------------MODALES----------------------------------------------------------------------------- */}
        <div className={`overlay__create_modal ${modal ? 'active' : ''}`}>
          <div className={`popup__create_modal ${modal ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__create_modal" onClick={() => setModal(false)}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
            </a>
            {modoUpdate ?
              <p className='title__modals'><b>Actualizar Listas de Franquicia</b></p>
              :
              <p className='title__modals'><b>Configurar Listas de Franquicias</b></p>
            }
            <hr />
            <div className='row'>
            <div className='col-8 md-col-8 sm-col-12'>
                <Empresas_Sucursales modeUpdate={modoUpdate} empresaDyn={franquicia} sucursalDyn={sucursalF} 
                setEmpresaDyn={setFranquicia} setSucursalDyn={setSucursalF}></Empresas_Sucursales>
              </div>
              <div className='col-4 md-col-4 sm-col-12'>
                <Select dataSelects={proveedor} instanceId='proveedor' nameSelect={'Proveedor'}></Select>
              </div>
              
              <div className='col-12 md-col-12 sm-col-12'>
                <label className='label__general'>Nombre</label>
                <input className={`inputs__general`} value={lf.nombre} onChange={(e) => DynamicVariables.updateAnyVar(setLf, "nombre", e.target.value)} type='text' placeholder='Ingresa nombre' />

              </div>
            </div>
            <div className='row'>
              <div className='col-12'>
                <br />
                <hr />
                <label className='label__general'>AGREGAR ARTICULOS</label>
                <hr />
                <br />
                <Filtrado_Articulos_Basic campos_ext={campos_ext} set_article_local={setArticulos}/>
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
                        <p className=''>Familia</p>
                      </div>
                      <div className='th'>
                        <p className=''>Compra Adelantada</p>
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
                              {dat.nombre}
                            </div>
                            <div className='td'>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={dat.compra_adelantada} // Asignar el valor del estado al atributo 'checked'
                                  onChange={(e) => { DynamicVariables.updateAnyVarByIndex(setArticulos, index, "compra_adelantada", e.target.checked); }}
                                />
                                <span className="slider"></span>
                              </label>
                            </div>
                            <div className='td'>
                              <button className='btn__delete_users' type="button" onClick={() => {
                                DynamicVariables.removeObjectInArray(setArticulos, index);
                                { modoUpdate && dat.id != 0 ? DynamicVariables.updateAnyVarSetArrNoRepeat(setLf, "articulos_elim", dat.id) : null }
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

export default ListasFranquicias
