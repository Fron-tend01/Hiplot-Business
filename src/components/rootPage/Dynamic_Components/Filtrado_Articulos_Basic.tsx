import { useEffect, useRef, useState } from 'react'
import useUserStore from '../../../zustand/General';
import { storeFamilies } from '../../../zustand/Families';
import './styles/Filtrado_Articulos_Basic.css'
import APIs from '../../../services/services/APIs';
import { storeArticles } from '../../../zustand/Articles';
import LoadingInfo from '../../loading/LoadingInfo';

interface FiltradoArticulosBasicProps {
    get_sucursales?: boolean;
    get_proveedores?: boolean;
    get_max_mins?: boolean;
    get_plantilla_data?: boolean;
    get_stock?: boolean;
    get_variaciones?: boolean;
    get_precios?: boolean;
    get_combinaciones?: boolean;
    get_componentes?: boolean;
    get_tiempos_entrega?: boolean;
    get_areas_produccion?: boolean;
    get_unidades?: boolean;
    get_cargos_minimos?: boolean;
    get_adicional?: boolean;
    get_imagenes?: boolean;
    id_empresa_proveedor?: 0;
    id_sucursal_franquicia?: 0;
    campos_ext?: any[];
    set_article_local?: any

}
const Filtrado_Articulos_Basic: React.FC<FiltradoArticulosBasicProps> = ({ get_sucursales = false, get_proveedores = false, get_max_mins = false,
    get_plantilla_data = false, get_stock = false, get_unidades = false, get_variaciones = false, get_precios = false, get_combinaciones = false, get_componentes = false,
    get_tiempos_entrega = false, get_areas_produccion = false, get_cargos_minimos = false, get_adicional = false, get_imagenes = false, id_empresa_proveedor = 0,
    id_sucursal_franquicia = 0,
    campos_ext = [], set_article_local = [] }) => {
    const [articles, setArticles] = useState<any>()
    const { getFamilies, families }: any = storeFamilies()

    const [selectSearch, setSelectSearch] = useState<boolean>(false)
    const [selectedSearch, setSelectedSearch] = useState<number | null>(null)
    const [nameBy, setNameBy] = useState<string | number>('')
    const userState = useUserStore(state => state.user);

    const [selectResults, setSelectResults] = useState<boolean>(false)
    const [selectedResult, setSelectedResult] = useState<any>('')

    const [selectFamilias, setSelectFamilias] = useState<boolean>(false)
    const [familia, setFamilia] = useState<any>({})


    const user_id = userState.id
    const searchX = [
        {
            id: 0,
            name: 'Código'
        },
        {
            id: 1,
            name: 'Descripcion'
        },
        {
            id: 2,
            name: 'Familia'
        },
    ]
    const openSelectSearch = () => {
        setSelectSearch(!selectSearch)
    }

    const handleSearchChange = (search: any) => {
        setSelectedSearch(search.id)
        setNameBy('')
        setSelectSearch(false)
    }
    const controllerRef = useRef<AbortController | null>(null);

    if (controllerRef.current) {
        controllerRef.current.abort();
    }

    controllerRef.current = new AbortController();

    const searchFor = async () => {
        const data = {
            id: 0,
            activos: true,
            nombre: selectedSearch == 1 ? nameBy : '',
            codigo: selectedSearch == 0 ? nameBy : '',
            familia: selectedSearch == 2 ? familia.id : 0,
            proveedor: 0,
            materia_prima: 0,
            get_sucursales: get_sucursales == false ? get_sucursales : true,
            get_proveedores: get_proveedores == false ? get_proveedores : true,
            get_max_mins: get_max_mins == false ? get_max_mins : true,
            get_plantilla_data: get_plantilla_data,
            get_stock: get_stock == false ? get_stock : true,
            get_web: false,
            get_unidades: get_unidades == false ? get_unidades : true,
            get_variaciones: get_variaciones == false ? get_variaciones : true,
            get_precios: get_precios == false ? get_precios : true,
            get_combinaciones: get_combinaciones == false ? get_combinaciones : true,
            get_componentes: get_componentes == false ? get_componentes : true,
            get_tiempos_entrega: get_tiempos_entrega == false ? get_tiempos_entrega : true,
            get_areas_produccion: get_areas_produccion == false ? get_areas_produccion : true,
            get_cargos_minimos: get_cargos_minimos == false ? get_cargos_minimos : true,
            get_adicional: get_adicional == false ? get_adicional : true,
            get_imagenes: get_imagenes == false ? get_imagenes : true,
            id_empresa_proveedor: id_empresa_proveedor || 0,
            id_sucursal_franquicia: id_sucursal_franquicia || 0,
            id_usuario: user_id
        }
        setModalLoading(true)
        if (selectedSearch === 0) {
            // const result = await getArticles(data)
            const result: any = await APIs.getArticleWSignal(data);
            setModalLoading(false)
            setArticles(result)
            setSelectedResult(result[0])
        } else if (selectedSearch === 1) {
            const result: any = await APIs.getArticleWSignal(data);
            setModalLoading(false)

            setArticles(result)
            setSelectedResult(result[0])
        } else if (selectedSearch === 2) {
            const result: any = await APIs.getArticleWSignal(data);
            setModalLoading(false)

            setArticles(result)
            setSelectedResult(result[0])
        }
    }

    const handleResultsChange = (result: any) => {
        setSelectedResult(result)
        setSelectResults(false)
    }

    const openSelectResults = () => {
        setSelectResults(!selectResults)
    }


    const fetch = async () => {
        const dataFam = await getFamilies(user_id)
        setFamilia(dataFam[0])
        setSelectedSearch(0)
    }
    useEffect(() => {
        fetch()
    }, [])
    const modalLoading = storeArticles((state: any) => state.modalLoading);
    const setModalLoading = storeArticles((state: any) => state.setModalLoading);

    const agregar_articulos = (all: boolean) => {
        if (!all) {

            const data = { ...selectedResult };
            campos_ext.forEach(element => {
                if (element.tipo == 1) {
                    data[element.nombre] = data[element.asignacion];
                } else {
                    data[element.nombre] = element.tipo;
                }


            });
            set_article_local((prevArticulos: any) => [...prevArticulos, data]);

        } else {
            const datas: any = []
            articles.forEach((d: any) => {
                const data = { ...d };
                campos_ext.forEach(element => {

                    if (element.tipo == 1) {
                        data[element.nombre] = data[element.asignacion];
                    } else {
                        data[element.nombre] = element.tipo;
                    }
                });
                datas.push(data)


            });
            datas.forEach((d: any) => {
                set_article_local((prevArticulos: any) => [...prevArticulos, d]);
            });
        }
    }
    return (
        <div className='filter__article__basic'>
            <div className='row__one'>
                <div>
                    <div className='select__container'>
                        <label className='label__general'>Buscar por</label>
                        <div className='select-btn__general'>
                            <div className={`select-btn ${selectSearch ? 'active' : ''}`} onClick={openSelectSearch} >
                                <p>{selectedSearch !== null ? searchX?.find((s: { id: number }) => s.id === selectedSearch)?.name : 'selecciona'}</p>
                                <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                            </div>
                            <div className={`content ${selectSearch ? 'active' : ''}`} >
                                <ul className={`options ${selectSearch ? 'active' : ''}`} style={{ opacity: selectSearch ? '1' : '0' }}>
                                    {searchX?.map((search: any) => (
                                        <li key={search.id} onClick={() => handleSearchChange(search)}>
                                            {search.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {selectedSearch != 2 ?
                    <div>
                        <div>
                            <label className='label__general'>Escribe {selectedSearch == 0 ? 'Código' : 'Descripcion'}</label>
                            <input className='inputs__general' type='text' value={nameBy} onChange={(e) => setNameBy(e.target.value)} placeholder='Ingresa el nombre' onKeyUp={(e) => e.key === 'Enter' && searchFor()}
                            />
                        </div>
                    </div>
                    :
                    <div>
                        <div className='select__container'>
                            <label className='label__general'>Familia</label>
                            <div className='select-btn__general'>
                                <div className={`select-btn ${selectFamilias ? 'active' : ''}`} onClick={() => setSelectFamilias(!selectFamilias)}>
                                    <p>{familia.id ? families.find((s: { id: number }) => s.id === familia.id)?.nombre : 'Selecciona'}</p>
                                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                                </div>
                                <div className={`content ${selectFamilias ? 'active' : ''}`}>
                                    <ul className={`options ${selectFamilias ? 'active' : ''}`} style={{ opacity: selectFamilias ? '1' : '0' }}>
                                        {families && families.map((fam: any) => (
                                            <li key={fam.id} onClick={() => { setFamilia(fam); setSelectFamilias(false) }}>
                                                {fam.nombre}
                                            </li>
                                        ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                }
                <div className='d-flex align-items-end'>
                    <button className='btn__general-purple' type='button' onClick={searchFor}>Buscar</button>
                </div>
            </div>
            <div className='row mt-3'>
                <div className='row col-12 mx-auto'>
                    <div className='col-9 md-col-10 sm-col-12'>
                        <div className='select__container'>
                            <label className='label__general'>Resultado</label>
                            <div className='select-btn__general'>
                                <div className={`select-btn ${selectResults ? 'active' : ''}`} onClick={openSelectResults} >
                                    <p>{selectedResult ? `${articles.find((s: { id: number }) => s.id === selectedResult.id)?.codigo} - ${articles.find((s: { id: number }) => s.id === selectedResult.id)?.descripcion}` : 'Selecciona'}</p>
                                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                                </div>
                                <div className={`content ${selectResults ? 'active' : ''}`} >
                                    <ul className={`options ${selectResults ? 'active' : ''}`} style={{ opacity: selectResults ? '1' : '0' }}>
                                        {articles && articles.map((result: any) => (
                                            <li key={result.id} onClick={() => handleResultsChange(result)}>
                                                {result.codigo} - {result.descripcion}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-3 md-col-2 sm-col-12 d-flex align-items-end'>
                        <button className='btn__general-purple mr-3' type='button' onClick={() => agregar_articulos(false)}>Add+</button>
                        <button className='btn__general-orange' type='button' onClick={() => agregar_articulos(true)}>Todos</button>

                    </div>
                </div>
            </div>
            {modalLoading == true ? (
                <LoadingInfo />
            ) :
                ''}
        </div>
    )
}

export default Filtrado_Articulos_Basic
