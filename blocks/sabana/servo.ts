namespace bloques {

    /**
     * STV2-20 — Servo motor en un puerto GPIO.
     *
     * Rango 0-180°. PADRE lo limitaba a 90° por un recorte sin respaldo:
     * tanto ORIGINAL (value.max=180) como la versión anterior de EXT5
     * (grado.max=180) usan el recorrido completo del servo estándar.
     * Ver excepción registrada en el índice maestro.
     *
     * Usa la API nativa pins.servoWritePin(), que genera la señal PWM de
     * 50 Hz sobre el pin analógico del puerto. No hace falta driver propio.
     *
     * Origen del código: _referencia/ext5-Servo.ts -> ext5ServoPosicionar()
     *
     * @param grado ángulo de 0 a 180 grados, eg: 0
     * @param puerto puerto GPIO de la placa, eg: SabanaPuerto.P0
     */
    //% blockId=sabana_servo
    //% block="Servo │ en el grado %grado en pin %puerto"
    //% grado.min=0 grado.max=180 grado.defl=0
    //% group="MOTORES" color="#FFB800" weight=80 blockGap=8
    export function servo(grado: number, puerto: SabanaPuerto): void {
        pins.servoWritePin(puertoToAnalogPin(puerto), _clamp(grado, 0, 180))
    }
}
