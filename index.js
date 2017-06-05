"use strict";
const Operations = require("./operations");
const app        = require("express")();
const bodyParser = require("body-parser");
const moment     = require('moment-timezone');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.post("/",function(req,res){
  let text       = req.body["text"];
  
  if(!text){
    return res.send("");
  }

  let date = moment().tz("America/Lima").format("HH:mm"); 
  let llegada = Operations.obtenerProximaLlegada(text,"semana",date);
  let salida  = Operations.obtenerProximaSalida(text,"semana",date);

  if(!llegada || !salida){
    return res.send("");
  }

  let text_result = "Proxima llegada: " + llegada +"\n"+ "Proxima salida: "+salida ;

  let result     = {
    color:"good",
    text:text_result,
    mrkdwn_in:["text"],
    response_type: "in_channel",
  }

  return res.json(result)
});

app.listen(5001,function(){
  console.log("Bot corriendo en 3000");
});