/**
 * Botón en puerto GPIO — SmartTEAM5 / subcategoría Sensores L5
 * Origen: ICreateRobot main.ts → buttonState
 */

namespace ext5_smartteam5 {

    /**
     * Lee el valor del botón conectado al puerto indicado.
     * @param puerto puerto GPIO, eg: Ext5Puerto.P1
     */
    //% blockId=ext5_button_sensor block="BOTÓN en el puerto %puerto" group="Sensores L5" weight=0 color=#fcbb2b
    export function ext5BotonEnPin(puerto: Ext5Puerto): number {
        const pin = puertoToGpioPin(puerto)
        pins.setPull(pin, PinPullMode.PullUp)
        return 1 - pins.digitalReadPin(pin)
    }
}
