import React, { useEffect, useState } from 'react';
import './ArticleView.css';
import { articleRequests } from '../../../../fuctions/Articles';
import SalesCard from './SalesCard';
import { storeSaleCard } from '../../../../zustand/SaleCard';
import { storeArticleView } from '../../../../zustand/ArticleView';


const ArticleView = () => {


    const setModalArticleView = storeArticleView(state => state.setModalArticleView)



    const setIdArticle = storeSaleCard(state => state.setIdArticle)

    const { getArticles }: any = articleRequests();
    const [articles, setArticles] = useState<any>([]);

    const fetch = async () => {
        const data = {
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
            get_stock: false,
            get_web: false,
            get_unidades: false
        };

        const result = await getArticles(data);
        setArticles(result);
    };

    useEffect(() => {
        fetch();
        console.log(articles);
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
        setModalArticleView('sale-card')
    }

    return (
        <div className='article__view'>
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
                    {articles?.map((x: any) => (
                        <div className='item' key={x.id} onClick={() => modal(x)}>
                            <div className='img' style={{ backgroundImage: `url(${x.imagen})` }}>
                               
                            </div>
                            <p>{x.codigo}</p>
                            <p>{x.descripcion}</p>
                        </div>
                    ))}
                </div>
                <SalesCard />
            </div>
        </div>
    );
};

export default ArticleView;
