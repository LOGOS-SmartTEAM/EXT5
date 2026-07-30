# SmartTEAM 5 (EXT5) — Índice maestro de misiones

Documento de contexto. **No es una misión.** Cursor debe leerlo completo antes de
ejecutar cualquier misión y volver acá si se pierde.

---

## 1. Qué estamos haciendo

Convertir el repo `LOGOS-SmartTEAM/EXT5` en una réplica de
`LOGOS-SmartTEAM/STV2-PADRE`, recortada a 15 bloques, más los 3 bloques de código
Morse que ya existían en EXT5.

| | Valor |
|---|---|
| **Repo objetivo** | `LOGOS-SmartTEAM/EXT5` (se edita) |
| **Nombre visible** | `SmartTEAM 5` |
| **Color de categoría** | `#EF506D` |
| **Icono** | `\uf1b3` (el de PADRE y EXT4) |
| **Namespace** | `bloques` |
| **Prefijo de `blockId`** | `sabana_` |
| **Carpeta de bloques** | `blocks/sabana/` |
| **Total de bloques** | **18** (15 de PADRE + 3 de Morse) |
| **Groups** | 6 — `SENSORES` `SALIDAS` `MOVIMIENTO` `MOTORES` `PANTALLAS` `ESPECIAL` |

---

## 2. Regla maestra

> **El diseño de PADRE es intocable.** Textos de bloque, colores, `weight`,
> `blockGap`, groups, `blockId`, nombres de enum, etiquetas de desplegable, rangos
> `min`/`max`/`defl` y forma del bloque se copian **carácter por carácter**.
>
> Lo que se importa desde otras extensiones es **únicamente el cuerpo de las
> funciones**.
>
> Excepciones: solo donde el hardware físicamente no puede cumplir lo que el texto
> promete, y todas están registradas en la sección 6 de este documento.

---

## 3. Repos de referencia

| Repo | Rol |
|---|---|
| `LOGOS-SmartTEAM/EXT5` | **objetivo** — se edita |
| `LOGOS-SmartTEAM/STV2-PADRE` | **fuente del diseño y de 4 bloques ya implementados** (commit `347acaf`) |
| `_referencia/` (creado por MD) | drivers rescatados de la versión 2.0.0 de EXT5 |
| `LOGOS-SmartTEAM/original-alex` | drivers del proveedor (sensor de color) |
| `LOGOS-SmartTEAM/EXT4` | referencia cruzada |

---

## 4. Orden de ejecución — 14 misiones

Ejecutar **estrictamente en este orden**. Cada misión termina con el proyecto
compilando.

| # | Misión | Bloques | Fuente del código |
|---|---|---|---|
| **MD** | Demolición total de EXT5 | −13 | — |
| **M00** | Fundación de SmartTEAM 5 | 0 | PADRE |
| **M01** | Potenciómetro | B08 | PADRE — **copia literal** |
| **M02** | Sensor de Luz | B09 | PADRE — **copia literal** |
| **M03** | Botón | B03 | PADRE — **copia literal** |
| **M04** | Ultrasonido | B01 | PADRE — **copia literal** |
| **M05** | DHT11 | B05 | `_referencia/ext5-DTH11.ts` |
| **M06** | Sensor de Color | B06 | `original-alex` veml6040 |
| **M07** | LED | B13 | trivial |
| **M08** | Servo | B19 | `_referencia/ext5-Servo.ts` |
| **M09** | Motor multicolor | B18 | `_referencia/ext5-motorUnico.ts` + `ext5-motores.ts` |
| **M10** | Hélice | B20 | `_referencia/ext5-helice.ts` |
| **M11** | Movimiento | B21 B22 B23 | `_referencia/ext5-motores.ts` |
| **M12** | OLED | B16 B17 | `_referencia/ext5-oled.ts` |

### Dependencias de orden que NO se pueden alterar

- **M00 antes que todo**: declara el namespace, los groups y `SabanaPuerto`.
- **M09 antes de M10**: `helice.ts` usa el enum `SabanaMovimientoMotorUnico`, que
  se declara en `motor_multicolor.ts`.
- **M09 antes de M11**: `movimiento.ts` usa `writeMotor()` y las direcciones I2C
  de los motores, que se declaran en `motor_multicolor.ts`.

---

## 5. Estado final de `pxt.json`

Cada misión **inserta su propio archivo** en el array `files`. Al terminar las 14,
el array tiene que quedar exactamente así:

