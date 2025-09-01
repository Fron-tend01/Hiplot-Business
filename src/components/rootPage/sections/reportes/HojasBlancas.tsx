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
import { storeArticles } from '../../../../zustand/Articles'
import Swal from 'sweetalert2'
const HojasBlancas: React.FC = () => {
  const [data, setData] = useState<any[]>([])
  const userState = useUserStore(state => state.user);
  const user_id = userState.id
  const selectsData: any = useSelectStore((state) => state.selectedIds);

  const hoy = new Date();
  const haceUnaSemana = new Date();
  haceUnaSemana.setDate(hoy.getDate() - 30);
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
  const setModalLoading = storeArticles((state: any) => state.setModalLoading);

  const [searcher] = useState<any>({
    id_usuario: user_id,
    id_sucursal: 0,
    desde: date[0],
    hasta: date[1],
    id_vendedor: 0,
    con_pago:false
  })
  const getData = async () => {
    searcher.id_sucursal = sucursal.id
    searcher.id_vendedor = selectsData.vendedor.id
    searcher.con_pago = conPago
    searcher.desde = date[0]
    searcher.hasta = date[1]
    setModalLoading(true)
    await APIs.CreateAny(searcher, "reporte_hojas_blancas")
      .then(async (response: any) => {
        setModalLoading(false)
        setData(response)

      }).catch((e) => {
        setModalLoading(false)

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


  const handlePrintPDF = () => {
    const printableContent = document.getElementById("print-section")?.innerHTML;
    if (!printableContent) return;
    if (!printableContent || !data || data.length === 0) return;

    const usuario = data[0]?.usuario_crea || "";
    const emp = data[0]?.empresa || "";
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
    <html>
      <head>
        <title>Reporte Hojas Blancas</title>
        <style>
          /* Copia aquí los estilos necesarios de tus clases como .hb-table, .hb-row, etc */
          body { font-family: sans-serif; padding: 20px; font-size: 12px; }
          .hb-table { margin-bottom: 20px;
              border: 2px solid #000;
              padding: 2px;
              border-radius: 6px; }
          .hb-row { display: flex; border-bottom: 1px solid #ccc; padding: 2px 0; }
          .hb-header, .hb-subheader { font-weight: bold; background: #eee; }
          .hb-cell { flex: 1; padding: 0 4px; }
          .hb-col-folio { flex: 2; }
          .hb-col-fecha, .hb-col-cliente { flex: 1.5; }
        </style>
      </head>
      <body>
        <b > ${emp}</b><br >
        <b >${usuario}</b><br >
        <small>Reporte hojas blancas del ${searcher.desde} al ${searcher.hasta} generado el ${hoy} </small>
        ${printableContent}
      </body>
    </html>
  `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };
  const [conPago, setConPago] = useState<boolean>(false)
  return (
    <div className='HojasBlancas'>
      <div className=''>
        <div className='row'>
          <div className='col-4'>
            <Empresas_Sucursales modeUpdate={false} empresaDyn={empresa} sucursalDyn={sucursal}
              setEmpresaDyn={setEmpresa} setSucursalDyn={setSucursal}></Empresas_Sucursales>
          </div>
          <div className='col-3'>
            <label className='label__general'>Fechas</label>
            <div className='container_dates__requisition'>
              <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={date} onChange={handleDateChange} placeholder='seleciona las fechas' />
            </div>
          </div>
          <div className='col-2'>
            <Select dataSelects={users} nameSelect={'Vendedor'} instanceId='vendedor' />

          </div>
          <div className='col-3'>
            <label htmlFor="">Reporte Con Pagos</label><br />
            <label className="switch" style={{ marginRight: '8px' }}>
              <input
                className="inputs__general"
                type="checkbox"
                checked={conPago}
                onChange={(e) =>{
                  // Swal.fire('Notificacion', 'Opción en desarrollo', 'info')
                  // return
                  setConPago(e.target.checked)}}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
        <div className='row' style={{ marginBottom: '15px' }}>
          <div className='col-12'>
            <div className='d-flex justify-content-center align-items-end'>
              <button className='btn__general-purple' onClick={getData}>GENERAR REPORTE</button>
              {data?.length > 0 && (
                <div className='d-flex justify-content-center align-items-end'>
                  <button className='btn__general-success' onClick={handlePrintPDF}>GENERAR PDF</button>
                </div>

              )}
            </div>
          </div>
        </div>
        <span id="print-section">
          {data?.length > 0 ? (
            data.map((x, index) => (
              <div key={index} className="hb-table" >
                {/* Cabecera */}
                <div className="hb-row hb-header">
                  <div className="hb-cell hb-col-folio">Folio</div>
                  <div className="hb-cell hb-col-fecha">Fecha</div>
                  <div className="hb-cell hb-col-cliente">Cliente</div>
                </div>

                {/* Datos generales */}
                <div className="hb-row">
                  <div className="hb-cell hb-col-folio">
                    {x.serie}-{x.folio}-{x.anio} <br />
                    <span>
                      OrdenDeProducción:{" "}
                      {x.ordenes_produccion?.[0]?.folio_completo || "Sin orden"}
                    </span>
                  </div>
                  <div className="hb-cell hb-col-fecha">
                    {new Date(x.fecha_creacion).toLocaleDateString()}
                  </div>
                  <div className="hb-cell hb-col-cliente">{x.razon_social}</div>
                </div>

                {/* Subencabezado */}
                <div className="hb-row hb-subheader">
                  <div className="hb-cell">Código</div>
                  <div className="hb-cell">Cantidad</div>
                  <div className="hb-cell">Neto</div>
                  <div className="hb-cell">Factura</div>
                  <div className="hb-cell">Pagos</div>
                </div>

                {/* Conceptos */}
                {x.conceptos.map((c, i) => (
                  <div key={i} className="hb-row">
                    <div className="hb-cell">{c.codigo}</div>
                    <div className="hb-cell">
                      {c.cantidad} {c.unidad}
                    </div>
                    <div className="hb-cell">{c.total}</div>
                    <div className="hb-cell">
                      {c.folios_factura || ""}
                    </div>
                    <div className="hb-cell">
                      {c.pagos}
                    </div>
                  </div>
                ))} {/* Conceptos */}
                {x.conceptos_pers.map((c, i) => (
                  <>
                  <div key={i} className="hb-row" style={{ border: '2px solid rgb(4, 0, 255)' }} title='Este es un concepto personalizado'>
                    <div className="hb-cell">{c.codigo}</div>
                    <div className="hb-cell">
                      {c.cantidad} {c.unidad_nombre}
                    </div>
                    <div className="hb-cell">{c.precio_total}</div>
                    <div className="hb-cell">
                      {c.folios_factura || ""}
                    </div>
                    <div className="hb-cell">
                      {c.pagos}
                    </div>
                  </div>
                  </>
                ))}
              </div>
            ))
          ) : (
            <tr>
              <td colSpan={13} className="HojasBlancasData__no-data">
                No hay datos disponibles
              </td>
            </tr>
          )}

        </span>




      </div>
    </div>
  )
}

export default HojasBlancas
