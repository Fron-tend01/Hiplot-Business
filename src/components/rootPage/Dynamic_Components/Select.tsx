import React, { useState } from 'react';
import { useSelectStore } from '../../../zustand/Select'; // Asegúrate de que la ruta es correcta

interface SelectData {
  selectName: string;
  dataSelect: any[];
  options: string; // El nombre de la propiedad que quieres mostrar
}

interface SelectProps {
  dataSelects: SelectData;
  instanceId: string; // Identificador único para cada instancia
}

const Select: React.FC<SelectProps> = ({ dataSelects, instanceId }) => {
  if (!dataSelects) {
    console.warn('dataSelects is undefined');
    return null; // O muestra un mensaje de error
  }
  const [selects, setSelects] = useState<boolean>(false); 
  const selectedId: any = useSelectStore((state) => state.selectedIds == null ? null :  state.selectedIds[instanceId]);
  const setSelectedId = useSelectStore((state) => state.setSelectedId);

  const handleSelectsChange = (famId: number) => {
    setSelectedId(instanceId, famId); // Usar el instanceId para actualizar el estado correcto
    setSelects(false);
  };





  return (
    <div className='select__container'>
      <label className='label__general'>{dataSelects && dataSelects.selectName}</label>
      <div className={`select-btn__general`}>
        <div className={`select-btn ${selects ? 'active' : ''}`} onClick={() => setSelects(!selects)}>
          <div className='select__container_title'>
            <p>
              {selectedId 
                ? dataSelects.dataSelect && dataSelects.dataSelect.find((s) => s.id === selectedId.id)?.[dataSelects.options] || 'Selecciona' 
                : 'Selecciona'}
            </p>
          </div>
          <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
          </svg>
        </div>
        <div className={`content ${selects ? 'active' : ''}`}>
          <ul className={`options ${selects ? 'active' : ''}`} style={{ opacity: selects ? '1' : '0' }}>
            {dataSelects.dataSelect && dataSelects.dataSelect.map((select) => (
              <li key={select.id} onClick={() => handleSelectsChange(select)}>
                {select[dataSelects.options] || 'No disponible'} 
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Select;
