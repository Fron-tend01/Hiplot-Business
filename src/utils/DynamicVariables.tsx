import {Dispatch, SetStateAction } from 'react';
const DynamicVariables = {
    updateAnyVar: <T,>(setStateFunc: Dispatch<SetStateAction<T>>, key: keyof T, value: T[keyof T]) => {
        setStateFunc(prevState => ({
            ...prevState,
            [key]: value
          }));
    },
    updateAnyVarByIndex : (setStateFunc: Dispatch<SetStateAction<any[]>>, index: number, key: string, value: any) => {
        setStateFunc(prevState => {
            // Verificamos que prevState sea un arreglo
            if (!Array.isArray(prevState)) {
                console.error("El estado 'conceptos' no es un arreglo, no se puede actualizar.");
                return prevState;  // Si no es un arreglo, devolvemos el estado anterior sin cambios
            }
    
            // Creamos una copia inmutable de `prevState`
            const updatedState = [...prevState];
    
            // Actualizamos solo el objeto en el índice indicado
            updatedState[index] = {
                ...updatedState[index],
                [key]: value,
            };
    
            return updatedState;
        });
    }
    ,
    updateAnyVarSetArr: <T, K extends keyof T>(setStateFunc: React.Dispatch<React.SetStateAction<T>>, key: K, value: any) => {
        setStateFunc((prevState) => {
            const currentArray = prevState[key] as unknown as any[];
            if (!Array.isArray(currentArray)) {
                throw new Error(`Expected state[${String(key)}] to be an array, but got ${typeof currentArray}`);
            }
    
            return {
                ...prevState,
                [key]: [...currentArray, value],
            };
        });
    },
    updateAnyVarSetArrNoRepeat: <T, K extends keyof T>(setStateFunc: React.Dispatch<React.SetStateAction<T>>, key: K, value: any) => {
        setStateFunc((prevState) => {
            const currentArray = prevState[key] as unknown as any[];
            if (!Array.isArray(currentArray)) {
                throw new Error(`Expected state[${String(key)}] to be an array, but got ${typeof currentArray}`);
            }
            // Compara los objetos utilizando JSON.stringify para evitar duplicados
            const exists = currentArray.some(item => JSON.stringify(item) === JSON.stringify(value));
            if (exists) {
                return prevState; // No hace nada si el valor ya existe
            }

            return {
                ...prevState,
                [key]: [...currentArray, value],
            };
        });
    },
    addObjectInArrayRepeat: (object:any, array:Dispatch<SetStateAction<any[]>>) => {
        array((prevArray) => {
            return [...prevArray, object];
          });
    },
 
    addObjectInArrayNoRepeat: (object: any, setArray: React.Dispatch<React.SetStateAction<any[]>>) => {
        setArray((prevArray) => {
            const exists = prevArray.some((a) => JSON.stringify(a) === JSON.stringify(object));
            if (!exists) {
                return [...prevArray, object];
            }
            return prevArray;
        });
    },
    removeObjectInArray(setStateFunc: (updateFunc: any[] | ((prevArray: any[]) => any[])) => void, index: number): void {
        setStateFunc((prevArray) => {
            return Array.isArray(prevArray) ? prevArray.filter((_, i) => i !== index) : prevArray;
        });
    },
    removeObjectInArrayByKey: <T, K extends keyof T>(setStateFunc: React.Dispatch<React.SetStateAction<T>>,key: K, index: number) => {
        setStateFunc((prevState) => {
            const currentArray = prevState[key] as unknown as any[];
            if (!Array.isArray(currentArray)) {
                throw new Error(`Expected state[${String(key)}] to be an array, but got ${typeof currentArray}`);
            }
    
            return {
                ...prevState,
                [key]: currentArray.filter((_, i) => i !== index),
            };
        });
    },

    selects: (setFunc: any, key: any, index: number)  => {
        console.log(key, index)
        setFunc((_: any) => {
            
        })
    }
}

export default DynamicVariables;
