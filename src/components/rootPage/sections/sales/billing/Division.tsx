import React, { useState } from 'react'
import { storeModals } from '../../../../../zustand/Modals'
import { useStore } from 'zustand'
import './Division.css'
import { storeBilling } from '../../../../../zustand/Billing'
import Personalized from '../Personalized'

const Division = () => {

    // Modulo de facturacion

    const {modalSub}: any = useStore(storeModals)
    const {division}: any = useStore(storeBilling)
    const setModalSub = storeModals(state => state.setModalSub)

    const [number, setNumber] = useState<any | string>('')
    const [divisiones, setDivisiones] = useState<any[]>([])


    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const a = division.cantidad
        const x = divisiones.length
        const c: any = e.target.value;
        const f = a - c;
        
        if (x > 1) {
        const g = f / (x - 1);
        
        const nuevasDivisiones = divisiones.map((division, i) => {
            if (i === index) {
                return {
                    ...division,
                    cantidad: c 
                };
            } else {
                return {
                    ...division,
                    cantidad: g 
                };
            }
        });

        setDivisiones(nuevasDivisiones);
    }
        
    }
             
    const handleUnitPriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const a = division.precio_unitario
        const x = divisiones.length
        const c: any = e.target.value;
        const f = a - c;

        if (x > 1) {
        const g = f / (x - 1); 

        const nuevasDivisiones = divisiones.map((division, i) => {
            if (i === index) {
                return {
                    ...division,
                    precio_unitario: c 
                };
            } else {
                return {
                    ...division,
                    precio_unitario: g 
                };
            }
        });

        setDivisiones(nuevasDivisiones);
        
        }
        
    }



    const handleTotalPriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: any) => {
        const a = division.total_concepto
        const x = divisiones.length
        const c: any = e.target.value;
        const f = a - c;

        if (x > 1) {
        const g = f / (x - 1); 

        const nuevasDivisiones = divisiones.map((division, i) => {
            if (i === index) {
                return {
                    ...division,
                    total_concepto: c 
                };
            } else {
                return {
                    ...division,
                    total_concepto: g 
                };
            }
        });

        setDivisiones(nuevasDivisiones);
        }
    }

    

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (/^\d*$/.test(value)) {
            setNumber(value);
            const num = parseInt(value, 10);

            if (num > 0) {
                const newDivisiones = [];
                for (let i = 0; i < num; i++) {
                    // Creamos una copia del objeto division para evitar mutaciones directas
                    const divisionCopy = { ...division };
                    divisionCopy.total_concepto /= num;
                    divisionCopy.precio_unitario /= num;
                    division.cantidad % num !== 0 ? divisionCopy.cantidad = division.cantidad : divisionCopy.cantidad /= num;
                    newDivisiones.push(divisionCopy);
                }
                setDivisiones(newDivisiones);
            }
        }
    }

    


    
    
    
    
    return (
    <div className={`overlay__billing__modal-division ${modalSub == 'billing__modal-division' ? 'active' : ''}`}>
        <div className={`popup__billing__modal-division ${modalSub == 'billing__modal-division' ? 'active' : ''}`}>
            <div className='header__modal'>
                <a href="#" className="btn-cerrar-popup__billing__modal-division" onClick={() => setModalSub('')} >
                    <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                </a>
                <p className='title__modals'>Modal de division</p>
            </div>
            <div className='billing__modal-division'>
                <div className='col-3'>
                    <label className='label__general'>¿En cuanto quieres dividir la factura?</label>
                    <input className='inputs__general' type="text" value={number} onChange={handleNumberChange} placeholder='Ingresa la cantidad'/>
                </div>
                <div className='table__billing_concepts_division'>
                    {divisiones ? (
                    <div className='table__numbers'>
                        <p className='text'>Total de conceptos</p>
                        <div className='quantities_tables'>{divisiones?.length}</div>
                    </div>
                    ) : (
                        <p className="text">No hay ordenes de compra que mostras</p>
                    )}
                    <div className='table__head'>
                        <div className='thead'>
                            <div className='th'>
                                <p>Nombre</p>
                            </div>
                            <div className='th'>
                                <p>Codigo</p>
                            </div>
                            <div className='th'>
                                <p>Cantidad</p>
                            </div>
                            <div className='th'>
                                Precio unitario
                            </div>
                            <div className="th">
                                Total de conceptos
                            </div>
                        </div>
                    </div>
                    {divisiones ? (
                        <div className='table__body'>
                            {divisiones?.map((concept: any, index: number) => {
                                return (
                                    <div className='tbody__container' key={concept.id}>
                                        <div className='tbody'>
                                            <div className='td'>
                                                <p>{concept.descripcion}</p>
                                            </div>
                                            <div className='td'>
                                                <p>{concept.codigo}</p>
                                            </div>
                                            <div className='td'>
                                                <input className='inputs__general' type="text" value={parseFloat(concept.cantidad).toFixed(2)} onChange={(e) => handleAmountChange(e, index)} placeholder='Ingresa la cantidad'/>
                                            </div>
                                            <div className='td'>
                                                <input className='inputs__general' type="text" value={parseFloat(concept.precio_unitario).toFixed(2)} onChange={(e) => handleUnitPriceChange(e, index)} placeholder='Ingresa la cantidad' />
                                            </div>
                                            <div className='td'>
                                                <input className='inputs__general' type="text" value={parseFloat(concept.total_concepto).toFixed(2)} onChange={(e) => handleTotalPriceChange(e, index)} placeholder='Ingresa la cantidad' />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <p className="text">Cargando datos...</p>
                    )}
                </div>
                <div className='row'>
                    <div className='col-12 d-flex justify-content-between text'>
                        <div className='d-flex align-items-center'>
                            <p>Cantidad</p>
                            <p className='price__billing'>{division.cantidad}</p>
                        </div>
                        <div className='d-flex align-items-center'>
                            <p>Cantidad</p>
                            <p className='price__billing'>{division.precio_unitario}</p>
                        </div>
                        <div className='d-flex align-items-center'>
                            <p>Cantidad</p>
                            <p className='price__billing'>{division.cantidad}</p>
                        </div>
                        
                    </div>
                </div>
            </div>
            <Personalized />
        </div>
    </div>
    )
}

export default Division
