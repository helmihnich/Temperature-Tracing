#include <HTTPClient.h>
#include <Wire.h>
#include "Adafruit_MCP9808.h"
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <WiFi.h>
#include <WiFiMulti.h>
#include <ESPmDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>
#include <TelnetStream.h>

//loop delay configuration
const long interval = 5000; // interval at which to send sensor data and process the alarm
unsigned long previousMillis = 0; // will store last time processing loop was updated

// Oled Configuration 
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);// Declaration for an SSD1306 display connected to I2C (SDA, SCL pins)

// Mobile App Configuration 
const String endpoint = "http://api.notifymydevice.com/push?"; // call notify my device
const String key = "8W2NTAKP960W48FW9UJH5UG8C";// call notify my device

//Server IP address 
const String serverip = "http://192.168.43.52:3000/";

// WIFI Configuration
#define ssid_nb 3
const char* hostname = "INPE_node1";
const char* hostpwd = "admin";
const char* ssid[ssid_nb]     = {"Infinix","Redmi", "Cercina"};
const char* password[ssid_nb] = {"1234567890","0123456789", "elmarsa20"};

WiFiMulti wifiMulti;

// Create the MCP9808 temperature sensor object
Adafruit_MCP9808 tempsensor1 = Adafruit_MCP9808();
Adafruit_MCP9808 tempsensor2 = Adafruit_MCP9808();
Adafruit_MCP9808 tempsensor3 = Adafruit_MCP9808();

// Buzzer GPIO 
//#define Active_Buzzer   //uncomment to active the buzzer alert
int Buzzer = 5;

void setup() {
  // put your setup code here, to run once:
  
  Serial.begin(115200);

  // Define Addresses of sensors 
  tempsensor1.begin(0x19);
  tempsensor2.begin(0x18);
  tempsensor3.begin(0x1A);
    
  // Define Buzzer as Output
  pinMode (Buzzer, OUTPUT);
  digitalWrite(Buzzer, LOW);
  
  // Connection TO WIFI
  for (int i=0; i<ssid_nb ; i++)
  {
    wifiMulti.addAP(ssid[i], password[i]);
  }
   
  Serial.println("Connecting Wifi...");
   while (wifiMulti.run() != WL_CONNECTED) {  //Wait for connection
    delay(500);
    Serial.println("Waiting to connect...");
  }
  Serial.println("Connected to"+WiFi.SSID());
  // Hostname defaults to esp3232-[MAC]
  ArduinoOTA.setHostname(hostname);
  // No authentication by default
  ArduinoOTA.setPassword(hostpwd);
  
  ArduinoOTA
    .onStart([]() {
      String type;
      if (ArduinoOTA.getCommand() == U_FLASH)
        type = "sketch";
      else // U_SPIFFS
        type = "filesystem";

      // NOTE: if updating SPIFFS this would be the place to unmount SPIFFS using SPIFFS.end()
      Serial.println("Start updating " + type);
    })
    .onEnd([]() {
      Serial.println("\nEnd");
    })
    .onProgress([](unsigned int progress, unsigned int total) {
      Serial.printf("Progress: %u%%\r", (progress / (total / 100)));
    })
    .onError([](ota_error_t error) {
      Serial.printf("Error[%u]: ", error);
      if (error == OTA_AUTH_ERROR) Serial.println("Auth Failed");
      else if (error == OTA_BEGIN_ERROR) Serial.println("Begin Failed");
      else if (error == OTA_CONNECT_ERROR) Serial.println("Connect Failed");
      else if (error == OTA_RECEIVE_ERROR) Serial.println("Receive Failed");
      else if (error == OTA_END_ERROR) Serial.println("End Failed");
    });

  ArduinoOTA.begin();
  TelnetStream.begin();
  
  //Oled Configurations
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) 
  { // Address 0x3D for 128x64
    TelnetStream.println(F("SSD1306 allocation failed"));
    for(;;);
  }
  delay(1000);
  display.clearDisplay();
  display.setTextColor(WHITE);
}

