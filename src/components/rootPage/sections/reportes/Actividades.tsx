import React, { useEffect, useState } from 'react'
import './styles/Actividades.css'
import APIs from '../../../../services/services/APIs'
import DynamicVariables from '../../../../utils/DynamicVariables'
import Filtrado_Articulos_Basic from '../../Dynamic_Components/Filtrado_Articulos_Basic'
import useUserStore from '../../../../zustand/General'
import Empresas_Sucursales from '../../Dynamic_Components/Empresas_Sucursales'
import { usersRequests } from '../../../../fuctions/Users'
import { useSelectStore } from '../../../../zustand/Select'
import Flatpickr from "react-flatpickr";
import { Spanish } from 'flatpickr/dist/l10n/es.js'; // Importa la localización en español
import Select from '../../Dynamic_Components/Select'
import Swal from 'sweetalert2'

const Actividades: React.FC = () => {
  const [articulos, setArticulos] = useState<any[]>([])
  const [data, setData] = useState<any[]>([])
  const userState = useUserStore(state => state.user);
  const user_id = userState.id
  const [empresa, setEmpresa] = useState<any>({})
  const [sucursal, setSucursal] = useState<any>({})
  const [descripcion, setDescripcion] = useState<string>('')
  const [prioridad, setPrioridad] = useState<number>(0)
  const [idtoModify, setIdToModify] = useState<number>(0)
  const [usuarioSelected, setUsuarioSelected] = useState<any>(0)
  const [users, setUsers] = useState<any>()
  const [usuarios, setUsuarios] = useState<any>()
  const { getUsers }: any = usersRequests()
  const selectedIds: any = useSelectStore((state) => state.selectedIds);
  const setSelectData: any = useSelectStore((state) => state.setSelectedId);
  const [descripcionS, setDescripcionS] = useState<string>('')
  const [empresaH, setEmpresaH] = useState<any>({})
  const [sucursalH, setSucursalH] = useState<any>({})
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
    setUsuarios([...resultUsers]);
    setUsuarioSelected(user_id)
    resultUsers.unshift({ 'id': 0, 'nombre': 'Todos' })
    setUsers({
      selectName: 'Vendedores',
      options: 'nombre',
      dataSelect: resultUsers
    })
    setSelectData('vendedor', resultUsers[0])
  }
  const getData = async () => {
    let data = {
      id_usuario: selectedIds?.vendedor?.id || 0,
      id_usuario_consulta: user_id,
      id_sucursal: sucursal?.id || 0,
      id_sucursal_doc: sucursalH?.id || 0,
      status: activeTabNumber,
      desde: date[0],
      hasta: date[1],
      tipo: tipoSearcher,
      prioridad: prioridadSearcher,
      page: page,
      descripcion: descripcionS,
    }
    await APIs.CreateAny(data, "get_actividades")
      .then(async (response: any) => {
        setData(response)
      })
  }
  const formatNumber = (num?: number) => {
    if (typeof num !== "number") return "";
    const str = num.toString();
    const [, decimals] = str.split(".");
    if (!decimals) return str; // entero
    if (decimals.length <= 3) return str; // 1, 2 o 3 decimales
    return num.toFixed(4); // más de 4 decimales
  };

  const [isOpen, setIsOpen] = useState(false);
  const [modoUpdate, setModoUpdate] = useState(false);
  const [activeTab, setActiveTab] = useState("tab1");
  const [activeTabNumber, setActiveTabNumber] = useState(0);
  // Función para cambiar la pestaña
  const handleTabClick = (tab, nu) => {
    setActiveTab(tab);
    setActiveTabNumber(nu);
  };
  const abrirModal = (mu, data) => {
    setIsOpen(!isOpen);
    setModoUpdate(mu);
    if (!mu) {
      setDescripcion('')
      setPrioridad(0)
      setUsuarioSelected(user_id)
    } else {
      // debugger
      setDescripcion(data.descripcion)
      setPrioridad(data.prioridad)
      setUsuarioSelected(data.id_usuario_asignado)
      setIdToModify(data.id)
    }
  };
  const save = async () => {
    if (descripcion.trim() === '') {
      Swal.fire('Error', 'La descripción de la actividad es obligatoria', 'error');
      return;
    }
    if (modoUpdate) {
      let data = {
        descripcion: descripcion,
        prioridad: prioridad,
        id_usuario_asignado: usuarioSelected,
      }
      await APIs.CreateAnyPut(data, "update_actividad/" + idtoModify)
        .then(async (resp: any) => {
          if (!resp.error) {
            Swal.fire('Notificación', resp.mensaje, 'success');
            abrirModal(false, []);
            setDescripcion('')
            getData()
          } else {
            Swal.fire('Notificación', resp.mensaje, 'info');
            return
          }

        })
    } else {
      let data = {
        descripcion: descripcion,
        prioridad: prioridad,
        id_usuario_crea: user_id,
        id_usuario_asignado: usuarioSelected,
      }
      await APIs.CreateAny(data, "create_actividad")
        .then(async (resp: any) => {
          if (!resp.error) {
            Swal.fire('Notificación', resp.mensaje, 'success');
            abrirModal(false, []);
            setDescripcion('')
            getData()
          } else {
            Swal.fire('Notificación', resp.mensaje, 'info');
            return
          }

        })
    }

  }
  const [page, setPage] = useState<number>(1)
  const [prioridadSearcher, setPrioridadSearcher] = useState<number>(2)
  const [tipoSearcher, setTipoSearcher] = useState<number>(99)

  useEffect(() => {
    getData();
  }, [page]);

  const changeStatus = async (actividad_id, status, value, index) => {
    Swal.fire({
      title: "Desea cambiar el status de la actividad?",
      text: "Esta acción no se puede deshacer",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (status == 2 && value) {
            if (value) {
              DynamicVariables.updateAnyVarByIndex(setData, index, 'status', 2)

            } else {
              DynamicVariables.updateAnyVarByIndex(setData, index, 'status', 0)

            }
          }
          await APIs.CreateAnyPut([], "update_actividad_status/" + actividad_id + '/' + status)
            .then(async (_: any) => {
              Swal.fire('Notificación', 'Orden enviada a sucursal correctamente', 'success');
              getData()
            })

        } catch (error) {
          Swal.fire('Notificacion', 'Ocurrió un error al cambiar de area, consulta con soporte', 'info')

        }
      }
    });
  }
  const exportToCSV = () => {
    if (!data || data.length === 0) return;

    // Definir encabezados
    const headers = ["ID", "Descripción", "Asignado", "Sucursal", "Fecha", "Hora", "Tipo", "Status", "Prioridad"];

    // Convertir data a filas
    const rows = data.map((dat: any) => [
      dat.id,
      dat.descripcion,
      dat.asignado,
      dat.sucursal,
      new Date(dat.fecha).toLocaleDateString("es-MX"),
      new Date(dat.fecha).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
      dat.tipo === 0 ? "Manual" : "Automática",
      dat.status === 0 ? "Activo" : dat.status === 1 ? "Cancelado" : "Terminado",
      dat.prioridad === 0 ? "Baja" : dat.prioridad === 1 ? "Media" : "Alta"
    ]);

    // Construir CSV
    let csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    // Crear archivo y disparar descarga
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "actividades.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const exportToPDF = () => {
    if (!data || data.length === 0) return;

    let html = `
    <html>
      <head>
        <title>Actividades</title>
        <style>
          table { width: 100%; border-collapse: collapse; font-family: Arial; }
          th, td { border: 1px solid #ccc; padding: 6px; font-size: 12px; }
          th { background: #f0f0f0; }
        </style>
      </head>
      <body>
        <h2>Listado de Actividades</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Descripción</th><th>Asignado</th><th>Sucursal</th>
              <th>Fecha</th><th>Hora</th><th>Tipo</th><th>Status</th><th>Prioridad</th>
            </tr>
          </thead>
          <tbody>
            ${data.map((dat: any) => `
              <tr>
                <td>${dat.id}</td>
                <td>${dat.descripcion}</td>
                <td>${dat.asignado}</td>
                <td>${dat.sucursal}</td>
                <td>${new Date(dat.fecha).toLocaleDateString("es-MX")}</td>
                <td>${new Date(dat.fecha).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}</td>
                <td>${dat.tipo === 0 ? "Manual" : "Automática"}</td>
                <td>${dat.status === 0 ? "Activo" : dat.status === 1 ? "Cancelado" : "Terminado"}</td>
                <td>${dat.prioridad === 0 ? "Baja" : dat.prioridad === 1 ? "Media" : "Alta"}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;

    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.close();
      newWindow.print(); // Aquí el navegador ofrece guardar en PDF
    }
  };
  return (
    <div className='actividades'>
      <div className='actividades__container'>

        <div className='row' style={{ zoom: '80%' }}>
          <div className='col-4'>
            <Empresas_Sucursales modeUpdate={false} empresaDyn={empresa} sucursalDyn={sucursal} all={true}
              setEmpresaDyn={setEmpresa} setSucursalDyn={setSucursal}></Empresas_Sucursales>
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
          <div className='col-2'>
            <label className='label__general'>Tipo</label>
            <select className='inputs__general' value={tipoSearcher} onChange={(e) => setTipoSearcher(parseInt(e.target.value))}  >
              <option value="99">Todas</option>
              <option value="1">Automaticas</option>
              <option value="0">Manuales</option>
            </select>
          </div>
        </div>

        <div className="activities-container">

          <div className="activities-menu-container">

            <div className="activities-menu-tabs">
              <div className='row'>

                <div className='row col-9 text-left'>

                  <button
                    className={`activities-menu-tab col-4 ${activeTab === "tab1" ? "activities-menu-active" : ""}`}
                    onClick={() => handleTabClick("tab1", 0)}
                  >
                    🟢 Activas
                  </button>
                  <button
                    className={`activities-menu-tab-cancel col-4 ${activeTab === "tab2" ? "activities-menu-active" : ""}`}
                    onClick={() => handleTabClick("tab2", 1)}
                  >
                    🔴 Canceladas
                  </button>
                  <button
                    className={`activities-menu-tab-complet col-4 ${activeTab === "tab3" ? "activities-menu-active" : ""}`}
                    onClick={() => handleTabClick("tab3", 2)}
                  >
                    ✅ Completadas
                  </button>
                </div>
                <div className='col-3 text-center'>
                  <label>Prioridad de Actividad</label><br />
                  <label className='m-2' style={{ color: 'blue' }}>
                    <input
                      type="radio"
                      name="prioridad2"
                      value="0"
                      checked={prioridadSearcher === 0}
                      onChange={(e) => setPrioridadSearcher(parseInt(e.target.value))}
                    />
                    Baja
                  </label>
                  <label className='m-2' style={{ color: 'gray' }}>
                    <input
                      type="radio"
                      name="prioridad2"
                      value="1"
                      checked={prioridadSearcher === 1}
                      onChange={(e) => setPrioridadSearcher(parseInt(e.target.value))}
                    />
                    Media
                  </label>
                  <label className='m-2' style={{ color: 'red' }}>
                    <input
                      type="radio"
                      name="prioridad2"
                      value="2"
                      checked={prioridadSearcher === 2}
                      onChange={(e) => setPrioridadSearcher(parseInt(e.target.value))}
                    />
                    Alta
                  </label>
                </div>
              </div>
            </div>
            <div className="">
              <div className="collapse-container">
                <input type="checkbox" id={'search_manual_xOp'} className="collapse-toggle" />
                <label htmlFor={'search_manual_xOp'} className="collapse-label">Filtrado Especifico</label>
                <div className="collapse-content">
                  <div className='card'>
                    <h3 className='text-center mb-2'>Busqueda especifica de los documentos afectados</h3>
                    <div className='row '>
                      <div className='col-6' >
                        <label className='label__general'>Texto a Buscar:</label>
                        <input className={'inputs__general'} type="text" value={descripcionS} onChange={(e) => setDescripcionS(e.target.value)}
                          placeholder='Ingresa un texto a buscar' onKeyUp={(e) => e.key === 'Enter' && getData()} />
                      </div>
                      <div className='col-6'>
                        <Empresas_Sucursales modeUpdate={false} empresaDyn={empresaH} sucursalDyn={sucursalH} all={true}
                          setEmpresaDyn={setEmpresaH} setSucursalDyn={setSucursalH}></Empresas_Sucursales>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="activities-header m-3 text-center">
              <button className="activities-btn-add" onClick={() => abrirModal(false, [])}>Agregar Actividad</button>
              <button className="activities-btn-filter" onClick={getData}>Filtrar Actividades</button>
              <button className="activities-btn-warning" onClick={exportToCSV} title='Exportar a CSV'>
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sheet-icon lucide-sheet"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="3" x2="21" y1="9" y2="9" /><line x1="3" x2="21" y1="15" y2="15" /><line x1="9" x2="9" y1="9" y2="21" /><line x1="15" x2="15" y1="9" y2="21" /></svg>
              </button>
              <button className="activities-btn-warning" onClick={exportToPDF} title='Exportar a PDF'>
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>
              </button>
            </div>
            <div className="activities-menu-content">
              <div className={`activities-menu-panel`}>

                <ul className="activities-list">
                  {data?.length > 0 ? (
                    data?.map((dat: any, i: number) => (

                      <li className={`activities-item ${dat.status === 0
                        ? "activities-status-activo"
                        : dat.status === 1
                          ? "activities-status-cancelado"
                          : dat.status === 2
                            ? "activities-status-terminado"
                            : ""
                        }`} >
                        {dat.status == 0 && (
                          <input type="checkbox" className="activities-checkbox" checked={dat.status === 2}
                            onChange={(e) => changeStatus(dat.id, 2, e.target.checked, i)} />

                        )}
                        <div className="activities-content">
                          <div className="activities-task">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill={
                              dat.prioridad === 0
                                ? "green"   // bajo
                                : dat.prioridad === 1
                                  ? "orange"  // medio
                                  : "red"     // alto
                            } stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-flag-icon lucide-flag"><path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528" /></svg>
                            {dat.tipo == 0 ? (<small>Manual</small>) : (<small>Automática</small>)} <br />
                            {dat.descripcion}</div>
                          <div className="activities-details">
                            <div className="activities-detail"><span className="activities-icon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>

                            </span> {dat.asignado}</div>
                            <div className="activities-detail"><span className="activities-icon ">
                              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-building2-icon lucide-building-2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" /></svg>
                            </span> {dat.sucursal}</div>
                            <div className="activities-detail"><span className="activities-icon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-calendar-icon lucide-calendar"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></svg>
                            </span> {new Date(dat.fecha).toLocaleDateString("es-MX", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}</div>
                            <div className="activities-detail"><span className="activities-icon ">
                              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-alarm-clock-icon lucide-alarm-clock"><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2" /><path d="M5 3 2 6" /><path d="m22 6-3-3" /><path d="M6.38 18.7 4 21" /><path d="M17.64 18.67 20 21" /></svg>
                            </span>  {new Date(dat.fecha).toLocaleTimeString("es-MX", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            }).toUpperCase()}</div>
                            {dat.status == 0 && (
                              <>
                                <div className="activities-detail" style={{ color: 'red' }} >

                                  <svg onClick={(e) => changeStatus(dat.id, 1, 0, i)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6" /><path d="M14 11v6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                </div>
                                {dat.tipo == 0 && (
                                  <div className="activities-detail" style={{ color: 'orange' }} >
                                    <svg onClick={() => abrirModal(true, dat)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" /></svg>
                                  </div>
                                )}
                              </>
                            )}

                          </div>
                        </div>
                      </li>
                    ))) :
                    <>
                      <div className='d-flex justify-content-center align-items-center' style={{ height: '100px' }}>
                        <p className='text__noData'>No hay datos para mostrar</p>
                      </div>
                    </>
                  }



                </ul>
              </div>

            </div>
          </div>
        </div>



        <div className='row paginado-container'>
          <div className='col-1'>
            <button className="paginado-btn paginado-btn-prev" onClick={() => setPage(page - 1)} disabled={page === 1}>
              ← Anterior
            </button>
          </div>
          <div className='col-10 paginado-info'>
            Página {page}
          </div>
          <div className='col-1'>
            <button className="paginado-btn paginado-btn-next" onClick={() => setPage(page + 1)}>
              Siguiente →
            </button>
          </div>
        </div>

      </div>
      {isOpen && (
        <div className="activities-modal-overlay" >
          <div className="activities-modal-content" onClick={e => e.stopPropagation()}>
            {modoUpdate ? <h2 className="activities-modal-title">Modificar Actividad</h2> :
              <h2 className="activities-modal-title">Crear Nueva Actividad</h2>
            }
            <label>Descripción de la Actividad</label><br />
            <textarea className='inputs__general' rows={2} placeholder='Describe la actividad a realizar' value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></textarea><br />
            <label>Usuario a Asignar</label><br />
            <select
              className="select_original_general"
              value={usuarioSelected}
              onChange={(e) => {
                setUsuarioSelected(parseInt(e.target.value || '0'));
              }}
            >
              {Array.isArray(usuarios) && usuarios.length > 0
                && usuarios.map((sol: any) => (
                  <option key={sol.id} value={sol.id}>{sol.nombre}</option>
                ))}
            </select><br />
            <label>Prioridad de Actividad</label><br />
            <label className='m-2'>
              <input
                type="radio"
                name="prioridad"
                value="0"
                checked={prioridad === 0}
                onChange={(e) => setPrioridad(parseInt(e.target.value))}
              />
              Baja
            </label>
            <label className='m-2'>
              <input
                type="radio"
                name="prioridad"
                value="1"
                checked={prioridad === 1}
                onChange={(e) => setPrioridad(parseInt(e.target.value))}
              />
              Media
            </label>
            <label className='m-2'>
              <input
                type="radio"
                name="prioridad"
                value="2"
                checked={prioridad === 2}
                onChange={(e) => setPrioridad(parseInt(e.target.value))}
              />
              Alta
            </label>
            <div className='row'>
              <div className='col-12 text-center mt-3'>
                <button className="btn__general-danger mr-5" onClick={() => abrirModal(false, [])}>Cerrar</button>
                <button className="btn__general-purple" onClick={save}>
                  {modoUpdate ? 'Modificar' : 'Crear'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default Actividades
