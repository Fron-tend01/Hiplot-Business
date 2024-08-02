import React, { useEffect, useState } from 'react'
import { companiesRequests } from '../../../fuctions/Companies';
import useUserStore from '../../../zustand/General';
import { BranchOfficesRequests } from '../../../fuctions/BranchOffices';
import { storeDv } from '../../../zustand/Dynamic_variables';
import { useStore } from 'zustand';


const Empresas_Sucursales = () => {

    const setEmpresa = storeDv(state => state.setEmpresa)
    const { empresa, sucursal }: any = useStore(storeDv)

    const setSucursal = storeDv(state => state.setSucursal)
    // const {sucursal} = useStore(storeDv)

    const { getCompaniesXUsers }: any = companiesRequests()
    const [empresas, setEmpresas] = useState<any>([])
    const [empresaSelectedOpen, SetEmpresaSelectedOpen] = useState<boolean>(false)

    const { getBranchOffices }: any = BranchOfficesRequests()
    const [sucursales, setSucursales] = useState<any>([])
    const [sucursalSelectedOpen, SetSucursalSelectedOpen] = useState<boolean>(false)

    const userState = useUserStore(state => state.user);
    let user_id = userState.id

    const fetch = async () => {
        let resultCompanies = await getCompaniesXUsers(user_id)
        let resultBranch = await getBranchOffices(resultCompanies[0].id, user_id)
        setEmpresas(resultCompanies)
        setEmpresa(resultCompanies[0])
        setSucursales(resultBranch)
        setSucursal(resultBranch[0])
    }
    useEffect(() => {
        fetch()
    }, [])
    const selectAutomaticSuc = async (company: any) => {
        let resultBranch = await getBranchOffices(company, user_id)
        setSucursales(resultBranch)
        setSucursal(resultBranch[0])
    }
    return (
        <div className='row'>
            <div className='col-6 sm-col-12'>
                <div className='select__container'>
                    <label className='label__general'>Empresa</label>
                    <div className={`select-btn ${empresaSelectedOpen ? 'active' : ''}`} onClick={() => SetEmpresaSelectedOpen(!empresaSelectedOpen)}>
                        <div className='select__container_title'>
                            <p>{empresa.id ? empresas.find((s: { id: number }) => s.id === empresa.id)?.razon_social : 'Selecciona'}</p>
                        </div>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                    </div>
                    <div className={`content ${empresaSelectedOpen ? 'active' : ''}`}>
                        <ul className={`options ${empresaSelectedOpen ? 'active' : ''}`} style={{ opacity: empresaSelectedOpen ? '1' : '0' }}>
                            {empresas && empresas.map((fam: any) => (
                                <li key={fam.id} onClick={() => {
                                    SetEmpresaSelectedOpen(false);
                                    selectAutomaticSuc(fam.id);
                                    setEmpresa(fam)
                                }}>
                                    {fam.razon_social}
                                </li>
                            ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
            <div className='col-6 sm-col-12'>
                <div className='select__container'>
                    <label className='label__general'>Sucursal</label>
                    <div className={`select-btn ${sucursalSelectedOpen ? 'active' : ''}`} onClick={() => SetSucursalSelectedOpen(!sucursalSelectedOpen)}>
                        <div className='select__container_title'>
                            <p>{sucursal.id ? sucursales.find((s: { id: number }) => s.id === sucursal.id)?.nombre : 'Selecciona'}</p>
                        </div>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                    </div>
                    <div className={`content ${sucursalSelectedOpen ? 'active' : ''}`}>
                        <ul className={`options ${sucursalSelectedOpen ? 'active' : ''}`} style={{ opacity: sucursalSelectedOpen ? '1' : '0' }}>
                            {sucursales && sucursales.map((fam: any) => (
                                <li key={fam.id} onClick={() => {
                                    SetSucursalSelectedOpen(false);
                                    setSucursal(fam)
                                }}>
                                    {fam.nombre}
                                </li>
                            ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Empresas_Sucursales
