/**
 * Sensor ultrasónico — SmartTEAM4 / subcategoría Sensores
 * Origen: ICreateRobot main.ts → ping (blockId sonar_ping)
 */

enum Ext4ObjetoDetectado {
    //% block="Verdadero"
    Verdadero,
    //% block="Falso"
    Falso,
}

namespace ext4_smartteam4 {

    /**
     * Lectura interna del ultrasónico (no visible en la caja de herramientas).
     * @param puerto puerto GPIO, eg: P1
     */
    //% blockId=ext4_ultrasonic_sensor block="Ultrasonido en el pin %puerto" blockHidden=1 color=#fcbb2b
    export function ext4UltrasonicCm(puerto: Ext4Puerto): number {
        return medirUltrasonicoCm(puerto);
    }

    /**
     * Comprueba si la distancia medida indica un objeto en el rango 5–50 cm.
     * @param distancia distancia en cm, eg: ext4UltrasonicCm(Ext4Puerto.P1)
     * @param estado Verdadero = detectado en rango; Falso = fuera de rango
     */
    //% blockId=ext4_ultrasonic_detect block="$distancia detecta objeto %estado" color=#00A4A6 colorSecondary=#fcbb2b group="Sensores" weight=0 blockGap=8
    //% distancia.shadow=ext4_ultrasonic_sensor
    export function ext4UltrasonicDetecta(distancia: number, estado: Ext4ObjetoDetectado): boolean {
        const detectado = distancia > 5 && distancia < 50;
        switch (estado) {
            case Ext4ObjetoDetectado.Verdadero:
                return detectado;
            case Ext4ObjetoDetectado.Falso:
                return !detectado;
            default:
                const _exhaustiveCheck: never = estado;
                return _exhaustiveCheck;
        }
    }
}

function medirUltrasonicoCm(puerto: Ext4Puerto): number {
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
