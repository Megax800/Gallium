#include <Wire.h>
#include <EEPROM.h>
#include "ui.h"
#include "network.h"

//Flash Definitions
#define MAX_STRING_LENGTH 20
struct network{ 
    char mySSID[MAX_STRING_LENGTH] = "";
    char myPW[MAX_STRING_LENGTH] = "";
  };
struct{
  uint8_t deviceId = 0;
  network known_APs[10];
}settings;

const char *menu[] = {"Enviar Mensaje", "Obtener Mensajes", "Ajustes WiFi"};

void setup() {
  Wire.begin(0, 2);
  init_display();
  keyPad.begin();
  WiFi.mode(WIFI_STA);
  delay(2000);
}

void loop() 
{
  uint8_t current_op = 0;
  lock_screen();
  do{
  draw_title("Menu");
  current_op = option_select(menu, 3);
  switch(current_op)
  {
    case 1:
      draw_title("Escriba Mensaje");
      MQTT_post(text_input().c_str());
      info_message("MQTT", "Comando Exitoso");
      delay(3000);
    break;
    case 2:
      draw_title("Mensajes Recibidos");
      display.setCursor(0, 32);
      display.println(MQTT_get());
      display.display();
      delay(3000);
    break;
    case 3:
      net_scan();
    break;
  }
  }while(current_op != 0);
  
  delay(1000);

}