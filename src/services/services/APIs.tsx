import ConfigurationAPIs from '../api/configurationAPIs';

const APIs = {
    login: async ( email: string, password: string, customPath?: string) => {
      const path = customPath || 'usuario_login';
      return ConfigurationAPIs.post(path, { email, password });
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

  createAreas: async (sucursal_id: number, nombre: string, produccion: boolean, id_usuario: number, customPath?: string) => {
    const path = customPath || 'area_create';
    return ConfigurationAPIs.post(path, {sucursal_id, nombre, produccion, id_usuario})
  },


  getAreas: async (customPath?: string) => {
    const path = customPath || 'areas_get';
    return ConfigurationAPIs.get(path)
  },

  apdateAreas:  async (id: number, sucursal_id: number, nombre: string, produccion: boolean, id_usuario: number, customPath?: string) => {
    const path = customPath || `area_update/${id}`;
    return ConfigurationAPIs.put(path, {id, sucursal_id, nombre, produccion, id_usuario})
  },

  getAreasXBranchOfficesXUsers: async (sucursal_id: number, user_id: number, customPath?: string) => {
    const path = customPath || `get_area_x_sucursal/${sucursal_id}/${user_id}`
    return ConfigurationAPIs.get(path)
  },

  

  // Series

  getSeriesXUser: async (id: number, customPath?: string) => {
    const path = customPath ||  `series_get/${id}`;
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

  getUsers: async (nombre: string, id_usuario: number, id_usuario_consulta: number, light: boolean, id_sucursal: number, customPath?: string) => { 
    const path = customPath || 'usuario_get'
    // Enviar la solicitud POST con el nombre como parámetro si está presente
    return ConfigurationAPIs.post(path, {nombre, id_usuario, id_usuario_consulta, light, id_sucursal});
  },

  putUsers: async (user_id: number, sucursal_id: number, nombre: string, email: string, password: string, tipo_us: number, sucursales_nuevas: any[], sucursales_eliminar: any[], areas_nuevas: any[], areas_eliminar: any[], subordinados_nuevos: any[], subordinados_eliminar: any[], grupos_nuevos: any[], grupos_eliminar: any[], customPath?: string) => {
    const path = customPath || `usuario_update/${user_id}`
    return ConfigurationAPIs.put(path, {user_id, sucursal_id,  nombre, email, password, tipo_us, sucursales_nuevas, sucursales_eliminar, areas_nuevas, areas_eliminar, subordinados_nuevos, subordinados_eliminar, grupos_nuevos, grupos_eliminar})
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

  getArticlesDifferential: async (data: any, customPath?: string) => {
    const path = customPath || `get_articulos_diferenciales/${data.id_proveedor}/${data.id_sucursal}/${data.id_usuario}`;
    return ConfigurationAPIs.post(path, data)
  },


  updateArticles: async (data: any, customPath?: string) => {
    const path = customPath || `update_articulo/${data.id}`;
    return ConfigurationAPIs.put(path, data)
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

  updateStore: async (data: any, data_ext: any, customPath?: string) => {
    const path = customPath || `almacen_update/${data.id}`;
    return ConfigurationAPIs.put(path, { data, data_ext });
  },



  // VENTAS 

   //  Requisision

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

  // updateRequisition: async (data: any, customPath?: string) => {
  //   const path = customPath || 'updt_req_for_cancel_or_active';
  //   return ConfigurationAPIs.post(path, data)
  // },

  pdtRequisition: async (id: number, customPath?: string) => {
    const path = customPath || `pdf_requisicion/${id}`
    return ConfigurationAPIs.get(path)
  },

  // Orden de compra
  createPurchaseOrders: async (id_usuario_crea: number, id_usuario_autoriza: number, id_sucursal: number, fecha_creacion: Date,  fecha_llegada: Date,  status: number, tipo: number,  cotizacion: string, factura: string, comentarios: string, id_proveedor_flete: number, costo_flete: number, comentarios_flete: string, sumar_flete: boolean, documento_anterior: string, documento_siguiente: string,  conceptos: any[], customPath?: string) => {
    const path = customPath || 'create_orden_compra'
    return ConfigurationAPIs.post(path, {id_usuario_crea, id_usuario_autoriza, id_sucursal, fecha_creacion, fecha_llegada, status, tipo, cotizacion, factura, comentarios, id_proveedor_flete, costo_flete, comentarios_flete, sumar_flete, documento_anterior, documento_siguiente, conceptos})
  },

  getPurchaseOrders: async (folio: number, id_serie: number, id_sucursal: number, id_usuario: number, id_area: number, tipo: number, desde: Date, hasta: Date, status: number, customPath?: string) => {
    const path = customPath || 'get_orden_compra'
    return ConfigurationAPIs.post(path, {folio, id_serie, id_sucursal, id_usuario, id_area, tipo, desde, hasta, status})
  },

  updatePurchaseOrders: async (id: number, id_usuario_crea: number, id_usuario_autoriza: number, id_sucursal: number, fecha_creacion: Date, fecha_llegada: Date,  status: number, tipo: number,  cotizacion: string, factura: string, comentarios: string, id_proveedor_flete: number, costo_flete: number, comentarios_flete: string, sumar_flete: boolean,  conceptos: any[], conceptos_elim: any[], customPath?: string) => {
    const path = customPath || 'update_orden_compra'
    return ConfigurationAPIs.post(path, {id, id_usuario_crea, id_usuario_autoriza, id_sucursal, fecha_creacion, fecha_llegada, status, tipo, cotizacion, factura, comentarios, id_proveedor_flete, costo_flete, comentarios_flete, sumar_flete, conceptos, conceptos_elim})
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

  getTickets: async (id_usuario: number, id_sucursal: number, desde: Date, hasta: Date, id_serie: number, status: number, folio: number, customPath?: string) => {
    const path = customPath || 'entrada_almacen/get'
    return ConfigurationAPIs.post(path, {id_usuario, id_sucursal, desde, hasta, id_serie, status, folio})
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
}




export default APIs;



