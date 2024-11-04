import React, { useEffect, useState } from 'react'
import { storeCompanies } from '../../../../zustand/Companies';
import { storeBranchOffcies } from '../../../../zustand/BranchOffices';
import { storeSeries } from '../../../../zustand/Series';
import useUserStore from '../../../../zustand/General';
import './styles/Series.css'

interface Series {
  id: number,
  nombre: string
}

const Series: React.FC = () => {

  const [name, setName] = useState('')
  const [selectCompanies, setSelectCompanies] = useState<boolean>(false)
  const [selectBranchOffices, setSelectBranchOffices] = useState<boolean>(false)
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [selectedBranchOffice, setSelectedBranchOffice] = useState<number | null>(null);
  const [selectTypes, setSelectTypes] = useState<boolean>(false)
  const [selectedType, setSelectedType] = useState<number | null>(null)
  const [serie, setSerie] = useState<number | null>(null)

  const [filteredBranchOffices, setFilteredBranchOffices] = useState<any[]>([]);
  const { getCompaniesXUsers, companiesXUsers }: any = storeCompanies();
  const { getBranchOfficeXCompanies, branchOfficeXCompanies }: any = storeBranchOffcies();
  const { createSeries, series, getSeriesXUser, updateSeries }: any = storeSeries();
  const userState = useUserStore(state => state.user);
  let user_id = userState.id

  // Select de validaciones
  const [warningName, setWarningName] = useState<boolean>(false)

  // Modales
  const [modalState, setModalState] = useState(false)
  const [modalStateUpdate, setModalStateUpdate] = useState<boolean>(false)

  useEffect(() => {
    getSeriesXUser({id:user_id, tipo_ducumento:0})
    getCompaniesXUsers(user_id)
    getBranchOfficeXCompanies(0, user_id)
  }, [])

  const types = [
    {
      id: 0,
      name: 'Requisición'
    },
    {
      id: 1,
      name: 'Orden de compra'
    },
    {
      id: 2,
      name: 'Entrada'
    },
    {
      id: 3,
      name: 'Pedidos'
    },
    {
      id: 4,
      name: 'Salida de almacen'
    }
    ,
    {
      id: 5,
      name: 'Traspaso'
    }
    ,
    {
      id: 6,
      name: 'Cotización'
    }
    ,
    {
      id: 7,
      name: 'Orden de Venta'
    }
    ,
    {
      id: 8,
      name: 'Orden de Producción'
    }
    ,
    {
      id: 9,
      name: 'Factura'
    }
    ,
    {
      id: 10,
      name: 'Pedido de franquicia'
    }

  ]


  const modalCreate = () => {
    setModalState(true)
  }

  const closeModalCreate = () => {
    setModalState(false)
  }

  const handleCreateSeries = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (name === '') {
      setWarningName(true)
    } else {
      setWarningName(false)
    }

    if (name === '') {
      return;
    }

    let nombre = name
    let sucursal_id = selectedBranchOffice
    let tipo = selectedType

    try {
      await createSeries(sucursal_id, nombre, tipo);
      await getSeriesXUser(user_id)

    } catch (error) {
      console.error('Error al crear la sucursal:', error);
    }
  }


  const handleCompaniesChange = async (company: any) => {
    setSelectedCompany(company)

    const firstBranchOffice = branchOfficeXCompanies.find((branchOffice: any) => branchOffice.empresa_id === company);
    if (firstBranchOffice) {
      setSelectedBranchOffice(firstBranchOffice.id);
    } else {
      setSelectedBranchOffice(null);
    }
    setSelectCompanies(false);

  }

  useEffect(() => {
    if (selectedCompany) {
      const idSelectedBranch = branchOfficeXCompanies.filter((branchOffice: any) => branchOffice.empresa_id === selectedCompany);
      setFilteredBranchOffices(idSelectedBranch);
      if (idSelectedBranch.length > 0) {
        setSelectedBranchOffice(idSelectedBranch[0].id);
      } else {
        setSelectedBranchOffice(null); // Si no se encuentra ninguna sucursal, establecer selectedBranchOffice en null
      }
    } else {
      setFilteredBranchOffices([]);
      setSelectedBranchOffice(null); // Si no se ha seleccionado ninguna empresa, establecer selectedBranchOffice en null
    }

  }, [selectedCompany, branchOfficeXCompanies]);


  const openSelectCompanies = () => {
    setSelectCompanies(!selectCompanies)

  }

  const openSelectBranchOffices = () => {
    setSelectBranchOffices(!selectBranchOffices)
  }


  const handleAreasChange = (sucursal: any) => {
    setSelectedBranchOffice(sucursal);
    setSelectBranchOffices(false)
  }

  const styleWarningName = {
    opacity: warningName === true ? '1' : '',
    height: warningName === true ? '23px' : ''
  }


  const modalUpdate = async (serie: any) => {
    setModalStateUpdate(true)

    setName(serie.nombre)
    setSerie(serie.id)
    setSelectedType(serie.tipo)

    await getCompaniesXUsers(user_id)
    await setSelectedCompany(serie.empresa_id)
    await getBranchOfficeXCompanies(serie.empresa_id, user_id)
    await setSelectedBranchOffice(serie.sucursal_id)
    console.log(serie)
  }

  const modalCloseUpdate = () => {
    setModalStateUpdate(false)

  }

  const handleUpdateSeries = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let id = serie
    let sucursal_id = selectedBranchOffice
    let nombre = name
    let tipo = selectedType
    try {
      await updateSeries(id, sucursal_id, nombre, tipo)
      setModalStateUpdate(false)
      await getSeriesXUser(user_id)
    } catch {

    }
  }

  const openSelectTypes = () => {
    setSelectTypes(!selectTypes)
  }

  const handleTypesChange = (type: any) => {
    setSelectedType(type.id)
    setSelectTypes(false)
  }


  return (
    <div className='series'>
      <div className='series__container'>
        <div>
          <div className='create__areas_btn-container'>
            <button className='btn__general-purple' onClick={modalCreate}>Crear nuevas series</button>
          </div>
        </div>
        <div className={`overlay__series ${modalState ? 'active' : ''}`}>
          <div className={`popup__series ${modalState ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__series" onClick={closeModalCreate}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
            </a>
            <p className='title__modals'>Crear nueva serie</p>
            <form onSubmit={handleCreateSeries}>
              <div className='row'>
                <div className='col-6 md-col-12'>
                  <div className='select__container'>
                    <label className='label__general'>Empresas</label>
                    <div className='select-btn__general'>
                      <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                        <div className='select__container_title'>
                          <p>{selectedCompany ? companiesXUsers.find((s: { id: number }) => s.id === selectedCompany)?.razon_social : 'Selecciona'}</p>
                        </div>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                      </div>
                      {/* <div className={`content ${selectCompanies ? 'active' : ''}`}  style={{ maxHeight: selectCompanies ? '280px' : '0' }}></div> */}
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
                </div>
                <div className='col-6 md-col-12'>
                  <div className='select__container'>
                    <label className='label__general'>Sucursales</label>
                    <div className='select-btn__general'>
                      <div className={`select-btn ${selectBranchOffices ? 'active' : ''}`} onClick={openSelectBranchOffices} >
                        <div className='select__container_title'>
                          <p>{selectedBranchOffice ? branchOfficeXCompanies.find((s: { id: number }) => s.id === selectedBranchOffice)?.nombre : 'Selecciona'}</p>
                        </div>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                      </div>
                      <div className={`content ${selectBranchOffices ? 'active' : ''}`} >
                        <ul className={`options ${selectBranchOffices ? 'active' : ''}`} style={{ opacity: selectBranchOffices ? '1' : '0' }}>
                          {filteredBranchOffices.map((sucursal: any) => (
                            <li key={sucursal.id} onClick={() => handleAreasChange(sucursal.id)}>
                              {sucursal.nombre}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-6 md-col-12'>
                  <div className='select__container'>
                    <label className='label__general'>Tipos</label>
                    <div className='select-btn__general'>
                      <div className={`select-btn ${selectTypes ? 'active' : ''}`} onClick={openSelectTypes} >
                        <p>{selectedType !== null ? types.find((s: { id: number }) => s.id === selectedType)?.name : 'Selecciona'}</p>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                      </div>
                      <div className={`content ${selectTypes ? 'active' : ''}`} >
                        <ul className={`options ${selectTypes ? 'active' : ''}`} style={{ opacity: selectTypes ? '1' : '0' }}>
                          {types.map((type: any) => (
                            <li key={type.id} onClick={() => handleTypesChange(type)}>
                              {type.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-6 md-col-12'>
                  <div>
                    <label className='label__general'>Nombre</label>
                    <div className='warning__general' style={styleWarningName}><small >Este campo es obligatorio</small></div>
                    <input className={`inputs__general ${warningName ? 'warning' : ''}`} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Ingresa el nombre' />
                  </div>
                </div>
              </div>



              <br />
              <div className='container__series_btn_modal_container'>
                <button className='btn__general-purple' type='submit'>Crear nueva serie</button>
              </div>
            </form>
          </div>
        </div>
        <div className='table__series'>
          <div>
            {series ? (
              <div>
                <p className='text'>Series {series.length}</p>
              </div>
            ) : (
              <p></p>
            )}
          </div>
          <div className='table__head'>
            <div className='thead'>
              <div className='th'>
                <p>Nombre</p>
              </div>
              <div className='th'>
                <p>Sucursal</p>
              </div>
              <div className='th'>
                <p>Empresa</p>
              </div>
            </div>
          </div>
          {series ? (
            <div className='table__body'>
              {series.map((serie: any) => {
                // Buscar la empresa correspondiente en companiesData
                return (
                  <div className='tbody__container' key={serie.id}>
                    <div className='tbody'>
                      <div className='td'>
                        <b>{serie.nombre}</b><br />
                        {
                          types.map((dat: any) => {
                            return dat.id == serie.tipo ? <small>{dat.name}</small> : null
                          })}
                      </div>
                      <div className='td'>
                        <p>{serie.sucursal}</p>
                      </div>
                      <div className='td'>
                        <p>{serie.empresa}</p>
                      </div>
                      <div className='td'>
                        <button className='general__edit_button' onClick={() => modalUpdate(serie)}>Editar</button>
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
        <div className={`overlay__series ${modalStateUpdate ? 'active' : ''}`}>
          <div className={`popup__series ${modalStateUpdate ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__series" onClick={modalCloseUpdate}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
            </a>
            <p className='title__modals'>Actualizar serie</p>
            <form onSubmit={handleUpdateSeries}>
              <div className='row'>
                <div className='col-6 md-col-12'>
                  <div className='select__container'>
                    <label className='label__general'>Empresas</label>
                    <div className='select-btn__general'>
                      <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                        <p>{selectedCompany ? companiesXUsers.find((s: { id: number }) => s.id === selectedCompany)?.razon_social : 'Selecciona'}</p>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                      </div>
                      {/* <div className={`content ${selectCompanies ? 'active' : ''}`}  style={{ maxHeight: selectCompanies ? '280px' : '0' }}></div> */}
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
                </div>
                <div className='col-6 md-col-12'>
                  <div className='select__container'>
                    <label className='label__general'>Sucursales</label>
                    <div className='select-btn__general'>
                      <div className={`select-btn ${selectBranchOffices ? 'active' : ''}`} onClick={openSelectBranchOffices} >
                        <div className='select__container_title'>
                          <p>{selectedBranchOffice ? branchOfficeXCompanies.find((s: { id: number }) => s.id === selectedBranchOffice)?.nombre : 'Selecciona'}</p>
                        </div>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                      </div>
                      <div className={`content ${selectBranchOffices ? 'active' : ''}`} >
                        <ul className={`options ${selectBranchOffices ? 'active' : ''}`} style={{ opacity: selectBranchOffices ? '1' : '0' }}>
                          {filteredBranchOffices.map((sucursal: any) => (
                            <li key={sucursal.id} onClick={() => handleAreasChange(sucursal.id)}>
                              {sucursal.nombre}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-6 md-col-12'>
                  <div className='select__container'>
                    <label className='label__general'>Tipos</label>
                    <div className='select-btn__general'>
                      <div className={`select-btn ${selectTypes ? 'active' : ''}`} onClick={openSelectTypes} >
                        <p>{selectedType ? types.find((s: { id: number }) => s.id === selectedType)?.name : 'Selecciona'}</p>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                      </div>
                      <div className={`content ${selectTypes ? 'active' : ''}`} >
                        <ul className={`options ${selectTypes ? 'active' : ''}`} style={{ opacity: selectTypes ? '1' : '0' }}>
                          {types.map((type: any) => (
                            <li key={type.id} onClick={() => handleTypesChange(type)}>
                              {type.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-6 md-col-12'>
                  <div>
                    <label className='label__general'>Nombre</label>
                    <div className='warning__general' style={styleWarningName}><small >Este campo es obligatorio</small></div>
                    <input className={`inputs__general ${warningName ? 'warning' : ''}`} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Ingresa el nombre' />
                  </div>
                </div>
              </div>




              <div className='container__series_btn_modal_container'>
                <button className='btn__general-purple' type='submit'>Actualizar serie</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Series
