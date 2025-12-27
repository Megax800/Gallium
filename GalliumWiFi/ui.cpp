#include "ui.h"
#include "display.h"
const uint8_t KEYPAD_ADDRESS = 0x20;
I2CKeyPad keyPad(KEYPAD_ADDRESS);
char keymap[19] = "123A456B789C*0#DNF";  //  N = NoKey, F = Fail

void lock_screen()
{
  bool exit = true;
  display.clearDisplay();
  display.setCursor(0, 0);
  if(WiFi.status() == WL_CONNECTED)
  {
    display.println(WiFi.SSID());
    draw_signal(WiFi.RSSI(),118,1);
  }else{
    display.println("Sin Servicio");
  }
  
  display.drawFastHLine(0, 11, 128, SH110X_WHITE);
  display.setCursor(53, 56);
  display.print("Menu");
  display.display();
  while(exit == true)
  {
    if(keyPad.isPressed())
    {
      exit = false;
      delay(200);
    }else{delay(20);}
  }
}

uint8_t option_select(const char *op[], uint8_t length)
{
  uint8_t page = 0;
  uint8_t menu_cursor = 3*page+1;
  int op_selected = 25;

  draw_options(op, 0, 2);

  do{
  if(menu_cursor == 254)
  {
    display.fillRect(20, 17, 107, 50, SH110X_BLACK);
    page--;
    menu_cursor = 3*page+3;
    draw_options(op, 3*page, 3*page+2);
  }else if(menu_cursor == 255)
  {
    display.fillRect(20, 17, 107, 50, SH110X_BLACK);
    page++;
    menu_cursor = 3*page+1;
    if(3*page+2 < length){draw_options(op, 3*page, 3*page+2);}else{draw_options(op, 3*page, length);}
  }
  if(op_selected == 9 || op_selected == 1 || op_selected == 25)
  {
    display.fillRect(10, 17, 10, 50, SH110X_BLACK);
    for(uint8_t i = 1; i <= 3; i++)
    {
      if(menu_cursor == 3*page+i)
      {
        display.setCursor(10, 5+12*i);
        display.write(16);
      }
    }
    display.display();
  }
  if(keyPad.isPressed() || op_selected == 25)
  {
    op_selected = keyPad.getKey();
    switch(op_selected)
    {
      case 14:
        delay(200);
        break;
      case 9:
        delay(200);
        if(menu_cursor < length)
        {
          menu_cursor++;
          if(menu_cursor > 3*page+3){ menu_cursor = 255;}
        }
        break;
      case 1:
        delay(200);
        if(menu_cursor > 1)
        {
          menu_cursor--;
          if(menu_cursor == 3*page+1 && page != 0){menu_cursor = 254;}
        }
        break;
      case 12:
        delay(200);
        menu_cursor = 0;
        break;
    }
  }else{delay(20);}
  }while(op_selected != 12 && op_selected != 14);
  

 return menu_cursor; 
}

