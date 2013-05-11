/**
*  Interface for communicating with zwave controller
*/
var globals = require('./globals');
var Q = require('q');
var moment = require('moment');

var currentCallbackId = 1;
var currentState = 'ready'; // ready || pendingAck || pendingResponse
var pendingRequests = []; // If current state is not ready, store pending requests here. First in first out.
var currentRequest = null; // The current request

var serialPort = null;
var messageHandler = {}; // Object to export
var SerialPort = require("serialport").SerialPort;

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
  console.log('Running pending request...');
  console.log(pendingRequests);
  if(pendingRequests.length) {
    var request = pendingRequests.shift();
    messageHandler.sendMessage(request.message, request.responseType, request.listener);
  }
}

messageHandler.connect = function(serialPortAddress, callback) {
  var deferred = Q.defer();
  if(typeof serialPortAddress === 'undefined') {
    serialPortAddress = "/dev/tty.SLAB_USBtoUART"
  }
  if(typeof serialPortAddress === 'function') {
    callback = serialPortAddress;
    serialPortAddress = "/dev/tty.SLAB_USBtoUART";
  }
  serialPort = new SerialPort(serialPortAddress, {
    baudrate: 115200
  });

  serialPort.on("open", function () {
    if(typeof callback == 'function') {
      callback(serialPort);
    }
    console.log('Connected to zwave stick...');

    serialPort.on('data', function(data) {
      listener(data);
    });
    deferred.resolve(serialPort);
  });
  return deferred.promise;
}

messageHandler.sendMessage = function(messageArray, responseType, listener) {
  console.log('Sending message to zwave controller');
  console.log(messageArray);

  if(typeof responseType === 'function') {
    listener = responseType;
    responseType = 'response';
  }
  if(currentState !== 'ready') {
    console.log('Adding request to pending requests...');
    pendingRequests.push({
      message: messageArray,
      responseType: responseType,
      listener: listener
    });
    return;
  }
  currentState = 'pendingAck';

  var deferred = Q.defer();
  
  messageArray.push(createCallbackId());
  messageArray.push(generateChecksum(messageArray));

  currentRequest = {
    responseType: responseType,
    defer: deferred,
    time: moment(),
    listener: listener
  }
  var buffer = new Buffer(messageArray);
  serialPort.write(buffer);
  return deferred.promise;
}

messageHandler.sendAck = function() {
  serialPort.write(new Buffer([globals.ACK]));
}

function listener(data) {
  console.log('Receiving data from zwave controller');
  console.log(data);
  if(data[0] == globals.ACK) {
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
  else if(currentState == 'pendingResponse') {
    console.log('Received response for request');
    messageHandler.sendAck();
    currentRequest.listener(data);
    currentState = 'ready';
    currentRequest = null;
    runPendingRequest();
    return;
  }
  else {
    messageHandler.sendAck();
    // Catch broadcasted events here...
  }
}

module.exports = messageHandler;