<!-- ═══════════════════════════ INICIO MISIÓN M11 ═══════════════════════════ -->
<!-- Cursor: ejecutá SOLO esta misión. Requiere M00 y M09 (usa _writeMotor y
     las direcciones _MOTOR_ROJO / _MOTOR_VERDE de motor_multicolor.ts).
     Son 3 bloques en un solo archivo.                                       -->

# MISIÓN M11 — Movimiento del robot (B21 · B22 · B23)

- **Repo objetivo:** `EXT5` · **Archivo a crear:** `blocks/sabana/movimiento.ts`
- **Diseño:** `STV2-PADRE/blocks/sabana/movimiento.ts` (hoy son 3 stubs `// TODO`)
- **Código:** `_referencia/ext5-motores.ts`
- **Depende de:** M00, **M09** (`_writeMotor`, `_MOTOR_ROJO`, `_MOTOR_VERDE`)
- **Estado:** ⬜ pendiente

---

## 1. Confirmación de CATEGORÍAS, TEXTOS y VARIABLES

Los tres bloques van al group **`MOVIMIENTO`**, color **`#35BFE9`** (I2C), y **ninguno
tiene botón `+`**: los parámetros son todos obligatorios.

### B21 — movimiento simple

| Propiedad | Valor |
|---|---|
| `blockId` | `sabana_movimiento_simple` |
| **Texto** | `%movimiento │ Velocidad %velocidad` |
| `weight` / `blockGap` | `100` / `8` |
| `movimiento` | `SabanaMovimiento` — `Avanzar` / `Retroceder` / `Girar a la Izquierda` / `Girar a la Derecha` / `Frenar` |
| `velocidad` | `min=0` `max=100` `defl=50` |

### B22 — movimiento por distancia

| Propiedad | Valor |
|---|---|
| `blockId` | `sabana_movimiento_cm` |
| **Texto** | `%movimiento │ Velocidad %velocidad por %cm cm` |
| `weight` / `blockGap` | `90` / `8` |
| `movimiento` | `SabanaAvanceRetroceso` — **solo** `Avanzar` / `Retroceder` |
| `velocidad` | `min=0` `max=100` `defl=50` |
| `cm` | `min=1` `max=500` `defl=10` |

### B23 — giro por ángulo

| Propiedad | Valor |
|---|---|
| `blockId` | `sabana_movimiento_girar` |
| **Texto** | `%direccion │ Velocidad %velocidad ángulo de %angulo` |
| `weight` / `blockGap` | `80` / `8` |
| `direccion` | `SabanaDireccionGiro` — `Girar a la izquierda` / `Girar a la derecha` |
| `velocidad` | `min=0` `max=100` `defl=50` |
| `angulo` | `min=0` `max=360` `defl=90` |

> ✅ **Cero cambios de diseño.** Los tres enums y los tres textos vienen de PADRE
> tal cual, incluidas las mayúsculas irregulares (`Girar a la Izquierda` con I
> mayúscula en `SabanaMovimiento`, pero `Girar a la izquierda` con i minúscula en
> `SabanaDireccionGiro`). **No "corregir" esa inconsistencia.**

---

## 2. 🚩 Diferencias con la versión anterior de EXT5

Los tres bloques existían en EXT5 con otra forma. **Manda PADRE.**

| | EXT5 anterior | **PADRE (el que vale)** |
|---|---|---|
| Botón `+` | sí (`\|\|` + `expandableArgumentMode`) | ❌ **no** — parámetros obligatorios |
| Texto de B21 | `Motores %movimiento \|\| Velocidad %velocidad` | `%movimiento │ Velocidad %velocidad` |
| Texto de B22 | `Motores %movimiento por %cm cm \|\| Velocidad %velocidad` | `%movimiento │ Velocidad %velocidad por %cm cm` |
| Orden de B22 | `(movimiento, cm, velocidad)` | 🔶 **`(movimiento, velocidad, cm)`** |
| Texto de B23 | `Girar a la %direccion \|\| ... ángulo de %angulo °` | `%direccion │ Velocidad %velocidad ángulo de %angulo` |
| Enum de B22 | el enum completo de 5 movimientos | 🔶 **`SabanaAvanceRetroceso`**, solo 2 |
| `gridpicker` | sí (`movimiento.fieldEditor="gridpicker"`) | ❌ **no** |

