

#include <ESP32Servo.h>
#include <WiFi.h>
#include<HTTPClient.h>
#include <Base64.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Fonts/FreeSans9pt7b.h>
#include <Fonts/FreeSans12pt7b.h>

#include <Arduino_JSON.h>
//Standard input/output Pins
#define green 27
#define red 12
#define yellow 14
#define button 26
#define buzzer 13      // Changed from 21
#define servo 17

// OLED pins for built-in display
#define OLED_SDA   21  // Changed from 4
#define OLED_SCL   22  // Changed from 15
#define OLED_RST   16
#define SCREEN_WIDTH  128
#define SCREEN_HEIGHT 64

//Servo Variables
Servo myServo;
volatile unsigned char interruptFlag = false;
volatile unsigned char rotated = false;

//WIFI Variables
const char* ssid = "AmbroseIphone16";
const char* password = "amberose";

//Network & Cloud Variables
String esp32camURL = "";
String apiURL = "https://facial-recogniton-camera-production.up.railway.app";
String LocalURL = "http://localhost:3000";

//TTGO Display
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RST);
void setupDisplay();


void onButtonPress();

/**
 * Configures all GPIO pins as inputs or outputs and initializes the servo motor.
 * Sets up LEDs (green, red, yellow), buzzer, button input with pullup, and attaches servo.
 */
void setUpPins(){
  pinMode(green,OUTPUT);
  pinMode(red,OUTPUT);
  pinMode(yellow,OUTPUT);
  pinMode(buzzer,OUTPUT);
  pinMode(button,INPUT_PULLUP);
  myServo.attach(servo);  
}

/**
 * Establishes WiFi connection using configured credentials.
 * Blocks until connection is successful and prints the assigned local IP address to Serial.
 */
void setupWiFi(){
  WiFi.begin(ssid,password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED){
     display.clearDisplay();
     display.setTextColor(SSD1306_WHITE);
     display.setFont(&FreeSans9pt7b);
     display.setCursor(0, 20);
     display.print("WiFi \nConnecting.");
     display.display();
    digitalWrite(yellow,HIGH);
    delay(250);
    Serial.print(".");
    display.print(".");
    display.display();
    delay(250);
    digitalWrite(yellow,LOW);
  }
  Serial.println("");
  Serial.print("WiFi Connected at: ");
  Serial.println(WiFi.localIP());
  display.println("\nConnected!");
  display.display();
  display.clearDisplay();
}

/**
 * Initialize the TTGO OLED Display for live user logs.
 * 
 * 
 */
void setupDisplay(){
   // Reset OLED via software
  pinMode(OLED_RST, OUTPUT);
  digitalWrite(OLED_RST, LOW);
  delay(20);
  digitalWrite(OLED_RST, HIGH);

  // Init I2C on the OLED pins
  Wire.begin(OLED_SDA, OLED_SCL);

  // Initialize the SSD1306 at I2C addr 0x3C
   // Try 0x3C first, if that fails try 0x3D
   if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C, false, false)) {
     Serial.println(F("SSD1306 at 0x3C failed, trying 0x3D"));
     if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3D, false, false)) {
       Serial.println(F("SSD1306 allocation failed"));
       return;
     }
   }

}

/**
 * Activates the buzzer at a specified frequency for audio feedback.
 * @param frequency The tone frequency in Hz (e.g., 500, 800, 1200)
 */
void buzz(unsigned short frequency){
  tone(buzzer,frequency);
}

/**
 * Deactivates the buzzer, stopping all audio output.
 */
void stopBuzz(){
  noTone(buzzer);
}

/**
 * Toggles the servo motor position to lock or unlock the door mechanism.
 * Alternates between 0° and 180° positions based on the current rotated state.
 */
void unLock(){
  myServo.write(rotated ? 180 : 0);
  rotated = !rotated;
}

/**
 * Turns on the ESP32-CAM's LED flash to maximum brightness (255).
 * Sends an HTTP GET request to the camera's control endpoint.
 */
void setFlashOn(){
  if(WiFi.status() == WL_CONNECTED){
    HTTPClient http;
    String serverPath =  "http://" +esp32camURL + "/control?var=led_intensity&val=255";

    http.begin(serverPath.c_str());
    int httpResponseCode = http.GET();

    http.end();
  }
}

