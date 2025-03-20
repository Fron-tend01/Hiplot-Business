import React, { useEffect, useState } from 'react';
import { storeFamilies } from '../../../../../zustand/Families';
import { storeArticles } from '../../../../../zustand/Articles';
import useUserStore from '../../../../../zustand/General';
import Images from './modals/Images';
import BranchOffices from './modals/BranchOffices';
import Suppliers from './modals/Suppliers';
import MaxMin from './modals/MaxMin';
import Units from './modals/Units';
import Prices from './modals/Prices';
import Variations from './modals/Variations';
import Combinations from './modals/Combinations';
import Components from './modals/Components';
import DeliveryTimes from './modals/DeliveryTimes';
import MinimalCharges from './modals/MinimalCharges';
import AdditionalArticles from './modals/AdditionalArticles';
import ProductionAreas from './modals/ProductionAreas';
import './modalCreate.css'
import { useStore } from 'zustand';
import { TemplatesRequests } from '../../../../../fuctions/Templates';
import ModalLoading from '../../../../loading/ModalLoading';
import { useSelectStore } from '../../../../../zustand/Select';
import APIs from '../../../../../services/services/APIs';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';

import Select from '../../../Dynamic_Components/Select';
import CobrosFranquicia from './modals/CobrosFranquicia';

