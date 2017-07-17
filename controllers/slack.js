"use strict";
const service    = require("../lib/service");
const operations = require("../lib/operations");
const debug      = require("debug")("lineauno-bot:server");

const opciones = operations.estaciones.map(function(v,index){
	return {
		text:v,
		value:v
	}
});

function formatoRespuesta(llegadas,salidas){
	let attachments = [];
	attachments.push({
		"title": "Con direccion a Villa El Salvador",
		"text": llegadas.join("\n"),
		"mrkdwn_in": ["text"],
		"color":"good"
	});

	attachments.push({
		"title": "Con direccion a Bayóvar",
		"text": salidas.join("\n"),
		"mrkdwn_in": ["text"],
		"color":"danger"
	});

	return attachments;
}

module.exports.showMenu = function(req,res) {
	let r = {
		"text": "Escoge una estacion",
		"response_type": "in_channel",
		"attachments": [
			{
				"text": "Estaciones",
				"fallback": "Fallback",
				"color": "#3AA3E3",
				"attachment_type": "default",
				"callback_id": "game_selection",
				"actions": [
					{
						"name"    : "estacion_list" ,
						"text"    : "Escoge una estacion..." ,
						"type"    : "select" ,
						"options" : opciones
					}
				]
			}
		]
	};

	return res.json(r);
};

module.exports.sendResponse = function(req,res) {
	try{
		let payload = JSON.parse(req.body["payload"]);
		let indexEstacion = payload["actions"][0]["selected_options"][0]["value"];
		debug("indexEstacion:",indexEstacion);
		let respuesta = service(indexEstacion);
		let estacion  = respuesta[ "estacion" ];
		let attachments = formatoRespuesta(respuesta["llegadas"],respuesta["salidas"]);

		let resp = {
			"text"          : "Horarios de la estacion: " + estacion ,
			attachments ,
			"response_type" : "in_channel"
		};

		return res.json(resp);
	}catch(e){
		debug(e);
		return res.send("Hubo un error en obtener horario de la estacion..")
	}


};