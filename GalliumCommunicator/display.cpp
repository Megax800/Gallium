#include "display.h"
Adafruit_SH1106G display = Adafruit_SH1106G(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void init_display()
{
  delay(250); // wait for the OLED to power up
  display.begin(i2c_Address, true); 
  display.clearDisplay();
  display.setTextSize(1);      // Normal 1:1 pixel scale
  display.setTextColor(SH110X_WHITE); // Draw white text
  display.display();
}

void draw_title(const char *title)
{
  display.clearDisplay();
  display.setCursor(0, 0);
  display.print(title);
  display.drawFastHLine(0, 10, 128, SH110X_WHITE);
}

void draw_options(const char *op[], uint8_t min, uint8_t max)
{
  for(uint8_t i = 0; i <= max-min; i++)
  {
    display.setCursor(20, 5+12*(i+1));
    display.print(op[min+i]);
  }
  display.display();
}

void info_message(const char *title, const char *description)
{
  draw_title(title);
  display.setCursor(0, 32);
  display.println(description);
  display.display();
  delay(3000);
}

void draw_signal(int signal, uint8_t x, uint8_t y)
{
  if(signal > -85)
  {
    display.drawFastVLine(x, y+4, 5, SH110X_WHITE);
  }
  if(signal > -75)
  {
    display.drawFastVLine(x+2, y+3, 6, SH110X_WHITE);
  }
  if(signal > -67)
  {
    display.drawFastVLine(x+4, y+2, 7, SH110X_WHITE);
  }
  if(signal > -50)
  {
    display.drawFastVLine(x+6, y+1, 8, SH110X_WHITE);
  }
}