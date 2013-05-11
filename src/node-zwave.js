
var cc = require('./command_classes/');
// var funcs = require('./functions/');
var iface = require('./interface');

var zwave = {};
zwave.connect = iface.connect;
zwave.thermostat = cc.thermostat;

module.exports = zwave;

