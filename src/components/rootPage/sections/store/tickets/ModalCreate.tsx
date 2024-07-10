import { useState, useEffect } from "react"
import { storeCompanies } from "../../../../../zustand/Companies";
import { storeBranchOffcies } from "../../../../../zustand/BranchOffices";
import { storeSeries } from "../../../../../zustand/Series";
import useUserStore from "../../../../../zustand/General";
import { storePurchaseOrders } from "../../../../../zustand/PurchaseOrders";
import { storeArticles } from '../../../../../zustand/Articles';
import { storeStore } from "../../../../../zustand/Store";
import { storeTickets } from "../../../../../zustand/Tickets";
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/l10n/es.js'
import './styles/ModalCreate.css'


const ModalCreate = () => {
    
    const typeSearchs = [
        {
          id: 0,
          name: 'Código'
        },
        {
          id: 1,
          name: 'Nombre'
        }
    ]

    let types = [
        {
          id: 0,
          name: 'Todos'
        },
        {
          id: 1,
          name: 'Manual'
        },
        {
          id: 2,
          name: 'Automático'
        },
        {
          id: 3,
          name: 'Automático bajo pedido'
        },
        {
          id: 4,
          name: 'Diferencial'
        },
      ]

    const {companiesXUsers}: any = storeCompanies();
    const {branchOfficeXCompanies }: any = storeBranchOffcies();
    const {series}: any = storeSeries();
    const {articles, getArticles }: any = storeArticles();
    const {purchaseOrders, getPurchaseOrders}: any = storePurchaseOrders();
    const {store, getStore}: any = storeStore()
    const {createTickets}: any = storeTickets();
    const userState = useUserStore(state => state.user);
    let user_id = userState.id

    const [selectedCompany, setSelectedCompany] = useState<number | null>(null)
    const [selectedBranchOffice, setSelectedBranchOffice] = useState<number | null>(null);

    const [selectCompanies, setSelectCompanies] = useState<boolean>(false)
    const [selectBranchOffices, setSelectBranchOffices] = useState<boolean>(false)

    const [comments, setComments] = useState<any>('')

    useEffect(() => {
        getStore(user_id)
    }, [])

    const openSelectCompanies = () => {
        setSelectCompanies(!selectCompanies)
    
    }

    const openSelectBranchOffices = () => {
        setSelectBranchOffices(!selectBranchOffices)
    
    }

    const handleCompaniesChange = async (company: any) => {
        setSelectedCompany(company.id)
        setSelectCompanies(false)
        selectCompaniesAutomatic(company.id)
        
    }

    const [branchOfficesFiltering, setBranchOfficesFiltering] = useState<any>([])
        const selectCompaniesAutomatic = (company_id: number) => {
        let filter = branchOfficeXCompanies.filter((x: any) => x.empresa_id === company_id)
        setBranchOfficesFiltering(filter)
        setSelectedBranchOffice(filter.length > 0 ? filter[0].id : null);

    }

    const handleBranchOfficesChange = (branchOffice: any) => {
        setSelectedBranchOffice(branchOffice.id)
        setSelectBranchOffices(false)
    }

    
    const [selectedOption, setSelectedOption] = useState<number | null>(0);
    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value === "normal") {
            setSelectedOption(0);
        } 
        else if (value === "diferencial") {
            setSelectedOption(1);
        } 
        else {
        }
    };

    

