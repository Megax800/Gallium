#include <16F628a.h>
#fuses INTRC_IO, NOWDT, NOPROTECT, NOMCLR, NOLVP, NOBROWNOUT
#use delay(clock=4000000)
#use rs232(baud=9600, xmit=PIN_B2, rcv=PIN_B1, bits=8, parity=N, stop=1)
#include <LCD4Bit.c>

char c = 97;		// variables para el control del LCD
int x = 1;
int y = 1;

int ch_set = 0; // Tipo de Caracter 0: minuscula, 1: mayuscula, 2: numeros, 3:simbolos
int sw_idle_timer = 1; // Contador de Inactividad

void select(); // Realiza un retorno de carro
void write_ch(); // Escribe el caracter en el LCD y por SERIAL
void next_ch(int dir); // Cambia el caracter a ingresar
void txt_mode(); // Cambia el tipo de caracter
#int_rda
void recv_data(void)
{
	char buffer;
	buffer = getc();   // Recibe un carácter
	putc(buffer);		// Lo reenvía (echo)
	lcd_putc(buffer); //Lo escribe en el LCD
	x++;
	/*if(x == 17) //Controla la pocision del cursor
	{
		x = 0;
		if(y == 2)
		{
			y=0;
			lcd_putc("\f");
		}else
		{
			y++;
			lcd_putc("\n");
		}
	}*/
}

void main(void)
{	

	set_tris_b(255);
	port_b_pullups(TRUE);
	lcd_init();
	lcd_putc("\f    Gallium     ");
	delay_ms(2000);
	lcd_putc("\f");
	lcd_cursor_on(1);
	enable_interrupts(INT_RDA);
	enable_interrupts(GLOBAL);

	while(TRUE)
	{
		if(input(PIN_B0) == 0 || input(PIN_B3) == 0) // Boton Up-Down
		{	
			delay_ms(200);
			write_ch();				
		}
		if(input(PIN_B4) == 0) // Boton Select
		{
			delay_ms(250);
			select();
		}
		if(input(PIN_B5) == 0) // Boton Clear
		{
			delay_ms(300);		// Imprime un Caracter Nulo
			lcd_putc("\b");
			lcd_putc(0);
			lcd_putc("\b");
			putc(8);
			putc(0);
		}
		if(input(PIN_B6) == 0) // Boton Mode
		{
			delay_ms(250);
			txt_mode();
		}
    }
}

void select()
{
	putc(13);
	lcd_putc("\n");
}

void txt_mode()
{
	if(ch_set == 3){ch_set = 0;}else{ch_set++;}
	switch(ch_set)
	{
		case 0:		// Minuscula
			c = 97;
			break;
		case 1:		// Cambia al caracter correspondiente en mayuscula
			c= c - 32;
			break;
		case 2:
			c = 48; // Numeros
			break;
		case 3:
			c = 33; // Simbolos
			break;
	}
	lcd_putc(c);
	lcd_putc("\b");		
}

void write_ch()
{
	lcd_cursor_on(0);
	while(input(PIN_B0) == 1 && input(PIN_B3) == 1 && sw_idle_timer < 100) //Espera 1 Segundo para confirmar el caracter
	{
		delay_ms(10);
		sw_idle_timer++;
	}
	if(sw_idle_timer == 100) 		// Si el tiempo fue de 1 segundo se imprime el caracter y							
	{								// se avanza a la siguiente pocision.
		sw_idle_timer = 1;			// Si se oprimio una tecla antes del segundo modifica el caracter
		lcd_putc(c);				// segun la tecla oprimida
		putc(c);
		lcd_cursor_on(1);
	}else
	{	
		if(input(PIN_B0) == 0){next_ch(1);}else{next_ch(0);}
		lcd_putc(c);
		lcd_putc("\b");
	}
}

void next_ch(int dir)
{
	if(dir == 1)		// Direccion Ascendente
	{
		if(c == 47){c = 58;}else
		{
			if(c == 64){c = 91;}else
			{
				if(c == 95){c = 123;}else
				{
					if(c == 126){c = 33;}else
					{
						if( c == 90){c = 65;}else
						{
							if(c == 122){c = 97;}else{c++;}
						}
					}
				}
			}		
		}
	}
	if(dir == 0) 		// Direccion Descendente
	{
		if(c == 123){c = 95;}else
		{
			if(c == 91){c = 64;}else
			{
				if(c == 58){c = 47;}else
				{
					if(c == 33){c = 126;}else
					{
						if( c == 65){c = 90;}else
						{
							if(c == 97){c = 122;}else{c--;}
						}
					}
				}
			}		
		}

	}
}