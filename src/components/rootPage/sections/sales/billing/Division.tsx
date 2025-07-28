import React, { useEffect, useState } from 'react'
import { storeModals } from '../../../../../zustand/Modals'
import { useStore } from 'zustand'
import './Division.css'
import { storeBilling } from '../../../../../zustand/Billing'
import Personalized from '../Personalized'
import { storePersonalized } from '../../../../../zustand/Personalized'
import Swal from 'sweetalert2'

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

    const [unitPrice, setUnitPrice] = useState<any>(0.00)

    useEffect(() => {
        setUnitPrice(division.cantidad / division.precio_total)
    }, [])

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const nuevaCantidad = parseFloat(e.target.value);
        if (isNaN(nuevaCantidad)) return;

        // Actualizar cantidad primero
        const nuevasDivisiones = [...divisiones];
        nuevasDivisiones[index].cantidad = nuevaCantidad;

        const totalGlobal = nuevasDivisiones.reduce((acc, d) => acc + d.precio_unitario * d.cantidad, 0);
        const totalCantidades = nuevasDivisiones.reduce((acc, d) => acc + d.cantidad, 0);

        const redistribuidas = nuevasDivisiones.map((d) => {
            const nuevoTotal = totalCantidades > 0 ? (totalGlobal * d.cantidad) / totalCantidades : 0;
            const nuevoPrecio = d.cantidad > 0 ? nuevoTotal / d.cantidad : 0;
            return {
                ...d,
                precio_unitario: parseFloat(nuevoPrecio.toFixed(2)),
                precio_total: parseFloat(nuevoTotal.toFixed(2)),
                total: parseFloat(nuevoTotal.toFixed(2)),
                total_restante: parseFloat(nuevoTotal.toFixed(2)),
            };
        });

        setDivisiones(redistribuidas);
        // Actualizar billing también
        setBilling((prevBilling: any) => {
            const key = typeDiv === 'normal' ? 'normal_concepts' : 'personalized_concepts';
            const conceptosOriginales = prevBilling[key] || [];

            // Reemplaza solo los conceptos que están en la misma posición que las divisiones
            const nuevosConceptos = conceptosOriginales.map((concepto: any, i: number) => {
                const nueva = redistribuidas[i];
                return nueva ? { ...concepto, ...nueva } : concepto;
            });

            return {
                ...prevBilling,
                [key]: nuevosConceptos,
            };
        });
    };


    const handleUnitPriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const nuevoPrecioUnitario = parseFloat(e.target.value);
        if (isNaN(nuevoPrecioUnitario)) return;

        const cantidadActual = divisiones[index].cantidad;
        const nuevoTotalActual = nuevoPrecioUnitario * cantidadActual;

        const totalGlobalOriginal = divisiones.reduce(
            (acc, item) => acc + item.precio_unitario * item.cantidad,
            0
        );

        const totalRestante = totalGlobalOriginal - nuevoTotalActual;

        const sumaCantidadesRestantes = divisiones
            .filter((_, i) => i !== index)
            .reduce((acc, item) => acc + item.cantidad, 0);

        const nuevasDivisiones = divisiones.map((item, i) => {
            if (i === index) {
                return {
                    ...item,
                    precio_unitario: nuevoPrecioUnitario,
                    precio_total: parseFloat(nuevoTotalActual.toFixed(2)),
                    total: parseFloat(nuevoTotalActual.toFixed(2)),
                    total_restante: parseFloat(nuevoTotalActual.toFixed(2)),
                };
            } else {
                const nuevoTotal = sumaCantidadesRestantes > 0
                    ? (totalRestante * item.cantidad) / sumaCantidadesRestantes
                    : 0;
                const nuevoUnit = item.cantidad > 0 ? nuevoTotal / item.cantidad : 0;
                return {
                    ...item,
                    precio_unitario: parseFloat(nuevoUnit.toFixed(2)),
                    precio_total: parseFloat(nuevoTotal.toFixed(2)),
                };
            }
        });

        setDivisiones(nuevasDivisiones);

        const key = typeDiv === 'normal' ? 'normal_concepts' : 'personalized_concepts';
        const conceptosOriginales = billing[key] || [];

        let nuevosConceptos = [...conceptosOriginales];

        nuevasDivisiones.forEach(div => {
            nuevosConceptos = nuevosConceptos.map(concepto => {
                if (concepto.index_in_billing === div.index_in_billing) {
                    return { ...concepto, ...div };
                }
                return concepto;
            });
        });

        setBilling({
            ...billing,
            [key]: nuevosConceptos,
        });
    };
    const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const nuevoTotal = parseFloat(e.target.value);
        if (isNaN(nuevoTotal)) return;

        const cantidadActual = divisiones[index].cantidad;
        const nuevoPrecioUnitario = cantidadActual > 0 ? nuevoTotal / cantidadActual : 0;

        const totalGlobalOriginal = divisiones.reduce(
            (acc, item) => acc + item.precio_unitario * item.cantidad,
            0
        );

        const totalRestante = totalGlobalOriginal - nuevoTotal;

        const sumaCantidadesRestantes = divisiones
            .filter((_, i) => i !== index)
            .reduce((acc, item) => acc + item.cantidad, 0);

        const nuevasDivisiones = divisiones.map((item, i) => {
            if (i === index) {
                return {
                    ...item,
                    precio_total: parseFloat(nuevoTotal.toFixed(2)),
                    precio_unitario: parseFloat(nuevoPrecioUnitario.toFixed(2)),
                    total: parseFloat(nuevoTotal.toFixed(2)),
                    total_restante: parseFloat(nuevoTotal.toFixed(2)),
                };
            } else {
                const nuevoTotalRest = sumaCantidadesRestantes > 0
                    ? (totalRestante * item.cantidad) / sumaCantidadesRestantes
                    : 0;
                const nuevoUnitRest = item.cantidad > 0 ? nuevoTotalRest / item.cantidad : 0;
                return {
                    ...item,
                    precio_total: parseFloat(nuevoTotalRest.toFixed(2)),
                    precio_unitario: parseFloat(nuevoUnitRest.toFixed(2)),
                };
            }
        });

        setDivisiones(nuevasDivisiones);

        const key = typeDiv === 'normal' ? 'normal_concepts' : 'personalized_concepts';
        const conceptosOriginales = billing[key] || [];

        let nuevosConceptos = [...conceptosOriginales];

        nuevasDivisiones.forEach(div => {
            nuevosConceptos = nuevosConceptos.map(concepto => {
                if (concepto.index_in_billing === div.index_in_billing) {
                    return { ...concepto, ...div };
                }
                return concepto;
            });
        });

        setBilling({
            ...billing,
            [key]: nuevosConceptos,
        });
    };





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
                const newDivisiones: any[] = [];

                for (let i = 0; i < num; i++) {
                    const divisionCopy = { ...division };
                    divisionCopy.indextmp = `${index}${i}`;
                    divisionCopy.index_in_billing = index + i;
                    divisionCopy.total_total = division.total_total / num;
                    divisionCopy.precio_total = division.precio_total / num;
                    divisionCopy.total = division.precio_total / num;
                    divisionCopy.total_restante = division.precio_total / num;
                    divisionCopy.concept = true;
                    // divisionCopy.id = 0;

                    // Dividir cantidad ajustando residuo
                    if (division.cantidad % num !== 0 && i === num - 1) {
                        divisionCopy.cantidad = division.cantidad - (Math.floor(division.cantidad / num) * (num - 1));
                    } else {
                        divisionCopy.cantidad = Math.floor(division.cantidad / num);
                    }

                    if (divisionCopy.cantidad <= 0) {
                        divisionCopy.cantidad = 1;
                    }

                    divisionCopy.precio_unitario = divisionCopy.total / divisionCopy.cantidad;

                    if (divisionCopy?.conceptos?.length > 0 || divisionCopy?.conceptos_pers?.length > 0) {
                        divisionCopy.conceptos.forEach((x: any) => {
                            x.total = divisionCopy?.precio_real / num;
                            x.cantidad = divisionCopy?.cantidad / num;
                            x.pers_div = true;
                        });
                    }

                    setUnitPrice(divisionCopy.precio_unitario);
                    newDivisiones.push(divisionCopy);
                }

                if (division.id) {
                    setDeleteCustomConcepts([...deleteCustomConcepts, division.id]);
                }

                if (typeDiv === 'normal') {
                    const updatedConcepts = [
                        ...billing.normal_concepts.slice(0, index),
                        ...newDivisiones,
                        ...billing.normal_concepts.slice(index + 1)
                    ];

                    setBilling({
                        normal_concepts: updatedConcepts,
                        personalized_concepts: billing.personalized_concepts
                    });
                } else {
                    const updatedConcepts = [
                        ...billing.personalized_concepts.slice(0, index),
                        ...newDivisiones,
                        ...billing.personalized_concepts.slice(index + 1)
                    ];

                    setBilling({
                        normal_concepts: billing.normal_concepts,
                        personalized_concepts: updatedConcepts
                    });
                }

                setDivisiones(newDivisiones);
                Swal.fire('Notificación', 'División realizada correctamente, puedes ajustar los montos y las cantidades', 'success');
            }
        }
    };


    const getTotalGlobal = () =>
        divisiones.reduce((acc, item) => acc + item.precio_unitario * item.cantidad, 0);
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
                                <div className='th'><p>Nombre</p></div>
                                <div className='th'><p>Codigo</p></div>
                                <div className='th'><p>Cantidad</p></div>
                                <div className='th'><p>Precio unitario</p></div>
                                <div className='th'><p>Precio total</p></div>
                            </div>
                        </div>
                        {divisiones && (
                            <div className='table__body'>
                                {divisiones.map((concept: any, index: number) => (
                                    <div className='tbody__container' key={index}>
                                        <div className='tbody'>
                                            <div className='td'><p>{concept.descripcion}</p></div>
                                            <div className='td'><p>{concept.codigo}</p></div>
                                            <div className='td'>
                                                <input
                                                    className='inputs__general'
                                                    type="number"
                                                    value={concept.cantidad ?? ''}
                                                    onChange={(e) => handleAmountChange(e, index)}
                                                    placeholder='Ingresa la cantidad'
                                                />
                                            </div>
                                            <div className='td'>
                                                <input
                                                    className='inputs__general'
                                                    type="number"
                                                    value={concept.precio_unitario ?? ''}
                                                    onChange={(e) => handleUnitPriceChange(e, index)}
                                                    placeholder='Ingresa el precio'
                                                />
                                            </div>
                                            <div className='td'>
                                                <input
                                                    className='inputs__general'
                                                    type="number"
                                                    value={concept.precio_total ?? ''}
                                                    onChange={(e) => handleTotalChange(e, index)} // 👈 Nuevo
                                                    placeholder='Ingresa el total'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                    <div className='row'>
                        <div className='col-12 d-flex justify-content-between text'>
                            {/* <div className='d-flex align-items-center'>
                                <p>Cantidad</p>
                                <p className='price__billing'>{division.cantidad}</p>
                            </div> */}
                            <div className='d-flex align-items-center'>
                                <p>Precio A Alcanzar</p>
                                <p className='price__billing'>{division.precio_total}</p>
                            </div>
                            {/* <div className='d-flex align-items-center'>
                                <p>Cantidad</p>
                                <p className='price__billing'>{division.cantidad}</p>
                            </div> */}

                        </div>
                    </div>
                </div>
                <Personalized />
            </div>
        </div>
    )
}

export default Division
