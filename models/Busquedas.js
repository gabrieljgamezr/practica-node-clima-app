import axios from 'axios';

export default class Busquedas {

    historial = ['Caracas', 'Puerto Ordaz','San Antonio de los Altos'];

    constructor() {
        // Leer base de datos si existe.
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

}