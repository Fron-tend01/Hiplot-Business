import React, { useState, useEffect, useRef } from 'react'
import { storeCompanies } from '../../../../../zustand/Companies';
import { storeBranchOffcies } from '../../../../../zustand/BranchOffices';
import { storeAreas } from '../../../../../zustand/Areas';
import { storeSeries } from '../../../../../zustand/Series';
import { storeSuppliers } from '../../../../../zustand/Suppliers';
import { storeArticles } from '../../../../../zustand/Articles';
import useUserStore from '../../../../../zustand/General';
import { storePurchaseOrders } from '../../../../../zustand/PurchaseOrders';
import { storeRequisitions } from '../../../../../zustand/Requisition';
import APIs from '../../../../../services/services/APIs';
import typePurchase from './json/typePurchase.json'
import typeSearchs from './json/typeSearchs.json'
import types from './json/types.json'
// Importar el idioma español
import '../styles/PurchaseOrders.css'
import './styles/ModalPurchaseOrders.css'
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
// Ensure the Spanish locale is loaded



import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import Empresas_Sucursales from '../../../Dynamic_Components/Empresas_Sucursales';
import { PrivateRoutes } from '../../../../../models/routes';
import ModalRequisition from '../requisition/ModalRequisition';


const ModalPurchaseOrders = ({ purchaseOrderToUpdate }: any) => {

  const { getRequisition, getRequisition2 }: any = storeRequisitions();

  const [requisitions, setRequisitions] = useState<any[]>([])


  const [stateLoading, setStateLoading] = useState<boolean>(false)

  const setPurchaseOrders = storePurchaseOrders(state => state.setPurchaseOrders)

  const [conceptos, setConceptos] = useState<any>([]);

  const setModal = storePurchaseOrders(state => state.setModal)
  const { createPurchaseOrders, getPurchaseOrders, modal, selectedBranchOffice, type, dates }: any = storePurchaseOrders();

  const { branchOfficeXCompanies }: any = storeBranchOffcies();
  const { series, getSeriesXUser }: any = storeSeries();
  const { areasXBranchOfficesXUsers, getAreasXBranchOfficesXUsers }: any = storeAreas();

  const { getArticles }: any = storeArticles();
  const userState = useUserStore(state => state.user);
  let user_id = userState.id

  const [suppliers, setSuppliers] = useState<any>()
  const [conceptosElim, setConceptosElim] = useState<any[]>([])

  const [selectedModalCompany, setSelectedModalCompany] = useState<any>({})

  const [selectedModalBranchOffice, setSelectedModalBranchOffice] = useState<any>({})

  const [arrivalDate, setArrivalDate] = useState<any>('');
  const [quoteComments, setQuoteComments] = useState<string>('')
  const [bill, setBill] = useState<string>('')

  const [modoUpdate, setModoUpdate] = useState<boolean>(false)

  const setDates = async () => {
    // let resultB = await APIs.getBranchOfficesXCompanies(purchaseOrderToUpdate.id_empresa, user_id)
    setSelectModalTypes(purchaseOrderToUpdate.tipo)
    setSelectedModalCompany({ id: purchaseOrderToUpdate?.id_empresa })
    setSelectedModalBranchOffice({ id: purchaseOrderToUpdate?.id_sucursal })
    // setBranchOffices(resultB)
    setArrivalDate(purchaseOrderToUpdate.fecha_llegada)
    setQuoteComments(purchaseOrderToUpdate.cotizacion)
    setBill(purchaseOrderToUpdate.factura)
    setOComments(purchaseOrderToUpdate.comentarios)
    setSelectedModalType(purchaseOrderToUpdate.tipo)
    setSelectedModalfreightProvider(purchaseOrderToUpdate.id_proveedor_flete)
    setFreightCost(purchaseOrderToUpdate.costo_flete)
    setFreightCostActive(purchaseOrderToUpdate.sumar_flete)
    setFreightComments(purchaseOrderToUpdate.comentarios_flete)
    setSelectedModalType(purchaseOrderToUpdate.tipo)
    await setConceptos(purchaseOrderToUpdate.conceptos)
    console.log('conceptosordencompra',purchaseOrderToUpdate.conceptos);
  }

  useEffect(() => {

    if (purchaseOrderToUpdate) {
      setDates()
    }
  }, [purchaseOrderToUpdate])

  const fetch = async () => {
    let data = {
      nombre: "",
      is_flete: true,
      id_usuario: user_id
    }
    let result: any = await APIs.getSuppliers(data)
    result.unshift({ id: 0, nombre_comercial: 'Ninguno' })
    setSuppliers(result)
  }

  useEffect(() => {
    fetch()
    getSeriesXUser(12)
    getAreasXBranchOfficesXUsers(0, 12)
    setType(0)

    const hoy = new Date();
    const haceUnaSemana = new Date();
    haceUnaSemana.setDate(hoy.getDate() - 7);
    const masUnaSemana = new Date();
    masUnaSemana.setDate(hoy.getDate() + 7);
    setArrivalDate(masUnaSemana.toISOString().split('T')[0])
    setDateForReq([
      haceUnaSemana.toISOString().split('T')[0],
      hoy.toISOString().split('T')[0]
    ])

    setSelectedModalCompany(0)
    setSelectedModalBranchOffice(0)
    setQuoteComments('')
    setBill('')
    setOComments('')
    setSelectedModalType(0)
    setSelectedModalfreightProvider(0)
    setFreightCost(0)
    setFreightCostActive(false)
    setFreightComments('')
    setConceptos([])
    setSelectedModalType(0)



  }, [])

  useEffect(() => {
    if (modal == 'modal-purchase-orders-update') {
      setModoUpdate(true)
    }
    if (modal == 'modal-purchase-orders-create') {
      setModoUpdate(false)
    }
  }, [modal])
  useEffect(() => {
    setConceptosElim([])
    if (modal == 'modal-purchase-orders-create') {
      setSelectedModalCompany(null)
      setConceptos([])
    }

  }, [modoUpdate])
  const [typeModal, setType] = useState<number | null>(null);
  const handleModalType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = parseInt(e.target.value); // Convertir el valor a un número
    setType(selectedValue);
  };

  const handleCheckboxClick = (value: number) => {
    setType(value);
  };
  const handleDateChange = (fechasSeleccionadas: any) => {
    // Asegúrate de que se seleccione una fecha antes de intentar acceder a ella
    if (fechasSeleccionadas && fechasSeleccionadas.length > 0) {
      // Asigna la fecha seleccionada a arrivalDate
      setArrivalDate(fechasSeleccionadas[0].toISOString().split('T')[0]);
    } else {
      // Si no se selecciona ninguna fecha, puedes restablecer arrivalDate o manejarlo de otra manera
      setArrivalDate('');
    }
  };

  const [selectModalTypes, setSelectModalTypes] = useState<boolean>(false)
  const [selectedModalType, setSelectedModalType] = useState<number | null>(null)

  const openSelectModalTypes = () => {
    setSelectModalTypes(!selectModalTypes)
  }
  const handleModalTypesChange = (type: any) => {
    setSelectedModalType(type.id)
    setSelectModalTypes(false)
  }

  // Select de proveedor flete
  const [selectModalfreightProvider, setSelectModalfreightProvider] = useState<boolean>(false)
  const [selectedModalfreightProvider, setSelectedModalfreightProvider] = useState<number | null>(null)


  const openSelectModalFreightProvider = () => {
    setSelectModalfreightProvider(!selectModalfreightProvider)
  }

  const handleModalFreightProviderChange = (reightProvider: any) => {
    setSelectedModalfreightProvider(reightProvider.id)
    setSelectModalfreightProvider(false)
  }

  // Costo de flete
  const [freightCost, setFreightCost] = useState<number | ''>('')

  const handleInputFreightCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim(); // Eliminar espacios en blanco alrededor
    setFreightCost(value === '' ? '' : parseInt(value, 10));
  };


  // Comentarios de flete
  const [freightComments, setFreightComments] = useState<string>('')


  // Comentarios de orden de compra
  const [OComments, setOComments] = useState<string>('')



  //////////////////////////////
  // Articulos en requisición //
  //////////////////////////////


  /////////////////////////////Directa////////////////////////////////////////////////

  const [selectTypeSearch, setSelectTypeSearch] = useState<boolean>(false)
  const [selectedTypeSearch, setSelectedTypeSearch] = useState<number>(0)

  const openSelectModalTypeSearch = () => {
    setSelectTypeSearch(!selectTypeSearch)
  }
  const handleModalTypeSearchChange = (type: any) => {
    setSelectedTypeSearch(type.id)
    setSelectTypeSearch(false)
  }

  // Bucador por nombre
  const [nameBy, setNameBy] = useState<string>('')


  // Select de resultados
  const [resultModalOC, setResultModalOC] = useState<any[]>([])
  const [selectModalResults, setSelectModalResults] = useState<boolean>(false)
  const [selectedModalResult, setSelectedModalResult] = useState<number | null>(null)

  const [articleResult, setArticleResult] = useState<any>()


  const openSelectModalResults = () => {
    setSelectModalResults(!selectModalResults)
  }

  const handleModalResultsChange = (item: any) => {
    setSelectedModalResult(item.id)
    setSelectModalResults(false)
    setArticleResult(item)
  }



  const searchFor = async () => {
    let data = {
      id: 0,
      activos: true,
      nombre: selectedTypeSearch == 1 ? nameBy : '',
      codigo: selectedTypeSearch == 0 ? nameBy : '',
      familia: 0,
      proveedor: 0,
      materia_prima: 0,
      get_sucursales: false,
      get_proveedores: true,
      get_max_mins: true,
      get_plantilla_data: false,
      get_stock: false,
      get_web: false,
      get_unidades: true
    };
    try {
      if (selectedTypeSearch === 0) {
        let result: any = await APIs.getArticles(data)
        setResultModalOC(result);

      } else if (selectedTypeSearch === 1) {
        let result = await getArticles(data)
        setResultModalOC(result);

      }
    } catch (error) {

    }

  };



  const [selectedByRequestBranchOffice, setSelectedByRequestBranchOffice] = useState<any>()

  const [selectedModalSerie, setSelectedModalSerie] = useState<number | null>(null)



  const [seleccionesTemporales, setSeleccionesTemporales] = useState<any[]>([]);

  const handleSeleccion = (event: React.ChangeEvent<HTMLSelectElement>, index: any) => {
    const valorSeleccionado = parseInt(event.target.value);
    conceptos[index].unidad = valorSeleccionado;
    // Crear una copia del arreglo de selecciones temporales
    const nuevasSelecciones = [...seleccionesTemporales];
    // Actualizar el valor seleccionado en la posición del índice correspondiente
    nuevasSelecciones[index] = valorSeleccionado;
    // Actualizar el estado con las nuevas selecciones
    setSeleccionesTemporales(nuevasSelecciones);
  };


  const [proveedores, setProveedores] = useState<number[]>([])

  const handleProveedorChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const temp_proveedor = parseInt(event.target.value, 10); // Convertir a número entero
    conceptos[index].id_proveedor = temp_proveedor;
    const nuevaInstancia = [...proveedores];
    nuevaInstancia[index] = temp_proveedor;
    setProveedores(nuevaInstancia);
  };


  const [invoice, setInvoice] = useState<string>('')
  const [warningInvoice] = useState<boolean>(false)




  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.trim();
    const newArticleStates = [...conceptos];
    newArticleStates[index].cantidad = value === '' ? null : parseFloat(value);
    setConceptos(newArticleStates);
  };

  // Función para manejar el cambio de descuento para un artículo específico
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.trim();
    const newArticleStates = [...conceptos];
    newArticleStates[index].descuento = value === '' ? null : parseInt(value, 10);
    setConceptos(newArticleStates);
  };

  const handlePrecioUnitarioChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.trim();
    const newArticleStates = [...conceptos];
    newArticleStates[index].precio_unitario = value === '' ? null : parseInt(value, 10);
    setConceptos(newArticleStates);
  };

  const handleComentariosChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    const newArticleStates = [...conceptos];
    newArticleStates[index].comentarios = value;
    setConceptos(newArticleStates);
  };
  const iva = 0.16;
  const [applyExtraDiscount] = useState<boolean>(false);

  // Función para manejar el cambio de estado del checkbox
  const handleExtraDiscountChange = (e: React.ChangeEvent<HTMLInputElement>, index: any) => {
    const value = e.target.checked;
    const newArticleStates = [...conceptos];
    newArticleStates[index].iva_on = value === null ? null : value;
    setConceptos(newArticleStates);
  }

  const [freightCostActive, setFreightCostActive] = useState(false);

  const checkFreightCost = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFreightCostActive(e.target.checked);
  };


  const [subtotal, setSubtotal] = useState<number>(0); // Assuming you have declared `setSubtotal` elsewhere

  const [discount, setDiscount] = useState<number>(0); // Assuming you have declared `setDiscount` elsewhere

  const [total, setTotal] = useState<number>(0);

  const [ivaTotal, setIvaTotal] = useState<any>(0)

  useEffect(() => {
    let subtotalValue = 0;
    let priceSubtotalTotal = 0;
    let totalDiscount = 0;
    let ivaTotal = 0
    conceptos.forEach((article: any) => {
      let total_cantidad = article.cantidad || 1; // Si no hay cantidad definida, se asume 1
      let iva_x_precio = 0;

      if (article.iva_on) {
        let iva = article.precio_unitario * 0.16 || 0;
        iva_x_precio = article.precio_unitario + iva;
        ivaTotal += iva

      } else {
        iva_x_precio = article.precio_unitario || 0;
      }

      priceSubtotalTotal += total_cantidad * article.precio_unitario

      subtotalValue += iva_x_precio * total_cantidad;

      totalDiscount += article.descuento || 0;
    });

    const totalValue: any = subtotalValue - totalDiscount;
    if (freightCostActive) {
      let totalWith = totalValue + freightCost;
      setTotal(totalWith);
    } else {
      setTotal(totalValue);
    }

    setSubtotal(priceSubtotalTotal);
    setDiscount(totalDiscount);
    setIvaTotal(ivaTotal)
  }, [conceptos, freightCostActive, freightCost]);

  const addArticles = () => {
    let id_articulo = articleResult.id
    let proveedores = articleResult.proveedores
    let unidades = articleResult.unidades
    let descripcion = articleResult.descripcion
    let unidad = articleResult.unidades[0].id_unidad
    let id_proveedor = articleResult.proveedores[0].id_proveedor

    setConceptos((prevArticleStates: any) => [...prevArticleStates, { id_proveedor, proveedores, id_articulo, descripcion, cantidad: 0, descuento: 0, unidad, unidades, precio_unitario: 0, comentarios: '' }]);
  };


 

  const filterByRequest = async () => {
    let data = {
      id_sucursal: selectedModalBranchOffice == null ? 0 : selectedModalBranchOffice.id,
      id_usuario: user_id,
      desde: dateForReq[0],
      hasta: dateForReq[1],
      status: 0
    }
    let res = await getRequisition2(data)
    setRequisitions(res)
  }






  const [modalStateConcepts, setModalStateConcepts] = useState<boolean>(false)

  const [concepts, setConcepts] = useState<any[]>([])

  const openModalConcepts = (item: any) => {
    setModalStateConcepts(true);

    item.conceptos.forEach((element: any) => {
      setConcepts(prevConcepts => ([{
        ...prevConcepts,
        cantidad: element.cantidad,
        codigo: element.codigo,
        comentarios: element.comentarios,
        descripcion: element.descripcion,
        iva_on: element.iva_on,
        precio_unitario: element.precio_unitario == null ? 0 : element.precio_unitario,
        proveedor: element.proveedor,
        unidad: (element.unidades.find((unidad: any) => unidad.id_unidad === element.unidad) || { id_unidad: 0 }).id_unidad,
        nombre_unidad: (element.unidades.find((unidad: any) => unidad.id_unidad === element.unidad) || { nombre: 'n/a' }).nombre,
        id_proveedor: element.proveedores[0].id_proveedor
      }]));
    });


  }



  const closeModalConcepts = () => {
    setModalStateConcepts(false)
  }


  const addArticlesByRequest = (req: any) => {
    const updatedConceptos = req.conceptos.map((concepto: any) => ({
      id_proveedor: concepto.proveedores[0].id_proveedor,
      proveedores: concepto.proveedores,
      id_articulo: concepto.id_articulo,
      codigo: concepto.codigo,
      descripcion: concepto.descripcion,
      cantidad: concepto.cantidad,
      descuento: 0,
      unidad: concepto.unidad,
      unidades: concepto.unidades,
      precio_unitario: 0,
      iva_on: false,
      comentarios: concepto.comentarios,
      id_requisicion: concepto.id_requisicion,
      folio_req: req.serie + '-' + req.folio + '-' + req.anio

    }));

    // Actualizar el estado de conceptos con los datos mapeados
    setConceptos((prevArticleStates: any) => [
      ...prevArticleStates,
      ...updatedConceptos,  // Agregar los conceptos transformados
    ]);
  }


  const hanledCreateOC = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    setStateLoading(true);
    let data = {
      id: purchaseOrderToUpdate ? purchaseOrderToUpdate.id : null,
      id_usuario_crea: user_id,
      id_usuario_autoriza: 0,
      id_sucursal: selectedModalBranchOffice == null ? 0 : selectedModalBranchOffice.id,
      fecha_creacion: '',
      fecha_llegada: arrivalDate,
      status: 0,
      tipo: type == null ? 0 : type,
      cotizacion: quoteComments,
      factura: bill,
      comentarios: OComments,
      id_proveedor_flete: selectedModalfreightProvider == null ? 0 : selectedModalfreightProvider,
      costo_flete: freightCost == '' ? 0 : freightCost,
      comentarios_flete: freightComments,
      sumar_flete: freightCostActive,
      conceptos,
      conceptos_elim: conceptosElim,
      documento_anterior: '',
      documento_siguiente: ''
    };

    let dataGet = {
      folio: 0,
      id_serie: 0,
      id_sucursal: selectedBranchOffice == null ? 0 : selectedBranchOffice.id,
      id_usuario: user_id,
      id_area: 0,
      // tipo: tipo,
      desde: '2024-09-20',
      hasta: '2024-10-30',
      status: type,
    };

    try {
      if (purchaseOrderToUpdate) {
        let resultCreate: any = await APIs.updatePurchaseOrders(data);
        if(resultCreate.error == true) {
          return Swal.fire('Advertencia', resultCreate.mensaje, 'warning');
        }
        let resultGet = await APIs.getPurchaseOrders(dataGet);
        setPurchaseOrders(resultGet)
        setConceptosElim([])
        setConceptos([])
        Swal.fire('Orden de compra creada exitosamente', '', 'success');
        setStateLoading(false);
        setModal('')
      } else {
        let result: any = await APIs.createPurchaseOrders(data);
        if(result.error == true) {
          return Swal.fire('Advertencia', result.mensaje, 'warning');
        }
        let resultGet = await APIs.getPurchaseOrders(dataGet);
        setPurchaseOrders(resultGet)
        setConceptosElim([])
        setConceptos([])
        Swal.fire('Orden de compra actualizada exitosamente', '', 'success');
        setStateLoading(false);
        setModal('')
      }
    } catch (error) {
      console.error('Ocurrió un error al crear/actualizar el artículo', error);
      Swal.fire(`Ocurrió un error al ${purchaseOrderToUpdate ? 'actualizar' : 'crear'}`, '', 'error'); // Mensaje en caso de error
      setStateLoading(false);
    }

    // try {
    //   // if(type === 0) {
    //   //   let result = await createPurchaseOrders(id_usuario_crea, id_usuario_autoriza, id_sucursal, fecha_creacion, fecha_llegada, status, tipo, cotizacion, factura, comentarios, id_proveedor_flete, costo_flete, comentarios_flete, sumar_flete, documento_anterior, documento_siguiente, conceptos)
    //   // }

    //   updatePurchaseOrders(id, id_usuario_crea, id_usuario_autoriza, id_sucursal, fecha_creacion, fecha_llegada, status, tipo, cotizacion, factura, comentarios, id_proveedor_flete, costo_flete, comentarios_flete, sumar_flete, conceptos, conceptos_elim)


    //   await createPurchaseOrders(id_usuario_crea, id_usuario_autoriza, id_sucursal, fecha_creacion, fecha_llegada, status, tipo, cotizacion, factura, comentarios, id_proveedor_flete, costo_flete, comentarios_flete, sumar_flete, documento_anterior, documento_siguiente, conceptos)


    //   // Lanzar una excepción con el mensaje de error recibido

    // } catch (error) {
    //   console.error('Error al crear orden de compra:', error);

    // }
  }

  const deleteOrders = (item: any, i: number) => {
    if (modoUpdate) {
      if (conceptos[i].id != undefined) {
        setConceptosElim([...conceptosElim, conceptos[i].id])
      }
    }
    let filter = conceptos.filter((_: any, index: number) => index !== i)
    setConceptos(filter)
  }

  const updateStatus = async () => {
    let data = {
      id: purchaseOrderToUpdate.id,
      status: purchaseOrderToUpdate.status == 0 ? 1 : 0
    }

    let dataGet = {
      folio: 0,
      id_serie: 0,
      id_sucursal: selectedBranchOffice,
      id_usuario: user_id,
      id_area: 0,
      // tipo: tipo,
      desde: dates[0],
      hasta: dates[1],
      status: type,
    };
    try {
      let result: any = await APIs.updateStatusPurchaseOrder(data)
      let resultGet = await APIs.getPurchaseOrders(dataGet);
      setPurchaseOrders(resultGet)
      Swal.fire('Status actualizado', result.mensaje, 'success');
      setModal('')
    } catch (error) {

    }
  }
  const setModalStateCreate = storeRequisitions((state: any) => state.setModalStateCreate);
  const setUpdateToRequisition = storeRequisitions((state: any) => state.setUpdateToRequisition);
  const setConceptos_req = storeRequisitions((state: any) => state.setConcepts);

  const reqxid = async (id:number) => {
    let hoy = new Date()
    let fecha = hoy.toISOString().split('T')[0]
      let resultRequisition = await getRequisition2({id:id, id_sucursal:0,id_usuario:user_id,desde:fecha,hasta:fecha})
      return resultRequisition
  }
  const modalReq = async (art:any) => {
    let req = await reqxid(art.id_requisicion || art.requisicion.id)
    setModalStateCreate('create')
    setUpdateToRequisition(req[0])
    setConceptos_req(req[0].conceptos)
  }
  const getPDFRequisition = async () => {
    try {
      await APIs.getPdfPurchaseOrders(purchaseOrderToUpdate.id);
      // Abrimos el PDF en una nueva pestaña
      window.open(`https://hiplotbusiness.com/api_dev/pdf_oc/${purchaseOrderToUpdate.id}`, '_blank');
    } catch (error) {
      console.log(error);
    }
  }
  const [dateForReq, setDateForReq] = useState<any>()
  const handleDateChange2 = (fechasSeleccionadas: any) => {
    if (fechasSeleccionadas.length === 2) {
      setDateForReq(fechasSeleccionadas.map((fecha: any) => fecha.toISOString().split('T')[0]));
    } else {
      setDateForReq([fechasSeleccionadas[0]?.toISOString().split('T')[0] || "", ""]);
    }
  };
  return (
    <div className={`overlay__purchase-orders ${modal == 'modal-purchase-orders-create' || modal == 'modal-purchase-orders-update' ? 'active' : ''}`}>
      <div className={`popup__purchase-orders ${modal == 'modal-purchase-orders-create' || modal == 'modal-purchase-orders-update' ? 'active' : ''}`}>
        <div className='header__modal'>
          <a href="#" className="btn-cerrar-popup__purchase-orders" onClick={() => setModal('')} >
            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
          </a>
          {modoUpdate ?
            <p className='title__modals'>Actualizar Orden de Compra</p>

            :
            <p className='title__modals'>Crear Orden de Compra</p>

          }
        </div>
        <div className='parchase-orders-modal'>
          {modoUpdate ?
            <div className='row'>
              <div className='col-12'>
                <div className="card ">
                  <div className="card-body bg-standar">
                    <h3 className="text">{purchaseOrderToUpdate?.serie}-{purchaseOrderToUpdate?.folio}-{purchaseOrderToUpdate?.anio}</h3>
                    <hr />
                    <div className='row'>
                      <div className='col-6 md-col-12'>
                        <span className='text'>Creado por: <b>{purchaseOrderToUpdate?.usuario_crea}</b></span><br />
                        <span className='text'>Fecha de Creación: <b>{purchaseOrderToUpdate?.fecha_creacion}</b></span><br />
                        {purchaseOrderToUpdate?.status === 0 ? (
                          <span className="active-status">Activo</span>
                        ) : purchaseOrderToUpdate?.status === 1 ? (
                          <span className="canceled-status">Cancelada</span>
                        ) : (
                          ""
                        )}

                      </div>
                      <div className='col-6 md-col-12'>
                        <span className='text'>Empresa: <b>{purchaseOrderToUpdate?.empresa}</b></span><br />
                        <span className='text'>Sucursal: <b>{purchaseOrderToUpdate?.sucursal}</b></span><br />
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-12'>
                        <span className='text'>Comentarios: {purchaseOrderToUpdate?.comentarios}</span>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            :
            ''
          }

          <div className='row__check'>
            <div className='container__checkbox_purchas-order'>
              <div className='checkbox__purchas-order'>
                <label className="checkbox__container_general">
                  <input
                    className='checkbox'
                    type="checkbox"
                    value={0}
                    checked={typeModal === 0}
                    onChange={handleModalType}
                    onClick={() => handleCheckboxClick(0)}
                  />
                  <span className="checkmark__general"></span>
                </label>
                <p className='title__checkbox text'>Directa</p>
              </div>
              <div className='checkbox__purchas-order'>
                <label className="checkbox__container_general">
                  <input
                    className='checkbox'
                    type="checkbox"
                    value={1}
                    checked={typeModal === 1}
                    onChange={handleModalType}
                    onClick={() => handleCheckboxClick(1)}
                  />
                  <span className="checkmark__general"></span>
                </label>
                <p className='title__checkbox text'>Por requisición</p>
              </div>
            </div>
          </div>
          <div className='parchase-orders-modal_container'>
            <div className='row'>
              <div className='col-6'>
                <Empresas_Sucursales modeUpdate={modoUpdate} empresaDyn={selectedModalCompany} sucursalDyn={selectedModalBranchOffice}
                  setEmpresaDyn={setSelectedModalCompany} setSucursalDyn={setSelectedModalBranchOffice} all={false} blocked={modoUpdate ? true : undefined} />
              </div>


              <div className='dates__requisition col-2'>
                <label className='label__general'>Fecha de llegada</label>
                <div className='container_dates__requisition'>
                  <Flatpickr
                    className='date'
                    options={{
                      locale: Spanish,
                      mode: "single", // Modo para seleccionar solo una fecha
                      dateFormat: "Y-m-d" // Formato de fecha
                    }}
                    value={arrivalDate} // Valor del estado
                    onChange={handleDateChange} // Manejo del cambio de fecha
                    placeholder='Selecciona una fecha' // Placeholder
                  />

                  {/* <input className='' ref={inputRef} type="text" placeholder="Selecciona una fecha" /> */}
                </div>
              </div>
              <div className='col-2'>
                <label className='label__general'>Cotización</label>
                {/* <div className='warning__general' style={styleWarningName}><small >Este campo es obligatorio</small></div> */}
                <input className='inputs__general' type="text" value={quoteComments} onChange={(e) => setQuoteComments(e.target.value)} placeholder='Cotización' />
              </div>
              <div className='col-2'>
                <label className='label__general'>Factura</label>
                {/* <div className='warning__general' style={styleWarningName}><small >Este campo es obligatorio</small></div> */}
                <input className='inputs__general' type="text" value={bill} onChange={(e) => setBill(e.target.value)} placeholder='Factura' />
              </div>
            </div>
            <div className='row__two'>
              <div className='select__container'>
                <label className='label__general'>Tipo de compra</label>
                <div className='select-btn__general'>
                  <div className={`select-btn ${selectModalTypes ? 'active' : ''}`} onClick={openSelectModalTypes}>
                    <p>{selectedModalType !== null ? typePurchase.find((s: { id: number }) => s.id === selectedModalType)?.name : 'Selecciona'}</p>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                  </div>
                  <div className={`content ${selectModalTypes ? 'active' : ''}`}>
                    <ul className={`options ${selectModalTypes ? 'active' : ''}`} style={{ opacity: selectModalTypes ? '1' : '0' }}>
                      {typePurchase && typePurchase.map((typePurchase: any) => (
                        <li key={typePurchase.id} onClick={() => handleModalTypesChange(typePurchase)}>
                          {typePurchase.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className='select__container'>
                <label className='label__general'>Proveedor flete</label>
                <div className='select-btn__general'>
                  <div className={`select-btn ${selectModalfreightProvider ? 'active' : ''}`} onClick={openSelectModalFreightProvider}>
                    <p>{selectedModalfreightProvider ? suppliers?.find((s: { id: number }) => s.id === selectedModalfreightProvider)?.nombre_comercial : 'Selecciona'}</p>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                  </div>
                  <div className={`content ${selectModalfreightProvider ? 'active' : ''}`}>
                    <ul className={`options ${selectModalfreightProvider ? 'active' : ''}`} style={{ opacity: selectModalfreightProvider ? '1' : '0' }}>
                      {suppliers?.map((suppliers: any) => (
                        <li key={suppliers.id} onClick={() => handleModalFreightProviderChange(suppliers)}>
                          {suppliers.nombre_comercial}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <label className='label__general'>Costo flete</label>
                {/* <div className='warning__general' style={styleWarningName}><small >Este campo es obligatorio</small></div> */}
                <input className={`inputs__general ${warningInvoice}  ? 'warning' : ''}`} type="number" value={freightCost == '' ? 0 : freightCost} onChange={handleInputFreightCostChange} placeholder='Costo' />
              </div>
              <div>
                <label className='label__general'>Sumar</label>
                <div>
                  <label className="switch">
                    <input type="checkbox" checked={freightCostActive} onChange={checkFreightCost} />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
              <div>
                <label className='label__general'>Comentarios de flete</label>
                {/* <div className='warning__general' style={styleWarningName}><small >Este campo es obligatorio</small></div> */}
                <input className={`inputs__general ${warningInvoice}  ? 'warning' : ''}`} type="text" value={freightComments} onChange={(e) => setFreightComments(e.target.value)} placeholder='Comentarios' />
              </div>
            </div>
            <div className='row__three'>
              <div>
                <label className='label__general'>Comentarios de OC</label>
                {/* <div className='warning__general' style={styleWarningName}><small >Este campo es obligatorio</small></div> */}
                <textarea className={`textarea__general ${warningInvoice}  ? 'warning' : ''}`} type="text" value={OComments} onChange={(e) => setOComments(e.target.value)} placeholder='Comentarios de la orden de compra'></textarea>
              </div>
            </div>
            {typeModal ?
              <p className='title'>Buscar Requisiciones</p>
              :
              <p className='title'>Articulos en Requisicion</p>
            }
            <div className='row__four'>
              {typeModal == 0 ?
                <div className='conatiner__direct'>
                  <div className='row__one'>
                    <div className='select__container'>
                      <label className='label__general'>Buscar por</label>
                      <div className='select-btn__general'>
                        <div className={`select-btn ${selectTypeSearch ? 'active' : ''}`} onClick={openSelectModalTypeSearch}>
                          <p>{selectedTypeSearch !== null ? typeSearchs.find((s: { id: number }) => s.id === selectedTypeSearch)?.name : 'selecciona'}</p>
                          <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                        </div>
                        <div className={`content ${selectTypeSearch ? 'active' : ''}`}>
                          <ul className={`options ${selectTypeSearch ? 'active' : ''}`} style={{ opacity: selectTypeSearch ? '1' : '0' }}>
                            {typeSearchs && typeSearchs.map((type: any) => (
                              <li key={type.id} onClick={() => handleModalTypeSearchChange(type)}>
                                {type.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className='label__general'>Buscador por nombre</label>
                        <input className='inputs__general' type='text' value={nameBy} onChange={(e) => setNameBy(e.target.value)} placeholder='Ingresa el nombre' />
                      </div>
                    </div>
                    <div className='container__search'>
                      <button className='btn__general-purple btn__container' type='button' onClick={searchFor}>
                        Buscar
                        <svg className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /></svg>
                      </button>
                    </div>
                  </div>
                  <div className='row__two'>
                    <div className='container__two'>
                      <div className='select__container'>
                        <label className='label__general'>Resultados</label>
                        <div className='select-btn__general'>
                          <div className={`select-btn ${selectModalResults ? 'active' : ''}`} onClick={openSelectModalResults}>
                            <p>{selectedModalResult ? `${articleResult.codigo}-${articleResult.descripcion}` : 'Selecciona'}</p>
                            <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                          </div>
                          <div className={`content ${selectModalResults ? 'active' : ''}`}>
                            <ul className={`options ${selectModalResults ? 'active' : ''}`} style={{ opacity: selectModalResults ? '1' : '0' }}>
                              {resultModalOC && resultModalOC.map((item: any) => (
                                <li key={item.id} onClick={() => handleModalResultsChange(item)}>
                                  {`${item.codigo} ${item.descripcion}`}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div>
                        <button className='btn__general-purple' type='button' onClick={addArticles}>Agregar</button>
                      </div>
                    </div>
                  </div>
                </div>
                :
                <>

                  <div className='row'>
                    <div className='col-10'>
                      <div className='dates__requisition'>
                        <label className='label__general'>Fechas</label>
                        <div className='container_dates__requisition'>
                          <Flatpickr className='date' options={{ locale: Spanish, mode: "range", dateFormat: "Y-m-d" }} value={dates} onChange={handleDateChange2} placeholder='seleciona las fechas' />
                        </div>
                      </div>
                    </div>
                    <div className='col-2'>
                      <button className='btn__general-purple' type='button' onClick={filterByRequest}>Filtrar</button>
                    </div>
                  </div>

                  <div className='conatiner__by-request'>

                    <div className='row__two'>
                      <div>
                        <div className='table__modal_filter_purchase-order' >
                          <div>
                            <div>
                              {requisitions ? (
                                <div className='table__numbers'>
                                  <p className='text'>Requisiciones Encontradas :)</p>
                                  <div className='quantities_tables'>{requisitions.length}</div>
                                </div>
                              ) : (
                                <p className='text'>No hay empresas</p>
                              )}
                            </div>
                            <div className='table__head'>
                              <div className='thead'>

                              </div>
                            </div>
                            {requisitions != undefined && requisitions.length > 0 ? (
                              <div className='table__body'>
                                {requisitions.map((requisition: any, index: any) => (
                                  <div className='tbody__container' key={index}>
                                    <div className='tbody'>
                                      <div className='td'>
                                        {requisition.serie}-{requisition.folio}-{requisition.anio}
                                      </div>
                                      <div className='td'>
                                      {requisition.empresa}-({requisition.sucursal})
                                      </div>
                                      <div className='td'>
                                        {requisition.fecha_creacion}
                                      </div>
                                      <div className='td'>
                                        <div>
                                          <button onClick={() => openModalConcepts(requisition)} type='button' className='btn__general-purple'>Ver conceptos</button>
                                        </div>
                                      </div>
                                      <div className='td'>
                                        <div>
                                          <button className='btn__general-purple' type='button' onClick={() => addArticlesByRequest(requisition)}>Agregar</button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p>Cargando datos...</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              }
          <ModalRequisition />

              <div className=''>
                <div className='table__modal_create_parchase-orders ' >
                  <div>
                    <div>
                      {conceptos ? (
                        <div className='table__numbers'>
                          <p className='text'>Total de articulos</p>
                          <div className='quantities_tables'>{conceptos.length}</div>
                        </div>
                      ) : (
                        <p className='text'>No hay empresas</p>
                      )}
                    </div>
                    <div className='table__head'>
                      <div className='thead'>
                        <div className='th'>
                          <p className=''>Articulo</p>
                        </div>
                        <div className='th'>
                          <p className=''>Cant</p>
                        </div>
                        <div className='th'>
                          <p className=''>Unidad</p>
                        </div>
                        <div className='th'>
                          <p className=''>Req</p>
                        </div>
                        <div className='th'>
                          <p className=''>P/U</p>
                        </div>
                        <div className='th'>
                          <p className=''>Desc</p>
                        </div>
                        <div className='th'>
                          <p className=''>Proveed</p>
                        </div>
                        <div className='th'>
                          <p className=''>IVA</p>
                        </div>
                        <div className='th'>
                          <p className=''>Coment</p>
                        </div>

                      </div>
                    </div>
                    {conceptos.length > 0 ? (
                      <div className='table__body'>
                        {conceptos.map((article: any, index: any) => (
                          <div className='tbody__container' key={index}>
                            <div className='tbody'>
                              <div className='td'>
                                {article.codigo} - {article.descripcion}
                              </div>
                              <div className='td'>
                                <div>
                                  <input className='inputs__general' value={article.cantidad === null ? '' : article.cantidad.toString()} onChange={(e) => handleAmountChange(e, index)} type="number" placeholder='Cantidad' />
                                </div>
                              </div>
                              <div className='td'>
                                <div>
                                  <select className='traditional__selector' onChange={(event) => handleSeleccion(event, index)} value={seleccionesTemporales[index] || ''}>
                                    {article.unidades && article.unidades.map((item: any) => (
                                      <option key={item.id} value={item.id_unidad}>
                                        {item.nombre}
                                      </option>
                                    ))}
                                  </select>
                                  {/* Aquí puedes mostrar las selecciones temporales si es necesario */}
                                </div>
                              </div>
                              <div className='td'>
                                    
                                  {article.id_requisicion != undefined && article.id_requisicion != 0 ?
                                     <button className='btn__general-gray' onClick={()=>modalReq(article)}><p>{article.folio_req || article?.requisicion?.folio}</p></button>
                                    :
                                    <p>N/A</p>
                                  }
                                {/* <Link to={`/${PrivateRoutes.PRIVATE}/Home/${PrivateRoutes.SHOPPING}/${PrivateRoutes.REQUISITION}`}>
                                  {article.id_requisicion != undefined && article.id_requisicion != 0 ?
                                    <p>{article.folio_req || article?.requisicion?.folio}</p>
                                    :
                                    <p>N/A</p>
                                  }</Link> */}
                              </div>
                              <div className='td'>
                                <div>
                                  <input className='inputs__general' value={article.precio_unitario === null ? '' : article.precio_unitario.toString()} onChange={(e) => handlePrecioUnitarioChange(e, index)} type="number" placeholder='P/U' />
                                </div>
                              </div>
                              <div className='td'>
                                <div>
                                  <input className='inputs__general' value={article.descuento === null ? '' : article.descuento.toString()} onChange={(e) => handleDiscountChange(e, index)} type="number" placeholder='Descuento' />
                                </div>
                              </div>
                              <div className='td'>
                                <select className='traditional__selector' onChange={(event) => handleProveedorChange(event, index)} value={proveedores[index] || ''} >
                                  {article.proveedores && article.proveedores.map((item: any) => (
                                    <option key={item.id} value={item.id_proveedor}>
                                      {item.proveedor}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className='td'>
                                <div>
                                  <label className="switch">
                                    <input type="checkbox" checked={article.iva_on} onChange={(e) => handleExtraDiscountChange(e, index)} />
                                    <span className="slider"></span>
                                  </label>
                                </div>
                              </div>
                              <div className='td'>
                                <div>
                                  <input className='inputs__general' value={article.comentarios === '' ? '' : article.comentarios} onChange={(e) => handleComentariosChange(e, index)} type="text" placeholder='P/U' />
                                </div>
                              </div>
                              <div className='td'>
                                <button className='btn__delete_users' type='button' onClick={() => deleteOrders(article, index)}>Eliminar</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className='text'>No hay aritculos que mostrar</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row__finally'>
            <div className='conatiner__result_modal_purchase-order'>
              <div>
                <p className='title'>Subtotal</p>
                <p className='result'>$ {subtotal.toFixed(2)}</p>
              </div>
              <div>
                <p className='title'>Descuento</p>
                <p className='result'>$ {discount.toFixed(2)}</p>
              </div>
              <div>
                <p className='title'>IVA</p>
                {/* Si applyExtraDiscount es true, mostrar 16%, de lo contrario, mostrar el valor calculado */}
                <p className='result'>{ivaTotal.toFixed(2)}</p>
              </div>
              <div>
                <p className='title'>Total</p>
                {/* Ajustar el cálculo del total basado en si applyExtraDiscount está marcado */}
                <p className='result'>$ {total.toFixed(2)}</p>
              </div>
            </div>
            <div className={`d-flex  ${modal == 'modal-purchase-orders-update' ? 'justify-content-between' : 'justify-content-center'}`}>
              {modal == 'modal-purchase-orders-update' ? <button className='btn__general-orange' type='button' onClick={getPDFRequisition}>PDF</button> : ''}
              <button className='btn__general-purple d-flex align-items-center' onClick={hanledCreateOC}>
                {modal == 'modal-purchase-orders-create' ? `${stateLoading ? 'Creando orden de compra' : 'Crear orden de compra'}` : `${stateLoading ? 'Actualizando orden de compra' : 'Actualizar orden de compra'}`}
                {stateLoading ? <span className="loader-two"></span> : ''}
              </button>
              {modal == 'modal-purchase-orders-update' ?
                <div>
                  {purchaseOrderToUpdate.status == 0 ? <button className='btn__general-danger' type='button' onClick={updateStatus}>Deshabilitar</button> : ''}
                  {purchaseOrderToUpdate.status == 1 ? <button className='btn__general-success' type='button' onClick={updateStatus}>Activar</button> : ''}
                </div>
                :
                ''
              }
            </div>
          </div>
        </div>
      </div >
      <div className={`overlay__modal_concepts ${modalStateConcepts ? 'active' : ''}`}>
        <div className={`popup__modal_concepts ${modalStateConcepts ? 'active' : ''}`}>
          <a href="#" className="btn-cerrar-popup__modal_concepts" onClick={closeModalConcepts}>
            <svg className='close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
          </a>
          <b>CONCEPTOS DENTRO DE LA ORDEN</b>
          <div className='container__concepts'>
            <table className='concepts-table'>
              <thead>
                <tr className='table-header'>
                  <th className='table-cell'>Articulo</th>
                  <th className='table-cell'>Cantidad</th>
                  <th className='table-cell'>Unidad</th>
                  <th className='table-cell'>Comentarios</th>
                </tr>
              </thead>
              <tbody>
                {concepts.map((concepto: any, index: any) => (
                  <tr className='table-row' key={index}>
                    <td className='table-cell'>{concepto.codigo} - {concepto.descripcion}</td>
                    <td className='table-cell'>{concepto.cantidad}</td>
                    <td className='table-cell'>{concepto.nombre_unidad}</td>
                    <td className='table-cell'>{concepto.comentarios}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='row__two'>
              {/* Aquí puedes agregar más elementos o lógica si es necesario */}
            </div>
          </div>

        </div>
      </div>
    </div >
  )
}

export default ModalPurchaseOrders
