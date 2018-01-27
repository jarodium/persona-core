/**
* Type: Microservice
  Version: 0.0.1a
  Description: Microservice to interface Cititen eID with the rest of the system
**/
/*
  TODO:
    - Monitor Service
        - Pin failed response
*/

var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
let port = 3001;
var pcsc = require('./eid_pcsc_reader_monitor');

//var Notifier = require('./dependencies/notifier');

//var notifier = new Notifier();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(port, function () {
  console.log('Startup complete. Listening on port '+port);
});

pcsc.registerReader(
    function() {
        expressWs.getWss().clients.forEach(function(client) {
            client.send(JSON.stringify({"severity":"success", "summary":"Status", "detail":"Card inserted."}));
        });
    },
    function() {
        expressWs.getWss().clients.forEach(function(client) {
            client.send(JSON.stringify({"severity":"warn", "summary":"Status", "detail":"Card removed."}));
        });
    }
);

app.ws('/status', function(ws, req) {
    console.log('Websocket connected.');
    // Note: All open websockets contained in expressWs.getWss().clients.
});

app.get('/card', function(req, res) {
    console.log(pcsc.getReader());
    if (!pcsc.getReader()) res.send({"severity":"error", "summary":"Error", "detail":"Card reader not connected."});
    else {
        // if not reading already, start reading of card:
        /*if (!notifier.getObservers('card')) {
            // WINDOWS PLATFORM ONLY, ADD ARTIFICIAL DELAY OF 0.75s
            /*setTimeout(function() {
            pcsc.readMaestro().then(tag57 => {
                notifier.notifyObservers('card', tag57);
            });
            // WINDOWS PLATFORM ONLY, ADD ARTIFICIAL DELAY OF 0.75s
            }, 750);*/
        /*}*/

        // add observer for card reading result
       /* notifier.addObserver('card-address', function(address) {
            console.log("ah");
            /*if (tag57) {
                res.send({
                    routingcode:  tag57.value.substr(3,5),
                    branch:       tag57.value.substr(5,3),
                    account:      tag57.value.substr(8,10),
                    shortaccount: tag57.value.substr(9,7),
                    subaccount:   tag57.value.substr(16,2),
                });
            } else {
                res.send({});
            }*/
       // });
    }
});

app.get('/address/:PIN_ADDRESS', function(req, res) {
    if (pcsc.getReader().card_present == true) {        
        if (req.params.PIN_ADDRESS !== '') {
            pcsc.readAddress(req.params.PIN_ADDRESS).then(address => {
                //notifier.notifyObservers('card-address', address);
                res.send(address);
            });
        }
        else {
            res.send({"error" : "no_address_pin"});
        }
    }
    else {
        res.send({"error" : "no_card_present"});
    }
});

app.get('/status',function(req, res) {
    res.send(pcsc.getReader());
})

// --- for testing

app.get('/test', function(req, res) {
    expressWs.getWss().clients.forEach(function(client) {
        client.send(JSON.stringify({"severity":"warn", "summary":"Status", "detail":"Testing the websocket."}));
    });
    res.send('Status sent.');
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