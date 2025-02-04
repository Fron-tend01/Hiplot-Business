import React, { useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { storeModals } from '../../../../zustand/Modals';
import { storeSaleCard } from '../../../../zustand/SaleCard';
import { storeSaleOrder } from '../../../../zustand/SalesOrder';
import { articleRequests } from '../../../../fuctions/Articles';
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
import { Toaster, toast } from 'sonner'
import { storePersonalized } from '../../../../zustand/Personalized';
import { storeQuotation } from '../../../../zustand/Quotation';
import Swal from 'sweetalert2';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';




const SalesCard: React.FC = ({ idA }: any) => {
  const userState = useUserStore(state => state.user);
  const user_id = userState.id;

  const setModalSalesCard = storeSaleCard(state => state.setModalSalesCard);


  const setNormalConcepts = storePersonalized(state => state.setNormalConcepts)

  const setConceptView = storePersonalized(state => state.setConceptView)
  const setCustomConceptView = storePersonalized(state => state.setCustomConceptView)


  const { normalConcepts, conceptView, customConceptView, customConcepts }: any = useStore(storePersonalized);

  const setArticle = storeSaleCard(state => state.setArticle);

  const setIdentifier = storeQuotation(state => state.setIdentifier);
  const { identifier }: any = useStore(storeQuotation);

  const setDataSaleOrder = storeSaleOrder(state => state.setDataSaleOrder);
  const setModalSub = storeModals(state => state.setModalSub)
  const setStatusArticle = storeSaleCard(state => state.setStatusArticle);


  const { IdArticle, modalSalesCard, article, statusArticle }: any = useStore(storeSaleCard);
  const { dataSaleOrder }: any = useStore(storeSaleOrder);
  const { getUserGroups }: any = UserGroupsRequests();
  const [units, setUnits] = useState<any[]>([]);
  const [usersGroups, setUsersGroups] = useState<any[]>([]);
  const [amount, setAmount] = useState<number>(0);

  const { getArticles }: any = articleRequests();

  const [billingComment, setBillingComment] = useState<any>('')
  const [opciones, setOpciones] = useState<any>(null);

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
    };

    try {
      // Obtener artículos
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
        setOpciones(response[0].opciones_de_variacion2)
      }


    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      // Cambia el estado después de completar todo el proceso
      setStatusArticle(true);
    }
  };





  useEffect(() => {
    if (modalSalesCard === 'sale-card') {
      fetch();
    }


  }, [idA]);

  const fetchUser = async () => {

    const resultUsers = await getUserGroups(user_id);
    if (resultUsers) {
      console.log('ENTRANDO A ASIGNAR LOS UP', resultUsers);

      setUsersGroups(resultUsers);
      setSelectedUserGroup(resultUsers[0].id);
    }
  }

  useEffect(() => {
    fetchUser()
  }, [idA]);


  // useEffect(() => {
  //   fetchDos();

  // }, [IdArticle, user_id]);


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
    console.log('article.plantilla_data[index]', article.plantilla_data[index]);

    if (article.plantilla_data[index].tipo == 'numero') {
      value = parseInt(e.target.value);
    }
    const updatedArticle = { ...article };
    updatedArticle.plantilla_data[index].valor = value;

    setArticle(updatedArticle);
    getPrices()
  };

  const [prices, setPrices] = useState<any>(0)
  const [descuento, setDescuento] = useState<number>(0)
  const [pricesFranquicia, setPricesFranquicia] = useState<any>(0)
  const [pricesFranquiciaAdicional, setPricesFranquiciaAdicional] = useState<any>(0)



  useEffect(() => {

  }, [prices])





  const [data, setData] = useState<any>()


  const get = async () => {


    const dataArticle = {
      id_articulo: article.id,
      id_grupo_us: selectedUserGroup,
      id_unidad: selectedUnit.id_unidad,
      id_usuario: user_id,
      cantidad: amount,
      campos: article.plantilla_data.filter((x: any) => x.tipo == 'numero'),
      camposTxTVisual: article.plantilla_data.filter((x: any) => x.tipo == 'txtvisual'),
    };


    try {
      const result: any = await APIs.getTotalPrice(dataArticle);

      article.plantilla_data.forEach((c: any) => {
        let buscar_in_result = result.txtvisual_campos.filter(
          (x: any) => x.id_plantillas_art_campos == c.id
        );

        if (buscar_in_result.length > 0) {
          let valor = buscar_in_result[0].valor;
          c.valor = valor; // Actualiza el valor en el objeto clonado
        }
      });


      if (result.error == true) {
        toast.warning(result.mensaje)
        return
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
            campos: article.plantilla_data.filter((x: any) => x.tipo == 'numero'),
            camposTxTVisual: article.plantilla_data.filter((x: any) => x.tipo == 'txtvisual'),
            franquicia: true
          };

          const resultFranquicia: any = await APIs.getTotalPrice(dataArticleFranquicia);
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
          id_area_produccion: article.areas_produccion[0].id_area,
          enviar_a_produccion: false,
          personalized: false,
          check: true,
          status: 0,
          descripcion: article.descripcion,
          codigo: article.codigo,
          unidad: selectedUnit.id_unidad,
          name_unidad: selectedUnit.nombre,
          cantidad: amount,
          precio_total: result.mensaje,
          obs_produccion: productionComments,
          obs_factura: productionComments,
          monto_urgencia: 0,
          urgencia_monto: 0,
          descuento: result.descuento_aplicado,
          precio_unitario: result.mensaje / amount,
          total_franquicia: precio_franq_tmp,
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
            valor: x.tipo == 'texto' ? x.valor.toString() : x.valor
            // valor: x.valor.toString()
          }))

        })



      }
    } catch (error) {
      console.error('Error al obtener el precio total:', error);
    }
  };


  const getPrices = async () => {
    if (amount > 0) {
      let numbrs = article.plantilla_data.filter((x: any) => x.tipo == 'numero')
      if (numbrs.length > 0) {
        article.plantilla_data.forEach((x: any) => {
          if (x.valor > 0 && x.tipo == 'numero') {
            get();
          }
        });
      } else {
        get()
      }

    }

  };


  const handleAmountChange = (e: any) => {
    setAmount(parseInt(e.target.value))

  }
  useEffect(() => {
    getPrices()
  }, [amount])

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
            comentarios_produccion: productionComments,
            comentarios_factura: billingComment,
            conceptos: [concepto_principal, concepto_adicional],
            id_identifier: identifier + 1
          }
          //----------------------------------------------------REVISAR ESTOS SETS, ALGO HACE FALTA QUE TIENE UN COMPORTAMIENTO EXTRAÑO
          setCustomConcepts([...customConcepts, data_pers])

          setConceptView([...normalConcepts, data_pers])
          setCustomConceptView(normalConcepts)
        }
      });

    } else { //SI NO TIENE ADICIONAL PASA COMO CONCEPTO NORMAL
      const newData = { ...data };
      newData.id_identifier = identifier + 1;
      setIdentifier(identifier + 1);
      setNormalConcepts([...normalConcepts, newData])
      setConceptView([...conceptView, newData])
      setCustomConceptView([...customConceptView, newData])

    }
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
            comentarios_produccion: productionComments,
            comentarios_factura: billingComment,
            conceptos: [concepto_principal, concepto_adicional],
            id_identifier: identifier + 1
          }
          //----------------------------------------------------REVISAR ESTOS SETS, ALGO HACE FALTA QUE TIENE UN COMPORTAMIENTO EXTRAÑO
          setCustomConcepts([...customConcepts, data_pers])

          setConceptView([...normalConcepts, data_pers])
          setCustomConceptView(normalConcepts)
        }
      });

    } else { //SI NO TIENE ADICIONAL PASA COMO CONCEPTO NORMAL
      const incrementIdentifier = storePersonalized.getState().incrementIdentifier;
      const newData = { ...data };
      newData.id_identifier = storePersonalized.getState().identifier + 1; // Usa el valor actual de identifier
      incrementIdentifier();
      console.log('data', data);

      if (dataSaleOrder !== undefined) {
        setDataSaleOrder([...dataSaleOrder, newData])
      } else {
        setDataSaleOrder([data])
      }

      setNormalConcepts([...normalConcepts, newData])
      setConceptView([...conceptView, newData])
      setCustomConceptView([...customConceptView, newData])
    }
    toast.success('Artículo agregado')

  }

  const [productionComments, setproductionComments] = useState<string>('')


  const combinacion = async (x: any) => {
    const data = {
      id: x.id_articulo,
      activos: true,
      nombre: '',
      codigo: '',
      familia: 0,
      proveedor: 0,
      materia_prima: 0,
      get_sucursales: true,
      get_proveedores: true,
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
      id_usuario: user_id
    };

    const result = await getArticles(data)
    setArticle(result[0])
  }

  useEffect(() => {
    setUnits(article?.unidades);

    setSelectedUnit(article?.unidades[0])
  }, [article])

  const [activeIndex, setActiveIndex] = useState(null);

  // Función para abrir el modal de opciones
  const toggleModal = (index: any) => {
    setActiveIndex(activeIndex === index ? null : index); // Alterna la visibilidad
  };

  useEffect(() => {

  }, [data])




  const modal = () => {
    setModalSalesCard('')
    setStatusArticle(false)
  }

  const handleSelect = (combinacionIndex: number, optionId: number) => {
    setOpciones((prevOpciones: any) =>
      prevOpciones.map((grupo: any, i: number) =>
        i === combinacionIndex
          ? {
            ...grupo,
            opciones: grupo.opciones.map((option: any) => ({
              ...option,
              selected: option.id === optionId
            }))
          }
          : grupo
      )
    );
  };

  useEffect(() => {
    console.log(opciones);

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

    console.log("IDs seleccionados:", selectedIds);

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
        setOpciones(response[0].opciones_de_variacion2)
      }

      const resultUsers = await getUserGroups(user_id);
      if (resultUsers) {
        console.log('ENTRANDO A ASIGNAR LOS UP', resultUsers);

        setUsersGroups(resultUsers);
        setSelectedUserGroup(resultUsers[0].id);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      // Cambia el estado después de completar todo el proceso
      setStatusArticle(true);
    }
  };
  return (
    <div className={`overlay__sale-card ${modalSalesCard === 'sale-card' ? 'active' : ''}`}>
      <Toaster expand={true} position="top-right" richColors />
      <div className={`popup__sale-card ${modalSalesCard === 'sale-card' ? 'active' : ''}`}>
        <div className='header__modal'>
          <a href="#" className="btn-cerrar-popup__sale-card" onClick={modal}>
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
                  <div className='btn__sale__card-tooltip-container'>
                    <button className='btn__general-purple' type='button' onClick={() => setModalSub('components_modal')}>
                      <svg className="icon icon-tabler icons-tabler-outline icon-tabler-components" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"  ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12l3 3l3 -3l-3 -3z" /><path d="M15 12l3 3l3 -3l-3 -3z" /><path d="M9 6l3 3l3 -3l-3 -3z" /><path d="M9 18l3 3l3 -3l-3 -3z" /></svg>
                    </button>
                    <span className="sale__card-tooltip-text">Componentes</span>
                  </div>
                </div>
                :
                ''
              }
              {statusArticle !== false ?
                <div className='row__three'>
                  {article.desabasto ?
                    <div className='desabasto'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                      <p>Desbasto</p>
                    </div>
                    : ''}
                  {article.bajo_pedido ?
                    <div className='bajo-pedido'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-truck"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></svg>
                      <p>Bajo Pedido</p>
                    </div>
                    : ''}
                  {article.vender_sin_stock ?
                    <div className='vender-sin-stock'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-shopping-bag"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                      <p>Vender sin Stock</p>
                    </div>
                    : ''}
                  {article.ultimas_piezas ?
                    <div className='ultima-piezas'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-clock-3"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16.5 12" /></svg>
                      <p>Ultimas Piezas</p>
                    </div>
                    : ''}




                </div>
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
                  {opciones !== null ?
                    <div className="combinaciones">
                      {opciones?.map((x: any, index: any) => (
                        <div className='combinaciones__container' key={index}>
                          {/* {x.combinacion == 'COLORES' ?
                            <div onClick={() => toggleModal(index)}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-palette"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 2c5.498 0 10 4.002 10 9c0 1.351 -.6 2.64 -1.654 3.576c-1.03 .914 -2.412 1.424 -3.846 1.424h-2.516a1 1 0 0 0 -.5 1.875a1 1 0 0 1 .194 .14a2.3 2.3 0 0 1 -1.597 3.99l-.156 -.009l.068 .004l-.273 -.004c-5.3 -.146 -9.57 -4.416 -9.716 -9.716l-.004 -.28c0 -5.523 4.477 -10 10 -10m-3.5 6.5a2 2 0 0 0 -1.995 1.85l-.005 .15a2 2 0 1 0 2 -2m8 0a2 2 0 0 0 -1.995 1.85l-.005 .15a2 2 0 1 0 2 -2m-4 -3a2 2 0 0 0 -1.995 1.85l-.005 .15a2 2 0 1 0 2 -2" /></svg>

                            </div>
                            :
                            <p onClick={() => toggleModal(index)}>    {x.combinacion}</p>
                          }

                          {x.combinacion == 'COLORES' ?
                            <div onClick={() => toggleModal(index)}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z" /></svg>
                            </div>
                            :
                            ''
                          }

                          {x.combinacion == 'COLORES' ?
                            <div onClick={() => toggleModal(index)}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M469.3 19.3l23.4 23.4c25 25 25 65.5 0 90.5l-56.4 56.4L322.3 75.7l56.4-56.4c25-25 65.5-25 90.5 0zM44.9 353.2L299.7 98.3 413.7 212.3 158.8 467.1c-6.7 6.7-15.1 11.6-24.2 14.2l-104 29.7c-8.4 2.4-17.4 .1-23.6-6.1s-8.5-15.2-6.1-23.6l29.7-104c2.6-9.2 7.5-17.5 14.2-24.2zM249.4 103.4L103.4 249.4 16 161.9c-18.7-18.7-18.7-49.1 0-67.9L94.1 16c18.7-18.7 49.1-18.7 67.9 0l19.8 19.8c-.3 .3-.7 .6-1 .9l-64 64c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0l64-64c.3-.3 .6-.7 .9-1l45.1 45.1zM408.6 262.6l45.1 45.1c-.3 .3-.7 .6-1 .9l-64 64c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0l64-64c.3-.3 .6-.7 .9-1L496 350.1c18.7 18.7 18.7 49.1 0 67.9L417.9 496c-18.7 18.7-49.1 18.7-67.9 0l-87.4-87.4L408.6 262.6z" /></svg>
                            </div>
                            :
                            ''
                          } */}
                          <div className='container__combination' onClick={() => toggleModal(index)}>
                            {x.combinacion}
                          </div>
                          {activeIndex === index && (
                            <div className="combination_options">
                              {x.opciones.map((option: any) => (
                                <div key={option.id} onClick={() => handleSelect(index, option.id)}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    cursor: "pointer",
                                    backgroundColor: option.selected ? "#4CAF50" : "transparent",
                                    color: option.selected ? "white" : "black",
                                    padding: "5px",
                                    borderRadius: "5px"
                                  }}>
                                  <p>{option.nombre}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      <div className='search__sale-card' onClick={BuscarArticuloPorCombinacion}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-search"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /></svg>
                      </div>
                    </div>
                    :
                    ''
                  }

                </div>
                :
                <div className="card-sale__pulse__combinations mt-4">
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
                <div className='row__two'>
                  <div className='title'>
                    <p>Campos de la ficha</p>
                  </div>
                  <div className='tab__fields'>
                    <div className=''>
                      <label className='label__general'>Cantidad</label>
                      <input className={`inputs__general`} type="number" value={amount} onChange={handleAmountChange} placeholder='Ingresa la cantidad' />
                    </div>
                    <div className='select__container'>
                      <label className='label__general'>Unidad</label>
                      <div className={`select-btn__general`}>
                        <div className={`select-btn ${selectUnits ? 'active' : ''}`} onClick={openSelectUnits}>
                          <div className='select__container_title'>
                            <p>{selectedUnit ? units.find((s: { id: number }) => s.id === selectedUnit.id)?.nombre : 'Selecciona'}</p>
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
                    <div className=''>
                      <label className='label__general'>Coment. factura</label>
                      <input className={`inputs__general`} type="text" value={billingComment} onChange={(e) => setBillingComment(e.target.value)} placeholder='Factura' />
                    </div>
                    <div className=''>
                      <label className='label__general'>Coment. producción</label>
                      <input className={`inputs__general`} type="text" value={productionComments} onChange={(e) => setproductionComments(e.target.value)} placeholder='Producción' />
                    </div>
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
                  {article?.plantilla_data.length > 0 ?
                    <div className='row__three'>
                      {/* <div className='title'>
                        <p>Campos plantillas</p>
                      </div> */}
                      <div className='template__fields'>
                        {article?.plantilla_data?.map((x: any, index: any) => (
                          <div>
                            {x.tipo != 'txtvisual' ?
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
                              : ''}
                          </div>
                        ))}
                      </div>

                    </div>
                    :
                    ''
                  }
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
                  <p className='result__price_x_unit'>$ {Number.isNaN(prices / amount) ? 0 : (prices / amount)}</p>
                </div>
                <div className='total__price'>
                  <p className='title__total-price'>Precio total</p>
                  <p className='result__total-price'>$ {prices}</p>
                </div>

              </div>
              {article?.precios_franquicia != null && article?.precios_franquicia.length > 0 ? //FALTA VALIDAR EL PERMISO 
                <div className='row__four'>
                  <div className='price_x_unit'>
                    <p className='title__price_x_unit'>Precio por unidad Franquicia:</p>
                    <p className='result__price_x_unit'>$ {Number.isNaN(pricesFranquicia / amount) ? 0 : (pricesFranquicia / amount)}</p>
                  </div>
                  <div className='total__price'>
                    <p className='title__total-price'>Precio total Franquicia</p>
                    <p className='result__total-price'>$ {pricesFranquicia}</p>
                  </div>
                </div>
                : ''}
              <div className='row__five'>
                <div className='row__one'>
                </div>
                <div className='row__two'>
                  <button className='add__quotation' onClick={addQua}>Agregar a cotizacción</button>
                  <button className='add__cart' onClick={addSaleOrder}>Agregar a orden de venta</button>
                </div>
              </div>
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
