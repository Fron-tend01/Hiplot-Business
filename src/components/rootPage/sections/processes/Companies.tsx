import React, { useState, useEffect } from 'react';
import { storeCompanies } from '../../../../zustand/Companies';
import useUserStore from '../../../../zustand/General';
import { storeViews } from '../../../../zustand/views';
import APIs from '../../../../services/services/APIs'
import Swal from 'sweetalert2';
import DynamicVariables from '../../../../utils/DynamicVariables';
import { useSelectStore } from '../../../../zustand/Select';
import Select from '../../Dynamic_Components/Select';


import './styles/Companies.css';

const Companies: React.FC = () => {
  // Id del del usuario global
  const userState = useUserStore(state => state.user);
  let user_id = userState.id
  const [model, setModel] = useState<any>({
    id: 0,
    razon_social: '',
    nombre_comercial: '',
    bd_compaqi: '',
    modulo_cobrofranquicia_compaqi: 0,
    id_usuario: user_id,
    id_usuario_req: 0,
    id_sucursal_req: 0,
    id_almacen_req: 0,
    empresas_franquicias: [],
    empresas_franquicias_remove: []
  })
  const [modelClear] = useState<any>({
    id: 0,
    razon_social: '',
    nombre_comercial: '',
    bd_compaqi: '',
    modulo_cobrofranquicia_compaqi: 0,
    id_usuario: user_id,
    id_usuario_req: 0,
    id_sucursal_req: 0,
    id_almacen_req: 0,
    empresas_franquicias: [],
    empresas_franquicias_remove: []
  })
  const [formEf, setFormEf] = useState({
    id: 0,
    id_empresa: 0,
    id_franquicia: 0,
    businessEntityID: 0,
    razon_social: ''
  })
  const [formEfClear] = useState({
    id: 0,
    id_empresa: 0,
    id_franquicia: 0,
    businessEntityID: 0,
    razon_social: ''
  })
  const selectData = useSelectStore(state => state.selectedIds)
  const [dataEmpresas, setDataEmpresas] = useState<any>({})

  const [modalState, setModalState] = useState<boolean>(false)
  const [modoUpdate, setModoUpdate] = useState<boolean>(false)
  const [selectedCompany,] = useState<number | null>(null);



  // Estados de advertencia para validar campos
  // Warning states to validate fields
  const [warningRazonSocial, setWarningRazonSocial] = useState<boolean>(false)
  const [warningNombreComercial, setWarningNombreComercial] = useState<boolean>(false)

  const { getCompaniesXUsers, companiesXUsers }: any = storeCompanies()
  const { getViews, views }: any = storeViews()


  const [users, setUsers] = useState<any>([])
  const [sucursales, setSucursales] = useState<any>([])
  const [almacenes, setAlmacenes] = useState<any>([])

  const fetch = async () => {
    let data = await getCompaniesXUsers(user_id);
    setDataEmpresas({
      selectName: 'Franquicia',
      dataSelect: data,
      options: 'razon_social'
    })
    getUsers()
    getSucursales()
    getAlmacenes()
    getViews(user_id, 'EMPRESAS')
  }
  const getUsers = async () => {
    let data = {
      nombre: '',
      id_usuario: user_id,
      id_usuario_consulta: user_id,
      light: true,
      id_sucursal: 0
    }
    await APIs.CreateAny(data, "usuario_get").then(async (response: any) => {
      setUsers(response)
    })
  }
  const getSucursales = async () => {
    let result = await APIs.GetAny(`get_sucursal_x_empresa/0/${user_id}`)
    setSucursales(result)
  }
  const getAlmacenes = async () => {
    let result = await APIs.GetAny(`almacen_get/${user_id}`)
    setAlmacenes(result)
  }
  useEffect(() => {
    fetch()
  }, []);

  useEffect(() => {
    console.log(selectData?.franquiciaSelect);
    DynamicVariables.updateAnyVar(setFormEf, "id_franquicia", selectData?.franquiciaSelect.id)
    DynamicVariables.updateAnyVar(setFormEf, "razon_social", selectData?.franquiciaSelect.razon_social)
  }, [selectData?.franquiciaSelect]);
  // Modal del pop
  const modalCreate = (data: any, modoUpdate: boolean) => {
    setModalState(true)
    setModoUpdate(modoUpdate)
    setModel(modelClear)
    setFormEf(formEfClear)
    if (modoUpdate) {
      data.empresas_franquicias_remove = []
      data.id_usuario = user_id
      setModel(data)

    }
  }

  const modalCloseCreate = () => {
    setModalState(false)
    setWarningRazonSocial(false)
    setWarningNombreComercial(false)
  }


  const crear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (model.razon_social === '') {
      setWarningRazonSocial(true)
    } else {
      setWarningRazonSocial(false)
    }
    if (model.nombre_comercial === '') {
      setWarningNombreComercial(true)
    } else {
      setWarningNombreComercial(false)
    }

    if (model.razon_social === '' || model.nombre_comercial === '') {
      return;
    }
    if (modoUpdate) {
      await APIs.CreateAnyPut(model, "empresa_update/" + model.id)
        .then(async (response: any) => {
          Swal.fire('Notificación', response.mensaje, 'success');
          await getCompaniesXUsers(user_id)
          setModalState(false)
        })
        .catch((error: any) => {
          if (error.response) {
            if (error.response.status === 409) {
              Swal.fire(error.mensaje, '', 'warning');
            } else {
              Swal.fire('Error al actualizar la empresa', '', 'error');
            }
          } else {
            Swal.fire('Error de conexión.', '', 'error');
          }
        })
    } else {
      await APIs.CreateAny(model, "empresa_create")
        .then(async (response: any) => {
          Swal.fire('Notificación', response.mensaje, 'success');
          await getCompaniesXUsers(user_id)
          setModalState(false)
        })
        .catch((error: any) => {
          if (error.response) {
            if (error.response.status === 409) {
              Swal.fire(error.mensaje, '', 'warning');
            } else {
              Swal.fire('Error al actualizar la empresa', '', 'error');
            }
          } else {
            Swal.fire('Error de conexión.', '', 'error');
          }
        })

    }
  };

  useEffect(() => {

  }, [selectedCompany]);

  const styleWarningRazonSocial = {
    opacity: warningRazonSocial === true ? '1' : '',
    height: warningRazonSocial === true ? '23px' : ''
  }
  const styleWarningSelectNombreComercial = {

    opacity: warningNombreComercial === true ? '1' : '',
    height: warningNombreComercial === true ? '23px' : ''
  }

  return (
    <div className='companies'>
      <div className='container__companies'>
        {views.find((x: any) => x.titulo === 'crear') ?
          <div className='create__company_btn-container'>
            <div>
              <button className='btn__general-purple' onClick={() => { modalCreate(0, false) }}>Nueva Empresa </button>
            </div>
          </div>
          :
          ''}
        <div className={`overlay__companies ${modalState ? 'active' : ''}`}>
          <div className={`popup__companies ${modalState ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__companies" onClick={modalCloseCreate}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
            </a>
            <p className='title__modals'>Crear nueva Empresa</p>
            <div className='row'>
              <div className='col-6'>
                <label className='label__general'>Razon Social</label>
                <div className='warning__general' style={styleWarningRazonSocial}><small >Este campo es obligatorio</small></div>
                <input className={`inputs__general ${warningRazonSocial ? 'warning' : ''}`} value={model.razon_social} onChange={(e) => DynamicVariables.updateAnyVar(setModel, "razon_social", e.target.value)} type='text' placeholder='Ingresa la direccion' />
              </div>
              <div className='col-6'>
                <label className='label__general'>Nombre Comercial</label>
                <div className='warning__general' style={styleWarningSelectNombreComercial}><small >Este campo es obligatorio</small></div>
                <input className={`inputs__general ${warningNombreComercial ? 'warning' : ''}`} value={model.nombre_comercial} onChange={(e) => DynamicVariables.updateAnyVar(setModel, "nombre_comercial", e.target.value)} type='text' placeholder='Ingresa el nombre' />

              </div>
              <div className='col-6' title='Base de datos a donde se irá la información de factura y cobros'>
                <label className='label__general'>Base de Datos Compaqi Comercial</label>
                <input className={`inputs__general`} value={model.bd_compaqi} onChange={(e) => DynamicVariables.updateAnyVar(setModel, "bd_compaqi", e.target.value)} type='text' />

              </div>
              <div className='col-6' title='Modulo dentro de la base de datos a donde se irán los CFDI de cobro a franquicias'>
                <label className='label__general'>Modulo de cobro a franquicias</label>
                <input className={`inputs__general`} value={model.modulo_cobro_franquicia_compaqi} onChange={(e) => DynamicVariables.updateAnyVar(setModel, "modulo_cobrofranquicia_compaqi", e.target.value)} type='text' />
              </div>
              <div className='col-4' title='Determina la sucursal de las requisiciones automaticas generadas por maxmin y bp'>
                <label className='label__general'>Sucursal Req. Auto</label>
                <select className={`inputs__general`} value={model.id_sucursal_req}
                  onChange={(e) => { DynamicVariables.updateAnyVar(setModel, "id_sucursal_req", e.target.value) }}>
                  {sucursales.map((option: any, i: number) => (
                    <option key={i} value={option.id}>
                      {option.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className='col-4' title='Determina el almacen de las requisiciones automaticas generadas por maxmin y bp'>
                <label className='label__general'>Almacen Req. Auto</label>
                <select className={`inputs__general`} value={model.id_almacen_req}
                  onChange={(e) => { DynamicVariables.updateAnyVar(setModel, "id_almacen_req", e.target.value) }}>
                  {almacenes.map((option: any, i: number) => (
                    <option key={i} value={option.id}>
                      {option.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className='col-4' title='Determina el usuario al que saldrán las requisiciones automaticas generadas por maxmin y bp'>
                <label className='label__general'>Usuario Req. Auto</label>
                <select className={`inputs__general`} value={model.id_usuario_req}
                  onChange={(e) => { DynamicVariables.updateAnyVar(setModel, "id_usuario_req", e.target.value) }}>
                  {users.map((option: any, i: number) => (
                    <option key={i} value={option.id}>
                      {option.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <br />
            <hr />
            <b className='label__general'>AGREGAR FRANQUICIA PARA COBRO</b>
            <hr />
            <br />
            <div className='row'>
              <div className='col-6'>
                <label className='label__general'>Franquicia</label>
                <Select dataSelects={dataEmpresas} instanceId='franquiciaSelect' ></Select>
              </div>
              <div className='col-4' title='Este debe ser el ID de cliente de la base de datos agregada con anterioridad'>
                <label className='label__general'>ID Cliente en Compaqi Comercial</label>
                <input className={`inputs__general`} value={formEf.businessEntityID} onChange={(e) => DynamicVariables.updateAnyVar(setFormEf, "businessEntityID", parseInt(e.target.value))} type='number' />

              </div>
              <div className='col-2'>
                <button className='btn__general-purple mr-3' type='button' onClick={() => DynamicVariables.updateAnyVarSetArrNoRepeat(setModel, "empresas_franquicias", formEf)}>Add+</button>

              </div>
            </div>
            <br />
            <div className='row'>
              <div className='col-12'>
                <div className='table__companies'>
                  <div>
                    <div>
                      <p className='text'>Tus franquicias-clientes <strong className='number__elemnts'>({model.empresas_franquicias.length})</strong></p>
                    </div>
                  </div>
                  <div className='table__head'>
                    <div className='thead'>
                      <div className='th'>
                        <p className=''>Razon Social</p>
                      </div>
                      <div className='th'>
                        <p>ID comercial</p>
                      </div>
                      <div className='th'>
                        <p className=''>OPT</p>
                      </div>
                    </div>
                  </div>
                  {model.empresas_franquicias ? (
                    <div className='table__body'>
                      {model.empresas_franquicias.map((company: any, i: number) => (
                        <div className='tbody__container' key={i}>
                          <div className='tbody'>
                            <div className='td'>
                              <p>{company.razon_social}</p>
                            </div>
                            <div className='td'>
                              <p>{company.businessEntityID}</p>
                            </div>
                            <div className='td'>
                              <button className='btn__delete_users' type="button" onClick={() => {
                                DynamicVariables.removeObjectInArrayByKey(setModel, "empresas_franquicias", i);
                                { modoUpdate && company.id != 0 ? DynamicVariables.updateAnyVarSetArrNoRepeat(setModel, "empresas_franquicias_remove", company.id) : null }
                              }}>Eliminar</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Cargando datos...</p>
                  )}
                </div>
              </div>
            </div>
            <div className='create__company_btn_modal_container'>
              <div>
                <input className='btn__general-purple' type='submit' value="Crear empresa" onClick={crear} />
              </div>
            </div>
          </div>
        </div>
        <div className='table__companies'>
          <div>
            {companiesXUsers ? (
              <div>
                <p className='text'>Tus empresas <strong className='number__elemnts'>{companiesXUsers.length}</strong></p>
              </div>
            ) : (
              <p></p>
            )}
          </div>
          <div className='table__head'>
            <div className='thead'>
              <div className='th'>
                <p className=''>Razon Social</p>
              </div>
              <div className='th'>
                <p>Nombre comercial</p>
              </div>
            </div>
          </div>
          {companiesXUsers ? (
            <div className='table__body'>
              {companiesXUsers.map((company: any) => (
                <div className='tbody__container' key={company.id}>
                  <div className='tbody'>
                    <div className='td'>
                      <p>{company.razon_social}</p>
                    </div>
                    <div className='td'>
                      <p>{company.nombre_comercial}</p>
                    </div>
                    <div className='td'>
                      <button className='general__edit_button' onClick={() => { modalCreate(company, true) }}>Editar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Cargando datos...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Companies