> En B23 la palabra "Girar" es **parte del texto del desplegable**
> (`Girar a la izquierda`), no del texto fijo del bloque. Por eso el texto empieza
> directamente con `%direccion`.

---

## 3. Constantes físicas del robot

De `_referencia/ext5-motores.ts`:

| Constante | Valor | Origen |
|---|---|---|
| Diámetro de rueda | **5,5 cm** (55 mm) | medido |
| Circunferencia de rueda | **17,28 cm** (`π × 5,5`) | calculado |
| Distancia entre ruedas | **12,0 cm** (120 mm) | medido |
| `RPM_A_VEL_100` | **150** | 🚩 **estimado, a calibrar** |

### 🚩 `RPM_A_VEL_100` no está medido

Es las RPM del motor a velocidad 100 después de la caja reductora. El valor `150` es
una **estimación**, y de él dependen directamente la distancia de B22 y el ángulo de
B23. Con el valor mal, el robot avanza más o menos de lo pedido de forma
proporcional.

**Procedimiento de calibración** (heredado de la cabecera de `ext5-motores.ts`):

1. Marcar una rueda con una cinta.
2. Ejecutar `Avanzar │ Velocidad 100 por 100 cm`.
3. Contar cuántas vueltas dio la rueda y medir el tiempo real.
4. `RPM = vueltas × 60000 / tiempo_real_ms`.
5. Escribir el resultado en `RPM_A_VEL_100`.

Atajo práctico: si al pedir 100 cm el robot recorre 80 cm, multiplicar la constante
por `80/100`.

---

## 4. Cinemática: el montaje en espejo

Los dos motores del robot están montados **en espejo**, así que para avanzar tienen
que girar en sentidos opuestos. De `movimientoToSpeeds()` de `_referencia/ext5-motores.ts`:

| Movimiento | Motor ROJO (`0x51`) | Motor VERDE (`0x52`) |
|---|---|---|
| `Avanzar` | `+velocidad` | `−velocidad` |
| `Retroceder` | `−velocidad` | `+velocidad` |
| `Girar a la Derecha` | `−velocidad` | `−velocidad` |
| `Girar a la Izquierda` | `+velocidad` | `+velocidad` |
| `Frenar` | `0` | `0` |

> ⚠️ **Esta es la diferencia con M09.** El bloque de motor individual usa signo
> crudo, sin espejo. Acá el espejo **sí** se aplica, porque los motores se mueven
> juntos como robot.

Cálculo de tiempos:

```
rpm_efectivas = RPM_A_VEL_100 × velocidad / 100

B22 (distancia):  tiempo_ms = (cm × 60000) / (CIRCUNFERENCIA_RUEDA_CM × rpm_efectivas)

B23 (ángulo):     arco_cm   = π × DIST_ENTRE_RUEDAS_CM × angulo / 360
                  tiempo_ms = (arco_cm × 60000) / (CIRCUNFERENCIA_RUEDA_CM × rpm_efectivas)
```

---

## 5. Resultado esperado

Crear `blocks/sabana/movimiento.ts` con este contenido completo:

