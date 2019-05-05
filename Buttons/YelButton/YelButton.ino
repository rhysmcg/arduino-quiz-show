#include <ESP8266WiFiMulti.h>
#include <SocketIoClient.h>

// Wifi & Socket Classes
ESP8266WiFiMulti WiFiMulti;
SocketIoClient webSocket;

// Wifi & Passwords
const char* ssid = "rs500m-193abd-1";
const char* password = "ae6b04490ba3c";

// Button Variables
int btnPin = 13; // Wemos D1 Mini D7 pin 
int btnState = 0;         // current state of the btn
int lastBtnState = 0;     // previous state of the btn

// Socket Event
void event(const char * payload, size_t length) {
  Serial.printf("got message: %s\n", payload);
}

// 
void setup() {  

    // Set up D7 pin to read the button press
    pinMode(btnPin, INPUT);

    // Boot up the Wifi 
    Serial.begin(115200);
    Serial.setDebugOutput(true);
    Serial.println();
    WiFiMulti.addAP(ssid, password);
    while(WiFiMulti.run() != WL_CONNECTED) {
        delay(100);
    }


    webSocket.on("event", event);

    // LOCAL HOST VERSION //
    webSocket.begin("192.168.1.8", 80, "/socket.io/?transport=websocket");

    // FINAL ONLINE HEROKU VERSION //
    //webSocket.begin("arduino-quiz-show.herokuapp.com", 80, "/socket.io/?transport=websocket");
}

void loop() {
    webSocket.loop();



    // Send a Message if the Button has been pressed
     btnState = digitalRead(btnPin);
    if (btnState != lastBtnState) {
      
      // BUTTON IS ON
      if (btnState == HIGH) {
        webSocket.emit("chat", "{\"message\":\"yes\",\"handle\":\"btnyel\"}");
      
      // BUTTON IS OFF
      } else {
      }
      // Delay a little bit to avoid bouncing
      delay(50);
    }
    // save the current state as the last state, for next time through the loop
    lastBtnState = btnState;

}
