require('dotenv').config()

const { leerInput, inquirerMenu, pausa, listarLugares, climaLugar, agregarHistorial } = require("./helpers/inquirer");

const Busquedas = require("./models/busquedas");

const main = async() => {

    const busquedas= new Busquedas();

    let opt;


    do{
        opt = await inquirerMenu();
        
        switch ( opt ) {
            case 1:
                // mostrar mensaje
                const termino = await leerInput('Ciudad: ');
                // buscar el lugar
                const lugares = await busquedas.ciudad(termino);
                // selecionar el lugar
                const id = await listarLugares(lugares);
                if( id === '0' ) continue;

                const lugarSel = lugares.find( l => l.id === id);

                // guardar en DB
                busquedas.agregarHistorial(lugarSel.nombre);

                // clima
                const clima = await busquedas.climaLugar( lugarSel.lat, lugarSel.lng);
                console.log(clima);
                

                console.log({id});
                
                // mostrar resultados
                console.clear();
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre );
                console.log('Lat:',  lugarSel.lat );
                console.log('Log:',lugarSel.lng );
                console.log('Temperatura:', clima.temp);
                console.log('Minima:', clima.min );
                console.log('Maxima:', clima.max);
                console.log('Como se ve el clima:', clima.desc.green);

                
             break;
        
            case 2: 
               busquedas.historial.forEach((lugar, i) => {
                const idx =`${i+1}`.green;
                console.log(`${idx} ${lugar}`);
               })
  

             break;
        }

      if ( opt !== 0 ) await pausa();

    } while ( opt !== 0)

   
}

main();