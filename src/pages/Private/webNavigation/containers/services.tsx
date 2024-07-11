import './styles/Services.css'
import '../styles/editor.css'

const services = ({editServices, copyContainer, index}: any) => {

  const editService = (x: number) => {
    editService(x)
  }
  
  return (
    <div className="services__web-page">

          <div className="row__one_web">
            <div className='item__service'>
              <div className='container__services_img_web-page' onClick={() => editServices(1)}>
                <div>
                  <img src={copyContainer[index].imagen} width={50} alt="" />
                </div>
              </div>
              <div className={`${copyContainer[index].textAlign1 || ''} ${copyContainer[index].fontWeight1}`} style={{ fontSize: `${copyContainer[index].fontSize1}px`, color: copyContainer[index].color1}}>
                <div className='item'>
                  {copyContainer[index].titulo}
                </div>
              </div>
              <div className={`${copyContainer[index].textAlign2 || ''} ${copyContainer[index].fontWeight2}`} style={{ fontSize: `${copyContainer[index].fontSize2}px`, color: copyContainer[index].color2}}>
                <div className='item'>
                  {copyContainer[index].titulo2}
                </div>
              </div>
            </div>
            <div className='item__service'  onClick={() => editServices(2)}>
              <div className='container__services_img_web-page'>
                <div>
                  <img src={copyContainer[index].imagen2} width={50} alt="" />
                </div>
              </div>
              <div className={`${copyContainer[index].textAlign3 || ''} ${copyContainer[index].fontWeight3}`} style={{ fontSize: `${copyContainer[index].fontSize3}px`, color: copyContainer[index].color3}}>
                <div className='item'>
                  {copyContainer[index].titulo3}
                </div>
              </div>
              <div className={`${copyContainer[index].textAlign4 || ''} ${copyContainer[index].fontWeight4}`} style={{ fontSize: `${copyContainer[index].fontSize4}px`, color: copyContainer[index].color4}}>
                <div className='item'>
                  {copyContainer[index].titulo4}
                </div>
              </div>
            </div>
            <div className='item__service'  onClick={() => editServices(3)}>
              <div className='container__services_img_web-page'>
                <div>
                  <img src={copyContainer[index].imagen3} width={50} alt="" />
                </div>
              </div>
              <div className={`${copyContainer[index].textAlign5 || ''} ${copyContainer[index].fontWeight5}`} style={{ fontSize: `${copyContainer[index].fontSize5}px`, color: copyContainer[index].color5}}>
                <div className='item'>
                  {copyContainer[index].titulo5}
                </div>
              </div>
              <div className={`${copyContainer[index].textAlign6 || ''} ${copyContainer[index].fontWeight6}`} style={{ fontSize: `${copyContainer[index].fontSize6}px`, color: copyContainer[index].color6}}>
                <div className='item'>
                  {copyContainer[index].titulo6}
                </div>
              </div>
            </div> 
          </div>  
            
    </div>
  )
}

export default services
