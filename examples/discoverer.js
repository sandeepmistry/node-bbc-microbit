// discovers all micro:bit's in range

var BBCMicrobit = require('../index'); // or require('bbc-microbit')

// scan for all microbits
console.log('Scanning for microbits');
BBCMicrobit.discoverAll(function(microbit) {
  console.log('\tFound a microbit: id = %s, address = %s', microbit.id, microbit.address);
});


// to scan for a particular id use:
//
// BBCMicrobit.discoverById(id, function(microbit) {
//   // ...
// });


// to scan for a particular address use:
//
// BBCMicrobit.discoverByAddress(address, function(microbit) {
//   // ...
// });
