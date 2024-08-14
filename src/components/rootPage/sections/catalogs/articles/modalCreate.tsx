import React, { useEffect, useState } from 'react';
import { storeFamilies } from '../../../../../zustand/Families';
import { storeArticles } from '../../../../../zustand/Articles';
import useUserStore from '../../../../../zustand/General';
import BranchOffices from './modals/BranchOffices'; 
import Suppliers from './modals/Suppliers';
import MaxMin from './modals/MaxMin';
import Units from './modals/Units';
import Prices from './modals/Prices';
import Variations from './modals/Variations';
import Combinations from './modals/Combinations';
import Components from './modals/Components';
import DeliveryTimes from './modals/DeliveryTimes';
import MinimalCharges from './modals/MinimalCharges';
import AdditionalArticles from './modals/AdditionalArticles';
import './modalCreate.css'
import { useStore } from 'zustand';
import { TemplatesRequests } from '../../../../../fuctions/Templates';



interface BranchOffices {
  id: number;
  nombre: string;
  direccion: string;
  contacto: string;
  empresa_id: number;
}

const modalCreate: React.FC = () => {
    const { units }: any = useStore(storeArticles);

    const {branchOffices, maxsMins, suppliers, prices, variations, combinations }: any = useStore(storeArticles);

    const {getTemplates}: any = TemplatesRequests()

    const  setSubModal = storeArticles(state => state.setSubModal)
    

       // Modales Zustand
    const { setModalStateBrnachOffices, modalStateBrnachOffices } = useStore(storeArticles);
    const { setModalStateUnits, modalStateUnits, subModal } = useStore(storeArticles);

    const { setModalStateMaxsMins, modalStateMaxsMins } = useStore(storeArticles);
    const { setModalStateSuppliers, modalStateSuppliers } = useStore(storeArticles);

  const [type, setType] = useState<number | null>(null);
  const [code, setCode] = useState<string>('')
  const [description, setDescription] = useState<string>('')
//   const [contact, setContact] = useState<number | null>(null)
  const [selectedUnit,setSelectedUnit] = useState<string>('')
  const [selectedFamilie, setSelectedFamilie] = useState<number | null>(null)
  const [activeArticles] = useState<boolean>(true)
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedTypePayment, setSelectedTypePayment]= useState<number | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [baseMax, setBaseMax] = useState<number | null>(null)
  const [maxHeight, setMaxHeight] = useState<number | null>(null)
  const [multiples, setMultiples] = useState<number | null>(null)
  const [satKey, setSatKey] = useState<string>('')
  const [satUnit, setsatUnit] = useState<string>('')
  const [viewWeb, setViewWeb] = useState<boolean>(false)
  const [salesInstructions, setsalesInstructions] = useState<string>('')
  const [webNotes, setwebNotes] = useState<string>('')
  const [purchaseConditions, setPurchaseConditions] = useState<string>('')
  const [oRequest, setORequest] = useState<boolean>(false)
  const [sellStock, setSellStock]= useState<boolean>(false)
  const [Shortage, setShortage] = useState<boolean>(false)
  const [ExemptTax, setExemptTax] = useState<boolean>(false)
  

  //Selects
  const [selectUnits,setSelectUnits] = useState<boolean>(false)
  const [selectFamilies, setSelectFamilies] = useState<boolean>(false)
  const [selectTypePayment, setSelectTypePayment] = useState<boolean>(false)
  const [selectTemplates, setSelectTemplates] = useState<boolean>(false)
  
  const [warningSelectCompany] = useState<boolean>(false)

  const {families}: any = storeFamilies()
  const {createArticles, getArticlesInGlobal}: any = storeArticles();
  const userState = useUserStore(state => state.user);


  // Modales Zustand



  

  let user_id = userState.id

  const [templates, setTemplates] = useState<any>()

  const fecht = async () => {
    let result = await getTemplates(user_id)
    setTemplates(result)
  }

  useEffect(() => {

    fecht()
    console.log(templates)
  }, []);
  

 
// Seelect de Unidades //

let unit = [
    {
        id: 1,
        name: 'pza'
    },
    {
        id: 2,
        name: 'kg'
    },
    {
        id: 3,
        name: 'mts'
    },
    {
        id: 4,
        name: 'cms'
    }
];

  const openSelectUnits = () => {
    setSelectUnits(!selectUnits)

  }

  const handleUnitsChange = (unit: any) => {
    setSelectedUnit(unit.name)
    setSelectUnits(false)
  }


