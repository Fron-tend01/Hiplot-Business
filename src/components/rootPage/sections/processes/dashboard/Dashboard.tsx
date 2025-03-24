import React from 'react'
import './Dashboard.css'

const Dashboard = () => {
  return (
    <div className='dashboard'>
      <div className='dashboard__container'>
        <div className='item'>
          <p>NOTAS DEL PARCHE</p>
          <p>¡NUEVO!</p>
          <div className='messages__dashboard'>
            <p>+ Ahora puedes hacer modificaciones de maximos y minimos desde el reporte Existencia Almacen</p>
            <p>+ Se hicieron cambios en la visualización del sistema así como su interfaz</p>
          </div>
        </div>
        <div className='item'>
          <p>BUG FIXES</p>
          <div className='messages__dashboard'>
            <p>- Se realizaron pequeñas correcciones visuales.</p>
            <p>- Se realizaron correcciones internas y de base de datos.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
