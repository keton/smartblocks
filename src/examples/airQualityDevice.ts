import * as Noble from "noble";
import * as NobleBase from "noble_base";
import * as Smartblocks from "../index";

class AirQualityDevice extends NobleBase.Base {
	public readonly pthService: Smartblocks.PTHService = new Smartblocks.PTHService(this);
	public readonly airQualityService: Smartblocks.AirQualityService = new Smartblocks.AirQualityService(this);

	protected async onConnectAndSetupDone() {
		try {
			await this.pthService.subscribeAll();
			await this.airQualityService.subscribeAll();

		} catch (error) {
			console.log(error);
		}
	}
	is(peripheral: Noble.Peripheral): boolean {
		return (peripheral.advertisement.manufacturerData[0] == 0xAC &&
			peripheral.advertisement.manufacturerData[1] == 0x03 &&
			peripheral.advertisement.manufacturerData[2] == 0xD3);
	}
}

class Application {
	public static main() {

		const scanHelper = new NobleBase.ScanHelper<AirQualityDevice>(AirQualityDevice, (device) => {

			device.pthService.on("temperature", (data) => {
				console.log(device.getDeviceId() + " temperature: " + data.toString() + " Centigrade");
			});

			device.pthService.on("humidity", (data) => {
				console.log(device.getDeviceId() + " humidity: " + data.toString() + "% Rh");
			});

			device.pthService.on("pressure", (data) => {
				console.log(device.getDeviceId() + " pressure: " + data.toString() + " Pa");
			});

			device.airQualityService.on("eCO2", (data) => {
				console.log(device.getDeviceId() + " eCO2: " + data.toString() + "ppm");
			});

			device.airQualityService.on("tVOC", (data) => {
				console.log(device.getDeviceId() + " tVOC: " + data.toString() + "ppm");
			});
		});

		scanHelper.discoverAll();
	}
}

Application.main();