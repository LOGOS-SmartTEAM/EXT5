<!-- ═══════════════════════════ INICIO MISIÓN M08 ═══════════════════════════ -->
<!-- Cursor: ejecutá SOLO esta misión. Requiere M00.
     ATENCIÓN: esta misión cambia un rango del bloque (grado.max 90 -> 180).
     Es una de las 3 excepciones aprobadas al diseño de PADRE.               -->

# MISIÓN M08 — Servo (B19)

- **Repo objetivo:** `EXT5` · **Archivo a crear:** `blocks/sabana/servo.ts`
- **Diseño:** `STV2-PADRE/blocks/sabana/servo.ts` (hoy es un stub `// TODO`)
- **Código:** `_referencia/ext5-Servo.ts` → `ext5ServoPosicionar()`
- **Depende de:** M00 (`puertoToAnalogPin`)
- **Excepción aplicada:** rango `0–90` → **`0–180`**
- **Estado:** ⬜ pendiente

---

## 1. Confirmación de CATEGORÍAS, TEXTOS y VARIABLES

| Propiedad | Antes (PADRE) | Después (EXT5) |
|---|---|---|
| `blockId` | `sabana_servo` | **igual** |
| **Texto** | `Servo │ en el grado %grado en pin %puerto` | **igual, sin cambios** |
| **Group** | `MOTORES` | **igual** |
| **Color** | `#FFB800` (GPIO) | **igual** |
| `weight` / `blockGap` | `80` / `8` | **igual** |
| Forma | acción (`void`) | **igual** |

| Parámetro | Antes | Después |
|---|---|---|
| `grado` | `min=0` `max=`**`90`** `defl=0` | 🔶 `min=0` `max=`**`180`** `defl=0` |
| `puerto` | `SabanaPuerto` | **igual** |

> 🔶 **Único cambio: el máximo del campo numérico pasa de 90 a 180.** El texto del
> bloque no cambia. El `defl` se mantiene en `0`, igual que PADRE.

---

## 2. Por qué 180 y no 90

PADRE limita a `grado.max=90`, pero las dos fuentes de código coinciden en 0–180:

| Fuente | Rango |
|---|---|
| `original-alex/block/servoMotor.ts` → `Servo()` | `value.min=0 value.max=180` |
| `_referencia/ext5-Servo.ts` → `ext5ServoPosicionar()` | `grado.min=0 grado.max=180 grado.defl=90` |

El `90` de PADRE es un recorte sin respaldo en ninguna hoja de datos ni en ninguna
implementación funcionando. Un servo estándar de hobby recorre 180°, y limitarlo a
90 le saca la mitad del recorrido al alumno sin ningún motivo mecánico.

> ℹ️ Se mantiene `grado.defl=0` de PADRE, **no** el `defl=90` de EXT5: el valor por
> defecto es diseño, y ahí manda PADRE. Solo se corrige el máximo.

---

## 3. Código de referencia

`_referencia/ext5-Servo.ts`:

```ts
//% blockId=ext5_servo_posicionar
//% block="SERVO | Posicionar en el grado %grado en el puerto %puerto"
//% grado.min=0 grado.max=180 grado.defl=90
export function ext5ServoPosicionar(grado: number, puerto: Ext5Puerto): void {
    pins.servoWritePin(puertoToAnalogPin(puerto), grado)
}
```

Una línea. `pins.servoWritePin()` es la API nativa de micro:bit: genera la señal
PWM de 50 Hz que espera un servo estándar, sin necesidad de driver propio.

> `original-alex` tiene además un servo por I2C (`servoMotor.ts`, 486 líneas, con
> lectura de posición y velocidad). **No se usa**: el bloque de PADRE dice
> `en pin %puerto`, o sea servo por GPIO. El de I2C sería otro componente y otro
> bloque.

---

## 4. Resultado esperado

Crear `blocks/sabana/servo.ts` con este contenido completo:

