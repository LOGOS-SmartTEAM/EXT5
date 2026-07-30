<!-- ═══════════════════════════ INICIO MISIÓN M03 ═══════════════════════════ -->
<!-- Cursor: ejecutá SOLO esta misión. Requiere M00. Copia literal desde PADRE.
     ATENCIÓN: se copia SOLO boton.ts. NO copiar boton_logico.ts.            -->

# MISIÓN M03 — Botón (B03)

- **Repo objetivo:** `EXT5` · **Archivo a crear:** `blocks/sabana/boton.ts`
- **Fuente:** `STV2-PADRE/blocks/sabana/boton.ts` — **copia literal**
- **Depende de:** M00 (`puertoToDigitalPin`)
- **Estado:** ⬜ pendiente

---

## 1. Confirmación de CATEGORÍAS, TEXTOS y VARIABLES

| Propiedad | Valor |
|---|---|
| `blockId` | `sabana_boton` |
| **Texto** | `Botón │ en pin %puerto` |
| **Group** | `SENSORES` |
| **Color** | `#FFB800` (GPIO) |
| `weight` / `blockGap` | `95` / `8` |
| **Forma / retorno** | **hexagonal, `boolean`** |

| Parámetro | Tipo | Desplegable |
|---|---|---|
| `puerto` | `SabanaPuerto` | `P0` `P1` `P2` `P3` |

**Retorno:** `boolean` — `true` = **presionado**.

> El bloque es **hexagonal**, no redondo: encaja directamente en un
> `si ... entonces` de micro:bit. No devuelve número, así que **no** se puede
> mandar a `showNumber` ni a la OLED.

---

## 2. 🚩 Lo que NO se copia

`STV2-PADRE` tiene además `blocks/sabana/boton_logico.ts` con el bloque
`sabana_boton_logico` (`%medida %operador %valor`) y el enum
`SabanaOperadorComparacion`.

**Ese bloque (B04) está FUERA del alcance de EXT5.** No copiar ese archivo, no
declararlo en `pxt.json` y no declarar el enum `SabanaOperadorComparacion` en
ninguna parte.

Consecuencia: el enum `SabanaVerdaderoFalso` (que vive en el `ultrasonido_logico.ts`
de PADRE, también fuera de alcance) **tampoco existe en EXT5**. Nada lo necesita.

> ⚠️ Si al copiar `boton.ts` Cursor "completa" el trabajo agregando también
> `boton_logico.ts`, la extensión gana un bloque que no está en el alcance
> aprobado. **Copiar un solo archivo.**

---

## 3. Acción

### 3.1 Crear `blocks/sabana/boton.ts`

Copiar **el archivo completo sin modificar** desde
`STV2-PADRE/blocks/sabana/boton.ts`:

```ts
namespace bloques {
    /**
     * STV2-2 — Botón conectado a un puerto GPIO.
     *
     * Devuelve TRUE cuando el botón está PRESIONADO.
     *
     * El botón es de masa activa: presionado lleva el pin a 0. Por eso se
     * activa la resistencia de pull-up interna y se compara contra 0.
     * Sin el setPull el pin queda flotando y la lectura es ruido.
     *
     * Origen del código:
     *   - pull-up: EXT4/blocks/smartteam4/boton.ts -> ext4BotonEnPin()
     *   - comparación == 0: ORIGINAL/block/sensorGPIO.ts -> Button()
     *
     * @param puerto puerto GPIO de la placa, eg: SabanaPuerto.P0
     */
    //% blockId=sabana_boton
    //% block="Botón │ en pin %puerto"
    //% group="SENSORES" color="#FFB800" weight=95 blockGap=8
    export function boton(puerto: SabanaPuerto): boolean {
        const pin = puertoToDigitalPin(puerto)
        pins.setPull(pin, PinPullMode.PullUp)
        return pins.digitalReadPin(pin) == 0
    }
}
```

### 3.2 Insertar en `pxt.json`

Agregar `"blocks/sabana/boton.ts"`. Según el orden final del índice maestro va
**antes** de `dht11.ts`, o sea que en este punto se inserta **antes de
`potenciometro.ts`**:

```json
"blocks/sabana/mensaje.ts",
"blocks/sabana/boton.ts",
"blocks/sabana/potenciometro.ts",
"blocks/sabana/luz.ts",
```

---

## 4. Criterios de aceptación

- [ ] `diff blocks/sabana/boton.ts ../STV2-PADRE/blocks/sabana/boton.ts`
      no devuelve nada.
- [ ] `blocks/sabana/boton_logico.ts` **NO existe** en EXT5.
- [ ] `grep -rn "SabanaOperadorComparacion\|SabanaVerdaderoFalso" blocks/`
      **no devuelve nada**.
- [ ] El bloque aparece en `SENSORES`, amarillo `#FFB800`, texto
      `Botón │ en pin P0`, con **forma hexagonal**.
- [ ] Encaja directamente en un `si ... entonces`.
- [ ] Presionando el botón físico da **verdadero**; suelto da **falso**.
- [ ] Sin tocar nada la lectura es **estable, no titila** — confirma que el
      pull-up funciona.
- [ ] Funciona en los 4 puertos — verificar el **puerto 3** (pin P8).
- [ ] El proyecto compila.

### Prueba

```ts
basic.forever(function () {
    if (bloques.boton(SabanaPuerto.P0)) {
        basic.showIcon(IconNames.Yes)
    } else {
        basic.showIcon(IconNames.No)
    }
})
```

---

## 5. Riesgos

| Riesgo | Detalle |
|---|---|
| **Copiar también `boton_logico.ts`** | Riesgo principal. Está fuera del alcance. Ver sección 2. |
| **Convertir el retorno a `number`** | El bloque es booleano a propósito (decisión B2 tomada en PADRE). No "arreglarlo" para que devuelva 0/1. |
| **Quitar el `setPull`** | Sin la resistencia de pull-up el pin queda flotando y la lectura es ruido aleatorio. Se ejecuta en cada llamada; es idempotente y baratísimo. |
| **Colisión de modo de pin** | Si el mismo puerto se usó antes con `analogReadPin` (M01/M02), la lectura digital puede quedar rara. Un puerto, un componente. |

---

<!-- ═══════════════════════════ FIN MISIÓN M03 ═══════════════════════════ -->
<!-- Fin de M03. Siguiente: M04 — Ultrasonido. -->
