import React, { useEffect, useState } from 'react'
import Select from '../../../../Dynamic_Components/Select'

import { storeOrdes } from '../../../../../../zustand/Ordes';
import typeSearch from './json/typeSearchs.json'
import APIs from '../../../../../../services/services/APIs';
import { useSelectStore } from '../../../../../../zustand/Select';
import { useStore } from 'zustand';
import useUserStore from '../../../../../../zustand/General';
import { storeArticles } from '../../../../../../zustand/Articles';
import './styles/Direct.css'


const Direct: React.FC<any> = ({selectedOption}: any) => {

    const userState = useUserStore(state => state.user);
    const user_id = userState.id
    

    //////////////////////////////////Directa////////////////////////////////////////////////

    const setConcepts = storeOrdes(state => state.setConcepts)
    const { concepts, OPByareas }: any = useStore(storeOrdes)
    const [selectModalResults, setSelectModalResults] = useState<boolean>(false)
    const [selectedModalResult, setSelectedModalResult] = useState<any>(null)
    const selectedIds: any = useSelectStore((state) => state.selectedIds);

    const setSelectedIds = useSelectStore(state => state.setSelectedId)

    const [articles, setArticles] = useState<any>()

    const [selectSearchFor] = useState<any>({
        selectName: 'Buscar por',
        options: 'name',
        dataSelect: typeSearch
    })

    useEffect(() => {
        setSelectedIds('type', {id: 0}) 
    }, [])

    
    // setSelectedIds('type',typeSearch[0])
    // Bucador por nombre
    const [searchBy, setSearchBy] = useState<any>('')
    const setModalLoading = storeArticles((state: any) => state.setModalLoading);

    const searchFor = async () => {
        const data = {
            id: 0,
            activos: true,
            nombre: selectedIds.type.id == 0 ? searchBy : '',
            codigo: selectedIds.type.id == 1 ? searchBy : '',
            familia: 0,
            page: 1,
            proveedor: 0,
            materia_prima: 0,
            get_sucursales: false,
            get_proveedores: true,
            get_max_mins: false,
            get_plantilla_data: false,
            get_stock: true,
            get_web: false,
            get_unidades: true,
            id_usuario: user_id
        };

        try {
            setModalLoading(true)
            const result:any = await APIs.getArticles(data)
            
            setArticles(result)
            setSelectedModalResult(result[0])
            setModalLoading(false)
        } catch (error) {
            console.log(error)
            setModalLoading(false)

        }
    };



    const openSelectModalResults = () => {
        setSelectModalResults(!selectModalResults)
    }

    const handleModalResultsChange = (item: any) => {
        setSelectedModalResult(item)
        setSelectModalResults(false)
    }


    const addArticles = () => {
        selectedModalResult.id_articulo = selectedModalResult.id
        selectedModalResult.cantidad = 0
        selectedModalResult.unidad = selectedModalResult.unidades[0].id_unidad
        selectedModalResult.id_unidad = selectedModalResult.unidades[0].id_unidad
        selectedModalResult.id_orden_produccion = selectedOption == 0 ? 0 : 0
        selectedModalResult.comentarios = ''
        setConcepts([...concepts, { ...selectedModalResult }]);


    };

    console.log('concepts', concepts)

    return (
        <div className='conatiner__direct'>
            <div className='row__one'>
                <Select dataSelects={selectSearchFor} nameSelect={'Buscar por'} instanceId='type' />
                <div>
                    <div>
                        <label className='label__general'>Buscador</label>
                        <input className='inputs__general' type='text' value={searchBy} onChange={(e) => setSearchBy(e.target.value)} onKeyUp={(event) => event.key === 'Enter' && searchFor()} placeholder='Ingresa el nombre' />
                    </div>
                </div>
                <div className='container__search'>
                    <button className='btn__general-purple btn__container' type='button' onClick={searchFor}>
                        <svg className='svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /></svg>
                    </button>
                </div>
            </div>
            <div className='row__two'>
                <div className='container__two'>
                    <div className='select__container'>
                        <label className='label__general'>Resultados</label>
                        <div className='select-btn__general'>
                            <div className={`select-btn ${selectModalResults ? 'active' : ''}`} onClick={openSelectModalResults}>
                                <p>{selectedModalResult ? `${articles?.find((s: { id: number }) => s.id === selectedModalResult.id)?.codigo} ${articles.find((s: { id: number }) => s.id === selectedModalResult.id)?.descripcion}` : 'Selecciona'}</p>
                                <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                            </div>
                            <div className={`content ${selectModalResults ? 'active' : ''}`}>
                                <ul className={`options ${selectModalResults ? 'active' : ''}`} style={{ opacity: selectModalResults ? '1' : '0' }}>
                                    {articles?.map((item: any) => (
                                        <li key={item.id} onClick={() => handleModalResultsChange(item)}>
                                            {item.codigo}-{item.descripcion}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button className='btn__general-purple' type='button' onClick={addArticles}>Agregar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Direct
