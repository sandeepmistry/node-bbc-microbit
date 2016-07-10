var TEMPERATURE_SERVICE_UUID               = 'e95d6100251d470aa062fa1922dfa9a8';
var TEMPERATURE_CHARACTERISTIC_UUID        = 'e95d9250251d470aa062fa1922dfa9a8';
var TEMPERATURE_PERIOD_CHARACTERISTIC_UUID = 'e95d1b25251d470aa062fa1922dfa9a8';

var TemperatureService = function() {
};

TemperatureService.prototype.hasTemperatureService = function() {
  return this.hasService(TEMPERATURE_SERVICE_UUID);
};

TemperatureService.prototype.readTemperature = function(callback) {
  this.readInt8Characteristic(TEMPERATURE_SERVICE_UUID, TEMPERATURE_CHARACTERISTIC_UUID, callback);
};

TemperatureService.prototype.subscribeTemperature = function(callback) {
  this.onTemperatureChangeBinded = this.onTemperatureChange.bind(this);

  this.subscribeCharacteristic(TEMPERATURE_SERVICE_UUID, TEMPERATURE_CHARACTERISTIC_UUID, this.onTemperatureChangeBinded, callback);
};

TemperatureService.prototype.unsubscribeTemperature = function(callback) {
  this.unsubscribeCharacteristic(TEMPERATURE_SERVICE_UUID, TEMPERATURE_CHARACTERISTIC_UUID, this.onTemperatureChangeBinded, callback);
};

TemperatureService.prototype.onTemperatureChange = function(data) {
  this.emit('temperatureChange', data.readInt8(0));
};

TemperatureService.prototype.readTemperaturePeriod = function(callback) {
  this.readUInt16LECharacteristic(TEMPERATURE_SERVICE_UUID, TEMPERATURE_PERIOD_CHARACTERISTIC_UUID, callback);
};

TemperatureService.prototype.writeTemperaturePeriod = function(period, callback) {
  this.writeUInt16LECharacteristic(TEMPERATURE_SERVICE_UUID, TEMPERATURE_PERIOD_CHARACTERISTIC_UUID, period, callback);
};

module.exports = TemperatureService;
