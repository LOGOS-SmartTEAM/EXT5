<!-- ═══════════════════════════ INICIO MISIÓN MD ═══════════════════════════ -->
<!-- Cursor: ejecutá SOLO esta misión. Es la PRIMERA de todas y no depende de
     ninguna otra. No pases a M00 hasta cumplir los criterios de la sección 7.

     Esta misión BORRA. No escribe lógica de bloques nueva.
     Conserva UN SOLO archivo de bloques: blocks/smartteam5/mensaje.ts        -->

# MISIÓN MD — Demolición total de EXT5

- **Repo objetivo:** `LOGOS-SmartTEAM/EXT5`
- **Tipo:** eliminación. **No** implementa bloques.
- **Depende de:** nada. Primera misión.
- **Prerrequisito de:** M00 y de todas las misiones de componente.
- **Estado:** ⬜ pendiente

---

## 1. Objetivo y regla única

> **EXT5 pasa a ser una réplica de `STV2-PADRE`, más la categoría ESPECIAL.**
>
> De todo lo que existe hoy en EXT5 **se conserva exactamente una cosa**: los
> tres bloques de código Morse. Todo el resto del diseño (categoría, colores,
> textos, groups, nombres de archivo, namespace, `blockId`) se descarta y se
> reemplaza por el de PADRE.

### ⚠️ Descartar el diseño NO es descartar los drivers

Varios archivos de EXT5 contienen **código que funciona y que no existe en
PADRE**: el protocolo de un hilo del DHT11, el driver OLED de 342 líneas con
acentos españoles, el puente H de la hélice, y las constantes físicas del robot.

**Antes de borrar, esos archivos se archivan como referencia** (sección 3). Las
misiones de componente los van a necesitar como fuente del código. Lo que se
descarta es su **presentación**, no su lógica.

---

## 2. Inventario de lo que se ELIMINA

### 2.1 Archivos de bloques — se borran 12 de 13

| Archivo | Bloques que contiene | Se borra porque |
|---|---|---|
| `blocks/categorias/smartteam5.ts` | categoría | se reemplaza por la de PADRE (M00) |
| `blocks/categorias/motores.ts` | — | namespace `ext4_`, no compilaba |
| `blocks/categorias/pantallas.ts` | — | namespace `ext4_`, no compilaba |
| `blocks/smartteam5/puertos.ts` | enum `Ext5Puerto` | se reemplaza por `SabanaPuerto` de PADRE |
| `blocks/smartteam5/boton.ts` | `ext5_button_sensor` | PADRE ya lo tiene implementado |
| `blocks/smartteam5/ultrasonic.ts` | `ext5_ultrasonic_sensor` | PADRE ya lo tiene implementado |
| `blocks/smartteam5/Sensor_Luz.ts` | `ext5_luz_sensor` | PADRE ya lo tiene implementado |
| `blocks/smartteam5/potenciometro.ts` | `ext5_potenciometro_sensor` | PADRE ya lo tiene implementado |
| `blocks/smartteam5/DTH11.ts` | `ext5_dht11` | 🔶 **archivar primero** — driver 1 hilo |
| `blocks/smartteam5/LED.ts` | `ext5_led` | driver trivial, se reescribe |
| `blocks/smartteam5/Servo.ts` | `ext5_servo_posicionar` | 🔶 **archivar primero** |
| `blocks/smartteam5/helice.ts` | `ext5_helice` | 🔶 **archivar primero** — puente H |
| `blocks/smartteam5/motorUnico.ts` | `ext5_motor_unico` | 🔶 **archivar primero** |
| `blocks/smartteam5/motores.ts` | `ext5_motor_move`, `_cm`, `_girar` | 🔶 **archivar primero** — constantes físicas |
| `blocks/smartteam5/oled.ts` | `ext5_oled_show_text`, `_clear` | 🔶 **archivar primero** — 342 líneas |
| `blocks/_plantilla.ts` | — | andamio, no compilaba |

**13 bloques eliminados** de los 16 actuales.

### 2.2 🔴 Archivos de traducción — los más peligrosos

```
_locales/es/ext5-strings.json          (2913 bytes)
_locales/es/ext5-jsdoc-strings.json    (1621 bytes)
```

Están declarados en `pxt.json`, o sea que **sí compilan**. Contienen la traducción
al español de todos los textos actuales:

