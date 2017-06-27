"use strict";
const service = require("../lib/service");

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

module.exports = function(req,res) {
	let text = req.body[ "text" ];

	if ( !text ) {
		return res.send("");
	}

	let respuesta = service(text);
	let estacion  = respuesta[ "estacion" ];

	let attachments = formatoRespuesta(respuesta["llegadas"],respuesta["salidas"]);
	if(estacion){
		return res.json({
			"text":"Horarios de la estacion: "+estacion,
			attachments ,
			"response_type" : "in_channel"
		})
	}else{
		return res.send({
			"text":"Estacion no encontrada",
			"response_type" : "in_channel"
		});
	}

};