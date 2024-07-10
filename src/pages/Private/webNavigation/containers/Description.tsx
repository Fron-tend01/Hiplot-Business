import React from 'react';
import './styles/Collections.css';


const Description: React.FC<any> = ({ copyContainer, index }) => {
    

    return (
        <div className='collections__web-page'>
             <div className='collections__web-page_container'>
                <div className='left' style={{ backgroundImage: `url(${copyContainer[index].imagen || ''})` }}>

                </div>
                <div className='right'>
                    <div>
                        <div className={`default__class_services ${copyContainer[index].textAlign1 || ''} ${copyContainer[index].fontWeight1}`} style={{ fontSize: `${copyContainer[index].fontSize1}px`, color: copyContainer[index].color1}}>{copyContainer[index].titulo}</div>
                        <p className={`default__class_services ${copyContainer[index].textAlign2 || '' } ${copyContainer[index].fontWeight2}`}  style={{ fontSize: `${copyContainer[index].fontSize2}px`, color: copyContainer[index].color2}}>{copyContainer[index].imagen4}</p>
                    </div>
                </div>
            </div>
           
        </div>
    );
}

export default Description;
