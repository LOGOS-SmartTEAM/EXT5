/**
 * Sensor ultrasónico — SmartTEAM5 / subcategoría Sensores L5
 * Origen: ICreateRobot main.ts → ping (blockId sonar_ping)
 */

namespace ext5_smartteam5 {

    /**
     * Lee la distancia en cm del sensor ultrasónico conectado al puerto indicado.
     * @param puerto puerto GPIO, eg: Ext5Puerto.P1
     */
    //% blockId=ext5_ultrasonic_sensor block="Ultrasonido en el pin %puerto" group="Sensores L5" weight=0 color=#fcbb2b
    export function ext5UltrasonicCm(puerto: Ext5Puerto): number {
        return medirUltrasonicoCm(puerto);
    }
}

function medirUltrasonicoCm(puerto: Ext5Puerto): number {
    const { trig, echo } = puertoToUltrasonicTrigEcho(puerto);
    const maxCmDistance = 400;

    pins.setPull(trig, PinPullMode.PullNone);
    pins.digitalWritePin(trig, 0);
    control.waitMicros(2);
    pins.digitalWritePin(trig, 1);
    control.waitMicros(10);
    pins.digitalWritePin(trig, 0);

    const d = pins.pulseIn(echo, PulseValue.High, maxCmDistance * 58);
    const distance = d * 34 / 2000;
    return Math.round(distance);
}
