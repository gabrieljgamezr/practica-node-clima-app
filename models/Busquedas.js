// Se importan paquetes de Node.

// 'fs' se usa para crear y guardar archivos en el sistema.
import fs from 'fs';

// 'Axios' permite realizar peticiones a APIs de una manera más simplificada.
import axios from 'axios';

// Se crea la clase 'Búsquedas'.
export default class Busquedas {

    // Se declara el historia como un arreglo vacío.
    historial = [];
    // Se declara la dirección donde se almacenará el historial.
    dbPath = './db/database.json';

    // Al crear una instancia de la clase 'Busqueda' se ejecutará el metodo 'this.leerDB()'.
    constructor() {
        this.leerDB();
    }

    // Método para capitalizar las palabras del historial.
    get historialCapitalizado() {

        // Retorna cada palabra con la primera letra en mayúscula. Recorre el arreglo de historial con un '.map'.
        return this.historial.map(lugar => {

            // Se separa las palabras de un lugar dentro del arreglo por los espacios.
            let palabras = lugar.split(' ');

            /* Se recorre cada palabra y se le aplica el método '.toUpperCase()' a la primera letra de las palabras,
            luego se agrega el resto de la palabra a partir de la segunda posición. */ 
            palabras = palabras.map( palabra => palabra[0].toUpperCase() + palabra.substring(1));

            // Se retornan las palabras unidas por el espacio.
            return palabras.join(' ');

        });
    }

    // Los parámetros para realizar la petición a la API de mapas.
    get paramsMapbox() {
        return {
            'limit' : 5,
            'language' : 'es',
            'access_token' : process.env.MAPBOX_KEY
        }
    }

    // Método para buscar la ciudad con el termino proporcionado por el usuario.
    async ciudad(lugar = '') {

        try {

            // Se crea una instancia de Axios para realizar una petición a la API
            const instance = axios.create({
                // El URL de la API.
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                // los parametros que vienen del método 'get paramsMapbox()'.
                params: this.paramsMapbox
            });

            // Se espera respuesta la instancia de Axios que envia la petición a través de '.get()'.
            const respuesta = await instance.get();

            // Retorna un arreglo de objetos con los datos de las 5 ciudades resultantes de la petición a la API.
            return respuesta.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
            

        } catch (error) {
            // En caso de error, se retorna un arreglo vacío.
            return [];
        }
    
    }

    // Parametros para realizar la petición a la API de clima.
    get paramsOpenWeather() {
        return {
            'appid' : process.env.OPENWEATHER_KEY,
            'units' : 'metric',
            'lang' : 'es',
        }
    }

    // Método para obtener la información del clima de la ciudad seleccionada por el usuario.
    async climaLugar( lat, lon ) {

        try {

            // Se crea una instancia de Axios para realizar la petición a la API.
            const instance = axios.create({
                // El URL de la API.
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                /* los parametros que vienen del método 'get paramsOpenWeather()' más la latitud y longitud que se recibe
                como parametros de la función */
                params: {...this.paramsOpenWeather, lat, lon}
            });

            // Se espera respuesta de la API enviando la petición a través del método '.get()'.
            const respuesta = await instance.get();

            // De la data que trae la respuesta se extraen dos arreglos 'weather' para la descripción y 'main' para los datos del clima.
            const {weather, main} = respuesta.data;

            // Se retorna un objeto con la información que se trajo de la petición a la API.
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
            
        } catch (error) {
            // En caso de error, muestra el mensaje de error en consola.
            console.log(error);
        }

    }

    // Método para agregar el lugar seleccionado por el usuario al historial de búsquedas.
    agregarHistorial(lugar = '') {
        // si ya está incluido en el historial, no retorna nada.
        if(this.historial.includes(lugar.toLowerCase())) {
            return;
        }

        // Con '.splice()' se mantienen solo las 6 últimas búsquedas en el historial.
        this.historial = this.historial.splice(0,5);

        // Se agrega al principio del arreglo el lugar seleccionado por el usuario. Todo en minúscula.
        this.historial.unshift(lugar.toLowerCase());

        // Ejecuta el método 'guardar()'.
        this.guardarDB();
    }

    // Método para guardar el historial en un archivo '.json'.
    guardarDB() {

        const payload = {
            historial: this.historial
        };
        
        // Se guarda en la dirección del 'this.dbPath' el historial de búsquedas.
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));

    }

    // Método para leer el historial que estará almacenado en el archivo '.json' dentro de la carpeta 'db'
    leerDB() {

        // Si no existe el archivo no retornará nada.
        if(!fs.existsSync(this.dbPath)) return;
        
        // Código para almacenar en el arreglo 'historia' lo que esté en el archivo '.json'.
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse(info);
        this.historial = data.historial;

    }

}