void loop() {
  ArduinoOTA.handle();
  TelnetStream.println(WiFi.SSID());
  
  //Verify wifi connection
  if(wifiMulti.run() != WL_CONNECTED) {
        Serial.println("WiFi not connected!");
        delay(1000);
  }
  
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {

  // save the last time you blinked the LED

  previousMillis = currentMillis;
    // Affecting to T1 T2 T3 temperatures from get_data functions
    float T1 = get_data(tempsensor1);
    float T2 = get_data(tempsensor2);
    float T3 = get_data(tempsensor3);

    // T_M is the average of T1 T2 and T3
    float T_M = (T1+T2+T3)/3;

    // Send the 4 temperature with send_sensor_value function    
    send_sensor_value(T1,T2,T3,T_M);
        
    //Display the T_M on the OLED
    display.clearDisplay();
    display.setTextSize(3);
    display.setCursor(20, 20);
    display.print(T_M);
    display.setTextSize(2);
    display.print( " C ");
    display.display();
  }  
}

float get_data(Adafruit_MCP9808 tempsensor)
{
  // Read the temperature from the temp sensor
  float c = tempsensor.readTempC();
  TelnetStream.print("Temp C1: ");
  TelnetStream.print(c);
  return (c);
  tempsensor.shutdown_wake(1);
}

void send_sensor_value(float sensor_data_1, float sensor_data_2, float sensor_data_3, float tempmoy){
  ArduinoOTA.handle();
  // Configuration of http client 
  HTTPClient http;
  // IP address of the server with the url  
  http.begin(serverip+"fridge_1");
  // Define json type 
  http.addHeader("Content-Type", "application/json");

  // Data that we want to send 
  String request = "{\"sensor_value1_1\":" +(String)(sensor_data_1)+ ", \"sensor_value1_2\":"+(String)(sensor_data_2)+", \"sensor_value1_3\":"+(String)(sensor_data_3)+", \"temperature_moyen1\":"+(String)(tempmoy)+", \"carte\":"+"true"+ "}";
  
  // Read the respond from the server
  int http_response_code = http.POST(request);
  if (http_response_code < 0){
    TelnetStream.println("Error in sending sensor value");
  }
  else {
  // read the limit from the database
    String response = http.getString();
    TelnetStream.print("the limit is : ");
    TelnetStream.println(response);
    
    // convert the limit (string to float) 
    float seuil = response.toFloat();
    TelnetStream.println(seuil);

    // check if the temperature is > than the limit
    if ( tempmoy < seuil) {
      TelnetStream.print("it's safe");
      digitalWrite (Buzzer, LOW);
      }
      else {
        TelnetStream.print("it's risky");
        alerte();
        buzzer();
      }
  }
  http.end();
}

void buzzer() {
  HTTPClient http;
  http.begin(serverip+"buzz_esp1");
  String request = "yufyu";
  int http_response_code = http.POST(request);
  http.end();
}

void etat_buzz () {
  ArduinoOTA.handle();
  HTTPClient http;
  http.begin(serverip+"buzz1");
  String request = "55";
  int http_response_code = http.POST(request);
  if (http_response_code > 0) {
    String ccc = http.getString() ;
    TelnetStream.print("    etat du buzzer est    ");
    TelnetStream.print(ccc);
    if (ccc == "stop") {
      digitalWrite (Buzzer, LOW); 
    }
  }
  http.end();
}

void alerte() {
  ArduinoOTA.handle();
  HTTPClient http;
  http.begin(endpoint + key);
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");
  String httpRequestData = "ApiKey=8W2NTAKP960W48FW9UJH5UG8C&PushTitle=alerte&PushText=depassement_temperature_seuil";
  int httpResponseCode = http.POST(httpRequestData);
  http.end();
  #ifdef Active_Buzzer
    digitalWrite (Buzzer, HIGH);
  #endif
}
