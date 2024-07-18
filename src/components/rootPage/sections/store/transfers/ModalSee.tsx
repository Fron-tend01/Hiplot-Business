import React, { useEffect, useState } from 'react'
import useUserStore from '../../../../../zustand/General';
import { useStore } from 'zustand';
import './ModalCreate.css'
import { storeTransfers } from '../../../../../zustand/Transfers';
import APIs from '../../../../../services/services/APIs';
import Swal from 'sweetalert2';

const ModalSee: React.FC = () => {
  const userState = useUserStore(state => state.user);
  let user_id = userState.id

  const setModalStateSee = storeTransfers((state: any) => state.setModalStateSee);
  const { modalStateSee, dataTransfer }: any = useStore(storeTransfers);


  const [selectedBranchOffice, setSelectedBranchOffice] = useState<any>(null);

  console.log(dataTransfer)

  const [selectStore, setSelectStore] = useState<boolean>(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);

  const [selectedBranchOfficeTwo, setSelectedBranchOfficeTwo] = useState<any>(null);

  const [selectedStoreTwo, setSelectedStoreTwo] = useState<any>(null);

  const [comments, setComments] = useState<any>()




  useEffect(() => {

  }, [dataTransfer]);


 


  const modalClose = () => {
    setModalStateSee('')
  }

  const [concepts, setConcepts] = useState<any>([])


  console.log(modalStateSee)


const modalCreateTrnasfers = async () => {
  let data = {
    id_usuario_crea: user_id,
    id_sucursal: selectedBranchOffice.id,
    id_almacen_origen: selectedStore.id,
    id_sucursal_origen: selectedBranchOffice.id,
    id_sucursal_destino: selectedBranchOfficeTwo.id,
    id_almacen_destino: selectedStoreTwo.id,
    comentarios: comments,
    conceptos: concepts
  };

  try {
    let result: any = await APIs.createTransfers(data)
    if(result.error == true) {
      Swal.fire('Advertencia', result.mensaje, 'warning');
    } else {
      Swal.fire(result.mensaje, '', 'success');
    }
    
  } catch (error) {
    Swal.fire('Error al actualizar el porveedor', '', 'error');
  }
 
}

const [modalSeeStocks, setModalSeeStocks] = useState<boolean[]>([]);

const [setModalIndex] = useState<any>(false);

const seeStock = (x: any, index: any) => {
  setModalSeeStocks((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
  });
  setModalIndex(index);
  console.log(x)
};

const closeModalSeeStocks = (index: any) => {
    
};


  return (
    <div className={`overlay__transfers ${modalStateSee == 'see' ? 'active' : ''}`}>
      <div className={`popup__transfers ${modalStateSee == 'see' ? 'active' : ''}`}>
        <a href="#" className="btn-cerrar-popup__transfers" onClick={modalClose}>
          <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
        </a>
        <p className='title__modals'>Crear nuevo traspaso</p>
        <form className='container__create_transfers' onSubmit={modalCreateTrnasfers}>
          <div className='row__one'>
            <div>
                <label className="label__general">Empresa</label>
                <div className='container__text_result'>
                    <p className='text__result'>{dataTransfer.empresa}</p>
                </div>
            </div>
            <div>
                <label className="label__general">Sucursal de salida</label>
                <div className='container__text_result'>
                    <p className='text__result'>{dataTransfer.sucursal_origen}</p>
                </div>
            </div>
            <div>
                <label className="label__general">Almacen de salida</label>
                <div className='container__text_result'>
                    <p className='text__result'>{dataTransfer.almacen_origen}</p>
                </div>
            </div>
           
            <div>
                <label className="label__general">Empresa</label>
                <div className='container__text_result'>
                    <p className='text__result'>{dataTransfer.empresa_destino}</p>
                </div>
            </div>
            <div>
                <label className="label__general">Sucursal a la que se movio</label>
                <div className='container__text_result'>
                    <p className='text__result'>{dataTransfer.sucursal_destino}</p>
                </div>
            </div>
            <div>
                <label className="label__general">Sucursal a la que se movio</label>
                <div className='container__text_result'>
                    <p className='text__result'>{dataTransfer.almacen_destino}</p>
                </div>
            </div>
           
          </div>
          <div className='row__four'>
            <div>
                <label className="label__general">Almacen a la que se movio</label>
                <div className='container__text_result'>
                    <p className='text__result'>{dataTransfer.almacen_destino}</p>
                </div>
            </div>
          </div>
          <div className='row__two'>
           
          
          </div>
       
          <div className='conatiner__table_transers'>
            <div className='table__modal_transfers'>
              <div className='table__numbers'>
                <p className='text'>Total de sucursales</p>
                <div className='quantities_tables'>{concepts && concepts.length}</div>
              </div>
              <div className='table__head'>
                <div className='thead'>
                  <div className='th'>
                    <p className='table__store_title'>Nombre</p>
                  </div>
                  <div className='th'>
                    <p className='table__store_title'>Cantidad</p>
                  </div>
                  <div className='th'>
                    <p className='table__store_title'>Unidad</p>
                  </div>
                  <div className='th'>
                    <p className='table__store_title'>Comentarios</p> 
                  </div>
                </div>
              </div>
              {dataTransfer.concepts?.length > 0 ? (
                <div className='container__branchOffice_table-modal'>
                  {dataTransfer.conceptos.map((concept: any,  index: any) => (
                    <div className='tbody' key={index}>
                      <p>{concept.nombre}</p>
                      <div>
                        <p></p>
                      </div>
                      <div>
                        <p></p>
                      </div>
                      <div>
                        <p></p>
                      </div>
                      <button className='btn__general-purple' type='button' onClick={() => seeStock(concept, index)}>conceptos</button>
                      <button className='btn__general-danger'>Eliminar</button>
                      <div className={`overlay__modal_transfers-concepts_see-stock ${modalSeeStocks[index] ? 'active' : ''}`}>
                          <div className={`popup__modal_transfers-concepts_see-stock ${modalSeeStocks[index] ? 'active' : ''}`}>
                              <a href="#" className="btn-cerrar-popup__modal_transfers-concepts_see-stock" onClick={() => closeModalSeeStocks(index)}>
                                  <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                              </a>
                              <div className='container__modal_transfers-concepts_see-stock'>
                             
                                      <div className='table__modal_transfers-concepts_see-stock'>
                                          <div>
                                              {concept.stocks ? (
                                              <div className='table__numbers'>
                                                  <p className='text'>Total de stocks</p>
                                                  <div className='quantities_tables'>{concept.stocks && concept.stocks.length}</div>
                                              </div>
                                              ) : (
                                              <p className='text'>No hay stock</p>
                                              )}
                                          </div>
                                          {concept.storeWarning ?
                                          <div className='store-warning'>
                                              <svg xmlns="http://www.w3.org/2000/svg" width='20' fill='#D9D9D9' viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                              <p>Este articulo no sele asingno almacen</p>
                                          </div>
                                          :
                                          ''}
                                          <div className='table__head'>
                                              
                                              <div className='thead'>
                                              <div className='th'>
                                                  <p className=''>Nombre</p>
                                              </div>
                                              <div className='th'>
                                                  <p className=''>Cantidad de stocks</p>
                                              </div>
                                              
                                              </div>
                                          </div>
                                          {concept.stocks && concept.stocks.length > 0 ? (
                                              <div className='table__body'>
                                              {concept.stocks && concept.stocks.map((x: any, index: any) => (
                                                  <div className='tbody__container' key={index}>
                                                  <div className='tbody'>
                                                      <div className='td'>
                                                          {x.nombre}
                                                      </div>
                                                      <div className='td'>
                                                          {x.stock}
                                                      </div>
                                                      <div className='td'>
                                                          {x.cantidad}
                                                      </div>
                                                      <div className='td'>
                                                          {x.descripcion}
                                                      </div>
                                                      
                                                  </div>
                                                  
                                              </div>
                                              ))}
                                          </div>
                                          ) : (
                                              <p className='text'>No hay conceptos</p>
                                          )}
                                      </div>
                                  </div>
                         
                          </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text'>Sin sucursales agregadas</p>
              )}
            </div>
            <div className='container__btn_create-store'>
              <button className='btn__general-purple' type='submit' >Reaizar traspaso</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalSee
