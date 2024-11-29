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
import { storeArticles } from '../../../../zustand/Articles';

interface Coleccion {
  id: 0,
  nombre: string,
  id_familia: number,
  id_empresa: number,
  id_sucursal: number,
  empresa: any,
  sucursal: any,
  img: string,
  status: boolean,
  colecciones_art: any[],
  colecciones_suc: any[],
  colecciones_art_piv: any[],
  colecciones_suc_piv: any[],
  articulos_remove: any[],
  sucursales_remove: any[]
}
export default function Colecciones() {
  const typeSearchs = [
    {
      id: 0,
      name: 'Código'
    },
    {
      id: 1,
      name: 'Nombre'
    }
  ]
  const [modal, setModal] = useState<boolean>(false)
  const [forclearColeccion] = useState<Coleccion>({
    id: 0,
    nombre: '',
    id_familia: 0,
    id_empresa: 0,
    id_sucursal: 0,
    empresa: {
      id: 0,
      razon_social: ''
    },
    sucursal: {
      id: 0,
      nombre: ''
    },
    img: '',
    status: true,
    colecciones_art: [],
    colecciones_suc: [],
    colecciones_art_piv: [],
    colecciones_suc_piv: [],
    articulos_remove: [],
    sucursales_remove: []
  });
  const [coleccion, setColeccion] = useState<Coleccion>({
    id: 0,
    nombre: '',
    id_familia: 0,
    id_empresa: 0,
    id_sucursal: 0,
    empresa: {
      id: 0,
      razon_social: ''
    },
    sucursal: {
      id: 0,
      nombre: ''
    },
    img: '',
    status: true,
    colecciones_art: [],
    colecciones_suc: [],
    colecciones_art_piv: [],
    colecciones_suc_piv: [],
    articulos_remove: [],
    sucursales_remove: []
  });
  const { getCompaniesXUsers, companiesXUsers }: any = storeCompanies();
  const { getBranchOfficeXCompanies, branchOfficeXCompanies }: any = storeBranchOffcies();

  const { getFamilies, families }: any = storeFamilies()
  const [modoUpdate, setModoUpdate] = useState<boolean>(false)
  const [selectFamilias, setSelectFamilias] = useState<boolean>(false)
  const [selectEmpresas, setSelectEmpresas] = useState<boolean>(false)
  const [selectSucursales, setSelectSucursales] = useState<boolean>(false)
  const [filteringBranchOffices, setFilteringBranchOffices] = useState<any>([])
  const [selectTypeSearch, setSelectTypeSearch] = useState<boolean>(false)
  const [searchBy, setSearchBy] = useState<any>(null)
  const { articles, getArticles }: any = storeArticles();
  const [selectModalResults, setSelectModalResults] = useState<boolean>(false)
  const [selectedModalResult, setSelectedModalResult] = useState<number | null>(null)
  const [selectedTypeSearch, setSelectedTypeSearch] = useState<number | null>(null)
  const [data, setData] = useState<any>(null)

  const userState = useUserStore(state => state.user);
  const user_id = userState.id


  useEffect(() => {
    getCompaniesXUsers(user_id)
    getBranchOfficeXCompanies(0, user_id)
    getFamilies(user_id)
    getData()
  }, [])
  const Modal = (modoUpdate:boolean, data:any) => {
    setModal(true)
    setColeccion({...forclearColeccion})
    if (modoUpdate) {
      DynamicVariables.updateAnyVar(setColeccion, "id", data.id)
      DynamicVariables.updateAnyVar(setColeccion, "nombre", data.nombre)
      DynamicVariables.updateAnyVar(setColeccion, "status", data.status)
      DynamicVariables.updateAnyVar(setColeccion, "img", data.img)
      DynamicVariables.updateAnyVar(setColeccion, "id_familia", data.id_familia)
      //LLENAR LA VARIABLE COLECCION
      data.articulos.forEach((element:any) => {
        DynamicVariables.updateAnyVarSetArrNoRepeat(setColeccion, "colecciones_art_piv", element)
        // DynamicVariables.updateAnyVarSetArrNoRepeat(setColeccion, "combinaciones_sucursales", element.id)
      });
      data.sucursales.forEach((element:any) => {
          DynamicVariables.updateAnyVarSetArrNoRepeat(setColeccion, "colecciones_suc_piv", element)
      });
      setModoUpdate(true)

    }else {
      setModoUpdate(false)
    }
  }

  const closeModal = () => {
    setModal(false)
  }
  const changeImg = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const image = reader.result as string; // Asegurar que image sea de tipo string
        DynamicVariables.updateAnyVar(setColeccion, "img", image)
        console.log('Imagen convertida a Base64:', image);
      };
      reader.onerror = (error) => {
        console.error('Error al leer el archivo:', error);
      };
      reader.readAsDataURL(file);
    }
  };
  const selectAutomaticSuc = (company: any) => {
    const filter = branchOfficeXCompanies.filter((x: any) => x.empresa_id === company)
    setFilteringBranchOffices(filter)
  }
  //   const getData = async () => {
  //     let result = await APIs.GetAny("get_combinacion/get")
  //     setData(result)
  // }
  const addEmpresa = () => {
    const data = {
      id: 0,
      id_empresa: coleccion.id_empresa,
      razon_social: coleccion.empresa.razon_social,
      id_sucursal: coleccion.id_sucursal,
      nombre_sucursal: coleccion.sucursal.nombre
    }
    DynamicVariables.updateAnyVarSetArrNoRepeat(setColeccion, "colecciones_suc_piv", data)
    DynamicVariables.updateAnyVarSetArrNoRepeat(setColeccion, "colecciones_suc", coleccion.id_sucursal)
  };

  const openSelectModalTypeSearch = () => {
    setSelectTypeSearch(!selectTypeSearch)
  }
  const handleModalTypeSearchChange = (type: any) => {
    setSelectedTypeSearch(type.id)
    setSelectTypeSearch(false)
  }
  const searchFor = () => {
    const id = 0;
    const activos = true;
    const nombre = '';
    const codigo = searchBy;
    const familia = 0;
    const proveedor = 0;
    const materia_prima = 0;
    const get_sucursales = false;
    const get_proveedores = false;
    const get_max_mins = false;
    const get_plantilla_data = false;
    const get_stock = false;
    const id_usuario = user_id;

    if (selectedTypeSearch === 0) {
      getArticles({ id, activos, nombre, codigo, familia, proveedor, materia_prima, get_sucursales, get_proveedores, get_max_mins, get_plantilla_data, get_stock, id_usuario })
    } else if (selectedTypeSearch === 1) {

    }
  };


  const handleModalResultsChange = (item: any) => {
    setSelectedModalResult(item.id)
    setSelectModalResults(false)
  }
  const openSelectModalResults = () => {
    setSelectModalResults(!selectModalResults)
  }
  const addArticles = () => {
    const seleccionado = articles.filter((a: any) => a.id == selectedModalResult)
    const sel = seleccionado[0]
    const data = {
      id: sel.id,
      codigo: sel.codigo,
      nombre: sel.nombre,
    }
    DynamicVariables.updateAnyVarSetArrNoRepeat(setColeccion, "colecciones_art_piv", data)
    DynamicVariables.updateAnyVarSetArrNoRepeat(setColeccion, "colecciones_art", data.id)
  };
  const createColeccion = async (e: React.FormEvent)=> {
    e.preventDefault();
    
    await APIs.CreateAny(coleccion, "create_coleccion/create")
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
  const getData = async () => {
    const result = await APIs.GetAny("get_coleccion/get")
    setData(result)
}
const updateColeccion = async (e: React.FormEvent)=> {
  e.preventDefault();
  
  await APIs.CreateAnyPut(coleccion, "update_coleccion/update")
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
        <div className='btns__create_colecciones'>
          <button className='btn__general-purple' onClick={()=>Modal(false, 0)}>Crear Coleccion</button>
        </div>
        <div className={`overlay__create_modal_colecciones ${modal ? 'active' : ''}`}>
          <div className={`popup__create_modal_colecciones ${modal ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__create_modal_colecciones" onClick={closeModal}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
            </a>
            {modoUpdate ? 
              <p className='title__modals'><b>Actualizar Colección</b></p>
              :
              <p className='title__modals'><b>Crear Colección</b></p>
            }
            <br />
            <hr />
            <br />
            <div className='row'>
              <div className='col-3'>
                <div className="container__change_img2" style={{ backgroundImage: `url(${coleccion.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <label className="custom-file-upload2">
                    <small> Seleccionar archivo</small>
                    <input id="custom-file-upload2" type="file" onChange={changeImg} />
                  </label>
                </div>
              </div>
              <div className='col-4'>
                <label className='label__general'>Nombre</label>
                <input className={`inputs__general`} value={coleccion.nombre} onChange={(e) => DynamicVariables.updateAnyVar(setColeccion, "nombre", e.target.value)} type='text' placeholder='Ingresa nombre' />

              </div>
              <div className='col-2'>
                <div className='select__container'>
                  <label className='label__general'>Familia</label>
                  <div className={`select-btn ${selectFamilias ? 'active' : ''}`} onClick={() => setSelectFamilias(!selectFamilias)}>
                    <p>{coleccion.id_familia ? families.find((s: { id: number }) => s.id === coleccion.id_familia)?.nombre : 'Selecciona'}</p>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                  </div>
                  <div className={`content ${selectFamilias ? 'active' : ''}`}>
                    <ul className={`options ${selectFamilias ? 'active' : ''}`} style={{ opacity: selectFamilias ? '1' : '0' }}>
                      {families && families.map((fam: any) => (
                        <li key={fam.id} onClick={() => { DynamicVariables.updateAnyVar(setColeccion, "id_familia", fam.id); setSelectFamilias(false) }}>
                          {fam.nombre}
                        </li>
                      ))
                      }
                    </ul>
                  </div>
                </div>
              </div>
              <div className='col-1'>
                <label>Status</label><br></br>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={coleccion.status} // Asignar el valor del estado al atributo 'checked'
                    onChange={(e) => { DynamicVariables.updateAnyVar(setColeccion, "status", e.target.checked); }}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
            <br />
            <hr />
            <span> <b> AGREGAR SUCURSALES Y ARTICULOS</b></span>
            <hr />
            <br />
            <div className='row'>
              <div className='col-6'>
              <span> <b> SUCURSALES</b></span>
                    <hr />
                <div className='row'>
                  <div className='col-12'>
                    <div className='select__container'>
                      <label className='label__general'>Empresas</label>
                      <div className={`select-btn ${selectEmpresas ? 'active' : ''}`} onClick={() => setSelectEmpresas(!selectEmpresas)}>
                        <p>{coleccion.id_empresa ? companiesXUsers.find((s: { id: number }) => s.id === coleccion.id_empresa)?.razon_social : 'Selecciona'}</p>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                      </div>
                      <div className={`content ${selectEmpresas ? 'active' : ''}`}>
                        <ul className={`options ${selectEmpresas ? 'active' : ''}`} style={{ opacity: selectEmpresas ? '1' : '0' }}>
                          {companiesXUsers && companiesXUsers.map((fam: any) => (
                            <li key={fam.id} onClick={() => {
                              DynamicVariables.updateAnyVar(setColeccion, "id_empresa", fam.id);
                              setSelectEmpresas(false); selectAutomaticSuc(fam.id);
                              DynamicVariables.updateAnyVar(setColeccion, "empresa", fam);
                            }}>
                              {fam.razon_social}
                            </li>
                          ))
                          }
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className='col-12'>
                    <div className='select__container'>
                      <label className='label__general'>Sucursales</label>
                      <div className={`select-btn ${selectSucursales ? 'active' : ''}`} onClick={() => setSelectSucursales(!selectSucursales)}>
                        <p>{coleccion.id_sucursal ? filteringBranchOffices.find((s: { id: number }) => s.id === coleccion.id_sucursal)?.nombre : 'Selecciona'}</p>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                      </div>
                      <div className={`content ${selectSucursales ? 'active' : ''}`}>
                        <ul className={`options ${selectSucursales ? 'active' : ''}`} style={{ opacity: selectSucursales ? '1' : '0' }}>
                          {filteringBranchOffices && filteringBranchOffices.map((fam: any) => (
                            <li key={fam.id} onClick={() => {
                              DynamicVariables.updateAnyVar(setColeccion, "id_sucursal", fam.id);
                              setSelectSucursales(false);
                              DynamicVariables.updateAnyVar(setColeccion, "sucursal", fam);
                            }}>
                              {fam.nombre}
                            </li>
                          ))
                          }
                        </ul>
                      </div>
                    </div>

                  </div>
                  <div className='col-12'>
                    <label className='label__general'>Agregar</label>
                    <button className='btn__general-orange' type='button' onClick={addEmpresa}>+Add</button>
                  </div>
                </div>
                <br />
                <hr />
                <br />
                <div className='table__modal_combinations'>
                  <div>
                    {coleccion.colecciones_suc_piv.length >= 1 ? (
                      <div>
                        <p className='text'>Tus sucursales {coleccion.colecciones_suc_piv.length}</p>
                      </div>
                    ) : (
                      <p className='text'>No hay sucursales</p>
                    )}
                  </div>
                  <div className='table__head'>
                    <div className='thead'>
                      <div className='th'>
                        <p className=''>Sucursal</p>
                      </div>
                    </div>
                  </div>
                  {coleccion.colecciones_suc_piv.length > 0 ? (
                    <div className='table__body'>
                      {coleccion.colecciones_suc_piv.map((dat, index) => (
                        <div className='tbody__container' key={index}>
                          <div className='tbody'>
                            <div className='td'>
                              {dat.nombre_sucursal} ({dat.razon_social})
                            </div>
                            <div className='td'>
                              <button className='btn__delete_users' type="button" onClick={() => {
                                DynamicVariables.removeObjectInArrayByKey(setColeccion, "colecciones_suc_piv", index);
                                DynamicVariables.removeObjectInArrayByKey(setColeccion, "colecciones_suc", index);
                                {modoUpdate && dat.id != 0? DynamicVariables.updateAnyVarSetArrNoRepeat(setColeccion, "sucursales_remove", dat.id) : null}
                              }}>Eliminar</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text'>No hay sucursales que cargar</p>
                  )}
                </div>
              </div>
              <div className='col-6 card-white'>
              <span > <b>ARTICULOS</b></span>
                  <hr />
                <div className='conatiner__direct'>
                  <div className='row__one'>
                    <div className='select__container'>
                      <label className='label__general'>Buscar por</label>
                      <div className='select-btn__general'>
                        <div className={`select-btn ${selectTypeSearch ? 'active' : ''}`} onClick={openSelectModalTypeSearch}>
                          <p>{selectedTypeSearch !== null ? typeSearchs.find((s: { id: number }) => s.id === selectedTypeSearch)?.name : 'selecciona'}</p>
                          <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                        </div>
                        <div className={`content ${selectTypeSearch ? 'active' : ''}`}>
                          <ul className={`options ${selectTypeSearch ? 'active' : ''}`} style={{ opacity: selectTypeSearch ? '1' : '0' }}>
                            {typeSearchs && typeSearchs.map((type: any) => (
                              <li key={type.id} onClick={() => handleModalTypeSearchChange(type)}>
                                {type.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className='label__general'>Buscador</label>
                        <input className='inputs__general' type='text' value={searchBy} onChange={(e) => setSearchBy(e.target.value)} placeholder='Ingresa el nombre' />
                      </div>
                    </div>
                    <div className='container__search'>
                      <button className='btn__general-purple btn__container' type='button' onClick={searchFor}>
                        Buscar
                        <svg className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /></svg>
                      </button>
                    </div>
                  </div>
                  <div className='row__two'>
                    <div className='container__two'>
                      <div className='select__container'>
                        <label className='label__general'>Resultados</label>
                        <div className='select-btn__general'>
                          <div className={`select-btn ${selectModalResults ? 'active' : ''}`} onClick={openSelectModalResults}>
                            <p>{selectedModalResult ? `${articles.find((s: { id: number }) => s.id === selectedModalResult)?.codigo} ${articles.find((s: { id: number }) => s.id === selectedModalResult)?.nombre}` : 'Selecciona'}</p>
                            <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                          </div>
                          <div className={`content ${selectModalResults ? 'active' : ''}`}>
                            <ul className={`options ${selectModalResults ? 'active' : ''}`} style={{ opacity: selectModalResults ? '1' : '0' }}>
                              {articles && articles.map((item: any) => (
                                <li key={item.id} onClick={() => handleModalResultsChange(item)}>
                                  {item.codigo}-{item.nombre}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div>
                        <button className='btn__general-purple' type='button' onClick={addArticles}>Agregar</button>
                      </div>
                    </div>
                  </div>
                </div>
                <br />
                <hr />
                <br />
                <div className='table__modal_combinations'>
                  <div>
                    {coleccion.colecciones_art_piv.length >= 1 ? (
                      <div>
                        <p className='text'>Tus articulos {coleccion.colecciones_art_piv.length}</p>
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
                  {coleccion.colecciones_art_piv.length > 0 ? (
                    <div className='table__body'>
                      {coleccion.colecciones_art_piv.map((dat, index) => (
                        <div className='tbody__container' key={index}>
                          <div className='tbody'>
                            <div className='td'>
                              {dat.nombre} ({dat.codigo})
                            </div>
                            <div className='td'>
                              <button className='btn__delete_users' type="button" onClick={() => {
                                DynamicVariables.removeObjectInArrayByKey(setColeccion, "colecciones_art_piv", index);
                                DynamicVariables.removeObjectInArrayByKey(setColeccion, "colecciones_art", index);
                                {modoUpdate && dat.id != 0? DynamicVariables.updateAnyVarSetArrNoRepeat(setColeccion, "articulos_remove", dat.id) : null}
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
              // <p className='title__modals'><b>Actualizar Colección</b></p>
              <input className='btn__general-purple' onClick={updateColeccion} value="Actualizar Colección" />

              :
              // <p className='title__modals'><b>Crear Colección</b></p>
              <input className='btn__general-purple' onClick={createColeccion} value="Crear Colección" />

            }
          </div>
        </div>

        <div className='table__units' >
                    <div>
                        {data ? (
                            <div>
                                <p className='text'>Tus colecciones {data.length}</p>
                            </div>
                        ) : (
                            <p>No hay colecciones</p>
                        )}
                    </div>
                    <div className='table__head'>
                        <div className='thead'>
                            <div className='th'>
                                <p className=''>Nombre</p>
                            </div>
                            <div className='th'>
                                <p>Status</p>
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
                                                {car.status == true ? "ACTIVO" : "INACTIVO"}
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
      </div>
    </div>
  )
}
