var NobleDevice = require('noble-device');

var PTHService = require("./smPTHService.js");
var AirQualityService = require("./smAirQualityService.js");
var TopLedService = require("./smTopLedService.js");

class GenericDevice {

    constructor(peripheral) {
        NobleDevice.call(this, peripheral);
    };

    static is(peripheral) {
        return (peripheral.advertisement.manufacturerData[0] == 0xAC && peripheral.advertisement.manufacturerData[1] == 0x03);
    };

    connectAndSetUp(callback) {

        console.log("connectAndSetUp internal");

        NobleDevice.prototype.connectAndSetUp.call(this, function (error) {
            if (error) {
                return callback(error);
            }
            callback();
        }.bind(this));
    };

    onDisconnect() {
        // clean up ...
        console.log("onDisconnect");

        // call super's onDisconnect
        NobleDevice.prototype.onDisconnect.call(this);
    };
};

// inherit noble device
NobleDevice.Util.inherits(GenericDevice, NobleDevice);

//add support for services
NobleDevice.Util.mixin(GenericDevice, PTHService);
NobleDevice.Util.mixin(GenericDevice, AirQualityService);
NobleDevice.Util.mixin(GenericDevice, TopLedService);


module.exports = GenericDevice;