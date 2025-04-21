import React, { useEffect, useState } from 'react'
import './styles/WarehouseMovements.css'
import Empresas_Sucursales from '../../Dynamic_Components/Empresas_Sucursales'
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import Flatpickr from "react-flatpickr";
import Select from '../../Dynamic_Components/Select';
import useUserStore from '../../../../zustand/General';
import APIs from '../../../../services/services/APIs';
import { useSelectStore } from '../../../../zustand/Select';
import Filtrado_Articulos_Basic from '../../Dynamic_Components/Filtrado_Articulos_Basic';
import DynamicVariables from '../../../../utils/DynamicVariables';
import { storeArticles } from '../../../../zustand/Articles';
import LoadingInfo from '../../../loading/LoadingInfo';
import Swal from 'sweetalert2';

const WarehouseMovements: React.FC = () => {
    const userState = useUserStore(state => state.user);
    const user_id = userState.id;
    const modalLoading = storeArticles((state: any) => state.modalLoading);
    const setModalLoading = storeArticles((state: any) => state.setModalLoading);


    const [data, setData] = useState<any>([])
    const [companies, setCompanies] = useState<any>([])

    const selectedIds: any = useSelectStore((state) => state.selectedIds);

    const hoy = new Date();
    const haceUnaSemana = new Date();
    haceUnaSemana.setDate(hoy.getDate() - 7);

    // Inicializa el estado con las fechas formateadas
    const [dates, setDates] = useState([
        haceUnaSemana.toISOString().split('T')[0],
        hoy.toISOString().split('T')[0]
    ]);

    const [searcher, setSearcher] = useState<any>({
        id_empresa: 0,
        desde: dates[0],
        hasta: dates[1],
        articulos: [],
        almacenes: [],
        id_usuario: user_id
    })
    const handleDateChange = (fechasSeleccionadas: any) => {
        if (fechasSeleccionadas.length === 2) {
            setDates(fechasSeleccionadas.map((fecha: any) => fecha.toISOString().split('T')[0]));
        } else {
            setDates([fechasSeleccionadas[0]?.toISOString().split('T')[0] || "", ""]);
        }
    };
    const [store, setStore] = useState<any>([])
    const fetch = async () => {
        let response = await APIs.getStore(user_id)
        console.log(response)
        setStore({
            selectName: 'Almacen',
            options: 'nombre',
            dataSelect: response
        })
    }


    useEffect(() => {
        fetch()
    }, [])
    useEffect(() => {
        DynamicVariables.updateAnyVar(setSearcher, "id_empresa", companies?.id)
    }, [companies])
    useEffect(() => {
        DynamicVariables.updateAnyVar(setSearcher, "desde", dates[0])
        DynamicVariables.updateAnyVar(setSearcher, "hasta", dates[1])
    }, [dates])

    const [articulos, setArticulos] = useState<any[]>([])
    const [dataStore, setDataStore] = useState<any>([])


    const addStore = () => {
        setDataStore([...dataStore, selectedIds.store])
    }
    const search = async () => {
        setModalLoading(true)
        searcher.articulos = articulos.map((articulo) => articulo.id);
        searcher.almacenes = dataStore.map((almacen: any) => almacen.id);

        APIs.CreateAny(searcher, "reporte_movimientos_alm").then((resp: any) => {
            setModalLoading(false)
            if (resp.error) {
                Swal.fire('Notificacion', resp.mensaje, 'warning')
            } else {
                setData(resp.data)
            }

        }).catch((_e: any) => {
            setModalLoading(false)

        })

    }
    const eliminarSalida = (salida: any) => {
        Swal.fire({
            title: "Seguro que deseas eliminar el registro de la salida?",
            text: "Esta acción no se puede deshacer !",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            denyButtonText: `Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await APIs.CreateAny(salida, "eliminarRegistroSalidaDeEntrada")
                        .then(async (resp: any) => {
                            if (!resp.error) {
                                Swal.fire('Notificación', resp.mensaje, 'success');
                            } else {
                                Swal.fire('Notificación', resp.mensaje, 'warning');
                            }
                        })
                } catch (error) {
                    Swal.fire('Notificacion', 'Ocurrió un error al eliminar el registro de salida, consulta con soporte', 'warning')

                }
            }
        });
    }
    const eliminarPafOv = (data: any) => {
        Swal.fire({
            title: "Seguro que deseas eliminar el registro PAF/OV?",
            text: "Esta acción no se puede deshacer !",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            denyButtonText: `Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await APIs.CreateAny(data, "eliminarRegistroApartadoEntradaPAFOV")
                        .then(async (resp: any) => {
                            if (!resp.error) {
                                Swal.fire('Notificación', resp.mensaje, 'success');
                            } else {
                                Swal.fire('Notificación', resp.mensaje, 'warning');
                            }
                        })
                } catch (error) {
                    Swal.fire('Notificacion', 'Ocurrió un error al eliminar el registro de salida, consulta con soporte', 'warning')

                }
            }
        });
    }
    const cambiarApartado = (i: number, j: number, valor: number) => {

        const newData = [...data];
        newData[i].entradas[j].apartado = valor;
        newData[i].entradas[j].disponible = newData[i].entradas[j].restante - valor;
        newData[i].entradas[j].noNegativo = false

        if (newData[i].entradas[j].disponible < 0) {
            newData[i].entradas[j].noNegativo = true
        }
        setData(newData);

    }
    const cambiarRestante = (i: number, j: number, valor: number) => {
        const newData = [...data];
        newData[i].entradas[j].restante = valor;
        newData[i].entradas[j].noNegativo = false

        newData[i].entradas[j].disponible = valor - newData[i].entradas[j].apartado;
        if (newData[i].entradas[j].disponible < 0) {
            newData[i].entradas[j].noNegativo = true
        }
        setData(newData);
    }
    const modificarRyA = (data: any) => {
        Swal.fire({
            title: "Seguro que desea modificar los registros?",
            text: "Puedes volver a ajustar estos registros, se ajustarán la cantidad RESTANTE como la APARTADA con los datos ingresados",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            denyButtonText: `Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await APIs.CreateAny(data, "modificarRyA")
                        .then(async (resp: any) => {
                            if (!resp.error) {
                                Swal.fire('Notificación', resp.mensaje, 'success');
                            } else {
                                Swal.fire('Notificación', resp.mensaje, 'warning');
                            }
                        })
                } catch (error) {
                    Swal.fire('Notificacion', 'Ocurrió un error al ajustar los registros, consulta con soporte', 'warning')

                }
            }
        });
    }
    return (
        <div className='warehouse__movements'>
            <div className='warehouse__movements_container'>
                <div className='row '>
                    <div className='col-6 wm-col-izq'>
                        <Empresas_Sucursales update={false} empresaDyn={companies} setEmpresaDyn={setCompanies} just_empresa={true} />
                        <div className='col-2'>
                            <label className='label__general'>Fechas</label>
                            <div className='container_dates__requisition'>
                                <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={dates} onChange={handleDateChange} placeholder='seleciona las fechas' />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-10 mt-2'>
                                <Select dataSelects={store} instanceId="store" nameSelect={'Agregar Almacen'} />

                            </div>
                            <div className='col-2 mt-3'>
                                <button className='btn__general-primary' onClick={addStore}>Add+ Almacen</button>

                            </div>
                        </div>
                    </div>
                    <div className='col-6'>
                        <label className='text'> Agregar Articulos</label>
                        <Filtrado_Articulos_Basic set_article_local={setArticulos} />

                    </div>
                </div>
                <div className='row mb-3 mt-2'>
                    <div className='col-6 table__warehouse-movements'>
                        <div className='table__head'>
                            <div className={`thead `}>
                                <div className='th'>
                                    <p>Almacen</p>
                                </div>
                            </div>
                        </div>
                        <div className='table__body'>
                            <div className='tbody__container'>
                                <div className={`tbody`}>
                                    {dataStore.map((x: any, index: number) => (
                                        <>
                                            <div className='td '>
                                                <p className='article'>{x.nombre}</p>
                                            </div>
                                            <div className='td'>
                                                <div className='delete-icon' onClick={() => {
                                                    DynamicVariables.removeObjectInArray(setDataStore, index);
                                                }} title='Eliminar'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                </div>

                                            </div>
                                        </>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=' col-6 table__warehouse-movements'>
                        <div className='table__head'>
                            <div className={`thead `}>
                                <div className='th'>
                                    <p className='text'>Artículo</p>
                                </div>

                            </div>
                        </div>

                        <div className='table__body'>
                            <div className='tbody__container'>
                                <div className={`tbody`}>
                                    {articulos.map((x: any, index: number) => (
                                        <>
                                            <div className='td '>
                                                <p className='article'>{x.codigo} - {x.descripcion}</p>
                                            </div>
                                            <div className='td'>
                                                <div className='delete-icon' onClick={() => {
                                                    DynamicVariables.removeObjectInArray(setArticulos, index);
                                                }} title='Eliminar'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                </div>

                                            </div>
                                        </>
                                    ))}


                                </div>
                            </div>


                        </div>

                    </div>

                </div>
                <div className='row'>
                    <div className='col-12 text-center'>
                        <button className='btn__general-purple' onClick={search}>Generar Reporte</button>
                    </div>
                </div>
                <div className='row text-center m-1'>
                    {data.map((a: any, i: number) => (
                        <>
                            <b>{a.nombre}</b>
                            <div className='col-12'>
                                <div className="datareporte__container">
                                    <table className="datareporte__table">
                                        <thead>
                                            <tr>
                                                <th>Artículo</th>
                                                <th>Folio</th>
                                                <th>Fecha</th>
                                                <th>Cant.</th>
                                                <th>Rest.</th>
                                                <th>Apart.</th>
                                                <th>Disp.</th>
                                                <th>Movimientos</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {a.entradas.length > 0 ? (
                                                a.entradas.map((x: any, j: number) => {
                                                    return (
                                                        <tr key={j}>
                                                            <td>{x.articulo}</td>
                                                            <td>{x.folio_entrada}</td>
                                                            <td>{x.fecha_creacion}</td>
                                                            <td>{x.cantidad}</td>
                                                            <td>
                                                                {x.restante}
                                                                <input
                                                                    className="input-apartado"
                                                                    type="text"
                                                                    value={x.restante}
                                                                    onChange={(e) =>
                                                                        cambiarRestante(i, j, parseFloat(e.target.value) || 0)}
                                                                />
                                                            </td>
                                                            <td>
                                                                {x.apartado}
                                                                <div className="input-button-group">
                                                                    <input
                                                                        className="input-apartado"
                                                                        type="text"
                                                                        value={x.apartado}
                                                                        onChange={(e) => cambiarApartado(i, j, parseFloat(e.target.value) || 0)}
                                                                    />
                                                                    <button className="btn-guardar">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                                            <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                                                                            <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
                                                                            <path d="M7 3v4a1 1 0 0 0 1 1h7" />
                                                                        </svg>
                                                                    </button>
                                                                </div>

                                                            </td>
                                                            <td>
                                                                {x.noNegativo == true && ('⚠️')} <br />
                                                                {x.disponible}</td>

                                                            <td>
                                                                <table className="datareporte__table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Folio</th>
                                                                            <th>Fecha</th>
                                                                            <th>Usuario</th>
                                                                            <th>Cantidad</th>
                                                                            <th>Unidad</th>
                                                                            <th>Motivo</th>
                                                                            <th>Del ⚠️</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {/* Apartado OV */}
                                                                        {x.apartados_ov.length > 0 ? (
                                                                            x.apartados_ov.map((ov: any, ovIndex: number) => (
                                                                                <tr key={`ov-${ovIndex}`}>
                                                                                    <td>{ov.folio_ovs}</td>
                                                                                    <td>{ov.fecha_creacion}</td>
                                                                                    <td>{ov.usuario_nombre}</td>
                                                                                    <td>{ov.cantidad}</td>
                                                                                    <td>{ov.unidad_nombre}</td>
                                                                                    <td>{ov.tipo == 0 ? 'Apartado por OV' : ov.tipo == 2 ? 'Venta OV' : 'Venta con OP'}</td>
                                                                                    <td>
                                                                                        <button className='btn__general-danger' onClick={() => eliminarPafOv(ov)}>
                                                                                            <div className='delete-icon' title='Eliminar'>
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                                                            </div>
                                                                                        </button>
                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                        ) : ('')}

                                                                        {/* Apartado PAF */}
                                                                        {x.apartados_paf.length > 0 ? (
                                                                            x.apartados_paf.map((paf: any, pafIndex: number) => (
                                                                                <tr key={`paf-${pafIndex}`}>
                                                                                    <td>{paf.folio_paf}</td>
                                                                                    <td>{paf.fecha}</td>
                                                                                    <td>{paf.usuario_nombre}</td>
                                                                                    <td>{paf.cantidad}</td>
                                                                                    <td>{paf.unidad_nombre}</td>
                                                                                    <td>{paf.tipo == 1 ? 'Apartado por PAF' : 'Venta PAF'}</td>
                                                                                    <td>
                                                                                        <button className='btn__general-danger' onClick={() => eliminarPafOv(paf)}>
                                                                                            <div className='delete-icon' title='Eliminar'>
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                                                            </div>
                                                                                        </button>
                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                        ) : ('')}

                                                                        {/* Salidas */}
                                                                        {x.salidas.length > 0 ? (
                                                                            x.salidas.map((salida: any, salidaIndex: number) => (
                                                                                <tr key={`salida-${salidaIndex}`}>
                                                                                    <td>{salida.folio_salida}</td>
                                                                                    <td>{salida.fecha_creacion}</td>
                                                                                    <td>{salida.usuario_nombre}</td>
                                                                                    <td>{salida.cantidad}</td>
                                                                                    <td>{salida.unidad_nombre}</td>
                                                                                    <td>Salida Generada</td>
                                                                                    <td>
                                                                                        <button className='btn__general-danger' onClick={() => eliminarSalida(salida)}>
                                                                                            <div className='' title='Eliminar' >
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                                                            </div>
                                                                                        </button>
                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                        ) : (
                                                                            <tr>
                                                                                <td colSpan={5}>No hay datos en Salidas</td>
                                                                            </tr>
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </td>

                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan={13} className="datareporte__no-data">
                                                        No hay datos disponibles
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ))}
                </div>
            </div>
            {
                modalLoading == true ? (
                    <LoadingInfo />
                ) :
                    ''
            }
        </div >
    )
}

export default WarehouseMovements
