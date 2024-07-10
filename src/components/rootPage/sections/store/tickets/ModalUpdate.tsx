import { useState, useEffect } from "react"
import useUserStore from "../../../../../zustand/General";
import { storeArticles } from '../../../../../zustand/Articles';
import { storeStore } from "../../../../../zustand/Store";
import { storeTickets } from "../../../../../zustand/Tickets";
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/l10n/es.js'
import './styles/ModalCreate.css'
import './styles/ModalUpdate.css'


const ModalUpdate = ({updateTickets}: any) => {

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

    const {articles}: any = storeArticles();
    const {store, getStore}: any = storeStore()
    const {getPDFTickets}: any = storeTickets();
    const userState = useUserStore(state => state.user);
    let user_id = userState.id

    const [conceptos, setConceptos] = useState<any>([])
    useEffect(() => {
        getStore(user_id)
        setConceptos(updateTickets.conceptos)
    }, [updateTickets])

   
    const [seleccionesTemporales, setSeleccionesTemporales] = useState<string[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<any>([])
    const [suppliersModal] = useState<any[]>([])
    const [selectedStore, setSelectedStore] = useState<any>([])
   
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value.trim();
        const newArticleStates = [...conceptos];
        newArticleStates[index].cantidad = value === '' ? null : parseFloat(value);
        setConceptos(newArticleStates);
        };

    const handleComentariosChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    const newArticleStates = [...conceptos];
    newArticleStates[index].comentarios = value;
    setConceptos(newArticleStates);

    }

    const handleSeleccion = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const valorSeleccionado = event.target.value;
        conceptos[index].unidad = valorSeleccionado;
        // Crear una copia del arreglo de selecciones temporales
        const nuevasSelecciones = [...seleccionesTemporales];
        // Actualizar el valor seleccionado en la posición del índice correspondiente
        nuevasSelecciones[index] = valorSeleccionado;
        // Actualizar el estado con las nuevas selecciones
        setSeleccionesTemporales(nuevasSelecciones);
    };


  
  const handleProveedorChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const temp_proveedor = parseInt(event.target.value, 10); // Convertir a número entero
    conceptos[index].id_proveedor = temp_proveedor;
    const nuevaInstancia = [...selectedSupplier];
    nuevaInstancia[index] = temp_proveedor;
    setSelectedSupplier(nuevaInstancia);
  };

const handleStoreChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const temp_store = parseInt(event.target.value, 10);
    conceptos[index].id_almacen = temp_store;
    const nuevaInstancia = [...selectedStore];
    nuevaInstancia[index] = temp_store;
    setSelectedStore(nuevaInstancia);
};




const [subtotal] = useState<number>(0); // Assuming you have declared `setSubtotal` elsewhere

const [discount] = useState<number>(0); // Assuming you have declared `setDiscount` elsewhere

const [total] = useState<number>(0);

const [IVA] = useState<any>(null)

