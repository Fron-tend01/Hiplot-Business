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
// Ensure the Spanish locale is loaded



import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { Spanish } from 'flatpickr/dist/l10n/es.js';


const ModalPurchaseOrders = ({ purchaseOrderToUpdate }: any) => {

  const { requisitions, getRequisition, }: any = storeRequisitions();

  

  const { updatePurchaseOrders }: any = storePurchaseOrders();

  const [stateLoading, setStateLoading] = useState<boolean>(false)

  const setPurchaseOrders = storePurchaseOrders(state => state.setPurchaseOrders)

  const [conceptos, setConceptos] = useState<any>([]);

  const setModal = storePurchaseOrders(state => state.setModal)
  const { createPurchaseOrders, getPurchaseOrders, modal, selectedBranchOffice, type, dates }: any = storePurchaseOrders();

  const { companiesXUsers }: any = storeCompanies();
  const { branchOfficeXCompanies }: any = storeBranchOffcies();
  const { series, getSeriesXUser }: any = storeSeries();
  const { areasXBranchOfficesXUsers, getAreasXBranchOfficesXUsers }: any = storeAreas();

  const { getArticles }: any = storeArticles();
  const userState = useUserStore(state => state.user);
  let user_id = userState.id

  const [suppliers, setSuppliers] = useState<any>()

  const [selectModalCompanies, setSelectModalCompanies] = useState<boolean>(false)
  const [selectedModalCompany, setSelectedModalCompany] = useState<number | null>(null)

  const [selectModalBranchOffices, setSelectModalBranchOffices] = useState<boolean>(false)
  const [selectedModalBranchOffice, setSelectedModalBranchOffice] = useState<number | null>(null)
  const [branchOffices, setBranchOffices] = useState<any>([])

  const [arrivalDate, setArrivalDate] = useState<any>('');
  const [quoteComments, setQuoteComments] = useState<string>('')
  const [bill, setBill] = useState<string>('')

  const setDates = async () => {
    let resultB = await APIs.getBranchOfficesXCompanies(purchaseOrderToUpdate.id_empresa, user_id)
    setBranchOffices(resultB)
    setSelectedModalCompany(purchaseOrderToUpdate.id_empresa)
    setArrivalDate(purchaseOrderToUpdate.fecha_llegada)
    setSelectedModalBranchOffice(purchaseOrderToUpdate.id_sucursal)
    setQuoteComments(purchaseOrderToUpdate.cotizacion)
    setBill(purchaseOrderToUpdate.factura)
    setOComments(purchaseOrderToUpdate.comentarios)
    setSelectedModalType(purchaseOrderToUpdate.tipo)
    setSelectedModalfreightProvider(purchaseOrderToUpdate.id_proveedor_flete)
    setFreightCost(purchaseOrderToUpdate.costo_flete)
    setFreightCostActive(purchaseOrderToUpdate.sumar_flete)
    setFreightComments(purchaseOrderToUpdate.comentarios_flete)
    setConceptos(purchaseOrderToUpdate.conceptos)
  }

  useEffect(() => {
    if (purchaseOrderToUpdate) {
      setDates()

    }
  }, [purchaseOrderToUpdate])


  console.log(purchaseOrderToUpdate)



  const fetch = async () => {
    let data = {
      nombre: "",
      is_flete: true,
      id_usuario: user_id
    }
    let result = await APIs.getSuppliers(data)
    setSuppliers(result)
  }


  useEffect(() => {
    fetch()
    getSeriesXUser(12)
    getAreasXBranchOfficesXUsers(0, 12)
    setType(0)

  }, [])

  // Modal de crear orden de compra
  // Inicializar el estado como un número
  const [typeModal, setType] = useState<number | null>(null);
  const handleModalType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = parseInt(e.target.value); // Convertir el valor a un número
    setType(selectedValue);
  };

  const handleCheckboxClick = (value: number) => {
    setType(value);
    console.log(value)
  };



  // const hoy = new Date();
  // const haceUnaSemana = new Date();
  // haceUnaSemana.setDate(hoy.getDate() - 7);

  // Inicializa el estado con las fechas formateadas
  // const [date, setDate] = useState([
  // haceUnaSemana.toISOString().split('T')[0],
  // hoy.toISOString().split('T')[0]
  // ]);


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

  console.log(arrivalDate)



  // select de empresas
  const [filteredModalBranchOffices, setFilteredModalBranchOffices] = useState<any[]>([])



  const openSelectModalCompanies = () => {
    setSelectModalCompanies(!selectModalCompanies)
  }



  const handleModalCompaniesChange = async (company: any) => {
    setSelectedModalCompany(company.id)
    setSelectModalCompanies(false)
    let resultB: any = await APIs.getBranchOfficesXCompanies(company.id, user_id)
    console.log(resultB)
    setBranchOffices(resultB)
  }


  const openSelectModalBranchOffices = () => {
    setSelectModalBranchOffices(!selectModalBranchOffices)

  }

  const handleModalBranchOfficesChange = (branchOffice: any) => {
    setSelectedModalBranchOffice(branchOffice.id)
    setSelectModalBranchOffices(false)

  }



  // Select tipos de compra
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
  const [selectedTypeSearch, setSelectedTypeSearch] = useState<number | null>(null)

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




  const [selectByRequestCompanies, setSelectByRequestCompanies] = useState<boolean>(false)
  const [selectedByRequestCompany, setSelectedByRequestCompany] = useState<number | null>(null)
  const [selectByRequestBranchOffices, setSelectByRequestBranchOffices] = useState<boolean>(false)
  const [selectedByRequestBranchOffice, setSelectedByRequestBranchOffice] = useState<number | null>(null)

  const openSelectByRequestCompanies = () => {
    setSelectByRequestCompanies(!selectByRequestCompanies)
  }

  const openSelectByRequestBranchOffices = () => {
    setSelectByRequestBranchOffices(!selectByRequestBranchOffices)
  }

  const [filterByRequestBranchOffice, setFilterByRequestBranchOffice] = useState<any[]>([])

  const handleByRequestCompaniesChange = (company: any) => {
    setSelectedByRequestCompany(company.id)
    setSelectByRequestCompanies(false)
    automaticSelector(company.id)

  }

  const automaticSelector = (comapny_id: any) => {
    const filter = branchOfficeXCompanies.filter((x: any) => x.empresa_id === comapny_id)
    setFilterByRequestBranchOffice(filter)
    setSelectedByRequestBranchOffice(filter.length > 0 ? filter[0].id : null);
  }

  const handleByRequestBranchOfficesChange = (branchOffice: any) => {
    setSelectedByRequestBranchOffice(branchOffice.id)
    setSelectByRequestBranchOffices(false)
    automaticAreaSelector(branchOffice.id)
  }

  const [areaFiltering, setAreaFiltering] = useState<any[]>([])

  const automaticAreaSelector = (branchOffice_id: any) => {
    const filter = areasXBranchOfficesXUsers.filter((x: any) => x.sucursal_id === branchOffice_id)
    console.log(filter)
    setAreaFiltering(filter)
    setSelectedByRequestArea(filter.length > 0 ? filter[0].id : null);
  }



  const [selectModalSeries, setSelectModalSeries] = useState<boolean>(false)
  const [selectedModalSerie, setSelectedModalSerie] = useState<number | null>(null)

  const openSelectModalSeries = () => {
    setSelectModalSeries(!selectModalSeries)
  }

  const handleModalSeriesChange = (serie: any) => {
    setSelectedModalSerie(serie.id)
    setSelectModalSeries(false)
  }


  const [selectByRequestAreas, setSelectByRequestAreas] = useState<boolean>(false)
  const [selectedByRequestArea, setSelectedByRequestArea] = useState<number | null>(null)

  const openSelectByRequestAreas = () => {
    setSelectByRequestAreas(!selectByRequestAreas)
  }

  const handleByRequestAreasChange = (area: any) => {
    setSelectedByRequestArea(area.id)
    setSelectByRequestAreas(false)

  }



  const [selectByRequestTypes, setSelectByRequestTypes] = useState<boolean>(false)
  const [selectedByRequestType, setSelectedByRequestType] = useState<number | null>(null)


  const openSelectByRequestTypes = () => {
    setSelectByRequestTypes(!selectByRequestTypes)
  }

  const handleByRequestTypesChange = (type: any) => {
    setSelectedByRequestType(type.id)
    setSelectByRequestTypes(false)
  }




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

  console.log('conceptos', conceptos)

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

    setConceptos((prevArticleStates: any) => [...prevArticleStates, { id_proveedor, proveedores, id_articulo, descripcion, cantidad: null, descuento: null, unidad, unidades, precio_unitario: null, comentarios: '' }]);
  };


  const [dateRange, setDateRange] = useState([null, null]);


  ////////////////////////
  /// Fechas
  ////////////////////////
  // Estado para almacenar las fechas seleccionadas
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);

  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

  // Método para inicializar Flatpickr
  const initFlatpickr = () => {
    let storedStartDate = localStorage.getItem('selectedStartDate');
    let storedEndDate = localStorage.getItem('selectedEndDate');

    if (!storedStartDate || !storedEndDate) {
      const defaultStartDate = new Date();
      defaultStartDate.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00.000
      const defaultEndDate = new Date(defaultStartDate.getTime() - 7 * 24 * 60 * 60 * 1000); // Fecha de hace una semana
      defaultEndDate.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00.000


      setSelectedStartDate(defaultStartDate);
      setSelectedEndDate(defaultEndDate);

      storedStartDate = defaultStartDate.toISOString().split('T')[0];
      storedEndDate = defaultEndDate.toISOString().split('T')[0];
    } else {
      setSelectedStartDate(new Date(storedStartDate));
      setSelectedEndDate(new Date(storedEndDate));
    }


    // React.useEffect(() => {
    //   flatpickr('#dateRangePicker', {
    //     mode: 'range',
    //     dateFormat: 'Y-m-d',
    //     locale: 'es', // Establecer el idioma en español
    //     defaultDate: [selectedStartDate ?? '', selectedEndDate ?? ''], // Use empty string as fallback
    //     onChange: (selectedDates: Date[]) => {
    //       // Cuando se seleccionan fechas, actualiza los estados
    //       setSelectedStartDate(selectedDates[0]);
    //       setSelectedEndDate(selectedDates[1]);

    //       // Almacena las fechas seleccionadas en localStorage
    //       localStorage.setItem('selectedStartDate', selectedDates[0].toISOString());
    //       localStorage.setItem('selectedEndDate', selectedDates[1].toISOString());

    //       // Realizar la solicitud después de actualizar las fechas seleccionadas
    //     }
    //   });
    // }, [selectedStartDate, selectedEndDate]);


  };

  // Llamada a initFlatpickr después de que se renderiza el componente
  // useEffect(() => {
  //   initFlatpickr();
  // }, []);


  const filterByRequest = async () => {
    // let id = 0;
    // let folio = 0;
    // let id_serie = selectedModalSerie;
    // let id_sucursal = selectedByRequestBranchOffice;
    // let id_usuario = 12;
    // let id_area = 0;
    // let status = 0;
    // let desde = selectedStartDate;
    // let hasta = selectedEndDate;
    // let tipo = 0;
    // Llamada a la función asincrónica y esperar el resultado
    await getRequisition(0, 0, 0, user_id, 0, 0, '2024-03-19', '2024-04-21', 0)




  }






  const searchByRequest = () => {
    let id = 0
    let folio = invoice
    let id_serie = selectedModalSerie
    let id_sucursal = selectedByRequestBranchOffice
    let id_usuario = 12
    let id_area = 0
    let tipo = 0
    let status = 1
    let desde = '2024-03-19'
    let hasta = selectedEndDate

    getPurchaseOrders(id, folio, id_serie, id_sucursal, id_usuario, id_area, tipo, desde, hasta, status)
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
        precio_unitario: element.precio_unitario,
        proveedor: element.proveedor,
        unidad: element.unidades[0].id_unidad,
        id_proveedor: element.proveedores[0].id_proveedor
      }]));
    });


  }



  const closeModalConcepts = () => {
    setModalStateConcepts(false)
  }



  const addArticlesByRequest = () => {
    let id_articulo = requisitions.id
    // let proveedores = articleResult.proveedores
    // let unidades = articleResult.unidades
    setConceptos((prevArticleStates: any) => [...prevArticleStates, { id_proveedor: null, id_articulo, cantidad: null, descuento: null, unidad: '', precio_unitario: null, comentarios: '' }]);
  }


  const hanledCreateOC = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStateLoading(true);
    let data = {
      id: purchaseOrderToUpdate ? purchaseOrderToUpdate.id : null,
      id_usuario_crea: user_id,
      id_usuario_autoriza: 0,
      id_sucursal: selectedModalBranchOffice,
      fecha_creacion: '',
      fecha_llegada: '2024-04-02',
      status: 0,
      tipo: type,
      cotizacion: quoteComments,
      factura: bill,
      comentarios: OComments,
      id_proveedor_flete: selectedModalfreightProvider,
      costo_flete: freightCost,
      comentarios_flete: freightComments,
      sumar_flete: freightCostActive,
      conceptos,
      documento_anterior: '',
      documento_siguiente: ''
    };

    let dataGet = {
      folio: 0,
      id_serie: 0,
      id_sucursal: selectedBranchOffice,
      id_usuario: user_id,
      id_area: 0,
      // tipo: tipo,
      desde: '2024-09-20',
      hasta: '2024-10-30',
      status: type,
    };

    try {
      if (purchaseOrderToUpdate) {
        let resultCreate = await APIs.updatePurchaseOrders(data);
        let resultGet = await APIs.getPurchaseOrders(dataGet);
        setPurchaseOrders(resultGet)
        Swal.fire('Orden de compra creada exitosamente', '', 'success');
        setStateLoading(false);
        setModal('')
      } else {
        let result = await APIs.createPurchaseOrders(data);
        let resultGet = await APIs.getPurchaseOrders(dataGet);
        setPurchaseOrders(resultGet)
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

  const getPDFRequisition = async () => {
    try {
      await APIs.getPdfPurchaseOrders(purchaseOrderToUpdate.id);
      // Abrimos el PDF en una nueva pestaña
      window.open(`https://hiplotbusiness.com/api_dev/pdf_oc/${purchaseOrderToUpdate.id}`, '_blank');
      setModal('');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={`overlay__purchase-orders ${modal == 'modal-purchase-orders-create' || modal == 'modal-purchase-orders-update' ? 'active' : ''}`}>
      <div className={`popup__purchase-orders ${modal == 'modal-purchase-orders-create' || modal == 'modal-purchase-orders-update' ? 'active' : ''}`}>
        <div className='header__modal'>
          <a href="#" className="btn-cerrar-popup__purchase-orders" onClick={() => setModal('')} >
            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
          </a>
          <p className='title__modals'>Precios</p>
        </div>
        <form className='parchase-orders-modal' onSubmit={hanledCreateOC}>
          <div className='row__check'>
            {modal == 'modal-purchase-orders-update' ?
              <div className='code-type-orden'>
                <p>{`${purchaseOrderToUpdate.serie}-${purchaseOrderToUpdate.folio}-${purchaseOrderToUpdate.anio}`}</p>
                <p>{purchaseOrderToUpdate.usuario_crea}</p>
              </div>
              :
              ''
            }
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
              {purchaseOrderToUpdate ?
                <div className='select__container col-3'>
                  <label className='label__general'>Empresas</label>
                  <div className='container__text_result'>
                    <p className='text__result' >{purchaseOrderToUpdate.empresa}</p>
                  </div>
                </div>
                :
                <div className='select__container col-3'>
                  <label className='label__general'>Empresas</label>
                  <div className='select-btn__general'>
                    <div className={`select-btn ${selectModalCompanies ? 'active' : ''}`} onClick={openSelectModalCompanies}>
                      <div className='select__container_title'>
                        <p>{selectedModalCompany ? companiesXUsers.find((s: { id: number }) => s.id === selectedModalCompany)?.razon_social : 'Selecciona'}</p>
                      </div>
                      <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                    </div>
                    <div className={`content ${selectModalCompanies ? 'active' : ''}`}>
                      <ul className={`options ${selectModalCompanies ? 'active' : ''}`} style={{ opacity: selectModalCompanies ? '1' : '0' }}>
                        {companiesXUsers && companiesXUsers.map((company: any) => (
                          <li key={company.id} onClick={() => handleModalCompaniesChange(company)}>
                            {company.razon_social}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              }
              {purchaseOrderToUpdate ?
                <div className='select__container col-3'>
                  <label className='label__general'>Sucursales</label>
                  <div className='container__text_result'>
                    <p className='text__result'>{purchaseOrderToUpdate.sucursal}</p>
                  </div>
                </div>
                :
                <div className='select__container col-3'>
                  <label className='label__general'>Sucursales</label>
                  <div className='select-btn__general'>
                    <div className={`select-btn ${selectModalBranchOffices ? 'active' : ''}`} onClick={openSelectModalBranchOffices} >
                      <div className='select__container_title'>
                        <p>{selectedModalBranchOffice ? branchOffices?.find((s: { id: number }) => s.id === selectedModalBranchOffice)?.nombre : 'Selecciona'}</p>
                      </div>
                      <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                    </div>
                    <div className={`content ${selectModalBranchOffices ? 'active' : ''}`} >
                      <ul className={`options ${selectModalBranchOffices ? 'active' : ''}`} style={{ opacity: selectModalBranchOffices ? '1' : '0' }}>
                        {branchOffices?.map((branchOffice: any) => (
                          <li key={branchOffice.id} onClick={() => handleModalBranchOfficesChange(branchOffice)}>
                            {branchOffice.nombre}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              }
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
                <input className={`inputs__general ${warningInvoice}  ? 'warning' : ''}`} type="number" value={freightCost} onChange={handleInputFreightCostChange} placeholder='Costo' />
              </div>
              <div>
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
                <input className={`inputs__general ${warningInvoice}  ? 'warning' : ''}`} type="text" value={OComments} onChange={(e) => setOComments(e.target.value)} placeholder='Comentarios de la orden de compra' />
              </div>
            </div>
            <p className='title'>Articulos en Requisicion</p>
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
                            <p>{selectedModalResult ? `${articleResult.codigo} ${articleResult.nombre}` : 'Selecciona'}</p>
                            <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                          </div>
                          <div className={`content ${selectModalResults ? 'active' : ''}`}>
                            <ul className={`options ${selectModalResults ? 'active' : ''}`} style={{ opacity: selectModalResults ? '1' : '0' }}>
                              {resultModalOC && resultModalOC.map((item: any) => (
                                <li key={item.id} onClick={() => handleModalResultsChange(item)}>
                                  {`${item.codigo} ${item.nombre}`}
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
                <div className='conatiner__by-request'>
                  <div className='row__one'>
                    <div className='select__container'>
                      <label className='label__general'>Empresas</label>
                      <div className='select-btn__general'>
                        <div className={`select-btn ${selectByRequestCompanies ? 'active' : ''}`} onClick={openSelectByRequestCompanies}>
                          <p>{selectedByRequestCompany ? companiesXUsers.find((s: { id: number }) => s.id === selectedByRequestCompany)?.razon_social : 'Selecciona'}</p>
                          <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                        </div>
                        <div className={`content ${selectByRequestCompanies ? 'active' : ''}`}>
                          <ul className={`options ${selectByRequestCompanies ? 'active' : ''}`} style={{ opacity: selectByRequestCompanies ? '1' : '0' }}>
                            {companiesXUsers && companiesXUsers.map((company: any) => (
                              <li key={company.id} onClick={() => handleByRequestCompaniesChange(company)}>
                                {company.razon_social}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className='select__container'>
                      <label className='label__general'>Sucursales</label>
                      <div className='select-btn__general'>
                        <div className={`select-btn ${selectByRequestBranchOffices ? 'active' : ''}`} onClick={openSelectByRequestBranchOffices} >
                          <p>{selectedByRequestBranchOffice ? filterByRequestBranchOffice.find((s: { id: number }) => s.id === selectedByRequestBranchOffice)?.nombre : 'Selecciona'}</p>
                          <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                        </div>
                        <div className={`content ${selectByRequestBranchOffices ? 'active' : ''}`} >
                          <ul className={`options ${selectByRequestBranchOffices ? 'active' : ''}`} style={{ opacity: selectByRequestBranchOffices ? '1' : '0' }}>
                            {filterByRequestBranchOffice.map((branchOffice: any) => (
                              <li key={branchOffice.id} onClick={() => handleByRequestBranchOfficesChange(branchOffice)}>
                                {branchOffice.nombre}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className='select__container'>
                      <label className='label__general'>Areas</label>
                      <div className='select-btn__general'>
                        <div className={`select-btn ${selectByRequestAreas ? 'active' : ''}`} onClick={openSelectByRequestAreas} >
                          <p>{selectedByRequestArea ? areaFiltering.find((s: { id: number }) => s.id === selectedByRequestArea)?.nombre : 'Selecciona'}</p>
                          <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                        </div>
                        <div className={`content ${selectByRequestAreas ? 'active' : ''}`} >
                          <ul className={`options ${selectByRequestAreas ? 'active' : ''}`} style={{ opacity: selectByRequestAreas ? '1' : '0' }}>
                            {areaFiltering.map((area: any) => (
                              <li key={area.id} onClick={() => handleByRequestAreasChange(area)}>
                                {area.nombre}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className='dates__requisition'>
                      <label className='label__general'>Fechas</label>
                      <div className='container_dates__requisition'>
                        <input className='date' id="dateRangePicker" type="text" placeholder="Seleccionar rango de fechas" />
                      </div>
                    </div>
                  </div>
                  <div className='row__three'>
                    <div>
                      <div className='select__container'>
                        <label className='label__general'>Tipo</label>
                        <div className='select-btn__general'>
                          <div className={`select-btn ${selectByRequestTypes ? 'active' : ''}`} onClick={openSelectByRequestTypes} >
                            <p>{selectedByRequestType !== null ? types.find((s: { id: number }) => s.id === selectedByRequestType)?.name : 'Selecciona'}</p>
                            <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                          </div>
                          <div className={`content ${selectByRequestTypes ? 'active' : ''}`} >
                            <ul className={`options ${selectByRequestTypes ? 'active' : ''}`} style={{ opacity: selectByRequestTypes ? '1' : '0' }}>
                              {types.map((branchOffice: any) => (
                                <li key={branchOffice.id} onClick={() => handleByRequestTypesChange(branchOffice)}>
                                  {branchOffice.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div>
                        <button className='btn__general-purple' type='button' onClick={filterByRequest}>Filtrar</button>
                      </div>
                    </div>
                  </div>
                  <div className='row__four'>
                    <div className='select__container'>
                      <label className='label__general'>Serie</label>
                      <div className='select-btn__general'>
                        <div className={`select-btn ${selectModalSeries ? 'active' : ''}`} onClick={openSelectModalSeries} >
                          <p>{selectedModalSerie ? series.find((s: { id: number }) => s.id === selectedModalSerie)?.nombre : 'Selecciona'}</p>
                          <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                        </div>
                        <div className={`content ${selectModalSeries ? 'active' : ''}`} >
                          <ul className={`options ${selectModalSeries ? 'active' : ''}`} style={{ opacity: selectModalSeries ? '1' : '0' }}>
                            {series.map((serie: any) => (
                              <li key={serie.id} onClick={() => handleModalSeriesChange(serie)}>
                                {serie.nombre}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className='label__general'>Folio</label>
                      {/* <div className='warning__general' style={styleWarningName}><small >Este campo es obligatorio</small></div> */}
                      <input className={`inputs__general ${warningInvoice}  ? 'warning' : ''}`} type="text" value={invoice} onChange={(e) => setInvoice(e.target.value)} placeholder='Ingresa el folio' />
                    </div>
                    <div className='container__search'>
                      <button className='btn__general-purple btn__container' type='button' onClick={searchByRequest}>
                        Buscar
                        <svg className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /></svg>
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className={`overlay__modal_concepts ${modalStateConcepts ? 'active' : ''}`}>
                      <div className={`popup__modal_concepts ${modalStateConcepts ? 'active' : ''}`}>
                        <a href="#" className="btn-cerrar-popup__modal_concepts" onClick={closeModalConcepts}>
                          <svg className='close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                        </a>
                        <p className='title__modals'>Detalles de conceptos</p>
                        <div className='conatiner__concepts'>
                          {concepts.map((concepto: any, index: any) => (
                            <div className='row__one' key={index}>
                              <div>
                                <p className='text'>cantidad</p>
                                <p className='text'>{concepto.cantidad}</p>
                              </div>
                              <div>
                                <p className='text'>codigo</p>
                                <p className='text'>{concepto.codigo}</p>
                              </div>
                              <div>
                                <p className='text'>comentarios</p>
                                <p className='text'>{concepto.comentarios}</p>
                              </div>
                              <div>
                                <p className='text'>descripcion</p>
                                <p className='text'>{concepto.descripcion}</p>
                              </div>
                              <div>
                                <p className='text'>iva</p>
                                <p className='text'>{concepto.iva_on}</p>
                              </div>
                              <div>
                                <p className='text'>precio_unitario</p>
                                <p className='text'>{concepto.precio_unitario}</p>
                              </div>
                              <div>
                                <p className='text'>proveedor</p>
                                <p className='text'>{concepto.proveedor}</p>
                              </div>
                              <div>
                                <p className='text'>unidad</p>
                                <p className='text'>{concepto.unidad}</p>
                              </div>
                            </div>
                          ))}
                          <div className='row__two'>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='row__two'>
                    <div>
                      <div className='table__modal_filter_purchase-order' >
                        <div>
                          <div>
                            {requisitions ? (
                              <div className='table__numbers'>
                                <p className='text'>Tus ordenes de compras</p>
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
                          {requisitions.length > 0 ? (
                            <div className='table__body'>
                              {requisitions.map((requisition: any, index: any) => (
                                <div className='tbody__container' key={index}>
                                  <div className='tbody'>
                                    <div className='td'>
                                      {requisition.empresa}
                                    </div>
                                    <div className='td'>
                                      ({requisition.sucursal})
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
                                        <button className='btn__general-purple' type='button' onClick={addArticlesByRequest}>Agregar</button>
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
              }

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
                                {article.descripcion}
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
                                <p>N/A</p>
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
                                    <input type="checkbox" onChange={(e) => handleExtraDiscountChange(e, index)} />
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
              <button className='btn__general-purple d-flex align-items-center' type='submit'>
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
        </form>
      </div >
    </div >
  )
}

export default ModalPurchaseOrders
