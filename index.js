"use strict";
const fs    = require("fs");
const app   = require("./app");
const http  = require("http");
const debug = require("debug")("lineauno-bot:server");

if(fs.existsSync(".env")){
	require("dotenv").config();
}

let port = process.env.APP_PORT || 3000;
let host = process.env.APP_HOST || "localhost";
let server = http.createServer(app);

server.listen(port,host);

server.on("listening",function(){
	debug("Servidor escuchando en "+host+":"+port);
});