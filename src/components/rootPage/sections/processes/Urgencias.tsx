import APIs from '../../../../services/services/APIs'
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react'
import DynamicVariables from '../../../../utils/DynamicVariables';
import '../../../../utils/DynamicVariables';
import "./styles/Urgencias.css"
import Empresas_Sucursales from '../../Dynamic_Components/Empresas_Sucursales';
import { useStore } from 'zustand';
import { storeDv } from '../../../../zustand/Dynamic_variables';
import Filtrado_Articulos_Basic from '../../Dynamic_Components/Filtrado_Articulos_Basic';
interface urgencia_i {
  id: number,
  id_sucursal: number,
  porcentaje: number,
  cobro_min: number,
  nombre: string,
  urgencias_articulos: any[],
  urgencias_articulos_elim: any[]
}
// ------------------------------------------------PENDIENTE ESTE MODULO, NO ELIMINA DE FORMA CORRECTA Y AGREGA ARTICULOS DEMÁS, FALTA REVISAR
const Urgencias = () => {
  const [Urgencia, setUrgencia] = useState<urgencia_i>({
    id: 0,
    id_sucursal: 0,
    porcentaje: 0,
    cobro_min: 0,
    nombre: '',
    urgencias_articulos: [],
    urgencias_articulos_elim: []
  })
  const [UrgenciaClear] = useState<urgencia_i>({
    id: 0,
    id_sucursal: 0,
    porcentaje: 0,
    cobro_min: 0,
    nombre: '',
    urgencias_articulos: [],
    urgencias_articulos_elim: []
  })

  const [modal, setModal] = useState<boolean>(false)
  const [modoUpdate, setModoUpdate] = useState<boolean>(false)

  const [data, setData] = useState<any>(null)
  const [empresaDyn, setEmpresaDyn] = useState<any>({})
  const [sucursalDyn, setSucursalDyn] = useState<any>({})
  const setArticulos = storeDv(state => state.setArticulos)
  const { articulos }: any = useStore(storeDv)

  const Modal = (modoUpdate: boolean, data: any) => {
    setModal(true)

    setUrgencia(UrgenciaClear)
    setArticulos([])
    if (modoUpdate) {
      DynamicVariables.updateAnyVar(setUrgencia, "id", data.id)
      DynamicVariables.updateAnyVar(setUrgencia, "nombre", data.nombre)
      DynamicVariables.updateAnyVar(setUrgencia, "id_sucursal", data.id_sucursal)
      DynamicVariables.updateAnyVar(setUrgencia, "porcentaje", data.porcentaje)
      DynamicVariables.updateAnyVar(setUrgencia, "cobro_min", data.cobro_min)
      console.log(data);

      setEmpresaDyn({id: data.id_empresa})
      setSucursalDyn({id: data.id_sucursal})
      // //LLENAR LA VARIABLES ARRAY
      data.urgencias_articulos.forEach((element:any) => {
        DynamicVariables.addObjectInArrayRepeat(element, setArticulos)
      });
      setModoUpdate(true)
      console.log('arts', data);
      
    } else {
      setModoUpdate(false)
    }
  }
  const getData = async () => {
    let result = await APIs.GetAny("urgencias/get")
    setData(result)
  }

  useEffect(() => {
    getData()
  }, [])


  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (articulos.length == 0) {
      Swal.fire('Notificación', 'Es necesario agregar articulos para la urgencia', 'error');
      return
    }
    let updatedUrgencia = { ...Urgencia };

    updatedUrgencia.id_sucursal = sucursalDyn.id;

    articulos.forEach((el: any) => {
      if (!updatedUrgencia.urgencias_articulos.includes(el.id)) {
        updatedUrgencia.urgencias_articulos.push(el.id);
      }
    });
    
    if (modoUpdate) {
      console.log(updatedUrgencia);
      
      await APIs.CreateAnyPut(updatedUrgencia, "urgencias/update")
      .then(async (response: any) => {
        Swal.fire('Notificación', response.mensaje, 'success');
        await getData()
        setUrgencia(UrgenciaClear)
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
    }else {
      await APIs.CreateAny(updatedUrgencia, "urgencias/create")
      .then(async (response: any) => {
        Swal.fire('Notificación', response.mensaje, 'success');
        await getData()
        setUrgencia(UrgenciaClear)
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
              <button className='btn__general-purple' onClick={() => Modal(false, 0)}>Crear Urgencia</button>
            </div>
          </div>
        </div>


        <div className='table__units' >
          <div>
            {data ? (
              <div>
                <p className='text'>Tus urgencias {data.length}</p>
              </div>
            ) : (
              <p>No hay urgencias</p>
            )}
          </div>
          <div className='table__head'>
            <div className='thead'>
            <div className='th'>
                <p className=''>Nombre</p>
              </div>
              <div className='th'>
                <p className=''>Empresa</p>
              </div>
              <div className='th'>
                <p>Sucursal</p>
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
                        <p>{car.empresa}</p>
                      </div>
                      <div className='td'>
                        {car.sucursal}
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
              <p className='title__modals'><b>Actualizar Urgencia</b></p>
              :
              <p className='title__modals'><b>Configurar Urgencias</b></p>
            }
            <hr />
            <div className='row'>
              <div className='col-8 md-col-7 sm-col-12'>
                <Empresas_Sucursales modeUpdate={modoUpdate} empresaDyn={empresaDyn} 
              sucursalDyn={sucursalDyn} setEmpresaDyn={setEmpresaDyn} setSucursalDyn={setSucursalDyn}/>
              </div>
              <div className='col-2 md-col-2 sm-col-12'>
                <label className='label__general'>%</label>
                <input className={`inputs__general`} value={Urgencia.porcentaje} onChange={(e) => DynamicVariables.updateAnyVar(setUrgencia, "porcentaje", parseInt(e.target.value))} type='number' placeholder='Ingresa nombre' />
              </div>
              <div className='col-2 md-col-3 sm-col-12'>
                <label className='label__general'>Cobro min.</label>
                <input className={`inputs__general`} value={Urgencia.cobro_min} onChange={(e) => DynamicVariables.updateAnyVar(setUrgencia, "cobro_min", parseFloat(e.target.value))} type='number' placeholder='Ingresa nombre' />
              </div>
            </div>
            <div className='row'>
              <div className='col-12'>
                <label className='label__general'>Nombre</label>
                <input className={`inputs__general`} value={Urgencia.nombre} onChange={(e) => DynamicVariables.updateAnyVar(setUrgencia, "nombre", e.target.value)} type='text' placeholder='Ingresa nombre' />

              </div>
            </div>
            <div className='row'>
              <div className='col-12'>
                <br />
                <hr />
                <label className='label__general'>AGREGAR ARTICULOS</label>
                <hr />
                <br />
                <Filtrado_Articulos_Basic get_sucursales={false} get_proveedores={false} get_max_mins={false} get_plantilla_data={false} get_stock={false} get_unidades={false} 
                set_article_local={setArticulos}/>
                <br />
                <div className='table__modal '>
                  <div>
                    {articulos.length >= 1 ? (
                      <div>
                        <p className='text'>Articulos con Urgencia {articulos.length}</p>
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
                              <button className='btn__delete_users' type="button" onClick={() => {
                                DynamicVariables.removeObjectInArray(setArticulos, index);
                                {modoUpdate && dat.id != 0? DynamicVariables.updateAnyVarSetArrNoRepeat(setUrgencia, "urgencias_articulos_elim", dat.id) : null}
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

export default Urgencias
