import React, { useEffect, useState } from 'react';
import { storeBranchOffcies } from '../../../../../../zustand/BranchOffices';
import { storeStore } from '../../../../../../zustand/Store';
import useUserStore from '../../../../../../zustand/General';
import { useStore } from 'zustand';
import { storeArticles } from '../../../../../../zustand/Articles';
import { companiesRequests } from '../../../../../../fuctions/Companies';
import './style/BranchOffices.css'

const BranchOffices: React.FC = () => {
    const { articleByOne, setModalStateBrnachOffices, setBranchOffices, branchOffices, setDeleteBranchOffices, deleteBranchOffices }: any = useStore(storeArticles);
    const [selectCompanies, setSelectCompanies] = useState<boolean>(false);
    const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
    const [selectBranchOffices, setSelectBranchOffices] = useState<boolean>(false);
    const [selectedBranchOffice, setSelectedBranchOffice] = useState<number | null>(null);
    const [selectWarehouses, setSelectWarehouses] = useState<boolean>(false);
    const [selectedStore, setSelectedStore] = useState<number | null>(null);
    const [availability, setAvailability] = useState<boolean>(false);

    const [filteredBranchOffices, setFilteredBranchOffices] = useState<any[]>([]);

    const { getCompaniesXUsers }: any = companiesRequests()

    const {getBranchOfficeXCompanies, branchOfficeXCompanies }: any = storeBranchOffcies();
    const {store, getStore}: any = storeStore()
    const userState = useUserStore(state => state.user);
    let user_id = userState.id

    const closeModal = () => {
        setModalStateBrnachOffices('');    
    };

    const [companies, setCompanies] = useState<any>()

    const getData = async () =>{
       let result = await getCompaniesXUsers(user_id);
       setCompanies(result)
    }

    useEffect(() => {
        getData()
        if (user_id) {  
           
            getBranchOfficeXCompanies(0, user_id)
            getStore(user_id);
        }
      
        if(articleByOne.sucursales) {
            setBranchOffices(articleByOne.sucursales)
        }
  
    }, [user_id, articleByOne]);   

    const handleCompnaiesChange = (company: any) => {
        setSelectedCompany(company.id);
        setSelectCompanies(false);

        console.log(selectedCompany)

        const firstBranchOffice = branchOfficeXCompanies.find((branchOffice: any) => branchOffice.empresa_id === company);
        if (firstBranchOffice) {
            setSelectedBranchOffice(firstBranchOffice.id);
        } else {
            setSelectedBranchOffice(null);
        }
        setSelectCompanies(false);
    };

    useEffect(()  => {
        if (selectedCompany) {
          const idSelectedBranch = branchOfficeXCompanies.filter((branchOffice: any) => branchOffice.empresa_id === selectedCompany);

          setFilteredBranchOffices(idSelectedBranch);
          if (idSelectedBranch.length > 0) {
            setSelectedBranchOffice(idSelectedBranch[0].id); // Acceder al ID del primer elemento del array
          } else {
            setSelectedBranchOffice(null); // Si no se encuentra ninguna sucursal, establecer selectedBranchOffice en null
          }
        } else {
          setFilteredBranchOffices([]);
          setSelectedBranchOffice(null); // Si no se ha seleccionado ninguna empresa, establecer selectedBranchOffice en null
        }
    
      }, [selectedCompany]);

    const handleBranchOfficesChange = (branchOffice: any) => {
        setSelectedBranchOffice(branchOffice.id);
        setSelectBranchOffices(false);
    };

    const handleStoreChange = (storeId: number) => {
        setSelectedStore(storeId);
        setSelectWarehouses(false);
    };


    const openSelectCompanies = () => {
        setSelectCompanies(!selectCompanies);
    };

    const openSelectBranchOffices = () => {
        setSelectBranchOffices(!selectBranchOffices);
    };


    const openSelectStore = () => {
        setSelectWarehouses(!selectWarehouses);
    };

 
    const handleAvailabilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAvailability(event.target.checked);
    };

    const addBranchOffice = () => {
        let data = {
          company_id: selectedCompany,
          id_sucursal: selectedBranchOffice,
          disponible: availability,
          id_almacen_pred: selectedStore,
        }
        setBranchOffices([...branchOffices, data])
         
    };

    const deleteUser = (item: any) => {
        const updatedBranchOffices = branchOffices.filter((x: any) => x !== item);
        setBranchOffices(updatedBranchOffices);
        setDeleteBranchOffices([...deleteBranchOffices, item.id])
    };


    return (
        <div>
            <a href="#" className="btn-cerrar-popup__modal_branch-offices_creating_articles" onClick={closeModal}>
                <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </a>
            <p className='title__modals'>Sucursal</p>
            <div className='article__modal_branch-offices_save_modal_container'>
                <div className='row__one'>
                    <div className='select__container'>
                        <label className='label__general'>Empresas</label>
                        <div className='select-btn__general'>
                            <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                                <div className='select__container_title'>
                                    <p>{selectedCompany ? companies.find((s: { id: number }) => s.id === selectedCompany)?.razon_social : 'Selecciona'}</p>
                                </div>
                                <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                            </div>
                            <div className={`content ${selectCompanies ? 'active' : ''}`}>
                                <ul className={`options ${selectCompanies ? 'active' : ''}`} style={{ opacity: selectCompanies ? '1' : '0' }}>
                                    {companies && companies.map((company: any) => (
                                        <li key={company.id} onClick={() => handleCompnaiesChange(company)}>
                                            {company.razon_social}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='select__container'>
                        <label className='label__general'>Sucursales</label>
                        <div className='select-btn__general'>
                            <div className={`select-btn ${selectBranchOffices ? 'active' : ''}`} onClick={openSelectBranchOffices} >
                                <div className='select__container_title'>
                                    <p>{selectedBranchOffice ? branchOfficeXCompanies.find((s: { id: number }) => s.id === selectedBranchOffice)?.nombre : 'Selecciona'}</p>
                                </div>
                                <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                            </div>
                            <div className={`content ${selectBranchOffices ? 'active' : ''}`} >
                                <ul className={`options ${selectBranchOffices ? 'active' : ''}`} style={{ opacity: selectBranchOffices ? '1' : '0' }}>
                                    {filteredBranchOffices.map((branchOffice: any) => (
                                        <li key={branchOffice.id} onClick={() => handleBranchOfficesChange(branchOffice)}>
                                            {branchOffice.nombre}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row__two'>
                    <div className='select__container'>
                        <label className='label__general'>Almacenes</label>
                        <div className='select-btn__general'>
                            <div className={`select-btn ${selectWarehouses ? 'active' : ''}`} onClick={openSelectStore} >
                                <p>{selectedStore ? store.find((s: { id: number }) => s.id === selectedStore)?.nombre : 'Selecciona'}</p>
                                <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
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
                                    <p>No hay empresas</p>
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
                                </div>
                            </div>
                            <div className='table__body'>
                                {branchOffices?.map((item: any, index: number) => (
                                    <div className='tbody__container' key={index}>
                                        <div className='tbody'>
                                            <div className='td'>
                                                {/* {companies.find((company: any) => company.id === item.company_id).razon_social} */}
                                            </div>
                                            <div className='td'>
                                                {branchOfficeXCompanies.find((branchOffice: any) => branchOffice.id === item.id_sucursal)?.nombre}
                                            </div>
                                            <div className='td'>
                                                {store.find((store: any) => store.id === item.id_almacen_pred)?.nombre}
                                            </div>
                                            <div className='td'>
                                                <button className='btn__delete_users' type='button' onClick={() => deleteUser(item)}>Eliminar</button>
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
      
    );
};

export default BranchOffices;
