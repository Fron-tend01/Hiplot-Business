import React, { useEffect, useState } from 'react'
import useUserStore from '../../../../../zustand/General'
import { storeRequisitions } from '../../../../../zustand/Requisition'
import { useStore } from 'zustand';
import Normal from './types/Normal'
import Differential from './types/Differential';
import { Toaster } from 'sonner'
import { RequisitionRequests } from '../../../../../fuctions/Requisition'
import APIs from '../../../../../services/services/APIs';
import Swal from 'sweetalert2';
import './ModalUpdate.css'

const ModalUpdate: React.FC = () => {
  const userState = useUserStore(state => state.user);
  let user_id = userState.id

  const setConcepts = storeRequisitions((state: any) => state.setConcepts);

  const setModalStateUpdate = storeRequisitions((state: any) => state.setModalStateUpdate);
  const { modalStateUpdate, concepts, updateToRequisition }: any = useStore(storeRequisitions);
  const { }: any = RequisitionRequests();

  useEffect(() => {
    if (updateToRequisition) {
      for (let i = 0; updateToRequisition.conceptos.lenght > i; i++) {
        let maxmin = updateToRequisition.conceptos[i]
        let filter = maxmin.max_mins.filter((x: any) => x.id_sucursal == updateToRequisition.id_sucursal)
        if (filter) {

        }
      }

      setSelectedOption(updateToRequisition.tipo)
      setComments(updateToRequisition.comentarios)
      setConcepts(updateToRequisition.conceptos)
      setTitle(updateToRequisition.titulo)

    }
  }, [updateToRequisition])

  const [selectedOption, setSelectedOption] = useState<any>(0);

  const modalCloseCreate = () => {
    setModalStateUpdate('')
    setConcepts([])
  }


  console.log(updateToRequisition)


  const [title, setTitle] = useState<string>('')

  const [comments, setComments] = useState<string>('')



  // const deleteResult = (itemId: number) => {
  //   const updatedNewRequisition = newRequisition.filter((item: any) => item !== itemId);
  //   setNewRequisition(updatedNewRequisition);
  // };



  const [selectedUnit, setSelectedUnit] = useState<string[]>([]);

  const handleUnits = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const valueUnit = event.target.value;
    console.log(valueUnit)
    concepts[index].unidad = parseInt(valueUnit, 10);
    // Crear una copia del arreglo de selecciones temporales
    const newSelected = [...selectedUnit];
    // Actualizar el valor seleccionado en la posición del índice correspondiente
    newSelected[index] = valueUnit;
    // Actualizar el estado con las nuevas selecciones
    setSelectedUnit(newSelected);
  };




  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.trim();
    const newArticleStates = [...concepts];
    newArticleStates[index].cantidad = value === '' ? null : parseFloat(value);
    setConcepts(newArticleStates);
  };

  const handleComentariosChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    const newArticleStates = [...concepts];
    newArticleStates[index].comentarios = value;
    setConcepts(newArticleStates);
  };

  const [deleteConcepts, setDeleteConcepts] = useState<any>([])
  console.log(deleteConcepts)

  const handleCreateRequisition = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // let art_tmp = articles.filter((x:any)=>x.id == selectedResult)

    let data = {
      id: updateToRequisition.id,
      id_usuario_crea: user_id,
      status: updateToRequisition.status,
      tipo: updateToRequisition.tipo,
      titulo: title,
      comentarios: comments,
      // documentoAnterior: "",
      // documentoSiguiente: "",
      conceptos: concepts,
      conceptos_elim: deleteConcepts
    }




    try {

      let result: any = await APIs.updateRequisition(data)
      if (result.error == true) {
        Swal.fire('advertencia', result.mensaje, 'warning');
      } {
        Swal.fire(result.mensaje, '', 'success');
      }

    } catch {
      Swal.fire('No se pudo actualizar la requisicion', '', 'error');
    }

  }




  const deleteConcept = (item: any) => {
    const itemDelete = concepts.filter((x: number) => x !== item);
    setConcepts(itemDelete);
    setDeleteConcepts([...deleteConcepts, item.id])

  };



  return (
    <div className={`overlay__requisition ${modalStateUpdate == 'update' ? 'active' : ''}`}>
      <Toaster expand={true} position="top-right" richColors />
      <div className={`popup__requisition ${modalStateUpdate == 'update' ? 'active' : ''}`}>
        <a href="#" className="btn-cerrar-popup__requisition" onClick={modalCloseCreate}>
          <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
        </a>
        <p className='title__modals'>Crear nueva requisición</p>
        <form className='conatiner__update_requisition' onSubmit={handleCreateRequisition}>
          <div className='row__one'>
            <div className='container__checkbox_requisition'>
              <div className='checkbox__requisition'>
                <label className="checkbox__container_general">
                  <input
                    className='checkbox'
                    type="radio"
                    value="normal"
                    checked={updateToRequisition.tipo == 0}
                    readOnly
                  />
                  <span className="checkmark__general"></span>
                </label>
                <p className='text'>Normal</p>
              </div>
              <div className='checkbox__requisition'>
                <label className="checkbox__container_general">
                  <input
                    className='checkbox'
                    type="radio"
                    value="diferencial"
                    checked={updateToRequisition.tipo == 1}
                    readOnly
                  />
                  <span className="checkmark__general"></span>
                </label>
                <p className='text'>Diferencial</p>
              </div>
            </div>
          </div>

          <div className='row__two'>
            <div>
              <label className="label__general">Folio</label>
              <div className='container__text_result'>
                <p className='text__result'>{updateToRequisition.folio}</p>
              </div>
            </div>
            <div>
              <label className="label__general">Serie</label>
              <div className='container__text_result'>
                <p className='text__result'>{updateToRequisition.serie}</p>
              </div>
            </div>
            <div>
              <label className="label__general">Fecha de creación</label>
              <div className='container__text_result'>
                <p className='text__result'>{updateToRequisition.fecha_creacion}</p>
              </div>
            </div>
            <div>
              <label className="label__general">Empresa</label>
              <div className='container__text_result'>
                <p className='text__result'>{updateToRequisition.empresa}</p>
              </div>
            </div>
            <div>
              <label className="label__general">Sucursal</label>
              <div className='container__text_result'>
                <p className='text__result'>{updateToRequisition.sucursal}</p>
              </div>
            </div>
            <div>
              <label className="label__general">Area</label>
              <div className='container__text_result'>
                <p className='text__result'>{updateToRequisition.area}</p>
              </div>
            </div>
            <div>
              <label className='label__general'>Título</label>
              <input className='inputs__general' type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Ingresa el título' />
            </div>
            <div className='container__textarea_general'>
              <div className='textarea__container'>
                <label className='label__general'>Comentario</label>
                {/* <div className='warning__general' style={styleWarningNombre}><small >Este campo es obligatorio</small></div> */}
                <textarea className={`textarea__general`} value={comments} onChange={(e) => setComments(e.target.value)} placeholder='Comentarios' />
              </div>
            </div>
          </div>
          <div className='row__three'>
            {selectedOption == 0 ?
              <Normal />
              :
              <Differential />
            }
          </div>
          <div className='table__requisiciones' >
            <div>
              <div>
                {concepts ? (
                  <div className='table__numbers'>
                    <p className='text'>Tus ordenes de compras</p>
                    <div className='quantities_tables'>{concepts?.length}</div>
                  </div>
                ) : (
                  <p className='text'>No hay empresas</p>
                )}
              </div>
              <div className='table__head'>
                <div className='thead'>
                  <div className='th'>
                    <p className=''>Código</p>
                  </div>
                  <div className='th'>
                    <p className=''>Descripción</p>
                  </div>
                  <div className='th'>
                    <p className=''>Cantidad</p>
                  </div>
                  <div className='th'>
                    <p className=''>Unidad</p>
                  </div>
                  <div className='th'>
                    <p className=''>Max</p>
                  </div>
                  <div className='th'>
                    <p className=''>Coment</p>
                  </div>

                </div>
              </div>
              {concepts ? (
                <div className='table__body'>
                  {concepts.map((article: any, index: any) => (
                    <div className='tbody__container' key={index}>
                      <div className='tbody'>
                        <div className='td'>
                          {article.codigo}
                        </div>
                        <div className='td'>
                          {article.descripcion}
                        </div>
                        <div className='td'>
                          <div>
                            <input className='inputs__general' value={article.cantidad} onChange={(e) => handleAmountChange(e, index)} type="number" placeholder='Cantidad' />
                          </div>
                        </div>
                        <div className='td'>
                          {article.type == 'differential' ?
                            <p>{article.unidad}</p>
                            :
                            <div>
                              <select className='traditional__selector' onChange={(event) => handleUnits(event, index)} value={selectedUnit[index] || ''}>
                                {article.unidades && article.unidades.map((item: any) => (
                                  <option key={item.id} value={item.id_unidad}>
                                    {item.nombre}
                                  </option>
                                ))}
                              </select>
                            </div>
                          }
                        </div>
                        <div className='td'>
                          {(() => {
                            let item = article.max_mins.find((x: any) => x.id_sucursal == updateToRequisition.id_sucursal);
                            if (item) {
                              return <p>{item.minimo}-{item.maximo}</p>;
                            } else {
                              return <p>N/A</p>;
                            }
                          })()
                          }
                        </div>
                        <div className='td'>
                          <div>
                            <input className='inputs__general' value={article.comentarios === '' ? '' : article.comentarios} onChange={(e) => handleComentariosChange(e, index)} type="text" placeholder='Comentarios' />
                          </div>
                        </div>
                        <div className='td delete'>
                          <button className='btn__delete_users' type='button' onClick={() => deleteConcept(article)}>Eliminar</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text'>Cargando datos...</p>
              )}
            </div>
          </div>
          <div className='row__four'>
            <button className='btn__general-purple'>PDF</button>
            <button className='btn__general-purple' type='submit'>Crear nueva requisición</button>
            <button className='btn__general-danger'>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalUpdate
