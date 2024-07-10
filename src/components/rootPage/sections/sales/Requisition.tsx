import React, { useState, useEffect} from 'react';
import { storeCompanies } from '../../../../zustand/Companies';
import { storeBranchOffcies } from '../../../../zustand/BranchOffices';
import { storeAreas } from '../../../../zustand/Areas';
import { storeSeries } from '../../../../zustand/Series';
import { storeArticles } from '../../../../zustand/Articles';
import { storeRequisitions } from '../../../../zustand/Requisition';
import useUserStore from '../../../../zustand/General';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/l10n/es.js'; // Importar el idioma español
import './styles/Requisition.css'


const Requisition: React.FC = () => {

  // Modales
  const [modalState, setModalState] = useState<boolean>(false)
  const [modalStateUpdate, setModalStateUpdate] =  useState<boolean>(false)

  // Selects
  const [selectCompanies, setSelectCompanies] = useState<boolean>(false);
  const [selectBranchOffices, setSelectBranchOffices] = useState<boolean>(false);
  const [selectAreas, setSelectAreas] = useState<boolean>(false);
  const [selectTypes, setSelectTypes] = useState<boolean>(false);
  const [selectSeries, setSelectSeries] = useState<boolean>(false)

  const [selectedCompany, setSelectedCompany] = useState<number | null>(null)
  const [selectedBranchOffice, setSelectedBranchOffice] = useState<number | null>(null);
  const [selectedArea, setSelectedArea] = useState<number | null>(null)
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [selectedSerie, setSelectedSerie] = useState<number | null>(null)

  // Select Modals
  const [selectModalCompanies, setSelectModalCompanies] = useState<boolean>(false);
  const [selectModalBranchOffices, setSelectModalBranchOffices] = useState<boolean>(false);
  const [selectModalAreas, setSelectModalAreas] = useState<boolean>(false);

  const [selectedModalCompany, setSelectedModalCompany] = useState<number | null>(null)
  const [selectedModalBranchOffice, setSelectedModalBranchOffice] = useState<number | null>(null);
  const [selectedModalArea, setSelectedModalArea] = useState<number | null>(null)

  // Estados de advertencia para validar campos
  // Warning states to validate fields
  const [warningName, setWarningName] = useState<boolean>(false)
 
  const {createRequisition, requisitions, getRequisition, pdtRequisition }: any = storeRequisitions();
  const {getCompaniesXUsers, companiesXUsers}: any = storeCompanies();
  const {getBranchOfficeXCompanies, branchOfficeXCompanies }: any = storeBranchOffcies();
  const { areasXBranchOfficesXUsers, getAreasXBranchOfficesXUsers }: any = storeAreas();
  const { series, getSeriesXUser }: any = storeSeries(); 
  const { getArticles }: any = storeArticles();
  const userState = useUserStore(state => state.user);
  let user_id = userState.id 

  useEffect(() => {
    getAreasXBranchOfficesXUsers(0, user_id)
    getBranchOfficeXCompanies(0, user_id)
    getCompaniesXUsers(user_id)

    getSeriesXUser(user_id)   

  }, [])

  //Modales
  const modalCreate = () => {
    setModalState(true)
    setSelectedCompany(1)
  }

  const modalCloseCreate = () => {
    setModalState(false)
    setWarningName(false)
  }

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

  let searchX = [
    {
      id: 0,
      name: 'Código'
    },
    {
      id: 1,
      name: 'Nombre'
    },



  ]

 
  
  const [filteredBranchOffices, setFilteredBranchOffices] = useState<any[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<any[]>([]);
  const [invoice, setInvoice] = useState<string>('')


  ////////////////////////
 /// Select de Empresas
////////////////////////


  const handleCompaniesChange = async (company: any) => {
    setSelectedCompany(company.id)
    setSelectCompanies(false);
    selectAutomaticBranch(company.id);
    if (selectedStartDate && selectedEndDate) {
      const startDateString = selectedStartDate.toISOString().split('T')[0];
      const endDateString = selectedEndDate.toISOString().split('T')[0];
      getRequisition(0, 0, 0, user_id, 0, 0, startDateString, endDateString, 0);
    }
  }


  const selectAutomaticBranch = (company_id: number) => {
    const idSelectedBranchOffice = branchOfficeXCompanies.filter((branchOffice: any) => branchOffice.empresa_id === company_id);
    setFilteredBranchOffices(idSelectedBranchOffice);
    setSelectedBranchOffice(idSelectedBranchOffice.length > 0 ? idSelectedBranchOffice[0].id : null);
  }

  ////////////////////////
 /// Select de Sucursales
////////////////////////
  const handleBranchOfficesChange = (branchOffice: any) => {
    setSelectedBranchOffice(branchOffice.id);
    setSelectBranchOffices(false)
    selectAutomaticArea(branchOffice.id)
    if (selectedStartDate && selectedEndDate) {
      const startDateString = selectedStartDate.toISOString().split('T')[0];
      const endDateString = selectedEndDate.toISOString().split('T')[0];
      getRequisition(0, 0, branchOffice.id, user_id, 0, 0, startDateString, endDateString, 0)
    }
    
  
    
 
  }
 

  const selectAutomaticArea = (branchOffice_id: number) => {
    const idSelectedArea = areasXBranchOfficesXUsers.filter((area: any) => area.sucursal_id === branchOffice_id)
    setFilteredAreas(idSelectedArea)
    setSelectedArea(idSelectedArea.length > 0 ? idSelectedArea[0].id : null);
  }




  useEffect(() => {
    if (selectedBranchOffice) {
      selectAutomaticArea(selectedBranchOffice);
    }
  }, [selectedBranchOffice, branchOfficeXCompanies]);
  

  ////////////////////////
 /// Select de areas
////////////////////////

  const handleAreasChange = (area: any) => {
    setSelectedArea(area.id)
    setSelectAreas(false)
    if (selectedStartDate && selectedEndDate) {
      const startDateString = selectedStartDate.toISOString().split('T')[0];
      const endDateString = selectedEndDate.toISOString().split('T')[0];
      getRequisition(0, 0, 0, user_id, area.id, 0, startDateString, endDateString, 0)
    }
  }


  const openSelectAreas = () => {
    setSelectAreas(!selectAreas)
    
  }

////////////////////////
/// Fechas
////////////////////////

// Estado para almacenar las fechas seleccionadas
const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

// Método para inicializar Flatpickr
const initFlatpickr = () => {
  const storedStartDate = localStorage.getItem('selectedStartDate');
  const storedEndDate = localStorage.getItem('selectedEndDate');

  const defaultStartDate = storedStartDate ? new Date(storedStartDate) : new Date();
  defaultStartDate.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00.000

  const defaultEndDate = storedEndDate ? new Date(storedEndDate) : new Date();
  defaultEndDate.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00.000

  const currentDate = new Date(); // Obtener la fecha actual
  currentDate.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00.000

  const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000); // Fecha de hace una semana

  setSelectedStartDate(oneWeekAgo);
  setSelectedEndDate(currentDate); // endDate siempre debe ser el día actual

  const startDateString = oneWeekAgo.toISOString().split('T')[0];
  const endDateString = currentDate.toISOString().split('T')[0];

  flatpickr('#dateRangePicker', {
    mode: 'range',
    dateFormat: 'Y-m-d',
    locale: 'es', // Establecer el idioma en español
    defaultDate: [startDateString, endDateString], // Establecer las fechas predeterminadas aquí
    onChange: (selectedDates) => {
      // Cuando se seleccionan fechas, actualiza los estados
      setSelectedStartDate(selectedDates[0]);
      setSelectedEndDate(selectedDates[1]);

      // Almacena las fechas seleccionadas en localStorage
      localStorage.setItem('selectedStartDate', selectedDates[0].toISOString());
      localStorage.setItem('selectedEndDate', selectedDates[1].toISOString());

      // Realizar la solicitud después de actualizar las fechas seleccionadas
      const startDateString = selectedDates[0].toISOString().split('T')[0];
      const endDateString = selectedDates[1].toISOString().split('T')[0];
      getRequisition(0, 0, 0, user_id, 0, 0, startDateString, endDateString, 0);
    }
  });
};

// Llamada a initFlatpickr después de que se renderiza el componente
useEffect(() => {
  initFlatpickr();
}, []);

useEffect(() => {
  const startDateString = selectedStartDate?.toISOString().split('T')[0];
  const endDateString = selectedEndDate?.toISOString().split('T')[0];
  getRequisition(0, 0, 0, user_id, 0, 0, startDateString, endDateString, 0);
}, [selectedStartDate, selectedEndDate]);



  ////////////////////////
 /// Select de tipos
////////////////////////

  const handleTypesChange = (type: any) => {
    setSelectedType(type.id)
    setSelectTypes(false)
    // const handleAreasChange = (area: any) => {
    //   setSelectedArea(area.id)
    //   setSelectAreas(false)
    //   if (selectedStartDate && selectedEndDate) {
    //     const startDateString = selectedStartDate.toISOString().split('T')[0];
    //     const endDateString = selectedEndDate.toISOString().split('T')[0];
    //     getRequisition(0, 0, 0, user_id, 0, type.id, startDateString, endDateString, 0)
    //   }
    // }
  
    
  }


  const openSelectTypes = () => {
    setSelectTypes(!selectTypes)
    
  }


  ////////////////////////
 /// Checks
////////////////////////


const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
  if (event.currentTarget.checked) {
      const valor = parseInt(event.currentTarget.value);

      switch (valor) {
          case 0:
              if (selectedStartDate && selectedEndDate) {
                  const startDateString = selectedStartDate.toISOString().split('T')[0];
                  const endDateString = selectedEndDate.toISOString().split('T')[0];
                  getRequisition(0, 0, 0, user_id, 0, 0, startDateString, endDateString, 0);
              }
              break;
          case 1:
              if (selectedStartDate && selectedEndDate) {
                  const startDateString = selectedStartDate.toISOString().split('T')[0];
                  const endDateString = selectedEndDate.toISOString().split('T')[0];
                  getRequisition(0, 0, 0, user_id, 0, 0, startDateString, endDateString, 1);
              }
              break;
          case 2:
              if (selectedStartDate && selectedEndDate) {
                  const startDateString = selectedStartDate.toISOString().split('T')[0];
                  const endDateString = selectedEndDate.toISOString().split('T')[0];
                  getRequisition(0, 0, 0, user_id, 0, 0, startDateString, endDateString, 2);
              }
              break;
          default:
              console.log("Valor desconocido");
              break;
      }


  }
};


  ////////////////////////
 /// Select de series
