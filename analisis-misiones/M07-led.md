<!-- ═══════════════════════════ INICIO MISIÓN M07 ═══════════════════════════ -->
<!-- Cursor: ejecutá SOLO esta misión. Requiere M00. -->

# MISIÓN M07 — LED (B13)

- **Repo objetivo:** `EXT5` · **Archivo a crear:** `blocks/sabana/led.ts`
- **Diseño:** `STV2-PADRE/blocks/sabana/led.ts` (hoy es un stub `// TODO`)
- **Código:** `_referencia/ext5-LED.ts` / `EXT4` — una línea, confirmado contra
  `original-alex/block/output.ts` → `LEDOn` / `LEDOff`
- **Depende de:** M00 (`puertoToDigitalPin`)
- **Estado:** ⬜ pendiente

---

## 1. Confirmación de CATEGORÍAS, TEXTOS y VARIABLES

| Propiedad | Valor |
|---|---|
| `blockId` | `sabana_led` |
| **Texto** | `LED │ Estado %estado en pin %puerto` |
| **Group** | `SALIDAS` |
| **Color** | `#FFB800` (GPIO) |
| `weight` / `blockGap` | `95` / `8` |
| Forma | bloque de **acción** (statement, `void`) |

| Parámetro | Tipo | Desplegable | Valores internos |
|---|---|---|---|
| `estado` | `SabanaEstadoOnOff` | `ON` / `OFF` | `0` / `1` |
| `puerto` | `SabanaPuerto` | `P0` `P1` `P2` `P3` | `0`–`3` |

> ⚠️ **El orden de los parámetros es `(estado, puerto)`**, como en PADRE. La versión
> anterior de EXT5 los tenía al revés: `led(puerto, estado)`. El orden de PADRE es
> el que manda, y por eso `test.ts` (que MD dejó vacío) no se puede repoblar con el
> código viejo.

**Este es el único bloque del group `SALIDAS`** en EXT5, porque la tira RGB quedó
fuera del alcance. Una subcategoría de un solo elemento es correcta; no mover el LED
a otro group.

---

## 2. El detalle que hace que esto sea una sola línea

El LED del proveedor es de **lógica invertida** (*active low*): se enciende
escribiendo **`0`** y se apaga escribiendo **`1`**.

`original-alex/block/output.ts`:

```ts
export function LEDOn(num: enGPIOpin): void  { pins.digitalWritePin(num, 0) }   // ON  -> 0
export function LEDOff(num: enGPIOpin): void { pins.digitalWritePin(num, 1) }   // OFF -> 1
```

Y el enum que ya viene de PADRE es:

```ts
export enum SabanaEstadoOnOff {
    ON = 0,      // <-- coincide con el nivel de pin para encender
    OFF = 1,     // <-- coincide con el nivel de pin para apagar
}
```

> 🚩 **Los valores `0` y `1` del enum NO son etiquetas: son el nivel eléctrico que
> hay que escribir en el pin.** Por eso el cuerpo pasa el enum directo a
> `digitalWritePin`, sin ningún `if`.
>
> Es elegante pero **frágil**: si alguien "ordena" el enum a `ON = 1, OFF = 0`
> —que es lo intuitivo— el LED funciona **al revés** y el bloque sigue compilando
> sin una sola advertencia.

Tanto EXT4 como la versión anterior de EXT5 explotan la misma coincidencia:

```ts
pins.digitalWritePin(puertoToGpioPin(puerto), estado)
```

---

## 3. Resultado esperado

Crear `blocks/sabana/led.ts` con este contenido completo:

