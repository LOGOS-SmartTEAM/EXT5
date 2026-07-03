# EXT4 - SmartTEAM4

Extensión MakeCode para SmartTEAM4 (micro:bit).

## Uso como extensión

1. Abre [makecode.microbit.org](https://makecode.microbit.org/)
2. Crea un **Nuevo proyecto**
3. Ve a **Extensiones** (icono de engranaje)
4. Pega la URL del repositorio de GitHub:
   `https://github.com/bscelza-logos/SmartTEAM_ext4`
5. Confirma la importación (versión actual: **2.0.0**)

### Actualizar la extensión en un proyecto existente

MakeCode puede cachear extensiones importadas desde GitHub. Si no ves los bloques nuevos:

1. Eliminá la extensión **ext4** en **Extensiones**.
2. Volvé a importar la URL de GitHub.
3. Confirmá que la versión sea **2.0.0**.

## Simulador y conexión USB

**El simulador y WebUSB son cosas distintas.**

| Función | Qué usa | Cuándo |
|---------|---------|--------|
| Simulador (micro:bit virtual) | JavaScript en el navegador | Siempre, sin cable |
| micro:bit físico | WebUSB (MakeCode lo gestiona) | Al descargar o emparejar |

### Si el simulador no carga (spinner infinito)

1. Recarga la página o colapsa y vuelve a abrir el panel del simulador (flecha junto a la barra).
2. Pulsa **Reiniciar** en los controles del simulador.
3. Alterna entre **Bloques** y **JavaScript** para forzar una recarga.
4. Revisa la consola del navegador (F12 → Consola) por errores de compilación.
5. Si estás en red escolar/empresa, pide desbloquear los dominios del simulador MakeCode.

### WebUSB (micro:bit físico) — requisitos

Según la [especificación WebUSB](https://wicg.github.io/webusb/):

- **Contexto seguro**: usar `https://makecode.microbit.org` (HTTPS).
- **Navegador compatible**: Chrome, Edge u Opera (Chrome 61+). Firefox y Safari no soportan WebUSB.
- **Gestión del usuario**: emparejar requiere un clic (MakeCode llama a `requestDevice()`).
- **Cable USB de datos** (no solo carga).
- **Firmware DAPLink** actualizado en la micro:bit.

Esta extensión no implementa WebUSB; lo hace MakeCode al pulsar **Descargar** o **Emparejar**.

## Glosario de nombres (MakeCode)

Para pedir cambios con precisión, usamos esta jerarquía. Ejemplo con una extensión como la de tu captura:

```
Extensión          →  SmartTEAM4
  Categoría        →    SALIDAS
    Subcategoría   →      LED
      Bloque       →        LED Pin … Estado …
```

### Las 4 piezas principales

| Nivel | Nombre que usamos | Dónde se ve | En SmartTEAM4 |
|-------|-------------------|-------------|---------------|
| 1 | **Extensión** | Al importar desde GitHub | **SmartTEAM4** |
| 2 | **Categoría** | Fila en la caja de herramientas (izquierda) | **SmartTEAM4** |
| 3 | **Subcategoría** | Encabezado dentro del panel al abrir una categoría | **Sensores**, **Salidas**, **Motores**, **OLED** |
| 4 | **Bloque** | Pieza que arrastrás al workspace | `BOTÓN en el pin …`, `LED Pin … Estado …` |

En MakeCode, las subcategorías se llaman **groups** (`//% groups=[…]` en la categoría, `//% group="…"` en cada bloque).

### Partes internas de un bloque

Cuando hablemos de un bloque concreto, también podemos nombrar:

| Parte | Nombre | Ejemplo |
|-------|--------|---------|
| Texto visible en el bloque | **Texto del bloque** | `Initialize OLED` / `LED Pin %pin Estado %estado` |
| Identificador interno | **Block ID** | `ext4_led`, `ext4_button_sensor`, `ext4_motor_run` |
| Nombre en el código TypeScript | **Función** | `ext4BotonEnPin()`, `led()` |
| Desplegables o casillas | **Parámetros** | `%pin`, `%estado`, `%text` |
| Lista de opciones fijas | **Menú / enum** | `ON` / `OFF`, `P0` / `P1`… |

### Cómo pedirme algo (plantillas)

- *“Agregá un **bloque** `mostrar mensaje` en la **subcategoría** Pantalla OLED de **SALIDAS**”*
- *“Renombrá la **categoría** SmartTEAM4 a …”*
- *“Cambiá el **texto del bloque** LED a …”*
- *“La **extensión** debe llamarse SmartTEAM4 en MakeCode”*

### Dónde se configura cada cosa en este repo

| Pieza | Archivo principal | Atributo clave |
|-------|-------------------|----------------|
| Extensión | `pxt.json` | `name`, `description` |
| Categoría | `blocks/categorias/<nombre>.ts` | `//% block="…"` y `groups=[…]` |
| Subcategoría | `config/categorias.ts` | `subcategorias` → `groups` / `group` |
| Bloque | `blocks/<categoria>/<bloque>.ts` | `//% blockId=… block="…" group="…"` |
| Traducción al español | `_locales/es/ext4-strings.json` | claves `{id:category}…` y `…\|block` |

---
Al crear o abrir un proyecto con esta extensión, estarán disponibles en la categoría **SmartTEAM4**:

- **Sensores** → `BOTÓN en el pin %pin`, comparación booleana del botón, `Ultrasonic Sensor %pin units %unit`
- **Salidas** → `LED Pin %pin Estado %estado`
- **Motores** → servos Geek I2C
- **OLED** → pantalla I2C

---

## Reglas para crear bloques

Toda extensión SmartTEAM4 sigue estas reglas. **Respétalas antes de agregar un bloque nuevo.**

### 1. Constantes editables por bloque

Cada bloque debe tener **COLOR**, **ICONO** y **CATEGORÍA** editables en dos lugares:

| Dónde editar | Para qué sirve |
|--------------|----------------|
| `config/bloques.ts` | Registro central de todos los bloques (fuente de verdad) |
| Encabezado del archivo `.ts` del bloque | Referencia rápida al editar un bloque concreto |
| Línea `//%` encima de la función | Lo que MakeCode lee para dibujar el bloque |

**Importante:** MakeCode no puede leer variables TypeScript en la línea `//%`. Por eso, al cambiar un valor en `config/bloques.ts`, debes **sincronizar** el encabezado y la línea `//%` del bloque con los mismos valores.

### 2. Categorías disponibles

Usa solo estas categorías por ahora:

| Categoría | Archivo de categoría | Subcategorías | Carpeta de bloques |
|-----------|---------------------|---------------|-------------------|
| SmartTEAM4 | `blocks/categorias/smartteam4.ts` | Sensores, Salidas, Motores, OLED | `blocks/smartteam4/` |

Para cambiar subcategorías, edita `config/categorias.ts` → `subcategorias` y sincroniza `groups=[…]` en `blocks/categorias/smartteam4.ts`.

### 3. Iconos personalizados

Sube tus iconos en la carpeta `icons/`:

```
icons/
├── entradas/       ← iconos de categoría y bloques ENTRADAS
├── salidas/        ← iconos de categoría y bloques SALIDAS
├── motores/        ← iconos de categoría y bloques MOTORES
└── pantallas/      ← iconos de categoría y bloques PANTALLAS
```

- Registra la ruta del archivo en `iconoArchivo` (ej: `icons/salidas/encender-luz.png`).
- MakeCode usa **Font Awesome** en la línea `//% icon="\uf0eb"`. Busca códigos en [fontawesome.com/v5](https://fontawesome.com/v5/search?m=free).
- El PNG en `icons/` es tu referencia visual y queda listo para uso futuro; el código FA es el que MakeCode muestra hoy en el editor.

### 4. Pasos para agregar un bloque nuevo

1. Agrega la entrada en **`config/bloques.ts`** (color, icono, categoría, blockId, texto, weight).
2. Copia **`blocks/_plantilla.ts`** a `blocks/<categoria>/mi-bloque.ts`.
3. Sincroniza el **encabezado** y la línea **`//%`** con los valores de `config/bloques.ts`.
4. Escribe el código de la función.
5. Registra el archivo en **`pxt.json`** → array `"files"`.
6. Agrega traducciones en **`_locales/es/ext4-strings.json`**.

### 5. Ejemplo de encabezado editable

```typescript
// ─── encenderLuz ─────────────────────────────────────────────────────────
// EDITAR: config/bloques.ts → BLOQUES.encenderLuz
// COLOR:     #E63022
// ICONO:     icons/salidas/encender-luz.png  (FA: \uf0eb)
// CATEGORÍA: SALIDAS
// ─────────────────────────────────────────────────────────────────────────
//% blockId=ext4_led_on block="encender luz en pin %pin" color="#E63022" icon="\uf0eb" weight=100
export function encenderLuz(pin: DigitalPin): void {
    pins.digitalWritePin(pin, 1);
}
```

---

## Estructura del proyecto

```
SmarTEAM_EXT4/
├── config/
│   ├── tipos.ts           # Tipos CategoriaId, BloqueConfig
│   ├── categorias.ts      # COLOR, ICONO y CATEGORÍA editables
│   └── bloques.ts         # Metadatos editables de cada bloque
├── icons/                 # Iconos personalizados (PNG/SVG)
├── blocks/
│   ├── categorias/        # Definición de la categoría SmartTEAM4
│   ├── smartteam4/        # Bloques SmartTEAM4 (sensores, salidas, motores, OLED…)
│   ├── _plantilla.ts      # Plantilla para bloques nuevos
│   └── ...
├── main.ts
├── main.blocks
├── pxt.json
└── _locales/es/
```

## Editar esta extensión

1. En MakeCode, usa **Importar** → **Importar URL**
2. Pega la URL del repositorio de GitHub
3. Edita los bloques o el código y sincroniza con GitHub

## Licencia

MIT
