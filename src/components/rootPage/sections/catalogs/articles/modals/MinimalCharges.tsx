import React, { useEffect, useState } from 'react'
import useUserStore from '../../../../../../zustand/General'
import { storeArticles } from '../../../../../../zustand/Articles'
import { useStore } from 'zustand'
import { storeModals } from '../../../../../../zustand/Modals'
import Select from '../../../../Dynamic_Components/Select'
import TemplatesRequests from '../../../../../../fuctions/Templates'
import { UnitsRequests } from '../../../../../../fuctions/Units'
import { UserGroupsRequests } from '../../../../../../fuctions/UserGroups'
import Concepts from './minimalCharges/Concepts'
import loadType from '../json/loadType.json'
import './style/MinimalCharges.css'
import { useSelectStore } from '../../../../../../zustand/Select'

const MinimalCharges: React.FC = () => {
    const userState = useUserStore(state => state.user);
    const user_id = userState.id;

    const setSubModal = storeArticles(state => state.setSubModal)

    const setModalSub = storeModals(state => state.setModalSub)

    const setMinimalCharges = storeArticles(state => state.setMinimalCharges)
    const setDeleteMinimalCharges = storeArticles(state => state.setDeleteMinimalCharges)

    const { subModal, minimalCharges, deleteMinimalCharges }: any = useStore(storeArticles)

    const { getTemplates }: any = TemplatesRequests()
    const [templates, setTemplates] = useState<any>([])
    
    const [from, setFrom] = useState<number | null>(null)
    const [until, setUntil] = useState<number | null>(null)
    const [value, setValue] = useState<number | null>(null)

    const { getUnits }: any = UnitsRequests()
    const [units, setUnits] = useState<any>([])
    const { getUserGroups }: any = UserGroupsRequests()
    const [userGroups, setUserGroups] = useState<any>([])

    const [typeCharges, setTypeCharges] = useState<any>([])

    const fetch = async () => {
        const resultTemplates = await getTemplates(user_id)
        setTemplates({
            selectName: 'Por',
            options: 'nombre',
            dataSelect: resultTemplates
        })

        const resultUnits = await getUnits()
        setUnits({
            selectName: 'Unidades',
            options: 'nombre',
            dataSelect: resultUnits
        })

        const resultUserGroup = await getUserGroups(user_id)
        setUserGroups({
            selectName: 'Grupos de usuarios',
            options: 'nombre',
            dataSelect: resultUserGroup
        })

        setTypeCharges({
            selectName: 'Tipo de cargo',
            options: 'name',
            dataSelect: loadType
        })
    }

    useEffect(() => {
        if (subModal == 'modal-minimal-charges') {
            fetch()

        }
    }, [subModal])

   const selectData: any = useSelectStore(state => state.selectedIds)
 

    const addMinimalCharges = () => {
        const data = {
            id_unidad: selectData?.units.id,
            desde: from,
            hasta: until,
            monto: value,
            por: 0,
            variable_multiplicacion: 0,
            grupo_de_usuario: selectData?.userGroups?.id,
            tipo: selectData?.typeCharges?.id,
            variable_descuento: 0,
            cantidad_descuento: 0
        };
        setMinimalCharges([...minimalCharges, data])
    }

    const [index, setIndex] = useState<any>(null)

    const concepts = (_: any, index: any) => {
        setModalSub('modal-sub-minimal-charges')
        setIndex(index)
   
    }


    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value.trim();
        const newTem = [...minimalCharges];
        newTem[index].desde = value === '' ? null : parseFloat(value);
        setMinimalCharges(newTem);
    };
    
    const handleUntilChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value.trim();
        const newTem = [...minimalCharges];
        newTem[index].hasta = value === '' ? null : parseFloat(value);
        setMinimalCharges(newTem);
    };
    

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value.trim();
        const newTem = [...minimalCharges];
        newTem[index].cantidad_descuento = value === '' ? null : parseFloat(value);
        setMinimalCharges(newTem);
    };
    
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value.trim();
        const newTem = [...minimalCharges];
        newTem[index].monto = value === '' ? null : parseFloat(value);
        setMinimalCharges(newTem);
    };

    const deleteMinimalCharge = (item: any) => {
        const filter = minimalCharges.filter((x: number) => x !== item);
        setMinimalCharges(filter);
        setDeleteMinimalCharges([...deleteMinimalCharges, item.id])
      };
    


    return (
        <div className={`overlay__modal_minimal-charges_modal-articles ${subModal == 'modal-minimal-charges' ? 'active' : ''}`}>
            <div className={`popup__modal_minimal-charges_modal-articles ${subModal == 'modal-minimal-charges' ? 'active' : ''}`}>
                <a className="btn-cerrar-popup__modal_minimal-charges_modal-articles" onClick={() => setSubModal('')}>
                    <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                </a>
                <p className='title__modals'>Cargos mínimos</p>
                <div className='row'>
                    <div className='col-4 md-col-6 sm-col-12'>
                        <label className='label__general'>Desde</label>
                        <div className='warning__general'><small >Este campo es obligatorio</small></div>
                        <input className={`inputs__general`} type="number" value={from == null ? '' : from} onChange={(e) => setFrom(parseFloat(e.target.value))} placeholder='Ingresa el rango' />
                    </div>
                    <div className='col-4 md-col-6 sm-col-12'>
                        <label className='label__general'>Hasta</label>
                        <div className='warning__general'><small >Este campo es obligatorio</small></div>
                        <input className={`inputs__general`} type="number" value={until == null ? '' : until} onChange={(e) => setUntil(parseFloat(e.target.value))} placeholder='Ingresa el rango' />
                    </div>
                    <div className='col-4 md-col-6 sm-col-12'>
                        <label className='label__general'>Valor</label>
                        <div className='warning__general'><small >Este campo es obligatorio</small></div>
                        <input className={`inputs__general`} type="number" value={value == null ? '' : value} onChange={(e) => setValue(parseFloat(e.target.value))} placeholder='Ingresa el valor' />
                    </div>
                </div>
                <div className='row my-4'>
                    <div className='col-2 md-col-6 sm-col-12'>
                        <Select dataSelects={templates} instanceId="templates" nameSelect='Campo Plantilla'/>
                    </div>
                    <div className='col-3 md-col-6 sm-col-12'>
                        <Select dataSelects={units} instanceId='units' nameSelect='Unidad'/>
                    </div>
                    <div className='col-3 md-col-6 sm-col-12'>
                        <Select dataSelects={typeCharges} instanceId='typeCharges' nameSelect='Tipo'/>
                    </div>
                    <div className='col-3 md-col-6 sm-col-12'>
                        <Select dataSelects={userGroups} instanceId='userGroups' nameSelect='Grupo de Usuario'/>
                    </div>
                    <div className='col-1 d-flex align-items-end'>
                        <button type='button' className='btn__general-purple' onClick={addMinimalCharges}>Agregar</button>
                    </div>
                </div>
                <div className='article__modal_minimal-charges_table' >
                    {minimalCharges ? (
                        <div className='table__numbers'>
                            <p className='text'>Total de cargos mínimos</p>
                            <div className='quantities_tables'>{minimalCharges.length}</div>
                        </div>
                    ) : (
                        <p className='text'>No hay empresas</p>
                    )}

                    <div className='table__head'>
                        <div className='thead'>
                            <div className='th'>
                                <p className=''>Desde</p>
                            </div>
                            <div className='th'>
                                <p className=''>Hasta</p>
                            </div>
                            <div className='th'>
                                <p className=''>Valor</p>
                            </div>
                            <div className='th'>
                                <p className=''>Cantidad</p>
                            </div>
                            <div className='th'>

                            </div>
                            <div className='th'>

                            </div>
                        </div>
                    </div>
                    {minimalCharges?.length > 0 ? (
                        <div className='table__body'>
                            {minimalCharges?.map((item: any, index: any) => (
                                <div className='tbody__container' key={index}>
                                    <div className='tbody'>
                                        <div className='td'>
                                            <input className='inputs__general' value={item.desde} onChange={(e) => handleFormChange(e, index)} type="text" placeholder='Desde'/>
                                        </div>
                                        <div className='td'>
                                            <input className='inputs__general' value={item.hasta} onChange={(e) => handleUntilChange(e, index)} type="text" placeholder='Hasta'/>
                                        </div>
                                        <div className='td'>
                                            <input className='inputs__general' value={item.monto} onChange={(e) => handleValueChange(e, index)} type="text" placeholder='Valor'/>
                                        </div>
                                        <div className='td'>
                                            <input className='inputs__general' value={item.cantidad_descuento} onChange={(e) => handleAmountChange(e, index)} type="text" placeholder='Cantidad'/>
                                        </div>
                                    
                                        <div className='td'>
                                            <button  className='btn__general-purple' type='button' onClick={() => concepts(item, index)}>Mas campos</button>
                                        </div>
                                        <div className='td'>
                                            <button className='btn__general-danger' type='button' onClick={() => deleteMinimalCharge(item)}>Eliminar</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className='text'>No hay máximos y mínimos que mostrar</p>
                    )}
                </div>
                <Concepts index={index}/>
            </div>
        </div>
    )
}

export default MinimalCharges
