#ifndef DISPLAY_H
#define DISPLAY_H
#include <Adafruit_GFX.h>
#include <Adafruit_SH110X.h>
#define i2c_Address 0x3c
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
#define OLED_RESET -1   //   QT-PY / XIAO
extern Adafruit_SH1106G display;

void init_display();
void draw_title(const char *title);
void draw_options(const char *op[], uint8_t min, uint8_t max);
void info_message(const char *title, const char *description);
void draw_signal(int signal, uint8_t x, uint8_t y);

#endif