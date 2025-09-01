import React, { useEffect, useState } from 'react'
import './styles/ValorAlmacenes.css'
import APIs from '../../../../services/services/APIs'
import DynamicVariables from '../../../../utils/DynamicVariables'
import Filtrado_Articulos_Basic from '../../Dynamic_Components/Filtrado_Articulos_Basic'
import useUserStore from '../../../../zustand/General'
import Swal from 'sweetalert2'
import { storeArticles } from '../../../../zustand/Articles'
import Empresas_Sucursales from '../../Dynamic_Components/Empresas_Sucursales'
const ValorAlmacenes: React.FC = () => {
  const [articulos, setArticulos] = useState<any[]>([])
  const [data, setData] = useState<any[]>([])
  const [usersGroups, setUsersGroups] = useState<any[]>([])
  const [usersGroupsAdded, setUsersGroupsAdded] = useState<any[]>([])
  const userState = useUserStore(state => state.user);
  const user_id = userState.id
  const [selectedUserGroup, setSelectedUserGroup] = useState<any>(null);
  const setModalLoading = storeArticles((state: any) => state.setModalLoading);
  const [empresa, setEmpresa] = useState<any>({})
  const [sucursal, setSucursal] = useState<any>({})
  useEffect(() => {
    fetchUser()
  }, [])
  const fetchUser = async () => {

    let response: any = await APIs.getStore(user_id)
    response.unshift({ id: 0, nombre: 'Todos' })
    setUsersGroups(response);
    setSelectedUserGroup(response[0].id);

  }
  const getData = async () => {
    let filter_art = articulos.map(articulo => articulo.id);
    let gp = usersGroupsAdded.map(gp => gp.id);
    let data = {
      id_usuario: user_id,
      ids_articulos: filter_art,
      ids_almacenes: gp
    }
    setModalLoading(true)
    await APIs.CreateAny(data, "reporte_valor_almacen")
      .then(async (response: any) => {
        setModalLoading(false)
        setData(response)
      }).finally(() => {
        setModalLoading(false)
      })
  }
  console.log('data', data);
  const formatNumber = (num?: number) => {
    if (typeof num !== "number") return "";
    const str = num.toString();
    const [, decimals] = str.split(".");
    if (!decimals) return str; // entero
    if (decimals.length <= 3) return str; // 1, 2 o 3 decimales
    return num.toFixed(4); // más de 4 decimales
  };
  const addGp = () => {
    const encontrado = usersGroups.find((x: any) => x.id == selectedUserGroup);
    if (encontrado && !usersGroupsAdded.some(p => p.id === encontrado.id)) {
      if (encontrado.id != 0) {
        setUsersGroupsAdded(prev => [...prev, encontrado]);

      }
    } else {
      Swal.fire('Notificación', 'Grupo de Usuario no encontrado o repetido', 'warning');
    }
  };

  // Agrupamos los datos igual que en tu tabla para totales por código
  const grupos = data.reduce((acc: any, item: any) => {
    if (!acc[item.codigo]) {
      acc[item.codigo] = { precio_total: 0, cantidad: 0, count: 0 };
    }
    acc[item.codigo].precio_total += Number(item.precio_total || 0);
    acc[item.codigo].cantidad += Number(item.cantidad || 0);
    acc[item.codigo].count += 1;
    return acc;
  }, {});

  // Función para generar CSV
  const exportTableToCSV = (data: any[]) => {
    let csv = "Codigo,Descripcion,PrecioTotalDeCompra,CantidadDisponible,Unidad,OC,FechaOC,FechaEntrada\n";

    let singleRowIndex = 0;
    for (let i = 0; i < data.length; i++) {
      const x = data[i];
      const isLastOfCode = i === data.length - 1 || data[i + 1].codigo !== x.codigo;
      const isRepeated = grupos[x.codigo].count > 1;

      // Fila normal
      csv += `"${x.codigo}","${x.descripcion}",${Number(x.precio_total).toFixed(
        2
      )},${Number(x.cantidad).toFixed(2)},"${x.unidad_nombre}","${x.folio_oc}","${x.fecha_oc}","${x.fecha_entrada}"\n`;

      // Fila total para códigos repetidos
      if (isLastOfCode && isRepeated) {
        csv += `"Totales ${x.codigo}","","${grupos[x.codigo].precio_total.toFixed(
          2
        )}","${grupos[x.codigo].cantidad.toFixed(2)}","",""\n`;
      }

      if (!isRepeated) {
        singleRowIndex++;
      }
    }

    // Total general
    const totalPrecio = data.reduce((acc, x) => acc + Number(x.precio_total || 0), 0);
    const totalCantidad = data.reduce((acc, x) => acc + Number(x.cantidad || 0), 0);

    csv += `"Totales","","${totalPrecio.toFixed(2)}","${totalCantidad.toFixed(2)}","",""\n`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "tabla_exportada.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  // Función para exportar PDF muy simple sin librerías
  // Aquí generamos un PDF básico con texto (sin formato)
  const exportPDF = () => {
    const fechaActual = new Date().toLocaleString();

    const encabezados = [
      "Codigo",
      "Descripcion",
      "Precio Total",
      "Cantidad",
      "Unidad",
      "OC",
      "Fecha OC",
      "Fecha Entrada",
    ];

    // Agrupamos para obtener sumas y conteo por código
    const grupos = data.reduce((acc: any, item: any) => {
      if (!acc[item.codigo]) {
        acc[item.codigo] = { precio_total: 0, cantidad: 0, count: 0 };
      }
      acc[item.codigo].precio_total += Number(item.precio_total || 0);
      acc[item.codigo].cantidad += Number(item.cantidad || 0);
      acc[item.codigo].count += 1;
      return acc;
    }, {});

    let html = `
    <html>
    <head>
      <title>Inventario Almacén</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
        body {
          font-family: 'Roboto', sans-serif;
          font-size: 12px;
          margin: 10px 20px;
        }
        table {
          font-size: 10px;
          border-collapse: collapse;
          width: 100%;
        }
        th, td {
          border: 1px solid #000;
          padding: 5px;
          text-align: left;
          vertical-align: top;
        }
        th {
          background-color: #00539C;
          color: white;
          font-weight: bold;
        }
        tr.total-row {
          background-color: #e8f0fe;
          font-weight: bold;
        }
        td.descripcion {
          max-width: 400px;
          word-break: break-word;
        }
      </style>
    </head>
    <body>
      <h2>Costos de Almacén</h2>
      <p><strong>Fecha de impresión:</strong> ${fechaActual}</p>
      <table border="1" cellspacing="0" cellpadding="5">
        <thead>
          <tr>
  `;

    encabezados.forEach(enc => {
      html += `<th>${enc}</th>`;
    });

    html += `</tr></thead><tbody>`;

    // Para alternar colores en filas individuales (no repetidas)
    let singleRowIndex = 0;

    for (let i = 0; i < data.length; i++) {
      const x = data[i];
      const isLastOfCode = i === data.length - 1 || data[i + 1].codigo !== x.codigo;
      const isRepeated = grupos[x.codigo].count > 1;

      const bgColor = isRepeated ? "#e8f0fe" : (singleRowIndex % 2 === 0 ? "#ffffff" : "#f9f9f9");

      html += `<tr style="background-color: ${bgColor}">`;
      html += `<td>${x.codigo || ''}</td>`;
      html += `<td class="descripcion">${x.descripcion || ''}</td>`;
      html += `<td>${Number(x.precio_total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>`;
      html += `<td>${Number(x.cantidad || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>`;
      html += `<td>${x.unidad_nombre || ''}</td>`;
      html += `<td>${x.folio_oc || ''}</td>`;
      html += `<td>${x.fecha_oc || ''}</td>`;
      html += `<td>${x.fecha_entrada || ''}</td>`;
      html += `</tr>`;

      if (isLastOfCode && isRepeated) {
        // fila de totales por código
        html += `
        <tr class="total-row">
          <td colspan="2">Totales ${x.codigo}</td>
          <td>${grupos[x.codigo].precio_total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td>${grupos[x.codigo].cantidad.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td colspan="2"></td>
        </tr>
      `;
      }

      if (!isRepeated) {
        singleRowIndex++;
      }
    }

    // Totales generales
    const totalPrecio = data.reduce((acc, x) => acc + Number(x.precio_total || 0), 0);
    const totalCantidad = data.reduce((acc, x) => acc + Number(x.cantidad || 0), 0);

    html += `
    <tr class="total-row">
      <td colspan="2">Totales</td>
      <td>${totalPrecio.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td>${totalCantidad.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td colspan="2"></td>
    </tr>
  `;

    html += `
        </tbody>
      </table>
    </body>
    </html>
  `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          // printWindow.close(); // opcional: cerrar ventana automáticamente
        }, 300);
      };
    }
  };


  return (
    <div className='ValorAlmacenes'>
      <div className='ValorAlmacenes__container'>

        <div className='row'>
          {/* <div className='col-12'>
            <Empresas_Sucursales modeUpdate={false} empresaDyn={empresa} sucursalDyn={sucursal} all={true}
              setEmpresaDyn={setEmpresa} setSucursalDyn={setSucursal}></Empresas_Sucursales>
          </div> */}
          <div className='col-6'>

            <label className='label__general'>AGREGAR ARTICULOS PARA EL REPORTE</label>

            <Filtrado_Articulos_Basic set_article_local={setArticulos} />
            <div className='table__ValorAlmacenes '>
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
          <div className='col-6 text-center shadow-custom'>
            <label className='label__general'>Almacenes</label>
            <select
              className="select_original_general"
              value={selectedUserGroup}
              onChange={(e) => {
                setSelectedUserGroup(parseInt(e.target.value || '0'));
              }}
            >
              {Array.isArray(usersGroups) && usersGroups.length > 0
                && usersGroups.map((sol: any) => (
                  <option key={sol.id} value={sol.id}>{sol.nombre}</option>
                ))}
            </select>
            <button className='btn__general-purple' onClick={addGp}>Add+</button>
            <div className='table__ValorAlmacenes '>
              <div>
                {usersGroupsAdded.length >= 1 ? (
                  <div>
                    <p className='text'>Almacenes en la Lista ({usersGroupsAdded.length})</p>
                  </div>
                ) : (
                  <p className='text'>No hay Almacenes</p>
                )}
              </div>
              <div className='table__head'>
                <div className='thead'>
                  <div className='th'>
                    <p className=''>Almacen</p>
                  </div>
                </div>
              </div>
              {Array.isArray(usersGroupsAdded) && usersGroupsAdded.length > 0 ? (
                <div className='table__body'>
                  {usersGroupsAdded.map((dat: any, index: number) => (

                    <div className='tbody__container' key={index}>
                      <div className='tbody'>
                        <div className='td'>
                          {dat.nombre}
                        </div>

                        <div className='td'>
                          <button className='btn__delete_users' type="button" onClick={() => {
                            DynamicVariables.removeObjectInArray(setUsersGroupsAdded, index);
                          }}>Eliminar</button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <p className='text'>No hay Almacenes que cargar</p>
              )}
            </div>
          </div>
          <div className="col-12">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: "10px", // espacio entre los dos grupos
              }}
            >
              {/* Contenedor vacío para que el botón central se posicione en el centro */}
              <div style={{ flex: 1 }}></div>

              {/* Botón Generar Reporte centrado */}
              <div style={{ flex: 0, display: "flex", justifyContent: "center" }}>
                <button className='btn__general-purple'
                  onClick={getData}
                >
                  Generar Reporte
                </button>
              </div>

              {/* Botones CSV y Preview alineados a la derecha */}
              <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  onClick={() => exportTableToCSV(data)}
                  style={{
                    padding: "5px 10px",
                    background: "#a76228",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "5px",
                  }}
                >
                  📥 Descargar CSV
                </button>
                <button
                  onClick={() => exportPDF()}
                  style={{
                    padding: "5px 10px",
                    background: "#28a745",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "5px",
                  }}
                >
                  📤 Preview
                </button>
              </div>
            </div>
          </div>

        </div>
        <table className="table__ValorAlmacenesData" style={{ zoom: '80%' }}>
          <thead>
            <tr>
              <th>Codigo</th>
              <th>Descripcion</th>
              <th>TotalCompra</th>
              <th>TotalCompraC/IVA</th>
              <th>CantidadDisponible</th>
              <th>Unidad</th>
              <th>OC</th>
              <th>FechaOc</th>
              <th>FechaEntrada</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              // Agrupar datos por código
              const grupos = data.reduce((acc: any, item: any) => {
                if (!acc[item.codigo]) {
                  acc[item.codigo] = { precio_total: 0,precio_total_c_iva:0, cantidad: 0, count: 0 };
                }
                acc[item.codigo].precio_total += Number(item.precio_total || 0);
                acc[item.codigo].precio_total_c_iva += Number((item.precio_total_c_iva || 0));
                acc[item.codigo].cantidad += Number(item.cantidad || 0);
                acc[item.codigo].count += 1;
                return acc;
              }, {});

              // Paso 1: obtener orden de aparición de códigos únicos
              const codigosUnicos: string[] = [];
              data.forEach((item) => {
                if (!codigosUnicos.includes(item.codigo)) {
                  codigosUnicos.push(item.codigo);
                }
              });

              // Paso 2: asignar índice alternado a cada código
              const coloresPorCodigo: Record<string, number> = {};
              codigosUnicos.forEach((codigo, idx) => {
                coloresPorCodigo[codigo] = idx % 2; // 0 o 1 alternado
              });

              // Paso 3: renderizar filas
              return data.map((x: any, i: number) => {
                const isLastOfCode =
                  i === data.length - 1 || data[i + 1].codigo !== x.codigo;

                const isRepeated = grupos[x.codigo].count > 1;

                // Color de fondo: si grupo repetido, color fijo; si no, alternar por código
                const backgroundColorNormal = isRepeated
                  ? "#e8f0fe"
                  : coloresPorCodigo[x.codigo] === 0
                    ? "#ffffff"
                    : "#f9f9f9";

                return (
                  <React.Fragment key={i}>
                    <tr style={{ backgroundColor: backgroundColorNormal }}>
                      <td>{x.codigo}</td>
                      <td>{x.descripcion}</td>
                      <td>$
                        {Number(x.precio_total).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                       <td>$
                        {Number(x.precio_total_c_iva).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td>
                        {Number(x.cantidad).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td>{x.unidad_nombre}</td>
                      <td>{x.folio_oc}</td>
                      <td>{x.fecha_oc}</td>
                      <td>{x.fecha_entrada}</td>
                    </tr>

                    {isLastOfCode && isRepeated && (
                      <tr style={{ fontWeight: "bold", backgroundColor: "#e8f0fe" }}>
                        <td colSpan={2}>Totales {x.codigo}</td>
                        <td>
                          $
                          {grupos[x.codigo].precio_total.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td>
                          $
                          {grupos[x.codigo].precio_total_c_iva.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td>
                          {grupos[x.codigo].cantidad.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td colSpan={4}></td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              });
            })()}

            {/* Fila total general al final */}
            <tr style={{ fontWeight: "bold", backgroundColor: "#f2f2f2" }}>
              <td colSpan={2}>Totales</td>
              <td>
                $
                {data
                  .reduce((acc, x) => acc + Number(x.precio_total || 0), 0)
                  .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td>
                $
                {data
                  .reduce((acc, x) => acc + Number(x.precio_total_c_iva || 0), 0)
                  .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td>
                {data
                  .reduce((acc, x) => acc + Number(x.cantidad || 0), 0)
                  .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td colSpan={4}></td>
            </tr>
          </tbody>
        </table>



      </div>
    </div>
  )
}

export default ValorAlmacenes
