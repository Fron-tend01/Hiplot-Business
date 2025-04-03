import React, { useState, useEffect } from 'react'
import { companiesRequests } from '../../../../../fuctions/Companies';
import { BranchOfficesRequests } from '../../../../../fuctions/BranchOffices';
import { storeStore } from '../../../../../zustand/Store';
import { StoreRequests } from '../../../../../fuctions/Store';
import useUserStore from '../../../../../zustand/General';
import '../styles/Store.css'
import './styles/ModalCreate.css'
import { Toaster, toast } from 'sonner'

const ModalCreate: React.FC = () => {
    const userState = useUserStore(state => state.user);
    const user_id = userState.id

    const {getCompaniesXUsers}: any = companiesRequests();
    const [companies, setCompanies] = useState<any>()
    const {getBranchOffices}: any = BranchOfficesRequests();
    const [branchOffices, setBranchOffices] = useState<any>()
    const {modalStateUpdate, setModalStateUpdate, storeToUpdate, getStore}: any = storeStore()
    const {updateStore}: any = StoreRequests()
  
    const [selectBranchOffices, setSelectBranchOffices] = useState<boolean>(false);
    const [selectedBranchOffice, setSelectedBranchOffice] = useState<any>(null);

    const [selectCompanies, setSelectCompanies] = useState<boolean>(false);
    const [selectedCompany, setSelectedCompany] = useState<number | null>(null);

    const [nombre, setNombre] = useState<string>('');
    const [setSucursal_id] = useState<any>(null);
    const [sucursales_nuevas, setSucursales_nuevas] = useState<any>([])
    const [sucursales_eliminar, setSucursales_eliminar] = useState<any>([])



    const fetch = async () => {
        const resultCompanies = await getCompaniesXUsers(user_id)
        setCompanies(resultCompanies)
    }

    useEffect(() => {
      if(storeToUpdate) {
        setNombre(storeToUpdate.nombre)
        setSucursales_nuevas(storeToUpdate.sucursales)
      }
     
  },  [storeToUpdate]);

 
    
    useEffect(() => {
        fetch()
       
    },  [selectedCompany,storeToUpdate]);


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

        const item = sucursales_nuevas.map((x: any) => x.id_sucursal);

        let filter: any[] = [];

        for (let i = 0; i < storeToUpdate.sucursales.length; i++) {
          const idToRemove = storeToUpdate.sucursales[i].id_sucursal;
          filter = item.filter((x: any) => x !== idToRemove);
        }
  
   

        const data_ext = {
          sucursales_nuevas: filter,
          sucursales_eliminar
        };
        console.log(data, data_ext)
        try {
          await updateStore(data, data_ext);
          await getStore(user_id)
        } catch (error) {
          console.error("Error al crear el almacen:", error);
        }
      };

      console.log('sucursales_nuevas' ,sucursales_nuevas)
      console.log( 'selectedBranchOffice', selectedBranchOffice)
  
      const addBranchOfice = () => {

        const data =  {
          id_sucursal: selectedBranchOffice.id,
          sucursal: selectedBranchOffice.nombre
        }
     
        if (sucursales_nuevas.some((branch: any) => branch.id_sucursal == selectedBranchOffice.id)) {
            toast.warning('La sucursal ya ha sido agregada');
            return;
          }
        // Actualiza el estado 'data_ext' con el nuevo valor
        setSucursales_nuevas([...sucursales_nuevas, data]);
      }
    
      const deleteBranchOffice = (sucursal: any) => {
        // Encuentra el índice de la sucursal en el arreglo sucursales_nuevas
        const updatedSucursales = sucursales_nuevas.filter((branch: any) => branch.id || branch.id_sucursal !== sucursal.id_sucursal);

        // Verifica si la sucursal existe en el arreglo
        if (updatedSucursales) {
            toast.success('Sucursal eliminada exitosamente');
            setSucursales_eliminar([...sucursales_eliminar, sucursal.id_sucursal])
            setSucursales_nuevas(updatedSucursales);
        } else {
          console.warn('La sucursal seleccionada no existe.');
        }
      }
      
    
      const handleBranchOfficesChange = (sucursal: any) => {
        setSelectedBranchOffice(sucursal);
        setSucursal_id(sucursal.id);
        // Cerrar el select de sucursales
        setSelectBranchOffices(false);
    
      };

      

  const modalCreate = () => {
    setModalStateUpdate(false)
  }

    

  return (
    <div className={`overlay__store ${modalStateUpdate ? 'active' : ''}`}>
        <Toaster expand={true} position="top-right" richColors  />
        <div className={`popup__store ${modalStateUpdate ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__store" onClick={modalCreate}>
            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </a>
            <p className='title__modals'>Crear nuevo almacen</p>
            <form className='container__create_companies' onSubmit={modalCreateCompanies}>
            <div className='input__modal_store'>
                <div className='inputs__company'>
                <label className='label__general'>Nombre</label>
                <input className='inputs__general' value={nombre} onChange={(e) => setNombre(e.target.value)} type='text' placeholder='Ingresa la direccion' />
                </div>
            </div>
            <div>
            
            </div>
            <div className='selects__modal_store'>
                <div className='select__container'>
                <label className='label__general'>Empresas</label>
                <div className='select-btn__general'>
                    <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                    <div className='select__container_title'>
                        <p>{selectedCompany ? companies.find((s: {id: number}) => s.id === selectedCompany)?.razon_social : 'Selecciona'}</p>
                    </div>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
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
                <div className='select__container'>
                <label className='label__general'>Sucursales</label>
                <div className='select-btn__general'>
                    <div className={`select-btn ${selectBranchOffices ? 'active' : ''}`} onClick={openSelectBranchOffices} >
                    <div className='select__container_title'>
                        <p>{selectedBranchOffice ? branchOffices.find((s: {id: number}) => s.id === selectedBranchOffice.id)?.nombre : 'Selecciona'}</p>
                    </div>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
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
                <div className='create__store_btns-container'>
                <div>
                    <button className='btn__general-purple' type='button' onClick={addBranchOfice} >Agregar</button>
                </div>
                </div>
            </div>
            <div className='conatiner__table_store'>
                <div className='table__modal_store'>
                    <div className='table__numbers'>
                        <p className='text'>Total de sucursales</p>
                        <div className='quantities_tables'>{sucursales_nuevas && sucursales_nuevas.length}</div>
                    </div>
                    <div className='table__head'>
                    <div className='thead'>
                        <div className='th'>
                            <p className='table__store_title'>Sucursal</p>
                        </div>
                    </div>
                    </div>
                    {sucursales_nuevas && sucursales_nuevas.length > 0 ? (
                    <div className='container__branchOffice_table-modal'>
                        {sucursales_nuevas && sucursales_nuevas.map((sucursal: any) => (
                            <div className='tbody' key={sucursal.id}>
                            <p>{sucursal.sucursal || sucursal.nombre}</p>
                            <p className='btn__delete' onClick={() => deleteBranchOffice(sucursal)}>Eliminar</p>
                            </div>
                        ))}
                    </div>
                    ) : (
                    <p className='text'>Sin sucursales agregadas</p>
                    )}
                </div>
                <div className='container__btn_create-store'>
                    <button className='btn__general-purple' type='submit' >Actualizar</button>
                </div>
            </div>
            </form>
        </div>
    </div>
  )
}

export default ModalCreate