```ts
namespace bloques {

    // ── Constantes físicas del robot ─────────────────────────────────
    // Origen: _referencia/ext5-motores.ts
    const DIAMETRO_RUEDA_CM = 5.5
    const CIRCUNFERENCIA_RUEDA_CM = 3.14159 * DIAMETRO_RUEDA_CM   // 17.28 cm
    const DIST_ENTRE_RUEDAS_CM = 12.0

    // ── Constante A CALIBRAR con el robot real ───────────────────────
    // RPM del motor a velocidad 100, después de la caja reductora.
    // El valor 150 es una ESTIMACIÓN, no una medición. De él dependen la
    // distancia de sabana_movimiento_cm y el ángulo de sabana_movimiento_girar.
    //
    // Procedimiento de calibración:
    //   1. Marcar una rueda con una cinta
    //   2. Ejecutar "Avanzar | Velocidad 100 por 100 cm"
    //   3. Contar vueltas de la rueda y medir el tiempo real
    //   4. RPM = vueltas * 60000 / tiempo_real_ms
    //
    // Atajo: si al pedir 100 cm el robot recorre 80, multiplicar por 80/100.
    const RPM_A_VEL_100 = 150

    export enum SabanaMovimiento {
        //% block="Avanzar"
        Avanzar = 0,
        //% block="Retroceder"
        Retroceder = 1,
        //% block="Girar a la Izquierda"
        GirarIzquierda = 2,
        //% block="Girar a la Derecha"
        GirarDerecha = 3,
        //% block="Frenar"
        Frenar = 4,
    }

    export enum SabanaAvanceRetroceso {
        //% block="Avanzar"
        Avanzar = 0,
        //% block="Retroceder"
        Retroceder = 1,
    }

    export enum SabanaDireccionGiro {
        //% block="Girar a la izquierda"
        Izquierda = 0,
        //% block="Girar a la derecha"
        Derecha = 1,
    }

    /**
     * Aplica un movimiento a los dos motores del robot.
     *
     * Los motores están montados EN ESPEJO: para avanzar tienen que girar en
     * sentidos opuestos. Por eso Avanzar es (+v, -v) y no (+v, +v).
     *
     * A diferencia de sabana_motor_multicolor (M09), que usa signo crudo, acá
     * el espejo SÍ se aplica: los motores se mueven juntos como robot.
     *
     * Origen: _referencia/ext5-motores.ts -> movimientoToSpeeds() + runDualMotors()
     */
    function aplicarMovimiento(movimiento: SabanaMovimiento, velocidad: number): void {
        let sRojo = 0
        let sVerde = 0

        switch (movimiento) {
            case SabanaMovimiento.Avanzar:
                sRojo = velocidad; sVerde = -velocidad; break
            case SabanaMovimiento.Retroceder:
                sRojo = -velocidad; sVerde = velocidad; break
            case SabanaMovimiento.GirarDerecha:
                sRojo = -velocidad; sVerde = -velocidad; break
            case SabanaMovimiento.GirarIzquierda:
                sRojo = velocidad; sVerde = velocidad; break
            case SabanaMovimiento.Frenar:
                sRojo = 0; sVerde = 0; break
        }

        _writeMotor(_MOTOR_ROJO, sRojo)
        _writeMotor(_MOTOR_VERDE, sVerde)
    }

    // Detiene los dos motores.
    function frenarMotores(): void {
        _writeMotor(_MOTOR_ROJO, 0)
        _writeMotor(_MOTOR_VERDE, 0)
    }

    // Tiempo en ms que hace falta para recorrer una distancia en cm.
    function tiempoParaCm(cm: number, velocidad: number): number {
        const rpmEfectivas = RPM_A_VEL_100 * velocidad / 100
        return (cm * 60000) / (CIRCUNFERENCIA_RUEDA_CM * rpmEfectivas)
    }

    /**
     * STV2-17 — Movimiento simple del robot. Bloque directo, sin botón "+".
     *
     * No frena solo: el robot sigue moviéndose hasta que se le mande Frenar
     * o hasta que termine el programa.
     *
     * @param movimiento dirección, eg: SabanaMovimiento.Avanzar
     * @param velocidad velocidad de 0 a 100, eg: 50
     */
    //% blockId=sabana_movimiento_simple
    //% block="%movimiento │ Velocidad %velocidad"
    //% velocidad.min=0 velocidad.max=100 velocidad.defl=50
    //% group="MOVIMIENTO" color="#35BFE9" weight=100 blockGap=8
    export function movimientoSimple(movimiento: SabanaMovimiento, velocidad: number): void {
        aplicarMovimiento(movimiento, _clamp(velocidad, 0, 100))
    }

    /**
     * STV2-18 — Movimiento por una distancia en cm. Bloque directo, sin
     * botón "+". Solo Avanzar/Retroceder (no incluye giros ni frenar).
     *
     * BLOQUEANTE: espera a que el robot recorra la distancia y después frena
     * solo. La precisión depende de RPM_A_VEL_100, que está sin calibrar.
     *
     * @param movimiento Avanzar o Retroceder, eg: SabanaAvanceRetroceso.Avanzar
     * @param velocidad velocidad de 0 a 100, eg: 50
     * @param cm distancia en centímetros, eg: 10
     */
    //% blockId=sabana_movimiento_cm
    //% block="%movimiento │ Velocidad %velocidad por %cm cm"
    //% velocidad.min=0 velocidad.max=100 velocidad.defl=50
    //% cm.min=1 cm.max=500 cm.defl=10
    //% group="MOVIMIENTO" color="#35BFE9" weight=90 blockGap=8
    export function movimientoCm(movimiento: SabanaAvanceRetroceso, velocidad: number, cm: number): void {
        const v = _clamp(velocidad, 0, 100)
        if (v <= 0 || cm <= 0) return

        const mov = movimiento == SabanaAvanceRetroceso.Avanzar
            ? SabanaMovimiento.Avanzar
            : SabanaMovimiento.Retroceder

        aplicarMovimiento(mov, v)
        basic.pause(tiempoParaCm(cm, v))
        frenarMotores()
    }

    /**
     * STV2-19 — Gira el robot un ángulo determinado. Bloque directo, sin
     * botón "+". La palabra "Girar" es parte del texto del desplegable
     * (SabanaDireccionGiro), no del texto fijo del bloque.
     *
     * BLOQUEANTE: espera a completar el giro y después frena solo.
     * El giro es sobre el eje del robot (las dos ruedas en sentidos
     * opuestos), no un giro con radio.
     *
     * @param direccion sentido del giro, eg: SabanaDireccionGiro.Izquierda
     * @param velocidad velocidad de 0 a 100, eg: 50
     * @param angulo ángulo en grados, eg: 90
     */
    //% blockId=sabana_movimiento_girar
    //% block="%direccion │ Velocidad %velocidad ángulo de %angulo"
    //% velocidad.min=0 velocidad.max=100 velocidad.defl=50
    //% angulo.min=0 angulo.max=360 angulo.defl=90
    //% group="MOVIMIENTO" color="#35BFE9" weight=80 blockGap=8
    export function movimientoGirar(direccion: SabanaDireccionGiro, velocidad: number, angulo: number): void {
        const v = _clamp(velocidad, 0, 100)
        if (v <= 0 || angulo <= 0) return

        // Arco que recorre cada rueda para que el robot gire ese ángulo.
        const arcoCm = 3.14159 * DIST_ENTRE_RUEDAS_CM * angulo / 360

        const mov = direccion == SabanaDireccionGiro.Izquierda
            ? SabanaMovimiento.GirarIzquierda
            : SabanaMovimiento.GirarDerecha

        aplicarMovimiento(mov, v)
        basic.pause(tiempoParaCm(arcoCm, v))
        frenarMotores()
    }
}
```

