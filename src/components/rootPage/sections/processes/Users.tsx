import React, { useEffect, useState } from 'react';
import { storeCompanies } from '../../../../zustand/Companies';
import { storeBranchOffcies } from '../../../../zustand/BranchOffices';
import { storeAreas } from '../../../../zustand/Areas';
import { storeTypesUsers } from '../../../../zustand/TypesUsers';
import { storeUserGroups } from '../../../../zustand/UserGroups';
import { storeUsers } from '../../../../zustand/Users';
import useUserStore from '../../../../zustand/General';
import { Toaster } from 'sonner'
import { v4 as uuidv4 } from 'uuid';
import APIs from '../../../../services/services/APIs'
import Swal from 'sweetalert2';
import DynamicVariables from '../../../../utils/DynamicVariables';



import './styles/Users.css'
import { useSelectStore } from '../../../../zustand/Select';
import Select from '../../Dynamic_Components/Select';


const Users: React.FC = () => {
  const [warningNombre, setWarningNombre] = useState<boolean>(false);
  const [warningEmail, setWarningEmail] = useState<boolean>(false);
  const [warningPassword, setWarningPassword] = useState<boolean>(false);
  // const [warningSelectCompany, setWarningSelectCompany] = useState<boolean>(false)
  // const [warningSelectBranchOffice, setWarningSelectBranchOffice] = useState<boolean>(false)
  // const [warningSelectTypeUser, setWarningSelectTypeUser] = useState<boolean>(false)
  const [warningSelectUserGroup, setWarningSelectUserGroup] = useState<boolean>(false)
  const [warningSelectBranchOffices, setWarningSelectBranchOffices] = useState<boolean>(false)

  const [nombre, setNombre] = useState<string>('');
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false);

  // Selects
  const [selectCompanies, setSelectCompanies] = useState<boolean>(false);
  const [selectBranchOffices, setSelectBranchOffices] = useState<boolean>(false);
  const [selectTypeUsers, setSelectTypeUsers] = useState<boolean>(false);
  const [selectUserGroups, setSelectUserGroups] = useState<boolean>(false);
  const [selectUsers, setSelectUsers] = useState<boolean>(false);


  // Slects name
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [selectedBranchOffice, setSelectedBranchOffice] = useState<number | null>(null);
  const [selectedTypeUser, setSelectedTypeUser] = useState<number | null>(null)
  const [selectedUserGroup, setSelectUserGroup] = useState<number | null>(null)


  const [sucursales_nuevas, setSucursalesNuevas] = useState<any[]>([])
  const [sucursales_eliminar, setSucursales_eliminar] = useState<any[]>([])
  const [areas_nuevas, setAreasNuevas] = useState<any[]>([])
  const [areas_eliminar, setAreas_eliminar] = useState<any[]>([])
  const [subordinados_nuevos, setSubordinadosNuevos] = useState<any[]>([])
  const [subordinados_eliminar, setSubordinados_eliminar] = useState<any[]>([])


  const [modalUpdate, setModalUpdate] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [userSearchTerm, setUserSearchTerm] = useState<string>('');



  const [selectUser, setSelectUser] = useState<number | null>(null)

  const [modal, setModal] = useState<boolean>(false)

  const { getCompaniesXUsers, companiesXUsers }: any = storeCompanies();
  const { getBranchOfficeXCompanies, branchOfficeXCompanies }: any = storeBranchOffcies();
  const { areasXBranchOfficesXUsers, getAreasXBranchOfficesXUsers }: any = storeAreas();
  const { userGroups, getUserGroups }: any = storeUserGroups();
  const { getTypesUsers, typesUsers }: any = storeTypesUsers();
  const { createUsers, getUsers, putUsers }: any = storeUsers();
  const userState = useUserStore(state => state.user);
  let user_id = userState.id

  const [searcher, setSearcher] = useState<any>({
    nombre: '',
    id_usuario: user_id,
    id_usuario_consulta: user_id,
    light: false,
    id_sucursal: 0
  })
  const [usuarios, setUsuarios] = useState<any>([])
  const [usuariosComercial, setUsuariosComercial] = useState<any>([]);
  const [UsuarioCSelected, setUsuarioCSelected] = useState<any>({})
  const selectedIds: any = useSelectStore((state) => state.selectedIds);
  const [companiesLocal, setCompaniesLocal] = useState<any>([])
  const fetch = async () => {
    let res = await getCompaniesXUsers(user_id)
    setCompaniesLocal({
      selectName: 'Empresa',
      dataSelect: res,
      options: 'razon_social'
    })
    getBranchOfficeXCompanies(0, user_id)
    getTypesUsers(user_id)
    getUserGroups(user_id)
    // getUsers('', user_id, user_id, false, 0)
    getUsuarios()
  }
  useEffect(() => {
    fetch()
  }, []);
  useEffect(() => {
    if (selectedIds?.empresas_comercial) {
      APIs.GetAny("get_users_comercial/" + selectedIds?.empresas_comercial.id).then(async (response: any) => {
        if (response?.error) {
          setUsuariosComercial([])
        } else {
          setUsuariosComercial(response)
        }
      })
    }
  }, [selectedIds?.empresas_comercial]);
  const getUsuarios = async () => {
    await APIs.CreateAny(searcher, "usuario_get")
      .then(async (response: any) => {
        setUsuarios(response)
      })
      .catch((error: any) => {
        if (error.response) {
          if (error.response.status === 409) {
            Swal.fire(error.mensaje, '', 'warning');
          } else {
            Swal.fire('Error al crear la urgencia', '', 'error');
          }
        } else {
          Swal.fire('Error de conexión.', '', 'error');
        }
      })
  }
  ///////////////////////////////////
  //// Select of Companies //////////
  ///////////////////////////////////

  const handleCompaniesChange = async (company: any) => {
    setSelectedCompany(company.id);
    setSelectCompanies(false);
    selectCompaniesAutomatic(company.id)
  };

  const [filteredBranchOffices, setFilteredBranchOffices] = useState<any[]>([]);

  const selectCompaniesAutomatic = async (company_id: number) => {
    const filter = await branchOfficeXCompanies.filter((branchOffice: any) => branchOffice.empresa_id === company_id);
    setFilteredBranchOffices(filter)
    setSelectedBranchOffice(filter.length > 0 ? filter[0].id : null)
    // console.log(selectedBranchOffice);

  }

  ///////////////////////////////////
  //// Select of BranchOffices //////
  ///////////////////////////////////

  const handleBranchOfficesChange = (branchOffice: any) => {
    setSelectedBranchOffice(branchOffice.id);
    setSelectBranchOffices(false);
  };

  ///////////////////////////////////
  ////// Select of Types Users //////
  ///////////////////////////////////

  const typesUsersChange = (typeUser_id: number) => {
    setSelectedTypeUser(typeUser_id);
    setSelectTypeUsers(false);
  }

  const [grupos_nuevos, setGruposNuevos] = useState<any[]>([])
  const [grupos_eliminar, setGrupos_eliminar] = useState<any[]>([])

  const addUserGroups = () => {
    console.log('ug',selectedUserGroup);
    
    if (selectedUserGroup != null) {
      if (!grupos_nuevos.includes(selectedUserGroup)) {
        setGruposNuevos([...grupos_nuevos, selectedUserGroup]);
      } else {
        console.log('El grupo de usuarios ya está en la lista.');

      }
    }
  };

  // Función para eliminar un grupo de usuarios seleccionado
  const deleteUserGroup = (item: any) => {
    const filter = grupos_nuevos.filter((x: number) => x !== item);
    setGruposNuevos(filter);
    setGrupos_eliminar([...grupos_eliminar, item]);
  };

  const addUsers = () => {
    console.log(selectUser);
    
    if (selectUser !== null) {
      if (!subordinados_nuevos.includes(selectUser)) {
        setSubordinadosNuevos([...subordinados_nuevos, selectUser]);
      }
    } else {
      // Manejar el caso cuando no hay usuario seleccionado
      console.log('No se ha seleccionado ningún usuario.');
    }
  };



  // Función para eliminar un usuario seleccionado
  const deleteUser = (item: number) => {
    // Filtrar el usuario a eliminar del arreglo subordinados_nuevos
    const filter = subordinados_nuevos.filter((x: number) => x !== item);
    setSubordinados_eliminar([...subordinados_eliminar, item])
    setSubordinadosNuevos(filter);
  };


  const openSelectUserGroups = () => {
    setSelectUserGroups(!selectUserGroups)

  }

  const userGroupsChange = (userGroup_id: number) => {
    setSelectUserGroup(userGroup_id)
    setSelectUserGroups(!selectUserGroups)
  }

  const usersChange = (user: any) => {
    setSelectUser(user.id)
    setSelectUsers(!selectUsers)

  }

  const handleCreateUsers = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let tipo_us = selectedTypeUser
    let id_usuario_crea = user_id
    let sucursal_id = selectedBranchOffice
    const data_user = {
      sucursal_id,
      nombre,
      email,
      password,
      tipo_us,
      id_usuario_crea
    }
    console.log(data_user);

    const data_ext = {
      sucursales_nuevas,
      sucursales_eliminar,
      areas_eliminar,
      grupos_nuevos,
      subordinados_eliminar,
      subordinados_nuevos,
      areas_nuevas,
      grupos_eliminar,
      usuarios_comercial: addUsuariosComercial,
      usuarios_comercial_eliminar: UsuariosComercialElim
    }
    try {
      if (nombre === '') {
        setWarningNombre(true);
      } else {
        setWarningNombre(false);
      }

      if (email === '') {
        setWarningEmail(true);
      } else {
        setWarningEmail(false);
      }

      if (password === '') {
        setWarningPassword(true);
      } else {
        setWarningPassword(false);
      }

      // if (selectedCompany === null) {
      //   setWarningSelectCompany(true);
      // } else {
      //   setWarningSelectCompany(false);
      // }

      // if (selectedBranchOffice === null) {
      //   setWarningSelectBranchOffice(true);
      // } else {
      //   setWarningSelectBranchOffice(false);
      // }

      // if (selectedTypeUser === null) {
      //   setWarningSelectTypeUser(true);
      // } else {
      //   setWarningSelectTypeUser(false);
      // }

      if (data_ext.grupos_nuevos.length === 0) {
        setWarningSelectUserGroup(true);
      } else {
        setWarningSelectUserGroup(false);
      }


      if (data_ext.sucursales_nuevas.length === 0 ) {
        setWarningSelectBranchOffices(true);
      } else {
        setWarningSelectBranchOffices(false);
      }
      console.log(data_ext);
      
      if (nombre === '' || email === '' || password === '' || selectedCompany === null || selectedBranchOffice === null || 
        selectedTypeUser === null || data_ext.grupos_nuevos.length === 0 || data_ext.sucursales_nuevas.length === 0) {
        return;
      }

      // Si todos los campos están llenos, crear usuarios y obtener datos
      await createUsers(data_user, data_ext);
      await getUsuarios()
      setModal(false);
      setNombre('');
      setEmail('');
      setPassword('');
      setSelectedCompany(null);
      getBranchOfficeXCompanies(null);
      setSelectedBranchOffice(null);
      setSelectedTypeUser(null);

      setSucursalesNuevas([])
      setSucursales_eliminar([])
      setAreasNuevas([])
      setAreas_eliminar([])
      setSubordinadosNuevos([])

      setSubordinados_eliminar([])

      setGrupos_eliminar([])
      setaddUsuariosComercial([])
      UsuariosComercialElim([])





      // console.log(sucursales_nuevas)
      // console.log(sucursales_eliminar)
      // console.log(areas_nuevas)
      // console.log(areas_eliminar)
      // console.log(subordinados_nuevos)
      // console.log(subordinados_eliminar)



      getUsers('', user_id, user_id, false, 0)

    } catch (error) {
      // Manejar el error aquí
    }


  };



  const modalCreate = () => {

    setModal(true);



  };

  const closeModalCreate = () => {
    setModal(false);

    setNombre('');
    setEmail('');
    setPassword('');
    setSelectedCompany(null);
    getBranchOfficeXCompanies(null);
    setSelectedBranchOffice(null);

    setSucursalesNuevas([])
    setSucursales_eliminar([])
    setAreasNuevas([])
    setAreas_eliminar([])
    setSubordinadosNuevos([])

    setSubordinados_eliminar([])


    setGrupos_eliminar([])

    setWarningEmail(false)
    setWarningNombre(false)
    setWarningPassword(false)
  }

  const openSelectCompanies = () => {
    setSelectCompanies(!selectCompanies)
  }

  const openSelectBranchOffices = () => {
    setSelectBranchOffices(!selectBranchOffices)
  }


  const openSelectTypeUsers = () => {
    setSelectTypeUsers(!selectTypeUsers)
  }

  const openSelectUsers = () => {
    setSelectUsers(!selectUsers)
  }

  const [modalStates, setModalStates] = useState<any>({});



  const toggleModal = async (sucursal: any) => {

    setModalStates((prevState: any) => ({
      ...prevState,
      [sucursal]: !prevState[sucursal],
    }));
    getAreasXBranchOfficesXUsers(0, user_id)
  };



  const toggleCheckbox = (sucursal_id: any, area_id: any) => {
    if (area_id) {
      const areaExists = areas_nuevas.includes(area_id);
      if (!areaExists) {
        // Agrega el área nueva solo si no existe en el estado
        setAreasNuevas(prevState => [...prevState, area_id]);
      } else {
        // Elimina el área nueva solo si ya existe en el estado
        setAreasNuevas(prevState => prevState.filter(id => id !== area_id));
      }
    } else {
      // Si area_id es null, significa que el cambio proviene del checkbox de sucursal
      const sucursalExists = sucursales_nuevas.includes(sucursal_id);
      if (!sucursalExists) {
        setSucursalesNuevas(prevState => [...prevState, sucursal_id]);
      } else {
        setSucursalesNuevas(prevState => prevState.filter(id => id !== sucursal_id));
      }
    }
  };



  const [updateBranchPermissions, setUpdateBranchPermissions] = useState<any[]>([])
  const [updateAreasPermissions, setUpdateAreasPermissions] = useState<any[]>([])

  const [user, setUser] = useState<number | null>(null)
  const [usersGroupsExist, setUsersGroupsExist] = useState<any[]>([])
  const [userGroupDelete, setUserGroupDelete] = useState<any[]>([])

  const [usersExist, setUsersExis] = useState<any[]>([])
  const [usersDelete, setUsersDelete] = useState<any[]>([])

  // Edits Companies
  const openModalUpdate = async (user: any) => {
    setModalUpdate(true)
    setUser(user.id)
    setNombre(user.nombre);
    setEmail(user.email);
    setPassword(user.password);
    setSelectedCompany(user.empresa_id);
    getBranchOfficeXCompanies(user.empresa_id);
    setSelectedBranchOffice(user.sucursal_id);
    setSelectedTypeUser(user.tipo_us);
    setUpdateBranchPermissions(user.sucursales_exist)
    setUpdateAreasPermissions(user.areas_exist)
    setUsersGroupsExist(user.grupos_exist)
    setUsersExis(user.subordinados_exist)
    setaddUsuariosComercial(user.usuarios_comercial)



  }

  const addUpdateUserGroups = () => {
    if (selectedUserGroup != null) {
      const userGroup = userGroups.find((x: any) => x.id === selectedUserGroup);
      if (userGroup) {
        let exist = usersGroupsExist.some((group) => group.id === userGroup.id);
        if (exist) {
          console.log('El grupo seleccionado ya existe');
        } else {
          setUsersGroupsExist([...usersGroupsExist, userGroup]);
        }
      }
    }
  };



  // Función para eliminar un grupo de usuarios seleccionado
  const deleteUpdateUserGroup = (item: any) => {
    const filter = usersGroupsExist.filter((x: number) => x !== item);
    setUsersGroupsExist(filter);
    setUserGroupDelete([...userGroupDelete, item]);
  };


  const addUpdateUsers = () => {
    if (selectUser !== null) {
      const user = usuarios.find((x: any) => x.id === selectUser);
      if (user) {
        let exist = usersExist.some((x: any) => x.id === user.id);
        if (exist) {
          console.log('El grupo seleccionado ya existe');
        } else {
          setUsersExis([...usersExist, user]);
        }
      } else {
        console.log('No se encontró el usuario seleccionado');
      }
    }
  };




  const deleteUpdateUser = (item: number) => {
    const filter = usersExist.filter((x: number) => x !== item);
    setUsersExis(filter);
    setUsersDelete([...usersDelete, item])

  };

  const closeModalUpdate = () => {
    setModalUpdate(false)
    setNombre('');
    setEmail('');
    setPassword('');
    setSelectedCompany(null);
    getBranchOfficeXCompanies(null);
    setSelectedBranchOffice(null);
    setSelectedTypeUser(null);
    setSucursalesNuevas([])
    setAreasNuevas([])
    setGruposNuevos([])
    setUpdateBranchPermissions([])
    setUpdateAreasPermissions([])




  }




  const handleUpdateUsers = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let tipo_us = selectedTypeUser
    let sucursalesNewTmp: any = []
    let areasNewTmp: any = []
    await updateBranchPermissions.forEach((x: any) => {
      setSucursalesNuevas(prevGrupos => [...prevGrupos, x.id]);
      sucursalesNewTmp.push(x.id)
    });

    await updateAreasPermissions.forEach((x: any) => {
      setAreasNuevas(prevGrupos => [...prevGrupos, x.id]);
      areasNewTmp.push(x.id)
    });





    const id_userGroup = usersGroupsExist.filter(x => !x.exist).map(x => x.id);
    let grupos_nuevos: any[] = []
    grupos_nuevos.push(...id_userGroup)

    const users_ids = usersExist.filter(x => !x.exist).map(x => x.id);
    let subordinados_nuevos: any[] = []
    subordinados_nuevos.push(...users_ids)


    let grupos_eliminar: any[] = [];

    let subordinados_eliminar: any[] = [];

    userGroupDelete.forEach((x: any) => {
      grupos_eliminar.push(x.id);
    });

    usersDelete.forEach((x: any) => {
      subordinados_eliminar.push(x.id);
    });


    let password = ''

    if (nombre === '') {
      setWarningNombre(true);
    } else {
      setWarningNombre(false);
    }

    if (email === '') {
      setWarningEmail(true);
    } else {
      setWarningEmail(false);
    }

    // if (selectedCompany === null) {
    //   setWarningSelectCompany(true);
    // } else {
    //   setWarningSelectCompany(false);
    // }

    // if (selectedBranchOffice === null) {
    //   setWarningSelectBranchOffice(true);
    // } else {
    //   setWarningSelectBranchOffice(false);
    // }

    // if (selectedTypeUser === null) {
    //   setWarningSelectTypeUser(true);
    // } else {
    //   setWarningSelectTypeUser(false);
    // }





    if (nombre === '' || email === '' || selectedCompany === null || selectedBranchOffice === null || selectedTypeUser === null) {
      return;
    }
    console.log('addUsuariosComercial', addUsuariosComercial);
    
    // Si todos los campos están llenos, crear usuarios y obtener datos
    await putUsers(user, selectedBranchOffice, nombre, email, password, tipo_us, sucursalesNewTmp,
      sucursales_eliminar, areasNewTmp, areas_eliminar, subordinados_nuevos, subordinados_eliminar, grupos_nuevos, grupos_eliminar, addUsuariosComercial,UsuariosComercialElim);
    await getUsuarios()
    setGrupos_eliminar([])
    setSubordinadosNuevos([])
    setSubordinados_eliminar([])

    setSucursalesNuevas([])
    setAreasNuevas([])
    setUpdateBranchPermissions([])
    setUpdateAreasPermissions([])
    setModalUpdate(false)
    try {

    } catch {

    }

  }

  const [modalStatesUpdate, setModalStatesUpdate] = useState<any>({});

  const toggleUpdateModal = (sucursal_id: any) => {
    setModalStatesUpdate((prevState: any) => ({
      ...prevState,
      [sucursal_id]: !prevState[sucursal_id]
    }));
    getAreasXBranchOfficesXUsers(0, user_id)

  };


  const toggleUpdateBranch = (office: any) => {
    const sucursalExists = updateBranchPermissions.some(sucursal => sucursal.id === office.id);
    const sucursalback = updateBranchPermissions.filter(sucursal => sucursal.id === office.id);

    if (!sucursalExists) {
      // Agrega la sucursal al estado si no existe
      setUpdateBranchPermissions(prevState => [...prevState, office]);
    } else {
      if ('exist' in sucursalback[0]) {
        if (sucursalback[0].exist) {
          setSucursales_eliminar(prevState => [...prevState, office.id])
        }
      }
      setUpdateBranchPermissions(prevState => prevState.filter(sucursal => sucursal.id !== office.id));
    }
  }


  const toggleUpdateCheckbox = (area: any) => {
    if (area.id) {
      const areaExists = updateAreasPermissions.some(x => x.id === area.id);
      const areaback = updateAreasPermissions.filter(x => x.id === area.id);
      if (!areaExists) {
        // Agrega la area al estado si no existe
        setUpdateAreasPermissions(prevState => [...prevState, area]);
      } else {
        // Elimina la sucursal del estado si ya existe
        if ('exist' in areaback[0]) {
          if (areaback[0].exist) {
            setAreas_eliminar(prevState => [...prevState, area.id])

          }
        }
        setUpdateAreasPermissions(prevState => prevState.filter(x => x.id !== area.id));
      }
    }
  };




  const styleWarningNombre = {
    transition: 'all 1000ms',
    opacity: warningNombre === true ? '1' : '',
    height: warningNombre === true ? '23px' : ''
  };

  const styleWarningEmail = {
    transition: 'all 1000ms',
    opacity: warningEmail === true ? '1' : '',
    height: warningEmail === true ? '23px' : ''
  };
  const styleWarningPassword = {
    transition: 'all 1000ms',
    opacity: warningPassword === true ? '1' : '',
    height: warningPassword === true ? '23px' : ''
  };

  const [addUsuariosComercial, setaddUsuariosComercial] = useState<any>([])
  const [UsuariosComercialElim, setUsuariosComercialElim] = useState<any>([])

  const agregarUsuariosParaComercial = () => {
    let filter_us = usuariosComercial.filter((x:any)=> x.ContactID==UsuarioCSelected)[0]
    let data = {
      id_empresa: selectedIds?.empresas_comercial?.id,
      empresa: selectedIds?.empresas_comercial?.razon_social,
      id_usuario: parseInt(UsuarioCSelected),
      usuario: filter_us.FirstName + ' ' + filter_us.LastNameFather + ' ' + filter_us.LastNameMother
    }
    let exist = addUsuariosComercial.filter((x:any)=>x.id_empresa==selectedIds?.empresas_comercial?.id)
    if (exist.length >= 1) {
      Swal.fire('Notificacion', 'Cada empresa solo puede tener un usuario de comercial enlazado', 'warning')
      return
    }
    setaddUsuariosComercial((prev: any) => {
      return [...prev, data];
    });
  }
  const deleteUsuariosComercial = (item: any) => {
    const filter = addUsuariosComercial.filter((x: number) => x !== item);
    setaddUsuariosComercial(filter);
    if (item.id != undefined) {
      setUsuariosComercialElim([...UsuariosComercialElim, item.id]);
    }
  };
  return (
    <div className='users'>
      <div className='users__users'>
        <div className='create__users_btn-container'>
          <button className='btn__general-purple' onClick={modalCreate}>Crear nuevo usuario</button>
        </div>
        <br />
        <hr />
        <div className=''>
          <label className='label__general'>Buscar:</label>
          <input className='inputs__general' type="text" placeholder='Ingresa un nombre de usuario a buscar y presiona enter...'
            value={searcher.nombre} onChange={(e) => DynamicVariables.updateAnyVar(setSearcher, "nombre", e.target.value)}
            onKeyUp={(event) => event.key === 'Enter' && getUsuarios()} />
        </div>
        <hr />
        <br />
        <div className={`overlay__users ${modal ? 'active' : ''}`}>
          <div className={`popup__users ${modal ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__users" onClick={closeModalCreate}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
            </a>
            <p className='title__modals'>Crear nuevo usuario</p>
            <form className='conatiner__create_users' onSubmit={handleCreateUsers}>
              <div className='row'>
                <div className='col-4 md-col-12'>
                  <label className='label__general'>Nombre</label>
                  <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div>
                  <input className={`inputs__general ${warningNombre ? 'warning' : ''}`} type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder='Ingresa el nombre' />
                </div>
                <div className='col-4 md-col-12'>
                  <label className='label__general'>Email</label>
                  <div className='warning__general' style={styleWarningEmail}><small >Este campo es obligatorio</small></div>
                  <input className={`inputs__general ${warningEmail ? 'warning' : ''}`} type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Ingresa tu email' />
                </div>
                <div className='col-4 md-col-12'>
                  <label className='label__general'>Password</label>
                  <div className='warning__general' style={styleWarningPassword}><small >Este campo es obligatorio</small></div>
                  <div className={`container__password_users ${warningPassword ? 'warning' : ''}`}>
                    <input className='input__password_users' type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Ingresa tu contraseña' />
                    <svg onClick={() => setShowPassword(!showPassword)} className='see__password_users' xmlns="http://www.w3.org/2000/svg" height="25" width="25" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" /></svg>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-4 md-col-12'>
                  <div className='select__container'>
                    <label className='label__general'>Empresas</label>
                    <div className='select-btn__general'>
                      <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                        <p>{selectedCompany ? companiesXUsers.find((s: { id: number }) => s.id === selectedCompany)?.razon_social : 'Selecciona'}</p>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                      </div>
                      <div className={`content ${selectCompanies ? 'active' : ''}`}>
                        <ul className={`options ${selectCompanies ? 'active' : ''}`} style={{ opacity: selectCompanies ? '1' : '0' }}>
                          {companiesXUsers && companiesXUsers.map((company: any) => (
                            <li key={uuidv4()} onClick={() => handleCompaniesChange(company)}>
                              {company.razon_social}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-4 md-col-12'>
                  <div className='select__container'>
                    <label className='label__general'>Sucursales</label>
                    <div className='select-btn__general'>
                      <div className={`select-btn ${selectBranchOffices ? 'active' : ''}`} onClick={openSelectBranchOffices} >
                        <p>{selectedBranchOffice ? branchOfficeXCompanies.find((s: { id: number }) => s.id === selectedBranchOffice)?.nombre : 'Selecciona'}</p>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                      </div>
                      <div className={`content ${selectBranchOffices ? 'active' : ''}`} >
                        <ul className={`options ${selectBranchOffices ? 'active' : ''}`} style={{ opacity: selectBranchOffices ? '1' : '0' }}>
                          {filteredBranchOffices.map((branchOffice: any) => (
                            <li key={uuidv4()} onClick={() => handleBranchOfficesChange(branchOffice)}>
                              {branchOffice.nombre}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-4 md-col-12'>
                  <div className='select__container'>
                    <label className='label__general'>Tipo Usuario</label>
                    <div className='select-btn__general'>
                      <div className={`select-btn ${selectTypeUsers ? 'active' : ''}`} onClick={openSelectTypeUsers}>
                        <p>{selectedTypeUser ? typesUsers.find((s: { id: number }) => s.id === selectedTypeUser)?.nombre : 'Selecciona'}</p>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                      </div>
                      <div className={`content ${selectTypeUsers ? 'active' : ''}`}>
                        <ul className={`options ${selectTypeUsers ? 'active' : ''}`} style={{ opacity: selectTypeUsers ? '1' : '0' }}>
                          {typesUsers.map((typeUser_id: any) => (
                            <li key={uuidv4()} onClick={() => typesUsersChange(typeUser_id.id)}>
                              {typeUser_id.nombre}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>



              </div>
              <div className='row'>
                <div className='col-6 md-col-12'>
                  <div className='users__form_row-three-left-one'>
                    <div className='select__container'>
                      <p className='label__general'>Grupos de usuarios</p>
                      {warningSelectUserGroup ? <div className='warning__general'><small >Este campo es obligatorio</small></div> : ''}
                      <div className='select-btn__general'>
                        <div className={`select-btn ${selectUserGroups ? 'active' : ''}`} onClick={openSelectUserGroups}>
                          <p>{selectedUserGroup ? userGroups.find((s: { id: number }) => s.id === selectedUserGroup)?.nombre : 'Selecciona'}</p>
                          <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                        </div>
                        <div className={`content ${selectUserGroups ? 'active' : ''}`}>
                          <ul className={`options ${selectUserGroups ? 'active' : ''}`} style={{ opacity: selectUserGroups ? '1' : '0' }}>
                            <div className='search'>
                              <input type="text" onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} placeholder="Buscar..." />
                            </div>
                            <div className='content__options'>
                              {userGroups && userGroups
                                .filter((userGroup_id: any) => userGroup_id.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map((userGroup_id: any) => (
                                  <li key={uuidv4()} onClick={() => userGroupsChange(userGroup_id.id)}>
                                    {userGroup_id.nombre}
                                  </li>
                                ))
                              }
                            </div>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div>
                      <button className='btn__general-purple' type='button' onClick={addUserGroups}>Agregar</button>

                    </div>
                  </div>
                  <div className='users__form_row-three-left-two'>
                    <div className='container__table_user-groups-left'>
                      <div className='table__user-groups_left'>
                        <div className='table__head'>
                          <div className='thead'>
                            <div className='th'>
                              <p className='table_users_title'>Grupo de Usuarios</p>
                            </div>
                          </div>
                        </div>
                        {grupos_nuevos.length > 0 ? (
                          <div className='tbody__container_user-groups-left'>
                            <div className='tbody__user-groups-left'>
                              {grupos_nuevos.map((group: any, index: number) => (
                                <div className='td' key={index}>
                                  <li className='text'>
                                    {userGroups.find((group_id: { id: number }) => group_id.id === group)?.nombre}
                                  </li>
                                  <button className='btn__delete_users' onClick={() => deleteUserGroup(group)}>Eliminar</button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className='text'>No hay grupos de usuarios seleccionados</p>
                        )}
                      </div>
                    </div>
                    <Toaster
                      toastOptions={{
                        className: 'toastify__toast--warning',
                      }} />
                  </div>
                </div>
                <div className='col-6 md-col-12'>
                  <div className='users__form_row-three-right-one'>
                    <div className='select__container'>
                      <label className='label__general'>Usuarios</label>
                      <div className='select-btn__general'>
                        <div className={`select-btn ${selectUsers ? 'active' : ''}`} onClick={openSelectUsers}>
                          <p>{selectUser ? usuarios.find((s: { id: number }) => s.id === selectUser)?.nombre : 'Selecciona'}</p>
                          <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                        </div>
                        <div className={`content ${selectUsers ? 'active' : ''}`}>
                          <ul className={`options ${selectUsers ? 'active' : ''}`} style={{ opacity: selectUsers ? '1' : '0' }}>
                            <div className='search'>
                              <input type="text" onChange={(e) => setUserSearchTerm(e.target.value)} value={userSearchTerm} placeholder="Buscar..." />
                            </div>
                            {usuarios && usuarios.filter((user: any) => user.nombre.toLowerCase().includes(userSearchTerm.toLowerCase()))
                              .map((user: any) => (
                                <li key={uuidv4()} onClick={() => usersChange(user)}>
                                  {user.nombre}
                                </li>
                              ))
                            }
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div>
                      <button className='btn__general-purple' onClick={addUsers} type='button'>Agregar</button>
                    </div>
                  </div>
                  <div className='users__form_row-three-right-two'>
                    <div className='container__table_users_right'>
                      <div className='table__users_right'>
                        <div className='table__head'>
                          <div className='thead'>
                            <div className='th'>
                              <p className='table_users_title'>Usuarios</p>
                            </div>
                            <div className='th'>
                              <p className='table_users_title'>Email</p>
                            </div>
                          </div>
                        </div>
                        {subordinados_nuevos.length > 0 ? (
                          <div className='tbody__container_users_right'>
                            {subordinados_nuevos.map((user: any, index: number) => (
                              <div className='tbody__users_right' key={index}>
                                <div className='td'>
                                  <li className='text'>
                                    {usuarios.find((user_id: any) => user_id.id === user)?.nombre}
                                  </li>
                                </div>
                                <div className='td'>
                                  <li className='text'>
                                    {usuarios.find((user_id: any) => user_id.id === user)?.email}
                                  </li>
                                </div>
                                <div>
                                  <button className='btn__delete_users' onClick={() => deleteUser(user)}>Eliminar</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className='text'>No hay usuarios seleccionados</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='users__form_row-four'>
                <div className='container__users_title-branchOffice-Areas'>
                  <p className='pop__branch_modal-title'>Acceso a sucursales</p>
                  {warningSelectBranchOffices ? <div className='warning__general'><small >Por favor, asegúrate de seleccionar una sucursal y un área.</small></div> : ''}
                </div>
                <div className='btns__branchOffices' >
                  {branchOfficeXCompanies.map((office: any) => (
                    <div key={office.id}>
                      <div className='btn'>
                        <button className='btn__general-purple' type='button' onClick={() => toggleModal(office.id)}>{office.nombre}</button>
                      </div>
                      <div className={`overlay__users_branchOffice ${modalStates[office.id] ? 'active' : ''}`}>
                        <div className={`popup__users_branchOffice ${modalStates[office.id] ? 'active' : ''}`}>
                          <div>
                            <a href="#" className="btn-cerrar-popup__users_branchOffice" onClick={() => toggleModal(office.id)}>
                              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                            </a>
                          </div>
                          <div>
                            <p className='text'>sucursal {office.nombre}</p>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={sucursales_nuevas.includes(office.id)}
                                onChange={() => toggleCheckbox(office.id, null)} // Solo se pasa el ID de la sucursal
                              />
                              <span className="slider"></span>
                            </label>
                          </div>
                          <div className='users__permissions'>
                            <div className='users__permissions_left'></div>
                            <div className='users__permissions_right'>
                              <div className='conatiner__lines_permissions'></div>
                              <div className='conatiner__areas_permissions'>
                                <svg className='sort-up' xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 320 512"><path d="M182.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z" /></svg>
                                <div className='areas__permissions'>
                                  {areasXBranchOfficesXUsers.filter((area: any) => area.sucursal_id === office.id).map((area: any) => (
                                    <div key={uuidv4()}>
                                      <p className='text'>{area.nombre}</p>
                                      <label className="switch">
                                        <input
                                          type="checkbox"
                                          checked={areas_nuevas.includes(area.id)} // Solo se pasa el ID del área
                                          onChange={() => toggleCheckbox(office.id, area.id)} // Se pasa el ID de la sucursal y del área
                                        />
                                        <span className="slider"></span>
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <br />
              <b>Agregar Usuario de Compaqi Comercial (Estos usuarios se agregan por empresa)</b>
              <br />
              <br />
              <div className='row'>
                <div className='col-6'>
                  <Select dataSelects={companiesLocal} instanceId='empresas_comercial' nameSelect={'Empresas'}></Select>
                </div>
                <div className='col-5'>
                <label className='label__general'>Usuario Comercial</label>
                  <select className={`inputs__general`}
                    onChange={(e) => setUsuarioCSelected(e.target.value)}>
                      <option key={0}>Ninguno</option>
                    {usuariosComercial?.map((option: any, i: number) => (
                      <option key={i} value={option.ContactID}>
                        {option.FirstName} {option.LastNameFather} {option.LastNameMother}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='col-1'><button className='btn__general-purple' type='button' onClick={agregarUsuariosParaComercial}>Agregar</button></div>
              </div>
              <br />
              <div className='row'>

                <div className='col-12'>
                  {addUsuariosComercial.length > 0 ? (
                    <div className='tbody__container_user-groups-left'>
                      <div className='tbody__user-groups-left'>
                        {addUsuariosComercial.map((dat: any, index: number) => (
                          <div className='td' key={index}>
                            <li className='text'>
                                {dat.empresa} - {dat.usuario}
                            </li>
                            <button className='btn__delete_users' onClick={() => deleteUsuariosComercial(dat)}>Eliminar</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className='text'>No hay Usuario de comercial</p>
                  )}
                </div>
              </div>
              <div className='container__btns_usergroups'>
                <button className='btn__general-purple' type='submit'>Guardar Usuario</button>
              </div>
            </form>
          </div>
        </div>
        <div className='table__users' >
          <div>
            {usuarios ? (
              <div>
                <p>Tus Usuarios {usuarios.length}</p>
              </div>
            ) : (
              <p>No hay Usuarios</p>
            )}
          </div>
          <div className='table__head'>
            <div className='thead'>
              <div className='th'>
                <p className=''>Nombre</p>
              </div>
              <div className='th'>
                <p>Email</p>
              </div>
              <div className='th'>
                <p>Empresa Sucursal</p>
              </div>
              <div className='th'>
                <p>Tipo</p>
              </div>
              <div className='th'>
              </div>
            </div>
          </div>
          {usuarios ? (
            <div className='table__body'>
              {usuarios.map((user: any, index: number) => (
                <div className='tbody__container' key={index}>
                  <div className='tbody'>
                    <div className='td'>
                      <p>{user.nombre}</p>
                    </div>
                    <div className='td'>
                      <p>{user.email}</p>
                    </div>
                    <div className='td'>
                      <p>{user.sucursal}</p>
                    </div>
                    <div className='td'>
                      <p>{user.tipo}</p>
                    </div>
                    <div className='td'>
                      <button className='general__edit_button' onClick={() => openModalUpdate(user)}>Editar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          ) : (
            <p>Cargando datos...</p>
          )}
        </div>
        <div className={`overlay__edit_users ${modalUpdate ? 'active' : ''}`}>
          <div className={`popup__edit_users ${modalUpdate ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__edit_users" onClick={closeModalUpdate}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
            </a>
            <h3 className='title__modals'>Actualizar usuario</h3>
            <form className='conatiner__create_users' onSubmit={handleUpdateUsers}>
              <div className='row'>
                <div className='col-4 md-col-6 sm-col-12'>
                  <label className='label__general'>Nombre</label>
                  <input className='inputs__general' type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder='Ingresa el nombre' />
                </div>
                <div className='col-4 md-col-6 sm-col-12'>
                  <label className='label__general'>Email</label>
                  <input className='inputs__general' type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Ingresa tu email' />
                </div>
                <div className='col-4 md-col-6 sm-col-12'>
                  <label className='label__general'>Password</label>
                  <div className='container__password_users'>
                    <input className='input__password_users' type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Ingresa tu contraseña' />
                    <svg onClick={() => setShowPassword(!showPassword)} className='see__password_users' xmlns="http://www.w3.org/2000/svg" fill='#162a9c' height="25" width="25" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" /></svg>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-4 md-col-12'>
                  <div className='select__container'>
                    <label className='label__general'>Empresas</label>
                    <div className='select-btn__general'>
                      <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                        <p>{selectedCompany ? companiesXUsers.find((s: { id: number }) => s.id === selectedCompany)?.razon_social : 'Selecciona'}</p>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                      </div>
                      <div className={`content ${selectCompanies ? 'active' : ''}`}>
                        <ul className={`options ${selectCompanies ? 'active' : ''}`} style={{ opacity: selectCompanies ? '1' : '0' }}>
                          {companiesXUsers && companiesXUsers.map((company: any) => (
                            <li key={uuidv4()} onClick={() => handleCompaniesChange(company)}>
                              {company.razon_social}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-4 md-col-12'>
                  <div className='select__container'>
                    <label className='label__general'>Sucursales</label>
                    <div className='select-btn__general'>
                      <div className={`select-btn ${selectBranchOffices ? 'active' : ''}`} onClick={openSelectBranchOffices} >
                        <p>{selectedBranchOffice ? branchOfficeXCompanies.find((s: { id: number }) => s.id === selectedBranchOffice)?.nombre : 'Selecciona'}</p>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                      </div>
                      <div className={`content ${selectBranchOffices ? 'active' : ''}`} >
                        <ul className={`options ${selectBranchOffices ? 'active' : ''}`} style={{ opacity: selectBranchOffices ? '1' : '0' }}>
                          {filteredBranchOffices.map((branchOffice: any) => (
                            <li key={uuidv4()} onClick={() => handleBranchOfficesChange(branchOffice)}>
                              {branchOffice.nombre}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-4 md-col-12'>
                  <div className='select__container'>
                    <label className='label__general'>Tipo Usuario</label>
                    <div className='select-btn__general'>
                      <div className={`select-btn ${selectTypeUsers ? 'active' : ''}`} onClick={openSelectTypeUsers}>
                        <p>{selectedTypeUser ? typesUsers.find((s: { id: number }) => s.id === selectedTypeUser)?.nombre : 'Selecciona'}</p>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                      </div>
                      <div className={`content ${selectTypeUsers ? 'active' : ''}`}>
                        <ul className={`options ${selectTypeUsers ? 'active' : ''}`} style={{ opacity: selectTypeUsers ? '1' : '0' }}>
                          {typesUsers.map((typeUser_id: any) => (
                            <li key={uuidv4()} onClick={() => typesUsersChange(typeUser_id.id)}>
                              {typeUser_id.nombre}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-6 md-col-12'>
                  <div className='users__form_row-three-left-one'>
                    <div className='select__container'>
                      <p className='label__general'>Grupos de usuarios</p>
                      {warningSelectUserGroup ? <div className='warning__general'><small >Este campo es obligatorio</small></div> : ''}
                      <div className='select-btn__general'>
                        <div className={`select-btn ${selectUserGroups ? 'active' : ''}`} onClick={openSelectUserGroups}>
                          <p>{selectedUserGroup ? userGroups.find((s: { id: number }) => s.id === selectedUserGroup)?.nombre : 'Selecciona'}</p>
                          <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                        </div>
                        <div className={`content ${selectUserGroups ? 'active' : ''}`}>
                          <ul className={`options ${selectUserGroups ? 'active' : ''}`} style={{ opacity: selectUserGroups ? '1' : '0' }}>
                            <div className='search'>
                              <input type="text" onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} placeholder="Buscar..." />
                            </div>
                            <div className='content__options'>
                              {userGroups && userGroups
                                .filter((userGroup_id: any) => userGroup_id.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map((userGroup_id: any) => (
                                  <li key={uuidv4()} onClick={() => userGroupsChange(userGroup_id.id)}>
                                    {userGroup_id.nombre}
                                  </li>
                                ))
                              }
                            </div>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div>
                      <button className='btn__general-purple' type='button' onClick={addUpdateUserGroups}>Agregar</button>
                    </div>
                  </div>
                  <div className='users__form_row-three-left-two'>
                    <div className='container__table_user-groups-left'>
                      <div className='table__user-groups_left'>
                        <div className='table__head'>
                          <div className='thead'>
                            <div className='th'>
                              <p className='table_users_title'>Grupo de Usuarios</p>
                            </div>
                          </div>
                        </div>
                        {usersGroupsExist.length > 0 ? (
                          <div className='tbody__container_user-groups-left'>
                            <div className='tbody__user-groups-left'>
                              {usersGroupsExist.map((group: any) => (
                                <div className='td' key={uuidv4()}>
                                  <li className='text'>{userGroups.find((x: { id: number }) => x.id === group.id)?.nombre}</li>
                                  <button className='btn__delete_user-groups' onClick={() => deleteUpdateUserGroup(group)}>Eliminar</button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className='text'>No hay grupos de usuarios seleccionados</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-6 md-col-12'>
                  <div className='users__form_row-three-right-one'>
                    <div className='select__container'>
                      <label className='label__general'>Usuarios</label>
                      <div className='select-btn__general'>
                        <div className={`select-btn ${selectUsers ? 'active' : ''}`} onClick={openSelectUsers}>
                          <p>{selectUser ? usuarios.find((s: { id: number }) => s.id === selectUser)?.nombre : 'Selecciona'}</p>
                          <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                        </div>
                        <div className={`content ${selectUsers ? 'active' : ''}`}>
                          <ul className={`options ${selectUsers ? 'active' : ''}`} style={{ opacity: selectUsers ? '1' : '0' }}>
                            <div className='search'>
                              <input type="text" onChange={(e) => setUserSearchTerm(e.target.value)} value={userSearchTerm} placeholder="Buscar..." />
                            </div>
                            {usuarios && usuarios.filter((user: any) => user.nombre.toLowerCase().includes(userSearchTerm.toLowerCase()))
                              .map((user: any) => (
                                <li key={uuidv4()} onClick={() => usersChange(user)}>
                                  {user.nombre}
                                </li>
                              ))
                            }
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div>
                      <button className='btn__general-purple' onClick={addUpdateUsers} type='button'>Agregar</button>
                    </div>
                  </div>
                  <div className='users__form_row-three-right-two'>
                    <div className='container__table_users_right'>
                      <div className='table__users_right'>
                        <div className='table__head'>
                          <div className='thead'>
                            <div className='th'>
                              <p className='table_users_title'>Usuarios</p>
                            </div>
                            <div className='th__users_right'>
                              <p className='table_users_title'>Email</p>
                            </div>
                          </div>
                        </div>
                        {usersExist.length > 0 ? (
                          <div className='tbody__container_users_right'>
                            {usersExist.map((user: any) => (
                              <div className='tbody__users_right' key={uuidv4()}>
                                <div className='td' >
                                  <li>
                                    {usuarios.find((user_id: any) => user_id.id === user.id)?.nombre}
                                  </li>
                                </div>
                                <div className='td'>
                                  <li>
                                    {usuarios.find((user_id: any) => user_id.id === user.id)?.email}
                                  </li>
                                </div>
                                <div>
                                  <button className='btn__delete_users' onClick={() => deleteUpdateUser(user)}>Eliminar</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className='text'>No hay grupos de usuarios seleccionados</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='users__form_row-four'>
                <p className='pop__branch_modal-title'>Acceso a sucursales</p>
                <div className='btns__branchOffices' >
                  {branchOfficeXCompanies.map((office: any, index: number) => (
                    <div key={index}>
                      <div className='btn'>
                        <button className='btn__general-purple' type='button' onClick={() => toggleUpdateModal(office.id)}>{office.nombre}</button>
                      </div>
                      <div className={`overlay__users_branchOffice ${modalStatesUpdate[office.id] ? 'active' : ''}`}>
                        <div className={`popup__users_branchOffice ${modalStatesUpdate[office.id] ? 'active' : ''}`}>
                          <div>
                            <a href="#" className="btn-cerrar-popup__users_branchOffice" onClick={() => toggleUpdateModal(office.id)}>
                              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                            </a>
                          </div>
                          <div>
                            <p className='text'>sucursal {office.nombre}</p>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={updateBranchPermissions.some(x => x.id === office.id)}
                                onChange={() => toggleUpdateBranch(office)}
                              />
                              <span className="slider"></span>
                            </label>
                          </div>
                          <div className='users__permissions'>
                            <div className='users__permissions_left'></div>
                            <div className='users__permissions_right'>
                              <div className='conatiner__lines_permissions'></div>
                              <div className='conatiner__areas_permissions'>
                                <svg className='sort-up' xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 320 512"><path d="M182.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z" /></svg>
                                <div className='areas__permissions'>
                                  {areasXBranchOfficesXUsers
                                    .filter((area: any) => area.sucursal_id === office.id)
                                    .map((area: any) => (
                                      <div key={index}>
                                        <p className='text'>{area.nombre}</p>
                                        <label className="switch">
                                          <input
                                            type="checkbox"
                                            checked={updateAreasPermissions.some(x => x.id === area.id)}
                                            onChange={() => toggleUpdateCheckbox(area)}
                                          />
                                          <span className="slider"></span>
                                        </label>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <br />
              <b>Agregar Usuario de Compaqi Comercial (Estos usuarios se agregan por empresa)</b>
              <br />
              <br />
              <div className='row'>
                <div className='col-6'>
                  <Select dataSelects={companiesLocal} instanceId='empresas_comercial' nameSelect={'Empresas'}></Select>
                </div>
                <div className='col-5'>
                <label className='label__general'>Usuario Comercial</label>
                  <select className={`inputs__general`}
                    onChange={(e) => setUsuarioCSelected(e.target.value)}>
                      <option key={0}>Ninguno</option>
                    {usuariosComercial?.map((option: any, i: number) => (
                      <option key={i} value={option.ContactID}>
                        {option.FirstName} {option.LastNameFather} {option.LastNameMother}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='col-1'><button className='btn__general-purple' type='button' onClick={agregarUsuariosParaComercial}>Agregar</button></div>
              </div>
              <br />
              <div className='row'>

                <div className='col-12'>
                  {addUsuariosComercial.length > 0 ? (
                    <div className='tbody__container_user-groups-left'>
                      <div className='tbody__user-groups-left'>
                        {addUsuariosComercial.map((dat: any, index: number) => (
                          <div className='td' key={index}>
                            <li className='text'>
                                {dat.empresa} - {dat.usuario}
                            </li>
                            <button className='btn__delete_users' onClick={() => deleteUsuariosComercial(dat)}>Eliminar</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className='text'>No hay grupos de usuarios seleccionados</p>
                  )}
                </div>
              </div>
              <div className='container__btns_usergroups'>
                <button className='btn__general-purple' type='submit'>Guardar articulo</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
