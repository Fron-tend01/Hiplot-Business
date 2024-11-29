import { useEffect, useState, useRef } from "react";
import { useStore } from "../../../../../../zustand/web-page/StoreWebPage";
import FontWeight from './fontWeight.json';

const EditorTitulo = ({ dataEditorDescriptionTitulo }: any) => {

  const setStylesDescription = useStore((state) => state.setStylesDescription);





  /////////////////////Editor////////////////////////////
  const setEditor = useStore((state) => state.setEditor);
  const [localEditor, setLocalEditor] = useState<any>({
    titulo: ''
  });


  /////////////////////Estilos////////////////////////////
  const stylesDescription = useStore((state) => state.stylesDescription);

  const [localStyles, setLocalStyles] = useState<any>({
    text: '',
    textCenter: null,
    textFontWeight: null,
    textFontSize: 15,
    textColor: null,
  });

  const [selectTypesFontWeight, setSelectTypesFontWeight] = useState(false);
  const [selectedTypeFontWeight, setSelectedTypeFontWeight] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#000000');
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setStylesDescription(localStyles);
    setEditor(localEditor);
  }, [localStyles]);

  useEffect(() => {
    dataEditorDescriptionTitulo(stylesDescription);
  }, [stylesDescription]);

  const openSelectFontWeightSections = () => {
    setSelectTypesFontWeight(!selectTypesFontWeight);
  };

  const handleFontWeightChange = (font: any) => {
    setSelectedTypeFontWeight(font.id);
    setSelectTypesFontWeight(false);
    setLocalStyles((prevStyles: any) => ({
      ...prevStyles,
      textFontWeight: font,
    }));
  };

  const textCentering = (value: any) => {
    setLocalStyles((prevStyles: any) => ({
      ...prevStyles,
      textCenter: value,
    }));
  };

  const handleTitleContainerChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setLocalEditor((prevStyles: any) => ({
      ...prevStyles,
      titulo: value,
    }));

  };

  const changeFontSize = (size: any) => {
    setLocalStyles((prevStyles: any) => ({
      ...prevStyles,
      textFontSize: size,
    }));
  };

  const changeTextColor = (color: string) => {
    setSelectedColor(color);
    setLocalStyles((prevStyles: any) => ({
      ...prevStyles,
      textColor: color,
    }));
  };

  const handleIconClick = () => {
    if (colorInputRef.current) {
      colorInputRef.current.click();
    }
  };

  return (
    <div className="item_web-page">
      <p>Titulo Prop</p>
      <div className="editor-container">
        <div className="editing__tools">
          <div className="row__one">
            <div className='select__container-font-weight'>
              <div className='select-btn__general'>
                <div className={`select-btn ${selectTypesFontWeight ? 'active' : ''}`} onClick={openSelectFontWeightSections}>
                  <div className='select__container_title'>
                    <p>{selectedTypeFontWeight ? FontWeight.find((s: { id: number }) => s.id === selectedTypeFontWeight)?.name : 'Peso'}</p>
                  </div>
                  <svg className='chevron__down' xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                  </svg>
                </div>
                <div className={`content ${selectTypesFontWeight ? 'active' : ''}`}>
                  <ul className={`options ${selectTypesFontWeight ? 'active' : ''}`} style={{ opacity: selectTypesFontWeight ? '1' : '0' }}>
                    {FontWeight && FontWeight.map((font: any) => (
                      <li key={font.id} onClick={() => handleFontWeightChange(font)}>
                        <div dangerouslySetInnerHTML={{ __html: font.name }} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <svg className="icon_text" onClick={() => textCentering('text_align-left')} width="24" height="24" focusable="false">
              <path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 4h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Zm0-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd" />
            </svg>
            <svg className="icon_text" onClick={() => textCentering('text_align-center')} width="24" height="24" focusable="false">
              <path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm3 4h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H8a1 1 0 0 1 0-2Zm-3-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd" />
            </svg>
            <svg className="icon_text" onClick={() => textCentering('text_align-right')} width="24" height="24" focusable="false">
              <path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm6 4h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm-6-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fillRule="evenodd" />
            </svg>
            <div className="color__editor_container">
              <svg onClick={handleIconClick} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="22px" height="18px" className="symbol-textForeColor">
                <path fill="#000000" fillRule="evenodd" d="M 17 3C 17 3 27.03 17 17 17 6.9 17 17 3 17 3Z" />
                <path fillRule="evenodd" d="M 16.96 18C 13.35 18 12 14.95 12 13.03 12 9.97 15.69 4.09 16.12 3.43 16.12 3.43 16.95 2.12 16.95 2.12 16.95 2.12 17.8 3.42 17.8 3.42 18.23 4.08 22 9.97 22 13.03 22 15.09 20.44 18 16.96 18ZM 16.96 3.97C 16.96 3.97 13 10.18 13 13.03 13 14.52 14.02 16.99 16.96 16.99 19.89 16.99 21 14.52 21 13.03 21 10.18 16.96 3.97 16.96 3.97ZM 3.6 9.02C 3.6 9.02 2 13.03 2 13.03 2 13.03-0 13.03-0 13.03-0 13.03 5 1 5 1 5 1 6 0 6 0 6 0 7 0 7 0 7 0 8 1 8 1 8 1 11 7.01 11 7.01 11 7.01 11 11.02 11 11.02 11 11.02 9.4 9.02 9.4 9.02 9.4 9.02 3.6 9.02 3.6 9.02ZM 7 3.01C 7 3.01 6 3.01 6 3.01 6 3.01 4.4 7.01 4.4 7.01 4.4 7.01 8.6 7.01 8.6 7.01 8.6 7.01 7 3.01 7 3.01Z" />
              </svg>
              <input type="color" value={selectedColor} onChange={(e) => changeTextColor(e.target.value)} ref={colorInputRef} className="color-picker-input" />
            </div>
          </div>
          <div className="row__two">
            <div className="slider-container">
              <div>
                <p>Tamaño de la fuente (px)</p>
                <input type="range" min="8" max="32" defaultValue="14" id="font-size-slider" onChange={(e) => changeFontSize(e.target.value)} className="slider__editor_wep-page" />
              </div>
              <div className="container__px" >{`${localStyles.textFontSize} px`}</div>
            </div>
          </div>
        </div>
        <div>
          <textarea className={`input__editor ${localEditor.imagen4}`} onChange={handleTitleContainerChange}></textarea>
        </div>
      </div>
    </div>
  );
};

export default EditorTitulo;
