import React, { useEffect, useState } from 'react'
import './styles/ventas.css'
import APIs from '../../../../services/services/APIs'
import DynamicVariables from '../../../../utils/DynamicVariables'
import Filtrado_Articulos_Basic from '../../Dynamic_Components/Filtrado_Articulos_Basic'
import useUserStore from '../../../../zustand/General'
import Empresas_Sucursales from '../../Dynamic_Components/Empresas_Sucursales'
import Flatpickr from "react-flatpickr";
import { Spanish } from 'flatpickr/dist/l10n/es.js'; // Importa la localización en español
import Select from '../../Dynamic_Components/Select'
import { usersRequests } from '../../../../fuctions/Users'
import { useSelectStore } from '../../../../zustand/Select'
import { storeArticles } from '../../../../zustand/Articles'

const Ventas: React.FC = () => {
  const [articulos, setArticulos] = useState<any[]>([])
  const [data, setData] = useState<any[]>([])
  const [areas, setAreas] = useState<any[]>([])
  const userState = useUserStore(state => state.user);
  const user_id = userState.id
  const [empresa, setEmpresa] = useState<any>({})
  const [sucursal, setSucursal] = useState<any>({})
  const [users, setUsers] = useState<any>()
  const { getUsers }: any = usersRequests()

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
    id_vendedor: 0,
    id_empresa: 0,
    id_sucursal: 0,
    id_area: 0,
    desde: date[0],
    hasta: date[1],
    articulos: []
  })
  const selectedIds: any = useSelectStore((state) => state.selectedIds);
  const setSelectData: any = useSelectStore((state) => state.setSelectedId);
  useEffect(() => {
    getVendedores();
  }, []);
  const getVendedores = async () => {
    const data = {
      nombre: '',
      id_usuario: user_id,
      id_usuario_consulta: user_id,
      light: true,
      id_sucursal: 0
    }

    let resultUsers = await getUsers(data)
    resultUsers.unshift({ 'id': 0, 'nombre': 'Todos' })
    setUsers({
      selectName: 'Vendedores',
      options: 'nombre',
      dataSelect: resultUsers
    })
    setSelectData('vendedor', resultUsers[0])


  }
  useEffect(() => {
    getAreas();
  }, [sucursal]);
  const getAreas = async () => {
    await APIs.GetAny("get_area_x_sucursal/" + sucursal.id + "/" + user_id)
      .then(async (response: any) => {
        response.unshift({ 'id': 0, 'nombre': 'Todos' })

        setAreas(response)
      })
  }
  const [t, setT] = useState<any>({})
  const [tArt, setTArt] = useState<any>([])
  const [sucs, setSucs] = useState<any>([])
  const [Glob, setGlob] = useState<any>([])
  const setModalLoading = storeArticles((state: any) => state.setModalLoading);

  const getData = async () => {
    let filter_art = articulos.map(articulo => articulo.id);
    searcher.id_usuario = user_id
    searcher.id_vendedor = selectedIds.vendedor.id ?? 0
    searcher.id_sucursal = sucursal.id
    searcher.id_empresa = empresa.id
    searcher.id_area = parseInt(searcher.id_area)
    searcher.articulos = filter_art
    searcher.desde = date[0]
    searcher.hasta = date[1]
    setModalLoading(true)
    await APIs.CreateAny(searcher, "reporte_ventas")
      .then(async (response: any) => {
        setModalLoading(false)

        setData(response)
        const totalesPorArticulo = response.reduce((acc: any, x: any) => {
          const id = x.id_articulo ?? x.codigo; // Usa el identificador que tengas
          if (!acc[id]) {
            acc[id] = {
              descripcion: x.descripcion,
              codigo: x.codigo,
              unidad_nombre: x.unidad_nombre,
              cantidad: 0,
              total: 0,
              descuento: 0,
              urgencia: 0,
              total_final: 0,
            };
          }
          const total = (x.total ?? 0) - (x.monto_descuento ?? 0) + (x.monto_urgencia ?? 0);
          acc[id].cantidad += x.cantidad ?? 0;
          acc[id].total += x.total ?? 0;
          acc[id].descuento += x.monto_descuento ?? 0;
          acc[id].urgencia += x.monto_urgencia ?? 0;
          acc[id].total_final += total ?? 0;

          return acc;
        }, {});
        const listaTotales = Object.values(totalesPorArticulo);

        setTArt(listaTotales)
        const totales = response.reduce(
          (acc, x) => {
            const total = x.total - x.monto_descuento + x.monto_urgencia;
            acc.cantidad += x.cantidad ?? 0;
            acc.total += x.total ?? 0;
            acc.descuento += x.monto_descuento ?? 0;
            acc.urgencia += x.monto_urgencia ?? 0;
            acc.total_final += total ?? 0;
            return acc;
          },
          { cantidad: 0, total: 0, descuento: 0, urgencia: 0, total_final: 0 }
        );
        setT(totales)
        const { sucursales, globales } = procesarDatos(response);
        setSucs(sucursales)
        setGlob(globales)

      }).finally(() => {
        setModalLoading(false)
      })
  }


  const exportToCSV = () => {
    const headers = [
      "Fecha", "Artículo", "Cant.", "Unidad", "P/U", "Subtotal", "Desc", "Urg.", "Total", "OV", "Fact"
    ];

    let rows: string[][] = [];

    // Datos individuales
    data.forEach((x: any) => {
      const total = (x.total ?? 0) - (x.monto_descuento ?? 0) + (x.monto_urgencia ?? 0);
      rows.push([
        x.fecha_creacion,
        `${x.codigo} - ${x.descripcion}`,
        String(x.cantidad),
        x.unidad_nombre,
        `$${x.precio_unitario?.toFixed(2)}`,
        `$${x.total?.toFixed(2)}`,
        `$${x.monto_descuento?.toFixed(2)}`,
        `$${x.monto_urgencia?.toFixed(2)}`,
        `$${total.toFixed(2)}`,
        x.folio_ov ?? '',
        x.folio_fact ?? '',
      ]);
    });

    // Totales generales
    rows.push([
      '', 'Totales', String(t?.cantidad ?? 0), '', '',
      `$${t?.total?.toFixed(2) ?? 0}`,
      `$${t?.descuento?.toFixed(2) ?? 0}`,
      `$${t?.urgencia?.toFixed(2) ?? 0}`,
      `$${t?.total_final?.toFixed(2) ?? 0}`,
      '', ''
    ]);

    // Totales por artículo
    tArt?.forEach((art: any) => {
      rows.push([
        '', `${art.codigo} - ${art.descripcion}`,
        String(art.cantidad),
        art.unidad_nombre,
        '',
        `$${art.total.toFixed(2)}`,
        `$${art.descuento.toFixed(2)}`,
        `$${art.urgencia.toFixed(2)}`,
        `$${art.total_final.toFixed(2)}`,
        '', ''
      ]);
    });

    // Construcción del CSV
    const csvContent = [headers, ...rows]
      .map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    // Descargar como archivo
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "reporte_ventas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const procesarDatos = (data: any[]) => {
    const getMonthName = (fecha: string) => {
      const date = new Date(fecha);
      return date.toLocaleString("es-MX", { month: "short" }).toUpperCase();
    };

    const sucursales: Record<string, Record<string, number>> = {};
    const globales: Record<string, number> = {};

    data.forEach((item) => {
      const mes = getMonthName(item.fecha_creacion);
      const suc = item.sucursal;
      const total = item.total - item.monto_descuento + item.monto_urgencia;

      if (!sucursales[suc]) sucursales[suc] = {};
      if (!sucursales[suc][mes]) sucursales[suc][mes] = 0;
      sucursales[suc][mes] += total;

      if (!globales[mes]) globales[mes] = 0;
      globales[mes] += total;
    });

    return { sucursales, globales };
  }

  const GenerarTotalesSucursal = (sucursales: any, globales: any) => {
    let csv = "";

    // 🔹 Obtener todos los meses presentes en los datos
    const meses = new Set<string>();
    Object.values(sucursales).forEach((data: any) => {
      Object.keys(data).forEach((mes) => meses.add(mes));
    });
    Object.keys(globales).forEach((mes) => meses.add(mes));
    const mesesArray = Array.from(meses);

    // 🔹 Encabezado horizontal
    csv += `SUCURSAL,${mesesArray.join(",")},TOTAL\n`;

    // 🔹 Filas de cada sucursal
    Object.keys(sucursales).forEach((suc) => {
      let fila = `${suc}`;
      let totalSucursal = 0;

      mesesArray.forEach((mes) => {
        const monto = sucursales[suc][mes] ?? 0;
        fila += `,$${monto.toFixed(2)}`;
        totalSucursal += monto;
      });

      fila += `,$${totalSucursal.toFixed(2)}\n`;
      csv += fila;
    });

    csv += "\nRESUMEN GLOBAL\n";

    // 🔹 Fila global (horizontal)
    let filaGlobal = `GLOBAL`;
    let granTotal = 0;
    mesesArray.forEach((mes) => {
      const monto = globales[mes] ?? 0;
      filaGlobal += `,$${monto.toFixed(2)}`;
      granTotal += monto;
    });
    filaGlobal += `,$${granTotal.toFixed(2)}\n`;

    csv += `SUCURSAL,${mesesArray.join(",")},TOTAL\n`;
    csv += filaGlobal;

    // Descargar sin librerías
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reporte_ventas.csv";
    a.click();
    URL.revokeObjectURL(url);
  };


  return (
    <div className='repvta'>
      <div className='repvta__container'>
        <div className='row' style={{ zoom: '80%' }}>
          <div className='col-4'>
            <Empresas_Sucursales modeUpdate={false} empresaDyn={empresa} sucursalDyn={sucursal} all={true}
              setEmpresaDyn={setEmpresa} setSucursalDyn={setSucursal}></Empresas_Sucursales>
          </div>
          <div className='col-2'>
            <label className='label__general'>Area</label>
            <select className='inputs__general' value={searcher.id_area} onChange={(e) => DynamicVariables.updateAnyVar(setSearcher, 'id_area', e.target.value)}  >
              {Array.isArray(areas) && areas.length > 0
                && areas.map((sol: any) => (
                  <option key={sol.id} value={sol.id}>{sol.nombre}</option>
                ))}
            </select>
          </div>
          <div className='col-3'>
            <label className='label__general'>Fechas Desde-Hasta</label>
            <div className='container_dates__requisition'>
              <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={date} onChange={handleDateChange} placeholder='seleciona las fechas' />
            </div>
          </div>
          <div className='col-3'>
            <Select dataSelects={users} nameSelect={'Vendedor'} instanceId='vendedor' />

          </div>

        </div>
        <div className='row'>

          <div className='col-12' style={{ zoom: '80%' }}>


            <Filtrado_Articulos_Basic set_article_local={setArticulos} materia_prima={99} />
            <div className='table__repvta '>
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
              {data.length > 0 && (
                <>
                  <button onClick={exportToCSV} className="btn__general-orange" title='Descargar en CSV'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sheet-icon lucide-sheet"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="3" x2="21" y1="9" y2="9" /><line x1="3" x2="21" y1="15" y2="15" /><line x1="9" x2="9" y1="9" y2="21" /><line x1="15" x2="15" y1="9" y2="21" /></svg>

                  </button>
                  <button style={{ marginLeft: '5px' }} onClick={() => GenerarTotalesSucursal(sucs, Glob)} className="btn__general-orange" title='Descargar en CSV'>
                    Reporte Gral.
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="repvtaData__container">
          <table className="repvtaData__table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Artículo</th>
                <th>Cant.</th>
                <th>Unidad</th>
                {/* <th>CantUni</th> */}
                <th>P/U</th>
                <th>Subtotal</th>
                <th>Desc</th>
                <th>Urg.</th>
                <th>Total</th>
                <th>OV</th>
                <th>Fact</th>
              </tr>
            </thead>
            <tbody>
              {data?.length > 0 ? (
                <>
                  {data.map((x, index) => {
                    let total = x.total - x.monto_descuento + x.monto_urgencia;
                    return (
                      <tr key={index}>
                        <td>{x.fecha_creacion}</td>
                        <td>{x.codigo} - {x.descripcion}</td>
                        <td>{x.cantidad}</td>
                        <td>{x.unidad_nombre}</td>
                        <td>${x.precio_unitario?.toFixed(2)}</td>
                        <td>${x.total?.toFixed(2) ?? 0}</td>
                        <td>${x.monto_descuento?.toFixed(2) ?? 0}</td>
                        <td>${x.monto_urgencia?.toFixed(2) ?? 0}</td>
                        <td>${total?.toFixed(2) ?? 0}</td>
                        <td>{x.folio_ov}</td>
                        <td>{x.folio_fact}</td>
                      </tr>
                    );
                  })}

                  {/* Fila de totales */}
                  <tr className="tabla__total-row">
                    <td colSpan={2}><strong>Totales</strong></td>
                    <td><strong>{t?.cantidad ?? 0}</strong></td>
                    <td></td>
                    <td></td>
                    <td><strong>${t?.total?.toFixed(2) ?? 0}</strong></td>
                    <td><strong>${t?.descuento?.toFixed(2) ?? 0}</strong></td>
                    <td><strong>${t?.urgencia?.toFixed(2) ?? 0}</strong></td>
                    <td><strong>${t?.total_final?.toFixed(2) ?? 0}</strong></td>
                    <td></td>
                    <td></td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan={13} className="repvtaData__no-data">
                    No hay datos disponibles
                  </td>
                </tr>
              )}
              {tArt?.length > 0 ? (
                tArt.map((art, i) => (
                  <tr key={i}>
                    <td></td>
                    <td>{art.codigo} - {art.descripcion}</td>
                    <td>{art.cantidad}</td>
                    <td>{art.unidad_nombre}</td>
                    <td></td>
                    <td>${art.total.toFixed(2)}</td>
                    <td>${art.descuento.toFixed(2)}</td>
                    <td>${art.urgencia.toFixed(2)}</td>
                    <td>${art.total_final.toFixed(2)}</td>
                  </tr>
                ))
              ) : ''}
            </tbody>
          </table>
        </div>


      </div>
    </div>
  )
}

export default Ventas
