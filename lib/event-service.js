var EVENTSERVICE_SERVICE_UUID          = 'E95D93AF251D470AA062FA1922DFA9A8'.toLowerCase();
var MICROBITEVENT_CHARACTERISTIC_UUID = 'E95D9775251D470AA062FA1922DFA9A8'.toLowerCase();

var CLIENTREQUIREMENTS_CHARACTERISTIC_UUID = 'E95D23C4251D470AA062FA1922DFA9A8'.toLowerCase();
var CLIENTEVENT_CHARACTERISTIC_UUID = 'E95D5404251D470AA062FA1922DFA9A8'.toLowerCase();

var EventService = function() {
};

EventService.microbit_event_subscribed = 0;

EventService.prototype.hasEventService = function() {
  return this.hasService(EVENTSERVICE_SERVICE_UUID);
};

EventService.prototype.onEvent = function(data) {
  if (data.length !== 4) {
    return;
  }
  var event_id = data.readInt16LE(0);
  var event_value = data.readInt16LE(2);
  this.emit('event', event_id, event_value);
};

EventService.prototype.subscribeEvents = function(client_req_event_id, client_req_event_value, callback) {
  // specifying which events we want to be notified about
  this.writeClientEventRequirements(client_req_event_id, client_req_event_value);

  if (EventService.microbit_event_subscribed === 0) {
    this.onEventBinded = this.onEvent.bind(this);
    this.subscribeCharacteristic(EVENTSERVICE_SERVICE_UUID, MICROBITEVENT_CHARACTERISTIC_UUID, this.onEventBinded, callback);
    EventService.microbit_event_subscribed = 1;
  }
};

EventService.prototype.unsubscribeEvent = function(callback) {
  // allow this event if not previously explicitly subscribed through a call to subscribeEvents because the micro:bit may have persisted the 
  // client characteristic configuration descriptor state from a previous "session"
  this.unsubscribeCharacteristic(EVENTSERVICE_SERVICE_UUID, MICROBITEVENT_CHARACTERISTIC_UUID, this.onEventBinded, callback);
  EventService.microbit_event_subscribed = 0;
};

EventService.prototype.writeClientEventRequirements = function(client_req_event_id, client_req_event_value, callback) {
  var client_reqs = new Buffer(4);
  client_reqs.writeUInt16LE(client_req_event_id,0);
  client_reqs.writeUInt16LE(client_req_event_value,2);
console.log(client_reqs);
  this.writeDataCharacteristic(EVENTSERVICE_SERVICE_UUID, CLIENTREQUIREMENTS_CHARACTERISTIC_UUID, client_reqs, callback);
}

EventService.prototype.writeClientEvent = function(event_id, event_value, callback) {
  var data = event_id << 16 | event_value
  this.writeUInt32LECharacteristic(EVENTSERVICE_SERVICE_UUID, CLIENTEVENT_CHARACTERISTIC_UUID, data, callback);
}

module.exports = EventService;