### Insertar en `pxt.json`

Agregar `"blocks/sabana/movimiento.ts"` **después de** `"blocks/sabana/helice.ts"`.
Es el último archivo de bloques del array.

> ⚠️ El `movimiento.ts` de PADRE tiene un **BOM UTF-8** al principio del archivo.
> **No copiarlo.** El archivo de EXT5 tiene que empezar directamente con
> `namespace bloques {`.

---

## 6. Criterios de aceptación

- [ ] Los **3 bloques** aparecen en `SmartTEAM 5 → MOVIMIENTO`, celeste `#35BFE9`.
- [ ] **Ninguno** tiene botón `+`: todos los parámetros están visibles.
- [ ] Los textos son exactamente los de la sección 1, con el orden de parámetros
      de PADRE (en B22, **velocidad antes que cm**).
- [ ] B22 solo ofrece `Avanzar` y `Retroceder` en su desplegable.
- [ ] B23 ofrece `Girar a la izquierda` y `Girar a la derecha` (minúscula), y el
      texto del bloque **no** repite la palabra "Girar".
- [ ] El archivo **no empieza con BOM**.
- [ ] ⚠️ **`Avanzar` mueve el robot hacia adelante en línea recta.** Si gira en el
      lugar, la tabla del espejo está mal aplicada.
