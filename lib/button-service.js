var BUTTON_SERVICE_UUID          = 'e95d9882251d470aa062fa1922dfa9a8';
var BUTTON_A_CHARACTERISTIC_UUID = 'e95dda90251d470aa062fa1922dfa9a8';
var BUTTON_B_CHARACTERISTIC_UUID = 'e95dda91251d470aa062fa1922dfa9a8';

var ButtonService = function() {
};

ButtonService.prototype.hasButtonService = function() {
  return this.hasService(BUTTON_SERVICE_UUID);
};

ButtonService.prototype.subscribeButtonA = function(callback) {
  this.onButtonAChangeBinded = this.onButtonAChange.bind(this);

  this.subscribeCharacteristic(BUTTON_SERVICE_UUID, BUTTON_A_CHARACTERISTIC_UUID, this.onButtonAChangeBinded, callback);
};

ButtonService.prototype.unsubscribeButtonA = function(callback) {
  this.unsubscribeCharacteristic(BUTTON_SERVICE_UUID, BUTTON_A_CHARACTERISTIC_UUID, this.onButtonAChangeBinded, callback);
};

ButtonService.prototype.onButtonAChange = function(data) {
  this.emit('buttonAChange', data.readUInt8(0));
};

ButtonService.prototype.subscribeButtonB = function(callback) {
  this.onButtonBChangeBinded = this.onButtonBChange.bind(this);

  this.subscribeCharacteristic(BUTTON_SERVICE_UUID, BUTTON_B_CHARACTERISTIC_UUID, this.onButtonBChangeBinded, callback);
};

ButtonService.prototype.unsubscribeButtonB = function(callback) {
  this.unsubscribeCharacteristic(BUTTON_SERVICE_UUID, BUTTON_B_CHARACTERISTIC_UUID, this.onButtonBChangeBinded, callback);
};

ButtonService.prototype.onButtonBChange = function(data) {
  this.emit('buttonBChange', data.readUInt8(0));
};

ButtonService.prototype.subscribeButtons = function(callback) {
  this.subscribeButtonA(function(error) {
    if (error) {
      return callback(error);
    }

    this.subscribeButtonB(callback);
  }.bind(this));
};

ButtonService.prototype.unsubscribeButtons = function(callback) {
  this.unsubscribeButtonB(function(error) {
    if (error) {
      return callback(error);
    }

    this.unsubscribeButtonA(callback);
  }.bind(this));
};

module.exports = ButtonService;
