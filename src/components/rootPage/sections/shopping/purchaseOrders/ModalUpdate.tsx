import React, { useState, useEffect } from 'react'
import { storeSuppliers } from '../../../../../zustand/Suppliers';
import useUserStore from '../../../../../zustand/General';
import { storePurchaseOrders } from '../../../../../zustand/PurchaseOrders';
import { v4 as uuidv4 } from 'uuid'; // Importar la función v4 de uuid


import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/l10n/es.js'; // Importar el idioma español
import '../styles/PurchaseOrders.css'
import './styles/modalUpdate.css'



const ModalUpdate = ({purchaseOrder, conceptss, suppliersUpdate}: any) => {
    const {suppliers}: any = storeSuppliers();
   

    const {updatePurchaseOrders }: any = storePurchaseOrders();
    const userState = useUserStore(state => state.user);
    let user_id = userState.id 
    
    const purchaseOrderToUpdate = purchaseOrder;
              
        
    const typePurchase = [
        {
          id: 0,
          name: 'Local'
        },
        {
          id: 1,
          name: 'Extranjero'
        }
      ]
  
    
      const units = [
        {
          id: 0,
          name: 'PZA'
        },
        {
          id: 1,
          name: 'KG'
        }
      ]
        




// Modal de crear orden de compra
// Checkbox de tipo


// Cotizacion
const [price, setPrice] = useState<string>('')
// Factura
const [bill, setBill] = useState<string>('')


// Select de proveedor flete
const [selectModalfreightProvider, setSelectModalfreightProvider] = useState<boolean>(false)
const [selectedModalfreightProvider, setSelectedModalfreightProvider] = useState<number | null>(null)


const openSelectModalFreightProvider = () => {
  setSelectModalfreightProvider(!selectModalfreightProvider)
}

const handleModalFreightProviderChange = (reightProvider: any) => {
  setSelectedModalfreightProvider(reightProvider.id)
  setSelectModalfreightProvider(false)
}

// Costo de flete
const [freightCost, setFreightCost] = useState<number | ''>('')

const handleInputFreightCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value.trim();
  setFreightCost(value === '' ? '' : parseInt(value, 10));
};

// Comentarios de flete
const [freightComments, setFreightComments] = useState<string>('')


// Comentarios de orden de compra
const [OComments, setOComments] = useState<string>('')
 



                  //////////////////////////////
                 // Articulos en requisición //
                //////////////////////////////





    
const [date, setDate] = useState<string>(""); 

// Método para inicializar Flatpickr
const initFlatpickr = () => {
  flatpickr('.date', {
    dateFormat: 'd/m/Y',
    onChange: selectedDates => {
      if(selectedDates[0]) {
        const formattedDate = formatDate(selectedDates[0]);
        setDate(formattedDate);
      }
    }
  });
};

