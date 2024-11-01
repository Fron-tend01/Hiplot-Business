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
console.log(dataTransfer)
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


const getPDF = async () => {
  await APIs.getStorePDF({id: dataTransfer.id})
  window.open(`https://hiplotbusiness.com/api_dev/pdf_traspaso/${dataTransfer.id}`, '_blank');
}

console.log(dataTransfer)


  return (
    <div className={`overlay__transfers ${modalStateSee == 'see' ? 'active' : ''}`}>
      <div className={`popup__transfers ${modalStateSee == 'see' ? 'active' : ''}`}>
        <a href="#" className="btn-cerrar-popup__transfers" onClick={modalClose}>
          <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
        </a>
        <p className='title__modals'>Traspasos</p>
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
                <p className='text'>Total de conceptos</p>
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
              {dataTransfer.conceptos?.length > 0 ? (
                <div className='container__branchOffice_table-modal'>
                  {dataTransfer.conceptos.map((concept: any,  index: any) => (
                    <div className='tbody' key={index}>
                      <p>{concept.codigo}-{concept.descripcion}</p>
                      <div>
                        <p>{concept.cantidad}</p>
                      </div>
                      <div>
                        <p>{concept.unidad}</p>
                      </div>
                      <div>
                        <p>{concept.comentarios}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text'>Sin sucursales agregadas</p>
              )}
            </div>
          </div>
          <div className='d-flex mt-4'>
            <button className='btn__general-orange' type='button' onClick={getPDF}>PDF</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalSee
