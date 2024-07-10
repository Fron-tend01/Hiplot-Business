import './styles/SmallBanner.css'

const SmallBanner = ({copyContainer, index}: any) => {

  return (
    <div className='small-banner_web' style={{ backgroundImage: `url(${copyContainer[index].imagen})` }}>
        <div className='title__container'>
            <div>
                <div className={`title__content ${copyContainer[index].textAlign1 || ''} ${copyContainer[index].fontWeight1}`} style={{ fontSize: `${copyContainer[index].fontSize1}px`, color: copyContainer[index].color1}}>{copyContainer[index].titulo}</div>
                <div className={`default__class_services ${copyContainer[index].textAlign2 || '' } ${copyContainer[index].fontWeight2}`}  style={{ fontSize: `${copyContainer[index].fontSize2}px`, color: copyContainer[index].color2}}>{copyContainer[index].imagen4}</div>
            </div>
        </div>
    </div>
  )
}

export default SmallBanner
