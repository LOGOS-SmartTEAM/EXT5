<!-- ═══════════════════════════ INICIO MISIÓN M09 ═══════════════════════════ -->
<!-- Cursor: ejecutá SOLO esta misión. Requiere M00.
     ⚠️ Esta misión declara primitivos que M10 y M11 NECESITAN.
     Tiene que ejecutarse ANTES de M10 (hélice) y de M11 (movimiento).      -->

# MISIÓN M09 — Motor multicolor (B18)

- **Repo objetivo:** `EXT5` · **Archivo a crear:** `blocks/sabana/motor_multicolor.ts`
- **Diseño:** `STV2-PADRE/blocks/sabana/motor_multicolor.ts` (hoy es un stub `// TODO`)
- **Código:** `_referencia/ext5-motores.ts` → `writeMotor()` +
  `_referencia/ext5-motorUnico.ts` → `movimientoToSpeed()` +
  `original-alex/block/servoMotor.ts` → enum `MotorAddr` (4 direcciones)
- **Depende de:** M00
- **Prerrequisito de:** **M10** y **M11**
- **Estado:** ⬜ pendiente

---

## 1. Confirmación de CATEGORÍAS, TEXTOS y VARIABLES

| Propiedad | Valor |
|---|---|
| `blockId` | `sabana_motor_multicolor` |
| **Texto** | `Motor │ %color %movimiento en pin I2C \|\| Velocidad %velocidad` |
| **Group** | `MOTORES` |
| **Color** | `#35BFE9` (I2C) |
| `weight` / `blockGap` | `100` / `8` |
| Forma | acción (`void`), con **botón `+`** (`expandableArgumentMode="toggle"`) |

| Parámetro | Tipo | Desplegable / rango | Valores internos |
|---|---|---|---|
| `color` | `SabanaColorMotor` | `🔴` `🟢` `🟡` `🔵` | `0` `1` `2` `3` |
| `movimiento` | `SabanaMovimientoMotorUnico` | `Rotar a la derecha` / `rotar a la izquierda` / `Frenar` | `0` `1` `2` |
| `velocidad` | `number` (opcional) | `min=0` `max=100` `defl=50` | — |

> El `||` en el texto marca el corte del argumento opcional: `velocidad` queda
> oculta detrás del botón `+`. **No tocar ni el `||` ni el
> `expandableArgumentMode`.**

> ✅ **Cero cambios de diseño.** Los dos enums, los emojis, el texto (incluida la
> minúscula de "rotar a la izquierda") y los rangos vienen de PADRE tal cual.

---

## 2. 🚩 Este archivo declara los primitivos compartidos de motores

Además del bloque, `motor_multicolor.ts` es donde viven las piezas que van a
consumir **M10 (hélice)** y **M11 (movimiento)**:

| Elemento | Lo consume |
|---|---|
| enum `SabanaMovimientoMotorUnico` | **M10** — el bloque de la hélice usa este mismo enum |
| función `_writeMotor()` | **M11** — los 3 bloques de movimiento del robot |
| constantes `_MOTOR_ROJO` … `_MOTOR_AMARILLO` | **M11** |

Por eso `motor_multicolor.ts` tiene que estar **antes** de `helice.ts` y de
`movimiento.ts` en el array `files` de `pxt.json`, y esta misión tiene que
ejecutarse antes de M10 y M11.

> ⚠️ `_writeMotor` y las constantes van con `export` **aunque no sean bloques**. En
> TypeScript los miembros no exportados de un namespace declarado en varios
> archivos **no se comparten entre archivos**. Sin el `export`, M11 no compila.
> El prefijo `_` marca que son internos, igual que `_clamp` y `_limit255` de
> `_util.ts`.

---

## 3. Las 4 direcciones I2C

`original-alex/block/servoMotor.ts` → enum `MotorAddr`:

| Motor | Dirección |
|---|---|
| Rojo | `0x51` (81) |
| Verde | `0x52` (82) |
| Azul | `0x53` (83) |
| Amarillo | `0x54` (84) |

