var smartblocks = require('../index.js');

smartblocks.GenericDevice.discover(function (instance) {

    console.log('GenericDevice.discover');

    instance.on("PTHTemperatureNotif", function (data) {
        console.log("PTHTemperatureNotif: " + data);
    });
    
    instance.on("PTHHumidityNotif", function (data) {
        console.log("PTHHumidityNotif: " + data);
    });
    
    instance.on("PTHPressureNotif", function (data) {
        console.log("PTHPressureNotif: " + data);
    });

    instance.connectAndSetUp(function (callback) {
        console.log('connectAndSetUp');
    });
    
});