////////////////////////

  const handleSeriesChange = (serie: any) => {
    setSelectedSerie(serie.id)
    setSelectSeries(false)
   
  }


  const openSelectSeries = () => {
    setSelectSeries(!selectSeries)
    
  }

  const searchByFolio = ()=> {
    if (selectedStartDate && selectedEndDate) {
      const startDateString = selectedStartDate.toISOString().split('T')[0];
      const endDateString = selectedEndDate.toISOString().split('T')[0];
      getRequisition(invoice, selectedSerie, 0, user_id, 0, 0, startDateString, endDateString, 0)
    }
  }


  // Funciones de seleccionar
  // Select functions 

  const openSelectCompanies = () => {
    setSelectCompanies(!selectCompanies)
  }

  const openSelectBranchOffices = () => {
    setSelectBranchOffices(!selectBranchOffices)

  }
  
  /* ================================================= Modal Create ==========================================================*/
  const [title, setTitle] = useState<string>('')
  const [amount] = useState<number | null>(null)
  const [comentsModalCreate] = useState<string>('')
  const [selectSearch, setSelectSearch] = useState<boolean>(false)
  const [selectedSearch, setSelectedSearch] = useState<number | null>(null)
  const [nameBy, setNameBy] = useState<string | number>('')
  const [comments, setComments] = useState<string>('')

  const [filteredModalBranchOffices, setFilteredModalBranchOffices] = useState<any[]>([]);
  const [filteredModalAreas, setFilteredModalAreas] = useState<any[]>([]);

  const [selectResults, setSelectResults] = useState<boolean>(false)
  const [selectedResult, setSelectedResult]= useState<string | number>('')

