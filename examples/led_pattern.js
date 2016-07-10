/*
* Send a selected pattern to a micro:bit for display on the LED matrix
*
* Author: Martin Woolley, @bluetooth_mdw
*
* Example:
*
* sudo node led_pattern.js D9:64:36:0E:87:01 2
*
* arg 1 is the micro:bit device address
* arg 2 is optional. If supplied it must be an integer value which selects one of n patterns implemented in this script
* If arg2 is not supplied, the script will provide a text based menu on the console for pattern selection via keyboard input
*
* micro:bit hex file must include the Bluetooth LED Service and Device Information Service
*
*/

var async = require('async');
const readline = require('readline');

var BBCMicrobit = require('../index');

// the micro:bit 5x5 LED display can be set to any pattern by sending a 5 byte array to it. Each byte contains a value which sets the LEDs
// in a particular row to either on or off. The 5 least significant bits in each byte correspond to each of the 5 LEDs in that row:
//
//    Octet 0, LED Row 1: bit4 bit3 bit2 bit1 bit0
//    Octet 1, LED Row 2: bit4 bit3 bit2 bit1 bit0
//    Octet 2, LED Row 3: bit4 bit3 bit2 bit1 bit0
//    Octet 3, LED Row 4: bit4 bit3 bit2 bit1 bit0
//    Octet 4, LED Row 5: bit4 bit3 bit2 bit1 bit0

// some example patterns to play with
var menu_choices = ['1','2','3','4','5','6','7','8','9'];
var number_of_patterns = menu_choices.length;
var arrow_up_right = new Buffer('0F03050910', 'hex');
var arrow_down_left = new Buffer('011214181E' , 'hex');
var arrow_down_right = new Buffer('100905030F' , 'hex');
var arrow_up_left =  new Buffer('1E18141201' , 'hex');
var diamond =  new Buffer('040A110A04' , 'hex');
var smile =  new Buffer('0A0A00110E' , 'hex');
var wink =  new Buffer('080B00110E' , 'hex');
var solid_block =  new Buffer('1F1F1F1F1F' , 'hex');
var blank =  new Buffer('0000000000' , 'hex');

var patterns = [arrow_up_right, arrow_down_left, arrow_down_right, arrow_up_left, diamond, smile, wink, solid_block, blank];

if (process.argv.length < 3) {
  console.log("ERROR: insufficient arguments. Please supply the address of a micro:bit and optionally, a pattern number");
  console.log("Note that if you run without a pattern number argument you will be prompted to selected pattern from a menu");
  console.log("For example:");
  console.log("sudo node led_pattern.js D9:64:36:0E:87:01 2");
  process.exit(1);
}


var peripheralIdOrAddress = process.argv[2];
var pattern_no = process.argv[3];

if (peripheralIdOrAddress == undefined) {
  console.log("ERROR: supply micro:bit MAC address as argument");
  process.exit(1);
}

peripheralIdOrAddress = peripheralIdOrAddress.toLowerCase();
peripheralIdOrAddress = peripheralIdOrAddress.replace(/:/g, "");

async.series([
  function(callback) {
    if (pattern_no == undefined) {
      const rl = readline.createInterface(process.stdin, process.stdout);
      console.log("1 - Arrow pointing up and to the right");
      console.log("2 - Arrow pointing down and to the left");
      console.log("3 - Arrow pointing down and to the right");
      console.log("4 - Arrow pointing up and to the left");
      console.log("5 - Diamond");
      console.log("6 - Smile");
      console.log("7 - Wink");
      console.log("8 - Solid Block");
      console.log("9 - Blank");
      rl.question('Please select a pattern from the list: ', function(choice) {
        console.log("You selected ",choice);
        if (menu_choices.indexOf(choice) != -1) {
            pattern_no = choice - 1;
        } else {
            console.log("ERROR: invalid selection. Please try again."); 
            process.exit(1);
        }
        rl.close();
        process.stdin.destroy();
        callback();
      });
    }
  },
  function(callback) {
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
          console.log('writeLedMatrixState');
          microbit.writeLedMatrixState(patterns[pattern_no], callback);
        },
        function(callback) {
          // I like to have my micro:bit code display "D" on disconnect events so I don't want to disconnect automatically here as it will destroy the nice pattern
          console.log('To disconnect, kill this script');
        }
      ]);
    });
  }
]);
