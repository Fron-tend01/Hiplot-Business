//////////////////////////////////////////////////////////////////////////////////MODULO INCOMPLETO - FALTA PETICIÓN POR BACK, PDF Y VISUALIZAR EN HTML
import React, { useEffect, useState } from 'react'
import './styles/HojasBlancas.css'
import APIs from '../../../../services/services/APIs'
import useUserStore from '../../../../zustand/General'
import Empresas_Sucursales from '../../Dynamic_Components/Empresas_Sucursales'
import Flatpickr from "react-flatpickr";
import { Spanish } from 'flatpickr/dist/l10n/es.js'; // Importa la localización en español
import { usersRequests } from '../../../../fuctions/Users'
import Select from '../../Dynamic_Components/Select'
import { useSelectStore } from '../../../../zustand/Select'
const HojasBlancas: React.FC = () => {
  const [data, setData] = useState<any[]>([])
  const userState = useUserStore(state => state.user);
  const user_id = userState.id
  const selectsData: any = useSelectStore((state) => state.selectedIds);

  const hoy = new Date();
  const haceUnaSemana = new Date();
  haceUnaSemana.setDate(hoy.getDate() - 7);
  const [date, setDate] = useState([
    haceUnaSemana.toISOString().split('T')[0],
    hoy.toISOString().split('T')[0]
  ]);
  const handleDateChange = (fechasSeleccionadas: any) => {
    if (fechasSeleccionadas.length === 2) {
      setDate(fechasSeleccionadas.map((fecha: any) => fecha.toISOString().split('T')[0]));
    } else {
      setDate([fechasSeleccionadas[0]?.toISOString().split('T')[0] || "", ""]);
    }
  };
  const [searcher] = useState<any>({
    id_usuario: user_id,
    id_sucursal: 0,
    desde: date[0],
    hasta: date[1],
    id_vendedor: 0
  })
  const getData = async () => {
    searcher.id_sucursal = sucursal.id
    searcher.id_vendedor = selectsData.vendedor.id

    await APIs.CreateAny(searcher, "reporte_hojas_blancas")
      .then(async (response: any) => {
        setData(response)
      })
  }
  const [empresa, setEmpresa] = useState<any>({})
  const [sucursal, setSucursal] = useState<any>({})
  const { getUsers }: any = usersRequests()
  const [users, setUsers] = useState<any>()

  const fetch = async () => {

    const data = {
      nombre: '',
      id_usuario: user_id,
      id_usuario_consulta: user_id,
      light: true,
      id_sucursal: 0
    }
    const resultUsers = await getUsers(data)
    setUsers({
      selectName: 'Vendedores',
      options: 'nombre',
      dataSelect: resultUsers
    })
  }



  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className='HojasBlancas'>
      <div className='HojasBlancas__container'>
        <div className='row'>
          <div className='col-5'>
            <Empresas_Sucursales modeUpdate={false} empresaDyn={empresa} sucursalDyn={sucursal} 
              setEmpresaDyn={setEmpresa} setSucursalDyn={setSucursal}></Empresas_Sucursales>
          </div>
          <div className='col-3'>
            <label className='label__general'>Fechas</label>
            <div className='container_dates__requisition'>
              <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={date} onChange={handleDateChange} placeholder='seleciona las fechas' />
            </div>
          </div>
          <div className='col-3'>
            <Select dataSelects={users} nameSelect={'Vendedor'} instanceId='vendedor' />

          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <div className='d-flex justify-content-center align-items-end'>
              <button className='btn__general-purple' onClick={getData}>GENERAR REPORTE</button>
            </div>
          </div>
        </div>

        <div className="HojasBlancasData__container">
          <table className="HojasBlancasData__table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Artículo</th>
                <th>Cant.</th>
                <th>P/U</th>
                <th>Desc.</th>
                <th>Subtotal</th>
                <th>IVA</th>
                <th>Total</th>
                <th>Proveedor</th>
                <th>Sucursal</th>
                <th>Empresa</th>
                <th>OC</th>
                <th>Entradas</th>
              </tr>
            </thead>
            <tbody>
              {data?.length > 0 ? (
                data.map((x, index) => {
                  const subtotal = (x.precio_unitario * x.cantidad) - x.descuento;
                  const iva = x.iva_on ? subtotal * 0.16 : 0;
                  const total = subtotal + iva;

                  return (
                    <tr key={index}>
                      <td>{x.fecha_creacion}</td>
                      <td>{x.codigo} - {x.descripcion}</td>
                      <td>{x.cantidad} - {x.unidad_nombre}</td>
                      <td>${x.precio_unitario.toFixed(2)}</td>
                      <td>${x.descuento.toFixed(2)}</td>
                      <td>${subtotal.toFixed(2)}</td>
                      <td>${iva.toFixed(2)}</td>
                      <td>${total.toFixed(2)}</td>
                      <td>{x.proveedor}</td>
                      <td>{x.sucursal}</td>
                      <td>{x.empresa}</td>
                      <td>{x.folio_oc}</td>
                      <td>NO DISPONIBLE</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={13} className="HojasBlancasData__no-data">
                    No hay datos disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


      </div>
    </div>
  )
}

export default HojasBlancas
