/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BLOQUES EDITABLES — SmartTEAM5
 * Colores por subgrupo:
 *   Sensores (sombra) → #fcbb2b | Sensores (lógica) → #00A4A6 (Lógica nativa)
 *   Salidas → #fcbb2b
 *   Motores / OLED → #34c2eb
 * ═══════════════════════════════════════════════════════════════════════════
 */

const BLOQUES = {
    botonLeer: {
        color: "#fcbb2b",
        iconoFa: "\\uf11c",
        iconoArchivo: "icons/entradas/boton-leer.png",
        categoria: "SMARTTEAM5",
        subcategoria: "Sensores L5",
        blockId: "ext5_button_sensor",
        texto: "BOTÓN en el puerto %puerto",
        weight: 0,
    },
    ultrasonicLeer: {
        color: "#fcbb2b",
        iconoFa: "\\uf1ce",
        iconoArchivo: "icons/entradas/ultrasonic-leer.png",
        categoria: "SMARTTEAM5",
        subcategoria: "Sensores L5",
        blockId: "ext5_ultrasonic_sensor",
        texto: "Ultrasonido en el pin %puerto",
        weight: 0,
    },
    luzLeer: {
        color: "#fcbb2b",
        iconoFa: "\\uf0eb",
        iconoArchivo: "icons/entradas/luz.png",
        categoria: "SMARTTEAM5",
        subcategoria: "Sensores L5",
        blockId: "ext5_luz_sensor",
        texto: "LUZ en el pin %puerto",
        weight: 0,
    },
    potenciometroLeer: {
        color: "#fcbb2b",
        iconoFa: "\\uf042",
        iconoArchivo: "icons/entradas/potenciometro.png",
        categoria: "SMARTTEAM5",
        subcategoria: "Sensores L5",
        blockId: "ext5_potenciometro_sensor",
        texto: "POTENCIOMETRO en el pin %puerto",
        weight: 0,
    },
    led: {
        color: "#fcbb2b",
        iconoFa: "\\uf0eb",
        iconoArchivo: "icons/salidas/led.png",
        categoria: "SMARTTEAM5",
        subcategoria: "Salidas L5",
        blockId: "ext5_led",
        texto: "LED Puerto %puerto Estado %estado",
        weight: 100,
    },
    motorMover: {
        color: "#34c2eb",
        iconoFa: "\\uf013",
        iconoArchivo: "icons/smartteam5/motor-move.png",
        categoria: "SMARTTEAM5",
        subcategoria: "Motores L5",
        blockId: "ext5_motor_move",
        texto: "Motores %movimiento || Velocidad %velocidad",
        weight: 100,
    },
    oledEscribir: {
        color: "#34c2eb",
        iconoFa: "\\uf108",
        iconoArchivo: "icons/smartteam5/oled-escribir.png",
        categoria: "SMARTTEAM5",
        subcategoria: "OLED L5",
        blockId: "ext5_oled_show_text",
        texto: "Escribir %texto en la fila %fila y columna %columna",
        weight: 10,
    },
    oledBorrar: {
        color: "#34c2eb",
        iconoFa: "\\uf108",
        iconoArchivo: "icons/smartteam5/oled-borrar.png",
        categoria: "SMARTTEAM5",
        subcategoria: "OLED L5",
        blockId: "ext5_oled_clear",
        texto: "Borrar textos de la OLED en el pin IIC",
        weight: 8,
    },
    // TODO: bloques de Especiales L5 pendientes
} as const;
