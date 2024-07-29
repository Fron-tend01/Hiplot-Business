import APIs from '../../../../services/services/APIs'
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react'
import DynamicVariables from '../../../../utils/DynamicVariables';
import '../../../../utils/DynamicVariables';
import { storeCompanies } from '../../../../zustand/Companies';
import { storeBranchOffcies } from '../../../../zustand/BranchOffices';
import useUserStore from '../../../../zustand/General';
import "./styles/TiemposEntrega.css"
import { storeArticles } from '../../../../zustand/Articles';


const TiemposEntrega = () => {
  const [modal, setModal] = useState<boolean>(false)
  const [modoUpdate, setModoUpdate] = useState<boolean>(false)

  const Modal = (modoUpdate:boolean, data:any) => {
    setModal(true)
    // setColeccion({...forclearColeccion})
    if (modoUpdate) {
      // DynamicVariables.updateAnyVar(setColeccion, "id", data.id)
      // DynamicVariables.updateAnyVar(setColeccion, "nombre", data.nombre)
      // DynamicVariables.updateAnyVar(setColeccion, "status", data.status)
      // DynamicVariables.updateAnyVar(setColeccion, "img", data.img)
      // DynamicVariables.updateAnyVar(setColeccion, "id_familia", data.id_familia)
      // //LLENAR LA VARIABLE COLECCION
      // data.articulos.forEach((element:any) => {
      //   DynamicVariables.updateAnyVarSetArrNoRepeat(setColeccion, "colecciones_art_piv", element)
      //   // DynamicVariables.updateAnyVarSetArrNoRepeat(setColeccion, "combinaciones_sucursales", element.id)
      // });
      // data.sucursales.forEach((element:any) => {
      //     DynamicVariables.updateAnyVarSetArrNoRepeat(setColeccion, "colecciones_suc_piv", element)
      // });
      setModoUpdate(true)

    }else {
      setModoUpdate(false)
    }
  }
  const closeModal = () => {
    setModal(false)
  }
  return (
    <div className='te'>
      <div className='te__container'>
        <div className='btns__create'>
          <button className='btn__general-purple' onClick={() => Modal(false, 0)}>Crear Tiempo de entrega</button>
        </div>

        <div className={`overlay__create_modal ${modal ? 'active' : ''}`}>
          <div className={`popup__create_modal ${modal ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__create_modal" onClick={closeModal}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
            </a>
            {modoUpdate ? 
              <p className='title__modals'><b>Actualizar Tiempos de Entrega</b></p>
              :
              <p className='title__modals'><b>Crear Tiempos de Entrega</b></p>
            }
            <br />
            <hr />
            <br />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TiemposEntrega
