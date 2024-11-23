import React, { useEffect, useRef, useState } from 'react'
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
import { companiesRequests } from '../../../../../../fuctions/Companies'
import { useSelectStore } from '../../../../../../zustand/Select'
import Swal from 'sweetalert2'

const CobrosFranquicia: React.FC = () => {
    const userState = useUserStore(state => state.user);
    
    let user_id = userState.id;
    const setSubModal = storeArticles(state => state.setSubModal)
    const setModalSub = storeModals(state => state.setModalSub)
    const setCobrosFranquicia = storeArticles(state => state.setCobrosFranquicia)
    const setDeleteCobros_franquicia = storeArticles(state => state.setDeleteCobros_franquicia)

    const { getCompaniesXUsers }: any = companiesRequests()
    const { getUserGroups }: any = UserGroupsRequests()


    const { subModal, cobros_franquicia, deleteCobros_franquicia, articleByOne }: any = useStore(storeArticles)

    const selectData = useSelectStore(state => state.selectedIds)
    const setSelectData = useSelectStore(state => state.setSelectedId)

    const [franquicias, setFranquicias] = useState<any>([])
    const [proveedores, setProveedores] = useState<any>([])
    const [userGroups, setUserGroups] = useState<any>([])
    const fetch = async () => {
        let resultCompanies = await getCompaniesXUsers(user_id)
  
        setFranquicias({
            selectName: 'Franquicias',
            options: 'razon_social',
            dataSelect: resultCompanies
        })
       
        setProveedores({
            selectName: 'Proveedores',
            options: 'razon_social',
            dataSelect: resultCompanies
        })
       
        let resultUserGroup = await getUserGroups(user_id)
        setUserGroups({
            selectName: 'Grupos de usuarios',
            options: 'nombre',
            dataSelect: resultUserGroup
        })
        // setSelectData('proveedor', resultCompanies[0]?.id)
        // setSelectData('grupo_us', resultUserGroup[0]?.id)

    }
    useEffect(() => {
        fetch()
       
    }, [])
    const addCobroFranquicia = () => {
        let exist = cobros_franquicia.filter((x: any) => x.id_empresa == selectData.franquicia.id && x.id_empresa_proveedor == selectData.proveedor.id && x.id_grupo_us == selectData.grupo_us.id)
        if (selectData.franquicia==undefined || selectData.proveedor== undefined || selectData.grupo_us== undefined) {
            Swal.fire('Notificacion', 'Llena todos los campos para continuar', 'warning')
            return
        }
        if (exist.length > 0) {
            Swal.fire('Notificacion', 'Ya existe este registro creado', 'warning')
            return
        }
        let data = {
            id_empresa: selectData.franquicia.id,
            empresa_franquicia: selectData.franquicia.razon_social,
            id_empresa_proveedor: selectData.proveedor.id,
            empresa_proveedor: selectData.proveedor.razon_social,
            id_grupo_us: selectData.grupo_us.id,
            grupo_us: selectData.grupo_us.nombre,
        }
        setCobrosFranquicia([...cobros_franquicia, data])
    }

    const deleteCobroFranq = (item: any) => {
        const filter = cobros_franquicia.filter((x: number) => x !== item);
        setCobrosFranquicia(filter);
        if (item.id != undefined && item.id != null) {
            setDeleteCobros_franquicia([...deleteCobros_franquicia, item.id])
        }
    };
    return (
        <div className={`overlay__modal_minimal-charges_modal-articles ${subModal == 'modal-cobros-franquicia' ? 'active' : ''}`}>
            <div className={`popup__modal_minimal-charges_modal-articles ${subModal == 'modal-cobros-franquicia' ? 'active' : ''}`}>
                <a className="btn-cerrar-popup__modal_minimal-charges_modal-articles" onClick={() => setSubModal('')}>
                    <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                </a>
                <p className='title__modals'>Configurar Cobros de Franquicia</p>

                <div className='row my-4'>
                    <div className='col-4 md-col-6 sm-col-12'>
                        <Select dataSelects={proveedores} instanceId="proveedor" nameSelect={'Proveedor *'} />
                    </div>
                    <div className='col-4 md-col-6 sm-col-12'>
                        <Select dataSelects={franquicias} instanceId="franquicia" nameSelect={'Franquicias *'} />
                    </div>
                    <div className='col-3 md-col-6 sm-col-12'>
                        <Select dataSelects={userGroups} instanceId="grupo_us" nameSelect={'Lista de Venta *'} />
                    </div>

                    <div className='col-1 d-flex align-items-end'>
                        <button type='button' className='btn__general-purple' onClick={addCobroFranquicia}>Agregar</button>
                    </div>
                </div>
                <div className='article__modal_minimal-charges_table' >
                    {cobros_franquicia ? (
                        <div className='table__numbers'>
                            <p className='text'>Cobros Agregados</p>
                            <div className='quantities_tables'>{cobros_franquicia.length}</div>
                        </div>
                    ) : (
                        <p className='text'>No hay Cobros configurados</p>
                    )}

                    <div className='table__head'>
                        <div className='thead'>
                            <div className='th'>
                                <p className=''>Proveedor</p>
                            </div>
                            <div className='th'>
                                <p className=''>Franquicia</p>
                            </div>
                            <div className='th'>
                                <p className=''>Lista de Venta</p>
                            </div>
                            <div className='th'>

                            </div>
                            <div className='th'>

                            </div>
                        </div>
                    </div>
                    {cobros_franquicia?.length > 0 ? (
                        <div className='table__body'>
                            {cobros_franquicia?.map((item: any, index: any) => (
                                <div className='tbody__container' key={index}>
                                    <div className='tbody'>
                                        <div className='td'>
                                            {item.empresa_proveedor}
                                        </div>
                                        <div className='td'>
                                            {item.empresa_franquicia}
                                        </div>
                                        <div className='td'>
                                            {item.grupo_us}
                                        </div>
                                        <div className='td'>
                                            <button className='btn__general-danger' type='button' onClick={() => deleteCobroFranq(item)}>Eliminar</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className='text'>No hay cobros configurados</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CobrosFranquicia
