import React, { useEffect } from 'react'
import { storeActivos } from '../../../../../../zustand/Activos'
import { useStore } from 'zustand'
import APIs from '../../../../../../services/services/APIs'
import './ModalActivosTemplates.css'
import Swal from 'sweetalert2';

interface ModalActivosTemplatesProps {
    onRefresh: () => void;
}

const ModalActivosTemplates: React.FC<ModalActivosTemplatesProps> = ({ onRefresh }) => {
    const { 
        modal, 
        modoUpdate, 
        dataUpd, 
        inputs, 
        setModal, 
        setInputs, 
        updateInput,
        addCampo,
        removeCampo,
        updateCampo,
        removeCampoWithId,
        resetForm 
    } = useStore(storeActivos)

    const closeModal = () => {
        resetForm()
    }

    useEffect(() => {
        if (modoUpdate && dataUpd) {
            updateInput("nombre", dataUpd.nombre)
            updateInput("campos", (dataUpd as any).campos || [])
            updateInput("campos_removed", [])
        } else {
            updateInput("nombre", '')
            updateInput("campos", [])
            updateInput("campos_removed", [])
        }
    }, [modoUpdate, dataUpd, updateInput])

    const handleCreateTemplate = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!inputs.nombre || !inputs.nombre.trim()) {
            Swal.fire('Advertencia', 'El nombre es obligatorio', 'warning');
            return;
        }

        const data = {
            id: modoUpdate ? (dataUpd as any)?.id || 0 : 0,
            nombre: inputs.nombre.trim(),
            campos: inputs.campos.filter(campo => campo.nombre.trim() !== ''),
            campos_removed: inputs.campos_removed
        };

        try {
            if (!modoUpdate) {
                await APIs.CreateAny(data, "create_activos_plantillas")
                Swal.fire('Notificación', 'Plantilla creada exitosamente', 'success');
            } else {
                await APIs.CreateAnyPut(data, "update_activos_plantillas")
                Swal.fire('Notificación', 'Plantilla actualizada exitosamente', 'success');
            }
            
            closeModal()
            onRefresh()
        } catch (error: any) {
            if (error.response) {
                if (error.response.status === 409) {
                    Swal.fire('Advertencia', error.response.data?.mensaje || 'Ya existe una plantilla con este nombre', 'warning');
                } else {
                    Swal.fire('Error', 'Error al procesar la solicitud', 'error');
                }
            } else {
                Swal.fire('Error', 'Error de conexión', 'error');
            }
        }
    };

    return (
        <div className={`overlay__modal_activos_templates ${modal == 'templates_modal' ? 'active' : ''}`}>
            <div className={`popup__modal_activos_templates ${modal == 'templates_modal' ? 'active' : ''}`}>
                <a href="#" className="btn-cerrar-popup__modal_activos_templates" onClick={closeModal}>
                    <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512">
                        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                    </svg>
                </a>
                <p className='title__modals'>
                    {!modoUpdate ? 'Crear nueva plantilla' : 'Actualizar plantilla'}
                </p>
        
                <div className='container__modal_activos_templates'>
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
                                placeholder='Ingresa el nombre de la plantilla' 
                            />
                        </div>
                    </div>
                    
                    <div className='row'>
                        <div className='col-12'>
                            <label className='label__general'>Campos</label>
                            <div className='warning__general'>
                                <small>Campo opcional - Agrega campos a la plantilla</small>
                            </div>
                            
                            <div className='campos__container'>
                                {/* Input estático para agregar campos */}
                                <div className='campo__add_container'>
                                    <input 
                                        type="text" 
                                        className='inputs__general campo__add_input' 
                                        placeholder='Nombre del campo' 
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const input = e.target as HTMLInputElement;
                                                const tipoInput = (input.nextElementSibling as HTMLSelectElement);
                                                if (input.value.trim()) {
                                                    const newCampo = {
                                                        id: 0,
                                                        id_plantilla: 0,
                                                        nombre: input.value.trim(),
                                                        tipo: parseInt(tipoInput.value)
                                                    };
                                                    updateInput("campos", [...inputs.campos, newCampo]);
                                                    input.value = '';
                                                    tipoInput.value = '0';
                                                }
                                            }
                                        }}
                                    />
                                    <select 
                                        className='inputs__general campo__tipo_select'
                                        defaultValue="0"
                                    >
                                        <option value="0">Tipo 0</option>
                                        <option value="1">Tipo 1</option>
                                        <option value="2">Tipo 2</option>
                                        <option value="3">Tipo 3</option>
                                    </select>
                                    <button 
                                        type="button"
                                        className='btn__add_campo' 
                                        onClick={(e) => {
                                            const input = e.currentTarget.previousElementSibling?.previousElementSibling as HTMLInputElement;
                                            const tipoInput = e.currentTarget.previousElementSibling as HTMLSelectElement;
                                            if (input.value.trim()) {
                                                const newCampo = {
                                                    id: 0,
                                                    id_plantilla: 0,
                                                    nombre: input.value.trim(),
                                                    tipo: parseInt(tipoInput.value)
                                                };
                                                updateInput("campos", [...inputs.campos, newCampo]);
                                                input.value = '';
                                                tipoInput.value = '0';
                                            }
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 5v14M5 12h14"/>
                                        </svg>
                                    </button>
                                </div>
                                
                                {/* Visualización de campos agregados */}
                                {inputs.campos && inputs.campos.length > 0 && (
                                    <div className='campos__list'>
                                        <small className='campos__label'>Campos agregados:</small>
                                        <div className='campos__badges'>
                                            {inputs.campos.map((campo, index) => (
                                                <div key={index} className='campo__badge_item'>
                                                    <span className='campo__badge_text'>
                                                        {typeof campo === 'object' && campo !== null 
                                                            ? `${campo.nombre || 'Sin nombre'} (Tipo: ${campo.tipo || 'Sin tipo'})`
                                                            : String(campo)
                                                        }
                                                    </span>
                                                    <button 
                                                        type="button"
                                                        className='campo__badge_remove' 
                                                        onClick={() => {
                                                            const updatedCampos = inputs.campos.filter((_, i) => i !== index);
                                                            updateInput("campos", updatedCampos);
                                                        }}
                                                        title="Eliminar campo"
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
                    <div className='create__modal_activos_templates_btn'>
                        <div>
                            <button className='btn__general-purple' onClick={handleCreateTemplate}>
                                {!modoUpdate ? 'Crear' : 'Actualizar'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalActivosTemplates
