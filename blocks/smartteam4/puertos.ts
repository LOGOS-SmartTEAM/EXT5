/**
 * Puertos GPIO SmartTEAM4 — mapeo interno a pines de la micro:bit
 * EDITAR tabla en: config/puertos.ts
 *
 * PUERTO 1 → P13 + P0   (ultrasonido: trig P13, echo P0; botón/LED: P0)
 * PUERTO 2 → P14 + P1
 * PUERTO 3 → P15 + P2
 * PUERTO 4 → P7  + P8
 * PUERTO 5 → P9  + P12
 * PUERTO 6 → P10 + P16
 */

enum Ext4Puerto {
    //% block="P1"
    P1 = 1,
    //% block="P2"
    P2 = 2,
    //% block="P3"
    P3 = 3,
    //% block="P4"
    P4 = 4,
    //% block="P5"
    P5 = 5,
    //% block="P6"
    P6 = 6,
}

function puertoToGpioPin(puerto: Ext4Puerto): DigitalPin {
    switch (puerto) {
        case Ext4Puerto.P1: return DigitalPin.P0;
        case Ext4Puerto.P2: return DigitalPin.P1;
        case Ext4Puerto.P3: return DigitalPin.P2;
        case Ext4Puerto.P4: return DigitalPin.P8;
        case Ext4Puerto.P5: return DigitalPin.P12;
        case Ext4Puerto.P6: return DigitalPin.P16;
        default:
            const _exhaustiveCheck: never = puerto;
            return _exhaustiveCheck;
    }
}

function puertoToUltrasonicTrigEcho(puerto: Ext4Puerto): { trig: DigitalPin; echo: DigitalPin } {
    switch (puerto) {
        case Ext4Puerto.P1: return { trig: DigitalPin.P13, echo: DigitalPin.P0 };
        case Ext4Puerto.P2: return { trig: DigitalPin.P14, echo: DigitalPin.P1 };
        case Ext4Puerto.P3: return { trig: DigitalPin.P15, echo: DigitalPin.P2 };
        case Ext4Puerto.P4: return { trig: DigitalPin.P7, echo: DigitalPin.P8 };
        case Ext4Puerto.P5: return { trig: DigitalPin.P9, echo: DigitalPin.P12 };
        case Ext4Puerto.P6: return { trig: DigitalPin.P10, echo: DigitalPin.P16 };
        default:
            const _exhaustiveCheck: never = puerto;
            return _exhaustiveCheck;
    }
}
