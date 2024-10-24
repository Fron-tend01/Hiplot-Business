import React, { useEffect, useState } from 'react';
import { storeCompanies } from '../../../../../../zustand/Companies';
import { storeBranchOffcies } from '../../../../../../zustand/BranchOffices';
import { storeStore } from '../../../../../../zustand/Store';
import useUserStore from '../../../../../../zustand/General';
import './style/maxmin.css'
import { useStore } from 'zustand';
import { storeArticles } from '../../../../../../zustand/Articles';
import { toast } from 'sonner'

const MaxMin: React.FC = () => {

    // Maximos y Minimos

    // Modal de Max y Min del modal de crear articulos
    const [maximum, setMaximum] = useState<number>(0)
    const [minimum, setMinimum] = useState<number>(0)
    const [warningMaximum] = useState<boolean>(false)
    const [warningMinimum] = useState<boolean>(false)
    const [selectMaxMinCompanies, setSelectMaxMinCompanies] = useState<boolean>(false)
    const [selectedMaxMinCompany, setSelectedMaxMinCompany] = useState<number | null>(null)
    const [selectMaxMinBranchOffices, setSelectMaxMinBranchOffices] = useState<boolean>(false)
    const [selectedMaxMinBranchOffice, setSelectedMaxMinBranchOffice] = useState<number | null>(null)
    const [selectMaxMinWarehouses, setSelectMaxMinWarehouses] = useState<boolean>(false)
    const [selectedMaxMinStore, setSelectMaxMinStore] = useState<number | null>(null)
    const [selectActions, setSelectActions] = useState<boolean>(false)
    const [selectedAction, setSelectedAction] = useState<number | null>(null)
    const [filteredMaxMinBranchOffices, setFilteredMaxMinBranchOffices] = useState<any[]>([]);
    const [commentsMaxMin, setCommentsMaxMin] = useState<string>('')

    const { getCompaniesXUsers, companiesXUsers }: any = storeCompanies();
    const { getBranchOfficeXCompanies, branchOfficeXCompanies }: any = storeBranchOffcies();
    const { store, getStore }: any = storeStore()
    const userState = useUserStore(state => state.user);
    let user_id = userState.id

    const { articleByOne }: any = useStore(storeArticles);
    const { setMaxsMins, maxsMins, deleteMaxsMins, setWarinings } = useStore(storeArticles);
    const { setModalStateMaxsMins } = useStore(storeArticles);

    const setDeleteMaxsMins = storeArticles(state => state.setDeleteMaxsMins)

    useEffect(() => {
        if (user_id) {
            getCompaniesXUsers(user_id);
            getBranchOfficeXCompanies(0, user_id)
            getStore(user_id);

        }
    }, [user_id, articleByOne,]);


    const addMaxMin = async () => {

        let filter = await maxsMins.find((x: any) => x.id_almacen == selectedMaxMinStore && x.accion==selectedAction)

        if (filter) {
            setWarinings('maxsmins')
            toast.warning('El almacen ya tiene esta configuración agregada')
        } else {
            let acc = {
                id: 1,
                nombre: 'Crear Requisicion'
            }

            if (selectedAction != null && selectedAction != 0) {
                acc = actionMaxMin[selectedAction]
            }

            setWarinings('')
            let dataMaxMin = {
                id_almacen: selectedMaxMinStore,
                maximo: maximum,
                minimo: minimum,
                accion: selectedAction,
                comentarios: commentsMaxMin,
                nombre_accion: acc
            }



            setMaxsMins([...maxsMins, dataMaxMin])
        }
    }



    const deleteMaxMin = (item: any) => {
        const itemDelete = maxsMins.filter((x: number) => x !== item);
        setMaxsMins(itemDelete);
        if (item.id != undefined) {
            setDeleteMaxsMins([...deleteMaxsMins, item.id])

        }
        setWarinings('')
    };



    const handleMaxMinCompaniesChange = (company: any) => {
        setSelectedMaxMinCompany(company)

        const firstMaxmMinBranchOffice = branchOfficeXCompanies.find((BranchOffice: any) => BranchOffice.empresa_id === company)
        if (firstMaxmMinBranchOffice) {
            setSelectedMaxMinBranchOffice(firstMaxmMinBranchOffice.id)

        } else {

        }
        setSelectMaxMinCompanies(false)

    }

    const handleMaxMinBranchOfficesChange = (sucursal: any) => {
        setSelectedMaxMinBranchOffice(sucursal)
        setSelectMaxMinBranchOffices(false)
    }


    const handleMaxMinStoreChange = (store: any) => {
        setSelectMaxMinStore(store.id)
        setSelectMaxMinWarehouses(false)
    }

    const handleActionsChange = (action: any) => {
        setSelectedAction(action)
        setSelectActions(false)

    }




    const handleMaximumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numberValue = Number(value);

        setMaximum(numberValue);
    };

    const handleMinimumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numberValue = Number(value);

        setMinimum(numberValue);
    };






    useEffect(() => {
        if (selectedMaxMinCompany) {
            const idSelectedMaxMinBranch = branchOfficeXCompanies.filter((branchOffice: any) => branchOffice.empresa_id === selectedMaxMinCompany);
            setFilteredMaxMinBranchOffices(idSelectedMaxMinBranch);

            if (idSelectedMaxMinBranch.length > 0) {
                setSelectedMaxMinBranchOffice(idSelectedMaxMinBranch[0].id); // Acceder al ID del primer elemento del array
            } else {
                setSelectedMaxMinBranchOffice(null); // Si no se encuentra ninguna sucursal, establecer selectedBranchOffice en null
            }
        } else {
            setFilteredMaxMinBranchOffices([]);
            setSelectedMaxMinBranchOffice(null); // Si no se ha seleccionado ninguna empresa, establecer selectedBranchOffice en null
        }


    }, [selectedMaxMinCompany, branchOfficeXCompanies]);


    const openSelectMaxMinCompanies = () => {
        setSelectMaxMinCompanies(!selectMaxMinCompanies)
    }

    const openSelectMaxMinBranchOffices = () => {
        setSelectMaxMinBranchOffices(!selectMaxMinBranchOffices)
    }

    const openSelectMaxMinStore = () => {
        setSelectMaxMinWarehouses(!selectMaxMinWarehouses)
    }

    const openSelectActions = () => {
        setSelectActions(!selectActions)
    }


    let actionMaxMin: any = {
        1: 'Crear requisición',
        2: 'Traspaso automatico',
        3: 'Orden de compra'
    }
    const closeModal = () => {
        setModalStateMaxsMins('')
    }





    const [warningSelectCompany] = useState<boolean>(false)

    return (
        <div>
            <a href="#" className="btn-cerrar-popup__modal_maxmin_creating_articles" onClick={closeModal}>
                <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
            </a>
            <p className='title__modals'>Máximos y Mínimos</p>
            <div className='article__modal_save_modal_maxmin_container'>
                <div className='row__one'>
                    {/* <div className='select__container'> 
                    <label className='label__general'>Sucursales</label>
                    <div className='select-btn__general'>
                        <div className={`select-btn ${selectMaxMinBranchOffices ? 'active' : ''}`} onClick={openSelectMaxMinBranchOffices} >
                            <div className='select__container_title'>
                                <p>{selectedMaxMinBranchOffice ? branchOfficeXCompanies.find((s: {id: number}) => s.id === selectedMaxMinBranchOffice)?.nombre : 'Selecciona'}</p>
                            </div>
                            <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                        </div>
                        <div className={`content ${selectMaxMinBranchOffices ? 'active' : ''}`} >
                            <ul className={`options ${selectMaxMinBranchOffices ? 'active' : ''}`} style={{ opacity: selectMaxMinBranchOffices ? '1' : '0' }}>
                                {filteredMaxMinBranchOffices.map((sucursal: any) => (
                                    <li key={sucursal.id} onClick={() => handleMaxMinBranchOfficesChange(sucursal.id)}>
                                        {sucursal.nombre}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                */}
                    <div className='select__container'>
                        <label className='label__general'>Almacen</label>
                        <div className='select-btn__general'>
                            <div className={`select-btn ${selectMaxMinWarehouses ? 'active' : ''}`} onClick={openSelectMaxMinStore} >
                                <p>{selectedMaxMinStore ? store.find((s: { id: number }) => s.id === selectedMaxMinStore)?.nombre : 'Selecciona'}</p>
                                <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                            </div>
                            <div className={`content ${selectMaxMinWarehouses ? 'active' : ''}`} >
                                <ul className={`options ${selectMaxMinWarehouses ? 'active' : ''}`} style={{ opacity: selectMaxMinWarehouses ? '1' : '0' }}>
                                    {store.map((store: any) => (
                                        <li key={store.id} onClick={() => handleMaxMinStoreChange(store)}>
                                            {store.nombre}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row__two'>
                    <div className='container__textarea_general'>
                        <div className='textarea__container'>
                            <label className='label__general'>Comentario</label>
                            {/* <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div> */}
                            <textarea className={`textarea__general ${warningMaximum ? 'warning' : ''}`} value={commentsMaxMin} onChange={(e) => setCommentsMaxMin(e.target.value)} placeholder='Comentarios' />
                        </div>
                    </div>
                    <div className='container__inputs_general'>
                        <label className='label__general'>Máximo</label>
                        {/* <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div> */}
                        <input className={`inputs__general ${warningMaximum ? 'warning' : ''}`} type="number" value={maximum} onChange={handleMaximumChange} placeholder='Ingresa el máximo' />
                    </div>
                    <div className='container__inputs_general'>
                        <label className='label__general'>Mínimo</label>
                        {/* <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div> */}
                        <input className={`inputs__general ${warningMinimum ? 'warning' : ''}`} type="number" value={minimum} onChange={handleMinimumChange} placeholder='Ingresa el mínimo' />
                    </div>
                    <div className='select__container'>
                        <label className='label__general'>Acción</label>
                        <div className='select-btn__general'>
                            <div className={`select-btn ${selectActions ? 'active' : ''}`} onClick={openSelectActions} >
                                <p>{selectedAction ? actionMaxMin[selectedAction] : 'Selecciona'}</p>
                                <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                            </div>
                            <div className={`content ${selectActions ? 'active' : ''}`} >
                                <ul className={`options ${selectActions ? 'active' : ''}`} style={{ opacity: selectActions ? '1' : '0' }}>
                                    {Object.keys(actionMaxMin).map((action) => (
                                        <li key={action} onClick={() => handleActionsChange(action)}>
                                            {actionMaxMin[action]}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button className='btn__general-purple' type='button' onClick={addMaxMin}>Agregar</button>
                    </div>
                </div>
                <div>
                    <div className='table__maxmin'>
                        <div>
                            <div>
                                {maxsMins ? (
                                    <div className='table__numbers'>
                                        <p className='text'>Total de registros</p>
                                        <div className='quantities_tables'>{maxsMins.length}</div>
                                    </div>
                                ) : (
                                    <p className='text'>No hay registros</p>
                                )}
                            </div>
                            <div className='table__head'>
                                <div className='thead'>
                                    <div className='th'>
                                        <p className=''>Almacén</p>
                                    </div>
                                    <div className='th'>
                                        <p className=''>Máximo</p>
                                    </div>
                                    <div className='th'>
                                        <p className=''>Mínimo</p>
                                    </div>
                                    <div className='th'>
                                        <p className=''>Acción</p>
                                    </div>
                                </div>
                            </div>
                            {maxsMins && maxsMins.length > 0 ? (
                                <div className='table__body'>
                                    {maxsMins.map((item: any, index: any) => (
                                        <div className='tbody__container' key={index}>
                                            <div className='tbody'>
                                                <div className='td'>
                                                    {store.find((store: any) => store.id === item.id_almacen)?.nombre}
                                                </div>
                                                <div className='td'>
                                                    {item.maximo}
                                                </div>
                                                <div className='td'>
                                                    {item.minimo}
                                                </div>
                                                <div className='td'>
                                                    {item.nombre_accion != undefined ? item.nombre_accion : actionMaxMin[item.accion]}
                                                </div>
                                                <div className='td'>
                                                    <button className='btn__delete_users' type='button' onClick={() => deleteMaxMin(item)}>Eliminar</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className='text'>No hay máximos y mínimos que mostrar</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default MaxMin
