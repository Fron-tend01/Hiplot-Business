import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { storeCompanies } from '../../../../zustand/Companies';
import { storeBranchOffcies } from '../../../../zustand/BranchOffices';
import { suppliersRequests } from '../../../../fuctions/Suppliers';
import useUserStore from '../../../../zustand/General';
import { Toaster, toast } from 'sonner'
import './styles/Suppliers.css'
import { v4 as uuidv4 } from 'uuid'; // Importa la función v4 de uuid
import DynamicVariables from '../../../../utils/DynamicVariables';
import APIs from '../../../../services/services/APIs';



const Suppliers: React.FC = () => {
  const [businessName, setBusinessName] = useState<string>('')
  const [tradename, setTradename] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [contactName, setContactName] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [referencias, setReferencias] = useState<string>('')

  const userState = useUserStore(state => state.user);
  const user_id = userState.id
  const [searcher, setSearcher] = useState<any>({
    nombre: '',
    is_flete: false,
    id_usuario: user_id
  })

  const [selectedCompany, setselectedCompany] = useState<any>(null)

  const [modalState, setModalState] = useState<boolean>(false)
  const [modalStateUpdate, setmodalStateUpdate] = useState<boolean>(false)

  const [warningSelectCompany] = useState<boolean>(false)
  const [warningNombre] = useState<boolean>(false)

  const [selectCompanies, setSelectCompanies] = useState<boolean>(false)

  // nombre: string, is_flete: boolean, id_usuario: number

  const [newSuppliers, setNewSuppliers] = useState<any[]>([])
  const [deleteSuppliers, setDeleteSuppliers] = useState<any[]>([])

  const { getCompaniesXUsers, companiesXUsers }: any = storeCompanies();
  const { getBranchOfficeXCompanies }: any = storeBranchOffcies();
  const { createSuppliers, getSuppliers, updateSuppliers }: any = suppliersRequests();
  const [suppliers, setSuppliers] = useState<any>()
  const [permisos, setPermisos] = useState<any[]>([])



  const fetch = async () => {
    await APIs.GetAny('get_permisos_x_vista/' + user_id + '/PROVEEDORES').then((resp: any) => {
      setPermisos(resp);
    })
    getCompaniesXUsers(user_id)
    getBranchOfficeXCompanies(0, user_id)
    const result = await getSuppliers(searcher)
    setSuppliers(result)
  }

  useEffect(() => {
    fetch()
  }, [])




  const handleEmpresaChange = (company: any) => {
    setselectedCompany(company)
    setSelectCompanies(false)
  }


  // Funciones para agregar usuarios

  const addCompany = () => {
    if (selectedCompany !== null) {
      // Verifica si la empresa seleccionada ya está en newSuppliers
      // const isCompanyAlreadyAdded = newSuppliers.some(company => company.id_empresa || company.id == selectedCompany.id);
      let isCompanyAlreadyAdded = false;
      if (modalState) {
        isCompanyAlreadyAdded = newSuppliers.some(company => company.id == selectedCompany.id);
      } else {
        if (modalStateUpdate) {
          isCompanyAlreadyAdded = newSuppliers.some(company => company.id_empresa == selectedCompany.id);
        }
      }
      console.log(newSuppliers)
      console.log('newSuppliers', newSuppliers)
      console.log('isCompanyAlreadyAdded', isCompanyAlreadyAdded)
      console.log('selectedCompany', selectedCompany)


      if (!isCompanyAlreadyAdded) {
        setNewSuppliers([...newSuppliers, selectedCompany]);

        // Muestra un mensaje de éxito o realiza cualquier otra acción necesaria
        toast.success('Empresa agregada correctamente');
      } else {
        // La empresa ya está en newSuppliers, muestra un mensaje de advertencia
        toast.warning('La empresa ya está agregada');
      }
    } else {
      // No se ha seleccionado ninguna empresa, muestra un mensaje de advertencia
      toast.warning('No se ha seleccionado ninguna empresa');
    }
  };

  const deleteUser = (supplier: any) => {
    // Filtrar el usuario a eliminar del arreglo subordinados_nuevos
    const updatedSubordinadosNuevos = newSuppliers.filter((x: any) => x.id !== supplier.id);
    setNewSuppliers(updatedSubordinadosNuevos);
    console.log(newSuppliers)
    console.log(supplier)
    // Filtrar el ID del usuario a eliminar del arreglo de IDs
    setDeleteSuppliers([...deleteSuppliers, supplier.id])
  };


  const handleCreateSuppliers = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    let filter: any[] = [];
    for (let i = 0; i < newSuppliers.length; i++) {
      filter = [...filter, newSuppliers[i].id];
    }


    const data = {
      razon_social: businessName,
      nombre_comercial: tradename,
      ubicacion: location ?? '',
      nombre_contacto: contactName ?? '', // corregido a "nombre_contacto"
      telefono: phoneNumber ?? '',
      correo: email ?? '', 
      is_flete: availability ,
      referencias: referencias ?? '',
      empresasData_nuevos: filter,
      empresasData_elim: []
    }

    try {
      await createSuppliers(data)
      const result = await getSuppliers(searcher)
      setSuppliers(result)
      closeModalCreate()

    } catch {

    }
  }

  const clearxcreate = () => {
    setBusinessName('')
    setTradename('')
    setLocation('')
    setContactName('')
    setPhoneNumber('')
    setEmail('')
    setSelectedSupplier('')
    setReferencias('')
    setNewSuppliers([])
    setAvailability(false)
  }

  const modalCreate = () => {
    setModalState(!modalState)
    clearxcreate()
  }

  const closeModalCreate = () => {
    setModalState(false)
    setNewSuppliers([])
  }

  const openSelectCompanies = () => {
    setSelectCompanies(!selectCompanies)
  }

  const styleWarningSelectCompanies = {
    transition: 'all 1000ms',
    opacity: warningSelectCompany === true ? '1' : '',
    height: warningSelectCompany === true ? '30px' : ''
  }

  const styleWarningNombre = {
    transition: 'all 1000ms',
    opacity: warningNombre === true ? '1' : '',
    height: warningNombre === true ? '30px' : ''
  }


  const [idSupplier, setIdSupplier] = useState<any>()
  const [selectedSupplier, setSelectedSupplier] = useState<any>()

  const modalUpdate = (supplier: any) => {
    setmodalStateUpdate(true)
    setIdSupplier(supplier.id)
    setBusinessName(supplier.razon_social)
    setTradename(supplier.nombre_comercial)
    setLocation(supplier.ubicacion)
    setContactName(supplier.nombre_contacto)
    setPhoneNumber(supplier.telefono)
    setEmail(supplier.correo)
    setSelectedSupplier(supplier)
    setNewSuppliers(supplier.empresas)
    setAvailability(supplier.is_flete)
    setReferencias(supplier.referencias)
    console.log(supplier)
  }

  const closeModalUpdate = () => {
    setmodalStateUpdate(false)
    setNewSuppliers([])



  }

  const [searchTerm] = useState<string>('');

  const [availability, setAvailability] = useState<any>()

  const handleAvailabilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAvailability(event.target.checked);
  };


  const handleUpdateSuppliers = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const idsToRemove = selectedSupplier.empresas.map((empresa: any) => empresa.id_empresa);
    const updatedSuppliers = newSuppliers.filter((supplier: any) => !idsToRemove.includes(supplier.id_empresa));
    const ids_supl: any = []
    await updatedSuppliers.forEach(element => {
      ids_supl.push(element.id)
    });
    // console.log(updatedSuppliers);

    // return
    const data = {
      id: idSupplier,
      razon_social: businessName,
      nombre_comercial: tradename,
      ubicacion: location ?? '',
      nombre_contacto: contactName ?? '', // corregido a "nombre_contacto"
      telefono: phoneNumber ?? '',
      correo: email ?? '',
      is_flete: availability,
      referencias: referencias ?? '',
      empresasData_nuevos: ids_supl,
      empresasData_elim: deleteSuppliers
    }



    try {
      await updateSuppliers(data)
      const result = await getSuppliers(searcher)
      setSuppliers(result)
      setmodalStateUpdate(false)
    } catch {

    }
  }

  useEffect(() => {

  }, [newSuppliers])

  const search = async () => {
    const result = await getSuppliers(searcher)
    setSuppliers(result)
  }

  return (
    <div className='suppliers'>
      <Toaster expand={true} position="top-right" richColors />
      <div className='suppliers__container'>
        <div className='create__families_btn-container'>
          <button className='btn__general-purple' onClick={modalCreate}>Nuevo proveedor</button>
        </div>
        <div className='row'>
          <div className='col-8 md-col-6 sm-col-12'>
            <label className='label__general'>Razon Social o Nombre Comercial a buscar</label>
            <input placeholder="Ingresa RS o NC para buscar un proveedor" type="text" className='inputs__general'
              value={searcher.nombre} onChange={(e) => DynamicVariables.updateAnyVar(setSearcher, "nombre", e.target.value)}
              onKeyUp={(event) => event.key === 'Enter' && search()} />
          </div>
          <div className='col-2 md-col-3 sm-col-6'>
            <div>
              <p className='text'>¿Es flete?</p>
              <label className="switch">
                <input type="checkbox" checked={searcher.is_flete} onChange={(e) => DynamicVariables.updateAnyVar(setSearcher, "is_flete", e.target.checked)} />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className='col-2 md-col-3 sm-col-6'>
            <button className='btn__general-orange' onClick={search}>Buscar</button>
          </div>
        </div>


        <div className='table__suppliers' >
          <div>
            {suppliers ? (
              <div className='table__numbers'>
                <p className='text'>Total de proveedores</p>
                <div className='quantities_tables'>{suppliers.length}</div>
              </div>
            ) : (
              <p className='text'>No hay empresas</p>
            )}
          </div>
          <div className='table__head'>
            <div className='thead'>
              <div className='th'>
                <p>Nombre comercial</p>
              </div>
              <div className='th'>
                <p>Nombre de contacto</p>
              </div>
              {permisos.some((x: any) => x.titulo === 'campos_extra') ? (
                <>
                  <div className='th'>
                    <p>Correo</p>
                  </div>
                  <div className='th'>
                    <p>Telefono</p>
                  </div>
                </>

              ) : ''}
                  <div className='th'>
                    Acciones
                  </div>
            </div>
          </div>
          {suppliers ? (
            <div className='table__body'>
              {suppliers.map((supplier: any) => {
                // const company = companiesXUsers.find((company: { id: number }) => company.id === supplier.empresa_id);
                return (
                  <div className='tbody__container' key={uuidv4()}>
                    <div className='tbody'>
                      <div className='td'>
                        <p>{supplier.nombre_comercial}</p>
                      </div>
                      <div className='td'>
                        <p>{supplier.nombre_contacto}</p>
                      </div>
                      {permisos.some((x: any) => x.titulo === 'campos_extra') ? (
                        <>
                          <div className='td'>
                            <p>{supplier.correo}</p>
                          </div>
                          <div className='td'>
                            <p>{supplier.telefono}</p>
                          </div>
                        </>

                      ) : ''}
                          <div className='td'>
                            <button className='branchoffice__edit_btn' onClick={() => modalUpdate(supplier)}>Editar</button>
                          </div>

                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className='text'>Cargando datos...</p>
          )}
        </div>



        <div className={`overlay__suppliers ${modalState ? 'active' : ''}`}>
          <div className={`popup__suppliers ${modalState ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__suppliers" onClick={closeModalCreate}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
            </a>
            <p className='title__modals'>Crear nuevo proveedor</p>
            <form className='conatiner__create_suppliers' onSubmit={handleCreateSuppliers}>
              <div className='row shadow-custom bg-gray'>
                <div className='col-4 md-col-6 sm-col-12'>
                  <label className='label__general'>Razon Social</label>
                  <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div>
                  <input className={`inputs__general ${warningNombre ? 'warning' : ''}`} type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder='Ingresa el nombre' />
                </div>
                <div className='col-4 md-col-6 sm-col-12'>
                  <label className='label__general'>Nombre Comercial</label>
                  <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div>
                  <input className={`inputs__general ${warningNombre ? 'warning' : ''}`} type="text" value={tradename} onChange={(e) => setTradename(e.target.value)} placeholder='Ingresa el nombre' />
                </div>
                {permisos.some((x: any) => x.titulo === 'campos_extra') ? (
                  <>

                    <div className='col-4 md-col-6 sm-col-12'>
                      <label className='label__general'>Ubicación</label>
                      <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div>
                      <input className={`inputs__general ${warningNombre ? 'warning' : ''}`} type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder='Ingresa el nombre' />
                    </div>
                    <div className='col-4 md-col-6 sm-col-12'>
                      <label className='label__general'>Nombre de Contacto</label>
                      <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div>
                      <input className={`inputs__general ${warningNombre ? 'warning' : ''}`} type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder='Ingresa el nombre' />
                    </div>
                    <div className='col-4 md-col-6 sm-col-12'>
                      <label className='label__general'>Telefono</label>
                      <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div>
                      <input className={`inputs__general ${warningNombre ? 'warning' : ''}`} type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder='Ingresa el nombre' />
                    </div>
                    <div className='col-4 md-col-6 sm-col-12'>
                      <label className='label__general'>Correo</label>
                      <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div>
                      <input className={`inputs__general ${warningNombre ? 'warning' : ''}`} type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Ingresa el nombre' />
                    </div>
                    <div className='col-12 md-col-12 sm-col-12'>
                      <label className='label__general'>Referencias</label>
                      <textarea className={`inputs__general`} rows={3} value={referencias} onChange={(e) => setReferencias(e.target.value)} placeholder='Informativo para referenciar al proveedor' />
                    </div>
                  </>

                ) : ''}
              </div>
              <div className='row'>
                <div className='col-8 md-col-12'>
                  <div className='select__container'>
                    <label className='label__general'>Empresas</label>
                    <div className='warning__general' style={styleWarningSelectCompanies}><small >Este campo es obligatorio</small></div>
                    <div className={`select-btn__general ${warningSelectCompany ? 'warning' : ''}`}>
                      <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                        <p>{selectedCompany ? companiesXUsers.find((s: { id: number }) => s.id === selectedCompany.id)?.razon_social : 'Selecciona'}</p>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                      </div>
                      <div className={`content ${selectCompanies ? 'active' : ''}`}>
                        <ul className={`options ${selectCompanies ? 'active' : ''}`} style={{ opacity: selectCompanies ? '1' : '0' }}>
                          {companiesXUsers && companiesXUsers.filter((company_id: any) => company_id.razon_social.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((company: any) => (
                              <li key={uuidv4()} onClick={() => handleEmpresaChange(company)}>
                                {company.razon_social}
                              </li>
                            ))
                          }
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-2 md-col-6'>
                  <label className='label__general'>Add</label>

                  <button className='btn__general-purple' onClick={addCompany} type='button'>Agregar</button>
                </div>
                <div className='col-2 md-col-6'>
                  <div>
                    <p className='text'>¿Es flete?</p>
                    <label className="switch">
                      <input type="checkbox" checked={availability} onChange={handleAvailabilityChange} />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>



              </div>
              <div className='table__modal_suppliers' >
                <div>
                  <div>
                    {newSuppliers ? (
                      <div className='table__numbers'>
                        <p className='text'>Empresas agregadas</p>
                        <div className='quantities_tables'>{newSuppliers.length}</div>
                      </div>
                    ) : (
                      <p className='text'>No hay empresas</p>
                    )}
                  </div>
                  <div className='table__head'>
                    <div className='thead'>
                      <div className='th'>
                        <p className=''>Empresa</p>
                      </div>

                    </div>
                  </div>
                  {newSuppliers.length > 0 ? (
                    <div className='table__body'>
                      {newSuppliers.map(supplier => (
                        <div className='tbody__container' key={uuidv4()}>
                          <div className='tbody'>
                            <div className='td'>
                              {companiesXUsers.find((user: any) => user.id == supplier.id)?.razon_social}
                            </div>
                            <div className='td'>
                              <button className='btn__delete_users' onClick={() => deleteUser(supplier)}>Eliminar</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text'>Cargando datos...</p>
                  )}
                </div>
              </div>
              <div className='container__btns_branch-office'>
                <button className='btn__general-purple' type='submit'>Crear nuevo proveedor</button>
              </div>
            </form>
          </div>
        </div>


        <div className={`overlay__update_suppliers ${modalStateUpdate ? 'active' : ''}`}>
          <div className={`popup__update_suppliers ${modalStateUpdate ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__update_suppliers" onClick={closeModalUpdate}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
            </a>
            <p className='title__modals'>Actualizar proveedor</p>
            <form className='conatiner__create_suppliers' onSubmit={handleUpdateSuppliers}>
              <div className='row shadow-custom bg-gray'>
                <div className='col-4 md-col-6 sm-col-12'>
                  <label className='label__general'>Razon Social</label>
                  <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div>
                  <input className={`inputs__general ${warningNombre ? 'warning' : ''}`} type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder='Ingresa el nombre' />
                </div>
                <div className='col-4 md-col-6 sm-col-12'>
                  <label className='label__general'>Nombre Comercial</label>
                  <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div>
                  <input className={`inputs__general ${warningNombre ? 'warning' : ''}`} type="text" value={tradename} onChange={(e) => setTradename(e.target.value)} placeholder='Ingresa el nombre' />
                </div>
                {permisos.some((x: any) => x.titulo === 'campos_extra') ? (
                  <>
                    <div className='col-4 md-col-6 sm-col-12'>
                      <label className='label__general'>Ubicación</label>
                      <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div>
                      <input className={`inputs__general ${warningNombre ? 'warning' : ''}`} type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder='Ingresa el nombre' />
                    </div>
                    <div className='col-4 md-col-6 sm-col-12'>
                      <label className='label__general'>Nombre de Contacto</label>
                      <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div>
                      <input className={`inputs__general ${warningNombre ? 'warning' : ''}`} type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder='Ingresa el nombre' />
                    </div>
                    <div className='col-4 md-col-6 sm-col-12'>
                      <label className='label__general'>Telefono</label>
                      <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div>
                      <input className={`inputs__general ${warningNombre ? 'warning' : ''}`} type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder='Ingresa el nombre' />
                    </div>
                    <div className='col-4 md-col-6 sm-col-12'>
                      <label className='label__general'>Correo</label>
                      <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div>
                      <input className={`inputs__general ${warningNombre ? 'warning' : ''}`} type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Ingresa el nombre' />
                    </div>
                    <div className='col-12 md-col-12 sm-col-12'>
                      <label className='label__general'>Referencias</label>
                      <textarea className={`inputs__general`} rows={3} value={referencias} onChange={(e) => setReferencias(e.target.value)} placeholder='Informativo para referenciar al proveedor' />
                    </div>
                  </>

                ) : ''}
              </div>
              <div className='row'>
                <div className='col-8 md-col-12'>
                  <div className='select__container'>
                    <label className='label__general'>Empresas</label>
                    <div className='warning__general' style={styleWarningSelectCompanies}><small >Este campo es obligatorio</small></div>
                    <div className={`select-btn__general ${warningSelectCompany ? 'warning' : ''}`}>
                      <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                        <p>{selectedCompany ? companiesXUsers.find((s: { id: number }) => s.id === selectedCompany.id)?.razon_social : 'Selecciona'}</p>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                      </div>
                      <div className={`content ${selectCompanies ? 'active' : ''}`}>
                        <ul className={`options ${selectCompanies ? 'active' : ''}`} style={{ opacity: selectCompanies ? '1' : '0' }}>
                          {companiesXUsers && companiesXUsers.filter((company_id: any) => company_id.razon_social.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((company: any) => (
                              <li key={uuidv4()} onClick={() => handleEmpresaChange(company)}>
                                {company.razon_social}
                              </li>
                            ))
                          }
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-2 md-col-6'>
                  <label className='label__general'>Add</label>

                  <button className='btn__general-purple' onClick={addCompany} type='button'>Agregar</button>

                </div>
                <div className='col-2 md-col-6'>
                  <div>
                    <p className='text'>¿Es flete?</p>
                    <label className="switch">
                      <input type="checkbox" checked={availability} onChange={handleAvailabilityChange} />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>



              </div>
              <div className='table__modal_suppliers' >
                <div>
                  <div>
                    {newSuppliers ? (
                      <div className='table__numbers'>
                        <p className='text'>Total de proveedores</p>
                        <div className='quantities_tables'>{newSuppliers.length}</div>
                      </div>
                    ) : (
                      <p className='text'>No hay empresas</p>
                    )}
                  </div>
                  <div className='table__head'>
                    <div className='thead'>
                      <div className='th'>
                        <p className=''>Empresa</p>
                      </div>

                    </div>
                  </div>
                  {newSuppliers.length > 0 ? (
                    <div className='table__body'>
                      {newSuppliers.map(supplier => (
                        <div className='tbody__container' key={uuidv4()}>
                          <div className='tbody'>
                            <div className='td'>
                              {supplier.razon_social}
                            </div>
                            <div className='td'>
                              <button className='btn__delete_users' onClick={() => deleteUser(supplier)}>Eliminar</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text'>Cargando datos...</p>
                  )}
                </div>
              </div>
              <div className='container__btns_branch-office'>
                <button className='btn__general-purple' type='submit'>Actualizar proveedor</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Suppliers
