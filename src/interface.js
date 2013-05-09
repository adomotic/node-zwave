/**
*  Interface for communicating with zwave controller
*/
var G = require('./globals');
var Q = require('q');
var moment = require('moment');

var currentCallbackId = 1;
var currentState = 'ready'; // ready || pendingAck || pendingResponse
var pendingRequests = []; // If current state is not ready, store pending requests here. First in first out.
var currentRequest = null; // The current request

var serialPort = null;
var messageHandler = {}; // Object to export
var Buffer = require('buffer');
var SerialPort = require("serialport").SerialPort;

var serialPort = new SerialPort("/dev/tty.SLAB_USBtoUART", {
  baudrate: 115200
});

function createCallbackId() {
  currentCallbackId++;
  if(currentCallbackId > 255) {
    currentCallbackId = 1;
  }
  return currentCallbackId;
}

function generateChecksum(data) {
  var offset = 0; // Initialize this to 0xFF and no need to NOT result below
  ret = data[offset];
  for (var i = offset; i < data.length; i++) {
    // Xor bytes
    ret ^= data[i];
  }
  ret = ~ret;
  return ret;
}

function runPendingRequest() {
  if(pendingRequests.length) {
    var request = pendingRequests.shift();
    messageHandler.sendMessage(request.message, request.responseType, request.listener);
  }
}

messageHandler.sendMessage = function(messageArray, responseType, listener) {
  if(currentState !== 'ready') {
    pendingRequests.push({
      message: messageArray,
      responseType: response,
      listener: listener
    });
    return;
  }
  currentState = 'pendingAck';

  var deferred = Q.defer();
  
  var callbackId = createCallbackId();
  messageArray.push(callbackId);
  messageArray.push(generateChecksum(messageArray));

  currentRequest = {
    responseType: responseType,
    defer: deferred,
    time: moment(),
    listener: listener
  }

  SerialPort.write(new Buffer(messageArray));
  return defer.promise();
}

messageHandler.listener = function(data) {
  var hexArray = data.toString('hex')
  console.log(hexArray);
  if(hexArray[0] == g.ACK) {
    console.log('Received ACK for request');
    if(currentRequest.responseType == 'none') {
      currentRequest.defer.resolve(true);
      currentState = 'ready';
      currentRequest = null;
      runPendingRequest()
      return;
    }
    else {
      currentState = 'pendingResponse';
    }
  }
  if(currentState == 'pendingResponse') {
    console.log('Received response for request');
    currentRequest.listener(hexArray);
    currentState = 'ready';
    currentRequest = null;
    runPendingRequest();
    return;
  }
  else {
    // Catch broadcasted events here...
  }

  // Look for callback ID in the response and call appropriate function from the callbacks object
  
}

