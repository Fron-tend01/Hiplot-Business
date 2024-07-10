import React, { useEffect, useState } from 'react';
import { storeCompanies } from '../../../../zustand/Companies';
import { storeBranchOffcies } from '../../../../zustand/BranchOffices';
import useUserStore from '../../../../zustand/General';
import { storeTemplates } from '../../../../zustand/Templates';
import './styles/templates.css'



const Templates: React.FC = () => {
  const [name, setName] = useState<string>('')
  const [nameType, setNameType] = useState<string>('')
  const [id_template, setId_tempalte] = useState<number | null>(null)
  

  const [selectedCompany, setSelectedCompany] = useState<number | null>(null)

  const [modalState, setModalState] = useState<boolean>(false)
  const [modalUpdate, setModalUpdate] = useState<boolean>(false)

  const [warningSelectCompany] = useState<boolean>(false)
  const [warningNombre] = useState<boolean>(false)


  const [selectCompanies, setSelectCompanies] = useState<boolean>(false)


  const [data_extDos, setData_extDos] = useState<any[]>([])


  const {getCompaniesXUsers, companiesXUsers}: any = storeCompanies();
  const {getBranchOfficeXCompanies, branchOfficeXCompanies }: any = storeBranchOffcies();
  const {createTemplates, templates, getTemplates, updateTemplates}: any = storeTemplates()
  const userState = useUserStore(state => state.user);
  let user_id = userState.id

  useEffect(() => {
    getCompaniesXUsers(user_id)
    getBranchOfficeXCompanies(0, user_id)
    getTemplates(user_id)
  }, [])



  const [selectedCompanyIds] = useState<number[]>([]);


  // Funciones para agregar usuarios
  const addCompany = () => {
    if (!Array.isArray(data_extDos)) {
      // Si data_extDos no es un array, puedes inicializarlo como un array vacío
      setData_extDos([]);
    }
  
    // Crear un nuevo objeto que combine nuevaEmpresa y nuevoTipo
    const nuevoRegistro: any = {
      id_empresa: selectedCompany,
      nombre_empresa: companiesXUsers.find((company: any) => company.id === selectedCompany)?.razon_social,
      id_tipo: selectedInputType,
      nombre_tipo: [selectedInputType]
    };
  
    // Agregar el nuevo registro al estado de data_extDos
    setData_extDos([...data_extDos, nuevoRegistro]);
  };
  

  

  useEffect(() => {
    if (Array.isArray(data_extDos)) {
      // Verificar si el registro ya existe para evitar duplicados
      const empresaExistente = data_extDos.find(item => {
        return (item.id_empresa && item.id_empresa === selectedCompany) ||
               (item.id_tipo && item.id_tipo === selectedInputType);
      });
  
      if (!empresaExistente) {
        // Resto del código...
      }
    }
  }, [data_extDos]); // Ejecutar el efecto cuando data_ext cambie
  
  const deleteUser = (indexToRemove: number) => {
    // Filtrar el usuario a eliminar del arreglo data_ext
    const updatedDataExt = data_extDos.filter((_, index) => index !== indexToRemove);
    setData_extDos(updatedDataExt);
  };
  


  const handleCreateFamilies = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    console.log(data_extDos);

    // Verificar si data_extDos es un array no vacío
    if (Array.isArray(data_extDos) && data_extDos.length > 0) {
      // Acceder a las propiedades del primer elemento del array
      const primerElemento = data_extDos[0];
      const tipo = primerElemento.id_tipo;
      const id_empresa = primerElemento.id_empresa;

  
      let data = {
        nombre: name,
        id_empresa: id_empresa
      };
  
      let data_ext = [
        {
          nombre: nameType,
          tipo: tipo,
          id_plantilla: 0
        }
      ];
  
      try {
        await createTemplates(data, data_ext);
      } catch (error) {
        console.error("Error al crear familias:", error);
      }
    } else {
      console.error("El array data_extDos está vacío o no es un array.");
    }
  }

  const handleEmpresaChange = (company: any) => {
    setSelectedCompany(company)
    setSelectCompanies(false)
  }

  const modalCreate = () => {
    setModalState(!modalState)
  }

  const closeModalCreate = () => {
    setModalState(false)
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



  const ModalUpdate = (template_id: any) => {
    setName(template_id.nombre)
    setNameType(template_id.nombre)
    setSelectedCompany(template_id.id_empresa)
    setId_tempalte(template_id.id)
    setModalUpdate(!modalUpdate)
  }

  const closeModalUpdate = () => {
    setModalUpdate(false)
    
  }

  const handleUpdateTemplates = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault()

    console.log(data_extDos);

    // Verificar si data_extDos es un array no vacío
    if (Array.isArray(data_extDos) && data_extDos.length > 0) {
      // Acceder a las propiedades del primer elemento del array
      const primerElemento = data_extDos[0];
      const tipo = primerElemento.id_tipo;
      const id_empresa = primerElemento.id_empresa;
  
      console.log(tipo);

    let data = {
      nombre: name,
      id_empresa: id_empresa
    };



    let data_nuevo = [
      {
        nombre: nameType,
        tipo: tipo,
        id_template: id_template
      }
    ];

    let data_eliminar: any[] = [
      
    ]

    console.log(data, data_nuevo, data_eliminar)

    try {
      await updateTemplates(user_id, data, data_nuevo, data_eliminar)
    } catch {

    }
    // {
    //   "data": {
    //     "id": 0,
    //     "nombre": "string",
    //     "id_empresa": 0
    //   },
    //   "data_nuevo": [
    //     {
    //       "id": 0,
    //       "nombre": "string",
    //       "tipo": "string",
    //       "id_plantilla": 0
    //     }
    //   ],
    //   "data_eliminar": [
    //     0
    //   ]
    // }
  } }



  const [selectedInputType, setSelectedInputType] = useState<any>(null);
  const [selectInputTypes, setSelectInputTypes] = useState<boolean>(false);


  const openSelectTypes = () => {
    setSelectInputTypes(!selectInputTypes)
  }

  const TypesChange = (key: any) => {
    setSelectedInputType(key);
    setSelectInputTypes(false)
  }

  const types = {
    texto: 'texto',
    numero: 'numero',
    check: 'check'
  }

  return (
    <div className='families'>
       <div className='create__families_btn-container'>
        <button className='btn__general-purple' onClick={modalCreate}>Nueva plantilla</button>
      </div>
      <div className={`overlay__families ${modalState ? 'active' : ''}`}>
        <div className={`popup__families ${modalState ? 'active' : ''}`}>
          <a href="#" className="btn-cerrar-popup__families" onClick={closeModalCreate}>
            <svg  className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
          </a>
      
          <p className='title__modals'>Crear nueva plantilla</p>
          <form className='conatiner__create_families' onSubmit={handleCreateFamilies}>
            <div className='container__templates__form'>
              <div>
                <label className='label__general'>Nombre</label>
                <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div>
                <input className={`inputs__general ${warningNombre ? 'warning' : ''}`} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Ingresa el nombre' />
              </div>
              <div className='select__container'>
                <label className='label__general'>Empresas</label>
                <div className='warning__general' style={styleWarningSelectCompanies}><small >Este campo es obligatorio</small></div>
                <div className={`select-btn__general ${warningSelectCompany ? 'warning' : ''}`}>
                  <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                    <p>{selectedCompany ? companiesXUsers.find((s: {id: number}) => s.id === selectedCompany)?.razon_social : 'Selecciona'}</p>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                  </div>
                  <div className={`content ${selectCompanies ? 'active' : ''}`}>
                  <ul className={`options ${selectCompanies ? 'active' : ''}`} style={{ opacity: selectCompanies ? '1' : '0' }}>
                    {companiesXUsers && companiesXUsers.map((company: any) => (
                      <li key={company.id} onClick={() => handleEmpresaChange(company.id)}>
                        {company.razon_social}
                      </li>
                    ))}
                  </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className='table__templates' >
              <div className='add__components_templates  '>
                <div>
                  <label className='label__general'>Nombre</label>
                  <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div>
                  <input className={`inputs__general ${warningNombre ? 'warning' : ''}`} type="text" value={nameType} onChange={(e) => setNameType(e.target.value)} placeholder='Ingresa el nombre' />
                </div>
                <div className='add__types'>
                  <div className='select__container'>
                    <label className='label__general'>Tipo de Campo</label>
                    <div className={`select-btn__general ${selectInputTypes ? 'active' : ''}`} onClick={openSelectTypes}>
                      <div className={`select-btn ${selectInputTypes ? 'active' : ''}`}>
                        <p>{selectedInputType ? [selectedInputType] : 'Selecciona'}</p>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                      </div>
                      <div className={`content ${selectInputTypes ? 'active' : ''}`}>
                        <ul className={`options ${selectInputTypes ? 'active' : ''}`}>
                          {Object.keys(types).map(key => (
                            <li key={key} value={key} onClick={() => TypesChange(key)}>{[key]}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>  
                  <div>
                    <div className='container__add_companyin_families'>
                      <button className='btn__general-purple' onClick={addCompany} type='button'>Agregar</button>
                    </div>
                  </div>
                </div>
              </div>
              <p>Almacen activo en las empresas (2)</p>
              <div>
                <div>
                  {selectedCompanyIds ? (
                    <div>
                      <p>Tus empresas {selectedCompanyIds.length}</p>
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
                      <p className=''>Tipos</p>
                    </div>
                    
                  </div>
                </div>
                {data_extDos.length > 0 ? (
                  <div className='table__body'>
                    {data_extDos.map((item, index) => (
                      <div className='tbody__container' key={index}>
                        <div className='tbody'>
                          <div className='td'>
                            {item.nombre_empresa}
                          </div>
                          <div className='td'>
                            {item.nombre_tipo}
                          </div>
                          <div className='td'>
                            <button className='btn__delete_users' type='button' onClick={() => deleteUser(index)}>Eliminar</button>
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
            <div className='container__btns_branch-office'>
              <button className='btn__general-purple' type='submit'>Crear nueva familia</button>
            </div>
          </form>
        </div>
      </div>
      <div className='table__branch-offices' >
        <div>
          {branchOfficeXCompanies ? (
            <div>
              <p>Tus empresas {branchOfficeXCompanies.length}</p>
            </div>
          ) : (
            <p>No hay empresas</p>
          )}
        </div>
        <div className='table__head'>
          <div className='thead'>
            <div className='th'>
              <p className=''>Nombre</p>
            </div>
            <div className='th'>
              <p>Empresa</p>
            </div>
            <div className='th'>
              <p>Dirección</p>
            </div>
            <div className='th'>
              <p>Contacto</p>
            </div>
          </div>
        </div>
        {templates ? (
          <div className='table__body'>
            {templates.map((sucursal: any) => {
              return (
                <div className='tbody__container' key={sucursal.id}>
                  <div className='tbody'>
                    <div className='td'>
                      <p>{sucursal.nombre}</p>
                    </div>
                    <div className='td'>
                    <p>{sucursal.empresa}</p>
                    </div>
                    <div className='td'>
                      
                    </div>
                    <div className='td'>
                     
                    </div>
                    <div className='td'>
                      <button className='branchoffice__edit_btn' onClick={() => ModalUpdate(sucursal)}>Editar</button>
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
      <div className={`overlay__update_branch-offices ${modalUpdate ? 'active' : ''}`}>
          <div className={`popup__update_branch-offices ${modalUpdate ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__update_branch-offices" onClick={closeModalUpdate}>
              <svg xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </a>
            {/* <h3>Crear Nueva Empresa</h3> */}
            <form className='conatiner__create_families' onSubmit={handleUpdateTemplates}>
            <div className='container__templates__form'>
              <div>
                <label className='label__general'>Nombre</label>
                <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div>
                <input className={`inputs__general ${warningNombre ? 'warning' : ''}`} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Ingresa el nombre' />
              </div>
              <div className='select__container'>
                <label className='label__general'>Empresas</label>
                <div className='warning__general' style={styleWarningSelectCompanies}><small >Este campo es obligatorio</small></div>
                <div className={`select-btn__general ${warningSelectCompany ? 'warning' : ''}`}>
                  <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                    <p>{selectedCompany ? companiesXUsers.find((s: {id: number}) => s.id === selectedCompany)?.razon_social : 'Selecciona'}</p>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                  </div>
                  <div className={`content ${selectCompanies ? 'active' : ''}`}>
                  <ul className={`options ${selectCompanies ? 'active' : ''}`} style={{ opacity: selectCompanies ? '1' : '0' }}>
                    {companiesXUsers && companiesXUsers.map((company: any) => (
                      <li key={company.id} onClick={() => handleEmpresaChange(company.id)}>
                        {company.razon_social}
                      </li>
                    ))}
                  </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className='table__templates' >
              <div className='add__components_templates  '>
                <div>
                  <label className='label__general'>Nombre</label>
                  <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div>
                  <input className={`inputs__general ${warningNombre ? 'warning' : ''}`} type="text" value={nameType} onChange={(e) => setNameType(e.target.value)} placeholder='Ingresa el nombre' />
                </div>
                <div className='add__types'>
                  <div className='select__container'>
                    <label className='label__general'>Tipo de Campo</label>
                    <div className={`select-btn__general ${selectInputTypes ? 'active' : ''}`} onClick={openSelectTypes}>
                      <div className={`select-btn ${selectInputTypes ? 'active' : ''}`}>
                        <p>{selectedInputType ? [selectedInputType] : 'Selecciona'}</p>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                      </div>
                      <div className={`content ${selectInputTypes ? 'active' : ''}`}>
                        <ul className={`options ${selectInputTypes ? 'active' : ''}`}>
                          {Object.keys(types).map(key => (
                            <li key={key} value={key} onClick={() => TypesChange(key)}>{[key]}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>  
                  <div>
                    <div className='container__add_companyin_families'>
                      <button className='btn__general-purple' onClick={addCompany} type='button'>Agregar</button>
                    </div>
                  </div>
                </div>
              </div>
              <p>Almacen activo en las empresas (2)</p>
              <div>
                <div>
                  {selectedCompanyIds ? (
                    <div>
                      <p>Tus empresas {selectedCompanyIds.length}</p>
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
                      <p className=''>Tipos</p>
                    </div>
                    
                  </div>
                </div>
                {data_extDos.length > 0 ? (
                  <div className='table__body'>
                    {data_extDos.map((item, index) => (
                      <div className='tbody__container' key={index}>
                        <div className='tbody'>
                          <div className='td'>
                            {item.nombre_empresa}
                          </div>
                          <div className='td'>
                            {item.nombre_tipo}
                          </div>
                          <div className='td'>
                            <button className='btn__delete_users' type='button' onClick={() => deleteUser(index)}>Eliminar</button>
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
            <div className='container__btns_branch-office'>
              <button className='btn__general-purple' type='submit'>Crear nueva familia</button>
            </div>
          </form>
          </div>
      </div>
    </div>
  )
}

export default Templates
