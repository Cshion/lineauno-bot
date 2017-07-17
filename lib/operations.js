"use strict";
const data        = require("../data/data.json");

const estacionesNombres = data[ "semana" ].map(function (estacion) {
	return estacion[ "nombre" ];
});


function Operations() {}


function buscarIndiceProximo(proximos,horaMinuto){
	let l        = proximos.length;
	//NOTE : dummy search
	for ( let p = 0; p < l; p++ ) {
		let proximo = proximos[ p ];
		if ( proximo > horaMinuto ) {
			return p;
		}
	}

	return -1;
}

function buscarIndiceEstacion(fechaReferencia,nombreEstacion){
	let nombres = data[fechaReferencia];
	let s = nombres.length;
	for(let p=0;p<s;p++){
		if(nombres[p]["nombre"]==nombreEstacion){
			return p;
		}
	}
	return -1;
}


Operations.prototype.estaciones = estacionesNombres;

Operations.obtenerProximo = function (direccion) {
	return function (nombreEstacion , fechaReferencia , horaMinuto) {
		let indexEstacion = buscarIndiceEstacion(fechaReferencia,nombreEstacion);

		if(indexEstacion==-1){
			return null;
		}

		let proximos          = data[ fechaReferencia ][ indexEstacion ][ direccion ];
		let indiceInitProximo = buscarIndiceProximo(proximos , horaMinuto);

		if(indiceInitProximo==-1){
			indiceInitProximo=0;
		}

		let result = proximos.slice(indiceInitProximo,indiceInitProximo+3);

		return {"horarios":result,"estacion":data[ fechaReferencia ][ indexEstacion ]["nombre"]};
	}
};

Operations.prototype.obtenerProximaSalida = function (estacionIndex , fechaReferencia , horaMinuto) {
	return Operations.obtenerProximo("salidas")(estacionIndex , fechaReferencia , horaMinuto);
};

Operations.prototype.obtenerProximaLlegada = function (estacionIndex , fechaReferencia , horaMinuto) {
	return Operations.obtenerProximo("llegadas")(estacionIndex , fechaReferencia , horaMinuto);
};



module.exports = new Operations;