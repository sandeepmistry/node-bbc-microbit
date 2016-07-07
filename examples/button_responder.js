/*
* Respond to buttons being pressed on the BBC micro:bit
*
* Author: Martin Woolley, @bluetooth_mdw
*
* Example:
*
* sudo node button_responder.js D9:64:36:0E:87:01 A B
*
* arguments the address/ID of the micro:bit to connect to and at least one of A|B representing the buttons you want to respond to
*
* micro:bit hex file must include the Bluetooth Button Service and Device Information Service
*
*/

var async = require('async');

var BBCMicrobit = require('../index');

if (process.argv.length < 4) {
  console.log("ERROR: insufficient arguments. Please supply the address of a micro:bit and one or both of A and B for the buttons to respond to");
  console.log("For example:");
  console.log("sudo node button_responder.js D9:64:36:0E:87:01 A B");
  process.exit(1);
}

var peripheralIdOrAddress = process.argv[2];
var button_arg1 = process.argv[3].toUpperCase();
var button_arg2;
if (process.argv.length > 4) {
  button_arg2 = process.argv[4].toUpperCase();
}
if (peripheralIdOrAddress == undefined) {
  console.log("ERROR: supply micro:bit MAC address as argument");
  process.exit(1);
}

peripheralIdOrAddress = peripheralIdOrAddress.toLowerCase();
peripheralIdOrAddress = peripheralIdOrAddress.replace(/:/g, "");

if (button_arg1 != 'A' && button_arg1 != 'B') {
  console.log("ERROR: Valid values for buttons to respond to are A and B");
  process.exit(1);
}

if (button_arg2 != undefined && button_arg2 != 'A' && button_arg2 != 'B') {
  console.log("ERROR: Valid values for buttons to respond to are A and B");
  process.exit(1);
}

console.log("Scanning for "+peripheralIdOrAddress);

BBCMicrobit.discoverById(peripheralIdOrAddress,function(microbit) {
  console.log('discovered ' + microbit);

  microbit.on('disconnect', function() {
    console.log('disconnected!');
    process.exit(0);
  });

  microbit.on('buttonAChange', function(pressed) {
    var state_name = buttonStateName(pressed);
    console.log('\ton -> button A change: pressed = %d : %s', pressed,state_name);
  });
  microbit.on('buttonBChange', function(pressed) {
    var state_name = buttonStateName(pressed);
    console.log('\ton -> button B change: pressed = %d : %s', pressed,state_name);
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
      console.log("Press the buttons on your micro:bit"),
      callback();
    },
    function(callback) {
      if (reqButtonA()) {
        console.log('subscribeButtonA');
        microbit.subscribeButtonA(callback);
      }
    },
    function(callback) {
      if (reqButtonB()) {
        console.log('subscribeButtonB');
        microbit.subscribeButtonB(callback);
      }
    }
  ]);
});

function reqButtonA() {
  if ((button_arg1 != undefined && button_arg1 == 'A') || (button_arg2= undefined && button_arg2 == 'A')) {
     return true;
  }
  return false;
}

function reqButtonB() {
  if ((button_arg1 != undefined && button_arg1 == 'B') || (button_arg2 != undefined && button_arg2 == 'B')) {
     return true;
  }
  return false;
}

function buttonStateName(state) {
  console.log("state="+state);
  switch (state) {
    case 0: return 'Not Pressed';
    case 1: return 'Pressed';
    case 2: return 'Long Press';
    default: return 'Unknown State';
  }
}
