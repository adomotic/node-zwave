var Buffer = require('buffer');
var SerialPort = require("serialport").SerialPort;

var serialPort = new SerialPort("/dev/tty.SLAB_USBtoUART", {
	baudrate: 115200
});


var buff1 = [0x01, 0x03, 0x00, 0x02];
var buff2 = [1, 3, 0, 2];

var switchId = 0x02;
var lightSwitchId = 0x03;
var lockId = 0x04;
var thermostatId = 0x05;

console.log((0x3d).toString(2))

var switchOn = [
  0x01, 
  0x09, 
  0x00, 
  0x13, // data
  switchId, 
  0x03, // length
  0x20, 
  0x01, 
  0x00, 
  0x05
];
switchOn.push(generateChecksum(switchOn));

var setTemp = [
  0x01, 
  0x10, 
  0x00, // Request
  0x13, // Function (data)
  thermostatId, 
  0x05, 
  0x43, 
  0x01, 
  0x01, 
  0x01, 
  0x4B
];
setTemp.push(generateChecksum(setTemp));

buff1.push(generateChecksum(buff1));
var switchBuff = new Buffer(switchOn);
var setTempBuff = new Buffer(setTemp);


serialPort.on("open", function () {
  console.log('Connected to zwave stick...');

  serialPort.on('data', function(data) {
    console.log('data received: ' + data.toString('hex'));
    if(data[0] != 6) {
      serialPort.write(new Buffer([0x06]));
    }
  });

  //var getNodes = new Buffer([0x01, 0x03, 0x20]);
  console.log('Trying to write getNodes buffer...');
  
  // console.log(getNodes.toJson())
  //serialPort.write(setTempBuff);
  serialPort.write(switchBuff);

  console.log(setTempBuff.toString('hex'))
});


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