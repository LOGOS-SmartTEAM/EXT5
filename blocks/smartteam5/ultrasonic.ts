/**
 * Sensor ultrasónico — SmartTEAM5 / subcategoría Sensores L5
 * Origen: ICreateRobot main.ts → ping (blockId sonar_ping)
 */

enum Ext5ObjetoDetectado {
    //% block="Verdadero"
    Verdadero,
    //% block="Falso"
    Falso,
}

namespace ext5_smartteam5 {

    /**
     * Lectura interna del ultrasónico (no visible en la caja de herramientas).
     * @param puerto puerto GPIO, eg: P1
     */
    //% blockId=ext5_ultrasonic_sensor block="Ultrasonido en el pin %puerto" blockHidden=1 color=#fcbb2b
    export function ext5UltrasonicCm(puerto: Ext5Puerto): number {
        return medirUltrasonicoCm(puerto);
    }

    /**
     * Comprueba si la distancia medida indica un objeto en el rango 5–50 cm.
     * @param distancia distancia en cm, eg: ext5UltrasonicCm(Ext5Puerto.P1)
     * @param estado Verdadero = detectado en rango; Falso = fuera de rango
     */
    //% blockId=ext5_ultrasonic_detect block="$distancia detecta objeto %estado" color=#00A4A6 colorSecondary=#fcbb2b group="Sensores L5" weight=0 blockGap=8
    //% distancia.shadow=ext5_ultrasonic_sensor
    export function ext5UltrasonicDetecta(distancia: number, estado: Ext5ObjetoDetectado): boolean {
        const detectado = distancia > 5 && distancia < 50;
        switch (estado) {
            case Ext5ObjetoDetectado.Verdadero:
                return detectado;
            case Ext5ObjetoDetectado.Falso:
                return !detectado;
            default:
                const _exhaustiveCheck: never = estado;
                return _exhaustiveCheck;
        }
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
