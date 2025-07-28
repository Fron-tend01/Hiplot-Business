import React, { useEffect, useState } from 'react';
import { storeModals } from '../../../../../zustand/Modals';
import Swal from 'sweetalert2'
import { useStore } from 'zustand';
import './ModalCreate.css';
import Empresas_Sucursales from '../../../Dynamic_Components/Empresas_Sucursales';
import SalesCard from '../SalesCard';
import { storeArticleView } from '../../../../../zustand/ArticleView';
import ArticleViewModal from '../ArticleViewModal';
import { storeSaleCard } from '../../../../../zustand/SaleCard';
import { storePersonalized } from '../../../../../zustand/Personalized';
import Personalized from '../Personalized';
import { useSelectStore } from '../../../../../zustand/Select';
import { ClientsRequests } from '../../../../../fuctions/Clients';
import APIs from '../../../../../services/services/APIs';
import useUserStore from '../../../../../zustand/General';
import { storeQuotation } from '../../../../../zustand/Quotation';
import SeeClient from '../SeeClient';
import SeeCamposPlantillas from '../SeeCamposPlantillas';
import { storeDv } from '../../../../../zustand/Dynamic_variables';
import { storeSaleOrder } from '../../../../../zustand/SalesOrder';
import ModalSalesOrder from '../sales_order/ModalSalesOrder';
import { toast } from 'sonner'
import DynamicVariables from '../../../../../utils/DynamicVariables';
import axios from 'axios';
import { storeArticles } from '../../../../../zustand/Articles';



