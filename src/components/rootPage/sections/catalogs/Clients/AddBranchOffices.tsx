import React, { useEffect, useState } from 'react'
import { storeModals } from '../../../../../zustand/Modals'
import { companiesRequests } from '../../../../../fuctions/Companies'
import { BranchOfficesRequests } from '../../../../../fuctions/BranchOffices'
import { storeClients } from '../../../../../zustand/Clients'
import { useStore } from 'zustand'
import useUserStore from '../../../../../zustand/General'
import './AddBranchOffices.css'

const AddBranchOffices = () => {
    const userState = useUserStore(state => state.user);
    let user_id = userState.id

    const {modalSub}: any = storeModals()
    const setModalSub = storeModals(state => state.setModalSub)
    const setAddBranchClients = storeClients(state => state.setAddBranchClients)

    const {addBranchClients, clientToUpdate}: any = useStore(storeClients)

    const {getCompaniesXUsers}: any = companiesRequests()
    const [companies, setCompanies] = useState<any>([])
    const {getBranchOffices}: any = BranchOfficesRequests()
    const [branchOffices, setBranchOffices] = useState<any>([])

    
    const fetch = async () => {
        let resultCompanies = await getCompaniesXUsers(user_id);
        setCompanies(resultCompanies)
     
    }


    useEffect(() => {
        fetch()
        setAddBranchClients(clientToUpdate.sucursales
        )
  
    }, [])


    const [selectCompanies, setSelectCompanies] = useState<boolean>(false)
    const [selectedCompany, setSelectedCompany] = useState<any>(null)

    const openSelectCompanies = () => {
        setSelectCompanies(!selectCompanies)
    }

    const handleCompaniesChange = async (company: any) => {
        setSelectedCompany(company.id)
        let resultBranchOffices = await getBranchOffices(company.id,  user_id);
        setBranchOffices(resultBranchOffices)
        setSelectCompanies(false)
    }

    const [selectBranchOffices, setSelectBranchOffices] = useState<boolean>(false)
    const [selectedBranchOffice, setSelectedBranchOffice] = useState<any>(null)

    const openSelectBranchOffices = () => {
        setSelectBranchOffices(!selectBranchOffices)
    }

    const handleBranchOfficesChange = (branch: any) => {
        setSelectedBranchOffice(branch.id)
        setSelectBranchOffices(false)
        setInputs((prevInputs) => ({
            ...prevInputs,
            id_sucursal: branch.id
          }));
    }

    const [inputs, setInputs] = useState({
        id_sucursal: null,
        condiciones_pago: "",
        limite_credito: 0,
        forma_pago: "",
        metodo_pago: ""
      });

      
    useEffect(() => {

    }, [inputs])

      const handleInputs = (event) => {
        const { name, value, type, checked } = event.target;
        setInputs((prevInputs) => ({
          ...prevInputs,
          [name]: type === 'checkbox' ? checked : name in prevInputs && typeof prevInputs[name] === 'number' ? Number(value) : value,
        }));
      };
      
      const addBranch = () => {
        setAddBranchClients([...addBranchClients, inputs])
      }


    return (
        <div className={`overlay__create_modal-sub_clients ${modalSub == 'modal-sub_create_clients' ? 'active' : ''}`}>
            <div className={`popup__create_modal-sub_clients ${modalSub == 'modal-sub_create_clients' ? 'active' : ''}`}>
                <a href="#" className="btn-cerrar-popup__create_modal-sub_clients" onClick={() => setModalSub('')}>
                    <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                </a>
                <p className='title__modals'>Crear nuevo cliente</p>
                <div className='conatiner__create_modal-sub_clients' >
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
                    </div>
                    <div className='row__two'>
                        <div className='inputs__company'>
                            <label className='label__general'>Condiciones de Pago</label>
                            <div className='warning__general'><small>Este campo es obligatorio</small></div>
                            <input name="condiciones_pago" className='inputs__general' type="text" value={inputs.condiciones_pago} onChange={handleInputs} placeholder='Condiciones de Pago' />
                        </div>
                        <div className='inputs__company'>
                            <label className='label__general'>Límite de Crédito</label>
                            <div className='warning__general'><small>Este campo es obligatorio</small></div>
                            <input name="limite_credito" className='inputs__general' type="text" value={inputs.limite_credito} onChange={handleInputs} placeholder='Límite de Crédito' />
                        </div>
                        <div className='inputs__company'>
                            <label className='label__general'>Forma de Pago</label>
                            <div className='warning__general'><small>Este campo es obligatorio</small></div>
                            <input name="forma_pago" className='inputs__general' type="text" value={inputs.forma_pago} onChange={handleInputs} placeholder='Forma de Pago' />
                        </div>
                        <div className='inputs__company'>
                            <label className='label__general'>Método de Pago</label>
                            <div className='warning__general'><small>Este campo es obligatorio</small></div>
                            <input name="metodo_pago" className='inputs__general' type="text" value={inputs.metodo_pago} onChange={handleInputs} placeholder='Método de Pago' />
                        </div>
                        <button className='btn__general-purple' type='button' onClick={addBranch}>Agregar</button>
                    </div>
                    <div className='table__modal-sub_clients' >
                        <div>
                        {addBranchClients ? (
                            <div>
                                <p className='text'>Tus caracteristicas {addBranchClients.length}</p>
                            </div>
                            ) : (
                            <p>No hay caracteristicas</p>
                        )}
                        </div>
                        <div className='table__head'>
                            <div className='thead'>
                                <div className='th'>
                                    <p className=''>Sucursal</p>
                                </div>
                                <div className='th'>
                                    <p>Condiciones de Pago</p>
                                </div>
                                <div className='th'>
                                    <p className=''>Límite de Crédito</p>
                                </div>
                                <div className='th'>
                                    <p className=''>Condiciones de Pago</p>
                                </div>
                            </div>
                        </div>
                        {addBranchClients ? (
                        <div className='table__body'>
                            {addBranchClients?.map((item: any, index: any) => {
                            return (
                                <div className='tbody__container' key={index}>
                                    <div className='tbody'>
                                        <div className='td'>
                                            <p>{item.id_sucursal}</p>
                                        </div>
                                        <div className='td'>
                                            {item.condiciones_pago}
                                        </div>
                                        <div className='td'>
                                            <p>{item.limite_credito}</p>
                                        </div>
                                        <div className='td'>
                                            {item.forma_pago}
                                        </div>
                                        <div className='td'>
                                            <button className='branchoffice__delete_btn' onClick={() => ModalUpdate(item)}>Eliminar</button>
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
        </div>
    )
}

export default AddBranchOffices
