import React, { useState } from 'react'
import { suppliersRequests } from '../../../../../../fuctions/Suppliers'
import { articleRequests } from '../../../../../../fuctions/Articles'
import useUserStore from '../../../../../../zustand/General'
import { storeRequisitions } from '../../../../../../zustand/Requisition'
import { useStore } from 'zustand';
import './styles/Differential.css';
import {toast } from 'sonner'

const Differential: React.FC = () => {
  const userState = useUserStore(state => state.user);
  let user_id = userState.id

  const {selectedBranchOffice,concepts}: any = useStore(storeRequisitions);
  const setConcepts = storeRequisitions((state: any) => state.setConcepts);

  const { getSuppliers }: any = suppliersRequests()
  const { getArticlesDifferential }: any = articleRequests()
  
  const [selectSuppliers, setSelectSuppliers] = useState<boolean>(false)
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null)
  const [inputSuppliers, setInputSuppliers] =  useState<any>('')


  const openSelectSuppliers = () => {
    setSelectSuppliers(!selectSuppliers)
  }

  const handleSuppliersChange = (search: any) => {
    setSelectedSupplier(search.id)
    setSelectSuppliers(false)
  }


  const [result, setResult] = useState<any>()

  const searchSuppliers = async () => {
    
    let data = {
      nombre: inputSuppliers,
      is_flete: true,
      id_usuario: user_id
    }

    let resultSuppliers = await getSuppliers(data)
    setResult(resultSuppliers)
  }

  
  const searchFamilies = async () => {
    
    let data = {
      nombre: inputSuppliers,
      is_flete: true,
      id_usuario: user_id
    }

    let result = await getSuppliers(data)
    setResult(result)
  }



  const addArticle = async () => {
    let data = {
      id_proveedor: result[0].id,
      id_sucursal: selectedBranchOffice,
      id_usuario: user_id
    }

    if(selectedBranchOffice == null) {
      toast.warning('Tienes que selecionar una sucursal')
      return
    } 

    let resultArticle = await getArticlesDifferential(data)
    console.log(resultArticle)
  
    let max;
    if (resultArticle[0].max_mins.find((x:any)=> x.id_sucursal == selectedBranchOffice)) {
      console.log('Si tiene la  sucursal')
      let mm_tmp = resultArticle[0].max_mins.filter((x:any)=> x.id_sucursal == x.id_sucursal)
      resultArticle[0].max_min = mm_tmp[0].maximo + ' - ' + mm_tmp[0].minimo
      max = mm_tmp[0].maximo + ' - ' + mm_tmp[0].minimo
    } else {
      max = resultArticle[0].max_min = 'N/A'
    }

    let unidad = resultArticle[0].unidades.filter((x: any) => x.unidad_almacen === true);


    let dataAticle = {
      id_articulo: resultArticle[0].id,
      codigo: resultArticle[0].codigo,
      descripcion: resultArticle[0].descripcion,
      type: 'differential',
      max_min: max,
      cantidad: resultArticle[0].cantidad,
      unidad: unidad[0].nombre,
      comentarios: ''
    }
    setConcepts([...concepts, dataAticle]);
    console.log(concepts)

    
  }


  const [nameBy, setNameBy] = useState<string | number>('')
  return (
    <div className='differential'>
     
      <div className='row__one'>
        <div className='search_suppliers'>
          <div>
            <label className='label__general'>Buscador por proveedor</label>
            <input className='inputs__general' type='text' value={inputSuppliers} onChange={(e) => setInputSuppliers(e.target.value)} placeholder='Ingresa el proveedor' />
          </div>
          <div>
            <button className='btn__general-purple' type='button' onClick={searchSuppliers}>Buscar</button>
          </div>
        </div>
        <div className='search_suppliers'>
          <div>
            <label className='label__general'>Buscador por familia</label>
            <input className='inputs__general' type='text' value={nameBy} onChange={(e) => setNameBy(e.target.value)} placeholder='Ingresa la familia' />
          </div>
          <div>
            <button className='btn__general-purple' type='button' onClick={searchFamilies}>Buscar</button>
          </div>
          
        </div>
      </div>
      <div className='row__two'>
        <div className='select__container'>
          <label className='label__general'>Resultado</label>
          <div className='select-btn__general'>
            <div className={`select-btn ${selectSuppliers ? 'active' : ''}`} onClick={openSelectSuppliers} >
              <p>{selectedSupplier !== null ? result?.find((s: {id: number}) => s.id === selectedSupplier)?.nombre_comercial: 'selecciona'}</p>
              <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg"  height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
            </div>
            <div className={`content ${selectSuppliers ? 'active' : ''}`} >
              <ul className={`options ${selectSuppliers ? 'active' : ''}`} style={{ opacity: selectSuppliers ? '1' : '0' }}>
                {result?.map((search: any) => (
                  <li key={search.id} onClick={() => handleSuppliersChange(search)}>
                    {search.nombre_comercial}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div>
          <button className='btn__general-purple' type='button' onClick={addArticle}>Agregar</button>
        </div>
      </div>
    </div>
  )
}

export default Differential
