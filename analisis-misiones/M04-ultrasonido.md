<!-- ═══════════════════════════ INICIO MISIÓN M04 ═══════════════════════════ -->
<!-- Cursor: ejecutá SOLO esta misión. Requiere M00. Copia literal desde PADRE.
     ATENCIÓN: se copia SOLO ultrasonido.ts. NO copiar ultrasonido_logico.ts. -->

# MISIÓN M04 — Ultrasonido (B01)

- **Repo objetivo:** `EXT5` · **Archivo a crear:** `blocks/sabana/ultrasonido.ts`
- **Fuente:** `STV2-PADRE/blocks/sabana/ultrasonido.ts` — **copia literal**
- **Depende de:** M00
- **Estado:** ⬜ pendiente

---

## 1. Confirmación de CATEGORÍAS, TEXTOS y VARIABLES

| Propiedad | Valor |
|---|---|
| `blockId` | `sabana_ultrasonido` |
| **Texto** | `Ultrasonido │ en pin I2C` |
| **Group** | `SENSORES` |
| **Color** | `#35BFE9` (I2C) |
| `weight` / `blockGap` | `100` / `8` |
| Forma | redondo (reporter, `number`) |
| Parámetros | **ninguno** |

**Retorno:** `number` — distancia en **milímetros**, cruda, tal como la entrega el
módulo del proveedor. **Sin conversión a centímetros.**

---

## 2. 🚩 Lo que NO se copia

`STV2-PADRE` tiene además `blocks/sabana/ultrasonido_logico.ts` con el bloque
`sabana_ultrasonido_logico` (`%medida detecta objeto %valor`), el enum
`SabanaVerdaderoFalso` y las constantes de umbral `DETECCION_MIN_MM = 30` /
`DETECCION_MAX_MM = 250`.

**Ese bloque (B02) está FUERA del alcance de EXT5.** No copiar ese archivo, no
declararlo en `pxt.json`, y **no traer las constantes de umbral a `ultrasonido.ts`**:
sin el bloque lógico nadie las consume y quedarían como código muerto.

---

## 3. Acción

### 3.1 Crear `blocks/sabana/ultrasonido.ts`

Copiar **el archivo completo sin modificar** desde
`STV2-PADRE/blocks/sabana/ultrasonido.ts`:

```ts
namespace bloques {

    // ── Constantes I2C del módulo ultrasónico del proveedor ─────────
    // Verificado en ORIGINAL/block/ultrasonic.ts
    const ULTRASONIDO_I2C_ADDR = 0x23   // 35
    const ULTRASONIDO_BASE = 0x0A       // registro base
    const ULTRASONIDO_PAUSA_MS = 20

    /**
     * STV2-1 — Ultrasonido conectado por I2C.
     *
     * Devuelve la distancia en MILÍMETROS, cruda, tal como la entrega el
     * módulo del proveedor. No se convierte a centímetros a propósito.
     *
     * Origen del código: ORIGINAL/block/ultrasonic.ts -> ultrasonicDistance()
     *
     * IMPORTANTE: el tercer argumento `true` de i2cWriteBuffer es un
     * repeated-start (sin condición de stop). Es obligatorio para que la
     * lectura siguiente devuelva el registro pedido. NO quitarlo.
     */
    //% blockId=sabana_ultrasonido
    //% block="Ultrasonido │ en pin I2C"
    //% group="SENSORES" color="#35BFE9" weight=100 blockGap=8
    export function ultrasonido(): number {
        basic.pause(ULTRASONIDO_PAUSA_MS)

        let buf = pins.createBuffer(1)
        buf[0] = ULTRASONIDO_BASE + 0x00
        pins.i2cWriteBuffer(ULTRASONIDO_I2C_ADDR, buf, true)

        // 2 bytes, big-endian
        let r = pins.i2cReadBuffer(ULTRASONIDO_I2C_ADDR, 2)
        return (r[0] << 8) | r[1]
    }
}
```

Tres detalles del protocolo que **no** hay que "prolijear":

