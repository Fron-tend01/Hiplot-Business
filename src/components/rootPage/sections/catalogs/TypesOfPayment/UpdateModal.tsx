import React, { useEffect, useState } from 'react'
import { storeModals } from '../../../../../zustand/Modals'
import TemplatesRequests from '../../../../../fuctions/Templates';
import { useStore } from 'zustand';
import './CreateModal.css'
import useUserStore from '../../../../../zustand/General';
import { TypeOfPaymentsRequests } from '../../../../../fuctions/TypeOfPayments';
import { storeTypeOfPayments } from '../../../../../zustand/TypeOfPayments';

const UpdateModal = () => {
    const userState = useUserStore(state => state.user);
    let user_id = userState.id


    const [name, setName] = useState<any>()

    const setModal = storeModals(state => state.setModal);

    const {typeOfPaymentToUpdate}: any = useStore(storeTypeOfPayments)

    const {modal}: any = useStore(storeModals)

    const {getTemplates, getTemplatesxFields}: any = TemplatesRequests()
    const { updateTypeOfPayment}: any = TypeOfPaymentsRequests()
    const [templates, setTemplates] = useState<any>([])
    const [templatesFields, setTemplateFields] = useState<any>([])

    const [operations, setOperations] = useState<any>([])

    useEffect(() => {
      const fetch = async () => {
          let resultTemplates = await getTemplates(user_id);
          let resultTemplatesFields = await getTemplatesxFields();
          setTemplates(resultTemplates);
          setTemplateFields(resultTemplatesFields);
      };
      fetch();
  }, [user_id]);

  useEffect(() => {
      if (typeOfPaymentToUpdate) {
          setName(typeOfPaymentToUpdate.nombre);
          setOperations(typeOfPaymentToUpdate.operaciones_obj);
          setSelectedType(typeOfPaymentToUpdate.operaciones_obj.map((op: any) => op.id_plantillas_art_campos || op.operacion));
      }
  }, [typeOfPaymentToUpdate]);
    const [selectedType, setSelectedType] = useState<any[]>([])



    useEffect(() => {
      setName(typeOfPaymentToUpdate.nombre)
      setOperations(typeOfPaymentToUpdate.operaciones_obj)
  }, [])
  
    useEffect(() => {
        if(typeOfPaymentToUpdate) {
          setOperations([
            {
                title: 'Campo',
                id: 0,
                defaultId: typeOfPaymentToUpdate.operaciones_obj[0].id_plantillas_art_campos,
                fields: templatesFields,
                selectTypes: false,

                id_plantillas_art_campos: null,
                tipo: null,
                operacion: 0
            },
            {
                title: 'Operacion',
                id: 1,
                name: '+',
                defaultId: typeOfPaymentToUpdate ? typeOfPaymentToUpdate.operaciones_obj[0].id_plantillas_art_campos : null,
                selectTypes: false,
                fields: [
                    {
                        id: 0, nombre: 'Suma',
                    },
                    {
                        id: 1, nombre: 'Resta',
                    },
                    {
                        id: 2, nombre: 'Multiplicacion',
                    },{
                        id: 3, nombre: 'Division',
                    }
                ],

                id_plantillas_art_campos: 0,
                tipo: null,
                operacion: null
            },
            {
                title: 'Campo',
                id: 0,
                defaultId: typeOfPaymentToUpdate ? typeOfPaymentToUpdate.operaciones_obj[0].id_plantillas_art_campos : null,
                fields: templatesFields,
                selectTypes: false,
                id_plantillas_art_campos: null,
                tipo: null,
                operacion: 0
            }
        ]);
        }
    }, [templates, templatesFields, typeOfPaymentToUpdate]);

 
    const closeModal = () => {
        setModal('')
    }



    const openSelectTypes = (index: any) => {
        setOperations((prevOperations: any) => {
            return prevOperations.map((operation: any, i: any) => {
                if (i === index) {
                    return { ...operation, selectTypes: !operation.selectTypes };
                }
                return operation;
            });
        });
    }

    


    const handleSelectTypesChange = (type: any, index:  any) => {
        operations[index].field = type.id;
        const newSelected = [...selectedType];
        newSelected[index] = type.id;
        setSelectedType(newSelected)
        const newOperations = [...operations];
        newOperations[index].selectTypes = false;
        setOperations(newOperations);
    
        if(operations[index].title == 'Campo') {
            operations[index].id_plantillas_art_campos = type.id;
            operations[index].tipo = 0;
            return
        }

        if(operations[index].title == 'Operacion') {
            operations[index].operacion = type.id;
            operations[index].tipo = 1;
            return
        }

   
     
    }


    const addFields = () => {
        // Encuentra el valor máximo de id en el estado actual
        const maxId = operations.reduce((max: any, operation: any) => Math.max(max, operation.id), 0);
    
        // Determina el siguiente id a asignar
        const nextId = maxId + 1;  // Si deseas comenzar desde 4, puedes ajustar esto según tu necesidad
        const nextIdForCampo = nextId + 1;  // El siguiente id para el segundo objeto
    
        // Agrega los nuevos elementos con los identificadores incrementales
        setOperations((prevOperations: any) => [
            ...prevOperations,
            {
                title: 'Operacion',
                id: nextId,
                name: '+',
                selectTypes: false,
                fields: [
                    { id: 0, nombre: 'Suma' },
                    { id: 1, nombre: 'Resta' },
                    { id: 2, nombre: 'Multiplicacion' },
                    { id: 3, nombre: 'Division' }
                ],
                id_plantillas_art_campos: null,
                tipo: null,
                operacion: null
            },
            {
                title: 'Campo',
                id: nextIdForCampo,
                fields: templatesFields,
                id_field: null,
                id_fieldName: '',
                selectTypes: false,
                selectedType: null,
                id_plantillas_art_campos: null,
                tipo: null,
                operacion: null
            }
        ]);
    }
    

    const handleCreateTypeOfPayments = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let data = {
            nombre: name,
            operacion: operations
        }

        await updateTypeOfPayment(data)
    }

    console.log('selectedType', selectedType)



  return (
    <div className={`overlay__create_modal_type-payment ${modal == 'update_type-payment' ? 'active' : ''}`}>
        <div className={`popup__create_modal_type-payment ${modal == 'update_type-payment' ? 'active' : ''}`}>
            <a href="#" className="btn-cerrar-popup__create_modal_type-payment" onClick={closeModal}>
            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </a>
            <p className='title__modals'>Crear nuevo tipo de cobro</p>
            <form className='conatiner__create_modal_type-payment' onSubmit={handleCreateTypeOfPayments}>
                <div className='row__one'>
                    <div className='inputs__company'>
                        <label className='label__general'>Nombre</label>
                        <div className='warning__general'><small >Este campo es obligatorio</small></div>
                        <input className={`inputs__general`} value={name} onChange={(e) => setName(e.target.value)} type='text' placeholder='Ingresa la nombre' />
                    </div>
                    <div>
                        <button className='btn__general-purple' type='button' onClick={addFields} >Agregar mas campos</button>
                    </div>
                </div>
                <div className='row__two'>
                    {operations?.map((x: any, index: any) => (
                        <div key={`${x.id}-${index}`}>
                            <div className='select__container'>
                                <label className='label__general'>{x.title}</label>
                                <div className='select-btn__general'>
                                        <div className={`select-btn ${x.selectTypes ? 'active' : ''}`} onClick={() => openSelectTypes(index)}>
                                            <div className='select__container_title'>
                                                <p>{
                                                    selectedType?.length > 0 ?
                                                        selectedType[index] ?  x.fields.find((field: any) => field.id === selectedType[index] || selectedType[index].id_plantillas_art_campos )?.nombre : 'Selecciona'
                                                        :
                                                        'Selecciona'
                                                    }
                                                </p>
                                            </div>
                                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                                    </div>
                                    <div className={`content ${x.selectTypes ? 'active' : ''}`}>
                                        <ul className={`options ${x.selectTypes ? 'active' : ''}`} style={{ opacity: x.selectTypes ? '1' : '0' }}>
                                            {x.fields && x.fields.map((field: any) => (
                                                <li key={field.id} onClick={() => handleSelectTypesChange(field, index)}>
                                                    {field.nombre}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='create__units_btn_modal'>
                    <div>
                        <input className='btn__general-purple' type='submit' value="Crear tipo de cobro" />
                    </div>
                </div>
            </form>
        </div>
    </div>
  )
}

export default UpdateModal
