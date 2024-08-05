import React, { useState } from 'react';
import { storeModals } from '../../../../../zustand/Modals';
import { useStore } from 'zustand';
import './ModalCreate.css';
import Empresas_Sucursales from '../../../Dynamic_Components/Empresas_Sucursales';
import Select from '../../../Dynamic_Components/Select';
import { useSelectStore } from '../../../../../zustand/Select';
import { ClientsRequests } from '../../../../../fuctions/Clients';
import SalesCard from '../SalesCard';
import { storeArticleView } from '../../../../../zustand/ArticleView';
import ArticleViewModal from '../ArticleViewModal';
import { storeSaleCard } from '../../../../../zustand/SaleCard';
import { storePersonalized } from '../../../../../zustand/Personalized';
import Personalized from '../Personalized';

const ModalCreate = () => {
  const setModalArticleView = storeArticleView((state) => state.setModalArticleView);
  const setPersonalizedModal = storePersonalized((state) => state.setPersonalizedModal);
  const setModal = storeModals((state) => state.setModal);
  const {modal}: any =  useStore(storeModals)
  const {dataQuotation}: any =  useStore(storeSaleCard)
  console.log(dataQuotation)

  const {getClients}: any = ClientsRequests()
  const selectedId = useSelectStore((state) => state.selectedId);

  const [invoice, setInvoice] = useState<any>()

  const dataSelect: any = {
    selectName: 'Clientes',
    empresas: [
      { id: 1, razon_social: 'Empresa 1' },
      { id: 2, razon_social: 'Empresa 2' },
    ],
  };

  const searchClients = () => {
    let data = {
      id: 0,
      id_sucursal: 0,
      id_usuario: 0,
      nombre: "string"
    }
    getClients(data)
  }

  const [data, setData] =useState<any>({
    nombre: 'Juan',
    razon_social: 'Hiplot | Impresión Y Rótulos | Canc',
    rfc: 'aASJHDA9W38A8SDA'
  })

  return (
    <div className={`overlay__quotations__modal ${modal === 'create-modal__qoutation' ? 'active' : ''}`}>
      <div className={`popup__quotations__modal ${modal === 'create-modal__qoutation' ? 'active' : ''}`}>
        <a href="#" className="btn-cerrar-popup__quotations__modal" onClick={() => setModal('')}>
          <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </a>
        <p className='title__modals'>Crea nueva cotización</p>
        <div className='row'>
          <div className='row col-12 md-col-12'>
            <div className='col-8 md-col-12'>
              <Empresas_Sucursales />
            </div>
            <div className='col-4  md-col-6 sm-col-12'>
              <Select data={dataSelect} />
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-5 md-col-6 sm-col-12'>
            <label className='label__general'>Nombre</label>
            <div className='warning__general'><small >Este campo es obligatorio</small></div>
            <input className={`inputs__general`} type="text" value={invoice} onChange={(e) => setInvoice(e.target.value)} placeholder='Ingresa el nombre' />
          </div>
          <div className='col-5 md-col-6 sm-col-12'>
            <label className='label__general'>RFC</label>
            <div className='warning__general'><small >Este campo es obligatorio</small></div>
            <input className={`inputs__general`} type="text" value={invoice} onChange={(e) => setInvoice(e.target.value)} placeholder='Ingresa el RFC' />
          </div>
          <div  className='col-2 md-col-12 d-flex align-items-end justify-content-center'>
            <button type='button' className='btn__general-purple' onClick={searchClients}>Buscar</button>
          </div>
        </div>
        <div className='row text'>
          <div className='col-3'>
            <p>{data.razon_social}</p>
          </div>
          <div className='col-2'>
            <p>{data.nombre}</p>
          </div>
          <div className='col-3'>
            <p>{data.rfc}</p>
          </div>
          <div className='col-2'>
              <button className='btn__general-purple'>ver mas</button>
          </div>
          <div className='col-2'>
              <button className='btn__general-purple' onClick={() => setModalArticleView('article-view__modal')}>Catalogo</button>
          </div>
        </div>
        <div>
          <p className='text'>Artuculos</p>
          <div className='row'>
            <div>
              <button className='btn__general-purple' onClick={() => setPersonalizedModal('personalized_modal')}>Crear personalizados</button>
            </div>
          </div>
          <div className='row'>
            <div>
              <p>{dataQuotation?.codigo}</p>
            </div>
            <div>
              <p>{dataQuotation?.Decripcion}</p>
            </div>
            <div>
              <button className='btn__general-purple'>Ver mas</button>
            </div>
          </div>
        </div>
      </div>
      <Personalized />
      <ArticleViewModal />
      <SalesCard />
    </div>
  );
};

export default ModalCreate;