// Formatear la fecha seleccionada
const formatDate = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${(day < 10 ? '0' : '') + day}/${(month < 10 ? '0' : '') + month}/${year}`;
};

// Llamar a initFlatpickr después de que se renderiza el componente
useEffect(() => {
  initFlatpickr();

}, []);
const [warningInvoice] = useState<boolean>(false)



const [modalStateConcepts, setModalStateConcepts] = useState<boolean>(false)



const closeModalConcepts = () => {
  setModalStateConcepts(false)
}


const [checkIva, setCheckIva] = useState<any[]>([]);

const handleExtraDiscountChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
  const newCheckIva = [...checkIva]; // Crear una copia del estado actual
  newCheckIva[index] = e.target.checked; // Actualizar el valor correspondiente al índice dado
  setCheckIva(newCheckIva); // Actualizar el estado
}



const [freightCostActive, setFreightCostActive] = useState<any>(false);
console.log(freightCostActive)
const [amountInput, setAmountInput] = useState<any>([]);
const [priceInput, setPriceInput] = useState<any>([]);
const [commentInput, setCommentInput] = useState<any>([]);
const [discountInput, setDiscountInput] = useState<any>([]);
const [subtotal, setSubtotal] = useState<any>(0);
const [discount, setDiscount] = useState<any>(0);
const [total, setTotal] = useState<any>(0);
const [amountsArr, setAmountsArr] = useState<any>([]);
const [pricesArr, setPricesArr] = useState<any>([]);
const [discountsArr, setDiscountsArr] = useState<any>([]);
const [ivaArr] = useState<any>([]);
const [IVA, setIVA] = useState<any>(null);




const amountsChange = (value: any, index: any) => {
  const newAmounts = [...amountInput];
  newAmounts[index] = value;
  setAmountInput(newAmounts);

  const newAmountsArr = newAmounts.map((amount: any, i: number) => {
    return { index: i, value: parseFloat(amount || 0) };
  });
  setAmountsArr(newAmountsArr);
};

// Llama a amountsChange con los parámetros adecuados donde sea necesario
// amountsChange(value, index);



const pricesChange = (value: any, index: any) => {
  const newPrices = [...priceInput];
  newPrices[index] = value;
  setPriceInput(newPrices);

  const newPricesArr = newPrices.map((price: any, i: number) => {
    return { index: i, value: parseFloat(price || 0) };
  });

  setPricesArr(newPricesArr);
  calculateSubtotal();
};

const commentsChange = (value: any, index: any) => {
  const newComments = [...commentInput];
  newComments[index] = value;
  setCommentInput(newComments);
};

const discountChange = (value: any, index: any) => {
  const newDiscounts = [...discountInput];
  newDiscounts[index] = value;
  setDiscountInput(newDiscounts);
  calculateIVA();
  const newDiscountsArr = newDiscounts.map((discount: any, i: number) => {
    return { index: i, value: parseFloat(discount || 0) };
  });

  setDiscountsArr(newDiscountsArr);
  calculateDiscount();
};

const checkFreightCost = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFreightCostActive(e.target.checked);
};



useEffect(() => {
  calculateSubtotal()
  calculateIVA()
}, [checkIva])

const calculateSubtotal = () => {
  let subtotalValue = 0;

  amountsArr.forEach((index: any) => {
    const amount = amountsArr[index]?.value || amountsArr[index]; 
    const price = pricesArr[index]?.value || pricesArr[index];
    let columnTotal = amount * price;
    subtotalValue += columnTotal;
   
  });
  setSubtotal(subtotalValue);
};

const calculateDiscount = () => {
  let discountTotal = 0;
  discountsArr.forEach((discount: any, index: number) => {
    const discountPercent = (discount.value || discount) / 100 || 0;
    const amount = amountsArr[index]?.value || amountsArr[index]; 
    const price = pricesArr[index]?.value || pricesArr[index];
    if (amount && price) {
      let columnTotal = amount * price;
      let columnDiscount = columnTotal * discountPercent;
      discountTotal += columnDiscount;
    }
  });
  setDiscount(discountTotal);
};

const calculateIVA = () => {
  let ivaTotal = 0;
  let total = 0;

  discountsArr.forEach((discount: any, index: number) => {
    const discountPercent = (discount.value || discount) / 100 || 0;
    const amount = amountsArr[index]?.value || amountsArr[index] || 0; 
    const price = pricesArr[index]?.value || pricesArr[index] || 0; 
    const columnTotal = amount * price;

    const columnSubtotal = columnTotal - (columnTotal * discountPercent);

    const columnIva = columnSubtotal * 0.16;
    ivaTotal += columnIva;
    setIVA(ivaTotal.toFixed(2));
  
    // Si el costo de flete está activo, calcula el total incluyendo el IVA
    if (checkIva[index]) {
      const columnIva = columnSubtotal * 0.16;
      ivaTotal += columnIva;
      total += columnSubtotal + columnIva;
    } else { // Si no, calcula el total sin incluir el IVA
      total += columnSubtotal;
    }
    setTotal(total);
 
  
  });


};



useEffect(() => {
  if (conceptss.length > 0) {
    const initialAmounts = conceptss.map((prov: any) => prov.cantidad);
    setAmountInput(initialAmounts);
    setAmountsArr(initialAmounts)

    const initialPrices = conceptss.map((prov: any) => prov.precio_unitario);
    setPriceInput(initialPrices);
    setPricesArr(initialPrices)

    const initialDiscounts = conceptss.map((prov: any) => prov.cantidad);
    setDiscountInput(initialDiscounts);
    setDiscountsArr(initialDiscounts)

    const initialComments = conceptss.map((prov: any) => prov.comentarios);
    setCommentInput(initialComments);

    const initialIva = conceptss.map((prov: any) => prov.iva_on);
    setCheckIva(initialIva);
   

    // Actualizar los estados correspondientes con los valores iniciales
    setAmountsArr(initialAmounts);
    setPricesArr(initialPrices);

    // Realizar los cálculos una vez que se establezcan los valores iniciales
    calculateSubtotal();
    calculateDiscount();
    calculateIVA();
  }
}, [conceptss]);

useEffect(() => {
  calculateSubtotal();
  calculateDiscount();
  calculateIVA();
  setBill(purchaseOrderToUpdate.factura)
  setPrice(purchaseOrderToUpdate.cotizacion)
}, [amountsArr, pricesArr, discountsArr, ivaArr]);



useEffect(() => {
  setDate(purchaseOrder.fecha_llegada)
  setPrice(purchaseOrderToUpdate.cotizacion)
  setBill(purchaseOrderToUpdate.factura)
  setSelectedModalfreightProvider(purchaseOrderToUpdate.id_proveedor_flete)
  setFreightCost(purchaseOrderToUpdate.costo_flete)
  setFreightComments(purchaseOrderToUpdate.comentarios_flete)
  setFreightCostActive(purchaseOrderToUpdate.sumar_flete)
  setOComments(purchaseOrderToUpdate.comentarios)
}, [purchaseOrderToUpdate])




const [proveedores, setProveedores] = useState<number[]>([]);
const [selectedUnit, setSelectedUnit] = useState<number[]>([]);

const handleProveedorChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
  const temp_proveedor = parseInt(event.target.value, 10); 
  const nuevaInstancia = [...proveedores];
  nuevaInstancia[index] = temp_proveedor;
  setProveedores(nuevaInstancia);
};

const handleUnitChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
  const temp_units = parseInt(event.target.value, 10); 
  const nuevaInstancia = [...selectedUnit]; 
  nuevaInstancia[index] = temp_units;
  setSelectedUnit(nuevaInstancia);
};


const hanledUpdateOC = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  let conceptos: any = [];
  // Utilizamos un bucle for para tener acceso al índice
  for (let index = 0; index < conceptss.length; index++) {
    let updatedConcept = {
      id: conceptss[index].id,
      id_orden_compra: conceptss[index].id_orden_compra,
      id_requisicion: conceptss[index].id_requisicion,
      id_proveedor: conceptss[index].id_proveedor,
      id_articulo: conceptss[index].id_articulo,
      cantidad: amountsArr[index]?.value || amountsArr[index],
      descuento: conceptss[index].descuento,
      unidad: conceptss[index].unidad,
      precio_unitario: pricesArr[index]?.value || pricesArr[index],
      iva_on: conceptss[index].iva_on,
      comentarios: conceptss[index].comentarios
    };  

    // Agregar el concepto actualizado al arreglo
    conceptos.push(updatedConcept);
  }
  let id = purchaseOrderToUpdate.id
  let id_usuario_crea = user_id;
  let id_usuario_autoriza = 0;
  let id_sucursal = purchaseOrderToUpdate.id_sucursal;
  let fecha_creacion = '';
  let fecha_llegada = date;
  let status = purchaseOrderToUpdate.status;
  let tipo = purchaseOrderToUpdate.tipo;
  let cotizacion = price;
  let factura = bill;
  let comentarios = purchaseOrderToUpdate.comentarios;
  let id_proveedor_flete = purchaseOrderToUpdate.id_proveedor_flete;
  let costo_flete = purchaseOrderToUpdate.costo_flete;
  let comentarios_flete = purchaseOrderToUpdate.comentarios_flete; // Corregido
  let sumar_flete = purchaseOrderToUpdate.sumar_flete;
  let conceptos_elim: any = [];
  


  
  try {
    updatePurchaseOrders(id, id_usuario_crea, id_usuario_autoriza, id_sucursal, fecha_creacion, fecha_llegada, status, tipo, cotizacion, factura, comentarios, id_proveedor_flete, costo_flete, comentarios_flete, sumar_flete, conceptos, conceptos_elim)
  } catch {

  }

  
  
}




  return (
    <form className='conatiner__update_parchase-orders' onSubmit={hanledUpdateOC}>
      <div className='row__check'>
        <div className='container__checkbox_purchas-order'>
          <div className='checkbox__purchas-order'>
            <label className="checkbox__container_general">
              <input 
                className='checkbox' 
                type="checkbox" 
                value={0} 
                checked={purchaseOrderToUpdate.tipo === 0}
              />
              <span className="checkmark__general"></span>
            </label>
            <p className='title__checkbox text'>Directa</p>
          </div>
          <div className='checkbox__purchas-order'>
            <label className="checkbox__container_general">
              <input 
                className='checkbox' 
                type="checkbox" 
                value={1} 
                checked={purchaseOrderToUpdate.tipo === 1}
              />
              <span className="checkmark__general"></span>
            </label>
            <p className='title__checkbox text'>Por requisición</p>
          </div>
        </div>
      </div>
      <div className='row__one_update'>
        <div className='select__container'>
          <label className='label__general'>Usuario</label>
          <div className='container__text_result'>
            <p className='text__result' >{purchaseOrderToUpdate.usuario_crea}</p>
          </div>
        </div>
        <div className='select__container'>
          <label className='label__general'>Serie</label>
          <div className='container__text_result'>
            <p className='text__result' >{purchaseOrderToUpdate.serie}</p>
          </div>
        </div>
        <div className='select__container'>
          <label className='label__general'>Folio</label>
          <div className='container__text_result'>
            <p className='text__result' >{purchaseOrderToUpdate.folio}</p>
          </div>
        </div>
        <div className='select__container'>
          <label className='label__general'>año</label>
          <div className='container__text_result'>
            <p className='text__result' >{purchaseOrderToUpdate.anio}</p>
          </div>
        </div>
        <div className='select__container'>
          <label className='label__general'>Status</label>
          <div className='container__text_result'>
            <p className='text__result' >{purchaseOrderToUpdate.status}</p>
          </div>
        </div>
      </div>
      <div className='row__one_two'>
        <div className='select__container'>
          <label className='label__general'>Empresas</label>
          <div className='container__text_result'>
            <p className='text__result' >{purchaseOrderToUpdate.empresa}</p>
          </div>
        </div>
        <div className='select__container'>
          <label className='label__general'>Sucursales</label>
          <div className='container__text_result'>
            <p className='text__result'>{purchaseOrderToUpdate.sucursal}</p>
          </div>
        </div>
        <div className='dates__requisition'>
          <label className='label__general'>Fecha</label>
          <div className='container_dates__requisition'>
            <input className='date' type="text" value={date}/>
          </div>
        </div>
        <div>
          <label className='label__general'>Cotizacion</label>
          {/* <div className='warning__general' style={styleWarningName}><small >Este campo es obligatorio</small></div> */}
          <input className='inputs__general' type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder='Ingresa la dirección' />
        </div>
        <div>
          <label className='label__general'>Factura</label>
            {/* <div className='warning__general' style={styleWarningName}><small >Este campo es obligatorio</small></div> */}
          <input className='inputs__general' type="text" value={bill} onChange={(e) => setBill(e.target.value)} placeholder='Ingresa la factura' />
        </div>
      </div>   
      <div className='row__two'>
        <div className='select__container'>
          <label className='label__general'>Tipo de compra</label>
          <div className='container__text_result'>
            <p>{typePurchase.find((s: {id: number}) => s.id === purchaseOrderToUpdate.tipo)?.name}</p>
          </div>
        </div>
        <div className='select__container'>
          <label className='label__general'>Proveedor flete</label>
          <div className='select-btn__general'>
            <div className={`select-btn ${selectModalfreightProvider ? 'active' : ''}`} onClick={openSelectModalFreightProvider}>
              <p>{selectedModalfreightProvider ? suppliers.find((s: {id: number}) => s.id === selectedModalfreightProvider)?.nombre_comercial : 'Selecciona'}</p>
              <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
            </div>
            <div className={`content ${selectModalfreightProvider ? 'active' : ''}`}>
              <ul className={`options ${selectModalfreightProvider ? 'active' : ''}`} style={{ opacity: selectModalfreightProvider ? '1' : '0' }}>
                {suppliers.map((suppliers: any) => (
                  <li key={suppliers.id} onClick={() => handleModalFreightProviderChange(suppliers)}>
                    {suppliers.nombre_comercial}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div>
          <label className='label__general'>Costo flete</label>
            {/* <div className='warning__general' style={styleWarningName}><small >Este campo es obligatorio</small></div> */}
          <input className={`inputs__general ${warningInvoice}  ? 'warning' : ''}`} type="number" value={freightCost} onChange={handleInputFreightCostChange} placeholder='Costo'/>
        </div>
        <div>
          <div>
            <label className="switch">
              <input type="checkbox" onChange={checkFreightCost} />
              <span className="slider"></span>
            </label>
          </div>
        </div>
        <div>
          <label className='label__general'>Comentarios de flete</label>
            {/* <div className='warning__general' style={styleWarningName}><small >Este campo es obligatorio</small></div> */}
          <input className={`inputs__general ${warningInvoice}  ? 'warning' : ''}`} type="text" value={freightComments} onChange={(e) => setFreightComments(e.target.value)} placeholder='Ingresa la contizacion' />
        </div>
      </div>
      <div className='row__three'>
        <div>
          <label className='label__general'>Comentarios de OC</label>
            {/* <div className='warning__general' style={styleWarningName}><small >Este campo es obligatorio</small></div> */}
          <input className={`inputs__general ${warningInvoice}  ? 'warning' : ''}`} type="text" value={OComments} onChange={(e) => setOComments(e.target.value)} placeholder='Ingresa la contizacion' />
        </div>
      </div>
      <p className='title'>Articulos en Orden de compra</p>
      <div className='row__four'>
        <div>
          <div className={`overlay__modal_concepts ${modalStateConcepts ? 'active' : ''}`}>
            <div className={`popup__modal_concepts ${modalStateConcepts ? 'active' : ''}`}>
              <a href="#" className="btn-cerrar-popup__modal_concepts" onClick={closeModalConcepts}>
                <svg className='close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
              </a>
              <p className='title__modals'>Detalles de conceptos</p>
              <div className='conatiner__concepts'>
                  {conceptss.map((concepto: any) => (
                  <div className='row__one' key={uuidv4()}>
                    <div>
                      <p className='text'>cantidad</p>
                      <p  className='text'>{concepto.cantidad}</p>
                    </div>
                    <div>
                      <p className='text'>codigo</p>
                      <p  className='text'>{concepto.codigo}</p>
                    </div>
                    <div>
                      <p className='text'>comentarios</p>
                      <p  className='text'>{concepto.comentarios}</p>
                    </div>
                    <div>
                      <p className='text'>descripcion</p>
                      <p  className='text'>{concepto.descripcion}</p>
                    </div>
                    <div>
                      <p className='text'>iva</p>
                      <p  className='text'>{concepto.iva_on}</p>
                    </div>
                    <div>
                      <p className='text'>precio_unitario</p>
                      <p  className='text'>{concepto.precio_unitario}</p>
                    </div>
                    <div>
                      <p className='text'>proveedor</p>
                      <p  className='text'>{concepto.proveedor}</p>
                    </div>
                    <div>
                      <p className='text'>unidad</p>
                      <p  className='text'>{concepto.unidad}</p>
                    </div>
                  </div>
                  ))}
                  {/* <div className='row__two'>
                  </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className='row__two'>
          <div className='table__modal_update_parchase-orders' >
            <div>
              <div>
                {purchaseOrderToUpdate ? (
                  <div className='table__numbers'>
                    <p className='text'>Tus ordenes de compras</p>
                    <div className='quantities_tables'>{conceptss.length}</div>
                  </div>
                  ) : (
                  <p className='text'>No hay empresas</p>
                  )}
              </div>
              <div className='table__head'>
                <div className='thead'>
                  <div className='th'>
                    <p className=''>Articulo</p>
                  </div>
                  <div className='th'>
                    <p className=''>Cant</p>
                  </div>
                  <div className='th'>
                    <p className=''>Unidad</p>
                  </div>
                  <div className='th'>
                    <p className=''>Req</p>
                  </div>
                  <div className='th'>
                    <p className=''>P/U</p>
                  </div>
                  <div className='th'>
                    <p className=''>Desc</p>
                  </div>
                  <div className='th'>
                    <p className=''>Proveed</p>
                  </div>
                  <div className='th'>
                    <p className=''>IVA</p>
                  </div>
                  <div className='th'>
                    <p className=''>Coment</p>
                  </div>
                  <div>
                    <p></p>
                  </div>
                </div>
              </div>
     
              <div className='table__body'>
                <div>
                  <div className='tbody__container' >
                  {conceptss.map((prov: any, index: any) => (
                    <div className='tbody' key={index}>
                      <div className='td'>
                        {prov.descripcion}
                      </div>
                      <div className='td'>
                        <div>
                          <input className='inputs__general' value={amountInput[index] || ''} onChange={(e) => amountsChange(e.target.value, index)} type="number" placeholder='Cantidad' />
                        </div>
                      </div>
                      <div className='td'>
                        <select className='traditional__selector' onChange={(event) => handleUnitChange(event, index)} value={selectedUnit[index] || ''}>
                          {units.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                              {unit.name}
                            </option>
                          ))}
                        </select>            
                      </div>
                      <div className='td'>
                        <p>N/A</p>
                      </div>
                      <div className='td'>
                        <div>
                        <input className='inputs__general' value={priceInput[index] || ''} onChange={(e) => pricesChange(e.target.value, index)} type="number" placeholder='Cantidad' />

                        </div>
                      </div>
                      <div className='td'>
                        <div>
                          <input className='inputs__general' value={discountInput[index] || ''} onChange={(e) => discountChange(e.target.value, index)} type="number" placeholder='Cantidad' />
                        </div>
                      </div>
                      <div className='td'>
                        <select className='traditional__selector' onChange={(event) => handleProveedorChange(event, index)} value={proveedores[index] || ''} >
                          {suppliersUpdate && suppliersUpdate.map((item: any) => (
                            <option key={uuidv4()} value={item.id_proveedor}>
                              {item.proveedor}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className='td'>
                        <div>
                          <label className="switch">
                            <input type="checkbox" onChange={(e) => handleExtraDiscountChange(e, index)} checked={checkIva[index]} />
                            <span className="slider"></span>
                          </label>
                        </div>
                      </div>
                      <div className='td'>
                        <div>
                          <input className='inputs__general' value={commentInput[index] || ''} onChange={(e) => commentsChange(e.target.value, index)} type="text" placeholder='Cantidad' />

                        </div>
                      </div>
                      <div className='td'>
                        <button className='btn__delete_users' type='button' >Eliminar</button>
                      </div>
                    </div>
                    ))}
                  </div>
                </div>
              
              </div>
           
            </div>         
          </div>
        </div>
      </div>
      <div className='conatiner__result_modal_purchase-order'>
        <div>
          <p className='title'>Subtotal</p>
          <p className='result'>$ {subtotal.toFixed(2)}</p>
        </div>
        <div>
          <p className='title'>Descuento</p>
          <p className='result'>$ {discount.toFixed(2)}</p>
        </div>  
        <div>
          <p className='title'>IVA</p>
          {/* Si applyExtraDiscount es true, mostrar 16%, de lo contrario, mostrar el valor calculado */}
          <p className='result'>{IVA}</p>
        </div>
        <div>
          <p className='title'>Total</p>
          {/* Ajustar el cálculo del total basado en si applyExtraDiscount está marcado */}
          <p className='result'>$ {total.toFixed(2)}</p>
        </div>
      </div>
      <div>
        <button className='btn__general-purple' type='submit'>Crear nueva requisición</button>
      </div>
    </form>
)
}

export default ModalUpdate
