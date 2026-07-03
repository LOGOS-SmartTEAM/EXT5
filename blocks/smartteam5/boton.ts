/**
 * Botón en puerto GPIO — SmartTEAM5 / subcategoría Sensores L5
 * Origen: ICreateRobot main.ts → buttonState
 */

enum Ext5CompareOperator {
    //% block="="
    Eq,
    //% block="≠"
    Neq,
    //% block="<"
    Lt,
    //% block="≤"
    Lte,
    //% block=">"
    Gt,
    //% block="≥"
    Gte,
}

namespace ext5_smartteam5 {

    /**
     * Lectura interna del botón (no visible en la caja de herramientas).
     */
    //% blockId=ext5_button_sensor block="BOTÓN en el puerto %puerto" blockHidden=1 color=#fcbb2b
    export function ext5BotonEnPin(puerto: Ext5Puerto): number {
        return pins.digitalReadPin(puertoToGpioPin(puerto));
    }

    /**
     * Compara la lectura del botón con un valor numérico.
     * @param reading lectura del botón, eg: ext5BotonEnPin(Ext5Puerto.P1)
     * @param op operador de comparación
     * @param value valor a comparar, eg: 0
     */
    //% blockId=ext5_button_compare block="$reading $op $value" color=#00A4A6 colorSecondary=#fcbb2b group="Sensores L5" weight=0 blockGap=8
    //% reading.shadow=ext5_button_sensor
    //% value.shadow=math_number
    //% value.defl=0
    export function ext5BotonComparar(reading: number, op: Ext5CompareOperator, value: number): boolean {
        return compareValues(reading, op, value);
    }
}

function compareValues(left: number, op: Ext5CompareOperator, right: number): boolean {
    switch (op) {
        case Ext5CompareOperator.Eq: return left == right;
        case Ext5CompareOperator.Neq: return left != right;
        case Ext5CompareOperator.Lt: return left < right;
        case Ext5CompareOperator.Lte: return left <= right;
        case Ext5CompareOperator.Gt: return left > right;
        case Ext5CompareOperator.Gte: return left >= right;
        default:
            const _exhaustiveCheck: never = op;
            return _exhaustiveCheck;
    }
}
