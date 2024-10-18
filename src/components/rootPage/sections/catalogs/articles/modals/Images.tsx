import React, { useState } from 'react'
import { storeArticles } from '../../../../../../zustand/Articles'
import { useStore } from 'zustand';
import './style/Images.css'


const Images: React.FC = () => {

    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const {  subModal, imagesArticles }: any = useStore(storeArticles);

    const setSubModal = storeArticles(state => state.setSubModal)
    const setImagesArticles = storeArticles(state => state.setImagesArticles)

      // Subir foto o tomar foto //
      const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (fileList && fileList.length > 0) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    let data = {
                        img_base64: reader.result
                    }
                    setSelectedFile(reader.result as string);
                    setImagesArticles([...imagesArticles, data])
                }
            };
            reader.readAsDataURL(fileList[0]);
        }
    };

    const deleteImages = (_: any, i: number) => {
        let filter = imagesArticles.filter((_: any, index: number) => index !== i)
        setImagesArticles(filter)
    }


    return (
        <div className={`overlay__modal_images_articles ${subModal == 'modal-images' ? 'active' : ''}`}>
            <div className={`popup__modal_images_articles ${subModal == 'modal-images' ? 'active' : ''}`}>
                <div className='header__modal'>
                    <a href="#" className="btn-cerrar-popup__modal_images_articles" onClick={() => setSubModal('')} >
                        <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                    </a>
                    <p className='title__modals'>Imagenes</p>
                </div>
                <form className='article__modal_images_container'>
                    <div className='images-modal-articles'>
                        {imagesArticles?.map((image: any, index: number) => (
                            <div className='image-container' style={{ backgroundImage: `url(${image.img_base64})` }} onClick={() => deleteImages(image, index)}>
                                <div>
                                    <p className='title__delete'>Eliminar</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="d-flex justify-content-center" onClick={() => setSubModal('modal-images')}>
                            <label htmlFor="file-upload-images" className={`custom-file-upload-image`} >
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill='#fff' viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM385 231c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-71-71V376c0 13.3-10.7 24-24 24s-24-10.7-24-24V193.9l-71 71c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L239 119c9.4-9.4 24.6-9.4 33.9 0L385 231z" /></svg>
                                    {' '}
                                    Subir imagen
                                </span>
                            </label>
                            <input id="file-upload-images" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                            
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Images