```json
{
    "{id:category}ext5_smartteam5": "SmartTEAM5",
    "ext5_smartteam5.ext5MotoresMover|block": "Motores %movimiento ||  Velocidad %velocidad",
    "Ext5MovimientoMotores.Avanzar|block": "Avanzar",
    ...
}
```

**En MakeCode el locale tiene PRIORIDAD sobre la anotación `//% block=`.** Con el
editor en español, los textos que se ven salen de este JSON, no del `.ts`.

Si sobreviven, las misiones posteriores van a cambiar los textos en el código y la
caja de herramientas va a seguir mostrando los viejos. Va a parecer que las
misiones no se aplicaron, y el error va a buscarse en el lugar equivocado.

**Borrar los dos archivos, borrar `_locales/`, y quitar las dos entradas de
`pxt.json`.** Los textos de PADRE ya están en español en las anotaciones; no hace
falta ningún locale.

### 2.3 Configuración documental, código archivado, iconos

```
config/bloques.ts        config/categorias.ts
config/puertos.ts        config/tipos.ts
archivadas/motores-original.ts
archivadas/oled-original.ts
icons/entradas/.gitkeep  icons/motores/.gitkeep
icons/pantallas/.gitkeep icons/salidas/.gitkeep
```

Ninguno está en `pxt.json`: no compilan. `config/` describe el diseño de
SmartTEAM4 y va a contradecir el de PADRE. `archivadas/` es código de SmartTEAM4
con comentarios en chino del proveedor. `icons/` está vacío y la categoría usa un
icono de FontAwesome.

Borrar los tres directorios completos.

> ℹ️ El historial de git preserva todo. Borrar no pierde información.

---

## 3. 🔶 Archivado previo obligatorio

**Antes de borrar nada**, crear el directorio `_referencia/` en la raíz y copiar
ahí los 6 archivos cuyo código van a necesitar las misiones de componente:

```
_referencia/ext5-DTH11.ts        <- de blocks/smartteam5/DTH11.ts
_referencia/ext5-Servo.ts        <- de blocks/smartteam5/Servo.ts
_referencia/ext5-helice.ts       <- de blocks/smartteam5/helice.ts
_referencia/ext5-motorUnico.ts   <- de blocks/smartteam5/motorUnico.ts
_referencia/ext5-motores.ts      <- de blocks/smartteam5/motores.ts
_referencia/ext5-oled.ts         <- de blocks/smartteam5/oled.ts
```

**Y también copiar el mapeo de pines** de `blocks/smartteam5/puertos.ts` a
`_referencia/ext5-puertos-mapeo.txt`:

```
PUERTO 0 (P1) → señal P0  | trig P0,  echo P13
PUERTO 1 (P2) → señal P1  | trig P1,  echo P14
PUERTO 2 (P3) → señal P2  | trig P2,  echo P15
PUERTO 3 (P4) → señal P8  | trig P8,  echo P7
```

> 🚩 Ese mapeo **no es decorativo**. Los pines de la columna "echo"
> (`P13/P14/P15/P7`) son exactamente los que `helice.ts` usa como segundo pin de
> control (IN2) del puente H. Sin esa tabla, el código de la hélice queda sin
> explicación posible y nadie va a poder verificarlo.

**`_referencia/` NO se agrega al array `files` de `pxt.json`.** Es documentación,
no código compilado. Se puede borrar una vez que las 12 misiones estén cerradas.

---

## 4. Lo único que se CONSERVA de EXT5

### `blocks/smartteam5/mensaje.ts` — los 3 bloques de código Morse

Se conserva **el archivo completo**: la tabla `CODIGOS_MORSE`, el `ALFABETO`, las
constantes `UMBRAL_PUNTO_MS = 350` y `PAUSA_LETRA_MS = 2000`, las cuatro variables
de estado (`_presionado`, `_tiempo`, `_palabra`, `_mensaje`) y las tres funciones.

| `blockId` | Texto | `weight` | Color |
|---|---|---|---|
| `ext5_mensaje_guardar` | `Guardar mensaje` | 100 | `#9C27B0` |
| `ext5_mensaje_decodificar` | `Decodificar mensaje` | 99 | `#9C27B0` |
| `ext5_mensaje_decodificado` | `Mensaje decodificado` | 98 | `#9C27B0` |

**Todo eso queda intacto**, incluidos los `blockId` con prefijo `ext5_`.

### Los DOS únicos cambios en el archivo

**1. El nombre del group, tres veces:**

