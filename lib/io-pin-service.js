var IO_PIN_SERVICE_UUID                      = 'e95d127b251d470aa062fa1922dfa9a8';
var PIN_DATA_CHARACTERISTIC_UUID             = 'e95d8d00251d470aa062fa1922dfa9a8';
var PIN_AD_CONFIGURATION_CHARACTERISTIC_UUID = 'e95d5899251d470aa062fa1922dfa9a8';
var PIN_IO_CONFIGURATION_CHARACTERISTIC_UUID = 'e95db9fe251d470aa062fa1922dfa9a8';

var IoPinService = function() {
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
        value, value
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
  this.readUInt32LECharacteristic(IO_PIN_SERVICE_UUID, PIN_AD_CONFIGURATION_CHARACTERISTIC_UUID, callback);
};

IoPinService.prototype.writePinAdConfiguration = function(value, callback) {
  this.writeUInt32LECharacteristic(IO_PIN_SERVICE_UUID, PIN_AD_CONFIGURATION_CHARACTERISTIC_UUID, value, callback);
};

IoPinService.prototype.readPinIoConfiguration = function(callback) {
  this.readUInt32LECharacteristic(IO_PIN_SERVICE_UUID, PIN_IO_CONFIGURATION_CHARACTERISTIC_UUID, callback);
};

IoPinService.prototype.writePinIoConfiguration = function(value, callback) {
  this.writeUInt32LECharacteristic(IO_PIN_SERVICE_UUID, PIN_IO_CONFIGURATION_CHARACTERISTIC_UUID, value, callback);
};

module.exports = IoPinService;
