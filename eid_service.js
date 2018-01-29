/**
* Type: Microservice
  Version: 0.0.1a
  Description: Microservice to interface Cititen eID with the rest of the system
**/
/*
  TODO:
    - Monitor Service
        - Pin failed response
    - 
*/

var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
let port = 3001;
var pcsc = require('./eid_pcsc_reader_monitor');

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
        //send status of card inserted
            //replace with socket io
            //trigger ident procedures
        expressWs.getWss().clients.forEach(function(client) {
            client.send(JSON.stringify({"severity":"success", "summary":"Status", "detail":"Card inserted."}));
        });
    },
    function() {
        //send status of card removed
            //replace with socket io
        expressWs.getWss().clients.forEach(function(client) {
            client.send(JSON.stringify({"severity":"warn", "summary":"Status", "detail":"Card removed."}));
        });
    }
);

app.ws('/status', function(ws, req) {
    console.log('Websocket connected.');
    // Note: All open websockets contained in expressWs.getWss().clients.
});

app.get('/identity/:PIN_ADDRESS', function(req, res) {
    if (pcsc.getReader().card_present == true) {        
        if (req.params.PIN_ADDRESS !== '') {
            pcsc.readIdentity(req.params.PIN_ADDRESS).then(address => {
                res.send(address);
            });
        }
        else {
            res.send({"error" : "no_identity_pin"});
        }
    }
    else {
        res.send({"error" : "no_card_present"});
    }
});

app.get('/address/:PIN_ADDRESS', function(req, res) {
    if (pcsc.getReader().card_present == true) {        
        if (req.params.PIN_ADDRESS !== '') {
            pcsc.readAddress(req.params.PIN_ADDRESS).then(address => {
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
    if (!pcsc.getReader()) res.send({"severity":"error", "summary":"Error", "detail":"Card reader not connected."});
    else {        
        res.send(pcsc.getReader());
    }
    
})

// --- for testing

app.get('/test', function(req, res) {
    expressWs.getWss().clients.forEach(function(client) {
        client.send(JSON.stringify({"severity":"warn", "summary":"Status", "detail":"Testing the websocket."}));
    });
    res.send('Status sent.');
});


/*metodos
 Criar uma homepage com socket.io fornecido pelo eid-core.js ( porta 103001 )

Ao inserir o cartão de cidadão
    - Invocar o método ident
        - Se o cartão de cidadão não existir deverá ser emitido via socket.io um pedido de registo do user, se quer registá-lo no sistema,
            - Se sim
                - A Webpage pede os pins de identidade e morada e pins de certificados
                    - Iniciar o registo da pessoa no repositório SecPack ( procedimento tem que ser cifrado bem como os dados no secpack têm de ser cifrados )
            - Se não
                - Ignora o processo.
                - Verificar se o cc está actualizado
            colocar uma pasta chamada www com a seguinte estrutura https://expressjs.com/en/starter/static-files.html
  */