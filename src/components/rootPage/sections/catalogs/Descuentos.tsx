import APIs from '../../../../services/services/APIs'
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react'
import DynamicVariables from '../../../../utils/DynamicVariables';
import '../../../../utils/DynamicVariables';
import { storeCompanies } from '../../../../zustand/Companies';
import { storeBranchOffcies } from '../../../../zustand/BranchOffices';
import useUserStore from '../../../../zustand/General';
import "./styles/Colecciones.css"
import { storeFamilies } from '../../../../zustand/Families';
import Filtrado_Articulos_Basic from '../../Dynamic_Components/Filtrado_Articulos_Basic';

interface Descuento {
  id: number
  monto_desde: number
  monto_hasta: number
  descuento_monto: number
  descuento_percent: number
  fecha_inicio: Date
  fecha_final: Date
  articulos: any[]
  articulos_elim: any[]
}
export default function Descuentos() {
  const [modal, setModal] = useState<boolean>(false)
  const [forClear] = useState<Descuento>({
    id: 0,
    monto_desde: 0,
    monto_hasta: 0,
    descuento_monto: 0,
    descuento_percent: 0,
    fecha_inicio: new Date(),
    fecha_final: new Date(),
    articulos: [],
    articulos_elim: [],
  });
  const [descuento, setDescuento] = useState<Descuento>({
    id: 0,
    monto_desde: 0,
    monto_hasta: 0,
    descuento_monto: 0,
    descuento_percent: 0,
    fecha_inicio: new Date(),
    fecha_final: new Date(),
    articulos: [],
    articulos_elim: [],
  });
  const [searcher, setSearcher] = useState<any>({
    desde: new Date(),
    hasta: new Date()
  })
  const { getCompaniesXUsers }: any = storeCompanies();
  const { getBranchOfficeXCompanies }: any = storeBranchOffcies();

  const { getFamilies }: any = storeFamilies()
  const [modoUpdate, setModoUpdate] = useState<boolean>(false)

  const [articulos, setArticulos] = useState<any[]>([])

  const userState = useUserStore(state => state.user);
  const user_id = userState.id
  const [data, setData] = useState<any>(null)


  useEffect(() => {
    getCompaniesXUsers(user_id)
    getBranchOfficeXCompanies(0, user_id)
    getFamilies(user_id)
    getData()
  }, [])
  const Modal = (modoUpdate: boolean, data: any) => {
    setModal(true)
    setDescuento({ ...forClear })
    if (modoUpdate) {
      DynamicVariables.updateAnyVar(setDescuento, "id", data.id)
      DynamicVariables.updateAnyVar(setDescuento, "monto_desde", data.monto_desde)
      DynamicVariables.updateAnyVar(setDescuento, "monto_hasta", data.monto_hasta)
      DynamicVariables.updateAnyVar(setDescuento, "descuento_monto", data.descuento_monto)
      DynamicVariables.updateAnyVar(setDescuento, "descuento_percent", data.descuento_percent)
      DynamicVariables.updateAnyVar(setDescuento, "descuento_percent", data.descuento_percent)
      DynamicVariables.updateAnyVar(setDescuento, "fecha_inicio", new Date(data.fecha_inicio))
      DynamicVariables.updateAnyVar(setDescuento, "fecha_final", new Date(data.fecha_final))
      setArticulos([...data.articulos])
      setModoUpdate(true)

    } else {
      setModoUpdate(false)
    }
  }

  const closeModal = () => {
    setModal(false)
  }


  const createDescuento = async (e: React.FormEvent) => {
    e.preventDefault();
    const ids = articulos.map(articulo => articulo.id);
    if (ids.length < 1) {
      Swal.fire('Notificacion', 'Es necesario agregar minimo un articulo para el descuento', 'warning')
      return
    }
    let data = {
      ...descuento,
      fecha_inicio: descuento.fecha_inicio.toISOString().split('T')[0],
      fecha_final: descuento.fecha_final.toISOString().split('T')[0],
      articulos: ids
    };

    await APIs.CreateAny(data, "create_descuento")
      .then(async (response: any) => {
        Swal.fire('Notificación', response.mensaje, 'success');
        await getData()
        setArticulos([])
        setDescuento(forClear)
        setModal(false)
      })
      .catch((error: any) => {
        if (error.response) {
          if (error.response.status === 409) {
            Swal.fire(error.mensaje, '', 'warning');
          } else {
            Swal.fire('Error al actualizar la combinacion', '', 'error');
          }
        } else {
          Swal.fire('Error de conexión.', '', 'error');
        }
      })
  }
  const getData = async () => {
    let data = {
      ...searcher,
      desde: searcher.desde.toISOString().split('T')[0],
      hasta: searcher.hasta.toISOString().split('T')[0]
    };
    const result = await APIs.CreateAny(data, "get_descuentos")
    setData(result)
  }
  const updateDescuento = async (e: React.FormEvent) => {
    e.preventDefault();
    const ids = articulos.map(articulo => articulo.id);
    if (ids.length < 1) {
      Swal.fire('Notificacion', 'Es necesario agregar minimo un articulo para el descuento', 'warning')
      return
    }
    let data = {
      ...descuento,
      fecha_inicio: descuento.fecha_inicio.toISOString().split('T')[0],
      fecha_final: descuento.fecha_final.toISOString().split('T')[0],
      articulos: ids
    };
    await APIs.CreateAny(data, "update_descuento")
      .then(async (response: any) => {
        Swal.fire('Notificación', response.mensaje, 'success');
        await getData()
        setModal(false)
      })
      .catch((error: any) => {
        if (error.response) {
          if (error.response.status === 409) {
            Swal.fire(error.mensaje, '', 'warning');
          } else {
            Swal.fire('Error al actualizar la combinacion', '', 'error');
          }
        } else {
          Swal.fire('Error de conexión.', '', 'error');
        }
      })
  }
  return (
    <div className='colecciones'>
      <div className='colecciones__container'>
        <div className='row'>
          <div className='col-4'>
            <label className='label__general'>Desde</label>
            <input className={`inputs__general`} value={searcher.desde ? searcher.desde.toISOString().split('T')[0] : ""}
              onChange={(e) => DynamicVariables.updateAnyVar(setSearcher, "desde", new Date(e.target.value))} type='date' placeholder='0' />
          </div>
          <div className='col-4'>
            <label className='label__general'>Hasta</label>
            <input className={`inputs__general`} value={searcher.hasta ? searcher.hasta.toISOString().split('T')[0] : ""}
              onChange={(e) => DynamicVariables.updateAnyVar(setSearcher, "hasta", new Date(e.target.value))} type='date' placeholder='0' />
          </div>
          <div className='col-2'>
            <button className='btn__general-purple' onClick={() => getData()}>Buscar</button>

          </div>
          <div className='col-2'>
            <button className='btn__general-purple' onClick={() => Modal(false, 0)}>Crear Descuento</button>

          </div>
        </div>
        <div className={`overlay__create_modal_colecciones ${modal ? 'active' : ''}`}>
          <div className={`popup__create_modal_colecciones ${modal ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__create_modal_colecciones" onClick={closeModal}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
            </a>
            {modoUpdate ?
              <p className='title__modals'><b>Actualizar Descuento</b></p>
              :
              <p className='title__modals'><b>Crear Descuento</b></p>
            }
            <br />
            <hr />
            <br />
            <div className='row'>
              <div className='col-3'>
                <label className='label__general'>Monto desde ($)</label>
                <input className={`inputs__general`} value={descuento.monto_desde}
                  onChange={(e) => DynamicVariables.updateAnyVar(setDescuento, "monto_desde", isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value))} type='text' placeholder='0' />
              </div>
              <div className='col-3'>
                <label className='label__general'>Monto Hasta ($)</label>
                <input className={`inputs__general`} value={descuento.monto_hasta}
                  onChange={(e) => DynamicVariables.updateAnyVar(setDescuento, "monto_hasta", isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value))} type='text' placeholder='0' />
              </div>
              <div className='col-3'>
                <label className='label__general'>Descuento monto ($)</label>
                <input className={`inputs__general`} value={descuento.descuento_monto}
                  onChange={(e) => {
                    DynamicVariables.updateAnyVar(setDescuento, "descuento_monto", isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value));
                    DynamicVariables.updateAnyVar(setDescuento, "descuento_percent", 0)
                  }} type='text' placeholder='0' />
              </div>
              <div className='col-3'>
                <label className='label__general'>Descuento % </label>
                <input className={`inputs__general`} value={descuento.descuento_percent}
                  onChange={(e) => {
                    DynamicVariables.updateAnyVar(setDescuento, "descuento_percent", isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value));
                    DynamicVariables.updateAnyVar(setDescuento, "descuento_monto", 0)
                  }} type='text' placeholder='0' />
              </div>
            </div>
            <div className='row'>
              <div className='col-6'>
                <label className='label__general'>Fecha Inicial</label>
                <input className={`inputs__general`} value={descuento.fecha_inicio ? descuento.fecha_inicio.toISOString().split('T')[0] : ""}
                  onChange={(e) => DynamicVariables.updateAnyVar(setDescuento, "fecha_inicio", new Date(e.target.value))} type='date' placeholder='0' />
              </div>
              <div className='col-6'>
                <label className='label__general'>Fecha Final</label>
                <input className={`inputs__general`} value={descuento.fecha_final ? descuento.fecha_final.toISOString().split('T')[0] : ""}
                  onChange={(e) => DynamicVariables.updateAnyVar(setDescuento, "fecha_final", new Date(e.target.value))} type='date' placeholder='0' />
              </div>
            </div>
            <br />
            <hr />
            <span> <b> AGREGAR ARTICULOS</b></span>
            <hr />
            <br />
            <div className='row'>
              <div className='col-12 card-white'>
                <span > <b>ARTICULOS</b></span>
                <hr />
                <Filtrado_Articulos_Basic set_article_local={setArticulos} />
                <br />
                <hr />
                <br />
                <div className='table__modal_combinations'>
                  <div>
                    {articulos.length >= 1 ? (
                      <div>
                        <p className='text'>Tus articulos {articulos.length}</p>
                      </div>
                    ) : (
                      <p className='text'>No hay articulos</p>
                    )}
                  </div>
                  <div className='table__head'>
                    <div className='thead'>
                      <div className='th'>
                        <p className=''>Articulo</p>
                      </div>
                    </div>
                  </div>
                  {articulos.length > 0 ? (
                    <div className='table__body'>
                      {articulos.map((dat, index) => (
                        <div className='tbody__container' key={index}>
                          <div className='tbody'>
                            <div className='td'>
                              {dat.descripcion} ({dat.codigo})
                            </div>
                            <div className='td'>
                              <button className='btn__delete_users' type="button" onClick={() => {
                                DynamicVariables.removeObjectInArray(setArticulos, index);
                                { modoUpdate && dat.id != 0 ? DynamicVariables.updateAnyVarSetArrNoRepeat(setDescuento, "articulos_elim", dat.id) : null }
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
            <br></br>
            {modoUpdate ?
              <input className='btn__general-purple' onClick={updateDescuento} value="Actualizar Descuento" />

              :
              <input className='btn__general-purple' onClick={createDescuento} value="Crear Descuento" />

            }
          </div>
        </div>

        <div className="table__units">
          <div>
            {data ? (
              <div>
                <p className="text">Tus Descuentos {data.length}</p>
              </div>
            ) : (
              <p>No hay Descuentos</p>
            )}
          </div>
          <table >
            {/* Encabezado de la tabla */}
            <thead >
              <tr >
                <th >Desde($)</th>
                <th >Hasta($)</th>
                <th >Desc.($)</th>
                <th >Desc.(%)</th>
                <th >Fecha Inicial</th>
                <th >Fecha Final</th>
                <th >Acciones</th>
              </tr>
            </thead>
            {/* Cuerpo de la tabla */}
            {data ? (
              <tbody >
                {data.map((car: any, index: number) => (
                  <tr key={index}>
                    <td className="td">{car.monto_desde}</td>
                    <td className="td">{car.monto_hasta}</td>
                    <td className="td">{car.descuento_monto}</td>
                    <td className="td">{car.descuento_percent}</td>
                    <td className="td">{car.fecha_inicio}</td>
                    <td className="td">{car.fecha_final}</td>
                    <td className="td">
                      <button
                        className="branchoffice__edit_btn"
                        onClick={() => Modal(true, car)}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={3} className="td">
                    Cargando datos...
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  )
}
