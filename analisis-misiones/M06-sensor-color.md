<!-- ═══════════════════════════ INICIO MISIÓN M06 ═══════════════════════════ -->
<!-- Cursor: ejecutá SOLO esta misión. Requiere M00 (necesita _limit255 de _util.ts).
     Es la ÚNICA misión que no tiene un driver listo para portar: hay que
     exponer un caché interno de original-alex como bloque público.          -->

# MISIÓN M06 — Sensor de Color (B06)

- **Repo objetivo:** `EXT5` · **Archivo a crear:** `blocks/sabana/color.ts`
- **Diseño:** `STV2-PADRE/blocks/sabana/color.ts` (hoy es un stub `return 0`)
- **Código:** `original-alex/block/veml6040.ts` — **hay que exponer el caché interno**
- **Depende de:** M00 (`_limit255` de `_util.ts`)
- **Estado:** ⬜ pendiente

---

## 1. Confirmación de CATEGORÍAS, TEXTOS y VARIABLES

| Propiedad | Valor |
|---|---|
| `blockId` | `sabana_color` |
| **Texto** | `Intensidad de color │ %canal en pin I2C` |
| **Group** | `SENSORES` |
| **Color** | `#35BFE9` (I2C) |
| `weight` / `blockGap` | `85` / `8` |
| Forma | redondo (reporter, `number`) |

| Parámetro | Tipo | Desplegable | Valores internos |
|---|---|---|---|
| `canal` | `SabanaColorCanal` | `Rojo` / `Verde` / `Azul` | `0` / `1` / `2` |

**Retorno:** `number` — intensidad del canal **normalizada a 0–255**.

> ✅ **Cero cambios de diseño.** Texto, color I2C y desplegable de PADRE son
> correctos. Solo se escribe el cuerpo.

---

## 2. Por qué esta misión es distinta a todas las demás

Las otras 11 misiones portan un driver que ya existe. Esta no: **ninguna de las
cuatro extensiones tiene un bloque que devuelva un canal R/G/B individual.**

`original-alex/block/veml6040.ts` tiene el sensor funcionando y mantiene las
lecturas en tres variables internas (`cacheR`, `cacheG`, `cacheB`), pero **solo
expone tres bloques públicos**, y ninguno sirve:

| Bloque público de ORIGINAL | Qué devuelve | ¿Sirve? |
|---|---|---|
| `init_veml` | nada (inicializa) | ❌ PADRE no tiene bloque de init |
| `isColorDetected(color)` | booleano de 9 colores por HSV | ❌ no es un canal |
| `readWhiteValue()` | brillo del canal blanco, 0–255 | ❌ es el canal W, no R/G/B |

Hay incluso un enum `enRGB { Red, Green, Blue }` declarado en el archivo **que
nunca se usa** — evidencia de que la intención estaba y quedó a medias.

**El trabajo de esta misión es exponer `cacheR/G/B` como bloque público**,
reutilizando toda la maquinaria interna que ya funciona.

---

## 3. Decisión J — escala de los canales: **0–255**

El registro del VEML6040 devuelve **16 bits** (0–65535). Se normaliza a **0–255**,
por tres razones:

1. Es exactamente lo que hace `readWhiteValue()` de ORIGINAL:
   `Math.round(cacheW * 255 / 65535)`, clampeado a 0–255. Mantener la misma escala
   deja los cuatro canales comparables entre sí.
2. `_util.ts` ya trae `_limit255()` justamente para esto. Es su primer consumidor
   real en EXT5.
3. 0–255 es la escala que el alumno ya conoce de cualquier selector de color RGB.

> 🔧 **Reversible en un solo lugar.** Si se prefiere el valor crudo de 16 bits,
> cambiar `_limit255(x * 255 / 65535)` por `Math.round(x)` en la función
> `canalToValor()`. Nada más depende de la escala.

---

## 4. Código de referencia (ORIGINAL)

Lo que hay que traer, en orden:

