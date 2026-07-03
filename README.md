# EXT5 - SmartTEAM5

Extensión MakeCode para SmartTEAM5 (micro:bit).

## Uso como extensión

1. Abre [makecode.microbit.org](https://makecode.microbit.org/)
2. Crea un **Nuevo proyecto**
3. Ve a **Extensiones** (icono de engranaje)
4. Pega la URL del repositorio de GitHub:
   `https://github.com/bscelza-logos/SmartTEAM_ext5`
5. Confirma la importación (versión actual: **2.0.0**)

### Actualizar la extensión en un proyecto existente

MakeCode puede cachear extensiones importadas desde GitHub. Si no ves los bloques nuevos:

1. Eliminá la extensión **ext5** en **Extensiones**.
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
Extensión          →  SmartTEAM5
  Categoría        →    SALIDAS
    Subcategoría   →      Salidas L5
      Bloque       →        LED Puerto … Estado …
```

### Las 4 piezas principales

| Nivel | Nombre que usamos | Dónde se ve | En SmartTEAM5 |
|-------|-------------------|-------------|---------------|
| 1 | **Extensión** | Al importar desde GitHub | **SmartTEAM5** |
| 2 | **Categoría** | Fila en la caja de herramientas (izquierda) | **SmartTEAM5** |
| 3 | **Subcategoría** | Encabezado dentro del panel al abrir una categoría | **Sensores L5**, **Salidas L5**, **Motores L5**, **OLED L5**, **Especiales L5** |
| 4 | **Bloque** | Pieza que arrastrás al workspace | `BOTÓN en el puerto …`, `LED Puerto … Estado …` |

En MakeCode, las subcategorías se llaman **groups** (`//% groups=[…]` en la categoría, `//% group="…"` en cada bloque).

### Partes internas de un bloque

Cuando hablemos de un bloque concreto, también podemos nombrar:

| Parte | Nombre | Ejemplo |
|-------|--------|---------|
| Texto visible en el bloque | **Texto del bloque** | `Escribir … en la fila … columna …` / `LED Puerto %puerto Estado %estado` |
| Identificador interno | **Block ID** | `ext5_led`, `ext5_button_sensor`, `ext5_motor_move` |
| Nombre en el código TypeScript | **Función** | `ext5BotonEnPin()`, `led()` |
| Desplegables o casillas | **Parámetros** | `%puerto`, `%estado`, `%texto` |
| Lista de opciones fijas | **Menú / enum** | `ON` / `OFF`, `P1` / `P2`… |

### Cómo pedirme algo (plantillas)

- *“Agregá un **bloque** `mostrar mensaje` en la **subcategoría** OLED L5 de **SmartTEAM5**”*
- *“Renombrá la **categoría** SmartTEAM5 a …”*
- *“Cambiá el **texto del bloque** LED a …”*
- *“La **extensión** debe llamarse SmartTEAM5 en MakeCode”*

### Dónde se configura cada cosa en este repo

| Pieza | Archivo principal | Atributo clave |
|-------|-------------------|----------------|
| Extensión | `pxt.json` | `name`, `description` |
| Categoría | `blocks/categorias/<nombre>.ts` | `//% block="…"` y `groups=[…]` |
| Subcategoría | `config/categorias.ts` | `subcategorias` → `groups` / `group` |
| Bloque | `blocks/<categoria>/<bloque>.ts` | `//% blockId=… block="…" group="…"` |
| Traducción al español | `_locales/es/ext5-strings.json` | claves `{id:category}…` y `…\|block` |

---
Al crear o abrir un proyecto con esta extensión, estarán disponibles en la categoría **SmartTEAM5**:

- **Sensores L5** → `BOTÓN en el puerto %puerto`, comparación booleana del botón, `Ultrasonido en el pin %puerto`
- **Salidas L5** → `LED Puerto %puerto Estado %estado`
- **Motores L5** → servos Geek I2C
- **OLED L5** → pantalla I2C
- **Especiales L5** → `Guardar mensaje`, `Decodificar mensaje`, `Mensaje decodificado` (código Morse por Botón A)

### Especiales L5 — Mensaje en código Morse (supuestos de diseño)

Los bloques de Morse (`blocks/smartteam5/mensaje.ts`) se implementaron sobre los siguientes
supuestos, **pendientes de validar en hardware real**. Si alguno no es correcto, avisar para
ajustarlo en una misión de corrección.

1. **Botón A incorporado**: el sistema usa el Botón A de la micro:bit (`input.buttonIsPressed(Button.A)`),
   no un puerto GPIO externo vía `Ext5Puerto`. Los bloques no llevan parámetro de puerto.
2. **`Guardar mensaje`** está pensado para colocarse dentro de un bucle **"por siempre" (forever)**:
   en cada vuelta detecta el flanco de pulsación/soltado y mide la duración para clasificarla
   como punto (`p`, pulsación corta < 350 ms) o línea (`l`, pulsación larga).
3. **`Decodificar mensaje`** se coloca en el mismo bucle "por siempre", después de `Guardar mensaje`:
   si pasaron 2000 ms sin una pulsación nueva, busca el código acumulado en la tabla Morse
   (a↔z) y agrega la letra al mensaje.
4. **`Mensaje decodificado`** es un bloque redondo (reportero de texto) que devuelve el mensaje
   acumulado y **lo vacía al leerlo**.

Umbrales configurables en `mensaje.ts`: `UMBRAL_PUNTO_MS = 350`, `PAUSA_LETRA_MS = 2000`.

---

## Reglas para crear bloques

Toda extensión SmartTEAM5 sigue estas reglas. **Respétalas antes de agregar un bloque nuevo.**

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
| SmartTEAM5 | `blocks/categorias/smartteam5.ts` | Sensores L5, Salidas L5, Motores L5, OLED L5, Especiales L5 | `blocks/smartteam5/` |

Para cambiar subcategorías, edita `config/categorias.ts` → `subcategorias` y sincroniza `groups=[…]` en `blocks/categorias/smartteam5.ts`.

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
6. Agrega traducciones en **`_locales/es/ext5-strings.json`**.

### 5. Ejemplo de encabezado editable

```typescript
// ─── encenderLuz ─────────────────────────────────────────────────────────
// EDITAR: config/bloques.ts → BLOQUES.encenderLuz
// COLOR:     #E63022
// ICONO:     icons/salidas/encender-luz.png  (FA: \uf0eb)
// CATEGORÍA: SALIDAS
// ─────────────────────────────────────────────────────────────────────────
//% blockId=ext5_led_on block="encender luz en pin %pin" color="#E63022" icon="\uf0eb" weight=100
export function encenderLuz(pin: DigitalPin): void {
    pins.digitalWritePin(pin, 1);
}
```

---

## Estructura del proyecto

```
SmarTEAM_EXT5/
├── config/
│   ├── tipos.ts           # Tipos CategoriaId, BloqueConfig
│   ├── categorias.ts      # COLOR, ICONO y CATEGORÍA editables
│   └── bloques.ts         # Metadatos editables de cada bloque
├── icons/                 # Iconos personalizados (PNG/SVG)
├── blocks/
│   ├── categorias/        # Definición de la categoría SmartTEAM5
│   ├── smartteam5/        # Bloques SmartTEAM5 (sensores, salidas, motores, OLED…)
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