//////////////////////////////////Directa////////////////////////////////////////////////


    const [selectTypeSearch, setSelectTypeSearch] = useState<boolean>(false)
    const [selectedTypeSearch, setSelectedTypeSearch] = useState<number | null>(null)

    const openSelectModalTypeSearch = () => {
        setSelectTypeSearch(!selectTypeSearch)
    }
    const handleModalTypeSearchChange = (type: any) => {
        setSelectedTypeSearch(type.id)
        setSelectTypeSearch(false)
    }

    // Bucador por nombre
    const [searchBy, setSearchBy] = useState<any>(null)

    const [selectModalResults, setSelectModalResults] = useState<boolean>(false)
    const [selectedModalResult, setSelectedModalResult] = useState<any>(null)

    const openSelectModalResults = () => {
    setSelectModalResults(!selectModalResults)
    }

    const handleModalResultsChange = (item: any) => {
    setSelectedModalResult(item)
    setSelectModalResults(false)
    }

    const searchFor = async () => {
        let data = {
            id: 0,
            activos: true,
            nombre: selectedTypeSearch == 1 ? searchBy : '',
            codigo: selectedTypeSearch == 0 ? searchBy : '',
            familia: 0,
            proveedor: 0,
            materia_prima: 0,
            get_sucursales: false,
            get_proveedores: true,
            get_max_mins: false,
            get_plantilla_data: false,
            get_stock: false,
            get_web: false,
            get_unidades: true,
            id_usuario: 0
          };
        if (selectedTypeSearch == 0) {
            await getArticles(data)
            // getPurchaseOrders(folio, 0, 0, user_id, 0, 0, selectedStartDate2 ?  selectedStartDate2.toISOString().split('T')[0] : null, selectedEndDate2 ? selectedEndDate2.toISOString().split('T')[0] : null, 0);
       
        } else if (selectedTypeSearch == 1) {
            await getArticles(data)
        }
    };
    
    const [conceptos, setConceptos] = useState<any>([])
    const [selectedUnit, setSelectedUnit] = useState<any[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<any>([])
    const [setSuppliersModal] = useState<any>([])
    const [selectedStore, setSelectedStore] = useState<any>([])
   
    // const [units, setUnits] = useState<any>()

    const addArticles = () => {
        let id_articulo = selectedModalResult.id;
        let units = selectedModalResult.unidades
        let suppliers = selectedModalResult.proveedores;
        
        setConceptos((prevArticleStates: any) => [...prevArticleStates, {id_proveedor: null, suppliers, id_articulo, units, cantidad: null, restante: 0, unidad: '', id_almacen: null, comentarios: '' }]);

    };

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

const handleSelectUnits = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const valorSeleccionado = parseInt(event.target.value, 10); // Base 10 para números decimales
    conceptos[index].unidad = valorSeleccionado;
    // Crear una copia del arreglo de selecciones temporales
    const nuevasSelecciones = [...selectedUnit];
    // Actualizar el valor seleccionado en la posición del índice correspondiente
    nuevasSelecciones[index] = valorSeleccionado;
    // Actualizar el estado con las nuevas selecciones
    setSelectedUnit(nuevasSelecciones);
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


  /////////////////////////////////////////////////////////////////////////////////////////////////////
 ////////////////////////////////////////Por OC///////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

const [selectByRequestCompanies, setSelectByRequestCompanies] = useState<boolean>(false)
const [selectedByRequestCompany, setSelectedByRequestCompany] = useState<number | null>(null)
const [selectByRequestBranchOffices, setSelectByRequestBranchOffices] = useState<boolean>(false)
const [selectedByRequestBranchOffice, setSelectedByRequestBranchOffice] = useState<number | null>(null)



const openSelectByRequestCompanies = () => {
    setSelectByRequestCompanies(!selectByRequestCompanies)
}

const handleByRequestCompaniesChange = (company: any) => {
    setSelectedByRequestCompany(company.id)
    setSelectByRequestCompanies(false)
    selectAutomaticBranchOffices(company.id)
}

const [filterByRequestBranchOffice, setFilterByRequestBranchOffice] = useState<any>([])
const selectAutomaticBranchOffices = (company_id: any) => {
    let filter = branchOfficeXCompanies.filter((x: any) => x.id === company_id);
    setFilterByRequestBranchOffice(filter);
    setSelectedByRequestBranchOffice(filter.length > 0 ? filter[0].id : null);
}

const openSelectByRequestBranchOffices = () => {
    setSelectByRequestBranchOffices(!selectByRequestBranchOffices)
}

const handleByRequestBranchOfficesChange = (branchOffice: any) => {
    setSelectedByRequestBranchOffice(branchOffice.id)
    setSelectByRequestBranchOffices(false)
}


//////////////////////////////////////////// Fechas //////////////////////////////////////////////////

const defaultStartDate = new Date();
defaultStartDate.setHours(0, 0, 0, 0);
const defaultEndDate = new Date(defaultStartDate.getTime() - 7 * 24 * 60 * 60 * 1000);
defaultEndDate.setHours(0, 0, 0, 0);

const [selectedStartDate2, setSelectedStartDate2] = useState<Date | null>(null);
const [selectedEndDate2, setSelectedEndDate2] = useState<Date | null>(null);

useEffect(() => {
  const initFlatpickr = (id: any, storageKey: any) => {
    const storedDates = localStorage.getItem(storageKey);
    let startDate = defaultStartDate;
    let endDate = defaultEndDate;

    if (storedDates) {
      const parsedDates = JSON.parse(storedDates);
      startDate = parsedDates[0] ? new Date(parsedDates[0]) : defaultStartDate;
      endDate = parsedDates[1] ? new Date(parsedDates[1]) : defaultEndDate;
    }

    flatpickr(`#${id}`, {
      mode: 'range',
      dateFormat: 'Y-m-d',
      locale: 'es',
      defaultDate: [startDate, endDate],
      onChange: (selectedDates) => {
        if (id === 'dateRangePicker2') {
            setSelectedStartDate2(selectedDates[0]);
            setSelectedEndDate2(selectedDates[1]);
            localStorage.setItem(storageKey, JSON.stringify(selectedDates.map(date => date.toISOString().slice(0, 10))));
        } 
      }
    });
  };

  initFlatpickr('dateRangePicker2', 'selectedDateRange2');
 
}, []);


const [selectByRequestTypes, setSelectByRequestTypes] = useState<boolean>(false)
const [selectedByRequestType, setSelectedByRequestType] = useState<number | null>(null)

 
const openSelectByRequestTypes = () => {
  setSelectByRequestTypes(!selectByRequestTypes)
}

const handleByRequestTypesChange = (type: any) => {
  setSelectedByRequestType(type.id)
  setSelectByRequestTypes(false)
}



const filterByRequest = async () => {
    let folio = 0;
     try {
    //   let id;
    //   let id_articulo;
    //   let id_proveedor;
    //   let name_proveedor;
    
      getPurchaseOrders(folio, 0, 0, user_id, 0, 0, selectedStartDate2 ?  selectedStartDate2.toISOString().split('T')[0] : null, selectedEndDate2 ? selectedEndDate2.toISOString().split('T')[0] : null, 0);
      console.log('gh',purchaseOrders)
      
    } catch (error) {
      console.error("Error fetching requisitions:", error);
    }
  }



  const addArticlesByRequest = (x: any) => {
      let id_articulo = x.id
      let id_orden_compra_concepto: number;
      x.conceptos.forEach((xx: any) => {
        id_orden_compra_concepto = xx.id
        setSuppliersModal(xx.proveedores)
      });
      
      setConceptos((prevArticleStates: any) => [...prevArticleStates, {id_proveedor: null , id_articulo, id_almacen: null, id_orden_compra_concepto, cantidad: null, unidad: '', comentarios: '' }]);
}


  
  const [modalStateConcepts, setModalStateConcepts] = useState<boolean>(false)

  const [concepts, setConcepts] = useState<any[]>([])
  
  const openModalConcepts = (item: any) => {
    setModalStateConcepts(true);
  
    item.conceptos.forEach((element: any) => {
      setConcepts(prevConcepts => ([{
        ...prevConcepts,
        cantidad: element.cantidad,
        codigo: element.codigo,
        comentarios: element.comentarios,
        descripcion: element.descripcion,
        iva_on: element.iva_on,
        precio_unitario: element.precio_unitario,
        proveedor: element.proveedor,
        unidad: element.unidad,
      }]));
    });
  

  }

  
const [invoice, setInvoice] = useState<string>('')
const [warningInvoice] = useState<boolean>(false)
const searchByRequest = () => {
    // let id = 0 
    // let folio = invoice
    // let id_serie = selectedModalSerie
    // let id_sucursal = selectedByRequestBranchOffice
    // let id_usuario = 12
    // let id_area = 0
    // let tipo = 0
    // let status = 1
    // let desde = selectedStartDate
    // let hasta = selectedEndDate
  
    // getPurchaseOrders(id, folio, id_serie, id_sucursal, id_usuario, id_area, tipo, desde, hasta, status)
   }

   const closeModalConcepts = () => {
    setModalStateConcepts(false)
  }



const [selectModalSeries, setSelectModalSeries] = useState<boolean>(false)
const [selectedModalSerie, setSelectedModalSerie] = useState<number | null>(null) 

const openSelectModalSeries = () => {
  setSelectModalSeries(!selectModalSeries)
}

const handleModalSeriesChange = (serie: any) => {
  setSelectedModalSerie(serie.id)
  setSelectModalSeries(false)
}



const [subtotal] = useState<number>(0); // Assuming you have declared `setSubtotal` elsewhere

const [discount] = useState<number>(0); // Assuming you have declared `setDiscount` elsewhere

const [total] = useState<number>(0);

const [IVA] = useState<any>(null)

const handleCreateAreas = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let id_sucursal = selectedBranchOffice;
    let id_usuario_crea = user_id;
    let comentarios = comments;

    try {
        await createTickets(id_sucursal, id_usuario_crea, comentarios, conceptos)
        console.log({id_sucursal, id_usuario_crea, comentarios, conceptos})

    } catch (error) {
        console.log(error)
    }

}

