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

var EID_SERIAL = 0;


function registerReader(onCardInserted, onCardRemoved) {
    pcsc.on('reader', function(r) {         
        reader = r;

        r.on('status', function(status) {
            var changes = this.state ^ status.state;
            if ((changes & this.SCARD_STATE_EMPTY) && (status.state & this.SCARD_STATE_EMPTY)) {
                reader["card_present"] = false;
                reader.disconnect(reader.SCARD_LEAVE_CARD, function(err) {});
                onCardRemoved();
            } else if ((changes & this.SCARD_STATE_PRESENT) && (status.state & this.SCARD_STATE_PRESENT)) {
                reader["card_present"] = true;
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

function checkCard() {
    return new Promise(function(resolve, reject) {
        shell.exec('pkcs15-tool --list-info > /dev/shm/cc_info.txt', function(code, stdout, stderr) {            
            fs.readFile('/dev/shm/cc_info.txt', function (err, data) {
                if (err) reject(err);
            // var dt = data.split("\n");
                var nfo = data.toString('utf-8').split("\n");
                var regex = /(\d+)/g
                var m = regex.exec(nfo[2]);   
                if (m == null) {
                    reject("could not read");
                }
                else {
                    EID_SERIAL = m[0];
                    CORE.CORE_CHECK_DATA_FILE("secpack",m[0]+"/type_human.json").then(result => {
                        resolve(result);
                    });
                }                
            });                    
        });    
    });
}

function registerCard(ident,address) {
    var merged = {
        "ident" : ident,
        "address" : address
    }      
    console.log("registering");
    //pegar no ficheiro type_human json e colocar lá os dados do ident e address    
    return new Promise(function(resolve, reject) {    
        fs.readFile('./schemas/type_human.json', function (err, data) {
            reject(err);
            console.log("reading file");
            var type_human = JSON.parse(data);
            
            type_human.human.text_name = ident.nameName+" "+ident.nameSurname;
            type_human.human.text_eid = ident.serialDocumentNumber;
            type_human.human.date_birth = ident.dateBirth.split(" ").reverse().join("-");

            type_human.human.obj_citizen.nr_idcard = ident.numberIdNumber;
            type_human.human.obj_citizen.nr_vat = ident.numberTax;
            type_human.human.obj_citizen.nr_ssn = ident.numberSocialSecurity;
                //health care service
            type_human.human.obj_citizen.nr_hcs = ident.numberHealth;
            
            type_human.human.obj_citizen.text_current_address = address;

            type_human.human.obj_physical_traits.text_gender = ident.typeGender;
            type_human.human.obj_physical_traits.nr_height = ident.numberHeight;
            console.log(ident.numberHeight);
            
            CORE.CORE_WRITE_DATA_FOLDER("secpack",EID_SERIAL).then(result => {

                CORE.CORE_WRITE_DATA_FILE("secpack",EID_SERIAL+"/type_human.json",JSON.stringify(type_human)).then(result => {
                    EID_SERIAL = "";
                    resolve(result);
                })

            });
        });
    });
}

module.exports.getReader = getReader;
module.exports.registerReader = registerReader;
module.exports.readIdentity = readIdentity;
module.exports.readAddress = readAddress;
module.exports.checkCard = checkCard;
module.exports.registerCard = registerCard;
