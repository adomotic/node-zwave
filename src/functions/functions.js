var iface = require('../interface');
var defs = require('./definitions');

function getNodes() {

}

function getNodeAbilities(nodeId, cb) {
  console.log('Getting node abilities for node ' + nodeId);

  var command = [
    0x01,
    0x04, // Length, including checksum which is added after
    0x00,
    defs.GET_NODE_INFO,
    nodeId
  ];

  var promise = iface.sendMessage(command, listener);
  if(typeof callback === 'Function') {
    promise.then(callback);
  }
  return promise;

}


function listener(data) {
  console.log('Function response...');
  console.log(data);
}


module.exports = {
  getNodes: getNodes,
  getNodeAbilities: getNodeAbilities
}