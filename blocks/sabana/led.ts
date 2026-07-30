namespace bloques {

    /**
     * Estado del LED.
     *
     * ATENCIÓN: los valores 0 y 1 NO son arbitrarios. El LED del proveedor es
     * de LÓGICA INVERTIDA (active low):
     *   escribir 0 en el pin -> LED ENCENDIDO
     *   escribir 1 en el pin -> LED APAGADO
     * Por eso ON = 0 y OFF = 1, y el valor del enum se pasa directo a
     * digitalWritePin sin ninguna traducción.
     *
     * NO invertir estos valores "para que se lean mejor": el LED quedaría
     * funcionando al revés y el código seguiría compilando sin avisos.
     *
     * Verificado en ORIGINAL/block/output.ts:
     *   LEDOn  -> pins.digitalWritePin(num, 0)
     *   LEDOff -> pins.digitalWritePin(num, 1)
     */
    export enum SabanaEstadoOnOff {
        //% block="ON"
        ON = 0,
        //% block="OFF"
        OFF = 1,
    }

    /**
     * STV2-10 — LED simple en un puerto GPIO, con estado ON/OFF.
     *
     * Origen del código: EXT4/blocks/smartteam4/LED.ts y
     * _referencia/ext5-LED.ts (idénticos):
     *   pins.digitalWritePin(puertoToGpioPin(puerto), estado)
     *
     * @param estado ON u OFF, eg: SabanaEstadoOnOff.ON
     * @param puerto puerto GPIO de la placa, eg: SabanaPuerto.P0
     */
    //% blockId=sabana_led
    //% block="LED │ Estado %estado en pin %puerto"
    //% group="SALIDAS" color="#FFB800" weight=95 blockGap=8
    export function led(estado: SabanaEstadoOnOff, puerto: SabanaPuerto): void {
        pins.digitalWritePin(puertoToDigitalPin(puerto), estado)
    }
}
