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
import typePayments from './json/typePayments.json'
import { articleRequests } from '../../../../../fuctions/Articles';
import { useSelectStore } from '../../../../../zustand/Select';
import APIs from '../../../../../services/services/APIs';
import Swal from 'sweetalert2';

import Select from '../../../Dynamic_Components/Select';
import CobrosFranquicia from './modals/CobrosFranquicia';

const modalArticle: React.FC = () => {
    //////////////////////////// Data del articulo /////////////////////////////////////
    const { articleToUpdate }: any = useStore(storeArticles);

    const { updateArticles } = articleRequests()

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


    const { selectedIds } = useStore(useSelectStore);

    ///////////////////////////////////////////////////////////Variables de los modales ////////////////////////////////////////////////////////////////////////////
    const { modalArticle, imagesArticles, branchOffices, deleteBranchOffices, prices, deletePrices, maxsMins, deleteMaxsMins, units, deleteUnits, 
        components, deleteComponents, variations, deleteVariations, combinations, deleteCombinations, suppliers, deleteSuppliers, deliveryTimes, deleteDeliveryTimes,
         minimalCharges, deleteMinimalCharges, additionalArticles, deleteAdditionalArticles, areas, deleteAreas, cobros_franquicia, deleteCobros_franquicia }: any = useStore(storeArticles);

    const setModalLoading = storeArticles((state: any) => state.setModalLoading);

    const setSubModal = storeArticles(state => state.setSubModal)

    const setAdditionalArticles = storeArticles(state => state.setAdditionalArticles)
    const setPrices = storeArticles(state => state.setPrices)

    const { getTemplates }: any = TemplatesRequests()

    // Modales Zustand
    const { setModalStateBrnachOffices, modalStateBrnachOffices } = useStore(storeArticles);
    const { setModalStateUnits, modalStateUnits, subModal } = useStore(storeArticles);

    const { setModalStateMaxsMins, modalStateMaxsMins } = useStore(storeArticles);
    const { setModalStateSuppliers, modalStateSuppliers } = useStore(storeArticles);

    const [type, setType] = useState<number | null>(null);
    const [code, setCode] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    //   const [contact, setContact] = useState<number | null>(null)
    const [activeArticles, setActiveArticles] = useState<boolean>(false)
    const [selectedUnit, setSelectedUnit] = useState<string>('')
    const [selectedFamilie, setSelectedFamilie] = useState<number | null>(null)

    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [selectedTypePayment, setSelectedTypePayment] = useState<number | null>(null)
    const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
    const [baseMax, setBaseMax] = useState<number | null>(null)
    const [maxHeight, setMaxHeight] = useState<number | null>(null)
    const [multiples, setMultiples] = useState<number | null>(null)
    const [satKey, setSatKey] = useState<string>('')
    const [satUnit, setsatUnit] = useState<string>('')
    const [viewWeb, setViewWeb] = useState<boolean>(false)
    const [salesInstructions, setsalesInstructions] = useState<string>('')
    const [webNotes, setwebNotes] = useState<string>('')
    const [purchaseConditions, setPurchaseConditions] = useState<string>('')
    const [oRequest, setORequest] = useState<boolean>(false)
    const [sellStock, setSellStock] = useState<boolean>(false)
    const [Shortage, setShortage] = useState<boolean>(false)
    const [ExemptTax, setExemptTax] = useState<boolean>(false)

    const { getFamilies }: any = storeFamilies()
    const { createArticles, getArticlesInGlobal }: any = storeArticles();
    const userState = useUserStore(state => state.user);


    // Modales Zustand

    let user_id = userState.id



    const [article_id, setArticle_id] = useState<number | null>(null)

    const setSelectedId = useSelectStore((state) => state.setSelectedId);



    ////////// Selects //////////////
    const [selectFamilies, setSelectFamilies] = useState<any>()
    const [selectTypePayment, setSelectTypePayment] = useState<any>()
    const [selectTemplates, setSelectTemplates] = useState<any>()

    const fecht = async () => {
        let resultTemplates = await getTemplates(user_id)
        let resultType = await APIs.getTypeOfPayments()

        let resultFamilies = await getFamilies(user_id)
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
            setArticle_id(articleToUpdate.id);
            setType(articleToUpdate.tipo);
            setCode(articleToUpdate.codigo);
            setDescription(articleToUpdate.descripcion);
            setSelectedUnit(articleToUpdate.unidad);
            setSelectedFamilie(articleToUpdate.id_familia);
            setActiveArticles(articleToUpdate.activo);
            setSelectedFile(articleToUpdate.imagen);
            setSelectedTypePayment(articleToUpdate.tipo_de_cobro);
            setSelectedTemplate(articleToUpdate.id_plantilla);
            setBaseMax(articleToUpdate.base_max);
            setMaxHeight(articleToUpdate.altura_max);
            setMultiples(articleToUpdate.multiplos_de);
            setSatKey(articleToUpdate.clave_sat);
            setsatUnit(articleToUpdate.unidad_sat);
            setViewWeb(articleToUpdate.visualizacion_web)
            setsalesInstructions(articleToUpdate.indicaciones);
            setwebNotes(articleToUpdate.notas_web);
            setPurchaseConditions(articleToUpdate.condiciones_compra);
            setORequest(articleToUpdate.bajo_pedido);
            setSellStock(articleToUpdate.vender_sin_stock);
            setShortage(articleToUpdate.desabasto);
            setExemptTax(articleToUpdate.iva_excento);

            setSelectedId('selectFamilies', articleToUpdate.id_familia);
            setSelectedId('selectTypePayment', articleToUpdate.tipo_de_cobro);
            setSelectedId('selectTemplates', articleToUpdate.id_plantilla);

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


    // Subir foto o tomar foto //
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (fileList && fileList.length > 0) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    setSelectedFile(reader.result as string);
                }
            };
            reader.readAsDataURL(fileList[0]);
        }
    };

    console.log(articleToUpdate)


    const handleCreateArticles = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStateLoading(true)
        let suc_elim_fix = []
        if (Array.isArray(deleteBranchOffices)) {
            suc_elim_fix = deleteBranchOffices.filter((x:any)=> x!= null)

        }
        let data = {
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
            base_max: baseMax || 0,
            altura_max: maxHeight || 0,
            multiplos_de: multiples || 1,
            clave_sat: satKey,
            unidad_sat: satUnit,
            visualizacion_web: viewWeb,
            indicaciones: salesInstructions,
            notas_web: webNotes,
            condiciones_compra: purchaseConditions,
            bajo_pedido: oRequest,
            vender_sin_stock: sellStock,
            desabasto: Shortage,
            iva_excento: ExemptTax,

            /////////////////////////////////Modales//////////////////////////////////////// 
            sucursales: branchOffices,
            sucursales_elim: suc_elim_fix,

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

            imagenes: imagesArticles
        };

        let dataArticle = {
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
            get_unidades: false
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
        setBaseMax(value === '' ? null : parseInt(value, 10));
    };


    const handleInputMaxHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim(); // Eliminar espacios en blanco alrededor
        setMaxHeight(value === '' ? null : parseInt(value, 10));
    };

    const handleInputMultiplesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim(); // Eliminar espacios en blanco alrededor
        setMultiples(value === '' ? null : parseInt(value, 10));
    };

    const handleORequestChange = (event: any) => {
        setORequest(event.target.checked)
    }
    const handleSellStockChange = (event: any) => {
        setSellStock(event.target.checked)
    }
    const handleShortageChange = (event: any) => {
        setShortage(event.target.checked)
    }
    const handleExemptTaxChange = (event: any) => {
        setExemptTax(event.target.checked)
    }

    // Modal de sucursales //

    const openModalBranchOffcies = () => {
        setModalStateBrnachOffices('create')
    };

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
        setActiveArticles(prevState => !prevState); // Cambiar el valor booleano
    };

    const [stateLoading, setStateLoading] = useState<boolean>(false)

    const modalLoading = storeArticles((state: any) => state.modalLoading);


    const clonArticle = async () => {


        let data = {
            id_articulo: articleToUpdate.id,
            id_usuario: user_id
        }
        try {
            let result: any = await APIs.cloneArticles(data)
            let dataArticle = {
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
            let resultArticle: any = await APIs.getArticles(dataArticle);
            setArticleToUpdate(resultArticle[0])

        } catch (error) {
            Swal.fire('Hubo un error', '', 'error');
        }
    }

    const closeModal = () => {
        setModalArticle('')
        if(modalArticle == 'articles-modal-update') {
            setArticleToUpdate(null)
            setCode('')
            setDescription('')
            setsalesInstructions('')
            setwebNotes('')
            setPurchaseConditions('')
            setBaseMax(null)
            setMaxHeight(null)
            setMultiples(null)
            setViewWeb(false)
            setORequest(false)
            setSellStock(false)
            setShortage(false)
            setExemptTax(false)

            
            setBranchOffices([])
            setMaxsMins([]);
            setPrices([]);
            setUnits([]);
            setComponents([]);
            setAreas([]);
            setMinimalCharges([]);
            setAdditionalArticles([])
        }

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
                {modalLoading == true ? (
                    <div className='loading__container'>
                        <ModalLoading />
                    </div>

                ) : (
                    <form className='conatiner__articles-modal' onSubmit={handleCreateArticles}>
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
                        <div className='row__form_articles-one'>
                            <div>
                                <label className='label__general'>Código</label>
                                <input className='inputs__general' type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder='Ingresa el código' />
                            </div>
                            <div>
                                <label className='label__general'>Descripción</label>
                                <input className='inputs__general' type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Ingresa la descripción' />
                            </div>
                            <Select dataSelects={selectFamilies} instanceId='selectFamilies' nameSelect={'Familias'} />
                            <Select dataSelects={selectTypePayment} instanceId='selectTypePayment' nameSelect={'Tipo de cobro'} />
                            <div>
                                <div>
                                    <p className='label__general'>Activo</p>
                                    <label className="switch">
                                        <input type="checkbox" checked={activeArticles} onChange={handleActiveChange} />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className='row__form_articles-two my-4'>
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
                            <div>
                                <Select dataSelects={selectTemplates} instanceId='selectTemplates' nameSelect={'Plantillas'} />
                            </div>
                            <div>
                                <label className='label__general'>Base Max</label>
                                <input className='inputs__general' type="number" value={baseMax === null ? '' : baseMax} onChange={handleInputBaseMaxChange} placeholder='Ingresa la base máxima' />
                            </div>
                            <div>
                                <label className='label__general'>Altura Max</label>
                                <input className='inputs__general' type="number" value={maxHeight === null ? '' : maxHeight} onChange={handleInputMaxHeightChange} placeholder='Ingresa la altura máxima' />
                            </div>
                            <div>
                                <label className='label__general'>Múltiplos</label>
                                <input className='inputs__general' type="number" value={multiples === null ? '' : multiples} onChange={handleInputMultiplesChange} placeholder='Ingresa los múltiplos' />
                            </div>
                            <div className=' '>

                                <p className='label__general'>Vista web</p>
                                <label className="switch">
                                    <input type="checkbox" checked={viewWeb} onChange={handleViewWebChange} />
                                    <span className="slider"></span>
                                </label>

                            </div>
                        </div>
                        {/* <div className='row__form_articles-three'>
                        
                    </div> */}
                        <div className='row__form_articles-four'>  
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
                        <div className='row__form_articles-five'>
                            <div>
                                <div>
                                    <p className='label__general'>Bajo Pedido</p>
                                    <label className="switch">
                                        <input type="checkbox" checked={oRequest} onChange={handleORequestChange} />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <p className='label__general'>Vender sin stock</p>
                                    <label className="switch">
                                        <input type="checkbox" checked={sellStock} onChange={handleSellStockChange} />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <p className='label__general'>Desabasto</p>
                                    <label className="switch">
                                        <input type="checkbox" checked={Shortage} onChange={handleShortageChange} />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <p className='label__general'>IVA Excento</p>
                                    <label className="switch">
                                        <input type="checkbox" checked={ExemptTax} onChange={handleExemptTaxChange} />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className='row__form_articles-six'>
                            <div>
                                <div>
                                    <button className='btn__general-purple' type='button' onClick={() => setSubModal('branch-office__modal')}>Sucursales</button>
                                </div>
                                <BranchOffices />
                            </div>
                            <div>
                                <Prices />
                                <div>
                                    <button className='btn__general-purple' type='button' onClick={() => setSubModal('modal-prices')}>Precios</button>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <button className='btn__general-purple' type='button' onClick={modalMaxMin}>Max-Min</button>
                                </div>
                                <div className={`overlay__modal_maxmin_creating_articles ${modalStateMaxsMins == 'create' ? 'active' : ''}`}>
                                    <div className={`popup__modal_maxmin_creating_articles ${modalStateMaxsMins == 'create' ? 'active' : ''}`}>
                                        <MaxMin />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <button className='btn__general-purple' type='button' onClick={modalUnits}>Unidades</button>
                                </div>
                                <div className={`overlay__modal_units_creating_articles ${modalStateUnits == 'create' ? 'active' : ''}`}>
                                    <div className={`popup__modal_units_creating_articles ${modalStateUnits == 'create' ? 'active' : ''}`} >
                                        <Units />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <button className='btn__general-purple' type='button' onClick={() => setSubModal('modal-components')}>Componentes</button>
                                </div>
                                <Components />
                            </div>
                            <div>
                                <div>
                                    <button className='btn__general-purple' type='button' onClick={() => setSubModal('create_modal_variations')}>Variaciones</button>
                                </div>
                                <Variations />
                            </div>
                            <div>
                                <div>
                                    <button className='btn__general-purple' type='button' onClick={() => setSubModal('create_modal_combinations')}>Combinaciones</button>
                                </div>
                                <Combinations />
                            </div>
                            <div>
                                <div>
                                    <button className='btn__general-purple' type='button' onClick={() => setSubModal('article-modal_areas-production')}>Areas de pro</button>
                                </div>
                                <ProductionAreas />
                            </div>
                            <div>
                                <div>
                                    <button className='btn__general-purple' type='button' onClick={modalSuppliers}>Proveedores</button>
                                </div>
                                <div className={`overlay__modal_suppliers_creating_articles ${modalStateSuppliers == 'create' ? 'active' : ''}`}>
                                    <div className={`popup__modal_suppliers_creating_articles ${modalStateSuppliers == 'create' ? 'active' : ''}`}>
                                        <Suppliers />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <button className='btn__general-purple' type='button' onClick={() => setSubModal('modal-delivery-times')}>T. Entrega</button>
                                </div>
                                <DeliveryTimes />
                            </div>
                            <div>
                                <div>
                                    <button className='btn__general-purple' type='button' onClick={() => setSubModal('modal-minimal-charges')}>Cargos minimos</button>
                                </div>
                                <MinimalCharges />
                            </div>
                            <div>
                                <div>
                                    <button className='btn__general-purple' type='button' onClick={() => setSubModal('modal-additiona-articles')}>Art. adicionales</button>
                                </div>
                                <AdditionalArticles />
                            </div>
                            <div>
                                <div>
                                    <button className='btn__general-purple' type='button' onClick={() => setSubModal('modal-cobros-franquicia')}>Cobros Franquicia</button>
                                </div>
                                <CobrosFranquicia />
                            </div>
                        </div>
                        <div className='d-flex justify-content-center'>
                            <button className='btn__general-purple d-flex align-items-center' type='submit'>
                                {articleToUpdate ? `${stateLoading ? 'Actualizando articulo' : 'Actualizar articulo'}` : `${stateLoading ? 'Creando articulo' : 'Crear articulo'}`}
                                {stateLoading ? <span className="loader-two"></span> : ''}
                            </button>
                            <div className='btp__clone'>
                                <button className='btn__general-orange' type='button' onClick={clonArticle}>Clonar artículo</button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default modalArticle;
