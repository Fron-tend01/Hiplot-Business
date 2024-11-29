import React, { useEffect, useState } from 'react'
import './styles/Direct.css'
import { articleRequests } from '../../../../../../fuctions/Articles'
import useUserStore from '../../../../../../zustand/General'
import { storeWarehouseExit } from '../../../../../../zustand/WarehouseExit'
import { useStore } from 'zustand';
import { toast } from 'sonner'
import { useSelectStore } from '../../../../../../zustand/Select'
import Swal from 'sweetalert2'


const Direct: React.FC = () => {
  const userState = useUserStore(state => state.user);
  const user_id = userState.id



  const {getArticles}: any = articleRequests()
  const { concepts, setConcepts } = useStore(storeWarehouseExit);

  const selectedIds: any = useSelectStore((state) => state.selectedIds);

  const typesSerachBy = [
    {
        id: 1,
        name: 'Nombre'
    },
    {
        id: 2,
        name: 'Código'
    }
  ]
  const [selectSearchBy, setSelectSearchBy] = useState<boolean>()
  const [selectedSearchBy, setSelectedSearchBy] = useState<any>(typesSerachBy[1].id)
 

  const openselectSearchBy = () => {
    setSelectSearchBy(!selectSearchBy)
  }

  const handleSearchByChange = (x: any) => {
    setSelectSearchBy(false)
    setSelectedSearchBy(x.id)
  }

  ///////////////////////////////// Result ////////////////////////////////////
  const [selectResult, setSelectResult] = useState<any>()
  const [selectedResult, setSelectedResult] = useState<any>()

  const openselectResult = () => {
    setSelectResult(!selectResult)
  }

  const handleResultChange = (x: any) => {
    setSelectResult(false)
    setSelectedResult(x)
  }




  const [inputSearch, setInputSearch] = useState<any>('')

  const [result, setResult] = useState<any>()

  const search = async () => {
    
    const data = {
        id: 0,
        activos: true,
        nombre: selectedSearchBy == 1 ? inputSearch : '',
        codigo: selectedSearchBy == 2 ? inputSearch : '',
        familia: 0,
        proveedor: 0,
        materia_prima: 0,
        get_sucursales: false,
        get_proveedores: false,
        get_max_mins: false,
        get_plantilla_data: false,
        get_stock: true,
        get_web: false,
        get_unidades: true,
        id_usuario: user_id
      };

    const result = await getArticles(data);
    setResult(result);
     
  }


//   const addResult = () => {

//     setConcepts((prevArticleStates: any) => [...prevArticleStates, {
//         id_articulo: selectedResult.id,
//         nameArticle: selectedResult.nombre,
//         cantidad: null,
//         comentarios: '',
//         unit: null,
//         unidades: selectedResult.unidades,
//         stocks: selectedResult.stock

//     }]);

//}

  const addResult = async () => {
    let warning;
    if(selectedIds != null) {
      if(selectedResult) {
        const filter = selectedResult.stock?.filter((x: any) => x.id == selectedIds.store.id);
        if(filter.length <= 0) {
          toast.warning('El articulo que agregaste no tiene alamcen')
          warning = true
        } else {
          warning = false
        }
      
        // selectedResult.id_articulo = selectedResult.id
        // selectedResult.cantidad = null
        // selectedResult.comentarios = ''
        // selectedResult.unidad = null
        // selectedResult.pedido_almacen_concepto_id = null
        // selectedResult.storeWarning = warning
        
        setConcepts([...concepts, {
          id_articulo: selectedResult.id,
          nameArticle: `${selectedResult.codigo}-${selectedResult.descripcion}`,
          cantidad: 0,
          comentarios: '',
          unidad: selectedResult.unidades[0].id_unidad,
          unidades: selectedResult.unidades,
          stock: selectedResult.stock,
          almacen_predeterminado: selectedResult.almacen_predeterminado,
          pedido_almacen_concepto_id: 0,
          storeWarning: warning
        }
      ]);
      }
    } else {
      Swal.fire('Notificacion', 'Selecciona un almacen para dar salida', 'warning')
    }

 

  }



  useEffect(() => {
    
  }, [concepts])

  return (
    <div className='direct-warehouse-exit'>

        <div className='row__one'>
            <div className='select__container'>
                <label className='label__general'>Buscar por</label>
                <div className='select-btn__general'>
                    <div className={`select-btn ${selectSearchBy ? 'active' : ''}`} onClick={openselectSearchBy}>
                        <div className='select__container_title'>
                            <p>{selectedSearchBy ? typesSerachBy.find((s: {id: number}) => s.id === selectedSearchBy)?.name : 'Selecciona'}</p>
                        </div>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                    </div>
                    <div className={`content ${selectSearchBy ? 'active' : ''}`} >
                        <ul className={`options ${selectSearchBy ? 'active' : ''}`} style={{ opacity: selectSearchBy ? '1' : '0' }}>
                        {typesSerachBy && typesSerachBy.map((x: any) => (
                            <li key={x.id} onClick={() => handleSearchByChange(x)}>
                                {x.name}
                            </li>
                        ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="comments">
                <label className='label__general'>Buscador</label>
                <input className='inputs__general' type='text' value={inputSearch} onChange={(e) => setInputSearch(e.target.value)} placeholder='Ingresa el código/nombre' />
            </div>
            <div>
              <button type='button' className='btn__general-purple' onClick={search}>Buscar</button>
            </div>
        </div>
        <div className='row__two'>
            <div className='select__container'>
                <label className='label__general'>Resultado</label>
                <div className='select-btn__general'>
                    <div className={`select-btn ${selectResult ? 'active' : ''}`} onClick={openselectResult}>
                        <div className='select__container_title'>
                        <p>
                            {selectedResult
                                ? result.find((s: any) => s.id === selectedResult.id)?.codigo + '-' + result.find((s: any) => s.id === selectedResult.id)?.descripcion
                                : 'Selecciona'}
                        </p>                        </div>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                    </div>
                    <div className={`content ${selectResult ? 'active' : ''}`} >
                        <ul className={`options ${selectResult ? 'active' : ''}`} style={{ opacity: selectResult ? '1' : '0' }}>
                        {result && result.map((x: any) => (
                            <li key={x.id} onClick={() => handleResultChange(x)}>
                                {`${x.codigo}-${x.descripcion}`}
                            </li>
                        ))}
                        </ul>
                    </div>
                </div>
            </div>
          
            <div>
                <button type='button' className='btn__general-purple' onClick={addResult}>Agregar</button>
            </div>
        </div>
        
    </div>
  )
}

export default Direct
