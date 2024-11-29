import React, { useEffect, useState } from 'react';
import { storeStore } from '../../../../../../zustand/Store';
import useUserStore from '../../../../../../zustand/General';
import { useStore } from 'zustand';
import { storeArticles } from '../../../../../../zustand/Articles';
import './style/BranchOffices.css'
import {toast } from 'sonner'
import Empresas_Sucursales from '../../../../Dynamic_Components/Empresas_Sucursales';


const BranchOffices: React.FC = () => {
    const userState = useUserStore(state => state.user);
    let user_id = userState.id

    const { articleByOne, setBranchOffices, branchOffices, setDeleteBranchOffices, deleteBranchOffices, subModal }: any = useStore(storeArticles);

    
    const [selectWarehouses, setSelectWarehouses] = useState<boolean>(false);
    const [selectedStore, setSelectedStore] = useState<number | null>(null);
    const [availability, setAvailability] = useState<boolean>(false);

    const { store, getStore, setStore }: any = storeStore()
 
    const setSubModal = storeArticles(state => state.setSubModal)

    const [selectedBranchOffice, setSelectedBranchOffice] = useState<any>(null);
    const [companies, setCompanies] = useState<any>()


    useEffect(() => {
        if (user_id) {
            getStore(user_id).then((data:any) => {
                setStore(data);
            });
            
        }

    }, [user_id, articleByOne]);


    const handleStoreChange = (storeId: number) => {
        setSelectedStore(storeId);
        setSelectWarehouses(false);
    };




    const openSelectStore = () => {
        setSelectWarehouses(!selectWarehouses);
    };


    const handleAvailabilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAvailability(event.target.checked);
    };


    const addBranchOffice = () => {
        let data = {
            company_id: companies.id,
            id_sucursal: selectedBranchOffice.id,
            empresa: companies.razon_social,
            sucursal: selectedBranchOffice.nombre,
            disponible: availability,
            id_almacen_pred: selectedStore,
        }
        
        const exists = branchOffices.some((x: any) => x.id_sucursal == selectedBranchOffice.id);
 
        if (exists) {
            toast.warning('La sucursal ya existe');
        } else {
            setBranchOffices([...branchOffices, data]);
        }
        

    };

    const deleteUser = (item: any) => {
        const updatedBranchOffices = branchOffices.filter((x: any) => x !== item);
        setBranchOffices(updatedBranchOffices);
        if(item.id != null) {
            setDeleteBranchOffices([...deleteBranchOffices, item.id])
        }
    };


    return (
        <div className={`overlay__modal_branch-offices_creating_articles ${subModal == 'branch-office__modal' ? 'active' : ''}`}>
            <div className={`popup__modal_branch-offices_creating_articles ${subModal == 'branch-office__modal' ? 'active' : ''}`}>
                <a href="#" className="btn-cerrar-popup__modal_branch-offices_creating_articles" onClick={() => setSubModal('')}>
                    <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                </a>
                <p className='title__modals'>Sucursal</p>
                <div className='article__modal_branch-offices_save_modal_container'>
                    <div className='row'>
                        <div className='col-12'>
                            <Empresas_Sucursales update={false} empresaDyn={companies} setEmpresaDyn={setCompanies} sucursalDyn={selectedBranchOffice} setSucursalDyn={setSelectedBranchOffice} />
                        </div>
                    </div>
                    <div className='row__two'>
                        <div className='select__container'>
                            <label className='label__general'>Almacenes</label>
                            <div className='select-btn__general'>
                                <div className={`select-btn ${selectWarehouses ? 'active' : ''}`} onClick={openSelectStore} >
                                    <p>{selectedStore ? store.find((s: { id: number }) => s.id === selectedStore)?.nombre : 'Selecciona'}</p>
                                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                                </div>
                                <div className={`content ${selectWarehouses ? 'active' : ''}`} >
                                    <ul className={`options ${selectWarehouses ? 'active' : ''}`} style={{ opacity: selectWarehouses ? '1' : '0' }}>
                                        {store.map((warehouse: any) => (
                                            <li key={warehouse.id} onClick={() => handleStoreChange(warehouse.id)}>
                                                {warehouse.nombre} 
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className='text'>Disponible</p>
                            <label className="switch">
                                <input type="checkbox" checked={availability} onChange={handleAvailabilityChange} />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div>
                            <button className='btn__general-purple' type='button' onClick={addBranchOffice}>Agregar</button>
                        </div>
                    </div>
                    <div>
                        <div className='table__branch-offices' >
                            <div>
                                <div>
                                    {branchOffices ? (
                                        <div className='table__numbers'>
                                            <p className='text'>Total de sucursales</p>
                                            <div className='quantities_tables'>{branchOffices.length}</div>
                                        </div>
                                    ) : (
                                        <p>No hay sucursales</p>
                                    )}
                                </div>
                                <div className='table__head'>
                                    <div className='thead'>
                                        <div className='th'>
                                            <p className=''>Empresa</p>
                                        </div>
                                        <div className='th'>
                                            <p className=''>Sucursal</p>
                                        </div>
                                        <div className='th'>
                                            <p className=''>Almacén</p>
                                        </div>
                                        <div className='th'>
                                            <p className=''>Disp. Venta</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='table__body'>
                                    {branchOffices?.map((item: any, index: number) => (
                                        <div className='tbody__container' key={index}>
                                            <div className='tbody'>
                                                <div className='td'>
                                                    {item.empresa}
                                                </div>
                                                <div className='td'>
                                                    {item.sucursal}
                                                </div>
                                                <div className='td'>
                                                    {store.find((store: any) => store.id === item.id_almacen_pred)?.nombre}
                                                </div>
                                                <div className='td'>
                                                    {item.disponible == true ?
                                                    <div className='available'>
                                                        <p>Disponible</p>
                                                    </div>
                                                    :
                                                    <div className='not-available'>
                                                        <p>No disponible</p>
                                                    </div>
                                                    }
                                                </div>
                                                <div className='td'>
                                                    <button className='btn__general-danger' type='button' onClick={() => deleteUser(item)}>Eliminar</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default BranchOffices;
