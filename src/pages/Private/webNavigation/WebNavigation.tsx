
import { storeWebPages } from "../../../zustand/WebPages";
import useUserStore from '../../../zustand/General';
import { useEffect, useState, useRef } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './styles/WebNavigation.css'
import Services from "./containers/services";
import Carousel from "./containers/Carousel";
import Description from "./containers/Description";
import Banner from "./containers/Banner";
import SmallBanner from './containers/SmallBanner'
import Form from "./containers/Form";
import { Reorder } from "framer-motion";
import Slider from "./containers/Slider";
import dataJson from './jsons/banner.json'
import serviceJson from "./jsons/services.json";
import './styles/editor.css'
import imagesJson from './jsons/imagesJson.json'
import FontWeight from './jsons/fontWeight.json'
import { FamiliesRequests } from "../../../fuctions/Families";
import ban from '../../../assets/web-navigation/img/banner.png'
import serv from '../../../assets/web-navigation/img/servicios.png'
import desc from '../../../assets/web-navigation/img/descripcion.png'
import sli from '../../../assets/web-navigation/img/slider.png'
import car from '../../../assets/web-navigation/img/carrusel.png'
import sb from '../../../assets/web-navigation/img/smallbanner.png'
const WebNavigation = () => {
  const userState = useUserStore(state => state.user);
  let user_id = userState.id
  const { getWeb, HeaderAndFooter, headerAndFooter, updateWeb,  updateSectionWeb,
  createContenedor, getContenedor, updateContenedor, deleteContenedor, createSectionsWeb,updateSectionsWeb, getSectionsWeb, deleteSectionsWeb,
  createProductsWeb, updateProductsWeb, deleteProductsWeb, updateContenedorOrder}: any = storeWebPages();
  const {getFamilies}: any = FamiliesRequests()
  const [families, setFamilies] = useState<any>()

  let id_sucursal = localStorage.getItem('Id_sucursal');
  
  const [copyContainer, setCopyContainer] = useState<any>([]);

  const [idContainerH, setIdContainerH] = useState<any>(null)

  const idConatinerHeader = async (x: any) => {
    setIdContainerH(x.id)

   
    
    const container = await getContenedor(x.id);

    if (container) {
      setCopyContainer(container);
    }
  }

  const fetch = async () => {
    let resultFamilies = await getFamilies(user_id)
    setFamilies(resultFamilies)
  
  }

  const [sections, setSections] = useState<any>()

  useEffect(() => {
    fetch()

    let hyf = async () => {
      let re = await HeaderAndFooter(id_sucursal)
      setlogoImage(re.logo)

      return re
    }
  
    const fetchData = async () => {

    const sections = await getSectionsWeb(id_sucursal);
    setSections(sections)
    const container = await getContenedor(sections[0].id);
    if (container && Array.isArray(container)) {
      const updatedContainer = container.map(item => {
        const [
          textAlign1, fontSize1, fontWeight1, color1,
          textAlign2, fontSize2, fontWeight2, color2,
          textAlign3, fontSize3, fontWeight3, color3,
          textAlign4, fontSize4, fontWeight4, color4,
          textAlign5, fontSize5, fontWeight5, color5,
          textAlign6, fontSize6, fontWeight6, color6,
        ] = item.imagen6.split('|');
        
        return {
          ...item,
          textAlign1: textAlign1, fontSize1: fontSize1, fontWeight1: fontWeight1, color1: color1,
          textAlign2: textAlign2, fontSize2: fontSize2, fontWeight2: fontWeight2, color2: color2,
          textAlign3: textAlign3, fontSize3: fontSize3, fontWeight3: fontWeight3, color3: color3,
          textAlign4: textAlign4, fontSize4: fontSize4, fontWeight4: fontWeight4, color4: color4,
          textAlign5: textAlign5, fontSize5: fontSize5, fontWeight5: fontWeight5, color5: color5,
          textAlign6: textAlign6, fontSize6: fontSize6, fontWeight6: fontWeight6, color6: color6,
          
        };
      });
      
      setCopyContainer(updatedContainer);
    }
  };
  fetchData()
  hyf()
  // console.log(hyf())
  
  }, [id_sucursal, idContainerH]);

  const [logoImage, setlogoImage] = useState<any>(null)

  
 

  const [web, setWeb] = useState<any>([])

  const [stateResponse, setStateResponse] = useState<boolean>(false)

  const responseWeb = () => {
    setStateResponse(!stateResponse)
  }


  const [textCenteringState] = useState('');
  const [textFontSize, setTextFontSize] = useState<number>(15);
  const [colorState, setColorState] = useState<string>('');

  
  const [selectTypesFamilies, setSelectTypesFamilies] = useState<any>()
  const [selectedTypeFamily, setSelectedTypeFamily] = useState<any>()


  const openSelectFamilies = () => {
    setSelectTypesFamilies(!selectTypesFamilies)
  }
  
  const handleTypesFamiliesChange = (family: any) => {
    setSelectedTypeFamily(family)
    setSelectTypesFamilies(false)
  }


  const [selectTypesFontWeight, setSelectTypesFontWeight] = useState<any>()
  const [selectedTypeFontWeight, setSelectedTypeFontWeight] = useState<any>()


  const openSelectFontWeightSections = () => {
    setSelectTypesFontWeight(!selectTypesFontWeight)
  }
  


  const colorPalette = (value: any) => {
    if(colorState !== value) {
      setColorState(value)
    } else {
      setColorState('')
    }
   
  }



 
  const [selectedColor] = useState<string>('#000000');
  const colorInputRef = useRef<HTMLInputElement>(null);


  const handleIconClick = () => {
    if (colorInputRef.current) {
      colorInputRef.current.click();
    }
  };

 
// useEffect(() => {

// }, [selectedTypeFamily])


const [categories, setCategories] = useState<any>([])
const [products, setProducts] = useState<any>([])

const [selectTypesSections, setSelectTypesSections] = useState<boolean>(false);
const [selectedTypeSection, setSelectedTypeSection] = useState<number | null>(null)

const [setInputUpdateCategories] = useState<any>('')
const [setImgUpdateCategories] = useState<any>('')
const [setTypeUpdateCategories] = useState<any>('')
const [setViewUpdateCategories] = useState<any>('')


const openSelectTypesSections = () => {
  setSelectTypesSections(!selectTypesSections)
}


const handleTypesSectionsChange = (x: any) => {
  setSelectedTypeSection(x.id);
  setSelectTypesSections(false);
  setNameSection(x.seccion)

  // Buscamos la sección correspondiente al tipo seleccionado
  const selectedSection = web.secciones.find((section: any) => section.id === x.id);



  if (selectedSection) {
    setCategories(selectedSection.categorias);
  
  }
  
  

}





const [selectTypesCategories, setSelectTypesCategories] = useState<boolean>(false);
const [selectedTypeCategory, setSelectedTypeCategory] = useState<number | null>(null)



const openSelectCategories = () => {
  setSelectTypesCategories(!selectTypesCategories)

}

const handleCategoriesChange = (x: any) => {
  setSelectedTypeCategory(x.id)
  setInputUpdateCategories(x.nombre)
  setTypeUpdateCategories(x.tipo)
  setViewUpdateCategories(x.vista)
  setImgUpdateCategories(x.imagen)
  setSelectTypesCategories(false)
  console.log(x.id)

   // Si hay categorías y al menos una tiene productos, establecemos los productos de la primera categoría
 if(x) {
  const x = categories.find((category: any) => category.id === selectedTypeCategory);
  if (x) {
    // Si la categoría existe, buscamos los productos que pertenecen a esa categoría
    const productosSeleccionados = x.productos.filter((producto: any) => producto.id_categoria === selectedTypeCategory);
   
    if (productosSeleccionados.length > 0) {
      setProducts(productosSeleccionados);
    } else {
      // Si no hay productos disponibles, limpiamos la lista de productos
      setProducts([]);
    }
  } else {
    // Si no hay categorías disponibles, limpiamos la lista de productos
    setProducts([]);
  }
 }
}




const [selectTypesProducts, setSelectTypesProducts] = useState<boolean>(false);
const [selectedTypeProduct, setSelectedTypeProduct] = useState<number | null>(null)


const [nameProducts, setNameProducts] = useState<string>('')
const [descriptionProducts, setDescriptionProducts] = useState<string>('')
const [imgProducts, setImgProducts] = useState<any>('')

const handleImgProductsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const image = reader.result as string; // Asegurar que image sea de tipo string
      setImgProducts(image);
    };
    reader.onerror = (error) => {
      console.error('Error al leer el archivo:', error);
    };
    reader.readAsDataURL(file);
  }
};


const openSelectProducts = () => {
  setSelectTypesProducts(!selectTypesProducts)

}

const handleProductsChange = (x: any) => {
  setSelectedTypeProduct(x.id)
  setNameProducts(x.nombre)
  setDescriptionProducts(x.descripcion)
  setImgProducts(x.imagen)
  setSelectTypesProducts(false)
}




const createProducts = async () => {
  let data;
  data = {
    id_categoria: selectedTypeCategory,
    nombre: nameProducts,
    descripcion: descriptionProducts,
    imagen: imgProducts
  };
  
  try {
    await createProductsWeb(data);
  } catch (error) {
    console.error("Error al actualizar la categoría:", error);
  }
};



const updateProducts = async () => {
  let data = {
      id: selectedTypeProduct,
      id_categoria: selectedTypeCategory,
      nombre: nameProducts,
      descripcion: descriptionProducts,
      imagen: imgProducts
    };

  try {
    await updateProductsWeb(data); // Llamar a la función para actualizar la categoría
  } catch (error) {
    console.error("Error al actualizar la categoría:", error);
  }
};

const deleteProducts = async () => {
  let id = selectedTypeProduct
  await deleteProductsWeb({id})
}


  
const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const image = reader.result as string; // Asegurar que image sea de tipo string
      setlogoImage(image);
      console.log('Imagen convertida a Base64:', image);
    };
    reader.onerror = (error) => {
      console.error('Error al leer el archivo:', error);
    };
    reader.readAsDataURL(file);
  }
};






    ////////////////////////////////////////////////////////////////////////
   ////////////////////////////// ENCABEZADO //////////////////////////////
  ////////////////////////////////////////////////////////////////////////


  const [primaryColor, setPrimaryColor] = useState<any>('');
  const [textColor, setTextColor] = useState<string>('');

  const handlePrimaryColorChange = (newColor: string) => {
    document.documentElement.style.setProperty('--color-header-web-page', newColor);
    setPrimaryColor(newColor);
  };

  const handleTextColorChange = (newColor: string) => {
    document.documentElement.style.setProperty('--secondary-color-web-page', newColor);
    setTextColor(newColor);
  };

  useEffect(() => {
    setPrimaryColor(headerAndFooter.color_primario)
    setTextColor(headerAndFooter.color_secundario)
    document.documentElement.style.setProperty('--color-header-web-page', primaryColor);
    document.documentElement.style.setProperty('--secondary-color-web-page', textColor);
  }, [headerAndFooter])


  const updateGeneral = async () => {
    const data = {
      id: headerAndFooter.id,
      id_sucursal: headerAndFooter.id_sucursal,
      logo: logoImage || '',
      color_primario: primaryColor,
      color_secundario: textColor
    };
    
    await updateWeb(data)
  }



  const [secondsCategory] = useState<any>(null);



  useEffect(() => {
    const fetchData = async () => {
      if (id_sucursal !== undefined) {
        localStorage.setItem('id', JSON.stringify(id_sucursal));
      }

      const id_suc = await localStorage.getItem('id');
      const webData = await getWeb(id_suc);

      setWeb(webData)


     
    };

    fetchData();
  }, [id_sucursal]);







const [activeMenuIndex, setActiveMenuIndex] = useState(null);
const [activeSidebar] = useState<boolean>(false)

const toggleSubMenu = (index: any) => {
  setActiveMenuIndex((prevIndex) => (prevIndex === index ? null : index));
    
};


const sales = {
  backgroundColor: activeMenuIndex === 1 && activeSidebar === true ? '#5d35b0' : ''
}


const [validateSection, setValidateSection] = useState<number>(1)

const changeSOne = () => {
  setValidateSection(1)
}

const changeSTwo = () => {
  setValidateSection(2)
}



const changeSFour = () => {
  setValidateSection(4)
}

// const changeSFive = () => {
//   setValidateSection(5)
// }


useEffect(() => {

  document.documentElement.style.setProperty('--color-header-web-page', web.color_primario);
  document.documentElement.style.setProperty('--secondary-color-web-page', web.color_secundario);
  setlogoImage(web.logo)
}, [web])




   ///////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////Footer/////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////////

  // const [titlesFooterOne, setTitlesFooterOne] = useState<any>([])

  // const [titlesFooterTwo, setTitlesFooterTwo] = useState<any>([])

  // const [titlesFooterThree, setTitlesFooterThree] = useState<any>([])


  // const [titlesFooterFour, setTitlesFooterFour] = useState<string>('Loremp')

  // useEffect(() => {
  //   // console.log('headerAndFooter',)
  //   if (headerAndFooter.texto_footer) {
  //         let titlesOne = JSON.parse(headerAndFooter.texto_footer);
  //         let titlesTwo = JSON.parse(headerAndFooter.texto_footer2);
  //         let titlesThree = JSON.parse(headerAndFooter.texto_footer3);
  //         setTitlesFooterOne(titlesOne)
  //         setTitlesFooterTwo(titlesTwo)
  //         setTitlesFooterThree(titlesThree)
  //   } else {
  //     console.log('No hay data')
  //   }
 
  // }, [web])


//  const updateFooter = () => {

//   let titleOne = JSON.stringify(titlesFooterOne);
//   let titleTwo = JSON.stringify(titlesFooterTwo);
//   let titleThree = JSON.stringify(titlesFooterThree);
  
//   let data = {
//     id: headerAndFooter.id,
//     texto_footer: titleOne,
//     texto_footer2: titleTwo,
//     texto_footer3: titleThree,
//     icono1_footer: '',
//     icono2_footer: '',
//     icono3_footer: '',
//     color_ext: '',
//     color_ext2: ''
//   }



//   try {
//     updateFooterWeb(data)
//   } catch {
    
//   }
// }


// const handleTitlesFooterOneChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
//   const paragraphs = event.target.value.split('\n').map((line, index) => `<p key=${index}>${line}</p>`);
//   setTitlesFooterOne(paragraphs);
// };


// const handleTitlesFooterTwoChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
//   const paragraphs = event.target.value.split('\n').map((line, index) => `<p key=${index}>${line}</p>`);
//   setTitlesFooterTwo(paragraphs);
// };


// const handleTitlesFooterThreeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
//   const paragraphs = event.target.value.split('\n').map((line, index) => `<p key=${index}>${line}</p>`);
//   setTitlesFooterThree(paragraphs);
// };



const [stateToggle, setStateToggle] = useState<boolean>(false)

const toggleMenu = () => {
  setStateToggle(!stateToggle)

}

const overFlow = {
  overflow: stateToggle === true ? 'hidden' : ''
};



const handleDescriptionProductsChange = (value: any) => {
  setDescriptionProducts(value)
}

const handleNameProductsChange = (value: any) => {
  setNameProducts(value)
}

function stripHtml(html: any) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}



const [testProd, settestProd] = useState<any>([])

const [currentTextIndex] = useState(0);
const mainWebpageRef = useRef<HTMLDivElement>(null);
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  if(secondsCategory && secondsCategory) {
    settestProd(secondsCategory[0].productos)
  }


  const handleResize = () => {
    // Obtener las dimensiones del contenedor principal
    const { current: mainWebpage } = mainWebpageRef;
   
    if (mainWebpage) {
      const width = mainWebpage.getBoundingClientRect().width;
      if (width <= 600) {
        setIsMobile(true);
        console.log('Es menor')
      } else {
        setIsMobile(false);
      }
    }
  };

  // Llamamos a handleResize para establecer el estado inicial
  handleResize();

}, [testProd.length, testProd, mainWebpageRef, isMobile, currentTextIndex]);





  const [nameSection, setNameSection] = useState<string>('')


  const createSections = async (e: React.FormEvent) => {
    e.preventDefault()
    let data = {
      id_pagina: headerAndFooter.id,
      seccion: nameSection,
      titulo: '',
      imagen: '',
      imagen2: ''

    }
    console.log(data)
    await createSectionsWeb(data)
    const sections = await getSectionsWeb(id_sucursal);
    setSections(sections)
  }


  const handleNameSectionChange = (value: any) => {
    setNameSection(value)
  }

  const deleteSections = async () => {

    await deleteSectionsWeb(selectedTypeSection)
   
    const sections = await getSectionsWeb(id_sucursal);
    setSections(sections)
  }

  const updateSections = async (e: React.FormEvent) => {
    e.preventDefault()
    let data = {
      id: selectedTypeSection,
      seccion: nameSection,
      titulo: '',
      imagen: '',
      imagen2: ''

    }
    await updateSectionWeb(data)
    const sections = await getSectionsWeb(id_sucursal);
    setSections(sections)
  }




  const [dataServices] = useState<any>([
 
  ]);



 




//////////////////////// BANNER /////////////////








//////////////////////// SERVICIOS /////////////////////////

const [dataNumberService, setDataNumberService] = useState<any>()

const editServicePadre = (number: any) => {
  setDataNumberService(number);
 
};

