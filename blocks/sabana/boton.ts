namespace bloques {
    /**
     * STV2-2 — Botón conectado a un puerto GPIO.
     *
     * Devuelve 1 cuando el botón está PRESIONADO y 0 cuando NO lo está.
     * Bloque redondo (reporter numérico): para decidir, comparar con "= 1".
     *
     * El botón es de masa activa: presionado lleva el pin a 0. Por eso se
     * activa la resistencia de pull-up interna y se invierte la lectura
     * (1 - digitalRead): pin en 0 (presionado) -> 1, pin en 1 (suelto) -> 0.
     * Sin el setPull el pin queda flotando y la lectura es ruido.
     *
     * Origen del código:
     *   - pull-up: EXT4/blocks/smartteam4/boton.ts -> ext4BotonEnPin()
     *   - inversión 1 - digitalRead: EXT4/blocks/smartteam4/boton.ts
     *
     * @param puerto puerto GPIO de la placa, eg: SabanaPuerto.P0
     */
    //% blockId=sabana_boton
    //% block="Botón │ en pin %puerto"
    //% group="SENSORES" color="#FFB800" weight=95 blockGap=8
    export function boton(puerto: SabanaPuerto): number {
        const pin = puertoToDigitalPin(puerto)
        pins.setPull(pin, PinPullMode.PullUp)
        return 1 - pins.digitalReadPin(pin)
    }
}
