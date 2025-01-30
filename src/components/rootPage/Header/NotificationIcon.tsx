import React, { useState } from "react";
import './NotificationIcon.css';
import Swal from 'sweetalert2';

const NotificationIcon: React.FC = () => {
    // Estado para controlar si las notificaciones están visibles
    const [showNotifications] = useState(false);
  
    // Lista de notificaciones
    const notifications = [
      { user: 'Juan Pérez', date: '2024-11-28 16:00', message: 'Se ha actualizado tu estado.' },
      { user: 'Ana López', date: '2024-11-28 15:45', message: 'Nuevo comentario en tu publicación.' },
    ];
  
    // Manejar el clic en el ícono de la campana para mostrar/ocultar las notificaciones
    const toggleNotifications = () => {
      Swal.fire({
        title: "Sección en desarrollo",
        text: "Estamos trabajando para mejorar esta funcionalidad. Próximamente estará disponible.",
        icon: "info",
      });
      // setShowNotifications(prevState => !prevState); // Alterna la visibilidad
    };

  
    return (
      <div className="notification-container">
        {/* Ícono de campana, al hacer clic alterna la visibilidad de las notificaciones */}
        <div className="notification-icon" onClick={toggleNotifications}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>
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
