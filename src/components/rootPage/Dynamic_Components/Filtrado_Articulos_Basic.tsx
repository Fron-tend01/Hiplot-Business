import { useEffect, useState } from 'react'
import { articleRequests } from '../../../fuctions/Articles';
import useUserStore from '../../../zustand/General';
import { storeFamilies } from '../../../zustand/Families';
import { storeDv } from '../../../zustand/Dynamic_variables';

interface FiltradoArticulosBasicProps {
    get_sucursales: boolean;
    get_proveedores: boolean;
    get_max_mins: boolean;
    get_plantilla_data: boolean;
    get_stock: boolean;
    get_unidades: boolean;
  }
  
  const Filtrado_Articulos_Basic: React.FC<FiltradoArticulosBasicProps> = ({ get_sucursales, get_proveedores, get_max_mins, get_plantilla_data, get_stock, get_unidades,
  }) => {
    const { getArticles }: any = articleRequests()
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
    const setArticulos = storeDv(state => state.setArticulos)


    let user_id = userState.id
    let searchX = [
        {
            id: 0,
            name: 'Código'
        },
        {
            id: 1,
            name: 'Nombre'
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

    const searchFor = async () => {
        let data = {
            id: 0,
            activos: true,
            nombre: selectedSearch == 1 ? nameBy : '',
            codigo: selectedSearch == 0 ? nameBy : '',
            familia: selectedSearch == 2 ? familia.id : 0,
            proveedor: 0,
            materia_prima: 0,
            get_sucursales: get_sucursales,
            get_proveedores: get_proveedores,
            get_max_mins: get_max_mins,
            get_plantilla_data: get_plantilla_data,
            get_stock: get_stock,
            get_web: false,
            get_unidades: get_unidades,
            id_usuario: user_id
        }
        if (selectedSearch === 0) {
            let result = await getArticles(data)
            setArticles(result)
            setSelectedResult(result[0])
        } else if (selectedSearch === 1) {
            let result = await getArticles(data)
            setArticles(result)
            setSelectedResult(result[0])
        } else if (selectedSearch === 2) {
            let result = await getArticles(data)
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
        let dataFam = await getFamilies(user_id)
        setFamilia(dataFam[0])
        setSelectedSearch(0)
    }
    useEffect(() => {
        fetch()
    }, [])
    const agregar_articulos = (all: boolean) => {
        if (!all) {
            setArticulos([selectedResult])
        } else {
            setArticulos(articles)
        }
    }
    return (
        <div>
            <div className='row'>
                <div className='col-4 md-col-6 sm-col-12 '>
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

                    <div className='col-6 md-col-6 sm-col-12 '>
                        <div>
                            <label className='label__general'>Escribe el {selectedSearch==0?'Codigo':'Nombre'}</label>
                            <input className='inputs__general' type='text' value={nameBy} onChange={(e) => setNameBy(e.target.value)} placeholder='Ingresa el nombre' onKeyUp={searchFor} />
                        </div>
                    </div>
                    :
                    <div className='col-6 md-col-6 sm-col-12 '>
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
                <div className='col-2 md-col-6 sm-col-12 '>
                    <label className='label__general'>Buscar</label>
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
        </div>
    )
}

export default Filtrado_Articulos_Basic