const pdf = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
        // Supongamos que tienes el ID de la requisición
        await getPDFTickets(updateTickets.id);
        window.open(`https://bnprocura.onrender.com/pdf_entrada/${updateTickets.id}`, '_blank');
    } catch (error) {
        console.error('Error al generar el PDF:', error);
    }
};

  return (
    <form className='conatiner__update_tickets'>
        <div className="row__one">
            <div className='container__checkbox_tickets'>
                <div className='checkbox__tickets'>
                    <label className="checkbox__container_general">
                    <input className='checkbox' type="radio" value="normal" checked={updateTickets.status === 0}/>
                        <span className="checkmark__general"></span>
                    </label>
                    <p className='text'>Directa</p>
                </div>
                <div className='checkbox__tickets'>
                    <label className="checkbox__container_general">
                    <input className='checkbox' type="radio" value="diferencial" checked={updateTickets.status === 1}/>
                        <span className="checkmark__general"></span>
                    </label>
                    <p className='text'>Por OC</p>
                </div>
            </div>
        </div>
        <div className="row__two">
            <div className='select__container'>
                <label className='label__general'>Empresas</label>
                <div className='container__text_result'>
                    <p className='text__result' title="HOlaaa" >{updateTickets.empresa}</p>
                </div>
            </div>
            <div className='select__container'>
                <label className='label__general'>Sucursales</label>
                <div className='container__text_result'>
                    <p className='text__result' >{updateTickets.sucursal}</p>
                </div>
            </div>
            <div>
                <label className='label__general'>Fechas</label>
                <div className='container__text_result'>
                    <p className='text__result' >{updateTickets.fecha_creacion}</p>
                </div>
            </div>
            <div className="comments">
                <label className='label__general'>Comentarios</label>
                <div className='container__text_result'>
                    <p className='text__result' >{updateTickets.comentarios}</p>
                </div>
            </div>
        </div>
        
        <div className=''>
            <div className='table__modal_create_tickets' >
                <div>
                    <div>
                        {updateTickets.conceptos ? (
                        <div className='table__numbers'>
                            <p className='text'>Total de articulos</p>
                            <div className='quantities_tables'>{updateTickets.conceptos.length}</div>
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
                                <p className=''>OC</p>
                            </div>
                            <div className='th'>
                                <p className=''>Prov</p>
                            </div>
                          
                            <div className='th'>
                                <p className=''>Almacen</p>
                            </div>
                            <div className='th'>
                                <p className=''>Coment</p>
                            </div>
                            <div className='th'>
                                
                            </div>
                        </div>
                    </div>
                    {conceptos && conceptos.length > 0 ? (
                    <div className='table__body'>
                        {conceptos.map((article: any, index: any) => (
                        <div className='tbody__container' key={index}>
                            <div className='tbody'>
                                <div className='td'>
                                    {articles.find((x:any) => x.id === article.id_articulo)?.nombre}
                                </div>
                                <div className='td'>
                                    <div>
                                        <input className='inputs__general' value={article.cantidad === null ? '' : article.cantidad} onChange={(e) => handleAmountChange(e, index)} type="number"  placeholder='Cantidad' />
                                    </div>
                                </div>
                                <div className='td'>
                                    <div>
                                        <select className='traditional__selector' onChange={(event) => handleSeleccion(event, index)} value={seleccionesTemporales[index] || ''}>
                                            <option value="">Seleccionar</option>
                                            {units && units.map((item: any) => (
                                            <option key={item.id} value={item.name}>
                                                {item.name}
                                            </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className='td'>
                                    <p>N/A</p>
                                </div>
                                <div className='td'>
                                    <select className='traditional__selector' onChange={(event) => handleProveedorChange(event, index)} value={selectedSupplier[index] || ''} >
                                        <option value="">Seleccionar</option>
                                        {suppliersModal && suppliersModal.map((item: any) => (
                                        <option key={item.id} value={item.id}>
                                            {item.proveedor}
                                        </option>
                                        ))}
                                    </select>
                                </div>
                                <div className='td'>
                                    <select className='traditional__selector' onChange={(event) => handleStoreChange(event, index)} value={selectedStore[index] || ''} >
                                        <option value="">Seleccionar</option>
                                        {store && store.map((item: any) => (
                                        <option key={item.id} value={item.id}>
                                            {item.nombre}
                                        </option>
                                        ))}
                                    </select>
                                </div>
                                <div className='td'>
                                    <div>
                                        <input className='inputs__general' value={article.comentarios === '' ? '' : article.comentarios} onChange={(e) => handleComentariosChange(e, index)} type="text"  placeholder='Comentarios' />
                                    </div>
                                </div>
                                <div className='td'>
                                    <button className='btn__delete_users' type='button' >Eliminar</button>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    ) : (
                    <p className='text'>No hay aritculos que mostrar</p>
                    )}
                </div>
            </div>
        </div>
        <div className='row__three'>
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
        <div className="row__four">
            <div>
                <button className="btn__general-purple" onClick={pdf}>PDF</button>
            </div>
        </div>
    </form>
  )
}

export default ModalUpdate
