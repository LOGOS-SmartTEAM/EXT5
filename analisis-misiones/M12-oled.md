<!-- ═══════════════════════════ INICIO MISIÓN M12 ═══════════════════════════ -->
<!-- Cursor: ejecutá SOLO esta misión. Requiere M00 y MD (necesita _referencia/).
     ES LA ÚLTIMA MISIÓN.

     ⚠️ NO reescribir el driver a mano. Son 342 líneas, de las cuales ~130 son
     datos de mapa de bits de la fuente. Se COPIA el archivo y se le aplican
     las transformaciones de la sección 4, una por una.                      -->

# MISIÓN M12 — OLED (B16 · B17)

- **Repo objetivo:** `EXT5` · **Archivo a crear:** `blocks/sabana/oled.ts`
- **Diseño:** `STV2-PADRE/blocks/sabana/oled.ts` (hoy son 2 stubs `// TODO`)
- **Código:** `_referencia/ext5-oled.ts` — **342 líneas, se copian**
- **Depende de:** M00, MD (archivado de `_referencia/`)
- **Excepción aplicada:** el enum `SabanaColumna16` **se muda** desde `lcd.ts`
- **Estado:** ⬜ pendiente

---

## 1. Confirmación de CATEGORÍAS, TEXTOS y VARIABLES

### B16 — escribir texto

| Propiedad | Valor |
|---|---|
| `blockId` | `sabana_oled_escribir` |
| **Texto** | `OLED │ Escribir %texto en fila %fila en columna %columna en pin I2C` |
| **Group** | `PANTALLAS` |
| **Color** | `#35BFE9` (I2C) |
| `weight` / `blockGap` | `90` / `8` |
| Forma | acción (`void`) |

| Parámetro | Tipo | Detalle |
|---|---|---|
| `texto` | `string \| number` | `texto.shadow=text` · `texto.defl="abc"` |
| `fila` | `SabanaOledFila` | `0` `1` `2` `3` |
| `columna` | `SabanaColumna16` | `0` … `15` |

### B17 — borrar

| Propiedad | Valor |
|---|---|
| `blockId` | `sabana_oled_borrar` |
| **Texto** | `OLED │ borrar textos en pin I2C` |
| **Group** | `PANTALLAS` |
| **Color** | `#35BFE9` |
| `weight` / `blockGap` | `85` / `8` |
| Parámetros | ninguno |

**Estos son los 2 únicos bloques del group `PANTALLAS`** en EXT5: el LCD quedó fuera
del alcance.

---

## 2. 🚩 Excepción: hay que mudar el enum `SabanaColumna16`

En PADRE, `oled.ts` **no declara** el enum de columnas: lo reutiliza de `lcd.ts`.
El comentario del propio archivo lo dice:

```ts
/**
 * STV2-14 — Escribe texto en el OLED (I2C), fila 0-3, columna 0-15.
 * Reutiliza el enum SabanaColumna16 definido en lcd.ts.
 */
```

**Pero `lcd.ts` está FUERA del alcance de EXT5.** Si se copia el diseño tal cual, el
enum no existe y el archivo no compila.

**Solución:** mudar `SabanaColumna16` desde `lcd.ts` a `oled.ts`, con sus **16
miembros exactamente iguales** (`C0 = 0` … `C15 = 15`, etiquetas `"0"` … `"15"`).

Lo que **no** se muda: `SabanaLcdFila` (el enum de filas del LCD, de 3 miembros).
Ese muere con `lcd.ts`.

> ℹ️ Las etiquetas visibles del desplegable no cambian. Es una mudanza de
> declaración, no un cambio de diseño. Está registrada como excepción en el índice
> maestro.

---

## 3. Qué contiene el driver de EXT5

`_referencia/ext5-oled.ts` — 342 líneas, todas funcionando:

| Tramo | Contenido |
|---|---|
| líneas 1–50 | enums `Ext5OledFila` (F0–F3) y `Ext5OledColumna` (C0–C15) |
| líneas 54–58 | constantes: `OLED_ADDR = 60` (`0x3C`), `OLED_COLS = 16`, `OLED_ROWS = 4`, `CHAR_W = 8`, `CHAR_H = 16` |
| líneas 65–165 | `FONT8x16` — mapa de bits de los caracteres ASCII 32–126 |
| líneas 166–192 | `FONT_EXTRA_CODES` = `[225, 233, 237, 243, 250, 241, 209]` y `FONT_EXTRA` — **acentos españoles: á é í ó ú ñ Ñ** |
| 193, 200 | `oledCmd()`, `oledData()` — capa I2C |
| 211, 232 | `initOled()`, `ensureOledInit()` — **auto-init**, no hace falta bloque de init |
| 236, 248 | `clearOled()`, `clearFila()` |
| 265, 283 | `getCharBitmap()`, `writeChar()` |
| 320, 338 | `showString()`, `clear()` — los dos bloques públicos |

**Es la pieza de código más valiosa de toda la migración.** No existe equivalente en
`original-alex` ni en PADRE, y los acentos españoles están hechos a mano carácter por
carácter.

