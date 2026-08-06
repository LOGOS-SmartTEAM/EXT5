# EXT5 - SmartTEAM 5

Extensión MakeCode para SmartTEAM 5 (micro:bit).

## Uso como extensión

1. Abre [makecode.microbit.org](https://makecode.microbit.org/)
2. Crea un **Nuevo proyecto**
3. Ve a **Extensiones** (icono de engranaje)
4. Pega la URL del repositorio de GitHub:
   `https://github.com/bscelza-logos/SmartTEAM_ext5`
5. Confirma la importación

### Actualizar la extensión en un proyecto existente

MakeCode puede cachear extensiones importadas desde GitHub. Si no ves los bloques nuevos:

1. Eliminá la extensión **ext5** en **Extensiones**.
2. Volvé a importar la URL de GitHub.

## Simulador y conexión USB

**El simulador y WebUSB son cosas distintas.**

| Función | Qué usa | Cuándo |
|---------|---------|--------|
| Simulador (micro:bit virtual) | JavaScript en el navegador | Siempre, sin cable |
| micro:bit físico | WebUSB (MakeCode lo gestiona) | Al descargar o emparejar |

### Si el simulador no carga (spinner infinito)

1. Recarga la página o colapsa y vuelve a abrir el panel del simulador (flecha junto a la barra).
2. Pulsa **Reiniciar** en los controles del simulador.
3. Alterna entre **Bloques** y **JavaScript** para forzar una recarga.
4. Revisa la consola del navegador (F12 → Consola) por errores de compilación.
5. Si estás en red escolar/empresa, pide desbloquear los dominios del simulador MakeCode.

### WebUSB (micro:bit físico) — requisitos

Según la [especificación WebUSB](https://wicg.github.io/webusb/):

- **Contexto seguro**: usar `https://makecode.microbit.org` (HTTPS).
- **Navegador compatible**: Chrome, Edge u Opera (Chrome 61+). Firefox y Safari no soportan WebUSB.
- **Gestión del usuario**: emparejar requiere un clic (MakeCode llama a `requestDevice()`).
- **Cable USB de datos** (no solo carga).
- **Firmware DAPLink** actualizado en la micro:bit.

Esta extensión no implementa WebUSB; lo hace MakeCode al pulsar **Descargar** o **Emparejar**.

---

## Bloques disponibles

Una sola categoría **SmartTEAM 5** (color `#EF506D`, icono Font Awesome
`\uf1b3`). El diseño (textos, colores, `blockId`, enums) es una copia
literal del subconjunto equivalente de `STV2-PADRE`, la extensión de
referencia del equipo.

| Group | Bloques | Color |
|-------|---------|-------|
| **SENSORES** | Ultrasonido (I2C) · Botón (GPIO) · DHT11 (I2C) · Sensor de Luz (GPIO) · Potenciómetro (GPIO) | `#35BFE9` I2C / `#FFB800` GPIO |
| **SALIDAS** | LED · Tira RGB (encender 6 LEDs / ajustar R-G-B / apagar todos) | `#FFB800` / `#35BFE9` |
| **PANTALLAS** | OLED (escribir texto / borrar) | `#35BFE9` |
| **MOTORES** | Servo · Motor multicolor (individual, por color) | `#FFB800` / `#35BFE9` |
| **MOVIMIENTO** | Movimiento simple · por distancia (cm) · girar (ángulo) | `#35BFE9` |
| **ESPECIAL** | Guardar / Traducir / Borrar mensaje MORSE · Mensaje MORSE · Mensaje TRADUCIDO | `#9C27B0` |

De Botón y Ultrasonido solo se incluyó el bloque redondo (reporter numérico);
PADRE también define una variante lógica (hexágono) que queda fuera de esta
extensión.

### ⚠️ Los bloques MORSE (group ESPECIAL) son placeholders

Los 5 bloques de Morse todavía **no tienen lógica interna real** — son
visuales, a la espera de que se defina el codificador/decodificador
definitivo en `STV2-PADRE`. No usan el Botón A todavía.

## Estructura del proyecto

```
EXT5/
├── blocks/
│   ├── categorias/bloques.ts   # categoría SmartTEAM 5 (nombre, color, icono, groups)
│   └── sabana/                 # un archivo .ts por componente
├── main.ts
├── main.blocks
├── pxt.json
└── test.ts
```

## Editar esta extensión

1. En MakeCode, usa **Importar** → **Importar URL**
2. Pega la URL del repositorio de GitHub
3. Edita los bloques o el código y sincroniza con GitHub

## Licencia

MIT
