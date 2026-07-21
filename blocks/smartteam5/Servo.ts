/**
 * Servo — SmartTEAM5 / subcategoría Salidas L5
 * Posiciona un servomotor por ángulo, usando la API nativa de micro:bit
 * (pins.servoWritePin) sobre el pin analógico del puerto indicado.
 */

namespace ext5_smartteam5 {

    /**
     * Posiciona el servo conectado al puerto indicado en el ángulo especificado.
     * @param grado ángulo de 0 a 180 grados, eg: 90
     * @param puerto puerto GPIO, eg: Ext5Puerto.P1
     */
    //% blockId=ext5_servo_posicionar
    //% block="Posicionar en el grado %grado el SERVO en el pin %puerto"
    //% grado.min=0 grado.max=180 grado.defl=90
    //% group="Salidas L5" color=#fcbb2b weight=65 blockGap=8
    export function ext5ServoPosicionar(grado: number, puerto: Ext5Puerto): void {
        pins.servoWritePin(puertoToAnalogPin(puerto), grado)
    }
}
