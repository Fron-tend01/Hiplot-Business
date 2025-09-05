import React, { useEffect } from 'react'
import { storeActivos } from '../../../../../../zustand/Activos'
import { useStore } from 'zustand'
import APIs from '../../../../../../services/services/APIs'
import './ModalActivosCategories.css'
import Swal from 'sweetalert2';


interface ModalActivosCategoriesProps {
    onRefresh: () => void;
}

const ModalActivosCategories: React.FC<ModalActivosCategoriesProps> = ({ onRefresh }) => {
    const { 
        modal, 
        modoUpdate, 
        dataUpd, 
        inputs, 
        setModal, 
        setInputs, 
        updateInput,
        addSubcategoria,
        removeSubcategoria,
        updateSubcategoria,
        removeSubcategoriaWithId,
        resetForm 
    } = useStore(storeActivos)

    const closeModal = () => {
        resetForm()
    }

    useEffect(() => {
        if (modoUpdate && dataUpd) {
            updateInput("nombre", dataUpd.nombre)
            updateInput("subcategorias", (dataUpd as any).subcategorias || [])
            updateInput("subcategorias_removed", [])
        } else {
            updateInput("nombre", '')
            updateInput("subcategorias", [])
            updateInput("subcategorias_removed", [])
        }
    }, [modoUpdate, dataUpd, updateInput])



    const handleCreateCategory = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!inputs.nombre || !inputs.nombre.trim()) {
            Swal.fire('Advertencia', 'El nombre es obligatorio', 'warning');
            return;
        }

        const data = {
            id: modoUpdate ? (dataUpd as any)?.id || 0 : 0,
            nombre: inputs.nombre.trim(),
            subcategorias: inputs.subcategorias.filter(sub => sub.nombre.trim() !== ''),
            subcategorias_removed: inputs.subcategorias_removed
        };

     

        try {
            if (!modoUpdate) {
                await APIs.CreateAny(data, "create_activos_categorias")
                Swal.fire('Notificación', 'Categoría creada exitosamente', 'success');
            } else {
                await APIs.CreateAnyPut(data, "update_activos_categorias")
                Swal.fire('Notificación', 'Categoría actualizada exitosamente', 'success');
            }
            
            closeModal()
            onRefresh() 
        } catch (error: any) {
            if (error.response) {
                if (error.response.status === 409) {
                    Swal.fire('Advertencia', error.response.data?.mensaje || 'Ya existe una categoría con este nombre', 'warning');
                } else {
                    Swal.fire('Error', 'Error al procesar la solicitud', 'error');
                }
            } else {
                Swal.fire('Error', 'Error de conexión', 'error');
            }
        }
    };

    return (
        <div className={`overlay__modal_activos_categories ${modal == 'categories_modal' ? 'active' : ''}`}>
            <div className={`popup__modal_activos_categories ${modal == 'categories_modal' ? 'active' : ''}`}>
                <a href="#" className="btn-cerrar-popup__modal_activos_categories" onClick={closeModal}>
                    <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512">
                        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                    </svg>
                </a>
                <p className='title__modals'>
                    {!modoUpdate ? 'Crear nueva categoría' : 'Actualizar categoría'}
                </p>
        
                <div className='container__modal_activos_categories'>
                    <div className='row'>
                        <div className='col-12'>
                            <label className='label__general'>Nombre</label>
                            <div className='warning__general'>
                                <small>Este campo es obligatorio</small>
                            </div>
                            <input 
                                name="nombre" 
                                className='inputs__general' 
                                type="text" 
                                value={inputs.nombre || ''} 
                                onChange={(e) => updateInput("nombre", e.target.value)} 
                                placeholder='Ingresa el nombre de la categoría' 
                            />
                        </div>
                    </div>
                    
                    <div className='row'>
                        <div className='col-12'>
                            <label className='label__general'>Subcategorías</label>
                            <div className='warning__general'>
                                <small>Campo opcional - Agrega subcategorías individuales</small>
                            </div>
                            
                            <div className='subcategorias__container'>
                                {/* Input estático para agregar */}
                                <div className='subcategoria__add_container'>
                                    <input 
                                        type="text" 
                                        className='inputs__general subcategoria__add_input' 
                                        placeholder='Escribe el nombre de la subcategoría' 
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const input = e.target as HTMLInputElement;
                                                if (input.value.trim()) {
                                                    addSubcategoria();
                                                    updateSubcategoria(inputs.subcategorias.length, input.value.trim());
                                                    input.value = '';
                                                }
                                            }
                                        }}
                                    />
                                    <button 
                                        type="button"
                                        className='btn__add_subcategoria' 
                                        onClick={(e) => {
                                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                            if (input.value.trim()) {
                                                addSubcategoria();
                                                updateSubcategoria(inputs.subcategorias.length, input.value.trim());
                                                input.value = '';
                                            }
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 5v14M5 12h14"/>
                                        </svg>
                                    </button>
                                </div>
                                
                                {/* Visualización de subcategorías agregadas */}
                                {inputs.subcategorias.length > 0 && (
                                    <div className='subcategorias__list'>
                                        <small className='subcategorias__label'>Subcategorías agregadas:</small>
                                        <div className='subcategorias__badges'>
                                            {inputs.subcategorias.map((subcategoria, index) => (
                                                <div key={index} className='subcategoria__badge_item'>
                                                    <span className='subcategoria__badge_text'>{subcategoria.nombre}</span>
                                                    <button 
                                                        type="button"
                                                        className='subcategoria__badge_remove' 
                                                        onClick={() => removeSubcategoriaWithId(subcategoria.id)}
                                                        title="Eliminar subcategoría"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M18 6L6 18M6 6l12 12"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className='create__modal_activos_categories_btn'>
                        <div>
                            <button className='btn__general-purple' onClick={handleCreateCategory}>
                                {!modoUpdate ? 'Crear' : 'Actualizar'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalActivosCategories
