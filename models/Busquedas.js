import fs from 'fs';

import axios from 'axios';

export default class Busquedas {

    historial = [];
    dbPath = './db/database.json';

    constructor() {
        // Leer base de datos si existe.
        this.leerDB();
    }

    get historialCapitalizado() {

        return this.historial.map(lugar => {

            let palabras = lugar.split(' ');
            palabras = palabras.map( palabra => palabra[0].toUpperCase() + palabra.substring(1));

            return palabras.join(' ');

        });
    }

    get paramsMapbox() {
        return {
            'limit' : 5,
            'language' : 'es',
            'access_token' : process.env.MAPBOX_KEY
        }
    }

    async ciudad(lugar = '') {

        try {

            // Petición HTTP.

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });

            const respuesta = await instance.get();

            return respuesta.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
            

        } catch (error) {
            return [];
        }
    
    }

    get paramsOpenWather() {
        return {
            'appid' : process.env.OPENWEATHER_KEY,
            'units' : 'metric',
            'lang' : 'es',
        }
    }

    async climaLugar( lat, lon ) {

        try {

            // Instancia de axios.create
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsOpenWather, lat, lon}
            });

            const respuesta = await instance.get();

            const {weather, main} = respuesta.data;

            // resp.data

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
            
        } catch (error) {
            console.log(error);
        }

    }

    agregarHistorial(lugar = '') {
        // Prevenir duplicados

        if(this.historial.includes(lugar.toLowerCase())) {
            return;
        }

        this.historial = this.historial.splice(0,5);

        this.historial.unshift(lugar.toLowerCase());

        //Grabar en DB
        this.guardarDB();
    }

    guardarDB() {

        const payload = {
            historial: this.historial
        };
        
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));

    }

    leerDB() {

        if(!fs.existsSync(this.dbPath)) return;

        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});

        const data = JSON.parse(info);

        this.historial = data.historial;

    }

}