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

import ToArrive from './sales-sard_modals/ToArrive';
import Indications from './sales-sard_modals/Stocks';
import DeliveryTimes from './sales-sard_modals/DeliveryTimes';
import Components from './sales-sard_modals/Components';
import APIs from '../../../../services/services/APIs';
import { Toaster, toast } from 'sonner'
import { storePersonalized } from '../../../../zustand/Personalized';
import { storeQuotation } from '../../../../zustand/Quotation';


const SalesCard: React.FC = () => {
  const userState = useUserStore(state => state.user);
  const user_id = userState.id;

  const setModalSalesCard = storeSaleCard(state => state.setModalSalesCard);

  
  const setNormalConcepts = storePersonalized(state => state.setNormalConcepts)

  const setConceptView = storePersonalized(state => state.setConceptView)
  const setCustomConceptView = storePersonalized(state => state.setCustomConceptView)


  const { normalConcepts, conceptView, customConceptView }: any = useStore(storePersonalized);

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
      }

      const resultUsers = await getUserGroups(user_id);
      if (resultUsers) {
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





  useEffect(() => {
    if (modalSalesCard !== '') {
      fetch();
    }


  }, [modalSalesCard]);


  useEffect(() => {
    console.log('statusArtiddddddddddddddddddddddcle', statusArticle)
  }, [statusArticle]);


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



  useEffect(() => {

  }, [prices])





  const [data, setData] = useState<any>()



  const get = async () => {

    const dataArticle = {
      id_articulo: article.id,
      id_grupo_us: selectedUserGroup,
      id_unidad: selectedUnit.id,
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
        return setData({
          id_pers: 0,
          front: true,
          id_articulo: article.id,
          produccion_interna: true,
          id_area_produccion: 0,
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
          obs_produccion: productionComments,
          obs_factura: productionComments,
          monto_urgencia: 0,
          urgencia_monto: 0,
          precio_unitario: result.mensaje,

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
      article.plantilla_data.forEach((x: any) => {
        if (x.valor > 0) {
          get();
        }
      });
    }
  };


  const handleAmountChange = (e: any) => {
    setAmount(parseInt(e.target.value))
    if (amount > 0) {
      getPrices()

    }
  }



  const addQua = () => {

    const newData = { ...data };
    newData.id_identifier = identifier + 1;
    setIdentifier(identifier + 1);


    setNormalConcepts([...normalConcepts, newData])
    setConceptView([...conceptView, newData])
    setCustomConceptView([...customConceptView, newData])
  };

  console.log('normalConcepts', normalConcepts)


  const addSaleOrder = () => {
    const incrementIdentifier = storePersonalized.getState().incrementIdentifier;
    const newData = { ...data };
    newData.id_identifier = storePersonalized.getState().identifier + 1; // Usa el valor actual de identifier
    incrementIdentifier();

    if (dataSaleOrder !== undefined) {
      setDataSaleOrder([...dataSaleOrder, newData])
    } else {
      setDataSaleOrder([data])
    }

    setNormalConcepts([...normalConcepts, newData])
    setConceptView([...conceptView, newData])
    setCustomConceptView([...customConceptView, newData])
  
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
          {/* <div className='row__one'>
            {article && (
              <>
                <p className='code'>{article.codigo}-{article.descripcion}</p>
                {article.bajo_pedido == true ?
                  <p className='option'>Bajo pedido</p>
                  :
                  ''}
                {article.vender_sin_stock == true ?
                  <p className='option'>Vender sin stock</p>
                  :
                  ''}
                {article.desabasto == true ?
                  <p className='option'>Desabasto</p>
                  :
                  ''}
                {article.iva_excento == true ?
                  <p className='option'>IVA excento</p>
                  :
                  ''}
              </>
            )}
          </div> */}

          <div className='row__two'>

            <div className='card__images_container'>
              {statusArticle !== false ?
                <div className='images__container'>
                  <div className='images' style={{ backgroundImage: `url(${article?.imagen})` }}></div>
                  <div className='pager'>
                    <div className='item'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6" /></svg>
                    </div>
                    <div className='item'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6" /></svg>
                    </div>
                  </div>
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
                    <span className="sale__card-tooltip-text">Por llegar</span>
                  </div>
                  <div className='btn__sale__card-tooltip-container'>
                    <button className='btn__general-purple' type='button' onClick={() => setModalSub('delivery-time_modal')}>
                      <svg className="icon icon-tabler icons-tabler-outline icon-tabler-clock-hour-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"  ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 7v5" /><path d="M12 12l2 -3" /></svg>
                    </button>
                    <span className="sale__card-tooltip-text">Por llegar</span>
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
                  <div className='desabasto'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                    <p>Desbasto</p>
                  </div>
                  <div className='bajo-pedido'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-truck"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></svg>
                    <p>Bajo Pedido</p>
                  </div>
                  <div className='vender-sin-stock'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-shopping-bag"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                    <p>Vender sin Stock</p>
                  </div>
                  <div className='ultima-piezas'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-clock-3"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16.5 12" /></svg>
                    <p>Ultimas Piezas</p>
                  </div>
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
                  <div className="combinaciones">
                    {article?.opciones_de_variacion?.map((x: any, index: any) => (
                      <div className='combinaciones__container' key={index}>
                        <div className='container'>
                          <svg onClick={() => toggleModal(index)} xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" stroke-linecap="round" strokeLinejoin="round" className="lucide lucide-palette"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg>
                        </div>
                        {/* <p className="option" onClick={() => toggleModal(index)}>
                     {x.combinacion}
                   </p> */}
                        {/* Mostrar combinación de opciones solo si el índice está activo */}
                        {activeIndex === index && (
                          <div className="combination_options">
                            {x.opciones.map((option: any) => (
                              <div key={option.id}>
                                <p onClick={() => combinacion(option)}>{option.nombre}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
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
                <div className='row result__template__fields'>
                  {article?.plantilla_data?.map((x: any) => (
                    <div className='col-4 md-col-6 sm-col-12'>
                      {x.tipo == 'txtvisual' ?
                        <div className='price_x_unit'>
                          <div>
                            <p>{x.nombre}</p>
                            <p className='result__price_x_unit'>: ${x.valor || '0'}</p>
                          </div>
                        </div>
                        : ''}
                    </div>
                  ))}
                </div>
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

            </div>
          </div>
          {statusArticle !== false ?
            <div className='row__three'>
              <div className='row__four'>
                <div className='price_x_unit'>
                  <p className='title__price_x_unit'>Precio por unidad:</p>
                  <p className='result__price_x_unit'>$ {prices !== 0 ? prices : 0 / amount !== 0 ? amount : 0}</p>
                </div>
                <div className='total__price'>
                  <p className='title__total-price'>Precio total</p>
                  <p className='result__total-price'>$ {prices}</p>
                </div>

              </div>
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
          <Prices />
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
