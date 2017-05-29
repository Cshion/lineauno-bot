"use strict";
const request = require("request");
const cheerio = require("cheerio");
const async = require("async");

const HORARIOS_URL = {
    "semana":"http://www.lineauno.pe/horarios/lunes-viernes"
};

let data = {};



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
            let tableLlegada = tables.eq(0);
            let tableSalida = tables.eq(1);

            tableLlegada.each(function(i,elem){
                let t = $(this);
                console.log(t.html())
            });

            return next();
        }
    ],function(err,data){
        if(err){
            return cb(err);
        }
        return cb(null,data);
    });
}

crawlEstacion("http://www.lineauno.pe/horarios/lunes-viernes/villa-el-salvador",function(err,data){
    if(err){
        console.error(err);
    }else{
        console.log(data);
    }
});

let resultado = [];
/*
async.eachOf(HORARIOS_URL,function(horarioUrl,horarioFecha,next){
    async.waterfall([
        async.apply(crawlMain,horarioUrl),
        function(horarioData,next){
            async.each(
                horarioData,
                function(hD,done){
                    crawlEstacion(hd["url"],function(err,estacionData){
                        console.log(estacionData);
                        done();
                    });
                },
                function(){
                    return next();
                });
        }
    ]);
});
*/







