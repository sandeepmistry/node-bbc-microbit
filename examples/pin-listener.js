// make listen to a pin value

var BBCMicrobit = require('../index'); // or require('bbc-microbit')

var pin = 0;

console.log('Scanning for microbit');
BBCMicrobit.discover(function(microbit) {
  console.log('\tdiscovered microbit: id = %s, address = %s', microbit.id, microbit.address);

  microbit.on('disconnect', function() {
    console.log('\tmicrobit disconnected!');
    process.exit(0);
  });

  microbit.on('pinDataChange', function(pin, value) {
    console.log('\ton -> pin data change: pin = %d, value = %d', pin, value);
  });

  console.log('connecting to microbit');
  microbit.connectAndSetUp(function() {
    console.log('\tconnected to microbit');

    console.log('setting pin %d as input', pin);
    microbit.pinInput(pin, function() {
      console.log('\tpin set as input');

      console.log('setting pin %d as analog', pin);
      microbit.pinAnalog(pin, function() {
        console.log('\tpin set as analog');

        console.log('subscribing to pin data');
        microbit.subscribePinData(function() {
          console.log('\tsubscribed to pin data');
        });
      });
    });
  });
});