```ts
const GAIN_R = 1.85          // no se usa para los canales crudos
const GAIN_G = 1.5
const GAIN_B = 2.6
const VEML6040_ADDR = 0x10
const REG_CONF  = 0x00
const REG_RED   = 0x08
const REG_GREEN = 0x09
const REG_BLUE  = 0x0A
const REG_WHITE = 0x0B
const IT_320MS  = 0x30       // tiempo de integración
const AF_AUTO   = 0x00
const SD_ENABLE = 0x00
const READ_INTERVAL = 320    // ms mínimos entre lecturas

function setConfiguration() {
    let buf = pins.createBuffer(3)
    buf[0] = REG_CONF
    buf[1] = IT_320MS | AF_AUTO | SD_ENABLE
    buf[2] = 0
    pins.i2cWriteBuffer(VEML6040_ADDR, buf, false)
}

function readReg(reg: number): number {
    let regBuf = pins.createBuffer(1)
    regBuf[0] = reg
    pins.i2cWriteBuffer(VEML6040_ADDR, regBuf, true)   // repeated start
    basic.pause(5)
    let data = pins.i2cReadBuffer(VEML6040_ADDR, 2, false)
    return data[0] | (data[1] << 8)                     // LITTLE-endian
}

function updateRGB() {
    if (!veml_initialized) init_veml()
    let now = control.millis()
    if (now - lastReadTime < READ_INTERVAL) return       // throttle
    let s = readReg(REG_RED), h = readReg(REG_GREEN)
    let c = readReg(REG_BLUE), w = readReg(REG_WHITE)
    if (s == 0 && h == 0 && c == 0 && w == 0) return     // descarta lectura nula
    cacheR = s; cacheG = h; cacheB = c; cacheW = w
    lastReadTime = now
}

export function init_veml(): void {
    if (!veml_initialized) {
        setConfiguration()
        basic.pause(320)                                 // espera de integración
        veml_initialized = true
    }
}
```

### Cuatro detalles del protocolo que NO hay que "prolijear"

1. **`readReg` es LITTLE-endian**: `data[0] | (data[1] << 8)`. El ultrasónico
   (M04) es big-endian. Son sensores distintos; no unificar.
2. **El `true` en `i2cWriteBuffer`** de `readReg` es un *repeated start*, igual que
   en M04. Obligatorio.
3. **El `false` en `setConfiguration`** sí emite condición de stop. Es distinto a
   propósito.
4. **La guarda de lectura nula** (`if s==0 && h==0 && c==0 && w==0 return`) evita
   que un glitch del bus pise el caché con ceros. Conservarla.

---

## 5. Resultado esperado

Crear `blocks/sabana/color.ts` con este contenido completo:

