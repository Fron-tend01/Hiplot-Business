// RootPage.tsx
import React, { useEffect } from 'react';
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import RouteSales from '../../../routes/sections/processes/RouteSales';
import RouteProcesses from '../../../routes/sections/processes/RouteProcesses';
import RouteCatalogue from '../../../routes/sections/processes/RouteCatalogue';
import RouteWarehouses from '../../../routes/sections/processes/RouteWarehouses';
import RouteWeb from '../../../routes/sections/processes/RouteWeb';
import AnchorTag from '../../../components/rootPage/AnchorTag';
import './RootPage.css'
import { useNavigate } from "react-router-dom";
import { clearLocalStorage } from '../../../utils/localStorage.utility';
import useUserStore from '../../../zustand/General';
import { PrivateRoutes, PublicRoutes } from '../../../models/routes';
import Header from '../../../components/rootPage/Header/Header';
import Logo from '../../../assets/logo.png'
import APIs from '../../../services/services/APIs';

const RootHome: React.FC = () => {
  const userState = useUserStore(state => state.user);
  let user_id = userState.id
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [activeSidebar, setActiveSidebar] = useState<boolean>(false)
  
  const { resetUser, UserKey }: any = useUserStore()

  const [permisos, setPermisos] = useState<any>()

  useEffect(() => {
  
    getPermisos()

  }, [])
  const getPermisos = async () => {
    await APIs.getViewsXUsers(user_id)
        .then((Response: any) => {
            setPermisos(Response)
        })
        .catch((error) => {
            console.log(error)
        })
  }

  
  const toggleSubMenu = (index: any) => {
      setActiveMenuIndex((prevIndex) => (prevIndex === index ? null : index));
      
  };
  const sales = {
    backgroundColor: activeMenuIndex === 1 && activeSidebar === true ? '#5d35b0' : ''
  }

  const shopping = {
    backgroundColor: activeMenuIndex === 2 && activeSidebar === true ? '#5d35b0' : ''
  }
  const store = {
    backgroundColor: activeMenuIndex === 3 && activeSidebar === true ? '#5d35b0' : ''
  }

  const catalogue = {
    backgroundColor: activeMenuIndex === 4 && activeSidebar === true ? '#5d35b0' : ''
  }

  const processes = {
    backgroundColor: activeMenuIndex === 5 && activeSidebar === true ? '#5d35b0' : ''
  }


  const toggleMenu = () => {
      setActiveSidebar(!activeSidebar) 
  }

  const toggleClass = () => {
  };

  const navigate = useNavigate();

  const logOut = () => {
    clearLocalStorage(UserKey);
    resetUser();
    navigate(PublicRoutes.LOGIN, { replace: true });

  };




  return (
    <div className='root__dashboard'>
      <div className={`sidebar ${activeSidebar ? 'close' : ''}`}>
        <div className="logo__sidebar">
            <img className='logo__image' src={Logo} alt="" />
            <h2 className='title__logo'>Procura</h2>
        </div>
        <div className='arrow__sidebar' onClick={toggleMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="10" viewBox="0 0 320 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>
        </div>
        <ul className='nav__items'>
          <div className={`nav__item ${activeMenuIndex === 0 ? 'activeMenu' : ''}`} >
            <AnchorTag className='nav__link' onClick={() => toggleSubMenu(0)}  to="/dashboard">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 512 512"><path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm320 96c0-26.9-16.5-49.9-40-59.3V88c0-13.3-10.7-24-24-24s-24 10.7-24 24V292.7c-23.5 9.5-40 32.5-40 59.3c0 35.3 28.7 64 64 64s64-28.7 64-64zM144 176a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm-16 80a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM400 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>
              <span>Dashboard</span>
            </AnchorTag>
          </div>
          {permisos && permisos.COMPRA.length  > 0 ? 
                 <div className={`nav__item ${activeMenuIndex === 1 ? 'activeMenu' : ''}`}>
                    <AnchorTag className='nav__link' style={sales} onClick={() => toggleSubMenu(1)}  to="/sale">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 448 512"><path d="M0 80V229.5c0 17 6.7 33.3 18.7 45.3l176 176c25 25 65.5 25 90.5 0L418.7 317.3c25-25 25-65.5 0-90.5l-176-176c-12-12-28.3-18.7-45.3-18.7H48C21.5 32 0 53.5 0 80zm112 32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
                        <span>Ventas</span>
                        <svg className='arrow' onClick={toggleClass} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"></path></svg>
                    </AnchorTag>
                    <div className='sub__menu '>
                    {permisos.COMPRA && permisos.COMPRA.map((permiso: any) => {
                        if (permiso.titulo == "") {
                            return (
                                <></>
                            );
                        } else if (permiso.titulo == "") {
                            return (
                                <></>
                            );
                        } else {
                            return null;
                        }
                    })}
                </div>
            </div>
            :
            ''
            }
            {permisos && permisos.COMPRA.length  > 0 ? 
            <div className={`nav__item ${activeMenuIndex === 2 ? 'activeMenu' : ''}`}>
                <AnchorTag className='nav__link' style={shopping}  onClick={() => toggleSubMenu(2)} to={`${PrivateRoutes.SALES}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 576 512"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>
                    <span>Compras</span>
                    <svg className="arrow" onClick={toggleClass} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"></path></svg>
                </AnchorTag>
                <div className='sub__menu '>
                {permisos.COMPRA && permisos.COMPRA.map((permiso: any, index: number) => {
                    if (permiso.titulo == "REQUISICIONES") {
                        return (
                            <AnchorTag key={index} className='sub__menu-link' to={`${PrivateRoutes.SALES}/${PrivateRoutes.REQUISITION}`}>
                                <span>Requisición</span>
                            </AnchorTag>
                        );
                    } else if (permiso.titulo == "ORDEN_COMPRA") {
                        return (
                            <AnchorTag key={index} className='sub__menu-link' to={`${PrivateRoutes.SALES}/${PrivateRoutes.PURCHASEORDERS}`}>
                                <span>Ordenes de compra</span>
                            </AnchorTag>
                        );
                    } else {
                        return null;
                    }
                })}

                </div>
            </div>
            :
            ''
            }
            {permisos && permisos.ALM.length  > 0 ? 
            <div className={`nav__item ${activeMenuIndex === 3 ? 'activeMenu' : ''}`}>
                <AnchorTag className='nav__link' style={store} onClick={() => toggleSubMenu(3)} to={`${PrivateRoutes.WAREHOUSES}`}>
                    <svg className='icon__box' xmlns="http://www.w3.org/2000/svg" width="22" viewBox="0 0 640 512"><path d="M58.9 42.1c3-6.1 9.6-9.6 16.3-8.7L320 64 564.8 33.4c6.7-.8 13.3 2.7 16.3 8.7l41.7 83.4c9 17.9-.6 39.6-19.8 45.1L439.6 217.3c-13.9 4-28.8-1.9-36.2-14.3L320 64 236.6 203c-7.4 12.4-22.3 18.3-36.2 14.3L37.1 170.6c-19.3-5.5-28.8-27.2-19.8-45.1L58.9 42.1zM321.1 128l54.9 91.4c14.9 24.8 44.6 36.6 72.5 28.6L576 211.6v167c0 22-15 41.2-36.4 46.6l-204.1 51c-10.2 2.6-20.9 2.6-31 0l-204.1-51C79 419.7 64 400.5 64 378.5v-167L191.6 248c27.8 8 57.6-3.8 72.5-28.6L318.9 128h2.2z"/></svg>
                    <span>Almacen</span>
                    <svg className="arrow"  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"></path></svg>
                </AnchorTag>
                <div className='sub__menu '>
                {permisos.ALM && permisos.ALM.map((permiso: any) => {
                    if (permiso.titulo == "ALMACENES") {
                        return (
                            <AnchorTag className='sub__menu-link' to={`${PrivateRoutes.WAREHOUSES}/${PrivateRoutes.STORE}`}>
                                <span>Almacen</span>
                            </AnchorTag>
                        );
                    } else if (permiso.titulo == "ENTRADA") {
                        return (
                            <AnchorTag className='sub__menu-link' to={`${PrivateRoutes.WAREHOUSES}/${PrivateRoutes.TICKETS}`}>
                                <span>Entradas</span>
                            </AnchorTag>
                        );
                    } else if (permiso.titulo == "SALIDA") {
                        return (
                            <AnchorTag className='sub__menu-link' to={`${PrivateRoutes.WAREHOUSES}/${PrivateRoutes.DEPARTURES}`}>
                                <span>Salidas</span>
                            </AnchorTag>
                        );
                    } else if (permiso.titulo == "PEDIDO") {
                        return (
                            <AnchorTag className='sub__menu-link' to={`${PrivateRoutes.WAREHOUSES}/${PrivateRoutes.ORDERS}`}>
                                <span>Pedidos</span>
                            </AnchorTag>
                        );
                    } else if (permiso.titulo == "TRASPASO") {
                        return (
                            <AnchorTag className='sub__menu-link' to={`${PrivateRoutes.WAREHOUSES}/${PrivateRoutes.TRANSFERS}`}>
                                <span>Traspasos</span>
                            </AnchorTag>
                        );
                    } else {
                        return null;
                    }
                })}
                </div>
            </div>
            :
            ''
            }
            {permisos && permisos.CATAL.length  > 0 ? 
            <div className={`nav__item ${activeMenuIndex === 4 ? 'activeMenu' : ''}`}>
                <AnchorTag className='nav__link' style={catalogue} onClick={() => toggleSubMenu(4)} to={`${PrivateRoutes.CATALOGUE}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 512 512"><path d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z"/></svg>
                        <span>Catalágos</span>
                    <svg className="arrow" onClick={toggleClass} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"></path></svg>
                </AnchorTag>
                <div className='sub__menu '>
                {permisos.CATAL && permisos.CATAL.map((permiso: any) => {
                    if (permiso.titulo == "ARTICULOS") {
                        return (
                            <AnchorTag className='sub__menu-link' to={`${PrivateRoutes.CATALOGUE}/${PrivateRoutes.ARTICLES}`}>
                                <span>Articulos</span>
                            </AnchorTag>      
                        );
                    } else if (permiso.titulo == "FAMILIAS") {
                        return (
                            <AnchorTag className='sub__menu-link' to={`${PrivateRoutes.CATALOGUE}/${PrivateRoutes.FAMILIES}`}>
                                <span>Familias</span>
                            </AnchorTag>
                        );
                    } else if (permiso.titulo == "PROVEEDORES") {
                        return (
                            <AnchorTag className='sub__menu-link' to={`${PrivateRoutes.CATALOGUE}/${PrivateRoutes.SUPPLIERS}`}>
                                <span>Proveedores</span>
                            </AnchorTag>
                        );
                    } else if (permiso.titulo == "PLANTILLAS") {
                        return (
                            <AnchorTag className='sub__menu-link' to={`${PrivateRoutes.CATALOGUE}/${PrivateRoutes.TEMPLATES}`}>
                                <span>Plantillas</span>
                            </AnchorTag> 
                        );
                    } else if (permiso.titulo == "RANGOS") {
                        return (
                            <AnchorTag className='sub__menu-link' to={`${PrivateRoutes.CATALOGUE}/${PrivateRoutes.RANKS}`}>
                                <span>Rangos</span>
                            </AnchorTag>
                        );
                    } else if (permiso.titulo == "UNIDAD") {
                        return (
                            <AnchorTag className='sub__menu-link' to={`${PrivateRoutes.CATALOGUE}/${PrivateRoutes.UNITS}`}>
                                <span>Unidades</span>
                            </AnchorTag>
                        );
                    } else if (permiso.titulo == "TIPO_COBRO") {
                        return (
                            <AnchorTag className='sub__menu-link' to={`${PrivateRoutes.CATALOGUE}/${PrivateRoutes.TYPEOFPAYMENT}`}>
                                <span>Tipo de cobro</span>
                            </AnchorTag>
                        );
                    } else if (permiso.titulo == "COMBINACIONES") {
                        return (
                            <AnchorTag className='sub__menu-link' to={`${PrivateRoutes.CATALOGUE}/${PrivateRoutes.COMBINATIONS}`}>
                                <span>Combinaciones</span>
                            </AnchorTag>
                        );
                    } else if (permiso.titulo == "COLECCIONES") {
                        return (
                            <AnchorTag className='sub__menu-link' to={`${PrivateRoutes.CATALOGUE}/${PrivateRoutes.COLECCIONES}`}>
                                <span>Colecciones</span>
                            </AnchorTag>
                        );
                    } else if (permiso.titulo == "CLIENTES") {
                        return (
                            <AnchorTag className='sub__menu-link' to={`${PrivateRoutes.CATALOGUE}/${PrivateRoutes.CUSTOMERS}`}>
                                <span>Clientes</span>
                            </AnchorTag>
                        );
                    } else {
                        return null;
                    }
                })}

                </div>
            </div>
            :
            ''
            }
            {permisos && permisos.CONFIG.length  > 0 ? 
            <div className={`nav__item ${activeMenuIndex === 5 ? 'activeMenu' : ''}`}>
                <AnchorTag className='nav__link' style={processes} onClick={() => toggleSubMenu(5)}  to={`${PrivateRoutes.PROCESSOS}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 512 512"><path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm320 96c0-26.9-16.5-49.9-40-59.3V88c0-13.3-10.7-24-24-24s-24 10.7-24 24V292.7c-23.5 9.5-40 32.5-40 59.3c0 35.3 28.7 64 64 64s64-28.7 64-64zM144 176a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm-16 80a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM400 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>
                    <span>Procesos</span>
                    <svg className="arrow" onClick={toggleClass} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"></path></svg>
                </AnchorTag>
                <div className='sub__menu '>
                {permisos.CONFIG && permisos.CONFIG.map((permiso: any) => {
                    if (permiso.titulo == "USUARIOS") {
                        return (
                            <AnchorTag className='sub__menu-link' to={`${PrivateRoutes.PROCESSOS}/${PrivateRoutes.USUARIOS}`}>
                                <span>Usuarios</span>
                            </AnchorTag>   
                        );
                    } else if (permiso.titulo == "TIPOS_USUARIO") {
                        return (
                            <AnchorTag className='sub__menu-link'  to={`${PrivateRoutes.PROCESSOS}/${PrivateRoutes.TIPOSDEUSUARIOS}`}>
                                <span>Tipos de Us</span>
                            </AnchorTag>
                        );
                    } else if (permiso.titulo == "EMPRESAS") {
                        return (
                            <AnchorTag className='sub__menu-link' to={`${PrivateRoutes.PROCESSOS}/${PrivateRoutes.COMPANIES}`}>
                                <span>Empresas</span>
                            </AnchorTag> 
                        );
                    } else if (permiso.titulo == "SUCURSALES") {
                        return (
                            <AnchorTag className='sub__menu-link' to={`${PrivateRoutes.PROCESSOS}/${PrivateRoutes.BRANCHOFFCIES}`}>
                                <span>Sucursales</span>
                            </AnchorTag> 
                        );
                    } else if (permiso.titulo == "AREAS") {
                        return (
                            <AnchorTag className='sub__menu-link'  to={`${PrivateRoutes.PROCESSOS}/${PrivateRoutes.AREAS}`}>
                                <span>Areas</span>
                            </AnchorTag>
                        );
                    } else if (permiso.titulo == "SERIES") {
                        return (
                            <AnchorTag className='sub__menu-link'  to={`${PrivateRoutes.PROCESSOS}/${PrivateRoutes.SERIES}`}>
                                <span>Series</span>
                            </AnchorTag>
                        );
                    } else if (permiso.titulo == "GRUPOS_USUARIO") {
                        return (
                            <AnchorTag className='sub__menu-link'  to={`${PrivateRoutes.PROCESSOS}/${PrivateRoutes.GRUPOSDEUSUARIOS}`}>
                                <span>Grupos de Us</span>
                            </AnchorTag>
                        );
                    } else { 
                        return null;
                    }
                })}

                </div>
            </div>
            :
            ''
            }
            {permisos && permisos.PW.length  > 0 ? 
            <div className='nav__item'>
                <AnchorTag className='nav__link' to={`${PrivateRoutes.WEB}/${PrivateRoutes.WEB}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 512 512"><path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"/></svg>
                <span>Pagina web</span>
                </AnchorTag>
            </div>
            :
            ''
            }
            <div className='nav__item'>
                <AnchorTag className='nav__link' onClick={logOut} to="/session">
                    <svg xmlns="http://www.w3.org/2000/svg" className='signoff' width="20" viewBox="0 0 512 512"><path d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"/></svg>
                    <span>Cerrar session</span>
                </AnchorTag>
            </div>
        </ul>
      </div>
      <div className="main">
        <div className='container__main'>
            <Header />
            <div className='main__content' >
                <Routes>
                    {/* <Route path="dashboard" element={<MainDashboard />} /> */}
                    <Route path={`${permisos && permisos.CONFIG.length > 0 ? PrivateRoutes.PROCESSOS : ''}/*`} element={<RouteProcesses />} />
                    <Route path={`${PrivateRoutes.CATALOGUE}/*`} element={<RouteCatalogue  />} />
                    <Route path={`${PrivateRoutes.WAREHOUSES}/*`} element={<RouteWarehouses />} />
                    <Route path={`${PrivateRoutes.SALES}/*`}  element={<RouteSales />} />
                    <Route path={`${PrivateRoutes.WEB}/*`} element={<RouteWeb />} />
                </Routes>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RootHome;
