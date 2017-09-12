var smartblocks = require('../index.js');

smartblocks.GenericDevice.discover(function (instance) {

    console.log('GenericDevice.discover');

    //setup event listeners for notifications

    instance.on("PTHTemperatureNotif", function (data) {
        console.log("PTHTemperatureNotif: " + data);
    });
    
    instance.on("PTHHumidityNotif", function (data) {
        console.log("PTHHumidityNotif: " + data);
    });
    
    instance.on("PTHPressureNotif", function (data) {
        console.log("PTHPressureNotif: " + data);
    });

    //connect to the device and perform service initialization
    instance.connectAndSetUp(function (callback) {
        console.log('connectAndSetUp');

        /*
        //example read operation
        instance.PTHService.readTemperature(function(error, data){
            console.log("PTHService.readTemperature: ", data);
        });

        instance.PTHService.readHumidity(function(error, data){
            console.log("PTHService.readHumidity: ", data);
        });

        instance.PTHService.readPressure(function(error, data){
            console.log("PTHService.readPressure: ", data);
        });
        */
    });
    
});
