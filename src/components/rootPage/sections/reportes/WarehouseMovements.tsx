import React, { useEffect, useState } from 'react'
import './styles/WarehouseMovements.css'
import Empresas_Sucursales from '../../Dynamic_Components/Empresas_Sucursales'
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import Flatpickr from "react-flatpickr";
import Select from '../../Dynamic_Components/Select';
import { articleRequests } from '../../../../fuctions/Articles';
import useUserStore from '../../../../zustand/General';
import APIs from '../../../../services/services/APIs';
import { useSelectStore } from '../../../../zustand/Select';

const WarehouseMovements: React.FC = () => {
    const userState = useUserStore(state => state.user);
    const user_id = userState.id;

    const { getArticles }: any = articleRequests();

    const [companies, setCompanies] = useState<any>([])

    const [branchOffices, setBranchOffices] = useState<any>([])
  const selectedIds: any = useSelectStore((state) => state.selectedIds);

    const hoy = new Date();
    const haceUnaSemana = new Date();
    haceUnaSemana.setDate(hoy.getDate() - 7);

    // Inicializa el estado con las fechas formateadas
    const [dates, setDates] = useState([
        haceUnaSemana.toISOString().split('T')[0],
        hoy.toISOString().split('T')[0]
    ]);


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
    
        // const data = {
        //     nombre: '',
        //     id_usuario: user_id,
        //     id_usuario_consulta: user_id,
        //     light: true,
        //     id_sucursal: 0
        // }

        // const resultUsers = await getUsers(data)
        // setUsers({
        //     selectName: 'Vendedores',
        //     options: 'nombre',
        //     dataSelect: resultUsers
        // })

        // const resultSeries = await getSeriesXUser({ tipo_ducumento: 7, id: user_id })

        // setSeries({
        //     selectName: 'Series',
        //     options: 'nombre',
        //     dataSelect: resultSeries
        // })
        // search()
    }


    useEffect(() => {
        fetch()
    }, [])

 
    console.log('selectedIds', selectedIds)

    const [families, setFamilies] = useState<any>([])


    const [inputs, setInputs] = useState({
        codigo: '',
        nombre: ''
    });

    const [articles, setArticles] = useState<any>([])
    const [dataStore, setDataStore] = useState<any>([])
    const searchCode = async () => {
        const data = {
            id: 0,
            activos: true,
            nombre: "",
            codigo: inputs.codigo,
            familia: 0,
            proveedor: 0,
            materia_prima: 99,
            get_sucursales: false,
            get_proveedores: false,
            get_max_mins: false,
            get_plantilla_data: false,
            get_areas_produccion: false,
            get_stock: false,
            coleccion: 0,
            // id_coleccion: isChecked ? dataCollection.id : 0,
            get_web: false,
            get_unidades: false,
            for_vendedor: true,
            page: 1
        };

        const result = await getArticles(data);
        setArticles([...articles, ...result]);
    }

    const searchNama = async () => {
        const data = {
            id: 0,
            activos: true,
            nombre: inputs.nombre,
            codigo: "",
            familia: 0,
            proveedor: 0,
            materia_prima: 99,
            get_sucursales: false,
            get_proveedores: false,
            get_max_mins: false,
            get_plantilla_data: false,
            get_areas_produccion: false,
            get_stock: false,
            coleccion: 0,
            // id_coleccion: isChecked ? dataCollection.id : 0,
            get_web: false,
            get_unidades: false,
            for_vendedor: true,
            page: 1
        };

        const result = await getArticles(data);
        setArticles([...articles, ...result]);
    }

    const addStore = () => {
        setDataStore([...dataStore, selectedIds.store])
    }

    return (
        <div className='warehouse__movements'>
            <div className='warehouse__movements_container'>
                <div className='row__one'>
                    <div>
                        <Empresas_Sucursales update={false} empresaDyn={companies} setEmpresaDyn={setCompanies} sucursalDyn={branchOffices} setSucursalDyn={setBranchOffices} />
                    </div>
                    <div>
                        <label className='label__general'>Fechas</label>
                        <div className='container_dates__requisition'>
                            <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={dates} onChange={handleDateChange} placeholder='seleciona las fechas' />
                        </div>
                    </div>
                </div>
                <div className='row__two'>
                    <div>
                        <div className='input'>
                            <label className='label__general'>Codigo</label>
                            <input className={`inputs__general`} type="text" value={inputs.codigo} onChange={(e) => setInputs({ ...inputs, codigo: e.target.value })} placeholder='Ingresa el folio' />
                        </div>
                        <div className='btn'>
                            <button className='btn__general-primary' onClick={searchCode}>Agregar</button>
                        </div>
                    </div>
                    <div>
                        <div className='input'>
                            <label className='label__general'>Nombre</label>
                            <input className={`inputs__general`} type="text" value={inputs.nombre} onChange={(e) => setInputs({ ...inputs, nombre: e.target.value })} placeholder='Ingresa el folio' />
                        </div>
                        <div className='btn'>
                            <button className='btn__general-primary' onClick={searchNama}>Agregar</button>
                        </div>
                    </div>
                    <div>
                        <Select dataSelects={store} instanceId="store" nameSelect={'Almacén'} />
                        <div className='btn'>
                            <button className='btn__general-primary' onClick={addStore}>Agregar</button>
                        </div>
                    </div>
                </div>
                <div className='row__three'>
                    <div className='table__warehouse-movements'>
                        <div className='table__head'>
                            <div className={`thead `}>
                                <div className='th'>
                                    <p>Artículo</p>
                                </div>
                      
                            </div>
                        </div>

                        <div className='table__body'>
                            <div className='tbody__container'>
                                <div className={`tbody`}>
                                    {articles.map((x: any) => (
                                        <div className='td '>
                                            <p className='article'>{x.codigo}</p>
                                        </div>
                                    ))}
                               

                                </div>
                            </div>


                        </div>

                    </div>
                    <div className='table__warehouse-movements'>
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
                                    {dataStore.map((x: any) => (
                                        <div className='td '>
                                            <p className='article'>{x.nombre}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WarehouseMovements
