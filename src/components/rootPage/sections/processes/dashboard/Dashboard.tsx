import React, { useEffect, useState, useMemo } from 'react';
import './Dashboard.css';
import logo from '../../../../../assets/HI SOFT BIENVENIDA-14.png';

const Dashboard = () => {
  const [showBienvenida, setShowBienvenida] = useState(false);
  const colores = ["#0984e3", "#d63031", "#00b894"]; // un color por serie

  useEffect(() => {
    const yaMostrado = localStorage.getItem('bienvenida-mostrada');
    if (!yaMostrado) {
      setShowBienvenida(true);
      localStorage.setItem('bienvenida-mostrada', 'true');
    }
  }, []);

  const volverAMostrarBienvenida = () => {
    setShowBienvenida(true);
  };

  const GraficaBarras = ({ datos }) => {
    const alto = 200;
    const anchoBarra = 40;
    const espacio = 20;

    // Normaliza datos para que escalen al alto de la gráfica
    const maxValor = Math.max(...datos);
    const escala = alto / maxValor;

    return (
      <svg width={(anchoBarra + espacio) * datos.length} height={alto}>
        {datos.map((valor, i) => {
          const altura = valor * escala;
          const x = i * (anchoBarra + espacio);
          const y = alto - altura;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={anchoBarra}
                height={altura}
                fill="#6c5ce7"
                style={{
                  transition: "all 0.5s ease",
                }}
              />
              <text
                x={x + anchoBarra / 2}
                y={alto - 5}
                fontSize="12"
                textAnchor="middle"
                fill="#333"
              >
                {valor}
              </text>
            </g>
          );
        })}
      </svg>
    );

  };
  const LineChart = ({ series, labels }) => {
    const width = 600;
    const height = 300;
    const padding = 40;

    // Encuentra el valor máximo de todas las series
    const maxValor = useMemo(
      () =>
        Math.max(
          ...series.flatMap((serie) => serie.valores)
        ),
      [series]
    );

    // Escala vertical (y)
    const escalaY = (valor) =>
      height - padding - (valor / maxValor) * (height - 2 * padding);

    // Escala horizontal (x)
    const escalaX = (index) =>
      padding + (index * (width - 2 * padding)) / (labels.length - 1);

    return (
      <svg width={width} height={height} style={{ border: "1px solid #ccc" }}>
        {/* Ejes */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#444"
        />
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#444"
        />

        {/* Líneas de datos */}
        {series.map((serie, i) => (
          <polyline
            key={i}
            fill="none"
            stroke={colores[i % colores.length]}
            strokeWidth="2"
            points={serie.valores
              .map((val, j) => `${escalaX(j)},${escalaY(val)}`)
              .join(" ")}
          />
        ))}

        {/* Puntos y etiquetas */}
        {series.map((serie, i) =>
          serie.valores.map((val, j) => (
            <circle
              key={`${i}-${j}`}
              cx={escalaX(j)}
              cy={escalaY(val)}
              r={4}
              fill={colores[i % colores.length]}
            />
          ))
        )}

        {/* Etiquetas de tiempo */}
        {labels.map((label, i) => (
          <text
            key={i}
            x={escalaX(i)}
            y={height - 10}
            fontSize="12"
            textAnchor="middle"
          >
            {label}
          </text>
        ))}
      </svg>
    );
  };
  const series = [
    { nombre: "Producto A", valores: [10, 20, 15, 30, 25, 35] },
    { nombre: "Producto B", valores: [5, 15, 20, 25, 22, 30] },
    { nombre: "Producto C", valores: [8, 12, 18, 24, 20, 28] },
  ];

  const labels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];

  const [datos, setDatos] = useState([10, 40, 25, 50, 30]);

  const cambiarDatos = () => {
    // Generar nuevos datos aleatorios
    const nuevos = Array.from({ length: 5 }, () =>
      Math.floor(Math.random() * 60 + 10)
    );
    setDatos(nuevos);
  };
  return (
    <div className='dashboard'>
      {showBienvenida && (
        <div className="bienvenida-overlay" onClick={() => setShowBienvenida(false)}>
          <div className="bienvenida-content" onClick={(e) => e.stopPropagation()}>
            <img src={logo} alt="Logo" />
            {/* <ul>
              <li>✅ Puedes modificar máximos y mínimos desde el reporte de almacén</li>
              <li>🎨 Nueva interfaz gráfica mejorada</li>
              <li>🛠️ Correcciones internas de base de datos</li>
            </ul> */}
            <button onClick={() => setShowBienvenida(false)}>Cerrar</button>
          </div>
        </div>
      )}

      <div className='dashboard__container'>
        <button onClick={volverAMostrarBienvenida} className='btn__mostrar-bienvenida'>
          Volver a mostrar bienvenida
        </button>
        {/* Aquí podrías incluir más contenido del dashboard */}
        {/* <div className='row'>
          <div className='col-6 m-5'>
            <div style={{ textAlign: "center", border: 'ridge', }}>
              <h2>Gráfica de Barras sin Librerías</h2>
              <GraficaBarras datos={datos} />
              <button onClick={cambiarDatos} style={{ marginTop: "20px" }}>
                Cambiar datos
              </button>
            </div>
          </div>
          <div className='col-6 '>
            <div style={{ textAlign: "center" }}>
              <h2>Gráfica de Línea Comparativa</h2>
              <LineChart series={series} labels={labels} />
            </div>
          </div>
        </div> */}


      </div>
    </div>
  );
};

export default Dashboard;
