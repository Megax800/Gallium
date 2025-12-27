#include <Wire.h>
#include <EEPROM.h>
#include "ui.h"

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

const char *menu[] = {"Limpiar APs", "Prueba Red", "Ajustes WiFi"};

void setup() {
  Wire.begin(0, 2);
  init_display();
  keyPad.begin();
  WiFi.mode(WIFI_STA);
  WiFi.persistent(false);
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
      wifiMulti.cleanAPlist();
      info_message("Limpiar APs", "Comando Exitoso");
    break;
    case 2:
      draw_title("Prueba de Red");
      display.fillRect(0, 13, 128, 50, SH110X_BLACK);
      display.setCursor(0, 32);
      display.println("Conectando");
      display.display();
      WiFi.begin("DPE", "herry1751");
      while(WiFi.status() != WL_CONNECTED)
      {
        display.print(".");
        display.display();
        delay(500);
      } 
    break;
    case 3:
      net_scan();
    break;
  }
  }while(current_op != 0);
  
  delay(1000);
}