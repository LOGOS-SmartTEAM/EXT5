/**
 * Categorías disponibles en la caja de herramientas de SmartTEAM4.
 */
type CategoriaId = "SMARTTEAM4";

interface CategoriaConfig {
    /** Namespace TypeScript (no editar salvo que sepas lo que haces) */
    namespace: string;
    /** Nombre visible en la caja de herramientas */
    nombre: CategoriaId | string;
    /** Color hexadecimal del bloque/categoría, ej: #E63022 */
    color: string;
    /** Código Font Awesome para MakeCode, ej: \uf0eb */
    iconoFa: string;
    /** Ruta del icono personalizado en icons/ (referencia visual) */
    iconoArchivo: string;
    /** Orden en la caja de herramientas (mayor = más arriba) */
    weight: number;
    /** Subcategorías (groups) dentro de la categoría, en orden de aparición */
    subcategorias?: string[];
}

interface BloqueConfig {
    /** Color hexadecimal del bloque */
    color: string;
    /** Código Font Awesome para MakeCode */
    iconoFa: string;
    /** Ruta del icono personalizado en icons/ */
    iconoArchivo: string;
    /** Categoría donde aparece el bloque */
    categoria: CategoriaId;
    /** Subcategoría (group) dentro de la categoría */
    subcategoria?: string;
    /** ID único del bloque en MakeCode */
    blockId: string;
    /** Texto del bloque (%param para parámetros) */
    texto: string;
    /** Orden dentro de la subcategoría */
    weight: number;
}
