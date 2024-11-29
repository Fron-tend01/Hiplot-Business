

import React, { useState, useEffect, useRef } from 'react';
import { useThemeStore } from '../../../zustand/ThemeStore';
import './Header.css';
import NotificationIcon from './NotificationIcon';

const Header: React.FC = () => {

  const { toggleTheme } = useThemeStore();
  const [showUsers, setShowUsers] = useState<boolean>(false);

  const toggleUsersDisplay = () => {
    setShowUsers(!showUsers);
  };

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const activeMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleClick = () => {
    document.body.classList.toggle("darkmode");
    toggleTheme()
    setIsDarkMode(!isDarkMode);
    activeMode();
  };

  const [notifications, setNotifications] = useState<string[]>([]);
  const wsUrl = "ws://hiplot.dyndns.org:84/api_dev/ws/notify"; // URL del WebSocket en el backend
  const socketRef = useRef<WebSocket | null>(null); // Referencia para el WebSocket
  const retryAttempts = useRef(0); // Contador de reconexiones
  const maxRetries = 5; // Número máximo de reintentos

  // Función para conectar el WebSocket
  const connectSocket = () => {
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    // Eventos del WebSocket
    socket.onopen = () => {
      console.log("Conectado al WebSocket");
      retryAttempts.current = 0; // Resetear intentos en reconexión exitosa
    };

    console.log(notifications)

    socket.onmessage = (event) => {
      console.log("Mensaje recibido:", event.data);
      setNotifications((prevNotifications) => [...prevNotifications, event.data]);
    };

    socket.onclose = (event) => {
      console.log("WebSocket desconectado:", event.code, event);

      // Desconexión anormal
      if (event.code === 1006) {
        console.log("Conexión cerrada anormalmente.");
      }

      // Intentar reconectar
      if (retryAttempts.current < maxRetries) {
        const timeout = Math.pow(2, retryAttempts.current) * 1000; // Retraso exponencial
        retryAttempts.current += 1;
        console.log(`Intentando reconectar en ${timeout / 1000} segundos...`);
        setTimeout(connectSocket, timeout); // Reconectar
      }
    };

    socket.onerror = (error) => {
      console.error("Error en WebSocket:", error);
    };
  };

  useEffect(() => {
    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [wsUrl]);

  return (
    <div className='hero'>
      <div className='container__hero'>
        <div className='nav__hero'>
          <div>
            <div className="btn__mode" onClick={handleClick}>
              <div className="btn__indicator">
                <div className="btn__icon-container">
                  {isDarkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#5d35b0" viewBox="0 0 384 512">
                      <path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#f39f18" viewBox="0 0 24 24" >
                      <path d="M6.993 12c0 2.761 2.246 5.007 5.007 5.007s5.007-2.246 5.007-5.007S14.761 6.993 12 6.993 6.993 9.239 6.993 12zM12 8.993c1.658 0 3.007 1.349 3.007 3.007S13.658 15.007 12 15.007 8.993 13.658 8.993 12 10.342 8.993 12 8.993zM10.998 19h2v3h-2zm0-17h2v3h-2zm-9 9h3v2h-3zm17 0h3v2h-3zM4.219 18.363l2.12-2.122 1.415 1.414-2.12 2.122zM16.24 6.344l2.122-2.122 1.414 1.414-2.122 2.122zM6.342 7.759 4.22 5.637l1.415-1.414 2.12 2.122zm13.434 10.605-1.414 1.414-2.122-2.122 1.414-1.414z"></path>
                    </svg>
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
            <svg className='conatiner__users_svg' onClick={toggleUsersDisplay} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" /></svg>
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
    </div>
  )
}

export default Header
