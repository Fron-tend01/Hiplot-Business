import React, { useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { storeModals } from '../../../../zustand/Modals';
import { storeSaleCard } from '../../../../zustand/SaleCard';
import { articleRequests } from '../../../../fuctions/Articles';
import { v4 as uuidv4 } from 'uuid';
import { UserGroupsRequests } from '../../../../fuctions/UserGroups';
import useUserStore from '../../../../zustand/General';
import { UnitsRequests } from '../../../../fuctions/Units';
import './styles/SalesCard.css';
import Prices from './sales-sard_modals/Prices';
import AddQoutation from './sales-sard_modals/AddQoutation';
import ToArrive from './sales-sard_modals/ToArrive';
import Indications from './sales-sard_modals/Indications';
import DeliveryTimes from './sales-sard_modals/DeliveryTimes';
import Components from './sales-sard_modals/Components';
import APIs from '../../../../services/services/APIs';
import { Toaster, toast } from 'sonner'


const SalesCard: React.FC = () => {
  const userState = useUserStore(state => state.user);
  const user_id = userState.id;

  const setModalSalesCard = storeSaleCard(state => state.setModalSalesCard);

  const setDataQuotation = storeSaleCard(state => state.setDataQuotation);
  const setModalSub = storeModals(state => state.setModalSub)
  const { IdArticle, modalSalesCard }: any = useStore(storeSaleCard);
  const { getUserGroups }: any = UserGroupsRequests();
  const { getUnits }: any = UnitsRequests();
  const [units, setUnits] = useState<any[]>([]);
  const [usersGroups, setUsersGroups] = useState<any[]>([]);
  const [amount, setAmount] = useState<number>(0);

  const { getArticles }: any = articleRequests();
  const [article, setArticle] = useState<any>(null);

  const [billingComment, setBillingComment] = useState<any>('')
  
  const [data, setData] = useState<any>([])
  console.log(data)

  const fetch = async () => {
    let data = {
      id: IdArticle,
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
      get_stock: true,
      get_web: true,
      get_unidades: true,
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
  }, [IdArticle, user_id]);

  useEffect(() => {

  },[data])

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
    setSelectedUnit(item.id);
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
  const [message, setMessage] = useState<any>()

  useEffect(() => {
   
    

  }, [prices])
  console.log(prices)

  const get = async () => {
    let dataArticle = {
      id_articulo: article.id,
      id_grupo_us: selectedUserGroup,
      id_unidad: selectedUnit,
      cantidad: amount,
      campos: article.plantilla_data,
 
    };
  
    try {
      let result: any = await APIs.getTotalPrice(dataArticle);
      
      // Verificar que result sea un objeto y contenga la propiedad deseada
      if (result.error == true) {
        
        toast.warning(result.mensaje)
        return
       // Ajustar según el contenido real de result
      }

      if(result.error == false) {
       setPrices(result.mensaje)
       setData([...data, {
        codigo: article.codigo,
        descripcion: article.descripcion,
        unidad: selectedUnit,
        id_articulo: article.id,
        id_grupo_us: selectedUserGroup,
        id_unidad: selectedUnit,
        cantidad: amount,
        campos: article.plantilla_data,
        precio_unitario: result.mensaje,
        comentarios: billingComment
       }])
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
    if(amount > 0) {
      getPrices()
      
    }
  }

  const addQua = () => {
    setDataQuotation(data)
  }


  return (
    <div className={`overlay__sale-card ${modalSalesCard === 'sale-card' ? 'active' : ''}`}>
      <Toaster expand={true} position="top-right" richColors  />
      <div className={`popup__sale-card ${modalSalesCard === 'sale-card' ? 'active' : ''}`}>
        <a href="#" className="btn-cerrar-popup__sale-card" onClick={() => setModalSalesCard('')}>
          <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </a>
        <p className='title__modals'>Crear Nueva Familia</p>
        <div className='conatiner__create_sale-card' onSubmit={handleCreateFamilies}>
     
          <div className='row__one'>
            {article && (
              <>
                <p className='code'>Codigo: {article.codigo}</p>
                <p className='name'>Nombre del articulo: {article.descripcion}</p>
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
                        <p>{selectedUnit ? units.find((s: { id: number }) => s.id === selectedUnit)?.nombre : 'Selecciona'}</p>
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
                  <label className='label__general'>Factura</label>
                  <input className={`inputs__general`} type="text" value={billingComment} onChange={(e) => setBillingComment(e.target.value)} placeholder='Factura' />
                </div>
                <div>
                  <label className='label__general'>Producción</label>
                  <input className={`inputs__general`} type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder='Producción' />
                </div>
              </div>
              <div className='row__three'>
              {article?.plantilla_data.map((x: any, index: any) => (
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
                <button className='add__cart'>Agregar a carrito</button>
              </div>
            </div>
          </div>
          <div className='row__three'>
            <button onClick={() => setModalSub('prices_modal') } className='price'>Precios
              <svg className="icon icon-tabler icons-tabler-outline icon-tabler-premium-rights"  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  ><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M13.867 9.75c-.246 -.48 -.708 -.769 -1.2 -.75h-1.334c-.736 0 -1.333 .67 -1.333 1.5c0 .827 .597 1.499 1.333 1.499h1.334c.736 0 1.333 .671 1.333 1.5c0 .828 -.597 1.499 -1.333 1.499h-1.334c-.492 .019 -.954 -.27 -1.2 -.75" /><path d="M12 7v2" /><path d="M12 15v2" /></svg>
            </button>
            <button onClick={() => setModalSub('add-qoutation_modal')} className='stock'>Agregar a cotizacion
              <svg className="icon icon-tabler icons-tabler-outline icon-tabler-building-warehouse" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  ><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 21v-13l9 -4l9 4v13" /><path d="M13 13h4v8h-10v-6h6" /><path d="M13 21v-9a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v3" /></svg>
            </button>
            <button onClick={() => setModalSub('to-arrive_modal')} className='arrive'>Por llegar
              <svg className="icon icon-tabler icons-tabler-outline icon-tabler-truck-delivery"  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  ><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" /><path d="M3 9l4 0" /></svg>
            </button>
            <button onClick={() => setModalSub('indications_modal')} className='indications'>Indicaciones
              <svg className="icon icon-tabler icons-tabler-outline icon-tabler-directions" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  ><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 21v-4" /><path d="M12 13v-4" /><path d="M12 5v-2" /><path d="M10 21h4" /><path d="M8 5v4h11l2 -2l-2 -2z" /><path d="M14 13v4h-8l-2 -2l2 -2z" /></svg>
            </button>
            <button onClick={() => setModalSub('delivery-time_modal')} className='time'>Tiempos de entrega
              <svg className="icon icon-tabler icons-tabler-outline icon-tabler-clock-hour-1"  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  ><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 7v5" /><path d="M12 12l2 -3" /></svg>
            </button>
            <button onClick={() => setModalSub('components_modal')} className='components'>Componentes
              <svg className="icon icon-tabler icons-tabler-outline icon-tabler-components" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  ><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12l3 3l3 -3l-3 -3z" /><path d="M15 12l3 3l3 -3l-3 -3z" /><path d="M9 6l3 3l3 -3l-3 -3z" /><path d="M9 18l3 3l3 -3l-3 -3z" /></svg></button>      
          </div>
          <Prices />
          <AddQoutation />
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
