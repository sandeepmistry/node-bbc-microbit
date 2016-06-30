var NobleDevice = require('noble-device');

var AccelerometerService = require('./accelerometer-service');
var ButtonService = require('./button-service');
var LedService = require('./led-service');
var MagnetometerService = require('./magnetometer-service');
var TemperatureService = require('./temperature-service');

function BBCMicrobit() {
}

var BBCMicrobit = function(peripheral) {
  NobleDevice.call(this, peripheral);
};

BBCMicrobit.is = function(peripheral) {
  var localName = peripheral.advertisement.localName;

  return (localName !== undefined) && (localName.indexOf('BBC micro:bit') !== -1);
};

NobleDevice.Util.inherits(BBCMicrobit, NobleDevice);
NobleDevice.Util.mixin(BBCMicrobit, NobleDevice.DeviceInformationService);
NobleDevice.Util.mixin(BBCMicrobit, AccelerometerService);
NobleDevice.Util.mixin(BBCMicrobit, ButtonService);
NobleDevice.Util.mixin(BBCMicrobit, LedService);
NobleDevice.Util.mixin(BBCMicrobit, MagnetometerService);
NobleDevice.Util.mixin(BBCMicrobit, TemperatureService);

BBCMicrobit.prototype.toString = function() {
  return JSON.stringify({
    id: this.id
  });
};

module.exports = BBCMicrobit;
