// import React from 'react'

// const ByOP = () => {
    
//   return (
//     <div className='conatiner__by-request'>
//     <div className='row__one'>
//         <div className='select__container'>
//             <label className='label__general'>Empresas</label>
//             <div className='select-btn__general'>
//                 <div className={`select-btn ${selectByRequestCompanies ? 'active' : ''}`} onClick={openSelectByRequestCompanies}>
//                     <div className='select__container_title'>
//                         <p>{selectedByRequestCompany ? companiesXUsers.find((s: {id: number}) => s.id === selectedByRequestCompany)?.razon_social : 'Selecciona'}</p>
//                     </div>
//                     <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
//                 </div>
//                 <div className={`content ${selectByRequestCompanies ? 'active' : ''}`}>
//                     <ul className={`options ${selectByRequestCompanies ? 'active' : ''}`} style={{ opacity: selectByRequestCompanies ? '1' : '0' }}>
//                     {companiesXUsers && companiesXUsers.map((company: any) => (
//                         <li key={company.id} onClick={() => handleByRequestCompaniesChange(company)}>
//                         {company.razon_social}
//                         </li>
//                     ))}
//                     </ul>
//                 </div>
//             </div>
//         </div>
//         <div className='select__container'>
//             <label className='label__general'>Sucursales</label>
//             <div className='select-btn__general'>
//                 <div className={`select-btn ${selectByRequestBranchOffices ? 'active' : ''}`} onClick={openSelectByRequestBranchOffices}>
//                     <div className='select__container_title'>
//                         <p>{selectedByRequestBranchOffice ? filterByRequestBranchOffice.find((s: {id: number}) => s.id === selectedByRequestBranchOffice)?.nombre : 'Selecciona'}</p>
//                     </div>
//                     <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
//                 </div>
//                 <div className={`content ${selectByRequestBranchOffices ? 'active' : ''}`} >
//                     <ul className={`options ${selectByRequestBranchOffices ? 'active' : ''}`} style={{ opacity: selectByRequestBranchOffices ? '1' : '0' }}>
//                         {filterByRequestBranchOffice.map((branchOffice: any) => (
//                         <li key={branchOffice.id} onClick={() => handleByRequestBranchOfficesChange(branchOffice)}>
//                             {branchOffice.nombre}
//                         </li>
//                         ))}
//                     </ul>
//                 </div>
//             </div>
//         </div>
//         <div>
//             {/* Reparar esta perte del la clase de css */}
//             <label className='label__general'>Fechas</label>
//             <div className='container_dates__requisition'>
//                 <input className='date' id="dateRangePicker" type="text" placeholder="Seleccionar rango de fechas" />
//             </div>
//         </div>
//     </div>
//     <div className='row__three'>
//         <div>
//             <div className='select__container'>
//             <label className='label__general'>Tipo</label>
//             <div className='select-btn__general'>
//                 <div className={`select-btn ${selectByRequestTypes ? 'active' : ''}`} onClick={openSelectByRequestTypes} >
//                     <p>{selectedByRequestType !== null ? types.find((s: {id: number}) => s.id === selectedByRequestType)?.name : 'Selecciona'}</p>
//                     <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
//                 </div>
//                 <div className={`content ${selectByRequestTypes ? 'active' : ''}`} >
//                     <ul className={`options ${selectByRequestTypes ? 'active' : ''}`} style={{ opacity: selectByRequestTypes ? '1' : '0' }}>
//                         {types.map((branchOffice: any) => (
//                             <li key={branchOffice.id} onClick={() => handleByRequestTypesChange(branchOffice)}>
//                             {branchOffice.name}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             </div>
//         </div>
//         <div>
//             <button className='btn__general-purple' type='button' onClick={filterByRequest}>Filtrar</button>
//         </div>
//     </div>
// </div>
// <div className='row__four'>
//     <div className='select__container'>
//         <label className='label__general'>Serie</label>
//         <div className='select-btn__general'>
//             <div className={`select-btn ${selectModalSeries ? 'active' : ''}`} onClick={openSelectModalSeries} >
//                 <p>{selectedModalSerie ? series.find((s: {id: number}) => s.id === selectedModalSerie)?.nombre : 'Selecciona'}</p>
//                 <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
//             </div>
//             <div className={`content ${selectModalSeries ? 'active' : ''}`} >
//                 <ul className={`options ${selectModalSeries ? 'active' : ''}`} style={{ opacity: selectModalSeries ? '1' : '0' }}>
//                 {series.map((serie: any) => (
//                     <li key={serie.id} onClick={() => handleModalSeriesChange(serie)}>
//                     {serie.nombre}
//                     </li>
//                 ))}
//                 </ul>
//             </div>
//         </div>
//     </div>
//     <div>
//         <label className='label__general'>Folio</label>
//         {/* <div className='warning__general' style={styleWarningName}><small >Este campo es obligatorio</small></div> */}
//         <input className={`inputs__general ${warningInvoice}  ? 'warning' : ''}`} type="text" value={invoice} onChange={(e) => setInvoice(e.target.value)} placeholder='Ingresa el folio' />
//     </div>
//     <div className='container__search'>
//         <button className='btn__general-purple btn__container' type='button' onClick={searchByRequest}>
//             Buscar
//             <svg className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
//         </button>
//     </div>
// </div>
// <div>
//     <div className={`overlay__modal_concepts ${modalStateConcepts ? 'active' : ''}`}>
//         <div className={`popup__modal_concepts ${modalStateConcepts ? 'active' : ''}`}>
//         <a href="#" className="btn-cerrar-popup__modal_concepts" onClick={closeModalConcepts}>
//             <svg className='close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
//         </a>
//         <p className='title__modals'>Detalles de conceptos</p>
//         <div className='conatiner__concepts'>
//             {concepts.map((concepto: any, index: any) => (
//             <div className='row__one' key={index}>
//             <div>
//                 <p className='text'>cantidad</p>
//                 <p  className='text'>{concepto.cantidad}</p>
//             </div>
//             <div>
//                 <p className='text'>codigo</p>
//                 <p  className='text'>{concepto.codigo}</p>
//             </div>
//             <div>
//                 <p className='text'>comentarios</p>
//                 <p  className='text'>{concepto.comentarios}</p>
//             </div>
//             <div>
//                 <p className='text'>descripcion</p>
//                 <p  className='text'>{concepto.descripcion}</p>
//             </div>
//             <div>
//                 <p className='text'>iva</p>
//                 <p  className='text'>{concepto.iva_on}</p>
//             </div>
//             <div>
//                 <p className='text'>precio_unitario</p>
//                 <p  className='text'>{concepto.precio_unitario}</p>
//             </div>
//             <div>
//                 <p className='text'>proveedor</p>
//                 <p  className='text'>{concepto.proveedor}</p>
//             </div>
//             <div>
//                 <p className='text'>unidad</p>
//                 <p  className='text'>{concepto.unidad}</p>
//             </div>
//             </div>
//             ))}
//             <div className='row__two'>

