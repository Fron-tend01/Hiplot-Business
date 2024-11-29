import React, { useEffect, useState } from 'react'
import ModalCreate from './ranges/ModalCreate'
import { storeModals } from '../../../../zustand/Modals'
import './styles/Ranges.css'
import APIs from '../../../../services/services/APIs'
import DynamicVariables from '../../../../utils/DynamicVariables'
const Ranges: React.FC = () => {

  const setModal = storeModals(state => state.setModal)
  const [ranges, setRanges] = useState<any>([])
  const [rangoSel, setRangoSel] = useState<any>({})
  const [modoUpdate, setModoUpdate] = useState<boolean>(false)
  const [searcher, setSearcher] = useState<any>({
    titulo: ''
  })
  const fetch = async () => {
    const result = await APIs.CreateAny(searcher, "rangos_get")
    setRanges(result)
  }
  const fetch2 = async () => {
    const result = await APIs.CreateAny(searcher , "rangos_get")
    setRanges(result)
  }
  useEffect(() => {
    fetch()
  }, [])

  const modal = () => {
    setModoUpdate(false)
    setModal('ranges_modals')
  }
  const modalUpdate = (data:any) => {
    setModoUpdate(true)
    setRangoSel(data)
    setModal('ranges_modals')
  }
  return (
    <div className='ranges'>
      <div className='rages__container'>
        <div className='btns__create'>
          <button className='btn__general-purple' onClick={modal}>Craer rangos</button>
        </div>
        <div className=''>
          <label className='label__general'>Buscar:</label>
          <input className='inputs__general' type="text" placeholder='Ingresa un titulo a buscar y presiona enter...'
            value={searcher.nombre} onChange={(e) => DynamicVariables.updateAnyVar(setSearcher, "titulo", e.target.value)}
            onKeyUp={(event) => event.key === 'Enter' && fetch()} />
        </div>
        <ModalCreate data_upd={rangoSel} modoUpdate={modoUpdate} setModoUpdate={setModoUpdate} fetch2={fetch2}/>
        <div className='table__ranges' >
          <div>
            <div>
              {ranges ? (
                <div>
                  <p className='text'>Tus Rangos {ranges.length}</p>
                </div>
              ) : (
                <p className='text'>No hay Rangos</p>
              )}
            </div>
            <div className='table__head'>
              <div className='thead'>
                <div className='th'>
                  <p className=''>Titulo Rango</p>
                </div>

              </div>
            </div>
            {ranges?.length > 0 ? (
              <div className='table__body'>
                {ranges.map((ranger: any, index:number) => (
                  <div className='tbody__container' key={index}>
                    <div className='tbody'>
                      <div className='td'>
                        {ranger.titulo}
                      </div>
                      <div className='td'>
                        <button className='branchoffice__edit_btn' onClick={()=>modalUpdate(ranger)}>Editar</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text'>No hay Rangos que cargar</p>
            )}
          </div>
        </div>


        
      </div>
    </div>
  )
}

export default Ranges
