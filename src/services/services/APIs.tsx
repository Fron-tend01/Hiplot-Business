import ConfigurationAPIs from '../api/configurationAPIs';

const APIs = {
    login: async ( email: string, password: string, customPath?: string) => {
      const path = customPath || 'usuario_login';
      return ConfigurationAPIs.post(path, { email, password });
    },

    getUsersGeneral: async ( data: any, customPath?: string) => {
      const path = customPath || 'usuario_get';
      return ConfigurationAPIs.post(path, data);
    },

  // Empresas 

  createCompanies: async (razon_social: string, nombre_comercial: string, id_usuario: number, customPath?: string) => {
    const path = customPath || 'empresa_create';
    return ConfigurationAPIs.post(path, { razon_social, nombre_comercial, id_usuario});
  },

  getCompaniesXUsers: async (id: number, customPath?: string) => {
    const path = customPath || `get_empresas_x_usuario/${id}`;
    return ConfigurationAPIs.get(path);
  },

  putUpdateCompanies: async (id: number, razon_social: string, nombre_comercial: string, id_usuario: number, customPath?: string) => {
    const path = customPath || `empresa_update/${id}`;
    return ConfigurationAPIs.put(path, { id, razon_social, nombre_comercial, id_usuario});
  },

  // Sucursales
  
  getBranchOfficesXCompanies: async ( empresa_id : number, id_usuario : number, customPath?: string) => {
    const path = customPath || `get_sucursal_x_empresa/${empresa_id}/${id_usuario}`
    return ConfigurationAPIs.get(path)
  },

  updateBranchOffices: async (id: number, nombre: string, direccion: string, contacto: string, empresa_id: number, id_usuario: number, customPath?: string) => {
    const path = customPath || `sucursal_update/${id}`
    return ConfigurationAPIs.put(path, {id, nombre, direccion, contacto, empresa_id, id_usuario })
  },


  createBrachOffices: async (nombre: string, direccion: string, contacto: string, empresa_id: number, customPath?: string ) => {
    const path = customPath || 'sucursal_create';
    return ConfigurationAPIs.post(path, {nombre, direccion, contacto, empresa_id})
  },

  
  // Areas

  createAreas: async (sucursal_id: number, nombre: string, produccion: boolean, id_usuario: number, paf: boolean, customPath?: string) => {
    const path = customPath || 'area_create';
    return ConfigurationAPIs.post(path, {sucursal_id, nombre, produccion, id_usuario,paf})
  },


  getAreas: async (customPath?: string) => {
    const path = customPath || 'areas_get';
    return ConfigurationAPIs.get(path)
  },

  apdateAreas:  async (id: number, sucursal_id: number, nombre: string, produccion: boolean, id_usuario: number,paf: boolean, customPath?: string) => {
    const path = customPath || `area_update/${id}`;
    return ConfigurationAPIs.put(path, {id, sucursal_id, nombre, produccion, id_usuario,paf})
  },

  getAreasXBranchOfficesXUsers: async (sucursal_id: number, user_id: number, customPath?: string) => {
    const path = customPath || `get_area_x_sucursal/${sucursal_id}/${user_id}`
    return ConfigurationAPIs.get(path)
  },

  

  // Series

  getSeriesXUser: async (data: any, customPath?: string) => {
    const path = customPath ||  `series_get/${data.id}/${data.tipo_ducumento}`;
    return ConfigurationAPIs.get(path)
  },

  createSeries: async (sucursal_id: number, nombre: string, tipo: number,   customPath?: string) => {
    const path = customPath || 'crear_serie';
    return ConfigurationAPIs.post(path, {sucursal_id, nombre, tipo})
  },

  updateSeries: async (id: string, sucursal_id: number, nombre: string, tipo: number, customPath?: string) => {
    const path = customPath || `update_serie/${id}`
    return ConfigurationAPIs.put(path, {id, sucursal_id, nombre, tipo})
  },



   // Grupos de usuarios

   createUserGroups : async (nombre: string, id_empresa: number, id_usuario: number, customPath?: string) => {
    const path = customPath || 'usuario_grupos'
    return ConfigurationAPIs.post(path, {nombre, id_empresa, id_usuario})

  },

   getUserGroups: async (id: number, customPath?: string) => {
    const path = customPath || `usuario_grupos_get/${id}`;
    return ConfigurationAPIs.get(path)
  },

  updateUserGroups: async (id: number ,nombre: string, id_empresa: number, id_usuario: string, customPath?: string) => {
    const path = customPath || `usuario_grupo_update/${id}`
    return ConfigurationAPIs.put(path, {id, nombre, id_empresa, id_usuario})
  },




  // Tipos de usuarios 
  createTypesUsers: async (data: {nombre: string, id_empresa: number, id_usuario: number}, permisos: any[], customPath?: string) => {
    const path = customPath || 'usuario_tipo';
    return ConfigurationAPIs.post(path, {data, permisos})
  },
 
  getTypesUsers: async (id: number, customPath?: string) => {
    const path = customPath || `usuario_tipo_get/${id}`;
    return ConfigurationAPIs.get(path)
  },

  getUsersTypesStructure: async (customPath?: string) => {
    const path = customPath || 'usuario_tipo_structura_permisos';
    return ConfigurationAPIs.post(path, customPath)
  },
  
  updateTypesUsers: async (id: number, data: {nombre: string, id_empresa: number, id_usuario: number}, data_permisos: { arr1_nuevas: any[], arr1_eliminar: any[]}, customPath?: string) => {
    const path = customPath || `usuario_tipo_update/${id}`;
    return ConfigurationAPIs.put(path, { id, data, data_permisos })
  },


  getTypesUsersXCompanies: async (id: number, customPath?: string) => {
    const path = customPath || `usuario_tipo_x_empresa_get/${id}`
    return ConfigurationAPIs.get(path); 
  },

  // Usuarios


  createUsers: async (data_user: {sucursal_id: number, nombre: string, email: string, password: string, tipo_us: number, id_usuario_crea: number}, data_ext: {sucursales_nuevas: any[], sucursales_eliminar: any[], areas_nuevas: any[], areas_eliminar: any[], subordinados_nuevos: any[], subordinados_eliminar: any[], grupos_nuevos: any[], grupos_eliminar: any[] }, customPath?: string ) => {
    const path = customPath || 'usuario_create';
    return ConfigurationAPIs.post(path, {data_user, data_ext})
  },

  getUsers: async (data: any, customPath?: string) => { 
    const path = customPath || 'usuario_get'
    // Enviar la solicitud POST con el nombre como parámetro si está presente
    return ConfigurationAPIs.post(path, data);
  },

  putUsers: async (user_id: number, sucursal_id: number, nombre: string, email: string, password: string, 
    tipo_us: number, sucursales_nuevas: any[], sucursales_eliminar: any[], areas_nuevas: any[], areas_eliminar: any[], 
    subordinados_nuevos: any[], subordinados_eliminar: any[], grupos_nuevos: any[], grupos_eliminar: any[],usuarios_comercial: any[], usuarios_comercial_eliminar: any[], customPath?: string) => {
    const path = customPath || `usuario_update/${user_id}`
    return ConfigurationAPIs.put(path, {user_id, sucursal_id,  nombre, email, password, tipo_us, sucursales_nuevas, 
      sucursales_eliminar, areas_nuevas, areas_eliminar, subordinados_nuevos, subordinados_eliminar, grupos_nuevos, grupos_eliminar,usuarios_comercial,usuarios_comercial_eliminar})
  },

  
  // Crear articulo 

  createArticles: async (data: any, customPath?: string) => {
    const path = customPath || 'articulo_create';
    return ConfigurationAPIs.post(path, data)
  },

  getArticles: async (data: any, customPath?: string) => {
    const path = customPath || 'articulos_get';
    return ConfigurationAPIs.post(path, data)
  },
  getArticlesForVendedor: async (data: any, customPath?: string) => {
    const path = customPath || 'articulos_get_for_vendedor';
    return ConfigurationAPIs.post(path, data)
  },
  getArticlesDifferential: async (data: any, customPath?: string) => {
    const path = customPath || `get_articulos_diferenciales/${data.id_proveedor}/${data.id_sucursal}/${data.id_usuario}`;
    return ConfigurationAPIs.post(path, data)
  },


  updateArticles: async (data: any) => {
    const path = `update_articulo/${data.id}`;
    return ConfigurationAPIs.put(path, data)
  },

  cloneArticles: async (data: any) => {
    const path = `clonar_articulo`;
    return ConfigurationAPIs.post(path, data)
  },

  cloneArticlesPrice: async (data: any) => {
    const path = `clonar_precios`;
    return ConfigurationAPIs.post(path, data)
  },


  // Familias

  createFamilies: async (data: {nombre: string}, data_ext: {arr1_nuevas: any[], arr1_eliminar: any[]}, customPath?: string) => {
    const path = customPath || 'familia_create';
    return ConfigurationAPIs.post(path, {data, data_ext})
  },
  
  
  getFamilies: async (id: number, customPath?: string) => {
    const path = customPath || `familia_get/${id}`
    return ConfigurationAPIs.get(path)
  },


  getSections: async (id: number, customPath?: string) => {
    const path = customPath || `pagina_cliente/getsecciones/${id}`
    return ConfigurationAPIs.get(path)
  },




  
  // Proveedores 

  createSuppliers: async (data: any, customPath?: string) => {
    const path = customPath || 'proveedores_create';
    return ConfigurationAPIs.post(path, data)
  },

  getSuppliers: async (data: any, customPath?: string) => {
    const path = customPath || 'proveedores_get';
    return ConfigurationAPIs.post(path, data)
  },

  updateSuppliers: async (data: any, customPath?: string) => {
    const path = customPath || `proveedores_update/${data.id}`;
    return ConfigurationAPIs.put(path, data)
  },
  
  // Plantillas

  crateTemplates: async (data: {nombre: string, id_empresa: number}, data_ext: {nombre: string, tipo: string, id_plantilla: number}, customPath?: string) => {
    const path = customPath || 'create_plantillas_art';
    return ConfigurationAPIs.post(path, {data, data_ext})
  },

  getTemplates: async (id: number, customPath?: string) => {
    const path = customPath || `get_plantillas_art/${id}/`
    return ConfigurationAPIs.get(path)
  },

  
  getTemplatesxFields: async () => {
    const path = `get_campos_plantillas/get`
    return ConfigurationAPIs.get(path)
  },



//////////////////////////////////Rangos//////////////////////////////////////////

createRanges: async (data: any, customPath?: string) => {
  const path = customPath || 'rangos_create';
  return ConfigurationAPIs.post(path, data)
},


getRanges: async (data: any, customPath?: string) => {
  const path = customPath || 'rangos_get'
  return ConfigurationAPIs.post(path, data)
},




//////////////////////////////////Clientes//////////////////////////////////////////

createClients: async (data: any, customPath?: string) => {
  const path = customPath || 'cliente_create';
  return ConfigurationAPIs.post(path, data)
},


getClients: async (data: any, customPath?: string) => {
  const path = customPath || 'clientes_get'
  return ConfigurationAPIs.post(path, data)
},

updateClients: async (data: any, customPath?: string) => {
  const path = customPath || `cliente_update`;
  return ConfigurationAPIs.put(path, data);
},



  updateTemplates: async (id: number, data: {nombre: string, id_empresa: number}, data_nuevo: [{nombre: string, tipo: string, id_plantilla: number}], data_eliminar: any[],  customPath?: string) => {
    const path = customPath || `update_plantilla_art/${id}`
    return ConfigurationAPIs.put(path, {id, data, data_nuevo, data_eliminar})
  },

  // SERVICIOS DEL STORE

  //almacen

  createStore: async (data: { nombre: string }, data_ext: { sucursales_nuevas: any[]; sucursales_eliminar: any[] }, customPath?: string) => {
    const path = customPath || 'almacen_create';
    return ConfigurationAPIs.post(path, { data, data_ext });
  },

  getStore: async (id: number, customPath?: string ) => {
    const path = customPath || `almacen_get/${id}`;
    return ConfigurationAPIs.get(path)
  },

  getStoreXSuc: async (id: number, customPath?: string ) => {
    const path = customPath || `almacen_getxsuc/${id}`;
    return ConfigurationAPIs.get(path)
  },


  updateStore: async (data: any, data_ext: any, customPath?: string) => {
    const path = customPath || `almacen_update/${data.id}`;
    return ConfigurationAPIs.put(path, { data, data_ext });
  },

  getStorePDF: async (data: any) => {
    const path = `pdf_traspaso/${data.id}`;
    return ConfigurationAPIs.get(path);
  },


  // VENTAS 

   //  Requisicion

   createRequisition: async (data: any, customPath?: string) => {
    const path = customPath || 'create_requisicion';
    return ConfigurationAPIs.post(path, data)
  },

  getRequisition: async (data: any, customPath?: string) => {
    const path = customPath || 'get_requisicion';
    return ConfigurationAPIs.post(path, data)
  },

  updateRequisition: async (data: any, customPath?: string) => {
    const path = customPath || 'update_requisiciones';
    return ConfigurationAPIs.post(path, data)
  },

  updateStatusRequisition: async (data: any, customPath?: string) => {
    const path = customPath || 'updt_req_for_cancel_or_active';
    return ConfigurationAPIs.post(path, data)
  },

  pdtRequisition: async (id: number, customPath?: string) => {
    const path = customPath || `pdf_requisicion/${id}`
    return ConfigurationAPIs.get(path)
  },


  // Orden de compra
  createPurchaseOrders: async (data: any, customPath?: string) => {
    const path = customPath || 'create_orden_compra'
    return ConfigurationAPIs.post(path, data)
  },

  getPurchaseOrders: async (data: any, customPath?: string) => {
    const path = customPath || 'get_orden_compra'
    return ConfigurationAPIs.post(path, data)
  },

  updatePurchaseOrders: async (data: any, customPath?: string) => {
    const path = customPath || 'update_orden_compra'
    return ConfigurationAPIs.post(path, data)
  },

  getPdfPurchaseOrders: async (id: number, customPath?: string) => {
    const path = customPath || `pdf_ov/${id}`
    return ConfigurationAPIs.get(path)
  },

  updateStatusPurchaseOrder: async (data: any, customPath?: string) => {
    const path = customPath || 'update_orden_compra_status'
    return ConfigurationAPIs.post(path, data)
  },


  // permisos de vistas
 
  getViews: async (id_usuario : number, vista: string,  customPath?: string) => {
    const path = customPath || `get_permisos_x_vista/${id_usuario}/${vista}`
    return ConfigurationAPIs.get(path)
  },

  getViewsXUsers: async (id_usuario : number, customPath?: string) => {
    const path = customPath || `get_vista_x_permiso/${id_usuario}`
    return ConfigurationAPIs.get(path)
  },
 
  // Entradas
  // Orden de compra
  createTickets: async (id_sucursal: number, id_usuario_crea: number, comentarios: string, conceptos: any[], customPath?: string) => {
    const path = customPath || 'entrada_almacen/create'
    return ConfigurationAPIs.post(path, {id_sucursal, id_usuario_crea, comentarios, conceptos})
  },

  getTickets: async (data: any, customPath?: string) => {
    const path = customPath || 'entrada_almacen/get'
    return ConfigurationAPIs.post(path, data)
  },

  getPDFTickets: async (id: number, customPath?: string) => {
    const path = customPath || `pdf_entrada/${id}`
    return ConfigurationAPIs.get(path)
  },

  getExcelTickets: async (id: number,id_usuario: number, id_sucursal: number, desde: Date, hasta: Date, id_serie: number, status: number, folio: number, customPath?: string) => {
    const path = customPath || 'excel_entrada'
    return ConfigurationAPIs.post(path, {id, id_sucursal, id_usuario, desde, hasta, id_serie, status, folio})
  },

  //////////////////////////////////////////// Pedidos ///////////////////////////////////////////


  createOrders: async (data: any, customPath?: string) => {
    const path = customPath || 'pedido_almacen/create'
    return ConfigurationAPIs.post(path, data)
  },

  getOrdedrs: async (data: any, customPath?: string ) => {
    const path = customPath || 'pedido_almacen/get';
    return ConfigurationAPIs.post(path, data)
  },

  updateOrders: async (data: any, customPath?: string ) => {
    const path = customPath || 'update_pedido';
    return ConfigurationAPIs.post(path, data)
  },

  updateModeOrders: async (data: any, customPath?: string ) => {
    const path = customPath || 'pedido_almacen/updateCancelorActivePedido';
    return ConfigurationAPIs.post(path, data)
  },

  updateModeConceptsOrders: async (data: any, customPath?: string ) => {
    const path = customPath || 'pedido_almacen/updateCancelorActivePedidoConcepto';
    return ConfigurationAPIs.post(path, data)
  },

 

  getPdfOrders: async (id: number, customPath?: string ) => {
    const path = customPath || `pdf_pedido/${id}`;
    return ConfigurationAPIs.post(path, id)
  },


  
  //////////////////////////////// Salida almacen ///////////////////////////////////////

  createWarehouseExit: async (data: any, customPath?: string) => {
    const path = customPath || 'salida_almacen/create';
    return ConfigurationAPIs.post(path, data)
  },

  getWarehouseExit: async (data: any ,customPath?: string) => {
    const path = customPath || 'salida_almacen/get';
    return ConfigurationAPIs.post(path, data)
  },

  // updateUnits: async (data: any, customPath?: string) => {
  //   const path = customPath || 'update_unidad';
  //   return ConfigurationAPIs.post(path, data)
  // },


///////////////////////////////////////Traspasos/////////////////////////////////////////////////


createTransfers: async (data: any, customPath?: string) => {
  const path = customPath || 'traspaso_almacen/create';
  return ConfigurationAPIs.post(path, data)
},

getTransfers: async (data: any, customPath?: string) => {
  const path = customPath || 'traspaso_almacen/get';
  return ConfigurationAPIs.post(path, data)
},




///////////////////////////// Tipo de cobro /////////////////////////////////////

createTypeOfPayments: async (data: any, customPath?: string) => {
  const path = customPath || 'tipo_cobro/create';
  return ConfigurationAPIs.post(path, data)
},

getTypeOfPayments: async (customPath?: string) => {
  const path = customPath || 'tipo_cobro/get';
  return ConfigurationAPIs.get(path)
},

updateTypeOfPayment: async (data: any, customPath?: string) => {
  const path = customPath || 'tipo_cobro/update';
  return ConfigurationAPIs.put(path, data);
},


///////////////////////////// Cotizacion /////////////////////////////////////

createQuotation: async (data: any, customPath?: string) => {
  const path = customPath || 'cotizaciones/create';
  return ConfigurationAPIs.post(path, data)
},

updateQuotation: async (data: any, customPath?: string) => {
  const path = customPath || 'update_cotizacion';
  return ConfigurationAPIs.post(path, data)
},



getQuotation: async (data: any, customPath?: string) => {
  const path = customPath || 'cotizaciones/get';
  return ConfigurationAPIs.post(path, data)
},





///////////////////////////// Tiempos de entrega /////////////////////////////////////

getDeliveryTimes: async (data: any, customPath?: string) => {
  const path = customPath || 'tentrega_get';
  return ConfigurationAPIs.post(path, data)
},





  // Editor de pagina web

  getWebPage: async (id: number, customPath?: string) => {
    const path = customPath || `pagina_cliente/get/${id}`;
    return ConfigurationAPIs.get(path)
  },

  HeaderAndFooter: async (id_sucursal: number, customPath?: string) => {
    const path = customPath || `pagina_cliente/getHeaderyFooter/${id_sucursal}`;
    return ConfigurationAPIs.get(path)
  },

  createContenedor: async (data: any, customPath?: string) => {
    const path = customPath || 'pagina_cliente/addContenedor';
    return ConfigurationAPIs.post(path, data)
  },

  updateContenedor: async (data: any, customPath?: string) => {
    const path = customPath || 'pagina_cliente/updatePaginaContenedor';
    return ConfigurationAPIs.post(path, data)
  },

  deleteContenedor: async (id: string, customPath?: string) => {
    const path = customPath || `pagina_cliente/removeContenedor?id=${id}`;
    return ConfigurationAPIs.post(path, id)
  },

  getContenedor: async (id_seccion : number, customPath?: string) => {
    const path = customPath || `pagina_cliente/getContenedor/${id_seccion}`;
    return ConfigurationAPIs.get(path)
  },

  updateContenedorOrder: async (data : any, customPath?: string) => {
    const path = customPath || 'pagina_cliente/updateContenedorOrden';
    return ConfigurationAPIs.post(path, data)
  },

  
  getSectionsWeb: async (id_sucursal  : number, customPath?: string) => {
    const path = customPath || `pagina_cliente/getsecciones/${id_sucursal}`;
    return ConfigurationAPIs.get(path)
  },

   
  createSectionsWeb: async (data: any, customPath?: string) => {
    const path = customPath || 'pagina_cliente/addSeccion';
    return ConfigurationAPIs.post(path, data)
  },

  deleteSectionsWeb: async (id  : number, customPath?: string) => {
    const path = customPath || `pagina_cliente/removeSeccion?id=${id}`;
    return ConfigurationAPIs.post(path, id)
  },
  


  updateWeb: async (data: any, customPath?: string) => {
    const path = customPath || 'pagina_cliente/updatePagina';
    return ConfigurationAPIs.post(path, data)
  },


  updateSectionWeb: async (data: any, customPath?: string) => {
    const path = customPath || 'pagina_cliente/updatePaginaSeccion';
    return ConfigurationAPIs.post(path, data)
  },

  createCategoryWeb: async (data: any, customPath?: string) => {
    const path = customPath || 'pagina_cliente/addCategoria';
    return ConfigurationAPIs.post(path, data)
  },

  updateCategoryWeb: async (data: any, customPath?: string) => {
    const path = customPath || 'pagina_cliente/updatePaginaCategoria';
    return ConfigurationAPIs.post(path, data)
  },

  deleteCategoryWeb: async (id: number, customPath?: string) => {
    const path = customPath || `pagina_cliente/removeCategoria?id=${id}`;
    return ConfigurationAPIs.post(path, id)
  },

 

 

  createProductsWeb: async (data: any, customPath?: string) => {
    const path = customPath || 'pagina_cliente/addProducto';
    return ConfigurationAPIs.post(path, data)
  },

  updateProductsWeb: async (data: any, customPath?: string) => {
    const path = customPath || 'pagina_cliente/updatePaginaProductos';
    return ConfigurationAPIs.post(path, data)
  },

  deleteProductsWeb: async (id: number, customPath?: string) => {
    const path = customPath || `pagina_cliente/removeProducto?id=/${id}`;
    return ConfigurationAPIs.post(path, id)
  },

  updateFooterWeb: async (data: any, customPath?: string) => {
    const path = customPath || 'pagina_cliente/updatePaginaFooter';
    return ConfigurationAPIs.post(path, data)
  },


    //////////////////////////////// Combinaciones ///////////////////////////////////////

    // createUnits: async (data: any, customPath?: string) => {
    //   const path = customPath || 'unidad/create';
    //   return ConfigurationAPIs.post(path, data)
    // },
  
    getCombinations: async (customPath?: string) => {
      const path = customPath || 'get_combinacion/get';
      return ConfigurationAPIs.get(path)
    },
  
    // updateUnits: async (data: any, customPath?: string) => {
    //   const path = customPath || 'update_unidad';
    //   return ConfigurationAPIs.post(path, data)
    // },

////////////////////////////////////// Ficha ///////////////////////////////////////////

getTotalPrice: async (data: any, customPath?: string) => {
  const path = customPath || 'get_total';
  return ConfigurationAPIs.post(path, data)
},

  ////////////////////////////////Unidades ///////////////////////////////////////

  createUnits: async (data: any, customPath?: string) => {
    const path = customPath || 'unidad/create';
    return ConfigurationAPIs.post(path, data)
  },

  getUnits: async (customPath?: string) => {
    const path = customPath || 'get_unidad/get';
    return ConfigurationAPIs.get(path)
  },

  updateUnits: async (data: any, customPath?: string) => {
    const path = customPath || 'update_unidad';
    return ConfigurationAPIs.post(path, data)
  },





  //////////////////////////////// Orden de venta ///////////////////////////////////////
  createSaleOrder: async (data: any, customPath?: string) => {
    const path = customPath || 'create_orden_venta';
    return ConfigurationAPIs.post(path, data)
  },
  createSaleOrderRemastered: async (data: any, customPath?: string) => {
    const path = customPath || 'create_ov_remastered';
    return ConfigurationAPIs.post(path, data)
  },

  updateCarritoConcepto: async (data: any, customPath?: string) => {
    const path = customPath || 'update_carrito_concepto';
    return ConfigurationAPIs.post(path, data)
  },

  
  getSaleOrders: async (data: any, customPath?: any) => {
    const path = customPath || 'get_orden_venta';
    return ConfigurationAPIs.post(path, data)
  },

  getCalculateUrgency: async (data: any, customPath?: any) => {
    const path = customPath || 'calcular_urgencia';
    return ConfigurationAPIs.post(path, data)
  },


  getSaleOrderStatus: async (customPath?: any) => {
    const path = customPath || 'update_orden_compra_status';
    return ConfigurationAPIs.get(path)
  },
  
  createSaleOrderProduction: async (data: any, customPath?: any) => {
    const path = customPath || 'create_orden_produccion';
    return ConfigurationAPIs.post(path, data)
  },

  updateOvConcepto: async (data: any, customPath?: any) => {
    const path = customPath || 'update_ov_concepto';
    return ConfigurationAPIs.post(path, data)
  },

  getTicketOV: async (id: any, customPath?: any) => {
    const path = customPath || `api_dev/pdf_ov/${id}`;
    return ConfigurationAPIs.get (path)
  },

  getDeleveryTime: async (customPath?: any) => {
    const path = customPath || `api_dev/calcular_tiempo_entrega`;
    return ConfigurationAPIs.get (path)
  },

  calculateSalesDeliveryDime: async (data: any, customPath?: any) => {
    const path = customPath || `calcular_tiempo_entrega`;
    return ConfigurationAPIs.post(path, data)
  },

  updateConceptsPersonalizedOrder: async (data: any, customPath?: string) => {
    const path = customPath || 'conceptos_personalizados/update';
    return ConfigurationAPIs.put(path, data)
  },

  cancelConceptsOrder: async (data: any, customPath?: string) => {
    const path = customPath || `cancelar_orden_venta_concepto/${data.id}/${data.id_usuario}`;
    return ConfigurationAPIs.put(path, data)
  },

  updateConceptPersonalized: async (data: any, customPath?: string) => {
    const path = customPath || `conceptos_personalizados/update`;
    return ConfigurationAPIs.put(path, data)
  },





  


  
  //////////////////////////////// Orden de venta ///////////////////////////////////////
  createProductionOrders: async (data: any, customPath?: string) => {
    const path = customPath || 'create_orden_produccion';
    return ConfigurationAPIs.post(path, data)
  },


  


  
  // getSaleOrders: async (data: any, customPath?: any) => {
  //   const path = customPath || 'get_orden_venta';
  //   return ConfigurationAPIs.post(path, data)
  // },

  //////////////////////////////// Produccion ///////////////////////////////////////
  getProoductionOrders: async (data: any, customPath?: string) => {
    const path = customPath || 'get_orden_produccion';
    return ConfigurationAPIs.post(path, data)
  },


  getProoductionPDF: async (id: number, customPath?: string) => {
    const path = customPath || `api_dev/pdf_op/${id}`;
    return ConfigurationAPIs.get(path)
  },


  sendAreaProduction: async (data: any, customPath?: string) => {
    const path = customPath || `enviar_op_a_otra_area`;
    return ConfigurationAPIs.post(path, data)
  },

  sendAreaConceptoProduction: async (data: any, customPath?: string) => {
    const path = customPath || `enviar_concepto_a_otra_area`;
    return ConfigurationAPIs.post(path, data)
  },



  
  // getSaleOrders: async (data: any, customPath?: any) => {
  //   const path = customPath || 'get_orden_venta';
  //   return ConfigurationAPIs.post(path, data)
  // },


    //////////////////////////////// Facturacion ///////////////////////////////////////
    createInvoice: async (data: any, customPath?: string) => {
      const path = customPath || 'create_factura';
      return ConfigurationAPIs.post(path, data)
    },

    updateInvoice: async (data: any, customPath?: string) => {
      const path = customPath || 'update_factura';
      return ConfigurationAPIs.post(path, data)
    },

 
   //////////////////////////////// General ///////////////////////////////////////
   getKeySat: async (data: any) => {
    const path =  'getClavesProdServ';
    return ConfigurationAPIs.post(path, data)
  },
  


  ////////////////////////////////GRAL ///////////////////////////////////////
  CreateAny: async (data: any, ruta: string) => {
    const path = ruta;
    return ConfigurationAPIs.post(path, data)
  },
  CreateAnyPut: async (data: any, ruta: string) => {
    const path = ruta;
    return ConfigurationAPIs.put(path, data)
  },
  GetAny: async (ruta: string) => {
    const path = ruta;
    return ConfigurationAPIs.get(path)
  },
  deleteAny: async (ruta: string) => {
    const path = ruta;
    return ConfigurationAPIs.delete(path)
  },
  getTotalPriceWSignal: async (dataArticle: any, options: { signal?: AbortSignal } = {}) => {
    const response = await fetch("http://hiplot.dyndns.org:84/api_dev/get_total", {
      method: "POST",
      body: JSON.stringify(dataArticle),
      headers: { "Content-Type": "application/json" },
      signal: options.signal, // Pasa la señal al request
    });
  
    return response.json();
  },
  getArticleWSignal: async (dataArticle: any, options: { signal?: AbortSignal } = {}) => {
    const response = await fetch("http://hiplot.dyndns.org:84/api_dev/articulos_get", {
      method: "POST",
      body: JSON.stringify(dataArticle),
      headers: { "Content-Type": "application/json" },
      signal: options.signal, // Pasa la señal al request
    });
  
    return response.json();
  },
}




export default APIs;