//             </div>
//         </div>
//         </div>
//     </div>
// </div>
// <div className='row__two'>
//     <div className=''>
//         {purchaseOrders.length > 0 ? (
//         <div className='table__modal_filter_tickets' >
//             <div className='table__numbers'>
//                 <p className='text'>Tus ordenes de compras</p>
//                 <div className='quantities_tables'>{purchaseOrders.length}</div>
//             </div>
//             <div className='table__body'>
//                 {purchaseOrders.map((x: any, index: any) => (
//                 <div className='tbody__container' key={index}>
//                     <div className='tbody'>
//                         <div className='td'>
//                             {x.empresa}
//                         </div>
//                         <div className='td'>
//                             ({x.sucursal})
//                         </div>
//                         <div className='td'>
//                             {x.fecha_creacion}
//                         </div>
//                         <div className='td'>
//                             <div>
//                                 <button onClick={() => openModalConcepts(x)} type='button' className='btn__general-purple'>Ver conceptos</button>
//                             </div>
//                         </div>
//                         <div className='td'>
//                             <div>
//                                 <button className='btn__general-purple' type='button' onClick={() => addArticlesByRequest(x)}>Agregar</button>
//                             </div>                                    
//                         </div>
//                     </div>
//                 </div>
//                 ))}
//             </div>
//         </div>
//         ) : (
//             <p className='text'>No hay ordes de compras que mostrar</p>
//         )}                
//         </div>
//     </div>
// </div>
//   )
// }

// export default ByOP