> 🚩 **Atención al mapeo.** El enum de PADRE está ordenado
> `Rojo(0) · Verde(1) · Amarillo(2) · Azul(3)`, o sea que **Amarillo va antes de
> Azul**, al revés del orden de las direcciones. Hay que mapear **por nombre, no
> por índice**:
>
> - `Amarillo` (valor 2) → `0x54`
> - `Azul` (valor 3) → `0x53`
>
> Si se mapea por índice, los motores amarillo y azul quedan intercambiados.

La versión anterior de EXT5 solo tenía rojo y verde (los dos del robot); las otras
dos direcciones vienen de ORIGINAL.

---

## 4. Decisión E — signo crudo, sin espejo

| Movimiento | Velocidad interna |
|---|---|
| `Rotar a la derecha` | **`+velocidad`** |
| `rotar a la izquierda` | **`−velocidad`** |
| `Frenar` | **`0`** |

Coincide con `movimientoToSpeed()` de `_referencia/ext5-motorUnico.ts` y con
`run(motoraddress, speed)` de ORIGINAL (`speed.min=-100 max=100`).

> ⚠️ **No aplicar la negación del motor rojo** que hace `movimientoToSpeeds()` en
> `_referencia/ext5-motores.ts`. Esa negación existe porque en el robot armado los
> dos motores están montados **en espejo**, y solo tiene sentido cuando se los
> mueve juntos. Acá el bloque controla un motor suelto: cada uno gira en su propio
> sentido físico.
>
> La negación del espejo **sí** se conserva en M11 (movimiento del robot).

---

## 5. El protocolo `writeMotor` — no simplificar

`_referencia/ext5-motores.ts`:

```ts
function writeMotor(address: number, speedRaw: number): void {
    const half = speedRaw / 2
    let speed_Buff = 0
    if (half < 0) {
        const s = -half
        speed_Buff = ((~s) + 1) | 0x80        // complemento a dos + bit de signo
    } else {
        speed_Buff = half
    }
    let buf = pins.createBuffer(4)
    buf.setNumber(NumberFormat.UInt8BE, 0, 0x11)   // registro de comando
    buf.setNumber(NumberFormat.UInt8BE, 1, speed_Buff)
    buf.setNumber(NumberFormat.UInt8BE, 2, 0)
    buf.setNumber(NumberFormat.UInt8BE, 3, 0)
    pins.i2cWriteBuffer(address, buf)
}
```

Tres cosas que parecen bugs y no lo son:

1. **`speedRaw / 2`** — la velocidad pública es 0–100 pero el controlador espera
   0–50. La división a la mitad es parte del protocolo.
2. **`((~s) + 1) | 0x80`** — codifica el sentido inverso como complemento a dos con
   el bit alto de signo. No reemplazar por `-half`.
3. **Los bytes 2 y 3 en cero** — el controlador espera un buffer de 4 bytes aunque
   solo use dos. Recortarlo a 2 bytes hace que el motor no responda.

---

## 6. Resultado esperado

Crear `blocks/sabana/motor_multicolor.ts` con este contenido completo:

