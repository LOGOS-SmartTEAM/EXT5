/**
 * PUERTOS GPIO SmartTEAM5 — referencia (no compilado)
 *
 * Los bloques muestran P0–P3. El mapeo a pines reales está en
 * blocks/smartteam5/puertos.ts
 *
 * Regla de uso:
 * - Componente de 1 pin (LED, botón): usa el Pin de señal.
 * - Componentes I2C (motores, OLED, ultrasonido): NO usan puerto.
 */

const PUERTOS_GPIO = {
    P0: { signal: 0,  trig: 13, echo: 0  },
    P1: { signal: 1,  trig: 14, echo: 1  },
    P2: { signal: 2,  trig: 15, echo: 2  },
    P3: { signal: 8,  trig: 7,  echo: 8  },
} as const;

const PUERTO_GPIO_SIGNAL: Record<keyof typeof PUERTOS_GPIO, number> = {
    P0: 0,
    P1: 1,
    P2: 2,
    P3: 8,
};
