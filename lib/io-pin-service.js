var IO_PIN_SERVICE_UUID                      = 'e95d127b251d470aa062fa1922dfa9a8';
var PIN_DATA_CHARACTERISTIC_UUID             = 'e95d8d00251d470aa062fa1922dfa9a8';
var PIN_AD_CONFIGURATION_CHARACTERISTIC_UUID = 'e95d5899251d470aa062fa1922dfa9a8';
var PIN_IO_CONFIGURATION_CHARACTERISTIC_UUID = 'e95db9fe251d470aa062fa1922dfa9a8';

var IoPinService = function() {
  this._adMask = 0;
  this._ioMask = 0;
};

IoPinService.prototype.hasIoPinService = function() {
  return this.hasService(IO_PIN_SERVICE_UUID);
};

IoPinService.prototype.readPinData = function(callback) {
  this.readDataCharacteristic(IO_PIN_SERVICE_UUID, PIN_DATA_CHARACTERISTIC_UUID, function(error, data) {
    if (error) {
      return callback(error);
    }

    var pinData = [];

    for (var i = 0; i < data.length; i += 2) {
      var pin = data.readUInt8(i);
      var value = data.readUInt8(i + 1);

      pinData.push({
        pin: pin,
        value: value
      });
    }

    callback(null, pinData);
  }.bind(this));
};

IoPinService.prototype.writePinData = function(data, callback) {
  this.writeDataCharacteristic(IO_PIN_SERVICE_UUID, PIN_DATA_CHARACTERISTIC_UUID, data, callback);
};

IoPinService.prototype.subscribePinData = function(callback) {
  this.onPinDataChangeBinded = this.onPinDataChange.bind(this);

  this.subscribeCharacteristic(IO_PIN_SERVICE_UUID, PIN_DATA_CHARACTERISTIC_UUID, this.onPinDataChangeBinded, callback);
};

IoPinService.prototype.unsubscribePinData = function(callback) {
  this.unsubscribeCharacteristic(IO_PIN_SERVICE_UUID, PIN_DATA_CHARACTERISTIC_UUID, this.onPinDataChangeBinded, callback);
};

IoPinService.prototype.onPinDataChange = function(data) {
  for (var i = 0; i < data.length; i += 2) {
    var pin = data.readUInt8(i);
    var value = data.readUInt8(i + 1);

    this.emit('pinDataChange', pin, value);
  }
};

IoPinService.prototype.readPinAdConfiguration = function(callback) {
  this.readUInt32LECharacteristic(IO_PIN_SERVICE_UUID, PIN_AD_CONFIGURATION_CHARACTERISTIC_UUID, function(error, value) {
    if (error) {
      return callback(error);
    }

    this._adMask = value;

    callback(error, value);
  }.bind(this));
};

IoPinService.prototype.writePinAdConfiguration = function(value, callback) {
  this._adMask = value;

  this.writeUInt32LECharacteristic(IO_PIN_SERVICE_UUID, PIN_AD_CONFIGURATION_CHARACTERISTIC_UUID, value, callback);
};

IoPinService.prototype.readPinIoConfiguration = function(callback) {
  this.readUInt32LECharacteristic(IO_PIN_SERVICE_UUID, PIN_IO_CONFIGURATION_CHARACTERISTIC_UUID, function(error, value) {
    if (error) {
      return callback(error);
    }

    this._ioMask = value;

    callback(error, value);
  }.bind(this));
};

IoPinService.prototype.writePinIoConfiguration = function(value, callback) {
  this._ioMask = value;

  this.writeUInt32LECharacteristic(IO_PIN_SERVICE_UUID, PIN_IO_CONFIGURATION_CHARACTERISTIC_UUID, value, callback);
};

IoPinService.prototype.pinAnalog = function(pin, callback) {
  this._adMask |= (1 << pin);

  this.writePinAdConfiguration(this._adMask, callback);
};

IoPinService.prototype.pinDigital = function(pin, callback) {
  this._adMask &= ~(1 << pin);

  this.writePinAdConfiguration(this._adMask, callback);
};

IoPinService.prototype.pinInput = function(pin, callback) {
  this._ioMask |= (1 << pin);

  this.writePinIoConfiguration(this._ioMask, callback);
};

IoPinService.prototype.pinOutput = function(pin, callback) {
  this._ioMask &= ~(1 << pin);

  this.writePinIoConfiguration(this._ioMask, callback);
};

IoPinService.prototype.writePin = function(pin, value, callback) {
  var data = new Buffer(2);

  data.writeUInt8(pin, 0);
  data.writeUInt8(value, 1);

  this.writePinData(data, callback);
};

IoPinService.prototype.readPin = function(pin, callback) {
  this.readPinData(function(error, pinData) {
    if (error) {
      callback(error);
    }

    var value = 0;

    for (var i = 0; i < pinData.length; i++) {
      if (pinData[i].pin === pin) {
        value = pinData[i].value;
        break;
      }
    }

    callback(null, value);
  }.bind(this));
};

module.exports = IoPinService;
