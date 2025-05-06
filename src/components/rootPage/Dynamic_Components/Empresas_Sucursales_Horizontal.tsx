import { useEffect, useState, useRef } from 'react'
import { companiesRequests } from '../../../fuctions/Companies';
import useUserStore from '../../../zustand/General';
import { BranchOfficesRequests } from '../../../fuctions/BranchOffices';

const Empresas_Sucursales = (props: any) => {
    const { modeUpdate, empresaDyn, sucursalDyn, setEmpresaDyn, setSucursalDyn, all = false, blocked, just_empresa = false, nombre_label_empresa = 'Empresa' } = props

    const { getCompaniesXUsers }: any = companiesRequests();
    const [empresas, setEmpresas] = useState<any>([]);
    const [empresaSelectedOpen, SetEmpresaSelectedOpen] = useState<boolean>(false);

    const { getBranchOffices }: any = BranchOfficesRequests();
    const [sucursales, setSucursales] = useState<any>([]);
    const [sucursalSelectedOpen, SetSucursalSelectedOpen] = useState<boolean>(false);

    const empresaRef = useRef<HTMLDivElement>(null);
    const sucursalRef = useRef<HTMLDivElement>(null);

    const userState = useUserStore(state => state.user);
    const user_id = userState.id;

    const fetch = async () => {
        const resultCompanies = await getCompaniesXUsers(user_id);
        if (all) {
            resultCompanies.unshift({ razon_social: 'Todos', id: 0 });
        }
        setEmpresas(resultCompanies);
        await setEmpresaDyn(resultCompanies[0]);

        if (!just_empresa) {
            const resultBranch = await getBranchOffices(resultCompanies[0].id, user_id);
            if (all) {
                resultBranch.unshift({ nombre: 'Todos', id: 0 });
            }
            setSucursales(resultBranch);
            await setSucursalDyn(resultBranch[0]);
        }
    };

    useEffect(() => {
        fetch();
    }, [modeUpdate]);

    const handleClickOutside = (event: MouseEvent) => {
        if (empresaRef.current && !empresaRef.current.contains(event.target as Node)) {
            SetEmpresaSelectedOpen(false);
        }
        if (sucursalRef.current && !sucursalRef.current.contains(event.target as Node)) {
            SetSucursalSelectedOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const selectAutomaticSuc = async (company: any) => {
        if (!just_empresa) {
            const resultBranch = await getBranchOffices(company, user_id);
            if (all) {
                resultBranch.unshift({ nombre: 'Todos', id: 0 });
            }
            setSucursales(resultBranch);
            setSucursalDyn(resultBranch[0]);
        }
    };

    return (
        <div className="esh__row">
        <div className="esh__select-wrapper" ref={empresaRef}>
            <label className="esh__label">{nombre_label_empresa}</label>
            <div className="esh__select">
                <div className="select-btn__general">
                    <div className={`select-btn ${empresaSelectedOpen ? 'active' : ''}`} onClick={() => { !blocked && SetEmpresaSelectedOpen(!empresaSelectedOpen) }}>
                        <div className="select__container_title">
                            <p>{empresaDyn?.id ? empresas?.find((s: { id: number }) => s.id === empresaDyn?.id)?.razon_social : all ? 'Todos' : 'Seleccionar'}</p>
                        </div>
                        <svg className="chevron__down" xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
                            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                        </svg>
                    </div>
                    <div className={`content ${empresaSelectedOpen ? 'active' : ''}`}>
                        <ul className={`options ${empresaSelectedOpen ? 'active' : ''}`} style={{ opacity: empresaSelectedOpen ? '1' : '0' }}>
                            {empresas?.map((fam: any) => (
                                <li key={fam.id} onClick={() => {
                                    SetEmpresaSelectedOpen(false);
                                    selectAutomaticSuc(fam.id);
                                    setEmpresaDyn(fam);
                                }}>
                                    {fam.razon_social}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    
        {!just_empresa && (
            <div className="esh__select-wrapper" ref={sucursalRef}>
                <label className="esh__label">Sucursal</label>
                <div className="esh__select">
                    <div className="select-btn__general">
                        <div className={`select-btn ${sucursalSelectedOpen ? 'active' : ''}`} onClick={() => { !blocked && SetSucursalSelectedOpen(!sucursalSelectedOpen) }}>
                            <div className="select__container_title">
                                <p>{sucursalDyn?.id ? sucursales?.find((s: { id: number }) => s.id === sucursalDyn?.id)?.nombre : all ? 'Todos' : 'Seleccionar'}</p>
                            </div>
                            <svg className="chevron__down" xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
                                <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                            </svg>
                        </div>
                        <div className={`content ${sucursalSelectedOpen ? 'active' : ''}`}>
                            <ul className={`options ${sucursalSelectedOpen ? 'active' : ''}`} style={{ opacity: sucursalSelectedOpen ? '1' : '0' }}>
                                {sucursales?.map((fam: any) => (
                                    <li key={fam.id} onClick={() => {
                                        SetSucursalSelectedOpen(false);
                                        setSucursalDyn(fam);
                                    }}>
                                        {fam.nombre}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
    
    );
};

export default Empresas_Sucursales;