const handleModalCompaniesChange = (company: any) => {
  setSelectedModalCompany(company.id);
  setSelectModalCompanies(false);
  updateSelectedBranchOffice(company.id);
}

const updateSelectedBranchOffice = (companyId: number) => {
  const idSelectedBranch = branchOfficeXCompanies.filter((branchOffice: any) => branchOffice.empresa_id === companyId);
  setFilteredModalBranchOffices(idSelectedBranch);
  setSelectedModalBranchOffice(idSelectedBranch.length > 0 ? idSelectedBranch[0].id : null);
}

// useEffect(() => {
//   if (selectedModalCompany) {
//     updateSelectedBranchOffice(selectedModalCompany);
//   }
// }, [selectedModalCompany, branchOfficeXCompanies]);


  const openSelectModalCompanies = () => {
    setSelectModalCompanies(!selectModalCompanies)
  }

  // Select y Onchange de Sucursales //

  const handleModalBranchOfficesChange = (branchOffice: any) => {
    setSelectedModalBranchOffice(branchOffice.id)
    setSelectModalBranchOffices(false)
    updateSelectedAreas(branchOffice.id)
  }

  const updateSelectedAreas = (branchOfficeId: number) => {
    const idSelectedArea = areasXBranchOfficesXUsers.filter((area: any) => area.sucursal_id === branchOfficeId)
    setFilteredModalAreas(idSelectedArea)
    setSelectedModalArea(idSelectedArea.length > 0 ? idSelectedArea[0].id : null);
  }

  useEffect(() => {
  if (selectedModalBranchOffice) {
    updateSelectedAreas(selectedModalBranchOffice);
  }
}, [selectedModalBranchOffice, branchOfficeXCompanies]);



  
  const openSelectModalBranchOffices = () => {
    setSelectModalBranchOffices(!selectModalBranchOffices)
  }



  const openSelectModalAreas = () => {
    setSelectModalAreas(!selectModalAreas)
  }

  const handleModalAreas = (area: any) => {
    setSelectedModalArea(area.id)
    setSelectModalAreas(false)
  }


  const openSelectSearch = () => {
    setSelectSearch(!selectSearch)
  }

  const handleSearchChange = (search: any) => {
    setSelectedSearch(search.id)
    setSelectSearch(false)
  }
 
  const [articles, setArticles] = useState<any>()
  
  const searchFor = async () => {
    let data = {
      id: 0,
      activos: true,
      nombre: selectedSearch == 1 ? nameBy : '',
      codigo:  selectedSearch == 0 ? nameBy : '',
      familia: 0,
      proveedor: 0,
      materia_prima: 0,
      get_sucursales: false,
      get_proveedores: true,
      get_max_mins: true,
      get_plantilla_data: false,
      get_stock: false,
      get_web: false,
      get_unidades: true
    }
    if (selectedSearch === 0) {
      let result = await getArticles(data)
      setArticles(result)
    } else if (selectedSearch === 1) {
      let result = await getArticles(data)
      setArticles(result)
    }

      // try {
      //   getarticles(0, true, '', nameBy, 0, 0, 0, false, false, true, false)
      // } catch (erro) {
      //   console.log(erro)
      // }
  }






  const [resultArticle, setResultArticle] = useState<any>()

  const handleResultsChange = (result: any) => {
    setSelectedResult(result.id)
    setSelectResults(false)
    setResultArticle(result)
  }

  const openSelectResults = () => {
    setSelectResults(!selectResults)
  }
  const [newRequisition, setNewRequisition] = useState<any[]>([]);

  const [conceptos, setConceptos] = useState<{id_proveedor: number | null, cantidad: number | null, descuento: number | null, unidad:string, precio_unitario: number | null, iva_on: any, comentarios: string, }[]>([]);


  const addRequisition = () => {
    if (articles.length > 0) {
    let art_tmp = articles.filter((x:any)=>x.id == selectedResult)
    let max;
    if (art_tmp[0].max_mins.find((x:any)=> x.id_sucursal == selectedModalBranchOffice)) {
      let mm_tmp = art_tmp[0].max_mins.filter((x:any)=> x.id_sucursal == x.id_sucursal)
      art_tmp[0].max_min = mm_tmp[0].maximo + ' - ' + mm_tmp[0].minimo
      max = mm_tmp[0].maximo + ' - ' + mm_tmp[0].minimo
    } else {
      max = art_tmp[0].max_min = 'N/A'

    }
      let id_articulo = resultArticle.id
      let codigo = resultArticle.codigo
      let descripcion = resultArticle.descripcion
      let unidades = resultArticle.unidades
      let max_min = max
      setConceptos((prevArticleStates: any) => [...prevArticleStates, {codigo, descripcion, max_min, id_articulo, cantidad: null, unidad: '', unidades, comentarios: '' }]);
    }
  }

  const deleteResult = (itemId: number) => {
    const updatedNewRequisition = newRequisition.filter((item: any) => item !== itemId);
    setNewRequisition(updatedNewRequisition);
  };



