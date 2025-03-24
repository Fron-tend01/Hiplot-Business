

import React, { useEffect, useRef, useState } from 'react';
import { useThemeStore } from '../../../zustand/ThemeStore';
import './Header.css';
import NotificationIcon from './NotificationIcon';
import Swal from 'sweetalert2';
import ArticleViewModal from '../sections/sales/ArticleViewModal';
import { storeArticleView } from '../../../zustand/ArticleView';
import { storeDv } from '../../../zustand/Dynamic_variables';
import APIs from '../../../services/services/APIs';
import useUserStore from '../../../zustand/General';
import LoadingInfo from '../../loading/LoadingInfo';
import { storeArticles } from '../../../zustand/Articles';
import { storeHeader } from '../../../zustand/Header';
import { Toaster } from 'sonner'
import { Link } from 'react-router-dom';
import { PrivateRoutes } from '../../../models/routes';
import { storeSaleOrder } from '../../../zustand/SalesOrder';
import { storeQuotation } from '../../../zustand/Quotation';
import { useStore } from 'zustand';

const Header: React.FC = () => {

  const { toggleTheme } = useThemeStore();
  const [showUsers] = useState<boolean>(false);
  const userState = useUserStore(state => state.user);
  const user_id = userState.id
  console.log('USER STATE', userState);

  const setToggle = storeHeader(state => state.setToggle)
  const { toggle } = storeHeader()

  const setModalArticleView = storeArticleView((state) => state.setModalArticleView);

  const setSaleOrdersCart = storeSaleOrder((state) => state.setSaleOrdersCart);
  const { saleOrdersCart }: any = useStore(storeSaleOrder);


  const setQuotes = storeQuotation(state => state.setQuotes)
  const { quotes }: any = useStore(storeQuotation);

  const toggleUsersDisplay = () => {
    // setShowUsers(!showUsers);
    Swal.fire({
      title: "Sección en desarrollo",
      text: "Estamos trabajando para mejorar esta funcionalidad. Próximamente estará disponible.",
      icon: "info",
    });
  };

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);



const [totalSales, setTotalSales] = useState<number>(0);
const [totalQuotes, setTotalQuotes] = useState<number>(0);

const getOrders = () => {
  const storedData = JSON.parse(localStorage.getItem("sale-order") || "[]");
  const storedQuotes = JSON.parse(localStorage.getItem("cotizacion") || "[]");

  if (storedData.length > 0) {
    setSaleOrdersCart(storedData);
  } else {
    setSaleOrdersCart([]); // Asegurar que el estado no quede undefined
  }

  if (storedQuotes.length > 0) {
    setQuotes(storedQuotes);
  } else {
    setQuotes([]); // Asegurar que el estado no quede undefined
  }
};

useEffect(() => {
  getOrders();
}, []);

