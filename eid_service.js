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
var axios = require('axios');
let axeCFG = { timeout: 1000 };
var app = express();
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
        axios.post('http://localhost/notify', {
            notification: 'eid_service',
            message: 'CARD_INSERTED'
        },axeCFG).then(function (response) {
            //console.log(response.data);
        })
        .catch(function (error) {
            //console.log(error);
        });  
    },
    function() {
        axios.post('http://localhost/notify', {
            notification: 'eid_service',
            message: 'CARD_REMOVED'
        },axeCFG).then(function (response) {
            //console.log(response.data);
        })
        .catch(function (error) {
            //console.log(error);
        })
    }
);


app.get('/identity/:PIN_ADDRESS', function(req, res) {
    if (pcsc.getReader().card_present == true) {        
        if (req.params.PIN_ADDRESS !== '') {
            pcsc.readIdentity(req.params.PIN_ADDRESS).then(address => {
                res.send(address);
            });
        }
        else {
            res.send({"error" : "no_identity_pin_given"});
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
            res.send({"error" : "no_address_pin_given"});
        }
    }
    else {
        res.send({"error" : "no_card_present"});
    }
});

app.get('/status',function(req, res) {
    if (!pcsc.getReader()) res.send({"error": "no_card_reader"});
    else {        
        res.send(pcsc.getReader());
    }
    
});

/*metodos
Ao inserir o cartão de cidadão
    - O web interface pede o PIN da Identificação
        - Ao receber a Identificação é invocado o método ident com o serialDocumentNumber
            - O servidor pergunta ao secPack se este serialDocumentNumber existe.
                - Se existir
                    - Dá as boas vindas ao utilizador no web interface
                    - ...
                - Se não existir
                    - Perguntar ao Web Interface se quer gravar este cartão no sistema
                        - Se sim 
                            - Pede o Pin da Morada
                            - Cria um registo de Pessoa no SeckPack
                            - Prepara a directoria de Pessoa no SeckPack
                            - Informa o utilizador que os dados foram registados