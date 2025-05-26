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
import APIs from '../../../../../../services/services/APIs'
import Swal from 'sweetalert2'

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
    const selectData: any = useSelectStore(state => state.selectedIds)
    const setSelectData: any = useSelectStore(state => state.setSelectedId)
    const fetch = async () => {
        const resultTemplates: any = await APIs.GetAny("get_campos_plantillas/get");
        // const resultTemplates = await getTemplates(user_id)
        setTemplates({
            selectName: 'Por',
            options: 'nombre',
            dataSelect: resultTemplates
        })

        // const resultUnits = await getUnits()
        // setUnits({
        //     selectName: 'Unidades',
        //     options: 'nombre',
        //     dataSelect: resultUnits
        // })

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
        // SELECCIONAR AUTOMATICAMENTE LOS SELECTS
        setSelectData('typeCharges', loadType[0])
        setSelectData('userGroups', resultUserGroup[0])
    }

    useEffect(() => {
        if (subModal == 'modal-minimal-charges') {
            fetch()

        }
    }, [subModal])




    const addMinimalCharges = () => {
        if (from < 0 || from == null || from == undefined ) {
            Swal.fire('Notificacion', 'Es necesario Ingresar un valor en el campo Desde', 'warning')
            return
        }
        if (until < 0 || until == null || until == undefined) {
            Swal.fire('Notificacion', 'Es necesario Ingresar un valor en el campo Hasta', 'warning')
            return
        }
        if (value < 0 || value == null || value == undefined) {
            Swal.fire('Notificacion', 'Es necesario Ingresar un valor en el campo Valor', 'warning')
            return
        }
        if (selectData?.userGroups?.id == null) {
            Swal.fire('Notificacion', 'Es necesario seleccionar un valor en el campo Grupo de Usuario', 'warning')
            return
        }
        if (selectData?.typeCharges?.id == null) {
            Swal.fire('Notificacion', 'Es necesario seleccionar un valor en el campo Tipo', 'warning')
            return
        }
        const data = {
            id_unidad: 16,//DATO DEL SCHEMA, NO NECESARIO 
            desde: from,
            hasta: until,
            monto: value,
            por: 0,//SIN USO PERO PREPARADO PARA ENVIAR DATOS SI SE LLEGA A REQUERIR LA OPCIÓN DE LA VARIABLE, DE MOMENTO FUNCIONA SOLO CON EL IMPORTE
            variable_multiplicacion: 0, //DATO DEL SCHEMA, NO NECESARIO 
            grupo_de_usuario: selectData?.userGroups?.id,
            tipo: selectData?.typeCharges?.id,
            variable_descuento: 0,//DATO DEL SCHEMA, NO NECESARIO 
            cantidad_descuento: 0//DATO DEL SCHEMA, NO NECESARIO 
        };
        setMinimalCharges([...minimalCharges, data])
    }

    const [index, setIndex] = useState<any>(null)

    const concepts = (_: any, index: any) => {
        console.log('CARGOS MINIMOS VER', minimalCharges[index]);

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


    const cambiarTipo = (e: React.ChangeEvent<HTMLSelectElement>, index: any) => {
        const value = e.target.value;
        const newTem = [...minimalCharges];
        newTem[index].tipo = parseInt(value);
        setMinimalCharges(newTem);
    };
    const cambiarGrupoUs = (e: React.ChangeEvent<HTMLSelectElement>, index: any) => {
        const value = e.target.value;
        const newTem = [...minimalCharges];
        newTem[index].grupo_de_usuario = parseInt(value);
        setMinimalCharges(newTem);
    };
    return (
        <div className={`overlay__modal_minimal-charges_modal-articles ${subModal == 'modal-minimal-charges' ? 'active' : ''}`}>
            <div className={`popup__modal_minimal-charges_modal-articles ${subModal == 'modal-minimal-charges' ? 'active' : ''}`}>
                <a className="btn-cerrar-popup__modal_minimal-charges_modal-articles" onClick={() => setSubModal('')}>
                    <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                </a>
                <div className='card'>
                    <div className="card-title">Datos Cargo Mínimo</div>

                    <div className='row  '>

                        <div className='col-2 md-col-6 sm-col-12'>
                            <label className='label__general'>Desde</label>
                            <input className={`inputs__general`} type="number" value={from == null ? '' : from} onChange={(e) => setFrom(parseFloat(e.target.value))} placeholder='Ej. 1-9999' />
                        </div>
                        <div className='col-2 md-col-6 sm-col-12'>
                            <label className='label__general'>Hasta</label>
                            <input className={`inputs__general`} type="number" value={until == null ? '' : until} onChange={(e) => setUntil(parseFloat(e.target.value))} placeholder='Ej. 1-9999' />
                        </div>
                        <div className='col-2 md-col-6 sm-col-12'>
                            <label className='label__general'>Valor</label>
                            <input className={`inputs__general`} type="number" value={value == null ? '' : value} onChange={(e) => setValue(parseFloat(e.target.value))} placeholder='Ej. 1-9999' />
                        </div>
                        {/* <div className='col-2 md-col-6 sm-col-12' title='Define la variable que va a tomar en cuenta para aplicar el Cargo Minimo'>
                        <Select dataSelects={templates} instanceId="templates" nameSelect='Variable'/>
                    </div> */}
                        <div className='col-2 md-col-6 sm-col-12' title='Solo disponible el cargo de aumento'>
                            <Select dataSelects={typeCharges} instanceId='typeCharges' nameSelect='Tipo' />
                        </div>
                        <div className='col-3 md-col-6 sm-col-12'>
                            <Select dataSelects={userGroups} instanceId='userGroups' nameSelect='Grupo de Usuario' />
                        </div>
                        <div className='col-1 d-flex align-items-end'>
                            <button type='button' className='btn__general-purple' onClick={addMinimalCharges}>Agregar</button>
                        </div>
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
                                <p className=''>Tipo</p>
                            </div>
                            <div className='th'>
                                <p className=''>Grupo de Usuario</p>

                            </div>
                            <div className='th'>

                            </div>
                        </div>
                    </div>
                    {minimalCharges?.length > 0 ? (
                        <div className='table__body'>
                            {minimalCharges?.map((item: any, index: any) => (
                                <div className={`tbody__container ${index % 2 === 0 ? 'striped' : ''}`} key={index}>
                                    <div className='tbody'>
                                        <div className='td'>
                                            <input className='inputs__general' value={item.desde} onChange={(e) => handleFormChange(e, index)} type="text" placeholder='Desde' />
                                        </div>
                                        <div className='td'>
                                            <input className='inputs__general' value={item.hasta} onChange={(e) => handleUntilChange(e, index)} type="text" placeholder='Hasta' />
                                        </div>
                                        <div className='td'>
                                            <input className='inputs__general' value={item.monto} onChange={(e) => handleValueChange(e, index)} type="text" placeholder='Valor' />
                                        </div>
                                        <div className='td'>
                                            <select className='inputs__general' value={item.tipo} onChange={(e) => cambiarTipo(e, index)} disabled={true}>
                                                {typeCharges?.dataSelect?.length > 0 && typeCharges?.dataSelect?.map((itemx: any) => (
                                                    <option key={itemx.id} value={itemx.id}>
                                                        {itemx.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className='td'>
                                            <select className='inputs__general' value={item.grupo_de_usuario} onChange={(e) => cambiarGrupoUs(e, index)}>
                                                {userGroups?.dataSelect?.length > 0 && userGroups?.dataSelect?.map((itemx: any) => (
                                                    <option key={itemx.id} value={itemx.id}>
                                                        {itemx.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {/* <div className='td'>
                                            <button  className='btn__general-purple' type='button' onClick={() => concepts(item, index)}>Mas campos</button>
                                        </div> */}
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
                <Concepts index={index} />
            </div>
        </div>
    )
}

export default MinimalCharges
