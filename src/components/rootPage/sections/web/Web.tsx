import { useEffect, useState } from 'react'
import './styles/Web.css'
import { storeCompanies } from '../../../../zustand/Companies';
import { storeBranchOffcies } from '../../../../zustand/BranchOffices';
import useUserStore from '../../../../zustand/General';
import { PrivateRoutes } from '../../../../models/routes';
import {useNavigate } from 'react-router-dom';
import { storeWebPages } from '../../../../zustand/WebPages';



const Web = () => {
  const {getCompaniesXUsers, companiesXUsers}: any = storeCompanies();
  const {getBranchOfficeXCompanies, branchOfficeXCompanies }: any = storeBranchOffcies();
  const {webPages, getWebPages }: any = storeWebPages();

  const userState = useUserStore(state => state.user);
  const user_id = userState.id

  const [modalState, setModalState] = useState<boolean>(false)

  const [selectedCompany, setSelectedCompany] = useState<number | null>(null)
  const [selectedBranchOffice, setSelectedBranchOffice] = useState<number | null>(null);

  const [selectCompanies, setSelectCompanies] = useState<boolean>(false)
  const [selectBranchOffices, setSelectBranchOffices] = useState<boolean>(false)

  
  useEffect(() => {
    getCompaniesXUsers(user_id)
    getBranchOfficeXCompanies(0, user_id)
    getWebPages(user_id)

  }, [])

  const modal = () => {
    setModalState(true)
  }

  const modalClose = () => {
    setModalState(false)
  }



  


  const openSelectCompanies = () => {
    setSelectCompanies(!selectCompanies)

}

const openSelectBranchOffices = () => {
    setSelectBranchOffices(!selectBranchOffices)

}

const handleCompaniesChange = async (company: any) => {
    setSelectedCompany(company.id)
    setSelectCompanies(false)
    selectAutomatic(company.id);
    
}

const handleBranchOfficesChange = (branchOffice: any) => {
    setSelectedBranchOffice(branchOffice.id)
    setSelectBranchOffices(false)
    if (selectedCompany !== null) {
        selectAutomatic(selectedCompany);
    }
}

const [branchOfficesFiltering, setBranchOfficesFiltering] = useState<any>([])


const selectAutomatic = (company_id: number) => {
    const filter = branchOfficeXCompanies.filter((x: any) => x.empresa_id === company_id)
    setBranchOfficesFiltering(filter)
    setSelectedBranchOffice(filter.length > 0 ? filter[0].id : null);

}

const navigate = useNavigate(); // Usa useNavigate en lugar de useHistory

const regresarAHome = async (web: any) => {
     
    localStorage.setItem('Id_sucursal', web.id_sucursal);
  
    navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.WEBPAGE}`);
    const { id_sucursal } = web; // Desestructura id_sucursal de web
  
    // Actualiza el estado en tu store de zustand utilizando el setter proporcionado por el hook
    await storeWebPages.setState((state) => ({
        ...state, id_sucursal: id_sucursal
    }));
  
};

  return (
    <div className='web'>
        <div className='web__container'>
            <div className='row__one'>
                <div>
                    <button className='btn__general-purple' onClick={modal}>Crear pagina</button>
                </div>
            </div>
            <div className={`overlay__web ${modalState ? 'active' : ''}`}>
                <div className={`popup__web ${modalState ? 'active' : ''}`}>
                    <a href="#" className="btn-cerrar-popup__web" onClick={modalClose}>
                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                    </a>
                    <p className='title__modals'>Crear nueva pagina</p>
                    <form className='conatiner__create_web'>
                        <div className='row__one'>
                            <div className='select__container'>
                                <label className='label__general'>Empresas</label>
                                <div className='select-btn__general'>
                                    <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                                        <div className='select__container_title'>
                                            <p>{selectedCompany ? companiesXUsers.find((s: {id: number}) => s.id === selectedCompany)?.razon_social : 'Selecciona'}</p>
                                        </div>
                                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                                    </div>
                                    <div className={`content ${selectCompanies ? 'active' : ''}`} >
                                        <ul className={`options ${selectCompanies ? 'active' : ''}`} style={{ opacity: selectCompanies ? '1' : '0' }}>
                                        {companiesXUsers && companiesXUsers.map((company: any) => (
                                            <li key={company.id} onClick={() => handleCompaniesChange(company)}>
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
                                            <p>{selectedBranchOffice ? branchOfficeXCompanies.find((s: {id: number}) => s.id === selectedBranchOffice)?.nombre : 'Selecciona'}</p>
                                        </div>
                                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                                    </div>
                                    <div className={`content ${selectBranchOffices ? 'active' : ''}`} >
                                        <ul className={`options ${selectBranchOffices ? 'active' : ''}`} style={{ opacity: selectBranchOffices ? '1' : '0' }}>
                                        {branchOfficesFiltering.map((sucursal: any) => (
                                            <li key={sucursal.id} onClick={() => handleBranchOfficesChange(sucursal)}>
                                            {sucursal.nombre}
                                            </li>
                                        ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button className='btn__general-purple' type='submit'>Crear nueva pagina</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className='table__web'>
                {webPages ? (
                <div className='table__numbers'>
                    <p className='text'>Total de Ordenes</p>
                    <div className='quantities_tables'>{webPages.length}</div>
                </div>
                ) : (
                <p className="text">No hay empresas que mostras</p>
                )}
                <div className='table__head'>
                    <div className='thead'>
                        <div className='th'>
                            <p>Empresa</p>
                        </div>
                        <div className='th'>
                            <p>Sucursal</p>
                        </div>
                        <div className='th'>
                            <p>LOREMP</p>
                        </div>
                        <div className='th'>
                            
                        </div>
                    </div>
                </div>
                {/* {webPages && webPages.length > 0 ? ( */}
                <div className='table__body'>
                    {webPages && webPages.map((web: any) => {
                        return (
                        <div className='tbody__container' key={web.id}>
                            <div className='tbody'>
                                <div className='td'>
                                    <p>{web.empresa}</p>
                                </div>
                                <div className='td'>
                                    <p>{web.sucursal}</p>
                                </div>
                                <div className='td'>
                                 
                                </div>
                                <div className='td'>
                                    <button className='branchoffice__edit_btn' onClick={() => regresarAHome(web)}>Editar Pagina</button>
                                </div>
                            </div>
                        </div>
                        );
                    } )}
                </div>
                {/* // ) : ( 
                //     <p className="text">Cargando datos...</p> 
                // )} */}
            </div>
        </div>
    </div>
  )
}

export default Web
