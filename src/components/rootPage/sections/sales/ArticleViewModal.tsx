import React, { useEffect, useState } from 'react';
import './ArticleView.css';
import { articleRequests } from '../../../../fuctions/Articles';
import useUserStore from '../../../../zustand/General';
import SalesCard from './SalesCard';
import { storeArticleView } from '../../../../zustand/ArticleView';
import './styles/ArticleViewModal.css'
import { useStore } from 'zustand';
import { storeSaleCard } from '../../../../zustand/SaleCard';
import { FamiliesRequests } from '../../../../fuctions/Families';
import { storeArticles } from '../../../../zustand/Articles';

const ArticleViewModal = () => {
    const userState = useUserStore(state => state.user);
    const user_id = userState.id;
    const urlImg = useUserStore((state) => state.url_img);

    const setModalArticleView = storeArticleView(state => state.setModalArticleView)
    const setModalSalesCard = storeSaleCard(state => state.setModalSalesCard);
    const setStatusArticle = storeSaleCard(state => state.setStatusArticle);


    const { modalArticleView }: any = useStore(storeArticleView)

    const { getFamilies } = FamiliesRequests()

    const setIdArticle = storeSaleCard(state => state.setIdArticle)

    const { getArticles, getArticlesForVendedor }: any = articleRequests();
    const [articles, setArticles] = useState<any>([]);

    const [families, setFamilies] = useState<any>([]);
    const [page, setPage] = useState<number>(1);


    const fetch = async () => {
        const resultFamilies: any = await getFamilies(user_id)
        resultFamilies.unshift({ nombre: 'Todas', id: 0 });
        search(false);
        setFamilies(resultFamilies);
    };

    useEffect(() => {
        if (modalArticleView == 'article-view__modal' || modalArticleView == 'article-view__modal_header') {
            fetch();
            setPage(1)
        }

    }, [modalArticleView]);

    useEffect(() => {
        if (modalArticleView == 'article-view__modal' || modalArticleView == 'article-view__modal_header') {
            search(false);
        }


    }, [page]);


    const [inputs, setInputs] = useState<any>({
        code: '',
        name: ''
    });



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputs((prevInputs: any) => ({
            ...prevInputs,
            [name]: value
        }));
    };


    const [idA, setIdA] = useState<any>(null);
    const [i, setI] = useState(0);

    const [dentroColeccion, setDentroColeccion] = useState<boolean>(false)
    const [id_col, setid_col] = useState<any>({})
    const [dentroColeccionNombre, setDentroColeccionNombre] = useState<string>('')
    const modal = async (x: any) => {
        setStatusArticle(false);
        if (x.id_familia) {
            setIdArticle(x.id);
            setIdA(i)
            let newi = i + 1;
            setI(newi);
            setModalSalesCard('sale-card');

        } else {
            const data = {
                id: 0,
                activos: true,
                nombre: '',
                codigo: '',
                familia: 0,
                proveedor: 0,
                materia_prima: 99,
                get_sucursales: false,
                get_proveedores: false,
                get_max_mins: false,
                get_plantilla_data: false,
                get_areas_produccion: false,
                coleccion: false,
                id_coleccion: x.id,
                get_stock: false,
                get_web: false,
                get_unidades: false,
                for_vendedor: true,
                page: page,
                id_usuario: user_id,
                light: true
            };
            try {
                setDentroColeccionNombre(x.codigo)
                setDentroColeccion(true)
                setModalLoading(true)
                setid_col(x)
                const result = await getArticlesForVendedor(data);
                setArticles(result);
                setModalLoading(false)

            } catch (error) {
                setModalLoading(false)

            }

        }
    };
    const [isChecked, setIsChecked] = useState(true);

    const handlecollectionsOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setIsChecked(checked); // Actualiza el estado con true o false
    };
    const setModalLoading = storeArticles((state: any) => state.setModalLoading);

    const [selectedFamily, setSelectedFamily] = useState<number>(0)
    const search = async (reinicio_page: boolean, saliendo_col:boolean = false) => {
        let pag = page
        if (dentroColeccion && !saliendo_col) {
            const data = {
                id: 0,
                activos: true,
                nombre: '',
                codigo: '',
                familia: 0,
                proveedor: 0,
                materia_prima: 99,
                get_sucursales: false,
                get_proveedores: false,
                get_max_mins: false,
                get_plantilla_data: false,
                get_areas_produccion: false,
                coleccion: false,
                id_coleccion: id_col.id,
                get_stock: false,
                get_web: false,
                get_unidades: false,
                for_vendedor: true,
                page: page,
                id_usuario: user_id,
                light: true
            };
            try {
                setDentroColeccionNombre(id_col.codigo)
                setDentroColeccion(true)
                setModalLoading(true)
                // setid_col(id)
                const result = await getArticlesForVendedor(data);
                setArticles(result);
                setModalLoading(false)

            } catch (error) {
                setModalLoading(false)

            }
        }else {
            setDentroColeccion(false)
            setDentroColeccionNombre('')
            setArticles([])
            if (reinicio_page) {
                setPage(1)
                pag = 1
            }
            const data = {
                id: 0,
                activos: true,
                nombre: inputs.name,
                codigo: inputs.code,
                familia: selectedFamily,
                proveedor: 0,
                materia_prima: 99,
                get_sucursales: false,
                get_proveedores: false,
                get_max_mins: false,
                get_plantilla_data: false,
                get_areas_produccion: false,
                get_stock: false,
                coleccion: isChecked,
                // id_coleccion: isChecked ? dataCollection.id : 0,
                get_web: false,
                get_unidades: false,
                for_vendedor: true,
                page: pag,
                id_usuario: user_id,
                light: true
            };
            try {
                setModalLoading(true)
                const result = await getArticlesForVendedor(data)
                setArticles(result);
                setModalLoading(false)
    
            } catch (error) {
                setModalLoading(false)
            }

        }

    }

    const [selectUsers, setSelectUsers] = useState<boolean>(false);

    const openSelectUsers = () => {
        setSelectUsers(!selectUsers)
    }

    const familyChange = async (user: any) => {
        setSelectedFamily(user.id)
        setSelectUsers(!selectUsers)

        let pag = page
        const data = {
            id: 0,
            activos: true,
            nombre: inputs.name,
            codigo: inputs.code,
            familia: user.id,
            proveedor: 0,
            materia_prima: 99,
            get_sucursales: false,
            get_proveedores: false,
            get_max_mins: false,
            get_plantilla_data: false,
            get_areas_produccion: false,
            get_stock: false,
            coleccion: isChecked,
            // id_coleccion: isChecked ? dataCollection.id : 0,
            get_web: false,
            get_unidades: false,
            for_vendedor: true,
            page: pag,
            id_usuario: user_id,
            light: true
        };
        try {
            setModalLoading(true)
            const result = await getArticlesForVendedor(data)
            setArticles(result);
            setModalLoading(false)

        } catch (error) {
            setModalLoading(false)
        }


    }
    const [userSearchTerm, setUserSearchTerm] = useState<string>('');


    return (
        <div className={`overlay__article-view__modal ${modalArticleView == 'article-view__modal' || modalArticleView == 'article-view__modal_header' ? 'active' : ''}`}>
            <div className={`popup__article-view__modal ${modalArticleView == 'article-view__modal' || modalArticleView == 'article-view__modal_header' ? 'active' : ''}`}>
                <div className='header__modal'>
                    <a href="#" className="btn-cerrar-popup__article-view__modal" onClick={() => setModalArticleView('')}>
                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                    </a>
                    <p className='title__modals'>Artículos</p>
                </div>
                <div className='article__view_container'>
                    <div className='row card-row'>
                        <div className='col-3 md-col-6 sm-col-12'>
                            <label className='label__general'>Código</label>
                            <div className='warning__general'><small>Este campo es obligatorio</small></div>
                            <input className='inputs__general' type='text' name='code' value={inputs.code} onChange={handleInputChange}
                                onKeyUp={(e) => e.key === 'Enter' && search(true)} placeholder='Ingresa el código' />
                        </div>
                        <div className='col-3 md-col-6 sm-col-12'>
                            <label className='label__general'>Nombre</label>
                            <div className='warning__general'><small>Este campo es obligatorio</small></div>
                            <input className='inputs__general' type='text' name='name' value={inputs.name} onChange={handleInputChange}
                                onKeyUp={(e) => e.key === 'Enter' && search(true)} placeholder='Ingresa el nombre' />
                        </div>
                        <div className='col-3 md-col-6 sm-col-6'>
                            <div className='select__container' >
                                <label className='label__general'>Familias</label>
                                <div className='select-btn__general'>
                                    <div className={`select-btn ${selectUsers ? 'active' : ''}`} onClick={openSelectUsers}>
                                        <p>{selectedFamily ? families?.find((s: { id: number }) => s.id === selectedFamily)?.nombre : 'Todas'}</p>
                                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                                    </div>
                                    <div className={`content ${selectUsers ? 'active' : ''}`}>
                                        <ul className={`options ${selectUsers ? 'active' : ''}`} style={{ opacity: selectUsers ? '1' : '0' }}>
                                            <div className='search'>
                                                <input type="text" onChange={(e) => setUserSearchTerm(e.target.value)} value={userSearchTerm} placeholder="Buscar..." />
                                            </div>
                                            {families?.filter((user: any) => user.nombre.toLowerCase().includes(userSearchTerm.toLowerCase()))
                                                .map((user: any) => (
                                                    <li key={user.id} onClick={() => familyChange(user)}>
                                                        {user.nombre}
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-2 md-col-6 sm-col-6'>
                            <div className='checkbox__tickets'>
                                <label className="checkbox__container_general">
                                    <input
                                        className='checkbox'
                                        type="checkbox" // Cambiamos a checkbox en lugar de radio
                                        checked={isChecked} // Controlamos el estado marcado/desmarcado
                                        onChange={handlecollectionsOnchange}
                                    />
                                    <span className="checkmark__general"></span>
                                </label>
                                <p className='text'>Colección</p>
                            </div>

                        </div>
                        <div className='col-1 md-col-6 sm-col-12'>
                            <button className='btn__general-purple' onClick={() => { search(true) }}>Buscar</button>
                        </div>
                    </div>
                    {dentroColeccion ?
                        <div className='row'>
                            <div className='col-12'>
                                <button className='btn__general-orange' style={{ maxHeight: '50px', width: '100%' }} onClick={() => search(true, true)}>Salir de Colección</button>
                                <div className='text-center'>
                                    <h2 >{dentroColeccionNombre}</h2>
                                </div>
                            </div>
                        </div>
                        : ''}
                    <div className='row__two'>
                        {articles.map((x: any) => (
                            <div className='item' key={x.id} onClick={() => modal(x)}>
                                <div className='stock'>
                                    {x.desabasto == true ?
                                        <div className='desabasto'>
                                            <small>Desabasto</small>
                                        </div>
                                        :
                                        ''
                                    }
                                    {x.ultimas_piezas == true ?
                                        <div className='ultima-piezas'>
                                            <small >Ultimas Piezas</small>
                                        </div>
                                        :
                                        ''
                                    }
                                </div>
                                <div className='img'>
                                    <img src={x.activo == null ? x.imagen: urlImg+x.imagen.replace(/\\/g, "/")} />
                                </div>
                                <div className='content'>
                                    <p className='code'>{x.codigo}</p>
                                    <p className='descripcion'>{x.descripcion}</p>
                                    <div className='labels'>
                                        {x.bajo_pedido == true ?
                                            <div className='bajo-pedido'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-truck"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></svg>
                                                <small >Bajo Pedido</small>
                                            </div>
                                            :
                                            ''
                                        }
                                        {x.vender_sin_stock == true ?
                                            <div className='vender-sin-stock'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" stroke-linejoin="round" className="lucide lucide-shopping-bag"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                                                <small >Vender sin Stock</small>
                                            </div>
                                            :
                                            ''
                                        }
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='row'>
                        <div className='col-1'>
                            <button className='btn__general-primary' onClick={() => setPage(page - 1)} disabled={page == 1}>ANTERIOR</button>
                        </div>
                        <div className='col-10'>

                        </div>
                        <div className='col-1'>
                            <button className='btn__general-primary' onClick={() => setPage(page + 1)}>SIGUIENTE</button>
                        </div>
                    </div>
                </div>
                <SalesCard idA={idA} />
            </div>
        </div>

    );
};

export default ArticleViewModal;
