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
import Logo from '../../../assets/HI SOFT LOGO-12.svg'
import APIs from '../../../services/services/APIs';
import RouteReportes from '../../../routes/sections/processes/RouteReportes';
import RouteAdmin from '../../../routes/sections/processes/RouteAdmin';
import { storeHeader } from '../../../zustand/Header';

const RootHome: React.FC = () => {
    const userState = useUserStore(state => state.user);
    const user_id = userState.id
    const [activeMenuIndex, setActiveMenuIndex] = useState(null);
    const [activeSidebar, setActiveSidebar] = useState<boolean>(true)

    const { resetUser, UserKey }: any = useUserStore()

    const { toggle } = storeHeader()

    const [active, setActive] = useState<string>('dashboard')

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


    const toggleSubMenu = (index: any, type: string) => {
        setActiveMenuIndex((prevIndex) => (prevIndex === index ? null : index));
        setActive(type)
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
    const reportes = {
        backgroundColor: activeMenuIndex === 7 && activeSidebar === true ? '#3D85C6' : ''
    }
    const administracion = {
        backgroundColor: activeMenuIndex === 8 && activeSidebar === true ? '#3D85C6' : ''
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

  const setToggle = storeHeader(state => state.setToggle)
  

  const toggleMen = () => {
    setToggle(!toggle)
    setActiveSidebar(false)
  }



    return (
        <div className='root__dashboard'>
            <div className={`sidebar ${toggle ? 'active' : ''} ${activeSidebar ? 'close' : ''}`}>
                <div className="logo__sidebar">
                    <img className='logo__image' src={Logo} alt="" />
                    {/* <h2 className='title__logo'>Procura</h2> */}
                    <div className='toggle' onClick={toggleMen}>
                        <button className={`toggle__botton ${toggle ? 'activo' : ''}`}>
                            <span className="l1 span"></span>
                            <span className="l2 span"></span>
                            <span className="l3 span"></span>
                        </button>
                    </div>
                </div>
                <div className='arrow__sidebar' onClick={toggleMenu}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 6l6 6l-6 6" /></svg>
                </div>
                <ul className='nav__items'>
                    <div className={`nav__item ${activeMenuIndex === 0 ? 'activeMenu' : ''}`} >
                        <AnchorTag className={`nav__link ${active == 'dashboard' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); toggleSubMenu(0, 'dashboard') }} to={`${PrivateRoutes.SALES}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-layout-dashboard"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 3a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2zm0 12a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-2a2 2 0 0 1 2 -2zm10 -4a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2zm0 -8a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-2a2 2 0 0 1 2 -2z" /></svg>
                            <span>Dashboard</span>
                        </AnchorTag>
                    </div>
                    {permisos && permisos.VENTA.length ?
                        <div className={`nav__item ${activeMenuIndex === 1 ? 'activeMenu' : ''}`} >
                            <AnchorTag className={`nav__link ${active == 'sales' ? 'active' : ''}`} style={sales} onClick={(e) => { e.preventDefault(); toggleSubMenu(1, 'sales') }} to={`${PrivateRoutes.SALES}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-tag"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M11.172 2a3 3 0 0 1 2.121 .879l7.71 7.71a3.41 3.41 0 0 1 0 4.822l-5.592 5.592a3.41 3.41 0 0 1 -4.822 0l-7.71 -7.71a3 3 0 0 1 -.879 -2.121v-5.172a4 4 0 0 1 4 -4zm-3.672 3.5a2 2 0 0 0 -1.995 1.85l-.005 .15a2 2 0 1 0 2 -2" /></svg>
                                <span>Ventas</span>
                                <svg onClick={toggleClass} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="arrow lucide lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>
                            </AnchorTag>
                            <div className='sub__menu '>
                                {permisos.VENTA && permisos.VENTA.map((permiso: any, index: any) => {
                                    if (permiso.titulo == "COTIZACION") {
                                        return (
                                            <AnchorTag key={index} className='sub__menu-link' onClick={() => toggleSubMenu(1, 'sales')} to={`${PrivateRoutes.SALES}/${PrivateRoutes.QUOTATION}`}>
                                                <span>Cotización</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "ORDEN_VENTA") {
                                        return (
                                            <AnchorTag key={index} className='sub__menu-link' onClick={() => toggleSubMenu(1, 'sales')} to={`${PrivateRoutes.SALES}/${PrivateRoutes.SALESORDER}`}>
                                                <span>Orden de venta</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "FACTURA") {
                                        return (
                                            <AnchorTag key={index} className='sub__menu-link' onClick={() => toggleSubMenu(1, 'sales')} to={`${PrivateRoutes.SALES}/${PrivateRoutes.BILLING}`}>
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
                            <AnchorTag className={`nav__link ${active == 'shopping' ? 'active' : ''}`} style={shopping} onClick={(e) => { e.preventDefault(); toggleSubMenu(2, 'shopping') }} to={`${PrivateRoutes.SHOPPING}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-shopping-cart"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 2a1 1 0 0 1 .993 .883l.007 .117v1.068l13.071 .935a1 1 0 0 1 .929 1.024l-.01 .114l-1 7a1 1 0 0 1 -.877 .853l-.113 .006h-12v2h10a3 3 0 1 1 -2.995 3.176l-.005 -.176l.005 -.176c.017 -.288 .074 -.564 .166 -.824h-5.342a3 3 0 1 1 -5.824 1.176l-.005 -.176l.005 -.176a3.002 3.002 0 0 1 1.995 -2.654v-12.17h-1a1 1 0 0 1 -.993 -.883l-.007 -.117a1 1 0 0 1 .883 -.993l.117 -.007h2zm0 16a1 1 0 1 0 0 2a1 1 0 0 0 0 -2zm11 0a1 1 0 1 0 0 2a1 1 0 0 0 0 -2z" /></svg>
                                <span>Compras</span>
                                <svg onClick={toggleClass} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="arrow lucide lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>
                            </AnchorTag>
                            <div className='sub__menu '>
                                {permisos.COMPRA && permisos.COMPRA.map((permiso: any, index: number) => {
                                    if (permiso.titulo == "REQUISICIONES") {
                                        return (
                                            <AnchorTag key={index} className='sub__menu-link' onClick={() => toggleSubMenu(2, 'shopping')} to={`${PrivateRoutes.SHOPPING}/${PrivateRoutes.REQUISITION}`}>
                                                <span>Requisición</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "ORDEN_COMPRA") {
                                        return (
                                            <AnchorTag key={index} className='sub__menu-link' onClick={() => toggleSubMenu(2, 'shopping')} to={`${PrivateRoutes.SHOPPING}/${PrivateRoutes.PURCHASEORDERS}`}>
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
                            <AnchorTag className={`nav__link ${active == 'store' ? 'active' : ''}`} style={store} onClick={(e) => { e.preventDefault(); toggleSubMenu(3, 'store') }} to={`${PrivateRoutes.WAREHOUSES}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-stack-2"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M20.894 15.553a1 1 0 0 1 -.447 1.341l-8 4a1 1 0 0 1 -.894 0l-8 -4a1 1 0 0 1 .894 -1.788l7.553 3.774l7.554 -3.775a1 1 0 0 1 1.341 .447m0 -4a1 1 0 0 1 -.447 1.341l-8 4a1 1 0 0 1 -.894 0l-8 -4a1 1 0 0 1 .894 -1.788l7.552 3.775l7.554 -3.775a1 1 0 0 1 1.341 .447m-8.887 -8.552q .056 0 .111 .007l.111 .02l.086 .024l.012 .006l.012 .002l.029 .014l.05 .019l.016 .009l.012 .005l8 4a1 1 0 0 1 0 1.788l-8 4a1 1 0 0 1 -.894 0l-8 -4a1 1 0 0 1 0 -1.788l8 -4l.011 -.005l.018 -.01l.078 -.032l.011 -.002l.013 -.006l.086 -.024l.11 -.02l.056 -.005z" /></svg>
                                <span>Almacen</span>
                                <svg onClick={toggleClass} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="arrow lucide lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>
                            </AnchorTag>
                            <div className='sub__menu '>
                                {permisos.ALM && permisos.ALM.map((permiso: any) => {
                                    if (permiso.titulo == "ALMACENES") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(3, 'store')} to={`${PrivateRoutes.WAREHOUSES}/${PrivateRoutes.STORE}`}>
                                                <span>Almacen</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "ENTRADA") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(3, 'store')} to={`${PrivateRoutes.WAREHOUSES}/${PrivateRoutes.TICKETS}`}>
                                                <span>Entradas</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "SALIDA") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(3, 'store')} to={`${PrivateRoutes.WAREHOUSES}/${PrivateRoutes.DEPARTURES}`}>
                                                <span>Salidas</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "PEDIDO") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(3, 'store')} to={`${PrivateRoutes.WAREHOUSES}/${PrivateRoutes.ORDERS}`}>
                                                <span>Pedidos</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "TRASPASO") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(3, 'store')} to={`${PrivateRoutes.WAREHOUSES}/${PrivateRoutes.TRANSFERS}`}>
                                                <span>Traspasos</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "PEDIDO_FRANQUICIA") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(3, 'store')} to={`${PrivateRoutes.WAREHOUSES}/${PrivateRoutes.PEDIDOFRANQUICIA}`}>
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
                            <AnchorTag className={`nav__link ${active == 'production' ? 'active' : ''}`} style={production} onClick={(e) => { toggleSubMenu(6, 'production'); e.preventDefault(); }} to={`${PrivateRoutes.PRODUCTION}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-asset"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M19 2a3 3 0 0 1 2.86 3.91l-.107 .291l-.046 .093q -.061 .128 -.134 .25l-6.476 11.909a1 1 0 0 1 -.066 .104a7 7 0 0 1 -13.031 -3.557l.004 -.24a7 7 0 0 1 3.342 -5.732l.256 -.15l11.705 -6.355q .18 -.123 .378 -.22l.215 -.096l.136 -.048c.302 -.103 .627 -.159 .964 -.159m-10 10a3 3 0 0 0 -2.995 2.824l-.005 .176a3 3 0 1 0 3 -3m7.04 -6.512l-5.12 2.778a7.01 7.01 0 0 1 4.816 4.824l2.788 -5.128a3 3 0 0 1 -2.485 -2.474m2.961 -1.488a1 1 0 0 0 -.317 .051l-.31 .17a1 1 0 1 0 1.465 1.325l.072 -.13a1 1 0 0 0 -.91 -1.416" /></svg>
                                <span>Produccion</span>
                                <svg onClick={toggleClass} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="arrow lucide lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>
                            </AnchorTag>
                            <div className='sub__menu '>
                                {permisos.PRO && permisos.PRO.map((permiso: any) => {
                                    if (permiso.titulo == "PRODUCCION") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(6, 'production')} to={`${PrivateRoutes.PRODUCTION}`}>
                                                <span>Produccion</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "VALES") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(6, 'production')} to={`${PrivateRoutes.PRODUCTION}/${PrivateRoutes.VALES}`}>
                                                <span>Vales</span>
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
                    {permisos && permisos?.ADM?.length ?
                        <div className={`nav__item ${activeMenuIndex === 8 ? 'activeMenu' : ''}`} >
                            <AnchorTag className={`nav__link ${active == 'administracion' ? 'active' : ''}`} style={administracion} onClick={(e) => { e.preventDefault(); toggleSubMenu(8, 'administracion') }} to={`${PrivateRoutes.ADMINISTRACION}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h207q16 0 30.5 6t25.5 17l57 57h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Z" /></svg>
                                <span>Admin.</span>
                                <svg onClick={toggleClass} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="arrow lucide lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>

                            </AnchorTag>
                            <div className='sub__menu '>
                                {permisos?.ADM && permisos?.ADM.map((permiso: any, index: any) => {
                                    if (permiso.titulo == "COBROS A FRANQUICIAS") {
                                        return (
                                            <AnchorTag key={index} className='sub__menu-link' onClick={() => toggleSubMenu(8, 'administracion')} to={`${PrivateRoutes.ADMINISTRACION}/${PrivateRoutes.COBROS_A_FRANQUICIA}`}>
                                                <span>Cobros a Franquicias</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "FACTURA") {
                                        return (
                                            <AnchorTag key={index} className='sub__menu-link' onClick={() => toggleSubMenu(8, 'administracion')} to={`${PrivateRoutes.ADMINISTRACION}/${PrivateRoutes.BILLING}`}>
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
                    {permisos && permisos?.REPORTES?.length > 0 ?
                        <div className={`nav__item ${activeMenuIndex === 7 ? 'activeMenu' : ''}`}>
                            <AnchorTag className={`nav__link ${active == 'reportes' ? 'active' : ''}`} style={reportes} onClick={(e) => { toggleSubMenu(7, 'reportes'); e.preventDefault(); }} to={`${PrivateRoutes.REPORTES}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-file-description"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 2l.117 .007a1 1 0 0 1 .876 .876l.007 .117v4l.005 .15a2 2 0 0 0 1.838 1.844l.157 .006h4l.117 .007a1 1 0 0 1 .876 .876l.007 .117v9a3 3 0 0 1 -2.824 2.995l-.176 .005h-10a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-14a3 3 0 0 1 2.824 -2.995l.176 -.005zm3 14h-6a1 1 0 0 0 0 2h6a1 1 0 0 0 0 -2m0 -4h-6a1 1 0 0 0 0 2h6a1 1 0 0 0 0 -2" /><path d="M19 7h-4l-.001 -4.001z" /></svg>
                                <span>Reportes</span>
                                <svg onClick={toggleClass} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="arrow lucide lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>
                            </AnchorTag>
                            <div className='sub__menu '>
                                {permisos.REPORTES && permisos.REPORTES.map((permiso: any) => {
                                    if (permiso.titulo == "EXISTENCIA ALMACEN") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(7, 'reportes')} to={`${PrivateRoutes.REPORTES}/${PrivateRoutes.EXISTENCIAALMACEN}`}>
                                                <span>Existencia por Producto</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "EXISTENCIA_POR_ALM") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(7, 'reportes')} to={`${PrivateRoutes.REPORTES}/${PrivateRoutes.EXISTENCIAPORALMACEN}`}>
                                                <span>Existencia Por Almacen</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "ULTIMOS COSTOS") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(7, 'reportes')} to={`${PrivateRoutes.REPORTES}/${PrivateRoutes.ULTIMOSCOSTOS}`}>
                                                <span>Ultimos Costos</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "MOVIMIENTOS DE ALMACEN") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(7, 'reportes')} to={`${PrivateRoutes.REPORTES}/${PrivateRoutes.WAREHOUSEMOVEMENTS}`}>
                                                <span>Movimiento Almacen</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "HOJAS BLANCAS") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(7, 'reportes')} to={`${PrivateRoutes.REPORTES}/${PrivateRoutes.HOJASBLANCAS}`}>
                                                <span>Hojas Blancas</span>
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
                    {permisos && permisos.CATAL.length > 0 ?
                        <div className={`nav__item ${activeMenuIndex === 4 ? 'activeMenu' : ''}`}>
                            <AnchorTag className={`nav__link ${active == 'catalogue' ? 'active' : ''}`} style={catalogue} onClick={(e) => { e.preventDefault(); toggleSubMenu(4, 'catalogue') }} to={`${PrivateRoutes.CATALOGUE}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-folder"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 3a1 1 0 0 1 .608 .206l.1 .087l2.706 2.707h6.586a3 3 0 0 1 2.995 2.824l.005 .176v8a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-11a3 3 0 0 1 2.824 -2.995l.176 -.005h4z" /></svg>
                                <span>Catalágos</span>
                                <svg onClick={toggleClass} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="arrow lucide lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>
                            </AnchorTag>
                            <div className='sub__menu '>
                                {permisos.CATAL && permisos.CATAL.map((permiso: any) => {
                                    if (permiso.titulo == "ARTICULOS") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(4, 'catalogue')} to={`${PrivateRoutes.CATALOGUE}/${PrivateRoutes.ARTICLES}`}>
                                                <span>Articulos</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "FAMILIAS") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(4, 'catalogue')} to={`${PrivateRoutes.CATALOGUE}/${PrivateRoutes.FAMILIES}`}>
                                                <span>Familias</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "PROVEEDORES") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(4, 'catalogue')} to={`${PrivateRoutes.CATALOGUE}/${PrivateRoutes.SUPPLIERS}`}>
                                                <span>Proveedores</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "PLANTILLAS") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(4, 'catalogue')} to={`${PrivateRoutes.CATALOGUE}/${PrivateRoutes.TEMPLATES}`}>
                                                <span>Plantillas</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "RANGOS") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(4, 'catalogue')} to={`${PrivateRoutes.CATALOGUE}/${PrivateRoutes.RANKS}`}>
                                                <span>Rangos</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "UNIDAD") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(4, 'catalogue')} to={`${PrivateRoutes.CATALOGUE}/${PrivateRoutes.UNITS}`}>
                                                <span>Unidades</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "TIPO_COBRO") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(4, 'catalogue')} to={`${PrivateRoutes.CATALOGUE}/${PrivateRoutes.TYPEOFPAYMENT}`}>
                                                <span>Tipo de cobro</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "COMBINACIONES") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(4, 'catalogue')} to={`${PrivateRoutes.CATALOGUE}/${PrivateRoutes.COMBINATIONS}`}>
                                                <span>Combinaciones</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "COLECCIONES") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(4, 'catalogue')} to={`${PrivateRoutes.CATALOGUE}/${PrivateRoutes.COLECCIONES}`}>
                                                <span>Colecciones</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "CLIENTES") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(4, 'catalogue')} to={`${PrivateRoutes.CATALOGUE}/${PrivateRoutes.CUSTOMERS}`}>
                                                <span>Clientes</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "TIEMPOS_ENTREGA") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(4, 'catalogue')} to={`${PrivateRoutes.CATALOGUE}/${PrivateRoutes.TIEMPOSENTREGA}`}>
                                                <span>Tiempos Entrega</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "LISTA_FRANQUICIAS") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(4, 'catalogue')} to={`${PrivateRoutes.CATALOGUE}/${PrivateRoutes.LISTASFRANQUICIAS}`}>
                                                <span>Listas Franquicias</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "DESCUENTOS") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(4, 'catalogue')} to={`${PrivateRoutes.CATALOGUE}/${PrivateRoutes.DESCUENTOS}`}>
                                                <span>Descuentos</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "LISTAS_PRODUCTOS_APROBADOS") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(4, 'catalogue')} to={`${PrivateRoutes.CATALOGUE}/${PrivateRoutes.LISTAS_PRODUCTOS_APROBADOS}`}>
                                                <span>Listas Productos Aprobados</span>
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
                            <AnchorTag className={`nav__link ${active == 'processes' ? 'active' : ''}`} style={processes} onClick={(e) => { e.preventDefault(); toggleSubMenu(5, 'processes') }} to={`${PrivateRoutes.PROCESSOS}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-clipboard"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M17.997 4.17a3 3 0 0 1 2.003 2.83v12a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 2.003 -2.83a4 4 0 0 0 3.997 3.83h4a4 4 0 0 0 3.98 -3.597zm-3.997 -2.17a2 2 0 1 1 0 4h-4a2 2 0 1 1 0 -4z" /></svg>
                                <span>Procesos</span>
                                <svg onClick={toggleClass} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="arrow lucide lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>
                            </AnchorTag>
                            <div className='sub__menu '>
                                {permisos.CONFIG && permisos.CONFIG.map((permiso: any) => {
                                    if (permiso.titulo == "USUARIOS") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(5, 'processes')} to={`${PrivateRoutes.PROCESSOS}/${PrivateRoutes.USUARIOS}`}>
                                                <span>Usuarios</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "TIPOS_USUARIO") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(5, 'processes')} to={`${PrivateRoutes.PROCESSOS}/${PrivateRoutes.TIPOSDEUSUARIOS}`}>
                                                <span>Tipos de Us</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "EMPRESAS") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(5, 'processes')} to={`${PrivateRoutes.PROCESSOS}/${PrivateRoutes.COMPANIES}`}>
                                                <span>Empresas</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "SUCURSALES") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(5, 'processes')} to={`${PrivateRoutes.PROCESSOS}/${PrivateRoutes.BRANCHOFFCIES}`}>
                                                <span>Sucursales</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "AREAS") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(5, 'processes')} to={`${PrivateRoutes.PROCESSOS}/${PrivateRoutes.AREAS}`}>
                                                <span>Areas</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "SERIES") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(5, 'processes')} to={`${PrivateRoutes.PROCESSOS}/${PrivateRoutes.SERIES}`}>
                                                <span>Series</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "GRUPOS_USUARIO") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(5, 'processes')} to={`${PrivateRoutes.PROCESSOS}/${PrivateRoutes.GRUPOSDEUSUARIOS}`}>
                                                <span>Grupos de Us</span>
                                            </AnchorTag>
                                        );
                                    } else if (permiso.titulo == "URGENCIA") {
                                        return (
                                            <AnchorTag className='sub__menu-link' onClick={() => toggleSubMenu(5, 'processes')} to={`${PrivateRoutes.PROCESSOS}/${PrivateRoutes.URGENCIAS}`}>
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
                            <Route path={`${PrivateRoutes.REPORTES}/*`} element={<RouteReportes />} />
                            <Route path={`${PrivateRoutes.ADMINISTRACION}/*`} element={<RouteAdmin />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RootHome;
