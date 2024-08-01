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

interface urgencia_i {
  id: number,
  id_sucursal: number,
  porcentaje: number,
  urgencias_articulos: any[],
  urgencias_articulos_elim: any[]
}
const Urgencias = () => {
  const [Urgencia, setUrgencia] = useState<urgencia_i>({
    id: 0,
    id_sucursal: 0,
    porcentaje: 0,
    urgencias_articulos: [],
    urgencias_articulos_elim: []
  })
  const [UrgenciaClear, setUrgenciaClear] = useState<urgencia_i>({
    id: 0,
    id_sucursal: 0,
    porcentaje: 0,
    urgencias_articulos: [],
    urgencias_articulos_elim: []
  })
  const [dataEmpresas_Sucursales, setDataEmpresas_Sucursales] = useState<any>({});
  const obteniendoEmpresa_Sucursal = (returnedData: any) => {
    setDataEmpresas_Sucursales(returnedData);
  };
  useEffect(() => {
    console.log(dataEmpresas_Sucursales);
  }, [dataEmpresas_Sucursales])
  const [modal, setModal] = useState<boolean>(false)
  const [modoUpdate, setModoUpdate] = useState<boolean>(false)

  const [data, setData] = useState<any>(null)

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
        <Empresas_Sucursales onReturn={obteniendoEmpresa_Sucursal} />
      </div>

    </div>
  )
}

export default Urgencias
