// Se importan paquetes que han sido instalados.

// 'dotenv' es utilizado para configurar y crear variables de entorno.
import * as dotenv from 'dotenv';

// Se configura para el programa lea las variables de entorno del archivo '.env'.
dotenv.config();

// Se importan funciones y clases creadas por uno mismo.

import { inquirerMenu, leerInput, listarLugares, pausa } from "./helpers/inquirer.js";
import Busquedas from "./models/Busquedas.js";

// Función principal del programa donde se ejecutará todo el código. Es una función asíncrona.
const main = async() => {

    // Se declara la opción para el menú.
    let opt;

    // Se crea una instancia 'busquedas' de la clase 'Busquedas'.
    const busquedas = new Busquedas();

    // Ciclo 'do-while' para generar el menú.
    do {

        // Se muestra el menú con las opciones y se espera a que el usuario elija la opción.
        opt = await inquirerMenu();

        // Bloque 'switch-case' para cada opción del menú.
        switch (opt) {

            case 1:
                // Se espera a que el usuario ingrese el nombre de la ciudad que quiere buscar.
                const termino = await leerInput('Ciudad:');

                // Se espera a que la petición a la API de respuesta de lugares según el término ingresado por el usuario.
                const lugares = await busquedas.ciudad(termino);

                // Se muestra la lista de lugares para que el usuario seleccione de cual quiere obtener información.
                const id = await listarLugares(lugares);

                // Si es '0' continúa con la interación del ciclo.
                if(id === '0') continue;

                // según la opción del usuario. Se selecciona el lugar que tenga el mismo 'id' que el usuario seleccionó.
                const lugarSeleccionado = lugares.find( l => l.id === id);
                
                // Se guarda en el historia el nombre del lugar seleccionado por el usuario.
                busquedas.agregarHistorial(lugarSeleccionado.nombre);

                /* Se espera a que la petición de la API del clima de respuesta al clima del lugar seleccionado
                por el usuario según su latitud y longitud. */
                const clima = await busquedas.climaLugar( lugarSeleccionado.lat, lugarSeleccionado.lng );

                // Se muestra toda la información del lugar seleccionado por el usuario.
                console.clear();
                console.log('\nInformación de la Ciudad\n'.blue);
                console.log('Ciudad:', lugarSeleccionado.nombre.blue);
                console.log('Lat:', lugarSeleccionado.lat);
                console.log('Lng:', lugarSeleccionado.lng);
                console.log('Temperatura: ', clima.temp);
                console.log('Mínima: ', clima.min);
                console.log('Máxima: ', clima.max);
                console.log('Cómo está el clima: ', clima.desc);

                // Se pausa el programa hasta que el usuario de 'enter'.
                await pausa();

                // Termina el 'case'.
                break;

            case 2:

                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${i+1}.`.blue;
                    console.log(`${idx} ${lugar}`);
                });

                // Se pausa el programa hasta que el usuario de 'enter'.
                await pausa();

                // Termina el 'case'.
                break;
                
            case 0:
                
                // Termina el 'case'.
                break;

        }
        
    //El bucle se repetira hasta que la opción sea distinta de 0. Si es 0 termina el programa.
    } while (opt !== 0);

}

main();