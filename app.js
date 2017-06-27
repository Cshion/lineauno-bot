"use strict";
const app                 = require("express")();
const bodyParser          = require("body-parser");
const slackController     = require("./controllers/slack");
const messengerController = require("./controllers/messenger");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));


app.post("/slack" , slackController);
app.post("/fbmessenger" , messengerController);

module.exports = app;
