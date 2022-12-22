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

            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });

            const respuesta = await intance.get();

            console.log(respuesta.data);

            return []; // Regresar los lugares que coincidan

        } catch (error) {
            return [];
        }

        
    }

}