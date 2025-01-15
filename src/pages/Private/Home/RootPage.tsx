// RootPage.tsx
import React, { useEffect } from 'react';
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import RoutesShopping from '../../../routes/sections/processes/RoutesShopping';
import RouteProcesses from '../../../routes/sections/processes/RouteProcesses';
import RouteCatalogue from '../../../routes/sections/processes/RouteCatalogue';
import RouteWarehouses from '../../../routes/sections/processes/RouteWarehouses';
import RouteSales from '../../../routes/sections/processes/RouteSales';
import RouteProduction from '../../../routes/sections/processes/RouteProduction';
import RouteWeb from '../../../routes/sections/processes/RouteWeb';
import AnchorTag from '../../../components/rootPage/AnchorTag';
import './RootPage.css'
import { useNavigate } from "react-router-dom";
import { clearLocalStorage } from '../../../utils/localStorage.utility';
import useUserStore from '../../../zustand/General';
import { PrivateRoutes, PublicRoutes } from '../../../models/routes';
import Header from '../../../components/rootPage/Header/Header';
import Logo from '../../../assets/HI SOFT LOGO-sv-02.svg'
import APIs from '../../../services/services/APIs';

const RootHome: React.FC = () => {
    const userState = useUserStore(state => state.user);
    const user_id = userState.id
    const [activeMenuIndex, setActiveMenuIndex] = useState(null);
    const [activeSidebar, setActiveSidebar] = useState<boolean>(true)

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
        backgroundColor: activeMenuIndex === 1 && activeSidebar === true ? '#3D85C6' : ''
    }

    const shopping = {
        backgroundColor: activeMenuIndex === 2 && activeSidebar === true ? '#3D85C6' : ''
    }
    const store = {
        backgroundColor: activeMenuIndex === 3 && activeSidebar === true ? '#3D85C6' : ''
    }

    const catalogue = {
        backgroundColor: activeMenuIndex === 4 && activeSidebar === true ? '#3D85C6' : ''
    }

    const processes = {
        backgroundColor: activeMenuIndex === 5 && activeSidebar === true ? '#3D85C6' : ''
    }

    const production = {
        backgroundColor: activeMenuIndex === 6 && activeSidebar === true ? '#3D85C6' : ''
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
                    {/* <h2 className='title__logo'>Procura</h2> */}
                </div>
                <div className='arrow__sidebar' onClick={toggleMenu}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 6l6 6l-6 6" /></svg>
                </div>
                <ul className='nav__items'>
                    <div className={`nav__item ${activeMenuIndex === 0 ? 'activeMenu' : ''}`} >
                        <AnchorTag className='nav__link active' onClick={() => toggleSubMenu(0)} to={`${PrivateRoutes.SALES}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
                            <span>Dashboard</span>
                        </AnchorTag>
                    </div>
                    {permisos && permisos.VENTA.length ?
                        <div className={`nav__item ${activeMenuIndex === 1 ? 'activeMenu' : ''}`} >
                            <AnchorTag className='nav__link' style={sales} onClick={(e) => { e.preventDefault(); toggleSubMenu(1) }} to={`${PrivateRoutes.SALES}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-receipt"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 17.5v-11" /></svg>
                                <span>Ventas</span>
                                <svg onClick={toggleClass} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="arrow lucide lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>
                            </AnchorTag>
                            <div className='sub__menu '>
                                {permisos.VENTA && permisos.VENTA.map((permiso: any, index: any) => {
                                    if (permiso.titulo == "COTIZACION") {
                                        return (
                                            <AnchorTag key={index} className='sub__menu-link' to={`${PrivateRoutes.SALES}/${PrivateRoutes.QUOTATION}`}>
                                                <span>Cotización</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "ORDEN_VENTA") {
                                        return (
                                            <AnchorTag key={index} className='sub__menu-link' to={`${PrivateRoutes.SALES}/${PrivateRoutes.SALESORDER}`}>
                                                <span>Orden de venta</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "FACTURA") {
                                        return (
                                            <AnchorTag key={index} className='sub__menu-link' to={`${PrivateRoutes.SALES}/${PrivateRoutes.BILLING}`}>
                                                <span>Facturacion</span>
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
                    {permisos && permisos.COMPRA.length > 0 ?
                        <div className={`nav__item ${activeMenuIndex === 2 ? 'activeMenu' : ''}`}>
                            <AnchorTag className='nav__link' style={shopping} onClick={(e) => { e.preventDefault(); toggleSubMenu(2) }} to={`${PrivateRoutes.SHOPPING}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-shopping-cart"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>                                <span>Compras</span>
                                <svg onClick={toggleClass} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="arrow lucide lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>
                            </AnchorTag>
                            <div className='sub__menu '>
                                {permisos.COMPRA && permisos.COMPRA.map((permiso: any, index: number) => {
                                    if (permiso.titulo == "REQUISICIONES") {
                                        return (
                                            <AnchorTag key={index} className='sub__menu-link' to={`${PrivateRoutes.SHOPPING}/${PrivateRoutes.REQUISITION}`}>
                                                <span>Requisición</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "ORDEN_COMPRA") {
                                        return (
                                            <AnchorTag key={index} className='sub__menu-link' to={`${PrivateRoutes.SHOPPING}/${PrivateRoutes.PURCHASEORDERS}`}>
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
                    {permisos && permisos.ALM.length > 0 ?
                        <div className={`nav__item ${activeMenuIndex === 3 ? 'activeMenu' : ''}`}>
                            <AnchorTag className='nav__link' style={store} onClick={(e) => { e.preventDefault(); toggleSubMenu(3) }} to={`${PrivateRoutes.WAREHOUSES}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" /><path d="M12 22V12" /><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7" /><path d="m7.5 4.27 9 5.15" /></svg>
                                <span>Almacen</span>
                                <svg onClick={toggleClass} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="arrow lucide lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>
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
                                    } else if (permiso.titulo == "PEDIDO_FRANQUICIA") {
                                        return (
                                            <AnchorTag className='sub__menu-link' to={`${PrivateRoutes.WAREHOUSES}/${PrivateRoutes.PEDIDOFRANQUICIA}`}>
                                                <span>Pedidos Franquicia</span>
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
                    {permisos && permisos.PRO.length > 0 ?
                        <div className={`nav__item ${activeMenuIndex === 6 ? 'activeMenu' : ''}`}>
                            <AnchorTag className='nav__link' style={production} onClick={() => toggleSubMenu(6)} to={`${PrivateRoutes.PRODUCTION}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-factory"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M17 18h1" /><path d="M12 18h1" /><path d="M7 18h1" /></svg>
                                <span>Produccion</span>
                                <svg onClick={toggleClass} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="arrow lucide lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>
                            </AnchorTag>
                            <div className='sub__menu '>
                                {permisos.PRO && permisos.PRO.map((permiso: any) => {
                                    if (permiso.titulo == "PRODUCCION") {
                                        return (
                                            <AnchorTag className='sub__menu-link' to={`${PrivateRoutes.PRODUCTION}`}>
                                                <span>Produccion</span>
                                            </AnchorTag>
                                        );
                                    } {
                                        return null;
                                    }
                                })}
                            </div>
                        </div>
                        :
                        ''
                    }
                    {permisos && permisos.CATAL.length > 0 ?
                        <div className={`nav__item ${activeMenuIndex === 4 ? 'activeMenu' : ''}`}>
                            <AnchorTag className='nav__link' style={catalogue} onClick={(e) => { e.preventDefault(); toggleSubMenu(4) }} to={`${PrivateRoutes.CATALOGUE}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder-closed"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /><path d="M2 10h20" /></svg>                                <span>Catalágos</span>
                                <svg onClick={toggleClass} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="arrow lucide lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>
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
                                    } else if (permiso.titulo == "TIEMPOS_ENTREGA") {
                                        return (
                                            <AnchorTag className='sub__menu-link' to={`${PrivateRoutes.CATALOGUE}/${PrivateRoutes.TIEMPOSENTREGA}`}>
                                                <span>Tiempos Entrega</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "LISTA_FRANQUICIAS") {
                                        return (
                                            <AnchorTag className='sub__menu-link' to={`${PrivateRoutes.CATALOGUE}/${PrivateRoutes.LISTASFRANQUICIAS}`}>
                                                <span>Listas Franquicias</span>
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
                    {permisos && permisos.CONFIG.length > 0 ?
                        <div className={`nav__item ${activeMenuIndex === 5 ? 'activeMenu' : ''}`}>
                            <AnchorTag className='nav__link' style={processes} onClick={(e) => { e.preventDefault(); toggleSubMenu(5) }} to={`${PrivateRoutes.PROCESSOS}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-list"><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" /></svg>                                <span>Procesos</span>
                                <svg onClick={toggleClass} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="arrow lucide lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>
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
                                            <AnchorTag className='sub__menu-link' to={`${PrivateRoutes.PROCESSOS}/${PrivateRoutes.TIPOSDEUSUARIOS}`}>
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
                                            <AnchorTag className='sub__menu-link' to={`${PrivateRoutes.PROCESSOS}/${PrivateRoutes.AREAS}`}>
                                                <span>Areas</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "SERIES") {
                                        return (
                                            <AnchorTag className='sub__menu-link' to={`${PrivateRoutes.PROCESSOS}/${PrivateRoutes.SERIES}`}>
                                                <span>Series</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "GRUPOS_USUARIO") {
                                        return (
                                            <AnchorTag className='sub__menu-link' to={`${PrivateRoutes.PROCESSOS}/${PrivateRoutes.GRUPOSDEUSUARIOS}`}>
                                                <span>Grupos de Us</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "URGENCIA") {
                                        return (
                                            <AnchorTag className='sub__menu-link' to={`${PrivateRoutes.PROCESSOS}/${PrivateRoutes.URGENCIAS}`}>
                                                <span>Urgencias</span>
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
                    {/* {permisos && permisos.PW.length  > 0 ? 
            <div className='nav__item'>
                <AnchorTag className='nav__link' to={`${PrivateRoutes.WEB}/${PrivateRoutes.WEB}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 512 512"><path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"/></svg>
                <span>Pagina web</span>
                </AnchorTag>
            </div>
            :
            ''
            }
            */}
                </ul>
                <div className='nav__item_logout'>
                    <AnchorTag className='nav__link' onClick={logOut} to="/login">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="signoff lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                        <span>Cerrar session</span>
                    </AnchorTag>
                </div>
            </div>
            <div className="main">
                <div className='container__main'>
                    <Header />
                    <div className='main__content' >
                        <Routes>
                            {/* <Route path="dashboard" element={<MainDashboard />} /> */}
                            <Route path={`${permisos && permisos.CONFIG.length > 0 ? PrivateRoutes.PROCESSOS : ''}/*`} element={<RouteProcesses />} />
                            <Route path={`${PrivateRoutes.CATALOGUE}/*`} element={<RouteCatalogue />} />
                            <Route path={`${PrivateRoutes.WAREHOUSES}/*`} element={<RouteWarehouses />} />
                            <Route path={`${PrivateRoutes.SHOPPING}/*`} element={<RoutesShopping />} />
                            <Route path={`${PrivateRoutes.SALES}/*`} element={<RouteSales />} />
                            <Route path={`${PrivateRoutes.PRODUCTION}/*`} element={<RouteProduction />} />
                            <Route path={`${PrivateRoutes.WEB}/*`} element={<RouteWeb />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RootHome;
