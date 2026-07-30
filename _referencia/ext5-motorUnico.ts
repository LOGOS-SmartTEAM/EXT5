/**
 * Motor único — SmartTEAM5 / subcategoría Motores L5
 * Controla un solo motor (rojo o verde) por sentido de giro y velocidad, vía I2C.
 * Reutiliza writeMotor() y las direcciones I2C (MOTOR_ROJO, MOTOR_VERDE)
 * ya definidas en blocks/smartteam5/motores.ts (mismo namespace).
 *
 * Convención de sentido:
 * - Izquierda (↰) = antihorario → velocidad interna negativa
 * - Derecha (↱)   = horario     → velocidad interna positiva
 * El parámetro público "velocidad" que ve el usuario siempre es positivo (0-100);
 * el signo interno es solo un detalle de implementación de writeMotor().
 */

namespace ext5_smartteam5 {

    export enum Ext5ColorMotor {
        //% block="🔴"
        Rojo = 1,
        //% block="🟢"
        Verde = 2,
    }

    export enum Ext5MovimientoMotorUnico {
        //% block="↰ Girar a la izquierda"
        Izquierda = 1,
        //% block="Girar a la derecha ↱"
        Derecha = 2,
        //% block="Frenar"
        Frenar = 3,
    }

    function colorToAddress(color: Ext5ColorMotor): number {
        switch (color) {
            case Ext5ColorMotor.Rojo: return MOTOR_ROJO
            case Ext5ColorMotor.Verde: return MOTOR_VERDE
            default:
                const _exhaustiveCheck: never = color
                return _exhaustiveCheck
        }
    }

    // velocidad SIEMPRE llega positiva (0-100) desde el bloque.
    // Izquierda = antihorario -> se niega internamente para writeMotor().
    // Derecha  = horario     -> se mantiene positiva para writeMotor().
    function movimientoToSpeed(movimiento: Ext5MovimientoMotorUnico, velocidad: number): number {
        switch (movimiento) {
            case Ext5MovimientoMotorUnico.Izquierda: return -velocidad  // antihorario
            case Ext5MovimientoMotorUnico.Derecha: return velocidad     // horario
            case Ext5MovimientoMotorUnico.Frenar: return 0
            default:
                const _exhaustiveCheck: never = movimiento
                return _exhaustiveCheck
        }
    }

    /**
     * Gira (o frena) un único motor, elegido por color, en el sentido y velocidad indicados.
     * @param color motor a controlar, eg: Ext5ColorMotor.Rojo
     * @param movimiento sentido de giro o freno, eg: Ext5MovimientoMotorUnico.Derecha
     * @param velocidad velocidad de 0 a 100 (siempre positiva), eg: 50
     */
    //% blockId=ext5_motor_unico
    //% block="MOTOR %color %movimiento en el pin I2C ||  Velocidad %velocidad"
    //% velocidad.min=0 velocidad.max=100 velocidad.defl=50
    //% expandableArgumentMode="toggle"
    //% group="Motores L5" color="#34c2eb" weight=83 blockGap=8
    export function ext5MotorUnico(
        color: Ext5ColorMotor,
        movimiento: Ext5MovimientoMotorUnico,
        velocidad = 50
    ): void {
        const speed = movimientoToSpeed(movimiento, velocidad)
        writeMotor(colorToAddress(color), speed)
    }
}
