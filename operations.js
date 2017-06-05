"use strict";
const data = require("./data.json");

const estacionesNombres = data["semana"].map(function(estacion){
  return estacion["nombre"];
});

function Operations(){

}

Operations.obtenerProximo = function(direccion){
  return function(nombreEstacion,fechaReferencia,horaMinuto){
    let indexEstacion = Operations.obtenerEstacionIndex(nombreEstacion);
    if(indexEstacion==-1){
      return null;
    } 

    let proximos = data[fechaReferencia][indexEstacion][direccion];
    let l = proximos.length;

    //NOTE : dummy search
    for(let p=0;p<l;p++){
      let proximo = proximos[p];
      if(proximo>horaMinuto){
        return proximo;
      }
    }
    
    return null;
  }
}

Operations.prototype.obtenerProximaSalida = function(nombreEstacion,fechaReferencia,horaMinuto){
  return Operations.obtenerProximo("salidas")(nombreEstacion,fechaReferencia,horaMinuto);
}

Operations.prototype.obtenerProximaLlegada = function(nombreEstacion,fechaReferencia,horaMinuto){
  return Operations.obtenerProximo("llegadas")(nombreEstacion,fechaReferencia,horaMinuto);
}

Operations.obtenerEstacionIndex  = function(nombreEstacion){
  //NOTE : Dummy solution
  return estacionesNombres.indexOf(nombreEstacion);
}


module.exports = new Operations;