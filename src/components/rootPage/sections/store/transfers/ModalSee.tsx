import React, { useEffect, useState } from 'react'
// import useUserStore from '../../../../../zustand/General';
import { useStore } from 'zustand';
import './ModalCreate.css'
import { storeTransfers } from '../../../../../zustand/Transfers';
import APIs from '../../../../../services/services/APIs';
// import Swal from 'sweetalert2';

const ModalSee: React.FC = () => {
  // const userState = useUserStore(state => state.user);
  // let user_id = userState.id

  const setModalStateSee = storeTransfers((state: any) => state.setModalStateSee);
  const { modalStateSee, dataTransfer }: any = useStore(storeTransfers);


  // const [selectedBranchOffice, setSelectedBranchOffice] = useState<any>(null);

  // const [selectStore, setSelectStore] = useState<boolean>(false);
  // const [selectedStore, setSelectedStore] = useState<any>(null);

  // const [selectedBranchOfficeTwo, setSelectedBranchOfficeTwo] = useState<any>(null);

  // const [selectedStoreTwo, setSelectedStoreTwo] = useState<any>(null);

  // const [comments, setComments] = useState<any>()




  useEffect(() => {

  }, [dataTransfer]);





  const modalClose = () => {
    setModalStateSee('')
  }

  const [concepts] = useState<any>([])


  console.log(modalStateSee)


  // const modalCreateTrnasfers = async () => {
  //   let data = {
  //     id_usuario_crea: user_id,
  //     id_sucursal: selectedBranchOffice.id,
  //     id_almacen_origen: selectedStore.id,
  //     id_sucursal_origen: selectedBranchOffice.id,
  //     id_sucursal_destino: selectedBranchOfficeTwo.id,
  //     id_almacen_destino: selectedStoreTwo.id,
  //     comentarios: comments,
  //     conceptos: concepts
  //   };

  //   try {
  //     let result: any = await APIs.createTransfers(data)
  //     if (result.error == true) {
  //       Swal.fire('Advertencia', result.mensaje, 'warning');
  //     } else {
  //       Swal.fire(result.mensaje, '', 'success');
  //     }

  //   } catch (error) {
  //     Swal.fire('Error al actualizar el porveedor', '', 'error');
  //   }

  // }



  const getPDF = async () => {
    await APIs.getStorePDF({ id: dataTransfer.id })
    window.open(`https://hiplotbusiness.com/api_dev/pdf_traspaso/${dataTransfer.id}`, '_blank');
  }

  console.log(dataTransfer)


  return (
    <div className={`overlay__modal_transfers-concepts_see-stock ${modalStateSee == 'see' ? 'active' : ''}`}>
      <div className={`popup__modal_transfers-concepts_see-stock ${modalStateSee == 'see' ? 'active' : ''}`}>
        <a href="#" className="btn-cerrar-popup__modal_transfers-concepts_see-stock" onClick={modalClose}>
          <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
        </a>
        <p className='title__modals'>Traspasos</p>
        <form className='container__create_transfers'>
          <div className="card ">
            <div className="card-body bg-standar">
              <h3 className="text">{dataTransfer.serie}-{dataTransfer.folio}-{dataTransfer.anio}</h3>
              <hr />
              <div className='row'>
                <div className='col-6 md-col-12'>
                <span className='text'>Empresa Origen: <b>{dataTransfer.empresa}</b></span><br />
                <span className='text'>Sucursal Origen: <b>{dataTransfer.sucursal_origen}</b></span><br />
                <span className='text'>Almacen Origen: <b>{dataTransfer.almacen_origen}</b></span><br />
                <span className='text'>Salida Generada: <b>{dataTransfer.salidas_gen?.[0].serie}-{dataTransfer.salidas_gen?.[0].folio}-{dataTransfer.salidas_gen?.[0].anio}</b></span><br />
                  <span className='text'>Creado por: <b>{dataTransfer.usuario_crea}</b></span><br />
                  <span className='text'>Fecha de Creación: <b>{dataTransfer.fecha_creacion}</b></span><br />
                  {/* {dataTransfer.status === 0 ? (
                    <span className="active-status">Activo</span>
                  ) : dataTransfer.status === 1 ? (
                    <span className="canceled-status">Cancelada</span>
                  ) : (
                    dataTransfer.status === 2 ? (
                      <span className="end-status">Terminado</span>
                    ) : (
                      ""
                    )
                  )} */}

                </div>
                <div className='col-6 md-col-12'>
                <span className='text'>Empresa Destino: <b>{dataTransfer.empresa_destino}</b></span><br />
                <span className='text'>Sucursal Destino: <b>{dataTransfer.sucursal_destino}</b></span><br />
                <span className='text'>Almacen Destino: <b>{dataTransfer.almacen_destino}</b></span><br />
                <span className='text'>Entrada Generada: <b>{dataTransfer.entradas_gen?.[0].serie}-{dataTransfer.entradas_gen?.[0].folio}-{dataTransfer.entradas_gen?.[0].anio}</b></span><br />
                </div>
              </div>
              <div className='row'>
                <div className='col-12'>
                  <span className='text'>Comentarios: {dataTransfer.comentarios}</span>

                </div>
              </div>
            </div>
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
                  {dataTransfer.conceptos.map((concept: any, index: any) => (
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
