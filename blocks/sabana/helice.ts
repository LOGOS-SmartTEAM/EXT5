namespace bloques {

    /**
     * Segundo pin de control (IN2) del puente H de la hélice, por puerto.
     *
     * IN1 es el pin normal del puerto (puertoToDigitalPin). IN2 usa los pines
     * de la columna "echo" del mapeo físico de la placa, que quedaron libres
     * cuando el ultrasónico pasó a I2C:
     *
     *   PUERTO 0 -> P13     PUERTO 2 -> P15
     *   PUERTO 1 -> P14     PUERTO 3 -> P7
     *
     * Origen: _referencia/ext5-helice.ts -> puertoToHeliceIn2() y
     *         _referencia/ext5-puertos-mapeo.txt
     *
     * PENDIENTE DE VERIFICAR EN HARDWARE: si un sentido de giro no funciona
     * pero el otro sí, el pin IN2 de ese puerto está mal asignado.
     */
    function puertoToHeliceIn2(puerto: SabanaPuerto): DigitalPin {
        switch (puerto) {
            case SabanaPuerto.P0: return DigitalPin.P13
            case SabanaPuerto.P1: return DigitalPin.P14
            case SabanaPuerto.P2: return DigitalPin.P15
            case SabanaPuerto.P3: return DigitalPin.P7
            default: return DigitalPin.P13
        }
    }

    /**
     * STV2-21 — Hélice en un puerto GPIO. Reutiliza el enum
     * SabanaMovimientoMotorUnico definido en motor_multicolor.ts
     * (Derecha / Izquierda / Frenar).
     *
     * La hélice se controla con un PUENTE H de dos pines digitales, así que
     * el sentido de giro es real (no es un simple ON/OFF):
     *
     *   izquierda -> IN1=0, IN2=1
     *   derecha   -> IN1=1, IN2=0
     *   frenar    -> IN1=0, IN2=0
     *
     * La combinación 1/1 no se usa: en un puente H es freno por cortocircuito
     * y en algunos controladores está prohibida.
     *
     * No hay control de velocidad: los dos pines son digitales, sin PWM.
     *
     * Origen del código: _referencia/ext5-helice.ts -> ext5Helice()
     *
     * @param sentido sentido de giro o freno, eg: SabanaMovimientoMotorUnico.Derecha
     * @param puerto puerto GPIO de la placa, eg: SabanaPuerto.P0
     */
    //% blockId=sabana_helice
    //% block="Hélice │ %sentido en pin %puerto"
    //% group="MOTORES" color="#FFB800" weight=75 blockGap=8
    export function helice(sentido: SabanaMovimientoMotorUnico, puerto: SabanaPuerto): void {
        const in1 = puertoToDigitalPin(puerto)
        const in2 = puertoToHeliceIn2(puerto)

        switch (sentido) {
            case SabanaMovimientoMotorUnico.Izquierda:
                pins.digitalWritePin(in1, 0)
                pins.digitalWritePin(in2, 1)
                break
            case SabanaMovimientoMotorUnico.Derecha:
                pins.digitalWritePin(in1, 1)
                pins.digitalWritePin(in2, 0)
                break
            case SabanaMovimientoMotorUnico.Frenar:
                pins.digitalWritePin(in1, 0)
                pins.digitalWritePin(in2, 0)
                break
        }
    }
}
