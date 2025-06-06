import React, { useEffect, useState } from 'react'
import { storeModals } from '../../../../../zustand/Modals'
import { useStore } from 'zustand'
import './Division.css'
import { storeBilling } from '../../../../../zustand/Billing'
import Personalized from '../Personalized'
import { storePersonalized } from '../../../../../zustand/Personalized'

const Division = ({ index, typeDiv }: any) => {

    // Modulo de facturacion

    const { modalSub }: any = useStore(storeModals)
    const { division }: any = useStore(storeBilling)
    const setModalSub = storeModals(state => state.setModalSub)

    const setCustomConcepts = storePersonalized(state => state.setCustomConcepts)
    const setDeleteCustomConcepts = storePersonalized(state => state.setDeleteCustomConcepts)

    const { billing }: any = useStore(storeBilling);

    const setConceptView = storePersonalized(state => state.setConceptView)
    const { customConcepts, conceptView, deleteCustomConcepts }: any = useStore(storePersonalized)

    const [number, setNumber] = useState<any | string>('')
    const [divisiones, setDivisiones] = useState<any[]>([])
    const setBilling = storeBilling((state) => state.setBilling);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const a = Number(division.cantidad); // asegúrate de que sea número
        const x = divisiones.length;
        const c = Number(e.target.value); // convertir también el input a número
        const f = a - c;

        // Si la cantidad total es 1, se reparte en 1 y 1 para cada división
        if (a === 1) {
            const nuevasDivisiones = divisiones.map(() => ({
                ...division,
                cantidad: 1,
            }));
            setDivisiones(nuevasDivisiones);
            return;
        }

        if (x > 1) {
            const g = f / (x - 1);

            const nuevasDivisiones = divisiones.map((division, i) => {
                if (i === index) {
                    return {
                        ...division,
                        cantidad: c,
                    };
                } else {
                    return {
                        ...division,
                        cantidad: g,
                    };
                }
            });

            setDivisiones(nuevasDivisiones);
        }
    };


    const [unitPrice, setUnitPrice] = useState<any>(0.00)

    useEffect(() => {
        setUnitPrice(division.cantidad / division.precio_total)
    }, [])

    const handleUnitPriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const a = division.precio_unitario;
        const x = divisiones.length;
        const c: any = e.target.value;
        const f = a - c;

        if (x > 1) {
            const g = f / (x - 1);
            const nuevasDivisiones = divisiones.map((division, i) => {
                if (i == index) {
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

const handleTotalPriceChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const x = divisiones.length;
    const c = parseFloat(e.target.value);

    const a = divisiones[i].total_concepto;
    const f = a - c;

    if (x > 1) {
        const g = f / (x - 1);

        const nuevasDivisiones = divisiones.map((division, idx) => {
            if (idx === i) {
                return {
                    ...division,
                    total_concepto: c
                };
            } else {
                return {
                    ...division,
                    total_concepto: division.total_concepto + g
                };
            }
        });

        setDivisiones(nuevasDivisiones);
    }
};



    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;

        if (/^\d*$/.test(value)) {
            setNumber(value);
            const num = parseInt(value, 10);
            if (num > 0) {

                if (typeDiv == 'normal') {
                    const filterConcept = [...billing.normal_concepts];
                    filterConcept.splice(index, 1);
                    // let filterConcept = billing.normal_concepts.filter((x: any, i: number) => i !== index)

                    const newDivisiones = [];
                    for (let i = 0; i < num; i++) {
                        // Crear una copia profunda del objeto para evitar mutaciones
                        const divisionCopy = { ...division };

                        // Dividir las propiedades de manera segura
                        divisionCopy.total_total = division.total_total / num;
                        divisionCopy.precio_total = division.precio_total / num;
                        divisionCopy.total = division.precio_total / num;
                        divisionCopy.total_restante = division.precio_total / num;
                        // divisionCopy.precio_unitario = divisionCopy.total / divisionCopy.cantidad;
                        divisionCopy.concept = true;
                        divisionCopy.id = 0;

                        // Calcular el precio unitario para cada división

                        // Dividir cantidad, ajustando si no es divisible de forma exacta
                        let cantidadDividida: number;

                        if (division.cantidad % num !== 0 && i === num - 1) {
                            // Ajustar la cantidad en la última iteración para compensar el residuo
                            cantidadDividida = division.cantidad - (Math.floor(division.cantidad / num) * (num - 1));
                        } else {
                            cantidadDividida = Math.floor(division.cantidad / num);
                        }

                        // Si la cantidad resulta en 0, forzar a 1
                        divisionCopy.cantidad = cantidadDividida > 0 ? cantidadDividida : 1;

                        divisionCopy.precio_unitario = divisionCopy.total / divisionCopy.cantidad;
                        if (divisionCopy?.conceptos?.length > 0 || divisionCopy?.conceptos_pers?.length > 0) {
                            divisionCopy.conceptos.forEach((x: any) => {
                                x.total = divisionCopy?.precio_real / newDivisiones?.length
                                x.cantidad = divisionCopy?.cantidad / newDivisiones?.length
                                x.pers_div = true;
                            });

                        }

                        // Calcular el precio unitario después del ajuste de cantidad
                        setUnitPrice(divisionCopy.precio_total / divisionCopy.cantidad);

                        // Agregar la copia al arreglo
                        newDivisiones.push(divisionCopy);
                    }

                    if (division.id) {
                        setDeleteCustomConcepts([...deleteCustomConcepts, division.id])
                    }

                    setBilling({ normal_concepts: [...filterConcept, ...newDivisiones], personalized_concepts: billing.personalized_concepts })
                    // debugger
                    setDivisiones(newDivisiones);
                } else {
                    let filterConcept = billing.personalized_concepts.filter((x: any, i: number) => i !== index)
                    // let filterDeleteCustomConcept = customConcepts.find((x: any) => x.id_identifier == division.id_identifier)


                    const newDivisiones = [];
                    for (let i = 0; i < num; i++) {
                        // Crear una copia profunda del objeto para evitar mutaciones
                        const divisionCopy = { ...division };

                        // Dividir las propiedades de manera segura
                        divisionCopy.total_total = division.total_total / num;
                        divisionCopy.precio_total = division.precio_total / num;
                        divisionCopy.concept = true;
                        divisionCopy.id = 0;

                        // Calcular el precio unitario para cada división
                        divisionCopy.precio_unitario = divisionCopy.precio_total / divisionCopy.cantidad;

                        // Dividir cantidad, ajustando si no es divisible de forma exacta
                        if (division.cantidad % num !== 0 && i === num - 1) {
                            // Ajustar la cantidad en la última iteración para compensar el residuo
                            divisionCopy.cantidad = division.cantidad - (Math.floor(division.cantidad / num) * (num - 1));
                        } else {
                            divisionCopy.cantidad = Math.floor(division.cantidad / num);
                        }

                        if (divisionCopy?.conceptos?.length > 0 || divisionCopy?.conceptos_pers?.length > 0) {
                            divisionCopy.conceptos.forEach((x: any) => {
                                x.total = divisionCopy?.precio_real / newDivisiones?.length
                                x.cantidad = divisionCopy?.cantidad / newDivisiones?.length
                                x.pers_div = true;
                            });

                        }

                        // Calcular el precio unitario después del ajuste de cantidad
                        setUnitPrice(divisionCopy.precio_total / divisionCopy.cantidad);

                        // Agregar la copia al arreglo
                        newDivisiones.push(divisionCopy);
                    }

                    // if(division.id) {
                    //     setDeleteCustomConcepts([...deleteCustomConcepts, division.id])
                    // }

                    setBilling({ normal_concepts: billing.normal_concepts, personalized_concepts: [...filterConcept, ...newDivisiones] })
                    setDivisiones(newDivisiones);
                }

            }
        }
    };


    useEffect(() => {
        if (modalSub == 'billing__modal-division') {
            setDivisiones([])
        }
    }, [modalSub]);
    return (
        <div className={`overlay__billing__modal-division ${modalSub == 'billing__modal-division' ? 'active' : ''}`}>
            <div className={`popup__billing__modal-division ${modalSub == 'billing__modal-division' ? 'active' : ''}`}>
                <div className='header__modal'>
                    <a href="#" className="btn-cerrar-popup__billing__modal-division" onClick={() => { setModalSub(''); setNumber('') }} >
                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                    </a>
                    <p className='title__modals'>Modal de division</p>
                </div>
                <div className='billing__modal-division'>
                    <div className='row__one'>
                        <div className=''>
                            <label className='label__general'>¿En cuanto quieres dividir la factura?</label>
                            <input className='inputs__general' type="text" value={number} onChange={(e) => handleNumberChange(e, index)} placeholder='Ingresa la cantidad' />
                        </div>
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
                                    Precio total
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
                                                    <input className='inputs__general' type="number" value={parseFloat(concept.cantidad).toFixed(2)} onChange={(e) => handleAmountChange(e, index)} placeholder='Ingresa la cantidad' />
                                                </div>
                                                <div className='td'>
                                                    <input className='inputs__general' type="number" value={parseFloat(unitPrice).toFixed(2)} onChange={(e) => handleUnitPriceChange(e, index)} placeholder='Ingresa la cantidad' />
                                                </div>
                                                <div className='td'>
                                                    <input className='inputs__general' type="number" value={parseFloat(concept.precio_total).toFixed(2)} onChange={(e) => handleTotalPriceChange(e, index)} placeholder='Ingresa la cantidad' />
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