// Select de Familias //

let typePayments = [
    {
        id: 1,
        name: 'Por metros'
    },
    {
        id: 2,
        name: 'Por unidad'
    },
    {
        id: 3,
        name: 'Por centimetros'
    },
    {
        id: 4,
        name: 'Por kilos'
    }
];
  const openSelectFamilies = () => {
    
    setSelectFamilies(!selectFamilies)

  }

  const handleFamiliesChange = (familia: any) => {
    setSelectedFamilie(familia.id)
    setSelectFamilies(false)

  };



// Checkbox de Activo //

const handleCheckboxChange = (value: number) => {
    setType(value); // Actualiza el tipo seleccionado
  };

  
 

  const handleViewWebChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setViewWeb(e.target.checked);
  };


// Subir foto o tomar foto //

  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result) {
                setSelectedFile(reader.result as string);
            }
        };
        reader.readAsDataURL(fileList[0]);
    }
};


// Select de tipo de cobro //

  
  const openSelectedTypePayment = () => {
    setSelectTypePayment(!selectTypePayment)
  }

  const handleTypePaymentsChange = (typePayment: any) => {
    setSelectTypePayment(false)
    setSelectedTypePayment(typePayment.id)
};


// Select de plantillas //

  const openSelectTemplates = () => {
    setSelectTemplates(!selectTemplates)
}

  
const handleTemplatesChange = (template: any) => {
    setSelectedTemplate(template.id)
    setSelectTemplates(false)
}


  const handleCreateSuppliers = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let data = {
        tipo: type,
        codigo: code,
        descripcion: description,
        unidad: selectedUnit,
        id_familia: selectedFamilie,
        activo: activeArticles,
        imagen: selectedFile,
        tipo_de_cobro: selectedTypePayment,
        id_plantilla: selectedTemplate,
        base_max: baseMax,
        altura_max: maxHeight,
        multiplos_de: multiples,
        clave_sat: satKey,
        unidad_sat: satUnit,
        visualizacion_web: viewWeb,
        indicaciones: salesInstructions,
        notas_web: webNotes,
        condiciones_compra: purchaseConditions,
        bajo_pedido: oRequest,
        vender_sin_stock: sellStock,
        desabasto: Shortage,
        iva_excento: ExemptTax,
        sucursal: branchOffices,
        max_mins: maxsMins,
        proveedores: suppliers,
        variaciones: variations,
        combinaciones: combinations,
        unidades: units,
        precios: prices,
        sucursales_elim: [],
        max_mins_elim: [],
        proveedores_elim: []
    };

    let dataArticle = {
        id: 0,
        activos: true,
        nombre: '',
        codigo: '',
        familia: 0,
        proveedor: 0,
        materia_prima: 0,
        get_sucursales: false,
        get_proveedores: false,
        get_max_mins: false,
        get_plantilla_data: false,
        get_stock: false,
        get_web: false,
        get_unidades: false
      };

    try {
      await createArticles(data)
      await getArticlesInGlobal(dataArticle);

    } catch {

    }

  }

  

  const handleInputBaseMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim(); // Eliminar espacios en blanco alrededor
    setBaseMax(value === '' ? null : parseInt(value, 10));
  };


  const handleInputMaxHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim(); // Eliminar espacios en blanco alrededor
    setMaxHeight(value === '' ? null : parseInt(value, 10));
  };

  const handleInputMultiplesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim(); // Eliminar espacios en blanco alrededor
    setMultiples(value === '' ? null : parseInt(value, 10));
  };

  const handleORequestChange = (event: any) => {
    setORequest(event.target.checked)
  }
  const handleSellStockChange = (event: any) => {
    setSellStock(event.target.checked)
  }
  const handleShortageChange = (event: any) => {
    setShortage(event.target.checked)
  }
  const handleExemptTaxChange = (event: any) => {
    setExemptTax(event.target.checked)
  }

/*=================================================================================================================================================================================*/

    // Modal de sucursales //

    const openModalBranchOffcies = () => {
        setModalStateBrnachOffices('create')
    };




/*=================================================================================================================================================================================*/
    
    // Modal de Precios del modal de crear articulos //

    const modalPrices = () => {
        setSubModal('modal-prices')
    }


    
/*=================================================================================================================================================================================*/
    
    // Modal de MaxMin del modal de crear articulos //

    const modalMaxMin = () => {
        setModalStateMaxsMins('create')
    };
    



