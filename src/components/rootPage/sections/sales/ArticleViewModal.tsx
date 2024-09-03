import React, { useEffect, useState } from 'react';
import './ArticleView.css';
import { articleRequests } from '../../../../fuctions/Articles';
import useUserStore from '../../../../zustand/General';
import SalesCard from './SalesCard';
import { storeArticleView } from '../../../../zustand/ArticleView';
import './styles/ArticleViewModal.css'
import { useStore } from 'zustand';
import { storeSaleCard } from '../../../../zustand/SaleCard';

const ArticleViewModal = () => {
    const userState = useUserStore(state => state.user);
    let user_id = userState.id;

    const setModalArticleView = storeArticleView(state => state.setModalArticleView)
    const setModalSalesCard = storeSaleCard(state => state.setModalSalesCard);

    const {modalArticleView}: any = useStore(storeArticleView)

    const setIdArticle = storeSaleCard(state => state.setIdArticle)

    const { getArticles }: any = articleRequests();
    const [articles, setArticles] = useState<any>([]);

    let fetch = async () => {
        let data = {
            id: 0,
            activos: true,
            nombre: '',
            codigo: '',
            familia: 0,
            proveedor: 0,
            materia_prima: 0,
            get_sucursales: false,
            get_proveedores: false,
            get_max_mins: false,
            get_plantilla_data: false,
            get_areas_produccion: true,
            get_stock: false,
            get_web: false,
            get_unidades: false
        };

        let result = await getArticles(data);
        setArticles(result);
    };

    useEffect(() => {
        fetch();

    }, []);

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

    const modal = (x: any) => {
        setIdArticle(x.id)
        setModalSalesCard('sale-card')
    }

    return (
        <div className={`overlay__article-view__modal ${modalArticleView == 'article-view__modal' ? 'active' : ''}`}>
        <div className={`popup__article-view__modal ${modalArticleView == 'article-view__modal' ? 'active' : ''}`}>
                <a href="#" className="btn-cerrar-popup__article-view__modal" onClick={() => setModalArticleView('')}>
                <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512">
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                </svg>
                </a>
                <p className='title__modals'>Crea nueva cotización</p>
                <div className='article__view_container'>
                    <div className='row__one'>
                        <div>
                            <label className='label__general'>Código</label>
                            <div className='warning__general'><small>Este campo es obligatorio</small></div>
                            <input className='inputs__general' type='text' name='code' value={inputs.code} onChange={handleInputChange} placeholder='Ingresa el código'/>
                        </div>
                        <div>
                            <label className='label__general'>Nombre</label>
                            <div className='warning__general'><small>Este campo es obligatorio</small></div>
                            <input className='inputs__general' type='text' name='name' value={inputs.name} onChange={handleInputChange} placeholder='Ingresa el nombre'/>
                        </div>
                    </div>
                    <div className='row__two'>
                        {articles.map((x: any) => (
                            <div className='item' key={x.id} onClick={() => modal(x)}>
                                <div className='img' style={{ backgroundImage: `url(${x.imagen})` }}>
                                
                                </div>
                                <p>{x.codigo}</p>
                                <p>{x.descripcion}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <SalesCard />
            </div>
        </div>

    );
};

export default ArticleViewModal;
