/**
* Type: Hardware Monitor
  Version: 0.0.1a
  Description: Monitors the smartcard reader for EID presence
**/

var pcsclite = require('pcsclite');
var pcsc = pcsclite();
const shell = require('shelljs');
var fs = require('fs');
let CORE = require('./dependencies/core');

var reader;
var EID_MAP = JSON.parse(fs.readFileSync('./schemas/gov/'+CORE.CORE_COUNTRY+'/eid-map.json',function(err) {}));


function registerReader(onCardInserted, onCardRemoved) {
    pcsc.on('reader', function(r) {         
        reader = r;

        r.on('status', function(status) {
            var changes = this.state ^ status.state;
            if ((changes & this.SCARD_STATE_EMPTY) && (status.state & this.SCARD_STATE_EMPTY)) {                
                reader.disconnect(reader.SCARD_LEAVE_CARD, function(err) {});
                onCardRemoved();
            } else if ((changes & this.SCARD_STATE_PRESENT) && (status.state & this.SCARD_STATE_PRESENT)) {            
                reader.disconnect(reader.SCARD_LEAVE_CARD, function(err) {});
                onCardInserted();                
            }
        });
    });
}

function getReader() {
    return reader;
}

function readIdentity(pin) {
    return new Promise(function(resolve, reject) {
        shell.exec('pkcs15-tool --read-data-object \'Citizen Data\' --pin '+pin+'  --output /dev/shm/cc_ident.hex', function(code, stdout, stderr) {            
            fs.readFile('/dev/shm/cc_ident.hex', function (err, data) {
                if (err) reject(err);                
                resolve(CORE.CORE_MAP_HEX_TO_JSON(data,EID_MAP.CITIZEN_IDENTIF));
            });                    
        });        
    });
}


function readAddress(pin) {
    return new Promise(function(resolve, reject) {
        shell.exec('pkcs15-tool --read-data-object \'Citizen Address Data\' --pin '+pin+'  --output /dev/shm/cc_address.hex', function(code, stdout, stderr) {            
            fs.readFile('/dev/shm/cc_address.hex', function (err, data) {
                if (err) reject(err);                
                resolve(CORE.CORE_MAP_HEX_TO_JSON(data,EID_MAP.CITIZEN_ADDRESS));
            });                    
        });        
    });
}


module.exports.getReader = getReader;
module.exports.registerReader = registerReader;
module.exports.readAddress = readAddress;