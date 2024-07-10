import './styles/Banner.css'

const Banner = ({ copyContainer, index}: any) => {



  return (
    <div className='banner_web' style={{ backgroundImage: `url(${copyContainer[index].imagen})` }} >
      <div className='title__container'>
        <div className={`default__class_services ${copyContainer[index].textAlign1 || ''} ${copyContainer[index].fontWeight1}`} style={{ fontSize: `${copyContainer[index].fontSize1}px`, color: copyContainer[index].color1}}>
          {copyContainer[index].titulo.split('\n').map((line: any, lineIndex: any) => (
              <p key={lineIndex}>{line}</p>
            ))}
        </div>
      </div>    
    </div>
  )
}

export default Banner;
