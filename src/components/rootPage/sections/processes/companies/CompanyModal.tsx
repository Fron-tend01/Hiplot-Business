import React, { useState, useEffect } from 'react';
import { storeCompanies } from '../../../../../zustand/Companies';
import useUserStore from '../../../../../zustand/General';
import { storeViews } from '../../../../../zustand/views';
import APIs from '../../../../../services/services/APIs'
import Swal from 'sweetalert2';
import DynamicVariables from '../../../../../utils/DynamicVariables';
import { useSelectStore } from '../../../../../zustand/Select';
import Select from '../../../Dynamic_Components/Select';
import { useStore } from 'zustand';
import { storeModals } from '../../../../../zustand/Modals';
import './CompanyModal.css'

const CompanyModal = () => {
    // Id del del usuario global
    const setModal = storeModals(state => state.setModal)
    const { modal }: any = useStore(storeModals)

    const setModel = storeCompanies(state => state.setModel)
    const { model }: any = useStore(storeCompanies)



    const userState = useUserStore(state => state.user);
    const user_id = userState.id


    const [formEf, setFormEf] = useState({
        id: 0,
        id_empresa: 0,
        id_franquicia: 0,
        businessEntityID: 0,
        razon_social: ''
    })

    const selectData: any = useSelectStore(state => state.selectedIds)
    const [dataEmpresas, setDataEmpresas] = useState<any>({})


    const [modoUpdate] = useState<boolean>(false)
    const [selectedCompany,] = useState<number | null>(null);

    // Estados de advertencia para validar campos
    // Warning states to validate fields
    const [warningRazonSocial, setWarningRazonSocial] = useState<boolean>(false)
    const [warningNombreComercial, setWarningNombreComercial] = useState<boolean>(false)

    const { getCompaniesXUsers }: any = storeCompanies()
    const { getViews }: any = storeViews()




    const fetch = async () => {
        const data = await getCompaniesXUsers(user_id);
        setDataEmpresas({
            selectName: 'Sucursal Req. Auto',
            dataSelect: data,
            options: 'razon_social'
        })

        getViews(user_id, 'EMPRESAS')
        setModel({ ...model, id_usuario: user_id })
    }

    useEffect(() => {
        fetch()
    }, []);



    useEffect(() => {
        DynamicVariables.updateAnyVar(setFormEf, "id_franquicia", selectData?.franquiciaSelect?.id)
        DynamicVariables.updateAnyVar(setFormEf, "razon_social", selectData?.franquiciaSelect?.razon_social)
    }, [selectData?.franquiciaSelect]);
    // Modal del pop


    const modalCloseCreate = () => {
        setModal('')
        setWarningRazonSocial(false)
        setWarningNombreComercial(false)
    }


    const crear = async (e: React.FormEvent) => {
        e.preventDefault();

        if (model.razon_social === '') {
            setWarningRazonSocial(true)
        } else {
            setWarningRazonSocial(false)
        }
        if (model.nombre_comercial === '') {
            setWarningNombreComercial(true)
        } else {
            setWarningNombreComercial(false)
        }

        if (model.razon_social === '' || model.nombre_comercial === '') {
            return;
        }
        console.log(model);
        
        if (modal == 'modal__update-companies') {
            await APIs.CreateAnyPut(model, "empresa_update/" + model.id)
                .then(async (response: any) => {
                    if (response.error == false) {
                        Swal.fire('Notificación', response.mensaje, 'success');
                        await getCompaniesXUsers(user_id)
                        setModal('')
                    } else {
                        Swal.fire('Notificación', response.mensaje, 'warning');
                    }

                })
                .catch((error: any) => {
                    if (error.response) {
                        if (error.response.status === 409) {
                            Swal.fire(error.mensaje, '', 'warning');
                        } else {
                            Swal.fire('Error al actualizar la empresa', '', 'error');
                        }
                    } else {
                        Swal.fire('Error de conexión.', '', 'error');
                    }
                })
        } else {
            await APIs.CreateAny(model, "empresa_create")
                .then(async (response: any) => {
                    if (response.error == false) {
                        Swal.fire('Notificación', response.mensaje, 'success');
                        await getCompaniesXUsers(user_id)
                        setModal('')
                    } else {
                        Swal.fire('Notificación', response.mensaje, 'warning');
                    }


                })
                .catch((error: any) => {
                    if (error.response) {
                        if (error.response.status === 409) {
                            Swal.fire(error.mensaje, '', 'warning');
                        } else {
                            Swal.fire('Error al actualizar la empresa', '', 'error');
                        }
                    } else {
                        Swal.fire('Error de conexión.', '', 'error');
                    }
                })
        }
    };



    useEffect(() => {

    }, [selectedCompany]);
    const styleWarningRazonSocial = {
        opacity: warningRazonSocial === true ? '1' : '',
        height: warningRazonSocial === true ? '23px' : ''
    }
    const styleWarningSelectNombreComercial = {
        opacity: warningNombreComercial === true ? '1' : '',
        height: warningNombreComercial === true ? '23px' : ''
    }


    return (
        <div className={`overlay__companies ${modal == 'modal__creating-companies' || modal == 'modal__update-companies' ? 'active' : ''}`}>
            <div className={`popup__companies ${modal == 'modal__creating-companies' || modal == 'modal__update-companies' ? 'active' : ''}`}>
                <a href="#" className="btn-cerrar-popup__companies" onClick={modalCloseCreate}>
                    <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                </a>
                <p className='title__modals'>Crear nueva Empresa</p>
                <div className='row my-4 gap-y-4'>
                    <div className='col-6'>
                        <label className='label__general'>Razon Social</label>
                        <div className='warning__general' style={styleWarningRazonSocial}><small >Este campo es obligatorio</small></div>
                        <input className={`inputs__general ${warningRazonSocial ? 'warning' : ''}`} value={model.razon_social} onChange={(e) => DynamicVariables.updateAnyVar(setModel, "razon_social", e.target.value)} type='text' placeholder='Ingresa la direccion' />
                    </div>
                    <div className='col-6'>
                        <label className='label__general'>Nombre Comercial</label>
                        <div className='warning__general' style={styleWarningSelectNombreComercial}><small >Este campo es obligatorio</small></div>
                        <input className={`inputs__general ${warningNombreComercial ? 'warning' : ''}`} value={model.nombre_comercial} onChange={(e) => DynamicVariables.updateAnyVar(setModel, "nombre_comercial", e.target.value)} type='text' placeholder='Ingresa el nombre' />
                    </div>
                    <div className='col-6' title='Base de datos a donde se irá la información de factura y cobros'>
                        <label className='label__general'>Base de datos compaqi comercial</label>
                        <input className={`inputs__general`} value={model.bd_compaqi} onChange={(e) => DynamicVariables.updateAnyVar(setModel, "bd_compaqi", e.target.value)} type='text' placeholder='Compaqi comercial' />
                    </div>
                    <div className='col-6' title='Modulo dentro de la base de datos a donde se irán los CFDI de cobro a franquicias'>
                        <label className='label__general'>Modulo de cobro a franquicias</label>
                        <input className={`inputs__general`} value={model.modulo_cobro_franquicia_compaqi} onChange={(e) => DynamicVariables.updateAnyVar(setModel, "modulo_cobrofranquicia_compaqi", e.target.value)} type='number' placeholder='Modulo de cobro a franquicias' />
                    </div>

                </div>
                <div className='add_franchises'>
                    <div className='title__add_franchises'>
                        <p>AGREGAR FRANQUICIA PARA COBRO</p>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-6'>
                            <label className='label__general'>Franquicia</label>
                            <Select dataSelects={dataEmpresas} instanceId='franquiciaSelect' ></Select>
                        </div>
                        <div className='col-4' title='Este debe ser el ID de cliente de la base de datos agregada con anterioridad'>
                            <label className='label__general'>ID Cliente en Compaqi Comercial</label>
                            <input className={`inputs__general`} value={formEf.businessEntityID} onChange={(e) => DynamicVariables.updateAnyVar(setFormEf, "businessEntityID", parseInt(e.target.value))} type='number' />

                        </div>
                        <div className='col-2 d-flex align-items-end'>
                            <button className='btn__general-purple mr-3' type='button' onClick={() => DynamicVariables.updateAnyVarSetArrNoRepeat(setModel, "empresas_franquicias", formEf)}>Add+</button>
                        </div>
                    </div>

                    <br />
                    <div className='row'>
                        <div className='col-12'>
                            <div className='table__companies'>
                                <div>
                                    <div>
                                        <p className='text'>Tus franquicias-clientes <strong className='number__elemnts'>({model.empresas_franquicias.length})</strong></p>
                                    </div>
                                </div>
                                <div className='table__head'>
                                    <div className='thead'>
                                        <div className='th'>
                                            <p className=''>Razon Social</p>
                                        </div>
                                        <div className='th'>
                                            <p>ID comercial</p>
                                        </div>
                                        <div className='th'>
                                            <p className=''>OPT</p>
                                        </div>
                                    </div>
                                </div>
                                {model.empresas_franquicias ? (
                                    <div className='table__body'>
                                        {model.empresas_franquicias.map((company: any, i: number) => (
                                            <div className='tbody__container' key={i}>
                                                <div className='tbody'>
                                                    <div className='td'>
                                                        <p>{company.razon_social}</p>
                                                    </div>
                                                    <div className='td'>
                                                        <p>{company.businessEntityID}</p>
                                                    </div>
                                                    <div className='td '>
                                                        <button className='btn__delete_users' type="button" onClick={() => {
                                                            DynamicVariables.removeObjectInArrayByKey(setModel, "empresas_franquicias", i);
                                                            { modoUpdate && company.id != 0 ? DynamicVariables.updateAnyVarSetArrNoRepeat(setModel, "empresas_franquicias_remove", company.id) : null }
                                                        }}>Eliminar</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>Cargando datos...</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='create__company_btn_modal_container mt-3'>
                    {modal == 'modal__creating-companies' ?
                        <div>
                            <input className='btn__general-purple' type='submit' value="Crear empresa" onClick={crear} />
                        </div>
                        :
                        <div>
                            <input className='btn__general-purple' type='submit' value="Actualizar empresa" onClick={crear} />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default CompanyModal
