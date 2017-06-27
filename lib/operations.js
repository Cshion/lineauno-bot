"use strict";
const data        = require("../data/data.json");
const levenshtein = require('fast-levenshtein');
const natural     = require('natural');

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



function obtenerEstacionIndex(nombreEstacion) {
	let max_distance = 3;
	let estacionIndx = -1;

	nombreEstacion = nombreEstacion.toLowerCase();

	estacionesNombres.forEach(function(estacion,index){
		estacion = estacion.toLowerCase();
		let distance = natural.LevenshteinDistance(nombreEstacion,estacion);
		console.log(nombreEstacion,estacion,distance);
		if(distance<max_distance){
			max_distance = distance;
			estacionIndx = index;
		}
	});

	return estacionIndx;
}

Operations.obtenerProximo = function (direccion) {
	return function (nombreEstacion , fechaReferencia , horaMinuto) {
		let indexEstacion = obtenerEstacionIndex(nombreEstacion);
		if ( indexEstacion == -1 ) {
			return {"horarios":[],"estacion":null};
		}

		let proximos          = data[ fechaReferencia ][ indexEstacion ][ direccion ];
		let indiceInitProximo = buscarIndiceProximo(proximos , horaMinuto);
		let result            = [];

		if(indiceInitProximo==-1){
			indiceInitProximo=0;
		}

		result = proximos.slice(indiceInitProximo,indiceInitProximo+3);

		return {"horarios":result,"estacion":data[ fechaReferencia ][ indexEstacion ]["nombre"]};
	}
};

Operations.prototype.obtenerProximaSalida = function (nombreEstacion , fechaReferencia , horaMinuto) {
	return Operations.obtenerProximo("salidas")(nombreEstacion , fechaReferencia , horaMinuto);
};

Operations.prototype.obtenerProximaLlegada = function (nombreEstacion , fechaReferencia , horaMinuto) {
	return Operations.obtenerProximo("llegadas")(nombreEstacion , fechaReferencia , horaMinuto);
};



module.exports = new Operations;