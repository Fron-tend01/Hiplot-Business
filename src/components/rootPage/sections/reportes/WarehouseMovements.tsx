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
                </div>
                <div className='row'>
                    <div className='col-12 text-center'>
                        <button className='btn__general-purple' onClick={search}>Generar Reporte</button>
                    </div>
                </div>
                <div className='row text-center m-1'>
                    {data.map((a: any) => (
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
                                                a.entradas.map((x: any, index: number) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{x.articulo}</td>
                                                            <td>{x.folio_entrada}</td>
                                                            <td>{x.fecha_creacion}</td>
                                                            <td>{x.cantidad}</td>
                                                            <td>{x.restante}</td>
                                                            <td>{x.apartado}</td>
                                                            <td>{x.disponible}</td>

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
                                                                                    <td>Apartado por OV</td>
                                                                                </tr>
                                                                            ))
                                                                        ) : (
                                                                            <tr>
                                                                                <td colSpan={5}>No hay datos en Apartado OV</td>
                                                                            </tr>
                                                                        )}

                                                                        {/* Apartado PAF */}
                                                                        {x.apartados_paf.length > 0 ? (
                                                                            x.apartados_paf.map((paf: any, pafIndex: number) => (
                                                                                <tr key={`paf-${pafIndex}`}>
                                                                                    <td>{paf.folio_paf}</td>
                                                                                    <td>{paf.fecha}</td>
                                                                                    <td>{paf.usuario_nombre}</td>
                                                                                    <td>{paf.cantidad}</td>
                                                                                    <td>{paf.unidad_nombre}</td>
                                                                                    <td>Apartado por PAF</td>

                                                                                </tr>
                                                                            ))
                                                                        ) : (
                                                                            <tr>
                                                                                <td colSpan={5}>No hay datos en Apartado PAF</td>
                                                                            </tr>
                                                                        )}

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