const ModalCreate: React.FC = () => {
  const userState = useUserStore(state => state.user);
  const user_id = userState.id
  const setModalArticleView = storeArticleView((state) => state.setModalArticleView);
  const setPersonalizedModal = storePersonalized((state) => state.setPersonalizedModal);
  const setCustomConceptView = storePersonalized((state) => state.setCustomConceptView);

  const setQuotesData = storeQuotation(state => state.setQuotesData)
  const { dataGet }: any = useStore(storeQuotation);

  ////////////////// Personalized Variations////////////////////////////////// 
  const { dataUpdate, personalizedModal }: any = useStore(storePersonalized)
  const permisosxVista = storeDv((state) => state.permisosxvista);

  const setQuotes = storeQuotation(state => state.setQuotes)
  const { quotes }: any = useStore(storeQuotation);

  const setModalSalesOrder = storeSaleOrder(state => state.setModalSalesOrder)

  const setDataQuotation = storeSaleCard(state => state.setDataQuotation)
  const setModal = storeModals((state) => state.setModal);
  const { modal }: any = useStore(storeModals)
  const setModalSub = storeModals((state) => state.setModalSub);

  const setClientsModal = storeQuotation((state) => state.setClientsModal);
  const setClient = storeQuotation((state) => state.setClient);


  const { quatation }: any = useStore(storeQuotation)
  const { getClients }: any = ClientsRequests()


  const [company, setCompany] = useState<any>([])
  const [branch, setBranch] = useState<any>([])

  const [calculations, setCalculations] = useState<any>({
    subtotal: 0,
    descuento: 0,
    urgencia: 0,
    total: 0,

    subtotalf: 0,
    urgenciaf: 0,
    totalf: 0
  })


  const modalPersonalized = () => {
    setIdItem(null)
    setPersonalizedModal('personalized_modal-quotation')
    setCustomConceptView(quotes.normal_concepts)
  }

  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [info_sc, setInfo_sc] = useState<any>({
    vendedor: 0,
    vendedores: [],
    cot_propia: true,
    folio_sc: 0,
    info_sc: {},
    folios_solicitudes: []
  })


  const [quoteFields, setQuoteFields] = useState<any>({})
  const setData = () => {
    if (modal == 'create-modal__qoutation') {
      setQuoteFields({
        id: 0,
        id_sucursal: branch.id,
        id_cliente: null,
        id_usuario_crea: user_id,
        titulo: '',
        comentarios: '',
        conceptos: quotes?.normal_concepts,
        conceptos_pers: quotes?.personalized_concepts,
        conceptos_elim: quotes?.normal_concepts_eliminate,
        conceptos_pers_elim: quotes?.personalized_concepts_eliminate,
        id_solicitud_cotizacion: info_sc.cot_propia ? user_id : info_sc.folio_sc == '' ? info_sc.folio_sc : 0,
      })
      setClients([])
      setName('')
      setSelectedId('clients', { id: 0 });
      setSelectedResult({ id: 0 })
    } else {
      quotes.normal_concepts.forEach(element => {
        element.check = false;
      });
      quotes.personalized_concepts.forEach(element => {
        element.check = false;
      })
      setQuoteFields({
        id: modal === 'create-modal__qoutation' ? 0 : quotes.quotes.id,
        id_sucursal: modal === 'create-modal__qoutation' ? branch.id : quatation.id_sucursal,
        id_cliente: selectedResult?.id ?? quatation.id_cliente,
        id_usuario_crea: user_id,
        titulo: quotes.quotes.titulo,
        comentarios: quotes.quotes.comentarios,
        conceptos: quotes?.normal_concepts,
        conceptos_pers: quotes?.personalized_concepts,
        conceptos_elim: quotes?.normal_concepts_eliminate,
        conceptos_pers_elim: quotes?.personalized_concepts_eliminate,
        id_solicitud_cotizacion: info_sc.cot_propia ? user_id : info_sc.folio_sc == '' ? info_sc.folio_sc : 0,
      })
      setName(quotes.quotes.Razon_social)
      searchCli(quotes.quotes.Razon_social)

    }

  }
  const searchCli = async (rs: string) => {
    const data = {
      id_sucursal: branch.id,
      id_usuario: user_id,
      nombre: rs,
      activos: true
    }

    try {
      const resultClients = await getClients(data)
      setClients(resultClients)
      setSelectedResult(resultClients[0])

      setSelectedId('clients', resultClients[0]);
    } catch (error) {

    }
  }
  useEffect(() => {
    setQuoteFields({
      id: modal === 'create-modal__qoutation' ? 0 : quotes.quotes.id,
      id_sucursal: modal === 'create-modal__qoutation' ? branch.id : quatation.id_sucursal,
      id_cliente: selectedResult?.id ?? quatation.id_cliente,
      id_usuario_crea: user_id,
      titulo: quotes.quotes.titulo,
      comentarios: quotes.quotes.comentarios,
      conceptos: quotes?.normal_concepts,
      conceptos_pers: quotes?.personalized_concepts,
      conceptos_elim: quotes?.normal_concepts_eliminate,
      conceptos_pers_elim: quotes?.personalized_concepts_eliminate,
      id_solicitud_cotizacion: info_sc.cot_propia ? user_id : info_sc.folio_sc == '' ? info_sc.folio_sc : 0,
    })
    fetch()
  }, [quotes])

  useEffect(() => {
    setData()
  }, [modal, personalizedModal])

  console.log('quotes', quotes)


  const fetch = async () => {
    let dataUsers = {
      nombre: '',
      id_usuario: user_id,
      id_usuario_consulta: user_id,
      light: true,
      id_sucursal: modal === 'create-modal__qoutation' ? branch.id : quatation.id_sucursal
    }
    let resultUsers: any = await APIs.getUsers(dataUsers)
    DynamicVariables.updateAnyVar(setInfo_sc, 'vendedores', resultUsers)
    if (modal == 'create-modal__qoutation') {
      traerSolicitudes(resultUsers[0].id)


    } else {

    }
  }
  const setSaleOrdersToUpdate = storeSaleOrder(state => state.setSaleOrdersToUpdate)

  const setModalLoading = storeArticles((state: any) => state.setModalLoading);
  const setSaleOrdersConcepts = storeSaleOrder((state) => state.setSaleOrdersConcepts);
  // const setDataGet = storeSaleOrder((state) => state.setSaleOrders);

  const mandarAOV = async () => {
    quotes.fecha_creacion = new Date().toISOString().split('T')[0];
    quotes.normal_concepts.forEach(element => {
      element.enviar_a_produccion = userState.forzar_produccion
    });
    quotes.personalized_concepts.forEach(element => {
      element.conceptos.forEach(el => {
        el.enviar_a_produccion = userState.forzar_produccion
        if (el.comentarios_prod !== undefined && el.comentarios_prod !== null) {
          el.obs_produccion = el.comentarios_prod;
        }

        if (el.comentarios !== undefined && el.comentarios !== null) {
          el.obs_factura = el.comentarios;
        }
      });
    });
    quotes.conceptos = quotes.normal_concepts
    quotes.conceptos_pers = quotes.personalized_concepts
    quotes.id_sucursal = quatation.id_sucursal
    quotes.id_cliente = quatation.id_cliente
    quotes.id_usuario_crea = user_id
    quotes.id_usuario = user_id

    quotes.conceptos = quotes.conceptos.filter((x: any) => x.check == true)
    quotes.conceptos_pers = quotes.conceptos_pers.filter((x: any) => x.check == true)
    if (quotes.conceptos.length == 0 && quotes.conceptos_pers.length == 0) {
      Swal.fire('Advertencia', 'Debe seleccionar al menos un concepto para enviar a OV', 'warning');
      return
    }
    setModalLoading(true)
    await APIs.CreateAny(quotes, 'enviar_cot_a_ov').then(async (resp: any) => {
      if (!resp.error) {
        await APIs.GetAny('get_carrito/' + user_id).then((r: any) => {
          let orden = r[0]
          setSaleOrdersConcepts({ sale_order: orden, normal_concepts: orden?.conceptos ?? [], personalized_concepts: orden?.conceptos_pers ?? [] });
          setModalLoading(false)
          setModalSalesOrder('sale-order__modal')
          // setSaleOrdersToUpdate(orden)
        })
        Swal.fire('Notificacion', resp.mensaje, 'success')
      } else {
        setModalLoading(false)
        Swal.fire('Notificacion', resp.mensaje, 'warning')
      }
    }).finally(() => {
      setModalLoading(false)
    })
  }

  useEffect(() => {
    fetch()
  }, [branch])

  const client = async () => {
    const data = {
      id_sucursal: quatation.id_sucursal,
      id_usuario: user_id,
      nombre: quatation.rfc,
      activos: true

    }


    try {
      const resultClients = await getClients(data)
      setClients(resultClients)

      setSelectedId('clients', { id: quatation.id_cliente });
      setSelectedResult({ id: quatation.id_cliente })
    } catch (error) {

    }
  }


  useEffect(() => {
    if (modal == 'update-modal__qoutation') {
      setQuoteFields((prev: any) => ({
        ...prev,
        comentarios: quotes.quotes.comentarios,
      }));
      DynamicVariables.updateAnyVar(setInfo_sc, 'vendedor', quotes.quotes.id_usuario_crea)
    }
  }, [modal])




  const selectedIds: any = useSelectStore((state) => state.selectedIds);
  const setSelectedId = useSelectStore((state) => state.setSelectedId);

  const [clients, setClients] = useState<any>([])
  const [clienteOff, setClienteOff] = useState<boolean>(false)


  const searchUsers = async () => {
    const data = {
      id_sucursal: branch.id || quotes.quotes.id_sucursal,
      id_usuario: user_id,
      nombre: name,
      activos: true

    }

    try {
      const resultClients = await getClients(data)
      setClients(resultClients)
      setSelectedResult(resultClients[0])

      setSelectedId('clients', resultClients[0]);
      let off = !resultClients[0].status ? true : false
      setClienteOff(off)
    } catch (error) {

    }

  }


  // const DataCampos = storeDv(state => state.DataCampos)
  const setDataCampos = storeDv(state => state.setDataCampos)
  const setIndexVM = storeDv(state => state.setIndex)
  const seeVerMas = (index: number, type: string) => { //AL ABRIR SEE-CP NO SE VISUALIZA LA INFORMACIÓN DE LAS PLANTILLAS PORQUE SIGUE USANDO NORMALCONCEPTS CORREGIR AQUÍ Y EN LA COTIZACIÓN
    setIndexVM(index)
    setDataCampos({ tipo: type })
    setModalSub('see_cp')
  }
  const [selectResults, setSelectResults] = useState<boolean>(false);


  const openSelectResults = () => {
    setSelectResults(!selectResults)
  }

  const handleResultsChange = (result: any) => {
    setQuoteFields((prev: any) => ({
      ...prev,
      id_cliente: result.id
    }));

    setClient(result)
    setSelectedResult(result);
    setSelectResults(!selectResults)
  };
  useEffect(() => {
    if (selectedResult) {
      let result = selectedResult
      let off = !result.status ? true : false
      setClienteOff(off)
    }
  }, [selectedResult])
  const permisosxVistaheader = storeDv((state) => state.permisosxvistaheader);
  const checkPermission = (elemento: string) => {
    return permisosxVistaheader.some((x: any) => x.titulo == elemento)
  }

  const createQuotation = async () => {
    try {
      setModalLoading(true)
      if (modal === 'create-modal__qoutation') {
        let copy_data = { ...quoteFields }
        copy_data.id_cliente = selectedResult?.id ?? 0
        if (copy_data.id_cliente == 0 || copy_data.id_cliente == undefined || copy_data.id_cliente == null) {
          setModalLoading(false)

          Swal.fire('Advertencia', 'Debe seleccionar un cliente', 'warning');
          return
        }
        if (clienteOff) {
          setModalLoading(false)
          Swal.fire('Advertencia', 'No se puede vender a este cliente porque se encuentra deshabilitado', 'warning');
          return
        }
        if (!info_sc.cot_propia) {
          copy_data.id_usuario_crea = info_sc.vendedor
        } else {
          copy_data.id_usuario_crea = user_id
        }
        copy_data.id_sucursal = branch?.id
        copy_data.id_solicitud_cotizacion = info_sc?.folio_sc || 0
        // debugger
        // return
        if (copy_data?.conceptos != undefined && copy_data?.conceptos?.length > 0) {
          copy_data?.conceptos?.forEach(element => {
            element.descuento = element.descuento == null ? 0 : element.descuento
            element?.campos_plantilla.forEach(el => {
              el.valor = el.valor.toString()
            });
          });
        }
        if (copy_data?.conceptos_pers != undefined && copy_data?.conceptos_pers?.length > 0) {
          copy_data?.conceptos_pers?.forEach(element => {
            element?.conceptos?.forEach(el => {
              el.unidad = el.id_unidad
              el.descuento = 0
              el?.campos_plantilla.forEach(e => {
                e.valor = e.valor.toString()
              });
            });
          });
        }

        const response: any = await APIs.createQuotation(copy_data);
        if (response.error == true) {
          setModalLoading(false)

          return Swal.fire('Advertencia', response.mensaje, 'warning');
        } else {
          Swal.fire('Cotizacion creada exitosamente', '', 'success');
          let response: any = await APIs.getQuotation(dataGet);
          setQuotesData(response)
          setModal('')
          setQuotes({ sale_order: {}, normal_concepts: [], personalized_concepts: [], normal_concepts_eliminate: [], personalized_concepts_eliminate: [] })
          localStorage.removeItem("cotizacion");
          localStorage.removeItem("cotizacion-pers");
          setModalLoading(false);
        }
      } else {
        let copy_data = { ...quoteFields }
        if (copy_data.id_cliente == 0 || copy_data.id_cliente == undefined || copy_data.id_cliente == null) {
          setModalLoading(false)

          Swal.fire('Advertencia', 'Debe seleccionar un cliente', 'warning');
          return
        }
        if (clienteOff) {
          setModalLoading(false)
          Swal.fire('Advertencia', 'No se puede vender a este cliente porque se encuentra deshabilitado', 'warning');
          return
        }
        copy_data.id_cliente = selectedResult?.id ?? copy_data.id_cliente
        debugger
        if (!info_sc.cot_propia) {
          copy_data.id_usuario_crea = info_sc.vendedor
        } else {
          copy_data.id_usuario_crea = user_id
        }
        copy_data.id_sucursal = copy_data.id_sucursal
        copy_data.id_solicitud_cotizacion = info_sc?.folio_sc || 0
        // return
        if (copy_data?.conceptos != undefined && copy_data?.conceptos?.length > 0) {
          copy_data?.conceptos?.forEach(element => {
            // if (element?.id && element.id > 0) {
            //   element.obs_factura = element.comentarios
            //   element.obs_produccion = element.comentarios_prod
            // }
            element?.campos_plantilla.forEach(el => {
              el.valor = el.valor.toString()
            });
          });
        }
        if (copy_data?.conceptos_pers != undefined && copy_data?.conceptos_pers?.length > 0) {
          copy_data?.conceptos_pers?.forEach(element => {
            element.clave_unidad_sat = element.clave_unidad
            element?.conceptos?.forEach(el => {
              // if (element?.id && element.id > 0) {
              //   element.obs_factura = element.comentarios
              //   element.obs_produccion = element.comentarios_prod
              // }
              el.unidad = el.id_unidad
              el.descuento = 0
              el?.campos_plantilla.forEach(e => {
                e.valor = e.valor.toString()
              });
            });
          });
        }

        setModalLoading(true)
        let response: any = await APIs.updateQuotation(copy_data);
        if (response.error == true) {
          setModalLoading(false)

          return Swal.fire('Advertencia', response.mensaje, 'warning');
        } else {
          Swal.fire('Cotizacion actualizada exitosamente', '', 'success');
          // Swal.fire('Cotizacion creada exitosamente', '', 'success');
          const dataSaleOrders = {
            id: quatation.id
          }
          const result = await APIs.getQuotation(dataSaleOrders)
          let order_search = result[0]
          setModal('update-modal__qoutation');
          setQuotes({ quotes: order_search, normal_concepts: order_search.conceptos, personalized_concepts: order_search.conceptos_pers });
          setQuatation(order_search);
          setModalLoading(false)
        }
      }

    } catch (error) {
      setModalLoading(false)

      Swal.fire('Error', 'Hubo un error al crear la cotizacion:' + error, 'error');
    }

  }
  const undoConcepts = (concept: any, i: number, adicional: boolean) => {
    const deleteItemCustomC = quotes?.personalized_concepts.filter((_: any, index: number) => index !== i);

    const updatedConcepts = concept.conceptos.map((element: any) => ({
      ...element,
      id_pers: 0,
      check: false,
      obs_factura: element.comentarios ?? element.obs_factura,
      obs_produccion: element.comentarios_prod ?? element.obs_produccion,
    }));

    setQuotes({
      ...quotes,
      normal_concepts: [...quotes?.normal_concepts, ...updatedConcepts],
      personalized_concepts: deleteItemCustomC,
      personalized_concepts_eliminate: concept.id
        ? [...quotes.personalized_concepts_eliminate, concept.id]
        : [...quotes.personalized_concepts_eliminate],
    });
    localStorage.setItem(
      'cotizacion',
      JSON.stringify([...(quotes?.normal_concepts ?? []), ...updatedConcepts])
    );
    localStorage.setItem('cotizacion-pers', JSON.stringify(deleteItemCustomC));
  };
  const clearCotizacion = () => {
    Swal.fire({
      title: "Deseas eliminar todos los conceptos de tu cotización?",
      text: "Esta acción no se puede deshacer",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      denyButtonText: `Cancelar`
    }).then(async (result) => {
      if (result.isConfirmed) {
        setQuotes({
          ...quotes,
          normal_concepts: [],
          personalized_concepts: [],
          personalized_concepts_eliminate: [],
        });

        localStorage.removeItem('cotizacion');
        localStorage.removeItem('cotizacion-pers');
      }
    });

  };
  // const undoConcepts = (concept: any, i: number, adicional:boolean) => {
  //   const deleteItemCustomC = quotes?.personalized_concepts.filter((_: any, index: number) => index !== i);
  //   const updatedConcepts = concept.conceptos.map((element: any) => ({
  //     ...element,
  //     id_pers: 0,
  //     check: false,
  //   }));
  //   setQuotes({ normal_concepts: [...quotes?.normal_concepts, ...updatedConcepts], personalized_concepts: deleteItemCustomC, personalized_concepts_eliminate: concept.id ? [...quotes.personalized_concepts_eliminate, concept.id] : [...quotes.personalized_concepts_eliminate] });
  //   localStorage.setItem('cotizacion', JSON.stringify([...(quotes?.normal_concepts ?? []), ...updatedConcepts]));
  //   localStorage.setItem('cotizacion-pers', JSON.stringify(deleteItemCustomC));
  // };


  const deleteNormalConcept = (item: any, i: number) => {
    const filter = quotes?.normal_concepts.filter((_: any, index: number) => index !== i)
    setQuotes({ normal_concepts: filter, normal_concepts_eliminate: item.id ? [...quotes.normal_concepts_eliminate, item.id] : [...quotes.normal_concepts_eliminate] });
    localStorage.setItem('cotizacion', JSON.stringify(filter));
    toast.success('Concepto eliminado')
  }






  const closeModal = () => {
    setModal('')
    setDataQuotation([])
    setQuotes({ normal_concepts: [], personalized_concepts: [] });
    const cotizacion = JSON.parse(localStorage.getItem('cotizacion') || "[]");
    const cotizacion_pers = JSON.parse(localStorage.getItem('cotizacion-pers') || "[]");
    if (cotizacion) {
      setQuotes({ normal_concepts: cotizacion });
    }
    if (cotizacion_pers) {
      setQuotes({ personalized_concepts: cotizacion_pers });
    }
  }

  const [typeLocalStogare, setTypeLocalStogare] = useState<any>()
  const [idItem, setIdItem] = useState<number>()
  const [indexItem, setIndexItem] = useState<any>()

  const modalPersonalizedUpdate = (concept: any, index: number) => {
    setIndexItem(index)
    setPersonalizedModal('personalized_modal-quotation-update');

    // if (concept.con_adicional) {
    //   setPersonalizedModal('personalized_modal-quotation-update-additional');
    // } else {
    //   setPersonalizedModal('personalized_modal-quotation-update');
    // }
    setIdItem(concept);
    quotes?.normal_concepts?.forEach((element: any) => {
      element.check = false;
    });
    concept.conceptos.forEach((element: any) => {
      element.check = true;
    });
    setCustomConceptView([...concept.conceptos, ...quotes.normal_concepts]);
  }



  const handleUrgencyChange = async (index: number) => { //FALTA APLICAR FRANQUICIA
    let data = {
      "id_articulo": quotes?.normal_concepts[index].id_articulo,
      "id_sucursal": quotes?.quotes?.id_sucursal ? quotes.quotes.id_sucursal : branch.id,
      "total": quotes?.normal_concepts[index].precio_total
    }
    const newConcept = [...quotes?.normal_concepts];

    if (newConcept[index].urgency) {
      console.log('newConcept precio_total', newConcept[index].precio_total)
      newConcept[index].precio_total = parseFloat(newConcept[index].precio_total);
      newConcept[index].urgencia = 0;

      newConcept[index].urgency = !newConcept[index]?.urgency;

    } else {
      await APIs.CreateAny(data, "calcular_urgencia")
        .then(async (response: any) => {
          if (!response.error) {
            newConcept[index].urgencia = parseFloat(response.monto_urgencia);
          } else {
            Swal.fire('Notificación', response.mensaje, 'warning');
            return
          }
        })
      newConcept[index].urgency = !newConcept[index]?.urgency;
    }
    setQuotes({ normal_concepts: newConcept, personalized_concepts: quotes.personalized_concepts });

  };
  const handleUrgencyChangeInPers = async (index: number, indexConcept: number) => {
    // Clonamos los conceptos personalizados
    const updatedPers = [...quotes.personalized_concepts];

    // Validación de existencia
    if (!updatedPers[index] || !updatedPers[index].conceptos?.[indexConcept]) {
      console.warn("Índices inválidos");
      return;
    }

    let concepto = updatedPers[index].conceptos[indexConcept];
    let data = {
      "id_articulo": concepto.id_articulo,
      "id_sucursal": quotes?.quotes?.id_sucursal || branch.id,
      "total": Number(concepto.precio_total || 0)
    };
    if (concepto.urgency) {
      // Quitar urgencia
      concepto.urgency = false;
      updatedPers[index].precio_total = Number(updatedPers[index].precio_total) - Number(concepto.urgencia || 0);
      concepto.urgencia = 0;
    } else {
      // Agregar urgencia
      const response: any = await APIs.CreateAny(data, "calcular_urgencia");
      if (!response.error) {
        const urgencia = Number(response.monto_urgencia);
        concepto.urgency = true;
        concepto.urgencia = urgencia;

        updatedPers[index].precio_total = Number(updatedPers[index].precio_total) + urgencia;
        debugger
      } else {
        Swal.fire("Notificación", response.mensaje, "warning");
        return;
      }
    }

    // Guardamos cambios
    setQuotes({ ...quotes, personalized_concepts: updatedPers });
    localStorage.setItem("cotizacion-pers", JSON.stringify(updatedPers));
  };
  //EFFECT PARA CALCULAR LOS TOTALES CUANDO CAMBIE NORMALCONCEPTS-----------------------------------------------------------------------------
  useEffect(() => {
    const calculateTotals = (concepts: any[]) =>
      concepts.reduce(
        (acc, item) => ({
          precio_unitario: acc.precio_unitario + (parseFloat(item.precio_unitario) || 0),
          descuento: acc.descuento + (parseFloat(item.descuento) || 0),
          urgencia: acc.urgencia + (parseFloat(item.urgencia) || 0),
          total: acc.total + (parseFloat(item.precio_total) || 0),
          total_franquicia: acc.total_franquicia + (parseFloat(item.total_franquicia) || 0),
        }),
        { precio_unitario: 0, descuento: 0, urgencia: 0, total: 0, total_franquicia: 0 }
      );

    const precios = calculateTotals(quotes?.normal_concepts || []);
    const preciospers = calculateTotals(quotes?.personalized_concepts || []);

    setCalculations((prev) => ({
      ...prev,
      subtotal: preciospers.total + precios.total,
      descuento: preciospers.descuento + precios.descuento,
      urgencia: preciospers.urgencia + precios.urgencia,
      total: preciospers.total +
        precios.total +
        preciospers.descuento +
        precios.descuento +
        (preciospers.urgencia ?? 0) +
        (precios.urgencia ?? 0),

      subtotalf: preciospers.total_franquicia + precios.total_franquicia,
      urgenciaf: 0,
      totalf: preciospers.total_franquicia + precios.total_franquicia,
    }));
  }, [quotes]);


  const setModalSalesCard = storeSaleCard(state => state.setModalSalesCard);



  const [dataArticle, setDataArticle] = useState<any>();
  const [idA, setIdA] = useState<any>(null);


  const setIdArticle = storeSaleCard(state => state.setIdArticle)

  const [i, setI] = useState(0);
  const [indexUpdate, setIndexUpdate] = useState<any>(null)
  const abrirFichaModifyConcept = async (x: any, index: number) => {
    setI((prevI) => {
      const newI = prevI + 1;
      setIdA(newI); // Ahora usará el valor actualizado
      return newI;
    });
    setIdArticle(x.id_articulo)

    setIndexUpdate(index)
    setDataArticle(x)
    setModalSalesCard('sale-card-quotation')
  }

  const [typeConcept, setTypeConcept] = useState<string>('')

  const getTicket = async () => {
    try {
      // Abrimos el PDF en una nueva pestaña
      window.open(`http://hiplot.dyndns.org:84/api_dev/pdf_cotizacion/${quatation.id}`, '_blank');
    } catch (error) {
      console.log(error);
    }
  }
  const getTicket2 = async () => {
    try {
      // Abrimos el PDF en una nueva pestaña
      window.open(`http://hiplot.dyndns.org:84/api_dev/pdf_cotizacion_no_precios/${quatation.id}`, '_blank');
    } catch (error) {
      console.log(error);
    }
  }
  const getTicket3 = async () => {
    const { value: tc } = await Swal.fire({
      title: "¿Que tipo de cambio deseas usar?",
      input: "number",
      icon: "question",
      inputLabel: "Escribe tu tipo de cambio",
      inputPlaceholder: "16, 17, 18, etc.",
      inputValidator: (value) => {
        if (!value) {
          return "Ingresa un tipo de cambio válido";
        }
      }
    });
    if (tc) {
      try {
        // Abrimos el PDF en una nueva pestaña
        window.open(`http://hiplot.dyndns.org:84/api_dev/pdf_cotizacion_dolar/${quatation.id}/${tc}`, '_blank');
      } catch (error) {
        console.log(error);
      }
    }
  }
  const traerSolicitudes = async (usuario: any) => {
    DynamicVariables.updateAnyVar(setInfo_sc, 'vendedor', usuario)
    let data = { vendedor: usuario.id ?? parseInt(usuario) }; // Asegurar que `usuario.id` sea un número válido

    try {
      const response: any = await axios.post(
        "http://hiplot.dyndns.org:84/cotizador_api/index.php/mantenimiento/traer_solicitud_para_hb",
        data,  // Enviar el objeto directamente (sin `JSON.stringify`)
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      DynamicVariables.updateAnyVar(setInfo_sc, 'folios_solicitudes', response.data)
      if (response.data.length == 0) {
        DynamicVariables.updateAnyVar(setInfo_sc, 'info_sc', null)
      } else {

        DynamicVariables.updateAnyVar(setInfo_sc, 'info_sc', response.data[0])
      }
      DynamicVariables.updateAnyVar(setInfo_sc, 'folio_sc', response.data[0].id)
      console.log(response); // Ver qué está recibiendo
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };
  const [name, setName] = useState<string>('')

  const [urgenciaG, setUrgenciaG] = useState<boolean>(false)
  const urgency = JSON.parse(localStorage.getItem('urgency'));

  useEffect(() => {
    setUrgenciaG(urgency)
  }, [modal])

  const urgenciaGlobal = async (urg: boolean) => {
    if (urgenciaG) {
      // Eliminar urgencia de conceptos normales
      quotes.normal_concepts.forEach((elemen: any) => {
        elemen.urgencia = 0;
        elemen.urgency = false;
      });

      // Eliminar urgencia de conceptos personalizados
      quotes.personalized_concepts?.forEach((elemen: any) => {
        elemen.conceptos?.forEach(x => {
          // Restar la urgencia al precio_total general del personalizado
          if (x.urgencia) {
            elemen.precio_total = parseFloat(elemen.precio_total) - x.urgencia;
          }
          x.urgencia = 0;
          x.urgency = false;
        });
      });

      setUrgenciaG(false);
      setCalculations((prev) => ({
        ...prev,
        urgencia: 0,
        total: prev.subtotal + prev.descuento
      }));

      localStorage.setItem('urgency', JSON.stringify(false));
      setQuotes({
        ...quotes,
        normal_concepts: quotes.normal_concepts,
        personalized_concepts: quotes.personalized_concepts
      });
      localStorage.setItem('cotizacion', JSON.stringify(quotes.normal_concepts));
      localStorage.setItem('cotizacion-pers', JSON.stringify(quotes.personalized_concepts));
    } else {
      setUrgenciaG(urg);
      localStorage.setItem('urgency', JSON.stringify(true));

      let lenghtp = 0;
      quotes.personalized_concepts.forEach(s => {
        lenghtp += s.conceptos.length;
      });

      let length = quotes.normal_concepts.length;
      let urgency = calculations.total * 0.30;
      let total_lenght = length + lenghtp;

      if (urgency < 200) {
        urgency = 200;
      }

      let u = urgency / total_lenght;

      // Aplicar urgencia a conceptos normales
      quotes.normal_concepts.forEach((elemen: any) => {
        elemen.urgencia = u;
        elemen.urgency = true;
      });

      // Aplicar urgencia a conceptos personalizados y sumar al total
      quotes.personalized_concepts?.forEach((elemen: any) => {
        elemen.conceptos?.forEach(x => {
          x.urgencia = u;
          x.urgency = true;
          elemen.precio_total = parseFloat(elemen.precio_total) + u;
        });
      });

      setCalculations((prev) => ({
        ...prev,
        urgencia: urgency,
        total: prev.total + urgency
      }));

      setQuotes({
        ...quotes,
        normal_concepts: quotes.normal_concepts,
        personalized_concepts: quotes.personalized_concepts
      });

      localStorage.setItem('cotizacion', JSON.stringify(quotes.normal_concepts));
      localStorage.setItem('cotizacion-pers', JSON.stringify(quotes.personalized_concepts));
    }
  };

  const changeFolioSc = (id: number) => {
    if (id != 0) {
      setInfo_sc((prev: any) => ({ ...prev, folio_sc: id }))
      let datasc = info_sc.folios_solicitudes.filter((data: any) => data.id == id)
      setInfo_sc((prev: any) => ({ ...prev, info_sc: datasc[0] }))
    }

  }
  const setQuatation = storeQuotation(state => state.setQuatation)

  const activarCotizacion = async () => {
    try {
      setModalLoading(true)
      const response: any = await APIs.GetAny('activar_cotizacion/' + quatation.id);
      if (response.error) {
        Swal.fire('Error', response.mensaje, 'error');
      } else {
        Swal.fire('Éxito', response.mensaje, 'success');
        const dataSaleOrders = {
          id: quatation.id
        }
        const result = await APIs.getQuotation(dataSaleOrders)
        let order_search = result[0]
        setModal('update-modal__qoutation');
        setQuotes({ quotes: order_search, normal_concepts: order_search.conceptos, personalized_concepts: order_search.conceptos_pers });
        setQuatation(order_search);
        setModalLoading(false)

      }
    } catch (error) {
      setModalLoading(false)
      Swal.fire('Error', 'Hubo un error al activar la cotización: ' + error, 'error');
    }
  }
  const changeSelectedConcepts = (i: any, value: boolean) => {
    let conceptos = quoteFields.conceptos
    if (conceptos[i]) {
      conceptos[i].check = value;
    }
    setQuoteFields((prev: any) => ({
      ...prev,
      conceptos: conceptos
    }));
  };
  const changeSelectedConceptsPers = (i: any, value: boolean) => {
    let conceptos = quoteFields.conceptos_pers
    if (conceptos[i]) {
      conceptos[i].check = value;
    }
    setQuoteFields((prev: any) => ({
      ...prev,
      conceptos_pers: conceptos
    }));
  };
  const [selAll, setSelAll] = useState<boolean>(false);
  const changeSelAll = (value: boolean) => {
    setSelAll(value);
    let conceptos = quoteFields.conceptos
    let conceptos_pers = quoteFields.conceptos_pers
    conceptos.forEach(element => {
      element.check = value;
    });
    conceptos_pers.forEach(element => {
      element.check = value;
    });

    setQuoteFields((prev: any) => ({
      ...prev,
      conceptos: conceptos,
      conceptos_pers: conceptos_pers
    }));
  };

  //   cont setDataDynamic = storeDv(state  => state.setDataDynamic)
  const ChangeInputs = (key: any, valor: any, index: number) => {
    localStorage.setItem('cotizacion', '[]');

    const updatedConcepts = quotes.normal_concepts.map((concept, i) =>
      i === index ? { ...concept, [key]: valor } : concept
    );
    setQuotes({ ...quotes, normal_concepts: updatedConcepts });
    localStorage.setItem('cotizacion', JSON.stringify(updatedConcepts));
  }
  const ChangeInputsPers = (key: any, valor: any, index: number) => {
    localStorage.setItem('cotizacion-pers', '[]');

    const updatedConcepts = quotes.personalized_concepts.map((concept, i) =>
      i === index ? { ...concept, [key]: valor } : concept
    );
    setQuotes({ ...quotes, personalized_concepts: updatedConcepts });
    localStorage.setItem('cotizacion-pers', JSON.stringify(updatedConcepts));
  }
  const ChangeInputsDentrodePers = (key: any, valor: any, index: number, indexConcept: number) => {
    const updatedConcepts = quotes.personalized_concepts.map((concept, i) => {
      if (i !== index) return concept;

      const updatedInnerConcepts = concept.conceptos.map((c, j) =>
        j === indexConcept ? { ...c, [key]: valor } : c
      );

      return {
        ...concept,
        conceptos: updatedInnerConcepts
      };
    });

    const updatedQuotes = { ...quotes, personalized_concepts: updatedConcepts };
    setQuotes(updatedQuotes);
    localStorage.setItem('cotizacion-pers', JSON.stringify(updatedConcepts));
  };

  return (
    <div className={`overlay__quotations__modal ${modal === 'create-modal__qoutation' || modal === 'update-modal__qoutation' ? 'active' : ''}`}>
      <div className={`popup__quotations__modal ${modal === 'create-modal__qoutation' || modal === 'update-modal__qoutation' ? 'active' : ''}`}>
        <div className='header__modal'>
          <a href="#" className="btn-cerrar-popup__quotations__modal" onClick={closeModal}>
            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512">
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </a>
          {modal === 'create-modal__qoutation' ?
            <p className='title__modals'>Crear cotización</p>
            :
            <p className='title__modals'>Actualizar cotización</p>
          }
        </div>

        <div className='quotations__modal'>
          <div className='row__one_main'>
            {modal == 'create-modal__qoutation' ?
              ''
              :
              <div className="row__one card ">
                <div className="card-body bg-standar">
                  <h3 className="text">{quotes.quotes.serie}-{quotes.quotes.folio}-{quotes.quotes.anio}</h3>
                  <hr />
                  <div className='row'>
                    <div className='col-6 md-col-12'>
                      <span className='text'>Creado por: <b>{quotes.quotes.usuario_crea}</b></span><br />
                      <span className='text'>Fecha de Creación: <b>{quotes.quotes.fecha_creacion}</b></span><br />
                      {quotes.quotes.id_solicitud_cotizacion != 0 ?
                        <>
                          <span className='text end-status'>Folio de Solicitud: <b>{quotes.quotes.id_solicitud_cotizacion}</b></span>
                        </> : ''}
                      {/* <b className='' style={{color:'green', background:'white', padding:'10px', borderRadius:'10px'}}>Esta es una cotización creada con folio de Solicitud de Cotizador: {quotes.quotes.id_solicitud_cotizacion}</b> */}

                      {quotes.quotes.status === 0 ? (
                        <span className="active-status">Activo</span>
                      ) : quotes.quotes.status === 1 ? (
                        <span className="canceled-status">Cancelada</span>
                      ) : (
                        quotes.quotes.status === 2 ? (
                          <span className="end-status">Terminado</span>
                        ) : (
                          ""
                        )
                      )}
                      {modal === 'create-modal__qoutation' ?
                        ''
                        :
                        quotes.quotes.vencida ?
                          <div className=''>
                            <div className='btn__pdf'>
                              {permisosxVista.some((x: any) => x.titulo == 'activar_cotizacion') && (

                                <button className='btn__general-orange' onClick={activarCotizacion}>Activar cotizacion</button>
                              )}
                            </div>
                            <div>
                              <p className='cancel-identifier'>Esta cotizacion esta vencida</p>
                            </div>
                          </div>
                          :
                          <div className=''>
                            <div className='btn__pdf'>
                              <button className='btn__general-orange' onClick={getTicket}>PDF</button>
                              {permisosxVista.some((x: any) => x.titulo == 'pdf_no_precios') && (
                                <button className='btn__general-orange' onClick={getTicket2}>PDF No Precios</button>
                              )}
                              {permisosxVista.some((x: any) => x.titulo == 'pdf_dolar') && (
                                <button className='btn__general-orange' onClick={getTicket3}>PDF Dolar</button>
                              )}
                            </div>

                          </div>

                      }
                    </div>
                    <div className='col-6 md-col-12'>
                      <span className='text'>Empresa: <b>{quotes.quotes.empresa}</b></span><br />
                      <span className='text'>Sucursal: <b>{quotes.quotes.sucursal}</b></span><br />
                      {modal === 'create-modal__qoutation' ?
                        ''
                        :
                        quotes.quotes.vencida ?
                          ''
                          :
                          <div className='row'>
                            <div className='col-6 btn__update-qoutation'>
                              <button className='btn__general-primary' onClick={createQuotation}>Actualizar cotizacion</button>
                            </div>
                            <div className='col-6'>
                              <button className='btn__general-bg-100' onClick={mandarAOV}>Enviar a OV</button>
                            </div>

                          </div>

                      }
                    </div>
                  </div>
                </div>
              </div>
            }
            {permisosxVista.map((x: any) =>
              x.titulo == 'campos_cotizador' ?
                <div className='row card' key={x.id}>
                  <div className='col-4 md-col-12'>
                    <label className="">Vendedor</label>
                    <div>
                      <select
                        className="select_original_general cotly-select"
                        value={info_sc.vendedor}
                        onChange={(e) => traerSolicitudes(e.target.value)}
                        title="Este vendedor aparecerá en la cotización especial"
                      >
                        {info_sc.vendedores.map((vendedor: any) => (
                          <option key={vendedor.id} value={vendedor.id}>{vendedor.nombre}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className='col-4 md-col-12'>
                    <div className="">
                      <label>cotizacion propia</label><br></br>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={info_sc.cot_propia} // Asignar el valor del estado al atributo 'checked'
                          onChange={(e) => { DynamicVariables.updateAnyVar(setInfo_sc, 'cot_propia', e.target.checked) }}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                  {modal == 'create-modal__qoutation' ?
                    <>
                      <div className='col-4 md-col-12'>
                        <div className="">
                          <label className="">Folio de Solicitud</label>
                          <div>
                            <select
                              className="select_original_general"
                              value={info_sc?.folio_sc}
                              onChange={(e) => {
                                console.log('Folio cambiado:', e.target.value);
                                changeFolioSc(parseInt(e.target.value || '0'));
                              }}
                              title={(() => {


                                if (!info_sc?.folio_sc) return "Seleccione una solicitud";

                                const seleccionado = info_sc?.folios_solicitudes.find(
                                  (sol: any) => sol.id === info_sc?.folio_sc
                                );

                                return seleccionado
                                  ? `Cliente: ${seleccionado.cliente}, Creación: ${seleccionado.fecha_creacion}, Sucursal: ${seleccionado.sucursal}, Tipo: ${seleccionado.tipo}`
                                  : "Seleccione una solicitud";
                              })()}
                            >
                              {Array.isArray(info_sc?.folios_solicitudes) && info_sc.folios_solicitudes.length > 0
                                && info_sc?.folios_solicitudes.map((sol: any) => (
                                  <option key={sol.id} value={sol.id}
                                    title={`Cliente: ${sol.cliente}, Creación: ${sol.fecha_creacion}, Sucursal: ${sol.sucursal}, Tipo: ${sol.tipo}`}
                                  >{sol.id}</option>
                                ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className='col-12 parpadeo' style={{ color: 'green' }}>
                        <b>
                          {`Cliente: ${info_sc?.info_sc?.cliente || 'N/A'}, Creación: ${info_sc?.info_sc?.fecha_creacion || 'N/A'}, Sucursal: ${info_sc?.info_sc?.sucursal || 'N/A'}, Tipo: ${info_sc?.info_sc?.tipo || 'N/A'}`}

                        </b>
                      </div>
                    </>
                    : ''}
                </div>
                :
                ''
            )}
            <div className='row card'>
              <div className='col-12 '>
                {modal == 'create-modal__qoutation' ?

                  <Empresas_Sucursales modeUpdate={false} empresaDyn={company} setEmpresaDyn={setCompany} sucursalDyn={branch} setSucursalDyn={setBranch} branch={setBranch} />

                  : ''
                }
              </div>
              <div className='col-4 md-col-12'>
                <label className='label__general'>Título</label>
                <div className='warning__general'><small >Este campo es obligatorio</small></div>
                <input className={`inputs__general`} type="text" value={quoteFields.titulo} onChange={(e) => setQuoteFields({ ...quoteFields, titulo: e.target.value })} placeholder='Ingresa el título' />
              </div>
              <div className='col-8 md-col-12'>
                <label className='label__general'>Comentarios</label>
                <div className='warning__general'><small >Este campo es obligatorio</small></div>
                <textarea className={`textarea__general`} value={quoteFields.comentarios} onChange={(e) => setQuoteFields({ ...quoteFields, comentarios: e.target.value })} placeholder='Comentarios'></textarea>

              </div>
              <div className='col-12 text-center m-3 md-col-12'>
                <b >Selecciona tu cliente</b>
                <div className='row card'>
                  <div className='col-6 md-col-12'>
                    <label className='label__general'>Nombre</label>
                    <div className='warning__general'><small >Este campo es obligatorio</small></div>
                    <input className={`inputs__general`} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Ingresa el nombre' onKeyUp={(event) => event.key === 'Enter' && searchUsers()} />
                  </div>
                  <div className='col-1 md-col-12' title='Haz clic para buscar a tu cliente'>
                    <div className='btn__general-purple d-flex align-items-end justify-content-center'>
                      <div className='search-icon' onClick={searchUsers}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                      </div>
                    </div>
                  </div>
                  <div className='col-5 md-col-12'>
                    <div className='select__container'>
                      <label className='label__general'>Cliente Seleccionado:</label>
                      <div className={`select-btn__general`}>
                        <div className={`select-btn ${selectResults ? 'active' : ''}`} onClick={openSelectResults}>
                          <div className='select__container_title'>
                            <p>{selectedResult ? clients?.find((s: { id: number }) => s.id === selectedResult.id)?.razon_social : `${quotes.quotes.id_cliente ? quotes.quotes.cliente_contacto : 'Selecionar'}`}</p>
                          </div>
                          <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                        </div>
                        <div className={`content ${selectResults ? 'active' : ''}`}>
                          <ul className={`options ${selectResults ? 'active' : ''}`} style={{ opacity: selectResults ? '1' : '0' }}>
                            {clients?.map((result: any) => (
                              <li key={result.id} onClick={() => handleResultsChange(result)}>
                                {result.razon_social}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    {clienteOff && clients.length > 0 ?
                      <div className='w-full my-2 row__three parpadeo' style={{ color: 'red' }}>
                        <b>Este cliente se encuentra desactivado por este motivo: {selectedResult?.comentario_desactivado ?? ''}</b>
                      </div>

                      : ''}
                  </div>
                </div>





              </div>
              <div className='col-12'>
                <div className='row'>

                  <div className='col-6 md-col-12'>
                    {modal === 'create-modal__qoutation' ?
                      ''
                      :
                      <div className='m-2' style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        backgroundColor: '#f9f9f9',
                        width: 'fit-content', // o un valor fijo como '150px'
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                      }} title="Seleccionar concepto para OV">
                        <label className="switch" style={{ marginRight: '8px' }}>
                          <input
                            className="inputs__general"
                            type="checkbox"
                            checked={selAll}
                            onChange={(e) => changeSelAll(e.target.checked)}
                          />
                          <span className="slider"></span>
                        </label>
                        <label className='mt-2'>Seleccionar Todo</label>
                      </div>
                    }
                  </div>
                  <div className='col-2 md-col-12'>
                    {modal !== 'update-modal__qoutation' && (

                      <button className='btn__general-success' onClick={() => clearCotizacion()}>Vaciar Cot.</button>
                    )}
                  </div>
                  <div className='col-3 md-col-12'>
                    <div className='d-flex align-items-end'>
                      {urgenciaG ?
                        <button type='button' className='mr-4 btn__general-success' onClick={() => urgenciaGlobal(false)}>Remover Urgencias</button>
                        :
                        <button type='button' className='mr-4 btn__general-orange' onClick={() => urgenciaGlobal(true)}>Agregar Urgencia a Orden</button>
                      }
                      <button className='btn__general-purple' onClick={modalPersonalized}>Crear personalizados</button>
                    </div>

                  </div>
                  <div className='col-1 md-col-12'>
                    <div className='d-flex align-items-end' title='Busqueda de articulos'>
                      <div className='btn__general-purple-icon'>
                        <svg onClick={() => { setModalArticleView('article-view__modal'); setTypeLocalStogare('cotizacion') }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="d-flex lucide lucide-package-search"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" /><path d="m7.5 4.27 9 5.15" /><polyline points="3.29 7 12 12 20.71 7" /><line x1="12" x2="12" y1="22" y2="12" /><circle cx="18.5" cy="15.5" r="2.5" /><path d="M20.27 17.27 22 19" /></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='row__two'>




              <div className='table__quotations_modal'>
                <div className='table__head'>
                  <div className={`thead `}>
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
                      <p>P/U</p>
                    </div>
                    <div className='th'>
                      <p>Importe</p>
                    </div>
                    <div className='th'>
                      <p>Desc.</p>
                    </div>
                    <div className='th'>
                      <p>Urg.</p>
                    </div>
                    <div>
                      <p>Total</p>
                    </div>
                  </div>
                </div>
                <div className='table__quotations-modal-body-desk'>
                  <div className='table__body'>
                    {quotes?.normal_concepts.map((article: any, index: number) => {
                      return (
                        <>
                          <div className='tbody__container card' key={index} style={{ zoom: '80%', border: '5px solid #ccc' }}>
                            <div className='tbody'>

                              <div className='td ' style={{ cursor: 'pointer' }} title='Haz clic aquí para modificar tu concepto' onClick={() => abrirFichaModifyConcept(article, index)}>
                                <p className='article'>{article.codigo}-{article.descripcion}</p>
                              </div>
                              <div className='td'>
                                <p className='amount'>{article.cantidad}</p>
                              </div>
                              <div className='td'>
                                <p>{article.name_unidad || article.unidad}</p>
                              </div>
                              <div className='td'>
                                <p className=''>$ {article.precio_unitario?.toFixed(2)}<br />
                                  {article.total_franquicia != null && !Number.isNaN(article.total_franquicia) && permisosxVistaheader.length > 0 && checkPermission('totales_franquicia') ?
                                    <small>PUF:${Number(article.total_franquicia / article.cantidad).toFixed(2)}</small> : ''}
                                </p>
                              </div>
                              <div className='td '>
                                <div>
                                  <p className='total'>$ {parseFloat(article.precio_total).toFixed(2)}</p>
                                  <p className='total__franch'>{article.total_franquicia != null && !Number.isNaN(article.total_franquicia) && permisosxVistaheader.length > 0 && checkPermission('totales_franquicia') ?
                                    <small>PF:${parseFloat(article.total_franquicia).toFixed(2)}</small> : ''}</p>
                                </div>
                              </div>
                              <div className='td'>
                                <p>{article.descuento}</p>
                              </div>
                              <div className='td'>
                                <p className='cancel-identifier'>$ {parseFloat(article.urgencia).toFixed(2)}</p>
                              </div>
                              <div className='td '>
                                <div>
                                  <p className='total'>$ {parseFloat(article.precio_total + article.urgencia).toFixed(2)}</p>
                                  <p className='total__franch'>{article.total_franquicia != null && !Number.isNaN(article.total_franquicia)
                                    && permisosxVistaheader.length > 0 && checkPermission('totales_franquicia') ?
                                    <small>PF:${parseFloat(article.total_franquicia).toFixed(2)}</small> : ''}</p>
                                </div>
                              </div>
                              <div className='td urgency'>
                                {article?.urgency ?
                                  <div>
                                    <div className='urgency-false-icon' title='Quitar urgencia' onClick={() => handleUrgencyChange(index)}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-timer-off"><path d="M10 2h4" /><path d="M4.6 11a8 8 0 0 0 1.7 8.7 8 8 0 0 0 8.7 1.7" /><path d="M7.4 7.4a8 8 0 0 1 10.3 1 8 8 0 0 1 .9 10.2" /><path d="m2 2 20 20" /><path d="M12 12v-2" /></svg>
                                    </div>
                                  </div>
                                  :
                                  <div>
                                    <div className='urgency-true-icon' title='Agregar urgencia' onClick={() => handleUrgencyChange(index)}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-timer"><line x1="10" x2="14" y1="2" y2="2" /><line x1="12" x2="15" y1="14" y2="11" /><circle cx="12" cy="14" r="8" /></svg>
                                    </div>
                                  </div>
                                }
                              </div>
                              <div className='td'>
                                <div className='see-icon' onClick={() => seeVerMas(index, 'normal')} title='Ver mas campos'>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                                </div>
                              </div>

                              <div className='td'>
                                <div className='delete-icon' onClick={() => deleteNormalConcept(article, index)} title='Eliminar concepto'>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                </div>
                              </div>
                              {modal === 'create-modal__qoutation' ?
                                ''
                                :
                                <td style={{ width: '50px' }} title='Seleccionar concepto para OV'>
                                  <label className="switch">
                                    <input className={`inputs__general`} type="checkbox" checked={article.check}
                                      onChange={(e) => { changeSelectedConcepts(index, e.target.checked) }}
                                    />
                                    <span className="slider"></span>
                                  </label>
                                </td>
                              }
                              <div className='col-12' style={{ border: '1px solid #ccc ', padding: '5px', margin: '5px' }}>
                                <div className='row'>
                                  {article.campos_plantilla.map((x: any) => (
                                    <div className='col-2'>
                                      {x.considerado_total ?
                                        <p><b>{x.nombre_campo_plantilla} : {x.valor}</b></p>
                                        :
                                        <p>{x.nombre_campo_plantilla} : {x.valor}</p>
                                      }
                                    </div>
                                  ))}
                                  {/* <div className='col-3'></div> */}
                                </div>
                              </div>
                              <div className='col-12'>
                                <div className='row'>

                                  <div className='col-6'>
                                    <label className=''>Comentarios de Factura</label>
                                    <textarea rows={2} className={`inputs__general`} value={article?.obs_factura} onChange={(e) => ChangeInputs('obs_factura', e.target.value, index)} placeholder='Factura' />
                                  </div>
                                  <div className='col-6'>
                                    <label className=''>Comentarios de Produccion</label>
                                    <textarea rows={2} className={`inputs__general`} value={article?.obs_produccion} onChange={(e) => ChangeInputs('obs_produccion', e.target.value, index)} placeholder='Producción' />
                                  </div>
                                </div>
                              </div>

                            </div>

                          </div>

                        </>
                      )
                    })}
                    {quotes?.personalized_concepts.map((article: any, index: number) => {
                      return (
                        <div className='tbody__container' key={index}>
                          <div className='concept__personalized'>
                            <p>Concepto Personalizado</p>
                          </div>
                          <div className={`tbody personalized`}>
                            <div className='td ' title='Haz clic aquí para modificar tu concepto'>
                              <p className='article'>{article.codigo}-{article.descripcion}</p>
                            </div>
                            <div className='td'>
                              <p className='amount'>{article.cantidad}</p>
                            </div>
                            <div className='td'>
                              <p>{article.name_unidad || article.unidad}</p>
                            </div>
                            <div className='td'>
                              <p className=''>$ {Number(article.precio_total / article.cantidad).toFixed(2)} <br />
                                {permisosxVistaheader.length > 0 && checkPermission('totales_franquicia') && (

                                  <small>PUF:${Number(article.total_franquicia / article.cantidad).toFixed(2)}</small>
                                )}

                              </p>
                            </div>
                            <div className='td'>
                              <div className='d-flex'>
                                <div>
                                  <p className='total'>$ {parseFloat(article.precio_total).toFixed(2)}</p>
                                  {permisosxVistaheader.length > 0 && checkPermission('totales_franquicia') && (

                                    <p className='total__franch'>{article.total_franquicia != null && !Number.isNaN(article.total_franquicia) ?
                                      <small>PF: ${parseFloat(article.total_franquicia).toFixed(2)}</small> : ''}</p>
                                  )}

                                </div>
                              </div>
                            </div>
                            <div className='td'>
                              <p>$0.00</p>
                            </div>
                            <div className='td'>
                              <p>$0.00</p>
                            </div>
                            <div className='td'>
                              <div className='d-flex'>
                                <div>
                                  <p className='total'>$ {parseFloat(article.precio_total).toFixed(2)}</p>
                                  {permisosxVistaheader.length > 0 && checkPermission('totales_franquicia') && (

                                    <p className='total__franch'>{article.total_franquicia != null && !Number.isNaN(article.total_franquicia) ?
                                      <small>PF: ${parseFloat(article.total_franquicia).toFixed(2)}</small> : ''}</p>
                                  )}

                                </div>
                              </div>
                            </div>
                            <div className='td'>
                              {article?.personalized ?
                                <div onClick={() => modalPersonalizedUpdate(article, index)} className='conept-icon'>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" strokeLinejoin="round" className="lucide lucide-boxes"><path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z" /><path d="m7 16.5-4.74-2.85" /><path d="m7 16.5 5-3" /><path d="M7 16.5v5.17" /><path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z" /><path d="m17 16.5-5-3" /><path d="m17 16.5 4.74-2.85" /><path d="M17 16.5v5.17" /><path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z" /><path d="M12 8 7.26 5.15" /><path d="m12 8 4.74-2.85" /><path d="M12 13.5V8" /></svg>
                                </div>
                                :
                                ''
                              }
                            </div>
                            <div className='td'>
                              <div className='see-icon' onClick={() => seeVerMas(index, 'pers')} title='Ver mas campos'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                              </div>
                            </div>
                            <div className='td'>
                              <div className='undo-icon' onClick={() => undoConcepts(article, index, false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-undo-2"><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" /></svg>
                              </div>
                            </div>
                            {modal === 'create-modal__qoutation' ?
                              ''
                              :
                              <td style={{ width: '50px' }} title='Seleccionar concepto para OV'>
                                <label className="switch">
                                  <input className={`inputs__general`} type="checkbox" checked={article.check}
                                    onChange={(e) => { changeSelectedConceptsPers(index, e.target.checked) }}
                                  />
                                  <span className="slider"></span>
                                </label>
                              </td>
                            }

                            <div className='col-12'>
                              <div className='row'>

                                <div className='col-6'>
                                  <label className=''>Comentarios de Factura</label>
                                  <textarea rows={2} className={`inputs__general`} value={article?.comentarios_factura} onChange={(e) => ChangeInputsPers('comentarios_factura', e.target.value, index)} placeholder='Factura' />
                                </div>
                                <div className='col-6'>
                                  <label className=''>Comentarios de Produccion</label>
                                  <textarea rows={2} className={`inputs__general`} value={article?.comentarios_produccion} onChange={(e) => ChangeInputsPers('comentarios_produccion', e.target.value, index)} placeholder='Producción' />
                                </div>
                              </div>
                            </div>
                            <div className='col-12 card' style={{ marginLeft: '20px', backgroundColor: '#d4d4d4ff' }}>
                              <b>CONCEPTOS DENTRO DEL PERSONALIZADO</b>
                              {article?.conceptos.map((x: any, indexConcept: number) => {
                                return (
                                  <>
                                    <div className='tbody__container card' key={indexConcept} style={{ zoom: '80%', backgroundColor: '#d4d4d4ff' }}>
                                      <div className='tbody'>

                                        <div className='td ' style={{ cursor: 'pointer' }} title='Haz clic aquí para modificar tu concepto' onClick={() => abrirFichaModifyConcept(x, index)}>
                                          <p className='article'>{x.codigo}-{x.descripcion}</p>
                                        </div>
                                        <div className='td'>
                                          <p className='amount'>{x.cantidad}</p>
                                        </div>
                                        <div className='td'>
                                          <p>{x.name_unidad || x.unidad}</p>
                                        </div>
                                        <div className='td'>
                                          <p className=''>$ {x.precio_unitario?.toFixed(2)}<br />
                                            {x.total_franquicia != null && !Number.isNaN(x.total_franquicia) && permisosxVistaheader.length > 0 && checkPermission('totales_franquicia') ?
                                              <small>PUF:${Number(x.total_franquicia / x.cantidad).toFixed(2)}</small> : ''}
                                          </p>
                                        </div>
                                        <div className='td '>
                                          <div>
                                            <p className='total'>$ {parseFloat(x.precio_total).toFixed(2)}</p>
                                            <p className='total__franch'>{x.total_franquicia != null && !Number.isNaN(x.total_franquicia) && permisosxVistaheader.length > 0 && checkPermission('totales_franquicia') ?
                                              <small>PF:${parseFloat(x.total_franquicia).toFixed(2)}</small> : ''}</p>
                                          </div>
                                        </div>
                                        <div className='td'>
                                          <p>{x.descuento}</p>
                                        </div>
                                        <div className='td'>
                                          <p className='cancel-identifier'>$ {parseFloat(x.urgencia).toFixed(2)}</p>
                                        </div>
                                        <div className='td '>
                                          <div>
                                            <p className='total'>$ {(parseFloat(x.precio_total) + parseFloat(x.urgencia)).toFixed(2)}</p>
                                            <p className='total__franch'>{x.total_franquicia != null && !Number.isNaN(x.total_franquicia)
                                              && permisosxVistaheader.length > 0 && checkPermission('totales_franquicia') ?
                                              <small>PF:${parseFloat(x.total_franquicia).toFixed(2)}</small> : ''}</p>
                                          </div>
                                        </div>
                                        <div className='td urgency'>
                                          {x?.urgency ?
                                            <div>
                                              <div className='urgency-false-icon' title='Quitar urgencia' onClick={() => handleUrgencyChangeInPers(index, indexConcept)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-timer-off"><path d="M10 2h4" /><path d="M4.6 11a8 8 0 0 0 1.7 8.7 8 8 0 0 0 8.7 1.7" /><path d="M7.4 7.4a8 8 0 0 1 10.3 1 8 8 0 0 1 .9 10.2" /><path d="m2 2 20 20" /><path d="M12 12v-2" /></svg>
                                              </div>
                                            </div>
                                            :
                                            <div>
                                              <div className='urgency-true-icon' title='Agregar urgencia' onClick={() => handleUrgencyChangeInPers(index, indexConcept)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-timer"><line x1="10" x2="14" y1="2" y2="2" /><line x1="12" x2="15" y1="14" y2="11" /><circle cx="12" cy="14" r="8" /></svg>
                                              </div>
                                            </div>
                                          }
                                        </div>
                                        <div className='td'>
                                          <div className='see-icon' onClick={() => seeVerMas(index, 'normal')} title='Ver mas campos'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                                          </div>
                                        </div>

                                        <div className='td'>
                                          <div className='delete-icon' onClick={() => deleteNormalConcept(x, index)} title='Eliminar concepto'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                          </div>
                                        </div>
                                        {modal === 'create-modal__qoutation' ?
                                          ''
                                          :
                                          <td style={{ width: '50px' }} title='Seleccionar concepto para OV'>
                                            <label className="switch">
                                              <input className={`inputs__general`} type="checkbox" checked={x.check}
                                                onChange={(e) => { changeSelectedConcepts(index, e.target.checked) }}
                                              />
                                              <span className="slider"></span>
                                            </label>
                                          </td>
                                        }
                                        <div className='col-12' style={{ border: '1px solid #ccc ', padding: '5px', margin: '5px' }}>
                                          <div className='row'>
                                            {x.campos_plantilla.map((x: any) => (
                                              <div className='col-2'>
                                                {x.considerado_total ?
                                                  <p><b>{x.nombre_campo_plantilla} : {x.valor}</b></p>
                                                  :
                                                  <p>{x.nombre_campo_plantilla} : {x.valor}</p>
                                                }
                                              </div>
                                            ))}
                                            {/* <div className='col-3'></div> */}
                                          </div>
                                        </div>
                                        <div className='col-12'>
                                          <div className='row'>

                                            <div className='col-6'>
                                              <label className=''>Comentarios de Factura</label>
                                              <textarea rows={2} className={`inputs__general`} value={x?.obs_factura ?? x?.comentarios} onChange={(e) => ChangeInputsDentrodePers('obs_factura', e.target.value, index, indexConcept)} placeholder='Factura' />
                                            </div>
                                            <div className='col-6'>
                                              <label className=''>Comentarios de Produccion</label>
                                              <textarea rows={2} className={`inputs__general`} value={x?.obs_produccion ?? x?.comentarios} onChange={(e) => ChangeInputsDentrodePers('obs_produccion', e.target.value, index, indexConcept)} placeholder='Producción' />
                                            </div>
                                          </div>
                                        </div>

                                      </div>

                                    </div>

                                  </>
                                )
                              })}
                            </div>
                          </div>

                        </div>
                      )
                    })}
                  </div>

                </div>
                <div className='table__quotations-modal-body-response'>
                  <div className='table__body'>
                    {quotes?.normal_concepts.map((article: any, index: number) => {
                      return (
                        <div className='tbody__container' key={index}>
                          <div className='tbody'>
                            <div className='td ' style={{ cursor: 'pointer' }} title='Haz clic aquí para modificar tu concepto' onClick={() => abrirFichaModifyConcept(article, index)}>
                              <p className='article'>{article.codigo}-{article.descripcion}</p>
                            </div>
                            <div className='td'>
                              <p className='amount'>{article.cantidad}</p>
                            </div>
                            <div className='td'>
                              <p>{article.name_unidad || article.unidad}</p>
                            </div>
                            <div className='td'>
                              <p className=''>$ {article.precio_unitario?.toFixed(2)}<br />
                                {permisosxVistaheader.length > 0 && checkPermission('totales_franquicia') && (
                                  article.total_franquicia != null && !Number.isNaN(article.total_franquicia) ?
                                    <small>PUF:${Number(article.total_franquicia / article.cantidad).toFixed(2)}</small> : ''
                                )}
                              </p>
                            </div>
                            <div className='td '>
                              <div>
                                <p className='total'>$ {parseFloat(article.precio_total).toFixed(2)}</p>
                                <p className='total__franch'>{article.total_franquicia != null && !Number.isNaN(article.total_franquicia) ?
                                  <small>PF:${parseFloat(article.total_franquicia).toFixed(2)}</small> : ''}</p>
                              </div>
                            </div>
                            <div className='td urgency'>
                              {article?.urgency ?
                                <div>
                                  <div className='urgency-false-icon' title='Quitar urgencia' onClick={() => handleUrgencyChange(index)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-timer-off"><path d="M10 2h4" /><path d="M4.6 11a8 8 0 0 0 1.7 8.7 8 8 0 0 0 8.7 1.7" /><path d="M7.4 7.4a8 8 0 0 1 10.3 1 8 8 0 0 1 .9 10.2" /><path d="m2 2 20 20" /><path d="M12 12v-2" /></svg>
                                  </div>
                                </div>
                                :
                                <div>
                                  <div className='urgency-true-icon' title='Agregar urgencia' onClick={() => handleUrgencyChange(index)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-timer"><line x1="10" x2="14" y1="2" y2="2" /><line x1="12" x2="15" y1="14" y2="11" /><circle cx="12" cy="14" r="8" /></svg>
                                  </div>
                                </div>
                              }
                            </div>
                            <div className='td'>
                              <div className='see-icon' onClick={() => seeVerMas(index, 'normal')} title='Ver mas campos'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                              </div>
                            </div>

                            <div className='td'>
                              <div className='delete-icon' onClick={() => deleteNormalConcept(article, index)} title='Eliminar concepto'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    {quotes?.personalized_concepts.map((article: any, index: number) => {
                      return (
                        <div className='tbody__container' key={index}>
                          <div className='concept__personalized'>
                            <p>Concepto Personalizado</p>
                          </div>
                          <div className={`tbody personalized`}>
                            <div className='td ' style={{ cursor: 'pointer' }} title='Haz clic aquí para modificar tu concepto' onClick={() => abrirFichaModifyConcept(article, index)}>
                              <p className='article'>{article.codigo}-{article.descripcion}</p>
                            </div>
                            <div className='td'>
                              <p className='amount'>{article.cantidad}</p>
                            </div>
                            <div className='td'>
                              <p>{article.name_unidad || article.unidad}</p>
                            </div>
                            <div className='td'>
                              <p className=''>$ {Number(article.precio_total / article.cantidad).toFixed(2)} <br />
                                {permisosxVistaheader.length > 0 && checkPermission('totales_franquicia') && (
                                  <small>PUF:${Number(article.total_franquicia / article.cantidad).toFixed(2)}</small>
                                )}
                              </p>
                            </div>
                            <div className='td'>
                              <div className='d-flex'>
                                <div>
                                  <p className='total'>$ {parseFloat(article.precio_total).toFixed(2)}</p>
                                  {permisosxVistaheader.length > 0 && checkPermission('totales_franquicia') && (
                                    <p className='total__franch'>{article.total_franquicia != null && !Number.isNaN(article.total_franquicia) ?
                                      <small>PF: ${parseFloat(article.total_franquicia).toFixed(2)}</small> : ''}</p>
                                  )}

                                </div>
                              </div>
                            </div>
                            <div className='td'>
                              {article?.personalized ?
                                <div onClick={() => modalPersonalizedUpdate(article, index)} className='conept-icon'>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" strokeLinejoin="round" className="lucide lucide-boxes"><path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z" /><path d="m7 16.5-4.74-2.85" /><path d="m7 16.5 5-3" /><path d="M7 16.5v5.17" /><path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z" /><path d="m17 16.5-5-3" /><path d="m17 16.5 4.74-2.85" /><path d="M17 16.5v5.17" /><path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z" /><path d="M12 8 7.26 5.15" /><path d="m12 8 4.74-2.85" /><path d="M12 13.5V8" /></svg>
                                </div>
                                :
                                ''
                              }
                            </div>
                            <div className='td'>
                              <div className='see-icon' onClick={() => seeVerMas(index, 'pers')} title='Ver mas campos'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                              </div>
                            </div>
                            {/* {article.con_adicional ?
                            <div className='td'>
                              <div className='delete-icon' onClick={() => undoConcepts(article, index, true)} title='Eliminar concepto adicional'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                              </div>
                            </div>
                            :
                            <div className='td'>
                              <div className='undo-icon' onClick={() => undoConcepts(article, index, false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-undo-2"><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" /></svg>
                              </div>
                            </div>
                          } */}
                            <div className='td'>
                              <div className='undo-icon' onClick={() => undoConcepts(article, index, false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-undo-2"><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" /></svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row__three'>
            <div className='btns'>
              <div className='subtotal'>
                <div>
                  <p className='name'>Subtotal</p>
                  <p className='value'>$ {calculations.subtotal.toFixed(2)}</p>
                </div>
              </div>
              <div className='discount'>
                <div>
                  <p className='name'>Descuento</p>
                  <p className='value'>$ {calculations.descuento.toFixed(2)}</p>
                </div>
              </div>
              <div className='urgency'>
                <div>
                  <p className='name'>Urgencia</p>
                  <p className='value'>$ {calculations.urgencia.toFixed(2)}</p>
                </div>
              </div>
              <div className='total'>
                <div>
                  <p className='name'>Total</p>
                  <p className='value'>$ {calculations.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
            {permisosxVistaheader.length > 0 && checkPermission('totales_franquicia') && (

              <div className='mt-1 btns'>
                <div className='subtotal'>
                  <div>
                    <p className='name'>Subtotal Franquicia</p>
                    <p className='value'>$ {calculations.subtotalf.toFixed(2)}</p>
                  </div>
                </div>

                <div className='urgency'>
                  <div>
                    <p className='name'>Urgencia Franquicia</p>
                    <p className='value'>$ {calculations.urgenciaf.toFixed(2)}</p>
                  </div>
                </div>
                <div className='total'>
                  <div>
                    <p className='name'>Total Franquicia</p>
                    <p className='value'>$ {calculations.totalf.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}
            {modal === 'create-modal__qoutation' ?
              <div className='mt-3 d-flex justify-content-center'>
                <button className='btn__general-purple' onClick={createQuotation}>Crear cotizacion</button>
              </div>
              :
              ''
            }
          </div>

        </div>
        <ModalSalesOrder />
      </div>
      <Personalized idItem={idItem} branch={branch} indexItem={indexItem} />
      <ArticleViewModal />
      <SalesCard typeLocalStogare={typeLocalStogare} idA={idA} dataArticle={dataArticle} indexUpdate={indexUpdate} />
      <SeeClient />
      {/* {personalizedModal !== '' ?
        <SeeCamposPlantillas typeConcept={typeConcept} />
        :
        <SeeCamposPlantillas typeConcept={typeConcept} />
      } */}

    </div>
  );
};

export default ModalCreate;
