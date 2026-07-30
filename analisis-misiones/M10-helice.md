<!-- ═══════════════════════════ INICIO MISIÓN M10 ═══════════════════════════ -->
<!-- Cursor: ejecutá SOLO esta misión. Requiere M00 y M09 (usa el enum
     SabanaMovimientoMotorUnico declarado en motor_multicolor.ts).           -->

# MISIÓN M10 — Hélice (B20)

- **Repo objetivo:** `EXT5` · **Archivo a crear:** `blocks/sabana/helice.ts`
- **Diseño:** `STV2-PADRE/blocks/sabana/helice.ts` (hoy es un stub `// TODO`)
- **Código:** `_referencia/ext5-helice.ts` → `ext5Helice()` +
  `_referencia/ext5-puertos-mapeo.txt` (pines IN2)
- **Depende de:** M00 (`puertoToDigitalPin`), **M09** (enum `SabanaMovimientoMotorUnico`)
- **Estado:** ⬜ pendiente

---

## 1. Confirmación de CATEGORÍAS, TEXTOS y VARIABLES

| Propiedad | Valor |
|---|---|
| `blockId` | `sabana_helice` |
| **Texto** | `Hélice │ %sentido en pin %puerto` |
| **Group** | `MOTORES` |
| **Color** | `#FFB800` (GPIO) |
| `weight` / `blockGap` | `75` / `8` |
| Forma | acción (`void`) |

| Parámetro | Tipo | Desplegable |
|---|---|---|
| `sentido` | `SabanaMovimientoMotorUnico` **(de M09)** | `Rotar a la derecha` / `rotar a la izquierda` / `Frenar` |
| `puerto` | `SabanaPuerto` | `P0` `P1` `P2` `P3` |

> ✅ **Cero cambios de diseño.** El enum se **reutiliza** de `motor_multicolor.ts`,
> igual que en PADRE. **No redeclararlo acá.**

---

## 2. Decisión cancelada: la hélice SÍ tiene dirección

En una etapa anterior del análisis se planteó degradar el desplegable a **ON / OFF**,
porque el único driver conocido entonces era `FanOn` / `FanOff` de
`original-alex/block/output.ts` — un solo pin digital, sin control de sentido:

```ts
export function FanOn(num: enGPIOpin): void  { pins.digitalWritePin(num, 1) }
export function FanOff(num: enGPIOpin): void { pins.digitalWritePin(num, 0) }
```

**Esa decisión quedó cancelada.** El driver de la versión anterior de EXT5 controla
**dos pines digitales (IN1 / IN2)** — un puente H — y por lo tanto *Rotar a la
derecha*, *rotar a la izquierda* y *Frenar* son implementables de verdad.

El texto de PADRE **queda tal cual**, sin degradar nada.

### Tabla de verdad del puente H

| Sentido | IN1 | IN2 |
|---|---|---|
| `rotar a la izquierda` | `0` | `1` |
| `Rotar a la derecha` | `1` | `0` |
| `Frenar` | `0` | `0` |

> `1`/`1` no se usa: en un puente H significa freno activo por cortocircuito y en
> algunos controladores es una combinación prohibida. No agregarla.

---

## 3. 🚩 El segundo pin (IN2) — de dónde salen esos pines

`IN1` es el pin normal del puerto (`puertoToDigitalPin`). `IN2` usa un **segundo pin
por puerto**, que sale de la columna "echo" del mapeo físico rescatado en
`_referencia/ext5-puertos-mapeo.txt`:

```
PUERTO 0 → señal P0  | trig P0,  echo P13
PUERTO 1 → señal P1  | trig P1,  echo P14
PUERTO 2 → señal P2  | trig P2,  echo P15
PUERTO 3 → señal P8  | trig P8,  echo P7
```

| Puerto | IN1 (señal) | **IN2 (echo)** |
|---|---|---|
| `P0` | `P0` | **`P13`** |
| `P1` | `P1` | **`P14`** |
| `P2` | `P2` | **`P15`** |
| `P3` | `P8` | **`P7`** |

Esos pines quedaron libres cuando el ultrasónico pasó a I2C: antes eran el par
trig/echo del sensor.

> ⚠️ **Punto a verificar en hardware.** La cabecera de `_referencia/ext5-helice.ts`
> dice literalmente *"Confirmar en hardware real"*. Si un sentido de giro no
> funciona pero el otro sí, el pin IN2 de ese puerto está mal. Ver riesgos.

