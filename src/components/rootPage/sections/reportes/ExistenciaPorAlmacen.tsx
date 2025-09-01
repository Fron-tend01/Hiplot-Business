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
import Swal from 'sweetalert2'

const ExistenciaPorAlmacen: React.FC = () => {
    const userState = useUserStore(state => state.user);
    const user_id = userState.id;
    const modalLoading = storeArticles((state: any) => state.modalLoading);
    const setModalLoading = storeArticles((state: any) => state.setModalLoading);
    const [dataStore, setDataStore] = useState<any>([])
    const [store, setStore] = useState<any>({})
    const selectedIds: any = useSelectStore((state) => state.selectedIds);
    const setSelects: any = useSelectStore((state) => state.setSelectedId);
    const [data, setData] = useState<any>([])
    const [familias, setFamilias] = useState<any>({})
    const [familiaAdded, setFamiliaAdded] = useState<any>([])
    const [proveedores, setProveedores] = useState<any>({})
    const [provAdded, setProvAdded] = useState<any>([])
    const { getFamilies } = FamiliesRequests()
    const { getSuppliers }: any = suppliersRequests();
    const [NoItems, setNoItems] = useState<number>(10)

    const [searcher] = useState<any>({
        nombre: '',
        is_flete: false,
        id_usuario: user_id
    })
    const fetch = async () => {
        let resultFamilies: any = await getFamilies(user_id)
        let response: any = await APIs.getStore(user_id)
        let resprov = await getSuppliers(searcher)
        resultFamilies.unshift({ 'id': 0, 'nombre': 'TODOS' })
        response.unshift({ 'id': 0, 'nombre': 'TODOS' })
        resprov.unshift({ 'id': 0, 'razon_social': 'TODOS' })
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

        setSelects('store', resultFamilies[0])
        setSelects('familia', response[0])
        setSelects('proveedor', resprov[0])
    }

    const addStore = () => {
        if (selectedIds.store.id == 0) {
            setDataStore(store.dataSelect)

        } else {
            setDataStore([...dataStore, selectedIds.store])
        }
    }
    const addFamilia = () => {
        if (selectedIds.familia.id == 0) {
            setFamiliaAdded(familias.dataSelect)
        } else {
            setFamiliaAdded([...familiaAdded, selectedIds.familia])
        }
    }
    const addProveedor = () => {
        if (selectedIds.proveedor.id == 0) {
            setProvAdded(proveedores.dataSelect)

        } else {
            setProvAdded([...provAdded, selectedIds.proveedor])
        }
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
        }).catch(() => {
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
        const encabezados = ["CODIGO", "DESCRIPCION", "FAMILIA", "PROVEEDOR", "UNIDAD", "UP", "BP", "MIN", "MAX", "TOTAL", "APART.", "DV"];
        console.log(articulos);
        const filas = articulos.map((articulo: any) =>
            [articulo.codigo, articulo.descripcion, articulo.familia, articulo.proveedor, articulo?.unidad_almacen?.nombre || 'N/A',
            articulo.ultimas_piezas, articulo.bajo_pedido, articulo.max_min.length > 0 ? articulo.max_min[0].minimo : "0", articulo.max_min.length > 0 ? articulo.max_min[0].maximo : "0",
            articulo.restantes, articulo.apartados, articulo.disponible

            ].join(",")
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
    const fechaActual = new Date().toLocaleString();
    const descargarPDF = (almacen: any, articulos: any) => {
        const encabezados = ["CODIGO", "DESCRIPCION", "PROV", "UNI.", "UP", "BP", "MIN", "MAX", "TOTAL", "APART.", "DV", "NOTAS"];

        let html = `
                <html>
                <head>
                    <title>Inventario Almacén</title>
                    <style>
                        table {
                            font-size: 10px;
                            border-collapse: collapse;
                            font-family: 'Roboto', sans-serif;

                        }
                        th, td {
                            border: 1px solid #000;
                            padding: 5px;
                        }
                        td.descripcion {
                            font-size: 14px;
                            font-weight: bold;
                            max-width: 400px;
                            word-break: break-word;
                        }
                    </style>
                </head>
               
                `;
        html += `<h2>Inventario de Almacén ${almacen.nombre || almacen.id}</h2>`;
        html += `<p><strong>Fecha de impresión:</strong> ${fechaActual}</p>`;

        html += `<table border="1" cellspacing="0" cellpadding="5"><thead><tr>`;

        encabezados.forEach(enc => {
            html += `<th>${enc}</th>`;
        });

        html += `</tr></thead><tbody>`;

        articulos
            .sort((a: any, b: any) => {
                const descA = a.descripcion?.toLowerCase() || '';
                const descB = b.descripcion?.toLowerCase() || '';
                return descA.localeCompare(descB);
            })
            .forEach((articulo: any) => {
                html += `<tr>
          <td>${articulo.codigo}</td>
          <td>${articulo.descripcion}</td>
          <td>${articulo.proveedor == undefined ? '' : articulo.proveedor}</td>
          <td>${articulo?.unidad_almacen?.nombre || 'N/A'}</td>
          <td>${articulo.ultimas_piezas ? 'Si' : 'No'}</td>
          <td>${articulo.bajo_pedido ? 'Si' : 'No'}</td>
          <td>${articulo.max_min.length > 0 ? articulo.max_min[0].minimo : "0"}</td>
          <td>${articulo.max_min.length > 0 ? articulo.max_min[0].maximo : "0"}</td>
          <td>${articulo.restantes}</td>
          <td>${articulo.apartados}</td>
          <td>${articulo.disponible}</td>
          <td><p></p></td>
      </tr>`;
            });


        html += `</tbody></table></body></html>`;

        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print(); // El usuario puede guardar como PDF
            // printWindow.close(); // Descomenta si quieres cerrar automáticamente
        }
    };
    const [mu, setMu] = useState<boolean>(false)
    const [editableArticulos, setEditableArticulos] = useState<{ [key: string]: any[] }>({});
    useEffect(() => {
        if (mu) {
            const initialState: any = {};
            data.forEach((almacen: any) => {
                const searchTerm = searchTerms[almacen.id] || "";
                const filtered = almacen.articulos.filter((articulo: any) =>
                    articulo.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    articulo.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
                );
                const currentPage = pages[almacen.id] || 1;
                const indexOfLastItem = currentPage * NoItems;
                const indexOfFirstItem = indexOfLastItem - NoItems;
                const current = filtered.slice(indexOfFirstItem, indexOfLastItem);
                // initialState[almacen.id] = current.map((a: any) => ({ ...a }));
                initialState[almacen.id] = current.map((a: any) => ({
                    ...a,
                    id_almacen: almacen.id, // 👈 aquí le agregas el ID
                }));
            });
            setEditableArticulos(initialState);
        }
    }, [mu, data, searchTerms, pages]);

    const actualizarArticulo = (art: any) => {
        console.log(art);

        Swal.fire({
            title: "Seguro que deseas ACTUALIZAR el articulo " + art.descripcion + '?',
            text: "Puedes volver a actualizar el articulo si lo deseas.",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            denyButtonText: `Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                await APIs.CreateAny(art, "actualizar_art_x_rep")
                    .then(async (resp: any) => {
                        if (!resp.error) {
                            Swal.fire('Notificación', resp.mensaje, 'success');

                        } else {
                            Swal.fire('Notificación', resp.mensaje, 'warning');
                        }

                    })
            }
        });
    }
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
    const getNestedValue = (obj: any, path: string) => {
        try {
            return path
                .replace(/\?\./g, '.') // elimina opcionales para compatibilidad
                .replace(/\[(\d+)\]/g, '.$1') // convierte [0] en .0
                .split('.') // divide por puntos
                .reduce((acc, part) => acc?.[part], obj); // navega por las propiedades
        } catch {
            return undefined;
        }
    };

    const handleSort = (key: string) => {
        setSortConfig(prev =>
            prev?.key === key && prev.direction === 'asc'
                ? { key, direction: 'desc' }
                : { key, direction: 'asc' }
        );
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
            <div className='row' style={{ zoom: '80%' }}>
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

            <div className='row' style={{ zoom: '80%' }}>
                <div className='col-12'>
                    {data.map((almacen: any) => {
                        const searchTerm = searchTerms[almacen.id] || "";
                        const filteredArticulos = almacen.articulos.filter(
                            (articulo: any) =>
                                articulo.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                articulo.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
                        );
                        const totalPages = Math.ceil(filteredArticulos.length / NoItems);
                        const currentPage = pages[almacen.id] || 1;
                        const indexOfLastItem = currentPage * NoItems;
                        const indexOfFirstItem = indexOfLastItem - NoItems;
                        const currentArticulos = filteredArticulos.slice(indexOfFirstItem, indexOfLastItem);
                        const sortedData = [...(mu ? editableArticulos[almacen.id] || [] : currentArticulos)].sort((a, b) => {
                            if (!sortConfig) return 0;

                            const { key, direction } = sortConfig;
                            const valueA = getNestedValue(a, key);
                            const valueB = getNestedValue(b, key);

                            if (valueA < valueB) return direction === 'asc' ? -1 : 1;
                            if (valueA > valueB) return direction === 'asc' ? 1 : -1;
                            if (valueA == null) return 1;
                            if (valueB == null) return -1;
                            return 0;
                        });
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
                                <button
                                    onClick={() => descargarPDF(almacen, currentArticulos)}
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
                                {!mu ?
                                    <button
                                        onClick={() => setMu(!mu)}
                                        style={{

                                            padding: "5px 10px",
                                            background: "#a76228",
                                            color: "#fff",
                                            border: "none",
                                            cursor: "pointer",
                                            borderRadius: "5px",
                                        }}
                                    >
                                        Actualizar
                                    </button>
                                    :
                                    <button
                                        onClick={() => setMu(!mu)}
                                        style={{
                                            padding: "5px 10px",
                                            background: "##a72828",
                                            color: "#fff",
                                            border: "none",
                                            cursor: "pointer",
                                            borderRadius: "5px",
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                }
                                <select style={{ zoom: '90%' }} value={NoItems} className='inputs__general' onChange={(e) => setNoItems(parseInt(e.target.value) || 10)}>
                                    <option value="10">10</option>
                                    <option value="30">30</option>
                                    <option value="50">50</option>
                                    <option value="9999999">Todas</option>
                                </select>
                                <div className="EPA-table-container">
                                    <table className="EPA-table">
                                        <thead>
                                            <tr>
                                                <th onClick={() => handleSort('codigo')}>
                                                    Código {sortConfig?.key === 'codigo' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                                                </th>
                                                <th onClick={() => handleSort('descripcion')}>
                                                    Desc. {sortConfig?.key === 'descripcion' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                                                </th>
                                                <th onClick={() => handleSort('familia')}>
                                                    Fam. {sortConfig?.key === 'familia' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                                                </th>
                                                <th>Prov.</th>
                                                <th onClick={() => handleSort('unidad_almacen.nombre')}>
                                                    Uni. {sortConfig?.key === 'unidad_almacen.nombre' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                                                </th>
                                                <th onClick={() => handleSort('ultimas_piezas')}>
                                                    UP {sortConfig?.key === 'ultimas_piezas' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                                                </th>
                                                <th onClick={() => handleSort('bajo_pedido')}>
                                                    BP {sortConfig?.key === 'bajo_pedido' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                                                </th>
                                                <th style={{ maxWidth: '100px' }} onClick={() => handleSort('max_min[0]?.accion')}>
                                                    AM {sortConfig?.key === 'max_min[0]?.accion' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                                                </th>
                                                <th onClick={() => handleSort('max_min[0]?.minimo')}>
                                                    Min. {sortConfig?.key === 'max_min[0]?.minimo' && (sortConfig.direction === 'asc' ? '▲' : '▼')}

                                                </th>
                                                <th onClick={() => handleSort('max_min[0]?.maximo')}>
                                                    Max. {sortConfig?.key === 'max_min[0]?.maximo' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                                                </th>
                                                <th onClick={() => handleSort('restantes')}>
                                                    Total {sortConfig?.key === 'restantes' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                                                </th>
                                                <th onClick={() => handleSort('apartados')}>
                                                    Apart. {sortConfig?.key === 'apartados' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                                                </th>
                                                <th onClick={() => handleSort('disponible')}>
                                                    DV {sortConfig?.key === 'disponible' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                                                </th>
                                                {mu ?
                                                    <>
                                                        <th title='ACTIVO'>ACT</th>
                                                        <th title='CONSULTAR COTIZADOR'>CC</th>
                                                        <th title='CONSULTAR TIEMPOS DE ENTREGA'>CT</th>
                                                        <th title='DESABASTO'>DES</th>
                                                        <th title='IVA EXCENTO'>IE</th>
                                                        <th title='PRECIO LIBRE'>PL</th>
                                                        <th title='VENDER SIN STOCK'>VSS</th>
                                                        <th title='VISUALIZACION WEB'>VW</th>
                                                        <th></th>
                                                    </>
                                                    : ''}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(mu ? editableArticulos[almacen.id] || [] : sortedData).map((articulo: any, i: number) => (
                                                <tr key={i}>
                                                    <td>{articulo.codigo}</td>
                                                    <td  >
                                                        {mu ?
                                                            <textarea style={{ width: '240px' }} rows={2} value={articulo.descripcion} onChange={(e) => {
                                                                const value = e.target.value;
                                                                setEditableArticulos(prev => {
                                                                    const copy = { ...prev };
                                                                    copy[almacen.id][i] = { ...copy[almacen.id][i], descripcion: value };
                                                                    return copy;
                                                                });
                                                            }} ></textarea>
                                                            :
                                                            articulo.descripcion
                                                        }
                                                    </td>
                                                    <td>{articulo.familia}</td>
                                                    <td>{articulo.proveedor}</td>
                                                    <td>{articulo.unidad_almacen?.nombre}</td>
                                                    <td>
                                                        {mu ?
                                                            <input type="checkbox" checked={articulo.ultimas_piezas} onChange={(e) => {
                                                                const value = e.target.checked;
                                                                setEditableArticulos(prev => {
                                                                    const copy = { ...prev };
                                                                    copy[almacen.id][i] = { ...copy[almacen.id][i], ultimas_piezas: value };
                                                                    return copy;
                                                                });
                                                            }} />
                                                            :
                                                            articulo.ultimas_piezas ? "Sí" : "No"
                                                        }
                                                    </td>
                                                    <td>

                                                        {mu ?
                                                            <input type="checkbox" checked={articulo.bajo_pedido} onChange={(e) => {
                                                                const value = e.target.checked;
                                                                setEditableArticulos(prev => {
                                                                    const copy = { ...prev };
                                                                    copy[almacen.id][i] = { ...copy[almacen.id][i], bajo_pedido: value };
                                                                    return copy;
                                                                });
                                                            }} />
                                                            : articulo.bajo_pedido ? "Sí" : "No"}
                                                    </td>
                                                    <td>
                                                        {mu ?
                                                            articulo.max_min.length > 0 ?
                                                                <select
                                                                    value={articulo.max_min[0]?.accion ?? ""}
                                                                    onChange={(e) => {
                                                                        const selectedAccion = parseInt(e.target.value, 10);
                                                                        setEditableArticulos(prev => {
                                                                            const copy = { ...prev };
                                                                            const updatedArticulo = { ...copy[almacen.id][i] };

                                                                            if (updatedArticulo.max_min && updatedArticulo.max_min.length > 0) {
                                                                                updatedArticulo.max_min[0] = {
                                                                                    ...updatedArticulo.max_min[0],
                                                                                    accion: selectedAccion,
                                                                                };
                                                                            } else {
                                                                                updatedArticulo.max_min = [{ accion: selectedAccion }];
                                                                            }

                                                                            copy[almacen.id][i] = updatedArticulo;
                                                                            return copy;
                                                                        });
                                                                    }}
                                                                >
                                                                    <option value={0}>N/A</option>
                                                                    <option value={1}>CR</option>
                                                                    <option value={2}>TA</option>
                                                                    <option value={3}>OC</option>
                                                                </select>

                                                                : 'N/A'
                                                            :
                                                            Array.isArray(articulo.max_min) && articulo.max_min.length > 0
                                                                ? articulo.max_min[0].accion === 1
                                                                    ? "CR"
                                                                    : articulo.max_min[0].accion === 2
                                                                        ? "TA"
                                                                        : articulo.max_min[0].accion === 3
                                                                            ? "OC"
                                                                            : "N/A"
                                                                : "NA"
                                                        }
                                                    </td>
                                                    <td>
                                                        {articulo.max_min.length > 0 ?
                                                            mu ?
                                                                <input
                                                                    style={{ width: '55px' }}
                                                                    type="number"
                                                                    value={articulo.max_min[0].minimo}
                                                                    onChange={(e) => {
                                                                        const newValue = parseFloat(e.target.value);
                                                                        setEditableArticulos(prev => {
                                                                            const copy = { ...prev };
                                                                            const updatedArticulo = { ...copy[almacen.id][i] };

                                                                            updatedArticulo.max_min[0] = {
                                                                                ...updatedArticulo.max_min[0],
                                                                                minimo: isNaN(newValue) ? 0 : newValue,
                                                                            };

                                                                            copy[almacen.id][i] = updatedArticulo;
                                                                            return copy;
                                                                        });
                                                                    }}
                                                                />
                                                                : articulo.max_min[0].minimo

                                                            : "0"}</td>
                                                    <td>
                                                        {articulo.max_min.length > 0 ?
                                                            mu ?
                                                                <input
                                                                    style={{ width: '55px' }}
                                                                    type="number"
                                                                    value={articulo.max_min[0].maximo}
                                                                    onChange={(e) => {
                                                                        const newValue = parseFloat(e.target.value);
                                                                        setEditableArticulos(prev => {
                                                                            const copy = { ...prev };
                                                                            const updatedArticulo = { ...copy[almacen.id][i] };

                                                                            updatedArticulo.max_min[0] = {
                                                                                ...updatedArticulo.max_min[0],
                                                                                maximo: isNaN(newValue) ? 0 : newValue,
                                                                            };

                                                                            copy[almacen.id][i] = updatedArticulo;
                                                                            return copy;
                                                                        });
                                                                    }}
                                                                />
                                                                : articulo.max_min[0].maximo

                                                            : "0"}</td>
                                                    <td>{parseFloat(articulo.restantes).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td>
                                                    <td>{parseFloat(articulo.apartados).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td>
                                                    <td>{parseFloat(articulo.disponible).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td>
                                                    {mu ?
                                                        <>
                                                            <td>
                                                                <input type="checkbox" checked={articulo.activo} onChange={(e) => {
                                                                    const value = e.target.checked;
                                                                    setEditableArticulos(prev => {
                                                                        const copy = { ...prev };
                                                                        copy[almacen.id][i] = { ...copy[almacen.id][i], activo: value };
                                                                        return copy;
                                                                    });
                                                                }} />
                                                            </td>
                                                            <td>
                                                                <input type="checkbox" checked={articulo.consultar_cotizador} onChange={(e) => {
                                                                    const value = e.target.checked;
                                                                    setEditableArticulos(prev => {
                                                                        const copy = { ...prev };
                                                                        copy[almacen.id][i] = { ...copy[almacen.id][i], consultar_cotizador: value };
                                                                        return copy;
                                                                    });
                                                                }} />
                                                            </td>
                                                            <td>
                                                                <input type="checkbox" checked={articulo.consultar_te} onChange={(e) => {
                                                                    const value = e.target.checked;
                                                                    setEditableArticulos(prev => {
                                                                        const copy = { ...prev };
                                                                        copy[almacen.id][i] = { ...copy[almacen.id][i], consultar_te: value };
                                                                        return copy;
                                                                    });
                                                                }} />
                                                            </td>
                                                            <td>
                                                                <input type="checkbox" checked={articulo.desabasto} onChange={(e) => {
                                                                    const value = e.target.checked;
                                                                    setEditableArticulos(prev => {
                                                                        const copy = { ...prev };
                                                                        copy[almacen.id][i] = { ...copy[almacen.id][i], desabasto: value };
                                                                        return copy;
                                                                    });
                                                                }} />
                                                            </td>
                                                            <td>
                                                                <input type="checkbox" checked={articulo.iva_excento} onChange={(e) => {
                                                                    const value = e.target.checked;
                                                                    setEditableArticulos(prev => {
                                                                        const copy = { ...prev };
                                                                        copy[almacen.id][i] = { ...copy[almacen.id][i], iva_excento: value };
                                                                        return copy;
                                                                    });
                                                                }} />
                                                            </td>
                                                            <td>
                                                                <input type="checkbox" checked={articulo.precio_libre} onChange={(e) => {
                                                                    const value = e.target.checked;
                                                                    setEditableArticulos(prev => {
                                                                        const copy = { ...prev };
                                                                        copy[almacen.id][i] = { ...copy[almacen.id][i], precio_libre: value };
                                                                        return copy;
                                                                    });
                                                                }} />
                                                            </td>
                                                            <td>
                                                                <input type="checkbox" checked={articulo.vender_sin_stock} onChange={(e) => {
                                                                    const value = e.target.checked;
                                                                    setEditableArticulos(prev => {
                                                                        const copy = { ...prev };
                                                                        copy[almacen.id][i] = { ...copy[almacen.id][i], vender_sin_stock: value };
                                                                        return copy;
                                                                    });
                                                                }} />
                                                            </td>
                                                            <td>
                                                                <input type="checkbox" checked={articulo.visualizacion_web} onChange={(e) => {
                                                                    const value = e.target.checked;
                                                                    setEditableArticulos(prev => {
                                                                        const copy = { ...prev };
                                                                        copy[almacen.id][i] = { ...copy[almacen.id][i], visualizacion_web: value };
                                                                        return copy;
                                                                    });
                                                                }} />
                                                            </td>
                                                            <td>
                                                                <button className='btn__general-purple' onClick={() => actualizarArticulo(articulo)}>Save</button>
                                                            </td>
                                                        </>
                                                        : ''}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Controles de paginación */}
                                {filteredArticulos.length > NoItems && (
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