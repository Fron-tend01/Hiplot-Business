import React, { useEffect } from 'react';
import './styles/Silder.css';

const Slider: React.FC<any> = ({ item, dataContainer }) => {

    useEffect(() => {
    }, [dataContainer, item]);
   
    return (
    <div className='slider__web-page'>
        <p className='title'>Lorem ipsum dolor sit</p>
        <p className='text'>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
        <div className="wrapper">
            <div className="marquee">
                <div className="marquee__group">
                    <div className='item'>
                        <img src={item.imagen} alt="" />
                    </div>
                    <div className='item'>
                        <img src={item.imagen} alt="" />
                    </div>
                    <div className='item'>
                        <img src={item.imagen} alt="" />
                    </div>
                    <div className='item'>
                        <img src={item.imagen} alt="" />
                    </div>
                    <div className='item'>
                        <img src={item.imagen} alt="" />
                    </div>
                    <div className='item'>
                        <img src={item.imagen} alt="" />
                    </div>
                    <div className='item'>
                        <img src={item.imagen} alt="" />
                    </div>
                    <div className='item'>
                        <img src={item.imagen} alt="" />
                    </div>
              
                </div>
                <div aria-hidden="true" className="marquee__group">
                    <div className='item'>
                        <img src={item.imagen} alt="" />
                    </div>
                    <div className='item'>
                        <img src={item.imagen} alt="" />
                    </div>
                    <div className='item'>
                        <img src={item.imagen} alt="" />
                    </div>
                    <div className='item'>
                        <img src={item.imagen} alt="" />
                    </div>
                    <div className='item'>
                        <img src={item.imagen} alt="" />
                    </div>
                    <div className='item'>
                        <img src={item.imagen} alt="" />
                    </div>
                    <div className='item'>
                        <img src={item.imagen} alt="" />
                    </div>
                    <div className='item'>
                        <img src={item.imagen} alt="" />
                    </div>
                </div>
            </div>
        </div>
    </div>
        
    );
}

export default Slider;