---

## 4. Código de referencia

`_referencia/ext5-helice.ts`:

```ts
function puertoToHeliceIn2(puerto: Ext5Puerto): DigitalPin {
    switch (puerto) {
        case Ext5Puerto.P1: return DigitalPin.P13
        case Ext5Puerto.P2: return DigitalPin.P14
        case Ext5Puerto.P3: return DigitalPin.P15
        case Ext5Puerto.P4: return DigitalPin.P7
    }
}

export function ext5Helice(movimiento: Ext5MovimientoMotorUnico, puerto: Ext5Puerto): void {
    const in1 = puertoToGpioPin(puerto)
    const in2 = puertoToHeliceIn2(puerto)
    switch (movimiento) {
        case Izquierda: pins.digitalWritePin(in1, 0); pins.digitalWritePin(in2, 1); break
        case Derecha:   pins.digitalWritePin(in1, 1); pins.digitalWritePin(in2, 0); break
        case Frenar:    pins.digitalWritePin(in1, 0); pins.digitalWritePin(in2, 0); break
    }
}
```

Traducción: `Ext5Puerto.P1..P4` (valores 1–4) → `SabanaPuerto.P0..P3` (valores 0–3).
**Las etiquetas visibles son las mismas** (`P0`–`P3`), así que el mapeo por posición
es directo.

---

## 5. Resultado esperado

Crear `blocks/sabana/helice.ts` con este contenido completo:

```ts
namespace bloques {

    /**
     * Segundo pin de control (IN2) del puente H de la hélice, por puerto.
     *
     * IN1 es el pin normal del puerto (puertoToDigitalPin). IN2 usa los pines
     * de la columna "echo" del mapeo físico de la placa, que quedaron libres
     * cuando el ultrasónico pasó a I2C:
     *
     *   PUERTO 0 -> P13     PUERTO 2 -> P15
     *   PUERTO 1 -> P14     PUERTO 3 -> P7
     *
     * Origen: _referencia/ext5-helice.ts -> puertoToHeliceIn2() y
     *         _referencia/ext5-puertos-mapeo.txt
     *
     * PENDIENTE DE VERIFICAR EN HARDWARE: si un sentido de giro no funciona
     * pero el otro sí, el pin IN2 de ese puerto está mal asignado.
     */
    function puertoToHeliceIn2(puerto: SabanaPuerto): DigitalPin {
        switch (puerto) {
            case SabanaPuerto.P0: return DigitalPin.P13
            case SabanaPuerto.P1: return DigitalPin.P14
            case SabanaPuerto.P2: return DigitalPin.P15
            case SabanaPuerto.P3: return DigitalPin.P7
            default: return DigitalPin.P13
        }
    }

    /**
     * STV2-21 — Hélice en un puerto GPIO. Reutiliza el enum
     * SabanaMovimientoMotorUnico definido en motor_multicolor.ts
     * (Derecha / Izquierda / Frenar).
     *
     * La hélice se controla con un PUENTE H de dos pines digitales, así que
     * el sentido de giro es real (no es un simple ON/OFF):
     *
     *   izquierda -> IN1=0, IN2=1
     *   derecha   -> IN1=1, IN2=0
     *   frenar    -> IN1=0, IN2=0
     *
     * La combinación 1/1 no se usa: en un puente H es freno por cortocircuito
     * y en algunos controladores está prohibida.
     *
     * No hay control de velocidad: los dos pines son digitales, sin PWM.
     *
     * Origen del código: _referencia/ext5-helice.ts -> ext5Helice()
     *
     * @param sentido sentido de giro o freno, eg: SabanaMovimientoMotorUnico.Derecha
     * @param puerto puerto GPIO de la placa, eg: SabanaPuerto.P0
     */
    //% blockId=sabana_helice
    //% block="Hélice │ %sentido en pin %puerto"
    //% group="MOTORES" color="#FFB800" weight=75 blockGap=8
    export function helice(sentido: SabanaMovimientoMotorUnico, puerto: SabanaPuerto): void {
        const in1 = puertoToDigitalPin(puerto)
        const in2 = puertoToHeliceIn2(puerto)

        switch (sentido) {
            case SabanaMovimientoMotorUnico.Izquierda:
                pins.digitalWritePin(in1, 0)
                pins.digitalWritePin(in2, 1)
                break
            case SabanaMovimientoMotorUnico.Derecha:
                pins.digitalWritePin(in1, 1)
                pins.digitalWritePin(in2, 0)
                break
            case SabanaMovimientoMotorUnico.Frenar:
                pins.digitalWritePin(in1, 0)
                pins.digitalWritePin(in2, 0)
                break
        }
    }
}
```