```
group="Especiales L5"    →    group="ESPECIAL"
```

**2. El namespace — una vez:**

```ts
namespace ext5_smartteam5 {     →    namespace bloques {
```

> 🚩 **El cambio de namespace es obligatorio, no opcional.** En MakeCode el
> namespace *es* la categoría. Si `mensaje.ts` se queda en `ext5_smartteam5`
> mientras el resto de la extensión vive en `bloques`, la caja de herramientas va
> a mostrar **dos categorías separadas**: "SmartTEAM 5" con todo, y una segunda
> categoría huérfana solo con los 3 bloques Morse.
>
> Esto contradice mínimamente la instrucción de "mantener ESPECIAL tal cual", pero
> es la única forma de que ESPECIAL aparezca como subcategoría dentro de
> SmartTEAM 5. Los textos, colores, IDs y weights sí quedan literalmente iguales.

### Movimiento de archivo

Como toda la extensión pasa a la estructura de PADRE, el archivo se mueve:

```
blocks/smartteam5/mensaje.ts    →    blocks/sabana/mensaje.ts
```

y su entrada en `pxt.json` se actualiza. El directorio `blocks/smartteam5/` queda
vacío y se borra.

---

## 5. Infraestructura del repo

### Se conserva sin tocar

```
LICENSE   .gitignore   .github/workflows/makecode.yml
package.json   package-lock.json   tsconfig.json
main.blocks   misiones.md   Ejemplo_ICreate/code_icrobot.HEX
```

`main.blocks` son 180 bytes y **no referencia ningún `blockId`** — está vacío, no
hay que resetearlo. ✅

`misiones.md` está vacío (0 bytes) — es donde van a vivir estas misiones.

### Se vacía

**`test.ts`** — hoy contiene:

```ts
ext5_smartteam5.led(Ext5Puerto.P4, Ext5LedEstado.OFF)
basic.pause(1000)
ext5_smartteam5.led(Ext5Puerto.P4, Ext5LedEstado.ON)
```

Las tres referencias (`ext5_smartteam5`, `Ext5Puerto`, `Ext5LedEstado`) dejan de
existir. **Dejar solo el comentario de cabecera:**

```ts
// tests go here; this will not be compiled when this package is used as an extension.
```

### Se reescribe en M00, no acá

**`main.ts`** — solo tiene un comentario, pero menciona rutas que se borran
(`config/categorias.ts`, `config/bloques.ts`, `icons/`). **Dejarlo como está en
esta misión.** M00 lo reemplaza por el de PADRE.

**`README.md`** — menciona la URL `bscelza-logos/SmartTEAM_ext5` y la versión
`2.0.0`. Fuera de alcance de la demolición; se actualiza al final.

---

## 6. Cambios en `pxt.json`

Esta misión hace **solo dos cosas** en `pxt.json`:

1. **Quitar** las dos entradas de `_locales`.
2. **Cambiar la ruta** de `mensaje.ts`.

**Antes:**
```json
"files": [
    "main.ts",
    "blocks/categorias/smartteam5.ts",
    "blocks/smartteam5/puertos.ts",
    "blocks/smartteam5/boton.ts",
    "blocks/smartteam5/ultrasonic.ts",
    "blocks/smartteam5/Sensor_Luz.ts",
    "blocks/smartteam5/potenciometro.ts",
    "blocks/smartteam5/LED.ts",
    "blocks/smartteam5/Servo.ts",
    "blocks/smartteam5/motores.ts",
    "blocks/smartteam5/motorUnico.ts",
    "blocks/smartteam5/helice.ts",
    "blocks/smartteam5/DTH11.ts",
    "blocks/smartteam5/oled.ts",
    "blocks/smartteam5/mensaje.ts",
    "main.blocks",
    "README.md",
    "_locales/es/ext5-strings.json",
    "_locales/es/ext5-jsdoc-strings.json"
]
```

**Después de MD:**
```json
"files": [
    "main.ts",
    "blocks/sabana/mensaje.ts",
    "main.blocks",
    "README.md"
]
```

> ⚠️ **Después de MD el proyecto queda con UNA SOLA categoría y 3 bloques.** Eso
> es correcto y esperado: es un solar vacío con los cimientos de ESPECIAL. M00
> reconstruye la categoría y las misiones de componente van poblando los groups.
>
> **No** tocar en esta misión: `name`, `version`, `description`, `dependencies`,
> `preferredEditor`. Todo eso es M00.

