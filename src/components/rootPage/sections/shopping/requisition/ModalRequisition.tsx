import React, { useEffect, useState } from 'react'
import { companiesRequests } from '../../../../../fuctions/Companies'
import { BranchOfficesRequests } from '../../../../../fuctions/BranchOffices'
import { areasRequests } from '../../../../../fuctions/Areas'
import useUserStore from '../../../../../zustand/General'
import { storeRequisitions } from '../../../../../zustand/Requisition'
import { useStore } from 'zustand';
import Normal from './types/Normal'
import Differential from './types/Differential';
import { Toaster } from 'sonner'
import { RequisitionRequests } from '../../../../../fuctions/Requisition'
import APIs from '../../../../../services/services/APIs'
import Swal from 'sweetalert2';
import './ModalRequisition.css'

const ModalRequisition: React.FC = () => {
  const userState = useUserStore(state => state.user);
  const user_id = userState.id

  /////////////// Requisiciones /////////////////////////////
  const setUpdateToRequisition = storeRequisitions((state: any) => state.setUpdateToRequisition);

  const setConcepts = storeRequisitions((state: any) => state.setConcepts);

  const { dataGet }: any = useStore(storeRequisitions);

  const setRequisitions = storeRequisitions((state: any) => state.setRequisitions);

  const { dates }: any = useStore(storeRequisitions);


  const { getRequisition }: any = RequisitionRequests();

  const setModalStateCreate = storeRequisitions((state: any) => state.setModalStateCreate);
  const setSelectedBranchOffice = storeRequisitions((state: any) => state.setSelectedBranchOffice);

  const { modalStateCreate, selectedBranchOffice, concepts, updateToRequisition }: any = useStore(storeRequisitions);
  const { createRequisition }: any = RequisitionRequests();
  // console.log('updateToRequisition', updateToRequisition)

  const { getCompaniesXUsers }: any = companiesRequests()
  const [companies, setCompanies] = useState<any>()

  const { getBranchOffices }: any = BranchOfficesRequests()
  const [branchOffices, setBranchOffices] = useState<any>()

  const { getAreas }: any = areasRequests()

  const [areas, setAreas] = useState<any>()
  const [title, setTitle] = useState<string>('')
  const [comments, setComments] = useState<string>('')

  const [stateLoading, setStateLoading] = useState<boolean>(false)

  // Select Modals
  const [selectModalCompanies, setSelectModalCompanies] = useState<boolean>(false);
  const [selectModalBranchOffices, setSelectModalBranchOffices] = useState<boolean>(false);
  const [selectModalAreas, setSelectModalAreas] = useState<boolean>(false);

  const [selectedModalCompany, setSelectedModalCompany] = useState<number | null>(null)
  const [selectedModalArea, setSelectedModalArea] = useState<number | null>(null)

  useEffect(() => {
    if (updateToRequisition) {

    }
  }, [])

  const fetch = async () => {
    const resultCompanies = await getCompaniesXUsers(user_id)
    setCompanies(resultCompanies)
    if (updateToRequisition) {
      setSelectedModalCompany(updateToRequisition.id_empresa)
      const resultBranch = await getBranchOffices(updateToRequisition.id_empresa, user_id)
      setBranchOffices(resultBranch)
      setSelectedBranchOffice(resultBranch[0].id)
      const resultAreas = await getAreas(resultBranch[0].id, user_id)
      setAreas(resultAreas)
      setSelectedModalArea(resultAreas[0].id)
    }
  }

  const [selectedOption, setSelectedOption] = useState<any>(0);


  useEffect(() => {
    if (updateToRequisition) {
      // setSelectedOption(updateToRequisition.tipo)
      setComments(updateToRequisition.comentarios)
      // setConcepts(updateToRequisition.conceptos)
      setTitle(updateToRequisition.titulo)

    }
    fetch()
    console.log('LLEGANDO A MODAL REQ',updateToRequisition);
    
  }, [updateToRequisition])



  const modalCloseCreate = () => {
    setModalStateCreate('')
    setConcepts([])
    setUpdateToRequisition(null)
    setTitle('')
    setComments('')
  }


  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "normal") {
      setSelectedOption(0);
    }
    else if (value === "diferencial") {
      setSelectedOption(1);
    }
    else {

    }
  };


  console.log(concepts);



  const handleModalCompaniesChange = async (company: any) => {
    setSelectedModalCompany(company.id);
    setSelectModalCompanies(false);
    const resultBranch = await getBranchOffices(company.id, user_id)
    setBranchOffices(resultBranch)
    setSelectedBranchOffice(resultBranch[0].id)
    const resultAreas = await getAreas(resultBranch[0].id, user_id)
    setAreas(resultAreas)
    setSelectedModalArea(resultAreas[0].id)

  }


  const openSelectModalCompanies = () => {
    setSelectModalCompanies(!selectModalCompanies)
  }

  // Select y Onchange de Sucursales //

  const handleModalBranchOfficesChange = (branchOffice: any) => {
    setSelectedBranchOffice(branchOffice.id)
    setSelectModalBranchOffices(false)

  }

  const openSelectModalBranchOffices = () => {
    setSelectModalBranchOffices(!selectModalBranchOffices)
  }



  const openSelectModalAreas = () => {
    setSelectModalAreas(!selectModalAreas)
  }

  const handleModalAreas = (area: any) => {
    setSelectedModalArea(area.id)
    setSelectModalAreas(false)
  }



  const [selectedUnit, setSelectedUnit] = useState<string[]>([]);

  const handleUnits = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const valueUnit = event.target.value;
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



  const handleCreateRequisition = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setStateLoading(true)
    // let art_tmp = articles.filter((x:any)=>x.id == selectedResult)

    const data = {
      id: updateToRequisition ? updateToRequisition.id : null,
      id_usuario_crea: user_id,
      id_sucursal: selectedBranchOffice,
      tipo: selectedOption,
      id_area: selectedModalArea,
      titulo: title,
      comentarios: comments,
      conceptos: concepts,

    };



    if (updateToRequisition) {
      try {
        const result: any = await APIs.updateRequisition(data)
        if (result.error == true) {
          Swal.fire('advertencia', result.mensaje, 'warning');
        } {
          Swal.fire(result.mensaje, '', 'success');
          const data = {
            id_sucursal: 0,
            id_usuario: user_id,
            id_area: 0,
            tipo: 0,
            desde: dates[0],
            hasta:dates[1],
            status: 0
          };
          const resultRequisition = await getRequisition(data)
          setRequisitions(resultRequisition)
          setModalStateCreate('')
        }
        setStateLoading(false)
      } catch (error) {
        Swal.fire('No se pudo actualizar la requisicion', '', 'error');
        setStateLoading(false)
      }
    } else {
      try {
        const result = await createRequisition(data)
        if (result.error == true) {
          Swal.fire('advertencia', result.mensaje, 'warning');
        } else {
          Swal.fire('Requisision creada exitosamente', '', 'success');
          const data = {
            id_sucursal: 0,
            id_usuario: user_id,
            id_area: 0,
            tipo: 0,
            desde: dates[0],
            hasta:dates[1],
            status: 0
          };
          const resultRequisition = await getRequisition(data)
          setRequisitions(resultRequisition)
          setModalStateCreate('')
        }
        setStateLoading(false)
      } catch (error) {
        Swal.fire('No se pudo crear la requisicion', '', 'error');
        setStateLoading(false)
      }
    }
  }


  const deleteConcept = (item: any) => {
    const itemDelete = concepts.filter((x: number) => x !== item);
    setConcepts(itemDelete);


  };

  // console.log('updateToRequisition', updateToRequisition)

  const updateStatus = async () => {

    const data = {
      id: updateToRequisition.id,
      status: !updateToRequisition.status
    }

    try {
      await APIs.updateStatusRequisition(data)
      const resultRequisition = await getRequisition(dataGet)
      setRequisitions(resultRequisition)
      setModalStateCreate('')
    } catch (error) {
      console.log(error)
    }
  }

  const getPDFRequisition = async () => {
    window.open('http://hiplot.dyndns.org:84/api_dev/pdf_requisicion/'+updateToRequisition.id, '_blank');
    // try {
      // await APIs.pdtRequisition(updateToRequisition.id);
      // Abrimos el PDF en una nueva pestaña

      // let resultRequisition = await getRequisition(dataGet);
      // setRequisitions(resultRequisition);
      // setModalStateCreate('');
    // } catch (error) {
    //   console.log(error);
    // }
  }
  return (
    <div className={`overlay__requisition ${modalStateCreate == 'create' || modalStateCreate == 'update' ? 'active' : ''}`}>
      <Toaster expand={true} position="top-right" richColors />
      <div className={`popup__requisition ${stateLoading ? 'loading' : ''} ${modalStateCreate == 'create' || modalStateCreate == 'update' ? 'active' : ''} `}>
        <div className='header__modal'>
          <a href="#" className="btn-cerrar-popup__requisition" onClick={modalCloseCreate} >
            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
          </a>
          {updateToRequisition != null ?
            <p className='title__modals'>Actualizar Requisición</p>
            :
            <p className='title__modals'>Crear Requisición</p>
          }
        </div>
        <div className='requisition-modal' >
          <div className='requisition-modal_container'>
            {updateToRequisition == null ?
              <><div className='row__one'>
                <div className='container__checkbox_requisition'>
                  <div className='checkbox__requisition'>
                    <label className="checkbox__container_general">
                      <input
                        className='checkbox'
                        type="radio"
                        value="normal"
                        checked={selectedOption == 0}
                        onChange={handleOptionChange} />
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
                        checked={selectedOption == 1}
                        onChange={handleOptionChange} />
                      <span className="checkmark__general"></span>
                    </label>
                    <p className='text'>Diferencial</p>
                  </div>
                </div>
              </div><div className='row__two'>
                  <div className='select__container'>
                    <label className='label__general'>Empresas</label>
                    <div className='select-btn__general'>
                      <div className={`select-btn ${selectModalCompanies ? 'active' : ''}`} onClick={openSelectModalCompanies}>
                        <div className='select__container_title'>
                          <p>{selectedModalCompany ? companies.find((s: { id: number }) => s.id === selectedModalCompany)?.razon_social : 'Selecciona'}</p>
                        </div>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                      </div>
                      <div className={`content ${selectModalCompanies ? 'active' : ''}`}>
                        <ul className={`options ${selectModalCompanies ? 'active' : ''}`} style={{ opacity: selectModalCompanies ? '1' : '0' }}>
                          {companies && companies.map((company: any) => (
                            <li key={company.id} onClick={() => handleModalCompaniesChange(company)}>
                              {company.razon_social}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className='select__container'>
                    <label className='label__general'>Sucursales</label>
                    <div className='select-btn__general'>
                      <div className={`select-btn ${selectModalBranchOffices ? 'active' : ''}`} onClick={openSelectModalBranchOffices}>
                        <div className='select__container_title'>
                          <p>{selectedBranchOffice ? branchOffices?.find((s: { id: number }) => s.id == selectedBranchOffice)?.nombre : 'Selecciona'}</p>
                        </div>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                      </div>
                      <div className={`content ${selectModalBranchOffices ? 'active' : ''}`}>
                        <ul className={`options ${selectModalBranchOffices ? 'active' : ''}`} style={{ opacity: selectModalBranchOffices ? '1' : '0' }}>
                          {branchOffices?.map((sucursal: any) => (
                            <li key={sucursal.id} onClick={() => handleModalBranchOfficesChange(sucursal)}>
                              {sucursal.nombre}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className='select__container'>
                    <label className='label__general'>Areas</label>
                    <div className='select-btn__general'>
                      <div className={`select-btn ${selectModalAreas ? 'active' : ''}`} onClick={openSelectModalAreas}>
                        <p>{selectedModalArea ? areas.find((s: { id: number }) => s.id === selectedModalArea)?.nombre : 'Selecciona'}</p>
                        <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                      </div>
                      <div className={`content ${selectModalAreas ? 'active' : ''}`}>
                        <ul className={`options ${selectModalAreas ? 'active' : ''}`} style={{ opacity: selectModalAreas ? '1' : '0' }}>
                          {areas?.map((area: any) => (
                            <li key={area.id} onClick={() => handleModalAreas(area)}>
                              {area.nombre}
                            </li>
                          ))}
                        </ul>
                      </div>
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
                </div></>
              :
              <div className="card ">
                <div className="card-body bg-standar">
                  <h3 className="text">{updateToRequisition.serie}-{updateToRequisition.folio}-{updateToRequisition.anio}</h3>
                  <hr />
                  <div className='row'>
                    <div className='col-6 md-col-12'>
                      <span className='text'>Creado por: <b>{updateToRequisition.usuario_crea}</b></span><br />
                      <span className='text'>Fecha de Creación: <b>{updateToRequisition.fecha_creacion}</b></span><br />
                      <span className='text'>Titulo: <b>{updateToRequisition.titulo}</b> </span>
                        {updateToRequisition.status === 0 ? (
                          <span className="active-status">Activo</span>
                        ) : updateToRequisition.status === 1 ? (
                          <span className="canceled-status">Cancelada</span>
                        ) : (
                          updateToRequisition.status === 2 ? (
                            <span className="end-status">Terminado</span>
                          ) : (
                            ""
                          )
                        )}

                    </div>
                    <div className='col-6 md-col-12'>
                      <span className='text'>Empresa: <b>{updateToRequisition.empresa}</b></span><br />
                      <span className='text'>Sucursal: <b>{updateToRequisition.sucursal}</b></span><br />
                      <span className='text'>Area: <b>{updateToRequisition.area}</b></span>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-12'>
                      <span className='text'>Comentarios: {updateToRequisition.comentarios}</span>

                    </div>
                  </div>
                </div>
              </div>
            }


            <div className='row__three'>
              {selectedOption == 0 ?
                <Normal />
                :
                <Differential />
              }
            </div>
            <div className='table__requisiciones-modal' >
              <div>
                <div>
                  {concepts ? (
                    <div className='table__numbers'>
                      <p className='text'>Estos son tus conceptos</p>
                      <div className='quantities_tables'>{concepts?.length}</div>
                    </div>
                  ) : (
                    <p className='text'>No hay conceptos</p>
                  )}
                </div>
                <div className='table__head'>
                  <div className='thead'>
                    <div className='th'>
                      <p className=''>Código</p>
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
                          <div className='td code'>
                            <p>{article.codigo}-{article.descripcion}</p>
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
                                <select className='traditional__selector' onChange={(event) => handleUnits(event, index)} value={selectedUnit[index]}>
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
                            {article.max_min}
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
          </div>
          <div className={`d-flex  mt-3 ${modalStateCreate == 'create' ? 'justify-content-center' : 'justify-content-between'}`}>
            {modalStateCreate == 'create' ? 
            ''
            :
            <div>
              <button className='btn__general-orange' type='button' onClick={getPDFRequisition}>PDF</button>
            </div>
            }
          
            <button className='btn__general-purple d-flex align-items-center' onClick={handleCreateRequisition} disabled={updateToRequisition && updateToRequisition.status == 2}>
              {updateToRequisition ? `${stateLoading ? 'Actualizando requisición' : 'Actualizar requisición'}` : `${stateLoading ? 'Creando requisición' : 'Crear requisición'}`}
              {stateLoading ? <span className="loader-two"></span> : ''}
            </button>
            {modalStateCreate == 'create' ? 
            ''
            :
            <div>
              <button className='btn__general-danger' type='button' onClick={updateStatus}>Deshabilitar</button>
            </div>
            }
         
          </div>

        </div>
      </div >
    </div >
  )
}

export default ModalRequisition
