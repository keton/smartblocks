import * as Noble from "noble";
import * as NobleBase from "noble_base";

export class GenericDevice extends NobleBase.Base {
    protected onConnectAndSetupDone(): void {
        throw new Error("Method not implemented.");
    }
    is(peripheral: Noble.Peripheral): boolean {
        throw new Error("Method not implemented.");
    }

}