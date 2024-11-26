import React, { useEffect, useState } from 'react'
import { storeModals } from '../../../../../zustand/Modals'
import useUserStore from '../../../../../zustand/General'
import AddBranchOffices from './AddBranchOffices'
import { useStore } from 'zustand'
import { storeClients } from '../../../../../zustand/Clients'
import APIs from '../../../../../services/services/APIs'
import Swal from 'sweetalert2';
import './ModalCreate.css'
import DynamicVariables from '../../../../../utils/DynamicVariables'

const ModalCreate = () => {


    const { addBranchClients, clientToUpdate, branchClientsRemove }: any = useStore(storeClients)


    const setModal = storeModals(state => state.setModal)
    const setModalSub = storeModals(state => state.setModalSub)
    const { modal }: any = storeModals()
    const setAddBranchClients = storeClients(state => state.setAddBranchClients)

    const [pj] = useState<any>([
        {
            id: 0,
            nombre: 'Persona Moral'
        },
        {
            id: 1,
            nombre: 'Persona Fisica'
        }
    ])
    const [divisas] = useState<any>([
        {
            id: 0,
            nombre: 'Peso Mexicano'
        },
        {
            id: 1,
            nombre: 'US Dolar'
        },
        {
            id: 2,
            nombre: 'Euro'
        }
    ])
    const [categorias] = useState<any>([
        {
            id: 0,
            nombre: 'Empresa'
        },
        {
            id: 1,
            nombre: 'Publico en General'
        },
        {
            id: 2,
            nombre: 'Gobierno'
        },
        {
            id: 3,
            nombre: 'Cliente por Identificar'
        },
        {
            id: 4,
            nombre: 'Parte Relacionada'
        },
        {
            id: 5,
            nombre: 'Socio, accionista o representante legal'
        },
        {
            id: 6,
            nombre: 'Otro'
        }
    ])
    const [rf, setRf] = useState<any>([])
    const [uc, setUc] = useState<any>([])
    const [inputs, setInputs] = useState({
        razon_social: "",
        nombre_comercial: "",
        nombre_contacto: "",
        correo: "",
        rfc: "",
        persona_juridica: 0,
        divisa: 0,
        uso_cfdi: 0,
        regimen_fiscal: 0,
        categoria: 0,
        status: true,
        estado: "",
        municipio: "",
        colonia: "",
        calle: "",
        no_interior: "",
        no_exterior: "",
        codigo_postal: "",
        clientes_sucursal: [],
        sucursales_remove: []
    });
    const [inputsClear] = useState({
        razon_social: "",
        nombre_comercial: "",
        nombre_contacto: "",
        correo: "",
        rfc: "",
        persona_juridica: 0,
        divisa: 0,
        uso_cfdi: 0,
        regimen_fiscal: 0,
        categoria: 0,
        status: true,
        estado: "",
        municipio: "",
        colonia: "",
        calle: "",
        no_interior: "",
        no_exterior: "",
        codigo_postal: "",
        clientes_sucursal: [],
        sucursales_remove: []

    });
    useEffect(() => {
        console.log(clientToUpdate)
        // setInputs(clientToUpdate)
        getRefs()
    }, [])
    useEffect(() => {
        console.log(clientToUpdate)
        if (modal == 'update_clients') {
            setInputs(clientToUpdate)
            setAddBranchClients(clientToUpdate.clientes_sucursal)
        } else {
            setInputs(inputsClear)
            setAddBranchClients([])
        }
    }, [modal])
    const getRefs = async () => {
        let result: any = await APIs.GetAny("getUsoCfdi")
        setUc(result)
        let res: any = await APIs.GetAny("getRegimenFiscal")
        setRf(res)
        DynamicVariables.updateAnyVar(setInputs, "uso_cfdi", result[0].ID)
        DynamicVariables.updateAnyVar(setInputs, "regimen_fiscal", res[0].ID)
    }




    const handleInputs = (event: any) => {
        const { name, value, type, checked } = event.target;
        setInputs((prevInputs: any) => ({
            ...prevInputs,
            [name]: type === 'checkbox' ? checked : name in prevInputs && typeof prevInputs[name] === 'number' ? Number(value) : value,
        }));
    };

    useEffect(() => {
        DynamicVariables.updateAnyVar(setInputs, "clientes_sucursal", addBranchClients)
    }, [addBranchClients])
    useEffect(() => {
        DynamicVariables.updateAnyVar(setInputs, "sucursales_remove", branchClientsRemove)
    }, [branchClientsRemove])

    const handleCreateClients = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            if (modal == 'update_clients') {
                try {
                    await APIs.updateClients(inputs)
                    setInputs(inputsClear)
                    setModal(false)
                    Swal.fire('Cliente actualizado exitosamente', '', 'success');
                    return
                } catch (error) {
                    Swal.fire('Error', 'Hubo un error al actualizar el cliente', 'error');
                    return
                }

            }
            await APIs.createClients(inputs)
            Swal.fire('Cliente creado exitosamente', '', 'success');
            setInputs(inputsClear)
            setModal(false)

        } catch (error) {
            Swal.fire('Error', 'Hubo un error al crear el cliente', 'error');
            console.error('Error creating Clients', error);
        }

    }


    return (
        <div className={`overlay__create_modal_clients ${modal == 'create_clients' || modal == 'update_clients' ? 'active' : ''}`}>
            <div className={`popup__create_modal_clients ${modal == 'create_clients' || modal == 'update_clients' ? 'active' : ''}`}>
                <div className='header__modal'>
                    <a href="#" className="btn-cerrar-popup__create_modal_clients" onClick={() => setModal('')} >
                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                    </a>
                    {modal == 'update_clients' ?
                        <p className='title__modals'>Actualizar cliente</p>
                        :
                        <p className='title__modals'>Crear cliente</p>
                    }
                </div>


                <form className='modal_clients' onSubmit={handleCreateClients}>
                    <div className='row__one'>
                        <small className='title'><b>INFORMACIÓN GENERAL</b></small>
                        <div className='row__one'>
                            <div className=''>
                                <small >Razón Social</small>
                                <div className='warning__general'><small>Este campo es obligatorio</small></div>
                                <input name="razon_social" className='inputs__general' type="text" value={inputs.razon_social} onChange={handleInputs} placeholder='Ingresa la razón social' />
                            </div>
                            <div className=''>
                                <small >Nombre Comercial</small>
                                <div className='warning__general'><small>Este campo es obligatorio</small></div>
                                <input name="nombre_comercial" className='inputs__general' type="text" value={inputs.nombre_comercial} onChange={handleInputs} placeholder='Ingresa el nombre comercial' />
                            </div>
                            <div className='' title='Activo / Inactivo'>
                                <small >Status</small>
                                <div className='warning__general'><small>Este campo es obligatorio</small></div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={inputs.status} // Asignar el valor del estado al atributo 'checked'
                                        onChange={handleInputs}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                        </div>
                        <div className='row__two '>
                            <div className=''>
                                <small >RFC</small>
                                <div className='warning__general'><small>Este campo es obligatorio</small></div>
                                <input name="rfc" className='inputs__general' type="text" value={inputs.rfc} onChange={handleInputs} placeholder='Ingresa el RFC' />
                            </div>
                            <div className=''>
                                <small >Nombre Contacto</small>
                                <div className='warning__general'><small>Este campo es obligatorio</small></div>
                                <input name="nombre_contacto" className='inputs__general' type="text" value={inputs.nombre_contacto} onChange={handleInputs} placeholder='Ingresa el nombre de contacto' />
                            </div>
                            <div className=''>
                                <small >Correo</small>
                                <div className='warning__general'><small>Este campo es obligatorio</small></div>
                                <input name="correo" className='inputs__general' type="email" value={inputs.correo} onChange={handleInputs} placeholder='Ingresa el correo' />
                            </div>
                            <div className='d-flex align-items-end'>
                                <button title='Este botón habilitará el cliente a tus diferentes sucursales' type='button' className='btn__general-orange' onClick={() => setModalSub('modal-sub_create_clients')}>Habilitar a Sucursales</button>

                            </div>
                        </div>
                    </div>
                    <div className='container__cards'>
                        <div className='tax__information mb-4'>
                            <div className='title'><p>INFORMACIÓN FISCAL</p></div>
                            <div className='row align-txt-left'>
                                <div className='col-4 md-col-6 sm-col-12'>
                                    <small >Persona Jurídica</small>
                                    <select className='inputs__general' value={inputs.persona_juridica} onChange={(e) => DynamicVariables.updateAnyVar(setInputs, "persona_juridica", parseInt(e.target.value))}>
                                        {pj.map((dat: any) => (
                                            <option value={dat.id}> {dat.nombre} </option>
                                        ))}
                                    </select>
                                </div>
                                <div className='col-4 md-col-6 sm-col-12'>
                                    <small >Divisa</small>
                                    <select className='inputs__general' value={inputs.divisa} onChange={(e) => DynamicVariables.updateAnyVar(setInputs, "divisa", parseInt(e.target.value))}>
                                        {divisas.map((dat: any) => (
                                            <option value={dat.id}> {dat.nombre} </option>
                                        ))}
                                    </select>
                                </div>
                                <div className='col-4 md-col-6 sm-col-12'>
                                    <small >Uso CFDI</small>
                                    <select className='inputs__general' value={inputs.uso_cfdi} onChange={(e) => DynamicVariables.updateAnyVar(setInputs, "uso_cfdi", parseInt(e.target.value))}>
                                        {uc.map((dat: any) => (
                                            <option value={dat.ID}> {dat.Value} </option>
                                        ))}
                                    </select>
                                </div>
                                <div className='col-4 md-col-6 sm-col-12'>
                                    <small >Régimen Fiscal</small>
                                    <select className='inputs__general' value={inputs.regimen_fiscal} onChange={(e) => DynamicVariables.updateAnyVar(setInputs, "regimen_fiscal", parseInt(e.target.value))}>
                                        {rf.map((dat: any) => (
                                            <option value={dat.ID}> {dat.Value} </option>
                                        ))}
                                    </select>
                                </div>
                                <div className='col-4 md-col-6 sm-col-12'>
                                    <small >Categoría</small>
                                    <select className='inputs__general' value={inputs.categoria} onChange={(e) => DynamicVariables.updateAnyVar(setInputs, "categoria", parseInt(e.target.value))}>
                                        {categorias.map((dat: any) => (
                                            <option value={dat.id}> {dat.nombre} </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className='address'>
                            <div className='title'><p>DIRECCIÓN</p></div>

                            <div className='row'>
                                <div className='col-4 md-col-6 sm-col-12'>
                                    <small >Estado</small>
                                    <div className='warning__general'><small>Este campo es obligatorio</small></div>
                                    <input name="estado" className='inputs__general' type="text" value={inputs.estado} onChange={handleInputs} placeholder='Estado' />
                                </div>
                                <div className='col-4 md-col-6 sm-col-12'>
                                    <small >Municipio</small>
                                    <div className='warning__general'><small>Este campo es obligatorio</small></div>
                                    <input name="municipio" className='inputs__general' type="text" value={inputs.municipio} onChange={handleInputs} placeholder='Municipio' />
                                </div>
                                <div className='col-4 md-col-6 sm-col-12'>
                                    <small >Colonia</small>
                                    <div className='warning__general'><small>Este campo es obligatorio</small></div>
                                    <input name="colonia" className='inputs__general' type="text" value={inputs.colonia} onChange={handleInputs} placeholder='Colonia' />
                                </div>
                                <div className='col-4 md-col-6 sm-col-12'>
                                    <small >Calle</small>
                                    <div className='warning__general'><small>Este campo es obligatorio</small></div>
                                    <input name="calle" className='inputs__general' type="text" value={inputs.calle} onChange={handleInputs} placeholder='Calle' />
                                </div>
                                <div className='col-2 md-col-2 sm-col-12'>
                                    <small >No. Interior</small>
                                    <div className='warning__general'><small>Este campo es obligatorio</small></div>
                                    <input name="no_interior" className='inputs__general' type="text" value={inputs.no_interior} onChange={handleInputs} placeholder='No. Interior' />
                                </div>
                                <div className='col-2 md-col-2 sm-col-12'>
                                    <small >No. Exterior</small>
                                    <div className='warning__general'><small>Este campo es obligatorio</small></div>
                                    <input name="no_exterior" className='inputs__general' type="text" value={inputs.no_exterior} onChange={handleInputs} placeholder='No. Exterior' />
                                </div>
                                <div className='col-4 md-col-4 sm-col-12'>
                                    <small >Código Postal</small>
                                    <div className='warning__general'><small>Este campo es obligatorio</small></div>
                                    <input name="codigo_postal" className='inputs__general' type="text" value={inputs.codigo_postal} onChange={handleInputs} placeholder='Código Postal' />
                                </div>  
                            </div>
                        </div>
                    </div>
                    <div className='d-flex justify-content-center'>
                        <div>
                            <input className='btn__general-purple' type='submit' value="Crear cliente" />
                        </div>
                    </div>
                </form>
            </div>
            <AddBranchOffices />
        </div>
    )
}

export default ModalCreate


