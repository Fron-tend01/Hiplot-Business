import React, { useEffect, useState } from 'react';
import './styles/Families.css'
import { storeCompanies } from '../../../../zustand/Companies';
import { storeBranchOffcies } from '../../../../zustand/BranchOffices';
import useUserStore from '../../../../zustand/General';
interface BranchOffices {
  id: number;
  nombre: string;
  direccion: string;
  contacto: string;
  empresa_id: number;
}

const Deliverytimes: React.FC = () => {
  const [modalState, setModalState] = useState<boolean>()
  const [modalUpdate, setModalUpdate] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [address, setAddress] = useState<string>('')

  const [selectedCompany, setselectedCompany] = useState<number | null>(null)

  const [warningSelectCompany] = useState<boolean>(false)
  const [warningNombre] = useState<boolean>(false)
  const [warningAddress] = useState<boolean>(false)

  const [selectCompanies, setSelectCompanies] = useState<boolean>(false)



  const { companiesXUsers, getCompaniesXUsers}: any = storeCompanies()
  const { branchOfficeXCompanies, getBranchOfficeXCompanies }: any = storeBranchOffcies()
  const userState = useUserStore(state => state.user);
  const user_id = userState.id

  useEffect(() => {
    getCompaniesXUsers(user_id)
    getBranchOfficeXCompanies(0, user_id)
  }, [])


  const handleCreateFamilies = () => {

  }

  const handleEmpresaChange = (company: any) => {
    setselectedCompany(company.id)
  }

  const modalCreate = () => {
    setModalState(!modalState)
  }

  const closeModalCreate = () => {
    setModalState(false)
  }

  const openSelectCompanies = () => {
    setSelectCompanies(!selectCompanies)
  }

  const styleWarningSelectCompanies = {

  }

  const styleWarningNombre = {

  }

  const styleWarningAddress = {

  }



 
  const closeModalUpdate = () => {
    setModalUpdate(false)
    
  }

  const handleUpdateBranchOffices = () => {

  }

  return (
    <div className='families'>
       <div className='create__bracnhoffice_btn-container'>
        <button className='btn__general-purple' onClick={modalCreate}>Nueva Sucursal</button>
      </div>
      <div className={`overlay__branch-offices ${modalState ? 'active' : ''}`}>
        <div className={`popup__branch-offices ${modalState ? 'active' : ''}`}>
          <a href="#" className="btn-cerrar-popup__branch-offices" onClick={closeModalCreate}>
            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
          </a>
          <h3>Crear Nueva Familia</h3>
          <form className='conatiner__create_branch-offices' onSubmit={handleCreateFamilies}>
            <div className='select__container'>
              <label className='label__general'>Empresas</label>
              <div className='warning__general' style={styleWarningSelectCompanies}><small >Este campo es obligatorio</small></div>
              <div className={`select-btn__general ${warningSelectCompany ? 'warning' : ''}`}>
                <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                  <p>{selectedCompany ? companiesXUsers.find((s: {id: number}) => s.id === selectedCompany)?.razon_social : 'Selecciona'}</p>
                  <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
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
            <div>
              <label className='label__general'>Nombre</label>
              <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div>
              <input className={`inputs__general ${warningNombre ? 'warning' : ''}`} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Ingresa el nombre' />
            </div>
            <div>
              <label className='label__general'>Dirección</label>
              <div className='warning__general' style={styleWarningAddress}><small >Este campo es obligatorio</small></div>
              <input className={`inputs__general ${warningAddress ? 'warning' : ''}`} type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder='Ingresa la dirección' />
            </div>
            {/* <div>
              <label className='label__general'>Contacto</label>
              <div className='warning__general' style={styleWarningContact}><small >Este campo es obligatorio</small></div>
              <input className={`inputs__general ${warningContact ? 'warning' : ''}`} type="number" value={contact} onChange={(e) => setContact(e.target.value)} placeholder='Ingresa el contacto' />
            </div> */}
            <div className='container__btns_branch-office'>
              <button className='btn__general-purple' type='submit'>Crear sucursal</button>
            </div>
          </form>
        </div>
      </div>
      <div className='table__branch-offices' >
        <div>
          {branchOfficeXCompanies ? (
            <div>
              <p>Tus empresas {branchOfficeXCompanies.length}</p>
            </div>
          ) : (
            <p>No hay empresas</p>
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
            {branchOfficeXCompanies.map((sucursal: BranchOffices) => {
              // Buscar la empresa correspondiente en companiesData
              const company = companiesXUsers.find((company: { id: number }) => company.id === sucursal.empresa_id);
              return (
                <div className='tbody__container' key={sucursal.id}>
                  <div className='tbody'>
                    <div className='td'>
                      <p>{company ? company.razon_social: 'Nombre no disponible'}</p>
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
                      <button className='branchoffice__edit_btn'>Editar</button>
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
      <div className={`overlay__update_branch-offices ${modalUpdate ? 'active' : ''}`}>
          <div className={`popup__update_branch-offices ${modalUpdate ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__update_branch-offices" onClick={closeModalUpdate}>
              <svg xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </a>
            {/* <h3>Crear Nueva Empresa</h3> */}
            <form className='conatiner__create_branch-offices' onSubmit={handleUpdateBranchOffices}>
            <div className='select__container'>
              <label className='label__general'>Empresas</label>
              <div className='warning__general' style={styleWarningSelectCompanies}><small >Este campo es obligatorio</small></div>
              <div className={`select-btn__general ${warningSelectCompany ? 'warning' : ''}`}>
                <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                  <p>{selectedCompany ? companiesXUsers.find((s: {id: number}) => s.id === selectedCompany)?.razon_social : 'Selecciona'}</p>
                  <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                </div>
                <div className={`content ${selectCompanies ? 'active' : ''}`}>
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
              <div className='inputs__company'>
                <label className='label__general'>Nombre</label>
                <input className='inputs__general' value={name} onChange={(e) => setName(e.target.value)} type='text' placeholder='Ingresa el nombre'  />
              </div>
              <div className='inputs__company'>
                <label className='label__general'>Dirección</label>
                <input className='inputs__general'  value={address} onChange={(e) => setAddress(e.target.value)} type='text' placeholder='Ingresa la dirección' />
              </div>
              {/* <div className='inputs__company'>
                <label className='label__general'>Contacto</label>
                <input className='inputs__general' value={contact} onChange={(e) => setContact(e.target.value)} type="text" placeholder='Ingresa el contacto' />
              </div> */}
              <div className='container__btns_branch-office'>
                <div>
                  <input className='btn__general-purple' type='submit' value="Editar sucursal" />
                </div>
              </div>
            </form>
          </div>
      </div>
    </div>
  )
}

export default Deliverytimes
