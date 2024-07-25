import React, { useEffect, useState } from 'react'
import ModalCreate from './ranges/ModalCreate'
import { storeModals } from '../../../../zustand/Modals'
import { RangesRequests } from '../../../../fuctions/Ranges'
import  './styles/Ranges.css'


const Ranges: React.FC = () => {

  const {getRanges}: any = RangesRequests()
  const setModal = storeModals(state => state.setModal)
  const [ranges, setRanges] = useState<any>([])

  const fetch = async () => {
    let result = await getRanges()
    setRanges(result)
  }

  useEffect(() => {
    fetch()
  }, [])

  const modal = () => {
    setModal('ranges_modals')
  }

  const deleteUser = () => {

  }

  return (
    <div  className='ranges'>
      <div className='rages__container'>
        <div className='row__one'>
          <button className='btn__general-purple' onClick={modal}>Craer rangos</button>
        </div>
        <ModalCreate />
        <div className='table__ranges' >
          <div>
            <div>
              {ranges ? (
                <div>
                  <p className='text'>Tus empresas {ranges.length}</p>
                </div>
              ) : (
                <p className='text'>No hay empresas</p>
              )}
            </div>
            <div className='table__head'>
              <div className='thead'>
                <div className='th'>
                  <p className=''>Empresa</p>
                </div>
                
              </div>
            </div>
            {ranges.length > 0 ? (
              <div className='table__body'>
                {ranges.map((ranger: any) => (
                    <div className='tbody__container' key={ranger.id}>
                      <div className='tbody'>
                        <div className='td'>
                          {/* {companiesXUsers.find((user: any) => user.id === user_id)?.razon_social} */}
                        </div>
                        <div className='td'>
                          <button className='btn__delete_users' onClick={() => deleteUser(ranger)}>Eliminar</button>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            ) : (
              <p className='text'>No hay empresas que cargar</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ranges