- [ ] `Retroceder` va hacia atrás en línea recta.
- [ ] `Girar a la Derecha` y `Girar a la Izquierda` giran sobre el eje, en
      sentidos opuestos entre sí.
- [ ] `Frenar` detiene el robot.
- [ ] B22 y B23 **frenan solos** al terminar.
- [ ] B22 con `velocidad 0` o `cm 0` no hace nada (no se cuelga).
- [ ] **Medir:** pedir `Avanzar 50 cm` y medir con cinta lo que recorrió. Anotar la
      diferencia para calibrar `RPM_A_VEL_100` (sección 3).
- [ ] El proyecto compila.

### Prueba

```ts
input.onButtonPressed(Button.A, function () {
    bloques.movimientoCm(bloques.SabanaAvanceRetroceso.Avanzar, 50, 50)
})
input.onButtonPressed(Button.B, function () {
    bloques.movimientoGirar(bloques.SabanaDireccionGiro.Derecha, 50, 90)
})
```

Poner el robot en el piso, con espacio. El botón A debe avanzar ~50 cm y frenar;
el botón B debe girar ~90° y frenar.

---

## 7. Riesgos

| Riesgo | Detalle / mitigación |
|---|---|
| **🚩 `RPM_A_VEL_100` sin calibrar** | Afecta a B22 y B23 de forma proporcional. No es un bug: es una constante física que hay que medir. Está documentada en el propio archivo con el procedimiento. |
| **Quitar la negación del espejo** | Si `Avanzar` se implementa como `(+v, +v)`, el robot **gira en el lugar** en vez de avanzar. Es el error más visible de esta misión. |
| **Aplicar el espejo también en M09** | Al revés: el motor individual **no** lleva espejo. Las dos misiones son distintas a propósito. |
| **Ejecutar M11 antes de M09** | No compila: `_writeMotor`, `_MOTOR_ROJO` y `_MOTOR_VERDE` todavía no existen. |
| **El BOM de PADRE** | Si se copia el archivo tal cual con el BOM, algunos compiladores lo tratan como un carácter inválido. Empezar en `namespace`. |
| **Bloques bloqueantes** | B22 y B23 usan `basic.pause()`: durante el movimiento la micro:bit **no responde** a nada más. Es el comportamiento de EXT5 y de PADRE. Documentar en el manual del alumno. |
| **`movimientoSimple` no frena solo** | Es intencional: es el bloque de movimiento continuo. Si el programa termina sin `Frenar`, el robot sigue andando. |
| **Cambiar la irregularidad de las mayúsculas** | `Girar a la Izquierda` (I mayúscula) en `SabanaMovimiento` y `Girar a la izquierda` (i minúscula) en `SabanaDireccionGiro`. Es inconsistente pero es lo que dice PADRE. No unificar. |
| **`_clamp` con velocidad negativa** | Si llega una velocidad negativa desde JavaScript, `_clamp` la lleva a 0 y el robot no se mueve, en vez de moverse al revés. Es la conducta segura. |
| **Precisión del giro** | El cálculo asume que las ruedas no patinan. En piso liso o con el robot cargado, el ángulo real difiere. Es una limitación del método (no hay encoder), no del código. |

---

<!-- ═══════════════════════════ FIN MISIÓN M11 ═══════════════════════════ -->
<!-- Fin de M11. Siguiente: M12 — OLED (última misión). -->
