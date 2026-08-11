namespace bloques {
    /**
     * STV2-7 — Sensor de luz (fotorresistencia) en un puerto GPIO.
     * Lectura analógica 0-1023, donde 1023 = mucha luz y 0 = oscuridad.
     *
     * Origen del código: ORIGINAL/block/sensorGPIO.ts -> Photosensitive()
     *   return pins.analogReadPin(num)
     *
     * NOTA HISTÓRICA: la tabla original decía "Suelo" por un copiado erróneo de
     * STV2-5. El texto ya fue corregido a "Sensor de Luz" y NO se vuelve a tocar.
     *
     * NOTA: probado en físico, el sensor entrega la lectura invertida
     * (0 = mucha luz, 1023 = oscuridad). Se invierte aquí para que el bloque
     * siempre entregue 1023 = mucha luz y 0 = oscuridad.
     *
     * @param puerto puerto GPIO de la placa, eg: SabanaPuerto.P0
     */
    //% blockId=luz
    //% block="Sensor de Luz │ en pin %puerto"
    //% group="SENSORES" color="#FFB800" weight=90 blockGap=8
    export function luz(puerto: SabanaPuerto): number {
        return 1023 - pins.analogReadPin(puertoToAnalogPin(puerto))
    }
}