```ts
namespace bloques {

    // ── Direcciones I2C de los motores ───────────────────────────────
    // Verificado en ORIGINAL/block/servoMotor.ts -> enum MotorAddr
    // OJO: el orden del enum SabanaColorMotor NO coincide con el orden de
    // las direcciones (Amarillo va antes de Azul). Mapear por nombre.
    export const _MOTOR_ROJO = 0x51      // 81
    export const _MOTOR_VERDE = 0x52     // 82
    export const _MOTOR_AZUL = 0x53      // 83
    export const _MOTOR_AMARILLO = 0x54  // 84

    // Registro de comando del controlador de motor.
    const _MOTOR_CMD = 0x11

    export enum SabanaColorMotor {
        //% block="🔴"
        Rojo = 0,
        //% block="🟢"
        Verde = 1,
        //% block="🟡"
        Amarillo = 2,
        //% block="🔵"
        Azul = 3,
    }

    /**
     * Sentido de giro de un motor individual.
     * Lo reutiliza también el bloque de la hélice (helice.ts, M10).
     */
    export enum SabanaMovimientoMotorUnico {
        //% block="Rotar a la derecha"
        Derecha = 0,
        //% block="rotar a la izquierda"
        Izquierda = 1,
        //% block="Frenar"
        Frenar = 2,
    }

    /**
     * Envía una velocidad a un motor por I2C.
     *
     * speedRaw va de -100 a 100, YA con el signo final aplicado.
     *
     * Origen del código: _referencia/ext5-motores.ts -> writeMotor()
     *
     * NO SIMPLIFICAR. Tres detalles del protocolo que parecen bugs:
     *   1. speedRaw / 2 -> el controlador espera 0-50, no 0-100.
     *   2. ((~s) + 1) | 0x80 -> complemento a dos con bit alto de signo
     *      para el sentido inverso. No reemplazar por -half.
     *   3. Los bytes 2 y 3 en cero -> el buffer debe ser de 4 bytes aunque
     *      solo se usen dos. Con 2 bytes el motor no responde.
     *
     * Exportada porque movimiento.ts (M11) la consume: en TypeScript los
     * miembros no exportados de un namespace no se comparten entre archivos.
     */
    export function _writeMotor(address: number, speedRaw: number): void {
        const half = speedRaw / 2
        let speed_Buff = 0
        if (half < 0) {
            const s = -half
            speed_Buff = ((~s) + 1) | 0x80
        } else {
            speed_Buff = half
        }
        let buf = pins.createBuffer(4)
        buf.setNumber(NumberFormat.UInt8BE, 0, _MOTOR_CMD)
        buf.setNumber(NumberFormat.UInt8BE, 1, speed_Buff)
        buf.setNumber(NumberFormat.UInt8BE, 2, 0)
        buf.setNumber(NumberFormat.UInt8BE, 3, 0)
        pins.i2cWriteBuffer(address, buf)
    }

    // Mapea el color del desplegable a su dirección I2C.
    // POR NOMBRE, no por índice: Amarillo(2) -> 0x54 y Azul(3) -> 0x53.
    function colorToAddress(color: SabanaColorMotor): number {
        switch (color) {
            case SabanaColorMotor.Rojo: return _MOTOR_ROJO
            case SabanaColorMotor.Verde: return _MOTOR_VERDE
            case SabanaColorMotor.Amarillo: return _MOTOR_AMARILLO
            case SabanaColorMotor.Azul: return _MOTOR_AZUL
            default: return _MOTOR_ROJO
        }
    }

    // Decisión E: signo CRUDO, sin la negación del montaje en espejo.
    // Derecha = horario = positivo. Izquierda = antihorario = negativo.
    function movimientoToSpeed(
        movimiento: SabanaMovimientoMotorUnico,
        velocidad: number
    ): number {
        switch (movimiento) {
            case SabanaMovimientoMotorUnico.Derecha: return velocidad
            case SabanaMovimientoMotorUnico.Izquierda: return -velocidad
            case SabanaMovimientoMotorUnico.Frenar: return 0
            default: return 0
        }
    }

    /**
     * STV2-16 — Controla un motor individual (identificado por color/emoji)
     * conectado por I2C. El botón "+" agrega el parámetro opcional de velocidad.
     *
     * La velocidad que ve el usuario siempre es positiva (0-100); el signo
     * interno lo define el sentido de giro.
     *
     * A diferencia de los bloques de MOVIMIENTO (M11), acá NO se aplica la
     * negación del montaje en espejo del robot: este bloque maneja un motor
     * suelto y cada uno gira en su propio sentido físico.
     *
     * @param color motor a controlar, eg: SabanaColorMotor.Rojo
     * @param movimiento sentido de giro o freno, eg: SabanaMovimientoMotorUnico.Derecha
     * @param velocidad velocidad de 0 a 100, eg: 50
     */
    //% blockId=sabana_motor_multicolor
    //% block="Motor │ %color %movimiento en pin I2C || Velocidad %velocidad"
    //% velocidad.min=0 velocidad.max=100 velocidad.defl=50
    //% expandableArgumentMode="toggle"
    //% group="MOTORES" color="#35BFE9" weight=100 blockGap=8
    export function motorMulticolor(
        color: SabanaColorMotor,
        movimiento: SabanaMovimientoMotorUnico,
        velocidad = 50
    ): void {
        const v = _clamp(velocidad, 0, 100)
        _writeMotor(colorToAddress(color), movimientoToSpeed(movimiento, v))
    }
}
```