useEffect(() => {
    console.log('conceptos', conceptos)
    console.log('articulo', articles)
}, [conceptos])



  return (
    <form className='conatiner__create_tickets' onSubmit={handleCreateAreas}>
        <div className="row__one">
            <div className='container__checkbox_tickets'>
                <div className='checkbox__tickets'>
                    <label className="checkbox__container_general">
                    <input className='checkbox' type="radio" value="normal" checked={selectedOption === 0} onChange={handleOptionChange} />
                        <span className="checkmark__general"></span>
                    </label>
                    <p className='text'>Directa</p>
                </div>
                <div className='checkbox__tickets'>
                    <label className="checkbox__container_general">
                    <input className='checkbox' type="radio" value="diferencial" checked={selectedOption === 1} onChange={handleOptionChange} />
                        <span className="checkmark__general"></span>
                    </label>
                    <p className='text'>Por OC</p>
                </div>
            </div>
        </div>
        <div className="row__two">
            <div className='select__container'>
                <label className='label__general'>Empresas</label>
                <div className='select-btn__general'>
                    <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
                        <div className='select__container_title'>
                            <p>{selectedCompany ? companiesXUsers.find((s: {id: number}) => s.id === selectedCompany)?.razon_social : 'Selecciona'}</p>
                        </div>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                    </div>
                    <div className={`content ${selectCompanies ? 'active' : ''}`} >
                        <ul className={`options ${selectCompanies ? 'active' : ''}`} style={{ opacity: selectCompanies ? '1' : '0' }}>
                        {companiesXUsers && companiesXUsers.map((company: any) => (
                            <li key={company.id} onClick={() => handleCompaniesChange(company)}>
                                {company.razon_social}
                            </li>
                        ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className='select__container'>
                <label className='label__general'>Sucursales</label>
                <div className='select-btn__general'>
                    <div className={`select-btn ${selectBranchOffices ? 'active' : ''}`} onClick={openSelectBranchOffices} >
                        <div className='select__container_title'>
                            <p>{selectedBranchOffice ? branchOfficeXCompanies.find((s: {id: number}) => s.id === selectedBranchOffice)?.nombre : 'Selecciona'}</p>
                        </div>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                    </div>
                    <div className={`content ${selectBranchOffices ? 'active' : ''}`} >
                        <ul className={`options ${selectBranchOffices ? 'active' : ''}`} style={{ opacity: selectBranchOffices ? '1' : '0' }}>
                        {branchOfficesFiltering.map((sucursal: any) => (
                            <li key={sucursal.id} onClick={() => handleBranchOfficesChange(sucursal)}>
                            {sucursal.nombre}
                            </li>
                        ))}
                        </ul>
                    </div>
                </div>
            </div>
        
            <div className="comments">
                <label className='label__general'>Comentarios</label>
                <input className='inputs__general' type='text' value={comments} onChange={(e) => setComments(e.target.value)} placeholder='Comentarios' />
            </div>
        </div>
        {selectedOption === 0 ? 
        <div className='conatiner__direct'>
            <div className='row__one'>
                <div className='select__container'>
                    <label className='label__general'>Buscar por</label>
                    <div className='select-btn__general'>
                        <div className={`select-btn ${selectTypeSearch ? 'active' : ''}`} onClick={openSelectModalTypeSearch}>                     
                            <p>{selectedTypeSearch !== null ? typeSearchs.find((s: {id: number}) => s.id === selectedTypeSearch)?.name : 'selecciona'}</p>
                            <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                        </div>
                        <div className={`content ${selectTypeSearch ? 'active' : ''}`}>
                            <ul className={`options ${selectTypeSearch ? 'active' : ''}`} style={{ opacity: selectTypeSearch ? '1' : '0' }}>
                            {typeSearchs && typeSearchs.map((type: any) => (
                                <li key={type.id} onClick={() => handleModalTypeSearchChange(type)}>
                                {type.name}
                                </li>
                            ))}
                            </ul>
                        </div>
                    </div>
                </div>
              
                <div>
                    <div>
                    <label className='label__general'>Buscador</label>
                    <input className='inputs__general' type='text' value={searchBy} onChange={(e) => setSearchBy(e.target.value)} placeholder='Ingresa el nombre' />
                    </div>
                </div>
                <div className='container__search'>
                    <button className='btn__general-purple btn__container' type='button' onClick={searchFor}>
                        Buscar
                        <svg className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
                    </button>
                </div>
            </div>
            <div className='row__two'>
                <div className='container__two'>
                    <div className='select__container'>
                    <label className='label__general'>Resultados</label>
                    <div className='select-btn__general'>
                        <div className={`select-btn ${selectModalResults ? 'active' : ''}`} onClick={openSelectModalResults}>
                            <p>{selectedModalResult ?  `${articles.find((s: {id: number}) => s.id === selectedModalResult.id)?.codigo} ${articles.find((s: {id: number}) => s.id === selectedModalResult.id)?.nombre}` : 'Selecciona'}</p>
                            <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                        </div>
                        <div className={`content ${selectModalResults ? 'active' : ''}`}>
                            <ul className={`options ${selectModalResults ? 'active' : ''}`} style={{ opacity: selectModalResults ? '1' : '0' }}>
                                {articles && articles.map((item: any) => (
                                <li key={item.id} onClick={() => handleModalResultsChange(item)}>
                                    {item.codigo}-{item.nombre}
                                </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    </div>
                    <div>
                        <button className='btn__general-purple' type='button' onClick={addArticles}>Agregar</button>
                    </div>
                </div>
            </div>
        </div>
        :
        <div className='conatiner__by-request'>
            <div className='row__one'>
                <div className='select__container'>
                    <label className='label__general'>Empresas</label>
                    <div className='select-btn__general'>
                        <div className={`select-btn ${selectByRequestCompanies ? 'active' : ''}`} onClick={openSelectByRequestCompanies}>
                            <div className='select__container_title'>
                                <p>{selectedByRequestCompany ? companiesXUsers.find((s: {id: number}) => s.id === selectedByRequestCompany)?.razon_social : 'Selecciona'}</p>
                            </div>
                            <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                        </div>
                        <div className={`content ${selectByRequestCompanies ? 'active' : ''}`}>
                            <ul className={`options ${selectByRequestCompanies ? 'active' : ''}`} style={{ opacity: selectByRequestCompanies ? '1' : '0' }}>
                            {companiesXUsers && companiesXUsers.map((company: any) => (
                                <li key={company.id} onClick={() => handleByRequestCompaniesChange(company)}>
                                {company.razon_social}
                                </li>
                            ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='select__container'>
                    <label className='label__general'>Sucursales</label>
                    <div className='select-btn__general'>
                        <div className={`select-btn ${selectByRequestBranchOffices ? 'active' : ''}`} onClick={openSelectByRequestBranchOffices}>
                            <div className='select__container_title'>
                                <p>{selectedByRequestBranchOffice ? filterByRequestBranchOffice.find((s: {id: number}) => s.id === selectedByRequestBranchOffice)?.nombre : 'Selecciona'}</p>
                            </div>
                            <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                        </div>
                        <div className={`content ${selectByRequestBranchOffices ? 'active' : ''}`} >
                            <ul className={`options ${selectByRequestBranchOffices ? 'active' : ''}`} style={{ opacity: selectByRequestBranchOffices ? '1' : '0' }}>
                                {filterByRequestBranchOffice.map((branchOffice: any) => (
                                <li key={branchOffice.id} onClick={() => handleByRequestBranchOfficesChange(branchOffice)}>
                                    {branchOffice.nombre}
                                </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div>
                    {/* Reparar esta perte del la clase de css */}
                    <label className='label__general'>Fechas</label>
                    <div className='container_dates__requisition'>
                        <input className='date' id="dateRangePicker2"  type="text" placeholder="Seleccionar rango de fechas" />
                    </div>
                </div>
            </div>
            <div className='row__three'>
                <div>
                    <div className='select__container'>
                    <label className='label__general'>Tipo</label>
                    <div className='select-btn__general'>
                        <div className={`select-btn ${selectByRequestTypes ? 'active' : ''}`} onClick={openSelectByRequestTypes} >
                            <p>{selectedByRequestType !== null ? types.find((s: {id: number}) => s.id === selectedByRequestType)?.name : 'Selecciona'}</p>
                            <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                        </div>
                        <div className={`content ${selectByRequestTypes ? 'active' : ''}`} >
                            <ul className={`options ${selectByRequestTypes ? 'active' : ''}`} style={{ opacity: selectByRequestTypes ? '1' : '0' }}>
                                {types.map((branchOffice: any) => (
                                    <li key={branchOffice.id} onClick={() => handleByRequestTypesChange(branchOffice)}>
                                    {branchOffice.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div>
                    <button className='btn__general-purple' type='button' onClick={filterByRequest}>Filtrar</button>
                </div>
            </div>
        </div>
        <div className='row__four'>
            <div className='select__container'>
                <label className='label__general'>Serie</label>
                <div className='select-btn__general'>
                    <div className={`select-btn ${selectModalSeries ? 'active' : ''}`} onClick={openSelectModalSeries} >
                        <p>{selectedModalSerie ? series.find((s: {id: number}) => s.id === selectedModalSerie)?.nombre : 'Selecciona'}</p>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                    </div>
                    <div className={`content ${selectModalSeries ? 'active' : ''}`} >
                        <ul className={`options ${selectModalSeries ? 'active' : ''}`} style={{ opacity: selectModalSeries ? '1' : '0' }}>
                        {series.map((serie: any) => (
                            <li key={serie.id} onClick={() => handleModalSeriesChange(serie)}>
                            {serie.nombre}
                            </li>
                        ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div>
                <label className='label__general'>Folio</label>
                {/* <div className='warning__general' style={styleWarningName}><small >Este campo es obligatorio</small></div> */}
                <input className={`inputs__general ${warningInvoice}  ? 'warning' : ''}`} type="text" value={invoice} onChange={(e) => setInvoice(e.target.value)} placeholder='Ingresa el folio' />
            </div>
            <div className='container__search'>
                <button className='btn__general-purple btn__container' type='button' onClick={searchByRequest}>
                    Buscar
                    <svg className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
                </button>
            </div>
        </div>
        <div>
            <div className={`overlay__modal_concepts ${modalStateConcepts ? 'active' : ''}`}>
                <div className={`popup__modal_concepts ${modalStateConcepts ? 'active' : ''}`}>
                <a href="#" className="btn-cerrar-popup__modal_concepts" onClick={closeModalConcepts}>
                    <svg className='close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                </a>
                <p className='title__modals'>Detalles de conceptos</p>
                <div className='conatiner__concepts'>
                    {concepts.map((concepto: any, index: any) => (
                    <div className='row__one' key={index}>
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
                    <div className='row__two'>

                    </div>
                </div>
                </div>
            </div>
        </div>
        <div className='row__two'>
            <div className=''>
                {purchaseOrders.length > 0 ? (
                <div className='table__modal_filter_tickets' >
                    <div className='table__numbers'>
                        <p className='text'>Tus ordenes de compras</p>
                        <div className='quantities_tables'>{purchaseOrders.length}</div>
                    </div>
                    <div className='table__body'>
                        {purchaseOrders.map((x: any, index: any) => (
                        <div className='tbody__container' key={index}>
                            <div className='tbody'>
                                <div className='td'>
                                    {x.empresa}
                                </div>
                                <div className='td'>
                                    ({x.sucursal})
                                </div>
                                <div className='td'>
                                    {x.fecha_creacion}
                                </div>
                                <div className='td'>
                                    <div>
                                        <button onClick={() => openModalConcepts(x)} type='button' className='btn__general-purple'>Ver conceptos</button>
                                    </div>
                                </div>
                                <div className='td'>
                                    <div>
                                        <button className='btn__general-purple' type='button' onClick={() => addArticlesByRequest(x)}>Agregar</button>
                                    </div>                                    
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
                ) : (
                    <p className='text'>No hay ordes de compras que mostrar</p>
                )}                
                </div>
            </div>
        </div>
        }
        <div className=''>
            <div className='table__modal_create_tickets' >
                <div>
                    <div>
                        {conceptos ? (
                        <div className='table__numbers'>
                            <p className='text'>Total de articulos</p>
                            <div className='quantities_tables'>{conceptos.length}</div>
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
                    {conceptos.length > 0 ? (
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
                                        <select className='traditional__selector' onChange={(event) => handleSelectUnits(event, index)} value={selectedUnit[index] || ''}>
                                            {article.units && article.units.map((unit: any) => (
                                            <option key={unit.id} value={unit.id}>
                                                {unit.nombre}
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
                                        {article.suppliers && article.suppliers.map((item: any) => (
                                        <option key={item.id} value={item.id}>
                                            {item.proveedor}
                                        </option>
                                        ))}
                                    </select>
                                </div>
                                <div className='td'>
                                    <select className='traditional__selector' onChange={(event) => handleStoreChange(event, index)} value={selectedStore[index] || ''} >
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
        <div>
            <button className='btn__general-purple' type='submit'>Crear nueva entrada</button>
        </div>
    </form>
  )
}

export default ModalCreate
