"use strict";
const request = require("request");
const cheerio = require("cheerio");
const async   = require("async");
const fs      = require("fs");
const util    = require("util");
const path    = require("path");

const HORARIOS_URL = {
    "semana"  : "http://www.lineauno.pe/horarios/lunes-viernes",
    "sabados" : "http://www.lineauno.pe/horarios/sabados",
    "domingos": "http://www.lineauno.pe/horarios/domingos-feriados"
};

let data = {};

console.info("Empezando a sacar datos de horarios...");

function crawlMain(urlMain,cb){
    let mainData = [];
    async.waterfall([
        function(next){
            request.get(urlMain,function(err,response,body){
                return next(null,body);
            });
        },
        function(html,next){
            let $ = cheerio.load(html);
            let listTable = $("div[class=list-horarios]>ul>li");
            listTable.each(function(i,elem){
                let estacionDiv = cheerio.load(this);
                let estacionUrl = estacionDiv("li>a").attr("href").trim();
                let estacionNombre = estacionDiv("li>a>div").text().trim();

                mainData.push({
                    "url":estacionUrl,
                    "nombre":estacionNombre
                });
            });
            return next(null,mainData);
        }
    ],function(error,data){
        if(error){
            return cb(error);
        }
        return cb(null,data);
    });
}

function crawlEstacion(estacionUrl,cb){
    async.waterfall([
        function(next){
            request(estacionUrl,function(err,response,body){
                if(err){
                    return cb(err);
                }
                return next(null,body);
            });
        },
        function(estacionHtml,next){
            let $ = cheerio.load(estacionHtml);
            let tables = $("table[class=h_table]>tbody");
            let tableLlegada = tables.eq(0).children("tr").children("td").children("span");
            let tableSalida = tables.eq(1).children("tr").children("td").children("span");
            
            let horariosOut = {
                "llegadas": [],
                "salidas": []
            };

            tableLlegada.each(function(i,elem){
                let t = $(this);
                let horaLlegada = t.text().trim();
                horariosOut["llegadas"].push(horaLlegada);
            });

            tableSalida.each(function(i,elem){
                let t = $(this);
                let horaSalida = t.text().trim();
                horariosOut["salidas"].push(horaSalida);
            });

            return next(null,horariosOut);
        }
    ],function(err,data){
        if(err){
            return cb(err);
        }
        return cb(null,data);
    });
}


let resultado = {
    "semana" :[],
    "sabados":[],
    "domingos":[]
};

async.eachOfSeries(HORARIOS_URL,function(horarioUrl,horarioFecha,cb){
    console.log("Extrayendo datos de fecha..",horarioFecha);
    async.waterfall([
        async.apply(crawlMain,horarioUrl),
        function(horarioData,next){
            async.each(
                horarioData,
                function(hD,done){
                    console.log("Extrayendo datos de la estacion..",hD["nombre"]);
                    crawlEstacion(hD["url"],function(err,estacionData){
                        if(err){
                            return done(err);
                        }
                        estacionData["nombre"]  = hD["nombre"]
                        resultado[horarioFecha].push(estacionData);
                        done();
                    });
                },
                function(err){
                    if(err){
                        return next(err);
                    }
                    return next();
                });
        }
    ],cb);
},function(err){
    if(err){
        console.error(err);
    }
    
    fs.writeFile(path.resolve(__dirname,"data.json"), JSON.stringify(resultado), 'utf-8',function(err){
        if(err){
            console.error(err);
        }
        console.log("Listo!, se debio haber creado el archivo data.json");
    });
    
});








