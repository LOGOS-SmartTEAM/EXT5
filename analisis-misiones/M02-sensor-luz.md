<!-- ═══════════════════════════ INICIO MISIÓN M02 ═══════════════════════════ -->
<!-- Cursor: ejecutá SOLO esta misión. Requiere M00. Copia literal desde PADRE. -->

# MISIÓN M02 — Sensor de Luz (B09)

- **Repo objetivo:** `EXT5` · **Archivo a crear:** `blocks/sabana/luz.ts`
- **Fuente:** `STV2-PADRE/blocks/sabana/luz.ts` — **copia literal**
- **Depende de:** M00 (`puertoToAnalogPin`)
- **Estado:** ⬜ pendiente

---

## 1. Confirmación de CATEGORÍAS, TEXTOS y VARIABLES

| Propiedad | Valor |
|---|---|
| `blockId` | `sabana_luz` |
| **Texto** | `Sensor de Luz │ en pin %puerto` |
| **Group** | `SENSORES` |
| **Color** | `#FFB800` (GPIO) |
| `weight` / `blockGap` | `70` / `8` |
| Forma | redondo (reporter, `number`) |

| Parámetro | Tipo | Desplegable |
|---|---|---|
| `puerto` | `SabanaPuerto` | `P0` `P1` `P2` `P3` |

**Retorno:** `number` — lectura analógica cruda **0–1023**.

> ✅ Ya implementado y probado en PADRE. Copia, no reimplementación.

---

## 2. Acción

### 2.1 Crear `blocks/sabana/luz.ts`

Copiar **el archivo completo sin modificar** desde
`STV2-PADRE/blocks/sabana/luz.ts`:

```ts
namespace bloques {
    /**
     * STV2-7 — Sensor de luz (fotorresistencia) en un puerto GPIO.
     * Lectura analógica 0-1023.
     *
     * Origen del código: ORIGINAL/block/sensorGPIO.ts -> Photosensitive()
     *   return pins.analogReadPin(num)
     *
     * NOTA HISTÓRICA: la tabla original decía "Suelo" por un copiado erróneo de
     * STV2-5. El texto ya fue corregido a "Sensor de Luz" y NO se vuelve a tocar.
     *
     * @param puerto puerto GPIO de la placa, eg: SabanaPuerto.P0
     */
    //% blockId=sabana_luz
    //% block="Sensor de Luz │ en pin %puerto"
    //% group="SENSORES" color="#FFB800" weight=70 blockGap=8
    export function luz(puerto: SabanaPuerto): number {
        return pins.analogReadPin(puertoToAnalogPin(puerto))
    }
}
```

### 2.2 Insertar en `pxt.json`

Agregar `"blocks/sabana/luz.ts"` **inmediatamente después de**
`"blocks/sabana/potenciometro.ts"`.

---

## 3. Criterios de aceptación

- [ ] `diff blocks/sabana/luz.ts ../STV2-PADRE/blocks/sabana/luz.ts` no devuelve nada.
- [ ] El bloque aparece en `SENSORES`, amarillo `#FFB800`, texto
      `Sensor de Luz │ en pin P0`.
- [ ] Tapando el sensor con la mano el valor cambia de forma notoria, dentro de
      **0–1023**.
- [ ] Funciona en los 4 puertos — verificar el **puerto 3** (pin P8).
- [ ] El proyecto compila.

### Prueba

```ts
basic.forever(function () {
    basic.showNumber(bloques.luz(SabanaPuerto.P0))
    basic.pause(300)
})
```

---

## 4. Riesgos

| Riesgo | Detalle |
|---|---|
| **Sentido de la lectura** | Según el divisor resistivo del módulo, "más luz" puede dar valor más alto **o** más bajo. Ni ORIGINAL ni PADRE lo normalizan. Verificar empíricamente y documentarlo en el manual del alumno; **no** invertirlo en código sin una misión nueva. |
| **Mismo cuerpo que M01** | `luz()` y `potenciometro()` son idénticos por dentro. Es correcto: módulos distintos con el mismo tipo de señal. **No unificarlos** en una sola función. |
| **Sin bloque lógico** | PADRE no define un hexágono `%medida está Claro/Oscuro`. No se agrega. |

---

<!-- ═══════════════════════════ FIN MISIÓN M02 ═══════════════════════════ -->
<!-- Fin de M02. Siguiente: M03 — Botón. -->
