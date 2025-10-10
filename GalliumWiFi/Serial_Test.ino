void setup() {
  delay(10000);
  Serial.begin(9600, SERIAL_8N1);
}

void loop() {
  Serial.print("\fHola \n");
  delay(2000);
  Serial.print("Tarola");
  delay(5000);
}
