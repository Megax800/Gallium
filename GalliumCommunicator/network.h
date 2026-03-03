#ifndef NETWORK_H
#define NETWORK_H
#include <ESP8266WiFi.h>
#include "Adafruit_MQTT.h"
#include "Adafruit_MQTT_Client.h"
extern WiFiClient client;
extern Adafruit_MQTT_Client mqtt;
extern Adafruit_MQTT_Subscribe messages;
extern Adafruit_MQTT_Publish output;

bool MQTT_connect();
const char *MQTT_get();
void MQTT_post(const char *buffer);

#endif