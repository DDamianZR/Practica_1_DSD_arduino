/*
 * ============================================================
 *  Registro de Corrimiento SISO (Serial In - Serial Out)
 *  4 bits, simulado con Arduino UNO
 * ============================================================
 *
 *  Idea:
 *   - reg[0] = Q0 -> es la ENTRADA serie (donde aparece el bit nuevo)
 *   - reg[3] = Q3 -> es la SALIDA serie (ultimo flip-flop de la cadena)
 *   - Cada boton = un pulso de reloj (CLK) + el bit que se inyecta:
 *        * BTN_UNO  inyecta un 1 y desplaza
 *        * BTN_CERO inyecta un 0 y desplaza
 *   - En cada pulso: Q3<-Q2, Q2<-Q1, Q1<-Q0, Q0<-bit_nuevo
 *
 *  El estado se ve en 4 LEDs y tambien se imprime por el
 *  Monitor Serie (9600 baud) para llenar la tabla de la practica.
 *
 *  Los botones usan las resistencias PULL-UP internas del Arduino,
 *  asi que NO necesitas resistencias externas para ellos:
 *  presionado = LOW, suelto = HIGH.
 *
 *  Para "inicializar en cero" (CLR) solo presiona el boton RESET
 *  fisico del Arduino: reinicia el sketch y el registro vuelve a 0000.
 * ============================================================
 */

// ---------- Pines ----------
const uint8_t LED_PINS[4] = {2, 3, 4, 5};  // Q0, Q1, Q2, Q3 (izq -> der)
const uint8_t BTN_CERO = 6;                // boton que inyecta un 0
const uint8_t BTN_UNO  = 7;                // boton que inyecta un 1

// ---------- Estado del registro ----------
bool reg[4] = {0, 0, 0, 0};   // reg[0]=Q0 (entrada) ... reg[3]=Q3 (salida)
unsigned int ciclo = 0;       // contador de pulsos de reloj

// ---------- Antirrebote (debounce) ----------
const unsigned long DEBOUNCE_MS = 40;

struct Boton {
  uint8_t pin;
  bool    estadoEstable;   // ultimo estado estable (HIGH = suelto)
  bool    ultimaLectura;   // ultima lectura cruda
  unsigned long tCambio;   // instante del ultimo cambio de lectura
};

Boton btnCero = {BTN_CERO, HIGH, HIGH, 0};
Boton btnUno  = {BTN_UNO,  HIGH, HIGH, 0};

// Devuelve true UNA sola vez cuando el boton pasa de suelto a presionado
bool flancoPresion(Boton &b) {
  bool lectura = digitalRead(b.pin);

  if (lectura != b.ultimaLectura) {
    b.tCambio = millis();
    b.ultimaLectura = lectura;
  }

  bool evento = false;
  if ((millis() - b.tCambio) > DEBOUNCE_MS && lectura != b.estadoEstable) {
    b.estadoEstable = lectura;
    if (b.estadoEstable == LOW) evento = true;  // acaba de presionarse
  }
  return evento;
}

// ---------- Logica del registro ----------
void desplazar(bool bitEntrada) {
  // Corrimiento a la derecha: Q3<-Q2, Q2<-Q1, Q1<-Q0, Q0<-bitEntrada
  for (int i = 3; i > 0; i--) {
    reg[i] = reg[i - 1];
  }
  reg[0] = bitEntrada;
}

void actualizarLeds() {
  for (int i = 0; i < 4; i++) {
    digitalWrite(LED_PINS[i], reg[i] ? HIGH : LOW);
  }
}

void imprimirEstado(char bitEntrada) {
  Serial.print("CLK ");
  if (ciclo < 10) Serial.print(' ');
  Serial.print(ciclo);
  Serial.print("  | in=");
  Serial.print(bitEntrada);
  Serial.print("  | Q0=");
  Serial.print(reg[0]);
  Serial.print(" Q1=");
  Serial.print(reg[1]);
  Serial.print(" Q2=");
  Serial.print(reg[2]);
  Serial.print(" Q3=");
  Serial.print(reg[3]);
  Serial.print("   (salida serie = ");
  Serial.print(reg[3]);
  Serial.println(")");
}

// ---------- Setup ----------
void setup() {
  Serial.begin(9600);

  for (int i = 0; i < 4; i++) pinMode(LED_PINS[i], OUTPUT);
  pinMode(BTN_CERO, INPUT_PULLUP);
  pinMode(BTN_UNO,  INPUT_PULLUP);

  actualizarLeds();
  Serial.println(F("=== Registro SISO 4 bits listo ==="));
  Serial.println(F("Estado inicial: Q0=0 Q1=0 Q2=0 Q3=0"));
  Serial.println(F("Boton 1 -> inyecta 1 | Boton 0 -> inyecta 0 | RESET -> limpia"));
  Serial.println();
}

// ---------- Loop ----------
void loop() {
  if (flancoPresion(btnUno)) {
    desplazar(1);
    ciclo++;
    actualizarLeds();
    imprimirEstado('1');
  }

  if (flancoPresion(btnCero)) {
    desplazar(0);
    ciclo++;
    actualizarLeds();
    imprimirEstado('0');
  }
}
