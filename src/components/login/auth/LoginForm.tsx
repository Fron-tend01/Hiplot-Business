import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../../zustand/General';
import { Roles } from '../../../models/Roles';
import { PrivateRoutes, PublicRoutes } from '../../../models/routes';
import { clearLocalStorage } from '../../../utils/localStorage.utility';
import APIs from '../../../services/services/APIs';

import './LoginForm.css';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [state] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { getUser, UserKey }: any = useUserStore()


  useEffect(() => {
    clearLocalStorage(UserKey);
    navigate(`/${PublicRoutes.LOGIN}`, { replace: true });
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result: any = await APIs.login(email, password);
      getUser({ ...result, rol: Roles.USER });
      navigate(`/${PrivateRoutes.PRIVATE}`, { replace: true }) // Envía la acción al store
      console.log('Inicio de sesión exitoso');

    } catch (error) {
      setError('Usuario o contraseña incorrectos'); // Maneja errores de inicio de sesión
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [focusField, setFocusField] = useState<string | null>(null);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleFocus = (fieldName: string) => {
    setFocusField(fieldName);
  };

  const handleBlur = () => {
    setFocusField(null);
  };


  return (
    <div>
      <div className='loginForm'>
        <div className='left'>
          <div className='left__container'>
            <div className='container__titles'>
              <h2 className='title__main'>¡Bienvenido a tu herramienta de gestión!</h2>
              <p className='left_text'>Todo lo que necesitas para llevar tu empresa al siguiente nivel, de manera fácil, eficiente y segura.</p>
            </div>
          </div>
        </div>
        <div className='rigth'>
          {state ? (
            // <RegistrarAdmin setState={() => setState(false)} />
            <div></div>
          ) : (
            <>
              <form className='form' onSubmit={handleLogin}>
                <div className='container__form'>
                  <div className='title__form'>
                    <div>
                      <h3 className='title__procura'>
                        <p className='hisoft'><b><b className='hi'>Hi</b><b className='soft'>So</b><b className='ft'>ft</b><b className='business'>Business</b></b></p>
                      </h3>
                      <h3 className='title__login'>Iniciar sesión</h3>
                      <p className='title__text'>Accede a tu cuenta del ERP</p>
                    </div>
                    {/* <h2>Todos los derecho </h2> */}
                  </div>
                  <div>
                    {error && <small className='error__message'>{error}</small>}
                    <small className='error__message'>Usuarios o contraseña incorrectos</small>
                  </div>
                  <div className='inputs__form'>
                    <label className='label__form'>Usuario</label>
                    <div className={`container__inputs ${focusField === 'user' ? 'focused' : ''}`}>
                      <svg className='svg' xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512">
                        <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
                      </svg>
                      <input className='input__form' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Ejemplo@gmail.com' onBlur={handleBlur} />
                    </div>
                  </div>
                  <div className='inputs__form'>
                    <label className='label__form'>Contraseña</label>

                    <div className={`container__inputs ${focusField === 'password' ? 'focused' : ''}`}>
                      <svg className='svg' xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512">
                        <path d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z" />
                      </svg>
                      {showPassword ?
                        <input type='password' className='input__form' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Ingresa tu contraseña' onFocus={() => handleFocus('password')} onBlur={handleBlur} />
                        :
                        <input type='text' className='input__form' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Ingresa tu contraseña' onFocus={() => handleFocus('password')} onBlur={handleBlur} />

                      }
                      <button type="button" className='toggle-password-btn' onClick={handleTogglePassword}>
                        {showPassword ?
                          <svg className='see__password'   width="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" /></svg>
                          :
                          <svg className='see__password'  width="18" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 576 512">
                            <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                          </svg>
                        }
                      </button>
                    </div>
                  </div>
                  <div className='btn__form-login'>
                    <button className='btn__login' type="submit" >Iniciar sesión</button>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginForm;