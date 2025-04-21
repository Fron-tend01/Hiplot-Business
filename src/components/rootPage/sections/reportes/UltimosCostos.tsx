import React, { useState } from 'react'
import './styles/UltimosCostos.css'
import APIs from '../../../../services/services/APIs'
import DynamicVariables from '../../../../utils/DynamicVariables'
import Filtrado_Articulos_Basic from '../../Dynamic_Components/Filtrado_Articulos_Basic'
import useUserStore from '../../../../zustand/General'
import Empresas_Sucursales from '../../Dynamic_Components/Empresas_Sucursales'
import Flatpickr from "react-flatpickr";
import { Spanish } from 'flatpickr/dist/l10n/es.js'; // Importa la localización en español
const UltimosCostos: React.FC = () => {
  const [articulos, setArticulos] = useState<any[]>([])
  const [data, setData] = useState<any[]>([])
  const userState = useUserStore(state => state.user);
  const user_id = userState.id

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
  const [searcher, setSearcher] = useState<any>({
    id_usuario: user_id,
    id_sucursal: 0,
    desde: date[0],
    hasta: date[1],
    sin_entrada: false,
    ignorar_fecha: false,
    ids_articulos: []
  })
  const getData = async () => {
    let filter_art = articulos.map(articulo => articulo.id);
    searcher.id_sucursal = sucursal.id
    searcher.ids_articulos = filter_art
    searcher.desde = date[0]
    searcher.hasta = date[1]
    await APIs.CreateAny(searcher, "reporte_ultimos_costos")
      .then(async (response: any) => {
        setData(response)
      })
  }
  const [empresa, setEmpresa] = useState<any>({})
  const [sucursal, setSucursal] = useState<any>({})
  return (
    <div className='ultimosCostos'>
      <div className='ultimosCostos__container'>
        <div className='row'>
          <div className='col-5'>
            <Empresas_Sucursales modeUpdate={false} empresaDyn={empresa} sucursalDyn={sucursal} all={true}
              setEmpresaDyn={setEmpresa} setSucursalDyn={setSucursal}></Empresas_Sucursales>
          </div>
          <div className='col-3'>
            <label className='label__general'>Fechas</label>
            <div className='container_dates__requisition'>
              <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={date} onChange={handleDateChange} placeholder='seleciona las fechas' />
            </div>
          </div>
          <div className='col-2 text-center'>
            <label className='text'>Sin entradas</label><br />
            <label className="switch">
              <input style={{ width: '100px' }} className={`inputs__general`} type="checkbox" checked={searcher.sin_entrada}
                onChange={(e) => { DynamicVariables.updateAnyVar(setSearcher, 'sin_entrada', e.target.checked) }}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className='col-2 text-center'>
            <label className='text'>Ignorar Fechas</label><br />

            <label className="switch">
              <input style={{ width: '100px' }} className={`inputs__general`} type="checkbox" checked={searcher.ignorar_fecha}
                onChange={(e) => { DynamicVariables.updateAnyVar(setSearcher, 'ignorar_fecha', e.target.checked) }}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>

            <label className='label__general'>AGREGAR ARTICULOS PARA EL REPORTE</label>

            <Filtrado_Articulos_Basic set_article_local={setArticulos} />
            <div className='table__ultimosCostos '>
              <div>
                {articulos.length >= 1 ? (
                  <div>
                    <p className='text'>Articulos en la Lista ({articulos.length})</p>
                  </div>
                ) : (
                  <p className='text'>No hay Articulos</p>
                )}
              </div>
              <div className='table__head'>
                <div className='thead'>
                  <div className='th'>
                    <p className=''>Articulo</p>
                  </div>
                  <div className='th'>
                    <p className=''>Familia</p>
                  </div>
                </div>
              </div>
              {Array.isArray(articulos) && articulos.length > 0 ? (
                <div className='table__body'>
                  {articulos.map((dat: any, index: number) => (

                    <div className='tbody__container' key={index}>
                      <div className='tbody'>
                        <div className='td'>
                          {dat.codigo} - {dat.descripcion}
                        </div>
                        <div className='td'>
                          {dat.nombre}
                        </div>

                        <div className='td'>
                          <button className='btn__delete_users' type="button" onClick={() => {
                            DynamicVariables.removeObjectInArray(setArticulos, index);
                          }}>Eliminar</button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <p className='text'>No hay articulos que cargar</p>
              )}
            </div>
          </div>
          <div className='col-12'>
            <div className='d-flex justify-content-center align-items-end'>
              <button className='btn__general-purple' onClick={getData}>GENERAR REPORTE</button>
            </div>
          </div>
        </div>

        <div className="ultimosCostosData__container">
          <table className="ultimosCostosData__table">
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
                  <td colSpan={13} className="ultimosCostosData__no-data">
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

export default UltimosCostos
