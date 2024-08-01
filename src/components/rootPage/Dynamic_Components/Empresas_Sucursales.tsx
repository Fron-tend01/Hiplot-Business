import React, { useEffect, useState } from 'react'
import { companiesRequests } from '../../../fuctions/Companies';
import useUserStore from '../../../zustand/General';
import { BranchOfficesRequests } from '../../../fuctions/BranchOffices';
import DynamicVariables from '../../../utils/DynamicVariables';

interface EmpresasSucursalesProps {
    onReturn: (data: { empresa: any, sucursal: any }) => void;
  }
const Empresas_Sucursales :React.FC<EmpresasSucursalesProps> = ({ onReturn }) => {
    
    const { getCompaniesXUsers }: any = companiesRequests()
    const [empresas, setEmpresas] = useState<any>([])
    const [empresaSelected, SetEmpresaSelected] = useState<any>({})
    const [empresaSelectedOpen, SetEmpresaSelectedOpen] = useState<boolean>(false)

    const { getBranchOffices }: any = BranchOfficesRequests()
    const [sucursales, setSucursales] = useState<any>([])
    const [sucursalSelected, SetSucursalSelected] = useState<any>({})
    const [sucursalSelectedOpen, SetSucursalSelectedOpen] = useState<boolean>(false)

    const userState = useUserStore(state => state.user);
    let user_id = userState.id

    const fetch = async () => {
        let resultCompanies = await getCompaniesXUsers(user_id)
        let resultBranch = await getBranchOffices(resultCompanies[0].id, user_id)
        setEmpresas(resultCompanies)
        setSucursales(resultBranch)
    }
    useEffect(() => {
        fetch()
    }, [])
    useEffect(() => {
        handleReturn();
    }, [sucursalSelected, empresaSelected])
    const selectAutomaticSuc = async (company: any) => {
        let resultBranch = await getBranchOffices(company, user_id)
        SetSucursalSelected(resultBranch[0])
        setSucursales(resultBranch)
        handleReturn()
    }
    const handleReturn = () => {
        const data = {
            empresa: empresaSelected,
            sucursal: sucursalSelected
        };
        
        if (typeof onReturn === 'function') {
            onReturn(data);
          } else {
            console.error("onReturn no es una función");
          }
    };
    return (
        <div className='row'>
            <div className='col-4'>
                <div className='select__container'>
                    <label className='label__general'>Empresa</label>
                    <div className={`select-btn ${empresaSelectedOpen ? 'active' : ''}`} onClick={() => SetEmpresaSelectedOpen(!empresaSelectedOpen)}>
                        <p>{empresaSelected.id ? empresas.find((s: { id: number }) => s.id === empresaSelected.id)?.razon_social : 'Selecciona'}</p>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                    </div>
                    <div className={`content ${empresaSelectedOpen ? 'active' : ''}`}>
                        <ul className={`options ${empresaSelectedOpen ? 'active' : ''}`} style={{ opacity: empresaSelectedOpen ? '1' : '0' }}>
                            {empresas && empresas.map((fam: any) => (
                                <li key={fam.id} onClick={() => {
                                    SetEmpresaSelected(fam);
                                    SetEmpresaSelectedOpen(false);
                                    selectAutomaticSuc(fam.id);
                                    handleReturn()
                                }}>
                                    {fam.razon_social}
                                </li>
                            ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
            <div className='col-4'>
                <div className='select__container'>
                    <label className='label__general'>Sucursal</label>
                    <div className={`select-btn ${sucursalSelectedOpen ? 'active' : ''}`} onClick={() => SetSucursalSelectedOpen(!sucursalSelectedOpen)}>
                        <p>{sucursalSelected.id ? sucursales.find((s: { id: number }) => s.id === sucursalSelected.id)?.nombre : 'Selecciona'}</p>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                    </div>
                    <div className={`content ${sucursalSelectedOpen ? 'active' : ''}`}>
                        <ul className={`options ${sucursalSelectedOpen ? 'active' : ''}`} style={{ opacity: sucursalSelectedOpen ? '1' : '0' }}>
                            {sucursales && sucursales.map((fam: any) => (
                                <li key={fam.id} onClick={() => {
                                    SetSucursalSelected(fam);
                                    SetSucursalSelectedOpen(false);
                                    handleReturn()
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
