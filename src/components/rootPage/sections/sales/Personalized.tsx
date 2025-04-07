import React, { useEffect, useState } from 'react'
import { storePersonalized } from '../../../../zustand/Personalized'
import { useStore } from 'zustand'
import './styles/Personalized.css'
import Select from '../../Dynamic_Components/Select'
import DynamicVariables from '../../../../utils/DynamicVariables'
import APIs from '../../../../services/services/APIs'
import { v4 as uuidv4 } from 'uuid';
import { useSelectStore } from '../../../../zustand/Select'
import { storeModals } from '../../../../zustand/Modals'
import { storeDv } from '../../../../zustand/Dynamic_variables'
import Swal from 'sweetalert2'
import SeeCamposPlantillas from './SeeCamposPlantillas'
import { storeSaleOrder } from '../../../../zustand/SalesOrder'
import { storeArticles } from '../../../../zustand/Articles'
import useUserStore from '../../../../zustand/General'
import { saleOrdersRequests } from '../../../../fuctions/SaleOrders'
import { storeQuotation } from '../../../../zustand/Quotation'
import { storeBilling } from '../../../../zustand/Billing'

const Personalized: React.FC<any> = ({ branch, idItem, indexItem, identifierBilling }: any,) => {
  const userState = useUserStore(state => state.user);
  const user_id = userState.id
  const { modal }: any = useStore(storeModals)

  const { subModal }: any = useStore(storeArticles)
  const setPersonalizedModal = storePersonalized(state => state.setPersonalizedModal)
  //////////////////////////////////////Store of Sale Orders //////////////////////////////////////////
  const setSaleOrdersConcepts = storeSaleOrder((state) => state.setSaleOrdersConcepts);
  const { saleOrdersConcepts, modalSalesOrder }: any = useStore(storeSaleOrder);

  //////////////////////////////////////Store of Quotes //////////////////////////////////////////
  const setQuotes = storeQuotation(state => state.setQuotes)
  const { quotes }: any = useStore(storeQuotation);
  //////////////////////////////////////Store of Billing //////////////////////////////////////////
  const setBilling = storeBilling(state => state.setBilling)
  const { billing }: any = useStore(storeBilling);

  const setCustomConceptView = storePersonalized(state => state.setCustomConceptView)

  const { getSaleOrders }: any = saleOrdersRequests()

  const hoy = new Date();
  const haceUnaSemana = new Date();

  const { customConceptView, personalizedModal, customData, dataUpdate }: any = useStore(storePersonalized)

  const setModalSub = storeModals((state) => state.setModalSub);

  const selectedIds: any = useSelectStore((state) => state.selectedIds);
  const setSelectedIds = useSelectStore(state => state.setSelectedId)
  const setSelectedId = useSelectStore((state) => state.setSelectedId);

  const [units, setUnits] = useState<any>();

  const fetch = async () => {
    const result = await APIs.getUnits()
    setUnits({
      selectName: 'Unidades',
      options: 'nombre',
      dataSelect: result
    });
  }

  useEffect(() => {
    fetch()
  }, [])

  useEffect(() => {
    if (personalizedModal !== '') {
      setModalStatus(true)
      if (personalizedModal == 'personalized_modal-quotation-update') {
        setInputs((prev: any) => ({
          ...prev,
          descripcion: idItem?.descripcion,
          codigo: idItem?.codigo,
          cantidad: idItem?.cantidad,
          precio_total: idItem?.precio_total,
          comentarios_produccion: idItem?.comentarios_produccion,
          comentarios_factura: idItem?.comentarios_factura,
        }));
      }
    } else {
      setModalStatus(false)
    }
  }, [personalizedModal])


  const [selectsSatKey, setSelectsSatKey] = useState<any>()
  const [selectedSatKey, setSelectedSatKey] = useState<any>()

  const [selectedKey, setselectedKey] = useState<any>('')

  const [modalStatus, setModalStatus] = useState<boolean>(false)

  console.log('customConceptView', customConceptView)

  const addPersonalized = (_: any, i: number) => {
    setSelectedIds('units', { id: customConceptView[0].id_unidad })
    setselectedKey(saleOrdersConcepts.normal_concepts[0].clave_sat)

    setCustomConceptView(
      customConceptView.map((item: any, index: number) =>
        index === i ? { ...item, check: !item.check } : item
      )
    );
    // debugger
  };
  const setModalLoading = storeArticles((state: any) => state.setModalLoading);

  const createPersonalized = async () => {
    if (personalizedModal == 'personalized_modal-quotation' || personalizedModal == 'personalized_modal-sale' || personalizedModal == 'personalized_modal-billing') {
      let filter: any = []
      filter = customConceptView.filter((x: any) => x.check == true)

      if (filter.length > 0) {
        const data = {
          descripcion: inpust.descripcion,
          order: personalizedModal == 'personalized_modal-billing' ? {
            serie: customConceptView[0].serie,
            folio: customConceptView[0].folio,
            anio: customConceptView[0].anio
          } : 0,
          personalized: true,
          codigo: inpust.codigo,
          cantidad: inpust.cantidad,
          unidad: selectedIds?.units.id,
          name_unidad: selectedIds?.units?.nombre,
          clave_sat: selectedKey ? selectedKey : selectedSatKey?.Clave ? parseInt(selectedSatKey.Clave) : idItem.clave_sat,
          codigo_unidad_sat: 0,
          precio_total: inpust.precio_total,
          comentarios_produccion: inpust.comentarios_produccion,
          comentarios_factura: inpust.comentarios_factura,
          conceptos: filter,
        }

        let filterDelete = customConceptView.filter((x: any) => x.check !== true)
        if (personalizedModal == 'personalized_modal-quotation') {
          setQuotes({ normal_concepts: filterDelete, personalized_concepts: [...quotes?.personalized_concepts ?? [], data] });
          localStorage.setItem('cotizacion-pers', JSON.stringify([...(quotes?.personalized_concepts ?? []), data]));
          localStorage.setItem('cotizacion', JSON.stringify(filterDelete))
        }
        if (personalizedModal == 'personalized_modal-sale') {
          let data_enviar = {
            concepto: data,
            id_usuario: user_id
          }
          setModalLoading(true)
          APIs.CreateAny(data_enviar, 'agregar_concepto_pers_preov').then(async (resp: any) => {
            if (!resp.error) {
              setModalLoading(false)
              Swal.fire('Notificación', resp.mensaje, 'success')

              await APIs.GetAny('get_carrito/' + user_id).then((r: any) => {
                let orden = r[0]
                setSaleOrdersConcepts({ sale_order: orden, normal_concepts: orden.conceptos, personalized_concepts: orden.conceptos_pers });
              })
            } else {
              setModalLoading(false)
              Swal.fire('Notificación', resp.mensaje, 'warning')
            }
          }).catch(e => {
            setModalLoading(false)
            Swal.fire('Notificación', 'ERROR: ' + e, 'warning')

          })
          // setSaleOrdersConcepts({ normal_concepts: filterDelete, personalized_concepts: [...saleOrdersConcepts?.personalized_concepts ?? [], data] });
          // localStorage.setItem('sale-order-pers', JSON.stringify([...(saleOrdersConcepts?.personalized_concepts ?? []), data]));
          // localStorage.setItem('sale-order', JSON.stringify(filterDelete));
        }
        if (personalizedModal == 'personalized_modal-billing') {
          setBilling({ normal_concepts: filterDelete, personalized_concepts: [...billing?.personalized_concepts ?? [], data] });
        }
        setCustomConceptView([])
        setPersonalizedModal('')

      } else {
        Swal.fire({
          title: "Advertencia",
          text: "Debes seleccionar al menos un concepto para crear el personalizado.",
          icon: "warning"
        });

      }
      return
    }
  }


  const updatePersonalized = async () => {
    if (personalizedModal == 'personalized_modal-quotation-update') {
      let length: number = 0;
      let filter = customConceptView.filter((x: any) => x.check == true)
      let filterDeleteNormal = customConceptView.filter((x: any) => x.check !== true)
      const updatedConceptView = quotes?.personalized_concepts.map((x: any, index: number) => {
        if (index == indexItem) {
          length = filter.length
          return {
            ...x,
            descripcion: inpust.descripcion,
            codigo: inpust.codigo,
            cantidad: inpust.cantidad,
            unidad: selectedIds?.units?.id,
            name_unidad: selectedIds?.units?.nombre,
            clave_sat: selectedKey ? selectedKey : selectedSatKey?.Clave ? parseInt(selectedSatKey.Clave) : idItem.clave_sat,
            precio_total: inpust.precio_total,
            comentarios_produccion: inpust.comentarios_produccion,
            comentarios_factura: inpust.comentarios_factura,
            conceptos: filter
          };
        }
        return x;
      });

      if (length > 0) {
        console.log('Se mantiene por que todavia le quedan conceptos', length)
        setQuotes({ normal_concepts: filterDeleteNormal, personalized_concepts: updatedConceptView });
        setPersonalizedModal('')
        return

      } else {
        let filterDelete = saleOrdersConcepts?.personalized_concepts.filter((_: any, index: number) => index !== indexItem)
        setQuotes({ normal_concepts: filterDeleteNormal, personalized_concepts: filterDelete });
        setPersonalizedModal('')
      }
    }


    if (personalizedModal == 'personalized_modal-sale-update') {

      if (modalSalesOrder == 'sale-order__modal') {
        let length: number = 0;

        let filter = customConceptView.filter((x: any) => x.check == true)
        let filterDeleteNormal = customConceptView.filter((x: any) => x.check !== true)
        const updatedConceptView = saleOrdersConcepts?.personalized_concepts.map((x: any, index: number) => {
          if (index == indexItem) {

            length = filter.length
            return {
              ...x,
              // conceptos: customLocal,
              id: idItem.id,
              descripcion: inpust.descripcion,
              codigo: inpust.codigo,
              cantidad: inpust.cantidad,
              unidad: selectedIds?.units?.id,
              precio_total: inpust.precio_total,
              clave_sat: selectedKey ? selectedKey : selectedSatKey?.Clave ? parseInt(selectedSatKey.Clave) : idItem.clave_sat,
              comentarios_produccion: inpust.comentarios_produccion,
              comentarios_factura: inpust.comentarios_factura,
              conceptos: filter,
            };
          }
          return x;
        });
        setModalLoading(true)
        let d = { ...updatedConceptView[indexItem] }
        d.unidad = selectedIds?.units?.id
        APIs.CreateAny(d, 'update_carrito_concepto_pers').then(async (resp: any) => {
          if (!resp.error) {
            setModalLoading(false)
            Swal.fire('Notificación', resp.mensaje, 'success')

            await APIs.GetAny('get_carrito/' + user_id).then((r: any) => {
              let orden = r[0]
              setSaleOrdersConcepts({ sale_order: orden, normal_concepts: orden.conceptos, personalized_concepts: orden.conceptos_pers });
            })
          } else {
            setModalLoading(false)
            Swal.fire('Notificación', resp.mensaje, 'warning')
          }
        }).catch(e => {
          setModalLoading(false)
          Swal.fire('Notificación', 'ERROR: ' + e, 'warning')

        })
        if (length > 0) {
          console.log('Se mantiene por que todavia le quedan conceptos', length)
          setSaleOrdersConcepts({ normal_concepts: filterDeleteNormal, personalized_concepts: updatedConceptView });
          setPersonalizedModal('')
          return
        } else {
          console.log('Se elimina', length)
          let filterDelete = saleOrdersConcepts?.personalized_concepts.filter((_: any, index: number) => index !== indexItem)
          setSaleOrdersConcepts({ normal_concepts: filterDeleteNormal, personalized_concepts: filterDelete });
          setPersonalizedModal('')
        }
        return
      } else {
        let data = {
          id: idItem.id,
          codigo: inpust.codigo,
          descripcion: inpust.descripcion,
          cantidad: inpust.cantidad,
          unidad: selectedIds.units.id,
          precio_total: inpust.precio_total,
          comentarios_factura: inpust.comentarios_factura,
          comentarios_produccion: inpust.comentarios_produccion,
          clave_sat: inpust.clave_sat,
          conceptos: []
        }

        const dataSaleOrders = {
          id: saleOrdersConcepts.id,
          folio: 0,
          id_sucursal: 0,
          id_serie: 0,
          id_cliente: 0,
          desde: haceUnaSemana.toISOString().split('T')[0],
          hasta: hoy.toISOString().split('T')[0],
          id_usuario: user_id,
          id_vendedor: selectedIds?.users?.id,
          status: 0,
          page: 1,
        }

        try {
          let response: any = await APIs.updateConceptPersonalized(data)
          const result = await getSaleOrders(dataSaleOrders)
          setQuotes({ personalized_concepts: result[0].conceptos_pers });
          setPersonalizedModal('')
          return Swal.fire('Éxito', response.mensaje, 'success');
        } catch (error: any) {
          return Swal.fire('Error', error.mensaje, 'error');
        }
        return
      }
    }

    if (personalizedModal == 'personalized_modal-billing-update') {


      let length: number = 0;

      let filter = customConceptView.filter((x: any) => x.check == true)
      let filterDeleteNormal = customConceptView.filter((x: any) => x.check !== true)
      const updatedConceptView = billing.personalized_concepts.map((x: any, index: number) => {
        if (index == indexItem) {

          length = filter.length
          return {
            ...x,
            id: idItem.id,
            order: {
              serie: customConceptView[0].serie,
              folio: customConceptView[0].folio,
              anio: customConceptView[0].anio
            },
            descripcion: inpust.descripcion,
            codigo: inpust.codigo,
            cantidad: inpust.cantidad,
            unidad: selectedIds?.units?.id,
            precio_total: inpust.precio_total,
            clave_sat: selectedKey ? selectedKey : selectedSatKey?.Clave ? parseInt(selectedSatKey.Clave) : idItem.clave_sat,
            comentarios_produccion: inpust.comentarios_produccion,
            comentarios_factura: inpust.comentarios_factura,
            conceptos: filter,
          };
        }
        return x;
      });

      console.log('updatedConceptView', updatedConceptView)

      if (length > 0) {
        console.log('Se mantiene por que todavia le quedan conceptos', length)
        setBilling({ normal_concepts: filterDeleteNormal, personalized_concepts: updatedConceptView });
        setPersonalizedModal('')
        return

      } else {
        let filterDelete = saleOrdersConcepts?.personalized_concepts.filter((_: any, index: number) => index !== indexItem)
        setBilling({ normal_concepts: filterDeleteNormal, personalized_concepts: filterDelete });
        setPersonalizedModal('')
      }
      return




    }

  }





  const [inpust, setInputs] = useState<any>({
    descripcion: '',
    codigo: '',
    cantidad: '',
    precio_total: 0,
    codigo_unidad_sat: '',
    comentarios_produccion: '',
    comentarios_factura: ''
  })



  const openselectsSatKey = () => {
    setSelectsSatKey(!selectsSatKey)
  }


  const handleKetSatChange = (key: any) => {
    setSelectsSatKey(false)
    setSelectedSatKey(key)
  }

  const [satKeyTerm, setSatKeyTerm] = useState<any>()
  const [satKey, setSatKey] = useState<any>()

  useEffect(() => {
    const fetchData = async () => {
      if (satKeyTerm.length >= 3) {
        const result = await APIs.getKeySat({ nombre: satKeyTerm });
        setSatKey(result);
      }
    };

    fetchData();
  }, [satKeyTerm]);



  const closeModal = () => {
    if (personalizedModal === 'personalized_modal-quotation-update') {
      setInputs((prev: any) => ({
        ...prev,
        descripcion: '',
        codigo: '',
        cantidad: 0,
        precio_total: 0,
        comentarios_produccion: '',
        comentarios_factura: '',
      }));
    }
    setPersonalizedModal('')
    setCustomConceptView([])

    // setCustomConceptView([])
    // setCustomLocal([])

  }








  const setIndexVM = storeDv(state => state.setIndex)

  const seeVerMas = (index: number) => {
    setIndexVM(index)
    setModalSub('see_cp-personalized')
  }







  const handleUrgencySaleChange = async (index: number) => {
    let data = {
      "id_articulo": customConceptView[index].id_articulo,
      "id_sucursal": saleOrdersConcepts.sale_order.id_sucursal,
      "total": customConceptView[index].precio_total
    }
    const newConcept: any = [...customConceptView];
    if (newConcept[index].urgency) {
      console.log('newConcept precio_total', newConcept[index].precio_total)
      newConcept[index].precio_total = parseFloat(newConcept[index].precio_total);
      newConcept[index].monto_urgencia = 0;

      newConcept[index].urgency = !newConcept[index]?.urgency;

    } else {
      await APIs.CreateAny(data, "calcular_urgencia")
        .then(async (response: any) => {
          if (!response.error) {
            newConcept[index].monto_urgencia = parseFloat(response.monto_urgencia);
          } else {
            Swal.fire('Notificación', response.mensaje, 'warning');
            return
          }
        })
      newConcept[index].urgency = !newConcept[index]?.urgency;
    }



    // newConcept[index].urgency = !newConcept[index]?.urgency;
    newConcept[index].id_usuario_actualiza = user_id

    try {
      APIs.updateCarritoConcepto(newConcept[index])

      await APIs.GetAny('get_carrito/' + user_id)
        .then(async (response: any) => {
          let order = response[0]
          setSaleOrdersConcepts({ normal_concepts: order.conceptos, personalized_concepts: order.conceptos_pers, sale_order: order });
          setCustomConceptView(order.conceptos);
          setPersonalizedModal('')
        })
    } catch (error) {

    }

   
   


  };


  const handleUrgencyChange = async (index: number) => {
    let data = {
      "id_articulo": customConceptView[index].id_articulo,
      "id_sucursal": quotes?.quotes?.id_sucursal,
      "total": customConceptView[index].precio_total
    }
    const newConcept = [...customConceptView];

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
    setCustomConceptView(newConcept);

  };

  console.log('quotes', quotes)

  const abrirFichaModifyConcept = () => {

  }

  const deleteArticle = (_: any, i: number) => {
    // const filter = normalConcepts.filter((_: any, index: number) => index !== i)
    // setNormalConcepts(filter)

  }


  const handleAreasChange = (event: React.ChangeEvent<HTMLSelectElement>, i: number) => {
    const value = parseInt(event.target.value, 10);
    let data = [...customConceptView]

    data[i].id_area_produccion = value
    // Actualizamos el estado con el array modificado
    setCustomConceptView(data);
  };


  const handleStatusChange = (_: any, i: any) => {
    // Utilizamos map para crear un nuevo array con los cambios aplicados
    if (customConceptView && customConceptView.length > 0) {
      setCustomConceptView(
        customConceptView.map((item: any, index: number) =>
          index === i ? { ...item, enviar_a_produccion: !item.enviar_a_produccion } : item
        )
      );
    } else {
      console.error("customConceptView está vacío o no es válido");
    }

    console.log(customConceptView)
  };


  const handleBranchChange = (_: any, i: any) => {
    // Utilizamos map para crear un nuevo array con los cambios aplicados
    if (customConceptView && customConceptView.length > 0) {
      setCustomConceptView(
        customConceptView.map((item: any, index: number) =>
          index === i ? { ...item, check_recibido_sucursal: !item.check_recibido_sucursal } : item
        )
      );
    } else {
      console.error("customConceptView está vacío o no es válido");
    }

    console.log(customConceptView)
  };

  const handleCustomerChange = (_: any, i: any) => {
    // Utilizamos map para crear un nuevo array con los cambios aplicados
    if (customConceptView && customConceptView.length > 0) {
      setCustomConceptView(
        customConceptView.map((item: any, index: number) =>
          index === i ? { ...item, check_entregado_cliente: !item.check_entregado_cliente } : item
        )
      );
    } else {
      console.error("customConceptView está vacío o no es válido");
    }

    console.log(customConceptView)
  };





  const updateSaleOrderConcept = async (article: any) => {
    let data = {
      id: article.id,
      id_articulo: article.id_articulo,
      produccion_interna: article.produccion_interna,
      id_area_produccion: article.id_area_produccion,
      enviar_a_produccion: article.enviar_a_produccion,
      cantidad: article.cantidad,
      urgencia: article.urgencia,
      monto_urgencia: article.monto_urgencia,
      monto_descuento: article.monto_descuento,
      precio_unitario: article.precio_unitario,
      id_unidad: article.id_unidad,
      obs_produccion: article.obs_produccion,
      obs_factura: article.obs_factura,
      id_pers: article.id_pers,
      id_usuario_actualiza: user_id
    }

    try {
      let response: any = await APIs.updateOvConcepto(data)
      if (response.error) {
        Swal.fire('Advertencia', response.mensaje, 'warning');
      } else {
        Swal.fire('Exito', response.mensaje, 'success');
      }
    } catch (error: any) {
      Swal.fire('Error al actualizar el concepto', error, 'success');
    }
  }



  useEffect(() => {
    if (idItem) {
      setSelectedId('units', { id: idItem.unidad });

      setInputs({
        descripcion: idItem.descripcion,
        codigo: idItem.codigo,
        clave_sat: selectedSatKey?.Clave ? parseInt(selectedSatKey.Clave) : idItem.clave_sat,
        unidad: selectedIds?.units?.id,
        cantidad: idItem.cantidad,
        precio_total: idItem.precio_total,
        codigo_unidad_sat: idItem.codigo_unidad_sat,
        comentarios_produccion: idItem.comentarios_produccion,
        comentarios_factura: idItem.comentarios_factura
      });
    }
  }, [personalizedModal]);




  const [realPrice, setRealPrice] = useState<any>()

  useEffect(() => {
    const totalPrice = customConceptView.reduce((acc: number, element: any) => {
      const precio = parseFloat(element.precio_total) || 0;
      const urgencia = parseFloat(element.urgencia) || parseFloat(element.monto_urgencia);
      return acc + precio + urgencia;
    }, 0);

    setRealPrice(totalPrice);
  }, [customConceptView]);

  const canceleStatus = async (item: any) => {
    console.log(item)
    let data = {
      id: item.id,
      id_usuario: user_id
    }
    const dataSaleOrders = {
      id: saleOrdersConcepts.id,
      folio: 0,
      id_sucursal: 0,
      id_serie: 0,
      id_cliente: 0,
      desde: haceUnaSemana.toISOString().split('T')[0],
      hasta: hoy.toISOString().split('T')[0],
      id_usuario: user_id,
      id_vendedor: selectedIds?.users?.id,
      status: 0,
      page: 1,
    }

    try {
      let response: any = await APIs.cancelConceptsOrder(data)
      const result = await getSaleOrders(dataSaleOrders)
      // setCustomConcepts(result[0].conceptos_pers);
      setPersonalizedModal('')

      Swal.fire('Exito', response.mensaje, 'success');
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <div className={`overlay__personalized_modal ${modalStatus ? 'active' : ''}`}>
      <div className={`popup__personalized_modal ${modalStatus ? 'active' : ''}`}>
        <a href="#" className="btn-cerrar-popup__personalized_modal" onClick={closeModal}>
          <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </a>
        <p className='title__modals'>Crear personalizados</p>
        <div className='personalized_modal'>
          <div className='row__one'>
            <div className='row'>
              <div className='col-3 md-col-6 sm-col-12'>
                <label className='label__general'>Nombre del concepto</label>
                <input className={`inputs__general`} type="text" value={inpust?.descripcion} onChange={(e) => DynamicVariables.updateAnyVar(setInputs, 'descripcion', e.target.value)} placeholder='Nombre de concepto' />
              </div>
              <div className='col-2 md-col-6 sm-col-12'>
                <label className='label__general'>Código</label>
                <input className={`inputs__general`} type="text" value={inpust?.codigo} onChange={(e) => DynamicVariables.updateAnyVar(setInputs, 'codigo', e.target.value)} placeholder='Ingresa el código' />
              </div>
              <div className='col-3'>
                <Select dataSelects={units} nameSelect={'Unidades'} instanceId='units' />
              </div>
              <div className='col-2 md-col-6 sm-col-12'>
                <label className='label__general'>Cantidad</label>
                <input type='number' className={`inputs__general`} value={inpust?.cantidad} onChange={(e) => DynamicVariables.updateAnyVar(setInputs, 'cantidad', e.target.value)} placeholder='Cantidad' />
              </div>
              <div className='col-2 md-col-6 sm-col-12'>
                <label className='label__general'>Total personalizado</label>
                <input type='number' className={`inputs__general`} value={inpust?.precio_total} onChange={(e) => DynamicVariables.updateAnyVar(setInputs, 'precio_total', e.target.value)} placeholder='Precio real' />
              </div>
            </div>
            <div className='w-full gap-4 my-4 row'>
              <div className='col-3 md-col-6 sm-col-12'>
                <label className='label__general'>Observaciones Producción</label>
                <div className='warning__general'><small >Este campo es obligatorio</small></div>
                <textarea className={`textarea__general`} value={inpust?.comentarios_produccion} onChange={(e) => DynamicVariables.updateAnyVar(setInputs, 'comentarios_produccion', e.target.value)} placeholder='Observaciones Producción'></textarea>
              </div>
              <div className=' col-3 md-col-6 sm-col-12'>
                <label className='label__general'>Observaciones Facturación</label>
                <div className='warning__general'><small >Este campo es obligatorio</small></div>
                <textarea className={`inputs__general`} value={inpust?.comentarios_factura} onChange={(e) => DynamicVariables.updateAnyVar(setInputs, 'comentarios_factura', e.target.value)} placeholder='Observaciones Facturación'></textarea>
              </div>
              <div className='select__container col-6'>
                <label className='label__general'>Claves SAT</label>
                <div className={`select-btn__general`}>
                  <div className={`select-btn ${selectsSatKey ? 'active' : ''}`} onClick={openselectsSatKey}>
                    <div className='select__container_title'>
                      <p>{selectedSatKey ? satKey.find((s: { ID: number }) => s.ID === selectedSatKey.ID)?.Clave : `${selectedKey ? selectedKey : `${idItem?.clave_sat ? idItem?.clave_sat : 'Selecciona'}`}`}</p>
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
          {personalizedModal == "personalized_modal-quotation" ?
            <div className='table__personalized'>
              {customConceptView ? (
                <div className='table__numbers'>
                  <p className='text'>Total de artículos</p>
                  <div className='quantities_tables'>{customConceptView.length}</div>
                </div>
              ) : (
                <p className="text">No hay empresas que mostras</p>
              )}
              <div className='table__head'>
                <div className={`thead ${personalizedModal == 'personalized_modal-update' ? 'active' : ''}`}>
                  {personalizedModal == 'personalized_modal-update' ?
                    ''
                    :
                    <div className='th'>
                    </div>
                  }
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
                    <p>Precio total</p>
                  </div>
                </div>
              </div>
              {customConceptView ? (
                <div className='table__body'>
                  {customConceptView.map((quotation: any, index: number) => {
                    return (
                      <div className='tbody__container'>
                        <div className={`tbody ${personalizedModal == 'personalized_modal-update' ? 'active' : ''}`} key={quotation.id}>
                          {personalizedModal == 'personalized_modal-update' ?
                            ''
                            :
                            <div className='td'>
                              <div className="td">
                                <label className="custom-checkbox">
                                  <input
                                    type="checkbox"
                                    checked={customConceptView[index]?.check || false}
                                    onChange={() => addPersonalized(quotation, index)}
                                  />
                                  <span className="checkmark"></span>
                                </label>
                              </div>
                            </div>
                          }

                          <div className='td'>
                            <div className='article'>
                              <p>{quotation.codigo}-{quotation.descripcion}</p>
                            </div>
                          </div>
                          <div className='td'>
                            <div>
                              <p>{quotation.cantidad}</p>
                            </div>
                          </div>
                          <div className='td'>
                            <div>
                              <p>{quotation.name_unidad}</p>
                            </div>
                          </div>
                          <div className='td'>
                            <p>{quotation.precio_total}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text">Cargando datos...</p>
              )}
            </div>
            :
            ''
          }

          {personalizedModal == 'personalized_modal-quotation-update' ?
            <div className='table__personalized-update'>
              {customConceptView ? (
                <div className='table__numbers'>
                  <p className='text'>Total de artículos</p>
                  <div className='quantities_tables'>{customConceptView.length}</div>
                </div>
              ) : (
                <p className="text">No hay empresas que mostras</p>
              )}
              <div className='table__head'>
                <div className={`thead ${personalizedModal == 'personalized_modal-update' ? 'active' : ''}`}>
                  {personalizedModal == 'personalized_modal-update' ?
                    ''
                    :
                    <div className='th'>
                    </div>
                  }
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
                    <p>Precio total</p>
                  </div>
                </div>
              </div>
              {customConceptView ? (
                <div className='table__body'>
                  {customConceptView.map((concept: any, index: number) => {
                    return (
                      <div className='tbody__container'>
                        <div className={`tbody ${personalizedModal == 'personalized_modal-update' ? 'active' : ''}`} key={concept.id}>
                          {personalizedModal == 'personalized_modal-update' ?
                            ''
                            :
                            <div className='td'>
                              <div className="td">
                                <label className="custom-checkbox">
                                  <input
                                    type="checkbox"
                                    checked={customConceptView[index]?.check || false}
                                    onChange={() => addPersonalized(concept, index)}
                                  />
                                  <span className="checkmark"></span>
                                </label>
                              </div>
                            </div>
                          }

                          <div className='td ' style={{ cursor: 'pointer' }} title='Haz clic aquí para modificar tu concepto' onClick={() => abrirFichaModifyConcept()}>
                            <p className='article-identifier'>{concept.codigo}-{concept.descripcion}</p>
                          </div>
                          <div className='td'>
                            <p className='amount'>{concept.cantidad}</p>
                          </div>
                          <div className='td'>
                            <p>{concept.name_unidad || concept.unidad}</p>
                          </div>
                          <div className='td'>
                            <p className=''>$ {concept.precio_total / concept.cantidad}</p>
                          </div>
                          <div className='td '>
                            {concept.urgency ?
                              <div className='container__total'>
                                <p className='total-identifier'>$ {concept.precio_total}</p>
                                <p className='remove__urgency' title='urgencia'>(${concept.urgencia})</p>
                              </div>
                              :
                              <p className='total-identifier'>$ {concept.precio_total}</p>
                            }
                          </div>

                          <div className='td urgency'>
                            {concept?.urgency ?
                              <div>
                                <div className='modal-create-quotations__tooltip-text urgency-identifier' title='Quitar urgencia' onClick={() => handleUrgencyChange(index)}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-timer-off"><path d="M10 2h4" /><path d="M4.6 11a8 8 0 0 0 1.7 8.7 8 8 0 0 0 8.7 1.7" /><path d="M7.4 7.4a8 8 0 0 1 10.3 1 8 8 0 0 1 .9 10.2" /><path d="m2 2 20 20" /><path d="M12 12v-2" /></svg>
                                </div>
                              </div>
                              :
                              <div>
                                <div className='modal-create-quotations__tooltip-text urgency-true-icon ' title='Agregar urgencia' onClick={() => handleUrgencyChange(index)}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-timer"><line x1="10" x2="14" y1="2" y2="2" /><line x1="12" x2="15" y1="14" y2="11" /><circle cx="12" cy="14" r="8" /></svg>
                                </div>
                              </div>
                            }
                          </div>
                          <div className='td'>
                            <button className='btn__general-purple' onClick={() => seeVerMas(index)}>Ver Más</button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text">Cargando datos...</p>
              )}
            </div>
            :
            ''
          }

          {personalizedModal == 'personalized_modal-quotation-update-additional' ?
            <div className='table__personalized-update-additional'>
              {customConceptView ? (
                <div className='table__numbers'>
                  <p className='text'>Total de artículos</p>
                  <div className='quantities_tables'>{customConceptView.length}</div>
                </div>
              ) : (
                <p className="text">No hay empresas que mostras</p>
              )}
              <div className='table__head'>
                <div className={`thead ${personalizedModal == 'personalized_modal-update' ? 'active' : ''}`}>
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
                    <p>Precio</p>
                  </div>
                </div>
              </div>
              {customConceptView ? (
                <div className='table__body'>
                  {customConceptView.map((concept: any, index: number) => {
                    return (
                      <div className='tbody__container'>
                        <div className={`tbody ${personalizedModal == 'personalized_modal-update' ? 'active' : ''}`} key={concept.id}>
                          <div className='td ' style={{ cursor: 'pointer' }} title='Haz clic aquí para modificar tu concepto' onClick={() => abrirFichaModifyConcept()}>
                            <p className='article'>{concept.codigo}-{concept.descripcion}</p>
                          </div>
                          <div className='td'>
                            <p className='amount'>{concept.cantidad}</p>
                          </div>
                          <div className='td'>
                            <p>{concept.name_unidad || concept.unidad}</p>
                          </div>
                          <div className='td'>
                            <p className=''>$ {concept.precio_total / concept.cantidad}</p>
                          </div>
                          <div className='td '>
                            {concept.urgency ?
                              <div className='container__total'>
                                <p className='total'>$ {concept.precio_total}</p>
                                <p className='remove__urgency' title='urgencia'>(${concept.urgencia})</p>
                              </div>
                              :
                              <p className='total'>$ {concept.precio_total}</p>
                            }
                          </div>

                          <div className='td urgency'>
                            {concept?.urgency ?
                              <div>
                                <button className='modal-create-quotations__tooltip-text no-urgency' type='button' title='Quitar urgencia' onClick={() => handleUrgencyChange(index)}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-timer-off"><path d="M10 2h4" /><path d="M4.6 11a8 8 0 0 0 1.7 8.7 8 8 0 0 0 8.7 1.7" /><path d="M7.4 7.4a8 8 0 0 1 10.3 1 8 8 0 0 1 .9 10.2" /><path d="m2 2 20 20" /><path d="M12 12v-2" /></svg>
                                </button>
                              </div>
                              :
                              <div>
                                <button className='modal-create-quotations__tooltip-text yes-urgency' title='Agregar urgencia' onClick={() => handleUrgencyChange(index)} type='button'>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-timer"><line x1="10" x2="14" y1="2" y2="2" /><line x1="12" x2="15" y1="14" y2="11" /><circle cx="12" cy="14" r="8" /></svg>
                                </button>
                              </div>
                            }
                          </div>
                          <div className='td'>
                            <button className='btn__general-purple' onClick={() => seeVerMas(index)}>Ver Más</button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text">Cargando datos...</p>
              )}
            </div>
            :
            ''
          }
          {modalSalesOrder == 'sale-order__modal' ?
            <>
              {personalizedModal == "personalized_modal-sale" ?
                <div className='table__personalized'>
                  {customConceptView ? (
                    <div className='table__numbers'>
                      <p className='text'>Total de artículos</p>
                      <div className='quantities_tables'>{customConceptView.length}</div>
                    </div>
                  ) : (
                    <p className="text">No hay empresas que mostras</p>
                  )}
                  <div className='table__head'>
                    <div className={`thead ${personalizedModal == 'personalized_modal-update' ? 'active' : ''}`}>
                      {personalizedModal == 'personalized_modal-update' ?
                        ''
                        :
                        <div className='th'>
                        </div>
                      }
                      <div className='th'>
                        <p>Artículo</p>
                      </div>
                      <div className='th'>
                        <p>Cantidad</p>
                      </div>
                      <div className='th'>
                        <p>Unidad</p>
                      </div>
                      <div>
                        <p>Precio</p>
                      </div>
                      <div>
                        <p>Total Per.</p>
                      </div>
                    </div>
                  </div>
                  {customConceptView ? (
                    <div className='table__body'>
                      {customConceptView.map((concept: any, index: number) => {
                        return (
                          <div className='tbody__container'>
                            <div className={`tbody ${personalizedModal == 'personalized_modal-update' ? 'active' : ''}`} key={concept.id}>
                              {personalizedModal == 'personalized_modal-update' ?
                                ''
                                :
                                <div className='td'>
                                  <div className="td">
                                    <label className="custom-checkbox">
                                      <input
                                        type="checkbox"
                                        checked={customConceptView[index]?.check || false}
                                        onChange={() => addPersonalized(concept, index)}
                                      />
                                      <span className="checkmark"></span>
                                    </label>
                                  </div>
                                </div>
                              }

                              <div className='td ' style={{ cursor: 'pointer' }} title='Haz clic aquí para modificar tu concepto' onClick={() => abrirFichaModifyConcept()}>
                                <p className='folio-identifier'>{concept.codigo}-{concept.descripcion}</p>
                              </div>
                              <div className='td'>
                                <p className='amount-identifier'>{concept.cantidad}</p>
                              </div>
                              <div className='td'>
                                <p>{concept.name_unidad || concept.unidad}</p>
                              </div>
                              <div className='td'>
                                <p className=''>$ {concept.precio_total / concept.cantidad}</p>
                              </div>
                              <div className='td'>
                                {concept.urgency ?
                                  <div className='d-flex'>
                                    <p className='total-identifier'>$ {concept.precio_total}</p>
                                    <p className='urgency-identifier'>${parseFloat(concept.monto_urgencia).toFixed(2)}</p>
                                  </div>
                                  :
                                  <p className='total-identifier'>$ {concept.precio_total}</p>
                                }
                              </div>
                              <div className='td urgency'>
                                {concept?.urgency ?
                                  <div>
                                    <div className='urgency-false-icon' title='Quitar urgencia' onClick={() => handleUrgencySaleChange(index)}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-timer-off"><path d="M10 2h4" /><path d="M4.6 11a8 8 0 0 0 1.7 8.7 8 8 0 0 0 8.7 1.7" /><path d="M7.4 7.4a8 8 0 0 1 10.3 1 8 8 0 0 1 .9 10.2" /><path d="m2 2 20 20" /><path d="M12 12v-2" /></svg>
                                    </div>
                                  </div>
                                  :
                                  <div>
                                    <div className='urgency-true-icon' title='Agregar urgencia' onClick={() => handleUrgencySaleChange(index)}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-timer"><line x1="10" x2="14" y1="2" y2="2" /><line x1="12" x2="15" y1="14" y2="11" /><circle cx="12" cy="14" r="8" /></svg>
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
                                <div className='send-areas'>
                                  <div>
                                    <label>Area</label>
                                  </div>
                                  <select
                                    className="traditional__selector"
                                    onChange={(event) => handleAreasChange(event, index)}
                                  >
                                    {concept?.areas_produccion?.map((item: any) => (
                                      <option key={item.id} value={item.id_area}>
                                        {item.nombre_area}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div className='td'>
                                <div>
                                  <div className=''>
                                    <label>Enviar producción</label>
                                  </div>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={concept.enviar_a_produccion}
                                      onChange={() =>
                                        handleStatusChange(concept, index)
                                      }
                                    />
                                    <span className="slider"></span>
                                  </label>
                                </div>
                              </div>
                              {/* <div className='td branch'>
                                <div>
                                  <div className=''>
                                    <label>Recibido Sucursal</label>
                                  </div>
                                  <label className="switch">
                                    <input
                                      type="checkbox"

                                      checked={concept.check_recibido_sucursal}
                                      onChange={() => handleBranchChange(concept.check_recibido_sucursal, index)} disabled={concept.status == !0} />
                                    <span className="slider"></span>
                                  </label>
                                </div>
                              </div>
                              <div className='td customer'>
                                <div>
                                  <div className=''>
                                    <label>Recibido Cliente</label>
                                  </div>
                                  <label className="switch">
                                    <input
                                      type="checkbox"

                                      checked={concept.check_entregado_cliente}
                                      onChange={() => handleCustomerChange(concept.check_entregado_cliente, index)} disabled={concept.status == !0} />
                                    <span className="slider"></span>
                                  </label>
                                </div>
                              </div> */}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text">Cargando datos...</p>
                  )}
                </div>
                :
                <div className='table__personalized'>
                  {customConceptView ? (
                    <div className='table__numbers'>
                      <p className='text'>Total de artículos</p>
                      <div className='quantities_tables'>{customConceptView.length}</div>
                    </div>
                  ) : (
                    <p className="text">No hay empresas que mostras</p>
                  )}
                  <div className='table__head'>
                    <div className={`thead ${personalizedModal == 'personalized_modal-update' ? 'active' : ''}`}>
                      {personalizedModal == 'personalized_modal-update' ?
                        ''
                        :
                        <div className='th'>
                        </div>
                      }
                      <div className='th'>
                        <p>Artículo</p>
                      </div>
                      <div className='th'>
                        <p>Cantidad</p>
                      </div>
                      <div className='th'>
                        <p>Unidad</p>
                      </div>
                    </div>
                  </div>
                  {customConceptView ? (
                    <div className='table__body'>
                      {customConceptView.map((concept: any, index: number) => {
                        return (
                          <div className='tbody__container'>
                            <div className={`tbody ${personalizedModal == 'personalized_modal-update' ? 'active' : ''}`} key={concept.id}>
                              {personalizedModal == 'personalized_modal-update' ?
                                ''
                                :
                                <div className='td'>

                                  <label className="custom-checkbox">
                                    <input
                                      type="checkbox"
                                      checked={concept?.check}
                                      onChange={() => addPersonalized(concept, index)}
                                    />
                                    <span className="checkmark"></span>
                                  </label>

                                </div>
                              }

                              <div className='td ' style={{ cursor: 'pointer' }} title='Haz clic aquí para modificar tu concepto' onClick={() => abrirFichaModifyConcept()}>
                                <p className='folio-identifier'>{concept.codigo}-{concept.descripcion}</p>
                              </div>
                              <div className='td'>
                                <p className='amount-identifier'>{concept.cantidad}</p>
                              </div>
                              <div className='td'>
                                <p>{concept.name_unidad || concept.unidad}</p>
                              </div>
                              <div className='td'>
                                <p className=''>$ {concept.precio_total / concept.cantidad}</p>
                              </div>
                              <div className='td'>
                                {concept.urgency ?
                                  <div className='d-flex'>
                                    <p className='total-identifier'>$ {concept.precio_total}</p>
                                    <p className='urgency-identifier'>${parseFloat(concept.monto_urgencia).toFixed(2)}</p>
                                  </div>
                                  :
                                  <p className='total-identifier'>$ {concept.precio_total}</p>
                                }
                              </div>
                              <div className='td urgency'>
                                {concept?.urgency ?
                                  <div>
                                    <div className='urgency-false-icon' title='Quitar urgencia' onClick={() => handleUrgencySaleChange(index)}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-timer-off"><path d="M10 2h4" /><path d="M4.6 11a8 8 0 0 0 1.7 8.7 8 8 0 0 0 8.7 1.7" /><path d="M7.4 7.4a8 8 0 0 1 10.3 1 8 8 0 0 1 .9 10.2" /><path d="m2 2 20 20" /><path d="M12 12v-2" /></svg>
                                    </div>
                                  </div>
                                  :
                                  <div>
                                    <div className='urgency-true-icon' title='Agregar urgencia' onClick={() => handleUrgencySaleChange(index)}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-timer"><line x1="10" x2="14" y1="2" y2="2" /><line x1="12" x2="15" y1="14" y2="11" /><circle cx="12" cy="14" r="8" /></svg>
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
                                <div className='send-areas'>
                                  <div>
                                    <label>Area</label>
                                  </div>
                                  <select
                                    className="traditional__selector"
                                    onChange={(event) => handleAreasChange(event, index)}
                                  >
                                    {concept?.areas_produccion?.map((item: any) => (
                                      <option key={item.id} value={item.id_area}>
                                        {item.nombre_area}
                                      </option>
                                    ))}
                                  </select>



                                </div>
                              </div>
                              <div className='td'>
                                <div>
                                  <div className=''>
                                    <label>Enviar producción</label>
                                  </div>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={concept.enviar_a_produccion}
                                      onChange={() =>
                                        handleStatusChange(concept, index)
                                      }
                                    />
                                    <span className="slider"></span>
                                  </label>
                                </div>
                              </div>
                              {/* <div className='td branch'>
                                <div>
                                  <div className=''>
                                    <label>Recibido Sucursal</label>
                                  </div>
                                  <label className="switch">
                                    <input
                                      type="checkbox"

                                      checked={concept.check_recibido_sucursal}
                                      onChange={() => handleBranchChange(concept.check_recibido_sucursal, index)} disabled={concept.status == !0} />
                                    <span className="slider"></span>
                                  </label>
                                </div>
                              </div>
                              <div className='td customer'>
                                <div>
                                  <div className=''>
                                    <label>Recibido Cliente</label>
                                  </div>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={concept.check_entregado_cliente}
                                      onChange={() => handleCustomerChange(concept.check_entregado_cliente, index)} disabled={concept.status == !0} />
                                    <span className="slider"></span>
                                  </label>
                                </div>
                              </div> */}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text">Cargando datos...</p>
                  )}
                </div>
              }
            </>
            :
            ""
          }


          {modalSalesOrder == 'sale-order__modal-update' || modalSalesOrder == 'sale-order__modal_bycot' ?
            <>
              {personalizedModal == "personalized_modal-sale" ?
                <div className='table__personalized'>
                  {customConceptView ? (
                    <div className='table__numbers'>
                      <p className='text'>Total de artículos</p>
                      <div className='quantities_tables'>{customConceptView.length}</div>
                    </div>
                  ) : (
                    <p className="text">No hay empresas que mostras</p>
                  )}
                  <div className='table__head'>
                    <div className={`thead ${personalizedModal == 'personalized_modal-update' ? 'active' : ''}`}>
                      {personalizedModal == 'personalized_modal-update' ?
                        ''
                        :
                        <div className='th'>
                        </div>
                      }
                      <div className='th'>
                        <p>Artículo</p>
                      </div>
                      <div className='th'>
                        <p>Cantidad</p>
                      </div>
                      <div className='th'>
                        <p>Unidad</p>
                      </div>
                    </div>
                  </div>
                  {customConceptView ? (
                    <div className='table__body'>
                      {customConceptView.map((quotation: any, index: number) => {
                        return (
                          <div className='tbody__container'>
                            <div className={`tbody ${personalizedModal == 'personalized_modal-update' ? 'active' : ''}`} key={quotation.id}>
                              {personalizedModal == 'personalized_modal-update' ?
                                ''
                                :
                                <div className='td'>
                                  <div className="td">
                                    <label className="custom-checkbox">
                                      <input
                                        type="checkbox"
                                        checked={customConceptView[index]?.check || false}
                                        onChange={() => addPersonalized(quotation, index)}
                                      />
                                      <span className="checkmark"></span>
                                    </label>
                                  </div>
                                </div>
                              }

                              <div className='td'>
                                <div className='article'>
                                  <p>{quotation.codigo}-{quotation.descripcion}</p>
                                </div>
                              </div>
                              <div className='td'>
                                <div>
                                  <p>{quotation.cantidad}</p>
                                </div>
                              </div>
                              <div className='td'>
                                <div>
                                  <p>{quotation.name_unidad}</p>
                                </div>
                              </div>
                              <div className='td'>
                              </div>

                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text">Cargando datos...</p>
                  )}
                </div>
                :
                <div className='table__modal-sale__personalized-update'>
                  {customConceptView ? (
                    <div className='table__numbers'>
                      <p className='text'>Total de artículos</p>
                      <div className='quantities_tables'>{customConceptView.length}</div>
                    </div>
                  ) : (
                    <p className="text">No hay empresas que mostras</p>
                  )}
                  <div className='table__head'>
                    <div className={`thead ${personalizedModal == 'personalized_modal-update' ? 'active' : ''}`}>

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
                        <p>Total</p>
                      </div>
                    </div>
                  </div>
                  {customConceptView ? (
                    <div className='table__body'>
                      {customConceptView.map((concept: any, index: number) => {
                        return (
                          <div className='tbody__container'>
                            <div className={`tbody ${personalizedModal == 'personalized_modal-update' ? 'active' : ''}`} key={concept.id}>
                              <div className='td ' style={{ cursor: 'pointer' }} title='Haz clic aquí para modificar tu concepto' onClick={() => abrirFichaModifyConcept()}>
                                <p className='folio-identifier'>{concept.codigo}-{concept.descripcion}</p>
                              </div>
                              <div className='td'>
                                <p className='amount-identifier'>{concept.cantidad}</p>
                              </div>
                              <div className='td'>
                                <p>{concept.name_unidad || concept.unidad}</p>
                              </div>
                              <div className='td'>
                                <p className=''>$ {concept.precio_total / concept.cantidad}</p>
                              </div>
                              <div className='td'>
                                {concept.urgency ?
                                  <div className='d-flex'>
                                    <p className='total-identifier'>$ {concept.precio_total}</p>
                                    <p className='urgency-identifier'>${parseFloat(concept.monto_urgencia).toFixed(2)}</p>
                                  </div>
                                  :
                                  <p className='total-identifier'>$ {concept.precio_total}</p>
                                }
                              </div>
                              <div className='td'>
                                {concept.status == 0 ?
                                  <div className='cancel-icon' onClick={() => canceleStatus(concept)} title='Cancelar concepto'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ban"><circle cx="12" cy="12" r="10" /><path d="m4.9 4.9 14.2 14.2" /></svg>
                                  </div>
                                  :
                                  ""
                                }

                              </div>
                              <div className='td urgency'>
                                {concept?.urgency ?
                                  <div>
                                    <div className='urgency-false-icon' title='Quitar urgencia' onClick={() => handleUrgencySaleChange(index)}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-timer-off"><path d="M10 2h4" /><path d="M4.6 11a8 8 0 0 0 1.7 8.7 8 8 0 0 0 8.7 1.7" /><path d="M7.4 7.4a8 8 0 0 1 10.3 1 8 8 0 0 1 .9 10.2" /><path d="m2 2 20 20" /><path d="M12 12v-2" /></svg>
                                    </div>
                                  </div>
                                  :
                                  <div>
                                    <div className='urgency-true-icon' title='Agregar urgencia' onClick={() => handleUrgencySaleChange(index)}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-timer"><line x1="10" x2="14" y1="2" y2="2" /><line x1="12" x2="15" y1="14" y2="11" /><circle cx="12" cy="14" r="8" /></svg>
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
                                <div className='send-areas'>
                                  <div>
                                    <label>Area</label>
                                  </div>
                                  <select
                                    className="traditional__selector"
                                    onChange={(event) => handleAreasChange(event, index)}
                                  >
                                    {concept?.areas_produccion?.map((item: any) => (
                                      <option key={item.id} value={item.id_area}>
                                        {item.nombre_area}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div className='td'>
                                <div>
                                  <div className=''>
                                    <label>Enviar producción</label>
                                  </div>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={concept.enviar_a_produccion}
                                      disabled={concept.status == !0}
                                      onChange={() =>
                                        handleStatusChange(concept, index)
                                      }
                                    />
                                    <span className="slider"></span>
                                  </label>
                                </div>
                              </div>
                              <div className='td branch'>
                                <div>
                                  <div className=''>
                                    <label>Recibido Sucursal</label>
                                  </div>
                                  <label className="switch">
                                    <input
                                      type="checkbox"

                                      checked={concept.check_recibido_sucursal}
                                      onChange={() => handleBranchChange(concept.check_recibido_sucursal, index)} disabled={concept.status == !0} />
                                    <span className="slider"></span>
                                  </label>
                                </div>
                              </div>
                              <div className='td customer'>
                                <div>
                                  <div className=''>
                                    <label>Recibido Cliente</label>
                                  </div>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={concept.check_entregado_cliente}
                                      onChange={() => handleCustomerChange(concept.check_entregado_cliente, index)} disabled={concept.status == !0} />
                                    <span className="slider"></span>
                                  </label>
                                </div>
                              </div>

                              {concept.status == 0 ?
                                <div className='td'>
                                  {personalizedModal == 'personalized_modal-sale-update' ?
                                    <div className='td'>
                                      <button type='button' className='btn__general-purple' onClick={() => updateSaleOrderConcept(concept)}>Actualizar</button>
                                    </div>
                                    :
                                    ""
                                  }
                                </div>
                                :
                                ""
                              }

                              <div className='d-flex align-items-end'>
                                {concept.status == 0 ?
                                  <div className="td">
                                    <p className='active-identifier'>activo</p>
                                  </div>
                                  :
                                  ""
                                }
                                {concept.status == 1 ?
                                  <div className="td">
                                    <p className='cancel-identifier'>Cancelado</p>
                                  </div>
                                  :
                                  ""
                                }
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text">Cargando datos...</p>
                  )}
                </div>
              }</>
            :
            ""
          }
          {personalizedModal == "personalized_modal-billing" ?
            <div className='table__personalized'>
              {customConceptView ? (
                <div className='table__numbers'>
                  <p className='text'>Total de artículos</p>
                  <div className='quantities_tables'>{customConceptView.length}</div>
                </div>
              ) : (
                <p className="text">No hay empresas que mostras</p>
              )}
              <div className='table__head'>
                <div className={`thead ${personalizedModal == 'personalized_modal-update' ? 'active' : ''}`}>
                  {personalizedModal == 'personalized_modal-update' ?
                    ''
                    :
                    <div className='th'>
                    </div>
                  }
                  <div className='th'>
                    <p>Artículo</p>
                  </div>
                  <div className='th'>
                    <p>Cantidad</p>
                  </div>
                  <div className='th'>
                    <p>Unidad</p>
                  </div>
                </div>
              </div>
              {customConceptView ? (
                <div className='table__body'>
                  {customConceptView.map((quotation: any, index: number) => {
                    return (
                      <div className='tbody__container'>
                        <div className={`tbody ${personalizedModal == 'personalized_modal-update' ? 'active' : ''}`} key={quotation.id}>
                          {personalizedModal == 'personalized_modal-update' ?
                            ''
                            :
                            <div className='td'>
                              <div className="td">
                                <label className="custom-checkbox">
                                  <input
                                    type="checkbox"
                                    checked={customConceptView[index]?.check || false}
                                    onChange={() => addPersonalized(quotation, index)}
                                  />
                                  <span className="checkmark"></span>
                                </label>
                              </div>
                            </div>
                          }
                          <div className='td'>
                            <div className='article'>
                              <p>{quotation.codigo}-{quotation.descripcion}</p>
                            </div>
                          </div>
                          <div className='td'>
                            <div>
                              <p>{quotation.cantidad}</p>
                            </div>
                          </div>
                          <div className='td'>
                            <div>
                              <p>{quotation.name_unidad}</p>
                            </div>
                          </div>
                          <div className='td'>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text">Cargando datos...</p>
              )}
            </div>
            :
            ''
          }
          {personalizedModal == "personalized_modal-billing-update" ?
            <div className='table__personalized'>
              {customData ? (
                <div className='table__numbers'>
                  <p className='text'>Total de artículos</p>
                  <div className='quantities_tables'>{customData.length}</div>
                </div>
              ) : (
                <p className="text">No hay empresas que mostras</p>
              )}
              <div className='table__head'>
                <div className={`thead ${personalizedModal == 'personalized_modal-update' ? 'active' : ''}`}>
                  {personalizedModal == 'personalized_modal-update' ?
                    ''
                    :
                    <div className='th'>
                    </div>
                  }
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
                    <p>Precio total</p>
                  </div>
                </div>
              </div>
              {customConceptView ? (
                <div className='table__body'>
                  {customConceptView.map((quotation: any, index: number) => {
                    return (
                      <div className='tbody__container'>
                        <div className={`tbody ${personalizedModal == 'personalized_modal-update' ? 'active' : ''}`} key={quotation.id}>
                          {personalizedModal == 'personalized_modal-update' ?
                            ''
                            :
                            <div className='td'>
                              <div className="td">
                                <label className="custom-checkbox">
                                  <input
                                    type="checkbox"
                                    checked={customConceptView[index]?.check || false}
                                    onChange={() => addPersonalized(quotation, index)}
                                  />
                                  <span className="checkmark"></span>
                                </label>
                              </div>
                            </div>
                          }

                          <div className='td'>
                            <div className='article'>
                              <p>{quotation.codigo}-{quotation.descripcion}</p>
                            </div>
                          </div>
                          <div className='td'>
                            <div>
                              <p>{quotation.cantidad}</p>
                            </div>
                          </div>
                          <div className='td'>
                            <div>
                              <p>{quotation.name_unidad}</p>
                            </div>
                          </div>
                          <div className='td'>
                            <div>
                              <p>{quotation.precio_total}</p>
                            </div>
                          </div>
                          <div className='td'>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text">Cargando datos...</p>
              )}
            </div>
            :
            ''
          }
          <div className='mt-5 row__three'>
            {personalizedModal == 'personalized_modal-quotation' || personalizedModal == 'personalized_modal-sale' || personalizedModal == 'personalized_modal-billing' ?
              <div className='d-flex justify-content-between'>
                <div className='real_price'>
                  <p className='name'>Total real</p>
                  <p className='value'>{realPrice}</p>
                </div>
                <div>
                  <button type='button' className='btn__general-purple' onClick={createPersonalized}>Crear personalizado</button>
                </div>
                <div className='real_personalized'>
                  <p className='name'>Total personalizado</p>
                  <p className='value'>{inpust?.precio_total}</p>
                </div>
              </div>
              :
              <div className='d-flex justify-content-center'>
                {idItem?.id !== 0 && personalizedModal == 'personalized_modal-billing-update' ?
                  identifierBilling ?
                    ''
                    :
                    <div>
                      <button className='btn__general-purple' type='button' onClick={updatePersonalized}>Actulizar personalizado</button>
                    </div>
                  :
                  <div>
                    <button className='btn__general-purple' type='button' onClick={updatePersonalized}>Actulizar personalizado</button>
                  </div>
                }
                <div className='real_price'>
                  <p>{realPrice}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
      <SeeCamposPlantillas />
    </div>
  )
}

export default Personalized
