const NobleDevice = require('noble-device');

const PTHService = require("./smPTHService.js");
const AirQualityService = require("./smAirQualityService.js");
const TopLedService = require("./smTopLedService.js");

class GenericDevice {

    constructor(peripheral) {
        
        //call nobleDevice superconstructor
        NobleDevice.call(this, peripheral);

        //instantiate services as fields
        //noble-device mixins don't work for ES6 classes!
        this.PTHService=new PTHService(this);
        this.AirQualityService=new AirQualityService(this);
        this.TopLedService=new TopLedService(this);
    };

    //returns true if we should connect to this device
    static is(peripheral) {

        //attempt to connect to all Smablo LTD devices
        return (peripheral.advertisement.manufacturerData[0] == 0xAC && peripheral.advertisement.manufacturerData[1] == 0x03);
    };

    //connect, discover and initialize services
    connectAndSetUp(callback) {

        console.log("connectAndSetUp internal");

        //call superclass function
        NobleDevice.prototype.connectAndSetUp.call(this, function (error) {

            //check for errors
            if (error) {
                return callback(error);
            }
            
            //initialize services
            this.PTHService.connectAndSetup();
            this.AirQualityService.connectAndSetup();
            this.TopLedService.connectAndSetup();

            //signal end of processing
            callback();

        }.bind(this));
    };
};

// inherit noble device
NobleDevice.Util.inherits(GenericDevice, NobleDevice);

module.exports = GenericDevice;