import React, { useEffect } from 'react';
import { storeCompanies } from '../../../../zustand/Companies';
import useUserStore from '../../../../zustand/General';
import { storeViews } from '../../../../zustand/views';
import DynamicVariables from '../../../../utils/DynamicVariables';

import { storeModals } from '../../../../zustand/Modals';
import './styles/Companies.css';
import CompanyModal from './companies/CompanyModal';

const Companies: React.FC = () => {
  // Id del del usuario global
  const userState = useUserStore(state => state.user);
  const setModal = storeModals(state => state.setModal)
  const user_id = userState.id
  
  const setModel = storeCompanies(state => state.setModel)

  const { getCompaniesXUsers, companiesXUsers }: any = storeCompanies()
  const { getViews, views }: any = storeViews()



  const fetch = async () => {
    await getCompaniesXUsers(user_id);

    getViews(user_id, 'EMPRESAS')
  }

  useEffect(() => {
    fetch()
  }, []);

  // Modal del pop
  const modal = (company: any) => {
    console.log(company)
    setModal('modal__update-companies')
    DynamicVariables.updateAnyVar(setModel, 'id', company.id)
    DynamicVariables.updateAnyVar(setModel, 'razon_social', company.razon_social)
    DynamicVariables.updateAnyVar(setModel, 'nombre_comercial', company.nombre_comercial)
    DynamicVariables.updateAnyVar(setModel, 'bd_compaqi', company.bd_compaqi)
    DynamicVariables.updateAnyVar(setModel, 'modulo_cobrofranquicia_compaqi', company.modulo_cobrofranquicia_compaqi)

    DynamicVariables.updateAnyVar(setModel, 'empresas_franquicias', company.empresas_franquicias)
  }

  return (
    <div className='companies'>
      <div className='container__companies'>
        {views.find((x: any) => x.titulo === 'crear') ?
          <div className='create__company_btn-container'>
            <div>
              <button className='btn__general-purple' onClick={(() => setModal('modal__creating-companies'))}>Nueva Empresa </button>
            </div>
          </div>
          :
          ''}
        <CompanyModal />
        <div className='table__companies'>
          <div>
            {companiesXUsers ? (
              <div>
                <p className='text'>Tus empresas <strong className='number__elemnts'>{companiesXUsers.length}</strong></p>
              </div>
            ) : (
              <p></p>
            )}
          </div>
          <div className='table__head'>
            <div className='thead'>
              <div className='th'>
                <p className=''>Razon Social</p>
              </div>
              <div className='th'>
                <p>Nombre comercial</p>
              </div>
            </div>
          </div>
          {companiesXUsers ? (
            <div className='table__body'>
              {companiesXUsers.map((company: any) => (
                <div className='tbody__container' key={company.id}>
                  <div className='tbody'>
                    <div className='td'>
                      <p>{company.razon_social}</p>
                    </div>
                    <div className='td'>
                      <p>{company.nombre_comercial}</p>
                    </div>
                    <div className='td'>
                      <button className='general__edit_button' onClick={() => modal(company)}>Editar</button>
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
  );
}

export default Companies