const [selectedUnit, setSelectedUnit] = useState<string[]>([]);

  const handleUnits = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const valueUnit = event.target.value;
    conceptos[index].unidad = valueUnit;
    // Crear una copia del arreglo de selecciones temporales
    const newSelected = [...selectedUnit];
    // Actualizar el valor seleccionado en la posición del índice correspondiente
    newSelected[index] = valueUnit;
    // Actualizar el estado con las nuevas selecciones
    setSelectedUnit(newSelected);
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
};














const [selectedOption, setSelectedOption] = useState<number | null>(null);
const handleCreateRequisition = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  let art_tmp = articles.filter((x:any)=>x.id == selectedResult)

  let id_usuario_crea = user_id
  let id_sucursal = selectedModalBranchOffice
  let id_area = selectedModalArea
  let titulo = title
  let tipo = selectedOption
  let comentarios = comentsModalCreate



  let concepto = [
    {
      id_articulo: art_tmp[0].id,
      cantidad: amount,
      unidad: art_tmp[0].unidad,
      costo_aprox: 0,
      comentarios: comments
    }
  ]

  let conceptos_elim: any[] = []

  try {
    
    createRequisition(id_usuario_crea, id_sucursal, tipo, id_area, titulo, comentarios, concepto, conceptos_elim)
    
    
  } catch {

  }

}

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Si el valor seleccionado es "normal", lo establecemos como 0
    if (value === "normal") {
      setSelectedOption(0);
    } 
    // Si el valor seleccionado es "diferencial", lo establecemos como 1
    else if (value === "diferencial") {
      setSelectedOption(1);
    } 
    // Si se selecciona un valor diferente, manejarlo según sea necesario
    else {
      // Agregar lógica adicional si es necesario
    }
  };


 
