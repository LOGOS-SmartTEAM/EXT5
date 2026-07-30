<!-- ═══════════════════════════ INICIO MISIÓN M01 ═══════════════════════════ -->
<!-- Cursor: ejecutá SOLO esta misión. Requiere M00. Copia literal desde PADRE. -->

# MISIÓN M01 — Potenciómetro (B08)

- **Repo objetivo:** `EXT5` · **Archivo a crear:** `blocks/sabana/potenciometro.ts`
- **Fuente:** `STV2-PADRE/blocks/sabana/potenciometro.ts` — **copia literal**
- **Depende de:** M00 (`puertoToAnalogPin`)
- **Estado:** ⬜ pendiente

---

## 1. Confirmación de CATEGORÍAS, TEXTOS y VARIABLES

| Propiedad | Valor |
|---|---|
| `blockId` | `sabana_potenciometro` |
| **Texto** | `Potenciómetro │ en pin %puerto` |
| **Group** | `SENSORES` |
| **Color** | `#FFB800` (GPIO) |
| `weight` / `blockGap` | `75` / `8` |
| Forma | redondo (reporter, `number`) |

| Parámetro | Tipo | Desplegable |
|---|---|---|
| `puerto` | `SabanaPuerto` | `P0` `P1` `P2` `P3` |

**Retorno:** `number` — lectura analógica cruda **0–1023**.

> ✅ Este bloque **ya está implementado y probado en PADRE**. Esta misión es una
> copia, no una reimplementación. No hay nada que decidir.

---

## 2. Acción

### 2.1 Crear `blocks/sabana/potenciometro.ts`

Copiar **el archivo completo, sin modificar ni un carácter**, desde
`STV2-PADRE/blocks/sabana/potenciometro.ts`. Contenido esperado:

```ts
namespace bloques {
    /**
     * STV2-6 — Potenciómetro en un puerto GPIO (lectura analógica 0-1023).
     *
     * Origen del código: ORIGINAL/block/sensorGPIO.ts -> Potentiometer()
     *   return pins.analogReadPin(num)
     *
     * NOTA HISTÓRICA: la tabla original tenía el texto "Suelo en el puerto X"
     * (copiado por error de STV2-5). Se corrigió a "Potenciómetro..." para que
     * coincida con el componente. El texto NO se vuelve a tocar.
     *
     * @param puerto puerto GPIO de la placa, eg: SabanaPuerto.P0
     */
    //% blockId=sabana_potenciometro
    //% block="Potenciómetro │ en pin %puerto"
    //% group="SENSORES" color="#FFB800" weight=75 blockGap=8
    export function potenciometro(puerto: SabanaPuerto): number {
        return pins.analogReadPin(puertoToAnalogPin(puerto))
    }
}
```

### 2.2 Insertar en `pxt.json`

Agregar `"blocks/sabana/potenciometro.ts"` **después de** `"blocks/sabana/mensaje.ts"`
(es el primer archivo de bloques de componente que se agrega; los siguientes se
insertan respetando el orden final del índice maestro).

---

## 3. Criterios de aceptación

- [ ] `diff blocks/sabana/potenciometro.ts ../STV2-PADRE/blocks/sabana/potenciometro.ts`
      no devuelve nada.
- [ ] El bloque aparece en `SmartTEAM 5 → SENSORES`, amarillo `#FFB800`, texto
      `Potenciómetro │ en pin P0`.
- [ ] Girando el potenciómetro el valor cambia de forma continua en **0–1023**;
      al mínimo tiende a 0, al máximo a 1023.
- [ ] Funciona en los 4 puertos — verificar explícitamente el **puerto 3** (pin P8).
- [ ] El proyecto compila.

### Prueba

```ts
basic.forever(function () {
    basic.showNumber(bloques.potenciometro(SabanaPuerto.P0))
    basic.pause(300)
})
```

---

## 4. Riesgos

| Riesgo | Detalle |
|---|---|
| **Reescribir en vez de copiar** | Si el archivo no sale idéntico al de PADRE, las dos extensiones divergen y el mantenimiento se duplica. Usar `diff` para verificar. |
| **Conflicto de modo de pin** | Si otro bloque hizo `digitalWritePin` sobre el mismo puerto antes, la lectura analógica puede quedar pegada. Regla del manual: **un puerto, un componente**. |
| **Escala 0–1023** | Cruda, igual que el proveedor. Convertirla a 0–100 % sería cambio de diseño → otra misión. |

---

<!-- ═══════════════════════════ FIN MISIÓN M01 ═══════════════════════════ -->
<!-- Fin de M01. Siguiente: M02 — Sensor de Luz. -->
