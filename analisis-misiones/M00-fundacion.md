<!-- ═══════════════════════════ INICIO MISIÓN M00 ═══════════════════════════ -->
<!-- Cursor: ejecutá SOLO esta misión. Requiere MD ya ejecutada.
     No pases a M01 hasta cumplir los criterios de la sección 8.

     Esta misión NO implementa ningún bloque de componente. Levanta la
     categoría, el mapeo de puertos y los helpers. Después de M00 la caja de
     herramientas tiene 3 bloques (los de ESPECIAL) y nada más.            -->

# MISIÓN M00 — Fundación de SmartTEAM 5

- **Repo objetivo:** `LOGOS-SmartTEAM/EXT5`
- **Tipo:** infraestructura. **No** implementa bloques de componente.
- **Fuente:** `STV2-PADRE` commit `347acaf` — archivos copiados **literalmente**
- **Depende de:** **MD** (demolición)
- **Prerrequisito de:** las 12 misiones de componente
- **Estado:** ⬜ pendiente

---

## 1. Identidad de la extensión

| Propiedad | Valor |
|---|---|
| **Nombre visible en la caja** | `SmartTEAM 5` (con espacio antes del 5) |
| **Color de la categoría** | `#EF506D` |
| **Icono** | `\uf1b3` (el mismo de PADRE y de EXT4) |
| **Namespace** | `bloques` (el de PADRE) |
| **Prefijo de `blockId`** | `sabana_` (el de PADRE) |
| **Carpeta de bloques** | `blocks/sabana/` (la de PADRE) |
| `weight` de la categoría | `100` |

> El nombre visible sale de la anotación `block=` del namespace, no de `pxt.json`.

### Los 6 groups, en este orden exacto

```
SENSORES · SALIDAS · MOVIMIENTO · MOTORES · PANTALLAS · ESPECIAL
```

Es el orden de PADRE (que tenía 7, sin `VARIABLES`), con `ESPECIAL` al final igual
que en PADRE.

### Alcance: 18 bloques

| Group | Bloques | Misión |
|---|---|---|
| SENSORES | 6 — B01 B03 B05 B06 B08 B09 | M01 M02 M03 M04 M07 M08 |
| SALIDAS | 1 — B13 | M06 |
| MOVIMIENTO | 3 — B21 B22 B23 | M14 |
| MOTORES | 3 — B18 B19 B20 | M11 M13 M15 |
| PANTALLAS | 2 — B16 B17 | M16 |
| ESPECIAL | 3 — Morse | ya está (MD) |

Quedan **fuera** de EXT5: ultrasonido lógico, botón lógico, sensor de suelo,
joystick, tira RGB (×2), LCD (×2), variables de ejemplo (×2), cantidad (×4).

---

## 2. Recrear `blocks/categorias/bloques.ts`

MD borró el directorio `blocks/categorias/`. Recrearlo con este archivo, que es el
de PADRE con los tres valores de identidad cambiados:

```ts
/**
 * Categoría padre SmartTEAM 5 — las subcategorías son groups.
 *
 * Estructura heredada de STV2-PADRE: un solo namespace con groups internos.
 * El group ESPECIAL contiene los bloques de código Morse, único contenido
 * que se conservó de la versión anterior de EXT5.
 */
//% color="#EF506D" icon="\uf1b3" block="SmartTEAM 5" weight=100 groups=['SENSORES', 'SALIDAS', 'MOVIMIENTO', 'MOTORES', 'PANTALLAS', 'ESPECIAL']
namespace bloques {
    //% blockHidden=1
    export function __categoria() { }
}
```

### Diferencias contra PADRE

| | PADRE | EXT5 |
|---|---|---|
| `color` | `#1565C0` | 🔶 **`#EF506D`** |
| `block` | `BLOQUES` | 🔶 **`SmartTEAM 5`** |
| `icon` | `\uf1b3` | `\uf1b3` (igual) |
| `weight` | `100` | `100` (igual) |
| `namespace` | `bloques` | `bloques` (igual) |
| `groups` | 7 | 🔶 **6** (sin `VARIABLES`) |

