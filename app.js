"use strict";
const app                 = require("express")();
const bodyParser          = require("body-parser");
const slackController     = require("./controllers/slack");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));


app.post("slack" , slackController.showMenu);
app.post("slack_menu",slackController.sendResponse);

module.exports = app;