useEffect(() => {

}, [dataNumberService])


  const handleImageContainerChange = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = () => {
      const imageUrl = reader.result; 
      if(imageUrl !== undefined && imageUrl !== null) {
        if(dataContainer.tipo_contenedor == 3) {
          setDataEdit({
            ...dataEdit,
            imagen: imageUrl,          
          });
        }

        if(dataContainer.tipo_contenedor == 2 ) {
          switch(dataNumberService) {
            case 1:
              setDataEdit({
                ...dataEdit,
                imagen: imageUrl,          
              });
              break;
            case 2:
              setDataEdit({
                ...dataEdit,
                imagen2: imageUrl,          
              });
              break;
            case 3:
              setDataEdit({
                ...dataEdit,
                imagen3: imageUrl,          
              });
              break;
            default:
              break;
          }
        }
        }
       
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  


  
  


  const [stateUpdateC] = useState<boolean>(true)






  const deleteBanner = async (item: any) => {
    setCopyContainer((prevItems: any) => prevItems.filter((x: any) => x.id !== item.id));
    await deleteContenedor(item.id)
  }

  
const SaveContainer = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // let id = selectedTypeSection;
  // let id_pagina = headerAndFooter.id;
  // let seccion = nameSection;
  // let id_familia = 0;

  if(dataNumberService === 1) {
    let newData = {
      titulo: dataServices[0].titulo,
      imagen: dataServices[0].imagen,
      imagen2: dataServices[0].imagen2
    };

    // Define la función setData fuera del objeto newData
    const setData = async () => await updateSectionWeb(newData);
    await setData();
   
  }

  if(dataNumberService === 2) {
    let newData = {
      titulo: dataServices[0].titulo,
      imagen: dataServices[0].imagen,
      imagen2: dataServices[0].imagen2
    };

    // Define la función setData fuera del objeto newData
    const setData = async () => await updateSectionWeb(newData);
    await setData();
   
  }
  if(dataNumberService === 5) {
    let newData = {
      titulo: dataServices[0].titulo,
      imagen: dataServices[0].imagen,
      imagen2: dataServices[0].imagen2
    };

    // Define la función setData fuera del objeto newData
    const setData = async () => await updateSectionWeb(newData);
    await setData();
   
  }

  const container = await getContenedor(sections[0].id);
    if (container && Array.isArray(container)) {
      const updatedContainer = container.map(item => {
        const [
          textAlign1, fontSize1, fontWeight1, color1,
          textAlign2, fontSize2, fontWeight2, color2,
          textAlign3, fontSize3, fontWeight3, color3,
          textAlign4, fontSize4, fontWeight4, color4,
          textAlign5, fontSize5, fontWeight5, color5,
          textAlign6, fontSize6, fontWeight6, color6,
        ] = item.imagen6.split('|');
        
        return {
          ...item,
          textAlign1: textAlign1, fontSize1: fontSize1, fontWeight1: fontWeight1, color1: color1,
          textAlign2: textAlign2, fontSize2: fontSize2, fontWeight2: fontWeight2, color2: color2,
          textAlign3: textAlign3, fontSize3: fontSize3, fontWeight3: fontWeight3, color3: color3,
          textAlign4: textAlign4, fontSize4: fontSize4, fontWeight4: fontWeight4, color4: color4,
          textAlign5: textAlign5, fontSize5: fontSize5, fontWeight5: fontWeight5, color5: color5,
          textAlign6: textAlign6, fontSize6: fontSize6, fontWeight6: fontWeight6, color6: color6,
          
        };
      });
      
      setCopyContainer(updatedContainer);
    }
  
}



//////////////////////////////////////////////////
///////////////CREAR CONTENEDORES////////////////
/////////////////////////////////////////////////

const saveContainer = async (x: any) => {

  let id_seccion = idContainerH;
  let id_familia = 0;
  let tipo_contenedor = x;



   ///////////////////////////////
  ////CONTENEDRO DE BANNER///////
 ///////////////////////////////



  if(x === 1) {
    let data = {
      id_seccion,
      id_familia,
      tipo_contenedor,
      imagen: dataJson.imagen,
      titulo: dataJson.titulo,
    }

    // Define la función setData fuera del objeto newData
    setCopyContainer([...copyContainer, data])
    const setData = async () => await createContenedor(data);
    await setData(); 
  }

  ////CONTENEDRO DE SERVICIOS///////

  if(x === 2) {
    let data = {
      id_seccion,
      id_familia,
      tipo_contenedor,
      imagen: serviceJson.imagen,
      titulo: serviceJson.titulo,
      imagen4: serviceJson.descripcion,
      imagen2: serviceJson.imagen,
      titulo2: serviceJson.titulo,
      titulo4: serviceJson.descripcion,
      imagen3: serviceJson.imagen,
      titulo3: serviceJson.titulo,
      titulo5: serviceJson.descripcion
    }

    // Define la función setData fuera del objeto newData
    setCopyContainer([...copyContainer, data])
    const setData = async () => await createContenedor(data);
    await setData(); 
  }

  ////CONTENEDRO DE 3 ///////
  if(x == 3) {
    let data = {
      id_seccion,
      id_familia,
      tipo_contenedor,
      imagen: dataJson.imagen,
      titulo: serviceJson.titulo,
      imagen4: serviceJson.descripcion
    }

    // Define la función setData fuera del objeto newData
    setCopyContainer([...copyContainer, data])
    const setData = async () => await createContenedor(data);
    await setData(); 
  }

    ////CONTENEDRO DE SLIDER ///////
    if(x == 4) {
      let data = {
        id_seccion,
        id_familia,
        tipo_contenedor,
        imagen: imagesJson.image,
        titulo: serviceJson.titulo,
        imagen2: imagesJson.image,
        titulo2: imagesJson.image,
        imagen3: imagesJson.image,
        titulo3: imagesJson.image,
        imagen4: serviceJson.descripcion,
        titulo4: imagesJson.image,
        imagen5: imagesJson.image,
        titulo5: imagesJson.image,
        titulo6: imagesJson.image,
        imagen6: imagesJson.image,
      }
  
      // Define la función setData fuera del objeto newData
      setCopyContainer([...copyContainer, data])
      const setData = async () => await createContenedor(data);
      await setData(); 
    }

    ////CONTENEDRO DE SLIDER ///////
    if(x == 6) {
      let data = {
        id_seccion,
        id_familia,
        tipo_contenedor,
        imagen: dataJson.imagen,
        titulo: serviceJson.titulo,
        imagen4: serviceJson.descripcion
      }
  
      // Define la función setData fuera del objeto newData
      setCopyContainer([...copyContainer, data])
      const setData = async () => await createContenedor(data);
      await setData(); 
    }

      //CONTENEDRO DE SLIDER ///////
      if(x == 5) {
        let data = {
          id_seccion,
          id_familia: selectedTypeFamily.id,
          tipo_contenedor,
          imagen: '',
          titulo: serviceJson.titulo,
          imagen4: serviceJson.descripcion
        }
    
        // Define la función setData fuera del objeto newData
        setCopyContainer([...copyContainer, data])
        const setData = async () => await createContenedor(data);
        await setData(); 
      }
}





/////////////////////////////////////////////////////
///////////////EDITOR DE LOS CONTENEDORES///////////
////////////////////////////////////////////////////

const [dataEdit, setDataEdit] = useState<any>({
  imagen: "",
  titulo: "",
  titulo2: "",
  imagen2: "",
  titulo3: "",
  imagen3: "",
  titulo4: "",
  imagen4: "",
  titulo5: "",
  imagen5: "",
  titulo6: "",
  imagen6: ""

});


















const [dataContainer, setDataContainer] = useState<any>([])
const [index, setIndex] = useState<any>(null)

  


const containerEditor = async (item: any, index: any) => {
  setIndex(index);
  // setColorState(false)

  setDataContainer(item);

  const [
      textAlign1,fontSize1, fontWeight1, color1,
      textAlign2, fontWeight2, fontSize2, color2
  ] = item.imagen6.split('|'); // Use item instead of copyContainer

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const updatedCopyContainer = [...copyContainer];
  updatedCopyContainer[index] = {
    ...updatedCopyContainer[index],
    textAlign1: textAlign1,
    fontSize1: fontSize1,
    fontWeight1: fontWeight1,
    color1: color1,
    textAlign2: textAlign2,
    fontWeight2: fontWeight2,
    fontSize2: fontSize2,
    color2: color2
  };
  
  setCopyContainer(updatedCopyContainer);
  console.log(copyContainer);

};


const handleInputTitleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
  const value = event.target.value;
  const updatedCopyContainer = [...copyContainer];
  // Actualiza `titulod` como una cadena de texto
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], titulo: value };
  setCopyContainer(updatedCopyContainer);

}

const handleDescriptionContainerChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
  const value = event.target.value;
  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], imagen4: value };
  setCopyContainer(updatedCopyContainer);
}



////////////////////////////////////Imagenes///////////////////////////////////////////
const handleImageChange = (event: any) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const imageUrl = reader.result; 
    if (imageUrl !== undefined && imageUrl !== null) {
      const updatedCopyContainer = [...copyContainer];
      updatedCopyContainer[index] = { ...updatedCopyContainer[index], imagen: imageUrl };
      setCopyContainer(updatedCopyContainer);
  }
  };

  if (file) {
    reader.readAsDataURL(file);
  }
};

const handleImage2Change = (event: any) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const imageUrl = reader.result; 
    if (imageUrl !== undefined && imageUrl !== null) {
      const updatedCopyContainer = [...copyContainer];
      updatedCopyContainer[index] = { ...updatedCopyContainer[index], imagen2: imageUrl };
      setCopyContainer(updatedCopyContainer);
  }
  };

  if (file) {
    reader.readAsDataURL(file);
  }
};

const handleImage3Change = (event: any) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const imageUrl = reader.result; 
    if (imageUrl !== undefined && imageUrl !== null) {
      const updatedCopyContainer = [...copyContainer];
      updatedCopyContainer[index] = { ...updatedCopyContainer[index], imagen3: imageUrl };
      setCopyContainer(updatedCopyContainer);
  }
  };

  if (file) {
    reader.readAsDataURL(file);
  }
};



// const handleImagen2Change = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
//   const value = event.target.value;
//   const updatedCopyContainer = [...copyContainer]; 
//   updatedCopyContainer[index] = { ...updatedCopyContainer[index], imagen4: value };
//   setCopyContainer(updatedCopyContainer);
// }

// const handleImagen3Change = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
//   const value = event.target.value;
//   const updatedCopyContainer = [...copyContainer]; 
//   updatedCopyContainer[index] = { ...updatedCopyContainer[index], imagen4: value };
//   setCopyContainer(updatedCopyContainer);
// }

// const handleImagen4Change = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
//   const value = event.target.value;
//   const updatedCopyContainer = [...copyContainer]; 
//   updatedCopyContainer[index] = { ...updatedCopyContainer[index], imagen4: value };
//   setCopyContainer(updatedCopyContainer);
// }

// const handleImagen5Change = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
//   const value = event.target.value;
//   const updatedCopyContainer = [...copyContainer]; 
//   updatedCopyContainer[index] = { ...updatedCopyContainer[index], imagen4: value };
//   setCopyContainer(updatedCopyContainer);
// }





////////////////////////////////////Titulo/////////////////////////////////////////

const handleTitleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
  const value = event.target.value;
  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], titulo: value };
  setCopyContainer(updatedCopyContainer);

}

const handleTitle2Change = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
  const value = event.target.value;
  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], titulo2: value };
  setCopyContainer(updatedCopyContainer);

}


const handleTitle3Change = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
  const value = event.target.value;
  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], titulo3: value };
  setCopyContainer(updatedCopyContainer);

}



const handleTitle4Change = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
  const value = event.target.value;
  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], titulo4: value };
  setCopyContainer(updatedCopyContainer);

}


const handleTitle5Change = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
  const value = event.target.value;
  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], titulo5: value };
  setCopyContainer(updatedCopyContainer);

}

const handleTitle6Change = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
  const value = event.target.value;
  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], titulo6: value };
  setCopyContainer(updatedCopyContainer);

}







/////////////////////////////////////////////////////
///////////////UPDATE DE LOS CONTENEDORES///////////
////////////////////////////////////////////////////



const SaveUpdateContainer = async (e: React.FormEvent) => {
  e.preventDefault()
  console.log('copyContainer' ,copyContainer)

  let data = {
    id: copyContainer[index].id,
    id_seccion: copyContainer[index].id_seccion,
    id_familia: selectedTypeFamily ? selectedTypeFamily.id : copyContainer[index].id_familia,
    tipo_contenedor: copyContainer[index].tipo_contenedor,
    imagen: copyContainer[index].imagen,
    titulo: copyContainer[index].titulo,
    imagen2: copyContainer[index].imagen2, 
    titulo2: copyContainer[index].titulo2,
    imagen3: copyContainer[index].imagen3, 
    titulo3: copyContainer[index].titulo3,
    imagen4: copyContainer[index].imagen4, 
    titulo4: copyContainer[index].titulo4,
    imagen5: copyContainer[index].imagen5,
    titulo5: copyContainer[index].titulo5,
    titulo6: copyContainer[index].titulo6,
    imagen6: `${copyContainer[index].textAlign1}|${copyContainer[index].fontSize1}|${copyContainer[index].fontWeight1}|${copyContainer[index].color1}|${copyContainer[index].textAlign2}|${copyContainer[index].fontSize2}|${copyContainer[index].fontWeight2}|${copyContainer[index].color2}|${copyContainer[index].textAlign3}|${copyContainer[index].fontSize3}|${copyContainer[index].fontWeight3}|${copyContainer[index].color3}|${copyContainer[index].textAlign4}|${copyContainer[index].fontSize4}|${copyContainer[index].fontWeight4}|${copyContainer[index].color4}|${copyContainer[index].textAlign5}|${copyContainer[index].fontSize5}|${copyContainer[index].fontWeight5}|${copyContainer[index].color5}|${copyContainer[index].textAlign6}|${copyContainer[index].fontSize6}|${copyContainer[index].fontWeight6}|${copyContainer[index].color6}`
  }

  await updateContenedor(data)
   const container = await getContenedor(idContainerH);
    if (container) {
      setCopyContainer(container);
      console.log(copyContainer)
    }
}


useEffect(() => {

}, [])


const updateContainerOrder = async (item: any, index: any) => {
  let updatedContainer = [...copyContainer];

  // Crea el nuevo dato con la estructura deseada
  let data = {
    id: item.id,
    tipo_contenedor: item.tipo_contenedor,
    order: index
  };

  // Encuentra el índice del elemento con el id correspondiente
  const itemIndex = updatedContainer.findIndex(el => el.id === item.id);

  // Si el elemento existe, reemplázalo por data
  if (itemIndex !== -1) {
    updatedContainer[itemIndex] = data;
  }

  updatedContainer.forEach((element, index) => {
    element.orden = index;
  });

  // Actualiza el estado con el nuevo contenedor
  await updateContenedorOrder(updatedContainer);
  const container = await getContenedor(sections[0].id);
    if (container && Array.isArray(container)) {
      const updatedContainer = container.map(item => {
        const [
          textAlign1, fontSize1, fontWeight1, color1,
          textAlign2, fontSize2, fontWeight2, color2,
          textAlign3, fontSize3, fontWeight3, color3,
          textAlign4, fontSize4, fontWeight4, color4,
          textAlign5, fontSize5, fontWeight5, color5,
          textAlign6, fontSize6, fontWeight6, color6,
        ] = item.imagen6.split('|');
        
        return {
          ...item,
          textAlign1: textAlign1, fontSize1: fontSize1, fontWeight1: fontWeight1, color1: color1,
          textAlign2: textAlign2, fontSize2: fontSize2, fontWeight2: fontWeight2, color2: color2,
          textAlign3: textAlign3, fontSize3: fontSize3, fontWeight3: fontWeight3, color3: color3,
          textAlign4: textAlign4, fontSize4: fontSize4, fontWeight4: fontWeight4, color4: color4,
          textAlign5: textAlign5, fontSize5: fontSize5, fontWeight5: fontWeight5, color5: color5,
          textAlign6: textAlign6, fontSize6: fontSize6, fontWeight6: fontWeight6, color6: color6,
          
        };
      });
      
      setCopyContainer(updatedContainer);
    }
};































//////////////////////////////////Editores de Font Weight//////////////////////////////////////

const handleFontWeightChange = (font: any) => {
  setSelectedTypeFontWeight(font.id)
  setSelectTypesFontWeight(false)

  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], fontWeight1: font.fontWeight }; 
  setCopyContainer(updatedCopyContainer); 
}

const handleFontWeightChangeDos = (font: any) => {
  setSelectedTypeFontWeight(font.id)
  setSelectTypesFontWeight(false)

  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], fontWeight2: font.fontWeight }; 
  setCopyContainer(updatedCopyContainer); 
}

const handleFontWeightChangeTres = (font: any) => {
  setSelectedTypeFontWeight(font.id)
  setSelectTypesFontWeight(false)

  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], fontWeight3: font.fontWeight }; 
  setCopyContainer(updatedCopyContainer); 
}

const handleFontWeightChangeCuatro = (font: any) => {
  setSelectedTypeFontWeight(font.id)
  setSelectTypesFontWeight(false)

  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], fontWeight4: font.fontWeight }; 
  setCopyContainer(updatedCopyContainer); 
}


const handleFontWeightChangeCinco = (font: any) => {
  setSelectedTypeFontWeight(font.id)
  setSelectTypesFontWeight(false)

  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], fontWeight5: font.fontWeight }; 
  setCopyContainer(updatedCopyContainer); 
}

const handleFontWeightChangeSeis = (font: any) => {
  setSelectedTypeFontWeight(font.id)
  setSelectTypesFontWeight(false)

  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], fontWeight6: font.fontWeight }; 
  setCopyContainer(updatedCopyContainer); 
}





//////////////////////////////////Editores de texto//////////////////////////////////////

const textCentering = (value: any) => {
  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], textAlign1: value }; 
  setCopyContainer(updatedCopyContainer); 
};

const textCenteringDos = (value: any) => {
  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], textAlign2: value }; 
  setCopyContainer(updatedCopyContainer); 
};

const textCenteringTres = (value: any) => {
  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], textAlign3: value }; 
  setCopyContainer(updatedCopyContainer); 
};

const textCenteringCuatro = (value: any) => {
  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], textAlign4: value }; 
  setCopyContainer(updatedCopyContainer); 
};

const textCenteringCinco = (value: any) => {
  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], textAlign5: value }; 
  setCopyContainer(updatedCopyContainer); 
};
     
const textCenteringSeis = (value: any) => {
  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], textAlign6: value }; 
  setCopyContainer(updatedCopyContainer); 
};



//////////////////////////////////Editores de Size//////////////////////////////////////

const changeFontSize = (size: any) => {
  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], fontSize1: size }; 
  setCopyContainer(updatedCopyContainer);
  setTextFontSize(size)
}

const changeFontSizeDos = (size: any) => {
  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], fontSize2: size }; 
  setCopyContainer(updatedCopyContainer); 
}

const changeFontSizeTres = (size: any) => {
  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], fontSize3: size }; 
  setCopyContainer(updatedCopyContainer); 
}


const changeFontSizeCuatro = (size: any) => {
  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], fontSize4: size }; 
  setCopyContainer(updatedCopyContainer); 
}


const changeFontSizeCinco = (size: any) => {
  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], fontSize5: size }; 
  setCopyContainer(updatedCopyContainer); 
}


const changeFontSizeSeis = (size: any) => {
  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], fontSize6: size }; 
  setCopyContainer(updatedCopyContainer); 
}


//////////////////////////////////Editores de Color//////////////////////////////////////



const changeTextColor = (value: any) => {
  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], color1: value }; 
  setCopyContainer(updatedCopyContainer); 

}


const changeTextColorDos = (value: any) => {
  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], color2: value }; 
  setCopyContainer(updatedCopyContainer); 

}

const changeTextColorTres = (value: any) => {
  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], color3: value }; 
  setCopyContainer(updatedCopyContainer); 

}

const changeTextColorCuatro = (value: any) => {
  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], color4: value }; 
  setCopyContainer(updatedCopyContainer); 

}

const changeTextColorCinco = (value: any) => {
  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], color5: value }; 
  setCopyContainer(updatedCopyContainer); 

}

