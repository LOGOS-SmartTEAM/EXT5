/**
 * Botón en puerto GPIO — SmartTEAM4 / subcategoría Sensores
 * Origen: ICreateRobot main.ts → buttonState
 */

enum Ext4CompareOperator {
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

namespace ext4_smartteam4 {

    /**
     * Lectura interna del botón (no visible en la caja de herramientas).
     */
    //% blockId=ext4_button_sensor block="BOTÓN en el puerto %puerto" blockHidden=1 color=#fcbb2b
    export function ext4BotonEnPin(puerto: Ext4Puerto): number {
        return pins.digitalReadPin(puertoToGpioPin(puerto));
    }

    /**
     * Compara la lectura del botón con un valor numérico.
     * @param reading lectura del botón, eg: ext4BotonEnPin(Ext4Puerto.P1)
     * @param op operador de comparación
     * @param value valor a comparar, eg: 0
     */
    //% blockId=ext4_button_compare block="$reading $op $value" color=#00A4A6 colorSecondary=#fcbb2b group="Sensores" weight=0 blockGap=8
    //% reading.shadow=ext4_button_sensor
    //% value.shadow=math_number
    //% value.defl=0
    export function ext4BotonComparar(reading: number, op: Ext4CompareOperator, value: number): boolean {
        return compareValues(reading, op, value);
    }
}

function compareValues(left: number, op: Ext4CompareOperator, right: number): boolean {
    switch (op) {
        case Ext4CompareOperator.Eq: return left == right;
        case Ext4CompareOperator.Neq: return left != right;
        case Ext4CompareOperator.Lt: return left < right;
        case Ext4CompareOperator.Lte: return left <= right;
        case Ext4CompareOperator.Gt: return left > right;
        case Ext4CompareOperator.Gte: return left >= right;
        default:
            const _exhaustiveCheck: never = op;
            return _exhaustiveCheck;
    }
}
