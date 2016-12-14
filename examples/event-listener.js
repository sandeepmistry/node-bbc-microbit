/*
* Informs micro:bit of interest in events with event ID 9999 and any event value. Logs events as they are received.
*
* Author: Martin Woolley, @bluetooth_mdw
*
* Example:
*
* sudo node event-listener.js
*
* micro:bit hex file must include the Bluetooth Event Service
*
* http://bluetooth-mdw.blogspot.co.uk/p/bbc-microbit.html for hex files and micro:bit info
*/

var BBCMicrobit = require('../index'); // or require('bbc-microbit')

var EVENT_FAMILY    = 9999;
var EVENT_VALUE_ANY = 0;
var EVENT_VALUE_1   = 1;

// search for a micro:bit, to discover a particular micro:bit use:
//  BBCMicrobit.discoverById(id, callback); or BBCMicrobit.discoverByAddress(id, callback);
//
// C/C++ code containing the following fragments can be used for testing.
//   Pressing button A generates event ID 9999, value 1
//   Pressing button B generates event ID 9999, value 2
//

/*
#include "MicroBit.h"
MicroBit uBit;
int EVENT_ID = 9999;

void onButton(MicroBitEvent e)
{
    if (e.source == MICROBIT_ID_BUTTON_A) {
        MicroBitEvent evt(EVENT_ID, 1);
    }
    if (e.source == MICROBIT_ID_BUTTON_B) {
        MicroBitEvent evt(EVENT_ID, 2);
    }
}
int main()
{
    // Initialise the micro:bit runtime.
    uBit.init();
    uBit.messageBus.listen(MICROBIT_ID_BUTTON_A, MICROBIT_BUTTON_EVT_CLICK, onButton);
    uBit.messageBus.listen(MICROBIT_ID_BUTTON_B, MICROBIT_BUTTON_EVT_CLICK, onButton);
    release_fiber();
}
*/

console.log('Scanning for microbit');
BBCMicrobit.discover(function(microbit) {
  console.log('\tdiscovered microbit: id = %s, address = %s', microbit.id, microbit.address);


  microbit.on('event', function(id, value) {
    console.log('\ton -> micro:bit event received event: %d value: %d', id, value);
  });

  microbit.on('disconnect', function() {
    console.log('\tmicrobit disconnected!');
    process.exit(0);
  });

  console.log('connecting to microbit');
  microbit.connectAndSetUp(function() {
    console.log('\tconnected to microbit');

    // Example 1: subscribe to all micro:bit events with ID 9999 and any event value
    console.log('subscribing to event family 9999, any event value');
    microbit.subscribeEvents(EVENT_FAMILY, EVENT_VALUE_ANY, function() {
      console.log('\tsubscribed to micro:bit events of required type');
    });

    // Example 2: subscribe to the specific event with ID=9999 and value=0001 only
//    console.log('subscribing to event family 9999, event value 0001');
//    microbit.subscribeEvents(EVENT_FAMILY, EVENT_VALUE_1, function() {
//      console.log('\tsubscribed to micro:bit events of required type');
//    });
  });
});
