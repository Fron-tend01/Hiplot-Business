import { useEffect, useState } from 'react'
import { companiesRequests } from '../../../fuctions/Companies';
import useUserStore from '../../../zustand/General';
import { BranchOfficesRequests } from '../../../fuctions/BranchOffices';


const Empresas_Sucursales = (props: any) => {
    const { modeUpdate, empresaDyn, sucursalDyn, setEmpresaDyn, setSucursalDyn, all = false, blocked, just_empresa = false, nombre_label_empresa = 'Empresa' } = props

    // const setEmpresa = storeDv(state => state.setEmpresa)
    // // const { empresa, sucursal }: any = useStore(storeDv)

    // const setSucursal = storeDv(state => state.setSucursal)
    // // const {sucursal} = useStore(storeDv)

    const { getCompaniesXUsers }: any = companiesRequests()
    const [empresas, setEmpresas] = useState<any>([])
    const [empresaSelectedOpen, SetEmpresaSelectedOpen] = useState<boolean>(false)

    const { getBranchOffices }: any = BranchOfficesRequests()
    const [sucursales, setSucursales] = useState<any>([])
    const [sucursalSelectedOpen, SetSucursalSelectedOpen] = useState<boolean>(false)

    const userState = useUserStore(state => state.user);
    const user_id = userState.id

    const fetch = async () => {
        const resultCompanies = await getCompaniesXUsers(user_id)
        if (all) {
            resultCompanies.unshift({ razon_social: 'Todos', id: 0 });
        }
        setEmpresas(resultCompanies)
        await setEmpresaDyn(resultCompanies[0])
        if(!just_empresa) {
            const resultBranch = await getBranchOffices(resultCompanies[0].id, user_id)
            if (all) {
                resultBranch.unshift({ nombre: 'Todos', id: 0 });
            }
            setSucursales(resultBranch)
            await setSucursalDyn(resultBranch[0])
        }
    }

    useEffect(() => {
        fetch()
    }, [])

    const fetch2 = async () => {
        const resultCompanies = await getCompaniesXUsers(user_id)

        setEmpresas(resultCompanies)
        // setEmpresa(resultCompanies[0])
        if (!just_empresa) {
            const resultBranch = await getBranchOffices(empresaDyn.id, user_id)
            setSucursales(resultBranch)

        }
        // setSucursal(resultBranch[0])
    }
    useEffect(() => {
        if (modeUpdate) {
            fetch2()
            console.log('yes');

        }
    }, [empresaDyn, sucursalDyn])



    const selectAutomaticSuc = async (company: any) => {
        if (!just_empresa) {
            const resultBranch = await getBranchOffices(company, user_id)
            if (all) {
                resultBranch.unshift({ nombre: 'Todos', id: 0 });
            }
            setSucursales(resultBranch)
            setSucursalDyn(resultBranch[0])

        }
    }
    return (
        <div className='row'>
            {just_empresa ?
                <div className='col-12 sm-col-12'>
                    <div className='select__container'>
                        <label className='label__general'>{nombre_label_empresa}</label>
                        <div className='select-btn__general'>
                            <div className={`select-btn ${empresaSelectedOpen ? 'active' : ''}`} onClick={() => { blocked == undefined ? SetEmpresaSelectedOpen(!empresaSelectedOpen) : null }}>
                                <div className='select__container_title'>
                                    <p>{empresaDyn?.id ? empresas.find((s: { id: number }) => s.id === empresaDyn?.id)?.razon_social : all ? 'Todos' : 'Seleccionar'}</p>
                                </div>
                                <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                            </div>
                            <div className={`content ${empresaSelectedOpen ? 'active' : ''}`}>
                                <ul className={`options ${empresaSelectedOpen ? 'active' : ''}`} style={{ opacity: empresaSelectedOpen ? '1' : '0' }}>

                                    {empresas && empresas.map((fam: any) => (
                                        <li key={fam.id} onClick={() => {
                                            SetEmpresaSelectedOpen(false);
                                            selectAutomaticSuc(fam.id);
                                            setEmpresaDyn(fam)
                                        }}>
                                            {fam.razon_social}
                                        </li>
                                    ))
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <>
                    <div className='col-6 sm-col-12'>
                        <div className='select__container'>
                            <label className='label__general'>Empresa</label>
                            <div className='select-btn__general'>
                                <div className={`select-btn ${empresaSelectedOpen ? 'active' : ''}`} onClick={() => { blocked == undefined ? SetEmpresaSelectedOpen(!empresaSelectedOpen) : null }}>
                                    <div className='select__container_title'>
                                        <p>{empresaDyn?.id ? empresas.find((s: { id: number }) => s.id === empresaDyn?.id)?.razon_social : all ? 'Todos' : 'Seleccionar'}</p>
                                    </div>
                                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                                </div>
                                <div className={`content ${empresaSelectedOpen ? 'active' : ''}`}>
                                    <ul className={`options ${empresaSelectedOpen ? 'active' : ''}`} style={{ opacity: empresaSelectedOpen ? '1' : '0' }}>

                                        {empresas && empresas.map((fam: any) => (
                                            <li key={fam.id} onClick={() => {
                                                SetEmpresaSelectedOpen(false);
                                                selectAutomaticSuc(fam.id);
                                                setEmpresaDyn(fam)
                                            }}>
                                                {fam.razon_social}
                                            </li>
                                        ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-6 sm-col-12'>
                        <div className='select__container'>
                            <label className='label__general'>Sucursal</label>

                            <div className='select-btn__general'>
                                <div className={`select-btn ${sucursalSelectedOpen ? 'active' : ''}`} onClick={() => { blocked == undefined ? SetSucursalSelectedOpen(!sucursalSelectedOpen) : null }}>
                                    <div className='select__container_title'>
                                        <p>{sucursalDyn?.id ? sucursales.find((s: { id: number }) => s.id === sucursalDyn?.id)?.nombre : all ? 'Todos' : 'Seleccionar'}</p>
                                    </div>
                                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                                </div>
                                <div className={`content ${sucursalSelectedOpen ? 'active' : ''}`}>
                                    <ul className={`options ${sucursalSelectedOpen ? 'active' : ''}`} style={{ opacity: sucursalSelectedOpen ? '1' : '0' }}>
                                        {sucursales && sucursales.map((fam: any) => (
                                            <li key={fam.id} onClick={() => {
                                                SetSucursalSelectedOpen(false);
                                                setSucursalDyn(fam)
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
                </>
            }
        </div>
    )
}

export default Empresas_Sucursales
