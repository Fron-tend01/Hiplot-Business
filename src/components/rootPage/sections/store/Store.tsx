import React, { useEffect } from 'react'
import { storeBranchOffcies } from '../../../../zustand/BranchOffices';
import { storeStore } from '../../../../zustand/Store';
import useUserStore from '../../../../zustand/General';
import ModalCreate from './Store/ModalCreate';
import ModalUpdate from './Store/ModalUpdate';
import './styles/Store.css'

const Store: React.FC = () => {
  const userState = useUserStore(state => state.user);
  let user_id = userState.id

  const {branchOfficeXCompanies }: any = storeBranchOffcies();
  const {setModalStateCreate, setModalStateUpdate, setStoreToUpdate, getStore, store}: any = storeStore()

  const fetch = async () => {
    await getStore(user_id)
    
  }

  useEffect(() => {
    fetch()
  },  [branchOfficeXCompanies]);




  const modal = () => {
    setModalStateCreate(true);
  };

  const modalUpdate = (store: any) => {
    setModalStateUpdate(true)
    setStoreToUpdate(store)
    console.log(store)
  }

 
  return (
    <div>
      <div className='store'>
        <div className='container__store'>
          <div className='create__company_btn-container'>
            <button className='btn__general-purple' onClick={modal}>Nuevo Almacen</button>
          </div>
          <ModalCreate />
          <ModalUpdate />
          <div className='table__store'>
            <div>
            {store ? (
              <div className='table__numbers'>
                <p className='text'>Total de almacenes</p>
                <div className='quantities_tables'>{store.length}</div>
              </div>
            ) : (
              <p></p>
            )}
            </div>
            <div className='table__head'>
              <div className='thead'>
                <div className='th'>
                  <p className=''>Nombre</p>
                </div>
                <div className='th'>
                  <p>Sucursales</p>
                </div>
              </div>
            </div>
            {store ? (
              <div className='table__body'>
                {store.map((store: any) => {
                  // Buscar la empresa correspondiente en companiesData
                  // const sucursal = branchOfficeXCompanies.find((sucursal: {id: number}) => sucursal.id === store.sucursal_id);
                  return (
                    <div className='tbody__container' key={store.id}>
                      <div className='tbody'>
                        <div className='td'>
                          <p>{store.nombre}</p>
                        </div>
                        <div className='td'>
                          <p>{store.nombre}</p>
                        </div>
                        <div className='td'>
                          <button className='branchoffice__edit_btn' onClick={() => modalUpdate(store)}>Editar</button>
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
        </div>
      </div>
    </div>
  )
}

export default Store