/*=================================================================================================================================================================================*/
    
    // Modal de unidad del modal de crear articulos //
    const modalUnits = () => {
        setModalStateUnits('create')
    };
    



/*=================================================================================================================================================================================*/

  // Modal de Componentes del modal de crear articulos

  const [modalStateComponents, setModalStateComponents] = useState<boolean>(false)

  const modalComponents = () => {
    setModalStateComponents(!modalStateComponents)
  }

/*=================================================================================================================================================================================*/

  // Modal de Variaciones del modal de crear articulos
  const [modalStateVariations, setModalStateVariations] = useState<boolean>(false)

  const modalVariations = () => {
    setModalStateVariations(!modalStateVariations)
  }

  /*=================================================================================================================================================================================*/

   // Modal de Variaciones del modal de crear articulos
   const [modalStateProductionAreas, setModalStateProductionAreas] = useState<boolean>(false)

   const modalProductionAreas = () => {
    setModalStateProductionAreas(!modalStateProductionAreas)
   }

   /*=================================================================================================================================================================================*/

    // Modal de proveedores del modal de crear articulos //


    const modalSuppliers = () => {
        setModalStateSuppliers('create')
    }

  
   /*=================================================================================================================================================================================*/


  
  return (
    <form className='conatiner__create_articles' onSubmit={handleCreateSuppliers}>
        <div className='row__form_articles-radios'>
            <div className='container__form_articles-radios'>
                <div className='checkbox__modal_articles'>
                    <label className="checkbox__container_general">
                        <input value={0} className='checkbox' type="checkbox" checked={type === 0} onChange={() => handleCheckboxChange(0)}/>
                        <span className="checkmark__general"></span>
                    </label>
                    <p className='text'>Materia prima</p>
                </div>
                <div className='checkbox__modal_articles'>
                    <label className="checkbox__container_general">
                        <input value={1} className='checkbox' type="checkbox" checked={type === 1} onChange={() => handleCheckboxChange(1)}/>
                        <span className="checkmark__general"></span>
                    </label>
                    <p className='text'>Servicio</p>
                </div>
            </div>
        </div>
        <div className='row__form_articles-one'>
            <div>
                <label className='label__general'>Código</label>
                <input className='inputs__general' type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder='Ingresa el código' />
            </div>
            <div>
                <label className='label__general'>Descripción</label>
                <input className='inputs__general' type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Ingresa la dirección' />
            </div>
            {/* <div>
                <label className='label__general'>Contacto</label>
                <input className='inputs__general' type="number" value={contact === null ? '' : contact} onChange={handleInputContactChange} placeholder='Ingresa el contacto' />
            </div> */}
            <div className='select__container'>
                <label className='label__general'>Unidad</label>
                <div className={`select-btn__general ${warningSelectCompany ? 'warning' : ''}`}>
                    <div className={`select-btn ${selectUnits ? 'active' : ''}`} onClick={openSelectUnits}>
                        <p>{selectedUnit ? units.find((s: {name: any}) => s.name === selectedUnit)?.name : 'Selecciona'}</p>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                    </div>
                    <div className={`content ${selectUnits ? 'active' : ''}`}>
                        <ul className={`options ${selectUnits ? 'active' : ''}`} style={{ opacity: selectUnits ? '1' : '0' }}>
                            {unit && unit.map((unit) => (
                                <li key={unit.name} onClick={() => handleUnitsChange(unit)}>
                                    {unit.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className='select__container'>
                <label className='label__general'>Familias</label>
                <div className={`select-btn__general ${warningSelectCompany ? 'warning' : ''}`}>
                    <div className={`select-btn ${selectFamilies ? 'active' : ''}`} onClick={openSelectFamilies}>
                        <p>{selectedFamilie ? families.find((s: {id: number}) => s.id === selectedFamilie)?.nombre : 'Selecciona'}</p>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                    </div>
                    <div className={`content ${selectFamilies ? 'active' : ''}`}>
                        <ul className={`options ${selectFamilies ? 'active' : ''}`} style={{ opacity: selectFamilies ? '1' : '0' }}>
                            {families && families.map((familia: any) => (
                                <li key={familia.id} onClick={() => handleFamiliesChange(familia)}>
                                    {familia.nombre}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div>
                <div>
                    <p className='label__general'>Activo</p>
                    <label className="switch">
                        <input type="checkbox" checked={activeArticles} />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>
        </div>
        <div className='row__form_articles-two'>
            <div className="container__upload_photo">
                <label  htmlFor="file-upload" className="custom-file-upload">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill='#fff' viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM385 231c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-71-71V376c0 13.3-10.7 24-24 24s-24-10.7-24-24V193.9l-71 71c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L239 119c9.4-9.4 24.6-9.4 33.9 0L385 231z"/></svg>
                        {' '}
                        Tomar foto
                    </span>
                </label>
                <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }}/>
                {selectedFile && (
                    <div className="background-image" style={{ backgroundImage: `url(${selectedFile})` }}>
                    </div>
                )}
            </div>
            <div className='select__container'>
                <label className='label__general'>Tipo de cobro</label>
                <div className={`select-btn__general ${warningSelectCompany ? 'warning' : ''}`}>
                    <div className={`select-btn ${selectTypePayment ? 'active' : ''}`} onClick={openSelectedTypePayment }>
                        <p>{selectedTypePayment ? typePayments.find((s: {id: number}) => s.id === selectedTypePayment)?.name : 'Selecciona'}</p>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                    </div>
                    <div className={`content ${selectTypePayment ? 'active' : ''}`}>
                        <ul className={`options ${selectTypePayment ? 'active' : ''}`} style={{ opacity: selectTypePayment ? '1' : '0' }}>
                            {typePayments && typePayments.map((typePayment: any) => (
                                <li key={typePayment.id} onClick={() => handleTypePaymentsChange(typePayment)}>
                                    {typePayment.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className='select__container'>
                <label className='label__general'>Plantillas</label>
                <div className={`select-btn__general ${warningSelectCompany ? 'warning' : ''}`}>
                    <div className={`select-btn ${selectTemplates ? 'active' : ''}`} onClick={openSelectTemplates}>
                        <p>{selectedTemplate ? templates.find((s: {id: number}) => s.id === selectedTemplate)?.nombre : 'Selecciona'}</p>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                    </div>
                    <div className={`content ${selectTemplates ? 'active' : ''}`}>
                        <ul className={`options ${selectTemplates ? 'active' : ''}`} style={{ opacity: selectTemplates ? '1' : '0' }}>
                            {templates && templates.map((familia: any) => (
                                <li key={familia.id} onClick={() => handleTemplatesChange(familia)}>
                                    {familia.nombre}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div>
                <label className='label__general'>Base Max</label>
                <input className='inputs__general' type="number" value={baseMax === null ? '' : baseMax} onChange={handleInputBaseMaxChange} placeholder='Ingresa la dirección' />
            </div>
            <div>
                <label className='label__general'>Altura Max</label>
                <input className='inputs__general' type="number" value={maxHeight === null ? '' : maxHeight} onChange={handleInputMaxHeightChange} placeholder='Ingresa el contacto' />
            </div>
            <div>
                <label className='label__general'>Multiplos</label>
                <input className='inputs__general' type="number" value={multiples === null ? '' : multiples} onChange={handleInputMultiplesChange} placeholder='Ingresa el contacto' />
            </div>
        </div>
        <div className='row__form_articles-three'>
            <div>
                <label className='label__general'>Clave SAT</label>
                <input className='inputs__general' type="text" value={satKey} onChange={(e) => setSatKey(e.target.value)} placeholder='Ingresa la dirección' />
            </div>
            <div>
                <label className='label__general'>Unidad SAT</label>
                <input className='inputs__general' type="text" value={satUnit} onChange={(e) => setsatUnit(e.target.value)} placeholder='Ingresa el contacto' />
            </div>
            <div>
                <p className='label__general'>Vista web</p>
                <label className="switch">
                    <input type="checkbox" checked={viewWeb}  onChange={handleViewWebChange} />
                    <span className="slider"></span>
                </label>
            </div>
        </div>
        <div className='row__form_articles-four'>
            <div>
                <label className='label__general'>Indicaciones de Ventas</label>
                <input className='inputs__general' type="text" value={salesInstructions} onChange={(e) => setsalesInstructions(e.target.value)} placeholder='Ingresa la dirección' />
            </div>
            <div>
                <label className='label__general'>Notas web</label>
                <input className='inputs__general' type="text" value={webNotes} onChange={(e) => setwebNotes(e.target.value)} placeholder='Ingresa el contacto' />
            </div>
            <div>
                <label className='label__general'>Condiciones de compra</label>
                <input className='inputs__general' type="text" value={purchaseConditions} onChange={(e) => setPurchaseConditions(e.target.value)} placeholder='Ingresa el contacto' />
            </div>
        </div>
        <div className='row__form_articles-five'>
            <div>
                <div>
                    <p className='label__general'>Bajo Pedido</p>
                    <label className="switch">
                        <input type="checkbox" checked={oRequest}  onChange={handleORequestChange} />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>
            <div>
                <div>
                    <p className='label__general'>Vender sin stock</p>
                    <label className="switch">
                        <input type="checkbox" checked={sellStock}  onChange={handleSellStockChange} />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>
            <div>
                <div>
                    <p className='label__general'>Desabasto</p>
                    <label className="switch">
                        <input type="checkbox" checked={Shortage}  onChange={handleShortageChange} />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>
            <div>
                <div>
                    <p className='label__general'>IVA Excento</p>
                    <label className="switch">
                        <input type="checkbox" checked={ExemptTax}  onChange={handleExemptTaxChange} />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>
        </div>
        <div className='row__form_articles-six'>
            <div>
                <div>
                    <button className='btn__general-purple' type='button' onClick={openModalBranchOffcies}>Sucursales</button>
                </div>
                <div className={`overlay__modal_branch-offices_creating_articles ${modalStateBrnachOffices == 'create' ? 'active' : ''}`}>
                    <div className={`popup__modal_branch-offices_creating_articles ${modalStateBrnachOffices == 'create' ? 'active' : ''}`}>
                        <BranchOffices />
                    </div>
                </div>
            </div>
            <div>
                <Prices /> 
                <div>
                    <button className='btn__general-purple' type='button' onClick={() => setSubModal('modal-prices')}>Precios</button>
                </div>
           
        </div>
        <div>
            <div>
                <button className='btn__general-purple' type='button' onClick={modalMaxMin}>Max-Min</button>
            </div>
            <div className={`overlay__modal_maxmin_creating_articles ${modalStateMaxsMins == 'create' ? 'active' : ''}`}>
                <div className={`popup__modal_maxmin_creating_articles ${modalStateMaxsMins ==  'create' ? 'active' : ''}`}>
                    <MaxMin />
                </div>
            </div>
                         
        </div>
        <div>
            <div>
                <button className='btn__general-purple' type='button' onClick={modalUnits}>Unidades</button>
            </div>
            <div className={`overlay__modal_units_creating_articles ${modalStateUnits == 'create'  ? 'active' : ''}`}>
                <div className={`popup__modal_units_creating_articles ${modalStateUnits == 'create' ? 'active' : ''}`} >
                    <Units />
                </div>
            </div>                   
        </div>
        <div>
            <div>
                <button className='btn__general-purple' type='button' onClick={() => setSubModal('modal-components')}>Componentes</button>
            </div>
            <Components />
        </div>
        <div>
            <div>
                <button className='btn__general-purple' type='button' onClick={() => setSubModal('create_modal_variations')}>Variaciones</button>
            </div>
            <Variations />
        </div>
        <div>
            <div>
                <button className='btn__general-purple' type='button' onClick={() => setSubModal('create_modal_combinations')}>Combinaciones</button>
            </div>
            <Combinations />
        </div>
        <div>
            <div>
                <button className='btn__general-purple' type='button' onClick={modalProductionAreas}>Areas de pro</button>
            </div>
            
        </div>
        <div>
            <div>
                <button className='btn__general-purple' type='button' onClick={modalSuppliers}>Proveedores</button>
            </div>
            <div className={`overlay__modal_suppliers_creating_articles ${modalStateSuppliers == 'create' ? 'active' : ''}`}>
                <div className={`popup__modal_suppliers_creating_articles ${modalStateSuppliers == 'create' ? 'active' : ''}`}>
                    <Suppliers/>
                </div>
            </div>
        </div>
        <div>
            <div>
                <button className='btn__general-purple' type='button' onClick={() => setSubModal('modal-delivery-times')}>T. Entrega</button>
            </div>
            <DeliveryTimes />
        </div>
        <div>
            <div>
                <button className='btn__general-purple' type='button' onClick={() => setSubModal('modal-minimal-charges')}>Cargos minimos</button>
            </div>
            <MinimalCharges />
        </div>
        <div>
            <div>
                <button className='btn__general-purple' type='button' onClick={() => setSubModal('modal-additiona-articles')}>Art. adicionales</button>
            </div>
            <AdditionalArticles />
        </div>
    </div>
    <div className='container__btns_branch-office'>
        <button className='btn__general-purple' type='submit'>Guardar articulo</button>
    </div>
    </form>
  )
}

export default modalCreate;
