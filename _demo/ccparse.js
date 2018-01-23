var fs = require('fs');

function processar(data,init,end) {
  var t = "";
  var fr = data.toString("utf8",init,end).split(" ");
  for (var i = 0; i < fr.length; i++) {
    skipa = false;
     
    if (fr[i] == "C2" || fr[i] == "C3") {      
      skipa = true;     
      fr[i] += fr[i+1];        
    } 
    t += Buffer.from(fr[i], 'hex').toString('utf8');  
        
    if (skipa === true) i++;      
  }
  return t;
}


fs.readFile('dump.txt', function (err, data) {
    if (err) throw err;

    /*tipoMorada = data.toString("utf8",0,2);
    tipoMorada = Buffer.from(tipoMorada, 'hex').toString('utf8');

    codPais = "";
    pais = data.toString("utf8",6,11).split(" ");
    for (var i = 0; i < pais.length; i++) {
      codPais += Buffer.from(pais[i], 'hex').toString('utf8');
    }

    distritoCode = "";
    fr = data.toString("utf8",18,24).split(" ");
    for (var i = 0; i < fr.length; i++) {
      distritoCode += Buffer.from(fr[i], 'hex').toString('utf8');
    }

    distritoDesc = "";
    fr = data.toString("utf8",30,330).split(" ");
    for (var i = 0; i < fr.length; i++) {
      skipa = false;
      
      if (fr[i] == "C2" || fr[i] == "C3") {
        //se fr[i] == C2 ou C3 // temos de avançar o i+1
        skipa = true;     
        fr[i] += fr[i+1];        
      } 
      distritoDesc += Buffer.from(fr[i], 'hex').toString('utf8');  
        
      if (skipa === true) i++;
    }

    concelho = "";
    fr = data.toString("utf8",330,341).split(" ");
    for (var i = 0; i < fr.length; i++) {
      concelho += Buffer.from(fr[i], 'hex').toString('utf8');
    }

    concelhoDesc = "";
    fr = data.toString("utf8",354,653).split(" ");
    for (var i = 0; i < fr.length; i++) {
      skipa = false;
      
      if (fr[i] == "C2" || fr[i] == "C3") {
        //se fr[i] == C2 ou C3 // temos de avançar o i+1
        skipa = true;     
        fr[i] += fr[i+1];        
      } 
      concelhoDesc += Buffer.from(fr[i], 'hex').toString('utf8');  
        
      if (skipa === true) i++;      
    }

    freguesia = "";
    fr = data.toString("utf8",655,690).split(" ");
    for (var i = 0; i < fr.length; i++) {
      freguesia += Buffer.from(fr[i], 'hex').toString('utf8');
    }

    freguesiaDesc = "";
    fr = data.toString("utf8",690,990).split(" ");
    for (var i = 0; i < fr.length; i++) {
      skipa = false;
      
      if (fr[i] == "C2" || fr[i] == "C3") {
        //se fr[i] == C2 ou C3 // temos de avançar o i+1
        skipa = true;     
        fr[i] += fr[i+1];        
      } 
      freguesiaDesc += Buffer.from(fr[i], 'hex').toString('utf8');  
        
      if (skipa === true) i++;      
    }

    ruaAbbr = "";
    fr = data.toString("utf8",990,1050).split(" ");
    for (var i = 0; i < fr.length; i++) {
      skipa = false;
      
      if (fr[i] == "C2" || fr[i] == "C3") {
        //se fr[i] == C2 ou C3 // temos de avançar o i+1
        skipa = true;     
        fr[i] += fr[i+1];        
      } 
      ruaAbbr += Buffer.from(fr[i], 'hex').toString('utf8');  
        
      if (skipa === true) i++;      
    }

    ruaTipo = "";
    fr = data.toString("utf8",1050,1350).split(" ");
    for (var i = 0; i < fr.length; i++) {
      skipa = false;
      
      if (fr[i] == "C2" || fr[i] == "C3") {
        //se fr[i] == C2 ou C3 // temos de avançar o i+1
        skipa = true;     
        fr[i] += fr[i+1];        
      } 
      ruaTipo += Buffer.from(fr[i], 'hex').toString('utf8');  
        
      if (skipa === true) i++;      
    }

    ruaDesc = "";
    fr = data.toString("utf8",1350,2310).split(" ");
    for (var i = 0; i < fr.length; i++) {
      skipa = false;
      
      if (fr[i] == "C2" || fr[i] == "C3") {
        //se fr[i] == C2 ou C3 // temos de avançar o i+1
        skipa = true;     
        fr[i] += fr[i+1];        
      } 
      ruaDesc += Buffer.from(fr[i], 'hex').toString('utf8');  
        
      if (skipa === true) i++;      
    }

    edificioAbbr = "";
    fr = data.toString("utf8",2310,2370).split(" ");
    for (var i = 0; i < fr.length; i++) {
      skipa = false;
      
      if (fr[i] == "C2" || fr[i] == "C3") {
        //se fr[i] == C2 ou C3 // temos de avançar o i+1
        skipa = true;     
        fr[i] += fr[i+1];        
      } 
      edificioAbbr += Buffer.from(fr[i], 'hex').toString('utf8');  
        
      if (skipa === true) i++;      
    }

    //falta isolar os campos door floor side place
      //no meu o andar é o que apanho neste range
    edificio = "";
    fr = data.toString("utf8",2370,2910).split(" ");
    for (var i = 0; i < fr.length; i++) {
      skipa = false;
      
      if (fr[i] == "C2" || fr[i] == "C3") {
        //se fr[i] == C2 ou C3 // temos de avançar o i+1
        skipa = true;     
        fr[i] += fr[i+1];        
      } 
      edificio += Buffer.from(fr[i], 'hex').toString('utf8');  
        
      if (skipa === true) i++;      
    }

    localidade = "";
    fr = data.toString("utf8",2910,3210).split(" ");
    for (var i = 0; i < fr.length; i++) {
      skipa = false;
      
      if (fr[i] == "C2" || fr[i] == "C3") {
        //se fr[i] == C2 ou C3 // temos de avançar o i+1
        skipa = true;     
        fr[i] += fr[i+1];        
      } 
      localidade += Buffer.from(fr[i], 'hex').toString('utf8');  
        
      if (skipa === true) i++;      
    }

    codigoPostal1 = "";
    fr = data.toString("utf8",3210,3234).split(" ");
    for (var i = 0; i < fr.length; i++) {
      skipa = false;
      
      if (fr[i] == "C2" || fr[i] == "C3") {
        //se fr[i] == C2 ou C3 // temos de avançar o i+1
        skipa = true;     
        fr[i] += fr[i+1];        
      } 
      codigoPostal1 += Buffer.from(fr[i], 'hex').toString('utf8');  
        
      if (skipa === true) i++;      
    }

    codigoPostal2 = "";
    fr = data.toString("utf8",3234,3252).split(" ");
    for (var i = 0; i < fr.length; i++) {
      skipa = false;
      
      if (fr[i] == "C2" || fr[i] == "C3") {
        //se fr[i] == C2 ou C3 // temos de avançar o i+1
        skipa = true;     
        fr[i] += fr[i+1];        
      } 
      codigoPostal2 += Buffer.from(fr[i], 'hex').toString('utf8');  
        
      if (skipa === true) i++;      
    }

    codigoPostal3 = "";
    fr = data.toString("utf8",3252,3402).split(" ");
    for (var i = 0; i < fr.length; i++) {
      skipa = false;
      
      if (fr[i] == "C2" || fr[i] == "C3") {
        //se fr[i] == C2 ou C3 // temos de avançar o i+1
        skipa = true;     
        fr[i] += fr[i+1];        
      } 
      codigoPostal3 += Buffer.from(fr[i], 'hex').toString('utf8');  
        
      if (skipa === true) i++;      
    }

    numMor = "";
    fr = data.toString("utf8",3402,3600).split(" ");
    for (var i = 0; i < fr.length; i++) {
      skipa = false;
      
      if (fr[i] == "C2" || fr[i] == "C3") {
        //se fr[i] == C2 ou C3 // temos de avançar o i+1
        skipa = true;     
        fr[i] += fr[i+1];        
      } 
      numMor += Buffer.from(fr[i], 'hex').toString('utf8');  
        
      if (skipa === true) i++;      
    }*/    
    console.log(processar(data,3234,3252));    
  });
