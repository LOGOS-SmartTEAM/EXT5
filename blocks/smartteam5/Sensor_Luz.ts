/**
 * Sensor de LUZ en puerto GPIO — SmartTEAM5 / subcategoría Sensores L5
 * Lectura ANALÓGICA. Usa el mismo pin físico por puerto que el botón.
 * ADVERTENCIA: los puertos P4, P5 y P6 usan pines sin ADC real (P8, P12, P16).
 * Verificar en hardware real antes de confiar en la lectura en esos puertos.
 */

namespace ext5_smartteam5 {

    /**
     * Lee el valor analógico del sensor de luz conectado al puerto indicado.
     * @param puerto puerto GPIO, eg: Ext5Puerto.P1
     */
    //% blockId=ext5_luz_sensor block="LUZ en el pin %puerto" group="Sensores L5" weight=0 color=#fcbb2b
    export function ext5LuzEnPin(puerto: Ext5Puerto): number {
        return pins.analogReadPin(puertoToAnalogPin(puerto));
    }
}