```ts
namespace bloques {

    // ── Constantes I2C del sensor de color VEML6040 ──────────────────
    // Verificado en ORIGINAL/block/veml6040.ts
    const VEML6040_ADDR = 0x10      // 16
    const VEML_REG_CONF = 0x00
    const VEML_REG_RED = 0x08
    const VEML_REG_GREEN = 0x09
    const VEML_REG_BLUE = 0x0A
    const VEML_REG_WHITE = 0x0B
    const VEML_IT_320MS = 0x30      // tiempo de integración 320 ms
    const VEML_AF_AUTO = 0x00
    const VEML_SD_ENABLE = 0x00

    // Mínimo entre lecturas reales del sensor, en ms. Coincide con el
    // tiempo de integración: pedir más rápido no aporta datos nuevos.
    const VEML_READ_INTERVAL_MS = 320

    // Escala máxima del registro de 16 bits del sensor.
    const VEML_FULL_SCALE = 65535

    // ── Estado interno ───────────────────────────────────────────────
    let _vemlInit = false
    let _cacheR = 0
    let _cacheG = 0
    let _cacheB = 0
    let _cacheW = 0
    let _lastRead = 0

    export enum SabanaColorCanal {
        //% block="Rojo"
        Rojo = 0,
        //% block="Verde"
        Verde = 1,
        //% block="Azul"
        Azul = 2,
    }

    // Configura el sensor: tiempo de integración 320 ms, modo automático.
    // El tercer argumento false SÍ emite condición de stop (a diferencia
    // de readReg). No cambiarlo.
    function vemlSetConfig(): void {
        let buf = pins.createBuffer(3)
        buf[0] = VEML_REG_CONF
        buf[1] = VEML_IT_320MS | VEML_AF_AUTO | VEML_SD_ENABLE
        buf[2] = 0
        pins.i2cWriteBuffer(VEML6040_ADDR, buf, false)
    }

    // Inicialización automática. PADRE no tiene bloque de init a propósito:
    // el sensor se inicializa solo en la primera lectura.
    function vemlEnsureInit(): void {
        if (!_vemlInit) {
            vemlSetConfig()
            basic.pause(VEML_READ_INTERVAL_MS)   // espera de integración
            _vemlInit = true
        }
    }

    // Lee un registro de 16 bits del sensor.
    // OJO: es LITTLE-endian (data[0] | data[1] << 8), al revés que el
    // ultrasónico. El `true` del write es un repeated start: obligatorio.
    function vemlReadReg(reg: number): number {
        let regBuf = pins.createBuffer(1)
        regBuf[0] = reg
        pins.i2cWriteBuffer(VEML6040_ADDR, regBuf, true)
        basic.pause(5)
        let data = pins.i2cReadBuffer(VEML6040_ADDR, 2, false)
        return data[0] | (data[1] << 8)
    }

    // Refresca el caché de los 4 canales, con throttle de 320 ms.
    // El canal blanco (W) no se expone como bloque, pero se lee porque
    // participa de la guarda de lectura nula.
    function vemlUpdate(): void {
        vemlEnsureInit()

        const now = control.millis()
        if (now - _lastRead < VEML_READ_INTERVAL_MS) return

        const r = vemlReadReg(VEML_REG_RED)
        const g = vemlReadReg(VEML_REG_GREEN)
        const b = vemlReadReg(VEML_REG_BLUE)
        const w = vemlReadReg(VEML_REG_WHITE)

        // Guarda contra glitch del bus: una lectura toda en cero no pisa
        // el caché con valores falsos.
        if (r == 0 && g == 0 && b == 0 && w == 0) return

        _cacheR = r
        _cacheG = g
        _cacheB = b
        _cacheW = w
        _lastRead = now
    }

    // Normaliza el registro de 16 bits a 0-255 (decisión J).
    // Para volver al valor crudo de 16 bits, reemplazar por Math.round(crudo).
    function vemlNormalizar(crudo: number): number {
        return _limit255(crudo * 255 / VEML_FULL_SCALE)
    }

    /**
     * STV2-4 — Sensor de color VEML6040 conectado por I2C (0x10).
     *
     * Devuelve la intensidad del canal elegido, normalizada a 0-255 con la
     * misma escala que readWhiteValue() de ORIGINAL.
     *
     * El sensor se inicializa solo en la primera lectura: PADRE no tiene
     * bloque de init a propósito.
     *
     * Las lecturas reales están limitadas a una cada 320 ms (el tiempo de
     * integración del sensor). Entre medio se devuelve el valor cacheado,
     * así que llamarlo dentro de un forever es seguro.
     *
     * Origen del código: ORIGINAL/block/veml6040.ts. Los canales R/G/B
     * existían solo como caché interno (cacheR/G/B) y no estaban expuestos
     * como bloque; esta función los expone.
     *
     * @param canal canal a leer, eg: SabanaColorCanal.Rojo
     */
    //% blockId=sabana_color
    //% block="Intensidad de color │ %canal en pin I2C"
    //% group="SENSORES" color="#35BFE9" weight=85 blockGap=8
    export function colorSensor(canal: SabanaColorCanal): number {
        vemlUpdate()
        switch (canal) {
            case SabanaColorCanal.Rojo: return vemlNormalizar(_cacheR)
            case SabanaColorCanal.Verde: return vemlNormalizar(_cacheG)
            case SabanaColorCanal.Azul: return vemlNormalizar(_cacheB)
            default: return 0
        }
    }
}
```

### Insertar en `pxt.json`

Agregar `"blocks/sabana/color.ts"` **después de** `"blocks/sabana/dht11.ts"` y
**antes de** `"blocks/sabana/potenciometro.ts"`.

---