```json
"files": [
    "main.ts",
    "blocks/categorias/bloques.ts",
    "blocks/sabana/_util.ts",
    "blocks/sabana/puertos.ts",
    "blocks/sabana/mensaje.ts",
    "blocks/sabana/ultrasonido.ts",
    "blocks/sabana/boton.ts",
    "blocks/sabana/dht11.ts",
    "blocks/sabana/color.ts",
    "blocks/sabana/potenciometro.ts",
    "blocks/sabana/luz.ts",
    "blocks/sabana/led.ts",
    "blocks/sabana/oled.ts",
    "blocks/sabana/motor_multicolor.ts",
    "blocks/sabana/servo.ts",
    "blocks/sabana/helice.ts",
    "blocks/sabana/movimiento.ts",
    "main.blocks",
    "README.md"
]
```

> El **orden importa**: en MakeCode un archivo solo puede usar tipos declarados en
> archivos anteriores del array. Este orden respeta el de PADRE y satisface las
> dependencias de la sección 4.

---

## 6. Excepciones al diseño de PADRE

Solo tres, y las tres tienen justificación de hardware o de alcance:

| Bloque | Cambio | Por qué | Misión |
|---|---|---|---|
| `sabana_servo` | `grado.max`: `90` → **`180`** | rango real del componente; ORIGINAL y EXT5 usan 0–180 | M08 |
| `sabana_oled_escribir` | el enum `SabanaColumna16` **se muda** desde `lcd.ts` a `oled.ts` | `lcd.ts` está fuera del alcance de EXT5 y el enum quedaría huérfano. Las 16 etiquetas `0`–`15` no cambian | M12 |
| `mensaje.ts` | `namespace ext5_smartteam5` → **`bloques`**, `group="Especiales L5"` → **`"ESPECIAL"`** | en MakeCode el namespace *es* la categoría; sin el cambio ESPECIAL aparecería como categoría separada | MD |

**Ningún texto fijo de bloque se modifica en ninguna de las tres.**

### Decisiones que se evaluaron y se descartaron

| Decisión evaluada | Resultado |
|---|---|
| Hélice degradada a desplegable ON/OFF | ❌ **cancelada** — el driver de EXT5 maneja un puente H de 2 pines, así que *Rotar a la derecha / rotar a la izquierda / Frenar* es implementable de verdad |
| DHT11 de GPIO a I2C `0x27` | ❌ **cancelada** — el driver de EXT5 es de un hilo por GPIO, con checksum y decimales, netamente superior. El `%puerto` y el color GPIO de PADRE son correctos |
| Botón a `boolean` con operadores recortados | ✅ aplicada en PADRE, pero el bloque lógico quedó fuera del alcance de EXT5 |

---

## 7. Convención de colores

| Color | Significado |
|---|---|
| `#FFB800` | componente **GPIO** |
| `#35BFE9` | componente **I2C** |
| `#9C27B0` | bloques de **ESPECIAL** (Morse) |
| `#EF506D` | color de la **categoría** SmartTEAM 5 |

---

## 8. Mapa del bus I2C

Sin colisiones de dirección:

| Dirección | Componente | Misión |
|---|---|---|
| `0x10` | sensor de color VEML6040 | M06 |
| `0x23` | ultrasónico | M04 |
| `0x3C` | OLED | M12 |
| `0x51` | motor rojo | M09 M11 |
| `0x52` | motor verde | M09 M11 |
| `0x53` | motor azul | M09 |
| `0x54` | motor amarillo | M09 |

---

## 9. Puntos pendientes de verificar en hardware

Ninguno bloquea la ejecución, pero **hay que probarlos en la placa** y anotar el
resultado:

| # | Qué | Misión | Cómo se detecta |
|---|---|---|---|
| 1 | **Dirección I2C del ultrasónico.** PADRE usa `0x23` (del proveedor). EXT4 y la EXT5 anterior usaban `0x57` (RCWL-9620). | M04 | Si a 10 cm no lee ~100, la dirección está mal. M04 documenta cómo migrar. |
| 2 | **Índices del enum del DHT11.** | M05 | Soplar aire caliente debe mover la temperatura, no la humedad. |
| 3 | **Pines IN2 del puente H de la hélice** (`P13/P14/P15/P7`). | M10 | Si un sentido no gira, el pin IN2 está mal. |
| 4 | **`RPM_A_VEL_100 = 150`** — constante estimada, no medida. | M11 | Afecta la precisión de `por %cm cm` y `ángulo de %angulo`. M11 trae el procedimiento de calibración. |
| 5 | **Escala de los canales del sensor de color.** Se normalizó a 0–255. | M06 | Reversible en una constante. |
