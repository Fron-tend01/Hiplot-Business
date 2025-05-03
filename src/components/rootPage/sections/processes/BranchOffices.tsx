import React, { useEffect, useState } from 'react';
import { storeBranchOffcies } from '../../../../zustand/BranchOffices';
import { storeCompanies } from '../../../../zustand/Companies';
import './styles/BranchOffices.css';
import useUserStore from '../../../../zustand/General';
import APIs from '../../../../services/services/APIs'
import Swal from 'sweetalert2';
import { useSelectStore } from '../../../../zustand/Select';
import { areasRequests } from '../../../../fuctions/Areas';
import { usersRequests } from '../../../../fuctions/Users';
import Select from '../../Dynamic_Components/Select';



const BranchOffices: React.FC = () => {
  const [nombre, setNombre] = useState<string>('');
  const [direccion, setDireccion] = useState<string>('');
  const [idModuloComercial, setIdModuloComercial] = useState<number>(0);
  const [contacto, setContacto] = useState<string>('');
  const [empresa_id, setEmpresa_id] = useState<number | null>(null);
  const [sucursal_id, setSucursal_id] = useState<number | null>(null)
  const [ventaf, setVentaF] = useState<boolean>(false);
  const [forzarProd, setForzarProd] = useState<boolean>(false);
  const [lunes, setlunes] = useState<boolean>(false);
  const [martes, setmartes] = useState<boolean>(false);
  const [miercoles, setmiercoles] = useState<boolean>(false);
  const [jueves, setjueves] = useState<boolean>(false);
  const [viernes, setviernes] = useState<boolean>(false);
  const [sabado, setsabado] = useState<boolean>(false);
  const [domingo, setdomingo] = useState<boolean>(false);
  const [logo, setLogo] = useState<string>('');
  const [modoUpdate, setModoUpdate] = useState<boolean>(false);
  const [areas, setAreas] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);
  const selectData: any = useSelectStore(state => state.selectedIds)
  const setSelectData: any = useSelectStore(state => state.setSelectedId)


  // Selects
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);

  // Modales
  const [modal, setModal] = useState<boolean>(false)

  // Estados de advertencia para validar campos
  // Warning states to validate fields
  const [warningSelectCompany, setWarningSelectCompany] = useState<boolean>(false)
  const [warningNombre, setWarningNombre] = useState<boolean>(false)
  const [warningAddress, setWarningAddress] = useState<boolean>(false)
  const [warningContact, setWarningContact] = useState<boolean>(false)

  const { branchOfficeXCompanies, getBranchOfficeXCompanies, }: any = storeBranchOffcies();
  const { companiesXUsers, getCompaniesXUsers }: any = storeCompanies();
  const userState = useUserStore(state => state.user);
  const user_id = userState.id

  const { getAreas }: any = areasRequests()
  const { getUsers }: any = usersRequests()

  const fetch = async () => {
    let resultAreas = await getAreas(0, user_id)

    setAreas({
      selectName: 'Areas',
      options: 'nombre',
      dataSelect: resultAreas
    })

    const data = {
      nombre: '',
      id_usuario: user_id,
      id_usuario_consulta: user_id,
      light: true,
      id_sucursal: 0
    }
    let resultUsers = await getUsers(data)
    setUsers({
      selectName: 'Vendedor',
      options: 'nombre',
      dataSelect: resultUsers
    })
  }
  useEffect(() => {
    getCompaniesXUsers(user_id)
    getBranchOfficeXCompanies(0, user_id)

    fetch()


  }, []);

  const handleCreateBranchOffices = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      if (empresa_id === null) {
        setWarningSelectCompany(true)
      } else {
        setWarningSelectCompany(false)
      }

      if (nombre === '') {
        setWarningNombre(true)
      } else {
        setWarningNombre(false)
      }

      if (direccion === '') {
        setWarningAddress(true)
      } else {
        setWarningAddress(false)
      }

      if (contacto === '') {
        setWarningContact(true)
      } else {
        setWarningContact(false)
      }

      if (nombre === '' || empresa_id === null || direccion === '' || contacto === '') {
        return;
      }
      if (selectData.usuarioReq==undefined) {
        Swal.fire('Notificacion', 'Selecciona un usuario para las requisiciones automaticas', 'info')
        return
      }
      if (selectData.areaReq==undefined) {
        Swal.fire('Notificacion', 'Selecciona un area para las requisiciones automaticas', 'info')
        return
      }
      const data = {
        id: sucursal_id,
        nombre: nombre,
        logo: logo,
        contacto: contacto,
        empresa_id: selectedCompany,
        direccion: direccion,
        venta_franquicia: ventaf,
        forzar_produccion: forzarProd,
        lunes: lunes,
        martes: martes,
        miercoles: miercoles,
        jueves: jueves,
        viernes: viernes,
        sabado: sabado,
        domingo: domingo,
        id_modulo_comercial: idModuloComercial,
        id_usuario: user_id,
        id_usuario_req: selectData.usuarioReq==undefined ? 0 : selectData.usuarioReq.id,
        id_area_req: selectData.areaReq==undefined ? 0 :selectData.areaReq.id,
      }
      if (modoUpdate) {
        await APIs.CreateAnyPut(data, "sucursal_update/" + sucursal_id)
          .then(async (response: any) => {
            Swal.fire('Notificación', response.mensaje, 'success');
            await getBranchOfficeXCompanies(0, user_id)
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
      } else {
        await APIs.CreateAny(data, "sucursal_create")
          .then(async (response: any) => {
            Swal.fire('Notificación', response.mensaje, 'success');
            await getBranchOfficeXCompanies(0, user_id)
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


    } catch (error) {
      console.error('Error al crear la sucursal:', error);
    }
  };

  const handleEmpresaChange = (company: any) => {
    setSelectedCompany(company.id);
    setEmpresa_id(company.id);
    setSelectCompanies(!selectCompanies)
  };



  const styleWarningSelectCompanies = {
    opacity: warningSelectCompany === true ? '1' : '',
    height: warningSelectCompany === true ? '23px' : ''
  }

  const styleWarningNombre = {
    opacity: warningNombre === true ? '1' : '',
    height: warningNombre === true ? '23px' : ''
  }

  const styleWarningAddress = {
    opacity: warningAddress === true ? '1' : '',
    height: warningAddress === true ? '23px' : ''
  }

  const styleWarningContact = {
    opacity: warningContact === true ? '1' : '',
    height: warningContact === true ? '23px' : ''
  }


  const Modal = (sucursal: any, mu: boolean) => {
    setModal(!modal);
    setWarningSelectCompany(false)
    setWarningNombre(false)
    setWarningAddress(false)
    setWarningContact(false)
    setSucursal_id(0)
    setIdModuloComercial(0)
    setNombre('')
    setDireccion('')
    setContacto('')
    setVentaF(false)
    setForzarProd(false)
    setlunes(false)
    setmartes(false)
    setmiercoles(false)
    setjueves(false)
    setviernes(false)
    setsabado(false)
    setdomingo(false)
    setLogo('')
    setSelectData('usuarioReq', users[0])
    setSelectData('areaReq', areas[0])
    if (mu) {
      setWarningSelectCompany(false)
      setWarningNombre(false)
      setWarningAddress(false)
      setWarningContact(false)
      setNombre(sucursal.nombre)
      setSucursal_id(sucursal.id)
      setDireccion(sucursal.direccion)
      setContacto(sucursal.contacto)
      setLogo(sucursal.logo)
      setVentaF(sucursal.venta_franquicia)
      setForzarProd(sucursal.forzar_produccion)
      setlunes(sucursal.lunes)
      setmartes(sucursal.martes)
      setmiercoles(sucursal.miercoles)
      setjueves(sucursal.jueves)
      setviernes(sucursal.viernes)
      setsabado(sucursal.sabado)
      setdomingo(sucursal.domingo)
      setEmpresa_id(sucursal.empresa_id)
      setSelectedCompany(sucursal.empresa_id)
      setIdModuloComercial(sucursal.id_modulo_comercial)
      setSelectData('usuarioReq', sucursal.id_usuario_req)
      setSelectData('areaReq', sucursal.id_area_req)
      setModoUpdate(true)
    } else {
      setModoUpdate(false)
    }

  };

  const closeModal = () => {
    setModal(!modal);
  };

  const [selectCompanies, setSelectCompanies] = useState<boolean>(false);

  const openSelectCompanies = () => {
    setSelectCompanies(!selectCompanies)
  }
  const changeImg = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const image = reader.result as string; // Asegurar que image sea de tipo string
        setLogo(image)
        console.log('Imagen convertida a Base64:', image);
      };
      reader.onerror = (error) => {
        console.error('Error al leer el archivo:', error);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className='branchOffices'>
      <div className='branchOffices__container'>
        <div className='create__bracnh-office_btn-container'>
          <div>
            <button className='btn__general-purple' onClick={() => Modal(null, false)}>Nueva Sucursal</button>
          </div>
        </div>
        <div className={`overlay__branch-offices ${modal ? 'active' : ''}`}>
          <div className={`popup__branch-offices ${modal ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__branch-offices" onClick={closeModal}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
            </a>
            {modoUpdate ?
              <p className='title__modals'>Actualizar Sucursal</p>
              :
              <p className='title__modals'>Crear nueva Sucursal</p>
            }
            <div className='row text-center'>
              <div className='col-4'></div>
              <div className='col-4'>
                <label className='label__general'>Logo</label>

                <div className="container__change_img2" style={{ backgroundImage: `url(${logo})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <label className="custom-file-upload2">
                    <small> Seleccionar archivo</small>
                    <input id="custom-file-upload2" type="file" onChange={changeImg} />
                  </label>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-4 md-col-6 sm-col-12'>
                <div className='inputs__branch-office'>
                  <label className='label__general'>Nombre</label>
                  <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div>
                  <input title="Este es un campo de entrada de ejemplo" className={`inputs__general ${warningNombre ? 'warning' : ''}`} type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder='Ingresa el nombre' />
                </div>
              </div>
              <div className='col-4 md-col-6 sm-col-12' >
                <div className='inputs__branch-office'>
                  <label className='label__general'>Contacto</label>
                  <div className='warning__general' style={styleWarningContact}><small >Este campo es obligatorio</small></div>
                  <input className={`inputs__general ${warningContact ? 'warning' : ''}`} type="text" value={contacto} onChange={(e) => setContacto(e.target.value)} placeholder='Ingresa el contacto' />
                </div>
              </div>
              <div className='col-4 md-col-6 sm-col-12'>
                <div className='select__container'>
                  <label className='label__general'>Empresas</label>
                  <div className='warning__general' style={styleWarningSelectCompanies}><small >Este campo es obligatorio</small></div>
                  <div className={`select-btn__general ${warningSelectCompany ? 'warning' : ''}`}>
                    <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                      <div className='select__container_title'>
                        <p>{selectedCompany ? companiesXUsers.find((s: { id: number }) => s.id === selectedCompany)?.razon_social : 'Selecciona'}</p>
                      </div>
                      <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                    </div>
                    <div className={`content ${selectCompanies ? 'active' : ''}`}>
                      <ul className={`options ${selectCompanies ? 'active' : ''}`} style={{ opacity: selectCompanies ? '1' : '0' }}>
                        {companiesXUsers && companiesXUsers.map((company: any) => (
                          <li key={company.id} onClick={() => handleEmpresaChange(company)}>
                            {company.razon_social}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-6 md-col-8 sm-col-12'>
                <div className='inputs__branch-office'>
                  <label className='label__general'>Dirección</label>
                  <div className='warning__general' style={styleWarningAddress}><small >Este campo es obligatorio</small></div>
                  <input className={`inputs__general ${warningAddress ? 'warning' : ''}`} type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder='Ingresa la dirección' />
                </div>
              </div>
              <div className='col-2 md-col-2 sm-col-12' title='Este ID hace referencia al modulo donde se van a enviar las facturas al comercial'>
                <div className='inputs__branch-office'>
                  <label className='label__general'>ID Modulo Comercial</label>
                  <input className={'inputs__general'} type="text" value={idModuloComercial} onChange={(e) => setIdModuloComercial(parseInt(e.target.value))} placeholder='Ingresa el id al modulo comercial' />
                </div>
              </div>
              <div className='col-2 md-col-2 sm-col-12'>
                <label>Venta a Franquicias</label><br></br>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={ventaf} // Asignar el valor del estado al atributo 'checked'
                    onChange={(e) => { setVentaF(e.target.checked); }}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className='col-2 md-col-2 sm-col-12'>
                <label>Forzar Producción</label><br></br>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={forzarProd} // Asignar el valor del estado al atributo 'checked'
                    onChange={(e) => { setForzarProd(e.target.checked); }}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
            <div className='row'>
              <div className='col-6' title='Determina el area de las requisiciones automaticas generadas por maxmin y bp'>
                <Select dataSelects={areas} instanceId='areaReq' nameSelect={'Area Requisición'} />

              </div>
              <div className='col-6' title='Determina el usuario al que saldrán las requisiciones automaticas generadas por maxmin y bp'>
                <Select dataSelects={users} instanceId='usuarioReq' nameSelect={'Usuario Requisición'} />

              </div>
            </div>
            <br />
            <hr />
            <b>DÍAS HABILES</b>
            <hr />
            <br />
            <div className='row'>
              <div className='col-1 md-col-6 sm-col-12'>
                <label>Lunes</label><br></br>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={lunes} // Asignar el valor del estado al atributo 'checked'
                    onChange={(e) => { setlunes(e.target.checked); }}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className='col-2 md-col-6 sm-col-12'>
                <label>Martes</label><br></br>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={martes} // Asignar el valor del estado al atributo 'checked'
                    onChange={(e) => { setmartes(e.target.checked); }}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className='col-2 md-col-6 sm-col-12'>
                <label>Miercoles</label><br></br>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={miercoles} // Asignar el valor del estado al atributo 'checked'
                    onChange={(e) => { setmiercoles(e.target.checked); }}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className='col-2 md-col-6 sm-col-12'>
                <label>Jueves</label><br></br>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={jueves} // Asignar el valor del estado al atributo 'checked'
                    onChange={(e) => { setjueves(e.target.checked); }}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className='col-1 md-col-6 sm-col-12'>
                <label>Viernes</label><br></br>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={viernes} // Asignar el valor del estado al atributo 'checked'
                    onChange={(e) => { setviernes(e.target.checked); }}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className='col-2 md-col-6 sm-col-12'>
                <label>Sabado</label><br></br>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={sabado} // Asignar el valor del estado al atributo 'checked'
                    onChange={(e) => { setsabado(e.target.checked); }}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className='col-2 md-col-6 sm-col-12'>
                <label>Domingo</label><br></br>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={domingo} // Asignar el valor del estado al atributo 'checked'
                    onChange={(e) => { setdomingo(e.target.checked); }}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <br />
            <br />
            <div className='container__branch-office_btn_modal_container'>
              {modoUpdate ?
                <button className='btn__general-purple' onClick={handleCreateBranchOffices}>Actualizar sucursal</button>
                :
                <button className='btn__general-purple' onClick={handleCreateBranchOffices}>Crear sucursal</button>
              }
            </div>
          </div>
        </div>
        <div className='table__branch-offices' >
          <div>
            {branchOfficeXCompanies ? (
              <div>
                <p className='text'>Tus sucursales {branchOfficeXCompanies.length}</p>
              </div>
            ) : (
              <p>No hay sucursales</p>
            )}
          </div>
          <div className='table__head'>
            <div className='thead'>
              <div className='th'>
                <p className=''>Empresa</p>
              </div>
              <div className='th'>
                <p>Sucursal</p>
              </div>
              <div className='th'>
                <p>Dirección</p>
              </div>
              <div className='th'>
                <p>Contacto</p>
              </div>
            </div>
          </div>
          {branchOfficeXCompanies ? (
            <div className='table__body'>
              {branchOfficeXCompanies.map((sucursal: any) => {
                // Buscar la empresa correspondiente en companiesData
                const company = companiesXUsers.find((company: { id: number }) => company.id === sucursal.empresa_id);
                return (
                  <div className='tbody__container' key={sucursal.id}>
                    <div className='tbody'>
                      <div className='td'>
                        <p>{company ? company.razon_social : 'Nombre no disponible'}</p>
                      </div>
                      <div className='td'>
                        <p>{sucursal.nombre}</p>
                      </div>
                      <div className='td'>
                        <p>{sucursal.direccion}</p>
                      </div>
                      <div className='td'>
                        <p>{sucursal.contacto}</p>
                      </div>
                      <div className='td'>
                        <button className='general__edit_button' onClick={() => Modal(sucursal, true)}>Editar</button>
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
  );
};

export default BranchOffices;