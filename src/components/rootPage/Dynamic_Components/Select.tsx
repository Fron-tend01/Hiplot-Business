import React, { useState } from 'react';
import { useSelectStore } from '../../../zustand/Select'; // Asegúrate de que la ruta es correcta

interface Options {
  id: number;
  razon_social: string;
}

interface SelectData {
  selectName: string;
  empresas: Options[];
}

interface SelectProps {
  data: SelectData;
}

const Select: React.FC<SelectProps> = ({ data }) => {
  const [selects, setSelects] = useState<boolean>(false);
  const selectedId = useSelectStore((state) => state.selectedId);
  const setSelectedId = useSelectStore((state) => state.setSelectedId);

  const handleSelectsChange = (famId: number) => {
    setSelectedId(famId);
    setSelects(false);
  };

  return (
    <div className='select__container'>
      <label className='label__general'>{data.selectName}</label>
      <div className={`select-btn__general`}>
        <div className={`select-btn ${selects ? 'active' : ''}`} onClick={() => setSelects(!selects)}>
            <div className='select__container_title'>
            <p>
                {selectedId ? data.empresas.find((s: { id: number }) => s.id === selectedId)?.razon_social : 'Selecciona'}
            </p>
            </div>
            <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
            </svg>
        </div>
        <div className={`content ${selects ? 'active' : ''}`}>
            <ul className={`options ${selects ? 'active' : ''}`} style={{ opacity: selects ? '1' : '0' }}>
            {data.empresas.map((fam) => (
                <li key={fam.id} onClick={() => handleSelectsChange(fam.id)}>
                {fam.razon_social}
                </li>
            ))}
            </ul>
        </div>     
      </div>
    </div>
  );
};

export default Select;
