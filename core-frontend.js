/**
* Type: Server
  Version: 0.0.1a
  Description: Webserver
**/
var express = require('express'), bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
let port = 80;
app.io = io;
app.use(express.static('www'))
app.use(bodyParser.json());

http.listen(port, function () {
    console.log('Webserver online. Listening on port '+port);
});

io.on('connection', function(socket){
    //console.log('a user connected');
});

app.post('/notify',function(req,res) {
    console.log(req.body);
    req.app.io.emit('notification', req.body);    
})

app.get('/',function(req, res) {
    res.sendFile('index.html');
});

/*Core :80
    Inicia o servidor socket io

    A web page é um cliente

EID Serviço:
    Ao introduzir um cartão, o servico INVOCA um URL ( notify/:service/:message ) do Core
        Exemplos:
            notify/eid-service/CARD_INSERTED
            notify/eid-service/CARD_REMOVED
            notify/eid-service/CARDREADER_OK
            notify/eid-service/CARDREADER_ERR

    ou invoca o serviço notify com a payload json
        {
            service: "eid",
            message: "CARD_INSERTED"
        }

        assim qualquer chamada ao notify passa os dados para o cliente e tenho menos trabalho a preparar as respostas.
*/
        