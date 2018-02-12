/**
* Type: Microservice
  Version: 0.0.1a
  Description: Microservice to interface Cititen eID with the rest of the system
**/
/*
  TODO:
    - Monitor Service
        - Pin failed response
    - Prepare a remote folder in secpack with the cards serial number
    - Register a person with type_human.json schema and upload it to secpack as type_human.json
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

app.get('/exists', function(req, res) { 
    pcsc.checkCard().then(result => {
        if (result == 0) {
            axios.post('http://localhost/notify', {
                notification: 'eid_service',
                message: 'CARD_NOT_EXISTS'
            },axeCFG).then(function (response) {
                //console.log(response.data);
            })
            .catch(function (error) {
                //console.log(error);
            });      
        }
        else {
            axios.post('http://localhost/notify', {
                notification: 'eid_service',
                message: 'CARD_EXISTS'
            },axeCFG).then(function (response) {
                //console.log(response.data);
            })
            .catch(function (error) {
                //console.log(error);
            });
        }
    }).catch(function (error) {
        console.error(error)
    });
})

app.get('/identity/:PIN_ID', function(req, res) {
    if (pcsc.getReader().card_present == true) {        
        if (req.params.PIN_ID !== '') {
            pcsc.readIdentity(req.params.PIN_ID).then(address => {
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

app.post('/register/:PIN_ID/:PIN_ADD' ,function(req, res) {
    if (pcsc.getReader().card_present == true) {                

        pcsc.readIdentity(req.params.PIN_ID).then(ident => {
            pcsc.readAddress(req.params.PIN_ADD).then(address => {
                pcsc.registerCard(ident,address)
            });
            /*res.send(address);*/
            res.send({"error" : "fake"});
        });      
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
                            - Informa o utilizador que os dados foram registados*/