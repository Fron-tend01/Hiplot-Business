import React, { useState, useEffect, ChangeEvent } from 'react'
import { useStore } from 'zustand';
import './style/Units.css'
import APIs from '../../../../../../services/services/APIs';
import { storeArticles } from '../../../../../../zustand/Articles';
const Units: React.FC = () => {

  const { articleByOne, setModalStateUnits, setUnits, units }: any = useStore(storeArticles);

  const deleteUnits = storeArticles(state => state.deleteUnits);
  const setDeleteUnits = storeArticles(state => state.setDeleteUnits);
 
  const [sectionsUnits, setSectionsUnits] = useState<any>()
  const get = async () => {
    let result = await APIs.getUnits()
    setSectionsUnits(result)
  }

  useEffect(() => {
    get()
    if(articleByOne.unidades) {
      setUnits(articleByOne.unidades)
    }
    
  
  }, [articleByOne])




  const [selectUnits, setSelectUnits] = useState<boolean>(false)
  const [selectedUnits, setSelectedUnits] = useState<any>()

  const openSelectUnits = () => {
    setSelectUnits(!selectUnits)
  }

  const handleUnitsChange = (unit: any) => {
    setSelectedUnits(unit.id_unidad)
    setSelectUnits(false)
  }

  const closeModal = () => {
    setModalStateUnits(false)
  }

  const [selectSectionsUnits, setSelectSectionsUnits] = useState<boolean>(false)
  const [selectedSectionUnit, setSelectedSectionUnit] = useState<any>()
  const [unitName, setUnitName] = useState<any>()
  

  const openSelectSectionsUnits = () => {
    setSelectSectionsUnits(!selectSectionsUnits)
  }


  const handleSectionsUnitsChange = (unit: any) => {
    setSelectedSectionUnit(unit.id)
    setSelectSectionsUnits(false)
    setUnitName(unit.nombre)

  }

  const [valueUnits, setValueUnits] = useState<any>(0)

  const hendleEquivalencia = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValueUnits(parseFloat(value));
  }

  const [selectedOption, setSelectedOption] = useState<any>(null);

  const handleChange = (index: any) => {
    const updatedUnits = units.map((unit: any, i: any) => ({
      ...unit,    
      unidad_almacen: i === index
    }));
    setUnits(updatedUnits);

    units[index].unidad_almacen = true
  
    setSelectedOption(index)
  };


  
  const addUnits = () => {
    let data = {
      id_unidad: selectedSectionUnit,
      id_unidad_equivalencia: selectedUnits,
      equivalencia: valueUnits,
      unidad_almacen: false,
      unidad: unitName,
      nombre: unitName,
    };
    setUnits([...units, data]); // Asegúrate de que esta línea esté llamando a la función correctamente
  };

  const deleteMaxMin = (item: any) => {
    setUnits(units.filter((unit: any) => unit.id !== item.id));
    setDeleteUnits([...deleteUnits, item.id])
  };
  return (
      <div>
        <a href="#" className="btn-cerrar-popup__modal_units_creating_articles" onClick={closeModal}>
            <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
        </a>
        <p className='title__modals'>Unidades</p>
        <div className='article__modal_save_modal_units_container'>
            <div className='row__one'>
              <div className='select__container'>
                <label className='label__general'>Unidades</label>
                <div className='select-btn__general'>
                  <div className={`select-btn ${selectSectionsUnits ? 'active' : ''}`} onClick={openSelectSectionsUnits}>
                    <div className='select__container_title'>
                        <p>{selectedSectionUnit ? sectionsUnits.find((s: {id: number}) => s.id === selectedSectionUnit)?.nombre : 'Selecciona'}</p>
                    </div>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                  </div>
                  <div className={`content ${selectSectionsUnits ? 'active' : ''}`}>
                    <ul className={`options ${selectSectionsUnits ? 'active' : ''}`} style={{ opacity: selectSectionsUnits ? '1' : '0' }}>
                      {sectionsUnits && sectionsUnits.map((unit: any) => (
                        <li key={unit.id} onClick={() => handleSectionsUnitsChange(unit)}>
                          {unit.nombre}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <label className='label__general'>Valor/Equivalencia</label>
                <input className='inputs__general' type="number" onChange={hendleEquivalencia} placeholder='Ingresa el valor' />
              </div>
              {units.length > 0 ?
              <div className='select__container'>
                <label className='label__general'>Unidades</label>
                <div className='select-btn__general'>
                  <div className={`select-btn ${selectUnits ? 'active' : ''}`} onClick={openSelectUnits}>
                    <div className='select__container_title'>
                        <p>{selectedUnits ? units.find((s: {id: number}) => s.id === selectedUnits)?.nombre : 'Selecciona'}</p>
                    </div>
                    <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                  </div>
                  <div className={`content ${selectUnits ? 'active' : ''}`}>
                    <ul className={`options ${selectUnits ? 'active' : ''}`} style={{ opacity: selectUnits ? '1' : '0' }}>
                      {units && units.map((unit: any) => (
                        <li key={unit.id} onClick={() => handleUnitsChange(unit)}>
                          {unit.nombre}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              :
              ''
              }
              <div>
                <button className='btn__general-purple' type='button' onClick={addUnits}>Agregar</button>
              </div>
            </div>
            <div className='row__two'>
              <p className='warning__article_units'>La unidad de almacen será con el que se ingrese al almacen</p>
            </div>
            <div>
                
            </div>
        </div>
      </div>
  
  )
}

export default Units
