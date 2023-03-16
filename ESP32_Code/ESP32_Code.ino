#include <HTTPClient.h>
#include <Wire.h>
#include "Adafruit_MCP9808.h"
#include <WiFi.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>


// Oled Configuration 
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);// Declaration for an SSD1306 display connected to I2C (SDA, SCL pins)

// Mobile App Configuration 
const String endpoint = "http://api.notifymydevice.com/push?"; // call notify my device
const String key = "8W2NTAKP960W48FW9UJH5UG8C";// call notify my device

// WIFI Configuration
const char* ssid     = "HUAWEI Y5 2019";//configuration wifi nom et mot de passe
const char* password = "wassim00000";

// Create the MCP9808 temperature sensor object
Adafruit_MCP9808 tempsensor = Adafruit_MCP9808();
Adafruit_MCP9808 tempsensor2 = Adafruit_MCP9808();
Adafruit_MCP9808 tempsensor3 = Adafruit_MCP9808();

// Buzzer GPIO 
int Buzzer = 5;

void setup() {
  // put your setup code here, to run once:
  
  Serial.begin(115200);
  
  // Connection TO WIFI
  pinMode(LED_BUILTIN, OUTPUT);
  WiFi.begin(ssid, password);
  while(WiFi.status() != WL_CONNECTED){
    digitalWrite(LED_BUILTIN, HIGH);
    delay(250);
    digitalWrite(LED_BUILTIN, LOW);
    delay(250);
  }

  // Define Addresses of sensors 
  tempsensor.begin(0x19);
  tempsensor2.begin(0x18);
  tempsensor3.begin(0x1A);
  
  // Define Buzzer as Output
  pinMode (Buzzer, OUTPUT);
  
  //Oled Configurations
   if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { // Address 0x3D for 128x64
    Serial.println(F("SSD1306 allocation failed"));
    for(;;);
  }
  delay(2000);
  display.clearDisplay();
  display.setTextColor(WHITE);tempsensor3.begin(0x1A);

}

void loop() {
  // put your main code here, to run repeatedly:

  // Connecting to WIFI 
  if ((WiFi.status() == WL_CONNECTED)){
    digitalWrite(LED_BUILTIN, HIGH);
  }else {
    digitalWrite(LED_BUILTIN, LOW);
  }
  
   { 

  // Affecting to T1 T2 T3 temperatures from get_data functions
  float T1 = get_data_1();
  float T2 = get_data_2();
  float T3 = get_data_3();

  // T_M is the moyen of T1 T2 and T3
  float T_M = (T1+T2+T3)/3;

  // Send the 4 temperature with send_sensor_value function    
  send_sensor_value(T1,T2,T3,T_M);
      
  
  //Display the T_M on the OLED
  display.setTextSize(2);
  display.setCursor(0,0);
  display.print( "moy");
  display.setTextSize(2);
  display.setCursor(50, 0);
  display.print(T_M);
  display.setTextSize(2);
  display.print( "C");
  display.display();


   }
  //  Repeat every 5 seconds 
    delay(5000);  

}




float get_data_1(){
  // Read the temperature from the first sensor
  float c = tempsensor.readTempC();
  Serial.print("Temp C1: ");
  Serial.print(c);
  return (c);
  tempsensor.shutdown_wake(1);
}

float get_data_2(){
  // Read the temperature from the second sensor
  float sensor_value2 = tempsensor2.readTempC();
  Serial.print("Temp C2: ");
  Serial.print(sensor_value2);
  return (sensor_value2);
 tempsensor2.shutdown_wake(1);
}

  float get_data_3(){
  // Read the temperature from the third sensor
  float sensor_value3 = tempsensor3.readTempC();
  Serial.print("Temp C: ");
  Serial.print(sensor_value3);
  return (sensor_value3);
  tempsensor3.shutdown_wake(1);
  }



void send_sensor_value(float sensor_data_1, float sensor_data_2, float sensor_data_3, float tempmoy){
  // Configuration of http client 
  HTTPClient http;
  // IP address of the server with the url  
  http.begin("http://192.168.43.52:3000/fridge_1");
  // Define json type 
  http.addHeader("Content-Type", "application/json");

  // Data that we want to send 
  String request = "{\"sensor_value1_1\":" +(String)(sensor_data_1)+ ", \"sensor_value1_2\":"+(String)(sensor_data_2)+", \"sensor_value1_3\":"+(String)(sensor_data_3)+", \"temperature_moyen1\":"+(String)(tempmoy)+", \"carte\":"+"true"+ "}";
  
  //read the respond from the server
  int http_response_code = http.POST(request);
  if (http_response_code < 0){
    Serial.println("Error in sending sensor value");
  }
  else{
    
  // read the limit from the database
    String response = http.getString();
    Serial.print("the limit is : ");
    Serial.println(response);
    
    // convert the limit (string to float) 
    int i;
    float seuil = 4.0;
    char str [5];
    for (i=0; i<response.length() ; i++){
      str [i] = response[i];
    }
    float a = atof (str);
    seuil = a;
      
    // check if the temperature is > than the limit
    if ( tempmoy < seuil){
      Serial.print("it's safe");
      digitalWrite (Buzzer, LOW);
      }else
      {
        Serial.print("it's risky");
        alerte();
        buzzer();
        
        }
  }
  http.end();
}

void buzzer(){
  HTTPClient http;
      http.begin("http://192.168.43.52:3000/buzz_esp1");
    String request = "yufyu";
   int http_response_code = http.POST(request);
   http.end();
  }

void etat_buzz (){
  
  HTTPClient http;
      http.begin("http://192.168.43.52:3000/buzz1");
    String request = "55";
   int http_response_code = http.POST(request);
   
  if (http_response_code > 0){
          String ccc = http.getString() ;
          Serial.print("    etat du buzzer est    ");
          Serial.print(ccc);
          if (ccc == "stop") {
            digitalWrite (Buzzer, LOW); 
            }
        }
        http.end();
  }



void alerte(){
 

    HTTPClient http;
  http.begin(endpoint + key);
http.addHeader("Content-Type", "application/x-www-form-urlencoded");
String httpRequestData = "ApiKey=8W2NTAKP960W48FW9UJH5UG8C&PushTitle=alerte&PushText=depassement_temperature_seuil";
int httpResponseCode = http.POST(httpRequestData);

 
 
  http.end();
  digitalWrite (Buzzer, HIGH);
}
