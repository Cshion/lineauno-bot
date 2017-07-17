"use strict";
const moment     = require('moment-timezone');
const Operations = require("./operations");
const debug      = require("debug")("lineauno-bot:service");

function identificarHorario(dia){
	switch(dia){
		case 0:
			return "domingos";
		case 6:
			return "sabados";
		default:
			return "semana";
	}
}


module.exports = function(estacionIndex) {
	let date       = moment().tz("America/Lima");

	let horaminuto = date.format("HH:mm");
	let dia        = date.day();
	let horario    = identificarHorario(dia);

	debug("Hora y minuto del dia es %s",horaminuto);
	debug("El horario es %s",horario);

	let llegadas = Operations.obtenerProximaLlegada(estacionIndex , horario , horaminuto);
	let salidas  = Operations.obtenerProximaSalida(estacionIndex , horario , horaminuto);

	debug("Llegadas: %o",llegadas);
	debug("Salidas: %o",salidas);

	return {
		"llegadas" : llegadas[ "horarios" ] ,
		"salidas"  : salidas[ "horarios" ] ,
		"estacion" : llegadas[ "estacion" ]
	};
};