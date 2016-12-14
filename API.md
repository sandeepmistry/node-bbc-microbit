# node-bbc-microbit API

1. [Discovery](#discovery)
1. [Connecting and disconnecting](#connecting-and-disconnecting)
1. [Accelerometer](#accelerometer)
1. [Buttons](#buttons)
1. [Pin IO](#pin-io)
1. [LED Matrix](#led-matrix)
1. [Magnetometer](#magnetometer)
1. [Temperature](#temperature)
1. [UART](#uart)
1. [Event](#event-5)

## Require module

```javascript
var BBCMicrobit = require('bbc-microbit');
```

## Discovery

### Single

```javascript
BBCMicrobit.discover(callback(microbit));
```

### All

```javascript
function onDiscover(microbit) {
  // ...
}

BBCMicrobit.discoverAll(onDiscover);

BBCMicrobit.stopDiscoverAll(onDiscover);
```

### By id

```javascript
BBCMicrobit.discoverById(id, callback(microbit));
```

### By address

```javascript
BBCMicrobit.discoverByAddress(address, callback(microbit));
```

### Properties:

```javascript
microbit = {
  id: "<peripheral id>",
  address: "<BT address>"
};
```

## Connecting and disconnecting

### Connect and Set Up

```javascript
microbit.connectAndSetUp(callback(error));
```

### Disconnect

```javascript
microbit.disconnect(callback);
```

### Disconnect event

Add event listener for when micro:bit disconnects:

```javascript
microbit.once('disconnect', callback);
```

## Device Information

```javascript
microbit.readDeviceName(callback(error, deviceName));

microbit.readModelNumber(callback(error, modelNumber));

microbit.readSerialNumber(callback(error, serialNumber));

microbit.readFirmwareRevision(callback(error, firmwareRevision));

```

## [Accelerometer](https://lancaster-university.github.io/microbit-docs/ble/accelerometer-service/)

Units for `x`, `y`, and `z` is G's.

### Data period

Read or write the `period`. Support values are: 1, 2, 5, 10, 20, 80, 160, or 640 ms.

```javascript
microbit.readAccelerometerPeriod(callback(error, period));

microbit.writeAccelerometerPeriod(period, callback(error));
```

### Read

```javascript
microbit.readAccelerometer(callback(error, x, y, z));
```

### Subscription

```javascript
microbit.subscribeAccelerometer(callback(error));

microbit.unsubscribeAccelerometer(callback(error));
```

#### Event

```javascript
microbit.on('accelerometerChange', function(x, y, z) {
  // ...
});
```

## [Buttons](https://lancaster-university.github.io/microbit-docs/ble/button-service/)

### Subscription

```javascript
// for both buttons
microbit.subscribeButtons(callback(error));

microbit.unsubscribeButtons(callback(error));

// just button A
microbit.subscribeButtonA(callback(error));

microbit.unsubscribeButtonA(callback(error));

// just button B
microbit.subscribeButtonB(callback(error));

microbit.unsubscribeButtonB(callback(error));
```

#### Events

```javascript
microbit.on('buttonAChange', function(value) {
  // ...
});

microbit.on('buttonBChange', function(value) {
  // ...
});
```

`value` interpretation:
 * `0`: not pressed
 * `1`: pressed
 * `2`: long press

# [Pin IO](https://lancaster-university.github.io/microbit-docs/ble/iopin-service/)

`pin` must be between `0` and `20`.

`value` must be between `0` and `255`.

### Configure modes

```javascript
// AD mode
microbit.pinAnalog(pin, callback(error));

microbit.pinDigital(pin, callback(error));

// IO mode
microbit.pinInput(pin, callback(error));

microbit.pinOutput(pin, callback(error));
```

### Read or write

```javascript
microbit.readPin(pin, callback(error, value)); // pin must be configured as input

microbit.writePin(pin, value, callback(error)); // pin must be configured as output
```

### Subscription

```javascript
microbit.subscribePinData(callback(error));

microbit.unsubscribePinData(callback(error));
```

#### Event

```javascript
microbit.on('pinDataChange', function(pin, value) {
  // ...
});
```

### Advanced

```javascript
// data is a Buffer with format: <pin> <value>, ...
microbit.readPinData(callback(error, data));

microbit.writePinData(data, callback(error));

// value is a buffer, n-bit of 0 means pin n is in digital mode, 1 means analog mode
microbit.readPinAdConfiguration(callback(error, value));

microbit.writePinAdConfiguration(value, callback(error));

// value is a buffer, n-bit of 0 means pin n  is in output mode, 1 means input mode
microbit.readPinIoConfiguration(callback(error, value));

microbit.writePinIoConfiguration(value, callback(error));
```

## [LED Matrix](https://lancaster-university.github.io/microbit-docs/ble/led-service/)

### Read/write raw data

`value` is a 5 byte Buffer.  Each byte corresponds to a row, and column value is the n'th bit. `0` for off, `1` for on.

```javascript
microbit.readLedMatrixState(callback(error, value));

microbit.writeLedMatrixState(value, callback(error));
```

### Write text

`text` is a string that must be 20 characters or less

```javascript
microbit.writeLedText(text, callback(error));
```

#### Text scrolling delay

`delay` is scrolling delay of text in ms.

```javascript
microbit.readLedScrollingDelay(callback(error, delay));

microbit.writeLedScrollingDelay(delar, callback(error));
```

## [Magnetometer](https://lancaster-university.github.io/microbit-docs/ble/magnetometer-service/)

### Data period

Read or write the `period`. Support values are: 1, 2, 5, 10, 20, 80, 160, or 640 ms.

```javascript
microbit.readMagnetometerPeriod(callback(error, period));

microbit.writeMagnetometerPeriod(period, callback(error));
```

### Read

```javascript
microbit.readMagnetometer(callback(error, x, y, z));

microbit.readMagnetometerBearing(callback(error, bearing));
```

### Subscription

```javascript
// x, y, and z values
microbit.subscribeMagnetometer(callback(error));

microbit.unsubscribeMagnetometer(callback(error));

// bearing
microbit.subscribeMagnetometerBearing(callback(error));

microbit.unsubscribeMagnetometerBearing(callback(error));
```

#### Event

```javascript
microbit.on('magnetometerChange', function(x, y, z) {
  // ...
});

microbit.on('magnetometerBearingChange', function(bearing) {
  // ...
});
```

## [Temperature](https://lancaster-university.github.io/microbit-docs/ble/temperature-service/)

Units for `temperature` is °C.

### Data period

`period` is in ms.

```javascript
microbit.readTemperaturePeriod(callback(error, period));

microbit.writeTemperaturePeriod(period, callback(error));
```

### Read

```javascript
microbit.readTemperature(callback(error, temperature));
```

### Subscription

```javascript
microbit.subscribeTemperature(callback(error));

microbit.unsubscribeTemperature(callback(error));
```

#### Event

```javascript
microbit.on('temperatureChange', function(temperature) {
  // ...
});
```

## [UART](https://lancaster-university.github.io/microbit-docs/ble/uart-service/)

__NOTE:__ UART service does nothing currently. It does __not__ bridge the hardware serial pins to BLE!

`data` is a buffer.

### Subscription

```javascript
microbit.subscribeUart(callback(error));

microbit.unsubscribeUart(callback(error));
```

#### Event

```javascript
microbit.on('uartData', function(data) {
  // ...
});
```

### Write

```javascript
microbit.writeUart(data, callback(error));
```

## [Event](https://lancaster-university.github.io/microbit-docs/ble/event-service/)

### Micro:bit Events

Events come in two varieties, reflected by the two corresponding characteristics:

Micro:bit Events emanate from the micro:bit and may be notified to the connected client.

Client Events emanate from the connected client and may be written to the connected micro:bit


### Write event

```javascript
microbit.writeEvent(id, value, callback);
```

### Subscription

```javascript
microbit.subscribeEvents(id, value, callback(error));

microbit.unsubscribeEvent(callback(error));
```

#### Event

```javascript
microbit.on('event', function(id, value) {
  // ...
});
```
