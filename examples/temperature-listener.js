// subscribes to the temperature service and prints out value

var BBCMicrobit = require('../index'); // or require('bbc-microbit')

var period = 160; // ms

console.log('Scanning for microbit');
BBCMicrobit.discover(function(microbit) {
  console.log('\tdiscovered microbit: id = %s, address = %s', microbit.id, microbit.address);

  microbit.on('disconnect', function() {
    console.log('\tmicrobit disconnected!');
    process.exit(0);
  });

  microbit.on('temperatureChange', function(temperature) {
    console.log('\ton -> temperature change: temperature = %d °C', temperature);
  });

  console.log('connecting to microbit');
  microbit.connectAndSetUp(function() {
    console.log('\tconnected to microbit');

    console.log('setting temperature period to %d ms', period);
    microbit.writeTemperaturePeriod(period, function() {
      console.log('\ttemperature period set');

      console.log('subscribing to temperature');
      microbit.subscribeTemperature(function() {
        console.log('\tsubscribed to temperature');
      });
    });
  });
});
