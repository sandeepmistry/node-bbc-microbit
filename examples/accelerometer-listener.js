// subscribes to the accelerometer service and prints out values

var BBCMicrobit = require('../index'); // or require('bbc-microbit')

var period = 160; // ms

console.log('Scanning for microbit');
BBCMicrobit.discover(function(microbit) {
  console.log('\tdiscovered microbit: id = %s, address = %s', microbit.id, microbit.address);

  microbit.on('disconnect', function() {
    console.log('\tmicrobit disconnected!');
    process.exit(0);
  });

  microbit.on('accelerometerChange', function(x, y, z) {
    console.log('\ton -> accelerometer change: accelerometer = %d %d %d G', x.toFixed(1), y.toFixed(1), z.toFixed(1));
  });

  console.log('connecting to microbit');
  microbit.connectAndSetUp(function() {
    console.log('\tconnected to microbit');

    console.log('setting accelerometer period to %d ms', period);
    microbit.writeAccelerometerPeriod(period, function() {
      console.log('\taccelerometer period set');

      console.log('subscribing to accelerometer');
      microbit.subscribeAccelerometer(function() {
        console.log('\tsubscribed to accelerometer');
      });
    });
  });
});
