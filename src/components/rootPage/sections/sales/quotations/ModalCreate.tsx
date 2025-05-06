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
    setPersonalizedModal('personalized_modal-quotation')
    setCustomConceptView(quotes.normal_concepts)
  }

  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [info_sc, setInfo_sc] = useState<any>({
    vendedor: 0,
    vendedores: [],
    cot_propia: false,
    folio_sc: 0,
    folios_solicitudes: []
  })


  const [quoteFields, setQuoteFields] = useState<any>({})
  const setData = () => {
    setQuoteFields({
      id: modal === 'create-modal__qoutation' ? 0 : quotes.quotes.id,
      id_sucursal: modal === 'create-modal__qoutation' ? branch.id : quatation.id_sucursal,
      id_cliente: selectedResult?.id ?? quatation.id_cliente,
      id_usuario_crea: user_id,
      titulo: quotes.quotes.titulo,
      comentarios: '',
      conceptos: quotes?.normal_concepts,
      conceptos_pers: quotes?.personalized_concepts,
      conceptos_elim: quotes?.normal_concepts_eliminate,
      conceptos_pers_elim: quotes?.personalized_concepts_eliminate,
      id_solicitud_cotizacion: info_sc.cot_propia ? user_id : info_sc.folio_sc == '' ? info_sc.folio_sc : 0,
    })
  }

  useEffect(() => {
    setQuoteFields({
      id: modal === 'create-modal__qoutation' ? 0 : quotes.quotes.id,
      id_sucursal: modal === 'create-modal__qoutation' ? branch.id : quatation.id_sucursal,
      id_cliente: selectedResult?.id ?? quatation.id_cliente,
      id_usuario_crea: user_id,
      titulo: quotes.quotes.titulo,
      comentarios: '',
      conceptos: quotes?.normal_concepts,
      conceptos_pers: quotes?.personalized_concepts,
      conceptos_elim: quotes?.normal_concepts_eliminate,
      conceptos_pers_elim: quotes?.personalized_concepts_eliminate,
      id_solicitud_cotizacion: info_sc.cot_propia ? user_id : info_sc.folio_sc == '' ? info_sc.folio_sc : 0,
    })
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
    traerSolicitudes(resultUsers[0].id)
  }
  const setSaleOrdersToUpdate = storeSaleOrder(state => state.setSaleOrdersToUpdate)

  const setModalLoading = storeArticles((state: any) => state.setModalLoading);
  const setSaleOrdersConcepts = storeSaleOrder((state) => state.setSaleOrdersConcepts);
  // const setDataGet = storeSaleOrder((state) => state.setSaleOrders);

  const mandarAOV = async () => {
    quatation.fecha_creacion = new Date().toISOString().split('T')[0];
    quatation.conceptos.forEach(element => {
      element.enviar_a_produccion = userState.forzar_produccion
    });
    quatation.conceptos_pers.forEach(element => {
      element.conceptos.forEach(el => {
        el.enviar_a_produccion = userState.forzar_produccion
      });
    });
    // debugger
    // return
    setModalLoading(true)
    await APIs.CreateAny(quatation, 'enviar_cot_a_ov').then(async (resp: any) => {
      if (!resp.error) {
        await APIs.GetAny('get_carrito/' + user_id).then((r: any) => {
          let orden = r[0]
          setSaleOrdersConcepts({ sale_order: orden, normal_concepts: orden.conceptos, personalized_concepts: orden.conceptos_pers });
          setModalLoading(false)
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
    setModalSalesOrder('sale-order__modal')
  }

  useEffect(() => {
    fetch()
  }, [branch])

  const client = async () => {
    const data = {
      id_sucursal: quatation.id_sucursal,
      id_usuario: user_id,
      nombre: quatation.rfc
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
    }
  }, [modal])




  const selectedIds: any = useSelectStore((state) => state.selectedIds);
  const setSelectedId = useSelectStore((state) => state.setSelectedId);

  const [clients, setClients] = useState<any>([])


  const searchUsers = async () => {
    const data = {
      id_sucursal: branch.id,
      id_usuario: user_id,
      nombre: name
    }

    try {
      const resultClients = await getClients(data)
      setClients(resultClients)
      setSelectedResult(resultClients[0])

    } catch (error) {

    }

  }



  const setIndexVM = storeDv(state => state.setIndex)
  const seeVerMas = (index: number, type: string) => { //AL ABRIR SEE-CP NO SE VISUALIZA LA INFORMACIÓN DE LAS PLANTILLAS PORQUE SIGUE USANDO NORMALCONCEPTS CORREGIR AQUÍ Y EN LA COTIZACIÓN
    setIndexVM(index)
    setModalSub('see_cp')
    setTypeConcept(type)
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
  const permisosxVistaheader = storeDv((state) => state.permisosxvistaheader);
  const checkPermission = (elemento: string) => {
    return permisosxVistaheader.some((x: any) => x.titulo == elemento)
  }

  const createQuotation = async () => {
    try {
      if (modal === 'create-modal__qoutation') {
        let copy_data = { ...quoteFields }
        copy_data.id_sucursal = branch?.id
        // debugger
        if (copy_data?.conceptos != undefined && copy_data?.conceptos?.length > 0) {
          copy_data?.conceptos?.forEach(element => {
            element.campos_plantilla.forEach(el => {
              el.valor = el.valor.toString()
            });
          });
        }
        if (copy_data?.conceptos_pers != undefined && copy_data?.conceptos_pers?.length > 0) {
          copy_data?.conceptos_pers?.forEach(element => {
            element?.conceptos?.forEach(el => {
              el.unidad = el.id_unidad
              el.descuento = 0
              el.campos_plantilla.forEach(e => {
                e.valor = e.valor.toString()
              });
            });
          });
        }
        const response: any = await APIs.createQuotation(copy_data)
        if (response.error == true) {
          return Swal.fire('Advertencia', response.mensaje, 'warning');
        } else {
          Swal.fire('Cotizacion creada exitosamente', '', 'success');
          let response: any = await APIs.getQuotation(dataGet);
          setQuotesData(response)
          setModal('')
          setQuotes({ sale_order: {}, normal_concepts: [], personalized_concepts: [], normal_concepts_eliminate: [], personalized_concepts_eliminate: [] })
          localStorage.removeItem("cotizacion");
        }
      } else {
        let response: any = await APIs.updateQuotation(quoteFields)
        if (response.error == true) {
          return Swal.fire('Advertencia', response.mensaje, 'warning');
        } else {
          Swal.fire('Cotizacion actualizada exitosamente', '', 'success');
          Swal.fire('Cotizacion creada exitosamente', '', 'success');
          const response = await APIs.getQuotation(dataGet);
          setQuotesData(response)
          setModal('')
          setQuotes({ normal_concepts: [], personalized_concepts: [] });

        }
      }

    } catch (error) {
      Swal.fire('Error', 'Hubo un error al crear la cotizacion:' + error, 'error');
    }

  }
  const undoConcepts = (concept: any, i: number, adicional: boolean) => {
    const deleteItemCustomC = quotes?.personalized_concepts.filter((_: any, index: number) => index !== i);

    if (adicional) {
      // Solo elimina el concepto personalizado
      setQuotes({
        ...quotes,
        personalized_concepts: deleteItemCustomC,
        personalized_concepts_eliminate: concept.id
          ? [...quotes.personalized_concepts_eliminate, concept.id]
          : [...quotes.personalized_concepts_eliminate],
      });
      localStorage.setItem('cotizacion-pers', JSON.stringify(deleteItemCustomC));
    } else {
      // Elimina el concepto personalizado y actualiza normal_concepts
      const updatedConcepts = concept.conceptos.map((element: any) => ({
        ...element,
        id_pers: 0,
        check: false,
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
    }
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
    // setQuotes({ normal_concepts: [], personalized_concepts: [] });
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
    if (concept.con_adicional) {
      setPersonalizedModal('personalized_modal-quotation-update-additional');
    } else {
      setPersonalizedModal('personalized_modal-quotation-update');
    }
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



  const [i, setI] = useState(0);
  const [indexUpdate, setIndexUpdate] = useState<any>(null)
  const abrirFichaModifyConcept = async (x: any, index: number) => {
    setI((prevI) => {
      const newI = prevI + 1;
      setIdA(newI); // Ahora usará el valor actualizado
      return newI;
    });

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
  const traerSolicitudes = async (usuario: any) => {
    DynamicVariables.updateAnyVar(setInfo_sc, 'vendedor', usuario.id)
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
      quotes.normal_concepts.forEach((elemen: any) => {
        elemen.urgencia = 0
        elemen.urgency = false
      });
      quotes.conceptos_pers?.forEach((elemen: any) => {
        elemen.conceptos?.forEach(x => {
          x.urgencia = 0
          x.urgency = false
        });

      });
      setUrgenciaG(false)
      setCalculations((prev) => ({
        ...prev,
        urgencia: 0,
        total: prev.subtotal + prev.descuento
      }));
      localStorage.setItem('urgency', JSON.stringify(false));


    } else {
      setUrgenciaG(urg)
      localStorage.setItem('urgency', JSON.stringify(true));
      let length = quotes.normal_concepts.length
      let urgency = calculations.total * 0.30
      let u = urgency / length
      console.log(length)
      console.log(urgency)

      quotes.normal_concepts.forEach((elemen: any) => {
        elemen.urgencia = u
        elemen.urgency = true
      });
      quotes.conceptos_pers?.forEach((elemen: any) => {
        elemen.conceptos?.forEach(x => {
          x.urgencia = u
          x.urgency = true
        });

      });
      setUrgenciaG(true)
      setCalculations((prev) => ({
        ...prev,
        urgencia: urgency,
        total: prev.total + urgency

      }));
      localStorage.setItem('cotizacion', JSON.stringify(quotes.normal_concepts));
      localStorage.setItem('cotizacion-pers', JSON.stringify(quotes.personalized_concepts));
    }

  }
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
                  </div>
                  <div className='col-6 md-col-12'>
                    <span className='text'>Empresa: <b>{quotes.quotes.empresa}</b></span><br />
                    <span className='text'>Sucursal: <b>{quotes.quotes.sucursal}</b></span><br />
                  </div>
                </div>
                <div className='mt-3'>
                  {modal === 'create-modal__qoutation' ?
                    ''
                    :
                    quotes.quotes.vencida ?
                      <div className='row__bts col-12'>
                        <div className='btn__pdf'>
                          <button className='btn__general-orange'>Activar cotizacion</button>
                        </div>
                        <div>
                          <p className='cancel-identifier'>Esta cotizacion esta vencida</p>
                        </div>
                      </div>
                      :
                      <div className='row__bts col-12'>
                        <div className='btn__pdf'>
                          <button className='btn__general-orange' onClick={getTicket}>PDF</button>

                        </div>
                        <div className='btn__update-qoutation'>
                          <button className='btn__general-primary' onClick={createQuotation}>Actualizar cotizacion</button>
                        </div>
                        <div>
                          <button className='btn__general-bg-100' onClick={mandarAOV}>Enviar a OV</button>
                        </div>
                      </div>

                  }
                </div>
              </div>
            </div>
          }
          {permisosxVista.map((x: any) =>
            x.titulo == 'campos_cotizador' ?
              <div className='row' key={x.id}>
                <div className='col-4'>
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
                <div className='col-4'>
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
                <div className='col-4'>
                  <div className="">
                    <label className="">Folio de Solicitud</label>
                    <div>
                      <select
                        className="select_original_general"
                        value={info_sc?.folio_sc}
                        onChange={(e) => {
                          console.log('Folio cambiado:', e.target.value);
                          setInfo_sc((prev: any) => ({ ...prev, folio_sc: e.target.value }));
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
              </div>
              :
              ''
          )}

          <div className='row__two'>
            <div className='row__one'>
              <div className='col-12'>
                <p className='title'>Datos de la Cotización</p>
              </div>
              <div className='col-12'>
                <div className='row col-12 md-col-12'>
                  <div className='row col-12'>
                    {modal == 'create-modal__qoutation' ?

                      <div className='col-8 md-col-12'>
                        <Empresas_Sucursales modeUpdate={false} empresaDyn={company} setEmpresaDyn={setCompany} sucursalDyn={branch} setSucursalDyn={setBranch} branch={setBranch} />

                      </div>
                      : ''
                    }
                    <div className='col-4'>
                      <label className='label__general'>Título</label>
                      <div className='warning__general'><small >Este campo es obligatorio</small></div>
                      <input className={`inputs__general`} type="text" value={quoteFields.titulo} onChange={(e) => setQuoteFields({ ...quoteFields, titulo: e.target.value })} placeholder='Ingresa el título' />
                    </div>
                  </div>



                  {/* <div className='col-4 md-col-6 sm-col-12'>
                    <Select dataSelects={dataSelects} instanceId="select1" nameSelect={'Vendedor'} />:''
                  </div> */}
                </div>
              </div>
              <div className='w-full my-2 row col-12'>

                <div className='col-12'>
                  <label className='label__general'>Comentarios</label>
                  <div className='warning__general'><small >Este campo es obligatorio</small></div>
                  <textarea className={`textarea__general`} value={quoteFields.comentarios} onChange={(e) => setQuoteFields({ ...quoteFields, comentarios: e.target.value })} placeholder='Comentarios'></textarea>
                </div>

              </div>
            </div>


            <div className='w-full my-2 row__three'>
              {/* <div className='col-12'>
              <p className='title'>Datos del Cliente</p>
            </div> */}
              <div>
                <label className='label__general'>Nombre</label>
                <div className='warning__general'><small >Este campo es obligatorio</small></div>
                <input className={`inputs__general`} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Ingresa el nombre' onKeyUp={(event) => event.key === 'Enter' && searchUsers()} />
              </div>
              <div className='d-flex align-items-end justify-content-center'>
                <div className='search-icon' onClick={searchUsers}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </div>
              </div>
              <div>
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
              </div>
              <div className='d-flex align-items-end'>
                <button className='btn__general-purple' onClick={() => setClientsModal('clients_modal')}>ver cliente</button>
              </div>

              <div className='d-flex align-items-end'>
                {urgenciaG ?
                  <button type='button' className='mr-4 btn__general-success' onClick={() => urgenciaGlobal(false)}>Remover Urgencias</button>
                  :
                  <button type='button' className='mr-4 btn__general-orange' onClick={() => urgenciaGlobal(true)}>Agregar Urgencia a Orden</button>
                }
                <button className='btn__general-purple' onClick={modalPersonalized}>Crear personalizados</button>
              </div>
              <div className='d-flex align-items-end' title='Busqueda de articulos'>
                <div className='btn__general-purple-icon'>
                  <svg onClick={() => { setModalArticleView('article-view__modal'); setTypeLocalStogare('cotizacion') }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="d-flex lucide lucide-package-search"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" /><path d="m7.5 4.27 9 5.15" /><polyline points="3.29 7 12 12 20.71 7" /><line x1="12" x2="12" y1="22" y2="12" /><circle cx="18.5" cy="15.5" r="2.5" /><path d="M20.27 17.27 22 19" /></svg>
                </div>
              </div>
            </div>
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
                          {article.con_adicional ?
                            <div className='td'>
                              <div className='delete-icon' onClick={() => undoConcepts(article, index, true)} title='Eliminar concepto'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                              </div>
                            </div>
                            :
                            <div className='td'>
                              <div className='undo-icon' onClick={() => undoConcepts(article, index, false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-undo-2"><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" /></svg>
                              </div>
                            </div>
                          }

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
                          {article.con_adicional ?
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
                          }

                        </div>
                      </div>
                    )
                  })}
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
      {personalizedModal !== '' ?
        <SeeCamposPlantillas typeConcept={typeConcept} />
        :
        <SeeCamposPlantillas typeConcept={typeConcept} />
      }

    </div>
  );
};

export default ModalCreate;
