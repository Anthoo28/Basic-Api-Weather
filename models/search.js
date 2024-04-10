const fs= require('fs')

const axios=require('axios');
class Searchs{
    historial=[];
     dbPath='./db/database.json';

    constructor(){
        //TODO: leer DB
        this.leerDB();
    }
    get historialCapitalizado(){
        return this.historial.map(lugar=>{

            let palabras= lugar.split(' ');
            palabras= palabras.map(p => p[0].toUpperCase() + p.substring(1));
            return palabras.join(' ')

        });
    }
    get paramMapBox(){
        return{
            'proximity':'ip',
            'language': 'es',
            'access_token':process.env.MAPBOX_KEY,
        }
    }
    get paramOpenWeather(){
        return{
            'appid':process.env.OPENWEAHTER_KEY,
            'units':'metric',
            'lang':'es'
        }
    }

    async ciudad(lugar=''){
        try {

            const intance= axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar}.json`,
                params:this.paramMapBox            
            });
            const resp =await intance.get();
            return resp.data.features.map(lugar=>({
                id: lugar.id,
                nombre:lugar.place_name,
                lng:lugar.center[0],
                lat: lugar.center[1],
            }))
  
            
        } catch (error) {
            return [];
        }
        //http peticion
        
    }

     async climaLugar(lat, lon){
        try {

            //intance axios.create()
            const instance= axios.create({
                baseURL:`https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramOpenWeather,lat,lon}
            });
            
            //resp.data
            const resp= await instance.get();
            const {weather, main}= resp.data;

            return{
                desc:weather[0].description,
                min:main.temp_min,
                max:main.temp_max,
                temp:main.temp
            }

        } catch (error) {
            console.log(error)
        }
     }


     agregarHistorial(lugar=''){

        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }
        this.historial=this.historial.splice(0,5);
        //todo: prevenir duplicados
        this.historial.unshift(lugar.toLocaleLowerCase());

        //Grabar en BD
      this.guardarDB();
     }

     guardarDB(){
        const payload={
            historial:this.historial
        }
        fs.writeFileSync(this.dbPath,JSON.stringify(payload));

    }

    leerDB(){
        if(!fs.existsSync(this.dbPath)){
            return ;
        }
        const info=fs.readFileSync(this.dbPath,{encoding:'utf-8'});
        const data=JSON.parse(info);
        this.historial=data.historial;
    }


}






module.exports = Searchs;