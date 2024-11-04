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

const ArticleViewModal = () => {
    const userState = useUserStore(state => state.user);
    let user_id = userState.id;

    const setModalArticleView = storeArticleView(state => state.setModalArticleView)
    const setModalSalesCard = storeSaleCard(state => state.setModalSalesCard);

    const { modalArticleView }: any = useStore(storeArticleView)

    const {getFamilies} = FamiliesRequests()

    const setIdArticle = storeSaleCard(state => state.setIdArticle)

    const { getArticles }: any = articleRequests();
    const [articles, setArticles] = useState<any>([]);

    const [families, setFamilies] = useState<any>([])

    const [dataCollection, setDataCollection] = useState<any>()

    let fetch = async () => {
        let resultFamilies = await getFamilies(user_id)
    
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
        setFamilies(resultFamilies)
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

    const modal = async (x: any) => {
        if(x.id_familia) {
            setIdArticle(x.id)
            setModalSalesCard('sale-card')
            console.log(x)
        } else {
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
                get_areas_produccion: false,
                coleccion: false,
                id_coleccion: x.id,
                get_stock: false,
                get_web: false,
                get_unidades: false
            };
    
            let result = await getArticles(data);
            setArticles(result);
            setDataCollection(x)
        }
       
      
    }

    const [isChecked, setIsChecked] = useState(false);

    const handlecollectionsOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setIsChecked(checked); // Actualiza el estado con true o false
    };

    const search = async () => {
        let data = {
            id: 0,
            activos: true,
            nombre: inputs.name,
            codigo: '',
            familia: 0,
            proveedor: 0,
            materia_prima: 0,
            get_sucursales: false,
            get_proveedores: false,
            get_max_mins: false,
            get_plantilla_data: false,
            get_areas_produccion: false,
            get_stock: false,
            coleccion: isChecked,
            id_coleccion: isChecked ? dataCollection.id : 0,
            get_web: false,
            get_unidades: false
        };

        let result = await getArticles(data);
        setArticles(result);
    }

    const [selectUsers, setSelectUsers] = useState<boolean>(false);
    const [selectUser, setSelectUser] = useState<number | null>(null)

    const openSelectUsers = () => {
        setSelectUsers(!selectUsers)
      }

      const usersChange = (user: any) => {
        setSelectUser(user.id)
        setSelectUsers(!selectUsers)
    
      }

      const [userSearchTerm, setUserSearchTerm] = useState<string>('');

    return (
        <div className={`overlay__article-view__modal ${modalArticleView == 'article-view__modal' ? 'active' : ''}`}>
            <div className={`popup__article-view__modal ${modalArticleView == 'article-view__modal' ? 'active' : ''}`}>
                <a href="#" className="btn-cerrar-popup__article-view__modal" onClick={() => setModalArticleView('')}>
                    <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512">
                        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                    </svg>
                </a>
                <p className='title__modals'>Articulos</p>
                <div className='article__view_container'>
                    <div className='row__one'>
                        <div>
                            <label className='label__general'>Código</label>
                            <div className='warning__general'><small>Este campo es obligatorio</small></div>
                            <input className='inputs__general' type='text' name='code' value={inputs.code} onChange={handleInputChange} placeholder='Ingresa el código' />
                        </div>
                        <div>
                            <label className='label__general'>Nombre</label>
                            <div className='warning__general'><small>Este campo es obligatorio</small></div>
                            <input className='inputs__general' type='text' name='name' value={inputs.name} onChange={handleInputChange} placeholder='Ingresa el nombre' />
                        </div>
                        <div className='select__container'>
                      <label className='label__general'>Familias</label>
                      <div className='select-btn__general'>
                        <div className={`select-btn ${selectUsers ? 'active' : ''}`} onClick={openSelectUsers}>
                          <p>{selectUser ? families?.find((s: { id: number }) => s.id === selectUser)?.nombre : 'Selecciona'}</p>
                          <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                        </div>
                        <div className={`content ${selectUsers ? 'active' : ''}`}>
                          <ul className={`options ${selectUsers ? 'active' : ''}`} style={{ opacity: selectUsers ? '1' : '0' }}>
                            <div className='search'>
                              <input type="text" onChange={(e) => setUserSearchTerm(e.target.value)} value={userSearchTerm} placeholder="Buscar..." />
                            </div>
                            {families?.filter((user: any) => user.nombre.toLowerCase().includes(userSearchTerm.toLowerCase()))
                              .map((user: any) => (
                                <li key={user.id} onClick={() => usersChange(user)}>
                                  {user.nombre}
                                </li>
                              ))
                            }
                          </ul>
                        </div>
                      </div>
                    </div>
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
                        <div>
                            <button className='btn__general-purple' onClick={search}>Buscar</button>
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
