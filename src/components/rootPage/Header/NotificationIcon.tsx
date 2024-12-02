import React, { useState } from "react";
import './NotificationIcon.css';

const NotificationIcon = () => {
    // Estado para controlar si las notificaciones están visibles
    const [showNotifications, setShowNotifications] = useState(false);
  
    // Lista de notificaciones
    const notifications = [
      { user: 'Juan Pérez', date: '2024-11-28 16:00', message: 'Se ha actualizado tu estado.' },
      { user: 'Ana López', date: '2024-11-28 15:45', message: 'Nuevo comentario en tu publicación.' },
    ];
  
    // Manejar el clic en el ícono de la campana para mostrar/ocultar las notificaciones
    const toggleNotifications = () => {
      setShowNotifications(prevState => !prevState); // Alterna la visibilidad
    };
  
    return (
      <div className="notification-container">
        {/* Ícono de campana, al hacer clic alterna la visibilidad de las notificaciones */}
        <div className="notification-icon" onClick={toggleNotifications}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18"  viewBox="0 0 448 512">
            <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
          </svg>
        </div>
  
        {/* Contenedor de notificaciones, se muestra si showNotifications es true */}
        {showNotifications && (
          <div className="notification-dropdown show">
            <div className="notification-header">Notificaciones</div>
            <ul className="notification-list">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <li key={index} className="notification-item">
                    <div className="notification-avatar">
                      <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24">
                        <path d="M12,12A6,6,0,1,0,6,6,6.006,6.006,0,0,0,12,12ZM12,2A4,4,0,1,1,8,6,4,4,0,0,1,12,2Z" />
                        <path d="M12,14a9.01,9.01,0,0,0-9,9,1,1,0,0,0,2,0,7,7,0,0,1,14,0,1,1,0,0,0,2,0A9.01,9.01,0,0,0,12,14Z" />
                      </svg>
                    </div>
                    <div className="notification-content">
                      <div className="notification-user">{notification.user}</div>
                      <div className="notification-message">{notification.message}</div>
                      <div className="notification-date">{notification.date}</div>
                    </div>
                  </li>
                ))
              ) : (
                <li>No hay nuevas notificaciones.</li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  };
  

export default NotificationIcon;
