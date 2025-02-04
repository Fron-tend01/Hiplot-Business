import React, { useEffect, useState } from 'react'
import './styles/Clientes.css'
import { storeModals } from '../../../../zustand/Modals'
import ModalCreate from './Clients/ModalCreate'
import { ClientsRequests } from '../../../../fuctions/Clients'
import useUserStore from '../../../../zustand/General'
import { companiesRequests } from '../../../../fuctions/Companies'
import { BranchOfficesRequests } from '../../../../fuctions/BranchOffices'
import { storeClients } from '../../../../zustand/Clients'

const Clients: React.FC = () => {
  const userState = useUserStore(state => state.user);
  const user_id = userState.id

  const {getCompaniesXUsers}: any = companiesRequests()
  const [companies, setCompanies] = useState<any>([])
  const {getBranchOffices}: any = BranchOfficesRequests()
  const [branchOffices, setBranchOffices] = useState<any>([])

  const [name, setName] = useState<string>('')

  const {getClients}: any = ClientsRequests()
  const setClientToUpdate = storeClients(state => state.setClientToUpdate)

  const [clients, setClients] = useState<any>([])
  const [page, setPage] = useState<number>(1)
  const setModal = storeModals(state => state.setModal)
  const { modal }: any = storeModals()
  const fetch = async () => {
      const resultCompanies = await getCompaniesXUsers(user_id);
      setCompanies(resultCompanies)
      setSelectedCompany(resultCompanies[0].id)

      const resultBranchOffices = await getBranchOffices(resultCompanies[0].id,  user_id);
      setBranchOffices(resultBranchOffices)
      setSelectedBranchOffice(resultBranchOffices[0].id)


      const data = {
        id_sucursal: resultBranchOffices[0].id,
        id_usuario: user_id,
        nombre: name
      }

      const resultCLients = await getClients(data)
      setClients(resultCLients)
   
  }
  const searchClient = async () =>  {
    const data = {
        id_sucursal: selectedBranchOffice,
        id_usuario: user_id,
        nombre: name,
        page:page
      }

      const resultCLients = await getClients(data)
      setClients(resultCLients)
   
  }

  useEffect(() => {
      fetch()
  }, [])
  useEffect(() => {
    if (!modal) {
        fetch()
    }
}, [modal])

  
  const [selectCompanies, setSelectCompanies] = useState<boolean>(false)
  const [selectedCompany, setSelectedCompany] = useState<any>(null)

  const openSelectCompanies = () => {
      setSelectCompanies(!selectCompanies)
  }

  const handleCompaniesChange = async (company: any) => {
      setSelectedCompany(company.id)
      const resultBranchOffices = await getBranchOffices(company.id,  user_id);
      setBranchOffices(resultBranchOffices)
      setSelectCompanies(false)
      setSelectedBranchOffice(resultBranchOffices[0].id)

  }

  const [selectBranchOffices, setSelectBranchOffices] = useState<boolean>(false)
  const [selectedBranchOffice, setSelectedBranchOffice] = useState<any>(null)

  const openSelectBranchOffices = () => {
      setSelectBranchOffices(!selectBranchOffices)
  }

  const handleBranchOfficesChange = (branch: any) => {
      setSelectedBranchOffice(branch.id)
      setSelectBranchOffices(false)
  
  }

  const updateClients = (client: any)  => {
      setClientToUpdate(client)
    setModal('update_clients')

  }

     useEffect(() => {
        searchClient();
      }, [page]);

  return (
    <div className='customers'>
        <div className='customers__container'>
            <div className='row__one'>
                <div className='select__container'>
                  <label className='label__general'>Empresas</label>
                  <div className='select-btn__general'>
                      <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                          <div className='select__container_title'>
                              <p>{selectedCompany ? companies.find((s: { id: number }) => s.id === selectedCompany)?.razon_social : 'Selecciona'}</p>
                          </div>
                          <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                      </div>
                      <div className={`content ${selectCompanies ? 'active' : ''}`}>
                          <ul className={`options ${selectCompanies ? 'active' : ''}`} style={{ opacity: selectCompanies ? '1' : '0' }}>
                              {companies?.map((company: any) => (
                                  <li key={company.id} onClick={() => handleCompaniesChange(company)}>
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
                      <div className={`select-btn ${selectBranchOffices ? 'active' : ''}`} onClick={openSelectBranchOffices}>
                          <div className='select__container_title'>
                              <p>{selectedBranchOffice ? branchOffices.find((s: { id: number }) => s.id === selectedBranchOffice)?.nombre : 'Selecciona'}</p>
                          </div>
                          <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                      </div>
                      <div className={`content ${selectBranchOffices ? 'active' : ''}`}>
                          <ul className={`options ${selectBranchOffices ? 'active' : ''}`} style={{ opacity: selectBranchOffices ? '1' : '0' }}>
                              {branchOffices?.map((unit: any) => (
                                  <li key={unit.id} onClick={() => handleBranchOfficesChange(unit)}>
                                      {unit.nombre}
                                  </li>
                              ))}
                          </ul>
                      </div>
                  </div>
              </div>
              <div className='inputs__company'>
                  <label className='label__general'>Nombre</label>
                  <div className='warning__general'><small>Este campo es obligatorio</small></div>
                  <input name="condiciones_pago" className='inputs__general' type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Ingresa el nombre y pulsa ENTER'
                  onKeyUp={(event) => event.key === 'Enter' && searchClient()} />
              </div>
            </div>
            <div className='d-flex justify-content-center my-4'>
              <button className='btn__general-purple' type='button' onClick={() => setModal('create_clients')}>Crear clientes</button>
              <ModalCreate />
            </div>
            <div className='table__clients' >
              <div>
                  <div>
                      {clients ? (
                          <div>
                              <p className='text'>Total de unidades {clients.length}</p>
                          </div>
                      ) : (
                          <p className='text'>No hay empresas</p>
                      )}
                  </div>
                  <div className='table__head'>
                      <div className='thead'>
                          <div className='th'>
                              <p className=''>Razon Social</p>
                          </div>
                          <div className='th'>
                              <p className=''>Correo Electronico</p>
                          </div>
                          <div className='th'>
                              <p className=''>RFC</p>
                          </div>
                          <div className='th'>
                            <p className=''>Status</p>
                          </div>
                          <div className='th'>
                       
                          </div>
                      </div>
                  </div>
                  {clients.length > 0 ? (
                      <div className='table__body'>
                          {clients.map((item: any, index: any) => (
                              <div className='tbody__container' key={index}>
                                  <div className='tbody'>
                                      <div className='td'>
                                        {item.razon_social}
                                      </div>
                                      <div className='td'>
                                        {item.correo} 
                                      </div>
                                      <div className='td'>
                                        {item.rfc}
                                      </div>
                                      <div className='td'>
                                        {item.status}
                                      </div>
                                      <div className='td'>
                                          <button className='btn__general-purple' type='button' onClick={() => updateClients(item)}>Editar</button>
                                      </div>
                                      <div className='td'>
                                          <button className='btn__delete_users' type='button'>Eliminar</button>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  ) : (
                      <p className='text'>Cargando datos...</p>
                  )}
              </div>
            </div>
            <div className='row'>
                    <div className='col-1'>
                        <button className='btn__general-primary' onClick={()=>{setPage(page-1)}} disabled={page==1}>ANTERIOR</button>
                    </div>
                    <div className='col-10'>

                    </div>
                    <div className='col-1'>
                        <button className='btn__general-primary' onClick={()=>{setPage(page+1)}}>SIGUIENTE</button>
                    </div>
                </div>
        </div>
    </div>
  )
}

export default Clients
