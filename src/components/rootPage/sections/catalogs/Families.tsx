import React, { useEffect, useState } from 'react';
import { storeCompanies } from '../../../../zustand/Companies';
import { storeBranchOffcies } from '../../../../zustand/BranchOffices';
import useUserStore from '../../../../zustand/General';
import { storeFamilies } from '../../../../zustand/Families';
import './styles/Families.css'
import DynamicVariables from '../../../../utils/DynamicVariables';
import APIs from '../../../../services/services/APIs'
import Swal from 'sweetalert2';


const Families: React.FC = () => {
  const [name, setName] = useState<string>('')
  const [id, setId] = useState<number>(0)

  const [selectedCompany, setselectedCompany] = useState<number | null>(null)
  const [selectedBranchOffice, setselectedBranchOffice] = useState<number | null>(null)

  const [modalState, setModalState] = useState<boolean>(false)
  const [modoUpdate, setModoUpdate] = useState<boolean>(false)

  const [warningSelectCompany] = useState<boolean>(false)
  const [warningNombre] = useState<boolean>(false)

  const [selectCompanies, setSelectCompanies] = useState<boolean>(false)
  const [selectBranchOffices, setSelectBranchOffices] = useState<boolean>(false)

  const { getCompaniesXUsers, companiesXUsers }: any = storeCompanies();
  const { getBranchOfficeXCompanies, branchOfficeXCompanies }: any = storeBranchOffcies();
  const { createFamilies, families, getFamilies, getSections }: any = storeFamilies()
  const userState = useUserStore(state => state.user);
  let user_id = userState.id

  const [arr1_nuevas, setArr1_nuevas] = useState<any[]>([])
  const [arr1_eliminar, setArr1_eliminar] = useState<number[]>([])

  useEffect(() => {
    getCompaniesXUsers(user_id)
    getBranchOfficeXCompanies(0, user_id)
    getFamilies(user_id)

  }, [])




  // Funciones para agregar usuarios

  const addCompany = () => {
    let sucursal = branchOfficeXCompanies.filter((x: any) => x.id == selectedBranchOffice)
    let empresa = companiesXUsers.filter((x: any) => x.id == selectedCompany)
    let data = {
      id_empresa: selectedCompany,
      id_sucursal: selectedBranchOffice,
      sucursal: sucursal[0].nombre,
      empresa: empresa[0].razon_social,
    }
    DynamicVariables.addObjectInArrayNoRepeat(data, setArr1_nuevas)
  };

 


  const handleCreateFamilies = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    let data = {
      data: {
        id: id,
        nombre: name,
      },
      data_ext: {
        arr1_nuevas,
        arr1_eliminar
      }
    }
    if (!modoUpdate) {
      await createFamilies(data.data, data.data_ext)
      getFamilies(user_id)
      closeModalCreate()
      setArr1_nuevas([])
      setName('')
      setId(0)
    } else {
      await APIs.CreateAnyPut(data, "familia_update/" + data.data.id)
        .then(async (response: any) => {
          Swal.fire('Notificación', response.mensaje, 'success');
          closeModalCreate()
          getFamilies(user_id)
        })
        .catch((error: any) => {
          if (error.response) {
            if (error.response.status === 409) {
              Swal.fire(error.mensaje, '', 'warning');
            } else {
              Swal.fire('Error al actualizar la urgencia', '', 'error');
            }
          } else {
            Swal.fire('Error de conexión.', '', 'error');
          }
        })
    }

  }

  const [branchOffices, setBranchOffices] = useState<any>([])

  const handleEmpresaChange = async (company: any) => {
    setselectedCompany(company)
    setSelectCompanies(false)
    let result = await getBranchOfficeXCompanies(company, user_id)
    setselectedBranchOffice(result[0].id)
    setBranchOffices(result)
  }




  const handleBranchOfficesChange = (x: any) => {
    setselectedBranchOffice(x.id)
    setSelectBranchOffices(false)
    console.log(x.id)
    getSections(x.id)
  }



  const modalCreate = (dat: any, mu: boolean) => {
    setModalState(true)
    setName('')
    setId(0)
    setArr1_nuevas([])
    setArr1_eliminar([])
    if (!mu) {
      setModoUpdate(false)
    } else {
      setModoUpdate(true)
      setName(dat.nombre)
      setId(dat.id)
      setArr1_nuevas(dat.empresas)
    }
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


  return (
    <div className='families'>
      <div className='families__container'>
        <div className='create__families_btn-container'>
          <button className='btn__general-purple' onClick={() => modalCreate(0, false)}>Nueva Familia</button>
        </div>
        <div className={`overlay__families ${modalState ? 'active' : ''}`}>
          <div className={`popup__families ${modalState ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__families" onClick={closeModalCreate}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
            </a>
            {!modoUpdate ?
              <p className='title__modals'>Crear Familia</p>
              :
              <p className='title__modals'>Actualizar Familia</p>
            }
            <div className='row'>
              <div className='col-12'>
                <label className='label__general'>Nombre de Familia</label>
                <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div>
                <input className={`inputs__general ${warningNombre ? 'warning' : ''}`} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Ingresa el nombre' />
              </div>
            </div>
            <div className='container__add_families'>
              <div className='title__add_families'>
                <p>Agregar Empresas</p>
              </div>
              <div className='add_families'>
                <div className=''>
                  <div className='select__container'>
                    <label className='label__general'>Empresas</label>
                    <div className='warning__general' style={styleWarningSelectCompanies}><small >Este campo es obligatorio</small></div>
                    <div className={`select-btn__general ${warningSelectCompany ? 'warning' : ''}`}>
                      <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                        <p>{selectedCompany ? companiesXUsers.find((s: { id: number }) => s.id === selectedCompany)?.razon_social : 'Selecciona'}</p>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
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
                </div>
                <div>
                  <div className='select__container'>
                    <label className='label__general'>Sucursales</label>
                    <div className='warning__general' style={styleWarningSelectCompanies}><small >Este campo es obligatorio</small></div>
                    <div className={`select-btn__general ${warningSelectCompany ? 'warning' : ''}`}>
                      <div className={`select-btn ${selectBranchOffices ? 'active' : ''}`} onClick={openSelectBranchOffices}>
                        <p>{selectedBranchOffice ? branchOffices.find((s: { id: number }) => s.id === selectedBranchOffice)?.nombre : 'Selecciona'}</p>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                      </div>
                      <div className={`content ${selectBranchOffices ? 'active' : ''}`}>
                        <ul className={`options ${selectBranchOffices ? 'active' : ''}`} style={{ opacity: selectBranchOffices ? '1' : '0' }}>
                          {branchOffices?.map((x: any) => (
                            <li key={x.id} onClick={() => handleBranchOfficesChange(x)}>
                              {x.nombre}
                            </li>
                          ))
                          }
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='d-flex align-items-end'>
                  <button className='btn__general-purple' onClick={addCompany} type='button'>Agregar</button>
                </div>
              </div>
            </div>
            <div className='table__families ' >
              <div>
                <div>
                  {arr1_nuevas ? (
                    <div className='table__numbers'>
                    <p className='text'>Familias agregadas</p>
                    <div className='quantities_tables'>{arr1_nuevas.length}</div>
                  </div>
                
                  ) : (
                    <b className='text'>No hay empresas</b>
                  )}
                </div>
                <div className='table__head'>
                  <div className='thead'>
                    <div className='th'>
                      <p className=''>Empresa</p>
                    </div>
                    <div className='th'>
                      <p className=''>Sucursal</p>
                    </div>
                  </div>
                </div>
                {arr1_nuevas.length > 0 ? (
                  <div className='table__body'>
                    {arr1_nuevas.map((dat, index) => (
                      <div className='tbody__container' key={index}>
                        <div className='tbody'>
                          <div className='td'>
                            {dat.empresa}
                          </div>
                          <div className='td'>
                            {dat.sucursal}
                          </div>
                          <div className='td'>
                            <button className='btn__delete_users' type="button" onClick={() => {
                              DynamicVariables.removeObjectInArray(setArr1_nuevas, index);
                              { modoUpdate && dat.id != 0 ? setArr1_eliminar(prevState => [...prevState, dat.id]) : null }
                            }}>Eliminar</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text'>No hay familias que cargar</p>
                )}
              </div>
            </div>
            <div className='container__btns_branch-office mt-4'>
              <button className='btn__general-purple' onClick={(e) => handleCreateFamilies(e)}>Crear nueva familia</button>
            </div>
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
                <p className=''>FAMILIA</p>
              </div>
            </div>
          </div>
          {families ? (
            <div className='table__body'>
              {families.map((dat: any) => {
                return (
                  <div className='tbody__container' key={dat.id}>
                    <div className='tbody'>
                      <div className='td'>
                        <p>{dat.nombre}</p>
                      </div>
                      <div className='td'>
                        <button className='branchoffice__edit_btn' onClick={() => modalCreate(dat, true)}>Editar</button>
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

export default Families
