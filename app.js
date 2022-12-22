import * as dotenv from 'dotenv';
dotenv.config();

import { inquirerMenu, leerInput, pausa } from "./helpers/inquirer.js";
import Busquedas from "./models/Busquedas.js";

const main = async() => {

    let opt;

    const busquedas = new Busquedas();

    do {

        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                // Mostrar mensaje para que la persona escriba.
                const lugar = await leerInput('Ciudad:');

                await busquedas.ciudad(lugar);

                // Buscar los lugares.
                // Seleccionar lugar.
                // Datos del clima.
                // Mostrar resultados.
                console.log('\nInformación de la Ciudad\n'.blue);
                console.log('Ciudad:',);
                console.log('Lat:',);
                console.log('Lng:',);
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