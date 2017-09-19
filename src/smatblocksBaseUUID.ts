export class UUID {

    /** Generates service/characteristic UUID by expanding Smartblocks UUID base */
    public static generate(uniqUuidPart:string):string {
        const uuidPrefix="36ec";
        const uuidSuffix="830994be004af2cd44c98381";
        return uuidPrefix+uniqUuidPart+uuidSuffix;
    }
}