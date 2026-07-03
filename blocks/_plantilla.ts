/**
 * PLANTILLA — copia este archivo para crear un bloque nuevo.
 *
 * 1. Edita config/bloques.ts y agrega tu bloque con color, icono, categoría, etc.
 * 2. Copia este archivo a blocks/<categoria>/mi-bloque.ts
 * 3. Sincroniza el encabezado y la línea //% con config/bloques.ts
 * 4. Registra el archivo en pxt.json → "files"
 * 5. Agrega traducciones en _locales/es/ext5-strings.json
 */

namespace ext5_smartteam5 {

    // ─── nombreDelBloque ─────────────────────────────────────────────────────
    // EDITAR: config/bloques.ts → BLOQUES.nombreDelBloque
    // COLOR:     #E63022
    // ICONO:     icons/salidas/mi-bloque.png  (FA: \uf0eb)
    // CATEGORÍA: SMARTTEAM5
    // SUBCATEGORÍA: Salidas L5
    // ─────────────────────────────────────────────────────────────────────────
    /**
     * Descripción del bloque.
     * @param param describe el parámetro, eg: 0
     */
    //% blockId=ext5_ejemplo block="texto del bloque %param" color="#E63022" icon="\uf0eb" group="Salidas L5" weight=50
    export function nombreDelBloque(param: number): void {
        // código del bloque
    }
}
