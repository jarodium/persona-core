/**
* Type: Dependency
  Version: 0.0.1a
  Description: Platform core file
  URLgraphy
    - http://stackabuse.com/how-to-use-module-exports-in-node-js/
**/

var SSH = require('simple-ssh');
var SCP2 = require('scp2');

const CORE_COUNTRY = 'pt';

  //try not to expose this one to the services...
const CORE_SERVER_ACCESS = [{
      "host" : "secpack",
      "user" : "pedro",
      "pass" : "qwerty123"  
  }];

function CORE_MAP_HEX_TO_JSON(hex,map) {
  let a = Object.keys(map);
  a.forEach(function(k) {    
    p = map[k].split(",");
    map[k] = hex.toString("utf8",parseInt(p[0]),parseInt(p[1])).replace(/\u0000/g,"");
  });
  return map;
}

function CORE_CHECK_DATA_FILE(server,file) { 
  let FILE = file; 
  if (server == "secpack") {    
    var ssh = new SSH({
      host: CORE_SERVER_ACCESS[0].host,
      user: CORE_SERVER_ACCESS[0].user,
      pass: CORE_SERVER_ACCESS[0].pass
    });
  }


  ssh.on('error', function(err) {
    console.log('Oops, something went wrong.');
    console.log(err);
    ssh.end();
  });

  return new Promise(function(resolve, reject) {
    ssh.exec('(ls /home/pedro/securepack/data/'+FILE+' >> /dev/null 2>&1 && echo 1) || echo 0', {
        out: function(stdout) {
            resolve(stdout);
        }      
    }).start();
  });
}

module.exports.CORE_COUNTRY = CORE_COUNTRY; 
module.exports.CORE_MAP_HEX_TO_JSON = CORE_MAP_HEX_TO_JSON; 
module.exports.CORE_CHECK_DATA_FILE = CORE_CHECK_DATA_FILE;