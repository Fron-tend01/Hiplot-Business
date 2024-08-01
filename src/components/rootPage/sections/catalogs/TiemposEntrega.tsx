import APIs from '../../../../services/services/APIs'
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react'
import DynamicVariables from '../../../../utils/DynamicVariables';
import '../../../../utils/DynamicVariables';
import useUserStore from '../../../../zustand/General';
import "./styles/TiemposEntrega.css"
import { RangesRequests } from '../../../../fuctions/Ranges'
import { companiesRequests } from '../../../../fuctions/Companies';
import { BranchOfficesRequests } from '../../../../fuctions/BranchOffices';

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
    id: 0,
    dia_recepcion: '',
    hora_inicial_recepcion: '',
    hora_final_recepcion: '',
    dias_entrega: 0,
    tipo: 0,
    tipoSel: 0,
    hora_entrega: '',
    entrega: ''
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

  const {getCompaniesXUsers}: any = companiesRequests()
  const [companies, setCompanies] = useState<any>([])

  const {getBranchOffices}: any = BranchOfficesRequests()

  const [modal, setModal] = useState<boolean>(false)
  const [modoUpdate, setModoUpdate] = useState<boolean>(false)

  const [selectEmpresas, setSelectEmpresas] = useState<boolean>(false)
  const [selectSucursales, setSelectSucursales] = useState<boolean>(false)

  const [data, setData] = useState<any>(null)

  const [selectTipote, setSelectTipote] = useState<boolean>(false)
  const [selectDiaRecepcion, setSelectDiaRecepcion] = useState<boolean>(false)
  const [filteringBranchOffices, setFilteringBranchOffices] = useState<any>([])
  const userState = useUserStore(state => state.user);
  const { getRanges }: any = RangesRequests();
  const [ranges, setRanges] = useState<any>([])
  const [selectRangos, setSelectRangos] = useState<boolean>(false)

  let user_id = userState.id

  const [searcher, setSearcher] = useState<any>({})
  const fetch = async () => {
    let resultCompanies = await getCompaniesXUsers(user_id)
    let resultBranch = await getBranchOffices(resultCompanies[0].id, user_id)

    setCompanies(resultCompanies)
    // await selectAutomaticSuc(resultCompanies[0].id)
    // await selectAutomaticSucSearcher(resultCompanies[0].id)
    let resultRanges = await getRanges();
    setRanges(resultRanges)

    setSearcher({
      id: 0,
      nombre: '',
      id_sucursal: 0,
      id_empresa: 0,
      empresas: [...resultCompanies],
      empresasSelectOp: false,
      sucursales: [...resultBranch],
      sucursalesFiltering: [],
      sucursalesSelectOp: false,
      id_usuario: user_id
    })
  }

  useEffect(() => {
    fetch()
    getData()
    calcular_entrega()
  }, [configte.dia_recepcion, configte.dias_entrega, configte.entrega ])
  const getData = async () => {
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
  const selectAutomaticSucSearcher = async (company: any) => {
    console.log(company);
    
    let resultBranch = await getBranchOffices(company, user_id)
    DynamicVariables.updateAnyVar(setSearcher, "sucursalesFiltering", resultBranch)
  }
  const Modal = (modoUpdate: boolean, data: any) => {
    setModal(true)
    setTiempose({...forclearte})
    if (modoUpdate) {
      DynamicVariables.updateAnyVar(setTiempose, "id", data.id)
      DynamicVariables.updateAnyVar(setTiempose, "nombre", data.nombre)
      DynamicVariables.updateAnyVar(setTiempose, "id_empresa", data.id_empresa)
      selectAutomaticSuc(data.id_empresa)
      DynamicVariables.updateAnyVar(setTiempose, "id_sucursal", data.id_sucursal)
      DynamicVariables.updateAnyVar(setTiempose, "id_rango", data.id_rango)
      // //LLENAR LA VARIABLE COLECCION
      // data.articulos.forEach((element:any) => {
      //   DynamicVariables.updateAnyVarSetArrNoRepeat(setColeccion, "colecciones_art_piv", element)
      //   // DynamicVariables.updateAnyVarSetArrNoRepeat(setColeccion, "combinaciones_sucursales", element.id)
      // });
      // data.sucursales.forEach((element:any) => {
      //     DynamicVariables.updateAnyVarSetArrNoRepeat(setColeccion, "colecciones_suc_piv", element)
      // });
      setModoUpdate(true)
    } else {
      setModoUpdate(false)
    }
  }
  const closeModal = () => {
    setModal(false)
  }
  const create = async (e: React.FormEvent) => {
    e.preventDefault();

    // console.log(tiempose);

    await APIs.CreateAny(tiempose, "tentrega_create")
      .then(async (response: any) => {
        Swal.fire('Notificación', response.mensaje, 'success');
        // await getData()
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
  }
  return (
    <div className='te'>
      <div className='te__container'>

        <div className='row'>
          <div className='col-4'>
            <div className='select__container'>
              <label className='label__general'>Empresa</label>
              <div className={`select-btn ${searcher.empresasSelectOp ? 'active' : ''}`} onClick={() => DynamicVariables.updateAnyVar(setSearcher, "empresasSelectOp", !searcher.empresasSelectOp)}>
                <p>{searcher.id_empresa ? searcher.empresas.find((s: { id: number }) => s.id === searcher.id_empresa)?.razon_social : 'Selecciona'}</p>
                <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
              </div>
              <div className={`content ${searcher.empresasSelectOp ? 'active' : ''}`}>
                <ul className={`options ${searcher.empresasSelectOp ? 'active' : ''}`} style={{ opacity: searcher.empresasSelectOp ? '1' : '0' }}>
                  {searcher.empresas && searcher.empresas.map((fam: any) => (
                    <li key={fam.id} onClick={() => {
                      DynamicVariables.updateAnyVar(setSearcher, "id_empresa", fam.id);
                      DynamicVariables.updateAnyVar(setSearcher, "empresasSelectOp", false); selectAutomaticSucSearcher(fam.id);
                    }}>
                      {fam.razon_social}
                    </li>
                  ))
                  }
                </ul>
              </div>
            </div>
          </div>
          <div className='col-4'>
            <div className='select__container'>
              <label className='label__general'>Sucursal</label>
              <div className={`select-btn ${searcher.sucursalesSelectOp ? 'active' : ''}`} onClick={() => DynamicVariables.updateAnyVar(setSearcher, "sucursalesSelectOp", !searcher.sucursalesSelectOp)}>
                <p>{searcher.id_sucursal ? searcher.sucursalesFiltering.find((s: { id: number }) => s.id === searcher.id_sucursal)?.nombre : 'Selecciona'}</p>
                <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
              </div>
              <div className={`content ${searcher.sucursalesSelectOp ? 'active' : ''}`}>
                <ul className={`options ${searcher.sucursalesSelectOp ? 'active' : ''}`} style={{ opacity: searcher.sucursalesSelectOp ? '1' : '0' }}>
                  {searcher.sucursalesFiltering && searcher.sucursalesFiltering.map((fam: any) => (
                    <li key={fam.id} onClick={() => {
                      DynamicVariables.updateAnyVar(setSearcher, "id_sucursal", fam.id);
                      DynamicVariables.updateAnyVar(setSearcher, "sucursalesSelectOp", false);
                    }}>
                      {fam.nombre}
                    </li>
                  ))
                  }
                </ul>
              </div>
            </div>
          </div>
          <div className='col-3'>
            <label className='label__general'>Nombre</label>
            <input className={`inputs__general`} value={tiempose.nombre} onChange={(e) => DynamicVariables.updateAnyVar(setTiempose, "nombre", e.target.value)} type='text' placeholder='Ingresa nombre' />
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
                  <div className='col-4'>
                    <div className='select__container'>
                      <label className='label__general'>Empresa</label>
                      <div className={`select-btn ${selectEmpresas ? 'active' : ''}`} onClick={() => setSelectEmpresas(!selectEmpresas)}>
                        <p>{tiempose.id_empresa ? companies?.find((s: { id: number }) => s.id === tiempose.id_empresa)?.razon_social : 'Selecciona'}</p>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                      </div>
                      <div className={`content ${selectEmpresas ? 'active' : ''}`}>
                        <ul className={`options ${selectEmpresas ? 'active' : ''}`} style={{ opacity: selectEmpresas ? '1' : '0' }}>
                          {companies?.map((fam: any) => (
                            <li key={fam.id} onClick={() => {
                              DynamicVariables.updateAnyVar(setTiempose, "id_empresa", fam.id);
                              setSelectEmpresas(false); selectAutomaticSuc(fam.id);
                            }}>
                              {fam.razon_social}
                            </li>
                          ))
                          }
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className='col-4'>
                    <div className='select__container'>
                      <label className='label__general'>Sucursal</label>
                      <div className={`select-btn ${selectSucursales ? 'active' : ''}`} onClick={() => setSelectSucursales(!selectSucursales)}>
                        <p>{tiempose.id_sucursal ? filteringBranchOffices.find((s: { id: number }) => s.id === tiempose.id_sucursal)?.nombre : 'Selecciona'}</p>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                      </div>
                      <div className={`content ${selectSucursales ? 'active' : ''}`}>
                        <ul className={`options ${selectSucursales ? 'active' : ''}`} style={{ opacity: selectSucursales ? '1' : '0' }}>
                          {filteringBranchOffices && filteringBranchOffices.map((fam: any) => (
                            <li key={fam.id} onClick={() => {
                              DynamicVariables.updateAnyVar(setTiempose, "id_sucursal", fam.id);
                              setSelectSucursales(false);
                            }}>
                              {fam.nombre}
                            </li>
                          ))
                          }
                        </ul>
                      </div>
                    </div>
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
            </div>
            <br />
            <hr />
            <b>CONFIGURAR TIEMPOS DE ENTREGA</b>
            <hr />
            <br />
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
              <div className='col-1'>
                <label className='label__general'>Agregar</label>
                <button className='btn__general-orange' type='button' onClick={(e) => DynamicVariables.updateAnyVarSetArrNoRepeat(setTiempose, "tEntregaData_nuevos", configte)}>+Add</button>
              </div>
            </div>
            <br />
            <div className='row  card-white'>
              <div className='col-6'>
                <span><b>PRODUCCION</b></span>
                <div className='table__modal_combinations'>
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
                    <div className='thead'>
                      <div className='th'>
                        <p className=''>Tiempo de entrega</p>
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
                                <button className='btn__delete_users' type="button" onClick={() => {
                                  DynamicVariables.removeObjectInArrayByKey(setTiempose, "tEntregaData_nuevos", index);
                                }}>Eliminar</button>
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
              <div className='col-6'>
                <span><b>CLIENTES</b> </span>

                <div className='table__modal'>
                  <div>
                    {tiempose.tEntregaData_nuevos.length >= 1  ? (
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
                              <div className='td'>
                              </div>
                              <div className='td'>
                              </div>
                              <div className='td'>
                              </div>
                              <div className='td'>
                              </div>
                              <div className='td'>
                                <button className='btn__delete_users' type="button" onClick={() => {
                                  DynamicVariables.removeObjectInArrayByKey(setTiempose, "tEntregaData_nuevos", index);
                                }}>Eliminar</button>
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
