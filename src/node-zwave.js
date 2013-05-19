
var cc = require('./command_classes/');
// var funcs = require('./functions/');
var iface = require('./interface');
var functions = require('./functions/functions');

var zwave = {};

// Basic functions
zwave.getNodeAbilities = functions.getNodeAbilities;

zwave.connect = iface.connect;
zwave.thermostat = cc.thermostat;

module.exports = zwave;