console.log(requisitions)


  /* ================================================= Modal Update ==========================================================*/

  const [dataSee, setDataSee] = useState<any[]>([])
  const [requisicion_id, setRequisicion_id] = useState<number | null>(null)

  const modalUpdate = (requisition: any) => {
    setModalStateUpdate(true)
    setDataSee([requisition])
    setRequisicion_id(requisition.id)
    
   
  }

  console.log(requisicion_id)


  const generatePdf = async () => {
      try {
          // Supongamos que tienes el ID de la requisición
          await pdtRequisition(requisicion_id);
      
          window.open(`https://bnprocura.onrender.com/pdf_requisicion/${requisicion_id}`, '_blank');
      } catch (error) {
          console.error('Error al generar el PDF:', error);
      }
  };
  
  
  // Llamar a la función para generar el PDF, pasando los datos obtenidos de la consulta

  

  

 

  const closeModalUpdate = () => {
    setModalStateUpdate(false)
  }



  const styleWarningName = {
    opacity: warningName === true ? '1' : '',
    height: warningName === true ? '23px' : ''
  }

  
  const [warningMaximum] = useState<boolean>(false)




  return (
    <div className='requisition'>
      <div className='container__requisition'>  
      <div className='row__one'>
        <div className='select__container'>
          <label className='label__general'>Empresas</label>
          <div className='select-btn__general'>
            <div className={`select-btn ${selectCompanies ? 'active' : ''}`} onClick={openSelectCompanies}>
              <p>{selectedCompany ? companiesXUsers.find((s: {id: number}) => s.id === selectedCompany)?.razon_social : 'Selecciona'}</p>
                <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
            </div>
            <div className={`content ${selectCompanies ? 'active' : ''}`}>
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
              <p>{selectedBranchOffice ? branchOfficeXCompanies.find((s: {id: number}) => s.id === selectedBranchOffice)?.nombre : 'Selecciona'}</p>
                <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
              </div>
              <div className={`content ${selectBranchOffices ? 'active' : ''}`} >
                <ul className={`options ${selectBranchOffices ? 'active' : ''}`} style={{ opacity: selectBranchOffices ? '1' : '0' }}>
                  {filteredBranchOffices.map((branchOffice: any) => (
                    <li key={branchOffice.id} onClick={() => handleBranchOfficesChange(branchOffice)}>
                      {branchOffice.nombre}
                    </li>
                  ))}
                </ul>
            </div>
          </div>
        </div>
        <div className='select__container'>
          <label className='label__general'>Areas  </label>
          <div className='select-btn__general'>
            <div className={`select-btn ${selectAreas ? 'active' : ''}`} onClick={openSelectAreas} >
              <p>{selectedArea ? filteredAreas.find((s: {id: number}) => s.id === selectedArea)?.nombre : 'Selecciona'}</p>
                <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
              </div>
              <div className={`content ${selectAreas ? 'active' : ''}`} >
              <ul className={`options ${selectAreas ? 'active' : ''}`} style={{ opacity: selectAreas ? '1' : '0' }}>
                {filteredAreas.map((area: any) => (
                  <li key={area.id} onClick={() => handleAreasChange(area)}>
                    {area.nombre}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className='select__container'>
          <label className='label__general'>Tipo</label>
          <div className='select-btn__general'>
            <div className={`select-btn ${selectTypes ? 'active' : ''}`} onClick={openSelectTypes} >
              <p>{selectedType ? types.find((s: {id: number}) => s.id === selectedType)?.name : types[0].name}</p>
                <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
              </div>
              <div className={`content ${selectTypes ? 'active' : ''}`} >
              <ul className={`options ${selectTypes ? 'active' : ''}`} style={{ opacity: selectTypes ? '1' : '0' }}>
                {types.map((type: any) => (
                  <li key={type.id} onClick={() => handleTypesChange(type)}>
                    {type.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className='row__two'>
      <div className='dates__requisition'>
        <div className='container_dates__requisition'>
          <input className='date' id="dateRangePicker" type="text" placeholder="Seleccionar rango de fechas" />
        </div>
      </div>
        <div>
          <div className='container__checkbox_requisition'>
            <div className='checkbox__requisition'>
              <label className="checkbox__container_general">
                <input className='checkbox' type="checkbox" value='0' onClick={handleClick}/>
                <span className="checkmark__general"></span>
              </label>
              <p className='text'>Activo</p>
            </div>
            <div className='checkbox__requisition'>
              <label className="checkbox__container_general">
                <input className='checkbox' type="checkbox" value='1' onClick={handleClick}/>
                <span className="checkmark__general"></span>
              </label>
              <p className='text'>Cancelados</p>
            </div>
            <div className='checkbox__requisition'>
              <label className="checkbox__container_general">
                <input className='checkbox' type="checkbox" value='2' onClick={handleClick}/>
                <span className="checkmark__general"></span>
              </label>
              <p className='text'>Terminados</p>
            </div>
          </div>
        </div>
      </div>
      <div className='row__three'>
        <div className='select__container'>
          <label className='label__general'>Serie</label>
          <div className='select-btn__general'>
            <div className={`select-btn ${selectSeries ? 'active' : ''}`} onClick={openSelectSeries} >
              <p>{selectedSerie ? series.find((s: {id: number}) => s.id === selectedSerie)?.nombre : 'Selecciona'}</p>
                <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
              </div>
              <div className={`content ${selectSeries ? 'active' : ''}`} >
              <ul className={`options ${selectSeries ? 'active' : ''}`} style={{ opacity: selectSeries ? '1' : '0' }}>
                {series.map((serie: any) => (
                  <li key={serie.id} onClick={() => handleSeriesChange(serie)}>
                    {serie.nombre}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div>
          <label className='label__general'>Folio</label>
            <div className='warning__general' style={styleWarningName}><small >Este campo es obligatorio</small></div>
          <input className={`inputs__general ${warningName ? 'warning' : ''}`} type="text" value={invoice} onChange={(e) => setInvoice(e.target.value)} placeholder='Ingresa el nombre' />
        </div>
        <div className='create__requisition_btn-container'>
          <div>
            <button className='btn__general-purple' onClick={searchByFolio}>Buscar</button>
          </div>
        </div>
        <div className='create__requisition_btn-container'>
          <div>
            <button className='btn__general-purple' onClick={modalCreate}>Crear nueva Requisición</button>
          </div>
        </div>
      </div>
      
      <div className={`overlay__requisition ${modalState ? 'active' : ''}`}>
        <div className={`popup__requisition ${modalState ? 'active' : ''}`}>
          <a href="#" className="btn-cerrar-popup__requisition" onClick={modalCloseCreate}>
            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
          </a>
          <p className='title__modals'>Crear nueva requisición</p>
          <form className='conatiner__create_requisition' onSubmit={handleCreateRequisition}>
            <div className='row__one'>
              <div className='container__checkbox_requisition'>
                <div className='checkbox__requisition'>
                  <label className="checkbox__container_general">
                  <input
                    className='checkbox'
                    type="radio"
                    value="normal"
                    checked={selectedOption === 0}
                    onChange={handleOptionChange}
                  />
                    <span className="checkmark__general"></span>
                  </label>
                  <p className='text'>Normal</p>
                </div>
                <div className='checkbox__requisition'>
                  <label className="checkbox__container_general">
                  <input
                    className='checkbox'
                    type="radio"
                    value="diferencial"
                    checked={selectedOption === 1}
                    onChange={handleOptionChange}
                  />
                    <span className="checkmark__general"></span>
                  </label>
                  <p className='text'>Diferencial</p>
                </div>
              </div>
            </div>
            <div className='row__two'>
              <div className='select__container'>
                <label className='label__general'>Empresas</label>
                <div className='select-btn__general'>
                  <div className={`select-btn ${selectModalCompanies ? 'active' : ''}`} onClick={openSelectModalCompanies}>
                    <p>{selectedModalCompany ? companiesXUsers.find((s: {id: number}) => s.id === selectedModalCompany)?.razon_social : 'Selecciona'}</p>
                      <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                  </div>
                  <div className={`content ${selectModalCompanies ? 'active' : ''}`} >
                    <ul className={`options ${selectModalCompanies ? 'active' : ''}`} style={{ opacity: selectModalCompanies ? '1' : '0' }}>
                      {companiesXUsers && companiesXUsers.map((company: any) => (
                        <li key={company.id} onClick={() => handleModalCompaniesChange(company)}>
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
                  <div className={`select-btn ${selectModalBranchOffices ? 'active' : ''}`} onClick={openSelectModalBranchOffices} >
                    <p>{selectedModalBranchOffice ? branchOfficeXCompanies.find((s: {id: number}) => s.id === selectedModalBranchOffice)?.nombre : 'Selecciona'}</p>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                  </div>
                  <div className={`content ${selectModalBranchOffices ? 'active' : ''}`} >
                    <ul className={`options ${selectModalBranchOffices ? 'active' : ''}`} style={{ opacity: selectModalBranchOffices ? '1' : '0' }}>
                      {filteredModalBranchOffices.map((sucursal: any) => (
                        <li key={sucursal.id} onClick={() => handleModalBranchOfficesChange(sucursal)}>
                          {sucursal.nombre}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className='select__container'>
                <label className='label__general'>Araes</label>
                <div className='select-btn__general'>
                  <div className={`select-btn ${selectModalAreas ? 'active' : ''}`} onClick={openSelectModalAreas} >
                    <p>{selectedModalArea ? filteredModalAreas.find((s: {id: number}) => s.id === selectedModalArea)?.nombre : 'Selecciona'}</p>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                  </div>
                  <div className={`content ${selectModalAreas ? 'active' : ''}`} >
                    <ul className={`options ${selectModalAreas ? 'active' : ''}`} style={{ opacity: selectModalAreas ? '1' : '0' }}>
                      {filteredModalAreas.map((area: any) => (
                        <li key={area.id} onClick={() => handleModalAreas(area)}>
                          {area.nombre}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <label className='label__general'>Título</label>
                <input className='inputs__general' type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Ingresa el título' />
              </div>
            </div>
            <div className='row__three'>
              <div className='select__container'>
                <label className='label__general'>Buscar por</label>
                <div className='select-btn__general'>
                  <div className={`select-btn ${selectSearch ? 'active' : ''}`} onClick={openSelectSearch} >
                    <p>{selectedSearch !== null ? searchX.find((s: {id: number}) => s.id === selectedSearch)?.name: 'selecciona'}</p>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                  </div>
                  <div className={`content ${selectSearch ? 'active' : ''}`} >
                    <ul className={`options ${selectSearch ? 'active' : ''}`} style={{ opacity: selectSearch ? '1' : '0' }}>
                      {searchX.map((search: any) => (
                        <li key={search.id} onClick={() => handleSearchChange(search)}>
                          {search.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <label className='label__general'>Buscador por nombre</label>
                <input className='inputs__general' type='text' value={nameBy} onChange={(e) => setNameBy(e.target.value)} placeholder='Ingresa el nombre' />
              </div>
              <div>
                <button className='btn__general-purple' type='button' onClick={searchFor}>Buscar</button>
              </div>
            </div>
            <div className='row__four'>
              <div className='container___row_four'>
                <div className='select__container'>
                  <label className='label__general'>Resultado</label>
                  <div className='select-btn__general'>
                    <div className={`select-btn ${selectResults  ? 'active' : ''}`} onClick={openSelectResults} >
                      <p>{selectedResult ? articles.find((s: {id: number}) => s.id === selectedResult)?.nombre : 'Selecciona'}</p>
                      <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                    </div>
                    <div className={`content ${selectResults ? 'active' : ''}`} >
                      <ul className={`options ${selectResults ? 'active' : ''}`} style={{ opacity: selectResults ? '1' : '0' }}>
                        {articles && articles.map((result: any) => (
                          <li key={result.id} onClick={() => handleResultsChange(result)}>
                            {result.nombre}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className='container__btn_modal_create-requisition'>
                  <button className='btn__general-purple' type='button' onClick={addRequisition}>Agregar</button>
                </div>
              </div>
              <div className='container__textarea_general'>
                <div className='textarea__container'>
                    <label className='label__general'>Comentario</label>
                    {/* <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div> */}
                    <textarea className={`textarea__general ${warningMaximum ? 'warning' : ''}`} value={comments} onChange={(e) => setComments(e.target.value)} placeholder='Comentarios' />
                </div>
              </div>
            </div>
            <div className='table__requisiciones' >
              <div>
                <div>
                  {newRequisition ? (
                  <div className='table__numbers'>
                    <p className='text'>Tus ordenes de compras</p>
                    <div className='quantities_tables'>{newRequisition.length}</div>
                  </div>
                  ) : (
                  <p className='text'>No hay empresas</p>
                  )}
                </div>
                <div className='table__head'>
                  <div className='thead'>
                    <div className='th'>
                      <p className=''>Código</p>
                    </div>
                    <div className='th'>
                      <p className=''>Descripción</p>
                    </div>
                    <div className='th'>
                      <p className=''>Cantidad</p>
                    </div>
                    <div className='th'>
                      <p className=''>Unidad</p>
                    </div>
                    <div className='th'>
                      <p className=''>Max</p>
                    </div>
                    <div className='th'>
                      <p className=''>Coment</p>
                    </div>
                  
                  </div>
                </div>
                {conceptos.length > 0 ? (
                  <div className='table__body'>
                     {conceptos.map((article: any, index: any) => (
                        <div className='tbody__container' key={index}>
                          <div className='tbody'>
                            <div className='td'>
                              {article.codigo}
                            </div>
                            <div className='td'>
                              {article.descripcion}
                            </div>
                            <div className='td'>
                              <div>
                                <input className='inputs__general' value={article.cantidad === null ? '' : article.cantidad.toString()} onChange={(e) => handleAmountChange(e, index)} type="number"  placeholder='Cantidad' />
                              </div>
                            </div>
                            <div className='td'>
                              <div>
                                <select className='traditional__selector' onChange={(event) => handleUnits(event, index)} value={selectedUnit[index] || ''}>
                                  <option value="">Seleccionar</option>
                                  {article.unidades && article.unidades.map((item: any) => (
                                    <option key={item.id} value={item.nombre}>
                                      {item.nombre}
                                    </option>
                                  ))}
                                </select>
                                {/* Aquí puedes mostrar las selecciones temporales si es necesario */}
                              </div>
                            </div>
                            <div className='td'>
                              {article.max_min}
                            </div>
                            <div className='td'>
                              <div>
                                <input className='inputs__general' value={article.comentarios === '' ? '' : article.comentarios} onChange={(e) => handleComentariosChange(e, index)} type="text"  placeholder='P/U' />
                              </div>
                            </div>
                            <div className='td'>
                              <button className='btn__delete_users' type='button' onClick={() => deleteResult(article)}>Eliminar</button>
                            </div>
                          </div>
                        </div>
                     ))}
                  </div>
                ) : (
                  <p className='text'>Cargando datos...</p>
                )}
              </div>
              <div>
                <button className='btn__general-purple' type='submit'>Crear nueva requisición</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className='table__requisicion'>
        <div>
        {branchOfficeXCompanies ? (
          <div>
            <p>Tus requisiciónes {branchOfficeXCompanies.length}</p>
          </div>
        ) : (
          <p></p>
        )}
        </div>
        <div className='table__head'>
          <div className='thead'>
            <div className='th'>
              <p>Folio</p>
            </div>
            <div className='th'>
              <p>Tipo</p>
            </div>
            <div className='th'>
              <p>Status</p>
            </div>
            <div className='th'>
              <p>Fecha</p>
            </div>
            <div className='th'>
              <p>Por</p>
            </div>
            <div className='th'>
              <p>Empresas</p>
            </div>
            <div className='th'>
              <p>Sucursal</p>
            </div>
            <div className='th'>
              <p>Areas</p>
            </div>
            <div className='th'>
              <p>Comentarios</p>
            </div>
          </div>
        </div>
        {requisitions ? (
        <div className='table__body'>
          {requisitions.map((requisition: any) => {
            return (
              <div className='tbody__container' key={requisition.id}>
                  <div className='tbody'>
                    <div className='td'>
                      <p>{requisition.folio}</p>
                    </div>
                    <div className='td'>
                      <p>{requisition.status}</p>
                    </div>
                    <div className='td'>
                      <div>
                        {requisition.status === 0 ? (
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'green' }}></div>
                        ) : requisition.status === 1 ? (
                          <span role="img" aria-label="Tacha">❌</span>
                        ) : requisition.status === 2 ? (  
                          <span role="img" aria-label="Palomita">&#x2705;</span>
                        ) : (
                          <span>No válido</span>
                        )}
                      </div>
                    </div>
                    <div className='td'>
                      <p>{requisition.fecha_creacion}</p>
                    </div>
                    <div className='td'>
                      <p>{requisition.usuario_crea}</p>
                    </div>
                    <div className='td'>
                      <p>{requisition.empresa}</p>
                    </div>
                    <div className='td'>
                      <p>{requisition.sucursal}</p>
                    </div>
                    <div className='td'>
                      <p>{requisition.area}</p>
                    </div>
                    <div className='td'>
                      <p>{requisition.comentarios}</p>
                    </div>
                    <div className='td'>
                      <button className='branchoffice__edit_btn' onClick={() => modalUpdate(requisition)}>Editar</button>
                    </div>
                  </div>
              </div>
            )
          } )}
        </div>
      ) : ( 
        <p>Cargando datos...</p> 
      )}
      </div>
      <div className={`overlay__update_areas ${modalStateUpdate ? 'active' : ''}`}>
          <div className={`popup__update_areas ${modalStateUpdate ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__update_areas" onClick={closeModalUpdate}>
              <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </a>
            <p className='title__modals'>Crear nueva requisición</p>
            {dataSee ? (
              dataSee.map((article: any) => (
                <form className='conatiner__update_requisition' onSubmit={handleCreateRequisition}>
                  <div className='row__one'>
                  <div className='container__checkbox_requisition'>
                    <div className='checkbox__requisition'>
                      <label className="checkbox__container_general">
                        <input
                          className='checkbox' type="radio"
                          value="normal"
                          checked={article.status === 0}
                        />
                        <span className="checkmark__general"></span>
                      </label>
                      <p className='text'>Normal</p>
                    </div>
                    <div className='checkbox__requisition'>
                      <label className="checkbox__container_general">
                        <input
                          className='checkbox'
                          type="radio"
                          value="diferencial"
                          checked={article.status === 1}
                        />
                        <span className="checkmark__general"></span>
                      </label>
                      <p className='text'>Diferencial</p>
                    </div>
                  </div>
                  </div>
                  <div className='row__two'>
                    <div className='select__container'>
                      <label className='label__general'>Empresas</label>
                      <div className='container__text_result'>
                        <p className='text__result' >{article.empresa}</p>
                      </div>
                      
                    </div>
                    <div className='select__container'>
                      <label className='label__general'>Sucursales</label>
                      <div className='container__text_result'>
                        <p className='text__result' >{article.sucursal}</p>
                      </div>
                    </div>
                    <div className='select__container'>
                      <label className='label__general'>Araes</label>
                      <div className='container__text_result'>
                        <p className='text__result'>{article.area}</p>
                      </div>
                    </div>
                    <div>
                      <label className='label__general'>Título</label>
                      <div className='container__text_result'>
                        <p className='text__result'>{article.titulo}</p>
                      </div>
                    </div>
                  </div>
                  <div className='row__three'>
                    <div className='container__textarea_general'>
                      <div className='textarea__container'>
                        <label className='label__general'>Comentario</label>
                        <div className='container__text_result'>
                          <p className='text__result' >{article.comentarios}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='table__requisiciones' >
                    <div>
                      <div>
                        {dataSee ? (
                        <div className='table__numbers'>     
                          <p className='text'>Tus ordenes de compras</p>
                          <div className='quantities_tables'>{dataSee.length}</div>
                        </div>
                        ) : (
                        <p className='text'>No hay empresas</p>
                        )}
                      </div>
                      <div className='table__head'>
                        <div className='thead'>
                          <div className='th'>
                            <p className=''>Código</p>
                          </div>
                          <div className='th'>
                            <p className=''>Descripción</p>
                          </div>
                          <div className='th'>
                            <p className=''>Cantidad</p>
                          </div>
                          <div className='th'>
                            <p className=''>Unidad</p>
                          </div>
                          <div className='th'>
                            <p className=''>Max</p>
                          </div>
                          <div className='th'>
                            <p className=''>Coment</p>
                          </div>
                        </div>
                      </div>
                      <div className='table__body' key={article.id}>
                        {article.conceptos.map((conceptos: any, index: number) => (
                          <div className='tbody__container' key={index}>
                            <div className='tbody'>
                              <div className='td'>
                                {conceptos.codigo}
                              </div>
                              <div className='td'>
                                {conceptos.descripcion}
                              </div>
                              <div className='td'>
                                {conceptos.cantidad}
                              </div>
                              <div className='td'>
                                {conceptos.unidad}
                              </div>
                              <div className='td'>
                                {conceptos.unidad}
                              </div>
                              <div className='td'>
                                {conceptos.unidad}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className='row__five'>
                    <div>
                      <button className='btn__general-purple' type='button' onClick={generatePdf}>PDF</button>
                    </div>
                    <div className='right'>
                      <button className='btn__general-danger'>Cancelar</button>
                      {/* <button>Activar</button> */}
                    </div>
                  </div>
                  <div className='row__six'>
                    <div className='container__modal_Update_btn_update'>
                      <button className='btn__general-purple' type='submit'>Actualizar cambios</button>
                    </div>
                  </div>
                </form>
            ))
            ) : (
              <p>Cargando datos...</p>
            )}
          </div>
      </div>
    </div>
    </div>
  );
};

export default Requisition;