1. `basic.pause(20)` va **antes** de escribir, no después.
2. El tercer argumento `true` de `i2cWriteBuffer` es *repeated start*. Sin él la
   lectura devuelve basura.
3. El orden es big-endian: `(r[0] << 8) | r[1]`.

### 3.2 Insertar en `pxt.json`

Agregar `"blocks/sabana/ultrasonido.ts"` **antes de** `"blocks/sabana/boton.ts"`:

```json
"blocks/sabana/mensaje.ts",
"blocks/sabana/ultrasonido.ts",
"blocks/sabana/boton.ts",
"blocks/sabana/potenciometro.ts",
"blocks/sabana/luz.ts",
```

---

## 4. Criterios de aceptación

- [ ] `diff blocks/sabana/ultrasonido.ts ../STV2-PADRE/blocks/sabana/ultrasonido.ts`
      no devuelve nada.
- [ ] `blocks/sabana/ultrasonido_logico.ts` **NO existe** en EXT5.
- [ ] El bloque aparece en `SENSORES`, celeste `#35BFE9`, texto
      `Ultrasonido │ en pin I2C`, sin desplegables.
- [ ] El valor **crece** al alejar la mano y **decrece** al acercarla.
- [ ] ⚠️ **Los valores son coherentes con milímetros:** a ~10 cm del sensor debe
      leerse cerca de **100**, no de **10**. Ver riesgo #1.
- [ ] El proyecto compila.

### Prueba

```ts
basic.forever(function () {
    basic.showNumber(bloques.ultrasonido())   // debe leerse en mm
    basic.pause(400)
})
```

---

## 5. Riesgos

| Riesgo | Detalle / mitigación |
|---|---|
| **🚩 Dirección I2C — punto abierto** | PADRE usa `0x23` (comando `0x0A`, pausa 20 ms), que viene del código del proveedor. Pero **EXT4 y la versión anterior de EXT5 usaban `0x57`** (RCWL-9620, comando `0x01`, pausa 50 ms) y esas dos estaban funcionando en el hardware del aula. Si el bloque devuelve siempre `0` o `65535`, el módulo no está en `0x23`. **Antes de tocar código, correr un escaneo I2C.** Si aparece en `0x57`, usar el driver alternativo del apéndice, manteniendo el retorno en **mm** (o sea, sin el `/10` que hacía EXT5). |
| **Quitar el `true` del `i2cWriteBuffer`** | El error más fácil al "limpiar" el código. Sin repeated-start la lectura devuelve basura. |
| **Mover el `basic.pause(20)`** | Va antes de la escritura. Después parece más lógico pero no es lo que hace el driver del proveedor. |
| **Convertir a cm** | El bloque devuelve mm a propósito. Cambiarlo es cambio de diseño → otra misión. |
| **Llamadas muy seguidas** | Cada lectura cuesta ~20 ms. Dentro de un `forever` sin pausa extra, el ultrasonido monopoliza el bus I2C y puede degradar la OLED o los motores. |

---

## Apéndice — driver alternativo `0x57` (usar solo si el escaneo I2C lo confirma)

```ts
    const ULTRASONIDO_I2C_ADDR = 0x57   // 87 — RCWL-9620
    const ULTRASONIDO_CMD = 0x01
    const ULTRASONIDO_PAUSA_MS = 50

    export function ultrasonido(): number {
        let buf = pins.createBuffer(1)
        buf[0] = ULTRASONIDO_CMD
        pins.i2cWriteBuffer(ULTRASONIDO_I2C_ADDR, buf)
        basic.pause(ULTRASONIDO_PAUSA_MS)
        let r = pins.i2cReadBuffer(ULTRASONIDO_I2C_ADDR, 2)
        return (r[0] << 8) | r[1]      // mm, SIN dividir por 10
    }
```

> Si se usa esta variante, **anotarlo en el índice maestro** (sección 9, punto 1) y
> avisar para que PADRE se actualice también. Las dos extensiones no deberían
> divergir en el driver.

---

<!-- ═══════════════════════════ FIN MISIÓN M04 ═══════════════════════════ -->
<!-- Fin de M04. Siguiente: M05 — DHT11. -->
