/**
 * PUERTOS GPIO SmartTEAM4 — referencia (no compilado)
 *
 * Cada puerto expone dos pines físicos: Pin 1 (trig/señal) y Pin 2 (echo/señal única).
 * Los bloques muestran P1–P6; el mapeo a pines reales está en blocks/smartteam4/puertos.ts
 *
 * Regla de uso:
 * - Componente de 1 pin (LED, botón): usa SIEMPRE el Pin 2 del puerto.
 * - Componente de 2 pines (ultrasónico): Pin 1 = TRIG, Pin 2 = ECHO.
 * - Componentes I2C (motores, OLED): NO usan puerto, van por bus I2C.
 */

const PUERTOS_GPIO = {
    P1: { trig: 13, signal: 0, echo: 0 },
    P2: { trig: 14, signal: 1, echo: 1 },
    P3: { trig: 15, signal: 2, echo: 2 },
    P4: { trig: 7, signal: 8, echo: 8 },
    P5: { trig: 9, signal: 12, echo: 12 },
    P6: { trig: 10, signal: 16, echo: 16 },
} as const;

/** Pin único para botón y LED por puerto (siempre el Pin 2) */
const PUERTO_GPIO_SIGNAL: Record<keyof typeof PUERTOS_GPIO, number> = {
    P1: 0,
    P2: 1,
    P3: 2,
    P4: 8,
    P5: 12,
    P6: 16,
};

/** Par trig + echo para ultrasónico por puerto (orden: trig = Pin 1, echo = Pin 2) */
const PUERTO_ULTRASONICO: Record<keyof typeof PUERTOS_GPIO, { trig: number; echo: number }> = {
    P1: { trig: 13, echo: 0 },
    P2: { trig: 14, echo: 1 },
    P3: { trig: 15, echo: 2 },
    P4: { trig: 7, echo: 8 },
    P5: { trig: 9, echo: 12 },
    P6: { trig: 10, echo: 16 },
};
