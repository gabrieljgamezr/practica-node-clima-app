import * as dotenv from 'dotenv';
// import * as prueba from '/prueba.json';


dotenv.config();

import { inquirerMenu, leerInput, listarLugares, pausa } from "./helpers/inquirer.js";
import Busquedas from "./models/Busquedas.js";

const main = async() => {

    let opt;

    const busquedas = new Busquedas();

    do {

        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                // Mostrar mensaje para que la persona escriba.
                const termino = await leerInput('Ciudad:');

                // Buscar los lugares.

                const lugares = await busquedas.ciudad(termino);

                // Seleccionar lugar.

                const id = await listarLugares(lugares);
                const lugarSeleccionado = lugares.find( l => l.id === id);
                
                // Datos del clima.

                const clima = await busquedas.climaLugar( lugarSeleccionado.lat, lugarSeleccionado.lng );

                // Mostrar resultados.
                console.clear();
                console.log('\nInformación de la Ciudad\n'.blue);
                console.log('Ciudad:', lugarSeleccionado.nombre.blue);
                console.log('Lat:', lugarSeleccionado.lat);
                console.log('Lng:', lugarSeleccionado.lng);
                console.log('Temperatura: ', clima.temp);
                console.log('Mínima: ', clima.min);
                console.log('Máxima: ', clima.max);
                console.log('Cómo está el clima: ', clima.desc);
                await pausa();
                break;
            case 2:
                console.log('Eligió la segunda opción');
                await pausa();
                break;
            case 0:
                break;
        }
        
    } while (opt !== 0);

}

main();