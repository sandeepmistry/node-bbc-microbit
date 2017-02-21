var NobleDevice = require('noble-device');

var AccelerometerService = require('./accelerometer-service');
var ButtonService = require('./button-service');
var IoPinService = require('./io-pin-service');
var LedService = require('./led-service');
var MagnetometerService = require('./magnetometer-service');
var TemperatureService = require('./temperature-service');
var UartService = require('./uart-service');
var EventService = require('./event-service');

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
NobleDevice.Util.mixin(BBCMicrobit, IoPinService);
NobleDevice.Util.mixin(BBCMicrobit, LedService);
NobleDevice.Util.mixin(BBCMicrobit, MagnetometerService);
NobleDevice.Util.mixin(BBCMicrobit, TemperatureService);
NobleDevice.Util.mixin(BBCMicrobit, UartService);
NobleDevice.Util.mixin(BBCMicrobit, EventService);

BBCMicrobit.prototype.toString = function() {
  return JSON.stringify({
    id: this.id,
    address: this.address
  });
};

BBCMicrobit.prototype.connectAndSetUp = function(callback) {
  BBCMicrobit.super_.prototype.connectAndSetUp.call(this, function(error) {
    if (error) {
      return callback(error);
    }

    if (this.hasIoPinService()) {
      this.readPinAdConfiguration(function(error) {
        if (error) {
          return callback(error);
        }

        this.readPinIoConfiguration(function(error) {
          if (error) {
            return callback(error);
          }

          callback();
        }.bind(this));
      }.bind(this));
    } else {
      callback();
    }
  }.bind(this));
};

module.exports = BBCMicrobit;
