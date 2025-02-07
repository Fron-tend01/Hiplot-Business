import { motion } from 'framer-motion';
import './LoadingInfo.css';
import Logo from '../../assets/HI SOFT LOGO-12.svg'

const LoadingInfo = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <img src={Logo} alt="Cargando" className="loading-image" />
        <div className="loading-box">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="loading-square"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingInfo;
