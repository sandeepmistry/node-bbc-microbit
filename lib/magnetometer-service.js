var MAGNETOMETER_SERVICE_UUID                = 'e95df2d8251d470aa062fa1922dfa9a8';
var MAGNETOMETER_CHARACTERISTIC_UUID         = 'e95dfb11251d470aa062fa1922dfa9a8';
var MAGNETOMETER_PERIOD_CHARACTERISTIC_UUID  = 'e95d386c251d470aa062fa1922dfa9a8';
var MAGNETOMETER_BEARING_CHARACTERISTIC_UUID = 'e95d9715251d470aa062fa1922dfa9a8';

var MagnetometerService = function() {
};

MagnetometerService.prototype.hasMagnetometerService = function() {
  return this.hasService(MAGNETOMETER_SERVICE_UUID);
};

MagnetometerService.prototype.readMagnetometer = function(callback) {
  this.readDataCharacteristic(MAGNETOMETER_SERVICE_UUID, MAGNETOMETER_CHARACTERISTIC_UUID, function(error, data) {
    if (error) {
      return callback(error);
    }

    this.convertMagnetometerData(data, function(x, y, z) {
      callback(null, x, y, z);
    }.bind(this));
  }.bind(this));
};

MagnetometerService.prototype.convertMagnetometerData = function(data, callback) {
  var x = data.readInt16LE(0) / 1000.0;
  var y = data.readInt16LE(2) / 1000.0;
  var z = data.readInt16LE(4) / 1000.0;

  callback(x, y, z);
};

MagnetometerService.prototype.subscribeMagnetometer = function(callback) {
  this.onMagnetometerChangeBinded = this.onMagnetometerChange.bind(this);

  this.subscribeCharacteristic(MAGNETOMETER_SERVICE_UUID, MAGNETOMETER_CHARACTERISTIC_UUID, this.onMagnetometerChangeBinded, callback);
};

MagnetometerService.prototype.unsubscribeMagnetometer = function(callback) {
  this.unsubscribeCharacteristic(MAGNETOMETER_SERVICE_UUID, MAGNETOMETER_CHARACTERISTIC_UUID, this.onMagnetometerChangeBinded, callback);
};

MagnetometerService.prototype.onMagnetometerChange = function(data) {
  if (data.length !== 6) {
    return;
  }

  this.convertMagnetometerData(data, function(x, y, z) {
    this.emit('magnetometerChange', x, y, z);
  }.bind(this));
};

MagnetometerService.prototype.readMagnetometerPeriod = function(callback) {
  this.readUInt16LECharacteristic(MAGNETOMETER_SERVICE_UUID, MAGNETOMETER_PERIOD_CHARACTERISTIC_UUID, callback);
};

MagnetometerService.prototype.writeMagnetometerPeriod = function(period, callback) {
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

  this.writeUInt16LECharacteristic(MAGNETOMETER_SERVICE_UUID, MAGNETOMETER_PERIOD_CHARACTERISTIC_UUID, period, callback);
};

MagnetometerService.prototype.readMagnetometerBearing = function(callback) {
  this.readInt16LECharacteristic(MAGNETOMETER_SERVICE_UUID, MAGNETOMETER_BEARING_CHARACTERISTIC_UUID, callback);
};

MagnetometerService.prototype.subscribeMagnetometerBearing = function(callback) {
  this.onMagnetometerBearingChangeBinded = this.onMagnetometerBearingChange.bind(this);

  this.subscribeCharacteristic(MAGNETOMETER_SERVICE_UUID, MAGNETOMETER_BEARING_CHARACTERISTIC_UUID, this.onMagnetometerBearingChangeBinded, callback);
};

MagnetometerService.prototype.unsubscribeMagnetometerBearing = function(callback) {
  this.unsubscribeCharacteristic(MAGNETOMETER_SERVICE_UUID, MAGNETOMETER_BEARING_CHARACTERISTIC_UUID, this.onMagnetometerBearingChangeBinded, callback);
};

MagnetometerService.prototype.onMagnetometerBearingChange = function(data) {
  if (data.length !== 2) {
    return;
  }

  this.emit('magnetometerBearingChange', data.readInt16LE(0));
};

module.exports = MagnetometerService;
