import React, { useEffect, useState } from 'react'
import './styles/Billing.css'
import { storeArticles } from '../../../../zustand/Articles'
import ModalBilling from './billing/ModalBilling'
import Empresas_Sucursales from '../../Dynamic_Components/Empresas_Sucursales'
import Flatpickr from "react-flatpickr";
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/l10n/es.js'; // Importar el idioma español
import { storeBilling } from '../../../../zustand/Billing'
import APIs from '../../../../services/services/APIs'
import useUserStore from '../../../../zustand/General'
import { useSelectStore } from '../../../../zustand/Select'
import Select from '../../Dynamic_Components/Select'
import DynamicVariables from '../../../../utils/DynamicVariables'
import { usersRequests } from '../../../../fuctions/Users'
const Billing: React.FC = () => {

    const setSubModal = storeArticles(state => state.setSubModal)
    const userState = useUserStore(state => state.user);
    let user_id = userState.id
    const setDates = storeBilling(state => state.setDates)
    const dates = storeBilling(state => state.dates)
    const [EmpresaSearcher, setEmpresaSearcher] = useState<any>({})
    const [SucursalSearcher, setSucursalSearcher] = useState<any>({})
    const [Series, setSeries] = useState<any>([])
    const [TypeSearcher, setTypeSearcher] = useState<number>(0)
    const [FolioSearcher, setFolioSearcher] = useState<number>(0)
    const [ClienteSearcher, setClienteSearcher] = useState<string>('')
    const selectData = useSelectStore(state => state.selectedIds)
    const setSelectData = useSelectStore(state => state.setSelectedId)
    const { getUsers }: any = usersRequests()
    const [users, setUsers] = useState<any>([])
    const [Data, setData] = useState<any>([])
    const setDataUpdate = storeBilling(state => state.setDataUpdate)
    const setModoUpdate = storeBilling(state => state.setModoUpdate)

    const hoy = new Date();
    const haceUnaSemana = new Date();
    haceUnaSemana.setDate(hoy.getDate() - 7);
    const fecth = async () => {
        const response = await APIs.getSeriesXUser({ id: user_id, tipo_ducumento: 9 });
        if (Array.isArray(response)) {
            response.unshift({ nombre: 'Todos', id: 0 });
            const updatedSeries = {
                selectName: 'Series',
                dataSelect: response,
                options: 'nombre',
            };
            setSeries(updatedSeries);
            // Realiza la acción directamente aquí con `response[0]?.id` o `updatedSeries`
            setSelectData('serieSearcher', response[0]?.id);
        }

        const resultUsers = await getUsers({ nombre: '', id_usuario: user_id, id_usuario_consulta: user_id, light: true, id_sucursal: 0 })
        if (Array.isArray(resultUsers)) {

            resultUsers.unshift({ nombre: 'Todos', id: 0 });
            setUsers({
                selectName: 'Vendedor',
                options: 'nombre',
                dataSelect: resultUsers
            })
            setSelectData('vendedorSearcher', resultUsers[0]?.id);
        }
        setDates([haceUnaSemana.toISOString().split('T')[0], hoy.toISOString().split('T')[0]])
    }
    useEffect(() => {
        fecth()
    }, [])
    const handleDateChange = (fechasSeleccionadas: any) => {
        if (fechasSeleccionadas.length === 2) {
            setDates(fechasSeleccionadas.map((fecha: any) => fecha.toISOString().split('T')[0]));
        } else {
            setDates([fechasSeleccionadas[0]?.toISOString().split('T')[0] || "", ""]);
        }
    };
    const handleClickType = (value: number) => {
        setTypeSearcher(value)
    };
    const search = async () => {
        console.log(SucursalSearcher);

        let data = {
            folio: FolioSearcher,
            id_sucursal: SucursalSearcher?.id,
            id_serie: selectData?.serieSearcher?.id,
            cliente: ClienteSearcher,
            desde: dates[0],
            hasta: dates[1],
            id_vendedor: selectData?.vendedorSearcher?.id,
            id_usuario: user_id,
            status: TypeSearcher,
        }
        let result = await APIs.CreateAny(data, "get_factura")
        setData(result)
    }
    const modalUpdate = (dat: any) => {
        setSubModal('billing__modal')
        setDataUpdate(dat)
        setModoUpdate(true)
      }
    return (
        <div className='billing'>
            <div className='billing__container'>
                <div className='row'>
                    <div className='col-8 md-col-12'>
                        <Empresas_Sucursales modeUpdate={false} empresaDyn={EmpresaSearcher} sucursalDyn={SucursalSearcher}
                            setEmpresaDyn={setEmpresaSearcher} setSucursalDyn={setSucursalSearcher} all={true} />
                    </div>
                    <div className='col-4 md-col-12'>
                        <div className='dates__requisition'>
                            <label className='label__general'>Fechas</label>
                            <div className='container_dates__requisition'>
                                <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={dates} onChange={handleDateChange} placeholder='seleciona las fechas' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-3'>
                        <Select dataSelects={users} instanceId='vendedorSearcher' nameSelect={'Vendedor'}></Select>

                    </div>
                    <div className='col-3'>
                        <div>
                            <label className='label__general'>Cliente</label>
                            <input className={`inputs__general`} type="text" value={ClienteSearcher} onChange={(e) => setClienteSearcher(e.target.value)} placeholder='Ingresa RFC/razon social/nombre comerial' />
                        </div>
                    </div>

                    <div className='col-3'>
                        <Select dataSelects={Series} instanceId='serieSearcher' nameSelect={'Serie'}></Select>

                    </div>
                    <div className='col-3'>
                        <div>
                            <label className='label__general'>Folio</label>
                            <input className={`inputs__general`} type="number" value={FolioSearcher} onChange={(e) => setFolioSearcher(parseInt(e.target.value))} placeholder='Ingresa el folio' />
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-6 md-col-6 sm-col-12 container__checkbox_orders'>
                        <div className='col-4 md-col-4 sm-col-12 checkbox__orders'>
                            <label className="checkbox__container_general">
                                <input className='checkbox' type="radio" name="requisitionStatus" checked={TypeSearcher == 0 ? true : false} onChange={() => handleClickType(0)} />
                                <span className="checkmark__general"></span>
                            </label>
                            <p className='title__checkbox text'>Activo</p>
                        </div>
                        <div className='col-4 md-col-4 sm-col-12 checkbox__orders'>
                            <label className="checkbox__container_general">
                                <input className='checkbox' type="radio" name="requisitionStatus" value={TypeSearcher} onChange={() => handleClickType(1)} />
                                <span className="checkmark__general"></span>
                            </label>
                            <p className='title__checkbox text'>Cancelados</p>
                        </div>
                        <div className='col-4 md-col-4 sm-col-12 checkbox__orders'>
                            <label className="checkbox__container_general">
                                <input className='checkbox' type="radio" name="requisitionStatus" value={TypeSearcher} onChange={() => handleClickType(2)} />
                                <span className="checkmark__general"></span>
                            </label>
                            <p className='title__checkbox text'>Terminados</p>
                        </div>
                    </div>
                    <div className='col-3 md-col-3 sm-col-6'>
                        <button className='btn__general-orange' onClick={() => search()}>Buscar</button>
                    </div>
                    <div className='col-3 md-col-3 sm-col-6'>
                        <button className='btn__general-purple' onClick={() => {setDataUpdate({});setModoUpdate(false);setSubModal('billing__modal'); }}>Crear nueva factura</button>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-12'>
                        <div className='table__requisiciones'>
                            <div>
                                {Data ? (
                                    <div>
                                        <p>Tus Facturas {Data.length}</p>
                                    </div>
                                ) : (
                                    <p></p>
                                )}
                            </div>
                            <div className='table__head'>
                                <div className='thead'>
                                    <div className='th'>
                                        <p>Folio</p>
                                    </div>
                                    <div className='th'>
                                        <p>Tipo</p>
                                    </div>
                                    <div className='th'>
                                        <p>Status</p>
                                    </div>
                                    <div className='th'>
                                        <p>Fecha</p>
                                    </div>
                                    <div className='th'>
                                        <p>Por</p>
                                    </div>
                                    <div className='th'>
                                        <p>Empresas</p>
                                    </div>
                                    <div className='th'>
                                        <p>Sucursal</p>
                                    </div>
                                </div>
                            </div>
                            {Data ? (
                                <div className='table__body'>
                                    {Data.map((dat: any, index: number) => {
                                        return (
                                            <div className='tbody__container' key={index}  onClick={()=>modalUpdate(dat)}>
                                                <div className='tbody'>
                                                    <div className='td code'>
                                                        <p>{dat.serie}-{dat.folio}-{dat.anio}</p>
                                                    </div>
                                                    <div className='td'>
                                                        <p>{dat.tipo === 0 ? 'Directa' : dat.tipo==1 ? 'OV': 'PAF'}</p>
                                                    </div>
                                                    <div className='td'>
                                                        <p>{dat.status == 0 ? <div className='active-status'><p>Activo</p></div> : ''}</p>
                                                        <p>{dat.status == 1 ? <div className='canceled-status'><p>Cancelada</p></div> : ''}</p>
                                                    </div>
                                                    <div className='td date'>
                                                        <p>{dat.fecha_creacion.split('T')[0]}</p>
                                                    </div>
                                                    <div className='td'>
                                                        <p>{dat.usuario_crea}</p>
                                                    </div>
                                                    <div className='td'>
                                                        <p>{dat.empresa}</p>
                                                    </div>
                                                    <div className='td'>
                                                        <p>{dat.sucursal}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <p>Cargando datos...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ModalBilling />
        </div>
    )
}

export default Billing