```ts
namespace bloques {

    /**
     * Estado del LED.
     *
     * ATENCIÓN: los valores 0 y 1 NO son arbitrarios. El LED del proveedor es
     * de LÓGICA INVERTIDA (active low):
     *   escribir 0 en el pin -> LED ENCENDIDO
     *   escribir 1 en el pin -> LED APAGADO
     * Por eso ON = 0 y OFF = 1, y el valor del enum se pasa directo a
     * digitalWritePin sin ninguna traducción.
     *
     * NO invertir estos valores "para que se lean mejor": el LED quedaría
     * funcionando al revés y el código seguiría compilando sin avisos.
     *
     * Verificado en ORIGINAL/block/output.ts:
     *   LEDOn  -> pins.digitalWritePin(num, 0)
     *   LEDOff -> pins.digitalWritePin(num, 1)
     */
    export enum SabanaEstadoOnOff {
        //% block="ON"
        ON = 0,
        //% block="OFF"
        OFF = 1,
    }

    /**
     * STV2-10 — LED simple en un puerto GPIO, con estado ON/OFF.
     *
     * Origen del código: EXT4/blocks/smartteam4/LED.ts y
     * _referencia/ext5-LED.ts (idénticos):
     *   pins.digitalWritePin(puertoToGpioPin(puerto), estado)
     *
     * @param estado ON u OFF, eg: SabanaEstadoOnOff.ON
     * @param puerto puerto GPIO de la placa, eg: SabanaPuerto.P0
     */
    //% blockId=sabana_led
    //% block="LED │ Estado %estado en pin %puerto"
    //% group="SALIDAS" color="#FFB800" weight=95 blockGap=8
    export function led(estado: SabanaEstadoOnOff, puerto: SabanaPuerto): void {
        pins.digitalWritePin(puertoToDigitalPin(puerto), estado)
    }
}
```

### Insertar en `pxt.json`

Agregar `"blocks/sabana/led.ts"` **después de** `"blocks/sabana/luz.ts"`.

---

## 4. Criterios de aceptación

- [ ] El bloque aparece en `SmartTEAM 5 → SALIDAS`, amarillo `#FFB800`, texto
      `LED │ Estado ON en pin P0`.
- [ ] Es un bloque de **acción** (encaja en la secuencia, no devuelve valor).
- [ ] El orden de los desplegables es **primero el estado, después el pin**.
- [ ] `Estado ON` **enciende** el LED físico. ⚠️ Si lo apaga, el enum se invirtió:
      **no** corregirlo en el cuerpo, corregir el enum.
- [ ] `Estado OFF` **apaga** el LED físico.
- [ ] Funciona en los 4 puertos — verificar el **puerto 3** (pin P8).
- [ ] El proyecto compila.

### Prueba

```ts
basic.forever(function () {
    bloques.led(bloques.SabanaEstadoOnOff.ON, SabanaPuerto.P0)
    basic.pause(500)
    bloques.led(bloques.SabanaEstadoOnOff.OFF, SabanaPuerto.P0)
    basic.pause(500)
})
```

El LED debe **titilar** a 1 Hz. Si queda fijo, el `digitalWritePin` no está llegando
al pin correcto → revisar M00.

---

## 5. Riesgos

| Riesgo | Detalle / mitigación |
|---|---|
| **🚩 Invertir el enum** | El único riesgo real. `ON = 0` parece un error de tipeo y es lo primero que alguien "arregla". El comentario en cabecera existe para eso. |
| **Cambiar el orden de los parámetros** | La versión anterior de EXT5 usaba `(puerto, estado)`. PADRE usa `(estado, puerto)` y eso define el orden de los desplegables en el bloque. No volver al orden viejo. |
| **Módulo LED de lógica normal** | Si el módulo físico resultara *active high*, habría que invertir el enum — pero eso contradice el código del proveedor. Verificar antes de tocar; si pasa, es una excepción a registrar en el índice maestro. |
| **Repoblar `test.ts` con el código viejo** | El `test.ts` de la versión 2.0.0 llamaba `led(Ext5Puerto.P4, Ext5LedEstado.OFF)`. Ni el orden ni los tipos existen ya. Si se quiere un test, escribirlo con el ejemplo de arriba. |
| **Mover el LED de group** | `SALIDAS` queda con un solo bloque. Es correcto. Moverlo sería cambio de diseño. |
| **Colisión de modo de pin** | Si el puerto se leyó antes con `analogReadPin` (M01/M02), escribir digital lo reconfigura. Un puerto, un componente. |
| **Sin PWM / brillo** | El LED es solo ON/OFF. Ninguna extensión de referencia tiene control de brillo. |

---

<!-- ═══════════════════════════ FIN MISIÓN M07 ═══════════════════════════ -->
<!-- Fin de M07. Siguiente: M08 — Servo. -->
