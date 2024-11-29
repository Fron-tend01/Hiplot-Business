import React, { useEffect, useState } from 'react';
import { storeCompanies } from '../../../../zustand/Companies';
import { storeUserGroups } from '../../../../zustand/UserGroups';
import useUserStore from '../../../../zustand/General';
import './styles/BranchOffices.css';
import './styles/UserGroups.css'

interface UserGroups {
  id: number;
  nombre: string;
  direccion: string;
  contacto: string;
  empresa_id: number;
}

const UserGroups: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [company_id, setCompany_id] = useState<number | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [modal, setModal] = useState<boolean>(false)

  const [warningSelectCompany] = useState<boolean>(false)
  const [warningName, setWarningName] = useState<boolean>(false)
  const [selectCompanies, setSelectCompanies] = useState<boolean>(false)

  const [userGroup_id, setUserGroup_id] = useState<number | null>(null)
 
  const {createUserGroups, userGroups, getUserGroups,updateUserGroups }: any = storeUserGroups();
  const {getCompaniesXUsers, companiesXUsers}: any = storeCompanies();
    
  const [modalStateUpdate, setModalStateUpdate] =  useState<boolean>(false)
  const userState = useUserStore(state => state.user);
  const user_id = userState.id

  useEffect(() => {
    getCompaniesXUsers(user_id);
    getUserGroups(user_id);
  }, []);



  const handleCreateBranchOffice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const id_usuario = user_id

    if (name === '') {
      setWarningName(true)
    } else {
      setWarningName(false)
    }

    if(name === '') {
      return;
    }

    try {
      await createUserGroups(name, company_id, id_usuario);
      setModal(false)
      await getUserGroups(user_id)
    } catch (error) {
      console.error('Error al crear la sucursal:', error);
    }
  };

  const handleEmpresaChange = (company: number) => {
    setSelectedCompany(company);
    setCompany_id(company);
    setSelectCompanies(!selectCompanies);
  };



  const Modal = () => {
    setModal(true);
 
  };

  const closeModal = () => {
    setModal(false);
    setWarningName(false)
  };

  const ModalUpdate = (userGroup: any) => {
    setModalStateUpdate(!modalStateUpdate)
    setUserGroup_id(userGroup.id)
    setSelectedCompany(userGroup.id_empresa)
    setCompany_id(userGroup.id_empresa)
    console.log(userGroups)
    setName(userGroup.nombre)


  }


  const openSelectCompanies = () => {
    setSelectCompanies(!selectCompanies);
  };


  const styleWarningSelectCompanies = {

  }

  const handledUpdateUserGroups = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  
    try {
      await updateUserGroups(userGroup_id,name, company_id, user_id )
      setModalStateUpdate(false)
      await getUserGroups(user_id);
    } catch {

    }
  }

  const styleWarningSelectName = {
    opacity: warningName === true ? '1' : '',
    height: warningName === true ? '23px' : ''
  }

  return (
    <div className='user-groups'>
      <div className='user-groups__container'>
        <div>
          <div className='create__user-groups_btn-container '>
            <button className='btn__general-purple' onClick={Modal}>Nuevos grupos de usuarios</button>
          </div>
        </div>
        <div className={`overlay__user_groups ${modal ? 'active' : ''}`}>
          <div className={`popup__user_groups ${modal ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__user_groups" onClick={closeModal}>
              <svg className='svg__close'  xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </a>
            <p className='title__modals'>Crear nuevo grupo de usuario</p>
            <form className='conatiner__create_user-groups' onSubmit={handleCreateBranchOffice}>
            <div className='select__container'>
                <label className='label__general'>Empresas</label>
                <div className='warning__general' style={styleWarningSelectCompanies}><small >Este campo es obligatorio</small></div>
                <div className={`select-btn__general ${warningSelectCompany ? 'warning' : ''}`}>
                  <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                    <p>{selectedCompany ? companiesXUsers.find((s: {id: number}) => s.id === selectedCompany)?.razon_social : 'Selecciona'}</p>
                      <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                  </div>
                  {/* <div className={`content ${selectCompanies ? 'active' : ''}`}  style={{ maxHeight: selectCompanies ? '280px' : '0' }}></div> */}
                  <div className={`content ${selectCompanies ? 'active' : ''}`} >
                    <ul className={`options ${selectCompanies ? 'active' : ''}`} style={{ opacity: selectCompanies ? '1' : '0' }}>
                      {companiesXUsers && companiesXUsers.map((company: any) => (
                        <li key={company.id} onClick={() => handleEmpresaChange(company.id)}>
                          {company.razon_social}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <label className='label__general'>Nombre</label>
                <div className='warning__general' style={styleWarningSelectName}><small >Este campo es obligatorio</small></div>
                <input className='inputs__general' type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Ingresa el nombre' />
              </div>
              <div className='container__btns_user-groups'>
                <button className='btn__general-purple' type='submit'>Crear grupo de usuario</button>
              </div>
            </form>
          </div>
        </div>
      
        <div className='table__user_groups' >
          <div>
            {userGroups ? (
              <div>
                <p className='text'>Tus empresas {userGroups.length}</p>
              </div>
            ) : (
              <p>No hay empresas</p>
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
          {userGroups ? (
            <div className='table__body'>
              {userGroups.map((userGroup: any) => {
                // Buscar la empresa correspondiente en companiesData
                const company = companiesXUsers.find((company: any) => company.id === userGroup.id_empresa);
                return (
                  <div className='tbody__container' key={userGroup.id}>
                    <div className='tbody'>
                      <div className='td'>
                      <p>{userGroup.nombre}</p>
                      </div>
                      <div className='td'>
                        <p>{company ? company.razon_social: 'Nombre no disponible'}</p>
                      </div>                   
                      <div className='td'>
                        <button className='general__edit_button' onClick={() => ModalUpdate(userGroup)} >Editar</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>Cargando datos...</p>
          )}
          <div className={`overlay__update_user-groups ${modalStateUpdate ? 'active' : ''}`}>
            <div className={`popup__update_user-groups ${modalStateUpdate ? 'active' : ''}`}>
              <a href="#" className="btn-cerrar-popup__update_user-groups" onClick={ModalUpdate}>
                <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
              </a>
              <p className='title__modals'>Actualizar grupo de usuario</p>
              <form className='conatiner__create_user-groups' onSubmit={handledUpdateUserGroups}>
              <div className='select__container'>
                  <label className='label__general'>Empresas</label>
                  <div className='warning__general' style={styleWarningSelectCompanies}><small >Este campo es obligatorio</small></div>
                  <div className={`select-btn__general ${warningSelectCompany ? 'warning' : ''}`}>
                    <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                      <p>{selectedCompany ? companiesXUsers.find((s: {id: number}) => s.id === selectedCompany)?.razon_social : 'Selecciona'}</p>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                    </div>
                    {/* <div className={`content ${selectCompanies ? 'active' : ''}`}  style={{ maxHeight: selectCompanies ? '280px' : '0' }}></div> */}
                    <div className={`content ${selectCompanies ? 'active' : ''}`} >
                      <ul className={`options ${selectCompanies ? 'active' : ''}`} style={{ opacity: selectCompanies ? '1' : '0' }}>
                        {companiesXUsers && companiesXUsers.map((company: any) => (
                          <li key={company.id} onClick={() => handleEmpresaChange(company.id)}>
                            {company.razon_social}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                  <label className='label__general'>Nombre</label>
                  <input className={`inputs__general ${warningName ? 'warning' : ''}`} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Ingresa el nombre' />
                </div>
                <div className='container__btns_user-groups'>
                  <button className='btn__general-purple' type='submit'>Editar grupo de usuario</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGroups;


