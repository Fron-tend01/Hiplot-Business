import React, { useState } from 'react'
import './styles/ExistenciaAlmacen.css'
import APIs from '../../../../services/services/APIs'
import DynamicVariables from '../../../../utils/DynamicVariables'
import Filtrado_Articulos_Basic from '../../Dynamic_Components/Filtrado_Articulos_Basic'
import useUserStore from '../../../../zustand/General'
const ExistenciaAlmacen: React.FC = () => {
  const [articulos, setArticulos] = useState<any[]>([])
  const [data, setData] = useState<any[]>([])
  const userState = useUserStore(state => state.user);
  const user_id = userState.id
  const getData = async () => {
    let filter_art = articulos.map(articulo => articulo.id);
    let data = {
      id_usuario: user_id,
      ids_articulos: filter_art
    }
    await APIs.CreateAny(data, "reporte_existencia_almacen")
      .then(async (response: any) => {
        setData(response.data)
      })
  }
  console.log('data', data);

  return (
    <div className='existenciaAlmacen'>
      <div className='existenciaAlmacen__container'>

        <div className='row'>
          <div className='col-12'>

            <label className='label__general'>AGREGAR ARTICULOS PARA EL REPORTE</label>

            <Filtrado_Articulos_Basic set_article_local={setArticulos} />
            <div className='table__existenciaAlmacen '>
              <div>
                {articulos.length >= 1 ? (
                  <div>
                    <p className='text'>Articulos en la Lista ({articulos.length})</p>
                  </div>
                ) : (
                  <p className='text'>No hay Articulos</p>
                )}
              </div>
              <div className='table__head'>
                <div className='thead'>
                  <div className='th'>
                    <p className=''>Articulo</p>
                  </div>
                  <div className='th'>
                    <p className=''>Familia</p>
                  </div>
                </div>
              </div>
              {Array.isArray(articulos) && articulos.length > 0 ? (
                <div className='table__body'>
                  {articulos.map((dat: any, index: number) => (

                    <div className='tbody__container' key={index}>
                      <div className='tbody'>
                        <div className='td'>
                          {dat.codigo} - {dat.descripcion}
                        </div>
                        <div className='td'>
                          {dat.nombre}
                        </div>

                        <div className='td'>
                          <button className='btn__delete_users' type="button" onClick={() => {
                            DynamicVariables.removeObjectInArray(setArticulos, index);
                          }}>Eliminar</button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <p className='text'>No hay articulos que cargar</p>
              )}
            </div>
          </div>
          <div className='col-12'>
            <div className='d-flex justify-content-center align-items-end'>
              <button className='btn__general-purple' onClick={getData}>GENERAR REPORTE</button>
            </div>
          </div>
        </div>

        {data.length > 0 ? (
          data?.map((art: any) => (
            <div className='table__existenciaAlmacenData' >
              <div>
                <b>{art.codigo} - {art.descripcion}</b>
                <div className='table__head'>
                  <div className='thead'>
                    <div className='th'>
                      <p className=''>Almacen</p>
                    </div>
                    <div className='th'>
                      <p className=''>Total</p>
                    </div>
                    <div className='th'>
                      <p className=''>Apartado</p>
                    </div>
                    <div className='th'>
                      <p className=''>DV</p>
                    </div>
                  </div>
                </div>
                <div className='table__body'>
                  {art?.almacenes?.map((x: any, index: number) => (
                    <div className='tbody__container' key={index}>
                      <div className='tbody'>
                        <div className='td'>
                          {x.nombre}
                        </div>
                        <div className='td'>
                          {x.restante}
                        </div>
                        <div className='td'>
                          {x.apartado}
                        </div>
                        <div className='td'>
                          {x.disponible}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))) : ''}



      </div>
    </div>
  )
}

export default ExistenciaAlmacen
