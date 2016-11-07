var EVENTSERVICE_SERVICE_UUID          = 'E95D93AF251D470AA062FA1922DFA9A8'.toLowerCase();
var MICROBITEVENT_CHARACTERISTIC_UUID = 'E95D9775251D470AA062FA1922DFA9A8'.toLowerCase();

var CLIENTREQUIREMENTS_CHARACTERISTIC_UUID = 'E95D23C4251D470AA062FA1922DFA9A8'.toLowerCase();
var CLIENTEVENT_CHARACTERISTIC_UUID = 'E95D5404251D470AA062FA1922DFA9A8'.toLowerCase();

var microbit_event_subscribed = 0;

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

EventService.prototype.subscribeMicrobitEvents = function(client_req_event_id, client_req_event_value, callback) {
  // specifying which events we want to be notified about
  console.log("writing to micro:bit event requirements");
  this.writeClientEventRequirements(client_req_event_id, client_req_event_value,callback);

  if (microbit_event_subscribed === 0) {
    console.log("Subscribing for micro:bit event notifications");
    this.onMicrobitEventChangeBinded = this.onMicrobitEventChange.bind(this);
    this.subscribeCharacteristic(EVENTSERVICE_SERVICE_UUID, MICROBITEVENT_CHARACTERISTIC_UUID, this.onMicrobitEventChangeBinded, callback);
    microbit_event_subscribed = 1;
  }
};

EventService.prototype.unsubscribeMicrobitEvent = function(callback) {
  // allow this event if not previously explicitly subscribed through a call to subscribeMicrobitEvents because the micro:bit may have persisted the 
  // client characteristic configuration descriptor state from a previous "session"
  this.unsubscribeCharacteristic(EVENTSERVICE_SERVICE_UUID, MICROBITEVENT_CHARACTERISTIC_UUID, this.onEventBinded, callback);
  microbit_event_subscribed = 0;
};

EventService.prototype.writeClientEventRequirements = function(client_req_event_id, client_req_event_value, callback) {
  var client_reqs = new Buffer(4);
  client_reqs[0] = (client_req_event_id & 0xFF);
  client_reqs[1] = (client_req_event_id >> 8) & 0xFF;
  client_reqs[2] = (client_req_event_value & 0xFF);
  client_reqs[3] = (client_req_event_value >> 8) & 0xFF;
  this.writeDataCharacteristic(EVENTSERVICE_SERVICE_UUID, CLIENTREQUIREMENTS_CHARACTERISTIC_UUID, client_reqs, callback);
}

EventService.prototype.writeClientEvent = function(id, value, callback) {
  var data = id << 16 | value
  this.writeUInt32LECharacteristic(EVENTSERVICE_SERVICE_UUID, CLIENTEVENT_CHARACTERISTIC_UUID, data, callback);
}

module.exports = EventService;