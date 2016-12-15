var EVENT_SERVICE_SERVICE_UUID              = 'e95d93af251d470aa062fa1922dfa9a8';
var MICROBIT_EVENT_CHARACTERISTIC_UUID      = 'e95d9775251d470aa062fa1922dfa9a8';
var CLIENT_REQUIREMENTS_CHARACTERISTIC_UUID = 'e95d23c4251d470aa062fa1922dfa9a8';
var CLIENT_EVENT_CHARACTERISTIC_UUID        = 'e95d5404251d470aa062fa1922dfa9a8';

var EventService = function() {
};

EventService.prototype.hasEventService = function() {
  return this.hasService(EVENTSERVICE_SERVICE_UUID);
};

EventService.prototype.onEvent = function(data) {
  if (data.length !== 4) {
    return;
  }

  var id = data.readInt16LE(0);
  var value = data.readInt16LE(2);

  this.emit('event', id, value);
};

EventService.prototype.subscribeEvents = function(id, value, callback) {
  // specifying which events we want to be notified about
  this._writeClientEventRequirements(id, value, callback);

  if (!this._eventSubscribed) {
    this.onEventBinded = this.onEvent.bind(this);

    this.subscribeCharacteristic(EVENT_SERVICE_SERVICE_UUID, MICROBIT_EVENT_CHARACTERISTIC_UUID, this.onEventBinded);

    this._eventSubscribed = true;
  }
};

EventService.prototype.unsubscribeEvent = function(callback) {
  // allow this event if not previously explicitly subscribed through a call to subscribeEvents because the micro:bit may have persisted the
  // client characteristic configuration descriptor state from a previous "session"
  this.unsubscribeCharacteristic(EVENT_SERVICE_SERVICE_UUID, MICROBIT_EVENT_CHARACTERISTIC_UUID, this.onEventBinded, callback);

  this._eventSubscribed = false;
};

EventService.prototype._writeClientEventRequirements = function(id, value, callback) {
  var data = new Buffer(4);

  data.writeUInt16LE(id, 0);
  data.writeUInt16LE(value, 2);

  this.writeDataCharacteristic(EVENT_SERVICE_SERVICE_UUID, CLIENT_REQUIREMENTS_CHARACTERISTIC_UUID, data, callback);
};

EventService.prototype.writeEvent = function(id, value, callback) {
  var data = id << 16 | value;

  this.writeUInt32LECharacteristic(EVENT_SERVICE_SERVICE_UUID, CLIENT_EVENT_CHARACTERISTIC_UUID, data, callback);
};

module.exports = EventService;
