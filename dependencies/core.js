/**
* Type: Dependency
  Version: 0.0.1a
  Description: Constant and variable declarations
  URLgraphy
    - http://stackabuse.com/how-to-use-module-exports-in-node-js/
**/

const CORE_COUNTRY = 'pt';

function CORE_MAP_HEX_TO_JSON(hex,map) {
  let a = Object.keys(map);
  a.forEach(function(k,v) {
    p = v.split(",");
    map[k] = hex.toString("utf8",p[0],p[1]);
  });
  return map;
}

module.exports.CORE_COUNTRY = CORE_COUNTRY; 
module.exports.CORE_MAP_HEX_TO_JSON = CORE_MAP_HEX_TO_JSON; 