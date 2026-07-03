/**
 * Bloque LED — SmartTEAM4 / subcategoría Salidas
 */

enum Ext4LedEstado {
    //% block="ON"
    ON = 0,
    //% block="OFF"
    OFF = 1,
}

namespace ext4_smartteam4 {

    /**
     * Escribe el estado del LED en el puerto GPIO indicado.
     * @param puerto puerto GPIO, eg: P1
     * @param estado ON (0) u OFF (1), eg: ON
     */
    //% blockId=ext4_led block="LED Puerto %puerto Estado %estado" color="#fcbb2b" icon="\uf0eb" group="Salidas" weight=100
    export function led(puerto: Ext4Puerto, estado: Ext4LedEstado): void {
        pins.digitalWritePin(puertoToGpioPin(puerto), estado);
    }
}
