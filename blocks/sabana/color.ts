namespace bloques {

    // ── Constantes I2C del sensor de color VEML6040 ──────────────────
    // Verificado en ORIGINAL/block/veml6040.ts
    const VEML6040_ADDR = 0x10      // 16
    const VEML_REG_CONF = 0x00
    const VEML_REG_RED = 0x08
    const VEML_REG_GREEN = 0x09
    const VEML_REG_BLUE = 0x0A
    const VEML_REG_WHITE = 0x0B
    const VEML_IT_320MS = 0x30      // tiempo de integración 320 ms
    const VEML_AF_AUTO = 0x00
    const VEML_SD_ENABLE = 0x00

    // Mínimo entre lecturas reales del sensor, en ms. Coincide con el
    // tiempo de integración: pedir más rápido no aporta datos nuevos.
    const VEML_READ_INTERVAL_MS = 320

    // Escala máxima del registro de 16 bits del sensor.
    const VEML_FULL_SCALE = 65535

    // ── Estado interno ───────────────────────────────────────────────
    let _vemlInit = false
    let _cacheR = 0
    let _cacheG = 0
    let _cacheB = 0
    let _cacheW = 0
    let _lastRead = 0

    export enum SabanaColorCanal {
        //% block="Rojo"
        Rojo = 0,
        //% block="Verde"
        Verde = 1,
        //% block="Azul"
        Azul = 2,
    }

    // Configura el sensor: tiempo de integración 320 ms, modo automático.
    // El tercer argumento false SÍ emite condición de stop (a diferencia
    // de readReg). No cambiarlo.
    function vemlSetConfig(): void {
        let buf = pins.createBuffer(3)
        buf[0] = VEML_REG_CONF
        buf[1] = VEML_IT_320MS | VEML_AF_AUTO | VEML_SD_ENABLE
        buf[2] = 0
        pins.i2cWriteBuffer(VEML6040_ADDR, buf, false)
    }

    // Inicialización automática. PADRE no tiene bloque de init a propósito:
    // el sensor se inicializa solo en la primera lectura.
    function vemlEnsureInit(): void {
        if (!_vemlInit) {
            vemlSetConfig()
            basic.pause(VEML_READ_INTERVAL_MS)   // espera de integración
            _vemlInit = true
        }
    }

    // Lee un registro de 16 bits del sensor.
    // OJO: es LITTLE-endian (data[0] | data[1] << 8), al revés que el
    // ultrasónico. El `true` del write es un repeated start: obligatorio.
    function vemlReadReg(reg: number): number {
        let regBuf = pins.createBuffer(1)
        regBuf[0] = reg
        pins.i2cWriteBuffer(VEML6040_ADDR, regBuf, true)
        basic.pause(5)
        let data = pins.i2cReadBuffer(VEML6040_ADDR, 2, false)
        return data[0] | (data[1] << 8)
    }

    // Refresca el caché de los 4 canales, con throttle de 320 ms.
    // El canal blanco (W) no se expone como bloque, pero se lee porque
    // participa de la guarda de lectura nula.
    function vemlUpdate(): void {
        vemlEnsureInit()

        const now = control.millis()
        if (now - _lastRead < VEML_READ_INTERVAL_MS) return

        const r = vemlReadReg(VEML_REG_RED)
        const g = vemlReadReg(VEML_REG_GREEN)
        const b = vemlReadReg(VEML_REG_BLUE)
        const w = vemlReadReg(VEML_REG_WHITE)

        // Guarda contra glitch del bus: una lectura toda en cero no pisa
        // el caché con valores falsos.
        if (r == 0 && g == 0 && b == 0 && w == 0) return

        _cacheR = r
        _cacheG = g
        _cacheB = b
        _cacheW = w
        _lastRead = now
    }

    // Normaliza el registro de 16 bits a 0-255 (decisión J).
    // Para volver al valor crudo de 16 bits, reemplazar por Math.round(crudo).
    function vemlNormalizar(crudo: number): number {
        return _limit255(crudo * 255 / VEML_FULL_SCALE)
    }

    /**
     * STV2-4 — Sensor de color VEML6040 conectado por I2C (0x10).
     *
     * Devuelve la intensidad del canal elegido, normalizada a 0-255 con la
     * misma escala que readWhiteValue() de ORIGINAL.
     *
     * El sensor se inicializa solo en la primera lectura: PADRE no tiene
     * bloque de init a propósito.
     *
     * Las lecturas reales están limitadas a una cada 320 ms (el tiempo de
     * integración del sensor). Entre medio se devuelve el valor cacheado,
     * así que llamarlo dentro de un forever es seguro.
     *
     * Origen del código: ORIGINAL/block/veml6040.ts. Los canales R/G/B
     * existían solo como caché interno (cacheR/G/B) y no estaban expuestos
     * como bloque; esta función los expone.
     *
     * @param canal canal a leer, eg: SabanaColorCanal.Rojo
     */
    //% blockId=sabana_color
    //% block="Intensidad de color │ %canal en pin I2C"
    //% group="SENSORES" color="#35BFE9" weight=85 blockGap=8
    export function colorSensor(canal: SabanaColorCanal): number {
        vemlUpdate()
        switch (canal) {
            case SabanaColorCanal.Rojo: return vemlNormalizar(_cacheR)
            case SabanaColorCanal.Verde: return vemlNormalizar(_cacheG)
            case SabanaColorCanal.Azul: return vemlNormalizar(_cacheB)
            default: return 0
        }
    }
}
