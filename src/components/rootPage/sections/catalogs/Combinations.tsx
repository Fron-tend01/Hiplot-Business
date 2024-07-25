import APIs from '../../../../services/services/APIs'
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react'
import './styles/Families.css'
import '../processes/styles/TypesUsers.css'
import DynamicVariables from '../../../../utils/DynamicVariables';
import '../../../../utils/DynamicVariables';
import { storeCompanies } from '../../../../zustand/Companies';
import { storeBranchOffcies } from '../../../../zustand/BranchOffices';
import useUserStore from '../../../../zustand/General';
import "./styles/Combinaciones.css"

interface Combination {
    id: number;
    nombre: string;
    status: boolean;
    combinaciones_opciones: any[];
    combinaciones_sucursales: any[];
    combinaciones_sucursales_piv: any[];
    opciones_remove: any[];
    sucursales_remove: any[];
}

const Combinations = () => {
    const [modal, setModal] = useState<boolean>(false)
    const [forclear] = useState<Combination>({
        id:0,
        nombre: '',
        status: true,
        combinaciones_opciones: [],
        combinaciones_sucursales: [],
        combinaciones_sucursales_piv: [],
        opciones_remove: [],
        sucursales_remove: []
    });
    const [combination, setCombination] = useState<Combination>({
        id:0,
        nombre: '',
        status: true,
        combinaciones_opciones: [],
        combinaciones_sucursales: [],
        combinaciones_sucursales_piv: [],
        opciones_remove: [],
        sucursales_remove: []
    });
    const [opcionClear] = useState({
        id: 0,
        id_combinacion: 0,
        tipo: 0,
        nombre: '',
        color: ''
    });
    const [opcion, setOpcion] = useState({
        id: 0,
        id_combinacion: 0,
        tipo: 0,
        nombre: '',
        color: ''
    });
    const [warningSelectCompany] = useState<boolean>(false)
    const [warningSelectTipos] = useState<boolean>(false)
    const [selectCompanies, setSelectCompanies] = useState<boolean>(false)
    const [data, setData] = useState<any>(null)
    const [modalUpdate, setModalUpdate] = useState<any>()
    const { getBranchOfficeXCompanies, branchOfficeXCompanies }: any = storeBranchOffcies();
    const [selectedBranchOffice, setselectedBranchOffice] = useState({ id: 0, nombre: '' })
    const [selectBranchOffices, setSelectBranchOffices] = useState<boolean>(false)
    const userState = useUserStore(state => state.user);

    let user_id = userState.id
    const closeModalUpdate = () => {
        setModalUpdate(false)
    }

    const get = async () => {
        let result = await APIs.GetAny("get_combinacion/get")
        setData(result)
    }

    useEffect(() => {
        getCompaniesXUsers(user_id)
        getBranchOfficeXCompanies(0, user_id)
        get()
    }, [])

    const Modal = () => {
        setModal(true)
    }

    const closeModal = () => {
        setModal(false)
    }
    const styleWarningSelectCompanies = {
        transition: 'all 1000ms',
        opacity: warningSelectCompany === true ? '1' : '',
        height: warningSelectCompany === true ? '30px' : ''
    }
    const styleWarningSelectTipos = {
        transition: 'all 1000ms',
        opacity: warningSelectTipos === true ? '1' : '',
        height: warningSelectTipos === true ? '30px' : ''
    }
    const handleCreateCaracteristics = async (e: React.FormEvent) => {
        e.preventDefault();

        await APIs.CreateAny(combination, "create_combinacion/create")
            .then(async (response: any) => {
                Swal.fire(response.mensaje, '', 'success');
                await get()
                setModal(false)
                setCombination({...forclear});
                setOpcion({...opcionClear})
            })
            .catch((error: any) => {
                if (error.response) {
                    if (error.response.status === 409) {
                        Swal.fire(error.mensaje, '', 'warning');
                    } else {
                        Swal.fire('Error al crear la combinacion', '', 'error');
                    }
                } else {
                    Swal.fire('Error de conexión.', '', 'error');
                }
            })
    };

    const [id, setId] = useState<number>()

    const ModalUpdate = (car: any) => {
        setModalUpdate(true)
        setId(car.id)
        setCombination({...forclear});
        setOpcion({...opcionClear})
        console.log(car);
        DynamicVariables.updateAnyVar(setCombination, "id", car.id)
        DynamicVariables.updateAnyVar(setCombination, "nombre", car.nombre)
        DynamicVariables.updateAnyVar(setCombination, "status", car.status)
        car.combinaciones_sucursales.forEach((element:any) => {
            DynamicVariables.updateAnyVarSetArrNoRepeat(setCombination, "combinaciones_sucursales_piv", element)
            DynamicVariables.updateAnyVarSetArrNoRepeat(setCombination, "combinaciones_sucursales", element.id)
        });
        car.combinaciones_opciones.forEach((element:any) => {
            DynamicVariables.updateAnyVarSetArrNoRepeat(setCombination, "combinaciones_opciones", element)
        });
    }



    const handleUpdateCharacteristics = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(combination);
        
        await APIs.CreateAnyPut(combination, "update_combinacion/update")
            .then(async (response: any) => {
                Swal.fire(response.mensaje, '', 'success');
                await get()
                setModalUpdate(false)
            })
            .catch((error: any) => {
                if (error.response) {
                    if (error.response.status === 409) {
                        Swal.fire(error.mensaje, '', 'warning');
                    } else {
                        Swal.fire('Error al actualizar la combinacion', '', 'error');
                    }
                } else {
                    Swal.fire('Error de conexión.', '', 'error');
                }
            })
    }
    const openSelectCompanies = () => {
        setSelectCompanies(!selectCompanies)
    }
    const [selectedCompany, setselectedCompany] = useState({ id: 0, razon_social: '' })
    const { getCompaniesXUsers, companiesXUsers }: any = storeCompanies();
    const handleEmpresaChange = (company: any) => {
        setselectedCompany(company)
        setSelectCompanies(false)
        selectAutomatic(company.id)
    }
    const [filteringBranchOffices, setFilteringBranchOffices] = useState<any>([])
    const handleBranchOfficesChange = (x: any) => {
        setselectedBranchOffice(x)
        setSelectBranchOffices(false)
    }
    const selectAutomatic = (company: any) => {
        let filter = branchOfficeXCompanies.filter((x: any) => x.empresa_id === company)
        setFilteringBranchOffices(filter)
    }

    const addCompany = () => {
        let data = {
            id:0,
            id_empresa: selectedCompany.id,
            razon_social: selectedCompany.razon_social,
            id_sucursal: selectedBranchOffice,
            nombre_sucursal: selectedBranchOffice.nombre
        }
        DynamicVariables.updateAnyVarSetArrNoRepeat(setCombination, "combinaciones_sucursales_piv", data)
        DynamicVariables.updateAnyVarSetArrNoRepeat(setCombination, "combinaciones_sucursales", selectedBranchOffice.id)
    };
    const openSelectBranchOffices = () => {
        setSelectBranchOffices(!selectBranchOffices)
    }
    const tipos_combinaciones = [{
        id: 1,
        nombre: 'Normal',
    }, {
        id: 2,
        nombre: 'Color',
    }]
    const [selectTipos, setSelectTipos] = useState<boolean>(false)
    const openSelectTipos = () => {
        setSelectTipos(!selectTipos)
    }
    const handleTiposChange = (dat: any) => {
        // setSelectedTipos(dat)
        setOpcion(prev => ({ ...prev, tipo: dat }));
        setSelectTipos(false)
    }
    const verificarEliminarSuc = (dat:any) => {
        if (dat.id != 0) {
            DynamicVariables.updateAnyVarSetArrNoRepeat(setCombination, "sucursales_remove", dat.id)
        }
    }
    const verificarEliminarOpt = (dat:any) => {
        if (dat.id != 0) {
            DynamicVariables.updateAnyVarSetArrNoRepeat(setCombination, "opciones_remove", dat.id)
        }
    }

    return (
        <div className='units'>
            <div className='units__container'>
                <div className='btns__create_units'>
                    <button className='btn__general-purple' onClick={Modal}>Crear Combinacion</button>
                </div>
                <div className={`overlay__create_modal_combinations ${modal ? 'active' : ''}`}>
                    <div className={`popup__create_modal_combinations ${modal ? 'active' : ''}`}>
                        <a href="#" className="btn-cerrar-popup__create_modal_combinations" onClick={closeModal}>
                            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                        </a>
                        <p className='title__modals'>Crear nueva combinacion</p>
                        <form className='conatiner__create_modal_combinations' onSubmit={handleCreateCaracteristics}>
                            <div className='row__one'>
                                <div className='inputs__company'>
                                    <label className='label__general'>Nombre</label>
                                    <div className='warning__general'><small >Este campo es obligatorio</small></div>
                                    <input className={`inputs__general`} value={combination.nombre} onChange={(e) => DynamicVariables.updateAnyVar(setCombination, "nombre", e.target.value)} type='text' placeholder='Ingresa la nombre' />
                                </div>
                            </div>
                            <div >

                            </div>
                            <br />
                            <hr />
                            <span> <b> AGREGAR SUCURSALES Y CARACTERISTICAS</b></span>
                            <hr />
                            <br />
                            <div className='row'>
                                <div className='col-6'>
                                    <div className='select__container'>
                                        <label className='label__general'>Empresas</label>
                                        <div className='warning__general' style={styleWarningSelectCompanies}><small >Este campo es obligatorio</small></div>
                                        <div className={`select-btn__general ${warningSelectCompany ? 'warning' : ''}`}>
                                            <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                                                <p>{selectedCompany.id ? companiesXUsers.find((s: { id: number }) => s.id === selectedCompany.id)?.razon_social : 'Selecciona'}</p>
                                                <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                                            </div>
                                            <div className={`content ${selectCompanies ? 'active' : ''}`}>
                                                <ul className={`options ${selectCompanies ? 'active' : ''}`} style={{ opacity: selectCompanies ? '1' : '0' }}>
                                                    {companiesXUsers && companiesXUsers.map((company_id: any) => (
                                                        <li key={company_id.id} onClick={() => handleEmpresaChange(company_id)}>
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
                                                <p>{selectedBranchOffice.id ? filteringBranchOffices.find((s: { id: number }) => s.id === selectedBranchOffice.id)?.nombre : 'Selecciona'}</p>
                                                <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
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
                                    <button className='btn__general-orange' onClick={addCompany} type='button'>Agregar</button>

                                    <div className='table__modal_combinations'>
                                        <div>
                                            {combination.combinaciones_sucursales_piv.length >= 1 ? (
                                                <div>
                                                    <p className='text'>Tus sucursales {combination.combinaciones_sucursales_piv.length}</p>
                                                </div>
                                            ) : (
                                                <p className='text'>No hay sucursales</p>
                                            )}
                                        </div>
                                        <div className='table__head'>
                                            <div className='thead'>
                                                <div className='th'>
                                                    <p className=''>Sucursal</p>
                                                </div>
                                            </div>
                                        </div>
                                        {combination.combinaciones_sucursales_piv.length > 0 ? (
                                            <div className='table__body'>
                                                {combination.combinaciones_sucursales_piv.map((dat, index) => (
                                                    <div className='tbody__container' key={index}>
                                                        <div className='tbody'>
                                                            <div className='td'>
                                                                {dat.nombre_sucursal} ({dat.razon_social})
                                                            </div>
                                                            <div className='td'>
                                                                <button className='btn__delete_users' type="button" onClick={() => {
                                                                    DynamicVariables.removeObjectInArrayByKey(setCombination, "combinaciones_sucursales_piv", index);
                                                                    DynamicVariables.removeObjectInArrayByKey(setCombination, "combinaciones_sucursales", index) // Llama a otra función
                                                                }}>Eliminar</button>
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
                                <div className='col-6'>
                                    <div className='select__container'>
                                        <label className='label__general'>Tipo</label>
                                        <div className='warning__general' style={styleWarningSelectTipos}><small >Este campo es obligatorio</small></div>
                                        <div className={`select-btn__general ${warningSelectTipos ? 'warning' : ''}`}>
                                            <div className={`select-btn ${selectTipos ? 'active' : ''}`} onClick={openSelectTipos}>
                                                <p>{opcion.tipo ? tipos_combinaciones.find((s: { id: number }) => s.id === opcion.tipo)?.nombre : 'Selecciona'}</p>
                                                <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                                            </div>
                                            <div className={`content ${selectTipos ? 'active' : ''}`}>
                                                <ul className={`options ${selectTipos ? 'active' : ''}`} style={{ opacity: selectTipos ? '1' : '0' }}>
                                                    {tipos_combinaciones && tipos_combinaciones.map((company_id: any) => (
                                                        <li key={company_id.id} onClick={() => handleTiposChange(company_id.id)}>
                                                            {company_id.nombre}
                                                        </li>
                                                    ))
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='select__container'>
                                        <div className='inputs__company'>
                                            <label className='label__general'>Nombre de Caracteristica</label>
                                            <div className='warning__general'><small >Este campo es obligatorio</small></div>
                                            <input className={`inputs__general`} value={opcion.nombre} onChange={(e) => DynamicVariables.updateAnyVar(setOpcion, "nombre", e.target.value)} type='text' placeholder='Ingresa la nombre' />
                                        </div>
                                    </div>
                                    {opcion.tipo == 2 ? (
                                        <div className='select__container'>
                                            <div className='inputs__company'>
                                                <label className='label__general'>Color</label>
                                                <input type="color" value={opcion.color} onChange={(e) => DynamicVariables.updateAnyVar(setOpcion, "color", e.target.value)} />

                                            </div>
                                        </div>
                                    ) : ("")}

                                    <button className='btn__general-orange' onClick={() => DynamicVariables.updateAnyVarSetArr(setCombination, "combinaciones_opciones", opcion)} type='button'>Agregar</button>
                                    <div className='table__families'>
                                        <div>
                                            {combination.combinaciones_opciones.length >= 1 ? (
                                                <div>
                                                    <p className='text'>Tus Caracteristicas {combination.combinaciones_opciones.length}</p>
                                                </div>
                                            ) : (
                                                <p className='text'>No hay Caracteristicas</p>
                                            )}
                                        </div>
                                        <div className='table__head'>
                                            <div className='thead'>
                                                <div className='th'>
                                                    <p className=''>Nombre</p>
                                                </div>
                                                <div className='th'>
                                                    <p className=''>Nombre</p>
                                                </div>
                                                <div className='th'>
                                                    <p className=''>Nombre</p>
                                                </div>
                                            </div>
                                        </div>
                                        {combination.combinaciones_opciones.length > 0 ? (
                                            <div className='table__body'>
                                                {combination.combinaciones_opciones.map((dat: any, index: number) => (
                                                    <div className='tbody__container' key={index}>
                                                        <div className='tbody'>
                                                            <div className='td'>
                                                                {dat.nombre}
                                                            </div>
                                                            <div className='td'>
                                                                <button className='btn__delete_users' type="button" onClick={() => DynamicVariables.removeObjectInArrayByKey(setCombination, "combinaciones_opciones", index)}>Eliminar</button>
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

                            </div>
                            <div className='table__update_families' >

                            </div>
                            <div className='create__units_btn_modal'>
                                <div>
                                    <input className='btn__general-purple' type='submit' value="Crear caracteristica" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className='table__units' >
                    <div>
                        {data ? (
                            <div>
                                <p className='text'>Tus combinaciones {data.length}</p>
                            </div>
                        ) : (
                            <p>No hay combinaciones</p>
                        )}
                    </div>
                    <div className='table__head'>
                        <div className='thead'>
                            <div className='th'>
                                <p className=''>Nombre</p>
                            </div>
                            <div className='th'>
                                <p>Status</p>
                            </div>
                        </div>
                    </div>
                    {data ? (
                        <div className='table__body'>
                            {data.map((car: any) => {
                                return (
                                    <div className='tbody__container' key={car.id}>
                                        <div className='tbody'>
                                            <div className='td'>
                                                <p>{car.nombre}</p>
                                            </div>
                                            <div className='td'>
                                                {car.status == true ? "ACTIVO" : "INACTIVO"}
                                            </div>
                                            <div className='td'>
                                                <button className='branchoffice__edit_btn' onClick={() => ModalUpdate(car)}>Editar</button>
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

                <div className={`overlay__create_modal_combinations ${modalUpdate ? 'active' : ''}`}>
                    <div className={`popup__create_modal_combinations ${modalUpdate ? 'active' : ''}`}>
                        <a href="#" className="btn-cerrar-popup__create_modal_combinations" onClick={closeModalUpdate}>
                            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                        </a>
                        <p className='title__modals'>Actualizar Combinación</p>
                        <form className='conatiner__create_modal_combinations' onSubmit={handleUpdateCharacteristics}>
                            <div className='row'>
                                <div className='col-11'>
                                    <div className='inputs__company'>
                                        <label className='label__general'>Nombre</label>
                                        <div className='warning__general'><small >Este campo es obligatorio</small></div>
                                        <input className={`inputs__general`} value={combination.nombre} onChange={(e) => DynamicVariables.updateAnyVar(setCombination, "nombre", e.target.value)} type='text' placeholder='Ingresa la nombre' />
                                    </div>
                                </div>
                                <div className='col-1'>
                                    
                                        <label>Status</label>
                                        <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={combination.status} // Asignar el valor del estado al atributo 'checked'
                                            onChange={(e) => {DynamicVariables.updateAnyVar(setCombination, "status", e.target.checked);console.log(e.target.value)}}
                                        />
                                        <span className="slider"></span>
                                        </label>
                                </div>
                            </div>
                            <br />
                            <hr />
                            <span> <b> AGREGAR SUCURSALES Y CARACTERISTICAS</b></span>
                            <hr />
                            <br />
                            <div className='row'>
                                <div className='col-6'>
                                    <div className='select__container'>
                                        <label className='label__general'>Empresas</label>
                                        <div className='warning__general' style={styleWarningSelectCompanies}><small >Este campo es obligatorio</small></div>
                                        <div className={`select-btn__general ${warningSelectCompany ? 'warning' : ''}`}>
                                            <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                                                <p>{selectedCompany.id ? companiesXUsers.find((s: { id: number }) => s.id === selectedCompany.id)?.razon_social : 'Selecciona'}</p>
                                                <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                                            </div>
                                            <div className={`content ${selectCompanies ? 'active' : ''}`}>
                                                <ul className={`options ${selectCompanies ? 'active' : ''}`} style={{ opacity: selectCompanies ? '1' : '0' }}>
                                                    {companiesXUsers && companiesXUsers.map((company_id: any) => (
                                                        <li key={company_id.id} onClick={() => handleEmpresaChange(company_id)}>
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
                                                <p>{selectedBranchOffice.id ? filteringBranchOffices.find((s: { id: number }) => s.id === selectedBranchOffice.id)?.nombre : 'Selecciona'}</p>
                                                <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
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
                                    <button className='btn__general-orange' onClick={addCompany} type='button'>Agregar</button>

                                    <div className='table__modal_combinations'>
                                        <div>
                                            {combination.combinaciones_sucursales_piv.length >= 1 ? (
                                                <div>
                                                    <p className='text'>Tus sucursales {combination.combinaciones_sucursales_piv.length}</p>
                                                </div>
                                            ) : (
                                                <p className='text'>No hay sucursales</p>
                                            )}
                                        </div>
                                        <div className='table__head'>
                                            <div className='thead'>
                                                <div className='th'>
                                                    <p className=''>Sucursal</p>
                                                </div>
                                            </div>
                                        </div>
                                        {combination.combinaciones_sucursales_piv.length > 0 ? (
                                            <div className='table__body'>
                                                {combination.combinaciones_sucursales_piv.map((dat, index) => (
                                                    <div className='tbody__container' key={index}>
                                                        <div className='tbody'>
                                                            <div className='td'>
                                                                {dat.nombre_sucursal} ({dat.razon_social})
                                                            </div>
                                                            <div className='td'>
                                                                <button className='btn__delete_users' type="button" onClick={() => {
                                                                    verificarEliminarSuc(dat);
                                                                    DynamicVariables.removeObjectInArrayByKey(setCombination, "combinaciones_sucursales_piv", index);
                                                                    DynamicVariables.removeObjectInArrayByKey(setCombination, "combinaciones_sucursales", index);
                                                                }}>Eliminar</button>
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
                                <div className='col-6'>
                                    <div className='select__container'>
                                        <label className='label__general'>Tipo</label>
                                        <div className='warning__general' style={styleWarningSelectTipos}><small >Este campo es obligatorio</small></div>
                                        <div className={`select-btn__general ${warningSelectTipos ? 'warning' : ''}`}>
                                            <div className={`select-btn ${selectTipos ? 'active' : ''}`} onClick={openSelectTipos}>
                                                <p>{opcion.tipo ? tipos_combinaciones.find((s: { id: number }) => s.id === opcion.tipo)?.nombre : 'Selecciona'}</p>
                                                <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                                            </div>
                                            <div className={`content ${selectTipos ? 'active' : ''}`}>
                                                <ul className={`options ${selectTipos ? 'active' : ''}`} style={{ opacity: selectTipos ? '1' : '0' }}>
                                                    {tipos_combinaciones && tipos_combinaciones.map((company_id: any) => (
                                                        <li key={company_id.id} onClick={() => handleTiposChange(company_id.id)}>
                                                            {company_id.nombre}
                                                        </li>
                                                    ))
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='select__container'>
                                        <div className='inputs__company'>
                                            <label className='label__general'>Nombre de Caracteristica</label>
                                            <div className='warning__general'><small >Este campo es obligatorio</small></div>
                                            <input className={`inputs__general`} value={opcion.nombre} onChange={(e) => DynamicVariables.updateAnyVar(setOpcion, "nombre", e.target.value)} type='text' placeholder='Ingresa la nombre' />
                                        </div>
                                    </div>
                                    {opcion.tipo == 2 ? (
                                        <div className='select__container'>
                                            <div className='inputs__company'>
                                                <label className='label__general'>Color</label>
                                                <input type="color" value={opcion.color} onChange={(e) => DynamicVariables.updateAnyVar(setOpcion, "color", e.target.value)} />

                                            </div>
                                        </div>
                                    ) : ("")}

                                    <button className='btn__general-orange' onClick={() => DynamicVariables.updateAnyVarSetArr(setCombination, "combinaciones_opciones", opcion)} type='button'>Agregar</button>
                                    <div className='table__families'>
                                        <div>
                                            {combination.combinaciones_opciones.length >= 1 ? (
                                                <div>
                                                    <p className='text'>Tus Caracteristicas {combination.combinaciones_opciones.length}</p>
                                                </div>
                                            ) : (
                                                <p className='text'>No hay Caracteristicas</p>
                                            )}
                                        </div>
                                        <div className='table__head'>
                                            <div className='thead'>
                                                <div className='th'>
                                                    <p className=''>Nombre</p>
                                                </div>
                                                <div className='th'>
                                                    <p className=''>Nombre</p>
                                                </div>
                                                <div className='th'>
                                                    <p className=''>Nombre</p>
                                                </div>
                                            </div>
                                        </div>
                                        {combination.combinaciones_opciones.length > 0 ? (
                                            <div className='table__body'>
                                                {combination.combinaciones_opciones.map((dat: any, index: number) => (
                                                    <div className='tbody__container' key={index}>
                                                        <div className='tbody'>
                                                            <div className='td'>
                                                                {dat.nombre}
                                                            </div>
                                                            <div className='td'>
                                                                <button className='btn__delete_users' type="button" onClick={() => {
                                                                    verificarEliminarOpt(dat); 
                                                                    DynamicVariables.removeObjectInArrayByKey(setCombination, "combinaciones_opciones", index)
                                                                    }}>Eliminar</button>
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

                            </div>
                            <div className='table__update_families' >

                            </div>
                            <div className='create__units_btn_modal'>
                                <div>
                                    <input className='btn__general-purple' type='submit' value="Crear caracteristica" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                {/* <div className={`overlay__update_units ${modalUpdate ? 'active' : ''}`}>
                    <div className={`popup__update_units ${modalUpdate ? 'active' : ''}`}>
                        <a href="#" className="btn-cerrar-popup__update_units" onClick={closeModalUpdate}>
                            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                        </a>
                        <p className='title__modals'>Actualizar caracteristicas</p>
                        <form className='conatiner__update_units' onSubmit={handleUpdateCharacteristics}>
                            <div className='row__one'>
                                <div className='inputs__company'>
                                    <label className='label__general'>Nombre</label>
                                    <div className='warning__general'><small >Este campo es obligatorio</small></div>
                                    <input className={`inputs__general`} value={combination.nombre} type='text' placeholder='Ingresa la nombre' />
                                </div>
                                <div className='inputs__company'>
                                    <label className='label__general'>Status</label>
                                    <label className="switch">
                                        <input
                                            type="checkbox" checked={combination.status} onChange={(e) => DynamicVariables.updateAnyVar(setCombination, "status", e.target.value)} />
                                        <span className="slider"></span>
                                    </label>

                                </div>
                            </div>
                            <div className='create__units_btn_modal'>
                                <div>
                                    <input className='btn__general-purple' type='submit' value="Actualizar caracteristica" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default Combinations