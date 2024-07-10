

export const UnitConverter = () => ({
  pz: (a: any, b: any, units: any) => {
    console.log('Entrada:', a, b, units);

    let unit = a;
    let amount = b;

    if (unit == 'PZA') {
      let result = amount;
      console.log('Total de unidades convertidas de piezas a piezas', result);
      return result;
    }

    if (unit == 'CAJA') {
      for (let x of units) {
        if (x.unidad == 'PZA') {
          let result = amount * x.equivalencia;
          console.log('x.equivalencia', x.equivalencia);
          console.log('Total de unidades convertidas de caja a piezas', result);
    
        }
        if (x.unidad == 'CAJA') {
          let result = amount * x.equivalencia;
          console.log('Total de unidades convertidas de piezas a cajas', result);
     
        }
    
      }
    }

    console.error('Unidad no soportada');
    return null;
  }
});

export default UnitConverter;
