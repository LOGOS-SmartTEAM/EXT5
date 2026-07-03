/**
 * Variable CANTIDAD — SmartTEAM4 / subcategoría Variables
 */

namespace ext4_smartteam4 {

    let _cantidad = 0;

    /**
     * Asigna un valor a la variable Cantidad.
     * @param valor valor numérico, eg: 0
     */
    //% blockId=ext4_cantidad_set block="Establecer Cantidad a %valor" group="Variables" color=#FF6680 weight=100 blockGap=8
    //% valor.shadow=math_number
    //% valor.defl=0
    export function establecerCantidad(valor: number): void {
        _cantidad = valor;
    }

    /**
     * Devuelve el valor actual de Cantidad.
     */
    //% blockId=ext4_cantidad_get block="Cantidad" group="Variables" color=#FF6680 weight=99 blockGap=8
    export function leerCantidad(): number {
        return _cantidad;
    }

    /**
     * Suma 1 a Cantidad.
     */
    //% blockId=ext4_cantidad_sumar block="Sumar 1" group="Variables" color=#FF6680 weight=98 blockGap=8
    export function sumarCantidad(): void {
        _cantidad += 1;
    }

    /**
     * Resta 1 a Cantidad.
     */
    //% blockId=ext4_cantidad_restar block="Restar 1" group="Variables" color=#FF6680 weight=97 blockGap=8
    export function restarCantidad(): void {
        _cantidad -= 1;
    }
}
