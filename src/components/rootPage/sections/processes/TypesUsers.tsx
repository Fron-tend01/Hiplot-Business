import React, { useState, useEffect } from 'react';
import { storeCompanies } from '../../../../zustand/Companies';
import { storeBranchOffcies } from '../../../../zustand/BranchOffices';
import { storeTypesUsers } from '../../../../zustand/TypesUsers';
import useUserStore from '../../../../zustand/General';
import './styles/TypesUsers.css';


const TypesUsers: React.FC = () => {
  
  const [nombre, setNombre] = useState<string>('');
  const [selectCompanies, setSelectCompanies] = useState<boolean>(false)
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [select, setSelect] = useState<boolean>(false);
  const [permisos, setPermisos] = useState< any[]>([]);

  // Hooks de validaciones
  const [warningNombre, setWarningNombre] = useState<boolean>(false)
  
  const [modalCreate, setModalCreate] = useState<boolean>(false)
  const [modalUpdate, setModalUpdate] = useState<boolean>(false)

  const [modalPermissions, setModalPermissions ] = useState<any>(false)

  const {getCompaniesXUsers, companiesXUsers}: any = storeCompanies();
  const {getBranchOfficeXCompanies }: any = storeBranchOffcies();
  const {createTypesUsers, getTypesUsers, typesUsers, updateTypesUsers, usersTypesStructure, getUsersTypesStructure,  }: any = storeTypesUsers();
  const userState = useUserStore(state => state.user);
  let user_id = userState.id

  
  useEffect(() => {
    getBranchOfficeXCompanies(user_id)
    getUsersTypesStructure()
    getCompaniesXUsers(user_id)
    getTypesUsers(user_id)

  }, []);

  const handleCreateTypesUsers = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      if (nombre === '') {
        setWarningNombre(true)
      } else {
        setWarningNombre(false)
      }

    
      if (nombre === '' || selectedCompany === null) {
          return; 
      }

      let id_empresa = selectedCompany
      let id_usuario = user_id

      const data = {
        nombre, 
        id_empresa,
        id_usuario
      }

      
      await createTypesUsers(data, permisos);
      setModalCreate(false)
      await getTypesUsers(user_id)

      setNombre('')


      

    } catch (error) {
      console.error('Error al crear la empresa:', error);
    }
  };
    
  const modalCreateTypesUsers = () => {
    setModalCreate(true)
    setNombre('')

  }

  const closeModalCreateTypeUsers = () => {
    setModalCreate(false)
    setWarningNombre(false)
  }

  const handleCompaniesChange = (company: number) => {
    setSelectedCompany(company);
    setSelect(false);
    setSelectCompanies(false)
  };

  const openSelectCompanies = () => {
    setSelect(!select);
    setSelectCompanies(!selectCompanies)
  };
    
  const openModalPermissions = (item: string) => {
    setModalPermissions((prevState: any) => ({
      ...prevState,
      [item]: !prevState[item]
    }));
  };

  
  const openModalUpdatePermissions = (item: number) => {
    setModalUpdatePermissions((prevState: any) => ({
      ...prevState,
      [item]: !prevState[item]
    }));
  };

   const closeModalUpdatePermissions = () => {
    setModalUpdatePermissions(false)
  };

  const [permisosNuevos, setPermisosNuevos] = useState<number[]>([]);
  const [permisosEliminar, setPermisosEliminar] = useState<number[]>([]);
  
  const handlePermissionChange = (e: React.ChangeEvent<HTMLInputElement>, tipoUsuarioId: number, componenteId: number) => {
    console.log(componenteId)
    console.log(tipoUsuarioId)
    const { checked } = e.target;
    if (checked) {
      // Agregar el ID del componente activo al arreglo de permisos
      if(modalCreate === true) {
        setPermisos(prevPermisos => [...prevPermisos, componenteId]);
        console.log(permisos)
      }
      if(modalUpdate === true) {
        setPermisosNuevos(prevPermisos => [...prevPermisos, componenteId]);
      }
    } else {
      // Si el checkbox se desmarca, eliminar el ID del componente del arreglo de permisos
      if(modalCreate === true) {
        setPermisos(prevPermisos => prevPermisos.filter(id => id !== componenteId));
      }
      if (modalUpdate === true) {
        setPermisosNuevos(prevPermisos => prevPermisos.filter(id => id !== componenteId));
        // Agregar el ID del componente al conjunto de permisos a eliminar
        setPermisosEliminar(prevPermisosEliminar => [...prevPermisosEliminar, componenteId]);
    }
     
      
    }
   
  };

  const [modalUpdatePermissions, setModalUpdatePermissions] = useState<any>(false)
  const [typeUser_id, setTypeUser_id] = useState<number | null>(null)

  const modalUpdateTypesUsers = (item: any) => {
    setModalUpdate(!modalUpdate);
    setNombre(item.nombre);
    setSelectedCompany(item.id_empresa);
    setTypeUser_id(item.id);
    item.permisos.forEach((x: any) => {
      setPermisosNuevos(prevPermisos => [...prevPermisos, x.id_componente]);
  
    });
  };

  

  useEffect(() => {
   
  }, [permisos, permisosNuevos, permisosEliminar]);
  

  const handleUpdateTypesUsers = async (e: React.FormEvent) => {

    e.preventDefault()

    let id_empresa = selectedCompany
    let id_usuario = user_id

    let id = typeUser_id

    let data = {
      nombre,
      id_empresa,
      id_usuario
    }

    let permisos = {
      arr1_nuevas: permisosNuevos,
      arr1_eliminar: permisosEliminar
    }

    console.log('permisosNuevos',permisosNuevos)
    console.log('permisosEliminar', permisosEliminar)
    console.log('permisos',permisos)
    try {
      await updateTypesUsers(id, data, permisos)
      setModalUpdate(false)
      await getTypesUsers(user_id)

    } catch {

    }
  }

  const closeModalUpdateTypesUsers = () => {
    setModalUpdate(false)
    setPermisosNuevos([])
    setPermisosEliminar([])
  }

 console.log(permisos)

  const styleWarningNombre = {
    transition: 'all 1000ms',
    opacity: warningNombre === true ? '1' : '',
    height: warningNombre === true ? '30px' : ''
  };


  

  return (
    <div className='types-users'>
      <div className='types-users__container'>
        <div className='he'>
          <div className='create__types-users_btn-container'>
            <button className='btn__general-purple' onClick={modalCreateTypesUsers}>Nuevo tipo de usuario</button>
          </div>
        </div>
        <div className={`overlay__types-users ${modalCreate ? 'active' : ''}`}>
          <div className={`popup__types-users ${modalCreate ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__types-users" onClick={closeModalCreateTypeUsers}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </a>
            <p className='title__modals'>Crear nuevo tipo de usuario</p>
            <form className='container__create_types-users' onSubmit={handleCreateTypesUsers}>
              <div className='inputs__types-users'>
                <label className='label__general'>Nombre</label>
                <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div>
                <input className={`inputs__general ${warningNombre ? 'warning' : ''}`} value={nombre} onChange={(e) => setNombre(e.target.value)} type='text' placeholder='Ingresa el nombre' />
              </div>
              <div className='select__container'>
                <label className='label__general'>Empresas</label>
                  <div className='select-btn__general'>
                    <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                      <p>{selectedCompany ? companiesXUsers.find((s: {id: number}) => s.id === selectedCompany)?.razon_social : 'Selecciona'}</p>
                      <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                    </div>
                    <div className={`content ${selectCompanies ? 'active' : ''}`}>
                      <ul className={`options ${selectCompanies ? 'active' : ''}`} style={{ opacity: selectCompanies ? '1' : '0' }}>
                      {companiesXUsers && companiesXUsers.map((company: any) => (
                          <li key={company.id} onClick={() => handleCompaniesChange(company.id)}>
                            {company.razon_social}
                          </li>
                        ))}
                      </ul>
                  </div>
                </div>
              </div>
              
              <div className='permissions__create_types-users'>
              <p className='types-users__modals_title'>Permisos</p>
                  <div className='users-types__creater_permissions-content'>
                  {usersTypesStructure.map((item: any) => (
                    <div key={item.id}>
                      <div>
                        <button className='btn' type='button' onClick={() => openModalPermissions(item.id)}>{item.titulo}</button>
                      </div>
                      <div className={`overlay__types-users_permissions ${modalPermissions[item.id] ? 'active' : ''}`}>
                        <div className={`popup__types-users_permissions ${modalPermissions[item.id] ? 'active' : ''}`}>
                          <a href="#" className="btn-cerrar-popup__types-users_permissions" onClick={() => openModalPermissions(item.id)}>
                            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                          </a>
                          <div className='container__modal_permissions_types-users'>
                            <div className='create__types-users_btns-container'>
                              <p className='text'>Permisos de {item.titulo}</p>
                              <div className='user-types__permission_check'>
                                <div>
                                {item.componentes.map((componente: any) => (
                                  <div className='content__permission_check_user-types' key={componente.id}>
                                    <p className='text'>{componente.titulo}</p>
                                    <label className="switch">
                                      <input type="checkbox" checked={componente.permiso} onChange={(e) => handlePermissionChange(e, item.id, componente.id)} />
                                      <span className="slider"></span>
                                    </label>
                                  </div>
                                ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className='create__types-users_btns-container'>
                <div>
                  <input className='btn__general-purple' type='submit' value="Crear tipo de usuario" />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className='table__typesUsers'>
          <div>
            {typesUsers ? (
              <div>
                <p className='text'>Tus tipos de usuarios {typesUsers.length}</p>
              </div>
            ) : (
              <p></p>
            )}
          </div>
          <div className='table__head'>
            <div className='thead'>
              <div className='th'>
                <p className=''>Nombre</p>
              </div>
              <div className='th'>
                <p>Empresa</p>
              </div>
            
            </div>
          </div>
          <div className={`overlay__types-users_update ${modalUpdate ? 'active' : ''}`}>
          <div className={`popup__types-users_update ${modalUpdate ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__types-users_update" onClick={closeModalUpdateTypesUsers}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </a>
            <p className='title__modals'>Crear nuevo tipo de usuario</p>
            <form className='container__create_types-users' onSubmit={handleUpdateTypesUsers}>
              <div className='inputs__types-users'>
                <label className='label__general'>Nombre</label>
                <input className='inputs__general' value={nombre} onChange={(e) => setNombre(e.target.value)} type='text' placeholder='Ingresa el nombre' />
              </div>
              <div className='select__container'>
                <label className='label__general'>Empresas</label>
                  <div className='select-btn__general'>
                    <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                      <p>{selectedCompany ? companiesXUsers.find((s: {id: number}) => s.id === selectedCompany)?.razon_social : 'Selecciona'}</p>
                      <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                    </div>
                    <div className={`content ${selectCompanies ? 'active' : ''}`}>
                      <ul className={`options ${selectCompanies ? 'active' : ''}`} style={{ opacity: selectCompanies ? '1' : '0' }}>
                      {companiesXUsers && companiesXUsers.map((company: any) => (
                          <li key={company.id} onClick={() => handleCompaniesChange(company.id)}>
                            {company.razon_social}
                          </li>
                        ))}
                      </ul>
                  </div>
                </div>
              </div>
              <div className='permissions__create_types-users'>
                <p className='types-users__modals_title'>Permisos</p>
                <div className='users-types__creater_permissions-content'>
                {usersTypesStructure.map((item: any) => (
                <div className='users-types__creater_permissions-content' key={item.id}>
                  <div>
                    <button className='btn' type='button' onClick={() => openModalUpdatePermissions(item.id)}>{item.titulo}</button>
                  </div>
                  <div className={`overlay__types-users_permissions ${modalUpdatePermissions[item.id] ? 'active' : ''}`}>
                    <div className={`popup__types-users_permissions ${modalUpdatePermissions[item.id] ? 'active' : ''}`}>
                      <a href="#" className="btn-cerrar-popup__types-users_permissions" onClick={closeModalUpdatePermissions}>
                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                      </a>
                      <div className='container__modal_permissions_types-users'>
                        <div className='create__types-users_btns-container'>
                          <p className='text'>Permisos de {item.titulo}</p>
                          <div className='user-types__permission_check'>
                            <div>
                            {item.componentes.map((componente: any) => (
                              <div className='content__permission_check_user-types' key={componente.id}>
                                <p className='text'>{componente.titulo}</p>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    checked={permisosNuevos.includes(componente.id)} // Verificar si el ID está presente en permisos
                                    onChange={(e) => handlePermissionChange(e, item.id, componente.id)}
                                  />
                                  <span className="slider"></span>
                                </label>
                              </div>
                            ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
                </div>
              </div>
              <div className='create__types-users_btns-container'>
                <div>
                  <input className='btn__general-purple' type='submit' value="Crear tipo de usuario" />
                </div>
              </div>
            </form>
          </div>
        </div>
          {typesUsers ? (
            <div className='table__body'>
              {typesUsers.map((typeUser: any) => (
                <div className='tbody__container' key={typeUser.id}>
                  <div className='tbody'>
                    <div className='td'>
                      <p>{typeUser.nombre}</p>
                    </div>
                    <div className='td'>
                      <p>{typeUser.empresa}</p>
                    </div>
                
                    <div className='td'>
                      <button className='processes__edit_btn' onClick={() => modalUpdateTypesUsers(typeUser)}>Editar</button>
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

export default TypesUsers