String text_input()
{
  uint8_t index = 0;
  uint8_t ch_type = 0;    // 0:Minuscula 1:Mayuscula 2:Numeros 3:Caracteres Especiales
  uint8_t ch_typemin = 97;
  uint8_t ch_typemax = 122;
  bool exit = false;
  char buffer[255];
  buffer[0] = 'a';
  buffer[1] = '_';

  for(int i=1; i<255; i++){buffer[i]=0;}

  display.fillRect(0, 12, 128, 50, SH110X_BLACK);
  display.setCursor(5, 12);
  display.print(buffer);
  display.display();
  while(exit == false)
  {
    if(keyPad.isPressed() == true)
    {
      switch(keyPad.getKey())
      {
        case 1:
          if(buffer[index] < ch_typemax)
          {
            buffer[index]++;
          }else if(ch_type == 3)
          {
            if(ch_typemax == 47)
            {
              ch_typemin = 58;
              ch_typemax = 64;
              buffer[index] = ch_typemin;
            }else if(ch_typemax == 64)
            {
              ch_typemin = 91;
              ch_typemax = 96;
              buffer[index] = ch_typemin;
            }else if(ch_typemax == 96)
            {
              ch_typemin = 123;
              ch_typemax = 126;
              buffer[index] = ch_typemin;
            }
          }
        break;
        case 5:
          if(index < 253)
          {
            index++;
            buffer[index] = buffer[index-1];
            buffer[index+1] = '_';
          }
        break;
        case 9:
          if(buffer[index] > ch_typemin)
          {
            buffer[index]--;
          }else if(ch_type == 3)
          {
            if(ch_typemin == 123)
            {
              ch_typemin = 91;
              ch_typemax = 96;
              buffer[index] = ch_typemax;
            }else if(ch_typemin == 91)
            {
              ch_typemin = 58;
              ch_typemax = 64;
              buffer[index] = ch_typemax;
            }else if(ch_typemin == 58)
            {
              ch_typemin = 33;
              ch_typemax = 47;
              buffer[index] = ch_typemax;
            }
          }
        break;
        case 10:
          if(ch_type < 3){ch_type++;}else{ch_type = 0;}
          switch(ch_type)
          {
            case 0:
              ch_typemin = 97;
              ch_typemax = 122;
              buffer[index] = 97;
            break;
            case 1:
              ch_typemin = 65;
              ch_typemax = 90;
              buffer[index] = buffer[index]-32;
            break;
            case 2:
              ch_typemin = 48;
              ch_typemax = 57;
              buffer[index] = 48;
            break;
            case 3:
              ch_typemin = 33;
              ch_typemax = 47;
              buffer[index] = 33;
            break;
          }
          display.setCursor(120,56);
          display.write(ch_typemin);
        break;
        case 12:
          if(index == 0)
          {
            exit = true;
          }else{
            buffer[index]= 0;
            index--;  
          }
        break;
        case 13:
          buffer[index]= ' ';
          index++;
          buffer[index+1] = '_';
          buffer[index] = buffer[index-2];
        break;
        case 14:
          exit = true;
        break;
      }
      display.fillRect(0, 12, 128, 52, SH110X_BLACK);
      display.setCursor(5, 12);
      display.print(buffer);
      display.display();
      delay(150);
    }
    delay(20);
  }
  char output[index+1];
  for(int i = 0; i<=index; i++)
  {
    output[i] = buffer[i];
  }

  return String(output);
}

void net_scan()
{
  uint8_t results = WiFi.scanNetworks(false, true);
  uint8_t menu_cursor = 0;
  bool exit = true;
  
  draw_title("Selecione una Red");
  display.setCursor(20, 17);
  display.print(WiFi.SSID(0).c_str());
  draw_signal(WiFi.RSSI(0), 110, 50);
  display.setCursor(50, 50);
  display.printf("%c 1/%i %c",17,results,16);
  display.display();

  do
  {
    if(keyPad.isPressed())
    {
      delay(100);
      switch(keyPad.getKey())
      {
        case 4:
          if(menu_cursor > 0)
          {
            menu_cursor--;
          }
        break;
        case 6:
          if(menu_cursor < results-1)
          {
            menu_cursor++;
          }
        break;
        case 14:
          display.clearDisplay();
          display.setCursor(0, 0);
          display.printf("Red: %s", WiFi.SSID(menu_cursor));
          display.display();
          WiFi.begin(WiFi.SSID(menu_cursor).c_str(), text_input().c_str());
          while(WiFi.status() != WL_CONNECTED)
          {
            display.print(".");
            display.display();
            delay(500);
          }
          exit = false;
        break;
        case 12:
          exit = false;
        break;
      }
      display.fillRect(0, 13, 128, 50, SH110X_BLACK);
      display.setCursor(20, 17);
      display.print(WiFi.SSID(menu_cursor).c_str());
      draw_signal(WiFi.RSSI(menu_cursor), 110, 50);
      display.setCursor(50, 50);
      display.printf("%c %i/%i %c",17,menu_cursor+1,results,16);
      display.display();
    }else{
      delay(20);
    }
  }while(exit);

}