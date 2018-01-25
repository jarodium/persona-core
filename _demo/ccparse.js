var fs = require('fs');




fs.readFile('cc_ze.txt', function (err, data) {
    if (err) throw err;    
    tipoMorada = data.toString("utf8",0,2);    
    codPais = data.toString("utf8",2,6);
    distritoCode = data.toString("utf8",6,10);
    distritoDesc = data.toString("utf8",10,110);
    concelhoCode = data.toString("utf8",110,118);
    concelhoDesc = data.toString("utf8",118,218);
    freguesiaCode = data.toString("utf8",218,230);
    freguesiaDesc = data.toString("utf8",230,330);
    ruaAbbr = data.toString("utf8",330,350);
    ruaTipo = data.toString("utf8",350,450);
    ruaDesc = data.toString("utf8",450,650);
    edificioAbbr = data.toString("utf8",650,670);
    edificio = data.toString("utf8",670,770);
    porta = data.toString("utf8",770,790); 
    andar = data.toString("utf8",790,830); 
		lado = data.toString("utf8",830,870); 
		lugar = data.toString("utf8",870,1070);   
    moradaCP1 = data.toString("utf8",1070,1078);    
    moradaCP2 = data.toString("utf8",1078,1084);    
    moradaLocal = data.toString("utf8",1084,1134);    
    numMor = data.toString("utf8",1134,1146);    

    console.log(numMor); 
  });
