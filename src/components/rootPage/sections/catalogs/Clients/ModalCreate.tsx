import React, { useEffect, useState } from 'react'
import { storeModals } from '../../../../../zustand/Modals'
import { companiesRequests } from '../../../../../fuctions/Companies'
import { BranchOfficesRequests } from '../../../../../fuctions/BranchOffices'
import useUserStore from '../../../../../zustand/General'
import AddBranchOffices from './AddBranchOffices'
import { useStore } from 'zustand'
import { storeClients } from '../../../../../zustand/Clients'
import APIs from '../../../../../services/services/APIs'
import { ClientsRequests } from '../../../../../fuctions/Clients'
import Swal from 'sweetalert2';
import './ModalCreate.css'

const ModalCreate = () => {
    const userState = useUserStore(state => state.user);
    let user_id = userState.id

    const {addBranchClients}: any = useStore(storeClients)
    const {getClients}:  any = ClientsRequests()

    const {getCompanies}: any = companiesRequests()
    const [companies, setCompanies] = useState<any>([])
    const {getBranchOffices}: any = BranchOfficesRequests()
    const [branchOffices, setBranchOffices] = useState<any>([])

    const setModal = storeModals(state => state.setModal)
    const setModalSub = storeModals(state => state.setModalSub)
    const {modal}: any = storeModals()

    

    const fetch = async () => {
        let resultCompanies = await getCompanies(user_id);
        setCompanies(resultCompanies)
        let resultBranchOffices = await getBranchOffices();
        setBranchOffices(resultBranchOffices)
    }



    useEffect(() => {
        fetch()
    }, [])

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
        clientes_sucursal: []
      });

      const handleInputs = (event) => {
        const { name, value, type, checked } = event.target;
        setInputs((prevInputs) => ({
          ...prevInputs,
          [name]: type === 'checkbox' ? checked : name in prevInputs && typeof prevInputs[name] === 'number' ? Number(value) : value,
        }));
      };

      const handleCreateClients = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setInputs((prevInputs) => ({
            ...prevInputs,
            clientes_sucursal: addBranchClients
          }));

          try {
            await APIs.createClients(inputs)
            Swal.fire('Cliente creado exitosamente', '', 'success');
          } catch (error) {
            Swal.fire('Error', 'Hubo un error al crear el cliente', 'error');
            console.error('Error creating Clients', error);
          }
       
      }
  



  return (
    <div className={`overlay__create_modal_clients ${modal == 'create_clients' ? 'active' : ''}`}>
        <div className={`popup__create_modal_clients ${modal == 'create_clients' ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__create_modal_clients" onClick={() => setModal('')}>
            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </a>
            <p className='title__modals'>Crear nuevo cliente</p>
            <form className='conatiner__create_modal_clients' onSubmit={handleCreateClients}>
                <div className='row__one'>
                    <div className='inputs__company'>
                        <label className='label__general'>Razón Social</label>
                        <div className='warning__general'><small>Este campo es obligatorio</small></div>
                        <input name="razon_social" className='inputs__general' type="text" value={inputs.razon_social} onChange={handleInputs} placeholder='Ingresa la razón social'/>
                    </div>
                    <div className='inputs__company'>
                        <label className='label__general'>Nombre Comercial</label>
                        <div className='warning__general'><small>Este campo es obligatorio</small></div>
                        <input name="nombre_comercial" className='inputs__general' type="text" value={inputs.nombre_comercial} onChange={handleInputs} placeholder='Ingresa el nombre comercial'/>
                    </div>
                    <div className='inputs__company'>
                        <label className='label__general'>Nombre Contacto</label>
                        <div className='warning__general'><small>Este campo es obligatorio</small></div>
                        <input name="nombre_contacto" className='inputs__general' type="text" value={inputs.nombre_contacto} onChange={handleInputs} placeholder='Ingresa el nombre de contacto'/>
                    </div>
                    <div className='inputs__company'>
                        <label className='label__general'>Correo</label>
                        <div className='warning__general'><small>Este campo es obligatorio</small></div>
                        <input name="correo" className='inputs__general' type="email" value={inputs.correo} onChange={handleInputs} placeholder='Ingresa el correo' />
                    </div>
                    <div className='inputs__company'>
                        <label className='label__general'>RFC</label>
                        <div className='warning__general'><small>Este campo es obligatorio</small></div>
                        <input name="rfc" className='inputs__general' type="text" value={inputs.rfc} onChange={handleInputs} placeholder='Ingresa el RFC'/>
                    </div>
                    <div className='inputs__company'>
                        <label className='label__general'>Persona Jurídica</label>
                        <div className='warning__general'><small>Este campo es obligatorio</small></div>
                        <input name="persona_juridica" className='inputs__general' type="number" value={inputs.persona_juridica} onChange={handleInputs} placeholder='Persona Jurídica'/>
                    </div>
                    <div className='inputs__company'>
                        <label className='label__general'>Divisa</label>
                        <div className='warning__general'><small>Este campo es obligatorio</small></div>
                        <input name="divisa" className='inputs__general' type="number" value={inputs.divisa} onChange={handleInputs} placeholder='Divisa'/>
                    </div>
                    <div className='inputs__company'>
                        <label className='label__general'>Uso CFDI</label>
                        <div className='warning__general'><small>Este campo es obligatorio</small></div>
                        <input name="uso_cfdi" className='inputs__general' type="number" value={inputs.uso_cfdi} onChange={handleInputs} placeholder='Uso CFDI'/>
                    </div>
                    <div className='inputs__company'>
                        <label className='label__general'>Régimen Fiscal</label>
                        <div className='warning__general'><small>Este campo es obligatorio</small></div>
                        <input name="regimen_fiscal" className='inputs__general' type="number" value={inputs.regimen_fiscal} onChange={handleInputs} placeholder='Régimen Fiscal'/>
                    </div>
                    <div className='inputs__company'>
                        <label className='label__general'>Categoría</label>
                        <div className='warning__general'><small>Este campo es obligatorio</small></div>
                        <input name="categoria" className='inputs__general' type="number" value={inputs.categoria} onChange={handleInputs} placeholder='Categoría' />
                    </div>
                    <div className='inputs__company'>
                        <label className='label__general'>Status</label>
                        <div className='warning__general'><small>Este campo es obligatorio</small></div>
                        <input name="status" className='inputs__general' type="checkbox" checked={inputs.status} onChange={handleInputs}/>
                    </div>
                    <div className='inputs__company'>
                        <label className='label__general'>Estado</label>
                        <div className='warning__general'><small>Este campo es obligatorio</small></div>
                        <input name="estado" className='inputs__general' type="text" value={inputs.estado} onChange={handleInputs} placeholder='Estado'/>
                    </div>
                    <div className='inputs__company'>
                        <label className='label__general'>Municipio</label>
                        <div className='warning__general'><small>Este campo es obligatorio</small></div>
                        <input name="municipio" className='inputs__general' type="text" value={inputs.municipio} onChange={handleInputs} placeholder='Municipio'/>
                    </div>
                    <div className='inputs__company'>
                        <label className='label__general'>Colonia</label>
                        <div className='warning__general'><small>Este campo es obligatorio</small></div>
                        <input name="colonia" className='inputs__general' type="text" value={inputs.colonia} onChange={handleInputs} placeholder='Colonia'/>
                    </div>
                    <div className='inputs__company'>
                        <label className='label__general'>Calle</label>
                        <div className='warning__general'><small>Este campo es obligatorio</small></div>
                        <input name="calle" className='inputs__general' type="text" value={inputs.calle} onChange={handleInputs} placeholder='Calle'/>
                    </div>
                    <div className='inputs__company'>
                        <label className='label__general'>No. Interior</label>
                        <div className='warning__general'><small>Este campo es obligatorio</small></div>
                        <input name="no_interior" className='inputs__general' type="text" value={inputs.no_interior} onChange={handleInputs} placeholder='No. Interior'/>
                    </div>
                    <div className='inputs__company'>
                        <label className='label__general'>No. Exterior</label>
                        <div className='warning__general'><small>Este campo es obligatorio</small></div>
                        <input name="no_exterior" className='inputs__general' type="text" value={inputs.no_exterior} onChange={handleInputs} placeholder='No. Exterior'/>
                    </div>
                    <div className='inputs__company'>
                        <label className='label__general'>Código Postal</label>
                        <div className='warning__general'><small>Este campo es obligatorio</small></div>
                        <input name="codigo_postal" className='inputs__general' type="text" value={inputs.codigo_postal} onChange={handleInputs} placeholder='Código Postal'/>
                    </div>
                    <button type='button' className='btn__general-purple' onClick={() => setModalSub('modal-sub_create_clients')}>Agregar sucursales</button>
                </div>
                <div className='row__two'>
                    <AddBranchOffices />
                </div>
                  
                <div className='create__units_btn_modal'>
                    <div>
                        <input className='btn__general-purple' type='submit' value="Crear cliente" />
                    </div>
                </div>
            </form>
        </div>
    </div>
  )
}

export default ModalCreate