## 6. Lo que NO se trae de ORIGINAL

| Elemento | Por qué se omite |
|---|---|
| `GAIN_R` / `GAIN_G` / `GAIN_B` | Son factores de corrección para la clasificación por HSV de `isColorDetected`. Los canales crudos no los usan. |
| `isColorDetected()` + enum `DetectedColor` | PADRE no tiene bloque de detección de color por nombre. Sería diseño nuevo. |
| `readWhiteValue()` | PADRE no tiene bloque de brillo. El canal W se lee igual, pero solo para la guarda interna. |
| `init_veml()` como bloque público | PADRE no tiene bloque de init. Se resuelve con `vemlEnsureInit()` automático. |
| `max3()` / `min3()` | Solo los usaba la clasificación HSV. |
| enum `enRGB` | Estaba declarado y sin usar en ORIGINAL. El equivalente en EXT5 es `SabanaColorCanal`, que ya viene de PADRE. |

---

## 7. Criterios de aceptación

- [ ] El bloque aparece en `SENSORES`, **celeste `#35BFE9`**, texto
      `Intensidad de color │ Rojo en pin I2C`.
- [ ] El desplegable muestra `Rojo`, `Verde`, `Azul`, con **`Rojo` por defecto**.
- [ ] Los tres canales devuelven valores dentro de **0–255**.
- [ ] ⚠️ **Prueba cruzada obligatoria:** acercando un papel **rojo** al sensor, el
      canal `Rojo` debe dar claramente **más alto** que `Verde` y `Azul`. Repetir
      con papel verde y azul. Si el orden no se corresponde, los registros
      `0x08/0x09/0x0A` están mal asignados.
- [ ] Tapando el sensor por completo, los tres canales **bajan** juntos.
- [ ] La primera llamada tarda ~320 ms (inicialización); las siguientes son
      inmediatas.
- [ ] Llamarlo dentro de un `forever` **no cuelga** la micro:bit ni satura el bus.
- [ ] El proyecto compila.

### Prueba

```ts
basic.forever(function () {
    basic.showString("R")
    basic.showNumber(bloques.colorSensor(bloques.SabanaColorCanal.Rojo))
    basic.showString("G")
    basic.showNumber(bloques.colorSensor(bloques.SabanaColorCanal.Verde))
    basic.showString("B")
    basic.showNumber(bloques.colorSensor(bloques.SabanaColorCanal.Azul))
    basic.pause(500)
})
```

---

## 8. Riesgos y advertencias

| Riesgo | Detalle / mitigación |
|---|---|
| **Endianness invertida** | `vemlReadReg` es **little-endian**; el ultrasónico de M04 es big-endian. Si alguien "unifica" el criterio, los valores del color quedan multiplicados por 256 y saturados. Están comentados los dos a propósito. |
| **Quitar el throttle de 320 ms** | El tiempo de integración del sensor es 320 ms: leer más rápido devuelve el mismo dato pero inunda el bus I2C y degrada la OLED y los motores. |
| **Quitar la guarda de lectura nula** | Un glitch del bus pisaría el caché con ceros y el bloque devolvería 0 hasta la próxima lectura buena. |
| **Los `true` / `false` de `i2cWriteBuffer`** | `vemlReadReg` usa `true` (repeated start) y `vemlSetConfig` usa `false` (con stop). Son distintos **a propósito**. |
| **Sin verificación en hardware** | Es el único bloque de EXT5 cuyo código no viene de una extensión que ya estaba corriendo. La prueba cruzada de los papeles de color es imprescindible. |
| **Sensor ausente del bus** | Si el VEML6040 no está conectado, `vemlReadReg` devuelve ceros, la guarda los descarta y el bloque devuelve **0** de forma permanente. No se cuelga, pero tampoco avisa. Si hace falta un valor de error tipo `-999` como el DHT11, es un cambio de diseño → otra misión. |
| **Escala 0–255** | Decisión J. Reversible en `vemlNormalizar()` únicamente. |

---

<!-- ═══════════════════════════ FIN MISIÓN M06 ═══════════════════════════ -->
<!-- Fin de M06. Siguiente: M07 — LED. -->
