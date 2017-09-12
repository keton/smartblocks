const NobleDevice = require('noble-device');

const PTHService = require("./smPTHService.js");
const AirQualityService = require("./smAirQualityService.js");
const TopLedService = require("./smTopLedService.js");

class GenericDevice {

    constructor(peripheral) {
        NobleDevice.call(this, peripheral);
        this.PTHService=new PTHService(this);
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
            
            this.PTHService.connectAndSetup();

            callback();
        }.bind(this));
    };
};

// inherit noble device
NobleDevice.Util.inherits(GenericDevice, NobleDevice);

module.exports = GenericDevice;