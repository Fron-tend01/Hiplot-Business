import React from 'react'
import './styles/Form.css'

const Form: React.FC = () => {
  return (
    <div className='form'>
        <div className='form__container'>
            <div className='left'>
                <form className='form__web-page'>
                    <div className='row__one'>
                        <div className='input__form_web-page_container'>
                            <label>Nombre</label>
                            <input className='input__web-page_form ' type="text" name="" id="" />
                        </div>
                        <div className='input__form_web-page_container'>
                            <label>Nombre</label>
                            <input className='input__web-page_form ' type="text" name="" id="" />
                        </div>
                    </div>
                    <div className='input__form_web-page_container'>
                        <label>Nombre</label>
                        <input className='input__web-page_form ' type="email" name="" id="" />
                    </div>
                    <div className='input__form_web-page_container'>
                        <label>Nombre</label>
                        <textarea className='textarea__web-page_form' name="" id=""></textarea>
                    </div>
                    <div>
                        <button type='button' className='btn__form_web-page'>Enviar</button>
                    </div>
                </form>
            </div>
            <div className='right'>

            </div>
            
        </div>
    </div>
  )
}

export default Form
