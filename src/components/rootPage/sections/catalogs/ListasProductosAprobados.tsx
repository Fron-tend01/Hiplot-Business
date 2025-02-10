import React, { useEffect, useState } from 'react'
import './styles/ListasProductosAprobados.css'
import APIs from '../../../../services/services/APIs';
import Swal from 'sweetalert2';
import DynamicVariables from '../../../../utils/DynamicVariables';
import useUserStore from '../../../../zustand/General';
import { useSelectStore } from '../../../../zustand/Select';
import Select from '../../Dynamic_Components/Select';
import Filtrado_Articulos_Basic from '../../Dynamic_Components/Filtrado_Articulos_Basic';

const ListasProductosAprobados: React.FC = () => {
    const [lpa, setLpa] = useState<any>({
        id: 0,
        nombre: '',
        id_empresa: 0,
        id_almacen: 0,
        articulos: [],
        articulos_elim: []
    })
    const [forClear] = useState<any>({
        id: 0,
        nombre: '',
        id_empresa: 0,
        id_almacen: 0,
        articulos: [],
        articulos_elim: []
    })
    const [modal, setModal] = useState<boolean>(false)
    const [data, setData] = useState<any[]>([])
    const [articulos, setArticulos] = useState<any[]>([])
    const [empresas, setEmpresas] = useState<any>([])
    const [almacenes, setAlmacenes] = useState<any>([])
    const userState = useUserStore(state => state.user);
    const user_id = userState.id
    const selectData: any = useSelectStore(state => state.selectedIds)
    const setSelectData = useSelectStore(state => state.setSelectedId)
    const [campos_ext] = useState<any>([{ nombre: 'max_requisicion', tipo: 0 }, { nombre: 'max_pedido', tipo: 0 }, { nombre: 'id_articulo', tipo: 1, asignacion: 'id' },
        , { nombre: 'aprobar_requisicion', tipo: false }, { nombre: 'aprobar_pedido', tipo: false }
    ])
    const [modoUpdate, setModoUpdate] = useState<boolean>(false)

    const onInit = async () => {
        await APIs.GetAny('get_empresas_x_usuario/' + user_id).then((resp: any) => {
            setEmpresas({
                selectName: 'Empresa',
                dataSelect: resp,
                options: 'razon_social'
            })
            setSelectData('empresaSelected', resp[0])
        })
        await APIs.GetAny('almacen_get/' + user_id).then((resp: any) => {
            setAlmacenes({
                selectName: 'Almacen',
                dataSelect: resp,
                options: 'nombre'
            })
            setSelectData('almacenSelected', resp[0])
        })
        getData()
    }
    const getData = async () => {
        await APIs.CreateAny({ id_usuario: user_id, light:true }, "getLPA")
            .then(async (response: any) => {
                setData(response)
            })
    }
    const Modal = (mu: boolean, data: any) => {
        setModoUpdate(mu)
        setLpa(forClear)
        setArticulos([])
        if (mu) {
            DynamicVariables.updateAnyVar(setLpa, 'id', data.id)
            DynamicVariables.updateAnyVar(setLpa, 'nombre', data.nombre)
            DynamicVariables.updateAnyVar(setLpa, 'id_empresa', data.id_empresa)
            DynamicVariables.updateAnyVar(setLpa, 'id_almacen', data.id_almacen)
            setSelectData('empresaSelected', { id: data.id_empresa })
            setSelectData('almacenSelected', { id: data.id_almacen })
            setArticulos(data.articulos)
        }
        setModal(true)
    }
    useEffect(() => { //EFFECT VACIO NO
        onInit()
    }, [])

    const create = () => {
        Swal.fire({
            title: "Desea generar esta lista?",
            text: "Se puede tener más de una lista creada en la misma empresa, puedes eliminar la lista si no es lo que deseas",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            denyButtonText: `Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                lpa.articulos = articulos.map(({ id, ...rest }) => rest);
                console.log(lpa);

                await APIs.CreateAny(lpa, "createLPA")
                    .then(async (response: any) => {
                        if (response.error) {
                            Swal.fire('Notificación', response.mensaje, 'warning');
                        } else {
                            Swal.fire('Notificación', response.mensaje, 'success');
                            await getData()
                            setLpa(forClear)
                            setModal(false)
                        }

                    })
            }
        });
    }
    const update = () => {
        Swal.fire({
            title: "Desea actualizar esta lista?",
            text: "Puedes volver siempre a realizar más cambios en tu lista :)",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            denyButtonText: `Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                lpa.articulos = articulos.map(articulo => {
                    if (articulo.id_lista_productos_aprobados === undefined || articulo.id_lista_productos_aprobados === null) {
                        // Si 'id_lista_productos_aprobados' no existe, eliminamos 'id'
                        const { id, ...rest } = articulo;
                        return rest;
                    }
                    // Si 'id_lista_productos_aprobados' existe, devolvemos el objeto sin cambios
                    return articulo;
                });


                await APIs.CreateAny(lpa, "updateLPA")
                    .then(async (response: any) => {

                        if (response.error) {
                            Swal.fire('Notificación', response.mensaje, 'warning');
                        } else {
                            Swal.fire('Notificación', response.mensaje, 'success');
                            await getData()
                            setLpa(forClear)
                            setModal(false)
                        }

                    })
            }
        });
    }
    useEffect(() => {
        DynamicVariables.updateAnyVar(setLpa, 'id_empresa', selectData?.empresaSelected?.id)
        DynamicVariables.updateAnyVar(setLpa, 'id_almacen', selectData?.almacenSelected?.id)
    }, [selectData])
    return (
        <div className='lpa'>
            <div className='lpa__container'>
                <div className='btns__create_lpa'>
                    <button className='btn__general-purple' onClick={() => Modal(false, 0)}>Crear Lista</button>
                </div>
                <div className='table__lpa' >
                    <div>
                        {data ? (
                            <div>
                                <p className='text'>Tus Lista {data.length}</p>
                            </div>
                        ) : (
                            <p>No hay lista</p>
                        )}
                    </div>
                    <div className='table__head'>
                        <div className='thead'>
                            <div className='th'>
                                <p className=''>Nombre</p>
                            </div>
                            <div className='th'>
                                <p>Empresa</p>
                            </div>
                        </div>
                    </div>
                    {data ? (
                        <div className='table__body'>
                            {data.map((dat: any, i: number) => {
                                return (
                                    <div className='tbody__container' key={i} onClick={() => Modal(true, dat)}>
                                        <div className='tbody'>
                                            <div className='td'>
                                                <p>{dat.nombre}</p>
                                            </div>
                                            <div className='td'>
                                                <p>{dat.empresa}</p>
                                            </div>
                                            <div className='td'>
                                                <button className='branchoffice__edit_btn' >Editar</button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p>Cargando datos...</p>
                    )}
                </div>
                {/* ------------------------------------------------MODAL CREATE//UPDATE-------------------------------------------------------- */}
                <div className={`overlay__lpa ${modal ? 'active' : ''}`}>
                    <div className={`popup__lpa ${modal ? 'active' : ''}`}>
                        <a href="#" className="btn-cerrar-popup__lpa" onClick={() => setModal(false)
                        }>
                            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                        </a>
                        {modoUpdate ?
                            <p className='title__modals'>Actualizar Lista Productos Aprobados</p>
                            :
                            <p className='title__modals'>Crear Lista Productos Aprobados</p>
                        }
                        <br />
                        <hr />
                        <br />
                        <div className='row filter__article__basic'>
                            <div className='col-4'>
                                <label className='texto'>Nombre</label>
                                <input className={`inputs__general`} type="text" value={lpa.nombre}
                                    onChange={(e) => { DynamicVariables.updateAnyVar(setLpa, 'nombre', e.target.value) }}
                                />
                            </div>
                            <div className='col-4'>
                                <Select dataSelects={empresas} instanceId='empresaSelected' nameSelect={'Empresa'}></Select>
                            </div>
                            <div className='col-4'>
                                <Select dataSelects={almacenes} instanceId='almacenSelected' nameSelect={'Almacen'}></Select>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12 '>
                                <Filtrado_Articulos_Basic campos_ext={campos_ext} set_article_local={setArticulos} />
                            </div>
                            <div className='col-12'>
                                <div className='table_lpa_modal'>
                                    <div className='table__head'>
                                        <div className={`thead `}>
                                            <div className='th'>
                                                <p>Aprobar Ped.</p>
                                            </div>
                                            <div className='th'>
                                                <p>Aprobar Req.</p>
                                            </div>
                                            <div className='th'>
                                                <p>Articulo</p>
                                            </div>
                                            <div className='th'>
                                                <p>Max. Ped.</p>
                                            </div>
                                            <div>
                                                <p>Max. Req</p>
                                            </div>
                                            <div>
                                                <p>Opts</p>
                                            </div>
                                        </div>
                                    </div>
                                    {articulos ? (
                                        <div className='table__body'>
                                            {articulos?.map((article: any, index: number) => {
                                                return (
                                                    <div className='tbody__container' key={index}>
                                                        <div className='tbody'>
                                                            <div className='td'>
                                                                <label className="switch">
                                                                    <input style={{ width: '100px' }} className={`inputs__general`} type="checkbox" checked={article.aprobar_pedido}
                                                                        onChange={(e) => { DynamicVariables.updateAnyVarByIndex(setArticulos, index, 'aprobar_pedido', e.target.checked) }}
                                                                    />
                                                                    <span className="slider"></span>
                                                                </label>

                                                            </div>
                                                            <div className='td'>
                                                                <label className="switch">
                                                                    <input className={`inputs__general`} type="checkbox" checked={article.aprobar_requisicion}
                                                                        onChange={(e) => { DynamicVariables.updateAnyVarByIndex(setArticulos, index, 'aprobar_requisicion', e.target.checked) }}
                                                                    />
                                                                    <span className="slider"></span>

                                                                </label>

                                                            </div>
                                                            <div className='td '>
                                                                <p className='article'>{article.codigo}-{article.descripcion}</p>
                                                            </div>
                                                            <div className='td'>
                                                                <input className={`inputs__general`} type="number" value={article.max_requisicion}
                                                                    onChange={(e) => { DynamicVariables.updateAnyVarByIndex(setArticulos, index, 'max_requisicion', e.target.value) }}
                                                                />
                                                            </div>
                                                            <div className='td'>
                                                                <input className={`inputs__general`} type="number" value={article.max_pedido}
                                                                    onChange={(e) => { DynamicVariables.updateAnyVarByIndex(setArticulos, index, 'max_pedido', e.target.value) }}
                                                                />
                                                            </div>
                                                            <div className='td'>
                                                                <button className='btn__general-danger' onClick={() => { DynamicVariables.removeObjectInArray(setArticulos, index); { modoUpdate && article.id != 0 ? DynamicVariables.updateAnyVarSetArrNoRepeat(setLpa, "articulos_elim", article.id) : null } }}>Eliminar</button>
                                                            </div>

                                                        </div>

                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text">Cargando datos...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12 text-center'>
                                <button className='btn__general-purple' onClick={!modoUpdate ? create : update}>Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListasProductosAprobados
