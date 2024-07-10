import React, { useState, useEffect } from 'react';
import { storeCompanies } from '../../../../zustand/Companies';
import useUserStore from '../../../../zustand/General';
import { storeViews } from '../../../../zustand/views';


import './styles/Companies.css';

const Companies: React.FC = () => {
  // Id del del usuario global

  const [businessName, setbusinessName] = useState<string>('');
  const [tradename, setTradename] = useState<string>('');
  const [modalState, setModalState] = useState<boolean>(false)
  const [modalUpdate, setModalUpdate] = useState<boolean>(false)
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  


  // Estados de advertencia para validar campos
  // Warning states to validate fields
  const [warningRazonSocial, setWarningRazonSocial] = useState<boolean>(false)
  const [warningNombreComercial, setWarningNombreComercial] = useState<boolean>(false)

 const { getCompaniesXUsers, companiesXUsers, createCompanies, updateCompanies }: any = storeCompanies()
 const { getViews, views}: any = storeViews()
 const userState = useUserStore(state => state.user);
 let user_id = userState.id
  useEffect(() => {
    getCompaniesXUsers(user_id);
    getViews(user_id, 'EMPRESAS')
  }, []); 

  // Modal del pop
  const modalCreate = () => {
    setModalState(!modalState)
  }

  const modalCloseCreate= () => {
    setModalState(false)
    setbusinessName('');
    setTradename('');
    setWarningRazonSocial(false)
    setWarningNombreComercial(false)
   
  }


  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (businessName === '') {
        setWarningRazonSocial(true)
      } else {
        setWarningRazonSocial(false)
      }
      if (tradename === '') {
        setWarningNombreComercial(true)
      } else {
        setWarningNombreComercial(false)
      }
    
      if (businessName === '' || tradename === '') {
        return;
      }


      await createCompanies(businessName, tradename, user_id);
      await getCompaniesXUsers(user_id)
      setModalState(false)

    } catch (error) {
      console.error('Error al crear la empresa:', error);
    }
  };

  const handleUpdateCompanies = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCompanies(selectedCompany, businessName, tradename, user_id);
      await getCompaniesXUsers(user_id);
      setModalUpdate(false);
    } catch (error) {
      console.error('Error al editar la empresa', error);
    }
  }

  


  const modalUpdateCompanies = (company: any) => {
    setModalUpdate(!modalUpdate);
    setSelectedCompany(company.id);
    setbusinessName(company.razon_social);
    setTradename(company.nombre_comercial);
    console.log(company.id);
   
  }

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

  const closeModalUpdateCompanies = () => {
    setModalUpdate(false);
    setbusinessName('');
    setTradename('');
  }

  console.log(views)


  return (
    <div className='companies'>
      <div className='container__companies'>
        {views.find((x: any) => x.titulo === 'crear') ?
        <div className='create__company_btn-container'>
          <div>
            <button className='btn__general-purple' onClick={modalCreate}>Nueva Empresa</button>
          </div>
        </div>
        :
        ''}
        <div className={`overlay__companies ${modalState ? 'active' : ''}`}>
          <div className={`popup__companies ${modalState ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__companies" onClick={modalCloseCreate}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </a>
            <p className='title__modals'>Crear nueva Empresa</p>
            <form className='container__create_companies' onSubmit={handleCreateCompany}>
              <div className='inputs__company'>
                <label className='label__general'>Razon Social</label>
                <div className='warning__general' style={styleWarningRazonSocial}><small >Este campo es obligatorio</small></div>
                <input className={`inputs__general ${warningRazonSocial ? 'warning' : ''}`} value={businessName} onChange={(e) => setbusinessName(e.target.value)} type='text' placeholder='Ingresa la direccion' />
              </div>
              <div className='inputs__company'>
                <label className='label__general'>Nombre Comercial</label>
                <div className='warning__general' style={styleWarningSelectNombreComercial}><small >Este campo es obligatorio</small></div>
                <input className={`inputs__general ${warningNombreComercial ? 'warning' : ''}`} value={tradename} onChange={(e) => setTradename(e.target.value)} type='text' placeholder='Ingresa el nombre' />
              </div>
              <div className='create__company_btn_modal_container'>
                <div>
                  <input className='btn__general-purple' type='submit' value="Crear empresa" />
                </div>
              </div>
            </form>
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
                      <button className='general__edit_button' onClick={() => modalUpdateCompanies(company)}>Editar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Cargando datos...</p>
          )}
        </div>
        <div className={`overlay__update_companies ${modalUpdate ? 'active' : ''}`}>
          <div className={`popup__update_companies ${modalUpdate ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__update_companies" onClick={closeModalUpdateCompanies}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </a>
            <p className='title__modals'>Editar Empresa</p>
            <form className='container__create_companies' onSubmit={handleUpdateCompanies}>
              <div className='inputs__company'>
                <label className='label__general'>Razon Social</label>
                <input className='inputs__general' value={businessName} onChange={(e) => setbusinessName(e.target.value)} type='text' placeholder='Ingresa la direccion' />
              </div>
              <div className='inputs__company'>
                <label className='label__general'>Nombre Comercial</label>
                <input className='inputs__general'  value={tradename} onChange={(e) => setTradename(e.target.value)} type='text' placeholder='Ingresa el nombre' />
              </div>
              <div className='create__company_btn_modal_container'>
                  <input className='btn__general-purple' type='submit' value="Editar empresa" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Companies
