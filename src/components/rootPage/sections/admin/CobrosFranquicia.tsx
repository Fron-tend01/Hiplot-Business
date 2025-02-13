import React, { useEffect, useState } from 'react'
import './styles/CobrosFranquicia.css'
import APIs from '../../../../services/services/APIs'
import DynamicVariables from '../../../../utils/DynamicVariables'
import Filtrado_Articulos_Basic from '../../Dynamic_Components/Filtrado_Articulos_Basic'
import useUserStore from '../../../../zustand/General'
import Empresas_Sucursales from '../../Dynamic_Components/Empresas_Sucursales'
import Flatpickr from "react-flatpickr";
import { Spanish } from 'flatpickr/dist/l10n/es.js'; // Importa la localización en español
import { storeSeries } from '../../../../zustand/Series'
import Select from '../../Dynamic_Components/Select'
const CobrosFranquicia: React.FC = () => {
    const [articulos, setArticulos] = useState<any[]>([])
    const [data, setData] = useState<any[]>([])
    const userState = useUserStore(state => state.user);
    const user_id = userState.id
    const [series, setSeries] = useState<any>({})
    const { getSeriesXUser }: any = storeSeries();

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
        id_empresa: 0,
        id_franquicia: 0,
        id_serie: 0,
        folio: 0,
        desde: date[0],
        hasta: date[1],
        status: 0
    })
    useEffect(() => {
        fetch()
    }, [])
    const getData = async () => {
        let filter_art = articulos.map(articulo => articulo.id);
        searcher.ids_articulos = filter_art
        await APIs.CreateAny(searcher, "reporte_ultimos_costos")
            .then(async (response: any) => {
                setData(response)
            })
    }
    const fetch = async () => {
        // await getData()
        const resultSerie = await getSeriesXUser({ tipo_ducumento: 12, id: user_id })
        setSeries({
            selectName: 'serieSearcher',
            dataSelect: resultSerie,
            options: 'nombre'
        })
    }
    const handleClick = (val: any) => {
        DynamicVariables.updateAnyVar(setSearcher, "status", val)
    };
    const [empresaSelectedSearcher, setEmpresaSelectedSearcher] = useState<any>({})
    const [franquiciaSelectedSearcher, setFranquiciaSelectedSearcher] = useState<any>({})
    const [empresaSelected, setEmpresaSelected] = useState<any>({})
    const [franquiciaSelected, setFranquiciaSelected] = useState<any>({})
    const [modal, setModal] = useState<boolean>(false)
    const [modoUpdate, setModoUpdate] = useState<boolean>(false)
    const [registroSelected, setRegistroSelected] = useState<any>({
        id: 0,
        id_empresa: 0,
        id_franquicia: 0,
        conceptos: []
    })
    const AbrirModal = () => {
        setModal(true)
    }
    return (
        <div className='cfadmin'>
            <div className='cfadmin__container'>
                <div className='row'>
                    <div className='col-3'>
                        <Empresas_Sucursales modeUpdate={false} empresaDyn={empresaSelectedSearcher}
                            setEmpresaDyn={setEmpresaSelectedSearcher} just_empresa={true}></Empresas_Sucursales>
                    </div>
                    <div className='col-3'>
                        <Empresas_Sucursales modeUpdate={false} empresaDyn={franquiciaSelectedSearcher} nombre_label_empresa='Franquicia'
                            setEmpresaDyn={setFranquiciaSelectedSearcher} just_empresa={true}></Empresas_Sucursales>
                    </div>
                    <div className='col-2'>
                        <label className='label__general'>Fecha</label>
                        <div className='container_dates__requisition'>
                            <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={date} onChange={handleDateChange} placeholder='seleciona las fechas' />
                        </div>
                    </div>
                    <div className='col-2'>
                        <Select dataSelects={series} instanceId='serieSearcher' nameSelect={'Serie'}></Select>
                    </div>
                    <div className='col-2'>
                        <div>
                            <label className='label__general'>Folio</label>
                            <input className={`inputs__general`} type="text" value={searcher.folio} onChange={(e) => DynamicVariables.updateAnyVar(setSearcher, "folio", parseInt(e.target.value))} placeholder='Ingresa el folio' />
                        </div>
                    </div>
                </div>
                <div className='row text-center mb-3 mt-3'>
                    <div className='col-11 mx-auto'>
                        <div className=' container__checkbox_orders'>
                            <div className=' checkbox__orders'>
                                <label className="checkbox__container_general">
                                    <input className='checkbox' type="radio" name="requisitionStatus" checked={searcher.status == 0 ? true : false} onChange={() => handleClick(0)} />
                                    <span className="checkmark__general"></span>
                                </label>
                                <p className='title__checkbox text'>Activo</p>
                            </div>
                            <div className=' checkbox__orders'>
                                <label className="checkbox__container_general">
                                    <input className='checkbox' type="radio" name="requisitionStatus" value={searcher.status} onChange={() => handleClick(1)} />
                                    <span className="checkmark__general"></span>
                                </label>
                                <p className='title__checkbox text'>Cancelados</p>
                            </div>
                            <div className=' checkbox__orders'>
                                <label className="checkbox__container_general">
                                    <input className='checkbox' type="radio" name="requisitionStatus" value={searcher.status} onChange={() => handleClick(2)} />
                                    <span className="checkmark__general"></span>
                                </label>
                                <p className='title__checkbox text'>Terminados</p>
                            </div>
                        </div>
                        <button className='btn__general-purple'>Buscar</button>
                    </div>
                    <div className='col-1 mx_auto'>
                        <div className='tooltip-container'>

                            <button className='btn__general-orange' onClick={()=>AbrirModal()}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-hand-coins"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" /><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" /><path d="m2 16 6 6" /><circle cx="16" cy="9" r="2.9" /><circle cx="6" cy="5" r="3" /></svg>
                            </button>
                            <span className="tooltip-text" >Crear Cobro a Franquicia</span>

                        </div>
                    </div>
                </div>
                <div className="cfadminData__container">
                    <table className="cfadminData__table">
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
                                    <td colSpan={13} className="cfadminData__no-data">
                                        No hay datos disponibles
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>



                {/* -------------------------------------------------------------MODALES----------------------------------------------------------------------------- */}
                <div className={`overlay__modal__cfadm ${modal ? 'active' : ''}`}>
                    <div className={`popup__modal__cfadm ${modal ? 'active' : ''}`}>
                        <a href="#" className="btn-cerrar-popup__modal__cfadm" onClick={() => setModal(false)}>
                            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                        </a>
                        {modoUpdate ?
                            <div>
                                <p className='title__modals'><b>Actualizar Pedido de Franquicia</b></p>
                                <div className="card ">
                                    <div className="card-body bg-standar">
                                        <h3 className="text">{registroSelected.serie}-{registroSelected.folio}-{registroSelected.anio}</h3>
                                        <hr />
                                        <div className='row'>
                                            <div className='col-6 md-col-12'>
                                                <span className='text'>Creado por: <b>{registroSelected.usuario_crea}</b></span><br />
                                                <span className='text'>Fecha de Creación: <b>{registroSelected.fecha}</b></span><br />
                                                {/* <button className='btn__general-orange' type='button' onClick={getPDF}>PDF</button> */}

                                            </div>
                                            <div className='col-6 md-col-12'>
                                                <span className='text'>Empresa: <b>{registroSelected.empresa}</b></span><br />
                                                <span className='text'>Sucursal: <b>{registroSelected.sucursal}</b></span><br />
                                                <span className='text'>Proveedor: <b>{registroSelected.proveedor}</b></span> <br />
                                                {/* <button className='btn__general-danger' type='button' onClick={cancelarPf}>Cancelar</button> */}

                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-12'>
                                                <span className='text'>Comentarios: {registroSelected.comentarios}</span>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="table__paf-requisicion">
                                    <table>
                                        <thead className="table__paf-head">
                                            <tr>
                                                <th>Articulo</th>
                                                <th>Unidad</th>
                                                <th>Cantidad</th>
                                                <th>P/U</th>
                                                <th>Total</th>
                                                <th>Comentarios</th>
                                            </tr>
                                        </thead>
                                        <tbody className="table__paf-body">
                                            {registroSelected.conceptos && registroSelected.conceptos.length > 0 ? (
                                                registroSelected.conceptos.map((concept: any, index: number) => (
                                                    <tr className="tbody__paf-container" key={index}>
                                                        <td>{concept.codigo}-{concept.descripcion}</td>
                                                        <td>{concept.unidad}</td>
                                                        <td>{concept.cantidad}</td>
                                                        <td>${concept.precio_unitario}</td>
                                                        <td>${concept.total}</td>
                                                        <td>{concept.comentarios}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="table__paf-no-data">
                                                        No hay requisiciones disponibles
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            :
                            <div className='franchise__orders'>
                                <p className='title__modals'><b>Crear Pedido de Franquicia</b></p>
                                <div className='row row__one'>
                                    <div className='col-3'>
                                        <Empresas_Sucursales modeUpdate={false} empresaDyn={empresaSelected}
                                            setEmpresaDyn={setEmpresaSelected} just_empresa={true}></Empresas_Sucursales>
                                    </div>
                                    <div className='col-3'>
                                        <Empresas_Sucursales modeUpdate={false} empresaDyn={franquiciaSelected} nombre_label_empresa='Franquicia'
                                            setEmpresaDyn={setFranquiciaSelected} just_empresa={true}></Empresas_Sucursales>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-12'>
                                        <br />
                                        <hr />
                                        <label className='label__general'>OP's Cargadas</label>
                                        <hr />
                                        <br />
                                        <div className='table__franchise_orders_modal'>
                                            <div className='table__head'>
                                                <div className={`thead `}>
                                                    <div className='th'>
                                                        <p>Artículo</p>
                                                    </div>
                                                    <div className='th'>
                                                        <p>Cantidad</p>
                                                    </div>
                                                    <div className='th'>
                                                        <p>Unidad</p>
                                                    </div>
                                                    <div className='th'>
                                                        <p>P/U</p>
                                                    </div>
                                                    <div>
                                                        <p>Total</p>
                                                    </div>
                                                    <div className='th'>
                                                        <p>Comentarios</p>
                                                    </div>
                                                    <div>
                                                        <p>Opts</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {articulos ? (
                                                <div className='table__body'>
                                                    {articulos?.map((article: any, index: number) => {
                                                        return (
                                                            <div className='tbody__container' key={index}>
                                                                <div className='tbody'>
                                                                    <div className='td ' style={{ cursor: 'pointer' }} title='Haz clic aquí para modificar tu concepto'>
                                                                        <p className='article'>{article.codigo}-{article.descripcion}</p>
                                                                    </div>
                                                                    <div className='td'>
                                                                        <input className={`inputs__general`} type="number" value={article.cantidad}
                                                                            // onChange={(e) => { handleCantidad(e, index) }}
                                                                        />
                                                                    </div>

                                                                    <div className='td'>
                                                                        <p>${article.precio_unitario}</p>
                                                                    </div>
                                                                    <div className='td'>
                                                                        <p>${article.total}</p>
                                                                    </div>
                                                                    <div className='td'>
                                                                        <textarea className={`inputs__general`} value={article.comentarios}
                                                                            onChange={(e) => { DynamicVariables.updateAnyVarByIndex(setArticulos, index, "comentarios", e.target.value); }}
                                                                        />
                                                                    </div>

                                                                </div>

                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            ) : (
                                                <p className="text">Cargando datos...</p>
                                            )}
                                        </div>
                                        <div className=' '>

                                        </div>
                                    </div>
                                </div>
                                <div className='d-flex justify-content-between mt-3'>



                                    {/* <button className='btn__general-purple d-flex align-items-center' onClick={handleCreateRequisition} disabled={updateToRequisition && updateToRequisition.status == 2}>
                {updateToRequisition ? `${stateLoading ? 'Actualizando requisición' : 'Actualizar requisición'}` : `${stateLoading ? 'Creando requisición' : 'Crear requisición'}`}
                {stateLoading ? <span className="loader-two"></span> : ''}
              </button> */}
                                    <>
                                        <button className='btn__general-purple d-flex align-items-center' >Guardar</button>

                                    </>
                                </div>
                            </div>
                        }




                    </div>
                </div>
                {/* -------------------------------------------------------------FIN MODALES----------------------------------------------------------------------------- */}

            </div>
        </div>
    )
}

export default CobrosFranquicia
