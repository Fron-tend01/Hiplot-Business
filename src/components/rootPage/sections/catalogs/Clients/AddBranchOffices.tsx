import React, { useEffect, useState } from 'react'
import { storeModals } from '../../../../../zustand/Modals'
import { companiesRequests } from '../../../../../fuctions/Companies'
import { BranchOfficesRequests } from '../../../../../fuctions/BranchOffices'
import { storeClients } from '../../../../../zustand/Clients'
import { useStore } from 'zustand'
import useUserStore from '../../../../../zustand/General'
import './AddBranchOffices.css'
import APIs from '../../../../../services/services/APIs'
import DynamicVariables from '../../../../../utils/DynamicVariables'

const AddBranchOffices: React.FC = () => {
    const userState = useUserStore(state => state.user);
    const user_id = userState.id

    const { modalSub }: any = storeModals()
    const setModalSub = storeModals(state => state.setModalSub)
    const setAddBranchClients = storeClients(state => state.setAddBranchClients)
    const setBranchClientsRemove = storeClients(state => state.setBranchClientsRemove)
    const { modal }: any = storeModals()

    const { addBranchClients, clientToUpdate }: any = useStore(storeClients)

    const { getCompaniesXUsers }: any = companiesRequests()
    const [companies, setCompanies] = useState<any>([])
    const { getBranchOffices }: any = BranchOfficesRequests()
    const [branchOffices, setBranchOffices] = useState<any>([])

    const [condPago, setCondPago] = useState<any>([])
    const [formaPago, setFormaPago] = useState<any>([])
    const [metodoPago] = useState<any>([
        {
            id: 0,
            nombre: 'PUE - PAGO EN UNA SOLA EXHIBICION'
        },
        {
            id: 1,
            nombre: 'PPD - PAGO EN PARCIALIDADES O DIFERIDO'
        }
    ])
    const fetch = async () => {
        const resultCompanies: any = await getCompaniesXUsers(user_id);
        setCompanies(resultCompanies)
        setSelectCompanies(resultCompanies[0].id)
        handleCompaniesChange(resultCompanies[0])
    }

    const [inputs, setInputs] = useState({
        id_sucursal: 0,
        condiciones_pago: 0,
        limite_credito: 0,
        forma_pago: 0,
        metodo_pago: 0,
        sucursal: ""
    });
    useEffect(() => {
        fetch()
        setAddBranchClients(clientToUpdate.sucursales == undefined ? [] : clientToUpdate.sucursales)

        getRefs()
    }, [])
    const getRefs = async () => {
        const result: any = await APIs.GetAny("getFormaPago")
        setFormaPago(result)
        const res: any = await APIs.GetAny("getCondPago")
        setCondPago(res)
        DynamicVariables.updateAnyVar(setInputs, "forma_pago", result[0].ID)
        DynamicVariables.updateAnyVar(setInputs, "condiciones_pago", res[0].ID)
    }

    const [selectCompanies, setSelectCompanies] = useState<boolean>(false)
    const [selectedCompany, setSelectedCompany] = useState<any>(null)

    const openSelectCompanies = () => {
        setSelectCompanies(!selectCompanies)
    }

    const handleCompaniesChange = async (company: any) => {
        setSelectedCompany(company.id)
        const resultBranchOffices = await getBranchOffices(company.id, user_id);
        setBranchOffices(resultBranchOffices)

        setSelectCompanies(false)
        setSelectedBranchOffice(resultBranchOffices[0].id)

        DynamicVariables.updateAnyVar(setInputs, "id_sucursal", resultBranchOffices[0].id)
        DynamicVariables.updateAnyVar(setInputs, "sucursal", resultBranchOffices[0].nombre)
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
            id_sucursal: branch.id,
            sucursal: branch.nombre
        }));
    }

    const addBranch = () => {
        const filter = branchOffices.filter((x: any) => x.id == selectedBranchOffice)
        DynamicVariables.updateAnyVar(setInputs, "sucursal", filter[0].nombre)
        setAddBranchClients([...addBranchClients, inputs])
    }


    return (
        <div className={`overlay__create_modal-sub_clients ${modalSub == 'modal-sub_create_clients' ? 'active' : ''}`}>
            <div className={`popup__create_modal-sub_clients ${modalSub == 'modal-sub_create_clients' ? 'active' : ''}`}>
                <div className='header__modal'>
                    <a href="#" className="btn-cerrar-popup__create_modal-sub_clients" onClick={() => setModalSub('')}>
                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                    </a>
                    <p className='title__modals'><b>Habilitar a Sucursales</b></p>
                </div>
                <div className='add__branch-offices'>
                    <div className='row' >
                        <div className='col-6 md-col-12'>
                            <div className='select__container'>
                                <label className='label__general'>Empresa</label>
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
                        </div>
                        <div className='col-6 md-col-12'>

                            <div className='select__container'>
                                <label className='label__general'>Sucursal</label>
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
                    </div>
                    <br />
                    <div className='row' >

                        <div className='col-3 md-col-6 sm-col-12'>
                            <label className='label__general'>Cond. Pago</label>
                            <select className='inputs__general' value={inputs.condiciones_pago} onChange={(e) => DynamicVariables.updateAnyVar(setInputs, "condiciones_pago", parseInt(e.target.value))}>
                                {condPago.map((dat: any) => (
                                    <option value={dat.ID}> {dat.Value} </option>
                                ))}
                            </select>
                        </div>
                        <div className='col-2 md-col-5 sm-col-11'>
                            <label className='label__general'>Lim. Crédito</label>
                            <div className='warning__general'><small>Este campo es obligatorio</small></div>
                            <input name="limite_credito" className='inputs__general' type="text" value={inputs.limite_credito} onChange={(e) => DynamicVariables.updateAnyVar(setInputs, "limite_credito", parseInt(e.target.value))} placeholder='Límite de Crédito' />
                        </div>
                        <div className='col-3 md-col-6 sm-col-12'>
                            <label className='label__general'>Form. Pago</label>
                            <select className='inputs__general' value={inputs.forma_pago} onChange={(e) => DynamicVariables.updateAnyVar(setInputs, "forma_pago", parseInt(e.target.value))}>
                                {formaPago.map((dat: any) => (
                                    <option value={dat.ID}> {dat.Value} </option>
                                ))}
                            </select>
                        </div>
                        <div className='col-3 md-col-6 sm-col-12'>
                            <label className='label__general'>Mét. Pago</label>
                            <select className='inputs__general' value={inputs.metodo_pago} onChange={(e) => DynamicVariables.updateAnyVar(setInputs, "metodo_pago", parseInt(e.target.value))}>
                                {metodoPago.map((dat: any) => (
                                    <option value={dat.id}> {dat.nombre} </option>
                                ))}
                            </select>
                        </div>
                        <div className='col-1 md-col-1 sm-col-1 d-flex align-items-end'>
                            <button className='btn__general-purple' type='button' onClick={addBranch}>Agregar</button>
                        </div>

                    </div>
                    <br />
                    <hr />
                    <br />
                    <div className='table__modal-sub_clients' >
                        <div>
                            {addBranchClients ? (
                                <div>
                                    <p className='text'>Sucursales Agregadas {addBranchClients.length}</p>
                                </div>
                            ) : (
                                <p>No hay Sucursales</p>
                            )}
                        </div>
                        <div className='table__head'>
                            <div className='thead'>
                                <div className='th'>
                                    <p className=''>Sucursal</p>
                                </div>
                                <div className='th'>
                                    <p>Cond. Pago</p>
                                </div>
                                <div className='th'>
                                    <p className=''>Lim. Crédito</p>
                                </div>
                                <div className='th'>
                                    <p className=''>Form. Pago</p>
                                </div>
                                <div className='th'>
                                    <p className=''>Met. Pago</p>
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
                                                    <small>{item.sucursal}</small>
                                                </div>
                                                <div className='td'>
                                                    <small>{condPago.find((s: any) => s.ID === item.condiciones_pago)?.Value || ""}</small>
                                                </div>
                                                <div className='td'>
                                                    <small>{item.limite_credito}</small>
                                                </div>
                                                <div className='td'>
                                                    <small>{formaPago.find((s: any) => s.ID === item.forma_pago)?.Value || ""}</small>

                                                </div>
                                                <div className='td'>
                                                    <small>{metodoPago.find((s: any) => s.id === item.metodo_pago)?.nombre || ""}</small>

                                                </div>
                                                <div className='td'>
                                                    <button className='btn__delete_users' onClick={() => {
                                                        DynamicVariables.removeObjectInArray(setAddBranchClients, index);
                                                        { modal == 'update_clients' && item.id ? setBranchClientsRemove(prev => [...prev, item.id]) : null }
                                                    }}>Eliminar</button>
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
