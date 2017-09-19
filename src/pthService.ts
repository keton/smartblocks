import * as Noble from "noble";
import * as NobleBase from "noble_base";
import * as Events from 'events';

export class PTHService extends Events.EventEmitter {
    public static readonly UUIDS = {
        Service: "181a",
        Temperature: "2a6e",
        Humidity: "2a6f",
        Pressure: "2a6d",
    }

    constructor(private readonly baseDevice: NobleBase.Base) {
        super();
    }

    public readPressure(): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            try {
                const pressureRaw = await this.baseDevice.readUInt32LECharacterisitc(PTHService.UUIDS.Service, PTHService.UUIDS.Pressure);
                resolve(pressureRaw / 10);
            } catch (error) {
                reject(error);
            }
        });
    }

    public readHumidity(): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            try {
                const humidityRaw = await this.baseDevice.readUInt16LECharacterisitc(PTHService.UUIDS.Service, PTHService.UUIDS.Humidity);
                resolve(humidityRaw / 100);
            } catch (error) {
                reject(error);
            }
        });
    }

    public readTemperature(): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            try {
                const temperatureRaw = await this.baseDevice.readInt16LECharacterisitc(PTHService.UUIDS.Service, PTHService.UUIDS.Temperature);
                resolve(temperatureRaw / 100);
            } catch (error) {
                reject(error);
            }
        });
    }

    private onTemperatureNotification=(data: Buffer) => {
        this.emit("temperature", data.readInt16LE(0) / 100);
    }

    private onHumidityNotification=(data: Buffer) => {
        this.emit("humidity", data.readUInt16LE(0) / 100);
    }

    private onPressureNotification=(data: Buffer) => {
        this.emit("pressure", data.readUInt32LE(0) / 10);
    }

    public subscribeTemperature(): Promise<void> {
        return this.baseDevice.subscribeCharacteristic(PTHService.UUIDS.Service, PTHService.UUIDS.Temperature, this.onTemperatureNotification);
    }

    public unsubscribeTemperature(): Promise<void> {
        return this.baseDevice.unsubscribeCharacteristic(PTHService.UUIDS.Service, PTHService.UUIDS.Temperature, this.onTemperatureNotification);
    }

    public subscribeHumidity(): Promise<void> {
        return this.baseDevice.subscribeCharacteristic(PTHService.UUIDS.Service, PTHService.UUIDS.Humidity, this.onHumidityNotification);
    }

    public unsubscribeHumidity(): Promise<void> {
        return this.baseDevice.unsubscribeCharacteristic(PTHService.UUIDS.Service, PTHService.UUIDS.Humidity, this.onHumidityNotification);
    }

    public subscribePressure(): Promise<void> {
        return this.baseDevice.subscribeCharacteristic(PTHService.UUIDS.Service, PTHService.UUIDS.Pressure, this.onPressureNotification);
    }

    public unsubscribePressure(): Promise<void> {
        return this.baseDevice.unsubscribeCharacteristic(PTHService.UUIDS.Service, PTHService.UUIDS.Pressure, this.onPressureNotification);
    }

    
    public subscribeAll():Promise<void[]> {
        return Promise.all([this.subscribeHumidity(), this.subscribePressure(), this.subscribeTemperature()]);
    }

    public unsubscribeAll():Promise<void[]> {
        return Promise.all([this.unsubscribeHumidity(), this.unsubscribePressure(), this.unsubscribeTemperature()]);
    }
    

    public present(): boolean {
        return this.baseDevice.hasCharacteristic(PTHService.UUIDS.Service, PTHService.UUIDS.Temperature) &&
            this.baseDevice.hasCharacteristic(PTHService.UUIDS.Service, PTHService.UUIDS.Pressure) &&
            this.baseDevice.hasCharacteristic(PTHService.UUIDS.Service, PTHService.UUIDS.Humidity);
    }

    public on(event: "temperature" | "humidity" | "pressure", callback: ((data: number) => void)) {
        return super.on(event, callback);
    }
}