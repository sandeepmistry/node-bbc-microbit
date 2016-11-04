var EVENTSERVICE_SERVICE_UUID          = 'E95D93AF251D470AA062FA1922DFA9A8'.toLowerCase();
var MICROBITEVENT_CHARACTERISTIC_UUID = 'E95D9775251D470AA062FA1922DFA9A8'.toLowerCase();

var CLIENTREQUIREMENTS_CHARACTERISTIC_UUID = 'E95D23C4251D470AA062FA1922DFA9A8'.toLowerCase();
var CLIENTEVENT_CHARACTERISTIC_UUID = 'E95D5404251D470AA062FA1922DFA9A8'.toLowerCase();

var EventService = function() {
};

EventService.prototype.hasEventService = function() {
  return this.hasService(EVENTSERVICE_SERVICE_UUID);
};

EventService.prototype.onMicrobitEventChange = function(data) {
  if (data.length !== 4) {
    return;
  }
  var event = data.readInt16LE(0);
  var value = data.readInt16LE(2);
  this.emit('microbitEventChange', event, value);
};

EventService.prototype.subscribeMicrobitEvents = function(client_reqs, callback) {
  // specifying which events we want to be notified about
  this.writeClientEventRequirements(client_reqs);

  this.onMicrobitEventChangeBinded = this.onMicrobitEventChange.bind(this);
  this.subscribeCharacteristic(EVENTSERVICE_SERVICE_UUID, MICROBITEVENT_CHARACTERISTIC_UUID, this.onMicrobitEventChangeBinded, callback);
};

EventService.prototype.unsubscribeMicrobitEvent = function(callback) {
  this.unsubscribeCharacteristic(EVENTSERVICE_SERVICE_UUID, MICROBITEVENT_CHARACTERISTIC_UUID, this.onEventBinded, callback);
};

EventService.prototype.writeClientEventRequirements = function(client_reqs, callback) {
  this.writeUInt32LECharacteristic(EVENTSERVICE_SERVICE_UUID, CLIENTREQUIREMENTS_CHARACTERISTIC_UUID, client_reqs, callback);
}

EventService.prototype.writeEvent = function(id, value, callback) {
  var data = id << 16 | value
  this.writeUInt32LECharacteristic(EVENTSERVICE_SERVICE_UUID, CLIENTEVENT_CHARACTERISTIC_UUID, data, callback);
}

module.exports = EventService;