> ⚠️ **No reescribir a mano.** ~130 de las 342 líneas son valores hexadecimales de
> mapa de bits. Un solo dígito mal y un carácter se dibuja roto. **Se copia el
> archivo y se le aplican las 8 transformaciones de la sección 4.**

---

## 4. Las 8 transformaciones a aplicar

Copiar `_referencia/ext5-oled.ts` a `blocks/sabana/oled.ts` y aplicar **solo esto**:

### T1 — namespace

```
namespace ext5_smartteam5 {      →      namespace bloques {
```

### T2 — enum de filas: renombrar y mover adentro del namespace

El de EXT5 está **fuera** del namespace; el de PADRE está **adentro** y es `export`.

```ts
export enum SabanaOledFila {
    //% block="0"
    F0 = 0,
    //% block="1"
    F1 = 1,
    //% block="2"
    F2 = 2,
    //% block="3"
    F3 = 3,
}
```

Los nombres de miembro (`F0`–`F3`), los valores y las etiquetas **son idénticos** a
los de `Ext5OledFila`. Solo cambia el nombre del enum y su ubicación.

### T3 — enum de columnas: renombrar (y es la mudanza de la sección 2)

`Ext5OledColumna` → **`SabanaColumna16`**, adentro del namespace, con `export`.
Los 16 miembros `C0 = 0` … `C15 = 15` y las etiquetas `"0"` … `"15"` no cambian.

### T4 — reemplazar los dos bloques públicos

Borrar `showString()` y `clear()` de EXT5, con sus anotaciones, y poner:

```ts
    /**
     * STV2-14 — Escribe texto en el OLED (I2C), fila 0-3, columna 0-15.
     *
     * Escribe la fila completa: borra la fila antes de escribir, así que no
     * hace falta limpiar a mano entre actualizaciones.
     *
     * Soporta acentos españoles (á é í ó ú ñ Ñ) gracias a la tabla FONT_EXTRA.
     *
     * El enum SabanaColumna16 se mudó acá desde lcd.ts, que está fuera del
     * alcance de esta extensión. Ver excepción en el índice maestro.
     *
     * Origen del código: _referencia/ext5-oled.ts -> showString()
     *
     * @param texto texto o número a mostrar, eg: "abc"
     * @param fila fila del OLED (0-3), eg: SabanaOledFila.F0
     * @param columna columna del OLED (0-15), eg: SabanaColumna16.C0
     */
    //% blockId=sabana_oled_escribir
    //% block="OLED │ Escribir %texto en fila %fila en columna %columna en pin I2C"
    //% texto.shadow=text texto.defl="abc"
    //% group="PANTALLAS" color="#35BFE9" weight=90 blockGap=8
    export function oledEscribir(texto: string | number, fila: SabanaOledFila, columna: SabanaColumna16): void {
        ensureOledInit()
        clearFila(fila)
        const s = "" + texto
        for (let i = 0; i < s.length; i++) {
            const c = columna + i
            if (c >= OLED_COLS) break
            writeChar(s.charCodeAt(i), fila, c)
        }
    }

    /**
     * STV2-15 — Borra todos los textos del OLED (I2C).
     *
     * Origen del código: _referencia/ext5-oled.ts -> clear()
     */
    //% blockId=sabana_oled_borrar
    //% block="OLED │ borrar textos en pin I2C"
    //% group="PANTALLAS" color="#35BFE9" weight=85 blockGap=8
    export function oledBorrar(): void {
        ensureOledInit()
        clearOled()
    }
```

**El cuerpo de `oledEscribir` es idéntico al `showString` de EXT5.** Lo único que
cambia son el nombre de la función, las anotaciones y los tipos de los parámetros.

### T5 — tipo del parámetro `texto`

EXT5 usa `texto: any`; PADRE usa **`texto: string | number`**. Usar el de PADRE.
El cuerpo (`"" + texto`) funciona igual con los dos.

### T6 — quitar las anotaciones que PADRE no tiene

En EXT5 los bloques traían:

```
//% fila.defl=Ext5OledFila.F0
//% columna.defl=Ext5OledColumna.C0
//% icon="\uf108"
//% weight=10 blockGap=10
```

PADRE **no tiene** los `defl` de los desplegables (el primer miembro es el default
natural), **no tiene** `icon` en el bloque (el icono es de la categoría), y usa
`weight=90 / 85` con `blockGap=8`. **Quitar las cuatro y usar las de PADRE.**

### T7 — dejar intacto todo lo demás

**No tocar**: `OLED_ADDR`, `OLED_COLS`, `OLED_ROWS`, `CHAR_W`, `CHAR_H`, `FONT8x16`,
`FONT_EXTRA_CODES`, `FONT_EXTRA`, `oledCmd`, `oledData`, `initOled`,
`ensureOledInit`, `clearOled`, `clearFila`, `getCharBitmap`, `writeChar`, ni ninguna
variable de estado interna.

Los nombres internos **no llevan prefijo `_`** ni se renombran: son locales al
archivo y no los consume nadie más.

### T8 — verificar que no queden referencias viejas

