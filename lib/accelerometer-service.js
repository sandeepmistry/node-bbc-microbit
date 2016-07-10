var ACCELEROMETER_SERVICE_UUID               = 'e95d0753251d470aa062fa1922dfa9a8';
var ACCELEROMETER_CHARACTERISTIC_UUID        = 'e95dca4b251d470aa062fa1922dfa9a8';
var ACCELEROMETER_PERIOD_CHARACTERISTIC_UUID = 'e95dfb24251d470aa062fa1922dfa9a8';

var AccelerometerService = function() {
};

AccelerometerService.prototype.hasAccelerometerService = function() {
  return this.hasService(ACCELEROMETER_SERVICE_UUID);
};

AccelerometerService.prototype.readAccelerometer = function(callback) {
  this.readDataCharacteristic(ACCELEROMETER_SERVICE_UUID, ACCELEROMETER_CHARACTERISTIC_UUID, function(error, data) {
    if (error) {
      return callback(error);
    }

    this.convertAccelerometerData(data, function(x, y, z) {
      callback(null, x, y, z);
    }.bind(this));
  }.bind(this));
};

AccelerometerService.prototype.convertAccelerometerData = function(data, callback) {
  var x = data.readInt16LE(0) / 1000.0;
  var y = data.readInt16LE(2) / 1000.0;
  var z = data.readInt16LE(4) / 1000.0;

  callback(x, y, z);
};

AccelerometerService.prototype.subscribeAccelerometer = function(callback) {
  this.onAccelerometerChangeBinded = this.onAccelerometerChange.bind(this);

  this.subscribeCharacteristic(ACCELEROMETER_SERVICE_UUID, ACCELEROMETER_CHARACTERISTIC_UUID, this.onAccelerometerChangeBinded, callback);
};

AccelerometerService.prototype.unsubscribeAccelerometer = function(callback) {
  this.unsubscribeCharacteristic(ACCELEROMETER_SERVICE_UUID, ACCELEROMETER_CHARACTERISTIC_UUID, this.onAccelerometerChangeBinded, callback);
};

AccelerometerService.prototype.onAccelerometerChange = function(data) {
  this.convertAccelerometerData(data, function(x, y, z) {
    this.emit('accelerometerChange', x, y, z);
  }.bind(this));
};

AccelerometerService.prototype.readAccelerometerPeriod = function(callback) {
  this.readUInt16LECharacteristic(ACCELEROMETER_SERVICE_UUID, ACCELEROMETER_PERIOD_CHARACTERISTIC_UUID, callback);
};

AccelerometerService.prototype.writeAccelerometerPeriod = function(period, callback) {
  if (period >= 640) {
    period = 640;
  } else if (period >= 160) {
    period = 160;
  } else if (period >= 80) {
    period = 80;
  } else if (period >= 20) {
    period = 20;
  } else if (period >= 10) {
    period = 10;
  } else if (period >= 5) {
    period = 5;
  } else if (period >= 2) {
    period = 2;
  } else {
    period = 1;
  }

  this.writeUInt16LECharacteristic(ACCELEROMETER_SERVICE_UUID, ACCELEROMETER_PERIOD_CHARACTERISTIC_UUID, period, callback);
};

module.exports = AccelerometerService;
