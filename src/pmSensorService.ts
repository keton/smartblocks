import * as Noble from "noble";
import * as NobleBase from "noble_base";
import * as Events from 'events';
import * as Smartblocks from './index'

export class PmSensorService extends Events.EventEmitter {
	public static readonly UUIDS = {
		Service: Smartblocks.UUID.generate("d9a1"),
		Pm25: Smartblocks.UUID.generate("d9a2"),
		Pm10: Smartblocks.UUID.generate("d9a3")
	}

	constructor(private readonly baseDevice: NobleBase.Base) {
		super();
	}

	public readPm25(): Promise<number> {
		return this.baseDevice.readUInt16LECharacterisitc(PmSensorService.UUIDS.Service, PmSensorService.UUIDS.Pm25);
	}

	public readPm10(): Promise<number> {
		return this.baseDevice.readUInt16LECharacterisitc(PmSensorService.UUIDS.Service, PmSensorService.UUIDS.Pm10);
	}

	private onPm25Notification = (data: Buffer) => {
		this.emit('pm25', data.readUInt16LE(0));
	}

	private onPm10Notification = (data: Buffer) => {
		this.emit('pm10', data.readUInt16LE(0));
	}

	public subscribePm25(): Promise<void> {
		return this.baseDevice.subscribeCharacteristic(PmSensorService.UUIDS.Service, PmSensorService.UUIDS.Pm25, this.onPm25Notification);
	}

	public unsubscribePm25(): Promise<void> {
		return this.baseDevice.unsubscribeCharacteristic(PmSensorService.UUIDS.Service, PmSensorService.UUIDS.Pm25, this.onPm25Notification);
	}

	public subscribePm10(): Promise<void> {
		return this.baseDevice.subscribeCharacteristic(PmSensorService.UUIDS.Service, PmSensorService.UUIDS.Pm10, this.onPm10Notification);
	}

	public unsubscribePm10(): Promise<void> {
		return this.baseDevice.unsubscribeCharacteristic(PmSensorService.UUIDS.Service, PmSensorService.UUIDS.Pm10, this.onPm10Notification);
	}

	public subscribeAll(): Promise<void[]> {
		return Promise.all([this.subscribePm25(), this.subscribePm10()]);
	}

	public present(): boolean {
		return this.baseDevice.hasCharacteristic(PmSensorService.UUIDS.Service, PmSensorService.UUIDS.Pm10) &&
			this.baseDevice.hasCharacteristic(PmSensorService.UUIDS.Service, PmSensorService.UUIDS.Pm25);
	}

	public on(event: "pm25" | "pm10", callback: ((data: number) => void)): this {
		return super.on(event, callback);
	}
}
