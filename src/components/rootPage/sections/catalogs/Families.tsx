import React, { useEffect, useState } from 'react';
import { storeCompanies } from '../../../../zustand/Companies';
import { storeBranchOffcies } from '../../../../zustand/BranchOffices';
import useUserStore from '../../../../zustand/General';
import { storeFamilies } from '../../../../zustand/Families';
import './styles/Families.css'

interface BranchOffices {
  id: number;
  nombre: string;
  direccion: string;
  contacto: string;
  empresa_id: number;
}

const Families: React.FC = () => {
  const [name, setName] = useState<string>('')

  const [selectedCompany, setselectedCompany] = useState<number | null>(null)
  const [selectedBranchOffice, setselectedBranchOffice] = useState<number | null>(null)
  const [selectedSection, setselectedSection] = useState<string>('')

  const [modalState, setModalState] = useState<boolean>(false)
  const [modalUpdate, setModalUpdate] = useState<boolean>(false)

  const [warningSelectCompany] = useState<boolean>(false)
  const [warningNombre] = useState<boolean>(false)

  const [selectCompanies, setSelectCompanies] = useState<boolean>(false)
  const [selectBranchOffices, setSelectBranchOffices] = useState<boolean>(false)
  const [selectSections, setSelectSections] = useState<boolean>(false)

  const {getCompaniesXUsers, companiesXUsers}: any = storeCompanies();
  const {getBranchOfficeXCompanies, branchOfficeXCompanies }: any = storeBranchOffcies();
  const {createFamilies, families, getFamilies, getSections, sections}: any = storeFamilies()
  const userState = useUserStore(state => state.user);
  let user_id = userState.id

  const [arr1_nuevas, setArr1_nuevas] = useState<any[]>([])

  useEffect(() => {
    getCompaniesXUsers(user_id)
    getBranchOfficeXCompanies(0, user_id)
    getFamilies(user_id)

  }, [])

  const [selectedCompanyIds, setSelectedCompanyIds] = useState<number[]>([]);



  // Funciones para agregar usuarios

  const addCompany = () => {
    if (selectedCompany !== null) {
      if (!selectedCompanyIds.includes(selectedCompany)) {


        let data = {
          id_empresa: selectedCompany,
          id_sucursal: selectedBranchOffice,
          id_seccion: selectedSection,
          visualizacion_web: checked        }
        // Agregar el nuevo usuario al arreglo subordinados_nuevos
        setArr1_nuevas([...arr1_nuevas, data]);
        // Actualizar los IDs de los usuarios seleccionados
        setSelectedCompanyIds([...selectedCompanyIds, selectedCompany]);
      } else {
        console.log('El usuario ya está en la lista.');
      }
    } else {
      console.log('No se ha seleccionado ningún usuario.');
    }
  };

  const deleteUser = (userIdToRemove: number) => {
    // Filtrar el usuario a eliminar del arreglo subordinados_nuevos
    const updatedSubordinadosNuevos = arr1_nuevas.filter((user_id: number) => user_id !== userIdToRemove);
    setArr1_nuevas(updatedSubordinadosNuevos);
    // Filtrar el ID del usuario a eliminar del arreglo de IDs
    const updatedSelectedUserIds = selectedCompanyIds.filter((user_id: number) => user_id !== userIdToRemove);
    setSelectedCompanyIds(updatedSelectedUserIds);
  };
  



  const [checked, setChecked] = useState(false);

  // Función para manejar cambios en el checkbox
  const handleCheckboxChange = (event: any) => {
    setChecked(event.target.checked); // Actualizar el estado con el nuevo valor del checkbox
  };

  const handleCreateFamilies = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    

    let data = { 
      nombre: name
    }

    let data_ext = {
      arr1_nuevas,
      arr1_eliminar: []

      
    }
    
    try {
      await createFamilies(data, data_ext)
      

    } catch {

    }
  }

  const handleEmpresaChange = (company: any) => {
    setselectedCompany(company)
    setSelectCompanies(false)
    selectAutomatic(company)
  }

  const [filteringBranchOffices, setFilteringBranchOffices] = useState<any>([])

  const selectAutomatic = (company: any) => {
    let filter = branchOfficeXCompanies.filter((x: any) => x.empresa_id === company)
    setFilteringBranchOffices(filter)
  }



  const handleBranchOfficesChange = (x: any) => {
    setselectedBranchOffice(x.id)
    setSelectBranchOffices(false)
    console.log(x.id)
    getSections(x.id)
  }

  const handleSectionsChange = (x: any) => {
    setselectedSection(x.id)
    setSelectSections(false)
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

  const openSelectBranchOffices = () => {
    setSelectBranchOffices(!selectBranchOffices)
  }

  const openSelectSections = () => {
    setSelectSections(!selectSections)
  }

  const styleWarningSelectCompanies = {
    transition: 'all 1000ms',
    opacity: warningSelectCompany === true ? '1' : '',
    height: warningSelectCompany === true ? '30px' : ''
  }

  const styleWarningNombre = {
    transition: 'all 1000ms',
    opacity: warningNombre === true ? '1' : '',
    height: warningNombre === true ? '30px' : ''
  }



  const closeModalUpdate = () => {
    setModalUpdate(false)
    
  }


  const [searchTerm] = useState<string>('');



  return (
    <div className='families'>
      <div className='families__container'>
       <div className='create__families_btn-container'>
        <button className='btn__general-purple' onClick={modalCreate}>Nueva Familia</button>
      </div>
      <div className={`overlay__families ${modalState ? 'active' : ''}`}>
        <div className={`popup__families ${modalState ? 'active' : ''}`}>
          <a href="#" className="btn-cerrar-popup__families" onClick={closeModalCreate}>
            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
          </a>
          
          <p className='title__modals'>Crear Nueva Familia</p>
          <form className='conatiner__create_families' onSubmit={handleCreateFamilies}>
            <div>
              <label className='label__general'>Nombre</label>
              <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div>
              <input className={`inputs__general ${warningNombre ? 'warning' : ''}`} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Ingresa el nombre' />
            </div>
            <div className='add__companyin_familiess'>
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
                        {companiesXUsers && companiesXUsers.map((company_id: any) => (
                            <li key={company_id.id} onClick={() => handleEmpresaChange(company_id.id)}>
                              {company_id.razon_social}
                            </li>
                          ))
                        }
                      </ul>
                  </div>
                </div>
              </div>
              <div className='select__container'>
                <label className='label__general'>Sucursales</label>
                <div className='warning__general' style={styleWarningSelectCompanies}><small >Este campo es obligatorio</small></div>
                <div className={`select-btn__general ${warningSelectCompany ? 'warning' : ''}`}>
                  <div className={`select-btn ${selectBranchOffices ? 'active' : ''}`} onClick={openSelectBranchOffices}>
                    <p>{selectedBranchOffice ? filteringBranchOffices.find((s: {id: number}) => s.id === selectedBranchOffice)?.nombre : 'Selecciona'}</p>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                  </div>
                  <div className={`content ${selectBranchOffices ? 'active' : ''}`}>
                    <ul className={`options ${selectBranchOffices ? 'active' : ''}`} style={{ opacity: selectBranchOffices ? '1' : '0' }}>
                        {filteringBranchOffices && filteringBranchOffices.map((x: any) => (
                            <li key={x.id} onClick={() => handleBranchOfficesChange(x)}>
                              {x.nombre}
                            </li>
                          ))
                        }
                      </ul>
                  </div>
                </div>
              </div>
              <div className='check_view'>
                <label>Visualizacion</label>
                <label className="switch">
                <input
                    type="checkbox"
                    checked={checked} // Asignar el valor del estado al atributo 'checked'
                    onChange={handleCheckboxChange} // Manejar cambios en el checkbox
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className='select__container'>
                <label className='label__general'>Seccion</label>
                <div className='warning__general' style={styleWarningSelectCompanies}><small >Este campo es obligatorio</small></div>
                <div className={`select-btn__general ${warningSelectCompany ? 'warning' : ''}`}>
                  <div className={`select-btn ${selectSections ? 'active' : ''}`} onClick={openSelectSections}>
                    <p>{selectedSection ? sections.find((s: {id: any}) => s.id === selectedSection)?.seccion : 'Selecciona'}</p>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                  </div>
                  <div className={`content ${selectSections ? 'active' : ''}`}>
                    <ul className={`options ${selectSections ? 'active' : ''}`} style={{ opacity: selectSections ? '1' : '0' }}>
                        {sections && sections.map((x: any) => (
                            <li key={x.id} onClick={() => handleSectionsChange(x)}>
                              {x.seccion}
                            </li>
                          ))
                        }
                      </ul>
                  </div>
                </div>
              </div>
              <div className='container__add_companyin_families'>
                <button className='btn__general-purple' onClick={addCompany} type='button'>Agregar</button>
              </div>
            </div>
            <div className='table__update_families' >
              <div>
                <div>
                  {selectedCompanyIds ? (
                    <div>
                      <p className='text'>Tus empresas {selectedCompanyIds.length}</p>
                    </div>
                  ) : (
                    <p className='text'>No hay empresas</p>
                  )}
                </div>
                <div className='table__head'>
                  <div className='thead'>
                    <div className='th'>
                      <p className=''>Empresa</p>
                    </div>
                    
                  </div>
                </div>
                {selectedCompanyIds.length > 0 ? (
                  <div className='table__body'>
                     {selectedCompanyIds.map(user_id => (
                        <div className='tbody__container' key={user_id}>
                          <div className='tbody'>
                            <div className='td'>
                              {companiesXUsers.find((user: any) => user.id === user_id)?.razon_social}
                            </div>
                            <div className='td'>
                              <button className='btn__delete_users' onClick={() => deleteUser(user_id)}>Eliminar</button>
                            </div>
                          </div>
                        </div>
                     ))}
                  </div>
                ) : (
                  <p className='text'>No hay empresas que cargar</p>
                )}
              </div>
            </div>
            <div className='container__btns_branch-office'>
              <button className='btn__general-purple' type='submit'>Crear nueva familia</button>
            </div>
          </form>
        </div>
      </div>
      <div className='table__families' >
        <div>
          {families ? (
            <div>
              <p className='text'>Tus empresas {families.length}</p>
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
        {families ? (
          <div className='table__body'>
            {families.map((sucursal: BranchOffices) => {
              // Buscar la empresa correspondiente en companiesData
              const company = companiesXUsers.find((company: { id: number }) => company.id === sucursal.empresa_id);
              return (
                <div className='tbody__container' key={sucursal.id}>
                  <div className='tbody'>
                    <div className='td'>
                      <p>{sucursal.nombre}</p>
                    </div>
                    <div className='td'>
                      <p>{company ? company.razon_social: 'Nombre no disponible'}</p>
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
        <div className={`overlay__update_families ${modalUpdate ? 'active' : ''}`}>
          <div className={`popup__update_families ${modalUpdate ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__update_families" onClick={closeModalUpdate}>
              <svg  className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </a>
            <p className='title__modals'>Actualizar familia</p>
            <form className='conatiner__create_families' onSubmit={handleCreateFamilies}>
              <div>
                <label className='label__general'>Nombre</label>
                <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div>
                <input className={`inputs__general ${warningNombre ? 'warning' : ''}`} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Ingresa el nombre' />
              </div>
              <div className='add__companyin_familiess'>
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
                          {companiesXUsers && companiesXUsers.filter((company_id: any) => company_id.razon_social.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((company_id: any) => (
                              <li key={company_id.id} onClick={() => handleEmpresaChange(company_id.id)}>
                                {company_id.razon_social}
                              </li>
                            ))
                          }
                        </ul>
                    </div>
                  </div>
                </div>
                <div>
                <label className="switch">
                  <input
                    type="checkbox"/>
                  <span className="slider"></span>
                </label>
                </div>
                <div>
                  <label className='label__general'>Id de la seccion</label>
                  <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div>
                  <input className={`inputs__general ${warningNombre ? 'warning' : ''}`} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Ingresa el nombre' />
                </div>
                <div className='container__add_companyin_families'>
                  <button className='btn__general-purple' onClick={addCompany} type='button'>Agregar</button>
                </div>
               
              </div>
              <div className='table__update_families' >
                <div>
                  <div>
                    {selectedCompanyIds ? (
                      <div>
                        <p className='text'>Tus empresas {selectedCompanyIds.length}</p>
                      </div>
                    ) : (
                      <p className='text'>No hay empresas</p>
                    )}
                  </div>
                  <div className='table__head'>
                    <div className='thead'>
                      <div className='th'>
                        <p className=''>Empresa</p>
                      </div>
                      
                    </div>
                  </div>
                  {selectedCompanyIds.length > 0 ? (
                    <div className='table__body'>
                      {selectedCompanyIds.map(user_id => (
                          <div className='tbody__container' key={user_id}>
                            <div className='tbody'>
                              <div className='td'>
                                {companiesXUsers.find((user: any) => user.id === user_id)?.razon_social}
                              </div>
                              <div className='td'>
                                <button className='btn__delete_users' onClick={() => deleteUser(user_id)}>Eliminar</button>
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text'>No hay empresas que cargar</p>
                  )}
                </div>
              </div>
              <div className='container__btns_branch-office'>
                <button className='btn__general-purple' type='submit'>Crear nueva familia</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Families
