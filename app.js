require('dotenv').config()

const {  inquirerMenu, pausa, leerInput, listarLugares } = require("./helpers/inquirer");
const Searchs = require("./models/search");


const main =async()=>{
  const searchs= new Searchs();
  let opt;

  do{
    opt=await inquirerMenu();
    switch(opt){
      case 1:
        //mostar lugar 
        const termino= await leerInput('Ciudad:');
        //buscar lugares
        const lugares= await searchs.ciudad(termino);
        //seleccionar lugar
        const id = await listarLugares(lugares);
        if(id==='0')continue;
        //
        const lugarSel=lugares.find(l => l.id===id);
        searchs.agregarHistorial(lugarSel.nombre);
        //clima

        const clima= await searchs.climaLugar(lugarSel.lat,lugarSel.lng);
        //mostrar resultados
        console.log("\nInformacion de la ciudad\n".green);
        console.log("Ciudad: ", lugarSel.nombre.red);
        console.log("Lat: ",lugarSel.lat);
        console.log("Lng: ",lugarSel.lng);
        console.log("Temperatura: ",clima.temp);
        console.log("Mínima: ",clima.min);
        console.log("Máxima: ",clima.max);
        console.log("Cómo está el clima: ",clima.desc.blue);

        break;

       case 2:
          searchs.historialCapitalizado.forEach((lugar,i)=>{
            const idx= `${i+1}.`.green;
            console.log(`${idx} ${lugar}`);
          })
        break;
        
    }
     if(opt !== 0) await pausa();
  }
  while (opt !== 0);

}

main();