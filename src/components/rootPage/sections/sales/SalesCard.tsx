import React, { useEffect, useState, useRef } from 'react';
import { useStore } from 'zustand';
import { storeModals } from '../../../../zustand/Modals';
import { storeSaleCard } from '../../../../zustand/SaleCard';
import { storeSaleOrder } from '../../../../zustand/SalesOrder';
import { v4 as uuidv4 } from 'uuid';
import { UserGroupsRequests } from '../../../../fuctions/UserGroups';
import useUserStore from '../../../../zustand/General';
import './styles/SalesCard.css';
import Prices from './sales-sard_modals/Prices';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


import ToArrive from './sales-sard_modals/ToArrive';
import Indications from './sales-sard_modals/Stocks';
import DeliveryTimes from './sales-sard_modals/DeliveryTimes';
import Components from './sales-sard_modals/Components';
import APIs from '../../../../services/services/APIs';
import { toast } from 'sonner'
import { storePersonalized } from '../../../../zustand/Personalized';
import { storeQuotation } from '../../../../zustand/Quotation';
import Swal from 'sweetalert2';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import { storeArticles } from '../../../../zustand/Articles';
import { storeArticleView } from '../../../../zustand/ArticleView';
import { storeDv } from '../../../../zustand/Dynamic_variables';