```ts
namespace bloques {

    /**
     * STV2-20 — Servo motor en un puerto GPIO.
     *
     * Rango 0-180°. PADRE lo limitaba a 90° por un recorte sin respaldo:
     * tanto ORIGINAL (value.max=180) como la versión anterior de EXT5
     * (grado.max=180) usan el recorrido completo del servo estándar.
     * Ver excepción registrada en el índice maestro.
     *
     * Usa la API nativa pins.servoWritePin(), que genera la señal PWM de
     * 50 Hz sobre el pin analógico del puerto. No hace falta driver propio.
     *
     * Origen del código: _referencia/ext5-Servo.ts -> ext5ServoPosicionar()
     *
     * @param grado ángulo de 0 a 180 grados, eg: 0
     * @param puerto puerto GPIO de la placa, eg: SabanaPuerto.P0
     */
    //% blockId=sabana_servo
    //% block="Servo │ en el grado %grado en pin %puerto"
    //% grado.min=0 grado.max=180 grado.defl=0
    //% group="MOTORES" color="#FFB800" weight=80 blockGap=8
    export function servo(grado: number, puerto: SabanaPuerto): void {
        pins.servoWritePin(puertoToAnalogPin(puerto), _clamp(grado, 0, 180))
    }
}
```

> El `_clamp()` de `_util.ts` es una red de seguridad: `grado.min`/`grado.max`
> limitan el **campo del bloque**, pero si alguien pasa una variable desde
> JavaScript el valor puede salirse. Mandar 300° a un servo lo fuerza contra el
> tope mecánico y lo puede quemar.

### Insertar en `pxt.json`

Agregar `"blocks/sabana/servo.ts"` **después de** `"blocks/sabana/motor_multicolor.ts"`.

> ⚠️ Según el orden final del índice maestro, `servo.ts` va **después** de
> `motor_multicolor.ts`. Como M09 (motor multicolor) todavía no se ejecutó,
> insertarlo por ahora **después de `blocks/sabana/oled.ts`** si existe, o al final
> de los archivos de bloques. M09 lo reubicará. Alternativamente, ejecutar M09
> antes que M08 — el orden entre estas dos misiones no tiene dependencia técnica.

---

## 5. Criterios de aceptación

- [ ] El bloque aparece en `SmartTEAM 5 → MOTORES`, **amarillo `#FFB800`**, texto
      `Servo │ en el grado 0 en pin P0`.
- [ ] El campo numérico **acepta hasta 180** y el valor por defecto es **`0`**.
- [ ] `grado = 0` lleva el servo a un extremo; `grado = 180` al otro extremo;
      `grado = 90` al centro.
- [ ] El recorrido total es de aproximadamente **180°**, no 90°.
- [ ] Funciona en los 4 puertos — verificar el **puerto 3** (pin P8).
- [ ] El proyecto compila.

### Prueba

```ts
basic.forever(function () {
    bloques.servo(0, SabanaPuerto.P0)
    basic.pause(1000)
    bloques.servo(90, SabanaPuerto.P0)
    basic.pause(1000)
    bloques.servo(180, SabanaPuerto.P0)
    basic.pause(1000)
})
```

---

## 6. Riesgos

| Riesgo | Detalle / mitigación |
|---|---|
| **El servo no llega a 180° físicamente** | Algunos servos económicos recorren ~170°. Si a `180` hace ruido de tope forzado, **bajar el `grado.max` al valor real medido** y anotarlo como excepción en el índice maestro. No dejarlo forzando el tope: se quema el engranaje. |
| **Consumo eléctrico** | Un servo bajo carga puede tirar más corriente de la que da el regulador de la micro:bit y provocar reinicios. Si la placa se reinicia al mover el servo, hace falta alimentación externa. No es un bug del bloque. |
| **`servoWritePin` deja el pin en modo PWM** | Después de usar el servo, ese puerto no sirve para lectura analógica hasta reconfigurarlo. Un puerto, un componente. |
| **Quitar el `_clamp`** | Protege el servo de valores fuera de rango que lleguen desde JavaScript. El `grado.max` solo limita el campo visual del bloque. |
| **Confundirlo con el servo I2C de ORIGINAL** | `original-alex/block/servoMotor.ts` es otro componente (bus I2C, con encoder). El bloque de PADRE es GPIO. |
| **Usar `defl=90` de EXT5** | El valor por defecto es diseño de PADRE: `0`. Solo se corrigió el máximo. |

---

<!-- ═══════════════════════════ FIN MISIÓN M08 ═══════════════════════════ -->
<!-- Fin de M08. Siguiente: M09 — Motor multicolor. -->