### Sobre `dependencies`

`pxt.json` declara hoy `"microphone": "*"`. **Ningún bloque lo usa** — `mensaje.ts`
usa `input.buttonIsPressed(Button.A)`, que es de `core`. PADRE solo declara `core`.
**No quitarlo en esta misión**, para no mezclar cambios: se resuelve en M00.

---

## 7. Criterios de aceptación

- [ ] `_referencia/` existe y contiene los 6 `.ts` archivados **más**
      `ext5-puertos-mapeo.txt`.
- [ ] `_referencia/` **no** está en el array `files` de `pxt.json`.
- [ ] `blocks/sabana/mensaje.ts` existe, con namespace **`bloques`** y
      `group="ESPECIAL"` en los 3 bloques. Todo lo demás del archivo idéntico.
- [ ] `blocks/smartteam5/` **no existe**.
- [ ] `blocks/categorias/` **no existe**.
- [ ] `config/`, `archivadas/`, `icons/`, `_locales/` **no existen**.
- [ ] `blocks/_plantilla.ts` **no existe**.
- [ ] `test.ts` solo tiene el comentario de cabecera.
- [ ] `pxt.json` lista exactamente 4 archivos en `files` y **no menciona
      `_locales` ni `smartteam5`**.
- [ ] `grep -rn "ext4_\|ext5_smartteam5\|Ext5Puerto\|Ext5LedEstado" --include=*.ts --include=*.json .`
      (excluyendo `.git` y `_referencia/`) **no devuelve nada**.
- [ ] **El proyecto compila.**
- [ ] En la caja de herramientas queda **una categoría con 3 bloques**: los de
      código Morse, bajo la subcategoría `ESPECIAL`.

### Verificación

```bash
find . -path ./.git -prune -o -type f -print | sort
grep -rn "ext4_\|ext5_smartteam5\|Ext5Puerto\|Ext5LedEstado" \
     --include=*.ts --include=*.json . | grep -v _referencia
grep -n "_locales\|smartteam5" pxt.json
```

Los dos últimos no deben devolver nada.

---

## 8. Riesgos y advertencias

| Riesgo | Detalle / mitigación |
|---|---|
| **🔴 Dejar los `_locales`** | Riesgo principal. Si sobreviven, TODAS las misiones posteriores parecen no funcionar. Verificar con `grep -n "_locales" pxt.json`. |
| **🔴 Borrar sin archivar** | Los 6 archivos de la sección 3 contienen los únicos drivers existentes para DHT11, OLED, hélice con dirección, motor único y movimiento del robot. Si se borran sin copiar a `_referencia/`, hay que recuperarlos del historial de git y eso ralentiza las 8 misiones que los necesitan. **Archivar primero, borrar después.** |
| **Perder el mapeo trig/echo** | Sección 3. Sin esa tabla no se puede verificar de dónde salen los pines IN2 del puente H de la hélice. |
| **No cambiar el namespace de `mensaje.ts`** | Si queda en `ext5_smartteam5`, aparecen dos categorías separadas y ESPECIAL no cuelga de SmartTEAM 5. |
| **Nombre del group distinto de `ESPECIAL`** | Tiene que coincidir **carácter por carácter** con lo que M00 declare en `groups=[...]`, mayúsculas incluidas. Si no, MakeCode crea una subcategoría fantasma y los 3 bloques Morse desaparecen de la caja. |
| **Cambiar algo más de `mensaje.ts`** | Solo dos cambios: namespace y group. Los `blockId` siguen con prefijo `ext5_` a propósito — son invisibles al usuario y renombrarlos rompería proyectos guardados sin ningún beneficio. |
| **Intentar arreglar `test.ts` en vez de vaciarlo** | El orden de parámetros del LED cambia en M06. Vaciarlo ahora y repoblarlo después es más limpio. |
| **Que el repo quede "roto" a mitad de camino** | Después de MD el proyecto tiene 3 bloques y nada más. Es intencional. No empezar a portar código acá. |

---

<!-- ═══════════════════════════ FIN MISIÓN MD ═══════════════════════════ -->
<!-- Fin de "MISIÓN MD — Demolición total de EXT5". Detenete acá.
     Siguiente: M00 — Fundación (categoría SmartTEAM 5, groups, puertos,
     pxt.json, y copia de los 6 bloques ya implementados en PADRE).        -->
