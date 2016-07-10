var LED_SERVICE_UUID                        = 'e95dd91d251d470aa062fa1922dfa9a8';
var LED_MATRIX_STATE_CHARACTERISTIC_UUID    = 'e95d7b77251d470aa062fa1922dfa9a8';
var LED_TEXT_CHARACTERISTIC_UUID            = 'e95d93ee251d470aa062fa1922dfa9a8';
var LED_SCROLLING_DELAY_CHARACTERISTIC_UUID = 'e95d0d2d251d470aa062fa1922dfa9a8';

var LedService = function() {
};

LedService.prototype.hasLedService = function() {
  return this.hasService(LED_SERVICE_UUID);
};

LedService.prototype.readLedMatrixState = function(callback) {
  this.readDataCharacteristic(LED_SERVICE_UUID, LED_MATRIX_STATE_CHARACTERISTIC_UUID, callback);
};

LedService.prototype.writeLedMatrixState = function(data, callback) {
  this.writeDataCharacteristic(LED_SERVICE_UUID, LED_MATRIX_STATE_CHARACTERISTIC_UUID, data, callback);
};

LedService.prototype.writeLedText = function(text, callback) {
  this.writeStringCharacteristic(LED_SERVICE_UUID, LED_TEXT_CHARACTERISTIC_UUID, text, callback);
};

LedService.prototype.readLedScrollingDelay = function(callback) {
  this.readUInt16LECharacteristic(LED_SERVICE_UUID, LED_SCROLLING_DELAY_CHARACTERISTIC_UUID, callback);
};

LedService.prototype.writeLedScrollingDelay = function(delay, callback) {
  this.writeUInt16LECharacteristic(LED_SERVICE_UUID, LED_SCROLLING_DELAY_CHARACTERISTIC_UUID, delay, callback);
};

module.exports = LedService;
