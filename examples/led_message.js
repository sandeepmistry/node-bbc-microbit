/*
* Send text to a micro:bit for display on the LED matrix
*
* Author: Martin Woolley, @bluetooth_mdw
*
* Example:
*
* sudo node led_message.js D964360E8701 hello\ martin
*
* micro:bit hex file must include the Bluetooth LED Service and Device Information Service
*
*/

var async = require('async');

var BBCMicrobit = require('../index');

var peripheralIdOrAddress = process.argv[2];
var text = process.argv[3];

if (peripheralIdOrAddress == undefined) {
  console.log("ERROR: supply micro:bit MAC address as argument");
  process.exit();
}

peripheralIdOrAddress = peripheralIdOrAddress.toLowerCase();
peripheralIdOrAddress = peripheralIdOrAddress.replace(/:/g, "");

if (text == undefined) {
  console.log("ERROR: supply max 20 ascii characters to display on the micro:bit as second argument");
  process.exit();
}

console.log("Scanning for "+peripheralIdOrAddress);

BBCMicrobit.discoverById(peripheralIdOrAddress,function(microbit) {
  console.log('discovered ' + microbit);

  microbit.on('disconnect', function() {
    console.log('disconnected!');
    process.exit(0);
  });

  async.series([
    function(callback) {
      console.log('connectAndSetUp');
      microbit.connectAndSetUp(callback);
    },
    function(callback) {
      console.log('readDeviceName');
      microbit.readDeviceName(function(error, deviceName) {
        console.log('\tdevice name = ' + deviceName);
        callback();
      });
    },
    function(callback) {
      console.log('readModelNumber');
      microbit.readModelNumber(function(error, modelNumber) {
        console.log('\tmodel number = ' + modelNumber);
        callback();
      });
    },
    function(callback) {
      console.log('readSerialNumber');
      microbit.readSerialNumber(function(error, serialNumber) {
        console.log('\tserial number = ' + serialNumber);
        callback();
      });
    },
    function(callback) {
      console.log('readFirmwareRevision');
      microbit.readFirmwareRevision(function(error, firmwareRevision) {
        console.log('\tfirmware revision = ' + firmwareRevision);
        callback();
      });
    },
    function(callback) {
      console.log('writeLedText');
      microbit.writeLedText(text, callback);
    },
    function(callback) {
      console.log('disconnect');
      microbit.disconnect(callback);
    }
  ]);
});

