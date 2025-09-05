import React, { useEffect, useState } from 'react'
import { storeActivos } from '../../../../../zustand/Activos'
import { useStore } from 'zustand'
import APIs from '../../../../../services/services/APIs'
import './styles/Templates.css'
import Swal from 'sweetalert2'
import ModalActivosTemplates from './modal-activos-templates/ModalActivosTemplates'

const Templates = () => {
    const { 
        templates, 
        setTemplates, 
        setModal, 
        setModoUpdate, 
        setDataUpd 
    } = useStore(storeActivos)

    const fetchTemplates = async () => {
        let data = {
            id: 1,
            nombre: ''
        }
        
        console.log('Enviando datos a get_activos_plantillas:', data)
        
        try {
            const response: any = await APIs.CreateAny(JSON.stringify(data), 'get_activos_plantillas')
            console.log('Respuesta de get_activos_plantillas:', response)
            setTemplates(response.data || [])
        } catch (error) {
            console.error('Error fetching templates:', error)
            setTemplates([])
        }
    }

    useEffect(() => {
        console.log('Componente Templates montado')
        fetchTemplates()
    }, [])

    const handleCreate = () => {
        setModal('templates_modal')
        setModoUpdate(false)
        setDataUpd(null)
    }

    const handleEdit = (template: any) => {
        setModal('templates_modal')
        setModoUpdate(true)
        setDataUpd(template)
    }

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        })

        if (result.isConfirmed) {
            try {
                await APIs.deleteAny("delete_activos_templates/" + id)
                Swal.fire('Eliminado', 'La plantilla ha sido eliminada.', 'success')
                fetchTemplates()
            } catch (error) {
                console.error('Error deleting template:', error)
                Swal.fire('Error', 'No se pudo eliminar la plantilla.', 'error')
            }
        }
    }

    return (
        <div className='templates'>
            <div className='templates__container'>
                <div className='templates__header'>
                    <h2>Plantillas</h2>
                    <button className='btn__general-purple' onClick={handleCreate}>
                        Nueva plantilla
                    </button>
                </div>

                <div className='templates__table'>
                    <div>
                        {templates ? (
                            <div className='table__numbers'>
                                <p className='text'>Total de plantillas</p>
                                <div className='quantities_tables'>{templates.length}</div>
                            </div>
                        ) : (
                            <p></p>
                        )}
                    </div>
                    <div className='table__head'>
                        <div className='thead'>
                            <div className='th'>
                                <p>ID</p>
                            </div>
                            <div className='th'>
                                <p>NOMBRE</p>
                            </div>
                            <div className='th'>
                                <p>CAMPOS</p>
                            </div>
                            <div className='th'>
                                <p>ACCIONES</p>
                            </div>
                        </div>
                    </div>
                    {templates ? (
                        <div className='table__body'>
                            {templates.map((template: any) => (
                                <div className='tbody__container' key={template.id}>
                                    <div className='tbody'>
                                        <div className='td'>
                                            <p>{template.id}</p>
                                        </div>
                                        <div className='td'>
                                            <p>{template.nombre}</p>
                                        </div>
                                        <div className='td'>
                                            <div className='campos-container'>
                                                {template.campos && Array.isArray(template.campos) && template.campos.length > 0 
                                                    ? template.campos.map((campo: any, index: number) => (
                                                        <span key={index} className="campo-badge">
                                                            {typeof campo === 'object' && campo !== null 
                                                                ? `${campo.nombre || 'Sin nombre'} (${campo.tipo || 'Sin tipo'})`
                                                                : String(campo)
                                                            }
                                                        </span>
                                                    ))
                                                    : <span className="no-campos">Sin campos</span>
                                                }
                                            </div>
                                        </div>
                                        <div className='td'>
                                            <div className='actions__container'>
                                                <button
                                                    className='btn__edit'
                                                    onClick={() => handleEdit(template)}
                                                    title="Editar"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                        <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    className='btn__delete'
                                                    onClick={() => handleDelete(template.id)}
                                                    title="Eliminar"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3,6 5,6 21,6" />
                                                        <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
                                                        <line x1="10" y1="11" x2="10" y2="17" />
                                                        <line x1="14" y1="11" x2="14" y2="17" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Cargando datos...</p>
                    )}
                </div>
                <ModalActivosTemplates onRefresh={fetchTemplates} />
            </div>
        </div>
    )
}

export default Templates