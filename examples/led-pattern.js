/*
* Sends a random pattern to a micro:bit for display on the LED matrix
*
* Author: Martin Woolley, @bluetooth_mdw
*
* Example:
*
* sudo node led-pattern.js
*
* micro:bit hex file must include the Bluetooth LED Service
*
* http://bluetooth-mdw.blogspot.co.uk/p/bbc-microbit.html for hex files and micro:bit info
*
*/

var BBCMicrobit = require('../index'); // or require('bbc-microbit')

// the micro:bit 5x5 LED display can be set to any pattern by sending a 5 byte array to it. Each byte contains a value which sets the LEDs
// in a particular row to either on or off. The 5 least significant bits in each byte correspond to each of the 5 LEDs in that row:
//
//    Octet 0, LED Row 1: bit4 bit3 bit2 bit1 bit0
//    Octet 1, LED Row 2: bit4 bit3 bit2 bit1 bit0
//    Octet 2, LED Row 3: bit4 bit3 bit2 bit1 bit0
//    Octet 3, LED Row 4: bit4 bit3 bit2 bit1 bit0
//    Octet 4, LED Row 5: bit4 bit3 bit2 bit1 bit0

var PATTERNS = [
  {
    name: 'Arrow up right',
    value: new Buffer('0F03050910', 'hex')
  },
  {
    name: 'Arrow down left',
    value: new Buffer('011214181E', 'hex')
  },
  {
    name: 'Arrow down right',
    value: new Buffer('100905030F', 'hex')
  },
  {
    name: 'Arrow down left',
    value: new Buffer('011214181E', 'hex')
  },
  {
    name: 'Arrow up left',
    value: new Buffer('1E18141201', 'hex')
  },
  {
    name: 'Diamond',
    value: new Buffer('040A110A04', 'hex')
  },
  {
    name: 'Smile',
    value: new Buffer('0A0A00110E', 'hex')
  },
  {
    name: 'Wink',
    value: new Buffer('080B00110E', 'hex')
  },
  {
    name: 'Solid',
    value: new Buffer('1F1F1F1F1F', 'hex')
  },
  {
    name: 'Blank',
    value: new Buffer('0000000000', 'hex')
  }
];

var patternIndex = Math.floor((Math.random() * PATTERNS.length)); // choose a random pattern
var pattern = PATTERNS[patternIndex];

// search for a micro:bit, to discover a particular micro:bit use:
//  BBCMicrobit.discoverById(id, callback); or BBCMicrobit.discoverByAddress(id, callback);

console.log('Scanning for microbit');
BBCMicrobit.discover(function(microbit) {
  console.log('\tdiscovered microbit: id = %s, address = %s', microbit.id, microbit.address);

  microbit.on('disconnect', function() {
    console.log('\tmicrobit disconnected!');
    process.exit(0);
  });

  console.log('connecting to microbit');
  microbit.connectAndSetUp(function() {
    console.log('\tconnected to microbit');

    console.log('sending pattern: "%s"', pattern.name);
    microbit.writeLedMatrixState(pattern.value, function() {
      console.log('\tpattern sent');

      console.log('disconnecting');
      microbit.disconnect();
    });
  });
});
