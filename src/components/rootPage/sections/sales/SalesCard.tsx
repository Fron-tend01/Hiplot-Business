import React, { useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { storeModals } from '../../../../zustand/Modals';
import { storeSaleCard } from '../../../../zustand/SaleCard';
import { storeSaleOrder } from '../../../../zustand/SalesOrder';
import { articleRequests } from '../../../../fuctions/Articles';
import { v4 as uuidv4 } from 'uuid';
import { UserGroupsRequests } from '../../../../fuctions/UserGroups';
import useUserStore from '../../../../zustand/General';
import { UnitsRequests } from '../../../../fuctions/Units';
import './styles/SalesCard.css';
import Prices from './sales-sard_modals/Prices';
import AddQoutation from './sales-sard_modals/AddQoutation';
import ToArrive from './sales-sard_modals/ToArrive';
import Indications from './sales-sard_modals/Stocks';
import DeliveryTimes from './sales-sard_modals/DeliveryTimes';
import Components from './sales-sard_modals/Components';
import APIs from '../../../../services/services/APIs';
import { Toaster, toast } from 'sonner'
import { storePersonalized } from '../../../../zustand/Personalized';


const SalesCard: React.FC = () => {
  const userState = useUserStore(state => state.user);
  const user_id = userState.id;

  const setModalSalesCard = storeSaleCard(state => state.setModalSalesCard);

  const setNormalConcepts = storePersonalized(state => state.setNormalConcepts);
  const setCustomConcepts = storePersonalized(state => state.setCustomConcepts);
  const setCustomData = storePersonalized(state => state.setCustomData);
  const { normalConcepts, customConcepts, customData }: any = useStore(storePersonalized);

  const setArticle = storeSaleCard(state => state.setArticle);


  const setDataPersonalized = storeSaleCard(state => state.setDataPersonalized);
  const setDataSaleOrder = storeSaleOrder(state => state.setDataSaleOrder);
  const setModalSub = storeModals(state => state.setModalSub)


  const { IdArticle, modalSalesCard, article }: any = useStore(storeSaleCard);
  const { dataSaleOrder }: any = useStore(storeSaleOrder);
  const { getUserGroups }: any = UserGroupsRequests();
  const { getUnits }: any = UnitsRequests();
  const [units, setUnits] = useState<any[]>([]);
  const [usersGroups, setUsersGroups] = useState<any[]>([]);
  const [amount, setAmount] = useState<number>(0);

  const { getArticles }: any = articleRequests();

  const [billingComment, setBillingComment] = useState<any>('')



  const fetch = async () => {
    let data = {
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
      id_usuario: user_id
    };

    let result = await getArticles(data);
    if (result && result.length > 0) {
      let plantilla_data = result[0].plantilla_data || []; // Inicializar como un arreglo vacío
      let id_plantillas_art_campos = [];

      for (let i = 0; i < plantilla_data.length; i++) {
        let id = plantilla_data[i].id;
        id_plantillas_art_campos.push(id);
      }

      // Asegúrate de que plantilla_data siga siendo un arreglo
      result[0].plantilla_data = plantilla_data.map((item: any) => ({
        ...item,
        id_plantillas_art_campos: item.id
      }));

      setArticle(result[0]);
    }


    let resultUnits = await getUnits(data);
    if (resultUnits && resultUnits.length > 0) {
      setUnits(resultUnits);
    }

    let resultUsers = await getUserGroups(user_id);
    if (resultUsers) {
      setUsersGroups(resultUsers);
    }
  };

  useEffect(() => {
    fetch();
    console.log(article)
  }, [IdArticle, user_id]);



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
    console.log(item)
    setSelectedUnit(item);
    setSelectUnits(false);
  };

  const handleTemplatesChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    let value = parseInt(e.target.value);
    const updatedArticle = { ...article };
    updatedArticle.plantilla_data[index].valor = value;

    setArticle(updatedArticle);
    getPrices()
  };

  const [prices, setPrices] = useState<any>()



  useEffect(() => {

  }, [prices])


  

  
  const [data, setData] = useState<any>()
  

  const get = async () => {
    let dataArticle = {
      id_articulo: article.id,
      id_grupo_us: selectedUserGroup,
      id_unidad: selectedUnit.id,
      cantidad: amount,
      campos: article.plantilla_data,
    };

    try {
      let result: any = await APIs.getTotalPrice(dataArticle);

      if (result.error == true) {
        toast.warning(result.mensaje)
        return
      }

      if (result.error == false) {
        setPrices(result.mensaje)
        
        
        setData({
          id_pers: 0,
          check: false,
          produccion_interna: true,
          id_articulo: article.id,
          id_area_produccion: 0,
          enviar_a_produccion: false,
          personalized: false,
          status: 0,
          cantidad: amount,
          monto_urgencia: 0,
          precio_unitario: result.mensaje,
          unidad: selectedUnit.id,
          obs_produccion: "",
          obs_factura: "",
          urgencia_monto: 0,
          urgencia: false,
          areas_produccion: article.areas_produccion,
          codigo: article.codigo,
          descripcion: article.descripcion,
          name_unidad: selectedUnit.nombre,
          precio_total: result.mensaje,
          campos_plantilla: article.plantilla_data.map((x: any) => ({
            nombre_campo_plantilla: x.nombre,
            tipo_campo_plantilla: 0,
            valor: x.valor.toString()
          }))

        })

        
        return

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

  const [identifier, setIdentifier] = useState<number>(0);

  const addQua = () => {
    const newData = { ...data };
  newData.id_identifier = identifier + 1;
  setIdentifier(identifier + 1);

  
    setNormalConcepts([...normalConcepts, newData])
    setCustomData([...customData, newData])

  };
  const addSaleOrder = () => {
    if (dataSaleOrder !== undefined) {
      setDataSaleOrder([...dataSaleOrder, data[0]])
    } else {
      setDataSaleOrder([data[0]])
    }

  }

  const [productionComments, setproductionComments] = useState<string>('')

  const [combinatios, setCombinations] = useState<any>()

  const combinacion = async (x: any) => {
    console.log('xscombinacionsasdsads', x)
    let data = {
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

    let result = await getArticles(data)
    setArticle(result[0])
    console.log('sdsdsssssssss', result[0])
  }

  useEffect(() => {

  }, [article])

  const [activeIndex, setActiveIndex] = useState(null);

  // Función para abrir el modal de opciones
  const toggleModal = (index) => {
    setActiveIndex(activeIndex === index ? null : index); // Alterna la visibilidad
  };

  useEffect(() => {

  }, [data])

  return (
    <div className={`overlay__sale-card ${modalSalesCard === 'sale-card' ? 'active' : ''}`}>
      <Toaster expand={true} position="top-right" richColors />
      <div className={`popup__sale-card ${modalSalesCard === 'sale-card' ? 'active' : ''}`}>
        <a href="#" className="btn-cerrar-popup__sale-card" onClick={() => setModalSalesCard('')}>
          <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </a>
        <p className='title__modals'>Ficha</p>
        <div className='conatiner__create_sale-card' onSubmit={handleCreateFamilies}>
          <div className='row__one'>
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
          </div>

          <div className='row__two'>
            {article && (
              <div className='card__images_container'>
                <div style={{ backgroundImage: `url(${article.imagen})` }}></div>
              </div>
            )}
            <div className='row__one'>
              <div>
                <div className="combinaciones">
                  {article?.opciones_de_variacion?.map((x, index) => (
                    <div key={index}>
                      <p className="option" onClick={() => toggleModal(index)}>
                        {x.combinacion}
                      </p>
                      {/* Mostrar combinación de opciones solo si el índice está activo */}
                      {activeIndex === index && (
                        <div className="combination_options">
                          {x.opciones.map((option) => (
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
              <div className='row__one'>
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
                <div>
                  <label className='label__general'>Cantidad</label>
                  <input className={`inputs__general`} type="number" value={amount} onChange={handleAmountChange} placeholder='Ingresa la cantidad' />
                </div>
              </div>
              <div className='row__two'>
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
                        {units.map((userGroup: any) => (
                          <li key={uuidv4()} onClick={() => handleUnitsChange(userGroup)}>
                            {userGroup.nombre}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                  <label className='label__general'>Coment. factura</label>
                  <input className={`inputs__general`} type="text" value={billingComment} onChange={(e) => setBillingComment(e.target.value)} placeholder='Factura' />
                </div>
                <div>
                  <label className='label__general'>Coment. producción</label>
                  <input className={`inputs__general`} type="text" value={productionComments} onChange={(e) => setproductionComments(e.target.value)} placeholder='Producción' />
                </div>
              </div>
              <div className='row__three'>
                {article?.plantilla_data?.map((x: any, index: any) => (
                  <div>
                    <label className='label__general'>{x.nombre}</label>
                    <input
                      className={`inputs__general`}
                      type="text"
                      value={x.value}
                      onChange={(e) => handleTemplatesChange(e, index)}
                      placeholder={x.nombre}
                    />
                  </div>
                ))}
              </div>
              <div className='row__four'>
                <div className='price_x_unit'>
                  <p>Precio por unidad:</p>
                  <p className='result__price_x_unit'>$ 45</p>
                </div>
                <div className='total__price'>
                  <p>Precio total</p>
                  <p className='result__total-price'>$ {prices}</p>
                </div>

              </div>
              <div className='row__five'>
                <button className='add__quotation' onClick={addQua}>Agregar a cotizacción</button>
                <button className='add__cart' onClick={addSaleOrder}>Agregar a orden de venta</button>
              </div>
            </div>
          </div>
          <div className='row__three'>
            <button onClick={() => setModalSub('prices_modal')} className='price'>Precios
              <svg className="icon icon-tabler icons-tabler-outline icon-tabler-premium-rights" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"  ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M13.867 9.75c-.246 -.48 -.708 -.769 -1.2 -.75h-1.334c-.736 0 -1.333 .67 -1.333 1.5c0 .827 .597 1.499 1.333 1.499h1.334c.736 0 1.333 .671 1.333 1.5c0 .828 -.597 1.499 -1.333 1.499h-1.334c-.492 .019 -.954 -.27 -1.2 -.75" /><path d="M12 7v2" /><path d="M12 15v2" /></svg>
            </button>
            {/* <button onClick={() => setModalSub('add-qoutation_modal')} className='stock'>Agregar a cotizacion
              <svg className="icon icon-tabler icons-tabler-outline icon-tabler-building-warehouse" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"  ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 21v-13l9 -4l9 4v13" /><path d="M13 13h4v8h-10v-6h6" /><path d="M13 21v-9a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v3" /></svg>
            </button> */}
              <button onClick={() => setModalSub('indications_modal')} className='indications'>Stock
                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-stack-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 4l-8 4l8 4l8 -4l-8 -4" /><path d="M4 12l8 4l8 -4" /><path d="M4 16l8 4l8 -4" /></svg>
            </button>
            <button onClick={() => setModalSub('to-arrive_modal')} className='arrive'>Por llegar
              <svg className="icon icon-tabler icons-tabler-outline icon-tabler-truck-delivery" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"  ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" /><path d="M3 9l4 0" /></svg>
            </button>
          
            <button onClick={() => setModalSub('delivery-time_modal')} className='time'>Tiempos de entrega
              <svg className="icon icon-tabler icons-tabler-outline icon-tabler-clock-hour-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"  ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 7v5" /><path d="M12 12l2 -3" /></svg>
            </button>
            <button onClick={() => setModalSub('components_modal')} className='components'>Componentes
              <svg className="icon icon-tabler icons-tabler-outline icon-tabler-components" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"  ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12l3 3l3 -3l-3 -3z" /><path d="M15 12l3 3l3 -3l-3 -3z" /><path d="M9 6l3 3l3 -3l-3 -3z" /><path d="M9 18l3 3l3 -3l-3 -3z" /></svg></button>
          </div>
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