> ⚠️ `ESPECIAL` tiene que estar escrito **carácter por carácter igual** al
> `group="ESPECIAL"` que MD dejó en `mensaje.ts`. Si difiere (por ejemplo
> `Especial`), MakeCode crea una subcategoría fantasma y los 3 bloques Morse
> desaparecen de la caja de herramientas.

---

## 3. Copiar `blocks/sabana/puertos.ts` — literal de PADRE

**Copiar sin modificar ni una línea** desde `STV2-PADRE/blocks/sabana/puertos.ts`:

```ts
/**
 * Puertos GPIO STV2 — mapeo interno a pines de la micro:bit.
 *
 * ATENCIÓN: el PUERTO 3 de la placa corresponde al pin P8 de la micro:bit,
 * NO al pin P3. Verificado en ORIGINAL/main.ts (p3 = AnalogPin.P8) y en
 * EXT4/blocks/smartteam4/puertos.ts (Ext4Puerto.P4 -> DigitalPin.P8).
 *
 *   PUERTO 0  ->  micro:bit P0
 *   PUERTO 1  ->  micro:bit P1
 *   PUERTO 2  ->  micro:bit P2
 *   PUERTO 3  ->  micro:bit P8   <-- excepción
 */

enum SabanaPuerto {
    //% block="P0"
    P0 = 0,
    //% block="P1"
    P1 = 1,
    //% block="P2"
    P2 = 2,
    //% block="P3"
    P3 = 3,
}

/**
 * Convierte un puerto de la placa al DigitalPin correspondiente.
 * Usar para lectura/escritura digital (botón, LED, hélice).
 */
function puertoToDigitalPin(puerto: SabanaPuerto): DigitalPin {
    switch (puerto) {
        case SabanaPuerto.P0: return DigitalPin.P0
        case SabanaPuerto.P1: return DigitalPin.P1
        case SabanaPuerto.P2: return DigitalPin.P2
        case SabanaPuerto.P3: return DigitalPin.P8
        default: return DigitalPin.P0
    }
}

/**
 * Convierte un puerto de la placa al AnalogPin correspondiente.
 * Usar para lectura analógica (potenciómetro, luz, suelo) y para servo.
 */
function puertoToAnalogPin(puerto: SabanaPuerto): AnalogPin {
    switch (puerto) {
        case SabanaPuerto.P0: return AnalogPin.P0
        case SabanaPuerto.P1: return AnalogPin.P1
        case SabanaPuerto.P2: return AnalogPin.P2
        case SabanaPuerto.P3: return AnalogPin.P8
        default: return AnalogPin.P0
    }
}
```

### Confirmación cruzada del mapeo

El `Ext5Puerto` que MD eliminó mapeaba exactamente igual — verificable en
`_referencia/ext5-puertos-mapeo.txt`:

```
PUERTO 0 → señal P0     PUERTO 2 → señal P2
PUERTO 1 → señal P1     PUERTO 3 → señal P8   <-- coincide
```

✅ **Tres fuentes independientes coinciden** en que el puerto 3 es el pin P8:
ORIGINAL, EXT4 y la EXT5 anterior. El mapeo es correcto.

> El enum viejo usaba valores `1,2,3,4` con etiquetas `P0`–`P3`; el de PADRE usa
> `0,1,2,3` con las mismas etiquetas. **Lo que ve el usuario es idéntico.**

---

## 4. Copiar `blocks/sabana/_util.ts` — literal de PADRE

```ts
/**
 * Utilidades internas compartidas entre bloques STV2.
 * NO contiene bloques visibles.
 */
namespace bloques {

    /**
     * Recorta un valor al rango [min, max].
     */
    export function _clamp(valor: number, min: number, max: number): number {
        if (valor < min) return min
        if (valor > max) return max
        return valor
    }

    /**
     * Recorta un componente de color al rango 0-255.
     * Equivalente a limitRGB() de ORIGINAL/block/rgbLED.ts.
     */
    export function _limit255(valor: number): number {
        return _clamp(Math.round(valor), 0, 255)
    }
}
```

