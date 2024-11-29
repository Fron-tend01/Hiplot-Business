import React, { useState, useEffect } from 'react'
import { companiesRequests } from '../../../../../fuctions/Companies';
import { BranchOfficesRequests } from '../../../../../fuctions/BranchOffices';
import { storeStore } from '../../../../../zustand/Store';
import useUserStore from '../../../../../zustand/General';
import Swal from 'sweetalert2';

import '../styles/Store.css'
import './styles/ModalStore.css'
import { Toaster, toast } from 'sonner'
import APIs from '../../../../../services/services/APIs';

const ModalCreate: React.FC = () => {
    const userState = useUserStore(state => state.user);
    const user_id = userState.id

    const { getCompaniesXUsers }: any = companiesRequests();
    const [companies, setCompanies] = useState<any>()
    const { getBranchOffices }: any = BranchOfficesRequests();
    const [branchOffices, setBranchOffices] = useState<any>()
    const { modalState, setModalState, getStore, storeToUpdate }: any = storeStore()

    const [selectBranchOffices, setSelectBranchOffices] = useState<boolean>(false);
    const [selectedBranchOffice, setSelectedBranchOffice] = useState<any>(null);

    const [selectCompanies, setSelectCompanies] = useState<boolean>(false);
    const [selectedCompany, setSelectedCompany] = useState<number | null>(null);

    const [nombre, setNombre] = useState<string>('');
    const [setSucursal_id] = useState<any>(null);

    const [sucursales_nuevas, setSucursales_nuevas] = useState<any>([])
    const [sucursales_eliminar, setSucursales_eliminar] = useState<any>([])

    const setStore = storeStore(state => state.setStore)

    const [predeterminada, setPredeterminada] = useState<boolean>(false);

    const fetch = async () => {
        const resultCompanies = await getCompaniesXUsers(user_id)
        setCompanies(resultCompanies)
    }

    useEffect(() => {
        fetch()
        if (modalState == 'modal-update_store') {
            setNombre(storeToUpdate.nombre)
            setSucursales_nuevas(storeToUpdate.sucursales)
        }
    }, [storeToUpdate]);


    const openSelectCompanies = () => {
        setSelectCompanies(!selectCompanies);
    };

    const openSelectBranchOffices = () => {
        setSelectBranchOffices(!selectBranchOffices);
    };
    const handleCompaniesChange = async (company: any) => {
        setSelectedCompany(company);
        setSelectCompanies(false);
        const resultBranch = await getBranchOffices(company, user_id)
        await setBranchOffices(resultBranch)
        await setSelectedBranchOffice(resultBranch[0])
        console.log(selectedBranchOffice)
        console.log(branchOffices)
    };


    const modalCreateCompanies = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = {
            id: storeToUpdate.id,
            nombre: nombre
        };


        const data_ext = {
            sucursales_nuevas: sucursales_nuevas,
            sucursales_eliminar
        };

        console.log(sucursales_nuevas)

        if (modalState == 'modal-create_store') {
            try {

                const result: any = await APIs.createStore(data, data_ext);
                await getStore(user_id)
                const resultStore = await getStore(user_id)
                setStore(resultStore)
                setModalState('')
                Swal.fire({ icon: 'success', title: 'Almacén creado', text: result.mensaje });
            } catch (error) {
                Swal.fire({ icon: 'error', title: 'Error al crear el almacén', text: 'Ocurrió un error al intentar crear el almacén. Por favor, intenta nuevamente.', });
                console.error("Error al crear el almacen:", error);
            }
        } else {
            try {
                const result: any = await APIs.updateStore(data, data_ext);
                await getStore(user_id)
                const resultStore = await getStore(user_id)
                setStore(resultStore)
                setModalState('')
                Swal.fire({ icon: 'success', title: 'Almacén actualizado', text: result.mensaje });
            } catch (error) {
                Swal.fire({ icon: 'error', title: 'Error al actualizar el almacén', text: 'Ocurrió un error al intentar actualizar el almacén. Por favor, intenta nuevamente.', });
                console.error("Error al actualizar el almacen:", error);
            }

        }



    };



    const addBranchOfice = () => {
        if (sucursales_nuevas.some((branch: any) => branch.id === selectedBranchOffice.id)) {
            toast.warning('La sucursal ya ha sido agregada');
            return;
        }

        const filter = companies.filter((x: any) => x.id == selectedBranchOffice.empresa_id)

        const data = {
            id: selectedBranchOffice.id,
            predeterminado_empresa: predeterminada,
            sucursal: selectedBranchOffice.nombre,
            empresa: filter[0].razon_social
        }

        // Actualiza el estado 'data_ext' con el nuevo valor
        setSucursales_nuevas([...sucursales_nuevas, data]);
        setPredeterminada(false)
    }

    console.log(sucursales_eliminar)

    const deleteBranchOffice = (sucursal: any) => {
        console.log('sucursales_eliminar', sucursales_eliminar)
        console.log('sucursales_nuevas', sucursales_nuevas)
        // Encuentra el índice de la sucursal en el arreglo sucursales_nuevas
        const updatedSucursales = sucursales_nuevas.filter((branch: any) => branch.id !== sucursal.id);
        setSucursales_nuevas(updatedSucursales);
        setSucursales_eliminar([...sucursales_eliminar, sucursal.id])
        toast.success('Sucursal eliminada exitosamente');


    }


    const handleBranchOfficesChange = (sucursal: any) => {
        setSelectedBranchOffice(sucursal);
        setSelectBranchOffices(false);
        setSucursal_id(sucursal.id);


    };



    const modal = () => {
        setModalState('')
        if (modalState == 'modal-update_store') {
            setSucursales_nuevas([])
            setNombre('')
        }
    }
    const selectPredeterminada = (ChangeEvent:any) => {
        const exist = sucursales_nuevas.filter((x:any) => x.predeterminado_empresa==true)
        if (exist.length > 0) {
            Swal.fire('Notificacion', 'Ya existe una empresa predeterminada para este almacen: ' + exist[0].empresa, 'info')
            return
        }
        setPredeterminada(ChangeEvent)
    }


    return (
        <div className={`overlay__store ${modalState == 'modal-create_store' || modalState == 'modal-update_store' ? 'active' : ''}`}>
            <Toaster expand={true} position="top-right" richColors />
            <div className={`popup__store ${modalState ? 'active' : ''}`}>
                <a href="#" className="btn-cerrar-popup__store" onClick={modal}>
                    <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                </a>
                <p className='title__modals'>{modalState == 'modal-create_store' ? 'Crear nuevo almacén' : 'Actualizar almacén'}</p>
                <hr />
                <br />
                <form className='row' onSubmit={modalCreateCompanies}>
                    <div className='col-12'>
                        <div className='inputs__company'>
                            <label className='label__general'>Nombre</label>
                            <input className='inputs__general' value={nombre} onChange={(e) => setNombre(e.target.value)} type='text' placeholder='Ingresa el nombre' />
                        </div>
                    </div>
                    <div className='col-4 md-col-12'>
                        <div className='select__container'>
                            <label className='label__general'>Empresas</label>
                            <div className='select-btn__general'>
                                <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                                    <div className='select__container_title'>
                                        <p>{selectedCompany ? companies.find((s: { id: number }) => s.id === selectedCompany)?.razon_social : 'Selecciona'}</p>
                                    </div>
                                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                                </div>
                                <div className={`content ${selectCompanies ? 'active' : ''}`} >
                                    <ul className={`options ${selectCompanies ? 'active' : ''}`} style={{ opacity: selectCompanies ? '1' : '0' }}>
                                        {companies && companies.map((company: any) => (
                                            <li key={company.id} onClick={() => handleCompaniesChange(company.id)}>
                                                {company.razon_social}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-4 md-col-12'>

                        <div className='select__container'>
                            <label className='label__general'>Sucursales</label>
                            <div className='select-btn__general'>
                                <div className={`select-btn ${selectBranchOffices ? 'active' : ''}`} onClick={openSelectBranchOffices} >
                                    <div className='select__container_title'>
                                        <p>{selectedBranchOffice ? branchOffices.find((s: { id: number }) => s.id === selectedBranchOffice.id)?.nombre : 'Selecciona'}</p>
                                    </div>
                                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                                </div>
                                <div className={`content ${selectBranchOffices ? 'active' : ''}`} >
                                    <ul className={`options ${selectBranchOffices ? 'active' : ''}`} style={{ opacity: selectBranchOffices ? '1' : '0' }}>
                                        {branchOffices && branchOffices.map((sucursal: any) => (
                                            <li key={sucursal.id} onClick={() => handleBranchOfficesChange(sucursal)}>
                                                {sucursal.nombre}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-2 md-col-12'>

                        <div className='select__container' title='Almacen predeterminado para la empresa seleccionada // Al marcar uno solo de cualquier sucursal, se considerará la empresa como predeterminada, si se marcan 2 o más de la misma empresa, no pasa nada, se respeta siempre el primer registro creado'>
                            <label>Predeterminado</label><br></br>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={predeterminada} // Asignar el valor del estado al atributo 'checked'
                                    onChange={(e) => { selectPredeterminada(e.target.checked); }}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                    <div className='col-2 md-col-12 d-flex justify-content-center align-items-center'>
                        <button className='btn__general-purple' type='button' onClick={addBranchOfice} >Agregar</button>
                    </div>

                    <div className='col-12'>
                        <div className='table__modal_store'>
                            <div className='table__numbers'>
                                <p className='text'>Total de sucursales</p>
                                <div className='quantities_tables'>{sucursales_nuevas && sucursales_nuevas.length}</div>
                            </div>
                            <div className='table__head'>
                                <div className='thead'>
                                    <div className='th'>
                                        <p className='table__store_title'>Empresa</p>
                                    </div>
                                    <div className='th'>
                                        <p className='table__store_title'>Sucursal</p>
                                    </div>
                                    <div className='th'>

                                    </div>
                                </div>
                            </div>
                            {sucursales_nuevas?.length > 0 ? (
                                <div className='table__body'>
                                    {sucursales_nuevas?.map((sucursal: any, index: any) => (
                                        <div className='tbody__container' key={index}>
                                            <div className='tbody'>
                                                <div className='td'>
                                                    {sucursal.empresa} {sucursal.predeterminado_empresa == true ? <span style={{ color: 'blue' }} title='Esta empresa es la considerada predeterminada para este almacen'>[PREDETERMINADO]</span> : ''}
                                                </div>
                                                <div className='td'>
                                                    {sucursal.sucursal}
                                                </div>
                                                <div className='td'>
                                                    <button className='btn__delete_users' type='button' onClick={() => deleteBranchOffice(sucursal)}>Eliminar</button>
                                                </div>

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className='text'>No hay sucursales que mostrar</p>
                            )}

                        </div>
                    </div>
                    <br />
                            <div className='col-12'>
                                <button className='btn__general-purple' type='submit'>{modalState == 'modal-create_store' ? 'Crear nuevo almacén' : 'Actualizar almacén'}</button>
                            </div>
                </form>
            </div>
        </div>
    )
}

export default ModalCreate
