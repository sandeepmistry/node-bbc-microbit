var UART_SERVICE_UUID           = '6e400001b5a3f393e0a9e50e24dcca9e';
var UART_RX_CHARACTERISTIC_UUID = '6e400002b5a3f393e0a9e50e24dcca9e';
var UART_TX_CHARACTERISTIC_UUID = '6e400003b5a3f393e0a9e50e24dcca9e';

var UartService = function() {
};

UartService.prototype.hasUartService = function() {
  return this.hasService(UART_SERVICE_UUID);
};

UartService.prototype.subscribeUart = function(callback) {
  this.onUartDataBinded = this.onUartData.bind(this);

  this.subscribeCharacteristic(UART_SERVICE_UUID, UART_RX_CHARACTERISTIC_UUID, this.onUartDataBinded, callback);
};

UartService.prototype.unsubscribeUart = function(callback) {
  this.unsubscribeCharacteristic(UART_SERVICE_UUID, UART_RX_CHARACTERISTIC_UUID, this.onUartDataBinded, callback);
};

UartService.prototype.onUartData = function(data) {
  this.emit('uartData', data);
};

UartService.prototype.writeUart = function(data, callback) {
  this.writeDataCharacteristic(UART_SERVICE_UUID, UART_TX_CHARACTERISTIC_UUID, data, callback);
};

module.exports = UartService;