useEffect(() => {
  let totalSale = saleOrdersCart.reduce((acc, item) => acc + parseInt(item.cantidad || "0"), 0);
  let totalQuote = quotes.reduce((acc, item) => acc + parseInt(item.cantidad || "0"), 0);

  setTotalSales(totalSale);
  setTotalQuotes(totalQuote);
}, [saleOrdersCart, quotes]);




  const handleClick = () => {
    if (!isDarkMode) {
      Swal.fire({
        title: "Modo oscuro en versión beta",
        text: "En esta versión, el contraste de algunos colores aún no está completamente optimizado para la visualización.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, activar modo oscuro",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          document.body.classList.toggle("darkmode"); // Se cambia solo si acepta
          toggleTheme();
          setIsDarkMode((prev) => !prev);
        }
      });
    } else {
      document.body.classList.toggle("darkmode");
      toggleTheme();
      setIsDarkMode((prev) => !prev);
    }
  };
  const setPermisosxVista = storeDv((state) => state.setPermisosxVista);
  const permisosxVista = storeDv((state) => state.permisosxvista);
  const [permisosxvista, setPermisosxvista] = useState<any[]>([]);

  const fetch = () => {
    APIs.GetAny('get_permisos_x_vista/' + user_id + '/HEADER').then((resp: any) => {
      setPermisosxVista(resp)
      setPermisosxvista(resp)
    })
  }

  const effectRan = useRef(false);

  useEffect(() => {
    if (!effectRan.current) {
      fetch();
    }

    return () => {
      effectRan.current = true;
    };
  }, []);

  const checkPermission = (elemento: string) => {
    return permisosxvista.some((x: any) => x.titulo == elemento)
  }
  // const [notifications, setNotifications] = useState<string[]>([]);
  // const wsUrl = "ws://hiplot.dyndns.org:84/api_dev/ws/notify"; // URL del WebSocket en el backend
  // const socketRef = useRef<WebSocket | null>(null); // Referencia para el WebSocket
  // const retryAttempts = useRef(0); // Contador de reconexiones
  // const maxRetries = 5; // Número máximo de reintentos

  // // Función para conectar el WebSocket
  // const connectSocket = () => {
  //   const socket = new WebSocket(wsUrl);
  //   socketRef.current = socket;

  //   // Eventos del WebSocket
  //   socket.onopen = () => {
  //     console.log("Conectado al WebSocket");
  //     retryAttempts.current = 0; // Resetear intentos en reconexión exitosa
  //   };

  //   console.log(notifications)

  //   socket.onmessage = (event) => {
  //     console.log("Mensaje recibido:", event.data);
  //     setNotifications((prevNotifications) => [...prevNotifications, event.data]);
  //   };

  //   socket.onclose = (event) => {
  //     console.log("WebSocket desconectado:", event.code, event);

  //     // Desconexión anormal
  //     if (event.code === 1006) {
  //       console.log("Conexión cerrada anormalmente.");
  //     }

  //     // Intentar reconectar
  //     if (retryAttempts.current < maxRetries) {
  //       const timeout = Math.pow(2, retryAttempts.current) * 1000; // Retraso exponencial
  //       retryAttempts.current += 1;
  //       console.log(`Intentando reconectar en ${timeout / 1000} segundos...`);
  //       setTimeout(connectSocket, timeout); // Reconectar
  //     }
  //   };

  //   socket.onerror = (error) => {
  //     console.error("Error en WebSocket:", error);
  //   };
  // };

  // useEffect(() => {
  //   connectSocket();

  //   return () => {
  //     if (socketRef.current) {
  //       socketRef.current.close();
  //     }
  //   };
  // }, [wsUrl]);
  const modalLoading = storeArticles((state: any) => state.modalLoading);

  useEffect(() => {

    console.log('modalLoading en header', modalLoading);
  }, [modalLoading]);

  const [statusSale, setStatusSale] = useState<any>()
  const [statusSQuotation, setStatusQuotation] = useState<any>()

  return (
    <div className='hero'>
      <Toaster expand={true} position="top-right" richColors />
      <div className='container__hero'>
        <div className='toggle' onClick={() => setToggle(!toggle)}>
          <button className={`toggle__botton ${toggle ? 'activo' : ''}`}>
            <span className="l1 span"></span>
            <span className="l2 span"></span>
            <span className="l3 span"></span>
          </button>
        </div>
        <div>
          <div className={`inputs__general_icons`}>
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg> */}
            {/* <input className='inputs__generic' placeholder='Ejemplo@gmail.com' /> */}
            <label className='inputs__generic'> Bienvenido: {userState.nombre} ({userState.email})</label>
          </div>
        </div>
        <div className='nav__hero'>
          <div className='icon__articles-quotation-cart-btn' onClick={() => setStatusSale(!statusSale)}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M440-240v20q0 8 6 14t14 6h40q8 0 14-6t6-14v-20h40q17 0 28.5-11.5T600-280v-120q0-17-11.5-28.5T560-440H440v-40h120q17 0 28.5-11.5T600-520q0-17-11.5-28.5T560-560h-40v-20q0-8-6-14t-14-6h-40q-8 0-14 6t-6 14v20h-40q-17 0-28.5 11.5T360-520v120q0 17 11.5 28.5T400-360h120v40H400q-17 0-28.5 11.5T360-280q0 17 11.5 28.5T400-240h40ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h360l200 200v520q0 33-23.5 56.5T720-80H240Zm0-80h480v-480H600q-17 0-28.5-11.5T560-680v-120H240v640Zm0-640v160-160 640-640Z" /></svg>
            <div className={`cart-quotation__container ${statusSale ? 'active' : ''}`}>
              <div className='concepts-quotation__container'>
                <svg className='icon-change_history' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="rgb(12,36,60)"><path d="M152-160q-23 0-35-20.5t1-40.5l328-525q12-19 34-19t34 19l328 525q13 20 1 40.5T808-160H152Z" /></svg>
                <div className='row__one'>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-shopping-cart"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
                  </div>
                  <p>Detalles de las cotizaciones</p>
                </div>
                <div className='table__cart_concepts'>
                  <div className='table__head'>
                    <div className='thead'>
                      <div className='th'>
                        <p>Codigo</p>
                      </div>
                      <div className='th'>
                        <p>Descripcion</p>
                      </div>
                      <div className='th amount'>
                        <p>Cantidad</p>
                      </div>
                    </div>
                  </div>
                  {quotes ? (
                    <div className='table__body'>
                      {quotes.map((x: any) => {
                        return (
                          <div className='tbody__container' key={x.id}>
                            <div className='tbody'>
                              <div className='td code'>
                                <p>{x.codigo}</p>
                              </div>
                              <div className='td description'>
                                <p>{x.descripcion}</p>
                              </div>
                              <div className='td amount'>
                                <p>{x.cantidad}</p>
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
                <div className='row__three'>
                  <div className='total'>
                    <p className='title'>Total</p>
                    <p className='text'>$ {totalQuotes}</p>
                  </div>
                  <Link to={`${PrivateRoutes.SALES}/${PrivateRoutes.QUOTATION}`} className='sale-btn'>cotizacion</Link>
                </div>
              </div>
            </div>
          </div>
          <div className='icon__articles-sale-cart-btn' onClick={() => setStatusQuotation(!statusSQuotation)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17h-11v-14h-2" /><path d="M6 5l14 1l-1 7h-13" /></svg>
            <div className={`cart-sale__container ${statusSQuotation ? 'active' : ''}`}>
              <div className='concepts-sale__container'>
                <svg className='icon-change_history' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="rgb(12,36,60)"><path d="M152-160q-23 0-35-20.5t1-40.5l328-525q12-19 34-19t34 19l328 525q13 20 1 40.5T808-160H152Z" /></svg>
                <div className='row__one'>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-shopping-cart"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
                  </div>
                  <p>Detalles de la ventas</p>
                </div>
                <div className='table__cart_concepts' >
                  <div className='table__head'>
                    <div className='thead'>
                      <div className='th'>
                        <p>Codigo</p>
                      </div>
                      <div className='th'>
                        <p>Descripcion</p>
                      </div>
                      <div className='th amount'>
                        <p>Cantidad</p>
                      </div>
                    </div>
                  </div>
                  {saleOrdersCart ? (
                    <div className='table__body'>
                      {saleOrdersCart.map((x: any) => {
                        return (
                          <div className='tbody__container' key={x.id}>
                            <div className='tbody'>
                              <div className='td code'>
                                <p>{x.codigo}</p>
                              </div>
                              <div className='td description'>
                                <p>{x.descripcion}</p>
                              </div>
                              <div className='td amount'>
                                <p>{x.cantidad}</p>
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
                <div className='row__three'>
                  <div className='total'>
                    <p className='title'>Total</p>
                    <p className='text'>$ {totalSales}</p>
                  </div>
                  <Link to={`${PrivateRoutes.SALES}/${PrivateRoutes.SALESORDER}`} className='sale-btn'>venta</Link>
                </div>
              </div>
            </div>
          </div>
          {permisosxvista.length > 0 && checkPermission('BOTON-CATALOGO-ARTICULOS') && (
            <div className='icon__search-btn'>
              <svg onClick={() => setModalArticleView('article-view__modal_header')} xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="d-flex lucide lucide-package-search" > <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" /> <path d="m7.5 4.27 9 5.15" /> <polyline points="3.29 7 12 12 20.71 7" /> <line x1="12" x2="12" y1="22" y2="12" /> <circle cx="18.5" cy="15.5" r="2.5" /> <path d="M20.27 17.27 22 19" />
              </svg>
            </div>
          )}
          <div>
            <div className="btn__mode" onClick={handleClick}>
              <div className="btn__indicator">
                <div className="btn__icon-container">
                  {isDarkMode ? (
                    <div className={`container__svg-mode ${isDarkMode ? 'active' : ''}`}>
                      {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#5d35b0" viewBox="0 0 384 512">
                        <path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" />
                      </svg> */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="ucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
                    </div>
                  ) : (
                    <div className={`container__svg-mode ${isDarkMode ? 'active' : ''}`}>
                      {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#f39f18" viewBox="0 0 24 24" >
                        <path d="M6.993 12c0 2.761 2.246 5.007 5.007 5.007s5.007-2.246 5.007-5.007S14.761 6.993 12 6.993 6.993 9.239 6.993 12zM12 8.993c1.658 0 3.007 1.349 3.007 3.007S13.658 15.007 12 15.007 8.993 13.658 8.993 12 10.342 8.993 12 8.993zM10.998 19h2v3h-2zm0-17h2v3h-2zm-9 9h3v2h-3zm17 0h3v2h-3zM4.219 18.363l2.12-2.122 1.415 1.414-2.12 2.122zM16.24 6.344l2.122-2.122 1.414 1.414-2.122 2.122zM6.342 7.759 4.22 5.637l1.415-1.414 2.12 2.122zm13.434 10.605-1.414 1.414-2.122-2.122 1.414-1.414z"></path>
                      </svg> */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* <div>
              <div className="btn" onClick={handleClick}>
                {isDarkMode ? (
                  <div className="btn__icon-container">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 384 512">
                      <path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" />
                    </svg>
                  </div>
                ) : (
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#f39f18" viewBox="0 0 24 24" >
                   <path d="M6.993 12c0 2.761 2.246 5.007 5.007 5.007s5.007-2.246 5.007-5.007S14.761 6.993 12 6.993 6.993 9.239 6.993 12zM12 8.993c1.658 0 3.007 1.349 3.007 3.007S13.658 15.007 12 15.007 8.993 13.658 8.993 12 10.342 8.993 12 8.993zM10.998 19h2v3h-2zm0-17h2v3h-2zm-9 9h3v2h-3zm17 0h3v2h-3zM4.219 18.363l2.12-2.122 1.415 1.414-2.12 2.122zM16.24 6.344l2.122-2.122 1.414 1.414-2.122 2.122zM6.342 7.759 4.22 5.637l1.415-1.414 2.12 2.122zm13.434 10.605-1.414 1.414-2.122-2.122 1.414-1.414z"></path>
                 </svg>
                )}
              </div>
            </div> */}
          <div className='container__bell'>
            <small className='number__bell'>1</small>
            <NotificationIcon></NotificationIcon>
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" fill='#123456'   viewBox="0 0 448 512"><path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z"/></svg> */}
          </div>
          <div className={`conatiner__users ${showUsers ? '' : 'active'}`}>
            <div className='conatiner__users_svg'>
              <svg onClick={toggleUsersDisplay} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </div>
            {/* <svg className='conatiner__users_svg' onClick={toggleUsersDisplay} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" /></svg> */}
            <div className={`content__users ${showUsers ? 'active' : ''}`} >
              <div className='setting'>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill='#090d1f' viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" /></svg>
                <button className='btn__configure_users'>Perfil</button>
              </div>
              <div className='setting'>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill='#090d1f' viewBox="0 0 512 512"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" /></svg>
                <button className='btn__configure_users'>Configuracion</button>
              </div>

            </div>
          </div>
        </div>
      </div>
      <ArticleViewModal />
      {modalLoading == true ? (
        <LoadingInfo />
      ) :
        ''}
    </div>
  )
}

export default Header
