/**
 * Bloque LED — SmartTEAM5 / subcategoría Salidas L5
 */

enum Ext5LedEstado {
    //% block="ON"
    ON = 0,
    //% block="OFF"
    OFF = 1,
}

namespace ext5_smartteam5 {

    /**
     * Escribe el estado del LED en el puerto GPIO indicado.
     * @param puerto puerto GPIO, eg: P1
     * @param estado ON (0) u OFF (1), eg: ON
     */
    //% blockId=ext5_led block="LED Puerto %puerto Estado %estado" color="#fcbb2b" icon="\uf0eb" group="Salidas L5" weight=100
    export function led(puerto: Ext5Puerto, estado: Ext5LedEstado): void {
        pins.digitalWritePin(puertoToGpioPin(puerto), estado);
    }
}
