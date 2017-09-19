import * as Noble from "noble";
import * as NobleBase from "noble_base";
import * as Events from 'events';
import * as Smartblocks from './index'

export class AirQualityService extends Events.EventEmitter {
    public static readonly UUIDS = {
        Service: Smartblocks.UUID.generate("eab4"),
        eCO2: Smartblocks.UUID.generate("b8db"),
        TVOC: Smartblocks.UUID.generate("84f7")
    }

    constructor(private readonly baseDevice: NobleBase.Base) {
        super();
    }

    public readTVOC(): Promise<number> {
        return this.baseDevice.readUInt16LECharacterisitc(AirQualityService.UUIDS.Service, AirQualityService.UUIDS.TVOC);
    }

    public readECO2(): Promise<number> {
        return this.baseDevice.readUInt16LECharacterisitc(AirQualityService.UUIDS.Service, AirQualityService.UUIDS.eCO2);
    }

    private onECO2Notification = (data: Buffer) => {
        this.emit('eCO2', data.readUInt16LE(0));
    }

    private ontVOCNotification = (data: Buffer) => {
        this.emit('tVOC', data.readUInt16LE(0));
    }

    public subscribeTVOC(): Promise<void> {
        return this.baseDevice.subscribeCharacteristic(AirQualityService.UUIDS.Service, AirQualityService.UUIDS.TVOC, this.ontVOCNotification);
    }

    public unsubscribeTVOC(): Promise<void> {
        return this.baseDevice.unsubscribeCharacteristic(AirQualityService.UUIDS.Service, AirQualityService.UUIDS.TVOC, this.ontVOCNotification);
    }

    public subscribeECO2(): Promise<void> {
        return this.baseDevice.subscribeCharacteristic(AirQualityService.UUIDS.Service, AirQualityService.UUIDS.eCO2, this.onECO2Notification);
    }

    public unsubscribeECO2(): Promise<void> {
        return this.baseDevice.unsubscribeCharacteristic(AirQualityService.UUIDS.Service, AirQualityService.UUIDS.eCO2, this.onECO2Notification);
    }

    public subscribeAll(): Promise<void[]> {
        return Promise.all([this.subscribeECO2(), this.subscribeTVOC()]);
    }

    public present(): boolean {
        return this.baseDevice.hasCharacteristic(AirQualityService.UUIDS.Service, AirQualityService.UUIDS.eCO2) &&
            this.baseDevice.hasCharacteristic(AirQualityService.UUIDS.Service, AirQualityService.UUIDS.TVOC);
    }

    public on(event: "eCO2" | "tVOC", callback: ((data: number) => void)): this {
        return super.on(event, callback);
    }
}