> ℹ️ `_limit255` no tiene consumidor en el alcance de EXT5: su usuario natural era
> la tira RGB, que quedó excluida. **Se copia igual**, por fidelidad literal a
> PADRE y porque M08 (sensor de color) probablemente lo va a necesitar para
> normalizar los canales a 0–255. No borrarlo.

---

## 5. Reemplazar `main.ts`

MD lo dejó con el comentario viejo, que menciona `config/` e `icons/` — dos
directorios que ya no existen. Reemplazar el contenido completo por:

```ts
/**
 * SmartTEAM 5 — extensión MakeCode para micro:bit.
 *
 * Estructura (heredada de STV2-PADRE):
 *   - blocks/categorias/bloques.ts → categoría "SmartTEAM 5" + groups (subcategorías)
 *   - blocks/sabana/               → un archivo .ts por componente
 *
 * Un solo namespace (`bloques`) con groups internos.
 *
 * El group ESPECIAL (código Morse) es el único contenido heredado de la
 * versión 2.0.0 de esta extensión. Todo el resto proviene de STV2-PADRE.
 *
 * Los drivers de referencia de la versión anterior quedaron archivados en
 * _referencia/ (fuera de compilación) — ver misión MD.
 */
```

---

## 6. Reconstruir `pxt.json`

MD lo dejó con 4 archivos. M00 lo lleva al estado base de EXT5.

```json
{
    "name": "ext5",
    "version": "3.0.0",
    "description": "SmartTEAM 5 — extensión MakeCode para micro:bit",
    "license": "MIT",
    "dependencies": {
        "core": "*"
    },
    "files": [
        "main.ts",
        "blocks/categorias/bloques.ts",
        "blocks/sabana/_util.ts",
        "blocks/sabana/puertos.ts",
        "blocks/sabana/mensaje.ts",
        "main.blocks",
        "README.md"
    ],
    "testFiles": [
        "test.ts"
    ],
    "public": true,
    "supportedTargets": [
        "microbit"
    ],
    "preferredEditor": "blocksprj"
}
```

### Decisiones tomadas acá

| Campo | Antes | Después | Motivo |
|---|---|---|---|
| `name` | `ext5` | **`ext5`** (sin cambio) | El `name` es el identificador del paquete, no el nombre visible. Cambiarlo rompe la referencia de los proyectos que ya importaron la extensión. El nombre que ve el usuario (`SmartTEAM 5`) sale de `block=` en la categoría. |
| `version` | `2.0.0` | 🔶 **`3.0.0`** | Cambio mayor incompatible: todos los `blockId` cambian de `ext5_*` a `sabana_*`. Los proyectos guardados con la 2.0.0 **no van a ser compatibles**, y el major bump lo comunica. |
| `description` | `SmartTEAM5` | 🔶 **`SmartTEAM 5 — extensión MakeCode para micro:bit`** | consistencia con el nombre nuevo |
| `dependencies` | `core` + **`microphone`** | 🔶 solo **`core`** | Ningún bloque usa el micrófono. `mensaje.ts` usa `input.buttonIsPressed(Button.A)`, que es de `core`. PADRE solo declara `core`. Quitarlo reduce el binario. |
| `preferredEditor` | `blocksprj` | `blocksprj` (sin cambio) | igual que PADRE |

### Orden del array `files`

El orden **importa** en MakeCode: un archivo solo puede usar tipos declarados en
archivos anteriores. Se respeta el orden de PADRE:

```
main.ts
blocks/categorias/bloques.ts     <- declara el namespace y los groups
blocks/sabana/_util.ts           <- helpers, sin dependencias
blocks/sabana/puertos.ts         <- declara SabanaPuerto y los dos mapeos
blocks/sabana/mensaje.ts         <- ESPECIAL, sin dependencias
...                              <- cada misión de componente inserta acá
main.blocks
README.md
```

> **Cada misión de componente agrega su propio archivo a este array.** M00 no
> agrega entradas de bloques que todavía no existen: eso rompe la compilación.

---

## 7. Lo que M00 NO hace

