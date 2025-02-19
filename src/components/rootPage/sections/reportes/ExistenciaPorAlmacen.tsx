import React, { useEffect, useState } from 'react'
import './styles/ExistenciaPorAlmacen.css'
import APIs from '../../../../services/services/APIs'
import DynamicVariables from '../../../../utils/DynamicVariables'
import useUserStore from '../../../../zustand/General'
import Select from '../../Dynamic_Components/Select'
import { useSelectStore } from '../../../../zustand/Select'
import { storeArticles } from '../../../../zustand/Articles'
import { FamiliesRequests } from '../../../../fuctions/Families'
import { suppliersRequests } from '../../../../fuctions/Suppliers'
import LoadingInfo from '../../../loading/LoadingInfo'
const ITEMS_PER_PAGE = 10;

const ExistenciaPorAlmacen: React.FC = () => {
    const userState = useUserStore(state => state.user);
    const user_id = userState.id;
    const modalLoading = storeArticles((state: any) => state.modalLoading);
    const setModalLoading = storeArticles((state: any) => state.setModalLoading);
    const [dataStore, setDataStore] = useState<any>([])
    const [store, setStore] = useState<any>({})
    const selectedIds: any = useSelectStore((state) => state.selectedIds);
    const [data, setData] = useState<any>([])
    const [familias, setFamilias] = useState<any>({})
    const [familiaAdded, setFamiliaAdded] = useState<any>([])
    const [proveedores, setProveedores] = useState<any>({})
    const [provAdded, setProvAdded] = useState<any>([])
    const { getFamilies } = FamiliesRequests()
    const { getSuppliers }: any = suppliersRequests();

    const [searcher] = useState<any>({
        nombre: '',
        is_flete: false,
        id_usuario: user_id
    })
    const fetch = async () => {
        const resultFamilies: any = await getFamilies(user_id)
        let response = await APIs.getStore(user_id)
        const resprov = await getSuppliers(searcher)

        setStore({
            selectName: 'Almacen',
            options: 'nombre',
            dataSelect: response
        })
        setFamilias({
            selectName: 'Familia',
            options: 'nombre',
            dataSelect: resultFamilies
        })
        setProveedores({
            selectName: 'Proveedor',
            options: 'razon_social',
            dataSelect: resprov
        })
    }

    const addStore = () => {
        setDataStore([...dataStore, selectedIds.store])
    }
    const addFamilia = () => {
        setFamiliaAdded([...familiaAdded, selectedIds.familia])
    }
    const addProveedor = () => {
        setProvAdded([...provAdded, selectedIds.proveedor])
    }
    useEffect(() => {
        fetch()
    }, [])
    const generarReporte = async () => {
        let data = {
            'almacenes': dataStore,
            'ids_familias': familiaAdded.map((x: any) => x.id),
            'ids_provs': provAdded.map((x: any) => x.id)
        }
        setModalLoading(true)
        await APIs.CreateAny(data, 'reporte_existencia_por_alm').then((resp: any) => {
            setModalLoading(false)

            setData(resp)
        }).catch(()=> {
            setModalLoading(false)
        })
    }
    // Estado para almacenar la página actual de cada almacén
    const [pages, setPages] = useState<{ [key: number]: number }>(
        Object.fromEntries(dataStore.map((almacen: any) => [almacen.id, 1]))
    );

    // Función para cambiar la página de un almacén en particular
    const changePage = (almacenId: number, newPage: number) => {
        setPages((prev) => ({
            ...prev,
            [almacenId]: newPage,
        }));
    };
    const [searchTerms, setSearchTerms] = useState<{ [key: number]: string }>(
        Object.fromEntries(data.map((almacen: any) => [almacen.id, ""]))
    );
    const handleSearchChange = (almacenId: number, value: string) => {
        setSearchTerms((prev) => ({
            ...prev,
            [almacenId]: value,
        }));
        setPages((prev) => ({
            ...prev,
            [almacenId]: 1, // Reiniciar a la primera página al buscar
        }));
    };
    const descargarCSV = (almacen: any, articulos: any) => {
        const encabezados = ["ID", "Código", "Descripción", "Familia", "Disponible"];
        const filas = articulos.map((articulo: any) =>
            [articulo.id, articulo.codigo, articulo.descripcion, articulo.familia, articulo.disponible].join(",")
        );

        const csvContenido = [encabezados.join(","), ...filas].join("\n");
        const blob = new Blob([csvContenido], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `almacen_${almacen.id}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const descargarTodaData = (almacen: any) => {
        descargarCSV(almacen, almacen.articulos);
    };
    return (
        <div style={{ padding: '20px', overflow: 'auto' }}>
            <div className='breadcrumbs'>
                <div className='breadcrumbs__container'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-receipt"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 17.5v-11" /></svg>
                    <small className='title'>REPORTES</small>
                </div>
                <div className='chevron__breadcrumbs'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6" /></svg>
                </div>
                <div className='breadcrumbs__container'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></svg>
                    <small className='title'>EXISTENCIAS POR ALMACEN</small>
                </div>
            </div>
            <div className='row'>
                <div className='col-4 '>
                    <div className='row mr-5'>
                        <div className='col-10 '>
                            <Select dataSelects={store} instanceId="store" nameSelect={'Agregar Almacen'} />

                        </div>
                        <div className='col-2 mt-3'>
                            <button className='btn__general-primary' onClick={addStore}>Add+ Almacen</button>

                        </div>
                        <div className='col-12 table_EPA'>
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
                </div>
                <div className='col-4 '>
                    <div className='row mr-5'>
                        <div className='col-10 '>
                            <Select dataSelects={familias} instanceId="familia" nameSelect={'Agregar Familia'} />

                        </div>
                        <div className='col-2 mt-3'>
                            <button className='btn__general-primary' onClick={addFamilia}>Add+ Familia</button>

                        </div>
                        <div className='col-12 table_EPA'>
                            <div className='table__head'>
                                <div className={`thead `}>
                                    <div className='th'>
                                        <p>Familias</p>
                                    </div>
                                </div>
                            </div>
                            <div className='table__body'>
                                <div className='tbody__container'>
                                    <div className={`tbody`}>
                                        {familiaAdded?.map((x: any, index: number) => (
                                            <>
                                                <div className='td '>
                                                    <p className='article'>{x.nombre}</p>
                                                </div>
                                                <div className='td'>
                                                    <div className='delete-icon' onClick={() => {
                                                        DynamicVariables.removeObjectInArray(setFamiliaAdded, index);
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
                </div>
                <div className='col-4 '>
                    <div className='row mr-5'>
                        <div className='col-10 '>
                            <Select dataSelects={proveedores} instanceId="proveedor" nameSelect={'Agregar Proveedor'} />

                        </div>
                        <div className='col-2 mt-3'>
                            <button className='btn__general-primary' onClick={addProveedor}>Add+ Proveedor</button>

                        </div>
                        <div className='col-12 table_EPA'>
                            <div className='table__head'>
                                <div className={`thead `}>
                                    <div className='th'>
                                        <p>Proveedores</p>
                                    </div>
                                </div>
                            </div>
                            <div className='table__body'>
                                <div className='tbody__container'>
                                    <div className={`tbody`}>
                                        {provAdded?.map((x: any, index: number) => (
                                            <>
                                                <div className='td '>
                                                    <p className='article'>{x.razon_social}</p>
                                                </div>
                                                <div className='td'>
                                                    <div className='delete-icon' onClick={() => {
                                                        DynamicVariables.removeObjectInArray(setProvAdded, index);
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
                </div>
            </div>
            <div className='row text-center mt-4'>
                <div className='col-12'>
                    <button className='btn__general-purple' onClick={generarReporte}>Generar Reporte</button>
                </div>
            </div>

            <div className='row'>
                <div className='col-12'>
                    {data.map((almacen: any) => {
                        const searchTerm = searchTerms[almacen.id] || "";
                        const filteredArticulos = almacen.articulos.filter(
                            (articulo: any) =>
                                articulo.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                articulo.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
                        );
                        const totalPages = Math.ceil(filteredArticulos.length / ITEMS_PER_PAGE);
                        const currentPage = pages[almacen.id] || 1;
                        const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
                        const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
                        const currentArticulos = filteredArticulos.slice(indexOfFirstItem, indexOfLastItem);

                        return (
                            <div key={almacen.id} style={{ marginBottom: "20px", border: "1px solid #ddd", padding: "10px" }}>
                                <h2>{almacen.nombre}</h2>
                                <input
                                    type="text"
                                    placeholder="Buscar por código o descripción..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearchChange(almacen.id, e.target.value)}
                                    style={{ marginBottom: "10px", padding: "5px", width: "50%" }}
                                />
                                <button
                                    onClick={() => descargarCSV(almacen, currentArticulos)}
                                    style={{

                                        padding: "5px 10px",
                                        background: "#007bff",
                                        color: "#fff",
                                        border: "none",
                                        cursor: "pointer",
                                        borderRadius: "5px",
                                    }}
                                >
                                    📥 Descargar CSV
                                </button>
                                <button
                                    onClick={() => descargarTodaData(almacen)}
                                    style={{

                                        padding: "5px 10px",
                                        background: "#28a745",
                                        color: "#fff",
                                        border: "none",
                                        cursor: "pointer",
                                        borderRadius: "5px",
                                    }}
                                >
                                    📤 Descargar Todo
                                </button>
                                <div className="EPA-table-container">
                                    <table className="EPA-table">
                                        <thead>
                                            <tr>
                                                <th>Código</th>
                                                <th>Desc.</th>
                                                <th>Fam.</th>
                                                <th>Prov.</th>
                                                <th>Uni.</th>
                                                <th>UP</th>
                                                <th>BP</th>
                                                <th>AM</th>
                                                <th>Min.</th>
                                                <th>Max.</th>
                                                <th>Total</th>
                                                <th>Apart.</th>
                                                <th>DV</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentArticulos.map((articulo: any, i: number) => (
                                                <tr key={i}>
                                                    <td>{articulo.codigo}</td>
                                                    <td>{articulo.descripcion}</td>
                                                    <td>{articulo.familia}</td>
                                                    <td>{articulo.familia}</td>
                                                    <td>{articulo.unidad_almacen?.nombre}</td>
                                                    <td>{articulo.ultimas_piezas ? "Sí" : "No"}</td>
                                                    <td>{articulo.bajo_pedido ? "Sí" : "No"}</td>
                                                    <td>
                                                        {articulo.max_min.length > 0
                                                            ? articulo.max_min[0].accion === 0
                                                                ? "CR"
                                                                : articulo.max_min[0].accion === 1
                                                                    ? "TA"
                                                                    : "OC"
                                                            : "NA"}
                                                    </td>
                                                    <td>{articulo.max_min.length > 0 ? articulo.max_min[0].minimo : "0"}</td>
                                                    <td>{articulo.max_min.length > 0 ? articulo.max_min[0].maximo : "0"}</td>
                                                    <td>{articulo.restantes}</td>
                                                    <td>{articulo.apartados}</td>
                                                    <td>{articulo.disponible}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Controles de paginación */}
                                {filteredArticulos.length > ITEMS_PER_PAGE && (
                                    <div style={{ marginTop: "10px" }}>
                                        <button onClick={() => changePage(almacen.id, currentPage - 1)} disabled={currentPage === 1}>
                                            Anterior
                                        </button>
                                        <span>
                                            Página {currentPage} de {totalPages}
                                        </span>
                                        <button
                                            onClick={() => changePage(almacen.id, currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            Siguiente
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            {
                modalLoading == true ? (
                    <LoadingInfo />
                ) :
                    ''
            }
        </div>
    )
}
export default ExistenciaPorAlmacen