### Insertar en `pxt.json`

Agregar `"blocks/sabana/motor_multicolor.ts"` **después de** `"blocks/sabana/oled.ts"`
si ya existe, o después de `"blocks/sabana/led.ts"`. Lo importante es que quede
**antes** de `servo.ts`, `helice.ts` y `movimiento.ts`.

---

## 7. Criterios de aceptación

- [ ] El bloque aparece en `SmartTEAM 5 → MOTORES`, **celeste `#35BFE9`**, texto
      `Motor │ 🔴 Rotar a la derecha en pin I2C`.
- [ ] Los emojis `🔴 🟢 🟡 🔵` se ven correctamente en el desplegable.
- [ ] El desplegable de movimiento muestra los tres textos exactos, **con
      `rotar a la izquierda` en minúscula** (así está en PADRE).
- [ ] El bloque tiene **botón `+`** que revela `Velocidad` con `50` por defecto.
- [ ] Sin expandir el `+`, el motor se mueve a velocidad 50.
- [ ] `Rotar a la derecha` y `rotar a la izquierda` giran en **sentidos opuestos**.
- [ ] `Frenar` detiene el motor.
- [ ] ⚠️ **Prueba de las 4 direcciones:** cada color mueve **su propio motor**.
      Verificar en particular que `🟡` y `🔵` **no estén intercambiados** —
      es el error más probable de esta misión.
- [ ] Velocidad `100` gira notoriamente más rápido que `25`.
- [ ] El proyecto compila.

### Prueba

```ts
basic.forever(function () {
    bloques.motorMulticolor(bloques.SabanaColorMotor.Rojo,
        bloques.SabanaMovimientoMotorUnico.Derecha, 60)
    basic.pause(1500)
    bloques.motorMulticolor(bloques.SabanaColorMotor.Rojo,
        bloques.SabanaMovimientoMotorUnico.Izquierda, 60)
    basic.pause(1500)
    bloques.motorMulticolor(bloques.SabanaColorMotor.Rojo,
        bloques.SabanaMovimientoMotorUnico.Frenar)
    basic.pause(1500)
})
```

---

## 8. Riesgos

| Riesgo | Detalle / mitigación |
|---|---|
| **🚩 Mapear los colores por índice** | El error más probable. `Amarillo=2` va a `0x54` y `Azul=3` a `0x53`. Un `switch` por nombre lo evita; un array indexado lo introduce. |
| **Olvidar el `export` en `_writeMotor`** | M11 no compila. Los miembros no exportados de un namespace no cruzan de archivo en TypeScript. |
| **"Simplificar" `writeMotor`** | Sección 5. Los tres detalles (÷2, complemento a dos, buffer de 4 bytes) son protocolo. |
| **Aplicar la negación del espejo** | Es de M11, no de acá. Si se aplica, "rotar a la derecha" gira al revés en el motor rojo. |
| **Tocar el `||` o el `expandableArgumentMode`** | Se pierde el botón `+` y la velocidad pasa a ser obligatoria. |
| **Motores ausentes del bus** | Si un motor no está conectado, `i2cWriteBuffer` falla en silencio. No se cuelga, pero tampoco avisa. |
| **Frenar no es lo mismo que cortar** | `Frenar` envía velocidad 0. Según el controlador, eso puede ser freno activo o rueda libre. Verificar en la placa y documentarlo. |
| **Corriente de arranque** | Cuatro motores arrancando juntos pueden hacer reiniciar la micro:bit si la alimentación es insuficiente. No es un bug del bloque. |

---

<!-- ═══════════════════════════ FIN MISIÓN M09 ═══════════════════════════ -->
<!-- Fin de M09. Siguiente: M10 — Hélice. -->
