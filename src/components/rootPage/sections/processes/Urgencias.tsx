import APIs from '../../../../services/services/APIs'
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react'
import DynamicVariables from '../../../../utils/DynamicVariables';
import '../../../../utils/DynamicVariables';
import useUserStore from '../../../../zustand/General';
import "./styles/Urgencias.css"
import { RangesRequests } from '../../../../fuctions/Ranges'
import { companiesRequests } from '../../../../fuctions/Companies';
import { BranchOfficesRequests } from '../../../../fuctions/BranchOffices';
import Empresas_Sucursales from '../../Dynamic_Components/Empresas_Sucursales';
import { useStore } from 'zustand';
import { storeDv } from '../../../../zustand/Dynamic_variables';
import Filtrado_Articulos_Basic from '../../Dynamic_Components/Filtrado_Articulos_Basic';
interface urgencia_i {
  id: number,
  id_sucursal: number,
  porcentaje: number,
  cobro_min: number,
  urgencias_articulos: any[],
  urgencias_articulos_elim: any[]
}
const Urgencias = () => {
  const [Urgencia, setUrgencia] = useState<urgencia_i>({
    id: 0,
    id_sucursal: 0,
    porcentaje: 0,
    cobro_min: 0,
    urgencias_articulos: [],
    urgencias_articulos_elim: []
  })
  const [UrgenciaClear, setUrgenciaClear] = useState<urgencia_i>({
    id: 0,
    id_sucursal: 0,
    porcentaje: 0,
    cobro_min: 0,
    urgencias_articulos: [],
    urgencias_articulos_elim: []
  })

  const [modal, setModal] = useState<boolean>(false)
  const [modoUpdate, setModoUpdate] = useState<boolean>(false)

  const [data, setData] = useState<any>(null)
  const { empresa, sucursal }: any = useStore(storeDv)

  const Modal = (modoUpdate: boolean, data: any) => {
    setModal(true)
    if (modoUpdate) {
      // DynamicVariables.updateAnyVar(setTiempose, "id", data.id)
      // DynamicVariables.updateAnyVar(setTiempose, "nombre", data.nombre)
      // DynamicVariables.updateAnyVar(setTiempose, "id_empresa", data.id_empresa)
      // selectAutomaticSuc(data.id_empresa)
      // DynamicVariables.updateAnyVar(setTiempose, "id_sucursal", data.id_sucursal)
      // DynamicVariables.updateAnyVar(setTiempose, "id_rango", data.id_rango)
      // //LLENAR LA VARIABLE COLECCION
      // data.articulos.forEach((element:any) => {
      //   DynamicVariables.updateAnyVarSetArrNoRepeat(setColeccion, "colecciones_art_piv", element)
      //   // DynamicVariables.updateAnyVarSetArrNoRepeat(setColeccion, "combinaciones_sucursales", element.id)
      // });
      // data.sucursales.forEach((element:any) => {
      //     DynamicVariables.updateAnyVarSetArrNoRepeat(setColeccion, "colecciones_suc_piv", element)
      // });
      setModoUpdate(true)
    } else {
      setModoUpdate(false)
    }
  }
  const getData = async () => {
    let result = await APIs.CreateAny('', "tentrega_get")
    setData(result)
  }
  console.log(empresa, sucursal);

  return (
    <div className='te'>
      <div className='te__container'>

        <div className='row'>
          <div className='col-12'>
            <div className='btns__create'>
              <button className='btn__general-purple' onClick={() => Modal(false, 0)}>Crear Urgencia</button>
            </div>
          </div>
        </div>
        {/* <div className='row'>
          <div className='col-12'>
            <Empresas_Sucursales />
          </div>
        </div> */}





        {/* -------------------------------------------------------------MODALES----------------------------------------------------------------------------- */}
        <div className={`overlay__create_modal ${modal ? 'active' : ''}`}>
          <div className={`popup__create_modal ${modal ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__create_modal" onClick={() => setModal(false)}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
            </a>
            {modoUpdate ?
              <p className='title__modals'><b>Actualizar Tiempos de Entrega</b></p>
              :
              <p className='title__modals'><b>Configurar Urgencias</b></p>
            }
            <hr />
            <div className='row'>
              <div className='col-8 md-col-7 sm-col-12'>
                <Empresas_Sucursales />
              </div>
              <div className='col-2 md-col-2 sm-col-12'>
                <label className='label__general'>%</label>
                <input className={`inputs__general`} value={Urgencia.porcentaje} onChange={(e) => DynamicVariables.updateAnyVar(setUrgencia, "porcentaje", parseInt(e.target.value))} type='number' placeholder='Ingresa nombre' />
              </div>
              <div className='col-2 md-col-3 sm-col-12'>
                <label className='label__general'>Cobro min.</label>
                <input className={`inputs__general`} value={Urgencia.porcentaje} onChange={(e) => DynamicVariables.updateAnyVar(setUrgencia, "porcentaje", parseInt(e.target.value))} type='number' placeholder='Ingresa nombre' />
              </div>
            </div>
            <div className='row'>
              <div className='col-12'>
                <label className='label__general'>FILTRADO DE ARTICULOS</label>
                <Filtrado_Articulos_Basic />

              </div>
            </div>
          </div>
        </div>
        {/* -------------------------------------------------------------FIN MODALES----------------------------------------------------------------------------- */}

      </div>

    </div>
  )
}

export default Urgencias
