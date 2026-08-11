/**
 * Bloques MORSE — grupo ESPECIAL.
 *
 * Captura un mensaje Morse a partir de pulsaciones de botón y lo traduce
 * a texto:
 *   - Duración de la pulsación: < 500ms = punto ("."), >= 500ms = línea ("_").
 *   - Fin de letra: 1000ms de silencio total sin pulsar nada.
 *   - Fin de palabra: se marca a mano con "Traducir mensaje".
 *
 * IMPORTANTE: estos bloques NO leen ningún pin directamente — solo
 * reaccionan a si "Guardar mensaje MORSE" es llamado o no en cada vuelta
 * del loop ("para siempre"). El pin del botón lo decide quien envuelve el
 * bloque con un "si Botón en pin %puerto = 1 entonces", así que funcionan
 * sin importar en qué puerto esté conectado el botón.
 */

namespace bloques {

    // Índice i <-> letra 'A' + i. Código real (A = ".-", H = "....", etc.)
    // usando "p" = punto y "l" = línea.
    const MORSE_CODIGOS: string[] = [
        "pl", "lppp", "lplp", "lpp", "p", "pplp", "llp", "pppp", "pp", "plll",
        "lpl", "plpp", "ll", "lp", "lll", "pllp", "llpl", "plp", "ppp", "l",
        "ppl", "pppl", "pll", "lppl", "lpll", "llpp"
    ]
    const MORSE_LETRAS: string[] = [
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
        "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
    ]

    const MORSE_UMBRAL_PUNTO_MS = 500      // duración < esto = punto, si no = línea
    const MORSE_SILENCIO_SUELTA_MS = 50    // sin llamadas por esto = se soltó el botón
    const MORSE_TIMEOUT_LETRA_MS = 1000    // silencio total = fin de letra
    const MORSE_INTERVALO_VIGIA_MS = 20    // frecuencia de sondeo del vigía

    let morseSimboloActual = ""    // "p"/"l" acumulados de la letra en curso
    let morseVector1 = ""          // Mensaje MORSE (puntos/líneas + espacios)
    let morseVector2 = ""          // Mensaje TRADUCIDO (letras + espacios)
    let morsePresionado = false
    let morseInicioPulsacion = 0
    let morseUltimaLlamada = 0
    let morseUltimaActividad = 0
    let morseVigiaActivo = false

    function morseDecodificar(codigo: string): string {
        for (let i = 0; i < MORSE_CODIGOS.length; i++) {
            if (MORSE_CODIGOS[i] == codigo) {
                return MORSE_LETRAS[i]
            }
        }
        return "?"
    }

    function morseCerrarLetraPendiente(): void {
        if (morseSimboloActual == "") return
        morseVector2 += morseDecodificar(morseSimboloActual)
        morseVector1 += " "
        morseSimboloActual = ""
    }

    function morseVigilante(): void {
        while (true) {
            basic.pause(MORSE_INTERVALO_VIGIA_MS)
            const ahora = input.runningTime()

            if (morsePresionado && (ahora - morseUltimaLlamada) > MORSE_SILENCIO_SUELTA_MS) {
                const duracion = morseUltimaLlamada - morseInicioPulsacion
                if (duracion < MORSE_UMBRAL_PUNTO_MS) {
                    morseSimboloActual += "p"
                    morseVector1 += "."
                } else {
                    morseSimboloActual += "l"
                    morseVector1 += "_"
                }
                morsePresionado = false
                morseUltimaActividad = ahora
            }

            if (!morsePresionado && morseSimboloActual != "" && (ahora - morseUltimaActividad) > MORSE_TIMEOUT_LETRA_MS) {
                morseCerrarLetraPendiente()
            }
        }
    }

    /**
     * Registra una pulsación: colocar dentro de "si Botón en pin ... = 1
     * entonces" para que se llame en cada vuelta del loop mientras el
     * botón esté presionado. Un vigía en segundo plano infiere cuándo se
     * soltó (por la ausencia de llamadas) y clasifica punto/línea según
     * cuánto duró la pulsación.
     */
    //% blockId=morse_guardar
    //% block="Guardar mensaje MORSE" group="ESPECIAL" weight=100 color=#9C27B0
    export function guardarMensajeMorse(): void {
        const ahora = input.runningTime()
        if (!morsePresionado) {
            morsePresionado = true
            morseInicioPulsacion = ahora
        }
        morseUltimaLlamada = ahora

        if (!morseVigiaActivo) {
            morseVigiaActivo = true
            control.inBackground(morseVigilante)
        }
    }

    /**
     * Cierra la letra pendiente (si quedó alguna a medio tipear) y agrega
     * un espacio de fin de palabra al mensaje traducido.
     */
    //% blockId=morse_traducir
    //% block="Traducir mensaje" group="ESPECIAL" weight=98 color=#9C27B0
    export function traducirMensaje(): void {
        morseCerrarLetraPendiente()
        morseVector1 += " "
        if (morseVector2.length > 0 && morseVector2.charAt(morseVector2.length - 1) != " ") {
            morseVector2 += " "
        }
    }

    /**
     * Mensaje en código Morse (puntos/líneas) acumulado hasta ahora.
     */
    //% blockId=morse_mensaje
    //% block="Mensaje MORSE" group="ESPECIAL" weight=99 color=#9C27B0
    export function mensajeMorse(): string {
        return morseVector1
    }

    /**
     * Mensaje traducido (texto) acumulado hasta ahora.
     */
    //% blockId=morse_traducido
    //% block="Mensaje TRADUCIDO" group="ESPECIAL" weight=97 color=#9C27B0
    export function mensajeTraducido(): string {
        return morseVector2
    }

    /**
     * Borra el mensaje Morse y el mensaje traducido acumulados, incluyendo
     * cualquier letra que se estuviera tipeando en ese momento.
     */
    //% blockId=morse_borrar
    //% block="Borrar MENSAJES" group="ESPECIAL" weight=96 color=#9C27B0
    export function borrarMensajes(): void {
        morseSimboloActual = ""
        morseVector1 = ""
        morseVector2 = ""
        morsePresionado = false
    }
}
