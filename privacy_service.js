/**
* Type: Microservice
  Version: 0.0.1a
  Description: Microservice to interface Cititen eID with the rest of the system
**/
const express = require('express'), bodyParser = require('body-parser');
const app = express();
const port = 3000;
const EventEmitter = require("events").EventEmitter;
var fs = require('fs');
var PRIV_POLICY = JSON.parse(fs.readFileSync('config/privacy_policy.json', 'utf8'));

app.use(bodyParser.json());

app.get('/', (request, response) => {
  response.send("Persona Core - Privacy Policy Microservice - Version 0.0.1a");
});

  //E-ID MODULE
app.get('/eid/:citid/:field', (request, response) => {
  var citid = request.params["citid"];
  var field = request.params["field"];
  /* TODO
  /* - Add logic here to check the file and report back */
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
});
