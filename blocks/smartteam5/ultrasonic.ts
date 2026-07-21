/**
 * Sensor ultrasónico I2C — SmartTEAM5 / subcategoría Sensores L5
 * Conectado por bus I2C (sin puerto configurable)
 */

namespace ext5_smartteam5 {

    // ── Constantes I2C — ajustar según el módulo real ────────────────
    // Dirección I2C del sensor ultrasónico
    // RCWL-9620 / Grove I2C ultrasónico: 0x57 (87)
    // Cambiar si el escaneo I2C devuelve otra dirección
    const ULTRASONIC_I2C_ADDR = 87      // 0x57

    // Byte de comando para iniciar medición
    // RCWL-9620: 0x01
    const ULTRASONIC_CMD_TRIGGER = 0x01

    // Tiempo de espera tras el trigger en ms
    // RCWL-9620: 50ms
    const ULTRASONIC_WAIT_MS = 50

    // ── Lectura interna ──────────────────────────────────────────────

    function medirI2CCm(): number {
        // Enviar comando de trigger
        let trigBuf = pins.createBuffer(1)
        trigBuf[0] = ULTRASONIC_CMD_TRIGGER
        pins.i2cWriteBuffer(ULTRASONIC_I2C_ADDR, trigBuf)

        // Esperar medición
        basic.pause(ULTRASONIC_WAIT_MS)

        // Leer 2 bytes: distancia en mm (UInt16 big-endian)
        let data = pins.i2cReadBuffer(ULTRASONIC_I2C_ADDR, 2)
        const mm = (data[0] << 8) | data[1]
        return Math.round(mm / 10)
    }

    // ── Bloques públicos ─────────────────────────────────────────────

    /**
     * Lee la distancia en centímetros del sensor ultrasónico I2C.
     */
    //% blockId=ext5_ultrasonic_sensor
    //% block="Ultrasonido en el puerto IIC"
    //% group="Sensores L5" color="#34c2eb" weight=10 blockGap=8
    export function ext5UltrasonicCm(): number {
        return medirI2CCm()
    }
}
