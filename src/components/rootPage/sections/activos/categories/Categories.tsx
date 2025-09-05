import React, { useEffect } from 'react'
import { storeActivos } from '../../../../../zustand/Activos'
import { useStore } from 'zustand'
import APIs from '../../../../../services/services/APIs'
import './styles/Categories.css'
import Swal from 'sweetalert2';
import ModalActivosCategories from './modal-activos-ategories/ModalActivosCategories'

const Categories = () => {
    const { 
        categories, 
        setCategories, 
        setModal, 
        setDataUpd, 
        setModoUpdate 
    } = useStore(storeActivos)

    const fetchCategories = async () => {
        let data = {
            id: 1,
            nombre: ''
        }
        try {
            const response: any = await APIs.CreateAny(data, 'get_activos_categorias')
            setCategories(response.data || [])
        } catch (error) {
            console.error('Error fetching categories:', error)
            setCategories([])
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])



    const handleEdit = (category: any) => {
        setDataUpd(category)
        setModoUpdate(true)
        setModal('categories_modal')
    }

    const handleDelete = async (category: any) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas eliminar la categoría "${category.nombre}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await APIs.deleteAny("categorias_activos_delete/" + category.id)
                Swal.fire('Eliminado', 'La categoría ha sido eliminada', 'success');
                fetchCategories()
            } catch (error) {
                Swal.fire('Error', 'Error al eliminar la categoría', 'error');
            }
        }
    }

    return (
        <div className='activos'>
            <div className='categories__container'>
            <div className='categories__header'>
                <h2>Categorías de Activos</h2>
                <button 
                    className='btn__general-purple' 
                    onClick={() => setModal('categories_modal')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Nueva Categoría
                </button>
            </div>

            <div className='categories__table'>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Subcategorías</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category: any) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.nombre}</td>
                                <td>
                                    {category.subcategorias && category.subcategorias.length > 0 
                                        ? category.subcategorias.map((sub: any, index: number) => (
                                            <span key={index} className="subcategoria-badge">
                                                {sub.nombre}
                                            </span>
                                        ))
                                        : 'Sin subcategorías'
                                    }
                                </td>
                                <td>
                                    <div className='actions__container'>
                                        <button 
                                            className='btn__edit' 
                                            onClick={() => handleEdit(category)}
                                            title="Editar"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                            </svg>
                                        </button>
                                        <button 
                                            className='btn__delete' 
                                            onClick={() => handleDelete(category)}
                                            title="Eliminar"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3,6 5,6 21,6"/>
                                                <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ModalActivosCategories onRefresh={fetchCategories} />
            </div>
        </div>
    )
}

export default Categories