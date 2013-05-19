
var zwave = require('./src/node-zwave');

var promise = zwave.connect();

promise.then(function(connection) {
  console.log("I connected! Sweet!");
  zwave.getNodeAbilities(1);
  //zwave.thermostat.setMode(5,'heat');
  //zwave.thermostat.setSetpoint(5, 62, 'heating');
  
});
