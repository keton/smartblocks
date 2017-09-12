class PTHService {

    //return UUIDs associated with this service
    static getUUIDs() {
        return {
            Service: "181a",
            TemperatureCharacteristic: "2a6e",
            HumidityCharacteristic: "2a6f",
            PressureCharacteristic: "2a6d",
        };
    };

    constructor(peripheral) {
        this.peripheral=peripheral;
    }

    connectAndSetup() { 
        this.notifyHumidity();
        this.notifyPressure();
        this.notifyTemperature();
    };

    hasTemperatureChar() {
        return this.peripheral.hasCharacteristic(PTHService.getUUIDs().Service, PTHService.getUUIDs().TemperatureCharacteristic);
    };

    hasPressureChar() {
        return this.peripheral.hasCharacteristic(PTHService.getUUIDs().Service, PTHService.getUUIDs().PressureCharacteristic);
    };

    hasHumidityChar() {
        return this.peripheral.hasCharacteristic(PTHService.getUUIDs().Service, PTHService.getUUIDs().HumidityCharacteristic);
    };

    onTemperatureNotification(data) {
        this.peripheral.emit('PTHTemperatureNotif', data.readInt16LE(0)/100);
    };

    onHumidityNotification(data) {
        this.peripheral.emit('PTHHumidityNotif', data.readUInt16LE(0)/100);
    };

    onPressureNotification(data) {
        this.peripheral.emit('PTHPressureNotif', data.readUInt32LE(0)/10);
    };

    notifyTemperature(callback) {
        if(!this.hasTemperatureChar()) return;

        this.onTemperatureNotificationBinded = this.onTemperatureNotification.bind(this);
        this.peripheral.notifyCharacteristic(PTHService.getUUIDs().Service, PTHService.getUUIDs().TemperatureCharacteristic, true, this.onTemperatureNotificationBinded, callback);
    };

    notifyHumidity(callback) {
        if(!this.hasHumidityChar()) return;

        this.onHumidityNotificationBinded = this.onHumidityNotification.bind(this);
        this.peripheral.notifyCharacteristic(PTHService.getUUIDs().Service, PTHService.getUUIDs().HumidityCharacteristic, true, this.onHumidityNotificationBinded, callback);
    };

    notifyPressure(callback) {
        if(!this.hasPressureChar()) return;

        this.onPressureNotificationBinded = this.onPressureNotification.bind(this);
        this.peripheral.notifyCharacteristic(PTHService.getUUIDs().Service, PTHService.getUUIDs().PressureCharacteristic, true, this.onPressureNotificationBinded, callback);
    };

    unnotifyTemperature(callback) {
        this.peripheral.notifyCharacteristic(PTHService.getUUIDs().Service, PTHService.getUUIDs().TemperatureCharacteristic, false, this.onTemperatureNotificationBinded, callback);
    };

    unnotifyHumidity(callback) {
        this.peripheral.notifyCharacteristic(PTHService.getUUIDs().Service, PTHService.getUUIDs().HumidityCharacteristic, false, this.onHumidityNotificationBinded, callback);
    };

    unnotifyPressure(callback) {
        this.peripheral.notifyCharacteristic(PTHService.getUUIDs().Service, PTHService.getUUIDs().PressureCharacteristic, false, this.onPressureNotificationBinded, callback);
    };

};

module.exports = PTHService;
