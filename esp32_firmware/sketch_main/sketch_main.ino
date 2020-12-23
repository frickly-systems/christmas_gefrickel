
// BLE API implemented according to esp32 arduino docu of:
//https://github.com/nkolban/esp32-snippets/blob/master/Documentation/BLE%20C%2B%2B%20Guide.pdf
// https://github.com/nkolban/esp32-snippets (Apache 2.0)
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

const int OUTPUT_PIN = 12;


class LedCallback: public BLECharacteristicCallbacks{
  void onWrite(BLECharacteristic *pCharacteristic) {
      std::string value = pCharacteristic->getValue();

      if(value == "ON"){
        digitalWrite(OUTPUT_PIN, HIGH);
      }else{
        digitalWrite(OUTPUT_PIN, LOW);
      }  
    }
};


void setup() {
  pinMode(OUTPUT_PIN, OUTPUT);
  Serial.begin(9600);

  BLEDevice::init("Christmas tree");
  
  BLEServer *pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService("19e5c6fe-3d2f-11eb-adc1-0242ac120002");
  BLECharacteristic *pCharacteristic = pService->createCharacteristic(
      "38342c36-3d2f-11eb-adc1-0242ac120002",
      BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE
    );

  pCharacteristic->setValue("OFF");
  pCharacteristic->setCallbacks(new LedCallback());

  pService->start();
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID("19e5c6fe-3d2f-11eb-adc1-0242ac120002");
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();
}

void loop() {  
}
