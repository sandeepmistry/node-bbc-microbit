var async = require('async');

var BBCMicrobit = require('./index');

BBCMicrobit.discover(function(microbit) {
  console.log('discovered ' + microbit);

  microbit.on('disconnect', function() {
    console.log('disconnected!');
    process.exit(0);
  });

  microbit.on('temperatureChange', function(temperature) {
    console.log('\ton -> temperature change: temperature = %d °C', temperature);
  });

  microbit.on('accelerometerChange', function(x, y, z) {
    console.log('\ton -> accelerometer change: accelerometer = %d %d %d G', x.toFixed(1), y.toFixed(1), z.toFixed(1));
  });

  microbit.on('magnetometerChange', function(x, y, z) {
    console.log('\ton -> magnetometer change: magnetometer = %d %d %d', x.toFixed(1), y.toFixed(1), z.toFixed(1));
  });

  microbit.on('magnetometerBearingChange', function(bearing) {
    console.log('\ton -> magnetometer bearing change: magnetometer bearing = %d', bearing);
  });

  microbit.on('buttonAChange', function(pressed) {
    console.log('\ton -> button A change: pressed = %d', pressed);
  });

  microbit.on('buttonBChange', function(pressed) {
    console.log('\ton -> button B change: pressed = %d', pressed);
  });

  microbit.on('pinDataChange', function(pin, value) {
    console.log('\ton -> pin data change: pin = %d, value = %d', pin, value);
  });

  microbit.on('uartData', function(data) {
    console.log('\ton -> UART data: data = %s', data.toString('hex'));
  });

  var pin = 0;

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
      microbit.writeLedMatrixState(new Buffer('0000000000', 'hex'), callback);
    },
    function(callback) {
      console.log('readLedMatrixState');
      microbit.readLedMatrixState(function(error, data) {
        console.log('\t LED matrix state = %s', data.toString('hex'));

        callback();
      });
    },
    function(callback) {
      setTimeout(callback, 5000);
    },
    function(callback) {
      console.log('writeLedMatrixState');
      microbit.writeLedMatrixState(new Buffer('1f1f1f1f1f', 'hex'), callback);
    },
    function(callback) {
      console.log('readLedMatrixState');
      microbit.readLedMatrixState(function(error, data) {
        console.log('\t LED matrix state = %s', data.toString('hex'));

        callback();
      });
    },
    function(callback) {
      setTimeout(callback, 5000);
    },
    function(callback) {
      console.log('readLedScrollingDelay');
      microbit.readLedScrollingDelay(function(error, delay) {
        console.log('\t LED scrolling delay = %d ms', delay);

        callback();
      });
    },
    function(callback) {
      console.log('writeLedScrollingDelay');
      microbit.writeLedScrollingDelay(100, callback);
    },
    function(callback) {
      console.log('readLedScrollingDelay');
      microbit.readLedScrollingDelay(function(error, delay) {
        console.log('\t LED scrolling delay = %d ms', delay);

        callback();
      });
    },
    function(callback) {
      console.log('writeLedText');
      microbit.writeLedText('Hello from Node.js!', callback);
    },
    function(callback) {
      console.log('writeTemperaturePeriod');
      microbit.writeTemperaturePeriod(100, callback);
    },
    function(callback) {
      console.log('readTemperaturePeriod');
      microbit.readTemperaturePeriod(function(error, period) {
        console.log('\ttemperature period = %d ms', period);
        callback();
      });
    },
    function(callback) {
      console.log('readTemperature');
      microbit.readTemperature(function(error, temperature) {
        console.log('\ttemperature = %d °C', temperature);
        callback();
      });
    },
    function(callback) {
      console.log('subscribeTemperature');
      microbit.subscribeTemperature(callback);
    },
    function(callback) {
      setTimeout(callback, 5000);
    },
    function(callback) {
      console.log('unsubscribeTemperature');
      microbit.unsubscribeTemperature(callback);
    },
    function(callback) {
      console.log('writeAccelerometerPeriod');
      microbit.writeAccelerometerPeriod(640, callback);
    },
    function(callback) {
      console.log('readAccelerometerPeriod');
      microbit.readAccelerometerPeriod(function(error, period) {
        console.log('\taccelerometer period = %d ms', period);
        callback();
      });
    },
    function(callback) {
      console.log('readAccelerometer');
      microbit.readAccelerometer(function(error, x, y, z) {
        console.log('\taccelerometer = %d %d %d G', x.toFixed(1), y.toFixed(1), z.toFixed(1));
        callback();
      });
    },
    function(callback) {
      console.log('subscribeAccelerometer');
      microbit.subscribeAccelerometer(callback);
    },
    function(callback) {
      setTimeout(callback, 5000);
    },
    function(callback) {
      console.log('unsubscribeAccelerometer');
      microbit.unsubscribeAccelerometer(callback);
    },
    function(callback) {
      console.log('writeMagnetometerPeriod');
      microbit.writeMagnetometerPeriod(640, callback);
    },
    function(callback) {
      console.log('readMagnetometerPeriod');
      microbit.readMagnetometerPeriod(function(error, period) {
        console.log('\tmagnetometer period = %d ms', period);
        callback();
      });
    },
    function(callback) {
      console.log('readMagnetometer');
      microbit.readMagnetometer(function(error, x, y, z) {
        console.log('\tmagnetometer = %d %d %d', x.toFixed(1), y.toFixed(1), z.toFixed(1));
        callback();
      });
    },
    function(callback) {
      console.log('subscribeMagnetometer');
      microbit.subscribeMagnetometer(callback);
    },
    function(callback) {
      setTimeout(callback, 5000);
    },
    function(callback) {
      console.log('unsubscribeMagnetometer');
      microbit.unsubscribeMagnetometer(callback);
    },
    function(callback) {
      console.log('readMagnetometerBearing');
      microbit.readMagnetometerBearing(function(error, bearing) {
        console.log('\tmagnetometer bearing = %d', bearing);
        callback();
      });
    },
    function(callback) {
      console.log('subscribeMagnetometerBearing');
      microbit.subscribeMagnetometerBearing(callback);
    },
    function(callback) {
      setTimeout(callback, 5000);
    },
    function(callback) {
      console.log('unsubscribeMagnetometerBearing');
      microbit.unsubscribeMagnetometerBearing(callback);
    },
    function(callback) {
      console.log('subscribeButtonA');
      microbit.subscribeButtonA(callback);
    },
    function(callback) {
      console.log('subscribeButtonB');
      microbit.subscribeButtonB(callback);
    },
    function(callback) {
      setTimeout(callback, 10000);
    },
    function(callback) {
      console.log('unsubscribeButtonB');
      microbit.unsubscribeButtonB(callback);
    },
    function(callback) {
      console.log('unsubscribeButtonA');
      microbit.unsubscribeButtonA(callback);
    },
    function(callback) {
      console.log('unsubscribeButtonA');
      microbit.unsubscribeButtonA(callback);
    },
    function(callback) {
      console.log('writePinAdConfiguration');
      microbit.writePinAdConfiguration(0x00000000, callback);
    },
    function(callback) {
      console.log('readPinAdConfiguration');
      microbit.readPinAdConfiguration(function(error, value) {
        console.log('\tpin AD configuration = %d', value);

        callback();
      });
    },
    function(callback) {
      console.log('writePinIoConfiguration');
      microbit.writePinIoConfiguration(0x00000007, callback);
    },
    function(callback) {
      console.log('readPinIoConfiguration');
      microbit.readPinIoConfiguration(function(error, value) {
        console.log('\tpin IO configuration = %d', value);

        callback();
      });
    },
    function(callback) {
      console.log('readPinData');
      microbit.readPinData(function(error, data) {
        console.log('\tpin data = %j', data);

        callback();
      });
    },
    function(callback) {
      console.log('subscribePinData');
      microbit.subscribePinData(callback);
    },
    function(callback) {
      setTimeout(callback, 10000);
    },
    function(callback) {
      console.log('unsubscribePinData');
      microbit.unsubscribePinData(callback);
    },
    function(callback) {
      console.log('writePinIoConfiguration');
      microbit.writePinIoConfiguration(0x00000000, callback);
    },
    function(callback) {
      console.log('writePinData');
      microbit.writePinData(new Buffer('0001', 'hex'), callback);
    },
    function(callback) {
      console.log('readPinData');
      microbit.readPinData(function(error, data) {
        console.log('\tpin data = %j', data);

        callback();
      });
    },
    function(callback) {
      console.log('writePinData');
      microbit.writePinData(new Buffer('0000', 'hex'), callback);
    },
    function(callback) {
      console.log('readPinData');
      microbit.readPinData(function(error, data) {
        console.log('\tpin data = %j', data);

        callback();
      });
    },
    function(callback) {
      console.log('pinAnalog', pin);
      microbit.pinAnalog(pin, callback);
    },
    function(callback) {
      console.log('pinDigital', pin);
      microbit.pinDigital(pin, callback);
    },
    function(callback) {
      console.log('pinInput', pin);
      microbit.pinInput(pin, callback);
    },
    function(callback) {
      console.log('readPin', pin);
      microbit.readPin(pin, function(error, value) {
        console.log('\tpin value = %d', value);

        callback();
      });
    },
    function(callback) {
      console.log('pinOutput', pin);
      microbit.pinOutput(pin, callback);
    },
    function(callback) {
      console.log('writePin', pin);
      microbit.writePin(pin, 1, callback);
    },
    function(callback) {
      console.log('writePin', pin);
      microbit.writePin(pin, 0, callback);
    },
    function(callback) {
      console.log('subscribeUart');
      microbit.subscribeUart(callback);
    },
    function(callback) {
      console.log('writeUart');
      microbit.writeUart(new Buffer('hello UART'), callback);
    },
    function(callback) {
      setTimeout(callback, 5000);
    },
    function(callback) {
      console.log('unsubscribeUart');
      microbit.unsubscribeUart(callback);
    },
    function(callback) {
      console.log('disconnect');
      microbit.disconnect(callback);
    }
  ]);
});