- ❌ No implementa ningún bloque de componente.
- ❌ No crea archivos vacíos ni stubs para los 15 bloques.
- ❌ No copia `ultrasonido.ts`, `boton.ts`, `potenciometro.ts` ni `luz.ts` — esos
  ya están implementados en PADRE y los copian **M04, M03, M01 y M02**
  respectivamente, cada una con su propio criterio de aceptación.
- ❌ No toca `README.md` (se actualiza al final del proyecto).
- ❌ No borra `_referencia/`.

---

## 8. Criterios de aceptación

- [ ] `blocks/categorias/bloques.ts` existe, con `block="SmartTEAM 5"`,
      `color="#EF506D"`, `icon="\uf1b3"`, `weight=100` y los **6 groups** en el
      orden indicado.
- [ ] El namespace es **`bloques`**.
- [ ] `blocks/sabana/puertos.ts` es **byte a byte idéntico** al de PADRE.
- [ ] `blocks/sabana/_util.ts` es **byte a byte idéntico** al de PADRE.
- [ ] `main.ts` no menciona `config/` ni `icons/`.
- [ ] `pxt.json` tiene `version: 3.0.0`, `dependencies` solo con `core`, y los
      **7 archivos** del array `files`, en ese orden.
- [ ] **El proyecto compila.**
- [ ] En la caja de herramientas aparece **una sola categoría** llamada
      `SmartTEAM 5`, en **rosa/coral `#EF506D`**, con el icono de bloques.
- [ ] Dentro, se ve **una sola subcategoría poblada: `ESPECIAL`**, con los 3
      bloques de código Morse en violeta `#9C27B0`.
- [ ] Los otros 5 groups **no se muestran** (MakeCode oculta los groups vacíos).
      Eso es correcto: se van poblando misión por misión.

### Verificación

```bash
diff blocks/sabana/puertos.ts ../STV2-PADRE/blocks/sabana/puertos.ts
diff blocks/sabana/_util.ts   ../STV2-PADRE/blocks/sabana/_util.ts
grep -n "SmartTEAM 5\|#EF506D\|uf1b3" blocks/categorias/bloques.ts
grep -c "\"blocks/\|main.ts\|main.blocks\|README" pxt.json
```

Los dos `diff` no deben devolver nada.

---

## 9. Riesgos y advertencias

| Riesgo | Detalle / mitigación |
|---|---|
| **`ESPECIAL` mal escrito** | Riesgo principal. Tiene que coincidir exactamente con el `group="ESPECIAL"` de `mensaje.ts`. Si no, los 3 bloques Morse desaparecen sin ningún error de compilación. Es un fallo silencioso. |
| **Agregar al `files` archivos que no existen** | Rompe la compilación con un error poco descriptivo. M00 declara solo los 7 que existen. |
| **Cambiar `name` a `smartteam5`** | Tentador para que coincida con el nombre visible, pero **rompe la referencia** de los proyectos que ya importaron la extensión desde GitHub. El nombre visible ya sale de `block=`. No tocarlo. |
| **"Corregir" el nombre del namespace** | `bloques` suena genérico para una extensión llamada SmartTEAM 5, pero es el de PADRE y la instrucción es fidelidad literal. Renombrarlo obligaría a reescribir los 15 bloques y `mensaje.ts`. No tocarlo. |
| **Espacio en `SmartTEAM 5`** | Con espacio antes del 5, a diferencia del `SmartTEAM5` anterior. Coincide con `SmartTEAM 4` de EXT4. |
| **Borrar `_limit255` por no tener uso** | Se conserva a propósito (ver sección 4). |
| **Quitar `microphone` rompe algo** | Se verificó que ningún archivo lo usa. Si al compilar apareciera un error relacionado, volver a agregarlo y anotarlo. |
| **Los groups vacíos no se ven** | Después de M00 solo se ve `ESPECIAL`. No es un bug: MakeCode oculta groups sin bloques. |

---

<!-- ═══════════════════════════ FIN MISIÓN M00 ═══════════════════════════ -->
<!-- Fin de "MISIÓN M00 — Fundación de SmartTEAM 5". Detenete acá.
     Siguiente: M01 — Potenciómetro (copia literal desde PADRE).            -->
