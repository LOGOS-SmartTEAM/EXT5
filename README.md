# EXT5 — STEAMbit 5

Extensión MakeCode para micro:bit, categoría **STEAMbit 5**. Versión **4.0.0**.

## Cómo agregarla en MakeCode

1. En MakeCode, **Extensiones** → pegar `https://github.com/LOGOS-SmartTEAM/EXT5` y elegirla.
2. Aparece la categoría **STEAMbit 5** en la caja de herramientas.

### Actualizar en un proyecto existente

Los proyectos quedan fijados a la versión con la que se agregó la extensión. Para tener la 4.0.0:
en el Explorador del proyecto (debajo del simulador), actualizar la extensión, o quitarla y volver a agregarla.

## Idiomas

Español, inglés y portugués: los bloques y sus ayudas se muestran en el idioma elegido en MakeCode
(Configuración → Idioma). Cualquier otro idioma muestra inglés.

## Bloques


### SENSORES

| Bloque | Qué hace |
|---|---|
| Botón │ en pin … | Devuelve 1 si el botón está presionado y 0 si está suelto. |
| Potenciómetro │ en pin … | Lee la posición de la perilla (0 a 1023). |
| Sensor de Luz │ en pin … | Mide la luz: 0 = oscuro, 1023 = mucha luz. |
| Ultrasonido │ en pin I2C | Mide la distancia a un objeto en centímetros (0 a 200). |
| … │ en pin I2C | Mide la temperatura (°C) o la humedad (%). |

### SALIDAS

| Bloque | Qué hace |
|---|---|
| LED │ Estado … en pin … | Prende o apaga el LED. |
| LED │ Intensidad … en pin … | Ajusta el brillo del LED: 0 = apagado, 1023 = máximo. |

### MOVIMIENTO

| Bloque | Qué hace |
|---|---|
| … │ Velocidad … | Mueve el robot a la velocidad elegida (0 a 100). |
| … │ Velocidad … por … cm | Avanza o retrocede los centímetros elegidos y se detiene. |
| … │ Velocidad … ángulo de … | Gira el robot los grados elegidos y se detiene. |

### MOTORES

| Bloque | Qué hace |
|---|---|
| Hélice │ … en pin … | Prende o apaga la hélice. |
| Motor │ … … en pin I2C  Velocidad … | Hace girar un motor. Con + elegís la velocidad (0 a 100). |
| Servo │ …° en pin … | Mueve el servo al ángulo elegido (0 a 180°). |

### PANTALLAS

| Bloque | Qué hace |
|---|---|
| OLED │ Escribir … en fila … en columna … en pin I2C | Escribe un texto o un número en la pantalla OLED. |
| OLED │ borrar textos en pin I2C | Borra todo lo escrito en la pantalla OLED. |

### ESPECIAL

| Bloque | Qué hace |
|---|---|
| Guardar mensaje MORSE | Empieza a leer el botón Morse en P0: corto = punto, largo = línea. |
| Mensaje MORSE | El mensaje escrito en puntos y líneas. |
| Traducir mensaje | Traduce el mensaje Morse a letras. |
| Mensaje TRADUCIDO | El mensaje traducido a letras. |
| Borrar MENSAJES | Borra el mensaje Morse y el mensaje traducido. |

## Estructura

```
bloques.ts        ← todos los bloques (un solo archivo), generado desde STV2-PADRE
main.ts           ← solo descripción
test.ts           ← pruebas rápidas (no se incluyen al usar la extensión)
_locales/es, pt   ← traducciones (el código está en inglés)
pxt.json          ← nombre, versión y lista de archivos
```

Los bloques se corrigen en **STV2-PADRE** y se regenera este archivo.

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

## Licencia

MIT
