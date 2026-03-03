#include "network.h"

WiFiClient client;

Adafruit_MQTT_Client mqtt(&client, "192.168.1.105", 1883);
Adafruit_MQTT_Subscribe messages(&mqtt, "carlitos/messages");
Adafruit_MQTT_Publish output(&mqtt, "carlitos/output");


bool MQTT_connect()
{
  int8_t ret;

  // Stop if already connected.
  if (mqtt.connected()) {return true;}

  uint8_t retries = 3;
  while ((ret = mqtt.connect()) != 0 && retries != 0) { // connect will return 0 for connected
       mqtt.disconnect();
       delay(5000);  // wait 5 seconds
       retries--;
  }

  if(retries == 0){return false;}else{return true;}
}

const char *MQTT_get()
{
  const char *buffer = "No hay mensajes nuevos";
  if(MQTT_connect())
  {
    Adafruit_MQTT_Subscribe *subscription;
    while ((subscription = mqtt.readSubscription(5000))) {
      if (subscription == &messages) {
        buffer = (char *)messages.lastread;
      }
    }
    return buffer;
  }else{
    return "Error de conexion al servidor";
  }
}

void MQTT_post(const char *buffer)
{
  if(MQTT_connect())
  {
    output.publish(buffer, true);
  }
}