# node-bbc-microbit

Control a [BBC micro:bit](https://www.microbit.co.uk/) from Node.js using BLE.

## Prerequisites

 * See [noble prerequisites](https://github.com/sandeepmistry/noble).
 * Requires a custom firmware build on the micro:bit. This build removes pairing security and enables all BLE services. The source code of the custom firmware can be found [here](https://github.com/sandeepmistry/node-bbc-microbit-firmware).

### Flashing micro:bit firmware

 1. Save hex file from [firmware folder](firmware/) to computer.
 1. Connect micro:bit to computer using USB cable.
 1. Copy hex file to micro:bit disk drive.
 1. Calibrate magnetometer, by rotating micro:bit around in a circle.

## Install

```
npm install bbc-microbit
```

## Examples

See [examples](examples/) folder.

## Usage

See [API documentation](API.md).
