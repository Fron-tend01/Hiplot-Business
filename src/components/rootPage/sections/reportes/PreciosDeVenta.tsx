import React, { useEffect, useState } from 'react'
import './styles/PreciosDeVenta.css'
import APIs from '../../../../services/services/APIs'
import DynamicVariables from '../../../../utils/DynamicVariables'
import Filtrado_Articulos_Basic from '../../Dynamic_Components/Filtrado_Articulos_Basic'
import useUserStore from '../../../../zustand/General'
import Swal from 'sweetalert2'
import { storeArticles } from '../../../../zustand/Articles'
const PreciosDeVenta: React.FC = () => {
  const [articulos, setArticulos] = useState<any[]>([])
  const [data, setData] = useState<any[]>([])
  const [usersGroups, setUsersGroups] = useState<any[]>([])
  const [usersGroupsAdded, setUsersGroupsAdded] = useState<any[]>([])
  const userState = useUserStore(state => state.user);
  const user_id = userState.id
  const [selectedUserGroup, setSelectedUserGroup] = useState<any>(null);
  const setModalLoading = storeArticles((state: any) => state.setModalLoading);

  useEffect(() => {
    fetchUser()
  }, [])
  const fetchUser = async () => {

    await APIs.getUserGroups(user_id).then(async (resultUsers: any) => {
      resultUsers.unshift({ id: 0, nombre: 'Todos' })
      setUsersGroups(resultUsers);
      setSelectedUserGroup(resultUsers[0].id);
    }).catch((error) => {
      console.error("Error obteniendo los grupos del usuario:", error);
    });
  }
  const getData = async () => {
    let filter_art = articulos.map(articulo => articulo.id);
    let gp = usersGroupsAdded.map(gp => gp.id);
    let data = {
      id_usuario: user_id,
      ids_articulos: filter_art,
      ids_grupos_us: gp
    }
    setModalLoading(true)
    await APIs.CreateAny(data, "reporte_precios_articulos")
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
  const exportTableToCSV = (data: any[]) => {
    // Encabezados tal cual en la tabla
    const headers = [
      "Codigo",
      "Articulo",
      "Precio",
      "PrecioFyV",
      "Lista",
      "Actualizacion",
      "Rango",
      "Razon"
    ];

    // Convierte el arreglo de objetos a filas CSV
    const rows = data.map((x) => {
      return [
        `${x.codigo}`,
        `${x.descripcion} `,
        Number(x.precios).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        Number(x.precios_fyv).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        x.grupo_us,
        x.hist_fecha ? new Date(x.hist_fecha).toLocaleString() : "-",
        x.rango || "-",
        x.hist_razon || "-"
      ].map((cell) => {
        // Escapar comillas y envolver en comillas dobles si contiene coma
        const cellStr = String(cell).replace(/"/g, '""');
        return cellStr.includes(",") ? `"${cellStr}"` : cellStr;
      }).join(",");
    });

    // Unir encabezados y filas
    const csvContent = [headers.join(","), ...rows].join("\n");

    // Crear y descargar el archivo
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "tabla_precios.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='preciosDeVenta'>
      <div className='preciosDeVenta__container'>

        <div className='row'>
          <div className='col-6'>

            <label className='label__general'>AGREGAR ARTICULOS PARA EL REPORTE</label>

            <Filtrado_Articulos_Basic set_article_local={setArticulos} materia_prima={99}/>
            <div className='table__preciosDeVenta '>
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
            <label className='label__general'>Grupos de Usuario (Listas de Precio)</label>
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
            <div className='table__preciosDeVenta '>
              <div>
                {usersGroupsAdded.length >= 1 ? (
                  <div>
                    <p className='text'>Grupos de Usuario en la Lista ({usersGroupsAdded.length})</p>
                  </div>
                ) : (
                  <p className='text'>No hay Grupos de Usuario</p>
                )}
              </div>
              <div className='table__head'>
                <div className='thead'>
                  <div className='th'>
                    <p className=''>Grupo de Usuario</p>
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
                <p className='text'>No hay grupos de usuario que cargar</p>
              )}
            </div>
          </div>
          <div className='col-12'>
            <div className='d-flex justify-content-center align-items-end'>
              <button className='btn__general-purple' onClick={getData}>Generar Reporte</button>
              <button
                onClick={() => exportTableToCSV (data)}
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
            </div>
          </div>
        </div>
        <table className="table__preciosDeVentaData" style={{ zoom: '80%' }}>
          <thead>
            <tr>
              <th>Codigo</th>
              <th>Articulo</th>
              <th>Precio</th>
              <th>PrecioFyV</th>
              <th>Lista</th>
              <th>Actualizacion</th>
              <th>Rango</th>
              <th>Razon</th>
            </tr>
          </thead>
          <tbody>
            {data.map((x: any, i: number) => (
              <tr key={i}>
                <td >
                  {x.codigo}
                </td>
                <td >
                  {x.descripcion}
                </td>
                <td>{x.precios}</td>
                <td>{x.precios_fyv}</td>
                <td>{x.grupo_us}</td>
                <td>{x.hist_fecha ? new Date(x.hist_fecha).toLocaleString() : "-"}</td>
                <td>{x.rango || "-"}</td>
                <td className="truncate" title={x.hist_razon || ""}>{x.hist_razon || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>



      </div>
    </div>
  )
}

export default PreciosDeVenta
