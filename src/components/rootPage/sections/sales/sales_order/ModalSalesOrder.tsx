import React, { useEffect, useState } from 'react'
import { storeSaleOrder } from '../../../../../zustand/SalesOrder'
import { useStore } from 'zustand'
import './ModalSaleOrder.css'
import Empresas_Sucursales from '../../../Dynamic_Components/Empresas_Sucursales'
import Select from '../../../Dynamic_Components/Select'
import Flatpickr from "react-flatpickr";
import ArticleViewModal from '../ArticleViewModal'
import { storeArticleView } from '../../../../../zustand/ArticleView'
import APIs from '../../../../../services/services/APIs'
import useUserStore from '../../../../../zustand/General'
import { ClientsRequests } from '../../../../../fuctions/Clients'
import { useSelectStore } from '../../../../../zustand/Select'
import Personalized from '../Personalized'
import { storePersonalized } from '../../../../../zustand/Personalized'
import Swal from 'sweetalert2';

const ModalSalesOrder: React.FC = () => {
    const userState = useUserStore(state => state.user);
    let user_id = userState.id

    const setPersonalizedModal = storePersonalized(state => state.setPersonalizedModal)

    const setModalArticleView = storeArticleView(state => state.setModalArticleView)
    const selectedIds: any = useSelectStore((state) => state.selectedIds);


    const setNormalConcepts = storePersonalized((state) => state.setNormalConcepts);

    const setCustomData = storePersonalized((state) => state.setCustomData);

    const setDataUpdate = storePersonalized((state) => state.setDataUpdate);

    const { normalConcepts, customConcepts }: any = useStore(storePersonalized)

    const setDataSaleOrder = storeSaleOrder((state) => state.setDataSaleOrder);

    const [companies, setCompanies] = useState<any>([])

    const [branchOffices, setBranchOffices] = useState<any>([])

    const { getClients }: any = ClientsRequests()

    const { saleOrdersToUpdate }: any = useStore(storeSaleOrder);

    const setModalSalesOrder = storeSaleOrder(state => state.setModalSalesOrder)
    const { modalSalesOrder }: any = useStore(storeSaleOrder)

    


    const [clients, setClients] = useState<any>()


    const [searCustomer, setSearchCustomer] = useState<any>('')


    const [title, setTitle] = useState<string>('')


    ////////////////////////
    /// Fechas
    ////////////////////////



    // Inicializa el estado con la fecha y hora formateadas
    const [dates, setDates] = useState(["", ""]); // Asegúrate de que el array tenga siempre dos elementos.

    const handleDateChange = (fechasSeleccionadas: Date[], index: number) => {
        const updatedDates = [...dates]; // Clonar el estado actual

        // Actualizar solo el índice correspondiente
        updatedDates[index] =
            fechasSeleccionadas[0]
                ?.toISOString()
                .split("T")
                .join(" ")
                .slice(0, 16) || ""; // Formatear la fecha seleccionada o asignar ""

        setDates(updatedDates.slice(0, 2)); // Garantizar que el estado tenga solo dos elementos
    };



    useEffect(() => {
        if (saleOrdersToUpdate) {

            setDataSaleOrder(saleOrdersToUpdate?.conceptos)
        }
    }, [dates, saleOrdersToUpdate])

    const handleCreateSaleOrder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Enviando orden de venta...");

        let filter = normalConcepts.filter((x: any) => x.personalized == false)

        let [datePartOne, timePartOne] = dates[0].split(" ");
        let [datePartTwo, timePartTwo] = dates[1].split(" ");

        let data = {
            id_sucursal: branchOffices.id,
            id_cliente: selectedIds.clients.id,
            id_usuario_crea: user_id,
            status: 0,
            titulo: title,
            hora_entrega_produccion: timePartOne,
            fecha_entrega_produccion: datePartOne,
            hora_entrega_cliente: timePartTwo,
            fecha_entrega_cliente: datePartTwo,
            conceptos: filter,
            conceptos_personalizados: [],
            conceptos_elim: []
        };

        console.log("Datos que se envían:", data);

        try {
            let result: any = await APIs.createSaleOrder(data);
            if(result.error == true) {
                return Swal.fire('Advertencia', result.mensaje, 'warning');
            } else {
                Swal.fire('Orden de compra creada exitosamente', result.mensaje, 'success');
            }
            
        } catch (error) {
            console.error("Error al crear la orden de compra:", error);
            Swal.fire('Hubo un error al crear la orden de compra', '', 'error');
        }
    }

    console.log(dates)

    const searchClients = async () => {
        let data = {
            id_sucursal: branchOffices.id,
            id_usuario: user_id,
            nombre: searCustomer
        }
        let result = await getClients(data)
        setClients({
            selectName: 'Cliente',
            options: 'razon_social',
            dataSelect: result
        })
    }


    const modalSeeConcepts = (article: any) => {
        setPersonalizedModal('personalized_modal-quotation-update')
        setDataUpdate(article)
    }

    const undoConcepts = (article: any, i: number) => {
        let filter = customConcepts.filter((_: any, index: number) => index !== i)
        let data = [...filter, ...article.conceptos]
        setNormalConcepts(data)
        setCustomData([...customConcepts, ...article.conceptos]);
    }


    const deleteArticle = (_: any, i: number) => {
        let filter = normalConcepts.filter((_: any, index: number) => index !== i)
        setNormalConcepts(filter)
        setCustomData(filter);
    }

    const [permisoDescount] = useState<boolean>(true)


    return (
        <div className={`overlay__sale-order__modal_articles ${modalSalesOrder == 'sale-order__modal' ? 'active' : ''}`}>
            <div className={`popup__sale-order__modal_articles ${modalSalesOrder == 'sale-order__modal' ? 'active' : ''}`}>
                <div className='header__modal'>
                    <a href="#" className="btn-cerrar-popup__sale-order__modal_articles" onClick={() => setModalSalesOrder('')} >
                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                    </a>
                    <p className='title__modals'>Orden de venta</p>
                </div>
                <div className='row'>
                    <div className='col-12'>
                        <Empresas_Sucursales update={false} empresaDyn={companies} setEmpresaDyn={setCompanies} sucursalDyn={branchOffices} setSucursalDyn={setBranchOffices} />
                    </div>
                </div>
                <form onSubmit={handleCreateSaleOrder}>
                    <div className='row'>
                        <div className='col-3'>
                            <label className='label__general'>Buscar</label>
                            <input className='inputs__general' type="text" value={searCustomer} onChange={(e) => setSearchCustomer(e.target.value)} placeholder='Ingresa el contacto' />
                        </div>
                        <div className='col-4'>
                            <Select dataSelects={clients} instanceId='clients' nameSelect={'Clientes'} />
                        </div>
                        <div className='col-2 d-flex align-items-end'>
                            <div>
                                <button type='button' className='btn__general-purple' onClick={searchClients}>Buscar</button>
                            </div>
                        </div>
                        <div className='col-3'>
                            <label className='label__general'>Titulo</label>
                            <input className='inputs__general' type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Ingresa el titulo' />
                        </div>
                    </div>
                    <div className='row my-4'>
                        <div className="col-6 sale-order__input_container d-flex align-items-center">
                            <p className="label__general">Fecha de entrega a producción</p>
                            <div className="container_dates__requisition">
                                <Flatpickr
                                    className="date"
                                    value={dates[0]} // Fecha inicial
                                    options={{ enableTime: true, dateFormat: "Y-m-d H:i" }}
                                    onChange={(fecha) => handleDateChange(fecha, 0)} // Índice 0
                                    placeholder="Selecciona la fecha de inicio"
                                />
                            </div>
                        </div>

                        <div className="col-6 sale-order__input_container d-flex align-items-center">
                            <p className="label__general">Fecha de entrega cliente</p>
                            <div className="container_dates__requisition">
                                <Flatpickr
                                    className="date"
                                    value={dates[1]} // Fecha final
                                    options={{ enableTime: true, dateFormat: "Y-m-d H:i" }}
                                    onChange={(fecha) => handleDateChange(fecha, 1)} // Índice 1
                                    placeholder="Selecciona la fecha de fin"
                                />
                            </div>
                        </div>

                    </div>
                    <div className='row'>
                        <div className='col-12 d-flex align-items-center justify-content-between'>
                            <p className='title__concepts'>Conceptos</p>
                            <div className='d-flex align-items-center'>
                                <div className='mx-4'>
                                    <button type='button' className='btn__general-purple' onClick={() => setPersonalizedModal('personalized_modal-sale')}>Personalizados</button>
                                </div>
                                <div>
                                    <button type='button' className='btn__general-purple' onClick={() => setModalArticleView('article-view__modal')}>Buscar articulos</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='table__sales_modal'>
                        {normalConcepts ? (
                            <div className='table__numbers'>
                                <p className='text'>Total de articulos</p>
                                <div className='quantities_tables'>{normalConcepts.length}</div>
                            </div>
                        ) : (
                            <p className="text">No hay empresas que mostras</p>
                        )}
                        <div className='table__head'>
                            <div className='thead'>
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
                                    <p>Desc. monto</p>
                                </div>
                                <div>
                                    <p>Total</p>
                                </div>
                            </div>
                        </div>
                        {normalConcepts ? (
                            <div className='table__body'>
                                {normalConcepts?.map((article: any, index: number) => {
                                    return (
                                        <div className='tbody__container' key={article.id}>
                                            {article?.personalized ?
                                                <div className='concept__personalized'>
                                                    <p>Concepto Perzonalizado</p>
                                                </div>
                                                :
                                                ''
                                            }
                                            {article.personalized ?
                                                <div className='tbody personalized'>
                                                    <div className='td'>
                                                        <p>{article.codigo}-{article.descripcion}</p>
                                                    </div>
                                                    <div className='td'>
                                                        <p>$ {article.cantidad}</p>
                                                    </div>
                                                    <div className='td'>
                                                        <p>{article.name_unidad}</p>
                                                    </div>
                                                    <div className='td'>
                                                        {permisoDescount ?
                                                            <div>
                                                                <input className='inputs__general' type="text" placeholder='Descuento' />
                                                            </div>
                                                            :
                                                            <p>No permitido</p>
                                                        }
                                                    </div>
                                                    <div className='td'>
                                                        <p>$ {article.precio_total}</p>
                                                    </div>
                                                    <div className='td'>
                                                        <button className='btn__general-purple' onClick={() => modalSeeConcepts(article)}>Conceptos</button>
                                                    </div>
                                                    <div className='td'>
                                                        <button className='btn__general-orange' onClick={() => undoConcepts(article, index)}>Deshacer</button>
                                                    </div>
                                                </div>
                                                :
                                                <div className='tbody'>
                                                    <div className='td'>
                                                        <p>{article.codigo}-{article.descripcion}</p>
                                                    </div>
                                                    <div className='td'>
                                                        <p>$ {article.cantidad}</p>
                                                    </div>
                                                    <div className='td'>
                                                        <p>{article.name_unidad}</p>
                                                    </div>
                                                    <div className='td'>
                                                        {permisoDescount ?
                                                            <div>
                                                                <input className='inputs__general' type="text" placeholder='Descuento' />
                                                            </div>
                                                            :
                                                            <p>No permitido</p>
                                                        }
                                                    </div>
                                                    <div className='td'>
                                                        <p>$ {article.precio_total}</p>
                                                    </div>
                                                    <div className='td'>
                                                        <button className='add_urgency'>Agregar Urgencia</button>
                                                    </div>
                                                    <div className='td'>
                                                        <button className='btn__general-purple' onClick={() => setPersonalizedModal('personalized_modal-quotation-update')}>Conceptos</button>
                                                    </div>
                                                    <div className='td'>
                                                        <button className='btn__general-danger' onClick={() => deleteArticle(article, index)}>Eliminar</button>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="text">Cargando datos...</p>
                        )}
                    </div>

                    {/* <div className='row my-4'>
                        {dataSaleOrder?.map((x: any, index: any) => (
                            <div className='col-12 sale-order__concepts' key={x.id}>
                                <div className='row'>
                                    <div className='col-4'>
                                        <div className='d-flex'>
                                            <p className='code'>Código: {x.codigo}</p>
                                        </div>
                                        <div>
                                            {x.descripcion}
                                        </div>
                                    </div>
                                    <div className='col-8 right d-flex justify-content-between'>

                                        <div>
                                            <label>Unidad</label>
                                            <p className='item my-2'>{x.name_unidad}</p>
                                        </div>
                                        <div>
                                            <label>Cantidad</label>
                                            <p className='item my-2'>$ {x.cantidad}</p>
                                        </div>
                                        <div>
                                            <label>Precio unitario</label>
                                            <p className='item my-2'>$ {x.precio_unitario}</p>
                                        </div>
                                        <div>
                                            <label>Importe</label>
                                            <p className='item my-2'>$ {x.precio_unitario}</p>
                                            <div className='d-flex align-items-end'>
                                                <button className='btn__general-purple'>Conceptos plantilla</button>
                                            </div>
                                        </div>
                                        <div className='total__price'>
                                            <label>Precio total</label>
                                            <p className='price my-2'>$ {x.total_price}</p>
                                            <small className='discount'>Descuento $ 3434</small>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='row col-5'>
                                        <div className='col-6'>
                                            <textarea className={`textarea__general`} placeholder='Comentarios' />
                                        </div>
                                        <div className='col-6'>
                                            <textarea className={`textarea__general`} placeholder='Comentarios' />
                                        </div>
                                    </div>
                                    <div className='col-7 d-flex gap-3 justify-content-between align-items-end'>
                                        <div className='select__container'>
                                            <label className='label__general'>Areas</label>
                                            <div className={`select-btn__general`}>
                                                <div className={`select-btn ${selectAreas ? 'active' : ''}`} onClick={openSelectAreas}>
                                                    <div className='select__container_title'>
                                                        <p>{selectedArea ? x.areas_produccion?.find((s: { id: number }) => s.id === selectedArea)?.nombre_area : 'Selecciona'}</p>
                                                    </div>
                                                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                                                </div>
                                                <div className={`content ${selectAreas ? 'active' : ''}`}>
                                                    <ul className={`options ${selectAreas ? 'active' : ''}`} style={{ opacity: selectAreas ? '1' : '0' }}>
                                                        {x.areas_produccion?.map((x: any) => (
                                                            <li key={x.id} onClick={() => handleAreasChange(x, index)}>
                                                                {x.nombre_area}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='w-full'>
                                            <p className='label__general'>Enviar a produccion</p>
                                            <label className="switch">
                                                <input type="checkbox" checked={x.enviar_a_produccion} onChange={(event) => handleORequestChange(event, index)} />
                                                <span className="slider"></span>
                                            </label>
                                        </div>

                                        <div>
                                            <button type='button' className='btn__general-danger'>Cancelar</button>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-4'>
                                        <div className='w-full'>
                                            <p className='label__general'>Enviar a produccion interna</p>
                                            <label className="switch">
                                                <input type="checkbox" />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className='col-4'>
                                        <div className='d-flex'>
                                            <button type='button' className='btn__general-danger' onClick={() => calculateUrgency(x, index)}>Urgencia</button>
                                            <p>${x.monto_urgencia}</p>
                                        </div>
                                    </div>
                                    <div className='col-4'>
                                        <button type='button' className='btn__general-purple' onClick={() => sendToProduction(x)}>Mandar a produccion</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div> */}
                    <div className='d-flex justify-content-center'>
                        <div>
                            <button className='btn__general-purple'>Crear orden de venta</button>
                        </div>
                    </div>
                </form>
                <ArticleViewModal />
                <Personalized />
            </div>
        </div>
    )
}

export default ModalSalesOrder
