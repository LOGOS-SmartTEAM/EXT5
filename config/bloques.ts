/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BLOQUES EDITABLES — SmartTEAM4
 * Colores por subgrupo:
 *   Variables → #FF6680 (Variables nativas MakeCode)
 *   Sensores (sombra) → #fcbb2b | Sensores (lógica) → #00A4A6 (Lógica nativa)
 *   Salidas → #fcbb2b
 *   Motores / OLED → #34c2eb
 * ═══════════════════════════════════════════════════════════════════════════
 */

const BLOQUES = {
    cantidadSet: {
        color: "#FF6680",
        iconoFa: "\\uf085",
        iconoArchivo: "icons/smartteam4/cantidad-set.png",
        categoria: "SMARTTEAM4",
        subcategoria: "Variables",
        blockId: "ext4_cantidad_set",
        texto: "Establecer Cantidad a %valor",
        weight: 100,
    },
    cantidadGet: {
        color: "#FF6680",
        iconoFa: "\\uf085",
        iconoArchivo: "icons/smartteam4/cantidad-get.png",
        categoria: "SMARTTEAM4",
        subcategoria: "Variables",
        blockId: "ext4_cantidad_get",
        texto: "Cantidad",
        weight: 99,
    },
    cantidadSumar: {
        color: "#FF6680",
        iconoFa: "\\uf085",
        iconoArchivo: "icons/smartteam4/cantidad-sumar.png",
        categoria: "SMARTTEAM4",
        subcategoria: "Variables",
        blockId: "ext4_cantidad_sumar",
        texto: "Sumar 1",
        weight: 98,
    },
    cantidadRestar: {
        color: "#FF6680",
        iconoFa: "\\uf085",
        iconoArchivo: "icons/smartteam4/cantidad-restar.png",
        categoria: "SMARTTEAM4",
        subcategoria: "Variables",
        blockId: "ext4_cantidad_restar",
        texto: "Restar 1",
        weight: 97,
    },
    botonComparar: {
        color: "#00A4A6",
        iconoFa: "\\uf11c",
        iconoArchivo: "icons/entradas/boton-compare.png",
        categoria: "SMARTTEAM4",
        subcategoria: "Sensores",
        blockId: "ext4_button_compare",
        texto: "$reading $op $value",
        weight: 0,
    },
    ultrasonicDetecta: {
        color: "#00A4A6",
        iconoFa: "\\uf1ce",
        iconoArchivo: "icons/entradas/ultrasonic-detect.png",
        categoria: "SMARTTEAM4",
        subcategoria: "Sensores",
        blockId: "ext4_ultrasonic_detect",
        texto: "$distancia detecta objeto %estado",
        weight: 0,
    },
    led: {
        color: "#fcbb2b",
        iconoFa: "\\uf0eb",
        iconoArchivo: "icons/salidas/led.png",
        categoria: "SMARTTEAM4",
        subcategoria: "Salidas",
        blockId: "ext4_led",
        texto: "LED Puerto %puerto Estado %estado",
        weight: 100,
    },
    motorMover: {
        color: "#34c2eb",
        iconoFa: "\\uf013",
        iconoArchivo: "icons/smartteam4/motor-move.png",
        categoria: "SMARTTEAM4",
        subcategoria: "Motores",
        blockId: "ext4_motor_move",
        texto: "Motores %movimiento || Velocidad %velocidad",
        weight: 100,
    },
    oledEscribir: {
        color: "#34c2eb",
        iconoFa: "\\uf108",
        iconoArchivo: "icons/smartteam4/oled-escribir.png",
        categoria: "SMARTTEAM4",
        subcategoria: "OLED",
        blockId: "ext4_oled_show_text",
        texto: "Escribir %texto en la fila %fila y columna %columna",
        weight: 10,
    },
    oledBorrar: {
        color: "#34c2eb",
        iconoFa: "\\uf108",
        iconoArchivo: "icons/smartteam4/oled-borrar.png",
        categoria: "SMARTTEAM4",
        subcategoria: "OLED",
        blockId: "ext4_oled_clear",
        texto: "Borrar textos de la OLED en el pin IIC",
        weight: 8,
    },
} as const;
