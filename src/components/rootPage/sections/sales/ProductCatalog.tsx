import React, { useEffect, useState } from 'react';
import './ArticleView.css';
import { articleRequests } from '../../../../fuctions/Articles';
import useUserStore from '../../../../zustand/General';
import SalesCard from './SalesCard';
import { storeArticleView } from '../../../../zustand/ArticleView';
import './styles/ProductCatalog.css'
import APIs from '../../../../services/services/APIs';
import { storeSaleCard } from '../../../../zustand/SaleCard';
import { storeArticles } from '../../../../zustand/Articles';
interface Product {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  familia: number;
  coleccion: number;
  rating: number;
  destacado: boolean;
}

const ProductCatalog: React.FC = () => {
  const [selectedFamilia, setSelectedFamilia] = useState<number | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userId = useUserStore((state) => state.user.id);
  const [families, setFamilies] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [searchFamilia, setSearchFamilia] = useState("");
  const filteredFamilies = families.filter(familia =>
    familia.nombre.toLowerCase().includes(searchFamilia.toLowerCase())
  );

  const [idA, setIdA] = useState<any>(null);
  const [i, setI] = useState(0);
  const setIdArticle = storeSaleCard(state => state.setIdArticle)
  const setStatusArticle = storeSaleCard(state => state.setStatusArticle);
  const setModalSalesCard = storeSaleCard(state => state.setModalSalesCard);
  const [page, setPage] = useState<number>(1);

  const [dentroColeccion, setDentroColeccion] = useState<boolean>(false)
  const [id_col, setid_col] = useState<any>({})
  const [dentroColeccionNombre, setDentroColeccionNombre] = useState<string>('')
  const [BuscarPor, setBuscarPor] = useState<number>(0)
  const setModalLoading = storeArticles((state: any) => state.setModalLoading);
  const [articles, setArticles] = useState<any>([]);
  const url_img = useUserStore((state) => state.url_img);
  let SearcherController = 0 // 0 => por coleccion y familia, 1-> por codigo descripción
  // Cargar familias al montar el componente
  const loadFamilies = async () => {
    try {
      setLoading(true);
      const familiesData: any = await APIs.getFamilies(userId);
      familiesData.unshift({ id: 0, nombre: 'Todas las Familias' });
      setFamilies(familiesData);

      // Si hay familias, seleccionar la primera y cargar sus colecciones
      if (familiesData && familiesData.length > 0) {
        setSelectedFamilia(familiesData[0].id);
        await loadCollections(familiesData[0].id);
      }
    } catch (error) {
      console.error("Error cargando familias:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar colecciones de una familia específica
  const loadCollections = async (familiaId: number) => {
    try {
      setLoading(true);
      let collectionsData: any = await APIs.getCollectionByFamily(familiaId);

      collectionsData.unshift({ id: 0, nombre: 'Todas las Colecciones' });
      setCollections(collectionsData);

      // Limpiar selección de colección
      setSelectedCollection(null);

      // Si hay colecciones, seleccionar la primera y cargar sus productos
      if (collectionsData && collectionsData.length > 0) {
        setSelectedCollection(collectionsData[0].id);
        await loadProducts(familiaId, collectionsData[0].id, 1);
      } else {
        // Si no hay colecciones, limpiar productos
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error("Error cargando colecciones:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos de una colección específica
  const loadProducts = async (familiaId: number, collectionId: number, pageNumber: number) => {
    try {
      setLoading(true);
      const data = {
        id: 0,
        activos: true,
        nombre: "",
        codigo: "",
        familia: familiaId,
        proveedor: 0,
        materia_prima: 99,
        get_sucursales: false,
        get_proveedores: false,
        get_max_mins: false,
        get_plantilla_data: false,
        get_areas_produccion: false,
        coleccion: false,
        id_coleccion: collectionId,
        get_stock: false,
        get_web: true,
        get_unidades: false,
        for_vendedor: true,
        page: pageNumber,
        id_usuario: userId,
        light: true,
        no_resultados: 50
      };

      const result: any = await APIs.getArticlesForVendedor(data);
      const productsData = result.data || result || [];

      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error("Error cargando productos:", error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };
  const loadProductsByCodeOrDesc = async (input: string, numberPage:number) => {
    try {
      setLoading(true);
      const data = {
        id: 0,
        activos: true,
        nombre: BuscarPor == 0 ? input : '',
        codigo: BuscarPor == 1 ? input : '',
        familia: 0,
        proveedor: 0,
        materia_prima: 99,
        get_sucursales: false,
        get_proveedores: false,
        get_max_mins: false,
        get_plantilla_data: false,
        get_areas_produccion: false,
        coleccion: false,
        id_coleccion: 0,
        get_stock: false,
        get_web: true,
        get_unidades: false,
        for_vendedor: true,
        page: numberPage,
        id_usuario: userId,
        light: true,
        no_resultados: 50
      };

      const result: any = await APIs.getArticlesForVendedor(data);
      const productsData = result.data || result || [];


      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error("Error cargando productos:", error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadFamilies();
  }, [userId]);

  // Manejar clic en familia
  const handleFamiliaClick = async (familiaId: number) => {
    if (selectedFamilia === familiaId) {
      // Si ya está seleccionada, deseleccionar
      setSelectedFamilia(null);
      setSelectedCollection(null);
      setCollections([]);
      setProducts([]);
      setPage(1);

      setFilteredProducts([]);
    } else {
      // Seleccionar nueva familia
      setPage(1);

      setSelectedFamilia(familiaId);
      await loadCollections(familiaId);
    }
  };

  // Manejar clic en colección
  const handleCollectionClick = async (collectionId: number) => {
    if (selectedCollection === collectionId) {
      // Si ya está seleccionada, deseleccionar
      setSelectedCollection(null);
      setProducts([]);
      setFilteredProducts([]);
      setPage(1);

    } else {
      // Seleccionar nueva colección


      setSelectedCollection(collectionId);
      // if (selectedFamilia) {
      //   await loadProducts(selectedFamilia, collectionId);
      // }
      setPage(1);
      // Aseguramos que `page` se actualice antes de que `selectedCollection` cambie
      setTimeout(() => {
        setSelectedCollection(collectionId);
      }, 0);
    }
  };

  const modal = async (x: any) => {
    setStatusArticle(false);
    setIdArticle(x.id);
    setIdA(i)
    let newi = i + 1;
    setI(newi);
    setModalSalesCard('sale-card');


  };
  const [pendingResetPage, setPendingResetPage] = useState(false);

  useEffect(() => {
    if (selectedFamilia !== null && selectedCollection !== null) {
      if (searchTerm.length > 0) {
      loadProductsByCodeOrDesc(searchTerm, page);

      }else {
      loadProducts(selectedFamilia, selectedCollection, page);

      }
    }
  }, [selectedFamilia, selectedCollection, page]);
  return (
    <>
      <div className="productCatalog-catalog">
        {/* Main Content */}
        <div className="productCatalog-main-content">
          {/* Content Below Header */}
          <div className="productCatalog-content-below-header">
            {/* Sidebar - Familias */}
            <div className="productCatalog-sidebar">
              <div className="productCatalog-sidebar-header">
                <h2>FAMILIAS</h2>
              </div>
              <div className="productCatalog-familia-list">
                <input
                  type="text"
                  placeholder="Buscar familia..."
                  value={searchFamilia}
                  onChange={(e) => setSearchFamilia(e.target.value)}
                  className="productCatalog-familia-search"
                />
                {loading ? (
                  <div className="productCatalog-loading">Cargando familias...</div>
                ) : (
                  filteredFamilies.map((familia) => (
                    <div
                      key={familia.id}
                      className={`productCatalog-familia-item ${selectedFamilia === familia.id ? "active" : ""}`}
                      onClick={() => handleFamiliaClick(familia.id)}
                    >
                      <span className="productCatalog-familia-name">{familia.nombre}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Content */}
            <div className="productCatalog-right-content">
              {/* Collections y Search */}
              <div className="productCatalog-collections-search-section">
                <div className="productCatalog-collections-nav">
                  {loading ? (
                    <div className="productCatalog-loading">Cargando colecciones...</div>
                  ) : (
                    collections.map((collection) => (
                      <button
                        key={collection.id}
                        className={`productCatalog-collection-btn ${selectedCollection === collection.id ? "active" : ""
                          }`}
                        onClick={() => handleCollectionClick(collection.id)}
                      >
                        {collection.nombre}
                      </button>
                    ))
                  )}
                </div>
                <div className="productCatalog-search-container">
                  <div className='row'>
                    <div className='col-8 md-col-12'>
                      <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="productCatalog-search-input"
                        onKeyUp={(e) => e.key === 'Enter' && loadProductsByCodeOrDesc(e.currentTarget.value,1)}
                      />
                    </div>
                    <div className='col-4 md-col-12'>
                      <select className='inputs__general' onChange={(e) => setBuscarPor(Number(e.target.value))} value={BuscarPor}>
                        <option value="0">Por Descripción</option>
                        <option value="1">Codigo</option>
                      </select>
                    </div>
                  </div>
                  {/* <Search className="productCatalog-search-icon" /> */}


                </div>
              </div>

              {/* Products Section */}
              <div className="productCatalog-products-section">
                <div className="productCatalog-products-header">
                  <h2 className="productCatalog-products-title">
                    {selectedCollection
                      ? `PRODUCTOS - ${collections.find((c) => c.id === selectedCollection)?.nombre}`
                      : "SELECCIONA UNA COLECCIÓN"}
                  </h2>
                  <span className="productCatalog-products-count">
                    {filteredProducts.length} productos encontrados
                  </span>
                </div>

                {loading ? (
                  <div className="productCatalog-loading">Cargando productos...</div>
                ) : (
                  <div className="productCatalog-products-grid">
                    {filteredProducts.map((x: any, i: number) => (
                      <div className='item' key={i} onClick={() => modal(x)} >
                        {/* <div className='stock'>
                        
                      </div> */}
                        <div className='img'>
                          <img
                            src={`${url_img}${x.imagen}`}
                            alt={x.nombre}
                            className="productCatalog-product-image"
                          />                                </div>
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
                      </div>
                    ))}
                  </div>
                )}

                {!loading && filteredProducts.length === 0 && (
                  <div className="productCatalog-no-products">
                    <h3>No se encontraron productos</h3>
                    <p>Intenta ajustar tus filtros o términos de búsqueda</p>
                  </div>
                )}
              </div>
              <div className='row'>
                <div className='col-1'>
                  <button className='btn__general-primary' onClick={() => { setPage(page - 1); SearcherController = 1; }} disabled={page == 1}>ANTERIOR</button>
                </div>
                <div className='col-10'>

                </div>
                <div className='col-1'>
                  <button className='btn__general-primary' onClick={() => { setPage(page + 1); SearcherController = 1; }}>SIGUIENTE</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Modal */}
        {/* <ProductModal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      product={selectedProduct}
      url_img={url_img}
    /> */}

      </div>
      <SalesCard idA={idA} />

    </>
  );

};

export default ProductCatalog;
