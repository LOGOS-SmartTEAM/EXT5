/**
 * SmartTEAM 5 — extensión MakeCode para micro:bit.
 *
 * Estructura (heredada de STV2-PADRE, la extensión de referencia):
 *   - blocks/categorias/bloques.ts → categoría "SmartTEAM 5" + groups (subcategorías)
 *   - blocks/sabana/               → un archivo .ts por componente
 *
 * Un solo namespace (`bloques`) con groups internos.
 *
 * Subconjunto de 12 componentes copiados tal cual de STV2-PADRE (texto,
 * color, weight, blockId, enums y forma de bloque idénticos; solo se adapta
 * el cuerpo cuando el hardware lo exige):
 *   SENSORES   → Ultrasonido, Botón, DHT11, Sensor de Luz, Potenciómetro
 *   SALIDAS    → LED, Tira RGB (encender / ajustar R-G-B / apagar)
 *   PANTALLAS  → OLED (escribir / borrar)
 *   MOTORES    → Servo, Motor multicolor
 *   MOVIMIENTO → Movimiento (simple / por cm / girar)
 *   ESPECIAL   → Morse (5 bloques, visuales/placeholder — lógica real
 *                todavía sin definir en PADRE)
 *
 * De Botón y Ultrasonido solo se tomó el bloque redondo (reporter); PADRE
 * también define una variante lógica (hexágono) que no se incluyó acá.
 * El enum SabanaColumna16 que usa OLED se movió desde lcd.ts (fuera del
 * alcance de esta extensión) directamente a oled.ts.
 */
