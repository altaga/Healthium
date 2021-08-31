#include <M5Core2.h>
#include <Adafruit_NeoPixel.h>
#include <Wire.h>
#include <Adafruit_MLX90614.h>
#include "MQ135.h"

#define PIN       25 // M5Stack NeoPixel Pin
#define NUMPIXELS 10 // M5 Neopixel Number
#define RXD2 13
#define TXD2 14
#define RZERO 76.63

Adafruit_NeoPixel M5pixels(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);
Adafruit_MLX90614 mlx = Adafruit_MLX90614();
MQ135 gasSensor = MQ135(36);

unsigned long inter1;
unsigned long inter2;
unsigned long trig;
bool flag = false;
bool reading = false;
float batVoltage;
int batPercentage;
int gSensor = 1;
int tempSensor;

void setup() {
  M5.begin();
  SD.begin();
  M5pixels.begin();
  setNeoPixel(0, 0, 0);
  Serial.begin(115200);
  M5.Lcd.fillScreen(WHITE);
  M5.Lcd.drawJpgFile(SD, "/cover.jpg", 0, 0);
  M5.Lcd.setTextColor(BLACK);
  M5.Lcd.setTextSize(2);
  M5.Lcd.setCursor(150, 12);
  M5.Lcd.println(" o");
  M5.Lcd.setTextSize(5);
  M5.Lcd.setCursor(83, 100);
  M5.Lcd.println(String(int(gasSensor.getPPM())) + " ppm");
  mlx.begin();
  inter1 = millis();
  inter2 = millis();
  trig = millis();
  Serial2.begin(115200, SERIAL_8N1, RXD2, TXD2);
}

void loop() {
  gSensor = gasSensor.getPPM();
  tempSensor = int(correlation(mlx.readAmbientTempC(), mlx.readObjectTempC()));
  dispNeoPixel(correlation(mlx.readAmbientTempC(), mlx.readObjectTempC()));
  batVoltage = M5.Axp.GetBatVoltage();
  batPercentage = int(( batVoltage < 3.2 ) ? 0 : ( batVoltage - 3.2 ) * 100);
  if (Serial2.available()) {
    String state = Serial2.readString();
    if (state == "ok") {
      M5.Lcd.setTextSize(4);
      M5.Lcd.setTextColor(WHITE);
      M5.Lcd.setCursor(83, 182);
      M5.Lcd.println(".....");
      M5.Lcd.setCursor(83, 182);
      M5.Lcd.println("Error");
      M5.Lcd.setTextColor(GREEN);
      M5.Lcd.setCursor(83, 182);
      M5.Lcd.println("Online");
      M5.Lcd.setTextColor(BLACK);
      M5.Lcd.setTextSize(5);
      flag = false;
    }
    if (state == "sending") {
      M5.Lcd.setTextSize(4);
      M5.Lcd.setTextColor(WHITE);
      M5.Lcd.setCursor(83, 182);
      M5.Lcd.println("Online");
      M5.Lcd.setCursor(83, 182);
      M5.Lcd.println("Error");
      M5.Lcd.setTextColor(BLACK);
      M5.Lcd.setCursor(83, 182);
      M5.Lcd.println(".....");
      M5.Lcd.setTextSize(5);
    }
  }
  if ((millis() - inter1) > 3000 && reading) {
    Serial2.println(String(gSensor) + "," + String(correlation(mlx.readAmbientTempC(), mlx.readObjectTempC())));
    flag = true;
    trig = millis();
    inter1 = millis();
  }
  if ((millis() - inter2) > 1000) {
    disp(gSensor, tempSensor, batPercentage);
    inter2 = millis();
  }
  if ((millis() - trig) > 10000 && flag) {
    M5.Lcd.setTextSize(4);
    M5.Lcd.setTextColor(WHITE);
    M5.Lcd.setCursor(83, 182);
    M5.Lcd.println(".....");
    M5.Lcd.setCursor(83, 182);
    M5.Lcd.println("Online");
    M5.Lcd.setTextColor(RED);
    M5.Lcd.setCursor(83, 182);
    M5.Lcd.println("Error");
    M5.Lcd.setTextColor(BLACK);
    M5.Lcd.setTextSize(5);
    flag = false;
  }
}

void dispNeoPixel(float temp) {
  if (temp > 38) {
    setNeoPixel(200, 0, 0);
    reading = true;
  }
  else if (temp <= 38 && temp > 37) {
    setNeoPixel(200, 180, 0);
    reading = true;
  }
  else if (temp <= 37 && temp > 36) {
    setNeoPixel(0, 200, 0);
    reading = true;
  }
  else if (temp <= 36 && temp > 35) {
    setNeoPixel(0, 200, 180);
    reading = true;
  }
  else if (temp <= 35 && temp > 34) {
    setNeoPixel(0, 0, 200);
    reading = true;
  }
  else {
    setNeoPixel(0, 0, 0);
    reading = false;
    inter1 = millis();
  }
}

void setNeoPixel(int R, int G, int B) {
  M5pixels.clear();
  for (int i = 0; i < NUMPIXELS; i++) {
    M5pixels.setPixelColor(i, M5pixels.Color(R, G, B));
  }
  M5pixels.show();
  delay(1);
}

void disp(int gas, int temp, int battery) {
  static int gasMem;
  static int tempMem;
  static int batMem;
  if (gasMem != gas) {
    M5.Lcd.setTextColor(WHITE);
    M5.Lcd.setCursor(83, 100);
    M5.Lcd.println(String(gasMem) + " ppm");
    M5.Lcd.setTextColor(BLACK);
    gasMem = gas;
    M5.Lcd.setCursor(83, 100);
    M5.Lcd.println(String(gas) + " ppm");
  }
  if (tempMem != temp) {
    M5.Lcd.setTextColor(WHITE);
    M5.Lcd.setCursor(83, 20);
    M5.Lcd.println(String(tempMem));
    M5.Lcd.setTextColor(BLACK);
    tempMem = temp;
    M5.Lcd.setCursor(83, 20);
    M5.Lcd.println(String(temp) + " C");
  }
  if (batMem != battery) {
    M5.Lcd.setTextSize(2);
    M5.Lcd.setTextColor(WHITE);
    M5.Lcd.setCursor(264, 4);
    M5.Lcd.println(String(batMem) + "%");
    M5.Lcd.setTextColor(BLACK);
    batMem = battery;
    M5.Lcd.setCursor(264, 4);
    M5.Lcd.println(String(battery) + "%");
    M5.Lcd.setTextSize(5);
  }
  delay(1000);
}

float correlation(float amb, float skin) {
  if (skin > 27 && skin < 36) {
    float realTemp = 0.71429 * skin - 0.35714 * amb + 23.14286;
    return realTemp;
  }
  return skin;
}
