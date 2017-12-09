import * as Noble from "noble";
import * as NobleBase from "noble_base";
import * as Smartblocks from "../index";

class PmSensorDevice extends NobleBase.Base {
	public readonly pthService: Smartblocks.PTHService = new Smartblocks.PTHService(this);
	public readonly pmSensorService: Smartblocks.PmSensorService = new Smartblocks.PmSensorService(this);

	protected async onConnectAndSetupDone() {
		try {
			await this.pthService.subscribeAll();
			await this.pmSensorService.subscribeAll();

		} catch (error) {
			console.log(error);
		}
	}
	is(peripheral: Noble.Peripheral): boolean {
		return (peripheral.advertisement.manufacturerData[0] == 0xAC &&
			peripheral.advertisement.manufacturerData[1] == 0x03 &&
			peripheral.advertisement.manufacturerData[2] == 0xD9);
	}
}

class Application {
	public static main() {
		const scanHelper = new NobleBase.ScanHelper<PmSensorDevice>(PmSensorDevice, async (device) => {

			console.log("Discovered device: "+device.getDeviceId());

			device.pthService.on("temperature", (data) => {
				console.log(device.getDeviceId() + " temperature: " + data.toString() + " Centigrade");
			});

			device.pthService.on("humidity", (data) => {
				console.log(device.getDeviceId() + " humidity: " + data.toString() + "% Rh");
			});

			device.pthService.on("pressure", (data) => {
				console.log(device.getDeviceId() + " pressure: " + data.toString() + " Pa");
			});

			device.pmSensorService.on("pm25", (data)=>{
				console.log(device.getDeviceId() + " pm25: " + data.toString() + " ppm");
			});

			device.pmSensorService.on("pm10", (data)=>{
				console.log(device.getDeviceId() + " pm10: " + data.toString() + " ppm");
			});

			let temperature=await device.pthService.readTemperature();
			let pressure=await device.pthService.readPressure();
			let humidity=await device.pthService.readHumidity();

			console.log(device.getDeviceId()+" initial values: T: "+temperature+"C P: "+pressure+" Pa H: "+humidity+"%Rh");

			let pm25=await device.pmSensorService.readPm25();
			let pm10=await device.pmSensorService.readPm10();

			console.log(device.getDeviceId()+" initial values: PM2.5: "+pm25+" ppm PM10: "+pm10+" ppm");
		});
		scanHelper.discoverAll();
	}
}

Application.main();
