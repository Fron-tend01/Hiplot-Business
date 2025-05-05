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
const ITEMS_PER_PAGE = 10;

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
    const descargarPDF = (almacen: any, articulos: any) => {
        const encabezados = ["CODIGO", "DESCRIPCION", "FAMILIA", "PROVEEDOR", "UNIDAD", "UP", "BP", "MIN", "MAX", "TOTAL", "APART.", "DV"];

        let html = `<html><head><title>Inventario Almacén</title></head><body>`;
        html += `<h2>Inventario de Almacén ${almacen.nombre || almacen.id}</h2>`;
        html += `<table border="1" cellspacing="0" cellpadding="5"><thead><tr>`;

        encabezados.forEach(enc => {
            html += `<th>${enc}</th>`;
        });

        html += `</tr></thead><tbody>`;

        articulos.forEach((articulo: any) => {
            html += `<tr>
                <td>${articulo.codigo}</td>
                <td>${articulo.descripcion}</td>
                <td>${articulo.familia}</td>
                <td>${articulo.proveedor}</td>
                <td>${articulo?.unidad_almacen?.nombre || 'N/A'}</td>
                <td>${articulo.ultimas_piezas}</td>
                <td>${articulo.bajo_pedido}</td>
                <td>${articulo.max_min.length > 0 ? articulo.max_min[0].minimo : "0"}</td>
                <td>${articulo.max_min.length > 0 ? articulo.max_min[0].maximo : "0"}</td>
                <td>${articulo.restantes}</td>
                <td>${articulo.apartados}</td>
                <td>${articulo.disponible}</td>
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
                const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
                const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
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

    const actualizarArticulo = (art:any) => {
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

                        }else{
                            Swal.fire('Notificación', resp.mensaje, 'warning');
                        }
                       
                    })
            }
        });
    }
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
                                                {mu ?
                                                    <>
                                                        <th>ACT</th>
                                                        <th>CC</th>
                                                        <th>CT</th>
                                                        <th>DES</th>
                                                        <th>IE</th>
                                                        <th>PL</th>
                                                        <th>VSS</th>
                                                        <th></th>
                                                    </>
                                                    : ''}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(mu ? editableArticulos[almacen.id] || [] : currentArticulos).map((articulo: any, i: number) => (
                                                <tr key={i}>
                                                    <td>{articulo.codigo}</td>
                                                    <td>
                                                        {mu ?
                                                            <input type="text" value={articulo.descripcion} onChange={(e) => {
                                                                const value = e.target.value;
                                                                setEditableArticulos(prev => {
                                                                    const copy = { ...prev };
                                                                    copy[almacen.id][i] = { ...copy[almacen.id][i], descripcion: value };
                                                                    return copy;
                                                                });
                                                            }} />
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
                                                                    <option value="">Selecciona acción</option>
                                                                    <option value={0}>CR</option>
                                                                    <option value={1}>TA</option>
                                                                    <option value={2}>OC</option>
                                                                </select>

                                                                : 'N/A'
                                                            :
                                                            articulo.max_min.length > 0
                                                                ? articulo.max_min[0].accion === 0
                                                                    ? "CR"
                                                                    : articulo.max_min[0].accion === 1
                                                                        ? "TA"
                                                                        : "OC"
                                                                : "NA"
                                                        }
                                                    </td>
                                                    <td>
                                                        {articulo.max_min.length > 0 ?
                                                            mu ?
                                                                <input
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
                                                    <td>{articulo.restantes}</td>
                                                    <td>{articulo.apartados}</td>
                                                    <td>{articulo.disponible}</td>
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
                                                                <button className='btn__general-purple' onClick={()=>actualizarArticulo(articulo)}>Save</button>
                                                            </td>
                                                        </>
                                                        : ''}
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