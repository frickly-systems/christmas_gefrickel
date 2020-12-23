import * as Bluetooth from "react-bluetooth";

// Implemented along documentation for:
//https://www.npmjs.com/package/react-bluetooth (MIT)

export default class BLECom {
  constructor() {
    this.device = null;
  }

  async sendLEDState(enable) {
    await this.getChristmasTreeConnection();

    let enc = new TextEncoder();

    if (enable) {
      this.characteristic.writeValue(enc.encode("ON"));
    } else {
      this.characteristic.writeValue(enc.encode("OFF"));
    }
  }

  isConnected() {
    return this.characteristic !== undefined && this.characteristic !== null;
  }

  async getChristmasTreeConnection() {
    if (this.device !== null) {
      return;
    }

    const isAvailable = await Bluetooth.getAvailabilityAsync();
    if (!isAvailable) {
      return;
    }
    try {
      const options = {
        filters: [{ services: ["19e5c6fe-3d2f-11eb-adc1-0242ac120002"] }],
      };

      const result = await Bluetooth.requestDeviceAsync(options);
      if (result.type === "cancel") {
        console.log("User canceled request");
        return;
      }
      this.device = result.device;
      console.log("Success: Got any device: ", this.device);

      this.server = await this.device.gatt.connect();

      this.service = await this.server.getPrimaryService(
        "19e5c6fe-3d2f-11eb-adc1-0242ac120002"
      );
      this.characteristic = await this.service.getCharacteristic(
        "38342c36-3d2f-11eb-adc1-0242ac120002"
      );
      console.log("Bluetooth: found characteristic:", this.characteristic);
      console.log("Bluetooth init done");
    } catch (error) {
      console.log(`Error: Couldn't get any device`, error);
      console.error(`Error: Couldn't get any device`, error);
      throw error;
    }
  }
}