const modalArticle: React.FC = () => {
    //////////////////////////// Data del articulo /////////////////////////////////////
    const { articleToUpdate }: any = useStore(storeArticles);

    const setArticleToUpdate = storeArticles(state => state.setArticleToUpdate)

    const setModalArticle = storeArticles(state => state.setModalArticle)

    const setBranchOffices = storeArticles(state => state.setBranchOffices)
    const setMaxsMins = storeArticles(state => state.setMaxsMins)
    const setUnits = storeArticles(state => state.setUnits)
    const setComponents = storeArticles(state => state.setComponents)
    const setAreas = storeArticles(state => state.setAreas)
    const setMinimalCharges = storeArticles(state => state.setMinimalCharges)
    const setCobrosFranquicia = storeArticles(state => state.setCobrosFranquicia)



    // const selectedIds = useSelectStore((state) => state.selectedIds);


    const { selectedIds }: any = useStore(useSelectStore);

    ///////////////////////////////////////////////////////////Variables de los modales ////////////////////////////////////////////////////////////////////////////
    const { modalArticle, imagesArticles, deteleImagesArticles, branchOffices, deleteBranchOffices, prices, deletePrices, maxsMins, deleteMaxsMins, units, deleteUnits,
        components, deleteComponents, variations, deleteVariations, combinations, deleteCombinations, suppliers, deleteSuppliers, deliveryTimes, deleteDeliveryTimes,
        minimalCharges, deleteMinimalCharges, additionalArticles, deleteAdditionalArticles, areas, deleteAreas, cobros_franquicia, deleteCobros_franquicia }: any = useStore(storeArticles);

    const setModalLoading = storeArticles((state: any) => state.setModalLoading);

    const setSubModal = storeArticles(state => state.setSubModal)

    const setAdditionalArticles = storeArticles(state => state.setAdditionalArticles)
    const setPrices = storeArticles(state => state.setPrices)

    const { getTemplates }: any = TemplatesRequests()

    // Modales Zustand
    const { setModalStateUnits, modalStateUnits } = useStore(storeArticles);

    const { setModalStateMaxsMins, modalStateMaxsMins } = useStore(storeArticles);
    const { setModalStateSuppliers, modalStateSuppliers } = useStore(storeArticles);

    const [type, setType] = useState<number>(0);
    const [code, setCode] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    //   const [contact, setContact] = useState<number | null>(null)
    const [activeArticles, setActiveArticles] = useState<boolean>(true)
    const [selectedUnit, setSelectedUnit] = useState<string>('')


    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const [baseMax, setBaseMax] = useState<number>(0)
    const [maxHeight, setMaxHeight] = useState<number>(0)
    const [multiples, setMultiples] = useState<number>(1)
    const [satUnit, setsatUnit] = useState<string>('')
    const [viewWeb, setViewWeb] = useState<boolean>(false)
    const [salesInstructions, setsalesInstructions] = useState<string>('.')
    const [webNotes, setwebNotes] = useState<string>('.')
    const [purchaseConditions, setPurchaseConditions] = useState<string>('.')
    const [oRequest, setORequest] = useState<boolean>(false)
    const [sellStock, setSellStock] = useState<boolean>(false)
    const [Shortage, setShortage] = useState<boolean>(false)
    const [ExemptTax, setExemptTax] = useState<boolean>(false)
    const [PrecioLibre, setPrecioLibre] = useState<boolean>(false)
    const [UltimasPiezas, setUltimasPiezas] = useState<boolean>(false)
    const [AgruparTiempos, setAgruparTiempos] = useState<boolean>(false)
    const [ConsultarConCotizador, setConsultarConCotizador] = useState<boolean>(false)
    const [ConsultarTe, setsetConsultarTe] = useState<boolean>(false)

    const { getFamilies }: any = storeFamilies()
    const { getArticlesInGlobal }: any = storeArticles();
    const userState = useUserStore(state => state.user);


    // Modales Zustand

    const user_id = userState.id





    const setSelectedId = useSelectStore((state) => state.setSelectedId);


    const [selectsSatKey, setSelectsSatKey] = useState<any>()
    const [selectedSatKey, setSelectedSatKey] = useState<any>()

    const [satKeyTerm, setSatKeyTerm] = useState<any>([])
    const [satKey, setSatKey] = useState<any>([])


    const openselectsSatKey = () => {
        setSelectsSatKey(!selectsSatKey)
    }

    const fetchData = async () => {
        if (satKeyTerm.length >= 3) {
            const result = await APIs.getKeySat({ nombre: satKeyTerm });
            setSatKey(result);
        }
    };

    useEffect(() => {

        fetchData();
    }, [satKeyTerm]);


    ////////// Selects //////////////
    const [selectFamilies, setSelectFamilies] = useState<any>()
    const [selectTypePayment, setSelectTypePayment] = useState<any>()
    const [selectTemplates, setSelectTemplates] = useState<any>()

    const fecht = async () => {
        const resultTemplates = await getTemplates(user_id)
        const resultType = await APIs.getTypeOfPayments()

        const resultFamilies = await getFamilies(user_id)
        setSelectTemplates({
            selectName: 'Plantillas',
            options: 'nombre',
            dataSelect: resultTemplates
        })

        setSelectTypePayment({
            selectName: 'Tipo de cobro',
            options: 'nombre',
            dataSelect: resultType
        })



        setSelectFamilies({
            selectName: 'Familias',
            options: 'nombre',
            dataSelect: resultFamilies
        })

        if (articleToUpdate) {

            setModalLoading(false)

            setType(articleToUpdate.tipo);
            setCode(articleToUpdate.codigo);
            setDescription(articleToUpdate.descripcion);
            setSelectedUnit(articleToUpdate.unidad);

            setActiveArticles(articleToUpdate.activo);
            setSelectedFile(articleToUpdate.imagen);

            setBaseMax(articleToUpdate.base_max);
            setMaxHeight(articleToUpdate.altura_max);
            setMultiples(articleToUpdate.multiplos_de);
            setSelectedSatKey({ Clave: articleToUpdate.clave_sat });
            setsatUnit(articleToUpdate.unidad_sat);
            setViewWeb(articleToUpdate.visualizacion_web)
            setsalesInstructions(articleToUpdate.indicaciones);
            setwebNotes(articleToUpdate.notas_web);
            setPurchaseConditions(articleToUpdate.condiciones_compra);
            setORequest(articleToUpdate.bajo_pedido);
            setSellStock(articleToUpdate.vender_sin_stock);
            setShortage(articleToUpdate.desabasto);
            setExemptTax(articleToUpdate.iva_excento);
            setPrecioLibre(articleToUpdate.precio_libre)
            setUltimasPiezas(articleToUpdate.ultimas_piezas)
            setAgruparTiempos(articleToUpdate.agrupar_tiempos)
            setFyV(articleToUpdate.fyv)
            setConsultarConCotizador(articleToUpdate.consultar_cotizador)
            setsetConsultarTe(articleToUpdate.consultar_te)

            setSelectedId('selectFamilies', { id: articleToUpdate.id_familia });
            setSelectedId('selectTypePayment', { id: articleToUpdate.tipo_de_cobro });
            setSelectedId('selectTemplates', { id: articleToUpdate.id_plantilla });

            setBranchOffices(articleToUpdate.sucursales)
            setMaxsMins(articleToUpdate.max_mins);
            setPrices(articleToUpdate.precios);
            setUnits(articleToUpdate.unidades);
            setComponents(articleToUpdate.componentes);
            setAreas(articleToUpdate.areas_produccion);
            setMinimalCharges(articleToUpdate.cargos_minimos);
            setCobrosFranquicia(articleToUpdate.cobros_franquicia);
            setAdditionalArticles(articleToUpdate.adicionales)
        }
    }

    useEffect(() => {
        fecht()


    }, [articleToUpdate]);



    useEffect(() => {

    }, [selectedIds])


    // Checkbox de Activo //

    const handleCheckboxChange = (value: number) => {
        setType(value); // Actualiza el tipo seleccionado

    };




    const handleViewWebChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setViewWeb(e.target.checked);
    };




    const handleCreateArticles = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setStateLoading(true)

        const data = {
            id: modalArticle == 'articles-modal-update' ? articleToUpdate.id : 0,
            tipo: type,
            codigo: code,
            descripcion: description,
            unidad: selectedUnit,
            id_familia: selectedIds.selectFamilies.id,
            activo: activeArticles,
            imagen: '',
            tipo_de_cobro: selectedIds.selectTypePayment.id,
            id_plantilla: selectedIds.selectTemplates.id,
            base_max: baseMax,
            altura_max: maxHeight,
            multiplos_de: multiples,
            clave_sat: selectedSatKey.Clave,
            unidad_sat: satUnit,
            visualizacion_web: viewWeb,
            indicaciones: salesInstructions,
            notas_web: webNotes,
            condiciones_compra: purchaseConditions,
            bajo_pedido: oRequest,
            vender_sin_stock: sellStock,
            desabasto: Shortage,
            iva_excento: ExemptTax,
            precio_libre: PrecioLibre,
            ultimas_piezas: UltimasPiezas,
            agrupar_tiempos: AgruparTiempos,
            fyv: FyV,
            consultar_cotizador: ConsultarConCotizador,
            consultar_te: ConsultarTe,

            /////////////////////////////////Modales//////////////////////////////////////// 
            sucursales: branchOffices,
            sucursales_elim: deleteBranchOffices,

            max_mins: maxsMins,
            max_mins_elim: deleteMaxsMins,

            precios: prices,
            precios_elim: deletePrices,

            unidades: units,
            unidades_elim: deleteUnits,

            componentes: components,
            componentes_elim: deleteComponents,

            variaciones: variations,
            variaciones_elim: deleteVariations,

            combinaciones: combinations,
            combinaciones_elim: deleteCombinations,

            proveedores: suppliers,
            proveedores_elim: deleteSuppliers,

            tiempos_entrega: deliveryTimes,
            tiempos_entrega_elim: deleteDeliveryTimes,

            cargos_minimos: minimalCharges,
            cargos_minimos_elim: deleteMinimalCharges,

            areas_produccion: areas,
            areas_produccion_elim: deleteAreas,

            adicional: additionalArticles,
            adicional_elim: deleteAdditionalArticles,

            cobros_franquicia: cobros_franquicia,
            cobros_franquicia_elim: deleteCobros_franquicia,

            imagenes: imagesArticles,
            imagenes_elim: deteleImagesArticles
        };

        const dataArticle = {
            id: 0,
            activos: true,
            nombre: '',
            codigo: '',
            familia: 0,
            proveedor: 0,
            materia_prima: 0,
            get_sucursales: false,
            get_proveedores: false,
            get_max_mins: false,
            get_plantilla_data: false,
            get_stock: false,
            get_web: false,
            get_unidades: false,
            page: 1
        };

        try {
            if (articleToUpdate) {
                await APIs.updateArticles(data);
                await getArticlesInGlobal(dataArticle);
                Swal.fire('Artículo creado exitosamente', '', 'success');
                setStateLoading(false);
                setModalArticle('');

            } else {
                await APIs.createArticles(data);
                await getArticlesInGlobal(dataArticle);
                Swal.fire('Artículo actualizado exitosamente', '', 'success');
                setStateLoading(false);
                setModalArticle('');
            }
        } catch (error) {
            console.error('Ocurrió un error al crear/actualizar el artículo', error);
            Swal.fire('Ocurrió un error al crear el artículo', '', 'error'); // Mensaje en caso de error
            setStateLoading(false);
        }


    }

    useEffect(() => {

    }, [activeArticles])



    const handleInputBaseMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim(); // Eliminar espacios en blanco alrededor
        setBaseMax(value === '' ? 0 : parseInt(value, 10));
    };


    const handleInputMaxHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim(); // Eliminar espacios en blanco alrededor
        setMaxHeight(value === '' ? 0 : parseInt(value, 10));
    };

    const handleInputMultiplesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim(); // Eliminar espacios en blanco alrededor
        setMultiples(value === '' ? 0 : parseInt(value, 10));
    };

    const handleORequestChange = (event: any) => {
        setORequest(event.target.checked)
    }
    const [FyV, setFyV] = useState<boolean>(false)
    const handleFyVChange = (event: any) => {
        setFyV(event.target.checked)
    }
    const handleSellStockChange = (event: any) => {
        setSellStock(event.target.checked)
    }
    const handleConsultarConCotizadorChange = (event: any) => {
        setConsultarConCotizador(event.target.checked)
    }
    const handleShortageChange = (event: any) => {
        setShortage(event.target.checked)
    }
    const handleExemptTaxChange = (event: any) => {
        setExemptTax(event.target.checked)
    }
    const handleconsultarTeChange = (event: any) => {
        setsetConsultarTe(event.target.checked)
    }
    const handlePrecioLibreChange = (event: any) => {
        setPrecioLibre(event.target.checked)
    }
    const handleUltimasPiezasChange = (event: any) => {
        setUltimasPiezas(event.target.checked)
    }
    const handleAgruparTiemposChange = (event: any) => {
        setAgruparTiempos(event.target.checked)
    }




    const handleKetSatChange = (key: any) => {
        setSelectsSatKey(false)
        setSelectedSatKey(key)
    }
    // Modal de MaxMin del modal de crear articulos //

    const modalMaxMin = () => {
        setModalStateMaxsMins('create')
    };

    // Modal de unidad del modal de crear articulos //
    const modalUnits = () => {
        setModalStateUnits('create')
    };



    const modalSuppliers = () => {
        setModalStateSuppliers('create')
    }

    // Checkbox de Activo //
    const handleActiveChange = () => {
        setActiveArticles(prevState => !prevState);
    };

    const [stateLoading, setStateLoading] = useState<boolean>(false)

    const modalLoading = storeArticles((state: any) => state.modalLoading);


    const clonArticle = async () => {
        const data = {
            id_articulo: articleToUpdate.id,
            id_usuario: user_id
        }
        try {
            const result: any = await APIs.cloneArticles(data)
            const dataArticle = {
                id: result.id_articulo,
                activos: true,
                nombre: '',
                codigo: '',
                familia: 0,
                proveedor: 0,
                materia_prima: 0,
                get_sucursales: true,
                get_proveedores: true,
                get_max_mins: true,
                get_plantilla_data: true,
                get_precios: true,
                get_variaciones: true,
                get_combinaciones: true,
                get_tiempos_entrega: true,
                get_areas_produccion: true,
                get_componentes: true,
                get_cargos_minimos: true,
                get_adicional: true,
                get_stock: true,
                get_web: false,
                get_unidades: true
            };
            Swal.fire(result.mensaje, '', 'success');
            const resultArticle: any = await APIs.getArticles(dataArticle);
            setArticleToUpdate(resultArticle[0])

        } catch (error) {
            Swal.fire('Hubo un error', '', 'error');
        }
    }

    const closeModal = () => {
        setModalArticle('')
        // if (modalArticle == 'articles-modal-update') {
        setArticleToUpdate(null)
        setCode('')
        setDescription('')
        setsalesInstructions('.')
        setwebNotes('.')
        setPurchaseConditions('.')
        setBaseMax(0)
        setMaxHeight(0)
        setMultiples(1)
        setViewWeb(false)
        setORequest(false)
        setSellStock(false)
        setShortage(false)
        setExemptTax(false)
        setPrecioLibre(false)
        setUltimasPiezas(false)
        setAgruparTiempos(false)
        setFyV(false)
        setConsultarConCotizador(false)
        setsetConsultarTe(false)

        setBranchOffices([])
        setMaxsMins([]);
        setPrices([]);
        setUnits([]);
        setComponents([]);
        setAreas([]);
        setMinimalCharges([]);
        setAdditionalArticles([])
        // }

    }


    return (
        <div className={`overlay__articles ${modalArticle == 'articles-modal-create' || modalArticle == 'articles-modal-update' ? 'active' : ''}`}>
            <div className={`popup__articles ${modalArticle == 'articles-modal-create' || modalArticle == 'articles-modal-update' ? 'active' : ''}`}>
                <div className='header__modal'>
                    <a href="#" className="btn-cerrar-popup__articles" onClick={closeModal}>
                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                    </a>
                    <p className='title__modals'>Artículo</p>
                </div>
                <div className='conatiner__articles-modal' >
                    <div className='row__form_articles-radios'>
                        <div className='container__form_articles-radios'>
                            <div className='checkbox__modal_articles'>
                                <label className="checkbox__container_general">
                                    <input value={0} className='checkbox' type="checkbox" checked={type === 0} onChange={() => handleCheckboxChange(0)} />
                                    <span className="checkmark__general"></span>
                                </label>
                                <p className='text'>Materia prima</p>
                            </div>
                            <div className='checkbox__modal_articles'>
                                <label className="checkbox__container_general">
                                    <input value={1} className='checkbox' type="checkbox" checked={type === 1} onChange={() => handleCheckboxChange(1)} />
                                    <span className="checkmark__general"></span>
                                </label>
                                <p className='text'>Servicio</p>
                            </div>
                        </div>
                    </div>
                    <div className='row row__one'>
                        <div className='col-4'>
                            <label className='label__general'>Código</label>
                            <input className='inputs__general' type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder='Ingresa el código' />
                        </div>
                        <div className='col-6'>
                            <label className='label__general'>Descripción</label>
                            <input className='inputs__general' type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Ingresa la descripción' />
                        </div>
                        <div className='col-1'>
                            <div>
                                <p className='label__general'>Activo</p>
                                <label className="switch">
                                    <input type="checkbox" checked={activeArticles} onChange={handleActiveChange} />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>
                        <div className='col-1'>
                            <p className='label__general'>Vista web</p>
                            <label className="switch">
                                <input type="checkbox" checked={viewWeb} onChange={handleViewWebChange} />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className='col-2'>
                            <div className="container__upload_photo" onClick={() => setSubModal('modal-images')}>
                                <label htmlFor="file-upload" className={`custom-file-upload`} style={{ backgroundImage: `url(${selectedFile})` }}>
                                    <span>
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill='#fff' viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM385 231c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-71-71V376c0 13.3-10.7 24-24 24s-24-10.7-24-24V193.9l-71 71c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L239 119c9.4-9.4 24.6-9.4 33.9 0L385 231z" /></svg> */}
                                        {' '}
                                        Ver mas
                                    </span>
                                </label>
                                {/* <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} /> */}

                            </div>
                            <Images />
                        </div>
                        <div className='col-3'>
                            <Select dataSelects={selectFamilies} instanceId='selectFamilies' nameSelect={'Familias'} />

                        </div>
                        <div className='col-2'>
                            <Select dataSelects={selectTypePayment} instanceId='selectTypePayment' nameSelect={'Tipo de cobro'} />
                        </div>
                        <div className='col-3'>
                            <Select dataSelects={selectTemplates} instanceId='selectTemplates' nameSelect={'Plantillas'} />
                        </div>
                        <div className='col-2'>
                            <div className='select__container'>
                                <label className='label__general'>Claves SAT</label>
                                <div className={`select-btn__general`}>
                                    <div className={`select-btn ${selectsSatKey ? 'active' : ''}`} onClick={openselectsSatKey}>
                                        <div className='select__container_title'>
                                            <p>{selectedSatKey ? selectedSatKey.Clave : 'Selecciona'}</p>
                                        </div>
                                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                                    </div>
                                    <div className={`content ${selectsSatKey ? 'active' : ''}`}>
                                        <input
                                            className='inputs__general'
                                            type="text"
                                            placeholder='Buscar...'
                                            value={satKeyTerm}
                                            onChange={(e) => setSatKeyTerm(e.target.value)}
                                        />
                                        <ul className={`options ${selectsSatKey ? 'active' : ''}`} style={{ opacity: selectsSatKey ? '1' : '0' }}>
                                            {satKey?.map((key: any) => (
                                                <li key={uuidv4()} onClick={() => handleKetSatChange(key)}>
                                                    {key.Descripcion}-{key.Clave}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row__two'>
                        <div className='row row__one'>
                            <div>
                                <label className='label__general'>Base Max</label>
                                <input className='inputs__general' type="number" value={baseMax === null ? '' : baseMax} onChange={handleInputBaseMaxChange} placeholder=' Base máxima' />
                            </div>
                            <div>
                                <label className='label__general'>Altura Max</label>
                                <input className='inputs__general' type="number" value={maxHeight === null ? '' : maxHeight} onChange={handleInputMaxHeightChange} placeholder='Altura máxima' />
                            </div>
                            <div>
                                <label className='label__general'>Múltiplos</label>
                                <input className='inputs__general' type="number" value={multiples === null ? '' : multiples} onChange={handleInputMultiplesChange} placeholder='Múltiplos' />
                            </div>
                            <div>
                                <label className='label__general'>Indicaciones de Ventas</label>
                                <input className='inputs__general' type="text" value={salesInstructions} onChange={(e) => setsalesInstructions(e.target.value)} placeholder='Indicaciones de Ventas' />
                            </div>
                            <div>
                                <label className='label__general'>Notas web</label>
                                <input className='inputs__general' type="text" value={webNotes} onChange={(e) => setwebNotes(e.target.value)} placeholder='Notas web' />
                            </div>
                            <div>
                                <label className='label__general'>Condiciones de compra</label>
                                <input className='inputs__general' type="text" value={purchaseConditions} onChange={(e) => setPurchaseConditions(e.target.value)} placeholder='Condiciones de compra' />
                            </div>
                        </div>
                    </div>
                    <div className='mt-3 mb-3 row row-small'>
                        <div className='col-1' title='Activar Bajo Pedido, levanta una requisición automatica si el stock no alcanza'>
                            <p className='label__general'>BP</p>
                            <label className="switch">
                                <input type="checkbox" checked={oRequest} onChange={handleORequestChange} />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className='col-1' title='Consuktar con cotizador'>
                            <p className='label__general'>Boton consultar C</p>
                            <label className="switch">
                                <input type="checkbox"/>
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className='col-1' title='Activar Check de Frente y Vuelta para tomar los precios FyV'>
                            <p className='label__general'>FyV</p>
                            <label className="switch">
                                <input type="checkbox" checked={FyV} onChange={handleFyVChange} />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className='col-1'>
                            <p className='label__general'>Vender sin Stock</p>
                            <label className="switch">
                                <input type="checkbox" checked={sellStock} onChange={handleSellStockChange} />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className='col-1' title='Habilita la etiqueta de Consultar con Cotizador'>
                            <p className='label__general'>CcC</p>
                            <label className="switch">
                                <input type="checkbox" checked={ConsultarConCotizador} onChange={handleConsultarConCotizadorChange} />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className='col-1'>
                            <p className='label__general'>Desabasto</p>
                            <label className="switch">
                                <input type="checkbox" checked={Shortage} onChange={handleShortageChange} />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className='col-1' title='Activa función en el comercial para IVA 0%'>
                            <p className='label__general'>IVA Excento</p>
                            <label className="switch">
                                <input type="checkbox" checked={ExemptTax} onChange={handleExemptTaxChange} />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className='col-1' title='Activa función para Consultar los Tiempos de Entrega'>
                            <p className='label__general'>Consultar TE</p>
                            <label className="switch">
                                <input type="checkbox" checked={ConsultarTe} onChange={handleconsultarTeChange} />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className='col-1' title='Activa la posibilidad de ingresar el precio manualmente'>
                            <p className='label__general'>Precio Libre</p>
                            <label className="switch">
                                <input type="checkbox" checked={PrecioLibre} onChange={handlePrecioLibreChange} />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className='col-2' title='Activa la desactivación del articulo automatico cuando se acabe su stock'>
                            <p className='label__general'>Ultimas Piezas</p>
                            <label className="switch">
                                <input type="checkbox" checked={UltimasPiezas} onChange={handleUltimasPiezasChange} />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className='col-2'>
                            <p className='label__general'>Agrupar Tiempos</p>
                            <label className="switch">
                                <input type="checkbox" checked={AgruparTiempos} onChange={handleAgruparTiemposChange} />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-auto'>
                            <div className='tooltip-container'>
                                <button className='btn__general-purple ' type='button' onClick={() => setSubModal('branch-office__modal')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-building-minus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 21h9" /><path d="M9 8h1" /><path d="M9 12h1" /><path d="M9 16h1" /><path d="M14 8h1" /><path d="M14 12h1" /><path d="M5 21v-16c0 -.53 .211 -1.039 .586 -1.414c.375 -.375 .884 -.586 1.414 -.586h10c.53 0 1.039 .211 1.414 .586c.375 .375 .586 .884 .586 1.414v7" /><path d="M16 19h6" /></svg>                                    </button>
                                <span className="tooltip-text">Sucursales</span>

                            </div>
                            <BranchOffices />
                        </div>
                        <div className='col-auto'>
                            <Prices />
                            <div className='tooltip-container'>
                                <button className='btn__general-purple' type='button' onClick={() => setSubModal('modal-prices')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-receipt-dollar"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2" /><path d="M14.8 8a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1" /><path d="M12 6v10" /></svg>
                                </button>
                                <span className="tooltip-text">Precios</span>
                            </div>
                        </div>
                        <div className='col-auto'>
                            <div className='tooltip-container'>
                                <button className='btn__general-purple' type='button' onClick={modalMaxMin}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-plus-minus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7h6" /><path d="M7 4v6" /><path d="M20 18h-6" /><path d="M5 19l14 -14" /></svg>
                                </button>
                                <span className="tooltip-text">Maximos y Minimos</span>

                            </div>
                            <div className={`overlay__modal_maxmin_creating_articles ${modalStateMaxsMins == 'create' ? 'active' : ''}`}>
                                <div className={`popup__modal_maxmin_creating_articles ${modalStateMaxsMins == 'create' ? 'active' : ''}`}>
                                    <MaxMin />
                                </div>
                            </div>
                        </div>
                        <div className='col-auto'>
                            <div className='tooltip-container'>
                                <button className='btn__general-purple' type='button' onClick={modalUnits}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-ruler-measure-2"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 19.875c0 .621 -.512 1.125 -1.143 1.125h-5.714a1.134 1.134 0 0 1 -1.143 -1.125v-15.875a1 1 0 0 1 1 -1h5.857c.631 0 1.143 .504 1.143 1.125z" /><path d="M12 9h-2" /><path d="M12 6h-3" /><path d="M12 12h-3" /><path d="M12 18h-3" /><path d="M12 15h-2" /><path d="M21 3h-4" /><path d="M19 3v18" /><path d="M21 21h-4" /></svg>
                                </button>
                                <span className="tooltip-text">Unidades</span>

                            </div>
                            <div className={`overlay__modal_units_creating_articles ${modalStateUnits == 'create' ? 'active' : ''}`}>
                                <div className={`popup__modal_units_creating_articles ${modalStateUnits == 'create' ? 'active' : ''}`} >
                                    <Units />
                                </div>
                            </div>
                        </div>
                        <div className='col-auto'>
                            <div className='tooltip-container'>
                                <button className='btn__general-purple' type='button' onClick={() => setSubModal('modal-components')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-cube-spark"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M21 12v-4.01a1.98 1.98 0 0 0 -1 -1.717l-7 -4.008a2.02 2.02 0 0 0 -2 0l-7 4.008c-.619 .355 -1 1.01 -1 1.718v8.018c0 .709 .381 1.363 1 1.717l7 4.008c.62 .354 1.38 .354 2 0" /><path d="M12 22v-10" /><path d="M12 12l8.73 -5.04" /><path d="M3.27 6.96l8.73 5.04" /><path d="M19 22.5a4.75 4.75 0 0 1 3.5 -3.5a4.75 4.75 0 0 1 -3.5 -3.5a4.75 4.75 0 0 1 -3.5 3.5a4.75 4.75 0 0 1 3.5 3.5" /></svg>
                                </button>
                                <span className="tooltip-text">Componentes</span>
                            </div>
                            <Components />
                        </div>
                        <div className='col-auto'>
                            <div className='tooltip-container'>
                                <button className='btn__general-purple' type='button' onClick={() => setSubModal('create_modal_variations')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-hierarchy"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M5 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M19 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M6.5 17.5l5.5 -4.5l5.5 4.5" /><path d="M12 7l0 6" /></svg>
                                </button>
                                <span className="tooltip-text">Variaciones</span>

                            </div>
                            <Variations />
                        </div>
                        <div className='col-auto'>
                            <div className='tooltip-container'>
                                <button className='btn__general-purple' type='button' onClick={() => setSubModal('create_modal_combinations')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-git-compare"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M18 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M11 6h5a2 2 0 0 1 2 2v8" /><path d="M14 9l-3 -3l3 -3" /><path d="M13 18h-5a2 2 0 0 1 -2 -2v-8" /><path d="M10 15l3 3l-3 3" /></svg>
                                </button>
                                <span className="tooltip-text">Combinaciones</span>

                            </div>
                            <Combinations />
                        </div>
                        <div className='col-auto'>
                            <div className='tooltip-container'>
                                <button className='btn__general-purple' type='button' onClick={() => setSubModal('article-modal_areas-production')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-settings-share"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12.004 21c-.732 .002 -1.466 -.437 -1.679 -1.317a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.306 .317 1.64 1.78 1.004 2.684" /><path d="M12 15a3 3 0 1 0 0 -6a3 3 0 0 0 0 6z" /><path d="M16 22l5 -5" /><path d="M21 21.5v-4.5h-4.5" /></svg>
                                </button>
                                <span className="tooltip-text">Areas de Producción</span>

                            </div>
                            <ProductionAreas />
                        </div>
                        <div className='col-auto'>
                            <div className='tooltip-container'>
                                <button className='btn__general-purple' type='button' onClick={modalSuppliers}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-truck-delivery"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" /><path d="M3 9l4 0" /></svg>
                                </button>
                                <span className="tooltip-text">Proveedores</span>

                            </div>
                            <div className={`overlay__modal_suppliers_creating_articles ${modalStateSuppliers == 'create' ? 'active' : ''}`}>
                                <div className={`popup__modal_suppliers_creating_articles ${modalStateSuppliers == 'create' ? 'active' : ''}`}>
                                    <Suppliers />
                                </div>
                            </div>
                        </div>
                        <div className='col-auto'>
                            <div className='tooltip-container'>
                                <button className='btn__general-purple' type='button' onClick={() => setSubModal('modal-delivery-times')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-clock"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-5 2.66a1 1 0 0 0 -.993 .883l-.007 .117v5l.009 .131a1 1 0 0 0 .197 .477l.087 .1l3 3l.094 .082a1 1 0 0 0 1.226 0l.094 -.083l.083 -.094a1 1 0 0 0 0 -1.226l-.083 -.094l-2.707 -2.708v-4.585l-.007 -.117a1 1 0 0 0 -.993 -.883z" /></svg>
                                </button>
                                <span className="tooltip-text">Tiempos de Entrega</span>

                            </div>
                            <DeliveryTimes />
                        </div>
                        <div className='col-auto'>
                            <div className='tooltip-container'>
                                <button className='btn__general-purple' type='button' onClick={() => setSubModal('modal-minimal-charges')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-currency-dollar-off"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M16.7 8a3 3 0 0 0 -2.7 -2h-4m-2.557 1.431a3 3 0 0 0 2.557 4.569h2m4.564 4.558a3 3 0 0 1 -2.564 1.442h-4a3 3 0 0 1 -2.7 -2" /><path d="M12 3v3m0 12v3" /><path d="M3 3l18 18" /></svg>
                                </button>
                                <span className="tooltip-text">Cargos Minimos</span>

                            </div>
                            <MinimalCharges />
                        </div>
                        <div className='col-auto'>
                            <div className='tooltip-container'>
                                <button className='btn__general-purple' type='button' onClick={() => setSubModal('modal-additiona-articles')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-prism-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 9v13" /><path d="M13.02 21.655a1.7 1.7 0 0 1 -2.04 0l-5.98 -4.485a2.5 2.5 0 0 1 -1 -2v-11.17a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1v8" /><path d="M4.3 3.3l6.655 5.186a1.7 1.7 0 0 0 2.09 0l6.655 -5.186" /><path d="M16 19h6" /><path d="M19 16v6" /></svg>
                                </button>
                                <span className="tooltip-text">Articulos Adicionales</span>

                            </div>
                            <AdditionalArticles />
                        </div>
                        <div className='col-auto'>
                            <div className='tooltip-container'>
                                <button className='btn__general-purple' type='button' onClick={() => setSubModal('modal-cobros-franquicia')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-building-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 21h9" /><path d="M9 8h1" /><path d="M9 12h1" /><path d="M9 16h1" /><path d="M14 8h1" /><path d="M14 12h1" /><path d="M5 21v-16c0 -.53 .211 -1.039 .586 -1.414c.375 -.375 .884 -.586 1.414 -.586h10c.53 0 1.039 .211 1.414 .586c.375 .375 .586 .884 .586 1.414v7" /><path d="M16 19h6" /><path d="M19 16v6" /></svg>
                                </button>
                                <span className="tooltip-text">Cobros a Franquicias</span>

                            </div>
                            <CobrosFranquicia />
                        </div>
                    </div>
                    <div className='d-flex justify-content-center'>
                        <button className='btn__general-purple d-flex align-items-center' onClick={(e) => handleCreateArticles(e)}>
                            {articleToUpdate ? `${stateLoading ? 'Actualizando articulo' : 'Actualizar articulo'}` : `${stateLoading ? 'Creando articulo' : 'Crear articulo'}`}
                            {stateLoading ? <span className="loader-two"></span> : ''}
                        </button>
                        <div className='btp__clone'>
                            <button className='btn__general-orange' type='button' onClick={clonArticle}>Clonar artículo</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default modalArticle;
