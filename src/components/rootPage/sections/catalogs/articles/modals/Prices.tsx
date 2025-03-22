import React, { useEffect, useState } from 'react'
import { storeArticles } from '../../../../../../zustand/Articles'
import { UserGroupsRequests } from '../../../../../../fuctions/UserGroups'
import { RangesRequests } from '../../../../../../fuctions/Ranges'
import useUserStore from '../../../../../../zustand/General'
import { storeModals } from '../../../../../../zustand/Modals'
import History from './Prices/History'
import { useStore } from 'zustand';
import Select from '../../../../Dynamic_Components/Select'
import { useSelectStore } from '../../../../../../zustand/Select'
import Swal from 'sweetalert2';
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid';
import './style/Prices.css'
import APIs from '../../../../../../services/services/APIs'
import { storeFamilies } from '../../../../../../zustand/Families'
import { articleRequests } from '../../../../../../fuctions/Articles'

const Prices: React.FC = () => {
  const userState = useUserStore(state => state.user);
  const user_id = userState.id;

  const selectedIds: any = useSelectStore((state) => state.selectedIds);

  const { articleToUpdate }: any = useStore(storeArticles);

  const setPrices = storeArticles(state => state.setPrices)
  const setDeletePrices = storeArticles(state => state.setDeletePrices)

  const setModalSub = storeModals(state => state.setModalSub)
  const setHistoryPrices = storeArticles(state => state.setHistoryPrices)
  const { articleByOne, deletePrices }: any = useStore(storeArticles);

  const { prices, subModal } = useStore(storeArticles);

  const { modalSub }: any = useStore(storeModals);


  const [usersGroups, setUsersGroups] = useState<any>([]);

  useEffect(() => {

  }, [articleByOne])



  const { getRanges }: any = RangesRequests();
  const { getUserGroups }: any = UserGroupsRequests();
  const [templates, setTemplates] = useState<any>();
  const [ranges, setRanges] = useState<any>();

  const fetch = async () => {
    const data = {
      titulo: ''
    }
    try {
      const resultRanges = await getRanges(data);
      setRanges(resultRanges)
      const resultTemplates: any = await APIs.GetAny("get_campos_plantillas/get");
      resultTemplates.unshift({ "id": 0, "nombre": 'Ninguno' })
      setTemplates(resultTemplates)
      const resultUserGroups = await getUserGroups(user_id);
      setUsersGroups(resultUserGroups)
      if (articleByOne) {
        setPrices(articleByOne.precios)
      }
      setDataSelects(
        {
          selectName: 'Grupos de usuarios',
          options: 'nombre',
          dataSelect: resultUserGroups
        }
      )
      setDataSelectDe(
        {
          selectName: 'Del grupo',
          options: 'nombre',
          dataSelect: resultUserGroups
        }
      )

      setDataSelectAl(
        {
          selectName: 'Al grupo',
          options: 'nombre',
          dataSelect: resultUserGroups
        }
      )
      // setSelectRanges(
      //   {
      //     selectName: 'Rangos',
      //     options: 'titulo',
      //     dataSelect: resultRanges
      //   }
      // )
      // setSelectTemplates(
      //   {
      //     selectName: '',
      //     options: 'nombre',
      //     dataSelect: resultTemplates
      //   }
      // )


    } catch (error) {
      console.error('Error fetching ranges:', error);
    }
  };

  const [dataSelects, setDataSelects] = useState<any>([])
  const [dataSelectDe, setDataSelectDe] = useState<any>([])
  const [dataSelectAl, setDataSelectAl] = useState<any>([])




  useEffect(() => {
    if (subModal == 'modal-prices') {

      fetch();
    }

  }, [subModal]);

  const setSubModal = storeArticles(state => state.setSubModal);



  const closeModal = () => {
    setSubModal('');
  };

  const [inputs, setInputs] = useState<any>({
    price: null,
    roundPrice: null,
    observations: '',
  });



  const handleInputs = (event: any) => {
    const { name, value } = event.target;
    setInputs((prevInputs: any) => ({
      ...prevInputs,
      [name]: name === 'price' || name === 'roundPrice' ? Number(value) : value,
    }));
  };

  const handleTemplateChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const temp_proveedor = parseInt(event.target.value, 10);
    additionalsPrices[index].variable_pc = temp_proveedor;
  };


  const seeHistory = (item: any) => {
    setModalSub('modal_sub_prices')
    setHistoryPrices(item)
  }


  const [additionalsPrices, setAdditionalsPrices] = useState<any>([])



  const handleOrdenChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.trim();
    const newArticleStates = [...additionalsPrices];
    newArticleStates[index].orden = value === '' ? null : parseInt(value, 10);
    setAdditionalsPrices(newArticleStates);
  };


  const additionalPrices = () => {
    const data = {
      id_rangos: selectedRanges.id,
      rango_titulo: selectedRanges.titulo,
      id_articulos_precios: null,
      variable_pc: selectedIds?.templates?.id,
      pc_nombre: selectedIds?.templates?.nombre,
      comentarios: inputs.observations,
      orden: false,
      agrupar: false,
      name_group: selectedIds?.templates?.id,
      selected: false
    };
    setAdditionalsPrices([...additionalsPrices, data])
  }

  const deletePrice = (item: any) => {
    const updated = additionalsPrices.filter((x: any) => x !== item);
    setAdditionalsPrices(updated);
  };

  const deleteFinalPrice = (item: any) => {
    console.log('item', item);

    Swal.fire({
      title: "Deseas eliminar todos los precios de este grupo de usuarios?",
      text: "No olvides guardar los cambios de este articulo, si le das click en No, solo se eliminará el registro seleccionado",
      icon: 'warning',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`
    }).then(async (result) => {
      if (result.isConfirmed) {
        const updated = prices.filter((x: any) => x.id_grupos_us !== item.id_grupos_us);

        const deletedIds = prices.filter((x: any) => x.id_grupos_us === item.id_grupos_us).map((x: any) => x.id)
          .filter((id: any) => id !== null);
        setPrices(updated);
        setDeletePrices([...deletePrices, ...deletedIds]);
      } else if (result.isDenied) {
        const updated = prices.filter((x: any) => x !== item);
        setPrices(updated);
        if (item.id !== null) {
          setDeletePrices([...deletePrices, item.id])
        }
      }
    });

  };


  const addPrices = () => {

    if (selectedIds?.grouspusers && inputs.price) {
      const data = {
        id_grupos_us: selectedIds.grouspusers.id,
        name_group: selectedIds.grouspusers.nombre,
        precios: inputs.price,
        precios_fyv: inputs.roundPrice == null ? 0 : inputs.roundPrice,
        comentarios: inputs.observations,
        precios_ext: additionalsPrices,
        precios_ext_elim: [],
      }

      if (Array.isArray(prices)) {
        setPrices([...prices, data])
      } else {
        setPrices([data])
      }
    } else {
      toast.warning('Por favor llena todos los campos');
    }


  }

  const [selectsRanges, setSelectsRanges] = useState<boolean>(false)
  const [selectedRanges, setSelectedRanges] = useState<any>()

  const openselectsRanges = () => {
    setSelectsRanges(!selectsRanges)
  }

  const handleRangesChange = (range: any) => {
    setSelectedRanges(range)
    setSelectsRanges(false)
  }



  // const [selectsRangesTwo, setSelectsRangesTwo] = useState<any>(null)





  const [searchTerm, setSearchTerm] = useState('');

  const searchRanges = async (value: string) => {
    setSearchTerm(value)
    const resultRanges = await getRanges({ titulo: value });
    setRanges(resultRanges);
  };

  useEffect(() => {
    searchRanges(searchTerm)
  }, [searchTerm]);



  // console.log(additionalsPrices, additionalsPrices)

  const handleAgruparChange = (index: number) => {
    additionalsPrices[index].agrupar = !additionalsPrices[index].agrupar;
    setAdditionalsPrices([...additionalsPrices]);
  };



  const [activeDrop] = useState<number>()

  // const dropDown = (index: any) => {
  //   setActiveDrop((prevIndex) => (prevIndex === index ? null : index));
  // }




  const handlePricesChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = parseInt(e.target.value.trim(), 10);
    if (!isNaN(value)) {
      prices[index].precios = value;
      setPrices([...prices]);
    } else {
      prices[index].precios = '';
      setPrices([...prices]);
    }
  };

  const handlePricesFVChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = parseInt(e.target.value.trim(), 10);
    if (!isNaN(value)) {
      prices[index].precios_fyv = value;
      setPrices([...prices]);
    } else {
      prices[index].precios_fyv = '';
      setPrices([...prices]);
    }
  }

  const handleUsersGroupsChange = (e: any, index: number) => {
    const newPrices = [...prices];
    newPrices[index].id_grupos_us = parseInt(e.target.value);
    setPrices(newPrices);
  }

  const handlePricesComent = (e: any, index: number) => {
    const newPrices = [...prices];
    newPrices[index].comentarios = e.target.value;
    setPrices(newPrices);
  }


  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, index_two: number) => {
    const value = e.target.value;
    const updatedPrices = [...prices];

    updatedPrices[index] = {
      ...updatedPrices[index],
      precios_ext: updatedPrices[index].precios_ext.map((item: any, i: any) =>
        i === index_two ? { ...item, orden: value } : item // Asignar el valor al campo `orden`
      ),
    };
    // Actualizar el estado
    setPrices(updatedPrices);
  };

  const handleGroupChange = (index: number, index_two: number) => {
    prices[index].precios_ext[index_two].agrupar = !prices[index].precios_ext[index_two].agrupar;
    setPrices([...prices]);
  };


  const setModalArticle = storeArticles(state => state.setModalArticle)
  const setArticleToUpdate = storeArticles(state => state.setArticleToUpdate)
  const { families, getFamilies }: any = storeFamilies()
  const { getArticles }: any = articleRequests()
  const setArticleByOne = storeArticles((state: any) => state.setArticleByOne);
  const setModalLoading = storeArticles((state: any) => state.setModalLoading);

  const clonePrice = async () => {
    const dataa = {
      id_articulo: articleToUpdate.id,
      id_grupo_us_desde: selectedIds.id_groupUserDe.id,
      id_grupo_us_hasta: selectedIds.id_groupUserAl.id
    }
    try {
      setModalLoading(true)
      const result: any = await APIs.cloneArticlesPrice(dataa)
      setSubModal('')
      const data = {
        id: articleToUpdate.id,
        activos: true,
        nombre: '',
        codigo: '',
        familia: 0,
        proveedor: 0,
        page: 1,
        materia_prima: 99,
        get_sucursales: true,
        get_proveedores: true,
        get_max_mins: true,
        get_plantilla_data: true,
        get_precios: true,
        get_variaciones: true,
        get_combinaciones: true,
        get_tiempos_entrega: true,
        get_areas_produccion: true,
        get_componentes: true,
        get_cargos_minimos: true,
        get_cobros_franquicia: true,
        get_adicional: true,
        get_stock: true,
        get_web: false,
        get_unidades: true
      }

      setModalArticle('articles-modal-update')
      getFamilies(user_id)

      try {

        const result = await getArticles(data)
        // const resultImagenes = await getArticles(data2)
        await setArticleByOne(result[0])
        setArticleToUpdate(result[0]);
        setSubModal('modal-prices')

        // setImagesArticles(resultImagenes[0].imagenes)
        setModalLoading(false)
      } catch (error) {
      } finally {
        setModalLoading(false)
      }
      Swal.fire(result.mensaje, '', 'success');
    } catch (error) {
      setModalLoading(false)
      Swal.fire('Hubo un error', '', 'error');
    }
  }

  const handleTemplatesChange = (e: any, index: number, index_two: number) => {
    const value = e.target.value;
    prices[index].precios_ext[index_two].variable_pc = value;
  }
  const handleChangeRange = (indexItem: number, indexRange: number, newValue: string) => {
    const updatedPrices = (prices || []).map((item: any, i: number) => {
      if (i === indexItem) {
        return {
          ...item,
          precios_ext: Array.isArray(item.precios_ext)
            ? item.precios_ext.map((rangeItem: any, j: number) =>
                j === indexRange ? { ...rangeItem, id_rangos: newValue } : rangeItem
              )
            : [],
        };
      }
      return item;
    });
    
    // Ahora sí actualizas el estado
    setPrices(updatedPrices);
    
  };


  return (
    <div className={`overlay__modal_prices_creating_articles ${subModal == 'modal-prices' ? 'active' : ''}`}>
      <div className={`popup__modal_prices_creating_articles ${subModal == 'modal-prices' ? 'active' : ''}`}>
        <div className='header__modal'>
          <a href="#" className="btn-cerrar-popup__modal_prices_creating_articles" onClick={closeModal} >
            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
          </a>
          <p className='title__modals'>Precios</p>
        </div>
        <form className='article__modal_create_modal_price_container'>
          <div className='row row__one'>
            <div className='col-4'>
              <label className='label__general'>Precio</label>
              <div className='warning__general'><small >Este campo es obligatorio</small></div>
              <input name="price" className={`inputs__general`} type="number" value={inputs.price} onChange={handleInputs} placeholder='Ingresa el precio' />
            </div>
            <div className='col-4'>
              <label className='label__general'>Frente y vuelta</label>
              <div className='warning__general'><small >Este campo es obligatorio</small></div>
              <input name="roundPrice" className={`inputs__general`} type="number" value={inputs.roundPrice} onChange={handleInputs} placeholder='Frente y vuelta' />
            </div>
            <div className='col-4'>
              <Select dataSelects={dataSelects} instanceId="grouspusers" nameSelect={'Grupo de usuario'} />
            </div>
            <div className='col-12 row'>
              <div className='col-8 row ranges__prices_container'>
                <div className='col-10'>
                  <div className='select__container'>
                    <label className='label__general'>Rangos</label>
                    <div className={`select-btn__general`}>
                      <div className={`select-btn ${selectsRanges ? 'active' : ''}`} onClick={openselectsRanges}>
                        <div className='select__container_title'>
                          <p>{selectedRanges ? ranges.find((s: { id: number }) => s.id === selectedRanges.id)?.titulo : 'Selecciona'}</p>
                        </div>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                      </div>
                      <div className={`content ${selectsRanges ? 'active' : ''}`}>
                        <input
                          className='inputs__general'
                          type="text"
                          placeholder='Buscar...'
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <ul className={`options ${selectsRanges ? 'active' : ''}`} style={{ opacity: selectsRanges ? '1' : '0' }}>
                          {ranges?.map((company: any) => (
                            <li key={uuidv4()} onClick={() => handleRangesChange(company)}>
                              {company.titulo}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-2 d-flex justify-content-center align-items-end'>
                  <button type='button' className='btn__general-purple' onClick={additionalPrices}>Agregar</button>
                </div>
                <div className='col-12 table__modal_prices_extra_modal_container' >
                  <div>
                    {additionalsPrices ? (
                      <div className='table__numbers'>
                        <p className='text'>Total de rangos</p>
                        <div className='quantities_tables'>{additionalsPrices.length}</div>
                      </div>
                    ) : (
                      <p className='text'>No hay precios extra</p>
                    )}
                  </div>
                  <div className='table'>
                    <div className='table__head'>
                      <div className='thead'>
                        <div className='th'>
                          <p className=''>Rangos</p>
                        </div>
                        <div className='th'>
                          <p className=''>Orden</p>
                        </div>
                        <div className='th'>
                          <p className=''>Campo</p>
                        </div>
                        <div className='th'>
                          <p className=''>Agrupacion</p>
                        </div>
                        <div className='th'>
                        </div>
                      </div>
                    </div>
                    {additionalsPrices?.length > 0 ? (
                      <div className='table__body'>
                        {additionalsPrices.map((item: any, index: any) => (
                          <div className='tbody__container' key={index}>
                            <div className='tbody'>
                              <div className='td'>
                                {item?.rango_titulo}
                              </div>
                              <div className='td'>
                                <input className='inputs__general' type="text" placeholder='Orden' onChange={(e) => handleOrdenChange(e, index)} />
                              </div>
                              <div className='td'>
                                <select className='traditional__selector' onChange={(event) => handleTemplateChange(event, index)} value={item.variable_pc} >
                                  {templates && templates.map((item: any) => (
                                    <option key={item.id} value={item.id}>
                                      {item.nombre}
                                    </option>
                                  ))}
                                </select>

                              </div>
                              <div className='td'>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    value={item.agrupar}
                                    checked={item.agrupar}
                                    onChange={() => handleAgruparChange(index)}
                                  />
                                  <span className="slider"></span>
                                </label>
                              </div>
                              <div className='td'>
                                <button className='btn__delete_users' type='button' onClick={() => deletePrice(item)}>Eliminar</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className='text'>Cargando datos...</p>
                    )}
                  </div>
                </div>
              </div>
              <div className='col-4'>
                <div>
                  <label className='label__general'>Observaciones</label>
                  <div className='warning__general'><small >Este campo es obligatorio</small></div>
                  <textarea name="observations" className={`textarea__general`} value={inputs.observations} onChange={handleInputs} placeholder='Ingresa las observaciones' />
                </div>
                <div className='mt-4 d-flex justify-content-center'>
                  <button type='button' className='btn__general-purple' onClick={addPrices}>Agregar precio</button>
                </div>
              </div>

            </div>
          </div>

          <div className='row row__two'>
            <div className='col-5'>
              <Select dataSelects={dataSelectDe} instanceId="id_groupUserDe" nameSelect={'Del grupo'} />
            </div>
            <div className='col-5'>
              <Select dataSelects={dataSelectAl} instanceId="id_groupUserAl" nameSelect={'Al grupo'} />
            </div>
            <div className='col-2 d-flex align-items-end justify-content-center'>
              <button type='button' className='btn__general-purple' onClick={clonePrice}>Clonar</button>
            </div>
          </div>
          <div className='article__modal_prices_modal_container' >
            <div>
              {prices ? (
                <div className='table__numbers'>
                  <p className='text'>Total de precios</p>
                  <div className='quantities_tables'>{prices.length}</div>
                </div>
              ) : (
                ''
              )}
            </div>
            <div className='table__head'>
              <div className='thead'>
                <div className='th'>
                  <p className=''>Precio</p>
                </div>
                <div className='th'>
                  <p className=''>FyV</p>
                </div>
                <div className='th'>
                  <p>Grupos de usuarios</p>
                </div>
                <div className='th'>
                  <p>Condiciones</p>
                </div>
                <div className='th'>

                </div>
                <div className='th'>

                </div>
                <div className='th'>

                </div>
              </div>
            </div>
            {prices ? (
              <div className='table__body'>
                {prices.map((item: any, index: any) => (
                  <div className='tbody__container' key={index}>
                    <div className='tbody'>
                      <div className='td'>
                        <input className='inputs__general' type="text" value={item.precios} placeholder='Precio' onChange={(e) => handlePricesChange(e, index)} />
                      </div>
                      <div className='td'>
                        <input className='inputs__general' type="text" value={item.precios_fyv} placeholder='Frente y vuelta' onChange={(e) => handlePricesFVChange(e, index)} />
                      </div>
                      <div className='td'>
                        <select className='traditional__selector' onChange={(e) => handleUsersGroupsChange(e, index)} value={item.id_grupos_us} >
                          {usersGroups.map((item: any) => (
                            <option value={item.id}>
                              {item.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* <div className='td'>
                        <select className='traditional__selector' onChange={(event) => handleProveedorChange(event, index)} value={item.variable_pc} >
                          {usersGroups?.map((item: any) => (
                            <option key={item.id} value={item.id}>
                              {item.nombre}
                            </option>
                          ))}
                        </select>
                      </div> */}
                      <div className='td'>
                        <div className='precios_ext-modal_container'>

                          {/* <div className='precios_ext-table_head'> */}
                          <div className='precios_ext-thead'>
                            <div className='precios_ext-th'><p>Rangos</p></div>
                            <div className='precios_ext-th'><p>Campo</p></div>
                            <div className='precios_ext-th'><p>Orden</p></div>
                            <div className='precios_ext-th'><p>Agrupación</p></div>
                          </div>
                          {/* </div> */}
                          {item.precios_ext?.length > 0 ? (
                            <div className='precios_ext-table_body'>
                              {item.precios_ext?.map((item_two: any, index_two: any) => (
                                <div className='precios_ext-tbody_container' key={index_two}>
                                  <div className='precios_ext-tbody'>
                                    <div className='precios_ext-td'>
                                      {/* <p>{item_two.rango_titulo || item_two?.rango}</p> */}
                                      <select
                                        value={item_two.id_rangos || ""}
                                        onChange={(e) => handleChangeRange(index, index_two, e.target.value)}
                                      >
                                        {ranges.map((range:any, idx:number) => (
                                          <option key={idx} value={range.id}>
                                            {range.titulo}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className='precios_ext-td'>
                                      <select className='precios_ext-selector' onChange={(e) => handleTemplatesChange(e, index, index_two)} value={item_two.variable_pc}>
                                        {templates?.map((item: any) => (
                                          <option key={item.id} value={item.id}>{item.nombre}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className='precios_ext-td'>
                                      <input className='precios_ext-input' type="number" placeholder='Orden' value={item.orden} onChange={(e) => handleOrderChange(e, index, index_two)} />
                                    </div>
                                    <div className='precios_ext-td'>
                                      <label className="precios_ext-switch">
                                        <input type="checkbox" checked={item.agrupar} onChange={() => handleGroupChange(index, index_two)} />
                                        <span className="precios_ext-slider"></span>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className='precios_ext-text'>No hay precios que mostrar</p>
                          )}
                        </div>

                        <input className='inputs__general' type="text" value={item.observaciones} placeholder='Escribe tus observaciones' onChange={(e) => handlePricesComent(e, index)} />
                      </div>
                      <div className='td'>
                        <button className='btn__general-purple' type='button' onClick={() => seeHistory(item)}>Historial</button>
                      </div>
                      <div className='td'>
                        <button className='btn__general-danger' type='button' onClick={() => deleteFinalPrice(item)}>Eliminar</button>
                      </div>
                      {/* <div className='td'>
                        <svg onClick={() => dropDown(index)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 9l6 6l6 -6" /></svg>
                      </div> */}
                    </div>
                    <div className={`table_drop-down ${activeDrop == index ? 'active' : ''}`}>
                      <div className='article__modal_prices-ext_modal_container' >
                        <div>
                          {item.precios_ext ? (
                            <div className='table__numbers'>
                              <p className='text'>Total de rangos</p>
                              <div className='quantities_tables'>{item.precios_ext.length}</div>
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                        <div className='table__head'>
                          <div className='thead'>
                            <div className='th'>
                              <p className=''>Rangos</p>
                            </div>
                            <div className='th'>
                              <p className=''>Campo</p>
                            </div>
                            <div className='th'>
                              <p className=''>Order</p>
                            </div>
                            <div className='th'>
                              <p className=''>Agrupacion</p>
                            </div>
                          </div>
                        </div>
                        {item.precios_ext?.length > 0 ? (
                          <div className='table__body'>
                            {item.precios_ext?.map((item_two: any, index_two: any) => (
                              <div className='tbody__container' key={index_two}>
                                <div className='tbody'>
                                  <div className='td'>
                                    <div className='td'>
                                      <p>{item_two.rango_titulo || item_two?.rango}</p>
                                      {/* <div className='select__container'>
                                        <div className={`select-btn__general`}>
                                          <div className={`select-btn ${item_two.selected ? 'active' : ''}`} onClick={() => openselectsRangesTwo(index, index_two)}>
                                            <div className='select__container_title'>
                                              <p>{selectedRangesTwo ? ranges.find((s: { id: number }) => s.id === selectedRangesTwo)?.titulo : item_two.rango}</p>
                                            </div>
                                            <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                                          </div>
                                          <div className={`content ${item_two.selected ? 'active' : ''}`}>
                                            <input type="text" className='inputs__general' placeholder='Buscar...' />
                                            <ul className={`options ${item_two.selected ? 'active' : ''}`} style={{ opacity: item_two.selected ? '1' : '0' }}>
                                              {ranges?.map((company: any) => (
                                                <li key={company.id} onClick={() => handleRangesChangeTwo(company, index, index_two)}>
                                                  {company.titulo}
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        </div>
                                      </div> */}
                                    </div>
                                  </div>
                                  <div className='td'>
                                    <select className='traditional__selector' onChange={(e) => handleTemplatesChange(e, index, index_two)} value={item_two.variable_pc} >
                                      {templates && templates.map((item: any) => (
                                        <option key={item.id} value={item.id}>
                                          {item.nombre}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className='td'>
                                    <div className='td'>
                                      <input className='inputs__general' type="number" placeholder='Orden' value={item.orden} onChange={(e) => handleOrderChange(e, index, index_two)} />
                                    </div>
                                  </div>
                                  <div className='td'>
                                    <label className="switch">
                                      <input type="checkbox" checked={item.agrupar} onChange={() => handleGroupChange(index, index_two)} />
                                      <span className="slider"></span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className='text'>No hay precios que mostrar</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text'>No hay precios que mostrar</p>
            )}
          </div>
          <div className={`overlay__modal_prices_creating_articles ${modalSub == 'modal_sub_prices' ? 'active' : ''}`}>
            <div className={`popup__modal_prices_creating_articles ${modalSub == 'modal_sub_prices' ? 'active' : ''}`}>
              <History />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Prices
