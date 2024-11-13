import React, { useState, useEffect} from 'react';
import { companiesRequests } from '../../../../fuctions/Companies';
import { BranchOfficesRequests } from '../../../../fuctions/BranchOffices';
import { areasRequests } from '../../../../fuctions/Areas';
import { storeSeries } from '../../../../zustand/Series';
import useUserStore from '../../../../zustand/General';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/l10n/es.js'; // Importar el idioma español
import './styles/Requisition.css'
import ModalRequisition from './requisition/ModalRequisition';
// import ModalUpdate from './requisition/ModalUpdate';
import { storeRequisitions } from '../../../../zustand/Requisition'
import { RequisitionRequests } from '../../../../fuctions/Requisition';
import { useStore } from 'zustand';
import Select from '../../Dynamic_Components/Select';
import { useSelectStore } from '../../../../zustand/Select';

const Requisition: React.FC = () => {

  const setModalStateCreate = storeRequisitions((state: any) => state.setModalStateCreate);

  const setConcepts = storeRequisitions((state: any) => state.setConcepts);

  const setDataGet = storeRequisitions((state: any) => state.setDataGet);
  const setRequisitions = storeRequisitions((state: any) => state.setRequisitions);
  
  const setUpdateToRequisition = storeRequisitions((state: any) => state.setUpdateToRequisition);

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

  const {getCompaniesXUsers}: any = companiesRequests();
  const [companiesXUsers, setCompaniesXUsers] = useState<any>()

  const {getBranchOffices}: any = BranchOfficesRequests();
  const [branchOfficeXCompanies, setBranchOfficeXCompanies] = useState<any>()

  const {getAreas}: any = areasRequests();
  const [areasXBranchOfficesXUsers, setAreasXBranchOfficesXUsers] = useState<any>()

  
  const {getRequisition}: any = RequisitionRequests();

  const {requisitions}: any = useStore(storeRequisitions);
  //----------------------------------------------------ESTRUCTURA ACTUAL BORRAR TODO LO QUE NO SE USE APARTIR DE ESTE PUNTO
  
  const selectedIds = useSelectStore((state) => state.selectedIds);
  const setSelectedId = useSelectStore((state) => state.setSelectedId);
  

  // Estados de advertencia para validar campos
  // Warning states to validate fields
  const [warningName] = useState<boolean>(false)
 

  const { series, getSeriesXUser }: any = storeSeries(); 
  const userState = useUserStore(state => state.user);
  let user_id = userState.id
  
  const fetch = async () => {
    
    let resultCompanies = await getCompaniesXUsers(user_id)
    resultCompanies.unshift({id:0, razon_social:'Todos'})
    setCompaniesXUsers({
      selectName: 'Empresa',
      options: 'razon_social',
      dataSelect: [...resultCompanies]
    })
    setSelectedId('empresa', 0)

    let resultBrnach = await getBranchOffices(resultCompanies[0].id, user_id)
    await resultBrnach.unshift({id:0, nombre:'Todos'})

    setBranchOfficeXCompanies({
      selectName: 'Sucursal',
      options: 'nombre',
      dataSelect: [...resultBrnach]
    })
    setSelectedId('sucursal', 0)

    let resultAreas = await getAreas(resultBrnach[0].id, user_id)
    resultAreas.unshift({id:0, nombre:'Todos'})

    setAreasXBranchOfficesXUsers({
      selectName: 'Area',
      options: 'nombre',
      dataSelect: [...resultAreas]
    })
    setSelectedId('area', 0)

    if(selectedStartDate && selectedEndDate) {
      let data = {
        id_sucursal: resultBrnach[0].id,
        id_usuario: user_id,
        id_area: resultAreas[0].id,
        tipo: 0,
        desde: selectedStartDate?.toISOString().split('T')[0],
        hasta: selectedEndDate?.toISOString().split('T')[0],
        status: 0
      };
      setDataGet(data)
      let resultRequisition = await getRequisition(data)
      setRequisitions(resultRequisition)
    }
    getSeriesXUser({id:user_id, tipo_ducumento:0})
  }

  useEffect(() => {
    fetch()
  }, [])

  //Modales
  const modalCreate = () => {
    setModalStateCreate('create')
    setSelectedCompany(1)
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

  const [invoice, setInvoice] = useState<string>('')


  ////////////////////////
 /// Select de Empresas
////////////////////////

const fecht = async () => {
  let resultBrnach = await getBranchOffices(selectedIds.empresa, user_id)
  resultBrnach.unshift({id:0, nombre:'Todos'})

 setBranchOfficeXCompanies({
   selectName: 'Sucursal',
   options: 'nombre',
   dataSelect: [...resultBrnach]
 })
 setSelectedId('sucursal', 0)

 let resultAreas = await getAreas(resultBrnach[0].id, user_id)
 resultAreas.unshift({id:0, nombre:'Todos'})

 setAreasXBranchOfficesXUsers({
   selectName: 'Area',
   options: 'nombre',
   dataSelect: [...resultAreas]
 })
 setSelectedId('area', 0)
}

useEffect(() => {
  if (selectedIds != null){

    fecht()
  }
}, [selectedIds?.empresa]);

const fecht2 = async () => {
 let resultAreas = await getAreas(selectedIds.sucursal, user_id)
 resultAreas.unshift({id:0, nombre:'Todos'})

 setAreasXBranchOfficesXUsers({
   selectName: 'Area',
   options: 'nombre',
   dataSelect: [...resultAreas]
 })
 setSelectedId('area', 0)
}
useEffect(() => {
  if (selectedIds != null){

    fecht2()
  }
}, [selectedIds?.sucursal]);
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
  // getRequisition(0, 0, 0, user_id, 0, 0, startDateString, endDateString, 0);
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


const [status, setStatus] = useState<number>(0)


const handleClick = (value: any) => {
  if (value) {
      setStatus(value)
      switch (value) {
          case '0':
              if (selectedStartDate && selectedEndDate) {
                  const startDateString = selectedStartDate.toISOString().split('T')[0];
                  const endDateString = selectedEndDate.toISOString().split('T')[0];
                  getRequisition(0, 0, 0, user_id, 0, 0, startDateString, endDateString, 0);
              }
              break;
          case '1':
              if (selectedStartDate && selectedEndDate) {
                  const startDateString = selectedStartDate.toISOString().split('T')[0];
                  const endDateString = selectedEndDate.toISOString().split('T')[0];
                  getRequisition(0, 0, 0, user_id, 0, 0, startDateString, endDateString, 1);
              }
              break;
          case '2':
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

  const searchByFolio = async () => {
    if (selectedStartDate && selectedEndDate) {
      let data = {

        id_sucursal: selectedIds.sucursal,
        id_usuario: user_id,
        id_area: selectedIds.area,
        tipo: 0,
        desde: selectedStartDate?.toISOString().split('T')[0],
        hasta: selectedEndDate?.toISOString().split('T')[0],
        status: status
      };
      let resultRequisition = await getRequisition(data)
      setRequisitions(resultRequisition)
    }
  }


  /* ================================================= Modal Create ==========================================================*/
  

  /* ================================================= Modal Update ==========================================================*/

  const modalUpdate = (requisition: any) => {
    setModalStateCreate('create')
    setUpdateToRequisition(requisition)
    setConcepts(requisition.conceptos)
  }



  const styleWarningName = {
    opacity: warningName === true ? '1' : '',
    height: warningName === true ? '23px' : ''
  }


  return (
    <div className='requisition'>
      <div className='container__requisition'>  
      <div className='row__one'>
        <div className='select__container'>
          <Select dataSelects={companiesXUsers} instanceId='empresa' nameSelect={'Empresa'} />
        </div>
        <div className='select__container'>
          <Select dataSelects={branchOfficeXCompanies} instanceId='sucursal' nameSelect={'Sucursal'} />

        </div>
        <div className='select__container'>
        <Select dataSelects={areasXBranchOfficesXUsers} instanceId='area' nameSelect={'Area'} />

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
                <input className='checkbox' type="checkbox" checked={status == 0 ? true : false} onClick={() => handleClick('0')}/>
                <span className="checkmark__general"></span>
              </label>
              <p className='text'>Activo</p>
            </div>
            <div className='checkbox__requisition'>
              <label className="checkbox__container_general">
                <input className='checkbox' type="checkbox" checked={status == 1 ? true : false} onClick={() => handleClick('1')}/>
                <span className="checkmark__general"></span>
              </label>
              <p className='text'>Cancelados</p>
            </div>
            <div className='checkbox__requisition'>
              <label className="checkbox__container_general">
                <input className='checkbox' type="checkbox" checked={status == 2 ? true : false} onClick={() => handleClick('2')}/>
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
      <ModalRequisition />
      {/* <ModalUpdate /> */}
                
      <div className='table__requisicion'>
        <div>
        {requisitions ? (
          <div>
            <p>Tus requisiciónes {requisitions.length}</p>
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
                      <p>{requisition.tipo == 0 ? 'Normal' : 'Diferencial'}</p>
                    </div>
                    <div className='td'>
                      <p>{requisition.status == 0 ?  <div className='active-status'><p>Activo</p></div> : ''}</p>
                      <p>{requisition.status == 1 ?  <div className='canceled-status'><p>Cancelada</p></div> : ''}</p>
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

    </div>
    </div>
  );
};

export default Requisition;
