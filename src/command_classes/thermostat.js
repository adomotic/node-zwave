
var fdefs = require('../functions/definitions');
var gdefs = require('../globals');
var iface = require('../interface');

var thermostat = {};

// Define constants

// Thermostat command classes
var MODE = 0x40;
var OPERATING_STATE = 0x42;
var SETPOINT = 0x43;
var FAN_MODE = 0x44;

// Thermostat command options
var SET = 1;
var GET = 2;
var REPORT = 3;
var GET_SUPPORTED = 4;
var REPORT_SUPPORTED = 5;

var MODE_OPTIONS = [
  "Off",
  "Heat",
  "Cool",
  "Auto",
  "Aux Heat",
  "Resume",
  "Fan Only",
  "Furnace",
  "Dry Air",
  "Moist Air",
  "Auto Changeover",
  "Heat Econ",
  "Cool Econ",
  "Away"
]

var OPERATING_MODE_OPTIONS = [
  "Idle",
  "Heating",
  "Cooling",
  "Fan Only",
  "Pending Heat",
  "Pending Cool",
  "Vent/Economizer",
  "7", // Undefined states.  May be used in the future.
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15"
];

var FAN_MODE_OPTIONS = [
  "Auto",
  "On",
  "Auto High",
  "On High",
  "4",
  "5",
  "Circulate",
];

// The indexes here start with 1 instead of zero. Using object literal instead
var SETPOINT_TYPES = {
  0x01:'heating',
  0x02:'cooling'
}

/*******************************************************************************
  Getters
*******************************************************************************/

thermostat.getMode = function(nodeId) {

}

thermostat.getFanMode = function(nodeId) {

}

thermostat.getFanModesSupported = function(nodeId) {

}

thermostat.getModesSupported = function(nodeId) {

}

thermostat.getOperatingMode = function(nodeId) {

}

thermostat.getSetpoint = function(nodeId) {

}


/*******************************************************************************
  Setters
*******************************************************************************/

/**
 * Set a thermostat temp
 * @param {Number} nodeId     The node ID of the thermostat
 * @param {Number} temp       The temperature you want it set to
 * @param {String} heatOrCool Is this the heat set point or the cool setpoint Accepts "heating" or "cooling"
 * @param {String} [scale=F]      Celcius or Fahrenheit. Accepts "c" or "f" and defaults to "f"
 * @param {Function} [callback] Callback is optional. A promise is returned
 */
thermostat.setSetpoint = function(nodeId, temperature, heatingOrCooling, scale, callback) {
  if(typeof scale === "Function") {
    callback = scale;
    scale = "f";
  }
  else if(typeof scale === 'undefined') {
    scale = "f";
  }

  var scaleByte = 0x09
  if(scale == 'c') {
    scaleByte = 0x08;
  }

  var thermostatSet = [
    0x01, 
    0x0C,
    0x00,
    fdefs.DATA,
    nodeId,
    0x06,
    SETPOINT,
    SET,
    0x01,
    scaleByte,
    temperature,
    globals.AUTO_ACK
  ];

  var promise = iface.sendMessage(thermostatSet);
  if(typeof callback = 'Function') {
    promise.then(callback);
  }
  return promise;
}

thermostat.setMode = function() {

}

thermostat.setFanMode = function() {

}

thermostat.setOperatingMode = function() {

}

/*******************************************************************************
  Listener - handles responses from zwave controller
*******************************************************************************/

thermostat.listener = function(data) {

}

module.exports = thermostat;

