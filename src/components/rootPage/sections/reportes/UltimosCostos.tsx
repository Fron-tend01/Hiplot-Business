import React, { useEffect, useState } from 'react'
import './styles/UltimosCostos.css'
import APIs from '../../../../services/services/APIs'
import DynamicVariables from '../../../../utils/DynamicVariables'
import Filtrado_Articulos_Basic from '../../Dynamic_Components/Filtrado_Articulos_Basic'
import useUserStore from '../../../../zustand/General'
import Empresas_Sucursales from '../../Dynamic_Components/Empresas_Sucursales'
import Flatpickr from "react-flatpickr";
import { Spanish } from 'flatpickr/dist/l10n/es.js'; // Importa la localización en español
import { storeSuppliers } from '../../../../zustand/Suppliers'
import Swal from 'sweetalert2'
import { storeArticles } from '../../../../zustand/Articles'
const UltimosCostos: React.FC = () => {
  const [articulos, setArticulos] = useState<any[]>([])
  const [data, setData] = useState<any[]>([])
  const userState = useUserStore(state => state.user);
  const user_id = userState.id
  const setModalLoading = storeArticles((state: any) => state.setModalLoading);

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
    ids_articulos: [],
    ids_proveedores: []
  })
  useEffect(() => {
    getDataProveedores()
  }, [])
  const getData = async () => {
    let filter_art = articulos.map(articulo => articulo.id);
    searcher.id_sucursal = sucursal.id
    searcher.ids_articulos = filter_art
    searcher.desde = date[0]
    searcher.hasta = date[1]
    searcher.ids_proveedores = proveedoresAdded.map(item => item.id);
    setModalLoading(true)
    await APIs.CreateAny(searcher, "reporte_ultimos_costos")
      .then(async (response: any) => {
        setModalLoading(false)
        setData(response)
      }).finally(() => {
        setModalLoading(false)

      })
  }
  const [empresa, setEmpresa] = useState<any>({})
  const [sucursal, setSucursal] = useState<any>({})
  const { getSuppliers }: any = storeSuppliers()
  const [dataSuppliers, setDataSuppliers] = useState<any>([])
  const [filteredSuppliers, setFilteredSuppliers] = useState<any[]>([]);
  const [proveedoresAdded, setProveedoresAdded] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedIdProveedor, setSelectedIdProveedor] = useState<number | null>(null);

  const getDataProveedores = async () => {
    const data = {
      nombre: '',
      is_flete: false,
      id_usuario: user_id
    };
    const result = await getSuppliers(data); // Asegúrate de importar esto
    setDataSuppliers(result);
    setFilteredSuppliers(result);
  };
  useEffect(() => {
    const lowerSearch = search?.toLowerCase();
    setFilteredSuppliers(
      dataSuppliers.filter(sup =>
        sup?.razon_social?.toLowerCase().includes(lowerSearch)
      )
    );
  }, [search, dataSuppliers]);
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value, 10);
    setSelectedIdProveedor(id);
  };
  const addProvider = () => {
    const encontrado = dataSuppliers.find((x: any) => x.id == selectedIdProveedor);

    if (encontrado && !proveedoresAdded.some(p => p.id === encontrado.id)) {
      setProveedoresAdded(prev => [...prev, encontrado]);
    } else {
      Swal.fire('Notificación', 'Proveedor no encontrado o repetido', 'warning');
    }
  };
  const descargarCSV = (data: any[]) => {
    const encabezados = [
      "Fecha",
      "Artículo",
      "Cant.",
      "P/U",
      "Desc.",
      "Subtotal",
      "IVA",
      "Total",
      "Proveedor",
      "Sucursal",
      "Empresa",
      "OC",
    ];

    const clean = (text: any) =>
      String(text ?? "")
        .replace(/\r?\n|\r/g, " ")
        .trim();

    const formatMoney = (n: number) => `$${n.toFixed(2)}`;

    const escapeCSV = (text: string) => {
      const cleanText = clean(text);
      if (cleanText.includes('"') || cleanText.includes(",") || cleanText.includes("\n")) {
        return `"${cleanText.replace(/"/g, '""')}"`;
      }
      return cleanText;
    };

    let totalCantidad = 0;
    let totalDescuento = 0;
    let totalSubtotal = 0;
    let totalIva = 0;
    let totalTotal = 0;

    const filas = data.map((x) => {
      const subtotal = x.precio_unitario * x.cantidad - x.descuento;
      const iva = x.iva_on ? subtotal * 0.16 : 0;
      const total = subtotal + iva;

      totalCantidad += x.cantidad;
      totalDescuento += x.descuento;
      totalSubtotal += subtotal;
      totalIva += iva;
      totalTotal += total;

      return [
        escapeCSV(x.fecha_creacion),
        escapeCSV(`${x.codigo} - ${x.descripcion}`),
        escapeCSV(`${x.cantidad} - ${x.unidad_nombre}`),
        formatMoney(x.precio_unitario ?? 0),
        formatMoney(x.descuento ?? 0),
        formatMoney(subtotal),
        formatMoney(iva),
        formatMoney(total),
        escapeCSV(x.proveedor),
        escapeCSV(x.sucursal),
        escapeCSV(x.empresa),
        escapeCSV(x.folio_oc),
      ].join(",");
    });

    const filaTotales = [
      "TOTALES", // Fecha
      "", // Artículo
      totalCantidad.toString(), // Cant.
      "", // P/U
      formatMoney(totalDescuento), // Desc.
      formatMoney(totalSubtotal), // Subtotal
      formatMoney(totalIva), // IVA
      formatMoney(totalTotal), // Total
      "", // Proveedor
      "", // Sucursal
      "", // Empresa
      "", // OC
      "", // Entradas
    ].join(",");

    const BOM = "\uFEFF";
    const csvContenido = BOM + [encabezados.join(","), ...filas, filaTotales].join("\n");
    const blob = new Blob([csvContenido], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "ultimos_costos_con_totales.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  // Dentro del componente:
  const calcularTotales = (data: any[]) => {
    return data.reduce(
      (acc, x) => {
        const subtotal = x.precio_unitario * x.cantidad - x.descuento;
        const iva = x.iva_on ? subtotal * 0.16 : 0;
        const total = subtotal + iva;

        acc.cantidad += x.cantidad;
        acc.descuento += x.descuento;
        acc.subtotal += subtotal;
        acc.iva += iva;
        acc.total += total;
        return acc;
      },
      { cantidad: 0, descuento: 0, subtotal: 0, iva: 0, total: 0 }
    );
  };

  const formatos = {
    dinero: (n: number) => `$${n.toFixed(2)}`,
  };

  const totales = data && data.length > 0 ? calcularTotales(data) : null;

  return (
    <>
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
            <div className='col-6 card'>

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
            <div className='col-6 mt-5 card'>
              <b>Buscar Proveedores</b>
              <div className='row'>
                <div className='col-12'>

                  <input
                    type="text"
                    placeholder="Buscar proveedor..."
                    className="inputs__general"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="col-4 d-flex align-items-center">
                  <label>Proveedor Seleccionado:</label>
                </div>
                <div className='col-8'>
                  <select
                    className="inputs__general"
                    value={selectedIdProveedor || '0'}
                    onChange={handleChange}
                  >
                    <option value="0">Todos</option>
                    {filteredSuppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.razon_social}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='col-12 text-center'>
                  <button className='btn__general-purple' onClick={e => addProvider()}>
                    Add+
                  </button>
                </div>
                <div className='col-12'>
                  <div className='table__ultimosCostos '>
                    <div className='table__head'>
                      <div className='thead'>
                        <div className='th'>
                          <p className=''>Proveedor</p>
                        </div>
                        <div className='th'>
                          <p className=''>Nombre Comercial</p>
                        </div>
                      </div>
                    </div>
                    {Array.isArray(proveedoresAdded) && proveedoresAdded.length > 0 ? (
                      <div className='table__body'>
                        {proveedoresAdded.map((dat: any, index: number) => (

                          <div className='tbody__container' key={index}>
                            <div className='tbody'>
                              <div className='td'>
                                {dat.razon_social}
                              </div>
                              <div className='td'>
                                {dat.nombre_comercial}
                              </div>

                              <div className='td'>
                                <button className='btn__delete_users' type="button" onClick={() => {
                                  DynamicVariables.removeObjectInArray(setProveedoresAdded, index);
                                }}>Eliminar</button>
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className='text'>No hay Proveedores que cargar</p>
                    )}
                  </div>
                </div>
              </div>


            </div>
            <div className='col-12'>
              <div className='d-flex justify-content-center align-items-end'>
                <button className='btn__general-purple' onClick={getData}>GENERAR REPORTE</button>
                <button className='btn__general-orange' onClick={() => descargarCSV(data)} title='Descargar Reporte en CSV'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sheet-icon lucide-sheet"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="3" x2="21" y1="9" y2="9" /><line x1="3" x2="21" y1="15" y2="15" /><line x1="9" x2="9" y1="9" y2="21" /><line x1="15" x2="15" y1="9" y2="21" /></svg>
                </button>
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
                </tr>
              </thead>
              <tbody>
                {data?.length > 0 ? (
                  data.map((x, index) => {
                    const subtotal = x.precio_unitario * x.cantidad - x.descuento;
                    const iva = x.iva_on ? subtotal * 0.16 : 0;
                    const total = subtotal + iva;

                    return (
                      <tr key={index}>
                        <td>{x.fecha_creacion}</td>
                        <td>{x.codigo} - {x.descripcion}</td>
                        <td>{x.cantidad} - {x.unidad_nombre}</td>
                        <td>{formatos.dinero(x.precio_unitario)}</td>
                        <td>{formatos.dinero(x.descuento)}</td>
                        <td>{formatos.dinero(subtotal)}</td>
                        <td>{formatos.dinero(iva)}</td>
                        <td>{formatos.dinero(total)}</td>
                        <td>{x.proveedor}</td>
                        <td>{x.sucursal}</td>
                        <td>{x.empresa}</td>
                        <td>{x.folio_oc}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={12} className="ultimosCostosData__no-data">
                      No hay datos disponibles
                    </td>
                  </tr>
                )}
              </tbody>
              {totales && (
                <tfoot>
                  <tr style={{ fontWeight: "bold" }}>
                    <td colSpan={2}>TOTALES</td>
                    <td>{totales.cantidad}</td>
                    <td></td>
                    <td>{formatos.dinero(totales.descuento)}</td>
                    <td>{formatos.dinero(totales.subtotal)}</td>
                    <td>{formatos.dinero(totales.iva)}</td>
                    <td>{formatos.dinero(totales.total)}</td>
                    <td colSpan={4}></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>


        </div>
      </div>
    </>
  )
}

export default UltimosCostos