/**
 * Captures a JPEG image from the ESP32-CAM via HTTP stream.
 * Reads the binary image data, encodes it to base64, and formats as a data URL.
 * @return String containing the base64-encoded image with MIME type prefix
 */
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

/**
 * Captures a photo by enabling the camera flash and retrieving the image.
 * @return String containing the base64-encoded image data URL
 */
String takePicture(){
  setFlashOn();
  String imgB64 = getImageCapture();
  Serial.println(imgB64);
  return imgB64;
}

/**
 * Sends the captured image to the backend API for facial recognition via AWS Rekognition.
 * Posts the base64 image to the /faceid/identify endpoint and checks the response.
 * @param imgB64 Base64-encoded image string with data URL prefix
 * @return true if face recognition succeeded (HTTP 200), false otherwise
 */
bool identifyPerson(String imgB64){
  while(WiFi.status() == WL_CONNECTED){

     display.clearDisplay();
     display.setTextColor(SSD1306_WHITE);
     display.setFont(&FreeSans9pt7b);
     display.setCursor(0, 20);
     display.print("Verifying \nIdentity...");
     display.display();

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



/**
 * Processes button press events for facial recognition access control.
 * Captures photo, identifies person via API, and provides feedback through LEDs/buzzer.
 * Success: Yellow->Red->Green sequence with ascending tones, then unlocks door.
 * Failure: Yellow->Red sequence with lower tone, door remains locked.
 */
void handleButtonPress(){
  String imgB64 = takePicture();
  bool result = identifyPerson(imgB64);
  if(result){
     display.clearDisplay();
     display.setTextColor(SSD1306_WHITE);
     display.setFont(&FreeSans9pt7b);
     display.setCursor(0, 20);
     display.print("Access \nGranted!");
     display.display();
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
    delay(1000);
  }
  else{
    display.clearDisplay();
     display.setTextColor(SSD1306_WHITE);
     display.setFont(&FreeSans9pt7b);
     display.setCursor(0, 20);
     display.print("DENIED!");
     display.display();
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
    delay(1000);
  }
  
  interruptFlag = false;
}

/**
 * Interrupt Service Routine for button press detection.
 * Sets the interruptFlag when button transitions from HIGH to LOW (FALLING edge).
 */
void ISR(){
  if(!interruptFlag){
    interruptFlag = true;
  }
}


/**
 * Retrieves the ESP32-CAM's IP address from the backend server.
 * Polls the /faceId/getCameraIP endpoint until successful, parsing the JSON response.
 * Provides visual feedback with yellow LED blinking (waiting) and green LED (success).
 * @param esp32camURL Reference to string variable that will store the camera's IP address
 */
void getCameraIP(String &esp32camURL){
  int status =-1;
  String res ="";
   display.clearDisplay();
   display.setTextColor(SSD1306_WHITE);
   display.setFont(&FreeSans9pt7b);   
   display.setCursor(0, 20);
   display.println("Finding Camera.");
   display.display();
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
    display.print(".");
    display.display();
    digitalWrite(yellow,LOW);
    delay(250);
  }
  JSONVar myObject = JSON.parse(res);
  esp32camURL = (const char*)myObject["cameraIP"];
  Serial.println(esp32camURL);
  digitalWrite(green,HIGH);

  display.println("\n Camera Found");
  display.display();
  delay(500);
  digitalWrite(green,LOW);



}

/**
 * Arduino setup function - runs once at startup.
 * Initializes serial communication, configures pins, connects to WiFi,
 * attaches button interrupt handler, and retrieves the camera IP address.
 */
void setup() {
  Serial.begin(115200);
  setupDisplay();
  setUpPins();
  setupWiFi();
  attachInterrupt(digitalPinToInterrupt(button),ISR,FALLING);
  getCameraIP(esp32camURL);
 
  
  // put your setup code here, to run once:

}

/**
 * Arduino main loop - runs continuously after setup.
 * Monitors the interrupt flag and calls handleButtonPress() when button is pressed.
 */
void loop() {
  
     display.clearDisplay();
     display.setTextColor(SSD1306_WHITE);
     display.setFont(&FreeSans9pt7b);
     display.setCursor(0, 20);
     display.print("Ready \nto Authenticate");
     display.display();
  if(interruptFlag){
    handleButtonPress();
  }
  

}
