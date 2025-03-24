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



const ModalCreate: React.FC = () => {
  const userState = useUserStore(state => state.user);
  const user_id = userState.id
  const setModalArticleView = storeArticleView((state) => state.setModalArticleView);
  const setPersonalizedModal = storePersonalized((state) => state.setPersonalizedModal);
  const setNormalConceptsView = storePersonalized((state) => state.setNormalConceptsView);
  // Temporal

  const setConceptView = storePersonalized(state => state.setConceptView)
  const setNormalConcepts = storePersonalized(state => state.setNormalConcepts)
  const setDeleteNormalConcepts = storePersonalized(state => state.setDeleteNormalConcepts)
  const setCustomConcepts = storePersonalized(state => state.setCustomConcepts)
  const setDeleteCustomConcepts = storePersonalized(state => state.setDeleteCustomConcepts)
  const setCustomConceptView = storePersonalized(state => state.setCustomConceptView)
  const setCustomLocal = storePersonalized(state => state.setCustomLocal)

  ////////////////// Personalized Variations////////////////////////////////// 
  const { normalConcepts, deleteNormalConcepts, customConcepts, deleteCustomConcepts, conceptView, dataUpdate, personalizedModal, normalConceptsView }: any = useStore(storePersonalized)
  const permisosxVista = storeDv((state) => state.permisosxvista);

  const setModalSalesOrder = storeSaleOrder(state => state.setModalSalesOrder)

  const setQuotesData = storeQuotation(state => state.setQuotesData);
  const setIdArticle = storeSaleCard(state => state.setIdArticle)

  const { dataGet }: any = useStore(storeQuotation);

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

  const setQuotes = storeQuotation(state => state.setQuotes)
  const { quotes }: any = useStore(storeQuotation);



  const [name, setName] = useState<any>()
  const [comments, setComments] = useState<any>()
  const [title, setTitle] = useState<any>('')
  const [subtotal, setSubtotal] = useState<number>(0)
  const [descuento, setDescuento] = useState<number>(0)
  const [urgencia, setUrgencia] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)

  const [subtotalf, setSubtotalf] = useState<number>(0)
  const [urgenciaf] = useState<number>(0)
  const [totalf, setTotalf] = useState<number>(0)

  const setSaleOrdersToUpdate = storeSaleOrder(state => state.setSaleOrdersToUpdate)

  const [, setDataSelects] = useState<any>([])
  const [info_sc, setInfo_sc] = useState<any>({
    vendedor: 0,
    vendedores: [],
    cot_propia: false,
    folio_sc: 0,
    folios_solicitudes: []
  })

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


  const mandarAOV = () => {
    const copiaQuatation = {
      ...quatation,
      conceptos: quatation.conceptos.map((concepto: any) => {
        const { id, ...rest } = concepto; // Extrae "id" y deja el resto
        return rest; // Retorna el objeto sin "id"
      })
    };
    copiaQuatation?.conceptos.forEach((element: any) => {
      element.id_area_produccion = element.areas_produccion[0].id_area
    });


    copiaQuatation?.conceptos_pers.forEach((element: any) => {
      element.conceptos.forEach((x: any) => {
        x.id_area_produccion = x.areas_produccion[0].id_area
      });
    });
    setSaleOrdersToUpdate(copiaQuatation)
    setModalSalesOrder('sale-order__modal_bycot')
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

    if (modal === 'update-modal__qoutation') {
      forupdate()
    }
  }, [quatation])
  const forupdate = async () => {
    await client()

    setCompany({ id: quatation.id_empresa })
    setBranch({ id: quatation.id_sucursal })
    setComments(quatation.comentarios)
    selectedResult(quatation.id_cliente)
  }

  useEffect(() => {
    if (personalizedModal == 'personalized_modal-quotation-update') {

    } else {

    }

  }, [])


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


    } catch (error) {

    }

  }



  useEffect(() => {

  }, [selectedIds])

  const seeClient = () => {
    setClientsModal('clients_modal')

  }

  const setIndexVM = storeDv(state => state.setIndex)
  const seeVerMas = (index: number) => {
    setIndexVM(index)
    setModalSub('see_cp')
  }
  const [selectResults, setSelectResults] = useState<boolean>(false);
  const [selectedResult, setSelectedResult] = useState<any>(null);

  const openSelectResults = () => {
    setSelectResults(!selectResults)
  }

  const handleResultsChange = (result: any) => {
    setClient(result)
    setSelectedResult(result);
    setSelectResults(!selectResults)
  };



  // console.log('DATA QUE SE ENVIA AL BEKEND', personalized)

  const createQuotation = async () => {

    const filter = normalConcepts.filter((x: any) => x.personalized !== true)

    filter.forEach((element: any) => {
      element.unidad = element.id_unidad
      element.total = element.precio_total
      element.urgencia = element.monto_urgencia
      element.campos_plantilla.forEach((cp: any) => {
        cp.valor = cp.valor.toString()
      });
    });



    if (customConcepts.length > 0) {
      customConcepts?.forEach((element: any) => {
        element.conceptos.forEach((x: any) => {
          x.unidad = x.id_unidad
          x.total = x.precio_total
          x.urgencia = x.monto_urgencia
          x?.campos_plantilla?.forEach((cp: any) => {
            cp.valor = cp.valor.toString()
          });
        });
      });
    }
    const data = {
      id: modal === 'create-modal__qoutation' ? 0 : quatation.id,
      id_sucursal: modal === 'create-modal__qoutation' ? branch.id : quatation.id_sucursal,
      // id_cliente: modal === 'create-modal__qoutation' ? selectedResult?.id : quatation.id_cliente,
      id_cliente: selectedResult?.id ? selectedResult?.id : quatation.id_cliente,
      id_usuario_crea: user_id,
      titulo: title,
      comentarios: comments,
      conceptos: normalConcepts,
      conceptos_pers: customConcepts,
      conceptos_elim: deleteNormalConcepts,
      conceptos_pers_elim: deleteCustomConcepts,
      id_solicitud_cotizacion: info_sc.cot_propia ? user_id : info_sc.folio_sc == '' ? info_sc.folio_sc : 0,
    };


    // console.log(data);

    // return

    try {
      if (modal === 'create-modal__qoutation') {
        const response: any = await APIs.createQuotation(data)
        if (response.error == true) {
          return Swal.fire('Advertencia', response.mensaje, 'warning');
        } else {
          Swal.fire('Cotizacion creada exitosamente', '', 'success');
          let response = await APIs.getQuotation(dataGet);
          setQuotesData(response)
          setModal('')
        }
      } else {
        let response: any = await APIs.updateQuotation(data)
        if (response.error == true) {
          return Swal.fire('Advertencia', response.mensaje, 'warning');
        } else {
          Swal.fire('Cotizacion actualizada exitosamente', '', 'success');
          Swal.fire('Cotizacion creada exitosamente', '', 'success');
          const response = await APIs.getQuotation(dataGet);
          setQuotesData(response)
          setModal('')
        }
      }
      setComments('')
      setName('')
      setCustomLocal([])
      setNormalConceptsView([])
      setNormalConcepts([])
      setDeleteNormalConcepts([])
      setDeleteCustomConcepts([])
      setCustomConcepts([])
      setConceptView([])
      setCustomConceptView([])
      localStorage.removeItem("cotizacion");
    } catch (error) {
      Swal.fire('Error', 'Hubo un error al crear la cotizacion', 'error');
    }

  }


  const undoConcepts = (concept: any, i: number) => {
    const deleteItemCustomC = customConcepts.filter((_: any, index: number) => index !== i);
    const updatedConcepts = concept.conceptos.map((element: any) => ({
      ...element,
      id_pers: 0,
      check: false,
    }));

    setCustomConcepts(deleteItemCustomC)
    setNormalConcepts([...normalConcepts, ...updatedConcepts])

  };

  const deleteNormalConcept = (item: any, i: number) => {
    // if (modal === 'create-modal__qoutation') {

    //   const filter = normalConcepts.filter((c: any, index: number) => index !== i)
    //   setNormalConcepts(filter)
    //   toast.success('Concepto eliminado')
    //   localStorage.setItem('cotizacion', JSON.stringify(filter));

    // } else {
    //   const filter = normalConcepts.filter((c: any, index: number) => index !== i)
    //   setNormalConcepts(filter)
    //   toast.success('Concepto eliminado')
    //   localStorage.setItem('cotizacion', JSON.stringify(filter));
    // }

    const filter = normalConcepts.filter((c: any, index: number) => index !== i)
    const filterQuotes = quotes.filter((c: any, index: number) => index !== i)
    setNormalConcepts(filter)
    toast.success('Concepto eliminado')
    localStorage.setItem('cotizacion', JSON.stringify(filter));
    setQuotes(filterQuotes)
  }



  // const deleteCustomConcept = (item: any) => {
  //   if (modal === 'create-modal__qoutation') {
  //     const filter_view = conceptView.filter((c: any) => c.id_identifier !== item.id_identifier)
  //     setConceptView(filter_view)

  //     const filter_normal = customConcepts.filter((c: any) => c.id_identifier !== item.id_identifier)
  //     setCustomConcepts(filter_normal)
  //     toast.success('Concepto eliminado')
  //   } else {
  //     const filter = customConcepts.filter((c: any) => c.id_identifier !== item.id_identifier)
  //     setCustomConcepts(filter)
  //     const filter_view = conceptView.filter((c: any) => c.id_identifier !== item.id_identifier)
  //     setConceptView(filter_view)
  //     setCustomConceptView(filter_view)
  //     setDeleteCustomConcepts([...deleteCustomConcepts, item.id])
  //     toast.success('Concepto eliminado')
  //   }
  // }



  useEffect(() => {

  }, [dataUpdate])



  const closeModal = () => {
    setModal('')
    setCustomLocal([])
    setNormalConceptsView([])

    // setNormalConcepts([])
    setDeleteNormalConcepts([])

    setCustomConcepts([])
    setDeleteNormalConcepts([])
    setConceptView([])
    setCustomConceptView([])
    setDataQuotation([])
  }

  const [typeLocalStogare, setTypeLocalStogare] = useState<any>()



  const modalPersonalized = () => {
    setPersonalizedModal('personalized_modal-quotation')
    setCustomConceptView(normalConcepts)
  }


  const [idItem, setIdItem] = useState<number>()
  const [indexItem, setIndexItem] = useState<any>()

  const modalPersonalizedUpdate = (concept: any, index: number) => {
    setIndexItem(index)
    localStorage.removeItem("contizacion");
    if (concept.con_adicional) {
      setPersonalizedModal('personalized_modal-quotation-update-additional');
    } else {
      setPersonalizedModal('personalized_modal-quotation-update');

    }
    setIdItem(concept);
    concept.conceptos.forEach((element: any) => {
      element.check = true;
      // Incrementar y asignar
    });
    setCustomConceptView([...concept.conceptos, ...normalConcepts]);

    // if (modal == 'create-modal__qoutation') {

    // } else {
    //   concept.conceptos.forEach((element: any) => {
    //     element.check = true;
    //     // Incrementar y asignar
    //   });
    //   setCustomConceptView([...concept.conceptos, ...normalConcepts]);


    // }
    // if (concept.con_adicional) {
    //   setCustomConceptView(concept.conceptos);
    // } else {
    //   setCustomConceptView([...concept.conceptos, ...normalConcepts]);
    // }

  }






  const handleUrgencyChange = async (index: number) => { //FALTA APLICAR FRANQUICIA
    let data = {
      "id_articulo": normalConcepts[index].id_articulo,
      "id_sucursal": branch.id,
      "total": normalConcepts[index].precio_total
    }
    const newConcept = [...normalConcepts];
    newConcept[index].urgency = !newConcept[index]?.urgency;

    if (newConcept[index].urgency) {
      await APIs.CreateAny(data, "calcular_urgencia")
        .then(async (response: any) => {
          if (!response.error) {
            newConcept[index].monto_urgencia = parseFloat(response.monto_urgencia);
            newConcept[index].precio_total = parseFloat(response.total_con_urgencia);
          } else {
            Swal.fire('Notificación', response.mensaje, 'warning');
            return
          }
        })
    } else {
      newConcept[index].precio_total = (parseFloat(newConcept[index].precio_total) - parseFloat(newConcept[index].monto_urgencia)).toFixed(2);
      newConcept[index].monto_urgencia = 0;
    }
    setNormalConcepts(newConcept);

  };

  //EFFECT PARA CALCULAR LOS TOTALES CUANDO CAMBIE NORMALCONCEPTS-----------------------------------------------------------------------------
  useEffect(() => {
    const precios = normalConcepts.reduce(
      (acc: any, item: any) => ({
        precio_unitario: acc.precio_unitario + (parseFloat(item.precio_unitario) || 0),
        descuento: acc.descuento + (parseFloat(item.descuento) || 0),
        monto_urgencia: acc.monto_urgencia + (parseFloat(item.monto_urgencia) || 0),
        total: acc.total + (parseFloat(item.precio_total) || 0),
        total_franquicia: acc.total_franquicia + (parseFloat(item.total_franquicia) || 0),
      }),
      { precio_unitario: 0, descuento: 0, monto_urgencia: 0, total: 0, total_franquicia: 0 }
    );
    const preciospers = customConcepts.reduce(
      (acc: any, item: any) => ({
        precio_unitario: acc.precio_unitario + (parseFloat(item.precio_unitario) || 0),
        descuento: acc.descuento + (parseFloat(item.descuento) || 0),
        monto_urgencia: acc.monto_urgencia + (parseFloat(item.monto_urgencia) || 0),
        total: acc.total + (parseFloat(item.precio_total) || 0),
        total_franquicia: acc.total_franquicia + (parseFloat(item.total_franquicia) || 0),
      }),
      { precio_unitario: 0, descuento: 0, monto_urgencia: 0, total: 0, total_franquicia: 0 }
    );
    setSubtotal(preciospers.total + preciospers.descuento - preciospers.monto_urgencia + precios.total + precios.descuento - precios.monto_urgencia);
    setDescuento(preciospers.descuento + precios.descuento);
    setUrgencia(preciospers.monto_urgencia + precios.monto_urgencia);
    setTotal(preciospers.total + precios.total);

    setSubtotalf(preciospers.total_franquicia + precios.total_franquicia);
    setTotalf(preciospers.total_franquicia + precios.total_franquicia);


  }, [normalConcepts, customConcepts])
  // const cambioInputsPers = async (valor: number, index: number, key: string) => {
  //   const newConcept = [...normalConcepts];
  //   newConcept[index][key] = valor;
  //   setNormalConcepts(newConcept);
  // };
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

    setIdArticle(x.id_articulo)
    setDataArticle(x)

    setModalSalesCard('sale-card-quotation')
  }
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

  console.log(info_sc)
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
                <h3 className="text">{quatation.serie}-{quatation.folio}-{quatation.anio}</h3>
                <hr />
                <div className='row'>
                  <div className='col-6 md-col-12'>
                    <span className='text'>Creado por: <b>{quatation.usuario_crea}</b></span><br />
                    <span className='text'>Fecha de Creación: <b>{quatation.fecha_creacion}</b></span><br />
                    {quatation.status === 0 ? (
                      <span className="active-status">Activo</span>
                    ) : quatation.status === 1 ? (
                      <span className="canceled-status">Cancelada</span>
                    ) : (
                      quatation.status === 2 ? (
                        <span className="end-status">Terminado</span>
                      ) : (
                        ""
                      )
                    )}
                  </div>
                  <div className='col-6 md-col-12'>
                    <span className='text'>Empresa: <b>{quatation.empresa}</b></span><br />
                    <span className='text'>Sucursal: <b>{quatation.sucursal}</b></span><br />
                  </div>
                </div>
                <div className='mt-3'>
                  {modal === 'create-modal__qoutation' ?
                    ''
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
                  {modal == 'create-modal__qoutation' ?
                    <div className='row col-12'>
                      <div className='col-8 md-col-12'>
                        <Empresas_Sucursales modeUpdate={false} empresaDyn={company} setEmpresaDyn={setCompany} sucursalDyn={branch} setSucursalDyn={setBranch} branch={setBranch} />

                      </div>
                      <div className='col-4'>
                        <label className='label__general'>Título</label>
                        <div className='warning__general'><small >Este campo es obligatorio</small></div>
                        <input className={`inputs__general`} type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Ingresa el título' />
                      </div>
                    </div>
                    :
                    ''
                  }

                  {/* <div className='col-4 md-col-6 sm-col-12'>
                    <Select dataSelects={dataSelects} instanceId="select1" nameSelect={'Vendedor'} />:''
                  </div> */}
                </div>
              </div>
              <div className='w-full my-2 row col-12'>

                <div className='col-12'>
                  <label className='label__general'>Comentarios</label>
                  <div className='warning__general'><small >Este campo es obligatorio</small></div>
                  <textarea className={`textarea__general`} value={comments} onChange={(e) => setComments(e.target.value)} placeholder='Comentarios'></textarea>
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
                <input className={`inputs__general`} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Ingresa el nombre' />
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
                        <p>{selectedResult ? clients?.find((s: { id: number }) => s.id === selectedResult.id)?.razon_social : 'Selecciona'}</p>
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
                <button className='btn__general-purple' onClick={seeClient}>ver cliente</button>
              </div>
              <div className='d-flex align-items-end'>
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
                  <div>
                    <p>Total</p>
                  </div>
                </div>
              </div>
              <div className='table__quotations-modal-body-desk'>
                {normalConcepts ? (
                  <div className='table__body'>
                    {normalConcepts?.map((article: any, index: number) => {
                      return (
                        <div className='tbody__container' key={index}>
                          {article.personalized ?
                            <div className='concept__personalized'>
                              <p>Concepto Personalizado</p>
                            </div>
                            :
                            ''
                          }
                          {article.personalized ?
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
                                  <small>PUF:${Number(article.total_franquicia / article.cantidad).toFixed(2)}</small></p>
                              </div>
                              <div className='td'>
                                <div className='d-flex'>
                                  <div>
                                    <p className='total'>$ {parseFloat(article.precio_total).toFixed(2)}</p>
                                    <p className='total__franch'>{article.total_franquicia != null && !Number.isNaN(article.total_franquicia) ?
                                      <small>PF: ${parseFloat(article.total_franquicia).toFixed(2)}</small> : ''}</p>
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
                                <div className='see-icon' onClick={() => seeVerMas(index)} title='Ver mas campos'>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                                </div>
                              </div>
                              {article.con_adicional ?
                                <div className='td'>
                                  <div className='delete-icon' onClick={() => deleteNormalConcept(article, index)} title='Eliminar concepto'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                  </div>
                                </div>
                                :
                                <div className='td'>
                                  <div className='undo-icon' onClick={() => undoConcepts(article, index)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-undo-2"><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" /></svg>
                                  </div>
                                </div>
                              }

                            </div>
                            :
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
                                  {article.total_franquicia != null && !Number.isNaN(article.total_franquicia) ?
                                    <small>PUF:${Number(article.total_franquicia / article.cantidad).toFixed(2)}</small> : ''}
                                </p>
                              </div>
                              <div className='td '>
                                {article.urgency ?
                                  <div className='container__total'>
                                    <div>
                                      <p className='total'>$ {parseFloat(article.precio_total).toFixed(2)}</p>
                                      <p className='total__franch'>{article.total_franquicia != null && !Number.isNaN(article.total_franquicia) ?
                                        <small>PF:${parseFloat(article.total_franquicia).toFixed(2)}</small> : ''}</p>
                                    </div>
                                    <p className='remove__urgency' title='urgencia'>(+${parseFloat(article.monto_urgencia).toFixed(2)})</p>
                                  </div>
                                  :
                                  <div>
                                    <p className='total'>$ {parseFloat(article.precio_total).toFixed(2)}</p>
                                    <p className='total__franch'>{article.total_franquicia != null && !Number.isNaN(article.total_franquicia) ?
                                      <small>PF:${parseFloat(article.total_franquicia).toFixed(2)}</small> : ''}</p>
                                  </div>

                                }
                                {article.descuento > 0 ?
                                  <p style={{ color: 'green' }}>(-${parseFloat(article.descuento).toFixed(2)})</p>
                                  : ''}
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
                                <div className='see-icon' onClick={() => seeVerMas(index)} title='Ver mas campos'>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                                </div>
                              </div>

                              <div className='td'>
                                <div className='delete-icon' onClick={() => deleteNormalConcept(article, index)} title='Eliminar concepto'>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                </div>
                              </div>

                            </div>
                          }
                        </div>
                      )
                    })}
                    {customConcepts?.map((article: any, index: number) => {
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
                                <small>PUF:${Number(article.total_franquicia / article.cantidad).toFixed(2)}</small></p>
                            </div>
                            <div className='td'>
                              <div className='d-flex'>
                                <div>
                                  <p className='total'>$ {parseFloat(article.precio_total).toFixed(2)}</p>
                                  <p className='total__franch'>{article.total_franquicia != null && !Number.isNaN(article.total_franquicia) ?
                                    <small>PF: ${parseFloat(article.total_franquicia).toFixed(2)}</small> : ''}</p>
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
                              <div className='see-icon' onClick={() => seeVerMas(index)} title='Ver mas campos'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                              </div>
                            </div>
                            {article.con_adicional ?
                              <div className='td'>
                                <div className='delete-icon' onClick={() => deleteNormalConcept(article, index)} title='Eliminar concepto'>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                </div>
                              </div>
                              :
                              <div className='td'>
                                <div className='undo-icon' onClick={() => undoConcepts(article, index)}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-undo-2"><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" /></svg>
                                </div>
                              </div>
                            }

                          </div>

                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text">Cargando datos...</p>
                )}
              </div>
              <div className='table__quotations-modal-body-response'>
                <div className='table__body'>
                  {normalConcepts?.map((article: any, index: number) => {
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
                              {article.total_franquicia != null && !Number.isNaN(article.total_franquicia) ?
                                <small>PUF:${Number(article.total_franquicia / article.cantidad).toFixed(2)}</small> : ''}
                            </p>
                          </div>
                          <div className='td '>
                            {article.urgency ?
                              <div className='container__total'>
                                <div>
                                  <p className='total'>$ {parseFloat(article.precio_total).toFixed(2)}</p>
                                  <p className='total__franch'>{article.total_franquicia != null && !Number.isNaN(article.total_franquicia) ?
                                    <small>PF:${parseFloat(article.total_franquicia).toFixed(2)}</small> : ''}</p>
                                </div>
                                <p className='remove__urgency' title='urgencia'>(+${parseFloat(article.monto_urgencia).toFixed(2)})</p>
                              </div>
                              :
                              <div>
                                <p className='total'>$ {parseFloat(article.precio_total).toFixed(2)}</p>
                                <p className='total__franch'>{article.total_franquicia != null && !Number.isNaN(article.total_franquicia) ?
                                  <small>PF:${parseFloat(article.total_franquicia).toFixed(2)}</small> : ''}</p>
                              </div>

                            }
                            {article.descuento > 0 ?
                              <p style={{ color: 'green' }}>(-${parseFloat(article.descuento).toFixed(2)})</p>
                              : ''}
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
                            <div className='see-icon' onClick={() => seeVerMas(index)} title='Ver mas campos'>
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
                  {customConcepts?.map((article: any, index: number) => {
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
                              <small>PUF:${Number(article.total_franquicia / article.cantidad).toFixed(2)}</small></p>
                          </div>
                          <div className='td'>
                            <div className='d-flex'>
                              <div>
                                <p className='total'>$ {parseFloat(article.precio_total).toFixed(2)}</p>
                                <p className='total__franch'>{article.total_franquicia != null && !Number.isNaN(article.total_franquicia) ?
                                  <small>PF: ${parseFloat(article.total_franquicia).toFixed(2)}</small> : ''}</p>
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
                            <div className='see-icon' onClick={() => seeVerMas(index)} title='Ver mas campos'>
                              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                            </div>
                          </div>
                          {article.con_adicional ?
                            <div className='td'>
                              <div className='delete-icon' onClick={() => deleteNormalConcept(article, index)} title='Eliminar concepto'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                              </div>
                            </div>
                            :
                            <div className='td'>
                              <div className='undo-icon' onClick={() => undoConcepts(article, index)}>
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
                  <p className='value'>$ {subtotal}</p>
                </div>
              </div>
              <div className='discount'>
                <div>
                  <p className='name'>Descuento</p>
                  <p className='value'>$ {descuento}</p>
                </div>
              </div>
              <div className='urgency'>
                <div>
                  <p className='name'>Urgencia</p>
                  <p className='value'>$ {urgencia}</p>
                </div>
              </div>
              <div className='total'>
                <div>
                  <p className='name'>Total</p>
                  <p className='value'>$ {total}</p>
                </div>
              </div>
            </div>
            <div className='mt-1 btns'>
              <div className='subtotal'>
                <div>
                  <p className='name'>Subtotal Franquicia</p>
                  <p className='value'>$ {subtotalf}</p>
                </div>
              </div>

              <div className='urgency'>
                <div>
                  <p className='name'>Urgencia Franquicia</p>
                  <p className='value'>$ {urgenciaf}</p>
                </div>
              </div>
              <div className='total'>
                <div>
                  <p className='name'>Total Franquicia</p>
                  <p className='value'>$ {totalf}</p>
                </div>
              </div>
            </div>
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
        <SeeCamposPlantillas />
        :
        ""
      }

    </div>
  );
};

export default ModalCreate;
