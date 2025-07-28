import React, { useState, useEffect } from 'react'
import { storeAreas } from '../../../../../zustand/Areas';
import { storeSeries } from '../../../../../zustand/Series';
import { storeArticles } from '../../../../../zustand/Articles';
import useUserStore from '../../../../../zustand/General';
import { storePurchaseOrders } from '../../../../../zustand/PurchaseOrders';
import { storeRequisitions } from '../../../../../zustand/Requisition';
import APIs from '../../../../../services/services/APIs';
import typePurchase from './json/typePurchase.json'
import typeSearchs from './json/typeSearchs.json'

// Importar el idioma español
import '../styles/PurchaseOrders.css'
import './styles/ModalPurchaseOrders.css'
import Swal from 'sweetalert2';
// Ensure the Spanish locale is loaded



import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import Empresas_Sucursales from '../../../Dynamic_Components/Empresas_Sucursales';
import ModalRequisition from '../requisition/ModalRequisition';
import { storeDv } from '../../../../../zustand/Dynamic_variables';
import ModalUpdate from '../../store/tickets/ModalUpdate';


const ModalPurchaseOrders = ({ purchaseOrderToUpdate }: any) => {

  const { getRequisition2 }: any = storeRequisitions();

  const [requisitions, setRequisitions] = useState<any[]>([])


  const [stateLoading, setStateLoading] = useState<boolean>(false)

  const setPurchaseOrders = storePurchaseOrders(state => state.setPurchaseOrders)

  const [conceptos, setConceptos] = useState<any>([]);

  const setModal = storePurchaseOrders(state => state.setModal)
  const { modal, selectedBranchOffice, type, dates }: any = storePurchaseOrders();


  const { getSeriesXUser }: any = storeSeries();
  const { getAreasXBranchOfficesXUsers }: any = storeAreas();

  const { getArticles }: any = storeArticles();
  const userState = useUserStore(state => state.user);
  const user_id = userState.id

  const [suppliers, setSuppliers] = useState<any>()
  const [conceptosElim, setConceptosElim] = useState<any[]>([])

  const [selectedModalCompany, setSelectedModalCompany] = useState<any>({})

  const [selectedModalBranchOffice, setSelectedModalBranchOffice] = useState<any>({})

  const [arrivalDate, setArrivalDate] = useState<any>('');
  const [quoteComments, setQuoteComments] = useState<string>('')
  const [bill, setBill] = useState<string>('')

  const [modoUpdate, setModoUpdate] = useState<boolean>(false)
  const [updateTickets, setUpdateTickets] = useState<any>([])
  const [modalStateUpdate, setModalStateUpdate] = useState<boolean>(false)

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
    console.log('conceptosordencompra', purchaseOrderToUpdate.conceptos);
  }

  useEffect(() => {

    if (purchaseOrderToUpdate) {
      setDates()
    }
  }, [purchaseOrderToUpdate])

  const fetch = async () => {
    const data = {
      nombre: "",
      is_flete: true,
      id_usuario: user_id
    }
    const result: any = await APIs.getSuppliers(data)
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
      setRequisitions([])

    }
    if (modal == 'modal-purchase-orders-create') {
      setModoUpdate(false)
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
      setRequisitions([])
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
    setFreightCost(value === '' ? '' : parseFloat(value));
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
    const data = {
      id: 0,
      activos: true,
      nombre: selectedTypeSearch == 0 ? nameBy : '',
      codigo: selectedTypeSearch == 1 ? nameBy : '',
      familia: 0,
      proveedor: 0,
      materia_prima: 0,
      get_sucursales: false,
      get_proveedores: true,
      for_compras: true,
      get_max_mins: true,
      get_plantilla_data: false,
      get_stock: false,
      get_web: false,
      get_unidades: true
    };
    try {

      setModalLoading(true)
      const result: any = await APIs.getArticles(data)
      setModalLoading(false)
      setResultModalOC(result);
      setArticleResult(result[0])

    } catch (error) {

    }

  };







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
  const modalCloseUpdate = () => {
    setModalStateUpdate(false)
  }

  const [proveedores, setProveedores] = useState<number[]>([])

  const handleProveedorChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const temp_proveedor = parseInt(event.target.value, 10); // Convertir a número entero
    setConceptos((prevConceptos: any) =>
      prevConceptos.map((concepto: any, i: number) =>
        i === index ? { ...concepto, id_proveedor: temp_proveedor } : concepto
      )
    );

    const nuevaInstancia = [...proveedores];
    nuevaInstancia[index] = temp_proveedor;
    setProveedores(nuevaInstancia);
  };



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
    newArticleStates[index].descuento = value === '' ? null : parseFloat(value);
    setConceptos(newArticleStates);
  };

  // const handlePrecioUnitarioChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
  //   const newArticleStates = [...conceptos];
  //   newArticleStates[index].precio_unitario = e.target.value;
  //   setConceptos(newArticleStates);
  // };
  const handlePrecioUnitarioChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;

    const newArticleStates = [...conceptos];

    if (value === '') {
      // Si el campo se borra, asignamos null o vacío
      newArticleStates[index].precio_unitario = '';
    } else {
      // Convertir a número, redondear a 4 decimales
      const num = parseFloat(value);

      // Solo actualizar si es un número válido
      if (!isNaN(num)) {
        // Limitar a 4 decimales (como número, no string)
        newArticleStates[index].precio_unitario = parseFloat(num.toFixed(4));
      }
    }

    setConceptos(newArticleStates);
  };
  const handleComentariosChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    const newArticleStates = [...conceptos];
    newArticleStates[index].comentarios = value;
    setConceptos(newArticleStates);
  };



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
    let ivaTotal = 0;

    conceptos.forEach((article: any) => {
      const total_cantidad = article.cantidad || 1;
      const precio_unitario = article.precio_unitario || 0;
      const porcentaje_descuento = article.descuento || 0;

      // Calculamos el descuento en monto (basado en porcentaje)
      const descuento_monto = (precio_unitario * total_cantidad) * (porcentaje_descuento / 100);
      totalDiscount += descuento_monto;

      // Calculamos el IVA
      let iva_x_precio = 0;
      if (article.iva_on) {
        const iva = precio_unitario * 0.16;
        iva_x_precio = precio_unitario + iva;
        ivaTotal += iva * total_cantidad;
      } else {
        iva_x_precio = precio_unitario;
      }

      // Acumulamos el subtotal sin descuento
      priceSubtotalTotal += precio_unitario * total_cantidad;

      // Acumulamos el subtotal con IVA y descuento aplicado
      subtotalValue += (iva_x_precio * total_cantidad) - descuento_monto;
    });

    const totalValue = subtotalValue;

    if (freightCostActive) {
      setTotal(totalValue + Number(freightCost));
    } else {
      setTotal(totalValue);
    }

    setSubtotal(priceSubtotalTotal);
    setDiscount(totalDiscount);
    setIvaTotal(ivaTotal);
  }, [conceptos, freightCostActive, freightCost]);

  // useEffect(() => {
  //   let subtotalValue = 0;
  //   let priceSubtotalTotal = 0;
  //   let totalDiscount = 0;
  //   let ivaTotal = 0
  //   conceptos.forEach((article: any) => {
  //     const total_cantidad = article.cantidad || 1; // Si no hay cantidad definida, se asume 1
  //     let iva_x_precio = 0;

  //     if (article.iva_on) {
  //       const iva = article.precio_unitario * 0.16 || 0;
  //       iva_x_precio = article.precio_unitario + iva;
  //       ivaTotal += iva

  //     } else {
  //       iva_x_precio = article.precio_unitario || 0;
  //     }

  //     priceSubtotalTotal += total_cantidad * article.precio_unitario

  //     subtotalValue += iva_x_precio * total_cantidad;

  //     totalDiscount += article.descuento || 0;
  //   });

  //   const totalValue: any = subtotalValue - totalDiscount;
  //   if (freightCostActive) {
  //     const totalWith = totalValue + freightCost;
  //     setTotal(totalWith);
  //   } else {
  //     setTotal(totalValue);
  //   }

  //   setSubtotal(priceSubtotalTotal);
  //   setDiscount(totalDiscount);
  //   setIvaTotal(ivaTotal)
  // }, [conceptos, freightCostActive, freightCost]);

  const addArticles = () => {
    const id_articulo = articleResult.id
    const proveedores = articleResult.proveedores
    const unidades = articleResult.unidades
    const descripcion = articleResult.descripcion
    const uc = articleResult.ultimas_compras
    const unidad = articleResult.unidades[0].id_unidad
    const id_proveedor = articleResult.proveedores[0].id_proveedor

    setConceptos((prevArticleStates: any) => [...prevArticleStates, { ultimas_compras: uc, id_proveedor, codigo: articleResult.codigo, proveedores, id_articulo, descripcion, cantidad: 0, descuento: 0, unidad, unidades, precio_unitario: 0, comentarios: '' }]);
  };




  const filterByRequest = async () => {
    const data = {
      id_sucursal: selectedModalBranchOffice.id,
      id_usuario: user_id,
      desde: dateForReq[0],
      hasta: dateForReq[1],
      status: 0
    }
    setModalLoading(true)
    await getRequisition2(data).then((e: any) => {
      setRequisitions(e.data)
      setModalLoading(false)
    }).catch(() => {
      setModalLoading(false)

    })
  }






  const [modalStateConcepts, setModalStateConcepts] = useState<boolean>(false)

  const [concepts, setConcepts] = useState<any[]>([])

  const openModalConcepts = (item: any) => {
    setModalStateConcepts(true);

    setConcepts(
      item.conceptos.map((element: any) => ({
        cantidad: element.cantidad,
        codigo: element.codigo,
        comentarios: element.comentarios,
        descripcion: element.descripcion,
        iva_on: element.iva_on,
        precio_unitario: element.precio_unitario == null ? 0 : element.precio_unitario,
        proveedor: element?.proveedor || '',
        unidad: (element.unidades.find((unidad: any) => unidad.id_unidad === element.unidad) || { id_unidad: 0 }).id_unidad,
        nombre_unidad: (element.unidades.find((unidad: any) => unidad.id_unidad === element.unidad) || { nombre: 'n/a' }).nombre,
        id_proveedor: element?.proveedores[0]?.id_proveedor || 0
      }))
    );



  }

  console.log(conceptos)

  const closeModalConcepts = () => {
    setModalStateConcepts(false)
  }


  const addArticlesByRequest = (req: any, i: number) => {
    const conceptosSinProveedores = req.conceptos.filter(
      (concepto: any) => !concepto.proveedores || concepto.proveedores.length === 0
    );

    if (conceptosSinProveedores.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Alerta de Proveedores",
        html: `Los siguientes conceptos no tienen proveedores:<br>
               <ul>${conceptosSinProveedores.map((c: any) => `<li>${c.codigo} - ${c.descripcion}</li>`).join('')}</ul>
               <ul>Si ya añadiste tu proveedor, no olvides volver a hacer clic en el botón Filtrar, para refrescar los datos</ul>`,
      });
    } else {
      const updatedConceptos = req.conceptos.map((concepto: any) => ({
        id_proveedor: concepto.proveedores[0].id_proveedor,
        proveedores: concepto.proveedores,
        codigo: concepto.codigo,
        id_articulo: concepto.id_articulo,
        descripcion: concepto.descripcion,
        cantidad: concepto.cantidad,
        descuento: 0,
        unidad: concepto.unidad,
        unidades: concepto.unidades,
        precio_unitario: 0,
        iva_on: false,
        comentarios: concepto.comentarios,
        ultimas_compras: concepto.ultimas_compras,
        id_requisicion: concepto.id_requisicion,
        folio_req: `${req.serie}-${req.folio}-${req.anio}`
      }));
      const filter = requisitions.filter((_: any, index: number) => index !== i)
      setRequisitions(filter)

      // Actualizar el estado de conceptos con los datos mapeados
      setConceptos((prevArticleStates: any) => [
        ...prevArticleStates,
        ...updatedConceptos,  // Agregar los conceptos transformados
      ]);
    }

  }

  const setModalLoading = storeArticles((state: any) => state.setModalLoading);

  const hanledCreateOC = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()



    setStateLoading(true);
    setModalLoading(true)
    const data = {
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

    const dataGet = {
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
        if (!checkPermission('modificar')) {
          setStateLoading(false);
          setModalLoading(false)

          Swal.fire('Notificación', 'No tienes permiso para modificar la Orden', 'warning')

          return
        }
        const resultCreate: any = await APIs.updatePurchaseOrders(data);
        if (resultCreate.error == true) {
          setModalLoading(false)

          return Swal.fire('Advertencia', resultCreate.mensaje, 'warning');
        }
        const resultGet = await APIs.getPurchaseOrders(dataGet);
        setPurchaseOrders(resultGet)
        setConceptosElim([])
        setConceptos([])
        setModalLoading(false)

        Swal.fire('Orden de compra actualizada exitosamente', '', 'success');
        setStateLoading(false);
        setModal('')
      } else {
        const result: any = await APIs.createPurchaseOrders(data);
        if (result.error == true) {
          setModalLoading(false)

          return Swal.fire('Advertencia', result.mensaje, 'warning');
        }
        const resultGet = await APIs.getPurchaseOrders(dataGet);
        setPurchaseOrders(resultGet)
        setConceptosElim([])
        setConceptos([])
        setModalLoading(false)

        Swal.fire('Orden de compra actualizada exitosamente', '', 'success');
        setStateLoading(false);
        setModal('')
      }
    } catch (error) {
      console.error('Ocurrió un error al crear/actualizar el artículo', error);
      setModalLoading(false)

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
        console.log(item)
      }
    }
    const filter = conceptos.filter((_: any, index: number) => index !== i)
    setConceptos(filter)
  }

  const updateStatus = async () => {
    const data = {
      id: purchaseOrderToUpdate.id,
      status: purchaseOrderToUpdate.status == 0 ? 1 : 0
    }

    const dataGet = {
      folio: 0,
      id_serie: 0,
      id_sucursal: 0,
      id_usuario: user_id,
      id_area: 0,
      // tipo: tipo,
      desde: dates[0],
      hasta: dates[1],
      status: type,
    };
    try {
      setModalLoading(true)

      const result: any = await APIs.updateStatusPurchaseOrder(data)
      const resultGet = await APIs.getPurchaseOrders(dataGet);
      setPurchaseOrders(resultGet)
      setModalLoading(false)

      Swal.fire('Status actualizado', result.mensaje, 'success');
      setModal('')
    } catch (error) {
      setModalLoading(false)

    }
  }
  const setModalStateCreate = storeRequisitions((state: any) => state.setModalStateCreate);
  const setUpdateToRequisition = storeRequisitions((state: any) => state.setUpdateToRequisition);
  const setConceptos_req = storeRequisitions((state: any) => state.setConcepts);

  const reqxid = async (id: number) => {
    const hoy = new Date()
    const fecha = hoy.toISOString().split('T')[0]
    const resultRequisition = await getRequisition2({ id: id, id_sucursal: 0, id_usuario: user_id, desde: fecha, hasta: fecha })
    return resultRequisition
  }
  const modalReq = async (art: any) => {
    const req = await reqxid(art.id_requisicion || art.requisicion.id)
    setModalStateCreate('create')
    setUpdateToRequisition(req[0])
    setConceptos_req(req[0].conceptos)
  }
  const getPDFRequisition = async () => {
    window.open(`http://hiplot.dyndns.org:84/api_dev/pdf_oc/${purchaseOrderToUpdate.id}`, '_blank');
  }
  const [dateForReq, setDateForReq] = useState<any>()
  const handleDateChange2 = (fechasSeleccionadas: any) => {
    if (fechasSeleccionadas.length === 2) {
      setDateForReq(fechasSeleccionadas.map((fecha: any) => fecha.toISOString().split('T')[0]));
    } else {
      setDateForReq([fechasSeleccionadas[0]?.toISOString().split('T')[0] || "", ""]);
    }
  };

  const checkPermission = (elemento: string) => {
    const permisosxVista = storeDv.getState().permisosxvista; // Obtiene el estado actual
    console.log(permisosxVista);
    console.log(elemento);

    return permisosxVista.some((x: any) => x.titulo === elemento);
  };
  const modalUpdate = async (ticket: any) => {
    setModalLoading(true)
    await APIs.CreateAny({ id: ticket.id }, 'entrada_almacen/get').then((result: any) => {
      setModalLoading(false)
      setUpdateTickets(result[0])
      setModalStateUpdate(true)
      // setUpdateTickets(ticket)
      console.log(ticket)
    }).finally(() => {
      setModalLoading(false);
    })

  }
  const [dataUltimasCompras, setDataUltimasCompras] = useState<any>({})
  const terminarOC = async (id: number) => {
    Swal.fire({
      title: "Seguro que deseas termina la orden de compra",
      text: "El estatus de la orden cambiará a Terminado. Esta acción no se puede deshacer.",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`
    }).then(async (result) => {
      if (result.isConfirmed) {
        const data = {
          id: id,
          status: 2
        }

        const dataGet = {
          folio: 0,
          id_serie: 0,
          id_sucursal: 0,
          id_usuario: user_id,
          id_area: 0,
          // tipo: tipo,
          desde: dates[0],
          hasta: dates[1],
          status: type,
        };
        try {
          setModalLoading(true)

          const result: any = await APIs.updateStatusPurchaseOrder(data)
          const resultGet = await APIs.getPurchaseOrders(dataGet);
          setPurchaseOrders(resultGet)
          setModalLoading(false)

          Swal.fire('Status actualizado', result.mensaje, 'success');
          setModal('')
        } catch (error) {
          setModalLoading(false)

        }
      }
    });
  }
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
            <div className="card__parchase-orders-modal">
              <div className='btn__linked_order'>
                <h3 className="order-identifier-card" title={purchaseOrderToUpdate?.id}>{purchaseOrderToUpdate?.serie}-{purchaseOrderToUpdate?.folio}-{purchaseOrderToUpdate?.anio}</h3>
              </div>
              <div className="card-body__parchase-orders-modal" >
                <div className='row__one'>
                  <div className='row__one'>
                    <span>Creado por: <b className='user-identifier-card'>{purchaseOrderToUpdate?.usuario_crea}</b></span>
                    <span>Fecha de Creación: <b className='data-identifier-card'>{purchaseOrderToUpdate?.fecha_creacion}</b></span>
                    {purchaseOrderToUpdate?.status === 0 ? (
                      <div className='active-status'>
                        <p>Activo</p>
                      </div>
                    ) : purchaseOrderToUpdate?.status === 1 ? (
                      <div>
                        <p>Cancelada</p>
                      </div>
                    ) : (
                      <div>
                        <p>Terminado</p>
                      </div>
                    )}
                  </div>
                  <div className='row__two'>
                    <span>Empresa: <b>{purchaseOrderToUpdate?.empresa}</b></span>
                    <span>Sucursal: <b>{purchaseOrderToUpdate?.sucursal}</b></span>
                    <span>Tipo: <b>{purchaseOrderToUpdate?.tipo == 0 ? 'Normal' : 'Diferencial'}</b></span>
                    <button className='btn__general-purple' title='Marca como finalizada la orden de compra completa' onClick={() => terminarOC(purchaseOrderToUpdate?.id)}>TERMINAR OC</button>

                  </div>
                </div>
                <div className='row__two'>
                  <div>
                    <span className='text'>Comentarios: {purchaseOrderToUpdate?.comentarios}</span>
                  </div>
                </div>
              </div>
            </div>
            :
            ''
          }
          {modoUpdate ?
            ''
            :
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
          }

          <div className='parchase-orders-modal_container'>
            <div className='row__one'>
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
                        mode: "single",
                        dateFormat: "Y-m-d"
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
                  <textarea className={`textarea__general ${warningInvoice}  ? 'warning' : ''}`} value={OComments} onChange={(e) => setOComments(e.target.value)} placeholder='Comentarios de la orden de compra'></textarea>
                </div>
              </div>
            </div>

            <div className='row__four'>
              {typeModal == 0 ?
                <div className='conatiner__direct'>
                  <div className='title'>
                    {typeModal ?
                      <p>Buscar Requisicion</p>
                      :
                      <p>Buscar Artículos</p>
                    }
                  </div>
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
                        <input className='inputs__general' type='text' value={nameBy} onChange={(e) => setNameBy(e.target.value)} placeholder='Ingresa el nombre' onKeyUp={(e) => e.key === 'Enter' && searchFor()} />
                      </div>
                    </div>
                    <div className='container__search'>
                      <button className='btn__general-purple btn__container' type='button' onClick={searchFor}>
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
                            <p>{articleResult ? `${articleResult.codigo}-${articleResult.descripcion}` : 'Selecciona'}</p>
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
                <div className='conatiner__quotation'>
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
                    <div className="">
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
                                  <p className='text'>No hay requsiiciones</p>
                                )}
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
                                            <button className='btn__general-purple' type='button' onClick={() => addArticlesByRequest(requisition, index)}>Agregar</button>
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
                  </div>
                </div>
              }
              <ModalRequisition />

              <div className=''>
                <div className='table__modal_create_parchase-orders' >
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
                          <p className=''>Artículo</p>
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
                          <p className=''>Desc(%)</p>
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
                        <div className='th' title='Entradas Almacen Relacionadas'>
                          <p className=''>EA Rel.</p>
                        </div>
                      </div>
                    </div>

                    {conceptos.length > 0 ? (
                      <div className='table__body'>
                        {conceptos.map((article: any, index: any) => (
                          <div className='tbody__container' key={index}>
                            <div className='tbody'>
                              {/* <label for="modaluniq-toggle" class="modaluniq-open-btn">Abrir Modal</label> */}
                              <div className='td' title='Puedes hacer click para ver las ultimas compras del articulo'
                                onClick={() => setDataUltimasCompras(article || {})}>
                                <label htmlFor="modaluniq-toggle" className='folio-identifier modaluniq-open-btn'>{article.codigo} - {article.descripcion}</label>
                              </div>
                              <div className='td'>
                                <div>
                                  <input className='inputs__general' value={article.cantidad === null ? '' : article.cantidad.toString()} onChange={(e) => handleAmountChange(e, index)} type="number" placeholder='Cantidad' onWheel={(e) => e.currentTarget.blur()} />
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
                                  <button className='btn__general-gray' onClick={() => modalReq(article)}><p>{article.folio_req || article?.requisicion?.folio}</p></button>
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
                                  <input className='inputs__general'
                                    value={article.precio_unitario === null ? '' : article.precio_unitario.toString()} onChange={(e) => handlePrecioUnitarioChange(e, index)} type="number" placeholder='P/U' onWheel={(e) => e.currentTarget.blur()} />
                                </div>
                              </div>
                              <div className='td'>
                                <div>
                                  <input className='inputs__general' value={article.descuento === null ? '' : article.descuento.toString()} onChange={(e) => handleDiscountChange(e, index)} type="number" placeholder='Descuento' onWheel={(e) => e.currentTarget.blur()} />
                                </div>
                              </div>
                              <div className='td'>
                                <select className='traditional__selector' onChange={(event) => handleProveedorChange(event, index)} value={article.id_proveedor} >
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
                                  <input className='inputs__general' value={article.comentarios === '' ? '' : article.comentarios} onChange={(e) => handleComentariosChange(e, index)} type="text" placeholder='Comentario' />
                                </div>
                              </div>
                              <div className='td' >
                                <div>
                                  {article?.entradas_relacionadas?.map((entrada: any, index: number) => (
                                    <div key={index} onClick={() => modalUpdate(entrada)}>{entrada.folio_completo}</div>
                                  ))}
                                </div>
                              </div>
                              <div className='td delete'>
                                <div className='delete-icon' onClick={() => deleteOrders(article, index)} title='Eliminar concepto'>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                </div>
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
            <div className='row__finally_btns'>
              <div className='subtotal'>
                <div>
                  <p className='name'>Subtotal</p>
                  <p className='value'>$ {subtotal.toFixed(2)}</p>
                </div>
              </div>
              <div className='discount'>
                <div>
                  <p className='name'>Descuento</p>
                  <p className='value'>$ {discount.toFixed(2)}</p>
                </div>
              </div>
              <div className='urgency'>
                <div>
                  <p className='name'>Urgencia</p>
                  <p className='value'>$ {ivaTotal.toFixed(2)}</p>
                </div>
              </div>
              <div className='total'>
                <div>
                  <p className='name'>Total</p>
                  <p className='value'>$ {total}</p>
                </div>
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
                  {purchaseOrderToUpdate?.status == 0 && checkPermission('cancelar') ? <button className='btn__general-danger' type='button' onClick={updateStatus}>Cancelar</button> : ''}
                  {purchaseOrderToUpdate?.status == 1 && checkPermission('cancelar') ? <button className='btn__general-success' type='button' onClick={updateStatus}>Activar</button> : ''}
                </div>
                :
                ''
              }
            </div>
          </div>
        </div>
      </div >
      {/* --------------------------------------------------------------------------MODAL BASICO */}
      <input type="checkbox" id="modaluniq-toggle" />
      <div className="modaluniq-container">
        <div className="modaluniq-content">
          <h2>Ultimas Compras del articulo {dataUltimasCompras.codigo} - {dataUltimasCompras.descripcion}</h2>
          <p>
            <table className='concepts-table'>
              <thead>
                <tr className='table-header'>
                  <th className='table-cell'>Folio</th>
                  <th className='table-cell'>Fecha</th>
                  <th className='table-cell'>Cantidad</th>
                  <th className='table-cell'>Precio Unitario</th>
                </tr>
              </thead>
              <tbody>
                {console.log('askdjaskuhdahdashdashdhskajd', dataUltimasCompras)}
                {dataUltimasCompras?.ultimas_compras?.map((compra: any, index: any) => {
                  console.log(compra);

                  return (
                    <tr className='table-row' key={index}>
                      <td className='table-cell'>{compra.folio_oc}</td>
                      <td className='table-cell'>{compra.fecha_creacion}</td>
                      <td className='table-cell'>{compra.cantidad} {compra.unidad_nombre}</td>
                      <td className='table-cell'>{compra.precio_unitario}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </p>
          <label htmlFor="modaluniq-toggle" className="modaluniq-close-btn">Cerrar</label>
        </div>
      </div>
      {/* --------------------------------------------------------------------------MODAL BASICO */}

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

      <div className={`overlay__update_tickets ${modalStateUpdate ? 'active' : ''}`}>
        <div className={`popup__update_tickets ${modalStateUpdate ? 'active' : ''}`}>
          <a href="#" className="btn-cerrar-popup__update_tickets" onClick={modalCloseUpdate}>
            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
          </a>
          <p className='title__modals'>Información de Entrada</p>
          <div className="modalEntradaInOc__container">
            <div className="modalEntradaInOc__header">
              <h3 className="modalEntradaInOc__title">
                {updateTickets?.serie}-{updateTickets?.folio}-{updateTickets?.anio}
              </h3>
              <hr />
            </div>

            <div className="modalEntradaInOc__info">
              <div className="modalEntradaInOc__info-block">
                <p><strong>Creado por:</strong> {updateTickets?.usuario_crea}</p>
                <p><strong>Fecha de creación:</strong> {updateTickets?.fecha_creacion}</p>
                <p><strong>Comentarios:</strong> {updateTickets?.comentarios || '—'}</p>
              </div>
              <div className="modalEntradaInOc__info-block">
                <p><strong>Empresa:</strong> {updateTickets?.empresa}</p>
                <p><strong>Sucursal:</strong> {updateTickets?.sucursal}</p>
                <p><strong>Proveedor principal:</strong> {updateTickets?.proveedor}</p>
              </div>
            </div>

            <div className="modalEntradaInOc__table-section">
              <h5>Conceptos</h5>
              <div className="modalEntradaInOc__table-wrapper">
                <table className="modalEntradaInOc__table" style={{ zoom: '80%' }}>
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Descripción</th>
                      <th>Cantidad</th>
                      <th>Unidad</th>
                      <th>Proveedor</th>
                      <th>Almacén</th>
                      <th>Comentarios</th>
                      <th>OC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {updateTickets?.conceptos?.map((c) => (
                      <tr key={c.id}>
                        <td>{c.codigo}</td>
                        <td>{c.descripcion}</td>
                        <td>{c.cantidad}</td>
                        <td>{c.unidad}</td>
                        <td>{c.proveedor}</td>
                        <td>{c.almacen}</td>
                        <td>{c.comentarios || '—'}</td>
                        <td>

                          {c.data_oc.folio}
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
            </div>
            <br />
            <div className='row'>
              <div className='col-12 justify-content-center d-flex'>
                <button className='btn__general-danger ' onClick={modalCloseUpdate}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default ModalPurchaseOrders
