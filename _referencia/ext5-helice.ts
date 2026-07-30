/**
 * Hélice — SmartTEAM5 / subcategoría Salidas L5
 * Control de dirección por 2 pines digitales (sin PWM/velocidad), igual que el
 * ejemplo de referencia en Arduino (digitalWrite HIGH/LOW).
 * Reutiliza el enum Ext5MovimientoMotorUnico definido en motorUnico.ts (Misión 9).
 *
 * IN2 reutiliza el pin "trig" documentado en config/puertos.ts, libre desde que
 * el ultrasónico pasó a I2C (Misión 6). Confirmar en hardware real.
 */

namespace ext5_smartteam5 {

    // Segundo pin de control por puerto (IN2). IN1 reutiliza puertoToGpioPin().
    function puertoToHeliceIn2(puerto: Ext5Puerto): DigitalPin {
        switch (puerto) {
            case Ext5Puerto.P1: return DigitalPin.P13
            case Ext5Puerto.P2: return DigitalPin.P14
            case Ext5Puerto.P3: return DigitalPin.P15
            case Ext5Puerto.P4: return DigitalPin.P7
            default:
                const _exhaustiveCheck: never = puerto
                return _exhaustiveCheck
        }
    }

    /**
     * Gira la hélice hacia la izquierda o derecha, o la frena, en el puerto indicado.
     * @param movimiento sentido de giro o freno, eg: Ext5MovimientoMotorUnico.Derecha
     * @param puerto puerto GPIO, eg: Ext5Puerto.P1
     */
    //% blockId=ext5_helice
    //% block="HELICE %movimiento en el puerto %puerto"
    //% group="Salidas L5" color=#fcbb2b weight=70 blockGap=8
    export function ext5Helice(movimiento: Ext5MovimientoMotorUnico, puerto: Ext5Puerto): void {
        const in1 = puertoToGpioPin(puerto)
        const in2 = puertoToHeliceIn2(puerto)

        switch (movimiento) {
            case Ext5MovimientoMotorUnico.Izquierda:
                pins.digitalWritePin(in1, 0)
                pins.digitalWritePin(in2, 1)
                break
            case Ext5MovimientoMotorUnico.Derecha:
                pins.digitalWritePin(in1, 1)
                pins.digitalWritePin(in2, 0)
                break
            case Ext5MovimientoMotorUnico.Frenar:
                pins.digitalWritePin(in1, 0)
                pins.digitalWritePin(in2, 0)
                break
            default:
                const _exhaustiveCheck: never = movimiento
        }
    }
}
