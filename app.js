import * as dotenv from 'dotenv';
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
                // Mostrar resultados.
                console.log('\nInformación de la Ciudad\n'.blue);
                console.log('Ciudad:', lugarSeleccionado.nombre );
                console.log('Lat:', lugarSeleccionado.lat);
                console.log('Lng:', lugarSeleccionado.lng);
                console.log('Temperatura:',);
                console.log('Mínima:',);
                console.log('Máxima:',);
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