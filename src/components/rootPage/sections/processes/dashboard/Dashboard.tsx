import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import logo from '../../../../../assets/HI SOFT BIENVENIDA-14.png';

const Dashboard = () => {
  const [showBienvenida, setShowBienvenida] = useState(false);

  useEffect(() => {
    const yaMostrado = localStorage.getItem('bienvenida-mostrada');
    if (!yaMostrado) {
      setShowBienvenida(true);
      localStorage.setItem('bienvenida-mostrada', 'true');
    }
  }, []);

  const volverAMostrarBienvenida = () => {
    setShowBienvenida(true);
  };

  return (
    <div className='dashboard'>
      {showBienvenida && (
        <div className="bienvenida-overlay" onClick={() => setShowBienvenida(false)}>
          <div className="bienvenida-content" onClick={(e) => e.stopPropagation()}>
            <img src={logo} alt="Logo" />
            {/* <ul>
              <li>✅ Puedes modificar máximos y mínimos desde el reporte de almacén</li>
              <li>🎨 Nueva interfaz gráfica mejorada</li>
              <li>🛠️ Correcciones internas de base de datos</li>
            </ul> */}
            <button onClick={() => setShowBienvenida(false)}>Cerrar</button>
          </div>
        </div>
      )}

      <div className='dashboard__container'>
        <button onClick={volverAMostrarBienvenida} className='btn__mostrar-bienvenida'>
          Volver a mostrar bienvenida
        </button>
        {/* Aquí podrías incluir más contenido del dashboard */}
      </div>
    </div>
  );
};

export default Dashboard;