const SalesCard: React.FC<any> = ({ idA, dataArticle, indexUpdate }: any) => {
  const userState = useUserStore(state => state.user);
  const user_id = userState.id;

  const { modal }: any = useStore(storeModals)


  const { modalSalesOrder }: any = useStore(storeSaleOrder)

  const setModalSalesCard = storeSaleCard(state => state.setModalSalesCard);
  const setChangeLength = storeSaleOrder((state) => state.setChangeLength);
  const { changeLength }: any = useStore(storeSaleOrder);


  const [data, setData] = useState<any>({
    obs_produccion: '',
    obs_factura: '',
  })


  const setNormalConcepts = storePersonalized(state => state.setNormalConcepts)

  const setSaleOrdersConcepts = storeSaleOrder(state => state.setSaleOrdersConcepts)
  const { saleOrdersConcepts }: any = useStore(storeSaleOrder);


  const setQuotes = storeQuotation(state => state.setQuotes)
  const { quotes }: any = useStore(storeQuotation);


  const permisosxVistaheader = storeDv((state) => state.permisosxvistaheader);


  const { modalArticleView }: any = useStore(storeArticleView)
  const { normalConcepts, conceptView, customConceptView, customConcepts, normalConceptsView }: any = useStore(storePersonalized);

  const setArticle = storeSaleCard(state => state.setArticle);

  const setIdentifier = storeQuotation(state => state.setIdentifier);
  const { identifier }: any = useStore(storeQuotation);


  const setModalSub = storeModals(state => state.setModalSub)
  const setStatusArticle = storeSaleCard(state => state.setStatusArticle);



  const setCombinacionesSeleccionadas = storeSaleCard(state => state.setCombinacionesSeleccionadas);
  const combinacionesSeleccionadas = storeSaleCard(state => state.combinacionesSeleccionadas);


  const { IdArticle, modalSalesCard, article, statusArticle }: any = useStore(storeSaleCard);
  const { getUserGroups }: any = UserGroupsRequests();
  const [units, setUnits] = useState<any[]>([]);
  const [usersGroups, setUsersGroups] = useState<any[]>([]);
  const [amount, setAmount] = useState<number>(0);


  const [billingComment, setBillingComment] = useState<any>('')
  const [productionComments, setproductionComments] = useState<string>('')
  const [opciones, setOpciones] = useState<any>(null);

  const setModalLoading = storeArticles((state: any) => state.setModalLoading);


  const fetch = async () => {
    const data = {
      id: IdArticle,
      activos: true,
      nombre: '',
      codigo: '',
      familia: 0,
      proveedor: 0,
      materia_prima: 0,
      get_sucursales: false,
      get_imagenes: true,
      // get_adicional: true,
      get_proveedores: false,
      get_max_mins: true,
      get_precios: true,
      get_combinaciones: true,
      get_plantilla_data: true,
      get_areas_produccion: true,
      get_tiempos_entrega: true,
      get_componentes: true,
      get_stock: true,
      get_web: true,
      for_ventas: true,
      get_unidades: true,
      id_usuario: user_id,
      id_grupo_us: selectedUserGroup

    };

    try {
      // Obtener artículos
      setModalLoading(true)
      return await APIs.getArticles(data)
        .then(async (response: any) => {
          if (!response || response.length === 0) {
            throw new Error('No se encontraron artículos');
          }

          const art = response[0];



          let plantillaData = art.plantilla_data || [];
          plantillaData = plantillaData.map((item: any) => ({
            ...item,
            id_plantillas_art_campos: item.id,
          }));

          if (modalSalesCard === 'sale-card-quotation') {
            plantillaData = dataArticle.campos_plantilla;
          }

          setArticle({ ...art, plantilla_data: plantillaData });
          setStatusArticle(true);
          setModalLoading(false);

          // if (art.vender_sin_stock) Swal.fire('Notificación', 'Este articulo se puede vender sin stock disponible', 'success');
          if (art.bajo_pedido) await Swal.fire('Notificación', 'Este articulo es BAJO PEDIDO, la orden de venta creada se pondrá en status PENDIENTE, hasta la llegada del material faltante', 'warning');
          if (art.desabasto) await Swal.fire('Notificación', 'Hay desabasto de este articulo...', 'warning');
          if (art.precio_libre) await Swal.fire('Notificación', 'El precio arrojado por este articulo es una SUGERENCIA DE VENTA, realiza la confirmación con tu superior de este precio, verifica tu lista de precios o consulta con cotizador.', 'success');
          if (art.ultimas_piezas) await Swal.fire('Notificación', 'El stock disponible son las ULTIMAS PIEZAS...', 'warning');
          if (art.consultar_te) await Swal.fire('Notificación', 'Consulta el Tiempo de Entrega de este articulo con el area de producción correspondiente', 'warning');
          if (art.consultar_cotizador) await Swal.fire('Notificación', 'Este articulo debe consultar el precio con cotizador', 'warning');
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        })
        .finally(() => {
          setStatusArticle(true);
          setModalLoading(false);
        });


    } catch (error) {
      console.error('Error fetching data:', error);
      setModalLoading(false)

    } finally {
      // Cambia el estado después de completar todo el proceso
      setStatusArticle(true);
      setModalLoading(false)

    }
  };

  useEffect(() => {


  }, [opciones])





  // useEffect(() => {
  //   if(modalSalesCard === 'sale-card-quotation') {
  //     setModalLoading(true)
  //     fetch()
  //   }
  // },[modalSalesCard])


  const fetchUser = async () => {

    await APIs.getUserGroups(user_id).then(async (resultUsers: any) => {
      await setUsersGroups(resultUsers);
      setSelectedUserGroup(resultUsers[0].id);
    }).catch((error) => {
      console.error("Error obteniendo los grupos del usuario:", error);
    });
  }


  const [prices, setPrices] = useState<any>(0)
  const [descuento, setDescuento] = useState<number>(0)
  const [pricesFranquicia, setPricesFranquicia] = useState<any>(0)
  const [pricesFranquiciaAdicional, setPricesFranquiciaAdicional] = useState<any>(0)

  useEffect(() => {
    if (modalSalesCard === 'sale-card') {
      fetch();
      setData({
        obs_produccion: '',
        obs_factura: '',
      })
      setPrices(0)
      setAdicional(null)
      setDescuento(0)
      setPricesFranquicia(0)
      setPricesFranquiciaAdicional(0)
      setAmount(0)
      setBillingComment('')
      setproductionComments('')

      setCombinacionesSeleccionadas([])
    }

    if (modalSalesCard === 'sale-card-quotation') {
      fetch();
      setPrices(dataArticle?.precio_total)
      setAdicional(null)
      setDescuento(0)
      setSelectedUnit({ id: dataArticle?.id_unidad, id_unidad: dataArticle?.id_unidad })
      setPricesFranquicia(0)
      setPricesFranquiciaAdicional(0)
      setAmount(dataArticle?.cantidad)
      setData({
        obs_produccion: dataArticle.obs_produccion,
        obs_factura: dataArticle.obs_factura,
      });
      setBillingComment('')
      setproductionComments('')
      setCombinacionesSeleccionadas([])
      setSelectedUnit(article?.unidades[0])


    }


  }, [idA]);

  useEffect(() => {
    fetchUser()
  }, [idA])



  console.log('data', data)




  useEffect(() => {
    if (article) {
      setUnits(article.unidades || []);
      setSelectedUnit(article?.unidades[0])
      setOpciones(article.opciones_de_variacion2 || []);
    }

  }, [article]);
  const [fyv, setfyv] = useState<boolean>(false)


  const handleCreateFamilies = () => {
    // Implementa la lógica de creación de familias
  };

  const [selectUsersGroups, setSelectUsersGroups] = useState<boolean>(false);
  const [selectedUserGroup, setSelectedUserGroup] = useState<any>(null);

  const openSelectUsersGroups = () => {
    setSelectUsersGroups(!selectUsersGroups);
  };

  const handleUsersGroupsChange = (item: any) => {
    setSelectedUserGroup(item.id);
    setSelectUsersGroups(false);
  };

  const [selectUnits, setSelectUnits] = useState<boolean>(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [Adicional, setAdicional] = useState<any>(null);
  // const [AdicionalFranquicia, setAdicionalFranquicia] = useState<any>(null);

  const openSelectUnits = () => {
    setSelectUnits(!selectUnits);
  };

  const handleUnitsChange = (item: any) => {
    setSelectedUnit(item);
    setSelectUnits(false);
  };

  const handleTemplatesChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    let value: any = e.target.value
    if (article.plantilla_data[index].tipo == 'numero') {
      value = e.target.value;
    }
    const updatedArticle = { ...article };
    updatedArticle.plantilla_data[index].valor = value;

    setArticle(updatedArticle);
    if (article.plantilla_data[index].tipo == 'numero') {
      getPrices()
    }

  };




  const controllerRef = useRef<AbortController | null>(null);
  const [outOfRange, setOutOfRange] = useState<any>(false)

  const [loadingPrice, setLoadingPrice] = useState<boolean>(false)

  const get = async () => {
    setLoadingPrice(true)

    if (controllerRef.current) {
      controllerRef.current.abort();
    }


    controllerRef.current = new AbortController();

    const dataArticle = {
      id_articulo: article.id,
      id_grupo_us: selectedUserGroup,
      id_unidad: selectedUnit.id_unidad,
      id_usuario: user_id,
      fyv: fyv,
      cantidad: amount,
      campos: article.plantilla_data.filter((x: any) => x.tipo == 'numero'),
      camposTxTVisual: article.plantilla_data.filter((x: any) => x.tipo == 'txtvisual'),
    };


    try {

      // const result: any = await APIs.getTotalPrice(dataArticle)
      const result: any = await APIs.getTotalPriceWSignal(dataArticle, {
        signal: controllerRef.current.signal, // Pasa la señal aquí
      });


      console.log('resultresultresultresultresultresultresultresultresultresultresultresultresultresult', article)

      if (result.error2) {
        setOutOfRange(true)
        // // Crear una copia de `article` y modificar `precio_libre`
        setPrices(0)
        // Muestra la alerta después de actualizar el estado
        // await Swal.fire(
        //   "Notificación",
        //   "Error",
        //   "error"
        // );
      } else {
        setOutOfRange(false)
        if (result.error == true) {
          toast.warning(result.mensaje)
          setData({
            id_pers: 0,
            front: true,
            id_articulo: article.id,
            id_familia: article.id_familia,
            produccion_interna: false,
            id_area_produccion: article.areas_produccion[0]?.id_area,
            enviar_a_produccion: false,
            personalized: false,
            check: false,
            status: 0,
            descripcion: article.descripcion,
            codigo: article.codigo,
            unidad: selectedUnit.id_unidad,
            name_unidad: selectedUnit.nombre,
            cantidad: amount,
            precio_total: prices,
            obs_produccion: data.obs_produccion,
            obs_factura: data.obs_factura,
            monto_urgencia: 0,
            urgencia_monto: 0,
            descuento: result.descuento_aplicado,
            precio_unitario: prices / amount,
            total_franquicia: 0,
            clave_sat: article.clave_sat,
            /////////////////////Para Orden de Requicicion //////////////////////////

            urgencia: false,
            areas_produccion: article.areas_produccion,

            /////////////////////Para Orden de compra //////////////////////////
            id_ov: 0,
            id_orden_produccion: 0,
            status_produccion: 0,
            cobrado: 0,
            id_unidad: selectedUnit.id_unidad,
            campos_plantilla: article.plantilla_data.map((x: any) => ({
              considerado_total: x.considerado_total,
              nombre_campo_plantilla: x.nombre,
              tipo_campo_plantilla: x.tipo,
              valor: x.tipo == 'texto' ? x.valor.toString() : x.valor
              // valor: x.valor.toString()
            }))

          })
          return
        }

        if (result.txtvisual_campos.length > 0) {
          article.plantilla_data.forEach((c: any) => {
            let buscar_in_result = result.txtvisual_campos.filter(
              (x: any) => x.id_plantillas_art_campos == c.id
            );

            if (buscar_in_result.length > 0) {
              let valor = buscar_in_result[0].valor;
              c.valor = valor; // Actualiza el valor en el objeto clonado
            }
          });
        }




        if (result.error == false) {
          setPrices(result.mensaje)
          setDescuento(result.descuento_aplicado)
          setAdicional(result.adicional)
          let lista_precios_franquicia = 0
          let precio_franq_tmp = 0

          if (article?.precios_franquicia != null && article?.precios_franquicia.length > 0) {

            lista_precios_franquicia = article?.precios_franquicia[0].id_grupos_us
            const dataArticleFranquicia = {
              id_articulo: article.id,
              id_grupo_us: lista_precios_franquicia,
              id_unidad: selectedUnit.id_unidad,
              id_usuario: user_id,
              cantidad: amount,
              fyv: fyv,
              campos: article.plantilla_data.filter((x: any) => x.tipo == 'numero'),
              camposTxTVisual: article.plantilla_data.filter((x: any) => x.tipo == 'txtvisual'),
              franquicia: true
            };

            // const resultFranquicia: any = await APIs.getTotalPrice(dataArticleFranquicia);
            const resultFranquicia: any = await APIs.getTotalPriceWSignal(dataArticleFranquicia, {
              signal: controllerRef.current.signal, // Pasa la señal aquí
            });
            if (!resultFranquicia.error) {
              precio_franq_tmp = resultFranquicia.mensaje
              // precio_franq_adi_tmp = resultFranquicia?.adicional?.total

              setPricesFranquicia(resultFranquicia.mensaje)
              setPricesFranquiciaAdicional(resultFranquicia?.adicional?.total)

              // setAdicionalFranquicia(resultFranquicia.adicional)
            }
          } else {

          }
          return setData({
            id_pers: 0,
            front: true,
            id_articulo: article.id,
            id_familia: article.id_familia,
            produccion_interna: false,
            id_area_produccion: article.areas_produccion[0]?.id_area,
            enviar_a_produccion: false,
            personalized: false,
            check: false,
            status: 0,
            descripcion: article.descripcion,
            codigo: article.codigo,
            unidad: selectedUnit.id_unidad,
            name_unidad: selectedUnit.nombre,
            cantidad: amount,
            precio_total: result.mensaje,
            obs_produccion: data.obs_produccion,
            obs_factura: data.obs_factura,
            monto_urgencia: 0,
            urgencia_monto: 0,
            descuento: result.descuento_aplicado,
            precio_unitario: result.mensaje / amount,
            total_franquicia: precio_franq_tmp,
            clave_sat: article.clave_sat,
            /////////////////////Para Orden de Requicicion //////////////////////////

            urgencia: false,
            areas_produccion: article.areas_produccion,

            /////////////////////Para Orden de compra //////////////////////////
            id_ov: 0,
            id_orden_produccion: 0,
            status_produccion: 0,
            cobrado: 0,
            id_unidad: selectedUnit.id_unidad,
            campos_plantilla: article.plantilla_data.map((x: any) => ({
              nombre_campo_plantilla: x.nombre,
              tipo_campo_plantilla: x.tipo,
              considerado_total: x.considerado_total,
              valor: x.tipo == 'texto' ? x.valor.toString() : x.valor
              // valor: x.valor.toString()
            }))

          })
        }


      }




    } catch (error) {
      console.error("Error al obtener el precio total:", error);
    }
    finally {
      setLoadingPrice(false)
    }
  };

  const getPrices = async () => {
    if (amount > 0) {
      let numbrs = article.plantilla_data.filter((x: any) => x.tipo == 'numero')
      if (numbrs.length > 0) {
        article.plantilla_data.forEach(async (x: any) => {
          if (x.valor > 0 && x.tipo == 'numero') {
            await get();
          }
        });
      } else {
        await get()
      }

    }

  };

  useEffect(() => {
    getPrices()
  }, [amount, fyv])
  useEffect(() => {
    setData((prev: any) => ({
      ...prev,
      precio_unitario: prices / prev.cantidad
    }));
  }, [prices]);
  const [warningContact, setWarningContact] = useState<boolean>(false)
  const styleWarningContact = {
    opacity: warningContact === true ? '1' : '',
    height: warningContact === true ? '23px' : ''
  }


  const handleAmountChange = (e: any) => {
    let value = e.target.value;

    if (!isNaN(value) && article.multiplos_de && value % article.multiplos_de === 0) {
      setAmount(value);
      setWarningContact(false);
    } else {
      setWarningContact(true);
      setAmount(value);
    }
  };


  const setCustomConcepts = storePersonalized(state => state.setCustomConcepts)


  const addQua = () => {

    if (Adicional != null) { //SI ADICIONAL TIENE ALGO SE DEBE CREAR EL PERSONALIZADO PARA ENVIARLO A COT/OV
      //-------------------------------SIMULAR EL INGRESO DIRECTO A NORMALCONCEPTS
      Swal.fire({
        title: "Este concepto generará un personalizado ya que contiene un articulo adicional",
        text: "Este concepto no se puede deshacer.",
        showCancelButton: true,
        icon: 'info',
        confirmButtonText: "Aceptar",
        denyButtonText: `Cancelar`
      }).then(async (result) => {
        if (result.isConfirmed) {
          const concepto_principal = { ...data };
          const concepto_adicional = { ...Adicional };

          concepto_principal.id_identifier = identifier + 1;
          concepto_principal.precio_total -= concepto_adicional.total
          concepto_principal.precio_unitario -= (concepto_adicional.total / concepto_adicional.cantidad)
          concepto_principal.descuento -= concepto_adicional.descuento
          concepto_principal.total_franquicia = pricesFranquiciaAdicional != null && !Number.isNaN(pricesFranquiciaAdicional) ? concepto_principal.total_franquicia - pricesFranquiciaAdicional : concepto_principal.total_franquicia

          concepto_adicional.id_identifier = concepto_principal.id_identifier + 1;
          concepto_adicional.check = false
          concepto_adicional.id = null
          concepto_adicional.id_articulo = concepto_adicional.id_articulo_adicional
          concepto_adicional.id_unidad = concepto_adicional.unidad
          concepto_adicional.unidad = concepto_adicional.nombre_unidad
          concepto_adicional.precio_total = concepto_adicional.total
          concepto_adicional.precio_unitario = concepto_adicional.total / concepto_adicional.cantidad
          concepto_adicional.total_franquicia = pricesFranquiciaAdicional
          concepto_adicional.campos_plantilla = []


          //-------------------------------SIMULA LA CREACIÓN DEL PERSONALIZADO
          const data_pers = {
            descripcion: article.descripcion,
            personalized: true,
            codigo: article.codigo,
            cantidad: amount,
            unidad: selectedUnit.id_unidad,
            name_unidad: selectedUnit.nombre,
            clave_sat: parseFloat(article.clave_sat),
            codigo_unidad_sat: 0,
            precio_total: prices,
            total_franquicia: pricesFranquicia,
            con_adicional: true,
            comentarios_produccion: data.obs_produccion,
            comentarios_factura: data.obs_factura,
            conceptos: [concepto_principal, concepto_adicional],

          }

          //----------------------------------------------------REVISAR ESTOS SETS, ALGO HACE FALTA QUE TIENE UN COMPORTAMIENTO EXTRAÑO
          setQuotes({ personalized_concepts: [...quotes.personalized_concepts, data_pers], normal_concepts: quotes?.normal_concepts })
          localStorage.setItem('cotizacion-pers', JSON.stringify([...quotes.personalized_concepts, data_pers]));
        }
      });
    } else { //SI NO TIENE ADICIONAL PASA COMO CONCEPTO NORMAL

      setQuotes({ normal_concepts: [...quotes?.normal_concepts, data], personalized_concepts: quotes.personalized_concepts })
      localStorage.setItem('cotizacion', JSON.stringify([...quotes?.normal_concepts, data]));

    }

    // localStorage.setItem('typeLocalStogare', normalConcepts)
    toast.success('Artículo agregado')
  };

  const addSaleOrder = () => {

    if (Adicional != null) { //SI ADICIONAL TIENE ALGO SE DEBE CREAR EL PERSONALIZADO PARA ENVIARLO A COT/OV
      //-------------------------------SIMULAR EL INGRESO DIRECTO A NORMALCONCEPTS
      Swal.fire({
        title: "Este concepto generará un personalizado ya que contiene un articulo adicional",
        text: "Este concepto no se puede deshacer.",
        showCancelButton: true,
        icon: 'info',
        confirmButtonText: "Aceptar",
        denyButtonText: `Cancelar`
      }).then(async (result) => {
        if (result.isConfirmed) {
          const concepto_principal = { ...data };
          const concepto_adicional = { ...Adicional };

          concepto_principal.id_identifier = identifier + 1;
          concepto_principal.check = true
          concepto_principal.precio_total -= concepto_adicional.total
          concepto_principal.precio_unitario -= (concepto_adicional.total / concepto_adicional.cantidad)
          concepto_principal.descuento -= concepto_adicional.descuento
          concepto_principal.total_franquicia = pricesFranquiciaAdicional != null && !Number.isNaN(pricesFranquiciaAdicional) ? concepto_principal.total_franquicia - pricesFranquiciaAdicional : concepto_principal.total_franquicia
          setIdentifier(identifier + 1);
          concepto_adicional.id_identifier = concepto_principal.id_identifier + 1;
          concepto_adicional.check = true
          concepto_adicional.id = null
          concepto_adicional.id_articulo = concepto_adicional.id_articulo_adicional
          concepto_adicional.id_unidad = concepto_adicional.unidad
          concepto_adicional.unidad = concepto_adicional.nombre_unidad
          concepto_adicional.precio_total = concepto_adicional.total
          concepto_adicional.precio_unitario = concepto_adicional.total / concepto_adicional.cantidad
          concepto_adicional.total_franquicia = pricesFranquiciaAdicional
          concepto_adicional.campos_plantilla = []

          setIdentifier(identifier + 1);
          //-------------------------------SIMULA LA CREACIÓN DEL PERSONALIZADO
          const data_pers = {
            descripcion: article.descripcion,
            personalized: true,
            codigo: article.codigo,
            cantidad: amount,
            unidad: selectedUnit.id_unidad,
            name_unidad: selectedUnit.nombre,
            clave_sat: parseFloat(article.clave_sat),
            codigo_unidad_sat: 0,
            precio_total: prices,
            total_franquicia: pricesFranquicia,
            con_adicional: true,
            comentarios_produccion: data.obs_produccion,
            comentarios_factura: data.obs_factura,
            conceptos: [concepto_principal, concepto_adicional],

          }
          //----------------------------------------------------REVISAR ESTOS SETS, ALGO HACE FALTA QUE TIENE UN COMPORTAMIENTO EXTRAÑO
          setSaleOrdersConcepts({ personalized_concepts: [...saleOrdersConcepts.personalized_concepts, data], normal_concepts: saleOrdersConcepts?.normal_concepts })
          localStorage.setItem('sale-order-pers', JSON.stringify([...saleOrdersConcepts.personalized_concepts, data_pers]));
          setPrices(0)
          setDescuento(0)
          setPricesFranquicia(0)
          setPricesFranquiciaAdicional(0)
        }
      });

    } else { //SI NO TIENE ADICIONAL PASA COMO CONCEPTO NORMAL
      setSaleOrdersConcepts({ normal_concepts: [...saleOrdersConcepts.normal_concepts, data], personalized_concepts: saleOrdersConcepts.personalized_concepts })
      localStorage.setItem('sale-order', JSON.stringify([...saleOrdersConcepts.normal_concepts, data]));
    }
    toast.success('Artículo agregado')
    setChangeLength(!changeLength)

  }







  const [activeIndex, setActiveIndex] = useState(null);

  // Función para abrir el modal de opciones
  const toggleModal = (index: any) => {
    setActiveIndex(activeIndex === index ? null : index); // Alterna la visibilidad
  };

  useEffect(() => {

  }, [data])




  const modalOpen = () => {
    setModalSalesCard('')
    setStatusArticle(false)
  }

  const handleSelect = (combinacionIndex: number, optionId: number) => {
    setOpciones((prevOpciones: any) => {
      const nuevasOpciones = prevOpciones.map((grupo: any, i: number) =>
        i === combinacionIndex
          ? {
            ...grupo,
            opciones: grupo.opciones.map((option: any) => ({
              ...option,
              selected: option.id === optionId
            })),
            OpcionSelected: grupo.opciones.find((option: any) => option.id === optionId)?.nombre || ""
          }
          : grupo
      );

      // Aquí sí puedes usar el nuevo estado para actualizar la otra variable
      setCombinacionesSeleccionadas([...nuevasOpciones]);

      return nuevasOpciones;
    });
    setActiveIndex(null); // Alterna la visibilidad
    if (opciones.length == 1) {
      console.log(`Comparando con ${optionId}`);

      const opcion = opciones[combinacionIndex]?.opciones.find((opt: any) => opt.id === optionId);
      console.log('------------------------------', opcion);

      fetch2([opcion?.id])
    }
  };

  useEffect(() => {
    if (opciones != undefined && opciones.length > 0) {
      setCombinacionesSeleccionadas([...opciones])
    }

  }, [opciones])

  const BuscarArticuloPorCombinacion = () => {
    // Obtener todas las opciones seleccionadas
    const selectedIds = opciones.flatMap((grupo: any) =>
      grupo.opciones.filter((option: any) => option.selected).map((option: any) => option.id)
    );

    // Verificar si hay alguna combinación donde todos los selected sean false
    const hasInvalidCombination = opciones.some((grupo: any) =>
      grupo.opciones.every((option: any) => !option.selected)
    );

    if (hasInvalidCombination) {
      Swal.fire('Notificacion', 'Es necesario seleccionar una opción de cada combinación', 'info')
      return;
    }


    fetch2(selectedIds)
  }



  const fetch2 = async (selectedIds: any[]) => {
    const data = {
      id: 0,
      activos: true,
      nombre: '',
      codigo: '',
      familia: 0,
      proveedor: 0,
      materia_prima: 0,
      get_sucursales: false,
      get_imagenes: true,
      // get_adicional: true,
      get_proveedores: false,
      get_max_mins: true,
      get_precios: true,
      get_combinaciones: true,
      get_plantilla_data: true,
      get_areas_produccion: true,
      get_tiempos_entrega: true,
      get_componentes: true,
      get_stock: true,
      get_web: true,
      for_ventas: true,
      get_unidades: true,
      id_usuario: user_id,
      por_combinacion: true,
      opciones: selectedIds,
      id_articulo_variacion: article.id
    };

    try {
      // Obtener artículos
      setModalLoading(true)

      const response: any = await APIs.getArticles(data);
      if (response && response.length > 0) {
        const plantilla_data = response[0].plantilla_data || []; // Inicializar como un arreglo vacío
        const id_plantillas_art_campos = [];

        for (let i = 0; i < plantilla_data.length; i++) {
          const id = plantilla_data[i].id;
          id_plantillas_art_campos.push(id);
        }

        // Asegúrate de que plantilla_data siga siendo un arreglo
        response[0].plantilla_data = plantilla_data.map((item: any) => ({
          ...item,
          id_plantillas_art_campos: item.id,
        }));

        setArticle(response[0]);
        console.log('---------------------------------------', combinacionesSeleccionadas);

        if (combinacionesSeleccionadas.length > 0) {
          setOpciones([...combinacionesSeleccionadas])
        } else {
          setOpciones(response[0].opciones_de_variacion2)
        }
        setModalLoading(false)

      }

      const resultUsers = await getUserGroups(user_id);
      if (resultUsers) {

        setUsersGroups(resultUsers);
        setSelectedUserGroup(resultUsers[0].id);
      }
      setPrices(0)

      setAmount(0)


    } catch (error) {
      console.error('Error fetching data:', error);
      setModalLoading(false)

    } finally {
      // Cambia el estado después de completar todo el proceso
      setStatusArticle(true);
      setModalLoading(false)


    }
  };



  const updateConcept = () => {
    let deleteConcept = normalConcepts.filter((_: any, index: number) => index !== indexUpdate)
    setNormalConcepts([...deleteConcept, data])
    localStorage.setItem('sale-order', JSON.stringify([...deleteConcept, data]));

    setModalSalesCard('')

  }
  const checkPermission = (elemento: string) => {
    return permisosxVistaheader.some((x: any) => x.titulo == elemento)
  }

  return (
    <div className={`overlay__sale-card ${modalSalesCard === 'sale-card' || modalSalesCard === 'sale-card-quotation' ? 'active' : ''}`}>
      {/* <Toaster expand={true} position="top-right" richColors /> */}
      <div className={`popup__sale-card ${modalSalesCard === 'sale-card' || modalSalesCard === 'sale-card-quotation' ? 'active' : ''}`}>
        <div className='header__modal'>
          <a href="#" className="btn-cerrar-popup__sale-card" onClick={modalOpen}>
            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512">
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </a>
          <p className='title__modals'>Ficha</p>
        </div>
        <div className='conatiner__create_sale-card' onSubmit={handleCreateFamilies}>
          <div className='row__two'>
            <div className='card__images_container'>
              {statusArticle !== false ?
                <div className='images__card-sale__container'>
                  <Swiper cssMode={true} navigation={true} pagination={true} mousewheel={true} keyboard={true} modules={[Navigation, Pagination, Mousewheel, Keyboard]} className="mySwiper">
                    {article?.imagenes.map((image: any) => (
                      <SwiperSlide>
                        <div className='images__container'>
                          <div className='images' style={{ backgroundImage: `url(${image?.img_base64})` }}>

                          </div>
                          <div className='buttons-sale-card'>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                :
                <div className='images-pulse-card'></div>
              }
              {statusArticle !== false ?
                <div className='row__one'>
                  <div className='description'>
                    <p>{article?.descripcion}</p>
                  </div>
                  <div className='code'>
                    <p>Codigo: {article?.codigo}</p>
                  </div>
                </div>
                :
                <div className="card-sale__pulse__code">
                  <div className="animate-pulse">
                    <div className="row__p-one">
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                </div>
              }
              {statusArticle !== false ?
                <div className='row__two'>
                  <div className='btn__sale__card-tooltip-container'>
                    <button className='btn__general-purple' type='button' onClick={() => setModalSub('prices_modal')}>
                      <svg className="icon icon-tabler icons-tabler-outline icon-tabler-premium-rights" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"  ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M13.867 9.75c-.246 -.48 -.708 -.769 -1.2 -.75h-1.334c-.736 0 -1.333 .67 -1.333 1.5c0 .827 .597 1.499 1.333 1.499h1.334c.736 0 1.333 .671 1.333 1.5c0 .828 -.597 1.499 -1.333 1.499h-1.334c-.492 .019 -.954 -.27 -1.2 -.75" /><path d="M12 7v2" /><path d="M12 15v2" /></svg>
                    </button>
                    <span className="sale__card-tooltip-text">Precios</span>
                  </div>
                  <div className='btn__sale__card-tooltip-container'>
                    <button className='btn__general-purple' type='button' onClick={() => setModalSub('stock_modal')}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-stack-2"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 4l-8 4l8 4l8 -4l-8 -4" /><path d="M4 12l8 4l8 -4" /><path d="M4 16l8 4l8 -4" /></svg>
                    </button>
                    <span className="sale__card-tooltip-text">Stock</span>
                  </div>
                  <div className='btn__sale__card-tooltip-container'>
                    <button className='btn__general-purple' type='button' onClick={() => setModalSub('to-arrive_modal')}>
                      <svg className="icon icon-tabler icons-tabler-outline icon-tabler-truck-delivery" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"  ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" /><path d="M3 9l4 0" /></svg>
                    </button>
                    <span className="sale__card-tooltip-text">Indicaciones</span>
                  </div>
                  <div className='btn__sale__card-tooltip-container'>
                    <button className='btn__general-purple' type='button' onClick={() => setModalSub('delivery-time_modal')}>
                      <svg className="icon icon-tabler icons-tabler-outline icon-tabler-clock-hour-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"  ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 7v5" /><path d="M12 12l2 -3" /></svg>
                    </button>
                    <span className="sale__card-tooltip-text">Tiempos de Entrega</span>
                  </div>
                  {/* <div className='btn__sale__card-tooltip-container'>
                    <button className='btn__general-purple' type='button' onClick={() => setModalSub('components_modal')}>
                      <svg className="icon icon-tabler icons-tabler-outline icon-tabler-components" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"  ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12l3 3l3 -3l-3 -3z" /><path d="M15 12l3 3l3 -3l-3 -3z" /><path d="M9 6l3 3l3 -3l-3 -3z" /><path d="M9 18l3 3l3 -3l-3 -3z" /></svg>
                    </button>
                    <span className="sale__card-tooltip-text">Componentes</span>
                  </div> */}
                </div>
                :
                ''
              }
              {statusArticle !== false ?
                ''
                :
                <div className="card-sale__pulse__labels">
                  <div className="animate-pulse">
                    <div className="rounded-full"></div>
                    <div className="row__p-one">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    <div className="row__p-two">
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                </div>
              }
            </div>


            <div className='row__one'>
              {statusArticle !== false ?
                <div>
                  <br />
                  {opciones !== undefined ?
                    <div className="combinaciones">
                      {opciones?.map((x: any, index: any) => (
                        <div className='combinaciones__container' key={index}>
                          <div className='container__combination' style={{ color: x.OpcionSelected && x.OpcionSelected !== "" ? "#ffffff" : "#d6e5ff" }}
                            onClick={() => toggleModal(index)}>
                            {x.OpcionSelected && x.OpcionSelected !== "" ? x.OpcionSelected : x.combinacion}
                          </div>
                          {activeIndex === index && (
                            <div className="combination_options" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                              {x.opciones.map((option: any) => (
                                <div key={option.id} onClick={() => handleSelect(index, option.id)}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    cursor: "pointer",
                                    backgroundColor: option.selected ? "#4CAF50" : "transparent",
                                    color: option.selected ? "white" : "black",
                                    padding: "5px",
                                    borderRadius: "5px"
                                  }}>
                                  {option.tipo === 2 ? (
                                    <>
                                      <div className='tooltip-container'>
                                        <div
                                          style={{
                                            width: "20px",
                                            height: "20px",
                                            backgroundColor: option.color,
                                            border: "1px solid #ccc",
                                            borderRadius: "3px"
                                          }}
                                        />
                                        <span className="tooltip-text" >{option.nombre}</span>
                                      </div>


                                    </>
                                  ) :
                                    <p>{option.nombre}</p>

                                  }
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      {opciones?.length > 1 ?
                        <div className='search__sale-card' onClick={BuscarArticuloPorCombinacion}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-search"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /></svg>
                        </div>
                        : ''}
                    </div>
                    :
                    ''
                  }

                </div>
                :
                <div className="mt-4 card-sale__pulse__combinations">
                  <div className="animate-pulse">
                    <div className="rounded-full"></div>
                    <div className="row__p-one">
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                </div>
              }
              {statusArticle !== false ?
                <div className='row_labels'>
                  {article.desabasto ?
                    <div className='desabasto'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                      <p>Desbasto</p>
                    </div>
                    :
                    ''
                  }
                  {article.bajo_pedido ?
                    <div className='bajo-pedido'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-truck"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></svg>
                      <p>Bajo Pedido</p>
                    </div>
                    :
                    ''
                  }
                  {article.vender_sin_stock ?
                    <div className='vender-sin-stock'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-shopping-bag"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                      <p>Vender sin Stock</p>
                    </div>
                    :
                    ''
                  }
                  {article.ultimas_piezas ?
                    <div className='ultima-piezas'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-clock-3"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16.5 12" /></svg>
                      <p>Ultimas Piezas</p>
                    </div>
                    :
                    ''
                  }
                  {article.consultar_cotizador ?
                    <div className='vender-sin-stock'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-shopping-bag"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                      <p>Consultar con Cotizador</p>
                    </div>
                    :
                    ''
                  }
                  {article.consultar_te ?
                    <div className='vender-sin-stock'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-shopping-bag"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                      <p>Consultar Tiempos de Entrega</p>
                    </div>
                    :
                    ''
                  }
                </div>
                :
                ''
              }
              {statusArticle !== false ?
                <div className='row__two'>
                  <div className='tab__fields'>
                    <div className='inputs__branch-office'>
                      <label className='label__general'>Cantidad</label>
                      <div className='warning__general' style={styleWarningContact}><small >La cantidad  no es multiplo de {article.multiplos_de}</small></div>
                      <input className={`inputs__general ${warningContact ? 'warning' : ''}`} type="number" value={amount} onChange={handleAmountChange} placeholder='Ingresa la cantidad' />
                    </div>


                    <div className='select__container'>
                      <label className='label__general'>Unidad</label>
                      <div className={`select-btn__general`}>
                        <div className={`select-btn ${selectUnits ? 'active' : ''}`} onClick={openSelectUnits}>
                          <div className='select__container_title'>
                            <p>{selectedUnit ? units?.find((s: any) => s.id || s.id_unidad === selectedUnit.id)?.nombre : 'Selecciona'}</p>
                          </div>
                          <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
                            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                          </svg>
                        </div>
                        <div className={`content ${selectUnits ? 'active' : ''}`}>
                          <ul className={`options ${selectUnits ? 'active' : ''}`} style={{ opacity: selectUnits ? '1' : '0' }}>
                            {units?.map((userGroup: any) => (
                              <li key={uuidv4()} onClick={() => handleUnitsChange(userGroup)}>
                                {userGroup.nombre}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className='select__container'>
                      <label className='label__general'>Grupo de usuario</label>
                      <div className={`select-btn__general`}>
                        <div className={`select-btn ${selectUsersGroups ? 'active' : ''}`} onClick={openSelectUsersGroups}>
                          <div className='select__container_title'>
                            <p>{selectedUserGroup ? usersGroups.find((s: { id: number }) => s.id === selectedUserGroup)?.nombre : 'Selecciona'}</p>
                          </div>
                          <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
                            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                          </svg>
                        </div>
                        <div className={`content ${selectUsersGroups ? 'active' : ''}`}>
                          <ul className={`options ${selectUsersGroups ? 'active' : ''}`} style={{ opacity: selectUsersGroups ? '1' : '0' }}>
                            {usersGroups.map((userGroup: any) => (
                              <li key={uuidv4()} onClick={() => handleUsersGroupsChange(userGroup)}>
                                {userGroup.nombre}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    {article.fyv ?
                      <div className=''>
                        <p className='label__general'>Frente y Vuelta</p>
                        <label className="switch">
                          <input type="checkbox" checked={fyv} onChange={(e) => {
                            setfyv(e.target.checked);
                            if (e.target.checked) {
                              setBillingComment('FRENTE Y VUELTA'); setproductionComments('FRENTE Y VUELTA')
                            } else {
                              setBillingComment(''); setproductionComments('')
                            }
                          }} />
                          <span className="slider"></span>
                        </label>
                      </div>
                      : ''}
                    {article?.plantilla_data.length > 0 ?
                      <div className='fields__templates'>
                        {article?.plantilla_data?.map((x: any, index: any) => (
                          x.id == 18 ?
                            ''
                            :
                            <div>
                              {x.tipo == 'texto' ?
                                <div>
                                  <label className='label__general'>{x.nombre}</label>
                                  <input
                                    className={`inputs__general`}
                                    type="text"
                                    value={x.valor}
                                    onChange={(e) => handleTemplatesChange(e, index)}
                                    placeholder={x.nombre}
                                  />
                                </div>
                                :
                                x.tipo == 'numero' ?
                                  <div>
                                    <label className='label__general'>{x.nombre}</label>
                                    <input
                                      className={`inputs__general`}
                                      type="number"
                                      value={x.valor}
                                      onChange={(e) => handleTemplatesChange(e, index)}
                                      placeholder={x.nombre}
                                    />
                                  </div>
                                  :
                                  ''
                              }
                            </div>
                        ))}
                      </div>

                      :
                      ''
                    }

                  </div>
                </div>
                :
                <div className="card-sale__pulse__tab-fields">
                  <div className="animate-pulse">
                    <div className="rounded-full"></div>
                    <div className="row__p-one">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    <div className="row__p-two">
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                </div>

              }
              {statusArticle !== false ?
                <div>
                  <div className='row__three'>
                    {/* <div className='title'>
                        <p>Campos plantillas</p>
                        </div> */}
                    <div className='row'>
                      <div className='col-6'>
                        <label className='label__general'>Coment. factura</label>
                        <textarea className={`inputs__general`} value={data.obs_factura} onChange={(e) => setData((prev: any) => ({ ...prev, obs_factura: e.target.value }))} placeholder='Factura' />
                      </div>
                      <div className='col-6'>
                        <label className='label__general'>Coment. producción</label>
                        <textarea className={`inputs__general`} value={data.obs_produccion} onChange={(e) => setData((prev: any) => ({ ...prev, obs_produccion: e.target.value }))} placeholder='Producción' />
                      </div>

                    </div>
                  </div>
                </div>
                :
                <div className="card-sale__pulse__template__fields">
                  <div className="animate-pulse">
                    <div className="rounded-full"></div>
                    <div className="row__p-one">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    <div className="row__p-two">
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                </div>

              }
              {statusArticle !== false ?
                <>
                  <div className='row result__template__fields'>
                    {article?.plantilla_data?.map((x: any) => (
                      <div className='col-4 md-col-6 sm-col-12'>
                        {x.tipo == 'txtvisual' ?
                          <div className='price_x_unit'>
                            <div>
                              <p>{x.nombre}</p>
                              <p className='result__price_x_unit'>: {x.valor || '0'}</p>
                            </div>
                          </div>
                          : ''}
                      </div>
                    ))}
                  </div>

                </>
                :
                <div className="card-sale__template__values">
                  <div className="animate-pulse">
                    <div className="row__p-two">
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                </div>
              }
              {statusArticle !== false ?
                <div>
                  {Adicional != null ?
                    <div className='table__sale-card-additional'>
                      <div className='table__head'>
                        <div className='thead'>
                          <div className='th'>
                            <p>Adicional</p>
                          </div>
                          <div className='th'>
                            <p>Cantidad</p>
                          </div>
                          <div className='th'>
                            <p>P/U</p>
                          </div>
                          {Adicional.descuento > 0 ?
                            <div className='th'>
                              <p>Des.</p>
                            </div>
                            :
                            ''
                          }
                          <div className='th'>
                            <p>Total</p>
                          </div>
                        </div>
                      </div>
                      {Adicional ? (
                        <div className='table__body'>
                          <div className='tbody__container' >
                            <div className='tbody'>
                              <div className='td'>
                                <p className='addicional'>{Adicional?.codigo}-{Adicional?.descripcion}</p>
                              </div>
                              <div className='td'>
                                <p className='amount'>{Adicional?.cantidad}</p>
                              </div>
                              <div className='td'>
                                <p className='price'>$ {Adicional?.total / Adicional?.cantidad}</p>
                              </div>
                              <div className='td'>
                                <p className='discount'>$ {Adicional?.descuento}</p>
                              </div>
                              <div className='td'>
                                <p className='price_total'>$ {Adicional?.total}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text">Cargando datos...</p>
                      )}
                    </div>

                    : ''}
                </div>
                :
                ''
              }


            </div>
          </div>
          {statusArticle !== false ?
            <div className='row__three'>
              <div className='row__four'>
                {descuento > 0 ?
                  <div className='price_x_unit'>
                    <p className='title__price_x_unit'>Descuento Aplicado:</p>
                    <p className='result__price_x_unit'>$ {descuento}</p>
                  </div>
                  : ''}
                <div className='price_x_unit'>
                  <p className='title__price_x_unit'>Precio por unidad:</p>
                  {loadingPrice ?
                    <div className='container__loader_simple'>
                      <span className="loader_simple"></span>
                    </div>
                    :
                    <p className='result__price_x_unit'>$ {Number.isNaN(prices / amount) ? 0 : (prices / amount)}</p>
                  }
                </div>
                {outOfRange ? <p className='alert__price'>Fuera de rango</p> : ''}
                <div className='total__price'>

                  <p className='title__total-price'>Precio total</p>
                  {loadingPrice ?
                    <div className='container__loader_simple'>
                      <span className="loader_simple"></span>
                    </div>
                    :
                    <p className='result__total-price'>$
                      {article.precio_libre ?
                        <input
                          // className={`inputs__general`}
                          type="text"
                          value={prices}
                          onChange={(e) => setPrices(e.target.value)}
                        />
                        : prices}
                    </p>
                  }

                </div>

              </div>
              {article?.precios_franquicia != null && article?.precios_franquicia.length > 0 && 
              permisosxVistaheader.length > 0 &&
              checkPermission('totales_franquicia')? //FALTA VALIDAR EL PERMISO 
                <div className='row__four'>
                  <div className='price_x_unit'>
                    <p className='title__price_x_unit'>Precio por unidad Franquicia:</p>
                    {loadingPrice ?
                      <span className="loader_simple"></span>
                      :
                      <p className='result__price_x_unit'>$ {Number.isNaN(pricesFranquicia / amount) ? 0 : (pricesFranquicia / amount)}</p>
                    }
                  </div>
                  <div className='total__price'>
                    <p className='title__total-price'>Precio total Franquicia</p>
                    {loadingPrice ?
                      <span className="loader_simple"></span>
                      :
                      <p className='result__total-price'>$ {pricesFranquicia}</p>
                    }

                  </div>
                </div>
                : ''}
              {modalSalesCard === 'sale-card-quotation' ?
                <div className='row__five'>
                  <div className='row__two'>
                    <button className={`add__cart ${loadingPrice ? 'active' : ''}`} disabled={loadingPrice ? true : false} type='button' onClick={updateConcept}>Actualizar articulo</button>
                  </div>
                </div>
                :
                <div>
                  {modalArticleView == 'article-view__modal_header' ?
                    <div className='row__five'>
                      <div className='row__two'>
                        <button className={`add__quotation_one ${loadingPrice ? 'active' : ''}`} disabled={loadingPrice ? true : false} onClick={addQua}>Agregar a cotizacción</button>
                        <button className={`add__cart ${loadingPrice ? 'active' : ''}`} disabled={loadingPrice ? true : false} onClick={addSaleOrder}>Agregar a orden de venta</button>
                      </div>
                    </div>
                    :
                    <div className='row__five'>
                      <div className='row__two'>
                        {modal === 'create-modal__qoutation' || modal === 'update-modal__qoutation' ?
                          <button className={`add__quotation_one ${loadingPrice ? 'active' : ''}`} disabled={loadingPrice ? true : false} onClick={addQua}>Agregar a cotizacción</button>
                          :
                          ''
                        }
                        {modalSalesOrder == 'sale-order__modal' || modalSalesOrder == 'sale-order__modal-update' ?
                          <button className={`add__cart ${loadingPrice ? 'active' : ''}`} disabled={loadingPrice ? true : false} onClick={addSaleOrder}>Agregar a orden de venta</button>
                          :
                          ''
                        }
                      </div>
                    </div>
                  }
                </div>
              }

            </div>
            :
            <div className="card-sale__pulse__buttons">
              <div className="animate-pulse">
                <div className="row__p-two">
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>
          }
          <Prices id_grupo_us={selectedUserGroup} />
          {/* <AddQoutation /> */}
          <ToArrive />
          <Indications />
          <DeliveryTimes />
          <Components />
        </div>
      </div>
    </div>
  );
};

export default SalesCard;
