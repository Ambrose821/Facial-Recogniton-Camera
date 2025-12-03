

#include <ESP32Servo.h>
#include <WiFi.h>
#include<HTTPClient.h>
#include <Base64.h>
#include <Arduino_JSON.h>

#define green 27
#define red 12
#define yellow 14
#define button 26
#define buzzer 21
#define servo 17

Servo myServo;
volatile unsigned char interruptFlag = false;
volatile unsigned char rotated = false;

//WIFI
const char* ssid = "AmbroseIphone16";
const char* password = "amberose";

String esp32camURL = "";
String apiURL = "https://facial-recogniton-camera-production.up.railway.app";
String LocalURL = "http://localhost:3000";




void onButtonPress();

void setUpPins(){
  pinMode(green,OUTPUT);
  pinMode(red,OUTPUT);
  pinMode(yellow,OUTPUT);
  pinMode(buzzer,OUTPUT);
  pinMode(button,INPUT_PULLUP);
  myServo.attach(servo);  
}

void setupWiFi(){
  WiFi.begin(ssid,password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("WiFi Connected at: ");
  Serial.println(WiFi.localIP());
}

void buzz(unsigned short frequency){
  tone(buzzer,frequency);
}
void stopBuzz(){
  noTone(buzzer);
}

void unLock(){
  myServo.write(rotated ? 180 : 0);
  rotated = !rotated;
}

void setFlashOn(){
  if(WiFi.status() == WL_CONNECTED){
    HTTPClient http;
    String serverPath =  "http://" +esp32camURL + "/control?var=led_intensity&val=255";

    http.begin(serverPath.c_str());
    int httpResponseCode = http.GET();

    http.end();
  }
}
String getImageCapture(){
  if(WiFi.status() == WL_CONNECTED){
    HTTPClient http;
    String serverPath = "http://" + esp32camURL + "/capture";
    Serial.println(serverPath);
    http.begin(serverPath.c_str());

    int httpResponseCode = http.GET();

    int len = http.getSize();

    WiFiClient *stream = http.getStreamPtr();

    uint8_t *buffer = (uint8_t*)malloc(len);
    int offset =0;
    while(http.connected() && offset < len){
      size_t available = stream->available();
      if(available){
        int read = stream->readBytes(buffer+offset,available);
        offset += read;

      
      }
        delay(1);
    }
    http.end();

    //Convert to Base64;
    String base64img = base64::encode(buffer,len);
    free(buffer);
    
    String fullDataURL = "data:image/jpeg;base64," + base64img;
    return(fullDataURL);
  }
}

String takePicture(){
  setFlashOn();
  String imgB64 = getImageCapture();
  Serial.println(imgB64);
  return imgB64;
}

bool identifyPerson(String imgB64){
  while(WiFi.status() == WL_CONNECTED){
    HTTPClient http;
    String serverpath = apiURL +"/faceid/identify";


    http.begin(serverpath.c_str());
    http.addHeader("Content-Type", "application/json");
    String reqBody = "{\"img\": \""+imgB64+"\"}";
    int responseCode = http.POST(reqBody);
    Serial.print(responseCode);
    String payload = http.getString();
    Serial.print(payload);
    http.end();
    return (responseCode == 200 ? true : false);

  }
  
}

void handleButtonPress(){
  String imgB64 = takePicture();
  bool result = identifyPerson(imgB64);
  if(result){
    buzz(500);
    digitalWrite(yellow,HIGH);
    delay(500);
    stopBuzz();
    digitalWrite(yellow,LOW);
    buzz(800);
    digitalWrite(red,HIGH);
    delay(500);
    stopBuzz();
    digitalWrite(red,LOW);
    buzz(1200);
    digitalWrite(green,HIGH);
    delay(500);
    digitalWrite(green,LOW);
    stopBuzz();
    unLock();
  }
  else{
    buzz(500);
    digitalWrite(yellow,HIGH);
    delay(500);
    stopBuzz();
    digitalWrite(yellow,LOW);
    buzz(300);
    digitalWrite(red,HIGH);
    delay(500);
    stopBuzz();
    digitalWrite(red,LOW);
  }
  
  interruptFlag = false;
}
void ISR(){
  if(!interruptFlag){
    interruptFlag = true;
  }
}


void getCameraIP(String &esp32camURL){
  int status =-1;
  String res ="";
  while(status != 200){
    digitalWrite(yellow,HIGH);
    HTTPClient http;
    String serverpath = apiURL + "/faceId/getCameraIP";
    http.begin(serverpath.c_str());
    status = http.GET();
    res = http.getString();
    Serial.println(res);
    Serial.print(status);
    delay(250);
    digitalWrite(yellow,LOW);
    delay(250);
  }
  JSONVar myObject = JSON.parse(res);
  esp32camURL = (const char*)myObject["cameraIP"];
  Serial.println(esp32camURL);
  digitalWrite(green,HIGH);
  delay(250);
  digitalWrite(green,LOW);


}

void setup() {
  Serial.begin(115200);
  setUpPins();
  setupWiFi();
  attachInterrupt(digitalPinToInterrupt(button),ISR,FALLING);
  getCameraIP(esp32camURL);
  
  // put your setup code here, to run once:

}

void loop() {
  // put your main code here, to run repeatedly:
  //  testLights();
  if(interruptFlag){
    handleButtonPress();
  }
  // myServo.write(0);
  // delay(1000);
  // myServo.write(180);

}
