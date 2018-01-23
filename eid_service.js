/**
* Type: Microservice
  Version: 0.0.1a
  Description: Microservice to interface Cititen eID with the rest of the system
**/
const express = require('express'), bodyParser = require('body-parser');
const app = express();
const port = 3001;
const EventEmitter = require("events").EventEmitter;
var fs = require('fs');


app.use(bodyParser.json());

app.get('/', (request, response) => {
  response.send("Persona Core - Citizen EID Microservice - Version 0.0.1a");
});


app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
});


/*metodos
  validarCheckD
    -> recebe o numero
    -> devolve true / false
  ident -> identificar a pessoa utilizando um número
    -> recebe um número
    -> recebe um parametro de leitura
    -> valida o número
      -> sim
        -> verifica o ficheiro de privacidade se pode obter esta informação
          -> se sim
            -> saca informação
          -> se não
            -> emite um erro FAULT_PRIV_VIOL
      -> não
        -> emite um erro EID_ERR_CHECK_DIGIT
  init -> inicializa um novo cartão e registo no core
  update -> actualizar o cartão e registo no core
  */