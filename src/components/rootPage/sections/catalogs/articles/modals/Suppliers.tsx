import React, { useEffect, useState } from 'react';
import { storeSuppliers } from '../../../../../../zustand/Suppliers';
import useUserStore from '../../../../../../zustand/General';
import { storeArticles } from '../../../../../../zustand/Articles';
import { useStore } from 'zustand';
import './style/Suppliers.css'
import DynamicVariables from '../../../../../../utils/DynamicVariables';

const Suppliers: React.FC = () => {


    const [selectPriorities, setselectPriorities] = useState<boolean>(false)
    const [selectedPriority, setSelectedPriority] = useState<any>(null)
    const [selectSuppliers, setSlectSuppliers] = useState<boolean>(false)
    const [selectedSupplier, setSelectedSupplier] = useState<any>(null)

    const { articleByOne, deleteSuppliers }: any = useStore(storeArticles);
    const { setModalStateSuppliers, setSuppliers, suppliers } = useStore(storeArticles);

    const setDeleteSuppliers = storeArticles(state => state.setDeleteSuppliers)


    const { getSuppliers }: any = storeSuppliers()

    const [dataSuppliers, setDataSuppliers] = useState<any>([])
    const [suppliersSearch] = useState<any>([])

    const getData = async () => {
        const data = {
            nombre: '',
            is_flete: false,
            id_usuario: user_id
        }
        const result = await getSuppliers(data);
        await setDataSuppliers(result)
    }

    useEffect(() => {
        if (articleByOne.proveedores) {
            setSuppliers(articleByOne.proveedores)
        }
    }, [])

    useEffect(() => {
        getData()

        //  Es para el update

    }, [articleByOne])


    const userState = useUserStore(state => state.user);
    const user_id = userState.id
    const [containerSearch, setContainerSearch] = useState<any>('')


    const priority = [
        {
            id: 1,
            name: 'Sin urgencia'
        },
        {
            id: 2,
            name: 'Urgencia'
        },

    ]


    const handleSearchEngineValueChange = () => {

        setContainerSearch('')
    }

    const addSuppliers = () => {
        const dataSuppliers = {
            id_proveedor: selectedSupplier.id,
            nombre_alterno: selectedCommercialName,
            prioridad: suppliers.length + 1,
            proveedor: selectedSupplier.nombre_comercial
        }  
        setSuppliers([...suppliers, dataSuppliers])
    }



    const deleteSupplier = (suplier: any) => {
        const updatedDeleteSuppliers = suppliers.filter((item: any) => item.id !== suplier.id);
        setSuppliers(updatedDeleteSuppliers);
        setDeleteSuppliers([...deleteSuppliers, suplier.id])
    };


    const [selectedCommercialName] = useState<string>('')




    /////////////////////////////////////FALTA VALIDAR QUE SI NO SE SELECIONA UNA PRIORIDAD QUE SE META SOLITO LA NORMAL/////////////////////////////////////////
    const handleSuppliersChange = (supplier: any) => {
        setSelectedSupplier(supplier)
        setSlectSuppliers(false)
    }

    const openSelectSuppliers = () => {
        setSlectSuppliers(!selectSuppliers)
    }

    const closeModal = () => {
        setModalStateSuppliers('')
    }

    const openSelectPriority = () => {
        setselectPriorities(!selectPriorities)
    }

    const handlePriorityChange = (priority: any) => {
        setSelectedPriority(priority)
        setselectPriorities(false)
    }

    const [searcher, setSearcher] = useState<any>({
        nombre: '',
        is_flete: false,
        id_usuario: user_id
    })

    const search = async () => {
        const result = await getSuppliers(searcher)
        setDataSuppliers(result)
    }


    // Guardar el índice del elemento que se empieza a arrastrar
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.dataTransfer.setData("dragIndex", index.toString());
    };

    // Permitir soltar en el contenedor
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    // Cuando sueltas, reordena el array
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
        const dragIndex = parseInt(e.dataTransfer.getData("dragIndex"), 10);
        if (isNaN(dragIndex)) return;

        const reordered = [...suppliers];
        const [movedItem] = reordered.splice(dragIndex, 1);
        reordered.splice(dropIndex, 0, movedItem);

        // Actualizar prioridad (posición en la lista)
        const updated = reordered.map((item, i) => ({
            ...item,
            prioridad: i +1
        }));

        setSuppliers(updated);
    };
    return (
        <div>
            <a href="#" className="btn-cerrar-popup__modal_suppliers_creating_articles" onClick={closeModal}>
                <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
            </a>
            <p className='title__modals'>Proveedores</p>
            <div className='article__modal_save_modal_suppliers_container'>
                <div className='row__one'>
                    <div className='container__inputs_general'>
                        <label className='label__general'>Nombre</label>
                        <div className='inputs__general_icons-not' id="search-icon" >
                            {/* <svg className='serch' xmlns="http://www.w3.org/2000/svg" width='20' viewBox="0 0 512 512">
                                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                            </svg> */}
                            <div className='col-8 md-col-6 sm-col-12'>
                                <input placeholder="Buscador" type="text" className='inputs__general'
                                    value={searcher.nombre} onChange={(e) => DynamicVariables.updateAnyVar(setSearcher, "nombre", e.target.value)}
                                    onKeyUp={(event) => event.key === 'Enter' && search()} />
                            </div>
                        </div>
                        <div className={`search-result ${containerSearch.length > 0 ? 'active' : ''}`}>
                            <ul className={`options ${containerSearch.length > 0 ? 'active' : ''}`} style={{ opacity: containerSearch.length > 0 ? '1' : '0' }}>
                                {suppliersSearch && suppliersSearch.map((item: any, index: number) => (
                                    <li key={index} onClick={() => handleSearchEngineValueChange()}>
                                        {item.razon_social}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className='select__container'>
                        <label className='label__general'>Proveedores</label>
                        <div className='select-btn__general'>
                            <div className={`select-btn ${selectSuppliers ? 'active' : ''}`} onClick={openSelectSuppliers}>
                                <p>{selectedSupplier ? dataSuppliers.find((s: any) => s.id === selectedSupplier.id)?.razon_social : 'Selecciona'}</p>
                                <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                            </div>
                            <div className={`content ${selectSuppliers ? 'active' : ''}`} >
                                <ul className={`options ${selectSuppliers ? 'active' : ''}`} style={{ opacity: selectSuppliers ? '1' : '0' }}>
                                    {dataSuppliers && dataSuppliers.map((supplier: any) => (
                                        <li key={supplier.id} onClick={() => handleSuppliersChange(supplier)}>
                                            {supplier.razon_social}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button className='btn__general-purple' type='button' onClick={addSuppliers}>Agregar</button>
                    </div>
                </div>
                <div>
                    <div className='table__suppliers' >
                        <div>
                            <div>
                                {suppliers ? (
                                    <div className='table__numbers'>
                                        <p className='text'>Total de proveedores</p>
                                        <div className='quantities_tables'>{suppliers?.length}</div>
                                    </div>
                                ) : (
                                    <p>No hay empresas</p>
                                )}
                            </div>
                            <div className='table__head'>
                                <div className='thead'>
                                    <div className='th'>
                                        <p className=''>Prioridad</p>
                                    </div>
                                    <div className='th'>
                                        <p className=''>Nombre</p>
                                    </div>
                                </div>
                            </div>
                            {suppliers?.length > 0 ? (
                                <div className="table__body" title='Arrastra y suelta para cambiar la prioridad de los proveedores'>
                                    {suppliers.map((item: any, i: number) => (
                                        <div
                                            key={item.id}
                                            className="tbody__container"
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, i)}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, i)}
                                        >
                                            <div className="tbody">
                                                <div className="td">{i + 1}</div>
                                                <div className="td">{item.proveedor}</div>
                                                <div className="td">
                                                    <button
                                                        className="btn__delete_users"
                                                        type="button"
                                                        onClick={() => deleteSupplier(item)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text">No hay proveedores agregados</p>
                            )}
                        </div>
                    </div>
                </div>
                {/* <div className='create__company_btns-container'>
                    <div>
                        <input className='btn__general-purple' type='button' value="Guardar " />
                    </div>
                </div> */}
            </div>
        </div>

    )
}

export default Suppliers
