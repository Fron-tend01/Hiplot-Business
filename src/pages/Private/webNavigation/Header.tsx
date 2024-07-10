import './styles/Header.css';
import './styles/WebNavigation.css'
import { storeWebPages } from "../../../zustand/WebPages";
import { useEffect, useState } from "react";

const Header = () => {
  const { getWeb }: any = storeWebPages();
  const id_sucursal = storeWebPages((state: any) => state.id_sucursal);
  const [data, setData] = useState<any>(null);
  
  useEffect(() => {
    const fetchData = async () => {
        if (id_sucursal !== undefined) {
          localStorage.setItem('id', JSON.stringify(id_sucursal));
        }
        
        const id_suc = await localStorage.getItem('id');

        // Llama a la función asincrónica getWeb y espera su resultado antes de continuar
        const webData = await getWeb(id_suc);
        await setData(webData)
        console.log(data)
    };

    // Llama a la función fetchData al montar el componente o cuando id_sucursal cambie
    fetchData();
  }, [id_sucursal, ]);
  






  return (
    <header className='hero__web' >
      <form className='hero__web_container'>
        <div className='left__hero'>
          <div className='back_web-page'>
            <svg xmlns="http://www.w3.org/2000/svg" width='20' fill='#9b9b9b' viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
          </div>
          <div className='active__container'>
            <svg xmlns="http://www.w3.org/2000/svg" width='16' fill='#29845a' viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"/></svg>
            <p>Activa</p>
          </div>
        </div>
        <nav className='nav__hero_web'>
            <ul className='nav__links_web'>
              <div>
                <svg id="fi_7835702" viewBox="0 0 24 24" width="25"  xmlns="http://www.w3.org/2000/svg"><path d="m18 4v16c0 1.1046-.8954 2-2 2h-8c-1.1046 0-2-.8954-2-2v-16c0-1.1046.8954-2 2-2h8c1.1046 0 2 .8954 2 2z" fill="#fff"></path><path d="m16 1.5h-8c-1.3789 0-2.5 1.1216-2.5 2.5v16c0 1.3784 1.1211 2.5 2.5 2.5h8c1.3789 0 2.5-1.1216 2.5-2.5v-16c0-1.3784-1.1211-2.5-2.5-2.5zm1.5 18.5c0 .8271-.6729 1.5-1.5 1.5h-8c-.8271 0-1.5-.6729-1.5-1.5v-16c0-.8271.6729-1.5 1.5-1.5h1.25l.4736.9472c.1694.3388.5156.5528.8944.5528h2.7639c.3788 0 .725-.214.8944-.5528l.4736-.9472h1.25c.8271 0 1.5.6729 1.5 1.5v16zm-3-2c0 .2764-.2236.5-.5.5h-4c-.2764 0-.5-.2236-.5-.5s.2236-.5.5-.5h4c.2764 0 .5.2236.5.5z" ></path></svg>
              </div>
              <div>
                <svg id="fi_4529370" viewBox="0 0 48 48" width="25"  xmlns="http://www.w3.org/2000/svg"><path d="m41 6h-34a4 4 0 0 0 -4 4v22a4 4 0 0 0 4 4h11.87l-.75 6h-4.12a1 1 0 0 0 0 2h20a1 1 0 0 0 0-2h-4.12l-.75-6h11.87a4 4 0 0 0 4-4v-22a4 4 0 0 0 -4-4zm-36 4a2 2 0 0 1 2-2h34a2 2 0 0 1 2 2v19h-38zm22.87 32h-7.74l.75-6h6.23zm15.13-10a2 2 0 0 1 -2 2h-34a2 2 0 0 1 -2-2v-1h38z"></path></svg>
              </div>
            </ul>
        </nav>
      </form>
    </header>
  )
}

export default Header;