const changeTextColorSeis = (value: any) => {
  const updatedCopyContainer = [...copyContainer]; 
  updatedCopyContainer[index] = { ...updatedCopyContainer[index], color6: value }; 
  setCopyContainer(updatedCopyContainer); 
}




const [linkButtons, setLinkButtons] = useState<any>([])
const [linkBotton, setLinkBotton] = useState<any>()
const [linkImage, setLinkImage] = useState<any>()

const handleLinkBottonChange = (event: any) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const imageUrl = reader.result; 
    setLinkImage(imageUrl);
  };

  if (file) {
    reader.readAsDataURL(file);
  }
};



const addLinkButtons = () => {
  let data = {
    image: linkImage,
    link: linkBotton
  }
  setLinkButtons([...linkButtons, data])
}
  return (
    <div className="web_page">
      <header className='hero__web' >
        <form className='hero__web_container'>
          <div className='left__hero'>
            <div className='back_web-page'>
              <svg xmlns="http://www.w3.org/2000/svg" width='20' fill='#9b9b9b' viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
            </div>
            <div className='active__container'>
              <svg xmlns="http://www.w3.org/2000/svg" width='16' fill='#29845a' viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"/></svg>
              <p>Activa</p>
            </div>
          </div>
          <nav className='nav__hero_web'>
          <ul className='nav__links_web'>
            <div onClick={responseWeb}>
              <svg id="fi_7835702" viewBox="0 0 24 24" width="25"  xmlns="http://www.w3.org/2000/svg"><path d="m18 4v16c0 1.1046-.8954 2-2 2h-8c-1.1046 0-2-.8954-2-2v-16c0-1.1046.8954-2 2-2h8c1.1046 0 2 .8954 2 2z" fill="#fff"></path><path d="m16 1.5h-8c-1.3789 0-2.5 1.1216-2.5 2.5v16c0 1.3784 1.1211 2.5 2.5 2.5h8c1.3789 0 2.5-1.1216 2.5-2.5v-16c0-1.3784-1.1211-2.5-2.5-2.5zm1.5 18.5c0 .8271-.6729 1.5-1.5 1.5h-8c-.8271 0-1.5-.6729-1.5-1.5v-16c0-.8271.6729-1.5 1.5-1.5h1.25l.4736.9472c.1694.3388.5156.5528.8944.5528h2.7639c.3788 0 .725-.214.8944-.5528l.4736-.9472h1.25c.8271 0 1.5.6729 1.5 1.5v16zm-3-2c0 .2764-.2236.5-.5.5h-4c-.2764 0-.5-.2236-.5-.5s.2236-.5.5-.5h4c.2764 0 .5.2236.5.5z" ></path></svg>
            </div>
            <div>
              <svg id="fi_4529370" viewBox="0 0 48 48" width="25"  xmlns="http://www.w3.org/2000/svg"><path d="m41 6h-34a4 4 0 0 0 -4 4v22a4 4 0 0 0 4 4h11.87l-.75 6h-4.12a1 1 0 0 0 0 2h20a1 1 0 0 0 0-2h-4.12l-.75-6h11.87a4 4 0 0 0 4-4v-22a4 4 0 0 0 -4-4zm-36 4a2 2 0 0 1 2-2h34a2 2 0 0 1 2 2v19h-38zm22.87 32h-7.74l.75-6h6.23zm15.13-10a2 2 0 0 1 -2 2h-34a2 2 0 0 1 -2-2v-1h38z"></path></svg>
            </div>
          </ul>
          </nav>
        </form>
      </header>
      <div className="main__web">
        <div className="sidebar__web-page-one">
          <button className="item"  onClick={changeSOne}>
            Encabezado
          </button>
          <button className="item"onClick={changeSTwo}>
            Contenedores
          </button>
          <button className="item"onClick={changeSFour}>
            Productos 
          </button>
          {/* <button className="item"onClick={changeSFive}>
            Footer 
          </button> */}
        </div>
        {validateSection === 1 &&
        <div className="sidebar__web-page">
          <div className={`links ${activeMenuIndex === 4 ? 'activeMenu' : ''}`}>
            <button className="link" style={sales} onClick={() => toggleSubMenu(4)}>
              <span>General</span>
              <svg className="arrow"  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"></path></svg>
            </button>
            <div className='sub__menu'>
              <div className="sub__menu_container">
                <div>
                  <div>
                    <p>Color de la cabecera</p>
                    <input className="container__color" type="color" value={primaryColor} onChange={(e) => handlePrimaryColorChange(e.target.value)} />
                  </div>
                  <div>
                    <p>Color del texto de la cabecera</p>
                    <input className="container__color" type="color" value={textColor} onChange={(e) => handleTextColorChange(e.target.value)} />
                  </div>
                  <div>
                    <p>Botones flotantes</p>
                    <div>
                      <div className="container__change_banner_update item_web-page"  >
                        <label className="custom-file-upload">
                          <small>Agregar</small>
                          <input id="file-upload1" type="file" onChange={handleLinkBottonChange}/>
                        </label>
                      </div>
                    </div>
                    <input type="text" value={linkBotton}  onChange={(e) => setLinkBotton(e.target.value)}  className="input__editor" placeholder="Link del boton"/>
                    <button className="btn__general-green-web" onClick={addLinkButtons}>Agregar</button>
                  </div>
                 

                  <div className="item_web">
                  <p>Logo</p>
                  <div className="container__change_banner" style={{ backgroundImage: `url(${logoImage})`,backgroundSize: 'cover',backgroundPosition: 'center' }}>
                    <label htmlFor="file-upload12" className="custom-file-upload">
                      <small> Seleccionar archivo</small>
                      <input id="file-upload12" type="file" onChange={handleLogoChange}/>
                    </label>
                  </div>
                </div>
                </div>
                <div className="container__btn_web-page">
                  <button className="btn__general-green-web" onClick={updateGeneral}>Actualizar</button>
                </div>
              </div>
            </div>
          </div>
          <div className={`links ${activeMenuIndex === 1 ? 'activeMenu' : ''}`}>
            <button className="link" style={sales} onClick={() => toggleSubMenu(1)}>
              <span>Crear</span>
              <svg className="arrow"  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"></path></svg>
            </button>
            <div className='sub__menu'>
              <div className="sub__menu_container">
                <div className="item_web">
                  <label>Nombre de la seccion</label>
                  <div className="conatiner__input_hero">
                    <ReactQuill
                      theme="snow"
                      value={nameSection}
                      onChange={handleNameSectionChange}
                      placeholder="Nombre de la categoría"
                      modules={{
                        toolbar: [
                          [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                          [{size: []}],
                          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                          [{'list': 'ordered'}, {'list': 'bullet'}, 
                          {'indent': '-1'}, {'indent': '+1'}],
                              // [{ 'alignTextUp': alignTextUp }],
                              // [{ 'alignTextDown': alignTextDown }], // Alineación
                          ['align', { 'align': [] }],
                          [{ 'color': [] }],
                          ['clean']
                        ],
                      }}
                    />
                  </div>
                </div>
                <div className="container__btn_web-page">
                  <button className="btn__general-green-web" onClick={createSections}>Crear</button>
                </div>
              </div>
            </div>
          </div>
          <div className={`links ${activeMenuIndex === 2 ? 'activeMenu' : ''}`}>
            <button className="link" style={sales} onClick={() => toggleSubMenu(2)}>
              <span>Actualizar</span>
              <svg className="arrow"  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"></path></svg>
            </button>
            <div className='sub__menu'>
              <div className="sub__menu_container">
                <div className="item_web">
                  <div className='select__container'>
                    <label className='label__general'>Tipo de seccion</label>
                    <div className='select-btn__general'>
                      <div className={`select-btn ${selectTypesSections ? 'active' : ''}`} onClick={openSelectTypesSections}>
                        <div className='select__container_title'>
                          <p>
                            {selectedTypeSection ?
                              (sections.find((s: {id: number}) => s.id === selectedTypeSection) ?
                              <p>{stripHtml(sections.find((s: {id: number}) => s.id === selectedTypeSection)?.seccion)}</p>
                                : '')
                              : 'Selecciona'}
                          </p>
                        </div>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                      </div>
                      <div className={`content ${selectTypesSections ? 'active' : ''}`} >
                        <ul className={`options ${selectTypesSections ? 'active' : ''}`} style={{ opacity: selectTypesSections ? '1' : '0' }}>
                          {sections && sections.map((section: any) => (
                            <li key={section.id} onClick={() => handleTypesSectionsChange(section)}>
                              <div dangerouslySetInnerHTML={{ __html: section.seccion }} />
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="item_web">
                  <label>Nombre de la seccion</label>
                  <div className="conatiner__input_hero">
                    <ReactQuill
                      theme="snow"
                      value={nameSection}
                      onChange={handleNameSectionChange}
                      placeholder="Nombre de la categoría"
                      modules={{
                        toolbar: [
                          [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                          [{size: []}],
                          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                          [{'list': 'ordered'}, {'list': 'bullet'}, 
                          {'indent': '-1'}, {'indent': '+1'}],
                              // [{ 'alignTextUp': alignTextUp }],
                              // [{ 'alignTextDown': alignTextDown }], // Alineación
                          ['align', { 'align': [] }],
                          [{ 'color': [] }],
                          ['clean']
                        ],
                      }}
                    />
                  </div>
                </div>
                    </div>
                  </div>
                </div>
                <div>
                  <button className="btn__general-green-web" onClick={updateSections}>Guardar</button>
                </div>
              </div>
            </div>
          </div>
          <div className={`links ${activeMenuIndex === 3 ? 'activeMenu' : ''}`}>
            <button className="link" style={sales} onClick={() => toggleSubMenu(3)}>
              <span>Eliminar</span>
              <svg className="arrow"  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"></path></svg>
            </button>
            <div className='sub__menu'>
              <div className="sub__menu_container">
                <div className="item_web">
                  <div className='select__container'>
                    <label className='label__general'>Tipo de seccion</label>
                    <div className='select-btn__general'>
                      <div className={`select-btn ${selectTypesSections ? 'active' : ''}`} onClick={openSelectTypesSections}>
                        <div className='select__container_title'>
                          <p>
                            {selectedTypeSection ?
                              (sections.find((s: {id: number}) => s.id === selectedTypeSection) ?
                              <p>{stripHtml(sections.find((s: {id: number}) => s.id === selectedTypeSection)?.seccion)}</p>
                                : '')
                              : 'Selecciona'}
                          </p>
                        </div>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                      </div>
                      <div className={`content ${selectTypesSections ? 'active' : ''}`} >
                        <ul className={`options ${selectTypesSections ? 'active' : ''}`} style={{ opacity: selectTypesSections ? '1' : '0' }}>
                          {sections && sections.map((section: any) => (
                            <li key={section.id} onClick={() => handleTypesSectionsChange(section)}>
                              <div dangerouslySetInnerHTML={{ __html: section.seccion }} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <button className="btn__general-green-web" onClick={deleteSections}>Eliminar</button>
                </div>
            
              </div>
            </div>
          </div>
        </div>
        }
        {validateSection === 2 &&
        <div className="sidebar__web-page">
          <div className={`links ${activeMenuIndex === 1 ? 'activeMenu' : ''}`}>
            <button className="link" style={sales} onClick={() => toggleSubMenu(1)}>
              <span>Agregar contenedores</span>
              <svg className="arrow"  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"></path></svg>
            </button>
            <div className='sub__menu'>
              <div className="sub__menu_container">
                <div className='select__container'>
                  <label className='label__general'>Tipo de seccion</label>
                  <div className='select-btn__general'>
                    <div className={`select-btn ${selectTypesSections ? 'active' : ''}`} onClick={openSelectTypesSections}>
                      <div className='select__container_title'>
                        <p>
                          {selectedTypeSection ?
                            (sections.find((s: {id: number}) => s.id === selectedTypeSection) ?
                            <p>{stripHtml(sections.find((s: {id: number}) => s.id === selectedTypeSection)?.seccion)}</p>
                              : '')
                            : 'Selecciona'}
                        </p>
                      </div>
                      <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                    </div>
                    <div className={`content ${selectTypesSections ? 'active' : ''}`} >
                      <ul className={`options ${selectTypesSections ? 'active' : ''}`} style={{ opacity: selectTypesSections ? '1' : '0' }}>
                        {sections && sections.map((section: any) => (
                          <li key={section.id} onClick={() => handleTypesSectionsChange(section)}>
                            <div dangerouslySetInnerHTML={{ __html: section.seccion }} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                  <p>Banner</p>
                  <div className="container__change_banner_create" onClick={() => saveContainer(1)} style={{ backgroundImage: `url(${ban})`,backgroundSize: 'cover',backgroundPosition: 'center' }}>
                    <div >
                      <p className="file__input_text">Agregar</p>
                    </div>
                    {/* <label for="file-upload1" class="custom-file-upload">
                      <small> Seleccionar archivo</small>
                      <input id="file-upload1" type="file" onChange={handleImageChange}/>
                    </label> */}
                  </div>
                </div>
                <div>
                  <p>Servicios</p>
                  <div className="container__change_banner_create" onClick={() => saveContainer(2)} style={{ backgroundImage: `url(${serv})`,backgroundSize: 'cover',backgroundPosition: 'center' }}>
                    <div >
                    <b><p className="file__input_text">Agregar</p></b>
                    </div>
                    {/* <label for="file-upload1" class="custom-file-upload">
                      <small> Seleccionar archivo</small>
                      <input id="file-upload1" type="file" onChange={handleImageChange}/>
                    </label> */}
                  </div>
                </div>
                <div>
                  <p>Descripcion</p>
                  <div className="container__change_banner_create" onClick={() => saveContainer(3)} style={{ backgroundImage: `url(${desc})`,backgroundSize: 'cover',backgroundPosition: 'center' }}>
                    <div >
                    <b><p className="file__input_text">Agregar</p></b>
                    </div>
                    {/* <label for="file-upload1" class="custom-file-upload">
                      <small> Seleccionar archivo</small>
                      <input id="file-upload1" type="file" onChange={handleImageChange}/>
                    </label> */}
                  </div>
                </div>
                <div>
                  <p>Slider</p>
                  <div className="container__change_banner_create" onClick={() => saveContainer(4)} style={{ backgroundImage: `url(${sli})`,backgroundSize: 'cover',backgroundPosition: 'center' }}>
                    <div >
                    <b><p className="file__input_text">Agregar</p></b>
                    </div>
                    {/* <label for="file-upload1" class="custom-file-upload">
                      <small> Seleccionar archivo</small>
                      <input id="file-upload1" type="file" onChange={handleImageChange}/>
                    </label> */}
                  </div>
                </div>
                <div>
                  <p>Carrucel</p>
                  <div className="container__change_banner_create" onClick={() => saveContainer(5)}style={{ backgroundImage: `url(${car})`,backgroundSize: 'cover',backgroundPosition: 'center' }}>
                    <div >
                    <b><p className="file__input_text">Agregar</p></b>
                    </div>
                    {/* <label for="file-upload1" class="custom-file-upload">
                      <small> Seleccionar archivo</small>
                      <input id="file-upload1" type="file" onChange={handleImageChange}/>
                    </label> */}
                  </div>
                </div>
                <div>
                  <p>Small Banner</p>
                  <div className="container__change_banner_create" onClick={() => saveContainer(6)}style={{ backgroundImage: `url(${sb})`,backgroundSize: 'cover',backgroundPosition: 'center' }}>
                    <div >
                      <b><p className="file__input_text">Agregar</p></b>
                    </div>
                    {/* <label for="file-upload1" class="custom-file-upload">
                      <small> Seleccionar archivo</small>
                      <input id="file-upload1" type="file" onChange={handleImageChange}/>
                    </label> */}
                  </div>
                </div>
                <div>
                  <p>Formulario</p>
                  <div className="container__change_banner_create" onClick={() => saveContainer(7)}>
                    <div >
                      <p className="file__input_text">Agregar</p>
                    </div>
                    {/* <label for="file-upload1" class="custom-file-upload">
                      <small> Seleccionar archivo</small>
                      <input id="file-upload1" type="file" onChange={handleImageChange}/>
                    </label> */}
                  </div>
                </div>
                <div className="container__btn_web-page">
                  <button className="btn__general-green-web" onClick={SaveContainer}>Guardar</button>
                </div>
              </div>
            </div>
          </div>
          <div className={`links ${activeMenuIndex === 2 ? 'activeMenu' : ''}`}>
            <button className="link" style={sales} onClick={() => toggleSubMenu(2)}>
              <span>Actualizar contenedores</span>
              <svg className="arrow"  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"></path></svg>
            </button>
            <div className='sub__menu'>
              <div className="sub__menu_container">
                  <div className={`container__change_update ${stateUpdateC ? 'active' : ''}`}>
                    {dataContainer.tipo_contenedor === 1 ?
                    <div>
                      <div className="item_web-page">
                        <p className="title__editor">Titulo del banner</p>
                        {/* <script>console.log(dataContainer)</script> */}
                        <div className="editor-container">
                          <div className="editing__tools">
                            <div className="row__one">
                              <div className='select__container-font-weight'>
                                <div className='select-btn__general'>
                                  <div className={`select-btn ${selectTypesFontWeight ? 'active' : ''}`} onClick={openSelectFontWeightSections}>
                                    <div className='select__container_title'>
                                      <p>{selectedTypeFontWeight ? FontWeight.find((s: {id: number}) => s.id === selectedTypeFontWeight)?.name : 'Peso'}</p>
                                    </div>
                                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                                  </div>
                                  <div className={`content ${selectTypesFontWeight ? 'active' : ''}`} >
                                    <ul className={`options ${selectTypesFontWeight ? 'active' : ''}`} style={{ opacity: selectTypesFontWeight ? '1' : '0' }}>
                                      {FontWeight && FontWeight.map((font: any) => (
                                        <li key={font.id} onClick={() => handleFontWeightChange(font)}>
                                          <div dangerouslySetInnerHTML={{ __html: font.name }} />
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                              <svg className="icon_text" onClick={() => textCentering('text_align-left')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 4h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Zm0-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                              <svg className="icon_text" onClick={() => textCentering('text_align-center')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm3 4h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 0 1 0-2Zm-3-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                              <svg className="icon_text" onClick={() => textCentering('text_align-right')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm6 4h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm-6-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                              <div className="color__editor_container">
                                <svg onClick={() => colorPalette('cbt')} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="22px" height="18px" className="symbol-textForeColor"><path fill="#000000" fillRule="evenodd" d="M 17 3C 17 3 27.03 17 17 17 6.9 17 17 3 17 3Z"></path><path fillRule="evenodd" d="M 16.96 18C 13.35 18 12 14.95 12 13.03 12 9.97 15.69 4.09 16.12 3.43 16.12 3.43 16.95 2.12 16.95 2.12 16.95 2.12 17.8 3.42 17.8 3.42 18.23 4.08 22 9.97 22 13.03 22 15.09 20.44 18 16.96 18ZM 16.96 3.97C 16.96 3.97 13 10.18 13 13.03 13 14.52 14.02 16.99 16.96 16.99 19.89 16.99 21 14.52 21 13.03 21 10.18 16.96 3.97 16.96 3.97ZM 3.6 9.02C 3.6 9.02 2 13.03 2 13.03 2 13.03-0 13.03-0 13.03-0 13.03 5 1 5 1 5 1 6 0 6 0 6 0 7 0 7 0 7 0 8 1 8 1 8 1 11 7.01 11 7.01 11 7.01 11 11.02 11 11.02 11 11.02 9.4 9.02 9.4 9.02 9.4 9.02 3.6 9.02 3.6 9.02ZM 7 3.01C 7 3.01 6 3.01 6 3.01 6 3.01 4.4 7.01 4.4 7.01 4.4 7.01 8.6 7.01 8.6 7.01 8.6 7.01 7 3.01 7 3.01Z"></path></svg>
                                <div className={`color__palette`} style={{ display: `${colorState == 'cbt' ? 'block' : 'none'}`}}>
                                  <div>
                                    <p>Seleciona tu color</p>
                                  </div>
                                  <div>
                                    <p>Colores del tema</p>
                                    <div className="color-button" style={{ backgroundColor: 'red' }} onClick={() => changeTextColor('red')}></div>
                                    <div className="color-button" style={{ backgroundColor: 'blue' }} onClick={() => changeTextColor('blue')}></div>
                                    <div className="color-button" style={{ backgroundColor: 'green' }} onClick={() => changeTextColor('green')}></div>
                                    <div className="color-button" style={{ backgroundColor: 'yellow' }} onClick={() => changeTextColor('yellow')}></div>
                                    <div className="color-button" style={{ backgroundColor: 'orange' }} onClick={() => changeTextColor('orange')}></div>
                                    <div className="color-button" style={{ backgroundColor: 'purple' }} onClick={() => changeTextColor('purple')}></div>
                                  </div>
                                  <div className="color-picker-container">
                                    <div className="color-picker-label">
                                      Elige tu color personalizado
                                    </div>
                                    <svg className="color-picker-icon" width='20' onClick={handleIconClick} style={{ color: selectedColor }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg>
                                    <input type="color" value={selectedColor} onChange={(e) => changeTextColor(e.target.value)} ref={colorInputRef} className="color-picker-input"/>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row__two">
                              <div className="slider-container">
                                <div>
                                  <p>Tamaño de la fuente</p>
                                  <input type="range" min="8" max="54" defaultValue="14" id="font-size-slider" onChange={(e) => changeFontSize(e.target.value)} className="slider__editor_wep-page" />
                                </div>
                                <div className="container__px" >{`${textFontSize} px`}</div>
                              </div>
                            </div>                          
                          </div>
                          <div>
                            <textarea className={`input__editor`}  onChange={handleInputTitleChange} value={copyContainer[index]?.titulo}></textarea>
                          </div>
                        </div>
                      </div>
                      <div className="item_web-page" >
                        <p  className="title__editor">Imagen del banner</p>
                        <div className="container__change_banner_update" style={{ backgroundImage: `url(${copyContainer[index]?.imagen})`, backgroundSize: 'cover',backgroundPosition: 'center'}}      >
                          <label className="custom-file-upload">
                            <small> Seleccionar archivo</small>
                            <input id="file-upload1" type="file" onChange={handleImageChange}/>
                          </label>
                        </div>
                      </div>
                      {/* <div className="conatiner__btns_update_container item_web-page">
                        <button className="btn__save_edit-web-page" onClick={() => saveContainer(x)}>Guardar</button>
                        <button className="btn__delete_edit-web-page" onClick={() => deleteContainer(x)}>Eliminar</button>
                      </div> */}
                    </div>
                    :
                    ''
                    }
                    {dataContainer.tipo_contenedor === 2 ?
                    <div>
                      {dataNumberService == 1 ?
                      <div>
                        <div>
                          <p>Imagen del item</p>
                          <div className="container__change_banner_update item_web-page"  style={{ backgroundImage: `url(${copyContainer[index]?.imagen})` }}>
                            <label className="custom-file-upload">
                              <small> Seleccionar archivo</small>
                              <input id="file-upload1" type="file" onChange={handleImageChange}/>
                            </label>
                          </div>
                        </div>
                        <div className="item_web-page">
                          <p>Titulo</p>
                          <div className="editor-container">
                            <div className="editing__tools">
                              <div className="row__one">
                                <div className='select__container-font-weight'>
                                  <div className='select-btn__general'>
                                    <div className={`select-btn ${selectTypesFontWeight ? 'active' : ''}`} onClick={openSelectFontWeightSections}>
                                      <div className='select__container_title'>
                                        <p>{selectedTypeFontWeight ? FontWeight.find((s: {id: number}) => s.id === selectedTypeFontWeight)?.name : 'Peso'}</p>
                                      </div>
                                      <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                                    </div>
                                    <div className={`content ${selectTypesFontWeight ? 'active' : ''}`} >
                                      <ul className={`options ${selectTypesFontWeight ? 'active' : ''}`} style={{ opacity: selectTypesFontWeight ? '1' : '0' }}>
                                        {FontWeight && FontWeight.map((font: any) => (
                                          <li key={font.id} onClick={() => handleFontWeightChange(font)}>
                                            <div dangerouslySetInnerHTML={{ __html: font.name }} />
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                                <svg className="icon_text" onClick={() => textCentering('text_align-left')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 4h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Zm0-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                                <svg className="icon_text" onClick={() => textCentering('text_align-center')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm3 4h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 0 1 0-2Zm-3-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                                <svg className="icon_text" onClick={() => textCentering('text_align-right')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm6 4h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm-6-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                                <div className="color__editor_container">
                                  <svg onClick={() => colorPalette('cstone')} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="22px" height="18px" className="symbol-textForeColor"><path fill="#000000" fillRule="evenodd" d="M 17 3C 17 3 27.03 17 17 17 6.9 17 17 3 17 3Z"></path><path fillRule="evenodd" d="M 16.96 18C 13.35 18 12 14.95 12 13.03 12 9.97 15.69 4.09 16.12 3.43 16.12 3.43 16.95 2.12 16.95 2.12 16.95 2.12 17.8 3.42 17.8 3.42 18.23 4.08 22 9.97 22 13.03 22 15.09 20.44 18 16.96 18ZM 16.96 3.97C 16.96 3.97 13 10.18 13 13.03 13 14.52 14.02 16.99 16.96 16.99 19.89 16.99 21 14.52 21 13.03 21 10.18 16.96 3.97 16.96 3.97ZM 3.6 9.02C 3.6 9.02 2 13.03 2 13.03 2 13.03-0 13.03-0 13.03-0 13.03 5 1 5 1 5 1 6 0 6 0 6 0 7 0 7 0 7 0 8 1 8 1 8 1 11 7.01 11 7.01 11 7.01 11 11.02 11 11.02 11 11.02 9.4 9.02 9.4 9.02 9.4 9.02 3.6 9.02 3.6 9.02ZM 7 3.01C 7 3.01 6 3.01 6 3.01 6 3.01 4.4 7.01 4.4 7.01 4.4 7.01 8.6 7.01 8.6 7.01 8.6 7.01 7 3.01 7 3.01Z"></path></svg>
                                  <div className={`color__palette`} style={{ display: `${colorState == 'cstone' ? 'block' : 'none'}`}}>
                                    <div>
                                      <p>Seleciona tu color</p>
                                    </div>
                                    <div>
                                      <p>Colores del tema</p>
                                      <div className="color-button" style={{ backgroundColor: 'red' }} onClick={() => changeTextColor('red')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'blue' }} onClick={() => changeTextColor('blue')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'green' }} onClick={() => changeTextColor('green')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'yellow' }} onClick={() => changeTextColor('yellow')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'orange' }} onClick={() => changeTextColor('orange')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'purple' }} onClick={() => changeTextColor('purple')}></div>
                                    </div>
                                    <div className="color-picker-container">
                                      <div className="color-picker-label">
                                        Elige tu color personalizado
                                      </div>
                                      <svg className="color-picker-icon" width='20' onClick={handleIconClick} style={{ color: selectedColor }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg>
                                      <input type="color" value={selectedColor} onChange={(e) => changeTextColor(e.target.value)} ref={colorInputRef} className="color-picker-input"/>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="rwo__two">
                                <div className="slider-container">
                                  <div>
                                    <p>Tamaño de la fuente (px)</p>
                                    <input type="range" min="8" max="32" defaultValue="14" id="font-size-slider" onChange={(e) => changeFontSize(e.target.value)} className="slider__editor_wep-page" />
                                  </div>
                                  <div className="container__px" >{`${textFontSize} px`}</div>
                                </div>
                              </div>                          
                            </div>
                            <div>
                              <textarea className={`input__editor`}  onChange={handleTitleChange} value={copyContainer[index]?.titulo}></textarea>
                            </div>
                          </div>
                        </div>
                        <div className="item_web-page">
                          <p className="title__editor">Titulo del banner</p>
                          <div className="editor-container">
                            <div className="editing__tools">
                              <div className="row__one">
                                <div className='select__container-font-weight'>
                                  <div className='select-btn__general'>
                                    <div className={`select-btn ${selectTypesFontWeight ? 'active' : ''}`} onClick={openSelectFontWeightSections}>
                                      <div className='select__container_title'>
                                        <p>{selectedTypeFontWeight ? FontWeight.find((s: {id: number}) => s.id === selectedTypeFontWeight)?.name : 'Peso'}</p>
                                      </div>
                                      <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                                    </div>
                                    <div className={`content ${selectTypesFontWeight ? 'active' : ''}`} >
                                      <ul className={`options ${selectTypesFontWeight ? 'active' : ''}`} style={{ opacity: selectTypesFontWeight ? '1' : '0' }}>
                                        {FontWeight && FontWeight.map((font: any) => (
                                          <li key={font.id} onClick={() => handleFontWeightChangeDos(font)}>
                                            <div dangerouslySetInnerHTML={{ __html: font.name }} />
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                                <svg className="icon_text" onClick={() => textCenteringDos('text_align-left')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 4h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Zm0-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                                <svg className="icon_text" onClick={() => textCenteringDos('text_align-center')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm3 4h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 0 1 0-2Zm-3-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                                <svg className="icon_text" onClick={() => textCenteringDos('text_align-right')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm6 4h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm-6-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                                <div className="color__editor_container">
                                  <svg onClick={() => colorPalette('csdone')} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="22px" height="18px" className="symbol-textForeColor"><path fill="#000000" fillRule="evenodd" d="M 17 3C 17 3 27.03 17 17 17 6.9 17 17 3 17 3Z"></path><path fillRule="evenodd" d="M 16.96 18C 13.35 18 12 14.95 12 13.03 12 9.97 15.69 4.09 16.12 3.43 16.12 3.43 16.95 2.12 16.95 2.12 16.95 2.12 17.8 3.42 17.8 3.42 18.23 4.08 22 9.97 22 13.03 22 15.09 20.44 18 16.96 18ZM 16.96 3.97C 16.96 3.97 13 10.18 13 13.03 13 14.52 14.02 16.99 16.96 16.99 19.89 16.99 21 14.52 21 13.03 21 10.18 16.96 3.97 16.96 3.97ZM 3.6 9.02C 3.6 9.02 2 13.03 2 13.03 2 13.03-0 13.03-0 13.03-0 13.03 5 1 5 1 5 1 6 0 6 0 6 0 7 0 7 0 7 0 8 1 8 1 8 1 11 7.01 11 7.01 11 7.01 11 11.02 11 11.02 11 11.02 9.4 9.02 9.4 9.02 9.4 9.02 3.6 9.02 3.6 9.02ZM 7 3.01C 7 3.01 6 3.01 6 3.01 6 3.01 4.4 7.01 4.4 7.01 4.4 7.01 8.6 7.01 8.6 7.01 8.6 7.01 7 3.01 7 3.01Z"></path></svg>
                                  <div className={`color__palette`} style={{ display: `${colorState == 'csdone' ? 'block' : 'none'}`}}>
                                    <div>
                                      <p>Seleciona tu color</p>
                                    </div>
                                    <div>
                                      <p>Colores del tema</p>
                                      <div className="color-button" style={{ backgroundColor: 'red' }} onClick={() => changeTextColorDos('red')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'blue' }} onClick={() => changeTextColorDos('blue')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'green' }} onClick={() => changeTextColorDos('green')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'yellow' }} onClick={() => changeTextColorDos('yellow')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'orange' }} onClick={() => changeTextColorDos('orange')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'purple' }} onClick={() => changeTextColorDos('purple')}></div>
                                    </div>
                                    <div className="color-picker-container">
                                      <div className="color-picker-label">
                                        Elige tu color personalizado
                                      </div>
                                      <svg className="color-picker-icon" width='20' onClick={handleIconClick} style={{ color: selectedColor }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg>
                                      <input type="color" value={selectedColor} onChange={(e) => changeTextColorDos(e.target.value)} ref={colorInputRef} className="color-picker-input"/>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="rwo__two">
                                <div className="slider-container">
                                  <div>
                                    <p>Tamaño de la fuente (px)</p>
                                    <input type="range" min="8" max="54" defaultValue="14" id="font-size-slider" onChange={(e) => changeFontSizeDos(e.target.value)} className="slider__editor_wep-page" />
                                  </div>
                                  <div className="container__px" >{`${textFontSize} px`}</div>
                                </div>
                              </div>                          
                            </div>
                            <div>
                              <textarea className={`input__editor`}  onChange={handleTitle2Change} value={copyContainer[index]?.titulo2}></textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                      :
                      ''
                      }
                      {dataNumberService == 2 ?
                      <div>
                        <div>
                          <p>Imagen del item</p>
                          <div className="container__change_banner_update item_web-page"  style={{ backgroundImage: `url(${copyContainer[index]?.imagen2})` }}>
                            <label className="custom-file-upload">
                              <small> Seleccionar archivo</small>
                              <input id="file-upload1" type="file" onChange={handleImage2Change}/>
                            </label>
                          </div>
                        </div>
                        <div className="item_web-page">
                          <p>Titulo</p>
                          <div className="editor-container">
                            <div className="editing__tools">
                              <div className="row__one">
                                <div className='select__container-font-weight'>
                                  <div className='select-btn__general'>
                                    <div className={`select-btn ${selectTypesFontWeight ? 'active' : ''}`} onClick={openSelectFontWeightSections}>
                                      <div className='select__container_title'>
                                        <p>{selectedTypeFontWeight ? FontWeight.find((s: {id: number}) => s.id === selectedTypeFontWeight)?.name : 'Peso'}</p>
                                      </div>
                                      <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                                    </div>
                                    <div className={`content ${selectTypesFontWeight ? 'active' : ''}`} >
                                      <ul className={`options ${selectTypesFontWeight ? 'active' : ''}`} style={{ opacity: selectTypesFontWeight ? '1' : '0' }}>
                                        {FontWeight && FontWeight.map((font: any) => (
                                          <li key={font.id} onClick={() => handleFontWeightChangeTres(font)}>
                                            <div dangerouslySetInnerHTML={{ __html: font.name }} />
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                                <svg className="icon_text" onClick={() => textCenteringTres('text_align-left')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 4h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Zm0-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                                <svg className="icon_text" onClick={() => textCenteringTres('text_align-center')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm3 4h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 0 1 0-2Zm-3-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                                <svg className="icon_text" onClick={() => textCenteringTres('text_align-right')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm6 4h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm-6-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                                <div className="color__editor_container">
                                  <svg onClick={() => colorPalette('csttwo')} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="22px" height="18px" className="symbol-textForeColor"><path fill="#000000" fillRule="evenodd" d="M 17 3C 17 3 27.03 17 17 17 6.9 17 17 3 17 3Z"></path><path fillRule="evenodd" d="M 16.96 18C 13.35 18 12 14.95 12 13.03 12 9.97 15.69 4.09 16.12 3.43 16.12 3.43 16.95 2.12 16.95 2.12 16.95 2.12 17.8 3.42 17.8 3.42 18.23 4.08 22 9.97 22 13.03 22 15.09 20.44 18 16.96 18ZM 16.96 3.97C 16.96 3.97 13 10.18 13 13.03 13 14.52 14.02 16.99 16.96 16.99 19.89 16.99 21 14.52 21 13.03 21 10.18 16.96 3.97 16.96 3.97ZM 3.6 9.02C 3.6 9.02 2 13.03 2 13.03 2 13.03-0 13.03-0 13.03-0 13.03 5 1 5 1 5 1 6 0 6 0 6 0 7 0 7 0 7 0 8 1 8 1 8 1 11 7.01 11 7.01 11 7.01 11 11.02 11 11.02 11 11.02 9.4 9.02 9.4 9.02 9.4 9.02 3.6 9.02 3.6 9.02ZM 7 3.01C 7 3.01 6 3.01 6 3.01 6 3.01 4.4 7.01 4.4 7.01 4.4 7.01 8.6 7.01 8.6 7.01 8.6 7.01 7 3.01 7 3.01Z"></path></svg>
                                  <div className={`color__palette`} style={{ display: `${colorState == 'csttwo' ? 'block' : 'none'}`}}>
                                    <div>
                                      <p>Seleciona tu color</p>
                                    </div>
                                    <div>
                                      <p>Colores del tema</p>
                                      <div className="color-button" style={{ backgroundColor: 'red' }} onClick={() => changeTextColorTres('red')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'blue' }} onClick={() => changeTextColorTres('blue')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'green' }} onClick={() => changeTextColorTres('green')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'yellow' }} onClick={() => changeTextColorTres('yellow')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'orange' }} onClick={() => changeTextColorTres('orange')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'purple' }} onClick={() => changeTextColorTres('purple')}></div>
                                    </div>
                                    <div className="color-picker-container">
                                      <div className="color-picker-label">
                                        Elige tu color personalizado
                                      </div>
                                      <svg className="color-picker-icon" width='20' onClick={handleIconClick} style={{ color: selectedColor }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg>
                                      <input type="color" value={selectedColor} onChange={(e) => changeTextColorTres(e.target.value)} ref={colorInputRef} className="color-picker-input"/>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="rwo__two">
                                <div className="slider-container">
                                  <div>
                                    <p>Tamaño de la fuente (px)</p>
                                    <input type="range" min="8" max="32" defaultValue="14" id="font-size-slider" onChange={(e) => changeFontSizeTres(e.target.value)} className="slider__editor_wep-page" />
                                  </div>
                                  <div className="container__px" >{`${textFontSize} px`}</div>
                                </div>
                              </div>                          
                            </div>
                            <div>
                              <textarea className={`input__editor`}  onChange={handleTitle3Change} value={copyContainer[index]?.titulo3}></textarea>
                            </div>
                          </div>
                        </div>
                        <div className="item_web-page">
                          <p className="title__editor">Descripción</p>
                          <div className="editor-container">
                            <div className="editing__tools">
                              <div className="row__one">
                                <div className='select__container-font-weight'>
                                  <div className='select-btn__general'>
                                    <div className={`select-btn ${selectTypesFontWeight ? 'active' : ''}`} onClick={openSelectFontWeightSections}>
                                      <div className='select__container_title'>
                                        <p>{selectedTypeFontWeight ? FontWeight.find((s: {id: number}) => s.id === selectedTypeFontWeight)?.name : 'Peso'}</p>
                                      </div>
                                      <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                                    </div>
                                    <div className={`content ${selectTypesFontWeight ? 'active' : ''}`} >
                                      <ul className={`options ${selectTypesFontWeight ? 'active' : ''}`} style={{ opacity: selectTypesFontWeight ? '1' : '0' }}>
                                        {FontWeight && FontWeight.map((font: any) => (
                                          <li key={font.id} onClick={() => handleFontWeightChangeCuatro(font)}>
                                            <div dangerouslySetInnerHTML={{ __html: font.name }} />
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                                <svg className="icon_text" onClick={() => textCenteringCuatro('text_align-left')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 4h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Zm0-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                                <svg className="icon_text" onClick={() => textCenteringCuatro('text_align-center')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm3 4h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 0 1 0-2Zm-3-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                                <svg className="icon_text" onClick={() => textCenteringCuatro('text_align-right')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm6 4h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm-6-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                                <div className="color__editor_container">
                                  <svg onClick={() => colorPalette('csdtwo')} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="22px" height="18px" className="symbol-textForeColor"><path fill="#000000" fillRule="evenodd" d="M 17 3C 17 3 27.03 17 17 17 6.9 17 17 3 17 3Z"></path><path fillRule="evenodd" d="M 16.96 18C 13.35 18 12 14.95 12 13.03 12 9.97 15.69 4.09 16.12 3.43 16.12 3.43 16.95 2.12 16.95 2.12 16.95 2.12 17.8 3.42 17.8 3.42 18.23 4.08 22 9.97 22 13.03 22 15.09 20.44 18 16.96 18ZM 16.96 3.97C 16.96 3.97 13 10.18 13 13.03 13 14.52 14.02 16.99 16.96 16.99 19.89 16.99 21 14.52 21 13.03 21 10.18 16.96 3.97 16.96 3.97ZM 3.6 9.02C 3.6 9.02 2 13.03 2 13.03 2 13.03-0 13.03-0 13.03-0 13.03 5 1 5 1 5 1 6 0 6 0 6 0 7 0 7 0 7 0 8 1 8 1 8 1 11 7.01 11 7.01 11 7.01 11 11.02 11 11.02 11 11.02 9.4 9.02 9.4 9.02 9.4 9.02 3.6 9.02 3.6 9.02ZM 7 3.01C 7 3.01 6 3.01 6 3.01 6 3.01 4.4 7.01 4.4 7.01 4.4 7.01 8.6 7.01 8.6 7.01 8.6 7.01 7 3.01 7 3.01Z"></path></svg>
                                  <div className={`color__palette`} style={{ display: `${colorState == 'csdtwo' ? 'block' : 'none'}`}}>
                                    <div>
                                      <p>Seleciona tu color</p>
                                    </div>
                                    <div>
                                      <p>Colores del tema</p>
                                      <div className="color-button" style={{ backgroundColor: 'red' }} onClick={() => changeTextColorCuatro('red')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'blue' }} onClick={() => changeTextColorCuatro('blue')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'green' }} onClick={() => changeTextColorCuatro('green')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'yellow' }} onClick={() => changeTextColorCuatro('yellow')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'orange' }} onClick={() => changeTextColorCuatro('orange')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'purple' }} onClick={() => changeTextColorCuatro('purple')}></div>
                                    </div>
                                    <div className="color-picker-container">
                                      <div className="color-picker-label">
                                        Elige tu color personalizado
                                      </div>
                                      <svg className="color-picker-icon" width='20' onClick={handleIconClick} style={{ color: selectedColor }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg>
                                      <input type="color" value={selectedColor} onChange={(e) => changeTextColorCuatro(e.target.value)} ref={colorInputRef} className="color-picker-input"/>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="rwo__two">
                                <div className="slider-container">
                                  <div>
                                    <p>Tamaño de la fuente (px)</p>
                                    <input type="range" min="8" max="54" defaultValue="14" id="font-size-slider" onChange={(e) => changeFontSizeCuatro(e.target.value)} className="slider__editor_wep-page" />
                                  </div>
                                  <div className="container__px" >{`${textFontSize} px`}</div>
                                </div>
                              </div>                          
                            </div>
                            <div>
                              <textarea className={`input__editor`}  onChange={handleTitle4Change} value={copyContainer[index]?.titulo4}></textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                      :
                      ''
                      }
                      {dataNumberService == 3 ?
                      <div>
                        <div>
                          <p>Imagen del item</p>
                          <div className="container__change_banner_update item_web-page"  style={{ backgroundImage: `url(${copyContainer[index]?.imagen3})` }}>
                            <label className="custom-file-upload">
                              <small> Seleccionar archivo</small>
                              <input id="file-upload1" type="file" onChange={handleImage3Change}/>
                            </label>
                          </div>
                        </div>
                        <div className="item_web-page">
                          <p>Titulo</p>
                          <div className="editor-container">
                            <div className="editing__tools">
                              <div className="row__one">
                                <div className='select__container-font-weight'>
                                  <div className='select-btn__general'>
                                    <div className={`select-btn ${selectTypesFontWeight ? 'active' : ''}`} onClick={openSelectFontWeightSections}>
                                      <div className='select__container_title'>
                                        <p>{selectedTypeFontWeight ? FontWeight.find((s: {id: number}) => s.id === selectedTypeFontWeight)?.name : 'Peso'}</p>
                                      </div>
                                      <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                                    </div>
                                    <div className={`content ${selectTypesFontWeight ? 'active' : ''}`} >
                                      <ul className={`options ${selectTypesFontWeight ? 'active' : ''}`} style={{ opacity: selectTypesFontWeight ? '1' : '0' }}>
                                        {FontWeight && FontWeight.map((font: any) => (
                                          <li key={font.id} onClick={() => handleFontWeightChangeCinco(font)}>
                                            <div dangerouslySetInnerHTML={{ __html: font.name }} />
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                                <svg className="icon_text" onClick={() => textCenteringCinco('text_align-left')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 4h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Zm0-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                                <svg className="icon_text" onClick={() => textCenteringCinco('text_align-center')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm3 4h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 0 1 0-2Zm-3-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                                <svg className="icon_text" onClick={() => textCenteringCinco('text_align-right')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm6 4h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm-6-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                                <div className="color__editor_container">
                                  <svg onClick={() => colorPalette('cstthree')} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="22px" height="18px" className="symbol-textForeColor"><path fill="#000000" fillRule="evenodd" d="M 17 3C 17 3 27.03 17 17 17 6.9 17 17 3 17 3Z"></path><path fillRule="evenodd" d="M 16.96 18C 13.35 18 12 14.95 12 13.03 12 9.97 15.69 4.09 16.12 3.43 16.12 3.43 16.95 2.12 16.95 2.12 16.95 2.12 17.8 3.42 17.8 3.42 18.23 4.08 22 9.97 22 13.03 22 15.09 20.44 18 16.96 18ZM 16.96 3.97C 16.96 3.97 13 10.18 13 13.03 13 14.52 14.02 16.99 16.96 16.99 19.89 16.99 21 14.52 21 13.03 21 10.18 16.96 3.97 16.96 3.97ZM 3.6 9.02C 3.6 9.02 2 13.03 2 13.03 2 13.03-0 13.03-0 13.03-0 13.03 5 1 5 1 5 1 6 0 6 0 6 0 7 0 7 0 7 0 8 1 8 1 8 1 11 7.01 11 7.01 11 7.01 11 11.02 11 11.02 11 11.02 9.4 9.02 9.4 9.02 9.4 9.02 3.6 9.02 3.6 9.02ZM 7 3.01C 7 3.01 6 3.01 6 3.01 6 3.01 4.4 7.01 4.4 7.01 4.4 7.01 8.6 7.01 8.6 7.01 8.6 7.01 7 3.01 7 3.01Z"></path></svg>
                                  <div className={`color__palette`} style={{ display: `${colorState == 'cstthree' ? 'block' : 'none'}`}}>
                                    <div>
                                      <p>Seleciona tu color</p>
                                    </div>
                                    <div>
                                      <p>Colores del tema</p>
                                      <div className="color-button" style={{ backgroundColor: 'red' }} onClick={() => changeTextColorCinco('red')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'blue' }} onClick={() => changeTextColorCinco('blue')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'green' }} onClick={() => changeTextColorCinco('green')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'yellow' }} onClick={() => changeTextColorCinco('yellow')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'orange' }} onClick={() => changeTextColorCinco('orange')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'purple' }} onClick={() => changeTextColorCinco('purple')}></div>
                                    </div>
                                    <div className="color-picker-container">
                                      <div className="color-picker-label">
                                        Elige tu color personalizado
                                      </div>
                                      <svg className="color-picker-icon" width='20' onClick={handleIconClick} style={{ color: selectedColor }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg>
                                      <input type="color" value={selectedColor} onChange={(e) => changeTextColorCinco(e.target.value)} ref={colorInputRef} className="color-picker-input"/>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="rwo__two">
                                <div className="slider-container">
                                  <div>
                                    <p>Tamaño de la fuente (px)</p>
                                    <input type="range" min="8" max="32" defaultValue="14" id="font-size-slider" onChange={(e) => changeFontSizeCinco(e.target.value)} className="slider__editor_wep-page" />
                                  </div>
                                  <div className="container__px" >{`${textFontSize} px`}</div>
                                </div>
                              </div>                          
                            </div>
                            <div>
                              <textarea className={`input__editor`}  onChange={handleTitle5Change} value={copyContainer[index]?.titulo5}></textarea>
                            </div>
                          </div>
                        </div>
                        <div className="item_web-page">
                          <p className="title__editor">Titulo del banner</p>
                          <div className="editor-container">
                            <div className="editing__tools">
                              <div className="row__one">
                                <div className='select__container-font-weight'>
                                  <div className='select-btn__general'>
                                    <div className={`select-btn ${selectTypesFontWeight ? 'active' : ''}`} onClick={openSelectFontWeightSections}>
                                      <div className='select__container_title'>
                                        <p>{selectedTypeFontWeight ? FontWeight.find((s: {id: number}) => s.id === selectedTypeFontWeight)?.name : 'Peso'}</p>
                                      </div>
                                      <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                                    </div>
                                    <div className={`content ${selectTypesFontWeight ? 'active' : ''}`} >
                                      <ul className={`options ${selectTypesFontWeight ? 'active' : ''}`} style={{ opacity: selectTypesFontWeight ? '1' : '0' }}>
                                        {FontWeight && FontWeight.map((font: any) => (
                                          <li key={font.id} onClick={() => handleFontWeightChangeSeis(font)}>
                                            <div dangerouslySetInnerHTML={{ __html: font.name }} />
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                                <svg className="icon_text" onClick={() => textCenteringSeis('text_align-left')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 4h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Zm0-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                                <svg className="icon_text" onClick={() => textCenteringSeis('text_align-center')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm3 4h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 0 1 0-2Zm-3-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                                <svg className="icon_text" onClick={() => textCenteringSeis('text_align-right')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm6 4h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm-6-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                                <div className="color__editor_container">
                                  <svg onClick={() => colorPalette('csdthree')} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="22px" height="18px" className="symbol-textForeColor"><path fill="#000000" fillRule="evenodd" d="M 17 3C 17 3 27.03 17 17 17 6.9 17 17 3 17 3Z"></path><path fillRule="evenodd" d="M 16.96 18C 13.35 18 12 14.95 12 13.03 12 9.97 15.69 4.09 16.12 3.43 16.12 3.43 16.95 2.12 16.95 2.12 16.95 2.12 17.8 3.42 17.8 3.42 18.23 4.08 22 9.97 22 13.03 22 15.09 20.44 18 16.96 18ZM 16.96 3.97C 16.96 3.97 13 10.18 13 13.03 13 14.52 14.02 16.99 16.96 16.99 19.89 16.99 21 14.52 21 13.03 21 10.18 16.96 3.97 16.96 3.97ZM 3.6 9.02C 3.6 9.02 2 13.03 2 13.03 2 13.03-0 13.03-0 13.03-0 13.03 5 1 5 1 5 1 6 0 6 0 6 0 7 0 7 0 7 0 8 1 8 1 8 1 11 7.01 11 7.01 11 7.01 11 11.02 11 11.02 11 11.02 9.4 9.02 9.4 9.02 9.4 9.02 3.6 9.02 3.6 9.02ZM 7 3.01C 7 3.01 6 3.01 6 3.01 6 3.01 4.4 7.01 4.4 7.01 4.4 7.01 8.6 7.01 8.6 7.01 8.6 7.01 7 3.01 7 3.01Z"></path></svg>
                                  <div className={`color__palette`} style={{ display: `${colorState == 'csdthree' ? 'block' : 'none'}`}}>
                                    <div>
                                      <p>Seleciona tu color</p>
                                    </div>
                                    <div>
                                      <p>Colores del tema</p>
                                      <div className="color-button" style={{ backgroundColor: 'red' }} onClick={() => changeTextColorSeis('red')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'blue' }} onClick={() => changeTextColorSeis('blue')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'green' }} onClick={() => changeTextColorSeis('green')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'yellow' }} onClick={() => changeTextColorSeis('yellow')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'orange' }} onClick={() => changeTextColorSeis('orange')}></div>
                                      <div className="color-button" style={{ backgroundColor: 'purple' }} onClick={() => changeTextColorSeis('purple')}></div>
                                    </div>
                                    <div className="color-picker-container">
                                      <div className="color-picker-label">
                                        Elige tu color personalizado
                                      </div>
                                      <svg className="color-picker-icon" width='20' onClick={handleIconClick} style={{ color: selectedColor }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg>
                                      <input type="color" value={selectedColor} onChange={(e) => changeTextColorSeis(e.target.value)} ref={colorInputRef} className="color-picker-input"/>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="rwo__two">
                                <div className="slider-container">
                                  <div>
                                    <p>Tamaño de la fuente (px)</p>
                                    <input type="range" min="8" max="54" defaultValue="14" id="font-size-slider" onChange={(e) => changeFontSizeSeis(e.target.value)} className="slider__editor_wep-page" />
                                  </div>
                                  <div className="container__px" >{`${textFontSize} px`}</div>
                                </div>
                              </div>                          
                            </div>
                            <div>
                              <textarea className={`input__editor`}  onChange={handleTitle6Change} value={copyContainer[index]?.titulo6}></textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                      :
                      ''
                      }
                    </div>
                    :
                    ''
                    }
                    {dataContainer.tipo_contenedor === 3 ?
                    <div>
                      <div>
                        <p>Imagen del itema</p>
                        <div className="container__change_banner_update item_web-page"  style={{ backgroundImage: `url(${copyContainer[index]?.imagen})`, backgroundSize: 'cover',backgroundPosition: 'center'}}>
                          <label className="custom-file-upload">
                            <small> Seleccionar archivo</small>
                            <input id="file-upload1" type="file" onChange={handleImageContainerChange}/>
                          </label>
                        </div>
                      </div>
                      <div className="item_web-page">
                        <p>Titulo</p>
                        <div className="editor-container">
                          <div className="editing__tools">
                            <div className="row__one">
                              <div className='select__container-font-weight'>
                                <div className='select-btn__general'>
                                  <div className={`select-btn ${selectTypesFontWeight ? 'active' : ''}`} onClick={openSelectFontWeightSections}>
                                    <div className='select__container_title'>
                                      <p>{selectedTypeFontWeight ? FontWeight.find((s: {id: number}) => s.id === selectedTypeFontWeight)?.name : 'Peso'}</p>
                                    </div>
                                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                                  </div>
                                  <div className={`content ${selectTypesFontWeight ? 'active' : ''}`} >
                                    <ul className={`options ${selectTypesFontWeight ? 'active' : ''}`} style={{ opacity: selectTypesFontWeight ? '1' : '0' }}>
                                      {FontWeight && FontWeight.map((font: any) => (
                                        <li key={font.id} onClick={() => handleFontWeightChange(font)}>
                                          <div dangerouslySetInnerHTML={{ __html: font.name }} />
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                              <svg className="icon_text" onClick={() => textCentering('text_align-left')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 4h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Zm0-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                              <svg className="icon_text" onClick={() => textCentering('text_align-center')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm3 4h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 0 1 0-2Zm-3-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                              <svg className="icon_text" onClick={() => textCentering('text_align-right')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm6 4h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm-6-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                              <div className="color__editor_container">
                                <svg onClick={() => colorPalette('cdt')} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="22px" height="18px" className="symbol-textForeColor"><path fill="#000000" fillRule="evenodd" d="M 17 3C 17 3 27.03 17 17 17 6.9 17 17 3 17 3Z"></path><path fillRule="evenodd" d="M 16.96 18C 13.35 18 12 14.95 12 13.03 12 9.97 15.69 4.09 16.12 3.43 16.12 3.43 16.95 2.12 16.95 2.12 16.95 2.12 17.8 3.42 17.8 3.42 18.23 4.08 22 9.97 22 13.03 22 15.09 20.44 18 16.96 18ZM 16.96 3.97C 16.96 3.97 13 10.18 13 13.03 13 14.52 14.02 16.99 16.96 16.99 19.89 16.99 21 14.52 21 13.03 21 10.18 16.96 3.97 16.96 3.97ZM 3.6 9.02C 3.6 9.02 2 13.03 2 13.03 2 13.03-0 13.03-0 13.03-0 13.03 5 1 5 1 5 1 6 0 6 0 6 0 7 0 7 0 7 0 8 1 8 1 8 1 11 7.01 11 7.01 11 7.01 11 11.02 11 11.02 11 11.02 9.4 9.02 9.4 9.02 9.4 9.02 3.6 9.02 3.6 9.02ZM 7 3.01C 7 3.01 6 3.01 6 3.01 6 3.01 4.4 7.01 4.4 7.01 4.4 7.01 8.6 7.01 8.6 7.01 8.6 7.01 7 3.01 7 3.01Z"></path></svg>
                                <div className={`color__palette`} style={{ display: `${colorState == 'cdt' ? 'block' : 'none'}`}}>
                                  <div>
                                    <p>Seleciona tu color</p>
                                  </div>
                                  <div>
                                    <p>Colores del tema</p>
                                    <div className="color-button" style={{ backgroundColor: 'red' }} onClick={() => changeTextColor('red')}></div>
                                    <div className="color-button" style={{ backgroundColor: 'blue' }} onClick={() => changeTextColor('blue')}></div>
                                    <div className="color-button" style={{ backgroundColor: 'green' }} onClick={() => changeTextColor('green')}></div>
                                    <div className="color-button" style={{ backgroundColor: 'yellow' }} onClick={() => changeTextColor('yellow')}></div>
                                    <div className="color-button" style={{ backgroundColor: 'orange' }} onClick={() => changeTextColor('orange')}></div>
                                    <div className="color-button" style={{ backgroundColor: 'purple' }} onClick={() => changeTextColor('purple')}></div>
                                  </div>
                                  <div className="color-picker-container">
                                    <div className="color-picker-label">
                                      Elige tu color personalizado
                                    </div>
                                    <svg className="color-picker-icon" width='20' onClick={handleIconClick} style={{ color: selectedColor }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg>
                                    <input type="color" value={selectedColor} onChange={(e) => changeTextColor(e.target.value)} ref={colorInputRef} className="color-picker-input"/>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="rwo__two">
                              <div className="slider-container">
                                <div>
                                  <p>Tamaño de la fuente (px)</p>
                                  <input type="range" min="8" max="32" defaultValue="14" id="font-size-slider" onChange={(e) => changeFontSize(e.target.value)} className="slider__editor_wep-page" />
                                </div>
                                <div className="container__px" >{`${textFontSize} px`}</div>
                              </div>
                            </div>                          
                          </div>
                          <div>
                            <textarea className={`input__editor`}  onChange={handleInputTitleChange} value={copyContainer[index]?.titulo}></textarea>
                          </div>
                         
                        </div>
                      </div>
                      <div className="item_web-page">
                        <p>Descripción</p>
                        <div className="editor-container">
                          <div className="editing__tools">
                            <div className="row__one">
                              <div className='select__container-font-weight'>
                                <div className='select-btn__general'>
                                  <div className={`select-btn ${selectTypesFontWeight ? 'active' : ''}`} onClick={openSelectFontWeightSections}>
                                    <div className='select__container_title'>
                                      <p>{selectedTypeFontWeight ? FontWeight.find((s: {id: number}) => s.id === selectedTypeFontWeight)?.name : 'Peso'}</p>
                                    </div>
                                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                                  </div>
                                  <div className={`content ${selectTypesFontWeight ? 'active' : ''}`} >
                                    <ul className={`options ${selectTypesFontWeight ? 'active' : ''}`} style={{ opacity: selectTypesFontWeight ? '1' : '0' }}>
                                      {FontWeight && FontWeight.map((font: any) => (
                                        <li key={font.id} onClick={() => handleFontWeightChangeDos(font)}>
                                          <div dangerouslySetInnerHTML={{ __html: font.name }} />
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                              <svg className="icon_text" onClick={() => textCenteringDos('text_align-left')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 4h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Zm0-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                              <svg className="icon_text" onClick={() => textCenteringDos('text_align-center')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm3 4h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 0 1 0-2Zm-3-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                              <svg className="icon_text" onClick={() => textCenteringDos('text_align-right')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm6 4h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm-6-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                              <div className="color__editor_container">
                                <svg onClick={() => colorPalette('cdd')} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="22px" height="18px" className="symbol-textForeColor"><path fill="#000000" fillRule="evenodd" d="M 17 3C 17 3 27.03 17 17 17 6.9 17 17 3 17 3Z"></path><path fillRule="evenodd" d="M 16.96 18C 13.35 18 12 14.95 12 13.03 12 9.97 15.69 4.09 16.12 3.43 16.12 3.43 16.95 2.12 16.95 2.12 16.95 2.12 17.8 3.42 17.8 3.42 18.23 4.08 22 9.97 22 13.03 22 15.09 20.44 18 16.96 18ZM 16.96 3.97C 16.96 3.97 13 10.18 13 13.03 13 14.52 14.02 16.99 16.96 16.99 19.89 16.99 21 14.52 21 13.03 21 10.18 16.96 3.97 16.96 3.97ZM 3.6 9.02C 3.6 9.02 2 13.03 2 13.03 2 13.03-0 13.03-0 13.03-0 13.03 5 1 5 1 5 1 6 0 6 0 6 0 7 0 7 0 7 0 8 1 8 1 8 1 11 7.01 11 7.01 11 7.01 11 11.02 11 11.02 11 11.02 9.4 9.02 9.4 9.02 9.4 9.02 3.6 9.02 3.6 9.02ZM 7 3.01C 7 3.01 6 3.01 6 3.01 6 3.01 4.4 7.01 4.4 7.01 4.4 7.01 8.6 7.01 8.6 7.01 8.6 7.01 7 3.01 7 3.01Z"></path></svg>
                                <div className={`color__palette`} style={{ display: `${colorState == 'cdd' ? 'block' : 'none'}`}}>
                                  <div>
                                    <p>Seleciona tu color</p>
                                  </div>
                                  <div>
                                    <p>Colores del tema</p>
                                    <div className="color-button" style={{ backgroundColor: 'red' }} onClick={() => changeTextColorDos('red')}></div>
                                    <div className="color-button" style={{ backgroundColor: 'blue' }} onClick={() => changeTextColorDos('blue')}></div>
                                    <div className="color-button" style={{ backgroundColor: 'green' }} onClick={() => changeTextColorDos('green')}></div>
                                    <div className="color-button" style={{ backgroundColor: 'yellow' }} onClick={() => changeTextColorDos('yellow')}></div>
                                    <div className="color-button" style={{ backgroundColor: 'orange' }} onClick={() => changeTextColorDos('orange')}></div>
                                    <div className="color-button" style={{ backgroundColor: 'purple' }} onClick={() => changeTextColorDos('purple')}></div>
                                  </div>
                                  <div className="color-picker-container">
                                    <div className="color-picker-label">
                                      Elige tu color personalizado
                                    </div>
                                    <svg className="color-picker-icon" width='20' onClick={handleIconClick} style={{ color: selectedColor }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg>
                                    <input type="color" value={selectedColor} onChange={(e) => changeTextColorDos(e.target.value)} ref={colorInputRef} className="color-picker-input"/>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="rwo__two">
                              <div className="slider-container">
                                <div>
                                  <p>Tamaño de la fuente (px)</p>
                                  <input type="range" min="8" max="32" defaultValue="14" id="font-size-slider" onChange={(e) => changeFontSizeDos(e.target.value)} className="slider__editor_wep-page" />
                                </div>
                                <div className="container__px" >{`${textFontSize} px`}</div>
                              </div>
                            </div>                          
                          </div>
                          <div>
                            <textarea className={`input__editor`}  onChange={handleDescriptionContainerChange} value={copyContainer[index]?.imagen4}></textarea>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                    :
                    ''
                    }
                    {dataContainer.tipo_contenedor === 4 ?
                    
                    <div>
                      <div>
                      <p>EN DESARROLLO...(Solo agrega una imagen)</p>
                      <div className="item_web-page">
                      

                      </div>
                      </div>
                      <div>
                        <p>Imagen del item</p>
                        <div className="container__change_banner_update item_web-page"  style={{ backgroundImage: `url(${copyContainer[index]?.imagen})`, backgroundSize:'cover',backgroundPosition:'center' }}>
                          <label  className="custom-file-upload">
                            <small> Seleccionar archivo</small>
                            <input id="file-upload1" type="file" onChange={handleImageContainerChange}/>
                          </label>
                        </div>
                      </div>
                      
                      
                    </div>
                    :
                    ''
                    }
                    {dataContainer.tipo_contenedor === 5 ?
                    <div>
                      <div className="item_web">
                        <div className='select__container'>
                          <label className='label__general'>Tipo de familia (EN DESARROLLO...)</label>
                          <div className='select-btn__general'>
                            <div className={`select-btn ${selectTypesFamilies ? 'active' : ''}`} onClick={openSelectFamilies}>
                              <div className='select__container_title'>
                                <p>{selectedTypeFamily ? families && families.find((s: {id: number}) => s.id === selectedTypeFamily.id)?.nombre : 'Selecciona'}</p>
                              </div>
                              <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                            </div>
                            <div className={`content ${selectTypesFamilies ? 'active' : ''}`} >
                              <ul className={`options ${selectTypesFamilies ? 'active' : ''}`} style={{ opacity: selectTypesFamilies ? '1' : '0' }}>
                                {families && families.map((family: any) => (
                                  <li key={family.id} onClick={() => handleTypesFamiliesChange(family)}>
                                    <div>{family.nombre}</div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    :
                    ''
                    }
                    {dataContainer.tipo_contenedor === 6 ?
                    <div>
                      <div className="item_web-page">
                        <p>Titulo</p>
                        <div className="editor-container">
                          <div className="editing__tools">
                            <div className="row__one">
                              <div className='select__container-font-weight'>
                                <div className='select-btn__general'>
                                  <div className={`select-btn ${selectTypesFontWeight ? 'active' : ''}`} onClick={openSelectFontWeightSections}>
                                    <div className='select__container_title'>
                                      <p>{selectedTypeFontWeight ? FontWeight.find((s: {id: number}) => s.id === selectedTypeFontWeight)?.name : 'Peso'}</p>
                                    </div>
                                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                                  </div>
                                  <div className={`content ${selectTypesFontWeight ? 'active' : ''}`} >
                                    <ul className={`options ${selectTypesFontWeight ? 'active' : ''}`} style={{ opacity: selectTypesFontWeight ? '1' : '0' }}>
                                      {FontWeight && FontWeight.map((font: any) => (
                                        <li key={font.id} onClick={() => handleFontWeightChange(font)}>
                                          <div dangerouslySetInnerHTML={{ __html: font.name }} />
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                              <svg className="icon_text" onClick={() => textCentering('text_align-left')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 4h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Zm0-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                              <svg className="icon_text" onClick={() => textCentering('text_align-center')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm3 4h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 0 1 0-2Zm-3-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                              <svg className="icon_text" onClick={() => textCentering('text_align-right')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm6 4h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm-6-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                              <div className="color__editor_container">
                                <svg onClick={() => colorPalette('cdt')} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="22px" height="18px" className="symbol-textForeColor"><path fill="#000000" fillRule="evenodd" d="M 17 3C 17 3 27.03 17 17 17 6.9 17 17 3 17 3Z"></path><path fillRule="evenodd" d="M 16.96 18C 13.35 18 12 14.95 12 13.03 12 9.97 15.69 4.09 16.12 3.43 16.12 3.43 16.95 2.12 16.95 2.12 16.95 2.12 17.8 3.42 17.8 3.42 18.23 4.08 22 9.97 22 13.03 22 15.09 20.44 18 16.96 18ZM 16.96 3.97C 16.96 3.97 13 10.18 13 13.03 13 14.52 14.02 16.99 16.96 16.99 19.89 16.99 21 14.52 21 13.03 21 10.18 16.96 3.97 16.96 3.97ZM 3.6 9.02C 3.6 9.02 2 13.03 2 13.03 2 13.03-0 13.03-0 13.03-0 13.03 5 1 5 1 5 1 6 0 6 0 6 0 7 0 7 0 7 0 8 1 8 1 8 1 11 7.01 11 7.01 11 7.01 11 11.02 11 11.02 11 11.02 9.4 9.02 9.4 9.02 9.4 9.02 3.6 9.02 3.6 9.02ZM 7 3.01C 7 3.01 6 3.01 6 3.01 6 3.01 4.4 7.01 4.4 7.01 4.4 7.01 8.6 7.01 8.6 7.01 8.6 7.01 7 3.01 7 3.01Z"></path></svg>
                                <div className={`color__palette`} style={{ display: `${colorState == 'cdt' ? 'block' : 'none'}`}}>
                                  <div>
                                    <p>Seleciona tu color</p>
                                  </div>
                                  <div>
                                    <p>Colores del tema</p>
                                    <div className="color-button" style={{ backgroundColor: 'red' }} onClick={() => changeTextColor('red')}></div>
                                    <div className="color-button" style={{ backgroundColor: 'blue' }} onClick={() => changeTextColor('blue')}></div>
                                    <div className="color-button" style={{ backgroundColor: 'green' }} onClick={() => changeTextColor('green')}></div>
                                    <div className="color-button" style={{ backgroundColor: 'yellow' }} onClick={() => changeTextColor('yellow')}></div>
                                    <div className="color-button" style={{ backgroundColor: 'orange' }} onClick={() => changeTextColor('orange')}></div>
                                    <div className="color-button" style={{ backgroundColor: 'purple' }} onClick={() => changeTextColor('purple')}></div>
                                  </div>
                                  <div className="color-picker-container">
                                    <div className="color-picker-label">
                                      Elige tu color personalizado
                                    </div>
                                    <svg className="color-picker-icon" width='20' onClick={handleIconClick} style={{ color: selectedColor }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg>
                                    <input type="color" value={selectedColor} onChange={(e) => changeTextColor(e.target.value)} ref={colorInputRef} className="color-picker-input"/>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="rwo__two">
                              <div className="slider-container">
                                <div>
                                  <p>Tamaño de la fuente (px)</p>
                                  <input type="range" min="8" max="32" defaultValue="14" id="font-size-slider" onChange={(e) => changeFontSize(e.target.value)} className="slider__editor_wep-page" />
                                </div>
                                <div className="container__px" >{`${textFontSize} px`}</div>
                              </div>
                            </div>                          
                          </div>
                          <div>
                            <textarea className={`input__editor ${textCenteringState}`}  onChange={handleInputTitleChange} value={copyContainer[index]?.titulo}></textarea>
                          </div>
                        </div>
                      </div>
                      <div className="item_web-page">
                        <p>Descripcion</p>
                        <div className="editor-container">
                          <div className="editing__tools">
                            <div className="row__one">
                              <div className='select__container-font-weight'>
                                <div className='select-btn__general'>
                                  <div className={`select-btn ${selectTypesFontWeight ? 'active' : ''}`} onClick={openSelectFontWeightSections}>
                                    <div className='select__container_title'>
                                      <p>{selectedTypeFontWeight ? FontWeight.find((s: {id: number}) => s.id === selectedTypeFontWeight)?.name : 'Peso'}</p>
                                    </div>
                                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                                  </div>
                                  <div className={`content ${selectTypesFontWeight ? 'active' : ''}`} >
                                    <ul className={`options ${selectTypesFontWeight ? 'active' : ''}`} style={{ opacity: selectTypesFontWeight ? '1' : '0' }}>
                                      {FontWeight && FontWeight.map((font: any) => (
                                        <li key={font.id} onClick={() => handleFontWeightChangeDos(font)}>
                                          <div dangerouslySetInnerHTML={{ __html: font.name }} />
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                              <svg className="icon_text" onClick={() => textCenteringDos('text_align-left')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 4h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Zm0-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                              <svg className="icon_text" onClick={() => textCenteringDos('text_align-center')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm3 4h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 0 1 0-2Zm-3-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                              <svg className="icon_text" onClick={() => textCenteringDos('text_align-right')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm6 4h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm-6-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                              <div className="color__editor_container">
                                <svg onClick={() => colorPalette('cdd')} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="22px" height="18px" className="symbol-textForeColor"><path fill="#000000" fillRule="evenodd" d="M 17 3C 17 3 27.03 17 17 17 6.9 17 17 3 17 3Z"></path><path fillRule="evenodd" d="M 16.96 18C 13.35 18 12 14.95 12 13.03 12 9.97 15.69 4.09 16.12 3.43 16.12 3.43 16.95 2.12 16.95 2.12 16.95 2.12 17.8 3.42 17.8 3.42 18.23 4.08 22 9.97 22 13.03 22 15.09 20.44 18 16.96 18ZM 16.96 3.97C 16.96 3.97 13 10.18 13 13.03 13 14.52 14.02 16.99 16.96 16.99 19.89 16.99 21 14.52 21 13.03 21 10.18 16.96 3.97 16.96 3.97ZM 3.6 9.02C 3.6 9.02 2 13.03 2 13.03 2 13.03-0 13.03-0 13.03-0 13.03 5 1 5 1 5 1 6 0 6 0 6 0 7 0 7 0 7 0 8 1 8 1 8 1 11 7.01 11 7.01 11 7.01 11 11.02 11 11.02 11 11.02 9.4 9.02 9.4 9.02 9.4 9.02 3.6 9.02 3.6 9.02ZM 7 3.01C 7 3.01 6 3.01 6 3.01 6 3.01 4.4 7.01 4.4 7.01 4.4 7.01 8.6 7.01 8.6 7.01 8.6 7.01 7 3.01 7 3.01Z"></path></svg>
                                <div className={`color__palette`} style={{ display: `${colorState == 'cdd' ? 'block' : 'none'}`}}>
                                  <div>
                                    <p>Seleciona tu color</p>
                                  </div>
                                  <div>
                                    <p>Colores del tema</p>
                                    <div className="color-button" style={{ backgroundColor: 'red' }} onClick={() => changeTextColor('red')}></div>
                                    <div className="color-button" style={{ backgroundColor: 'blue' }} onClick={() => changeTextColor('blue')}></div>
                                    <div className="color-button" style={{ backgroundColor: 'green' }} onClick={() => changeTextColor('green')}></div>
                                    <div className="color-button" style={{ backgroundColor: 'yellow' }} onClick={() => changeTextColor('yellow')}></div>
                                    <div className="color-button" style={{ backgroundColor: 'orange' }} onClick={() => changeTextColor('orange')}></div>
                                    <div className="color-button" style={{ backgroundColor: 'purple' }} onClick={() => changeTextColor('purple')}></div>
                                  </div>
                                  <div className="color-picker-container">
                                    <div className="color-picker-label">
                                      Elige tu color personalizado
                                    </div>
                                    <svg className="color-picker-icon" width='20' onClick={handleIconClick} style={{ color: selectedColor }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg>
                                    <input type="color" value={selectedColor} onChange={(e) => changeTextColorDos(e.target.value)} ref={colorInputRef} className="color-picker-input"/>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="rwo__two">
                              <div className="slider-container">
                                <div>
                                  <p>Tamaño de la fuente (px)</p>
                                  <input type="range" min="8" max="32" defaultValue="14" id="font-size-slider" onChange={(e) => changeFontSizeDos(e.target.value)} className="slider__editor_wep-page" />
                                </div>
                                <div className="container__px" >{`${textFontSize} px`}</div>
                              </div>
                            </div>                          
                          </div>
                          <div>
                            <textarea className={`input__editor ${textCenteringState}`}  onChange={handleDescriptionContainerChange} value={copyContainer[index]?.imagen4}></textarea>
                          </div>
                        </div>
                      </div>
                      <div className="item_web-page">
                        <p>Imagen del item</p>
                        <div className="container__change_banner_update"  style={{ backgroundImage: `url(${copyContainer[index]?.imagen})`, backgroundSize:'cover', backgroundPosition:'center'}}>
                          <label className="custom-file-upload">
                            <small> Seleccionar archivo</small>
                            <input id="file-upload1" type="file" onChange={handleImageContainerChange}/>
                          </label>
                        </div>
                      </div>
                    
                    </div>
                    
                    :
                    ''
                    }
                    
                </div>
                <div className="container__btn_web-page">
                  <button className="btn__general-green-web" onClick={SaveUpdateContainer}>Actualizar</button>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        }
        {validateSection === 4 &&
        <div className="sidebar__web-page">
          <div className={`links ${activeMenuIndex === 1 ? 'activeMenu' : ''}`}>
            <button className="link" style={sales} onClick={() => toggleSubMenu(1)}>
              <span>Agregar productos</span>
              <svg className="arrow"  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"></path></svg>
            </button>
            <div className='sub__menu'>
              <div className='select__container'>
                <label className='label__general'>Tipo de seccion</label>
                <div className='select-btn__general'>
                  <div className={`select-btn ${selectTypesSections ? 'active' : ''}`} onClick={openSelectTypesSections}>
                    <div className='select__container_title'>
                      <p>
                        {selectedTypeSection ?
                          (web.secciones.find((s: {id: number}) => s.id === selectedTypeSection) ?
                          <p>{stripHtml(web.secciones.find((s: {id: number}) => s.id === selectedTypeSection)?.seccion)}</p>
                            : '')
                          : 'Selecciona'}
                      </p>
                    </div>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                  </div>
                  <div className={`content ${selectTypesSections ? 'active' : ''}`} >
                    <ul className={`options ${selectTypesSections ? 'active' : ''}`} style={{ opacity: selectTypesSections ? '1' : '0' }}>
                      {web.secciones && web.secciones.map((section: any) => (
                        <li key={section.id} onClick={() => handleTypesSectionsChange(section)}>
                          <div dangerouslySetInnerHTML={{ __html: section.seccion}} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className='select__container'>
                <label className='label__general'>Tipo de categoría</label>
                <div className='select-btn__general'>
                  <div className={`select-btn ${selectTypesCategories ? 'active' : ''}`} onClick={openSelectCategories}>
                    <div className='select__container_title'>
                      <p>
                        {selectedTypeCategory ?
                          (categories.find((s: {id: number}) => s.id === selectedTypeCategory) ?
                          <p>{stripHtml(categories.find((s: {id: number}) => s.id === selectedTypeCategory)?.nombre)}</p>
                            : '')
                          : 'Selecciona'}
                      </p>
                    </div>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                  </div>
                  <div className={`content ${selectTypesCategories ? 'active' : ''}`} >
                    <ul className={`options ${selectTypesCategories ? 'active' : ''}`} style={{ opacity: selectTypesCategories ? '1' : '0' }}>
                      {categories && categories.map((category: any) => (
                        <li key={category.id} onClick={() => handleCategoriesChange(category)}>
                          <div dangerouslySetInnerHTML={{ __html: category.nombre}} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <label>Nombre del porducto</label>
                <ReactQuill
                      theme="snow"
                      value={nameProducts}
                      onChange={handleNameProductsChange}
                      placeholder="Nombre del producto" 
                      modules={{
                        toolbar: [
                          [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                          [{size: []}],
                          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                          [{'list': 'ordered'}, {'list': 'bullet'}, 
                          {'indent': '-1'}, {'indent': '+1'}],
                              // [{ 'alignTextUp': alignTextUp }],
                              // [{ 'alignTextDown': alignTextDown }], // Alineación
                          ['align', { 'align': [] }],
                          [{ 'color': [] }],
                          ['clean']
                        ],
                      }}
                    />
              </div>
              <div>
                <label>Descripcion del producto</label>
                <ReactQuill
                      theme="snow"
                      value={descriptionProducts}
                      onChange={handleDescriptionProductsChange}
                      placeholder="Nombre del producto" 
                      modules={{
                        toolbar: [
                          [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                          [{size: []}],
                          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                          [{'list': 'ordered'}, {'list': 'bullet'}, 
                          {'indent': '-1'}, {'indent': '+1'}],
                              // [{ 'alignTextUp': alignTextUp }],
                              // [{ 'alignTextDown': alignTextDown }], // Alineación
                          ['align', { 'align': [] }],
                          [{ 'color': [] }],
                          ['clean']
                        ],
                      }}
                  />
              </div>
              <div>
                <p>Imagen del producto</p>
                <div className="container__change_banner" style={{ backgroundImage: `url(${imgProducts})` }}>
                  <label htmlFor="file-upload4" className="custom-file-upload">
                    <small> Seleccionar archivo</small>
                    <input id="file-upload4" type="file" onChange={handleImgProductsChange}/>
                  </label>
                </div>
              </div>
              <div className="container__btn">
                <button className="btn__general-green-web" onClick={createProducts}>Agregar producto</button>
              </div>
            </div>
          </div>
          <div className={`links ${activeMenuIndex === 2 ? 'activeMenu' : ''}`}>
            <button className="link" style={sales} onClick={() => toggleSubMenu(2)}>
              <span>Actualizar productos</span>
              <svg className="arrow"  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"></path></svg>
            </button>
            <div className='sub__menu'>
              <div className='select__container'>
                <label className='label__general'>Tipo de seccion</label>
                <div className='select-btn__general'>
                  <div className={`select-btn ${selectTypesSections ? 'active' : ''}`} onClick={openSelectTypesSections}>
                    <div className='select__container_title'>
                      <p>
                        {selectedTypeSection ?
                          (web.secciones.find((s: {id: number}) => s.id === selectedTypeSection) ?
                          <p>{stripHtml(web.secciones.find((s: {id: number}) => s.id === selectedTypeSection)?.seccion)}</p>
                            : '')
                          : 'Selecciona'}
                      </p>
                
                    </div>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                  </div>
                  <div className={`content ${selectTypesSections ? 'active' : ''}`} >
                    <ul className={`options ${selectTypesSections ? 'active' : ''}`} style={{ opacity: selectTypesSections ? '1' : '0' }}>
                      {web.secciones && web.secciones.map((section: any) => (
                        <li key={section.id} onClick={() => handleTypesSectionsChange(section)}>
                            <p>{stripHtml(section.seccion)}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className='select__container'>
                <label className='label__general'>Tipo de categoría</label>
                <div className='select-btn__general'>
                  <div className={`select-btn ${selectTypesCategories ? 'active' : ''}`} onClick={openSelectCategories}>
                    <div className='select__container_title'>
                      <p>
                        {selectedTypeCategory ?
                          (categories.find((s: {id: number}) => s.id === selectedTypeCategory) ?
                          <p>{stripHtml(categories.find((s: {id: number}) => s.id === selectedTypeCategory)?.nombre)}</p>
                            : '')
                          : 'Selecciona'}
                      </p>
                    </div>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                  </div>
                  <div className={`content ${selectTypesCategories ? 'active' : ''}`} >
                    <ul className={`options ${selectTypesCategories ? 'active' : ''}`} style={{ opacity: selectTypesCategories ? '1' : '0' }}>
                      {categories && categories.map((category: any) => (
                        <li key={category.id} onClick={() => handleCategoriesChange(category)}>
                          <p>{stripHtml(category.nombre)}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className='select__container'>
                <label className='label__general'>Productos</label>
                <div className='select-btn__general'>
                  <div className={`select-btn ${selectTypesProducts ? 'active' : ''}`} onClick={openSelectProducts}>
                    <div className='select__container_title'>
                      <p>
                        {selectedTypeProduct ?
                          (products.find((s: {id: number}) => s.id === selectedTypeProduct) ?
                          <p>{stripHtml(products.find((s: {id: number}) => s.id === selectedTypeProduct)?.nombre)}</p>
                            : '')
                          : 'Selecciona'}
                      </p>
                    </div>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                  </div>
                  <div className={`content ${selectTypesProducts ? 'active' : ''}`} >
                    <ul className={`options ${selectTypesProducts ? 'active' : ''}`} style={{ opacity: selectTypesProducts ? '1' : '0' }}>
                      {products && products.map((product: any) => (
                        <li key={product.id} onClick={() => handleProductsChange(product)}>
                          <p>{stripHtml( product.nombre)}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <label>Nombre del porducto</label>
                <ReactQuill
                      theme="snow"
                      value={nameProducts}
                      onChange={handleNameProductsChange}
                      placeholder="Nombre del producto" 
                      modules={{
                        toolbar: [
                          [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                          [{size: []}],
                          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                          [{'list': 'ordered'}, {'list': 'bullet'}, 
                          {'indent': '-1'}, {'indent': '+1'}],
                              // [{ 'alignTextUp': alignTextUp }],
                              // [{ 'alignTextDown': alignTextDown }], // Alineación
                          ['align', { 'align': [] }],
                          [{ 'color': [] }],
                          ['clean']
                        ],
                      }}
                    />
              </div>
              <div>
                <label>Descripcion del producto</label>
                <ReactQuill
                      theme="snow"
                      value={descriptionProducts}
                      onChange={handleDescriptionProductsChange}
                      placeholder="Nombre del producto" 
                      modules={{
                        toolbar: [
                          [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                          [{size: []}],
                          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                          [{'list': 'ordered'}, {'list': 'bullet'}, 
                          {'indent': '-1'}, {'indent': '+1'}],
                              // [{ 'alignTextUp': alignTextUp }],
                              // [{ 'alignTextDown': alignTextDown }], // Alineación
                          ['align', { 'align': [] }],
                          [{ 'color': [] }],
                          ['clean']
                        ],
                      }}
                  />
              </div>
              <div>
                <p>Imagen del producto</p>
                <div className="container__change_banner" style={{ backgroundImage: `url(${imgProducts})` }}>
                  <label htmlFor="file-upload4" className="custom-file-upload">
                    <small> Seleccionar archivo</small>
                    <input id="file-upload4" type="file" onChange={handleImgProductsChange}/>
                  </label>
                </div>
              </div>
              <div className="container__btn">
                <button className="btn__general-green-web" onClick={updateProducts}>Actualizar producto</button>
              </div>
            </div>
          </div>
          <div className={`links ${activeMenuIndex === 3 ? 'activeMenu' : ''}`}>
            <button className="link" style={sales} onClick={() => toggleSubMenu(3)}>
              <span>Eliminar productos</span>
              <svg className="arrow"  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"></path></svg>
            </button>
            <div className='sub__menu'>
              <div className='select__container'>
                <label className='label__general'>Tipo de seccion</label>
                <div className='select-btn__general'>
                  <div className={`select-btn ${selectTypesSections ? 'active' : ''}`} onClick={openSelectTypesSections}>
                    <div className='select__container_title'>
                      <p>
                        {selectedTypeSection ?
                          (web.secciones.find((s: {id: number}) => s.id === selectedTypeSection) ?
                          <p>{stripHtml(web.secciones.find((s: {id: number}) => s.id === selectedTypeSection)?.seccion)}</p>
                            : '')
                          : 'Selecciona'}
                      </p>                
                    </div>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                  </div>
                  <div className={`content ${selectTypesSections ? 'active' : ''}`} >
                    <ul className={`options ${selectTypesSections ? 'active' : ''}`} style={{ opacity: selectTypesSections ? '1' : '0' }}>
                      {web.secciones && web.secciones.map((section: any) => (
                        <li key={section.id} onClick={() => handleTypesSectionsChange(section)}>
                          {section.seccion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className='select__container'>
                <label className='label__general'>Tipo de categoría</label>
                <div className='select-btn__general'>
                  <div className={`select-btn ${selectTypesCategories ? 'active' : ''}`} onClick={openSelectCategories}>
                    <div className='select__container_title'>
                      <p>{selectedTypeCategory ? categories.find((s: {id: number}) => s.id === selectedTypeCategory)?.nombre : 'Selecciona'}</p>
                    </div>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                  </div>
                  <div className={`content ${selectTypesCategories ? 'active' : ''}`} >
                    <ul className={`options ${selectTypesCategories ? 'active' : ''}`} style={{ opacity: selectTypesCategories ? '1' : '0' }}>
                      {categories && categories.map((category: any) => (
                        <li key={category.id} onClick={() => handleCategoriesChange(category)}>
                          <p dangerouslySetInnerHTML={{ __html: category.nombre }}></p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className='select__container'>
                <label className='label__general'>Productos</label>
                <div className='select-btn__general'>
                  <div className={`select-btn ${selectTypesProducts ? 'active' : ''}`} onClick={openSelectProducts}>
                    <div className='select__container_title'>
                      <p>{selectedTypeProduct ? products.find((s: {id: number}) => s.id === selectedTypeProduct)?.nombre : 'Selecciona'}</p>
                    </div>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                  </div>
                  <div className={`content ${selectTypesProducts ? 'active' : ''}`} >
                    <ul className={`options ${selectTypesProducts ? 'active' : ''}`} style={{ opacity: selectTypesProducts ? '1' : '0' }}>
                      {products && products.map((product: any) => (
                        <li key={product.id} onClick={() => handleProductsChange(product)}>
                          <p dangerouslySetInnerHTML={{ __html: product.nombre }}></p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <p>Imagen del producto</p>
                <div className="container__change_banner" style={{ backgroundImage: `url(${imgProducts})` }}>
                  <label htmlFor="file-upload4" className="custom-file-upload">
                    <small> Seleccionar archivo</small>
                    <input id="file-upload4" type="file" onChange={handleImgProductsChange}/>
                  </label>
                </div>
              </div>
              <div className="container__btn">
                <button className="btn__general-green-web" onClick={deleteProducts}>Eliminar producto</button>
              </div>
            </div>
          </div>
        </div>
        }
        {/* {validateSection === 5 &&
        <div className="sidebar__web-page">
          <div className={`links ${activeMenuIndex === 1 ? 'activeMenu' : ''}`}>
            <button className="link" style={sales} onClick={() => toggleSubMenu(1)}>
              <span>Footer</span>
              <svg className="arrow"  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"></path></svg>
            </button>
            <div className='sub__menu'>
              <div className="sub__menu_container">
                <div className="item_web-page">
                  <p>Descripcion</p>
                  <div className="editor-container">
                    <div className="editing__tools">
                      <div className="row__one">
                        <div className='select__container-font-weight'>
                          <div className='select-btn__general'>
                            <div className={`select-btn ${selectTypesFontWeight ? 'active' : ''}`} onClick={openSelectFontWeightSections}>
                              <div className='select__container_title'>
                                <p>{selectedTypeFontWeight ? FontWeight.find((s: {id: number}) => s.id === selectedTypeFontWeight)?.name : 'Peso'}</p>
                              </div>
                              <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                            </div>
                            <div className={`content ${selectTypesFontWeight ? 'active' : ''}`} >
                              <ul className={`options ${selectTypesFontWeight ? 'active' : ''}`} style={{ opacity: selectTypesFontWeight ? '1' : '0' }}>
                                {FontWeight && FontWeight.map((font: any) => (
                                  <li key={font.id} onClick={() => handleFontWeightChangeDos(font)}>
                                    <div dangerouslySetInnerHTML={{ __html: font.name }} />
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                        <svg className="icon_text" onClick={() => textCenteringDos('text_align-left')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 4h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Zm0-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                        <svg className="icon_text" onClick={() => textCenteringDos('text_align-center')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm3 4h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 0 1 0-2Zm-3-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                        <svg className="icon_text" onClick={() => textCenteringDos('text_align-right')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm6 4h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm-6-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                        <div className="color__editor_container">
                          <svg onClick={() => colorPalette('cdd')} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="22px" height="18px" className="symbol-textForeColor"><path fill="#000000" fillRule="evenodd" d="M 17 3C 17 3 27.03 17 17 17 6.9 17 17 3 17 3Z"></path><path fillRule="evenodd" d="M 16.96 18C 13.35 18 12 14.95 12 13.03 12 9.97 15.69 4.09 16.12 3.43 16.12 3.43 16.95 2.12 16.95 2.12 16.95 2.12 17.8 3.42 17.8 3.42 18.23 4.08 22 9.97 22 13.03 22 15.09 20.44 18 16.96 18ZM 16.96 3.97C 16.96 3.97 13 10.18 13 13.03 13 14.52 14.02 16.99 16.96 16.99 19.89 16.99 21 14.52 21 13.03 21 10.18 16.96 3.97 16.96 3.97ZM 3.6 9.02C 3.6 9.02 2 13.03 2 13.03 2 13.03-0 13.03-0 13.03-0 13.03 5 1 5 1 5 1 6 0 6 0 6 0 7 0 7 0 7 0 8 1 8 1 8 1 11 7.01 11 7.01 11 7.01 11 11.02 11 11.02 11 11.02 9.4 9.02 9.4 9.02 9.4 9.02 3.6 9.02 3.6 9.02ZM 7 3.01C 7 3.01 6 3.01 6 3.01 6 3.01 4.4 7.01 4.4 7.01 4.4 7.01 8.6 7.01 8.6 7.01 8.6 7.01 7 3.01 7 3.01Z"></path></svg>
                          <div className={`color__palette`} style={{ display: `${colorState == 'cdd' ? 'block' : 'none'}`}}>
                            <div>
                              <p>Seleciona tu color</p>
                            </div>
                            <div>
                              <p>Colores del tema</p>
                              <div className="color-button" style={{ backgroundColor: 'red' }} onClick={() => changeTextColor('red')}></div>
                              <div className="color-button" style={{ backgroundColor: 'blue' }} onClick={() => changeTextColor('blue')}></div>
                              <div className="color-button" style={{ backgroundColor: 'green' }} onClick={() => changeTextColor('green')}></div>
                              <div className="color-button" style={{ backgroundColor: 'yellow' }} onClick={() => changeTextColor('yellow')}></div>
                              <div className="color-button" style={{ backgroundColor: 'orange' }} onClick={() => changeTextColor('orange')}></div>
                              <div className="color-button" style={{ backgroundColor: 'purple' }} onClick={() => changeTextColor('purple')}></div>
                            </div>
                            <div className="color-picker-container">
                              <div className="color-picker-label">
                                Elige tu color personalizado
                              </div>
                              <svg className="color-picker-icon" width='20' onClick={handleIconClick} style={{ color: selectedColor }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg>
                              <input type="color" value={selectedColor} onChange={(e) => changeTextColorDos(e.target.value)} ref={colorInputRef} className="color-picker-input"/>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="rwo__two">
                        <div className="slider-container">
                          <div>
                            <p>Tamaño de la fuente (px)</p>
                            <input type="range" min="8" max="32" defaultValue="14" id="font-size-slider" onChange={(e) => changeFontSizeDos(e.target.value)} className="slider__editor_wep-page" />
                          </div>
                          <div className="container__px" >{`${textFontSize} px`}</div>
                        </div>
                      </div>                          
                    </div>
                    <div>
                      <textarea className={`input__editor ${textCenteringState}`} onChange={handleTitlesFooterOneChange} />
                    </div>
                  </div>
                </div>
                <div className="item_web-page">
                  <p>Descripcion</p>
                  <div className="editor-container">
                    <div className="editing__tools">
                      <div className="row__one">
                        <div className='select__container-font-weight'>
                          <div className='select-btn__general'>
                            <div className={`select-btn ${selectTypesFontWeight ? 'active' : ''}`} onClick={openSelectFontWeightSections}>
                              <div className='select__container_title'>
                                <p>{selectedTypeFontWeight ? FontWeight.find((s: {id: number}) => s.id === selectedTypeFontWeight)?.name : 'Peso'}</p>
                              </div>
                              <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                            </div>
                            <div className={`content ${selectTypesFontWeight ? 'active' : ''}`} >
                              <ul className={`options ${selectTypesFontWeight ? 'active' : ''}`} style={{ opacity: selectTypesFontWeight ? '1' : '0' }}>
                                {FontWeight && FontWeight.map((font: any) => (
                                  <li key={font.id} onClick={() => handleFontWeightChangeDos(font)}>
                                    <div dangerouslySetInnerHTML={{ __html: font.name }} />
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                        <svg className="icon_text" onClick={() => textCenteringDos('text_align-left')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 4h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Zm0-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                        <svg className="icon_text" onClick={() => textCenteringDos('text_align-center')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm3 4h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 0 1 0-2Zm-3-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                        <svg className="icon_text" onClick={() => textCenteringDos('text_align-right')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm6 4h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm-6-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                        <div className="color__editor_container">
                          <svg onClick={() => colorPalette('cdd')} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="22px" height="18px" className="symbol-textForeColor"><path fill="#000000" fillRule="evenodd" d="M 17 3C 17 3 27.03 17 17 17 6.9 17 17 3 17 3Z"></path><path fillRule="evenodd" d="M 16.96 18C 13.35 18 12 14.95 12 13.03 12 9.97 15.69 4.09 16.12 3.43 16.12 3.43 16.95 2.12 16.95 2.12 16.95 2.12 17.8 3.42 17.8 3.42 18.23 4.08 22 9.97 22 13.03 22 15.09 20.44 18 16.96 18ZM 16.96 3.97C 16.96 3.97 13 10.18 13 13.03 13 14.52 14.02 16.99 16.96 16.99 19.89 16.99 21 14.52 21 13.03 21 10.18 16.96 3.97 16.96 3.97ZM 3.6 9.02C 3.6 9.02 2 13.03 2 13.03 2 13.03-0 13.03-0 13.03-0 13.03 5 1 5 1 5 1 6 0 6 0 6 0 7 0 7 0 7 0 8 1 8 1 8 1 11 7.01 11 7.01 11 7.01 11 11.02 11 11.02 11 11.02 9.4 9.02 9.4 9.02 9.4 9.02 3.6 9.02 3.6 9.02ZM 7 3.01C 7 3.01 6 3.01 6 3.01 6 3.01 4.4 7.01 4.4 7.01 4.4 7.01 8.6 7.01 8.6 7.01 8.6 7.01 7 3.01 7 3.01Z"></path></svg>
                          <div className={`color__palette`} style={{ display: `${colorState == 'cdd' ? 'block' : 'none'}`}}>
                            <div>
                              <p>Seleciona tu color</p>
                            </div>
                            <div>
                              <p>Colores del tema</p>
                              <div className="color-button" style={{ backgroundColor: 'red' }} onClick={() => changeTextColor('red')}></div>
                              <div className="color-button" style={{ backgroundColor: 'blue' }} onClick={() => changeTextColor('blue')}></div>
                              <div className="color-button" style={{ backgroundColor: 'green' }} onClick={() => changeTextColor('green')}></div>
                              <div className="color-button" style={{ backgroundColor: 'yellow' }} onClick={() => changeTextColor('yellow')}></div>
                              <div className="color-button" style={{ backgroundColor: 'orange' }} onClick={() => changeTextColor('orange')}></div>
                              <div className="color-button" style={{ backgroundColor: 'purple' }} onClick={() => changeTextColor('purple')}></div>
                            </div>
                            <div className="color-picker-container">
                              <div className="color-picker-label">
                                Elige tu color personalizado
                              </div>
                              <svg className="color-picker-icon" width='20' onClick={handleIconClick} style={{ color: selectedColor }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg>
                              <input type="color" value={selectedColor} onChange={(e) => changeTextColorDos(e.target.value)} ref={colorInputRef} className="color-picker-input"/>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="rwo__two">
                        <div className="slider-container">
                          <div>
                            <p>Tamaño de la fuente (px)</p>
                            <input type="range" min="8" max="32" defaultValue="14" id="font-size-slider" onChange={(e) => changeFontSizeDos(e.target.value)} className="slider__editor_wep-page" />
                          </div>
                          <div className="container__px" >{`${textFontSize} px`}</div>
                        </div>
                      </div>                          
                    </div>
                    <div>
                      <textarea className={`input__editor ${textCenteringState}`}  onChange={handleTitlesFooterTwoChange} ></textarea>
                    </div>
                  </div>
                </div>
                <div className="item_web-page">
                  <p>Descripcion</p>
                  <div className="editor-container">
                    <div className="editing__tools">
                      <div className="row__one">
                        <div className='select__container-font-weight'>
                          <div className='select-btn__general'>
                            <div className={`select-btn ${selectTypesFontWeight ? 'active' : ''}`} onClick={openSelectFontWeightSections}>
                              <div className='select__container_title'>
                                <p>{selectedTypeFontWeight ? FontWeight.find((s: {id: number}) => s.id === selectedTypeFontWeight)?.name : 'Peso'}</p>
                              </div>
                              <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                            </div>
                            <div className={`content ${selectTypesFontWeight ? 'active' : ''}`} >
                              <ul className={`options ${selectTypesFontWeight ? 'active' : ''}`} style={{ opacity: selectTypesFontWeight ? '1' : '0' }}>
                                {FontWeight && FontWeight.map((font: any) => (
                                  <li key={font.id} onClick={() => handleFontWeightChangeDos(font)}>
                                    <div dangerouslySetInnerHTML={{ __html: font.name }} />
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                        <svg className="icon_text" onClick={() => textCenteringDos('text_align-left')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 4h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Zm0-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                        <svg className="icon_text" onClick={() => textCenteringDos('text_align-center')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm3 4h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 0 1 0-2Zm-3-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                        <svg className="icon_text" onClick={() => textCenteringDos('text_align-right')} width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm6 4h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm-6-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd"></path></svg>
                        <div className="color__editor_container">
                          <svg onClick={() => colorPalette('cdd')} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="22px" height="18px" className="symbol-textForeColor"><path fill="#000000" fillRule="evenodd" d="M 17 3C 17 3 27.03 17 17 17 6.9 17 17 3 17 3Z"></path><path fillRule="evenodd" d="M 16.96 18C 13.35 18 12 14.95 12 13.03 12 9.97 15.69 4.09 16.12 3.43 16.12 3.43 16.95 2.12 16.95 2.12 16.95 2.12 17.8 3.42 17.8 3.42 18.23 4.08 22 9.97 22 13.03 22 15.09 20.44 18 16.96 18ZM 16.96 3.97C 16.96 3.97 13 10.18 13 13.03 13 14.52 14.02 16.99 16.96 16.99 19.89 16.99 21 14.52 21 13.03 21 10.18 16.96 3.97 16.96 3.97ZM 3.6 9.02C 3.6 9.02 2 13.03 2 13.03 2 13.03-0 13.03-0 13.03-0 13.03 5 1 5 1 5 1 6 0 6 0 6 0 7 0 7 0 7 0 8 1 8 1 8 1 11 7.01 11 7.01 11 7.01 11 11.02 11 11.02 11 11.02 9.4 9.02 9.4 9.02 9.4 9.02 3.6 9.02 3.6 9.02ZM 7 3.01C 7 3.01 6 3.01 6 3.01 6 3.01 4.4 7.01 4.4 7.01 4.4 7.01 8.6 7.01 8.6 7.01 8.6 7.01 7 3.01 7 3.01Z"></path></svg>
                          <div className={`color__palette`} style={{ display: `${colorState == 'cdd' ? 'block' : 'none'}`}}>
                            <div>
                              <p>Seleciona tu color</p>
                            </div>
                            <div>
                              <p>Colores del tema</p>
                              <div className="color-button" style={{ backgroundColor: 'red' }} onClick={() => changeTextColor('red')}></div>
                              <div className="color-button" style={{ backgroundColor: 'blue' }} onClick={() => changeTextColor('blue')}></div>
                              <div className="color-button" style={{ backgroundColor: 'green' }} onClick={() => changeTextColor('green')}></div>
                              <div className="color-button" style={{ backgroundColor: 'yellow' }} onClick={() => changeTextColor('yellow')}></div>
                              <div className="color-button" style={{ backgroundColor: 'orange' }} onClick={() => changeTextColor('orange')}></div>
                              <div className="color-button" style={{ backgroundColor: 'purple' }} onClick={() => changeTextColor('purple')}></div>
                            </div>
                            <div className="color-picker-container">
                              <div className="color-picker-label">
                                Elige tu color personalizado
                              </div>
                              <svg className="color-picker-icon" width='20' onClick={handleIconClick} style={{ color: selectedColor }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg>
                              <input type="color" value={selectedColor} onChange={(e) => changeTextColorDos(e.target.value)} ref={colorInputRef} className="color-picker-input"/>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="rwo__two">
                        <div className="slider-container">
                          <div>
                            <p>Tamaño de la fuente (px)</p>
                            <input type="range" min="8" max="32" defaultValue="14" id="font-size-slider" onChange={(e) => changeFontSizeDos(e.target.value)} className="slider__editor_wep-page" />
                          </div>
                          <div className="container__px" >{`${textFontSize} px`}</div>
                        </div>
                      </div>                          
                    </div>
                    <div>
                      <textarea className={`input__editor ${textCenteringState}`}  onChange={handleTitlesFooterThreeChange} ></textarea>
                    </div>
                  </div>
                </div>
                <div>
                  <p>Seccion 4</p>
                  <input className="general__input_web-page" value={titlesFooterFour} onChange={(e) => setTitlesFooterFour(e.target.value)} type="text" />
                </div>
                <div>
                  <button className="btn__general-green-web" onClick={updateFooter}>Guardar</button>
                </div>
              </div>
            </div>
         
          </div>
        </div>
        } */}
        {web && (
          <div ref={mainWebpageRef} style={overFlow}  className={`main__webpage ${stateResponse ? 'response' : ''} `} >
            <div className="hero__web-page-edit">
              <div className='hero__web-page_container'>
                <div className="logo_web-page" style={{ backgroundImage: `url(${logoImage})` }}>
                </div>
                <nav className='nav__hero_web-page'>
                    <ul className={`nav__links_web-page ${stateToggle ? 'active' : ''}`}>
                      {sections && sections.map((x: any, index: any) => (
                        <li key={index}>
                          <button dangerouslySetInnerHTML={{ __html: x.seccion }} onClick={() => idConatinerHeader(x)}></button>
                        </li>
                      ))}
                    </ul>
                </nav>
                <div className="toggle">
                  <button className={`toggle__botton ${stateToggle ? 'activo' : ''}`} onClick={toggleMenu}>
                      <span className="l1 span"></span>
                      <span className="l2 span"></span>
                      <span className="l3 span"></span>
                  </button>
                </div>
              </div>
            </div>
  
            <div className="section__one_web">
              <div className={`whatsapp__botton`}>
                {linkButtons && linkButtons.map((x: any) => (
                   <a href={x.link} target="_blank">
                      <img src={x.image} width='50' height='50' alt="" />
                    </a>
                ))}
              </div>
              <Reorder.Group axis="y" values={copyContainer} onReorder={setCopyContainer}>
                {copyContainer.map((item: any, index: any) => (
                  <Reorder.Item value={item} key={item.id}>
                    <div className="container__section_container">
                      {item.tipo_contenedor === 1 &&
                      <div  className="banner_web-page-u">
                        <Banner item={item}  copyContainer={copyContainer} index={index} />
                        {index !== copyContainer[index].orden  ? 
                        <button className="btn__general-purple btn_save_order_web" onClick={() => updateContainerOrder(item, index)}>Guardar orden</button>
                        :
                        ''
                        }
                        <div className="tools_edits">
                          <div className="tools_edits_container">
                            <div>
                              <svg className="icon_edit" xmlns="http://www.w3.org/2000/svg" width='18' onClick={() => containerEditor(item, index)} viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>
                            </div>
                            <div>
                              <svg xmlns="http://www.w3.org/2000/svg" width='15' fill="#e61414" onClick={() => deleteBanner(item)} viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      }
                      {item.tipo_contenedor == 2 && 
                      <div  className="banner_web-page-u">
                        <Services item={item} copyContainer={copyContainer} index={index}  editServices={editServicePadre} />
                        {index !== copyContainer[index].orden  ? 
                        <button className="btn__general-purple btn_save_order_web" onClick={() => updateContainerOrder(item, index)}>Guardar orden</button>
                        :
                        ''
                        }
                        <div className="tools_edits">
                   
                          <div className="tools_edits_container">
                            <div>
                              <svg  className="icon_edit" xmlns="http://www.w3.org/2000/svg" width='18' onClick={() => containerEditor(item, index)} viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>
                            </div>
                            <div>
                              <svg xmlns="http://www.w3.org/2000/svg" width='15' fill="#e61414" onClick={() => deleteBanner(item)} viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                            </div>
                          </div>
                        </div>
                      </div>} 
                      {item.tipo_contenedor === 3 &&
                      <div  className="collections_web-page-u">
                        <Description copyContainer={copyContainer} index={index}/>
                        {index !== copyContainer[index].orden  ? 
                        <button className="btn__general-purple btn_save_order_web" onClick={() => updateContainerOrder(item, index)}>Guardar orden</button>
                        :
                        ''
                        }
                        <div className="tools_edits">
                          <div className="tools_edits_container">
                            <div>
                              <svg  className="icon_edit" xmlns="http://www.w3.org/2000/svg" width='18' onClick={() => containerEditor(item, index)} viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>
                            </div>
                            <div>
                              <svg xmlns="http://www.w3.org/2000/svg" width='15' fill="#e61414" onClick={() => deleteBanner(item)} viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      }
                      {item.tipo_contenedor === 4 &&
                      <div className="slider_web-page-u">
                        <Slider item={item} copyContainer={copyContainer} />
                        {index !== copyContainer[index].orden  ? 
                        <button className="btn__general-purple btn_save_order_web" onClick={() => updateContainerOrder(item, index)}>Guardar orden</button>
                        :
                        ''
                        }
                        <div className="tools_edits">
                          <div className="tools_edits_container">
                            <div>
                              <svg  className="icon_edit" xmlns="http://www.w3.org/2000/svg" width='18' onClick={() => containerEditor(item, index)} viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>
                            </div>
                            <div>
                              <svg xmlns="http://www.w3.org/2000/svg" width='15' fill="#e61414" onClick={() => deleteBanner(item)} viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      }
                      {item.tipo_contenedor === 5 &&
                      <div className="carousel_web-page-u">
                        <Carousel item={item} selectedTypeFamily={selectedTypeFamily} />
                        {index !== copyContainer[index].orden  ? 
                        <button className="btn__general-purple btn_save_order_web" onClick={() => updateContainerOrder(item, index)}>Guardar orden</button>
                        :
                        ''
                        }
                        <div className="tools_edits">
                          <div className="tools_edits_container">
                            <div>
                              <svg  className="icon_edit" xmlns="http://www.w3.org/2000/svg" width='18' onClick={() => containerEditor(item, index)} viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>
                            </div>
                            <div>
                              <svg xmlns="http://www.w3.org/2000/svg" width='15' fill="#e61414" onClick={() => deleteBanner(item)} viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      }
                      {item.tipo_contenedor === 6 &&
                      <div className="banner_web-page-u">
                        <SmallBanner item={item} copyContainer={copyContainer} index={index} />
                        {index !== copyContainer[index].orden  ? 
                        <button className="btn__general-purple btn_save_order_web" onClick={() => updateContainerOrder(item, index)}>Guardar orden</button>
                        :
                        ''
                        }
                        <div className="tools_edits">
                          <div className="tools_edits_container">
                            <div>
                              <svg  className="icon_edit" xmlns="http://www.w3.org/2000/svg" width='18' onClick={() => containerEditor(item, index)} viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>
                            </div>
                            <div>
                              <svg xmlns="http://www.w3.org/2000/svg" width='15' fill="#e61414" onClick={() => deleteBanner(item)} viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      }
                      {item.tipo_contenedor === 7 &&
                      <div>
                        <Form />
                        <div className="tools_edits">
                          <div className="tools_edits_container">
                            <div>
                              <svg  className="icon_edit" xmlns="http://www.w3.org/2000/svg" width='18' onClick={() => containerEditor(item, index)} viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>
                            </div>
                            <div>
                              <svg xmlns="http://www.w3.org/2000/svg" width='15' fill="#e61414" onClick={() => deleteBanner(item)} viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      }
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>
            <footer className="footer-web-page">
              <div className="footer-line"></div>
              <div className="footer-wrapper">
                  {/* <section className="footer-top">
                      <div className="footer-headline">
                          <h3>Sign up to our newsletter</h3>
                          <p>
                              Stay up to date with our news and articles
                          </p>
                      </div>
                      <div className="footer-subscribe">
                          <input type="email" placeholder="Your Email"/>
                          <button>
                              Sign Up
                          </button>
                      </div>
                  </section>
                  <div className="footer-columns">
                      <section className="footer-logo">
                          <img src={headerAndFooter.logo} max-width='20' alt="logo" />
                      </section>
                      <section>
                        {titlesFooterOne.map((paragraph: any, index: any) => (
                          <div key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
                        ))}
                      </section>
                      <section>
                        {titlesFooterTwo.map((paragraph: any, index: any) => (
                          <div key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
                        ))}
                      </section>
                      <section>
                        {titlesFooterThree.map((paragraph: any, index: any) => (
                          <div key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
                        ))}
                      </section>
                    
                  </div> */}
                  <div className="footer-bottom">
                      <small>© Desarrollado por Hiplot Business. <span id="year"></span>, Todos los derechos reservados</small>
                      {/* <span className='social-links'>
                          <a href="#" title="Instagram">
                            <svg xmlns="http://www.w3.org/2000/svg" width='20' viewBox="0 0 512 512"><path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z"/></svg>                      
                          </a>
                          <a href="#" title="Linkedin">
                            <svg xmlns="http://www.w3.org/2000/svg" width='20' viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
                          </a>
                          <a href="#" title="Twitter">
                            <svg xmlns="http://www.w3.org/2000/svg" width='20' viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>
                          </a>
                      </span> */}
                  </div>
              </div>
            </footer>
          </div>
          )}
      </div>
    </div>
  );
}

export default WebNavigation;