```bash
grep -n "Ext5\|ext5_smartteam5" blocks/sabana/oled.ts
```

Debe devolver **nada**. Si aparece `Ext5OledFila` o `Ext5OledColumna` en la firma de
alguna función interna (`clearFila`, `writeChar`), cambiar el tipo a `number` o al
enum nuevo según corresponda.

### Insertar en `pxt.json`

Agregar `"blocks/sabana/oled.ts"` **después de** `"blocks/sabana/led.ts"` y **antes
de** `"blocks/sabana/motor_multicolor.ts"`.

---

## 5. Criterios de aceptación

- [ ] Los **2 bloques** aparecen en `SmartTEAM 5 → PANTALLAS`, celeste `#35BFE9`.
- [ ] B16 muestra el texto `OLED │ Escribir "abc" en fila 0 en columna 0 en pin I2C`,
      con el campo de texto precargado con **`abc`**.
- [ ] El desplegable de fila ofrece `0` `1` `2` `3`.
- [ ] El desplegable de columna ofrece `0` … `15`.
- [ ] `grep -n "Ext5\|ext5_smartteam5" blocks/sabana/oled.ts` **no devuelve nada**.
- [ ] `grep -c "SabanaColumna16" blocks/sabana/oled.ts` devuelve al menos 2
      (declaración + uso).
- [ ] El texto se escribe en la pantalla física, en la fila y columna indicadas.
- [ ] ⚠️ **Prueba de acentos:** escribir `"canción ñandú"` debe mostrarse
      **completo y legible**. Si los acentos salen como cajas o basura, la tabla
      `FONT_EXTRA` o `FONT_EXTRA_CODES` se copió mal.
- [ ] Escribir en las 4 filas funciona, y cada fila **se borra sola** antes de
      escribir (escribir un texto corto sobre uno largo no deja restos).
- [ ] Escribir en la columna 14 un texto de 5 caracteres **no rompe nada**: se corta
      en el borde de la pantalla.
- [ ] B17 borra toda la pantalla.
- [ ] **La primera llamada inicializa el OLED sola**, sin bloque de init.
- [ ] Números: `oledEscribir(42, ...)` muestra `42`.
- [ ] El proyecto compila.

### Prueba

```ts
bloques.oledEscribir("Hola mundo", bloques.SabanaOledFila.F0, bloques.SabanaColumna16.C0)
bloques.oledEscribir("canción ñandú", bloques.SabanaOledFila.F1, bloques.SabanaColumna16.C0)
bloques.oledEscribir(42, bloques.SabanaOledFila.F2, bloques.SabanaColumna16.C5)
basic.pause(5000)
bloques.oledBorrar()
```

---

## 6. Riesgos

| Riesgo | Detalle / mitigación |
|---|---|
| **🔴 Reescribir el driver a mano** | Riesgo principal. ~130 líneas son datos hexadecimales de mapa de bits. Un dígito mal y un carácter se dibuja roto, y encontrarlo después es carísimo. **Copiar el archivo y transformar.** |
| **Perder la tabla de acentos** | `FONT_EXTRA` es trabajo hecho a mano que no existe en ninguna otra extensión. Si se pierde, hay que rehacer 7 caracteres bitmap por bitmap. |
| **Olvidar mudar `SabanaColumna16`** | El archivo no compila, porque `lcd.ts` no existe en EXT5. Sección 2. |
| **Mudar también `SabanaLcdFila`** | No va: es el enum de 3 filas del LCD, que está fuera del alcance. El OLED tiene 4 filas y su propio enum. |
| **Dejar los `defl` de los desplegables** | PADRE no los tiene. Funcionalmente casi no cambia (el primer miembro ya es el default), pero el objetivo es fidelidad literal. |
| **Dejar el `icon="\uf108"`** | El icono corresponde a la categoría, no al bloque. PADRE no lo pone. |
| **Cambiar `texto: any` por algo más estricto que `string \| number`** | El cuerpo hace `"" + texto`. Con un tipo más estricto, pasar un booleano deja de compilar sin necesidad. |
| **Bus I2C compartido** | El OLED (`0x3C`) comparte bus con el color (`0x10`), el ultrasónico (`0x23`), el DHT11 (no, es GPIO) y los motores (`0x51`–`0x54`). Sin colisión de direcciones, pero si el ultrasónico o el color se leen dentro de un `forever` sin pausa, la escritura en el OLED se ve lenta o entrecortada. No es un bug del OLED. |
| **`clearFila` en cada escritura** | Cada llamada borra la fila completa antes de escribir. Es lo que hace EXT5 y evita restos, pero significa que **no se puede escribir dos textos en la misma fila** con dos llamadas: el segundo borra el primero. Documentar en el manual del alumno. |

---

<!-- ═══════════════════════════ FIN MISIÓN M12 ═══════════════════════════ -->
<!-- Fin de M12. Es la ÚLTIMA misión.
     Al terminar, verificar el estado final de pxt.json contra la sección 5
     del índice maestro (00-INDICE.md): 19 entradas en el array files y
     18 bloques en la caja de herramientas.                                 -->
