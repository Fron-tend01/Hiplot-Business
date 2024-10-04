import APIs from '../../../../services/services/APIs'
import Swal from 'sweetalert2';
import React, { useEffect, useState, useRef } from 'react'
import DynamicVariables from '../../../../utils/DynamicVariables';
import '../../../../utils/DynamicVariables';
import useUserStore from '../../../../zustand/General';
import "./styles/TiemposEntrega.css"
import { RangesRequests } from '../../../../fuctions/Ranges'
import { companiesRequests } from '../../../../fuctions/Companies';
import { BranchOfficesRequests } from '../../../../fuctions/BranchOffices';
import Empresas_Sucursales from '../../Dynamic_Components/Empresas_Sucursales';

interface te {
  id: number,
  nombre: string,
  id_rango: number,
  id_sucursal: number,
  id_empresa: number,
  tEntregaData_nuevos: any[],
  tEntregaData_exist: any[],
  tEntregaData_elim: []
}
const TiemposEntrega = () => {
  const typeTe = [
    {
      id: 1,
      nombre: 'PRODUCCIÓN'
    },
    {
      id: 2,
      nombre: 'CLIENTE'
    }
  ]
  const dias = [
    {
      nombre: 'LUNES'
    },
    {
      nombre: 'MARTES'
    },
    {
      nombre: 'MIERCOLES'
    },
    {
      nombre: 'JUEVES'
    },
    {
      nombre: 'VIERNES'
    }
  ]
  const [configte, setConfigte] = useState({
    i: 0,
    id: 0,
    dia_recepcion: '',
    hora_inicial_recepcion: '',
    hora_final_recepcion: '',
    dias_entrega: 0,
    tipo: 0,
    tipoSel: 0,
    hora_entrega: '',
    entrega: '',
    edit: false
  })
  const [configtec, setConfigtec] = useState({
    i: 0,
    id: 0,
    dia_recepcion: '',
    hora_inicial_recepcion: '',
    hora_final_recepcion: '',
    dias_entrega: 0,
    tipo: 0,
    tipoSel: 0,
    hora_entrega: '',
    entrega: '',
    edit: false
  })
  const [tiempose, setTiempose] = useState<te>({
    id: 0,
    nombre: '',
    id_rango: 0,
    id_sucursal: 0,
    id_empresa: 0,
    tEntregaData_nuevos: [],
    tEntregaData_exist: [],
    tEntregaData_elim: []
  });
  const [forclearte] = useState<te>({
    id: 0,
    nombre: '',
    id_rango: 0,
    id_sucursal: 0,
    id_empresa: 0,
    tEntregaData_nuevos: [],
    tEntregaData_exist: [],
    tEntregaData_elim: []
  });
  const [sucursalSel, setSucursalSel] = useState<any>({})
  const [empresaSel, setEmpresaSel] = useState<any>({})

  const [sucursalSelCreate, setSucursalSelCreate] = useState<any>({})
  const [empresaSelCreate, setEmpresaSelCreate] = useState<any>({})


  const { getBranchOffices }: any = BranchOfficesRequests()

  const [modal, setModal] = useState<boolean>(false)
  const [modoUpdate, setModoUpdate] = useState<boolean>(false)
  const [data, setData] = useState<any>(null)

  const [selectTipote, setSelectTipote] = useState<boolean>(false)
  const [selectDiaRecepcion, setSelectDiaRecepcion] = useState<boolean>(false)
  const [filteringBranchOffices, setFilteringBranchOffices] = useState<any>([])
  const userState = useUserStore(state => state.user);
  const [ranges, setRanges] = useState<any>([])
  const [selectRangos, setSelectRangos] = useState<boolean>(false)
  let user_id = userState.id
  const forSlide = useRef<HTMLDivElement>(null);
  const handleScroll = () => {
    if (forSlide.current) {
      forSlide.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const [searcher, setSearcher] = useState<any>({
    id: 0,
    nombre: '',
    id_sucursal: 0,
    id_usuario: 0
  })
  const fetch = async () => {

    let resultRanges = await APIs.CreateAny({ titulo: '' }, "rangos_get")
    setRanges(resultRanges)
    setSearcher({
      id: 0,
      nombre: '',
      id_sucursal: sucursalSel?.id,
      id_usuario: user_id
    })
  }
  useEffect(() => {
    DynamicVariables.updateAnyVar(setSearcher, "id_sucursal", sucursalSel?.id)
  }, [sucursalSel])

  useEffect(() => {
    fetch()
    getData()
    calcular_entrega()
  }, [configte.dia_recepcion, configte.dias_entrega, configte.entrega])
  const getData = async () => {
    // if (searcher.id_sucursal?.id==undefined) {
    //   DynamicVariables.updateAnyVar(setSearcher, "id_sucursal", {nombre:'Todos', id:0})
    // }
    let result = await APIs.CreateAny(searcher, "tentrega_get")
    setData(result)
  }
  const calcular_entrega = () => {
    let currentDayIndex = dias.findIndex(day => day.nombre === configte.dia_recepcion);
    let multiplicador = 0
    for (let i = 0; i < configte.dias_entrega; i++) {
      if (currentDayIndex == (dias.length - 1)) {
        multiplicador++
        currentDayIndex = 0
      } else {
        currentDayIndex++
      }
    }
    let day_name = ''
    if (dias[currentDayIndex] != undefined) {
      day_name = dias[currentDayIndex].nombre
    }
    DynamicVariables.updateAnyVar(setConfigte, "entrega", day_name + ' dentro de ' + multiplicador + ' semanas');


  }
  const selectAutomaticSuc = async (company: any) => {
    let resultBranch = await getBranchOffices(company, user_id)

    setFilteringBranchOffices(resultBranch)
  }
  const Modal = (modoUpdate: boolean, data: any) => {
    setModal(true)
    setTiempose({ ...forclearte })
    setConfigte(configtec)
    if (modoUpdate) {
      DynamicVariables.updateAnyVar(setTiempose, "id", data.id)
      DynamicVariables.updateAnyVar(setTiempose, "nombre", data.nombre)
      DynamicVariables.updateAnyVar(setTiempose, "id_empresa", data.id_empresa)
      selectAutomaticSuc(data.id_empresa)
      DynamicVariables.updateAnyVar(setTiempose, "id_sucursal", data.id_sucursal)
      DynamicVariables.updateAnyVar(setTiempose, "id_rango", data.id_rango)
      // //LLENAR LA VARIABLE COLECCION
      data.tiempos_entrega_data.forEach((dat: any) => {
        let obj = {
          id: dat.id,
          dia_recepcion: dat.dia_recepcion,
          hora_inicial_recepcion: dat.hora_inicial_recepcion,
          hora_final_recepcion: dat.hora_final_recepcion,
          dias_entrega: dat.dias_entrega,
          tipo: dat.tipo,
          tipoSel: 0,
          hora_entrega: dat.hora_entrega,
          entrega: dat.entrega,
          edit: false
        }
        DynamicVariables.updateAnyVarSetArrNoRepeat(setTiempose, "tEntregaData_nuevos", obj)
      });
      // data.sucursales.forEach((element:any) => {
      //     DynamicVariables.updateAnyVarSetArrNoRepeat(setColeccion, "colecciones_suc_piv", element)
      // });
      setModoUpdate(true)
    } else {
      DynamicVariables.updateAnyVar(setTiempose, "id_sucursal", sucursalSelCreate?.id)
      DynamicVariables.updateAnyVar(setTiempose, "id_empresa", empresaSelCreate?.id)
      setModoUpdate(false)
    }
  }
  const closeModal = () => {
    setModal(false)
  }

  useEffect(() => {
    DynamicVariables.updateAnyVar(setTiempose, "id_sucursal", sucursalSelCreate?.id)
    DynamicVariables.updateAnyVar(setTiempose, "id_empresa", empresaSelCreate?.id)
  }, [sucursalSelCreate, empresaSelCreate])

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    await DynamicVariables.updateAnyVar(setTiempose, "id_sucursal", sucursalSelCreate?.id)
    await DynamicVariables.updateAnyVar(setTiempose, "id_empresa", empresaSelCreate?.id)
    if (tiempose.nombre.length == 0) {
      Swal.fire("Notificacion", "Es necesario escribir un nombre para identificar el los tiempos de entrega", "warning")
      return
    }
    if (tiempose.id_rango == 0) {
      Swal.fire("Notificacion", "Es necesario seleccionar un rango para tus tiempos de entrega", "warning")
      return
    }
    if (!modoUpdate) {
      await APIs.CreateAny(tiempose, "tentrega_create")
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
              Swal.fire('Error al crear el tiempo de entrega', '', 'error');
            }
          } else {
            Swal.fire('Error de conexión.', '', 'error');
          }
        })
    } else {
      await APIs.CreateAny(tiempose, "tentrega_update")
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
              Swal.fire('Error al actualizar el tiempo de entrega', '', 'error');
            }
          } else {
            Swal.fire('Error de conexión.', '', 'error');
          }
        })
    }

  }
  const editarTiempo = (dat: any, index: number) => {
    let obj = {
      i: index,
      id: dat.id,
      dia_recepcion: dat.dia_recepcion,
      hora_inicial_recepcion: dat.hora_inicial_recepcion,
      hora_final_recepcion: dat.hora_final_recepcion,
      dias_entrega: dat.dias_entrega,
      tipo: dat.tipo,
      tipoSel: 0,
      hora_entrega: dat.hora_entrega,
      entrega: dat.entrega,
      edit: true
    }
    setConfigte(obj)
  }
  const actualizarUnTe = () => {
    let index = configte.i
    let newData = configte
    setTiempose((prevState) => {
      // Hacemos una copia del estado anterior
      const updatedTEntregaDataNuevos = [...prevState.tEntregaData_nuevos];

      // Actualizamos el índice específico con los nuevos datos
      updatedTEntregaDataNuevos[index] = newData;
      Swal.fire("Notificacion", "Tiempo Actualizado Correctamente", "success")
      setConfigte(configtec)
      // Retornamos un nuevo estado actualizado
      return {
        ...prevState,
        tEntregaData_nuevos: updatedTEntregaDataNuevos
      };
    });
  };
  const addToElim = (number:number) => {
    setTiempose((prevState:any) => ({...prevState,tEntregaData_elim: [...prevState.tEntregaData_elim, number] }))
  }
  return (
    <div className='te'>
      <div className='te__container'>

        <div className='row'>
          <div className='col-8'>
            <Empresas_Sucursales modeUpdate={false} empresaDyn={empresaSel} sucursalDyn={sucursalSel} setEmpresaDyn={setEmpresaSel} setSucursalDyn={setSucursalSel} all={true} />
          </div>
          <div className='col-3'>
            <label className='label__general'>Nombre</label>
            <input className={`inputs__general`} value={tiempose.nombre} onChange={(e) => DynamicVariables.updateAnyVar(setSearcher, "nombre", e.target.value)} type='text' placeholder='Ingresa nombre' />
          </div>
          <div className='col-1'>
            <label className='label__general'>Search</label>
            <button className='btn__general-purple' onClick={() => getData()}>Buscar</button>
          </div>
        </div>

        <div className='row'>
          <div className='col-12'>
            <div className='btns__create'>
              <button className='btn__general-purple' onClick={() => Modal(false, 0)}>Crear Tiempo de Entrega</button>
            </div>
          </div>
        </div>


        <div className='table__units' >
          <div>
            {data ? (
              <div>
                <p className='text'>Tus tiempos de entrega {data.length}</p>
              </div>
            ) : (
              <p>No hay tiempos de entrega</p>
            )}
          </div>
          <div className='table__head'>
            <div className='thead'>
              <div className='th'>
                <p className=''>RANGO</p>
              </div>
              <div className='th'>
                <p>NOMBRE</p>
              </div>
              <div className='th'>
                <p>SUCURSAL</p>
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
                        <p>{car.rango}</p>
                      </div>
                      <div className='td'>
                        {car.nombre}
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





        <div className={`overlay__create_modal ${modal ? 'active' : ''}`}>
          <div className={`popup__create_modal ${modal ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__create_modal" onClick={closeModal}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
            </a>
            {modoUpdate ?
              <p className='title__modals'><b>Actualizar Tiempos de Entrega</b></p>
              :
              <p className='title__modals'><b>Crear Tiempos de Entrega</b></p>
            }
            <hr />
            <div className='row'>
              <div className='col-12'>
                <span> <b> GENERAL</b></span>
                <hr />
                <div className='row'>
                  <div className='col-8'>
                    <Empresas_Sucursales modeUpdate={false} empresaDyn={empresaSelCreate} sucursalDyn={sucursalSelCreate}
                      setEmpresaDyn={setEmpresaSelCreate} setSucursalDyn={setSucursalSelCreate} />
                  </div>
                  <div className='col-4'>
                    <label className='label__general'>Nombre</label>
                    <input className={`inputs__general`} value={tiempose.nombre} onChange={(e) => DynamicVariables.updateAnyVar(setTiempose, "nombre", e.target.value)} type='text' placeholder='Ingresa nombre' />
                  </div>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-12'>
                <div className='select__container'>
                  <label className='label__general'>Rango</label>
                  <div className={`select-btn ${selectRangos ? 'active' : ''}`} onClick={() => setSelectRangos(!selectRangos)}>
                    <p>{tiempose.id_rango ? ranges.find((s: { id: number }) => s.id === tiempose.id_rango)?.titulo : 'Selecciona'}</p>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                  </div>
                  <div className={`content ${selectRangos ? 'active' : ''}`}>
                    <ul className={`options ${selectRangos ? 'active' : ''}`} style={{ opacity: selectRangos ? '1' : '0' }}>
                      {ranges && ranges.map((fam: any) => (
                        <li key={fam.id} onClick={() => {
                          DynamicVariables.updateAnyVar(setTiempose, "id_rango", fam.id);
                          setSelectRangos(false);
                        }}>
                          {fam.titulo}
                        </li>
                      ))
                      }
                    </ul>
                  </div>
                </div>
              </div>
            </div >
            <br />
            <hr />
            <b ref={forSlide} className={`${configte.edit ? 'fade-blink ' : ''}`}>CONFIGURAR TIEMPOS DE ENTREGA</b>
            <hr />
            <br />
            <div className={`${configte.edit ? 'card-attention ' : 'card-create'}`}>
              <span>Recepción:</span>
              <br />
              <div className='row '>
                <div className='col-3'>
                  <div className='select__container'>
                    <label className='label__general'>Tipo</label>
                    <div className={`select-btn ${selectTipote ? 'active' : ''}`} onClick={() => setSelectTipote(!selectTipote)}>
                      <p>{configte.tipo ? typeTe.find((s: { id: number }) => s.id === configte.tipo)?.nombre : 'Selecciona'}</p>
                      <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                    </div>
                    <div className={`content ${selectTipote ? 'active' : ''}`}>
                      <ul className={`options ${selectTipote ? 'active' : ''}`} style={{ opacity: selectTipote ? '1' : '0' }}>
                        {typeTe && typeTe.map((fam: any) => (
                          <li key={fam.id} onClick={() => { DynamicVariables.updateAnyVar(setConfigte, "tipo", fam.id); setSelectTipote(false); }}>
                            {fam.nombre}
                          </li>
                        ))
                        }
                      </ul>
                    </div>
                  </div>
                </div>
                <div className='col-3'>
                  <div className='select__container'>
                    <label className='label__general'>Día Recepción</label>
                    <div className={`select-btn ${selectDiaRecepcion ? 'active' : ''}`} onClick={() => setSelectDiaRecepcion(!selectDiaRecepcion)}>
                      <p>{configte.dia_recepcion ? dias.find((s: { nombre: string }) => s.nombre === configte.dia_recepcion)?.nombre : 'Selecciona'}</p>
                      <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                    </div>
                    <div className={`content ${selectDiaRecepcion ? 'active' : ''}`}>
                      <ul className={`options ${selectDiaRecepcion ? 'active' : ''}`} style={{ opacity: selectDiaRecepcion ? '1' : '0' }}>
                        {dias && dias.map((fam: any) => (
                          <li key={fam.id} onClick={() => { DynamicVariables.updateAnyVar(setConfigte, "dia_recepcion", fam.nombre); setSelectDiaRecepcion(false); }}>
                            {fam.nombre}
                          </li>
                        ))
                        }
                      </ul>
                    </div>
                  </div>
                </div>
                <div className='col-3'>
                  <label className='label__general'>HORA INICIAL</label>
                  <input className={`inputs__general`} value={configte.hora_inicial_recepcion} type={'time'} onChange={(e) => DynamicVariables.updateAnyVar(setConfigte, "hora_inicial_recepcion", e.target.value)} placeholder='Ingresa nombre' />
                </div>
                <div className='col-3'>
                  <label className='label__general'>HORA FINAL</label>
                  <input className={`inputs__general`} value={configte.hora_final_recepcion} type={'time'} onChange={(e) => DynamicVariables.updateAnyVar(setConfigte, "hora_final_recepcion", e.target.value)} placeholder='Ingresa nombre' />
                </div>


              </div>
              <br />
              <span>Entrega:</span>
              <br />
              <div className='row'>
                <div className='col-5'>
                  <label className='label__general'>DÍAS DESPUES DE LA RECEPCIÓN</label>
                  <input className={`inputs__general`} value={configte.dias_entrega} type={'number'} onChange={(e) => { DynamicVariables.updateAnyVar(setConfigte, "dias_entrega", e.target.value); }} placeholder='Ingresa Dias' />

                </div>
                <div className='col-3'>
                  <label className='label__general'>HORA ENTREGA</label>
                  <input className={`inputs__general`} value={configte.hora_entrega} type={'time'} onChange={(e) => DynamicVariables.updateAnyVar(setConfigte, "hora_entrega", e.target.value)} />
                </div>
                <div className='col-3'>
                  <label className='label__general'>ENTREGA:</label>
                  <span style={{ color: 'red' }}> <b> {configte.entrega} a las {configte.hora_entrega}</b></span>
                </div>
                {configte.edit ?
                  <div className='col-1 '>
                    <button className='btn-success fade-blink' type='button' onClick={(e) => actualizarUnTe()}>Guardar</button>
                    <button className='btn__delete_users' type='button' onClick={(e) => setConfigte(configtec)}>Cancelar</button>
                  </div>
                  :
                  <div className='col-1'>
                    <label className='label__general'>Agregar</label>
                    <button className='btn__general-orange' type='button' onClick={(e) => DynamicVariables.updateAnyVarSetArrNoRepeat(setTiempose, "tEntregaData_nuevos", configte)}>+Add</button>
                  </div>
                }

              </div>

            </div>
            <br />
            <div className='row  card-white'>
              <div className='col-12'>
                <span><b>PRODUCCION</b></span>
                <div className='table__modal_te'>
                  <div>
                    {tiempose.tEntregaData_nuevos.length >= 1 ? (
                      <div>
                        <p className='text'>Tus Tiempos de Clientes {tiempose.tEntregaData_nuevos.length}</p>
                      </div>
                    ) : (
                      <p className='text'>No hay Tiempos de Cliente</p>
                    )}
                  </div>
                  <div className='table__head'>
                    <div className='thead' >
                      <div className='th'>
                        <p className='' title='Recepción'>Rec.</p>
                      </div>
                      <div className='th'>
                        <p className='' title='Hora Inicial Recepción'>HI</p>
                      </div>
                      <div className='th'>
                        <p className='' title='Hora Final Recepción'>HF.</p>
                      </div>
                      <div className='th'>
                        <p className='' title='Días Despues de la Recepción'>DDR.</p>
                      </div>
                      <div className='th'>
                        <p className='' title='Hora entrega'>HE</p>
                      </div>
                    </div>
                  </div>
                  {tiempose.tEntregaData_nuevos.length > 0 ? (
                    <div className='table__body'>
                      {tiempose.tEntregaData_nuevos.map((dat, index) => (

                        <div className='tbody__container' key={index}>
                          {dat.tipo == 1 ?
                            <div className='tbody'>
                              <div className='td'>
                                {dat.dia_recepcion}
                              </div>
                              <div className='td'>
                                {dat.hora_inicial_recepcion}
                              </div>
                              <div className='td'>
                                {dat.hora_final_recepcion}
                              </div>
                              <div className='td'>
                                {dat.dias_entrega}
                              </div>
                              <div className='td'>
                                {dat.entrega} a las {dat.hora_entrega}
                              </div>
                              <div className='td'>
                                <button className='btn-warning m-2' type="button" onClick={() => { editarTiempo(dat, index); handleScroll() }}>Editar</button>
                                <button className='btn__delete_users' type="button" onClick={() => {
                                  {modoUpdate && dat.id != 0? addToElim(dat.id) : null}
                                  ; DynamicVariables.removeObjectInArrayByKey(setTiempose, "tEntregaData_nuevos", index);
                                }}>Del</button>

                              </div>
                            </div>
                            : ''

                          }

                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text'>No hay empresas que cargar</p>
                  )}
                </div>
              </div>
              <div className='col-12'>
                <span><b>CLIENTES</b> </span>

                <div className='table__modal_te'>
                  <div>
                    {tiempose.tEntregaData_nuevos.length >= 1 ? (
                      <div>
                        <p className='text'>Tus Tiempos de Clientes {tiempose.tEntregaData_nuevos.length}</p>
                      </div>
                    ) : (
                      <p className='text'>No hay Tiempos de Cliente</p>
                    )}
                  </div>
                  <div className='table__head'>
                    <div className='thead' >
                      <div className='th'>
                        <p className='' title='Recepción'>Rec.</p>
                      </div>
                      <div className='th'>
                        <p className='' title='Hora Inicial Recepción'>HI</p>
                      </div>
                      <div className='th'>
                        <p className='' title='Hora Final Recepción'>HF.</p>
                      </div>
                      <div className='th'>
                        <p className='' title='Días Despues de la Recepción'>DDR.</p>
                      </div>
                      <div className='th'>
                        <p className='' title='Hora entrega'>HE</p>
                      </div>
                    </div>
                  </div>
                  {tiempose.tEntregaData_nuevos.length > 0 ? (
                    <div className='table__body'>
                      {tiempose.tEntregaData_nuevos.map((dat, index) => (

                        <div className='tbody__container' key={index}>
                          {dat.tipo == 2 ?
                            <div className='tbody'>
                              <div className='td'>
                                {dat.dia_recepcion}
                              </div>
                              <div className='td'>
                                {dat.hora_inicial_recepcion}
                              </div>
                              <div className='td'>
                                {dat.hora_final_recepcion}
                              </div>
                              <div className='td'>
                                {dat.dias_entrega}
                              </div>
                              <div className='td'>
                                {dat.entrega} a las {dat.hora_entrega}
                              </div>
                              <div className='td'>
                                <button className='btn-warning m-2' type="button" onClick={() => { editarTiempo(dat, index); handleScroll() }}>Editar</button>
                                <button className='btn__delete_users' type="button" onClick={() => {
                                   {modoUpdate && dat.id != 0? addToElim(dat.id) : null};
                                  DynamicVariables.removeObjectInArrayByKey(setTiempose, "tEntregaData_nuevos", index);
                                }}>Del</button>

                              </div>
                            </div>
                            : ''

                          }

                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text'>No hay empresas que cargar</p>
                  )}
                </div>
              </div>
            </div>
            <br />
            <br />
            <button className='btn__general-purple' onClick={(e) => create(e)}>Crear Tiempo de entrega</button>
          </div>
        </div>


      </div>
    </div>
  )
}

export default TiemposEntrega
