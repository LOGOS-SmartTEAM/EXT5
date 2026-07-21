/**
 * Puertos GPIO SmartTEAM5 — mapeo interno a pines de la micro:bit
 *
 * PUERTO 0 (P1) → señal P0  | trig P0,  echo P13
 * PUERTO 1 (P2) → señal P1  | trig P1,  echo P14
 * PUERTO 2 (P3) → señal P2  | trig P2,  echo P15
 * PUERTO 3 (P4) → señal P8  | trig P8,  echo P7
 */

enum Ext5Puerto {
    //% block="P0"
    P1 = 1,
    //% block="P1"
    P2 = 2,
    //% block="P2"
    P3 = 3,
    //% block="P3"
    P4 = 4,
}

function puertoToGpioPin(puerto: Ext5Puerto): DigitalPin {
    switch (puerto) {
        case Ext5Puerto.P1: return DigitalPin.P0;
        case Ext5Puerto.P2: return DigitalPin.P1;
        case Ext5Puerto.P3: return DigitalPin.P2;
        case Ext5Puerto.P4: return DigitalPin.P8;
        default:
            const _exhaustiveCheck: never = puerto;
            return _exhaustiveCheck;
    }
}

function puertoToAnalogPin(puerto: Ext5Puerto): AnalogPin {
    switch (puerto) {
        case Ext5Puerto.P1: return AnalogPin.P0;
        case Ext5Puerto.P2: return AnalogPin.P1;
        case Ext5Puerto.P3: return AnalogPin.P2;
        case Ext5Puerto.P4: return AnalogPin.P8;
        default:
            const _exhaustiveCheck: never = puerto;
            return _exhaustiveCheck;
    }
}