### Insertar en `pxt.json`

Agregar `"blocks/sabana/helice.ts"` **después de** `"blocks/sabana/servo.ts"` y
**antes de** `"blocks/sabana/movimiento.ts"`.

⚠️ Tiene que quedar **después de `motor_multicolor.ts`**, que es donde se declara el
enum que usa.

---

## 6. Criterios de aceptación

- [ ] El bloque aparece en `SmartTEAM 5 → MOTORES`, **amarillo `#FFB800`**, texto
      `Hélice │ Rotar a la derecha en pin P0`.
- [ ] El desplegable muestra los **mismos tres textos** que el bloque de motor
      multicolor, incluida la minúscula de `rotar a la izquierda`.
- [ ] `grep -n "SabanaMovimientoMotorUnico" blocks/sabana/helice.ts` **no** muestra
      una declaración de `enum` — solo usos. El enum vive en `motor_multicolor.ts`.
- [ ] ⚠️ `Rotar a la derecha` y `rotar a la izquierda` hacen girar la hélice en
      **sentidos físicamente opuestos**. Si solo uno funciona, ver riesgo #1.
- [ ] `Frenar` detiene la hélice.
- [ ] Funciona en los 4 puertos. **Verificar los cuatro uno por uno**: cada puerto
      usa un pin IN2 distinto y un error afecta solo a ese puerto.
- [ ] El proyecto compila.

### Prueba

```ts
basic.forever(function () {
    bloques.helice(bloques.SabanaMovimientoMotorUnico.Derecha, SabanaPuerto.P0)
    basic.pause(2000)
    bloques.helice(bloques.SabanaMovimientoMotorUnico.Frenar, SabanaPuerto.P0)
    basic.pause(1000)
    bloques.helice(bloques.SabanaMovimientoMotorUnico.Izquierda, SabanaPuerto.P0)
    basic.pause(2000)
    bloques.helice(bloques.SabanaMovimientoMotorUnico.Frenar, SabanaPuerto.P0)
    basic.pause(1000)
})
```

---

## 7. Riesgos

| Riesgo | Detalle / mitigación |
|---|---|
| **🚩 #1 — Pines IN2 sin verificar** | Es el riesgo principal. `P13/P14/P15/P7` salen del mapeo de la placa, no de una hoja de datos, y la fuente original dice *"confirmar en hardware real"*. **Síntoma:** un sentido gira y el otro no hace nada (o hace un zumbido sin girar). **Diagnóstico:** medir con tester el pin IN2 del puerto en cuestión mientras se manda cada sentido. Si el pin correcto es otro, corregirlo en `puertoToHeliceIn2()` y anotarlo en el índice maestro. |
| **Redeclarar el enum** | Si se declara `SabanaMovimientoMotorUnico` también acá, MakeCode falla por declaración duplicada. Se reutiliza el de `motor_multicolor.ts`. |
| **Ejecutar M10 antes de M09** | No compila: el enum todavía no existe. |
| **Agregar la combinación 1/1** | En un puente H es freno por cortocircuito. En algunos controladores está prohibida y puede dañar el driver. |
| **Esperar control de velocidad** | Los dos pines son **digitales**, sin PWM. La hélice gira a velocidad fija. Agregar velocidad requeriría PWM sobre IN1/IN2 y sería un cambio de diseño (el bloque de PADRE no tiene parámetro de velocidad). |
| **Conflicto de pines con otros componentes** | `P13/P14/P15` son los pines del bus SPI de la micro:bit, y `P7` es de la matriz de LEDs. Si se usa la matriz de LEDs (`basic.showNumber`) junto con la hélice en el **puerto 3**, puede haber interferencia. Probarlo explícitamente y documentarlo. |
| **La hélice queda girando** | El bloque no tiene apagado automático. Si el programa termina sin `Frenar`, la hélice sigue. Documentar en el manual del alumno. |

---

<!-- ═══════════════════════════ FIN MISIÓN M10 ═══════════════════════════ -->
<!-- Fin de M10. Siguiente: M11 — Movimiento. -->
