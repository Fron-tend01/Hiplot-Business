import React, { useState, useEffect } from 'react';
import { storeCompanies } from '../../../../zustand/Companies';
import { storeBranchOffcies } from '../../../../zustand/BranchOffices';
import { storeAreas } from '../../../../zustand/Areas';
import useUserStore from '../../../../zustand/General';
import './styles/Areas.css'

interface BranchOffices {
  id: number;
  nombre: string;
  direccion: string;
  contacto: string;
  empresa_id: number;
  empresa: string;
  sucursal: string
  produccion: boolean
}

const Areas: React.FC = () => {
  const [name, setName] = useState<string>('')
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null)
  const [selectedBranchOffice, setSelectedBranchOffice] = useState<number | null>(null);
  const [area_id, setarea_id] = useState<boolean>(false)

  // Modales
  const [modalState, setModalState] = useState<boolean>(false)
  const [modalStateUpdate, setModalStateUpdate] =  useState<boolean>(false)

  // Selects
  const [selectCompanies, setSelectCompanies] = useState<boolean>(false)
  const [selectBranchOffices, setSelectBranchOffices] = useState<boolean>(false)

  // Estados de advertencia para validar campos
  // Warning states to validate fields
  const [warningName, setWarningName] = useState<boolean>(false)

  const [filteredBranchOffices, setFilteredBranchOffices] = useState<any[]>([]);
  const {getCompaniesXUsers, companiesXUsers}: any = storeCompanies();
  const {getBranchOfficeXCompanies, branchOfficeXCompanies }: any = storeBranchOffcies();
  const {createAreas, areasXBranchOfficesXUsers, getAreasXBranchOfficesXUsers, updateAreas }: any = storeAreas();
  const userState = useUserStore(state => state.user);
  const user_id = userState.id

  useEffect(() => {
    getAreasXBranchOfficesXUsers(0, user_id)
    getBranchOfficeXCompanies(0, user_id)
    getCompaniesXUsers(user_id)
    
  }, [])

  //Modales
  const modalCreate = () => {
    setModalState(true)

  }

  const modalCloseCreate = () => {
    setModalState(false)
    setName('')
    setWarningName(false)
  }

 
   
  const handleCreateAreas = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const nombre = name

    if (name === '') {
      setWarningName(true)
    } else {
      setWarningName(false)
    }

    if(name === '' || selectedBranchOffice === null) {
      return;
    }

    try {
      await createAreas(selectedBranchOffice, nombre, produccion, user_id)
      getAreasXBranchOfficesXUsers(0, user_id)
      setModalState(false)
    } catch (error) {
      console.error(error);
     
    }

  }

  const handleCompaniesChange = async (company: any) => {
    await setSelectedCompany(company)
   
    const firstBranchOffice = branchOfficeXCompanies.find((branchOffice: any) => branchOffice.empresa_id === company);
    if (firstBranchOffice) {
        setSelectedBranchOffice(firstBranchOffice.id);
    } else {
        setSelectedBranchOffice(null);
    }
    setSelectCompanies(false);
   
  }

  useEffect(()  => {
    if (selectedCompany) {
      const idSelectedBranch = branchOfficeXCompanies.filter((branchOffice: any) => branchOffice.empresa_id === selectedCompany);
      setFilteredBranchOffices(idSelectedBranch);
      if (idSelectedBranch.length > 0) {
        setSelectedBranchOffice(idSelectedBranch[0].id); // Acceder al ID del primer elemento del array
      } else {
        setSelectedBranchOffice(null); // Si no se encuentra ninguna sucursal, establecer selectedBranchOffice en null
      }
    } else {
      setFilteredBranchOffices([]);
      setSelectedBranchOffice(null); // Si no se ha seleccionado ninguna empresa, establecer selectedBranchOffice en null
    }

  }, [selectedCompany, branchOfficeXCompanies]);

  const handleBranchOfficesChange = (sucursal: number) => {
    setSelectedBranchOffice(sucursal);
    setSelectBranchOffices(false)
  }


  // Funciones de seleccionar
  // Select functions 

  const openSelectCompanies = () => {
    setSelectCompanies(!selectCompanies)

  }

  const openSelectBranchOffices = () => {
    setSelectBranchOffices(!selectBranchOffices)

  }


  /* ================================================= Modal Update ==========================================================*/

  const [produccion, setProduccion] = useState<boolean>(false);

  const modalUpdate = async (area: any) => {
    setarea_id(area.id)
    setName(area.nombre)
    await setSelectedCompany(area.empresa_id)
    await setSelectedBranchOffice(area.sucursal_id)
    setProduccion(area.produccion)
    setModalStateUpdate(!modalStateUpdate)
    console.log(area.sucursal_id)
  }

  const closeModalUpdate = () => {
    setModalStateUpdate(false)
  }


  const handleProduccionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProduccion(event.target.checked);
  };


  const handleUpdateAreas = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
  
      await updateAreas(area_id, selectedBranchOffice, name, produccion, user_id)
      setModalStateUpdate(false)
      await getAreasXBranchOfficesXUsers(0, user_id)
      
    } catch {

    }
  }

  const styleWarningName = {
    opacity: warningName === true ? '1' : '',
    height: warningName === true ? '23px' : ''
  }



  return (
    <div className='areas'>
      <div className='areas__container'>
        <div>
          <div className='create__areas_btn-container'>
            <button className='btn__general-purple' onClick={modalCreate}>Crear nueva áreas</button>
          </div>
        </div>
        <div className={`overlay__areas ${modalState ? 'active' : ''}`}>
          <div className={`popup__areas ${modalState ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__areas" onClick={modalCloseCreate}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </a>
            <p className='title__modals'>Crear nueva área</p>
            <form className='conatiner__create_areas' onSubmit={handleCreateAreas}>
              <div className='select__container'>
                <label className='label__general'>Empresas</label>
                <div className='select-btn__general'>
                  <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                    <div className='select__container_title'>
                      <p>{selectedCompany ? companiesXUsers.find((s: {id: number}) => s.id === selectedCompany)?.razon_social : 'Selecciona'}</p>
                    </div>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                  </div>
                  <div className={`content ${selectCompanies ? 'active' : ''}`} >
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
              <div className='select__container'>
                <label className='label__general'>Sucursales</label>
                <div className='select-btn__general'>
                  <div className={`select-btn ${selectBranchOffices ? 'active' : ''}`} onClick={openSelectBranchOffices} >
                    <div className='select__container_title'>
                      <p>{selectedBranchOffice ? branchOfficeXCompanies.find((s: {id: number}) => s.id === selectedBranchOffice)?.nombre : 'Selecciona'}</p>
                    </div>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                  </div>
                  <div className={`content ${selectBranchOffices ? 'active' : ''}`} >
                    <ul className={`options ${selectBranchOffices ? 'active' : ''}`} style={{ opacity: selectBranchOffices ? '1' : '0' }}>
                      {filteredBranchOffices.map((sucursal: any) => (
                        <li key={sucursal.id} onClick={() => handleBranchOfficesChange(sucursal.id)}>
                          {sucursal.nombre}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <label className='label__general'>Nombre</label>
                <div className='warning__general' style={styleWarningName}><small >Este campo es obligatorio</small></div>
                <input className={`inputs__general ${warningName ? 'warning' : ''}`} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Ingresa el nombre' />
              </div>
              <div>
                <label className='label__general'>Produccion</label>
                <div className='checkbox__general checkbox__areas'>
                  <label className="switch">
                  <input type="checkbox" checked={produccion} onChange={handleProduccionChange} />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
              <div className='container__araes_btn_modal_container'>
                <button className='btn__general-purple' type='submit'>Crear nueva área</button>
              </div>
            </form>
          </div>
        </div>
        <div className='table__areas'>
          <div>
          {areasXBranchOfficesXUsers ? (
            <div>
              <p className='text'>Tus Areas {areasXBranchOfficesXUsers.length}</p>
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
                <p>Sucursal</p>
              </div>
              <div className='th'>
                <p>Empresa</p>
              </div>
              <div className='th'>
                <p>Produccion</p>
              </div>
            </div>
          </div>
          {areasXBranchOfficesXUsers ? (
          <div className='table__body'>
            {areasXBranchOfficesXUsers.map((area: BranchOffices) => {
              const sucursal = areasXBranchOfficesXUsers.find((sucursal: {id: number}) => sucursal.id === area.id)
              return (
                <div className='tbody__container' key={area.id}>
                    <div className='tbody'>
                      <div className='td'>
                        <p>{sucursal ? sucursal.nombre : 'Nombre no disponible'}</p>
                      </div>
                      <div className='td'>
                        <p>{area.sucursal}</p>
                      </div>
                      <div className='td'>
                        <p>{area.empresa}</p>
                      </div>
                      <div className='td'>
                        <div className='checkboxs'>
                          <label className="checkbox-container">
                            <input type="checkbox" checked={area.produccion} readOnly />
                            <span className="checkmark"></span>
                          </label>
                        </div>
                      </div>
                      <div className='td'>
                        <button className='general__edit_button' onClick={() => modalUpdate(area)}>Editar</button>
                      </div>
                    </div>
                </div>
              )
            } )}
          </div>
        ) : ( 
          <p>Cargando datos...</p> 
        )}
        </div>
        <div className={`overlay__update_areas ${modalStateUpdate ? 'active' : ''}`}>
            <div className={`popup__update_areas ${modalStateUpdate ? 'active' : ''}`}>
              <a href="#" className="btn-cerrar-popup__update_areas" onClick={closeModalUpdate}>
                <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
              </a>
              <p className='title__modals'>Editar área</p>
              <form className='conatiner__create_areas' onSubmit={handleUpdateAreas}>
                <div className='select__container'>
                  <label className='label__general'>Empresas</label>
                  <div className='select-btn__general'>
                    <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                      <div className='select__container_title'>
                        <p>{selectedCompany ? companiesXUsers.find((s: {id: number}) => s.id === selectedCompany)?.razon_social : 'Selecciona'}</p>
                      </div>
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
                <div className='select__container'>
                  <label className='label__general'>Sucursales</label>
                  <div className='select-btn__general'>
                    <div className={`select-btn ${selectBranchOffices ? 'active' : ''}`} onClick={openSelectBranchOffices} >
                      <div className='select__container_title'>
                        <p>{selectedBranchOffice ? branchOfficeXCompanies.find((s: {id: number}) => s.id === selectedBranchOffice)?.nombre : 'Selecciona'}</p>
                      </div>
                      <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                    </div>
                    <div className={`content ${selectBranchOffices ? 'active' : ''}`} >
                    <ul className={`options ${selectBranchOffices ? 'active' : ''}`} style={{ opacity: selectBranchOffices ? '1' : '0' }}>
                      {filteredBranchOffices.map((sucursal: any) => (
                        <li key={sucursal.id} onClick={() => handleBranchOfficesChange(sucursal.id)}>
                          {sucursal.nombre}
                        </li>
                      ))}
                    </ul>
                  </div>
                  </div>
                </div>
                <div>
                  <label className='label__general'>Nombre</label>
                  <input className='inputs__general' type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Ingresa el nombre' />
                </div>
                <div>
                  <label className='label__general'>Produccion</label>
                  <div className='checkbox__general checkbox__areas'>
                    <label className="switch">
                      <input type="checkbox" checked={produccion} onChange={handleProduccionChange} />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
                <div className='container__araes_btn_modal_container'>
                  <div>
                    <input className='btn__general-purple' type='submit' value="Editar área" />
                  </div>
                  
                </div>
              </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Areas;
