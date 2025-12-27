#ifndef UI_H
#define UI_H
#include <I2CKeyPad.h>
#include <Arduino.h>
#include <ESP8266WiFiMulti.h>
#include "display.h"
extern const uint8_t KEYPAD_ADDRESS;
extern I2CKeyPad keyPad;

void lock_screen();
void net_scan();
uint8_t option_select(const char *op[], uint8_t length);
String text_input();

#endif