import { useState, useEffect } from "react"
import { storeCompanies } from "../../../../zustand/Companies";
import { storeBranchOffcies } from "../../../../zustand/BranchOffices";
import { storeSeries } from "../../../../zustand/Series";
import useUserStore from "../../../../zustand/General";
import { storeSuppliers } from "../../../../zustand/Suppliers";
import { storeTickets } from "../../../../zustand/Tickets";
import ModalCreate from "./tickets/ModalCreate";
import ModalUpdate from "./tickets/ModalUpdate";
import Flatpickr from "react-flatpickr";
import 'flatpickr/dist/flatpickr.min.css';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import './styles/Tickets.css'
import * as FileSaver from 'file-saver';
import Empresas_Sucursales from "../../Dynamic_Components/Empresas_Sucursales";
import Select from "../../Dynamic_Components/Select";
import { useSelectStore } from "../../../../zustand/Select";

const Tickets = () => {


    const { getCompaniesXUsers }: any = storeCompanies();
    const { getBranchOfficeXCompanies }: any = storeBranchOffcies();
    const { getSeriesXUser }: any = storeSeries();
    const { getSuppliers }: any = storeSuppliers();
    const { getTickets, tickets, getExcelTickets, dates }: any = storeTickets();
    const userState = useUserStore(state => state.user);
    let user_id = userState.id
    const [warningName] = useState<boolean>(false)

    const [companies, setCompanies] = useState<any>([])
    const [branchOffices, setBranchOffices] = useState<any>([])

    const [modalStateUpdate, setModalStateUpdate] = useState<boolean>(false)
    const [invoice, setInvoice] = useState<number>(0)

    const selectedIds: any = useSelectStore((state) => state.selectedIds);

    const setDates = storeTickets(state => state.setDates)


    const setModalTickets = storeTickets(state => state.setModalTickets)

    const [series, setSeries] = useState<any>([])
    const [suppliers, setSuppliers] = useState<any>([])
    const setSelectedId = useSelectStore((state) => state.setSelectedId);
    const fecth = async () => {
        let resultSeries = await getSeriesXUser({ id: user_id, tipo_ducumento: 2 })
        let resultSuppliers = await getSuppliers('', false, user_id)
        resultSeries.unshift({ id: 0, nombre: 'Todos' })

        setSeries({
            selectName: 'Series',
            options: 'nombre',
            dataSelect: resultSeries
        })
        setSelectedId('series', 0)

        // resultSuppliers.unshift({ id: 0, nombre: 'Todos' })

        setSuppliers({
            selectName: 'Proveedores',
            options: 'nombre',
            setSuppliers: resultSuppliers
        })
    }

    useEffect(() => {

        fecth()

        getCompaniesXUsers(user_id)
        getBranchOfficeXCompanies(0, user_id)



    }, [])


    const hoy = new Date();
    const haceUnaSemana = new Date();
    haceUnaSemana.setDate(hoy.getDate() - 7);

    // Inicializa el estado con las fechas formateadas
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



    const [updateTickets, setUpdateTickets] = useState<any>([])

    const modalUpdate = (ticket: any) => {
        setModalStateUpdate(true)
        setUpdateTickets(ticket)
        console.log(ticket)
    }


    const modalCloseUpdate = () => {
        setModalStateUpdate(false)
    }


    const excel = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        let id = 0;
        let id_usuario = user_id; // Assuming user_id is defined elsewhere
        let id_sucursal = branchOffices.id; // Assuming selectedBranchOffice is defined elsewhere
        let desde = dates[0];
        let hasta = dates[1];

        try {
            const response = await getExcelTickets(id, id_usuario, id_sucursal, desde, hasta);
            console.log('Excel', response);

            // Create a blob with the response data
            const blob = new Blob([response], { type: 'text/csv;charset=utf-8' });

            // Use FileSaver.js to download the blob as a CSV file
            FileSaver.saveAs(blob, 'nombre_archivo.csv');
        } catch (error) {
            console.error('Error al generar el CSV:', error);
        }
    };


    const searchTicket = () => {

        let data = {
            id_usuario: user_id,
            id_empresa: companies.id,
            id_sucursal: branchOffices.id,
            desde: date[0],
            hasta: date[1],
            id_serie: selectedIds?.series.id,
            status: 0,
            folio: invoice || 0
        }
        getTickets(data)
    }

    return (
        <div className="tickets">
            <div className="tickets__container">
                <div className="row">
                    <div className="col-8 md-col-12">
                        <Empresas_Sucursales empresaDyn={companies} sucursalDyn={branchOffices} setEmpresaDyn={setCompanies} setSucursalDyn={setBranchOffices} modeUpdate={false} all={true} />
                    </div>
                    <div className='col-4 md-col-12'>
                        <label className='label__general'>Fechas</label>
                        <div className='container_dates__requisition'>
                            <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={date} onChange={handleDateChange} placeholder='seleciona las fechas' />
                        </div>
                    </div>
                    <div className="col-4 md-col-6 sm-col-12">
                        <Select dataSelects={series} instanceId="series" nameSelect={'series'} />
                    </div>
                    <div className="col-4 md-col-6 sm-col-12">
                        <label className='label__general'>Folio</label>
                        <div className='warning__general'><small >Este campo es obligatorio</small></div>
                        <input className={`inputs__general ${warningName ? 'warning' : ''}`} type="text" value={invoice} onChange={(e) => setInvoice(parseInt(e.target.value))} placeholder='Ingresa el folio' />
                    </div>
                    <div className="col-4 md-col-12 d-flex justify-content-center align-items-end">
                        <button className="btn__general-gray" onClick={searchTicket}>Buscar</button>
                        <button className="btn__general-success mx-3" onClick={excel}>Excel</button>
                        <button className="btn__general-orange" onClick={() => setModalTickets('modal-create_ticket')}>Nueva entrada</button>
                        {/* <Select dataSelects={suppliers} instanceId="proveedores"  nameSelect={'Proveedores'}/> */}
                    </div>
                </div>
                <ModalCreate />
                <div className={`overlay__update_tickets ${modalStateUpdate ? 'active' : ''}`}>
                    <div className={`popup__update_tickets ${modalStateUpdate ? 'active' : ''}`}>
                        <a href="#" className="btn-cerrar-popup__update_tickets" onClick={modalCloseUpdate}>
                            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                        </a>
                        <p className='title__modals'>Información de Entrada</p>
                        <ModalUpdate updateTickets={updateTickets} />
                    </div>
                </div>
                <div className='' title='Haz click en un registro para ver su información'>
                    <div className='table__numbers'>
                        <p className='text'>Total de Entradas</p>
                        <div className='quantities_tables'>{tickets?.length || 0}</div>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead className="table__head">
                            <tr className="thead">
                                <th>Folio</th>
                                <th>Fecha</th>
                                <th>Por</th>
                                <th>Empresas</th>
                                <th>Sucursal</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {tickets && tickets.length > 0 ? (
                                tickets.map((ent: any, index: number) => (
                                    <tr className="tbody__container" key={index} onClick={() => modalUpdate(ent)}>
                                        <td>{ent.serie}-{ent.folio}-{ent.anio}</td>
                                        <td>{ent.fecha_creacion}</td>
                                        <td>{ent.usuario_crea}</td>
                                        <td>{ent.empresa}</td>
                                        <td>{ent.sucursal}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={10} style={{ textAlign: "center" }}>
                                        No hay requisiciones disponibles
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Tickets
